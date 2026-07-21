// ==========================================
// STATE MANAGEMENT & DUMMY DATA (Fallback)
// ==========================================
let candidates = [];
let nextId = 4; // Used only for dummy data generation

document.addEventListener("DOMContentLoaded", () => {
    const activeUEID = localStorage.getItem('active_ueid') || 'AK-REC-001';
    document.getElementById('recruiter-name-display').innerText = `ID: ${activeUEID}`;
    
    // Load candidates from Backend (or fallback to dummy data)
    fetchCandidates(); 
});

// ==========================================
// API INTEGRATION FUNCTIONS (PHP + SQL)
// ==========================================

// 1. Fetch Candidates (READ)
async function fetchCandidates() {
    /* 🔗 UNCOMMENT THIS FOR PHP INTEGRATION 🔗
    try {
        const response = await fetch('backend/get_candidates.php');
        const data = await response.json();
        candidates = data;
        renderTable();
    } catch (error) {
        console.error("Failed to load data from database:", error);
    }
    */

    // --- TEMPORARY DUMMY DATA FOR UI TESTING ---
    candidates = [
        { id: 1, code: 'CAN-1001', name: 'Aarav Gupta', phone: '+91 9876543210', email: 'aarav@example.com', profile: 'React Developer', language: 'English, Hindi', gender: 'Male', company: 'Pending Selection', selectionDate: '-', remarks: 'Good communication.', status: 'Pending' },
        { id: 2, code: 'CAN-1002', name: 'Sneha Rao', phone: '+91 9123456789', email: 'sneha@example.com', profile: 'HR Executive', language: 'English, Kannada', gender: 'Female', company: 'Infosys', selectionDate: '2026-07-18', remarks: 'Notice period 15 days.', status: 'Selected' },
        { id: 3, code: 'CAN-1003', name: 'Vikram Singh', phone: '+91 9988776655', email: 'vikram@example.com', profile: 'Sales Manager', language: 'Hindi, Punjabi', gender: 'Male', company: '', selectionDate: '-', remarks: 'Not a culture fit.', status: 'Rejected' }
    ];
    renderTable();
}

// 2. Add New Candidate (CREATE)
async function submitNewCandidate(event) {
    event.preventDefault();

    const payload = {
        name: document.getElementById('add-name').value,
        phone: document.getElementById('add-phone').value,
        email: document.getElementById('add-email').value,
        profile: document.getElementById('add-profile').value,
        language: document.getElementById('add-language').value,
        gender: document.getElementById('add-gender').value,
        company: document.getElementById('add-company').value,
        selectionDate: document.getElementById('add-selection-date').value,
        remarks: document.getElementById('add-remarks').value,
        status: 'Pending',
        recruiter_id: localStorage.getItem('active_ueid')
    };

    /* 🔗 UNCOMMENT THIS FOR PHP INTEGRATION 🔗
    const response = await fetch('backend/add_candidate.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    if (response.ok) { fetchCandidates(); }
    */

    // Dummy Data Simulation
    payload.id = nextId++;
    payload.code = `CAN-100${payload.id}`;
    if (!payload.company) payload.company = 'Pending Selection';
    if (!payload.selectionDate) payload.selectionDate = '-';
    candidates.unshift(payload);
    
    closeModal('addCandidateModal');
    document.getElementById('add-candidate-form').reset();
    renderTable();
}

// 3. Update Inline Status (UPDATE)
async function updateStatusInline(id, newStatus) {
    /* 🔗 UNCOMMENT THIS FOR PHP INTEGRATION 🔗
    await fetch('backend/update_status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id, status: newStatus })
    });
    */

    const candidate = candidates.find(c => c.id === id);
    if(candidate) { candidate.status = newStatus; renderTable(); }
}

// 4. Save Full Candidate Edit (UPDATE)
async function saveCandidateEdit(event) {
    event.preventDefault();
    const id = parseInt(document.getElementById('edit-id').value);

    const payload = {
        id: id,
        name: document.getElementById('edit-name').value,
        phone: document.getElementById('edit-phone').value,
        email: document.getElementById('edit-email').value,
        profile: document.getElementById('edit-profile').value,
        language: document.getElementById('edit-language').value,
        company: document.getElementById('edit-company').value,
        selectionDate: document.getElementById('edit-selection-date').value,
        remarks: document.getElementById('edit-remarks').value,
        status: document.getElementById('edit-status').value
    };

    /* 🔗 UNCOMMENT THIS FOR PHP INTEGRATION 🔗
    await fetch('backend/update_candidate.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    fetchCandidates();
    */

    // Dummy Data Simulation
    const candidate = candidates.find(c => c.id === id);
    if(candidate) {
        Object.assign(candidate, payload);
        if (!candidate.company) candidate.company = 'Pending Selection';
        if (!candidate.selectionDate) candidate.selectionDate = '-';
        renderTable();
        closeModal('editCandidateModal');
    }
}

// 5. Delete Candidate (DELETE)
async function deleteCandidateFromEdit() {
    const id = parseInt(document.getElementById('edit-id').value);
    
    if(confirm("Are you sure you want to permanently delete this candidate?")) {
        /* 🔗 UNCOMMENT THIS FOR PHP INTEGRATION 🔗
        await fetch('backend/delete_candidate.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        });
        fetchCandidates();
        */

        // Dummy Data Simulation
        candidates = candidates.filter(c => c.id !== id);
        renderTable(); 
        closeModal('editCandidateModal');
    }
}

