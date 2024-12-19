import React, { useState } from "react";
import FormularioControl from "./Componentes/FormularioControl";
import FormularioBotiquin from "./Componentes/FormularioBotiquin";
import FormularioAccidente from "./Componentes/FormularioAccidente";
import FormularioNTP from "./Componentes/FormularioNTP";
import SeleccionFormularios from "./Componentes/SeleccionFormularios";
import DiosExiste from "./Componentes/DiosExiste";
import Login from "./Componentes/Login";
import Registro from "./Componentes/Registro"; // Importar el componente Registro

function App() {
    const [usuario, setUsuario] = useState(null); // Estado para manejar el usuario autenticado
    const [formularioActual, setFormularioActual] = useState(null); // Estado para manejar el formulario actual
    const [vistaActual, setVistaActual] = useState("login"); // Manejar si estamos en login o registro

    const handleLogin = (user) => {
        setUsuario(user); // Guardar los datos del usuario (nombre, rol, etc.)
    };

    const handleRegistroExitoso = () => {
        setVistaActual("login"); // Volver al login después de un registro exitoso
    };

    const handleVolver = () => {
        setFormularioActual(null); // Regresa al selector de formularios
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
                        usuario={usuario} // Pasamos el nombre del usuario autenticado
                    />
                );
        }
    };

    if (!usuario) {
        // Si no hay usuario autenticado, mostrar login o registro según corresponda
        return vistaActual === "login" ? (
            <Login onLogin={handleLogin} onSwitchToRegister={() => setVistaActual("registro")} />
        ) : (
            <Registro onRegistro={handleRegistroExitoso} />
        );
    }

    if (usuario.rol === "admin") {
        return <DiosExiste />;
    }

    return (
        <div className="App">
            {renderFormulario()}
        </div>
    );
}

export default App;
