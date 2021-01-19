using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ChatAPI.Models.ChannelsModel;

namespace ChatAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChannelsController : ControllerBase
    {
        
        private readonly IChannelRepository channelsRep;

        public ChannelsController(IChannelRepository channelsR)
        {
            channelsRep = channelsR;
        }

        public class ChannelsWrapper
        {
            public IEnumerable<ChannelsModel> Channels { get; set; }
        } 
        [HttpGet("userChannels", Name = "GetUserChannels")]
        public ChannelsWrapper GetUserChannels()
        {
            int userId = Convert.ToInt32(Request.Cookies["userId"]);

            ChannelsWrapper res = new ChannelsWrapper();

            res.Channels = channelsRep.GetUserChannels(userId);
            return res;
        }

        //not for the client app
        [HttpGet(Name = "GetChannels")]
        public IEnumerable<ChannelsModel> GetChannels()
        {
            return channelsRep.GetChannels();
        }

        //not for the client app
        [HttpGet("{id}", Name = "GetChannel")]
        public ChannelsModel GetChannel(int id)
        {
            return channelsRep.GetChannel(id);
        }

        public class ChannelCreationData
        {
            public string Name { get; set; }

            public string Theme { get; set; }

            public string CreationTime { get; set; }

        }
        //// POST: api/Channels
        [HttpPost(Name ="PostChannel")]
        public ObjectResult PostChannel([FromBody] ChannelCreationData data)
        {
            int createdChId = channelsRep.AddChannel(data.Name, data.Theme, data.CreationTime);

            return new ObjectResult(new { channelId = createdChId });

        }


        //// DELETE: api/Channels/5
        [HttpDelete("{id}", Name ="DeleteChannel")]
        public void Delete(int id)
        {
            channelsRep.DeleteChannel(id);
        }


        
        //// POST: api/Channels/userChannels/join
        [HttpPost("userChannels/join",Name = "UserJoinChannel")]
        public void UserJoinChannel([FromQuery(Name = "channel")] int channelId)
        {
            int userId = Convert.ToInt32(Request.Cookies["userId"]);

            channelsRep.UserJoinChannel(channelId, userId);
        }


        //// DELETE: api/Channels/userChannels/leave
        [HttpDelete("userChannels/leave", Name = "UserLeaveChannel")]
        public void UserLeaveChannel ([FromQuery(Name = "channel")] int channelId)
        {
            int userId = Convert.ToInt32(Request.Cookies["userId"]);

            channelsRep.UserLeaveChannel(channelId, userId);
        }
    }
}
