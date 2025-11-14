// ===== Navigation Toggle (Mobile) =====
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.querySelector('.sidebar');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            if (sidebar) {
                sidebar.classList.toggle('active');
            }
        });
    }

    // ===== Auth Form Toggle =====
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const authTitle = document.getElementById('auth-title');
    const authSubtitle = document.getElementById('auth-subtitle');
    const switchText = document.getElementById('switch-text');

    // Use event delegation for the switch link
    if (switchText) {
        switchText.addEventListener('click', function(e) {
            if (e.target && e.target.id === 'switch-link') {
                e.preventDefault();
                const isLoginVisible = loginForm && loginForm.style.display !== 'none';
                
                if (isLoginVisible) {
                    // Switch to Signup
                    if (loginForm) loginForm.style.display = 'none';
                    if (signupForm) signupForm.style.display = 'block';
                    if (authTitle) authTitle.textContent = 'Sign Up';
                    if (authSubtitle) authSubtitle.textContent = 'Create a new account to get started';
                    if (switchText) switchText.innerHTML = 'Already have an account? <a href="#" id="switch-link">Login</a>';
                } else {
                    // Switch to Login
                    if (loginForm) loginForm.style.display = 'block';
                    if (signupForm) signupForm.style.display = 'none';
                    if (authTitle) authTitle.textContent = 'Login';
                    if (authSubtitle) authSubtitle.textContent = 'Welcome back! Please login to your account';
                    if (switchText) switchText.innerHTML = 'Don\'t have an account? <a href="#" id="switch-link">Sign Up</a>';
                }
            }
        });
    }

    // ===== Form Validation =====
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            const inputs = form.querySelectorAll('input[required], select[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                const errorMsg = input.parentElement.querySelector('.error-message');
                if (!input.value.trim()) {
                    if (errorMsg) {
                        errorMsg.textContent = 'This field is required';
                    }
                    input.style.borderColor = '#e74c3c';
                    isValid = false;
                } else {
                    if (errorMsg) {
                        errorMsg.textContent = '';
                    }
                    input.style.borderColor = '#dfe6e9';
                }
            });

            // Email validation
            const emailInputs = form.querySelectorAll('input[type="email"]');
            emailInputs.forEach(input => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const errorMsg = input.parentElement.querySelector('.error-message');
                if (input.value && !emailRegex.test(input.value)) {
                    if (errorMsg) {
                        errorMsg.textContent = 'Please enter a valid email address';
                    }
                    input.style.borderColor = '#e74c3c';
                    isValid = false;
                }
            });

            if (isValid) {
                // Simulate form submission
                if (form.id === 'login-form' || form.id === 'signup-form') {
                    // Redirect to dashboard after successful login/signup
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 500);
                } else if (form.id === 'waste-form') {
                    // Show success message
                    alert('Waste data submitted successfully!');
                    form.reset();
                    calculateWaste();
                }
            }
        });
    });

    // ===== Waste Quantity Auto-calculation =====
    const preparedQty = document.getElementById('prepared-qty');
    const consumedQty = document.getElementById('consumed-qty');
    const wasteQty = document.getElementById('waste-qty');

    function calculateWaste() {
        if (preparedQty && consumedQty && wasteQty) {
            const prepared = parseFloat(preparedQty.value) || 0;
            const consumed = parseFloat(consumedQty.value) || 0;
            const waste = Math.max(0, prepared - consumed);
            wasteQty.value = waste.toFixed(2);
        }
    }

    if (preparedQty) {
        preparedQty.addEventListener('input', calculateWaste);
    }
    if (consumedQty) {
        consumedQty.addEventListener('input', calculateWaste);
    }

    // ===== Dashboard Charts =====
    const lineChartCanvas = document.getElementById('lineChart');
    if (lineChartCanvas) {
        const ctx = lineChartCanvas.getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Waste (kg)',
                    data: [15, 18, 12, 20, 16, 14, 12.5],
                    borderColor: '#2ecc71',
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    const pieChartCanvas = document.getElementById('pieChart');
    if (pieChartCanvas) {
        const ctx = pieChartCanvas.getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Rice', 'Curry', 'Bread', 'Vegetables', 'Other'],
                datasets: [{
                    data: [30, 25, 20, 15, 10],
                    backgroundColor: [
                        '#2ecc71',
                        '#3498db',
                        '#f39c12',
                        '#e74c3c',
                        '#9b59b6'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // ===== Analytics Charts =====
    const analyticsLineChart = document.getElementById('analyticsLineChart');
    if (analyticsLineChart) {
        const ctx = analyticsLineChart.getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Total Waste (kg)',
                    data: [95, 87, 102, 89],
                    borderColor: '#2ecc71',
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    const analyticsBarChart = document.getElementById('analyticsBarChart');
    if (analyticsBarChart) {
        const ctx = analyticsBarChart.getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Breakfast', 'Lunch', 'Dinner'],
                datasets: [{
                    label: 'Waste (kg)',
                    data: [25, 45, 30],
                    backgroundColor: [
                        '#2ecc71',
                        '#3498db',
                        '#f39c12'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // ===== Analytics Table Data =====
    const wasteTableBody = document.getElementById('waste-table-body');
    if (wasteTableBody) {
        const dummyData = [
            { date: '2024-11-14', meal: 'Breakfast', item: 'Rice', prepared: 25, consumed: 20, waste: 5, location: 'Hotel', reason: 'Over Preparation' },
            { date: '2024-11-14', meal: 'Lunch', item: 'Curry', prepared: 30, consumed: 25, waste: 5, location: 'Restaurant', reason: 'Leftovers' },
            { date: '2024-11-13', meal: 'Dinner', item: 'Bread', prepared: 15, consumed: 12, waste: 3, location: 'Canteen', reason: 'Over Preparation' },
            { date: '2024-11-13', meal: 'Breakfast', item: 'Vegetables', prepared: 20, consumed: 18, waste: 2, location: 'Hostel', reason: 'Poor Quality' },
            { date: '2024-11-12', meal: 'Lunch', item: 'Rice', prepared: 28, consumed: 22, waste: 6, location: 'Hotel', reason: 'Over Preparation' },
            { date: '2024-11-12', meal: 'Dinner', item: 'Curry', prepared: 22, consumed: 20, waste: 2, location: 'Restaurant', reason: 'Leftovers' },
            { date: '2024-11-11', meal: 'Breakfast', item: 'Bread', prepared: 18, consumed: 15, waste: 3, location: 'Canteen', reason: 'Over Preparation' }
        ];

        dummyData.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.date}</td>
                <td>${row.meal}</td>
                <td>${row.item}</td>
                <td>${row.prepared} kg</td>
                <td>${row.consumed} kg</td>
                <td>${row.waste} kg</td>
                <td>${row.location}</td>
                <td>${row.reason}</td>
            `;
            wasteTableBody.appendChild(tr);
        });
    }

    // ===== Filter Functionality =====
    const applyFiltersBtn = document.getElementById('apply-filters');
    const resetFiltersBtn = document.getElementById('reset-filters');

    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            // Filter logic would go here
            alert('Filters applied! (Demo functionality)');
        });
    }

    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            document.getElementById('filter-date-from').value = '';
            document.getElementById('filter-date-to').value = '';
            document.getElementById('filter-meal').value = '';
            document.getElementById('filter-location').value = '';
        });
    }

    // ===== Download Report =====
    const downloadReportBtn = document.getElementById('download-report');
    if (downloadReportBtn) {
        downloadReportBtn.addEventListener('click', function() {
            alert('Report download functionality would be implemented here!');
        });
    }

    // ===== Smooth Scrolling =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ===== Set default date to today =====
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }
});

