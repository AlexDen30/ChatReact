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
        
        private readonly ChannelsRepository channelsRep;

        public ChannelsController()
        {
            channelsRep = new ChannelsRepository();
        }

        // GET: api/Channels?userId=21
        [HttpGet("userChannels", Name = "GetUserChannels")]
        public IEnumerable<ChannelsModel> GetUserChannels([FromQuery(Name = "userId")] int userId )
        { 

            return channelsRep.GetUserChannels(userId);
        }

        // GET: api/Channels
        [HttpGet(Name = "GetChannels")]
        public IEnumerable<ChannelsModel> GetChannels()
        {
            return channelsRep.GetChannels();
        }

        // GET: api/Channels/5
        [HttpGet("{id}", Name = "GetChannel")]
        public ChannelsModel GetChannel(int id)
        {
            return channelsRep.GetChannel(id);
        }

        //// POST: api/Channels
        [HttpPost(Name ="PostChannel")]
        public void PostChannel([FromBody] ChannelsModel channel)
        {
            channelsRep.AddChannel(channel);
        }


        //// DELETE: api/Channels/5
        [HttpDelete("{id}", Name ="DeleteChannel")]
        public void Delete(int id)
        {
            channelsRep.DeleteChannel(id);
        }


        public class UserHasChannel
        {
            public int ChannelId{ get; set; }
            public int UserId{ get; set; }
        }
        //// POST: api/Channels/userChannels/join
        [HttpPost("userChannels/join",Name = "UserJoinChannel")]
        public void UserJoinChannel([FromBody] UserHasChannel usHasCh)
        {
            channelsRep.UserJoinChannel(usHasCh.ChannelId,usHasCh.UserId);
        }


        //// DELETE: api/Channels/userChannels/leave
        [HttpPost("userChannels/leave", Name = "UserLeaveChannel")]
        public void UserLeaveChannel ([FromBody] UserHasChannel usHasCh)
        {
            channelsRep.UserLeaveChannel(usHasCh.ChannelId, usHasCh.UserId);
        }
    }
}
