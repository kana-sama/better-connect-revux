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

export default (
  mapStateToProps = defaultMapStateToProps,
  mapDispatchToProps = defaultMapDispatchToProps
) => Component => ({
  name: `connect-${Component.name}`,
  mixins: [Component],
  inject: ["$$store"],

  data() {
    const attrs = { ...this.$attrs };

    Object.assign(attrs, mapStateToProps(this.$$store.getState(), attrs));
    Object.assign(attrs, mapDispatchToProps(this.$$store.dispatch, attrs));

    return attrs;
  },

  created() {
    const getProps = () =>
      mapStateToProps(this.$$store.getState(), this.$attrs);

    const getHandlers = props =>
      mapDispatchToProps(this.$$store.dispatch, { ...this.$attrs, ...props });

    let currentProps = getProps();

    this._unsubscribe = this.$$store.subscribe(() => {
      const newProps = getProps();

      if (!shallowEqual(currentProps, newProps)) {
        Object.assign(this, newProps, getHandlers(newProps));

        currentProps = newProps;
      }
    });
  },

  beforeDestroy() {
    this._unsubscribe();
  }
});
