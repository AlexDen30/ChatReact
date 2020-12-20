using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ChatAPI.Models.MessageModel
{
    public class MessageModel
    {
        [Key]
        public int MessageId { get; set; }

        public int ChannelId{ get; set; }

        public string Type{ get; set; }

        public string ContentText{ get; set; }

        public byte[] ContentFile{ get; set; }

        public string Color{ get; set; }

        public int SenderId { get; set; }

        public string CreationTime { get; set; }

        public int NumberInChat{ get; set; }

        public string SenderUserName { get; set; }
    }
}
