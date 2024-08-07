import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import './LugarNuevo.css';

const LugarNuevo = () => {
  const [lugar, setNombre] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'lugares'), {
        lugar
      });
      navigate('/lugares');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <form className="lugar-nuevo-form" onSubmit={handleSubmit}>
      <h2>Añadir Nuevo Lugar</h2>
      <label>
        Lugar:
        <input type="text" value={lugar} onChange={(e) => setNombre(e.target.value)} required />
      </label>
      <button type="submit">Guardar</button>
    </form>
  );
};

export default LugarNuevo;
