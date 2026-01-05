export const Toast = {
    show(title, msg, type = 'success') {
        const toast = document.getElementById('toast');
        const titleEl = document.getElementById('toast-title');
        const msgEl = document.getElementById('toast-msg');
        const iconEl = document.getElementById('toast-icon');

        if (!toast || !titleEl || !msgEl || !iconEl) return;

        titleEl.innerText = title;
        msgEl.innerText = msg;

        const icon = type === 'success'
            ? '<svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>'
            : '<svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';

        iconEl.innerHTML = icon;

        // Animate In: Remove the "hidden/off-screen" classes
        toast.classList.remove('-translate-y-20', 'opacity-0');

        // Animate Out: Add them back after 3s
        setTimeout(() => {
            toast.classList.add('-translate-y-20', 'opacity-0');
        }, 3000);
    }
};
