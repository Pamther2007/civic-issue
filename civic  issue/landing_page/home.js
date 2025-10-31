// Authentication Check and UI Update
(function() {
    const auth = JSON.parse(localStorage.getItem('civicReportAuth'));
    const userMenu = document.getElementById('userMenu');
    const authButtons = document.getElementById('authButtons');
    const userNameSpan = document.getElementById('userName');
    const contactInput = document.getElementById('contact');

    if (auth && auth.isLoggedIn) {
        // User is logged in
        userMenu.style.display = 'block';
        authButtons.style.display = 'none';
        userNameSpan.textContent = auth.firstName;
        
        // Pre-fill email in contact form
        if (contactInput) {
            contactInput.value = auth.email;
        }

        // Load user's reports
        loadUserReports();
    } else {
        // User is not logged in
        userMenu.style.display = 'none';
        authButtons.style.display = 'flex';
    }
})();

// Toggle dropdown menu
function toggleDropdown() {
    const dropdown = document.getElementById('dropdownMenu');
    dropdown.classList.toggle('active');
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    const userMenu = document.getElementById('userMenu');
    const dropdown = document.getElementById('dropdownMenu');
    
    if (userMenu && !userMenu.contains(e.target)) {
        dropdown.classList.remove('active');
    }
});

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('civicReportAuth');
        // Redirect to the login page in the parent folder
        window.location.href = '../login_ signup/login.html';
    }
}

// Show My Reports
function showMyReports() {
    const auth = JSON.parse(localStorage.getItem('civicReportAuth'));
    if (!auth) {
        window.location.href = '../login_ signup/login.html';
        return;
    }

    // Switch to track section
    document.querySelectorAll('section').forEach(s => s.style.display = 'none');
    document.getElementById('track').style.display = 'block';

    // Update active nav
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#track') {
            link.classList.add('active');
        }
    });

    // Load user's reports
    loadUserReports();
}

