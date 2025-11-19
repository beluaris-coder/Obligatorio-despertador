import "./App.css";
import { Routes, Route } from "react-router-dom";
import DetalleNoticia from "./components/DetalleNoticia";
import Noticias from "./components/Noticias";
import NotFound from "./components/NotFound";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Noticias />} />
        <Route path="/noticia/:id" element={<DetalleNoticia />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
