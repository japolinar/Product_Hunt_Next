import React, {useState} from 'react'
import Layout from '../components/layout/Layout';
import Router from 'next/router';
import { css } from '@emotion/react';
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';

import firebase from '../firebase';

//validaciones
import useValidacion from '../hooks/useValidacion';
import validarIniciarSesion from '../validacion/validarIniciarSesion';

const STATE_INICIAL = {
  email: '',
  password: ''
}

const Login = () => {

  const [error, setError] = useState(false);

  const {valores, errores, handleChange, handleSubmit, handleBlur} = useValidacion(STATE_INICIAL, validarIniciarSesion, iniciarSesion);

  const { email, password} = valores;

  async function iniciarSesion() {
    try {
      const usuario = await firebase.login(email, password);
      //console.log(usuario);
      Router.push('/');
    } catch (error) {
      const mensaje = 'Hubo un error al autenticar el usuario'
      console.error('Hubo un error al autenticar el usuario', error.message);
      setError(mensaje +' '+ error.message);
    }
  }

  return (
    <div>
      <Layout>
        <>
          <h1
            css={css`
              text-align: center;
              margin-top: 5rem;
              text-transform: uppercase;
            `}
          >Iniciar Sesion</h1>
          <Formulario onSubmit={handleSubmit} noValidate>     
            <Campo>
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                name="email" 
                id="email" 
                placeholder='Tu Email'
                value={email}
                onChange={handleChange}
                onBlur={handleBlur}
                />
            </Campo>
            {errores.email && <Error>{errores.email}</Error>}            

            <Campo>
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                name="password" 
                id="password" 
                placeholder='Tu Password'
                value={password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Campo>
            {errores.password && <Error>{errores.password}</Error>}
            {error && <Error>{error}</Error>}

            <InputSubmit type="submit" value="Iniciar Sesion" />
          </Formulario>
        </>
      </Layout>
    </div>
  )
}

export default Login