// Load User Reports
function loadUserReports() {
    const auth = JSON.parse(localStorage.getItem('civicReportAuth'));
    if (!auth) return;

    const allReports = JSON.parse(localStorage.getItem('civicReports')) || [];
    const userReports = allReports.filter(report => report.userEmail === auth.email);

    const reportsList = document.getElementById('reportsList');
    
    if (userReports.length === 0) {
        reportsList.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <i class="ri-file-list-line" style="font-size: 48px;"></i>
                <p>You haven't reported any issues yet.</p>
                <button class="btn btn-primary" onclick="showReportForm()">Report Your First Issue</button>
            </div>
        `;
        return;
    }

    reportsList.innerHTML = userReports.map(report => `
        <div class="report-card">
            <div class="report-header">
                <span class="report-id">#${report.id}</span>
                <span class="report-status status-${report.status}">${report.status}</span>
            </div>
            <h4>${report.issueType}</h4>
            <p>${report.description}</p>
            <div class="report-meta">
                <span><i class="ri-map-pin-line"></i> ${report.location}</span>
                <span><i class="ri-time-line"></i> ${new Date(report.date).toLocaleDateString()}</span>
            </div>
        </div>
    `).join('');

    // Update stats
    updateStats();
}

// Update Stats
function updateStats() {
    const allReports = JSON.parse(localStorage.getItem('civicReports')) || [];
    const resolved = allReports.filter(r => r.status === 'resolved').length;

    document.getElementById('totalReports').textContent = allReports.length;
    document.getElementById('resolvedReports').textContent = resolved;
}

// Check if user is logged in before reporting
function showReportForm() {
    const auth = JSON.parse(localStorage.getItem('civicReportAuth'));
    
    if (!auth || !auth.isLoggedIn) {
        if (confirm('Please login to report an issue. Do you want to login now?')) {
            window.location.href = '../login_ signup/login.html';
        }
        return;
    }

    // Show report form
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById('report').style.display = 'block';

    // Update active nav
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#report') {
            link.classList.add('active');
        }
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href').substring(1);
        
        // Hide all sections
        document.querySelectorAll('section').forEach(section => {
            section.style.display = 'none';
        });
        
        // Show target section
        document.getElementById(targetId).style.display = 'block';
        
        // Update active link
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// Mobile menu toggle
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateStats();
});

// Keep your existing home.js functions below...
// (getCurrentLocation, previewImage, resetForm, showMap, etc.)






// Global variables
let map;
let markers = [];
let reports = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadSampleData();
});

// Initialize application
function initializeApp() {
    // Set up navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    // Mobile menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    navToggle.addEventListener('click', toggleMobileMenu);
}

// Setup event listeners
function setupEventListeners() {
    // Form submission
    const reportForm = document.getElementById('reportForm');
    if (reportForm) {
        reportForm.addEventListener('submit', handleReportSubmit);
    }
}

// Navigation handling
function handleNavigation(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href').substring(1);
    showSection(targetId);
}

// Show specific section
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
        
        // Initialize map if showing map section
        if (sectionId === 'map' && !map) {
            setTimeout(initializeMap, 100);
        }
        
        // Load dashboard data if showing dashboard
        if (sectionId === 'dashboard') {
            loadDashboard();
        }
        
        // Load track reports if showing track section
        if (sectionId === 'track') {
            loadUserReports();
        }
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// Show report form
function showReportForm() {
    showSection('report');
    window.scrollTo(0, 0);
}

// Show map
function showMap() {
    showSection('map');
    if (!map) {
        setTimeout(initializeMap, 100);
    }
}

// Handle report form submission
function handleReportSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        id: generateReportId(),
        type: document.getElementById('issueType').value,
        priority: document.getElementById('priority').value,
        description: document.getElementById('description').value,
        location: document.getElementById('location').value,
        contact: document.getElementById('contact').value,
        status: 'pending',
        date: new Date().toISOString(),
        photo: document.getElementById('photo').files[0]
    };
    
    // Save report
    saveReport(formData);
    
    // Show success modal
    showSuccessModal(formData.id);
    
    // Reset form
    e.target.reset();
    document.getElementById('imagePreview').innerHTML = '';
}

// Generate unique report ID
function generateReportId() {
    return 'RPT-' + Date.now().toString(36).toUpperCase();
}

// Save report to local storage
function saveReport(report) {
    // Get existing reports
    let reports = JSON.parse(localStorage.getItem('civicReports')) || [];
    
    // Add new report
    reports.push(report);
    
    // Save to localStorage
    localStorage.setItem('civicReports', JSON.stringify(reports));
    
    // Update stats
    updateStats();
    
    // Add marker to map if exists
    if (map) {
        addMarkerToMap(report);
    }
}

// Show success modal
function showSuccessModal(reportId) {
    const modal = document.getElementById('successModal');
    document.getElementById('reportId').textContent = reportId;
    modal.classList.add('show');
}

// Close modal
function closeModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('show');
}

// Get current location
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                // Reverse geocoding would go here
                document.getElementById('location').value = `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
            },
            error => {
                alert('Unable to get your location. Please enter it manually.');
            }
        );
    } else {
        alert('Geolocation is not supported by your browser.');
    }
}

// Preview uploaded image
function previewImage(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('imagePreview');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
}

// Reset form
function resetForm() {
    document.getElementById('reportForm').reset();
    document.getElementById('imagePreview').innerHTML = '';
}

// Initialize map
function initializeMap() {
    // Create map centered on a default location
    map = L.map('issueMap').setView([40.7128, -74.0060], 13);
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    // Load existing reports as markers
    loadMapMarkers();
}

// Load markers on map
function loadMapMarkers() {
    const reports = JSON.parse(localStorage.getItem('civicReports')) || [];
    
    reports.forEach(report => {
        addMarkerToMap(report);
    });
}

