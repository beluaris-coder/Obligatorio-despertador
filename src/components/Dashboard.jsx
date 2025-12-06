import { useState } from "react";
import Search from "./Shared/Search";
import ListadoEscenas from "./ListadoEscenas";

const Dashboard = () => {
  const [search, setSearch] = useState("");

  return (
    <section className="pt-5 px-4 flex flex-col gap-6">
      <h1 className="text-xl font-semibold">Dashboard</h1>
      <Search placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} />
      <ListadoEscenas search={search} />
    </section>
  );
};

export default Dashboard;
