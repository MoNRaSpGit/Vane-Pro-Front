import React, { useState, useEffect, useRef } from "react";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RowNTP330 from "../Estructura/row360";
import "../Css/form330.css";
import logo from "../imagenes/logoVane.png";

const Formulario360 = ({ onVolver }) => {
    const [empresa, setEmpresa] = useState("");
    const [fechaActual, setFechaActual] = useState("");
    const [horaActual, setHoraActual] = useState("");
    const [rut, setRut] = useState("");
    const [observaciones, setObservaciones] = useState("");

    const obraRef = useRef(null);
    const responsableRef = useRef(null);

    useEffect(() => {
        const hoy = new Date();
        const fecha = hoy.toISOString().split("T")[0];
        const hora = hoy.toTimeString().slice(0, 5);
        setFechaActual(fecha);
        setHoraActual(hora);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            empresa,
            obra: obraRef.current ? obraRef.current.value.trim() : "",
            responsableInvestigacion: responsableRef.current ? responsableRef.current.value.trim() : "",
            rut: rut.trim(),
            fecha: fechaActual,
            hora: horaActual,
            observaciones: observaciones.trim(),
        };

        // Recolectar datos adicionales de RowNTP330
        RowNTP330.forEach((row) => {
            if (row.group) {
                row.group.forEach((field) => {
                    const fieldRef = field.ref ? field.ref.current : null;
                    formData[field.id] = fieldRef && fieldRef.value ? fieldRef.value.trim() : "";
                });
            } else {
                const fieldRef = row.ref ? row.ref.current : null;
                formData[row.id] = fieldRef && fieldRef.value ? fieldRef.value.trim() : "";
            }
        });

        // Validación de campos obligatorios
        if (!empresa || !formData.obra || !formData.responsableInvestigacion || !formData.fecha || !formData.hora || !formData.rut) {
            toast.error("Por favor, completa los campos obligatorios.", {
                position: "top-right",
                transition: Slide,
                autoClose: 5000,
            });
            return;
        }

        // Preparar los items para el payload
        const items = [];
        for (const key in formData) {
            if (!["empresa", "obra", "responsableInvestigacion", "fecha", "hora", "rut", "observaciones"].includes(key)) {
                items.push({ nombre_campo: key, valor: formData[key] });
            }
        }

        const payload = {
            empresa,
            obra: formData.obra,
            responsableInvestigacion: formData.responsableInvestigacion,
            fecha: formData.fecha,
            hora: formData.hora,
            rut: formData.rut,
            observaciones: formData.observaciones,
            items,
        };

        // Mostrar un toast de "Enviando" (opcional)
        const enviandoToastId = toast.info("Enviando datos...", {
            position: "top-right",
            transition: Slide,
            autoClose: false,
            closeOnClick: false,
            draggable: false,
        });

        try {
            const response = await fetch("https://vane-pro-back.onrender.com/api/ntp330", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            // Cerrar el toast de "Enviando"
            toast.dismiss(enviandoToastId);

            if (response.ok) {
                toast.success("Datos guardados correctamente.", {
                    position: "top-right",
                    transition: Slide,
                    autoClose: 5000,
                });
                // Opcional: Resetear el formulario después del éxito
                resetForm();
            } else {
                const errorData = await response.json();
                console.error("Error:", errorData);
                toast.error("Error al guardar los datos.", {
                    position: "top-right",
                    transition: Slide,
                    autoClose: 5000,
                });
            }
        } catch (error) {
            console.error("Error:", error);
            toast.dismiss(enviandoToastId);
            toast.error("Error en la conexión al servidor.", {
                position: "top-right",
                transition: Slide,
                autoClose: 5000,
            });
        }
    };

    // Función para resetear el formulario (opcional)
    const resetForm = () => {
        setEmpresa("");
        setRut("");
        setObservaciones("");
        if (obraRef.current) obraRef.current.value = "";
        if (responsableRef.current) responsableRef.current.value = "";
        RowNTP330.forEach((row) => {
            if (row.group) {
                row.group.forEach((field) => {
                    if (field.ref && field.ref.current) field.ref.current.value = "";
                });
            } else {
                if (row.ref && row.ref.current) row.ref.current.value = "";
            }
        });
    };

    return (
        <div className="form360-container-root">
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
            <div className="form360-container">
                <header className="form360-header">
                    <div className="form360-header-content">
                        <h1 className="form360-title">Formulario Evaluación NTP330</h1>
                        <img src={logo} alt="Logo" className="form360-logo" />
                    </div>
                </header>

                <form className="form360-form" onSubmit={handleSubmit}>
                    <div className="form360-row">
                        <div className="form360-group-half">
                            <label htmlFor="empresa" className="form360-label">Empresa:</label>
                            <select
                                id="empresa"
                                className="form360-control"
                                value={empresa}
                                onChange={(e) => setEmpresa(e.target.value)}
                                required
                            >
                                <option value="">Seleccionar empresa</option>
                                <option value="MEVIR">MEVIR</option>
                                <option value="FRIGORIFICO">FRIGORIFICO</option>
                                <option value="MONRA COMPANY">MONRA COMPANY</option>
                            </select>
                        </div>
                    </div>

                    <div className="form360-row">
                        <div className="form360-group-half">
                            <div className="form360-group-item">
                                <label htmlFor="obra" className="form360-label">Obra:</label>
                                <input
                                    id="obra"
                                    type="text"
                                    className="form360-control"
                                    placeholder="Ingrese la Obra"
                                    ref={obraRef}
                                    required
                                />
                            </div>
                            <div className="form360-group-item">
                                <label htmlFor="responsableInvestigacion" className="form360-label">Responsable de la Investigación:</label>
                                <input
                                    id="responsableInvestigacion"
                                    type="text"
                                    className="form360-control"
                                    placeholder="Ingrese el Responsable"
                                    ref={responsableRef}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form360-row">
                        <div className="form360-group-half">
                            <div className="form360-group-item">
                                <label htmlFor="fecha" className="form360-label">Fecha:</label>
                                <input
                                    id="fecha"
                                    type="date"
                                    className="form360-control"
                                    value={fechaActual}
                                    readOnly
                                />
                            </div>
                            <div className="form360-group-item">
                                <label htmlFor="hora" className="form360-label">Hora:</label>
                                <input
                                    id="hora"
                                    type="time"
                                    className="form360-control"
                                    value={horaActual}
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form360-row">
                        <div className="form360-group-full">
                            <label htmlFor="rut" className="form360-label">RUT:</label>
                            <input
                                id="rut"
                                type="text"
                                className="form360-control"
                                value={rut}
                                onChange={(e) => setRut(e.target.value)}
                                placeholder="Ingrese el RUT"
                                required
                            />
                        </div>
                    </div>

                    {RowNTP330.map((row, index) => (
                        <div key={index} className="form360-row">
                            {row.group ? (
                                <div className="form360-group-half">
                                    {row.group.map((field) => (
                                        <div key={field.id} className="form360-group-item">
                                            <label htmlFor={field.id} className="form360-label">{field.label}:</label>
                                            {field.type === "text" || field.type === "date" ? (
                                                <input
                                                    id={field.id}
                                                    type={field.type}
                                                    name={field.id}
                                                    className="form360-control"
                                                    placeholder={`Ingrese ${field.label.toLowerCase()}`}
                                                    ref={field.ref || React.createRef()} // Asegurar que hay una ref si es necesario
                                                />
                                            ) : field.type === "textarea" ? (
                                                <textarea
                                                    id={field.id}
                                                    name={field.id}
                                                    className="form360-control"
                                                    rows="4"
                                                    placeholder={`Ingrese ${field.label.toLowerCase()}`}
                                                    ref={field.ref || React.createRef()}
                                                ></textarea>
                                            ) : field.type === "select" ? (
                                                <select
                                                    id={field.id}
                                                    name={field.id}
                                                    className="form360-control"
                                                    ref={field.ref || React.createRef()}
                                                >
                                                    <option value="">Seleccione una opción</option>
                                                    {field.options.map((option, i) => (
                                                        <option key={i} value={option}>{option}</option>
                                                    ))}
                                                </select>
                                            ) : null}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="form360-group-full">
                                    <label htmlFor={row.id} className="form360-label">{row.label}:</label>
                                    {row.type === "textarea" ? (
                                        <textarea
                                            id={row.id}
                                            name={row.id}
                                            className="form360-control"
                                            rows="4"
                                            placeholder={`Ingrese ${row.label.toLowerCase()}`}
                                            ref={row.ref || React.createRef()}
                                        ></textarea>
                                    ) : (
                                        <input
                                            id={row.id}
                                            type={row.type}
                                            name={row.id}
                                            className="form360-control"
                                            placeholder={`Ingrese ${row.label.toLowerCase()}`}
                                            ref={row.ref || React.createRef()}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    ))}

                    <div className="form360-row">
                        <div className="form360-group-full">
                            <label htmlFor="observaciones" className="form360-label">Observaciones:</label>
                            <textarea
                                id="observaciones"
                                className="form360-control"
                                rows="4"
                                value={observaciones}
                                onChange={(e) => setObservaciones(e.target.value)}
                                placeholder="Ingrese observaciones"
                            ></textarea>
                        </div>
                    </div>

                    <button type="submit" className="form360-btn form360-btn-primary form360-mt-4">Enviar</button>
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
                        style={{ marginTop: "20px" }}
                    >
                        Volver
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Formulario360;
