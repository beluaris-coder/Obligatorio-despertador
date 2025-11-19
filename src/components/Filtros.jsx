// import { useEffect, useState } from "react";
import Pill from "./Shared/Pill";
import Search from "./Shared/Search";
import { API_URL } from "../helpers/constants";
import { useQuery } from "@tanstack/react-query";
// import { mockCategories } from "../helpers/mockData";

const Filtros = (props) => {
  const { selectedCategory, setSelectedCategory, search, setSearch } = props;
  // const [tags, setTags] = useState([])

  // useEffect(() => {
    // fetch(`${API_URL}/tag-list`)
    //   .then(res => res.json())
  //     .then((data)=>setTags(data));
  // }, [])

  const {data:tags = []} = useQuery({
    queryKey:["tags"],
    queryFn:()=>fetch(`${API_URL}/tag-list`).then(res => res.json())
  })

  return (
    <>
      <Search
        placeholder="Buscar..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <section className="flex gap-1 w-full overflow-y-auto no-scrollbar">
        {tags.map((category) => (
          <Pill
            key={category}
            label={category}
            selected={selectedCategory === category}
            onClick={() => setSelectedCategory(selectedCategory === category  ? null : category)}
          />
        ))}
      </section>
    </>
  );
};

export default Filtros;
