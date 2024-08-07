// src/Components/ClientesForm.jsx
import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config'; // Asegúrate de que la ruta sea correcta
import { useParams, useNavigate } from 'react-router-dom';
import './ClientesForm.css'; // Asegúrate de crear este archivo CSS

const ClientesForm = () => {
  const { id } = useParams(); // Obtiene el ID del cliente desde la URL
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCliente = async () => {
      const clienteDoc = doc(db, 'clientes', id);
      const clienteSnapshot = await getDoc(clienteDoc);
      if (clienteSnapshot.exists()) {
        const clienteData = clienteSnapshot.data();
        setNombre(clienteData.nombre);
        setTelefono(clienteData.telefono);
      } else {
        console.error('No such document!');
      }
    };

    fetchCliente();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const clienteDoc = doc(db, 'clientes', id);
      await updateDoc(clienteDoc, { nombre, telefono });
      navigate('/clientes'); // Redirige a la lista de clientes
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  return (
    <form className="clientes-form" onSubmit={handleSubmit}>
      <h2>Editar Cliente</h2>
      <label>
        Nombre:
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </label>
      <label>
        Teléfono:
        <input
          type="text"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          required
        />
      </label>
      <button type="submit">Guardar cambios</button>
    </form>
  );
};

export default ClientesForm;