// Add marker to map
function addMarkerToMap(report) {
    if (!map) return;
    
    // Parse coordinates (in real app, would geocode address)
    const coords = [
        40.7128 + (Math.random() - 0.5) * 0.1,
        -74.0060 + (Math.random() - 0.5) * 0.1
    ];
    
    // Create custom icon based on issue type
    const iconColor = getIconColor(report.type);
    
    // Create marker
    const marker = L.marker(coords).addTo(map);
    
    // Add popup
    marker.bindPopup(`
        <div class="map-popup">
            <h4>${report.type.charAt(0).toUpperCase() + report.type.slice(1)}</h4>
            <p>${report.description}</p>
            <small>Status: ${report.status}</small><br>
            <small>Priority: ${report.priority}</small>
        </div>
    `);
    
    markers.push({marker, type: report.type, status: report.status});
}

// Get icon color based on issue type
function getIconColor(type) {
    const colors = {
        pothole: '#ef4444',
        streetlight: '#f59e0b',
        trash: '#84cc16',
        graffiti: '#8b5cf6',
        water: '#3b82f6',
        sidewalk: '#ec4899',
        other: '#6b7280'
    };
    return colors[type] || colors.other;
}

// Filter map markers
function filterMarkers() {
    const typeFilter = document.getElementById('filterType').value;
    const statusFilter = document.getElementById('filterStatus').value;
    
    markers.forEach(({marker, type, status}) => {
        let show = true;
        
        if (typeFilter !== 'all' && type !== typeFilter) {
            show = false;
        }
        
        if (statusFilter !== 'all' && status !== statusFilter) {
            show = false;
        }
        
        if (show) {
            marker.setOpacity(1);
        } else {
            marker.setOpacity(0.3);
        }
    });
}

// Search reports
function searchReports() {
    const searchTerm = document.getElementById('trackingId').value.toLowerCase();
    const reports = JSON.parse(localStorage.getItem('civicReports')) || [];
    
    const filteredReports = reports.filter(report => 
        report.id.toLowerCase().includes(searchTerm) ||
        (report.contact && report.contact.toLowerCase().includes(searchTerm))
    );
    
    displayReports(filteredReports);
}

// Display reports in track section
function displayReports(reports) {
    const reportsList = document.getElementById('reportsList');
    
    if (reports.length === 0) {
        reportsList.innerHTML = '<p>No reports found.</p>';
        return;
    }
    
    reportsList.innerHTML = reports.map(report => `
        <div class="report-card">
            <div class="report-icon" style="background: ${getIconColor(report.type)}20; color: ${getIconColor(report.type)}">
                <i class="ri-${getIconForType(report.type)}"></i>
            </div>
            <div class="report-details">
                <h4>Report #${report.id}</h4>
                <p>${report.type.charAt(0).toUpperCase() + report.type.slice(1)} - ${report.description.substring(0, 50)}...</p>
                <p><i class="ri-map-pin-line"></i> ${report.location}</p>
                <p><i class="ri-calendar-line"></i> ${new Date(report.date).toLocaleDateString()}</p>
            </div>
            <div class="report-status status-${report.status}">
                ${report.status.charAt(0).toUpperCase() + report.status.slice(1)}
            </div>
        </div>
    `).join('');
}

// Get icon for issue type
function getIconForType(type) {
    const icons = {
        pothole: 'road-line',
        streetlight: 'lightbulb-line',
        trash: 'delete-bin-line',
        graffiti: 'paint-brush-line',
        water: 'drop-line',
        sidewalk: 'walk-line',
        other: 'error-warning-line'
    };
    return icons[type] || icons.other;
}

// Load user reports
function loadUserReports() {
    const reports = JSON.parse(localStorage.getItem('civicReports')) || [];
    displayReports(reports);
}

// Load dashboard
function loadDashboard() {
    loadRecentReports();
    createIssueChart();
    loadPerformanceStats();
}

