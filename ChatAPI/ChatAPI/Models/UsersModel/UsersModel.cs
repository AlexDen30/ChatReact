using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ChatAPI.Models.UsersModel
{
    public class UsersModel
    {
        
        public string UserName { get; set;}

        public string Email { get; set; }

        public string Role { get; set; }

        public byte[] FirstName { get; set; }

        public byte[] SecondName { get; set; }

        public byte[] BirthDate { get; set; }
    }
}
