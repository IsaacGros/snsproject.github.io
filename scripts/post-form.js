// imports for post-form
import { ref, set } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-database.js";
import { database } from './firebase-config.js';

/* START POST FORM SCRIPT */

// Get a reference to the form element
const postForm = document.getElementById('postForm');

// Add a listener that uses a generic type 'e' to create an event object to handle when the form is submitted
postForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevents the page from reloading, which is HTML's default action
                
    // Get the user's input from the form fields
    const title = document.getElementById('postTitle').value.trim();
    const body = document.getElementById('postBody').value.trim();

    // Checks the title and body fields are not empty, to prevent creating empty posts
    if(title && body) {
        // Creates a timestamp for the current time the post was made
        const timestamp = Date.now();
        // Creates a unique postId by using the timestamp since time only increases
        const postId = `post-${timestamp}`;

            // Points to the location in your Firebase Realtime Database under the "posts" node
            set(ref(database, 'posts/' + postId), {
                // set() writes the object data into that exact location.
                title: title,
                body: body,
                createdAt: timestamp
            }).then(() => {
                // Message to user to tell them their post has sucessfully been written to the database
                alert("Post submitted!");
                postForm.reset(); // Clear the form for next post
            }).catch((error) => {
                // If an any error occurrs when the post is being written to the database a log of the error is written to the console browser
                console.error("Error writing new post:", error);
        });
    }
});

/* END POST FORM SCRIPT */