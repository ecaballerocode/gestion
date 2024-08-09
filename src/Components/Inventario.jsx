import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import './Inventario.css'; // Asegúrate de tener el archivo de estilos
import { faHouse} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Inventario = () => {
  const [pedidos, setPedidos] = useState([]);
  const [totalPrecioPublico, setTotalPrecioPublico] = useState(0);
  const [totalCostoProveedor, setTotalCostoProveedor] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPedidos = async () => {
      const pedidosCollection = collection(db, 'pedidos');
      const pedidosSnapshot = await getDocs(pedidosCollection);
      const pedidosList = pedidosSnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(pedido => pedido.cliente === 'Inventario'); // Filtra solo los pedidos con cliente "Inventario"
      setPedidos(pedidosList);
    };

    fetchPedidos();
  }, []);

  useEffect(() => {
    const calculateTotals = () => {
      const totalPrecio = pedidos.reduce((sum, pedido) => {
        const precio = parseFloat(pedido.precioPublico) || 0;
        return sum + precio;
      }, 0);

      const totalCosto = pedidos.reduce((sum, pedido) => {
        const costo = parseFloat(pedido.costoProveedor) || 0;
        return sum + costo;
      }, 0);

      setTotalPrecioPublico(totalPrecio);
      setTotalCostoProveedor(totalCosto);
    };

    if (pedidos.length > 0) {
      calculateTotals();
    }
  }, [pedidos]);

  const handleButtonClick = (id) => {
    navigate(`/vender-desde-inventario/${id}`);
  };

  return (
    <div>
      <div className='header'>
      <button onClick={() => navigate('/')} className="home-button">
          <FontAwesomeIcon icon={faHouse} style={{color: "#fcbf49"}}/>
        </button>
        <h1>Inventario</h1>
      
      </div>
      
      <div className="totales">
        <span>Total: <br /> ${totalPrecioPublico.toFixed(2)}</span>
        <span>Invertido:<br /> ${totalCostoProveedor.toFixed(2)}</span>
      </div>
      <div className="pedidos-list">
        {pedidos.map((pedido) => (
          <button
            key={pedido.id}
            onClick={() => handleButtonClick(pedido.id)}
            className="pedido-button"
          >
            {pedido.prenda} - {pedido.color} - {pedido.talla} - ${parseFloat(pedido.precioPublico).toFixed(2)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Inventario;
