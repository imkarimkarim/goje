import { convertToFloatIfIsNumber } from "../utils";

export default function reducer(state, action) {
  switch (action.type) {
    case "setForm":
      return action.payload;
    case "setOwner":
      return { ...state, owner: action.payload1, ownerName: action.payload2 };
    case "setIsPayed":
      return { ...state, isPayed: action.payload };
    case "setFactorDate":
      return { ...state, factorDate: convertToFloatIfIsNumber(action.payload) };
    case "setChangeDate":
      return { ...state, changeDate: convertToFloatIfIsNumber(action.payload) };
    case "addProduct":
      return {
        ...state,
        products: [
          ...state.products,
          {
            productId: action.payload1,
            productName: action.payload5,
            amount: convertToFloatIfIsNumber(action.payload2),
            weight: convertToFloatIfIsNumber(action.payload3),
            price: convertToFloatIfIsNumber(action.payload4),
          },
        ],
      };
    case "removeProduct":
      state.products.splice(action.payload, 1);
      return {
        ...state,
        products: state.products,
      };
    case "editProduct":
      state.products.splice(action.payload0, 1, {
        productId: action.payload1,
        productName: action.payload5,
        amount: convertToFloatIfIsNumber(action.payload2),
        weight: convertToFloatIfIsNumber(action.payload3),
        price: convertToFloatIfIsNumber(action.payload4),
      });
      return {
        ...state,
        products: state.products,
      };
    case "addPay":
      return {
        ...state,
        pays: [
          ...state.pays,
          {
            date: convertToFloatIfIsNumber(action.payload1),
            amount: convertToFloatIfIsNumber(action.payload2),
          },
        ],
      };
    case "removePay":
      state.pays.splice(action.payload, 1);
      return {
        ...state,
        pays: state.pays,
      };
    default:
      return state;
  }
}
