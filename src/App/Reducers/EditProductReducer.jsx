import { convertToFloatIfIsNumber } from "../utils";

export default function reducer(state, action) {
  switch (action.type) {
    case "setForm":
      return action.payload;
    case "setproductName":
      return { ...state, productName: action.payload };
    case "setowner":
      return { ...state, owner: action.payload1, ownerId: action.payload2 };
    case "setbasculeWeight":
      return {
        ...state,
        basculeWeight: convertToFloatIfIsNumber(action.payload),
      };
    case "setamount":
      return { ...state, amount: convertToFloatIfIsNumber(action.payload) };
    case "setarrivalDate":
      return { ...state, arrivalDate: convertToFloatIfIsNumber(action.payload) };
    case "setcommission":
      return { ...state, commission: convertToFloatIfIsNumber(action.payload) };
    case "setunload":
      return { ...state, unload: convertToFloatIfIsNumber(action.payload) };
    case "setportage":
      return { ...state, portage: convertToFloatIfIsNumber(action.payload) };
    case "setcash":
      return { ...state, cash: convertToFloatIfIsNumber(action.payload) };
    case "setPlaque":
      return { ...state, plaque: action.payload };
    case "toggleIsProductFinish":
      return {
        ...state,
        isProductFinish: !state.isProductFinish,
        finishDate: Date.now(),
      };
    case "setPs":
      return { ...state, ps: action.payload };

    default:
      return state;
  }
}
