using System;
using System.Collections.Generic;
using System.Linq;
using System.Data;
using System.Threading.Tasks;
using Oracle.ManagedDataAccess.Client;
using Oracle.ManagedDataAccess.Types;
using Dapper;

namespace ChatAPI.Models.UsersModel
{
    public class UsersRepository
    {

        readonly string connectionString = null;

        public UsersRepository()
        {
            connectionString = " Data Source= localhost:1521/xe; User Id=chatDev; Password=123;";
        }

        public IEnumerable<UsersModel> GetUsers()
        {
            using (OracleConnection db = new OracleConnection(connectionString))
            {
                string sql = "SELECT user_name AS userName, email, " +
                    "role, first_name AS firstName , " +
                    "second_name AS secondName, birth_date AS birthDate " +
                    "FROM ChatUsers";

                db.Open();
                return db.Query<UsersModel>(sql);
            }
        }

        public UsersModel GetUser(int id)
        {
            using (OracleConnection db = new OracleConnection(connectionString))
            {
                string sql = "SELECT user_name AS userName, email, " +
                    "role, first_name AS firstName , " +
                    "second_name AS secondName, birth_date AS birthDate " +
                    "FROM ChatUsers " +
                    "WHERE user_id = :ID";
                var param = new { ID = id };
                db.Open();
                
                return db.Query<UsersModel>(sql, param).FirstOrDefault();
            }
        }

        public int GetUserIdForAuth(string email)
        {
            
            using (OracleConnection db = new OracleConnection(connectionString))
            {
                string sql = "SELECT nvl(user_id, 0) FROM ChatUsers " +
                    "WHERE email = :Email";
                    
                var param = new { Email = email };
                db.Open();

                return db.Query<int>(sql, param).FirstOrDefault();
            }
        }


        public string GetUserPassHashForCompare(string email)
        {
            //select password hash by email then compare password
            using (OracleConnection db = new OracleConnection(connectionString))
            {
                string sql = "SELECT nvl(password, 0) FROM ChatUsers " +
                    "WHERE email = :Email";

                var param = new { Email = email};
                db.Open();

                return db.Query<string>(sql, param).FirstOrDefault();
            }
        }

        public void AddUser(UsersModel user, string password)
        {
            using (OracleConnection db = new OracleConnection(connectionString))
            {
                string sql = "INSERT INTO ChatUsers(user_name, email, password, role, first_name, second_name, birth_date) " +
                    "VALUES(:UserName,:Email ,:Password ,:Role ,:FirstName ,:SecondName , to_date(:BirthDate, \'dd.MM.yyyy\'))";

                
                db.Open();

                db.Execute(sql, new { user.UserName, user.Email, Password = password, user.Role, user.FirstName, user.SecondName, user.BirthDate });
            }
        }

        public void DeleteUser(int id)
        {
            using (OracleConnection db = new OracleConnection(connectionString))
            {
                string sql = "DELETE FROM ChatUsers WHERE user_id = :ID";


                db.Open();

                db.Execute(sql, new { ID = id });
            }
        }


        public void UpdateUserRole(string role, int id)
        {
            using (OracleConnection db = new OracleConnection(connectionString))
            {
                string sql = "UPDATE ChatUsers SET " +
                    "role = :Role " +
                    "WHERE user_id= :Id";
                
                db.Open();

                db.Execute(sql, new { Role = role, Id = id });
            }
        }
    }
}
