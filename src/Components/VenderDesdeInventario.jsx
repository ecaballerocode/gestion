import React, { useState, useEffect } from 'react';
import { doc, getDoc, collection, getDocs, updateDoc } from 'firebase/firestore'; // Asegúrate de que getDocs esté importado
import { db } from '../firebase/config';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import './PedidoForm.css';

const VenderDesdeInventario = () => {
  const { id } = useParams(); // Obtén el ID del pedido desde los parámetros de la URL
  const [fecha, setFecha] = useState('');
  const [cliente, setCliente] = useState(null);
  const [prenda, setPrenda] = useState('');
  const [talla, setTalla] = useState('');
  const [color, setColor] = useState('');
  const [proveedor, setProveedor] = useState(null);
  const [costoProveedor, setCostoProveedor] = useState('');
  const [precioPublico, setPrecioPublico] = useState('');
  const [descuento, setDescuento] = useState('');
  const [total, setTotal] = useState(0);
  const [ganancia, setGanancia] = useState(0);
  const [anticipo, setAnticipo] = useState('');
  const [pago, setPago] = useState('');
  const [porCobrar, setPorCobrar] = useState(0);
  const [lugar, setLugar] = useState(null);
  const [entregado, setEntregado] = useState(false);
  const [comprado, setComprado] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [lugares, setLugares] = useState([]);
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
    const fetchPedido = async () => {
      const pedidoDoc = await getDoc(doc(db, 'pedidos', id));
      if (pedidoDoc.exists()) {
        const pedidoData = pedidoDoc.data();

        setFecha(new Date(pedidoData.fecha.seconds * 1000).toISOString().slice(0, 16));
        setCliente({
          value: pedidoData.cliente,
          label: clientes.find((c) => c.id === pedidoData.cliente)?.nombre || 'Seleccionar Cliente'
        });
        setPrenda(pedidoData.prenda);
        setTalla(pedidoData.talla);
        setColor(pedidoData.color);
        setProveedor({
          value: pedidoData.proveedor,
          label: proveedores.find((p) => p.id === pedidoData.proveedor)?.nombre || 'Seleccionar Proveedor'
        });
        setCostoProveedor(pedidoData.costoProveedor);
        setPrecioPublico(pedidoData.precioPublico);
        setDescuento(pedidoData.descuento);
        setTotal(pedidoData.total);
        setGanancia(pedidoData.ganancia);
        setAnticipo(pedidoData.anticipo);
        setPago(pedidoData.pago);
        setPorCobrar(pedidoData.porCobrar);
        setLugar({
          value: pedidoData.lugar,
          label: lugares.find((l) => l.id === pedidoData.lugar)?.lugar || 'Seleccionar Lugar'
        });
        setEntregado(pedidoData.entregado);
        setComprado(pedidoData.comprado);
      }
    };

    fetchPedido();
  }, [id, clientes, proveedores, lugares]);

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
      await updateDoc(doc(db, 'pedidos', id), {
        fecha: new Date(fecha),
        cliente: cliente ? cliente.value : '',
        prenda,
        talla,
        color,
        proveedor: proveedor ? proveedor.value : '',
        costoProveedor: parseFloat(costoProveedor),
        precioPublico: parseFloat(precioPublico),
        descuento: parseFloat(descuento),
        total: parseFloat(total),
        ganancia: parseFloat(ganancia),
        anticipo: parseFloat(anticipo),
        pago: parseFloat(pago),
        porCobrar: parseFloat(porCobrar),
        lugar: lugar ? lugar.value : '',
        entregado,
        comprado
      });
      navigate('/inventario');
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  const clienteOptions = clientes.map(cliente => ({
    value: cliente.id,
    label: cliente.nombre
  }));

  const proveedorOptions = proveedores.map(proveedor => ({
    value: proveedor.id,
    label: proveedor.nombre
  }));

  const lugarOptions = lugares.map(lugar => ({
    value: lugar.id,
    label: lugar.lugar
  }));

  return (
    <form className="pedido-form" onSubmit={handleSubmit}>
      <h2>Vender Pedido desde Inventario</h2>

      <label>
        Fecha:
        <input type="datetime-local" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
      </label>

      <label>
        Cliente:
        <Select
          value={cliente}
          onChange={setCliente}
          options={clienteOptions}
          placeholder="Selecciona un cliente"
          isClearable
        />
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
        <Select
          value={proveedor}
          onChange={setProveedor}
          options={proveedorOptions}
          placeholder="Selecciona un proveedor"
          isClearable
        />
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
        <Select
          value={lugar}
          onChange={setLugar}
          options={lugarOptions}
          placeholder="Selecciona un lugar"
          isClearable
        />
      </label>

      <label>
        Entregado:
        <input type="checkbox" checked={entregado} onChange={(e) => setEntregado(e.target.checked)} />
      </label>

      <label>
        Comprado:
        <input type="checkbox" checked={comprado} onChange={(e) => setComprado(e.target.checked)} />
      </label>

      <button type="submit">Guardar cambios</button>
    </form>
  );
};

export default VenderDesdeInventario;
