// ClienteNuevo.jsx
import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config'; 
import { useNavigate } from 'react-router-dom';
import "./ClienteNuevo.css";

const ClienteNuevo = () => {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'clientes'), {
        nombre,
        telefono
      });
      navigate('/clientes');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <form className="cliente-nuevo-form" onSubmit={handleSubmit}>
      <h2>Añadir Nuevo Cliente</h2>

      <label>
        Nombre:
        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      </label>

      <label>
        Teléfono:
        <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
      </label>

      <button type="submit">Guardar</button>
    </form>
  );
};

export default ClienteNuevo;
