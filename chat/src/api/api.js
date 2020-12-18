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
    }
} 
