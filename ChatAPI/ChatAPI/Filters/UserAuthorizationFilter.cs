using ChatAPI.Models.UsersModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatAPI.Filters
{
    public class UserAuthorizationFilter : IActionFilter
    {

        private readonly IUsersRepository usersRep;

        public UserAuthorizationFilter(IUsersRepository usersR)
        {
            usersRep = usersR;
        }
        public void OnActionExecuting(ActionExecutingContext context)
        {
            string role = usersRep.GetUserRoleById(Convert.ToInt32(context.HttpContext.Request.Cookies["userId"]));
            if (!(role == "admin" || role == "user"))
            {
                context.Result = new BadRequestObjectResult("Incorrect role, access denied");
                return;
            }
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {

        }
    }
}
