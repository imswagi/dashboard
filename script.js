// ==========================================
// DUMMY DATA ENGINE
// ==========================================
// We use a let array so we can add and delete from it dynamically.
let candidates = [
    { id: 1, code: 'CAN-1001', name: 'Aarav Gupta', email: 'aarav@example.com', profile: 'React Developer', gender: 'Male', remarks: 'Good communication.', status: 'Pending' },
    { id: 2, code: 'CAN-1002', name: 'Sneha Rao', email: 'sneha@example.com', profile: 'HR Executive', gender: 'Female', remarks: 'Notice period 15 days.', status: 'Action Completed' },
    { id: 3, code: 'CAN-1003', name: 'Vikram Singh', email: 'vikram@example.com', profile: 'Sales Manager', gender: 'Male', remarks: 'Excellent track record.', status: 'Joined' },
    { id: 4, code: 'CAN-1004', name: 'Priya Patel', email: 'priya@example.com', profile: 'UI/UX Designer', gender: 'Female', remarks: 'Portfolio missing.', status: 'Rejected' }
];

let nextId = 5; // To auto-generate IDs for new entries

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // Check local storage for login (Fallback to dummy ID if testing directly)
    const activeUEID = localStorage.getItem('active_ueid') || 'AK-REC-001';
    document.getElementById('recruiter-name-display').innerText = `ID: ${activeUEID}`;

    renderTable(); // Initial render
});

// ==========================================
// CORE FUNCTIONS
// ==========================================

// 1. Render the HTML Table dynamically
function renderTable() {
    const tbody = document.getElementById('candidate-table-body');
    tbody.innerHTML = '';

    candidates.forEach(can => {
        // Determine dropdown color based on status
        let statusClass = 'status-pending';
        if(can.status === 'Action Completed') statusClass = 'status-action';
        if(can.status === 'Joined') statusClass = 'status-joined';
        if(can.status === 'Rejected') statusClass = 'status-rejected';

        tbody.innerHTML += `
            <tr class="hover:bg-slate-50 transition-colors group">
                <td class="px-6 py-4 font-mono text-xs font-bold text-slate-500">${can.code}</td>
                <td class="px-6 py-4 font-semibold text-slate-800">${can.name}</td>
                <td class="px-6 py-4 text-slate-500">${can.email}</td>
                <td class="px-6 py-4 text-slate-700 font-medium">${can.profile}</td>
                <td class="px-6 py-4 text-slate-500">${can.gender}</td>
                <td class="px-6 py-4 text-slate-500 text-xs max-w-[150px] truncate" title="${can.remarks}">${can.remarks}</td>
                <td class="px-6 py-4">
                    <select onchange="updateStatus(${can.id}, this.value)" class="status-dropdown ${statusClass} border text-xs font-bold rounded-full px-3 py-1.5 cursor-pointer outline-none transition-all">
                        <option value="Pending" ${can.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Action Completed" ${can.status === 'Action Completed' ? 'selected' : ''}>Action Completed</option>
                        <option value="Joined" ${can.status === 'Joined' ? 'selected' : ''}>Joined</option>
                        <option value="Rejected" ${can.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
                    </select>
                </td>
                <td class="px-6 py-4 text-right">
                    <button onclick="deleteCandidate(${can.id})" class="text-slate-400 hover:text-red-600 transition-colors bg-white p-2 rounded-lg shadow-sm border border-slate-100 opacity-0 group-hover:opacity-100" title="Terminate/Delete">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                </td>
            </tr>
        `;
    });

    updateMetrics(); // Always update top cards when table changes
}

// 2. Update the Top Metric Cards
function updateMetrics() {
    const total = candidates.length;
    // Action completed = Anything that is NOT pending
    const completed = candidates.filter(c => c.status !== 'Pending').length;
    // Joined = Specifically Joined
    const joined = candidates.filter(c => c.status === 'Joined').length;

    // Animate numbers (simple text replace)
    document.getElementById('metric-total').innerText = total;
    document.getElementById('metric-completed').innerText = completed;
    document.getElementById('metric-joined').innerText = joined;
}

// 3. Update Status from Dropdown
function updateStatus(id, newStatus) {
    // Find candidate and update array
    const candidate = candidates.find(c => c.id === id);
    if(candidate) {
        candidate.status = newStatus;
        // Re-render to update dropdown colors and top metrics
        renderTable();
    }
}

// 4. Delete / Terminate Candidate
function deleteCandidate(id) {
    if(confirm("Are you sure you want to terminate this candidate from the list?")) {
        // Filter out the deleted candidate
        candidates = candidates.filter(c => c.id !== id);
        renderTable(); // Re-render table and metrics
    }
}

// 5. Submit Form to Add Candidate
function submitNewCandidate(event) {
    event.preventDefault();

    // Grab values from the modal form
    const newCan = {
        id: nextId,
        code: `CAN-100${nextId}`, // Mock auto-generation
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        profile: document.getElementById('profile').value,
        gender: document.getElementById('gender').value,
        remarks: document.getElementById('remarks').value || 'No remarks added.',
        status: 'Pending' // Default status
    };

    // Add to dummy data array
    candidates.unshift(newCan); // unshift adds to the TOP of the array
    nextId++;

    // Refresh UI
    renderTable();
    closeModal('addCandidateModal');
    document.getElementById('add-candidate-form').reset();
}

// ==========================================
// UTILITIES
// ==========================================
function openModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}