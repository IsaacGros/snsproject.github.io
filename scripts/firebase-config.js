// START FIREBASE CONFIG

// script provided by Firebase app setup to link (frontend) webpage with (backend) server
    // Import the functions you need from the SDKs you need
    import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
    import { getDatabase } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-database.js";
    
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries
    
    // Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyDgoP1GjoNETtE8mgLVgt5E_By_VRbjg8c",
        authDomain: "sns-project-66bca.firebaseapp.com",
        databaseURL: "https://sns-project-66bca-default-rtdb.firebaseio.com",
        projectId: "sns-project-66bca",
        storageBucket: "sns-project-66bca.firebasestorage.app",
        messagingSenderId: "597172879896",
        appId: "1:597172879896:web:84d35c59a4a0f1731e396d"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);

    export { database };
// END FIREBASE CONFIG

console.log("firebase-config.js loaded successfully");
