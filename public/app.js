// Colony Complaints Management System - Frontend JavaScript
const API_URL = '';
let currentComplaintId = null;
let currentReportData = null;
let currentLanguage = localStorage.getItem('language') || 'en';

// Translations
const translations = {
    en: {
        dashboard: 'Dashboard',
        complaints: 'Complaints',
        newComplaint: 'New Complaint',
        reports: 'Reports',
        pending: 'Pending',
        inProgress: 'Working',
        completed: 'Completed',
        today: 'Today',
        thisMonth: 'This Month',
        total: 'Total',
        recentComplaints: 'Recent Complaints',
        viewAll: 'View All',
        tradeSummary: 'Trade Summary (This Month)',
        date: 'Date',
        resident: 'Resident',
        trade: 'Trade',
        status: 'Status',
        allComplaints: 'All Complaints',
        search: 'Search...',
        allTrades: 'All Trades',
        allStatus: 'All Status',
        filter: 'Filter',
        reset: 'Reset',
        registerNewComplaint: 'Register New Complaint',
        residentName: 'Resident Name',
        flatNumber: 'Flat/Unit Number',
        contactNumber: 'Contact Number',
        assignTo: 'Assign To',
        complaintDescription: 'Complaint Description',
        remarks: 'Remarks',
        saveComplaint: 'Save Complaint',
        dailyReport: 'Daily Report',
        monthlyReport: 'Monthly Report',
        selectDate: 'Select Date',
        selectMonth: 'Select Month',
        generateDailyReport: 'Generate Daily Report',
        generateMonthlyReport: 'Generate Monthly Report',
        print: 'Print',
        exportCSV: 'Export CSV',
        updateComplaint: 'Update Complaint',
        cancel: 'Cancel',
        update: 'Update',
        footerText: 'Made for your colony',
        noComplaintsFound: 'No complaints found',
        deleteConfirm: 'Are you sure you want to delete this complaint?',
        success: 'Success',
        error: 'Error',
        warning: 'Warning'
    },
    ur: {
        dashboard: 'ڈیش بورڈ',
        complaints: 'شکایات',
        newComplaint: 'نئی شکایت',
        reports: 'رپورٹس',
        pending: 'زیر التوا',
        inProgress: 'جاری',
        completed: 'مکمل',
        today: 'آج',
        thisMonth: 'اس مہینے',
        total: 'کل',
        recentComplaints: 'حالیہ شکایات',
        viewAll: 'سب دیکھیں',
        tradeSummary: 'ٹریڈ کا خلاصہ (اس مہینے)',
        date: 'تاریخ',
        resident: 'رہائشی',
        trade: 'پیشہ',
        status: 'حالت',
        allComplaints: 'تمام شکایات',
        search: 'تلاش کریں...',
        allTrades: 'تمام پیشے',
        allStatus: 'تمام حالتیں',
        filter: 'فلٹر',
        reset: 'ری سیٹ',
        registerNewComplaint: 'نئی شکایت درج کریں',
        residentName: 'رہائشی کا نام',
        flatNumber: 'فلیٹ/یونٹ نمبر',
        contactNumber: 'رابطہ نمبر',
        assignTo: 'سونپیں',
        complaintDescription: 'شکایت کی تفصیل',
        remarks: 'ریمارکس',
        saveComplaint: 'شکایت محفوظ کریں',
        dailyReport: 'روزانہ رپورٹ',
        monthlyReport: 'ماہانہ رپورٹ',
        selectDate: 'تاریخ منتخب کریں',
        selectMonth: 'مہینہ منتخب کریں',
        generateDailyReport: 'روزانہ رپورٹ بنائیں',
        generateMonthlyReport: 'ماہانہ رپورٹ بنائیں',
        print: 'پرنٹ کریں',
        exportCSV: 'CSV ایکسپورٹ کریں',
        updateComplaint: 'شکایت اپ ڈیٹ کریں',
        cancel: 'منسوخ کریں',
        update: 'اپ ڈیٹ کریں',
        footerText: 'آپ کے کالونی کے لیے',
        noComplaintsFound: 'کوئی شکایت نہیں ملی',
        deleteConfirm: 'کیا آپ واقعی اس شکایت کو حذف کرنا چاہتے ہیں؟',
        success: 'کامیابی',
        error: 'خرابی',
        warning: 'انتباہ'
    }
};

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initializeDateInputs();
    loadTrades();
    setupNavigation();
    refreshDashboard();
    applyLanguage();
});

// ============ DARK MODE ============
let currentTheme = localStorage.getItem('theme') || 'light';

function initTheme() {
    applyTheme();
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
    applyTheme();
}

function applyTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');

    if (currentTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        themeIcon.className = 'fas fa-sun';
    } else {
        body.removeAttribute('data-theme');
        themeIcon.className = 'fas fa-moon';
    }
}

// ============ LANGUAGE ============
function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'ur' : 'en';
    localStorage.setItem('language', currentLanguage);
    applyLanguage();
}

function applyLanguage() {
    const t = translations[currentLanguage];

    // Update button text
    document.getElementById('lang-text').textContent = currentLanguage === 'en' ? 'اردو' : 'English';

    // Update all elements with data-key
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (t[key]) {
            el.textContent = t[key];
        }
    });

    // Update page title
    const pageTitle = document.getElementById('page-title');
    const currentPage = document.querySelector('.nav-item.active');
    if (currentPage) {
        const key = currentPage.querySelector('[data-key]')?.getAttribute('data-key');
        if (key && t[key]) {
            pageTitle.textContent = t[key];
        }
    }

    // Update placeholders
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.placeholder = t.search;

    // Update document direction for Urdu
    document.documentElement.dir = currentLanguage === 'ur' ? 'rtl' : 'ltr';
    document.body.classList.toggle('rtl', currentLanguage === 'ur');
}

function getText(key) {
    return translations[currentLanguage][key] || translations['en'][key] || key;
}

function initializeDateInputs() {
    const today = new Date().toISOString().split('T')[0];
    document.querySelector('input[name="date"]').value = today;
    document.getElementById('daily-report-date').value = today;
    document.getElementById('monthly-report-month').value = today.substring(0, 7);
}

function setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            showPage(page);
        });
    });
}

// ============ NAVIGATION ============
function showPage(pageName) {
    // Update nav
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === pageName);
    });

    // Update page title
    const titles = {
        'dashboard': getText('dashboard'),
        'complaints': getText('allComplaints'),
        'new-complaint': getText('registerNewComplaint'),
        'reports': getText('reports')
    };
    document.getElementById('page-title').textContent = titles[pageName] || getText('dashboard');

    // Show page
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(`${pageName}-page`).classList.add('active');

    // Refresh data based on page
    if (pageName === 'dashboard') {
        refreshDashboard();
    } else if (pageName === 'complaints') {
        loadComplaints();
    } else if (pageName === 'reports') {
        loadReportStats();
    }
}

