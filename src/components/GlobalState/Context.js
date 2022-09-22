import React, { createContext, useReducer } from "react";
import reducer from "./reducer";
import axios from "axios";
//initial state for this app
let initialState = {
  products: [],
  categories: [],
  cart: [],
  featureProducts:[]
};
//create a context
let ProductsContext = createContext();
const Context = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  // add product into the cart
  let grabProduct = async (id) => {
    let res = await axios.get(`https://goandgrab.herokuapp.com/products/${id}`);
    if (res.status === 200) {
      let product = res.data.product;
      dispatch({ type: "ADD_TO_CART", payload: { ...product, quantity: 1 } });
    }
  };
  // increment product quantity
  let incrementQuantity = (id) => {
    let cart = state.cart.map((product) => {
      if (product._id == id) {
        return {
          ...product,
          quantity: product.quantity + 1,
        };
      } else {
        return {
          ...product,
        };
      }
    });
    dispatch({ type: "INCREMENT_QUANTITY", payload: cart });
  };
  //decrement the product quantity
  let decrementQuantity = (id) => {
    let cart = state.cart.map((product) => {
      if (product._id == id) {
        return {
          ...product,
          quantity: product.quantity - 1,
        };
      } else {
        return {
          ...product,
        };
      }
    });
    dispatch({ type: "DECREMENT_QUANTITY", payload: cart });
  };
  //remove the product from the cart
  let removeCartItem = (id) => {
    let cart = state.cart.filter((product) => {
      return product._id != id;
    });
    dispatch({ type: "REMOVE_CART_ITEM", payload: cart });
  };
  //filterProducts
  let filterProducts = async (filter) => {
    try {
      let res = await axios.get("https://goandgrab.herokuapp.com/products");
      if (res.status === 200) {
        let products = res.data.products;
        if (filter === "all") {
          dispatch({ type: "SET_PRODUCTS", payload: products });
        } else {
          let filterProducts = products.filter((product) => {
            return product.category === filter;
          });
          dispatch({ type: "SET_PRODUCTS", payload: filterProducts });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <ProductsContext.Provider
      value={{
        ...state,
        dispatch,
        grabProduct,
        incrementQuantity,
        decrementQuantity,
        removeCartItem,
        filterProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export default Context;
export { ProductsContext };
