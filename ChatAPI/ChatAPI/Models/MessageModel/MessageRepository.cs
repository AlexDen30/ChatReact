using System;
using System.Collections.Generic;
using System.Linq;
using System.Data;
using System.Threading.Tasks;
using Oracle.ManagedDataAccess.Client;
using Oracle.ManagedDataAccess.Types;
using Dapper;

namespace ChatAPI.Models.MessageModel
{
    public class MessageRepository
    {
        string connectionString = null;

        public MessageRepository()
        {
            connectionString = " Data Source= localhost:1521/xe; User Id=chatDev; Password=123;";
        }

        public MessageModel GetMessage(int messageId)
        {
            using (OracleConnection db = new OracleConnection(connectionString))
            {
                //string sql = "SELECT message_id AS MessageId, channel_id AS ChannelId, type, content_text AS ContentText, content_file AS ContentFile, color, sender_id AS SenderId "

                string sql = "SELECT message_id AS MessageId, channel_id AS ChannelId, " +
                    "type, content_text AS ContentText, content_file AS ContentFile, " +
                    "color, sender_id AS SenderId, " +
                    "creation_time AS CreationTime, number_in_chat AS NumberInChat " +
                    "FROM Messages WHERE message_id= :ID ";

                db.Open();
                return db.Query<MessageModel>(sql, new { ID = messageId}).FirstOrDefault();
            }
        }

        public IEnumerable<MessageModel> GetAllChannelMessages(int channel_id)
        {
            using (OracleConnection db = new OracleConnection(connectionString))
            {
                
                string sql = "SELECT message_id AS MessageId, channel_id AS ChannelId, " +
                    "type, content_text AS ContentText, content_file AS ContentFile, " +
                    "color, sender_id AS SenderId, " +
                    "creation_time AS CreationTime, number_in_chat AS NumberInChat " +
                    "FROM Messages WHERE channel_id= :ID ";

                db.Open();
                return db.Query<MessageModel>(sql, new { ID = channel_id });
            }
        }

        public IEnumerable<MessageModel> GetChannelMessagesBetween(int channel_id, int from, int to)
        {
            using (OracleConnection db = new OracleConnection(connectionString))
            {

                string sql = "SELECT message_id AS MessageId, channel_id AS ChannelId, " +
                    "type, content_text AS ContentText, content_file AS ContentFile, " +
                    "color, sender_id AS SenderId, " +
                    "creation_time AS CreationTime, number_in_chat AS NumberInChat " +
                    "FROM Messages WHERE channel_id= :ID AND number_in_chat BETWEEN :FIRST AND :LAST";

                db.Open();
                return db.Query<MessageModel>(sql, new { ID = channel_id, FIRST = from, LAST = to });
            }
        }

        public void AddMessage(MessageModel message)
        {
            using (OracleConnection db = new OracleConnection(connectionString))
            {
                db.Open();

                string sql1 = "UPDATE Channels SET count_of_messages = count_of_messages + 1 " +
                    "WHERE channel_id = :ChannelId ";

                string sql2 = "INSERT INTO Messages(channel_id, type, " +
                    "content_text, content_file, color, sender_id, creation_time, number_in_chat) " +
                    "VALUES(:ChannelId, :Type, :ContentText, :ContentFile, :Color, " +
                    ":SenderId, to_date(:CreationTime, \'dd.MM.yyyy hh24:mi:ss\'), :NumberInChat) ";

                string sql3 = "UPDATE Messages SET number_in_chat = " +
                    "(SELECT count_of_messages FROM Channels WHERE channel_id = :ChannelId) " +
                    "WHERE message_id IN (SELECT MAX(message_id) FROM Messages) AND channel_id = :ChannelId";

                db.Execute(sql1, new { ChannelId = message.ChannelId });

                db.Execute(sql2, message);

                db.Execute(sql3, new { ChannelId = message.ChannelId });
            }
        }
    }
}
