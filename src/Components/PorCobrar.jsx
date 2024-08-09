import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Link } from 'react-router-dom';
import './PorCobrar.css';
import { useNavigate } from 'react-router-dom';
import { faHouse} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const PorCobrar = () => {
  const [pedidos, setPedidos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    const pedidosCollection = collection(db, 'pedidos');
    const pedidosSnapshot = await getDocs(pedidosCollection);
    const pedidosList = pedidosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Filtrar solo pedidos con porCobrar > 0 y cliente diferente de "Inventario"
    const pedidosPorCobrar = pedidosList.filter(
      pedido => pedido.porCobrar > 0 && pedido.cliente !== "Inventario"
    );

    // Agrupar pedidos por cliente y calcular la suma de porCobrar
    const groupedByCliente = pedidosPorCobrar.reduce((acc, pedido) => {
      if (!acc[pedido.cliente]) {
        acc[pedido.cliente] = {
          pedidos: [],
          totalPorCobrar: 0,
        };
      }
      acc[pedido.cliente].pedidos.push(pedido);
      acc[pedido.cliente].totalPorCobrar += pedido.porCobrar;
      return acc;
    }, {});

    setPedidos(groupedByCliente);
  };

  return (
    <div>
      <div className='header'>
      <button onClick={() => navigate('/')} className="home-button">
          <FontAwesomeIcon icon={faHouse} style={{color: "#fcbf49"}}/>
        </button>
        <h2>Por Cobrar</h2>
      
      </div>
      
      {Object.keys(pedidos).map(cliente => (
        <div key={cliente} className="porcobrar-group">
          <div className="cliente-separator">
            <h3>{cliente}</h3>
            <span>Total por Cobrar: ${pedidos[cliente].totalPorCobrar.toFixed(2)}</span>
          </div>
          <ul className="porcobrar-list">
            {pedidos[cliente].pedidos.map(pedido => (
              <li key={pedido.id} className="porcobrar-item">
                <Link to={`/agregar-pago/${pedido.id}`} className="pedido-butt">
                  <div className="pedido-cont">
                    <div className="pedido-row">
                      <p>{pedido.prenda}</p>
                      <p>{pedido.talla}</p>
                      <p>{pedido.color}</p>
                    </div>
                    <div className="pedido-row">
                      <p>${Number(pedido.total).toFixed(2)}</p>
                      <p>Pagado     ${Number(pedido.anticipo + pedido.pago).toFixed(2)}</p>
                      <p><strong>= ${Number(pedido.porCobrar).toFixed(2)}</strong></p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PorCobrar;
