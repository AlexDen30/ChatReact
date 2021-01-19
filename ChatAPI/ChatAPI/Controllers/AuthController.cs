using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ChatAPI.Models.UsersModel;
using Microsoft.Extensions.Logging;
using ChatAPI.UsersDataEncrAndDec;
using System.Text;
using ChatAPI.Models.KeyAndVectorModel;
using System.Security.Cryptography;

namespace ChatAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ILogger _logger;
        private readonly IUsersRepository usersRep;
        private readonly IKeyAndVectorRepository keyAndVectorRep;

        public AuthController(IUsersRepository usersR, ILogger<AuthController> logger, IKeyAndVectorRepository kvR)
        {
            _logger = logger;
            usersRep = usersR;
            keyAndVectorRep = kvR;
        }

        //not for the client app
        [HttpGet(Name = "GetAllUsers")]
        public IEnumerable<UsersModel> Get()
        {
            _logger.LogInformation("Start : Getting users");
            

            return usersRep.GetUsers();
        }

        
        [HttpGet("me", Name = "GetUserData")]
        public UsersModel GetUserData()
        {
            int id = Convert.ToInt32(Request.Cookies["userId"]);

            _logger.LogInformation("Got user id : " + id.ToString());

            UsersModel fromDb = usersRep.GetUser(id);

            KeyAndVectorModel kav = keyAndVectorRep.GetKeyAndVector();
            

            byte[] arrFirstName = Encoding.UTF8.GetBytes(fromDb.FirstName);
            byte[] arrSecondName = Encoding.UTF8.GetBytes(fromDb.SecondName);
            fromDb.FirstName = AesEncrDecr.DecryptStringFromBytes_Aes(arrFirstName, kav.key, kav.iv);
            fromDb.SecondName = AesEncrDecr.DecryptStringFromBytes_Aes(arrSecondName, kav.key, kav.iv);

            return fromDb;
        }


        public class DataForSignUp
        {
            public UsersModel User{ get; set; }

            public string Password{ get; set; }
        }
        
        [HttpPost("signup",Name ="PostUser")]
        public void PostUser([FromBody] DataForSignUp data)
        {
            data.User.Role = "user";

            data.Password = BCrypt.Net.BCrypt.HashPassword(data.Password);

            KeyAndVectorModel kav = keyAndVectorRep.GetKeyAndVector();
            if (kav.key == null & kav.iv == null)
            {
                Aes myAes = Aes.Create();
                kav.key = myAes.Key;
                kav.iv = myAes.IV;
                keyAndVectorRep.SetKeyAndVector(kav);
            }

            data.User.FirstName = Encoding.UTF8.GetString(AesEncrDecr.EncryptStringToBytes_Aes(data.User.FirstName, kav.key, kav.iv));
            data.User.SecondName = Encoding.UTF8.GetString((AesEncrDecr.EncryptStringToBytes_Aes(data.User.SecondName, kav.key, kav.iv)));
            

            usersRep.AddUser(data.User, data.Password);

            _logger.LogInformation("User with name " + data.User.UserName + " Signed up");

        }

        public class AuthData
        {
            public string Email{ get; set; }

            public string Password{ get; set; }
        }



        [HttpPost("login", Name = "AuthUser")]
        public IActionResult Login([FromBody] AuthData authData)
        {
            string passwordHash = usersRep.GetUserPassHashForCompare(authData.Email);

            if (passwordHash == "0" || !BCrypt.Net.BCrypt.Verify(authData.Password, passwordHash))
            {
                _logger.LogInformation("User with email " + authData.Email + " Signed in");
                return BadRequest();
            }             

            int reqData = usersRep.GetUserIdForAuth(authData.Email);
           
            Response.Cookies.Append("userId", reqData.ToString());

            _logger.LogInformation("User with email " + authData.Email + " Signed in");
            return Ok();
        }

        [HttpDelete("logout", Name = "LogoutUser")]
        public void Logout()
        {
            _logger.LogInformation("User with id " + Request.Cookies["userId"] + " loged out");
            Response.Cookies.Delete("userId");
        }

        // not for the client app
        [HttpPut("{id}", Name ="UpdateUser")]
        public void Put(int id, [FromBody] string value)
        {
            
            if (value == "user" || value == "admin")
            {
                usersRep.UpdateUserRole(value, id);
                _logger.LogInformation("User with id " + id.ToString() + " role is " + value);
            }
        }

        // not for the client app
        [HttpDelete("{id}", Name = "DeleteUser")]
        public void Delete(int id)
        {
            _logger.LogInformation("User with id " + id.ToString() + " deleted");
            usersRep.DeleteUser(id);
        }
    }
}
