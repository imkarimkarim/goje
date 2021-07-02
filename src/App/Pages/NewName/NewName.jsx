import React from 'react'
import NewCustomer from '../../Components/Name/NewCustomer.jsx';
import NewProductOwner from '../../Components/Name/NewProductOwner.jsx';
import "./NewName.css";

const NewName = (props) => {
  return (
    <div className="NewName goje-container">
      <NewCustomer />
      <div className="gap"></div>
      <NewProductOwner />
    </div>
  )
}

export default NewName;
