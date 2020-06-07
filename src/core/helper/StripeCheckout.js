import React, { useState, useEffect } from 'react';
import { isAuthenticated } from '../../auth/helper';
import { cartEmpty, loadCart } from './cartHelper';
import { Link } from 'react-router-dom';

const StripeCheckout = ({
  products,
  setReload = (f) => f,
  reload = undefined,
}) => {
  const [data, setData] = useState({
    loading: false,
    success: false,
    error: '',
    address: '',
  });

  const token = isAuthenticated() && isAuthenticated().token;
  const userId = isAuthenticated() && isAuthenticated().user._id;

  const getFinalAmount = () => {
    let amount = 0;
    products.map((p) => {
      amount = amount + p.price;
    });
    return amount;
  };

  const showStripeButton = () => {
    return isAuthenticated() ? (
      <button className="btn btn-success">Pay with Stripe</button>
    ) : (
      <Link to="/signin">
        <button className="btn btn-warning">Sign In</button>
      </Link>
    );
  };

  return (
    <div>
      <h2 className="text-success">Stripe Checkout {getFinalAmount()} </h2>
      {showStripeButton()}
    </div>
  );
};
export default StripeCheckout;
