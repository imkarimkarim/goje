import { convertToIntIfIsNumber } from '../utils';

export default function reducer(state, action) {
  switch (action.type) {
    case "setForm":
      return action.payload;
    case "setName":
      return { ...state, name: action.payload };
    case "setPaysNumber":
      return { ...state, payNumber: action.payload };
    case "setDefaultCommission":
      return { ...state, defaultCommission: convertToIntIfIsNumber(action.payload) };
    default:
      return state;
  }
}
