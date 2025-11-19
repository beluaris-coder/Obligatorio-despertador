import { useState } from "react";
import Filtros from "./Filtros";
import Header from "./Header";
import ListadoNoticias from "./ListadoNoticias";

const Noticias = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState("");

  return (
    <section className="pt-8 px-4 flex flex-col gap-6">
      <Header />
      <Filtros
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        search={search}
        setSearch={setSearch}
      />
      <ListadoNoticias selectedCategory={selectedCategory} search={search} />
    </section>
  );
};

export default Noticias;
