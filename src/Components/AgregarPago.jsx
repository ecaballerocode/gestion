import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import './AgregarPago.css';

const AgregarPago = () => {
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);
  const [pago, setPago] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPedido = useCallback(async () => {
    try {
      const pedidoDoc = doc(db, 'pedidos', id);
      const pedidoSnapshot = await getDoc(pedidoDoc);

      if (pedidoSnapshot.exists()) {
        setPedido({ id: pedidoSnapshot.id, ...pedidoSnapshot.data() });
      } else {
        setError('No se encontró el documento.');
      }
    } catch (err) {
      setError('Error al obtener el documento: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPedido();
  }, [fetchPedido]);

  const handlePagoChange = (e) => {
    setPago(e.target.value);
  };

  const handleAgregarPago = async () => {
    if (isNaN(pago) || pago <= 0) {
      alert('Por favor, introduce un monto válido.');
      return;
    }

    const pagoActual = Number(pedido.pago) + Number(pago);
    const porCobrarActual = Number(pedido.porCobrar) - Number(pago);

    try {
      const pedidoDoc = doc(db, 'pedidos', id);
      await updateDoc(pedidoDoc, {
        pago: pagoActual,
        porCobrar: porCobrarActual,
      });

      alert('Pago agregado exitosamente');
      fetchPedido(); // Actualizar datos del pedido después del pago
      setPago(''); // Resetear el campo de pago
    } catch (error) {
      console.error('Error actualizando el documento: ', error);
    }
  };

  if (loading) {
    return <div className="loader">Cargando...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!pedido) {
    return <div>No se encontró el pedido.</div>;
  }

  return (
    <div className="agregar-pago-container">
      <h2>Agregar Pago a {pedido.cliente}</h2>
      <div className="pedido-detalles">
        <p><strong>Prenda:</strong> {pedido.prenda}</p>
        <p><strong>Color:</strong> {pedido.color}</p>
        <p><strong>Talla:</strong> {pedido.talla}</p>
      </div>
      <div className="form-group">
        <label htmlFor="pago">Cantidad a pagar:</label>
        <input
          type="number"
          id="pago"
          value={pago}
          onChange={handlePagoChange}
        />
      </div>
      <button className="btn-guardar" onClick={handleAgregarPago}>Guardar Pago</button>
    </div>
  );
};

export default AgregarPago;
