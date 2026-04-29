// Classes

// Cake with name and default time
class Cake {
    constructor(name, defaultTime) {
        this.name = name;
        this.defaultTime = defaultTime;
    }

    getTime() {
        return this.defaultTime;
    }

    getName() {
        return this.name;
    }
}

// Timer class to manage the countdown and baking process
class Timer {
    constructor() {
        this.time = 0;
        this.status = "Idle";
        this.cake = null;
        this.completedAt = null;
        this.intervalId = null;
        this.setDefaultCake(); // Call method to set default cake on initialization
    }

    setDefaultCake() {
        // Set default cake to Cookie with 1-minute time
        const defaultCake = new Cake("Default", 0);
        this.setCake(defaultCake);
    }

    setCake(cake) {
        this.stop(); // Stop any existing timer
        this.status = "Idle"; // Reset status to Idle when a new cake is selected
        this.cake = cake;
        this.time = cake.getTime();
        document.getElementById("cakeNameDisplay").textContent = this.cake.getName();
        renderTimerDisplay(this.formatTime(this.time * 60));
        document.getElementById("cakeImage").src = this.getCakeImage(false); // Show unbaked image
        const startButton = document.getElementById("startButton");
        if (this.time > 0) {
            startButton.style.display = "inline-flex";
            startButton.disabled = false;
        } else {
            startButton.style.display = "none";
            startButton.disabled = true;
        }
    }

