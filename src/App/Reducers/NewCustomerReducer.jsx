export default function reducer(state, action) {
  switch (action.type) {
    case "setForm":
      return action.payload;
    case "setName":
      return { ...state, name: action.payload };
    default:
      return state;
  }
}
