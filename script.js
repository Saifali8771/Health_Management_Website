// --- Theme Toggling Logic ---
const themeToggleLight = document.getElementById('theme-light');
const themeToggleDark = document.getElementById('theme-dark');
const themeToggleNeon = document.getElementById('theme-neon');

function applyTheme(theme) {
    document.documentElement.className = ''; // Clear existing classes
    if (theme) {
        document.documentElement.classList.add(theme);
    }
    localStorage.setItem('theme', theme);
}

// Apply saved theme on load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light'; // Default to light
    applyTheme(savedTheme);
});

// Event listeners for theme buttons (on dashboard.html)
if (themeToggleLight) {
    themeToggleLight.addEventListener('click', () => applyTheme('light'));
    themeToggleDark.addEventListener('click', () => applyTheme('dark'));
    themeToggleNeon.addEventListener('click', () => applyTheme('neon'));
}


// --- Login/Signup Page (index.html) Logic ---
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const showSignupBtn = document.getElementById('show-signup');
const showLoginBtn = document.getElementById('show-login');

if (loginForm && signupForm) { // Only run on index.html
    showSignupBtn.addEventListener('click', function(e) {
        e.preventDefault();
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
    });

    showLoginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        signupForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });

    // Role switching logic
    const patientTab = document.getElementById('patient-tab');
    const doctorTab = document.getElementById('doctor-tab');
    const familyTab = document.getElementById('family-tab');

    const loginTitle = document.getElementById('login-title');
    const registerTitle = document.getElementById('register-title');

    const doctorFields = document.getElementById('doctor-fields');
    const patientFields = document.getElementById('patient-fields');
    const familyFields = document.getElementById('family-fields');

    let currentRole = 'doctor'; // Default role

    function switchRole(role) {
        currentRole = role;

        // Update tab styles
        patientTab.classList.remove('text-blue-600', 'border-blue-500');
        doctorTab.classList.remove('text-blue-600', 'border-blue-500');
        familyTab.classList.remove('text-blue-600', 'border-blue-500');

        patientTab.classList.add('text-gray-500', 'border-transparent');
        doctorTab.classList.add('text-gray-500', 'border-transparent');
        familyTab.classList.add('text-gray-500', 'border-transparent');

        if (role === 'patient') {
            patientTab.classList.add('text-blue-600', 'border-blue-500');
            loginTitle.textContent = 'Patient Login';
            registerTitle.textContent = 'Patient Registration';
        } else if (role === 'doctor') {
            doctorTab.classList.add('text-blue-600', 'border-blue-500');
            loginTitle.textContent = 'Doctor Login';
            registerTitle.textContent = 'Doctor Registration';
        } else if (role === 'family') {
            familyTab.classList.add('text-blue-600', 'border-blue-500');
            loginTitle.textContent = 'Family Login';
            registerTitle.textContent = 'Family Registration';
        }

        // Show/hide role-specific fields in signup form
        doctorFields.classList.add('hidden');
        patientFields.classList.add('hidden');
        familyFields.classList.add('hidden');

        if (role === 'doctor') {
            doctorFields.classList.remove('hidden');
        } else if (role === 'patient') {
            patientFields.classList.remove('hidden');
        } else if (role === 'family') {
            familyFields.classList.remove('hidden');
        }
    }

    patientTab.addEventListener('click', () => switchRole('patient'));
    doctorTab.addEventListener('click', () => switchRole('doctor'));
    familyTab.addEventListener('click', () => switchRole('family'));

    // Initial role setup
    switchRole(currentRole); // Set default to doctor

    // Handle form submissions (simulated)
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        console.log(`Simulating ${currentRole} login:`, { email, password });
        // In a real app, you'd send this to your backend for authentication
        // On success, store user info (e.g., in localStorage) and redirect
        localStorage.setItem('loggedInUserRole', currentRole);
        localStorage.setItem('loggedInUserName', email.split('@')[0]); // Simple mock name
        window.location.href = 'dashboard.html';
    });

    document.getElementById('signupForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm').value;

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        const formData = { name, email, password, role: currentRole };

        if (currentRole === 'patient') {
            formData.dob = document.getElementById('patient-dob').value;
            formData.condition = document.getElementById('patient-condition').value;
        } else if (currentRole === 'family') {
            formData.relationship = document.getElementById('family-relationship').value;
            formData.patientId = document.getElementById('patient-id').value;
        }

        console.log(`Simulating ${currentRole} registration:`, formData);
        // In a real app, send this to your backend for registration
        // On success, store user info and redirect
        localStorage.setItem('loggedInUserRole', currentRole);
        localStorage.setItem('loggedInUserName', name);
        window.location.href = 'dashboard.html';
    });

    // Google Sign In handler (frontend only)
    window.handleGoogleSignIn = function(response) {
        console.log('Google sign-in response:', response);
        const profile = jwt_decode(response.credential); // You'll need jwt-decode library for this
        console.log('Google Profile:', profile);

        // Simulate login based on Google profile
        localStorage.setItem('loggedInUserRole', currentRole); // Assume role from current tab
        localStorage.setItem('loggedInUserName', profile.name);
        window.location.href = 'dashboard.html';
    };
}


