import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config'; 
import { Link, useNavigate } from 'react-router-dom';
import '../Components/Clientes.css';
import { faHouse, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false); // Estado para mostrar u ocultar la barra de búsqueda
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

  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className='header'>
        <button onClick={() => navigate('/')} className="home-button">
          <FontAwesomeIcon icon={faHouse} style={{ color: "#fcbf49" }} />
        </button>
        <h2>Clientes</h2>
        <button className="search-button" onClick={() => setShowSearch(!showSearch)}>
          <FontAwesomeIcon icon={faSearch} style={{ color: "#fcbf49" }} />
        </button>
        {showSearch && (
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        )}
      </div>

      <div className="clientes-list">
        {filteredClientes.map(cliente => (
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
