using System;
using System.Collections.Generic;
using System.Linq;
using System.Data;
using System.Threading.Tasks;
using Oracle.ManagedDataAccess.Client;
using Oracle.ManagedDataAccess.Types;
using Dapper;

namespace ChatAPI.Models.ChannelsModel
{
    public class ChannelsRepository
    {
        string connectionString = null;

        public ChannelsRepository()
        {
            connectionString = " Data Source= localhost:1521/xe; User Id=chatDev; Password=123;";
        }

        public IEnumerable<ChannelsModel> GetUserChannels(int userId)
        {
            using (OracleConnection db = new OracleConnection(connectionString))
            {
                string sql = "SELECT channel_id AS ChannelId, name, theme, " +
                    "creation_time AS CreationTime, count_of_messages AS CountOfMessages " +
                    "FROM Channels WHERE channel_id IN " +
                    "(SELECT channel_id FROM User_has_channel WHERE user_id = :ID)";

                db.Open();
                return db.Query<ChannelsModel>(sql, new { ID = userId });
            }
        }

        public IEnumerable<ChannelsModel> GetChannels()
        {
            using (OracleConnection db = new OracleConnection(connectionString))
            {
                string sql = "SELECT channel_id AS ChannelId, name, theme, " +
                    "creation_time AS CreationTime, count_of_messages AS CountOfMessages " +
                    "FROM Channels ";

                db.Open();
                return db.Query<ChannelsModel>(sql);
            }
        }

        public ChannelsModel GetChannel(int channelId)
        {
            using (OracleConnection db = new OracleConnection(connectionString))
            {
                string sql = "SELECT channel_id AS ChannelId, name, theme, " +
                    "creation_time AS CreationTime, count_of_messages AS CountOfMessages " +
                    "FROM Channels WHERE channel_id = :ID ";

                db.Open();
                return db.Query<ChannelsModel>(sql, new { ID = channelId }).FirstOrDefault();
            }
        }

        public int AddChannel(string name, string theme, string creationTime)
        {
            using (OracleConnection db = new OracleConnection(connectionString))
            {
                string sql = "INSERT INTO Channels(name, theme, creation_time) " +
                    "VALUES(:Name,:Theme, to_date(:CreationTime, \'dd.MM.yyyy hh24:mi:ss\'))";


                db.Open();

                db.Execute(sql, new { Name = name, Theme = theme, CreationTime = creationTime });

                return db.Query<int>("SELECT channel_id FROM Channels WHERE creation_time = to_date(:CRtime, \'dd.MM.yyyy hh24:mi:ss\') ", new { CRtime = creationTime }).FirstOrDefault();
            }
        }

        public void DeleteChannel (int id)
        {
            using (OracleConnection db = new OracleConnection(connectionString))
            {
                string sql = "DELETE FROM Channels WHERE channel_id = :ID";


                db.Open();

                db.Execute(sql, new { ID = id });
            }
        }

        
        public void UserJoinChannel(int channelId , int userId)
        {
            using (OracleConnection db = new OracleConnection(connectionString))
            {
                string sql = "INSERT INTO User_has_channel(user_id, channel_id ) " +
                    "VALUES(:usId, :chId)";


                db.Open();

                db.Execute(sql, new { chId = channelId, usId = userId });
            }
        }

        public void UserLeaveChannel(int channelId, int userId)
        {
            using (OracleConnection db = new OracleConnection(connectionString))
            {
                string sql = "DELETE FROM User_has_channel WHERE user_id = :usId AND channel_id = :chId";
                
                db.Open();

                db.Execute(sql, new { chId = channelId, usId = userId });
            }
        }
    }
}