// --- Dashboard Page (dashboard.html) Logic ---
const navDashboard = document.getElementById('nav-dashboard');
const navPatients = document.getElementById('nav-patients');
const navAlerts = document.getElementById('nav-alerts');
const navAnalytics = document.getElementById('nav-analytics');
const navSettings = document.getElementById('nav-settings');

const doctorDashboardContent = document.getElementById('doctor-dashboard-content');
const patientDashboardContent = document.getElementById('patient-dashboard-content');
const familyDashboardContent = document.getElementById('family-dashboard-content');
const settingsContent = document.getElementById('settings-content');

const mainHeaderTitle = document.getElementById('main-header-title');
const sidebarUserName = document.getElementById('sidebar-user-name');
const sidebarUserRole = document.getElementById('sidebar-user-role');

if (navDashboard) { // Only run on dashboard.html
    const loggedInUserRole = localStorage.getItem('loggedInUserRole') || 'doctor'; // Default if not set
    const loggedInUserName = localStorage.getItem('loggedInUserName') || 'Guest User';

    sidebarUserName.textContent = loggedInUserName;
    sidebarUserRole.textContent = loggedInUserRole.charAt(0).toUpperCase() + loggedInUserRole.slice(1); // Capitalize

    function showContent(sectionId, title) {
        // Hide all content sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.add('hidden');
        });
        // Show the requested section
        document.getElementById(sectionId).classList.remove('hidden');
        mainHeaderTitle.textContent = title;

        // Update active link in sidebar
        document.querySelectorAll('.sidebar nav a').forEach(link => {
            link.classList.remove('active-link');
            link.classList.add('hover:bg-indigo-50', 'hover:text-indigo-700'); // Re-add hover classes
        });
        document.getElementById(`nav-${sectionId.replace('-content', '')}`).classList.add('active-link');
        document.getElementById(`nav-${sectionId.replace('-content', '')}`).classList.remove('hover:bg-indigo-50', 'hover:text-indigo-700');
    }

    // Initial content display based on role
    if (loggedInUserRole === 'doctor') {
        showContent('doctor-dashboard-content', 'Doctor Dashboard');
        navPatients.classList.remove('hidden'); // Doctors see patients list
        navAlerts.classList.remove('hidden');
        navAnalytics.classList.remove('hidden');
    } else if (loggedInUserRole === 'patient') {
        showContent('patient-dashboard-content', 'My Health Dashboard');
        navPatients.classList.add('hidden'); // Patients don't see other patients
        navAlerts.classList.add('hidden');
        navAnalytics.classList.add('hidden');
    } else if (loggedInUserRole === 'family') {
        showContent('family-dashboard-content', 'Monitored Patient Dashboard');
        navPatients.classList.add('hidden'); // Family doesn't see other patients
        navAlerts.classList.add('hidden');
        navAnalytics.classList.add('hidden');
    }

    // Sidebar navigation event listeners
    navDashboard.addEventListener('click', (e) => {
        e.preventDefault();
        if (loggedInUserRole === 'doctor') showContent('doctor-dashboard-content', 'Doctor Dashboard');
        else if (loggedInUserRole === 'patient') showContent('patient-dashboard-content', 'My Health Dashboard');
        else if (loggedInUserRole === 'family') showContent('family-dashboard-content', 'Monitored Patient Dashboard');
    });
    navPatients.addEventListener('click', (e) => {
        e.preventDefault();
        showContent('doctor-dashboard-content', 'Patients List'); // Re-using doctor content for patients list
    });
    navAlerts.addEventListener('click', (e) => {
        e.preventDefault();
        // This would ideally be a dedicated alerts page
        alert('Navigating to Alerts (placeholder)');
        showContent('doctor-dashboard-content', 'Alerts'); // Placeholder
    });
    navAnalytics.addEventListener('click', (e) => {
        e.preventDefault();
        // This would ideally be a dedicated analytics page
        alert('Navigating to Analytics (placeholder)');
        showContent('doctor-dashboard-content', 'Analytics'); // Placeholder
    });
    navSettings.addEventListener('click', (e) => {
        e.preventDefault();
        showContent('settings-content', 'Settings');
    });

    // Sidebar toggle for mobile
    document.getElementById('sidebar-toggle').addEventListener('click', function() {
        document.querySelector('.sidebar').classList.add('active');
    });

    document.getElementById('sidebar-close').addEventListener('click', function() {
        document.querySelector('.sidebar').classList.remove('active');
    });

    // Chart.js initialization for Doctor Dashboard
    const vitalCtx = document.getElementById('vital-trends');
    if (vitalCtx) { // Ensure the canvas element exists
        const vitalChart = new Chart(vitalCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '00:00'],
                datasets: [
                    {
                        label: 'Heart Rate',
                        data: [72, 68, 75, 82, 78, 76, 74],
                        borderColor: '#10B981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Systolic BP',
                        data: [118, 122, 125, 130, 128, 124, 120],
                        borderColor: '#F59E0B',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Oxygen %',
                        data: [98, 97, 96, 95, 96, 97, 98],
                        borderColor: '#3B82F6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        suggestedMin: 50,
                        suggestedMax: 150
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });

        // Simulate real-time data updates for Doctor Dashboard
        setInterval(() => {
            // Heart rate random fluctuation
            const hrFluctuation = (Math.random() * 4) - 2;
            const lastHr = vitalChart.data.datasets[0].data[vitalChart.data.datasets[0].data.length - 1];
            let newHr = lastHr + hrFluctuation;
            newHr = Math.max(60, Math.min(100, newHr));

            // BP random fluctuation
            const bpFluctuation = (Math.random() * 5) - 2.5;
            const lastBp = vitalChart.data.datasets[1].data[vitalChart.data.datasets[1].data.length - 1];
            let newBp = lastBp + bpFluctuation;
            newBp = Math.max(110, Math.min(140, newBp));

            // Oxygen random fluctuation
            const oxFluctuation = (Math.random() * 0.8) - 0.4;
            const lastOx = vitalChart.data.datasets[2].data[vitalChart.data.datasets[2].data.length - 1];
            let newOx = lastOx + oxFluctuation;
            newOx = Math.max(94, Math.min(100, newOx));

            // Shift all data left and add new point
            vitalChart.data.labels.shift();
            vitalChart.data.labels.push(new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));

            vitalChart.data.datasets[0].data.shift();
            vitalChart.data.datasets[0].data.push(Math.round(newHr));

            vitalChart.data.datasets[1].data.shift();
            vitalChart.data.datasets[1].data.push(Math.round(newBp));

            vitalChart.data.datasets[2].data.shift();
            vitalChart.data.datasets[2].data.push(parseFloat(newOx.toFixed(1)));

            vitalChart.update();

            // Update the vital cards with new random values
            const vitalCards = document.querySelectorAll('.vital-card h3');
            if (vitalCards.length >= 3) {
                vitalCards[0].innerHTML = Math.round(newHr) + ' <span class="text-sm font-normal text-gray-500">bpm</span>';
                vitalCards[1].innerHTML = Math.round(newBp) + '/' + Math.round(newBp * 0.75) + ' <span class="text-sm font-normal text-gray-500">mmHg</span>';
                vitalCards[2].innerHTML = newOx.toFixed(1) + ' <span class="text-sm font-normal text-gray-500">%</span>';
            }

        }, 3000);
    }
}

// --- JWT Decode for Google Sign-In (if needed) ---
// You would typically include a library like 'jwt-decode' for this.
// For a pure frontend demo, we'll mock it or assume it's available.
// If you're running this locally, you might need to add:
// <script src="https://unpkg.com/jwt-decode/build/jwt-decode.min.js"></script>
// to your index.html and dashboard.html <head> section.
if (typeof jwt_decode === 'undefined') {
    window.jwt_decode = function(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error("Failed to decode JWT:", e);
            return { name: "Google User", email: "google@example.com" }; // Fallback
        }
    };
}
