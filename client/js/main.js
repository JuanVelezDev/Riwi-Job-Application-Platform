import { AuthService } from './services/auth.js';
import { VacanciesService } from './services/vacancies.js';
import { VacancyCard } from './components/vacancy-card.js';
import { Toast } from './utils/toast.js';
import { Chatbot } from './components/chatbot.js';

class App {
    constructor() {
        this.init();
        this.chatbot = new Chatbot();
    }

    init() {
        this.checkAuth();
        this.setupListeners();
    }

    checkAuth() {
        const user = AuthService.getUser();
        if (AuthService.isAuthenticated() && user) {
            this.showDashboard(user);
        } else {
            this.showLanding();
        }
    }

    showLanding() {
        document.getElementById('landing-page').classList.remove('hidden');
        document.getElementById('dashboard-section').classList.add('hidden');

        // Navbar state
        document.getElementById('nav-login-btn').classList.remove('hidden');
        document.getElementById('nav-user-info').classList.add('hidden');
    }

    showDashboard(user) {
        document.getElementById('landing-page').classList.add('hidden');
        document.getElementById('dashboard-section').classList.remove('hidden');

        // Navbar state
        document.getElementById('nav-login-btn').classList.add('hidden');
        document.getElementById('nav-user-info').classList.remove('hidden');

        document.getElementById('user-name').innerText = user.name;
        document.getElementById('user-role').innerText = user.role.toUpperCase();

        if (['gestor', 'admin'].includes(user.role)) {
            document.getElementById('controls').classList.remove('hidden');
        } else {
            document.getElementById('controls').classList.add('hidden');
        }

        // Close modal if open
        document.getElementById('login-modal').classList.add('hidden');

        this.loadVacancies(user.role);
    }