// ==========================================
// DOM RENDERING & MODALS
// ==========================================
function renderTable() {
    const tbody = document.getElementById('candidate-table-body');
    tbody.innerHTML = '';

    candidates.forEach(can => {
        let statusClass = 'status-pending';
        if(can.status === 'Selected') statusClass = 'status-selected';
        if(can.status === 'Rejected') statusClass = 'status-rejected';

        let displayDate = can.selectionDate === '-' ? '-' : new Date(can.selectionDate).toLocaleDateString('en-IN');

        tbody.innerHTML += `
            <tr class="hover:bg-slate-50 transition-colors group">
                <td class="px-4 py-4 font-mono text-xs font-bold text-slate-500">${can.code}</td>
                <td class="px-4 py-4"><p class="font-semibold text-slate-800">${can.name}</p><p class="text-xs text-slate-500 mt-0.5">${can.phone}</p><p class="text-xs text-slate-500">${can.email}</p></td>
                <td class="px-4 py-4"><p class="text-slate-700 font-medium">${can.profile}</p><p class="text-xs text-slate-500 mt-0.5"><span class="font-semibold">Lang:</span> ${can.language}</p><p class="text-xs text-slate-500"><span class="font-semibold">Gender:</span> ${can.gender}</p></td>
                <td class="px-4 py-4"><p class="text-slate-800 font-medium">${can.company}</p><p class="text-xs text-slate-500 mt-0.5">${displayDate}</p></td>
                <td class="px-4 py-4 text-slate-600 text-xs max-w-[150px] truncate" title="${can.remarks}">${can.remarks}</td>
                <td class="px-4 py-4">
                    <select onchange="updateStatusInline(${can.id}, this.value)" class="status-dropdown ${statusClass} border text-xs font-bold rounded-full px-3 py-1.5 cursor-pointer outline-none transition-all">
                        <option value="Pending" ${can.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Selected" ${can.status === 'Selected' ? 'selected' : ''}>Selected</option>
                        <option value="Rejected" ${can.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
                    </select>
                </td>
                <td class="px-4 py-4 text-right">
                    <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onclick="openViewModal(${can.id})" class="p-2 text-blue-500 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-colors" title="View Details">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                        </button>
                        <button onclick="openEditModal(${can.id})" class="p-2 text-amber-500 hover:bg-amber-100 hover:text-amber-700 rounded-lg transition-colors" title="Edit Candidate">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    updateMetrics();
}

function updateMetrics() {
    document.getElementById('metric-total').innerText = candidates.length;
    document.getElementById('metric-selected').innerText = candidates.filter(c => c.status === 'Selected').length;
    document.getElementById('metric-rejected').innerText = candidates.filter(c => c.status === 'Rejected').length;
}

function openViewModal(id) {
    const can = candidates.find(c => c.id === id);
    if(!can) return;

    document.getElementById('view-name').innerText = can.name;
    document.getElementById('view-code').innerText = can.code;
    document.getElementById('view-phone').innerText = can.phone;
    document.getElementById('view-email').innerText = can.email;
    document.getElementById('view-profile').innerText = can.profile;
    document.getElementById('view-language').innerText = can.language;
    document.getElementById('view-gender').innerText = can.gender;
    document.getElementById('view-status').innerText = can.status;
    document.getElementById('view-company').innerText = can.company;
    document.getElementById('view-date').innerText = can.selectionDate === '-' ? 'N/A' : new Date(can.selectionDate).toLocaleDateString('en-IN');
    document.getElementById('view-remarks').innerText = can.remarks;

    openModal('viewCandidateModal');
}

function openEditModal(id) {
    const can = candidates.find(c => c.id === id);
    if(!can) return;

    document.getElementById('edit-id').value = can.id;
    document.getElementById('edit-name').value = can.name;
    document.getElementById('edit-phone').value = can.phone;
    document.getElementById('edit-email').value = can.email;
    document.getElementById('edit-profile').value = can.profile;
    document.getElementById('edit-language').value = can.language;
    document.getElementById('edit-company').value = can.company === 'Pending Selection' ? '' : can.company;
    document.getElementById('edit-selection-date').value = can.selectionDate === '-' ? '' : can.selectionDate;
    document.getElementById('edit-remarks').value = can.remarks === 'No remarks.' ? '' : can.remarks;
    document.getElementById('edit-status').value = can.status;

    openModal('editCandidateModal');
}

// Utility Nav Functions
function openModal(modalId) { document.getElementById(modalId).classList.remove('hidden'); }
function closeModal(modalId) { document.getElementById(modalId).classList.add('hidden'); }
function logout() { localStorage.clear(); window.location.href = 'index.html'; }
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar.classList.contains('sidebar-expanded')) {
        sidebar.classList.remove('sidebar-expanded');
        sidebar.classList.add('sidebar-collapsed');
    } else {
        sidebar.classList.remove('sidebar-collapsed');
        sidebar.classList.add('sidebar-expanded');
    }
}