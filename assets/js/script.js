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
                    const formData = new FormData(form);
                    const data = Object.fromEntries(formData);
                    fetch('http://localhost:3000/api/waste', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    })
                    .then(response => response.json())
                    .then(result => {
                        alert('Waste data submitted successfully!');
                        form.reset();
                        calculateWaste();
                    })
                    .catch(error => {
                        alert('Error submitting data: ' + error.message);
                    });
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

    // ===== Dashboard Data and Charts =====
    fetch('http://localhost:3000/api/waste')
        .then(response => response.json())
        .then(data => {
            // Calculate metrics
            const today = new Date().toISOString().split('T')[0];
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            const todayWaste = data.filter(row => row.date === today).reduce((sum, row) => sum + row.wasteQty, 0);
            const yesterdayWaste = data.filter(row => row.date === yesterdayStr).reduce((sum, row) => sum + row.wasteQty, 0);

            // For this week: Monday of current week
            const now = new Date();
            const monday = new Date(now.setDate(now.getDate() - now.getDay() + 1));
            const mondayStr = monday.toISOString().split('T')[0];
            const weekWaste = data.filter(row => row.date >= mondayStr).reduce((sum, row) => sum + row.wasteQty, 0);

            const costPerKg = 5; // Assume $5 per kg
            const costLost = weekWaste * costPerKg;

            // Update cards
            const cards = document.querySelectorAll('.dashboard-card');
            if (cards[0]) {
                cards[0].querySelector('.card-value').textContent = todayWaste.toFixed(2) + ' kg';
                if (yesterdayWaste > 0) {
                    const change = ((todayWaste - yesterdayWaste) / yesterdayWaste * 100).toFixed(1);
                    const changeText = change > 0 ? `${change}% more` : `${Math.abs(change)}% less`;
                    cards[0].querySelector('.card-change').innerHTML = `<i class="fas fa-arrow-${change > 0 ? 'up' : 'down'}"></i> ${changeText} than yesterday`;
                    cards[0].querySelector('.card-change').className = `card-change ${change > 0 ? 'negative' : 'positive'}`;
                }
            }
            if (cards[1]) {
                cards[1].querySelector('.card-value').textContent = weekWaste.toFixed(2) + ' kg';
            }
            if (cards[2]) {
                cards[2].querySelector('.card-value').textContent = '$' + costLost.toFixed(2);
            }
            if (cards[3]) {
                // Simple prediction: if today > average, high waste
                const totalWaste = data.reduce((sum, row) => sum + row.wasteQty, 0);
                const days = new Set(data.map(row => row.date)).size;
                const avgWaste = days > 0 ? totalWaste / days : 0;
                const prediction = todayWaste > avgWaste ? 'High waste expected tomorrow' : 'Normal waste expected tomorrow';
                cards[3].querySelector('.card-value').textContent = prediction;
            }

            // Line chart: group by date
            const dateGroups = {};
            data.forEach(row => {
                if (!dateGroups[row.date]) dateGroups[row.date] = 0;
                dateGroups[row.date] += row.wasteQty;
            });
            const labels = Object.keys(dateGroups).sort();
            const lineData = labels.map(date => dateGroups[date]);

            const lineChartCanvas = document.getElementById('lineChart');
            if (lineChartCanvas) {
                const ctx = lineChartCanvas.getContext('2d');
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Waste (kg)',
                            data: lineData,
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

            // Pie chart: group by foodItem
            const itemGroups = {};
            data.forEach(row => {
                if (!itemGroups[row.foodItem]) itemGroups[row.foodItem] = 0;
                itemGroups[row.foodItem] += row.wasteQty;
            });
            const pieLabels = Object.keys(itemGroups);
            const pieData = pieLabels.map(item => itemGroups[item]);

            const pieChartCanvas = document.getElementById('pieChart');
            if (pieChartCanvas) {
                const ctx = pieChartCanvas.getContext('2d');
                new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: pieLabels,
                        datasets: [{
                            data: pieData,
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
        })
        .catch(error => console.error('Error fetching data:', error));

    // ===== Analytics Charts =====
    fetch('http://localhost:3000/api/waste')
        .then(response => response.json())
        .then(data => {
            // Group by date for line chart
            const dateGroups = {};
            data.forEach(row => {
                if (!dateGroups[row.date]) dateGroups[row.date] = 0;
                dateGroups[row.date] += row.wasteQty;
            });
            const sortedDates = Object.keys(dateGroups).sort();
            const labels = sortedDates.slice(-10); // last 10 days
            const lineData = labels.map(date => dateGroups[date]);

            const analyticsLineChart = document.getElementById('analyticsLineChart');
            if (analyticsLineChart) {
                const ctx = analyticsLineChart.getContext('2d');
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Total Waste (kg)',
                            data: lineData,
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

            // Group by mealType for bar chart
            const mealGroups = {};
            data.forEach(row => {
                if (!mealGroups[row.mealType]) mealGroups[row.mealType] = 0;
                mealGroups[row.mealType] += row.wasteQty;
            });
            const barLabels = Object.keys(mealGroups);
            const barData = barLabels.map(meal => mealGroups[meal]);

            const analyticsBarChart = document.getElementById('analyticsBarChart');
            if (analyticsBarChart) {
                const ctx = analyticsBarChart.getContext('2d');
                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: barLabels,
                        datasets: [{
                            label: 'Waste (kg)',
                            data: barData,
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
        })
        .catch(error => console.error('Error fetching data for analytics:', error));

    // ===== Analytics Table Data =====
    const wasteTableBody = document.getElementById('waste-table-body');
    if (wasteTableBody) {
        fetch('http://localhost:3000/api/waste')
            .then(response => response.json())
            .then(data => {
                data.forEach(row => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${row.date}</td>
                        <td>${row.mealType}</td>
                        <td>${row.foodItem}</td>
                        <td>${row.preparedQty} kg</td>
                        <td>${row.consumedQty} kg</td>
                        <td>${row.wasteQty} kg</td>
                        <td>${row.location}</td>
                        <td>${row.reason}</td>
                    `;
                    wasteTableBody.appendChild(tr);
                });
            })
            .catch(error => console.error('Error fetching data:', error));
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

    // ===== Prediction Page =====
    fetch('http://localhost:3000/api/waste')
        .then(response => response.json())
        .then(data => {
            // Calculate average waste per day
            const dateGroups = {};
            data.forEach(row => {
                if (!dateGroups[row.date]) dateGroups[row.date] = 0;
                dateGroups[row.date] += row.wasteQty;
            });
            const wastes = Object.values(dateGroups);
            const avgWaste = wastes.reduce((sum, w) => sum + w, 0) / wastes.length;

            // Simple prediction: tomorrow's waste = average
            const predicted = avgWaste.toFixed(2);

            // Update main prediction
            const valueEl = document.querySelector('.prediction-value .value');
            if (valueEl) valueEl.textContent = predicted;

            const descEl = document.querySelector('.prediction-description');
            if (descEl) descEl.textContent = `Based on historical data, expected waste tomorrow is ${predicted} kg.`;

            // Update indicator
            const indicatorEl = document.querySelector('.prediction-indicator');
            if (indicatorEl) {
                // Simple: if avg > 10, high, else normal
                if (avgWaste > 10) {
                    indicatorEl.innerHTML = '<i class="fas fa-exclamation-triangle"></i> High Waste Expected';
                    indicatorEl.classList.add('warning');
                } else {
                    indicatorEl.innerHTML = '<i class="fas fa-check-circle"></i> Normal Waste Expected';
                    indicatorEl.classList.remove('warning');
                }
            }

            // Update recommendation
            const recEl = document.querySelector('.prediction-recommendation');
            if (recEl) {
                if (avgWaste > 10) {
                    recEl.innerHTML = '<i class="fas fa-lightbulb"></i> Reduce preparation by 15% to minimize waste.';
                } else {
                    recEl.innerHTML = '<i class="fas fa-thumbs-up"></i> Current preparation levels are optimal.';
                }
            }
        })
        .catch(error => console.error('Error fetching data for prediction:', error));
});