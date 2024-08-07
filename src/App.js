import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import Pedidos from './Components/Pedidos'; // Asegúrate de crear este componente
import Entregas from "./Components/Entregas";
import Compras from "./Components/Compras";
import PorCobrar from "./Components/PorCobrar";
import Inventario from "./Components/Inventario";
import Estadistica from "./Components/Estadistica";
import Clientes from "./Components/Clientes";
import Proveedores from "./Components/Proveedores";
import PedidoDetalle from './Components/PedidoDetalle';
import PedidoForm from "./Components/PedidoForm";
import Lugares from "./Components/Lugares"
import ClientesForm from './Components/ClientesForm';
import ClienteNuevo from './Components/ClienteNuevo';
import ProveedoresForm from "./Components/ProveedoresForm";
import NuevoProveedor from './Components/NuevoProveedor';
import LugarNuevo from "./Components/LugarNuevo"
import AgregarPago from "./Components/AgregarPago";
import VenderDesdeInventario from './Components/VenderDesdeInventario';

const App = () => {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pedidos" element={<Pedidos />} />
        <Route path="/entregas" element={<Entregas />} />
        <Route path="/compras" element={<Compras />} />
        <Route path="/por-cobrar" element={<PorCobrar />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/estadistica" element={<Estadistica />} />
        <Route path="/proveedores" element={<Proveedores />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/pedido/:id" element={<PedidoDetalle />} />
        <Route path="/nuevo-pedido" element={<PedidoForm />} />
        <Route path="/lugares" element={<Lugares />} />
        <Route path="/cliente/:id" element={<ClientesForm />} />
        <Route path="/nuevo-cliente" element={<ClienteNuevo />} />
        <Route path="/proveedor/:id" element={<ProveedoresForm />} />
        <Route path="/nuevo-proveedor" element={<NuevoProveedor />} />
        <Route path="/nuevo-lugar" element={<LugarNuevo />} />
        <Route path="/agregar-pago/:id" element={<AgregarPago />} />
        <Route path="/vender-desde-inventario/:id" element={<VenderDesdeInventario />} />
        {/* Agrega más rutas para los otros componentes */}
      </Routes>
    </Router>
  );
};

export default App;
