// src/Componentes/FormularioNTP.jsx

import React, { useState, useEffect } from "react";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import rowNTP330 from "../Estructura/row360"; // Importar los campos dinámicos
import logo from "../imagenes/logoVane.png";
import "../Css/ntp.css";
import { useSelector } from 'react-redux';


const FormularioNTP = ({ onVolver }) => {
    const [empresa, setEmpresa] = useState('');
    const [obra, setObra] = useState('');
    const [responsable, setResponsable] = useState('');
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [rut, setRut] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const empresas = useSelector((state) => state.empresas.empresas);


    // Estados para campos dinámicos
    const [dynamicFields, setDynamicFields] = useState({});

    useEffect(() => {
        const ahora = new Date();
        setFecha(ahora.toISOString().split('T')[0]);
        setHora(ahora.toTimeString().slice(0, 5));

        const initialDynamicFields = {};
        rowNTP330.forEach(field => {
            if (field.id) {
                initialDynamicFields[field.id] = '';
            } else if (field.group) {
                field.group.forEach(subField => {
                    initialDynamicFields[subField.id] = '';
                });
            }
        });
        setDynamicFields(initialDynamicFields);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación de campos obligatorios
        if (!empresa || !obra || !responsable || !rut || !fecha || !hora) {
            toast.error("Por favor, completa los campos obligatorios.", {
                position: "top-right",
                transition: Slide,
                autoClose: 5000,
            });
            return;
        }

        const items = [];
        for (const key in dynamicFields) {
            items.push({ nombre_campo: key, valor: dynamicFields[key] });
        }

        const payload = {
            empresa,
            obra,
            responsable,
            fecha,
            hora,
            rut,
            observaciones,
            items
        };

        // Mostrar un toast de "Enviando..." opcional
        const enviandoToastId = toast.info("Enviando datos...", {
            position: "top-right",
            transition: Slide,
            autoClose: false,
            closeOnClick: false,
            draggable: false,
        });

        try {
            const response = await fetch('http://localhost:5000/api/ntp330', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            // Cerrar el toast de "Enviando"
            toast.dismiss(enviandoToastId);

            if (response.ok) {
                const result = await response.json();
                toast.success(result.message || "Formulario enviado correctamente.", {
                    position: "top-right",
                    transition: Slide,
                    autoClose: 5000,
                });

                // Opcional: Resetear el formulario
                resetForm();
            } else {
                const errorData = await response.json();
                toast.error("Error al enviar el formulario: " + errorData.error, {
                    position: "top-right",
                    transition: Slide,
                    autoClose: 5000,
                });
            }
        } catch (error) {
            toast.dismiss(enviandoToastId);
            toast.error("Error al conectar con el servidor. Inténtalo más tarde.", {
                position: "top-right",
                transition: Slide,
                autoClose: 5000,
            });
        }
    };

    const handleDynamicChange = (id, value) => {
        setDynamicFields(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const resetForm = () => {
        setEmpresa('');
        setObra('');
        setResponsable('');
        setRut('');
        setObservaciones('');
        setDynamicFields(Object.keys(dynamicFields).reduce((acc, key) => {
            acc[key] = '';
            return acc;
        }, {}));
    };

    return (
        <div className="ntp-root">
            {/* Configuración de ToastContainer */}
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

            <div className="container ">
                <div className="ntp-header d-flex justify-content-between align-items-center mb-4">
                    <h2 className="ntp-title text-center flex-grow-1">Formulario Evaluación NTP330</h2>
                    <img src={logo} alt="Logo" className="ntp-logo" />
                </div>
                <form onSubmit={handleSubmit} className="ntp-form">
                    <div className="ntp-group mb-3">
                        <label htmlFor="empresa" className="ntp-label form-label">Empresa</label>
                        <select
                            id="empresa"
                            className="ntp-input form-select"
                            value={empresa}
                            onChange={(e) => setEmpresa(e.target.value)}
                            required
                        >
                            <option value="">Seleccionar empresa</option>
                            {empresas.length > 0 ? (
                                empresas.map((empresa) => (
                                    <option key={empresa.id} value={empresa.nombre}>
                                        {empresa.nombre}
                                    </option>
                                ))
                            ) : (
                                <option value="">No hay empresas disponibles</option>
                            )}
                        </select>

                    </div>
                    <div className="row mb-3">
                        <div className="col-md-6 ntp-group">
                            <label htmlFor="obra" className="ntp-label form-label">Obra</label>
                            <input
                                type="text"
                                className="ntp-input form-control"
                                id="obra"
                                value={obra}
                                onChange={(e) => setObra(e.target.value)}
                                placeholder="Ingrese la Obra"
                                required
                            />
                        </div>
                        <div className="col-md-6 ntp-group">
                            <label htmlFor="responsable" className="ntp-label form-label">Responsable de la Investigación</label>
                            <input
                                type="text"
                                className="ntp-input form-control"
                                id="responsable"
                                value={responsable}
                                onChange={(e) => setResponsable(e.target.value)}
                                placeholder="Ingrese el Responsable"
                                required
                            />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-6 ntp-group">
                            <label htmlFor="fecha" className="ntp-label form-label">Fecha</label>
                            <input
                                type="date"
                                className="ntp-input form-control"
                                id="fecha"
                                value={fecha}
                                onChange={(e) => setFecha(e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-6 ntp-group">
                            <label htmlFor="hora" className="ntp-label form-label">Hora</label>
                            <input
                                type="time"
                                className="ntp-input form-control"
                                id="hora"
                                value={hora}
                                onChange={(e) => setHora(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="ntp-group mb-3">
                        <label htmlFor="rut" className="ntp-label form-label">RUT</label>
                        <input
                            type="text"
                            className="ntp-input form-control"
                            id="rut"
                            value={rut}
                            onChange={(e) => setRut(e.target.value)}
                            placeholder="Ingrese el RUT"
                            required
                        />
                    </div>

                    {/* Campos dinámicos */}
                    {rowNTP330.map((field, index) => (
                        field.group ? (
                            <div className="row mb-3" key={index}>
                                {field.group.map(subField => (
                                    <div className="col-md-6 ntp-group" key={subField.id}>
                                        <label htmlFor={subField.id} className="ntp-label form-label">{subField.label}</label>
                                        {subField.type === "textarea" ? (
                                            <textarea
                                                className="ntp-input form-control"
                                                id={subField.id}
                                                rows="3"
                                                value={dynamicFields[subField.id]}
                                                onChange={(e) => handleDynamicChange(subField.id, e.target.value)}
                                            ></textarea>
                                        ) : subField.type === "select" ? (
                                            <select
                                                className="ntp-input form-select"
                                                id={subField.id}
                                                value={dynamicFields[subField.id]}
                                                onChange={(e) => handleDynamicChange(subField.id, e.target.value)}
                                            >
                                                <option value="">Seleccione una opción</option>
                                                {subField.options.map((option, idx) => (
                                                    <option key={idx} value={option}>{option}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <input
                                                type={subField.type}
                                                className="ntp-input form-control"
                                                id={subField.id}
                                                value={dynamicFields[subField.id]}
                                                onChange={(e) => handleDynamicChange(subField.id, e.target.value)}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="ntp-group mb-3" key={index}>
                                <label htmlFor={field.id} className="ntp-label form-label">{field.label}</label>
                                {field.type === "textarea" ? (
                                    <textarea
                                        className="ntp-input form-control"
                                        id={field.id}
                                        rows="3"
                                        value={dynamicFields[field.id]}
                                        onChange={(e) => handleDynamicChange(field.id, e.target.value)}
                                    ></textarea>
                                ) : field.type === "select" ? (
                                    <select
                                        className="ntp-input form-select"
                                        id={field.id}
                                        value={dynamicFields[field.id]}
                                        onChange={(e) => handleDynamicChange(field.id, e.target.value)}
                                    >
                                        <option value="">Seleccione una opción</option>
                                        {field.options.map((option, idx) => (
                                            <option key={idx} value={option}>{option}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type={field.type}
                                        className="ntp-input form-control"
                                        id={field.id}
                                        value={dynamicFields[field.id]}
                                        onChange={(e) => handleDynamicChange(field.id, e.target.value)}
                                    />
                                )}
                            </div>
                        )
                    ))}

                    <div className="ntp-group mb-3">
                        <label htmlFor="observaciones" className="ntp-label form-label">Observaciones</label>
                        <textarea
                            className="ntp-input form-control"
                            id="observaciones"
                            rows="3"
                            value={observaciones}
                            onChange={(e) => setObservaciones(e.target.value)}
                        ></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary ntp-submit">Enviar</button>
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

export default FormularioNTP;
