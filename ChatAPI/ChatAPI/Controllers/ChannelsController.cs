﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ChatAPI.Models.ChannelsModel;
using ChatAPI.Filters;
using Microsoft.Extensions.Logging;

namespace ChatAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChannelsController : ControllerBase
    {
        
        private readonly IChannelRepository channelsRep;
        private readonly ILogger _logger;

        public ChannelsController(IChannelRepository channelsR, ILogger<AuthController> logger)
        {
            _logger = logger;
            channelsRep = channelsR;
        }

        public class ChannelsWrapper
        {
            public IEnumerable<ChannelsModel> Channels { get; set; }
        } 

        [HttpGet("userChannels", Name = "GetUserChannels")]
        [ServiceFilter(typeof(UserAuthorizationFilter))]
        public ChannelsWrapper GetUserChannels()
        {
            int userId = Convert.ToInt32(Request.Cookies["userId"]);

            ChannelsWrapper res = new ChannelsWrapper();

            res.Channels = channelsRep.GetUserChannels(userId);
            _logger.LogInformation("User with id " + userId.ToString() + " has got his channels" );
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
        [ServiceFilter(typeof(AdminAuthorizationFilter))]
        public ObjectResult PostChannel([FromBody] ChannelCreationData data)
        {
            int createdChId = channelsRep.AddChannel(data.Name, data.Theme, data.CreationTime);

            _logger.LogInformation("New channel created id: " + createdChId.ToString());
            return new ObjectResult(new { channelId = createdChId });

        }


        //// DELETE: api/Channels/5
        [HttpDelete("{id}", Name ="DeleteChannel")]
        [ServiceFilter(typeof(AdminAuthorizationFilter))]
        public void Delete(int id)
        {
            _logger.LogInformation("Channel deleted, channel id " + id.ToString());
            channelsRep.DeleteChannel(id);
        }


        
        //// POST: api/Channels/userChannels/join
        [HttpPost("userChannels/join",Name = "UserJoinChannel")]
        [ServiceFilter(typeof(UserAuthorizationFilter))]
        public void UserJoinChannel([FromQuery(Name = "channel")] int channelId)
        {
            int userId = Convert.ToInt32(Request.Cookies["userId"]);

            _logger.LogInformation("User with id " + userId.ToString() + "Joined to channel with id " + channelId.ToString());
            channelsRep.UserJoinChannel(channelId, userId);
        }


        //// DELETE: api/Channels/userChannels/leave
        [HttpDelete("userChannels/leave", Name = "UserLeaveChannel")]
        [ServiceFilter(typeof(UserAuthorizationFilter))]
        public void UserLeaveChannel ([FromQuery(Name = "channel")] int channelId)
        {
            int userId = Convert.ToInt32(Request.Cookies["userId"]);

            _logger.LogInformation("User with id " + userId.ToString() + "Leave channel with id " + channelId.ToString());
            channelsRep.UserLeaveChannel(channelId, userId);
        }
    }
}
