import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import './Entregas.css';

const Entregas = () => {
  const [pedidos, setPedidos] = useState({});

  useEffect(() => {
    const fetchPedidos = async () => {
      const pedidosCollection = collection(db, 'pedidos');
      const pedidosSnapshot = await getDocs(pedidosCollection);
      const pedidosList = pedidosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Filtrar los pedidos que no están en Inventario y no están entregados
      const filteredPedidos = pedidosList.filter(pedido => pedido.lugar !== 'Inventario' && !pedido.entregado);

      // Agrupar pedidos por lugar
      const groupedByLugar = filteredPedidos.reduce((acc, pedido) => {
        const lugar = pedido.lugar;
        if (!acc[lugar]) {
          acc[lugar] = [];
        }
        acc[lugar].push(pedido);
        return acc;
      }, {});

      setPedidos(groupedByLugar);
    };

    fetchPedidos();
  }, []);

  const handleEntregado = async (id) => {
    const pedidoDoc = doc(db, 'pedidos', id);
    await updateDoc(pedidoDoc, { entregado: true });
    // Vuelve a cargar los pedidos
    const pedidosCollection = collection(db, 'pedidos');
    const pedidosSnapshot = await getDocs(pedidosCollection);
    const pedidosList = pedidosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const filteredPedidos = pedidosList.filter(pedido => pedido.lugar !== 'Inventario' && !pedido.entregado);
    const groupedByLugar = filteredPedidos.reduce((acc, pedido) => {
      const lugar = pedido.lugar;
      if (!acc[lugar]) {
        acc[lugar] = [];
      }
      acc[lugar].push(pedido);
      return acc;
    }, {});
    setPedidos(groupedByLugar);
  };

  return (
    <div>
      <h2>Entregas</h2>
      {Object.keys(pedidos).map(lugar => (
        <div key={lugar} className="entregas-group">
          <div className="lugar-separator">
            <span>{lugar}</span>
        
          </div>
          <div className="entregas-list">
            {pedidos[lugar].map(pedido => (
              <div key={pedido.id} className="entrega-item">
                <div className="entrega-details">
                  <div className="entrega-row">
                    <span><strong>{pedido.cliente}</strong></span>
                    <span>{pedido.prenda}</span>
                    <span>{pedido.color}</span>
                  </div>
                  <div className="entrega-row-left">
                    <span>${Number(pedido.total).toFixed(2)}</span>
                    <span>- ${Number(pedido.anticipo).toFixed(2)}</span>
                    <span><strong>= ${Number(pedido.porCobrar).toFixed(2)}</strong></span>
                  </div>
                </div>
                <div className="compra-actions">
                  <button className="action-button" onClick={() => handleEntregado(pedido.id)}>Entregado</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Entregas;

