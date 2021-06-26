export default function reducer(state, action) {
  switch (action.type) {
    case "setForm":
      return action.payload;
    case "setOwner":
      return { ...state, owner: action.payload1, ownerName: action.payload2 };
    case "setIsPayed":
      return { ...state, isPayed: action.payload };
    case "setFactorDate":
      return { ...state, factorDate: action.payload };
    case "setChangeDate":
      return { ...state, changeDate: action.payload };
    case "addProduct":
      return {
        ...state,
        products: [
          ...state.products,
          {
            productId: action.payload1,
            productName: action.payload5,
            amount: action.payload2,
            weight: action.payload3,
            price: action.payload4,
          },
        ],
      };
    case "removeProduct":
      state.products.splice(action.payload, 1);
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
            date: action.payload1,
            amount: action.payload2,
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
