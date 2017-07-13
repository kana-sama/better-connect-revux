const hasOwn = Object.prototype.hasOwnProperty;

function is(x, y) {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    return x !== x && y !== y;
  }
}

function shallowEqual(objA, objB) {
  if (is(objA, objB)) return true;
  if (
    typeof objA !== "object" ||
    objA === null ||
    typeof objB !== "object" ||
    objB === null
  ) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  for (let i = 0; i < keysA.length; i++) {
    if (!hasOwn.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
}

const defaultMapStateToProps = () => null;
const defaultMapDispatchToProps = () => null;

export default function connect(
  mapStateToProps = defaultMapStateToProps,
  mapDispatchToProps = defaultMapDispatchToProps
) {
  return component => {
    return {
      name: `connect-${component.name}`,
      mixins: [component],
      inject: ["$$store"],

      data() {
        const attrs = { ...this.$attrs };

        Object.assign(attrs, mapStateToProps(this.$$store.getState(), attrs));
        Object.assign(attrs, mapDispatchToProps(this.$$store.dispatch, attrs));

        return { ...attrs };
      },

      created() {
        const select = state => mapStateToProps(state, this.$attrs);

        const observeStore = (store, select, onChange) => {
          let currentState = select(store.getState());

          return store.subscribe(() => {
            const nextState = select(store.getState());

            if (!shallowEqual(currentState, nextState)) {
              const previousState = currentState;
              currentState = nextState;

              onChange(currentState, previousState);
            }
          });
        };

        this._unsubscribe = observeStore(this.$$store, select, newState => {
          const attrs = { ...this.$attrs, ...newState };
          const newHandlers = mapDispatchToProps(this.$$store.dispatch, attrs);

          Object.keys(newState).forEach(key => {
            this.$set(this, key, newState[key]);
          });

          Object.keys(newHandlers).forEach(key => {
            this.$set(this, key, newHandlers[key]);
          });
        });
      },

      beforeDestroy() {
        this._unsubscribe();
      }
    };
  };
}
