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

                string sql = "SELECT m.message_id AS MessageId, m.channel_id AS ChannelId, " +
                    "m.type, m.content_text AS ContentText, " +
                    "m.color, m.sender_id AS SenderId, " +
                    "m.creation_time AS CreationTime, m.number_in_chat AS NumberInChat, " +
                    "u.user_name AS SenderUserName " +
                    "FROM Messages m JOIN ChatUsers u ON m.sender_id = u.user_id " +
                    "WHERE message_id= :ID ";

                db.Open();
                return db.Query<MessageModel>(sql, new { ID = messageId}).FirstOrDefault();
            }
        }

        public MessageModel GetMessageByDateAndSenderId(string date, int senderId)
        {
            using (OracleConnection db = new OracleConnection(connectionString))
            {
                //string sql = "SELECT message_id AS MessageId, channel_id AS ChannelId, type, content_text AS ContentText, content_file AS ContentFile, color, sender_id AS SenderId "

                string sql = "SELECT m.message_id AS MessageId, m.channel_id AS ChannelId, " +
                    "m.type, m.content_text AS ContentText, " +
                    "m.color, m.sender_id AS SenderId, " +
                    "m.creation_time AS CreationTime, m.number_in_chat AS NumberInChat, " +
                    "u.user_name AS SenderUserName " +
                    "FROM Messages m INNER JOIN ChatUsers u ON u.user_id = :ID " +
                    "WHERE creation_time = to_date(:SendDate, \'dd.MM.yyyy hh24:mi:ss\') ";

                db.Open();
                return db.Query<MessageModel>(sql, new { ID = senderId, SendDate = date}).FirstOrDefault();
            }
        }

        public IEnumerable<MessageModel> GetAllChannelMessages(int channel_id)
        {
            using (OracleConnection db = new OracleConnection(connectionString))
            {
                
                string sql = "SELECT m.message_id AS MessageId, m.channel_id AS ChannelId, " +
                    "m.type, m.content_text AS ContentText,  " +
                    "m.color, m.sender_id AS SenderId, " +
                    "m.creation_time AS CreationTime, m.number_in_chat AS NumberInChat, " +
                    "u.user_name AS SenderUserName " +
                    "FROM Messages m JOIN ChatUsers u ON m.sender_id = u.user_id " +
                    "WHERE m.channel_id= :ID ";

                db.Open();
                return db.Query<MessageModel>(sql, new { ID = channel_id });
            }
        }

        public IEnumerable<MessageModel> GetChannelMessagesBetween(int channel_id, int from, int to)
        {
            using (OracleConnection db = new OracleConnection(connectionString))
            {

                string sql = "SELECT m.message_id AS MessageId, m.channel_id AS ChannelId, " +
                    "m.type, m.content_text AS ContentText,  " +
                    "m.color, m.sender_id AS SenderId, " +
                    "m.creation_time AS CreationTime, m.number_in_chat AS NumberInChat, " +
                    "u.user_name AS SenderUserName " +
                    "FROM Messages m JOIN ChatUsers u ON m.sender_id = u.user_id " +
                    "WHERE m.channel_id= :ID AND m.number_in_chat BETWEEN :FIRST AND :LAST " +
                    "ORDER BY m.number_in_chat ASC";

                db.Open();
                return db.Query<MessageModel>(sql, new { ID = channel_id, FIRST = from, LAST = to });
            }
        }

        public byte[] GetMessageFile(int messageId)
        {
            using (OracleConnection db = new OracleConnection(connectionString))
            {

                string sql = "SELECT content_file FROM Messages WHERE message_id = :ID";

                db.Open();
                return db.Query<byte[]>(sql, new { ID = messageId}).FirstOrDefault();
            }
        }

        public void AddMessage(MessageModel message, byte[] contentFile)
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

                db.Execute(sql1, new { message.ChannelId });

                db.Execute(sql2, new
                {
                    ContentFile = contentFile,
                    message.ChannelId,
                    message.Color,
                    message.ContentText,
                    message.CreationTime,
                    message.SenderId,
                    message.Type,
                    message.NumberInChat
                });

                db.Execute(sql3, new { message.ChannelId });
            }
        }
    }
}
