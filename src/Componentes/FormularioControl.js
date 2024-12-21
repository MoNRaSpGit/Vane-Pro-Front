import React, { useEffect, useState } from 'react';
import { toast, ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import rowData from '../Estructura/rowControl';
import logoVane from "../imagenes/logoVane.png";
import "../Css/controlCss.css";
import { useSelector } from 'react-redux';


const FormularioControl = ({ onVolver }) => {
    const [fechaActual, setFechaActual] = useState('');
    const [horaActual, setHoraActual] = useState('');
    const [empresa, setEmpresa] = useState('');

    const empresas = useSelector((state) => state.empresas.empresas);


    const [controlValues, setControlValues] = useState(() => {
        const initialValues = {};
        rowData.forEach(item => {
            item.subItems.forEach(subItem => {
                initialValues[subItem.id] = { correct: '', incorrect: '' };
            });
        });
        return initialValues;
    });

    const [toggledInputs, setToggledInputs] = useState(() => {
        const initialToggled = {};
        rowData.forEach(item => {
            item.subItems.forEach(subItem => {
                initialToggled[`${subItem.id}-correct`] = false;
                initialToggled[`${subItem.id}-incorrect`] = false;
            });
        });
        return initialToggled;
    });

    const [totalCorrectos, setTotalCorrectos] = useState(0);
    const [totalIncorrectos, setTotalIncorrectos] = useState(0);
    const [indiceCO, setIndiceCO] = useState(0);

    useEffect(() => {
        const ahora = new Date();
        const opcionesFecha = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'America/Montevideo' };
        const opcionesHora = { hour: '2-digit', minute: '2-digit', timeZone: 'America/Montevideo', hour12: false };

        const fechaUruguay = ahora.toLocaleDateString('es-ES', opcionesFecha).split('/').reverse().join('-');
        const horaUruguay = ahora.toLocaleTimeString('es-ES', opcionesHora).slice(0, 5);

        setFechaActual(fechaUruguay);
        setHoraActual(horaUruguay);
    }, []);

    useEffect(() => {
        let correctSum = 0;
        let incorrectSum = 0;

        Object.values(controlValues).forEach(value => {
            correctSum += Number(value.correct) || 0;
            incorrectSum += Number(value.incorrect) || 0;
        });

        setTotalCorrectos(correctSum);
        setTotalIncorrectos(incorrectSum);

        if (correctSum + incorrectSum !== 0) {
            const indice = ((correctSum / (correctSum + incorrectSum)) * 100).toFixed(2);
            setIndiceCO(indice);
        } else {
            setIndiceCO(0);
        }
    }, [controlValues]);

    const handleToggle = (id, type) => {
        const key = `${id}-${type}`;
        setToggledInputs(prevToggled => ({
            ...prevToggled,
            [key]: !prevToggled[key]
        }));
    };

    const handleInputChange = (id, type, value) => {
        setControlValues(prevValues => ({
            ...prevValues,
            [id]: {
                ...prevValues[id],
                [type]: value
            }
        }));
    };

    const sendDataToServer = async () => {
        const obra = document.getElementById('obra').value.trim();
        const nucleo = document.getElementById('nucleo').value.trim();
        const rut = document.getElementById('rut').value.trim();
        const observaciones = document.getElementById('observaciones').value.trim();

        if (!obra || !rut || !empresa) {
            toast.error('Por favor, completa la empresa, la obra y el rut.', {
                position: "top-right",
                transition: Slide,
            });
            return;
        }

        const items = [];
        rowData.forEach(item => {
            item.subItems.forEach(subItem => {
                const { correct, incorrect } = controlValues[subItem.id];
                const correctosNum = Number(correct) || 0;
                const incorrectosNum = Number(incorrect) || 0;

                const estado_correctos = correctosNum > 0 ? 'verde' : '';
                const estado_incorrectos = incorrectosNum > 0 ? 'rojo' : '';

                items.push({
                    item_principal: item.itemPrincipal,
                    item_secundario: subItem.label,
                    correctos: correctosNum,
                    incorrectos: incorrectosNum,
                    estado_correctos,
                    estado_incorrectos
                });
            });
        });

        const payload = {
            empresa,
            obra,
            nucleo,
            fecha: fechaActual,
            hora: horaActual,
            rut,
            observaciones,
            items
        };

        try {
            const response = await fetch('http://localhost:5000/api/control-operacional', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success('Datos enviados correctamente.', {
                    position: "top-right",
                    transition: Slide,
                });
            } else {
                toast.error('Error al enviar los datos.', {
                    position: "top-right",
                    transition: Slide,
                });
                console.error('Error al enviar los datos:', result);
            }
        } catch (error) {
            console.error('Error al comunicarse con el servidor:', error);
            toast.error('Error al comunicarse con el servidor.', {
                position: "top-right",
                transition: Slide,
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendDataToServer();
    };

    return (
        <div className="control-form-root">
            <ToastContainer />
            <div className="container control-form mt-5">
                <header className="header-control mb-4">
                    <h1 className="titulo-formulario">Control Operacional de Seguridad</h1>
                    <div className="header-right">
                        <img src={logoVane} alt="Logo Vane" className="logo-vane" />
                        <p className="sobre-visita">
                            Sobre visita efectuada por el Técnico Prevencionista
                            <span className="numero-control">012120</span>
                        </p>
                    </div>
                </header>

                <form onSubmit={handleSubmit}>
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <label htmlFor="empresa-select" className="form-label">Empresa:</label>
                            <select
                                id="empresa-select"
                                className="form-control"
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

                    <div className="row mb-4">
                        <div className="col-md-6">
                            <label htmlFor="obra" className="form-label">Obra:</label>
                            <input type="text" id="obra" className="form-control input-light-gray" />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="nucleo" className="form-label">Núcleo / PU / AR / UP / Convenio:</label>
                            <input type="text" id="nucleo" className="form-control input-light-gray" />
                        </div>
                    </div>

                    <div className="row mb-4">
                        <div className="col-md-6">
                            <label htmlFor="fecha" className="form-label">Fecha:</label>
                            <input
                                type="date"
                                id="fecha"
                                className="form-control input-light-gray text-center"
                                value={fechaActual}
                                readOnly
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="hora" className="form-label">Hora:</label>
                            <input
                                type="time"
                                id="hora"
                                className="form-control input-light-gray text-center"
                                value={horaActual}
                                readOnly
                            />
                        </div>
                    </div>

                    <div className="row mt-3">
                        <div className="col-12">
                            <label htmlFor="rut" className="form-label">RUT:</label>
                            <input type="text" id="rut" className="form-control input-light-gray" placeholder="Ingrese RUT" />
                        </div>
                    </div>

                    <table className="table table-bordered table-control mt-4">
                        <thead>
                            <tr>
                                <th className="item-principal">Item Principal</th>
                                <th className="item-secundario">Item Secundario</th>
                                <th className="correctos">Correctos</th>
                                <th className="incorrectos">Incorrectos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rowData.map((item, index) => (
                                <React.Fragment key={index}>
                                    {item.subItems.map((subItem, subIndex) => (
                                        <tr key={subItem.id}>
                                            {subIndex === 0 && (
                                                <td rowSpan={item.subItems.length} className="item-principal">
                                                    {item.itemPrincipal}
                                                </td>
                                            )}
                                            <td className="item-secundario">{subItem.label}</td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className={`control-input ${toggledInputs[`${subItem.id}-correct`] ? 'input-correct-toggled' : ''}`}
                                                    value={controlValues[subItem.id].correct}
                                                    onChange={(e) => handleInputChange(subItem.id, 'correct', e.target.value)}
                                                    onClick={() => handleToggle(subItem.id, 'correct')}
                                                    min="0"
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className={`control-input ${toggledInputs[`${subItem.id}-incorrect`] ? 'input-incorrect-toggled' : ''}`}
                                                    value={controlValues[subItem.id].incorrect}
                                                    onChange={(e) => handleInputChange(subItem.id, 'incorrect', e.target.value)}
                                                    onClick={() => handleToggle(subItem.id, 'incorrect')}
                                                    min="0"
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-4">
                        <table className="table table-summary-control">
                            <thead>
                                <tr>
                                    <th>Total Correctos</th>
                                    <th>Total Incorrectos</th>
                                    <th>Índice CO</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <input
                                            type="number"
                                            className="control-input"
                                            value={totalCorrectos}
                                            readOnly
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            className="control-input"
                                            value={totalIncorrectos}
                                            readOnly
                                        />
                                    </td>
                                    <td>
                                        <span>Total Correctos / (Total Correctos + Total Incorrectos) x 100 = </span>
                                        <input
                                            type="text"
                                            className="control-input d-inline w-auto"
                                            value={indiceCO}
                                            readOnly
                                        />%
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-3">
                        <label htmlFor="observaciones" className="form-label">Observaciones a corregir:</label>
                        <textarea id="observaciones" className="form-control input-light-gray" rows="4"></textarea>
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

export default FormularioControl;
