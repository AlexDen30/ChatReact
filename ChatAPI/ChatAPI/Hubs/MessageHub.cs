using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ChatAPI.Models.MessageModel;

namespace ChatAPI.Hubs
{
    public class MessageHub : Hub
    {
        //public void Post(MessageModel msg)
        //{
        //    Clients.All.ad
        //}

        //public async Task BroadcastMessageData(List<MessageModel> data) 
        //{
        //    //await MessageRepository;
        //    await Clients.All.SendAsync("broadcastMessageData", data);
        //}   
    }
}
