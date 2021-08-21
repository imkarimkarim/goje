import { convertToFloatIfIsNumber } from "../utils";

export default function reducer(state, action) {
  switch (action.type) {
    case "setForm":
      return action.payload;
    case "setarrivalDate":
      return { ...state, arrivalDate: convertToFloatIfIsNumber(action.payload) };
    case "setowner":
      return { ...state, owner: action.payload1, ownerId: action.payload2 };
    case "setPlaque":
      return { ...state, plaque: action.payload };
    case "setbasculeWeight":
      return {
        ...state,
        basculeWeight: convertToFloatIfIsNumber(action.payload),
      };
    case "setunload":
      return { ...state, unload: convertToFloatIfIsNumber(action.payload) };
    case "setcommission":
      return { ...state, commission: convertToFloatIfIsNumber(action.payload) };
    case "setportage":
      return { ...state, portage: convertToFloatIfIsNumber(action.payload) };
    case "addProduct":
      return { ...state, products: [...state.products, action.payload] };
    case "editProduct":
      if (action.payload1 && action.payload1.length > 3) {
        state.products.splice(action.payload0, 1, {
          customeId: action.payload1,
          productName: action.payload5,
          signHint: action.payload6,
          amount: convertToFloatIfIsNumber(action.payload2),
          weight: convertToFloatIfIsNumber(action.payload3),
          price: convertToFloatIfIsNumber(action.payload4),
        });
      } else {
        state.products.splice(action.payload0, 1, {
          productName: action.payload5,
          signHint: action.payload6,
          amount: convertToFloatIfIsNumber(action.payload2),
          weight: convertToFloatIfIsNumber(action.payload3),
          price: convertToFloatIfIsNumber(action.payload4),
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
      return { ...state, cash: convertToFloatIfIsNumber(action.payload) };
    case "setPs":
      return { ...state, ps: action.payload };
    default:
      return state;
  }
}
