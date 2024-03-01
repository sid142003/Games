document.getElementById('addGuest').addEventListener('click', addGuestCheckRooms);
const incomeDisplay = document.getElementById('income');
let income = 0;
let roomCount = 0;
// let income = 0;
let maxIncome = 0;
let chance = 1;
const incomes = [];
const totalChances = 3;
let timerInterval;

function addRoom(type) {
    const index = roomCount++;
    const room = document.createElement('div');
    room.className = `room ${type}`;
    room.setAttribute('data-type', type);
    room.setAttribute('data-index', index);
    document.getElementById('rooms').appendChild(room);

    room.addEventListener('dragover', dragOver);
    room.addEventListener('dragenter', dragEnter);
    room.addEventListener('dragleave', dragLeave);
    room.addEventListener('drop', drop);
    room.addEventListener('click', () => upgradeRoom(room));
}

for (let i = 0; i < 3; i++) addRoom('normal');
for (let i = 0; i < 2; i++) addRoom('upgraded');

function addGuest() {
    const guest = document.createElement('div');
    guest.className = 'guest';
    guest.setAttribute('draggable', true);
    guest.addEventListener('dragstart', dragStart);
    guest.addEventListener('dragend', dragEnd);
    // document.body.appendChild(guest); // Temporarily add to body for positioning
    document.getElementById('guestContainer').appendChild(guest); // Append guest to the guestContainer

    positionGuest(guest);
}

function positionGuest(guest) {
    const roomType = document.getElementById('roomType').value;
    guest.setAttribute('data-room-type', roomType);
    guest.textContent = roomType.charAt(0).toUpperCase(); // N for Normal, U for Upgraded
}

function addGuestCheckRooms() {
    const rooms = document.getElementsByClassName('room');
    if (document.querySelectorAll('.guest').length >= rooms.length) {
        if (income >= 500) {
            income -= 500;
            addRoom('normal');
            updateIncomeDisplay();
            alert("A new normal room has been created for $500.");
        } else {
            alert("Not enough income to create a new room. Need at least $500.");
            return;
        }
    }
    addGuest();
}

function dragStart(e) {
    e.target.classList.add('grabbing');
    setTimeout(() => e.target.classList.add('hide'), 0);
}

function dragEnd(e) {
    e.target.classList.remove('grabbing', 'hide');
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
    e.target.classList.add('over');
}

function dragLeave(e) {
    e.target.classList.remove('over');
}

function drop(e) {
    e.preventDefault();
    const guest = document.querySelector('.grabbing');
    const room = e.target.closest('.room');
    room.classList.remove('over');

    // Check if the room already contains a guest
    if (room.querySelector('.guest')) {
        alert("There is already a guest in this room!");
        return; // Stop further execution
    }

    if (room.getAttribute('data-type') === guest.getAttribute('data-room-type')) {
        room.appendChild(guest);
        guest.classList.remove('grabbing', 'hide');
        calculateIncome(room.getAttribute('data-type'));

        setTimeout(() => {
            if (guest.parentNode === room) {
                room.removeChild(guest);
            }
        }, 15000);
    } else {
        alert("Guest requires a different room type!");
        document.body.appendChild(guest);
    }
}


function upgradeRoom(room) {
    if (room.getAttribute('data-type') === 'normal') {
        room.classList.remove('normal');
        room.classList.add('upgraded');
        room.setAttribute('data-type', 'upgraded');
        alert("Room upgraded to 'upgraded' type.");
    } else {
        alert("This room is already upgraded.");
    }
}

function calculateIncome(roomType) {
    if (roomType === 'normal') {
        income += 100;
    } else if (roomType === 'upgraded') {
        income += 200;
    }
    updateIncomeDisplay();
}

function updateIncomeDisplay() {
    incomeDisplay.textContent = income;
}



document.getElementById('addGuest').addEventListener('click', addGuestCheckRooms);
updateIncomeDisplay();
updateChanceDisplay();

startTimer();

function startTimer() {
    let time = 120; // 2 minutes in seconds
    timerInterval = setInterval(() => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        document.getElementById('timer').textContent = `Time: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        if (time <= 0) {
            clearInterval(timerInterval);
            finishRound();
        }
        time--;
    }, 1000);
}

function finishRound() {
    incomes.push(income);
    if (incomes.length === totalChances) {
        maxIncome = Math.max(...incomes);
        document.getElementById('maxIncome').textContent = maxIncome;
        displayResults();
    } else {
        resetForNextChance();
    }
}

function resetForNextChance() {
    income = 0;
    chance++;
    updateIncomeDisplay();
    updateChanceDisplay();
    clearRooms();
    startTimer();
}

function updateIncomeDisplay() {
    document.getElementById('income').textContent = income;
}

function updateChanceDisplay() {
    document.getElementById('chanceDisplay').textContent = `Chance: ${chance} of ${totalChances}`;
}

function displayResults() {
    const resultsElement = document.getElementById('results');
    resultsElement.innerHTML = `Game Over! Maximum Income: $${maxIncome}`;
    document.getElementById('addGuest').disabled = true; // Disable adding new guests after game over
}

// Include previous game logic here (addRoom, addGuest, drag and drop functions, etc.)

function clearRooms() {
    const roomsElement = document.getElementById('rooms');
    roomsElement.innerHTML = ''; // Clear all rooms
    // Reinitialize rooms for the next chance
    for (let i = 0; i < 3; i++) addRoom('normal');
    for (let i = 0; i < 2; i++) addRoom('upgraded');
}


function addGuestCheckRooms() {
    const rooms = document.getElementsByClassName('room');
    const guests = document.querySelectorAll('.room .guest');
    // Check if the number of guests is equal to or exceeds the number of rooms
    if (guests.length >= rooms.length) {
        // Verify income sufficiency for room creation
        if (income >= 500) { // Assuming each new room costs $500
            income -= 500; // Deduct the cost of the new room from the income
            addRoom('normal'); // Add a new normal room by default
            updateIncomeDisplay();
            alert("A new normal room has been created for $500. Income deducted.");
        } else {
            alert("Not enough income to create a new room. Increase your income by serving guests.");
            return; // Exit the function to prevent adding a guest when there's no room
        }
    }
    // Proceed to add a guest only if there's an available room or after creating a new room
    addGuest();
}

// Ensure the rest of your game logic (addRoom, addGuest, etc.) is included here as previously defined.

// function clearRooms() {
//     const roomsElement = document.getElementById('rooms');
//     roomsElement.innerHTML = ''; // Clear all rooms for a fresh start in each round/chance
//     // Consider reinitializing a default set of rooms here if needed for the start of each chance
// }


