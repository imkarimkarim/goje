export default function reducer(state, action) {
  switch (action.type) {
    case "setForm":
      return action.payload;
    case "setproductName":
      return { ...state, productName: action.payload };
    case "setowner":
      return { ...state, owner: action.payload };
    case "setbasculeWeight":
      return { ...state, basculeWeight: action.payload };
    case "setamount":
      return { ...state, amount: action.payload };
    case "setarrivalDate":
      return { ...state, arrivalDate: action.payload };
    case "setcommission":
      return { ...state, commission: action.payload };
    case "setunload":
      return { ...state, unload: action.payload };
    case "setportage":
      return { ...state, portage: action.payload };
    case "setcash":
      return { ...state, cash: action.payload };
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
