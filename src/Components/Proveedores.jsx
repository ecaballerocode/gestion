// src/Components/Proveedores.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Link, useNavigate } from 'react-router-dom';
import '../Components/Proveedores.css'; // Asegúrate de crear este archivo CSS

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProveedores = async () => {
      const proveedoresCollection = collection(db, 'proveedores');
      const proveedoresSnapshot = await getDocs(proveedoresCollection);
      const proveedoresList = proveedoresSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProveedores(proveedoresList);
    };

    fetchProveedores();
  }, []);

  return (
    <div>
      <h2>Proveedores</h2>
      <div className="proveedores-list">
        {proveedores.map(proveedor => (
          <Link to={`/proveedor/${proveedor.id}`} key={proveedor.id} className="proveedor-button">
            <div className="proveedor-info">
              <p><strong>{proveedor.nombre}</strong></p>
              <p>{proveedor.telefono}</p>
            </div>
          </Link>
        ))}
      </div>
      <button className="nuevo-proveedor-button" onClick={() => navigate('/nuevo-proveedor')}>
        Añadir Proveedor
      </button>
    </div>
  );
};

export default Proveedores;
