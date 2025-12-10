import "./App.css";
import { Routes, Route, NavLink } from "react-router-dom";
import { MdAddCircle, MdSettings, MdDashboard } from "react-icons/md";

import Dashboard from "./components/Dashboard";
import FormEscena from "./components/FormEscena";
import Config from "./components/Config";
import NotFound from "./components/NotFound";
import DetalleEscena from "./components/DetalleEscena";
import JuegoMatematico from "./components/JuegoMatematico";

function App() {
  return (
    <>
      <main className="pb-24">
        <Routes>
          {/* Home / Dashboard */}
          <Route path="/" element={<Dashboard />} />

          {/* Crear nueva escena */}
          <Route path="agregar" element={<FormEscena />} />

          {/* Editar escena */}
          <Route path="escena/:id/editar" element={<FormEscena />} />

          {/* Detalle de escena */}
          <Route path="escena/:id" element={<DetalleEscena />} />

          {/* Juego matemático */}
          <Route path="juego-matematico" element={<JuegoMatematico />} />

          {/* Configuración */}
          <Route path="config" element={<Config />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* NAV INFERIOR */}
      <footer className="fixed bottom-4 left-0 right-0 flex justify-center z-50">
        <nav className="bg-white rounded-full shadow-lg px-12 py-3 flex items-center gap-8">
          {/* Dashboard */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center text-xs transition-colors ${
                isActive ? "text-violet-500" : "text-gray-400"
              }`
            }
          >
            <MdDashboard className="w-6 h-6" />
          </NavLink>

          {/* Agregar escena */}
          <NavLink
            to="/agregar"
            className={({ isActive }) =>
              `flex items-center justify-center rounded-full w-14 h-14 -mt-6 shadow-xl border-4 border-white transition-all ${
                isActive
                  ? "bg-violet-500 text-white"
                  : "bg-violet-400 text-white"
              }`
            }
          >
            <MdAddCircle className="w-8 h-8" />
          </NavLink>

          {/* Configuración */}
          <NavLink
            to="/config"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center text-xs transition-colors ${
                isActive ? "text-violet-500" : "text-gray-400"
              }`
            }
          >
            <MdSettings className="w-6 h-6 mb-0.5" />
          </NavLink>
        </nav>
      </footer>
    </>
  );
}

export default App;
