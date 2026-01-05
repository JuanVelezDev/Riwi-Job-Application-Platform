export const VacancyCard = (v, userRole) => {
    const color = v.modality === 'remote' ? 'text-green-600 bg-green-50' : (v.modality === 'hybrid' ? 'text-purple-600 bg-purple-50' : 'text-blue-600 bg-blue-50');
    const isInactive = v.status === 'inactive';
    const statusBadge = isInactive ? '<span class="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-md font-bold uppercase ml-2">Inactive</span>' : '';

    // Tech tags
    const techStack = v.technologies ? v.technologies.split(',') : [];
    const visibleTech = techStack.slice(0, 3).map(t => `<span class="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md">${t.trim()}</span>`).join('');
    const extraTech = techStack.length > 3 ? `<span class="bg-gray-50 text-gray-400 text-xs px-2 py-1 rounded-md">+${techStack.length - 3}</span>` : '';

    // Action Buttons
    let actionBtn = '';
    const isManager = ['admin', 'gestor'].includes(userRole);

    if (isManager) {
        const toggleBtnText = isInactive ? 'Activar' : 'Desactivar';
        const toggleBtnClass = isInactive ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50';

        actionBtn = `
            <div class="contents">
                <button data-id="${v.id}" class="edit-btn text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg text-xs font-bold transition">
                    Editar
                </button>
                <button data-id="${v.id}" class="view-applicants-btn text-gray-600 hover:text-primary hover:bg-gray-50 px-3 py-2 rounded-lg text-xs font-bold transition">
                    Ver Candidatos
                </button>
                <button data-id="${v.id}" data-status="${v.status}" class="toggle-status-btn ${toggleBtnClass} px-3 py-2 rounded-lg text-xs font-bold transition">
                    ${toggleBtnText}
                </button>
            </div>
        `;
    } else {
        // Coder View
        // Check if max applicants reached (requires backend data, assuming v.applicants_count or similar if available, else just rely on backend error)
        if (isInactive) {
            actionBtn = `<button disabled class="bg-gray-100 text-gray-400 px-6 py-2.5 rounded-full text-sm font-bold cursor-not-allowed">Cerrada</button>`;
        } else {
            actionBtn = `<button data-id="${v.id}" class="apply-btn btn-primary px-6 py-2.5 rounded-full shadow-lg shadow-primary/30 text-sm font-bold tracking-wide">Postularme</button>`;
        }
    }

    return `
        <div class="group bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 slide-up flex flex-col justify-between" style="animation-delay: 100ms">
            <div>
                <div class="flex justify-between items-start mb-4">
                    <div class="bg-gray-50 p-3 rounded-2xl group-hover:bg-primary/5 transition-colors">
                        <svg class="w-8 h-8 text-gray-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                    </div>
                    <div>
                        <span class="${color} px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">${v.modality}</span>
                        ${statusBadge}
                    </div>
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">${v.title}</h3>
                <p class="text-sm font-medium text-gray-500 mb-4">${v.company} • ${v.location}</p>
                
                 <div class="flex flex-wrap gap-2 mb-6">
                    ${visibleTech}
                    ${extraTech}
                </div>
            </div>

            <div class="pt-6 border-t border-gray-50 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <p class="text-xs text-gray-400 uppercase font-bold tracking-wider">Salario</p>
                    <p class="font-bold text-gray-900 text-lg">${v.salaryRange}</p>
                    <div class="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B5CFF] bg-[#6B5CFF]/10 px-2.5 py-1.5 rounded-lg border border-[#6B5CFF]/10">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                        ${v.applicantsCount || 0} Postulantes
                    </div>
                </div>
                <div class="flex flex-wrap gap-2 justify-end">
                    ${actionBtn.replace('class="flex gap-2"', 'class="contents"')} 
                </div>     
            </div>
        </div>
    `;
};
