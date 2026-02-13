// Global variables
let currentQuestion = 1;
let totalQuestions = 10;
let userResponses = [];
let selectedOption = null;

// Conjoint A variables
let currentQuestionA = 1;
let userResponsesA = [];
let selectedTeam = null;
let sliderValuesA = { A: 50, B: 50 };

// Question data - mapping question numbers to image pairs
const questionData = {
    1: { a: 'assets/conjoint-b/1-a.png', b: 'assets/conjoint-b/1-b.png' },
    2: { a: 'assets/conjoint-b/2-a.png', b: 'assets/conjoint-b/2-b.png' },
    3: { a: 'assets/conjoint-b/3-a.png', b: 'assets/conjoint-b/3-b.png' },
    4: { a: 'assets/conjoint-b/4-a.png', b: 'assets/conjoint-b/4-b.png' },
    5: { a: 'assets/conjoint-b/5-a.png', b: 'assets/conjoint-b/5-b.png' },
    6: { a: 'assets/conjoint-b/6-a.png', b: 'assets/conjoint-b/6-b.png' },
    7: { a: 'assets/conjoint-b/7-a.png', b: 'assets/conjoint-b/7-b.png' },
    8: { a: 'assets/conjoint-b/8-a.png', b: 'assets/conjoint-b/8-b.png' },
    9: { a: 'assets/conjoint-b/9-a.png', b: 'assets/conjoint-b/9-b.png' },
    10: { a: 'assets/conjoint-b/10-a.png', b: 'assets/conjoint-b/10-b.png' }
};

// Conjoint A question data
const questionDataA = {
    1: { a: 'assets/conjoint-a/1-a.png', b: 'assets/conjoint-a/1-b.png' },
    2: { a: 'assets/conjoint-a/2-a.png', b: 'assets/conjoint-a/2-b.png' },
    3: { a: 'assets/conjoint-a/3-a.png', b: 'assets/conjoint-a/3-b.png' },
    4: { a: 'assets/conjoint-a/4-a.png', b: 'assets/conjoint-a/4-b.png' },
    5: { a: 'assets/conjoint-a/5-a.png', b: 'assets/conjoint-a/5-b.png' },
    6: { a: 'assets/conjoint-a/6-a.png', b: 'assets/conjoint-a/6-b.png' },
    7: { a: 'assets/conjoint-a/7-a.png', b: 'assets/conjoint-a/7-b.png' },
    8: { a: 'assets/conjoint-a/8-a.png', b: 'assets/conjoint-a/8-b.png' },
    9: { a: 'assets/conjoint-a/9-a.png', b: 'assets/conjoint-a/9-b.png' },
    10: { a: 'assets/conjoint-a/10-a.png', b: 'assets/conjoint-a/10-b.png' }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    showPage('home-page');
});

// Navigation functions
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
}

function selectConjoint(type) {
    if (type === 'A') {
        startQuestionsA();
    } else if (type === 'B') {
        startQuestions();
    }
}

function startQuestions() {
    currentQuestion = 1;
    userResponses = [];
    selectedOption = null;
    
    showPage('questions-page');
    loadQuestion(currentQuestion);
    updateProgressBar();
    updateNavigationButtons();
    showInstructionOverlay();
}

function showInstructionOverlay() {
    const overlay = document.getElementById('instruction-overlay');
    const questionContent = document.querySelector('.question-content');
    const questionHeader = document.querySelector('.question-header-container');
    
    if (overlay && questionContent) {
        overlay.classList.remove('hidden');
        questionContent.classList.add('blurred');
        
        if (questionHeader) {
            questionHeader.classList.add('blurred');
        }
    }
}

function closeInstructions() {
    const overlay = document.getElementById('instruction-overlay');
    const questionContent = document.querySelector('.question-content');
    const questionHeader = document.querySelector('.question-header-container');
    
    if (overlay && questionContent) {
        overlay.classList.add('hidden');
        questionContent.classList.remove('blurred');
        
        if (questionHeader) {
            questionHeader.classList.remove('blurred');
        }
    }
}

function loadQuestion(questionNum) {
    // Update question number and title
    document.getElementById('question-number').textContent = `Question ${questionNum}/${totalQuestions}`;
    document.getElementById('question-title').textContent = 'Which seat arrangement would you be more comfortable sitting in?';
    
    // Load images for current question
    const questionImages = questionData[questionNum];
    if (questionImages) {
        document.getElementById('option-a').src = questionImages.a;
        document.getElementById('option-b').src = questionImages.b;
    }
    
    // Clear previous selection
    clearSelection();
    selectedOption = null;
    
    // Restore previous selection if it exists
    if (userResponses[questionNum - 1]) {
        const previousSelection = userResponses[questionNum - 1];
        selectOption(previousSelection, false);
    }
    
    updateNavigationButtons();
}

