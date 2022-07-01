const scriptRel = function detectScriptRel() {
  const relList = document.createElement("link").relList;
  return relList && relList.supports && relList.supports("modulepreload") ? "modulepreload" : "preload";
}();
const seen = {};
const base = "/";
const __vitePreload = function preload(baseModule, deps) {
  if (!deps || deps.length === 0) {
    return baseModule();
  }
  return Promise.all(deps.map((dep) => {
    dep = `${base}${dep}`;
    if (dep in seen)
      return;
    seen[dep] = true;
    const isCss = dep.endsWith(".css");
    const cssSelector = isCss ? '[rel="stylesheet"]' : "";
    if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
      return;
    }
    const link = document.createElement("link");
    link.rel = isCss ? "stylesheet" : scriptRel;
    if (!isCss) {
      link.as = "script";
      link.crossOrigin = "";
    }
    link.href = dep;
    document.head.appendChild(link);
    if (isCss) {
      return new Promise((res, rej) => {
        link.addEventListener("load", res);
        link.addEventListener("error", () => rej(new Error(`Unable to preload CSS for ${dep}`)));
      });
    }
  })).then(() => baseModule());
};
function makeMap(str, expectsLowerCase) {
  const map = /* @__PURE__ */ Object.create(null);
  const list = str.split(",");
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? (val) => !!map[val.toLowerCase()] : (val) => !!map[val];
}
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
function includeBooleanAttr(value) {
  return !!value || value === "";
}
function normalizeStyle(value) {
  if (isArray(value)) {
    const res = {};
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString(value)) {
    return value;
  } else if (isObject$1(value)) {
    return value;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:(.+)/;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function normalizeClass(value) {
  let res = "";
  if (isString(value)) {
    res = value;
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject$1(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
const toDisplayString = (val) => {
  return isString(val) ? val : val == null ? "" : isArray(val) || isObject$1(val) && (val.toString === objectToString || !isFunction(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (val && val.__v_isRef) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val2]) => {
        entries[`${key} =>`] = val2;
        return entries;
      }, {})
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()]
    };
  } else if (isObject$1(val) && !isArray(val) && !isPlainObject(val)) {
    return String(val);
  }
  return val;
};
const EMPTY_OBJ = {};
const EMPTY_ARR = [];
const NOOP = () => {
};
const NO = () => false;
const onRE = /^on[^a-z]/;
const isOn = (key) => onRE.test(key);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend = Object.assign;
const remove = (arr, el) => {
  const i = arr.indexOf(el);
  if (i > -1) {
    arr.splice(i, 1);
  }
};
const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty.call(val, key);
const isArray = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject$1 = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return isObject$1(val) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted");
const cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
const capitalize = cacheStringFunction((str) => str.charAt(0).toUpperCase() + str.slice(1));
const toHandlerKey = cacheStringFunction((str) => str ? `on${capitalize(str)}` : ``);
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns = (fns, arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](arg);
  }
};
const def = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value
  });
};
const toNumber = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
};
let _globalThis;
const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
};
let activeEffectScope;
class EffectScope {
  constructor(detached = false) {
    this.active = true;
    this.effects = [];
    this.cleanups = [];
    if (!detached && activeEffectScope) {
      this.parent = activeEffectScope;
      this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(this) - 1;
    }
  }
  run(fn) {
    if (this.active) {
      const currentEffectScope = activeEffectScope;
      try {
        activeEffectScope = this;
        return fn();
      } finally {
        activeEffectScope = currentEffectScope;
      }
    }
  }
  on() {
    activeEffectScope = this;
  }
  off() {
    activeEffectScope = this.parent;
  }
  stop(fromParent) {
    if (this.active) {
      let i, l;
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].stop();
      }
      for (i = 0, l = this.cleanups.length; i < l; i++) {
        this.cleanups[i]();
      }
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].stop(true);
        }
      }
      if (this.parent && !fromParent) {
        const last = this.parent.scopes.pop();
        if (last && last !== this) {
          this.parent.scopes[this.index] = last;
          last.index = this.index;
        }
      }
      this.active = false;
    }
  }
}
function effectScope(detached) {
  return new EffectScope(detached);
}
function recordEffectScope(effect, scope = activeEffectScope) {
  if (scope && scope.active) {
    scope.effects.push(effect);
  }
}
const createDep = (effects) => {
  const dep = new Set(effects);
  dep.w = 0;
  dep.n = 0;
  return dep;
};
const wasTracked = (dep) => (dep.w & trackOpBit) > 0;
const newTracked = (dep) => (dep.n & trackOpBit) > 0;
const initDepMarkers = ({ deps }) => {
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].w |= trackOpBit;
    }
  }
};
const finalizeDepMarkers = (effect) => {
  const { deps } = effect;
  if (deps.length) {
    let ptr = 0;
    for (let i = 0; i < deps.length; i++) {
      const dep = deps[i];
      if (wasTracked(dep) && !newTracked(dep)) {
        dep.delete(effect);
      } else {
        deps[ptr++] = dep;
      }
      dep.w &= ~trackOpBit;
      dep.n &= ~trackOpBit;
    }
    deps.length = ptr;
  }
};
const targetMap = /* @__PURE__ */ new WeakMap();
let effectTrackDepth = 0;
let trackOpBit = 1;
const maxMarkerBits = 30;
let activeEffect;
const ITERATE_KEY = Symbol("");
const MAP_KEY_ITERATE_KEY = Symbol("");
class ReactiveEffect {
  constructor(fn, scheduler = null, scope) {
    this.fn = fn;
    this.scheduler = scheduler;
    this.active = true;
    this.deps = [];
    this.parent = void 0;
    recordEffectScope(this, scope);
  }
  run() {
    if (!this.active) {
      return this.fn();
    }
    let parent = activeEffect;
    let lastShouldTrack = shouldTrack;
    while (parent) {
      if (parent === this) {
        return;
      }
      parent = parent.parent;
    }
    try {
      this.parent = activeEffect;
      activeEffect = this;
      shouldTrack = true;
      trackOpBit = 1 << ++effectTrackDepth;
      if (effectTrackDepth <= maxMarkerBits) {
        initDepMarkers(this);
      } else {
        cleanupEffect(this);
      }
      return this.fn();
    } finally {
      if (effectTrackDepth <= maxMarkerBits) {
        finalizeDepMarkers(this);
      }
      trackOpBit = 1 << --effectTrackDepth;
      activeEffect = this.parent;
      shouldTrack = lastShouldTrack;
      this.parent = void 0;
      if (this.deferStop) {
        this.stop();
      }
    }
  }
  stop() {
    if (activeEffect === this) {
      this.deferStop = true;
    } else if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}
function cleanupEffect(effect) {
  const { deps } = effect;
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect);
    }
    deps.length = 0;
  }
}
let shouldTrack = true;
const trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function track(target2, type, key) {
  if (shouldTrack && activeEffect) {
    let depsMap = targetMap.get(target2);
    if (!depsMap) {
      targetMap.set(target2, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = createDep());
    }
    trackEffects(dep);
  }
}
function trackEffects(dep, debuggerEventExtraInfo) {
  let shouldTrack2 = false;
  if (effectTrackDepth <= maxMarkerBits) {
    if (!newTracked(dep)) {
      dep.n |= trackOpBit;
      shouldTrack2 = !wasTracked(dep);
    }
  } else {
    shouldTrack2 = !dep.has(activeEffect);
  }
  if (shouldTrack2) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
  }
}
function trigger$1(target2, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target2);
  if (!depsMap) {
    return;
  }
  let deps = [];
  if (type === "clear") {
    deps = [...depsMap.values()];
  } else if (key === "length" && isArray(target2)) {
    depsMap.forEach((dep, key2) => {
      if (key2 === "length" || key2 >= newValue) {
        deps.push(dep);
      }
    });
  } else {
    if (key !== void 0) {
      deps.push(depsMap.get(key));
    }
    switch (type) {
      case "add":
        if (!isArray(target2)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target2)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if (isIntegerKey(key)) {
          deps.push(depsMap.get("length"));
        }
        break;
      case "delete":
        if (!isArray(target2)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target2)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        }
        break;
      case "set":
        if (isMap(target2)) {
          deps.push(depsMap.get(ITERATE_KEY));
        }
        break;
    }
  }
  if (deps.length === 1) {
    if (deps[0]) {
      {
        triggerEffects(deps[0]);
      }
    }
  } else {
    const effects = [];
    for (const dep of deps) {
      if (dep) {
        effects.push(...dep);
      }
    }
    {
      triggerEffects(createDep(effects));
    }
  }
}
function triggerEffects(dep, debuggerEventExtraInfo) {
  const effects = isArray(dep) ? dep : [...dep];
  for (const effect of effects) {
    if (effect.computed) {
      triggerEffect(effect);
    }
  }
  for (const effect of effects) {
    if (!effect.computed) {
      triggerEffect(effect);
    }
  }
}
function triggerEffect(effect, debuggerEventExtraInfo) {
  if (effect !== activeEffect || effect.allowRecurse) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}
const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol));
const get = /* @__PURE__ */ createGetter();
const shallowGet = /* @__PURE__ */ createGetter(false, true);
const readonlyGet = /* @__PURE__ */ createGetter(true);
const arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
function createArrayInstrumentations() {
  const instrumentations = {};
  ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
    instrumentations[key] = function(...args) {
      const arr = toRaw(this);
      for (let i = 0, l = this.length; i < l; i++) {
        track(arr, "get", i + "");
      }
      const res = arr[key](...args);
      if (res === -1 || res === false) {
        return arr[key](...args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
    instrumentations[key] = function(...args) {
      pauseTracking();
      const res = toRaw(this)[key].apply(this, args);
      resetTracking();
      return res;
    };
  });
  return instrumentations;
}
function createGetter(isReadonly2 = false, shallow = false) {
  return function get2(target2, key, receiver) {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_isShallow") {
      return shallow;
    } else if (key === "__v_raw" && receiver === (isReadonly2 ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target2)) {
      return target2;
    }
    const targetIsArray = isArray(target2);
    if (!isReadonly2 && targetIsArray && hasOwn(arrayInstrumentations, key)) {
      return Reflect.get(arrayInstrumentations, key, receiver);
    }
    const res = Reflect.get(target2, key, receiver);
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly2) {
      track(target2, "get", key);
    }
    if (shallow) {
      return res;
    }
    if (isRef(res)) {
      return targetIsArray && isIntegerKey(key) ? res : res.value;
    }
    if (isObject$1(res)) {
      return isReadonly2 ? readonly(res) : reactive(res);
    }
    return res;
  };
}
const set = /* @__PURE__ */ createSetter();
const shallowSet = /* @__PURE__ */ createSetter(true);
function createSetter(shallow = false) {
  return function set2(target2, key, value, receiver) {
    let oldValue = target2[key];
    if (isReadonly(oldValue) && isRef(oldValue) && !isRef(value)) {
      return false;
    }
    if (!shallow && !isReadonly(value)) {
      if (!isShallow(value)) {
        value = toRaw(value);
        oldValue = toRaw(oldValue);
      }
      if (!isArray(target2) && isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      }
    }
    const hadKey = isArray(target2) && isIntegerKey(key) ? Number(key) < target2.length : hasOwn(target2, key);
    const result = Reflect.set(target2, key, value, receiver);
    if (target2 === toRaw(receiver)) {
      if (!hadKey) {
        trigger$1(target2, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger$1(target2, "set", key, value);
      }
    }
    return result;
  };
}
function deleteProperty(target2, key) {
  const hadKey = hasOwn(target2, key);
  target2[key];
  const result = Reflect.deleteProperty(target2, key);
  if (result && hadKey) {
    trigger$1(target2, "delete", key, void 0);
  }
  return result;
}
function has(target2, key) {
  const result = Reflect.has(target2, key);
  if (!isSymbol(key) || !builtInSymbols.has(key)) {
    track(target2, "has", key);
  }
  return result;
}
function ownKeys(target2) {
  track(target2, "iterate", isArray(target2) ? "length" : ITERATE_KEY);
  return Reflect.ownKeys(target2);
}
const mutableHandlers = {
  get,
  set,
  deleteProperty,
  has,
  ownKeys
};
const readonlyHandlers = {
  get: readonlyGet,
  set(target2, key) {
    return true;
  },
  deleteProperty(target2, key) {
    return true;
  }
};
const shallowReactiveHandlers = /* @__PURE__ */ extend({}, mutableHandlers, {
  get: shallowGet,
  set: shallowSet
});
const toShallow = (value) => value;
const getProto = (v) => Reflect.getPrototypeOf(v);
function get$1(target2, key, isReadonly2 = false, isShallow2 = false) {
  target2 = target2["__v_raw"];
  const rawTarget = toRaw(target2);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (key !== rawKey) {
      track(rawTarget, "get", key);
    }
    track(rawTarget, "get", rawKey);
  }
  const { has: has2 } = getProto(rawTarget);
  const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
  if (has2.call(rawTarget, key)) {
    return wrap(target2.get(key));
  } else if (has2.call(rawTarget, rawKey)) {
    return wrap(target2.get(rawKey));
  } else if (target2 !== rawTarget) {
    target2.get(key);
  }
}
function has$1(key, isReadonly2 = false) {
  const target2 = this["__v_raw"];
  const rawTarget = toRaw(target2);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (key !== rawKey) {
      track(rawTarget, "has", key);
    }
    track(rawTarget, "has", rawKey);
  }
  return key === rawKey ? target2.has(key) : target2.has(key) || target2.has(rawKey);
}
function size$1(target2, isReadonly2 = false) {
  target2 = target2["__v_raw"];
  !isReadonly2 && track(toRaw(target2), "iterate", ITERATE_KEY);
  return Reflect.get(target2, "size", target2);
}
function add(value) {
  value = toRaw(value);
  const target2 = toRaw(this);
  const proto = getProto(target2);
  const hadKey = proto.has.call(target2, value);
  if (!hadKey) {
    target2.add(value);
    trigger$1(target2, "add", value, value);
  }
  return this;
}
function set$1(key, value) {
  value = toRaw(value);
  const target2 = toRaw(this);
  const { has: has2, get: get2 } = getProto(target2);
  let hadKey = has2.call(target2, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target2, key);
  }
  const oldValue = get2.call(target2, key);
  target2.set(key, value);
  if (!hadKey) {
    trigger$1(target2, "add", key, value);
  } else if (hasChanged(value, oldValue)) {
    trigger$1(target2, "set", key, value);
  }
  return this;
}
function deleteEntry(key) {
  const target2 = toRaw(this);
  const { has: has2, get: get2 } = getProto(target2);
  let hadKey = has2.call(target2, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target2, key);
  }
  get2 ? get2.call(target2, key) : void 0;
  const result = target2.delete(key);
  if (hadKey) {
    trigger$1(target2, "delete", key, void 0);
  }
  return result;
}
function clear() {
  const target2 = toRaw(this);
  const hadItems = target2.size !== 0;
  const result = target2.clear();
  if (hadItems) {
    trigger$1(target2, "clear", void 0, void 0);
  }
  return result;
}
function createForEach(isReadonly2, isShallow2) {
  return function forEach(callback, thisArg) {
    const observed = this;
    const target2 = observed["__v_raw"];
    const rawTarget = toRaw(target2);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
    return target2.forEach((value, key) => {
      return callback.call(thisArg, wrap(value), wrap(key), observed);
    });
  };
}
function createIterableMethod(method, isReadonly2, isShallow2) {
  return function(...args) {
    const target2 = this["__v_raw"];
    const rawTarget = toRaw(target2);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target2[method](...args);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
    return {
      next() {
        const { value, done } = innerIterator.next();
        return done ? { value, done } : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done
        };
      },
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    return type === "delete" ? false : this;
  };
}
function createInstrumentations() {
  const mutableInstrumentations2 = {
    get(key) {
      return get$1(this, key);
    },
    get size() {
      return size$1(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
  };
  const shallowInstrumentations2 = {
    get(key) {
      return get$1(this, key, false, true);
    },
    get size() {
      return size$1(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
  };
  const readonlyInstrumentations2 = {
    get(key) {
      return get$1(this, key, true);
    },
    get size() {
      return size$1(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, false)
  };
  const shallowReadonlyInstrumentations2 = {
    get(key) {
      return get$1(this, key, true, true);
    },
    get size() {
      return size$1(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, true)
  };
  const iteratorMethods = ["keys", "values", "entries", Symbol.iterator];
  iteratorMethods.forEach((method) => {
    mutableInstrumentations2[method] = createIterableMethod(method, false, false);
    readonlyInstrumentations2[method] = createIterableMethod(method, true, false);
    shallowInstrumentations2[method] = createIterableMethod(method, false, true);
    shallowReadonlyInstrumentations2[method] = createIterableMethod(method, true, true);
  });
  return [
    mutableInstrumentations2,
    readonlyInstrumentations2,
    shallowInstrumentations2,
    shallowReadonlyInstrumentations2
  ];
}
const [mutableInstrumentations, readonlyInstrumentations, shallowInstrumentations, shallowReadonlyInstrumentations] = /* @__PURE__ */ createInstrumentations();
function createInstrumentationGetter(isReadonly2, shallow) {
  const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
  return (target2, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_raw") {
      return target2;
    }
    return Reflect.get(hasOwn(instrumentations, key) && key in target2 ? instrumentations : target2, key, receiver);
  };
}
const mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
const reactiveMap = /* @__PURE__ */ new WeakMap();
const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
const readonlyMap = /* @__PURE__ */ new WeakMap();
const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive(target2) {
  if (isReadonly(target2)) {
    return target2;
  }
  return createReactiveObject(target2, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
}
function shallowReactive(target2) {
  return createReactiveObject(target2, false, shallowReactiveHandlers, shallowCollectionHandlers, shallowReactiveMap);
}
function readonly(target2) {
  return createReactiveObject(target2, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
}
function createReactiveObject(target2, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject$1(target2)) {
    return target2;
  }
  if (target2["__v_raw"] && !(isReadonly2 && target2["__v_isReactive"])) {
    return target2;
  }
  const existingProxy = proxyMap.get(target2);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = getTargetType(target2);
  if (targetType === 0) {
    return target2;
  }
  const proxy = new Proxy(target2, targetType === 2 ? collectionHandlers : baseHandlers);
  proxyMap.set(target2, proxy);
  return proxy;
}
function isReactive(value) {
  if (isReadonly(value)) {
    return isReactive(value["__v_raw"]);
  }
  return !!(value && value["__v_isReactive"]);
}
function isReadonly(value) {
  return !!(value && value["__v_isReadonly"]);
}
function isShallow(value) {
  return !!(value && value["__v_isShallow"]);
}
function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}
function toRaw(observed) {
  const raw = observed && observed["__v_raw"];
  return raw ? toRaw(raw) : observed;
}
function markRaw(value) {
  def(value, "__v_skip", true);
  return value;
}
const toReactive = (value) => isObject$1(value) ? reactive(value) : value;
const toReadonly = (value) => isObject$1(value) ? readonly(value) : value;
function trackRefValue(ref2) {
  if (shouldTrack && activeEffect) {
    ref2 = toRaw(ref2);
    {
      trackEffects(ref2.dep || (ref2.dep = createDep()));
    }
  }
}
function triggerRefValue(ref2, newVal) {
  ref2 = toRaw(ref2);
  if (ref2.dep) {
    {
      triggerEffects(ref2.dep);
    }
  }
}
function isRef(r) {
  return !!(r && r.__v_isRef === true);
}
function ref(value) {
  return createRef(value, false);
}
function shallowRef(value) {
  return createRef(value, true);
}
function createRef(rawValue, shallow) {
  if (isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}
class RefImpl {
  constructor(value, __v_isShallow) {
    this.__v_isShallow = __v_isShallow;
    this.dep = void 0;
    this.__v_isRef = true;
    this._rawValue = __v_isShallow ? value : toRaw(value);
    this._value = __v_isShallow ? value : toReactive(value);
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newVal) {
    newVal = this.__v_isShallow ? newVal : toRaw(newVal);
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal;
      this._value = this.__v_isShallow ? newVal : toReactive(newVal);
      triggerRefValue(this);
    }
  }
}
function unref(ref2) {
  return isRef(ref2) ? ref2.value : ref2;
}
const shallowUnwrapHandlers = {
  get: (target2, key, receiver) => unref(Reflect.get(target2, key, receiver)),
  set: (target2, key, value, receiver) => {
    const oldValue = target2[key];
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value;
      return true;
    } else {
      return Reflect.set(target2, key, value, receiver);
    }
  }
};
function proxyRefs(objectWithRefs) {
  return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
class ObjectRefImpl {
  constructor(_object, _key, _defaultValue) {
    this._object = _object;
    this._key = _key;
    this._defaultValue = _defaultValue;
    this.__v_isRef = true;
  }
  get value() {
    const val = this._object[this._key];
    return val === void 0 ? this._defaultValue : val;
  }
  set value(newVal) {
    this._object[this._key] = newVal;
  }
}
function toRef(object, key, defaultValue) {
  const val = object[key];
  return isRef(val) ? val : new ObjectRefImpl(object, key, defaultValue);
}
class ComputedRefImpl {
  constructor(getter, _setter, isReadonly2, isSSR) {
    this._setter = _setter;
    this.dep = void 0;
    this.__v_isRef = true;
    this._dirty = true;
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true;
        triggerRefValue(this);
      }
    });
    this.effect.computed = this;
    this.effect.active = this._cacheable = !isSSR;
    this["__v_isReadonly"] = isReadonly2;
  }
  get value() {
    const self2 = toRaw(this);
    trackRefValue(self2);
    if (self2._dirty || !self2._cacheable) {
      self2._dirty = false;
      self2._value = self2.effect.run();
    }
    return self2._value;
  }
  set value(newValue) {
    this._setter(newValue);
  }
}
function computed$1(getterOrOptions, debugOptions, isSSR = false) {
  let getter;
  let setter;
  const onlyGetter = isFunction(getterOrOptions);
  if (onlyGetter) {
    getter = getterOrOptions;
    setter = NOOP;
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
  return cRef;
}
function callWithErrorHandling(fn, instance, type, args) {
  let res;
  try {
    res = args ? fn(...args) : fn();
  } catch (err) {
    handleError$1(err, instance, type);
  }
  return res;
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
  if (isFunction(fn)) {
    const res = callWithErrorHandling(fn, instance, type, args);
    if (res && isPromise(res)) {
      res.catch((err) => {
        handleError$1(err, instance, type);
      });
    }
    return res;
  }
  const values = [];
  for (let i = 0; i < fn.length; i++) {
    values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
  }
  return values;
}
function handleError$1(err, instance, type, throwInDev = true) {
  const contextVNode = instance ? instance.vnode : null;
  if (instance) {
    let cur = instance.parent;
    const exposedInstance = instance.proxy;
    const errorInfo = type;
    while (cur) {
      const errorCapturedHooks = cur.ec;
      if (errorCapturedHooks) {
        for (let i = 0; i < errorCapturedHooks.length; i++) {
          if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }
      cur = cur.parent;
    }
    const appErrorHandler = instance.appContext.config.errorHandler;
    if (appErrorHandler) {
      callWithErrorHandling(appErrorHandler, null, 10, [err, exposedInstance, errorInfo]);
      return;
    }
  }
  logError(err, type, contextVNode, throwInDev);
}
function logError(err, type, contextVNode, throwInDev = true) {
  {
    console.error(err);
  }
}
let isFlushing = false;
let isFlushPending = false;
const queue$1 = [];
let flushIndex = 0;
const pendingPreFlushCbs = [];
let activePreFlushCbs = null;
let preFlushIndex = 0;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = /* @__PURE__ */ Promise.resolve();
let currentFlushPromise = null;
let currentPreFlushParentJob = null;
function nextTick(fn) {
  const p2 = currentFlushPromise || resolvedPromise;
  return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
}
function findInsertionIndex(id) {
  let start2 = flushIndex + 1;
  let end = queue$1.length;
  while (start2 < end) {
    const middle = start2 + end >>> 1;
    const middleJobId = getId(queue$1[middle]);
    middleJobId < id ? start2 = middle + 1 : end = middle;
  }
  return start2;
}
function queueJob(job) {
  if ((!queue$1.length || !queue$1.includes(job, isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex)) && job !== currentPreFlushParentJob) {
    if (job.id == null) {
      queue$1.push(job);
    } else {
      queue$1.splice(findInsertionIndex(job.id), 0, job);
    }
    queueFlush();
  }
}
function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function invalidateJob(job) {
  const i = queue$1.indexOf(job);
  if (i > flushIndex) {
    queue$1.splice(i, 1);
  }
}
function queueCb(cb, activeQueue, pendingQueue, index) {
  if (!isArray(cb)) {
    if (!activeQueue || !activeQueue.includes(cb, cb.allowRecurse ? index + 1 : index)) {
      pendingQueue.push(cb);
    }
  } else {
    pendingQueue.push(...cb);
  }
  queueFlush();
}
function queuePreFlushCb(cb) {
  queueCb(cb, activePreFlushCbs, pendingPreFlushCbs, preFlushIndex);
}
function queuePostFlushCb(cb) {
  queueCb(cb, activePostFlushCbs, pendingPostFlushCbs, postFlushIndex);
}
function flushPreFlushCbs(seen2, parentJob = null) {
  if (pendingPreFlushCbs.length) {
    currentPreFlushParentJob = parentJob;
    activePreFlushCbs = [...new Set(pendingPreFlushCbs)];
    pendingPreFlushCbs.length = 0;
    for (preFlushIndex = 0; preFlushIndex < activePreFlushCbs.length; preFlushIndex++) {
      activePreFlushCbs[preFlushIndex]();
    }
    activePreFlushCbs = null;
    preFlushIndex = 0;
    currentPreFlushParentJob = null;
    flushPreFlushCbs(seen2, parentJob);
  }
}
function flushPostFlushCbs(seen2) {
  flushPreFlushCbs();
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)];
    pendingPostFlushCbs.length = 0;
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped);
      return;
    }
    activePostFlushCbs = deduped;
    activePostFlushCbs.sort((a, b) => getId(a) - getId(b));
    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      activePostFlushCbs[postFlushIndex]();
    }
    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}
const getId = (job) => job.id == null ? Infinity : job.id;
function flushJobs(seen2) {
  isFlushPending = false;
  isFlushing = true;
  flushPreFlushCbs(seen2);
  queue$1.sort((a, b) => getId(a) - getId(b));
  const check = NOOP;
  try {
    for (flushIndex = 0; flushIndex < queue$1.length; flushIndex++) {
      const job = queue$1[flushIndex];
      if (job && job.active !== false) {
        if (false)
          ;
        callWithErrorHandling(job, null, 14);
      }
    }
  } finally {
    flushIndex = 0;
    queue$1.length = 0;
    flushPostFlushCbs();
    isFlushing = false;
    currentFlushPromise = null;
    if (queue$1.length || pendingPreFlushCbs.length || pendingPostFlushCbs.length) {
      flushJobs(seen2);
    }
  }
}
let devtools;
let buffer = [];
let devtoolsNotInstalled = false;
function emit$1(event, ...args) {
  if (devtools) {
    devtools.emit(event, ...args);
  } else if (!devtoolsNotInstalled) {
    buffer.push({ event, args });
  }
}
function setDevtoolsHook(hook, target2) {
  var _a, _b;
  devtools = hook;
  if (devtools) {
    devtools.enabled = true;
    buffer.forEach(({ event, args }) => devtools.emit(event, ...args));
    buffer = [];
  } else if (typeof window !== "undefined" && window.HTMLElement && !((_b = (_a = window.navigator) === null || _a === void 0 ? void 0 : _a.userAgent) === null || _b === void 0 ? void 0 : _b.includes("jsdom"))) {
    const replay = target2.__VUE_DEVTOOLS_HOOK_REPLAY__ = target2.__VUE_DEVTOOLS_HOOK_REPLAY__ || [];
    replay.push((newHook) => {
      setDevtoolsHook(newHook, target2);
    });
    setTimeout(() => {
      if (!devtools) {
        target2.__VUE_DEVTOOLS_HOOK_REPLAY__ = null;
        devtoolsNotInstalled = true;
        buffer = [];
      }
    }, 3e3);
  } else {
    devtoolsNotInstalled = true;
    buffer = [];
  }
}
function devtoolsInitApp(app2, version2) {
  emit$1("app:init", app2, version2, {
    Fragment,
    Text,
    Comment,
    Static
  });
}
function devtoolsUnmountApp(app2) {
  emit$1("app:unmount", app2);
}
const devtoolsComponentAdded = /* @__PURE__ */ createDevtoolsComponentHook("component:added");
const devtoolsComponentUpdated = /* @__PURE__ */ createDevtoolsComponentHook("component:updated");
const devtoolsComponentRemoved = /* @__PURE__ */ createDevtoolsComponentHook("component:removed");
function createDevtoolsComponentHook(hook) {
  return (component) => {
    emit$1(hook, component.appContext.app, component.uid, component.parent ? component.parent.uid : void 0, component);
  };
}
function devtoolsComponentEmit(component, event, params) {
  emit$1("component:emit", component.appContext.app, component, event, params);
}
function emit$1$1(instance, event, ...rawArgs) {
  if (instance.isUnmounted)
    return;
  const props = instance.vnode.props || EMPTY_OBJ;
  let args = rawArgs;
  const isModelListener2 = event.startsWith("update:");
  const modelArg = isModelListener2 && event.slice(7);
  if (modelArg && modelArg in props) {
    const modifiersKey = `${modelArg === "modelValue" ? "model" : modelArg}Modifiers`;
    const { number, trim } = props[modifiersKey] || EMPTY_OBJ;
    if (trim) {
      args = rawArgs.map((a) => a.trim());
    }
    if (number) {
      args = rawArgs.map(toNumber);
    }
  }
  {
    devtoolsComponentEmit(instance, event, args);
  }
  let handlerName;
  let handler = props[handlerName = toHandlerKey(event)] || props[handlerName = toHandlerKey(camelize(event))];
  if (!handler && isModelListener2) {
    handler = props[handlerName = toHandlerKey(hyphenate(event))];
  }
  if (handler) {
    callWithAsyncErrorHandling(handler, instance, 6, args);
  }
  const onceHandler = props[handlerName + `Once`];
  if (onceHandler) {
    if (!instance.emitted) {
      instance.emitted = {};
    } else if (instance.emitted[handlerName]) {
      return;
    }
    instance.emitted[handlerName] = true;
    callWithAsyncErrorHandling(onceHandler, instance, 6, args);
  }
}
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.emitsCache;
  const cached = cache.get(comp);
  if (cached !== void 0) {
    return cached;
  }
  const raw = comp.emits;
  let normalized = {};
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendEmits = (raw2) => {
      const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
      if (normalizedFromExtend) {
        hasExtends = true;
        extend(normalized, normalizedFromExtend);
      }
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendEmits);
    }
    if (comp.extends) {
      extendEmits(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendEmits);
    }
  }
  if (!raw && !hasExtends) {
    cache.set(comp, null);
    return null;
  }
  if (isArray(raw)) {
    raw.forEach((key) => normalized[key] = null);
  } else {
    extend(normalized, raw);
  }
  cache.set(comp, normalized);
  return normalized;
}
function isEmitListener(options, key) {
  if (!options || !isOn(key)) {
    return false;
  }
  key = key.slice(2).replace(/Once$/, "");
  return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
}
let currentRenderingInstance = null;
let currentScopeId = null;
function setCurrentRenderingInstance(instance) {
  const prev = currentRenderingInstance;
  currentRenderingInstance = instance;
  currentScopeId = instance && instance.type.__scopeId || null;
  return prev;
}
function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
  if (!ctx)
    return fn;
  if (fn._n) {
    return fn;
  }
  const renderFnWithContext = (...args) => {
    if (renderFnWithContext._d) {
      setBlockTracking(-1);
    }
    const prevInstance = setCurrentRenderingInstance(ctx);
    const res = fn(...args);
    setCurrentRenderingInstance(prevInstance);
    if (renderFnWithContext._d) {
      setBlockTracking(1);
    }
    {
      devtoolsComponentUpdated(ctx);
    }
    return res;
  };
  renderFnWithContext._n = true;
  renderFnWithContext._c = true;
  renderFnWithContext._d = true;
  return renderFnWithContext;
}
function markAttrsAccessed() {
}
function renderComponentRoot(instance) {
  const { type: Component, vnode, proxy, withProxy, props, propsOptions: [propsOptions], slots, attrs, emit: emit2, render, renderCache, data, setupState, ctx, inheritAttrs } = instance;
  let result;
  let fallthroughAttrs;
  const prev = setCurrentRenderingInstance(instance);
  try {
    if (vnode.shapeFlag & 4) {
      const proxyToUse = withProxy || proxy;
      result = normalizeVNode(render.call(proxyToUse, proxyToUse, renderCache, props, setupState, data, ctx));
      fallthroughAttrs = attrs;
    } else {
      const render2 = Component;
      if (false)
        ;
      result = normalizeVNode(render2.length > 1 ? render2(props, false ? {
        get attrs() {
          markAttrsAccessed();
          return attrs;
        },
        slots,
        emit: emit2
      } : { attrs, slots, emit: emit2 }) : render2(props, null));
      fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
    }
  } catch (err) {
    blockStack.length = 0;
    handleError$1(err, instance, 1);
    result = createVNode(Comment);
  }
  let root = result;
  if (fallthroughAttrs && inheritAttrs !== false) {
    const keys = Object.keys(fallthroughAttrs);
    const { shapeFlag } = root;
    if (keys.length) {
      if (shapeFlag & (1 | 6)) {
        if (propsOptions && keys.some(isModelListener)) {
          fallthroughAttrs = filterModelListeners(fallthroughAttrs, propsOptions);
        }
        root = cloneVNode(root, fallthroughAttrs);
      }
    }
  }
  if (vnode.dirs) {
    root = cloneVNode(root);
    root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
  }
  if (vnode.transition) {
    root.transition = vnode.transition;
  }
  {
    result = root;
  }
  setCurrentRenderingInstance(prev);
  return result;
}
const getFunctionalFallthrough = (attrs) => {
  let res;
  for (const key in attrs) {
    if (key === "class" || key === "style" || isOn(key)) {
      (res || (res = {}))[key] = attrs[key];
    }
  }
  return res;
};
const filterModelListeners = (attrs, props) => {
  const res = {};
  for (const key in attrs) {
    if (!isModelListener(key) || !(key.slice(9) in props)) {
      res[key] = attrs[key];
    }
  }
  return res;
};
function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
  const { props: prevProps, children: prevChildren, component } = prevVNode;
  const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
  const emits = component.emitsOptions;
  if (nextVNode.dirs || nextVNode.transition) {
    return true;
  }
  if (optimized && patchFlag >= 0) {
    if (patchFlag & 1024) {
      return true;
    }
    if (patchFlag & 16) {
      if (!prevProps) {
        return !!nextProps;
      }
      return hasPropsChanged(prevProps, nextProps, emits);
    } else if (patchFlag & 8) {
      const dynamicProps = nextVNode.dynamicProps;
      for (let i = 0; i < dynamicProps.length; i++) {
        const key = dynamicProps[i];
        if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
          return true;
        }
      }
    }
  } else {
    if (prevChildren || nextChildren) {
      if (!nextChildren || !nextChildren.$stable) {
        return true;
      }
    }
    if (prevProps === nextProps) {
      return false;
    }
    if (!prevProps) {
      return !!nextProps;
    }
    if (!nextProps) {
      return true;
    }
    return hasPropsChanged(prevProps, nextProps, emits);
  }
  return false;
}
function hasPropsChanged(prevProps, nextProps, emitsOptions) {
  const nextKeys = Object.keys(nextProps);
  if (nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i];
    if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
      return true;
    }
  }
  return false;
}
function updateHOCHostEl({ vnode, parent }, el) {
  while (parent && parent.subTree === vnode) {
    (vnode = parent.vnode).el = el;
    parent = parent.parent;
  }
}
const isSuspense = (type) => type.__isSuspense;
function queueEffectWithSuspense(fn, suspense) {
  if (suspense && suspense.pendingBranch) {
    if (isArray(fn)) {
      suspense.effects.push(...fn);
    } else {
      suspense.effects.push(fn);
    }
  } else {
    queuePostFlushCb(fn);
  }
}
function provide(key, value) {
  if (!currentInstance)
    ;
  else {
    let provides = currentInstance.provides;
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = value;
  }
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
  const instance = currentInstance || currentRenderingInstance;
  if (instance) {
    const provides = instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides;
    if (provides && key in provides) {
      return provides[key];
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance.proxy) : defaultValue;
    } else
      ;
  }
}
function watchEffect(effect, options) {
  return doWatch(effect, null, options);
}
const INITIAL_WATCHER_VALUE = {};
function watch(source, cb, options) {
  return doWatch(source, cb, options);
}
function doWatch(source, cb, { immediate, deep, flush, onTrack, onTrigger } = EMPTY_OBJ) {
  const instance = currentInstance;
  let getter;
  let forceTrigger = false;
  let isMultiSource = false;
  if (isRef(source)) {
    getter = () => source.value;
    forceTrigger = isShallow(source);
  } else if (isReactive(source)) {
    getter = () => source;
    deep = true;
  } else if (isArray(source)) {
    isMultiSource = true;
    forceTrigger = source.some((s) => isReactive(s) || isShallow(s));
    getter = () => source.map((s) => {
      if (isRef(s)) {
        return s.value;
      } else if (isReactive(s)) {
        return traverse(s);
      } else if (isFunction(s)) {
        return callWithErrorHandling(s, instance, 2);
      } else
        ;
    });
  } else if (isFunction(source)) {
    if (cb) {
      getter = () => callWithErrorHandling(source, instance, 2);
    } else {
      getter = () => {
        if (instance && instance.isUnmounted) {
          return;
        }
        if (cleanup) {
          cleanup();
        }
        return callWithAsyncErrorHandling(source, instance, 3, [onCleanup]);
      };
    }
  } else {
    getter = NOOP;
  }
  if (cb && deep) {
    const baseGetter = getter;
    getter = () => traverse(baseGetter());
  }
  let cleanup;
  let onCleanup = (fn) => {
    cleanup = effect.onStop = () => {
      callWithErrorHandling(fn, instance, 4);
    };
  };
  if (isInSSRComponentSetup) {
    onCleanup = NOOP;
    if (!cb) {
      getter();
    } else if (immediate) {
      callWithAsyncErrorHandling(cb, instance, 3, [
        getter(),
        isMultiSource ? [] : void 0,
        onCleanup
      ]);
    }
    return NOOP;
  }
  let oldValue = isMultiSource ? [] : INITIAL_WATCHER_VALUE;
  const job = () => {
    if (!effect.active) {
      return;
    }
    if (cb) {
      const newValue = effect.run();
      if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue)) || false) {
        if (cleanup) {
          cleanup();
        }
        callWithAsyncErrorHandling(cb, instance, 3, [
          newValue,
          oldValue === INITIAL_WATCHER_VALUE ? void 0 : oldValue,
          onCleanup
        ]);
        oldValue = newValue;
      }
    } else {
      effect.run();
    }
  };
  job.allowRecurse = !!cb;
  let scheduler;
  if (flush === "sync") {
    scheduler = job;
  } else if (flush === "post") {
    scheduler = () => queuePostRenderEffect(job, instance && instance.suspense);
  } else {
    scheduler = () => queuePreFlushCb(job);
  }
  const effect = new ReactiveEffect(getter, scheduler);
  if (cb) {
    if (immediate) {
      job();
    } else {
      oldValue = effect.run();
    }
  } else if (flush === "post") {
    queuePostRenderEffect(effect.run.bind(effect), instance && instance.suspense);
  } else {
    effect.run();
  }
  return () => {
    effect.stop();
    if (instance && instance.scope) {
      remove(instance.scope.effects, effect);
    }
  };
}
function instanceWatch(source, value, options) {
  const publicThis = this.proxy;
  const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
  let cb;
  if (isFunction(value)) {
    cb = value;
  } else {
    cb = value.handler;
    options = value;
  }
  const cur = currentInstance;
  setCurrentInstance(this);
  const res = doWatch(getter, cb.bind(publicThis), options);
  if (cur) {
    setCurrentInstance(cur);
  } else {
    unsetCurrentInstance();
  }
  return res;
}
function createPathGetter(ctx, path) {
  const segments = path.split(".");
  return () => {
    let cur = ctx;
    for (let i = 0; i < segments.length && cur; i++) {
      cur = cur[segments[i]];
    }
    return cur;
  };
}
function traverse(value, seen2) {
  if (!isObject$1(value) || value["__v_skip"]) {
    return value;
  }
  seen2 = seen2 || /* @__PURE__ */ new Set();
  if (seen2.has(value)) {
    return value;
  }
  seen2.add(value);
  if (isRef(value)) {
    traverse(value.value, seen2);
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], seen2);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v) => {
      traverse(v, seen2);
    });
  } else if (isPlainObject(value)) {
    for (const key in value) {
      traverse(value[key], seen2);
    }
  }
  return value;
}
function useTransitionState() {
  const state = {
    isMounted: false,
    isLeaving: false,
    isUnmounting: false,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  onMounted(() => {
    state.isMounted = true;
  });
  onBeforeUnmount(() => {
    state.isUnmounting = true;
  });
  return state;
}
const TransitionHookValidator = [Function, Array];
const BaseTransitionImpl = {
  name: `BaseTransition`,
  props: {
    mode: String,
    appear: Boolean,
    persisted: Boolean,
    onBeforeEnter: TransitionHookValidator,
    onEnter: TransitionHookValidator,
    onAfterEnter: TransitionHookValidator,
    onEnterCancelled: TransitionHookValidator,
    onBeforeLeave: TransitionHookValidator,
    onLeave: TransitionHookValidator,
    onAfterLeave: TransitionHookValidator,
    onLeaveCancelled: TransitionHookValidator,
    onBeforeAppear: TransitionHookValidator,
    onAppear: TransitionHookValidator,
    onAfterAppear: TransitionHookValidator,
    onAppearCancelled: TransitionHookValidator
  },
  setup(props, { slots }) {
    const instance = getCurrentInstance();
    const state = useTransitionState();
    let prevTransitionKey;
    return () => {
      const children = slots.default && getTransitionRawChildren(slots.default(), true);
      if (!children || !children.length) {
        return;
      }
      let child = children[0];
      if (children.length > 1) {
        for (const c of children) {
          if (c.type !== Comment) {
            child = c;
            break;
          }
        }
      }
      const rawProps = toRaw(props);
      const { mode } = rawProps;
      if (state.isLeaving) {
        return emptyPlaceholder(child);
      }
      const innerChild = getKeepAliveChild(child);
      if (!innerChild) {
        return emptyPlaceholder(child);
      }
      const enterHooks = resolveTransitionHooks(innerChild, rawProps, state, instance);
      setTransitionHooks(innerChild, enterHooks);
      const oldChild = instance.subTree;
      const oldInnerChild = oldChild && getKeepAliveChild(oldChild);
      let transitionKeyChanged = false;
      const { getTransitionKey } = innerChild.type;
      if (getTransitionKey) {
        const key = getTransitionKey();
        if (prevTransitionKey === void 0) {
          prevTransitionKey = key;
        } else if (key !== prevTransitionKey) {
          prevTransitionKey = key;
          transitionKeyChanged = true;
        }
      }
      if (oldInnerChild && oldInnerChild.type !== Comment && (!isSameVNodeType(innerChild, oldInnerChild) || transitionKeyChanged)) {
        const leavingHooks = resolveTransitionHooks(oldInnerChild, rawProps, state, instance);
        setTransitionHooks(oldInnerChild, leavingHooks);
        if (mode === "out-in") {
          state.isLeaving = true;
          leavingHooks.afterLeave = () => {
            state.isLeaving = false;
            instance.update();
          };
          return emptyPlaceholder(child);
        } else if (mode === "in-out" && innerChild.type !== Comment) {
          leavingHooks.delayLeave = (el, earlyRemove, delayedLeave) => {
            const leavingVNodesCache = getLeavingNodesForType(state, oldInnerChild);
            leavingVNodesCache[String(oldInnerChild.key)] = oldInnerChild;
            el._leaveCb = () => {
              earlyRemove();
              el._leaveCb = void 0;
              delete enterHooks.delayedLeave;
            };
            enterHooks.delayedLeave = delayedLeave;
          };
        }
      }
      return child;
    };
  }
};
const BaseTransition = BaseTransitionImpl;
function getLeavingNodesForType(state, vnode) {
  const { leavingVNodes } = state;
  let leavingVNodesCache = leavingVNodes.get(vnode.type);
  if (!leavingVNodesCache) {
    leavingVNodesCache = /* @__PURE__ */ Object.create(null);
    leavingVNodes.set(vnode.type, leavingVNodesCache);
  }
  return leavingVNodesCache;
}
function resolveTransitionHooks(vnode, props, state, instance) {
  const { appear, mode, persisted = false, onBeforeEnter, onEnter, onAfterEnter, onEnterCancelled, onBeforeLeave, onLeave, onAfterLeave, onLeaveCancelled, onBeforeAppear, onAppear, onAfterAppear, onAppearCancelled } = props;
  const key = String(vnode.key);
  const leavingVNodesCache = getLeavingNodesForType(state, vnode);
  const callHook2 = (hook, args) => {
    hook && callWithAsyncErrorHandling(hook, instance, 9, args);
  };
  const callAsyncHook = (hook, args) => {
    const done = args[1];
    callHook2(hook, args);
    if (isArray(hook)) {
      if (hook.every((hook2) => hook2.length <= 1))
        done();
    } else if (hook.length <= 1) {
      done();
    }
  };
  const hooks = {
    mode,
    persisted,
    beforeEnter(el) {
      let hook = onBeforeEnter;
      if (!state.isMounted) {
        if (appear) {
          hook = onBeforeAppear || onBeforeEnter;
        } else {
          return;
        }
      }
      if (el._leaveCb) {
        el._leaveCb(true);
      }
      const leavingVNode = leavingVNodesCache[key];
      if (leavingVNode && isSameVNodeType(vnode, leavingVNode) && leavingVNode.el._leaveCb) {
        leavingVNode.el._leaveCb();
      }
      callHook2(hook, [el]);
    },
    enter(el) {
      let hook = onEnter;
      let afterHook = onAfterEnter;
      let cancelHook = onEnterCancelled;
      if (!state.isMounted) {
        if (appear) {
          hook = onAppear || onEnter;
          afterHook = onAfterAppear || onAfterEnter;
          cancelHook = onAppearCancelled || onEnterCancelled;
        } else {
          return;
        }
      }
      let called = false;
      const done = el._enterCb = (cancelled) => {
        if (called)
          return;
        called = true;
        if (cancelled) {
          callHook2(cancelHook, [el]);
        } else {
          callHook2(afterHook, [el]);
        }
        if (hooks.delayedLeave) {
          hooks.delayedLeave();
        }
        el._enterCb = void 0;
      };
      if (hook) {
        callAsyncHook(hook, [el, done]);
      } else {
        done();
      }
    },
    leave(el, remove2) {
      const key2 = String(vnode.key);
      if (el._enterCb) {
        el._enterCb(true);
      }
      if (state.isUnmounting) {
        return remove2();
      }
      callHook2(onBeforeLeave, [el]);
      let called = false;
      const done = el._leaveCb = (cancelled) => {
        if (called)
          return;
        called = true;
        remove2();
        if (cancelled) {
          callHook2(onLeaveCancelled, [el]);
        } else {
          callHook2(onAfterLeave, [el]);
        }
        el._leaveCb = void 0;
        if (leavingVNodesCache[key2] === vnode) {
          delete leavingVNodesCache[key2];
        }
      };
      leavingVNodesCache[key2] = vnode;
      if (onLeave) {
        callAsyncHook(onLeave, [el, done]);
      } else {
        done();
      }
    },
    clone(vnode2) {
      return resolveTransitionHooks(vnode2, props, state, instance);
    }
  };
  return hooks;
}
function emptyPlaceholder(vnode) {
  if (isKeepAlive(vnode)) {
    vnode = cloneVNode(vnode);
    vnode.children = null;
    return vnode;
  }
}
function getKeepAliveChild(vnode) {
  return isKeepAlive(vnode) ? vnode.children ? vnode.children[0] : void 0 : vnode;
}
function setTransitionHooks(vnode, hooks) {
  if (vnode.shapeFlag & 6 && vnode.component) {
    setTransitionHooks(vnode.component.subTree, hooks);
  } else if (vnode.shapeFlag & 128) {
    vnode.ssContent.transition = hooks.clone(vnode.ssContent);
    vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
  } else {
    vnode.transition = hooks;
  }
}
function getTransitionRawChildren(children, keepComment = false, parentKey) {
  let ret = [];
  let keyedFragmentCount = 0;
  for (let i = 0; i < children.length; i++) {
    let child = children[i];
    const key = parentKey == null ? child.key : String(parentKey) + String(child.key != null ? child.key : i);
    if (child.type === Fragment) {
      if (child.patchFlag & 128)
        keyedFragmentCount++;
      ret = ret.concat(getTransitionRawChildren(child.children, keepComment, key));
    } else if (keepComment || child.type !== Comment) {
      ret.push(key != null ? cloneVNode(child, { key }) : child);
    }
  }
  if (keyedFragmentCount > 1) {
    for (let i = 0; i < ret.length; i++) {
      ret[i].patchFlag = -2;
    }
  }
  return ret;
}
function defineComponent(options) {
  return isFunction(options) ? { setup: options, name: options.name } : options;
}
const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
function onActivated(hook, target2) {
  registerKeepAliveHook(hook, "a", target2);
}
function onDeactivated(hook, target2) {
  registerKeepAliveHook(hook, "da", target2);
}
function registerKeepAliveHook(hook, type, target2 = currentInstance) {
  const wrappedHook = hook.__wdc || (hook.__wdc = () => {
    let current = target2;
    while (current) {
      if (current.isDeactivated) {
        return;
      }
      current = current.parent;
    }
    return hook();
  });
  injectHook(type, wrappedHook, target2);
  if (target2) {
    let current = target2.parent;
    while (current && current.parent) {
      if (isKeepAlive(current.parent.vnode)) {
        injectToKeepAliveRoot(wrappedHook, type, target2, current);
      }
      current = current.parent;
    }
  }
}
function injectToKeepAliveRoot(hook, type, target2, keepAliveRoot) {
  const injected = injectHook(type, hook, keepAliveRoot, true);
  onUnmounted(() => {
    remove(keepAliveRoot[type], injected);
  }, target2);
}
function injectHook(type, hook, target2 = currentInstance, prepend = false) {
  if (target2) {
    const hooks = target2[type] || (target2[type] = []);
    const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
      if (target2.isUnmounted) {
        return;
      }
      pauseTracking();
      setCurrentInstance(target2);
      const res = callWithAsyncErrorHandling(hook, target2, type, args);
      unsetCurrentInstance();
      resetTracking();
      return res;
    });
    if (prepend) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }
    return wrappedHook;
  }
}
const createHook = (lifecycle) => (hook, target2 = currentInstance) => (!isInSSRComponentSetup || lifecycle === "sp") && injectHook(lifecycle, hook, target2);
const onBeforeMount = createHook("bm");
const onMounted = createHook("m");
const onBeforeUpdate = createHook("bu");
const onUpdated = createHook("u");
const onBeforeUnmount = createHook("bum");
const onUnmounted = createHook("um");
const onServerPrefetch = createHook("sp");
const onRenderTriggered = createHook("rtg");
const onRenderTracked = createHook("rtc");
function onErrorCaptured(hook, target2 = currentInstance) {
  injectHook("ec", hook, target2);
}
function withDirectives(vnode, directives) {
  const internalInstance = currentRenderingInstance;
  if (internalInstance === null) {
    return vnode;
  }
  const instance = getExposeProxy(internalInstance) || internalInstance.proxy;
  const bindings = vnode.dirs || (vnode.dirs = []);
  for (let i = 0; i < directives.length; i++) {
    let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
    if (isFunction(dir)) {
      dir = {
        mounted: dir,
        updated: dir
      };
    }
    if (dir.deep) {
      traverse(value);
    }
    bindings.push({
      dir,
      instance,
      value,
      oldValue: void 0,
      arg,
      modifiers
    });
  }
  return vnode;
}
function invokeDirectiveHook(vnode, prevVNode, instance, name) {
  const bindings = vnode.dirs;
  const oldBindings = prevVNode && prevVNode.dirs;
  for (let i = 0; i < bindings.length; i++) {
    const binding = bindings[i];
    if (oldBindings) {
      binding.oldValue = oldBindings[i].value;
    }
    let hook = binding.dir[name];
    if (hook) {
      pauseTracking();
      callWithAsyncErrorHandling(hook, instance, 8, [
        vnode.el,
        binding,
        vnode,
        prevVNode
      ]);
      resetTracking();
    }
  }
}
const COMPONENTS = "components";
function resolveComponent(name, maybeSelfReference) {
  return resolveAsset(COMPONENTS, name, true, maybeSelfReference) || name;
}
const NULL_DYNAMIC_COMPONENT = Symbol();
function resolveAsset(type, name, warnMissing = true, maybeSelfReference = false) {
  const instance = currentRenderingInstance || currentInstance;
  if (instance) {
    const Component = instance.type;
    if (type === COMPONENTS) {
      const selfName = getComponentName(Component, false);
      if (selfName && (selfName === name || selfName === camelize(name) || selfName === capitalize(camelize(name)))) {
        return Component;
      }
    }
    const res = resolve(instance[type] || Component[type], name) || resolve(instance.appContext[type], name);
    if (!res && maybeSelfReference) {
      return Component;
    }
    return res;
  }
}
function resolve(registry, name) {
  return registry && (registry[name] || registry[camelize(name)] || registry[capitalize(camelize(name))]);
}
function renderList(source, renderItem, cache, index) {
  let ret;
  const cached = cache && cache[index];
  if (isArray(source) || isString(source)) {
    ret = new Array(source.length);
    for (let i = 0, l = source.length; i < l; i++) {
      ret[i] = renderItem(source[i], i, void 0, cached && cached[i]);
    }
  } else if (typeof source === "number") {
    ret = new Array(source);
    for (let i = 0; i < source; i++) {
      ret[i] = renderItem(i + 1, i, void 0, cached && cached[i]);
    }
  } else if (isObject$1(source)) {
    if (source[Symbol.iterator]) {
      ret = Array.from(source, (item, i) => renderItem(item, i, void 0, cached && cached[i]));
    } else {
      const keys = Object.keys(source);
      ret = new Array(keys.length);
      for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i];
        ret[i] = renderItem(source[key], key, i, cached && cached[i]);
      }
    }
  } else {
    ret = [];
  }
  if (cache) {
    cache[index] = ret;
  }
  return ret;
}
const getPublicInstance = (i) => {
  if (!i)
    return null;
  if (isStatefulComponent(i))
    return getExposeProxy(i) || i.proxy;
  return getPublicInstance(i.parent);
};
const publicPropertiesMap = /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
  $: (i) => i,
  $el: (i) => i.vnode.el,
  $data: (i) => i.data,
  $props: (i) => i.props,
  $attrs: (i) => i.attrs,
  $slots: (i) => i.slots,
  $refs: (i) => i.refs,
  $parent: (i) => getPublicInstance(i.parent),
  $root: (i) => getPublicInstance(i.root),
  $emit: (i) => i.emit,
  $options: (i) => resolveMergedOptions(i),
  $forceUpdate: (i) => i.f || (i.f = () => queueJob(i.update)),
  $nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
  $watch: (i) => instanceWatch.bind(i)
});
const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
    let normalizedProps;
    if (key[0] !== "$") {
      const n = accessCache[key];
      if (n !== void 0) {
        switch (n) {
          case 1:
            return setupState[key];
          case 2:
            return data[key];
          case 4:
            return ctx[key];
          case 3:
            return props[key];
        }
      } else if (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) {
        accessCache[key] = 1;
        return setupState[key];
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        accessCache[key] = 2;
        return data[key];
      } else if ((normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)) {
        accessCache[key] = 3;
        return props[key];
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (shouldCacheAccess) {
        accessCache[key] = 0;
      }
    }
    const publicGetter = publicPropertiesMap[key];
    let cssModule, globalProperties;
    if (publicGetter) {
      if (key === "$attrs") {
        track(instance, "get", key);
      }
      return publicGetter(instance);
    } else if ((cssModule = type.__cssModules) && (cssModule = cssModule[key])) {
      return cssModule;
    } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
      accessCache[key] = 4;
      return ctx[key];
    } else if (globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)) {
      {
        return globalProperties[key];
      }
    } else
      ;
  },
  set({ _: instance }, key, value) {
    const { data, setupState, ctx } = instance;
    if (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) {
      setupState[key] = value;
      return true;
    } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
      data[key] = value;
      return true;
    } else if (hasOwn(instance.props, key)) {
      return false;
    }
    if (key[0] === "$" && key.slice(1) in instance) {
      return false;
    } else {
      {
        ctx[key] = value;
      }
    }
    return true;
  },
  has({ _: { data, setupState, accessCache, ctx, appContext, propsOptions } }, key) {
    let normalizedProps;
    return !!accessCache[key] || data !== EMPTY_OBJ && hasOwn(data, key) || setupState !== EMPTY_OBJ && hasOwn(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
  },
  defineProperty(target2, key, descriptor) {
    if (descriptor.get != null) {
      target2._.accessCache[key] = 0;
    } else if (hasOwn(descriptor, "value")) {
      this.set(target2, key, descriptor.value, null);
    }
    return Reflect.defineProperty(target2, key, descriptor);
  }
};
let shouldCacheAccess = true;
function applyOptions(instance) {
  const options = resolveMergedOptions(instance);
  const publicThis = instance.proxy;
  const ctx = instance.ctx;
  shouldCacheAccess = false;
  if (options.beforeCreate) {
    callHook$1(options.beforeCreate, instance, "bc");
  }
  const {
    data: dataOptions,
    computed: computedOptions,
    methods,
    watch: watchOptions,
    provide: provideOptions,
    inject: injectOptions,
    created,
    beforeMount,
    mounted,
    beforeUpdate,
    updated,
    activated,
    deactivated,
    beforeDestroy,
    beforeUnmount,
    destroyed,
    unmounted,
    render,
    renderTracked,
    renderTriggered,
    errorCaptured,
    serverPrefetch,
    expose,
    inheritAttrs,
    components: components2,
    directives,
    filters
  } = options;
  const checkDuplicateProperties = null;
  if (injectOptions) {
    resolveInjections(injectOptions, ctx, checkDuplicateProperties, instance.appContext.config.unwrapInjectedRef);
  }
  if (methods) {
    for (const key in methods) {
      const methodHandler = methods[key];
      if (isFunction(methodHandler)) {
        {
          ctx[key] = methodHandler.bind(publicThis);
        }
      }
    }
  }
  if (dataOptions) {
    const data = dataOptions.call(publicThis, publicThis);
    if (!isObject$1(data))
      ;
    else {
      instance.data = reactive(data);
    }
  }
  shouldCacheAccess = true;
  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = computedOptions[key];
      const get2 = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
      const set2 = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : NOOP;
      const c = computed({
        get: get2,
        set: set2
      });
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c.value,
        set: (v) => c.value = v
      });
    }
  }
  if (watchOptions) {
    for (const key in watchOptions) {
      createWatcher(watchOptions[key], ctx, publicThis, key);
    }
  }
  if (provideOptions) {
    const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
    Reflect.ownKeys(provides).forEach((key) => {
      provide(key, provides[key]);
    });
  }
  if (created) {
    callHook$1(created, instance, "c");
  }
  function registerLifecycleHook(register2, hook) {
    if (isArray(hook)) {
      hook.forEach((_hook) => register2(_hook.bind(publicThis)));
    } else if (hook) {
      register2(hook.bind(publicThis));
    }
  }
  registerLifecycleHook(onBeforeMount, beforeMount);
  registerLifecycleHook(onMounted, mounted);
  registerLifecycleHook(onBeforeUpdate, beforeUpdate);
  registerLifecycleHook(onUpdated, updated);
  registerLifecycleHook(onActivated, activated);
  registerLifecycleHook(onDeactivated, deactivated);
  registerLifecycleHook(onErrorCaptured, errorCaptured);
  registerLifecycleHook(onRenderTracked, renderTracked);
  registerLifecycleHook(onRenderTriggered, renderTriggered);
  registerLifecycleHook(onBeforeUnmount, beforeUnmount);
  registerLifecycleHook(onUnmounted, unmounted);
  registerLifecycleHook(onServerPrefetch, serverPrefetch);
  if (isArray(expose)) {
    if (expose.length) {
      const exposed = instance.exposed || (instance.exposed = {});
      expose.forEach((key) => {
        Object.defineProperty(exposed, key, {
          get: () => publicThis[key],
          set: (val) => publicThis[key] = val
        });
      });
    } else if (!instance.exposed) {
      instance.exposed = {};
    }
  }
  if (render && instance.render === NOOP) {
    instance.render = render;
  }
  if (inheritAttrs != null) {
    instance.inheritAttrs = inheritAttrs;
  }
  if (components2)
    instance.components = components2;
  if (directives)
    instance.directives = directives;
}
function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP, unwrapRef = false) {
  if (isArray(injectOptions)) {
    injectOptions = normalizeInject(injectOptions);
  }
  for (const key in injectOptions) {
    const opt = injectOptions[key];
    let injected;
    if (isObject$1(opt)) {
      if ("default" in opt) {
        injected = inject(opt.from || key, opt.default, true);
      } else {
        injected = inject(opt.from || key);
      }
    } else {
      injected = inject(opt);
    }
    if (isRef(injected)) {
      if (unwrapRef) {
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => injected.value,
          set: (v) => injected.value = v
        });
      } else {
        ctx[key] = injected;
      }
    } else {
      ctx[key] = injected;
    }
  }
}
function callHook$1(hook, instance, type) {
  callWithAsyncErrorHandling(isArray(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy), instance, type);
}
function createWatcher(raw, ctx, publicThis, key) {
  const getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
  if (isString(raw)) {
    const handler = ctx[raw];
    if (isFunction(handler)) {
      watch(getter, handler);
    }
  } else if (isFunction(raw)) {
    watch(getter, raw.bind(publicThis));
  } else if (isObject$1(raw)) {
    if (isArray(raw)) {
      raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
    } else {
      const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
      if (isFunction(handler)) {
        watch(getter, handler, raw);
      }
    }
  } else
    ;
}
function resolveMergedOptions(instance) {
  const base2 = instance.type;
  const { mixins, extends: extendsOptions } = base2;
  const { mixins: globalMixins, optionsCache: cache, config: { optionMergeStrategies } } = instance.appContext;
  const cached = cache.get(base2);
  let resolved;
  if (cached) {
    resolved = cached;
  } else if (!globalMixins.length && !mixins && !extendsOptions) {
    {
      resolved = base2;
    }
  } else {
    resolved = {};
    if (globalMixins.length) {
      globalMixins.forEach((m) => mergeOptions$1(resolved, m, optionMergeStrategies, true));
    }
    mergeOptions$1(resolved, base2, optionMergeStrategies);
  }
  cache.set(base2, resolved);
  return resolved;
}
function mergeOptions$1(to, from, strats, asMixin = false) {
  const { mixins, extends: extendsOptions } = from;
  if (extendsOptions) {
    mergeOptions$1(to, extendsOptions, strats, true);
  }
  if (mixins) {
    mixins.forEach((m) => mergeOptions$1(to, m, strats, true));
  }
  for (const key in from) {
    if (asMixin && key === "expose")
      ;
    else {
      const strat = internalOptionMergeStrats[key] || strats && strats[key];
      to[key] = strat ? strat(to[key], from[key]) : from[key];
    }
  }
  return to;
}
const internalOptionMergeStrats = {
  data: mergeDataFn,
  props: mergeObjectOptions,
  emits: mergeObjectOptions,
  methods: mergeObjectOptions,
  computed: mergeObjectOptions,
  beforeCreate: mergeAsArray,
  created: mergeAsArray,
  beforeMount: mergeAsArray,
  mounted: mergeAsArray,
  beforeUpdate: mergeAsArray,
  updated: mergeAsArray,
  beforeDestroy: mergeAsArray,
  beforeUnmount: mergeAsArray,
  destroyed: mergeAsArray,
  unmounted: mergeAsArray,
  activated: mergeAsArray,
  deactivated: mergeAsArray,
  errorCaptured: mergeAsArray,
  serverPrefetch: mergeAsArray,
  components: mergeObjectOptions,
  directives: mergeObjectOptions,
  watch: mergeWatchOptions,
  provide: mergeDataFn,
  inject: mergeInject
};
function mergeDataFn(to, from) {
  if (!from) {
    return to;
  }
  if (!to) {
    return from;
  }
  return function mergedDataFn() {
    return extend(isFunction(to) ? to.call(this, this) : to, isFunction(from) ? from.call(this, this) : from);
  };
}
function mergeInject(to, from) {
  return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
  if (isArray(raw)) {
    const res = {};
    for (let i = 0; i < raw.length; i++) {
      res[raw[i]] = raw[i];
    }
    return res;
  }
  return raw;
}
function mergeAsArray(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
  return to ? extend(extend(/* @__PURE__ */ Object.create(null), to), from) : from;
}
function mergeWatchOptions(to, from) {
  if (!to)
    return from;
  if (!from)
    return to;
  const merged = extend(/* @__PURE__ */ Object.create(null), to);
  for (const key in from) {
    merged[key] = mergeAsArray(to[key], from[key]);
  }
  return merged;
}
function initProps(instance, rawProps, isStateful, isSSR = false) {
  const props = {};
  const attrs = {};
  def(attrs, InternalObjectKey, 1);
  instance.propsDefaults = /* @__PURE__ */ Object.create(null);
  setFullProps(instance, rawProps, props, attrs);
  for (const key in instance.propsOptions[0]) {
    if (!(key in props)) {
      props[key] = void 0;
    }
  }
  if (isStateful) {
    instance.props = isSSR ? props : shallowReactive(props);
  } else {
    if (!instance.type.props) {
      instance.props = attrs;
    } else {
      instance.props = props;
    }
  }
  instance.attrs = attrs;
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
  const { props, attrs, vnode: { patchFlag } } = instance;
  const rawCurrentProps = toRaw(props);
  const [options] = instance.propsOptions;
  let hasAttrsChanged = false;
  if ((optimized || patchFlag > 0) && !(patchFlag & 16)) {
    if (patchFlag & 8) {
      const propsToUpdate = instance.vnode.dynamicProps;
      for (let i = 0; i < propsToUpdate.length; i++) {
        let key = propsToUpdate[i];
        if (isEmitListener(instance.emitsOptions, key)) {
          continue;
        }
        const value = rawProps[key];
        if (options) {
          if (hasOwn(attrs, key)) {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          } else {
            const camelizedKey = camelize(key);
            props[camelizedKey] = resolvePropValue(options, rawCurrentProps, camelizedKey, value, instance, false);
          }
        } else {
          if (value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
  } else {
    if (setFullProps(instance, rawProps, props, attrs)) {
      hasAttrsChanged = true;
    }
    let kebabKey;
    for (const key in rawCurrentProps) {
      if (!rawProps || !hasOwn(rawProps, key) && ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
        if (options) {
          if (rawPrevProps && (rawPrevProps[key] !== void 0 || rawPrevProps[kebabKey] !== void 0)) {
            props[key] = resolvePropValue(options, rawCurrentProps, key, void 0, instance, true);
          }
        } else {
          delete props[key];
        }
      }
    }
    if (attrs !== rawCurrentProps) {
      for (const key in attrs) {
        if (!rawProps || !hasOwn(rawProps, key) && true) {
          delete attrs[key];
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (hasAttrsChanged) {
    trigger$1(instance, "set", "$attrs");
  }
}
function setFullProps(instance, rawProps, props, attrs) {
  const [options, needCastKeys] = instance.propsOptions;
  let hasAttrsChanged = false;
  let rawCastValues;
  if (rawProps) {
    for (let key in rawProps) {
      if (isReservedProp(key)) {
        continue;
      }
      const value = rawProps[key];
      let camelKey;
      if (options && hasOwn(options, camelKey = camelize(key))) {
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          props[camelKey] = value;
        } else {
          (rawCastValues || (rawCastValues = {}))[camelKey] = value;
        }
      } else if (!isEmitListener(instance.emitsOptions, key)) {
        if (!(key in attrs) || value !== attrs[key]) {
          attrs[key] = value;
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (needCastKeys) {
    const rawCurrentProps = toRaw(props);
    const castValues = rawCastValues || EMPTY_OBJ;
    for (let i = 0; i < needCastKeys.length; i++) {
      const key = needCastKeys[i];
      props[key] = resolvePropValue(options, rawCurrentProps, key, castValues[key], instance, !hasOwn(castValues, key));
    }
  }
  return hasAttrsChanged;
}
function resolvePropValue(options, props, key, value, instance, isAbsent) {
  const opt = options[key];
  if (opt != null) {
    const hasDefault = hasOwn(opt, "default");
    if (hasDefault && value === void 0) {
      const defaultValue = opt.default;
      if (opt.type !== Function && isFunction(defaultValue)) {
        const { propsDefaults } = instance;
        if (key in propsDefaults) {
          value = propsDefaults[key];
        } else {
          setCurrentInstance(instance);
          value = propsDefaults[key] = defaultValue.call(null, props);
          unsetCurrentInstance();
        }
      } else {
        value = defaultValue;
      }
    }
    if (opt[0]) {
      if (isAbsent && !hasDefault) {
        value = false;
      } else if (opt[1] && (value === "" || value === hyphenate(key))) {
        value = true;
      }
    }
  }
  return value;
}
function normalizePropsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.propsCache;
  const cached = cache.get(comp);
  if (cached) {
    return cached;
  }
  const raw = comp.props;
  const normalized = {};
  const needCastKeys = [];
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendProps = (raw2) => {
      hasExtends = true;
      const [props, keys] = normalizePropsOptions(raw2, appContext, true);
      extend(normalized, props);
      if (keys)
        needCastKeys.push(...keys);
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendProps);
    }
    if (comp.extends) {
      extendProps(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendProps);
    }
  }
  if (!raw && !hasExtends) {
    cache.set(comp, EMPTY_ARR);
    return EMPTY_ARR;
  }
  if (isArray(raw)) {
    for (let i = 0; i < raw.length; i++) {
      const normalizedKey = camelize(raw[i]);
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ;
      }
    }
  } else if (raw) {
    for (const key in raw) {
      const normalizedKey = camelize(key);
      if (validatePropName(normalizedKey)) {
        const opt = raw[key];
        const prop = normalized[normalizedKey] = isArray(opt) || isFunction(opt) ? { type: opt } : opt;
        if (prop) {
          const booleanIndex = getTypeIndex(Boolean, prop.type);
          const stringIndex = getTypeIndex(String, prop.type);
          prop[0] = booleanIndex > -1;
          prop[1] = stringIndex < 0 || booleanIndex < stringIndex;
          if (booleanIndex > -1 || hasOwn(prop, "default")) {
            needCastKeys.push(normalizedKey);
          }
        }
      }
    }
  }
  const res = [normalized, needCastKeys];
  cache.set(comp, res);
  return res;
}
function validatePropName(key) {
  if (key[0] !== "$") {
    return true;
  }
  return false;
}
function getType(ctor) {
  const match = ctor && ctor.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ctor === null ? "null" : "";
}
function isSameType(a, b) {
  return getType(a) === getType(b);
}
function getTypeIndex(type, expectedTypes) {
  if (isArray(expectedTypes)) {
    return expectedTypes.findIndex((t) => isSameType(t, type));
  } else if (isFunction(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1;
  }
  return -1;
}
const isInternalKey = (key) => key[0] === "_" || key === "$stable";
const normalizeSlotValue = (value) => isArray(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
const normalizeSlot$1 = (key, rawSlot, ctx) => {
  if (rawSlot._n) {
    return rawSlot;
  }
  const normalized = withCtx((...args) => {
    return normalizeSlotValue(rawSlot(...args));
  }, ctx);
  normalized._c = false;
  return normalized;
};
const normalizeObjectSlots = (rawSlots, slots, instance) => {
  const ctx = rawSlots._ctx;
  for (const key in rawSlots) {
    if (isInternalKey(key))
      continue;
    const value = rawSlots[key];
    if (isFunction(value)) {
      slots[key] = normalizeSlot$1(key, value, ctx);
    } else if (value != null) {
      const normalized = normalizeSlotValue(value);
      slots[key] = () => normalized;
    }
  }
};
const normalizeVNodeSlots = (instance, children) => {
  const normalized = normalizeSlotValue(children);
  instance.slots.default = () => normalized;
};
const initSlots = (instance, children) => {
  if (instance.vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      instance.slots = toRaw(children);
      def(children, "_", type);
    } else {
      normalizeObjectSlots(children, instance.slots = {});
    }
  } else {
    instance.slots = {};
    if (children) {
      normalizeVNodeSlots(instance, children);
    }
  }
  def(instance.slots, InternalObjectKey, 1);
};
const updateSlots = (instance, children, optimized) => {
  const { vnode, slots } = instance;
  let needDeletionCheck = true;
  let deletionComparisonTarget = EMPTY_OBJ;
  if (vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      if (optimized && type === 1) {
        needDeletionCheck = false;
      } else {
        extend(slots, children);
        if (!optimized && type === 1) {
          delete slots._;
        }
      }
    } else {
      needDeletionCheck = !children.$stable;
      normalizeObjectSlots(children, slots);
    }
    deletionComparisonTarget = children;
  } else if (children) {
    normalizeVNodeSlots(instance, children);
    deletionComparisonTarget = { default: 1 };
  }
  if (needDeletionCheck) {
    for (const key in slots) {
      if (!isInternalKey(key) && !(key in deletionComparisonTarget)) {
        delete slots[key];
      }
    }
  }
};
function createAppContext() {
  return {
    app: null,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let uid$1 = 0;
function createAppAPI(render, hydrate) {
  return function createApp2(rootComponent, rootProps = null) {
    if (!isFunction(rootComponent)) {
      rootComponent = Object.assign({}, rootComponent);
    }
    if (rootProps != null && !isObject$1(rootProps)) {
      rootProps = null;
    }
    const context = createAppContext();
    const installedPlugins = /* @__PURE__ */ new Set();
    let isMounted = false;
    const app2 = context.app = {
      _uid: uid$1++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      _context: context,
      _instance: null,
      version,
      get config() {
        return context.config;
      },
      set config(v) {
      },
      use(plugin, ...options) {
        if (installedPlugins.has(plugin))
          ;
        else if (plugin && isFunction(plugin.install)) {
          installedPlugins.add(plugin);
          plugin.install(app2, ...options);
        } else if (isFunction(plugin)) {
          installedPlugins.add(plugin);
          plugin(app2, ...options);
        } else
          ;
        return app2;
      },
      mixin(mixin) {
        {
          if (!context.mixins.includes(mixin)) {
            context.mixins.push(mixin);
          }
        }
        return app2;
      },
      component(name, component) {
        if (!component) {
          return context.components[name];
        }
        context.components[name] = component;
        return app2;
      },
      directive(name, directive) {
        if (!directive) {
          return context.directives[name];
        }
        context.directives[name] = directive;
        return app2;
      },
      mount(rootContainer, isHydrate, isSVG) {
        if (!isMounted) {
          const vnode = createVNode(rootComponent, rootProps);
          vnode.appContext = context;
          if (isHydrate && hydrate) {
            hydrate(vnode, rootContainer);
          } else {
            render(vnode, rootContainer, isSVG);
          }
          isMounted = true;
          app2._container = rootContainer;
          rootContainer.__vue_app__ = app2;
          {
            app2._instance = vnode.component;
            devtoolsInitApp(app2, version);
          }
          return getExposeProxy(vnode.component) || vnode.component.proxy;
        }
      },
      unmount() {
        if (isMounted) {
          render(null, app2._container);
          {
            app2._instance = null;
            devtoolsUnmountApp(app2);
          }
          delete app2._container.__vue_app__;
        }
      },
      provide(key, value) {
        context.provides[key] = value;
        return app2;
      }
    };
    return app2;
  };
}
function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
  if (isArray(rawRef)) {
    rawRef.forEach((r, i) => setRef(r, oldRawRef && (isArray(oldRawRef) ? oldRawRef[i] : oldRawRef), parentSuspense, vnode, isUnmount));
    return;
  }
  if (isAsyncWrapper(vnode) && !isUnmount) {
    return;
  }
  const refValue = vnode.shapeFlag & 4 ? getExposeProxy(vnode.component) || vnode.component.proxy : vnode.el;
  const value = isUnmount ? null : refValue;
  const { i: owner, r: ref2 } = rawRef;
  const oldRef = oldRawRef && oldRawRef.r;
  const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
  const setupState = owner.setupState;
  if (oldRef != null && oldRef !== ref2) {
    if (isString(oldRef)) {
      refs[oldRef] = null;
      if (hasOwn(setupState, oldRef)) {
        setupState[oldRef] = null;
      }
    } else if (isRef(oldRef)) {
      oldRef.value = null;
    }
  }
  if (isFunction(ref2)) {
    callWithErrorHandling(ref2, owner, 12, [value, refs]);
  } else {
    const _isString = isString(ref2);
    const _isRef = isRef(ref2);
    if (_isString || _isRef) {
      const doSet = () => {
        if (rawRef.f) {
          const existing = _isString ? refs[ref2] : ref2.value;
          if (isUnmount) {
            isArray(existing) && remove(existing, refValue);
          } else {
            if (!isArray(existing)) {
              if (_isString) {
                refs[ref2] = [refValue];
                if (hasOwn(setupState, ref2)) {
                  setupState[ref2] = refs[ref2];
                }
              } else {
                ref2.value = [refValue];
                if (rawRef.k)
                  refs[rawRef.k] = ref2.value;
              }
            } else if (!existing.includes(refValue)) {
              existing.push(refValue);
            }
          }
        } else if (_isString) {
          refs[ref2] = value;
          if (hasOwn(setupState, ref2)) {
            setupState[ref2] = value;
          }
        } else if (_isRef) {
          ref2.value = value;
          if (rawRef.k)
            refs[rawRef.k] = value;
        } else
          ;
      };
      if (value) {
        doSet.id = -1;
        queuePostRenderEffect(doSet, parentSuspense);
      } else {
        doSet();
      }
    }
  }
}
const queuePostRenderEffect = queueEffectWithSuspense;
function createRenderer(options) {
  return baseCreateRenderer(options);
}
function baseCreateRenderer(options, createHydrationFns) {
  const target2 = getGlobalThis();
  target2.__VUE__ = true;
  {
    setDevtoolsHook(target2.__VUE_DEVTOOLS_GLOBAL_HOOK__, target2);
  }
  const { insert: hostInsert, remove: hostRemove, patchProp: hostPatchProp, createElement: hostCreateElement, createText: hostCreateText, createComment: hostCreateComment, setText: hostSetText, setElementText: hostSetElementText, parentNode: hostParentNode, nextSibling: hostNextSibling, setScopeId: hostSetScopeId = NOOP, cloneNode: hostCloneNode, insertStaticContent: hostInsertStaticContent } = options;
  const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, isSVG = false, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
    if (n1 === n2) {
      return;
    }
    if (n1 && !isSameVNodeType(n1, n2)) {
      anchor = getNextHostNode(n1);
      unmount(n1, parentComponent, parentSuspense, true);
      n1 = null;
    }
    if (n2.patchFlag === -2) {
      optimized = false;
      n2.dynamicChildren = null;
    }
    const { type, ref: ref2, shapeFlag } = n2;
    switch (type) {
      case Text:
        processText(n1, n2, container, anchor);
        break;
      case Comment:
        processCommentNode(n1, n2, container, anchor);
        break;
      case Static:
        if (n1 == null) {
          mountStaticNode(n2, container, anchor, isSVG);
        }
        break;
      case Fragment:
        processFragment(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        break;
      default:
        if (shapeFlag & 1) {
          processElement(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else if (shapeFlag & 6) {
          processComponent(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else if (shapeFlag & 64) {
          type.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals);
        } else if (shapeFlag & 128) {
          type.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals);
        } else
          ;
    }
    if (ref2 != null && parentComponent) {
      setRef(ref2, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
    }
  };
  const processText = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(n2.el = hostCreateText(n2.children), container, anchor);
    } else {
      const el = n2.el = n1.el;
      if (n2.children !== n1.children) {
        hostSetText(el, n2.children);
      }
    }
  };
  const processCommentNode = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(n2.el = hostCreateComment(n2.children || ""), container, anchor);
    } else {
      n2.el = n1.el;
    }
  };
  const mountStaticNode = (n2, container, anchor, isSVG) => {
    [n2.el, n2.anchor] = hostInsertStaticContent(n2.children, container, anchor, isSVG, n2.el, n2.anchor);
  };
  const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostInsert(el, container, nextSibling);
      el = next;
    }
    hostInsert(anchor, container, nextSibling);
  };
  const removeStaticNode = ({ el, anchor }) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostRemove(el);
      el = next;
    }
    hostRemove(anchor);
  };
  const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    isSVG = isSVG || n2.type === "svg";
    if (n1 == null) {
      mountElement(n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    } else {
      patchElement(n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    }
  };
  const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    let el;
    let vnodeHook;
    const { type, props, shapeFlag, transition, patchFlag, dirs } = vnode;
    if (vnode.el && hostCloneNode !== void 0 && patchFlag === -1) {
      el = vnode.el = hostCloneNode(vnode.el);
    } else {
      el = vnode.el = hostCreateElement(vnode.type, isSVG, props && props.is, props);
      if (shapeFlag & 8) {
        hostSetElementText(el, vnode.children);
      } else if (shapeFlag & 16) {
        mountChildren(vnode.children, el, null, parentComponent, parentSuspense, isSVG && type !== "foreignObject", slotScopeIds, optimized);
      }
      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "created");
      }
      if (props) {
        for (const key in props) {
          if (key !== "value" && !isReservedProp(key)) {
            hostPatchProp(el, key, null, props[key], isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
          }
        }
        if ("value" in props) {
          hostPatchProp(el, "value", null, props.value);
        }
        if (vnodeHook = props.onVnodeBeforeMount) {
          invokeVNodeHook(vnodeHook, parentComponent, vnode);
        }
      }
      setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
    }
    {
      Object.defineProperty(el, "__vnode", {
        value: vnode,
        enumerable: false
      });
      Object.defineProperty(el, "__vueParentComponent", {
        value: parentComponent,
        enumerable: false
      });
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
    }
    const needCallTransitionHooks = (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
    if (needCallTransitionHooks) {
      transition.beforeEnter(el);
    }
    hostInsert(el, container, anchor);
    if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        needCallTransitionHooks && transition.enter(el);
        dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
      }, parentSuspense);
    }
  };
  const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
    if (scopeId) {
      hostSetScopeId(el, scopeId);
    }
    if (slotScopeIds) {
      for (let i = 0; i < slotScopeIds.length; i++) {
        hostSetScopeId(el, slotScopeIds[i]);
      }
    }
    if (parentComponent) {
      let subTree = parentComponent.subTree;
      if (vnode === subTree) {
        const parentVNode = parentComponent.vnode;
        setScopeId(el, parentVNode, parentVNode.scopeId, parentVNode.slotScopeIds, parentComponent.parent);
      }
    }
  };
  const mountChildren = (children, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, start2 = 0) => {
    for (let i = start2; i < children.length; i++) {
      const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
      patch(null, child, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    }
  };
  const patchElement = (n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    const el = n2.el = n1.el;
    let { patchFlag, dynamicChildren, dirs } = n2;
    patchFlag |= n1.patchFlag & 16;
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    let vnodeHook;
    parentComponent && toggleRecurse(parentComponent, false);
    if (vnodeHook = newProps.onVnodeBeforeUpdate) {
      invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
    }
    if (dirs) {
      invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
    }
    parentComponent && toggleRecurse(parentComponent, true);
    const areChildrenSVG = isSVG && n2.type !== "foreignObject";
    if (dynamicChildren) {
      patchBlockChildren(n1.dynamicChildren, dynamicChildren, el, parentComponent, parentSuspense, areChildrenSVG, slotScopeIds);
    } else if (!optimized) {
      patchChildren(n1, n2, el, null, parentComponent, parentSuspense, areChildrenSVG, slotScopeIds, false);
    }
    if (patchFlag > 0) {
      if (patchFlag & 16) {
        patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
      } else {
        if (patchFlag & 2) {
          if (oldProps.class !== newProps.class) {
            hostPatchProp(el, "class", null, newProps.class, isSVG);
          }
        }
        if (patchFlag & 4) {
          hostPatchProp(el, "style", oldProps.style, newProps.style, isSVG);
        }
        if (patchFlag & 8) {
          const propsToUpdate = n2.dynamicProps;
          for (let i = 0; i < propsToUpdate.length; i++) {
            const key = propsToUpdate[i];
            const prev = oldProps[key];
            const next = newProps[key];
            if (next !== prev || key === "value") {
              hostPatchProp(el, key, prev, next, isSVG, n1.children, parentComponent, parentSuspense, unmountChildren);
            }
          }
        }
      }
      if (patchFlag & 1) {
        if (n1.children !== n2.children) {
          hostSetElementText(el, n2.children);
        }
      }
    } else if (!optimized && dynamicChildren == null) {
      patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
    }
    if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
        dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
      }, parentSuspense);
    }
  };
  const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, isSVG, slotScopeIds) => {
    for (let i = 0; i < newChildren.length; i++) {
      const oldVNode = oldChildren[i];
      const newVNode = newChildren[i];
      const container = oldVNode.el && (oldVNode.type === Fragment || !isSameVNodeType(oldVNode, newVNode) || oldVNode.shapeFlag & (6 | 64)) ? hostParentNode(oldVNode.el) : fallbackContainer;
      patch(oldVNode, newVNode, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, true);
    }
  };
  const patchProps = (el, vnode, oldProps, newProps, parentComponent, parentSuspense, isSVG) => {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        if (isReservedProp(key))
          continue;
        const next = newProps[key];
        const prev = oldProps[key];
        if (next !== prev && key !== "value") {
          hostPatchProp(el, key, prev, next, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
        }
      }
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!isReservedProp(key) && !(key in newProps)) {
            hostPatchProp(el, key, oldProps[key], null, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
          }
        }
      }
      if ("value" in newProps) {
        hostPatchProp(el, "value", oldProps.value, newProps.value);
      }
    }
  };
  const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
    const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
    let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
    if (fragmentSlotScopeIds) {
      slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
    }
    if (n1 == null) {
      hostInsert(fragmentStartAnchor, container, anchor);
      hostInsert(fragmentEndAnchor, container, anchor);
      mountChildren(n2.children, container, fragmentEndAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    } else {
      if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && n1.dynamicChildren) {
        patchBlockChildren(n1.dynamicChildren, dynamicChildren, container, parentComponent, parentSuspense, isSVG, slotScopeIds);
        if (n2.key != null || parentComponent && n2 === parentComponent.subTree) {
          traverseStaticChildren(n1, n2, true);
        }
      } else {
        patchChildren(n1, n2, container, fragmentEndAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      }
    }
  };
  const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    n2.slotScopeIds = slotScopeIds;
    if (n1 == null) {
      if (n2.shapeFlag & 512) {
        parentComponent.ctx.activate(n2, container, anchor, isSVG, optimized);
      } else {
        mountComponent(n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
      }
    } else {
      updateComponent(n1, n2, optimized);
    }
  };
  const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
    const instance = initialVNode.component = createComponentInstance(initialVNode, parentComponent, parentSuspense);
    if (isKeepAlive(initialVNode)) {
      instance.ctx.renderer = internals;
    }
    {
      setupComponent(instance);
    }
    if (instance.asyncDep) {
      parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect);
      if (!initialVNode.el) {
        const placeholder = instance.subTree = createVNode(Comment);
        processCommentNode(null, placeholder, container, anchor);
      }
      return;
    }
    setupRenderEffect(instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized);
  };
  const updateComponent = (n1, n2, optimized) => {
    const instance = n2.component = n1.component;
    if (shouldUpdateComponent(n1, n2, optimized)) {
      if (instance.asyncDep && !instance.asyncResolved) {
        updateComponentPreRender(instance, n2, optimized);
        return;
      } else {
        instance.next = n2;
        invalidateJob(instance.update);
        instance.update();
      }
    } else {
      n2.el = n1.el;
      instance.vnode = n2;
    }
  };
  const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized) => {
    const componentUpdateFn = () => {
      if (!instance.isMounted) {
        let vnodeHook;
        const { el, props } = initialVNode;
        const { bm, m, parent } = instance;
        const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
        toggleRecurse(instance, false);
        if (bm) {
          invokeArrayFns(bm);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
          invokeVNodeHook(vnodeHook, parent, initialVNode);
        }
        toggleRecurse(instance, true);
        if (el && hydrateNode) {
          const hydrateSubTree = () => {
            instance.subTree = renderComponentRoot(instance);
            hydrateNode(el, instance.subTree, instance, parentSuspense, null);
          };
          if (isAsyncWrapperVNode) {
            initialVNode.type.__asyncLoader().then(() => !instance.isUnmounted && hydrateSubTree());
          } else {
            hydrateSubTree();
          }
        } else {
          const subTree = instance.subTree = renderComponentRoot(instance);
          patch(null, subTree, container, anchor, instance, parentSuspense, isSVG);
          initialVNode.el = subTree.el;
        }
        if (m) {
          queuePostRenderEffect(m, parentSuspense);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
          const scopedInitialVNode = initialVNode;
          queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode), parentSuspense);
        }
        if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) {
          instance.a && queuePostRenderEffect(instance.a, parentSuspense);
        }
        instance.isMounted = true;
        {
          devtoolsComponentAdded(instance);
        }
        initialVNode = container = anchor = null;
      } else {
        let { next, bu, u, parent, vnode } = instance;
        let originNext = next;
        let vnodeHook;
        toggleRecurse(instance, false);
        if (next) {
          next.el = vnode.el;
          updateComponentPreRender(instance, next, optimized);
        } else {
          next = vnode;
        }
        if (bu) {
          invokeArrayFns(bu);
        }
        if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
          invokeVNodeHook(vnodeHook, parent, next, vnode);
        }
        toggleRecurse(instance, true);
        const nextTree = renderComponentRoot(instance);
        const prevTree = instance.subTree;
        instance.subTree = nextTree;
        patch(prevTree, nextTree, hostParentNode(prevTree.el), getNextHostNode(prevTree), instance, parentSuspense, isSVG);
        next.el = nextTree.el;
        if (originNext === null) {
          updateHOCHostEl(instance, nextTree.el);
        }
        if (u) {
          queuePostRenderEffect(u, parentSuspense);
        }
        if (vnodeHook = next.props && next.props.onVnodeUpdated) {
          queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, next, vnode), parentSuspense);
        }
        {
          devtoolsComponentUpdated(instance);
        }
      }
    };
    const effect = instance.effect = new ReactiveEffect(componentUpdateFn, () => queueJob(update2), instance.scope);
    const update2 = instance.update = () => effect.run();
    update2.id = instance.uid;
    toggleRecurse(instance, true);
    update2();
  };
  const updateComponentPreRender = (instance, nextVNode, optimized) => {
    nextVNode.component = instance;
    const prevProps = instance.vnode.props;
    instance.vnode = nextVNode;
    instance.next = null;
    updateProps(instance, nextVNode.props, prevProps, optimized);
    updateSlots(instance, nextVNode.children, optimized);
    pauseTracking();
    flushPreFlushCbs(void 0, instance.update);
    resetTracking();
  };
  const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized = false) => {
    const c1 = n1 && n1.children;
    const prevShapeFlag = n1 ? n1.shapeFlag : 0;
    const c2 = n2.children;
    const { patchFlag, shapeFlag } = n2;
    if (patchFlag > 0) {
      if (patchFlag & 128) {
        patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        return;
      } else if (patchFlag & 256) {
        patchUnkeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        return;
      }
    }
    if (shapeFlag & 8) {
      if (prevShapeFlag & 16) {
        unmountChildren(c1, parentComponent, parentSuspense);
      }
      if (c2 !== c1) {
        hostSetElementText(container, c2);
      }
    } else {
      if (prevShapeFlag & 16) {
        if (shapeFlag & 16) {
          patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else {
          unmountChildren(c1, parentComponent, parentSuspense, true);
        }
      } else {
        if (prevShapeFlag & 8) {
          hostSetElementText(container, "");
        }
        if (shapeFlag & 16) {
          mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        }
      }
    }
  };
  const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    c1 = c1 || EMPTY_ARR;
    c2 = c2 || EMPTY_ARR;
    const oldLength = c1.length;
    const newLength = c2.length;
    const commonLength = Math.min(oldLength, newLength);
    let i;
    for (i = 0; i < commonLength; i++) {
      const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      patch(c1[i], nextChild, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    }
    if (oldLength > newLength) {
      unmountChildren(c1, parentComponent, parentSuspense, true, false, commonLength);
    } else {
      mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, commonLength);
    }
  };
  const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    let i = 0;
    const l2 = c2.length;
    let e1 = c1.length - 1;
    let e2 = l2 - 1;
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      } else {
        break;
      }
      i++;
    }
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      } else {
        break;
      }
      e1--;
      e2--;
    }
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1;
        const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
        while (i <= e2) {
          patch(null, c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]), container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          i++;
        }
      }
    } else if (i > e2) {
      while (i <= e1) {
        unmount(c1[i], parentComponent, parentSuspense, true);
        i++;
      }
    } else {
      const s1 = i;
      const s2 = i;
      const keyToNewIndexMap = /* @__PURE__ */ new Map();
      for (i = s2; i <= e2; i++) {
        const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        if (nextChild.key != null) {
          keyToNewIndexMap.set(nextChild.key, i);
        }
      }
      let j;
      let patched = 0;
      const toBePatched = e2 - s2 + 1;
      let moved = false;
      let maxNewIndexSoFar = 0;
      const newIndexToOldIndexMap = new Array(toBePatched);
      for (i = 0; i < toBePatched; i++)
        newIndexToOldIndexMap[i] = 0;
      for (i = s1; i <= e1; i++) {
        const prevChild = c1[i];
        if (patched >= toBePatched) {
          unmount(prevChild, parentComponent, parentSuspense, true);
          continue;
        }
        let newIndex;
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key);
        } else {
          for (j = s2; j <= e2; j++) {
            if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
              newIndex = j;
              break;
            }
          }
        }
        if (newIndex === void 0) {
          unmount(prevChild, parentComponent, parentSuspense, true);
        } else {
          newIndexToOldIndexMap[newIndex - s2] = i + 1;
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex;
          } else {
            moved = true;
          }
          patch(prevChild, c2[newIndex], container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          patched++;
        }
      }
      const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
      j = increasingNewIndexSequence.length - 1;
      for (i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i;
        const nextChild = c2[nextIndex];
        const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
        if (newIndexToOldIndexMap[i] === 0) {
          patch(null, nextChild, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else if (moved) {
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            move(nextChild, container, anchor, 2);
          } else {
            j--;
          }
        }
      }
    }
  };
  const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
    const { el, type, transition, children, shapeFlag } = vnode;
    if (shapeFlag & 6) {
      move(vnode.component.subTree, container, anchor, moveType);
      return;
    }
    if (shapeFlag & 128) {
      vnode.suspense.move(container, anchor, moveType);
      return;
    }
    if (shapeFlag & 64) {
      type.move(vnode, container, anchor, internals);
      return;
    }
    if (type === Fragment) {
      hostInsert(el, container, anchor);
      for (let i = 0; i < children.length; i++) {
        move(children[i], container, anchor, moveType);
      }
      hostInsert(vnode.anchor, container, anchor);
      return;
    }
    if (type === Static) {
      moveStaticNode(vnode, container, anchor);
      return;
    }
    const needTransition = moveType !== 2 && shapeFlag & 1 && transition;
    if (needTransition) {
      if (moveType === 0) {
        transition.beforeEnter(el);
        hostInsert(el, container, anchor);
        queuePostRenderEffect(() => transition.enter(el), parentSuspense);
      } else {
        const { leave, delayLeave, afterLeave } = transition;
        const remove3 = () => hostInsert(el, container, anchor);
        const performLeave = () => {
          leave(el, () => {
            remove3();
            afterLeave && afterLeave();
          });
        };
        if (delayLeave) {
          delayLeave(el, remove3, performLeave);
        } else {
          performLeave();
        }
      }
    } else {
      hostInsert(el, container, anchor);
    }
  };
  const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
    const { type, props, ref: ref2, children, dynamicChildren, shapeFlag, patchFlag, dirs } = vnode;
    if (ref2 != null) {
      setRef(ref2, null, parentSuspense, vnode, true);
    }
    if (shapeFlag & 256) {
      parentComponent.ctx.deactivate(vnode);
      return;
    }
    const shouldInvokeDirs = shapeFlag & 1 && dirs;
    const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
    let vnodeHook;
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
      invokeVNodeHook(vnodeHook, parentComponent, vnode);
    }
    if (shapeFlag & 6) {
      unmountComponent(vnode.component, parentSuspense, doRemove);
    } else {
      if (shapeFlag & 128) {
        vnode.suspense.unmount(parentSuspense, doRemove);
        return;
      }
      if (shouldInvokeDirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
      }
      if (shapeFlag & 64) {
        vnode.type.remove(vnode, parentComponent, parentSuspense, optimized, internals, doRemove);
      } else if (dynamicChildren && (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
        unmountChildren(dynamicChildren, parentComponent, parentSuspense, false, true);
      } else if (type === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
        unmountChildren(children, parentComponent, parentSuspense);
      }
      if (doRemove) {
        remove2(vnode);
      }
    }
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
      }, parentSuspense);
    }
  };
  const remove2 = (vnode) => {
    const { type, el, anchor, transition } = vnode;
    if (type === Fragment) {
      {
        removeFragment(el, anchor);
      }
      return;
    }
    if (type === Static) {
      removeStaticNode(vnode);
      return;
    }
    const performRemove = () => {
      hostRemove(el);
      if (transition && !transition.persisted && transition.afterLeave) {
        transition.afterLeave();
      }
    };
    if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
      const { leave, delayLeave } = transition;
      const performLeave = () => leave(el, performRemove);
      if (delayLeave) {
        delayLeave(vnode.el, performRemove, performLeave);
      } else {
        performLeave();
      }
    } else {
      performRemove();
    }
  };
  const removeFragment = (cur, end) => {
    let next;
    while (cur !== end) {
      next = hostNextSibling(cur);
      hostRemove(cur);
      cur = next;
    }
    hostRemove(end);
  };
  const unmountComponent = (instance, parentSuspense, doRemove) => {
    const { bum, scope, update: update2, subTree, um } = instance;
    if (bum) {
      invokeArrayFns(bum);
    }
    scope.stop();
    if (update2) {
      update2.active = false;
      unmount(subTree, instance, parentSuspense, doRemove);
    }
    if (um) {
      queuePostRenderEffect(um, parentSuspense);
    }
    queuePostRenderEffect(() => {
      instance.isUnmounted = true;
    }, parentSuspense);
    if (parentSuspense && parentSuspense.pendingBranch && !parentSuspense.isUnmounted && instance.asyncDep && !instance.asyncResolved && instance.suspenseId === parentSuspense.pendingId) {
      parentSuspense.deps--;
      if (parentSuspense.deps === 0) {
        parentSuspense.resolve();
      }
    }
    {
      devtoolsComponentRemoved(instance);
    }
  };
  const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start2 = 0) => {
    for (let i = start2; i < children.length; i++) {
      unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
    }
  };
  const getNextHostNode = (vnode) => {
    if (vnode.shapeFlag & 6) {
      return getNextHostNode(vnode.component.subTree);
    }
    if (vnode.shapeFlag & 128) {
      return vnode.suspense.next();
    }
    return hostNextSibling(vnode.anchor || vnode.el);
  };
  const render = (vnode, container, isSVG) => {
    if (vnode == null) {
      if (container._vnode) {
        unmount(container._vnode, null, null, true);
      }
    } else {
      patch(container._vnode || null, vnode, container, null, null, null, isSVG);
    }
    flushPostFlushCbs();
    container._vnode = vnode;
  };
  const internals = {
    p: patch,
    um: unmount,
    m: move,
    r: remove2,
    mt: mountComponent,
    mc: mountChildren,
    pc: patchChildren,
    pbc: patchBlockChildren,
    n: getNextHostNode,
    o: options
  };
  let hydrate;
  let hydrateNode;
  if (createHydrationFns) {
    [hydrate, hydrateNode] = createHydrationFns(internals);
  }
  return {
    render,
    hydrate,
    createApp: createAppAPI(render, hydrate)
  };
}
function toggleRecurse({ effect, update: update2 }, allowed) {
  effect.allowRecurse = update2.allowRecurse = allowed;
}
function traverseStaticChildren(n1, n2, shallow = false) {
  const ch1 = n1.children;
  const ch2 = n2.children;
  if (isArray(ch1) && isArray(ch2)) {
    for (let i = 0; i < ch1.length; i++) {
      const c1 = ch1[i];
      let c2 = ch2[i];
      if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
        if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
          c2 = ch2[i] = cloneIfMounted(ch2[i]);
          c2.el = c1.el;
        }
        if (!shallow)
          traverseStaticChildren(c1, c2);
      }
    }
  }
}
function getSequence(arr) {
  const p2 = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p2[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = u + v >> 1;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p2[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p2[v];
  }
  return result;
}
const isTeleport = (type) => type.__isTeleport;
const isTeleportDisabled = (props) => props && (props.disabled || props.disabled === "");
const isTargetSVG = (target2) => typeof SVGElement !== "undefined" && target2 instanceof SVGElement;
const resolveTarget = (props, select) => {
  const targetSelector = props && props.to;
  if (isString(targetSelector)) {
    if (!select) {
      return null;
    } else {
      const target2 = select(targetSelector);
      return target2;
    }
  } else {
    return targetSelector;
  }
};
const TeleportImpl = {
  __isTeleport: true,
  process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals) {
    const { mc: mountChildren, pc: patchChildren, pbc: patchBlockChildren, o: { insert, querySelector, createText, createComment } } = internals;
    const disabled = isTeleportDisabled(n2.props);
    let { shapeFlag, children, dynamicChildren } = n2;
    if (n1 == null) {
      const placeholder = n2.el = createText("");
      const mainAnchor = n2.anchor = createText("");
      insert(placeholder, container, anchor);
      insert(mainAnchor, container, anchor);
      const target2 = n2.target = resolveTarget(n2.props, querySelector);
      const targetAnchor = n2.targetAnchor = createText("");
      if (target2) {
        insert(targetAnchor, target2);
        isSVG = isSVG || isTargetSVG(target2);
      }
      const mount = (container2, anchor2) => {
        if (shapeFlag & 16) {
          mountChildren(children, container2, anchor2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        }
      };
      if (disabled) {
        mount(container, mainAnchor);
      } else if (target2) {
        mount(target2, targetAnchor);
      }
    } else {
      n2.el = n1.el;
      const mainAnchor = n2.anchor = n1.anchor;
      const target2 = n2.target = n1.target;
      const targetAnchor = n2.targetAnchor = n1.targetAnchor;
      const wasDisabled = isTeleportDisabled(n1.props);
      const currentContainer = wasDisabled ? container : target2;
      const currentAnchor = wasDisabled ? mainAnchor : targetAnchor;
      isSVG = isSVG || isTargetSVG(target2);
      if (dynamicChildren) {
        patchBlockChildren(n1.dynamicChildren, dynamicChildren, currentContainer, parentComponent, parentSuspense, isSVG, slotScopeIds);
        traverseStaticChildren(n1, n2, true);
      } else if (!optimized) {
        patchChildren(n1, n2, currentContainer, currentAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, false);
      }
      if (disabled) {
        if (!wasDisabled) {
          moveTeleport(n2, container, mainAnchor, internals, 1);
        }
      } else {
        if ((n2.props && n2.props.to) !== (n1.props && n1.props.to)) {
          const nextTarget = n2.target = resolveTarget(n2.props, querySelector);
          if (nextTarget) {
            moveTeleport(n2, nextTarget, null, internals, 0);
          }
        } else if (wasDisabled) {
          moveTeleport(n2, target2, targetAnchor, internals, 1);
        }
      }
    }
  },
  remove(vnode, parentComponent, parentSuspense, optimized, { um: unmount, o: { remove: hostRemove } }, doRemove) {
    const { shapeFlag, children, anchor, targetAnchor, target: target2, props } = vnode;
    if (target2) {
      hostRemove(targetAnchor);
    }
    if (doRemove || !isTeleportDisabled(props)) {
      hostRemove(anchor);
      if (shapeFlag & 16) {
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          unmount(child, parentComponent, parentSuspense, true, !!child.dynamicChildren);
        }
      }
    }
  },
  move: moveTeleport,
  hydrate: hydrateTeleport
};
function moveTeleport(vnode, container, parentAnchor, { o: { insert }, m: move }, moveType = 2) {
  if (moveType === 0) {
    insert(vnode.targetAnchor, container, parentAnchor);
  }
  const { el, anchor, shapeFlag, children, props } = vnode;
  const isReorder = moveType === 2;
  if (isReorder) {
    insert(el, container, parentAnchor);
  }
  if (!isReorder || isTeleportDisabled(props)) {
    if (shapeFlag & 16) {
      for (let i = 0; i < children.length; i++) {
        move(children[i], container, parentAnchor, 2);
      }
    }
  }
  if (isReorder) {
    insert(anchor, container, parentAnchor);
  }
}
function hydrateTeleport(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized, { o: { nextSibling, parentNode, querySelector } }, hydrateChildren) {
  const target2 = vnode.target = resolveTarget(vnode.props, querySelector);
  if (target2) {
    const targetNode = target2._lpa || target2.firstChild;
    if (vnode.shapeFlag & 16) {
      if (isTeleportDisabled(vnode.props)) {
        vnode.anchor = hydrateChildren(nextSibling(node), vnode, parentNode(node), parentComponent, parentSuspense, slotScopeIds, optimized);
        vnode.targetAnchor = targetNode;
      } else {
        vnode.anchor = nextSibling(node);
        let targetAnchor = targetNode;
        while (targetAnchor) {
          targetAnchor = nextSibling(targetAnchor);
          if (targetAnchor && targetAnchor.nodeType === 8 && targetAnchor.data === "teleport anchor") {
            vnode.targetAnchor = targetAnchor;
            target2._lpa = vnode.targetAnchor && nextSibling(vnode.targetAnchor);
            break;
          }
        }
        hydrateChildren(targetNode, vnode, target2, parentComponent, parentSuspense, slotScopeIds, optimized);
      }
    }
  }
  return vnode.anchor && nextSibling(vnode.anchor);
}
const Teleport = TeleportImpl;
const Fragment = Symbol(void 0);
const Text = Symbol(void 0);
const Comment = Symbol(void 0);
const Static = Symbol(void 0);
const blockStack = [];
let currentBlock = null;
function openBlock(disableTracking = false) {
  blockStack.push(currentBlock = disableTracking ? null : []);
}
function closeBlock() {
  blockStack.pop();
  currentBlock = blockStack[blockStack.length - 1] || null;
}
let isBlockTreeEnabled = 1;
function setBlockTracking(value) {
  isBlockTreeEnabled += value;
}
function setupBlock(vnode) {
  vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
  closeBlock();
  if (isBlockTreeEnabled > 0 && currentBlock) {
    currentBlock.push(vnode);
  }
  return vnode;
}
function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
  return setupBlock(createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, true));
}
function createBlock(type, props, children, patchFlag, dynamicProps) {
  return setupBlock(createVNode(type, props, children, patchFlag, dynamicProps, true));
}
function isVNode(value) {
  return value ? value.__v_isVNode === true : false;
}
function isSameVNodeType(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key;
}
const InternalObjectKey = `__vInternal`;
const normalizeKey = ({ key }) => key != null ? key : null;
const normalizeRef = ({ ref: ref2, ref_key, ref_for }) => {
  return ref2 != null ? isString(ref2) || isRef(ref2) || isFunction(ref2) ? { i: currentRenderingInstance, r: ref2, k: ref_key, f: !!ref_for } : ref2 : null;
};
function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
  const vnode = {
    __v_isVNode: true,
    __v_skip: true,
    type,
    props,
    key: props && normalizeKey(props),
    ref: props && normalizeRef(props),
    scopeId: currentScopeId,
    slotScopeIds: null,
    children,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    appContext: null
  };
  if (needFullChildrenNormalization) {
    normalizeChildren(vnode, children);
    if (shapeFlag & 128) {
      type.normalize(vnode);
    }
  } else if (children) {
    vnode.shapeFlag |= isString(children) ? 8 : 16;
  }
  if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock && (vnode.patchFlag > 0 || shapeFlag & 6) && vnode.patchFlag !== 32) {
    currentBlock.push(vnode);
  }
  return vnode;
}
const createVNode = _createVNode;
function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
  if (!type || type === NULL_DYNAMIC_COMPONENT) {
    type = Comment;
  }
  if (isVNode(type)) {
    const cloned = cloneVNode(type, props, true);
    if (children) {
      normalizeChildren(cloned, children);
    }
    if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
      if (cloned.shapeFlag & 6) {
        currentBlock[currentBlock.indexOf(type)] = cloned;
      } else {
        currentBlock.push(cloned);
      }
    }
    cloned.patchFlag |= -2;
    return cloned;
  }
  if (isClassComponent(type)) {
    type = type.__vccOpts;
  }
  if (props) {
    props = guardReactiveProps(props);
    let { class: klass, style } = props;
    if (klass && !isString(klass)) {
      props.class = normalizeClass(klass);
    }
    if (isObject$1(style)) {
      if (isProxy(style) && !isArray(style)) {
        style = extend({}, style);
      }
      props.style = normalizeStyle(style);
    }
  }
  const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject$1(type) ? 4 : isFunction(type) ? 2 : 0;
  return createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, isBlockNode, true);
}
function guardReactiveProps(props) {
  if (!props)
    return null;
  return isProxy(props) || InternalObjectKey in props ? extend({}, props) : props;
}
function cloneVNode(vnode, extraProps, mergeRef = false) {
  const { props, ref: ref2, patchFlag, children } = vnode;
  const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
  const cloned = {
    __v_isVNode: true,
    __v_skip: true,
    type: vnode.type,
    props: mergedProps,
    key: mergedProps && normalizeKey(mergedProps),
    ref: extraProps && extraProps.ref ? mergeRef && ref2 ? isArray(ref2) ? ref2.concat(normalizeRef(extraProps)) : [ref2, normalizeRef(extraProps)] : normalizeRef(extraProps) : ref2,
    scopeId: vnode.scopeId,
    slotScopeIds: vnode.slotScopeIds,
    children,
    target: vnode.target,
    targetAnchor: vnode.targetAnchor,
    staticCount: vnode.staticCount,
    shapeFlag: vnode.shapeFlag,
    patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
    dynamicProps: vnode.dynamicProps,
    dynamicChildren: vnode.dynamicChildren,
    appContext: vnode.appContext,
    dirs: vnode.dirs,
    transition: vnode.transition,
    component: vnode.component,
    suspense: vnode.suspense,
    ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
    ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
    el: vnode.el,
    anchor: vnode.anchor
  };
  return cloned;
}
function createTextVNode(text = " ", flag = 0) {
  return createVNode(Text, null, text, flag);
}
function createCommentVNode(text = "", asBlock = false) {
  return asBlock ? (openBlock(), createBlock(Comment, null, text)) : createVNode(Comment, null, text);
}
function normalizeVNode(child) {
  if (child == null || typeof child === "boolean") {
    return createVNode(Comment);
  } else if (isArray(child)) {
    return createVNode(Fragment, null, child.slice());
  } else if (typeof child === "object") {
    return cloneIfMounted(child);
  } else {
    return createVNode(Text, null, String(child));
  }
}
function cloneIfMounted(child) {
  return child.el === null || child.memo ? child : cloneVNode(child);
}
function normalizeChildren(vnode, children) {
  let type = 0;
  const { shapeFlag } = vnode;
  if (children == null) {
    children = null;
  } else if (isArray(children)) {
    type = 16;
  } else if (typeof children === "object") {
    if (shapeFlag & (1 | 64)) {
      const slot = children.default;
      if (slot) {
        slot._c && (slot._d = false);
        normalizeChildren(vnode, slot());
        slot._c && (slot._d = true);
      }
      return;
    } else {
      type = 32;
      const slotFlag = children._;
      if (!slotFlag && !(InternalObjectKey in children)) {
        children._ctx = currentRenderingInstance;
      } else if (slotFlag === 3 && currentRenderingInstance) {
        if (currentRenderingInstance.slots._ === 1) {
          children._ = 1;
        } else {
          children._ = 2;
          vnode.patchFlag |= 1024;
        }
      }
    }
  } else if (isFunction(children)) {
    children = { default: children, _ctx: currentRenderingInstance };
    type = 32;
  } else {
    children = String(children);
    if (shapeFlag & 64) {
      type = 16;
      children = [createTextVNode(children)];
    } else {
      type = 8;
    }
  }
  vnode.children = children;
  vnode.shapeFlag |= type;
}
function mergeProps(...args) {
  const ret = {};
  for (let i = 0; i < args.length; i++) {
    const toMerge = args[i];
    for (const key in toMerge) {
      if (key === "class") {
        if (ret.class !== toMerge.class) {
          ret.class = normalizeClass([ret.class, toMerge.class]);
        }
      } else if (key === "style") {
        ret.style = normalizeStyle([ret.style, toMerge.style]);
      } else if (isOn(key)) {
        const existing = ret[key];
        const incoming = toMerge[key];
        if (incoming && existing !== incoming && !(isArray(existing) && existing.includes(incoming))) {
          ret[key] = existing ? [].concat(existing, incoming) : incoming;
        }
      } else if (key !== "") {
        ret[key] = toMerge[key];
      }
    }
  }
  return ret;
}
function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
  callWithAsyncErrorHandling(hook, instance, 7, [
    vnode,
    prevVNode
  ]);
}
const emptyAppContext = createAppContext();
let uid$1$1 = 0;
function createComponentInstance(vnode, parent, suspense) {
  const type = vnode.type;
  const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
  const instance = {
    uid: uid$1$1++,
    vnode,
    type,
    parent,
    appContext,
    root: null,
    next: null,
    subTree: null,
    effect: null,
    update: null,
    scope: new EffectScope(true),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: parent ? parent.provides : Object.create(appContext.provides),
    accessCache: null,
    renderCache: [],
    components: null,
    directives: null,
    propsOptions: normalizePropsOptions(type, appContext),
    emitsOptions: normalizeEmitsOptions(type, appContext),
    emit: null,
    emitted: null,
    propsDefaults: EMPTY_OBJ,
    inheritAttrs: type.inheritAttrs,
    ctx: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,
    slots: EMPTY_OBJ,
    refs: EMPTY_OBJ,
    setupState: EMPTY_OBJ,
    setupContext: null,
    suspense,
    suspenseId: suspense ? suspense.pendingId : 0,
    asyncDep: null,
    asyncResolved: false,
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  {
    instance.ctx = { _: instance };
  }
  instance.root = parent ? parent.root : instance;
  instance.emit = emit$1$1.bind(null, instance);
  if (vnode.ce) {
    vnode.ce(instance);
  }
  return instance;
}
let currentInstance = null;
const getCurrentInstance = () => currentInstance || currentRenderingInstance;
const setCurrentInstance = (instance) => {
  currentInstance = instance;
  instance.scope.on();
};
const unsetCurrentInstance = () => {
  currentInstance && currentInstance.scope.off();
  currentInstance = null;
};
function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & 4;
}
let isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false) {
  isInSSRComponentSetup = isSSR;
  const { props, children } = instance.vnode;
  const isStateful = isStatefulComponent(instance);
  initProps(instance, props, isStateful, isSSR);
  initSlots(instance, children);
  const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
  isInSSRComponentSetup = false;
  return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
  const Component = instance.type;
  instance.accessCache = /* @__PURE__ */ Object.create(null);
  instance.proxy = markRaw(new Proxy(instance.ctx, PublicInstanceProxyHandlers));
  const { setup } = Component;
  if (setup) {
    const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
    setCurrentInstance(instance);
    pauseTracking();
    const setupResult = callWithErrorHandling(setup, instance, 0, [instance.props, setupContext]);
    resetTracking();
    unsetCurrentInstance();
    if (isPromise(setupResult)) {
      setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
      if (isSSR) {
        return setupResult.then((resolvedResult) => {
          handleSetupResult(instance, resolvedResult, isSSR);
        }).catch((e) => {
          handleError$1(e, instance, 0);
        });
      } else {
        instance.asyncDep = setupResult;
      }
    } else {
      handleSetupResult(instance, setupResult, isSSR);
    }
  } else {
    finishComponentSetup(instance, isSSR);
  }
}
function handleSetupResult(instance, setupResult, isSSR) {
  if (isFunction(setupResult)) {
    if (instance.type.__ssrInlineRender) {
      instance.ssrRender = setupResult;
    } else {
      instance.render = setupResult;
    }
  } else if (isObject$1(setupResult)) {
    {
      instance.devtoolsRawSetupState = setupResult;
    }
    instance.setupState = proxyRefs(setupResult);
  } else
    ;
  finishComponentSetup(instance, isSSR);
}
let compile;
function finishComponentSetup(instance, isSSR, skipOptions) {
  const Component = instance.type;
  if (!instance.render) {
    if (!isSSR && compile && !Component.render) {
      const template = Component.template;
      if (template) {
        const { isCustomElement, compilerOptions } = instance.appContext.config;
        const { delimiters, compilerOptions: componentCompilerOptions } = Component;
        const finalCompilerOptions = extend(extend({
          isCustomElement,
          delimiters
        }, compilerOptions), componentCompilerOptions);
        Component.render = compile(template, finalCompilerOptions);
      }
    }
    instance.render = Component.render || NOOP;
  }
  {
    setCurrentInstance(instance);
    pauseTracking();
    applyOptions(instance);
    resetTracking();
    unsetCurrentInstance();
  }
}
function createAttrsProxy(instance) {
  return new Proxy(instance.attrs, {
    get(target2, key) {
      track(instance, "get", "$attrs");
      return target2[key];
    }
  });
}
function createSetupContext(instance) {
  const expose = (exposed) => {
    instance.exposed = exposed || {};
  };
  let attrs;
  {
    return {
      get attrs() {
        return attrs || (attrs = createAttrsProxy(instance));
      },
      slots: instance.slots,
      emit: instance.emit,
      expose
    };
  }
}
function getExposeProxy(instance) {
  if (instance.exposed) {
    return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
      get(target2, key) {
        if (key in target2) {
          return target2[key];
        } else if (key in publicPropertiesMap) {
          return publicPropertiesMap[key](instance);
        }
      }
    }));
  }
}
function getComponentName(Component, includeInferred = true) {
  return isFunction(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
}
function isClassComponent(value) {
  return isFunction(value) && "__vccOpts" in value;
}
const computed = (getterOrOptions, debugOptions) => {
  return computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
};
function h(type, propsOrChildren, children) {
  const l = arguments.length;
  if (l === 2) {
    if (isObject$1(propsOrChildren) && !isArray(propsOrChildren)) {
      if (isVNode(propsOrChildren)) {
        return createVNode(type, null, [propsOrChildren]);
      }
      return createVNode(type, propsOrChildren);
    } else {
      return createVNode(type, null, propsOrChildren);
    }
  } else {
    if (l > 3) {
      children = Array.prototype.slice.call(arguments, 2);
    } else if (l === 3 && isVNode(children)) {
      children = [children];
    }
    return createVNode(type, propsOrChildren, children);
  }
}
const version = "3.2.37";
const svgNS = "http://www.w3.org/2000/svg";
const doc = typeof document !== "undefined" ? document : null;
const templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
const nodeOps = {
  insert: (child, parent, anchor) => {
    parent.insertBefore(child, anchor || null);
  },
  remove: (child) => {
    const parent = child.parentNode;
    if (parent) {
      parent.removeChild(child);
    }
  },
  createElement: (tag, isSVG, is, props) => {
    const el = isSVG ? doc.createElementNS(svgNS, tag) : doc.createElement(tag, is ? { is } : void 0);
    if (tag === "select" && props && props.multiple != null) {
      el.setAttribute("multiple", props.multiple);
    }
    return el;
  },
  createText: (text) => doc.createTextNode(text),
  createComment: (text) => doc.createComment(text),
  setText: (node, text) => {
    node.nodeValue = text;
  },
  setElementText: (el, text) => {
    el.textContent = text;
  },
  parentNode: (node) => node.parentNode,
  nextSibling: (node) => node.nextSibling,
  querySelector: (selector) => doc.querySelector(selector),
  setScopeId(el, id) {
    el.setAttribute(id, "");
  },
  cloneNode(el) {
    const cloned = el.cloneNode(true);
    if (`_value` in el) {
      cloned._value = el._value;
    }
    return cloned;
  },
  insertStaticContent(content, parent, anchor, isSVG, start2, end) {
    const before = anchor ? anchor.previousSibling : parent.lastChild;
    if (start2 && (start2 === end || start2.nextSibling)) {
      while (true) {
        parent.insertBefore(start2.cloneNode(true), anchor);
        if (start2 === end || !(start2 = start2.nextSibling))
          break;
      }
    } else {
      templateContainer.innerHTML = isSVG ? `<svg>${content}</svg>` : content;
      const template = templateContainer.content;
      if (isSVG) {
        const wrapper = template.firstChild;
        while (wrapper.firstChild) {
          template.appendChild(wrapper.firstChild);
        }
        template.removeChild(wrapper);
      }
      parent.insertBefore(template, anchor);
    }
    return [
      before ? before.nextSibling : parent.firstChild,
      anchor ? anchor.previousSibling : parent.lastChild
    ];
  }
};
function patchClass(el, value, isSVG) {
  const transitionClasses = el._vtc;
  if (transitionClasses) {
    value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
  }
  if (value == null) {
    el.removeAttribute("class");
  } else if (isSVG) {
    el.setAttribute("class", value);
  } else {
    el.className = value;
  }
}
function patchStyle(el, prev, next) {
  const style = el.style;
  const isCssString = isString(next);
  if (next && !isCssString) {
    for (const key in next) {
      setStyle(style, key, next[key]);
    }
    if (prev && !isString(prev)) {
      for (const key in prev) {
        if (next[key] == null) {
          setStyle(style, key, "");
        }
      }
    }
  } else {
    const currentDisplay = style.display;
    if (isCssString) {
      if (prev !== next) {
        style.cssText = next;
      }
    } else if (prev) {
      el.removeAttribute("style");
    }
    if ("_vod" in el) {
      style.display = currentDisplay;
    }
  }
}
const importantRE = /\s*!important$/;
function setStyle(style, name, val) {
  if (isArray(val)) {
    val.forEach((v) => setStyle(style, name, v));
  } else {
    if (val == null)
      val = "";
    if (name.startsWith("--")) {
      style.setProperty(name, val);
    } else {
      const prefixed = autoPrefix(style, name);
      if (importantRE.test(val)) {
        style.setProperty(hyphenate(prefixed), val.replace(importantRE, ""), "important");
      } else {
        style[prefixed] = val;
      }
    }
  }
}
const prefixes = ["Webkit", "Moz", "ms"];
const prefixCache = {};
function autoPrefix(style, rawName) {
  const cached = prefixCache[rawName];
  if (cached) {
    return cached;
  }
  let name = camelize(rawName);
  if (name !== "filter" && name in style) {
    return prefixCache[rawName] = name;
  }
  name = capitalize(name);
  for (let i = 0; i < prefixes.length; i++) {
    const prefixed = prefixes[i] + name;
    if (prefixed in style) {
      return prefixCache[rawName] = prefixed;
    }
  }
  return rawName;
}
const xlinkNS = "http://www.w3.org/1999/xlink";
function patchAttr(el, key, value, isSVG, instance) {
  if (isSVG && key.startsWith("xlink:")) {
    if (value == null) {
      el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    const isBoolean = isSpecialBooleanAttr(key);
    if (value == null || isBoolean && !includeBooleanAttr(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, isBoolean ? "" : value);
    }
  }
}
function patchDOMProp(el, key, value, prevChildren, parentComponent, parentSuspense, unmountChildren) {
  if (key === "innerHTML" || key === "textContent") {
    if (prevChildren) {
      unmountChildren(prevChildren, parentComponent, parentSuspense);
    }
    el[key] = value == null ? "" : value;
    return;
  }
  if (key === "value" && el.tagName !== "PROGRESS" && !el.tagName.includes("-")) {
    el._value = value;
    const newValue = value == null ? "" : value;
    if (el.value !== newValue || el.tagName === "OPTION") {
      el.value = newValue;
    }
    if (value == null) {
      el.removeAttribute(key);
    }
    return;
  }
  let needRemove = false;
  if (value === "" || value == null) {
    const type = typeof el[key];
    if (type === "boolean") {
      value = includeBooleanAttr(value);
    } else if (value == null && type === "string") {
      value = "";
      needRemove = true;
    } else if (type === "number") {
      value = 0;
      needRemove = true;
    }
  }
  try {
    el[key] = value;
  } catch (e) {
  }
  needRemove && el.removeAttribute(key);
}
const [_getNow, skipTimestampCheck] = /* @__PURE__ */ (() => {
  let _getNow2 = Date.now;
  let skipTimestampCheck2 = false;
  if (typeof window !== "undefined") {
    if (Date.now() > document.createEvent("Event").timeStamp) {
      _getNow2 = performance.now.bind(performance);
    }
    const ffMatch = navigator.userAgent.match(/firefox\/(\d+)/i);
    skipTimestampCheck2 = !!(ffMatch && Number(ffMatch[1]) <= 53);
  }
  return [_getNow2, skipTimestampCheck2];
})();
let cachedNow = 0;
const p = /* @__PURE__ */ Promise.resolve();
const reset = () => {
  cachedNow = 0;
};
const getNow = () => cachedNow || (p.then(reset), cachedNow = _getNow());
function addEventListener(el, event, handler, options) {
  el.addEventListener(event, handler, options);
}
function removeEventListener(el, event, handler, options) {
  el.removeEventListener(event, handler, options);
}
function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
  const invokers = el._vei || (el._vei = {});
  const existingInvoker = invokers[rawName];
  if (nextValue && existingInvoker) {
    existingInvoker.value = nextValue;
  } else {
    const [name, options] = parseName(rawName);
    if (nextValue) {
      const invoker = invokers[rawName] = createInvoker(nextValue, instance);
      addEventListener(el, name, invoker, options);
    } else if (existingInvoker) {
      removeEventListener(el, name, existingInvoker, options);
      invokers[rawName] = void 0;
    }
  }
}
const optionsModifierRE = /(?:Once|Passive|Capture)$/;
function parseName(name) {
  let options;
  if (optionsModifierRE.test(name)) {
    options = {};
    let m;
    while (m = name.match(optionsModifierRE)) {
      name = name.slice(0, name.length - m[0].length);
      options[m[0].toLowerCase()] = true;
    }
  }
  return [hyphenate(name.slice(2)), options];
}
function createInvoker(initialValue, instance) {
  const invoker = (e) => {
    const timeStamp = e.timeStamp || _getNow();
    if (skipTimestampCheck || timeStamp >= invoker.attached - 1) {
      callWithAsyncErrorHandling(patchStopImmediatePropagation(e, invoker.value), instance, 5, [e]);
    }
  };
  invoker.value = initialValue;
  invoker.attached = getNow();
  return invoker;
}
function patchStopImmediatePropagation(e, value) {
  if (isArray(value)) {
    const originalStop = e.stopImmediatePropagation;
    e.stopImmediatePropagation = () => {
      originalStop.call(e);
      e._stopped = true;
    };
    return value.map((fn) => (e2) => !e2._stopped && fn && fn(e2));
  } else {
    return value;
  }
}
const nativeOnRE = /^on[a-z]/;
const patchProp = (el, key, prevValue, nextValue, isSVG = false, prevChildren, parentComponent, parentSuspense, unmountChildren) => {
  if (key === "class") {
    patchClass(el, nextValue, isSVG);
  } else if (key === "style") {
    patchStyle(el, prevValue, nextValue);
  } else if (isOn(key)) {
    if (!isModelListener(key)) {
      patchEvent(el, key, prevValue, nextValue, parentComponent);
    }
  } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
    patchDOMProp(el, key, nextValue, prevChildren, parentComponent, parentSuspense, unmountChildren);
  } else {
    if (key === "true-value") {
      el._trueValue = nextValue;
    } else if (key === "false-value") {
      el._falseValue = nextValue;
    }
    patchAttr(el, key, nextValue, isSVG);
  }
};
function shouldSetAsProp(el, key, value, isSVG) {
  if (isSVG) {
    if (key === "innerHTML" || key === "textContent") {
      return true;
    }
    if (key in el && nativeOnRE.test(key) && isFunction(value)) {
      return true;
    }
    return false;
  }
  if (key === "spellcheck" || key === "draggable" || key === "translate") {
    return false;
  }
  if (key === "form") {
    return false;
  }
  if (key === "list" && el.tagName === "INPUT") {
    return false;
  }
  if (key === "type" && el.tagName === "TEXTAREA") {
    return false;
  }
  if (nativeOnRE.test(key) && isString(value)) {
    return false;
  }
  return key in el;
}
const TRANSITION = "transition";
const ANIMATION = "animation";
const Transition = (props, { slots }) => h(BaseTransition, resolveTransitionProps(props), slots);
Transition.displayName = "Transition";
const DOMTransitionPropsValidators = {
  name: String,
  type: String,
  css: {
    type: Boolean,
    default: true
  },
  duration: [String, Number, Object],
  enterFromClass: String,
  enterActiveClass: String,
  enterToClass: String,
  appearFromClass: String,
  appearActiveClass: String,
  appearToClass: String,
  leaveFromClass: String,
  leaveActiveClass: String,
  leaveToClass: String
};
Transition.props = /* @__PURE__ */ extend({}, BaseTransition.props, DOMTransitionPropsValidators);
const callHook = (hook, args = []) => {
  if (isArray(hook)) {
    hook.forEach((h2) => h2(...args));
  } else if (hook) {
    hook(...args);
  }
};
const hasExplicitCallback = (hook) => {
  return hook ? isArray(hook) ? hook.some((h2) => h2.length > 1) : hook.length > 1 : false;
};
function resolveTransitionProps(rawProps) {
  const baseProps = {};
  for (const key in rawProps) {
    if (!(key in DOMTransitionPropsValidators)) {
      baseProps[key] = rawProps[key];
    }
  }
  if (rawProps.css === false) {
    return baseProps;
  }
  const { name = "v", type, duration, enterFromClass = `${name}-enter-from`, enterActiveClass = `${name}-enter-active`, enterToClass = `${name}-enter-to`, appearFromClass = enterFromClass, appearActiveClass = enterActiveClass, appearToClass = enterToClass, leaveFromClass = `${name}-leave-from`, leaveActiveClass = `${name}-leave-active`, leaveToClass = `${name}-leave-to` } = rawProps;
  const durations = normalizeDuration(duration);
  const enterDuration = durations && durations[0];
  const leaveDuration = durations && durations[1];
  const { onBeforeEnter, onEnter, onEnterCancelled, onLeave, onLeaveCancelled, onBeforeAppear = onBeforeEnter, onAppear = onEnter, onAppearCancelled = onEnterCancelled } = baseProps;
  const finishEnter = (el, isAppear, done) => {
    removeTransitionClass(el, isAppear ? appearToClass : enterToClass);
    removeTransitionClass(el, isAppear ? appearActiveClass : enterActiveClass);
    done && done();
  };
  const finishLeave = (el, done) => {
    el._isLeaving = false;
    removeTransitionClass(el, leaveFromClass);
    removeTransitionClass(el, leaveToClass);
    removeTransitionClass(el, leaveActiveClass);
    done && done();
  };
  const makeEnterHook = (isAppear) => {
    return (el, done) => {
      const hook = isAppear ? onAppear : onEnter;
      const resolve2 = () => finishEnter(el, isAppear, done);
      callHook(hook, [el, resolve2]);
      nextFrame(() => {
        removeTransitionClass(el, isAppear ? appearFromClass : enterFromClass);
        addTransitionClass(el, isAppear ? appearToClass : enterToClass);
        if (!hasExplicitCallback(hook)) {
          whenTransitionEnds(el, type, enterDuration, resolve2);
        }
      });
    };
  };
  return extend(baseProps, {
    onBeforeEnter(el) {
      callHook(onBeforeEnter, [el]);
      addTransitionClass(el, enterFromClass);
      addTransitionClass(el, enterActiveClass);
    },
    onBeforeAppear(el) {
      callHook(onBeforeAppear, [el]);
      addTransitionClass(el, appearFromClass);
      addTransitionClass(el, appearActiveClass);
    },
    onEnter: makeEnterHook(false),
    onAppear: makeEnterHook(true),
    onLeave(el, done) {
      el._isLeaving = true;
      const resolve2 = () => finishLeave(el, done);
      addTransitionClass(el, leaveFromClass);
      forceReflow();
      addTransitionClass(el, leaveActiveClass);
      nextFrame(() => {
        if (!el._isLeaving) {
          return;
        }
        removeTransitionClass(el, leaveFromClass);
        addTransitionClass(el, leaveToClass);
        if (!hasExplicitCallback(onLeave)) {
          whenTransitionEnds(el, type, leaveDuration, resolve2);
        }
      });
      callHook(onLeave, [el, resolve2]);
    },
    onEnterCancelled(el) {
      finishEnter(el, false);
      callHook(onEnterCancelled, [el]);
    },
    onAppearCancelled(el) {
      finishEnter(el, true);
      callHook(onAppearCancelled, [el]);
    },
    onLeaveCancelled(el) {
      finishLeave(el);
      callHook(onLeaveCancelled, [el]);
    }
  });
}
function normalizeDuration(duration) {
  if (duration == null) {
    return null;
  } else if (isObject$1(duration)) {
    return [NumberOf(duration.enter), NumberOf(duration.leave)];
  } else {
    const n = NumberOf(duration);
    return [n, n];
  }
}
function NumberOf(val) {
  const res = toNumber(val);
  return res;
}
function addTransitionClass(el, cls) {
  cls.split(/\s+/).forEach((c) => c && el.classList.add(c));
  (el._vtc || (el._vtc = /* @__PURE__ */ new Set())).add(cls);
}
function removeTransitionClass(el, cls) {
  cls.split(/\s+/).forEach((c) => c && el.classList.remove(c));
  const { _vtc } = el;
  if (_vtc) {
    _vtc.delete(cls);
    if (!_vtc.size) {
      el._vtc = void 0;
    }
  }
}
function nextFrame(cb) {
  requestAnimationFrame(() => {
    requestAnimationFrame(cb);
  });
}
let endId = 0;
function whenTransitionEnds(el, expectedType, explicitTimeout, resolve2) {
  const id = el._endId = ++endId;
  const resolveIfNotStale = () => {
    if (id === el._endId) {
      resolve2();
    }
  };
  if (explicitTimeout) {
    return setTimeout(resolveIfNotStale, explicitTimeout);
  }
  const { type, timeout, propCount } = getTransitionInfo(el, expectedType);
  if (!type) {
    return resolve2();
  }
  const endEvent = type + "end";
  let ended = 0;
  const end = () => {
    el.removeEventListener(endEvent, onEnd);
    resolveIfNotStale();
  };
  const onEnd = (e) => {
    if (e.target === el && ++ended >= propCount) {
      end();
    }
  };
  setTimeout(() => {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(endEvent, onEnd);
}
function getTransitionInfo(el, expectedType) {
  const styles = window.getComputedStyle(el);
  const getStyleProperties = (key) => (styles[key] || "").split(", ");
  const transitionDelays = getStyleProperties(TRANSITION + "Delay");
  const transitionDurations = getStyleProperties(TRANSITION + "Duration");
  const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  const animationDelays = getStyleProperties(ANIMATION + "Delay");
  const animationDurations = getStyleProperties(ANIMATION + "Duration");
  const animationTimeout = getTimeout(animationDelays, animationDurations);
  let type = null;
  let timeout = 0;
  let propCount = 0;
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
    propCount = type ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
  }
  const hasTransform = type === TRANSITION && /\b(transform|all)(,|$)/.test(styles[TRANSITION + "Property"]);
  return {
    type,
    timeout,
    propCount,
    hasTransform
  };
}
function getTimeout(delays, durations) {
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }
  return Math.max(...durations.map((d, i) => toMs(d) + toMs(delays[i])));
}
function toMs(s) {
  return Number(s.slice(0, -1).replace(",", ".")) * 1e3;
}
function forceReflow() {
  return document.body.offsetHeight;
}
const rendererOptions = /* @__PURE__ */ extend({ patchProp }, nodeOps);
let renderer;
function ensureRenderer() {
  return renderer || (renderer = createRenderer(rendererOptions));
}
const createApp = (...args) => {
  const app2 = ensureRenderer().createApp(...args);
  const { mount } = app2;
  app2.mount = (containerOrSelector) => {
    const container = normalizeContainer(containerOrSelector);
    if (!container)
      return;
    const component = app2._component;
    if (!isFunction(component) && !component.render && !component.template) {
      component.template = container.innerHTML;
    }
    container.innerHTML = "";
    const proxy = mount(container, false, container instanceof SVGElement);
    if (container instanceof Element) {
      container.removeAttribute("v-cloak");
      container.setAttribute("data-v-app", "");
    }
    return proxy;
  };
  return app2;
};
function normalizeContainer(container) {
  if (isString(container)) {
    const res = document.querySelector(container);
    return res;
  }
  return container;
}
var robotoFont = /* @__PURE__ */ (() => "@font-face {\n  font-family: 'Roboto';\n  font-style: normal;\n  font-weight: 100;\n  src: url(/assets/KFOkCnqEu92Fr1MmgVxIIzQ.a38ad0b6.woff) format('woff');\n}\n@font-face {\n  font-family: 'Roboto';\n  font-style: normal;\n  font-weight: 300;\n  src: url(/assets/KFOlCnqEu92Fr1MmSU5fBBc-.855a0697.woff) format('woff');\n}\n@font-face {\n  font-family: 'Roboto';\n  font-style: normal;\n  font-weight: 400;\n  src: url(/assets/KFOmCnqEu92Fr1Mu4mxM.ea50ac7f.woff) format('woff');\n}\n@font-face {\n  font-family: 'Roboto';\n  font-style: normal;\n  font-weight: 500;\n  src: url(/assets/KFOlCnqEu92Fr1MmEU9fBBc-.bd811625.woff) format('woff');\n}\n@font-face {\n  font-family: 'Roboto';\n  font-style: normal;\n  font-weight: 700;\n  src: url(/assets/KFOlCnqEu92Fr1MmWUlfBBc-.a01a632e.woff) format('woff');\n}\n@font-face {\n  font-family: 'Roboto';\n  font-style: normal;\n  font-weight: 900;\n  src: url(/assets/KFOlCnqEu92Fr1MmYUtfBBc-.d33864e0.woff) format('woff');\n}\n")();
var materialIcons$1 = /* @__PURE__ */ (() => "@font-face {\n  font-family: 'Material Icons';\n  font-style: normal;\n  font-weight: 400;\n  font-display: block;\n  src: url('/assets/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.729946f5.woff2') format('woff2'), url('/assets/flUhRq6tzZclQEJ-Vdg-IuiaDsNa.a2b98d60.woff') format('woff');\n}\n\n.material-icons {\n  font-family: 'Material Icons';\n  font-weight: normal;\n  font-style: normal;\n  display: inline-block;\n  line-height: 1;\n  text-transform: none;\n  letter-spacing: normal;\n  word-wrap: normal;\n  white-space: nowrap;\n  direction: ltr;\n\n  /* Support for all WebKit browsers. */\n  -webkit-font-smoothing: antialiased;\n  /* Support for Safari and Chrome. */\n  text-rendering: optimizeLegibility;\n\n  /* Support for Firefox. */\n  -moz-osx-font-smoothing: grayscale;\n\n  /* Support for IE. */\n  font-feature-settings: 'liga';\n}\n")();
var quasar = /* @__PURE__ */ (() => '@charset "UTF-8";\n/*!\n * * Quasar Framework v2.7.4\n * * (c) 2015-present Razvan Stoenescu\n * * Released under the MIT License.\n * */\n*, *:before, *:after {\n  box-sizing: inherit;\n  -webkit-tap-highlight-color: transparent;\n  -moz-tap-highlight-color: transparent;\n}\nhtml, body, #q-app {\n  width: 100%;\n  direction: ltr;\n}\nbody.platform-ios.within-iframe, body.platform-ios.within-iframe #q-app {\n  width: 100px;\n  min-width: 100%;\n}\nhtml, body {\n  margin: 0;\n  box-sizing: border-box;\n}\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nmain,\nmenu,\nnav,\nsection,\nsummary {\n  display: block;\n}\n/* * line 1: Remove the bottom border in Firefox 39-.\n * * lines 2,3: Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n * */\nabbr[title] {\n  border-bottom: none;\n  text-decoration: underline;\n  -webkit-text-decoration: underline dotted;\n          text-decoration: underline dotted;\n}\nimg {\n  border-style: none;\n}\nsvg:not(:root) {\n  overflow: hidden;\n}\n/* * line 1: Correct the inheritance and scaling of font size in all browsers.\n * * line 2: Correct the odd `em` font sizing in all browsers.\n * */\ncode, kbd, pre, samp {\n  font-family: monospace, monospace;\n  font-size: 1em;\n}\n/* * lines 1,2: Add the correct box sizing in Firefox.\n * * line 3: Show the overflow in Edge and IE.\n * */\nhr {\n  box-sizing: content-box;\n  height: 0;\n  overflow: visible;\n}\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font: inherit;\n  font-family: inherit;\n  margin: 0;\n}\noptgroup {\n  font-weight: bold;\n}\n/* * Show the overflow in IE.\n * *  input: Show the overflow in Edge.\n * *  select: Show the overflow in Edge, Firefox, and IE.\n * * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * *  select: Remove the inheritance of text transform in Firefox.\n * */\nbutton,\ninput,\nselect {\n  overflow: visible;\n  text-transform: none;\n}\nbutton::-moz-focus-inner, input::-moz-focus-inner {\n  border: 0;\n  padding: 0;\n}\nbutton:-moz-focusring, input:-moz-focusring {\n  outline: 1px dotted ButtonText;\n}\nfieldset {\n  padding: 0.35em 0.75em 0.625em;\n}\n/**\n * * lines 1,3,4,6: Correct the text wrapping in Edge and IE.\n * * line 2: Correct the color inheritance from `fieldset` elements in IE.\n * * line 5: Remove the padding so developers are not caught out when they zero out\n * *    `fieldset` elements in all browsers.\n * */\nlegend {\n  box-sizing: border-box;\n  color: inherit;\n  display: table;\n  max-width: 100%;\n  padding: 0;\n  white-space: normal;\n}\nprogress {\n  vertical-align: baseline;\n}\ntextarea {\n  overflow: auto;\n}\ninput[type=search]::-webkit-search-cancel-button,\ninput[type=search]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n.q-icon {\n  line-height: 1;\n  width: 1em;\n  height: 1em;\n  flex-shrink: 0;\n  letter-spacing: normal;\n  text-transform: none;\n  white-space: nowrap;\n  word-wrap: normal;\n  direction: ltr;\n  text-align: center;\n  position: relative;\n  box-sizing: content-box;\n  fill: currentColor;\n}\n.q-icon:before, .q-icon:after {\n  width: 100%;\n  height: 100%;\n  display: flex !important;\n  align-items: center;\n  justify-content: center;\n}\n.q-icon > svg,\n.q-icon > img {\n  width: 100%;\n  height: 100%;\n}\n.q-icon,\n.material-icons,\n.material-icons-outlined,\n.material-icons-round,\n.material-icons-sharp,\n.material-symbols-outlined,\n.material-symbols-rounded,\n.material-symbols-sharp {\n  -webkit-user-select: none;\n          user-select: none;\n  cursor: inherit;\n  font-size: inherit;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  vertical-align: middle;\n}\n.q-panel {\n  height: 100%;\n  width: 100%;\n}\n.q-panel > div {\n  height: 100%;\n  width: 100%;\n}\n.q-panel-parent {\n  overflow: hidden;\n  position: relative;\n}\n.q-loading-bar {\n  position: fixed;\n  z-index: 9998;\n  transition: transform 0.5s cubic-bezier(0, 0, 0.2, 1), opacity 0.5s;\n  background: #f44336;\n}\n.q-loading-bar--top {\n  left: 0 /* rtl:ignore */;\n  right: 0 /* rtl:ignore */;\n  top: 0;\n  width: 100%;\n}\n.q-loading-bar--bottom {\n  left: 0 /* rtl:ignore */;\n  right: 0 /* rtl:ignore */;\n  bottom: 0;\n  width: 100%;\n}\n.q-loading-bar--right {\n  top: 0;\n  bottom: 0;\n  right: 0;\n  height: 100%;\n}\n.q-loading-bar--left {\n  top: 0;\n  bottom: 0;\n  left: 0;\n  height: 100%;\n}\n.q-avatar {\n  position: relative;\n  vertical-align: middle;\n  display: inline-block;\n  border-radius: 50%;\n  font-size: 48px;\n  height: 1em;\n  width: 1em;\n}\n.q-avatar__content {\n  font-size: 0.5em;\n  line-height: 0.5em;\n}\n.q-avatar__content, .q-avatar img:not(.q-icon):not(.q-img__image) {\n  border-radius: inherit;\n  height: inherit;\n  width: inherit;\n}\n.q-avatar--square {\n  border-radius: 0;\n}\n.q-badge {\n  background-color: var(--q-primary);\n  color: #fff;\n  padding: 2px 6px;\n  border-radius: 4px;\n  font-size: 12px;\n  line-height: 12px;\n  min-height: 12px;\n  font-weight: normal;\n  vertical-align: baseline;\n}\n.q-badge--single-line {\n  white-space: nowrap;\n}\n.q-badge--multi-line {\n  word-break: break-all;\n  word-wrap: break-word;\n}\n.q-badge--floating {\n  position: absolute;\n  top: -4px;\n  right: -3px;\n  cursor: inherit;\n}\n.q-badge--transparent {\n  opacity: 0.8;\n}\n.q-badge--outline {\n  background-color: transparent;\n  border: 1px solid currentColor;\n}\n.q-badge--rounded {\n  border-radius: 1em;\n}\n.q-banner {\n  min-height: 54px;\n  padding: 8px 16px;\n  background: #fff;\n}\n.q-banner--top-padding {\n  padding-top: 14px;\n}\n.q-banner__avatar {\n  min-width: 1px !important;\n}\n.q-banner__avatar > .q-avatar {\n  font-size: 46px;\n}\n.q-banner__avatar > .q-icon {\n  font-size: 40px;\n}\n.q-banner__avatar:not(:empty) + .q-banner__content {\n  padding-left: 16px;\n}\n.q-banner__actions.col-auto {\n  padding-left: 16px;\n}\n.q-banner__actions.col-all .q-btn-item {\n  margin: 4px 0 0 4px;\n}\n.q-banner--dense {\n  min-height: 32px;\n  padding: 8px;\n}\n.q-banner--dense.q-banner--top-padding {\n  padding-top: 12px;\n}\n.q-banner--dense .q-banner__avatar > .q-avatar, .q-banner--dense .q-banner__avatar > .q-icon {\n  font-size: 28px;\n}\n.q-banner--dense .q-banner__avatar:not(:empty) + .q-banner__content {\n  padding-left: 8px;\n}\n.q-banner--dense .q-banner__actions.col-auto {\n  padding-left: 8px;\n}\n.q-bar {\n  background: rgba(0, 0, 0, 0.2);\n}\n.q-bar > .q-icon {\n  margin-left: 2px;\n}\n.q-bar > div, .q-bar > div + .q-icon {\n  margin-left: 8px;\n}\n.q-bar > .q-btn {\n  margin-left: 2px;\n}\n.q-bar > .q-icon:first-child, .q-bar > .q-btn:first-child, .q-bar > div:first-child {\n  margin-left: 0;\n}\n.q-bar--standard {\n  padding: 0 12px;\n  height: 32px;\n  font-size: 18px;\n}\n.q-bar--standard > div {\n  font-size: 16px;\n}\n.q-bar--standard .q-btn {\n  font-size: 11px;\n}\n.q-bar--dense {\n  padding: 0 8px;\n  height: 24px;\n  font-size: 14px;\n}\n.q-bar--dense .q-btn {\n  font-size: 8px;\n}\n.q-bar--dark {\n  background: rgba(255, 255, 255, 0.15);\n}\n.q-breadcrumbs__el {\n  color: inherit;\n}\n.q-breadcrumbs__el-icon {\n  font-size: 125%;\n}\n.q-breadcrumbs__el-icon--with-label {\n  margin-right: 8px;\n}\n[dir=rtl] .q-breadcrumbs__separator .q-icon {\n  transform: scaleX(-1) /* rtl:ignore */;\n}\n.q-btn {\n  display: inline-flex;\n  flex-direction: column;\n  align-items: stretch;\n  position: relative;\n  outline: 0;\n  border: 0;\n  vertical-align: middle;\n  font-size: 14px;\n  line-height: 1.715em;\n  text-decoration: none;\n  color: inherit;\n  background: transparent;\n  font-weight: 500;\n  text-transform: uppercase;\n  text-align: center;\n  width: auto;\n  height: auto;\n  cursor: default;\n  padding: 4px 16px;\n  min-height: 2.572em;\n}\n.q-btn .q-icon, .q-btn .q-spinner {\n  font-size: 1.715em;\n}\n.q-btn.disabled {\n  opacity: 0.7 !important;\n}\n.q-btn:before {\n  content: "";\n  display: block;\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  border-radius: inherit;\n  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12);\n}\n.q-btn--actionable {\n  cursor: pointer;\n}\n.q-btn--actionable.q-btn--standard:before {\n  transition: box-shadow 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);\n}\n.q-btn--actionable.q-btn--standard:active:before, .q-btn--actionable.q-btn--standard.q-btn--active:before {\n  box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2), 0 5px 8px rgba(0, 0, 0, 0.14), 0 1px 14px rgba(0, 0, 0, 0.12);\n}\n.q-btn--no-uppercase {\n  text-transform: none;\n}\n.q-btn--rectangle {\n  border-radius: 3px;\n}\n.q-btn--outline {\n  background: transparent !important;\n}\n.q-btn--outline:before {\n  border: 1px solid currentColor;\n}\n.q-btn--push {\n  border-radius: 7px;\n}\n.q-btn--push:before {\n  border-bottom: 3px solid rgba(0, 0, 0, 0.15);\n}\n.q-btn--push.q-btn--actionable {\n  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);\n}\n.q-btn--push.q-btn--actionable:before {\n  transition: border-width 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);\n}\n.q-btn--push.q-btn--actionable:active, .q-btn--push.q-btn--actionable.q-btn--active {\n  transform: translateY(2px);\n}\n.q-btn--push.q-btn--actionable:active:before, .q-btn--push.q-btn--actionable.q-btn--active:before {\n  border-bottom-width: 0;\n}\n.q-btn--rounded {\n  border-radius: 28px;\n}\n.q-btn--round {\n  border-radius: 50%;\n  padding: 0;\n  min-width: 3em;\n  min-height: 3em;\n}\n.q-btn--flat:before, .q-btn--outline:before, .q-btn--unelevated:before {\n  box-shadow: none;\n}\n.q-btn--dense {\n  padding: 0.285em;\n  min-height: 2em;\n}\n.q-btn--dense.q-btn--round {\n  padding: 0;\n  min-height: 2.4em;\n  min-width: 2.4em;\n}\n.q-btn--dense .on-left {\n  margin-right: 6px;\n}\n.q-btn--dense .on-right {\n  margin-left: 6px;\n}\n.q-btn--fab .q-icon, .q-btn--fab-mini .q-icon {\n  font-size: 24px;\n}\n.q-btn--fab {\n  padding: 16px;\n  min-height: 56px;\n  min-width: 56px;\n}\n.q-btn--fab .q-icon {\n  margin: auto;\n}\n.q-btn--fab-mini {\n  padding: 8px;\n  min-height: 40px;\n  min-width: 40px;\n}\n.q-btn__content {\n  transition: opacity 0.3s;\n  z-index: 0;\n}\n.q-btn__content--hidden {\n  opacity: 0;\n  pointer-events: none;\n}\n.q-btn__progress {\n  border-radius: inherit;\n  z-index: 0;\n}\n.q-btn__progress-indicator {\n  z-index: -1;\n  transform: translateX(-100%);\n  background: rgba(255, 255, 255, 0.25);\n}\n.q-btn__progress--dark .q-btn__progress-indicator {\n  background: rgba(0, 0, 0, 0.2);\n}\n.q-btn--flat .q-btn__progress-indicator, .q-btn--outline .q-btn__progress-indicator {\n  opacity: 0.2;\n  background: currentColor;\n}\n.q-btn-dropdown--split .q-btn-dropdown__arrow-container {\n  padding: 0 4px;\n}\n.q-btn-dropdown--split .q-btn-dropdown__arrow-container.q-btn--outline {\n  border-left: 1px solid currentColor;\n}\n.q-btn-dropdown--split .q-btn-dropdown__arrow-container:not(.q-btn--outline) {\n  border-left: 1px solid rgba(255, 255, 255, 0.3);\n}\n.q-btn-dropdown--simple * + .q-btn-dropdown__arrow {\n  margin-left: 8px;\n}\n.q-btn-dropdown__arrow {\n  transition: transform 0.28s;\n}\n.q-btn-dropdown--current {\n  flex-grow: 1;\n}\n.q-btn-group {\n  border-radius: 3px;\n  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12);\n  vertical-align: middle;\n}\n.q-btn-group > .q-btn-item {\n  border-radius: inherit;\n  align-self: stretch;\n}\n.q-btn-group > .q-btn-item:before {\n  box-shadow: none;\n}\n.q-btn-group > .q-btn-item .q-badge--floating {\n  right: 0;\n}\n.q-btn-group > .q-btn-group {\n  box-shadow: none;\n}\n.q-btn-group > .q-btn-group:first-child > .q-btn:first-child {\n  border-top-left-radius: inherit;\n  border-bottom-left-radius: inherit;\n}\n.q-btn-group > .q-btn-group:last-child > .q-btn:last-child {\n  border-top-right-radius: inherit;\n  border-bottom-right-radius: inherit;\n}\n.q-btn-group > .q-btn-group:not(:first-child) > .q-btn:first-child:before {\n  border-left: 0;\n}\n.q-btn-group > .q-btn-group:not(:last-child) > .q-btn:last-child:before {\n  border-right: 0;\n}\n.q-btn-group > .q-btn-item:not(:last-child) {\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n}\n.q-btn-group > .q-btn-item:not(:first-child) {\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0;\n}\n.q-btn-group > .q-btn-item.q-btn--standard:before {\n  z-index: -1;\n}\n.q-btn-group--push {\n  border-radius: 7px;\n}\n.q-btn-group--push > .q-btn--push.q-btn--actionable {\n  transform: none;\n}\n.q-btn-group--push > .q-btn--push.q-btn--actionable .q-btn__content {\n  transition: margin-top 0.3s cubic-bezier(0.25, 0.8, 0.5, 1), margin-bottom 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);\n}\n.q-btn-group--push > .q-btn--push.q-btn--actionable:active .q-btn__content, .q-btn-group--push > .q-btn--push.q-btn--actionable.q-btn--active .q-btn__content {\n  margin-top: 2px;\n  margin-bottom: -2px;\n}\n.q-btn-group--rounded {\n  border-radius: 28px;\n}\n.q-btn-group--flat, .q-btn-group--outline, .q-btn-group--unelevated {\n  box-shadow: none;\n}\n.q-btn-group--outline > .q-separator {\n  display: none;\n}\n.q-btn-group--outline > .q-btn-item + .q-btn-item:before {\n  border-left: 0;\n}\n.q-btn-group--outline > .q-btn-item:not(:last-child):before {\n  border-right: 0;\n}\n.q-btn-group--stretch {\n  align-self: stretch;\n  border-radius: 0;\n}\n.q-btn-group--glossy > .q-btn-item {\n  background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0) 50%, rgba(0, 0, 0, 0.12) 51%, rgba(0, 0, 0, 0.04)) !important;\n}\n.q-btn-group--spread > .q-btn-group {\n  display: flex !important;\n}\n.q-btn-group--spread > .q-btn-item, .q-btn-group--spread > .q-btn-group > .q-btn-item:not(.q-btn-dropdown__arrow-container) {\n  width: auto;\n  min-width: 0;\n  max-width: 100%;\n  flex: 10000 1 0%;\n}\n.q-btn-toggle {\n  position: relative;\n}\n.q-card {\n  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12);\n  border-radius: 4px;\n  vertical-align: top;\n  background: #fff;\n  position: relative;\n}\n.q-card > div:first-child,\n.q-card > img:first-child {\n  border-top: 0;\n  border-top-left-radius: inherit;\n  border-top-right-radius: inherit;\n}\n.q-card > div:last-child,\n.q-card > img:last-child {\n  border-bottom: 0;\n  border-bottom-left-radius: inherit;\n  border-bottom-right-radius: inherit;\n}\n.q-card > div:not(:first-child),\n.q-card > img:not(:first-child) {\n  border-top-left-radius: 0;\n  border-top-right-radius: 0;\n}\n.q-card > div:not(:last-child),\n.q-card > img:not(:last-child) {\n  border-bottom-left-radius: 0;\n  border-bottom-right-radius: 0;\n}\n.q-card > div {\n  border-left: 0;\n  border-right: 0;\n  box-shadow: none;\n}\n.q-card--bordered {\n  border: 1px solid rgba(0, 0, 0, 0.12);\n}\n.q-card--dark {\n  border-color: rgba(255, 255, 255, 0.28);\n}\n.q-card__section {\n  position: relative;\n}\n.q-card__section--vert {\n  padding: 16px;\n}\n.q-card__section--horiz > div:first-child,\n.q-card__section--horiz > img:first-child {\n  border-top-left-radius: inherit;\n  border-bottom-left-radius: inherit;\n}\n.q-card__section--horiz > div:last-child,\n.q-card__section--horiz > img:last-child {\n  border-top-right-radius: inherit;\n  border-bottom-right-radius: inherit;\n}\n.q-card__section--horiz > div:not(:first-child),\n.q-card__section--horiz > img:not(:first-child) {\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0;\n}\n.q-card__section--horiz > div:not(:last-child),\n.q-card__section--horiz > img:not(:last-child) {\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n}\n.q-card__section--horiz > div {\n  border-top: 0;\n  border-bottom: 0;\n  box-shadow: none;\n}\n.q-card__actions {\n  padding: 8px;\n  align-items: center;\n}\n.q-card__actions .q-btn {\n  padding: 0 8px;\n}\n.q-card__actions--horiz > .q-btn-item + .q-btn-item,\n.q-card__actions--horiz > .q-btn-group + .q-btn-item,\n.q-card__actions--horiz > .q-btn-item + .q-btn-group {\n  margin-left: 8px;\n}\n.q-card__actions--vert > .q-btn-item.q-btn--round {\n  align-self: center;\n}\n.q-card__actions--vert > .q-btn-item + .q-btn-item,\n.q-card__actions--vert > .q-btn-group + .q-btn-item,\n.q-card__actions--vert > .q-btn-item + .q-btn-group {\n  margin-top: 4px;\n}\n.q-card__actions--vert > .q-btn-group > .q-btn-item {\n  flex-grow: 1;\n}\n.q-card > img {\n  display: block;\n  width: 100%;\n  max-width: 100%;\n  border: 0;\n}\n.q-carousel {\n  background-color: #fff;\n  height: 400px;\n}\n.q-carousel__slide {\n  min-height: 100%;\n  background-size: cover;\n  background-position: 50%;\n}\n.q-carousel__slide, .q-carousel .q-carousel--padding {\n  padding: 16px;\n}\n.q-carousel__slides-container {\n  height: 100%;\n}\n.q-carousel__control {\n  color: #fff;\n}\n.q-carousel__arrow {\n  pointer-events: none;\n}\n.q-carousel__arrow .q-icon {\n  font-size: 28px;\n}\n.q-carousel__arrow .q-btn {\n  pointer-events: all;\n}\n.q-carousel__prev-arrow--horizontal, .q-carousel__next-arrow--horizontal {\n  top: 16px;\n  bottom: 16px;\n}\n.q-carousel__prev-arrow--horizontal {\n  left: 16px;\n}\n.q-carousel__next-arrow--horizontal {\n  right: 16px;\n}\n.q-carousel__prev-arrow--vertical, .q-carousel__next-arrow--vertical {\n  left: 16px;\n  right: 16px;\n}\n.q-carousel__prev-arrow--vertical {\n  top: 16px;\n}\n.q-carousel__next-arrow--vertical {\n  bottom: 16px;\n}\n.q-carousel__navigation--top, .q-carousel__navigation--bottom {\n  left: 16px;\n  right: 16px;\n  overflow-x: auto;\n  overflow-y: hidden;\n}\n.q-carousel__navigation--top {\n  top: 16px;\n}\n.q-carousel__navigation--bottom {\n  bottom: 16px;\n}\n.q-carousel__navigation--left, .q-carousel__navigation--right {\n  top: 16px;\n  bottom: 16px;\n  overflow-x: hidden;\n  overflow-y: auto;\n}\n.q-carousel__navigation--left > .q-carousel__navigation-inner, .q-carousel__navigation--right > .q-carousel__navigation-inner {\n  flex-direction: column;\n}\n.q-carousel__navigation--left {\n  left: 16px;\n}\n.q-carousel__navigation--right {\n  right: 16px;\n}\n.q-carousel__navigation-inner {\n  flex: 1 1 auto;\n}\n.q-carousel__navigation .q-btn {\n  margin: 6px 4px;\n  padding: 5px;\n}\n.q-carousel__navigation-icon--inactive {\n  opacity: 0.7;\n}\n.q-carousel .q-carousel__thumbnail {\n  margin: 2px;\n  height: 50px;\n  width: auto;\n  display: inline-block;\n  cursor: pointer;\n  border: 1px solid transparent;\n  border-radius: 4px;\n  vertical-align: middle;\n  opacity: 0.7;\n  transition: opacity 0.3s;\n}\n.q-carousel .q-carousel__thumbnail:hover,\n.q-carousel .q-carousel__thumbnail--active {\n  opacity: 1;\n}\n.q-carousel .q-carousel__thumbnail--active {\n  border-color: currentColor;\n  cursor: default;\n}\n.q-carousel--navigation-top.q-carousel--with-padding .q-carousel__slide, .q-carousel--navigation-top .q-carousel--padding, .q-carousel--arrows-vertical.q-carousel--with-padding .q-carousel__slide, .q-carousel--arrows-vertical .q-carousel--padding {\n  padding-top: 60px;\n}\n.q-carousel--navigation-bottom.q-carousel--with-padding .q-carousel__slide, .q-carousel--navigation-bottom .q-carousel--padding, .q-carousel--arrows-vertical.q-carousel--with-padding .q-carousel__slide, .q-carousel--arrows-vertical .q-carousel--padding {\n  padding-bottom: 60px;\n}\n.q-carousel--navigation-left.q-carousel--with-padding .q-carousel__slide, .q-carousel--navigation-left .q-carousel--padding, .q-carousel--arrows-horizontal.q-carousel--with-padding .q-carousel__slide, .q-carousel--arrows-horizontal .q-carousel--padding {\n  padding-left: 60px;\n}\n.q-carousel--navigation-right.q-carousel--with-padding .q-carousel__slide, .q-carousel--navigation-right .q-carousel--padding, .q-carousel--arrows-horizontal.q-carousel--with-padding .q-carousel__slide, .q-carousel--arrows-horizontal .q-carousel--padding {\n  padding-right: 60px;\n}\n.q-carousel.fullscreen {\n  height: 100%;\n}\n.q-message-name, .q-message-stamp, .q-message-label {\n  font-size: small;\n}\n.q-message-label {\n  margin: 24px 0;\n  text-align: center;\n}\n.q-message-stamp {\n  color: inherit;\n  margin-top: 4px;\n  opacity: 0.6;\n  display: none;\n}\n.q-message-avatar {\n  border-radius: 50%;\n  width: 48px;\n  height: 48px;\n  min-width: 48px;\n}\n.q-message {\n  margin-bottom: 8px;\n}\n.q-message:first-child .q-message-label {\n  margin-top: 0;\n}\n.q-message-avatar--received {\n  margin-right: 8px;\n}\n.q-message-text--received {\n  color: #81c784;\n  border-radius: 4px 4px 4px 0;\n}\n.q-message-text--received:last-child:before {\n  right: 100%;\n  border-right: 0 solid transparent;\n  border-left: 8px solid transparent;\n  border-bottom: 8px solid currentColor;\n}\n.q-message-text-content--received {\n  color: #000;\n}\n.q-message-name--sent {\n  text-align: right;\n}\n.q-message-avatar--sent {\n  margin-left: 8px;\n}\n.q-message-container--sent {\n  flex-direction: row-reverse;\n}\n.q-message-text--sent {\n  color: #e0e0e0;\n  border-radius: 4px 4px 0 4px;\n}\n.q-message-text--sent:last-child:before {\n  left: 100%;\n  border-left: 0 solid transparent;\n  border-right: 8px solid transparent;\n  border-bottom: 8px solid currentColor;\n}\n.q-message-text-content--sent {\n  color: #000;\n}\n.q-message-text {\n  background: currentColor;\n  padding: 8px;\n  line-height: 1.2;\n  word-break: break-word;\n  position: relative;\n}\n.q-message-text + .q-message-text {\n  margin-top: 3px;\n}\n.q-message-text:last-child {\n  min-height: 48px;\n}\n.q-message-text:last-child .q-message-stamp {\n  display: block;\n}\n.q-message-text:last-child:before {\n  content: "";\n  position: absolute;\n  bottom: 0;\n  width: 0;\n  height: 0;\n}\n.q-checkbox {\n  vertical-align: middle;\n}\n.q-checkbox__native {\n  width: 1px;\n  height: 1px;\n}\n.q-checkbox__bg, .q-checkbox__icon-container {\n  -webkit-user-select: none;\n          user-select: none;\n}\n.q-checkbox__bg {\n  top: 25%;\n  left: 25%;\n  width: 50%;\n  height: 50%;\n  border: 2px solid currentColor;\n  border-radius: 2px;\n  transition: background 0.22s cubic-bezier(0, 0, 0.2, 1) 0ms;\n  -webkit-print-color-adjust: exact;\n}\n.q-checkbox__icon {\n  color: currentColor;\n  font-size: 0.5em;\n}\n.q-checkbox__svg {\n  color: #fff;\n}\n.q-checkbox__truthy {\n  stroke: currentColor;\n  stroke-width: 3.12px;\n  stroke-dashoffset: 29.78334;\n  stroke-dasharray: 29.78334;\n}\n.q-checkbox__indet {\n  fill: currentColor;\n  transform-origin: 50% 50%;\n  transform: rotate(-280deg) scale(0);\n}\n.q-checkbox__inner {\n  font-size: 40px;\n  width: 1em;\n  min-width: 1em;\n  height: 1em;\n  outline: 0;\n  border-radius: 50%;\n  color: rgba(0, 0, 0, 0.54);\n}\n.q-checkbox__inner--truthy, .q-checkbox__inner--indet {\n  color: var(--q-primary);\n}\n.q-checkbox__inner--truthy .q-checkbox__bg, .q-checkbox__inner--indet .q-checkbox__bg {\n  background: currentColor;\n}\n.q-checkbox__inner--truthy path {\n  stroke-dashoffset: 0;\n  transition: stroke-dashoffset 0.18s cubic-bezier(0.4, 0, 0.6, 1) 0ms;\n}\n.q-checkbox__inner--indet .q-checkbox__indet {\n  transform: rotate(0) scale(1);\n  transition: transform 0.22s cubic-bezier(0, 0, 0.2, 1) 0ms;\n}\n.q-checkbox.disabled {\n  opacity: 0.75 !important;\n}\n.q-checkbox--dark .q-checkbox__inner {\n  color: rgba(255, 255, 255, 0.7);\n}\n.q-checkbox--dark .q-checkbox__inner:before {\n  opacity: 0.32 !important;\n}\n.q-checkbox--dark .q-checkbox__inner--truthy, .q-checkbox--dark .q-checkbox__inner--indet {\n  color: var(--q-primary);\n}\n.q-checkbox--dense .q-checkbox__inner {\n  width: 0.5em;\n  min-width: 0.5em;\n  height: 0.5em;\n}\n.q-checkbox--dense .q-checkbox__bg {\n  left: 5%;\n  top: 5%;\n  width: 90%;\n  height: 90%;\n}\n.q-checkbox--dense .q-checkbox__label {\n  padding-left: 0.5em;\n}\n.q-checkbox--dense.reverse .q-checkbox__label {\n  padding-left: 0;\n  padding-right: 0.5em;\n}\nbody.desktop .q-checkbox:not(.disabled) .q-checkbox__inner:before {\n  content: "";\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  border-radius: 50%;\n  background: currentColor;\n  opacity: 0.12;\n  transform: scale3d(0, 0, 1);\n  transition: transform 0.22s cubic-bezier(0, 0, 0.2, 1);\n}\nbody.desktop .q-checkbox:not(.disabled):focus .q-checkbox__inner:before, body.desktop .q-checkbox:not(.disabled):hover .q-checkbox__inner:before {\n  transform: scale3d(1, 1, 1);\n}\nbody.desktop .q-checkbox--dense:not(.disabled):focus .q-checkbox__inner:before, body.desktop .q-checkbox--dense:not(.disabled):hover .q-checkbox__inner:before {\n  transform: scale3d(1.4, 1.4, 1);\n}\n.q-chip {\n  vertical-align: middle;\n  border-radius: 16px;\n  outline: 0;\n  position: relative;\n  height: 2em;\n  max-width: 100%;\n  margin: 4px;\n  background: #e0e0e0;\n  color: rgba(0, 0, 0, 0.87);\n  font-size: 14px;\n  padding: 0.5em 0.9em;\n}\n.q-chip--colored .q-chip__icon, .q-chip--dark .q-chip__icon {\n  color: inherit;\n}\n.q-chip--outline {\n  background: transparent !important;\n  border: 1px solid currentColor;\n}\n.q-chip .q-avatar {\n  font-size: 2em;\n  margin-left: -0.45em;\n  margin-right: 0.2em;\n  border-radius: 16px;\n}\n.q-chip--selected .q-avatar {\n  display: none;\n}\n.q-chip__icon {\n  color: rgba(0, 0, 0, 0.54);\n  font-size: 1.5em;\n  margin: -0.2em;\n}\n.q-chip__icon--left {\n  margin-right: 0.2em;\n}\n.q-chip__icon--right {\n  margin-left: 0.2em;\n}\n.q-chip__icon--remove {\n  margin-left: 0.1em;\n  margin-right: -0.5em;\n  opacity: 0.6;\n  outline: 0;\n}\n.q-chip__icon--remove:hover, .q-chip__icon--remove:focus {\n  opacity: 1;\n}\n.q-chip__content {\n  white-space: nowrap;\n}\n.q-chip--dense {\n  border-radius: 12px;\n  padding: 0 0.4em;\n  height: 1.5em;\n}\n.q-chip--dense .q-avatar {\n  font-size: 1.5em;\n  margin-left: -0.27em;\n  margin-right: 0.1em;\n  border-radius: 12px;\n}\n.q-chip--dense .q-chip__icon {\n  font-size: 1.25em;\n}\n.q-chip--dense .q-chip__icon--left {\n  margin-right: 0.195em;\n}\n.q-chip--dense .q-chip__icon--remove {\n  margin-right: -0.25em;\n}\n.q-chip--square {\n  border-radius: 4px;\n}\n.q-chip--square .q-avatar {\n  border-radius: 3px 0 0 3px;\n}\nbody.desktop .q-chip--clickable:focus {\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2), 0 1px 1px rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12);\n}\n.q-circular-progress {\n  display: inline-block;\n  position: relative;\n  vertical-align: middle;\n  width: 1em;\n  height: 1em;\n  line-height: 1;\n}\n.q-circular-progress.q-focusable {\n  border-radius: 50%;\n}\n.q-circular-progress__svg {\n  width: 100%;\n  height: 100%;\n}\n.q-circular-progress__text {\n  font-size: 0.25em;\n}\n.q-circular-progress--indeterminate .q-circular-progress__svg {\n  transform-origin: 50% 50%;\n  animation: q-spin 2s linear infinite /* rtl:ignore */;\n}\n.q-circular-progress--indeterminate .q-circular-progress__circle {\n  stroke-dasharray: 1 400;\n  stroke-dashoffset: 0;\n  animation: q-circular-progress-circle 1.5s ease-in-out infinite /* rtl:ignore */;\n}\n@keyframes q-circular-progress-circle {\n  0% {\n    stroke-dasharray: 1, 400;\n    stroke-dashoffset: 0;\n  }\n  50% {\n    stroke-dasharray: 400, 400;\n    stroke-dashoffset: -100;\n  }\n  100% {\n    stroke-dasharray: 400, 400;\n    stroke-dashoffset: -300;\n  }\n}\n.q-color-picker {\n  overflow: hidden;\n  background: #fff;\n  max-width: 350px;\n  vertical-align: top;\n  min-width: 180px;\n  border-radius: 4px;\n  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12);\n}\n.q-color-picker .q-tab {\n  padding: 0 !important;\n}\n.q-color-picker--bordered {\n  border: 1px solid rgba(0, 0, 0, 0.12);\n}\n.q-color-picker__header-tabs {\n  height: 32px;\n}\n.q-color-picker__header-banner {\n  height: 36px;\n}\n.q-color-picker__header input {\n  line-height: 24px;\n  border: 0;\n}\n.q-color-picker__header .q-tab {\n  min-height: 32px !important;\n  height: 32px !important;\n}\n.q-color-picker__header .q-tab--inactive {\n  background: linear-gradient(to top, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.15) 25%, rgba(0, 0, 0, 0.1));\n}\n.q-color-picker__error-icon {\n  bottom: 2px;\n  right: 2px;\n  font-size: 24px;\n  opacity: 0;\n  transition: opacity 0.3s ease-in;\n}\n.q-color-picker__header-content {\n  position: relative;\n  background: #fff;\n}\n.q-color-picker__header-content--light {\n  color: #000;\n}\n.q-color-picker__header-content--dark {\n  color: #fff;\n}\n.q-color-picker__header-content--dark .q-tab--inactive:before {\n  content: "";\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  background: rgba(255, 255, 255, 0.2);\n}\n.q-color-picker__header-banner {\n  height: 36px;\n}\n.q-color-picker__header-bg {\n  background: #fff;\n  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAH0lEQVQoU2NkYGAwZkAFZ5G5jPRRgOYEVDeB3EBjBQBOZwTVugIGyAAAAABJRU5ErkJggg==") !important;\n}\n.q-color-picker__footer {\n  height: 36px;\n}\n.q-color-picker__footer .q-tab {\n  min-height: 36px !important;\n  height: 36px !important;\n}\n.q-color-picker__footer .q-tab--inactive {\n  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.15) 25%, rgba(0, 0, 0, 0.1));\n}\n.q-color-picker__spectrum {\n  width: 100%;\n  height: 100%;\n}\n.q-color-picker__spectrum-tab {\n  padding: 0 !important;\n}\n.q-color-picker__spectrum-white {\n  background: linear-gradient(to right, #fff, rgba(255, 255, 255, 0));\n}\n.q-color-picker__spectrum-black {\n  background: linear-gradient(to top, #000, rgba(0, 0, 0, 0));\n}\n.q-color-picker__spectrum-circle {\n  width: 10px;\n  height: 10px;\n  box-shadow: 0 0 0 1.5px #fff, inset 0 0 1px 1px rgba(0, 0, 0, 0.3), 0 0 1px 2px rgba(0, 0, 0, 0.4);\n  border-radius: 50%;\n  transform: translate(-5px, -5px);\n}\n.q-color-picker__hue .q-slider__track {\n  background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%) !important;\n  opacity: 1;\n}\n.q-color-picker__alpha .q-slider__track-container {\n  padding-top: 0;\n}\n.q-color-picker__alpha .q-slider__track:before {\n  content: "";\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  border-radius: inherit;\n  background: linear-gradient(90deg, rgba(255, 255, 255, 0), #757575);\n}\n.q-color-picker__sliders {\n  padding: 0 16px;\n}\n.q-color-picker__sliders .q-slider__thumb {\n  color: #424242;\n}\n.q-color-picker__sliders .q-slider__thumb path {\n  stroke-width: 2px;\n  fill: transparent;\n}\n.q-color-picker__sliders .q-slider--active path {\n  stroke-width: 3px;\n}\n.q-color-picker__tune-tab .q-slider {\n  margin-left: 18px;\n  margin-right: 18px;\n}\n.q-color-picker__tune-tab input {\n  font-size: 11px;\n  border: 1px solid #e0e0e0;\n  border-radius: 4px;\n  width: 3.5em;\n}\n.q-color-picker__palette-tab {\n  padding: 0 !important;\n}\n.q-color-picker__palette-rows--editable .q-color-picker__cube {\n  cursor: pointer;\n}\n.q-color-picker__cube {\n  padding-bottom: 10%;\n  width: 10% !important;\n}\n.q-color-picker input {\n  color: inherit;\n  background: transparent;\n  outline: 0;\n  text-align: center;\n}\n.q-color-picker .q-tabs {\n  overflow: hidden;\n}\n.q-color-picker .q-tab--active {\n  box-shadow: 0 0 14px 3px rgba(0, 0, 0, 0.2);\n}\n.q-color-picker .q-tab--active .q-focus-helper {\n  display: none;\n}\n.q-color-picker .q-tab__indicator {\n  display: none;\n}\n.q-color-picker .q-tab-panels {\n  background: inherit;\n}\n.q-color-picker--dark .q-color-picker__tune-tab input {\n  border: 1px solid rgba(255, 255, 255, 0.3);\n}\n.q-color-picker--dark .q-slider__thumb {\n  color: #fafafa;\n}\n.q-date {\n  display: inline-flex;\n  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12);\n  border-radius: 4px;\n  background: #fff;\n  width: 290px;\n  min-width: 290px;\n  max-width: 100%;\n}\n.q-date--bordered {\n  border: 1px solid rgba(0, 0, 0, 0.12);\n}\n.q-date__header {\n  border-top-left-radius: inherit;\n  color: #fff;\n  background-color: var(--q-primary);\n  padding: 16px;\n}\n.q-date__actions {\n  padding: 0 16px 16px;\n}\n.q-date__content, .q-date__main {\n  outline: 0;\n}\n.q-date__content .q-btn {\n  font-weight: normal;\n}\n.q-date__header-link {\n  opacity: 0.64;\n  outline: 0;\n  transition: opacity 0.3s ease-out;\n}\n.q-date__header-link--active, .q-date__header-link:hover, .q-date__header-link:focus {\n  opacity: 1;\n}\n.q-date__header-subtitle {\n  font-size: 14px;\n  line-height: 1.75;\n  letter-spacing: 0.00938em;\n}\n.q-date__header-title-label {\n  font-size: 24px;\n  line-height: 1.2;\n  letter-spacing: 0.00735em;\n}\n.q-date__view {\n  height: 100%;\n  width: 100%;\n  min-height: 290px;\n  padding: 16px;\n}\n.q-date__navigation {\n  height: 12.5%;\n}\n.q-date__navigation > div:first-child {\n  width: 8%;\n  min-width: 24px;\n  justify-content: flex-end;\n}\n.q-date__navigation > div:last-child {\n  width: 8%;\n  min-width: 24px;\n  justify-content: flex-start;\n}\n.q-date__calendar-weekdays {\n  height: 12.5%;\n}\n.q-date__calendar-weekdays > div {\n  opacity: 0.38;\n  font-size: 12px;\n}\n.q-date__calendar-item {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  vertical-align: middle;\n  width: 14.285% !important;\n  height: 12.5% !important;\n  position: relative;\n  padding: 1px;\n}\n.q-date__calendar-item:after {\n  content: "";\n  position: absolute;\n  pointer-events: none;\n  top: 1px;\n  right: 0;\n  bottom: 1px;\n  left: 0;\n  border-style: dashed;\n  border-color: transparent;\n  border-width: 1px;\n}\n.q-date__calendar-item > div, .q-date__calendar-item button {\n  width: 30px;\n  height: 30px;\n  border-radius: 50%;\n}\n.q-date__calendar-item > div {\n  line-height: 30px;\n  text-align: center;\n}\n.q-date__calendar-item > button {\n  line-height: 22px;\n}\n.q-date__calendar-item--out {\n  opacity: 0.18;\n}\n.q-date__calendar-item--fill {\n  visibility: hidden;\n}\n.q-date__range:before, .q-date__range-from:before, .q-date__range-to:before {\n  content: "";\n  background-color: currentColor;\n  position: absolute;\n  top: 1px;\n  bottom: 1px;\n  left: 0;\n  right: 0;\n  opacity: 0.3;\n}\n.q-date__range:nth-child(7n-6):before, .q-date__range-from:nth-child(7n-6):before, .q-date__range-to:nth-child(7n-6):before {\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0;\n}\n.q-date__range:nth-child(7n):before, .q-date__range-from:nth-child(7n):before, .q-date__range-to:nth-child(7n):before {\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n}\n.q-date__range-from:before {\n  left: 50%;\n}\n.q-date__range-to:before {\n  right: 50%;\n}\n.q-date__edit-range:after {\n  border-color: currentColor transparent;\n}\n.q-date__edit-range:nth-child(7n-6):after {\n  border-top-left-radius: 0;\n  border-bottom-left-radius: 0;\n}\n.q-date__edit-range:nth-child(7n):after {\n  border-top-right-radius: 0;\n  border-bottom-right-radius: 0;\n}\n.q-date__edit-range-from:after, .q-date__edit-range-from-to:after {\n  left: 4px;\n  border-left-color: currentColor;\n  border-top-color: currentColor;\n  border-bottom-color: currentColor;\n  border-top-left-radius: 28px;\n  border-bottom-left-radius: 28px;\n}\n.q-date__edit-range-to:after, .q-date__edit-range-from-to:after {\n  right: 4px;\n  border-right-color: currentColor;\n  border-top-color: currentColor;\n  border-bottom-color: currentColor;\n  border-top-right-radius: 28px;\n  border-bottom-right-radius: 28px;\n}\n.q-date__calendar-days-container {\n  height: 75%;\n  min-height: 192px;\n}\n.q-date__calendar-days > div {\n  height: 16.66% !important;\n}\n.q-date__event {\n  position: absolute;\n  bottom: 2px;\n  left: 50%;\n  height: 5px;\n  width: 8px;\n  border-radius: 5px;\n  background-color: var(--q-secondary);\n  transform: translate3d(-50%, 0, 0);\n}\n.q-date__today {\n  box-shadow: 0 0 1px 0 currentColor;\n}\n.q-date__years-content {\n  padding: 0 8px;\n}\n.q-date__years-item, .q-date__months-item {\n  flex: 0 0 33.3333%;\n}\n.q-date.disabled .q-date__header, .q-date.disabled .q-date__content, .q-date--readonly .q-date__header, .q-date--readonly .q-date__content {\n  pointer-events: none;\n}\n.q-date--readonly .q-date__navigation {\n  display: none;\n}\n.q-date--portrait {\n  flex-direction: column;\n}\n.q-date--portrait-standard .q-date__content {\n  height: calc(100% - 86px);\n}\n.q-date--portrait-standard .q-date__header {\n  border-top-right-radius: inherit;\n  height: 86px;\n}\n.q-date--portrait-standard .q-date__header-title {\n  align-items: center;\n  height: 30px;\n}\n.q-date--portrait-minimal .q-date__content {\n  height: 100%;\n}\n.q-date--landscape {\n  flex-direction: row;\n  align-items: stretch;\n  min-width: 420px;\n}\n.q-date--landscape > div {\n  display: flex;\n  flex-direction: column;\n}\n.q-date--landscape .q-date__content {\n  height: 100%;\n}\n.q-date--landscape-standard {\n  min-width: 420px;\n}\n.q-date--landscape-standard .q-date__header {\n  border-bottom-left-radius: inherit;\n  min-width: 110px;\n  width: 110px;\n}\n.q-date--landscape-standard .q-date__header-title {\n  flex-direction: column;\n}\n.q-date--landscape-standard .q-date__header-today {\n  margin-top: 12px;\n  margin-left: -8px;\n}\n.q-date--landscape-minimal {\n  width: 310px;\n}\n.q-date--dark {\n  border-color: rgba(255, 255, 255, 0.28);\n}\n.q-dialog__title {\n  font-size: 1.25rem;\n  font-weight: 500;\n  line-height: 2rem;\n  letter-spacing: 0.0125em;\n}\n.q-dialog__progress {\n  font-size: 4rem;\n}\n.q-dialog__inner {\n  outline: 0;\n}\n.q-dialog__inner > div {\n  pointer-events: all;\n  overflow: auto;\n  -webkit-overflow-scrolling: touch;\n  will-change: scroll-position;\n  border-radius: 4px;\n  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px rgba(0, 0, 0, 0.14), 0 1px 10px rgba(0, 0, 0, 0.12);\n}\n.q-dialog__inner--square > div {\n  border-radius: 0 !important;\n}\n.q-dialog__inner > .q-card > .q-card__actions .q-btn--rectangle {\n  min-width: 64px;\n}\n.q-dialog__inner--minimized {\n  padding: 24px;\n}\n.q-dialog__inner--minimized > div {\n  max-height: calc(100vh - 48px);\n}\n.q-dialog__inner--maximized > div {\n  height: 100%;\n  width: 100%;\n  max-height: 100vh;\n  max-width: 100vw;\n  border-radius: 0 !important;\n  top: 0 !important;\n  left: 0 !important;\n}\n.q-dialog__inner--top, .q-dialog__inner--bottom {\n  padding-top: 0 !important;\n  padding-bottom: 0 !important;\n}\n.q-dialog__inner--right, .q-dialog__inner--left {\n  padding-right: 0 !important;\n  padding-left: 0 !important;\n}\n.q-dialog__inner--left:not(.q-dialog__inner--animating) > div, .q-dialog__inner--top:not(.q-dialog__inner--animating) > div {\n  border-top-left-radius: 0;\n}\n.q-dialog__inner--right:not(.q-dialog__inner--animating) > div, .q-dialog__inner--top:not(.q-dialog__inner--animating) > div {\n  border-top-right-radius: 0;\n}\n.q-dialog__inner--left:not(.q-dialog__inner--animating) > div, .q-dialog__inner--bottom:not(.q-dialog__inner--animating) > div {\n  border-bottom-left-radius: 0;\n}\n.q-dialog__inner--right:not(.q-dialog__inner--animating) > div, .q-dialog__inner--bottom:not(.q-dialog__inner--animating) > div {\n  border-bottom-right-radius: 0;\n}\n.q-dialog__inner--fullwidth > div {\n  width: 100% !important;\n  max-width: 100% !important;\n}\n.q-dialog__inner--fullheight > div {\n  height: 100% !important;\n  max-height: 100% !important;\n}\n.q-dialog__backdrop {\n  z-index: -1;\n  pointer-events: all;\n  outline: 0;\n  background: rgba(0, 0, 0, 0.4);\n}\nbody.platform-ios .q-dialog__inner--minimized > div, body.platform-android:not(.native-mobile) .q-dialog__inner--minimized > div {\n  max-height: calc(100vh - 108px);\n}\nbody.q-ios-padding .q-dialog__inner {\n  padding-top: 20px !important;\n  padding-top: env(safe-area-inset-top) !important;\n  padding-bottom: env(safe-area-inset-bottom) !important;\n}\nbody.q-ios-padding .q-dialog__inner > div {\n  max-height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom)) !important;\n}\n@media (max-width: 599.98px) {\n  .q-dialog__inner--top, .q-dialog__inner--bottom {\n    padding-left: 0;\n    padding-right: 0;\n  }\n  .q-dialog__inner--top > div, .q-dialog__inner--bottom > div {\n    width: 100% !important;\n  }\n}\n@media (min-width: 600px) {\n  .q-dialog__inner--minimized > div {\n    max-width: 560px;\n  }\n}\n.q-body--dialog {\n  overflow: hidden;\n}\n.q-bottom-sheet {\n  padding-bottom: 8px;\n}\n.q-bottom-sheet__avatar {\n  border-radius: 50%;\n}\n.q-bottom-sheet--list {\n  width: 400px;\n}\n.q-bottom-sheet--list .q-icon, .q-bottom-sheet--list img {\n  font-size: 24px;\n  width: 24px;\n  height: 24px;\n}\n.q-bottom-sheet--grid {\n  width: 700px;\n}\n.q-bottom-sheet--grid .q-bottom-sheet__item {\n  padding: 8px;\n  text-align: center;\n  min-width: 100px;\n}\n.q-bottom-sheet--grid .q-icon, .q-bottom-sheet--grid img, .q-bottom-sheet--grid .q-bottom-sheet__empty-icon {\n  font-size: 48px;\n  width: 48px;\n  height: 48px;\n  margin-bottom: 8px;\n}\n.q-bottom-sheet--grid .q-separator {\n  margin: 12px 0;\n}\n.q-bottom-sheet__item {\n  flex: 0 0 33.3333%;\n}\n@media (min-width: 600px) {\n  .q-bottom-sheet__item {\n    flex: 0 0 25%;\n  }\n}\n.q-dialog-plugin {\n  width: 400px;\n}\n.q-dialog-plugin__form {\n  max-height: 50vh;\n}\n.q-dialog-plugin .q-card__section + .q-card__section {\n  padding-top: 0;\n}\n.q-dialog-plugin--progress {\n  text-align: center;\n}\n.q-editor {\n  border: 1px solid rgba(0, 0, 0, 0.12);\n  border-radius: 4px;\n  background-color: #fff;\n}\n.q-editor.disabled {\n  border-style: dashed;\n}\n.q-editor > div:first-child, .q-editor__toolbars-container, .q-editor__toolbars-container > div:first-child {\n  border-top-left-radius: inherit;\n  border-top-right-radius: inherit;\n}\n.q-editor__content {\n  outline: 0;\n  padding: 10px;\n  min-height: 10em;\n  border-bottom-left-radius: inherit;\n  border-bottom-right-radius: inherit;\n  overflow: auto;\n  max-width: 100%;\n}\n.q-editor__content pre {\n  white-space: pre-wrap;\n}\n.q-editor__content hr {\n  border: 0;\n  outline: 0;\n  margin: 1px;\n  height: 1px;\n  background: rgba(0, 0, 0, 0.12);\n}\n.q-editor__content:empty:not(:focus):before {\n  content: attr(placeholder);\n  opacity: 0.7;\n}\n.q-editor__toolbar {\n  border-bottom: 1px solid rgba(0, 0, 0, 0.12);\n  min-height: 32px;\n}\n.q-editor__toolbars-container {\n  max-width: 100%;\n}\n.q-editor .q-btn {\n  margin: 4px;\n}\n.q-editor__toolbar-group {\n  position: relative;\n  margin: 0 4px;\n}\n.q-editor__toolbar-group + .q-editor__toolbar-group:before {\n  content: "";\n  position: absolute;\n  left: -4px;\n  top: 4px;\n  bottom: 4px;\n  width: 1px;\n  background: rgba(0, 0, 0, 0.12);\n}\n.q-editor__link-input {\n  color: inherit;\n  text-decoration: none;\n  text-transform: none;\n  border: none;\n  border-radius: 0;\n  background: none;\n  outline: 0;\n}\n.q-editor--flat, .q-editor--flat .q-editor__toolbar {\n  border: 0;\n}\n.q-editor--dense .q-editor__toolbar-group {\n  display: flex;\n  align-items: center;\n  flex-wrap: nowrap;\n}\n.q-editor--dark {\n  border-color: rgba(255, 255, 255, 0.28);\n}\n.q-editor--dark .q-editor__content hr {\n  background: rgba(255, 255, 255, 0.28);\n}\n.q-editor--dark .q-editor__toolbar {\n  border-color: rgba(255, 255, 255, 0.28);\n}\n.q-editor--dark .q-editor__toolbar-group + .q-editor__toolbar-group:before {\n  background: rgba(255, 255, 255, 0.28);\n}\n.q-expansion-item__border {\n  opacity: 0;\n}\n.q-expansion-item__toggle-icon {\n  position: relative;\n  transition: transform 0.3s;\n}\n.q-expansion-item__toggle-icon--rotated {\n  transform: rotate(180deg);\n}\n.q-expansion-item__toggle-focus {\n  width: 1em !important;\n  height: 1em !important;\n  position: relative !important;\n}\n.q-expansion-item__toggle-focus + .q-expansion-item__toggle-icon {\n  margin-top: -1em;\n}\n.q-expansion-item--standard.q-expansion-item--expanded > div > .q-expansion-item__border {\n  opacity: 1;\n}\n.q-expansion-item--popup {\n  transition: padding 0.5s;\n}\n.q-expansion-item--popup > .q-expansion-item__container {\n  border: 1px solid rgba(0, 0, 0, 0.12);\n}\n.q-expansion-item--popup > .q-expansion-item__container > .q-separator {\n  display: none;\n}\n.q-expansion-item--popup.q-expansion-item--collapsed {\n  padding: 0 15px;\n}\n.q-expansion-item--popup.q-expansion-item--expanded {\n  padding: 15px 0;\n}\n.q-expansion-item--popup.q-expansion-item--expanded + .q-expansion-item--popup.q-expansion-item--expanded {\n  padding-top: 0;\n}\n.q-expansion-item--popup.q-expansion-item--collapsed:not(:first-child) > .q-expansion-item__container {\n  border-top-width: 0;\n}\n.q-expansion-item--popup.q-expansion-item--expanded + .q-expansion-item--popup.q-expansion-item--collapsed > .q-expansion-item__container {\n  border-top-width: 1px;\n}\n.q-expansion-item__content > .q-card {\n  box-shadow: none;\n  border-radius: 0;\n}\n.q-expansion-item:first-child > div > .q-expansion-item__border--top {\n  opacity: 0;\n}\n.q-expansion-item:last-child > div > .q-expansion-item__border--bottom {\n  opacity: 0;\n}\n.q-expansion-item--expanded + .q-expansion-item--expanded > div > .q-expansion-item__border--top {\n  opacity: 0;\n}\n.q-expansion-item--expanded .q-textarea--autogrow textarea {\n  animation: q-expansion-done 0s;\n}\n@keyframes q-expansion-done {\n  0% {\n    --q-exp-done: 1;\n  }\n}\n.z-fab {\n  z-index: 990;\n}\n.q-fab {\n  position: relative;\n  vertical-align: middle;\n}\n.q-fab > .q-btn {\n  width: 100%;\n}\n.q-fab--form-rounded {\n  border-radius: 28px;\n}\n.q-fab--form-square {\n  border-radius: 4px;\n}\n.q-fab__icon, .q-fab__active-icon {\n  transition: opacity 0.4s, transform 0.4s;\n}\n.q-fab__icon {\n  opacity: 1;\n  transform: rotate(0deg);\n}\n.q-fab__active-icon {\n  opacity: 0;\n  transform: rotate(-180deg);\n}\n.q-fab__label--external {\n  position: absolute;\n  padding: 0 8px;\n  transition: opacity 0.18s cubic-bezier(0.65, 0.815, 0.735, 0.395);\n}\n.q-fab__label--external-hidden {\n  opacity: 0;\n  pointer-events: none;\n}\n.q-fab__label--external-left {\n  top: 50%;\n  left: -12px;\n  transform: translate(-100%, -50%);\n}\n.q-fab__label--external-right {\n  top: 50%;\n  right: -12px;\n  transform: translate(100%, -50%);\n}\n.q-fab__label--external-bottom {\n  bottom: -12px;\n  left: 50%;\n  transform: translate(-50%, 100%);\n}\n.q-fab__label--external-top {\n  top: -12px;\n  left: 50%;\n  transform: translate(-50%, -100%);\n}\n.q-fab__label--internal {\n  padding: 0;\n  transition: font-size 0.12s cubic-bezier(0.65, 0.815, 0.735, 0.395), max-height 0.12s cubic-bezier(0.65, 0.815, 0.735, 0.395), opacity 0.07s cubic-bezier(0.65, 0.815, 0.735, 0.395);\n  max-height: 30px;\n}\n.q-fab__label--internal-hidden {\n  font-size: 0;\n  opacity: 0;\n}\n.q-fab__label--internal-top {\n  padding-bottom: 0.12em;\n}\n.q-fab__label--internal-bottom {\n  padding-top: 0.12em;\n}\n.q-fab__label--internal-top.q-fab__label--internal-hidden, .q-fab__label--internal-bottom.q-fab__label--internal-hidden {\n  max-height: 0;\n}\n.q-fab__label--internal-left {\n  padding-left: 0.285em;\n  padding-right: 0.571em;\n}\n.q-fab__label--internal-right {\n  padding-right: 0.285em;\n  padding-left: 0.571em;\n}\n.q-fab__icon-holder {\n  min-width: 24px;\n  min-height: 24px;\n  position: relative;\n}\n.q-fab__icon-holder--opened .q-fab__icon {\n  transform: rotate(180deg);\n  opacity: 0;\n}\n.q-fab__icon-holder--opened .q-fab__active-icon {\n  transform: rotate(0deg);\n  opacity: 1;\n}\n.q-fab__actions {\n  position: absolute;\n  opacity: 0;\n  transition: transform 0.18s ease-in, opacity 0.18s ease-in;\n  pointer-events: none;\n  align-items: center;\n  justify-content: center;\n  align-self: center;\n  padding: 3px;\n}\n.q-fab__actions .q-btn {\n  margin: 5px;\n}\n.q-fab__actions--right {\n  transform-origin: 0 50%;\n  transform: scale(0.4) translateX(-62px);\n  height: 56px;\n  left: 100%;\n  margin-left: 9px;\n}\n.q-fab__actions--left {\n  transform-origin: 100% 50%;\n  transform: scale(0.4) translateX(62px);\n  height: 56px;\n  right: 100%;\n  margin-right: 9px;\n  flex-direction: row-reverse;\n}\n.q-fab__actions--up {\n  transform-origin: 50% 100%;\n  transform: scale(0.4) translateY(62px);\n  width: 56px;\n  bottom: 100%;\n  margin-bottom: 9px;\n  flex-direction: column-reverse;\n}\n.q-fab__actions--down {\n  transform-origin: 50% 0;\n  transform: scale(0.4) translateY(-62px);\n  width: 56px;\n  top: 100%;\n  margin-top: 9px;\n  flex-direction: column;\n}\n.q-fab__actions--up, .q-fab__actions--down {\n  left: 50%;\n  margin-left: -28px;\n}\n.q-fab__actions--opened {\n  opacity: 1;\n  transform: scale(1) translate(0, 0);\n  pointer-events: all;\n}\n.q-fab--align-left > .q-fab__actions--up, .q-fab--align-left > .q-fab__actions--down {\n  align-items: flex-start;\n  left: 28px;\n}\n.q-fab--align-right > .q-fab__actions--up, .q-fab--align-right > .q-fab__actions--down {\n  align-items: flex-end;\n  left: auto;\n  right: 0;\n}\n.q-field {\n  font-size: 14px;\n}\n.q-field ::-ms-clear,\n.q-field ::-ms-reveal {\n  display: none;\n}\n.q-field--with-bottom {\n  padding-bottom: 20px;\n}\n.q-field__marginal {\n  height: 56px;\n  color: rgba(0, 0, 0, 0.54);\n  font-size: 24px;\n}\n.q-field__marginal > * + * {\n  margin-left: 2px;\n}\n.q-field__marginal .q-avatar {\n  font-size: 32px;\n}\n.q-field__before, .q-field__prepend {\n  padding-right: 12px;\n}\n.q-field__after, .q-field__append {\n  padding-left: 12px;\n}\n.q-field__after:empty, .q-field__append:empty {\n  display: none;\n}\n.q-field__append + .q-field__append {\n  padding-left: 2px;\n}\n.q-field__inner {\n  text-align: left;\n}\n.q-field__bottom {\n  font-size: 12px;\n  min-height: 20px;\n  line-height: 1;\n  color: rgba(0, 0, 0, 0.54);\n  padding: 8px 12px 0;\n  -webkit-backface-visibility: hidden;\n          backface-visibility: hidden;\n}\n.q-field__bottom--animated {\n  transform: translateY(100%);\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n}\n.q-field__messages {\n  line-height: 1;\n}\n.q-field__messages > div {\n  word-break: break-word;\n  word-wrap: break-word;\n  overflow-wrap: break-word;\n}\n.q-field__messages > div + div {\n  margin-top: 4px;\n}\n.q-field__counter {\n  padding-left: 8px;\n  line-height: 1;\n}\n.q-field--item-aligned {\n  padding: 8px 16px;\n}\n.q-field--item-aligned .q-field__before {\n  min-width: 56px;\n}\n.q-field__control-container {\n  height: inherit;\n}\n.q-field__control {\n  color: var(--q-primary);\n  height: 56px;\n  max-width: 100%;\n  outline: none;\n}\n.q-field__control:before, .q-field__control:after {\n  content: "";\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  pointer-events: none;\n}\n.q-field__control:before {\n  border-radius: inherit;\n}\n.q-field__shadow {\n  top: 8px;\n  opacity: 0;\n  overflow: hidden;\n  white-space: pre-wrap;\n  transition: opacity 0.36s cubic-bezier(0.4, 0, 0.2, 1);\n}\n.q-field__shadow + .q-field__native::placeholder {\n  transition: opacity 0.36s cubic-bezier(0.4, 0, 0.2, 1);\n}\n.q-field__shadow + .q-field__native:focus::placeholder {\n  opacity: 0;\n}\n.q-field__native, .q-field__prefix, .q-field__suffix, .q-field__input {\n  font-weight: 400;\n  line-height: 28px;\n  letter-spacing: 0.00937em;\n  text-decoration: inherit;\n  text-transform: inherit;\n  border: none;\n  border-radius: 0;\n  background: none;\n  color: rgba(0, 0, 0, 0.87);\n  outline: 0;\n  padding: 6px 0;\n}\n.q-field__native, .q-field__input {\n  width: 100%;\n  min-width: 0;\n  outline: 0 !important;\n}\n.q-field__native:-webkit-autofill, .q-field__input:-webkit-autofill {\n  -webkit-animation-name: q-autofill;\n  -webkit-animation-fill-mode: both;\n}\n.q-field__native:-webkit-autofill + .q-field__label, .q-field__input:-webkit-autofill + .q-field__label {\n  transform: translateY(-40%) scale(0.75);\n}\n.q-field__native[type=number]:invalid + .q-field__label, .q-field__input[type=number]:invalid + .q-field__label {\n  transform: translateY(-40%) scale(0.75);\n}\n.q-field__native:invalid, .q-field__input:invalid {\n  box-shadow: none;\n}\n.q-field__native[type=file] {\n  line-height: 1em;\n}\n.q-field__input {\n  padding: 0;\n  height: 0;\n  min-height: 24px;\n  line-height: 24px;\n}\n.q-field__prefix, .q-field__suffix {\n  transition: opacity 0.36s cubic-bezier(0.4, 0, 0.2, 1);\n  white-space: nowrap;\n}\n.q-field__prefix {\n  padding-right: 4px;\n}\n.q-field__suffix {\n  padding-left: 4px;\n}\n.q-field--readonly .q-placeholder, .q-field--disabled .q-placeholder {\n  opacity: 1 !important;\n}\n.q-field--readonly.q-field--labeled .q-field__native, .q-field--readonly.q-field--labeled .q-field__input {\n  cursor: default;\n}\n.q-field--readonly.q-field--float .q-field__native, .q-field--readonly.q-field--float .q-field__input {\n  cursor: text;\n}\n.q-field--disabled .q-field__inner {\n  cursor: not-allowed;\n}\n.q-field--disabled .q-field__control {\n  pointer-events: none;\n}\n.q-field--disabled .q-field__control > div {\n  opacity: 0.6 !important;\n}\n.q-field--disabled .q-field__control > div, .q-field--disabled .q-field__control > div * {\n  outline: 0 !important;\n}\n.q-field__label {\n  left: 0;\n  top: 18px;\n  max-width: 100%;\n  color: rgba(0, 0, 0, 0.6);\n  font-size: 16px;\n  line-height: 20px;\n  font-weight: 400;\n  letter-spacing: 0.00937em;\n  text-decoration: inherit;\n  text-transform: inherit;\n  transform-origin: left top;\n  transition: transform 0.36s cubic-bezier(0.4, 0, 0.2, 1), max-width 0.324s cubic-bezier(0.4, 0, 0.2, 1);\n  -webkit-backface-visibility: hidden;\n          backface-visibility: hidden;\n}\n.q-field--float .q-field__label {\n  max-width: 133%;\n  transform: translateY(-40%) scale(0.75);\n  transition: transform 0.36s cubic-bezier(0.4, 0, 0.2, 1), max-width 0.396s cubic-bezier(0.4, 0, 0.2, 1);\n}\n.q-field--highlighted .q-field__label {\n  color: currentColor;\n}\n.q-field--highlighted .q-field__shadow {\n  opacity: 0.5;\n}\n.q-field--filled .q-field__control {\n  padding: 0 12px;\n  background: rgba(0, 0, 0, 0.05);\n  border-radius: 4px 4px 0 0;\n}\n.q-field--filled .q-field__control:before {\n  background: rgba(0, 0, 0, 0.05);\n  border-bottom: 1px solid rgba(0, 0, 0, 0.42);\n  opacity: 0;\n  transition: opacity 0.36s cubic-bezier(0.4, 0, 0.2, 1), background 0.36s cubic-bezier(0.4, 0, 0.2, 1);\n}\n.q-field--filled .q-field__control:hover:before {\n  opacity: 1;\n}\n.q-field--filled .q-field__control:after {\n  height: 2px;\n  top: auto;\n  transform-origin: center bottom;\n  transform: scale3d(0, 1, 1);\n  background: currentColor;\n  transition: transform 0.36s cubic-bezier(0.4, 0, 0.2, 1);\n}\n.q-field--filled.q-field--rounded .q-field__control {\n  border-radius: 28px 28px 0 0;\n}\n.q-field--filled.q-field--highlighted .q-field__control:before {\n  opacity: 1;\n  background: rgba(0, 0, 0, 0.12);\n}\n.q-field--filled.q-field--highlighted .q-field__control:after {\n  transform: scale3d(1, 1, 1);\n}\n.q-field--filled.q-field--dark .q-field__control, .q-field--filled.q-field--dark .q-field__control:before {\n  background: rgba(255, 255, 255, 0.07);\n}\n.q-field--filled.q-field--dark.q-field--highlighted .q-field__control:before {\n  background: rgba(255, 255, 255, 0.1);\n}\n.q-field--filled.q-field--readonly .q-field__control:before {\n  opacity: 1;\n  background: transparent;\n  border-bottom-style: dashed;\n}\n.q-field--outlined .q-field__control {\n  border-radius: 4px;\n  padding: 0 12px;\n}\n.q-field--outlined .q-field__control:before {\n  border: 1px solid rgba(0, 0, 0, 0.24);\n  transition: border-color 0.36s cubic-bezier(0.4, 0, 0.2, 1);\n}\n.q-field--outlined .q-field__control:hover:before {\n  border-color: #000;\n}\n.q-field--outlined .q-field__control:after {\n  height: inherit;\n  border-radius: inherit;\n  border: 2px solid transparent;\n  transition: border-color 0.36s cubic-bezier(0.4, 0, 0.2, 1);\n}\n.q-field--outlined .q-field__native:-webkit-autofill,\n.q-field--outlined .q-field__input:-webkit-autofill {\n  margin-top: 1px;\n  margin-bottom: 1px;\n}\n.q-field--outlined.q-field--rounded .q-field__control {\n  border-radius: 28px;\n}\n.q-field--outlined.q-field--highlighted .q-field__control:hover:before {\n  border-color: transparent;\n}\n.q-field--outlined.q-field--highlighted .q-field__control:after {\n  border-color: currentColor;\n  border-width: 2px;\n  transform: scale3d(1, 1, 1);\n}\n.q-field--outlined.q-field--readonly .q-field__control:before {\n  border-style: dashed;\n}\n.q-field--standard .q-field__control:before {\n  border-bottom: 1px solid rgba(0, 0, 0, 0.24);\n  transition: border-color 0.36s cubic-bezier(0.4, 0, 0.2, 1);\n}\n.q-field--standard .q-field__control:hover:before {\n  border-color: #000;\n}\n.q-field--standard .q-field__control:after {\n  height: 2px;\n  top: auto;\n  border-bottom-left-radius: inherit;\n  border-bottom-right-radius: inherit;\n  transform-origin: center bottom;\n  transform: scale3d(0, 1, 1);\n  background: currentColor;\n  transition: transform 0.36s cubic-bezier(0.4, 0, 0.2, 1);\n}\n.q-field--standard.q-field--highlighted .q-field__control:after {\n  transform: scale3d(1, 1, 1);\n}\n.q-field--standard.q-field--readonly .q-field__control:before {\n  border-bottom-style: dashed;\n}\n.q-field--dark .q-field__control:before {\n  border-color: rgba(255, 255, 255, 0.6);\n}\n.q-field--dark .q-field__control:hover:before {\n  border-color: #fff;\n}\n.q-field--dark .q-field__native, .q-field--dark .q-field__prefix, .q-field--dark .q-field__suffix, .q-field--dark .q-field__input {\n  color: #fff;\n}\n.q-field--dark:not(.q-field--highlighted) .q-field__label, .q-field--dark .q-field__marginal, .q-field--dark .q-field__bottom {\n  color: rgba(255, 255, 255, 0.7);\n}\n.q-field--standout .q-field__control {\n  padding: 0 12px;\n  background: rgba(0, 0, 0, 0.05);\n  border-radius: 4px;\n  transition: box-shadow 0.36s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.36s cubic-bezier(0.4, 0, 0.2, 1);\n}\n.q-field--standout .q-field__control:before {\n  background: rgba(0, 0, 0, 0.07);\n  opacity: 0;\n  transition: opacity 0.36s cubic-bezier(0.4, 0, 0.2, 1), background 0.36s cubic-bezier(0.4, 0, 0.2, 1);\n}\n.q-field--standout .q-field__control:hover:before {\n  opacity: 1;\n}\n.q-field--standout.q-field--rounded .q-field__control {\n  border-radius: 28px;\n}\n.q-field--standout.q-field--highlighted .q-field__control {\n  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12);\n  background: #000;\n}\n.q-field--standout.q-field--highlighted .q-field__native, .q-field--standout.q-field--highlighted .q-field__prefix, .q-field--standout.q-field--highlighted .q-field__suffix, .q-field--standout.q-field--highlighted .q-field__prepend, .q-field--standout.q-field--highlighted .q-field__append, .q-field--standout.q-field--highlighted .q-field__input {\n  color: #fff;\n}\n.q-field--standout.q-field--readonly .q-field__control:before {\n  opacity: 1;\n  background: transparent;\n  border: 1px dashed rgba(0, 0, 0, 0.24);\n}\n.q-field--standout.q-field--dark .q-field__control {\n  background: rgba(255, 255, 255, 0.07);\n}\n.q-field--standout.q-field--dark .q-field__control:before {\n  background: rgba(255, 255, 255, 0.07);\n}\n.q-field--standout.q-field--dark.q-field--highlighted .q-field__control {\n  background: #fff;\n}\n.q-field--standout.q-field--dark.q-field--highlighted .q-field__native, .q-field--standout.q-field--dark.q-field--highlighted .q-field__prefix, .q-field--standout.q-field--dark.q-field--highlighted .q-field__suffix, .q-field--standout.q-field--dark.q-field--highlighted .q-field__prepend, .q-field--standout.q-field--dark.q-field--highlighted .q-field__append, .q-field--standout.q-field--dark.q-field--highlighted .q-field__input {\n  color: #000;\n}\n.q-field--standout.q-field--dark.q-field--readonly .q-field__control:before {\n  border-color: rgba(255, 255, 255, 0.24);\n}\n.q-field--labeled .q-field__native, .q-field--labeled .q-field__prefix, .q-field--labeled .q-field__suffix {\n  line-height: 24px;\n  padding-top: 24px;\n  padding-bottom: 8px;\n}\n.q-field--labeled .q-field__shadow {\n  top: 0;\n}\n.q-field--labeled:not(.q-field--float) .q-field__prefix, .q-field--labeled:not(.q-field--float) .q-field__suffix {\n  opacity: 0;\n}\n.q-field--labeled:not(.q-field--float) .q-field__native::placeholder, .q-field--labeled:not(.q-field--float) .q-field__input::placeholder {\n  color: transparent;\n}\n.q-field--labeled.q-field--dense .q-field__native, .q-field--labeled.q-field--dense .q-field__prefix, .q-field--labeled.q-field--dense .q-field__suffix {\n  padding-top: 14px;\n  padding-bottom: 2px;\n}\n.q-field--dense .q-field__shadow {\n  top: 0;\n}\n.q-field--dense .q-field__control, .q-field--dense .q-field__marginal {\n  height: 40px;\n}\n.q-field--dense .q-field__bottom {\n  font-size: 11px;\n}\n.q-field--dense .q-field__label {\n  font-size: 14px;\n  top: 10px;\n}\n.q-field--dense .q-field__before, .q-field--dense .q-field__prepend {\n  padding-right: 6px;\n}\n.q-field--dense .q-field__after, .q-field--dense .q-field__append {\n  padding-left: 6px;\n}\n.q-field--dense .q-field__append + .q-field__append {\n  padding-left: 2px;\n}\n.q-field--dense .q-field__marginal .q-avatar {\n  font-size: 24px;\n}\n.q-field--dense.q-field--float .q-field__label {\n  transform: translateY(-30%) scale(0.75);\n}\n.q-field--dense .q-field__native:-webkit-autofill + .q-field__label, .q-field--dense .q-field__input:-webkit-autofill + .q-field__label {\n  transform: translateY(-30%) scale(0.75);\n}\n.q-field--dense .q-field__native[type=number]:invalid + .q-field__label, .q-field--dense .q-field__input[type=number]:invalid + .q-field__label {\n  transform: translateY(-30%) scale(0.75);\n}\n.q-field--borderless .q-field__bottom, .q-field--borderless.q-field--dense .q-field__control, .q-field--standard .q-field__bottom, .q-field--standard.q-field--dense .q-field__control {\n  padding-left: 0;\n  padding-right: 0;\n}\n.q-field--error .q-field__label {\n  animation: q-field-label 0.36s;\n}\n.q-field--error .q-field__bottom {\n  color: var(--q-negative);\n}\n.q-field__focusable-action {\n  opacity: 0.6;\n  cursor: pointer;\n  outline: 0 !important;\n  border: 0;\n  color: inherit;\n  background: transparent;\n  padding: 0;\n}\n.q-field__focusable-action:hover, .q-field__focusable-action:focus {\n  opacity: 1;\n}\n.q-field--auto-height .q-field__control {\n  height: auto;\n}\n.q-field--auto-height .q-field__control, .q-field--auto-height .q-field__native {\n  min-height: 56px;\n}\n.q-field--auto-height .q-field__native {\n  align-items: center;\n}\n.q-field--auto-height .q-field__control-container {\n  padding-top: 0;\n}\n.q-field--auto-height .q-field__native, .q-field--auto-height .q-field__prefix, .q-field--auto-height .q-field__suffix {\n  line-height: 18px;\n}\n.q-field--auto-height.q-field--labeled .q-field__control-container {\n  padding-top: 24px;\n}\n.q-field--auto-height.q-field--labeled .q-field__shadow {\n  top: 24px;\n}\n.q-field--auto-height.q-field--labeled .q-field__native, .q-field--auto-height.q-field--labeled .q-field__prefix, .q-field--auto-height.q-field--labeled .q-field__suffix {\n  padding-top: 0;\n}\n.q-field--auto-height.q-field--labeled .q-field__native {\n  min-height: 24px;\n}\n.q-field--auto-height.q-field--dense .q-field__control, .q-field--auto-height.q-field--dense .q-field__native {\n  min-height: 40px;\n}\n.q-field--auto-height.q-field--dense.q-field--labeled .q-field__control-container {\n  padding-top: 14px;\n}\n.q-field--auto-height.q-field--dense.q-field--labeled .q-field__shadow {\n  top: 14px;\n}\n.q-field--auto-height.q-field--dense.q-field--labeled .q-field__native {\n  min-height: 24px;\n}\n.q-field--square .q-field__control {\n  border-radius: 0 !important;\n}\n.q-transition--field-message-enter-active, .q-transition--field-message-leave-active {\n  transition: transform 0.6s cubic-bezier(0.86, 0, 0.07, 1), opacity 0.6s cubic-bezier(0.86, 0, 0.07, 1);\n}\n.q-transition--field-message-enter-from, .q-transition--field-message-leave-to {\n  opacity: 0;\n  transform: translateY(-10px);\n}\n.q-transition--field-message-leave-from, .q-transition--field-message-leave-active {\n  position: absolute;\n}\n@keyframes q-field-label {\n  40% {\n    margin-left: 2px;\n  }\n  60%, 80% {\n    margin-left: -2px;\n  }\n  70%, 90% {\n    margin-left: 2px;\n  }\n}\n@keyframes q-autofill {\n  to {\n    background: transparent;\n    color: inherit;\n  }\n}\n.q-file .q-field__native {\n  word-break: break-all;\n  overflow: hidden;\n}\n.q-file .q-field__input {\n  opacity: 0 !important;\n}\n.q-file .q-field__input::-webkit-file-upload-button {\n  cursor: pointer;\n}\n.q-file__filler {\n  visibility: hidden;\n  width: 100%;\n  border: none;\n  padding: 0;\n}\n.q-file__dnd {\n  outline: 1px dashed currentColor;\n  outline-offset: -4px;\n}\n.q-form {\n  position: relative;\n}\n.q-img {\n  position: relative;\n  width: 100%;\n  display: inline-block;\n  vertical-align: middle;\n  overflow: hidden;\n}\n.q-img__loading .q-spinner {\n  font-size: 50px;\n}\n.q-img__container {\n  border-radius: inherit;\n  font-size: 0;\n}\n.q-img__image {\n  border-radius: inherit;\n  width: 100%;\n  height: 100%;\n  opacity: 0;\n}\n.q-img__image--with-transition {\n  transition: opacity 0.28s ease-in;\n}\n.q-img__image--loaded {\n  opacity: 1;\n}\n.q-img__content {\n  border-radius: inherit;\n  pointer-events: none;\n}\n.q-img__content > div {\n  pointer-events: all;\n  position: absolute;\n  padding: 16px;\n  color: #fff;\n  background: rgba(0, 0, 0, 0.47);\n}\n.q-img--no-menu .q-img__image,\n.q-img--no-menu .q-img__placeholder {\n  pointer-events: none;\n}\n.q-inner-loading {\n  background: rgba(255, 255, 255, 0.6);\n}\n.q-inner-loading--dark {\n  background: rgba(0, 0, 0, 0.4);\n}\n.q-inner-loading__label {\n  margin-top: 8px;\n}\n.q-textarea .q-field__control {\n  min-height: 56px;\n  height: auto;\n}\n.q-textarea .q-field__control-container {\n  padding-top: 2px;\n  padding-bottom: 2px;\n}\n.q-textarea .q-field__shadow {\n  top: 2px;\n  bottom: 2px;\n}\n.q-textarea .q-field__native, .q-textarea .q-field__prefix, .q-textarea .q-field__suffix {\n  line-height: 18px;\n}\n.q-textarea .q-field__native {\n  resize: vertical;\n  padding-top: 17px;\n  min-height: 52px;\n}\n.q-textarea.q-field--labeled .q-field__control-container {\n  padding-top: 26px;\n}\n.q-textarea.q-field--labeled .q-field__shadow {\n  top: 26px;\n}\n.q-textarea.q-field--labeled .q-field__native, .q-textarea.q-field--labeled .q-field__prefix, .q-textarea.q-field--labeled .q-field__suffix {\n  padding-top: 0;\n}\n.q-textarea.q-field--labeled .q-field__native {\n  min-height: 26px;\n  padding-top: 1px;\n}\n.q-textarea--autogrow .q-field__native {\n  resize: none;\n}\n.q-textarea.q-field--dense .q-field__control, .q-textarea.q-field--dense .q-field__native {\n  min-height: 36px;\n}\n.q-textarea.q-field--dense .q-field__native {\n  padding-top: 9px;\n}\n.q-textarea.q-field--dense.q-field--labeled .q-field__control-container {\n  padding-top: 14px;\n}\n.q-textarea.q-field--dense.q-field--labeled .q-field__shadow {\n  top: 14px;\n}\n.q-textarea.q-field--dense.q-field--labeled .q-field__native {\n  min-height: 24px;\n  padding-top: 3px;\n}\n.q-textarea.q-field--dense.q-field--labeled .q-field__prefix, .q-textarea.q-field--dense.q-field--labeled .q-field__suffix {\n  padding-top: 2px;\n}\nbody.mobile .q-textarea .q-field__native,\n.q-textarea.disabled .q-field__native {\n  resize: none;\n}\n.q-intersection {\n  position: relative;\n}\n.q-item {\n  min-height: 48px;\n  padding: 8px 16px;\n  color: inherit;\n  transition: color 0.3s, background-color 0.3s;\n}\n.q-item__section--side {\n  color: #757575;\n  align-items: flex-start;\n  padding-right: 16px;\n  width: auto;\n  min-width: 0;\n  max-width: 100%;\n}\n.q-item__section--side > .q-icon {\n  font-size: 24px;\n}\n.q-item__section--side > .q-avatar {\n  font-size: 40px;\n}\n.q-item__section--avatar {\n  color: inherit;\n  min-width: 56px;\n}\n.q-item__section--thumbnail img {\n  width: 100px;\n  height: 56px;\n}\n.q-item__section--nowrap {\n  white-space: nowrap;\n}\n.q-item > .q-item__section--thumbnail:first-child,\n.q-item > .q-focus-helper + .q-item__section--thumbnail {\n  margin-left: -16px;\n}\n.q-item > .q-item__section--thumbnail:last-of-type {\n  margin-right: -16px;\n}\n.q-item__label {\n  line-height: 1.2em !important;\n  max-width: 100%;\n}\n.q-item__label--overline {\n  color: rgba(0, 0, 0, 0.7);\n}\n.q-item__label--caption {\n  color: rgba(0, 0, 0, 0.54);\n}\n.q-item__label--header {\n  color: #757575;\n  padding: 16px;\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n  letter-spacing: 0.01786em;\n}\n.q-separator--spaced + .q-item__label--header, .q-list--padding .q-item__label--header {\n  padding-top: 8px;\n}\n.q-item__label + .q-item__label {\n  margin-top: 4px;\n}\n.q-item__section--main {\n  width: auto;\n  min-width: 0;\n  max-width: 100%;\n  flex: 10000 1 0%;\n}\n.q-item__section--main + .q-item__section--main {\n  margin-left: 8px;\n}\n.q-item__section--main ~ .q-item__section--side {\n  align-items: flex-end;\n  padding-right: 0;\n  padding-left: 16px;\n}\n.q-item__section--main.q-item__section--thumbnail {\n  margin-left: 0;\n  margin-right: -16px;\n}\n.q-list--bordered {\n  border: 1px solid rgba(0, 0, 0, 0.12);\n}\n.q-list--separator > .q-item-type + .q-item-type,\n.q-list--separator > .q-virtual-scroll__content > .q-item-type + .q-item-type {\n  border-top: 1px solid rgba(0, 0, 0, 0.12);\n}\n.q-list--padding {\n  padding: 8px 0;\n}\n.q-list--dense > .q-item, .q-item--dense {\n  min-height: 32px;\n  padding: 2px 16px;\n}\n.q-list--dark.q-list--separator > .q-item-type + .q-item-type,\n.q-list--dark.q-list--separator > .q-virtual-scroll__content > .q-item-type + .q-item-type {\n  border-top-color: rgba(255, 255, 255, 0.28);\n}\n.q-list--dark, .q-item--dark {\n  color: #fff;\n  border-color: rgba(255, 255, 255, 0.28);\n}\n.q-list--dark .q-item__section--side:not(.q-item__section--avatar), .q-item--dark .q-item__section--side:not(.q-item__section--avatar) {\n  color: rgba(255, 255, 255, 0.7);\n}\n.q-list--dark .q-item__label--header, .q-item--dark .q-item__label--header {\n  color: rgba(255, 255, 255, 0.64);\n}\n.q-list--dark .q-item__label--overline, .q-list--dark .q-item__label--caption, .q-item--dark .q-item__label--overline, .q-item--dark .q-item__label--caption {\n  color: rgba(255, 255, 255, 0.8);\n}\n.q-item {\n  position: relative;\n}\n.q-item.q-router-link--active, .q-item--active {\n  color: var(--q-primary);\n}\n.q-knob {\n  font-size: 48px;\n}\n.q-knob--editable {\n  cursor: pointer;\n  outline: 0;\n}\n.q-knob--editable:before {\n  content: "";\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  border-radius: 50%;\n  box-shadow: none;\n  transition: box-shadow 0.24s ease-in-out;\n}\n.q-knob--editable:focus:before {\n  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px rgba(0, 0, 0, 0.14), 0 1px 10px rgba(0, 0, 0, 0.12);\n}\n.q-layout {\n  width: 100%;\n}\n.q-layout-container {\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\n.q-layout-container .q-layout {\n  min-height: 100%;\n}\n.q-layout-container > div {\n  transform: translate3d(0, 0, 0);\n}\n.q-layout-container > div > div {\n  min-height: 0;\n  max-height: 100%;\n}\n.q-layout__shadow {\n  width: 100%;\n}\n.q-layout__shadow:after {\n  content: "";\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.2), 0 0px 10px rgba(0, 0, 0, 0.24);\n}\n.q-layout__section--marginal {\n  background-color: var(--q-primary);\n  color: #fff;\n}\n.q-header--hidden {\n  transform: translateY(-110%);\n}\n.q-header--bordered {\n  border-bottom: 1px solid rgba(0, 0, 0, 0.12);\n}\n.q-header .q-layout__shadow {\n  bottom: -10px;\n}\n.q-header .q-layout__shadow:after {\n  bottom: 10px;\n}\n.q-footer--hidden {\n  transform: translateY(110%);\n}\n.q-footer--bordered {\n  border-top: 1px solid rgba(0, 0, 0, 0.12);\n}\n.q-footer .q-layout__shadow {\n  top: -10px;\n}\n.q-footer .q-layout__shadow:after {\n  top: 10px;\n}\n.q-header, .q-footer {\n  z-index: 2000;\n}\n.q-drawer {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  background: #fff;\n  z-index: 1000;\n}\n.q-drawer--on-top {\n  z-index: 3000;\n}\n.q-drawer--left {\n  left: 0;\n  transform: translateX(-100%);\n}\n.q-drawer--left.q-drawer--bordered {\n  border-right: 1px solid rgba(0, 0, 0, 0.12);\n}\n.q-drawer--left .q-layout__shadow {\n  left: 10px;\n  right: -10px;\n}\n.q-drawer--left .q-layout__shadow:after {\n  right: 10px;\n}\n.q-drawer--right {\n  right: 0;\n  transform: translateX(100%);\n}\n.q-drawer--right.q-drawer--bordered {\n  border-left: 1px solid rgba(0, 0, 0, 0.12);\n}\n.q-drawer--right .q-layout__shadow {\n  left: -10px;\n}\n.q-drawer--right .q-layout__shadow:after {\n  left: 10px;\n}\n.q-drawer-container:not(.q-drawer--mini-animate) .q-drawer--mini {\n  padding: 0 !important;\n}\n.q-drawer-container:not(.q-drawer--mini-animate) .q-drawer--mini .q-item, .q-drawer-container:not(.q-drawer--mini-animate) .q-drawer--mini .q-item__section {\n  text-align: center;\n  justify-content: center;\n  padding-left: 0;\n  padding-right: 0;\n  min-width: 0;\n}\n.q-drawer-container:not(.q-drawer--mini-animate) .q-drawer--mini .q-item__label, .q-drawer-container:not(.q-drawer--mini-animate) .q-drawer--mini .q-item__section--main, .q-drawer-container:not(.q-drawer--mini-animate) .q-drawer--mini .q-item__section--side ~ .q-item__section--side {\n  display: none;\n}\n.q-drawer--mini .q-mini-drawer-hide, .q-drawer--mini .q-expansion-item__content {\n  display: none;\n}\n.q-drawer--mini-animate .q-drawer__content {\n  overflow-x: hidden !important;\n  white-space: nowrap;\n}\n.q-drawer--standard .q-mini-drawer-only {\n  display: none;\n}\n.q-drawer--mobile .q-mini-drawer-only, .q-drawer--mobile .q-mini-drawer-hide {\n  display: none;\n}\n.q-drawer__backdrop {\n  z-index: 2999 !important;\n  will-change: background-color;\n}\n.q-drawer__opener {\n  z-index: 2001;\n  height: 100%;\n  width: 15px;\n  -webkit-user-select: none;\n          user-select: none;\n}\n.q-layout, .q-header, .q-footer, .q-page {\n  position: relative;\n}\n.q-page-sticky--shrink {\n  pointer-events: none;\n}\n.q-page-sticky--shrink > div {\n  display: inline-block;\n  pointer-events: auto;\n}\nbody.q-ios-padding .q-layout--standard .q-header > .q-toolbar:nth-child(1),\nbody.q-ios-padding .q-layout--standard .q-header > .q-tabs:nth-child(1) .q-tabs-head,\nbody.q-ios-padding .q-layout--standard .q-drawer--top-padding .q-drawer__content {\n  padding-top: 20px;\n  min-height: 70px;\n  padding-top: env(safe-area-inset-top);\n  min-height: calc(env(safe-area-inset-top) + 50px);\n}\nbody.q-ios-padding .q-layout--standard .q-footer > .q-toolbar:last-child,\nbody.q-ios-padding .q-layout--standard .q-footer > .q-tabs:last-child .q-tabs-head,\nbody.q-ios-padding .q-layout--standard .q-drawer--top-padding .q-drawer__content {\n  padding-bottom: env(safe-area-inset-bottom);\n  min-height: calc(env(safe-area-inset-bottom) + 50px);\n}\n.q-body--layout-animate .q-drawer__backdrop {\n  transition: background-color 0.12s !important;\n}\n.q-body--layout-animate .q-drawer {\n  transition: transform 0.12s, width 0.12s, top 0.12s, bottom 0.12s !important;\n}\n.q-body--layout-animate .q-layout__section--marginal {\n  transition: transform 0.12s, left 0.12s, right 0.12s !important;\n}\n.q-body--layout-animate .q-page-container {\n  transition: padding-top 0.12s, padding-right 0.12s, padding-bottom 0.12s, padding-left 0.12s !important;\n}\n.q-body--layout-animate .q-page-sticky {\n  transition: transform 0.12s, left 0.12s, right 0.12s, top 0.12s, bottom 0.12s !important;\n}\nbody:not(.q-body--layout-animate) .q-layout--prevent-focus {\n  visibility: hidden;\n}\n.q-body--drawer-toggle {\n  overflow-x: hidden !important;\n}\n@media (max-width: 599.98px) {\n  .q-layout-padding {\n    padding: 8px;\n  }\n}\n@media (min-width: 600px) and (max-width: 1439.98px) {\n  .q-layout-padding {\n    padding: 16px;\n  }\n}\n@media (min-width: 1440px) {\n  .q-layout-padding {\n    padding: 24px;\n  }\n}\nbody.body--dark .q-header, body.body--dark .q-footer, body.body--dark .q-drawer {\n  border-color: rgba(255, 255, 255, 0.28);\n}\nbody.platform-ios .q-layout--containerized {\n  position: unset !important;\n}\n.q-linear-progress {\n  --q-linear-progress-speed: .3s;\n  position: relative;\n  width: 100%;\n  overflow: hidden;\n  font-size: 4px;\n  height: 1em;\n  color: var(--q-primary);\n  transform: scale3d(1, 1, 1);\n}\n.q-linear-progress__model, .q-linear-progress__track {\n  transform-origin: 0 0;\n}\n.q-linear-progress__model--with-transition, .q-linear-progress__track--with-transition {\n  transition: transform var(--q-linear-progress-speed);\n}\n.q-linear-progress--reverse .q-linear-progress__model, .q-linear-progress--reverse .q-linear-progress__track {\n  transform-origin: 0 100%;\n}\n.q-linear-progress__model--determinate {\n  background: currentColor;\n}\n.q-linear-progress__model--indeterminate, .q-linear-progress__model--query {\n  transition: none;\n}\n.q-linear-progress__model--indeterminate:before, .q-linear-progress__model--indeterminate:after, .q-linear-progress__model--query:before, .q-linear-progress__model--query:after {\n  background: currentColor;\n  content: "";\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  transform-origin: 0 0;\n}\n.q-linear-progress__model--indeterminate:before, .q-linear-progress__model--query:before {\n  animation: q-linear-progress--indeterminate 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;\n}\n.q-linear-progress__model--indeterminate:after, .q-linear-progress__model--query:after {\n  transform: translate3d(-101%, 0, 0) scale3d(1, 1, 1);\n  animation: q-linear-progress--indeterminate-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;\n  animation-delay: 1.15s;\n}\n.q-linear-progress__track {\n  opacity: 0.4;\n}\n.q-linear-progress__track--light {\n  background: rgba(0, 0, 0, 0.26);\n}\n.q-linear-progress__track--dark {\n  background: rgba(255, 255, 255, 0.6);\n}\n.q-linear-progress__stripe {\n  transition: width var(--q-linear-progress-speed);\n  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, rgba(255, 255, 255, 0) 25%, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, rgba(255, 255, 255, 0) 75%, rgba(255, 255, 255, 0)) !important;\n  background-size: 40px 40px !important;\n}\n@keyframes q-linear-progress--indeterminate {\n  0% {\n    transform: translate3d(-35%, 0, 0) scale3d(0.35, 1, 1);\n  }\n  60% {\n    transform: translate3d(100%, 0, 0) scale3d(0.9, 1, 1);\n  }\n  100% {\n    transform: translate3d(100%, 0, 0) scale3d(0.9, 1, 1);\n  }\n}\n@keyframes q-linear-progress--indeterminate-short {\n  0% {\n    transform: translate3d(-101%, 0, 0) scale3d(1, 1, 1);\n  }\n  60% {\n    transform: translate3d(107%, 0, 0) scale3d(0.01, 1, 1);\n  }\n  100% {\n    transform: translate3d(107%, 0, 0) scale3d(0.01, 1, 1);\n  }\n}\n.q-menu {\n  position: fixed !important;\n  display: inline-block;\n  max-width: 95vw;\n  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12);\n  background: #fff;\n  border-radius: 4px;\n  overflow-y: auto;\n  overflow-x: hidden;\n  outline: 0;\n  max-height: 65vh;\n  z-index: 6000;\n}\n.q-menu--square {\n  border-radius: 0;\n}\n.q-option-group--inline > div {\n  display: inline-block;\n}\n.q-pagination input {\n  text-align: center;\n  -moz-appearance: textfield;\n}\n.q-pagination input::-webkit-outer-spin-button,\n.q-pagination input::-webkit-inner-spin-button {\n  -webkit-appearance: none;\n  margin: 0;\n}\n.q-parallax {\n  position: relative;\n  width: 100%;\n  overflow: hidden;\n  border-radius: inherit;\n}\n.q-parallax__media > img, .q-parallax__media > video {\n  position: absolute;\n  left: 50% /* rtl:ignore */;\n  bottom: 0;\n  min-width: 100%;\n  min-height: 100%;\n  will-change: transform;\n  display: none;\n}\n.q-popup-edit {\n  padding: 8px 16px;\n}\n.q-popup-edit__buttons {\n  margin-top: 8px;\n}\n.q-popup-edit__buttons .q-btn + .q-btn {\n  margin-left: 8px;\n}\n.q-pull-to-refresh {\n  position: relative;\n}\n.q-pull-to-refresh__puller {\n  border-radius: 50%;\n  width: 40px;\n  height: 40px;\n  color: var(--q-primary);\n  background: #fff;\n  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.3);\n}\n.q-pull-to-refresh__puller--animating {\n  transition: transform 0.3s, opacity 0.3s;\n}\n.q-radio {\n  vertical-align: middle;\n}\n.q-radio__native {\n  width: 1px;\n  height: 1px;\n}\n.q-radio__bg, .q-radio__icon-container {\n  -webkit-user-select: none;\n          user-select: none;\n}\n.q-radio__bg {\n  top: 25%;\n  left: 25%;\n  width: 50%;\n  height: 50%;\n  -webkit-print-color-adjust: exact;\n}\n.q-radio__bg path {\n  fill: currentColor;\n}\n.q-radio__icon {\n  color: currentColor;\n  font-size: 0.5em;\n}\n.q-radio__check {\n  transform-origin: 50% 50%;\n  transform: scale3d(0, 0, 1);\n  transition: transform 0.22s cubic-bezier(0, 0, 0.2, 1) 0ms;\n}\n.q-radio__inner {\n  font-size: 40px;\n  width: 1em;\n  min-width: 1em;\n  height: 1em;\n  outline: 0;\n  border-radius: 50%;\n  color: rgba(0, 0, 0, 0.54);\n}\n.q-radio__inner--truthy {\n  color: var(--q-primary);\n}\n.q-radio__inner--truthy .q-radio__check {\n  transform: scale3d(1, 1, 1);\n}\n.q-radio.disabled {\n  opacity: 0.75 !important;\n}\n.q-radio--dark .q-radio__inner {\n  color: rgba(255, 255, 255, 0.7);\n}\n.q-radio--dark .q-radio__inner:before {\n  opacity: 0.32 !important;\n}\n.q-radio--dark .q-radio__inner--truthy {\n  color: var(--q-primary);\n}\n.q-radio--dense .q-radio__inner {\n  width: 0.5em;\n  min-width: 0.5em;\n  height: 0.5em;\n}\n.q-radio--dense .q-radio__bg {\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n}\n.q-radio--dense .q-radio__label {\n  padding-left: 0.5em;\n}\n.q-radio--dense.reverse .q-radio__label {\n  padding-left: 0;\n  padding-right: 0.5em;\n}\nbody.desktop .q-radio:not(.disabled) .q-radio__inner:before {\n  content: "";\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  border-radius: 50%;\n  background: currentColor;\n  opacity: 0.12;\n  transform: scale3d(0, 0, 1);\n  transition: transform 0.22s cubic-bezier(0, 0, 0.2, 1) 0ms;\n}\nbody.desktop .q-radio:not(.disabled):focus .q-radio__inner:before, body.desktop .q-radio:not(.disabled):hover .q-radio__inner:before {\n  transform: scale3d(1, 1, 1);\n}\nbody.desktop .q-radio--dense:not(.disabled):focus .q-radio__inner:before, body.desktop .q-radio--dense:not(.disabled):hover .q-radio__inner:before {\n  transform: scale3d(1.5, 1.5, 1);\n}\n.q-rating {\n  color: #ffeb3b;\n  vertical-align: middle;\n}\n.q-rating__icon-container {\n  height: 1em;\n  outline: 0;\n}\n.q-rating__icon-container + .q-rating__icon-container {\n  margin-left: 2px;\n}\n.q-rating__icon {\n  color: currentColor;\n  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);\n  position: relative;\n  opacity: 0.4;\n  transition: transform 0.2s ease-in, opacity 0.2s ease-in;\n}\n.q-rating__icon--hovered {\n  transform: scale(1.3);\n}\n.q-rating__icon--active {\n  opacity: 1;\n}\n.q-rating__icon--exselected {\n  opacity: 0.7;\n}\n.q-rating--no-dimming .q-rating__icon {\n  opacity: 1;\n}\n.q-rating--editable .q-rating__icon-container {\n  cursor: pointer;\n}\n.q-responsive {\n  position: relative;\n  max-width: 100%;\n  max-height: 100%;\n}\n.q-responsive__filler {\n  width: inherit;\n  max-width: inherit;\n  height: inherit;\n  max-height: inherit;\n}\n.q-responsive__content {\n  border-radius: inherit;\n}\n.q-responsive__content > * {\n  width: 100% !important;\n  height: 100% !important;\n  max-height: 100% !important;\n  max-width: 100% !important;\n}\n.q-scrollarea {\n  position: relative;\n  contain: strict;\n}\n.q-scrollarea__bar, .q-scrollarea__thumb {\n  opacity: 0.2;\n  transition: opacity 0.3s;\n  will-change: opacity;\n  cursor: grab;\n}\n.q-scrollarea__bar--v, .q-scrollarea__thumb--v {\n  right: 0;\n  width: 10px;\n}\n.q-scrollarea__bar--h, .q-scrollarea__thumb--h {\n  bottom: 0;\n  height: 10px;\n}\n.q-scrollarea__bar--invisible, .q-scrollarea__thumb--invisible {\n  opacity: 0 !important;\n  pointer-events: none;\n}\n.q-scrollarea__thumb {\n  background: #000;\n  border-radius: 3px;\n}\n.q-scrollarea__thumb:hover {\n  opacity: 0.3;\n}\n.q-scrollarea__thumb:active {\n  opacity: 0.5;\n}\n.q-scrollarea__content {\n  min-height: 100%;\n  min-width: 100%;\n}\n.q-scrollarea--dark .q-scrollarea__thumb {\n  background: #fff;\n}\n.q-select--without-input .q-field__control {\n  cursor: pointer;\n}\n.q-select--with-input .q-field__control {\n  cursor: text;\n}\n.q-select .q-field__input {\n  min-width: 50px !important;\n  cursor: text;\n}\n.q-select .q-field__input--padding {\n  padding-left: 4px;\n}\n.q-select__focus-target, .q-select__autocomplete-input {\n  position: absolute;\n  outline: 0 !important;\n  width: 0;\n  height: 0;\n  padding: 0;\n  border: 0;\n  opacity: 0;\n}\n.q-select__dropdown-icon {\n  cursor: pointer;\n  transition: transform 0.28s;\n}\n.q-select.q-field--readonly .q-field__control, .q-select.q-field--readonly .q-select__dropdown-icon {\n  cursor: default;\n}\n.q-select__dialog {\n  width: 90vw !important;\n  max-width: 90vw !important;\n  max-height: calc(100vh - 70px) !important;\n  background: #fff;\n  display: flex;\n  flex-direction: column;\n}\n.q-select__dialog > .scroll {\n  position: relative;\n  background: inherit;\n}\nbody.mobile:not(.native-mobile) .q-select__dialog {\n  max-height: calc(100vh - 108px) !important;\n}\nbody.platform-android.native-mobile .q-dialog__inner--top .q-select__dialog {\n  max-height: calc(100vh - 24px) !important;\n}\nbody.platform-android:not(.native-mobile) .q-dialog__inner--top .q-select__dialog {\n  max-height: calc(100vh - 80px) !important;\n}\nbody.platform-ios.native-mobile .q-dialog__inner--top > div {\n  border-radius: 4px;\n}\nbody.platform-ios.native-mobile .q-dialog__inner--top .q-select__dialog--focused {\n  max-height: 47vh !important;\n}\nbody.platform-ios:not(.native-mobile) .q-dialog__inner--top .q-select__dialog--focused {\n  max-height: 50vh !important;\n}\n.q-separator {\n  border: 0;\n  background: rgba(0, 0, 0, 0.12);\n  margin: 0;\n  transition: background 0.3s, opacity 0.3s;\n  flex-shrink: 0;\n}\n.q-separator--dark {\n  background: rgba(255, 255, 255, 0.28);\n}\n.q-separator--horizontal {\n  display: block;\n  height: 1px;\n}\n.q-separator--horizontal-inset {\n  margin-left: 16px;\n  margin-right: 16px;\n}\n.q-separator--horizontal-item-inset {\n  margin-left: 72px;\n  margin-right: 0;\n}\n.q-separator--horizontal-item-thumbnail-inset {\n  margin-left: 116px;\n  margin-right: 0;\n}\n.q-separator--vertical {\n  width: 1px;\n  height: auto;\n  align-self: stretch;\n}\n.q-separator--vertical-inset {\n  margin-top: 8px;\n  margin-bottom: 8px;\n}\n.q-skeleton {\n  --q-skeleton-speed: 1500ms;\n  background: rgba(0, 0, 0, 0.12);\n  border-radius: 4px;\n  box-sizing: border-box;\n}\n.q-skeleton--anim {\n  cursor: wait;\n}\n.q-skeleton:before {\n  content: "\xA0";\n}\n.q-skeleton--type-text {\n  transform: scale(1, 0.5);\n}\n.q-skeleton--type-circle, .q-skeleton--type-QAvatar {\n  height: 48px;\n  width: 48px;\n  border-radius: 50%;\n}\n.q-skeleton--type-QBtn {\n  width: 90px;\n  height: 36px;\n}\n.q-skeleton--type-QBadge {\n  width: 70px;\n  height: 16px;\n}\n.q-skeleton--type-QChip {\n  width: 90px;\n  height: 28px;\n  border-radius: 16px;\n}\n.q-skeleton--type-QToolbar {\n  height: 50px;\n}\n.q-skeleton--type-QCheckbox, .q-skeleton--type-QRadio {\n  width: 40px;\n  height: 40px;\n  border-radius: 50%;\n}\n.q-skeleton--type-QToggle {\n  width: 56px;\n  height: 40px;\n  border-radius: 7px;\n}\n.q-skeleton--type-QSlider, .q-skeleton--type-QRange {\n  height: 40px;\n}\n.q-skeleton--type-QInput {\n  height: 56px;\n}\n.q-skeleton--bordered {\n  border: 1px solid rgba(0, 0, 0, 0.05);\n}\n.q-skeleton--square {\n  border-radius: 0;\n}\n.q-skeleton--anim-fade {\n  animation: q-skeleton--fade var(--q-skeleton-speed) linear 0.5s infinite;\n}\n.q-skeleton--anim-pulse {\n  animation: q-skeleton--pulse var(--q-skeleton-speed) ease-in-out 0.5s infinite;\n}\n.q-skeleton--anim-pulse-x {\n  animation: q-skeleton--pulse-x var(--q-skeleton-speed) ease-in-out 0.5s infinite;\n}\n.q-skeleton--anim-pulse-y {\n  animation: q-skeleton--pulse-y var(--q-skeleton-speed) ease-in-out 0.5s infinite;\n}\n.q-skeleton--anim-wave, .q-skeleton--anim-blink, .q-skeleton--anim-pop {\n  position: relative;\n  overflow: hidden;\n  z-index: 1;\n}\n.q-skeleton--anim-wave:after, .q-skeleton--anim-blink:after, .q-skeleton--anim-pop:after {\n  content: "";\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 0;\n}\n.q-skeleton--anim-blink:after {\n  background: rgba(255, 255, 255, 0.7);\n  animation: q-skeleton--fade var(--q-skeleton-speed) linear 0.5s infinite;\n}\n.q-skeleton--anim-wave:after {\n  background: linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0));\n  animation: q-skeleton--wave var(--q-skeleton-speed) linear 0.5s infinite;\n}\n.q-skeleton--dark {\n  background: rgba(255, 255, 255, 0.05);\n}\n.q-skeleton--dark.q-skeleton--bordered {\n  border: 1px solid rgba(255, 255, 255, 0.25);\n}\n.q-skeleton--dark.q-skeleton--anim-wave:after {\n  background: linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));\n}\n.q-skeleton--dark.q-skeleton--anim-blink:after {\n  background: rgba(255, 255, 255, 0.2);\n}\n@keyframes q-skeleton--fade {\n  0% {\n    opacity: 1;\n  }\n  50% {\n    opacity: 0.4;\n  }\n  100% {\n    opacity: 1;\n  }\n}\n@keyframes q-skeleton--pulse {\n  0% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(0.85);\n  }\n  100% {\n    transform: scale(1);\n  }\n}\n@keyframes q-skeleton--pulse-x {\n  0% {\n    transform: scaleX(1);\n  }\n  50% {\n    transform: scaleX(0.75);\n  }\n  100% {\n    transform: scaleX(1);\n  }\n}\n@keyframes q-skeleton--pulse-y {\n  0% {\n    transform: scaleY(1);\n  }\n  50% {\n    transform: scaleY(0.75);\n  }\n  100% {\n    transform: scaleY(1);\n  }\n}\n@keyframes q-skeleton--wave {\n  0% {\n    transform: translateX(-100%);\n  }\n  100% {\n    transform: translateX(100%);\n  }\n}\n.q-slide-item {\n  position: relative;\n  background: white;\n}\n.q-slide-item__left, .q-slide-item__right, .q-slide-item__top, .q-slide-item__bottom {\n  visibility: hidden;\n  font-size: 14px;\n  color: #fff;\n}\n.q-slide-item__left .q-icon, .q-slide-item__right .q-icon, .q-slide-item__top .q-icon, .q-slide-item__bottom .q-icon {\n  font-size: 1.714em;\n}\n.q-slide-item__left {\n  background: #4caf50;\n  padding: 8px 16px;\n}\n.q-slide-item__left > div {\n  transform-origin: left center;\n}\n.q-slide-item__right {\n  background: #ff9800;\n  padding: 8px 16px;\n}\n.q-slide-item__right > div {\n  transform-origin: right center;\n}\n.q-slide-item__top {\n  background: #2196f3;\n  padding: 16px 8px;\n}\n.q-slide-item__top > div {\n  transform-origin: top center;\n}\n.q-slide-item__bottom {\n  background: #9c27b0;\n  padding: 16px 8px;\n}\n.q-slide-item__bottom > div {\n  transform-origin: bottom center;\n}\n.q-slide-item__content {\n  background: inherit;\n  transition: transform 0.2s ease-in;\n  -webkit-user-select: none;\n          user-select: none;\n  cursor: pointer;\n}\n.q-slider {\n  position: relative;\n}\n.q-slider--h {\n  width: 100%;\n}\n.q-slider--v {\n  height: 200px;\n}\n.q-slider--editable .q-slider__track-container {\n  cursor: grab;\n}\n.q-slider__track-container {\n  outline: 0;\n}\n.q-slider__track-container--h {\n  width: 100%;\n  padding: 12px 0;\n}\n.q-slider__track-container--h .q-slider__selection {\n  will-change: width, left;\n}\n.q-slider__track-container--v {\n  height: 100%;\n  padding: 0 12px;\n}\n.q-slider__track-container--v .q-slider__selection {\n  will-change: height, top;\n}\n.q-slider__track {\n  color: var(--q-primary);\n  background: rgba(0, 0, 0, 0.1);\n  border-radius: 4px;\n  width: inherit;\n  height: inherit;\n}\n.q-slider__inner {\n  background: rgba(0, 0, 0, 0.1);\n  border-radius: inherit;\n  width: 100%;\n  height: 100%;\n}\n.q-slider__selection {\n  background: currentColor;\n  border-radius: inherit;\n  width: 100%;\n  height: 100%;\n}\n.q-slider__markers {\n  color: rgba(0, 0, 0, 0.3);\n  border-radius: inherit;\n  width: 100%;\n  height: 100%;\n}\n.q-slider__markers:after {\n  content: "";\n  position: absolute;\n  background: currentColor;\n}\n.q-slider__markers--h {\n  background-image: repeating-linear-gradient(to right, currentColor, currentColor 2px, rgba(255, 255, 255, 0) 0, rgba(255, 255, 255, 0));\n}\n.q-slider__markers--h:after {\n  height: 100%;\n  width: 2px;\n  top: 0;\n  right: 0;\n}\n.q-slider__markers--v {\n  background-image: repeating-linear-gradient(to bottom, currentColor, currentColor 2px, rgba(255, 255, 255, 0) 0, rgba(255, 255, 255, 0));\n}\n.q-slider__markers--v:after {\n  width: 100%;\n  height: 2px;\n  left: 0;\n  bottom: 0;\n}\n.q-slider__marker-labels-container {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  min-height: 24px;\n  min-width: 24px;\n}\n.q-slider__marker-labels {\n  position: absolute;\n}\n.q-slider__marker-labels--h-standard {\n  top: 0;\n}\n.q-slider__marker-labels--h-switched {\n  bottom: 0;\n}\n.q-slider__marker-labels--h-ltr {\n  transform: translateX(-50%) /* rtl:ignore */;\n}\n.q-slider__marker-labels--h-rtl {\n  transform: translateX(50%) /* rtl:ignore */;\n}\n.q-slider__marker-labels--v-standard {\n  left: 4px;\n}\n.q-slider__marker-labels--v-switched {\n  right: 4px;\n}\n.q-slider__marker-labels--v-ltr {\n  transform: translateY(-50%) /* rtl:ignore */;\n}\n.q-slider__marker-labels--v-rtl {\n  transform: translateY(50%) /* rtl:ignore */;\n}\n.q-slider__thumb {\n  z-index: 1;\n  outline: 0;\n  color: var(--q-primary);\n  transition: transform 0.18s ease-out, fill 0.18s ease-out, stroke 0.18s ease-out;\n}\n.q-slider__thumb.q-slider--focus {\n  opacity: 1 !important;\n}\n.q-slider__thumb--h {\n  top: 50%;\n  will-change: left;\n}\n.q-slider__thumb--h-ltr {\n  transform: scale(1) translate(-50%, -50%) /* rtl:ignore */;\n}\n.q-slider__thumb--h-rtl {\n  transform: scale(1) translate(50%, -50%) /* rtl:ignore */;\n}\n.q-slider__thumb--v {\n  left: 50% /* rtl:ignore */;\n  will-change: top;\n}\n.q-slider__thumb--v-ltr {\n  transform: scale(1) translate(-50%, -50%) /* rtl:ignore */;\n}\n.q-slider__thumb--v-rtl {\n  transform: scale(1) translate(-50%, 50%) /* rtl:ignore */;\n}\n.q-slider__thumb-shape {\n  top: 0;\n  left: 0;\n  stroke-width: 3.5;\n  stroke: currentColor;\n  transition: transform 0.28s;\n}\n.q-slider__thumb-shape path {\n  stroke: currentColor;\n  fill: currentColor;\n}\n.q-slider__focus-ring {\n  border-radius: 50%;\n  opacity: 0;\n  transition: transform 266.67ms ease-out, opacity 266.67ms ease-out, background-color 266.67ms ease-out;\n  transition-delay: 0.14s;\n}\n.q-slider__pin {\n  opacity: 0;\n  white-space: nowrap;\n  transition: opacity 0.28s ease-out;\n  transition-delay: 0.14s;\n}\n.q-slider__pin:before {\n  content: "";\n  width: 0;\n  height: 0;\n  position: absolute;\n}\n.q-slider__pin--h:before {\n  border-left: 6px solid transparent;\n  border-right: 6px solid transparent;\n  left: 50%;\n  transform: translateX(-50%);\n}\n.q-slider__pin--h-standard {\n  bottom: 100%;\n}\n.q-slider__pin--h-standard:before {\n  bottom: 2px;\n  border-top: 6px solid currentColor;\n}\n.q-slider__pin--h-switched {\n  top: 100%;\n}\n.q-slider__pin--h-switched:before {\n  top: 2px;\n  border-bottom: 6px solid currentColor;\n}\n.q-slider__pin--v {\n  top: 0;\n}\n.q-slider__pin--v:before {\n  top: 50%;\n  transform: translateY(-50%);\n  border-top: 6px solid transparent;\n  border-bottom: 6px solid transparent;\n}\n.q-slider__pin--v-standard {\n  left: 100%;\n}\n.q-slider__pin--v-standard:before {\n  left: 2px;\n  border-right: 6px solid currentColor;\n}\n.q-slider__pin--v-switched {\n  right: 100%;\n}\n.q-slider__pin--v-switched:before {\n  right: 2px;\n  border-left: 6px solid currentColor;\n}\n.q-slider__label {\n  z-index: 1;\n  white-space: nowrap;\n  position: absolute;\n}\n.q-slider__label--h {\n  left: 50%;\n  transform: translateX(-50%);\n}\n.q-slider__label--h-standard {\n  bottom: 7px;\n}\n.q-slider__label--h-switched {\n  top: 7px;\n}\n.q-slider__label--v {\n  top: 50%;\n  transform: translateY(-50%);\n}\n.q-slider__label--v-standard {\n  left: 7px;\n}\n.q-slider__label--v-switched {\n  right: 7px;\n}\n.q-slider__text-container {\n  min-height: 25px;\n  padding: 2px 8px;\n  border-radius: 4px;\n  background: currentColor;\n  position: relative;\n  text-align: center;\n}\n.q-slider__text {\n  color: #fff;\n  font-size: 12px;\n}\n.q-slider--no-value .q-slider__thumb,\n.q-slider--no-value .q-slider__inner,\n.q-slider--no-value .q-slider__selection {\n  opacity: 0;\n}\n.q-slider--focus .q-slider__focus-ring, body.desktop .q-slider.q-slider--editable .q-slider__track-container:hover .q-slider__focus-ring {\n  background: currentColor;\n  transform: scale3d(1.55, 1.55, 1);\n  opacity: 0.25;\n}\n.q-slider--focus .q-slider__thumb,\n.q-slider--focus .q-slider__inner,\n.q-slider--focus .q-slider__selection, body.desktop .q-slider.q-slider--editable .q-slider__track-container:hover .q-slider__thumb,\nbody.desktop .q-slider.q-slider--editable .q-slider__track-container:hover .q-slider__inner,\nbody.desktop .q-slider.q-slider--editable .q-slider__track-container:hover .q-slider__selection {\n  opacity: 1;\n}\n.q-slider--inactive .q-slider__thumb--h {\n  transition: left 0.28s, right 0.28s;\n}\n.q-slider--inactive .q-slider__thumb--v {\n  transition: top 0.28s, bottom 0.28s;\n}\n.q-slider--inactive .q-slider__selection {\n  transition: width 0.28s, left 0.28s, right 0.28s, height 0.28s, top 0.28s, bottom 0.28s;\n}\n.q-slider--inactive .q-slider__text-container {\n  transition: transform 0.28s;\n}\n.q-slider--active {\n  cursor: grabbing;\n}\n.q-slider--active .q-slider__thumb-shape {\n  transform: scale(1.5);\n}\n.q-slider--active .q-slider__focus-ring, .q-slider--active.q-slider--label .q-slider__thumb-shape {\n  transform: scale(0) !important;\n}\nbody.desktop .q-slider.q-slider--enabled .q-slider__track-container:hover .q-slider__pin {\n  opacity: 1;\n}\n.q-slider--label.q-slider--active .q-slider__pin,\n.q-slider--label .q-slider--focus .q-slider__pin, .q-slider--label.q-slider--label-always .q-slider__pin {\n  opacity: 1;\n}\n.q-slider--dark .q-slider__track {\n  background: rgba(255, 255, 255, 0.1);\n}\n.q-slider--dark .q-slider__inner {\n  background: rgba(255, 255, 255, 0.1);\n}\n.q-slider--dark .q-slider__markers {\n  color: rgba(255, 255, 255, 0.3);\n}\n.q-slider--dense .q-slider__track-container--h {\n  padding: 6px 0;\n}\n.q-slider--dense .q-slider__track-container--v {\n  padding: 0 6px;\n}\n.q-space {\n  flex-grow: 1 !important;\n}\n.q-spinner {\n  vertical-align: middle;\n}\n.q-spinner-mat {\n  animation: q-spin 2s linear infinite;\n  transform-origin: center center;\n}\n.q-spinner-mat .path {\n  stroke-dasharray: 1, 200 /* rtl:ignore */;\n  stroke-dashoffset: 0 /* rtl:ignore */;\n  animation: q-mat-dash 1.5s ease-in-out infinite;\n}\n@keyframes q-spin {\n  0% {\n    transform: rotate3d(0, 0, 1, 0deg) /* rtl:ignore */;\n  }\n  25% {\n    transform: rotate3d(0, 0, 1, 90deg) /* rtl:ignore */;\n  }\n  50% {\n    transform: rotate3d(0, 0, 1, 180deg) /* rtl:ignore */;\n  }\n  75% {\n    transform: rotate3d(0, 0, 1, 270deg) /* rtl:ignore */;\n  }\n  100% {\n    transform: rotate3d(0, 0, 1, 359deg) /* rtl:ignore */;\n  }\n}\n@keyframes q-mat-dash {\n  0% {\n    stroke-dasharray: 1, 200;\n    stroke-dashoffset: 0;\n  }\n  50% {\n    stroke-dasharray: 89, 200;\n    stroke-dashoffset: -35px;\n  }\n  100% {\n    stroke-dasharray: 89, 200;\n    stroke-dashoffset: -124px;\n  }\n}\n.q-splitter__panel {\n  position: relative;\n  z-index: 0;\n}\n.q-splitter__panel > .q-splitter {\n  width: 100%;\n  height: 100%;\n}\n.q-splitter__separator {\n  background-color: rgba(0, 0, 0, 0.12);\n  -webkit-user-select: none;\n          user-select: none;\n  position: relative;\n  z-index: 1;\n}\n.q-splitter__separator-area > * {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n}\n.q-splitter--dark .q-splitter__separator {\n  background-color: rgba(255, 255, 255, 0.28);\n}\n.q-splitter--vertical > .q-splitter__panel {\n  height: 100%;\n}\n.q-splitter--vertical.q-splitter--active {\n  cursor: col-resize;\n}\n.q-splitter--vertical > .q-splitter__separator {\n  width: 1px;\n}\n.q-splitter--vertical > .q-splitter__separator > div {\n  left: -6px;\n  right: -6px;\n}\n.q-splitter--vertical.q-splitter--workable > .q-splitter__separator {\n  cursor: col-resize;\n}\n.q-splitter--horizontal > .q-splitter__panel {\n  width: 100%;\n}\n.q-splitter--horizontal.q-splitter--active {\n  cursor: row-resize;\n}\n.q-splitter--horizontal > .q-splitter__separator {\n  height: 1px;\n}\n.q-splitter--horizontal > .q-splitter__separator > div {\n  top: -6px;\n  bottom: -6px;\n}\n.q-splitter--horizontal.q-splitter--workable > .q-splitter__separator {\n  cursor: row-resize;\n}\n.q-splitter__before, .q-splitter__after {\n  overflow: auto;\n}\n.q-stepper {\n  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12);\n  border-radius: 4px;\n  background: #fff;\n}\n.q-stepper__title {\n  font-size: 14px;\n  line-height: 18px;\n  letter-spacing: 0.1px;\n}\n.q-stepper__caption {\n  font-size: 12px;\n  line-height: 14px;\n}\n.q-stepper__dot {\n  contain: layout;\n  margin-right: 8px;\n  font-size: 14px;\n  width: 24px;\n  min-width: 24px;\n  height: 24px;\n  border-radius: 50%;\n  background: currentColor;\n}\n.q-stepper__dot span {\n  color: #fff;\n}\n.q-stepper__tab {\n  padding: 8px 24px;\n  font-size: 14px;\n  color: #9e9e9e;\n  flex-direction: row;\n}\n.q-stepper--dark .q-stepper__dot span {\n  color: #000;\n}\n.q-stepper__tab--navigation {\n  -webkit-user-select: none;\n          user-select: none;\n  cursor: pointer;\n}\n.q-stepper__tab--active, .q-stepper__tab--done {\n  color: var(--q-primary);\n}\n.q-stepper__tab--active .q-stepper__dot, .q-stepper__tab--active .q-stepper__label, .q-stepper__tab--done .q-stepper__dot, .q-stepper__tab--done .q-stepper__label {\n  text-shadow: 0 0 0 currentColor;\n}\n.q-stepper__tab--disabled .q-stepper__dot {\n  background: rgba(0, 0, 0, 0.22);\n}\n.q-stepper__tab--disabled .q-stepper__label {\n  color: rgba(0, 0, 0, 0.32);\n}\n.q-stepper__tab--error {\n  color: var(--q-negative);\n}\n.q-stepper__tab--error-with-icon .q-stepper__dot {\n  background: transparent !important;\n}\n.q-stepper__tab--error-with-icon .q-stepper__dot span {\n  color: currentColor;\n  font-size: 24px;\n}\n.q-stepper__header {\n  border-top-left-radius: inherit;\n  border-top-right-radius: inherit;\n}\n.q-stepper__header--border {\n  border-bottom: 1px solid rgba(0, 0, 0, 0.12);\n}\n.q-stepper__header--standard-labels .q-stepper__tab {\n  min-height: 72px;\n  justify-content: center;\n}\n.q-stepper__header--standard-labels .q-stepper__tab:first-child {\n  justify-content: flex-start;\n}\n.q-stepper__header--standard-labels .q-stepper__tab:last-child {\n  justify-content: flex-end;\n}\n.q-stepper__header--standard-labels .q-stepper__tab:only-child {\n  justify-content: center;\n}\n.q-stepper__header--standard-labels .q-stepper__dot:after {\n  display: none;\n}\n.q-stepper__header--alternative-labels .q-stepper__tab {\n  min-height: 104px;\n  padding: 24px 32px;\n  flex-direction: column;\n  justify-content: flex-start;\n}\n.q-stepper__header--alternative-labels .q-stepper__dot {\n  margin-right: 0;\n}\n.q-stepper__header--alternative-labels .q-stepper__label {\n  margin-top: 8px;\n  text-align: center;\n}\n.q-stepper__header--alternative-labels .q-stepper__label:before, .q-stepper__header--alternative-labels .q-stepper__label:after {\n  display: none;\n}\n.q-stepper__header--contracted {\n  min-height: 72px;\n}\n.q-stepper__header--contracted.q-stepper__header--alternative-labels .q-stepper__tab {\n  min-height: 72px;\n}\n.q-stepper__header--contracted.q-stepper__header--alternative-labels .q-stepper__tab:first-child {\n  align-items: flex-start;\n}\n.q-stepper__header--contracted.q-stepper__header--alternative-labels .q-stepper__tab:last-child {\n  align-items: flex-end;\n}\n.q-stepper__header--contracted .q-stepper__tab {\n  padding: 24px 0;\n}\n.q-stepper__header--contracted .q-stepper__tab:first-child .q-stepper__dot {\n  transform: translateX(24px);\n}\n.q-stepper__header--contracted .q-stepper__tab:last-child .q-stepper__dot {\n  transform: translateX(-24px);\n}\n.q-stepper__header--contracted .q-stepper__tab:not(:last-child) .q-stepper__dot:after {\n  display: block !important;\n}\n.q-stepper__header--contracted .q-stepper__dot {\n  margin: 0;\n}\n.q-stepper__header--contracted .q-stepper__label {\n  display: none;\n}\n.q-stepper__nav {\n  padding-top: 24px;\n}\n.q-stepper--bordered {\n  border: 1px solid rgba(0, 0, 0, 0.12);\n}\n.q-stepper--horizontal .q-stepper__step-inner {\n  padding: 24px;\n}\n.q-stepper--horizontal .q-stepper__tab:first-child {\n  border-top-left-radius: inherit;\n}\n.q-stepper--horizontal .q-stepper__tab:last-child {\n  border-top-right-radius: inherit;\n}\n.q-stepper--horizontal .q-stepper__tab:first-child .q-stepper__dot:before,\n.q-stepper--horizontal .q-stepper__tab:last-child .q-stepper__label:after,\n.q-stepper--horizontal .q-stepper__tab:last-child .q-stepper__dot:after {\n  display: none;\n}\n.q-stepper--horizontal .q-stepper__tab {\n  overflow: hidden;\n}\n.q-stepper--horizontal .q-stepper__line {\n  contain: layout;\n}\n.q-stepper--horizontal .q-stepper__line:before, .q-stepper--horizontal .q-stepper__line:after {\n  position: absolute;\n  top: 50%;\n  height: 1px;\n  width: 100vw;\n  background: rgba(0, 0, 0, 0.12);\n}\n.q-stepper--horizontal .q-stepper__label:after, .q-stepper--horizontal .q-stepper__dot:after {\n  content: "";\n  left: 100%;\n  margin-left: 8px;\n}\n.q-stepper--horizontal .q-stepper__dot:before {\n  content: "";\n  right: 100%;\n  margin-right: 8px;\n}\n.q-stepper--horizontal > .q-stepper__nav {\n  padding: 0 24px 24px;\n}\n.q-stepper--vertical {\n  padding: 16px 0;\n}\n.q-stepper--vertical .q-stepper__tab {\n  padding: 12px 24px;\n}\n.q-stepper--vertical .q-stepper__title {\n  line-height: 18px;\n}\n.q-stepper--vertical .q-stepper__step-inner {\n  padding: 0 24px 32px 60px;\n}\n.q-stepper--vertical > .q-stepper__nav {\n  padding: 24px 24px 0;\n}\n.q-stepper--vertical .q-stepper__step {\n  overflow: hidden;\n}\n.q-stepper--vertical .q-stepper__dot {\n  margin-right: 12px;\n}\n.q-stepper--vertical .q-stepper__dot:before, .q-stepper--vertical .q-stepper__dot:after {\n  content: "";\n  position: absolute;\n  left: 50%;\n  width: 1px;\n  height: 99999px;\n  background: rgba(0, 0, 0, 0.12);\n}\n.q-stepper--vertical .q-stepper__dot:before {\n  bottom: 100%;\n  margin-bottom: 8px;\n}\n.q-stepper--vertical .q-stepper__dot:after {\n  top: 100%;\n  margin-top: 8px;\n}\n.q-stepper--vertical .q-stepper__step:first-child .q-stepper__dot:before,\n.q-stepper--vertical .q-stepper__step:last-child .q-stepper__dot:after {\n  display: none;\n}\n.q-stepper--vertical .q-stepper__step:last-child .q-stepper__step-inner {\n  padding-bottom: 8px;\n}\n.q-stepper--dark.q-stepper--bordered,\n.q-stepper--dark .q-stepper__header--border {\n  border-color: rgba(255, 255, 255, 0.28);\n}\n.q-stepper--dark.q-stepper--horizontal .q-stepper__line:before, .q-stepper--dark.q-stepper--horizontal .q-stepper__line:after {\n  background: rgba(255, 255, 255, 0.28);\n}\n.q-stepper--dark.q-stepper--vertical .q-stepper__dot:before, .q-stepper--dark.q-stepper--vertical .q-stepper__dot:after {\n  background: rgba(255, 255, 255, 0.28);\n}\n.q-stepper--dark .q-stepper__tab--disabled {\n  color: rgba(255, 255, 255, 0.28);\n}\n.q-stepper--dark .q-stepper__tab--disabled .q-stepper__dot {\n  background: rgba(255, 255, 255, 0.28);\n}\n.q-stepper--dark .q-stepper__tab--disabled .q-stepper__label {\n  color: rgba(255, 255, 255, 0.54);\n}\n.q-tab-panels {\n  background: #fff;\n}\n.q-tab-panel {\n  padding: 16px;\n}\n.q-markup-table {\n  overflow: auto;\n  background: #fff;\n}\n.q-table {\n  width: 100%;\n  max-width: 100%;\n  border-collapse: separate;\n  border-spacing: 0;\n}\n.q-table thead tr, .q-table tbody td {\n  height: 48px;\n}\n.q-table th {\n  font-weight: 500;\n  font-size: 12px;\n  -webkit-user-select: none;\n          user-select: none;\n}\n.q-table th.sortable {\n  cursor: pointer;\n}\n.q-table th.sortable:hover .q-table__sort-icon {\n  opacity: 0.64;\n}\n.q-table th.sorted .q-table__sort-icon {\n  opacity: 0.86 !important;\n}\n.q-table th.sort-desc .q-table__sort-icon {\n  transform: rotate(180deg);\n}\n.q-table th, .q-table td {\n  padding: 7px 16px;\n  background-color: inherit;\n}\n.q-table thead, .q-table td, .q-table th {\n  border-style: solid;\n  border-width: 0;\n}\n.q-table tbody td {\n  font-size: 13px;\n}\n.q-table__card {\n  color: #000;\n  background-color: #fff;\n  border-radius: 4px;\n  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12);\n}\n.q-table__card .q-table__middle {\n  flex: 1 1 auto;\n}\n.q-table__card .q-table__top,\n.q-table__card .q-table__bottom {\n  flex: 0 0 auto;\n}\n.q-table__container {\n  position: relative;\n}\n.q-table__container > div:first-child {\n  border-top-left-radius: inherit;\n  border-top-right-radius: inherit;\n}\n.q-table__container > div:last-child {\n  border-bottom-left-radius: inherit;\n  border-bottom-right-radius: inherit;\n}\n.q-table__container > .q-inner-loading {\n  border-radius: inherit !important;\n}\n.q-table__top {\n  padding: 12px 16px;\n}\n.q-table__top .q-table__control {\n  flex-wrap: wrap;\n}\n.q-table__title {\n  font-size: 20px;\n  letter-spacing: 0.005em;\n  font-weight: 400;\n}\n.q-table__separator {\n  min-width: 8px !important;\n}\n.q-table__progress {\n  height: 0 !important;\n}\n.q-table__progress th {\n  padding: 0 !important;\n  border: 0 !important;\n}\n.q-table__progress .q-linear-progress {\n  position: absolute;\n  bottom: 0;\n}\n.q-table__middle {\n  max-width: 100%;\n}\n.q-table__bottom {\n  min-height: 50px;\n  padding: 4px 14px 4px 16px;\n  font-size: 12px;\n}\n.q-table__bottom .q-table__control {\n  min-height: 24px;\n}\n.q-table__bottom-nodata-icon {\n  font-size: 200%;\n  margin-right: 8px;\n}\n.q-table__bottom-item {\n  margin-right: 16px;\n}\n.q-table__control {\n  display: flex;\n  align-items: center;\n}\n.q-table__sort-icon {\n  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);\n  opacity: 0;\n  font-size: 120%;\n}\n.q-table__sort-icon--left, .q-table__sort-icon--center {\n  margin-left: 4px;\n}\n.q-table__sort-icon--right {\n  margin-right: 4px;\n}\n.q-table--col-auto-width {\n  width: 1px;\n}\n.q-table--flat {\n  box-shadow: none;\n}\n.q-table--bordered {\n  border: 1px solid rgba(0, 0, 0, 0.12);\n}\n.q-table--square {\n  border-radius: 0;\n}\n.q-table__linear-progress {\n  height: 2px;\n}\n.q-table--no-wrap th, .q-table--no-wrap td {\n  white-space: nowrap;\n}\n.q-table--grid {\n  box-shadow: none;\n  border-radius: 4px;\n}\n.q-table--grid .q-table__top {\n  padding-bottom: 4px;\n}\n.q-table--grid .q-table__middle {\n  min-height: 2px;\n  margin-bottom: 4px;\n}\n.q-table--grid .q-table__middle thead, .q-table--grid .q-table__middle thead th {\n  border: 0 !important;\n}\n.q-table--grid .q-table__linear-progress {\n  bottom: 0;\n}\n.q-table--grid .q-table__bottom {\n  border-top: 0;\n}\n.q-table--grid .q-table__grid-content {\n  flex: 1 1 auto;\n}\n.q-table--grid.fullscreen {\n  background: inherit;\n}\n.q-table__grid-item-card {\n  vertical-align: top;\n  padding: 12px;\n}\n.q-table__grid-item-card .q-separator {\n  margin: 12px 0;\n}\n.q-table__grid-item-row + .q-table__grid-item-row {\n  margin-top: 8px;\n}\n.q-table__grid-item-title {\n  opacity: 0.54;\n  font-weight: 500;\n  font-size: 12px;\n}\n.q-table__grid-item-value {\n  font-size: 13px;\n}\n.q-table__grid-item {\n  padding: 4px;\n  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);\n}\n.q-table__grid-item--selected {\n  transform: scale(0.95);\n}\n.q-table--horizontal-separator thead th, .q-table--horizontal-separator tbody tr:not(:last-child) > td, .q-table--cell-separator thead th, .q-table--cell-separator tbody tr:not(:last-child) > td {\n  border-bottom-width: 1px;\n}\n.q-table--vertical-separator td, .q-table--vertical-separator th, .q-table--cell-separator td, .q-table--cell-separator th {\n  border-left-width: 1px;\n}\n.q-table--vertical-separator thead tr:last-child th, .q-table--vertical-separator.q-table--loading tr:nth-last-child(2) th, .q-table--cell-separator thead tr:last-child th, .q-table--cell-separator.q-table--loading tr:nth-last-child(2) th {\n  border-bottom-width: 1px;\n}\n.q-table--vertical-separator td:first-child, .q-table--vertical-separator th:first-child, .q-table--cell-separator td:first-child, .q-table--cell-separator th:first-child {\n  border-left: 0;\n}\n.q-table--vertical-separator .q-table__top, .q-table--cell-separator .q-table__top {\n  border-bottom: 1px solid rgba(0, 0, 0, 0.12);\n}\n.q-table--dense .q-table__top {\n  padding: 6px 16px;\n}\n.q-table--dense .q-table__bottom {\n  min-height: 33px;\n}\n.q-table--dense .q-table__sort-icon {\n  font-size: 110%;\n}\n.q-table--dense .q-table th, .q-table--dense .q-table td {\n  padding: 4px 8px;\n}\n.q-table--dense .q-table thead tr, .q-table--dense .q-table tbody tr, .q-table--dense .q-table tbody td {\n  height: 28px;\n}\n.q-table--dense .q-table th:first-child, .q-table--dense .q-table td:first-child {\n  padding-left: 16px;\n}\n.q-table--dense .q-table th:last-child, .q-table--dense .q-table td:last-child {\n  padding-right: 16px;\n}\n.q-table--dense .q-table__bottom-item {\n  margin-right: 8px;\n}\n.q-table--dense .q-table__select .q-field__control, .q-table--dense .q-table__select .q-field__native {\n  min-height: 24px;\n  padding: 0;\n}\n.q-table--dense .q-table__select .q-field__marginal {\n  height: 24px;\n}\n.q-table__bottom {\n  border-top: 1px solid rgba(0, 0, 0, 0.12);\n}\n.q-table thead, .q-table tr, .q-table th, .q-table td {\n  border-color: rgba(0, 0, 0, 0.12);\n}\n.q-table tbody td {\n  position: relative;\n}\n.q-table tbody td:before, .q-table tbody td:after {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  pointer-events: none;\n}\n.q-table tbody td:before {\n  background: rgba(0, 0, 0, 0.03);\n}\n.q-table tbody td:after {\n  background: rgba(0, 0, 0, 0.06);\n}\n.q-table tbody tr.selected td:after {\n  content: "";\n}\nbody.desktop .q-table > tbody > tr:not(.q-tr--no-hover):hover > td:not(.q-td--no-hover):before {\n  content: "";\n}\n.q-table__card--dark, .q-table--dark {\n  border-color: rgba(255, 255, 255, 0.28);\n}\n.q-table--dark .q-table__bottom, .q-table--dark thead, .q-table--dark tr, .q-table--dark th, .q-table--dark td {\n  border-color: rgba(255, 255, 255, 0.28);\n}\n.q-table--dark tbody td:before {\n  background: rgba(255, 255, 255, 0.07);\n}\n.q-table--dark tbody td:after {\n  background: rgba(255, 255, 255, 0.1);\n}\n.q-table--dark.q-table--vertical-separator .q-table__top, .q-table--dark.q-table--cell-separator .q-table__top {\n  border-color: rgba(255, 255, 255, 0.28);\n}\n.q-tab {\n  padding: 0 16px;\n  min-height: 48px;\n  transition: color 0.3s, background-color 0.3s;\n  text-transform: uppercase;\n  white-space: nowrap;\n  color: inherit;\n  text-decoration: none;\n}\n.q-tab--full {\n  min-height: 72px;\n}\n.q-tab--no-caps {\n  text-transform: none;\n}\n.q-tab__content {\n  height: inherit;\n  padding: 4px 0;\n  min-width: 40px;\n}\n.q-tab__content--inline .q-tab__icon + .q-tab__label {\n  padding-left: 8px;\n}\n.q-tab__content .q-chip--floating {\n  top: 0;\n  right: -16px;\n}\n.q-tab__icon {\n  width: 24px;\n  height: 24px;\n  font-size: 24px;\n}\n.q-tab__label {\n  font-size: 14px;\n  line-height: 1.715em;\n  font-weight: 500;\n}\n.q-tab .q-badge {\n  top: 3px;\n  right: -12px;\n}\n.q-tab__alert, .q-tab__alert-icon {\n  position: absolute;\n}\n.q-tab__alert {\n  top: 7px;\n  right: -9px;\n  height: 10px;\n  width: 10px;\n  border-radius: 50%;\n  background: currentColor;\n}\n.q-tab__alert-icon {\n  top: 2px;\n  right: -12px;\n  font-size: 18px;\n}\n.q-tab__indicator {\n  opacity: 0;\n  height: 2px;\n  background: currentColor;\n}\n.q-tab--active .q-tab__indicator {\n  opacity: 1;\n  transform-origin: left /* rtl:ignore */;\n}\n.q-tab--inactive {\n  opacity: 0.85;\n}\n.q-tabs {\n  position: relative;\n  transition: color 0.3s, background-color 0.3s;\n}\n.q-tabs--scrollable.q-tabs__arrows--outside.q-tabs--horizontal {\n  padding-left: 36px;\n  padding-right: 36px;\n}\n.q-tabs--scrollable.q-tabs__arrows--outside.q-tabs--vertical {\n  padding-top: 36px;\n  padding-bottom: 36px;\n}\n.q-tabs--scrollable.q-tabs__arrows--outside .q-tabs__arrow--faded {\n  opacity: 0.3;\n  pointer-events: none;\n}\n.q-tabs--scrollable.q-tabs__arrows--inside .q-tabs__arrow--faded {\n  display: none;\n}\n.q-tabs--not-scrollable .q-tabs__arrow {\n  display: none;\n}\n.q-tabs--not-scrollable .q-tabs__content {\n  border-radius: inherit;\n}\n.q-tabs__arrow {\n  cursor: pointer;\n  font-size: 32px;\n  min-width: 36px;\n  text-shadow: 0 0 3px #fff, 0 0 1px #fff, 0 0 1px #000;\n  transition: opacity 0.3s;\n}\n.q-tabs__content {\n  overflow: hidden;\n  flex: 1 1 auto;\n}\n.q-tabs__content--align-center {\n  justify-content: center;\n}\n.q-tabs__content--align-right {\n  justify-content: flex-end;\n}\n.q-tabs__content--align-justify .q-tab {\n  flex: 1 1 auto;\n}\n.q-tabs__offset {\n  display: none;\n}\n.q-tabs--horizontal .q-tabs__arrow {\n  height: 100%;\n}\n.q-tabs--horizontal .q-tabs__arrow--left {\n  top: 0;\n  left: 0 /* rtl:ignore */;\n  bottom: 0;\n}\n.q-tabs--horizontal .q-tabs__arrow--right {\n  top: 0;\n  right: 0 /* rtl:ignore */;\n  bottom: 0;\n}\n.q-tabs--vertical {\n  display: block !important;\n  height: 100%;\n}\n.q-tabs--vertical .q-tabs__content {\n  display: block !important;\n  height: 100%;\n}\n.q-tabs--vertical .q-tabs__arrow {\n  width: 100%;\n  height: 36px;\n  text-align: center;\n}\n.q-tabs--vertical .q-tabs__arrow--left {\n  top: 0;\n  left: 0;\n  right: 0;\n}\n.q-tabs--vertical .q-tabs__arrow--right {\n  left: 0;\n  right: 0;\n  bottom: 0;\n}\n.q-tabs--vertical .q-tab {\n  padding: 0 8px;\n}\n.q-tabs--vertical .q-tab__indicator {\n  height: unset;\n  width: 2px;\n}\n.q-tabs--vertical.q-tabs--not-scrollable .q-tabs__content {\n  height: 100%;\n}\n.q-tabs--vertical.q-tabs--dense .q-tab__content {\n  min-width: 24px;\n}\n.q-tabs--dense .q-tab {\n  min-height: 36px;\n}\n.q-tabs--dense .q-tab--full {\n  min-height: 52px;\n}\n.q-time {\n  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12);\n  border-radius: 4px;\n  background: #fff;\n  outline: 0;\n  width: 290px;\n  min-width: 290px;\n  max-width: 100%;\n}\n.q-time--bordered {\n  border: 1px solid rgba(0, 0, 0, 0.12);\n}\n.q-time__header {\n  border-top-left-radius: inherit;\n  color: #fff;\n  background-color: var(--q-primary);\n  padding: 16px;\n  font-weight: 300;\n}\n.q-time__actions {\n  padding: 0 16px 16px;\n}\n.q-time__header-label {\n  font-size: 28px;\n  line-height: 1;\n  letter-spacing: -0.00833em;\n}\n.q-time__header-label > div + div {\n  margin-left: 4px;\n}\n.q-time__link {\n  opacity: 0.56;\n  outline: 0;\n  transition: opacity 0.3s ease-out;\n}\n.q-time__link--active, .q-time__link:hover, .q-time__link:focus {\n  opacity: 1;\n}\n.q-time__header-ampm {\n  font-size: 16px;\n  letter-spacing: 0.1em;\n}\n.q-time__content {\n  padding: 16px;\n}\n.q-time__content:before {\n  content: "";\n  display: block;\n  padding-bottom: 100%;\n}\n.q-time__container-parent {\n  padding: 16px;\n}\n.q-time__container-child {\n  border-radius: 50%;\n  background: rgba(0, 0, 0, 0.12);\n}\n.q-time__clock {\n  padding: 24px;\n  width: 100%;\n  height: 100%;\n  max-width: 100%;\n  max-height: 100%;\n  font-size: 14px;\n}\n.q-time__clock-circle {\n  position: relative;\n}\n.q-time__clock-center {\n  height: 6px;\n  width: 6px;\n  margin: auto;\n  border-radius: 50%;\n  min-height: 0;\n  background: currentColor;\n}\n.q-time__clock-pointer {\n  width: 2px;\n  height: 50%;\n  transform-origin: 0 0 /* rtl:ignore */;\n  min-height: 0;\n  position: absolute;\n  left: 50%;\n  right: 0;\n  bottom: 0;\n  color: var(--q-primary);\n  background: currentColor;\n  transform: translateX(-50%);\n}\n.q-time__clock-pointer:before, .q-time__clock-pointer:after {\n  content: "";\n  position: absolute;\n  left: 50%;\n  border-radius: 50%;\n  background: currentColor;\n  transform: translateX(-50%);\n}\n.q-time__clock-pointer:before {\n  bottom: -4px;\n  width: 8px;\n  height: 8px;\n}\n.q-time__clock-pointer:after {\n  top: -3px;\n  height: 6px;\n  width: 6px;\n}\n.q-time__clock-position {\n  position: absolute;\n  min-height: 32px;\n  width: 32px;\n  height: 32px;\n  font-size: 12px;\n  line-height: 32px;\n  margin: 0;\n  padding: 0;\n  transform: translate(-50%, -50%) /* rtl:ignore */;\n  border-radius: 50%;\n}\n.q-time__clock-position--disable {\n  opacity: 0.4;\n}\n.q-time__clock-position--active {\n  background-color: var(--q-primary);\n  color: #fff;\n}\n.q-time__clock-pos-0 {\n  top: 0%;\n  left: 50% /* rtl:ignore */;\n}\n.q-time__clock-pos-1 {\n  top: 6.7%;\n  left: 75% /* rtl:ignore */;\n}\n.q-time__clock-pos-2 {\n  top: 25%;\n  left: 93.3% /* rtl:ignore */;\n}\n.q-time__clock-pos-3 {\n  top: 50%;\n  left: 100% /* rtl:ignore */;\n}\n.q-time__clock-pos-4 {\n  top: 75%;\n  left: 93.3% /* rtl:ignore */;\n}\n.q-time__clock-pos-5 {\n  top: 93.3%;\n  left: 75% /* rtl:ignore */;\n}\n.q-time__clock-pos-6 {\n  top: 100%;\n  left: 50% /* rtl:ignore */;\n}\n.q-time__clock-pos-7 {\n  top: 93.3%;\n  left: 25% /* rtl:ignore */;\n}\n.q-time__clock-pos-8 {\n  top: 75%;\n  left: 6.7% /* rtl:ignore */;\n}\n.q-time__clock-pos-9 {\n  top: 50%;\n  left: 0% /* rtl:ignore */;\n}\n.q-time__clock-pos-10 {\n  top: 25%;\n  left: 6.7% /* rtl:ignore */;\n}\n.q-time__clock-pos-11 {\n  top: 6.7%;\n  left: 25% /* rtl:ignore */;\n}\n.q-time__clock-pos-12 {\n  top: 15%;\n  left: 50% /* rtl:ignore */;\n}\n.q-time__clock-pos-13 {\n  top: 19.69%;\n  left: 67.5% /* rtl:ignore */;\n}\n.q-time__clock-pos-14 {\n  top: 32.5%;\n  left: 80.31% /* rtl:ignore */;\n}\n.q-time__clock-pos-15 {\n  top: 50%;\n  left: 85% /* rtl:ignore */;\n}\n.q-time__clock-pos-16 {\n  top: 67.5%;\n  left: 80.31% /* rtl:ignore */;\n}\n.q-time__clock-pos-17 {\n  top: 80.31%;\n  left: 67.5% /* rtl:ignore */;\n}\n.q-time__clock-pos-18 {\n  top: 85%;\n  left: 50% /* rtl:ignore */;\n}\n.q-time__clock-pos-19 {\n  top: 80.31%;\n  left: 32.5% /* rtl:ignore */;\n}\n.q-time__clock-pos-20 {\n  top: 67.5%;\n  left: 19.69% /* rtl:ignore */;\n}\n.q-time__clock-pos-21 {\n  top: 50%;\n  left: 15% /* rtl:ignore */;\n}\n.q-time__clock-pos-22 {\n  top: 32.5%;\n  left: 19.69% /* rtl:ignore */;\n}\n.q-time__clock-pos-23 {\n  top: 19.69%;\n  left: 32.5% /* rtl:ignore */;\n}\n.q-time__now-button {\n  background-color: var(--q-primary);\n  color: #fff;\n  top: 12px;\n  right: 12px;\n}\n.q-time.disabled .q-time__header-ampm, .q-time.disabled .q-time__content, .q-time--readonly .q-time__header-ampm, .q-time--readonly .q-time__content {\n  pointer-events: none;\n}\n.q-time--portrait {\n  display: inline-flex;\n  flex-direction: column;\n}\n.q-time--portrait .q-time__header {\n  border-top-right-radius: inherit;\n  min-height: 86px;\n}\n.q-time--portrait .q-time__header-ampm {\n  margin-left: 12px;\n}\n.q-time--portrait.q-time--bordered .q-time__content {\n  margin: 1px 0;\n}\n.q-time--landscape {\n  display: inline-flex;\n  align-items: stretch;\n  min-width: 420px;\n}\n.q-time--landscape > div {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n}\n.q-time--landscape .q-time__header {\n  border-bottom-left-radius: inherit;\n  min-width: 156px;\n}\n.q-time--landscape .q-time__header-ampm {\n  margin-top: 12px;\n}\n.q-time--dark {\n  border-color: rgba(255, 255, 255, 0.28);\n}\n.q-timeline {\n  padding: 0;\n  width: 100%;\n  list-style: none;\n}\n.q-timeline h6 {\n  line-height: inherit;\n}\n.q-timeline--dark {\n  color: #fff;\n}\n.q-timeline--dark .q-timeline__subtitle {\n  opacity: 0.7;\n}\n.q-timeline__content {\n  padding-bottom: 24px;\n}\n.q-timeline__title {\n  margin-top: 0;\n  margin-bottom: 16px;\n}\n.q-timeline__subtitle {\n  font-size: 12px;\n  margin-bottom: 8px;\n  opacity: 0.6;\n  text-transform: uppercase;\n  letter-spacing: 1px;\n  font-weight: 700;\n}\n.q-timeline__dot {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  width: 15px;\n}\n.q-timeline__dot:before, .q-timeline__dot:after {\n  content: "";\n  background: currentColor;\n  display: block;\n  position: absolute;\n}\n.q-timeline__dot:before {\n  border: 3px solid transparent;\n  border-radius: 100%;\n  height: 15px;\n  width: 15px;\n  top: 4px;\n  left: 0;\n  transition: background 0.3s ease-in-out, border 0.3s ease-in-out;\n}\n.q-timeline__dot:after {\n  width: 3px;\n  opacity: 0.4;\n  top: 24px;\n  bottom: 0;\n  left: 6px;\n}\n.q-timeline__dot .q-icon {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  font-size: 16px;\n  height: 38px;\n  line-height: 38px;\n  width: 100%;\n  color: #fff;\n}\n.q-timeline__dot .q-icon > svg,\n.q-timeline__dot .q-icon > img {\n  width: 1em;\n  height: 1em;\n}\n.q-timeline__dot-img {\n  position: absolute;\n  top: 4px;\n  left: 0;\n  right: 0;\n  height: 31px;\n  width: 31px;\n  background: currentColor;\n  border-radius: 50%;\n}\n.q-timeline__heading {\n  position: relative;\n}\n.q-timeline__heading:first-child .q-timeline__heading-title {\n  padding-top: 0;\n}\n.q-timeline__heading:last-child .q-timeline__heading-title {\n  padding-bottom: 0;\n}\n.q-timeline__heading-title {\n  padding: 32px 0;\n  margin: 0;\n}\n.q-timeline__entry {\n  position: relative;\n  line-height: 22px;\n}\n.q-timeline__entry:last-child {\n  padding-bottom: 0 !important;\n}\n.q-timeline__entry:last-child .q-timeline__dot:after {\n  content: none;\n}\n.q-timeline__entry--icon .q-timeline__dot {\n  width: 31px;\n}\n.q-timeline__entry--icon .q-timeline__dot:before {\n  height: 31px;\n  width: 31px;\n}\n.q-timeline__entry--icon .q-timeline__dot:after {\n  top: 41px;\n  left: 14px;\n}\n.q-timeline__entry--icon .q-timeline__subtitle {\n  padding-top: 8px;\n}\n.q-timeline--dense--right .q-timeline__entry {\n  padding-left: 40px;\n}\n.q-timeline--dense--right .q-timeline__entry--icon .q-timeline__dot {\n  left: -8px;\n}\n.q-timeline--dense--right .q-timeline__dot {\n  left: 0;\n}\n.q-timeline--dense--left .q-timeline__heading {\n  text-align: right;\n}\n.q-timeline--dense--left .q-timeline__entry {\n  padding-right: 40px;\n}\n.q-timeline--dense--left .q-timeline__entry--icon .q-timeline__dot {\n  right: -8px;\n}\n.q-timeline--dense--left .q-timeline__content, .q-timeline--dense--left .q-timeline__title, .q-timeline--dense--left .q-timeline__subtitle {\n  text-align: right;\n}\n.q-timeline--dense--left .q-timeline__dot {\n  right: 0;\n}\n.q-timeline--comfortable {\n  display: table;\n}\n.q-timeline--comfortable .q-timeline__heading {\n  display: table-row;\n  font-size: 200%;\n}\n.q-timeline--comfortable .q-timeline__heading > div {\n  display: table-cell;\n}\n.q-timeline--comfortable .q-timeline__entry {\n  display: table-row;\n  padding: 0;\n}\n.q-timeline--comfortable .q-timeline__entry--icon .q-timeline__content {\n  padding-top: 8px;\n}\n.q-timeline--comfortable .q-timeline__subtitle, .q-timeline--comfortable .q-timeline__dot, .q-timeline--comfortable .q-timeline__content {\n  display: table-cell;\n  vertical-align: top;\n}\n.q-timeline--comfortable .q-timeline__subtitle {\n  width: 35%;\n}\n.q-timeline--comfortable .q-timeline__dot {\n  position: relative;\n  min-width: 31px;\n}\n.q-timeline--comfortable--right .q-timeline__heading .q-timeline__heading-title {\n  margin-left: -50px;\n}\n.q-timeline--comfortable--right .q-timeline__subtitle {\n  text-align: right;\n  padding-right: 30px;\n}\n.q-timeline--comfortable--right .q-timeline__content {\n  padding-left: 30px;\n}\n.q-timeline--comfortable--right .q-timeline__entry--icon .q-timeline__dot {\n  left: -8px;\n}\n.q-timeline--comfortable--left .q-timeline__heading {\n  text-align: right;\n}\n.q-timeline--comfortable--left .q-timeline__heading .q-timeline__heading-title {\n  margin-right: -50px;\n}\n.q-timeline--comfortable--left .q-timeline__subtitle {\n  padding-left: 30px;\n}\n.q-timeline--comfortable--left .q-timeline__content {\n  padding-right: 30px;\n}\n.q-timeline--comfortable--left .q-timeline__content, .q-timeline--comfortable--left .q-timeline__title {\n  text-align: right;\n}\n.q-timeline--comfortable--left .q-timeline__entry--icon .q-timeline__dot {\n  right: 0;\n}\n.q-timeline--comfortable--left .q-timeline__dot {\n  right: -8px;\n}\n.q-timeline--loose .q-timeline__heading-title {\n  text-align: center;\n  margin-left: 0;\n}\n.q-timeline--loose .q-timeline__entry, .q-timeline--loose .q-timeline__subtitle, .q-timeline--loose .q-timeline__dot, .q-timeline--loose .q-timeline__content {\n  display: block;\n  margin: 0;\n  padding: 0;\n}\n.q-timeline--loose .q-timeline__dot {\n  position: absolute;\n  left: 50%;\n  margin-left: -7.15px;\n}\n.q-timeline--loose .q-timeline__entry {\n  padding-bottom: 24px;\n  overflow: hidden;\n}\n.q-timeline--loose .q-timeline__entry--icon .q-timeline__dot {\n  margin-left: -15px;\n}\n.q-timeline--loose .q-timeline__entry--icon .q-timeline__subtitle {\n  line-height: 38px;\n}\n.q-timeline--loose .q-timeline__entry--icon .q-timeline__content {\n  padding-top: 8px;\n}\n.q-timeline--loose .q-timeline__entry--left .q-timeline__content, .q-timeline--loose .q-timeline__entry--right .q-timeline__subtitle {\n  float: left;\n  padding-right: 30px;\n  text-align: right;\n}\n.q-timeline--loose .q-timeline__entry--left .q-timeline__subtitle, .q-timeline--loose .q-timeline__entry--right .q-timeline__content {\n  float: right;\n  text-align: left;\n  padding-left: 30px;\n}\n.q-timeline--loose .q-timeline__subtitle, .q-timeline--loose .q-timeline__content {\n  width: 50%;\n}\n.q-toggle {\n  vertical-align: middle;\n}\n.q-toggle__native {\n  width: 1px;\n  height: 1px;\n}\n.q-toggle__track {\n  height: 0.35em;\n  border-radius: 0.175em;\n  opacity: 0.38;\n  background: currentColor;\n}\n.q-toggle__thumb {\n  top: 0.25em;\n  left: 0.25em;\n  width: 0.5em;\n  height: 0.5em;\n  transition: left 0.22s cubic-bezier(0.4, 0, 0.2, 1);\n  -webkit-user-select: none;\n          user-select: none;\n  z-index: 0;\n}\n.q-toggle__thumb:after {\n  content: "";\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  border-radius: 50%;\n  background: #fff;\n  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);\n}\n.q-toggle__thumb .q-icon {\n  font-size: 0.3em;\n  min-width: 1em;\n  color: #000;\n  opacity: 0.54;\n  z-index: 1;\n}\n.q-toggle__inner {\n  font-size: 40px;\n  width: 1.4em;\n  min-width: 1.4em;\n  height: 1em;\n  padding: 0.325em 0.3em;\n  -webkit-print-color-adjust: exact;\n}\n.q-toggle__inner--indet .q-toggle__thumb {\n  left: 0.45em;\n}\n.q-toggle__inner--truthy {\n  color: var(--q-primary);\n}\n.q-toggle__inner--truthy .q-toggle__track {\n  opacity: 0.54;\n}\n.q-toggle__inner--truthy .q-toggle__thumb {\n  left: 0.65em;\n}\n.q-toggle__inner--truthy .q-toggle__thumb:after {\n  background-color: currentColor;\n}\n.q-toggle__inner--truthy .q-toggle__thumb .q-icon {\n  color: #fff;\n  opacity: 1;\n}\n.q-toggle.disabled {\n  opacity: 0.75 !important;\n}\n.q-toggle--dark .q-toggle__inner {\n  color: #fff;\n}\n.q-toggle--dark .q-toggle__inner--truthy {\n  color: var(--q-primary);\n}\n.q-toggle--dark .q-toggle__thumb:before {\n  opacity: 0.32 !important;\n}\n.q-toggle--dense .q-toggle__inner {\n  width: 0.8em;\n  min-width: 0.8em;\n  height: 0.5em;\n  padding: 0.07625em 0;\n}\n.q-toggle--dense .q-toggle__thumb {\n  top: 0;\n  left: 0;\n}\n.q-toggle--dense .q-toggle__inner--indet .q-toggle__thumb {\n  left: 0.15em;\n}\n.q-toggle--dense .q-toggle__inner--truthy .q-toggle__thumb {\n  left: 0.3em;\n}\n.q-toggle--dense .q-toggle__label {\n  padding-left: 0.5em;\n}\n.q-toggle--dense.reverse .q-toggle__label {\n  padding-left: 0;\n  padding-right: 0.5em;\n}\nbody.desktop .q-toggle:not(.disabled) .q-toggle__thumb:before {\n  content: "";\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  border-radius: 50%;\n  background: currentColor;\n  opacity: 0.12;\n  transform: scale3d(0, 0, 1);\n  transition: transform 0.22s cubic-bezier(0, 0, 0.2, 1);\n}\nbody.desktop .q-toggle:not(.disabled):focus .q-toggle__thumb:before, body.desktop .q-toggle:not(.disabled):hover .q-toggle__thumb:before {\n  transform: scale3d(2, 2, 1);\n}\nbody.desktop .q-toggle--dense:not(.disabled):focus .q-toggle__thumb:before, body.desktop .q-toggle--dense:not(.disabled):hover .q-toggle__thumb:before {\n  transform: scale3d(1.5, 1.5, 1);\n}\n.q-toolbar {\n  position: relative;\n  padding: 0 12px;\n  min-height: 50px;\n  width: 100%;\n}\n.q-toolbar--inset {\n  padding-left: 58px;\n}\n.q-toolbar .q-avatar {\n  font-size: 38px;\n}\n.q-toolbar__title {\n  flex: 1 1 0%;\n  min-width: 1px;\n  max-width: 100%;\n  font-size: 21px;\n  font-weight: normal;\n  letter-spacing: 0.01em;\n  padding: 0 12px;\n}\n.q-toolbar__title:first-child {\n  padding-left: 0;\n}\n.q-toolbar__title:last-child {\n  padding-right: 0;\n}\n.q-tooltip--style {\n  font-size: 10px;\n  color: #fafafa;\n  background: #757575;\n  border-radius: 4px;\n  text-transform: none;\n  font-weight: normal;\n}\n.q-tooltip {\n  z-index: 9000;\n  position: fixed !important;\n  overflow-y: auto;\n  overflow-x: hidden;\n  padding: 6px 10px;\n}\n@media (max-width: 599.98px) {\n  .q-tooltip {\n    font-size: 14px;\n    padding: 8px 16px;\n  }\n}\n.q-tree {\n  position: relative;\n  color: #9e9e9e;\n}\n.q-tree__node {\n  padding: 0 0 3px 22px;\n}\n.q-tree__node:after {\n  content: "";\n  position: absolute;\n  top: -3px;\n  bottom: 0;\n  width: 2px;\n  right: auto;\n  left: -13px;\n  border-left: 1px solid currentColor;\n}\n.q-tree__node:last-child:after {\n  display: none;\n}\n.q-tree__node--disabled {\n  pointer-events: none;\n}\n.q-tree__node--disabled .disabled {\n  opacity: 1 !important;\n}\n.q-tree__node--disabled > div,\n.q-tree__node--disabled > i,\n.q-tree__node--disabled > .disabled {\n  opacity: 0.6 !important;\n}\n.q-tree__node--disabled > div .q-tree__node--disabled > div,\n.q-tree__node--disabled > div .q-tree__node--disabled > i,\n.q-tree__node--disabled > div .q-tree__node--disabled > .disabled,\n.q-tree__node--disabled > i .q-tree__node--disabled > div,\n.q-tree__node--disabled > i .q-tree__node--disabled > i,\n.q-tree__node--disabled > i .q-tree__node--disabled > .disabled,\n.q-tree__node--disabled > .disabled .q-tree__node--disabled > div,\n.q-tree__node--disabled > .disabled .q-tree__node--disabled > i,\n.q-tree__node--disabled > .disabled .q-tree__node--disabled > .disabled {\n  opacity: 1 !important;\n}\n.q-tree__node-header:before {\n  content: "";\n  position: absolute;\n  top: -3px;\n  bottom: 50%;\n  width: 31px;\n  left: -35px;\n  border-left: 1px solid currentColor;\n  border-bottom: 1px solid currentColor;\n}\n.q-tree__children {\n  padding-left: 25px;\n}\n.q-tree__node-body {\n  padding: 5px 0 8px 5px;\n}\n.q-tree__node--parent {\n  padding-left: 2px;\n}\n.q-tree__node--parent > .q-tree__node-header:before {\n  width: 15px;\n  left: -15px;\n}\n.q-tree__node--parent > .q-tree__node-collapsible > .q-tree__node-body {\n  padding: 5px 0 8px 27px;\n}\n.q-tree__node--parent > .q-tree__node-collapsible > .q-tree__node-body:after {\n  content: "";\n  position: absolute;\n  top: 0;\n  width: 2px;\n  height: 100%;\n  right: auto;\n  left: 12px;\n  border-left: 1px solid currentColor;\n  bottom: 50px;\n}\n.q-tree__node--link {\n  cursor: pointer;\n}\n.q-tree__node-header {\n  padding: 4px;\n  margin-top: 3px;\n  border-radius: 4px;\n  outline: 0;\n}\n.q-tree__node-header-content {\n  color: #000;\n  transition: color 0.3s;\n}\n.q-tree__node--selected .q-tree__node-header-content {\n  color: #9e9e9e;\n}\n.q-tree__icon, .q-tree__node-header-content .q-icon {\n  font-size: 21px;\n}\n.q-tree__img {\n  height: 42px;\n  border-radius: 2px;\n}\n.q-tree__avatar, .q-tree__node-header-content .q-avatar {\n  font-size: 28px;\n  border-radius: 50%;\n  width: 28px;\n  height: 28px;\n}\n.q-tree__arrow, .q-tree__spinner {\n  font-size: 16px;\n  margin-right: 4px;\n}\n.q-tree__arrow {\n  transition: transform 0.3s;\n}\n.q-tree__arrow--rotate {\n  transform: rotate3d(0, 0, 1, 90deg);\n}\n.q-tree__tickbox {\n  margin-right: 4px;\n}\n.q-tree > .q-tree__node {\n  padding: 0;\n}\n.q-tree > .q-tree__node:after, .q-tree > .q-tree__node > .q-tree__node-header:before {\n  display: none;\n}\n.q-tree > .q-tree__node--child > .q-tree__node-header {\n  padding-left: 24px;\n}\n.q-tree--dark .q-tree__node-header-content {\n  color: #fff;\n}\n.q-tree--no-connectors .q-tree__node:after,\n.q-tree--no-connectors .q-tree__node-header:before,\n.q-tree--no-connectors .q-tree__node-body:after {\n  display: none !important;\n}\n.q-tree--dense > .q-tree__node--child > .q-tree__node-header {\n  padding-left: 1px;\n}\n.q-tree--dense .q-tree__arrow, .q-tree--dense .q-tree__spinner {\n  margin-right: 1px;\n}\n.q-tree--dense .q-tree__img {\n  height: 32px;\n}\n.q-tree--dense .q-tree__tickbox {\n  margin-right: 3px;\n}\n.q-tree--dense .q-tree__node {\n  padding: 0;\n}\n.q-tree--dense .q-tree__node:after {\n  top: 0;\n  left: -8px;\n}\n.q-tree--dense .q-tree__node-header {\n  margin-top: 0;\n  padding: 1px;\n}\n.q-tree--dense .q-tree__node-header:before {\n  top: 0;\n  left: -8px;\n  width: 8px;\n}\n.q-tree--dense .q-tree__node--child {\n  padding-left: 17px;\n}\n.q-tree--dense .q-tree__node--child > .q-tree__node-header:before {\n  left: -25px;\n  width: 21px;\n}\n.q-tree--dense .q-tree__node-body {\n  padding: 0 0 2px;\n}\n.q-tree--dense .q-tree__node--parent > .q-tree__node-collapsible > .q-tree__node-body {\n  padding: 0 0 2px 20px;\n}\n.q-tree--dense .q-tree__node--parent > .q-tree__node-collapsible > .q-tree__node-body:after {\n  left: 8px;\n}\n.q-tree--dense .q-tree__children {\n  padding-left: 16px;\n}\n[dir=rtl] .q-tree__arrow {\n  transform: rotate3d(0, 0, 1, 180deg) /* rtl:ignore */;\n}\n[dir=rtl] .q-tree__arrow--rotate {\n  transform: rotate3d(0, 0, 1, 90deg) /* rtl:ignore */;\n}\n.q-uploader {\n  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12);\n  border-radius: 4px;\n  vertical-align: top;\n  background: #fff;\n  position: relative;\n  width: 320px;\n  max-height: 320px;\n}\n.q-uploader--bordered {\n  border: 1px solid rgba(0, 0, 0, 0.12);\n}\n.q-uploader__input {\n  opacity: 0;\n  width: 100%;\n  height: 100%;\n  cursor: pointer !important;\n  z-index: 1;\n}\n.q-uploader__input::-webkit-file-upload-button {\n  cursor: pointer;\n}\n.q-uploader__header:before, .q-uploader__file:before {\n  content: "";\n  border-top-left-radius: inherit;\n  border-top-right-radius: inherit;\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  pointer-events: none;\n  background: currentColor;\n  opacity: 0.04;\n}\n.q-uploader__header {\n  position: relative;\n  border-top-left-radius: inherit;\n  border-top-right-radius: inherit;\n  background-color: var(--q-primary);\n  color: #fff;\n  width: 100%;\n}\n.q-uploader__spinner {\n  font-size: 24px;\n  margin-right: 4px;\n}\n.q-uploader__header-content {\n  padding: 8px;\n}\n.q-uploader__dnd {\n  outline: 1px dashed currentColor;\n  outline-offset: -4px;\n  background: rgba(255, 255, 255, 0.6);\n}\n.q-uploader__overlay {\n  font-size: 36px;\n  color: #000;\n  background-color: rgba(255, 255, 255, 0.6);\n}\n.q-uploader__list {\n  position: relative;\n  border-bottom-left-radius: inherit;\n  border-bottom-right-radius: inherit;\n  padding: 8px;\n  min-height: 60px;\n  flex: 1 1 auto;\n}\n.q-uploader__file {\n  border-radius: 4px 4px 0 0;\n  border: 1px solid rgba(0, 0, 0, 0.12);\n}\n.q-uploader__file .q-circular-progress {\n  font-size: 24px;\n}\n.q-uploader__file--img {\n  color: #fff;\n  height: 200px;\n  min-width: 200px;\n  background-position: 50% 50%;\n  background-size: cover;\n  background-repeat: no-repeat;\n}\n.q-uploader__file--img:before {\n  content: none;\n}\n.q-uploader__file--img .q-circular-progress {\n  color: #fff;\n}\n.q-uploader__file--img .q-uploader__file-header {\n  padding-bottom: 24px;\n  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 20%, rgba(255, 255, 255, 0));\n}\n.q-uploader__file + .q-uploader__file {\n  margin-top: 8px;\n}\n.q-uploader__file-header {\n  position: relative;\n  padding: 4px 8px;\n  border-top-left-radius: inherit;\n  border-top-right-radius: inherit;\n}\n.q-uploader__file-header-content {\n  padding-right: 8px;\n}\n.q-uploader__file-status {\n  font-size: 24px;\n  margin-right: 4px;\n}\n.q-uploader__title {\n  font-size: 14px;\n  font-weight: bold;\n  line-height: 18px;\n  word-break: break-word;\n}\n.q-uploader__subtitle {\n  font-size: 12px;\n  line-height: 18px;\n}\n.q-uploader--disable .q-uploader__header, .q-uploader--disable .q-uploader__list {\n  pointer-events: none;\n}\n.q-uploader--dark {\n  border-color: rgba(255, 255, 255, 0.28);\n}\n.q-uploader--dark .q-uploader__file {\n  border-color: rgba(255, 255, 255, 0.28);\n}\n.q-uploader--dark .q-uploader__dnd, .q-uploader--dark .q-uploader__overlay {\n  background: rgba(255, 255, 255, 0.3);\n}\n.q-uploader--dark .q-uploader__overlay {\n  color: #fff;\n}\nimg.responsive {\n  max-width: 100%;\n  height: auto;\n}\n.q-video {\n  position: relative;\n  overflow: hidden;\n  border-radius: inherit;\n}\n.q-video iframe,\n.q-video object,\n.q-video embed {\n  width: 100%;\n  height: 100%;\n}\n.q-video--responsive {\n  height: 0;\n}\n.q-video--responsive iframe,\n.q-video--responsive object,\n.q-video--responsive embed {\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n.q-virtual-scroll:focus {\n  outline: 0;\n}\n.q-virtual-scroll__content {\n  outline: none;\n  contain: content;\n}\n.q-virtual-scroll__content > * {\n  overflow-anchor: none;\n}\n.q-virtual-scroll__content > [data-q-vs-anchor] {\n  overflow-anchor: auto;\n}\n.q-virtual-scroll__padding {\n  background: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0) 20%, rgba(128, 128, 128, 0.03) 20%, rgba(128, 128, 128, 0.08) 50%, rgba(128, 128, 128, 0.03) 80%, rgba(255, 255, 255, 0) 80%, rgba(255, 255, 255, 0)) /* rtl:ignore */;\n  background-size: var(--q-virtual-scroll-item-width, 100%) var(--q-virtual-scroll-item-height, 50px) /* rtl:ignore */;\n}\n.q-table .q-virtual-scroll__padding tr {\n  height: 0 !important;\n}\n.q-table .q-virtual-scroll__padding td {\n  padding: 0 !important;\n}\n.q-virtual-scroll--horizontal {\n  display: flex;\n  flex-direction: row;\n  flex-wrap: nowrap;\n  align-items: stretch;\n}\n.q-virtual-scroll--horizontal .q-virtual-scroll__content {\n  display: flex;\n  flex-direction: row;\n  flex-wrap: nowrap;\n}\n.q-virtual-scroll--horizontal .q-virtual-scroll__padding, .q-virtual-scroll--horizontal .q-virtual-scroll__content, .q-virtual-scroll--horizontal .q-virtual-scroll__content > * {\n  flex: 0 0 auto;\n}\n.q-virtual-scroll--horizontal .q-virtual-scroll__padding {\n  background: linear-gradient(to left, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0) 20%, rgba(128, 128, 128, 0.03) 20%, rgba(128, 128, 128, 0.08) 50%, rgba(128, 128, 128, 0.03) 80%, rgba(255, 255, 255, 0) 80%, rgba(255, 255, 255, 0)) /* rtl:ignore */;\n  background-size: var(--q-virtual-scroll-item-width, 50px) var(--q-virtual-scroll-item-height, 100%) /* rtl:ignore */;\n}\n.q-ripple {\n  position: absolute;\n  top: 0;\n  left: 0 /* rtl:ignore */;\n  width: 100%;\n  height: 100%;\n  color: inherit;\n  border-radius: inherit;\n  z-index: 0;\n  pointer-events: none;\n  overflow: hidden;\n  contain: strict;\n}\n.q-ripple__inner {\n  position: absolute;\n  top: 0;\n  left: 0 /* rtl:ignore */;\n  opacity: 0;\n  color: inherit;\n  border-radius: 50%;\n  background: currentColor;\n  pointer-events: none;\n  will-change: transform, opacity;\n}\n.q-ripple__inner--enter {\n  transition: transform 0.225s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.1s cubic-bezier(0.4, 0, 0.2, 1);\n}\n.q-ripple__inner--leave {\n  transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1);\n}\n.q-morph--invisible,\n.q-morph--internal {\n  opacity: 0 !important;\n  pointer-events: none !important;\n  position: fixed !important;\n  right: 200vw !important;\n  bottom: 200vh !important;\n}\n.q-loading {\n  color: #000;\n  position: fixed !important;\n}\n.q-loading__backdrop {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  opacity: 0.5;\n  z-index: -1;\n  background-color: #000;\n  transition: background-color 0.28s;\n}\n.q-loading__box {\n  border-radius: 4px;\n  padding: 18px;\n  color: #fff;\n  max-width: 450px;\n}\n.q-loading__message {\n  margin: 40px 20px 0;\n  text-align: center;\n}\n.q-notifications__list {\n  z-index: 9500;\n  pointer-events: none;\n  left: 0;\n  right: 0;\n  margin-bottom: 10px;\n  position: relative;\n}\n.q-notifications__list--center {\n  top: 0;\n  bottom: 0;\n}\n.q-notifications__list--top {\n  top: 0;\n}\n.q-notifications__list--bottom {\n  bottom: 0;\n}\nbody.q-ios-padding .q-notifications__list--center, body.q-ios-padding .q-notifications__list--top {\n  top: 20px;\n  top: env(safe-area-inset-top);\n}\nbody.q-ios-padding .q-notifications__list--center, body.q-ios-padding .q-notifications__list--bottom {\n  bottom: env(safe-area-inset-bottom);\n}\n.q-notification {\n  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12);\n  border-radius: 4px;\n  pointer-events: all;\n  display: inline-flex;\n  margin: 10px 10px 0;\n  transition: transform 1s, opacity 1s;\n  z-index: 9500;\n  flex-shrink: 0;\n  max-width: 95vw;\n  background: #323232;\n  color: #fff;\n  font-size: 14px;\n}\n.q-notification__icon {\n  font-size: 24px;\n  flex: 0 0 1em;\n}\n.q-notification__icon--additional {\n  margin-right: 16px;\n}\n.q-notification__avatar {\n  font-size: 32px;\n}\n.q-notification__avatar--additional {\n  margin-right: 8px;\n}\n.q-notification__spinner {\n  font-size: 32px;\n}\n.q-notification__spinner--additional {\n  margin-right: 8px;\n}\n.q-notification__message {\n  padding: 8px 0;\n}\n.q-notification__caption {\n  font-size: 0.9em;\n  opacity: 0.7;\n}\n.q-notification__actions {\n  color: var(--q-primary);\n}\n.q-notification__badge {\n  animation: q-notif-badge 0.42s;\n  padding: 4px 8px;\n  position: absolute;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2), 0 1px 1px rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12);\n  background-color: var(--q-negative);\n  color: #fff;\n  border-radius: 4px;\n  font-size: 12px;\n  line-height: 12px;\n}\n.q-notification__badge--top-left, .q-notification__badge--top-right {\n  top: -6px;\n}\n.q-notification__badge--bottom-left, .q-notification__badge--bottom-right {\n  bottom: -6px;\n}\n.q-notification__badge--top-left, .q-notification__badge--bottom-left {\n  left: -22px;\n}\n.q-notification__badge--top-right, .q-notification__badge--bottom-right {\n  right: -22px;\n}\n.q-notification__progress {\n  z-index: -1;\n  position: absolute;\n  height: 3px;\n  bottom: 0;\n  left: -10px;\n  right: -10px;\n  animation: q-notif-progress linear;\n  background: currentColor;\n  opacity: 0.3;\n  border-radius: 4px 4px 0 0;\n  transform-origin: 0 50%;\n  transform: scaleX(0);\n}\n.q-notification--standard {\n  padding: 0 16px;\n  min-height: 48px;\n}\n.q-notification--standard .q-notification__actions {\n  padding: 6px 0 6px 8px;\n  margin-right: -8px;\n}\n.q-notification--multi-line {\n  min-height: 68px;\n  padding: 8px 16px;\n}\n.q-notification--multi-line .q-notification__badge--top-left, .q-notification--multi-line .q-notification__badge--top-right {\n  top: -15px;\n}\n.q-notification--multi-line .q-notification__badge--bottom-left, .q-notification--multi-line .q-notification__badge--bottom-right {\n  bottom: -15px;\n}\n.q-notification--multi-line .q-notification__progress {\n  bottom: -8px;\n}\n.q-notification--multi-line .q-notification__actions {\n  padding: 0;\n}\n.q-notification--multi-line .q-notification__actions--with-media {\n  padding-left: 25px;\n}\n.q-notification--top-left-enter-from, .q-notification--top-left-leave-to, .q-notification--top-enter-from, .q-notification--top-leave-to, .q-notification--top-right-enter-from, .q-notification--top-right-leave-to {\n  opacity: 0;\n  transform: translateY(-50px);\n  z-index: 9499;\n}\n.q-notification--left-enter-from, .q-notification--left-leave-to, .q-notification--center-enter-from, .q-notification--center-leave-to, .q-notification--right-enter-from, .q-notification--right-leave-to {\n  opacity: 0;\n  transform: rotateX(90deg);\n  z-index: 9499;\n}\n.q-notification--bottom-left-enter-from, .q-notification--bottom-left-leave-to, .q-notification--bottom-enter-from, .q-notification--bottom-leave-to, .q-notification--bottom-right-enter-from, .q-notification--bottom-right-leave-to {\n  opacity: 0;\n  transform: translateY(50px);\n  z-index: 9499;\n}\n.q-notification--top-left-leave-active, .q-notification--top-leave-active, .q-notification--top-right-leave-active, .q-notification--left-leave-active, .q-notification--center-leave-active, .q-notification--right-leave-active, .q-notification--bottom-left-leave-active, .q-notification--bottom-leave-active, .q-notification--bottom-right-leave-active {\n  position: absolute;\n  z-index: 9499;\n  margin-left: 0;\n  margin-right: 0;\n}\n.q-notification--top-leave-active, .q-notification--center-leave-active {\n  top: 0;\n}\n.q-notification--bottom-left-leave-active, .q-notification--bottom-leave-active, .q-notification--bottom-right-leave-active {\n  bottom: 0;\n}\n@media (min-width: 600px) {\n  .q-notification {\n    max-width: 65vw;\n  }\n}\n@keyframes q-notif-badge {\n  15% {\n    transform: translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg);\n  }\n  30% {\n    transform: translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg);\n  }\n  45% {\n    transform: translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg);\n  }\n  60% {\n    transform: translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg);\n  }\n  75% {\n    transform: translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg);\n  }\n}\n@keyframes q-notif-progress {\n  0% {\n    transform: scaleX(1);\n  }\n  100% {\n    transform: scaleX(0);\n  }\n}\n/* * Animate.css additions\n * * Adapted from: https:\n * */\n:root {\n  --animate-duration: 0.3s;\n  --animate-delay: 0.3s;\n  --animate-repeat: 1;\n}\n.animated {\n  animation-duration: var(--animate-duration);\n  animation-fill-mode: both;\n}\n.animated.infinite {\n  animation-iteration-count: infinite;\n}\n.animated.hinge {\n  animation-duration: 2s;\n}\n.animated.repeat-1 {\n  animation-iteration-count: var(--animate-repeat);\n}\n.animated.repeat-2 {\n  animation-iteration-count: calc(var(--animate-repeat) * 2);\n}\n.animated.repeat-3 {\n  animation-iteration-count: calc(var(--animate-repeat) * 3);\n}\n.animated.delay-1s {\n  animation-delay: var(--animate-delay);\n}\n.animated.delay-2s {\n  animation-delay: calc(var(--animate-delay) * 2);\n}\n.animated.delay-3s {\n  animation-delay: calc(var(--animate-delay) * 3);\n}\n.animated.delay-4s {\n  animation-delay: calc(var(--animate-delay) * 4);\n}\n.animated.delay-5s {\n  animation-delay: calc(var(--animate-delay) * 5);\n}\n.animated.faster {\n  animation-duration: calc(var(--animate-duration) / 2);\n}\n.animated.fast {\n  animation-duration: calc(var(--animate-duration) * 0.8);\n}\n.animated.slow {\n  animation-duration: calc(var(--animate-duration) * 2);\n}\n.animated.slower {\n  animation-duration: calc(var(--animate-duration) * 3);\n}\n@media print, (prefers-reduced-motion: reduce) {\n  .animated {\n    animation-duration: 1ms !important;\n    transition-duration: 1ms !important;\n    animation-iteration-count: 1 !important;\n  }\n\n  .animated[class*=Out] {\n    opacity: 0;\n  }\n}\n.q-animate--scale {\n  animation: q-scale 0.15s;\n  animation-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);\n}\n@keyframes q-scale {\n  0% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(1.04);\n  }\n  100% {\n    transform: scale(1);\n  }\n}\n.q-animate--fade {\n  animation: q-fade 0.2s /* rtl:ignore */;\n}\n@keyframes q-fade {\n  0% {\n    opacity: 0;\n  }\n  100% {\n    opacity: 1;\n  }\n}\n:root {\n  --q-primary: #1976D2;\n  --q-secondary: #26A69A;\n  --q-accent: #9C27B0;\n  --q-positive: #21BA45;\n  --q-negative: #C10015;\n  --q-info: #31CCEC;\n  --q-warning: #F2C037;\n  --q-dark: #1D1D1D;\n  --q-dark-page: #121212;\n}\n.text-dark {\n  color: var(--q-dark) !important;\n}\n.bg-dark {\n  background: var(--q-dark) !important;\n}\n.text-primary {\n  color: var(--q-primary) !important;\n}\n.bg-primary {\n  background: var(--q-primary) !important;\n}\n.text-secondary {\n  color: var(--q-secondary) !important;\n}\n.bg-secondary {\n  background: var(--q-secondary) !important;\n}\n.text-accent {\n  color: var(--q-accent) !important;\n}\n.bg-accent {\n  background: var(--q-accent) !important;\n}\n.text-positive {\n  color: var(--q-positive) !important;\n}\n.bg-positive {\n  background: var(--q-positive) !important;\n}\n.text-negative {\n  color: var(--q-negative) !important;\n}\n.bg-negative {\n  background: var(--q-negative) !important;\n}\n.text-info {\n  color: var(--q-info) !important;\n}\n.bg-info {\n  background: var(--q-info) !important;\n}\n.text-warning {\n  color: var(--q-warning) !important;\n}\n.bg-warning {\n  background: var(--q-warning) !important;\n}\n.text-white {\n  color: #fff !important;\n}\n.bg-white {\n  background: #fff !important;\n}\n.text-black {\n  color: #000 !important;\n}\n.bg-black {\n  background: #000 !important;\n}\n.text-transparent {\n  color: transparent !important;\n}\n.bg-transparent {\n  background: transparent !important;\n}\n.text-separator {\n  color: rgba(0, 0, 0, 0.12) !important;\n}\n.bg-separator {\n  background: rgba(0, 0, 0, 0.12) !important;\n}\n.text-dark-separator {\n  color: rgba(255, 255, 255, 0.28) !important;\n}\n.bg-dark-separator {\n  background: rgba(255, 255, 255, 0.28) !important;\n}\n.text-red {\n  color: #f44336 !important;\n}\n.text-red-1 {\n  color: #ffebee !important;\n}\n.text-red-2 {\n  color: #ffcdd2 !important;\n}\n.text-red-3 {\n  color: #ef9a9a !important;\n}\n.text-red-4 {\n  color: #e57373 !important;\n}\n.text-red-5 {\n  color: #ef5350 !important;\n}\n.text-red-6 {\n  color: #f44336 !important;\n}\n.text-red-7 {\n  color: #e53935 !important;\n}\n.text-red-8 {\n  color: #d32f2f !important;\n}\n.text-red-9 {\n  color: #c62828 !important;\n}\n.text-red-10 {\n  color: #b71c1c !important;\n}\n.text-red-11 {\n  color: #ff8a80 !important;\n}\n.text-red-12 {\n  color: #ff5252 !important;\n}\n.text-red-13 {\n  color: #ff1744 !important;\n}\n.text-red-14 {\n  color: #d50000 !important;\n}\n.text-pink {\n  color: #e91e63 !important;\n}\n.text-pink-1 {\n  color: #fce4ec !important;\n}\n.text-pink-2 {\n  color: #f8bbd0 !important;\n}\n.text-pink-3 {\n  color: #f48fb1 !important;\n}\n.text-pink-4 {\n  color: #f06292 !important;\n}\n.text-pink-5 {\n  color: #ec407a !important;\n}\n.text-pink-6 {\n  color: #e91e63 !important;\n}\n.text-pink-7 {\n  color: #d81b60 !important;\n}\n.text-pink-8 {\n  color: #c2185b !important;\n}\n.text-pink-9 {\n  color: #ad1457 !important;\n}\n.text-pink-10 {\n  color: #880e4f !important;\n}\n.text-pink-11 {\n  color: #ff80ab !important;\n}\n.text-pink-12 {\n  color: #ff4081 !important;\n}\n.text-pink-13 {\n  color: #f50057 !important;\n}\n.text-pink-14 {\n  color: #c51162 !important;\n}\n.text-purple {\n  color: #9c27b0 !important;\n}\n.text-purple-1 {\n  color: #f3e5f5 !important;\n}\n.text-purple-2 {\n  color: #e1bee7 !important;\n}\n.text-purple-3 {\n  color: #ce93d8 !important;\n}\n.text-purple-4 {\n  color: #ba68c8 !important;\n}\n.text-purple-5 {\n  color: #ab47bc !important;\n}\n.text-purple-6 {\n  color: #9c27b0 !important;\n}\n.text-purple-7 {\n  color: #8e24aa !important;\n}\n.text-purple-8 {\n  color: #7b1fa2 !important;\n}\n.text-purple-9 {\n  color: #6a1b9a !important;\n}\n.text-purple-10 {\n  color: #4a148c !important;\n}\n.text-purple-11 {\n  color: #ea80fc !important;\n}\n.text-purple-12 {\n  color: #e040fb !important;\n}\n.text-purple-13 {\n  color: #d500f9 !important;\n}\n.text-purple-14 {\n  color: #aa00ff !important;\n}\n.text-deep-purple {\n  color: #673ab7 !important;\n}\n.text-deep-purple-1 {\n  color: #ede7f6 !important;\n}\n.text-deep-purple-2 {\n  color: #d1c4e9 !important;\n}\n.text-deep-purple-3 {\n  color: #b39ddb !important;\n}\n.text-deep-purple-4 {\n  color: #9575cd !important;\n}\n.text-deep-purple-5 {\n  color: #7e57c2 !important;\n}\n.text-deep-purple-6 {\n  color: #673ab7 !important;\n}\n.text-deep-purple-7 {\n  color: #5e35b1 !important;\n}\n.text-deep-purple-8 {\n  color: #512da8 !important;\n}\n.text-deep-purple-9 {\n  color: #4527a0 !important;\n}\n.text-deep-purple-10 {\n  color: #311b92 !important;\n}\n.text-deep-purple-11 {\n  color: #b388ff !important;\n}\n.text-deep-purple-12 {\n  color: #7c4dff !important;\n}\n.text-deep-purple-13 {\n  color: #651fff !important;\n}\n.text-deep-purple-14 {\n  color: #6200ea !important;\n}\n.text-indigo {\n  color: #3f51b5 !important;\n}\n.text-indigo-1 {\n  color: #e8eaf6 !important;\n}\n.text-indigo-2 {\n  color: #c5cae9 !important;\n}\n.text-indigo-3 {\n  color: #9fa8da !important;\n}\n.text-indigo-4 {\n  color: #7986cb !important;\n}\n.text-indigo-5 {\n  color: #5c6bc0 !important;\n}\n.text-indigo-6 {\n  color: #3f51b5 !important;\n}\n.text-indigo-7 {\n  color: #3949ab !important;\n}\n.text-indigo-8 {\n  color: #303f9f !important;\n}\n.text-indigo-9 {\n  color: #283593 !important;\n}\n.text-indigo-10 {\n  color: #1a237e !important;\n}\n.text-indigo-11 {\n  color: #8c9eff !important;\n}\n.text-indigo-12 {\n  color: #536dfe !important;\n}\n.text-indigo-13 {\n  color: #3d5afe !important;\n}\n.text-indigo-14 {\n  color: #304ffe !important;\n}\n.text-blue {\n  color: #2196f3 !important;\n}\n.text-blue-1 {\n  color: #e3f2fd !important;\n}\n.text-blue-2 {\n  color: #bbdefb !important;\n}\n.text-blue-3 {\n  color: #90caf9 !important;\n}\n.text-blue-4 {\n  color: #64b5f6 !important;\n}\n.text-blue-5 {\n  color: #42a5f5 !important;\n}\n.text-blue-6 {\n  color: #2196f3 !important;\n}\n.text-blue-7 {\n  color: #1e88e5 !important;\n}\n.text-blue-8 {\n  color: #1976d2 !important;\n}\n.text-blue-9 {\n  color: #1565c0 !important;\n}\n.text-blue-10 {\n  color: #0d47a1 !important;\n}\n.text-blue-11 {\n  color: #82b1ff !important;\n}\n.text-blue-12 {\n  color: #448aff !important;\n}\n.text-blue-13 {\n  color: #2979ff !important;\n}\n.text-blue-14 {\n  color: #2962ff !important;\n}\n.text-light-blue {\n  color: #03a9f4 !important;\n}\n.text-light-blue-1 {\n  color: #e1f5fe !important;\n}\n.text-light-blue-2 {\n  color: #b3e5fc !important;\n}\n.text-light-blue-3 {\n  color: #81d4fa !important;\n}\n.text-light-blue-4 {\n  color: #4fc3f7 !important;\n}\n.text-light-blue-5 {\n  color: #29b6f6 !important;\n}\n.text-light-blue-6 {\n  color: #03a9f4 !important;\n}\n.text-light-blue-7 {\n  color: #039be5 !important;\n}\n.text-light-blue-8 {\n  color: #0288d1 !important;\n}\n.text-light-blue-9 {\n  color: #0277bd !important;\n}\n.text-light-blue-10 {\n  color: #01579b !important;\n}\n.text-light-blue-11 {\n  color: #80d8ff !important;\n}\n.text-light-blue-12 {\n  color: #40c4ff !important;\n}\n.text-light-blue-13 {\n  color: #00b0ff !important;\n}\n.text-light-blue-14 {\n  color: #0091ea !important;\n}\n.text-cyan {\n  color: #00bcd4 !important;\n}\n.text-cyan-1 {\n  color: #e0f7fa !important;\n}\n.text-cyan-2 {\n  color: #b2ebf2 !important;\n}\n.text-cyan-3 {\n  color: #80deea !important;\n}\n.text-cyan-4 {\n  color: #4dd0e1 !important;\n}\n.text-cyan-5 {\n  color: #26c6da !important;\n}\n.text-cyan-6 {\n  color: #00bcd4 !important;\n}\n.text-cyan-7 {\n  color: #00acc1 !important;\n}\n.text-cyan-8 {\n  color: #0097a7 !important;\n}\n.text-cyan-9 {\n  color: #00838f !important;\n}\n.text-cyan-10 {\n  color: #006064 !important;\n}\n.text-cyan-11 {\n  color: #84ffff !important;\n}\n.text-cyan-12 {\n  color: #18ffff !important;\n}\n.text-cyan-13 {\n  color: #00e5ff !important;\n}\n.text-cyan-14 {\n  color: #00b8d4 !important;\n}\n.text-teal {\n  color: #009688 !important;\n}\n.text-teal-1 {\n  color: #e0f2f1 !important;\n}\n.text-teal-2 {\n  color: #b2dfdb !important;\n}\n.text-teal-3 {\n  color: #80cbc4 !important;\n}\n.text-teal-4 {\n  color: #4db6ac !important;\n}\n.text-teal-5 {\n  color: #26a69a !important;\n}\n.text-teal-6 {\n  color: #009688 !important;\n}\n.text-teal-7 {\n  color: #00897b !important;\n}\n.text-teal-8 {\n  color: #00796b !important;\n}\n.text-teal-9 {\n  color: #00695c !important;\n}\n.text-teal-10 {\n  color: #004d40 !important;\n}\n.text-teal-11 {\n  color: #a7ffeb !important;\n}\n.text-teal-12 {\n  color: #64ffda !important;\n}\n.text-teal-13 {\n  color: #1de9b6 !important;\n}\n.text-teal-14 {\n  color: #00bfa5 !important;\n}\n.text-green {\n  color: #4caf50 !important;\n}\n.text-green-1 {\n  color: #e8f5e9 !important;\n}\n.text-green-2 {\n  color: #c8e6c9 !important;\n}\n.text-green-3 {\n  color: #a5d6a7 !important;\n}\n.text-green-4 {\n  color: #81c784 !important;\n}\n.text-green-5 {\n  color: #66bb6a !important;\n}\n.text-green-6 {\n  color: #4caf50 !important;\n}\n.text-green-7 {\n  color: #43a047 !important;\n}\n.text-green-8 {\n  color: #388e3c !important;\n}\n.text-green-9 {\n  color: #2e7d32 !important;\n}\n.text-green-10 {\n  color: #1b5e20 !important;\n}\n.text-green-11 {\n  color: #b9f6ca !important;\n}\n.text-green-12 {\n  color: #69f0ae !important;\n}\n.text-green-13 {\n  color: #00e676 !important;\n}\n.text-green-14 {\n  color: #00c853 !important;\n}\n.text-light-green {\n  color: #8bc34a !important;\n}\n.text-light-green-1 {\n  color: #f1f8e9 !important;\n}\n.text-light-green-2 {\n  color: #dcedc8 !important;\n}\n.text-light-green-3 {\n  color: #c5e1a5 !important;\n}\n.text-light-green-4 {\n  color: #aed581 !important;\n}\n.text-light-green-5 {\n  color: #9ccc65 !important;\n}\n.text-light-green-6 {\n  color: #8bc34a !important;\n}\n.text-light-green-7 {\n  color: #7cb342 !important;\n}\n.text-light-green-8 {\n  color: #689f38 !important;\n}\n.text-light-green-9 {\n  color: #558b2f !important;\n}\n.text-light-green-10 {\n  color: #33691e !important;\n}\n.text-light-green-11 {\n  color: #ccff90 !important;\n}\n.text-light-green-12 {\n  color: #b2ff59 !important;\n}\n.text-light-green-13 {\n  color: #76ff03 !important;\n}\n.text-light-green-14 {\n  color: #64dd17 !important;\n}\n.text-lime {\n  color: #cddc39 !important;\n}\n.text-lime-1 {\n  color: #f9fbe7 !important;\n}\n.text-lime-2 {\n  color: #f0f4c3 !important;\n}\n.text-lime-3 {\n  color: #e6ee9c !important;\n}\n.text-lime-4 {\n  color: #dce775 !important;\n}\n.text-lime-5 {\n  color: #d4e157 !important;\n}\n.text-lime-6 {\n  color: #cddc39 !important;\n}\n.text-lime-7 {\n  color: #c0ca33 !important;\n}\n.text-lime-8 {\n  color: #afb42b !important;\n}\n.text-lime-9 {\n  color: #9e9d24 !important;\n}\n.text-lime-10 {\n  color: #827717 !important;\n}\n.text-lime-11 {\n  color: #f4ff81 !important;\n}\n.text-lime-12 {\n  color: #eeff41 !important;\n}\n.text-lime-13 {\n  color: #c6ff00 !important;\n}\n.text-lime-14 {\n  color: #aeea00 !important;\n}\n.text-yellow {\n  color: #ffeb3b !important;\n}\n.text-yellow-1 {\n  color: #fffde7 !important;\n}\n.text-yellow-2 {\n  color: #fff9c4 !important;\n}\n.text-yellow-3 {\n  color: #fff59d !important;\n}\n.text-yellow-4 {\n  color: #fff176 !important;\n}\n.text-yellow-5 {\n  color: #ffee58 !important;\n}\n.text-yellow-6 {\n  color: #ffeb3b !important;\n}\n.text-yellow-7 {\n  color: #fdd835 !important;\n}\n.text-yellow-8 {\n  color: #fbc02d !important;\n}\n.text-yellow-9 {\n  color: #f9a825 !important;\n}\n.text-yellow-10 {\n  color: #f57f17 !important;\n}\n.text-yellow-11 {\n  color: #ffff8d !important;\n}\n.text-yellow-12 {\n  color: #ffff00 !important;\n}\n.text-yellow-13 {\n  color: #ffea00 !important;\n}\n.text-yellow-14 {\n  color: #ffd600 !important;\n}\n.text-amber {\n  color: #ffc107 !important;\n}\n.text-amber-1 {\n  color: #fff8e1 !important;\n}\n.text-amber-2 {\n  color: #ffecb3 !important;\n}\n.text-amber-3 {\n  color: #ffe082 !important;\n}\n.text-amber-4 {\n  color: #ffd54f !important;\n}\n.text-amber-5 {\n  color: #ffca28 !important;\n}\n.text-amber-6 {\n  color: #ffc107 !important;\n}\n.text-amber-7 {\n  color: #ffb300 !important;\n}\n.text-amber-8 {\n  color: #ffa000 !important;\n}\n.text-amber-9 {\n  color: #ff8f00 !important;\n}\n.text-amber-10 {\n  color: #ff6f00 !important;\n}\n.text-amber-11 {\n  color: #ffe57f !important;\n}\n.text-amber-12 {\n  color: #ffd740 !important;\n}\n.text-amber-13 {\n  color: #ffc400 !important;\n}\n.text-amber-14 {\n  color: #ffab00 !important;\n}\n.text-orange {\n  color: #ff9800 !important;\n}\n.text-orange-1 {\n  color: #fff3e0 !important;\n}\n.text-orange-2 {\n  color: #ffe0b2 !important;\n}\n.text-orange-3 {\n  color: #ffcc80 !important;\n}\n.text-orange-4 {\n  color: #ffb74d !important;\n}\n.text-orange-5 {\n  color: #ffa726 !important;\n}\n.text-orange-6 {\n  color: #ff9800 !important;\n}\n.text-orange-7 {\n  color: #fb8c00 !important;\n}\n.text-orange-8 {\n  color: #f57c00 !important;\n}\n.text-orange-9 {\n  color: #ef6c00 !important;\n}\n.text-orange-10 {\n  color: #e65100 !important;\n}\n.text-orange-11 {\n  color: #ffd180 !important;\n}\n.text-orange-12 {\n  color: #ffab40 !important;\n}\n.text-orange-13 {\n  color: #ff9100 !important;\n}\n.text-orange-14 {\n  color: #ff6d00 !important;\n}\n.text-deep-orange {\n  color: #ff5722 !important;\n}\n.text-deep-orange-1 {\n  color: #fbe9e7 !important;\n}\n.text-deep-orange-2 {\n  color: #ffccbc !important;\n}\n.text-deep-orange-3 {\n  color: #ffab91 !important;\n}\n.text-deep-orange-4 {\n  color: #ff8a65 !important;\n}\n.text-deep-orange-5 {\n  color: #ff7043 !important;\n}\n.text-deep-orange-6 {\n  color: #ff5722 !important;\n}\n.text-deep-orange-7 {\n  color: #f4511e !important;\n}\n.text-deep-orange-8 {\n  color: #e64a19 !important;\n}\n.text-deep-orange-9 {\n  color: #d84315 !important;\n}\n.text-deep-orange-10 {\n  color: #bf360c !important;\n}\n.text-deep-orange-11 {\n  color: #ff9e80 !important;\n}\n.text-deep-orange-12 {\n  color: #ff6e40 !important;\n}\n.text-deep-orange-13 {\n  color: #ff3d00 !important;\n}\n.text-deep-orange-14 {\n  color: #dd2c00 !important;\n}\n.text-brown {\n  color: #795548 !important;\n}\n.text-brown-1 {\n  color: #efebe9 !important;\n}\n.text-brown-2 {\n  color: #d7ccc8 !important;\n}\n.text-brown-3 {\n  color: #bcaaa4 !important;\n}\n.text-brown-4 {\n  color: #a1887f !important;\n}\n.text-brown-5 {\n  color: #8d6e63 !important;\n}\n.text-brown-6 {\n  color: #795548 !important;\n}\n.text-brown-7 {\n  color: #6d4c41 !important;\n}\n.text-brown-8 {\n  color: #5d4037 !important;\n}\n.text-brown-9 {\n  color: #4e342e !important;\n}\n.text-brown-10 {\n  color: #3e2723 !important;\n}\n.text-brown-11 {\n  color: #d7ccc8 !important;\n}\n.text-brown-12 {\n  color: #bcaaa4 !important;\n}\n.text-brown-13 {\n  color: #8d6e63 !important;\n}\n.text-brown-14 {\n  color: #5d4037 !important;\n}\n.text-grey {\n  color: #9e9e9e !important;\n}\n.text-grey-1 {\n  color: #fafafa !important;\n}\n.text-grey-2 {\n  color: #f5f5f5 !important;\n}\n.text-grey-3 {\n  color: #eeeeee !important;\n}\n.text-grey-4 {\n  color: #e0e0e0 !important;\n}\n.text-grey-5 {\n  color: #bdbdbd !important;\n}\n.text-grey-6 {\n  color: #9e9e9e !important;\n}\n.text-grey-7 {\n  color: #757575 !important;\n}\n.text-grey-8 {\n  color: #616161 !important;\n}\n.text-grey-9 {\n  color: #424242 !important;\n}\n.text-grey-10 {\n  color: #212121 !important;\n}\n.text-grey-11 {\n  color: #f5f5f5 !important;\n}\n.text-grey-12 {\n  color: #eeeeee !important;\n}\n.text-grey-13 {\n  color: #bdbdbd !important;\n}\n.text-grey-14 {\n  color: #616161 !important;\n}\n.text-blue-grey {\n  color: #607d8b !important;\n}\n.text-blue-grey-1 {\n  color: #eceff1 !important;\n}\n.text-blue-grey-2 {\n  color: #cfd8dc !important;\n}\n.text-blue-grey-3 {\n  color: #b0bec5 !important;\n}\n.text-blue-grey-4 {\n  color: #90a4ae !important;\n}\n.text-blue-grey-5 {\n  color: #78909c !important;\n}\n.text-blue-grey-6 {\n  color: #607d8b !important;\n}\n.text-blue-grey-7 {\n  color: #546e7a !important;\n}\n.text-blue-grey-8 {\n  color: #455a64 !important;\n}\n.text-blue-grey-9 {\n  color: #37474f !important;\n}\n.text-blue-grey-10 {\n  color: #263238 !important;\n}\n.text-blue-grey-11 {\n  color: #cfd8dc !important;\n}\n.text-blue-grey-12 {\n  color: #b0bec5 !important;\n}\n.text-blue-grey-13 {\n  color: #78909c !important;\n}\n.text-blue-grey-14 {\n  color: #455a64 !important;\n}\n.bg-red {\n  background: #f44336 !important;\n}\n.bg-red-1 {\n  background: #ffebee !important;\n}\n.bg-red-2 {\n  background: #ffcdd2 !important;\n}\n.bg-red-3 {\n  background: #ef9a9a !important;\n}\n.bg-red-4 {\n  background: #e57373 !important;\n}\n.bg-red-5 {\n  background: #ef5350 !important;\n}\n.bg-red-6 {\n  background: #f44336 !important;\n}\n.bg-red-7 {\n  background: #e53935 !important;\n}\n.bg-red-8 {\n  background: #d32f2f !important;\n}\n.bg-red-9 {\n  background: #c62828 !important;\n}\n.bg-red-10 {\n  background: #b71c1c !important;\n}\n.bg-red-11 {\n  background: #ff8a80 !important;\n}\n.bg-red-12 {\n  background: #ff5252 !important;\n}\n.bg-red-13 {\n  background: #ff1744 !important;\n}\n.bg-red-14 {\n  background: #d50000 !important;\n}\n.bg-pink {\n  background: #e91e63 !important;\n}\n.bg-pink-1 {\n  background: #fce4ec !important;\n}\n.bg-pink-2 {\n  background: #f8bbd0 !important;\n}\n.bg-pink-3 {\n  background: #f48fb1 !important;\n}\n.bg-pink-4 {\n  background: #f06292 !important;\n}\n.bg-pink-5 {\n  background: #ec407a !important;\n}\n.bg-pink-6 {\n  background: #e91e63 !important;\n}\n.bg-pink-7 {\n  background: #d81b60 !important;\n}\n.bg-pink-8 {\n  background: #c2185b !important;\n}\n.bg-pink-9 {\n  background: #ad1457 !important;\n}\n.bg-pink-10 {\n  background: #880e4f !important;\n}\n.bg-pink-11 {\n  background: #ff80ab !important;\n}\n.bg-pink-12 {\n  background: #ff4081 !important;\n}\n.bg-pink-13 {\n  background: #f50057 !important;\n}\n.bg-pink-14 {\n  background: #c51162 !important;\n}\n.bg-purple {\n  background: #9c27b0 !important;\n}\n.bg-purple-1 {\n  background: #f3e5f5 !important;\n}\n.bg-purple-2 {\n  background: #e1bee7 !important;\n}\n.bg-purple-3 {\n  background: #ce93d8 !important;\n}\n.bg-purple-4 {\n  background: #ba68c8 !important;\n}\n.bg-purple-5 {\n  background: #ab47bc !important;\n}\n.bg-purple-6 {\n  background: #9c27b0 !important;\n}\n.bg-purple-7 {\n  background: #8e24aa !important;\n}\n.bg-purple-8 {\n  background: #7b1fa2 !important;\n}\n.bg-purple-9 {\n  background: #6a1b9a !important;\n}\n.bg-purple-10 {\n  background: #4a148c !important;\n}\n.bg-purple-11 {\n  background: #ea80fc !important;\n}\n.bg-purple-12 {\n  background: #e040fb !important;\n}\n.bg-purple-13 {\n  background: #d500f9 !important;\n}\n.bg-purple-14 {\n  background: #aa00ff !important;\n}\n.bg-deep-purple {\n  background: #673ab7 !important;\n}\n.bg-deep-purple-1 {\n  background: #ede7f6 !important;\n}\n.bg-deep-purple-2 {\n  background: #d1c4e9 !important;\n}\n.bg-deep-purple-3 {\n  background: #b39ddb !important;\n}\n.bg-deep-purple-4 {\n  background: #9575cd !important;\n}\n.bg-deep-purple-5 {\n  background: #7e57c2 !important;\n}\n.bg-deep-purple-6 {\n  background: #673ab7 !important;\n}\n.bg-deep-purple-7 {\n  background: #5e35b1 !important;\n}\n.bg-deep-purple-8 {\n  background: #512da8 !important;\n}\n.bg-deep-purple-9 {\n  background: #4527a0 !important;\n}\n.bg-deep-purple-10 {\n  background: #311b92 !important;\n}\n.bg-deep-purple-11 {\n  background: #b388ff !important;\n}\n.bg-deep-purple-12 {\n  background: #7c4dff !important;\n}\n.bg-deep-purple-13 {\n  background: #651fff !important;\n}\n.bg-deep-purple-14 {\n  background: #6200ea !important;\n}\n.bg-indigo {\n  background: #3f51b5 !important;\n}\n.bg-indigo-1 {\n  background: #e8eaf6 !important;\n}\n.bg-indigo-2 {\n  background: #c5cae9 !important;\n}\n.bg-indigo-3 {\n  background: #9fa8da !important;\n}\n.bg-indigo-4 {\n  background: #7986cb !important;\n}\n.bg-indigo-5 {\n  background: #5c6bc0 !important;\n}\n.bg-indigo-6 {\n  background: #3f51b5 !important;\n}\n.bg-indigo-7 {\n  background: #3949ab !important;\n}\n.bg-indigo-8 {\n  background: #303f9f !important;\n}\n.bg-indigo-9 {\n  background: #283593 !important;\n}\n.bg-indigo-10 {\n  background: #1a237e !important;\n}\n.bg-indigo-11 {\n  background: #8c9eff !important;\n}\n.bg-indigo-12 {\n  background: #536dfe !important;\n}\n.bg-indigo-13 {\n  background: #3d5afe !important;\n}\n.bg-indigo-14 {\n  background: #304ffe !important;\n}\n.bg-blue {\n  background: #2196f3 !important;\n}\n.bg-blue-1 {\n  background: #e3f2fd !important;\n}\n.bg-blue-2 {\n  background: #bbdefb !important;\n}\n.bg-blue-3 {\n  background: #90caf9 !important;\n}\n.bg-blue-4 {\n  background: #64b5f6 !important;\n}\n.bg-blue-5 {\n  background: #42a5f5 !important;\n}\n.bg-blue-6 {\n  background: #2196f3 !important;\n}\n.bg-blue-7 {\n  background: #1e88e5 !important;\n}\n.bg-blue-8 {\n  background: #1976d2 !important;\n}\n.bg-blue-9 {\n  background: #1565c0 !important;\n}\n.bg-blue-10 {\n  background: #0d47a1 !important;\n}\n.bg-blue-11 {\n  background: #82b1ff !important;\n}\n.bg-blue-12 {\n  background: #448aff !important;\n}\n.bg-blue-13 {\n  background: #2979ff !important;\n}\n.bg-blue-14 {\n  background: #2962ff !important;\n}\n.bg-light-blue {\n  background: #03a9f4 !important;\n}\n.bg-light-blue-1 {\n  background: #e1f5fe !important;\n}\n.bg-light-blue-2 {\n  background: #b3e5fc !important;\n}\n.bg-light-blue-3 {\n  background: #81d4fa !important;\n}\n.bg-light-blue-4 {\n  background: #4fc3f7 !important;\n}\n.bg-light-blue-5 {\n  background: #29b6f6 !important;\n}\n.bg-light-blue-6 {\n  background: #03a9f4 !important;\n}\n.bg-light-blue-7 {\n  background: #039be5 !important;\n}\n.bg-light-blue-8 {\n  background: #0288d1 !important;\n}\n.bg-light-blue-9 {\n  background: #0277bd !important;\n}\n.bg-light-blue-10 {\n  background: #01579b !important;\n}\n.bg-light-blue-11 {\n  background: #80d8ff !important;\n}\n.bg-light-blue-12 {\n  background: #40c4ff !important;\n}\n.bg-light-blue-13 {\n  background: #00b0ff !important;\n}\n.bg-light-blue-14 {\n  background: #0091ea !important;\n}\n.bg-cyan {\n  background: #00bcd4 !important;\n}\n.bg-cyan-1 {\n  background: #e0f7fa !important;\n}\n.bg-cyan-2 {\n  background: #b2ebf2 !important;\n}\n.bg-cyan-3 {\n  background: #80deea !important;\n}\n.bg-cyan-4 {\n  background: #4dd0e1 !important;\n}\n.bg-cyan-5 {\n  background: #26c6da !important;\n}\n.bg-cyan-6 {\n  background: #00bcd4 !important;\n}\n.bg-cyan-7 {\n  background: #00acc1 !important;\n}\n.bg-cyan-8 {\n  background: #0097a7 !important;\n}\n.bg-cyan-9 {\n  background: #00838f !important;\n}\n.bg-cyan-10 {\n  background: #006064 !important;\n}\n.bg-cyan-11 {\n  background: #84ffff !important;\n}\n.bg-cyan-12 {\n  background: #18ffff !important;\n}\n.bg-cyan-13 {\n  background: #00e5ff !important;\n}\n.bg-cyan-14 {\n  background: #00b8d4 !important;\n}\n.bg-teal {\n  background: #009688 !important;\n}\n.bg-teal-1 {\n  background: #e0f2f1 !important;\n}\n.bg-teal-2 {\n  background: #b2dfdb !important;\n}\n.bg-teal-3 {\n  background: #80cbc4 !important;\n}\n.bg-teal-4 {\n  background: #4db6ac !important;\n}\n.bg-teal-5 {\n  background: #26a69a !important;\n}\n.bg-teal-6 {\n  background: #009688 !important;\n}\n.bg-teal-7 {\n  background: #00897b !important;\n}\n.bg-teal-8 {\n  background: #00796b !important;\n}\n.bg-teal-9 {\n  background: #00695c !important;\n}\n.bg-teal-10 {\n  background: #004d40 !important;\n}\n.bg-teal-11 {\n  background: #a7ffeb !important;\n}\n.bg-teal-12 {\n  background: #64ffda !important;\n}\n.bg-teal-13 {\n  background: #1de9b6 !important;\n}\n.bg-teal-14 {\n  background: #00bfa5 !important;\n}\n.bg-green {\n  background: #4caf50 !important;\n}\n.bg-green-1 {\n  background: #e8f5e9 !important;\n}\n.bg-green-2 {\n  background: #c8e6c9 !important;\n}\n.bg-green-3 {\n  background: #a5d6a7 !important;\n}\n.bg-green-4 {\n  background: #81c784 !important;\n}\n.bg-green-5 {\n  background: #66bb6a !important;\n}\n.bg-green-6 {\n  background: #4caf50 !important;\n}\n.bg-green-7 {\n  background: #43a047 !important;\n}\n.bg-green-8 {\n  background: #388e3c !important;\n}\n.bg-green-9 {\n  background: #2e7d32 !important;\n}\n.bg-green-10 {\n  background: #1b5e20 !important;\n}\n.bg-green-11 {\n  background: #b9f6ca !important;\n}\n.bg-green-12 {\n  background: #69f0ae !important;\n}\n.bg-green-13 {\n  background: #00e676 !important;\n}\n.bg-green-14 {\n  background: #00c853 !important;\n}\n.bg-light-green {\n  background: #8bc34a !important;\n}\n.bg-light-green-1 {\n  background: #f1f8e9 !important;\n}\n.bg-light-green-2 {\n  background: #dcedc8 !important;\n}\n.bg-light-green-3 {\n  background: #c5e1a5 !important;\n}\n.bg-light-green-4 {\n  background: #aed581 !important;\n}\n.bg-light-green-5 {\n  background: #9ccc65 !important;\n}\n.bg-light-green-6 {\n  background: #8bc34a !important;\n}\n.bg-light-green-7 {\n  background: #7cb342 !important;\n}\n.bg-light-green-8 {\n  background: #689f38 !important;\n}\n.bg-light-green-9 {\n  background: #558b2f !important;\n}\n.bg-light-green-10 {\n  background: #33691e !important;\n}\n.bg-light-green-11 {\n  background: #ccff90 !important;\n}\n.bg-light-green-12 {\n  background: #b2ff59 !important;\n}\n.bg-light-green-13 {\n  background: #76ff03 !important;\n}\n.bg-light-green-14 {\n  background: #64dd17 !important;\n}\n.bg-lime {\n  background: #cddc39 !important;\n}\n.bg-lime-1 {\n  background: #f9fbe7 !important;\n}\n.bg-lime-2 {\n  background: #f0f4c3 !important;\n}\n.bg-lime-3 {\n  background: #e6ee9c !important;\n}\n.bg-lime-4 {\n  background: #dce775 !important;\n}\n.bg-lime-5 {\n  background: #d4e157 !important;\n}\n.bg-lime-6 {\n  background: #cddc39 !important;\n}\n.bg-lime-7 {\n  background: #c0ca33 !important;\n}\n.bg-lime-8 {\n  background: #afb42b !important;\n}\n.bg-lime-9 {\n  background: #9e9d24 !important;\n}\n.bg-lime-10 {\n  background: #827717 !important;\n}\n.bg-lime-11 {\n  background: #f4ff81 !important;\n}\n.bg-lime-12 {\n  background: #eeff41 !important;\n}\n.bg-lime-13 {\n  background: #c6ff00 !important;\n}\n.bg-lime-14 {\n  background: #aeea00 !important;\n}\n.bg-yellow {\n  background: #ffeb3b !important;\n}\n.bg-yellow-1 {\n  background: #fffde7 !important;\n}\n.bg-yellow-2 {\n  background: #fff9c4 !important;\n}\n.bg-yellow-3 {\n  background: #fff59d !important;\n}\n.bg-yellow-4 {\n  background: #fff176 !important;\n}\n.bg-yellow-5 {\n  background: #ffee58 !important;\n}\n.bg-yellow-6 {\n  background: #ffeb3b !important;\n}\n.bg-yellow-7 {\n  background: #fdd835 !important;\n}\n.bg-yellow-8 {\n  background: #fbc02d !important;\n}\n.bg-yellow-9 {\n  background: #f9a825 !important;\n}\n.bg-yellow-10 {\n  background: #f57f17 !important;\n}\n.bg-yellow-11 {\n  background: #ffff8d !important;\n}\n.bg-yellow-12 {\n  background: #ffff00 !important;\n}\n.bg-yellow-13 {\n  background: #ffea00 !important;\n}\n.bg-yellow-14 {\n  background: #ffd600 !important;\n}\n.bg-amber {\n  background: #ffc107 !important;\n}\n.bg-amber-1 {\n  background: #fff8e1 !important;\n}\n.bg-amber-2 {\n  background: #ffecb3 !important;\n}\n.bg-amber-3 {\n  background: #ffe082 !important;\n}\n.bg-amber-4 {\n  background: #ffd54f !important;\n}\n.bg-amber-5 {\n  background: #ffca28 !important;\n}\n.bg-amber-6 {\n  background: #ffc107 !important;\n}\n.bg-amber-7 {\n  background: #ffb300 !important;\n}\n.bg-amber-8 {\n  background: #ffa000 !important;\n}\n.bg-amber-9 {\n  background: #ff8f00 !important;\n}\n.bg-amber-10 {\n  background: #ff6f00 !important;\n}\n.bg-amber-11 {\n  background: #ffe57f !important;\n}\n.bg-amber-12 {\n  background: #ffd740 !important;\n}\n.bg-amber-13 {\n  background: #ffc400 !important;\n}\n.bg-amber-14 {\n  background: #ffab00 !important;\n}\n.bg-orange {\n  background: #ff9800 !important;\n}\n.bg-orange-1 {\n  background: #fff3e0 !important;\n}\n.bg-orange-2 {\n  background: #ffe0b2 !important;\n}\n.bg-orange-3 {\n  background: #ffcc80 !important;\n}\n.bg-orange-4 {\n  background: #ffb74d !important;\n}\n.bg-orange-5 {\n  background: #ffa726 !important;\n}\n.bg-orange-6 {\n  background: #ff9800 !important;\n}\n.bg-orange-7 {\n  background: #fb8c00 !important;\n}\n.bg-orange-8 {\n  background: #f57c00 !important;\n}\n.bg-orange-9 {\n  background: #ef6c00 !important;\n}\n.bg-orange-10 {\n  background: #e65100 !important;\n}\n.bg-orange-11 {\n  background: #ffd180 !important;\n}\n.bg-orange-12 {\n  background: #ffab40 !important;\n}\n.bg-orange-13 {\n  background: #ff9100 !important;\n}\n.bg-orange-14 {\n  background: #ff6d00 !important;\n}\n.bg-deep-orange {\n  background: #ff5722 !important;\n}\n.bg-deep-orange-1 {\n  background: #fbe9e7 !important;\n}\n.bg-deep-orange-2 {\n  background: #ffccbc !important;\n}\n.bg-deep-orange-3 {\n  background: #ffab91 !important;\n}\n.bg-deep-orange-4 {\n  background: #ff8a65 !important;\n}\n.bg-deep-orange-5 {\n  background: #ff7043 !important;\n}\n.bg-deep-orange-6 {\n  background: #ff5722 !important;\n}\n.bg-deep-orange-7 {\n  background: #f4511e !important;\n}\n.bg-deep-orange-8 {\n  background: #e64a19 !important;\n}\n.bg-deep-orange-9 {\n  background: #d84315 !important;\n}\n.bg-deep-orange-10 {\n  background: #bf360c !important;\n}\n.bg-deep-orange-11 {\n  background: #ff9e80 !important;\n}\n.bg-deep-orange-12 {\n  background: #ff6e40 !important;\n}\n.bg-deep-orange-13 {\n  background: #ff3d00 !important;\n}\n.bg-deep-orange-14 {\n  background: #dd2c00 !important;\n}\n.bg-brown {\n  background: #795548 !important;\n}\n.bg-brown-1 {\n  background: #efebe9 !important;\n}\n.bg-brown-2 {\n  background: #d7ccc8 !important;\n}\n.bg-brown-3 {\n  background: #bcaaa4 !important;\n}\n.bg-brown-4 {\n  background: #a1887f !important;\n}\n.bg-brown-5 {\n  background: #8d6e63 !important;\n}\n.bg-brown-6 {\n  background: #795548 !important;\n}\n.bg-brown-7 {\n  background: #6d4c41 !important;\n}\n.bg-brown-8 {\n  background: #5d4037 !important;\n}\n.bg-brown-9 {\n  background: #4e342e !important;\n}\n.bg-brown-10 {\n  background: #3e2723 !important;\n}\n.bg-brown-11 {\n  background: #d7ccc8 !important;\n}\n.bg-brown-12 {\n  background: #bcaaa4 !important;\n}\n.bg-brown-13 {\n  background: #8d6e63 !important;\n}\n.bg-brown-14 {\n  background: #5d4037 !important;\n}\n.bg-grey {\n  background: #9e9e9e !important;\n}\n.bg-grey-1 {\n  background: #fafafa !important;\n}\n.bg-grey-2 {\n  background: #f5f5f5 !important;\n}\n.bg-grey-3 {\n  background: #eeeeee !important;\n}\n.bg-grey-4 {\n  background: #e0e0e0 !important;\n}\n.bg-grey-5 {\n  background: #bdbdbd !important;\n}\n.bg-grey-6 {\n  background: #9e9e9e !important;\n}\n.bg-grey-7 {\n  background: #757575 !important;\n}\n.bg-grey-8 {\n  background: #616161 !important;\n}\n.bg-grey-9 {\n  background: #424242 !important;\n}\n.bg-grey-10 {\n  background: #212121 !important;\n}\n.bg-grey-11 {\n  background: #f5f5f5 !important;\n}\n.bg-grey-12 {\n  background: #eeeeee !important;\n}\n.bg-grey-13 {\n  background: #bdbdbd !important;\n}\n.bg-grey-14 {\n  background: #616161 !important;\n}\n.bg-blue-grey {\n  background: #607d8b !important;\n}\n.bg-blue-grey-1 {\n  background: #eceff1 !important;\n}\n.bg-blue-grey-2 {\n  background: #cfd8dc !important;\n}\n.bg-blue-grey-3 {\n  background: #b0bec5 !important;\n}\n.bg-blue-grey-4 {\n  background: #90a4ae !important;\n}\n.bg-blue-grey-5 {\n  background: #78909c !important;\n}\n.bg-blue-grey-6 {\n  background: #607d8b !important;\n}\n.bg-blue-grey-7 {\n  background: #546e7a !important;\n}\n.bg-blue-grey-8 {\n  background: #455a64 !important;\n}\n.bg-blue-grey-9 {\n  background: #37474f !important;\n}\n.bg-blue-grey-10 {\n  background: #263238 !important;\n}\n.bg-blue-grey-11 {\n  background: #cfd8dc !important;\n}\n.bg-blue-grey-12 {\n  background: #b0bec5 !important;\n}\n.bg-blue-grey-13 {\n  background: #78909c !important;\n}\n.bg-blue-grey-14 {\n  background: #455a64 !important;\n}\n.shadow-transition {\n  transition: box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1) !important;\n}\n.shadow-1 {\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2), 0 1px 1px rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12);\n}\n.shadow-up-1 {\n  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.2), 0 -1px 1px rgba(0, 0, 0, 0.14), 0 -2px 1px -1px rgba(0, 0, 0, 0.12);\n}\n.shadow-2 {\n  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12);\n}\n.shadow-up-2 {\n  box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.2), 0 -2px 2px rgba(0, 0, 0, 0.14), 0 -3px 1px -2px rgba(0, 0, 0, 0.12);\n}\n.shadow-3 {\n  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.2), 0 3px 4px rgba(0, 0, 0, 0.14), 0 3px 3px -2px rgba(0, 0, 0, 0.12);\n}\n.shadow-up-3 {\n  box-shadow: 0 -1px 8px rgba(0, 0, 0, 0.2), 0 -3px 4px rgba(0, 0, 0, 0.14), 0 -3px 3px -2px rgba(0, 0, 0, 0.12);\n}\n.shadow-4 {\n  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px rgba(0, 0, 0, 0.14), 0 1px 10px rgba(0, 0, 0, 0.12);\n}\n.shadow-up-4 {\n  box-shadow: 0 -2px 4px -1px rgba(0, 0, 0, 0.2), 0 -4px 5px rgba(0, 0, 0, 0.14), 0 -1px 10px rgba(0, 0, 0, 0.12);\n}\n.shadow-5 {\n  box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2), 0 5px 8px rgba(0, 0, 0, 0.14), 0 1px 14px rgba(0, 0, 0, 0.12);\n}\n.shadow-up-5 {\n  box-shadow: 0 -3px 5px -1px rgba(0, 0, 0, 0.2), 0 -5px 8px rgba(0, 0, 0, 0.14), 0 -1px 14px rgba(0, 0, 0, 0.12);\n}\n.shadow-6 {\n  box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2), 0 6px 10px rgba(0, 0, 0, 0.14), 0 1px 18px rgba(0, 0, 0, 0.12);\n}\n.shadow-up-6 {\n  box-shadow: 0 -3px 5px -1px rgba(0, 0, 0, 0.2), 0 -6px 10px rgba(0, 0, 0, 0.14), 0 -1px 18px rgba(0, 0, 0, 0.12);\n}\n.shadow-7 {\n  box-shadow: 0 4px 5px -2px rgba(0, 0, 0, 0.2), 0 7px 10px 1px rgba(0, 0, 0, 0.14), 0 2px 16px 1px rgba(0, 0, 0, 0.12);\n}\n.shadow-up-7 {\n  box-shadow: 0 -4px 5px -2px rgba(0, 0, 0, 0.2), 0 -7px 10px 1px rgba(0, 0, 0, 0.14), 0 -2px 16px 1px rgba(0, 0, 0, 0.12);\n}\n.shadow-8 {\n  box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);\n}\n.shadow-up-8 {\n  box-shadow: 0 -5px 5px -3px rgba(0, 0, 0, 0.2), 0 -8px 10px 1px rgba(0, 0, 0, 0.14), 0 -3px 14px 2px rgba(0, 0, 0, 0.12);\n}\n.shadow-9 {\n  box-shadow: 0 5px 6px -3px rgba(0, 0, 0, 0.2), 0 9px 12px 1px rgba(0, 0, 0, 0.14), 0 3px 16px 2px rgba(0, 0, 0, 0.12);\n}\n.shadow-up-9 {\n  box-shadow: 0 -5px 6px -3px rgba(0, 0, 0, 0.2), 0 -9px 12px 1px rgba(0, 0, 0, 0.14), 0 -3px 16px 2px rgba(0, 0, 0, 0.12);\n}\n.shadow-10 {\n  box-shadow: 0 6px 6px -3px rgba(0, 0, 0, 0.2), 0 10px 14px 1px rgba(0, 0, 0, 0.14), 0 4px 18px 3px rgba(0, 0, 0, 0.12);\n}\n.shadow-up-10 {\n  box-shadow: 0 -6px 6px -3px rgba(0, 0, 0, 0.2), 0 -10px 14px 1px rgba(0, 0, 0, 0.14), 0 -4px 18px 3px rgba(0, 0, 0, 0.12);\n}\n.shadow-11 {\n  box-shadow: 0 6px 7px -4px rgba(0, 0, 0, 0.2), 0 11px 15px 1px rgba(0, 0, 0, 0.14), 0 4px 20px 3px rgba(0, 0, 0, 0.12);\n}\n.shadow-up-11 {\n  box-shadow: 0 -6px 7px -4px rgba(0, 0, 0, 0.2), 0 -11px 15px 1px rgba(0, 0, 0, 0.14), 0 -4px 20px 3px rgba(0, 0, 0, 0.12);\n}\n.shadow-12 {\n  box-shadow: 0 7px 8px -4px rgba(0, 0, 0, 0.2), 0 12px 17px 2px rgba(0, 0, 0, 0.14), 0 5px 22px 4px rgba(0, 0, 0, 0.12);\n}\n.shadow-up-12 {\n  box-shadow: 0 -7px 8px -4px rgba(0, 0, 0, 0.2), 0 -12px 17px 2px rgba(0, 0, 0, 0.14), 0 -5px 22px 4px rgba(0, 0, 0, 0.12);\n}\n.shadow-13 {\n  box-shadow: 0 7px 8px -4px rgba(0, 0, 0, 0.2), 0 13px 19px 2px rgba(0, 0, 0, 0.14), 0 5px 24px 4px rgba(0, 0, 0, 0.12);\n}\n.shadow-up-13 {\n  box-shadow: 0 -7px 8px -4px rgba(0, 0, 0, 0.2), 0 -13px 19px 2px rgba(0, 0, 0, 0.14), 0 -5px 24px 4px rgba(0, 0, 0, 0.12);\n}\n.shadow-14 {\n  box-shadow: 0 7px 9px -4px rgba(0, 0, 0, 0.2), 0 14px 21px 2px rgba(0, 0, 0, 0.14), 0 5px 26px 4px rgba(0, 0, 0, 0.12);\n}\n.shadow-up-14 {\n  box-shadow: 0 -7px 9px -4px rgba(0, 0, 0, 0.2), 0 -14px 21px 2px rgba(0, 0, 0, 0.14), 0 -5px 26px 4px rgba(0, 0, 0, 0.12);\n}\n.shadow-15 {\n  box-shadow: 0 8px 9px -5px rgba(0, 0, 0, 0.2), 0 15px 22px 2px rgba(0, 0, 0, 0.14), 0 6px 28px 5px rgba(0, 0, 0, 0.12);\n}\n.shadow-up-15 {\n  box-shadow: 0 -8px 9px -5px rgba(0, 0, 0, 0.2), 0 -15px 22px 2px rgba(0, 0, 0, 0.14), 0 -6px 28px 5px rgba(0, 0, 0, 0.12);\n}\n.shadow-16 {\n  box-shadow: 0 8px 10px -5px rgba(0, 0, 0, 0.2), 0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12);\n}\n.shadow-up-16 {\n  box-shadow: 0 -8px 10px -5px rgba(0, 0, 0, 0.2), 0 -16px 24px 2px rgba(0, 0, 0, 0.14), 0 -6px 30px 5px rgba(0, 0, 0, 0.12);\n}\n.shadow-17 {\n  box-shadow: 0 8px 11px -5px rgba(0, 0, 0, 0.2), 0 17px 26px 2px rgba(0, 0, 0, 0.14), 0 6px 32px 5px rgba(0, 0, 0, 0.12);\n}\n.shadow-up-17 {\n  box-shadow: 0 -8px 11px -5px rgba(0, 0, 0, 0.2), 0 -17px 26px 2px rgba(0, 0, 0, 0.14), 0 -6px 32px 5px rgba(0, 0, 0, 0.12);\n}\n.shadow-18 {\n  box-shadow: 0 9px 11px -5px rgba(0, 0, 0, 0.2), 0 18px 28px 2px rgba(0, 0, 0, 0.14), 0 7px 34px 6px rgba(0, 0, 0, 0.12);\n}\n.shadow-up-18 {\n  box-shadow: 0 -9px 11px -5px rgba(0, 0, 0, 0.2), 0 -18px 28px 2px rgba(0, 0, 0, 0.14), 0 -7px 34px 6px rgba(0, 0, 0, 0.12);\n}\n.shadow-19 {\n  box-shadow: 0 9px 12px -6px rgba(0, 0, 0, 0.2), 0 19px 29px 2px rgba(0, 0, 0, 0.14), 0 7px 36px 6px rgba(0, 0, 0, 0.12);\n}\n.shadow-up-19 {\n  box-shadow: 0 -9px 12px -6px rgba(0, 0, 0, 0.2), 0 -19px 29px 2px rgba(0, 0, 0, 0.14), 0 -7px 36px 6px rgba(0, 0, 0, 0.12);\n}\n.shadow-20 {\n  box-shadow: 0 10px 13px -6px rgba(0, 0, 0, 0.2), 0 20px 31px 3px rgba(0, 0, 0, 0.14), 0 8px 38px 7px rgba(0, 0, 0, 0.12);\n}\n.shadow-up-20 {\n  box-shadow: 0 -10px 13px -6px rgba(0, 0, 0, 0.2), 0 -20px 31px 3px rgba(0, 0, 0, 0.14), 0 -8px 38px 7px rgba(0, 0, 0, 0.12);\n}\n.shadow-21 {\n  box-shadow: 0 10px 13px -6px rgba(0, 0, 0, 0.2), 0 21px 33px 3px rgba(0, 0, 0, 0.14), 0 8px 40px 7px rgba(0, 0, 0, 0.12);\n}\n.shadow-up-21 {\n  box-shadow: 0 -10px 13px -6px rgba(0, 0, 0, 0.2), 0 -21px 33px 3px rgba(0, 0, 0, 0.14), 0 -8px 40px 7px rgba(0, 0, 0, 0.12);\n}\n.shadow-22 {\n  box-shadow: 0 10px 14px -6px rgba(0, 0, 0, 0.2), 0 22px 35px 3px rgba(0, 0, 0, 0.14), 0 8px 42px 7px rgba(0, 0, 0, 0.12);\n}\n.shadow-up-22 {\n  box-shadow: 0 -10px 14px -6px rgba(0, 0, 0, 0.2), 0 -22px 35px 3px rgba(0, 0, 0, 0.14), 0 -8px 42px 7px rgba(0, 0, 0, 0.12);\n}\n.shadow-23 {\n  box-shadow: 0 11px 14px -7px rgba(0, 0, 0, 0.2), 0 23px 36px 3px rgba(0, 0, 0, 0.14), 0 9px 44px 8px rgba(0, 0, 0, 0.12);\n}\n.shadow-up-23 {\n  box-shadow: 0 -11px 14px -7px rgba(0, 0, 0, 0.2), 0 -23px 36px 3px rgba(0, 0, 0, 0.14), 0 -9px 44px 8px rgba(0, 0, 0, 0.12);\n}\n.shadow-24 {\n  box-shadow: 0 11px 15px -7px rgba(0, 0, 0, 0.2), 0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12);\n}\n.shadow-up-24 {\n  box-shadow: 0 -11px 15px -7px rgba(0, 0, 0, 0.2), 0 -24px 38px 3px rgba(0, 0, 0, 0.14), 0 -9px 46px 8px rgba(0, 0, 0, 0.12);\n}\n.no-shadow, .shadow-0 {\n  box-shadow: none !important;\n}\n.inset-shadow {\n  box-shadow: 0 7px 9px -7px rgba(0, 0, 0, 0.7) inset !important;\n}\n.inset-shadow-down {\n  box-shadow: 0 -7px 9px -7px rgba(0, 0, 0, 0.7) inset !important;\n}\n.z-marginals {\n  z-index: 2000;\n}\n.z-notify {\n  z-index: 9500;\n}\n.z-fullscreen {\n  z-index: 6000;\n}\n.z-inherit {\n  z-index: inherit !important;\n}\n.row, .column, .flex {\n  display: flex;\n  flex-wrap: wrap;\n}\n.row.inline, .column.inline, .flex.inline {\n  display: inline-flex;\n}\n.row.reverse {\n  flex-direction: row-reverse;\n}\n.column {\n  flex-direction: column;\n}\n.column.reverse {\n  flex-direction: column-reverse;\n}\n.wrap {\n  flex-wrap: wrap;\n}\n.no-wrap {\n  flex-wrap: nowrap;\n}\n.reverse-wrap {\n  flex-wrap: wrap-reverse;\n}\n.order-first {\n  order: -10000;\n}\n.order-last {\n  order: 10000;\n}\n.order-none {\n  order: 0;\n}\n.justify-start {\n  justify-content: flex-start;\n}\n.justify-end {\n  justify-content: flex-end;\n}\n.justify-center, .flex-center {\n  justify-content: center;\n}\n.justify-between {\n  justify-content: space-between;\n}\n.justify-around {\n  justify-content: space-around;\n}\n.justify-evenly {\n  justify-content: space-evenly;\n}\n.items-start {\n  align-items: flex-start;\n}\n.items-end {\n  align-items: flex-end;\n}\n.items-center, .flex-center {\n  align-items: center;\n}\n.items-baseline {\n  align-items: baseline;\n}\n.items-stretch {\n  align-items: stretch;\n}\n.content-start {\n  align-content: flex-start;\n}\n.content-end {\n  align-content: flex-end;\n}\n.content-center {\n  align-content: center;\n}\n.content-stretch {\n  align-content: stretch;\n}\n.content-between {\n  align-content: space-between;\n}\n.content-around {\n  align-content: space-around;\n}\n.self-start {\n  align-self: flex-start;\n}\n.self-end {\n  align-self: flex-end;\n}\n.self-center {\n  align-self: center;\n}\n.self-baseline {\n  align-self: baseline;\n}\n.self-stretch {\n  align-self: stretch;\n}\n.q-gutter-x-none, .q-gutter-none {\n  margin-left: 0;\n}\n.q-gutter-x-none > *, .q-gutter-none > * {\n  margin-left: 0;\n}\n.q-gutter-y-none, .q-gutter-none {\n  margin-top: 0;\n}\n.q-gutter-y-none > *, .q-gutter-none > * {\n  margin-top: 0;\n}\n.q-col-gutter-x-none, .q-col-gutter-none {\n  margin-left: 0;\n}\n.q-col-gutter-x-none > *, .q-col-gutter-none > * {\n  padding-left: 0;\n}\n.q-col-gutter-y-none, .q-col-gutter-none {\n  margin-top: 0;\n}\n.q-col-gutter-y-none > *, .q-col-gutter-none > * {\n  padding-top: 0;\n}\n.q-gutter-x-xs, .q-gutter-xs {\n  margin-left: -4px;\n}\n.q-gutter-x-xs > *, .q-gutter-xs > * {\n  margin-left: 4px;\n}\n.q-gutter-y-xs, .q-gutter-xs {\n  margin-top: -4px;\n}\n.q-gutter-y-xs > *, .q-gutter-xs > * {\n  margin-top: 4px;\n}\n.q-col-gutter-x-xs, .q-col-gutter-xs {\n  margin-left: -4px;\n}\n.q-col-gutter-x-xs > *, .q-col-gutter-xs > * {\n  padding-left: 4px;\n}\n.q-col-gutter-y-xs, .q-col-gutter-xs {\n  margin-top: -4px;\n}\n.q-col-gutter-y-xs > *, .q-col-gutter-xs > * {\n  padding-top: 4px;\n}\n.q-gutter-x-sm, .q-gutter-sm {\n  margin-left: -8px;\n}\n.q-gutter-x-sm > *, .q-gutter-sm > * {\n  margin-left: 8px;\n}\n.q-gutter-y-sm, .q-gutter-sm {\n  margin-top: -8px;\n}\n.q-gutter-y-sm > *, .q-gutter-sm > * {\n  margin-top: 8px;\n}\n.q-col-gutter-x-sm, .q-col-gutter-sm {\n  margin-left: -8px;\n}\n.q-col-gutter-x-sm > *, .q-col-gutter-sm > * {\n  padding-left: 8px;\n}\n.q-col-gutter-y-sm, .q-col-gutter-sm {\n  margin-top: -8px;\n}\n.q-col-gutter-y-sm > *, .q-col-gutter-sm > * {\n  padding-top: 8px;\n}\n.q-gutter-x-md, .q-gutter-md {\n  margin-left: -16px;\n}\n.q-gutter-x-md > *, .q-gutter-md > * {\n  margin-left: 16px;\n}\n.q-gutter-y-md, .q-gutter-md {\n  margin-top: -16px;\n}\n.q-gutter-y-md > *, .q-gutter-md > * {\n  margin-top: 16px;\n}\n.q-col-gutter-x-md, .q-col-gutter-md {\n  margin-left: -16px;\n}\n.q-col-gutter-x-md > *, .q-col-gutter-md > * {\n  padding-left: 16px;\n}\n.q-col-gutter-y-md, .q-col-gutter-md {\n  margin-top: -16px;\n}\n.q-col-gutter-y-md > *, .q-col-gutter-md > * {\n  padding-top: 16px;\n}\n.q-gutter-x-lg, .q-gutter-lg {\n  margin-left: -24px;\n}\n.q-gutter-x-lg > *, .q-gutter-lg > * {\n  margin-left: 24px;\n}\n.q-gutter-y-lg, .q-gutter-lg {\n  margin-top: -24px;\n}\n.q-gutter-y-lg > *, .q-gutter-lg > * {\n  margin-top: 24px;\n}\n.q-col-gutter-x-lg, .q-col-gutter-lg {\n  margin-left: -24px;\n}\n.q-col-gutter-x-lg > *, .q-col-gutter-lg > * {\n  padding-left: 24px;\n}\n.q-col-gutter-y-lg, .q-col-gutter-lg {\n  margin-top: -24px;\n}\n.q-col-gutter-y-lg > *, .q-col-gutter-lg > * {\n  padding-top: 24px;\n}\n.q-gutter-x-xl, .q-gutter-xl {\n  margin-left: -48px;\n}\n.q-gutter-x-xl > *, .q-gutter-xl > * {\n  margin-left: 48px;\n}\n.q-gutter-y-xl, .q-gutter-xl {\n  margin-top: -48px;\n}\n.q-gutter-y-xl > *, .q-gutter-xl > * {\n  margin-top: 48px;\n}\n.q-col-gutter-x-xl, .q-col-gutter-xl {\n  margin-left: -48px;\n}\n.q-col-gutter-x-xl > *, .q-col-gutter-xl > * {\n  padding-left: 48px;\n}\n.q-col-gutter-y-xl, .q-col-gutter-xl {\n  margin-top: -48px;\n}\n.q-col-gutter-y-xl > *, .q-col-gutter-xl > * {\n  padding-top: 48px;\n}\n@media (min-width: 0) {\n  .row > .col, .flex > .col, .row > .col-auto, .flex > .col-auto, .row > .col-grow, .flex > .col-grow, .row > .col-shrink, .flex > .col-shrink, .row > .col-xs, .flex > .col-xs, .row > .col-xs-auto, .row > .col-12, .row > .col-xs-12, .row > .col-11, .row > .col-xs-11, .row > .col-10, .row > .col-xs-10, .row > .col-9, .row > .col-xs-9, .row > .col-8, .row > .col-xs-8, .row > .col-7, .row > .col-xs-7, .row > .col-6, .row > .col-xs-6, .row > .col-5, .row > .col-xs-5, .row > .col-4, .row > .col-xs-4, .row > .col-3, .row > .col-xs-3, .row > .col-2, .row > .col-xs-2, .row > .col-1, .row > .col-xs-1, .row > .col-0, .row > .col-xs-0, .flex > .col-xs-auto, .flex > .col-12, .flex > .col-xs-12, .flex > .col-11, .flex > .col-xs-11, .flex > .col-10, .flex > .col-xs-10, .flex > .col-9, .flex > .col-xs-9, .flex > .col-8, .flex > .col-xs-8, .flex > .col-7, .flex > .col-xs-7, .flex > .col-6, .flex > .col-xs-6, .flex > .col-5, .flex > .col-xs-5, .flex > .col-4, .flex > .col-xs-4, .flex > .col-3, .flex > .col-xs-3, .flex > .col-2, .flex > .col-xs-2, .flex > .col-1, .flex > .col-xs-1, .flex > .col-0, .flex > .col-xs-0, .row > .col-xs-grow, .flex > .col-xs-grow, .row > .col-xs-shrink, .flex > .col-xs-shrink {\n    width: auto;\n    min-width: 0;\n    max-width: 100%;\n  }\n  .column > .col, .flex > .col, .column > .col-auto, .flex > .col-auto, .column > .col-grow, .flex > .col-grow, .column > .col-shrink, .flex > .col-shrink, .column > .col-xs, .flex > .col-xs, .column > .col-xs-auto, .column > .col-12, .column > .col-xs-12, .column > .col-11, .column > .col-xs-11, .column > .col-10, .column > .col-xs-10, .column > .col-9, .column > .col-xs-9, .column > .col-8, .column > .col-xs-8, .column > .col-7, .column > .col-xs-7, .column > .col-6, .column > .col-xs-6, .column > .col-5, .column > .col-xs-5, .column > .col-4, .column > .col-xs-4, .column > .col-3, .column > .col-xs-3, .column > .col-2, .column > .col-xs-2, .column > .col-1, .column > .col-xs-1, .column > .col-0, .column > .col-xs-0, .flex > .col-xs-auto, .flex > .col-12, .flex > .col-xs-12, .flex > .col-11, .flex > .col-xs-11, .flex > .col-10, .flex > .col-xs-10, .flex > .col-9, .flex > .col-xs-9, .flex > .col-8, .flex > .col-xs-8, .flex > .col-7, .flex > .col-xs-7, .flex > .col-6, .flex > .col-xs-6, .flex > .col-5, .flex > .col-xs-5, .flex > .col-4, .flex > .col-xs-4, .flex > .col-3, .flex > .col-xs-3, .flex > .col-2, .flex > .col-xs-2, .flex > .col-1, .flex > .col-xs-1, .flex > .col-0, .flex > .col-xs-0, .column > .col-xs-grow, .flex > .col-xs-grow, .column > .col-xs-shrink, .flex > .col-xs-shrink {\n    height: auto;\n    min-height: 0;\n    max-height: 100%;\n  }\n  .col, .col-xs {\n    flex: 10000 1 0%;\n  }\n  .col-auto, .col-xs-auto, .col-12, .col-xs-12, .col-11, .col-xs-11, .col-10, .col-xs-10, .col-9, .col-xs-9, .col-8, .col-xs-8, .col-7, .col-xs-7, .col-6, .col-xs-6, .col-5, .col-xs-5, .col-4, .col-xs-4, .col-3, .col-xs-3, .col-2, .col-xs-2, .col-1, .col-xs-1, .col-0, .col-xs-0 {\n    flex: 0 0 auto;\n  }\n  .col-grow, .col-xs-grow {\n    flex: 1 0 auto;\n  }\n  .col-shrink, .col-xs-shrink {\n    flex: 0 1 auto;\n  }\n\n  .row > .col-0, .row > .col-xs-0 {\n    height: auto;\n    width: 0%;\n  }\n  .row > .offset-0, .row > .offset-xs-0 {\n    margin-left: 0%;\n  }\n\n  .column > .col-0, .column > .col-xs-0 {\n    height: 0%;\n    width: auto;\n  }\n\n  .row > .col-1, .row > .col-xs-1 {\n    height: auto;\n    width: 8.3333%;\n  }\n  .row > .offset-1, .row > .offset-xs-1 {\n    margin-left: 8.3333%;\n  }\n\n  .column > .col-1, .column > .col-xs-1 {\n    height: 8.3333%;\n    width: auto;\n  }\n\n  .row > .col-2, .row > .col-xs-2 {\n    height: auto;\n    width: 16.6667%;\n  }\n  .row > .offset-2, .row > .offset-xs-2 {\n    margin-left: 16.6667%;\n  }\n\n  .column > .col-2, .column > .col-xs-2 {\n    height: 16.6667%;\n    width: auto;\n  }\n\n  .row > .col-3, .row > .col-xs-3 {\n    height: auto;\n    width: 25%;\n  }\n  .row > .offset-3, .row > .offset-xs-3 {\n    margin-left: 25%;\n  }\n\n  .column > .col-3, .column > .col-xs-3 {\n    height: 25%;\n    width: auto;\n  }\n\n  .row > .col-4, .row > .col-xs-4 {\n    height: auto;\n    width: 33.3333%;\n  }\n  .row > .offset-4, .row > .offset-xs-4 {\n    margin-left: 33.3333%;\n  }\n\n  .column > .col-4, .column > .col-xs-4 {\n    height: 33.3333%;\n    width: auto;\n  }\n\n  .row > .col-5, .row > .col-xs-5 {\n    height: auto;\n    width: 41.6667%;\n  }\n  .row > .offset-5, .row > .offset-xs-5 {\n    margin-left: 41.6667%;\n  }\n\n  .column > .col-5, .column > .col-xs-5 {\n    height: 41.6667%;\n    width: auto;\n  }\n\n  .row > .col-6, .row > .col-xs-6 {\n    height: auto;\n    width: 50%;\n  }\n  .row > .offset-6, .row > .offset-xs-6 {\n    margin-left: 50%;\n  }\n\n  .column > .col-6, .column > .col-xs-6 {\n    height: 50%;\n    width: auto;\n  }\n\n  .row > .col-7, .row > .col-xs-7 {\n    height: auto;\n    width: 58.3333%;\n  }\n  .row > .offset-7, .row > .offset-xs-7 {\n    margin-left: 58.3333%;\n  }\n\n  .column > .col-7, .column > .col-xs-7 {\n    height: 58.3333%;\n    width: auto;\n  }\n\n  .row > .col-8, .row > .col-xs-8 {\n    height: auto;\n    width: 66.6667%;\n  }\n  .row > .offset-8, .row > .offset-xs-8 {\n    margin-left: 66.6667%;\n  }\n\n  .column > .col-8, .column > .col-xs-8 {\n    height: 66.6667%;\n    width: auto;\n  }\n\n  .row > .col-9, .row > .col-xs-9 {\n    height: auto;\n    width: 75%;\n  }\n  .row > .offset-9, .row > .offset-xs-9 {\n    margin-left: 75%;\n  }\n\n  .column > .col-9, .column > .col-xs-9 {\n    height: 75%;\n    width: auto;\n  }\n\n  .row > .col-10, .row > .col-xs-10 {\n    height: auto;\n    width: 83.3333%;\n  }\n  .row > .offset-10, .row > .offset-xs-10 {\n    margin-left: 83.3333%;\n  }\n\n  .column > .col-10, .column > .col-xs-10 {\n    height: 83.3333%;\n    width: auto;\n  }\n\n  .row > .col-11, .row > .col-xs-11 {\n    height: auto;\n    width: 91.6667%;\n  }\n  .row > .offset-11, .row > .offset-xs-11 {\n    margin-left: 91.6667%;\n  }\n\n  .column > .col-11, .column > .col-xs-11 {\n    height: 91.6667%;\n    width: auto;\n  }\n\n  .row > .col-12, .row > .col-xs-12 {\n    height: auto;\n    width: 100%;\n  }\n  .row > .offset-12, .row > .offset-xs-12 {\n    margin-left: 100%;\n  }\n\n  .column > .col-12, .column > .col-xs-12 {\n    height: 100%;\n    width: auto;\n  }\n\n  .row > .col-all {\n    height: auto;\n    flex: 0 0 100%;\n  }\n}\n@media (min-width: 600px) {\n  .row > .col-sm, .flex > .col-sm, .row > .col-sm-auto, .row > .col-sm-12, .row > .col-sm-11, .row > .col-sm-10, .row > .col-sm-9, .row > .col-sm-8, .row > .col-sm-7, .row > .col-sm-6, .row > .col-sm-5, .row > .col-sm-4, .row > .col-sm-3, .row > .col-sm-2, .row > .col-sm-1, .row > .col-sm-0, .flex > .col-sm-auto, .flex > .col-sm-12, .flex > .col-sm-11, .flex > .col-sm-10, .flex > .col-sm-9, .flex > .col-sm-8, .flex > .col-sm-7, .flex > .col-sm-6, .flex > .col-sm-5, .flex > .col-sm-4, .flex > .col-sm-3, .flex > .col-sm-2, .flex > .col-sm-1, .flex > .col-sm-0, .row > .col-sm-grow, .flex > .col-sm-grow, .row > .col-sm-shrink, .flex > .col-sm-shrink {\n    width: auto;\n    min-width: 0;\n    max-width: 100%;\n  }\n  .column > .col-sm, .flex > .col-sm, .column > .col-sm-auto, .column > .col-sm-12, .column > .col-sm-11, .column > .col-sm-10, .column > .col-sm-9, .column > .col-sm-8, .column > .col-sm-7, .column > .col-sm-6, .column > .col-sm-5, .column > .col-sm-4, .column > .col-sm-3, .column > .col-sm-2, .column > .col-sm-1, .column > .col-sm-0, .flex > .col-sm-auto, .flex > .col-sm-12, .flex > .col-sm-11, .flex > .col-sm-10, .flex > .col-sm-9, .flex > .col-sm-8, .flex > .col-sm-7, .flex > .col-sm-6, .flex > .col-sm-5, .flex > .col-sm-4, .flex > .col-sm-3, .flex > .col-sm-2, .flex > .col-sm-1, .flex > .col-sm-0, .column > .col-sm-grow, .flex > .col-sm-grow, .column > .col-sm-shrink, .flex > .col-sm-shrink {\n    height: auto;\n    min-height: 0;\n    max-height: 100%;\n  }\n  .col-sm {\n    flex: 10000 1 0%;\n  }\n  .col-sm-auto, .col-sm-12, .col-sm-11, .col-sm-10, .col-sm-9, .col-sm-8, .col-sm-7, .col-sm-6, .col-sm-5, .col-sm-4, .col-sm-3, .col-sm-2, .col-sm-1, .col-sm-0 {\n    flex: 0 0 auto;\n  }\n  .col-sm-grow {\n    flex: 1 0 auto;\n  }\n  .col-sm-shrink {\n    flex: 0 1 auto;\n  }\n\n  .row > .col-sm-0 {\n    height: auto;\n    width: 0%;\n  }\n  .row > .offset-sm-0 {\n    margin-left: 0%;\n  }\n\n  .column > .col-sm-0 {\n    height: 0%;\n    width: auto;\n  }\n\n  .row > .col-sm-1 {\n    height: auto;\n    width: 8.3333%;\n  }\n  .row > .offset-sm-1 {\n    margin-left: 8.3333%;\n  }\n\n  .column > .col-sm-1 {\n    height: 8.3333%;\n    width: auto;\n  }\n\n  .row > .col-sm-2 {\n    height: auto;\n    width: 16.6667%;\n  }\n  .row > .offset-sm-2 {\n    margin-left: 16.6667%;\n  }\n\n  .column > .col-sm-2 {\n    height: 16.6667%;\n    width: auto;\n  }\n\n  .row > .col-sm-3 {\n    height: auto;\n    width: 25%;\n  }\n  .row > .offset-sm-3 {\n    margin-left: 25%;\n  }\n\n  .column > .col-sm-3 {\n    height: 25%;\n    width: auto;\n  }\n\n  .row > .col-sm-4 {\n    height: auto;\n    width: 33.3333%;\n  }\n  .row > .offset-sm-4 {\n    margin-left: 33.3333%;\n  }\n\n  .column > .col-sm-4 {\n    height: 33.3333%;\n    width: auto;\n  }\n\n  .row > .col-sm-5 {\n    height: auto;\n    width: 41.6667%;\n  }\n  .row > .offset-sm-5 {\n    margin-left: 41.6667%;\n  }\n\n  .column > .col-sm-5 {\n    height: 41.6667%;\n    width: auto;\n  }\n\n  .row > .col-sm-6 {\n    height: auto;\n    width: 50%;\n  }\n  .row > .offset-sm-6 {\n    margin-left: 50%;\n  }\n\n  .column > .col-sm-6 {\n    height: 50%;\n    width: auto;\n  }\n\n  .row > .col-sm-7 {\n    height: auto;\n    width: 58.3333%;\n  }\n  .row > .offset-sm-7 {\n    margin-left: 58.3333%;\n  }\n\n  .column > .col-sm-7 {\n    height: 58.3333%;\n    width: auto;\n  }\n\n  .row > .col-sm-8 {\n    height: auto;\n    width: 66.6667%;\n  }\n  .row > .offset-sm-8 {\n    margin-left: 66.6667%;\n  }\n\n  .column > .col-sm-8 {\n    height: 66.6667%;\n    width: auto;\n  }\n\n  .row > .col-sm-9 {\n    height: auto;\n    width: 75%;\n  }\n  .row > .offset-sm-9 {\n    margin-left: 75%;\n  }\n\n  .column > .col-sm-9 {\n    height: 75%;\n    width: auto;\n  }\n\n  .row > .col-sm-10 {\n    height: auto;\n    width: 83.3333%;\n  }\n  .row > .offset-sm-10 {\n    margin-left: 83.3333%;\n  }\n\n  .column > .col-sm-10 {\n    height: 83.3333%;\n    width: auto;\n  }\n\n  .row > .col-sm-11 {\n    height: auto;\n    width: 91.6667%;\n  }\n  .row > .offset-sm-11 {\n    margin-left: 91.6667%;\n  }\n\n  .column > .col-sm-11 {\n    height: 91.6667%;\n    width: auto;\n  }\n\n  .row > .col-sm-12 {\n    height: auto;\n    width: 100%;\n  }\n  .row > .offset-sm-12 {\n    margin-left: 100%;\n  }\n\n  .column > .col-sm-12 {\n    height: 100%;\n    width: auto;\n  }\n}\n@media (min-width: 1024px) {\n  .row > .col-md, .flex > .col-md, .row > .col-md-auto, .row > .col-md-12, .row > .col-md-11, .row > .col-md-10, .row > .col-md-9, .row > .col-md-8, .row > .col-md-7, .row > .col-md-6, .row > .col-md-5, .row > .col-md-4, .row > .col-md-3, .row > .col-md-2, .row > .col-md-1, .row > .col-md-0, .flex > .col-md-auto, .flex > .col-md-12, .flex > .col-md-11, .flex > .col-md-10, .flex > .col-md-9, .flex > .col-md-8, .flex > .col-md-7, .flex > .col-md-6, .flex > .col-md-5, .flex > .col-md-4, .flex > .col-md-3, .flex > .col-md-2, .flex > .col-md-1, .flex > .col-md-0, .row > .col-md-grow, .flex > .col-md-grow, .row > .col-md-shrink, .flex > .col-md-shrink {\n    width: auto;\n    min-width: 0;\n    max-width: 100%;\n  }\n  .column > .col-md, .flex > .col-md, .column > .col-md-auto, .column > .col-md-12, .column > .col-md-11, .column > .col-md-10, .column > .col-md-9, .column > .col-md-8, .column > .col-md-7, .column > .col-md-6, .column > .col-md-5, .column > .col-md-4, .column > .col-md-3, .column > .col-md-2, .column > .col-md-1, .column > .col-md-0, .flex > .col-md-auto, .flex > .col-md-12, .flex > .col-md-11, .flex > .col-md-10, .flex > .col-md-9, .flex > .col-md-8, .flex > .col-md-7, .flex > .col-md-6, .flex > .col-md-5, .flex > .col-md-4, .flex > .col-md-3, .flex > .col-md-2, .flex > .col-md-1, .flex > .col-md-0, .column > .col-md-grow, .flex > .col-md-grow, .column > .col-md-shrink, .flex > .col-md-shrink {\n    height: auto;\n    min-height: 0;\n    max-height: 100%;\n  }\n  .col-md {\n    flex: 10000 1 0%;\n  }\n  .col-md-auto, .col-md-12, .col-md-11, .col-md-10, .col-md-9, .col-md-8, .col-md-7, .col-md-6, .col-md-5, .col-md-4, .col-md-3, .col-md-2, .col-md-1, .col-md-0 {\n    flex: 0 0 auto;\n  }\n  .col-md-grow {\n    flex: 1 0 auto;\n  }\n  .col-md-shrink {\n    flex: 0 1 auto;\n  }\n\n  .row > .col-md-0 {\n    height: auto;\n    width: 0%;\n  }\n  .row > .offset-md-0 {\n    margin-left: 0%;\n  }\n\n  .column > .col-md-0 {\n    height: 0%;\n    width: auto;\n  }\n\n  .row > .col-md-1 {\n    height: auto;\n    width: 8.3333%;\n  }\n  .row > .offset-md-1 {\n    margin-left: 8.3333%;\n  }\n\n  .column > .col-md-1 {\n    height: 8.3333%;\n    width: auto;\n  }\n\n  .row > .col-md-2 {\n    height: auto;\n    width: 16.6667%;\n  }\n  .row > .offset-md-2 {\n    margin-left: 16.6667%;\n  }\n\n  .column > .col-md-2 {\n    height: 16.6667%;\n    width: auto;\n  }\n\n  .row > .col-md-3 {\n    height: auto;\n    width: 25%;\n  }\n  .row > .offset-md-3 {\n    margin-left: 25%;\n  }\n\n  .column > .col-md-3 {\n    height: 25%;\n    width: auto;\n  }\n\n  .row > .col-md-4 {\n    height: auto;\n    width: 33.3333%;\n  }\n  .row > .offset-md-4 {\n    margin-left: 33.3333%;\n  }\n\n  .column > .col-md-4 {\n    height: 33.3333%;\n    width: auto;\n  }\n\n  .row > .col-md-5 {\n    height: auto;\n    width: 41.6667%;\n  }\n  .row > .offset-md-5 {\n    margin-left: 41.6667%;\n  }\n\n  .column > .col-md-5 {\n    height: 41.6667%;\n    width: auto;\n  }\n\n  .row > .col-md-6 {\n    height: auto;\n    width: 50%;\n  }\n  .row > .offset-md-6 {\n    margin-left: 50%;\n  }\n\n  .column > .col-md-6 {\n    height: 50%;\n    width: auto;\n  }\n\n  .row > .col-md-7 {\n    height: auto;\n    width: 58.3333%;\n  }\n  .row > .offset-md-7 {\n    margin-left: 58.3333%;\n  }\n\n  .column > .col-md-7 {\n    height: 58.3333%;\n    width: auto;\n  }\n\n  .row > .col-md-8 {\n    height: auto;\n    width: 66.6667%;\n  }\n  .row > .offset-md-8 {\n    margin-left: 66.6667%;\n  }\n\n  .column > .col-md-8 {\n    height: 66.6667%;\n    width: auto;\n  }\n\n  .row > .col-md-9 {\n    height: auto;\n    width: 75%;\n  }\n  .row > .offset-md-9 {\n    margin-left: 75%;\n  }\n\n  .column > .col-md-9 {\n    height: 75%;\n    width: auto;\n  }\n\n  .row > .col-md-10 {\n    height: auto;\n    width: 83.3333%;\n  }\n  .row > .offset-md-10 {\n    margin-left: 83.3333%;\n  }\n\n  .column > .col-md-10 {\n    height: 83.3333%;\n    width: auto;\n  }\n\n  .row > .col-md-11 {\n    height: auto;\n    width: 91.6667%;\n  }\n  .row > .offset-md-11 {\n    margin-left: 91.6667%;\n  }\n\n  .column > .col-md-11 {\n    height: 91.6667%;\n    width: auto;\n  }\n\n  .row > .col-md-12 {\n    height: auto;\n    width: 100%;\n  }\n  .row > .offset-md-12 {\n    margin-left: 100%;\n  }\n\n  .column > .col-md-12 {\n    height: 100%;\n    width: auto;\n  }\n}\n@media (min-width: 1440px) {\n  .row > .col-lg, .flex > .col-lg, .row > .col-lg-auto, .row > .col-lg-12, .row > .col-lg-11, .row > .col-lg-10, .row > .col-lg-9, .row > .col-lg-8, .row > .col-lg-7, .row > .col-lg-6, .row > .col-lg-5, .row > .col-lg-4, .row > .col-lg-3, .row > .col-lg-2, .row > .col-lg-1, .row > .col-lg-0, .flex > .col-lg-auto, .flex > .col-lg-12, .flex > .col-lg-11, .flex > .col-lg-10, .flex > .col-lg-9, .flex > .col-lg-8, .flex > .col-lg-7, .flex > .col-lg-6, .flex > .col-lg-5, .flex > .col-lg-4, .flex > .col-lg-3, .flex > .col-lg-2, .flex > .col-lg-1, .flex > .col-lg-0, .row > .col-lg-grow, .flex > .col-lg-grow, .row > .col-lg-shrink, .flex > .col-lg-shrink {\n    width: auto;\n    min-width: 0;\n    max-width: 100%;\n  }\n  .column > .col-lg, .flex > .col-lg, .column > .col-lg-auto, .column > .col-lg-12, .column > .col-lg-11, .column > .col-lg-10, .column > .col-lg-9, .column > .col-lg-8, .column > .col-lg-7, .column > .col-lg-6, .column > .col-lg-5, .column > .col-lg-4, .column > .col-lg-3, .column > .col-lg-2, .column > .col-lg-1, .column > .col-lg-0, .flex > .col-lg-auto, .flex > .col-lg-12, .flex > .col-lg-11, .flex > .col-lg-10, .flex > .col-lg-9, .flex > .col-lg-8, .flex > .col-lg-7, .flex > .col-lg-6, .flex > .col-lg-5, .flex > .col-lg-4, .flex > .col-lg-3, .flex > .col-lg-2, .flex > .col-lg-1, .flex > .col-lg-0, .column > .col-lg-grow, .flex > .col-lg-grow, .column > .col-lg-shrink, .flex > .col-lg-shrink {\n    height: auto;\n    min-height: 0;\n    max-height: 100%;\n  }\n  .col-lg {\n    flex: 10000 1 0%;\n  }\n  .col-lg-auto, .col-lg-12, .col-lg-11, .col-lg-10, .col-lg-9, .col-lg-8, .col-lg-7, .col-lg-6, .col-lg-5, .col-lg-4, .col-lg-3, .col-lg-2, .col-lg-1, .col-lg-0 {\n    flex: 0 0 auto;\n  }\n  .col-lg-grow {\n    flex: 1 0 auto;\n  }\n  .col-lg-shrink {\n    flex: 0 1 auto;\n  }\n\n  .row > .col-lg-0 {\n    height: auto;\n    width: 0%;\n  }\n  .row > .offset-lg-0 {\n    margin-left: 0%;\n  }\n\n  .column > .col-lg-0 {\n    height: 0%;\n    width: auto;\n  }\n\n  .row > .col-lg-1 {\n    height: auto;\n    width: 8.3333%;\n  }\n  .row > .offset-lg-1 {\n    margin-left: 8.3333%;\n  }\n\n  .column > .col-lg-1 {\n    height: 8.3333%;\n    width: auto;\n  }\n\n  .row > .col-lg-2 {\n    height: auto;\n    width: 16.6667%;\n  }\n  .row > .offset-lg-2 {\n    margin-left: 16.6667%;\n  }\n\n  .column > .col-lg-2 {\n    height: 16.6667%;\n    width: auto;\n  }\n\n  .row > .col-lg-3 {\n    height: auto;\n    width: 25%;\n  }\n  .row > .offset-lg-3 {\n    margin-left: 25%;\n  }\n\n  .column > .col-lg-3 {\n    height: 25%;\n    width: auto;\n  }\n\n  .row > .col-lg-4 {\n    height: auto;\n    width: 33.3333%;\n  }\n  .row > .offset-lg-4 {\n    margin-left: 33.3333%;\n  }\n\n  .column > .col-lg-4 {\n    height: 33.3333%;\n    width: auto;\n  }\n\n  .row > .col-lg-5 {\n    height: auto;\n    width: 41.6667%;\n  }\n  .row > .offset-lg-5 {\n    margin-left: 41.6667%;\n  }\n\n  .column > .col-lg-5 {\n    height: 41.6667%;\n    width: auto;\n  }\n\n  .row > .col-lg-6 {\n    height: auto;\n    width: 50%;\n  }\n  .row > .offset-lg-6 {\n    margin-left: 50%;\n  }\n\n  .column > .col-lg-6 {\n    height: 50%;\n    width: auto;\n  }\n\n  .row > .col-lg-7 {\n    height: auto;\n    width: 58.3333%;\n  }\n  .row > .offset-lg-7 {\n    margin-left: 58.3333%;\n  }\n\n  .column > .col-lg-7 {\n    height: 58.3333%;\n    width: auto;\n  }\n\n  .row > .col-lg-8 {\n    height: auto;\n    width: 66.6667%;\n  }\n  .row > .offset-lg-8 {\n    margin-left: 66.6667%;\n  }\n\n  .column > .col-lg-8 {\n    height: 66.6667%;\n    width: auto;\n  }\n\n  .row > .col-lg-9 {\n    height: auto;\n    width: 75%;\n  }\n  .row > .offset-lg-9 {\n    margin-left: 75%;\n  }\n\n  .column > .col-lg-9 {\n    height: 75%;\n    width: auto;\n  }\n\n  .row > .col-lg-10 {\n    height: auto;\n    width: 83.3333%;\n  }\n  .row > .offset-lg-10 {\n    margin-left: 83.3333%;\n  }\n\n  .column > .col-lg-10 {\n    height: 83.3333%;\n    width: auto;\n  }\n\n  .row > .col-lg-11 {\n    height: auto;\n    width: 91.6667%;\n  }\n  .row > .offset-lg-11 {\n    margin-left: 91.6667%;\n  }\n\n  .column > .col-lg-11 {\n    height: 91.6667%;\n    width: auto;\n  }\n\n  .row > .col-lg-12 {\n    height: auto;\n    width: 100%;\n  }\n  .row > .offset-lg-12 {\n    margin-left: 100%;\n  }\n\n  .column > .col-lg-12 {\n    height: 100%;\n    width: auto;\n  }\n}\n@media (min-width: 1920px) {\n  .row > .col-xl, .flex > .col-xl, .row > .col-xl-auto, .row > .col-xl-12, .row > .col-xl-11, .row > .col-xl-10, .row > .col-xl-9, .row > .col-xl-8, .row > .col-xl-7, .row > .col-xl-6, .row > .col-xl-5, .row > .col-xl-4, .row > .col-xl-3, .row > .col-xl-2, .row > .col-xl-1, .row > .col-xl-0, .flex > .col-xl-auto, .flex > .col-xl-12, .flex > .col-xl-11, .flex > .col-xl-10, .flex > .col-xl-9, .flex > .col-xl-8, .flex > .col-xl-7, .flex > .col-xl-6, .flex > .col-xl-5, .flex > .col-xl-4, .flex > .col-xl-3, .flex > .col-xl-2, .flex > .col-xl-1, .flex > .col-xl-0, .row > .col-xl-grow, .flex > .col-xl-grow, .row > .col-xl-shrink, .flex > .col-xl-shrink {\n    width: auto;\n    min-width: 0;\n    max-width: 100%;\n  }\n  .column > .col-xl, .flex > .col-xl, .column > .col-xl-auto, .column > .col-xl-12, .column > .col-xl-11, .column > .col-xl-10, .column > .col-xl-9, .column > .col-xl-8, .column > .col-xl-7, .column > .col-xl-6, .column > .col-xl-5, .column > .col-xl-4, .column > .col-xl-3, .column > .col-xl-2, .column > .col-xl-1, .column > .col-xl-0, .flex > .col-xl-auto, .flex > .col-xl-12, .flex > .col-xl-11, .flex > .col-xl-10, .flex > .col-xl-9, .flex > .col-xl-8, .flex > .col-xl-7, .flex > .col-xl-6, .flex > .col-xl-5, .flex > .col-xl-4, .flex > .col-xl-3, .flex > .col-xl-2, .flex > .col-xl-1, .flex > .col-xl-0, .column > .col-xl-grow, .flex > .col-xl-grow, .column > .col-xl-shrink, .flex > .col-xl-shrink {\n    height: auto;\n    min-height: 0;\n    max-height: 100%;\n  }\n  .col-xl {\n    flex: 10000 1 0%;\n  }\n  .col-xl-auto, .col-xl-12, .col-xl-11, .col-xl-10, .col-xl-9, .col-xl-8, .col-xl-7, .col-xl-6, .col-xl-5, .col-xl-4, .col-xl-3, .col-xl-2, .col-xl-1, .col-xl-0 {\n    flex: 0 0 auto;\n  }\n  .col-xl-grow {\n    flex: 1 0 auto;\n  }\n  .col-xl-shrink {\n    flex: 0 1 auto;\n  }\n\n  .row > .col-xl-0 {\n    height: auto;\n    width: 0%;\n  }\n  .row > .offset-xl-0 {\n    margin-left: 0%;\n  }\n\n  .column > .col-xl-0 {\n    height: 0%;\n    width: auto;\n  }\n\n  .row > .col-xl-1 {\n    height: auto;\n    width: 8.3333%;\n  }\n  .row > .offset-xl-1 {\n    margin-left: 8.3333%;\n  }\n\n  .column > .col-xl-1 {\n    height: 8.3333%;\n    width: auto;\n  }\n\n  .row > .col-xl-2 {\n    height: auto;\n    width: 16.6667%;\n  }\n  .row > .offset-xl-2 {\n    margin-left: 16.6667%;\n  }\n\n  .column > .col-xl-2 {\n    height: 16.6667%;\n    width: auto;\n  }\n\n  .row > .col-xl-3 {\n    height: auto;\n    width: 25%;\n  }\n  .row > .offset-xl-3 {\n    margin-left: 25%;\n  }\n\n  .column > .col-xl-3 {\n    height: 25%;\n    width: auto;\n  }\n\n  .row > .col-xl-4 {\n    height: auto;\n    width: 33.3333%;\n  }\n  .row > .offset-xl-4 {\n    margin-left: 33.3333%;\n  }\n\n  .column > .col-xl-4 {\n    height: 33.3333%;\n    width: auto;\n  }\n\n  .row > .col-xl-5 {\n    height: auto;\n    width: 41.6667%;\n  }\n  .row > .offset-xl-5 {\n    margin-left: 41.6667%;\n  }\n\n  .column > .col-xl-5 {\n    height: 41.6667%;\n    width: auto;\n  }\n\n  .row > .col-xl-6 {\n    height: auto;\n    width: 50%;\n  }\n  .row > .offset-xl-6 {\n    margin-left: 50%;\n  }\n\n  .column > .col-xl-6 {\n    height: 50%;\n    width: auto;\n  }\n\n  .row > .col-xl-7 {\n    height: auto;\n    width: 58.3333%;\n  }\n  .row > .offset-xl-7 {\n    margin-left: 58.3333%;\n  }\n\n  .column > .col-xl-7 {\n    height: 58.3333%;\n    width: auto;\n  }\n\n  .row > .col-xl-8 {\n    height: auto;\n    width: 66.6667%;\n  }\n  .row > .offset-xl-8 {\n    margin-left: 66.6667%;\n  }\n\n  .column > .col-xl-8 {\n    height: 66.6667%;\n    width: auto;\n  }\n\n  .row > .col-xl-9 {\n    height: auto;\n    width: 75%;\n  }\n  .row > .offset-xl-9 {\n    margin-left: 75%;\n  }\n\n  .column > .col-xl-9 {\n    height: 75%;\n    width: auto;\n  }\n\n  .row > .col-xl-10 {\n    height: auto;\n    width: 83.3333%;\n  }\n  .row > .offset-xl-10 {\n    margin-left: 83.3333%;\n  }\n\n  .column > .col-xl-10 {\n    height: 83.3333%;\n    width: auto;\n  }\n\n  .row > .col-xl-11 {\n    height: auto;\n    width: 91.6667%;\n  }\n  .row > .offset-xl-11 {\n    margin-left: 91.6667%;\n  }\n\n  .column > .col-xl-11 {\n    height: 91.6667%;\n    width: auto;\n  }\n\n  .row > .col-xl-12 {\n    height: auto;\n    width: 100%;\n  }\n  .row > .offset-xl-12 {\n    margin-left: 100%;\n  }\n\n  .column > .col-xl-12 {\n    height: 100%;\n    width: auto;\n  }\n}\n.rounded-borders {\n  border-radius: 4px;\n}\n.border-radius-inherit {\n  border-radius: inherit;\n}\n.no-transition {\n  transition: none !important;\n}\n.transition-0 {\n  transition: 0s !important;\n}\n.glossy {\n  background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0) 50%, rgba(0, 0, 0, 0.12) 51%, rgba(0, 0, 0, 0.04)) !important;\n}\n.q-placeholder::placeholder {\n  color: inherit;\n  opacity: 0.7;\n}\n.q-body--fullscreen-mixin, .q-body--prevent-scroll {\n  position: fixed !important;\n}\n.q-body--force-scrollbar-x {\n  overflow-x: scroll;\n}\n.q-body--force-scrollbar-y {\n  overflow-y: scroll;\n}\n.q-no-input-spinner {\n  -moz-appearance: textfield !important;\n}\n.q-no-input-spinner::-webkit-outer-spin-button, .q-no-input-spinner::-webkit-inner-spin-button {\n  -webkit-appearance: none;\n  margin: 0;\n}\n.q-link {\n  outline: 0;\n  text-decoration: none;\n}\n.q-link--focusable:focus-visible {\n  -webkit-text-decoration: underline dashed currentColor 1px;\n          text-decoration: underline dashed currentColor 1px;\n}\nbody.electron .q-electron-drag {\n  -webkit-user-select: none;\n  -webkit-app-region: drag;\n}\nbody.electron .q-electron-drag .q-btn-item, body.electron .q-electron-drag--exception {\n  -webkit-app-region: no-drag;\n}\nimg.responsive {\n  max-width: 100%;\n  height: auto;\n}\n.non-selectable {\n  -webkit-user-select: none !important;\n          user-select: none !important;\n}\n.scroll {\n  overflow: auto;\n}\n.scroll, .scroll-x, .scroll-y {\n  -webkit-overflow-scrolling: touch;\n  will-change: scroll-position;\n}\n.scroll-x {\n  overflow-x: auto;\n}\n.scroll-y {\n  overflow-y: auto;\n}\n.no-scroll {\n  overflow: hidden !important;\n}\n.no-pointer-events,\n.no-pointer-events--children,\n.no-pointer-events--children * {\n  pointer-events: none !important;\n}\n.all-pointer-events {\n  pointer-events: all !important;\n}\n.cursor-pointer {\n  cursor: pointer !important;\n}\n.cursor-not-allowed {\n  cursor: not-allowed !important;\n}\n.cursor-inherit {\n  cursor: inherit !important;\n}\n.cursor-none {\n  cursor: none !important;\n}\n[aria-busy=true] {\n  cursor: progress;\n}\n[aria-controls] {\n  cursor: pointer;\n}\n[aria-disabled] {\n  cursor: default;\n}\n.rotate-45 {\n  transform: rotate(45deg) /* rtl:ignore */;\n}\n.rotate-90 {\n  transform: rotate(90deg) /* rtl:ignore */;\n}\n.rotate-135 {\n  transform: rotate(135deg) /* rtl:ignore */;\n}\n.rotate-180 {\n  transform: rotate(180deg) /* rtl:ignore */;\n}\n.rotate-225 {\n  transform: rotate(225deg) /* rtl:ignore */;\n}\n.rotate-270 {\n  transform: rotate(270deg) /* rtl:ignore */;\n}\n.rotate-315 {\n  transform: rotate(315deg) /* rtl:ignore */;\n}\n.flip-horizontal {\n  transform: scaleX(-1);\n}\n.flip-vertical {\n  transform: scaleY(-1);\n}\n.float-left {\n  float: left;\n}\n.float-right {\n  float: right;\n}\n.relative-position {\n  position: relative;\n}\n.fixed,\n.fixed-full,\n.fullscreen,\n.fixed-center,\n.fixed-bottom,\n.fixed-left,\n.fixed-right,\n.fixed-top,\n.fixed-top-left,\n.fixed-top-right,\n.fixed-bottom-left,\n.fixed-bottom-right {\n  position: fixed;\n}\n.absolute,\n.absolute-full,\n.absolute-center,\n.absolute-bottom,\n.absolute-left,\n.absolute-right,\n.absolute-top,\n.absolute-top-left,\n.absolute-top-right,\n.absolute-bottom-left,\n.absolute-bottom-right {\n  position: absolute;\n}\n.fixed-top, .absolute-top {\n  top: 0;\n  left: 0;\n  right: 0;\n}\n.fixed-right, .absolute-right {\n  top: 0;\n  right: 0;\n  bottom: 0;\n}\n.fixed-bottom, .absolute-bottom {\n  right: 0;\n  bottom: 0;\n  left: 0;\n}\n.fixed-left, .absolute-left {\n  top: 0;\n  bottom: 0;\n  left: 0;\n}\n.fixed-top-left, .absolute-top-left {\n  top: 0;\n  left: 0;\n}\n.fixed-top-right, .absolute-top-right {\n  top: 0;\n  right: 0;\n}\n.fixed-bottom-left, .absolute-bottom-left {\n  bottom: 0;\n  left: 0;\n}\n.fixed-bottom-right, .absolute-bottom-right {\n  bottom: 0;\n  right: 0;\n}\n.fullscreen {\n  z-index: 6000;\n  border-radius: 0 !important;\n  max-width: 100vw;\n  max-height: 100vh;\n}\nbody.q-ios-padding .fullscreen {\n  padding-top: 20px !important;\n  padding-top: env(safe-area-inset-top) !important;\n  padding-bottom: env(safe-area-inset-bottom) !important;\n}\n.absolute-full, .fullscreen, .fixed-full {\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n}\n.fixed-center, .absolute-center {\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n}\n.vertical-top {\n  vertical-align: top !important;\n}\n.vertical-middle {\n  vertical-align: middle !important;\n}\n.vertical-bottom {\n  vertical-align: bottom !important;\n}\n.on-left {\n  margin-right: 12px;\n}\n.on-right {\n  margin-left: 12px;\n}\n/* internal: */\n.q-position-engine {\n  margin-top: var(--q-pe-top, 0) !important;\n  margin-left: var(--q-pe-left, 0) !important;\n  will-change: auto;\n  visibility: collapse;\n}\n:root {\n  --q-size-xs: 0;\n  --q-size-sm: 600px;\n  --q-size-md: 1024px;\n  --q-size-lg: 1440px;\n  --q-size-xl: 1920px;\n}\n.fit {\n  width: 100% !important;\n  height: 100% !important;\n}\n.full-height {\n  height: 100% !important;\n}\n.full-width {\n  width: 100% !important;\n  margin-left: 0 !important;\n  margin-right: 0 !important;\n}\n.window-height {\n  margin-top: 0 !important;\n  margin-bottom: 0 !important;\n  height: 100vh !important;\n}\n.window-width {\n  margin-left: 0 !important;\n  margin-right: 0 !important;\n  width: 100vw !important;\n}\n.block {\n  display: block !important;\n}\n.inline-block {\n  display: inline-block !important;\n}\n.q-pa-none {\n  padding: 0 0;\n}\n.q-pl-none {\n  padding-left: 0;\n}\n.q-pr-none {\n  padding-right: 0;\n}\n.q-pt-none {\n  padding-top: 0;\n}\n.q-pb-none {\n  padding-bottom: 0;\n}\n.q-px-none {\n  padding-left: 0;\n  padding-right: 0;\n}\n.q-py-none {\n  padding-top: 0;\n  padding-bottom: 0;\n}\n.q-ma-none {\n  margin: 0 0;\n}\n.q-ml-none {\n  margin-left: 0;\n}\n.q-mr-none {\n  margin-right: 0;\n}\n.q-mt-none {\n  margin-top: 0;\n}\n.q-mb-none {\n  margin-bottom: 0;\n}\n.q-mx-none {\n  margin-left: 0;\n  margin-right: 0;\n}\n.q-my-none {\n  margin-top: 0;\n  margin-bottom: 0;\n}\n.q-pa-xs {\n  padding: 4px 4px;\n}\n.q-pl-xs {\n  padding-left: 4px;\n}\n.q-pr-xs {\n  padding-right: 4px;\n}\n.q-pt-xs {\n  padding-top: 4px;\n}\n.q-pb-xs {\n  padding-bottom: 4px;\n}\n.q-px-xs {\n  padding-left: 4px;\n  padding-right: 4px;\n}\n.q-py-xs {\n  padding-top: 4px;\n  padding-bottom: 4px;\n}\n.q-ma-xs {\n  margin: 4px 4px;\n}\n.q-ml-xs {\n  margin-left: 4px;\n}\n.q-mr-xs {\n  margin-right: 4px;\n}\n.q-mt-xs {\n  margin-top: 4px;\n}\n.q-mb-xs {\n  margin-bottom: 4px;\n}\n.q-mx-xs {\n  margin-left: 4px;\n  margin-right: 4px;\n}\n.q-my-xs {\n  margin-top: 4px;\n  margin-bottom: 4px;\n}\n.q-pa-sm {\n  padding: 8px 8px;\n}\n.q-pl-sm {\n  padding-left: 8px;\n}\n.q-pr-sm {\n  padding-right: 8px;\n}\n.q-pt-sm {\n  padding-top: 8px;\n}\n.q-pb-sm {\n  padding-bottom: 8px;\n}\n.q-px-sm {\n  padding-left: 8px;\n  padding-right: 8px;\n}\n.q-py-sm {\n  padding-top: 8px;\n  padding-bottom: 8px;\n}\n.q-ma-sm {\n  margin: 8px 8px;\n}\n.q-ml-sm {\n  margin-left: 8px;\n}\n.q-mr-sm {\n  margin-right: 8px;\n}\n.q-mt-sm {\n  margin-top: 8px;\n}\n.q-mb-sm {\n  margin-bottom: 8px;\n}\n.q-mx-sm {\n  margin-left: 8px;\n  margin-right: 8px;\n}\n.q-my-sm {\n  margin-top: 8px;\n  margin-bottom: 8px;\n}\n.q-pa-md {\n  padding: 16px 16px;\n}\n.q-pl-md {\n  padding-left: 16px;\n}\n.q-pr-md {\n  padding-right: 16px;\n}\n.q-pt-md {\n  padding-top: 16px;\n}\n.q-pb-md {\n  padding-bottom: 16px;\n}\n.q-px-md {\n  padding-left: 16px;\n  padding-right: 16px;\n}\n.q-py-md {\n  padding-top: 16px;\n  padding-bottom: 16px;\n}\n.q-ma-md {\n  margin: 16px 16px;\n}\n.q-ml-md {\n  margin-left: 16px;\n}\n.q-mr-md {\n  margin-right: 16px;\n}\n.q-mt-md {\n  margin-top: 16px;\n}\n.q-mb-md {\n  margin-bottom: 16px;\n}\n.q-mx-md {\n  margin-left: 16px;\n  margin-right: 16px;\n}\n.q-my-md {\n  margin-top: 16px;\n  margin-bottom: 16px;\n}\n.q-pa-lg {\n  padding: 24px 24px;\n}\n.q-pl-lg {\n  padding-left: 24px;\n}\n.q-pr-lg {\n  padding-right: 24px;\n}\n.q-pt-lg {\n  padding-top: 24px;\n}\n.q-pb-lg {\n  padding-bottom: 24px;\n}\n.q-px-lg {\n  padding-left: 24px;\n  padding-right: 24px;\n}\n.q-py-lg {\n  padding-top: 24px;\n  padding-bottom: 24px;\n}\n.q-ma-lg {\n  margin: 24px 24px;\n}\n.q-ml-lg {\n  margin-left: 24px;\n}\n.q-mr-lg {\n  margin-right: 24px;\n}\n.q-mt-lg {\n  margin-top: 24px;\n}\n.q-mb-lg {\n  margin-bottom: 24px;\n}\n.q-mx-lg {\n  margin-left: 24px;\n  margin-right: 24px;\n}\n.q-my-lg {\n  margin-top: 24px;\n  margin-bottom: 24px;\n}\n.q-pa-xl {\n  padding: 48px 48px;\n}\n.q-pl-xl {\n  padding-left: 48px;\n}\n.q-pr-xl {\n  padding-right: 48px;\n}\n.q-pt-xl {\n  padding-top: 48px;\n}\n.q-pb-xl {\n  padding-bottom: 48px;\n}\n.q-px-xl {\n  padding-left: 48px;\n  padding-right: 48px;\n}\n.q-py-xl {\n  padding-top: 48px;\n  padding-bottom: 48px;\n}\n.q-ma-xl {\n  margin: 48px 48px;\n}\n.q-ml-xl {\n  margin-left: 48px;\n}\n.q-mr-xl {\n  margin-right: 48px;\n}\n.q-mt-xl {\n  margin-top: 48px;\n}\n.q-mb-xl {\n  margin-bottom: 48px;\n}\n.q-mx-xl {\n  margin-left: 48px;\n  margin-right: 48px;\n}\n.q-my-xl {\n  margin-top: 48px;\n  margin-bottom: 48px;\n}\n.q-mt-auto, .q-my-auto {\n  margin-top: auto;\n}\n.q-ml-auto {\n  margin-left: auto;\n}\n.q-mb-auto, .q-my-auto {\n  margin-bottom: auto;\n}\n.q-mr-auto {\n  margin-right: auto;\n}\n.q-mx-auto {\n  margin-left: auto;\n  margin-right: auto;\n}\n.q-touch {\n  -webkit-user-select: none;\n          user-select: none;\n  user-drag: none;\n  -khtml-user-drag: none;\n  -webkit-user-drag: none;\n}\n.q-touch-x {\n  touch-action: pan-x;\n}\n.q-touch-y {\n  touch-action: pan-y;\n}\n:root {\n  --q-transition-duration: .3s;\n}\n.q-transition--slide-right-enter-active, .q-transition--slide-right-leave-active, .q-transition--slide-left-enter-active, .q-transition--slide-left-leave-active, .q-transition--slide-up-enter-active, .q-transition--slide-up-leave-active, .q-transition--slide-down-enter-active, .q-transition--slide-down-leave-active, .q-transition--jump-right-enter-active, .q-transition--jump-right-leave-active, .q-transition--jump-left-enter-active, .q-transition--jump-left-leave-active, .q-transition--jump-up-enter-active, .q-transition--jump-up-leave-active, .q-transition--jump-down-enter-active, .q-transition--jump-down-leave-active, .q-transition--fade-enter-active, .q-transition--fade-leave-active, .q-transition--scale-enter-active, .q-transition--scale-leave-active, .q-transition--rotate-enter-active, .q-transition--rotate-leave-active, .q-transition--flip-enter-active, .q-transition--flip-leave-active {\n  --q-transition-duration: .3s;\n  --q-transition-easing: cubic-bezier(0.215,0.61,0.355,1);\n}\n.q-transition--slide-right-leave-active, .q-transition--slide-left-leave-active, .q-transition--slide-up-leave-active, .q-transition--slide-down-leave-active, .q-transition--jump-right-leave-active, .q-transition--jump-left-leave-active, .q-transition--jump-up-leave-active, .q-transition--jump-down-leave-active, .q-transition--fade-leave-active, .q-transition--scale-leave-active, .q-transition--rotate-leave-active, .q-transition--flip-leave-active {\n  position: absolute;\n}\n.q-transition--slide-right-enter-active, .q-transition--slide-right-leave-active, .q-transition--slide-left-enter-active, .q-transition--slide-left-leave-active, .q-transition--slide-up-enter-active, .q-transition--slide-up-leave-active, .q-transition--slide-down-enter-active, .q-transition--slide-down-leave-active {\n  transition: transform var(--q-transition-duration) var(--q-transition-easing);\n}\n.q-transition--slide-right-enter-from {\n  transform: translate3d(-100%, 0, 0);\n}\n.q-transition--slide-right-leave-to {\n  transform: translate3d(100%, 0, 0);\n}\n.q-transition--slide-left-enter-from {\n  transform: translate3d(100%, 0, 0);\n}\n.q-transition--slide-left-leave-to {\n  transform: translate3d(-100%, 0, 0);\n}\n.q-transition--slide-up-enter-from {\n  transform: translate3d(0, 100%, 0);\n}\n.q-transition--slide-up-leave-to {\n  transform: translate3d(0, -100%, 0);\n}\n.q-transition--slide-down-enter-from {\n  transform: translate3d(0, -100%, 0);\n}\n.q-transition--slide-down-leave-to {\n  transform: translate3d(0, 100%, 0);\n}\n.q-transition--jump-right-enter-active, .q-transition--jump-right-leave-active, .q-transition--jump-left-enter-active, .q-transition--jump-left-leave-active, .q-transition--jump-up-enter-active, .q-transition--jump-up-leave-active, .q-transition--jump-down-enter-active, .q-transition--jump-down-leave-active {\n  transition: opacity var(--q-transition-duration), transform var(--q-transition-duration);\n}\n.q-transition--jump-right-enter-from, .q-transition--jump-right-leave-to, .q-transition--jump-left-enter-from, .q-transition--jump-left-leave-to, .q-transition--jump-up-enter-from, .q-transition--jump-up-leave-to, .q-transition--jump-down-enter-from, .q-transition--jump-down-leave-to {\n  opacity: 0;\n}\n.q-transition--jump-right-enter-from {\n  transform: translate3d(-15px, 0, 0);\n}\n.q-transition--jump-right-leave-to {\n  transform: translate3d(15px, 0, 0);\n}\n.q-transition--jump-left-enter-from {\n  transform: translate3d(15px, 0, 0);\n}\n.q-transition--jump-left-leave-to {\n  transform: translateX(-15px);\n}\n.q-transition--jump-up-enter-from {\n  transform: translate3d(0, 15px, 0);\n}\n.q-transition--jump-up-leave-to {\n  transform: translate3d(0, -15px, 0);\n}\n.q-transition--jump-down-enter-from {\n  transform: translate3d(0, -15px, 0);\n}\n.q-transition--jump-down-leave-to {\n  transform: translate3d(0, 15px, 0);\n}\n.q-transition--fade-enter-active, .q-transition--fade-leave-active {\n  transition: opacity var(--q-transition-duration) ease-out;\n}\n.q-transition--fade-enter-from, .q-transition--fade-leave-to {\n  opacity: 0;\n}\n.q-transition--scale-enter-active, .q-transition--scale-leave-active {\n  transition: opacity var(--q-transition-duration), transform var(--q-transition-duration) var(--q-transition-easing);\n}\n.q-transition--scale-enter-from, .q-transition--scale-leave-to {\n  opacity: 0;\n  transform: scale3d(0, 0, 1);\n}\n.q-transition--rotate-enter-active, .q-transition--rotate-leave-active {\n  transition: opacity var(--q-transition-duration), transform var(--q-transition-duration) var(--q-transition-easing);\n  transform-style: preserve-3d;\n}\n.q-transition--rotate-enter-from, .q-transition--rotate-leave-to {\n  opacity: 0;\n  transform: scale3d(0, 0, 1) rotate3d(0, 0, 1, 90deg);\n}\n.q-transition--flip-right-enter-active, .q-transition--flip-right-leave-active, .q-transition--flip-left-enter-active, .q-transition--flip-left-leave-active, .q-transition--flip-up-enter-active, .q-transition--flip-up-leave-active, .q-transition--flip-down-enter-active, .q-transition--flip-down-leave-active {\n  transition: transform var(--q-transition-duration);\n  -webkit-backface-visibility: hidden;\n          backface-visibility: hidden;\n}\n.q-transition--flip-right-enter-to, .q-transition--flip-right-leave-from, .q-transition--flip-left-enter-to, .q-transition--flip-left-leave-from, .q-transition--flip-up-enter-to, .q-transition--flip-up-leave-from, .q-transition--flip-down-enter-to, .q-transition--flip-down-leave-from {\n  transform: perspective(400px) rotate3d(1, 1, 0, 0deg);\n}\n.q-transition--flip-right-enter-from {\n  transform: perspective(400px) rotate3d(0, 1, 0, -180deg);\n}\n.q-transition--flip-right-leave-to {\n  transform: perspective(400px) rotate3d(0, 1, 0, 180deg);\n}\n.q-transition--flip-left-enter-from {\n  transform: perspective(400px) rotate3d(0, 1, 0, 180deg);\n}\n.q-transition--flip-left-leave-to {\n  transform: perspective(400px) rotate3d(0, 1, 0, -180deg);\n}\n.q-transition--flip-up-enter-from {\n  transform: perspective(400px) rotate3d(1, 0, 0, -180deg);\n}\n.q-transition--flip-up-leave-to {\n  transform: perspective(400px) rotate3d(1, 0, 0, 180deg);\n}\n.q-transition--flip-down-enter-from {\n  transform: perspective(400px) rotate3d(1, 0, 0, 180deg);\n}\n.q-transition--flip-down-leave-to {\n  transform: perspective(400px) rotate3d(1, 0, 0, -180deg);\n}\nbody {\n  min-width: 100px;\n  min-height: 100%;\n  font-family: "Roboto", "-apple-system", "Helvetica Neue", Helvetica, Arial, sans-serif;\n  -ms-text-size-adjust: 100%;\n  -webkit-text-size-adjust: 100%;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  font-smoothing: antialiased;\n  line-height: 1.5;\n  font-size: 14px;\n}\nh1 {\n  font-size: 6rem;\n  font-weight: 300;\n  line-height: 6rem;\n  letter-spacing: -0.01562em;\n}\nh2 {\n  font-size: 3.75rem;\n  font-weight: 300;\n  line-height: 3.75rem;\n  letter-spacing: -0.00833em;\n}\nh3 {\n  font-size: 3rem;\n  font-weight: 400;\n  line-height: 3.125rem;\n  letter-spacing: normal;\n}\nh4 {\n  font-size: 2.125rem;\n  font-weight: 400;\n  line-height: 2.5rem;\n  letter-spacing: 0.00735em;\n}\nh5 {\n  font-size: 1.5rem;\n  font-weight: 400;\n  line-height: 2rem;\n  letter-spacing: normal;\n}\nh6 {\n  font-size: 1.25rem;\n  font-weight: 500;\n  line-height: 2rem;\n  letter-spacing: 0.0125em;\n}\np {\n  margin: 0 0 16px;\n}\n.text-h1 {\n  font-size: 6rem;\n  font-weight: 300;\n  line-height: 6rem;\n  letter-spacing: -0.01562em;\n}\n.text-h2 {\n  font-size: 3.75rem;\n  font-weight: 300;\n  line-height: 3.75rem;\n  letter-spacing: -0.00833em;\n}\n.text-h3 {\n  font-size: 3rem;\n  font-weight: 400;\n  line-height: 3.125rem;\n  letter-spacing: normal;\n}\n.text-h4 {\n  font-size: 2.125rem;\n  font-weight: 400;\n  line-height: 2.5rem;\n  letter-spacing: 0.00735em;\n}\n.text-h5 {\n  font-size: 1.5rem;\n  font-weight: 400;\n  line-height: 2rem;\n  letter-spacing: normal;\n}\n.text-h6 {\n  font-size: 1.25rem;\n  font-weight: 500;\n  line-height: 2rem;\n  letter-spacing: 0.0125em;\n}\n.text-subtitle1 {\n  font-size: 1rem;\n  font-weight: 400;\n  line-height: 1.75rem;\n  letter-spacing: 0.00937em;\n}\n.text-subtitle2 {\n  font-size: 0.875rem;\n  font-weight: 500;\n  line-height: 1.375rem;\n  letter-spacing: 0.00714em;\n}\n.text-body1 {\n  font-size: 1rem;\n  font-weight: 400;\n  line-height: 1.5rem;\n  letter-spacing: 0.03125em;\n}\n.text-body2 {\n  font-size: 0.875rem;\n  font-weight: 400;\n  line-height: 1.25rem;\n  letter-spacing: 0.01786em;\n}\n.text-overline {\n  font-size: 0.75rem;\n  font-weight: 500;\n  line-height: 2rem;\n  letter-spacing: 0.16667em;\n}\n.text-caption {\n  font-size: 0.75rem;\n  font-weight: 400;\n  line-height: 1.25rem;\n  letter-spacing: 0.03333em;\n}\n.text-uppercase {\n  text-transform: uppercase;\n}\n.text-lowercase {\n  text-transform: lowercase;\n}\n.text-capitalize {\n  text-transform: capitalize;\n}\n.text-center {\n  text-align: center;\n}\n.text-left {\n  text-align: left;\n}\n.text-right {\n  text-align: right;\n}\n.text-justify {\n  text-align: justify;\n  -webkit-hyphens: auto;\n          hyphens: auto;\n}\n.text-italic {\n  font-style: italic;\n}\n.text-bold {\n  font-weight: bold;\n}\n.text-no-wrap {\n  white-space: nowrap;\n}\n.text-strike {\n  text-decoration: line-through;\n}\n.text-weight-thin {\n  font-weight: 100;\n}\n.text-weight-light {\n  font-weight: 300;\n}\n.text-weight-regular {\n  font-weight: 400;\n}\n.text-weight-medium {\n  font-weight: 500;\n}\n.text-weight-bold {\n  font-weight: 700;\n}\n.text-weight-bolder {\n  font-weight: 900;\n}\nsmall {\n  font-size: 80%;\n}\nbig {\n  font-size: 170%;\n}\nsub {\n  bottom: -0.25em;\n}\nsup {\n  top: -0.5em;\n}\n.no-margin {\n  margin: 0 !important;\n}\n.no-padding {\n  padding: 0 !important;\n}\n.no-border {\n  border: 0 !important;\n}\n.no-border-radius {\n  border-radius: 0 !important;\n}\n.no-box-shadow {\n  box-shadow: none !important;\n}\n.no-outline {\n  outline: 0 !important;\n}\n.ellipsis {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n}\n.ellipsis-2-lines, .ellipsis-3-lines {\n  overflow: hidden;\n  display: -webkit-box;\n  -webkit-box-orient: vertical;\n}\n.ellipsis-2-lines {\n  -webkit-line-clamp: 2;\n}\n.ellipsis-3-lines {\n  -webkit-line-clamp: 3;\n}\n.readonly {\n  cursor: default !important;\n}\n.disabled, .disabled *, [disabled], [disabled] * {\n  outline: 0 !important;\n  cursor: not-allowed !important;\n}\n.disabled, [disabled] {\n  opacity: 0.6 !important;\n}\n.hidden {\n  display: none !important;\n}\n.invisible {\n  visibility: hidden !important;\n}\n.transparent {\n  background: transparent !important;\n}\n.overflow-auto {\n  overflow: auto !important;\n}\n.overflow-hidden {\n  overflow: hidden !important;\n}\n.overflow-hidden-y {\n  overflow-y: hidden !important;\n}\n.hide-scrollbar {\n  scrollbar-width: none;\n  -ms-overflow-style: none;\n}\n.hide-scrollbar::-webkit-scrollbar {\n  width: 0;\n  height: 0;\n  display: none;\n}\n.dimmed:after, .light-dimmed:after {\n  content: "";\n  position: absolute;\n  top: 0;\n  right: 0 /* rtl:ignore */;\n  bottom: 0;\n  left: 0 /* rtl:ignore */;\n}\n.dimmed:after {\n  background: rgba(0, 0, 0, 0.4) !important;\n}\n.light-dimmed:after {\n  background: rgba(255, 255, 255, 0.6) !important;\n}\n.z-top {\n  z-index: 7000 !important;\n}\n.z-max {\n  z-index: 9998 !important;\n}\nbody:not(.desktop) .desktop-only,\nbody.desktop .desktop-hide {\n  display: none !important;\n}\nbody:not(.mobile) .mobile-only,\nbody.mobile .mobile-hide {\n  display: none !important;\n}\nbody:not(.native-mobile) .native-mobile-only,\nbody.native-mobile .native-mobile-hide {\n  display: none !important;\n}\nbody:not(.cordova) .cordova-only,\nbody.cordova .cordova-hide {\n  display: none !important;\n}\nbody:not(.capacitor) .capacitor-only,\nbody.capacitor .capacitor-hide {\n  display: none !important;\n}\nbody:not(.electron) .electron-only,\nbody.electron .electron-hide {\n  display: none !important;\n}\nbody:not(.touch) .touch-only,\nbody.touch .touch-hide {\n  display: none !important;\n}\nbody:not(.within-iframe) .within-iframe-only,\nbody.within-iframe .within-iframe-hide {\n  display: none !important;\n}\nbody:not(.platform-ios) .platform-ios-only,\nbody.platform-ios .platform-ios-hide {\n  display: none !important;\n}\nbody:not(.platform-android) .platform-android-only,\nbody.platform-android .platform-android-hide {\n  display: none !important;\n}\n@media all and (orientation: portrait) {\n  .orientation-landscape {\n    display: none !important;\n  }\n}\n@media all and (orientation: landscape) {\n  .orientation-portrait {\n    display: none !important;\n  }\n}\n@media screen {\n  .print-only {\n    display: none !important;\n  }\n}\n@media print {\n  .print-hide {\n    display: none !important;\n  }\n}\n@media (max-width: 599.98px) {\n  .xs-hide, .gt-xs, .sm, .gt-sm, .md, .gt-md, .lg, .gt-lg, .xl {\n    display: none !important;\n  }\n}\n@media (min-width: 600px) and (max-width: 1023.98px) {\n  .sm-hide, .xs, .lt-sm, .gt-sm, .md, .gt-md, .lg, .gt-lg, .xl {\n    display: none !important;\n  }\n}\n@media (min-width: 1024px) and (max-width: 1439.98px) {\n  .md-hide, .xs, .lt-sm, .sm, .lt-md, .gt-md, .lg, .gt-lg, .xl {\n    display: none !important;\n  }\n}\n@media (min-width: 1440px) and (max-width: 1919.98px) {\n  .lg-hide, .xs, .lt-sm, .sm, .lt-md, .md, .lt-lg, .gt-lg, .xl {\n    display: none !important;\n  }\n}\n@media (min-width: 1920px) {\n  .xl-hide, .xs, .lt-sm, .sm, .lt-md, .md, .lt-lg, .lg, .lt-xl {\n    display: none !important;\n  }\n}\n.q-focus-helper, .q-focusable, .q-manual-focusable, .q-hoverable {\n  outline: 0;\n}\nbody.desktop .q-focus-helper {\n  position: absolute;\n  top: 0;\n  left: 0 /* rtl:ignore */;\n  width: 100%;\n  height: 100%;\n  pointer-events: none;\n  border-radius: inherit;\n  opacity: 0;\n  transition: background-color 0.3s cubic-bezier(0.25, 0.8, 0.5, 1), opacity 0.4s cubic-bezier(0.25, 0.8, 0.5, 1);\n}\nbody.desktop .q-focus-helper:before, body.desktop .q-focus-helper:after {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0 /* rtl:ignore */;\n  width: 100%;\n  height: 100%;\n  opacity: 0;\n  border-radius: inherit;\n  transition: background-color 0.3s cubic-bezier(0.25, 0.8, 0.5, 1), opacity 0.6s cubic-bezier(0.25, 0.8, 0.5, 1);\n}\nbody.desktop .q-focus-helper:before {\n  background: #000;\n}\nbody.desktop .q-focus-helper:after {\n  background: #fff;\n}\nbody.desktop .q-focus-helper--rounded {\n  border-radius: 4px;\n}\nbody.desktop .q-focus-helper--round {\n  border-radius: 50%;\n}\nbody.desktop .q-focusable:focus > .q-focus-helper, body.desktop .q-manual-focusable--focused > .q-focus-helper, body.desktop .q-hoverable:hover > .q-focus-helper {\n  background: currentColor;\n  opacity: 0.15;\n}\nbody.desktop .q-focusable:focus > .q-focus-helper:before, body.desktop .q-manual-focusable--focused > .q-focus-helper:before, body.desktop .q-hoverable:hover > .q-focus-helper:before {\n  opacity: 0.1;\n}\nbody.desktop .q-focusable:focus > .q-focus-helper:after, body.desktop .q-manual-focusable--focused > .q-focus-helper:after, body.desktop .q-hoverable:hover > .q-focus-helper:after {\n  opacity: 0.4;\n}\nbody.desktop .q-focusable:focus > .q-focus-helper, body.desktop .q-manual-focusable--focused > .q-focus-helper {\n  opacity: 0.22;\n}\nbody.body--dark {\n  color: #fff;\n  background: var(--q-dark-page);\n}\n.q-dark {\n  color: #fff;\n  background: var(--q-dark);\n}')();
var app = /* @__PURE__ */ (() => "")();
function injectProp(target2, propName, get2, set2) {
  Object.defineProperty(target2, propName, {
    get: get2,
    set: set2,
    enumerable: true
  });
}
const isRuntimeSsrPreHydration = ref(false);
let iosCorrection;
function getMatch(userAgent2, platformMatch) {
  const match = /(edg|edge|edga|edgios)\/([\w.]+)/.exec(userAgent2) || /(opr)[\/]([\w.]+)/.exec(userAgent2) || /(vivaldi)[\/]([\w.]+)/.exec(userAgent2) || /(chrome|crios)[\/]([\w.]+)/.exec(userAgent2) || /(version)(applewebkit)[\/]([\w.]+).*(safari)[\/]([\w.]+)/.exec(userAgent2) || /(webkit)[\/]([\w.]+).*(version)[\/]([\w.]+).*(safari)[\/]([\w.]+)/.exec(userAgent2) || /(firefox|fxios)[\/]([\w.]+)/.exec(userAgent2) || /(webkit)[\/]([\w.]+)/.exec(userAgent2) || /(opera)(?:.*version|)[\/]([\w.]+)/.exec(userAgent2) || [];
  return {
    browser: match[5] || match[3] || match[1] || "",
    version: match[2] || match[4] || "0",
    versionNumber: match[4] || match[2] || "0",
    platform: platformMatch[0] || ""
  };
}
function getPlatformMatch(userAgent2) {
  return /(ipad)/.exec(userAgent2) || /(ipod)/.exec(userAgent2) || /(windows phone)/.exec(userAgent2) || /(iphone)/.exec(userAgent2) || /(kindle)/.exec(userAgent2) || /(silk)/.exec(userAgent2) || /(android)/.exec(userAgent2) || /(win)/.exec(userAgent2) || /(mac)/.exec(userAgent2) || /(linux)/.exec(userAgent2) || /(cros)/.exec(userAgent2) || /(playbook)/.exec(userAgent2) || /(bb)/.exec(userAgent2) || /(blackberry)/.exec(userAgent2) || [];
}
const hasTouch = "ontouchstart" in window || window.navigator.maxTouchPoints > 0;
function applyIosCorrection(is) {
  iosCorrection = { is: { ...is } };
  delete is.mac;
  delete is.desktop;
  const platform = Math.min(window.innerHeight, window.innerWidth) > 414 ? "ipad" : "iphone";
  Object.assign(is, {
    mobile: true,
    ios: true,
    platform,
    [platform]: true
  });
}
function getPlatform(UA) {
  const userAgent2 = UA.toLowerCase(), platformMatch = getPlatformMatch(userAgent2), matched = getMatch(userAgent2, platformMatch), browser = {};
  if (matched.browser) {
    browser[matched.browser] = true;
    browser.version = matched.version;
    browser.versionNumber = parseInt(matched.versionNumber, 10);
  }
  if (matched.platform) {
    browser[matched.platform] = true;
  }
  const knownMobiles = browser.android || browser.ios || browser.bb || browser.blackberry || browser.ipad || browser.iphone || browser.ipod || browser.kindle || browser.playbook || browser.silk || browser["windows phone"];
  if (knownMobiles === true || userAgent2.indexOf("mobile") > -1) {
    browser.mobile = true;
    if (browser.edga || browser.edgios) {
      browser.edge = true;
      matched.browser = "edge";
    } else if (browser.crios) {
      browser.chrome = true;
      matched.browser = "chrome";
    } else if (browser.fxios) {
      browser.firefox = true;
      matched.browser = "firefox";
    }
  } else {
    browser.desktop = true;
  }
  if (browser.ipod || browser.ipad || browser.iphone) {
    browser.ios = true;
  }
  if (browser["windows phone"]) {
    browser.winphone = true;
    delete browser["windows phone"];
  }
  if (browser.chrome || browser.opr || browser.safari || browser.vivaldi || browser.mobile === true && browser.ios !== true && knownMobiles !== true) {
    browser.webkit = true;
  }
  if (browser.edg) {
    matched.browser = "edgechromium";
    browser.edgeChromium = true;
  }
  if (browser.safari && browser.blackberry || browser.bb) {
    matched.browser = "blackberry";
    browser.blackberry = true;
  }
  if (browser.safari && browser.playbook) {
    matched.browser = "playbook";
    browser.playbook = true;
  }
  if (browser.opr) {
    matched.browser = "opera";
    browser.opera = true;
  }
  if (browser.safari && browser.android) {
    matched.browser = "android";
    browser.android = true;
  }
  if (browser.safari && browser.kindle) {
    matched.browser = "kindle";
    browser.kindle = true;
  }
  if (browser.safari && browser.silk) {
    matched.browser = "silk";
    browser.silk = true;
  }
  if (browser.vivaldi) {
    matched.browser = "vivaldi";
    browser.vivaldi = true;
  }
  browser.name = matched.browser;
  browser.platform = matched.platform;
  {
    if (userAgent2.indexOf("electron") > -1) {
      browser.electron = true;
    } else if (document.location.href.indexOf("-extension://") > -1) {
      browser.bex = true;
    } else {
      if (window.Capacitor !== void 0) {
        browser.capacitor = true;
        browser.nativeMobile = true;
        browser.nativeMobileWrapper = "capacitor";
      } else if (window._cordovaNative !== void 0 || window.cordova !== void 0) {
        browser.cordova = true;
        browser.nativeMobile = true;
        browser.nativeMobileWrapper = "cordova";
      }
      if (hasTouch === true && browser.mac === true && (browser.desktop === true && browser.safari === true || browser.nativeMobile === true && browser.android !== true && browser.ios !== true && browser.ipad !== true)) {
        applyIosCorrection(browser);
      }
    }
  }
  return browser;
}
const userAgent = navigator.userAgent || navigator.vendor || window.opera;
const ssrClient = {
  has: {
    touch: false,
    webStorage: false
  },
  within: { iframe: false }
};
const client = {
  userAgent,
  is: getPlatform(userAgent),
  has: {
    touch: hasTouch
  },
  within: {
    iframe: window.self !== window.top
  }
};
const Platform = {
  install(opts) {
    const { $q } = opts;
    if (isRuntimeSsrPreHydration.value === true) {
      opts.onSSRHydrated.push(() => {
        isRuntimeSsrPreHydration.value = false;
        Object.assign($q.platform, client);
        iosCorrection = void 0;
      });
      $q.platform = reactive(this);
    } else {
      $q.platform = this;
    }
  }
};
{
  let hasWebStorage;
  injectProp(client.has, "webStorage", () => {
    if (hasWebStorage !== void 0) {
      return hasWebStorage;
    }
    try {
      if (window.localStorage) {
        hasWebStorage = true;
        return true;
      }
    } catch (e) {
    }
    hasWebStorage = false;
    return false;
  });
  client.is.ios === true && window.navigator.vendor.toLowerCase().indexOf("apple") === -1;
  if (isRuntimeSsrPreHydration.value === true) {
    Object.assign(Platform, client, iosCorrection, ssrClient);
  } else {
    Object.assign(Platform, client);
  }
}
var defineReactivePlugin = (state, plugin) => {
  const reactiveState = reactive(state);
  for (const name in state) {
    injectProp(plugin, name, () => reactiveState[name], (val) => {
      reactiveState[name] = val;
    });
  }
  return plugin;
};
const listenOpts = {
  hasPassive: false,
  passiveCapture: true,
  notPassiveCapture: true
};
try {
  const opts = Object.defineProperty({}, "passive", {
    get() {
      Object.assign(listenOpts, {
        hasPassive: true,
        passive: { passive: true },
        notPassive: { passive: false },
        passiveCapture: { passive: true, capture: true },
        notPassiveCapture: { passive: false, capture: true }
      });
    }
  });
  window.addEventListener("qtest", null, opts);
  window.removeEventListener("qtest", null, opts);
} catch (e) {
}
function noop$1() {
}
function leftClick(e) {
  return e.button === 0;
}
function position(e) {
  if (e.touches && e.touches[0]) {
    e = e.touches[0];
  } else if (e.changedTouches && e.changedTouches[0]) {
    e = e.changedTouches[0];
  } else if (e.targetTouches && e.targetTouches[0]) {
    e = e.targetTouches[0];
  }
  return {
    top: e.clientY,
    left: e.clientX
  };
}
function getEventPath(e) {
  if (e.path) {
    return e.path;
  }
  if (e.composedPath) {
    return e.composedPath();
  }
  const path = [];
  let el = e.target;
  while (el) {
    path.push(el);
    if (el.tagName === "HTML") {
      path.push(document);
      path.push(window);
      return path;
    }
    el = el.parentElement;
  }
}
function stop(e) {
  e.stopPropagation();
}
function prevent(e) {
  e.cancelable !== false && e.preventDefault();
}
function stopAndPrevent(e) {
  e.cancelable !== false && e.preventDefault();
  e.stopPropagation();
}
function preventDraggable(el, status) {
  if (el === void 0 || status === true && el.__dragPrevented === true) {
    return;
  }
  const fn = status === true ? (el2) => {
    el2.__dragPrevented = true;
    el2.addEventListener("dragstart", prevent, listenOpts.notPassiveCapture);
  } : (el2) => {
    delete el2.__dragPrevented;
    el2.removeEventListener("dragstart", prevent, listenOpts.notPassiveCapture);
  };
  el.querySelectorAll("a, img").forEach(fn);
}
function addEvt(ctx, targetName, events) {
  const name = `__q_${targetName}_evt`;
  ctx[name] = ctx[name] !== void 0 ? ctx[name].concat(events) : events;
  events.forEach((evt) => {
    evt[0].addEventListener(evt[1], ctx[evt[2]], listenOpts[evt[3]]);
  });
}
function cleanEvt(ctx, targetName) {
  const name = `__q_${targetName}_evt`;
  if (ctx[name] !== void 0) {
    ctx[name].forEach((evt) => {
      evt[0].removeEventListener(evt[1], ctx[evt[2]], listenOpts[evt[3]]);
    });
    ctx[name] = void 0;
  }
}
function debounce(fn, wait = 250, immediate) {
  let timeout;
  function debounced() {
    const args = arguments;
    const later = () => {
      timeout = void 0;
      if (immediate !== true) {
        fn.apply(this, args);
      }
    };
    clearTimeout(timeout);
    if (immediate === true && timeout === void 0) {
      fn.apply(this, args);
    }
    timeout = setTimeout(later, wait);
  }
  debounced.cancel = () => {
    clearTimeout(timeout);
  };
  return debounced;
}
const SIZE_LIST = ["sm", "md", "lg", "xl"];
const { passive } = listenOpts;
var Screen = defineReactivePlugin({
  width: 0,
  height: 0,
  name: "xs",
  sizes: {
    sm: 600,
    md: 1024,
    lg: 1440,
    xl: 1920
  },
  lt: {
    sm: true,
    md: true,
    lg: true,
    xl: true
  },
  gt: {
    xs: false,
    sm: false,
    md: false,
    lg: false
  },
  xs: true,
  sm: false,
  md: false,
  lg: false,
  xl: false
}, {
  setSizes: noop$1,
  setDebounce: noop$1,
  install({ $q, onSSRHydrated }) {
    $q.screen = this;
    if (this.__installed === true) {
      if ($q.config.screen !== void 0) {
        if ($q.config.screen.bodyClasses === false) {
          document.body.classList.remove(`screen--${this.name}`);
        } else {
          this.__update(true);
        }
      }
      return;
    }
    const { visualViewport } = window;
    const target2 = visualViewport || window;
    const scrollingElement = document.scrollingElement || document.documentElement;
    const getSize = visualViewport === void 0 || client.is.mobile === true ? () => [
      Math.max(window.innerWidth, scrollingElement.clientWidth),
      Math.max(window.innerHeight, scrollingElement.clientHeight)
    ] : () => [
      visualViewport.width * visualViewport.scale + window.innerWidth - scrollingElement.clientWidth,
      visualViewport.height * visualViewport.scale + window.innerHeight - scrollingElement.clientHeight
    ];
    const classes = $q.config.screen !== void 0 && $q.config.screen.bodyClasses === true;
    this.__update = (force) => {
      const [w, h2] = getSize();
      if (h2 !== this.height) {
        this.height = h2;
      }
      if (w !== this.width) {
        this.width = w;
      } else if (force !== true) {
        return;
      }
      let s = this.sizes;
      this.gt.xs = w >= s.sm;
      this.gt.sm = w >= s.md;
      this.gt.md = w >= s.lg;
      this.gt.lg = w >= s.xl;
      this.lt.sm = w < s.sm;
      this.lt.md = w < s.md;
      this.lt.lg = w < s.lg;
      this.lt.xl = w < s.xl;
      this.xs = this.lt.sm;
      this.sm = this.gt.xs === true && this.lt.md === true;
      this.md = this.gt.sm === true && this.lt.lg === true;
      this.lg = this.gt.md === true && this.lt.xl === true;
      this.xl = this.gt.lg;
      s = this.xs === true && "xs" || this.sm === true && "sm" || this.md === true && "md" || this.lg === true && "lg" || "xl";
      if (s !== this.name) {
        if (classes === true) {
          document.body.classList.remove(`screen--${this.name}`);
          document.body.classList.add(`screen--${s}`);
        }
        this.name = s;
      }
    };
    let updateEvt, updateSizes = {}, updateDebounce = 16;
    this.setSizes = (sizes) => {
      SIZE_LIST.forEach((name) => {
        if (sizes[name] !== void 0) {
          updateSizes[name] = sizes[name];
        }
      });
    };
    this.setDebounce = (deb) => {
      updateDebounce = deb;
    };
    const start2 = () => {
      const style = getComputedStyle(document.body);
      if (style.getPropertyValue("--q-size-sm")) {
        SIZE_LIST.forEach((name) => {
          this.sizes[name] = parseInt(style.getPropertyValue(`--q-size-${name}`), 10);
        });
      }
      this.setSizes = (sizes) => {
        SIZE_LIST.forEach((name) => {
          if (sizes[name]) {
            this.sizes[name] = sizes[name];
          }
        });
        this.__update(true);
      };
      this.setDebounce = (delay) => {
        updateEvt !== void 0 && target2.removeEventListener("resize", updateEvt, passive);
        updateEvt = delay > 0 ? debounce(this.__update, delay) : this.__update;
        target2.addEventListener("resize", updateEvt, passive);
      };
      this.setDebounce(updateDebounce);
      if (Object.keys(updateSizes).length > 0) {
        this.setSizes(updateSizes);
        updateSizes = void 0;
      } else {
        this.__update();
      }
      classes === true && this.name === "xs" && document.body.classList.add("screen--xs");
    };
    if (isRuntimeSsrPreHydration.value === true) {
      onSSRHydrated.push(start2);
    } else {
      start2();
    }
  }
});
const Plugin$2 = defineReactivePlugin({
  isActive: false,
  mode: false
}, {
  __media: void 0,
  set(val) {
    Plugin$2.mode = val;
    if (val === "auto") {
      if (Plugin$2.__media === void 0) {
        Plugin$2.__media = window.matchMedia("(prefers-color-scheme: dark)");
        Plugin$2.__updateMedia = () => {
          Plugin$2.set("auto");
        };
        Plugin$2.__media.addListener(Plugin$2.__updateMedia);
      }
      val = Plugin$2.__media.matches;
    } else if (Plugin$2.__media !== void 0) {
      Plugin$2.__media.removeListener(Plugin$2.__updateMedia);
      Plugin$2.__media = void 0;
    }
    Plugin$2.isActive = val === true;
    document.body.classList.remove(`body--${val === true ? "light" : "dark"}`);
    document.body.classList.add(`body--${val === true ? "dark" : "light"}`);
  },
  toggle() {
    {
      Plugin$2.set(Plugin$2.isActive === false);
    }
  },
  install({ $q, onSSRHydrated, ssrContext }) {
    const { dark } = $q.config;
    $q.dark = this;
    if (this.__installed === true && dark === void 0) {
      return;
    }
    this.isActive = dark === true;
    const initialVal = dark !== void 0 ? dark : false;
    if (isRuntimeSsrPreHydration.value === true) {
      const ssrSet = (val) => {
        this.__fromSSR = val;
      };
      const originalSet = this.set;
      this.set = ssrSet;
      ssrSet(initialVal);
      onSSRHydrated.push(() => {
        this.set = originalSet;
        this.set(this.__fromSSR);
      });
    } else {
      this.set(initialVal);
    }
  }
});
const getTrue = () => true;
function filterInvalidPath(path) {
  return typeof path === "string" && path !== "" && path !== "/" && path !== "#/";
}
function normalizeExitPath(path) {
  path.startsWith("#") === true && (path = path.substring(1));
  path.startsWith("/") === false && (path = "/" + path);
  path.endsWith("/") === true && (path = path.substring(0, path.length - 1));
  return "#" + path;
}
function getShouldExitFn(cfg) {
  if (cfg.backButtonExit === false) {
    return () => false;
  }
  if (cfg.backButtonExit === "*") {
    return getTrue;
  }
  const exitPaths = ["#/"];
  Array.isArray(cfg.backButtonExit) === true && exitPaths.push(...cfg.backButtonExit.filter(filterInvalidPath).map(normalizeExitPath));
  return () => exitPaths.includes(window.location.hash);
}
var History = {
  __history: [],
  add: noop$1,
  remove: noop$1,
  install({ $q }) {
    if (this.__installed === true) {
      return;
    }
    const { cordova, capacitor } = client.is;
    if (cordova !== true && capacitor !== true) {
      return;
    }
    const qConf = $q.config[cordova === true ? "cordova" : "capacitor"];
    if (qConf !== void 0 && qConf.backButton === false) {
      return;
    }
    if (capacitor === true && (window.Capacitor === void 0 || window.Capacitor.Plugins.App === void 0)) {
      return;
    }
    this.add = (entry) => {
      if (entry.condition === void 0) {
        entry.condition = getTrue;
      }
      this.__history.push(entry);
    };
    this.remove = (entry) => {
      const index = this.__history.indexOf(entry);
      if (index >= 0) {
        this.__history.splice(index, 1);
      }
    };
    const shouldExit = getShouldExitFn(Object.assign({ backButtonExit: true }, qConf));
    const backHandler = () => {
      if (this.__history.length) {
        const entry = this.__history[this.__history.length - 1];
        if (entry.condition() === true) {
          this.__history.pop();
          entry.handler();
        }
      } else if (shouldExit() === true) {
        navigator.app.exitApp();
      } else {
        window.history.back();
      }
    };
    if (cordova === true) {
      document.addEventListener("deviceready", () => {
        document.addEventListener("backbutton", backHandler, false);
      });
    } else {
      window.Capacitor.Plugins.App.addListener("backButton", backHandler);
    }
  }
};
var defaultLang = {
  isoName: "en-US",
  nativeName: "English (US)",
  label: {
    clear: "Clear",
    ok: "OK",
    cancel: "Cancel",
    close: "Close",
    set: "Set",
    select: "Select",
    reset: "Reset",
    remove: "Remove",
    update: "Update",
    create: "Create",
    search: "Search",
    filter: "Filter",
    refresh: "Refresh"
  },
  date: {
    days: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
    daysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
    months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
    monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
    firstDayOfWeek: 0,
    format24h: false,
    pluralDay: "days"
  },
  table: {
    noData: "No data available",
    noResults: "No matching records found",
    loading: "Loading...",
    selectedRecords: (rows) => rows === 1 ? "1 record selected." : (rows === 0 ? "No" : rows) + " records selected.",
    recordsPerPage: "Records per page:",
    allRows: "All",
    pagination: (start2, end, total) => start2 + "-" + end + " of " + total,
    columns: "Columns"
  },
  editor: {
    url: "URL",
    bold: "Bold",
    italic: "Italic",
    strikethrough: "Strikethrough",
    underline: "Underline",
    unorderedList: "Unordered List",
    orderedList: "Ordered List",
    subscript: "Subscript",
    superscript: "Superscript",
    hyperlink: "Hyperlink",
    toggleFullscreen: "Toggle Fullscreen",
    quote: "Quote",
    left: "Left align",
    center: "Center align",
    right: "Right align",
    justify: "Justify align",
    print: "Print",
    outdent: "Decrease indentation",
    indent: "Increase indentation",
    removeFormat: "Remove formatting",
    formatting: "Formatting",
    fontSize: "Font Size",
    align: "Align",
    hr: "Insert Horizontal Rule",
    undo: "Undo",
    redo: "Redo",
    heading1: "Heading 1",
    heading2: "Heading 2",
    heading3: "Heading 3",
    heading4: "Heading 4",
    heading5: "Heading 5",
    heading6: "Heading 6",
    paragraph: "Paragraph",
    code: "Code",
    size1: "Very small",
    size2: "A bit small",
    size3: "Normal",
    size4: "Medium-large",
    size5: "Big",
    size6: "Very big",
    size7: "Maximum",
    defaultFont: "Default Font",
    viewSource: "View Source"
  },
  tree: {
    noNodes: "No nodes available",
    noResults: "No matching nodes found"
  }
};
function getLocale() {
  const val = Array.isArray(navigator.languages) === true && navigator.languages.length > 0 ? navigator.languages[0] : navigator.language;
  if (typeof val === "string") {
    return val.split(/[-_]/).map((v, i) => i === 0 ? v.toLowerCase() : i > 1 || v.length < 4 ? v.toUpperCase() : v[0].toUpperCase() + v.slice(1).toLowerCase()).join("-");
  }
}
const Plugin$1 = defineReactivePlugin({
  __langPack: {}
}, {
  getLocale,
  set(langObject = defaultLang, ssrContext) {
    const lang = {
      ...langObject,
      rtl: langObject.rtl === true,
      getLocale
    };
    {
      const el = document.documentElement;
      el.setAttribute("dir", lang.rtl === true ? "rtl" : "ltr");
      el.setAttribute("lang", lang.isoName);
      lang.set = Plugin$1.set;
      Object.assign(Plugin$1.__langPack, lang);
      Plugin$1.props = lang;
      Plugin$1.isoName = lang.isoName;
      Plugin$1.nativeName = lang.nativeName;
    }
  },
  install({ $q, lang, ssrContext }) {
    {
      $q.lang = Plugin$1.__langPack;
      if (this.__installed === true) {
        lang !== void 0 && this.set(lang);
      } else {
        this.set(lang || defaultLang);
      }
    }
  }
});
function setCssVar(propName, value, element = document.body) {
  if (typeof propName !== "string") {
    throw new TypeError("Expected a string as propName");
  }
  if (typeof value !== "string") {
    throw new TypeError("Expected a string as value");
  }
  if (!(element instanceof Element)) {
    throw new TypeError("Expected a DOM element");
  }
  element.style.setProperty(`--q-${propName}`, value);
}
let lastKeyCompositionStatus = false;
function onKeyDownComposition(evt) {
  lastKeyCompositionStatus = evt.isComposing === true;
}
function shouldIgnoreKey(evt) {
  return lastKeyCompositionStatus === true || evt !== Object(evt) || evt.isComposing === true || evt.qKeyEvent === true;
}
function isKeyCode(evt, keyCodes) {
  return shouldIgnoreKey(evt) === true ? false : [].concat(keyCodes).includes(evt.keyCode);
}
function getMobilePlatform(is) {
  if (is.ios === true)
    return "ios";
  if (is.android === true)
    return "android";
}
function getBodyClasses({ is, has: has2, within }, cfg) {
  const cls = [
    is.desktop === true ? "desktop" : "mobile",
    `${has2.touch === false ? "no-" : ""}touch`
  ];
  if (is.mobile === true) {
    const mobile = getMobilePlatform(is);
    mobile !== void 0 && cls.push("platform-" + mobile);
  }
  if (is.nativeMobile === true) {
    const type = is.nativeMobileWrapper;
    cls.push(type);
    cls.push("native-mobile");
    if (is.ios === true && (cfg[type] === void 0 || cfg[type].iosStatusBarPadding !== false)) {
      cls.push("q-ios-padding");
    }
  } else if (is.electron === true) {
    cls.push("electron");
  } else if (is.bex === true) {
    cls.push("bex");
  }
  within.iframe === true && cls.push("within-iframe");
  return cls;
}
function applyClientSsrCorrections() {
  const classes = document.body.className;
  let newCls = classes;
  if (iosCorrection !== void 0) {
    newCls = newCls.replace("desktop", "platform-ios mobile");
  }
  if (client.has.touch === true) {
    newCls = newCls.replace("no-touch", "touch");
  }
  if (client.within.iframe === true) {
    newCls += " within-iframe";
  }
  if (classes !== newCls) {
    document.body.className = newCls;
  }
}
function setColors(brand) {
  for (const color in brand) {
    setCssVar(color, brand[color]);
  }
}
var Body = {
  install(opts) {
    if (this.__installed === true) {
      return;
    }
    if (isRuntimeSsrPreHydration.value === true) {
      applyClientSsrCorrections();
    } else {
      const { $q } = opts;
      $q.config.brand !== void 0 && setColors($q.config.brand);
      const cls = getBodyClasses(client, $q.config);
      document.body.classList.add.apply(document.body.classList, cls);
    }
    if (client.is.ios === true) {
      document.body.addEventListener("touchstart", noop$1);
    }
    window.addEventListener("keydown", onKeyDownComposition, true);
  }
};
var materialIcons = {
  name: "material-icons",
  type: {
    positive: "check_circle",
    negative: "warning",
    info: "info",
    warning: "priority_high"
  },
  arrow: {
    up: "arrow_upward",
    right: "arrow_forward",
    down: "arrow_downward",
    left: "arrow_back",
    dropdown: "arrow_drop_down"
  },
  chevron: {
    left: "chevron_left",
    right: "chevron_right"
  },
  colorPicker: {
    spectrum: "gradient",
    tune: "tune",
    palette: "style"
  },
  pullToRefresh: {
    icon: "refresh"
  },
  carousel: {
    left: "chevron_left",
    right: "chevron_right",
    up: "keyboard_arrow_up",
    down: "keyboard_arrow_down",
    navigationIcon: "lens"
  },
  chip: {
    remove: "cancel",
    selected: "check"
  },
  datetime: {
    arrowLeft: "chevron_left",
    arrowRight: "chevron_right",
    now: "access_time",
    today: "today"
  },
  editor: {
    bold: "format_bold",
    italic: "format_italic",
    strikethrough: "strikethrough_s",
    underline: "format_underlined",
    unorderedList: "format_list_bulleted",
    orderedList: "format_list_numbered",
    subscript: "vertical_align_bottom",
    superscript: "vertical_align_top",
    hyperlink: "link",
    toggleFullscreen: "fullscreen",
    quote: "format_quote",
    left: "format_align_left",
    center: "format_align_center",
    right: "format_align_right",
    justify: "format_align_justify",
    print: "print",
    outdent: "format_indent_decrease",
    indent: "format_indent_increase",
    removeFormat: "format_clear",
    formatting: "text_format",
    fontSize: "format_size",
    align: "format_align_left",
    hr: "remove",
    undo: "undo",
    redo: "redo",
    heading: "format_size",
    code: "code",
    size: "format_size",
    font: "font_download",
    viewSource: "code"
  },
  expansionItem: {
    icon: "keyboard_arrow_down",
    denseIcon: "arrow_drop_down"
  },
  fab: {
    icon: "add",
    activeIcon: "close"
  },
  field: {
    clear: "cancel",
    error: "error"
  },
  pagination: {
    first: "first_page",
    prev: "keyboard_arrow_left",
    next: "keyboard_arrow_right",
    last: "last_page"
  },
  rating: {
    icon: "grade"
  },
  stepper: {
    done: "check",
    active: "edit",
    error: "warning"
  },
  tabs: {
    left: "chevron_left",
    right: "chevron_right",
    up: "keyboard_arrow_up",
    down: "keyboard_arrow_down"
  },
  table: {
    arrowUp: "arrow_upward",
    warning: "warning",
    firstPage: "first_page",
    prevPage: "chevron_left",
    nextPage: "chevron_right",
    lastPage: "last_page"
  },
  tree: {
    icon: "play_arrow"
  },
  uploader: {
    done: "done",
    clear: "clear",
    add: "add_box",
    upload: "cloud_upload",
    removeQueue: "clear_all",
    removeUploaded: "done_all"
  }
};
const Plugin = defineReactivePlugin({
  iconMapFn: null,
  __icons: {}
}, {
  set(setObject, ssrContext) {
    const def2 = { ...setObject, rtl: setObject.rtl === true };
    {
      def2.set = Plugin.set;
      Object.assign(Plugin.__icons, def2);
    }
  },
  install({ $q, iconSet, ssrContext }) {
    {
      if ($q.config.iconMapFn !== void 0) {
        this.iconMapFn = $q.config.iconMapFn;
      }
      $q.iconSet = this.__icons;
      injectProp($q, "iconMapFn", () => this.iconMapFn, (val) => {
        this.iconMapFn = val;
      });
      if (this.__installed === true) {
        iconSet !== void 0 && this.set(iconSet);
      } else {
        this.set(iconSet || materialIcons);
      }
    }
  }
});
const quasarKey = "_q_";
const layoutKey = "_q_l_";
const pageContainerKey = "_q_pc_";
const formKey = "_q_fo_";
const globalConfig = {};
let globalConfigIsFrozen = false;
function freezeGlobalConfig() {
  globalConfigIsFrozen = true;
}
function isObject(v) {
  return v !== null && typeof v === "object" && Array.isArray(v) !== true;
}
const autoInstalledPlugins = [
  Platform,
  Body,
  Plugin$2,
  Screen,
  History,
  Plugin$1,
  Plugin
];
function createChildApp(appCfg, parentApp) {
  const app2 = createApp(appCfg);
  app2.config.globalProperties = parentApp.config.globalProperties;
  const { reload, ...appContext } = parentApp._context;
  Object.assign(app2._context, appContext);
  return app2;
}
function installPlugins(pluginOpts, pluginList) {
  pluginList.forEach((Plugin2) => {
    Plugin2.install(pluginOpts);
    Plugin2.__installed = true;
  });
}
function prepareApp(app2, uiOpts, pluginOpts) {
  app2.config.globalProperties.$q = pluginOpts.$q;
  app2.provide(quasarKey, pluginOpts.$q);
  installPlugins(pluginOpts, autoInstalledPlugins);
  uiOpts.components !== void 0 && Object.values(uiOpts.components).forEach((c) => {
    if (isObject(c) === true && c.name !== void 0) {
      app2.component(c.name, c);
    }
  });
  uiOpts.directives !== void 0 && Object.values(uiOpts.directives).forEach((d) => {
    if (isObject(d) === true && d.name !== void 0) {
      app2.directive(d.name, d);
    }
  });
  uiOpts.plugins !== void 0 && installPlugins(pluginOpts, Object.values(uiOpts.plugins).filter((p2) => typeof p2.install === "function" && autoInstalledPlugins.includes(p2) === false));
  if (isRuntimeSsrPreHydration.value === true) {
    pluginOpts.$q.onSSRHydrated = () => {
      pluginOpts.onSSRHydrated.forEach((fn) => {
        fn();
      });
      pluginOpts.$q.onSSRHydrated = () => {
      };
    };
  }
}
var installQuasar = function(parentApp, opts = {}) {
  const $q = { version: "2.7.4" };
  if (globalConfigIsFrozen === false) {
    if (opts.config !== void 0) {
      Object.assign(globalConfig, opts.config);
    }
    $q.config = { ...globalConfig };
    freezeGlobalConfig();
  } else {
    $q.config = opts.config || {};
  }
  prepareApp(parentApp, opts, {
    parentApp,
    $q,
    lang: opts.lang,
    iconSet: opts.iconSet,
    onSSRHydrated: []
  });
};
var Quasar = {
  version: "2.7.4",
  install: installQuasar,
  lang: Plugin$1,
  iconSet: Plugin
};
function useQuasar() {
  return inject(quasarKey);
}
var _export_sfc = (sfc, props) => {
  const target2 = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target2[key] = val;
  }
  return target2;
};
const _sfc_main = defineComponent({
  name: "App",
  setup() {
    useQuasar();
    onMounted(() => {
      console.warn();
    });
  }
});
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_router_view = resolveComponent("router-view");
  return openBlock(), createBlock(_component_router_view);
}
var RootComponent = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "App.vue"]]);
function boot(callback) {
  return callback;
}
function route(callback) {
  return callback;
}
function store(callback) {
  return callback;
}
var isVue2 = false;
function getDevtoolsGlobalHook() {
  return getTarget().__VUE_DEVTOOLS_GLOBAL_HOOK__;
}
function getTarget() {
  return typeof navigator !== "undefined" && typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {};
}
const isProxyAvailable = typeof Proxy === "function";
const HOOK_SETUP = "devtools-plugin:setup";
const HOOK_PLUGIN_SETTINGS_SET = "plugin:settings:set";
let supported;
let perf;
function isPerformanceSupported() {
  var _a;
  if (supported !== void 0) {
    return supported;
  }
  if (typeof window !== "undefined" && window.performance) {
    supported = true;
    perf = window.performance;
  } else if (typeof global !== "undefined" && ((_a = global.perf_hooks) === null || _a === void 0 ? void 0 : _a.performance)) {
    supported = true;
    perf = global.perf_hooks.performance;
  } else {
    supported = false;
  }
  return supported;
}
function now() {
  return isPerformanceSupported() ? perf.now() : Date.now();
}
class ApiProxy {
  constructor(plugin, hook) {
    this.target = null;
    this.targetQueue = [];
    this.onQueue = [];
    this.plugin = plugin;
    this.hook = hook;
    const defaultSettings = {};
    if (plugin.settings) {
      for (const id in plugin.settings) {
        const item = plugin.settings[id];
        defaultSettings[id] = item.defaultValue;
      }
    }
    const localSettingsSaveId = `__vue-devtools-plugin-settings__${plugin.id}`;
    let currentSettings = Object.assign({}, defaultSettings);
    try {
      const raw = localStorage.getItem(localSettingsSaveId);
      const data = JSON.parse(raw);
      Object.assign(currentSettings, data);
    } catch (e) {
    }
    this.fallbacks = {
      getSettings() {
        return currentSettings;
      },
      setSettings(value) {
        try {
          localStorage.setItem(localSettingsSaveId, JSON.stringify(value));
        } catch (e) {
        }
        currentSettings = value;
      },
      now() {
        return now();
      }
    };
    if (hook) {
      hook.on(HOOK_PLUGIN_SETTINGS_SET, (pluginId, value) => {
        if (pluginId === this.plugin.id) {
          this.fallbacks.setSettings(value);
        }
      });
    }
    this.proxiedOn = new Proxy({}, {
      get: (_target, prop) => {
        if (this.target) {
          return this.target.on[prop];
        } else {
          return (...args) => {
            this.onQueue.push({
              method: prop,
              args
            });
          };
        }
      }
    });
    this.proxiedTarget = new Proxy({}, {
      get: (_target, prop) => {
        if (this.target) {
          return this.target[prop];
        } else if (prop === "on") {
          return this.proxiedOn;
        } else if (Object.keys(this.fallbacks).includes(prop)) {
          return (...args) => {
            this.targetQueue.push({
              method: prop,
              args,
              resolve: () => {
              }
            });
            return this.fallbacks[prop](...args);
          };
        } else {
          return (...args) => {
            return new Promise((resolve2) => {
              this.targetQueue.push({
                method: prop,
                args,
                resolve: resolve2
              });
            });
          };
        }
      }
    });
  }
  async setRealTarget(target2) {
    this.target = target2;
    for (const item of this.onQueue) {
      this.target.on[item.method](...item.args);
    }
    for (const item of this.targetQueue) {
      item.resolve(await this.target[item.method](...item.args));
    }
  }
}
function setupDevtoolsPlugin(pluginDescriptor, setupFn) {
  const descriptor = pluginDescriptor;
  const target2 = getTarget();
  const hook = getDevtoolsGlobalHook();
  const enableProxy = isProxyAvailable && descriptor.enableEarlyProxy;
  if (hook && (target2.__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__ || !enableProxy)) {
    hook.emit(HOOK_SETUP, pluginDescriptor, setupFn);
  } else {
    const proxy = enableProxy ? new ApiProxy(descriptor, hook) : null;
    const list = target2.__VUE_DEVTOOLS_PLUGINS__ = target2.__VUE_DEVTOOLS_PLUGINS__ || [];
    list.push({
      pluginDescriptor: descriptor,
      setupFn,
      proxy
    });
    if (proxy)
      setupFn(proxy.proxiedTarget);
  }
}
/*!
  * pinia v2.0.14
  * (c) 2022 Eduardo San Martin Morote
  * @license MIT
  */
const setActivePinia = (pinia) => pinia;
const piniaSymbol = Symbol();
var MutationType;
(function(MutationType2) {
  MutationType2["direct"] = "direct";
  MutationType2["patchObject"] = "patch object";
  MutationType2["patchFunction"] = "patch function";
})(MutationType || (MutationType = {}));
function createPinia() {
  const scope = effectScope(true);
  const state = scope.run(() => ref({}));
  let _p = [];
  let toBeInstalled = [];
  const pinia = markRaw({
    install(app2) {
      setActivePinia(pinia);
      {
        pinia._a = app2;
        app2.provide(piniaSymbol, pinia);
        app2.config.globalProperties.$pinia = pinia;
        toBeInstalled.forEach((plugin) => _p.push(plugin));
        toBeInstalled = [];
      }
    },
    use(plugin) {
      if (!this._a && !isVue2) {
        toBeInstalled.push(plugin);
      } else {
        _p.push(plugin);
      }
      return this;
    },
    _p,
    _a: null,
    _e: scope,
    _s: /* @__PURE__ */ new Map(),
    state
  });
  return pinia;
}
var createStore = store(() => {
  const pinia = createPinia();
  return pinia;
});
/*!
  * vue-router v4.0.16
  * (c) 2022 Eduardo San Martin Morote
  * @license MIT
  */
const hasSymbol = typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol";
const PolySymbol = (name) => hasSymbol ? Symbol(name) : "_vr_" + name;
const matchedRouteKey = /* @__PURE__ */ PolySymbol("rvlm");
const viewDepthKey = /* @__PURE__ */ PolySymbol("rvd");
const routerKey = /* @__PURE__ */ PolySymbol("r");
const routeLocationKey = /* @__PURE__ */ PolySymbol("rl");
const routerViewLocationKey = /* @__PURE__ */ PolySymbol("rvl");
const isBrowser = typeof window !== "undefined";
function isESModule(obj) {
  return obj.__esModule || hasSymbol && obj[Symbol.toStringTag] === "Module";
}
const assign = Object.assign;
function applyToParams(fn, params) {
  const newParams = {};
  for (const key in params) {
    const value = params[key];
    newParams[key] = Array.isArray(value) ? value.map(fn) : fn(value);
  }
  return newParams;
}
const noop = () => {
};
const TRAILING_SLASH_RE = /\/$/;
const removeTrailingSlash = (path) => path.replace(TRAILING_SLASH_RE, "");
function parseURL(parseQuery2, location2, currentLocation = "/") {
  let path, query = {}, searchString = "", hash = "";
  const searchPos = location2.indexOf("?");
  const hashPos = location2.indexOf("#", searchPos > -1 ? searchPos : 0);
  if (searchPos > -1) {
    path = location2.slice(0, searchPos);
    searchString = location2.slice(searchPos + 1, hashPos > -1 ? hashPos : location2.length);
    query = parseQuery2(searchString);
  }
  if (hashPos > -1) {
    path = path || location2.slice(0, hashPos);
    hash = location2.slice(hashPos, location2.length);
  }
  path = resolveRelativePath(path != null ? path : location2, currentLocation);
  return {
    fullPath: path + (searchString && "?") + searchString + hash,
    path,
    query,
    hash
  };
}
function stringifyURL(stringifyQuery2, location2) {
  const query = location2.query ? stringifyQuery2(location2.query) : "";
  return location2.path + (query && "?") + query + (location2.hash || "");
}
function stripBase(pathname, base2) {
  if (!base2 || !pathname.toLowerCase().startsWith(base2.toLowerCase()))
    return pathname;
  return pathname.slice(base2.length) || "/";
}
function isSameRouteLocation(stringifyQuery2, a, b) {
  const aLastIndex = a.matched.length - 1;
  const bLastIndex = b.matched.length - 1;
  return aLastIndex > -1 && aLastIndex === bLastIndex && isSameRouteRecord$1(a.matched[aLastIndex], b.matched[bLastIndex]) && isSameRouteLocationParams$1(a.params, b.params) && stringifyQuery2(a.query) === stringifyQuery2(b.query) && a.hash === b.hash;
}
function isSameRouteRecord$1(a, b) {
  return (a.aliasOf || a) === (b.aliasOf || b);
}
function isSameRouteLocationParams$1(a, b) {
  if (Object.keys(a).length !== Object.keys(b).length)
    return false;
  for (const key in a) {
    if (!isSameRouteLocationParamsValue$1(a[key], b[key]))
      return false;
  }
  return true;
}
function isSameRouteLocationParamsValue$1(a, b) {
  return Array.isArray(a) ? isEquivalentArray$1(a, b) : Array.isArray(b) ? isEquivalentArray$1(b, a) : a === b;
}
function isEquivalentArray$1(a, b) {
  return Array.isArray(b) ? a.length === b.length && a.every((value, i) => value === b[i]) : a.length === 1 && a[0] === b;
}
function resolveRelativePath(to, from) {
  if (to.startsWith("/"))
    return to;
  if (!to)
    return from;
  const fromSegments = from.split("/");
  const toSegments = to.split("/");
  let position2 = fromSegments.length - 1;
  let toPosition;
  let segment;
  for (toPosition = 0; toPosition < toSegments.length; toPosition++) {
    segment = toSegments[toPosition];
    if (position2 === 1 || segment === ".")
      continue;
    if (segment === "..")
      position2--;
    else
      break;
  }
  return fromSegments.slice(0, position2).join("/") + "/" + toSegments.slice(toPosition - (toPosition === toSegments.length ? 1 : 0)).join("/");
}
var NavigationType;
(function(NavigationType2) {
  NavigationType2["pop"] = "pop";
  NavigationType2["push"] = "push";
})(NavigationType || (NavigationType = {}));
var NavigationDirection;
(function(NavigationDirection2) {
  NavigationDirection2["back"] = "back";
  NavigationDirection2["forward"] = "forward";
  NavigationDirection2["unknown"] = "";
})(NavigationDirection || (NavigationDirection = {}));
function normalizeBase(base2) {
  if (!base2) {
    if (isBrowser) {
      const baseEl = document.querySelector("base");
      base2 = baseEl && baseEl.getAttribute("href") || "/";
      base2 = base2.replace(/^\w+:\/\/[^\/]+/, "");
    } else {
      base2 = "/";
    }
  }
  if (base2[0] !== "/" && base2[0] !== "#")
    base2 = "/" + base2;
  return removeTrailingSlash(base2);
}
const BEFORE_HASH_RE = /^[^#]+#/;
function createHref(base2, location2) {
  return base2.replace(BEFORE_HASH_RE, "#") + location2;
}
function getElementPosition(el, offset) {
  const docRect = document.documentElement.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  return {
    behavior: offset.behavior,
    left: elRect.left - docRect.left - (offset.left || 0),
    top: elRect.top - docRect.top - (offset.top || 0)
  };
}
const computeScrollPosition = () => ({
  left: window.pageXOffset,
  top: window.pageYOffset
});
function scrollToPosition(position2) {
  let scrollToOptions;
  if ("el" in position2) {
    const positionEl = position2.el;
    const isIdSelector = typeof positionEl === "string" && positionEl.startsWith("#");
    const el = typeof positionEl === "string" ? isIdSelector ? document.getElementById(positionEl.slice(1)) : document.querySelector(positionEl) : positionEl;
    if (!el) {
      return;
    }
    scrollToOptions = getElementPosition(el, position2);
  } else {
    scrollToOptions = position2;
  }
  if ("scrollBehavior" in document.documentElement.style)
    window.scrollTo(scrollToOptions);
  else {
    window.scrollTo(scrollToOptions.left != null ? scrollToOptions.left : window.pageXOffset, scrollToOptions.top != null ? scrollToOptions.top : window.pageYOffset);
  }
}
function getScrollKey(path, delta) {
  const position2 = history.state ? history.state.position - delta : -1;
  return position2 + path;
}
const scrollPositions = /* @__PURE__ */ new Map();
function saveScrollPosition(key, scrollPosition) {
  scrollPositions.set(key, scrollPosition);
}
function getSavedScrollPosition(key) {
  const scroll = scrollPositions.get(key);
  scrollPositions.delete(key);
  return scroll;
}
let createBaseLocation = () => location.protocol + "//" + location.host;
function createCurrentLocation(base2, location2) {
  const { pathname, search, hash } = location2;
  const hashPos = base2.indexOf("#");
  if (hashPos > -1) {
    let slicePos = hash.includes(base2.slice(hashPos)) ? base2.slice(hashPos).length : 1;
    let pathFromHash = hash.slice(slicePos);
    if (pathFromHash[0] !== "/")
      pathFromHash = "/" + pathFromHash;
    return stripBase(pathFromHash, "");
  }
  const path = stripBase(pathname, base2);
  return path + search + hash;
}
function useHistoryListeners(base2, historyState, currentLocation, replace) {
  let listeners = [];
  let teardowns = [];
  let pauseState = null;
  const popStateHandler = ({ state }) => {
    const to = createCurrentLocation(base2, location);
    const from = currentLocation.value;
    const fromState = historyState.value;
    let delta = 0;
    if (state) {
      currentLocation.value = to;
      historyState.value = state;
      if (pauseState && pauseState === from) {
        pauseState = null;
        return;
      }
      delta = fromState ? state.position - fromState.position : 0;
    } else {
      replace(to);
    }
    listeners.forEach((listener) => {
      listener(currentLocation.value, from, {
        delta,
        type: NavigationType.pop,
        direction: delta ? delta > 0 ? NavigationDirection.forward : NavigationDirection.back : NavigationDirection.unknown
      });
    });
  };
  function pauseListeners() {
    pauseState = currentLocation.value;
  }
  function listen(callback) {
    listeners.push(callback);
    const teardown = () => {
      const index = listeners.indexOf(callback);
      if (index > -1)
        listeners.splice(index, 1);
    };
    teardowns.push(teardown);
    return teardown;
  }
  function beforeUnloadListener() {
    const { history: history2 } = window;
    if (!history2.state)
      return;
    history2.replaceState(assign({}, history2.state, { scroll: computeScrollPosition() }), "");
  }
  function destroy() {
    for (const teardown of teardowns)
      teardown();
    teardowns = [];
    window.removeEventListener("popstate", popStateHandler);
    window.removeEventListener("beforeunload", beforeUnloadListener);
  }
  window.addEventListener("popstate", popStateHandler);
  window.addEventListener("beforeunload", beforeUnloadListener);
  return {
    pauseListeners,
    listen,
    destroy
  };
}
function buildState(back, current, forward, replaced = false, computeScroll = false) {
  return {
    back,
    current,
    forward,
    replaced,
    position: window.history.length,
    scroll: computeScroll ? computeScrollPosition() : null
  };
}
function useHistoryStateNavigation(base2) {
  const { history: history2, location: location2 } = window;
  const currentLocation = {
    value: createCurrentLocation(base2, location2)
  };
  const historyState = { value: history2.state };
  if (!historyState.value) {
    changeLocation(currentLocation.value, {
      back: null,
      current: currentLocation.value,
      forward: null,
      position: history2.length - 1,
      replaced: true,
      scroll: null
    }, true);
  }
  function changeLocation(to, state, replace2) {
    const hashIndex = base2.indexOf("#");
    const url = hashIndex > -1 ? (location2.host && document.querySelector("base") ? base2 : base2.slice(hashIndex)) + to : createBaseLocation() + base2 + to;
    try {
      history2[replace2 ? "replaceState" : "pushState"](state, "", url);
      historyState.value = state;
    } catch (err) {
      {
        console.error(err);
      }
      location2[replace2 ? "replace" : "assign"](url);
    }
  }
  function replace(to, data) {
    const state = assign({}, history2.state, buildState(historyState.value.back, to, historyState.value.forward, true), data, { position: historyState.value.position });
    changeLocation(to, state, true);
    currentLocation.value = to;
  }
  function push(to, data) {
    const currentState = assign({}, historyState.value, history2.state, {
      forward: to,
      scroll: computeScrollPosition()
    });
    changeLocation(currentState.current, currentState, true);
    const state = assign({}, buildState(currentLocation.value, to, null), { position: currentState.position + 1 }, data);
    changeLocation(to, state, false);
    currentLocation.value = to;
  }
  return {
    location: currentLocation,
    state: historyState,
    push,
    replace
  };
}
function createWebHistory(base2) {
  base2 = normalizeBase(base2);
  const historyNavigation = useHistoryStateNavigation(base2);
  const historyListeners = useHistoryListeners(base2, historyNavigation.state, historyNavigation.location, historyNavigation.replace);
  function go(delta, triggerListeners = true) {
    if (!triggerListeners)
      historyListeners.pauseListeners();
    history.go(delta);
  }
  const routerHistory = assign({
    location: "",
    base: base2,
    go,
    createHref: createHref.bind(null, base2)
  }, historyNavigation, historyListeners);
  Object.defineProperty(routerHistory, "location", {
    enumerable: true,
    get: () => historyNavigation.location.value
  });
  Object.defineProperty(routerHistory, "state", {
    enumerable: true,
    get: () => historyNavigation.state.value
  });
  return routerHistory;
}
function isRouteLocation(route2) {
  return typeof route2 === "string" || route2 && typeof route2 === "object";
}
function isRouteName(name) {
  return typeof name === "string" || typeof name === "symbol";
}
const START_LOCATION_NORMALIZED = {
  path: "/",
  name: void 0,
  params: {},
  query: {},
  hash: "",
  fullPath: "/",
  matched: [],
  meta: {},
  redirectedFrom: void 0
};
const NavigationFailureSymbol = /* @__PURE__ */ PolySymbol("nf");
var NavigationFailureType;
(function(NavigationFailureType2) {
  NavigationFailureType2[NavigationFailureType2["aborted"] = 4] = "aborted";
  NavigationFailureType2[NavigationFailureType2["cancelled"] = 8] = "cancelled";
  NavigationFailureType2[NavigationFailureType2["duplicated"] = 16] = "duplicated";
})(NavigationFailureType || (NavigationFailureType = {}));
function createRouterError(type, params) {
  {
    return assign(new Error(), {
      type,
      [NavigationFailureSymbol]: true
    }, params);
  }
}
function isNavigationFailure(error, type) {
  return error instanceof Error && NavigationFailureSymbol in error && (type == null || !!(error.type & type));
}
const BASE_PARAM_PATTERN = "[^/]+?";
const BASE_PATH_PARSER_OPTIONS = {
  sensitive: false,
  strict: false,
  start: true,
  end: true
};
const REGEX_CHARS_RE = /[.+*?^${}()[\]/\\]/g;
function tokensToParser(segments, extraOptions) {
  const options = assign({}, BASE_PATH_PARSER_OPTIONS, extraOptions);
  const score = [];
  let pattern = options.start ? "^" : "";
  const keys = [];
  for (const segment of segments) {
    const segmentScores = segment.length ? [] : [90];
    if (options.strict && !segment.length)
      pattern += "/";
    for (let tokenIndex = 0; tokenIndex < segment.length; tokenIndex++) {
      const token = segment[tokenIndex];
      let subSegmentScore = 40 + (options.sensitive ? 0.25 : 0);
      if (token.type === 0) {
        if (!tokenIndex)
          pattern += "/";
        pattern += token.value.replace(REGEX_CHARS_RE, "\\$&");
        subSegmentScore += 40;
      } else if (token.type === 1) {
        const { value, repeatable, optional, regexp } = token;
        keys.push({
          name: value,
          repeatable,
          optional
        });
        const re2 = regexp ? regexp : BASE_PARAM_PATTERN;
        if (re2 !== BASE_PARAM_PATTERN) {
          subSegmentScore += 10;
          try {
            new RegExp(`(${re2})`);
          } catch (err) {
            throw new Error(`Invalid custom RegExp for param "${value}" (${re2}): ` + err.message);
          }
        }
        let subPattern = repeatable ? `((?:${re2})(?:/(?:${re2}))*)` : `(${re2})`;
        if (!tokenIndex)
          subPattern = optional && segment.length < 2 ? `(?:/${subPattern})` : "/" + subPattern;
        if (optional)
          subPattern += "?";
        pattern += subPattern;
        subSegmentScore += 20;
        if (optional)
          subSegmentScore += -8;
        if (repeatable)
          subSegmentScore += -20;
        if (re2 === ".*")
          subSegmentScore += -50;
      }
      segmentScores.push(subSegmentScore);
    }
    score.push(segmentScores);
  }
  if (options.strict && options.end) {
    const i = score.length - 1;
    score[i][score[i].length - 1] += 0.7000000000000001;
  }
  if (!options.strict)
    pattern += "/?";
  if (options.end)
    pattern += "$";
  else if (options.strict)
    pattern += "(?:/|$)";
  const re = new RegExp(pattern, options.sensitive ? "" : "i");
  function parse(path) {
    const match = path.match(re);
    const params = {};
    if (!match)
      return null;
    for (let i = 1; i < match.length; i++) {
      const value = match[i] || "";
      const key = keys[i - 1];
      params[key.name] = value && key.repeatable ? value.split("/") : value;
    }
    return params;
  }
  function stringify(params) {
    let path = "";
    let avoidDuplicatedSlash = false;
    for (const segment of segments) {
      if (!avoidDuplicatedSlash || !path.endsWith("/"))
        path += "/";
      avoidDuplicatedSlash = false;
      for (const token of segment) {
        if (token.type === 0) {
          path += token.value;
        } else if (token.type === 1) {
          const { value, repeatable, optional } = token;
          const param = value in params ? params[value] : "";
          if (Array.isArray(param) && !repeatable)
            throw new Error(`Provided param "${value}" is an array but it is not repeatable (* or + modifiers)`);
          const text = Array.isArray(param) ? param.join("/") : param;
          if (!text) {
            if (optional) {
              if (segment.length < 2 && segments.length > 1) {
                if (path.endsWith("/"))
                  path = path.slice(0, -1);
                else
                  avoidDuplicatedSlash = true;
              }
            } else
              throw new Error(`Missing required param "${value}"`);
          }
          path += text;
        }
      }
    }
    return path;
  }
  return {
    re,
    score,
    keys,
    parse,
    stringify
  };
}
function compareScoreArray(a, b) {
  let i = 0;
  while (i < a.length && i < b.length) {
    const diff = b[i] - a[i];
    if (diff)
      return diff;
    i++;
  }
  if (a.length < b.length) {
    return a.length === 1 && a[0] === 40 + 40 ? -1 : 1;
  } else if (a.length > b.length) {
    return b.length === 1 && b[0] === 40 + 40 ? 1 : -1;
  }
  return 0;
}
function comparePathParserScore(a, b) {
  let i = 0;
  const aScore = a.score;
  const bScore = b.score;
  while (i < aScore.length && i < bScore.length) {
    const comp = compareScoreArray(aScore[i], bScore[i]);
    if (comp)
      return comp;
    i++;
  }
  if (Math.abs(bScore.length - aScore.length) === 1) {
    if (isLastScoreNegative(aScore))
      return 1;
    if (isLastScoreNegative(bScore))
      return -1;
  }
  return bScore.length - aScore.length;
}
function isLastScoreNegative(score) {
  const last = score[score.length - 1];
  return score.length > 0 && last[last.length - 1] < 0;
}
const ROOT_TOKEN = {
  type: 0,
  value: ""
};
const VALID_PARAM_RE = /[a-zA-Z0-9_]/;
function tokenizePath(path) {
  if (!path)
    return [[]];
  if (path === "/")
    return [[ROOT_TOKEN]];
  if (!path.startsWith("/")) {
    throw new Error(`Invalid path "${path}"`);
  }
  function crash(message) {
    throw new Error(`ERR (${state})/"${buffer2}": ${message}`);
  }
  let state = 0;
  let previousState = state;
  const tokens = [];
  let segment;
  function finalizeSegment() {
    if (segment)
      tokens.push(segment);
    segment = [];
  }
  let i = 0;
  let char;
  let buffer2 = "";
  let customRe = "";
  function consumeBuffer() {
    if (!buffer2)
      return;
    if (state === 0) {
      segment.push({
        type: 0,
        value: buffer2
      });
    } else if (state === 1 || state === 2 || state === 3) {
      if (segment.length > 1 && (char === "*" || char === "+"))
        crash(`A repeatable param (${buffer2}) must be alone in its segment. eg: '/:ids+.`);
      segment.push({
        type: 1,
        value: buffer2,
        regexp: customRe,
        repeatable: char === "*" || char === "+",
        optional: char === "*" || char === "?"
      });
    } else {
      crash("Invalid state to consume buffer");
    }
    buffer2 = "";
  }
  function addCharToBuffer() {
    buffer2 += char;
  }
  while (i < path.length) {
    char = path[i++];
    if (char === "\\" && state !== 2) {
      previousState = state;
      state = 4;
      continue;
    }
    switch (state) {
      case 0:
        if (char === "/") {
          if (buffer2) {
            consumeBuffer();
          }
          finalizeSegment();
        } else if (char === ":") {
          consumeBuffer();
          state = 1;
        } else {
          addCharToBuffer();
        }
        break;
      case 4:
        addCharToBuffer();
        state = previousState;
        break;
      case 1:
        if (char === "(") {
          state = 2;
        } else if (VALID_PARAM_RE.test(char)) {
          addCharToBuffer();
        } else {
          consumeBuffer();
          state = 0;
          if (char !== "*" && char !== "?" && char !== "+")
            i--;
        }
        break;
      case 2:
        if (char === ")") {
          if (customRe[customRe.length - 1] == "\\")
            customRe = customRe.slice(0, -1) + char;
          else
            state = 3;
        } else {
          customRe += char;
        }
        break;
      case 3:
        consumeBuffer();
        state = 0;
        if (char !== "*" && char !== "?" && char !== "+")
          i--;
        customRe = "";
        break;
      default:
        crash("Unknown state");
        break;
    }
  }
  if (state === 2)
    crash(`Unfinished custom RegExp for param "${buffer2}"`);
  consumeBuffer();
  finalizeSegment();
  return tokens;
}
function createRouteRecordMatcher(record, parent, options) {
  const parser = tokensToParser(tokenizePath(record.path), options);
  const matcher = assign(parser, {
    record,
    parent,
    children: [],
    alias: []
  });
  if (parent) {
    if (!matcher.record.aliasOf === !parent.record.aliasOf)
      parent.children.push(matcher);
  }
  return matcher;
}
function createRouterMatcher(routes2, globalOptions) {
  const matchers = [];
  const matcherMap = /* @__PURE__ */ new Map();
  globalOptions = mergeOptions({ strict: false, end: true, sensitive: false }, globalOptions);
  function getRecordMatcher(name) {
    return matcherMap.get(name);
  }
  function addRoute(record, parent, originalRecord) {
    const isRootAdd = !originalRecord;
    const mainNormalizedRecord = normalizeRouteRecord(record);
    mainNormalizedRecord.aliasOf = originalRecord && originalRecord.record;
    const options = mergeOptions(globalOptions, record);
    const normalizedRecords = [
      mainNormalizedRecord
    ];
    if ("alias" in record) {
      const aliases = typeof record.alias === "string" ? [record.alias] : record.alias;
      for (const alias of aliases) {
        normalizedRecords.push(assign({}, mainNormalizedRecord, {
          components: originalRecord ? originalRecord.record.components : mainNormalizedRecord.components,
          path: alias,
          aliasOf: originalRecord ? originalRecord.record : mainNormalizedRecord
        }));
      }
    }
    let matcher;
    let originalMatcher;
    for (const normalizedRecord of normalizedRecords) {
      const { path } = normalizedRecord;
      if (parent && path[0] !== "/") {
        const parentPath = parent.record.path;
        const connectingSlash = parentPath[parentPath.length - 1] === "/" ? "" : "/";
        normalizedRecord.path = parent.record.path + (path && connectingSlash + path);
      }
      matcher = createRouteRecordMatcher(normalizedRecord, parent, options);
      if (originalRecord) {
        originalRecord.alias.push(matcher);
      } else {
        originalMatcher = originalMatcher || matcher;
        if (originalMatcher !== matcher)
          originalMatcher.alias.push(matcher);
        if (isRootAdd && record.name && !isAliasRecord(matcher))
          removeRoute(record.name);
      }
      if ("children" in mainNormalizedRecord) {
        const children = mainNormalizedRecord.children;
        for (let i = 0; i < children.length; i++) {
          addRoute(children[i], matcher, originalRecord && originalRecord.children[i]);
        }
      }
      originalRecord = originalRecord || matcher;
      insertMatcher(matcher);
    }
    return originalMatcher ? () => {
      removeRoute(originalMatcher);
    } : noop;
  }
  function removeRoute(matcherRef) {
    if (isRouteName(matcherRef)) {
      const matcher = matcherMap.get(matcherRef);
      if (matcher) {
        matcherMap.delete(matcherRef);
        matchers.splice(matchers.indexOf(matcher), 1);
        matcher.children.forEach(removeRoute);
        matcher.alias.forEach(removeRoute);
      }
    } else {
      const index = matchers.indexOf(matcherRef);
      if (index > -1) {
        matchers.splice(index, 1);
        if (matcherRef.record.name)
          matcherMap.delete(matcherRef.record.name);
        matcherRef.children.forEach(removeRoute);
        matcherRef.alias.forEach(removeRoute);
      }
    }
  }
  function getRoutes() {
    return matchers;
  }
  function insertMatcher(matcher) {
    let i = 0;
    while (i < matchers.length && comparePathParserScore(matcher, matchers[i]) >= 0 && (matcher.record.path !== matchers[i].record.path || !isRecordChildOf(matcher, matchers[i])))
      i++;
    matchers.splice(i, 0, matcher);
    if (matcher.record.name && !isAliasRecord(matcher))
      matcherMap.set(matcher.record.name, matcher);
  }
  function resolve2(location2, currentLocation) {
    let matcher;
    let params = {};
    let path;
    let name;
    if ("name" in location2 && location2.name) {
      matcher = matcherMap.get(location2.name);
      if (!matcher)
        throw createRouterError(1, {
          location: location2
        });
      name = matcher.record.name;
      params = assign(paramsFromLocation(currentLocation.params, matcher.keys.filter((k) => !k.optional).map((k) => k.name)), location2.params);
      path = matcher.stringify(params);
    } else if ("path" in location2) {
      path = location2.path;
      matcher = matchers.find((m) => m.re.test(path));
      if (matcher) {
        params = matcher.parse(path);
        name = matcher.record.name;
      }
    } else {
      matcher = currentLocation.name ? matcherMap.get(currentLocation.name) : matchers.find((m) => m.re.test(currentLocation.path));
      if (!matcher)
        throw createRouterError(1, {
          location: location2,
          currentLocation
        });
      name = matcher.record.name;
      params = assign({}, currentLocation.params, location2.params);
      path = matcher.stringify(params);
    }
    const matched = [];
    let parentMatcher = matcher;
    while (parentMatcher) {
      matched.unshift(parentMatcher.record);
      parentMatcher = parentMatcher.parent;
    }
    return {
      name,
      path,
      params,
      matched,
      meta: mergeMetaFields(matched)
    };
  }
  routes2.forEach((route2) => addRoute(route2));
  return { addRoute, resolve: resolve2, removeRoute, getRoutes, getRecordMatcher };
}
function paramsFromLocation(params, keys) {
  const newParams = {};
  for (const key of keys) {
    if (key in params)
      newParams[key] = params[key];
  }
  return newParams;
}
function normalizeRouteRecord(record) {
  return {
    path: record.path,
    redirect: record.redirect,
    name: record.name,
    meta: record.meta || {},
    aliasOf: void 0,
    beforeEnter: record.beforeEnter,
    props: normalizeRecordProps(record),
    children: record.children || [],
    instances: {},
    leaveGuards: /* @__PURE__ */ new Set(),
    updateGuards: /* @__PURE__ */ new Set(),
    enterCallbacks: {},
    components: "components" in record ? record.components || {} : { default: record.component }
  };
}
function normalizeRecordProps(record) {
  const propsObject = {};
  const props = record.props || false;
  if ("component" in record) {
    propsObject.default = props;
  } else {
    for (const name in record.components)
      propsObject[name] = typeof props === "boolean" ? props : props[name];
  }
  return propsObject;
}
function isAliasRecord(record) {
  while (record) {
    if (record.record.aliasOf)
      return true;
    record = record.parent;
  }
  return false;
}
function mergeMetaFields(matched) {
  return matched.reduce((meta, record) => assign(meta, record.meta), {});
}
function mergeOptions(defaults, partialOptions) {
  const options = {};
  for (const key in defaults) {
    options[key] = key in partialOptions ? partialOptions[key] : defaults[key];
  }
  return options;
}
function isRecordChildOf(record, parent) {
  return parent.children.some((child) => child === record || isRecordChildOf(record, child));
}
const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const IM_RE = /\?/g;
const PLUS_RE = /\+/g;
const ENC_BRACKET_OPEN_RE = /%5B/g;
const ENC_BRACKET_CLOSE_RE = /%5D/g;
const ENC_CARET_RE = /%5E/g;
const ENC_BACKTICK_RE = /%60/g;
const ENC_CURLY_OPEN_RE = /%7B/g;
const ENC_PIPE_RE = /%7C/g;
const ENC_CURLY_CLOSE_RE = /%7D/g;
const ENC_SPACE_RE = /%20/g;
function commonEncode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|").replace(ENC_BRACKET_OPEN_RE, "[").replace(ENC_BRACKET_CLOSE_RE, "]");
}
function encodeHash(text) {
  return commonEncode(text).replace(ENC_CURLY_OPEN_RE, "{").replace(ENC_CURLY_CLOSE_RE, "}").replace(ENC_CARET_RE, "^");
}
function encodeQueryValue(text) {
  return commonEncode(text).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CURLY_OPEN_RE, "{").replace(ENC_CURLY_CLOSE_RE, "}").replace(ENC_CARET_RE, "^");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function encodePath(text) {
  return commonEncode(text).replace(HASH_RE, "%23").replace(IM_RE, "%3F");
}
function encodeParam(text) {
  return text == null ? "" : encodePath(text).replace(SLASH_RE, "%2F");
}
function decode(text) {
  try {
    return decodeURIComponent("" + text);
  } catch (err) {
  }
  return "" + text;
}
function parseQuery(search) {
  const query = {};
  if (search === "" || search === "?")
    return query;
  const hasLeadingIM = search[0] === "?";
  const searchParams = (hasLeadingIM ? search.slice(1) : search).split("&");
  for (let i = 0; i < searchParams.length; ++i) {
    const searchParam = searchParams[i].replace(PLUS_RE, " ");
    const eqPos = searchParam.indexOf("=");
    const key = decode(eqPos < 0 ? searchParam : searchParam.slice(0, eqPos));
    const value = eqPos < 0 ? null : decode(searchParam.slice(eqPos + 1));
    if (key in query) {
      let currentValue = query[key];
      if (!Array.isArray(currentValue)) {
        currentValue = query[key] = [currentValue];
      }
      currentValue.push(value);
    } else {
      query[key] = value;
    }
  }
  return query;
}
function stringifyQuery(query) {
  let search = "";
  for (let key in query) {
    const value = query[key];
    key = encodeQueryKey(key);
    if (value == null) {
      if (value !== void 0) {
        search += (search.length ? "&" : "") + key;
      }
      continue;
    }
    const values = Array.isArray(value) ? value.map((v) => v && encodeQueryValue(v)) : [value && encodeQueryValue(value)];
    values.forEach((value2) => {
      if (value2 !== void 0) {
        search += (search.length ? "&" : "") + key;
        if (value2 != null)
          search += "=" + value2;
      }
    });
  }
  return search;
}
function normalizeQuery(query) {
  const normalizedQuery = {};
  for (const key in query) {
    const value = query[key];
    if (value !== void 0) {
      normalizedQuery[key] = Array.isArray(value) ? value.map((v) => v == null ? null : "" + v) : value == null ? value : "" + value;
    }
  }
  return normalizedQuery;
}
function useCallbacks() {
  let handlers2 = [];
  function add2(handler) {
    handlers2.push(handler);
    return () => {
      const i = handlers2.indexOf(handler);
      if (i > -1)
        handlers2.splice(i, 1);
    };
  }
  function reset2() {
    handlers2 = [];
  }
  return {
    add: add2,
    list: () => handlers2,
    reset: reset2
  };
}
function guardToPromiseFn(guard, to, from, record, name) {
  const enterCallbackArray = record && (record.enterCallbacks[name] = record.enterCallbacks[name] || []);
  return () => new Promise((resolve2, reject) => {
    const next = (valid) => {
      if (valid === false)
        reject(createRouterError(4, {
          from,
          to
        }));
      else if (valid instanceof Error) {
        reject(valid);
      } else if (isRouteLocation(valid)) {
        reject(createRouterError(2, {
          from: to,
          to: valid
        }));
      } else {
        if (enterCallbackArray && record.enterCallbacks[name] === enterCallbackArray && typeof valid === "function")
          enterCallbackArray.push(valid);
        resolve2();
      }
    };
    const guardReturn = guard.call(record && record.instances[name], to, from, next);
    let guardCall = Promise.resolve(guardReturn);
    if (guard.length < 3)
      guardCall = guardCall.then(next);
    guardCall.catch((err) => reject(err));
  });
}
function extractComponentsGuards(matched, guardType, to, from) {
  const guards = [];
  for (const record of matched) {
    for (const name in record.components) {
      let rawComponent = record.components[name];
      if (guardType !== "beforeRouteEnter" && !record.instances[name])
        continue;
      if (isRouteComponent(rawComponent)) {
        const options = rawComponent.__vccOpts || rawComponent;
        const guard = options[guardType];
        guard && guards.push(guardToPromiseFn(guard, to, from, record, name));
      } else {
        let componentPromise = rawComponent();
        guards.push(() => componentPromise.then((resolved) => {
          if (!resolved)
            return Promise.reject(new Error(`Couldn't resolve component "${name}" at "${record.path}"`));
          const resolvedComponent = isESModule(resolved) ? resolved.default : resolved;
          record.components[name] = resolvedComponent;
          const options = resolvedComponent.__vccOpts || resolvedComponent;
          const guard = options[guardType];
          return guard && guardToPromiseFn(guard, to, from, record, name)();
        }));
      }
    }
  }
  return guards;
}
function isRouteComponent(component) {
  return typeof component === "object" || "displayName" in component || "props" in component || "__vccOpts" in component;
}
function useLink(props) {
  const router = inject(routerKey);
  const currentRoute = inject(routeLocationKey);
  const route2 = computed(() => router.resolve(unref(props.to)));
  const activeRecordIndex = computed(() => {
    const { matched } = route2.value;
    const { length } = matched;
    const routeMatched = matched[length - 1];
    const currentMatched = currentRoute.matched;
    if (!routeMatched || !currentMatched.length)
      return -1;
    const index = currentMatched.findIndex(isSameRouteRecord$1.bind(null, routeMatched));
    if (index > -1)
      return index;
    const parentRecordPath = getOriginalPath$1(matched[length - 2]);
    return length > 1 && getOriginalPath$1(routeMatched) === parentRecordPath && currentMatched[currentMatched.length - 1].path !== parentRecordPath ? currentMatched.findIndex(isSameRouteRecord$1.bind(null, matched[length - 2])) : index;
  });
  const isActive = computed(() => activeRecordIndex.value > -1 && includesParams$1(currentRoute.params, route2.value.params));
  const isExactActive = computed(() => activeRecordIndex.value > -1 && activeRecordIndex.value === currentRoute.matched.length - 1 && isSameRouteLocationParams$1(currentRoute.params, route2.value.params));
  function navigate(e = {}) {
    if (guardEvent(e)) {
      return router[unref(props.replace) ? "replace" : "push"](unref(props.to)).catch(noop);
    }
    return Promise.resolve();
  }
  if (isBrowser) {
    const instance = getCurrentInstance();
    if (instance) {
      const linkContextDevtools = {
        route: route2.value,
        isActive: isActive.value,
        isExactActive: isExactActive.value
      };
      instance.__vrl_devtools = instance.__vrl_devtools || [];
      instance.__vrl_devtools.push(linkContextDevtools);
      watchEffect(() => {
        linkContextDevtools.route = route2.value;
        linkContextDevtools.isActive = isActive.value;
        linkContextDevtools.isExactActive = isExactActive.value;
      }, { flush: "post" });
    }
  }
  return {
    route: route2,
    href: computed(() => route2.value.href),
    isActive,
    isExactActive,
    navigate
  };
}
const RouterLinkImpl = /* @__PURE__ */ defineComponent({
  name: "RouterLink",
  compatConfig: { MODE: 3 },
  props: {
    to: {
      type: [String, Object],
      required: true
    },
    replace: Boolean,
    activeClass: String,
    exactActiveClass: String,
    custom: Boolean,
    ariaCurrentValue: {
      type: String,
      default: "page"
    }
  },
  useLink,
  setup(props, { slots }) {
    const link = reactive(useLink(props));
    const { options } = inject(routerKey);
    const elClass = computed(() => ({
      [getLinkClass(props.activeClass, options.linkActiveClass, "router-link-active")]: link.isActive,
      [getLinkClass(props.exactActiveClass, options.linkExactActiveClass, "router-link-exact-active")]: link.isExactActive
    }));
    return () => {
      const children = slots.default && slots.default(link);
      return props.custom ? children : h("a", {
        "aria-current": link.isExactActive ? props.ariaCurrentValue : null,
        href: link.href,
        onClick: link.navigate,
        class: elClass.value
      }, children);
    };
  }
});
const RouterLink = RouterLinkImpl;
function guardEvent(e) {
  if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey)
    return;
  if (e.defaultPrevented)
    return;
  if (e.button !== void 0 && e.button !== 0)
    return;
  if (e.currentTarget && e.currentTarget.getAttribute) {
    const target2 = e.currentTarget.getAttribute("target");
    if (/\b_blank\b/i.test(target2))
      return;
  }
  if (e.preventDefault)
    e.preventDefault();
  return true;
}
function includesParams$1(outer, inner) {
  for (const key in inner) {
    const innerValue = inner[key];
    const outerValue = outer[key];
    if (typeof innerValue === "string") {
      if (innerValue !== outerValue)
        return false;
    } else {
      if (!Array.isArray(outerValue) || outerValue.length !== innerValue.length || innerValue.some((value, i) => value !== outerValue[i]))
        return false;
    }
  }
  return true;
}
function getOriginalPath$1(record) {
  return record ? record.aliasOf ? record.aliasOf.path : record.path : "";
}
const getLinkClass = (propClass, globalClass, defaultClass) => propClass != null ? propClass : globalClass != null ? globalClass : defaultClass;
const RouterViewImpl = /* @__PURE__ */ defineComponent({
  name: "RouterView",
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      default: "default"
    },
    route: Object
  },
  compatConfig: { MODE: 3 },
  setup(props, { attrs, slots }) {
    const injectedRoute = inject(routerViewLocationKey);
    const routeToDisplay = computed(() => props.route || injectedRoute.value);
    const depth = inject(viewDepthKey, 0);
    const matchedRouteRef = computed(() => routeToDisplay.value.matched[depth]);
    provide(viewDepthKey, depth + 1);
    provide(matchedRouteKey, matchedRouteRef);
    provide(routerViewLocationKey, routeToDisplay);
    const viewRef = ref();
    watch(() => [viewRef.value, matchedRouteRef.value, props.name], ([instance, to, name], [oldInstance, from, oldName]) => {
      if (to) {
        to.instances[name] = instance;
        if (from && from !== to && instance && instance === oldInstance) {
          if (!to.leaveGuards.size) {
            to.leaveGuards = from.leaveGuards;
          }
          if (!to.updateGuards.size) {
            to.updateGuards = from.updateGuards;
          }
        }
      }
      if (instance && to && (!from || !isSameRouteRecord$1(to, from) || !oldInstance)) {
        (to.enterCallbacks[name] || []).forEach((callback) => callback(instance));
      }
    }, { flush: "post" });
    return () => {
      const route2 = routeToDisplay.value;
      const matchedRoute = matchedRouteRef.value;
      const ViewComponent = matchedRoute && matchedRoute.components[props.name];
      const currentName = props.name;
      if (!ViewComponent) {
        return normalizeSlot(slots.default, { Component: ViewComponent, route: route2 });
      }
      const routePropsOption = matchedRoute.props[props.name];
      const routeProps = routePropsOption ? routePropsOption === true ? route2.params : typeof routePropsOption === "function" ? routePropsOption(route2) : routePropsOption : null;
      const onVnodeUnmounted = (vnode) => {
        if (vnode.component.isUnmounted) {
          matchedRoute.instances[currentName] = null;
        }
      };
      const component = h(ViewComponent, assign({}, routeProps, attrs, {
        onVnodeUnmounted,
        ref: viewRef
      }));
      if (isBrowser && component.ref) {
        const info = {
          depth,
          name: matchedRoute.name,
          path: matchedRoute.path,
          meta: matchedRoute.meta
        };
        const internalInstances = Array.isArray(component.ref) ? component.ref.map((r) => r.i) : [component.ref.i];
        internalInstances.forEach((instance) => {
          instance.__vrv_devtools = info;
        });
      }
      return normalizeSlot(slots.default, { Component: component, route: route2 }) || component;
    };
  }
});
function normalizeSlot(slot, data) {
  if (!slot)
    return null;
  const slotContent = slot(data);
  return slotContent.length === 1 ? slotContent[0] : slotContent;
}
const RouterView = RouterViewImpl;
function formatRouteLocation(routeLocation, tooltip) {
  const copy = assign({}, routeLocation, {
    matched: routeLocation.matched.map((matched) => omit(matched, ["instances", "children", "aliasOf"]))
  });
  return {
    _custom: {
      type: null,
      readOnly: true,
      display: routeLocation.fullPath,
      tooltip,
      value: copy
    }
  };
}
function formatDisplay(display) {
  return {
    _custom: {
      display
    }
  };
}
let routerId = 0;
function addDevtools(app2, router, matcher) {
  if (router.__hasDevtools)
    return;
  router.__hasDevtools = true;
  const id = routerId++;
  setupDevtoolsPlugin({
    id: "org.vuejs.router" + (id ? "." + id : ""),
    label: "Vue Router",
    packageName: "vue-router",
    homepage: "https://router.vuejs.org",
    logo: "https://router.vuejs.org/logo.png",
    componentStateTypes: ["Routing"],
    app: app2
  }, (api) => {
    api.on.inspectComponent((payload, ctx) => {
      if (payload.instanceData) {
        payload.instanceData.state.push({
          type: "Routing",
          key: "$route",
          editable: false,
          value: formatRouteLocation(router.currentRoute.value, "Current Route")
        });
      }
    });
    api.on.visitComponentTree(({ treeNode: node, componentInstance }) => {
      if (componentInstance.__vrv_devtools) {
        const info = componentInstance.__vrv_devtools;
        node.tags.push({
          label: (info.name ? `${info.name.toString()}: ` : "") + info.path,
          textColor: 0,
          tooltip: "This component is rendered by &lt;router-view&gt;",
          backgroundColor: PINK_500
        });
      }
      if (Array.isArray(componentInstance.__vrl_devtools)) {
        componentInstance.__devtoolsApi = api;
        componentInstance.__vrl_devtools.forEach((devtoolsData) => {
          let backgroundColor = ORANGE_400;
          let tooltip = "";
          if (devtoolsData.isExactActive) {
            backgroundColor = LIME_500;
            tooltip = "This is exactly active";
          } else if (devtoolsData.isActive) {
            backgroundColor = BLUE_600;
            tooltip = "This link is active";
          }
          node.tags.push({
            label: devtoolsData.route.path,
            textColor: 0,
            tooltip,
            backgroundColor
          });
        });
      }
    });
    watch(router.currentRoute, () => {
      refreshRoutesView();
      api.notifyComponentUpdate();
      api.sendInspectorTree(routerInspectorId);
      api.sendInspectorState(routerInspectorId);
    });
    const navigationsLayerId = "router:navigations:" + id;
    api.addTimelineLayer({
      id: navigationsLayerId,
      label: `Router${id ? " " + id : ""} Navigations`,
      color: 4237508
    });
    router.onError((error, to) => {
      api.addTimelineEvent({
        layerId: navigationsLayerId,
        event: {
          title: "Error during Navigation",
          subtitle: to.fullPath,
          logType: "error",
          time: api.now(),
          data: { error },
          groupId: to.meta.__navigationId
        }
      });
    });
    let navigationId = 0;
    router.beforeEach((to, from) => {
      const data = {
        guard: formatDisplay("beforeEach"),
        from: formatRouteLocation(from, "Current Location during this navigation"),
        to: formatRouteLocation(to, "Target location")
      };
      Object.defineProperty(to.meta, "__navigationId", {
        value: navigationId++
      });
      api.addTimelineEvent({
        layerId: navigationsLayerId,
        event: {
          time: api.now(),
          title: "Start of navigation",
          subtitle: to.fullPath,
          data,
          groupId: to.meta.__navigationId
        }
      });
    });
    router.afterEach((to, from, failure) => {
      const data = {
        guard: formatDisplay("afterEach")
      };
      if (failure) {
        data.failure = {
          _custom: {
            type: Error,
            readOnly: true,
            display: failure ? failure.message : "",
            tooltip: "Navigation Failure",
            value: failure
          }
        };
        data.status = formatDisplay("\u274C");
      } else {
        data.status = formatDisplay("\u2705");
      }
      data.from = formatRouteLocation(from, "Current Location during this navigation");
      data.to = formatRouteLocation(to, "Target location");
      api.addTimelineEvent({
        layerId: navigationsLayerId,
        event: {
          title: "End of navigation",
          subtitle: to.fullPath,
          time: api.now(),
          data,
          logType: failure ? "warning" : "default",
          groupId: to.meta.__navigationId
        }
      });
    });
    const routerInspectorId = "router-inspector:" + id;
    api.addInspector({
      id: routerInspectorId,
      label: "Routes" + (id ? " " + id : ""),
      icon: "book",
      treeFilterPlaceholder: "Search routes"
    });
    function refreshRoutesView() {
      if (!activeRoutesPayload)
        return;
      const payload = activeRoutesPayload;
      let routes2 = matcher.getRoutes().filter((route2) => !route2.parent);
      routes2.forEach(resetMatchStateOnRouteRecord);
      if (payload.filter) {
        routes2 = routes2.filter((route2) => isRouteMatching(route2, payload.filter.toLowerCase()));
      }
      routes2.forEach((route2) => markRouteRecordActive(route2, router.currentRoute.value));
      payload.rootNodes = routes2.map(formatRouteRecordForInspector);
    }
    let activeRoutesPayload;
    api.on.getInspectorTree((payload) => {
      activeRoutesPayload = payload;
      if (payload.app === app2 && payload.inspectorId === routerInspectorId) {
        refreshRoutesView();
      }
    });
    api.on.getInspectorState((payload) => {
      if (payload.app === app2 && payload.inspectorId === routerInspectorId) {
        const routes2 = matcher.getRoutes();
        const route2 = routes2.find((route3) => route3.record.__vd_id === payload.nodeId);
        if (route2) {
          payload.state = {
            options: formatRouteRecordMatcherForStateInspector(route2)
          };
        }
      }
    });
    api.sendInspectorTree(routerInspectorId);
    api.sendInspectorState(routerInspectorId);
  });
}
function modifierForKey(key) {
  if (key.optional) {
    return key.repeatable ? "*" : "?";
  } else {
    return key.repeatable ? "+" : "";
  }
}
function formatRouteRecordMatcherForStateInspector(route2) {
  const { record } = route2;
  const fields = [
    { editable: false, key: "path", value: record.path }
  ];
  if (record.name != null) {
    fields.push({
      editable: false,
      key: "name",
      value: record.name
    });
  }
  fields.push({ editable: false, key: "regexp", value: route2.re });
  if (route2.keys.length) {
    fields.push({
      editable: false,
      key: "keys",
      value: {
        _custom: {
          type: null,
          readOnly: true,
          display: route2.keys.map((key) => `${key.name}${modifierForKey(key)}`).join(" "),
          tooltip: "Param keys",
          value: route2.keys
        }
      }
    });
  }
  if (record.redirect != null) {
    fields.push({
      editable: false,
      key: "redirect",
      value: record.redirect
    });
  }
  if (route2.alias.length) {
    fields.push({
      editable: false,
      key: "aliases",
      value: route2.alias.map((alias) => alias.record.path)
    });
  }
  fields.push({
    key: "score",
    editable: false,
    value: {
      _custom: {
        type: null,
        readOnly: true,
        display: route2.score.map((score) => score.join(", ")).join(" | "),
        tooltip: "Score used to sort routes",
        value: route2.score
      }
    }
  });
  return fields;
}
const PINK_500 = 15485081;
const BLUE_600 = 2450411;
const LIME_500 = 8702998;
const CYAN_400 = 2282478;
const ORANGE_400 = 16486972;
const DARK = 6710886;
function formatRouteRecordForInspector(route2) {
  const tags = [];
  const { record } = route2;
  if (record.name != null) {
    tags.push({
      label: String(record.name),
      textColor: 0,
      backgroundColor: CYAN_400
    });
  }
  if (record.aliasOf) {
    tags.push({
      label: "alias",
      textColor: 0,
      backgroundColor: ORANGE_400
    });
  }
  if (route2.__vd_match) {
    tags.push({
      label: "matches",
      textColor: 0,
      backgroundColor: PINK_500
    });
  }
  if (route2.__vd_exactActive) {
    tags.push({
      label: "exact",
      textColor: 0,
      backgroundColor: LIME_500
    });
  }
  if (route2.__vd_active) {
    tags.push({
      label: "active",
      textColor: 0,
      backgroundColor: BLUE_600
    });
  }
  if (record.redirect) {
    tags.push({
      label: "redirect: " + (typeof record.redirect === "string" ? record.redirect : "Object"),
      textColor: 16777215,
      backgroundColor: DARK
    });
  }
  let id = record.__vd_id;
  if (id == null) {
    id = String(routeRecordId++);
    record.__vd_id = id;
  }
  return {
    id,
    label: record.path,
    tags,
    children: route2.children.map(formatRouteRecordForInspector)
  };
}
let routeRecordId = 0;
const EXTRACT_REGEXP_RE = /^\/(.*)\/([a-z]*)$/;
function markRouteRecordActive(route2, currentRoute) {
  const isExactActive = currentRoute.matched.length && isSameRouteRecord$1(currentRoute.matched[currentRoute.matched.length - 1], route2.record);
  route2.__vd_exactActive = route2.__vd_active = isExactActive;
  if (!isExactActive) {
    route2.__vd_active = currentRoute.matched.some((match) => isSameRouteRecord$1(match, route2.record));
  }
  route2.children.forEach((childRoute) => markRouteRecordActive(childRoute, currentRoute));
}
function resetMatchStateOnRouteRecord(route2) {
  route2.__vd_match = false;
  route2.children.forEach(resetMatchStateOnRouteRecord);
}
function isRouteMatching(route2, filter) {
  const found = String(route2.re).match(EXTRACT_REGEXP_RE);
  route2.__vd_match = false;
  if (!found || found.length < 3) {
    return false;
  }
  const nonEndingRE = new RegExp(found[1].replace(/\$$/, ""), found[2]);
  if (nonEndingRE.test(filter)) {
    route2.children.forEach((child) => isRouteMatching(child, filter));
    if (route2.record.path !== "/" || filter === "/") {
      route2.__vd_match = route2.re.test(filter);
      return true;
    }
    return false;
  }
  const path = route2.record.path.toLowerCase();
  const decodedPath = decode(path);
  if (!filter.startsWith("/") && (decodedPath.includes(filter) || path.includes(filter)))
    return true;
  if (decodedPath.startsWith(filter) || path.startsWith(filter))
    return true;
  if (route2.record.name && String(route2.record.name).includes(filter))
    return true;
  return route2.children.some((child) => isRouteMatching(child, filter));
}
function omit(obj, keys) {
  const ret = {};
  for (const key in obj) {
    if (!keys.includes(key)) {
      ret[key] = obj[key];
    }
  }
  return ret;
}
function createRouter$1(options) {
  const matcher = createRouterMatcher(options.routes, options);
  const parseQuery$1 = options.parseQuery || parseQuery;
  const stringifyQuery$1 = options.stringifyQuery || stringifyQuery;
  const routerHistory = options.history;
  const beforeGuards = useCallbacks();
  const beforeResolveGuards = useCallbacks();
  const afterGuards = useCallbacks();
  const currentRoute = shallowRef(START_LOCATION_NORMALIZED);
  let pendingLocation = START_LOCATION_NORMALIZED;
  if (isBrowser && options.scrollBehavior && "scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  const normalizeParams = applyToParams.bind(null, (paramValue) => "" + paramValue);
  const encodeParams = applyToParams.bind(null, encodeParam);
  const decodeParams = applyToParams.bind(null, decode);
  function addRoute(parentOrRoute, route2) {
    let parent;
    let record;
    if (isRouteName(parentOrRoute)) {
      parent = matcher.getRecordMatcher(parentOrRoute);
      record = route2;
    } else {
      record = parentOrRoute;
    }
    return matcher.addRoute(record, parent);
  }
  function removeRoute(name) {
    const recordMatcher = matcher.getRecordMatcher(name);
    if (recordMatcher) {
      matcher.removeRoute(recordMatcher);
    }
  }
  function getRoutes() {
    return matcher.getRoutes().map((routeMatcher) => routeMatcher.record);
  }
  function hasRoute(name) {
    return !!matcher.getRecordMatcher(name);
  }
  function resolve2(rawLocation, currentLocation) {
    currentLocation = assign({}, currentLocation || currentRoute.value);
    if (typeof rawLocation === "string") {
      const locationNormalized = parseURL(parseQuery$1, rawLocation, currentLocation.path);
      const matchedRoute2 = matcher.resolve({ path: locationNormalized.path }, currentLocation);
      const href2 = routerHistory.createHref(locationNormalized.fullPath);
      return assign(locationNormalized, matchedRoute2, {
        params: decodeParams(matchedRoute2.params),
        hash: decode(locationNormalized.hash),
        redirectedFrom: void 0,
        href: href2
      });
    }
    let matcherLocation;
    if ("path" in rawLocation) {
      matcherLocation = assign({}, rawLocation, {
        path: parseURL(parseQuery$1, rawLocation.path, currentLocation.path).path
      });
    } else {
      const targetParams = assign({}, rawLocation.params);
      for (const key in targetParams) {
        if (targetParams[key] == null) {
          delete targetParams[key];
        }
      }
      matcherLocation = assign({}, rawLocation, {
        params: encodeParams(rawLocation.params)
      });
      currentLocation.params = encodeParams(currentLocation.params);
    }
    const matchedRoute = matcher.resolve(matcherLocation, currentLocation);
    const hash = rawLocation.hash || "";
    matchedRoute.params = normalizeParams(decodeParams(matchedRoute.params));
    const fullPath = stringifyURL(stringifyQuery$1, assign({}, rawLocation, {
      hash: encodeHash(hash),
      path: matchedRoute.path
    }));
    const href = routerHistory.createHref(fullPath);
    return assign({
      fullPath,
      hash,
      query: stringifyQuery$1 === stringifyQuery ? normalizeQuery(rawLocation.query) : rawLocation.query || {}
    }, matchedRoute, {
      redirectedFrom: void 0,
      href
    });
  }
  function locationAsObject(to) {
    return typeof to === "string" ? parseURL(parseQuery$1, to, currentRoute.value.path) : assign({}, to);
  }
  function checkCanceledNavigation(to, from) {
    if (pendingLocation !== to) {
      return createRouterError(8, {
        from,
        to
      });
    }
  }
  function push(to) {
    return pushWithRedirect(to);
  }
  function replace(to) {
    return push(assign(locationAsObject(to), { replace: true }));
  }
  function handleRedirectRecord(to) {
    const lastMatched = to.matched[to.matched.length - 1];
    if (lastMatched && lastMatched.redirect) {
      const { redirect } = lastMatched;
      let newTargetLocation = typeof redirect === "function" ? redirect(to) : redirect;
      if (typeof newTargetLocation === "string") {
        newTargetLocation = newTargetLocation.includes("?") || newTargetLocation.includes("#") ? newTargetLocation = locationAsObject(newTargetLocation) : { path: newTargetLocation };
        newTargetLocation.params = {};
      }
      return assign({
        query: to.query,
        hash: to.hash,
        params: to.params
      }, newTargetLocation);
    }
  }
  function pushWithRedirect(to, redirectedFrom) {
    const targetLocation = pendingLocation = resolve2(to);
    const from = currentRoute.value;
    const data = to.state;
    const force = to.force;
    const replace2 = to.replace === true;
    const shouldRedirect = handleRedirectRecord(targetLocation);
    if (shouldRedirect)
      return pushWithRedirect(assign(locationAsObject(shouldRedirect), {
        state: data,
        force,
        replace: replace2
      }), redirectedFrom || targetLocation);
    const toLocation = targetLocation;
    toLocation.redirectedFrom = redirectedFrom;
    let failure;
    if (!force && isSameRouteLocation(stringifyQuery$1, from, targetLocation)) {
      failure = createRouterError(16, { to: toLocation, from });
      handleScroll(from, from, true, false);
    }
    return (failure ? Promise.resolve(failure) : navigate(toLocation, from)).catch((error) => isNavigationFailure(error) ? isNavigationFailure(error, 2) ? error : markAsReady(error) : triggerError(error, toLocation, from)).then((failure2) => {
      if (failure2) {
        if (isNavigationFailure(failure2, 2)) {
          return pushWithRedirect(assign(locationAsObject(failure2.to), {
            state: data,
            force,
            replace: replace2
          }), redirectedFrom || toLocation);
        }
      } else {
        failure2 = finalizeNavigation(toLocation, from, true, replace2, data);
      }
      triggerAfterEach(toLocation, from, failure2);
      return failure2;
    });
  }
  function checkCanceledNavigationAndReject(to, from) {
    const error = checkCanceledNavigation(to, from);
    return error ? Promise.reject(error) : Promise.resolve();
  }
  function navigate(to, from) {
    let guards;
    const [leavingRecords, updatingRecords, enteringRecords] = extractChangingRecords(to, from);
    guards = extractComponentsGuards(leavingRecords.reverse(), "beforeRouteLeave", to, from);
    for (const record of leavingRecords) {
      record.leaveGuards.forEach((guard) => {
        guards.push(guardToPromiseFn(guard, to, from));
      });
    }
    const canceledNavigationCheck = checkCanceledNavigationAndReject.bind(null, to, from);
    guards.push(canceledNavigationCheck);
    return runGuardQueue(guards).then(() => {
      guards = [];
      for (const guard of beforeGuards.list()) {
        guards.push(guardToPromiseFn(guard, to, from));
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      guards = extractComponentsGuards(updatingRecords, "beforeRouteUpdate", to, from);
      for (const record of updatingRecords) {
        record.updateGuards.forEach((guard) => {
          guards.push(guardToPromiseFn(guard, to, from));
        });
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      guards = [];
      for (const record of to.matched) {
        if (record.beforeEnter && !from.matched.includes(record)) {
          if (Array.isArray(record.beforeEnter)) {
            for (const beforeEnter of record.beforeEnter)
              guards.push(guardToPromiseFn(beforeEnter, to, from));
          } else {
            guards.push(guardToPromiseFn(record.beforeEnter, to, from));
          }
        }
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      to.matched.forEach((record) => record.enterCallbacks = {});
      guards = extractComponentsGuards(enteringRecords, "beforeRouteEnter", to, from);
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      guards = [];
      for (const guard of beforeResolveGuards.list()) {
        guards.push(guardToPromiseFn(guard, to, from));
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).catch((err) => isNavigationFailure(err, 8) ? err : Promise.reject(err));
  }
  function triggerAfterEach(to, from, failure) {
    for (const guard of afterGuards.list())
      guard(to, from, failure);
  }
  function finalizeNavigation(toLocation, from, isPush, replace2, data) {
    const error = checkCanceledNavigation(toLocation, from);
    if (error)
      return error;
    const isFirstNavigation = from === START_LOCATION_NORMALIZED;
    const state = !isBrowser ? {} : history.state;
    if (isPush) {
      if (replace2 || isFirstNavigation)
        routerHistory.replace(toLocation.fullPath, assign({
          scroll: isFirstNavigation && state && state.scroll
        }, data));
      else
        routerHistory.push(toLocation.fullPath, data);
    }
    currentRoute.value = toLocation;
    handleScroll(toLocation, from, isPush, isFirstNavigation);
    markAsReady();
  }
  let removeHistoryListener;
  function setupListeners() {
    if (removeHistoryListener)
      return;
    removeHistoryListener = routerHistory.listen((to, _from, info) => {
      const toLocation = resolve2(to);
      const shouldRedirect = handleRedirectRecord(toLocation);
      if (shouldRedirect) {
        pushWithRedirect(assign(shouldRedirect, { replace: true }), toLocation).catch(noop);
        return;
      }
      pendingLocation = toLocation;
      const from = currentRoute.value;
      if (isBrowser) {
        saveScrollPosition(getScrollKey(from.fullPath, info.delta), computeScrollPosition());
      }
      navigate(toLocation, from).catch((error) => {
        if (isNavigationFailure(error, 4 | 8)) {
          return error;
        }
        if (isNavigationFailure(error, 2)) {
          pushWithRedirect(error.to, toLocation).then((failure) => {
            if (isNavigationFailure(failure, 4 | 16) && !info.delta && info.type === NavigationType.pop) {
              routerHistory.go(-1, false);
            }
          }).catch(noop);
          return Promise.reject();
        }
        if (info.delta)
          routerHistory.go(-info.delta, false);
        return triggerError(error, toLocation, from);
      }).then((failure) => {
        failure = failure || finalizeNavigation(toLocation, from, false);
        if (failure) {
          if (info.delta) {
            routerHistory.go(-info.delta, false);
          } else if (info.type === NavigationType.pop && isNavigationFailure(failure, 4 | 16)) {
            routerHistory.go(-1, false);
          }
        }
        triggerAfterEach(toLocation, from, failure);
      }).catch(noop);
    });
  }
  let readyHandlers = useCallbacks();
  let errorHandlers = useCallbacks();
  let ready;
  function triggerError(error, to, from) {
    markAsReady(error);
    const list = errorHandlers.list();
    if (list.length) {
      list.forEach((handler) => handler(error, to, from));
    } else {
      console.error(error);
    }
    return Promise.reject(error);
  }
  function isReady() {
    if (ready && currentRoute.value !== START_LOCATION_NORMALIZED)
      return Promise.resolve();
    return new Promise((resolve3, reject) => {
      readyHandlers.add([resolve3, reject]);
    });
  }
  function markAsReady(err) {
    if (!ready) {
      ready = !err;
      setupListeners();
      readyHandlers.list().forEach(([resolve3, reject]) => err ? reject(err) : resolve3());
      readyHandlers.reset();
    }
    return err;
  }
  function handleScroll(to, from, isPush, isFirstNavigation) {
    const { scrollBehavior } = options;
    if (!isBrowser || !scrollBehavior)
      return Promise.resolve();
    const scrollPosition = !isPush && getSavedScrollPosition(getScrollKey(to.fullPath, 0)) || (isFirstNavigation || !isPush) && history.state && history.state.scroll || null;
    return nextTick().then(() => scrollBehavior(to, from, scrollPosition)).then((position2) => position2 && scrollToPosition(position2)).catch((err) => triggerError(err, to, from));
  }
  const go = (delta) => routerHistory.go(delta);
  let started;
  const installedApps = /* @__PURE__ */ new Set();
  const router = {
    currentRoute,
    addRoute,
    removeRoute,
    hasRoute,
    getRoutes,
    resolve: resolve2,
    options,
    push,
    replace,
    go,
    back: () => go(-1),
    forward: () => go(1),
    beforeEach: beforeGuards.add,
    beforeResolve: beforeResolveGuards.add,
    afterEach: afterGuards.add,
    onError: errorHandlers.add,
    isReady,
    install(app2) {
      const router2 = this;
      app2.component("RouterLink", RouterLink);
      app2.component("RouterView", RouterView);
      app2.config.globalProperties.$router = router2;
      Object.defineProperty(app2.config.globalProperties, "$route", {
        enumerable: true,
        get: () => unref(currentRoute)
      });
      if (isBrowser && !started && currentRoute.value === START_LOCATION_NORMALIZED) {
        started = true;
        push(routerHistory.location).catch((err) => {
        });
      }
      const reactiveRoute = {};
      for (const key in START_LOCATION_NORMALIZED) {
        reactiveRoute[key] = computed(() => currentRoute.value[key]);
      }
      app2.provide(routerKey, router2);
      app2.provide(routeLocationKey, reactive(reactiveRoute));
      app2.provide(routerViewLocationKey, currentRoute);
      const unmountApp = app2.unmount;
      installedApps.add(app2);
      app2.unmount = function() {
        installedApps.delete(app2);
        if (installedApps.size < 1) {
          pendingLocation = START_LOCATION_NORMALIZED;
          removeHistoryListener && removeHistoryListener();
          removeHistoryListener = null;
          currentRoute.value = START_LOCATION_NORMALIZED;
          started = false;
          ready = false;
        }
        unmountApp();
      };
      if (isBrowser) {
        addDevtools(app2, router2, matcher);
      }
    }
  };
  return router;
}
function runGuardQueue(guards) {
  return guards.reduce((promise, guard) => promise.then(() => guard()), Promise.resolve());
}
function extractChangingRecords(to, from) {
  const leavingRecords = [];
  const updatingRecords = [];
  const enteringRecords = [];
  const len = Math.max(from.matched.length, to.matched.length);
  for (let i = 0; i < len; i++) {
    const recordFrom = from.matched[i];
    if (recordFrom) {
      if (to.matched.find((record) => isSameRouteRecord$1(record, recordFrom)))
        updatingRecords.push(recordFrom);
      else
        leavingRecords.push(recordFrom);
    }
    const recordTo = to.matched[i];
    if (recordTo) {
      if (!from.matched.find((record) => isSameRouteRecord$1(record, recordTo))) {
        enteringRecords.push(recordTo);
      }
    }
  }
  return [leavingRecords, updatingRecords, enteringRecords];
}
const routes = [
  {
    path: "/",
    component: () => __vitePreload(() => import("./MainLayout.c4d9ca81.js"), true ? [] : void 0),
    children: [{ path: "", component: () => __vitePreload(() => import("./IndexPage.f648ba05.js"), true ? [] : void 0) }]
  },
  {
    path: "/:catchAll(.*)*",
    component: () => __vitePreload(() => import("./ErrorNotFound.bf67d7a2.js"), true ? [] : void 0)
  }
];
var createRouter = route(function() {
  const createHistory = createWebHistory;
  const Router = createRouter$1({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory("/")
  });
  return Router;
});
async function createQuasarApp(createAppFn, quasarUserOptions2) {
  const app2 = createAppFn(RootComponent);
  app2.config.performance = true;
  app2.use(Quasar, quasarUserOptions2);
  const store2 = typeof createStore === "function" ? await createStore({}) : createStore;
  app2.use(store2);
  const router = markRaw(typeof createRouter === "function" ? await createRouter({ store: store2 }) : createRouter);
  store2.use(({ store: store3 }) => {
    store3.router = router;
  });
  return {
    app: app2,
    store: store2,
    router
  };
}
function useHistory(showing, hide, hideOnRouteChange) {
  let historyEntry;
  function removeFromHistory() {
    if (historyEntry !== void 0) {
      History.remove(historyEntry);
      historyEntry = void 0;
    }
  }
  onBeforeUnmount(() => {
    showing.value === true && removeFromHistory();
  });
  return {
    removeFromHistory,
    addToHistory() {
      historyEntry = {
        condition: () => hideOnRouteChange.value === true,
        handler: hide
      };
      History.add(historyEntry);
    }
  };
}
function useTimeout() {
  let timer;
  onBeforeUnmount(() => {
    clearTimeout(timer);
  });
  return {
    registerTimeout(fn, delay) {
      clearTimeout(timer);
      timer = setTimeout(fn, delay);
    },
    removeTimeout() {
      clearTimeout(timer);
    }
  };
}
function useTick() {
  let tickFn;
  onBeforeUnmount(() => {
    tickFn = void 0;
  });
  return {
    registerTick(fn) {
      tickFn = fn;
      nextTick(() => {
        if (tickFn === fn) {
          tickFn();
          tickFn = void 0;
        }
      });
    },
    removeTick() {
      tickFn = void 0;
    }
  };
}
function vmHasRouter(vm) {
  return vm.appContext.config.globalProperties.$router !== void 0;
}
const useModelToggleProps = {
  modelValue: {
    type: Boolean,
    default: null
  },
  "onUpdate:modelValue": [Function, Array]
};
const useModelToggleEmits = [
  "before-show",
  "show",
  "before-hide",
  "hide"
];
function useModelToggle({
  showing,
  canShow,
  hideOnRouteChange,
  handleShow,
  handleHide,
  processOnMount
}) {
  const vm = getCurrentInstance();
  const { props, emit: emit2, proxy } = vm;
  let payload;
  function toggle(evt) {
    if (showing.value === true) {
      hide(evt);
    } else {
      show(evt);
    }
  }
  function show(evt) {
    if (props.disable === true || evt !== void 0 && evt.qAnchorHandled === true || canShow !== void 0 && canShow(evt) !== true) {
      return;
    }
    const listener = props["onUpdate:modelValue"] !== void 0;
    if (listener === true && true) {
      emit2("update:modelValue", true);
      payload = evt;
      nextTick(() => {
        if (payload === evt) {
          payload = void 0;
        }
      });
    }
    if (props.modelValue === null || listener === false || false) {
      processShow(evt);
    }
  }
  function processShow(evt) {
    if (showing.value === true) {
      return;
    }
    showing.value = true;
    emit2("before-show", evt);
    if (handleShow !== void 0) {
      handleShow(evt);
    } else {
      emit2("show", evt);
    }
  }
  function hide(evt) {
    if (props.disable === true) {
      return;
    }
    const listener = props["onUpdate:modelValue"] !== void 0;
    if (listener === true && true) {
      emit2("update:modelValue", false);
      payload = evt;
      nextTick(() => {
        if (payload === evt) {
          payload = void 0;
        }
      });
    }
    if (props.modelValue === null || listener === false || false) {
      processHide(evt);
    }
  }
  function processHide(evt) {
    if (showing.value === false) {
      return;
    }
    showing.value = false;
    emit2("before-hide", evt);
    if (handleHide !== void 0) {
      handleHide(evt);
    } else {
      emit2("hide", evt);
    }
  }
  function processModelChange(val) {
    if (props.disable === true && val === true) {
      if (props["onUpdate:modelValue"] !== void 0) {
        emit2("update:modelValue", false);
      }
    } else if (val === true !== showing.value) {
      const fn = val === true ? processShow : processHide;
      fn(payload);
    }
  }
  watch(() => props.modelValue, processModelChange);
  if (hideOnRouteChange !== void 0 && vmHasRouter(vm) === true) {
    watch(() => proxy.$route.fullPath, () => {
      if (hideOnRouteChange.value === true && showing.value === true) {
        hide();
      }
    });
  }
  processOnMount === true && onMounted(() => {
    processModelChange(props.modelValue);
  });
  const publicMethods = { show, hide, toggle };
  Object.assign(proxy, publicMethods);
  return publicMethods;
}
const useTransitionProps = {
  transitionShow: {
    type: String,
    default: "fade"
  },
  transitionHide: {
    type: String,
    default: "fade"
  },
  transitionDuration: {
    type: [String, Number],
    default: 300
  }
};
let queue = [];
let waitFlags = [];
function clearFlag(flag) {
  waitFlags = waitFlags.filter((entry) => entry !== flag);
}
function addFocusWaitFlag(flag) {
  clearFlag(flag);
  waitFlags.push(flag);
}
function removeFocusWaitFlag(flag) {
  clearFlag(flag);
  if (waitFlags.length === 0 && queue.length > 0) {
    queue[queue.length - 1]();
    queue = [];
  }
}
function addFocusFn(fn) {
  if (waitFlags.length === 0) {
    fn();
  } else {
    queue.push(fn);
  }
}
function removeFocusFn(fn) {
  queue = queue.filter((entry) => entry !== fn);
}
let target = document.body;
function createGlobalNode(id) {
  const el = document.createElement("div");
  if (id !== void 0) {
    el.id = id;
  }
  if (globalConfig.globalNodes !== void 0) {
    const cls = globalConfig.globalNodes.class;
    if (cls !== void 0) {
      el.className = cls;
    }
  }
  target.appendChild(el);
  return el;
}
function removeGlobalNode(el) {
  el.remove();
}
const portalList = [];
function isOnGlobalDialog(vm) {
  vm = vm.parent;
  while (vm !== void 0 && vm !== null) {
    if (vm.type.name === "QGlobalDialog") {
      return true;
    }
    if (vm.type.name === "QDialog" || vm.type.name === "QMenu") {
      return false;
    }
    vm = vm.parent;
  }
  return false;
}
function usePortal(vm, innerRef, renderPortalContent, checkGlobalDialog) {
  const portalIsActive = ref(false);
  const portalIsAccessible = ref(false);
  let portalEl = null;
  const focusObj = {};
  const onGlobalDialog = checkGlobalDialog === true && isOnGlobalDialog(vm);
  function showPortal(isReady) {
    if (isReady === true) {
      removeFocusWaitFlag(focusObj);
      portalIsAccessible.value = true;
      return;
    }
    portalIsAccessible.value = false;
    if (portalIsActive.value === false) {
      if (onGlobalDialog === false && portalEl === null) {
        portalEl = createGlobalNode();
      }
      portalIsActive.value = true;
      portalList.push(vm.proxy);
      addFocusWaitFlag(focusObj);
    }
  }
  function hidePortal(isReady) {
    portalIsAccessible.value = false;
    if (isReady !== true) {
      return;
    }
    removeFocusWaitFlag(focusObj);
    portalIsActive.value = false;
    const index = portalList.indexOf(vm.proxy);
    if (index > -1) {
      portalList.splice(index, 1);
    }
    if (portalEl !== null) {
      removeGlobalNode(portalEl);
      portalEl = null;
    }
  }
  onUnmounted(() => {
    hidePortal(true);
  });
  Object.assign(vm.proxy, { __qPortalInnerRef: innerRef });
  return {
    showPortal,
    hidePortal,
    portalIsActive,
    portalIsAccessible,
    renderPortal: () => onGlobalDialog === true ? renderPortalContent() : portalIsActive.value === true ? [h(Teleport, { to: portalEl }, renderPortalContent())] : void 0
  };
}
function css(element, css2) {
  const style = element.style;
  for (const prop in css2) {
    style[prop] = css2[prop];
  }
}
function getElement(el) {
  if (el === void 0 || el === null) {
    return void 0;
  }
  if (typeof el === "string") {
    try {
      return document.querySelector(el) || void 0;
    } catch (err) {
      return void 0;
    }
  }
  const target2 = isRef(el) === true ? el.value : el;
  if (target2) {
    return target2.$el || target2;
  }
}
function childHasFocus(el, focusedEl) {
  if (el === void 0 || el === null || el.contains(focusedEl) === true) {
    return true;
  }
  for (let next = el.nextElementSibling; next !== null; next = next.nextElementSibling) {
    if (next.contains(focusedEl)) {
      return true;
    }
  }
  return false;
}
const scrollTargets = [null, document, document.body, document.scrollingElement, document.documentElement];
function getScrollTarget(el, targetEl) {
  let target2 = getElement(targetEl);
  if (target2 === void 0) {
    if (el === void 0 || el === null) {
      return window;
    }
    target2 = el.closest(".scroll,.scroll-y,.overflow-auto");
  }
  return scrollTargets.includes(target2) ? window : target2;
}
function getVerticalScrollPosition(scrollTarget) {
  return scrollTarget === window ? window.pageYOffset || window.scrollY || document.body.scrollTop || 0 : scrollTarget.scrollTop;
}
function getHorizontalScrollPosition(scrollTarget) {
  return scrollTarget === window ? window.pageXOffset || window.scrollX || document.body.scrollLeft || 0 : scrollTarget.scrollLeft;
}
let size;
function getScrollbarWidth() {
  if (size !== void 0) {
    return size;
  }
  const inner = document.createElement("p"), outer = document.createElement("div");
  css(inner, {
    width: "100%",
    height: "200px"
  });
  css(outer, {
    position: "absolute",
    top: "0px",
    left: "0px",
    visibility: "hidden",
    width: "200px",
    height: "150px",
    overflow: "hidden"
  });
  outer.appendChild(inner);
  document.body.appendChild(outer);
  const w1 = inner.offsetWidth;
  outer.style.overflow = "scroll";
  let w2 = inner.offsetWidth;
  if (w1 === w2) {
    w2 = outer.clientWidth;
  }
  outer.remove();
  size = w1 - w2;
  return size;
}
function hasScrollbar(el, onY = true) {
  if (!el || el.nodeType !== Node.ELEMENT_NODE) {
    return false;
  }
  return onY ? el.scrollHeight > el.clientHeight && (el.classList.contains("scroll") || el.classList.contains("overflow-auto") || ["auto", "scroll"].includes(window.getComputedStyle(el)["overflow-y"])) : el.scrollWidth > el.clientWidth && (el.classList.contains("scroll") || el.classList.contains("overflow-auto") || ["auto", "scroll"].includes(window.getComputedStyle(el)["overflow-x"]));
}
let registered = 0, scrollPositionX, scrollPositionY, maxScrollTop, vpPendingUpdate = false, bodyLeft, bodyTop, closeTimer;
function onWheel(e) {
  if (shouldPreventScroll(e)) {
    stopAndPrevent(e);
  }
}
function shouldPreventScroll(e) {
  if (e.target === document.body || e.target.classList.contains("q-layout__backdrop")) {
    return true;
  }
  const path = getEventPath(e), shift = e.shiftKey && !e.deltaX, scrollY = !shift && Math.abs(e.deltaX) <= Math.abs(e.deltaY), delta = shift || scrollY ? e.deltaY : e.deltaX;
  for (let index = 0; index < path.length; index++) {
    const el = path[index];
    if (hasScrollbar(el, scrollY)) {
      return scrollY ? delta < 0 && el.scrollTop === 0 ? true : delta > 0 && el.scrollTop + el.clientHeight === el.scrollHeight : delta < 0 && el.scrollLeft === 0 ? true : delta > 0 && el.scrollLeft + el.clientWidth === el.scrollWidth;
    }
  }
  return true;
}
function onAppleScroll(e) {
  if (e.target === document) {
    document.scrollingElement.scrollTop = document.scrollingElement.scrollTop;
  }
}
function onAppleResize(evt) {
  if (vpPendingUpdate === true) {
    return;
  }
  vpPendingUpdate = true;
  requestAnimationFrame(() => {
    vpPendingUpdate = false;
    const { height } = evt.target, { clientHeight, scrollTop } = document.scrollingElement;
    if (maxScrollTop === void 0 || height !== window.innerHeight) {
      maxScrollTop = clientHeight - height;
      document.scrollingElement.scrollTop = scrollTop;
    }
    if (scrollTop > maxScrollTop) {
      document.scrollingElement.scrollTop -= Math.ceil((scrollTop - maxScrollTop) / 8);
    }
  });
}
function apply(action) {
  const body = document.body, hasViewport = window.visualViewport !== void 0;
  if (action === "add") {
    const { overflowY, overflowX } = window.getComputedStyle(body);
    scrollPositionX = getHorizontalScrollPosition(window);
    scrollPositionY = getVerticalScrollPosition(window);
    bodyLeft = body.style.left;
    bodyTop = body.style.top;
    body.style.left = `-${scrollPositionX}px`;
    body.style.top = `-${scrollPositionY}px`;
    if (overflowX !== "hidden" && (overflowX === "scroll" || body.scrollWidth > window.innerWidth)) {
      body.classList.add("q-body--force-scrollbar-x");
    }
    if (overflowY !== "hidden" && (overflowY === "scroll" || body.scrollHeight > window.innerHeight)) {
      body.classList.add("q-body--force-scrollbar-y");
    }
    body.classList.add("q-body--prevent-scroll");
    document.qScrollPrevented = true;
    if (client.is.ios === true) {
      if (hasViewport === true) {
        window.scrollTo(0, 0);
        window.visualViewport.addEventListener("resize", onAppleResize, listenOpts.passiveCapture);
        window.visualViewport.addEventListener("scroll", onAppleResize, listenOpts.passiveCapture);
        window.scrollTo(0, 0);
      } else {
        window.addEventListener("scroll", onAppleScroll, listenOpts.passiveCapture);
      }
    }
  }
  if (client.is.desktop === true && client.is.mac === true) {
    window[`${action}EventListener`]("wheel", onWheel, listenOpts.notPassive);
  }
  if (action === "remove") {
    if (client.is.ios === true) {
      if (hasViewport === true) {
        window.visualViewport.removeEventListener("resize", onAppleResize, listenOpts.passiveCapture);
        window.visualViewport.removeEventListener("scroll", onAppleResize, listenOpts.passiveCapture);
      } else {
        window.removeEventListener("scroll", onAppleScroll, listenOpts.passiveCapture);
      }
    }
    body.classList.remove("q-body--prevent-scroll");
    body.classList.remove("q-body--force-scrollbar-x");
    body.classList.remove("q-body--force-scrollbar-y");
    document.qScrollPrevented = false;
    body.style.left = bodyLeft;
    body.style.top = bodyTop;
    window.scrollTo(scrollPositionX, scrollPositionY);
    maxScrollTop = void 0;
  }
}
function preventScroll(state) {
  let action = "add";
  if (state === true) {
    registered++;
    if (closeTimer !== void 0) {
      clearTimeout(closeTimer);
      closeTimer = void 0;
      return;
    }
    if (registered > 1) {
      return;
    }
  } else {
    if (registered === 0) {
      return;
    }
    registered--;
    if (registered > 0) {
      return;
    }
    action = "remove";
    if (client.is.ios === true && client.is.nativeMobile === true) {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(() => {
        apply(action);
        closeTimer = void 0;
      }, 100);
      return;
    }
  }
  apply(action);
}
function usePreventScroll() {
  let currentState;
  return {
    preventBodyScroll(state) {
      if (state !== currentState && (currentState !== void 0 || state === true)) {
        currentState = state;
        preventScroll(state);
      }
    }
  };
}
const createComponent = (raw) => markRaw(defineComponent(raw));
const createDirective = (raw) => markRaw(raw);
function hSlot(slot, otherwise) {
  return slot !== void 0 ? slot() || otherwise : otherwise;
}
function hUniqueSlot(slot, otherwise) {
  if (slot !== void 0) {
    const vnode = slot();
    if (vnode !== void 0 && vnode !== null) {
      return vnode.slice();
    }
  }
  return otherwise;
}
function hMergeSlot(slot, source) {
  return slot !== void 0 ? source.concat(slot()) : source;
}
function hMergeSlotSafely(slot, source) {
  if (slot === void 0) {
    return source;
  }
  return source !== void 0 ? source.concat(slot()) : slot();
}
function hDir(tag, data, children, key, condition, getDirsFn) {
  data.key = key + condition;
  const vnode = h(tag, data, children);
  return condition === true ? withDirectives(vnode, getDirsFn()) : vnode;
}
const handlers$1 = [];
let escDown;
function onKeydown(evt) {
  escDown = evt.keyCode === 27;
}
function onBlur() {
  if (escDown === true) {
    escDown = false;
  }
}
function onKeyup(evt) {
  if (escDown === true) {
    escDown = false;
    if (isKeyCode(evt, 27) === true) {
      handlers$1[handlers$1.length - 1](evt);
    }
  }
}
function update(action) {
  window[action]("keydown", onKeydown);
  window[action]("blur", onBlur);
  window[action]("keyup", onKeyup);
  escDown = false;
}
function addEscapeKey(fn) {
  if (client.is.desktop === true) {
    handlers$1.push(fn);
    if (handlers$1.length === 1) {
      update("addEventListener");
    }
  }
}
function removeEscapeKey(fn) {
  const index = handlers$1.indexOf(fn);
  if (index > -1) {
    handlers$1.splice(index, 1);
    if (handlers$1.length === 0) {
      update("removeEventListener");
    }
  }
}
const handlers = [];
function trigger(e) {
  handlers[handlers.length - 1](e);
}
function addFocusout(fn) {
  if (client.is.desktop === true) {
    handlers.push(fn);
    if (handlers.length === 1) {
      document.body.addEventListener("focusin", trigger);
    }
  }
}
function removeFocusout(fn) {
  const index = handlers.indexOf(fn);
  if (index > -1) {
    handlers.splice(index, 1);
    if (handlers.length === 0) {
      document.body.removeEventListener("focusin", trigger);
    }
  }
}
let maximizedModals = 0;
const positionClass = {
  standard: "fixed-full flex-center",
  top: "fixed-top justify-center",
  bottom: "fixed-bottom justify-center",
  right: "fixed-right items-center",
  left: "fixed-left items-center"
};
const transitions = {
  standard: ["scale", "scale"],
  top: ["slide-down", "slide-up"],
  bottom: ["slide-up", "slide-down"],
  right: ["slide-left", "slide-right"],
  left: ["slide-right", "slide-left"]
};
var QDialog = createComponent({
  name: "QDialog",
  inheritAttrs: false,
  props: {
    ...useModelToggleProps,
    ...useTransitionProps,
    transitionShow: String,
    transitionHide: String,
    persistent: Boolean,
    autoClose: Boolean,
    allowFocusOutside: Boolean,
    noEscDismiss: Boolean,
    noBackdropDismiss: Boolean,
    noRouteDismiss: Boolean,
    noRefocus: Boolean,
    noFocus: Boolean,
    noShake: Boolean,
    seamless: Boolean,
    maximized: Boolean,
    fullWidth: Boolean,
    fullHeight: Boolean,
    square: Boolean,
    position: {
      type: String,
      default: "standard",
      validator: (val) => val === "standard" || ["top", "bottom", "left", "right"].includes(val)
    }
  },
  emits: [
    ...useModelToggleEmits,
    "shake",
    "click",
    "escape-key"
  ],
  setup(props, { slots, emit: emit2, attrs }) {
    const vm = getCurrentInstance();
    const innerRef = ref(null);
    const showing = ref(false);
    const transitionState = ref(false);
    const animating = ref(false);
    let shakeTimeout, refocusTarget = null, isMaximized, avoidAutoClose;
    const hideOnRouteChange = computed(() => props.persistent !== true && props.noRouteDismiss !== true && props.seamless !== true);
    const { preventBodyScroll } = usePreventScroll();
    const { registerTimeout, removeTimeout } = useTimeout();
    const { registerTick, removeTick } = useTick();
    const { showPortal, hidePortal, portalIsAccessible, renderPortal } = usePortal(vm, innerRef, renderPortalContent, true);
    const { hide } = useModelToggle({
      showing,
      hideOnRouteChange,
      handleShow,
      handleHide,
      processOnMount: true
    });
    const { addToHistory, removeFromHistory } = useHistory(showing, hide, hideOnRouteChange);
    const classes = computed(() => `q-dialog__inner flex no-pointer-events q-dialog__inner--${props.maximized === true ? "maximized" : "minimized"} q-dialog__inner--${props.position} ${positionClass[props.position]}` + (animating.value === true ? " q-dialog__inner--animating" : "") + (props.fullWidth === true ? " q-dialog__inner--fullwidth" : "") + (props.fullHeight === true ? " q-dialog__inner--fullheight" : "") + (props.square === true ? " q-dialog__inner--square" : ""));
    const transitionShow = computed(() => "q-transition--" + (props.transitionShow === void 0 ? transitions[props.position][0] : props.transitionShow));
    const transitionHide = computed(() => "q-transition--" + (props.transitionHide === void 0 ? transitions[props.position][1] : props.transitionHide));
    const transition = computed(() => transitionState.value === true ? transitionHide.value : transitionShow.value);
    const transitionStyle = computed(() => `--q-transition-duration: ${props.transitionDuration}ms`);
    const useBackdrop = computed(() => showing.value === true && props.seamless !== true);
    const onEvents = computed(() => props.autoClose === true ? { onClick: onAutoClose } : {});
    const rootClasses = computed(() => [
      `q-dialog fullscreen no-pointer-events q-dialog--${useBackdrop.value === true ? "modal" : "seamless"}`,
      attrs.class
    ]);
    watch(showing, (val) => {
      nextTick(() => {
        transitionState.value = val;
      });
    });
    watch(() => props.maximized, (state) => {
      showing.value === true && updateMaximized(state);
    });
    watch(useBackdrop, (val) => {
      preventBodyScroll(val);
      if (val === true) {
        addFocusout(onFocusChange);
        addEscapeKey(onEscapeKey);
      } else {
        removeFocusout(onFocusChange);
        removeEscapeKey(onEscapeKey);
      }
    });
    function handleShow(evt) {
      removeTimeout();
      removeTick();
      addToHistory();
      refocusTarget = props.noRefocus === false && document.activeElement !== null ? document.activeElement : null;
      updateMaximized(props.maximized);
      showPortal();
      animating.value = true;
      if (props.noFocus !== true) {
        document.activeElement !== null && document.activeElement.blur();
        registerTick(focus);
      }
      registerTimeout(() => {
        if (vm.proxy.$q.platform.is.ios === true) {
          if (props.seamless !== true && document.activeElement) {
            const { top, bottom } = document.activeElement.getBoundingClientRect(), { innerHeight } = window, height = window.visualViewport !== void 0 ? window.visualViewport.height : innerHeight;
            if (top > 0 && bottom > height / 2) {
              document.scrollingElement.scrollTop = Math.min(document.scrollingElement.scrollHeight - height, bottom >= innerHeight ? Infinity : Math.ceil(document.scrollingElement.scrollTop + bottom - height / 2));
            }
            document.activeElement.scrollIntoView();
          }
          avoidAutoClose = true;
          innerRef.value.click();
          avoidAutoClose = false;
        }
        showPortal(true);
        animating.value = false;
        emit2("show", evt);
      }, props.transitionDuration);
    }
    function handleHide(evt) {
      removeTimeout();
      removeTick();
      removeFromHistory();
      cleanup(true);
      animating.value = true;
      hidePortal();
      if (refocusTarget !== null) {
        refocusTarget.focus();
        refocusTarget = null;
      }
      registerTimeout(() => {
        hidePortal(true);
        animating.value = false;
        emit2("hide", evt);
      }, props.transitionDuration);
    }
    function focus(selector) {
      addFocusFn(() => {
        let node = innerRef.value;
        if (node === null || node.contains(document.activeElement) === true) {
          return;
        }
        node = node.querySelector(selector || "[autofocus], [data-autofocus]") || node;
        node.focus({ preventScroll: true });
      });
    }
    function shake() {
      focus();
      emit2("shake");
      const node = innerRef.value;
      if (node !== null) {
        node.classList.remove("q-animate--scale");
        node.classList.add("q-animate--scale");
        clearTimeout(shakeTimeout);
        shakeTimeout = setTimeout(() => {
          if (innerRef.value !== null) {
            node.classList.remove("q-animate--scale");
            focus();
          }
        }, 170);
      }
    }
    function onEscapeKey() {
      if (props.seamless !== true) {
        if (props.persistent === true || props.noEscDismiss === true) {
          props.maximized !== true && props.noShake !== true && shake();
        } else {
          emit2("escape-key");
          hide();
        }
      }
    }
    function cleanup(hiding) {
      clearTimeout(shakeTimeout);
      if (hiding === true || showing.value === true) {
        updateMaximized(false);
        if (props.seamless !== true) {
          preventBodyScroll(false);
          removeFocusout(onFocusChange);
          removeEscapeKey(onEscapeKey);
        }
      }
      if (hiding !== true) {
        refocusTarget = null;
      }
    }
    function updateMaximized(active) {
      if (active === true) {
        if (isMaximized !== true) {
          maximizedModals < 1 && document.body.classList.add("q-body--dialog");
          maximizedModals++;
          isMaximized = true;
        }
      } else if (isMaximized === true) {
        if (maximizedModals < 2) {
          document.body.classList.remove("q-body--dialog");
        }
        maximizedModals--;
        isMaximized = false;
      }
    }
    function onAutoClose(e) {
      if (avoidAutoClose !== true) {
        hide(e);
        emit2("click", e);
      }
    }
    function onBackdropClick(e) {
      if (props.persistent !== true && props.noBackdropDismiss !== true) {
        hide(e);
      } else if (props.noShake !== true) {
        shake();
      }
    }
    function onFocusChange(evt) {
      if (props.allowFocusOutside !== true && portalIsAccessible.value === true && childHasFocus(innerRef.value, evt.target) !== true) {
        focus('[tabindex]:not([tabindex="-1"])');
      }
    }
    Object.assign(vm.proxy, {
      focus,
      shake,
      __updateRefocusTarget(target2) {
        refocusTarget = target2 || null;
      }
    });
    onBeforeUnmount(cleanup);
    function renderPortalContent() {
      return h("div", {
        ...attrs,
        class: rootClasses.value
      }, [
        h(Transition, {
          name: "q-transition--fade",
          appear: true
        }, () => useBackdrop.value === true ? h("div", {
          class: "q-dialog__backdrop fixed-full",
          style: transitionStyle.value,
          "aria-hidden": "true",
          onMousedown: onBackdropClick
        }) : null),
        h(Transition, { name: transition.value, appear: true }, () => showing.value === true ? h("div", {
          ref: innerRef,
          class: classes.value,
          style: transitionStyle.value,
          tabindex: -1,
          ...onEvents.value
        }, hSlot(slots.default)) : null)
      ]);
    }
    return renderPortal;
  }
});
const useSizeDefaults = {
  xs: 18,
  sm: 24,
  md: 32,
  lg: 38,
  xl: 46
};
const useSizeProps = {
  size: String
};
function useSize(props, sizes = useSizeDefaults) {
  return computed(() => props.size !== void 0 ? { fontSize: props.size in sizes ? `${sizes[props.size]}px` : props.size } : null);
}
const defaultViewBox = "0 0 24 24";
const sameFn = (i) => i;
const ionFn = (i) => `ionicons ${i}`;
const libMap = {
  "mdi-": (i) => `mdi ${i}`,
  "icon-": sameFn,
  "bt-": (i) => `bt ${i}`,
  "eva-": (i) => `eva ${i}`,
  "ion-md": ionFn,
  "ion-ios": ionFn,
  "ion-logo": ionFn,
  "iconfont ": sameFn,
  "ti-": (i) => `themify-icon ${i}`,
  "bi-": (i) => `bootstrap-icons ${i}`
};
const matMap = {
  o_: "-outlined",
  r_: "-round",
  s_: "-sharp"
};
const symMap = {
  sym_o_: "-outlined",
  sym_r_: "-rounded",
  sym_s_: "-sharp"
};
const libRE = new RegExp("^(" + Object.keys(libMap).join("|") + ")");
const matRE = new RegExp("^(" + Object.keys(matMap).join("|") + ")");
const symRE = new RegExp("^(" + Object.keys(symMap).join("|") + ")");
const mRE = /^[Mm]\s?[-+]?\.?\d/;
const imgRE = /^img:/;
const svgUseRE = /^svguse:/;
const ionRE = /^ion-/;
const faRE = /^(fa-(solid|regular|light|brands|duotone|thin)|[lf]a[srlbdk]?) /;
var QIcon = createComponent({
  name: "QIcon",
  props: {
    ...useSizeProps,
    tag: {
      type: String,
      default: "i"
    },
    name: String,
    color: String,
    left: Boolean,
    right: Boolean
  },
  setup(props, { slots }) {
    const { proxy: { $q } } = getCurrentInstance();
    const sizeStyle = useSize(props);
    const classes = computed(() => "q-icon" + (props.left === true ? " on-left" : "") + (props.right === true ? " on-right" : "") + (props.color !== void 0 ? ` text-${props.color}` : ""));
    const type = computed(() => {
      let cls;
      let icon = props.name;
      if (icon === "none" || !icon) {
        return { none: true };
      }
      if ($q.iconMapFn !== null) {
        const res = $q.iconMapFn(icon);
        if (res !== void 0) {
          if (res.icon !== void 0) {
            icon = res.icon;
            if (icon === "none" || !icon) {
              return { none: true };
            }
          } else {
            return {
              cls: res.cls,
              content: res.content !== void 0 ? res.content : " "
            };
          }
        }
      }
      if (mRE.test(icon) === true) {
        const [def2, viewBox = defaultViewBox] = icon.split("|");
        return {
          svg: true,
          viewBox,
          nodes: def2.split("&&").map((path) => {
            const [d, style, transform] = path.split("@@");
            return h("path", { style, d, transform });
          })
        };
      }
      if (imgRE.test(icon) === true) {
        return {
          img: true,
          src: icon.substring(4)
        };
      }
      if (svgUseRE.test(icon) === true) {
        const [def2, viewBox = defaultViewBox] = icon.split("|");
        return {
          svguse: true,
          src: def2.substring(7),
          viewBox
        };
      }
      let content = " ";
      const matches = icon.match(libRE);
      if (matches !== null) {
        cls = libMap[matches[1]](icon);
      } else if (faRE.test(icon) === true) {
        cls = icon;
      } else if (ionRE.test(icon) === true) {
        cls = `ionicons ion-${$q.platform.is.ios === true ? "ios" : "md"}${icon.substring(3)}`;
      } else if (symRE.test(icon) === true) {
        cls = "notranslate material-symbols";
        const matches2 = icon.match(symRE);
        if (matches2 !== null) {
          icon = icon.substring(6);
          cls += symMap[matches2[1]];
        }
        content = icon;
      } else {
        cls = "notranslate material-icons";
        const matches2 = icon.match(matRE);
        if (matches2 !== null) {
          icon = icon.substring(2);
          cls += matMap[matches2[1]];
        }
        content = icon;
      }
      return {
        cls,
        content
      };
    });
    return () => {
      const data = {
        class: classes.value,
        style: sizeStyle.value,
        "aria-hidden": "true",
        role: "presentation"
      };
      if (type.value.none === true) {
        return h(props.tag, data, hSlot(slots.default));
      }
      if (type.value.img === true) {
        return h("span", data, hMergeSlot(slots.default, [
          h("img", { src: type.value.src })
        ]));
      }
      if (type.value.svg === true) {
        return h("span", data, hMergeSlot(slots.default, [
          h("svg", {
            viewBox: type.value.viewBox || "0 0 24 24"
          }, type.value.nodes)
        ]));
      }
      if (type.value.svguse === true) {
        return h("span", data, hMergeSlot(slots.default, [
          h("svg", {
            viewBox: type.value.viewBox
          }, [
            h("use", { "xlink:href": type.value.src })
          ])
        ]));
      }
      if (type.value.cls !== void 0) {
        data.class += " " + type.value.cls;
      }
      return h(props.tag, data, hMergeSlot(slots.default, [
        type.value.content
      ]));
    };
  }
});
const useSpinnerProps = {
  size: {
    type: [Number, String],
    default: "1em"
  },
  color: String
};
function useSpinner(props) {
  return {
    cSize: computed(() => props.size in useSizeDefaults ? `${useSizeDefaults[props.size]}px` : props.size),
    classes: computed(() => "q-spinner" + (props.color ? ` text-${props.color}` : ""))
  };
}
var QSpinner = createComponent({
  name: "QSpinner",
  props: {
    ...useSpinnerProps,
    thickness: {
      type: Number,
      default: 5
    }
  },
  setup(props) {
    const { cSize, classes } = useSpinner(props);
    return () => h("svg", {
      class: classes.value + " q-spinner-mat",
      width: cSize.value,
      height: cSize.value,
      viewBox: "25 25 50 50"
    }, [
      h("circle", {
        class: "path",
        cx: "50",
        cy: "50",
        r: "20",
        fill: "none",
        stroke: "currentColor",
        "stroke-width": props.thickness,
        "stroke-miterlimit": "10"
      })
    ]);
  }
});
function throttle(fn, limit = 250) {
  let wait = false, result;
  return function() {
    if (wait === false) {
      wait = true;
      setTimeout(() => {
        wait = false;
      }, limit);
      result = fn.apply(this, arguments);
    }
    return result;
  };
}
function showRipple(evt, el, ctx, forceCenter) {
  ctx.modifiers.stop === true && stop(evt);
  const color = ctx.modifiers.color;
  let center = ctx.modifiers.center;
  center = center === true || forceCenter === true;
  const node = document.createElement("span"), innerNode = document.createElement("span"), pos = position(evt), { left, top, width, height } = el.getBoundingClientRect(), diameter2 = Math.sqrt(width * width + height * height), radius2 = diameter2 / 2, centerX = `${(width - diameter2) / 2}px`, x = center ? centerX : `${pos.left - left - radius2}px`, centerY = `${(height - diameter2) / 2}px`, y = center ? centerY : `${pos.top - top - radius2}px`;
  innerNode.className = "q-ripple__inner";
  css(innerNode, {
    height: `${diameter2}px`,
    width: `${diameter2}px`,
    transform: `translate3d(${x},${y},0) scale3d(.2,.2,1)`,
    opacity: 0
  });
  node.className = `q-ripple${color ? " text-" + color : ""}`;
  node.setAttribute("dir", "ltr");
  node.appendChild(innerNode);
  el.appendChild(node);
  const abort = () => {
    node.remove();
    clearTimeout(timer);
  };
  ctx.abort.push(abort);
  let timer = setTimeout(() => {
    innerNode.classList.add("q-ripple__inner--enter");
    innerNode.style.transform = `translate3d(${centerX},${centerY},0) scale3d(1,1,1)`;
    innerNode.style.opacity = 0.2;
    timer = setTimeout(() => {
      innerNode.classList.remove("q-ripple__inner--enter");
      innerNode.classList.add("q-ripple__inner--leave");
      innerNode.style.opacity = 0;
      timer = setTimeout(() => {
        node.remove();
        ctx.abort.splice(ctx.abort.indexOf(abort), 1);
      }, 275);
    }, 250);
  }, 50);
}
function updateModifiers(ctx, { modifiers, value, arg }) {
  const cfg = Object.assign({}, ctx.cfg.ripple, modifiers, value);
  ctx.modifiers = {
    early: cfg.early === true,
    stop: cfg.stop === true,
    center: cfg.center === true,
    color: cfg.color || arg,
    keyCodes: [].concat(cfg.keyCodes || 13)
  };
}
var Ripple = createDirective({
  name: "ripple",
  beforeMount(el, binding) {
    const ctx = {
      cfg: binding.instance.$.appContext.config.globalProperties.$q.config,
      enabled: binding.value !== false,
      modifiers: {},
      abort: [],
      start(evt) {
        if (ctx.enabled === true && evt.qSkipRipple !== true && evt.type === (ctx.modifiers.early === true ? "pointerdown" : "click")) {
          showRipple(evt, el, ctx, evt.qKeyEvent === true);
        }
      },
      keystart: throttle((evt) => {
        if (ctx.enabled === true && evt.qSkipRipple !== true && isKeyCode(evt, ctx.modifiers.keyCodes) === true && evt.type === `key${ctx.modifiers.early === true ? "down" : "up"}`) {
          showRipple(evt, el, ctx, true);
        }
      }, 300)
    };
    updateModifiers(ctx, binding);
    el.__qripple = ctx;
    addEvt(ctx, "main", [
      [el, "pointerdown", "start", "passive"],
      [el, "click", "start", "passive"],
      [el, "keydown", "keystart", "passive"],
      [el, "keyup", "keystart", "passive"]
    ]);
  },
  updated(el, binding) {
    if (binding.oldValue !== binding.value) {
      const ctx = el.__qripple;
      ctx.enabled = binding.value !== false;
      if (ctx.enabled === true && Object(binding.value) === binding.value) {
        updateModifiers(ctx, binding);
      }
    }
  },
  beforeUnmount(el) {
    const ctx = el.__qripple;
    ctx.abort.forEach((fn) => {
      fn();
    });
    cleanEvt(ctx, "main");
    delete el._qripple;
  }
});
const alignMap = {
  left: "start",
  center: "center",
  right: "end",
  between: "between",
  around: "around",
  evenly: "evenly",
  stretch: "stretch"
};
const alignValues = Object.keys(alignMap);
const useAlignProps = {
  align: {
    type: String,
    validator: (v) => alignValues.includes(v)
  }
};
function useAlign(props) {
  return computed(() => {
    const align = props.align === void 0 ? props.vertical === true ? "stretch" : "left" : props.align;
    return `${props.vertical === true ? "items" : "justify"}-${alignMap[align]}`;
  });
}
function getOriginalPath(record) {
  return record ? record.aliasOf ? record.aliasOf.path : record.path : "";
}
function isSameRouteRecord(a, b) {
  return (a.aliasOf || a) === (b.aliasOf || b);
}
function includesParams(outer, inner) {
  for (const key in inner) {
    const innerValue = inner[key], outerValue = outer[key];
    if (typeof innerValue === "string") {
      if (innerValue !== outerValue) {
        return false;
      }
    } else if (Array.isArray(outerValue) === false || outerValue.length !== innerValue.length || innerValue.some((value, i) => value !== outerValue[i])) {
      return false;
    }
  }
  return true;
}
function isEquivalentArray(a, b) {
  return Array.isArray(b) === true ? a.length === b.length && a.every((value, i) => value === b[i]) : a.length === 1 && a[0] === b;
}
function isSameRouteLocationParamsValue(a, b) {
  return Array.isArray(a) === true ? isEquivalentArray(a, b) : Array.isArray(b) === true ? isEquivalentArray(b, a) : a === b;
}
function isSameRouteLocationParams(a, b) {
  if (Object.keys(a).length !== Object.keys(b).length) {
    return false;
  }
  for (const key in a) {
    if (isSameRouteLocationParamsValue(a[key], b[key]) === false) {
      return false;
    }
  }
  return true;
}
const useRouterLinkProps = {
  to: [String, Object],
  replace: Boolean,
  exact: Boolean,
  activeClass: {
    type: String,
    default: "q-router-link--active"
  },
  exactActiveClass: {
    type: String,
    default: "q-router-link--exact-active"
  },
  href: String,
  target: String,
  disable: Boolean
};
function useRouterLink(fallbackTag) {
  const vm = getCurrentInstance();
  const { props, proxy } = vm;
  const hasRouter = vmHasRouter(vm);
  const hasHrefLink = computed(() => props.disable !== true && props.href !== void 0);
  const hasRouterLinkProps = computed(() => hasRouter === true && props.disable !== true && hasHrefLink.value !== true && props.to !== void 0 && props.to !== null && props.to !== "");
  const linkRoute = computed(() => {
    if (hasRouterLinkProps.value === true) {
      try {
        return proxy.$router.resolve(props.to);
      } catch (err) {
      }
    }
    return null;
  });
  const hasRouterLink = computed(() => linkRoute.value !== null);
  const hasLink = computed(() => hasHrefLink.value === true || hasRouterLink.value === true);
  const linkTag = computed(() => props.type === "a" || hasLink.value === true ? "a" : props.tag || fallbackTag || "div");
  const linkProps = computed(() => hasHrefLink.value === true ? {
    href: props.href,
    target: props.target
  } : hasRouterLink.value === true ? {
    href: linkRoute.value.href,
    target: props.target
  } : {});
  const linkActiveIndex = computed(() => {
    if (hasRouterLink.value === false) {
      return null;
    }
    const { matched } = linkRoute.value, { length } = matched, routeMatched = matched[length - 1];
    if (routeMatched === void 0) {
      return -1;
    }
    const currentMatched = proxy.$route.matched;
    if (currentMatched.length === 0) {
      return -1;
    }
    const index = currentMatched.findIndex(isSameRouteRecord.bind(null, routeMatched));
    if (index > -1) {
      return index;
    }
    const parentRecordPath = getOriginalPath(matched[length - 2]);
    return length > 1 && getOriginalPath(routeMatched) === parentRecordPath && currentMatched[currentMatched.length - 1].path !== parentRecordPath ? currentMatched.findIndex(isSameRouteRecord.bind(null, matched[length - 2])) : index;
  });
  const linkIsActive = computed(() => hasRouterLink.value === true && linkActiveIndex.value > -1 && includesParams(proxy.$route.params, linkRoute.value.params));
  const linkIsExactActive = computed(() => linkIsActive.value === true && linkActiveIndex.value === proxy.$route.matched.length - 1 && isSameRouteLocationParams(proxy.$route.params, linkRoute.value.params));
  const linkClass = computed(() => hasRouterLink.value === true ? linkIsExactActive.value === true ? ` ${props.exactActiveClass} ${props.activeClass}` : props.exact === true ? "" : linkIsActive.value === true ? ` ${props.activeClass}` : "" : "");
  function navigateToRouterLink(e) {
    if (props.disable === true || e.metaKey || e.altKey || e.ctrlKey || e.shiftKey || e.__qNavigate !== true && e.defaultPrevented === true || e.button !== void 0 && e.button !== 0 || props.target === "_blank") {
      return false;
    }
    prevent(e);
    return proxy.$router[props.replace === true ? "replace" : "push"](props.to).catch((err) => err);
  }
  return {
    hasRouterLink,
    hasHrefLink,
    hasLink,
    linkTag,
    linkRoute,
    linkIsActive,
    linkIsExactActive,
    linkClass,
    linkProps,
    navigateToRouterLink
  };
}
const padding = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32
};
const defaultSizes = {
  xs: 8,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 24
};
const formTypes = ["button", "submit", "reset"];
const mediaTypeRE = /[^\s]\/[^\s]/;
const useBtnProps = {
  ...useSizeProps,
  ...useRouterLinkProps,
  type: {
    type: String,
    default: "button"
  },
  label: [Number, String],
  icon: String,
  iconRight: String,
  round: Boolean,
  outline: Boolean,
  flat: Boolean,
  unelevated: Boolean,
  rounded: Boolean,
  push: Boolean,
  glossy: Boolean,
  size: String,
  fab: Boolean,
  fabMini: Boolean,
  padding: String,
  color: String,
  textColor: String,
  noCaps: Boolean,
  noWrap: Boolean,
  dense: Boolean,
  tabindex: [Number, String],
  ripple: {
    type: [Boolean, Object],
    default: true
  },
  align: {
    ...useAlignProps.align,
    default: "center"
  },
  stack: Boolean,
  stretch: Boolean,
  loading: {
    type: Boolean,
    default: null
  },
  disable: Boolean
};
function useBtn(props) {
  const sizeStyle = useSize(props, defaultSizes);
  const alignClass = useAlign(props);
  const { hasRouterLink, hasLink, linkTag, linkProps, navigateToRouterLink } = useRouterLink("button");
  const style = computed(() => {
    const obj = props.fab === false && props.fabMini === false ? sizeStyle.value : {};
    return props.padding !== void 0 ? Object.assign({}, obj, {
      padding: props.padding.split(/\s+/).map((v) => v in padding ? padding[v] + "px" : v).join(" "),
      minWidth: "0",
      minHeight: "0"
    }) : obj;
  });
  const isRounded = computed(() => props.rounded === true || props.fab === true || props.fabMini === true);
  const isActionable = computed(() => props.disable !== true && props.loading !== true);
  const tabIndex = computed(() => isActionable.value === true ? props.tabindex || 0 : -1);
  const design = computed(() => {
    if (props.flat === true)
      return "flat";
    if (props.outline === true)
      return "outline";
    if (props.push === true)
      return "push";
    if (props.unelevated === true)
      return "unelevated";
    return "standard";
  });
  const attributes = computed(() => {
    const acc = { tabindex: tabIndex.value };
    if (hasLink.value === true) {
      Object.assign(acc, linkProps.value);
    } else if (formTypes.includes(props.type) === true) {
      acc.type = props.type;
    }
    if (linkTag.value === "a") {
      if (props.disable === true) {
        acc["aria-disabled"] = "true";
      } else if (acc.href === void 0) {
        acc.role = "button";
      }
      if (hasRouterLink.value !== true && mediaTypeRE.test(props.type) === true) {
        acc.type = props.type;
      }
    } else if (props.disable === true) {
      acc.disabled = "";
      acc["aria-disabled"] = "true";
    }
    if (props.loading === true && props.percentage !== void 0) {
      Object.assign(acc, {
        role: "progressbar",
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        "aria-valuenow": props.percentage
      });
    }
    return acc;
  });
  const classes = computed(() => {
    let colors;
    if (props.color !== void 0) {
      if (props.flat === true || props.outline === true) {
        colors = `text-${props.textColor || props.color}`;
      } else {
        colors = `bg-${props.color} text-${props.textColor || "white"}`;
      }
    } else if (props.textColor) {
      colors = `text-${props.textColor}`;
    }
    return `q-btn--${design.value} q-btn--${props.round === true ? "round" : `rectangle${isRounded.value === true ? " q-btn--rounded" : ""}`}` + (colors !== void 0 ? " " + colors : "") + (isActionable.value === true ? " q-btn--actionable q-focusable q-hoverable" : props.disable === true ? " disabled" : "") + (props.fab === true ? " q-btn--fab" : props.fabMini === true ? " q-btn--fab-mini" : "") + (props.noCaps === true ? " q-btn--no-uppercase" : "") + (props.dense === true ? " q-btn--dense" : "") + (props.stretch === true ? " no-border-radius self-stretch" : "") + (props.glossy === true ? " glossy" : "");
  });
  const innerClasses = computed(() => alignClass.value + (props.stack === true ? " column" : " row") + (props.noWrap === true ? " no-wrap text-no-wrap" : "") + (props.loading === true ? " q-btn__content--hidden" : ""));
  return {
    classes,
    style,
    innerClasses,
    attributes,
    hasRouterLink,
    hasLink,
    linkTag,
    navigateToRouterLink,
    isActionable
  };
}
const { passiveCapture } = listenOpts;
let touchTarget = null, keyboardTarget = null, mouseTarget = null;
var QBtn = createComponent({
  name: "QBtn",
  props: {
    ...useBtnProps,
    percentage: Number,
    darkPercentage: Boolean
  },
  emits: ["click", "keydown", "touchstart", "mousedown", "keyup"],
  setup(props, { slots, emit: emit2 }) {
    const { proxy } = getCurrentInstance();
    const {
      classes,
      style,
      innerClasses,
      attributes,
      hasRouterLink,
      hasLink,
      linkTag,
      navigateToRouterLink,
      isActionable
    } = useBtn(props);
    const rootRef = ref(null);
    const blurTargetRef = ref(null);
    let localTouchTargetEl = null, avoidMouseRipple, mouseTimer;
    const hasLabel = computed(() => props.label !== void 0 && props.label !== null && props.label !== "");
    const ripple = computed(() => props.disable === true || props.ripple === false ? false : {
      keyCodes: hasLink.value === true ? [13, 32] : [13],
      ...props.ripple === true ? {} : props.ripple
    });
    const rippleProps = computed(() => ({ center: props.round }));
    const percentageStyle = computed(() => {
      const val = Math.max(0, Math.min(100, props.percentage));
      return val > 0 ? { transition: "transform 0.6s", transform: `translateX(${val - 100}%)` } : {};
    });
    const onEvents = computed(() => {
      if (props.loading === true) {
        return {
          onMousedown: onLoadingEvt,
          onTouchstartPassive: onLoadingEvt,
          onClick: onLoadingEvt,
          onKeydown: onLoadingEvt,
          onKeyup: onLoadingEvt
        };
      }
      if (isActionable.value === true) {
        return {
          onClick,
          onKeydown: onKeydown2,
          onMousedown,
          onTouchstart
        };
      }
      return {
        onClick: stopAndPrevent
      };
    });
    const nodeProps = computed(() => ({
      ref: rootRef,
      class: "q-btn q-btn-item non-selectable no-outline " + classes.value,
      style: style.value,
      ...attributes.value,
      ...onEvents.value
    }));
    function onClick(e) {
      if (rootRef.value === null) {
        return;
      }
      if (e !== void 0) {
        if (e.defaultPrevented === true) {
          return;
        }
        const el = document.activeElement;
        if (props.type === "submit" && el !== document.body && rootRef.value.contains(el) === false && el.contains(rootRef.value) === false) {
          rootRef.value.focus();
          const onClickCleanup = () => {
            document.removeEventListener("keydown", stopAndPrevent, true);
            document.removeEventListener("keyup", onClickCleanup, passiveCapture);
            rootRef.value !== null && rootRef.value.removeEventListener("blur", onClickCleanup, passiveCapture);
          };
          document.addEventListener("keydown", stopAndPrevent, true);
          document.addEventListener("keyup", onClickCleanup, passiveCapture);
          rootRef.value.addEventListener("blur", onClickCleanup, passiveCapture);
        }
      }
      if (hasRouterLink.value === true) {
        const go = () => {
          e.__qNavigate = true;
          navigateToRouterLink(e);
        };
        emit2("click", e, go);
        e.defaultPrevented !== true && go();
      } else {
        emit2("click", e);
      }
    }
    function onKeydown2(e) {
      if (rootRef.value === null) {
        return;
      }
      emit2("keydown", e);
      if (isKeyCode(e, [13, 32]) === true && keyboardTarget !== rootRef.value) {
        keyboardTarget !== null && cleanup();
        if (e.defaultPrevented !== true) {
          rootRef.value.focus();
          keyboardTarget = rootRef.value;
          rootRef.value.classList.add("q-btn--active");
          document.addEventListener("keyup", onPressEnd, true);
          rootRef.value.addEventListener("blur", onPressEnd, passiveCapture);
        }
        stopAndPrevent(e);
      }
    }
    function onTouchstart(e) {
      if (rootRef.value === null) {
        return;
      }
      emit2("touchstart", e);
      if (e.defaultPrevented === true) {
        return;
      }
      if (touchTarget !== rootRef.value) {
        touchTarget !== null && cleanup();
        touchTarget = rootRef.value;
        localTouchTargetEl = e.target;
        localTouchTargetEl.addEventListener("touchcancel", onPressEnd, passiveCapture);
        localTouchTargetEl.addEventListener("touchend", onPressEnd, passiveCapture);
      }
      avoidMouseRipple = true;
      clearTimeout(mouseTimer);
      mouseTimer = setTimeout(() => {
        avoidMouseRipple = false;
      }, 200);
    }
    function onMousedown(e) {
      if (rootRef.value === null) {
        return;
      }
      e.qSkipRipple = avoidMouseRipple === true;
      emit2("mousedown", e);
      if (e.defaultPrevented !== true && mouseTarget !== rootRef.value) {
        mouseTarget !== null && cleanup();
        mouseTarget = rootRef.value;
        rootRef.value.classList.add("q-btn--active");
        document.addEventListener("mouseup", onPressEnd, passiveCapture);
      }
    }
    function onPressEnd(e) {
      if (rootRef.value === null) {
        return;
      }
      if (e !== void 0 && e.type === "blur" && document.activeElement === rootRef.value) {
        return;
      }
      if (e !== void 0 && e.type === "keyup") {
        if (keyboardTarget === rootRef.value && isKeyCode(e, [13, 32]) === true) {
          const evt = new MouseEvent("click", e);
          evt.qKeyEvent = true;
          e.defaultPrevented === true && prevent(evt);
          e.cancelBubble === true && stop(evt);
          rootRef.value.dispatchEvent(evt);
          stopAndPrevent(e);
          e.qKeyEvent = true;
        }
        emit2("keyup", e);
      }
      cleanup();
    }
    function cleanup(destroying) {
      const blurTarget = blurTargetRef.value;
      if (destroying !== true && (touchTarget === rootRef.value || mouseTarget === rootRef.value) && blurTarget !== null && blurTarget !== document.activeElement) {
        blurTarget.setAttribute("tabindex", -1);
        blurTarget.focus();
      }
      if (touchTarget === rootRef.value) {
        if (localTouchTargetEl !== null) {
          localTouchTargetEl.removeEventListener("touchcancel", onPressEnd, passiveCapture);
          localTouchTargetEl.removeEventListener("touchend", onPressEnd, passiveCapture);
        }
        touchTarget = localTouchTargetEl = null;
      }
      if (mouseTarget === rootRef.value) {
        document.removeEventListener("mouseup", onPressEnd, passiveCapture);
        mouseTarget = null;
      }
      if (keyboardTarget === rootRef.value) {
        document.removeEventListener("keyup", onPressEnd, true);
        rootRef.value !== null && rootRef.value.removeEventListener("blur", onPressEnd, passiveCapture);
        keyboardTarget = null;
      }
      rootRef.value !== null && rootRef.value.classList.remove("q-btn--active");
    }
    function onLoadingEvt(evt) {
      stopAndPrevent(evt);
      evt.qSkipRipple = true;
    }
    onBeforeUnmount(() => {
      cleanup(true);
    });
    Object.assign(proxy, { click: onClick });
    return () => {
      let inner = [];
      props.icon !== void 0 && inner.push(h(QIcon, {
        name: props.icon,
        left: props.stack === false && hasLabel.value === true,
        role: "img",
        "aria-hidden": "true"
      }));
      hasLabel.value === true && inner.push(h("span", { class: "block" }, [props.label]));
      inner = hMergeSlot(slots.default, inner);
      if (props.iconRight !== void 0 && props.round === false) {
        inner.push(h(QIcon, {
          name: props.iconRight,
          right: props.stack === false && hasLabel.value === true,
          role: "img",
          "aria-hidden": "true"
        }));
      }
      const child = [
        h("span", {
          class: "q-focus-helper",
          ref: blurTargetRef
        })
      ];
      if (props.loading === true && props.percentage !== void 0) {
        child.push(h("span", {
          class: "q-btn__progress absolute-full overflow-hidden" + (props.darkPercentage === true ? " q-btn__progress--dark" : "")
        }, [
          h("span", {
            class: "q-btn__progress-indicator fit block",
            style: percentageStyle.value
          })
        ]));
      }
      child.push(h("span", {
        class: "q-btn__content text-center col items-center q-anchor--skip " + innerClasses.value
      }, inner));
      props.loading !== null && child.push(h(Transition, {
        name: "q-transition--fade"
      }, () => props.loading === true ? [
        h("span", {
          key: "loading",
          class: "absolute-full flex flex-center"
        }, slots.loading !== void 0 ? slots.loading() : [h(QSpinner)])
      ] : null));
      return withDirectives(h(linkTag.value, nodeProps.value, child), [[
        Ripple,
        ripple.value,
        void 0,
        rippleProps.value
      ]]);
    };
  }
});
const useDarkProps = {
  dark: {
    type: Boolean,
    default: null
  }
};
function useDark(props, $q) {
  return computed(() => props.dark === null ? $q.dark.isActive : props.dark);
}
var QCard = createComponent({
  name: "QCard",
  props: {
    ...useDarkProps,
    tag: {
      type: String,
      default: "div"
    },
    square: Boolean,
    flat: Boolean,
    bordered: Boolean
  },
  setup(props, { slots }) {
    const vm = getCurrentInstance();
    const isDark = useDark(props, vm.proxy.$q);
    const classes = computed(() => "q-card" + (isDark.value === true ? " q-card--dark q-dark" : "") + (props.bordered === true ? " q-card--bordered" : "") + (props.square === true ? " q-card--square no-border-radius" : "") + (props.flat === true ? " q-card--flat no-shadow" : ""));
    return () => h(props.tag, { class: classes.value }, hSlot(slots.default));
  }
});
var QCardSection = createComponent({
  name: "QCardSection",
  props: {
    tag: {
      type: String,
      default: "div"
    },
    horizontal: Boolean
  },
  setup(props, { slots }) {
    const classes = computed(() => `q-card__section q-card__section--${props.horizontal === true ? "horiz row no-wrap" : "vert"}`);
    return () => h(props.tag, { class: classes.value }, hSlot(slots.default));
  }
});
var QCardActions = createComponent({
  name: "QCardActions",
  props: {
    ...useAlignProps,
    vertical: Boolean
  },
  setup(props, { slots }) {
    const alignClass = useAlign(props);
    const classes = computed(() => `q-card__actions ${alignClass.value} q-card__actions--${props.vertical === true ? "vert column" : "horiz row"}`);
    return () => h("div", { class: classes.value }, hSlot(slots.default));
  }
});
const insetMap = {
  true: "inset",
  item: "item-inset",
  "item-thumbnail": "item-thumbnail-inset"
};
const margins = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24
};
var QSeparator = createComponent({
  name: "QSeparator",
  props: {
    ...useDarkProps,
    spaced: [Boolean, String],
    inset: [Boolean, String],
    vertical: Boolean,
    color: String,
    size: String
  },
  setup(props) {
    const vm = getCurrentInstance();
    const isDark = useDark(props, vm.proxy.$q);
    const orientation = computed(() => props.vertical === true ? "vertical" : "horizontal");
    const orientClass = computed(() => ` q-separator--${orientation.value}`);
    const insetClass = computed(() => props.inset !== false ? `${orientClass.value}-${insetMap[props.inset]}` : "");
    const classes = computed(() => `q-separator${orientClass.value}${insetClass.value}` + (props.color !== void 0 ? ` bg-${props.color}` : "") + (isDark.value === true ? " q-separator--dark" : ""));
    const style = computed(() => {
      const acc = {};
      if (props.size !== void 0) {
        acc[props.vertical === true ? "width" : "height"] = props.size;
      }
      if (props.spaced !== false) {
        const size2 = props.spaced === true ? `${margins.md}px` : props.spaced in margins ? `${margins[props.spaced]}px` : props.spaced;
        const dir = props.vertical === true ? ["Left", "Right"] : ["Top", "Bottom"];
        acc[`margin${dir[0]}`] = acc[`margin${dir[1]}`] = size2;
      }
      return acc;
    });
    return () => h("hr", {
      class: classes.value,
      style: style.value,
      "aria-orientation": orientation.value
    });
  }
});
function useFormChild({ validate, resetValidation, requiresQForm }) {
  const $form = inject(formKey, false);
  if ($form !== false) {
    const { props, proxy } = getCurrentInstance();
    Object.assign(proxy, { validate, resetValidation });
    watch(() => props.disable, (val) => {
      if (val === true) {
        typeof resetValidation === "function" && resetValidation();
        $form.unbindComponent(proxy);
      } else {
        $form.bindComponent(proxy);
      }
    });
    props.disable !== true && $form.bindComponent(proxy);
    onBeforeUnmount(() => {
      props.disable !== true && $form.unbindComponent(proxy);
    });
  } else if (requiresQForm === true) {
    console.error("Parent QForm not found on useFormChild()!");
  }
}
const hex = /^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/, hexa = /^#[0-9a-fA-F]{4}([0-9a-fA-F]{4})?$/, hexOrHexa = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, rgb = /^rgb\(((0|[1-9][\d]?|1[\d]{0,2}|2[\d]?|2[0-4][\d]|25[0-5]),){2}(0|[1-9][\d]?|1[\d]{0,2}|2[\d]?|2[0-4][\d]|25[0-5])\)$/, rgba = /^rgba\(((0|[1-9][\d]?|1[\d]{0,2}|2[\d]?|2[0-4][\d]|25[0-5]),){2}(0|[1-9][\d]?|1[\d]{0,2}|2[\d]?|2[0-4][\d]|25[0-5]),(0|0\.[0-9]+[1-9]|0\.[1-9]+|1)\)$/;
const testPattern = {
  date: (v) => /^-?[\d]+\/[0-1]\d\/[0-3]\d$/.test(v),
  time: (v) => /^([0-1]?\d|2[0-3]):[0-5]\d$/.test(v),
  fulltime: (v) => /^([0-1]?\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(v),
  timeOrFulltime: (v) => /^([0-1]?\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(v),
  email: (v) => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v),
  hexColor: (v) => hex.test(v),
  hexaColor: (v) => hexa.test(v),
  hexOrHexaColor: (v) => hexOrHexa.test(v),
  rgbColor: (v) => rgb.test(v),
  rgbaColor: (v) => rgba.test(v),
  rgbOrRgbaColor: (v) => rgb.test(v) || rgba.test(v),
  hexOrRgbColor: (v) => hex.test(v) || rgb.test(v),
  hexaOrRgbaColor: (v) => hexa.test(v) || rgba.test(v),
  anyColor: (v) => hexOrHexa.test(v) || rgb.test(v) || rgba.test(v)
};
"Boolean Number String Function Array Date RegExp Object".split(" ").forEach((name) => {
  name.toLowerCase();
});
const useCircularCommonProps = {
  ...useSizeProps,
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  },
  color: String,
  centerColor: String,
  trackColor: String,
  fontSize: String,
  thickness: {
    type: Number,
    default: 0.2,
    validator: (v) => v >= 0 && v <= 1
  },
  angle: {
    type: Number,
    default: 0
  },
  showValue: Boolean,
  reverse: Boolean,
  instantFeedback: Boolean
};
function between(v, min, max) {
  return max <= min ? min : Math.min(max, Math.max(min, v));
}
const radius = 50, diameter = 2 * radius, circumference = diameter * Math.PI, strokeDashArray = Math.round(circumference * 1e3) / 1e3;
createComponent({
  name: "QCircularProgress",
  props: {
    ...useCircularCommonProps,
    value: {
      type: Number,
      default: 0
    },
    animationSpeed: {
      type: [String, Number],
      default: 600
    },
    indeterminate: Boolean
  },
  setup(props, { slots }) {
    const { proxy: { $q } } = getCurrentInstance();
    const sizeStyle = useSize(props);
    const svgStyle = computed(() => {
      const angle = ($q.lang.rtl === true ? -1 : 1) * props.angle;
      return {
        transform: props.reverse !== ($q.lang.rtl === true) ? `scale3d(-1, 1, 1) rotate3d(0, 0, 1, ${-90 - angle}deg)` : `rotate3d(0, 0, 1, ${angle - 90}deg)`
      };
    });
    const circleStyle = computed(() => props.instantFeedback !== true && props.indeterminate !== true ? { transition: `stroke-dashoffset ${props.animationSpeed}ms ease 0s, stroke ${props.animationSpeed}ms ease` } : "");
    const viewBox = computed(() => diameter / (1 - props.thickness / 2));
    const viewBoxAttr = computed(() => `${viewBox.value / 2} ${viewBox.value / 2} ${viewBox.value} ${viewBox.value}`);
    const normalized = computed(() => between(props.value, props.min, props.max));
    const strokeDashOffset = computed(() => circumference * (1 - (normalized.value - props.min) / (props.max - props.min)));
    const strokeWidth = computed(() => props.thickness / 2 * viewBox.value);
    function getCircle({ thickness, offset, color, cls }) {
      return h("circle", {
        class: "q-circular-progress__" + cls + (color !== void 0 ? ` text-${color}` : ""),
        style: circleStyle.value,
        fill: "transparent",
        stroke: "currentColor",
        "stroke-width": thickness,
        "stroke-dasharray": strokeDashArray,
        "stroke-dashoffset": offset,
        cx: viewBox.value,
        cy: viewBox.value,
        r: radius
      });
    }
    return () => {
      const svgChild = [];
      props.centerColor !== void 0 && props.centerColor !== "transparent" && svgChild.push(h("circle", {
        class: `q-circular-progress__center text-${props.centerColor}`,
        fill: "currentColor",
        r: radius - strokeWidth.value / 2,
        cx: viewBox.value,
        cy: viewBox.value
      }));
      props.trackColor !== void 0 && props.trackColor !== "transparent" && svgChild.push(getCircle({
        cls: "track",
        thickness: strokeWidth.value,
        offset: 0,
        color: props.trackColor
      }));
      svgChild.push(getCircle({
        cls: "circle",
        thickness: strokeWidth.value,
        offset: strokeDashOffset.value,
        color: props.color
      }));
      const child = [
        h("svg", {
          class: "q-circular-progress__svg",
          style: svgStyle.value,
          viewBox: viewBoxAttr.value,
          "aria-hidden": "true"
        }, svgChild)
      ];
      props.showValue === true && child.push(h("div", {
        class: "q-circular-progress__text absolute-full row flex-center content-center",
        style: { fontSize: props.fontSize }
      }, slots.default !== void 0 ? slots.default() : [h("div", normalized.value)]));
      return h("div", {
        class: `q-circular-progress q-circular-progress--${props.indeterminate === true ? "in" : ""}determinate`,
        style: sizeStyle.value,
        role: "progressbar",
        "aria-valuemin": props.min,
        "aria-valuemax": props.max,
        "aria-valuenow": props.indeterminate === true ? void 0 : normalized.value
      }, hMergeSlotSafely(slots.internal, child));
    };
  }
});
const useFileEmits = ["rejected"];
const coreEmits = [
  ...useFileEmits,
  "start",
  "finish",
  "added",
  "removed"
];
const trueFn = () => true;
function getEmitsObject(emitsArray) {
  const emitsObject = {};
  emitsArray.forEach((val) => {
    emitsObject[val] = trueFn;
  });
  return emitsObject;
}
getEmitsObject(coreEmits);
let buf, bufIdx = 0;
const hexBytes = new Array(256);
for (let i = 0; i < 256; i++) {
  hexBytes[i] = (i + 256).toString(16).substring(1);
}
const randomBytes = (() => {
  const lib = typeof crypto !== "undefined" ? crypto : typeof window !== "undefined" ? window.crypto || window.msCrypto : void 0;
  if (lib !== void 0) {
    if (lib.randomBytes !== void 0) {
      return lib.randomBytes;
    }
    if (lib.getRandomValues !== void 0) {
      return (n) => {
        const bytes = new Uint8Array(n);
        lib.getRandomValues(bytes);
        return bytes;
      };
    }
  }
  return (n) => {
    const r = [];
    for (let i = n; i > 0; i--) {
      r.push(Math.floor(Math.random() * 256));
    }
    return r;
  };
})();
const BUFFER_SIZE = 4096;
function uid() {
  if (buf === void 0 || bufIdx + 16 > BUFFER_SIZE) {
    bufIdx = 0;
    buf = randomBytes(BUFFER_SIZE);
  }
  const b = Array.prototype.slice.call(buf, bufIdx, bufIdx += 16);
  b[6] = b[6] & 15 | 64;
  b[8] = b[8] & 63 | 128;
  return hexBytes[b[0]] + hexBytes[b[1]] + hexBytes[b[2]] + hexBytes[b[3]] + "-" + hexBytes[b[4]] + hexBytes[b[5]] + "-" + hexBytes[b[6]] + hexBytes[b[7]] + "-" + hexBytes[b[8]] + hexBytes[b[9]] + "-" + hexBytes[b[10]] + hexBytes[b[11]] + hexBytes[b[12]] + hexBytes[b[13]] + hexBytes[b[14]] + hexBytes[b[15]];
}
const lazyRulesValues = [true, false, "ondemand"];
const useValidateProps = {
  modelValue: {},
  error: {
    type: Boolean,
    default: null
  },
  errorMessage: String,
  noErrorIcon: Boolean,
  rules: Array,
  reactiveRules: Boolean,
  lazyRules: {
    type: [Boolean, String],
    validator: (v) => lazyRulesValues.includes(v)
  }
};
function useValidate(focused, innerLoading) {
  const { props, proxy } = getCurrentInstance();
  const innerError = ref(false);
  const innerErrorMessage = ref(null);
  const isDirtyModel = ref(null);
  useFormChild({ validate, resetValidation });
  let validateIndex = 0, unwatchRules;
  const hasRules = computed(() => props.rules !== void 0 && props.rules !== null && props.rules.length > 0);
  const hasActiveRules = computed(() => props.disable !== true && hasRules.value === true);
  const hasError = computed(() => props.error === true || innerError.value === true);
  const errorMessage = computed(() => typeof props.errorMessage === "string" && props.errorMessage.length > 0 ? props.errorMessage : innerErrorMessage.value);
  watch(() => props.modelValue, () => {
    validateIfNeeded();
  });
  watch(() => props.reactiveRules, (val) => {
    if (val === true) {
      if (unwatchRules === void 0) {
        unwatchRules = watch(() => props.rules, () => {
          validateIfNeeded(true);
        });
      }
    } else if (unwatchRules !== void 0) {
      unwatchRules();
      unwatchRules = void 0;
    }
  }, { immediate: true });
  watch(focused, (val) => {
    if (val === true) {
      if (isDirtyModel.value === null) {
        isDirtyModel.value = false;
      }
    } else if (isDirtyModel.value === false) {
      isDirtyModel.value = true;
      if (hasActiveRules.value === true && props.lazyRules !== "ondemand" && innerLoading.value === false) {
        debouncedValidate();
      }
    }
  });
  function resetValidation() {
    validateIndex++;
    innerLoading.value = false;
    isDirtyModel.value = null;
    innerError.value = false;
    innerErrorMessage.value = null;
    debouncedValidate.cancel();
  }
  function validate(val = props.modelValue) {
    if (hasActiveRules.value !== true) {
      return true;
    }
    const index = ++validateIndex;
    if (innerLoading.value !== true && props.lazyRules !== true) {
      isDirtyModel.value = true;
    }
    const update2 = (err, msg) => {
      if (innerError.value !== err) {
        innerError.value = err;
      }
      const m = msg || void 0;
      if (innerErrorMessage.value !== m) {
        innerErrorMessage.value = m;
      }
      innerLoading.value = false;
    };
    const promises = [];
    for (let i = 0; i < props.rules.length; i++) {
      const rule = props.rules[i];
      let res;
      if (typeof rule === "function") {
        res = rule(val);
      } else if (typeof rule === "string" && testPattern[rule] !== void 0) {
        res = testPattern[rule](val);
      }
      if (res === false || typeof res === "string") {
        update2(true, res);
        return false;
      } else if (res !== true && res !== void 0) {
        promises.push(res);
      }
    }
    if (promises.length === 0) {
      update2(false);
      return true;
    }
    innerLoading.value = true;
    return Promise.all(promises).then((res) => {
      if (res === void 0 || Array.isArray(res) === false || res.length === 0) {
        index === validateIndex && update2(false);
        return true;
      }
      const msg = res.find((r) => r === false || typeof r === "string");
      index === validateIndex && update2(msg !== void 0, msg);
      return msg === void 0;
    }, (e) => {
      if (index === validateIndex) {
        console.error(e);
        update2(true);
      }
      return false;
    });
  }
  function validateIfNeeded(changedRules) {
    if (hasActiveRules.value === true && props.lazyRules !== "ondemand" && (isDirtyModel.value === true || props.lazyRules !== true && changedRules !== true)) {
      debouncedValidate();
    }
  }
  const debouncedValidate = debounce(validate, 0);
  onBeforeUnmount(() => {
    unwatchRules !== void 0 && unwatchRules();
    debouncedValidate.cancel();
  });
  Object.assign(proxy, { resetValidation, validate });
  injectProp(proxy, "hasError", () => hasError.value);
  return {
    isDirtyModel,
    hasRules,
    hasError,
    errorMessage,
    validate,
    resetValidation
  };
}
const listenerRE = /^on[A-Z]/;
function useSplitAttrs(attrs, vnode) {
  const acc = {
    listeners: ref({}),
    attributes: ref({})
  };
  function update2() {
    const attributes = {};
    const listeners = {};
    for (const key in attrs) {
      if (key !== "class" && key !== "style" && listenerRE.test(key) === false) {
        attributes[key] = attrs[key];
      }
    }
    for (const key in vnode.props) {
      if (listenerRE.test(key) === true) {
        listeners[key] = vnode.props[key];
      }
    }
    acc.attributes.value = attributes;
    acc.listeners.value = listeners;
  }
  onBeforeUpdate(update2);
  update2();
  return acc;
}
function getTargetUid(val) {
  return val === void 0 ? `f_${uid()}` : val;
}
function fieldValueIsFilled(val) {
  return val !== void 0 && val !== null && ("" + val).length > 0;
}
const useFieldProps = {
  ...useDarkProps,
  ...useValidateProps,
  label: String,
  stackLabel: Boolean,
  hint: String,
  hideHint: Boolean,
  prefix: String,
  suffix: String,
  labelColor: String,
  color: String,
  bgColor: String,
  filled: Boolean,
  outlined: Boolean,
  borderless: Boolean,
  standout: [Boolean, String],
  square: Boolean,
  loading: Boolean,
  labelSlot: Boolean,
  bottomSlots: Boolean,
  hideBottomSpace: Boolean,
  rounded: Boolean,
  dense: Boolean,
  itemAligned: Boolean,
  counter: Boolean,
  clearable: Boolean,
  clearIcon: String,
  disable: Boolean,
  readonly: Boolean,
  autofocus: Boolean,
  for: String,
  maxlength: [Number, String]
};
const useFieldEmits = ["update:modelValue", "clear", "focus", "blur", "popup-show", "popup-hide"];
function useFieldState() {
  const { props, attrs, proxy, vnode } = getCurrentInstance();
  const isDark = useDark(props, proxy.$q);
  return {
    isDark,
    editable: computed(() => props.disable !== true && props.readonly !== true),
    innerLoading: ref(false),
    focused: ref(false),
    hasPopupOpen: false,
    splitAttrs: useSplitAttrs(attrs, vnode),
    targetUid: ref(getTargetUid(props.for)),
    rootRef: ref(null),
    targetRef: ref(null),
    controlRef: ref(null)
  };
}
function useField(state) {
  const { props, emit: emit2, slots, attrs, proxy } = getCurrentInstance();
  const { $q } = proxy;
  let focusoutTimer;
  if (state.hasValue === void 0) {
    state.hasValue = computed(() => fieldValueIsFilled(props.modelValue));
  }
  if (state.emitValue === void 0) {
    state.emitValue = (value) => {
      emit2("update:modelValue", value);
    };
  }
  if (state.controlEvents === void 0) {
    state.controlEvents = {
      onFocusin: onControlFocusin,
      onFocusout: onControlFocusout
    };
  }
  Object.assign(state, {
    clearValue,
    onControlFocusin,
    onControlFocusout,
    focus
  });
  if (state.computedCounter === void 0) {
    state.computedCounter = computed(() => {
      if (props.counter !== false) {
        const len = typeof props.modelValue === "string" || typeof props.modelValue === "number" ? ("" + props.modelValue).length : Array.isArray(props.modelValue) === true ? props.modelValue.length : 0;
        const max = props.maxlength !== void 0 ? props.maxlength : props.maxValues;
        return len + (max !== void 0 ? " / " + max : "");
      }
    });
  }
  const {
    isDirtyModel,
    hasRules,
    hasError,
    errorMessage,
    resetValidation
  } = useValidate(state.focused, state.innerLoading);
  const floatingLabel = state.floatingLabel !== void 0 ? computed(() => props.stackLabel === true || state.focused.value === true || state.floatingLabel.value === true) : computed(() => props.stackLabel === true || state.focused.value === true || state.hasValue.value === true);
  const shouldRenderBottom = computed(() => props.bottomSlots === true || props.hint !== void 0 || hasRules.value === true || props.counter === true || props.error !== null);
  const styleType = computed(() => {
    if (props.filled === true) {
      return "filled";
    }
    if (props.outlined === true) {
      return "outlined";
    }
    if (props.borderless === true) {
      return "borderless";
    }
    if (props.standout) {
      return "standout";
    }
    return "standard";
  });
  const classes = computed(() => `q-field row no-wrap items-start q-field--${styleType.value}` + (state.fieldClass !== void 0 ? ` ${state.fieldClass.value}` : "") + (props.rounded === true ? " q-field--rounded" : "") + (props.square === true ? " q-field--square" : "") + (floatingLabel.value === true ? " q-field--float" : "") + (hasLabel.value === true ? " q-field--labeled" : "") + (props.dense === true ? " q-field--dense" : "") + (props.itemAligned === true ? " q-field--item-aligned q-item-type" : "") + (state.isDark.value === true ? " q-field--dark" : "") + (state.getControl === void 0 ? " q-field--auto-height" : "") + (state.focused.value === true ? " q-field--focused" : "") + (hasError.value === true ? " q-field--error" : "") + (hasError.value === true || state.focused.value === true ? " q-field--highlighted" : "") + (props.hideBottomSpace !== true && shouldRenderBottom.value === true ? " q-field--with-bottom" : "") + (props.disable === true ? " q-field--disabled" : props.readonly === true ? " q-field--readonly" : ""));
  const contentClass = computed(() => "q-field__control relative-position row no-wrap" + (props.bgColor !== void 0 ? ` bg-${props.bgColor}` : "") + (hasError.value === true ? " text-negative" : typeof props.standout === "string" && props.standout.length > 0 && state.focused.value === true ? ` ${props.standout}` : props.color !== void 0 ? ` text-${props.color}` : ""));
  const hasLabel = computed(() => props.labelSlot === true || props.label !== void 0);
  const labelClass = computed(() => "q-field__label no-pointer-events absolute ellipsis" + (props.labelColor !== void 0 && hasError.value !== true ? ` text-${props.labelColor}` : ""));
  const controlSlotScope = computed(() => ({
    id: state.targetUid.value,
    editable: state.editable.value,
    focused: state.focused.value,
    floatingLabel: floatingLabel.value,
    modelValue: props.modelValue,
    emitValue: state.emitValue
  }));
  const attributes = computed(() => {
    const acc = {
      for: state.targetUid.value
    };
    if (props.disable === true) {
      acc["aria-disabled"] = "true";
    } else if (props.readonly === true) {
      acc["aria-readonly"] = "true";
    }
    return acc;
  });
  watch(() => props.for, (val) => {
    state.targetUid.value = getTargetUid(val);
  });
  function focusHandler() {
    const el = document.activeElement;
    let target2 = state.targetRef !== void 0 && state.targetRef.value;
    if (target2 && (el === null || el.id !== state.targetUid.value)) {
      target2.hasAttribute("tabindex") === true || (target2 = target2.querySelector("[tabindex]"));
      if (target2 && target2 !== el) {
        target2.focus({ preventScroll: true });
      }
    }
  }
  function focus() {
    addFocusFn(focusHandler);
  }
  function blur() {
    removeFocusFn(focusHandler);
    const el = document.activeElement;
    if (el !== null && state.rootRef.value.contains(el)) {
      el.blur();
    }
  }
  function onControlFocusin(e) {
    clearTimeout(focusoutTimer);
    if (state.editable.value === true && state.focused.value === false) {
      state.focused.value = true;
      emit2("focus", e);
    }
  }
  function onControlFocusout(e, then) {
    clearTimeout(focusoutTimer);
    focusoutTimer = setTimeout(() => {
      if (document.hasFocus() === true && (state.hasPopupOpen === true || state.controlRef === void 0 || state.controlRef.value === null || state.controlRef.value.contains(document.activeElement) !== false)) {
        return;
      }
      if (state.focused.value === true) {
        state.focused.value = false;
        emit2("blur", e);
      }
      then !== void 0 && then();
    });
  }
  function clearValue(e) {
    stopAndPrevent(e);
    if ($q.platform.is.mobile !== true) {
      const el = state.targetRef !== void 0 && state.targetRef.value || state.rootRef.value;
      el.focus();
    } else if (state.rootRef.value.contains(document.activeElement) === true) {
      document.activeElement.blur();
    }
    if (props.type === "file") {
      state.inputRef.value.value = null;
    }
    emit2("update:modelValue", null);
    emit2("clear", props.modelValue);
    nextTick(() => {
      resetValidation();
      if ($q.platform.is.mobile !== true) {
        isDirtyModel.value = false;
      }
    });
  }
  function getContent() {
    const node = [];
    slots.prepend !== void 0 && node.push(h("div", {
      class: "q-field__prepend q-field__marginal row no-wrap items-center",
      key: "prepend",
      onClick: prevent
    }, slots.prepend()));
    node.push(h("div", {
      class: "q-field__control-container col relative-position row no-wrap q-anchor--skip"
    }, getControlContainer()));
    hasError.value === true && props.noErrorIcon === false && node.push(getInnerAppendNode("error", [
      h(QIcon, { name: $q.iconSet.field.error, color: "negative" })
    ]));
    if (props.loading === true || state.innerLoading.value === true) {
      node.push(getInnerAppendNode("inner-loading-append", slots.loading !== void 0 ? slots.loading() : [h(QSpinner, { color: props.color })]));
    } else if (props.clearable === true && state.hasValue.value === true && state.editable.value === true) {
      node.push(getInnerAppendNode("inner-clearable-append", [
        h(QIcon, {
          class: "q-field__focusable-action",
          tag: "button",
          name: props.clearIcon || $q.iconSet.field.clear,
          tabindex: 0,
          type: "button",
          "aria-hidden": null,
          role: null,
          onClick: clearValue
        })
      ]));
    }
    slots.append !== void 0 && node.push(h("div", {
      class: "q-field__append q-field__marginal row no-wrap items-center",
      key: "append",
      onClick: prevent
    }, slots.append()));
    state.getInnerAppend !== void 0 && node.push(getInnerAppendNode("inner-append", state.getInnerAppend()));
    state.getControlChild !== void 0 && node.push(state.getControlChild());
    return node;
  }
  function getControlContainer() {
    const node = [];
    props.prefix !== void 0 && props.prefix !== null && node.push(h("div", {
      class: "q-field__prefix no-pointer-events row items-center"
    }, props.prefix));
    if (state.getShadowControl !== void 0 && state.hasShadow.value === true) {
      node.push(state.getShadowControl());
    }
    if (state.getControl !== void 0) {
      node.push(state.getControl());
    } else if (slots.rawControl !== void 0) {
      node.push(slots.rawControl());
    } else if (slots.control !== void 0) {
      node.push(h("div", {
        ref: state.targetRef,
        class: "q-field__native row",
        tabindex: -1,
        ...state.splitAttrs.attributes.value,
        "data-autofocus": props.autofocus === true || void 0
      }, slots.control(controlSlotScope.value)));
    }
    hasLabel.value === true && node.push(h("div", {
      class: labelClass.value
    }, hSlot(slots.label, props.label)));
    props.suffix !== void 0 && props.suffix !== null && node.push(h("div", {
      class: "q-field__suffix no-pointer-events row items-center"
    }, props.suffix));
    return node.concat(hSlot(slots.default));
  }
  function getBottom() {
    let msg, key;
    if (hasError.value === true) {
      if (errorMessage.value !== null) {
        msg = [h("div", { role: "alert" }, errorMessage.value)];
        key = `q--slot-error-${errorMessage.value}`;
      } else {
        msg = hSlot(slots.error);
        key = "q--slot-error";
      }
    } else if (props.hideHint !== true || state.focused.value === true) {
      if (props.hint !== void 0) {
        msg = [h("div", props.hint)];
        key = `q--slot-hint-${props.hint}`;
      } else {
        msg = hSlot(slots.hint);
        key = "q--slot-hint";
      }
    }
    const hasCounter = props.counter === true || slots.counter !== void 0;
    if (props.hideBottomSpace === true && hasCounter === false && msg === void 0) {
      return;
    }
    const main = h("div", {
      key,
      class: "q-field__messages col"
    }, msg);
    return h("div", {
      class: "q-field__bottom row items-start q-field__bottom--" + (props.hideBottomSpace !== true ? "animated" : "stale")
    }, [
      props.hideBottomSpace === true ? main : h(Transition, { name: "q-transition--field-message" }, () => main),
      hasCounter === true ? h("div", {
        class: "q-field__counter"
      }, slots.counter !== void 0 ? slots.counter() : state.computedCounter.value) : null
    ]);
  }
  function getInnerAppendNode(key, content) {
    return content === null ? null : h("div", {
      key,
      class: "q-field__append q-field__marginal row no-wrap items-center q-anchor--skip"
    }, content);
  }
  Object.assign(proxy, { focus, blur });
  let shouldActivate = false;
  onDeactivated(() => {
    shouldActivate = true;
  });
  onActivated(() => {
    shouldActivate === true && props.autofocus === true && proxy.focus();
  });
  onMounted(() => {
    if (isRuntimeSsrPreHydration.value === true && props.for === void 0) {
      state.targetUid.value = getTargetUid();
    }
    props.autofocus === true && proxy.focus();
  });
  onBeforeUnmount(() => {
    clearTimeout(focusoutTimer);
  });
  return function renderField() {
    const labelAttrs = state.getControl === void 0 && slots.control === void 0 ? {
      ...state.splitAttrs.attributes.value,
      "data-autofocus": props.autofocus === true || void 0,
      ...attributes.value
    } : attributes.value;
    return h("label", {
      ref: state.rootRef,
      class: [
        classes.value,
        attrs.class
      ],
      style: attrs.style,
      ...labelAttrs
    }, [
      slots.before !== void 0 ? h("div", {
        class: "q-field__before q-field__marginal row no-wrap items-center",
        onClick: prevent
      }, slots.before()) : null,
      h("div", {
        class: "q-field__inner relative-position col self-stretch"
      }, [
        h("div", {
          ref: state.controlRef,
          class: contentClass.value,
          tabindex: -1,
          ...state.controlEvents
        }, getContent()),
        shouldRenderBottom.value === true ? getBottom() : null
      ]),
      slots.after !== void 0 ? h("div", {
        class: "q-field__after q-field__marginal row no-wrap items-center",
        onClick: prevent
      }, slots.after()) : null
    ]);
  };
}
const NAMED_MASKS = {
  date: "####/##/##",
  datetime: "####/##/## ##:##",
  time: "##:##",
  fulltime: "##:##:##",
  phone: "(###) ### - ####",
  card: "#### #### #### ####"
};
const TOKENS = {
  "#": { pattern: "[\\d]", negate: "[^\\d]" },
  S: { pattern: "[a-zA-Z]", negate: "[^a-zA-Z]" },
  N: { pattern: "[0-9a-zA-Z]", negate: "[^0-9a-zA-Z]" },
  A: { pattern: "[a-zA-Z]", negate: "[^a-zA-Z]", transform: (v) => v.toLocaleUpperCase() },
  a: { pattern: "[a-zA-Z]", negate: "[^a-zA-Z]", transform: (v) => v.toLocaleLowerCase() },
  X: { pattern: "[0-9a-zA-Z]", negate: "[^0-9a-zA-Z]", transform: (v) => v.toLocaleUpperCase() },
  x: { pattern: "[0-9a-zA-Z]", negate: "[^0-9a-zA-Z]", transform: (v) => v.toLocaleLowerCase() }
};
const KEYS = Object.keys(TOKENS);
KEYS.forEach((key) => {
  TOKENS[key].regex = new RegExp(TOKENS[key].pattern);
});
const tokenRegexMask = new RegExp("\\\\([^.*+?^${}()|([\\]])|([.*+?^${}()|[\\]])|([" + KEYS.join("") + "])|(.)", "g"), escRegex = /[.*+?^${}()|[\]\\]/g;
const MARKER = String.fromCharCode(1);
const useMaskProps = {
  mask: String,
  reverseFillMask: Boolean,
  fillMask: [Boolean, String],
  unmaskedValue: Boolean
};
function useMask(props, emit2, emitValue, inputRef) {
  let maskMarked, maskReplaced, computedMask, computedUnmask;
  const hasMask = ref(null);
  const innerValue = ref(getInitialMaskedValue());
  function getIsTypeText() {
    return props.autogrow === true || ["textarea", "text", "search", "url", "tel", "password"].includes(props.type);
  }
  watch(() => props.type + props.autogrow, updateMaskInternals);
  watch(() => props.mask, (v) => {
    if (v !== void 0) {
      updateMaskValue(innerValue.value, true);
    } else {
      const val = unmaskValue(innerValue.value);
      updateMaskInternals();
      props.modelValue !== val && emit2("update:modelValue", val);
    }
  });
  watch(() => props.fillMask + props.reverseFillMask, () => {
    hasMask.value === true && updateMaskValue(innerValue.value, true);
  });
  watch(() => props.unmaskedValue, () => {
    hasMask.value === true && updateMaskValue(innerValue.value);
  });
  function getInitialMaskedValue() {
    updateMaskInternals();
    if (hasMask.value === true) {
      const masked = maskValue(unmaskValue(props.modelValue));
      return props.fillMask !== false ? fillWithMask(masked) : masked;
    }
    return props.modelValue;
  }
  function getPaddedMaskMarked(size2) {
    if (size2 < maskMarked.length) {
      return maskMarked.slice(-size2);
    }
    let pad = "", localMaskMarked = maskMarked;
    const padPos = localMaskMarked.indexOf(MARKER);
    if (padPos > -1) {
      for (let i = size2 - localMaskMarked.length; i > 0; i--) {
        pad += MARKER;
      }
      localMaskMarked = localMaskMarked.slice(0, padPos) + pad + localMaskMarked.slice(padPos);
    }
    return localMaskMarked;
  }
  function updateMaskInternals() {
    hasMask.value = props.mask !== void 0 && props.mask.length > 0 && getIsTypeText();
    if (hasMask.value === false) {
      computedUnmask = void 0;
      maskMarked = "";
      maskReplaced = "";
      return;
    }
    const localComputedMask = NAMED_MASKS[props.mask] === void 0 ? props.mask : NAMED_MASKS[props.mask], fillChar = typeof props.fillMask === "string" && props.fillMask.length > 0 ? props.fillMask.slice(0, 1) : "_", fillCharEscaped = fillChar.replace(escRegex, "\\$&"), unmask = [], extract = [], mask = [];
    let firstMatch = props.reverseFillMask === true, unmaskChar = "", negateChar = "";
    localComputedMask.replace(tokenRegexMask, (_, char1, esc, token, char2) => {
      if (token !== void 0) {
        const c = TOKENS[token];
        mask.push(c);
        negateChar = c.negate;
        if (firstMatch === true) {
          extract.push("(?:" + negateChar + "+)?(" + c.pattern + "+)?(?:" + negateChar + "+)?(" + c.pattern + "+)?");
          firstMatch = false;
        }
        extract.push("(?:" + negateChar + "+)?(" + c.pattern + ")?");
      } else if (esc !== void 0) {
        unmaskChar = "\\" + (esc === "\\" ? "" : esc);
        mask.push(esc);
        unmask.push("([^" + unmaskChar + "]+)?" + unmaskChar + "?");
      } else {
        const c = char1 !== void 0 ? char1 : char2;
        unmaskChar = c === "\\" ? "\\\\\\\\" : c.replace(escRegex, "\\\\$&");
        mask.push(c);
        unmask.push("([^" + unmaskChar + "]+)?" + unmaskChar + "?");
      }
    });
    const unmaskMatcher = new RegExp("^" + unmask.join("") + "(" + (unmaskChar === "" ? "." : "[^" + unmaskChar + "]") + "+)?$"), extractLast = extract.length - 1, extractMatcher = extract.map((re, index) => {
      if (index === 0 && props.reverseFillMask === true) {
        return new RegExp("^" + fillCharEscaped + "*" + re);
      } else if (index === extractLast) {
        return new RegExp("^" + re + "(" + (negateChar === "" ? "." : negateChar) + "+)?" + (props.reverseFillMask === true ? "$" : fillCharEscaped + "*"));
      }
      return new RegExp("^" + re);
    });
    computedMask = mask;
    computedUnmask = (val) => {
      const unmaskMatch = unmaskMatcher.exec(val);
      if (unmaskMatch !== null) {
        val = unmaskMatch.slice(1).join("");
      }
      const extractMatch = [], extractMatcherLength = extractMatcher.length;
      for (let i = 0, str = val; i < extractMatcherLength; i++) {
        const m = extractMatcher[i].exec(str);
        if (m === null) {
          break;
        }
        str = str.slice(m.shift().length);
        extractMatch.push(...m);
      }
      if (extractMatch.length > 0) {
        return extractMatch.join("");
      }
      return val;
    };
    maskMarked = mask.map((v) => typeof v === "string" ? v : MARKER).join("");
    maskReplaced = maskMarked.split(MARKER).join(fillChar);
  }
  function updateMaskValue(rawVal, updateMaskInternalsFlag, inputType) {
    const inp = inputRef.value, end = inp.selectionEnd, endReverse = inp.value.length - end, unmasked = unmaskValue(rawVal);
    updateMaskInternalsFlag === true && updateMaskInternals();
    const preMasked = maskValue(unmasked), masked = props.fillMask !== false ? fillWithMask(preMasked) : preMasked, changed = innerValue.value !== masked;
    inp.value !== masked && (inp.value = masked);
    changed === true && (innerValue.value = masked);
    document.activeElement === inp && nextTick(() => {
      if (masked === maskReplaced) {
        const cursor = props.reverseFillMask === true ? maskReplaced.length : 0;
        inp.setSelectionRange(cursor, cursor, "forward");
        return;
      }
      if (inputType === "insertFromPaste" && props.reverseFillMask !== true) {
        const cursor = end - 1;
        moveCursor.right(inp, cursor, cursor);
        return;
      }
      if (["deleteContentBackward", "deleteContentForward"].indexOf(inputType) > -1) {
        const cursor = props.reverseFillMask === true ? end === 0 ? masked.length > preMasked.length ? 1 : 0 : Math.max(0, masked.length - (masked === maskReplaced ? 0 : Math.min(preMasked.length, endReverse) + 1)) + 1 : end;
        inp.setSelectionRange(cursor, cursor, "forward");
        return;
      }
      if (props.reverseFillMask === true) {
        if (changed === true) {
          const cursor = Math.max(0, masked.length - (masked === maskReplaced ? 0 : Math.min(preMasked.length, endReverse + 1)));
          if (cursor === 1 && end === 1) {
            inp.setSelectionRange(cursor, cursor, "forward");
          } else {
            moveCursor.rightReverse(inp, cursor, cursor);
          }
        } else {
          const cursor = masked.length - endReverse;
          inp.setSelectionRange(cursor, cursor, "backward");
        }
      } else {
        if (changed === true) {
          const cursor = Math.max(0, maskMarked.indexOf(MARKER), Math.min(preMasked.length, end) - 1);
          moveCursor.right(inp, cursor, cursor);
        } else {
          const cursor = end - 1;
          moveCursor.right(inp, cursor, cursor);
        }
      }
    });
    const val = props.unmaskedValue === true ? unmaskValue(masked) : masked;
    String(props.modelValue) !== val && emitValue(val, true);
  }
  function moveCursorForPaste(inp, start2, end) {
    const preMasked = maskValue(unmaskValue(inp.value));
    start2 = Math.max(0, maskMarked.indexOf(MARKER), Math.min(preMasked.length, start2));
    inp.setSelectionRange(start2, end, "forward");
  }
  const moveCursor = {
    left(inp, start2, end, selection) {
      const noMarkBefore = maskMarked.slice(start2 - 1).indexOf(MARKER) === -1;
      let i = Math.max(0, start2 - 1);
      for (; i >= 0; i--) {
        if (maskMarked[i] === MARKER) {
          start2 = i;
          noMarkBefore === true && start2++;
          break;
        }
      }
      if (i < 0 && maskMarked[start2] !== void 0 && maskMarked[start2] !== MARKER) {
        return moveCursor.right(inp, 0, 0);
      }
      start2 >= 0 && inp.setSelectionRange(start2, selection === true ? end : start2, "backward");
    },
    right(inp, start2, end, selection) {
      const limit = inp.value.length;
      let i = Math.min(limit, end + 1);
      for (; i <= limit; i++) {
        if (maskMarked[i] === MARKER) {
          end = i;
          break;
        } else if (maskMarked[i - 1] === MARKER) {
          end = i;
        }
      }
      if (i > limit && maskMarked[end - 1] !== void 0 && maskMarked[end - 1] !== MARKER) {
        return moveCursor.left(inp, limit, limit);
      }
      inp.setSelectionRange(selection ? start2 : end, end, "forward");
    },
    leftReverse(inp, start2, end, selection) {
      const localMaskMarked = getPaddedMaskMarked(inp.value.length);
      let i = Math.max(0, start2 - 1);
      for (; i >= 0; i--) {
        if (localMaskMarked[i - 1] === MARKER) {
          start2 = i;
          break;
        } else if (localMaskMarked[i] === MARKER) {
          start2 = i;
          if (i === 0) {
            break;
          }
        }
      }
      if (i < 0 && localMaskMarked[start2] !== void 0 && localMaskMarked[start2] !== MARKER) {
        return moveCursor.rightReverse(inp, 0, 0);
      }
      start2 >= 0 && inp.setSelectionRange(start2, selection === true ? end : start2, "backward");
    },
    rightReverse(inp, start2, end, selection) {
      const limit = inp.value.length, localMaskMarked = getPaddedMaskMarked(limit), noMarkBefore = localMaskMarked.slice(0, end + 1).indexOf(MARKER) === -1;
      let i = Math.min(limit, end + 1);
      for (; i <= limit; i++) {
        if (localMaskMarked[i - 1] === MARKER) {
          end = i;
          end > 0 && noMarkBefore === true && end--;
          break;
        }
      }
      if (i > limit && localMaskMarked[end - 1] !== void 0 && localMaskMarked[end - 1] !== MARKER) {
        return moveCursor.leftReverse(inp, limit, limit);
      }
      inp.setSelectionRange(selection === true ? start2 : end, end, "forward");
    }
  };
  function onMaskedKeydown(e) {
    if (shouldIgnoreKey(e) === true) {
      return;
    }
    const inp = inputRef.value, start2 = inp.selectionStart, end = inp.selectionEnd;
    if (e.keyCode === 37 || e.keyCode === 39) {
      const fn = moveCursor[(e.keyCode === 39 ? "right" : "left") + (props.reverseFillMask === true ? "Reverse" : "")];
      e.preventDefault();
      fn(inp, start2, end, e.shiftKey);
    } else if (e.keyCode === 8 && props.reverseFillMask !== true && start2 === end) {
      moveCursor.left(inp, start2, end, true);
    } else if (e.keyCode === 46 && props.reverseFillMask === true && start2 === end) {
      moveCursor.rightReverse(inp, start2, end, true);
    }
  }
  function maskValue(val) {
    if (val === void 0 || val === null || val === "") {
      return "";
    }
    if (props.reverseFillMask === true) {
      return maskValueReverse(val);
    }
    const mask = computedMask;
    let valIndex = 0, output = "";
    for (let maskIndex = 0; maskIndex < mask.length; maskIndex++) {
      const valChar = val[valIndex], maskDef = mask[maskIndex];
      if (typeof maskDef === "string") {
        output += maskDef;
        valChar === maskDef && valIndex++;
      } else if (valChar !== void 0 && maskDef.regex.test(valChar)) {
        output += maskDef.transform !== void 0 ? maskDef.transform(valChar) : valChar;
        valIndex++;
      } else {
        return output;
      }
    }
    return output;
  }
  function maskValueReverse(val) {
    const mask = computedMask, firstTokenIndex = maskMarked.indexOf(MARKER);
    let valIndex = val.length - 1, output = "";
    for (let maskIndex = mask.length - 1; maskIndex >= 0 && valIndex > -1; maskIndex--) {
      const maskDef = mask[maskIndex];
      let valChar = val[valIndex];
      if (typeof maskDef === "string") {
        output = maskDef + output;
        valChar === maskDef && valIndex--;
      } else if (valChar !== void 0 && maskDef.regex.test(valChar)) {
        do {
          output = (maskDef.transform !== void 0 ? maskDef.transform(valChar) : valChar) + output;
          valIndex--;
          valChar = val[valIndex];
        } while (firstTokenIndex === maskIndex && valChar !== void 0 && maskDef.regex.test(valChar));
      } else {
        return output;
      }
    }
    return output;
  }
  function unmaskValue(val) {
    return typeof val !== "string" || computedUnmask === void 0 ? typeof val === "number" ? computedUnmask("" + val) : val : computedUnmask(val);
  }
  function fillWithMask(val) {
    if (maskReplaced.length - val.length <= 0) {
      return val;
    }
    return props.reverseFillMask === true && val.length > 0 ? maskReplaced.slice(0, -val.length) + val : val + maskReplaced.slice(val.length);
  }
  return {
    innerValue,
    hasMask,
    moveCursorForPaste,
    updateMaskValue,
    onMaskedKeydown
  };
}
const useFormProps = {
  name: String
};
function useFormInject(formAttrs = {}) {
  return (child, action, className) => {
    child[action](h("input", {
      class: "hidden" + (className || ""),
      ...formAttrs.value
    }));
  };
}
function useFormInputNameAttr(props) {
  return computed(() => props.name || props.for);
}
function useFileFormDomProps(props, typeGuard) {
  function getFormDomProps() {
    const model = props.modelValue;
    try {
      const dt = "DataTransfer" in window ? new DataTransfer() : "ClipboardEvent" in window ? new ClipboardEvent("").clipboardData : void 0;
      if (Object(model) === model) {
        ("length" in model ? Array.from(model) : [model]).forEach((file) => {
          dt.items.add(file);
        });
      }
      return {
        files: dt.files
      };
    } catch (e) {
      return {
        files: void 0
      };
    }
  }
  return typeGuard === true ? computed(() => {
    if (props.type !== "file") {
      return;
    }
    return getFormDomProps();
  }) : computed(getFormDomProps);
}
const isJapanese = /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f\u4e00-\u9faf\u3400-\u4dbf]/;
const isChinese = /[\u4e00-\u9fff\u3400-\u4dbf\u{20000}-\u{2a6df}\u{2a700}-\u{2b73f}\u{2b740}-\u{2b81f}\u{2b820}-\u{2ceaf}\uf900-\ufaff\u3300-\u33ff\ufe30-\ufe4f\uf900-\ufaff\u{2f800}-\u{2fa1f}]/u;
const isKorean = /[\u3131-\u314e\u314f-\u3163\uac00-\ud7a3]/;
const isPlainText = /[a-z0-9_ -]$/i;
function useKeyComposition(onInput) {
  return function onComposition(e) {
    if (e.type === "compositionend" || e.type === "change") {
      if (e.target.qComposing !== true) {
        return;
      }
      e.target.qComposing = false;
      onInput(e);
    } else if (e.type === "compositionupdate" && e.target.qComposing !== true && typeof e.data === "string") {
      const isComposing = client.is.firefox === true ? isPlainText.test(e.data) === false : isJapanese.test(e.data) === true || isChinese.test(e.data) === true || isKorean.test(e.data) === true;
      if (isComposing === true) {
        e.target.qComposing = true;
      }
    }
  };
}
var QInput = createComponent({
  name: "QInput",
  inheritAttrs: false,
  props: {
    ...useFieldProps,
    ...useMaskProps,
    ...useFormProps,
    modelValue: { required: false },
    shadowText: String,
    type: {
      type: String,
      default: "text"
    },
    debounce: [String, Number],
    autogrow: Boolean,
    inputClass: [Array, String, Object],
    inputStyle: [Array, String, Object]
  },
  emits: [
    ...useFieldEmits,
    "paste",
    "change"
  ],
  setup(props, { emit: emit2, attrs }) {
    const temp = {};
    let emitCachedValue = NaN, typedNumber, stopValueWatcher, emitTimer, emitValueFn;
    const inputRef = ref(null);
    const nameProp = useFormInputNameAttr(props);
    const {
      innerValue,
      hasMask,
      moveCursorForPaste,
      updateMaskValue,
      onMaskedKeydown
    } = useMask(props, emit2, emitValue, inputRef);
    const formDomProps = useFileFormDomProps(props, true);
    const hasValue = computed(() => fieldValueIsFilled(innerValue.value));
    const onComposition = useKeyComposition(onInput);
    const state = useFieldState();
    const isTextarea = computed(() => props.type === "textarea" || props.autogrow === true);
    const isTypeText = computed(() => isTextarea.value === true || ["text", "search", "url", "tel", "password"].includes(props.type));
    const onEvents = computed(() => {
      const evt = {
        ...state.splitAttrs.listeners.value,
        onInput,
        onPaste,
        onChange,
        onBlur: onFinishEditing,
        onFocus: stop
      };
      evt.onCompositionstart = evt.onCompositionupdate = evt.onCompositionend = onComposition;
      if (hasMask.value === true) {
        evt.onKeydown = onMaskedKeydown;
      }
      if (props.autogrow === true) {
        evt.onAnimationend = adjustHeight;
      }
      return evt;
    });
    const inputAttrs = computed(() => {
      const attrs2 = {
        tabindex: 0,
        "data-autofocus": props.autofocus === true || void 0,
        rows: props.type === "textarea" ? 6 : void 0,
        "aria-label": props.label,
        name: nameProp.value,
        ...state.splitAttrs.attributes.value,
        id: state.targetUid.value,
        maxlength: props.maxlength,
        disabled: props.disable === true,
        readonly: props.readonly === true
      };
      if (isTextarea.value === false) {
        attrs2.type = props.type;
      }
      if (props.autogrow === true) {
        attrs2.rows = 1;
      }
      return attrs2;
    });
    watch(() => props.type, () => {
      if (inputRef.value) {
        inputRef.value.value = props.modelValue;
      }
    });
    watch(() => props.modelValue, (v) => {
      if (hasMask.value === true) {
        if (stopValueWatcher === true) {
          stopValueWatcher = false;
          if (String(v) === emitCachedValue) {
            return;
          }
        }
        updateMaskValue(v);
      } else if (innerValue.value !== v) {
        innerValue.value = v;
        if (props.type === "number" && temp.hasOwnProperty("value") === true) {
          if (typedNumber === true) {
            typedNumber = false;
          } else {
            delete temp.value;
          }
        }
      }
      props.autogrow === true && nextTick(adjustHeight);
    });
    watch(() => props.autogrow, (val) => {
      if (val === true) {
        nextTick(adjustHeight);
      } else if (inputRef.value !== null && attrs.rows > 0) {
        inputRef.value.style.height = "auto";
      }
    });
    watch(() => props.dense, () => {
      props.autogrow === true && nextTick(adjustHeight);
    });
    function focus() {
      addFocusFn(() => {
        const el = document.activeElement;
        if (inputRef.value !== null && inputRef.value !== el && (el === null || el.id !== state.targetUid.value)) {
          inputRef.value.focus({ preventScroll: true });
        }
      });
    }
    function select() {
      inputRef.value !== null && inputRef.value.select();
    }
    function onPaste(e) {
      if (hasMask.value === true && props.reverseFillMask !== true) {
        const inp = e.target;
        moveCursorForPaste(inp, inp.selectionStart, inp.selectionEnd);
      }
      emit2("paste", e);
    }
    function onInput(e) {
      if (!e || !e.target) {
        return;
      }
      if (props.type === "file") {
        emit2("update:modelValue", e.target.files);
        return;
      }
      const val = e.target.value;
      if (e.target.qComposing === true) {
        temp.value = val;
        return;
      }
      if (hasMask.value === true) {
        updateMaskValue(val, false, e.inputType);
      } else {
        emitValue(val);
        if (isTypeText.value === true && e.target === document.activeElement) {
          const { selectionStart, selectionEnd } = e.target;
          if (selectionStart !== void 0 && selectionEnd !== void 0) {
            nextTick(() => {
              if (e.target === document.activeElement && val.indexOf(e.target.value) === 0) {
                e.target.setSelectionRange(selectionStart, selectionEnd);
              }
            });
          }
        }
      }
      props.autogrow === true && adjustHeight();
    }
    function emitValue(val, stopWatcher) {
      emitValueFn = () => {
        if (props.type !== "number" && temp.hasOwnProperty("value") === true) {
          delete temp.value;
        }
        if (props.modelValue !== val && emitCachedValue !== val) {
          emitCachedValue = val;
          stopWatcher === true && (stopValueWatcher = true);
          emit2("update:modelValue", val);
          nextTick(() => {
            emitCachedValue === val && (emitCachedValue = NaN);
          });
        }
        emitValueFn = void 0;
      };
      if (props.type === "number") {
        typedNumber = true;
        temp.value = val;
      }
      if (props.debounce !== void 0) {
        clearTimeout(emitTimer);
        temp.value = val;
        emitTimer = setTimeout(emitValueFn, props.debounce);
      } else {
        emitValueFn();
      }
    }
    function adjustHeight() {
      const inp = inputRef.value;
      if (inp !== null) {
        const parentStyle = inp.parentNode.style;
        const { overflow } = inp.style;
        parentStyle.marginBottom = inp.scrollHeight - 1 + "px";
        inp.style.height = "1px";
        inp.style.overflow = "hidden";
        inp.style.height = inp.scrollHeight + "px";
        inp.style.overflow = overflow;
        parentStyle.marginBottom = "";
      }
    }
    function onChange(e) {
      onComposition(e);
      clearTimeout(emitTimer);
      emitValueFn !== void 0 && emitValueFn();
      emit2("change", e.target.value);
    }
    function onFinishEditing(e) {
      e !== void 0 && stop(e);
      clearTimeout(emitTimer);
      emitValueFn !== void 0 && emitValueFn();
      typedNumber = false;
      stopValueWatcher = false;
      delete temp.value;
      props.type !== "file" && setTimeout(() => {
        if (inputRef.value !== null) {
          inputRef.value.value = innerValue.value !== void 0 ? innerValue.value : "";
        }
      });
    }
    function getCurValue() {
      return temp.hasOwnProperty("value") === true ? temp.value : innerValue.value !== void 0 ? innerValue.value : "";
    }
    onBeforeUnmount(() => {
      onFinishEditing();
    });
    onMounted(() => {
      props.autogrow === true && adjustHeight();
    });
    Object.assign(state, {
      innerValue,
      fieldClass: computed(() => `q-${isTextarea.value === true ? "textarea" : "input"}` + (props.autogrow === true ? " q-textarea--autogrow" : "")),
      hasShadow: computed(() => props.type !== "file" && typeof props.shadowText === "string" && props.shadowText.length > 0),
      inputRef,
      emitValue,
      hasValue,
      floatingLabel: computed(() => hasValue.value === true || fieldValueIsFilled(props.displayValue)),
      getControl: () => {
        return h(isTextarea.value === true ? "textarea" : "input", {
          ref: inputRef,
          class: [
            "q-field__native q-placeholder",
            props.inputClass
          ],
          style: props.inputStyle,
          ...inputAttrs.value,
          ...onEvents.value,
          ...props.type !== "file" ? { value: getCurValue() } : formDomProps.value
        });
      },
      getShadowControl: () => {
        return h("div", {
          class: "q-field__native q-field__shadow absolute-bottom no-pointer-events" + (isTextarea.value === true ? "" : " text-no-wrap")
        }, [
          h("span", { class: "invisible" }, getCurValue()),
          h("span", props.shadowText)
        ]);
      }
    });
    const renderFn = useField(state);
    const vm = getCurrentInstance();
    Object.assign(vm.proxy, {
      focus,
      select,
      getNativeElement: () => inputRef.value
    });
    return renderFn;
  }
});
function useRefocusTarget(props, rootRef) {
  const refocusRef = ref(null);
  const refocusTargetEl = computed(() => {
    if (props.disable !== true) {
      return null;
    }
    return h("span", {
      ref: refocusRef,
      class: "no-outline",
      tabindex: -1
    });
  });
  function refocusTarget(e) {
    const root = rootRef.value;
    if (e !== void 0 && e.type.indexOf("key") === 0) {
      if (root !== null && document.activeElement !== root && root.contains(document.activeElement) === true) {
        root.focus();
      }
    } else if (refocusRef.value !== null && (e === void 0 || root !== null && root.contains(e.target) === true)) {
      refocusRef.value.focus();
    }
  }
  return {
    refocusTargetEl,
    refocusTarget
  };
}
var optionSizes = {
  xs: 30,
  sm: 35,
  md: 40,
  lg: 50,
  xl: 60
};
const svg = h("svg", {
  key: "svg",
  class: "q-radio__bg absolute non-selectable",
  viewBox: "0 0 24 24",
  "aria-hidden": "true"
}, [
  h("path", {
    d: "M12,22a10,10 0 0 1 -10,-10a10,10 0 0 1 10,-10a10,10 0 0 1 10,10a10,10 0 0 1 -10,10m0,-22a12,12 0 0 0 -12,12a12,12 0 0 0 12,12a12,12 0 0 0 12,-12a12,12 0 0 0 -12,-12"
  }),
  h("path", {
    class: "q-radio__check",
    d: "M12,6a6,6 0 0 0 -6,6a6,6 0 0 0 6,6a6,6 0 0 0 6,-6a6,6 0 0 0 -6,-6"
  })
]);
var QRadio = createComponent({
  name: "QRadio",
  props: {
    ...useDarkProps,
    ...useSizeProps,
    ...useFormProps,
    modelValue: { required: true },
    val: { required: true },
    label: String,
    leftLabel: Boolean,
    checkedIcon: String,
    uncheckedIcon: String,
    color: String,
    keepColor: Boolean,
    dense: Boolean,
    disable: Boolean,
    tabindex: [String, Number]
  },
  emits: ["update:modelValue"],
  setup(props, { slots, emit: emit2 }) {
    const { proxy } = getCurrentInstance();
    const isDark = useDark(props, proxy.$q);
    const sizeStyle = useSize(props, optionSizes);
    const rootRef = ref(null);
    const { refocusTargetEl, refocusTarget } = useRefocusTarget(props, rootRef);
    const isTrue = computed(() => toRaw(props.modelValue) === toRaw(props.val));
    const classes = computed(() => "q-radio cursor-pointer no-outline row inline no-wrap items-center" + (props.disable === true ? " disabled" : "") + (isDark.value === true ? " q-radio--dark" : "") + (props.dense === true ? " q-radio--dense" : "") + (props.leftLabel === true ? " reverse" : ""));
    const innerClass = computed(() => {
      const color = props.color !== void 0 && (props.keepColor === true || isTrue.value === true) ? ` text-${props.color}` : "";
      return `q-radio__inner relative-position q-radio__inner--${isTrue.value === true ? "truthy" : "falsy"}${color}`;
    });
    const icon = computed(() => (isTrue.value === true ? props.checkedIcon : props.uncheckedIcon) || null);
    const tabindex = computed(() => props.disable === true ? -1 : props.tabindex || 0);
    const formAttrs = computed(() => {
      const prop = { type: "radio" };
      props.name !== void 0 && Object.assign(prop, {
        "^checked": isTrue.value === true ? "checked" : void 0,
        name: props.name,
        value: props.val
      });
      return prop;
    });
    const injectFormInput = useFormInject(formAttrs);
    function onClick(e) {
      if (e !== void 0) {
        stopAndPrevent(e);
        refocusTarget(e);
      }
      if (props.disable !== true && isTrue.value !== true) {
        emit2("update:modelValue", props.val, e);
      }
    }
    function onKeydown2(e) {
      if (e.keyCode === 13 || e.keyCode === 32) {
        stopAndPrevent(e);
      }
    }
    function onKeyup2(e) {
      if (e.keyCode === 13 || e.keyCode === 32) {
        onClick(e);
      }
    }
    Object.assign(proxy, { set: onClick });
    return () => {
      const content = icon.value !== null ? [
        h("div", {
          key: "icon",
          class: "q-radio__icon-container absolute-full flex flex-center no-wrap"
        }, [
          h(QIcon, {
            class: "q-radio__icon",
            name: icon.value
          })
        ])
      ] : [svg];
      props.disable !== true && injectFormInput(content, "unshift", " q-radio__native q-ma-none q-pa-none");
      const child = [
        h("div", {
          class: innerClass.value,
          style: sizeStyle.value
        }, content)
      ];
      if (refocusTargetEl.value !== null) {
        child.push(refocusTargetEl.value);
      }
      const label = props.label !== void 0 ? hMergeSlot(slots.default, [props.label]) : hSlot(slots.default);
      label !== void 0 && child.push(h("div", {
        class: "q-radio__label q-anchor--skip"
      }, label));
      return h("div", {
        ref: rootRef,
        class: classes.value,
        tabindex: tabindex.value,
        role: "radio",
        "aria-label": props.label,
        "aria-checked": isTrue.value === true ? "true" : "false",
        "aria-disabled": props.disable === true ? "true" : void 0,
        onClick,
        onKeydown: onKeydown2,
        onKeyup: onKeyup2
      }, child);
    };
  }
});
const useCheckboxProps = {
  ...useDarkProps,
  ...useSizeProps,
  ...useFormProps,
  modelValue: {
    required: true,
    default: null
  },
  val: {},
  trueValue: { default: true },
  falseValue: { default: false },
  indeterminateValue: { default: null },
  checkedIcon: String,
  uncheckedIcon: String,
  indeterminateIcon: String,
  toggleOrder: {
    type: String,
    validator: (v) => v === "tf" || v === "ft"
  },
  toggleIndeterminate: Boolean,
  label: String,
  leftLabel: Boolean,
  color: String,
  keepColor: Boolean,
  dense: Boolean,
  disable: Boolean,
  tabindex: [String, Number]
};
const useCheckboxEmits = ["update:modelValue"];
function useCheckbox(type, getInner) {
  const { props, slots, emit: emit2, proxy } = getCurrentInstance();
  const { $q } = proxy;
  const isDark = useDark(props, $q);
  const rootRef = ref(null);
  const { refocusTargetEl, refocusTarget } = useRefocusTarget(props, rootRef);
  const sizeStyle = useSize(props, optionSizes);
  const modelIsArray = computed(() => props.val !== void 0 && Array.isArray(props.modelValue));
  const index = computed(() => {
    const val = toRaw(props.val);
    return modelIsArray.value === true ? props.modelValue.findIndex((opt) => toRaw(opt) === val) : -1;
  });
  const isTrue = computed(() => modelIsArray.value === true ? index.value > -1 : toRaw(props.modelValue) === toRaw(props.trueValue));
  const isFalse = computed(() => modelIsArray.value === true ? index.value === -1 : toRaw(props.modelValue) === toRaw(props.falseValue));
  const isIndeterminate = computed(() => isTrue.value === false && isFalse.value === false);
  const tabindex = computed(() => props.disable === true ? -1 : props.tabindex || 0);
  const classes = computed(() => `q-${type} cursor-pointer no-outline row inline no-wrap items-center` + (props.disable === true ? " disabled" : "") + (isDark.value === true ? ` q-${type}--dark` : "") + (props.dense === true ? ` q-${type}--dense` : "") + (props.leftLabel === true ? " reverse" : ""));
  const innerClass = computed(() => {
    const state = isTrue.value === true ? "truthy" : isFalse.value === true ? "falsy" : "indet";
    const color = props.color !== void 0 && (props.keepColor === true || (type === "toggle" ? isTrue.value === true : isFalse.value !== true)) ? ` text-${props.color}` : "";
    return `q-${type}__inner relative-position non-selectable q-${type}__inner--${state}${color}`;
  });
  const formAttrs = computed(() => {
    const prop = { type: "checkbox" };
    props.name !== void 0 && Object.assign(prop, {
      "^checked": isTrue.value === true ? "checked" : void 0,
      name: props.name,
      value: modelIsArray.value === true ? props.val : props.trueValue
    });
    return prop;
  });
  const injectFormInput = useFormInject(formAttrs);
  const attributes = computed(() => {
    const attrs = {
      tabindex: tabindex.value,
      role: "checkbox",
      "aria-label": props.label,
      "aria-checked": isIndeterminate.value === true ? "mixed" : isTrue.value === true ? "true" : "false"
    };
    if (props.disable === true) {
      attrs["aria-disabled"] = "true";
    }
    return attrs;
  });
  function onClick(e) {
    if (e !== void 0) {
      stopAndPrevent(e);
      refocusTarget(e);
    }
    if (props.disable !== true) {
      emit2("update:modelValue", getNextValue(), e);
    }
  }
  function getNextValue() {
    if (modelIsArray.value === true) {
      if (isTrue.value === true) {
        const val = props.modelValue.slice();
        val.splice(index.value, 1);
        return val;
      }
      return props.modelValue.concat([props.val]);
    }
    if (isTrue.value === true) {
      if (props.toggleOrder !== "ft" || props.toggleIndeterminate === false) {
        return props.falseValue;
      }
    } else if (isFalse.value === true) {
      if (props.toggleOrder === "ft" || props.toggleIndeterminate === false) {
        return props.trueValue;
      }
    } else {
      return props.toggleOrder !== "ft" ? props.trueValue : props.falseValue;
    }
    return props.indeterminateValue;
  }
  function onKeydown2(e) {
    if (e.keyCode === 13 || e.keyCode === 32) {
      stopAndPrevent(e);
    }
  }
  function onKeyup2(e) {
    if (e.keyCode === 13 || e.keyCode === 32) {
      onClick(e);
    }
  }
  const getInnerContent = getInner(isTrue, isIndeterminate);
  Object.assign(proxy, { toggle: onClick });
  return () => {
    const inner = getInnerContent();
    props.disable !== true && injectFormInput(inner, "unshift", ` q-${type}__native absolute q-ma-none q-pa-none`);
    const child = [
      h("div", {
        class: innerClass.value,
        style: sizeStyle.value
      }, inner)
    ];
    if (refocusTargetEl.value !== null) {
      child.push(refocusTargetEl.value);
    }
    const label = props.label !== void 0 ? hMergeSlot(slots.default, [props.label]) : hSlot(slots.default);
    label !== void 0 && child.push(h("div", {
      class: `q-${type}__label q-anchor--skip`
    }, label));
    return h("div", {
      ref: rootRef,
      class: classes.value,
      ...attributes.value,
      onClick,
      onKeydown: onKeydown2,
      onKeyup: onKeyup2
    }, child);
  };
}
const bgNode = h("div", {
  key: "svg",
  class: "q-checkbox__bg absolute"
}, [
  h("svg", {
    class: "q-checkbox__svg fit absolute-full",
    viewBox: "0 0 24 24",
    "aria-hidden": "true"
  }, [
    h("path", {
      class: "q-checkbox__truthy",
      fill: "none",
      d: "M1.73,12.91 8.1,19.28 22.79,4.59"
    }),
    h("path", {
      class: "q-checkbox__indet",
      d: "M4,14H20V10H4"
    })
  ])
]);
var QCheckbox = createComponent({
  name: "QCheckbox",
  props: useCheckboxProps,
  emits: useCheckboxEmits,
  setup(props) {
    function getInner(isTrue, isIndeterminate) {
      const icon = computed(() => (isTrue.value === true ? props.checkedIcon : isIndeterminate.value === true ? props.indeterminateIcon : props.uncheckedIcon) || null);
      return () => icon.value !== null ? [
        h("div", {
          key: "icon",
          class: "q-checkbox__icon-container absolute-full flex flex-center no-wrap"
        }, [
          h(QIcon, {
            class: "q-checkbox__icon",
            name: icon.value
          })
        ])
      ] : [bgNode];
    }
    return useCheckbox("checkbox", getInner);
  }
});
var QToggle = createComponent({
  name: "QToggle",
  props: {
    ...useCheckboxProps,
    icon: String,
    iconColor: String
  },
  emits: useCheckboxEmits,
  setup(props) {
    function getInner(isTrue, isIndeterminate) {
      const icon = computed(() => (isTrue.value === true ? props.checkedIcon : isIndeterminate.value === true ? props.indeterminateIcon : props.uncheckedIcon) || props.icon);
      const color = computed(() => isTrue.value === true ? props.iconColor : null);
      return () => [
        h("div", { class: "q-toggle__track" }),
        h("div", {
          class: "q-toggle__thumb absolute flex flex-center no-wrap"
        }, icon.value !== void 0 ? [
          h(QIcon, {
            name: icon.value,
            color: color.value
          })
        ] : void 0)
      ];
    }
    return useCheckbox("toggle", getInner);
  }
});
const components = {
  radio: QRadio,
  checkbox: QCheckbox,
  toggle: QToggle
};
const typeValues = Object.keys(components);
var QOptionGroup = createComponent({
  name: "QOptionGroup",
  props: {
    ...useDarkProps,
    modelValue: {
      required: true
    },
    options: {
      type: Array,
      validator: (opts) => opts.every((opt) => "value" in opt && "label" in opt)
    },
    name: String,
    type: {
      default: "radio",
      validator: (v) => typeValues.includes(v)
    },
    color: String,
    keepColor: Boolean,
    dense: Boolean,
    size: String,
    leftLabel: Boolean,
    inline: Boolean,
    disable: Boolean
  },
  emits: ["update:modelValue"],
  setup(props, { emit: emit2, slots }) {
    const { proxy: { $q } } = getCurrentInstance();
    const arrayModel = Array.isArray(props.modelValue);
    if (props.type === "radio") {
      if (arrayModel === true) {
        console.error("q-option-group: model should not be array");
      }
    } else if (arrayModel === false) {
      console.error("q-option-group: model should be array in your case");
    }
    const isDark = useDark(props, $q);
    const component = computed(() => components[props.type]);
    const classes = computed(() => "q-option-group q-gutter-x-sm" + (props.inline === true ? " q-option-group--inline" : ""));
    const attrs = computed(() => {
      const attrs2 = {};
      if (props.type === "radio") {
        attrs2.role = "radiogroup";
        if (props.disable === true) {
          attrs2["aria-disabled"] = "true";
        }
      }
      return attrs2;
    });
    function onUpdateModelValue(value) {
      emit2("update:modelValue", value);
    }
    return () => h("div", {
      class: classes.value,
      ...attrs.value
    }, props.options.map((opt, i) => {
      const child = slots["label-" + i] !== void 0 ? () => slots["label-" + i](opt) : slots.label !== void 0 ? () => slots.label(opt) : void 0;
      return h("div", [
        h(component.value, {
          modelValue: props.modelValue,
          val: opt.value,
          name: opt.name === void 0 ? props.name : opt.name,
          disable: props.disable || opt.disable,
          label: child === void 0 ? opt.label : null,
          leftLabel: opt.leftLabel === void 0 ? props.leftLabel : opt.leftLabel,
          color: opt.color === void 0 ? props.color : opt.color,
          checkedIcon: opt.checkedIcon,
          uncheckedIcon: opt.uncheckedIcon,
          dark: opt.dark || isDark.value,
          size: opt.size === void 0 ? props.size : opt.size,
          dense: props.dense,
          keepColor: opt.keepColor === void 0 ? props.keepColor : opt.keepColor,
          "onUpdate:modelValue": onUpdateModelValue
        }, child)
      ]);
    }));
  }
});
var DialogPlugin = createComponent({
  name: "DialogPlugin",
  props: {
    ...useDarkProps,
    title: String,
    message: String,
    prompt: Object,
    options: Object,
    progress: [Boolean, Object],
    html: Boolean,
    ok: {
      type: [String, Object, Boolean],
      default: true
    },
    cancel: [String, Object, Boolean],
    focus: {
      type: String,
      default: "ok",
      validator: (v) => ["ok", "cancel", "none"].includes(v)
    },
    stackButtons: Boolean,
    color: String,
    cardClass: [String, Array, Object],
    cardStyle: [String, Array, Object]
  },
  emits: ["ok", "hide"],
  setup(props, { emit: emit2 }) {
    const { proxy } = getCurrentInstance();
    const { $q } = proxy;
    const isDark = useDark(props, $q);
    const dialogRef = ref(null);
    const model = ref(props.prompt !== void 0 ? props.prompt.model : props.options !== void 0 ? props.options.model : void 0);
    const classes = computed(() => "q-dialog-plugin" + (isDark.value === true ? " q-dialog-plugin--dark q-dark" : "") + (props.progress !== false ? " q-dialog-plugin--progress" : ""));
    const vmColor = computed(() => props.color || (isDark.value === true ? "amber" : "primary"));
    const spinner = computed(() => props.progress === false ? null : isObject(props.progress) === true ? {
      component: props.progress.spinner || QSpinner,
      props: { color: props.progress.color || vmColor.value }
    } : {
      component: QSpinner,
      props: { color: vmColor.value }
    });
    const hasForm = computed(() => props.prompt !== void 0 || props.options !== void 0);
    const formProps = computed(() => {
      if (hasForm.value !== true) {
        return {};
      }
      const { model: model2, isValid, items, ...formProps2 } = props.prompt !== void 0 ? props.prompt : props.options;
      return formProps2;
    });
    const okLabel = computed(() => isObject(props.ok) === true ? $q.lang.label.ok : props.ok === true ? $q.lang.label.ok : props.ok);
    const cancelLabel = computed(() => isObject(props.cancel) === true ? $q.lang.label.cancel : props.cancel === true ? $q.lang.label.cancel : props.cancel);
    const okDisabled = computed(() => {
      if (props.prompt !== void 0) {
        return props.prompt.isValid !== void 0 && props.prompt.isValid(model.value) !== true;
      }
      if (props.options !== void 0) {
        return props.options.isValid !== void 0 && props.options.isValid(model.value) !== true;
      }
      return false;
    });
    const okProps = computed(() => ({
      color: vmColor.value,
      label: okLabel.value,
      ripple: false,
      disable: okDisabled.value,
      ...isObject(props.ok) === true ? props.ok : { flat: true },
      "data-autofocus": props.focus === "ok" && hasForm.value !== true || void 0,
      onClick: onOk
    }));
    const cancelProps = computed(() => ({
      color: vmColor.value,
      label: cancelLabel.value,
      ripple: false,
      ...isObject(props.cancel) === true ? props.cancel : { flat: true },
      "data-autofocus": props.focus === "cancel" && hasForm.value !== true || void 0,
      onClick: onCancel
    }));
    watch(() => props.prompt && props.prompt.model, onUpdateModel);
    watch(() => props.options && props.options.model, onUpdateModel);
    function show() {
      dialogRef.value.show();
    }
    function hide() {
      dialogRef.value.hide();
    }
    function onOk() {
      emit2("ok", toRaw(model.value));
      hide();
    }
    function onCancel() {
      hide();
    }
    function onDialogHide() {
      emit2("hide");
    }
    function onUpdateModel(val) {
      model.value = val;
    }
    function onInputKeyup(evt) {
      if (okDisabled.value !== true && props.prompt.type !== "textarea" && isKeyCode(evt, 13) === true) {
        onOk();
      }
    }
    function getSection(classes2, text) {
      return props.html === true ? h(QCardSection, {
        class: classes2,
        innerHTML: text
      }) : h(QCardSection, { class: classes2 }, () => text);
    }
    function getPrompt() {
      return [
        h(QInput, {
          modelValue: model.value,
          ...formProps.value,
          color: vmColor.value,
          dense: true,
          autofocus: true,
          dark: isDark.value,
          "onUpdate:modelValue": onUpdateModel,
          onKeyup: onInputKeyup
        })
      ];
    }
    function getOptions() {
      return [
        h(QOptionGroup, {
          modelValue: model.value,
          ...formProps.value,
          color: vmColor.value,
          options: props.options.items,
          dark: isDark.value,
          "onUpdate:modelValue": onUpdateModel
        })
      ];
    }
    function getButtons() {
      const child = [];
      props.cancel && child.push(h(QBtn, cancelProps.value));
      props.ok && child.push(h(QBtn, okProps.value));
      return h(QCardActions, {
        class: props.stackButtons === true ? "items-end" : "",
        vertical: props.stackButtons,
        align: "right"
      }, () => child);
    }
    function getCardContent() {
      const child = [];
      props.title && child.push(getSection("q-dialog__title", props.title));
      props.progress !== false && child.push(h(QCardSection, { class: "q-dialog__progress" }, () => h(spinner.value.component, spinner.value.props)));
      props.message && child.push(getSection("q-dialog__message", props.message));
      if (props.prompt !== void 0) {
        child.push(h(QCardSection, { class: "scroll q-dialog-plugin__form" }, getPrompt));
      } else if (props.options !== void 0) {
        child.push(h(QSeparator, { dark: isDark.value }), h(QCardSection, { class: "scroll q-dialog-plugin__form" }, getOptions), h(QSeparator, { dark: isDark.value }));
      }
      if (props.ok || props.cancel) {
        child.push(getButtons());
      }
      return child;
    }
    function getContent() {
      return [
        h(QCard, {
          class: [
            classes.value,
            props.cardClass
          ],
          style: props.cardStyle,
          dark: isDark.value
        }, getCardContent)
      ];
    }
    Object.assign(proxy, { show, hide });
    return () => h(QDialog, {
      ref: dialogRef,
      onHide: onDialogHide
    }, getContent);
  }
});
function merge(target2, source) {
  for (const key in source) {
    if (key !== "spinner" && Object(source[key]) === source[key]) {
      target2[key] = Object(target2[key]) !== target2[key] ? {} : { ...target2[key] };
      merge(target2[key], source[key]);
    } else {
      target2[key] = source[key];
    }
  }
}
function globalDialog(DefaultComponent, supportsCustomComponent, parentApp) {
  return (pluginProps) => {
    let DialogComponent, props;
    const isCustom = supportsCustomComponent === true && pluginProps.component !== void 0;
    if (isCustom === true) {
      const { component, componentProps } = pluginProps;
      DialogComponent = typeof component === "string" ? parentApp.component(component) : component;
      props = componentProps;
    } else {
      const { class: klass, style, ...otherProps } = pluginProps;
      DialogComponent = DefaultComponent;
      props = otherProps;
      klass !== void 0 && (otherProps.cardClass = klass);
      style !== void 0 && (otherProps.cardStyle = style);
    }
    let vm, emittedOK = false;
    const dialogRef = ref(null);
    const el = createGlobalNode();
    const applyState = (cmd) => {
      if (dialogRef.value !== null && dialogRef.value[cmd] !== void 0) {
        dialogRef.value[cmd]();
        return;
      }
      const target2 = vm.$.subTree;
      if (target2 && target2.component) {
        if (target2.component.proxy && target2.component.proxy[cmd]) {
          target2.component.proxy[cmd]();
          return;
        }
        if (target2.component.subTree && target2.component.subTree.component && target2.component.subTree.component.proxy && target2.component.subTree.component.proxy[cmd]) {
          target2.component.subTree.component.proxy[cmd]();
          return;
        }
      }
      console.error("[Quasar] Incorrectly defined Dialog component");
    };
    const okFns = [], cancelFns = [], API = {
      onOk(fn) {
        okFns.push(fn);
        return API;
      },
      onCancel(fn) {
        cancelFns.push(fn);
        return API;
      },
      onDismiss(fn) {
        okFns.push(fn);
        cancelFns.push(fn);
        return API;
      },
      hide() {
        applyState("hide");
        return API;
      },
      update(componentProps) {
        if (vm !== null) {
          if (isCustom === true) {
            Object.assign(props, componentProps);
          } else {
            const { class: klass, style, ...cfg } = componentProps;
            klass !== void 0 && (cfg.cardClass = klass);
            style !== void 0 && (cfg.cardStyle = style);
            merge(props, cfg);
          }
          vm.$forceUpdate();
        }
        return API;
      }
    };
    const onOk = (data) => {
      emittedOK = true;
      okFns.forEach((fn) => {
        fn(data);
      });
    };
    const onHide = () => {
      app2.unmount(el);
      removeGlobalNode(el);
      app2 = null;
      vm = null;
      if (emittedOK !== true) {
        cancelFns.forEach((fn) => {
          fn();
        });
      }
    };
    let app2 = createChildApp({
      name: "QGlobalDialog",
      setup: () => () => h(DialogComponent, {
        ...props,
        ref: dialogRef,
        onOk,
        onHide
      })
    }, parentApp);
    vm = app2.mount(el);
    function show() {
      applyState("show");
    }
    if (typeof DialogComponent.__asyncLoader === "function") {
      DialogComponent.__asyncLoader().then(() => {
        nextTick(show);
      });
    } else {
      nextTick(show);
    }
    return API;
  };
}
var Dialog = {
  install({ $q, parentApp }) {
    $q.dialog = globalDialog(DialogPlugin, true, parentApp);
    if (this.__installed !== true) {
      this.create = $q.dialog;
    }
  }
};
var quasarUserOptions = { config: {}, plugins: { Dialog } };
var isLocalhost = function() {
  return Boolean(window.location.hostname === "localhost" || window.location.hostname === "[::1]" || window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));
};
var waitWindowLoad;
if (typeof window !== "undefined") {
  if (typeof Promise !== "undefined") {
    waitWindowLoad = new Promise(function(resolve2) {
      return window.addEventListener("load", resolve2);
    });
  } else {
    waitWindowLoad = { then: function(cb) {
      return window.addEventListener("load", cb);
    } };
  }
}
function register(swUrl, hooks) {
  if (hooks === void 0)
    hooks = {};
  var registrationOptions = hooks.registrationOptions;
  if (registrationOptions === void 0)
    registrationOptions = {};
  delete hooks.registrationOptions;
  var emit2 = function(hook) {
    var args = [], len = arguments.length - 1;
    while (len-- > 0)
      args[len] = arguments[len + 1];
    if (hooks && hooks[hook]) {
      hooks[hook].apply(hooks, args);
    }
  };
  if ("serviceWorker" in navigator) {
    waitWindowLoad.then(function() {
      if (isLocalhost()) {
        checkValidServiceWorker(swUrl, emit2, registrationOptions);
        navigator.serviceWorker.ready.then(function(registration) {
          emit2("ready", registration);
        }).catch(function(error) {
          return handleError(emit2, error);
        });
      } else {
        registerValidSW(swUrl, emit2, registrationOptions);
        navigator.serviceWorker.ready.then(function(registration) {
          emit2("ready", registration);
        }).catch(function(error) {
          return handleError(emit2, error);
        });
      }
    });
  }
}
function handleError(emit2, error) {
  if (!navigator.onLine) {
    emit2("offline");
  }
  emit2("error", error);
}
function registerValidSW(swUrl, emit2, registrationOptions) {
  navigator.serviceWorker.register(swUrl, registrationOptions).then(function(registration) {
    emit2("registered", registration);
    if (registration.waiting) {
      emit2("updated", registration);
      return;
    }
    registration.onupdatefound = function() {
      emit2("updatefound", registration);
      var installingWorker = registration.installing;
      installingWorker.onstatechange = function() {
        if (installingWorker.state === "installed") {
          if (navigator.serviceWorker.controller) {
            emit2("updated", registration);
          } else {
            emit2("cached", registration);
          }
        }
      };
    };
  }).catch(function(error) {
    return handleError(emit2, error);
  });
}
function checkValidServiceWorker(swUrl, emit2, registrationOptions) {
  fetch(swUrl).then(function(response) {
    if (response.status === 404) {
      emit2("error", new Error("Service worker not found at " + swUrl));
      unregister();
    } else if (response.headers.get("content-type").indexOf("javascript") === -1) {
      emit2("error", new Error("Expected " + swUrl + " to have javascript content-type, but received " + response.headers.get("content-type")));
      unregister();
    } else {
      registerValidSW(swUrl, emit2, registrationOptions);
    }
  }).catch(function(error) {
    return handleError(emit2, error);
  });
}
function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then(function(registration) {
      registration.unregister();
    }).catch(function(error) {
      return handleError(emit, error);
    });
  }
}
register("/sw.js", {
  ready() {
  },
  registered() {
  },
  cached() {
  },
  updatefound() {
  },
  updated() {
  },
  offline() {
  },
  error() {
  }
});
if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream && window.navigator.standalone) {
  __vitePreload(() => import("./fastclick.8a4a8267.js"), true ? [] : void 0);
}
const publicPath = `/`;
async function start({
  app: app2,
  router,
  store: store2
}, bootFiles) {
  let hasRedirected = false;
  const getRedirectUrl = (url) => {
    try {
      return router.resolve(url).href;
    } catch (err) {
    }
    return Object(url) === url ? null : url;
  };
  const redirect = (url) => {
    hasRedirected = true;
    if (typeof url === "string" && /^https?:\/\//.test(url)) {
      window.location.href = url;
      return;
    }
    const href = getRedirectUrl(url);
    if (href !== null) {
      window.location.href = href;
    }
  };
  const urlPath = window.location.href.replace(window.location.origin, "");
  for (let i = 0; hasRedirected === false && i < bootFiles.length; i++) {
    try {
      await bootFiles[i]({
        app: app2,
        router,
        store: store2,
        ssrContext: null,
        redirect,
        urlPath,
        publicPath
      });
    } catch (err) {
      if (err && err.url) {
        redirect(err.url);
        return;
      }
      console.error("[Quasar] boot error:", err);
      return;
    }
  }
  if (hasRedirected === true) {
    return;
  }
  app2.use(router);
  app2.mount("#q-app");
}
createQuasarApp(createApp, quasarUserOptions).then((app2) => {
  return Promise.all([
    __vitePreload(() => import("./i18n.520e5143.js"), true ? [] : void 0),
    __vitePreload(() => import("./axios.86ff4daf.js"), true ? [] : void 0)
  ]).then((bootFiles) => {
    const boot2 = bootFiles.map((entry) => entry.default).filter((entry) => typeof entry === "function");
    start(app2, boot2);
  });
});
export { reactive as $, addEvt as A, preventDraggable as B, prevent as C, Dialog as D, stop as E, Fragment as F, position as G, cleanEvt as H, stopAndPrevent as I, useModelToggleProps as J, useModelToggleEmits as K, useTimeout as L, useModelToggle as M, useHistory as N, between as O, Platform as P, Quasar as Q, withDirectives as R, hDir as S, Text as T, usePreventScroll as U, provide as V, pageContainerKey as W, getScrollTarget as X, getVerticalScrollPosition as Y, getHorizontalScrollPosition as Z, getScrollbarWidth as _, onUnmounted as a, hMergeSlot as a0, useRouterLinkProps as a1, useRouterLink as a2, isKeyCode as a3, defineComponent as a4, _export_sfc as a5, openBlock as a6, createBlock as a7, withCtx as a8, QIcon as a9, createCommentVNode as aa, createTextVNode as ab, toDisplayString as ac, resolveComponent as ad, QBtn as ae, createBaseVNode as af, createElementBlock as ag, renderList as ah, mergeProps as ai, toRef as aj, isRef as b, computed as c, createVNode as d, boot as e, createComponent as f, getCurrentInstance as g, h, inject as i, hSlot as j, isRuntimeSsrPreHydration as k, onBeforeUnmount as l, noop$1 as m, nextTick as n, onMounted as o, listenOpts as p, layoutKey as q, ref as r, setupDevtoolsPlugin as s, hUniqueSlot as t, useDarkProps as u, useDark as v, watch as w, createDirective as x, client as y, leftClick as z };