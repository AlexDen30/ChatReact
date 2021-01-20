using System;
using System.Collections.Generic;
using System.Linq;
using System.Data;
using System.Threading.Tasks;
using Oracle.ManagedDataAccess.Client;
using Oracle.ManagedDataAccess.Types;
using Dapper;

namespace ChatAPI.Models.KeyAndVectorModel
{
    public class KeyAndVectorRepository : IKeyAndVectorRepository
    {
        string connectionString = null;

        public KeyAndVectorRepository(string dbConnectionString)
        {
            connectionString = dbConnectionString;
        }

        public KeyAndVectorModel GetKeyAndVector() 
        {
            using (OracleConnection db = new OracleConnection(connectionString))
            {
                string sql1 = "SELECT nvl(identify,0) " +
                    "FROM AesInfo WHERE identify = 'true' ";

                db.Open();
                string havingValues = db.Query<string>(sql1).FirstOrDefault();

                if (havingValues == null)
                {
                    KeyAndVectorModel res = new KeyAndVectorModel();
                    return res;
                }

                string sql2 = "SELECT key, iv " +
                    "FROM AesInfo WHERE identify = 'true' ";

                return db.Query<KeyAndVectorModel>(sql2).FirstOrDefault();
            }
        }

        public void SetKeyAndVector(KeyAndVectorModel keyAndVector)
        {
            using (OracleConnection db = new OracleConnection(connectionString))
            {
                string sql = "INSERT INTO AesInfo(key, iv, identify) " +
                    "VALUES(:KEY ,:IV , 'true')";


                db.Open();

                db.Execute(sql, new {keyAndVector.key, keyAndVector.iv });
            }
        }
    }

    
}
