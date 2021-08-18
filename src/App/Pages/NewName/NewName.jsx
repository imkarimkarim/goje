import React from "react";
import NewCustomer from "../../Components/Name/NewCustomer.jsx";
import NewProductOwner from "../../Components/Name/NewProductOwner.jsx";
import "./NewName.css";
import Nav from "../../Components/Nav.jsx";

const NewName = ({ history }) => {
  return (
    <div className="NewName goje-container">
      <Nav history={history} />
      <NewCustomer />
      <div className="gap"></div>
      <NewProductOwner />
    </div>
  );
};

export default NewName;
