import { List } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useRef } from "react";
const { ipcRenderer } = require("electron");
import Nav from "../../Components/Nav.jsx";
import SearchBox from "../../Components/Report/SearchBox.jsx";
import SearchResultItem from "../../Components/Report/SearchResultItem.jsx";

export default function SearchProductOwners({ history }) {
  const init = useRef(true);
  const [allProductOwners, setAllProductOwners] = useState();
  const [search, setSearch] = useState(false);

  const getAllProductOwners = () => {
    ipcRenderer.send("getAllProductOwners");
  };

  const handleSearchSubmit = (newSearch) => {
    setSearch(newSearch.text);
  };

  useEffect(() => {
    if (init.current) {
      getAllProductOwners();
      init.current = false;
    }

    ipcRenderer.on("getAllProductOwners", (event, dbProductOwners) => {
      setAllProductOwners(dbProductOwners);
    });

    // clean up
    return () => {
      ipcRenderer.removeAllListeners("getAllProductOwners");
    };
  });

  let resultsList;
  if (allProductOwners && allProductOwners.length > 0) {
    let tmpProductOwners = allProductOwners;
    if (search) {
      tmpProductOwners = allProductOwners.filter((po) =>
        po.name.includes(search)
      );
    }
    resultsList = tmpProductOwners.map((productOwner) => {
      return (
        <div key={productOwner.customeId}>
          <SearchResultItem
            itemTitle={productOwner.name}
            customeId={productOwner.customeId}
            to={`/productOwner/${productOwner.customeId}`}
          />
        </div>
      );
    });
  }

  return (
    <div>
      <Nav history={history} />
      <SearchBox
        onSubmit={(newSearchState) => {
          handleSearchSubmit(newSearchState);
        }}
      />
      {resultsList ? <List>{resultsList}</List> : <></>}
    </div>
  );
}
