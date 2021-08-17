import { convertToIntIfIsNumber } from "../utils";

export default function reducer(state, action) {
  switch (action.type) {
    case "setForm":
      return action.payload;
    case "setarrivalDate":
      return { ...state, arrivalDate: convertToIntIfIsNumber(action.payload) };
    case "setowner":
      return { ...state, owner: action.payload1, ownerId: action.payload2 };
    case "setPlaque":
      return { ...state, plaque: action.payload };
    case "setbasculeWeight":
      return {
        ...state,
        basculeWeight: convertToIntIfIsNumber(action.payload),
      };
    case "setunload":
      return { ...state, unload: convertToIntIfIsNumber(action.payload) };
    case "setcommission":
      return { ...state, commission: convertToIntIfIsNumber(action.payload) };
    case "setportage":
      return { ...state, portage: convertToIntIfIsNumber(action.payload) };
    case "addProduct":
      return { ...state, products: [...state.products, action.payload] };
    case "editProduct":
      if (action.payload1) {
        state.products.splice(action.payload0, 1, {
          productId: action.payload1,
          productName: action.payload5,
          signHint: action.payload6,
          amount: convertToIntIfIsNumber(action.payload2),
          weight: convertToIntIfIsNumber(action.payload3),
          price: convertToIntIfIsNumber(action.payload4),
        });
      } else {
        state.products.splice(action.payload0, 1, {
          productName: action.payload5,
          signHint: action.payload6,
          amount: convertToIntIfIsNumber(action.payload2),
          weight: convertToIntIfIsNumber(action.payload3),
          price: convertToIntIfIsNumber(action.payload4),
        });
      }

      return {
        ...state,
        products: state.products,
      };
    case "removeProduct":
      // if payload is id
      if (action.payload.toString().length >= 4) {
        state.products = state.products.filter(
          (p) => p.customeId !== action.payload
        );
      } else {
        state.products.splice(action.payload, 1);
      }
      return {
        ...state,
        products: state.products,
      };
    case "setcash":
      return { ...state, cash: convertToIntIfIsNumber(action.payload) };
    case "setPs":
      return { ...state, ps: action.payload };
    default:
      return state;
  }
}
