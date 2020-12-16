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

        // GET: api/Auth
        [HttpGet(Name = "GetAllUsers")]
        public IEnumerable<UsersModel> Get()
        {
            return usersRep.GetUsers();
        }

        // GET: api/Auth/5
        [HttpGet("{id}", Name = "GetUser")]
        public UsersModel Get(int id)
        {
            return usersRep.GetUser(id);
        }

        // POST: api/Auth
        [HttpPost(Name ="PostUser")]
        public void Post([FromBody] UsersModel value)
        {
            if(ModelState.IsValid)
            {
                usersRep.AddUser(value);
            }
        }

        // PUT: api/Auth/5
        [HttpPut("{id}", Name ="UpdateUser")]
        public void Put(int id, [FromBody] string value)
        {
            
            if (value == "user" || value == "admin")
            {
                usersRep.UpdateUserRole(value, id);
            }
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}", Name = "DeleteUser")]
        public void Delete(int id)
        {
            usersRep.DeleteUser(id);
        }
    }
}
