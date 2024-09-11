import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: [],
  total: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addProductToCart: (state, action) => {
      const existingProduct = state.cart.find((item) => item.id === action.payload.id);

      if (existingProduct) {
        const newState = state.cart.map(item => {
          if (item.id === action.payload.id) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        })
        state.cart = newState;
      } else {
        state.cart.push({ ...action.payload, quantity: 1 });
      }
      state.total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },

    updateProductQuantity: (state, action) => {
      const product = state.cart.find((item) => item.id === action.payload.id);
      if (product) {
        const newState = state.cart.map(item => {
          if (item.id === action.payload.id) {
            return { ...item, quantity: action.payload.quantity };
          }
          return item;
        })
        state.cart = newState;
      }
      state.total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },

    updateProductPrice: (state, action) => {
      const product = state.cart.find((item) => item.id === action.payload.id);
      if (product) {
        const newState = state.cart.map(item => {
          if (item.id === action.payload.id) {
            return { ...item, price: action.payload.price }
          }
          return item;
        })
        state.cart = newState;
      }
      state.total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },

    removeProductFromCart: (state, action) => {
      const product = state.cart.find((item) => item.id === action.payload);
      if (product) {
        const newState = state.cart.filter((item) => item.id !== action.payload);
        state.cart = newState;
      }
      state.total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },

    removeAllCart: (state) => {
      state.total = 0;
      state.cart = [];
    }
  },
});

export const { addProductToCart, updateProductQuantity, updateProductPrice, removeProductFromCart, removeAllCart } = cartSlice.actions;
export default cartSlice.reducer;
