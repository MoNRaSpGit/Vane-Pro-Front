import React from 'react';
import "../Css/controlCss.css";

const VistaControlOperacionalSimplificada = ({ data, onBack }) => {
    const {
        empresa,
        obra,
        nucleo,
        fecha,
        hora,
        rut,
        observaciones,
        total_correctos,
        total_incorrectos,
        indice_co,
        items
    } = data;

    const formattedFecha = new Date(fecha).toLocaleDateString('es-ES');

    const groupedItems = items.reduce((acc, item) => {
        if (!acc[item.item_principal]) {
            acc[item.item_principal] = [];
        }
        acc[item.item_principal].push(item);
        return acc;
    }, {});

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="control-form-root printable-mode">
            <div className="container control-form mt-5 printable-view">
                <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Control Operacional Simplificado</h1>

                {/* Encabezado en una sola fila */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '20px', justifyContent: 'space-between' }}>
                    <p><strong>Empresa:</strong> {empresa}</p>
                    <p><strong>Obra:</strong> {obra}</p>
                    <p><strong>Núcleo:</strong> {nucleo}</p>
                    <p><strong>Fecha:</strong> {formattedFecha}</p>
                    <p><strong>Hora:</strong> {hora}</p>
                    <p><strong>RUT:</strong> {rut}</p>
                </div>

                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>Item Principal</th>
                            <th>Item Secundario</th>
                            <th>Correctos</th>
                            <th>Incorrectos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(groupedItems).map(([itemPrincipal, subItems], index) => (
                            subItems.map((subItem, subIndex) => (
                                <tr key={`${itemPrincipal}-${subItem.item_secundario}-${index}-${subIndex}`}>
                                    {subIndex === 0 && (
                                        <td rowSpan={subItems.length}>
                                            {itemPrincipal}
                                        </td>
                                    )}
                                    <td>{subItem.item_secundario}</td>
                                    <td>{subItem.correctos}</td>
                                    <td>{subItem.incorrectos}</td>
                                </tr>
                            ))
                        ))}
                    </tbody>
                </table>

                {/* Pie de página en una sola fila */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p><strong>Total Correctos:</strong> {total_correctos}</p>
                    <p><strong>Total Incorrectos:</strong> {total_incorrectos}</p>
                    <p><strong>Índice CO:</strong> {indice_co}%</p>
                    <p><strong>Observaciones:</strong> {observaciones}</p>
                    <div>
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                console.log("Botón 'Volver al Filtrado' clickeado");
                                onBack();
                            }}
                            style={{ marginRight: '10px' }}
                        >
                            Volver al Filtrado
                        </button>
                        <button
                            className="btn btn-success print-button"
                            onClick={handlePrint}
                        >
                            Imprimir
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VistaControlOperacionalSimplificada;
