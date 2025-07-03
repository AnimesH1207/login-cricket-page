import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDggqhSfTQGYGv2jJyzTwRQVoAZSSdBZS0",
  authDomain: "login-form-ea6e0.firebaseapp.com",
  projectId: "login-form-ea6e0",
  storageBucket: "login-form-ea6e0.firebasestorage.app",
  messagingSenderId: "772071839646",
  appId: "1:772071839646:web:c7277ae81cb7b3b467a88f",
  measurementId: "G-GVQY7PZF97"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


document.getElementById('signInButton').addEventListener('click', () => {
    document.getElementById('signup').style.display = 'none';
    document.getElementById('signIn').style.display = 'block';
});

document.getElementById('signUpButton').addEventListener('click', () => {
    document.getElementById('signIn').style.display = 'none';
    document.getElementById('signup').style.display = 'block';
});


function showMessage(message, divId) {
    const messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.textContent = message;
    messageDiv.style.opacity = 1;
    
    setTimeout(() => {
        messageDiv.style.opacity = 0;
        setTimeout(() => {
            messageDiv.style.display = "none";
        }, 500);
    }, 5000);
}


document.getElementById('submitSignUp').addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const firstName = document.getElementById('fName').value;
    const lastName = document.getElementById('lName').value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const userData = {
                email: email,
                firstName: firstName,
                lastName: lastName
            };
            
            return setDoc(doc(db, "users", user.uid), userData);
        })
        .then(() => {
            showMessage('Account Created Successfully', 'signUpMessage');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === 'auth/email-already-in-use') {
                showMessage('Email Address Already Exists!', 'signUpMessage');
            } else if (errorCode === 'auth/weak-password') {
                showMessage('Password should be at least 6 characters', 'signUpMessage');
            } else {
                showMessage('Unable to create user: ' + error.message, 'signUpMessage');
            }
        });
});


document.getElementById('submitSignIn').addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            showMessage('Login successful!', 'signInMessage');
            const user = userCredential.user;
            localStorage.setItem('loggedInUserId', user.uid);
            setTimeout(() => {
                window.location.href = 'homepage.html';
            }, 1500);
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === 'auth/invalid-credential') {
                showMessage('Incorrect Email or Password', 'signInMessage');
            } else if (errorCode === 'auth/user-not-found') {
                showMessage('Account does not exist', 'signInMessage');
            } else {
                showMessage('Error: ' + error.message, 'signInMessage');
            }
        });
});


document.getElementById('signIn').style.display = 'block';