// ============ API CALLS ============
async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_URL}/api${endpoint}`, options);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        showToast('Error: ' + error.message, 'error');
        throw error;
    }
}

// ============ TRADES ============
async function loadTrades() {
    try {
        const trades = await fetchAPI('/trades');
        populateTradeSelects(trades);
    } catch (error) {
        console.error('Failed to load trades');
    }
}

function populateTradeSelects(trades) {
    // Form select
    const formSelect = document.querySelector('select[name="trade_type"]');
    const filterSelect = document.getElementById('filter-trade');

    formSelect.innerHTML = '<option value="">Select Trade</option>' +
        trades.map(t => `<option value="${t.name}">${t.name}</option>`).join('');

    filterSelect.innerHTML = '<option value="All">All Trades</option>' +
        trades.map(t => `<option value="${t.name}">${t.name}</option>`).join('');
}

// ============ DASHBOARD ============
let tradeChartInstance = null;
let monthlyChartInstance = null;

async function refreshDashboard() {
    try {
        const stats = await fetchAPI('/stats');
        const allComplaints = await fetchAPI('/complaints');
        updateStats(stats);
        loadRecentComplaints();
        renderTradeSummary(stats.trade_breakdown);
        renderCharts(allComplaints);
        updateQuickStats(allComplaints);
        loadOverdueComplaints(allComplaints);
        updateNotificationBadge(stats.pending || 0);
    } catch (error) {
        console.error('Failed to refresh dashboard');
    }
}

function updateStats(stats) {
    document.getElementById('stat-pending').textContent = stats.pending || 0;
    document.getElementById('stat-inprogress').textContent = stats.in_progress || 0;
    document.getElementById('stat-completed').textContent = stats.completed || 0;
    document.getElementById('stat-today').textContent = stats.today_count || 0;
    document.getElementById('stat-month').textContent = stats.month_count || 0;
    document.getElementById('stat-total').textContent = stats.total_complaints || 0;
}

async function loadRecentComplaints() {
    try {
        const complaints = await fetchAPI('/complaints?limit=5');
        const tbody = document.getElementById('recent-complaints');
        tbody.innerHTML = complaints.slice(0, 5).map(c => `
            <tr>
                <td>${formatDate(c.date)}</td>
                <td>${escapeHtml(c.resident_name)}</td>
                <td>${c.trade_type}</td>
                <td>${getStatusBadge(c.status)}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Failed to load recent complaints');
    }
}

function renderTradeSummary(tradeStats) {
    if (!tradeStats || tradeStats.length === 0) {
        document.getElementById('trade-summary').innerHTML = '<p class="no-results">No data this month</p>';
        return;
    }

    const tradeIcons = {
        'Plumber': 'fa-faucet',
        'Electrician': 'fa-bolt',
        'Carpenter': 'fa-hammer',
        'Painter': 'fa-paint-roller',
        'Sweeper': 'fa-broom',
        'Mason': 'fa-trowel',
        'Gardener': 'fa-leaf',
        'Sewerage': 'fa-water'
    };

    const colors = ['bg-blue', 'bg-green', 'bg-orange', 'bg-purple', 'bg-teal', 'bg-indigo'];

    document.getElementById('trade-summary').innerHTML = tradeStats.map((t, i) => `
        <div class="trade-item">
            <div class="trade-name">
                <div class="trade-icon ${colors[i % colors.length]}">
                    <i class="fas ${tradeIcons[t.trade_type] || 'fa-wrench'}"></i>
                </div>
                ${t.trade_type}
            </div>
            <div class="trade-stats">
                <span class="pending"><i class="fas fa-clock"></i> ${t.pending}</span>
                <span class="completed"><i class="fas fa-check"></i> ${t.completed}</span>
                <span><strong>${t.count}</strong> total</span>
            </div>
        </div>
    `).join('');
}

