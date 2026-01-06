// ========================================
// GRADE DATA
// ========================================
const GRADE_POINTS = {
    'A': 4.00,
    'A-': 3.67,
    'B+': 3.33,
    'B': 3.00,
    'B-': 2.67,
    'C+': 2.33,
    'C': 2.00,
    'C-': 1.67,
    'D+': 1.33,
    'D': 1.00,
    'F': 0.00
};

const GRADE_MARKS = {
    'A': '90 - 100',
    'A-': '86 - 89',
    'B+': '82 - 85',
    'B': '78 - 81',
    'B-': '74 - 77',
    'C+': '70 - 73',
    'C': '66 - 69',
    'C-': '62 - 65',
    'D+': '58 - 61',
    'D': '55 - 57',
    'F': '00 - 54'
};

const TRIMESTER_FEE = 5000;

// ========================================
// STATE MANAGEMENT
// ========================================
let courses = [];
let selectedWaiver = '';

// ========================================
// THEME MANAGEMENT
// ========================================
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    }
}

function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

// ========================================
// TAB MANAGEMENT
// ========================================
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.dataset.tab;

            // Remove active class from all tabs and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked tab and corresponding content
            button.classList.add('active');
            document.getElementById(`${tabName}Tab`).classList.add('active');
        });
    });
}

// ========================================
// MENU MANAGEMENT
// ========================================
function initMenu() {
    const menuBtn = document.getElementById('menuBtn');
    const menuDropdown = document.getElementById('menuDropdown');
    const privacyBtn = document.getElementById('privacyBtn');
    const contactBtn = document.getElementById('contactBtn');
    const privacyModal = document.getElementById('privacyModal');
    const contactModal = document.getElementById('contactModal');

    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        menuDropdown.classList.toggle('hidden');
    });

    // Close menu when clicking outside
    document.addEventListener('click', () => {
        menuDropdown.classList.add('hidden');
    });

    privacyBtn.addEventListener('click', () => {
        menuDropdown.classList.add('hidden');
        openModal(privacyModal);
    });

    contactBtn.addEventListener('click', () => {
        menuDropdown.classList.add('hidden');
        openModal(contactModal);
    });
}

// ========================================
// MODAL MANAGEMENT
// ========================================
function openModal(modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
}

function initModals() {
    const modals = document.querySelectorAll('.modal');

    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.close-btn');

        // Close on close button click
        closeBtn.addEventListener('click', () => closeModal(modal));

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => closeModal(modal));
        }
    });
}

// ========================================
// CGPA CALCULATOR
// ========================================
function addCourse(isRetake = false) {
    const courseNumber = courses.length + 1;
    const course = {
        id: Date.now(),
        courseNumber,
        isRetake,
        credit: null,
        grade: null,
        oldGrade: null,
        newGrade: null
    };
    courses.push(course);
    renderCourses();
}

function renderCourses() {
    const container = document.getElementById('courseRowsContainer');
    container.innerHTML = '';

    courses.forEach(course => {
        const row = course.isRetake ? createRetakeRow(course) : createCourseRow(course);
        container.appendChild(row);
    });
}

function createCourseRow(course) {
    const row = document.createElement('div');
    row.className = 'course-row';

    // Course Number Dropdown
    const courseSelect = document.createElement('select');
    courseSelect.innerHTML = Array.from({ length: 20 }, (_, i) => i + 1)
        .map(num => `<option value="${num}" ${course.courseNumber === num ? 'selected' : ''}>Course ${num}</option>`)
        .join('');
    courseSelect.addEventListener('change', (e) => {
        course.courseNumber = parseInt(e.target.value);
    });

    // Credit Dropdown
    const creditSelect = document.createElement('select');
    creditSelect.innerHTML = '<option value="">Credit</option>' +
        [1.0, 1.5, 2.0, 3.0, 4.0].map(credit =>
            `<option value="${credit}" ${course.credit === credit ? 'selected' : ''}>${credit}</option>`
        ).join('');
    creditSelect.addEventListener('change', (e) => {
        course.credit = e.target.value ? parseFloat(e.target.value) : null;
    });

    // Grade Dropdown
    const gradeSelect = document.createElement('select');
    gradeSelect.innerHTML = '<option value="">Grade</option>' +
        Object.keys(GRADE_POINTS).map(grade =>
            `<option value="${grade}" ${course.grade === grade ? 'selected' : ''}>${grade}</option>`
        ).join('');
    gradeSelect.addEventListener('change', (e) => {
        course.grade = e.target.value || null;
    });

    row.appendChild(courseSelect);
    row.appendChild(creditSelect);
    row.appendChild(gradeSelect);

    return row;
}

