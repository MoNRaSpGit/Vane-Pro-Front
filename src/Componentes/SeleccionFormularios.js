import React, { useState } from "react";
import "../Css/seleccionFormularios.css";
import { FaUserCircle } from "react-icons/fa";
import logo from "../imagenes/logoVane.png";

const SeleccionFormularios = ({ onSeleccionarFormulario, usuario, onCerrarSesion }) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const formularios = [
        { id: "control", titulo: "Control Operacional", descripcion: "Formulario para control de operaciones." },
        { id: "botiquin", titulo: "Botiquín", descripcion: "Formulario para gestión de botiquines." },
        { id: "accidente", titulo: "Accidente", descripcion: "Reporte de accidentes laborales." },
        { id: "formulariontp", titulo: "NTP330", descripcion: "Formulario de evaluación NTP330." },
    ];

    const obtenerSaludo = () => {
        const hora = new Date().getHours();
        if (hora < 12) return "¡Buenos días!";
        if (hora < 18) return "¡Buenas tardes!";
        return "¡Buenas noches!";
    };

    return (
        <div className="formulario-seleccion-container">
            <div className="formulario-bienvenida">
                <h1 className="formulario-bienvenida-titulo">
                    {obtenerSaludo()} {usuario.nombre}, ¿cómo estás hoy?
                </h1>
                <p className="formulario-bienvenida-subtitulo">
                    Selecciona el formulario en el que deseas trabajar.
                </p>
                <img
                    src={logo}
                    alt="Logo Vane"
                    className="formulario-logo"
                    onClick={toggleDropdown}
                />
                {dropdownVisible && (
                    <div className="dropdown-menu">
                        <div className="dropdown-header">
                            <FaUserCircle size={30} />
                            <span>{usuario.nombre}</span>
                        </div>
                        <div
                            className="dropdown-item"
                            onClick={onCerrarSesion}
                        >
                            Cerrar sesión
                        </div>
                    </div>
                )}
            </div>

            <div className="formulario-seleccion-grid">
                {formularios.map((form) => (
                    <div
                        key={form.id}
                        className="formulario-seleccion-card"
                        onClick={() => onSeleccionarFormulario(form.id)}
                    >
                        <h3 className="formulario-seleccion-card-titulo">{form.titulo}</h3>
                        <p className="formulario-seleccion-card-descripcion">{form.descripcion}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SeleccionFormularios;