function selectOption(option, recordResponse = true) {
    // Clear previous selection
    clearSelection();
    
    // Mark selected option
    const radioA = document.getElementById('radio-a');
    const radioB = document.getElementById('radio-b');
    const choiceA = radioA.closest('.option-choice');
    const choiceB = radioB.closest('.option-choice');
    
    if (option === 'A') {
        radioA.checked = true;
        choiceA.classList.add('selected');
    } else if (option === 'B') {
        radioB.checked = true;
        choiceB.classList.add('selected');
    }
    
    selectedOption = option;
    
    // Record response
    if (recordResponse) {
        userResponses[currentQuestion - 1] = option;
    }
    
    updateNavigationButtons();
}

function clearSelection() {
    const optionChoices = document.querySelectorAll('.option-choice');
    const radioButtons = document.querySelectorAll('input[name="seat-choice"]');
    
    optionChoices.forEach(element => {
        element.classList.remove('selected');
    });
    
    radioButtons.forEach(radio => {
        radio.checked = false;
    });
}

function updateProgressBar() {
    const progressFill = document.getElementById('progress-fill');
    const progressPercentage = (currentQuestion / totalQuestions) * 100;
    progressFill.style.width = progressPercentage + '%';
}

function updateNavigationButtons() {
    const nextBtn = document.getElementById('next-btn');
    
    // Enable/disable next button based on selection and question number
    if (currentQuestion === totalQuestions) {
        nextBtn.textContent = 'Submit';
        nextBtn.disabled = !selectedOption;
    } else {
        nextBtn.textContent = 'Next';
        nextBtn.disabled = !selectedOption;
    }
}

// Remove previousQuestion function as it's no longer needed with the new design

function nextQuestion() {
    if (!selectedOption) {
        alert('Please select an option before proceeding.');
        return;
    }
    
    // Record current response
    userResponses[currentQuestion - 1] = selectedOption;
    
    if (currentQuestion < totalQuestions) {
        currentQuestion++;
        loadQuestion(currentQuestion);
        updateProgressBar();
    } else {
        // Finish the study
        showResults();
    }
}

function showResults() {
    showPage('results-page');
    displayResults();
}

function displayResults() {
    const resultsList = document.getElementById('results-list');
    resultsList.innerHTML = '';
    
    userResponses.forEach((response, index) => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.textContent = `Question ${index + 1}: Option ${response}`;
        resultsList.appendChild(resultItem);
    });
}

function restartStudy() {
    currentQuestion = 1;
    userResponses = [];
    selectedOption = null;
    currentQuestionA = 1;
    userResponsesA = [];
    selectedTeam = null;
    sliderValuesA = { A: 50, B: 50 };
    showPage('home-page');
}

// Conjoint A Functions
function startQuestionsA() {
    currentQuestionA = 1;
    userResponsesA = [];
    selectedTeam = null;
    sliderValuesA = { A: 50, B: 50 };
    
    showPage('conjoint-a-page');
    loadQuestionA(currentQuestionA);
    updateProgressBarA();
    updateNavigationButtonsA();
    showInstructionOverlayA();
}

function showInstructionOverlayA() {
    const overlay = document.getElementById('instruction-overlay-a');
    const questionContent = document.querySelector('#conjoint-a-page .question-content');
    const questionHeader = document.querySelector('#conjoint-a-page .question-header-container');
    
    if (overlay && questionContent) {
        overlay.classList.remove('hidden');
        questionContent.classList.add('blurred');
        
        if (questionHeader) {
            questionHeader.classList.add('blurred');
        }
    }
}

function closeInstructionsA() {
    const overlay = document.getElementById('instruction-overlay-a');
    const questionContent = document.querySelector('#conjoint-a-page .question-content');
    const questionHeader = document.querySelector('#conjoint-a-page .question-header-container');
    
    if (overlay && questionContent) {
        overlay.classList.add('hidden');
        questionContent.classList.remove('blurred');
        
        if (questionHeader) {
            questionHeader.classList.remove('blurred');
        }
    }
}

