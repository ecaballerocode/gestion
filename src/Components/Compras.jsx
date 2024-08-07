import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import './Compras.css';

const Compras = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    const pedidosCollection = collection(db, 'pedidos');
    const pedidosSnapshot = await getDocs(pedidosCollection);
    const pedidosList = pedidosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Filtrar solo pedidos no comprados
    const pedidosNoComprados = pedidosList.filter(pedido => !pedido.comprado);

    // Agrupar pedidos por proveedor y calcular la suma de costoProveedor
    const groupedByProveedor = pedidosNoComprados.reduce((acc, pedido) => {
      if (!acc[pedido.proveedor]) {
        acc[pedido.proveedor] = {
          pedidos: [],
          totalCostoProveedor: 0,
        };
      }
      acc[pedido.proveedor].pedidos.push(pedido);
      acc[pedido.proveedor].totalCostoProveedor += pedido.costoProveedor;
      return acc;
    }, {});

    setPedidos(groupedByProveedor);
  };

  const handleComprado = async (id) => {
    try {
      const pedidoDoc = doc(db, 'pedidos', id);
      await updateDoc(pedidoDoc, { comprado: true });
      fetchPedidos(); // Vuelve a cargar los pedidos después de actualizar
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  const handleCancelado = async (id) => {
    try {
      const pedidoDoc = doc(db, 'pedidos', id);
      await deleteDoc(pedidoDoc);
      fetchPedidos(); // Vuelve a cargar los pedidos después de eliminar
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

  return (
    <div>
      <h2>Compras Pendientes</h2>
      {Object.keys(pedidos).map(proveedor => (
        <div key={proveedor} className="compras-group">
          <div className="proveedor-separator">
            <h3>{proveedor}</h3>
            <span>Total: ${pedidos[proveedor].totalCostoProveedor.toFixed(2)}</span>
          </div>
          <ul className="compras-list">
            {pedidos[proveedor].pedidos.map(pedido => (
              <li key={pedido.id} className="compra-item">
                <div className="compra-details">
                  <div className="compra-row">
                    <p>{pedido.prenda}</p>
                    <p>{pedido.talla}</p>
                    <p>{pedido.color}</p>
                  </div>
                  <div className="compra-row">
                    <p><strong>${pedido.costoProveedor.toFixed(2)}</strong></p>
                    <div className="compra-actions">
                      <button
                        className="comprado-button"
                        onClick={() => handleComprado(pedido.id)}
                      >
                        Comprado
                      </button>
                      <button
                        className="cancel-button"
                        onClick={() => handleCancelado(pedido.id)}
                      >
                        Cancelado
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Compras;
