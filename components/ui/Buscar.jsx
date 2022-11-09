import React, {useState} from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/react'
import  Router from 'next/router'


const InputText = styled.input`
  border: 1px solid var(--gris3);
  padding: 10px;
  border-radius: 7px;
`

const ButtonSubmit = styled.button`
  height: 3rem;
  width: 3rem;
  display: block;
  background-size: 4rem;
  background-image: url('/static/img/buscar.png');
  background-repeat: no-repeat;
  position: absolute;
  right: 1rem; 
  top: 1px;
  background-color: white;
  border: none;
  text-indent: -9999px;

  &:hover{
    cursor: pointer;
  }
`

const Buscar = () => {
  //los state
  const [busqueda, setBusqueda] = useState('');

  const buscarProducto = (e)=>{
    e.preventDefault();
    //console.log('buscando...', busqueda);

    if(busqueda.trim() === '') return;

    //Redireccionar a /buscar
    Router.push({
      pathname: '/buscar',
      query: {q: busqueda}
    })
  }

  return (
    <form
      css={css`
        position: relative;
      `}
      onSubmit={buscarProducto}
    >
      <InputText 
        type="text" 
        onChange={e => setBusqueda(e.target.value)} 
        id="" 
        placeholder='Buscar Producto' 
      />

      <ButtonSubmit type='submit'>Buscar</ButtonSubmit>
    </form>
  )
}
export default Buscar
