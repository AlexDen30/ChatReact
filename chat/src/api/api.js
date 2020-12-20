import * as axios from 'axios';

const instance = axios.create({
    withCredentials: true,
    baseURL: 'https://localhost:44366/api/',
    
})


export const authAPI = {
    me () {
        return instance.get(`Auth/me`);
    },

    login (email, password) {
        return instance.post(`Auth/login`, {email, password});
    },

    logout () {
        return instance.delete(`Auth/logout`);
    },

    signup (userName, email, firstName, secondName, birthDate, password) {
        return instance.post('Auth/signup', {
            user : {
                userName,
                email,
                role : "user",
                firstName,
                secondName,
                birthDate
            },
            password
        });
    }
} 


export const channelsAPI = {
    userChannels () {
        return instance.get(`Channels/userChannels`);
    },

    createChannel (name, theme, creationTime) {
        return instance.post(`Channels`, {name, theme, creationTime});
    },

    joinChannel (channelId) {
        return instance.post(`Channels/userChannels/join?channel=${channelId}`, {});
    },

    leaveChannel (channelId) {
        return instance.delete(`Channels/userChannels/leave?channel=${channelId}`);
    },

    deleteChannel (channelId) {
        return instance.delete(`Channels/${channelId}`);
    },

    getChannel (channelId) {
        return instance.get(`Channels/${channelId}`);
    }
} 

export const messagesAPI = {

    getAllChannelMsgs (channelId) {
        return instance.get(`Message/${channelId}`);
    },

    getChannelMsgsBetween (from, to, channelId) {
        return instance.get(`Message/between/${channelId}?from=${from}&to=${to}`);
    },

    sendMessage (channelId, type, contentText, contentFile, color, creationTime) {
        
        const sendMessageForm = new FormData();

        sendMessageForm.append("channelId", channelId);
        sendMessageForm.append("type", type);
        sendMessageForm.append("contentText", contentText);
        sendMessageForm.append("contentFile", contentFile);
        sendMessageForm.append("color", color);
        sendMessageForm.append("creationTime", creationTime);

        // return axios({
        //     url: "https://localhost:44366/api/Message",
        //     method: "POST",
        //     headers: {
        //         'Content-Type': 'multipart/form-data'
        //     },
        //     data: sendMessageForm
        // })
        return instance.post('Message', sendMessageForm, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        });
    }
}