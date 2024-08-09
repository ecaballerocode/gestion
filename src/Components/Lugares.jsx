import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import './Lugares.css';
import { faHouse, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Lugares = () => {
  const [lugares, setLugares] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false); // Estado para mostrar u ocultar la barra de búsqueda
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLugares = async () => {
      const lugaresCollection = collection(db, 'lugares');
      const lugaresSnapshot = await getDocs(lugaresCollection);
      const lugaresList = lugaresSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLugares(lugaresList);
    };

    fetchLugares();
  }, []);

  const filteredLugares = lugares.filter(lugar =>
    lugar.lugar.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className='header'>
        <button onClick={() => navigate('/')} className="home-button">
          <FontAwesomeIcon icon={faHouse} style={{ color: "#fcbf49" }} />
        </button>
        <h2>Lugares</h2>
        <button className="search-button" onClick={() => setShowSearch(!showSearch)}>
          <FontAwesomeIcon icon={faSearch} style={{ color: "#fcbf49" }} />
        </button>
        {showSearch && (
          <input
            type="text"
            placeholder="Buscar lugar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        )}
      </div>

      <ul className="lugares-list">
        {filteredLugares.map(lugar => (
          <li key={lugar.id} className="lugar-item">
            {lugar.lugar}
          </li>
        ))}
      </ul>
      <button className="nuevo-lugar-button" onClick={() => navigate('/nuevo-lugar')}>
        Añadir Lugar
      </button>
    </div>
  );
};

export default Lugares;
