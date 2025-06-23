// imports for test-button
import { database } from './firebase-config.js';
import { ref, set } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-database.js";


// Define the test write function and expose it to the global window object
const testWrite = () => {
    set(ref(database, 'test/hello'), {
        message: "Hello world from Firebase!"
    });
};

// Expose to window so it can be called from a button in HTML
window.testWrite = testWrite;