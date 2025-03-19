// Mood options - name and emoji hex code
const moods = {
    'Happy': '128522',
    'Sad': '128577',
    'Neutral': '128528',
    'Excited': '129321',
    'Angry': '128544',
    'Crying': '128546',
    'Laughing': '128514',
    'Laughing Hard': '129315',
    'Thinking': '129300',
    'Winking': '128540',
    'Lovely': '128525',
    'Crazy': '129322'
};

// Emoji Message
const moodsMessage = {
    'Happy': 'Awesome! Happiness looks good on you!',
    'Sad': 'Sorry to hear you are feeling down. Sending you a virtual hug! Hope your day gets better!',
    'Neutral': 'Just another day, huh? Hope something brightens it up soon!',
    'Excited': 'Wow, love the energy! Hope your excitement brings you amazing moments today!',
    'Angry': 'Uh-oh! Deep breaths. Inhale… exhale… Hope things get better soon!',
    'Crying': 'I am so sorry you are feeling this way. You are not alone—better days are ahead!',
    'Laughing': 'Laughter is the best medicine! Keep sharing those good vibes!',
    'Laughing Hard': 'Now that’s some real joy! Hope your day stays this fun!',
    'Thinking': 'Deep in thought? Hope you find all the answers you are looking for!',
    'Winking': 'I see what you did there! Keep that playful spirit alive!',
    'Lovely': 'Aww, feeling the love! Keep spreading kindness and warmth!',
    'Crazy': 'Feeling wild today? Embrace the fun and let your energy shine!'
};

const updateMoodMessage = 'You can change your mood selection';

// Dropdown options
const options = [
    { text: 'Last 7 Days', value: 7 },
    { text: 'Last 15 Days', value: 15 },
    { text: 'Last 30 Days', value: 30 },
    { text: 'Last 45 Days', value: 45 }
];


// Document Selectors to manipulate
const moodContainer = document.getElementById('mood-container');
const moodMessageText = document.getElementById('mood-message');
const moodFooterText = document.getElementById('mood-footer');
const report = document.getElementById('footer-report');
const dropdownButton = document.getElementById('dropdownBtn');
const dropdownContent = document.getElementById('dropdownContent');

// Toggle Dropdown on button click
dropdownButton.addEventListener('click', function() {
    dropdownContent.classList.toggle('show');
});

// Function to load user selected moods array from localstorage 
const loadUserMoodsArr = () => {
    let userSelectedMoods = localStorage.getItem('userSelectedMoods') || [];
    
    if (userSelectedMoods.length > 0) {
        userSelectedMoods = JSON.parse(userSelectedMoods);
    }

    return userSelectedMoods;
}

// Function to load user selected date from localstorage
const getCurrentDate = () => {
    return localStorage.getItem('userSelectedDate');
}

// Function to get the current mood record from the provided array of objects
const getUserCurrentMood = (userMoodsArr, userSelectedDate) => {
    return userMoodsArr.filter(obj => obj.date === userSelectedDate);
}

// Event Emitter Function - to get the selected mood by user and store it in localstorage
function onMoodSelection() {
    const activeElem = moodContainer.querySelector('li.active');
    if (activeElem) {
        activeElem.classList.remove('active');
        activeElem.classList.add('inactive');
    }

    this.classList.remove('inactive');
    this.classList.add('active');

    let userSelectedMoods = loadUserMoodsArr();
    const userSelectedDate = getCurrentDate();

    if (userSelectedMoods.length > 0) {
        const existingSelection = getUserCurrentMood(userSelectedMoods, userSelectedDate);
        
        if (existingSelection.length > 0) {
            existingSelection[0].mood = this.getAttribute('mood');
        } else {
            userSelectedMoods.push({
                date: userSelectedDate,
                mood: this.getAttribute('mood')
            });
        }
    } else {
        userSelectedMoods = [
            {
                date: userSelectedDate,
                mood: this.getAttribute('mood')
            }
        ];
    }

    moodMessageText.innerHTML = moodsMessage[this.getAttribute('mood')];
    localStorage.setItem('userSelectedMoods', JSON.stringify(userSelectedMoods));
}

