import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  signOut 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "DEIN_VOLLSTÄNDIGER_API_KEY",
  authDomain: "schul-planer-58aee.firebaseapp.com",
  projectId: "schul-planer-58aee",
  storageBucket: "schul-planer-58aee.firebasestorage.app",
  messagingSenderId: "901687969527",
  appId: "1:901687969527:web:b653f73718a72e774eb5f2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById("registerBtn").addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, pass)
    .catch(error => alert(error.message));
});

document.getElementById("loginBtn").addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, pass)
    .catch(error => alert(error.message));
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  signOut(auth);
});

onAuthStateChanged(auth, user => {
  if (user) {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("appContent").style.display = "block";
  } else {
    document.getElementById("loginBox").style.display = "block";
    document.getElementById("appContent").style.display = "none";
  }
});
