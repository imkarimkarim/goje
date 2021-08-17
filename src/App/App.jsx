import React, { useRef, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Welcome from "./Pages/Welcome/Welcome.jsx";
import Container from "@material-ui/core/Container";
import IncludeCar from "./Pages/Car/IncludeCar.jsx";
import NewFactor from "./Pages/Factor/NewFactor.jsx";
import NewName from "./Pages/NewName/NewName.jsx";
import Reports from "./Pages/Reports/Reports.jsx";
import Product from "./Pages/Product/Product.jsx";
import Car from "./Pages/Car/Car.jsx";
import Factor from "./Pages/Factor/Factor.jsx";
import SearchProducts from "./Pages/Reports/SearchProducts.jsx";
import SearchFactors from "./Pages/Reports/SearchFactors.jsx";
import SearchCars from "./Pages/Reports/SearchCars.jsx";
import PrintRemainingProducts from "./Pages/Reports/PrintRemainingProducts.jsx";
import EditFactor from "./Pages/Factor/EditFactor.jsx";
import EditProduct from "./Pages/Product/EditProduct.jsx";
import EditCar from "./Pages/Car/EditCar.jsx";
import PrintProducts from "./Pages/Reports/PrintProducts.jsx";
import PrintCar from "./Pages/Reports/PrintCar.jsx";
import PrintFactors from "./Pages/Reports/PrintFactors.jsx";
import ProductDetails from "./Pages/Product/ProductDetails.jsx";
import { NotifProvider } from "./Contexts/NotifContext.jsx";
import Notif from "./Components/Notif.jsx";

export default function App() {
  const redirectToIndex = useRef(true);

  useEffect(() => {
    if (redirectToIndex.current) {
      redirectToIndex.current = false;
    }
  });

  return (
    <Router>
      {/* redirect to /welcome in first load */}
      {redirectToIndex.current ? <Redirect to="/reports" /> : <div></div>}
      <Container>
        <Switch>
          <NotifProvider>
            <Notif />
            <Route path="/welcome" component={Welcome} />
            <Route path="/includeCar" component={IncludeCar} />
            <Route path="/newFactor" component={NewFactor} />
            <Route path="/newName" component={NewName} />
            <Route path="/reports" component={Reports} />
            <Route path="/searchProducts" component={SearchProducts} />
            <Route path="/searchCars" component={SearchCars} />
            <Route path="/searchFactors" component={SearchFactors} />
            <Route path="/product/:id" component={Product} />
            <Route path="/car/:id" component={Car} />
            <Route path="/factor/:id" component={Factor} />
            <Route path="/editFactor/:id" component={EditFactor} />
            <Route path="/editProduct/:id" component={EditProduct} />
            <Route path="/editCar/:id" component={EditCar} />
            <Route path="/printProducts/:ids" component={PrintProducts} />
            <Route path="/printCar/:id" component={PrintCar} />
            <Route path="/printFactors/:date/:date2" component={PrintFactors} />
            <Route path="/productDetails/:id" component={ProductDetails} />
            <Route
              path="/printRemainingProducts"
              component={PrintRemainingProducts}
            />
          </NotifProvider>
        </Switch>
      </Container>
    </Router>
  );
}
