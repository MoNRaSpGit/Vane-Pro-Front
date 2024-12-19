import React from 'react';
import logoVane from "../imagenes/logoVane.png";
import "../Css/controlCss.css";

const VistaControlOperacional = ({ data, onSimplify }) => {
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

    const handleSimplify = () => {
        // Llamamos a la función provista por props para indicar que queremos la vista simplificada
        onSimplify();
    };

    const displayValue = (value) => (value || value === 0 ? value : "");

    return (
        <div className="control-form-root">
            <div className="container control-form mt-5">
                <div className="mb-3 toggle-container">
                    <button
                        className="btn btn-primary toggle-button"
                        onClick={handleSimplify}
                    >
                        Simplificar para Imprimir
                    </button>
                </div>

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

                {/* Empresa */}
                <div className="row mb-4">
                    <div className="col-md-6">
                        <label className="form-label">Empresa:</label>
                        <div className="form-control input-light-gray text-center">{displayValue(empresa)}</div>
                    </div>
                </div>

                {/* Obra y Núcleo */}
                <div className="row mb-4">
                    <div className="col-md-6">
                        <label htmlFor="obra" className="form-label">Obra:</label>
                        <div className="form-control input-light-gray text-center">{displayValue(obra)}</div>
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="nucleo" className="form-label">Núcleo:</label>
                        <div className="form-control input-light-gray text-center">{displayValue(nucleo)}</div>
                    </div>
                </div>

                {/* Fecha y Hora */}
                <div className="row mb-4">
                    <div className="col-md-6">
                        <label htmlFor="fecha" className="form-label">Fecha:</label>
                        <div className="form-control input-light-gray text-center">{formattedFecha}</div>
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="hora" className="form-label">Hora:</label>
                        <div className="form-control input-light-gray text-center">{displayValue(hora)}</div>
                    </div>
                </div>

                {/* RUT */}
                <div className="row mt-3">
                    <div className="col-12">
                        <label htmlFor="rut" className="form-label">RUT:</label>
                        <div className="form-control input-light-gray text-center">{displayValue(rut)}</div>
                    </div>
                </div>

                {/* Tabla de Control */}
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
                        {Object.entries(groupedItems).map(([itemPrincipal, subItems], index) => (
                            subItems.map((subItem, subIndex) => (
                                <tr key={`${itemPrincipal}-${subItem.item_secundario}-${index}-${subIndex}`}>
                                    {subIndex === 0 && (
                                        <td rowSpan={subItems.length}>
                                            {displayValue(itemPrincipal)}
                                        </td>
                                    )}
                                    <td>{displayValue(subItem.item_secundario)}</td>
                                    <td>{displayValue(subItem.correctos)}</td>
                                    <td>{displayValue(subItem.incorrectos)}</td>
                                </tr>
                            ))
                        ))}
                    </tbody>
                </table>

                {/* Observaciones */}
                <div className="mt-3">
                    <label htmlFor="observaciones" className="form-label">Observaciones:</label>
                    <div className="form-control input-light-gray">{displayValue(observaciones)}</div>
                </div>
            </div>
        </div>
    );
};

export default VistaControlOperacional;
