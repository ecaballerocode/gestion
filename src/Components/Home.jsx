import React from 'react';
import { Link } from 'react-router-dom'; // Importa Link
import '../Components/Home.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList, faTruck, faShoppingCart, faWallet, faBoxes, faChartBar, faPerson, faShop, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import logoMalimBlanco from "../malimLogoBlanco.png";

const Home = () => {
  return (
    <div className="home-container">
      <img src={logoMalimBlanco} alt="logo" className='logo' />
      <p>Elige que acción quieres realizar</p>
      <div className="button-container">
        <Link to="/pedidos" className='text-button'>
          <button>
            <FontAwesomeIcon icon={faClipboardList} style={{color: "#FFD43B",}}/>
            <span>Pedidos</span>
          </button>
        </Link>
        <Link to="/entregas" className='text-button'>
          <button>
            <FontAwesomeIcon icon={faTruck} style={{color: "#98FF98",}}/>
            <span>Entregas</span>
          </button>
        </Link>
        <Link to="/compras" className='text-button'>
          <button>
            <FontAwesomeIcon icon={faShoppingCart} style={{color: "#4134ef",}}/>
            <span>Compras</span>
          </button>
        </Link>
        <Link to="/por-cobrar" className='text-button'>
          <button>
            <FontAwesomeIcon icon={faWallet} style={{color: "#FF6F61",}}/>
            <span>Por cobrar</span>
          </button>
        </Link>
        <Link to="/inventario" className='text-button'>
          <button>
            <FontAwesomeIcon icon={faBoxes} style={{color: "#eb34ef",}}/>
            <span>Inventario</span>
          </button>
        </Link>
        <Link to="/estadistica" className='text-button'>
          <button>
            <FontAwesomeIcon icon={faChartBar} style={{color: "#34e2ef",}}/>
            <span>Estadística</span>
          </button>
        </Link>
        {/* Repite para los otros botones */}
      </div>
      <footer className="footer">
        <p>Bases de datos</p>
        <div className="footer-menu">
            <Link to="/clientes" className="text-button">
                <button>
                <FontAwesomeIcon icon={faPerson} style={{color:"#1B3A4B",}}/>
                <span className='span-button'>Clientes</span>
                </button>
            </Link>
            <Link to="/proveedores" className="text-button">
                <button>
                <FontAwesomeIcon icon={faShop} style={{color:"#1B3A4B",}}/>
                <span className='span-button'>Proveedores</span>
                </button>
            </Link>
            <Link to="/lugares" className="text-button">
                <button>
                <FontAwesomeIcon icon={faLocationDot} style={{color:"#1B3A4B",}}/>
                <span className='span-button'>Lugares</span>
                </button>
            </Link>
        </div>
        </footer> 
    </div>
  );
};

export default Home;
