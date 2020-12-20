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
using System.IO;

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
        public async Task<IActionResult> SendMessage()
        {
            MessageModel msg = new MessageModel();
            byte[] file = null;

            //geting form data to model 
            if (Request.Form["type"] == "file")
            {
                var ms = new MemoryStream();
                Request.Form.Files.FirstOrDefault().CopyTo(ms);
                file = ms.ToArray();
            }
            

            msg.ChannelId = Convert.ToInt32(Request.Form["channelId"]);
            msg.Type = Request.Form["type"];
            msg.ContentText = Request.Form["contentText"];
            msg.Color = Request.Form["color"];
            msg.CreationTime = Request.Form["creationTime"];

            
            msg.SenderId = Convert.ToInt32(Request.Cookies["userId"]);
            messageRep.AddMessage(msg, file);

            await _messageHub.Clients.All.SendAsync("newMsg",messageRep.GetMessage(msg.MessageId));

            return Ok();
        }

        [HttpGet("download", Name = "DownloadMessageFile")]
        public byte[] GetFile([FromQuery(Name = "messageId")] int msgId)
        {
            return messageRep.GetMessageFile(msgId);
        }


        //not for the client
        [HttpGet("{channelId}", Name = "GetAllChannelMsgs")]
        public IEnumerable<MessageModel> GetChannelMessages(int channelId)
        {

            return messageRep.GetAllChannelMessages(channelId);
        }

        [HttpGet("between/{channelId}", Name = "GetChannelMessagesBetween")]
        public ObjectResult GetChannelMessagesBetween(int channelId, 
            [FromQuery(Name = "from")] int from, [FromQuery(Name = "to")] int to)
        {

            return new ObjectResult( new { messages = messageRep.GetChannelMessagesBetween(channelId, from, to) });
        }

    }
}