function renderCharts(complaints) {
    // Trade-wise Pie Chart
    const tradeCounts = {};
    complaints.forEach(c => {
        tradeCounts[c.trade_type] = (tradeCounts[c.trade_type] || 0) + 1;
    });

    const tradeLabels = Object.keys(tradeCounts);
    const tradeData = Object.values(tradeCounts);

    const tradeCtx = document.getElementById('tradeChart');
    if (tradeCtx) {
        if (tradeChartInstance) tradeChartInstance.destroy();
        tradeChartInstance = new Chart(tradeCtx, {
            type: 'pie',
            data: {
                labels: tradeLabels,
                datasets: [{
                    data: tradeData,
                    backgroundColor: [
                        '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6',
                        '#14b8a6', '#6366f1', '#ec4899', '#f97316'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }

    // Monthly Trend Bar Chart
    const monthCounts = {};
    complaints.forEach(c => {
        const month = c.date.substring(0, 7); // YYYY-MM
        monthCounts[month] = (monthCounts[month] || 0) + 1;
    });

    const sortedMonths = Object.keys(monthCounts).sort();
    const last6Months = sortedMonths.slice(-6);
    const monthData = last6Months.map(m => monthCounts[m]);

    const monthCtx = document.getElementById('monthlyChart');
    if (monthCtx) {
        if (monthlyChartInstance) monthlyChartInstance.destroy();
        monthlyChartInstance = new Chart(monthCtx, {
            type: 'bar',
            data: {
                labels: last6Months.map(m => {
                    const [year, month] = m.split('-');
                    return new Date(year, month - 1).toLocaleDateString('en', { month: 'short', year: 'numeric' });
                }),
                datasets: [{
                    label: 'Complaints',
                    data: monthData,
                    backgroundColor: '#3b82f6'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true, ticks: { stepSize: 1 } }
                }
            }
        });
    }
}

function updateQuickStats(complaints) {
    // Average Resolution Time
    const completed = complaints.filter(c => c.status === 'Completed' && c.completed_date);
    if (completed.length > 0) {
        const totalDays = completed.reduce((sum, c) => {
            const start = new Date(c.date);
            const end = new Date(c.completed_date);
            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            return sum + days;
        }, 0);
        const avgDays = Math.round(totalDays / completed.length);
        document.getElementById('avg-resolution').textContent = avgDays;
    } else {
        document.getElementById('avg-resolution').textContent = '-';
    }

    // Busiest Trade
    const tradeCounts = {};
    complaints.forEach(c => {
        tradeCounts[c.trade_type] = (tradeCounts[c.trade_type] || 0) + 1;
    });
    const busiest = Object.entries(tradeCounts).sort((a, b) => b[1] - a[1])[0];
    document.getElementById('busiest-trade').textContent = busiest ? busiest[0] : '-';
}

function loadOverdueComplaints(complaints) {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));

    const overdue = complaints.filter(c => {
        if (c.status === 'Completed') return false;
        const complaintDate = new Date(c.date);
        return complaintDate < sevenDaysAgo;
    });

    const tbody = document.getElementById('overdue-complaints');
    const countEl = document.getElementById('overdue-count');

    countEl.textContent = overdue.length;

    if (overdue.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #10b981; padding: 20px;"><i class="fas fa-check-circle"></i> No overdue complaints!</td></tr>';
        return;
    }

    tbody.innerHTML = overdue.map(c => {
        const complaintDate = new Date(c.date);
        const daysPending = Math.floor((now - complaintDate) / (1000 * 60 * 60 * 24));

        return `
            <tr style="background: #fef2f2; cursor: pointer;" onclick="editComplaint(${c.id})" class="overdue-row">
                <td style="color: #dc2626; font-weight: 600;">${formatDate(c.date)}</td>
                <td style="color: #dc2626; font-weight: 700;">${daysPending} days</td>
                <td style="color: #1e293b;">${escapeHtml(c.resident_name)}</td>
                <td style="color: #1e293b;">${c.flat_number}</td>
                <td style="color: #1e293b;">${c.trade_type}</td>
                <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #1e293b;">${escapeHtml(c.complaint_description)}</td>
                <td>${getStatusBadge(c.status)}</td>
            </tr>
        `;
    }).join('');
}

function updateNotificationBadge(pendingCount) {
    const badge = document.getElementById('pending-badge');
    if (pendingCount > 5) {
        badge.textContent = pendingCount;
        badge.style.display = 'block';
    } else {
        badge.style.display = 'none';
    }
}

// ============ REAL-TIME SEARCH ============
function realTimeSearch() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();
    const countEl = document.getElementById('search-results-count');

    if (!searchTerm) {
        loadComplaints();
        if (countEl) countEl.textContent = '';
        return;
    }

    // Get current filtered complaints
    const checkboxes = document.querySelectorAll('.complaint-checkbox');
    const visibleIds = Array.from(checkboxes).map(cb => parseInt(cb.value));
    const currentComplaints = allComplaints.filter(c => visibleIds.includes(c.id));

    const filtered = currentComplaints.filter(c => {
        return (
            c.flat_number?.toLowerCase().includes(searchTerm) ||
            c.contact_number?.toLowerCase().includes(searchTerm) ||
            c.trade_type?.toLowerCase().includes(searchTerm) ||
            c.status?.toLowerCase().includes(searchTerm) ||
            c.complaint_description?.toLowerCase().includes(searchTerm) ||
            c.assigned_to?.toLowerCase().includes(searchTerm) ||
            String(c.id).includes(searchTerm)
        );
    });

    renderComplaintsTable(filtered, searchTerm);
    if (countEl) countEl.textContent = `${filtered.length} found`;
}

// Store all complaints for search
let allComplaints = [];

// ============ COMPLAINTS LIST ============
let pendingFilterStatus = null;
let pendingDateFilter = null;

function filterByStatus(status) {
    pendingFilterStatus = status;
    pendingDateFilter = null;
    showPage('complaints');
}

function filterByDate(type) {
    pendingDateFilter = type;
    pendingFilterStatus = null;
    showPage('complaints');
}

async function loadComplaints() {
    try {
        const complaints = await fetchAPI('/complaints');
        allComplaints = complaints; // Store for search
        renderComplaintsTable(complaints);

        // Apply pending status filter if set
        if (pendingFilterStatus) {
            document.getElementById('filter-status').value = pendingFilterStatus;
            document.getElementById('filter-start-date').value = '';
            document.getElementById('filter-end-date').value = '';
            applyFilters();
            pendingFilterStatus = null;
        }
        // Apply pending date filter if set
        else if (pendingDateFilter) {
            document.getElementById('filter-status').value = 'All';
            const today = new Date().toISOString().split('T')[0];

            if (pendingDateFilter === 'today') {
                document.getElementById('filter-start-date').value = today;
                document.getElementById('filter-end-date').value = today;
            } else if (pendingDateFilter === 'month') {
                const firstDay = today.substring(0, 7) + '-01';
                document.getElementById('filter-start-date').value = firstDay;
                document.getElementById('filter-end-date').value = today;
            } else if (pendingDateFilter === 'all') {
                document.getElementById('filter-start-date').value = '';
                document.getElementById('filter-end-date').value = '';
            }
            applyFilters();
            pendingDateFilter = null;
        }
    } catch (error) {
        console.error('Failed to load complaints');
    }
}

function renderComplaintsTable(complaints, searchTerm = '') {
    const grid = document.getElementById('complaints-grid');
    const noResults = document.getElementById('no-results');

    if (complaints.length === 0) {
        grid.innerHTML = '';
        noResults.classList.remove('hidden');
        return;
    }

    noResults.classList.add('hidden');
    grid.innerHTML = complaints.map(c => {
        const daysPending = c.status === 'Pending' ? Math.floor((new Date() - new Date(c.date)) / (1000 * 60 * 60 * 24)) : 0;
        const isOverdue = daysPending >= 7;

        return `
        <div class="complaint-card ${isOverdue ? 'overdue-card' : ''}" onclick="event.target.tagName !== 'BUTTON' && event.target.tagName !== 'INPUT' && editComplaint(${c.id})">
            <input type="checkbox" class="complaint-checkbox" value="${c.id}" onclick="event.stopPropagation(); updateSelectedCount()">

            <div class="complaint-card-header">
                <div>
                    <div class="complaint-id">#${String(c.id).padStart(4, '0')}</div>
                    <div class="complaint-date">
                        <i class="fas fa-calendar"></i> ${formatDate(c.date)}
                        ${isOverdue ? `<span style="color: var(--danger); font-weight: 600; margin-left: 8px;">⚠ ${daysPending} days</span>` : ''}
                    </div>
                </div>
                <span class="complaint-trade-badge">
                    <i class="fas fa-tools"></i> ${c.trade_type}
                </span>
            </div>

            <div class="complaint-card-body">
                <div class="complaint-info-row">
                    <i class="fas fa-home"></i>
                    <span class="complaint-info-label">House/Qtr:</span>
                    <span class="complaint-info-value">${escapeHtml(c.flat_number)}</span>
                </div>
                <div class="complaint-info-row">
                    <i class="fas fa-phone"></i>
                    <span class="complaint-info-label">Contact:</span>
                    <span class="complaint-info-value">${escapeHtml(c.contact_number || 'N/A')}</span>
                </div>
                <div class="complaint-info-row">
                    <i class="fas fa-user"></i>
                    <span class="complaint-info-label">Assigned:</span>
                    <span class="complaint-info-value">${escapeHtml(c.assigned_to || 'Not Assigned')}</span>
                </div>

                <div class="complaint-description">
                    <strong><i class="fas fa-file-alt"></i> Description:</strong><br>
                    ${escapeHtml(c.complaint_description)}
                </div>
            </div>

            <div class="complaint-card-footer">
                <span class="complaint-status-badge status-${c.status.toLowerCase().replace(/\s/g, '-')}">
                    ${c.status}
                </span>
                <div class="complaint-actions">
                    <button class="btn btn-info btn-sm" onclick="event.stopPropagation(); printSingleSlip(${c.id})" title="Print Slip">
                        <i class="fas fa-print"></i>
                    </button>
                    <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); editComplaint(${c.id})" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="event.stopPropagation(); deleteComplaint(${c.id})" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `}).join('');

    updateSelectedCount();
}

async function applyFilters() {
    const search = document.getElementById('search-input').value;
    const trade = document.getElementById('filter-trade').value;
    const status = document.getElementById('filter-status').value;
    const startDate = document.getElementById('filter-start-date').value;
    const endDate = document.getElementById('filter-end-date').value;

    let query = '/complaints?';
    if (search) query += `search=${encodeURIComponent(search)}&`;
    if (trade !== 'All') query += `trade=${encodeURIComponent(trade)}&`;
    if (status !== 'All') query += `status=${encodeURIComponent(status)}&`;
    if (startDate) query += `startDate=${startDate}&`;
    if (endDate) query += `endDate=${endDate}&`;

    try {
        const complaints = await fetchAPI(query);
        renderComplaintsTable(complaints);
    } catch (error) {
        console.error('Failed to filter complaints');
    }
}

function resetFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('filter-trade').value = 'All';
    document.getElementById('filter-status').value = 'All';
    document.getElementById('filter-start-date').value = '';
    document.getElementById('filter-end-date').value = '';
    loadComplaints();
}

// ============ NEW COMPLAINT ============
async function submitComplaint(event) {
    event.preventDefault();
    const form = event.target;
    const data = Object.fromEntries(new FormData(form));

    // Use flat_number as resident_name for database compatibility
    data.resident_name = 'Resident - ' + data.flat_number;

    try {
        await fetchAPI('/complaints', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        showToast(getText('success'), 'success');
        form.reset();
        document.querySelector('input[name="date"]').value = new Date().toISOString().split('T')[0];
        showPage('dashboard');
    } catch (error) {
        showToast(getText('error'), 'error');
    }
}

// ============ EDIT COMPLAINT ============
async function editComplaint(id) {
    try {
        const complaint = await fetchAPI(`/complaints/${id}`);
        currentComplaintId = id;

        const form = document.getElementById('edit-form');
        form.elements['status'].value = complaint.status;
        form.elements['assigned_to'].value = complaint.assigned_to || '';
        form.elements['remarks'].value = complaint.remarks || '';

        document.getElementById('edit-modal').classList.remove('hidden');
    } catch (error) {
        showToast('Failed to load complaint details', 'error');
    }
}

async function updateComplaint(event) {
    event.preventDefault();
    const form = event.target;
    const data = Object.fromEntries(new FormData(form));

    try {
        await fetchAPI(`/complaints/${currentComplaintId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        showToast('Complaint updated successfully!', 'success');
        closeModal();
        loadComplaints();
        refreshDashboard();
    } catch (error) {
        showToast('Failed to update complaint', 'error');
    }
}

function closeModal() {
    document.getElementById('edit-modal').classList.add('hidden');
    currentComplaintId = null;
}

// ============ DELETE COMPLAINT ============
async function deleteComplaint(id) {
    if (!confirm(getText('deleteConfirm'))) return;

    try {
        await fetchAPI(`/complaints/${id}`, { method: 'DELETE' });
        showToast('Complaint deleted successfully!', 'success');
        loadComplaints();
        refreshDashboard();
    } catch (error) {
        showToast('Failed to delete complaint', 'error');
    }
}

// ============ BATCH PRINT FUNCTIONS ============
function toggleSelectAll() {
    const selectAll = document.getElementById('select-all') || document.getElementById('select-all-header');
    const checkboxes = document.querySelectorAll('.complaint-checkbox');
    checkboxes.forEach(cb => cb.checked = selectAll.checked);
    updateSelectedCount();
}

function updateSelectedCount() {
    const count = document.querySelectorAll('.complaint-checkbox:checked').length;
    const countEl = document.getElementById('selected-count');
    if (countEl) countEl.textContent = count;
}

// Update count when individual checkbox changes
document.addEventListener('change', function(e) {
    if (e.target.classList.contains('complaint-checkbox')) {
        updateSelectedCount();
    }
});

async function printSelectedComplaints() {
    const selectedIds = Array.from(document.querySelectorAll('.complaint-checkbox:checked'))
        .map(cb => parseInt(cb.value));

    if (selectedIds.length === 0) {
        showToast('Please select at least one complaint', 'warning');
        return;
    }

    try {
        // Fetch all selected complaints
        const complaints = await Promise.all(
            selectedIds.map(id => fetchAPI(`/complaints/${id}`))
        );

        // Generate batch print HTML
        const printHTML = generateBatchPrintHTML(complaints);

        const printWindow = window.open('', '_blank');
        printWindow.document.write(printHTML);
        printWindow.document.close();
    } catch (error) {
        showToast('Failed to load complaints for printing', 'error');
    }
}

function generateBatchPrintHTML(complaints) {
    const slipsHTML = complaints.map(c => `
        <div class="slip-item">
            <div class="slip-container-compact">
                <div class="slip-header-compact">
                    <div class="slip-id-compact">#${String(c.id).padStart(4, '0')}</div>
                    <h2>COMPLAINT RECEIPT</h2>
                </div>
                <div class="info-row-compact">
                    <span class="info-label-compact">Date:</span>
                    <span class="info-value-compact">${formatDate(c.date)}</span>
                </div>
                <div class="info-row-compact">
                    <span class="info-label-compact">Flat:</span>
                    <span class="info-value-compact">${escapeHtml(c.flat_number)}</span>
                </div>
                <div class="info-row-compact">
                    <span class="info-label-compact">Contact:</span>
                    <span class="info-value-compact">${escapeHtml(c.contact_number || 'N/A')}</span>
                </div>
                <div class="info-row-compact">
                    <span class="info-label-compact">Trade:</span>
                    <span class="info-value-compact">${c.trade_type}</span>
                </div>
                <div class="info-row-compact">
                    <span class="info-label-compact">Status:</span>
                    <span class="info-value-compact"><span class="status-badge-compact status-${c.status.toLowerCase().replace(/\\s/g, '-')}">${c.status}</span></span>
                </div>
                <div class="description-box-compact">
                    <p>${escapeHtml(c.complaint_description.substring(0, 60))}${c.complaint_description.length > 60 ? '...' : ''}</p>
                </div>
            </div>
        </div>
    `).join('');

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Batch Complaint Receipts</title>
    <style>
        @page {
            size: A4;
            margin: 10mm;
        }
        @media print {
            body { margin: 0; padding: 5mm; }
            .no-print { display: none; }
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            background: white;
            padding: 10px;
        }
        .print-header {
            text-align: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #333;
        }
        .print-header h1 {
            font-size: 18px;
            color: #333;
        }
        .print-header p {
            font-size: 12px;
            color: #666;
        }
        .receipts-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
        }
        .slip-item {
            break-inside: avoid;
        }
        .slip-container-compact {
            background: white;
            border: 1.5px solid #333;
            padding: 8px;
            border-radius: 4px;
            font-size: 9px;
            height: 95mm;
        }
        .slip-header-compact {
            text-align: center;
            border-bottom: 1px solid #4f46e5;
            padding-bottom: 5px;
            margin-bottom: 6px;
        }
        .slip-header-compact h2 {
            color: #4f46e5;
            font-size: 11px;
            margin-top: 3px;
        }
        .slip-id-compact {
            background: #4f46e5;
            color: white;
            display: inline-block;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 10px;
            font-weight: bold;
        }
        .info-row-compact {
            display: flex;
            justify-content: space-between;
            padding: 3px 0;
            border-bottom: 1px dashed #ddd;
        }
        .info-label-compact {
            font-weight: 600;
            color: #555;
            font-size: 9px;
        }
        .info-value-compact {
            color: #333;
            font-size: 9px;
            text-align: right;
            max-width: 55%;
        }
        .status-badge-compact {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 8px;
            font-size: 8px;
            font-weight: 600;
        }
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-in-progress { background: #dbeafe; color: #1e40af; }
        .status-completed { background: #d1fae5; color: #065f46; }
        .description-box-compact {
            background: #f8fafc;
            padding: 5px;
            border-radius: 3px;
            margin-top: 5px;
            border-left: 2px solid #4f46e5;
        }
        .description-box-compact p {
            font-size: 8px;
            color: #333;
            line-height: 1.3;
        }
        .print-btn {
            display: block;
            width: 200px;
            margin: 20px auto;
            padding: 10px;
            background: #4f46e5;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
        }
        .print-btn:hover { background: #4338ca; }
    </style>
</head>
<body>
    <div class="no-print">
        <button class="print-btn" onclick="window.print()">Print All Receipts</button>
    </div>
    <div class="print-header">
        <h1>Colony Complaints - Batch Receipts</h1>
        <p>Total: ${complaints.length} complaints | Generated: ${new Date().toLocaleString()}</p>
    </div>
    <div class="receipts-grid">
        ${slipsHTML}
    </div>
    <script>
        window.onload = function() {
            setTimeout(() => window.print(), 500);
        };
    </script>
</body>
</html>`;
}

// ============ PDF EXPORT ============
async function exportSinglePDF(id) {
    try {
        showToast('Generating PDF...', 'info');
        const response = await fetch(`${API_URL}/api/export/pdf/${id}`);
        if (!response.ok) throw new Error('Failed to generate PDF');

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `complaint-${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        showToast('PDF downloaded!', 'success');
    } catch (error) {
        showToast('Failed to export PDF: ' + error.message, 'error');
    }
}

async function exportBatchPDF() {
    const selectedIds = Array.from(document.querySelectorAll('.complaint-checkbox:checked'))
        .map(cb => parseInt(cb.value));

    if (selectedIds.length === 0) {
        showToast('Please select at least one complaint', 'warning');
        return;
    }

    try {
        showToast('Generating batch PDF...', 'info');
        const response = await fetch(`${API_URL}/api/export/pdf/batch`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: selectedIds })
        });

        if (!response.ok) throw new Error('Failed to generate PDF');

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `complaints-batch-${Date.now()}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        showToast('Batch PDF downloaded!', 'success');
    } catch (error) {
        showToast('Failed to export batch PDF: ' + error.message, 'error');
    }
}

async function exportReportPDF() {
    if (!currentReportData || !currentReportData.complaints.length) {
        showToast('No report data to export', 'warning');
        return;
    }

    try {
        showToast('Generating PDF report...', 'info');
        const title = document.getElementById('report-title').textContent;
        const response = await fetch(`${API_URL}/api/export/pdf/report`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                complaints: currentReportData.complaints,
                summary: currentReportData.summary
            })
        });

        if (!response.ok) throw new Error('Failed to generate PDF');

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        showToast('PDF report downloaded!', 'success');
    } catch (error) {
        showToast('Failed to export PDF report: ' + error.message, 'error');
    }
}

// ============ SINGLE PRINT COMPLAINT SLIP ============
async function printComplaintSlip(id) {
    try {
        console.log('Loading complaint for print:', id);
        const complaint = await fetchAPI(`/complaints/${id}`);
        console.log('Complaint loaded:', complaint);

        const slipHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Complaint Slip #${complaint.id}</title>
    <style>
        @media print {
            body { margin: 0; padding: 10mm; }
            .no-print { display: none; }
            .page-break { page-break-after: always; }
        }
        @page {
            size: A4;
            margin: 10mm;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            background: white;
        }
        .receipts-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            width: 100%;
        }
        .slip-container {
            background: white;
            border: 1.5px solid #333;
            padding: 12px;
            border-radius: 6px;
            font-size: 11px;
            height: 120mm;
            overflow: hidden;
        }
        .slip-header {
            text-align: center;
            border-bottom: 1.5px solid #4f46e5;
            padding-bottom: 8px;
            margin-bottom: 10px;
        }
        .slip-header h2 {
            color: #4f46e5;
            font-size: 14px;
            margin-bottom: 3px;
        }
        .slip-header p {
            color: #666;
            font-size: 9px;
        }
        .slip-id {
            background: #4f46e5;
            color: white;
            display: inline-block;
            padding: 3px 10px;
            border-radius: 15px;
            font-size: 11px;
            font-weight: bold;
            margin-bottom: 8px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            border-bottom: 1px dashed #ddd;
        }
        .info-label {
            font-weight: 600;
            color: #555;
            font-size: 10px;
        }
        .info-value {
            color: #333;
            font-size: 10px;
            text-align: right;
            max-width: 60%;
        }
        .status-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 9px;
            font-weight: 600;
        }
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-in-progress { background: #dbeafe; color: #1e40af; }
        .status-completed { background: #d1fae5; color: #065f46; }
        .description-box {
            background: #f8fafc;
            padding: 8px;
            border-radius: 4px;
            margin-top: 8px;
            border-left: 2px solid #4f46e5;
        }
        .description-box h4 {
            font-size: 9px;
            color: #666;
            margin-bottom: 4px;
        }
        .description-box p {
            font-size: 10px;
            color: #333;
            line-height: 1.4;
            max-height: 40px;
            overflow: hidden;
        }
        .footer {
            margin-top: 10px;
            padding-top: 8px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            font-size: 8px;
            color: #999;
        }
        .print-btn {
            display: block;
            width: 200px;
            margin: 15px auto;
            padding: 10px;
            background: #4f46e5;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
        }
        .print-btn:hover { background: #4338ca; }
    </style>
</head>
<body>
    <div class="no-print" style="text-align: center; margin-bottom: 15px;">
        <button class="print-btn" onclick="window.print()">Print Receipt</button>
        <p style="color: #666; font-size: 12px;">Receipt will be 6 per A4 page when printed</p>
    </div>
    <div class="receipts-grid">
    <div class="slip-container">
        <div class="slip-header">
            <div class="slip-id">#${String(complaint.id).padStart(4, '0')}</div>
            <h2>COMPLAINT RECEIPT</h2>
            <p>Colony Complaints System</p>
        </div>
        <div class="info-row">
            <span class="info-label">Date:</span>
            <span class="info-value">${formatDate(complaint.date)}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Flat/Unit:</span>
            <span class="info-value">${escapeHtml(complaint.flat_number)}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Contact:</span>
            <span class="info-value">${escapeHtml(complaint.contact_number || 'N/A')}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Trade Type:</span>
            <span class="info-value">${complaint.trade_type}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Status:</span>
            <span class="info-value">
                <span class="status-badge status-${complaint.status.toLowerCase().replace(/\\s/g, '-')}">${complaint.status}</span>
            </span>
        </div>
        <div class="info-row">
            <span class="info-label">Assigned To:</span>
            <span class="info-value">${escapeHtml(complaint.assigned_to || 'Not Assigned')}</span>
        </div>
        <div class="description-box">
            <h4>Complaint Details:</h4>
            <p>${escapeHtml(complaint.complaint_description)}</p>
        </div>
        ${complaint.remarks ? `
        <div class="description-box" style="border-left-color: #10b981; margin-top: 10px;">
            <h4>Remarks:</h4>
            <p>${escapeHtml(complaint.remarks)}</p>
        </div>
        ` : ''}
        <div class="footer">
            <p>Generated: ${new Date().toLocaleDateString()}</p>
        </div>
    </div>
    </div>
    <script>
        window.onload = function() {
            setTimeout(() => window.print(), 500);
        };
    </script>
</body>
</html>`;

        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            showToast('Please allow popups to print slips', 'warning');
            return;
        }
        printWindow.document.write(slipHTML);
        printWindow.document.close();
    } catch (error) {
        showToast('Failed to load complaint for printing', 'error');
    }
}

// ============ SINGLE PRINT COMPLAINT SLIP ============
async function printSingleSlip(id) {
    try {
        console.log('Loading complaint for print:', id);
        const complaint = await fetchAPI(`/complaints/${id}`);

        const slipHTML = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Complaint Slip #${complaint.id}</title>
    <style>
        @page { size: A4; margin: 10mm; }
        @media print { body { margin: 0; padding: 5mm; } .no-print { display: none; } }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; background: white; padding: 20px; }
        .slip-wrapper { max-width: 400px; margin: 0 auto; }
        .slip-container { background: white; border: 2px solid #333; padding: 25px; border-radius: 8px; }
        .slip-header { text-align: center; border-bottom: 2px solid #4f46e5; padding-bottom: 15px; margin-bottom: 20px; }
        .slip-header h2 { color: #4f46e5; font-size: 20px; margin-bottom: 5px; }
        .slip-header p { color: #666; font-size: 12px; }
        .slip-id { background: #4f46e5; color: white; display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 14px; font-weight: bold; margin-bottom: 15px; }
        .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px dashed #ddd; }
        .info-label { font-weight: 600; color: #555; font-size: 13px; }
        .info-value { color: #333; font-size: 13px; text-align: right; max-width: 60%; }
        .status-badge { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; }
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-in-progress { background: #dbeafe; color: #1e40af; }
        .status-completed { background: #d1fae5; color: #065f46; }
        .description-box { background: #f8fafc; padding: 12px; border-radius: 6px; margin-top: 15px; border-left: 3px solid #4f46e5; }
        .description-box h4 { font-size: 12px; color: #666; margin-bottom: 8px; }
        .description-box p { font-size: 13px; color: #333; line-height: 1.5; }
        .footer { margin-top: 25px; padding-top: 15px; border-top: 2px solid #e5e7eb; text-align: center; font-size: 11px; color: #999; }
        .print-btn { display: block; width: 200px; margin: 20px auto; padding: 12px; background: #4f46e5; color: white; border: none; border-radius: 6px; font-size: 16px; cursor: pointer; }
        .print-btn:hover { background: #4338ca; }
    </style>
</head>
<body>
    <div class="no-print">
        <button class="print-btn" onclick="window.print()">Print Receipt</button>
    </div>
    <div class="slip-wrapper">
        <div class="slip-container">
            <div class="slip-header">
                <div class="slip-id">#${String(complaint.id).padStart(4, '0')}</div>
                <h2>COMPLAINT RECEIPT</h2>
                <p>Colony Complaints System</p>
            </div>
            <div class="info-row"><span class="info-label">Date:</span><span class="info-value">${formatDate(complaint.date)}</span></div>
            <div class="info-row"><span class="info-label">Flat/Unit:</span><span class="info-value">${escapeHtml(complaint.flat_number)}</span></div>
            <div class="info-row"><span class="info-label">Contact:</span><span class="info-value">${escapeHtml(complaint.contact_number || 'N/A')}</span></div>
            <div class="info-row"><span class="info-label">Trade Type:</span><span class="info-value">${complaint.trade_type}</span></div>
            <div class="info-row"><span class="info-label">Status:</span><span class="info-value"><span class="status-badge status-${complaint.status.toLowerCase().replace(/\\s/g, '-')}">${complaint.status}</span></span></div>
            <div class="info-row"><span class="info-label">Assigned To:</span><span class="info-value">${escapeHtml(complaint.assigned_to || 'Not Assigned')}</span></div>
            <div class="description-box"><h4>Complaint Details:</h4><p>${escapeHtml(complaint.complaint_description)}</p></div>
            ${complaint.remarks ? `<div class="description-box" style="border-left-color: #10b981; margin-top: 10px;"><h4>Remarks:</h4><p>${escapeHtml(complaint.remarks)}</p></div>` : ''}
            <div class="footer"><p>Generated: ${new Date().toLocaleDateString()}</p></div>
        </div>
    </div>
    <script>window.onload = function() { setTimeout(() => window.print(), 500); };</script>
</body>
</html>`;

        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            showToast('Please allow popups to print slips', 'warning');
            return;
        }
        printWindow.document.write(slipHTML);
        printWindow.document.close();
    } catch (error) {
        showToast('Failed to load complaint for printing', 'error');
    }
}

// ============ REPORTS ============
async function generateDailyReport() {
    const date = document.getElementById('daily-report-date').value;
    if (!date) {
        showToast('Please select a date', 'warning');
        return;
    }

    try {
        const data = await fetchAPI(`/reports/daily?date=${date}`);
        currentReportData = data;
        displayReportModern('Daily Report - ' + formatDate(date), data.complaints);
    } catch (error) {
        showToast('Failed to generate report', 'error');
    }
}

async function generateMonthlyReport() {
    const month = document.getElementById('monthly-report-month').value;
    if (!month) {
        showToast('Please select a month', 'warning');
        return;
    }

    try {
        const [year, monthNum] = month.split('-');
        const data = await fetchAPI(`/reports/monthly?year=${year}&month=${monthNum}`);
        currentReportData = data;
        const monthName = new Date(year, monthNum - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
        displayReportModern('Monthly Report - ' + monthName, data.complaints);
    } catch (error) {
        showToast('Failed to generate report', 'error');
    }
}

function renderReport(title, data) {
    document.getElementById('report-title').textContent = title;
    document.getElementById('report-output').classList.remove('hidden');

    // Summary
    const summaryHtml = `
        <div style="padding: 20px; background: #f8fafc; margin: 20px; border-radius: 8px;">
            <h4 style="margin-bottom: 16px;">Summary</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px;">
                ${data.summary.map(s => `
                    <div style="background: white; padding: 16px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 12px; color: #64748b; text-transform: uppercase;">${s.trade_type}</div>
                        <div style="font-size: 24px; font-weight: 700; margin: 8px 0;">${s.count}</div>
                        <div style="font-size: 12px;">${getStatusBadge(s.status)}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Details table
    const detailsHtml = `
        <div class="table-responsive" style="padding: 0 20px 20px;">
            <h4 style="margin-bottom: 16px;">Complaint Details</h4>
            <table class="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Date</th>
                        <th>House/Qtr No.</th>
                        <th>Trade</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Assigned To</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.complaints.map(c => `
                        <tr>
                            <td>#${c.id}</td>
                            <td>${formatDate(c.date)}</td>
                            <td>${escapeHtml(c.flat_number)}</td>
                            <td>${c.trade_type}</td>
                            <td>${escapeHtml(c.complaint_description)}</td>
                            <td>${getStatusBadge(c.status)}</td>
                            <td>${escapeHtml(c.assigned_to || '-')}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    document.getElementById('report-content').innerHTML = summaryHtml + detailsHtml;
    document.getElementById('report-content').scrollIntoView({ behavior: 'smooth' });
}

function printReport() {
    window.print();
}

function exportCSV() {
    if (!currentReportData || !currentReportData.complaints.length) {
        showToast('No data to export', 'warning');
        return;
    }

    const headers = ['ID', 'Date', 'Resident Name', 'Flat Number', 'Contact', 'Trade', 'Description', 'Status', 'Assigned To', 'Remarks'];
    const rows = currentReportData.complaints.map(c => [
        c.id, c.date, c.resident_name, c.flat_number, c.contact_number,
        c.trade_type, c.complaint_description, c.status, c.assigned_to, c.remarks
    ]);

    const csv = [headers, ...rows].map(row =>
        row.map(cell => `"${(cell || '').toString().replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `complaints-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    showToast('CSV exported successfully!', 'success');
}

// ============ UTILITIES ============
function getStatusBadge(status) {
    const classes = {
        'Pending': 'badge badge-pending',
        'In Progress': 'badge badge-inprogress',
        'Completed': 'badge badge-completed'
    };
    return `<span class="${classes[status] || 'badge'}">${status}</span>`;
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showToast(message, type = 'info') {
    // Simple toast notification
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };

    toast.style.background = colors[type] || colors.info;
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);

// Sidebar Toggle Function
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        sidebar.classList.toggle('active');
        
        // Add overlay for mobile
        let overlay = document.querySelector('.sidebar-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'sidebar-overlay';
            overlay.onclick = toggleSidebar;
            document.body.appendChild(overlay);
        }
        overlay.classList.toggle('active');
    } else {
        sidebar.classList.toggle('collapsed');
    }
    
    // Save state to localStorage
    const isCollapsed = sidebar.classList.contains('collapsed') || !sidebar.classList.contains('active');
    localStorage.setItem('sidebarCollapsed', isCollapsed);
}

// Restore sidebar state on load
document.addEventListener('DOMContentLoaded', function() {
    const sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    const sidebar = document.getElementById('sidebar');
    const isMobile = window.innerWidth <= 768;
    
    if (sidebarCollapsed && !isMobile) {
        sidebar.classList.add('collapsed');
    }
});

// Handle window resize
window.addEventListener('resize', function() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (window.innerWidth > 768) {
        sidebar.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
    } else {
        sidebar.classList.remove('collapsed');
    }
});

// Close Report Function
function closeReport() {
    document.getElementById('report-output').classList.add('hidden');
}

// Generate Custom Range Report
async function generateCustomReport() {
    const startDate = document.getElementById('custom-start-date').value;
    const endDate = document.getElementById('custom-end-date').value;

    if (!startDate || !endDate) {
        showToast('Please select both start and end dates', 'warning');
        return;
    }

    if (new Date(startDate) > new Date(endDate)) {
        showToast('Start date cannot be after end date', 'error');
        return;
    }

    try {
        const complaints = await fetchAPI('/complaints?startDate=' + startDate + '&endDate=' + endDate);
        console.log('Custom Report - Total complaints received:', complaints.length);
        console.log('Complaints data:', complaints);
        const title = 'Custom Report: ' + formatDate(startDate) + ' to ' + formatDate(endDate);
        displayReportModern(title, complaints);
    } catch (error) {
        showToast('Failed to generate custom report', 'error');
    }
}

// Load Quick Stats for Reports Page
async function loadReportStats() {
    try {
        const stats = await fetchAPI('/stats');
        document.getElementById('today-stat').textContent = stats.today_count || 0;
        document.getElementById('month-stat').textContent = stats.month_count || 0;

        const today = new Date();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekStartStr = weekStart.toISOString().split('T')[0];

        const weekComplaints = await fetchAPI('/complaints?startDate=' + weekStartStr);
        document.getElementById('week-stat').textContent = weekComplaints.length;
    } catch (error) {
        console.error('Failed to load report stats');
    }
}

// Generate Today's Report
async function generateTodayReport() {
    const today = new Date().toISOString().split('T')[0];
    try {
        const complaints = await fetchAPI('/complaints?startDate=' + today + '&endDate=' + today);
        const title = "Today's Report - " + formatDate(today);
        displayReportModern(title, complaints);
    } catch (error) {
        showToast('Failed to generate today\'s report', 'error');
    }
}

// Generate This Week Report
async function generateWeekReport() {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekStartStr = weekStart.toISOString().split('T')[0];
    const todayStr = today.toISOString().split('T')[0];

    try {
        const complaints = await fetchAPI('/complaints?startDate=' + weekStartStr + '&endDate=' + todayStr);
        const title = 'This Week Report - ' + formatDate(weekStartStr) + ' to ' + formatDate(todayStr);
        displayReportModern(title, complaints);
    } catch (error) {
        showToast('Failed to generate week report', 'error');
    }
}

// Generate This Month Report
async function generateMonthReport() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const firstDay = year + '-' + month + '-01';
    const todayStr = today.toISOString().split('T')[0];

    try {
        const complaints = await fetchAPI('/complaints?startDate=' + firstDay + '&endDate=' + todayStr);
        const title = 'This Month Report - ' + formatDate(firstDay) + ' to ' + formatDate(todayStr);
        displayReportModern(title, complaints);
    } catch (error) {
        showToast('Failed to generate month report', 'error');
    }
}

// Display Report Modern
function displayReportModern(title, complaints) {
    const reportOutput = document.getElementById('report-output');
    const reportTitle = document.getElementById('report-title');
    const reportDate = document.getElementById('report-date');
    const reportContent = document.getElementById('report-content');

    reportTitle.textContent = title;
    reportDate.textContent = new Date().toLocaleString();

    const summary = {
        total: complaints.length,
        pending: complaints.filter(c => c.status === 'Pending').length,
        inProgress: complaints.filter(c => c.status === 'In Progress').length,
        completed: complaints.filter(c => c.status === 'Completed').length
    };

    const tradeBreakdown = {};
    complaints.forEach(c => {
        if (!tradeBreakdown[c.trade_type]) {
            tradeBreakdown[c.trade_type] = { total: 0, pending: 0, completed: 0 };
        }
        tradeBreakdown[c.trade_type].total++;
        if (c.status === 'Pending') tradeBreakdown[c.trade_type].pending++;
        if (c.status === 'Completed') tradeBreakdown[c.trade_type].completed++;
    });

    // Screen view HTML
    let html = '<div class="no-print" style="background: var(--bg); padding: 20px; border-radius: 8px; margin-bottom: 20px;">';
    html += '<h4 style="margin-bottom: 15px; color: var(--text);">Summary</h4>';
    html += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">';
    html += '<div style="text-align: center; padding: 15px; background: var(--card-bg); border-radius: 8px; border: 2px solid var(--border);">';
    html += '<div style="font-size: 28px; font-weight: 700; color: var(--primary);">' + summary.total + '</div>';
    html += '<div style="font-size: 13px; color: var(--text-light); margin-top: 5px;">Total</div></div>';
    html += '<div style="text-align: center; padding: 15px; background: var(--card-bg); border-radius: 8px; border: 2px solid #f59e0b;">';
    html += '<div style="font-size: 28px; font-weight: 700; color: #f59e0b;">' + summary.pending + '</div>';
    html += '<div style="font-size: 13px; color: var(--text-light); margin-top: 5px;">Pending</div></div>';
    html += '<div style="text-align: center; padding: 15px; background: var(--card-bg); border-radius: 8px; border: 2px solid #3b82f6;">';
    html += '<div style="font-size: 28px; font-weight: 700; color: #3b82f6;">' + summary.inProgress + '</div>';
    html += '<div style="font-size: 13px; color: var(--text-light); margin-top: 5px;">In Progress</div></div>';
    html += '<div style="text-align: center; padding: 15px; background: var(--card-bg); border-radius: 8px; border: 2px solid #10b981;">';
    html += '<div style="font-size: 28px; font-weight: 700; color: #10b981;">' + summary.completed + '</div>';
    html += '<div style="font-size: 13px; color: var(--text-light); margin-top: 5px;">Completed</div></div>';
    html += '</div></div>';

    // Screen view table
    if (complaints.length > 0) {
        html += '<div class="no-print" style="overflow-x: auto; max-height: 500px; margin-top: 20px;">';
        html += '<table style="width: 100%; border-collapse: collapse; background: var(--card-bg); border-radius: 8px; overflow: hidden;">';
        html += '<thead style="background: var(--primary); color: white;">';
        html += '<tr>';
        html += '<th style="padding: 12px 8px; text-align: left; font-size: 13px;">Sr#</th>';
        html += '<th style="padding: 12px 8px; text-align: left; font-size: 13px;">ID</th>';
        html += '<th style="padding: 12px 8px; text-align: left; font-size: 13px;">Date</th>';
        html += '<th style="padding: 12px 8px; text-align: left; font-size: 13px;">Flat No.</th>';
        html += '<th style="padding: 12px 8px; text-align: left; font-size: 13px;">Contact</th>';
        html += '<th style="padding: 12px 8px; text-align: left; font-size: 13px;">Trade</th>';
        html += '<th style="padding: 12px 8px; text-align: left; font-size: 13px;">Description</th>';
        html += '<th style="padding: 12px 8px; text-align: left; font-size: 13px;">Status</th>';
        html += '<th style="padding: 12px 8px; text-align: left; font-size: 13px;">Assigned To</th>';
        html += '</tr></thead><tbody>';

        complaints.forEach((c, index) => {
            const bgColor = index % 2 === 0 ? 'var(--bg)' : 'var(--card-bg)';
            html += '<tr style="background: ' + bgColor + ';">';
            html += '<td style="padding: 10px 8px; border-bottom: 1px solid var(--border); font-size: 13px; font-weight: 600;">' + (index + 1) + '</td>';
            html += '<td style="padding: 10px 8px; border-bottom: 1px solid var(--border); font-size: 13px;">' + c.id + '</td>';
            html += '<td style="padding: 10px 8px; border-bottom: 1px solid var(--border); font-size: 13px;">' + formatDate(c.date) + '</td>';
            html += '<td style="padding: 10px 8px; border-bottom: 1px solid var(--border); font-size: 13px;">' + escapeHtml(c.flat_number) + '</td>';
            html += '<td style="padding: 10px 8px; border-bottom: 1px solid var(--border); font-size: 13px;">' + escapeHtml(c.contact_number || 'N/A') + '</td>';
            html += '<td style="padding: 10px 8px; border-bottom: 1px solid var(--border); font-size: 13px;">' + c.trade_type + '</td>';
            html += '<td style="padding: 10px 8px; border-bottom: 1px solid var(--border); font-size: 12px;">' + escapeHtml(c.complaint_description) + '</td>';
            html += '<td style="padding: 10px 8px; border-bottom: 1px solid var(--border); font-size: 13px;"><span class="status-badge status-' + c.status.toLowerCase().replace(/\s/g, '-') + '">' + c.status + '</span></td>';
            html += '<td style="padding: 10px 8px; border-bottom: 1px solid var(--border); font-size: 13px;">' + escapeHtml(c.assigned_to || 'Unassigned') + '</td>';
            html += '</tr>';
        });

        html += '</tbody></table></div>';
    }

    // Print view HTML
    html += '<div class="print-report-header" style="display: none;">';
    html += '<h1>Colony Complaints System</h1>';
    html += '<div class="subtitle">' + title + '</div>';
    html += '<div class="date-info">Generated on: ' + new Date().toLocaleString() + '</div>';
    html += '</div>';

    html += '<div class="print-summary" style="display: none;">';
    html += '<div class="print-stat-box"><div class="label">Total</div><div class="value">' + summary.total + '</div></div>';
    html += '<div class="print-stat-box"><div class="label">Pending</div><div class="value">' + summary.pending + '</div></div>';
    html += '<div class="print-stat-box"><div class="label">In Progress</div><div class="value">' + summary.inProgress + '</div></div>';
    html += '<div class="print-stat-box"><div class="label">Completed</div><div class="value">' + summary.completed + '</div></div>';
    html += '</div>';

    // Complaints table for print
    if (complaints.length > 0) {
        html += '<table class="print-table" style="display: none;">';
        html += '<thead><tr>';
        html += '<th style="width: 4%;">Sr#</th>';
        html += '<th style="width: 4%;">ID</th>';
        html += '<th style="width: 9%;">Date</th>';
        html += '<th style="width: 7%;">Flat</th>';
        html += '<th style="width: 10%;">Contact</th>';
        html += '<th style="width: 10%;">Trade</th>';
        html += '<th style="width: 30%;">Description</th>';
        html += '<th style="width: 9%;">Status</th>';
        html += '<th style="width: 11%;">Assigned</th>';
        html += '</tr></thead><tbody>';

        complaints.forEach((c, index) => {
            html += '<tr>';
            html += '<td style="font-weight: 600;">' + (index + 1) + '</td>';
            html += '<td>' + c.id + '</td>';
            html += '<td>' + formatDate(c.date) + '</td>';
            html += '<td>' + escapeHtml(c.flat_number) + '</td>';
            html += '<td>' + escapeHtml(c.contact_number || 'N/A') + '</td>';
            html += '<td>' + c.trade_type + '</td>';
            html += '<td>' + escapeHtml(c.complaint_description) + '</td>';
            html += '<td><span class="status-badge status-' + c.status.toLowerCase().replace(/\s/g, '-') + '">' + c.status + '</span></td>';
            html += '<td>' + escapeHtml(c.assigned_to || 'N/A') + '</td>';
            html += '</tr>';
        });

        html += '</tbody></table>';
    }

    html += '<div class="print-footer" style="display: none;">';
    html += '<p>Colony Complaints Management System | Printed on ' + new Date().toLocaleDateString() + '</p>';
    html += '</div>';

    reportContent.innerHTML = html;
    reportOutput.classList.remove('hidden');
    reportOutput.scrollIntoView({ behavior: 'smooth' });
}
