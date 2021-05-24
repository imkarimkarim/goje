import React, {useRef, useEffect} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import Welcome from './Pages/Welcome/Welcome.jsx';
import Container from '@material-ui/core/Container';
import IncludeProduct from './Pages/Product/IncludeProduct.jsx';
import NewFactor from './Pages/Factor/NewFactor.jsx';
import NewName from './Pages/NewName/NewName.jsx';
import Reports from './Pages/Reports/Reports.jsx';
import Product from './Pages/Product/Product.jsx';
import Factor from './Pages/Factor/Factor.jsx';
import SearchProducts from './Pages/Reports/SearchProducts.jsx';
import SearchFactors from './Pages/Reports/SearchFactors.jsx';
import PrintRemainingProducts from './Pages/Reports/PrintRemainingProducts.jsx';
import EditFactor from './Pages/Factor/EditFactor.jsx';
import EditProduct from './Pages/Product/EditProduct.jsx';
import PrintProducts from './Pages/Reports/PrintProducts.jsx';
import PrintFactors from './Pages/Reports/PrintFactors.jsx';
import ProductDetails from './Pages/Product/ProductDetails.jsx';

export default function App() {

  const redirectToIndex = useRef(true);

  useEffect(() => {
    if (redirectToIndex.current) {
      redirectToIndex.current = false;
    }
  });

  return (
    <Router>

      {/* redirect to / in first load */}
      {
        (redirectToIndex.current)
          ? <Redirect to='/welcome'/>
          : <div></div>
      }
      <Container>
          <Switch>
            <Route path='/welcome' component={Welcome} />
            <Route path='/includeProduct' component={IncludeProduct} />
            <Route path='/newFactor' component={NewFactor} />
            <Route path='/newName' component={NewName} />
            <Route path='/reports' component={Reports} />
            <Route path='/searchProducts' component={SearchProducts} />
            <Route path='/searchFactors' component={SearchFactors} />
            <Route path='/product/:id' component={Product} />
            <Route path='/factor/:id' component={Factor} />
            <Route path='/editFactor/:id' component={EditFactor} />
            <Route path='/editProduct/:id' component={EditProduct} />
            <Route path='/printProducts/:ids' component={PrintProducts} />
            <Route path='/printFactors/:date/:date2' component={PrintFactors} />
            <Route path='/productDetails/:id' component={ProductDetails} />
            <Route path='/printRemainingProducts' component={PrintRemainingProducts} />
          </Switch>
      </Container>
    </Router>
  );
}
