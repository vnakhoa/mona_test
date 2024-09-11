import { combineReducers } from '@reduxjs/toolkit';
import cartReducer from './slides/cartSlice';

const rootReducer = combineReducers({
  cart: cartReducer,
});

export default rootReducer;
