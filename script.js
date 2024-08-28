// Get chatbot elements
const chatbot = document.getElementById('chatbot');
const conversation = document.getElementById('conversation');
const inputForm = document.getElementById('input-form');
const inputField = document.getElementById('input-field');
const clearChatButton = document.getElementById('clear-chat'); // Get the clear chat button

// Get admin interface elements
const responseForm = document.getElementById('response-form');
const responseField = document.getElementById('response-field');
const resetButton = document.getElementById('reset-button');
const responsesList = document.getElementById('responses-list');

// Initialize responses object
let responses = {};

// Toggle Dark Mode
const toggleButton = document.getElementById('toggle-mode');
toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.getElementById('header').classList.toggle('dark-mode');
    document.getElementById('chatbot-container').classList.toggle('dark-mode');
    document.getElementById('admin-container').classList.toggle('dark-mode'); // Menyamakan warna Manage Responses di dark mode
    document.getElementById('input-field').classList.toggle('dark-mode');
    document.querySelector('h3').classList.toggle('dark-mode'); // Tambahkan ini untuk "Manage Responses"
    document.querySelector('h4').classList.toggle('dark-mode'); // Tambahkan ini untuk "Stored Responses"
    document.getElementById('responses-list').classList.toggle('dark-mode'); // Menambahkan ini untuk Stored Responses
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

// Load Dark Mode Preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    document.getElementById('header').classList.add('dark-mode');
    document.getElementById('chatbot-container').classList.add('dark-mode');
    document.getElementById('admin-container').classList.add('dark-mode'); // Menyamakan warna Manage Responses di dark mode
    document.getElementById('input-field').classList.add('dark-mode');
    document.querySelector('h3').classList.add('dark-mode'); // Tambahkan ini untuk "Manage Responses"
    document.querySelector('h4').classList.add('dark-mode'); // Tambahkan ini untuk "Stored Responses"
    document.getElementById('responses-list').classList.add('dark-mode'); // Menambahkan ini untuk Stored Responses
}

// Add event listener to input form
inputForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const input = inputField.value.trim();
    inputField.value = '';
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit" });

    // Add user input to conversation
    let message = document.createElement('div');
    message.classList.add('chatbot-message', 'user-message');
    message.innerHTML = `<p class="chatbot-text" sentTime="${currentTime}">${input}</p>`;
    conversation.appendChild(message);

    // Generate chatbot response
    const response = generateResponse(input);

    // Add chatbot response to conversation
    message = document.createElement('div');
    message.classList.add('chatbot-message', 'chatbot');
    message.innerHTML = `<p class="chatbot-text" sentTime="${currentTime}">${response}</p>`;
    conversation.appendChild(message);
    message.scrollIntoView({ behavior: "smooth" });

    // Save conversation to local storage
    saveConversation();
});

// Add event listener to response form (admin interface)
responseForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const question = prompt("Enter the question for this response:").trim();
    const response = responseField.value.trim();
    responseField.value = '';

    if (question && response) {
        responses[question.toLowerCase()] = response;
        updateResponsesList(); // Update the displayed list of responses
        alert(`Response for "${question}" added successfully!`);
    } else {
        alert('Please enter a valid question and response.');
    }
});

// Add event listener to reset button
resetButton.addEventListener('click', function() {
    responses = {};
    updateResponsesList(); // Clear the displayed list of responses
    alert('All responses have been reset.');
});

// Add event listener to clear chat button
clearChatButton.addEventListener('click', function() {
    if (confirm('Are you sure you want to clear the chat?')) {
        conversation.innerHTML = ''; // Clear the conversation display
        localStorage.removeItem('conversation'); // Remove conversation from local storage
        alert('Chat has been cleared.');
    }
});

// Generate chatbot response function
function generateResponse(input) {
    const question = input.toLowerCase();

    if (responses[question]) {
        return responses[question];
    } else {
        return "Maaf, ga ada jawabannya.";
    }
}

// Function to update the displayed list of stored responses
function updateResponsesList() {
    responsesList.innerHTML = ''; // Clear the current list
    Object.keys(responses).forEach((question) => {
        const listItem = document.createElement('li');
        listItem.textContent = `Q: "${question}" - A: "${responses[question]}"`;

        // Add a delete button for each response
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = function() {
            delete responses[question];
            updateResponsesList();
            alert(`Response for "${question}" has been deleted.`);
        };

        listItem.appendChild(deleteButton);
        responsesList.appendChild(listItem);
    });

    // Menambahkan kelas dark-mode ke list items saat dark mode aktif
    if (document.body.classList.contains('dark-mode')) {
        responsesList.classList.add('dark-mode');
    } else {
        responsesList.classList.remove('dark-mode');
    }
}

// Save conversation to local storage
function saveConversation() {
    localStorage.setItem('conversation', conversation.innerHTML);
}

// Load conversation from local storage
function loadConversation() {
    if (localStorage.getItem('conversation')) {
        conversation.innerHTML = localStorage.getItem('conversation');
    }
}

// Initialize conversation
loadConversation();