function loadQuestionA(questionNum) {
    // Update question number and title
    document.getElementById('question-number-a').textContent = `Question ${questionNum}/${totalQuestions}`;
    document.getElementById('question-title-a').textContent = 'Which row would you be more comfortable sitting in?';
    
    // Load organization chart images for current question
    const questionImages = questionDataA[questionNum];
    if (questionImages) {
        const imageA = document.getElementById('team-image-a');
        const imageB = document.getElementById('team-image-b');
        imageA.src = questionImages.a;
        imageB.src = questionImages.b;
        
        // Add click event listeners to images
        imageA.onclick = () => selectTeam('A');
        imageB.onclick = () => selectTeam('B');
    }
    
    // Clear previous selection
    clearTeamSelection();
    selectedTeam = null;
    
    // Reset sliders
    sliderValuesA = { A: 50, B: 50 };
    const sliderA = document.getElementById('slider-a');
    const sliderB = document.getElementById('slider-b');
    sliderA.value = 50;
    sliderB.value = 50;
    sliderA.setAttribute('data-value', '50');
    sliderB.setAttribute('data-value', '50');
    
    // Update slider backgrounds and thumb positions
    updateSliderBackground('slider-a', 50);
    updateSliderBackground('slider-b', 50);
    updateSliderThumbPosition('slider-a', 50);
    updateSliderThumbPosition('slider-b', 50);
    
    // Initially disable both teams
    updateTeamStates();
    
    // Restore previous selection if it exists
    if (userResponsesA[questionNum - 1]) {
        const previousResponse = userResponsesA[questionNum - 1];
        selectTeam(previousResponse.team, false);
        sliderValuesA.A = previousResponse.sliderA;
        sliderValuesA.B = previousResponse.sliderB;
        const sliderA = document.getElementById('slider-a');
        const sliderB = document.getElementById('slider-b');
        sliderA.value = previousResponse.sliderA;
        sliderB.value = previousResponse.sliderB;
        sliderA.setAttribute('data-value', previousResponse.sliderA);
        sliderB.setAttribute('data-value', previousResponse.sliderB);
        updateSliderBackground('slider-a', previousResponse.sliderA);
        updateSliderBackground('slider-b', previousResponse.sliderB);
        updateSliderThumbPosition('slider-a', previousResponse.sliderA);
        updateSliderThumbPosition('slider-b', previousResponse.sliderB);
    }
    
    updateNavigationButtonsA();
}


function selectTeam(team, recordResponse = true) {
    // Clear previous selection
    clearTeamSelection();
    
    // Mark selected team
    const radioA = document.getElementById('radio-team-a');
    const radioB = document.getElementById('radio-team-b');
    const choiceA = radioA.closest('.team-choice');
    const choiceB = radioB.closest('.team-choice');
    
    if (team === 'A') {
        radioA.checked = true;
        choiceA.classList.add('selected');
    } else if (team === 'B') {
        radioB.checked = true;
        choiceB.classList.add('selected');
    }
    
    selectedTeam = team;
    
    // Update team states based on selection
    updateTeamStates();
    
    // Record response
    if (recordResponse) {
        userResponsesA[currentQuestionA - 1] = {
            team: team,
            sliderA: sliderValuesA.A,
            sliderB: sliderValuesA.B
        };
    }
    
    updateNavigationButtonsA();
}

function clearTeamSelection() {
    const teamChoices = document.querySelectorAll('.team-choice');
    const radioButtons = document.querySelectorAll('input[name="team-choice"]');
    
    teamChoices.forEach(element => {
        element.classList.remove('selected');
    });
    
    radioButtons.forEach(radio => {
        radio.checked = false;
    });
}

function updateTeamStates() {
    const teamContainerA = document.querySelector('.team-container:first-child');
    const teamContainerB = document.querySelector('.team-container:last-child');
    const teamChoiceA = document.getElementById('radio-team-a').closest('.team-choice');
    const teamChoiceB = document.getElementById('radio-team-b').closest('.team-choice');
    const sliderA = teamContainerA.querySelector('.comfort-slider');
    const sliderB = teamContainerB.querySelector('.comfort-slider');
    
    if (!selectedTeam) {
        // No team selected - disable both
        teamChoiceA.classList.add('disabled');
        teamChoiceB.classList.add('disabled');
        sliderA.classList.add('disabled');
        sliderB.classList.add('disabled');
    } else if (selectedTeam === 'A') {
        // Team A selected - enable A, disable B
        teamChoiceA.classList.remove('disabled');
        teamChoiceB.classList.add('disabled');
        sliderA.classList.remove('disabled');
        sliderB.classList.add('disabled');
    } else if (selectedTeam === 'B') {
        // Team B selected - enable B, disable A
        teamChoiceA.classList.add('disabled');
        teamChoiceB.classList.remove('disabled');
        sliderA.classList.add('disabled');
        sliderB.classList.remove('disabled');
    }
}

function updateSliderA(value) {
    sliderValuesA.A = parseInt(value);
    const slider = document.getElementById('slider-a');
    slider.setAttribute('data-value', value);
    updateSliderBackground('slider-a', value);
    updateSliderThumbPosition('slider-a', value);
    
    // Update response if team is already selected
    if (selectedTeam && userResponsesA[currentQuestionA - 1]) {
        userResponsesA[currentQuestionA - 1].sliderA = parseInt(value);
    }
}

