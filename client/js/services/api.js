export class ApiService {
    static get token() {
        return localStorage.getItem('token');
    }

    static get headers() {
        const headers = {
            'Content-Type': 'application/json',
            'x-api-key': 'myapikey123'
        };
        const token = this.token;
        if (token) headers['Authorization'] = `Bearer ${token}`;
        return headers;
    }

    static async request(endpoint, method = 'GET', body = null) {
        // Use relative URL for production compatibility
        const url = `/api${endpoint}`;
        const options = { method, headers: this.headers };
        if (body) options.body = JSON.stringify(body);

        try {
            const res = await fetch(url, options);

            if (!res.ok) {
                const errorBody = await res.json();
                throw new Error(errorBody.message || `API Error: ${res.status}`);
            }

            return await res.json();
        } catch (error) {
            console.error('API Request Failed:', error);
            throw error;
        }
    }

    static get(endpoint) {
        return this.request(endpoint, 'GET');
    }

    static post(endpoint, body) {
        return this.request(endpoint, 'POST', body);
    }

    static patch(endpoint, body) {
        return this.request(endpoint, 'PATCH', body);
    }
}
