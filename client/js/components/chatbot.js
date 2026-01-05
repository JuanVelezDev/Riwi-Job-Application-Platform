export class Chatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [
            { text: "¡Hola! Soy el asistente virtual de RiwiTalent. ¿En qué puedo ayudarte hoy?", from: "bot" }
        ];
        this.init();
    }

    init() {
        this.render();
        this.setupListeners();
    }

    toggle() {
        this.isOpen = !this.isOpen;
        const chatWindow = document.getElementById('chat-window');
        const chatIcon = document.getElementById('chat-icon');

        if (this.isOpen) {
            chatWindow.classList.remove('hidden', 'scale-0', 'opacity-0');
            chatWindow.classList.add('scale-100', 'opacity-100');
            // Hide open icon, show close
            chatIcon.innerHTML = `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`;
        } else {
            chatWindow.classList.add('hidden', 'scale-0', 'opacity-0');
            chatWindow.classList.remove('scale-100', 'opacity-100');
            // Show open icon
            chatIcon.innerHTML = `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>`;
        }
    }

    addMessage(text, from) {
        this.messages.push({ text, from });
        this.renderMessages();
    }

    renderMessages() {
        const container = document.getElementById('chat-messages');
        container.innerHTML = this.messages.map(msg => `
            <div class="flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} mb-4">
                <div class="max-w-[80%] rounded-2xl px-4 py-2 ${msg.from === 'user'
                ? 'bg-[#6B5CFF] text-white rounded-tr-none'
                : 'bg-gray-100 text-gray-800 rounded-tl-none'
            }">
                    <p class="text-sm">${msg.text}</p>
                </div>
            </div>
        `).join('');
        container.scrollTop = container.scrollHeight;
    }

    async getBotResponse(input) {
        try {
            // Using ApiService is cleaner but we need to import it or assume global if not module access
            // Since this is a module, we should rely on ApiService being available or imported
            // But let's check imports in this file. Ah, no imports at top.
            // Let's use fetch directly or fix imports. Given ApiService is in services/api.js.
            // To ensure it works, I'll use ApiService via import.

            const response = await fetch('/chatbot/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input })
            });

            if (!response.ok) throw new Error('Network error');
            const data = await response.json();

            // Handle NestJS Interceptor Wrapper ({ success, data, message })
            if (data.data && data.data.response) return data.data.response;
            if (data.response) return data.response; // Direct response backup

            if (data.message && !data.success) return `Error: ${data.message}`; // Only show message if success is false or missing data

            return "No se pudo obtener una respuesta.";
        } catch (error) {
            console.error(error);
            return "Lo siento, tuve un problema de conexión. 😵 Intenta de nuevo.";
        }
    }

    setupListeners() {
        // Toggle Button
        document.getElementById('chat-toggle-btn').addEventListener('click', () => this.toggle());

        // Input Form
        document.getElementById('chat-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const input = document.getElementById('chat-input');
            const text = input.value.trim();
            if (!text) return;

            // User Message
            this.addMessage(text, 'user');
            input.value = '';

            // Show typing indicator?
            // For now, just wait
            const response = await this.getBotResponse(text);
            this.addMessage(response, 'bot');
        });
    }

    render() {
        // Initial render logic if needed, usually managed by HTML presence
        this.renderMessages();
    }
}
