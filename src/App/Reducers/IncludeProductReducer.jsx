import { convertToIntIfIsNumber } from '../utils';

export default function reducer(state, action) {
  switch (action.type) {
    case "setForm":
      return action.payload;
    case "setproductName":
      return { ...state, productName: action.payload };
    case "setowner":
      return { ...state, owner: action.payload };
    case "setbasculeWeight":
      return { ...state, basculeWeight: convertToIntIfIsNumber(action.payload) };
    case "setamount":
      return { ...state, amount: convertToIntIfIsNumber(action.payload) };
    case "setarrivalDate":
      return { ...state, arrivalDate: convertToIntIfIsNumber(action.payload) };
    case "setcommission":
      return { ...state, commission: convertToIntIfIsNumber(action.payload) };
    case "setunload":
      return { ...state, unload: convertToIntIfIsNumber(action.payload) };
    case "setportage":
      return { ...state, portage: convertToIntIfIsNumber(action.payload) };
    case "setcash":
      return { ...state, cash: convertToIntIfIsNumber(action.payload) };
    case "setPlaque":
      return { ...state, plaque: convertToIntIfIsNumber(action.payload) };
    case "setPs":
      return { ...state, ps: action.payload };
    default:
      return state;
  }
}
