import React from "react";
import "../Css/ntp.css";
import logo from "../imagenes/logoVane.png";
import RowNTP330 from "../Estructura/row360";

const VistaNTP330 = ({ data }) => {
    console.log("soy data ", data);

    const { empresa, obra, fecha, hora, rut, observaciones, items } = data;

    const valuesMap = {};
    items.forEach((i) => {
        valuesMap[i.nombre_campo] = i.valor;
    });

    const inputStyle = { border: "1px solid black" };

    return (
        <div className="ntp-root">
            <div className="container">
                <div className="ntp-header d-flex justify-content-between align-items-center mb-4">
                    <h2 className="ntp-title text-center flex-grow-1">Formulario Evaluación NTP330</h2>
                    <img src={logo} alt="Logo" className="ntp-logo" />
                </div>

                <div className="ntp-group mb-3">
                    <label className="ntp-label form-label">Empresa:</label>
                    <div className="ntp-input form-control" style={inputStyle}>{empresa}</div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-6 ntp-group">
                        <label className="ntp-label form-label">Obra:</label>
                        <div className="ntp-input form-control" style={inputStyle}>{obra}</div>
                    </div>

                    <div className="col-md-6 ntp-group">
                        <label className="ntp-label form-label">Responsable de la Investigación:</label>
                        <div className="ntp-input form-control" style={inputStyle}>
                            {data.responsable || 'No disponible'}
                        </div>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-6 ntp-group">
                        <label className="ntp-label form-label">Fecha:</label>
                        <div className="ntp-input form-control" style={inputStyle}>{fecha}</div>
                    </div>
                    <div className="col-md-6 ntp-group">
                        <label className="ntp-label form-label">Hora:</label>
                        <div className="ntp-input form-control" style={inputStyle}>{hora}</div>
                    </div>
                </div>

                <div className="ntp-group mb-3">
                    <label className="ntp-label form-label">RUT:</label>
                    <div className="ntp-input form-control" style={inputStyle}>{rut}</div>
                </div>

                {/* Campos dinámicos */}
                {RowNTP330.map((row, index) => (
                    <div key={index} className="row mb-3">
                        {row.group
                            ? row.group.map((field) => (
                                <div key={field.id} className="col-md-6 ntp-group">
                                    <label className="ntp-label form-label">{field.label}:</label>
                                    <div className="ntp-input form-control" style={inputStyle}>
                                        {valuesMap[field.id] || ""}
                                    </div>
                                </div>
                            ))
                            : (
                                <div className="ntp-group mb-3" key={row.id}>
                                    <label className="ntp-label form-label">{row.label}:</label>
                                    <div className="ntp-input form-control" style={inputStyle}>
                                        {valuesMap[row.id] || ""}
                                    </div>
                                </div>
                            )}
                    </div>
                ))}

                <div className="ntp-group mb-3">
                    <label className="ntp-label form-label">Observaciones:</label>
                    <div className="ntp-input form-control" style={{ ...inputStyle, whiteSpace: "pre-wrap" }}>
                        {observaciones}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VistaNTP330;
