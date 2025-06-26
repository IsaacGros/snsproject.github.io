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
    const threadLink = document.createElement("a");
    threadLink.className = "thread-preview";
    threadLink.href = `thread.html?id=${threadId}&category=${threadData.category}`;

    const createdDate = threadData.createdAt
        ? new Date(threadData.createdAt).toLocaleString()
        : "Unknown";

    threadLink.innerHTML = `
        <h3>${threadData.title}</h3>
        <div class="thread-preview-meta">
        <p>By ${threadData.author || "Anonymous"}</p>
        <p>Posted: ${createdDate}</p>
        </div>
    `;
    return threadLink;
}

// After you extract the category:
const createBtn = document.getElementById("create-thread-btn");

if (category && createBtn) {
    createBtn.href = `create-thread.html?category=${category}`;
}