function createRetakeRow(course) {
    const container = document.createElement('div');
    container.className = 'retake-row';

    // Headers
    const headers = document.createElement('div');
    headers.className = 'retake-headers';
    headers.innerHTML = `
        <div class="header-item">Credit</div>
        <div class="header-item">Old Grade</div>
        <div class="header-item">New Grade</div>
    `;

    // Inputs
    const inputs = document.createElement('div');
    inputs.className = 'retake-inputs';

    // Credit Dropdown
    const creditSelect = document.createElement('select');
    creditSelect.innerHTML = '<option value="">Credit</option>' +
        [1.0, 1.5, 2.0, 3.0, 4.0].map(credit =>
            `<option value="${credit}" ${course.credit === credit ? 'selected' : ''}>${credit}</option>`
        ).join('');
    creditSelect.addEventListener('change', (e) => {
        course.credit = e.target.value ? parseFloat(e.target.value) : null;
    });

    // Old Grade Dropdown
    const oldGradeSelect = document.createElement('select');
    oldGradeSelect.innerHTML = '<option value="">Grade</option>' +
        Object.keys(GRADE_POINTS).map(grade =>
            `<option value="${grade}" ${course.oldGrade === grade ? 'selected' : ''}>${grade}</option>`
        ).join('');
    oldGradeSelect.addEventListener('change', (e) => {
        course.oldGrade = e.target.value || null;
    });

    // New Grade Dropdown
    const newGradeSelect = document.createElement('select');
    newGradeSelect.innerHTML = '<option value="">Grade</option>' +
        Object.keys(GRADE_POINTS).map(grade =>
            `<option value="${grade}" ${course.newGrade === grade ? 'selected' : ''}>${grade}</option>`
        ).join('');
    newGradeSelect.addEventListener('change', (e) => {
        course.newGrade = e.target.value || null;
    });

    inputs.appendChild(creditSelect);
    inputs.appendChild(oldGradeSelect);
    inputs.appendChild(newGradeSelect);

    container.appendChild(headers);
    container.appendChild(inputs);

    return container;
}

function calculateCGPA() {
    const completedCredits = parseFloat(document.getElementById('completedCredits').value) || 0;
    const currentCgpa = parseFloat(document.getElementById('currentCgpa').value) || 0;

    let newTotalPoints = 0;
    let newTotalCredits = 0;

    courses.forEach(course => {
        if (course.isRetake) {
            // For retakes
            if (course.newGrade && course.oldGrade && course.credit) {
                const newGradePoint = GRADE_POINTS[course.newGrade];
                const oldGradePoint = GRADE_POINTS[course.oldGrade];
                newTotalPoints += (newGradePoint - oldGradePoint) * course.credit;
                // Don't add credits for retakes
            }
        } else {
            // For regular courses
            if (course.grade && course.credit) {
                const gradePoint = GRADE_POINTS[course.grade];
                newTotalPoints += gradePoint * course.credit;
                newTotalCredits += course.credit;
            }
        }
    });

    const existingPoints = completedCredits * currentCgpa;
    const totalPoints = existingPoints + newTotalPoints;
    const totalCredits = completedCredits + newTotalCredits;

    const rawCgpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    const calculatedCgpa = Math.min(rawCgpa, 4.0); // Cap at 4.0

    displayResult(calculatedCgpa);
}

