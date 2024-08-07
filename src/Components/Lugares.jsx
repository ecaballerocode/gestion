import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import './Lugares.css';

const Lugares = () => {
  const [lugares, setLugares] = useState([]);
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

  return (
    <div>
      <h2>Lugares</h2>
      <ul className="lugares-list">
        {lugares.map(lugar => (
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
