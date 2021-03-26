import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
const { ipcRenderer } = require("electron");
import List from "@material-ui/core/List";
import SearchResultItem from "../../Components/SearchResultItem.jsx";
import Loading from "../../Components/Loading.jsx";
import Nav from "../../Components/Nav.jsx";
import SearchBox from "../../Components/SearchBox.jsx";
import JDate from 'jalali-date';
import ShowDate from '../../Components/ShowDate.jsx';

const oneDay = 86400000;

const defalutSearchState = {
  text: "",
  checked1: true,
  checked2: true,
  fromm: Date.now() - oneDay,
  till: Date.now()
};

export default function SearchFactors() {
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
  filteredFactors = factors;
  if (factors) {
    if(searchState.text.length > 0){
      filteredFactors = factors.filter((f) => f.ownerName === searchState.text);
    }
    resultsList = filteredFactors.map((factor) => {
      return (
        <div
          key={factor.customeId}
        >
          <SearchResultItem
            itemTitle={factor.ownerName}
            titleHint={<ShowDate timestamp={factor.factorDate} />}
            customeId={factor.customeId}
            to={`/factor/${factor.customeId}`}
          />
      </div>
      );
    });
  }

  return (
    <div>
      <Nav title="/گزارشات/جستجوی فاکتور" />
      <SearchBox
        defaultState={searchState}
        onSubmit={(newSearchState) => {handleNewSearch(newSearchState)}}
        label1="نقدی"
        label2="نسیه"
        placeholder='مثال:‌‌ آرسن لوپین'
      />
    {factors ? <div><p className='hint'>{`${factors.length} فاکتور پیدا شد.`}</p><List>{resultsList}</List></div> : <Loading />}
    </div>
  );
}
