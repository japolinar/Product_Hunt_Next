import React from 'react';
import Layout from '../components/layout/Layout';
import DetallesProductos from '../components/layout/DetallesProductos';
import useProductos from '../hooks/useProductos';

const Populares = () => {
  
  const {productos} = useProductos('votos');

  return (
    <div>
      <Layout>
        <div className='listado-productos'>
          <div className='contenedor'>
            <ul className='bg-white'>
              {productos.map(producto =>(
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

export default Populares
