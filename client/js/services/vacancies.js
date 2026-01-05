import { ApiService } from './api.js';

export class VacanciesService {
    static async getAll(filters = {}) {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.seniority) params.append('seniority', filters.seniority);

        const queryString = params.toString() ? `?${params.toString()}` : '';
        const res = await ApiService.get(`/vacancies${queryString}`);
        return res.data || res;
    }

    static async create(vacancyData) {
        return await ApiService.post('/vacancies', vacancyData);
    }

    static async apply(vacancyId) {
        return await ApiService.post('/applications', { vacancyId });
    }

    static async updateStatus(id, status) {
        return await ApiService.patch(`/vacancies/${id}/status`, { status });
    }

    static async getApplicants(vacancyId) {
        return await ApiService.get(`/applications/vacancy/${vacancyId}`);
    }

    static async update(id, data) {
        return await ApiService.patch(`/vacancies/${id}`, data);
    }

    static async getOne(id) {
        return await ApiService.get(`/vacancies/${id}`);
    }
}
