// imports for post-display
import { ref, onChildAdded } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-database.js";
import { database } from './firebase-config.js';

/* START DISPLAY POST SCRIPT */

// Grab the div from the HTML where we want to display the posts
const postsContainer = document.getElementById('postsContainer');
// Create a reference to the 'posts/' section of your Firebase Realtime Database
const postsRef = ref(database, 'posts/');

// Set up a listener that triggers every time a new child (post) is added
onChildAdded(postsRef, (snapshot) => {
    const post = snapshot.val();

    const postElement = document.createElement('div');
    postElement.classList.add('post');

    postElement.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.body}</p>
        <small>Post at: ${new Date(post.createdAt).toLocaleString()}</small>
        <hr>
    `;

    // Prepend so new posts show up on top
    postsContainer.prepend(postElement);
});

/* END DISPLAY POST SCRIPT */