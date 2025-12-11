// Dashboard.jsx
import { useState } from "react";
import Search from "./Shared/Search";
import ListadoEscenas from "./ListadoEscenas";
import { useEjecucionAutomaticaEscenas } from "../hooks/UseEjecucionAutomaticaEscenas";

const Dashboard = () => {
  const [search, setSearch] = useState("");

  // 👇 esto hace que el intervalo se active
  useEjecucionAutomaticaEscenas();

  return (
    <section className="pt-5 px-4 flex flex-col gap-6">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <Search
        placeholder="Buscar..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ListadoEscenas search={search} />
    </section>
  );
};

export default Dashboard;
