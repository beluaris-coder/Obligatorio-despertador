import "./App.css";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import NotFound from "./components/NotFound";
import DetalleEscena from "./components/DetalleEscena";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/escena/:id" element={<DetalleEscena />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
