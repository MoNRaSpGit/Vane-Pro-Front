import React, { useState, useEffect } from "react";
import VistaControlOperacional from "./VistaControlOperacional";
import VistaControlOperacionalSimplificada from "./VistaControlOperacionalSimplificada";
import VistaNTP330 from "./VistaNTP330";
import VistaAccidente from "./VistaAccidente";
import VistaBotiquin from "./VistaBotiquin";
import "../Css/vista.css";

const DiosExiste = () => {
    const [data, setData] = useState([]);
    const [empresa, setEmpresa] = useState('');
    const [fecha, setFecha] = useState('');
    const [formulario, setFormulario] = useState('');
    const [selectedFormulario, setSelectedFormulario] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSimplified, setIsSimplified] = useState(false);

    // Nuevo estado para controlar la visibilidad de los filtros y botones
    const [showFilters, setShowFilters] = useState(true);
    const [showButtons, setShowButtons] = useState(true);

    const handleFiltrar = async () => {
        if (!empresa || !fecha || !formulario) {
            alert("Debe seleccionar empresa, fecha y tipo de formulario.");
            return;
        }

        setLoading(true);
        setError(null);
        setData([]);
        setSelectedFormulario(null);

        try {
            const response = await fetch(
                `http://localhost:5000/api/filtrar?empresa=${empresa}&fecha=${fecha}&formulario=${formulario}`
            );
            if (!response.ok) throw new Error("Error al obtener los datos del servidor");

            const jsonData = await response.json();
            if (jsonData.mensaje) {
                setData([]);
                alert(jsonData.mensaje);
            } else setData(jsonData);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePrintAndHideFilters = () => {
        // Si el formulario es "control-operacional", redirigir a VistaControlOperacionalSimplificada
        if (formulario === "control-operacional" && selectedFormulario) {
            setIsSimplified(true);
            setTimeout(() => {
                window.print();
                setTimeout(() => {
                    setShowButtons(true); // Mostrar los botones después de la impresión
                }, 100);
            }, 1000);
        } else {
            setShowFilters(false);
            setShowButtons(false);

            // Retraso antes de iniciar la impresión
            setTimeout(() => {
                window.print();

                // Volver a mostrar los botones después de 10 segundos
                setTimeout(() => {
                    setShowButtons(true);
                }, 10000);
            }, 1000);
        }
    };


    const renderVistaFormulario = (formularioData) => {
        if (isSimplified && formulario === "control-operacional") {
            // Mostrar versión simplificada
            return <VistaControlOperacionalSimplificada data={formularioData} onBack={() => {
                setIsSimplified(false);
                setShowFilters(true);
            }} />;
        }

        switch (formulario) {
            case "control-operacional":
                return (
                    <VistaControlOperacional
                        data={formularioData}
                        onSimplify={() => setIsSimplified(true)}
                    />
                );
            case "ntp330":
                return <VistaNTP330 data={formularioData} />;
            case "accidente":
                return <VistaAccidente data={formularioData} />;
            case "botiquin":
                return <VistaBotiquin data={formularioData} />;
            default:
                return null;
        }
    };

    return (
        <div className="dios-root">
            {!isSimplified && showFilters && (
                <>
                    <div className="dios-header">
                        <h2>Gestor de Formularios</h2>
                    </div>

                    <div className="dios-filtros row">
                        <div className="col-md-4">
                            <label>Empresa:</label>
                            <select
                                className="form-control"
                                value={empresa}
                                onChange={(e) => setEmpresa(e.target.value)}
                            >
                                <option value="">Seleccionar empresa</option>
                                <option value="MEVIR">MEVIR</option>
                                <option value="FRIGORIFICO">FRIGORIFICO</option>
                                <option value="MONRA COMPANY">MONRA COMPANY</option>
                            </select>
                        </div>
                        <div className="col-md-4">
                            <label>Fecha:</label>
                            <input
                                type="date"
                                className="form-control"
                                value={fecha}
                                onChange={(e) => setFecha(e.target.value)}
                            />
                        </div>
                        <div className="col-md-4">
                            <label>Formulario:</label>
                            <select
                                className="form-control"
                                value={formulario}
                                onChange={(e) => setFormulario(e.target.value)}
                            >
                                <option value="">Seleccionar formulario</option>
                                <option value="control-operacional">Control Operacional</option>
                                <option value="ntp330">NTP330</option>
                                <option value="accidente">Accidente</option>
                                <option value="botiquin">Botiquín</option>
                            </select>
                        </div>
                        <button className="dios-button mt-3" onClick={handleFiltrar}>
                            Filtrar
                        </button>
                    </div>
                </>
            )}

            {loading && <div className="dios-mensaje dios-cargando">Cargando datos...</div>}
            {error && <div className="dios-mensaje dios-error">Error: {error}</div>}

            {data.length > 0 && !selectedFormulario && (
                <div className="dios-lista">
                    {data.map((formularioData, index) => (
                        <div
                            key={index}
                            className="dios-item"
                            onClick={() => setSelectedFormulario(formularioData)}
                        >
                            <span>
                                <strong>Empresa:</strong> {formularioData.empresa} |{" "}
                                <strong>Fecha:</strong> {formularioData.fecha}
                            </span>
                            <span>➡</span>
                        </div>
                    ))}
                </div>
            )}

            {selectedFormulario && !isSimplified && (
                <div className="dios-contenedor-formulario dios-root">
                    {showButtons && (
                        <>
                            <button
                                className="dios-volver mb-3"
                                onClick={() => {
                                    setSelectedFormulario(null);
                                    setShowFilters(true); // Mostrar los filtros al volver
                                }}
                            >
                                Volver a la Lista
                            </button>
                            <button
                                className="dios-volver mb-3 ml-2"
                                onClick={handlePrintAndHideFilters}
                            >
                                Imprimir
                            </button>
                        </>
                    )}

                    {renderVistaFormulario(selectedFormulario)}
                </div>
            )}

            {selectedFormulario && isSimplified && (
                <VistaControlOperacionalSimplificada
                    data={selectedFormulario}
                    onBack={() => {
                        setSelectedFormulario(null); // Regresa a la lista de formularios
                        setShowFilters(true); // Mostrar los filtros al volver
                        setIsSimplified(false); // Desactiva la vista simplificada
                    }}
                />
            )}
        </div>
    );
};

export default DiosExiste;
