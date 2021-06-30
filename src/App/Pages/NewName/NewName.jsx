import React from 'react'
import NewCustomer from '../../Components/Name/NewCustomer.jsx';
import NewProductOwner from '../../Components/Name/NewProductOwner.jsx';
import "./NewName.css";

// TODO: newProductOwner
// TODO: character limit on input and validator
// TODO: fix ui issue in فاکتور های نسیه پرینت
// TODO:   margin-top: auto;
  // margin-bottom: auto;
  // width: 100%;
  // height: 100vh;
  // justify-content: center;
  // align-items: center;
  // display: flex;
  // flex-direction: column;
  // forall

const NewName = (props) => {
  return (
    <div className="NewName">
      <NewCustomer />
      <div className="gap"></div>
      <NewProductOwner />
    </div>
  )
}

export default NewName;
