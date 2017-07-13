import { ADD } from "./constants";

export default function counter(state = 0, action) {
  switch (action.type) {
    case ADD: {
      const { value } = action.payload;

      return state + value;
    }

    default: {
      return state;
    }
  }
}