// Load recent reports for dashboard
function loadRecentReports() {
    const reports = JSON.parse(localStorage.getItem('civicReports')) || [];
    const recentReports = reports.slice(-5).reverse();
    
    const recentReportsDiv = document.getElementById('recentReports');
    recentReportsDiv.innerHTML = recentReports.map(report => `
        <div class="recent-item">
            <div class="recent-item-icon">
                <i class="ri-${getIconForType(report.type)}"></i>
            </div>
            <div style="flex: 1;">
                <strong>${report.type.charAt(0).toUpperCase() + report.type.slice(1)}</strong>
                <p style="font-size: 0.875rem; color: #64748b; margin: 0;">
                    ${new Date(report.date).toLocaleString()}
                </p>
            </div>
            <span class="status-${report.status}" style="padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.75rem;">
                ${report.status}
            </span>
        </div>
    `).join('');
}

// Create issue distribution chart
function createIssueChart() {
    const reports = JSON.parse(localStorage.getItem('civicReports')) || [];
    
    // Count issues by type
    const issueCounts = {};
    reports.forEach(report => {
        issueCounts[report.type] = (issueCounts[report.type] || 0) + 1;
    });
    
    const ctx = document.getElementById('issueChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(issueCounts).map(key => key.charAt(0).toUpperCase() + key.slice(1)),
                datasets: [{
                    data: Object.values(issueCounts),
                    backgroundColor: [
                        '#ef4444',
                        '#f59e0b',
                        '#84cc16',
                        '#8b5cf6',
                        '#3b82f6',
                        '#ec4899',
                        '#6b7280'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// Load performance stats
function loadPerformanceStats() {
    const stats = document.querySelector('.performance-stats');
    if (stats) {
        stats.innerHTML = `
            <div style="display: grid; gap: 1rem;">
                <div style="display: flex; justify-content: space-between; padding: 1rem; background: #f8fafc; border-radius: 8px;">
                    <span>Public Works</span>
                    <strong>87%</strong>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 1rem; background: #f8fafc; border-radius: 8px;">
                    <span>Sanitation</span>
                    <strong>92%</strong>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 1rem; background: #f8fafc; border-radius: 8px;">
                    <span>Utilities</span>
                    <strong>78%</strong>
                </div>
            </div>
        `;
    }
}

// Update statistics
function updateStats() {
    const reports = JSON.parse(localStorage.getItem('civicReports')) || [];
    const resolved = reports.filter(r => r.status === 'resolved').length;
    
    document.getElementById('totalReports').textContent = reports.length;
    document.getElementById('resolvedReports').textContent = resolved;
}

// Load sample data for demonstration
function loadSampleData() {
    const existingReports = JSON.parse(localStorage.getItem('civicReports')) || [];
    
    if (existingReports.length === 0) {
        const sampleReports = [
            {
                id: 'RPT-SAMPLE1',
                type: 'pothole',
                priority: 'high',
                description: 'Large pothole on Main Street causing traffic issues',
                location: 'Main Street & 5th Avenue',
                contact: 'sample@email.com',
                status: 'inprogress',
                date: new Date(Date.now() - 86400000).toISOString()
            },
            {
                id: 'RPT-SAMPLE2',
                type: 'streetlight',
                priority: 'medium',
                description: 'Streetlight not working for past week',
                location: 'Park Road near Community Center',
                contact: 'user@email.com',
                status: 'pending',
                date: new Date(Date.now() - 172800000).toISOString()
            },
            {
                id: 'RPT-SAMPLE3',
                type: 'trash',
                priority: 'low',
                description: 'Overflowing trash bin in the park',
                location: 'Central Park East Entrance',
                contact: 'resident@email.com',
                status: 'resolved',
                date: new Date(Date.now() - 259200000).toISOString()
            }
        ];
        
        localStorage.setItem('civicReports', JSON.stringify(sampleReports));
    }
    
    updateStats();
}

// Handle window resize for responsive behavior
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        const navMenu = document.querySelector('.nav-menu');
        navMenu.classList.remove('active');
    }
});