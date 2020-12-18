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
