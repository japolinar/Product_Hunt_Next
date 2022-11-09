import React, {useEffect, useState} from 'react'
import Layout from '../components/layout/Layout';
import { useRouter } from 'next/router';

import DetallesProductos from '../components/layout/DetallesProductos';
import useProductos from '../hooks/useProductos';

const Buscar = () => {
  const router = useRouter();
  const {query: {q}} = router
  //console.log(q);

  //Todos los productos
  const {productos} = useProductos('creado');

  //State
  const [resultado, setResultado] = useState([]);

  useEffect(() => {
    const busqueda = q.toLowerCase();
    
    const filtro = productos.filter((producto) =>{
      return(
        producto.nombre.toLowerCase().includes(busqueda) ||
        producto.descripcion.toLowerCase().includes(busqueda) ||
        producto.empresa.toLowerCase().includes(busqueda) ||
        producto.creador.nombre.toLowerCase().includes(busqueda)
      )
    })

    //console.log(filtro);
    setResultado(filtro)

  }, [q, productos]);




  return (
    <div>
      <Layout>
        <div className='listado-productos'>
          <div className='contenedor'>
            <ul className='bg-white'>
              {resultado.map(producto =>(
                <DetallesProductos
                  producto={producto}
                  key={producto.id}
                />
              ))}
            </ul>
          </div>
        </div>
      </Layout>
    </div>
  )
}

export default Buscar
