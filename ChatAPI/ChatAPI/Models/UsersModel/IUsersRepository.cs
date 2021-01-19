using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatAPI.Models.UsersModel
{
    public interface IUsersRepository
    {
        public IEnumerable<UsersModel> GetUsers();

        public UsersModel GetUser(int id);

        public int GetUserIdForAuth(string email);

        public string GetUserRoleById(int id);

        public string GetUserPassHashForCompare(string email);

        public void AddUser(UsersModel user, string password);

        public void DeleteUser(int id);

        public void UpdateUserRole(string role, int id);
    }
}
