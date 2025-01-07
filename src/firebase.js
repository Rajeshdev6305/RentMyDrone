import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBOhBBVPB-PpP2jyW8zeMtRahCrx24vQHk",
    authDomain: "drone-delivery-service-c060b.firebaseapp.com",
    projectId: "drone-delivery-service-c060b",
    storageBucket: "drone-delivery-service-c060b.firebasestorage.app",
    messagingSenderId: "499252828872",
    appId: "1:499252828872:web:4b40842df44e055b3f23fd",
    measurementId: "G-WQGXMDCB1L"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
