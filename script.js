// --- DOM Elements ---
        const loginView = document.getElementById('loginView');
        const userView = document.getElementById('userView');
        const adminView = document.getElementById('adminView');
        const userComplaintsContainer = document.getElementById('userComplaints');
        const adminComplaintsContainer = document.getElementById('adminComplaints');
        const complaintModal = document.getElementById('complaintModal');
        const modalContent = document.getElementById('modalContent');
        const complaintForm = document.getElementById('complaintForm');

        // --- Application State ---
        let complaints = [];
        let nextId = 1;

        // --- Sample Data ---
        function loadSampleData() {
            complaints = [
                { id: nextId++, user: 'user1', category: 'Electricity', description: 'Power outage in Room 201 since morning.', status: 'Pending', date: '2024-07-28' },
                { id: nextId++, user: 'user2', category: 'Water', description: 'No water in the 3rd-floor washroom.', status: 'In-Progress', date: '2024-07-27' },
                { id: nextId++, user: 'user1', category: 'Maintenance', description: 'The window pane in the common area is broken.', status: 'Resolved', date: '2024-07-25' },
                { id: nextId++, user: 'user3', category: 'Internet', description: 'Wi-Fi is very slow on the entire 2nd floor.', status: 'Pending', date: '2024-07-28' },
            ];
            renderAll();
        }

        // --- Status Styling Helper ---
        function getStatusClass(status) {
            switch (status) {
                case 'Pending': return 'status-pending';
                case 'In-Progress': return 'status-in-progress';
                case 'Resolved': return 'status-resolved';
                default: return 'bg-gray-200 text-gray-800';
            }
        }

        // --- Render Functions ---
        function renderUserComplaints() {
            // For this demo, we assume the user is 'user1'
            const currentUserComplaints = complaints.filter(c => c.user === 'user1').sort((a, b) => b.id - a.id);
            if (currentUserComplaints.length === 0) {
                 userComplaintsContainer.innerHTML = `<div class="bg-white text-center p-12 rounded-2xl shadow-md"><p class="text-gray-500">You have not submitted any complaints yet.</p></div>`;
                 return;
            }
            userComplaintsContainer.innerHTML = currentUserComplaints.map(c => `
                <div class="bg-white shadow-md rounded-2xl p-6 flex justify-between items-center">
                    <div>
                        <div class="flex items-center mb-2">
                            <span class="font-bold text-blue-600 mr-3">${c.category}</span>
                            <span class="text-xs text-gray-500">ID: C${String(c.id).padStart(4, '0')}</span>
                        </div>
                        <p class="text-gray-700 mb-2">${c.description}</p>
                        <p class="text-sm text-gray-500">Submitted on: ${c.date}</p>
                    </div>
                    <div>
                        <span class="status-badge ${getStatusClass(c.status)}">${c.status}</span>
                    </div>
                </div>
            `).join('');
        }

        function renderAdminComplaints() {
            const sortedComplaints = [...complaints].sort((a, b) => b.id - a.id);
            if (sortedComplaints.length === 0) {
                adminComplaintsContainer.innerHTML = `<div class="bg-white text-center p-12 rounded-2xl shadow-md col-span-full"><p class="text-gray-500">No complaints have been submitted yet.</p></div>`;
                return;
            }
            adminComplaintsContainer.innerHTML = sortedComplaints.map(c => `
                <div class="bg-white shadow-lg rounded-2xl p-6 flex flex-col justify-between">
                    <div>
                        <div class="flex justify-between items-start mb-2">
                            <span class="font-bold text-lg text-blue-600">${c.category}</span>
                            <span class="status-badge ${getStatusClass(c.status)}">${c.status}</span>
                        </div>
                        <p class="text-gray-700 mb-3">${c.description}</p>
                    </div>
                    <div>
                        <div class="text-sm text-gray-500 mb-4">
                            <p>ID: C${String(c.id).padStart(4, '0')}</p>
                            <p>User: ${c.user}</p>
                            <p>Date: ${c.date}</p>
                        </div>
                        <div class="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                            <label for="status-select-${c.id}" class="text-sm font-medium mr-2">Update Status:</label>
                            <select id="status-select-${c.id}" onchange="updateStatus(${c.id}, this.value)" class="border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-sm">
                                <option value="Pending" ${c.status === 'Pending' ? 'selected' : ''}>Pending</option>
                                <option value="In-Progress" ${c.status === 'In-Progress' ? 'selected' : ''}>In-Progress</option>
                                <option value="Resolved" ${c.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                            </select>
                        </div>
                    </div>
                </div>
            `).join('');
        }
        
        function renderAll() {
            renderUserComplaints();
            renderAdminComplaints();
        }

        // --- Event Handlers & Logic ---
        function handleLogin(role) {
            loginView.classList.add('hidden');
            if (role === 'user') {
                userView.classList.remove('hidden');
            } else {
                adminView.classList.remove('hidden');
            }
        }

        function handleLogout() {
            userView.classList.add('hidden');
            adminView.classList.add('hidden');
            loginView.classList.remove('hidden');
        }

        function openComplaintModal() {
            complaintModal.classList.remove('hidden');
            setTimeout(() => {
                modalContent.classList.remove('scale-95', 'opacity-0');
                modalContent.classList.add('scale-100', 'opacity-100');
            }, 10);
        }

        function closeComplaintModal() {
             modalContent.classList.remove('scale-100', 'opacity-100');
             modalContent.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                 complaintModal.classList.add('hidden');
                 complaintForm.reset();
            }, 300);
        }

        complaintForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const newComplaint = {
                id: nextId++,
                user: 'user1', // Hardcoded for demo
                category: e.target.category.value,
                description: e.target.description.value,
                status: 'Pending',
                date: new Date().toISOString().split('T')[0]
            };
            complaints.push(newComplaint);
            renderAll();
            closeComplaintModal();
        });

        function updateStatus(id, newStatus) {
            const complaint = complaints.find(c => c.id === id);
            if (complaint) {
                complaint.status = newStatus;
                renderAll();
            }
        }

        // --- Initial Load ---
        window.onload = () => {
            loadSampleData();
        };

    </script>