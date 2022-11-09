import React from 'react'
import styled from '@emotion/styled';

export const Formulario = styled.form`
    max-width: 600px;
    width: 95%;
    margin: 5rem auto 0 auto;

    fieldset{
        margin: 2rem 0;
        border: 1px solid #e1e1e1;
        border-radius: 9px;
        font-size: 2rem;
        padding: 2rem;
    }
`;

export const Campo = styled.div`
    margin-bottom: 2rem;
    display: flex;
    align-items: center;

    label{
        flex: 0 0 150px;
        font-size: 1.8rem;        
    }

    input, textarea {
        flex: 1;
        padding: 1rem;
        border-radius: 9px;
        border: 1px solid #e1e1e1;
    }
    textarea{
        height: 200px;
    }
`;

export const InputSubmit = styled.input`
    background-color: var(--naranja);
    width: 100%;
    padding: 1rem;
    text-align: center;
    color: #fff;
    font-size: 1.8rem;
    text-transform: uppercase;
    border-radius: 9px;    
    font-family: 'PT Sans', sans-serif;
    border: none;
    font-weight: 700;

    &:hover{
        cursor: pointer;
        background-color: #91381f;
    }
`;

export const Error = styled.p`
    background-color: red;
    padding: 1rem;
    font-family: 'PT Sans', sans-serif;
    color: white;
    text-transform: uppercase;
    text-align: center;
    font-size: 1.4rem;
    font-weight: 700;
    border-radius: 9px;
    margin: 2rem 0;
`;

