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
        [HttpGet]
        public IEnumerable<UsersModel> Get()
        {
            return usersRep.GetUsers();
        }

        // GET: api/Auth/5
        [HttpGet("{id}", Name = "Get")]
        public UsersModel Get(int id)
        {
            return usersRep.GetUser(id);
        }

        // POST: api/Auth
        [HttpPost]
        public void Post([FromBody] UsersModel value)
        {
            if(ModelState.IsValid)
            {
                usersRep.AddUser(value);
            }
        }

        // PUT: api/Auth/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
            
            if (value == "user" || value == "admin")
            {
                usersRep.UpdateUserRole(value, id);
            }
        }

        // DELETE: api/ApiWithActions/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            usersRep.DeleteUser(id);
        }
    }
}
