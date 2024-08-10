import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import './Estadistica.css'; // Asegúrate de tener los estilos necesarios

const Estadisticas = () => {
  const [estadisticas, setEstadisticas] = useState({
    // Estadísticas generales
    mejorClienta: null,
    mejorProveedor: null,
    totalVentas: 0,
    totalCompras: 0,
    totalPorCobrarInventario: 0,
    totalPorCobrar: 0,
    numeroPedidosSemana: 0,
    // Ventas
    promedioVentasDiarias: 0,
    promedioVentasSemanal: 0,
    productoMasVendido: null,
    ticketPromedio: 0,
    clientesRecurrentes: 0,
    clientesNuevos: 0,
    // Compras
    promedioComprasMensuales: 0,
    costoPromedioPorProveedor: 0,
    productosMayorMargen: null,
    // Clientes
    clientesMayorPedidos: null,
    zonasGeograficasMasVentas: null,
    clientesNoHanComprado: 0,
    // Finanzas
    flujoCajaMensual: 0,
    gananciaBruta: 0,
    tasaCobranza: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      // Consultas para obtener los datos necesarios
      const pedidosRef = collection(db, 'pedidos');

      // Total de ventas del mes
      const ventasQuery = query(pedidosRef, where('fecha', '>=', new Date(new Date().getFullYear(), new Date().getMonth(), 1)));
      const ventasSnapshot = await getDocs(ventasQuery);
      let totalVentas = 0;
      let totalCompras = 0;
      let totalPorCobrarInventario = 0;
      let totalPorCobrar = 0;
      let numeroPedidosSemana = 0;
      let productos = {};
      let clientes = {};
      let proveedores = {};
      let clientesNoHanComprado = 0;
      let flujoCajaMensual = 0;

      // Recolectar datos de pedidos
      ventasSnapshot.forEach(doc => {
        const data = doc.data();
        totalVentas += data.total || 0;
        totalCompras += data.costoProveedor || 0;
        
       
        

        if (data.cliente === "Inventario") {
          totalPorCobrarInventario += data.total || 0;
        }

        // Contar productos vendidos
        if (productos[data.prenda]) {
          productos[data.prenda] += data.total || 0;
        } else {
          productos[data.prenda] = data.total || 0;
        }

        // Contar clientes
        if (clientes[data.cliente]) {
          clientes[data.cliente] += 1;
        } else {
          clientes[data.cliente] = 1;
        }

        // Contar proveedores
        if (proveedores[data.proveedor]) {
          proveedores[data.proveedor] += data.costoProveedor || 0;
        } else {
          proveedores[data.proveedor] = data.costoProveedor || 0;
        }

        // Clientes que no han comprado en el último mes
        // (Este es solo un ejemplo, necesitarías comparar con la lista de clientes)
        clientesNoHanComprado += 1;

        // Flujo de caja
        flujoCajaMensual += data.total - data.costoProveedor;
      });

      

      // Promedio de ventas diarias/semanales
      const diasDelMes = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
      const promedioVentasDiarias = (totalVentas / diasDelMes).toFixed(2);
      const promedioVentasSemanal = (totalVentas / 4).toFixed(2);

      // Producto más vendido del mes
      const productoMasVendido = Object.keys(productos).reduce((a, b) => productos[a] > productos[b] ? a : b);

      // Ticket promedio
      const ticketPromedio = (totalVentas / ventasSnapshot.size).toFixed(2);

      // Clientes recurrentes vs nuevos
      const clientesRecurrentes = Object.values(clientes).filter(c => c > 1).length;
      const clientesNuevos = Object.values(clientes).filter(c => c === 1).length;

      // Promedio de compras mensuales
      const promedioComprasMensuales = (totalCompras / (new Date().getMonth() + 1)).toFixed(2);

      // Costo promedio por proveedor
      const costoPromedioPorProveedor = (Object.values(proveedores).reduce((a, b) => a + b, 0) / Object.keys(proveedores).length).toFixed(2);

      // Productos con mayor margen de ganancia
      // Este cálculo dependerá de tu estructura de datos, aquí es un ejemplo
      const productosMayorMargen = Object.keys(productos).map(p => ({
        producto: p,
        margen: productos[p] - (productos[p] * 0.2) // Suponiendo un margen del 20%
      })).sort((a, b) => b.margen - a.margen);

      // Clientes con mayor número de pedidos
      const clientesMayorPedidos = Object.entries(clientes).sort((a, b) => b[1] - a[1]).slice(0, 5);

      // Zonas geográficas con más ventas
      // Este cálculo dependerá de tu estructura de datos, aquí es un ejemplo
      const zonasGeograficasMasVentas = {}; // Implementar lógica según datos

      // Tasa de cobranza
      const tasaCobranza = (totalVentas - totalPorCobrar) / totalVentas;

      setEstadisticas({
        mejorClienta: null,
        mejorProveedor: null,
        totalVentas,
        totalCompras,
        totalPorCobrarInventario,
        totalPorCobrar,
        numeroPedidosSemana,
        promedioVentasDiarias,
        promedioVentasSemanal,
        productoMasVendido,
        ticketPromedio,
        clientesRecurrentes,
        clientesNuevos,
        promedioComprasMensuales,
        costoPromedioPorProveedor,
        productosMayorMargen,
        clientesMayorPedidos,
        zonasGeograficasMasVentas,
        clientesNoHanComprado,
        flujoCajaMensual,
        gananciaBruta: totalVentas - totalCompras,
        tasaCobranza
      });
    };

    fetchData();
  }, []);

  return (
    <div className="estadisticas">
      <h2>Estadísticas</h2>
      
      <div className="estadisticas-categoria">
        <h3>Pedidos</h3>
        <div className="estadistica-item">
          <strong>Total Ventas del Mes:</strong> ${estadisticas.totalVentas.toFixed(2)}
        </div>
        <div className="estadistica-item">
          <strong>Total Compras del Mes:</strong> ${estadisticas.totalCompras.toFixed(2)}
        </div>
        <div className="estadistica-item">
          <strong>Total por Cobrar en Inventario:</strong> ${estadisticas.totalPorCobrarInventario.toFixed(2)}
        </div>
        <div className="estadistica-item">
          <strong>Total por Cobrar:</strong> ${estadisticas.totalPorCobrar.toFixed(2)}
        </div>
        <div className="estadistica-item">
          <strong>Número de Pedidos de la Semana:</strong> {estadisticas.numeroPedidosSemana}
        </div>
        <div className="estadistica-item">
          <strong>Clientes que no han Comprado en el Último Mes:</strong> {estadisticas.clientesNoHanComprado}
        </div>
      </div>

      <div className="estadisticas-categoria">
        <h3>Ventas</h3>
        <div className="estadistica-item">
          <strong>Promedio de Ventas Diarias:</strong> ${estadisticas.promedioVentasDiarias}
        </div>
        <div className="estadistica-item">
          <strong>Promedio de Ventas Semanal:</strong> ${estadisticas.promedioVentasSemanal}
        </div>
        <div className="estadistica-item">
          <strong>Producto Más Vendido del Mes:</strong> {estadisticas.productoMasVendido || 'N/A'}
        </div>
        <div className="estadistica-item">
          <strong>Ticket Promedio:</strong> ${estadisticas.ticketPromedio}
        </div>
        <div className="estadistica-item">
          <strong>Clientes Recurrentes:</strong> {estadisticas.clientesRecurrentes}
        </div>
        <div className="estadistica-item">
          <strong>Clientes Nuevos:</strong> {estadisticas.clientesNuevos}
        </div>
      </div>

      <div className="estadisticas-categoria">
        <h3>Compras</h3>
        <div className="estadistica-item">
          <strong>Promedio de Compras Mensuales:</strong> ${estadisticas.promedioComprasMensuales}
        </div>
        <div className="estadistica-item">
          <strong>Costo Promedio por Proveedor:</strong> ${estadisticas.costoPromedioPorProveedor}
        </div>
        <div className="estadistica-item">
          <strong>Productos con Mayor Margen de Ganancia:</strong>
          <ul>
            {estadisticas.productosMayorMargen && estadisticas.productosMayorMargen.map(p => (
              <li key={p.producto}>{p.producto} - ${p.margen.toFixed(2)}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="estadisticas-categoria">
        <h3>Clientes</h3>
        <div className="estadistica-item">
          <strong>Clientes con Mayor Número de Pedidos:</strong>
          <ul>
            {estadisticas.clientesMayorPedidos && estadisticas.clientesMayorPedidos.map(c => (
              <li key={c[0]}>{c[0]} - {c[1]} pedidos</li>
            ))}
          </ul>
        </div>
        <div className="estadistica-item">
          <strong>Zonas Geográficas con Más Ventas:</strong>
          {/* Implementa la visualización de zonas geográficas aquí */}
        </div>
      </div>

      <div className="estadisticas-categoria">
        <h3>Finanzas</h3>
        <div className="estadistica-item">
          <strong>Flujo de Caja Mensual:</strong> ${estadisticas.flujoCajaMensual.toFixed(2)}
        </div>
        <div className="estadistica-item">
          <strong>Ganancia Bruta:</strong> ${estadisticas.gananciaBruta.toFixed(2)}
        </div>
        <div className="estadistica-item">
          <strong>Tasa de Cobranza:</strong> {(estadisticas.tasaCobranza * 100).toFixed(2)}%
        </div>
      </div>
    </div>
  );
};

export default Estadisticas;