// Event emitter function to be called when user selects the dropdown option
function loadSelectedDropdownValue() {
    const selectedOption = options.find(option => option.value == this.getAttribute('value'));
    dropdownButton.innerHTML = selectedOption.text;

    // Remove show class to visually close the dropdown
    if (dropdownContent.classList.contains('show')) {
        dropdownContent.classList.remove('show');
    }

    // Call function to load the desired report data
    loadMoodsReport(selectedOption.value);
}

// Funciton to load Moods for User to select
const loadMoodsForUser = () => {
    let userSelectedMoods = loadUserMoodsArr();
    const userSelectedDate = getCurrentDate();
    userSelectedMoods = getUserCurrentMood(userSelectedMoods, userSelectedDate);
    userSelectedMoods = userSelectedMoods[0];

    moodMessageText.innerHTML = null;
    moodFooterText.innerHTML = null;

    moodContainer.innerHTML = '';
    for (let mood in moods) {
        const moodLi = document.createElement('li');
        moodLi.textContent = `${String.fromCodePoint(moods[mood])} ${mood}`;
        moodLi.setAttribute('mood', mood);
        moodLi.addEventListener('click', onMoodSelection);
        
        let liClass = '';
        if (userSelectedMoods && userSelectedMoods.mood === mood) {
            liClass = 'active';
            moodMessageText.innerHTML = moodsMessage[mood];
            moodFooterText.innerHTML = updateMoodMessage;
        } else {
            liClass = 'inactive';
        }

        moodLi.classList.add(liClass);
        moodContainer.appendChild(moodLi);
    }
}

// Function to populate the data in report based on the number of days passed as a parameter
const loadMoodsReport = (numOfDays) => {
    let userSelectedMoods = loadUserMoodsArr();
    const todayDate = new Date();
    report.innerHTML = '';

    // Before loading the records in report build the record in structured format
    for (let dateIndex = 0; dateIndex < numOfDays; dateIndex++) {
        const dateToAdd = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() - dateIndex);

        // The 'Record Date' title and date to be kept on left side of a block
        const liRecord = document.createElement('li');

        let recordDiv = document.createElement('div');
        recordDiv.classList.add('record-left');
        
        let recordElement = document.createElement('p');
        recordElement.classList.add('record-title');
        recordElement.innerHTML = 'Record Date';
        recordDiv.appendChild(recordElement);

        recordElement = document.createElement('p');
        recordElement.classList.add('record-date');
        recordElement.innerHTML = dateToAdd.toDateString();
        recordDiv.appendChild(recordElement);

        liRecord.appendChild(recordDiv);

        // The emoji and emoji name to be kept on right side of a block
        recordDiv = document.createElement('div');
        recordDiv.classList.add('record-right');

        recordElement = document.createElement('p');
        recordElement.classList.add('record-mood');
        
        let moodRecord = userSelectedMoods.find(obj => obj.date === dateToAdd.toString());
        if (moodRecord) {
            recordElement.classList.add('record-mood-emoji');
            recordElement.innerHTML = String.fromCodePoint(moods[moodRecord.mood]);
        } else {
            recordElement.innerHTML = 'No Record';
        }

        recordDiv.appendChild(recordElement);

        recordElement = document.createElement('p');
        recordElement.classList.add('record-mood-dtl');

        if (moodRecord && moodRecord.mood) {
            recordElement.innerHTML = moodRecord.mood;
        }

        recordDiv.appendChild(recordElement);
        liRecord.appendChild(recordDiv);
        report.appendChild(liRecord);
    }
}

// Function to load the options in a dropdown
const loadDropdownOptions = () => {
    options.forEach((option, index) => {
        let optionElement = document.createElement('a');
        optionElement.innerHTML = option.text;
        optionElement.setAttribute('value', option.value);
        optionElement.addEventListener('click', loadSelectedDropdownValue);
        dropdownContent.appendChild(optionElement);

        // By default loading the report data with the smallest option available
        if (index === 0) {
            dropdownButton.innerHTML = option.text;
            loadMoodsReport(option.value);
        }
    });
}

// Imediate execution of functions on loading the script
loadMoodsForUser();
loadDropdownOptions();
