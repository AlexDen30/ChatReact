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

        private readonly UsersRepository usersRep;

        public AuthController()
        {
            usersRep = new UsersRepository();
        }

        
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
           
            usersRep.AddUser(data.User, data.Password);

        }

        public class AuthData
        {
            public string Email{ get; set; }

            public string Password{ get; set; }
        }

        public class LoginResponse
        {
            public string RequestResult{ get; set; }
        }

        [HttpPost("login", Name = "AuthUser")]
        public LoginResponse Login([FromBody] AuthData authData)
        {

            int reqData = usersRep.GetUserIdForAuth(authData.Email, authData.Password);
            LoginResponse resp = new LoginResponse();
            

            if (reqData == 0)
            {
                resp.RequestResult = "invalid";
                return resp; 
            }

            Response.Cookies.Append("userId", reqData.ToString());
            resp.RequestResult = "success";

            return resp;
        }

        // not for the client app
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
