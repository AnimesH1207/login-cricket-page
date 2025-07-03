import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { 
  getFirestore, 
  setDoc, 
  doc 
} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";


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


document.getElementById('submitSignUp').addEventListener('click', async (event) => {
  event.preventDefault();
  
  const email = document.getElementById('rEmail').value.trim();
  const password = document.getElementById('rPassword').value.trim();
  const firstName = document.getElementById('fName').value.trim();
  const lastName = document.getElementById('lName').value.trim();

 
  if (!firstName || !lastName || !email || !password) {
    return showMessage('Please fill in all fields', 'signUpMessage');
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    const userData = {
      email: email,
      firstName: firstName,
      lastName: lastName
    };
    
    await setDoc(doc(db, "users", user.uid), userData);
    
    showMessage('Account Created Successfully', 'signUpMessage');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      showMessage('Email Address Already Exists!', 'signUpMessage');
    } else if (error.code === 'auth/weak-password') {
      showMessage('Password should be at least 6 characters', 'signUpMessage');
    } else {
      showMessage('Unable to create user: ' + error.message, 'signUpMessage');
    }
  }
});


document.getElementById('submitSignIn').addEventListener('click', async (event) => {
  event.preventDefault();
  
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    showMessage('Login successful!', 'signInMessage');
    
    const user = userCredential.user;
    localStorage.setItem('loggedInUserId', user.uid);
    
    setTimeout(() => {
      window.location.href = 'Cricket_page.html';
    }, 500);
  } catch (error) {
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
      showMessage('Incorrect Email or Password', 'signInMessage');
    } else if (error.code === 'auth/user-not-found') {
      showMessage('Account does not exist', 'signInMessage');
    } else {
      showMessage('Error: ' + error.message, 'signInMessage');
    }
  }
});


document.getElementById('login-form').style.display = 'block';
document.getElementById('signup-form').style.display = 'none';