    setupListeners() {
        console.log('Setting up listeners...');

        // Filters
        const filterTech = document.getElementById('filter-tech');
        const filterSeniority = document.getElementById('filter-seniority');

        let timeout;
        if (filterTech) {
            filterTech.addEventListener('input', () => {
                clearTimeout(timeout);
                timeout = setTimeout(() => this.loadVacancies(this.currentUserRole), 500);
            });
        }

        if (filterSeniority) {
            filterSeniority.addEventListener('change', () => this.loadVacancies(this.currentUserRole));
        }

        // Login Modal Controls
        const loginModal = document.getElementById('login-modal');
        const loginBtn = document.getElementById('nav-login-btn');
        const closeLoginBtn = document.getElementById('close-login-modal');

        if (loginBtn && loginModal) {
            loginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Login button clicked');
                loginModal.classList.remove('hidden');
            });
        } else {
            console.error('Login elements not found:', { loginBtn, loginModal });
        }

        if (closeLoginBtn && loginModal) {
            closeLoginBtn.addEventListener('click', () => {
                loginModal.classList.add('hidden');
            });
        }

        // Close modal on backdrop click
        if (loginModal) {
            loginModal.addEventListener('click', (e) => {
                if (e.target === loginModal) {
                    loginModal.classList.add('hidden');
                }
            });
        }

        // Login Form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const btn = e.target.querySelector('button');
                const originalText = btn.innerText;
                btn.innerText = 'Validando...';

                try {
                    const email = document.getElementById('email').value;
                    const pass = document.getElementById('password').value;
                    const user = await AuthService.login(email, pass);

                    Toast.show('Bienvenido', `Hola ${user.name} !`);
                    this.showDashboard(user);
                } catch (err) {
                    console.error(err);
                    document.getElementById('login-error').innerText = 'Credenciales inválidas';
                    document.getElementById('login-error').classList.remove('hidden');
                    Toast.show('Error', 'Fallo al iniciar sesión', 'error');
                } finally {
                    btn.innerText = originalText;
                }
            });
        }

        // Register Modal Controls
        const registerModal = document.getElementById('register-modal');
        const closeRegisterBtn = document.getElementById('close-register-modal');
        const switchToRegisterBtn = document.getElementById('switch-to-register');
        const switchToLoginBtn = document.getElementById('switch-to-login');

        // Switches
        if (switchToRegisterBtn) {
            switchToRegisterBtn.addEventListener('click', () => {
                loginModal.classList.add('hidden');
                registerModal.classList.remove('hidden');
            });
        }
        if (switchToLoginBtn) {
            switchToLoginBtn.addEventListener('click', () => {
                registerModal.classList.add('hidden');
                loginModal.classList.remove('hidden');
            });
        }
        if (closeRegisterBtn) {
            closeRegisterBtn.addEventListener('click', () => registerModal.classList.add('hidden'));
        }

        // Register Form
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const btn = e.target.querySelector('button');
                const originalText = btn.innerText;
                btn.innerText = 'Creando cuenta...';

                try {
                    const name = document.getElementById('reg-name').value;
                    const email = document.getElementById('reg-email').value;
                    const password = document.getElementById('reg-password').value;

                    // 1. Register
                    await AuthService.register({ name, email, password });

                    // 2. Auto Login
                    const user = await AuthService.login(email, password);

                    Toast.show('Bienvenido', `Cuenta creada exitosamente!`);
                    registerModal.classList.add('hidden');
                    this.showDashboard(user);

                } catch (err) {
                    console.error(err);
                    Toast.show('Error', 'No se pudo crear la cuenta', 'error');
                } finally {
                    btn.innerText = originalText;
                }
            });
        }


        // Logout
        document.getElementById('logout-btn').addEventListener('click', () => {
            AuthService.logout();
            this.showLanding();
        });

        // Vacancy Creation (Modal)
        const modal = document.getElementById('create-modal');
        const openBtn = document.getElementById('create-vacancy-btn');
        const closeBtn = document.getElementById('close-modal');
        const cancelBtn = modal.querySelector('button.text-gray-600'); // the cancel button

        // Create Vacancy Button (Reset to Create Mode)
        if (openBtn) openBtn.addEventListener('click', () => {
            this.openModal('create');
        });

        if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
        if (cancelBtn) cancelBtn.addEventListener('click', () => modal.classList.add('hidden'));

        document.getElementById('create-vacancy-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const form = e.target;

            const body = {
                title: document.getElementById('v-title').value,
                description: document.getElementById('v-desc').value,
                technologies: document.getElementById('v-tech').value,
                seniority: document.getElementById('v-seniority').value,
                location: document.getElementById('v-loc').value,
                modality: document.getElementById('v-modality').value,
                salaryRange: document.getElementById('v-salary').value,
                company: document.getElementById('v-company').value,
                maxApplicants: parseInt(document.getElementById('v-max').value)
            };

            try {
                if (this.currentMode === 'edit' && this.currentVacancyId) {
                    await VacanciesService.update(this.currentVacancyId, body);
                    Toast.show('Success', 'Vacancy updated!');
                } else {
                    await VacanciesService.create(body);
                    Toast.show('Success', 'Vacancy published!');
                }
                modal.classList.add('hidden');
                form.reset();
                this.loadVacancies(AuthService.getUser().role);
            } catch (err) {
                console.error(err);
                Toast.show('Error', 'Operation failed', 'error');
            }
        });

        // Delegate delegation for dynamic elements
        document.getElementById('vacancies-list').addEventListener('click', async (e) => {
            const target = e.target.closest('button');
            if (!target) return;

            if (target.classList.contains('apply-btn')) {
                const id = target.dataset.id;
                await this.applyToVacancy(id);
            }
            else if (target.classList.contains('toggle-status-btn')) {
                const id = target.dataset.id;
                const currentStatus = target.dataset.status;
                const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
                await this.toggleVacancyStatus(id, newStatus);
            }
            else if (target.classList.contains('view-applicants-btn')) {
                const id = target.dataset.id;
                await this.viewApplicants(id);
            }
            else if (target.classList.contains('edit-btn')) {
                const id = target.dataset.id;
                await this.openEditModal(id);
            }
        });

        // Applicants Modal Close
        document.getElementById('close-applicants-modal').addEventListener('click', () => {
            document.getElementById('applicants-modal').classList.add('hidden');
        });
    }

    openModal(mode) {
        const modal = document.getElementById('create-modal');
        const form = document.getElementById('create-vacancy-form');
        const titleEl = modal.querySelector('h2');
        const submitBtn = modal.querySelector('button[type="submit"]');

        this.currentMode = mode;
        this.currentVacancyId = null;
        form.reset();
        modal.classList.remove('hidden');

        if (mode === 'create') {
            titleEl.innerText = 'Publicar Vacante';
            submitBtn.innerText = 'Publicar';
        } else {
            titleEl.innerText = 'Editar Vacante';
            submitBtn.innerText = 'Guardar Cambios';
        }
    }

    async openEditModal(id) {
        try {
            // Need to fetch details first as card might not have full description
            const response = await VacanciesService.getOne(id);
            const v = response.data || response; // Adapt

            this.openModal('edit');
            this.currentVacancyId = id;

            // Fill form
            const d = document;
            d.getElementById('v-title').value = v.title;
            d.getElementById('v-desc').value = v.description;
            d.getElementById('v-company').value = v.company;
            d.getElementById('v-loc').value = v.location;
            d.getElementById('v-modality').value = v.modality;
            d.getElementById('v-seniority').value = v.seniority;
            d.getElementById('v-salary').value = v.salaryRange;
            d.getElementById('v-max').value = v.maxApplicants;
            d.getElementById('v-tech').value = v.technologies;

        } catch (err) {
            console.error(err);
            Toast.show('Error', `Load Failed: ${err.message} `, 'error');
        }
    }
    async toggleVacancyStatus(id, status) {
        try {
            await VacanciesService.updateStatus(id, status);
            Toast.show('Actualizado', `Vacante marcada como ${status} `);
            this.loadVacancies(AuthService.getUser().role);
        } catch (err) {
            Toast.show('Error', 'No se pudo actualizar el estado', 'error');
        }
    }

    async viewApplicants(id) {
        const modal = document.getElementById('applicants-modal');
        const listContainer = document.getElementById('applicants-list');
        modal.classList.remove('hidden');
        listContainer.innerHTML = '<div class="text-center py-4">Cargando...</div>';

        try {
            const response = await VacanciesService.getApplicants(id);
            const applications = response.data || response; // Adapt based on actual response structure

            if (applications.length === 0) {
                listContainer.innerHTML = `
                <div class="flex flex-col items-center justify-center py-10 text-gray-400">
                    <svg class="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    <p>No hay postulantes aún.</p>
                </div>`;
                return;
            }

            listContainer.innerHTML = applications.map(app => `
                <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-primary/30 transition">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            ${app.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p class="font-bold text-gray-900">${app.user.name}</p>
                            <p class="text-xs text-gray-500">${app.user.email}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-xs text-gray-400">Aplicado el</p>
                        <p class="text-sm font-medium text-gray-700">${new Date(app.appliedAt).toLocaleDateString()}</p>
                    </div>
                </div>
            `).join('');

        } catch (err) {
            console.error(err);
            listContainer.innerHTML = `<div class="text-red-500 text-center py-4">Error al cargar postulantes</div>`;
        }
    }

    async loadVacancies(role) {
        this.currentUserRole = role; // Store role for re-renders
        try {
            const tech = document.getElementById('filter-tech')?.value || '';
            const seniority = document.getElementById('filter-seniority')?.value || '';

            const vacancies = await VacanciesService.getAll({ search: tech, seniority });
            const list = document.getElementById('vacancies-list');
            list.innerHTML = vacancies.map(v => VacancyCard(v, role)).join('');
        } catch (err) {
            console.error(err);
        }
    }

    async applyToVacancy(id) {
        try {
            const res = await VacanciesService.apply(id);
            if (res.success || res.id) {
                Toast.show('Success', 'Application submitted!');
            } else {
                Toast.show('Failed', res.message || 'Error', 'error');
            }
        } catch (err) {
            Toast.show('Error', 'Network error', 'error');
        }
    }
}

// Instantiate App
new App();
