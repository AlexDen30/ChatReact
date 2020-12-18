﻿using System;
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

        public string FirstName { get; set; }

        public string SecondName { get; set; }

        public string BirthDate{ get; set; }
    }
}