function displayResult(cgpa) {
    const resultCard = document.getElementById('resultCard');
    const cgpaValue = document.getElementById('cgpaValue');
    const cgpaDescription = document.getElementById('cgpaDescription');
    const perfectBadge = document.getElementById('perfectBadge');

    resultCard.classList.remove('hidden');
    cgpaValue.textContent = cgpa.toFixed(2);
    cgpaDescription.textContent = getGradeDescription(cgpa);

    // Highlight excellent performance
    if (cgpa >= 3.5) {
        resultCard.classList.add('excellent');
    } else {
        resultCard.classList.remove('excellent');
    }

    // Show perfect score badge
    if (cgpa === 4.0) {
        perfectBadge.classList.remove('hidden');
    } else {
        perfectBadge.classList.add('hidden');
    }

    // Smooth scroll to result
    setTimeout(() => {
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

function getGradeDescription(cgpa) {
    if (cgpa >= 4.0) return 'Outstanding Performance';
    if (cgpa >= 3.67) return 'Excellent Performance';
    if (cgpa >= 3.33) return 'Very Good Performance';
    if (cgpa >= 3.0) return 'Good Performance';
    if (cgpa >= 2.67) return 'Satisfactory Performance';
    if (cgpa >= 2.33) return 'Below Average Performance';
    if (cgpa >= 2.0) return 'Poor Performance';
    return 'Needs Improvement';
}

function resetCalculator() {
    courses = [];
    document.getElementById('completedCredits').value = '';
    document.getElementById('currentCgpa').value = '';
    document.getElementById('resultCard').classList.add('hidden');
    addCourse(); // Add initial course
    addCourse(); // Add second course
}

// ========================================
// GRADING POLICY
// ========================================
function initGradingTable() {
    const container = document.getElementById('gradeTableContainer');

    Object.keys(GRADE_POINTS).forEach((grade, index) => {
        const cgpa = GRADE_POINTS[grade];
        const mark = GRADE_MARKS[grade];

        const row = document.createElement('div');
        row.className = 'grade-row';
        row.style.animationDelay = `${index * 0.05}s`;

        const gradeBadge = document.createElement('div');
        gradeBadge.className = 'grade-badge';
        gradeBadge.textContent = grade;
        gradeBadge.style.backgroundColor = getGradeColor(grade, 0.2);
        gradeBadge.style.color = getGradeColor(grade, 1);

        const cgpaDiv = document.createElement('div');
        cgpaDiv.className = 'grade-cgpa';
        cgpaDiv.textContent = cgpa.toFixed(2);

        const markDiv = document.createElement('div');
        markDiv.className = 'grade-mark';
        markDiv.textContent = mark;

        row.appendChild(gradeBadge);
        row.appendChild(cgpaDiv);
        row.appendChild(markDiv);

        container.appendChild(row);
    });
}

function getGradeColor(grade, alpha = 1) {
    const colors = {
        'A': `rgba(76, 175, 80, ${alpha})`,
        'A-': `rgba(139, 195, 74, ${alpha})`,
        'B+': `rgba(205, 220, 57, ${alpha})`,
        'B': `rgba(255, 235, 59, ${alpha})`,
        'B-': `rgba(255, 152, 0, ${alpha})`,
        'C+': `rgba(255, 87, 34, ${alpha})`,
        'C': `rgba(244, 67, 54, ${alpha})`,
        'C-': `rgba(229, 57, 53, ${alpha})`,
        'D+': `rgba(211, 47, 47, ${alpha})`,
        'D': `rgba(198, 40, 40, ${alpha})`,
        'F': `rgba(158, 158, 158, ${alpha})`
    };
    return colors[grade] || `rgba(255, 255, 255, ${alpha})`;
}

// ========================================
// TUITION CALCULATOR
// ========================================
function initTuitionCalculator() {
    const waiverBtns = document.querySelectorAll('.waiver-btn');
    const customWaiverInput = document.getElementById('customWaiverInput');

    waiverBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            waiverBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedWaiver = btn.dataset.value;

            if (selectedWaiver === 'custom') {
                customWaiverInput.classList.remove('hidden');
            } else {
                customWaiverInput.classList.add('hidden');
            }
        });
    });
}

