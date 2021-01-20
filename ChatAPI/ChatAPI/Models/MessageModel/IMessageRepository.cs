using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatAPI.Models.MessageModel
{
    public interface IMessageRepository
    {
        public MessageModel GetMessage(int messageId);

        public MessageModel GetMessageByDateAndSenderId(string date, int senderId);

        public IEnumerable<MessageModel> GetAllChannelMessages(int channel_id);

        public IEnumerable<MessageModel> GetChannelMessagesBetween(int channel_id, int from, int to);

        public DownloadFileModel GetMessageFile(int messageId);

        public void AddMessage(MessageModel message, byte[] contentFile);


    }
}
