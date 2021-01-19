using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatAPI.Models.ChannelsModel
{
    public interface IChannelRepository
    {
        public IEnumerable<ChannelsModel> GetUserChannels(int userId);
        public IEnumerable<ChannelsModel> GetChannels();

        public ChannelsModel GetChannel(int channelId);

        public int AddChannel(string name, string theme, string creationTime);

        public void DeleteChannel(int id);

        public void UserJoinChannel(int channelId, int userId);

        public void UserLeaveChannel(int channelId, int userId);

    }
}