function calculateTuition() {
    const tuitionFee = parseFloat(document.getElementById('tuitionFee').value);

    // Validation
    if (!tuitionFee) {
        showErrorDialog('Please enter tuition fee amount.');
        return;
    }

    if (tuitionFee <= TRIMESTER_FEE) {
        showErrorDialog(`Please enter a valid tuition fee (must be greater than ${TRIMESTER_FEE} tk).`);
        return;
    }

    // Get waiver percentage
    let waiverPercentage = 0;
    if (selectedWaiver) {
        if (selectedWaiver === 'custom') {
            const customWaiver = parseFloat(document.getElementById('customWaiver').value);
            if (!customWaiver && customWaiver !== 0) {
                showErrorDialog('Please enter custom waiver percentage.');
                return;
            }
            if (customWaiver < 0 || customWaiver > 100) {
                showErrorDialog('Custom waiver percentage must be between 0% and 100%.');
                return;
            }
            waiverPercentage = customWaiver;
        } else {
            waiverPercentage = parseFloat(selectedWaiver);
        }
    }

    // Calculate fees
    const remainingAmount = tuitionFee - TRIMESTER_FEE;
    const waiverAmount = (remainingAmount * waiverPercentage) / 100;
    const finalPayableFee = remainingAmount - waiverAmount + TRIMESTER_FEE;

    // Calculate installments (40%, 30%, 30%)
    const installment1 = (finalPayableFee * 40) / 100;
    const installment2 = (finalPayableFee * 30) / 100;
    const installment3 = (finalPayableFee * 30) / 100;

    // Display results
    displayTuitionResults(finalPayableFee, installment1, installment2, installment3, waiverPercentage);
}

function displayTuitionResults(payableFee, inst1, inst2, inst3, waiverPercent) {
    const resultsContainer = document.getElementById('tuitionResults');
    const payableFeeEl = document.getElementById('payableFee');
    const waiverInfoEl = document.getElementById('waiverInfo');
    const installment1El = document.getElementById('installment1');
    const installment2El = document.getElementById('installment2');
    const installment3El = document.getElementById('installment3');

    resultsContainer.classList.remove('hidden');
    payableFeeEl.textContent = `${payableFee.toFixed(2)} tk`;
    waiverInfoEl.textContent = `After ${waiverPercent}% waiver`;
    installment1El.textContent = `${inst1.toFixed(2)} tk`;
    installment2El.textContent = `${inst2.toFixed(2)} tk`;
    installment3El.textContent = `${inst3.toFixed(2)} tk`;

    // Smooth scroll to results
    setTimeout(() => {
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

function resetTuitionCalculator() {
    document.getElementById('tuitionFee').value = '';
    document.getElementById('customWaiver').value = '';
    document.getElementById('tuitionResults').classList.add('hidden');
    document.getElementById('customWaiverInput').classList.add('hidden');
    document.querySelectorAll('.waiver-btn').forEach(btn => btn.classList.remove('active'));
    selectedWaiver = '';
}

function showErrorDialog(message) {
    // Simple alert for now - could be enhanced with a custom modal
    alert(message);
}

// ========================================
// EVENT LISTENERS
// ========================================
function initEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // Calculate tab
    document.getElementById('addCourseBtn').addEventListener('click', () => addCourse(false));
    document.getElementById('retakeBtn').addEventListener('click', () => addCourse(true));
    document.getElementById('resetBtn').addEventListener('click', resetCalculator);
    document.getElementById('calculateBtn').addEventListener('click', calculateCGPA);

    // Tuition tab
    document.getElementById('tuitionCalculateBtn').addEventListener('click', calculateTuition);
    document.getElementById('tuitionResetBtn').addEventListener('click', resetTuitionCalculator);
}

// ========================================
// INITIALIZATION
// ========================================
function init() {
    initTheme();
    initTabs();
    initMenu();
    initModals();
    initGradingTable();
    initTuitionCalculator();
    initEventListeners();

    // Initialize with 2 courses
    addCourse();
    addCourse();
}

// Run on DOM load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
