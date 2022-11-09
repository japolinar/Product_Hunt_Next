import { initializeApp } from "firebase/app";
import {createUserWithEmailAndPassword, getAuth, updateProfile, signInWithEmailAndPassword, signOut} from 'firebase/auth';
import 'firebase/firestore';
import { getFirestore } from 'firebase/firestore'
import { getStorage } from '@firebase/storage';

import firebaseConfig from './config';

class Firebase{
    constructor(){
        const app = initializeApp(firebaseConfig);
        this.auth = getAuth(app);
        this.db = getFirestore(app);
        this.storage = getStorage(app);
    }

    //Registrar un usuario
    async registrar(nombre, email, password){
        const nuevoUsuario = await createUserWithEmailAndPassword(this.auth, email, password);

        //Actualiza el usuario creado, añadiendo el nombre del usuario
        return await updateProfile(nuevoUsuario.user, {
            displayName: nombre
        })
    }

    //Iniciar Sesion
    async login (email, password){
        const iniciarSesion = await signInWithEmailAndPassword(this.auth, email, password);

        //console.log(iniciarSesion);

        return iniciarSesion;        
        
    }


    //Cerrar la secion del usaurio
    async cerrarSesion(){
        const cerrando =  await signOut(this.auth);

        return cerrando;
    }
}

const firebase = new Firebase();

export default firebase;