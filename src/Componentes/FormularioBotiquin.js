import React, { useState } from 'react';
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import botiquinRow from '../Estructura/rowBotiquin';
import '../Css/botiquin.css';
import logo from '../imagenes/logoVane.png';
import { useSelector } from 'react-redux';


const FormularioBotiquin = ({ onVolver }) => {
    const [cellStatus, setCellStatus] = useState(() => {
        const initialStatus = {};
        botiquinRow.forEach((item) => {
            for (let mes = 1; mes <= 12; mes++) {
                initialStatus[`${item.id}-mes-${mes}`] = '';
            }
        });
        return initialStatus;
    });

    const empresas = useSelector((state) => state.empresas.empresas);

    const [empresa, setEmpresa] = useState('');
    const [responsable, setResponsable] = useState('');
    const [fecha, setFecha] = useState('');
    const [observaciones, setObservaciones] = useState('');

    const toggleCellStatus = (key) => {
        setCellStatus((prevState) => {
            const newStatus = { ...prevState };
            if (newStatus[key] === '') {
                newStatus[key] = '✔️';
            } else if (newStatus[key] === '✔️') {
                newStatus[key] = '❌';
            } else {
                newStatus[key] = '';
            }
            return newStatus;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!empresa || !fecha) {
            toast.error("Empresa y fecha son obligatorios.", {
                position: "top-right",
                transition: Slide,
                autoClose: 5000,
            });
            return;
        }

        const items = [];
        botiquinRow.forEach(item => {
            for (let mes = 1; mes <= 12; mes++) {
                const key = `${item.id}-mes-${mes}`;
                items.push({
                    elemento: item.label,
                    mes,
                    estado: cellStatus[key]
                });
            }
        });

        const payload = {
            empresa,
            responsable,
            fecha,
            observaciones,
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
            const response = await fetch('https://vane-pro-back.onrender.com/api/botiquin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            toast.dismiss(enviandoToastId);

            if (response.ok) {
                toast.success("Datos Botiquín guardados correctamente.", {
                    position: "top-right",
                    transition: Slide,
                    autoClose: 5000,
                });
            } else {
                const errorData = await response.json();
                toast.error("Error al guardar Botiquín: " + errorData.error, {
                    position: "top-right",
                    transition: Slide,
                    autoClose: 5000,
                });
            }
        } catch (error) {
            toast.dismiss(enviandoToastId);
            toast.error("Error en la conexión con el servidor.", {
                position: "top-right",
                transition: Slide,
                autoClose: 5000,
            });
        }
    };

    return (
        <div className="botiquin-container-root">
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

            <div className="botiquin-container">
                <header className="botiquin-header">
                    <div className="titulo-logo-container">
                        <h1 className="botiquin-titulo">Control de Botiquines</h1>
                        <img src={logo} alt="Logo" className="botiquin-logo" />
                    </div>

                    <div className="botiquin-datos-row">
                        <div className="responsable">
                            <label htmlFor="empresa">Empresa:</label>
                            <select
                                id="empresa"
                                className="botiquin-input"
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
                        <div className="responsable">
                            <label htmlFor="responsable">Responsable:</label>
                            <input
                                type="text"
                                id="responsable"
                                className="botiquin-input"
                                placeholder="Ingrese Responsable"
                                value={responsable}
                                onChange={(e) => setResponsable(e.target.value)}
                            />
                        </div>
                        <div className="fecha">
                            <label htmlFor="fecha">Fecha:</label>
                            <input
                                type="date"
                                id="fecha"
                                className="botiquin-input"
                                value={fecha}
                                onChange={(e) => setFecha(e.target.value)}
                            />
                        </div>
                    </div>
                </header>

                <form onSubmit={handleSubmit}>
                    <table className="botiquin-table">
                        <thead>
                            <tr>
                                <th>Elemento</th>
                                {[...Array(12)].map((_, index) => (
                                    <th key={`mes-${index + 1}`}>Mes {index + 1}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {botiquinRow.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.label}</td>
                                    {[...Array(12)].map((_, mesIndex) => {
                                        const key = `${item.id}-mes-${mesIndex + 1}`;
                                        return (
                                            <td
                                                key={key}
                                                className="botiquin-cell"
                                                onClick={() => toggleCellStatus(key)}
                                            >
                                                {cellStatus[key]}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="botiquin-footer">
                        <label htmlFor="observaciones" className="botiquin-footer-label">
                            Observaciones:
                        </label>
                        <textarea
                            id="observaciones"
                            className="botiquin-observaciones"
                            placeholder="Ingrese Observaciones"
                            value={observaciones}
                            onChange={(e) => setObservaciones(e.target.value)}
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

export default FormularioBotiquin;
