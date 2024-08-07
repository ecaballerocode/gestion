import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config'; // Asegúrate de que la ruta sea correcta
import { useNavigate } from 'react-router-dom';
import './PedidoForm.css';

const PedidoForm = () => {
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 16));
  const [cliente, setCliente] = useState('');
  const [prenda, setPrenda] = useState('');
  const [talla, setTalla] = useState('');
  const [color, setColor] = useState('');
  const [proveedor, setProveedor] = useState('');
  const [costoProveedor, setCostoProveedor] = useState('');
  const [precioPublico, setPrecioPublico] = useState('');
  const [descuento, setDescuento] = useState('');
  const [total, setTotal] = useState(0);
  const [ganancia, setGanancia] = useState(0);
  const [anticipo, setAnticipo] = useState('');
  const [pago, setPago] = useState('');
  const [porCobrar, setPorCobrar] = useState(0);
  const [lugar, setLugar] = useState('');
  const [entregado, setEntregado] = useState(false);
  const [comprado, setComprado] = useState(false);
  const [clientes, setClientes] = useState([]); // Estado para almacenar clientes
  const [proveedores, setProveedores] = useState([]); // Estado para almacenar proveedores
  const [lugares, setLugares] = useState([]); // Estado para almacenar lugares
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientes = async () => {
      const clientesSnapshot = await getDocs(collection(db, 'clientes'));
      const clientesList = clientesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setClientes(clientesList);
    };

    const fetchProveedores = async () => {
      const proveedoresSnapshot = await getDocs(collection(db, 'proveedores'));
      const proveedoresList = proveedoresSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProveedores(proveedoresList);
    };

    const fetchLugares = async () => {
      const lugaresSnapshot = await getDocs(collection(db, 'lugares'));
      const lugaresList = lugaresSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLugares(lugaresList);
    };

    fetchClientes();
    fetchProveedores();
    fetchLugares();
  }, []);

  useEffect(() => {
    const precio = parseFloat(precioPublico) || 0;
    const desc = parseFloat(descuento) || 0;
    const costo = parseFloat(costoProveedor) || 0;
    const anticipoValue = parseFloat(anticipo) || 0;
    const pagoValue = parseFloat(pago) || 0;

    const calculatedTotal = (precio * (1 - desc / 100)).toFixed(2);
    setTotal(calculatedTotal);

    const calculatedGanancia = (calculatedTotal - costo).toFixed(2);
    setGanancia(calculatedGanancia);

    const calculatedPorCobrar = (calculatedTotal - anticipoValue - pagoValue).toFixed(2);
    setPorCobrar(calculatedPorCobrar);
    
  }, [precioPublico, descuento, costoProveedor, anticipo, pago]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'pedidos'), {
        fecha: new Date(fecha),
        cliente,
        prenda,
        talla,
        color,
        proveedor,
        costoProveedor: parseFloat(costoProveedor),
        precioPublico: parseFloat(precioPublico),
        descuento: parseFloat(descuento),
        total: parseFloat(total),
        ganancia: parseFloat(ganancia),
        anticipo: parseFloat(anticipo),
        pago: parseFloat(pago),
        porCobrar: parseFloat(porCobrar),
        lugar,
        entregado,
        comprado
      });
      navigate('/pedidos');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <form className="pedido-form" onSubmit={handleSubmit}>
      <h2>Crear Nuevo Pedido</h2>

      <label>
        Fecha:
        <input type="datetime-local" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
      </label>

      <label>
        Cliente:
        <select value={cliente} onChange={(e) => setCliente(e.target.value)} required>
          <option value="">Selecciona un cliente</option>
          {clientes.map(cliente => (
            <option key={cliente.id} value={cliente.cliente}>{cliente.nombre}</option>
          ))}
        </select>
      </label>

      <label>
        Prenda:
        <input type="text" value={prenda} onChange={(e) => setPrenda(e.target.value)} required />
      </label>

      <label>
        Talla:
        <input type="text" value={talla} onChange={(e) => setTalla(e.target.value)} required />
      </label>

      <label>
        Color:
        <input type="text" value={color} onChange={(e) => setColor(e.target.value)} required />
      </label>

      <label>
        Proveedor:
        <select value={proveedor} onChange={(e) => setProveedor(e.target.value)} required>
          <option value="">Selecciona un proveedor</option>
          {proveedores.map(proveedor => (
            <option key={proveedor.id} value={proveedor.proveedor}>{proveedor.nombre}</option>
          ))}
        </select>
      </label>

      <label>
        Costo Proveedor:
        <input type="number" value={costoProveedor} onChange={(e) => setCostoProveedor(e.target.value)} required />
      </label>

      <label>
        Precio Público:
        <input type="number" value={precioPublico} onChange={(e) => setPrecioPublico(e.target.value)} required />
      </label>

      <label>
        Descuento (%):
        <input type="number" value={descuento} onChange={(e) => setDescuento(e.target.value)} required />
      </label>

      <label>
        Total:
        <input type="number" value={total} readOnly />
      </label>

      <label>
        Ganancia:
        <input type="number" value={ganancia} readOnly />
      </label>

      <label>
        Anticipo:
        <input type="number" value={anticipo} onChange={(e) => setAnticipo(e.target.value)} required />
      </label>

      <label>
        Pago:
        <input type="number" value={pago} onChange={(e) => setPago(e.target.value)} />
      </label>

      <label>
        Por Cobrar:
        <input type="number" value={porCobrar} readOnly />
      </label>

      <label>
        Lugar:
        <select value={lugar} onChange={(e) => setLugar(e.target.value)} required>
          <option value="">Selecciona un lugar</option>
          {lugares.map(lugar => (
            <option key={lugar.id} value={lugar.lugar}>{lugar.lugar}</option>
          ))}
        </select>
      </label>

      <label>
        Entregado:
        <input type="checkbox" checked={entregado} onChange={(e) => setEntregado(e.target.checked)} />
      </label>

      <label>
        Comprado:
        <input type="checkbox" checked={comprado} onChange={(e) => setComprado(e.target.checked)} />
      </label>

      <button type="submit">Crear Pedido</button>
    </form>
  );
};

export default PedidoForm;
