import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import { MdAddCircle, MdSettings, MdDashboard } from "react-icons/md";

import Dashboard from "./components/Dashboard";
import FormEscena from "./components/FormEscena";
import Config from "./components/Config";
import NotFound from "./components/NotFound";
import DetalleEscena from "./components/DetalleEscena";
import JuegoMatematico from "./components/JuegoMatematico";

function App() {
  const { pathname } = useLocation();

  const mostrarNavInferior =
    pathname === "/" ||
    pathname === "/agregar" ||
    pathname === "/config" ||
    (pathname.startsWith("/escena") && !pathname.endsWith("/*"))

  const mainPaddingClass = mostrarNavInferior ? "pb-24" : "pb-0";

  return (
    <>
      <main className={mainPaddingClass}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="agregar" element={<FormEscena />} />
          <Route path="escena/:id/editar" element={<FormEscena />} />
          <Route path="escena/:id" element={<DetalleEscena />} />
          <Route path="juego-matematico" element={<JuegoMatematico />} />
          <Route path="config" element={<Config />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {mostrarNavInferior && (
        <footer className="fixed bottom-4 left-0 right-0 flex justify-center z-50">
          <nav className="bg-white rounded-full shadow-lg px-12 py-3 flex items-center gap-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex flex-col items-center text-xs ${
                  isActive ? "text-violet-500" : "text-gray-400"
                }`
              }
            >
              <MdDashboard className="w-6 h-6" />
            </NavLink>

            <NavLink
              to="/agregar"
              className={({ isActive }) =>
                `flex items-center justify-center rounded-full w-14 h-14 -mt-6 shadow-xl border-4 border-white ${
                  isActive
                    ? "bg-violet-500 text-white"
                    : "bg-violet-400 text-white"
                }`
              }
            >
              <MdAddCircle className="w-8 h-8" />
            </NavLink>

            <NavLink
              to="/config"
              className={({ isActive }) =>
                `flex flex-col items-center text-xs ${
                  isActive ? "text-violet-500" : "text-gray-400"
                }`
              }
            >
              <MdSettings className="w-6 h-6 mb-0.5" />
            </NavLink>
          </nav>
        </footer>
      )}
    </>
  );
}

export default App;
