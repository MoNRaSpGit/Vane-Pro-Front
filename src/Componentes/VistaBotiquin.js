import React from 'react';
import '../Css/botiquin.css';
import logo from '../imagenes/logoVane.png';
import botiquinRow from '../Estructura/rowBotiquin';

const VistaBotiquin = ({ data }) => {
    const { empresa, responsable, fecha, observaciones, items } = data;

    // Procesar la fecha para mostrar solo "YYYY-MM-DD"
    const formattedFecha = fecha ? new Date(fecha).toISOString().split('T')[0] : '';

    // Crear un map elemento -> {mes: estado}
    const elementoMap = {};
    items.forEach(item => {
        if (!elementoMap[item.elemento]) {
            elementoMap[item.elemento] = {};
        }
        elementoMap[item.elemento][item.mes] = item.estado;
    });

    return (
        <div className="botiquin-container-root">
            <div className="botiquin-container">
                <header className="botiquin-header">
                    <div className="titulo-logo-container">
                        <h1 className="botiquin-titulo">Control de Botiquines</h1>
                        <img src={logo} alt="Logo" className="botiquin-logo" />
                    </div>

                    <div className="botiquin-datos-row">
                        <div className="responsable">
                            <label>Empresa:</label>
                            <div className="botiquin-input">{empresa}</div>
                        </div>
                        <div className="responsable">
                            <label>Responsable:</label>
                            <div className="botiquin-input">{responsable}</div>
                        </div>
                        <div className="fecha">
                            <label>Fecha:</label>
                            <div className="botiquin-input">{formattedFecha}</div>
                        </div>
                    </div>
                </header>

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
                                    const mes = mesIndex + 1;
                                    const estado = elementoMap[item.label] && elementoMap[item.label][mes] ? elementoMap[item.label][mes] : '';
                                    return (
                                        <td key={`${item.id}-mes-${mes}`} className="botiquin-cell">
                                            {estado}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="botiquin-footer">
                    <label className="botiquin-footer-label">
                        Observaciones:
                    </label>
                    <div
                        className="botiquin-observaciones"
                        style={{ whiteSpace: 'pre-wrap' }}
                    >
                        {observaciones}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VistaBotiquin;
