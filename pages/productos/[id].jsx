import React, {useEffect, useState, useContext} from 'react'
import { useRouter } from 'next/router'
import { FirebaseContext } from '../../firebase';
import {collection, getDoc, doc, updateDoc, increment, deleteDoc } from 'firebase/firestore'
import Layout from '../../components/layout/Layout';
import PaginaError_404 from '../../components/layout/PaginaError_404';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { es } from 'date-fns/locale';
import {Campo, InputSubmit} from '../../components/ui/Formulario';
import Boton from '../../components/ui/Boton';

//sweetalert2
import Swal from 'sweetalert2';

const ContenedorProducto = styled.div`
  border: 1px solid #e1e1e1;
  border-radius: 7px;
  box-shadow: 7px 7px 5px #666565;
  padding: 2rem;

  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 2rem;
  }
`; 

const CreadorProducto = styled.p`
  padding: .5rem 2rem;
  background-color: #da552f;
  color: white;
  text-transform: uppercase;
  font-weight: bold;
  display: inline-block;
  text-align: center;
  border-radius: 7px;
`;

const Producto = () => {
  //State del componente
  const [producto, setProducto] = useState({});    
  const [error, setError] = useState(false);
  const [comentario, setComentario] = useState({});
  const [consultarDB, setConsultarDB] = useState(true);

  //Rounting para obtener el ID actual
  const router = useRouter();
  //console.log(router.query.id);
  const {query: {id}} = router;

  //Context de Firebase
  const {firebase, usuario} = useContext(FirebaseContext);

  useEffect(() => {
    if(id  && consultarDB){
      const obtenerProducto = async ()=>{
        const productoQuery = await doc(collection(firebase.db, 'productos'), id);             
        const productoID = await  getDoc(productoQuery);
        //console.log(productoID.data());  
        if(productoID.exists){
          setProducto(productoID.data());
          setConsultarDB(false);
        }else{
          setError(true);
          setConsultarDB(false);
        }
      }
      obtenerProducto();
    }
  }, [id]);

  if(Object.keys(producto).length === 0  && !error){
    return 'Cagando....';
  }

  const {nombre, comentarios, creado, descripcion, empresa, imagen, url, votos, creador, haVotado} = producto;

  //Administrar y validar los votos
  const votarProducto = async ()=>{
    if(!usuario){
      return router.push('/login')
    }

    //obtener y sumar un nuevo voto
    const nuevoTotal = votos + 1;

    //Verificar si el usuario a votado
    if (haVotado.includes(usuario.uid)) {
      return;
    }  

    //guardar el ID del usuario que ha votado
    const nuevoHanVotado = [...haVotado, usuario.uid];

    //Actualizar la BD

    const productoQuery = await doc(collection(firebase.db, 'productos'), id);
  
    updateDoc(productoQuery, {
      votos: increment(nuevoTotal), 
      haVotado: nuevoHanVotado
    });

    //Actualizar el state
    setProducto({
      ...producto,
      votos: nuevoTotal
    })

    setConsultarDB(true); // si hay un voto va a consultar la BD
  }   

  //Funciones para crear comentarios
  const comentarioOnChange = (e)=>{   
    setComentario({
      ...comentario,
      [e.target.name]: e.target.value
    })
  }

  //Identificar si el comentario es del creador del producto
  const esCreador = (id) =>{
    if(creador.id ==  id){
      return true;
    }
  } 

  const agregarComentario = async (e)=>{
    e.preventDefault()

    if(!usuario){
      return router.push('/login')
    }

    //Informacion extra al comentario
    comentario.usuarioID = usuario.uid;
    comentario.usuarioNombre = usuario.displayName;

    //Tomar copia de comentarios y agregarlos al arreglo
    const nuevoComentarios = [...comentarios, comentario]

    //actualizar la DB
    const productoQuery = await doc(collection(firebase.db, 'productos'), id);
  
    updateDoc(productoQuery, {
      comentarios: nuevoComentarios       
    });

    //Actualizar el state
    setProducto({
      ...producto,
      comentarios: nuevoComentarios
    })

    setConsultarDB(true); // si hay un comentario va a consultar la BD
  }

  //funcion que revisa que el reador del producto sea el mismo que sesta autenticado
  const puedeBorrar = ()=>{
    if(!usuario){
      return false;
    }

    if(creador.id === usuario.uid){
      return true;
    }
  }

  //Eliminar un producto de la BD
  const EliminarProducto = ()=>{

    if(!usuario){
      return router.push('/login')
    }

    if(creador.id !== usuario.uid){
      return router.push('/');
    }

    try {      
      Swal.fire({
        title: 'Estas Seguro?',
        text: "Deseas Eliminar el Producto?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Eliminar!'
      }).then((result) => {
        if (result.isConfirmed) {
          //actualizar la DB
          const productoQuery =  doc(collection(firebase.db, 'productos'), id);          
        
          deleteDoc(productoQuery, {
            id: id       
          });

          Swal.fire(
            'Eliminado!',
            'Su registro ha sido eliminado.',
            'success'
          )

          //Redireciona a la pagina principal
          router.push('/');
        }
      })      

    } catch (error) {
      console.log(error);
    }
  }


  return (
    <Layout>
      <>        
        {error ? <PaginaError_404/> : (
          <div className='contenedor'>

            <h1
              css={css`
                text-align: center;
              `}
            >
              {nombre}
            </h1>

            <ContenedorProducto>
              <div>
                <p>Publicado hace: {formatDistanceToNow( new Date(creado), {locale: es} )}</p>
                <p>Por: {creador.nombre} de {empresa}</p>
                <img 
                  src={imagen} 
                  css={css`
                    width: 150px;
                  `} 
                />
                <p>{descripcion}</p>

                {usuario && (
                  <>
                    <h2>Agrega tu Comentario</h2>
                    <form onSubmit={agregarComentario}>
                      <Campo>
                        <input 
                          type="text" 
                          name='mensaje'
                          onChange={comentarioOnChange}
                          />
                      </Campo>

                      <InputSubmit
                        type={'submit'}
                        value={'Agregar Camentario'}                                            
                      />              
                    </form>
                  </>
                )}

                <h2 
                css={css`
                  margin: 3rem 0;
                `}   
                >
                Comentarios</h2>
                
                {comentarios.length === 0 ? 'Aun no hay comentarios' : (
                  <ul>
                    {comentarios.map(comentario =>(
                      <li 
                        key={id}
                        css={css`
                          border: 1px solid #e1e1e1;
                          padding: 1.5rem;
                          border-radius: 9px;
                          box-shadow: 7px 7px 5px #666565; 
                        `}
                      >
                          <p>{comentario.mensaje}</p>
                          <p>
                            Escrito por: {' '}  
                            <span css={css`font-weight: bold;`}>
                              {comentario.usuarioNombre}
                            </span>
                          </p>
                          {esCreador(comentario.usuarioID) && <CreadorProducto>Es Creador</CreadorProducto> }
                      </li>
                    ))}
                  </ul>
                )}

              </div>

              <aside>
                <Boton
                  target={'_blank'}
                  bgColor={true}
                  href={url}
                >Visitar URL</Boton>              

                <div
                  css={css`
                    margin-top: 5rem;
                  `}
                >
                  <p
                    css={css`
                      text-align: center;
                    `}
                  >{votos} Votos</p>
                  {usuario && (
                    <Boton
                      onClick={votarProducto}
                    >Votar</Boton>
                  )}
                </div>
              </aside>
            </ContenedorProducto>

            {puedeBorrar() &&
              <Boton
                bgColor={true}
                onClick={EliminarProducto}
              >Eliminar Producto</Boton>
            }

          </div>
        )} 

        
      </>         
    </Layout>
  )
}

export default Producto
