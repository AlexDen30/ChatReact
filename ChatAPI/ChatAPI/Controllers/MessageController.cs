using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ChatAPI.Hubs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Diagnostics.CodeAnalysis;
using ChatAPI.TimeFeatures;
using ChatAPI.Models.MessageModel;

namespace ChatAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessageController : Controller
    {
        protected readonly IHubContext<MessageHub> _messageHub;
        private readonly MessageRepository messageRep;

        public MessageController([NotNull] IHubContext<MessageHub> messageHub)
        {
            _messageHub = messageHub;
            messageRep = new MessageRepository();
        }

        //public IActionResult Get()
        //{
        //     var timeManager = new TimeManager(() => _messageHub.Clients.All.SendAsync("transferMessageData", messageRep.GetMessage())
        //}

        [HttpPost]
        public async Task<IActionResult> SendMessage(MessageModel msg)
        {
            messageRep.AddMessage(msg);

            await _messageHub.Clients.All.SendAsync("newMsg",messageRep.GetMessage(msg.MessageId));

            return Ok();
        }

        [HttpGet("{channelId}", Name = "GetAllChannelMsgs")]
        public IEnumerable<MessageModel> GetChannelMessages(int channelId)
        {

            return messageRep.GetAllChannelMessages(channelId);
        }

        [HttpGet("between/{channelId}", Name = "GetChannelMessagesBetween")]
        public IEnumerable<MessageModel> GetChannelMessagesBetween(int channelId, 
            [FromQuery(Name = "from")] int from, [FromQuery(Name = "to")] int to)
        {

            return messageRep.GetChannelMessagesBetween(channelId,from,to);
        }

    }
}