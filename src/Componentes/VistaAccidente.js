import React from 'react';
import '../Css/accidente.css';
import logo from '../imagenes/logoVane.png';
import RowAccidente from '../Estructura/rowAccidentes';

const VistaAccidente = ({ data }) => {
    const {
        empresa,
        obra,
        fecha_accidente,
        hora,
        fecha_investigacion,
        rut,
        observaciones,
        items,
    } = data;

    // Mapeamos nombre_campo -> valor
    const valuesMap = {};
    items.forEach((i) => {
        valuesMap[i.nombre_campo] = i.valor;
    });

    // Función para formatear las fechas
    const formatFecha = (fecha) => {
        if (!fecha) return '';
        return fecha.split('T')[0]; // Extrae solo la parte de la fecha (YYYY-MM-DD)
    };

    return (
        <div className="formulario-accidente-container-root">
            <div className="formulario-accidente-container">
                <header className="formulario-accidente-header">
                    <div className="formulario-accidente-header-content">
                        <h1 className="formulario-accidente-titulo">Informe de Investigación de Accidentes</h1>
                        <img src={logo} alt="Logo" className="formulario-accidente-logo" />
                    </div>
                </header>

                <div className="formulario-accidente-field">
                    <label className="formulario-accidente-label">Empresa</label>
                    <div className="formulario-accidente-input">{empresa}</div>
                </div>

                <div className="formulario-accidente-group">
                    <div className="formulario-accidente-field">
                        <label className="formulario-accidente-label">Fecha del Accidente</label>
                        <div className="formulario-accidente-input">{formatFecha(fecha_accidente)}</div>
                    </div>
                    <div className="formulario-accidente-field">
                        <label className="formulario-accidente-label">Hora</label>
                        <div className="formulario-accidente-input">{hora}</div>
                    </div>
                </div>

                <div className="formulario-accidente-group">
                    <div className="formulario-accidente-field">
                        <label className="formulario-accidente-label">Fecha de la Investigación</label>
                        <div className="formulario-accidente-input">{formatFecha(fecha_investigacion)}</div>
                    </div>
                    <div className="formulario-accidente-field">
                        <label className="formulario-accidente-label">Obra</label>
                        <div className="formulario-accidente-input">{obra}</div>
                    </div>
                </div>

                <div className="formulario-accidente-field">
                    <label className="formulario-accidente-label">RUT</label>
                    <div className="formulario-accidente-input">{rut}</div>
                </div>

                {/* Campos adicionales de RowAccidente */}
                {RowAccidente.map((row, index) => {
                    const ignoredFields = ["fecha-accidente", "hora", "fecha-investigacion", "obra"];

                    if (row.id && ignoredFields.includes(row.id)) return null;

                    if (row.group) {
                        return (
                            <div className="formulario-accidente-group" key={`group-${index}`}>
                                {row.group.map((field) => {
                                    if (ignoredFields.includes(field.id)) return null;
                                    return (
                                        <div className="formulario-accidente-field" key={field.id}>
                                            <label className="formulario-accidente-label">{field.label}</label>
                                            <div className="formulario-accidente-input">
                                                {valuesMap[field.id] || ''}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    }

                    return (
                        <div className="formulario-accidente-field" key={row.id}>
                            <label className="formulario-accidente-label">{row.label}</label>
                            <div className="formulario-accidente-input" style={row.type === 'textarea' ? { whiteSpace: 'pre-wrap' } : {}}>
                                {valuesMap[row.id] || ''}
                            </div>
                        </div>
                    );
                })}

                <div className="formulario-accidente-field">
                    <label className="formulario-accidente-label">Observaciones</label>
                    <div className="formulario-accidente-input" style={{ whiteSpace: 'pre-wrap' }}>{observaciones}</div>
                </div>
            </div>
        </div>
    );
};

export default VistaAccidente;
