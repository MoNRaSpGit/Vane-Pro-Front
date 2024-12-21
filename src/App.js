import React, { useState } from "react";
import FormularioControl from "./Componentes/FormularioControl";
import FormularioBotiquin from "./Componentes/FormularioBotiquin";
import FormularioAccidente from "./Componentes/FormularioAccidente";
import FormularioNTP from "./Componentes/FormularioNTP";
import SeleccionFormularios from "./Componentes/SeleccionFormularios";
import DiosExiste from "./Componentes/DiosExiste";
import Login from "./Componentes/Login";
import Registro from "./Componentes/Registro";

function App() {
    const [usuario, setUsuario] = useState(null);
    const [formularioActual, setFormularioActual] = useState(null);
    const [vistaActual, setVistaActual] = useState("login");

    const handleLogin = (user) => {
        console.log("Usuario autenticado en App.js:", user);
        setUsuario(user);
    };

    const handleRegistroExitoso = () => {
        setVistaActual("login");
    };

    const handleCerrarSesion = () => {
        setUsuario(null); // Restablece el estado de usuario para cerrar sesión
        setVistaActual("login"); // Vuelve a la vista de login
    };

    const handleVolver = () => {
        setFormularioActual(null);
    };

    const renderFormulario = () => {
        switch (formularioActual) {
            case "control":
                return <FormularioControl onVolver={handleVolver} />;
            case "botiquin":
                return <FormularioBotiquin onVolver={handleVolver} />;
            case "accidente":
                return <FormularioAccidente onVolver={handleVolver} />;
            case "formulariontp":
                return <FormularioNTP onVolver={handleVolver} />;
            default:
                return (
                    <SeleccionFormularios
                        onSeleccionarFormulario={(form) => setFormularioActual(form)}
                        usuario={usuario}
                        onCerrarSesion={handleCerrarSesion} // Pasa la función de cerrar sesión
                    />
                );
        }
    };

    if (!usuario) {
        return vistaActual === "login" ? (
            <Login onLogin={handleLogin} onSwitchToRegister={() => setVistaActual("registro")} />
        ) : (
            <Registro onRegistro={handleRegistroExitoso} />
        );
    }

    if (usuario.rol === "admin") {
        return <DiosExiste onCerrarSesion={handleCerrarSesion} />;
    }

    return (
        <div className="App">
            {renderFormulario()}
        </div>
    );
}

export default App;
