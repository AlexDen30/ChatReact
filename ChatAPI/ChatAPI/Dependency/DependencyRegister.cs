using Autofac;
using ChatAPI.Models.ChannelsModel;
using ChatAPI.Models.MessageModel;
using ChatAPI.Models.UsersModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ChatAPI.Dependency
{
    public class DependencyRegister : Module
    {
        string dbString = null;
        public DependencyRegister(string dbConnectionString)
        {
            dbString = dbConnectionString;
        }

        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<ChannelsRepository>()
                .As<IChannelRepository>()
                .WithParameter( "dbConnectionString", dbString )
                .InstancePerLifetimeScope();

            builder.RegisterType<MessageRepository>()
                .As<IMessageRepository>()
                .WithParameter("dbConnectionString", dbString)
                .InstancePerLifetimeScope();

            builder.RegisterType<UsersRepository>()
                .As<IUsersRepository>()
                .WithParameter("dbConnectionString", dbString)
                .InstancePerLifetimeScope();

            base.Load(builder);
        }
    }
}
