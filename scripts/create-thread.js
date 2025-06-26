// create-thread.js

import { ref, set } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-database.js";
import { database } from './firebase-config.js';
import { showError } from './utils.js';

// Get category from URL
const params = new URLSearchParams(window.location.search);
const category = params.get("category");

// Get form and input fields
const form = document.getElementById('createThreadForm');
const titleInput = document.getElementById('threadTitle');
const bodyInput = document.getElementById('threadBody');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    if (!category) {
        showError("Invalid category. Please go back and select a valid forum section.");
        return;
    }

    if (title && body) {
        const timestamp = Date.now();
        const threadId = `thread-${timestamp}`;

        const threadData = {
            title,
            body,
            category,
            createdAt: timestamp,
            author: "Anonymous" // This can be replaced later with actual user data
        };

        const threadRef = ref(database, `threads/${category}/${threadId}`);

        set(threadRef, threadData)
            .then(() => {
                // Redirect to the category's threads page
                window.location.href = `threads.html?category=${category}`;
            })
            .catch((error) => {
                console.error("Error creating thread:", error);
                showError("Something went wrong. Please try again.");
            });
    }
});
