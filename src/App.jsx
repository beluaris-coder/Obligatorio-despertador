import "./App.css";
import { Routes, Route, NavLink } from "react-router-dom";
import { MdAddCircle, MdSettings, MdDashboard } from "react-icons/md";
import Dashboard from "./components/Dashboard";
import AgregarEscena from "./components/AgregarEscena";
import Config from "./components/Config"
import NotFound from "./components/NotFound";
import DetalleEscena from "./components/DetalleEscena";



function App() {
  return (
    <>
      <main className="pb-24">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="agregar" element={<AgregarEscena />} />
          <Route path="config" element={<Config />} />
          <Route path="/escena/:id" element={<DetalleEscena />} />
            <Route path="/escena/:id/editar" element={<AgregarEscena />} /> 
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="fixed bottom-4 left-0 right-0 flex justify-center z-50">
        <nav className="bg-white rounded-full shadow-lg px-12 py-3 flex items-center gap-8">

          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center text-xs transition-colors ${isActive ? "text-violet-500" : "text-gray-400"
              }`
            }
          >
            <MdDashboard className="w-6 h-6" />
          </NavLink>

          <NavLink to="/agregar" className=
            {({ isActive }) => `flex items-center justify-center rounded-full w-14 h-14 -mt-6 shadow-xl border-4 border-white transition-all
               ${isActive
                ? "bg-violet-500 text-white"
                : "bg-violet-400 text-white"}`
            }
          >
            <MdAddCircle className="w-89 h-8" />
          </NavLink>

          <NavLink
            to="/config"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center text-xs transition-colors ${isActive ? "text-violet-500" : "text-gray-400"
              }`
            }
          >
            <MdSettings className="w-6 h-6 mb-0.5" />
          </NavLink>
        </nav>
      </footer >


    </>
  );
}

export default App;
