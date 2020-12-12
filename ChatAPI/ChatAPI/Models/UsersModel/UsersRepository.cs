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

        string connectionString = null;

        public UsersRepository()
        {
            connectionString = " Data Source= localhost:1521/xe; User Id=chatDev; Password=123;";
        }

        public IEnumerable<UsersModel> GetUsers()
        {
            using (OracleConnection db = new OracleConnection(connectionString))
            {
                string sql = "SELECT user_id AS userId, user_name AS userName, email, " +
                    "login, password, role, first_name AS firstName , " +
                    "second_name AS secondName, birth_date AS birthDate " +
                    "FROM ChatUsers";

                db.Open();
                //var sa = db.State.ToString();
                return db.Query<UsersModel>(sql);
            }
        }

        public UsersModel GetUser(int id)
        {
            using (OracleConnection db = new OracleConnection(connectionString))
            {
                string sql = "SELECT user_id AS userId, user_name AS userName, email, " +
                    "login, password, role, first_name AS firstName , " +
                    "second_name AS secondName, birth_date AS birthDate " +
                    "FROM ChatUsers " +
                    "WHERE user_id = :ID";
                var param = new { ID = id };
                db.Open();
                
                return db.Query<UsersModel>(sql, param).FirstOrDefault();
            }
        }


        public void AddUser(UsersModel user)
        {
            using (OracleConnection db = new OracleConnection(connectionString))
            {
                string sql = "INSERT INTO ChatUsers(user_name, email, login, password, role, first_name, second_name, birth_date) " +
                    "VALUES(:UserName,:Email ,:Login ,:Password ,:Role ,:FirstName ,:SecondName , to_date(:BirthDate, \'dd.MM.yyyy\'))";

                
                db.Open();

                db.Execute(sql, user);
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
