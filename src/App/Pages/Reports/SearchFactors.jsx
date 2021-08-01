import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
const { ipcRenderer } = require("electron");
import List from "@material-ui/core/List";
import DoneIcon from '@material-ui/icons/Done';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import CloseIcon from '@material-ui/icons/Close';
import SearchResultItem from "../../Components/Report/SearchResultItem.jsx";
import Loading from "../../Components/Loading.jsx";
import Nav from "../../Components/Nav.jsx";
import SearchBox from "../../Components/Report/SearchBox.jsx";
import JDate from 'jalali-date';
import ShowDate from '../../Components/ShowDate.jsx';
import {cleanTime, oneDay, oneWeek} from '../../utils.js';

const defalutSearchState = {
  text: "",
  checked1: true,
  checked2: true,
  fromm: cleanTime(Date.now()) - oneWeek,
  till: cleanTime(Date.now()) + oneDay
};

export default function SearchFactors() {
  const [factors, setFactors] = useState(false);
  const [searchState, setSearchState] = useState(defalutSearchState);
  const init = useRef(true);

  const handleNewSearch = (newSearchState) => {
    setSearchState(newSearchState);
    searchInFactors(newSearchState);
  }

  const searchInFactors = (newSearchState) => {
    ipcRenderer.send("searchInFactors", newSearchState);
  };

  useEffect(() => {
    if (init.current) {
      searchInFactors(defalutSearchState);
      init.current = false;
    }

    ipcRenderer.on("searchInFactors", (event, findedFactors) => {
      setFactors(findedFactors);
    });

    // clean up
    return () => {
      ipcRenderer.removeAllListeners("searchInFactors");
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
      let tmpTitleHint;
      if(factor.isPayed === true){
         tmpTitleHint = <span><ShowDate timestamp={factor.factorDate} /> <DoneIcon style={{ color: 'blue' }}/></span>;
      }
      else if(factor.isPayed === false){
        tmpTitleHint = <span><ShowDate timestamp={factor.factorDate} /> <CloseIcon style={{ color: 'red' }}/></span>
      }
      else if(factor.isPayed === 'receipt') {
        tmpTitleHint = <span><ShowDate timestamp={factor.factorDate} /> <DoneAllIcon style={{ color: 'green' }}/></span>
      }
      return (
        <div
          key={factor.customeId}
        >
          <SearchResultItem
            itemTitle={factor.ownerName}
            titleHint={tmpTitleHint}
            customeId={factor.customeId}
            to={`/factor/${factor.customeId}`}
          />
      </div>
      );
    });
  }

  return (
    <div>
      <Nav/>
      <SearchBox
        defaultState={searchState}
        onSubmit={(newSearchState) => {handleNewSearch(newSearchState)}}
        label1="نقدی"
        label2="نسیه"
        placeholder='نام مشتری'
        searchForCustomers={true}
      />
    {factors ? <div><p className='hint'>{`${resultsList.length} فاکتور پیدا شد.`}</p><List>{resultsList}</List></div> : <Loading />}
    <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
    </div>
  );
}
