import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import SearchFormReset from "@/components/SearchFormReset";

const SearchForm = ({ query }: { query?: string }) => {
  return (
    <form action="/" method="GET" className="search-form">
      <input
        name="query"
        defaultValue={query || ""}
        className="search-input"
        placeholder="Search Startup"
        autoComplete="off"
      />

      <div className="flex gap-2">
        {query && <SearchFormReset />}

        <Button type="submit" className="search-btn">
          <Search className="size-5 text-white" />
        </Button>
      </div>
    </form>
  );
};

export default SearchForm;
