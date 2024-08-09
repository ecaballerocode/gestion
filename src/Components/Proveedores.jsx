import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Link, useNavigate } from 'react-router-dom';
import '../Components/Proveedores.css'; // Asegúrate de crear este archivo CSS
import { faHouse, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false); // Estado para mostrar u ocultar la barra de búsqueda
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

  const filteredProveedores = proveedores.filter(proveedor =>
    proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className='header'>
        <button onClick={() => navigate('/')} className="home-button">
          <FontAwesomeIcon icon={faHouse} style={{ color: "#fcbf49" }} />
        </button>
        <h2>Proveedores</h2>
        <button className="search-button" onClick={() => setShowSearch(!showSearch)}>
          <FontAwesomeIcon icon={faSearch} style={{ color: "#fcbf49" }} />
        </button>
        {showSearch && (
          <input
            type="text"
            placeholder="Buscar proveedor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        )}
      </div>

      <div className="proveedores-list">
        {filteredProveedores.map(proveedor => (
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
