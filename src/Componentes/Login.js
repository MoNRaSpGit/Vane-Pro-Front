import React, { useState } from "react";
import "../Css/login.css";

const Login = ({ onLogin, onSwitchToRegister }) => {
    const [nombre, setNombre] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre, password }),
            });

            if (!response.ok) {
                throw new Error("Usuario o contraseña incorrectos");
            }

            const data = await response.json();
            onLogin(data); // Envía el usuario autenticado al App.js
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Iniciar Sesión</h2>
            <form onSubmit={handleLogin} className="login-form">
                <div className="form-group">
                    <label htmlFor="nombre">Nombre de Usuario</label>
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
                {error && <p className="text-danger">{error}</p>}
                <button type="submit" className="btn btn-primary">Ingresar</button>
            </form>
            <div className="mt-4">
                <p>¿No tienes cuenta? <a href="#registro" onClick={onSwitchToRegister}>Regístrate aquí</a></p>
            </div>
        </div>
    );
};

export default Login;
