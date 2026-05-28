import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDVHbF036suuptLJ5mkmXhNESyYFHRDVOo",
  authDomain: "horta-viva-7ec9f.firebaseapp.com",
  projectId: "horta-viva-7ec9f",
  storageBucket: "horta-viva-7ec9f.firebasestorage.app",
  messagingSenderId: "984315405237",
  appId: "1:984315405237:web:acf5894069c24931452ffc"
};

// Aqui nós inicializamos o Firebase
const app = initializeApp(firebaseConfig);

// Aqui nós preparamos a Autenticação (Login/Senha)
export const auth = getAuth(app);

// Aqui nós preparamos o Banco de Dados (Firestore)
export const db = getFirestore(app);