import connect from "../connect";
import { createStructuredSelector } from "reselect";

import { inc, dec } from "../store/counter/actions";
import { getCounter } from "../store/counter/selectors";

import Counter from "../components/Counter";

const mapStateToProps = createStructuredSelector({
  value: getCounter
});

const mapDispatchToProps = (dispatch, props) => ({
  onDecButtonClick() {
    dispatch(dec());
  },

  onIncButtonClick() {
    dispatch(inc());
  },

  onDoubleButtonClick() {
    // For test
    dispatch({ type: inc().type, payload: { value: props.value } });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
