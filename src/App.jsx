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
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="agregar" element={<AgregarEscena />} />
          <Route path="config" element={<Config />} />
          <Route path="/escena/:id" element={<DetalleEscena />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer>
        <nav className="fixed bottom-0 left-0 w-full bg-violet-100 flex justify-around py-2 z-50">
         <NavLink to="/" className="navIcon">
        {({ isActive }) => (
          <MdDashboard size={28} color={isActive ? "#000" : "#888"} />
        )}
      </NavLink>

      <NavLink to="/agregar" className="navIcon">
        {({ isActive }) => (
          <MdAddCircle size={28} color={isActive ? "#000" : "#888"} />
        )}
      </NavLink>

      <NavLink to="/config" className="navIcon">
        {({ isActive }) => (
          <MdSettings size={28} color={isActive ? "#000" : "#888"} />
        )}
      </NavLink>
        </nav>
      </footer>


    </>
  );
}

export default App;
