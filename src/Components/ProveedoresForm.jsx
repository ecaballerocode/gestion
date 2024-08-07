// src/Components/ProveedoresForm.jsx
import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useParams, useNavigate } from 'react-router-dom';
import './ProveedoresForm.css'; // Asegúrate de crear este archivo CSS

const ProveedoresForm = () => {
  const { id } = useParams();
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProveedor = async () => {
      const proveedorDoc = doc(db, 'proveedores', id);
      const proveedorSnapshot = await getDoc(proveedorDoc);
      if (proveedorSnapshot.exists()) {
        const proveedorData = proveedorSnapshot.data();
        setNombre(proveedorData.nombre);
        setTelefono(proveedorData.telefono);
      } else {
        console.error('No such document!');
      }
    };

    fetchProveedor();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const proveedorDoc = doc(db, 'proveedores', id);
      await updateDoc(proveedorDoc, { nombre, telefono });
      navigate('/proveedores'); // Redirige a la lista de proveedores
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  return (
    <form className="proveedores-form" onSubmit={handleSubmit}>
      <h2>Editar Proveedor</h2>
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

export default ProveedoresForm;
