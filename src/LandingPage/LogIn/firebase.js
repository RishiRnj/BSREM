import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {  

  apiKey: "AIzaSyBekecaWpPQTixtjbxg8_by14rYrlEq_KI",
  authDomain: "bsrem-5c78b.firebaseapp.com" || "http://localhost:3000/",
  projectId: "bsrem-5c78b",
  storageBucket: "bsrem-5c78b.firebasestorage.app",
  messagingSenderId: "849848260275",
  appId: "1:849848260275:web:c293f815ee2ff98c6c42c6",
  measurementId: "G-G185N6FZPQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.useDeviceLanguage();

export { auth, RecaptchaVerifier, signInWithPhoneNumber };
