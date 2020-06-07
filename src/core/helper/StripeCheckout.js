import React, { useState, useEffect } from 'react';
import { isAuthenticated } from '../../auth/helper';
import { cartEmpty, loadCart } from './cartHelper';
import { Link } from 'react-router-dom';
import StripeCheckOut from 'react-stripe-checkout';
import { API } from '../../backend';
import { createOrder } from './orderHelper';

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
  const makePayment = (token) => {
    const body = {
      token,
      products,
    };
    const headers = {
      'Content-Type': 'application/json',
    };
    fetch(`${API}/stripePayment`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })
      .then((response) => {
        console.log(response);
        const { status } = require(response);
        console.log('STATUS', status);
       // cartEmpty();
      })
      .catch((err) => console.log(err));
  };

  const showStripeButton = () => {
    return isAuthenticated() ? (
      <StripeCheckOut
        stripeKey="pk_test_51GrMwNHWj5wEAALnR0FqtCdlPGHgQD9H62lnhpIOXQRhOVIuNuRp5qyM2L81IAnACyN3YbzNpf6uMReMTefOpZFx00FNrY2Xts"
        token={makePayment}
        amount={getFinalAmount() * 100}
        name="Buy Item"
        shippingAddress
        billingAddress
      >
        <button className="btn btn-success">Pay with Stripe</button>
      </StripeCheckOut>
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
