import React, { useState, useEffect } from 'react';
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RowAccidente from '../Estructura/rowAccidentes';
import '../Css/accidente.css';
import logo from '../imagenes/logoVane.png';
import { useSelector } from 'react-redux';


const FormularioAccidente = ({ onVolver }) => {
    const [empresa, setEmpresa] = useState('');
    const [horaActual, setHoraActual] = useState('');
    const [rut, setRut] = useState('');
    const [observaciones, setObservaciones] = useState(''); // Estado para Observaciones
    const empresas = useSelector((state) => state.empresas.empresas);


    useEffect(() => {
        const ahora = new Date();
        const opcionesHora = { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Montevideo' };
        const horaUruguay = ahora.toLocaleTimeString('es-ES', opcionesHora).slice(0, 5);
        setHoraActual(horaUruguay);

        const fechaHoy = ahora.toISOString().split('T')[0];
        document.getElementById('fecha-accidente').value = fechaHoy;
        document.getElementById('fecha-investigacion').value = fechaHoy;
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fecha_accidente = document.getElementById('fecha-accidente').value;
        const hora = document.getElementById('hora').value;
        const fecha_investigacion = document.getElementById('fecha-investigacion').value;
        const obra = document.getElementById('obra').value;

        if (!empresa || !obra || !fecha_accidente || !hora || !rut) {
            toast.error('Empresa, obra, fecha_accidente, hora y RUT son obligatorios.', {
                position: "top-right",
                transition: Slide,
                autoClose: 5000,
            });
            return;
        }

        const formData = {};
        RowAccidente.forEach(row => {
            if (row.id && !['fecha-accidente', 'hora', 'fecha-investigacion', 'obra', 'rut', 'observaciones'].includes(row.id)) {
                const input = document.getElementById(row.id);
                formData[row.id] = input ? input.value.trim() : '';
            } else if (row.group) {
                row.group.forEach(field => {
                    if (!['fecha-accidente', 'hora', 'fecha-investigacion', 'obra', 'rut', 'observaciones'].includes(field.id)) {
                        const input = document.getElementById(field.id);
                        formData[field.id] = input ? input.value.trim() : '';
                    }
                });
            }
        });

        const items = [];
        for (const key in formData) {
            items.push({ nombre_campo: key, valor: formData[key] });
        }

        const payload = {
            empresa,
            obra,
            fecha_accidente,
            hora,
            fecha_investigacion,
            rut,
            observaciones, // Enviar Observaciones
            items
        };

        // Mostrar un toast de "Enviando..."
        const enviandoToastId = toast.info("Enviando datos...", {
            position: "top-right",
            transition: Slide,
            autoClose: false,
            closeOnClick: false,
            draggable: false,
        });

        try {
            const response = await fetch('http://localhost:5000/api/accidente', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            toast.dismiss(enviandoToastId);

            if (response.ok) {
                toast.success('Datos de Accidente guardados correctamente.', {
                    position: "top-right",
                    transition: Slide,
                    autoClose: 5000,
                });
            } else {
                const errorData = await response.json();
                toast.error('Error al guardar Accidente: ' + errorData.error, {
                    position: "top-right",
                    transition: Slide,
                    autoClose: 5000,
                });
            }
        } catch (error) {
            toast.dismiss(enviandoToastId);
            toast.error('Error en la conexión con el servidor.', {
                position: "top-right",
                transition: Slide,
                autoClose: 5000,
            });
        }
    };

    return (
        <div className="formulario-accidente-container-root">
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                transition={Slide}
            />

            <div className="formulario-accidente-container">
                <header className="formulario-accidente-header">
                    <div className="formulario-accidente-header-content">
                        <h1 className="formulario-accidente-titulo">Informe de Investigación de Accidentes</h1>
                        <img src={logo} alt="Logo" className="formulario-accidente-logo" />
                    </div>
                </header>

                <form className="formulario-accidente-form" onSubmit={handleSubmit}>
                    <div className="formulario-accidente-group">
                        <div className="formulario-accidente-field">
                            <label htmlFor="empresa" className="formulario-accidente-label">Empresa</label>
                            <select
                                id="empresa"
                                className="formulario-accidente-input empresa-select field-empresa"
                                value={empresa}
                                onChange={(e) => setEmpresa(e.target.value)}
                            >
                                <option value="">Seleccionar empresa</option>
                                {empresas.map((empresa) => (
                                    <option key={empresa.id} value={empresa.nombre}>
                                        {empresa.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="formulario-accidente-group">
                        <div className="formulario-accidente-field">
                            <label htmlFor="fecha-accidente" className="formulario-accidente-label">Fecha del Accidente</label>
                            <input type="date" id="fecha-accidente" className="formulario-accidente-input text-center" />
                        </div>
                        <div className="formulario-accidente-field">
                            <label htmlFor="hora" className="formulario-accidente-label">Hora</label>
                            <input
                                type="time"
                                id="hora"
                                className="formulario-accidente-input text-center"
                                value={horaActual}
                                readOnly
                            />
                        </div>
                    </div>

                    <div className="formulario-accidente-group">
                        <div className="formulario-accidente-field">
                            <label htmlFor="fecha-investigacion" className="formulario-accidente-label">Fecha de la Investigación</label>
                            <input type="date" id="fecha-investigacion" className="formulario-accidente-input text-center" />
                        </div>
                        <div className="formulario-accidente-field">
                            <label htmlFor="obra" className="formulario-accidente-label">Obra</label>
                            <input type="text" id="obra" className="formulario-accidente-input text-center" />
                        </div>
                    </div>

                    {/* Campo RUT */}
                    <div className="formulario-accidente-field">
                        <label htmlFor="rut" className="formulario-accidente-label">RUT</label>
                        <input
                            type="text"
                            id="rut"
                            className="formulario-accidente-input"
                            value={rut}
                            onChange={(e) => setRut(e.target.value)}
                            placeholder="Ingrese el RUT"
                        />
                    </div>

                    {RowAccidente.map((row, index) => {
                        const ignoredFields = ["fecha-accidente", "hora", "fecha-investigacion", "obra", "rut", "observaciones"];
                        if (row.id && ignoredFields.includes(row.id)) return null;

                        if (row.group) {
                            return (
                                <div className="formulario-accidente-group" key={`group-${index}`}>
                                    {row.group.map((field) => {
                                        if (ignoredFields.includes(field.id)) return null;
                                        return (
                                            <div className="formulario-accidente-field" key={field.id}>
                                                <label htmlFor={field.id} className="formulario-accidente-label">{field.label}</label>
                                                {field.type === 'select' ? (
                                                    <select id={field.id} className="formulario-accidente-input">
                                                        <option value="">Seleccione una opción</option>
                                                        {field.options.map((option, idx) => (
                                                            <option key={idx} value={option}>{option}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <input type={field.type} id={field.id} className="formulario-accidente-input" />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        }

                        return (
                            <div className="formulario-accidente-field" key={row.id}>
                                <label htmlFor={row.id} className="formulario-accidente-label">{row.label}</label>
                                {row.type === 'textarea' ? (
                                    <textarea id={row.id} className="formulario-accidente-input" rows="4"></textarea>
                                ) : (
                                    <input type={row.type} id={row.id} className="formulario-accidente-input" />
                                )}
                            </div>
                        );
                    })}

                    {/* Campo Observaciones */}
                    <div className="formulario-accidente-field">
                        <label htmlFor="observaciones" className="formulario-accidente-label">Observaciones</label>
                        <textarea
                            id="observaciones"
                            className="formulario-accidente-input"
                            rows="4"
                            value={observaciones}
                            onChange={(e) => setObservaciones(e.target.value)}
                            placeholder="Ingrese observaciones"
                        ></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary mt-4">Enviar</button>
                    <div className="floating-button-container">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                                onVolver();
                                toast.info("Has vuelto al formulario anterior.", {
                                    position: "top-right",
                                    transition: Slide,
                                    autoClose: 3000,
                                });
                            }}
                        >
                            Volver
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default FormularioAccidente;
