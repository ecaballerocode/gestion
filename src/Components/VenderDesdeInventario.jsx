import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useParams, useNavigate } from 'react-router-dom';
import './PedidoDetalle.css';

const PedidoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pedido, setPedido] = useState({
    fecha: '',
    cliente: '',
    prenda: '',
    talla: '',
    color: '',
    proveedor: '',
    costoProveedor: 0,
    precioPublico: 0,
    descuento: 0,
    total: 0,
    ganancia: 0,
    anticipo: 0,
    pago: 0,
    porCobrar: 0,
    lugar: '',
    entregado: false,
    comprado: false,
  });

  const [proveedores, setProveedores] = useState([]);
  const [lugares, setLugares] = useState([]);
  const [clientes, setClientes] = useState([]);

  const formatDateForInput = (date) => {
    const d = new Date(date);
    const pad = (n) => n < 10 ? '0' + n : n;
    const yyyy = d.getFullYear();
    const MM = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const mm = pad(d.getMinutes());
    return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
  };

  useEffect(() => {
    const fetchPedido = async () => {
      const pedidoDoc = doc(db, 'pedidos', id);
      const pedidoSnapshot = await getDoc(pedidoDoc);
      if (pedidoSnapshot.exists()) {
        const pedidoData = pedidoSnapshot.data();
        let fecha;
        if (pedidoData.fecha instanceof Date) {
          fecha = pedidoData.fecha;
        } else if (pedidoData.fecha && typeof pedidoData.fecha.toDate === 'function') {
          fecha = pedidoData.fecha.toDate();
        } else {
          fecha = new Date(pedidoData.fecha);
        }
        setPedido({
          ...pedidoData,
          fecha: formatDateForInput(fecha),
        });
      } else {
        console.error('No such document!');
      }
    };

    const fetchProveedores = async () => {
      const proveedoresCollection = collection(db, 'proveedores');
      const proveedoresSnapshot = await getDocs(proveedoresCollection);
      const proveedoresList = proveedoresSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProveedores(proveedoresList);
    };

    const fetchLugares = async () => {
      const lugaresCollection = collection(db, 'lugares');
      const lugaresSnapshot = await getDocs(lugaresCollection);
      const lugaresList = lugaresSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLugares(lugaresList);
    };

    const fetchClientes = async () => {
        const clientesCollection = collection(db, 'clientes');
        const clientesSnapshot = await getDocs(clientesCollection);
        const clientesList = clientesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setClientes(clientesList); // Cambia de setLugares a setClientes
      };
      

    fetchPedido();
    fetchProveedores();
    fetchLugares();
    fetchClientes();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPedido((prevPedido) => {
      const updatedPedido = { ...prevPedido, [name]: value };
      if (name === 'precioPublico' || name === 'descuento' || name === 'costoProveedor' || name === 'anticipo' || name === 'pago') {
        const total = updatedPedido.precioPublico - (updatedPedido.precioPublico * (updatedPedido.descuento / 100));
        const ganancia = total - updatedPedido.costoProveedor;
        const porCobrar = total - updatedPedido.anticipo - updatedPedido.pago;
        return { ...updatedPedido, total, ganancia, porCobrar };
      }
      return updatedPedido;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const pedidoDoc = doc(db, 'pedidos', id);
      await updateDoc(pedidoDoc, pedido);
      navigate('/pedidos');
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  return (
    <form className="pedido-form" onSubmit={handleSubmit}>
      <h2>Vender desde inventario</h2>
      <label>
        Fecha:
        <input
          type="datetime-local"
          name="fecha"
          value={pedido.fecha}
          onChange={handleInputChange}
          required
        />
      </label>
      <label>
        Cliente:
        <select
          name="cliente"
          value={pedido.cliente}
          onChange={handleInputChange}
          required
        >
          <option value="">Seleccionar</option>
          {clientes.map((clientes) => (
            <option key={clientes.id} value={clientes.nombre}>{clientes.nombre}</option>
          ))}
        </select>
      </label>
      <label>
        Prenda:
        <input
          type="text"
          name="prenda"
          value={pedido.prenda}
          onChange={handleInputChange}
          required
        />
      </label>
      <label>
        Talla:
        <input
          type="text"
          name="talla"
          value={pedido.talla}
          onChange={handleInputChange}
          required
        />
      </label>
      <label>
        Color:
        <input
          type="text"
          name="color"
          value={pedido.color}
          onChange={handleInputChange}
          required
        />
      </label>
      <label>
        Proveedor:
        <select
          name="proveedor"
          value={pedido.proveedor}
          onChange={handleInputChange}
          required
        >
          <option value="">Seleccionar</option>
          {proveedores.map((prov) => (
            <option key={prov.id} value={prov.nombre}>{prov.nombre}</option>
          ))}
        </select>
      </label>
      <label>
        Costo Proveedor:
        <input
          type="number"
          name="costoProveedor"
          value={pedido.costoProveedor}
          onChange={handleInputChange}
          required
        />
      </label>
      <label>
        Precio Público:
        <input
          type="number"
          name="precioPublico"
          value={pedido.precioPublico}
          onChange={handleInputChange}
          required
        />
      </label>
      <label>
        Descuento (%):
        <input
          type="number"
          name="descuento"
          value={pedido.descuento}
          onChange={handleInputChange}
          required
        />
      </label>
      <label>
        Total:
        <input
          type="number"
          name="total"
          value={pedido.total}
          readOnly
        />
      </label>
      <label>
        Ganancia:
        <input
          type="number"
          name="ganancia"
          value={pedido.ganancia}
          readOnly
        />
      </label>
      <label>
        Anticipo:
        <input
          type="number"
          name="anticipo"
          value={pedido.anticipo}
          onChange={handleInputChange}
          required
        />
      </label>
      <label>
        Pago:
        <input
          type="number"
          name="pago"
          value={pedido.pago}
          onChange={handleInputChange}
          required
        />
      </label>
      <label>
        Por Cobrar:
        <input
          type="number"
          name="porCobrar"
          value={pedido.porCobrar}
          readOnly
        />
      </label>
      <label>
        Lugar:
        <select
          name="lugar"
          value={pedido.lugar}
          onChange={handleInputChange}
          required
        >
          <option value="">Seleccionar</option>
          {lugares.map((lug) => (
            <option key={lug.id} value={lug.lugar}>{lug.lugar}</option>
          ))}
        </select>
      </label>
      <label>
        Entregado:
        <input
          type="checkbox"
          name="entregado"
          checked={pedido.entregado}
          onChange={(e) => setPedido({ ...pedido, entregado: e.target.checked })}
        />
      </label>
      <label>
        Comprado:
        <input
          type="checkbox"
          name="comprado"
          checked={pedido.comprado}
          onChange={(e) => setPedido({ ...pedido, comprado: e.target.checked })}
        />
      </label>
      <button type="submit">Guardar cambios</button>
    </form>
  );
};

export default PedidoDetalle;