function updateSliderB(value) {
    sliderValuesA.B = parseInt(value);
    const slider = document.getElementById('slider-b');
    slider.setAttribute('data-value', value);
    updateSliderBackground('slider-b', value);
    updateSliderThumbPosition('slider-b', value);
    
    // Update response if team is already selected
    if (selectedTeam && userResponsesA[currentQuestionA - 1]) {
        userResponsesA[currentQuestionA - 1].sliderB = parseInt(value);
    }
}

function updateSliderBackground(sliderId, value) {
    const slider = document.getElementById(sliderId);
    
    if (slider) {
        const percentage = (value - slider.min) / (slider.max - slider.min);
        // Update slider background gradient
        slider.style.setProperty('--value', percentage * 100 + '%');
    }
}

function updateSliderThumbPosition(sliderId, value) {
    const slider = document.getElementById(sliderId);
    
    if (slider) {
        const percentage = (value - slider.min) / (slider.max - slider.min);
        // Update CSS custom property for thumb position
        slider.style.setProperty('--thumb-position', (percentage * 100) + '%');
    }
}

function updateProgressBarA() {
    const progressFill = document.getElementById('progress-fill-a');
    const progressPercentage = (currentQuestionA / totalQuestions) * 100;
    progressFill.style.width = progressPercentage + '%';
}

function updateNavigationButtonsA() {
    const nextBtn = document.getElementById('next-btn-a');
    
    // Enable/disable next button based on selection and question number
    if (currentQuestionA === totalQuestions) {
        nextBtn.textContent = 'Submit';
        nextBtn.disabled = !selectedTeam;
    } else {
        nextBtn.textContent = 'Next';
        nextBtn.disabled = !selectedTeam;
    }
}

function nextQuestionA() {
    if (!selectedTeam) {
        alert('Please select a team before proceeding.');
        return;
    }
    
    // Record current response
    userResponsesA[currentQuestionA - 1] = {
        team: selectedTeam,
        sliderA: sliderValuesA.A,
        sliderB: sliderValuesA.B
    };
    
    if (currentQuestionA < totalQuestions) {
        currentQuestionA++;
        loadQuestionA(currentQuestionA);
        updateProgressBarA();
    } else {
        // Finish the study
        showResultsA();
    }
}

function showResultsA() {
    showPage('results-page');
    displayResultsA();
}

function displayResultsA() {
    const resultsList = document.getElementById('results-list');
    resultsList.innerHTML = '';
    
    userResponsesA.forEach((response, index) => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = `
            <strong>Question ${index + 1}:</strong> Team ${response.team}<br>
            <small>Comfort A: ${response.sliderA}, Comfort B: ${response.sliderB}</small>
        `;
        resultsList.appendChild(resultItem);
    });
}

// Keyboard navigation
document.addEventListener('keydown', function(event) {
    const currentPage = document.querySelector('.page.active').id;
    
    if (currentPage === 'questions-page') {
        // Don't interfere if instruction overlay is visible
        const overlay = document.getElementById('instruction-overlay');
        if (overlay && !overlay.classList.contains('hidden')) {
            return;
        }
        
        switch(event.key) {
            case '1':
                selectOption('A');
                break;
            case '2':
                selectOption('B');
                break;
            case 'ArrowRight':
            case 'Enter':
                if (!document.getElementById('next-btn').disabled) {
                    nextQuestion();
                }
                break;
        }
    }
});

// Add click handlers for better user experience
document.addEventListener('click', function(event) {
    // Handle image wrapper clicks
    if (event.target.closest('.image-wrapper')) {
        const imageWrapper = event.target.closest('.image-wrapper');
        const container = imageWrapper.closest('.image-option-container');
        const radioButton = container.querySelector('input[type="radio"]');
        
        if (radioButton) {
            radioButton.checked = true;
            selectOption(radioButton.value);
        }
    }
    
    // Handle option choice clicks
    if (event.target.closest('.option-choice')) {
        const optionChoice = event.target.closest('.option-choice');
        const radioButton = optionChoice.querySelector('input[type="radio"]');
        
        if (radioButton && !event.target.matches('input[type="radio"]')) {
            radioButton.checked = true;
            selectOption(radioButton.value);
        }
    }
});

// Error handling for missing images
function handleImageError(img) {
    img.style.display = 'none';
    const parent = img.parentElement;
    if (parent) {
        const errorMsg = document.createElement('div');
        errorMsg.textContent = 'Image not found';
        errorMsg.style.padding = '2rem';
        errorMsg.style.textAlign = 'center';
        errorMsg.style.color = '#e74c3c';
        errorMsg.style.border = '2px dashed #e74c3c';
        errorMsg.style.borderRadius = '8px';
        parent.appendChild(errorMsg);
    }
}

// Add error handlers to images when they're loaded
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            handleImageError(this);
        });
    });
});
