const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-app.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-app.appspot.com",
    messagingSenderId: "your-messaging-id",
    appId: "your-app-id",
    measurementId: "G-XXXXXXXXXX"
};

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
