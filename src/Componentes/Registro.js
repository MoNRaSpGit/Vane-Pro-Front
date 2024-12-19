import React, { useState } from "react";

const Registro = ({ onRegistro }) => {
    const [nombre, setNombre] = useState("");
    const [password, setPassword] = useState("");
    const [rol, setRol] = useState("user");
    const [claveEspecial, setClaveEspecial] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("http://localhost:5000/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre, password, rol, claveEspecial }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error al registrar usuario");
            }

            alert("Usuario registrado con éxito. Ahora puedes iniciar sesión.");
            onRegistro(); // Volver al login
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Registro</h2>
            <form onSubmit={handleRegister} className="login-form">
                <div className="form-group">
                    <label htmlFor="nombre">Nombre</label>
                    <input
                        type="text"
                        id="nombre"
                        className="form-control"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Tipo de Usuario</label>
                    <select
                        className="form-control"
                        value={rol}
                        onChange={(e) => setRol(e.target.value)}
                        required
                    >
                        <option value="user">Usuario</option>
                        <option value="admin">Administrador</option>
                    </select>
                </div>
                {rol === "admin" && (
                    <div className="form-group">
                        <label htmlFor="claveEspecial">Clave Especial para Admin</label>
                        <input
                            type="password"
                            id="claveEspecial"
                            className="form-control"
                            value={claveEspecial}
                            onChange={(e) => setClaveEspecial(e.target.value)}
                        />
                    </div>
                )}
                {error && <p className="text-danger">{error}</p>}
                <button type="submit" className="btn btn-primary">Registrar</button>
            </form>
        </div>
    );
};

export default Registro;
