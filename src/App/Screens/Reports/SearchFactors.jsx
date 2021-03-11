import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
const { ipcRenderer } = require("electron");
import List from "@material-ui/core/List";
import SearchResultItem from "../../Components/SearchResultItem.jsx";
import Loading from "../../Components/Loading.jsx";
import Nav from "../../Components/Nav.jsx";
import SearchBox from "../../Components/SearchBox.jsx";
import JDate from 'jalali-date';

const oneMonth = 2419200000;

const defalutSearchState = {
  text: "",
  checked1: true,
  checked2: true,
  fromm: Date.now() - oneMonth,
  till: Date.now()
};

export default function SearchProducts() {
  const [factors, setFactors] = useState(false);
  const [searchState, setSearchState] = useState(defalutSearchState);
  const init = useRef(true);
  
  const handleNewSearch = (newSearchState) => {
    setSearchState(newSearchState);
    searchFactors(newSearchState);
  }

  const searchFactors = (newSearchState) => {
    ipcRenderer.send("search-factors", newSearchState);
  };
  
  useEffect(() => {
    if (init.current) {
      searchFactors(defalutSearchState);
      init.current = false;
    }
    
    ipcRenderer.on("search-factors", (event, findedFactors) => {
      setFactors(findedFactors);
    });

    // clean up
    return () => {
      ipcRenderer.removeAllListeners("search-factors");
    };
  });

  let resultsList;
  let filteredFactors;
  if (factors) {
    filteredFactors = factors;
    if(searchState.text.length > 0){
      filteredFactors = factors.filter((p) => (p.productName+' '+p.owner).includes(searchState.text));
    }
    resultsList = filteredFactors.map((product) => {
      let tmpShowDate = new JDate(new Date(product.arrivalDate));
      let arrivalDate = tmpShowDate.format("dddd DD MMMM YYYY");
      return (
        <Link
          key={product.customeId}
          to={`/productReports/${product.customeId}`}
        >
          <SearchResultItem
            itemTitle={product.productName + ' ' + product.owner}
            titleHint={arrivalDate + '   ' + product.customeId}
            customeId={product.customeId}
          />
        </Link>
      );
    });
  }

  return (
    <div>
      <Nav title="/گزارش گیری/صافی ها" />
      <SearchBox
        defaultState={searchState}
        onSubmit={(newSearchState) => {handleNewSearch(newSearchState)}}
        label1="صافی های باز"
        label2="صافی های بسته"
        placeholder='مثال: آناناس پلنگ صورتی'
      />
    {factors ? <List>{resultsList}</List> : <Loading />}
    </div>
  );
}
