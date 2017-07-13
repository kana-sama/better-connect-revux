import Vue from "vue";
import revux from "revux";

import store from "./store";

import Counter from "./containers/Counter";

Vue.use(revux);

new Vue({
  el: "#app-main",

  components: {
    Counter
  },

  data() {
    return {
      store
    };
  }
});
