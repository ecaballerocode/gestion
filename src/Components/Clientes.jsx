// Clientes.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config'; 
import { Link, useNavigate } from 'react-router-dom';
import '../Components/Clientes.css'; 

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientes = async () => {
      const clientesCollection = collection(db, 'clientes');
      const clientesSnapshot = await getDocs(clientesCollection);
      const clientesList = clientesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setClientes(clientesList);
    };

    fetchClientes();
  }, []);

  return (
    <div>
      <h2>Clientes</h2>
      <div className="clientes-list">
        {clientes.map(cliente => (
          <Link to={`/cliente/${cliente.id}`} key={cliente.id} className="cliente-button">
            <div className="cliente-info">
              <p><strong>{cliente.nombre}</strong></p>
              <p>{cliente.telefono}</p>
            </div>
          </Link>
        ))}
      </div>
      <button className="nuevo-pedido-button" onClick={() => navigate('/nuevo-cliente')}>
        Añadir Cliente
      </button>
    </div>
  );
};

export default Clientes;
