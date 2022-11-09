import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../firebase';
import {collection, getDocs, orderBy} from 'firebase/firestore'

const useProductos = (orden) => {

    const [productos, setProductos] = useState([]);

  const { firebase} = useContext(FirebaseContext);

  useEffect(() => {
    const obtenerProductos = async ()=>{
      const consultaDB = await getDocs(collection(firebase.db, 'productos'), orderBy(orden, 'asc')); 
      const productos = consultaDB.docs.map(doc =>{
        return {
          id: doc.id,
          ...doc.data()
        }
      });
      //console.log(productos);
      setProductos(productos);
    }

    obtenerProductos();
  }, []);  
  return {
    productos
  }
}

export default useProductos