    start() {
        if (this.status === "Idle" && this.time > 0) {
            this.status = "Counting";
            let seconds = this.time * 60;
            this.intervalId = setInterval(() => {
                if (seconds <= 0) {
                    this.stop();
                    this.status = "Completed";
                    this.completedAt = new Date();
                    this.notify();
                    document.getElementById("cakeImage").src = this.getCakeImage(true); // Show baked image
                    document.getElementById("startButton").disabled = false; // Enable selection of a new cake
                } else {
                    seconds--;
                    remainingSeconds = seconds; // Update remaining seconds for pause/resume functionality
                    renderTimerDisplay(this.formatTime(seconds));
                }
            }, 1000);
        }
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    notify() {
        const audio = document.getElementById("notificationSound");
        audio.play();
        showPushNotification();
        const popup = document.getElementById("cakeDonePopup");
        popup.style.display = "flex";
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    getCakeImage(isBaked) {
        const cakeName = this.cake.getName().toLowerCase();
        if (cakeName.includes("default")) {
            return "../assets/images/oven.png"; // Default image
        } else if (cakeName.includes("cookie")) {
            return isBaked ? "../assets/images/cookie-after.png" : "../assets/images/cookie-before.png";
        } else if (cakeName.includes("cupcake")) {
            return isBaked ? "../assets/images/cupcake-after.png" : "../assets/images/cupcake-before.png";
        } else if (cakeName.includes("bread")) {
            return isBaked ? "../assets/images/bread-after.png" : "../assets/images/bread-before.png";
        } else {
            return isBaked ? "../assets/images/custom-after.png" : "../assets/images/custom-before.png";
        }
    }
}

// Initialization
const timer = new Timer();
let timerInterval = null;
let currentCakeName = "";
let currentDurationMinutes = 0;
let remainingSeconds = 0;

function renderTimerDisplay(timeText) {
    const el = document.getElementById("timerDisplay");
    if (!el) return;

    const text = String(timeText);
    const parts = text.split(":");
    const mins = (parts[0] ?? "00").padStart(2, "0");
    const secs = (parts[1] ?? "00").padStart(2, "0");

    el.innerHTML = "";

    const minsSpan = document.createElement("span");
    minsSpan.className = "timer-part";
    minsSpan.textContent = mins;

    const colonSpan = document.createElement("span");
    colonSpan.className = "timer-colon";
    colonSpan.textContent = ":";

    const secsSpan = document.createElement("span");
    secsSpan.className = "timer-part";
    secsSpan.textContent = secs;

    el.appendChild(minsSpan);
    el.appendChild(colonSpan);
    el.appendChild(secsSpan);

    // Keep accessible + keep pauseTimer parsing working via textContent
    el.setAttribute("aria-label", `${mins}:${secs}`);
}

function showElement(id) {
    const el = document.getElementById(id);
    if (!el) return;
    // Clear inline display override so CSS/default display can apply
    el.style.display = "";
}

function hideElement(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.display = "none";
}

// Select cake function
function selectCake(name, time) {
    const cake = new Cake(name, time);
    timer.setCake(cake);
}

// Set custom time function
function setCustomTime() {
    const customTime = parseInt(document.getElementById("customTime").value);
    const customCakeName = document.getElementById("customCakeName").value || "Custom";
    if (customTime > 0) {
        const cake = new Cake(customCakeName, customTime);
        timer.setCake(cake);
    } else {
        alert("Invalid time input. Please enter a positive number.");
    }
}

// Start timer function
function startTimer() {
    timer.start();
    currentCakeName = timer.cake.getName();
    currentDurationMinutes = timer.time;
    remainingSeconds = timer.time * 60;

    // update UI to show pause and cancel buttons, hide start button
    hideElement("startButton");
    hideElement("backButton");
    showElement("pauseButton");
    document.getElementById("pauseButton").disabled = false;
    hideElement("resumeButton");
    showElement("cancelButton");

}

function pauseTimer() {
    timer.stop();
    clearInterval(timerInterval);
    timerInterval = null;
    const display = document.getElementById("timerDisplay").textContent;
    const [mins, secs] = display.split(":").map(Number);
    remainingSeconds = mins * 60 + secs;

    // update UI to show resume and cancel buttons, hide pause button
    hideElement("pauseButton");
    showElement("resumeButton");
    showElement("cancelButton");
}

function resumeTimer() {
    // prevent duplicate intervals if user clicks resume multiple times
    clearInterval(timerInterval);
    timer.stop();

    // rerun interval with remaining seconds
    timerInterval = setInterval(() => {
        if (remainingSeconds <= 0) {
            clearInterval(timerInterval);
            timer.notify();
        } else {
            remainingSeconds--;
            renderTimerDisplay(timer.formatTime(remainingSeconds));
        }
    }, 1000);
    // update UI to show pause and cancel button, hide resume buttons
    showElement("pauseButton");
    hideElement("resumeButton");
    showElement("cancelButton");
}

function cancelTimer() {
    timer.stop();
    clearInterval(timerInterval);
    remainingSeconds = 0;

    // reset UI, back to ready state, hide buttons except start button
    renderTimerDisplay(timer.formatTime(timer.time * 60)); 
    hideElement("pauseButton");
    hideElement("resumeButton");
    hideElement("cancelButton");
    hideElement("backButton");
    document.getElementById("startButton").disabled = false;
    showElement("startButton");
    // no call saveSession to save history since user canceled the timer, reset timer status to Idle

    timer.status = "Idle";
}

function backToSelection() {
    timer.setDefaultCake();
    hideElement("backButton");
    hideElement("startButton");
}

// Render and show history function
function renderHistoryTable(sessions) {
    const historyTableBody = document.getElementById("historyList");
    historyTableBody.innerHTML = "";
    sessions.forEach(entry => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${entry.cake_name}</td>
            <td>${entry.duration_minutes}</td>
            <td>${new Date(entry.completed_at).toLocaleString()}</td>
        `;
        historyTableBody.appendChild(row);
    });
}
async function showHistory() {
    const tableContainer = document.querySelector(".history-table-container");
    const isVisible = tableContainer.classList.contains("show");

    if (isVisible) {
        tableContainer.classList.remove("show");
        return;
    }

    try {
        const sessions = await fetchSessions();
        renderHistoryTable(sessions);
        tableContainer.classList.add("show");
    } catch (error) {
        console.error(error);
        alert("Could not fetch session history. Is the server running?");
    }
}

// Close pop-up function 
async function closePopup() {
    document.getElementById("cakeDonePopup").style.display = "none";
    try {
        await saveSession(currentCakeName, currentDurationMinutes);
        // Enable the "Back to Selection" button for a new session
        showElement("backButton");
        // Ensure timer controls are hidden after completion
        hideElement("pauseButton");
        hideElement("resumeButton");
        hideElement("cancelButton");
        hideElement("startButton");
    } catch (error) {
        console.error(error)
        alert("Could not save session to history. Please try again.");    
    }
}
 
// POST /api/sessions to save session into backend
async function saveSession(cakeName, durationMinutes) {
    const response = await fetch("/api/sessions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            cake_name: cakeName,
            duration_minutes: durationMinutes,
            completed_at: new Date().toISOString()
        })
    });

    if (!response.ok) {
        throw new Error(`Failed to save session: ${response.statusText}`);
    }
    return response.json();

}

// GET api/sessions to retrieve session history when user clicks "View history"
async function fetchSessions() {
    const response = await fetch("/api/sessions");
    if (!response.ok) {
        throw new Error(`Failed to fetch sessions: ${response.status}`);
    }
    return response.json();
}

// Request push notification permission
async function requestNotificationPermission() {
    if (!("Notification" in window)) {
        return;
    }
    if (Notification.permission === "default") {
        await Notification.requestPermission();
    }
}

function showPushNotification() {
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    new Notification("Bakery Timer", {
        body: `Your cake is done!`
    })
}

requestNotificationPermission();