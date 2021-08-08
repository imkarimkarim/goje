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
    case "removeProduct":
      state.products.splice(action.payload, 1);
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
