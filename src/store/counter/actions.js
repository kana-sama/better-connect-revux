import { ADD } from "./constants";

export const inc = () => ({
  type: ADD,
  payload: { value: 1 }
});

export const dec = () => ({
  type: ADD,
  payload: { value: -1 }
});
