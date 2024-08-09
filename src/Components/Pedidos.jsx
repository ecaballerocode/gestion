import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config'; // Asegúrate de que la ruta sea correcta
import { Link, useNavigate } from 'react-router-dom';
import '../Components/Pedidos.css'; // Asegúrate de crear este archivo CSS
import { faMagnifyingGlass, faHouse} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);
  const navigate = useNavigate();

  // Función para convertir la fecha a un objeto Date
  const parseDate = (date) => {
    if (typeof date === 'object' && date !== null && date.toDate) {
      return date.toDate();
    } else if (typeof date === 'string') {
      const dateParts = date.match(/(\d+) de (\w+) de (\d+), (\d+):(\d+):(\d+) ([ap]\.m\.) UTC([+-]\d+)/);
      const months = {
        enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
        julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11
      };

      if (!dateParts) {
        console.log('Formato de fecha no coincide:', date);
        return new Date(0);
      }

      const day = parseInt(dateParts[1], 10);
      const month = months[dateParts[2]];
      const year = parseInt(dateParts[3], 10);
      let hour = parseInt(dateParts[4], 10);
      const minute = parseInt(dateParts[5], 10);
      const second = parseInt(dateParts[6], 10);
      const period = dateParts[7];
      const timezone = parseInt(dateParts[8], 10);

      if (period === 'p.m.' && hour !== 12) {
        hour += 12;
      } else if (period === 'a.m.' && hour === 12) {
        hour = 0;
      }

      const dateObj = new Date(Date.UTC(year, month, day, hour + timezone, minute, second));
      return dateObj;
    } else {
      console.log('Fecha inválida:', date);
      return new Date(0);
    }
  };

  useEffect(() => {
    const fetchPedidos = async () => {
      const pedidosCollection = collection(db, 'pedidos');
      const pedidosSnapshot = await getDocs(pedidosCollection);
      let pedidosList = pedidosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      pedidosList = pedidosList.sort((a, b) => parseDate(b.fecha) - parseDate(a.fecha));

      setPedidos(pedidosList);
    };

    fetchPedidos();
  }, []);

  const filteredPedidos = pedidos.filter(pedido =>
    pedido.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pedido.prenda.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pedido.color.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className='header'>
      <button onClick={() => navigate('/')} className="home-button">
          <FontAwesomeIcon icon={faHouse} style={{color: "#fcbf49"}}/>
        </button>
        <h2>Pedidos</h2>
      <div className="search-container">
        <button onClick={() => setSearchVisible(!searchVisible)} className="search-button">
          <i className="fa-search"><FontAwesomeIcon icon={faMagnifyingGlass} style={{color: "#fcbf49"}}/></i>
        </button>
        
        {searchVisible && (
          <input
            type="text"
            placeholder="Buscar pedidos..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="search-input"
          />
        )}
      </div>
      </div>
      
      
      <div className="pedidos-list">
        {filteredPedidos.map(pedido => (
          <Link to={`/pedido/${pedido.id}`} key={pedido.id} className="pedido-button">
            <div className="pedido-info">
              <div className="pedido-details">
                <p><strong>{pedido.cliente}</strong></p>
                <p>{pedido.prenda}</p>
                <p>{pedido.color}</p>
              </div>
              <p className="pedido-price"><strong>$ {pedido.total}</strong></p>
            </div>
          </Link>
        ))}
      </div>
      <button className="nuevo-pedido-button" onClick={() => navigate('/nuevo-pedido')}>
        Crear Pedido
      </button>
    </div>
  );
};

export default Pedidos;
