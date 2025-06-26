// thread.js
import { get, ref, onChildAdded, set } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-database.js";
import { database } from './firebase-config.js';

// Get thread ID and category from the URL
const params = new URLSearchParams(window.location.search);
const threadId = params.get("id");
const category = params.get("category");

// Select elements to update
const titleEl = document.getElementById("thread-title");
const authorEl = document.getElementById("thread-author");
const dateEl = document.getElementById("thread-date");
const bodyEl = document.getElementById("thread-body");
const errorEl = document.getElementById("thread-error");
const backLink = document.getElementById("back-link");

// Set correct back link (to threads.html for the category)
if (category) {
    backLink.href = `threads.html?category=${category}`;
}

// Validate and fetch thread
if (threadId && category) {
    const threadRef = ref(database, `threads/${category}/${threadId}`);
    get(threadRef).then(snapshot => {
        if (snapshot.exists()) {
            const thread = snapshot.val();

            // Fill in the page
            titleEl.textContent = thread.title || "Untitled";
            authorEl.textContent = thread.author || "Anonymous";
            dateEl.textContent = new Date(thread.createdAt).toLocaleString() || "(unknown date)";
            bodyEl.innerHTML = `<p>${thread.body || ""}</p>`;
        } else {
            showError("Thread not found.");
        }
    }).catch(error => {
        console.error("Error fetching thread:", error);
        showError("Failed to load thread.");
    });
} else {
    showError("Invalid thread link.");
}

// Reply Logic

// Select replies container to append replies into
const repliesContainer = document.getElementById("replies-container");
let replyCount = 0; // Used to alternate styles

// Load and display replies
if (threadId && category) {
    const repliesRef = ref(database, `replies/${category}/${threadId}`);

    onChildAdded(repliesRef, (snapshot) => {
        console.log("New reply received", snapshot.key, snapshot.val());
        const reply = snapshot.val();

        // Use fallback if no author is stored
        const displayAuthor = reply.author || "Anonymous";

        const replyEl = document.createElement("div");
        replyEl.className = `reply ${replyCount % 2 === 0 ? 'reply-dark' : 'reply-light'}`;
        replyCount++;

        replyEl.innerHTML = `
            <p><strong>${displayAuthor}</strong> replied:</p>
            <p>${reply.body}</p>
            <small>${new Date(reply.createdAt).toLocaleString()}</small>
            <hr>
        `;

        repliesContainer.appendChild(replyEl);
    });
}

// Handle reply form submission
const replyForm = document.getElementById("reply-form");

if (replyForm && category && threadId) {
    replyForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const replyText = document.getElementById("reply-text").value.trim();
        if (!replyText) return;

        const timestamp = Date.now();
        const replyId = `reply-${timestamp}`;

        const replyData = {
            body: replyText,
            author: null, // Future enhancement: replace with user account name
            createdAt: timestamp
        };

        const replyRef = ref(database, `replies/${category}/${threadId}/${replyId}`);
        set(replyRef, replyData)
            .then(() => {
                replyForm.reset();
            })
            .catch((error) => {
                console.error("Error submitting reply:", error);
                alert("Failed to post reply.");
            });
    });
}

// Show error function
function showError(message) {
    errorEl.textContent = message;
    errorEl.style.display = "block";
    titleEl.textContent = "Error";
    bodyEl.innerHTML = "";
}