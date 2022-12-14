import React from 'react';
import Layout from '../components/layout/Layout';
import DetallesProductos from '../components/layout/DetallesProductos';
import useProductos from '../hooks/useProductos';

export default function Home() {

  const {productos} = useProductos('creado');

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
