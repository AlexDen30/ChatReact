using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ChatAPI.Hubs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Diagnostics.CodeAnalysis;
using ChatAPI.Models.MessageModel;
using System.IO;
using ChatAPI.Filters;

namespace ChatAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessageController : Controller
    {
        protected readonly IHubContext<MessageHub> _messageHub;
        private readonly IMessageRepository messageRep;

        public MessageController([NotNull] IHubContext<MessageHub> messageHub, IMessageRepository messageR)
        {
            _messageHub = messageHub;
            messageRep = messageR;
        }

        [HttpPost]
        [ServiceFilter(typeof(UserAuthorizationFilter))]
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

            await _messageHub.Clients.All.SendAsync("newMsg",
                    messageRep.GetMessageByDateAndSenderId(msg.CreationTime, msg.SenderId));

            return Ok();
        }


        

        [HttpGet("download", Name = "DownloadMessageFile")]
        [ServiceFilter(typeof(UserAuthorizationFilter))]
        public FileResult GetFile([FromQuery(Name = "messageId")] int msgId)
        {
            DownloadFileModel file = new DownloadFileModel();
            file = messageRep.GetMessageFile(msgId);
            return File(file.ByteArray, "file"+ "/" + file.FileName.Substring(file.FileName.IndexOf(".")+1), file.FileName);
        }


        //not for the client
        [HttpGet("{channelId}", Name = "GetAllChannelMsgs")]
        public IEnumerable<MessageModel> GetChannelMessages(int channelId)
        {

            return messageRep.GetAllChannelMessages(channelId);
        }

        [HttpGet("between/{channelId}", Name = "GetChannelMessagesBetween")]
        [ServiceFilter(typeof(UserAuthorizationFilter))]
        public ObjectResult GetChannelMessagesBetween(int channelId, 
            [FromQuery(Name = "from")] int from, [FromQuery(Name = "to")] int to)
        {

            return new ObjectResult( new { messages = messageRep.GetChannelMessagesBetween(channelId, from, to) });
        }

    }
}