import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config'; // Asegúrate de que la ruta sea correcta
import { Link, useNavigate } from 'react-router-dom';
import '../Components/Pedidos.css'; // Asegúrate de crear este archivo CSS

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPedidos = async () => {
      const pedidosCollection = collection(db, 'pedidos');
      const pedidosSnapshot = await getDocs(pedidosCollection);
      const pedidosList = pedidosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPedidos(pedidosList);
    };

    fetchPedidos();
  }, []);

  return (
    <div>
      <h2>Pedidos</h2>
      <div className="pedidos-list">
        {pedidos.map(pedido => (
          <Link to={`/pedido/${pedido.id}`} key={pedido.id} className="pedido-button">
            <div className="pedido-info">
              <div className="pedido-details">
                <p><strong>{pedido.cliente}</strong> </p>
                <p> {pedido.prenda}</p>
                <p> {pedido.color}</p>
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

