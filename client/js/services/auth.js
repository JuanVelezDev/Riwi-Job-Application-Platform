import { ApiService } from './api.js';

export class AuthService {
    static async login(email, password) {
        const res = await ApiService.post('/auth/login', { email, password });
        // Handle response wrapper vs raw
        const data = res.data || res;

        if (data.access_token) {
            this.setSession(data);
            return data.user;
        }
        throw new Error('Login failed');
    }

    static async register(data) {
        return await ApiService.post('/auth/register', data);
    }

    static setSession(data) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
    }

    static logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.reload();
    }

    static getUser() {
        return JSON.parse(localStorage.getItem('user'));
    }

    static isAuthenticated() {
        return !!localStorage.getItem('token');
    }
}
