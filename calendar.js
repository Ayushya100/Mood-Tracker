const todayDate = new Date();

// Current date, month and year to be used to keep track in calendar
let currentDate = todayDate.getDate();
let currentMonth = todayDate.getMonth();
let currentYear = todayDate.getFullYear();

// User selected date, month and year to be used to keep track of user selected date
let userSelectedDate = currentDate;
let userSelectedMonth = currentMonth;
let userSelectedYear = currentYear;

// Months Array
const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

// Document Selectors to manipulate
const calendarNavigationBtn = document.querySelectorAll('.calendar-navigation span');
const calendarHeaderText = document.querySelector('.calendar-header-text');
const calendarDates = document.getElementById('calendar-dates');
const dateElements = document.querySelectorAll('.calendar-dates li');

// Function to set calendar header
const setCalendarHeader = (month, year) => {
    calendarHeaderText.innerText = `${months[month]} ${year}`;
}

// Function to set user selected date in localstorage
const setUserDate = () => {
    const date = new Date(userSelectedYear, userSelectedMonth, userSelectedDate);
    localStorage.setItem('userSelectedDate', date);
}

// Event Emitter Functions
function navigationBtnClickEvent() {
    const newMonth = this.id === 'calendar-prev' ? currentMonth - 1 : currentMonth + 1;
    const newDate = new Date(currentYear, newMonth, 1);
    
    currentMonth = newDate.getMonth();
    currentYear = newDate.getFullYear();
    
    setCalendarHeader(currentMonth, currentYear);
    loadCalendarDates(currentMonth, currentYear);
}

// Event Emitter Function to be called on date change in calendar
function onDateClickEvent() {
    userSelectedDate = this.getAttribute('date');
    userSelectedMonth = currentMonth;
    userSelectedYear = currentYear;

    // Remove active class from previous element and add to the current selection
    const activeElem = calendarDates.querySelector('li.active');
    if (activeElem) {
        activeElem.classList.remove('active');
        activeElem.classList.add('inactive');
    }

    this.classList.remove('inactive');
    this.classList.add('active');
    setUserDate();

    // Called Function from mood.js to load the user selected mood based on the date change
    loadMoodsForUser();
}

// Set Events on Click
calendarNavigationBtn.forEach((btn) => {
    btn.addEventListener('click', navigationBtnClickEvent);
});

// Function to update calendar
const loadCalendarDates = (month, year) => {
    // Get the last date of previous month
    const prevMonthLastDate = new Date(year, month, 0).getDate();

    // Get the last date of current month
    const currentMonthLastDate = new Date(year, month + 1, 0).getDate();

    // Get the first day of current month
    const currentMonthFirstDay = new Date(year, month, 0).getDay();

    // Get the last day of current month
    const currentMonthLastDay = new Date(year, month + 1, 0).getDay();

    calendarDates.innerHTML = '';

    // Build calendar days
    for (let prevDate = currentMonthFirstDay; prevDate > 0; prevDate--) {
        const date = prevMonthLastDate - prevDate + 1;
        const dateLi = document.createElement('li');
        dateLi.textContent = date;
        dateLi.classList.add('deactive');
        calendarDates.appendChild(dateLi);
    }
    
    for (let date = 1; date <= currentMonthLastDate; date++) {
        let liClass = '';
        const dateToCheck = new Date(`${year}-${month}-${date}`);
        const validationDate = new Date(`${todayDate.getFullYear()}-${todayDate.getMonth()}-${todayDate.getDate()}`);

        if (dateToCheck > validationDate) {
            liClass = 'deactive';
        } else if ((date === userSelectedDate) && (month === userSelectedMonth) && (year === userSelectedYear)) {
            liClass = 'active';
        } else {
            liClass = 'inactive';
        }
        
        const dateLi = document.createElement('li');
        dateLi.textContent = date;
        dateLi.classList.add(liClass);
        dateLi.setAttribute('date', date);

        if (liClass === 'active' || liClass === 'inactive') {
            dateLi.addEventListener('click', onDateClickEvent);
        }
        calendarDates.appendChild(dateLi);
    }

    for (let nextDate = currentMonthLastDay; nextDate <= 6; nextDate++) {
        const date = nextDate - currentMonthLastDay + 1;
        const dateLi = document.createElement('li');
        dateLi.textContent = date;
        dateLi.classList.add('deactive');
        calendarDates.appendChild(dateLi);
    }
}

// Imediate execution of functions on loading the script
setCalendarHeader(currentMonth, currentYear);
loadCalendarDates(currentMonth, currentYear);
setUserDate();
