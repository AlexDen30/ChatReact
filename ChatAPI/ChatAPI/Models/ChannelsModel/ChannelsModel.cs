using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;


namespace ChatAPI.Models.ChannelsModel
{
    public class ChannelsModel
    {   
        [Key]
        public int ChannelId { get; set; }

        public string Name { get; set; }

        public string Theme { get; set; }

        public string CreationTime { get; set; }

        public int CountOfMessages { get; set; }
    }
}
