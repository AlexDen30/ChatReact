using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ChatAPI.Models.UsersModel;

namespace ChatAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {

        private readonly IUsersRepository usersRep;

        public AuthController(IUsersRepository usersR)
        {
            usersRep = usersR;
        }

        //not for the client app
        [HttpGet(Name = "GetAllUsers")]
        public IEnumerable<UsersModel> Get()
        {
            return usersRep.GetUsers();
        }

        
        [HttpGet("me", Name = "GetUserData")]
        public UsersModel GetUserData()
        {
            int id = Convert.ToInt32(Request.Cookies["userId"]);

            return usersRep.GetUser(id);
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
           
            usersRep.AddUser(data.User, data.Password);

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
                return BadRequest();
            }             

            int reqData = usersRep.GetUserIdForAuth(authData.Email);
           
            Response.Cookies.Append("userId", reqData.ToString());

            return Ok();
        }

        [HttpDelete("logout", Name = "LogoutUser")]
        public void Logout()
        {
            Response.Cookies.Delete("userId");
        }

        // not for the client app
        [HttpPut("{id}", Name ="UpdateUser")]
        public void Put(int id, [FromBody] string value)
        {
            
            if (value == "user" || value == "admin")
            {
                usersRep.UpdateUserRole(value, id);
            }
        }

        // not for the client app
        [HttpDelete("{id}", Name = "DeleteUser")]
        public void Delete(int id)
        {
            usersRep.DeleteUser(id);
        }
    }
}
