import { get, ref, onChildAdded, set, remove } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-database.js";
import { database } from './firebase-config.js';

let currentThread = null;

const params = new URLSearchParams(window.location.search);
const threadId = params.get("id");
const category = params.get("category");

const titleEl = document.getElementById("thread-title");
const authorEl = document.getElementById("thread-author");
const dateEl = document.getElementById("thread-date");
const bodyEl = document.getElementById("thread-body");
const errorEl = document.getElementById("thread-error");
const backLink = document.getElementById("back-link");

if (category) {
    backLink.href = `threads.html?category=${category}`;
}

// Load thread
if (threadId && category) {
    const threadRef = ref(database, `threads/${category}/${threadId}`);
    get(threadRef).then(snapshot => {
        if (snapshot.exists()) {
            const thread = snapshot.val();
            currentThread = { ...thread }; // clone for safe editing

            titleEl.textContent = thread.title || "Untitled";
            authorEl.textContent = thread.author || "Anonymous";
            dateEl.textContent = new Date(thread.createdAt).toLocaleString() || "(unknown date)";
            bodyEl.innerHTML = `<p>${thread.body || ""}</p>`;

            attachEditThreadListeners();
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

// Replies
const repliesContainer = document.getElementById("replies-container");
let replyCount = 0;

if (threadId && category) {
    const repliesRef = ref(database, `replies/${category}/${threadId}`);
    onChildAdded(repliesRef, (snapshot) => {
        const reply = snapshot.val();
        const replyKey = snapshot.key;
        const displayAuthor = reply.author || "Anonymous";

        const replyEl = document.createElement("div");
        replyEl.className = `reply ${replyCount % 2 === 0 ? 'reply-dark' : 'reply-light'}`;
        replyEl.id = `reply-${replyKey}`;
        replyCount++;

        replyEl.innerHTML = `
            <p><strong>${displayAuthor}</strong> replied:</p>
            <p class="reply-body">${reply.body}</p>
            <small>${new Date(reply.createdAt).toLocaleString()}</small>
            <div class="reply-actions">
                <button class="edit-reply-btn">Edit</button>
                <button class="delete-reply-btn">Delete</button>
            </div>
            <hr>
        `;

        repliesContainer.appendChild(replyEl);

        attachReplyListeners(replyEl, reply, replyKey);
    });
}

function attachReplyListeners(replyEl, reply, replyKey) {
    const replyActions = replyEl.querySelector(".reply-actions");
    const replyBodyEl = replyEl.querySelector(".reply-body");

    const originalText = reply.body;

    const handleEdit = () => {
        replyBodyEl.innerHTML = `
            <textarea class="edit-reply-textarea" style="width: 100%;">${reply.body}</textarea>
        `;

        replyActions.innerHTML = `
            <button class="save-reply-btn">Save</button>
            <button class="cancel-reply-btn">Cancel</button>
        `;

        replyActions.querySelector(".save-reply-btn").addEventListener("click", () => {
            const updatedText = replyBodyEl.querySelector(".edit-reply-textarea").value.trim();
            if (!updatedText) return;

            const replyRef = ref(database, `replies/${category}/${threadId}/${replyKey}`);
            set(replyRef, {
                ...reply,
                body: updatedText
            }).then(() => {
                reply.body = updatedText; // Update local state
                replyBodyEl.textContent = updatedText;
                replyActions.innerHTML = `
                    <button class="edit-reply-btn">Edit</button>
                    <button class="delete-reply-btn">Delete</button>
                `;
                attachReplyListeners(replyEl, reply, replyKey);
            }).catch(err => {
                console.error("Failed to save reply edit:", err);
                alert("Could not update reply.");
            });
        });

        replyActions.querySelector(".cancel-reply-btn").addEventListener("click", () => {
            replyBodyEl.textContent = reply.body;
            replyActions.innerHTML = `
                <button class="edit-reply-btn">Edit</button>
                <button class="delete-reply-btn">Delete</button>
            `;
            attachReplyListeners(replyEl, reply, replyKey);
        });
    };

    const editBtn = replyActions.querySelector(".edit-reply-btn");
    if (editBtn) editBtn.addEventListener("click", handleEdit);

    const deleteBtn = replyActions.querySelector(".delete-reply-btn");
    if (deleteBtn) {
        deleteBtn.addEventListener("click", () => {
            const confirmDelete = confirm("Are you sure you want to delete this reply?");
            if (!confirmDelete) return;

            const replyRef = ref(database, `replies/${category}/${threadId}/${replyKey}`);
            remove(replyRef)
                .then(() => {
                    replyEl.remove(); // Remove from DOM
                })
                .catch((err) => {
                    console.error("Failed to delete reply:", err);
                    alert("Could not delete reply.");
                });
        });
    }
}

// Thread editing
function attachEditThreadListeners() {
    const actions = document.querySelector(".thread-actions");
    if (!actions) return;

    const editThreadBtn = actions.querySelector(".edit-thread-btn");
    const deleteThreadBtn = actions.querySelector(".delete-thread-btn");

    // Handle EDIT
    if (editThreadBtn) {
        editThreadBtn.addEventListener("click", () => {
            const originalTitle = currentThread.title || "Untitled";
            const originalBody = currentThread.body || "";

            titleEl.innerHTML = `<input type="text" id="edit-title" value="${originalTitle}" style="width: 100%;">`;
            bodyEl.innerHTML = `<textarea id="edit-body" rows="6" style="width: 100%;">${originalBody}</textarea>`;

            actions.innerHTML = `
                <button id="save-thread">Save</button>
                <button id="cancel-thread">Cancel</button>
            `;

            document.getElementById("save-thread").addEventListener("click", () => {
                const newTitle = document.getElementById("edit-title").value.trim();
                const newBody = document.getElementById("edit-body").value.trim();

                if (newTitle && newBody) {
                    const threadRef = ref(database, `threads/${category}/${threadId}`);
                    set(threadRef, {
                        ...currentThread,
                        title: newTitle,
                        body: newBody
                    }).then(() => location.reload())
                      .catch(err => {
                          console.error("Error saving thread edit:", err);
                          alert("Failed to save thread.");
                      });
                }
            });

            document.getElementById("cancel-thread").addEventListener("click", () => {
                titleEl.textContent = originalTitle;
                bodyEl.innerHTML = `<p>${originalBody}</p>`;
                actions.innerHTML = `
                    <button class="edit-thread-btn">Edit</button>
                    <button class="delete-thread-btn">Delete</button>
                `;
                attachEditThreadListeners(); // reattach listeners after cancel
            });
        });
    }

    // Handle DELETE
    if (deleteThreadBtn) {
        deleteThreadBtn.addEventListener("click", () => {
            const confirmDelete = confirm("Are you sure you want to delete this thread?");
            if (!confirmDelete) return;

            const threadRef = ref(database, `threads/${category}/${threadId}`);
            const repliesRef = ref(database, `replies/${category}/${threadId}`);

            // Delete both thread and its replies
            remove(threadRef)
                .then(() => remove(repliesRef))
                .then(() => {
                    window.location.href = `threads.html?category=${category}`;
                })
                .catch((err) => {
                    console.error("Failed to delete thread:", err);
                    alert("Could not delete thread.");
                });
        });
    }
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
            author: null,
            createdAt: timestamp
        };

        const replyRef = ref(database, `replies/${category}/${threadId}/${replyId}`);
        set(replyRef, replyData)
            .then(() => replyForm.reset())
            .catch((error) => {
                console.error("Error submitting reply:", error);
                alert("Failed to post reply.");
            });
    });
}

function showError(message) {
    errorEl.textContent = message;
    errorEl.style.display = "block";
    titleEl.textContent = "Error";
    bodyEl.innerHTML = "";
}
