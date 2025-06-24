// threads.js
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-database.js";
import { database } from './firebase-config.js'; // Use shared database instance

// Get DOM elements
const categoryTitleEl = document.getElementById("category-title");
const threadsContainer = document.getElementById("threads-container");
const noThreadsMsg = document.getElementById("no-threads-message");

// Get category from URL (e.g. ?category=art)
const params = new URLSearchParams(window.location.search);
const category = params.get("category");

// Update the title on the page
if (category) {
    categoryTitleEl.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    loadThreads(category);
} else {
    categoryTitleEl.textContent = "Invalid Category";
    noThreadsMsg.style.display = "block";
}

// Load threads from Firebase by category
function loadThreads(category) {
    const threadsRef = ref(database, `threads/${category}`);

    get(threadsRef).then((snapshot) => {
        if (snapshot.exists()) {
            const threads = snapshot.val();
            Object.entries(threads).forEach(([threadId, threadData]) => {
                const threadEl = createThreadElement(threadId, threadData);
                threadsContainer.appendChild(threadEl);
            });
        } else {
            noThreadsMsg.style.display = "block";
        }
    }).catch((error) => {
        console.error("Error loading threads:", error);
        noThreadsMsg.style.display = "block";
    });
}

// Create a DOM element for a single thread
function createThreadElement(threadId, threadData) {
    const threadDiv = document.createElement("div");
    threadDiv.className = "thread-preview";
    threadDiv.innerHTML = `
        <h3><a href="thread.html?id=${threadId}&category=${threadData.category}">${threadData.title}</a></h3>
        <p>By ${threadData.author || "Anonymous"}</p>
    `;
    return threadDiv;
}