import React, {useState, useContext} from 'react'
import Layout from '../components/layout/Layout';
import Router, {useRouter} from 'next/router';
import { css } from '@emotion/react';
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';
import { collection , addDoc } from 'firebase/firestore';

import { ref, getDownloadURL, uploadBytesResumable } from '@firebase/storage';
import {FirebaseContext} from '../firebase';
import PaginaError_404 from '../components/layout/PaginaError_404';

//validaciones
import useValidacion from '../hooks/useValidacion';
import validarCrearProducto from '../validacion/validarCrearProducto';

//sweetalert2
import Swal from 'sweetalert2';

const STATE_INICIAL = {
  nombre: '',
  empresa: '',
  imagen: '',
  url: '',
  descripcion: ''
}


const NuevoProducto = () => {

  const [error, setError] = useState(false);

  const {valores, errores, handleChange, handleSubmit, handleBlur} = useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);

  const { nombre, empresa, imagen, url, descripcion} = valores;

  // hook de routing para redireccionear
  const router = useRouter();

  //context con las operaciones CRUD de firebase
  const {usuario, firebase} = useContext(FirebaseContext);  
  //console.log(usuario);

  async function crearProducto() {
    if(!usuario){
      return router.push('/');
    }

    //crearel objeto de nuevo producto
    const producto = {
      nombre,
      empresa,
      url,
      imagen: URLImage,
      descripcion,
      votos: 0,
      comentarios: [],
      creado: Date.now(),
      creador: {
        id: usuario.uid,
        nombre: usuario.displayName
      },
      haVotado: []
    }

    //insertar en la base de datos
    try {
      await addDoc(collection(firebase.db,"productos"), producto);
      
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `Nuevo Producto '${producto.nombre}' Creado`,
        showConfirmButton: false,
        timer: 2500
      })

    } catch (error) {
        console.error(error)
    }

    return router.push('/');      
   
  }

  // States para la subida de la imagen
  const [uploading, setUploading] = useState(false);
  const [URLImage, setURLImage] = useState('');

  const handleImageUpload = e => {
    // Se obtiene referencia de la ubicación donde se guardará la imagen
    const file = e.target.files[0];
    const imageRef = ref(firebase.storage, 'productos/' + file.name);
    console.log(file.name);

    // Se inicia la subida
    setUploading(true);
    const uploadTask = uploadBytesResumable(imageRef, file);

    // Registra eventos para cuando detecte un cambio en el estado de la subida
    uploadTask.on('state_changed', 
      // Muestra progreso de la subida
      snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Subiendo imagen: ${progress}% terminado`);
      },
      // En caso de error
      error => {
        setUploading(false);
        console.error(error);
      },
      // Subida finalizada correctamente
      () => {
        setUploading(false);
        getDownloadURL(uploadTask.snapshot.ref).then(url => {
            console.log('Imagen disponible en:', url);
            setURLImage(url);
        });
      }
    );
  }; 

  return (
    <div>
      <Layout>
        {!usuario ? <PaginaError_404/> : (
          <>
            <h1
              css={css`
                text-align: center;
                margin-top: 5rem;
                text-transform: uppercase;
              `}
            >Nuevo Producto</h1>
            <Formulario onSubmit={handleSubmit} noValidate>

              <fieldset>
                <legend>Informacion General</legend>
              
                <Campo>
                  <label htmlFor="nombre">Nombre</label>
                  <input 
                    type="text" 
                    name="nombre" 
                    id="nombre" 
                    placeholder='Nombre del Producto'
                    value={nombre}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>
                {errores.nombre && <Error>{errores.nombre}</Error>}

                <Campo>
                  <label htmlFor="empresa">Empresa</label>
                  <input 
                    type="text" 
                    name="empresa" 
                    id="empresa" 
                    placeholder='Nombre de la Empresa'
                    value={empresa}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    />
                </Campo>
                {errores.empresa && <Error>{errores.empresa}</Error>}            

                <Campo>
                  <label htmlFor="imagen">Imagen</label>
                  <input 
                    accept="image/*"
                    type="file" 
                    name="imagen" 
                    id="imagen"  
                    value={imagen}  
                    onChange={handleImageUpload}      
                  />
                </Campo>                  

                <Campo>
                  <label htmlFor="url">URL</label>
                  <input 
                    type="url" 
                    name="url" 
                    id="url"     
                    placeholder='URL de tu Producto'            
                    value={url}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>
                {errores.url && <Error>{errores.url}</Error>}

              </fieldset>

              <fieldset>
                <legend>Sobre tus Productos</legend>

                <Campo>
                  <label htmlFor="descripcion">Descripcion</label>
                  <textarea   
                    name="descripcion" 
                    id="descripcion"                 
                    value={descripcion}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Campo>
                {errores.descripcion && <Error>{errores.descripcion}</Error>}

              </fieldset>


              {error && <Error>{error}</Error>}

              <InputSubmit type="submit" value="Crear Producto" />
            </Formulario>
          </>
        )}
        
      </Layout>
    </div>
  )
}

export default NuevoProducto