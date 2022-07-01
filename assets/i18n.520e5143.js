import { h, F as Fragment, i as inject, o as onMounted, a as onUnmounted, b as isRef, r as ref, g as getCurrentInstance, c as computed, w as watch, s as setupDevtoolsPlugin, d as createVNode, T as Text, e as boot } from "./index.ca91cb47.js";
/*!
  * @intlify/shared v9.1.10
  * (c) 2022 kazuya kawaguchi
  * Released under the MIT License.
  */
const hasSymbol = typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol";
const makeSymbol = (name) => hasSymbol ? Symbol(name) : name;
const generateFormatCacheKey = (locale, key, source) => friendlyJSONstringify({ l: locale, k: key, s: source });
const friendlyJSONstringify = (json) => JSON.stringify(json).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029").replace(/\u0027/g, "\\u0027");
const isNumber = (val) => typeof val === "number" && isFinite(val);
const isDate = (val) => toTypeString(val) === "[object Date]";
const isRegExp = (val) => toTypeString(val) === "[object RegExp]";
const isEmptyObject = (val) => isPlainObject(val) && Object.keys(val).length === 0;
function warn(msg, err) {
  if (typeof console !== "undefined") {
    console.warn(`[intlify] ` + msg);
    if (err) {
      console.warn(err.stack);
    }
  }
}
const assign = Object.assign;
let _globalThis;
const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
};
function escapeHtml(rawText) {
  return rawText.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
const hasOwnProperty$1 = Object.prototype.hasOwnProperty;
function hasOwn$1(obj, key) {
  return hasOwnProperty$1.call(obj, key);
}
const isArray = Array.isArray;
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isBoolean = (val) => typeof val === "boolean";
const isObject$1 = (val) => val !== null && typeof val === "object";
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const isPlainObject = (val) => toTypeString(val) === "[object Object]";
const toDisplayString = (val) => {
  return val == null ? "" : isArray(val) || isPlainObject(val) && val.toString === objectToString ? JSON.stringify(val, null, 2) : String(val);
};
function createEmitter() {
  const events = /* @__PURE__ */ new Map();
  const emitter = {
    events,
    on(event, handler) {
      const handlers = events.get(event);
      const added = handlers && handlers.push(handler);
      if (!added) {
        events.set(event, [handler]);
      }
    },
    off(event, handler) {
      const handlers = events.get(event);
      if (handlers) {
        handlers.splice(handlers.indexOf(handler) >>> 0, 1);
      }
    },
    emit(event, payload) {
      (events.get(event) || []).slice().map((handler) => handler(payload));
      (events.get("*") || []).slice().map((handler) => handler(event, payload));
    }
  };
  return emitter;
}
/*!
  * @intlify/message-resolver v9.1.10
  * (c) 2022 kazuya kawaguchi
  * Released under the MIT License.
  */
const hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}
const isObject = (val) => val !== null && typeof val === "object";
const pathStateMachine = [];
pathStateMachine[0] = {
  ["w"]: [0],
  ["i"]: [3, 0],
  ["["]: [4],
  ["o"]: [7]
};
pathStateMachine[1] = {
  ["w"]: [1],
  ["."]: [2],
  ["["]: [4],
  ["o"]: [7]
};
pathStateMachine[2] = {
  ["w"]: [2],
  ["i"]: [3, 0],
  ["0"]: [3, 0]
};
pathStateMachine[3] = {
  ["i"]: [3, 0],
  ["0"]: [3, 0],
  ["w"]: [1, 1],
  ["."]: [2, 1],
  ["["]: [4, 1],
  ["o"]: [7, 1]
};
pathStateMachine[4] = {
  ["'"]: [5, 0],
  ['"']: [6, 0],
  ["["]: [
    4,
    2
  ],
  ["]"]: [1, 3],
  ["o"]: 8,
  ["l"]: [4, 0]
};
pathStateMachine[5] = {
  ["'"]: [4, 0],
  ["o"]: 8,
  ["l"]: [5, 0]
};
pathStateMachine[6] = {
  ['"']: [4, 0],
  ["o"]: 8,
  ["l"]: [6, 0]
};
const literalValueRE = /^\s?(?:true|false|-?[\d.]+|'[^']*'|"[^"]*")\s?$/;
function isLiteral(exp) {
  return literalValueRE.test(exp);
}
function stripQuotes(str) {
  const a = str.charCodeAt(0);
  const b = str.charCodeAt(str.length - 1);
  return a === b && (a === 34 || a === 39) ? str.slice(1, -1) : str;
}
function getPathCharType(ch) {
  if (ch === void 0 || ch === null) {
    return "o";
  }
  const code = ch.charCodeAt(0);
  switch (code) {
    case 91:
    case 93:
    case 46:
    case 34:
    case 39:
      return ch;
    case 95:
    case 36:
    case 45:
      return "i";
    case 9:
    case 10:
    case 13:
    case 160:
    case 65279:
    case 8232:
    case 8233:
      return "w";
  }
  return "i";
}
function formatSubPath(path) {
  const trimmed = path.trim();
  if (path.charAt(0) === "0" && isNaN(parseInt(path))) {
    return false;
  }
  return isLiteral(trimmed) ? stripQuotes(trimmed) : "*" + trimmed;
}
function parse(path) {
  const keys = [];
  let index = -1;
  let mode = 0;
  let subPathDepth = 0;
  let c;
  let key;
  let newChar;
  let type;
  let transition;
  let action;
  let typeMap;
  const actions = [];
  actions[0] = () => {
    if (key === void 0) {
      key = newChar;
    } else {
      key += newChar;
    }
  };
  actions[1] = () => {
    if (key !== void 0) {
      keys.push(key);
      key = void 0;
    }
  };
  actions[2] = () => {
    actions[0]();
    subPathDepth++;
  };
  actions[3] = () => {
    if (subPathDepth > 0) {
      subPathDepth--;
      mode = 4;
      actions[0]();
    } else {
      subPathDepth = 0;
      if (key === void 0) {
        return false;
      }
      key = formatSubPath(key);
      if (key === false) {
        return false;
      } else {
        actions[1]();
      }
    }
  };
  function maybeUnescapeQuote() {
    const nextChar = path[index + 1];
    if (mode === 5 && nextChar === "'" || mode === 6 && nextChar === '"') {
      index++;
      newChar = "\\" + nextChar;
      actions[0]();
      return true;
    }
  }
  while (mode !== null) {
    index++;
    c = path[index];
    if (c === "\\" && maybeUnescapeQuote()) {
      continue;
    }
    type = getPathCharType(c);
    typeMap = pathStateMachine[mode];
    transition = typeMap[type] || typeMap["l"] || 8;
    if (transition === 8) {
      return;
    }
    mode = transition[0];
    if (transition[1] !== void 0) {
      action = actions[transition[1]];
      if (action) {
        newChar = c;
        if (action() === false) {
          return;
        }
      }
    }
    if (mode === 7) {
      return keys;
    }
  }
}
const cache = /* @__PURE__ */ new Map();
function resolveValue(obj, path) {
  if (!isObject(obj)) {
    return null;
  }
  let hit = cache.get(path);
  if (!hit) {
    hit = parse(path);
    if (hit) {
      cache.set(path, hit);
    }
  }
  if (!hit) {
    return null;
  }
  const len = hit.length;
  let last = obj;
  let i = 0;
  while (i < len) {
    const val = last[hit[i]];
    if (val === void 0) {
      return null;
    }
    last = val;
    i++;
  }
  return last;
}
function handleFlatJson(obj) {
  if (!isObject(obj)) {
    return obj;
  }
  for (const key in obj) {
    if (!hasOwn(obj, key)) {
      continue;
    }
    if (!key.includes(".")) {
      if (isObject(obj[key])) {
        handleFlatJson(obj[key]);
      }
    } else {
      const subKeys = key.split(".");
      const lastIndex = subKeys.length - 1;
      let currentObj = obj;
      for (let i = 0; i < lastIndex; i++) {
        if (!(subKeys[i] in currentObj)) {
          currentObj[subKeys[i]] = {};
        }
        currentObj = currentObj[subKeys[i]];
      }
      currentObj[subKeys[lastIndex]] = obj[key];
      delete obj[key];
      if (isObject(currentObj[subKeys[lastIndex]])) {
        handleFlatJson(currentObj[subKeys[lastIndex]]);
      }
    }
  }
  return obj;
}
/*!
  * @intlify/runtime v9.1.10
  * (c) 2022 kazuya kawaguchi
  * Released under the MIT License.
  */
const DEFAULT_MODIFIER = (str) => str;
const DEFAULT_MESSAGE = (ctx) => "";
const DEFAULT_MESSAGE_DATA_TYPE = "text";
const DEFAULT_NORMALIZE = (values) => values.length === 0 ? "" : values.join("");
const DEFAULT_INTERPOLATE = toDisplayString;
function pluralDefault(choice, choicesLength) {
  choice = Math.abs(choice);
  if (choicesLength === 2) {
    return choice ? choice > 1 ? 1 : 0 : 1;
  }
  return choice ? Math.min(choice, 2) : 0;
}
function getPluralIndex(options) {
  const index = isNumber(options.pluralIndex) ? options.pluralIndex : -1;
  return options.named && (isNumber(options.named.count) || isNumber(options.named.n)) ? isNumber(options.named.count) ? options.named.count : isNumber(options.named.n) ? options.named.n : index : index;
}
function normalizeNamed(pluralIndex, props) {
  if (!props.count) {
    props.count = pluralIndex;
  }
  if (!props.n) {
    props.n = pluralIndex;
  }
}
function createMessageContext(options = {}) {
  const locale = options.locale;
  const pluralIndex = getPluralIndex(options);
  const pluralRule = isObject$1(options.pluralRules) && isString(locale) && isFunction(options.pluralRules[locale]) ? options.pluralRules[locale] : pluralDefault;
  const orgPluralRule = isObject$1(options.pluralRules) && isString(locale) && isFunction(options.pluralRules[locale]) ? pluralDefault : void 0;
  const plural = (messages2) => messages2[pluralRule(pluralIndex, messages2.length, orgPluralRule)];
  const _list = options.list || [];
  const list = (index) => _list[index];
  const _named = options.named || {};
  isNumber(options.pluralIndex) && normalizeNamed(pluralIndex, _named);
  const named = (key) => _named[key];
  function message(key) {
    const msg = isFunction(options.messages) ? options.messages(key) : isObject$1(options.messages) ? options.messages[key] : false;
    return !msg ? options.parent ? options.parent.message(key) : DEFAULT_MESSAGE : msg;
  }
  const _modifier = (name) => options.modifiers ? options.modifiers[name] : DEFAULT_MODIFIER;
  const normalize = isPlainObject(options.processor) && isFunction(options.processor.normalize) ? options.processor.normalize : DEFAULT_NORMALIZE;
  const interpolate = isPlainObject(options.processor) && isFunction(options.processor.interpolate) ? options.processor.interpolate : DEFAULT_INTERPOLATE;
  const type = isPlainObject(options.processor) && isString(options.processor.type) ? options.processor.type : DEFAULT_MESSAGE_DATA_TYPE;
  const ctx = {
    ["list"]: list,
    ["named"]: named,
    ["plural"]: plural,
    ["linked"]: (key, modifier) => {
      const msg = message(key)(ctx);
      return isString(modifier) ? _modifier(modifier)(msg) : msg;
    },
    ["message"]: message,
    ["type"]: type,
    ["interpolate"]: interpolate,
    ["normalize"]: normalize
  };
  return ctx;
}
/*!
  * @intlify/message-compiler v9.1.10
  * (c) 2022 kazuya kawaguchi
  * Released under the MIT License.
  */
function createCompileError(code, loc, options = {}) {
  const { domain, messages: messages2, args } = options;
  const msg = code;
  const error = new SyntaxError(String(msg));
  error.code = code;
  if (loc) {
    error.location = loc;
  }
  error.domain = domain;
  return error;
}
function defaultOnError(error) {
  throw error;
}
function createPosition(line, column, offset) {
  return { line, column, offset };
}
function createLocation(start, end, source) {
  const loc = { start, end };
  if (source != null) {
    loc.source = source;
  }
  return loc;
}
const CHAR_SP = " ";
const CHAR_CR = "\r";
const CHAR_LF = "\n";
const CHAR_LS = String.fromCharCode(8232);
const CHAR_PS = String.fromCharCode(8233);
function createScanner(str) {
  const _buf = str;
  let _index = 0;
  let _line = 1;
  let _column = 1;
  let _peekOffset = 0;
  const isCRLF = (index2) => _buf[index2] === CHAR_CR && _buf[index2 + 1] === CHAR_LF;
  const isLF = (index2) => _buf[index2] === CHAR_LF;
  const isPS = (index2) => _buf[index2] === CHAR_PS;
  const isLS = (index2) => _buf[index2] === CHAR_LS;
  const isLineEnd = (index2) => isCRLF(index2) || isLF(index2) || isPS(index2) || isLS(index2);
  const index = () => _index;
  const line = () => _line;
  const column = () => _column;
  const peekOffset = () => _peekOffset;
  const charAt = (offset) => isCRLF(offset) || isPS(offset) || isLS(offset) ? CHAR_LF : _buf[offset];
  const currentChar = () => charAt(_index);
  const currentPeek = () => charAt(_index + _peekOffset);
  function next() {
    _peekOffset = 0;
    if (isLineEnd(_index)) {
      _line++;
      _column = 0;
    }
    if (isCRLF(_index)) {
      _index++;
    }
    _index++;
    _column++;
    return _buf[_index];
  }
  function peek() {
    if (isCRLF(_index + _peekOffset)) {
      _peekOffset++;
    }
    _peekOffset++;
    return _buf[_index + _peekOffset];
  }
  function reset() {
    _index = 0;
    _line = 1;
    _column = 1;
    _peekOffset = 0;
  }
  function resetPeek(offset = 0) {
    _peekOffset = offset;
  }
  function skipToPeek() {
    const target = _index + _peekOffset;
    while (target !== _index) {
      next();
    }
    _peekOffset = 0;
  }
  return {
    index,
    line,
    column,
    peekOffset,
    charAt,
    currentChar,
    currentPeek,
    next,
    peek,
    reset,
    resetPeek,
    skipToPeek
  };
}
const EOF = void 0;
const LITERAL_DELIMITER = "'";
const ERROR_DOMAIN$1 = "tokenizer";
function createTokenizer(source, options = {}) {
  const location = options.location !== false;
  const _scnr = createScanner(source);
  const currentOffset = () => _scnr.index();
  const currentPosition = () => createPosition(_scnr.line(), _scnr.column(), _scnr.index());
  const _initLoc = currentPosition();
  const _initOffset = currentOffset();
  const _context = {
    currentType: 14,
    offset: _initOffset,
    startLoc: _initLoc,
    endLoc: _initLoc,
    lastType: 14,
    lastOffset: _initOffset,
    lastStartLoc: _initLoc,
    lastEndLoc: _initLoc,
    braceNest: 0,
    inLinked: false,
    text: ""
  };
  const context = () => _context;
  const { onError } = options;
  function emitError(code, pos, offset, ...args) {
    const ctx = context();
    pos.column += offset;
    pos.offset += offset;
    if (onError) {
      const loc = createLocation(ctx.startLoc, pos);
      const err = createCompileError(code, loc, {
        domain: ERROR_DOMAIN$1,
        args
      });
      onError(err);
    }
  }
  function getToken(context2, type, value) {
    context2.endLoc = currentPosition();
    context2.currentType = type;
    const token = { type };
    if (location) {
      token.loc = createLocation(context2.startLoc, context2.endLoc);
    }
    if (value != null) {
      token.value = value;
    }
    return token;
  }
  const getEndToken = (context2) => getToken(context2, 14);
  function eat(scnr, ch) {
    if (scnr.currentChar() === ch) {
      scnr.next();
      return ch;
    } else {
      emitError(0, currentPosition(), 0, ch);
      return "";
    }
  }
  function peekSpaces(scnr) {
    let buf = "";
    while (scnr.currentPeek() === CHAR_SP || scnr.currentPeek() === CHAR_LF) {
      buf += scnr.currentPeek();
      scnr.peek();
    }
    return buf;
  }
  function skipSpaces(scnr) {
    const buf = peekSpaces(scnr);
    scnr.skipToPeek();
    return buf;
  }
  function isIdentifierStart(ch) {
    if (ch === EOF) {
      return false;
    }
    const cc = ch.charCodeAt(0);
    return cc >= 97 && cc <= 122 || cc >= 65 && cc <= 90 || cc === 95;
  }
  function isNumberStart(ch) {
    if (ch === EOF) {
      return false;
    }
    const cc = ch.charCodeAt(0);
    return cc >= 48 && cc <= 57;
  }
  function isNamedIdentifierStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 2) {
      return false;
    }
    peekSpaces(scnr);
    const ret = isIdentifierStart(scnr.currentPeek());
    scnr.resetPeek();
    return ret;
  }
  function isListIdentifierStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 2) {
      return false;
    }
    peekSpaces(scnr);
    const ch = scnr.currentPeek() === "-" ? scnr.peek() : scnr.currentPeek();
    const ret = isNumberStart(ch);
    scnr.resetPeek();
    return ret;
  }
  function isLiteralStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 2) {
      return false;
    }
    peekSpaces(scnr);
    const ret = scnr.currentPeek() === LITERAL_DELIMITER;
    scnr.resetPeek();
    return ret;
  }
  function isLinkedDotStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 8) {
      return false;
    }
    peekSpaces(scnr);
    const ret = scnr.currentPeek() === ".";
    scnr.resetPeek();
    return ret;
  }
  function isLinkedModifierStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 9) {
      return false;
    }
    peekSpaces(scnr);
    const ret = isIdentifierStart(scnr.currentPeek());
    scnr.resetPeek();
    return ret;
  }
  function isLinkedDelimiterStart(scnr, context2) {
    const { currentType } = context2;
    if (!(currentType === 8 || currentType === 12)) {
      return false;
    }
    peekSpaces(scnr);
    const ret = scnr.currentPeek() === ":";
    scnr.resetPeek();
    return ret;
  }
  function isLinkedReferStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 10) {
      return false;
    }
    const fn = () => {
      const ch = scnr.currentPeek();
      if (ch === "{") {
        return isIdentifierStart(scnr.peek());
      } else if (ch === "@" || ch === "%" || ch === "|" || ch === ":" || ch === "." || ch === CHAR_SP || !ch) {
        return false;
      } else if (ch === CHAR_LF) {
        scnr.peek();
        return fn();
      } else {
        return isIdentifierStart(ch);
      }
    };
    const ret = fn();
    scnr.resetPeek();
    return ret;
  }
  function isPluralStart(scnr) {
    peekSpaces(scnr);
    const ret = scnr.currentPeek() === "|";
    scnr.resetPeek();
    return ret;
  }
  function isTextStart(scnr, reset = true) {
    const fn = (hasSpace = false, prev = "", detectModulo = false) => {
      const ch = scnr.currentPeek();
      if (ch === "{") {
        return prev === "%" ? false : hasSpace;
      } else if (ch === "@" || !ch) {
        return prev === "%" ? true : hasSpace;
      } else if (ch === "%") {
        scnr.peek();
        return fn(hasSpace, "%", true);
      } else if (ch === "|") {
        return prev === "%" || detectModulo ? true : !(prev === CHAR_SP || prev === CHAR_LF);
      } else if (ch === CHAR_SP) {
        scnr.peek();
        return fn(true, CHAR_SP, detectModulo);
      } else if (ch === CHAR_LF) {
        scnr.peek();
        return fn(true, CHAR_LF, detectModulo);
      } else {
        return true;
      }
    };
    const ret = fn();
    reset && scnr.resetPeek();
    return ret;
  }
  function takeChar(scnr, fn) {
    const ch = scnr.currentChar();
    if (ch === EOF) {
      return EOF;
    }
    if (fn(ch)) {
      scnr.next();
      return ch;
    }
    return null;
  }
  function takeIdentifierChar(scnr) {
    const closure = (ch) => {
      const cc = ch.charCodeAt(0);
      return cc >= 97 && cc <= 122 || cc >= 65 && cc <= 90 || cc >= 48 && cc <= 57 || cc === 95 || cc === 36;
    };
    return takeChar(scnr, closure);
  }
  function takeDigit(scnr) {
    const closure = (ch) => {
      const cc = ch.charCodeAt(0);
      return cc >= 48 && cc <= 57;
    };
    return takeChar(scnr, closure);
  }
  function takeHexDigit(scnr) {
    const closure = (ch) => {
      const cc = ch.charCodeAt(0);
      return cc >= 48 && cc <= 57 || cc >= 65 && cc <= 70 || cc >= 97 && cc <= 102;
    };
    return takeChar(scnr, closure);
  }
  function getDigits(scnr) {
    let ch = "";
    let num = "";
    while (ch = takeDigit(scnr)) {
      num += ch;
    }
    return num;
  }
  function readText(scnr) {
    let buf = "";
    while (true) {
      const ch = scnr.currentChar();
      if (ch === "{" || ch === "}" || ch === "@" || ch === "|" || !ch) {
        break;
      } else if (ch === "%") {
        if (isTextStart(scnr)) {
          buf += ch;
          scnr.next();
        } else {
          break;
        }
      } else if (ch === CHAR_SP || ch === CHAR_LF) {
        if (isTextStart(scnr)) {
          buf += ch;
          scnr.next();
        } else if (isPluralStart(scnr)) {
          break;
        } else {
          buf += ch;
          scnr.next();
        }
      } else {
        buf += ch;
        scnr.next();
      }
    }
    return buf;
  }
  function readNamedIdentifier(scnr) {
    skipSpaces(scnr);
    let ch = "";
    let name = "";
    while (ch = takeIdentifierChar(scnr)) {
      name += ch;
    }
    if (scnr.currentChar() === EOF) {
      emitError(6, currentPosition(), 0);
    }
    return name;
  }
  function readListIdentifier(scnr) {
    skipSpaces(scnr);
    let value = "";
    if (scnr.currentChar() === "-") {
      scnr.next();
      value += `-${getDigits(scnr)}`;
    } else {
      value += getDigits(scnr);
    }
    if (scnr.currentChar() === EOF) {
      emitError(6, currentPosition(), 0);
    }
    return value;
  }
  function readLiteral(scnr) {
    skipSpaces(scnr);
    eat(scnr, `'`);
    let ch = "";
    let literal = "";
    const fn = (x) => x !== LITERAL_DELIMITER && x !== CHAR_LF;
    while (ch = takeChar(scnr, fn)) {
      if (ch === "\\") {
        literal += readEscapeSequence(scnr);
      } else {
        literal += ch;
      }
    }
    const current = scnr.currentChar();
    if (current === CHAR_LF || current === EOF) {
      emitError(2, currentPosition(), 0);
      if (current === CHAR_LF) {
        scnr.next();
        eat(scnr, `'`);
      }
      return literal;
    }
    eat(scnr, `'`);
    return literal;
  }
  function readEscapeSequence(scnr) {
    const ch = scnr.currentChar();
    switch (ch) {
      case "\\":
      case `'`:
        scnr.next();
        return `\\${ch}`;
      case "u":
        return readUnicodeEscapeSequence(scnr, ch, 4);
      case "U":
        return readUnicodeEscapeSequence(scnr, ch, 6);
      default:
        emitError(3, currentPosition(), 0, ch);
        return "";
    }
  }
  function readUnicodeEscapeSequence(scnr, unicode, digits) {
    eat(scnr, unicode);
    let sequence = "";
    for (let i = 0; i < digits; i++) {
      const ch = takeHexDigit(scnr);
      if (!ch) {
        emitError(4, currentPosition(), 0, `\\${unicode}${sequence}${scnr.currentChar()}`);
        break;
      }
      sequence += ch;
    }
    return `\\${unicode}${sequence}`;
  }
  function readInvalidIdentifier(scnr) {
    skipSpaces(scnr);
    let ch = "";
    let identifiers = "";
    const closure = (ch2) => ch2 !== "{" && ch2 !== "}" && ch2 !== CHAR_SP && ch2 !== CHAR_LF;
    while (ch = takeChar(scnr, closure)) {
      identifiers += ch;
    }
    return identifiers;
  }
  function readLinkedModifier(scnr) {
    let ch = "";
    let name = "";
    while (ch = takeIdentifierChar(scnr)) {
      name += ch;
    }
    return name;
  }
  function readLinkedRefer(scnr) {
    const fn = (detect = false, buf) => {
      const ch = scnr.currentChar();
      if (ch === "{" || ch === "%" || ch === "@" || ch === "|" || !ch) {
        return buf;
      } else if (ch === CHAR_SP) {
        return buf;
      } else if (ch === CHAR_LF) {
        buf += ch;
        scnr.next();
        return fn(detect, buf);
      } else {
        buf += ch;
        scnr.next();
        return fn(true, buf);
      }
    };
    return fn(false, "");
  }
  function readPlural(scnr) {
    skipSpaces(scnr);
    const plural = eat(scnr, "|");
    skipSpaces(scnr);
    return plural;
  }
  function readTokenInPlaceholder(scnr, context2) {
    let token = null;
    const ch = scnr.currentChar();
    switch (ch) {
      case "{":
        if (context2.braceNest >= 1) {
          emitError(8, currentPosition(), 0);
        }
        scnr.next();
        token = getToken(context2, 2, "{");
        skipSpaces(scnr);
        context2.braceNest++;
        return token;
      case "}":
        if (context2.braceNest > 0 && context2.currentType === 2) {
          emitError(7, currentPosition(), 0);
        }
        scnr.next();
        token = getToken(context2, 3, "}");
        context2.braceNest--;
        context2.braceNest > 0 && skipSpaces(scnr);
        if (context2.inLinked && context2.braceNest === 0) {
          context2.inLinked = false;
        }
        return token;
      case "@":
        if (context2.braceNest > 0) {
          emitError(6, currentPosition(), 0);
        }
        token = readTokenInLinked(scnr, context2) || getEndToken(context2);
        context2.braceNest = 0;
        return token;
      default:
        let validNamedIdentifier = true;
        let validListIdentifier = true;
        let validLiteral = true;
        if (isPluralStart(scnr)) {
          if (context2.braceNest > 0) {
            emitError(6, currentPosition(), 0);
          }
          token = getToken(context2, 1, readPlural(scnr));
          context2.braceNest = 0;
          context2.inLinked = false;
          return token;
        }
        if (context2.braceNest > 0 && (context2.currentType === 5 || context2.currentType === 6 || context2.currentType === 7)) {
          emitError(6, currentPosition(), 0);
          context2.braceNest = 0;
          return readToken(scnr, context2);
        }
        if (validNamedIdentifier = isNamedIdentifierStart(scnr, context2)) {
          token = getToken(context2, 5, readNamedIdentifier(scnr));
          skipSpaces(scnr);
          return token;
        }
        if (validListIdentifier = isListIdentifierStart(scnr, context2)) {
          token = getToken(context2, 6, readListIdentifier(scnr));
          skipSpaces(scnr);
          return token;
        }
        if (validLiteral = isLiteralStart(scnr, context2)) {
          token = getToken(context2, 7, readLiteral(scnr));
          skipSpaces(scnr);
          return token;
        }
        if (!validNamedIdentifier && !validListIdentifier && !validLiteral) {
          token = getToken(context2, 13, readInvalidIdentifier(scnr));
          emitError(1, currentPosition(), 0, token.value);
          skipSpaces(scnr);
          return token;
        }
        break;
    }
    return token;
  }
  function readTokenInLinked(scnr, context2) {
    const { currentType } = context2;
    let token = null;
    const ch = scnr.currentChar();
    if ((currentType === 8 || currentType === 9 || currentType === 12 || currentType === 10) && (ch === CHAR_LF || ch === CHAR_SP)) {
      emitError(9, currentPosition(), 0);
    }
    switch (ch) {
      case "@":
        scnr.next();
        token = getToken(context2, 8, "@");
        context2.inLinked = true;
        return token;
      case ".":
        skipSpaces(scnr);
        scnr.next();
        return getToken(context2, 9, ".");
      case ":":
        skipSpaces(scnr);
        scnr.next();
        return getToken(context2, 10, ":");
      default:
        if (isPluralStart(scnr)) {
          token = getToken(context2, 1, readPlural(scnr));
          context2.braceNest = 0;
          context2.inLinked = false;
          return token;
        }
        if (isLinkedDotStart(scnr, context2) || isLinkedDelimiterStart(scnr, context2)) {
          skipSpaces(scnr);
          return readTokenInLinked(scnr, context2);
        }
        if (isLinkedModifierStart(scnr, context2)) {
          skipSpaces(scnr);
          return getToken(context2, 12, readLinkedModifier(scnr));
        }
        if (isLinkedReferStart(scnr, context2)) {
          skipSpaces(scnr);
          if (ch === "{") {
            return readTokenInPlaceholder(scnr, context2) || token;
          } else {
            return getToken(context2, 11, readLinkedRefer(scnr));
          }
        }
        if (currentType === 8) {
          emitError(9, currentPosition(), 0);
        }
        context2.braceNest = 0;
        context2.inLinked = false;
        return readToken(scnr, context2);
    }
  }
  function readToken(scnr, context2) {
    let token = { type: 14 };
    if (context2.braceNest > 0) {
      return readTokenInPlaceholder(scnr, context2) || getEndToken(context2);
    }
    if (context2.inLinked) {
      return readTokenInLinked(scnr, context2) || getEndToken(context2);
    }
    const ch = scnr.currentChar();
    switch (ch) {
      case "{":
        return readTokenInPlaceholder(scnr, context2) || getEndToken(context2);
      case "}":
        emitError(5, currentPosition(), 0);
        scnr.next();
        return getToken(context2, 3, "}");
      case "@":
        return readTokenInLinked(scnr, context2) || getEndToken(context2);
      default:
        if (isPluralStart(scnr)) {
          token = getToken(context2, 1, readPlural(scnr));
          context2.braceNest = 0;
          context2.inLinked = false;
          return token;
        }
        if (isTextStart(scnr)) {
          return getToken(context2, 0, readText(scnr));
        }
        if (ch === "%") {
          scnr.next();
          return getToken(context2, 4, "%");
        }
        break;
    }
    return token;
  }
  function nextToken() {
    const { currentType, offset, startLoc, endLoc } = _context;
    _context.lastType = currentType;
    _context.lastOffset = offset;
    _context.lastStartLoc = startLoc;
    _context.lastEndLoc = endLoc;
    _context.offset = currentOffset();
    _context.startLoc = currentPosition();
    if (_scnr.currentChar() === EOF) {
      return getToken(_context, 14);
    }
    return readToken(_scnr, _context);
  }
  return {
    nextToken,
    currentOffset,
    currentPosition,
    context
  };
}
const ERROR_DOMAIN = "parser";
const KNOWN_ESCAPES = /(?:\\\\|\\'|\\u([0-9a-fA-F]{4})|\\U([0-9a-fA-F]{6}))/g;
function fromEscapeSequence(match, codePoint4, codePoint6) {
  switch (match) {
    case `\\\\`:
      return `\\`;
    case `\\'`:
      return `'`;
    default: {
      const codePoint = parseInt(codePoint4 || codePoint6, 16);
      if (codePoint <= 55295 || codePoint >= 57344) {
        return String.fromCodePoint(codePoint);
      }
      return "\uFFFD";
    }
  }
}
function createParser(options = {}) {
  const location = options.location !== false;
  const { onError } = options;
  function emitError(tokenzer, code, start, offset, ...args) {
    const end = tokenzer.currentPosition();
    end.offset += offset;
    end.column += offset;
    if (onError) {
      const loc = createLocation(start, end);
      const err = createCompileError(code, loc, {
        domain: ERROR_DOMAIN,
        args
      });
      onError(err);
    }
  }
  function startNode(type, offset, loc) {
    const node = {
      type,
      start: offset,
      end: offset
    };
    if (location) {
      node.loc = { start: loc, end: loc };
    }
    return node;
  }
  function endNode(node, offset, pos, type) {
    node.end = offset;
    if (type) {
      node.type = type;
    }
    if (location && node.loc) {
      node.loc.end = pos;
    }
  }
  function parseText(tokenizer, value) {
    const context = tokenizer.context();
    const node = startNode(3, context.offset, context.startLoc);
    node.value = value;
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseList(tokenizer, index) {
    const context = tokenizer.context();
    const { lastOffset: offset, lastStartLoc: loc } = context;
    const node = startNode(5, offset, loc);
    node.index = parseInt(index, 10);
    tokenizer.nextToken();
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseNamed(tokenizer, key) {
    const context = tokenizer.context();
    const { lastOffset: offset, lastStartLoc: loc } = context;
    const node = startNode(4, offset, loc);
    node.key = key;
    tokenizer.nextToken();
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseLiteral(tokenizer, value) {
    const context = tokenizer.context();
    const { lastOffset: offset, lastStartLoc: loc } = context;
    const node = startNode(9, offset, loc);
    node.value = value.replace(KNOWN_ESCAPES, fromEscapeSequence);
    tokenizer.nextToken();
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseLinkedModifier(tokenizer) {
    const token = tokenizer.nextToken();
    const context = tokenizer.context();
    const { lastOffset: offset, lastStartLoc: loc } = context;
    const node = startNode(8, offset, loc);
    if (token.type !== 12) {
      emitError(tokenizer, 11, context.lastStartLoc, 0);
      node.value = "";
      endNode(node, offset, loc);
      return {
        nextConsumeToken: token,
        node
      };
    }
    if (token.value == null) {
      emitError(tokenizer, 13, context.lastStartLoc, 0, getTokenCaption(token));
    }
    node.value = token.value || "";
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return {
      node
    };
  }
  function parseLinkedKey(tokenizer, value) {
    const context = tokenizer.context();
    const node = startNode(7, context.offset, context.startLoc);
    node.value = value;
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseLinked(tokenizer) {
    const context = tokenizer.context();
    const linkedNode = startNode(6, context.offset, context.startLoc);
    let token = tokenizer.nextToken();
    if (token.type === 9) {
      const parsed = parseLinkedModifier(tokenizer);
      linkedNode.modifier = parsed.node;
      token = parsed.nextConsumeToken || tokenizer.nextToken();
    }
    if (token.type !== 10) {
      emitError(tokenizer, 13, context.lastStartLoc, 0, getTokenCaption(token));
    }
    token = tokenizer.nextToken();
    if (token.type === 2) {
      token = tokenizer.nextToken();
    }
    switch (token.type) {
      case 11:
        if (token.value == null) {
          emitError(tokenizer, 13, context.lastStartLoc, 0, getTokenCaption(token));
        }
        linkedNode.key = parseLinkedKey(tokenizer, token.value || "");
        break;
      case 5:
        if (token.value == null) {
          emitError(tokenizer, 13, context.lastStartLoc, 0, getTokenCaption(token));
        }
        linkedNode.key = parseNamed(tokenizer, token.value || "");
        break;
      case 6:
        if (token.value == null) {
          emitError(tokenizer, 13, context.lastStartLoc, 0, getTokenCaption(token));
        }
        linkedNode.key = parseList(tokenizer, token.value || "");
        break;
      case 7:
        if (token.value == null) {
          emitError(tokenizer, 13, context.lastStartLoc, 0, getTokenCaption(token));
        }
        linkedNode.key = parseLiteral(tokenizer, token.value || "");
        break;
      default:
        emitError(tokenizer, 12, context.lastStartLoc, 0);
        const nextContext = tokenizer.context();
        const emptyLinkedKeyNode = startNode(7, nextContext.offset, nextContext.startLoc);
        emptyLinkedKeyNode.value = "";
        endNode(emptyLinkedKeyNode, nextContext.offset, nextContext.startLoc);
        linkedNode.key = emptyLinkedKeyNode;
        endNode(linkedNode, nextContext.offset, nextContext.startLoc);
        return {
          nextConsumeToken: token,
          node: linkedNode
        };
    }
    endNode(linkedNode, tokenizer.currentOffset(), tokenizer.currentPosition());
    return {
      node: linkedNode
    };
  }
  function parseMessage(tokenizer) {
    const context = tokenizer.context();
    const startOffset = context.currentType === 1 ? tokenizer.currentOffset() : context.offset;
    const startLoc = context.currentType === 1 ? context.endLoc : context.startLoc;
    const node = startNode(2, startOffset, startLoc);
    node.items = [];
    let nextToken = null;
    do {
      const token = nextToken || tokenizer.nextToken();
      nextToken = null;
      switch (token.type) {
        case 0:
          if (token.value == null) {
            emitError(tokenizer, 13, context.lastStartLoc, 0, getTokenCaption(token));
          }
          node.items.push(parseText(tokenizer, token.value || ""));
          break;
        case 6:
          if (token.value == null) {
            emitError(tokenizer, 13, context.lastStartLoc, 0, getTokenCaption(token));
          }
          node.items.push(parseList(tokenizer, token.value || ""));
          break;
        case 5:
          if (token.value == null) {
            emitError(tokenizer, 13, context.lastStartLoc, 0, getTokenCaption(token));
          }
          node.items.push(parseNamed(tokenizer, token.value || ""));
          break;
        case 7:
          if (token.value == null) {
            emitError(tokenizer, 13, context.lastStartLoc, 0, getTokenCaption(token));
          }
          node.items.push(parseLiteral(tokenizer, token.value || ""));
          break;
        case 8:
          const parsed = parseLinked(tokenizer);
          node.items.push(parsed.node);
          nextToken = parsed.nextConsumeToken || null;
          break;
      }
    } while (context.currentType !== 14 && context.currentType !== 1);
    const endOffset = context.currentType === 1 ? context.lastOffset : tokenizer.currentOffset();
    const endLoc = context.currentType === 1 ? context.lastEndLoc : tokenizer.currentPosition();
    endNode(node, endOffset, endLoc);
    return node;
  }
  function parsePlural(tokenizer, offset, loc, msgNode) {
    const context = tokenizer.context();
    let hasEmptyMessage = msgNode.items.length === 0;
    const node = startNode(1, offset, loc);
    node.cases = [];
    node.cases.push(msgNode);
    do {
      const msg = parseMessage(tokenizer);
      if (!hasEmptyMessage) {
        hasEmptyMessage = msg.items.length === 0;
      }
      node.cases.push(msg);
    } while (context.currentType !== 14);
    if (hasEmptyMessage) {
      emitError(tokenizer, 10, loc, 0);
    }
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseResource(tokenizer) {
    const context = tokenizer.context();
    const { offset, startLoc } = context;
    const msgNode = parseMessage(tokenizer);
    if (context.currentType === 14) {
      return msgNode;
    } else {
      return parsePlural(tokenizer, offset, startLoc, msgNode);
    }
  }
  function parse2(source) {
    const tokenizer = createTokenizer(source, assign({}, options));
    const context = tokenizer.context();
    const node = startNode(0, context.offset, context.startLoc);
    if (location && node.loc) {
      node.loc.source = source;
    }
    node.body = parseResource(tokenizer);
    if (context.currentType !== 14) {
      emitError(tokenizer, 13, context.lastStartLoc, 0, source[context.offset] || "");
    }
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  return { parse: parse2 };
}
function getTokenCaption(token) {
  if (token.type === 14) {
    return "EOF";
  }
  const name = (token.value || "").replace(/\r?\n/gu, "\\n");
  return name.length > 10 ? name.slice(0, 9) + "\u2026" : name;
}
function createTransformer(ast, options = {}) {
  const _context = {
    ast,
    helpers: /* @__PURE__ */ new Set()
  };
  const context = () => _context;
  const helper = (name) => {
    _context.helpers.add(name);
    return name;
  };
  return { context, helper };
}
function traverseNodes(nodes, transformer) {
  for (let i = 0; i < nodes.length; i++) {
    traverseNode(nodes[i], transformer);
  }
}
function traverseNode(node, transformer) {
  switch (node.type) {
    case 1:
      traverseNodes(node.cases, transformer);
      transformer.helper("plural");
      break;
    case 2:
      traverseNodes(node.items, transformer);
      break;
    case 6:
      const linked = node;
      traverseNode(linked.key, transformer);
      transformer.helper("linked");
      break;
    case 5:
      transformer.helper("interpolate");
      transformer.helper("list");
      break;
    case 4:
      transformer.helper("interpolate");
      transformer.helper("named");
      break;
  }
}
function transform(ast, options = {}) {
  const transformer = createTransformer(ast);
  transformer.helper("normalize");
  ast.body && traverseNode(ast.body, transformer);
  const context = transformer.context();
  ast.helpers = Array.from(context.helpers);
}
function createCodeGenerator(ast, options) {
  const { sourceMap, filename, breakLineCode, needIndent: _needIndent } = options;
  const _context = {
    source: ast.loc.source,
    filename,
    code: "",
    column: 1,
    line: 1,
    offset: 0,
    map: void 0,
    breakLineCode,
    needIndent: _needIndent,
    indentLevel: 0
  };
  const context = () => _context;
  function push(code, node) {
    _context.code += code;
  }
  function _newline(n, withBreakLine = true) {
    const _breakLineCode = withBreakLine ? breakLineCode : "";
    push(_needIndent ? _breakLineCode + `  `.repeat(n) : _breakLineCode);
  }
  function indent(withNewLine = true) {
    const level = ++_context.indentLevel;
    withNewLine && _newline(level);
  }
  function deindent(withNewLine = true) {
    const level = --_context.indentLevel;
    withNewLine && _newline(level);
  }
  function newline() {
    _newline(_context.indentLevel);
  }
  const helper = (key) => `_${key}`;
  const needIndent = () => _context.needIndent;
  return {
    context,
    push,
    indent,
    deindent,
    newline,
    helper,
    needIndent
  };
}
function generateLinkedNode(generator, node) {
  const { helper } = generator;
  generator.push(`${helper("linked")}(`);
  generateNode(generator, node.key);
  if (node.modifier) {
    generator.push(`, `);
    generateNode(generator, node.modifier);
  }
  generator.push(`)`);
}
function generateMessageNode(generator, node) {
  const { helper, needIndent } = generator;
  generator.push(`${helper("normalize")}([`);
  generator.indent(needIndent());
  const length = node.items.length;
  for (let i = 0; i < length; i++) {
    generateNode(generator, node.items[i]);
    if (i === length - 1) {
      break;
    }
    generator.push(", ");
  }
  generator.deindent(needIndent());
  generator.push("])");
}
function generatePluralNode(generator, node) {
  const { helper, needIndent } = generator;
  if (node.cases.length > 1) {
    generator.push(`${helper("plural")}([`);
    generator.indent(needIndent());
    const length = node.cases.length;
    for (let i = 0; i < length; i++) {
      generateNode(generator, node.cases[i]);
      if (i === length - 1) {
        break;
      }
      generator.push(", ");
    }
    generator.deindent(needIndent());
    generator.push(`])`);
  }
}
function generateResource(generator, node) {
  if (node.body) {
    generateNode(generator, node.body);
  } else {
    generator.push("null");
  }
}
function generateNode(generator, node) {
  const { helper } = generator;
  switch (node.type) {
    case 0:
      generateResource(generator, node);
      break;
    case 1:
      generatePluralNode(generator, node);
      break;
    case 2:
      generateMessageNode(generator, node);
      break;
    case 6:
      generateLinkedNode(generator, node);
      break;
    case 8:
      generator.push(JSON.stringify(node.value), node);
      break;
    case 7:
      generator.push(JSON.stringify(node.value), node);
      break;
    case 5:
      generator.push(`${helper("interpolate")}(${helper("list")}(${node.index}))`, node);
      break;
    case 4:
      generator.push(`${helper("interpolate")}(${helper("named")}(${JSON.stringify(node.key)}))`, node);
      break;
    case 9:
      generator.push(JSON.stringify(node.value), node);
      break;
    case 3:
      generator.push(JSON.stringify(node.value), node);
      break;
  }
}
const generate = (ast, options = {}) => {
  const mode = isString(options.mode) ? options.mode : "normal";
  const filename = isString(options.filename) ? options.filename : "message.intl";
  const sourceMap = !!options.sourceMap;
  const breakLineCode = options.breakLineCode != null ? options.breakLineCode : mode === "arrow" ? ";" : "\n";
  const needIndent = options.needIndent ? options.needIndent : mode !== "arrow";
  const helpers = ast.helpers || [];
  const generator = createCodeGenerator(ast, {
    mode,
    filename,
    sourceMap,
    breakLineCode,
    needIndent
  });
  generator.push(mode === "normal" ? `function __msg__ (ctx) {` : `(ctx) => {`);
  generator.indent(needIndent);
  if (helpers.length > 0) {
    generator.push(`const { ${helpers.map((s) => `${s}: _${s}`).join(", ")} } = ctx`);
    generator.newline();
  }
  generator.push(`return `);
  generateNode(generator, ast);
  generator.deindent(needIndent);
  generator.push(`}`);
  const { code, map } = generator.context();
  return {
    ast,
    code,
    map: map ? map.toJSON() : void 0
  };
};
function baseCompile(source, options = {}) {
  const assignedOptions = assign({}, options);
  const parser = createParser(assignedOptions);
  const ast = parser.parse(source);
  transform(ast, assignedOptions);
  return generate(ast, assignedOptions);
}
/*!
  * @intlify/devtools-if v9.1.10
  * (c) 2022 kazuya kawaguchi
  * Released under the MIT License.
  */
const IntlifyDevToolsHooks = {
  I18nInit: "i18n:init",
  FunctionTranslate: "function:translate"
};
/*!
  * @intlify/core-base v9.1.10
  * (c) 2022 kazuya kawaguchi
  * Released under the MIT License.
  */
let devtools = null;
function setDevToolsHook(hook) {
  devtools = hook;
}
function initI18nDevTools(i18n2, version, meta) {
  devtools && devtools.emit(IntlifyDevToolsHooks.I18nInit, {
    timestamp: Date.now(),
    i18n: i18n2,
    version,
    meta
  });
}
const translateDevTools = /* @__PURE__ */ createDevToolsHook(IntlifyDevToolsHooks.FunctionTranslate);
function createDevToolsHook(hook) {
  return (payloads) => devtools && devtools.emit(hook, payloads);
}
const VERSION$1 = "9.1.10";
const NOT_REOSLVED = -1;
const MISSING_RESOLVE_VALUE = "";
function getDefaultLinkedModifiers() {
  return {
    upper: (val) => isString(val) ? val.toUpperCase() : val,
    lower: (val) => isString(val) ? val.toLowerCase() : val,
    capitalize: (val) => isString(val) ? `${val.charAt(0).toLocaleUpperCase()}${val.substr(1)}` : val
  };
}
let _compiler;
function registerMessageCompiler(compiler) {
  _compiler = compiler;
}
let _additionalMeta = null;
const setAdditionalMeta = (meta) => {
  _additionalMeta = meta;
};
const getAdditionalMeta = () => _additionalMeta;
let _cid = 0;
function createCoreContext(options = {}) {
  const version = isString(options.version) ? options.version : VERSION$1;
  const locale = isString(options.locale) ? options.locale : "en-US";
  const fallbackLocale = isArray(options.fallbackLocale) || isPlainObject(options.fallbackLocale) || isString(options.fallbackLocale) || options.fallbackLocale === false ? options.fallbackLocale : locale;
  const messages2 = isPlainObject(options.messages) ? options.messages : { [locale]: {} };
  const datetimeFormats = isPlainObject(options.datetimeFormats) ? options.datetimeFormats : { [locale]: {} };
  const numberFormats = isPlainObject(options.numberFormats) ? options.numberFormats : { [locale]: {} };
  const modifiers = assign({}, options.modifiers || {}, getDefaultLinkedModifiers());
  const pluralRules = options.pluralRules || {};
  const missing = isFunction(options.missing) ? options.missing : null;
  const missingWarn = isBoolean(options.missingWarn) || isRegExp(options.missingWarn) ? options.missingWarn : true;
  const fallbackWarn = isBoolean(options.fallbackWarn) || isRegExp(options.fallbackWarn) ? options.fallbackWarn : true;
  const fallbackFormat = !!options.fallbackFormat;
  const unresolving = !!options.unresolving;
  const postTranslation = isFunction(options.postTranslation) ? options.postTranslation : null;
  const processor = isPlainObject(options.processor) ? options.processor : null;
  const warnHtmlMessage = isBoolean(options.warnHtmlMessage) ? options.warnHtmlMessage : true;
  const escapeParameter = !!options.escapeParameter;
  const messageCompiler = isFunction(options.messageCompiler) ? options.messageCompiler : _compiler;
  const onWarn = isFunction(options.onWarn) ? options.onWarn : warn;
  const internalOptions = options;
  const __datetimeFormatters = isObject$1(internalOptions.__datetimeFormatters) ? internalOptions.__datetimeFormatters : /* @__PURE__ */ new Map();
  const __numberFormatters = isObject$1(internalOptions.__numberFormatters) ? internalOptions.__numberFormatters : /* @__PURE__ */ new Map();
  const __meta = isObject$1(internalOptions.__meta) ? internalOptions.__meta : {};
  _cid++;
  const context = {
    version,
    cid: _cid,
    locale,
    fallbackLocale,
    messages: messages2,
    datetimeFormats,
    numberFormats,
    modifiers,
    pluralRules,
    missing,
    missingWarn,
    fallbackWarn,
    fallbackFormat,
    unresolving,
    postTranslation,
    processor,
    warnHtmlMessage,
    escapeParameter,
    messageCompiler,
    onWarn,
    __datetimeFormatters,
    __numberFormatters,
    __meta
  };
  {
    initI18nDevTools(context, version, __meta);
  }
  return context;
}
function handleMissing(context, key, locale, missingWarn, type) {
  const { missing, onWarn } = context;
  if (missing !== null) {
    const ret = missing(context, locale, key, type);
    return isString(ret) ? ret : key;
  } else {
    return key;
  }
}
function getLocaleChain(ctx, fallback, start) {
  const context = ctx;
  if (!context.__localeChainCache) {
    context.__localeChainCache = /* @__PURE__ */ new Map();
  }
  let chain = context.__localeChainCache.get(start);
  if (!chain) {
    chain = [];
    let block = [start];
    while (isArray(block)) {
      block = appendBlockToChain(chain, block, fallback);
    }
    const defaults = isArray(fallback) ? fallback : isPlainObject(fallback) ? fallback["default"] ? fallback["default"] : null : fallback;
    block = isString(defaults) ? [defaults] : defaults;
    if (isArray(block)) {
      appendBlockToChain(chain, block, false);
    }
    context.__localeChainCache.set(start, chain);
  }
  return chain;
}
function appendBlockToChain(chain, block, blocks) {
  let follow = true;
  for (let i = 0; i < block.length && isBoolean(follow); i++) {
    const locale = block[i];
    if (isString(locale)) {
      follow = appendLocaleToChain(chain, block[i], blocks);
    }
  }
  return follow;
}
function appendLocaleToChain(chain, locale, blocks) {
  let follow;
  const tokens = locale.split("-");
  do {
    const target = tokens.join("-");
    follow = appendItemToChain(chain, target, blocks);
    tokens.splice(-1, 1);
  } while (tokens.length && follow === true);
  return follow;
}
function appendItemToChain(chain, target, blocks) {
  let follow = false;
  if (!chain.includes(target)) {
    follow = true;
    if (target) {
      follow = target[target.length - 1] !== "!";
      const locale = target.replace(/!/g, "");
      chain.push(locale);
      if ((isArray(blocks) || isPlainObject(blocks)) && blocks[locale]) {
        follow = blocks[locale];
      }
    }
  }
  return follow;
}
function updateFallbackLocale(ctx, locale, fallback) {
  const context = ctx;
  context.__localeChainCache = /* @__PURE__ */ new Map();
  getLocaleChain(ctx, fallback, locale);
}
const defaultOnCacheKey = (source) => source;
let compileCache = /* @__PURE__ */ Object.create(null);
function compileToFunction(source, options = {}) {
  {
    const onCacheKey = options.onCacheKey || defaultOnCacheKey;
    const key = onCacheKey(source);
    const cached = compileCache[key];
    if (cached) {
      return cached;
    }
    let occurred = false;
    const onError = options.onError || defaultOnError;
    options.onError = (err) => {
      occurred = true;
      onError(err);
    };
    const { code } = baseCompile(source, options);
    const msg = new Function(`return ${code}`)();
    return !occurred ? compileCache[key] = msg : msg;
  }
}
function createCoreError(code) {
  return createCompileError(code, null, void 0);
}
const NOOP_MESSAGE_FUNCTION = () => "";
const isMessageFunction = (val) => isFunction(val);
function translate(context, ...args) {
  const { fallbackFormat, postTranslation, unresolving, fallbackLocale, messages: messages2 } = context;
  const [key, options] = parseTranslateArgs(...args);
  const missingWarn = isBoolean(options.missingWarn) ? options.missingWarn : context.missingWarn;
  const fallbackWarn = isBoolean(options.fallbackWarn) ? options.fallbackWarn : context.fallbackWarn;
  const escapeParameter = isBoolean(options.escapeParameter) ? options.escapeParameter : context.escapeParameter;
  const resolvedMessage = !!options.resolvedMessage;
  const defaultMsgOrKey = isString(options.default) || isBoolean(options.default) ? !isBoolean(options.default) ? options.default : key : fallbackFormat ? key : "";
  const enableDefaultMsg = fallbackFormat || defaultMsgOrKey !== "";
  const locale = isString(options.locale) ? options.locale : context.locale;
  escapeParameter && escapeParams(options);
  let [format, targetLocale, message] = !resolvedMessage ? resolveMessageFormat(context, key, locale, fallbackLocale, fallbackWarn, missingWarn) : [
    key,
    locale,
    messages2[locale] || {}
  ];
  let cacheBaseKey = key;
  if (!resolvedMessage && !(isString(format) || isMessageFunction(format))) {
    if (enableDefaultMsg) {
      format = defaultMsgOrKey;
      cacheBaseKey = format;
    }
  }
  if (!resolvedMessage && (!(isString(format) || isMessageFunction(format)) || !isString(targetLocale))) {
    return unresolving ? NOT_REOSLVED : key;
  }
  let occurred = false;
  const errorDetector = () => {
    occurred = true;
  };
  const msg = !isMessageFunction(format) ? compileMessageFormat(context, key, targetLocale, format, cacheBaseKey, errorDetector) : format;
  if (occurred) {
    return format;
  }
  const ctxOptions = getMessageContextOptions(context, targetLocale, message, options);
  const msgContext = createMessageContext(ctxOptions);
  const messaged = evaluateMessage(context, msg, msgContext);
  const ret = postTranslation ? postTranslation(messaged) : messaged;
  {
    const payloads = {
      timestamp: Date.now(),
      key: isString(key) ? key : isMessageFunction(format) ? format.key : "",
      locale: targetLocale || (isMessageFunction(format) ? format.locale : ""),
      format: isString(format) ? format : isMessageFunction(format) ? format.source : "",
      message: ret
    };
    payloads.meta = assign({}, context.__meta, getAdditionalMeta() || {});
    translateDevTools(payloads);
  }
  return ret;
}
function escapeParams(options) {
  if (isArray(options.list)) {
    options.list = options.list.map((item) => isString(item) ? escapeHtml(item) : item);
  } else if (isObject$1(options.named)) {
    Object.keys(options.named).forEach((key) => {
      if (isString(options.named[key])) {
        options.named[key] = escapeHtml(options.named[key]);
      }
    });
  }
}
function resolveMessageFormat(context, key, locale, fallbackLocale, fallbackWarn, missingWarn) {
  const { messages: messages2, onWarn } = context;
  const locales = getLocaleChain(context, fallbackLocale, locale);
  let message = {};
  let targetLocale;
  let format = null;
  const type = "translate";
  for (let i = 0; i < locales.length; i++) {
    targetLocale = locales[i];
    message = messages2[targetLocale] || {};
    if ((format = resolveValue(message, key)) === null) {
      format = message[key];
    }
    if (isString(format) || isFunction(format))
      break;
    const missingRet = handleMissing(context, key, targetLocale, missingWarn, type);
    if (missingRet !== key) {
      format = missingRet;
    }
  }
  return [format, targetLocale, message];
}
function compileMessageFormat(context, key, targetLocale, format, cacheBaseKey, errorDetector) {
  const { messageCompiler, warnHtmlMessage } = context;
  if (isMessageFunction(format)) {
    const msg2 = format;
    msg2.locale = msg2.locale || targetLocale;
    msg2.key = msg2.key || key;
    return msg2;
  }
  const msg = messageCompiler(format, getCompileOptions(context, targetLocale, cacheBaseKey, format, warnHtmlMessage, errorDetector));
  msg.locale = targetLocale;
  msg.key = key;
  msg.source = format;
  return msg;
}
function evaluateMessage(context, msg, msgCtx) {
  const messaged = msg(msgCtx);
  return messaged;
}
function parseTranslateArgs(...args) {
  const [arg1, arg2, arg3] = args;
  const options = {};
  if (!isString(arg1) && !isNumber(arg1) && !isMessageFunction(arg1)) {
    throw createCoreError(14);
  }
  const key = isNumber(arg1) ? String(arg1) : isMessageFunction(arg1) ? arg1 : arg1;
  if (isNumber(arg2)) {
    options.plural = arg2;
  } else if (isString(arg2)) {
    options.default = arg2;
  } else if (isPlainObject(arg2) && !isEmptyObject(arg2)) {
    options.named = arg2;
  } else if (isArray(arg2)) {
    options.list = arg2;
  }
  if (isNumber(arg3)) {
    options.plural = arg3;
  } else if (isString(arg3)) {
    options.default = arg3;
  } else if (isPlainObject(arg3)) {
    assign(options, arg3);
  }
  return [key, options];
}
function getCompileOptions(context, locale, key, source, warnHtmlMessage, errorDetector) {
  return {
    warnHtmlMessage,
    onError: (err) => {
      errorDetector && errorDetector(err);
      {
        throw err;
      }
    },
    onCacheKey: (source2) => generateFormatCacheKey(locale, key, source2)
  };
}
function getMessageContextOptions(context, locale, message, options) {
  const { modifiers, pluralRules } = context;
  const resolveMessage = (key) => {
    const val = resolveValue(message, key);
    if (isString(val)) {
      let occurred = false;
      const errorDetector = () => {
        occurred = true;
      };
      const msg = compileMessageFormat(context, key, locale, val, key, errorDetector);
      return !occurred ? msg : NOOP_MESSAGE_FUNCTION;
    } else if (isMessageFunction(val)) {
      return val;
    } else {
      return NOOP_MESSAGE_FUNCTION;
    }
  };
  const ctxOptions = {
    locale,
    modifiers,
    pluralRules,
    messages: resolveMessage
  };
  if (context.processor) {
    ctxOptions.processor = context.processor;
  }
  if (options.list) {
    ctxOptions.list = options.list;
  }
  if (options.named) {
    ctxOptions.named = options.named;
  }
  if (isNumber(options.plural)) {
    ctxOptions.pluralIndex = options.plural;
  }
  return ctxOptions;
}
function datetime(context, ...args) {
  const { datetimeFormats, unresolving, fallbackLocale, onWarn } = context;
  const { __datetimeFormatters } = context;
  const [key, value, options, overrides] = parseDateTimeArgs(...args);
  const missingWarn = isBoolean(options.missingWarn) ? options.missingWarn : context.missingWarn;
  isBoolean(options.fallbackWarn) ? options.fallbackWarn : context.fallbackWarn;
  const part = !!options.part;
  const locale = isString(options.locale) ? options.locale : context.locale;
  const locales = getLocaleChain(context, fallbackLocale, locale);
  if (!isString(key) || key === "") {
    return new Intl.DateTimeFormat(locale).format(value);
  }
  let datetimeFormat = {};
  let targetLocale;
  let format = null;
  const type = "datetime format";
  for (let i = 0; i < locales.length; i++) {
    targetLocale = locales[i];
    datetimeFormat = datetimeFormats[targetLocale] || {};
    format = datetimeFormat[key];
    if (isPlainObject(format))
      break;
    handleMissing(context, key, targetLocale, missingWarn, type);
  }
  if (!isPlainObject(format) || !isString(targetLocale)) {
    return unresolving ? NOT_REOSLVED : key;
  }
  let id = `${targetLocale}__${key}`;
  if (!isEmptyObject(overrides)) {
    id = `${id}__${JSON.stringify(overrides)}`;
  }
  let formatter = __datetimeFormatters.get(id);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(targetLocale, assign({}, format, overrides));
    __datetimeFormatters.set(id, formatter);
  }
  return !part ? formatter.format(value) : formatter.formatToParts(value);
}
function parseDateTimeArgs(...args) {
  const [arg1, arg2, arg3, arg4] = args;
  let options = {};
  let overrides = {};
  let value;
  if (isString(arg1)) {
    if (!/\d{4}-\d{2}-\d{2}(T.*)?/.test(arg1)) {
      throw createCoreError(16);
    }
    value = new Date(arg1);
    try {
      value.toISOString();
    } catch (e) {
      throw createCoreError(16);
    }
  } else if (isDate(arg1)) {
    if (isNaN(arg1.getTime())) {
      throw createCoreError(15);
    }
    value = arg1;
  } else if (isNumber(arg1)) {
    value = arg1;
  } else {
    throw createCoreError(14);
  }
  if (isString(arg2)) {
    options.key = arg2;
  } else if (isPlainObject(arg2)) {
    options = arg2;
  }
  if (isString(arg3)) {
    options.locale = arg3;
  } else if (isPlainObject(arg3)) {
    overrides = arg3;
  }
  if (isPlainObject(arg4)) {
    overrides = arg4;
  }
  return [options.key || "", value, options, overrides];
}
function clearDateTimeFormat(ctx, locale, format) {
  const context = ctx;
  for (const key in format) {
    const id = `${locale}__${key}`;
    if (!context.__datetimeFormatters.has(id)) {
      continue;
    }
    context.__datetimeFormatters.delete(id);
  }
}
function number(context, ...args) {
  const { numberFormats, unresolving, fallbackLocale, onWarn } = context;
  const { __numberFormatters } = context;
  const [key, value, options, overrides] = parseNumberArgs(...args);
  const missingWarn = isBoolean(options.missingWarn) ? options.missingWarn : context.missingWarn;
  isBoolean(options.fallbackWarn) ? options.fallbackWarn : context.fallbackWarn;
  const part = !!options.part;
  const locale = isString(options.locale) ? options.locale : context.locale;
  const locales = getLocaleChain(context, fallbackLocale, locale);
  if (!isString(key) || key === "") {
    return new Intl.NumberFormat(locale).format(value);
  }
  let numberFormat = {};
  let targetLocale;
  let format = null;
  const type = "number format";
  for (let i = 0; i < locales.length; i++) {
    targetLocale = locales[i];
    numberFormat = numberFormats[targetLocale] || {};
    format = numberFormat[key];
    if (isPlainObject(format))
      break;
    handleMissing(context, key, targetLocale, missingWarn, type);
  }
  if (!isPlainObject(format) || !isString(targetLocale)) {
    return unresolving ? NOT_REOSLVED : key;
  }
  let id = `${targetLocale}__${key}`;
  if (!isEmptyObject(overrides)) {
    id = `${id}__${JSON.stringify(overrides)}`;
  }
  let formatter = __numberFormatters.get(id);
  if (!formatter) {
    formatter = new Intl.NumberFormat(targetLocale, assign({}, format, overrides));
    __numberFormatters.set(id, formatter);
  }
  return !part ? formatter.format(value) : formatter.formatToParts(value);
}
function parseNumberArgs(...args) {
  const [arg1, arg2, arg3, arg4] = args;
  let options = {};
  let overrides = {};
  if (!isNumber(arg1)) {
    throw createCoreError(14);
  }
  const value = arg1;
  if (isString(arg2)) {
    options.key = arg2;
  } else if (isPlainObject(arg2)) {
    options = arg2;
  }
  if (isString(arg3)) {
    options.locale = arg3;
  } else if (isPlainObject(arg3)) {
    overrides = arg3;
  }
  if (isPlainObject(arg4)) {
    overrides = arg4;
  }
  return [options.key || "", value, options, overrides];
}
function clearNumberFormat(ctx, locale, format) {
  const context = ctx;
  for (const key in format) {
    const id = `${locale}__${key}`;
    if (!context.__numberFormatters.has(id)) {
      continue;
    }
    context.__numberFormatters.delete(id);
  }
}
/*!
  * @intlify/vue-devtools v9.1.10
  * (c) 2022 kazuya kawaguchi
  * Released under the MIT License.
  */
const VueDevToolsLabels = {
  ["vue-devtools-plugin-vue-i18n"]: "Vue I18n devtools",
  ["vue-i18n-resource-inspector"]: "I18n Resources",
  ["vue-i18n-timeline"]: "Vue I18n"
};
const VueDevToolsPlaceholders = {
  ["vue-i18n-resource-inspector"]: "Search for scopes ..."
};
const VueDevToolsTimelineColors = {
  ["vue-i18n-timeline"]: 16764185
};
/*!
  * vue-i18n v9.1.10
  * (c) 2022 kazuya kawaguchi
  * Released under the MIT License.
  */
const VERSION = "9.1.10";
function createI18nError(code, ...args) {
  return createCompileError(code, null, void 0);
}
const DEVTOOLS_META = "__INTLIFY_META__";
const TransrateVNodeSymbol = makeSymbol("__transrateVNode");
const DatetimePartsSymbol = makeSymbol("__datetimeParts");
const NumberPartsSymbol = makeSymbol("__numberParts");
const EnableEmitter = makeSymbol("__enableEmitter");
const DisableEmitter = makeSymbol("__disableEmitter");
const SetPluralRulesSymbol = makeSymbol("__setPluralRules");
makeSymbol("__intlifyMeta");
const InejctWithOption = makeSymbol("__injectWithOption");
let composerID = 0;
function defineCoreMissingHandler(missing) {
  return (ctx, locale, key, type) => {
    return missing(locale, key, getCurrentInstance() || void 0, type);
  };
}
function getLocaleMessages(locale, options) {
  const { messages: messages2, __i18n } = options;
  const ret = isPlainObject(messages2) ? messages2 : isArray(__i18n) ? {} : { [locale]: {} };
  if (isArray(__i18n)) {
    __i18n.forEach(({ locale: locale2, resource }) => {
      if (locale2) {
        ret[locale2] = ret[locale2] || {};
        deepCopy(resource, ret[locale2]);
      } else {
        deepCopy(resource, ret);
      }
    });
  }
  if (options.flatJson) {
    for (const key in ret) {
      if (hasOwn$1(ret, key)) {
        handleFlatJson(ret[key]);
      }
    }
  }
  return ret;
}
const isNotObjectOrIsArray = (val) => !isObject$1(val) || isArray(val);
function deepCopy(src, des) {
  if (isNotObjectOrIsArray(src) || isNotObjectOrIsArray(des)) {
    throw createI18nError(20);
  }
  for (const key in src) {
    if (hasOwn$1(src, key)) {
      if (isNotObjectOrIsArray(src[key]) || isNotObjectOrIsArray(des[key])) {
        des[key] = src[key];
      } else {
        deepCopy(src[key], des[key]);
      }
    }
  }
}
const getMetaInfo = () => {
  const instance = getCurrentInstance();
  return instance && instance.type[DEVTOOLS_META] ? { [DEVTOOLS_META]: instance.type[DEVTOOLS_META] } : null;
};
function createComposer(options = {}) {
  const { __root } = options;
  const _isGlobal = __root === void 0;
  let _inheritLocale = isBoolean(options.inheritLocale) ? options.inheritLocale : true;
  const _locale = ref(__root && _inheritLocale ? __root.locale.value : isString(options.locale) ? options.locale : "en-US");
  const _fallbackLocale = ref(__root && _inheritLocale ? __root.fallbackLocale.value : isString(options.fallbackLocale) || isArray(options.fallbackLocale) || isPlainObject(options.fallbackLocale) || options.fallbackLocale === false ? options.fallbackLocale : _locale.value);
  const _messages = ref(getLocaleMessages(_locale.value, options));
  const _datetimeFormats = ref(isPlainObject(options.datetimeFormats) ? options.datetimeFormats : { [_locale.value]: {} });
  const _numberFormats = ref(isPlainObject(options.numberFormats) ? options.numberFormats : { [_locale.value]: {} });
  let _missingWarn = __root ? __root.missingWarn : isBoolean(options.missingWarn) || isRegExp(options.missingWarn) ? options.missingWarn : true;
  let _fallbackWarn = __root ? __root.fallbackWarn : isBoolean(options.fallbackWarn) || isRegExp(options.fallbackWarn) ? options.fallbackWarn : true;
  let _fallbackRoot = __root ? __root.fallbackRoot : isBoolean(options.fallbackRoot) ? options.fallbackRoot : true;
  let _fallbackFormat = !!options.fallbackFormat;
  let _missing = isFunction(options.missing) ? options.missing : null;
  let _runtimeMissing = isFunction(options.missing) ? defineCoreMissingHandler(options.missing) : null;
  let _postTranslation = isFunction(options.postTranslation) ? options.postTranslation : null;
  let _warnHtmlMessage = isBoolean(options.warnHtmlMessage) ? options.warnHtmlMessage : true;
  let _escapeParameter = !!options.escapeParameter;
  const _modifiers = __root ? __root.modifiers : isPlainObject(options.modifiers) ? options.modifiers : {};
  let _pluralRules = options.pluralRules || __root && __root.pluralRules;
  let _context;
  function getCoreContext() {
    return createCoreContext({
      version: VERSION,
      locale: _locale.value,
      fallbackLocale: _fallbackLocale.value,
      messages: _messages.value,
      datetimeFormats: _datetimeFormats.value,
      numberFormats: _numberFormats.value,
      modifiers: _modifiers,
      pluralRules: _pluralRules,
      missing: _runtimeMissing === null ? void 0 : _runtimeMissing,
      missingWarn: _missingWarn,
      fallbackWarn: _fallbackWarn,
      fallbackFormat: _fallbackFormat,
      unresolving: true,
      postTranslation: _postTranslation === null ? void 0 : _postTranslation,
      warnHtmlMessage: _warnHtmlMessage,
      escapeParameter: _escapeParameter,
      __datetimeFormatters: isPlainObject(_context) ? _context.__datetimeFormatters : void 0,
      __numberFormatters: isPlainObject(_context) ? _context.__numberFormatters : void 0,
      __v_emitter: isPlainObject(_context) ? _context.__v_emitter : void 0,
      __meta: { framework: "vue" }
    });
  }
  _context = getCoreContext();
  updateFallbackLocale(_context, _locale.value, _fallbackLocale.value);
  function trackReactivityValues() {
    return [
      _locale.value,
      _fallbackLocale.value,
      _messages.value,
      _datetimeFormats.value,
      _numberFormats.value
    ];
  }
  const locale = computed({
    get: () => _locale.value,
    set: (val) => {
      _locale.value = val;
      _context.locale = _locale.value;
    }
  });
  const fallbackLocale = computed({
    get: () => _fallbackLocale.value,
    set: (val) => {
      _fallbackLocale.value = val;
      _context.fallbackLocale = _fallbackLocale.value;
      updateFallbackLocale(_context, _locale.value, val);
    }
  });
  const messages2 = computed(() => _messages.value);
  const datetimeFormats = computed(() => _datetimeFormats.value);
  const numberFormats = computed(() => _numberFormats.value);
  function getPostTranslationHandler() {
    return isFunction(_postTranslation) ? _postTranslation : null;
  }
  function setPostTranslationHandler(handler) {
    _postTranslation = handler;
    _context.postTranslation = handler;
  }
  function getMissingHandler() {
    return _missing;
  }
  function setMissingHandler(handler) {
    if (handler !== null) {
      _runtimeMissing = defineCoreMissingHandler(handler);
    }
    _missing = handler;
    _context.missing = _runtimeMissing;
  }
  function wrapWithDeps(fn, argumentParser, warnType, fallbackSuccess, fallbackFail, successCondition) {
    trackReactivityValues();
    let ret;
    {
      try {
        setAdditionalMeta(getMetaInfo());
        ret = fn(_context);
      } finally {
        setAdditionalMeta(null);
      }
    }
    if (isNumber(ret) && ret === NOT_REOSLVED) {
      const [key, arg2] = argumentParser();
      return __root && _fallbackRoot ? fallbackSuccess(__root) : fallbackFail(key);
    } else if (successCondition(ret)) {
      return ret;
    } else {
      throw createI18nError(14);
    }
  }
  function t(...args) {
    return wrapWithDeps((context) => translate(context, ...args), () => parseTranslateArgs(...args), "translate", (root) => root.t(...args), (key) => key, (val) => isString(val));
  }
  function rt(...args) {
    const [arg1, arg2, arg3] = args;
    if (arg3 && !isObject$1(arg3)) {
      throw createI18nError(15);
    }
    return t(...[arg1, arg2, assign({ resolvedMessage: true }, arg3 || {})]);
  }
  function d(...args) {
    return wrapWithDeps((context) => datetime(context, ...args), () => parseDateTimeArgs(...args), "datetime format", (root) => root.d(...args), () => MISSING_RESOLVE_VALUE, (val) => isString(val));
  }
  function n(...args) {
    return wrapWithDeps((context) => number(context, ...args), () => parseNumberArgs(...args), "number format", (root) => root.n(...args), () => MISSING_RESOLVE_VALUE, (val) => isString(val));
  }
  function normalize(values) {
    return values.map((val) => isString(val) ? createVNode(Text, null, val, 0) : val);
  }
  const interpolate = (val) => val;
  const processor = {
    normalize,
    interpolate,
    type: "vnode"
  };
  function transrateVNode(...args) {
    return wrapWithDeps((context) => {
      let ret;
      const _context2 = context;
      try {
        _context2.processor = processor;
        ret = translate(_context2, ...args);
      } finally {
        _context2.processor = null;
      }
      return ret;
    }, () => parseTranslateArgs(...args), "translate", (root) => root[TransrateVNodeSymbol](...args), (key) => [createVNode(Text, null, key, 0)], (val) => isArray(val));
  }
  function numberParts(...args) {
    return wrapWithDeps((context) => number(context, ...args), () => parseNumberArgs(...args), "number format", (root) => root[NumberPartsSymbol](...args), () => [], (val) => isString(val) || isArray(val));
  }
  function datetimeParts(...args) {
    return wrapWithDeps((context) => datetime(context, ...args), () => parseDateTimeArgs(...args), "datetime format", (root) => root[DatetimePartsSymbol](...args), () => [], (val) => isString(val) || isArray(val));
  }
  function setPluralRules(rules) {
    _pluralRules = rules;
    _context.pluralRules = _pluralRules;
  }
  function te(key, locale2) {
    const targetLocale = isString(locale2) ? locale2 : _locale.value;
    const message = getLocaleMessage(targetLocale);
    return resolveValue(message, key) !== null;
  }
  function resolveMessages(key) {
    let messages3 = null;
    const locales = getLocaleChain(_context, _fallbackLocale.value, _locale.value);
    for (let i = 0; i < locales.length; i++) {
      const targetLocaleMessages = _messages.value[locales[i]] || {};
      const messageValue = resolveValue(targetLocaleMessages, key);
      if (messageValue != null) {
        messages3 = messageValue;
        break;
      }
    }
    return messages3;
  }
  function tm(key) {
    const messages3 = resolveMessages(key);
    return messages3 != null ? messages3 : __root ? __root.tm(key) || {} : {};
  }
  function getLocaleMessage(locale2) {
    return _messages.value[locale2] || {};
  }
  function setLocaleMessage(locale2, message) {
    _messages.value[locale2] = message;
    _context.messages = _messages.value;
  }
  function mergeLocaleMessage(locale2, message) {
    _messages.value[locale2] = _messages.value[locale2] || {};
    deepCopy(message, _messages.value[locale2]);
    _context.messages = _messages.value;
  }
  function getDateTimeFormat(locale2) {
    return _datetimeFormats.value[locale2] || {};
  }
  function setDateTimeFormat(locale2, format) {
    _datetimeFormats.value[locale2] = format;
    _context.datetimeFormats = _datetimeFormats.value;
    clearDateTimeFormat(_context, locale2, format);
  }
  function mergeDateTimeFormat(locale2, format) {
    _datetimeFormats.value[locale2] = assign(_datetimeFormats.value[locale2] || {}, format);
    _context.datetimeFormats = _datetimeFormats.value;
    clearDateTimeFormat(_context, locale2, format);
  }
  function getNumberFormat(locale2) {
    return _numberFormats.value[locale2] || {};
  }
  function setNumberFormat(locale2, format) {
    _numberFormats.value[locale2] = format;
    _context.numberFormats = _numberFormats.value;
    clearNumberFormat(_context, locale2, format);
  }
  function mergeNumberFormat(locale2, format) {
    _numberFormats.value[locale2] = assign(_numberFormats.value[locale2] || {}, format);
    _context.numberFormats = _numberFormats.value;
    clearNumberFormat(_context, locale2, format);
  }
  composerID++;
  if (__root) {
    watch(__root.locale, (val) => {
      if (_inheritLocale) {
        _locale.value = val;
        _context.locale = val;
        updateFallbackLocale(_context, _locale.value, _fallbackLocale.value);
      }
    });
    watch(__root.fallbackLocale, (val) => {
      if (_inheritLocale) {
        _fallbackLocale.value = val;
        _context.fallbackLocale = val;
        updateFallbackLocale(_context, _locale.value, _fallbackLocale.value);
      }
    });
  }
  const composer = {
    id: composerID,
    locale,
    fallbackLocale,
    get inheritLocale() {
      return _inheritLocale;
    },
    set inheritLocale(val) {
      _inheritLocale = val;
      if (val && __root) {
        _locale.value = __root.locale.value;
        _fallbackLocale.value = __root.fallbackLocale.value;
        updateFallbackLocale(_context, _locale.value, _fallbackLocale.value);
      }
    },
    get availableLocales() {
      return Object.keys(_messages.value).sort();
    },
    messages: messages2,
    datetimeFormats,
    numberFormats,
    get modifiers() {
      return _modifiers;
    },
    get pluralRules() {
      return _pluralRules || {};
    },
    get isGlobal() {
      return _isGlobal;
    },
    get missingWarn() {
      return _missingWarn;
    },
    set missingWarn(val) {
      _missingWarn = val;
      _context.missingWarn = _missingWarn;
    },
    get fallbackWarn() {
      return _fallbackWarn;
    },
    set fallbackWarn(val) {
      _fallbackWarn = val;
      _context.fallbackWarn = _fallbackWarn;
    },
    get fallbackRoot() {
      return _fallbackRoot;
    },
    set fallbackRoot(val) {
      _fallbackRoot = val;
    },
    get fallbackFormat() {
      return _fallbackFormat;
    },
    set fallbackFormat(val) {
      _fallbackFormat = val;
      _context.fallbackFormat = _fallbackFormat;
    },
    get warnHtmlMessage() {
      return _warnHtmlMessage;
    },
    set warnHtmlMessage(val) {
      _warnHtmlMessage = val;
      _context.warnHtmlMessage = val;
    },
    get escapeParameter() {
      return _escapeParameter;
    },
    set escapeParameter(val) {
      _escapeParameter = val;
      _context.escapeParameter = val;
    },
    t,
    rt,
    d,
    n,
    te,
    tm,
    getLocaleMessage,
    setLocaleMessage,
    mergeLocaleMessage,
    getDateTimeFormat,
    setDateTimeFormat,
    mergeDateTimeFormat,
    getNumberFormat,
    setNumberFormat,
    mergeNumberFormat,
    getPostTranslationHandler,
    setPostTranslationHandler,
    getMissingHandler,
    setMissingHandler,
    [TransrateVNodeSymbol]: transrateVNode,
    [NumberPartsSymbol]: numberParts,
    [DatetimePartsSymbol]: datetimeParts,
    [SetPluralRulesSymbol]: setPluralRules,
    [InejctWithOption]: options.__injectWithOption
  };
  return composer;
}
const baseFormatProps = {
  tag: {
    type: [String, Object]
  },
  locale: {
    type: String
  },
  scope: {
    type: String,
    validator: (val) => val === "parent" || val === "global",
    default: "parent"
  },
  i18n: {
    type: Object
  }
};
const Translation = {
  name: "i18n-t",
  props: assign({
    keypath: {
      type: String,
      required: true
    },
    plural: {
      type: [Number, String],
      validator: (val) => isNumber(val) || !isNaN(val)
    }
  }, baseFormatProps),
  setup(props, context) {
    const { slots, attrs } = context;
    const i18n2 = props.i18n || useI18n({
      useScope: props.scope,
      __useComponent: true
    });
    const keys = Object.keys(slots).filter((key) => key !== "_");
    return () => {
      const options = {};
      if (props.locale) {
        options.locale = props.locale;
      }
      if (props.plural !== void 0) {
        options.plural = isString(props.plural) ? +props.plural : props.plural;
      }
      const arg = getInterpolateArg(context, keys);
      const children = i18n2[TransrateVNodeSymbol](props.keypath, arg, options);
      const assignedAttrs = assign({}, attrs);
      return isString(props.tag) ? h(props.tag, assignedAttrs, children) : isObject$1(props.tag) ? h(props.tag, assignedAttrs, children) : h(Fragment, assignedAttrs, children);
    };
  }
};
function getInterpolateArg({ slots }, keys) {
  if (keys.length === 1 && keys[0] === "default") {
    return slots.default ? slots.default() : [];
  } else {
    return keys.reduce((arg, key) => {
      const slot = slots[key];
      if (slot) {
        arg[key] = slot();
      }
      return arg;
    }, {});
  }
}
function renderFormatter(props, context, slotKeys, partFormatter) {
  const { slots, attrs } = context;
  return () => {
    const options = { part: true };
    let overrides = {};
    if (props.locale) {
      options.locale = props.locale;
    }
    if (isString(props.format)) {
      options.key = props.format;
    } else if (isObject$1(props.format)) {
      if (isString(props.format.key)) {
        options.key = props.format.key;
      }
      overrides = Object.keys(props.format).reduce((options2, prop) => {
        return slotKeys.includes(prop) ? assign({}, options2, { [prop]: props.format[prop] }) : options2;
      }, {});
    }
    const parts = partFormatter(...[props.value, options, overrides]);
    let children = [options.key];
    if (isArray(parts)) {
      children = parts.map((part, index) => {
        const slot = slots[part.type];
        return slot ? slot({ [part.type]: part.value, index, parts }) : [part.value];
      });
    } else if (isString(parts)) {
      children = [parts];
    }
    const assignedAttrs = assign({}, attrs);
    return isString(props.tag) ? h(props.tag, assignedAttrs, children) : isObject$1(props.tag) ? h(props.tag, assignedAttrs, children) : h(Fragment, assignedAttrs, children);
  };
}
const NUMBER_FORMAT_KEYS = [
  "localeMatcher",
  "style",
  "unit",
  "unitDisplay",
  "currency",
  "currencyDisplay",
  "useGrouping",
  "numberingSystem",
  "minimumIntegerDigits",
  "minimumFractionDigits",
  "maximumFractionDigits",
  "minimumSignificantDigits",
  "maximumSignificantDigits",
  "notation",
  "formatMatcher"
];
const NumberFormat = {
  name: "i18n-n",
  props: assign({
    value: {
      type: Number,
      required: true
    },
    format: {
      type: [String, Object]
    }
  }, baseFormatProps),
  setup(props, context) {
    const i18n2 = props.i18n || useI18n({ useScope: "parent", __useComponent: true });
    return renderFormatter(props, context, NUMBER_FORMAT_KEYS, (...args) => i18n2[NumberPartsSymbol](...args));
  }
};
const DATETIME_FORMAT_KEYS = [
  "dateStyle",
  "timeStyle",
  "fractionalSecondDigits",
  "calendar",
  "dayPeriod",
  "numberingSystem",
  "localeMatcher",
  "timeZone",
  "hour12",
  "hourCycle",
  "formatMatcher",
  "weekday",
  "era",
  "year",
  "month",
  "day",
  "hour",
  "minute",
  "second",
  "timeZoneName"
];
const DatetimeFormat = {
  name: "i18n-d",
  props: assign({
    value: {
      type: [Number, Date],
      required: true
    },
    format: {
      type: [String, Object]
    }
  }, baseFormatProps),
  setup(props, context) {
    const i18n2 = props.i18n || useI18n({ useScope: "parent", __useComponent: true });
    return renderFormatter(props, context, DATETIME_FORMAT_KEYS, (...args) => i18n2[DatetimePartsSymbol](...args));
  }
};
function getComposer$2(i18n2, instance) {
  const i18nInternal = i18n2;
  if (i18n2.mode === "composition") {
    return i18nInternal.__getInstance(instance) || i18n2.global;
  } else {
    const vueI18n = i18nInternal.__getInstance(instance);
    return vueI18n != null ? vueI18n.__composer : i18n2.global.__composer;
  }
}
function vTDirective(i18n2) {
  const bind = (el, { instance, value, modifiers }) => {
    if (!instance || !instance.$) {
      throw createI18nError(22);
    }
    const composer = getComposer$2(i18n2, instance.$);
    const parsedValue = parseValue(value);
    el.textContent = composer.t(...makeParams(parsedValue));
  };
  return {
    beforeMount: bind,
    beforeUpdate: bind
  };
}
function parseValue(value) {
  if (isString(value)) {
    return { path: value };
  } else if (isPlainObject(value)) {
    if (!("path" in value)) {
      throw createI18nError(19, "path");
    }
    return value;
  } else {
    throw createI18nError(20);
  }
}
function makeParams(value) {
  const { path, locale, args, choice, plural } = value;
  const options = {};
  const named = args || {};
  if (isString(locale)) {
    options.locale = locale;
  }
  if (isNumber(choice)) {
    options.plural = choice;
  }
  if (isNumber(plural)) {
    options.plural = plural;
  }
  return [path, named, options];
}
function apply(app, i18n2, ...options) {
  const pluginOptions = isPlainObject(options[0]) ? options[0] : {};
  const useI18nComponentName = !!pluginOptions.useI18nComponentName;
  const globalInstall = isBoolean(pluginOptions.globalInstall) ? pluginOptions.globalInstall : true;
  if (globalInstall) {
    app.component(!useI18nComponentName ? Translation.name : "i18n", Translation);
    app.component(NumberFormat.name, NumberFormat);
    app.component(DatetimeFormat.name, DatetimeFormat);
  }
  app.directive("t", vTDirective(i18n2));
}
const VUE_I18N_COMPONENT_TYPES = "vue-i18n: composer properties";
let devtoolsApi;
async function enableDevTools(app, i18n2) {
  return new Promise((resolve, reject) => {
    try {
      setupDevtoolsPlugin({
        id: "vue-devtools-plugin-vue-i18n",
        label: VueDevToolsLabels["vue-devtools-plugin-vue-i18n"],
        packageName: "vue-i18n",
        homepage: "https://vue-i18n.intlify.dev",
        logo: "https://vue-i18n.intlify.dev/vue-i18n-devtools-logo.png",
        componentStateTypes: [VUE_I18N_COMPONENT_TYPES],
        app
      }, (api) => {
        devtoolsApi = api;
        api.on.visitComponentTree(({ componentInstance, treeNode }) => {
          updateComponentTreeTags(componentInstance, treeNode, i18n2);
        });
        api.on.inspectComponent(({ componentInstance, instanceData }) => {
          if (componentInstance.vnode.el.__VUE_I18N__ && instanceData) {
            if (i18n2.mode === "legacy") {
              if (componentInstance.vnode.el.__VUE_I18N__ !== i18n2.global.__composer) {
                inspectComposer(instanceData, componentInstance.vnode.el.__VUE_I18N__);
              }
            } else {
              inspectComposer(instanceData, componentInstance.vnode.el.__VUE_I18N__);
            }
          }
        });
        api.addInspector({
          id: "vue-i18n-resource-inspector",
          label: VueDevToolsLabels["vue-i18n-resource-inspector"],
          icon: "language",
          treeFilterPlaceholder: VueDevToolsPlaceholders["vue-i18n-resource-inspector"]
        });
        api.on.getInspectorTree((payload) => {
          if (payload.app === app && payload.inspectorId === "vue-i18n-resource-inspector") {
            registerScope(payload, i18n2);
          }
        });
        api.on.getInspectorState((payload) => {
          if (payload.app === app && payload.inspectorId === "vue-i18n-resource-inspector") {
            inspectScope(payload, i18n2);
          }
        });
        api.on.editInspectorState((payload) => {
          if (payload.app === app && payload.inspectorId === "vue-i18n-resource-inspector") {
            editScope(payload, i18n2);
          }
        });
        api.addTimelineLayer({
          id: "vue-i18n-timeline",
          label: VueDevToolsLabels["vue-i18n-timeline"],
          color: VueDevToolsTimelineColors["vue-i18n-timeline"]
        });
        resolve(true);
      });
    } catch (e) {
      console.error(e);
      reject(false);
    }
  });
}
function updateComponentTreeTags(instance, treeNode, i18n2) {
  const global2 = i18n2.mode === "composition" ? i18n2.global : i18n2.global.__composer;
  if (instance && instance.vnode.el.__VUE_I18N__) {
    if (instance.vnode.el.__VUE_I18N__ !== global2) {
      const label = instance.type.name || instance.type.displayName || instance.type.__file;
      const tag = {
        label: `i18n (${label} Scope)`,
        textColor: 0,
        backgroundColor: 16764185
      };
      treeNode.tags.push(tag);
    }
  }
}
function inspectComposer(instanceData, composer) {
  const type = VUE_I18N_COMPONENT_TYPES;
  instanceData.state.push({
    type,
    key: "locale",
    editable: true,
    value: composer.locale.value
  });
  instanceData.state.push({
    type,
    key: "availableLocales",
    editable: false,
    value: composer.availableLocales
  });
  instanceData.state.push({
    type,
    key: "fallbackLocale",
    editable: true,
    value: composer.fallbackLocale.value
  });
  instanceData.state.push({
    type,
    key: "inheritLocale",
    editable: true,
    value: composer.inheritLocale
  });
  instanceData.state.push({
    type,
    key: "messages",
    editable: false,
    value: getLocaleMessageValue(composer.messages.value)
  });
  instanceData.state.push({
    type,
    key: "datetimeFormats",
    editable: false,
    value: composer.datetimeFormats.value
  });
  instanceData.state.push({
    type,
    key: "numberFormats",
    editable: false,
    value: composer.numberFormats.value
  });
}
function getLocaleMessageValue(messages2) {
  const value = {};
  Object.keys(messages2).forEach((key) => {
    const v = messages2[key];
    if (isFunction(v) && "source" in v) {
      value[key] = getMessageFunctionDetails(v);
    } else if (isObject$1(v)) {
      value[key] = getLocaleMessageValue(v);
    } else {
      value[key] = v;
    }
  });
  return value;
}
const ESC = {
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "&": "&amp;"
};
function escape(s) {
  return s.replace(/[<>"&]/g, escapeChar);
}
function escapeChar(a) {
  return ESC[a] || a;
}
function getMessageFunctionDetails(func) {
  const argString = func.source ? `("${escape(func.source)}")` : `(?)`;
  return {
    _custom: {
      type: "function",
      display: `<span>\u0192</span> ${argString}`
    }
  };
}
function registerScope(payload, i18n2) {
  payload.rootNodes.push({
    id: "global",
    label: "Global Scope"
  });
  const global2 = i18n2.mode === "composition" ? i18n2.global : i18n2.global.__composer;
  for (const [keyInstance, instance] of i18n2.__instances) {
    const composer = i18n2.mode === "composition" ? instance : instance.__composer;
    if (global2 === composer) {
      continue;
    }
    const label = keyInstance.type.name || keyInstance.type.displayName || keyInstance.type.__file;
    payload.rootNodes.push({
      id: composer.id.toString(),
      label: `${label} Scope`
    });
  }
}
function getComposer$1(nodeId, i18n2) {
  if (nodeId === "global") {
    return i18n2.mode === "composition" ? i18n2.global : i18n2.global.__composer;
  } else {
    const instance = Array.from(i18n2.__instances.values()).find((item) => item.id.toString() === nodeId);
    if (instance) {
      return i18n2.mode === "composition" ? instance : instance.__composer;
    } else {
      return null;
    }
  }
}
function inspectScope(payload, i18n2) {
  const composer = getComposer$1(payload.nodeId, i18n2);
  if (composer) {
    payload.state = makeScopeInspectState(composer);
  }
}
function makeScopeInspectState(composer) {
  const state = {};
  const localeType = "Locale related info";
  const localeStates = [
    {
      type: localeType,
      key: "locale",
      editable: true,
      value: composer.locale.value
    },
    {
      type: localeType,
      key: "fallbackLocale",
      editable: true,
      value: composer.fallbackLocale.value
    },
    {
      type: localeType,
      key: "availableLocales",
      editable: false,
      value: composer.availableLocales
    },
    {
      type: localeType,
      key: "inheritLocale",
      editable: true,
      value: composer.inheritLocale
    }
  ];
  state[localeType] = localeStates;
  const localeMessagesType = "Locale messages info";
  const localeMessagesStates = [
    {
      type: localeMessagesType,
      key: "messages",
      editable: false,
      value: getLocaleMessageValue(composer.messages.value)
    }
  ];
  state[localeMessagesType] = localeMessagesStates;
  const datetimeFormatsType = "Datetime formats info";
  const datetimeFormatsStates = [
    {
      type: datetimeFormatsType,
      key: "datetimeFormats",
      editable: false,
      value: composer.datetimeFormats.value
    }
  ];
  state[datetimeFormatsType] = datetimeFormatsStates;
  const numberFormatsType = "Datetime formats info";
  const numberFormatsStates = [
    {
      type: numberFormatsType,
      key: "numberFormats",
      editable: false,
      value: composer.numberFormats.value
    }
  ];
  state[numberFormatsType] = numberFormatsStates;
  return state;
}
function addTimelineEvent(event, payload) {
  if (devtoolsApi) {
    let groupId;
    if (payload && "groupId" in payload) {
      groupId = payload.groupId;
      delete payload.groupId;
    }
    devtoolsApi.addTimelineEvent({
      layerId: "vue-i18n-timeline",
      event: {
        title: event,
        groupId,
        time: Date.now(),
        meta: {},
        data: payload || {},
        logType: event === "compile-error" ? "error" : event === "fallback" || event === "missing" ? "warning" : "default"
      }
    });
  }
}
function editScope(payload, i18n2) {
  const composer = getComposer$1(payload.nodeId, i18n2);
  if (composer) {
    const [field] = payload.path;
    if (field === "locale" && isString(payload.state.value)) {
      composer.locale.value = payload.state.value;
    } else if (field === "fallbackLocale" && (isString(payload.state.value) || isArray(payload.state.value) || isObject$1(payload.state.value))) {
      composer.fallbackLocale.value = payload.state.value;
    } else if (field === "inheritLocale" && isBoolean(payload.state.value)) {
      composer.inheritLocale = payload.state.value;
    }
  }
}
function createI18n(options = {}) {
  const __globalInjection = !!options.globalInjection;
  const __instances = /* @__PURE__ */ new Map();
  const __global = createComposer(options);
  const symbol = makeSymbol("");
  const i18n2 = {
    get mode() {
      return "composition";
    },
    async install(app, ...options2) {
      {
        app.__VUE_I18N__ = i18n2;
      }
      app.__VUE_I18N_SYMBOL__ = symbol;
      app.provide(app.__VUE_I18N_SYMBOL__, i18n2);
      if (__globalInjection) {
        injectGlobalFields(app, i18n2.global);
      }
      {
        apply(app, i18n2, ...options2);
      }
      {
        const ret = await enableDevTools(app, i18n2);
        if (!ret) {
          throw createI18nError(21);
        }
        const emitter = createEmitter();
        {
          const _composer = __global;
          _composer[EnableEmitter] && _composer[EnableEmitter](emitter);
        }
        emitter.on("*", addTimelineEvent);
      }
    },
    get global() {
      return __global;
    },
    __instances,
    __getInstance(component) {
      return __instances.get(component) || null;
    },
    __setInstance(component, instance) {
      __instances.set(component, instance);
    },
    __deleteInstance(component) {
      __instances.delete(component);
    }
  };
  return i18n2;
}
function useI18n(options = {}) {
  const instance = getCurrentInstance();
  if (instance == null) {
    throw createI18nError(16);
  }
  if (!instance.appContext.app.__VUE_I18N_SYMBOL__) {
    throw createI18nError(17);
  }
  const i18n2 = inject(instance.appContext.app.__VUE_I18N_SYMBOL__);
  if (!i18n2) {
    throw createI18nError(22);
  }
  const global2 = i18n2.mode === "composition" ? i18n2.global : i18n2.global.__composer;
  const scope = isEmptyObject(options) ? "__i18n" in instance.type ? "local" : "global" : !options.useScope ? "local" : options.useScope;
  if (scope === "global") {
    let messages2 = isObject$1(options.messages) ? options.messages : {};
    if ("__i18nGlobal" in instance.type) {
      messages2 = getLocaleMessages(global2.locale.value, {
        messages: messages2,
        __i18n: instance.type.__i18nGlobal
      });
    }
    const locales = Object.keys(messages2);
    if (locales.length) {
      locales.forEach((locale) => {
        global2.mergeLocaleMessage(locale, messages2[locale]);
      });
    }
    if (isObject$1(options.datetimeFormats)) {
      const locales2 = Object.keys(options.datetimeFormats);
      if (locales2.length) {
        locales2.forEach((locale) => {
          global2.mergeDateTimeFormat(locale, options.datetimeFormats[locale]);
        });
      }
    }
    if (isObject$1(options.numberFormats)) {
      const locales2 = Object.keys(options.numberFormats);
      if (locales2.length) {
        locales2.forEach((locale) => {
          global2.mergeNumberFormat(locale, options.numberFormats[locale]);
        });
      }
    }
    return global2;
  }
  if (scope === "parent") {
    let composer2 = getComposer(i18n2, instance, options.__useComponent);
    if (composer2 == null) {
      composer2 = global2;
    }
    return composer2;
  }
  if (i18n2.mode === "legacy") {
    throw createI18nError(18);
  }
  const i18nInternal = i18n2;
  let composer = i18nInternal.__getInstance(instance);
  if (composer == null) {
    const type = instance.type;
    const composerOptions = assign({}, options);
    if (type.__i18n) {
      composerOptions.__i18n = type.__i18n;
    }
    if (global2) {
      composerOptions.__root = global2;
    }
    composer = createComposer(composerOptions);
    setupLifeCycle(i18nInternal, instance, composer);
    i18nInternal.__setInstance(instance, composer);
  }
  return composer;
}
function getComposer(i18n2, target, useComponent = false) {
  let composer = null;
  const root = target.root;
  let current = target.parent;
  while (current != null) {
    const i18nInternal = i18n2;
    if (i18n2.mode === "composition") {
      composer = i18nInternal.__getInstance(current);
    } else {
      const vueI18n = i18nInternal.__getInstance(current);
      if (vueI18n != null) {
        composer = vueI18n.__composer;
      }
      if (useComponent && composer && !composer[InejctWithOption]) {
        composer = null;
      }
    }
    if (composer != null) {
      break;
    }
    if (root === current) {
      break;
    }
    current = current.parent;
  }
  return composer;
}
function setupLifeCycle(i18n2, target, composer) {
  let emitter = null;
  onMounted(() => {
    if (target.vnode.el) {
      target.vnode.el.__VUE_I18N__ = composer;
      emitter = createEmitter();
      const _composer = composer;
      _composer[EnableEmitter] && _composer[EnableEmitter](emitter);
      emitter.on("*", addTimelineEvent);
    }
  }, target);
  onUnmounted(() => {
    if (target.vnode.el && target.vnode.el.__VUE_I18N__) {
      emitter && emitter.off("*", addTimelineEvent);
      const _composer = composer;
      _composer[DisableEmitter] && _composer[DisableEmitter]();
      delete target.vnode.el.__VUE_I18N__;
    }
    i18n2.__deleteInstance(target);
  }, target);
}
const globalExportProps = [
  "locale",
  "fallbackLocale",
  "availableLocales"
];
const globalExportMethods = ["t", "rt", "d", "n", "tm"];
function injectGlobalFields(app, composer) {
  const i18n2 = /* @__PURE__ */ Object.create(null);
  globalExportProps.forEach((prop) => {
    const desc = Object.getOwnPropertyDescriptor(composer, prop);
    if (!desc) {
      throw createI18nError(22);
    }
    const wrap = isRef(desc.value) ? {
      get() {
        return desc.value.value;
      },
      set(val) {
        desc.value.value = val;
      }
    } : {
      get() {
        return desc.get && desc.get();
      }
    };
    Object.defineProperty(i18n2, prop, wrap);
  });
  app.config.globalProperties.$i18n = i18n2;
  globalExportMethods.forEach((method) => {
    const desc = Object.getOwnPropertyDescriptor(composer, method);
    if (!desc || !desc.value) {
      throw createI18nError(22);
    }
    Object.defineProperty(app.config.globalProperties, `$${method}`, desc);
  });
}
registerMessageCompiler(compileToFunction);
{
  const target = getGlobalThis();
  target.__INTLIFY__ = true;
  setDevToolsHook(target.__INTLIFY_DEVTOOLS_GLOBAL_HOOK__);
}
var enUS = {
  failed: "Action failed",
  success: "Action was successful"
};
var messages = {
  "en-US": enUS
};
var i18n = boot(({ app }) => {
  const i18n2 = createI18n({
    locale: "en-US",
    messages
  });
  app.use(i18n2);
});
export { i18n as default };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaTE4bi41MjBlNTE0My5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BpbnRsaWZ5L3NoYXJlZC9kaXN0L3NoYXJlZC5lc20tYnVuZGxlci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9AaW50bGlmeS9tZXNzYWdlLXJlc29sdmVyL2Rpc3QvbWVzc2FnZS1yZXNvbHZlci5lc20tYnVuZGxlci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9AaW50bGlmeS9ydW50aW1lL2Rpc3QvcnVudGltZS5lc20tYnVuZGxlci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9AaW50bGlmeS9tZXNzYWdlLWNvbXBpbGVyL2Rpc3QvbWVzc2FnZS1jb21waWxlci5lc20tYnVuZGxlci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9AaW50bGlmeS9kZXZ0b29scy1pZi9kaXN0L2RldnRvb2xzLWlmLmVzbS1idW5kbGVyLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BpbnRsaWZ5L2NvcmUtYmFzZS9kaXN0L2NvcmUtYmFzZS5lc20tYnVuZGxlci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9AaW50bGlmeS92dWUtZGV2dG9vbHMvZGlzdC92dWUtZGV2dG9vbHMuZXNtLWJ1bmRsZXIuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvdnVlLWkxOG4vZGlzdC92dWUtaTE4bi5lc20tYnVuZGxlci5qcyIsIi4uLy4uLy4uL3NyYy9pMThuL2VuLVVTL2luZGV4LnRzIiwiLi4vLi4vLi4vc3JjL2kxOG4vaW5kZXgudHMiLCIuLi8uLi8uLi9zcmMvYm9vdC9pMThuLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICAqIEBpbnRsaWZ5L3NoYXJlZCB2OS4xLjEwXG4gICogKGMpIDIwMjIga2F6dXlhIGthd2FndWNoaVxuICAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAgKi9cbi8qKlxyXG4gKiBPcmlnaW5hbCBVdGlsaXRpZXNcclxuICogd3JpdHRlbiBieSBrYXp1eWEga2F3YWd1Y2hpXHJcbiAqL1xyXG5jb25zdCBpbkJyb3dzZXIgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJztcclxubGV0IG1hcms7XHJcbmxldCBtZWFzdXJlO1xyXG5pZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpKSB7XHJcbiAgICBjb25zdCBwZXJmID0gaW5Ccm93c2VyICYmIHdpbmRvdy5wZXJmb3JtYW5jZTtcclxuICAgIGlmIChwZXJmICYmXHJcbiAgICAgICAgcGVyZi5tYXJrICYmXHJcbiAgICAgICAgcGVyZi5tZWFzdXJlICYmXHJcbiAgICAgICAgcGVyZi5jbGVhck1hcmtzICYmXHJcbiAgICAgICAgcGVyZi5jbGVhck1lYXN1cmVzKSB7XHJcbiAgICAgICAgbWFyayA9ICh0YWcpID0+IHBlcmYubWFyayh0YWcpO1xyXG4gICAgICAgIG1lYXN1cmUgPSAobmFtZSwgc3RhcnRUYWcsIGVuZFRhZykgPT4ge1xyXG4gICAgICAgICAgICBwZXJmLm1lYXN1cmUobmFtZSwgc3RhcnRUYWcsIGVuZFRhZyk7XHJcbiAgICAgICAgICAgIHBlcmYuY2xlYXJNYXJrcyhzdGFydFRhZyk7XHJcbiAgICAgICAgICAgIHBlcmYuY2xlYXJNYXJrcyhlbmRUYWcpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn1cclxuY29uc3QgUkVfQVJHUyA9IC9cXHsoWzAtOWEtekEtWl0rKVxcfS9nO1xyXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xyXG5mdW5jdGlvbiBmb3JtYXQobWVzc2FnZSwgLi4uYXJncykge1xyXG4gICAgaWYgKGFyZ3MubGVuZ3RoID09PSAxICYmIGlzT2JqZWN0KGFyZ3NbMF0pKSB7XHJcbiAgICAgICAgYXJncyA9IGFyZ3NbMF07XHJcbiAgICB9XHJcbiAgICBpZiAoIWFyZ3MgfHwgIWFyZ3MuaGFzT3duUHJvcGVydHkpIHtcclxuICAgICAgICBhcmdzID0ge307XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbWVzc2FnZS5yZXBsYWNlKFJFX0FSR1MsIChtYXRjaCwgaWRlbnRpZmllcikgPT4ge1xyXG4gICAgICAgIHJldHVybiBhcmdzLmhhc093blByb3BlcnR5KGlkZW50aWZpZXIpID8gYXJnc1tpZGVudGlmaWVyXSA6ICcnO1xyXG4gICAgfSk7XHJcbn1cclxuY29uc3QgaGFzU3ltYm9sID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgU3ltYm9sLnRvU3RyaW5nVGFnID09PSAnc3ltYm9sJztcclxuY29uc3QgbWFrZVN5bWJvbCA9IChuYW1lKSA9PiBoYXNTeW1ib2wgPyBTeW1ib2wobmFtZSkgOiBuYW1lO1xyXG5jb25zdCBnZW5lcmF0ZUZvcm1hdENhY2hlS2V5ID0gKGxvY2FsZSwga2V5LCBzb3VyY2UpID0+IGZyaWVuZGx5SlNPTnN0cmluZ2lmeSh7IGw6IGxvY2FsZSwgazoga2V5LCBzOiBzb3VyY2UgfSk7XHJcbmNvbnN0IGZyaWVuZGx5SlNPTnN0cmluZ2lmeSA9IChqc29uKSA9PiBKU09OLnN0cmluZ2lmeShqc29uKVxyXG4gICAgLnJlcGxhY2UoL1xcdTIwMjgvZywgJ1xcXFx1MjAyOCcpXHJcbiAgICAucmVwbGFjZSgvXFx1MjAyOS9nLCAnXFxcXHUyMDI5JylcclxuICAgIC5yZXBsYWNlKC9cXHUwMDI3L2csICdcXFxcdTAwMjcnKTtcclxuY29uc3QgaXNOdW1iZXIgPSAodmFsKSA9PiB0eXBlb2YgdmFsID09PSAnbnVtYmVyJyAmJiBpc0Zpbml0ZSh2YWwpO1xyXG5jb25zdCBpc0RhdGUgPSAodmFsKSA9PiB0b1R5cGVTdHJpbmcodmFsKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xyXG5jb25zdCBpc1JlZ0V4cCA9ICh2YWwpID0+IHRvVHlwZVN0cmluZyh2YWwpID09PSAnW29iamVjdCBSZWdFeHBdJztcclxuY29uc3QgaXNFbXB0eU9iamVjdCA9ICh2YWwpID0+IGlzUGxhaW5PYmplY3QodmFsKSAmJiBPYmplY3Qua2V5cyh2YWwpLmxlbmd0aCA9PT0gMDtcclxuZnVuY3Rpb24gd2Fybihtc2csIGVycikge1xyXG4gICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIGNvbnNvbGUud2FybihgW2ludGxpZnldIGAgKyBtc2cpO1xyXG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xyXG4gICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKGVyci5zdGFjayk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmNvbnN0IGFzc2lnbiA9IE9iamVjdC5hc3NpZ247XHJcbmxldCBfZ2xvYmFsVGhpcztcclxuY29uc3QgZ2V0R2xvYmFsVGhpcyA9ICgpID0+IHtcclxuICAgIC8vIHByZXR0aWVyLWlnbm9yZVxyXG4gICAgcmV0dXJuIChfZ2xvYmFsVGhpcyB8fFxyXG4gICAgICAgIChfZ2xvYmFsVGhpcyA9XHJcbiAgICAgICAgICAgIHR5cGVvZiBnbG9iYWxUaGlzICE9PSAndW5kZWZpbmVkJ1xyXG4gICAgICAgICAgICAgICAgPyBnbG9iYWxUaGlzXHJcbiAgICAgICAgICAgICAgICA6IHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJ1xyXG4gICAgICAgICAgICAgICAgICAgID8gc2VsZlxyXG4gICAgICAgICAgICAgICAgICAgIDogdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgPyB3aW5kb3dcclxuICAgICAgICAgICAgICAgICAgICAgICAgOiB0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBnbG9iYWxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDoge30pKTtcclxufTtcclxuZnVuY3Rpb24gZXNjYXBlSHRtbChyYXdUZXh0KSB7XHJcbiAgICByZXR1cm4gcmF3VGV4dFxyXG4gICAgICAgIC5yZXBsYWNlKC88L2csICcmbHQ7JylcclxuICAgICAgICAucmVwbGFjZSgvPi9nLCAnJmd0OycpXHJcbiAgICAgICAgLnJlcGxhY2UoL1wiL2csICcmcXVvdDsnKVxyXG4gICAgICAgIC5yZXBsYWNlKC8nL2csICcmYXBvczsnKTtcclxufVxyXG5jb25zdCBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XHJcbmZ1bmN0aW9uIGhhc093bihvYmosIGtleSkge1xyXG4gICAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpO1xyXG59XHJcbi8qIGVzbGludC1lbmFibGUgKi9cclxuLyoqXHJcbiAqIFVzZWZ1bCBVdGlsaXRpZXMgQnkgRXZhbiB5b3VcclxuICogTW9kaWZpZWQgYnkga2F6dXlhIGthd2FndWNoaVxyXG4gKiBNSVQgTGljZW5zZVxyXG4gKiBodHRwczovL2dpdGh1Yi5jb20vdnVlanMvdnVlLW5leHQvYmxvYi9tYXN0ZXIvcGFja2FnZXMvc2hhcmVkL3NyYy9pbmRleC50c1xyXG4gKiBodHRwczovL2dpdGh1Yi5jb20vdnVlanMvdnVlLW5leHQvYmxvYi9tYXN0ZXIvcGFja2FnZXMvc2hhcmVkL3NyYy9jb2RlZnJhbWUudHNcclxuICovXHJcbmNvbnN0IGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xyXG5jb25zdCBpc0Z1bmN0aW9uID0gKHZhbCkgPT4gdHlwZW9mIHZhbCA9PT0gJ2Z1bmN0aW9uJztcclxuY29uc3QgaXNTdHJpbmcgPSAodmFsKSA9PiB0eXBlb2YgdmFsID09PSAnc3RyaW5nJztcclxuY29uc3QgaXNCb29sZWFuID0gKHZhbCkgPT4gdHlwZW9mIHZhbCA9PT0gJ2Jvb2xlYW4nO1xyXG5jb25zdCBpc1N5bWJvbCA9ICh2YWwpID0+IHR5cGVvZiB2YWwgPT09ICdzeW1ib2wnO1xyXG5jb25zdCBpc09iamVjdCA9ICh2YWwpID0+IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuIHZhbCAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsID09PSAnb2JqZWN0JztcclxuY29uc3QgaXNQcm9taXNlID0gKHZhbCkgPT4ge1xyXG4gICAgcmV0dXJuIGlzT2JqZWN0KHZhbCkgJiYgaXNGdW5jdGlvbih2YWwudGhlbikgJiYgaXNGdW5jdGlvbih2YWwuY2F0Y2gpO1xyXG59O1xyXG5jb25zdCBvYmplY3RUb1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XHJcbmNvbnN0IHRvVHlwZVN0cmluZyA9ICh2YWx1ZSkgPT4gb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XHJcbmNvbnN0IGlzUGxhaW5PYmplY3QgPSAodmFsKSA9PiB0b1R5cGVTdHJpbmcodmFsKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSc7XHJcbi8vIGZvciBjb252ZXJ0aW5nIGxpc3QgYW5kIG5hbWVkIHZhbHVlcyB0byBkaXNwbGF5ZWQgc3RyaW5ncy5cclxuY29uc3QgdG9EaXNwbGF5U3RyaW5nID0gKHZhbCkgPT4ge1xyXG4gICAgcmV0dXJuIHZhbCA9PSBudWxsXHJcbiAgICAgICAgPyAnJ1xyXG4gICAgICAgIDogaXNBcnJheSh2YWwpIHx8IChpc1BsYWluT2JqZWN0KHZhbCkgJiYgdmFsLnRvU3RyaW5nID09PSBvYmplY3RUb1N0cmluZylcclxuICAgICAgICAgICAgPyBKU09OLnN0cmluZ2lmeSh2YWwsIG51bGwsIDIpXHJcbiAgICAgICAgICAgIDogU3RyaW5nKHZhbCk7XHJcbn07XHJcbmNvbnN0IFJBTkdFID0gMjtcclxuZnVuY3Rpb24gZ2VuZXJhdGVDb2RlRnJhbWUoc291cmNlLCBzdGFydCA9IDAsIGVuZCA9IHNvdXJjZS5sZW5ndGgpIHtcclxuICAgIGNvbnN0IGxpbmVzID0gc291cmNlLnNwbGl0KC9cXHI/XFxuLyk7XHJcbiAgICBsZXQgY291bnQgPSAwO1xyXG4gICAgY29uc3QgcmVzID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY291bnQgKz0gbGluZXNbaV0ubGVuZ3RoICsgMTtcclxuICAgICAgICBpZiAoY291bnQgPj0gc3RhcnQpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IGkgLSBSQU5HRTsgaiA8PSBpICsgUkFOR0UgfHwgZW5kID4gY291bnQ7IGorKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGogPCAwIHx8IGogPj0gbGluZXMubGVuZ3RoKVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbGluZSA9IGogKyAxO1xyXG4gICAgICAgICAgICAgICAgcmVzLnB1c2goYCR7bGluZX0keycgJy5yZXBlYXQoMyAtIFN0cmluZyhsaW5lKS5sZW5ndGgpfXwgICR7bGluZXNbal19YCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsaW5lTGVuZ3RoID0gbGluZXNbal0ubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgaWYgKGogPT09IGkpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBwdXNoIHVuZGVybGluZVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhZCA9IHN0YXJ0IC0gKGNvdW50IC0gbGluZUxlbmd0aCkgKyAxO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGxlbmd0aCA9IE1hdGgubWF4KDEsIGVuZCA+IGNvdW50ID8gbGluZUxlbmd0aCAtIHBhZCA6IGVuZCAtIHN0YXJ0KTtcclxuICAgICAgICAgICAgICAgICAgICByZXMucHVzaChgICAgfCAgYCArICcgJy5yZXBlYXQocGFkKSArICdeJy5yZXBlYXQobGVuZ3RoKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChqID4gaSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlbmQgPiBjb3VudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBsZW5ndGggPSBNYXRoLm1heChNYXRoLm1pbihlbmQgLSBjb3VudCwgbGluZUxlbmd0aCksIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXMucHVzaChgICAgfCAgYCArICdeJy5yZXBlYXQobGVuZ3RoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNvdW50ICs9IGxpbmVMZW5ndGggKyAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiByZXMuam9pbignXFxuJyk7XHJcbn1cblxuLyoqXHJcbiAqIEV2ZW50IGVtaXR0ZXIsIGZvcmtlZCBmcm9tIHRoZSBiZWxvdzpcclxuICogLSBvcmlnaW5hbCByZXBvc2l0b3J5IHVybDogaHR0cHM6Ly9naXRodWIuY29tL2RldmVsb3BpdC9taXR0XHJcbiAqIC0gY29kZSB1cmw6IGh0dHBzOi8vZ2l0aHViLmNvbS9kZXZlbG9waXQvbWl0dC9ibG9iL21hc3Rlci9zcmMvaW5kZXgudHNcclxuICogLSBhdXRob3I6IEphc29uIE1pbGxlciAoaHR0cHM6Ly9naXRodWIuY29tL2RldmVsb3BpdClcclxuICogLSBsaWNlbnNlOiBNSVRcclxuICovXHJcbi8qKlxyXG4gKiBDcmVhdGUgYSBldmVudCBlbWl0dGVyXHJcbiAqXHJcbiAqIEByZXR1cm5zIEFuIGV2ZW50IGVtaXR0ZXJcclxuICovXHJcbmZ1bmN0aW9uIGNyZWF0ZUVtaXR0ZXIoKSB7XHJcbiAgICBjb25zdCBldmVudHMgPSBuZXcgTWFwKCk7XHJcbiAgICBjb25zdCBlbWl0dGVyID0ge1xyXG4gICAgICAgIGV2ZW50cyxcclxuICAgICAgICBvbihldmVudCwgaGFuZGxlcikge1xyXG4gICAgICAgICAgICBjb25zdCBoYW5kbGVycyA9IGV2ZW50cy5nZXQoZXZlbnQpO1xyXG4gICAgICAgICAgICBjb25zdCBhZGRlZCA9IGhhbmRsZXJzICYmIGhhbmRsZXJzLnB1c2goaGFuZGxlcik7XHJcbiAgICAgICAgICAgIGlmICghYWRkZWQpIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50cy5zZXQoZXZlbnQsIFtoYW5kbGVyXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIG9mZihldmVudCwgaGFuZGxlcikge1xyXG4gICAgICAgICAgICBjb25zdCBoYW5kbGVycyA9IGV2ZW50cy5nZXQoZXZlbnQpO1xyXG4gICAgICAgICAgICBpZiAoaGFuZGxlcnMpIHtcclxuICAgICAgICAgICAgICAgIGhhbmRsZXJzLnNwbGljZShoYW5kbGVycy5pbmRleE9mKGhhbmRsZXIpID4+PiAwLCAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZW1pdChldmVudCwgcGF5bG9hZCkge1xyXG4gICAgICAgICAgICAoZXZlbnRzLmdldChldmVudCkgfHwgW10pXHJcbiAgICAgICAgICAgICAgICAuc2xpY2UoKVxyXG4gICAgICAgICAgICAgICAgLm1hcChoYW5kbGVyID0+IGhhbmRsZXIocGF5bG9hZCkpO1xyXG4gICAgICAgICAgICAoZXZlbnRzLmdldCgnKicpIHx8IFtdKVxyXG4gICAgICAgICAgICAgICAgLnNsaWNlKClcclxuICAgICAgICAgICAgICAgIC5tYXAoaGFuZGxlciA9PiBoYW5kbGVyKGV2ZW50LCBwYXlsb2FkKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIHJldHVybiBlbWl0dGVyO1xyXG59XG5cbmV4cG9ydCB7IGFzc2lnbiwgY3JlYXRlRW1pdHRlciwgZXNjYXBlSHRtbCwgZm9ybWF0LCBmcmllbmRseUpTT05zdHJpbmdpZnksIGdlbmVyYXRlQ29kZUZyYW1lLCBnZW5lcmF0ZUZvcm1hdENhY2hlS2V5LCBnZXRHbG9iYWxUaGlzLCBoYXNPd24sIGluQnJvd3NlciwgaXNBcnJheSwgaXNCb29sZWFuLCBpc0RhdGUsIGlzRW1wdHlPYmplY3QsIGlzRnVuY3Rpb24sIGlzTnVtYmVyLCBpc09iamVjdCwgaXNQbGFpbk9iamVjdCwgaXNQcm9taXNlLCBpc1JlZ0V4cCwgaXNTdHJpbmcsIGlzU3ltYm9sLCBtYWtlU3ltYm9sLCBtYXJrLCBtZWFzdXJlLCBvYmplY3RUb1N0cmluZywgdG9EaXNwbGF5U3RyaW5nLCB0b1R5cGVTdHJpbmcsIHdhcm4gfTtcbiIsIi8qIVxuICAqIEBpbnRsaWZ5L21lc3NhZ2UtcmVzb2x2ZXIgdjkuMS4xMFxuICAqIChjKSAyMDIyIGthenV5YSBrYXdhZ3VjaGlcbiAgKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gICovXG4vKipcclxuICogT3JpZ2luYWwgVXRpbGl0aWVzXHJcbiAqIHdyaXR0ZW4gYnkga2F6dXlhIGthd2FndWNoaVxyXG4gKi9cclxuaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSkgO1xyXG5jb25zdCBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XHJcbmZ1bmN0aW9uIGhhc093bihvYmosIGtleSkge1xyXG4gICAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpO1xyXG59XHJcbmNvbnN0IGlzT2JqZWN0ID0gKHZhbCkgPT4gLy8gZXNsaW50LWRpc2FibGUtbGluZVxyXG4gdmFsICE9PSBudWxsICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnO1xuXG5jb25zdCBwYXRoU3RhdGVNYWNoaW5lID0gW107XHJcbnBhdGhTdGF0ZU1hY2hpbmVbMCAvKiBCRUZPUkVfUEFUSCAqL10gPSB7XHJcbiAgICBbXCJ3XCIgLyogV09SS1NQQUNFICovXTogWzAgLyogQkVGT1JFX1BBVEggKi9dLFxyXG4gICAgW1wiaVwiIC8qIElERU5UICovXTogWzMgLyogSU5fSURFTlQgKi8sIDAgLyogQVBQRU5EICovXSxcclxuICAgIFtcIltcIiAvKiBMRUZUX0JSQUNLRVQgKi9dOiBbNCAvKiBJTl9TVUJfUEFUSCAqL10sXHJcbiAgICBbXCJvXCIgLyogRU5EX09GX0ZBSUwgKi9dOiBbNyAvKiBBRlRFUl9QQVRIICovXVxyXG59O1xyXG5wYXRoU3RhdGVNYWNoaW5lWzEgLyogSU5fUEFUSCAqL10gPSB7XHJcbiAgICBbXCJ3XCIgLyogV09SS1NQQUNFICovXTogWzEgLyogSU5fUEFUSCAqL10sXHJcbiAgICBbXCIuXCIgLyogRE9UICovXTogWzIgLyogQkVGT1JFX0lERU5UICovXSxcclxuICAgIFtcIltcIiAvKiBMRUZUX0JSQUNLRVQgKi9dOiBbNCAvKiBJTl9TVUJfUEFUSCAqL10sXHJcbiAgICBbXCJvXCIgLyogRU5EX09GX0ZBSUwgKi9dOiBbNyAvKiBBRlRFUl9QQVRIICovXVxyXG59O1xyXG5wYXRoU3RhdGVNYWNoaW5lWzIgLyogQkVGT1JFX0lERU5UICovXSA9IHtcclxuICAgIFtcIndcIiAvKiBXT1JLU1BBQ0UgKi9dOiBbMiAvKiBCRUZPUkVfSURFTlQgKi9dLFxyXG4gICAgW1wiaVwiIC8qIElERU5UICovXTogWzMgLyogSU5fSURFTlQgKi8sIDAgLyogQVBQRU5EICovXSxcclxuICAgIFtcIjBcIiAvKiBaRVJPICovXTogWzMgLyogSU5fSURFTlQgKi8sIDAgLyogQVBQRU5EICovXVxyXG59O1xyXG5wYXRoU3RhdGVNYWNoaW5lWzMgLyogSU5fSURFTlQgKi9dID0ge1xyXG4gICAgW1wiaVwiIC8qIElERU5UICovXTogWzMgLyogSU5fSURFTlQgKi8sIDAgLyogQVBQRU5EICovXSxcclxuICAgIFtcIjBcIiAvKiBaRVJPICovXTogWzMgLyogSU5fSURFTlQgKi8sIDAgLyogQVBQRU5EICovXSxcclxuICAgIFtcIndcIiAvKiBXT1JLU1BBQ0UgKi9dOiBbMSAvKiBJTl9QQVRIICovLCAxIC8qIFBVU0ggKi9dLFxyXG4gICAgW1wiLlwiIC8qIERPVCAqL106IFsyIC8qIEJFRk9SRV9JREVOVCAqLywgMSAvKiBQVVNIICovXSxcclxuICAgIFtcIltcIiAvKiBMRUZUX0JSQUNLRVQgKi9dOiBbNCAvKiBJTl9TVUJfUEFUSCAqLywgMSAvKiBQVVNIICovXSxcclxuICAgIFtcIm9cIiAvKiBFTkRfT0ZfRkFJTCAqL106IFs3IC8qIEFGVEVSX1BBVEggKi8sIDEgLyogUFVTSCAqL11cclxufTtcclxucGF0aFN0YXRlTWFjaGluZVs0IC8qIElOX1NVQl9QQVRIICovXSA9IHtcclxuICAgIFtcIidcIiAvKiBTSU5HTEVfUVVPVEUgKi9dOiBbNSAvKiBJTl9TSU5HTEVfUVVPVEUgKi8sIDAgLyogQVBQRU5EICovXSxcclxuICAgIFtcIlxcXCJcIiAvKiBET1VCTEVfUVVPVEUgKi9dOiBbNiAvKiBJTl9ET1VCTEVfUVVPVEUgKi8sIDAgLyogQVBQRU5EICovXSxcclxuICAgIFtcIltcIiAvKiBMRUZUX0JSQUNLRVQgKi9dOiBbXHJcbiAgICAgICAgNCAvKiBJTl9TVUJfUEFUSCAqLyxcclxuICAgICAgICAyIC8qIElOQ19TVUJfUEFUSF9ERVBUSCAqL1xyXG4gICAgXSxcclxuICAgIFtcIl1cIiAvKiBSSUdIVF9CUkFDS0VUICovXTogWzEgLyogSU5fUEFUSCAqLywgMyAvKiBQVVNIX1NVQl9QQVRIICovXSxcclxuICAgIFtcIm9cIiAvKiBFTkRfT0ZfRkFJTCAqL106IDggLyogRVJST1IgKi8sXHJcbiAgICBbXCJsXCIgLyogRUxTRSAqL106IFs0IC8qIElOX1NVQl9QQVRIICovLCAwIC8qIEFQUEVORCAqL11cclxufTtcclxucGF0aFN0YXRlTWFjaGluZVs1IC8qIElOX1NJTkdMRV9RVU9URSAqL10gPSB7XHJcbiAgICBbXCInXCIgLyogU0lOR0xFX1FVT1RFICovXTogWzQgLyogSU5fU1VCX1BBVEggKi8sIDAgLyogQVBQRU5EICovXSxcclxuICAgIFtcIm9cIiAvKiBFTkRfT0ZfRkFJTCAqL106IDggLyogRVJST1IgKi8sXHJcbiAgICBbXCJsXCIgLyogRUxTRSAqL106IFs1IC8qIElOX1NJTkdMRV9RVU9URSAqLywgMCAvKiBBUFBFTkQgKi9dXHJcbn07XHJcbnBhdGhTdGF0ZU1hY2hpbmVbNiAvKiBJTl9ET1VCTEVfUVVPVEUgKi9dID0ge1xyXG4gICAgW1wiXFxcIlwiIC8qIERPVUJMRV9RVU9URSAqL106IFs0IC8qIElOX1NVQl9QQVRIICovLCAwIC8qIEFQUEVORCAqL10sXHJcbiAgICBbXCJvXCIgLyogRU5EX09GX0ZBSUwgKi9dOiA4IC8qIEVSUk9SICovLFxyXG4gICAgW1wibFwiIC8qIEVMU0UgKi9dOiBbNiAvKiBJTl9ET1VCTEVfUVVPVEUgKi8sIDAgLyogQVBQRU5EICovXVxyXG59O1xyXG4vKipcclxuICogQ2hlY2sgaWYgYW4gZXhwcmVzc2lvbiBpcyBhIGxpdGVyYWwgdmFsdWUuXHJcbiAqL1xyXG5jb25zdCBsaXRlcmFsVmFsdWVSRSA9IC9eXFxzPyg/OnRydWV8ZmFsc2V8LT9bXFxkLl0rfCdbXiddKid8XCJbXlwiXSpcIilcXHM/JC87XHJcbmZ1bmN0aW9uIGlzTGl0ZXJhbChleHApIHtcclxuICAgIHJldHVybiBsaXRlcmFsVmFsdWVSRS50ZXN0KGV4cCk7XHJcbn1cclxuLyoqXHJcbiAqIFN0cmlwIHF1b3RlcyBmcm9tIGEgc3RyaW5nXHJcbiAqL1xyXG5mdW5jdGlvbiBzdHJpcFF1b3RlcyhzdHIpIHtcclxuICAgIGNvbnN0IGEgPSBzdHIuY2hhckNvZGVBdCgwKTtcclxuICAgIGNvbnN0IGIgPSBzdHIuY2hhckNvZGVBdChzdHIubGVuZ3RoIC0gMSk7XHJcbiAgICByZXR1cm4gYSA9PT0gYiAmJiAoYSA9PT0gMHgyMiB8fCBhID09PSAweDI3KSA/IHN0ci5zbGljZSgxLCAtMSkgOiBzdHI7XHJcbn1cclxuLyoqXHJcbiAqIERldGVybWluZSB0aGUgdHlwZSBvZiBhIGNoYXJhY3RlciBpbiBhIGtleXBhdGguXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRQYXRoQ2hhclR5cGUoY2gpIHtcclxuICAgIGlmIChjaCA9PT0gdW5kZWZpbmVkIHx8IGNoID09PSBudWxsKSB7XHJcbiAgICAgICAgcmV0dXJuIFwib1wiIC8qIEVORF9PRl9GQUlMICovO1xyXG4gICAgfVxyXG4gICAgY29uc3QgY29kZSA9IGNoLmNoYXJDb2RlQXQoMCk7XHJcbiAgICBzd2l0Y2ggKGNvZGUpIHtcclxuICAgICAgICBjYXNlIDB4NWI6IC8vIFtcclxuICAgICAgICBjYXNlIDB4NWQ6IC8vIF1cclxuICAgICAgICBjYXNlIDB4MmU6IC8vIC5cclxuICAgICAgICBjYXNlIDB4MjI6IC8vIFwiXHJcbiAgICAgICAgY2FzZSAweDI3OiAvLyAnXHJcbiAgICAgICAgICAgIHJldHVybiBjaDtcclxuICAgICAgICBjYXNlIDB4NWY6IC8vIF9cclxuICAgICAgICBjYXNlIDB4MjQ6IC8vICRcclxuICAgICAgICBjYXNlIDB4MmQ6IC8vIC1cclxuICAgICAgICAgICAgcmV0dXJuIFwiaVwiIC8qIElERU5UICovO1xyXG4gICAgICAgIGNhc2UgMHgwOTogLy8gVGFiIChIVClcclxuICAgICAgICBjYXNlIDB4MGE6IC8vIE5ld2xpbmUgKExGKVxyXG4gICAgICAgIGNhc2UgMHgwZDogLy8gUmV0dXJuIChDUilcclxuICAgICAgICBjYXNlIDB4YTA6IC8vIE5vLWJyZWFrIHNwYWNlIChOQlNQKVxyXG4gICAgICAgIGNhc2UgMHhmZWZmOiAvLyBCeXRlIE9yZGVyIE1hcmsgKEJPTSlcclxuICAgICAgICBjYXNlIDB4MjAyODogLy8gTGluZSBTZXBhcmF0b3IgKExTKVxyXG4gICAgICAgIGNhc2UgMHgyMDI5OiAvLyBQYXJhZ3JhcGggU2VwYXJhdG9yIChQUylcclxuICAgICAgICAgICAgcmV0dXJuIFwid1wiIC8qIFdPUktTUEFDRSAqLztcclxuICAgIH1cclxuICAgIHJldHVybiBcImlcIiAvKiBJREVOVCAqLztcclxufVxyXG4vKipcclxuICogRm9ybWF0IGEgc3ViUGF0aCwgcmV0dXJuIGl0cyBwbGFpbiBmb3JtIGlmIGl0IGlzXHJcbiAqIGEgbGl0ZXJhbCBzdHJpbmcgb3IgbnVtYmVyLiBPdGhlcndpc2UgcHJlcGVuZCB0aGVcclxuICogZHluYW1pYyBpbmRpY2F0b3IgKCopLlxyXG4gKi9cclxuZnVuY3Rpb24gZm9ybWF0U3ViUGF0aChwYXRoKSB7XHJcbiAgICBjb25zdCB0cmltbWVkID0gcGF0aC50cmltKCk7XHJcbiAgICAvLyBpbnZhbGlkIGxlYWRpbmcgMFxyXG4gICAgaWYgKHBhdGguY2hhckF0KDApID09PSAnMCcgJiYgaXNOYU4ocGFyc2VJbnQocGF0aCkpKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGlzTGl0ZXJhbCh0cmltbWVkKVxyXG4gICAgICAgID8gc3RyaXBRdW90ZXModHJpbW1lZClcclxuICAgICAgICA6IFwiKlwiIC8qIEFTVEFSSVNLICovICsgdHJpbW1lZDtcclxufVxyXG4vKipcclxuICogUGFyc2UgYSBzdHJpbmcgcGF0aCBpbnRvIGFuIGFycmF5IG9mIHNlZ21lbnRzXHJcbiAqL1xyXG5mdW5jdGlvbiBwYXJzZShwYXRoKSB7XHJcbiAgICBjb25zdCBrZXlzID0gW107XHJcbiAgICBsZXQgaW5kZXggPSAtMTtcclxuICAgIGxldCBtb2RlID0gMCAvKiBCRUZPUkVfUEFUSCAqLztcclxuICAgIGxldCBzdWJQYXRoRGVwdGggPSAwO1xyXG4gICAgbGV0IGM7XHJcbiAgICBsZXQga2V5OyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXHJcbiAgICBsZXQgbmV3Q2hhcjtcclxuICAgIGxldCB0eXBlO1xyXG4gICAgbGV0IHRyYW5zaXRpb247XHJcbiAgICBsZXQgYWN0aW9uO1xyXG4gICAgbGV0IHR5cGVNYXA7XHJcbiAgICBjb25zdCBhY3Rpb25zID0gW107XHJcbiAgICBhY3Rpb25zWzAgLyogQVBQRU5EICovXSA9ICgpID0+IHtcclxuICAgICAgICBpZiAoa2V5ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAga2V5ID0gbmV3Q2hhcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGtleSArPSBuZXdDaGFyO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBhY3Rpb25zWzEgLyogUFVTSCAqL10gPSAoKSA9PiB7XHJcbiAgICAgICAgaWYgKGtleSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGtleXMucHVzaChrZXkpO1xyXG4gICAgICAgICAgICBrZXkgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIGFjdGlvbnNbMiAvKiBJTkNfU1VCX1BBVEhfREVQVEggKi9dID0gKCkgPT4ge1xyXG4gICAgICAgIGFjdGlvbnNbMCAvKiBBUFBFTkQgKi9dKCk7XHJcbiAgICAgICAgc3ViUGF0aERlcHRoKys7XHJcbiAgICB9O1xyXG4gICAgYWN0aW9uc1szIC8qIFBVU0hfU1VCX1BBVEggKi9dID0gKCkgPT4ge1xyXG4gICAgICAgIGlmIChzdWJQYXRoRGVwdGggPiAwKSB7XHJcbiAgICAgICAgICAgIHN1YlBhdGhEZXB0aC0tO1xyXG4gICAgICAgICAgICBtb2RlID0gNCAvKiBJTl9TVUJfUEFUSCAqLztcclxuICAgICAgICAgICAgYWN0aW9uc1swIC8qIEFQUEVORCAqL10oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHN1YlBhdGhEZXB0aCA9IDA7XHJcbiAgICAgICAgICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGtleSA9IGZvcm1hdFN1YlBhdGgoa2V5KTtcclxuICAgICAgICAgICAgaWYgKGtleSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGFjdGlvbnNbMSAvKiBQVVNIICovXSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIGZ1bmN0aW9uIG1heWJlVW5lc2NhcGVRdW90ZSgpIHtcclxuICAgICAgICBjb25zdCBuZXh0Q2hhciA9IHBhdGhbaW5kZXggKyAxXTtcclxuICAgICAgICBpZiAoKG1vZGUgPT09IDUgLyogSU5fU0lOR0xFX1FVT1RFICovICYmXHJcbiAgICAgICAgICAgIG5leHRDaGFyID09PSBcIidcIiAvKiBTSU5HTEVfUVVPVEUgKi8pIHx8XHJcbiAgICAgICAgICAgIChtb2RlID09PSA2IC8qIElOX0RPVUJMRV9RVU9URSAqLyAmJlxyXG4gICAgICAgICAgICAgICAgbmV4dENoYXIgPT09IFwiXFxcIlwiIC8qIERPVUJMRV9RVU9URSAqLykpIHtcclxuICAgICAgICAgICAgaW5kZXgrKztcclxuICAgICAgICAgICAgbmV3Q2hhciA9ICdcXFxcJyArIG5leHRDaGFyO1xyXG4gICAgICAgICAgICBhY3Rpb25zWzAgLyogQVBQRU5EICovXSgpO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICB3aGlsZSAobW9kZSAhPT0gbnVsbCkge1xyXG4gICAgICAgIGluZGV4Kys7XHJcbiAgICAgICAgYyA9IHBhdGhbaW5kZXhdO1xyXG4gICAgICAgIGlmIChjID09PSAnXFxcXCcgJiYgbWF5YmVVbmVzY2FwZVF1b3RlKCkpIHtcclxuICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHR5cGUgPSBnZXRQYXRoQ2hhclR5cGUoYyk7XHJcbiAgICAgICAgdHlwZU1hcCA9IHBhdGhTdGF0ZU1hY2hpbmVbbW9kZV07XHJcbiAgICAgICAgdHJhbnNpdGlvbiA9IHR5cGVNYXBbdHlwZV0gfHwgdHlwZU1hcFtcImxcIiAvKiBFTFNFICovXSB8fCA4IC8qIEVSUk9SICovO1xyXG4gICAgICAgIC8vIGNoZWNrIHBhcnNlIGVycm9yXHJcbiAgICAgICAgaWYgKHRyYW5zaXRpb24gPT09IDggLyogRVJST1IgKi8pIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBtb2RlID0gdHJhbnNpdGlvblswXTtcclxuICAgICAgICBpZiAodHJhbnNpdGlvblsxXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGFjdGlvbiA9IGFjdGlvbnNbdHJhbnNpdGlvblsxXV07XHJcbiAgICAgICAgICAgIGlmIChhY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgIG5ld0NoYXIgPSBjO1xyXG4gICAgICAgICAgICAgICAgaWYgKGFjdGlvbigpID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjaGVjayBwYXJzZSBmaW5pc2hcclxuICAgICAgICBpZiAobW9kZSA9PT0gNyAvKiBBRlRFUl9QQVRIICovKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBrZXlzO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4vLyBwYXRoIHRva2VuIGNhY2hlXHJcbmNvbnN0IGNhY2hlID0gbmV3IE1hcCgpO1xyXG5mdW5jdGlvbiByZXNvbHZlVmFsdWUob2JqLCBwYXRoKSB7XHJcbiAgICAvLyBjaGVjayBvYmplY3RcclxuICAgIGlmICghaXNPYmplY3Qob2JqKSkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgLy8gcGFyc2UgcGF0aFxyXG4gICAgbGV0IGhpdCA9IGNhY2hlLmdldChwYXRoKTtcclxuICAgIGlmICghaGl0KSB7XHJcbiAgICAgICAgaGl0ID0gcGFyc2UocGF0aCk7XHJcbiAgICAgICAgaWYgKGhpdCkge1xyXG4gICAgICAgICAgICBjYWNoZS5zZXQocGF0aCwgaGl0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBjaGVjayBoaXRcclxuICAgIGlmICghaGl0KSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICAvLyByZXNvbHZlIHBhdGggdmFsdWVcclxuICAgIGNvbnN0IGxlbiA9IGhpdC5sZW5ndGg7XHJcbiAgICBsZXQgbGFzdCA9IG9iajtcclxuICAgIGxldCBpID0gMDtcclxuICAgIHdoaWxlIChpIDwgbGVuKSB7XHJcbiAgICAgICAgY29uc3QgdmFsID0gbGFzdFtoaXRbaV1dO1xyXG4gICAgICAgIGlmICh2YWwgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGFzdCA9IHZhbDtcclxuICAgICAgICBpKys7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbGFzdDtcclxufVxyXG4vKipcclxuICogVHJhbnNmb3JtIGZsYXQganNvbiBpbiBvYmogdG8gbm9ybWFsIGpzb24gaW4gb2JqXHJcbiAqL1xyXG5mdW5jdGlvbiBoYW5kbGVGbGF0SnNvbihvYmopIHtcclxuICAgIC8vIGNoZWNrIG9ialxyXG4gICAgaWYgKCFpc09iamVjdChvYmopKSB7XHJcbiAgICAgICAgcmV0dXJuIG9iajtcclxuICAgIH1cclxuICAgIGZvciAoY29uc3Qga2V5IGluIG9iaikge1xyXG4gICAgICAgIC8vIGNoZWNrIGtleVxyXG4gICAgICAgIGlmICghaGFzT3duKG9iaiwga2V5KSkge1xyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gaGFuZGxlIGZvciBub3JtYWwganNvblxyXG4gICAgICAgIGlmICgha2V5LmluY2x1ZGVzKFwiLlwiIC8qIERPVCAqLykpIHtcclxuICAgICAgICAgICAgLy8gcmVjdXJzaXZlIHByb2Nlc3MgdmFsdWUgaWYgdmFsdWUgaXMgYWxzbyBhIG9iamVjdFxyXG4gICAgICAgICAgICBpZiAoaXNPYmplY3Qob2JqW2tleV0pKSB7XHJcbiAgICAgICAgICAgICAgICBoYW5kbGVGbGF0SnNvbihvYmpba2V5XSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gaGFuZGxlIGZvciBmbGF0IGpzb24sIHRyYW5zZm9ybSB0byBub3JtYWwganNvblxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBnbyB0byB0aGUgbGFzdCBvYmplY3RcclxuICAgICAgICAgICAgY29uc3Qgc3ViS2V5cyA9IGtleS5zcGxpdChcIi5cIiAvKiBET1QgKi8pO1xyXG4gICAgICAgICAgICBjb25zdCBsYXN0SW5kZXggPSBzdWJLZXlzLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgICAgIGxldCBjdXJyZW50T2JqID0gb2JqO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxhc3RJbmRleDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIShzdWJLZXlzW2ldIGluIGN1cnJlbnRPYmopKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudE9ialtzdWJLZXlzW2ldXSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY3VycmVudE9iaiA9IGN1cnJlbnRPYmpbc3ViS2V5c1tpXV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gdXBkYXRlIGxhc3Qgb2JqZWN0IHZhbHVlLCBkZWxldGUgb2xkIHByb3BlcnR5XHJcbiAgICAgICAgICAgIGN1cnJlbnRPYmpbc3ViS2V5c1tsYXN0SW5kZXhdXSA9IG9ialtrZXldO1xyXG4gICAgICAgICAgICBkZWxldGUgb2JqW2tleV07XHJcbiAgICAgICAgICAgIC8vIHJlY3Vyc2l2ZSBwcm9jZXNzIHZhbHVlIGlmIHZhbHVlIGlzIGFsc28gYSBvYmplY3RcclxuICAgICAgICAgICAgaWYgKGlzT2JqZWN0KGN1cnJlbnRPYmpbc3ViS2V5c1tsYXN0SW5kZXhdXSkpIHtcclxuICAgICAgICAgICAgICAgIGhhbmRsZUZsYXRKc29uKGN1cnJlbnRPYmpbc3ViS2V5c1tsYXN0SW5kZXhdXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gb2JqO1xyXG59XG5cbmV4cG9ydCB7IGhhbmRsZUZsYXRKc29uLCBwYXJzZSwgcmVzb2x2ZVZhbHVlIH07XG4iLCIvKiFcbiAgKiBAaW50bGlmeS9ydW50aW1lIHY5LjEuMTBcbiAgKiAoYykgMjAyMiBrYXp1eWEga2F3YWd1Y2hpXG4gICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICAqL1xuaW1wb3J0IHsgaXNOdW1iZXIsIGlzT2JqZWN0LCBpc1N0cmluZywgaXNGdW5jdGlvbiwgaXNQbGFpbk9iamVjdCwgdG9EaXNwbGF5U3RyaW5nIH0gZnJvbSAnQGludGxpZnkvc2hhcmVkJztcblxuY29uc3QgREVGQVVMVF9NT0RJRklFUiA9IChzdHIpID0+IHN0cjtcclxuY29uc3QgREVGQVVMVF9NRVNTQUdFID0gKGN0eCkgPT4gJyc7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuY29uc3QgREVGQVVMVF9NRVNTQUdFX0RBVEFfVFlQRSA9ICd0ZXh0JztcclxuY29uc3QgREVGQVVMVF9OT1JNQUxJWkUgPSAodmFsdWVzKSA9PiB2YWx1ZXMubGVuZ3RoID09PSAwID8gJycgOiB2YWx1ZXMuam9pbignJyk7XHJcbmNvbnN0IERFRkFVTFRfSU5URVJQT0xBVEUgPSB0b0Rpc3BsYXlTdHJpbmc7XHJcbmZ1bmN0aW9uIHBsdXJhbERlZmF1bHQoY2hvaWNlLCBjaG9pY2VzTGVuZ3RoKSB7XHJcbiAgICBjaG9pY2UgPSBNYXRoLmFicyhjaG9pY2UpO1xyXG4gICAgaWYgKGNob2ljZXNMZW5ndGggPT09IDIpIHtcclxuICAgICAgICAvLyBwcmV0dGllci1pZ25vcmVcclxuICAgICAgICByZXR1cm4gY2hvaWNlXHJcbiAgICAgICAgICAgID8gY2hvaWNlID4gMVxyXG4gICAgICAgICAgICAgICAgPyAxXHJcbiAgICAgICAgICAgICAgICA6IDBcclxuICAgICAgICAgICAgOiAxO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNob2ljZSA/IE1hdGgubWluKGNob2ljZSwgMikgOiAwO1xyXG59XHJcbmZ1bmN0aW9uIGdldFBsdXJhbEluZGV4KG9wdGlvbnMpIHtcclxuICAgIC8vIHByZXR0aWVyLWlnbm9yZVxyXG4gICAgY29uc3QgaW5kZXggPSBpc051bWJlcihvcHRpb25zLnBsdXJhbEluZGV4KVxyXG4gICAgICAgID8gb3B0aW9ucy5wbHVyYWxJbmRleFxyXG4gICAgICAgIDogLTE7XHJcbiAgICAvLyBwcmV0dGllci1pZ25vcmVcclxuICAgIHJldHVybiBvcHRpb25zLm5hbWVkICYmIChpc051bWJlcihvcHRpb25zLm5hbWVkLmNvdW50KSB8fCBpc051bWJlcihvcHRpb25zLm5hbWVkLm4pKVxyXG4gICAgICAgID8gaXNOdW1iZXIob3B0aW9ucy5uYW1lZC5jb3VudClcclxuICAgICAgICAgICAgPyBvcHRpb25zLm5hbWVkLmNvdW50XHJcbiAgICAgICAgICAgIDogaXNOdW1iZXIob3B0aW9ucy5uYW1lZC5uKVxyXG4gICAgICAgICAgICAgICAgPyBvcHRpb25zLm5hbWVkLm5cclxuICAgICAgICAgICAgICAgIDogaW5kZXhcclxuICAgICAgICA6IGluZGV4O1xyXG59XHJcbmZ1bmN0aW9uIG5vcm1hbGl6ZU5hbWVkKHBsdXJhbEluZGV4LCBwcm9wcykge1xyXG4gICAgaWYgKCFwcm9wcy5jb3VudCkge1xyXG4gICAgICAgIHByb3BzLmNvdW50ID0gcGx1cmFsSW5kZXg7XHJcbiAgICB9XHJcbiAgICBpZiAoIXByb3BzLm4pIHtcclxuICAgICAgICBwcm9wcy5uID0gcGx1cmFsSW5kZXg7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gY3JlYXRlTWVzc2FnZUNvbnRleHQob3B0aW9ucyA9IHt9KSB7XHJcbiAgICBjb25zdCBsb2NhbGUgPSBvcHRpb25zLmxvY2FsZTtcclxuICAgIGNvbnN0IHBsdXJhbEluZGV4ID0gZ2V0UGx1cmFsSW5kZXgob3B0aW9ucyk7XHJcbiAgICBjb25zdCBwbHVyYWxSdWxlID0gaXNPYmplY3Qob3B0aW9ucy5wbHVyYWxSdWxlcykgJiZcclxuICAgICAgICBpc1N0cmluZyhsb2NhbGUpICYmXHJcbiAgICAgICAgaXNGdW5jdGlvbihvcHRpb25zLnBsdXJhbFJ1bGVzW2xvY2FsZV0pXHJcbiAgICAgICAgPyBvcHRpb25zLnBsdXJhbFJ1bGVzW2xvY2FsZV1cclxuICAgICAgICA6IHBsdXJhbERlZmF1bHQ7XHJcbiAgICBjb25zdCBvcmdQbHVyYWxSdWxlID0gaXNPYmplY3Qob3B0aW9ucy5wbHVyYWxSdWxlcykgJiZcclxuICAgICAgICBpc1N0cmluZyhsb2NhbGUpICYmXHJcbiAgICAgICAgaXNGdW5jdGlvbihvcHRpb25zLnBsdXJhbFJ1bGVzW2xvY2FsZV0pXHJcbiAgICAgICAgPyBwbHVyYWxEZWZhdWx0XHJcbiAgICAgICAgOiB1bmRlZmluZWQ7XHJcbiAgICBjb25zdCBwbHVyYWwgPSAobWVzc2FnZXMpID0+IG1lc3NhZ2VzW3BsdXJhbFJ1bGUocGx1cmFsSW5kZXgsIG1lc3NhZ2VzLmxlbmd0aCwgb3JnUGx1cmFsUnVsZSldO1xyXG4gICAgY29uc3QgX2xpc3QgPSBvcHRpb25zLmxpc3QgfHwgW107XHJcbiAgICBjb25zdCBsaXN0ID0gKGluZGV4KSA9PiBfbGlzdFtpbmRleF07XHJcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxyXG4gICAgY29uc3QgX25hbWVkID0gb3B0aW9ucy5uYW1lZCB8fCB7fTtcclxuICAgIGlzTnVtYmVyKG9wdGlvbnMucGx1cmFsSW5kZXgpICYmIG5vcm1hbGl6ZU5hbWVkKHBsdXJhbEluZGV4LCBfbmFtZWQpO1xyXG4gICAgY29uc3QgbmFtZWQgPSAoa2V5KSA9PiBfbmFtZWRba2V5XTtcclxuICAgIC8vIFRPRE86IG5lZWQgdG8gZGVzaWduIHJlc29sdmUgbWVzc2FnZSBmdW5jdGlvbj9cclxuICAgIGZ1bmN0aW9uIG1lc3NhZ2Uoa2V5KSB7XHJcbiAgICAgICAgLy8gcHJldHRpZXItaWdub3JlXHJcbiAgICAgICAgY29uc3QgbXNnID0gaXNGdW5jdGlvbihvcHRpb25zLm1lc3NhZ2VzKVxyXG4gICAgICAgICAgICA/IG9wdGlvbnMubWVzc2FnZXMoa2V5KVxyXG4gICAgICAgICAgICA6IGlzT2JqZWN0KG9wdGlvbnMubWVzc2FnZXMpXHJcbiAgICAgICAgICAgICAgICA/IG9wdGlvbnMubWVzc2FnZXNba2V5XVxyXG4gICAgICAgICAgICAgICAgOiBmYWxzZTtcclxuICAgICAgICByZXR1cm4gIW1zZ1xyXG4gICAgICAgICAgICA/IG9wdGlvbnMucGFyZW50XHJcbiAgICAgICAgICAgICAgICA/IG9wdGlvbnMucGFyZW50Lm1lc3NhZ2Uoa2V5KSAvLyByZXNvbHZlIGZyb20gcGFyZW50IG1lc3NhZ2VzXHJcbiAgICAgICAgICAgICAgICA6IERFRkFVTFRfTUVTU0FHRVxyXG4gICAgICAgICAgICA6IG1zZztcclxuICAgIH1cclxuICAgIGNvbnN0IF9tb2RpZmllciA9IChuYW1lKSA9PiBvcHRpb25zLm1vZGlmaWVyc1xyXG4gICAgICAgID8gb3B0aW9ucy5tb2RpZmllcnNbbmFtZV1cclxuICAgICAgICA6IERFRkFVTFRfTU9ESUZJRVI7XHJcbiAgICBjb25zdCBub3JtYWxpemUgPSBpc1BsYWluT2JqZWN0KG9wdGlvbnMucHJvY2Vzc29yKSAmJiBpc0Z1bmN0aW9uKG9wdGlvbnMucHJvY2Vzc29yLm5vcm1hbGl6ZSlcclxuICAgICAgICA/IG9wdGlvbnMucHJvY2Vzc29yLm5vcm1hbGl6ZVxyXG4gICAgICAgIDogREVGQVVMVF9OT1JNQUxJWkU7XHJcbiAgICBjb25zdCBpbnRlcnBvbGF0ZSA9IGlzUGxhaW5PYmplY3Qob3B0aW9ucy5wcm9jZXNzb3IpICYmXHJcbiAgICAgICAgaXNGdW5jdGlvbihvcHRpb25zLnByb2Nlc3Nvci5pbnRlcnBvbGF0ZSlcclxuICAgICAgICA/IG9wdGlvbnMucHJvY2Vzc29yLmludGVycG9sYXRlXHJcbiAgICAgICAgOiBERUZBVUxUX0lOVEVSUE9MQVRFO1xyXG4gICAgY29uc3QgdHlwZSA9IGlzUGxhaW5PYmplY3Qob3B0aW9ucy5wcm9jZXNzb3IpICYmIGlzU3RyaW5nKG9wdGlvbnMucHJvY2Vzc29yLnR5cGUpXHJcbiAgICAgICAgPyBvcHRpb25zLnByb2Nlc3Nvci50eXBlXHJcbiAgICAgICAgOiBERUZBVUxUX01FU1NBR0VfREFUQV9UWVBFO1xyXG4gICAgY29uc3QgY3R4ID0ge1xyXG4gICAgICAgIFtcImxpc3RcIiAvKiBMSVNUICovXTogbGlzdCxcclxuICAgICAgICBbXCJuYW1lZFwiIC8qIE5BTUVEICovXTogbmFtZWQsXHJcbiAgICAgICAgW1wicGx1cmFsXCIgLyogUExVUkFMICovXTogcGx1cmFsLFxyXG4gICAgICAgIFtcImxpbmtlZFwiIC8qIExJTktFRCAqL106IChrZXksIG1vZGlmaWVyKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIFRPRE86IHNob3VsZCBjaGVjayBga2V5YFxyXG4gICAgICAgICAgICBjb25zdCBtc2cgPSBtZXNzYWdlKGtleSkoY3R4KTtcclxuICAgICAgICAgICAgcmV0dXJuIGlzU3RyaW5nKG1vZGlmaWVyKSA/IF9tb2RpZmllcihtb2RpZmllcikobXNnKSA6IG1zZztcclxuICAgICAgICB9LFxyXG4gICAgICAgIFtcIm1lc3NhZ2VcIiAvKiBNRVNTQUdFICovXTogbWVzc2FnZSxcclxuICAgICAgICBbXCJ0eXBlXCIgLyogVFlQRSAqL106IHR5cGUsXHJcbiAgICAgICAgW1wiaW50ZXJwb2xhdGVcIiAvKiBJTlRFUlBPTEFURSAqL106IGludGVycG9sYXRlLFxyXG4gICAgICAgIFtcIm5vcm1hbGl6ZVwiIC8qIE5PUk1BTElaRSAqL106IG5vcm1hbGl6ZVxyXG4gICAgfTtcclxuICAgIHJldHVybiBjdHg7XHJcbn1cblxuZXhwb3J0IHsgREVGQVVMVF9NRVNTQUdFX0RBVEFfVFlQRSwgY3JlYXRlTWVzc2FnZUNvbnRleHQgfTtcbiIsIi8qIVxuICAqIEBpbnRsaWZ5L21lc3NhZ2UtY29tcGlsZXIgdjkuMS4xMFxuICAqIChjKSAyMDIyIGthenV5YSBrYXdhZ3VjaGlcbiAgKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gICovXG5pbXBvcnQgeyBmb3JtYXQsIGFzc2lnbiwgaXNTdHJpbmcgfSBmcm9tICdAaW50bGlmeS9zaGFyZWQnO1xuXG4vKiogQGludGVybmFsICovXHJcbmNvbnN0IGVycm9yTWVzc2FnZXMgPSB7XHJcbiAgICAvLyB0b2tlbml6ZXIgZXJyb3IgbWVzc2FnZXNcclxuICAgIFswIC8qIEVYUEVDVEVEX1RPS0VOICovXTogYEV4cGVjdGVkIHRva2VuOiAnezB9J2AsXHJcbiAgICBbMSAvKiBJTlZBTElEX1RPS0VOX0lOX1BMQUNFSE9MREVSICovXTogYEludmFsaWQgdG9rZW4gaW4gcGxhY2Vob2xkZXI6ICd7MH0nYCxcclxuICAgIFsyIC8qIFVOVEVSTUlOQVRFRF9TSU5HTEVfUVVPVEVfSU5fUExBQ0VIT0xERVIgKi9dOiBgVW50ZXJtaW5hdGVkIHNpbmdsZSBxdW90ZSBpbiBwbGFjZWhvbGRlcmAsXHJcbiAgICBbMyAvKiBVTktOT1dOX0VTQ0FQRV9TRVFVRU5DRSAqL106IGBVbmtub3duIGVzY2FwZSBzZXF1ZW5jZTogXFxcXHswfWAsXHJcbiAgICBbNCAvKiBJTlZBTElEX1VOSUNPREVfRVNDQVBFX1NFUVVFTkNFICovXTogYEludmFsaWQgdW5pY29kZSBlc2NhcGUgc2VxdWVuY2U6IHswfWAsXHJcbiAgICBbNSAvKiBVTkJBTEFOQ0VEX0NMT1NJTkdfQlJBQ0UgKi9dOiBgVW5iYWxhbmNlZCBjbG9zaW5nIGJyYWNlYCxcclxuICAgIFs2IC8qIFVOVEVSTUlOQVRFRF9DTE9TSU5HX0JSQUNFICovXTogYFVudGVybWluYXRlZCBjbG9zaW5nIGJyYWNlYCxcclxuICAgIFs3IC8qIEVNUFRZX1BMQUNFSE9MREVSICovXTogYEVtcHR5IHBsYWNlaG9sZGVyYCxcclxuICAgIFs4IC8qIE5PVF9BTExPV19ORVNUX1BMQUNFSE9MREVSICovXTogYE5vdCBhbGxvd2VkIG5lc3QgcGxhY2Vob2xkZXJgLFxyXG4gICAgWzkgLyogSU5WQUxJRF9MSU5LRURfRk9STUFUICovXTogYEludmFsaWQgbGlua2VkIGZvcm1hdGAsXHJcbiAgICAvLyBwYXJzZXIgZXJyb3IgbWVzc2FnZXNcclxuICAgIFsxMCAvKiBNVVNUX0hBVkVfTUVTU0FHRVNfSU5fUExVUkFMICovXTogYFBsdXJhbCBtdXN0IGhhdmUgbWVzc2FnZXNgLFxyXG4gICAgWzExIC8qIFVORVhQRUNURURfRU1QVFlfTElOS0VEX01PRElGSUVSICovXTogYFVuZXhwZWN0ZWQgZW1wdHkgbGlua2VkIG1vZGlmaWVyYCxcclxuICAgIFsxMiAvKiBVTkVYUEVDVEVEX0VNUFRZX0xJTktFRF9LRVkgKi9dOiBgVW5leHBlY3RlZCBlbXB0eSBsaW5rZWQga2V5YCxcclxuICAgIFsxMyAvKiBVTkVYUEVDVEVEX0xFWElDQUxfQU5BTFlTSVMgKi9dOiBgVW5leHBlY3RlZCBsZXhpY2FsIGFuYWx5c2lzIGluIHRva2VuOiAnezB9J2BcclxufTtcclxuZnVuY3Rpb24gY3JlYXRlQ29tcGlsZUVycm9yKGNvZGUsIGxvYywgb3B0aW9ucyA9IHt9KSB7XHJcbiAgICBjb25zdCB7IGRvbWFpbiwgbWVzc2FnZXMsIGFyZ3MgfSA9IG9wdGlvbnM7XHJcbiAgICBjb25zdCBtc2cgPSAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJylcclxuICAgICAgICA/IGZvcm1hdCgobWVzc2FnZXMgfHwgZXJyb3JNZXNzYWdlcylbY29kZV0gfHwgJycsIC4uLihhcmdzIHx8IFtdKSlcclxuICAgICAgICA6IGNvZGU7XHJcbiAgICBjb25zdCBlcnJvciA9IG5ldyBTeW50YXhFcnJvcihTdHJpbmcobXNnKSk7XHJcbiAgICBlcnJvci5jb2RlID0gY29kZTtcclxuICAgIGlmIChsb2MpIHtcclxuICAgICAgICBlcnJvci5sb2NhdGlvbiA9IGxvYztcclxuICAgIH1cclxuICAgIGVycm9yLmRvbWFpbiA9IGRvbWFpbjtcclxuICAgIHJldHVybiBlcnJvcjtcclxufVxyXG4vKiogQGludGVybmFsICovXHJcbmZ1bmN0aW9uIGRlZmF1bHRPbkVycm9yKGVycm9yKSB7XHJcbiAgICB0aHJvdyBlcnJvcjtcclxufVxuXG5jb25zdCBMb2NhdGlvblN0dWIgPSB7XHJcbiAgICBzdGFydDogeyBsaW5lOiAxLCBjb2x1bW46IDEsIG9mZnNldDogMCB9LFxyXG4gICAgZW5kOiB7IGxpbmU6IDEsIGNvbHVtbjogMSwgb2Zmc2V0OiAwIH1cclxufTtcclxuZnVuY3Rpb24gY3JlYXRlUG9zaXRpb24obGluZSwgY29sdW1uLCBvZmZzZXQpIHtcclxuICAgIHJldHVybiB7IGxpbmUsIGNvbHVtbiwgb2Zmc2V0IH07XHJcbn1cclxuZnVuY3Rpb24gY3JlYXRlTG9jYXRpb24oc3RhcnQsIGVuZCwgc291cmNlKSB7XHJcbiAgICBjb25zdCBsb2MgPSB7IHN0YXJ0LCBlbmQgfTtcclxuICAgIGlmIChzb3VyY2UgIT0gbnVsbCkge1xyXG4gICAgICAgIGxvYy5zb3VyY2UgPSBzb3VyY2U7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbG9jO1xyXG59XG5cbmNvbnN0IENIQVJfU1AgPSAnICc7XHJcbmNvbnN0IENIQVJfQ1IgPSAnXFxyJztcclxuY29uc3QgQ0hBUl9MRiA9ICdcXG4nO1xyXG5jb25zdCBDSEFSX0xTID0gU3RyaW5nLmZyb21DaGFyQ29kZSgweDIwMjgpO1xyXG5jb25zdCBDSEFSX1BTID0gU3RyaW5nLmZyb21DaGFyQ29kZSgweDIwMjkpO1xyXG5mdW5jdGlvbiBjcmVhdGVTY2FubmVyKHN0cikge1xyXG4gICAgY29uc3QgX2J1ZiA9IHN0cjtcclxuICAgIGxldCBfaW5kZXggPSAwO1xyXG4gICAgbGV0IF9saW5lID0gMTtcclxuICAgIGxldCBfY29sdW1uID0gMTtcclxuICAgIGxldCBfcGVla09mZnNldCA9IDA7XHJcbiAgICBjb25zdCBpc0NSTEYgPSAoaW5kZXgpID0+IF9idWZbaW5kZXhdID09PSBDSEFSX0NSICYmIF9idWZbaW5kZXggKyAxXSA9PT0gQ0hBUl9MRjtcclxuICAgIGNvbnN0IGlzTEYgPSAoaW5kZXgpID0+IF9idWZbaW5kZXhdID09PSBDSEFSX0xGO1xyXG4gICAgY29uc3QgaXNQUyA9IChpbmRleCkgPT4gX2J1ZltpbmRleF0gPT09IENIQVJfUFM7XHJcbiAgICBjb25zdCBpc0xTID0gKGluZGV4KSA9PiBfYnVmW2luZGV4XSA9PT0gQ0hBUl9MUztcclxuICAgIGNvbnN0IGlzTGluZUVuZCA9IChpbmRleCkgPT4gaXNDUkxGKGluZGV4KSB8fCBpc0xGKGluZGV4KSB8fCBpc1BTKGluZGV4KSB8fCBpc0xTKGluZGV4KTtcclxuICAgIGNvbnN0IGluZGV4ID0gKCkgPT4gX2luZGV4O1xyXG4gICAgY29uc3QgbGluZSA9ICgpID0+IF9saW5lO1xyXG4gICAgY29uc3QgY29sdW1uID0gKCkgPT4gX2NvbHVtbjtcclxuICAgIGNvbnN0IHBlZWtPZmZzZXQgPSAoKSA9PiBfcGVla09mZnNldDtcclxuICAgIGNvbnN0IGNoYXJBdCA9IChvZmZzZXQpID0+IGlzQ1JMRihvZmZzZXQpIHx8IGlzUFMob2Zmc2V0KSB8fCBpc0xTKG9mZnNldCkgPyBDSEFSX0xGIDogX2J1ZltvZmZzZXRdO1xyXG4gICAgY29uc3QgY3VycmVudENoYXIgPSAoKSA9PiBjaGFyQXQoX2luZGV4KTtcclxuICAgIGNvbnN0IGN1cnJlbnRQZWVrID0gKCkgPT4gY2hhckF0KF9pbmRleCArIF9wZWVrT2Zmc2V0KTtcclxuICAgIGZ1bmN0aW9uIG5leHQoKSB7XHJcbiAgICAgICAgX3BlZWtPZmZzZXQgPSAwO1xyXG4gICAgICAgIGlmIChpc0xpbmVFbmQoX2luZGV4KSkge1xyXG4gICAgICAgICAgICBfbGluZSsrO1xyXG4gICAgICAgICAgICBfY29sdW1uID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGlzQ1JMRihfaW5kZXgpKSB7XHJcbiAgICAgICAgICAgIF9pbmRleCsrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBfaW5kZXgrKztcclxuICAgICAgICBfY29sdW1uKys7XHJcbiAgICAgICAgcmV0dXJuIF9idWZbX2luZGV4XTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIHBlZWsoKSB7XHJcbiAgICAgICAgaWYgKGlzQ1JMRihfaW5kZXggKyBfcGVla09mZnNldCkpIHtcclxuICAgICAgICAgICAgX3BlZWtPZmZzZXQrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgX3BlZWtPZmZzZXQrKztcclxuICAgICAgICByZXR1cm4gX2J1ZltfaW5kZXggKyBfcGVla09mZnNldF07XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiByZXNldCgpIHtcclxuICAgICAgICBfaW5kZXggPSAwO1xyXG4gICAgICAgIF9saW5lID0gMTtcclxuICAgICAgICBfY29sdW1uID0gMTtcclxuICAgICAgICBfcGVla09mZnNldCA9IDA7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiByZXNldFBlZWsob2Zmc2V0ID0gMCkge1xyXG4gICAgICAgIF9wZWVrT2Zmc2V0ID0gb2Zmc2V0O1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gc2tpcFRvUGVlaygpIHtcclxuICAgICAgICBjb25zdCB0YXJnZXQgPSBfaW5kZXggKyBfcGVla09mZnNldDtcclxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5tb2RpZmllZC1sb29wLWNvbmRpdGlvblxyXG4gICAgICAgIHdoaWxlICh0YXJnZXQgIT09IF9pbmRleCkge1xyXG4gICAgICAgICAgICBuZXh0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIF9wZWVrT2Zmc2V0ID0gMDtcclxuICAgIH1cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5kZXgsXHJcbiAgICAgICAgbGluZSxcclxuICAgICAgICBjb2x1bW4sXHJcbiAgICAgICAgcGVla09mZnNldCxcclxuICAgICAgICBjaGFyQXQsXHJcbiAgICAgICAgY3VycmVudENoYXIsXHJcbiAgICAgICAgY3VycmVudFBlZWssXHJcbiAgICAgICAgbmV4dCxcclxuICAgICAgICBwZWVrLFxyXG4gICAgICAgIHJlc2V0LFxyXG4gICAgICAgIHJlc2V0UGVlayxcclxuICAgICAgICBza2lwVG9QZWVrXHJcbiAgICB9O1xyXG59XG5cbmNvbnN0IEVPRiA9IHVuZGVmaW5lZDtcclxuY29uc3QgTElURVJBTF9ERUxJTUlURVIgPSBcIidcIjtcclxuY29uc3QgRVJST1JfRE9NQUlOJDEgPSAndG9rZW5pemVyJztcclxuZnVuY3Rpb24gY3JlYXRlVG9rZW5pemVyKHNvdXJjZSwgb3B0aW9ucyA9IHt9KSB7XHJcbiAgICBjb25zdCBsb2NhdGlvbiA9IG9wdGlvbnMubG9jYXRpb24gIT09IGZhbHNlO1xyXG4gICAgY29uc3QgX3NjbnIgPSBjcmVhdGVTY2FubmVyKHNvdXJjZSk7XHJcbiAgICBjb25zdCBjdXJyZW50T2Zmc2V0ID0gKCkgPT4gX3NjbnIuaW5kZXgoKTtcclxuICAgIGNvbnN0IGN1cnJlbnRQb3NpdGlvbiA9ICgpID0+IGNyZWF0ZVBvc2l0aW9uKF9zY25yLmxpbmUoKSwgX3NjbnIuY29sdW1uKCksIF9zY25yLmluZGV4KCkpO1xyXG4gICAgY29uc3QgX2luaXRMb2MgPSBjdXJyZW50UG9zaXRpb24oKTtcclxuICAgIGNvbnN0IF9pbml0T2Zmc2V0ID0gY3VycmVudE9mZnNldCgpO1xyXG4gICAgY29uc3QgX2NvbnRleHQgPSB7XHJcbiAgICAgICAgY3VycmVudFR5cGU6IDE0IC8qIEVPRiAqLyxcclxuICAgICAgICBvZmZzZXQ6IF9pbml0T2Zmc2V0LFxyXG4gICAgICAgIHN0YXJ0TG9jOiBfaW5pdExvYyxcclxuICAgICAgICBlbmRMb2M6IF9pbml0TG9jLFxyXG4gICAgICAgIGxhc3RUeXBlOiAxNCAvKiBFT0YgKi8sXHJcbiAgICAgICAgbGFzdE9mZnNldDogX2luaXRPZmZzZXQsXHJcbiAgICAgICAgbGFzdFN0YXJ0TG9jOiBfaW5pdExvYyxcclxuICAgICAgICBsYXN0RW5kTG9jOiBfaW5pdExvYyxcclxuICAgICAgICBicmFjZU5lc3Q6IDAsXHJcbiAgICAgICAgaW5MaW5rZWQ6IGZhbHNlLFxyXG4gICAgICAgIHRleHQ6ICcnXHJcbiAgICB9O1xyXG4gICAgY29uc3QgY29udGV4dCA9ICgpID0+IF9jb250ZXh0O1xyXG4gICAgY29uc3QgeyBvbkVycm9yIH0gPSBvcHRpb25zO1xyXG4gICAgZnVuY3Rpb24gZW1pdEVycm9yKGNvZGUsIHBvcywgb2Zmc2V0LCAuLi5hcmdzKSB7XHJcbiAgICAgICAgY29uc3QgY3R4ID0gY29udGV4dCgpO1xyXG4gICAgICAgIHBvcy5jb2x1bW4gKz0gb2Zmc2V0O1xyXG4gICAgICAgIHBvcy5vZmZzZXQgKz0gb2Zmc2V0O1xyXG4gICAgICAgIGlmIChvbkVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxvYyA9IGNyZWF0ZUxvY2F0aW9uKGN0eC5zdGFydExvYywgcG9zKTtcclxuICAgICAgICAgICAgY29uc3QgZXJyID0gY3JlYXRlQ29tcGlsZUVycm9yKGNvZGUsIGxvYywge1xyXG4gICAgICAgICAgICAgICAgZG9tYWluOiBFUlJPUl9ET01BSU4kMSxcclxuICAgICAgICAgICAgICAgIGFyZ3NcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIG9uRXJyb3IoZXJyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBnZXRUb2tlbihjb250ZXh0LCB0eXBlLCB2YWx1ZSkge1xyXG4gICAgICAgIGNvbnRleHQuZW5kTG9jID0gY3VycmVudFBvc2l0aW9uKCk7XHJcbiAgICAgICAgY29udGV4dC5jdXJyZW50VHlwZSA9IHR5cGU7XHJcbiAgICAgICAgY29uc3QgdG9rZW4gPSB7IHR5cGUgfTtcclxuICAgICAgICBpZiAobG9jYXRpb24pIHtcclxuICAgICAgICAgICAgdG9rZW4ubG9jID0gY3JlYXRlTG9jYXRpb24oY29udGV4dC5zdGFydExvYywgY29udGV4dC5lbmRMb2MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0b2tlbi52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdG9rZW47XHJcbiAgICB9XHJcbiAgICBjb25zdCBnZXRFbmRUb2tlbiA9IChjb250ZXh0KSA9PiBnZXRUb2tlbihjb250ZXh0LCAxNCAvKiBFT0YgKi8pO1xyXG4gICAgZnVuY3Rpb24gZWF0KHNjbnIsIGNoKSB7XHJcbiAgICAgICAgaWYgKHNjbnIuY3VycmVudENoYXIoKSA9PT0gY2gpIHtcclxuICAgICAgICAgICAgc2Nuci5uZXh0KCk7XHJcbiAgICAgICAgICAgIHJldHVybiBjaDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGVtaXRFcnJvcigwIC8qIEVYUEVDVEVEX1RPS0VOICovLCBjdXJyZW50UG9zaXRpb24oKSwgMCwgY2gpO1xyXG4gICAgICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gcGVla1NwYWNlcyhzY25yKSB7XHJcbiAgICAgICAgbGV0IGJ1ZiA9ICcnO1xyXG4gICAgICAgIHdoaWxlIChzY25yLmN1cnJlbnRQZWVrKCkgPT09IENIQVJfU1AgfHwgc2Nuci5jdXJyZW50UGVlaygpID09PSBDSEFSX0xGKSB7XHJcbiAgICAgICAgICAgIGJ1ZiArPSBzY25yLmN1cnJlbnRQZWVrKCk7XHJcbiAgICAgICAgICAgIHNjbnIucGVlaygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gYnVmO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gc2tpcFNwYWNlcyhzY25yKSB7XHJcbiAgICAgICAgY29uc3QgYnVmID0gcGVla1NwYWNlcyhzY25yKTtcclxuICAgICAgICBzY25yLnNraXBUb1BlZWsoKTtcclxuICAgICAgICByZXR1cm4gYnVmO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gaXNJZGVudGlmaWVyU3RhcnQoY2gpIHtcclxuICAgICAgICBpZiAoY2ggPT09IEVPRikge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGNjID0gY2guY2hhckNvZGVBdCgwKTtcclxuICAgICAgICByZXR1cm4gKChjYyA+PSA5NyAmJiBjYyA8PSAxMjIpIHx8IC8vIGEtelxyXG4gICAgICAgICAgICAoY2MgPj0gNjUgJiYgY2MgPD0gOTApIHx8IC8vIEEtWlxyXG4gICAgICAgICAgICBjYyA9PT0gOTUgLy8gX1xyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBpc051bWJlclN0YXJ0KGNoKSB7XHJcbiAgICAgICAgaWYgKGNoID09PSBFT0YpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBjYyA9IGNoLmNoYXJDb2RlQXQoMCk7XHJcbiAgICAgICAgcmV0dXJuIGNjID49IDQ4ICYmIGNjIDw9IDU3OyAvLyAwLTlcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGlzTmFtZWRJZGVudGlmaWVyU3RhcnQoc2NuciwgY29udGV4dCkge1xyXG4gICAgICAgIGNvbnN0IHsgY3VycmVudFR5cGUgfSA9IGNvbnRleHQ7XHJcbiAgICAgICAgaWYgKGN1cnJlbnRUeXBlICE9PSAyIC8qIEJyYWNlTGVmdCAqLykge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBlZWtTcGFjZXMoc2Nucik7XHJcbiAgICAgICAgY29uc3QgcmV0ID0gaXNJZGVudGlmaWVyU3RhcnQoc2Nuci5jdXJyZW50UGVlaygpKTtcclxuICAgICAgICBzY25yLnJlc2V0UGVlaygpO1xyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBpc0xpc3RJZGVudGlmaWVyU3RhcnQoc2NuciwgY29udGV4dCkge1xyXG4gICAgICAgIGNvbnN0IHsgY3VycmVudFR5cGUgfSA9IGNvbnRleHQ7XHJcbiAgICAgICAgaWYgKGN1cnJlbnRUeXBlICE9PSAyIC8qIEJyYWNlTGVmdCAqLykge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBlZWtTcGFjZXMoc2Nucik7XHJcbiAgICAgICAgY29uc3QgY2ggPSBzY25yLmN1cnJlbnRQZWVrKCkgPT09ICctJyA/IHNjbnIucGVlaygpIDogc2Nuci5jdXJyZW50UGVlaygpO1xyXG4gICAgICAgIGNvbnN0IHJldCA9IGlzTnVtYmVyU3RhcnQoY2gpO1xyXG4gICAgICAgIHNjbnIucmVzZXRQZWVrKCk7XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGlzTGl0ZXJhbFN0YXJ0KHNjbnIsIGNvbnRleHQpIHtcclxuICAgICAgICBjb25zdCB7IGN1cnJlbnRUeXBlIH0gPSBjb250ZXh0O1xyXG4gICAgICAgIGlmIChjdXJyZW50VHlwZSAhPT0gMiAvKiBCcmFjZUxlZnQgKi8pIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwZWVrU3BhY2VzKHNjbnIpO1xyXG4gICAgICAgIGNvbnN0IHJldCA9IHNjbnIuY3VycmVudFBlZWsoKSA9PT0gTElURVJBTF9ERUxJTUlURVI7XHJcbiAgICAgICAgc2Nuci5yZXNldFBlZWsoKTtcclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gaXNMaW5rZWREb3RTdGFydChzY25yLCBjb250ZXh0KSB7XHJcbiAgICAgICAgY29uc3QgeyBjdXJyZW50VHlwZSB9ID0gY29udGV4dDtcclxuICAgICAgICBpZiAoY3VycmVudFR5cGUgIT09IDggLyogTGlua2VkQWxpYXMgKi8pIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwZWVrU3BhY2VzKHNjbnIpO1xyXG4gICAgICAgIGNvbnN0IHJldCA9IHNjbnIuY3VycmVudFBlZWsoKSA9PT0gXCIuXCIgLyogTGlua2VkRG90ICovO1xyXG4gICAgICAgIHNjbnIucmVzZXRQZWVrKCk7XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGlzTGlua2VkTW9kaWZpZXJTdGFydChzY25yLCBjb250ZXh0KSB7XHJcbiAgICAgICAgY29uc3QgeyBjdXJyZW50VHlwZSB9ID0gY29udGV4dDtcclxuICAgICAgICBpZiAoY3VycmVudFR5cGUgIT09IDkgLyogTGlua2VkRG90ICovKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcGVla1NwYWNlcyhzY25yKTtcclxuICAgICAgICBjb25zdCByZXQgPSBpc0lkZW50aWZpZXJTdGFydChzY25yLmN1cnJlbnRQZWVrKCkpO1xyXG4gICAgICAgIHNjbnIucmVzZXRQZWVrKCk7XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGlzTGlua2VkRGVsaW1pdGVyU3RhcnQoc2NuciwgY29udGV4dCkge1xyXG4gICAgICAgIGNvbnN0IHsgY3VycmVudFR5cGUgfSA9IGNvbnRleHQ7XHJcbiAgICAgICAgaWYgKCEoY3VycmVudFR5cGUgPT09IDggLyogTGlua2VkQWxpYXMgKi8gfHxcclxuICAgICAgICAgICAgY3VycmVudFR5cGUgPT09IDEyIC8qIExpbmtlZE1vZGlmaWVyICovKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBlZWtTcGFjZXMoc2Nucik7XHJcbiAgICAgICAgY29uc3QgcmV0ID0gc2Nuci5jdXJyZW50UGVlaygpID09PSBcIjpcIiAvKiBMaW5rZWREZWxpbWl0ZXIgKi87XHJcbiAgICAgICAgc2Nuci5yZXNldFBlZWsoKTtcclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gaXNMaW5rZWRSZWZlclN0YXJ0KHNjbnIsIGNvbnRleHQpIHtcclxuICAgICAgICBjb25zdCB7IGN1cnJlbnRUeXBlIH0gPSBjb250ZXh0O1xyXG4gICAgICAgIGlmIChjdXJyZW50VHlwZSAhPT0gMTAgLyogTGlua2VkRGVsaW1pdGVyICovKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgZm4gPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNoID0gc2Nuci5jdXJyZW50UGVlaygpO1xyXG4gICAgICAgICAgICBpZiAoY2ggPT09IFwie1wiIC8qIEJyYWNlTGVmdCAqLykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzSWRlbnRpZmllclN0YXJ0KHNjbnIucGVlaygpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChjaCA9PT0gXCJAXCIgLyogTGlua2VkQWxpYXMgKi8gfHxcclxuICAgICAgICAgICAgICAgIGNoID09PSBcIiVcIiAvKiBNb2R1bG8gKi8gfHxcclxuICAgICAgICAgICAgICAgIGNoID09PSBcInxcIiAvKiBQaXBlICovIHx8XHJcbiAgICAgICAgICAgICAgICBjaCA9PT0gXCI6XCIgLyogTGlua2VkRGVsaW1pdGVyICovIHx8XHJcbiAgICAgICAgICAgICAgICBjaCA9PT0gXCIuXCIgLyogTGlua2VkRG90ICovIHx8XHJcbiAgICAgICAgICAgICAgICBjaCA9PT0gQ0hBUl9TUCB8fFxyXG4gICAgICAgICAgICAgICAgIWNoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoY2ggPT09IENIQVJfTEYpIHtcclxuICAgICAgICAgICAgICAgIHNjbnIucGVlaygpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZuKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBvdGhlciBjaGFyYWN0ZXJzXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXNJZGVudGlmaWVyU3RhcnQoY2gpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25zdCByZXQgPSBmbigpO1xyXG4gICAgICAgIHNjbnIucmVzZXRQZWVrKCk7XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGlzUGx1cmFsU3RhcnQoc2Nucikge1xyXG4gICAgICAgIHBlZWtTcGFjZXMoc2Nucik7XHJcbiAgICAgICAgY29uc3QgcmV0ID0gc2Nuci5jdXJyZW50UGVlaygpID09PSBcInxcIiAvKiBQaXBlICovO1xyXG4gICAgICAgIHNjbnIucmVzZXRQZWVrKCk7XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGlzVGV4dFN0YXJ0KHNjbnIsIHJlc2V0ID0gdHJ1ZSkge1xyXG4gICAgICAgIGNvbnN0IGZuID0gKGhhc1NwYWNlID0gZmFsc2UsIHByZXYgPSAnJywgZGV0ZWN0TW9kdWxvID0gZmFsc2UpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgY2ggPSBzY25yLmN1cnJlbnRQZWVrKCk7XHJcbiAgICAgICAgICAgIGlmIChjaCA9PT0gXCJ7XCIgLyogQnJhY2VMZWZ0ICovKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJldiA9PT0gXCIlXCIgLyogTW9kdWxvICovID8gZmFsc2UgOiBoYXNTcGFjZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChjaCA9PT0gXCJAXCIgLyogTGlua2VkQWxpYXMgKi8gfHwgIWNoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJldiA9PT0gXCIlXCIgLyogTW9kdWxvICovID8gdHJ1ZSA6IGhhc1NwYWNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGNoID09PSBcIiVcIiAvKiBNb2R1bG8gKi8pIHtcclxuICAgICAgICAgICAgICAgIHNjbnIucGVlaygpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZuKGhhc1NwYWNlLCBcIiVcIiAvKiBNb2R1bG8gKi8sIHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGNoID09PSBcInxcIiAvKiBQaXBlICovKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJldiA9PT0gXCIlXCIgLyogTW9kdWxvICovIHx8IGRldGVjdE1vZHVsb1xyXG4gICAgICAgICAgICAgICAgICAgID8gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgIDogIShwcmV2ID09PSBDSEFSX1NQIHx8IHByZXYgPT09IENIQVJfTEYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGNoID09PSBDSEFSX1NQKSB7XHJcbiAgICAgICAgICAgICAgICBzY25yLnBlZWsoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmbih0cnVlLCBDSEFSX1NQLCBkZXRlY3RNb2R1bG8pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGNoID09PSBDSEFSX0xGKSB7XHJcbiAgICAgICAgICAgICAgICBzY25yLnBlZWsoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmbih0cnVlLCBDSEFSX0xGLCBkZXRlY3RNb2R1bG8pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnN0IHJldCA9IGZuKCk7XHJcbiAgICAgICAgcmVzZXQgJiYgc2Nuci5yZXNldFBlZWsoKTtcclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gdGFrZUNoYXIoc2NuciwgZm4pIHtcclxuICAgICAgICBjb25zdCBjaCA9IHNjbnIuY3VycmVudENoYXIoKTtcclxuICAgICAgICBpZiAoY2ggPT09IEVPRikge1xyXG4gICAgICAgICAgICByZXR1cm4gRU9GO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZm4oY2gpKSB7XHJcbiAgICAgICAgICAgIHNjbnIubmV4dCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gY2g7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gdGFrZUlkZW50aWZpZXJDaGFyKHNjbnIpIHtcclxuICAgICAgICBjb25zdCBjbG9zdXJlID0gKGNoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNjID0gY2guY2hhckNvZGVBdCgwKTtcclxuICAgICAgICAgICAgcmV0dXJuICgoY2MgPj0gOTcgJiYgY2MgPD0gMTIyKSB8fCAvLyBhLXpcclxuICAgICAgICAgICAgICAgIChjYyA+PSA2NSAmJiBjYyA8PSA5MCkgfHwgLy8gQS1aXHJcbiAgICAgICAgICAgICAgICAoY2MgPj0gNDggJiYgY2MgPD0gNTcpIHx8IC8vIDAtOVxyXG4gICAgICAgICAgICAgICAgY2MgPT09IDk1IHx8IC8vIF9cclxuICAgICAgICAgICAgICAgIGNjID09PSAzNiAvLyAkXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gdGFrZUNoYXIoc2NuciwgY2xvc3VyZSk7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiB0YWtlRGlnaXQoc2Nucikge1xyXG4gICAgICAgIGNvbnN0IGNsb3N1cmUgPSAoY2gpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgY2MgPSBjaC5jaGFyQ29kZUF0KDApO1xyXG4gICAgICAgICAgICByZXR1cm4gY2MgPj0gNDggJiYgY2MgPD0gNTc7IC8vIDAtOVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIHRha2VDaGFyKHNjbnIsIGNsb3N1cmUpO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gdGFrZUhleERpZ2l0KHNjbnIpIHtcclxuICAgICAgICBjb25zdCBjbG9zdXJlID0gKGNoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNjID0gY2guY2hhckNvZGVBdCgwKTtcclxuICAgICAgICAgICAgcmV0dXJuICgoY2MgPj0gNDggJiYgY2MgPD0gNTcpIHx8IC8vIDAtOVxyXG4gICAgICAgICAgICAgICAgKGNjID49IDY1ICYmIGNjIDw9IDcwKSB8fCAvLyBBLUZcclxuICAgICAgICAgICAgICAgIChjYyA+PSA5NyAmJiBjYyA8PSAxMDIpKTsgLy8gYS1mXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gdGFrZUNoYXIoc2NuciwgY2xvc3VyZSk7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBnZXREaWdpdHMoc2Nucikge1xyXG4gICAgICAgIGxldCBjaCA9ICcnO1xyXG4gICAgICAgIGxldCBudW0gPSAnJztcclxuICAgICAgICB3aGlsZSAoKGNoID0gdGFrZURpZ2l0KHNjbnIpKSkge1xyXG4gICAgICAgICAgICBudW0gKz0gY2g7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudW07XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiByZWFkVGV4dChzY25yKSB7XHJcbiAgICAgICAgbGV0IGJ1ZiA9ICcnO1xyXG4gICAgICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNoID0gc2Nuci5jdXJyZW50Q2hhcigpO1xyXG4gICAgICAgICAgICBpZiAoY2ggPT09IFwie1wiIC8qIEJyYWNlTGVmdCAqLyB8fFxyXG4gICAgICAgICAgICAgICAgY2ggPT09IFwifVwiIC8qIEJyYWNlUmlnaHQgKi8gfHxcclxuICAgICAgICAgICAgICAgIGNoID09PSBcIkBcIiAvKiBMaW5rZWRBbGlhcyAqLyB8fFxyXG4gICAgICAgICAgICAgICAgY2ggPT09IFwifFwiIC8qIFBpcGUgKi8gfHxcclxuICAgICAgICAgICAgICAgICFjaCkge1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoY2ggPT09IFwiJVwiIC8qIE1vZHVsbyAqLykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGlzVGV4dFN0YXJ0KHNjbnIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnVmICs9IGNoO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjbnIubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoY2ggPT09IENIQVJfU1AgfHwgY2ggPT09IENIQVJfTEYpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpc1RleHRTdGFydChzY25yKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1ZiArPSBjaDtcclxuICAgICAgICAgICAgICAgICAgICBzY25yLm5leHQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGlzUGx1cmFsU3RhcnQoc2NucikpIHtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1ZiArPSBjaDtcclxuICAgICAgICAgICAgICAgICAgICBzY25yLm5leHQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGJ1ZiArPSBjaDtcclxuICAgICAgICAgICAgICAgIHNjbnIubmV4dCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBidWY7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiByZWFkTmFtZWRJZGVudGlmaWVyKHNjbnIpIHtcclxuICAgICAgICBza2lwU3BhY2VzKHNjbnIpO1xyXG4gICAgICAgIGxldCBjaCA9ICcnO1xyXG4gICAgICAgIGxldCBuYW1lID0gJyc7XHJcbiAgICAgICAgd2hpbGUgKChjaCA9IHRha2VJZGVudGlmaWVyQ2hhcihzY25yKSkpIHtcclxuICAgICAgICAgICAgbmFtZSArPSBjaDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHNjbnIuY3VycmVudENoYXIoKSA9PT0gRU9GKSB7XHJcbiAgICAgICAgICAgIGVtaXRFcnJvcig2IC8qIFVOVEVSTUlOQVRFRF9DTE9TSU5HX0JSQUNFICovLCBjdXJyZW50UG9zaXRpb24oKSwgMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuYW1lO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gcmVhZExpc3RJZGVudGlmaWVyKHNjbnIpIHtcclxuICAgICAgICBza2lwU3BhY2VzKHNjbnIpO1xyXG4gICAgICAgIGxldCB2YWx1ZSA9ICcnO1xyXG4gICAgICAgIGlmIChzY25yLmN1cnJlbnRDaGFyKCkgPT09ICctJykge1xyXG4gICAgICAgICAgICBzY25yLm5leHQoKTtcclxuICAgICAgICAgICAgdmFsdWUgKz0gYC0ke2dldERpZ2l0cyhzY25yKX1gO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdmFsdWUgKz0gZ2V0RGlnaXRzKHNjbnIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc2Nuci5jdXJyZW50Q2hhcigpID09PSBFT0YpIHtcclxuICAgICAgICAgICAgZW1pdEVycm9yKDYgLyogVU5URVJNSU5BVEVEX0NMT1NJTkdfQlJBQ0UgKi8sIGN1cnJlbnRQb3NpdGlvbigpLCAwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gcmVhZExpdGVyYWwoc2Nucikge1xyXG4gICAgICAgIHNraXBTcGFjZXMoc2Nucik7XHJcbiAgICAgICAgZWF0KHNjbnIsIGBcXCdgKTtcclxuICAgICAgICBsZXQgY2ggPSAnJztcclxuICAgICAgICBsZXQgbGl0ZXJhbCA9ICcnO1xyXG4gICAgICAgIGNvbnN0IGZuID0gKHgpID0+IHggIT09IExJVEVSQUxfREVMSU1JVEVSICYmIHggIT09IENIQVJfTEY7XHJcbiAgICAgICAgd2hpbGUgKChjaCA9IHRha2VDaGFyKHNjbnIsIGZuKSkpIHtcclxuICAgICAgICAgICAgaWYgKGNoID09PSAnXFxcXCcpIHtcclxuICAgICAgICAgICAgICAgIGxpdGVyYWwgKz0gcmVhZEVzY2FwZVNlcXVlbmNlKHNjbnIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGl0ZXJhbCArPSBjaDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBjdXJyZW50ID0gc2Nuci5jdXJyZW50Q2hhcigpO1xyXG4gICAgICAgIGlmIChjdXJyZW50ID09PSBDSEFSX0xGIHx8IGN1cnJlbnQgPT09IEVPRikge1xyXG4gICAgICAgICAgICBlbWl0RXJyb3IoMiAvKiBVTlRFUk1JTkFURURfU0lOR0xFX1FVT1RFX0lOX1BMQUNFSE9MREVSICovLCBjdXJyZW50UG9zaXRpb24oKSwgMCk7XHJcbiAgICAgICAgICAgIC8vIFRPRE86IElzIGl0IGNvcnJlY3QgcmVhbGx5P1xyXG4gICAgICAgICAgICBpZiAoY3VycmVudCA9PT0gQ0hBUl9MRikge1xyXG4gICAgICAgICAgICAgICAgc2Nuci5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICBlYXQoc2NuciwgYFxcJ2ApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBsaXRlcmFsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlYXQoc2NuciwgYFxcJ2ApO1xyXG4gICAgICAgIHJldHVybiBsaXRlcmFsO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gcmVhZEVzY2FwZVNlcXVlbmNlKHNjbnIpIHtcclxuICAgICAgICBjb25zdCBjaCA9IHNjbnIuY3VycmVudENoYXIoKTtcclxuICAgICAgICBzd2l0Y2ggKGNoKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ1xcXFwnOlxyXG4gICAgICAgICAgICBjYXNlIGBcXCdgOlxyXG4gICAgICAgICAgICAgICAgc2Nuci5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYFxcXFwke2NofWA7XHJcbiAgICAgICAgICAgIGNhc2UgJ3UnOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlYWRVbmljb2RlRXNjYXBlU2VxdWVuY2Uoc2NuciwgY2gsIDQpO1xyXG4gICAgICAgICAgICBjYXNlICdVJzpcclxuICAgICAgICAgICAgICAgIHJldHVybiByZWFkVW5pY29kZUVzY2FwZVNlcXVlbmNlKHNjbnIsIGNoLCA2KTtcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIGVtaXRFcnJvcigzIC8qIFVOS05PV05fRVNDQVBFX1NFUVVFTkNFICovLCBjdXJyZW50UG9zaXRpb24oKSwgMCwgY2gpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIHJlYWRVbmljb2RlRXNjYXBlU2VxdWVuY2Uoc2NuciwgdW5pY29kZSwgZGlnaXRzKSB7XHJcbiAgICAgICAgZWF0KHNjbnIsIHVuaWNvZGUpO1xyXG4gICAgICAgIGxldCBzZXF1ZW5jZSA9ICcnO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGlnaXRzOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgY2ggPSB0YWtlSGV4RGlnaXQoc2Nucik7XHJcbiAgICAgICAgICAgIGlmICghY2gpIHtcclxuICAgICAgICAgICAgICAgIGVtaXRFcnJvcig0IC8qIElOVkFMSURfVU5JQ09ERV9FU0NBUEVfU0VRVUVOQ0UgKi8sIGN1cnJlbnRQb3NpdGlvbigpLCAwLCBgXFxcXCR7dW5pY29kZX0ke3NlcXVlbmNlfSR7c2Nuci5jdXJyZW50Q2hhcigpfWApO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2VxdWVuY2UgKz0gY2g7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBgXFxcXCR7dW5pY29kZX0ke3NlcXVlbmNlfWA7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiByZWFkSW52YWxpZElkZW50aWZpZXIoc2Nucikge1xyXG4gICAgICAgIHNraXBTcGFjZXMoc2Nucik7XHJcbiAgICAgICAgbGV0IGNoID0gJyc7XHJcbiAgICAgICAgbGV0IGlkZW50aWZpZXJzID0gJyc7XHJcbiAgICAgICAgY29uc3QgY2xvc3VyZSA9IChjaCkgPT4gY2ggIT09IFwie1wiIC8qIEJyYWNlTGVmdCAqLyAmJlxyXG4gICAgICAgICAgICBjaCAhPT0gXCJ9XCIgLyogQnJhY2VSaWdodCAqLyAmJlxyXG4gICAgICAgICAgICBjaCAhPT0gQ0hBUl9TUCAmJlxyXG4gICAgICAgICAgICBjaCAhPT0gQ0hBUl9MRjtcclxuICAgICAgICB3aGlsZSAoKGNoID0gdGFrZUNoYXIoc2NuciwgY2xvc3VyZSkpKSB7XHJcbiAgICAgICAgICAgIGlkZW50aWZpZXJzICs9IGNoO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaWRlbnRpZmllcnM7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiByZWFkTGlua2VkTW9kaWZpZXIoc2Nucikge1xyXG4gICAgICAgIGxldCBjaCA9ICcnO1xyXG4gICAgICAgIGxldCBuYW1lID0gJyc7XHJcbiAgICAgICAgd2hpbGUgKChjaCA9IHRha2VJZGVudGlmaWVyQ2hhcihzY25yKSkpIHtcclxuICAgICAgICAgICAgbmFtZSArPSBjaDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5hbWU7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiByZWFkTGlua2VkUmVmZXIoc2Nucikge1xyXG4gICAgICAgIGNvbnN0IGZuID0gKGRldGVjdCA9IGZhbHNlLCBidWYpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgY2ggPSBzY25yLmN1cnJlbnRDaGFyKCk7XHJcbiAgICAgICAgICAgIGlmIChjaCA9PT0gXCJ7XCIgLyogQnJhY2VMZWZ0ICovIHx8XHJcbiAgICAgICAgICAgICAgICBjaCA9PT0gXCIlXCIgLyogTW9kdWxvICovIHx8XHJcbiAgICAgICAgICAgICAgICBjaCA9PT0gXCJAXCIgLyogTGlua2VkQWxpYXMgKi8gfHxcclxuICAgICAgICAgICAgICAgIGNoID09PSBcInxcIiAvKiBQaXBlICovIHx8XHJcbiAgICAgICAgICAgICAgICAhY2gpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBidWY7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoY2ggPT09IENIQVJfU1ApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBidWY7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoY2ggPT09IENIQVJfTEYpIHtcclxuICAgICAgICAgICAgICAgIGJ1ZiArPSBjaDtcclxuICAgICAgICAgICAgICAgIHNjbnIubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZuKGRldGVjdCwgYnVmKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGJ1ZiArPSBjaDtcclxuICAgICAgICAgICAgICAgIHNjbnIubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZuKHRydWUsIGJ1Zik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHJldHVybiBmbihmYWxzZSwgJycpO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gcmVhZFBsdXJhbChzY25yKSB7XHJcbiAgICAgICAgc2tpcFNwYWNlcyhzY25yKTtcclxuICAgICAgICBjb25zdCBwbHVyYWwgPSBlYXQoc2NuciwgXCJ8XCIgLyogUGlwZSAqLyk7XHJcbiAgICAgICAgc2tpcFNwYWNlcyhzY25yKTtcclxuICAgICAgICByZXR1cm4gcGx1cmFsO1xyXG4gICAgfVxyXG4gICAgLy8gVE9ETzogV2UgbmVlZCByZWZhY3RvcmluZyBvZiB0b2tlbiBwYXJzaW5nIC4uLlxyXG4gICAgZnVuY3Rpb24gcmVhZFRva2VuSW5QbGFjZWhvbGRlcihzY25yLCBjb250ZXh0KSB7XHJcbiAgICAgICAgbGV0IHRva2VuID0gbnVsbDtcclxuICAgICAgICBjb25zdCBjaCA9IHNjbnIuY3VycmVudENoYXIoKTtcclxuICAgICAgICBzd2l0Y2ggKGNoKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJ7XCIgLyogQnJhY2VMZWZ0ICovOlxyXG4gICAgICAgICAgICAgICAgaWYgKGNvbnRleHQuYnJhY2VOZXN0ID49IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBlbWl0RXJyb3IoOCAvKiBOT1RfQUxMT1dfTkVTVF9QTEFDRUhPTERFUiAqLywgY3VycmVudFBvc2l0aW9uKCksIDApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgc2Nuci5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICB0b2tlbiA9IGdldFRva2VuKGNvbnRleHQsIDIgLyogQnJhY2VMZWZ0ICovLCBcIntcIiAvKiBCcmFjZUxlZnQgKi8pO1xyXG4gICAgICAgICAgICAgICAgc2tpcFNwYWNlcyhzY25yKTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuYnJhY2VOZXN0Kys7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdG9rZW47XHJcbiAgICAgICAgICAgIGNhc2UgXCJ9XCIgLyogQnJhY2VSaWdodCAqLzpcclxuICAgICAgICAgICAgICAgIGlmIChjb250ZXh0LmJyYWNlTmVzdCA+IDAgJiZcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmN1cnJlbnRUeXBlID09PSAyIC8qIEJyYWNlTGVmdCAqLykge1xyXG4gICAgICAgICAgICAgICAgICAgIGVtaXRFcnJvcig3IC8qIEVNUFRZX1BMQUNFSE9MREVSICovLCBjdXJyZW50UG9zaXRpb24oKSwgMCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBzY25yLm5leHQoKTtcclxuICAgICAgICAgICAgICAgIHRva2VuID0gZ2V0VG9rZW4oY29udGV4dCwgMyAvKiBCcmFjZVJpZ2h0ICovLCBcIn1cIiAvKiBCcmFjZVJpZ2h0ICovKTtcclxuICAgICAgICAgICAgICAgIGNvbnRleHQuYnJhY2VOZXN0LS07XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmJyYWNlTmVzdCA+IDAgJiYgc2tpcFNwYWNlcyhzY25yKTtcclxuICAgICAgICAgICAgICAgIGlmIChjb250ZXh0LmluTGlua2VkICYmIGNvbnRleHQuYnJhY2VOZXN0ID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5pbkxpbmtlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRva2VuO1xyXG4gICAgICAgICAgICBjYXNlIFwiQFwiIC8qIExpbmtlZEFsaWFzICovOlxyXG4gICAgICAgICAgICAgICAgaWYgKGNvbnRleHQuYnJhY2VOZXN0ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGVtaXRFcnJvcig2IC8qIFVOVEVSTUlOQVRFRF9DTE9TSU5HX0JSQUNFICovLCBjdXJyZW50UG9zaXRpb24oKSwgMCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0b2tlbiA9IHJlYWRUb2tlbkluTGlua2VkKHNjbnIsIGNvbnRleHQpIHx8IGdldEVuZFRva2VuKGNvbnRleHQpO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5icmFjZU5lc3QgPSAwO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRva2VuO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgbGV0IHZhbGlkTmFtZWRJZGVudGlmaWVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGxldCB2YWxpZExpc3RJZGVudGlmaWVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGxldCB2YWxpZExpdGVyYWwgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgaWYgKGlzUGx1cmFsU3RhcnQoc2NucikpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY29udGV4dC5icmFjZU5lc3QgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVtaXRFcnJvcig2IC8qIFVOVEVSTUlOQVRFRF9DTE9TSU5HX0JSQUNFICovLCBjdXJyZW50UG9zaXRpb24oKSwgMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRva2VuID0gZ2V0VG9rZW4oY29udGV4dCwgMSAvKiBQaXBlICovLCByZWFkUGx1cmFsKHNjbnIpKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyByZXNldFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuYnJhY2VOZXN0ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmluTGlua2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRva2VuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGNvbnRleHQuYnJhY2VOZXN0ID4gMCAmJlxyXG4gICAgICAgICAgICAgICAgICAgIChjb250ZXh0LmN1cnJlbnRUeXBlID09PSA1IC8qIE5hbWVkICovIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRleHQuY3VycmVudFR5cGUgPT09IDYgLyogTGlzdCAqLyB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmN1cnJlbnRUeXBlID09PSA3IC8qIExpdGVyYWwgKi8pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZW1pdEVycm9yKDYgLyogVU5URVJNSU5BVEVEX0NMT1NJTkdfQlJBQ0UgKi8sIGN1cnJlbnRQb3NpdGlvbigpLCAwKTtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmJyYWNlTmVzdCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlYWRUb2tlbihzY25yLCBjb250ZXh0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICgodmFsaWROYW1lZElkZW50aWZpZXIgPSBpc05hbWVkSWRlbnRpZmllclN0YXJ0KHNjbnIsIGNvbnRleHQpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRva2VuID0gZ2V0VG9rZW4oY29udGV4dCwgNSAvKiBOYW1lZCAqLywgcmVhZE5hbWVkSWRlbnRpZmllcihzY25yKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2tpcFNwYWNlcyhzY25yKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdG9rZW47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoKHZhbGlkTGlzdElkZW50aWZpZXIgPSBpc0xpc3RJZGVudGlmaWVyU3RhcnQoc2NuciwgY29udGV4dCkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9rZW4gPSBnZXRUb2tlbihjb250ZXh0LCA2IC8qIExpc3QgKi8sIHJlYWRMaXN0SWRlbnRpZmllcihzY25yKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2tpcFNwYWNlcyhzY25yKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdG9rZW47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoKHZhbGlkTGl0ZXJhbCA9IGlzTGl0ZXJhbFN0YXJ0KHNjbnIsIGNvbnRleHQpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRva2VuID0gZ2V0VG9rZW4oY29udGV4dCwgNyAvKiBMaXRlcmFsICovLCByZWFkTGl0ZXJhbChzY25yKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2tpcFNwYWNlcyhzY25yKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdG9rZW47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoIXZhbGlkTmFtZWRJZGVudGlmaWVyICYmICF2YWxpZExpc3RJZGVudGlmaWVyICYmICF2YWxpZExpdGVyYWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBUT0RPOiB3ZSBzaG91bGQgYmUgcmUtZGVzaWduZWQgaW52YWxpZCBjYXNlcywgd2hlbiB3ZSB3aWxsIGV4dGVuZCBtZXNzYWdlIHN5bnRheCBuZWFyIHRoZSBmdXR1cmUgLi4uXHJcbiAgICAgICAgICAgICAgICAgICAgdG9rZW4gPSBnZXRUb2tlbihjb250ZXh0LCAxMyAvKiBJbnZhbGlkUGxhY2UgKi8sIHJlYWRJbnZhbGlkSWRlbnRpZmllcihzY25yKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZW1pdEVycm9yKDEgLyogSU5WQUxJRF9UT0tFTl9JTl9QTEFDRUhPTERFUiAqLywgY3VycmVudFBvc2l0aW9uKCksIDAsIHRva2VuLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICBza2lwU3BhY2VzKHNjbnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0b2tlbjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdG9rZW47XHJcbiAgICB9XHJcbiAgICAvLyBUT0RPOiBXZSBuZWVkIHJlZmFjdG9yaW5nIG9mIHRva2VuIHBhcnNpbmcgLi4uXHJcbiAgICBmdW5jdGlvbiByZWFkVG9rZW5JbkxpbmtlZChzY25yLCBjb250ZXh0KSB7XHJcbiAgICAgICAgY29uc3QgeyBjdXJyZW50VHlwZSB9ID0gY29udGV4dDtcclxuICAgICAgICBsZXQgdG9rZW4gPSBudWxsO1xyXG4gICAgICAgIGNvbnN0IGNoID0gc2Nuci5jdXJyZW50Q2hhcigpO1xyXG4gICAgICAgIGlmICgoY3VycmVudFR5cGUgPT09IDggLyogTGlua2VkQWxpYXMgKi8gfHxcclxuICAgICAgICAgICAgY3VycmVudFR5cGUgPT09IDkgLyogTGlua2VkRG90ICovIHx8XHJcbiAgICAgICAgICAgIGN1cnJlbnRUeXBlID09PSAxMiAvKiBMaW5rZWRNb2RpZmllciAqLyB8fFxyXG4gICAgICAgICAgICBjdXJyZW50VHlwZSA9PT0gMTAgLyogTGlua2VkRGVsaW1pdGVyICovKSAmJlxyXG4gICAgICAgICAgICAoY2ggPT09IENIQVJfTEYgfHwgY2ggPT09IENIQVJfU1ApKSB7XHJcbiAgICAgICAgICAgIGVtaXRFcnJvcig5IC8qIElOVkFMSURfTElOS0VEX0ZPUk1BVCAqLywgY3VycmVudFBvc2l0aW9uKCksIDApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzd2l0Y2ggKGNoKSB7XHJcbiAgICAgICAgICAgIGNhc2UgXCJAXCIgLyogTGlua2VkQWxpYXMgKi86XHJcbiAgICAgICAgICAgICAgICBzY25yLm5leHQoKTtcclxuICAgICAgICAgICAgICAgIHRva2VuID0gZ2V0VG9rZW4oY29udGV4dCwgOCAvKiBMaW5rZWRBbGlhcyAqLywgXCJAXCIgLyogTGlua2VkQWxpYXMgKi8pO1xyXG4gICAgICAgICAgICAgICAgY29udGV4dC5pbkxpbmtlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdG9rZW47XHJcbiAgICAgICAgICAgIGNhc2UgXCIuXCIgLyogTGlua2VkRG90ICovOlxyXG4gICAgICAgICAgICAgICAgc2tpcFNwYWNlcyhzY25yKTtcclxuICAgICAgICAgICAgICAgIHNjbnIubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGdldFRva2VuKGNvbnRleHQsIDkgLyogTGlua2VkRG90ICovLCBcIi5cIiAvKiBMaW5rZWREb3QgKi8pO1xyXG4gICAgICAgICAgICBjYXNlIFwiOlwiIC8qIExpbmtlZERlbGltaXRlciAqLzpcclxuICAgICAgICAgICAgICAgIHNraXBTcGFjZXMoc2Nucik7XHJcbiAgICAgICAgICAgICAgICBzY25yLm5leHQoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBnZXRUb2tlbihjb250ZXh0LCAxMCAvKiBMaW5rZWREZWxpbWl0ZXIgKi8sIFwiOlwiIC8qIExpbmtlZERlbGltaXRlciAqLyk7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNQbHVyYWxTdGFydChzY25yKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRva2VuID0gZ2V0VG9rZW4oY29udGV4dCwgMSAvKiBQaXBlICovLCByZWFkUGx1cmFsKHNjbnIpKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyByZXNldFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuYnJhY2VOZXN0ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmluTGlua2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRva2VuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGlzTGlua2VkRG90U3RhcnQoc2NuciwgY29udGV4dCkgfHxcclxuICAgICAgICAgICAgICAgICAgICBpc0xpbmtlZERlbGltaXRlclN0YXJ0KHNjbnIsIGNvbnRleHQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2tpcFNwYWNlcyhzY25yKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVhZFRva2VuSW5MaW5rZWQoc2NuciwgY29udGV4dCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNMaW5rZWRNb2RpZmllclN0YXJ0KHNjbnIsIGNvbnRleHQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2tpcFNwYWNlcyhzY25yKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ2V0VG9rZW4oY29udGV4dCwgMTIgLyogTGlua2VkTW9kaWZpZXIgKi8sIHJlYWRMaW5rZWRNb2RpZmllcihzY25yKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNMaW5rZWRSZWZlclN0YXJ0KHNjbnIsIGNvbnRleHQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2tpcFNwYWNlcyhzY25yKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2ggPT09IFwie1wiIC8qIEJyYWNlTGVmdCAqLykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzY2FuIHRoZSBwbGFjZWhvbGRlclxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVhZFRva2VuSW5QbGFjZWhvbGRlcihzY25yLCBjb250ZXh0KSB8fCB0b2tlbjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXRUb2tlbihjb250ZXh0LCAxMSAvKiBMaW5rZWRLZXkgKi8sIHJlYWRMaW5rZWRSZWZlcihzY25yKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRUeXBlID09PSA4IC8qIExpbmtlZEFsaWFzICovKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZW1pdEVycm9yKDkgLyogSU5WQUxJRF9MSU5LRURfRk9STUFUICovLCBjdXJyZW50UG9zaXRpb24oKSwgMCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmJyYWNlTmVzdCA9IDA7XHJcbiAgICAgICAgICAgICAgICBjb250ZXh0LmluTGlua2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVhZFRva2VuKHNjbnIsIGNvbnRleHQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIFRPRE86IFdlIG5lZWQgcmVmYWN0b3Jpbmcgb2YgdG9rZW4gcGFyc2luZyAuLi5cclxuICAgIGZ1bmN0aW9uIHJlYWRUb2tlbihzY25yLCBjb250ZXh0KSB7XHJcbiAgICAgICAgbGV0IHRva2VuID0geyB0eXBlOiAxNCAvKiBFT0YgKi8gfTtcclxuICAgICAgICBpZiAoY29udGV4dC5icmFjZU5lc3QgPiAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZWFkVG9rZW5JblBsYWNlaG9sZGVyKHNjbnIsIGNvbnRleHQpIHx8IGdldEVuZFRva2VuKGNvbnRleHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY29udGV4dC5pbkxpbmtlZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVhZFRva2VuSW5MaW5rZWQoc2NuciwgY29udGV4dCkgfHwgZ2V0RW5kVG9rZW4oY29udGV4dCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGNoID0gc2Nuci5jdXJyZW50Q2hhcigpO1xyXG4gICAgICAgIHN3aXRjaCAoY2gpIHtcclxuICAgICAgICAgICAgY2FzZSBcIntcIiAvKiBCcmFjZUxlZnQgKi86XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVhZFRva2VuSW5QbGFjZWhvbGRlcihzY25yLCBjb250ZXh0KSB8fCBnZXRFbmRUb2tlbihjb250ZXh0KTtcclxuICAgICAgICAgICAgY2FzZSBcIn1cIiAvKiBCcmFjZVJpZ2h0ICovOlxyXG4gICAgICAgICAgICAgICAgZW1pdEVycm9yKDUgLyogVU5CQUxBTkNFRF9DTE9TSU5HX0JSQUNFICovLCBjdXJyZW50UG9zaXRpb24oKSwgMCk7XHJcbiAgICAgICAgICAgICAgICBzY25yLm5leHQoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBnZXRUb2tlbihjb250ZXh0LCAzIC8qIEJyYWNlUmlnaHQgKi8sIFwifVwiIC8qIEJyYWNlUmlnaHQgKi8pO1xyXG4gICAgICAgICAgICBjYXNlIFwiQFwiIC8qIExpbmtlZEFsaWFzICovOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlYWRUb2tlbkluTGlua2VkKHNjbnIsIGNvbnRleHQpIHx8IGdldEVuZFRva2VuKGNvbnRleHQpO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgaWYgKGlzUGx1cmFsU3RhcnQoc2NucikpIHtcclxuICAgICAgICAgICAgICAgICAgICB0b2tlbiA9IGdldFRva2VuKGNvbnRleHQsIDEgLyogUGlwZSAqLywgcmVhZFBsdXJhbChzY25yKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVzZXRcclxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmJyYWNlTmVzdCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5pbkxpbmtlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0b2tlbjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChpc1RleHRTdGFydChzY25yKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBnZXRUb2tlbihjb250ZXh0LCAwIC8qIFRleHQgKi8sIHJlYWRUZXh0KHNjbnIpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChjaCA9PT0gXCIlXCIgLyogTW9kdWxvICovKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2Nuci5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldFRva2VuKGNvbnRleHQsIDQgLyogTW9kdWxvICovLCBcIiVcIiAvKiBNb2R1bG8gKi8pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0b2tlbjtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIG5leHRUb2tlbigpIHtcclxuICAgICAgICBjb25zdCB7IGN1cnJlbnRUeXBlLCBvZmZzZXQsIHN0YXJ0TG9jLCBlbmRMb2MgfSA9IF9jb250ZXh0O1xyXG4gICAgICAgIF9jb250ZXh0Lmxhc3RUeXBlID0gY3VycmVudFR5cGU7XHJcbiAgICAgICAgX2NvbnRleHQubGFzdE9mZnNldCA9IG9mZnNldDtcclxuICAgICAgICBfY29udGV4dC5sYXN0U3RhcnRMb2MgPSBzdGFydExvYztcclxuICAgICAgICBfY29udGV4dC5sYXN0RW5kTG9jID0gZW5kTG9jO1xyXG4gICAgICAgIF9jb250ZXh0Lm9mZnNldCA9IGN1cnJlbnRPZmZzZXQoKTtcclxuICAgICAgICBfY29udGV4dC5zdGFydExvYyA9IGN1cnJlbnRQb3NpdGlvbigpO1xyXG4gICAgICAgIGlmIChfc2Nuci5jdXJyZW50Q2hhcigpID09PSBFT0YpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGdldFRva2VuKF9jb250ZXh0LCAxNCAvKiBFT0YgKi8pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVhZFRva2VuKF9zY25yLCBfY29udGV4dCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIG5leHRUb2tlbixcclxuICAgICAgICBjdXJyZW50T2Zmc2V0LFxyXG4gICAgICAgIGN1cnJlbnRQb3NpdGlvbixcclxuICAgICAgICBjb250ZXh0XHJcbiAgICB9O1xyXG59XG5cbmNvbnN0IEVSUk9SX0RPTUFJTiA9ICdwYXJzZXInO1xyXG4vLyBCYWNrc2xhc2ggYmFja3NsYXNoLCBiYWNrc2xhc2ggcXVvdGUsIHVISEhILCBVSEhISEhILlxyXG5jb25zdCBLTk9XTl9FU0NBUEVTID0gLyg/OlxcXFxcXFxcfFxcXFwnfFxcXFx1KFswLTlhLWZBLUZdezR9KXxcXFxcVShbMC05YS1mQS1GXXs2fSkpL2c7XHJcbmZ1bmN0aW9uIGZyb21Fc2NhcGVTZXF1ZW5jZShtYXRjaCwgY29kZVBvaW50NCwgY29kZVBvaW50Nikge1xyXG4gICAgc3dpdGNoIChtYXRjaCkge1xyXG4gICAgICAgIGNhc2UgYFxcXFxcXFxcYDpcclxuICAgICAgICAgICAgcmV0dXJuIGBcXFxcYDtcclxuICAgICAgICBjYXNlIGBcXFxcXFwnYDpcclxuICAgICAgICAgICAgcmV0dXJuIGBcXCdgO1xyXG4gICAgICAgIGRlZmF1bHQ6IHtcclxuICAgICAgICAgICAgY29uc3QgY29kZVBvaW50ID0gcGFyc2VJbnQoY29kZVBvaW50NCB8fCBjb2RlUG9pbnQ2LCAxNik7XHJcbiAgICAgICAgICAgIGlmIChjb2RlUG9pbnQgPD0gMHhkN2ZmIHx8IGNvZGVQb2ludCA+PSAweGUwMDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBTdHJpbmcuZnJvbUNvZGVQb2ludChjb2RlUG9pbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGludmFsaWQgLi4uXHJcbiAgICAgICAgICAgIC8vIFJlcGxhY2UgdGhlbSB3aXRoIFUrRkZGRCBSRVBMQUNFTUVOVCBDSEFSQUNURVIuXHJcbiAgICAgICAgICAgIHJldHVybiAn77+9JztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gY3JlYXRlUGFyc2VyKG9wdGlvbnMgPSB7fSkge1xyXG4gICAgY29uc3QgbG9jYXRpb24gPSBvcHRpb25zLmxvY2F0aW9uICE9PSBmYWxzZTtcclxuICAgIGNvbnN0IHsgb25FcnJvciB9ID0gb3B0aW9ucztcclxuICAgIGZ1bmN0aW9uIGVtaXRFcnJvcih0b2tlbnplciwgY29kZSwgc3RhcnQsIG9mZnNldCwgLi4uYXJncykge1xyXG4gICAgICAgIGNvbnN0IGVuZCA9IHRva2VuemVyLmN1cnJlbnRQb3NpdGlvbigpO1xyXG4gICAgICAgIGVuZC5vZmZzZXQgKz0gb2Zmc2V0O1xyXG4gICAgICAgIGVuZC5jb2x1bW4gKz0gb2Zmc2V0O1xyXG4gICAgICAgIGlmIChvbkVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxvYyA9IGNyZWF0ZUxvY2F0aW9uKHN0YXJ0LCBlbmQpO1xyXG4gICAgICAgICAgICBjb25zdCBlcnIgPSBjcmVhdGVDb21waWxlRXJyb3IoY29kZSwgbG9jLCB7XHJcbiAgICAgICAgICAgICAgICBkb21haW46IEVSUk9SX0RPTUFJTixcclxuICAgICAgICAgICAgICAgIGFyZ3NcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIG9uRXJyb3IoZXJyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBzdGFydE5vZGUodHlwZSwgb2Zmc2V0LCBsb2MpIHtcclxuICAgICAgICBjb25zdCBub2RlID0ge1xyXG4gICAgICAgICAgICB0eXBlLFxyXG4gICAgICAgICAgICBzdGFydDogb2Zmc2V0LFxyXG4gICAgICAgICAgICBlbmQ6IG9mZnNldFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYgKGxvY2F0aW9uKSB7XHJcbiAgICAgICAgICAgIG5vZGUubG9jID0geyBzdGFydDogbG9jLCBlbmQ6IGxvYyB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbm9kZTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGVuZE5vZGUobm9kZSwgb2Zmc2V0LCBwb3MsIHR5cGUpIHtcclxuICAgICAgICBub2RlLmVuZCA9IG9mZnNldDtcclxuICAgICAgICBpZiAodHlwZSkge1xyXG4gICAgICAgICAgICBub2RlLnR5cGUgPSB0eXBlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobG9jYXRpb24gJiYgbm9kZS5sb2MpIHtcclxuICAgICAgICAgICAgbm9kZS5sb2MuZW5kID0gcG9zO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIHBhcnNlVGV4dCh0b2tlbml6ZXIsIHZhbHVlKSB7XHJcbiAgICAgICAgY29uc3QgY29udGV4dCA9IHRva2VuaXplci5jb250ZXh0KCk7XHJcbiAgICAgICAgY29uc3Qgbm9kZSA9IHN0YXJ0Tm9kZSgzIC8qIFRleHQgKi8sIGNvbnRleHQub2Zmc2V0LCBjb250ZXh0LnN0YXJ0TG9jKTtcclxuICAgICAgICBub2RlLnZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgZW5kTm9kZShub2RlLCB0b2tlbml6ZXIuY3VycmVudE9mZnNldCgpLCB0b2tlbml6ZXIuY3VycmVudFBvc2l0aW9uKCkpO1xyXG4gICAgICAgIHJldHVybiBub2RlO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gcGFyc2VMaXN0KHRva2VuaXplciwgaW5kZXgpIHtcclxuICAgICAgICBjb25zdCBjb250ZXh0ID0gdG9rZW5pemVyLmNvbnRleHQoKTtcclxuICAgICAgICBjb25zdCB7IGxhc3RPZmZzZXQ6IG9mZnNldCwgbGFzdFN0YXJ0TG9jOiBsb2MgfSA9IGNvbnRleHQ7IC8vIGdldCBicmFjZSBsZWZ0IGxvY1xyXG4gICAgICAgIGNvbnN0IG5vZGUgPSBzdGFydE5vZGUoNSAvKiBMaXN0ICovLCBvZmZzZXQsIGxvYyk7XHJcbiAgICAgICAgbm9kZS5pbmRleCA9IHBhcnNlSW50KGluZGV4LCAxMCk7XHJcbiAgICAgICAgdG9rZW5pemVyLm5leHRUb2tlbigpOyAvLyBza2lwIGJyYWNoIHJpZ2h0XHJcbiAgICAgICAgZW5kTm9kZShub2RlLCB0b2tlbml6ZXIuY3VycmVudE9mZnNldCgpLCB0b2tlbml6ZXIuY3VycmVudFBvc2l0aW9uKCkpO1xyXG4gICAgICAgIHJldHVybiBub2RlO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gcGFyc2VOYW1lZCh0b2tlbml6ZXIsIGtleSkge1xyXG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSB0b2tlbml6ZXIuY29udGV4dCgpO1xyXG4gICAgICAgIGNvbnN0IHsgbGFzdE9mZnNldDogb2Zmc2V0LCBsYXN0U3RhcnRMb2M6IGxvYyB9ID0gY29udGV4dDsgLy8gZ2V0IGJyYWNlIGxlZnQgbG9jXHJcbiAgICAgICAgY29uc3Qgbm9kZSA9IHN0YXJ0Tm9kZSg0IC8qIE5hbWVkICovLCBvZmZzZXQsIGxvYyk7XHJcbiAgICAgICAgbm9kZS5rZXkgPSBrZXk7XHJcbiAgICAgICAgdG9rZW5pemVyLm5leHRUb2tlbigpOyAvLyBza2lwIGJyYWNoIHJpZ2h0XHJcbiAgICAgICAgZW5kTm9kZShub2RlLCB0b2tlbml6ZXIuY3VycmVudE9mZnNldCgpLCB0b2tlbml6ZXIuY3VycmVudFBvc2l0aW9uKCkpO1xyXG4gICAgICAgIHJldHVybiBub2RlO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gcGFyc2VMaXRlcmFsKHRva2VuaXplciwgdmFsdWUpIHtcclxuICAgICAgICBjb25zdCBjb250ZXh0ID0gdG9rZW5pemVyLmNvbnRleHQoKTtcclxuICAgICAgICBjb25zdCB7IGxhc3RPZmZzZXQ6IG9mZnNldCwgbGFzdFN0YXJ0TG9jOiBsb2MgfSA9IGNvbnRleHQ7IC8vIGdldCBicmFjZSBsZWZ0IGxvY1xyXG4gICAgICAgIGNvbnN0IG5vZGUgPSBzdGFydE5vZGUoOSAvKiBMaXRlcmFsICovLCBvZmZzZXQsIGxvYyk7XHJcbiAgICAgICAgbm9kZS52YWx1ZSA9IHZhbHVlLnJlcGxhY2UoS05PV05fRVNDQVBFUywgZnJvbUVzY2FwZVNlcXVlbmNlKTtcclxuICAgICAgICB0b2tlbml6ZXIubmV4dFRva2VuKCk7IC8vIHNraXAgYnJhY2ggcmlnaHRcclxuICAgICAgICBlbmROb2RlKG5vZGUsIHRva2VuaXplci5jdXJyZW50T2Zmc2V0KCksIHRva2VuaXplci5jdXJyZW50UG9zaXRpb24oKSk7XHJcbiAgICAgICAgcmV0dXJuIG5vZGU7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBwYXJzZUxpbmtlZE1vZGlmaWVyKHRva2VuaXplcikge1xyXG4gICAgICAgIGNvbnN0IHRva2VuID0gdG9rZW5pemVyLm5leHRUb2tlbigpO1xyXG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSB0b2tlbml6ZXIuY29udGV4dCgpO1xyXG4gICAgICAgIGNvbnN0IHsgbGFzdE9mZnNldDogb2Zmc2V0LCBsYXN0U3RhcnRMb2M6IGxvYyB9ID0gY29udGV4dDsgLy8gZ2V0IGxpbmtlZCBkb3QgbG9jXHJcbiAgICAgICAgY29uc3Qgbm9kZSA9IHN0YXJ0Tm9kZSg4IC8qIExpbmtlZE1vZGlmaWVyICovLCBvZmZzZXQsIGxvYyk7XHJcbiAgICAgICAgaWYgKHRva2VuLnR5cGUgIT09IDEyIC8qIExpbmtlZE1vZGlmaWVyICovKSB7XHJcbiAgICAgICAgICAgIC8vIGVtcHR5IG1vZGlmaWVyXHJcbiAgICAgICAgICAgIGVtaXRFcnJvcih0b2tlbml6ZXIsIDExIC8qIFVORVhQRUNURURfRU1QVFlfTElOS0VEX01PRElGSUVSICovLCBjb250ZXh0Lmxhc3RTdGFydExvYywgMCk7XHJcbiAgICAgICAgICAgIG5vZGUudmFsdWUgPSAnJztcclxuICAgICAgICAgICAgZW5kTm9kZShub2RlLCBvZmZzZXQsIGxvYyk7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBuZXh0Q29uc3VtZVRva2VuOiB0b2tlbixcclxuICAgICAgICAgICAgICAgIG5vZGVcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gY2hlY2sgdG9rZW5cclxuICAgICAgICBpZiAodG9rZW4udmFsdWUgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBlbWl0RXJyb3IodG9rZW5pemVyLCAxMyAvKiBVTkVYUEVDVEVEX0xFWElDQUxfQU5BTFlTSVMgKi8sIGNvbnRleHQubGFzdFN0YXJ0TG9jLCAwLCBnZXRUb2tlbkNhcHRpb24odG9rZW4pKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbm9kZS52YWx1ZSA9IHRva2VuLnZhbHVlIHx8ICcnO1xyXG4gICAgICAgIGVuZE5vZGUobm9kZSwgdG9rZW5pemVyLmN1cnJlbnRPZmZzZXQoKSwgdG9rZW5pemVyLmN1cnJlbnRQb3NpdGlvbigpKTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBub2RlXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIHBhcnNlTGlua2VkS2V5KHRva2VuaXplciwgdmFsdWUpIHtcclxuICAgICAgICBjb25zdCBjb250ZXh0ID0gdG9rZW5pemVyLmNvbnRleHQoKTtcclxuICAgICAgICBjb25zdCBub2RlID0gc3RhcnROb2RlKDcgLyogTGlua2VkS2V5ICovLCBjb250ZXh0Lm9mZnNldCwgY29udGV4dC5zdGFydExvYyk7XHJcbiAgICAgICAgbm9kZS52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIGVuZE5vZGUobm9kZSwgdG9rZW5pemVyLmN1cnJlbnRPZmZzZXQoKSwgdG9rZW5pemVyLmN1cnJlbnRQb3NpdGlvbigpKTtcclxuICAgICAgICByZXR1cm4gbm9kZTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIHBhcnNlTGlua2VkKHRva2VuaXplcikge1xyXG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSB0b2tlbml6ZXIuY29udGV4dCgpO1xyXG4gICAgICAgIGNvbnN0IGxpbmtlZE5vZGUgPSBzdGFydE5vZGUoNiAvKiBMaW5rZWQgKi8sIGNvbnRleHQub2Zmc2V0LCBjb250ZXh0LnN0YXJ0TG9jKTtcclxuICAgICAgICBsZXQgdG9rZW4gPSB0b2tlbml6ZXIubmV4dFRva2VuKCk7XHJcbiAgICAgICAgaWYgKHRva2VuLnR5cGUgPT09IDkgLyogTGlua2VkRG90ICovKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhcnNlZCA9IHBhcnNlTGlua2VkTW9kaWZpZXIodG9rZW5pemVyKTtcclxuICAgICAgICAgICAgbGlua2VkTm9kZS5tb2RpZmllciA9IHBhcnNlZC5ub2RlO1xyXG4gICAgICAgICAgICB0b2tlbiA9IHBhcnNlZC5uZXh0Q29uc3VtZVRva2VuIHx8IHRva2VuaXplci5uZXh0VG9rZW4oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gYXNzZXQgY2hlY2sgdG9rZW5cclxuICAgICAgICBpZiAodG9rZW4udHlwZSAhPT0gMTAgLyogTGlua2VkRGVsaW1pdGVyICovKSB7XHJcbiAgICAgICAgICAgIGVtaXRFcnJvcih0b2tlbml6ZXIsIDEzIC8qIFVORVhQRUNURURfTEVYSUNBTF9BTkFMWVNJUyAqLywgY29udGV4dC5sYXN0U3RhcnRMb2MsIDAsIGdldFRva2VuQ2FwdGlvbih0b2tlbikpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0b2tlbiA9IHRva2VuaXplci5uZXh0VG9rZW4oKTtcclxuICAgICAgICAvLyBza2lwIGJyYWNlIGxlZnRcclxuICAgICAgICBpZiAodG9rZW4udHlwZSA9PT0gMiAvKiBCcmFjZUxlZnQgKi8pIHtcclxuICAgICAgICAgICAgdG9rZW4gPSB0b2tlbml6ZXIubmV4dFRva2VuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN3aXRjaCAodG9rZW4udHlwZSkge1xyXG4gICAgICAgICAgICBjYXNlIDExIC8qIExpbmtlZEtleSAqLzpcclxuICAgICAgICAgICAgICAgIGlmICh0b2tlbi52YWx1ZSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZW1pdEVycm9yKHRva2VuaXplciwgMTMgLyogVU5FWFBFQ1RFRF9MRVhJQ0FMX0FOQUxZU0lTICovLCBjb250ZXh0Lmxhc3RTdGFydExvYywgMCwgZ2V0VG9rZW5DYXB0aW9uKHRva2VuKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsaW5rZWROb2RlLmtleSA9IHBhcnNlTGlua2VkS2V5KHRva2VuaXplciwgdG9rZW4udmFsdWUgfHwgJycpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgNSAvKiBOYW1lZCAqLzpcclxuICAgICAgICAgICAgICAgIGlmICh0b2tlbi52YWx1ZSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZW1pdEVycm9yKHRva2VuaXplciwgMTMgLyogVU5FWFBFQ1RFRF9MRVhJQ0FMX0FOQUxZU0lTICovLCBjb250ZXh0Lmxhc3RTdGFydExvYywgMCwgZ2V0VG9rZW5DYXB0aW9uKHRva2VuKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsaW5rZWROb2RlLmtleSA9IHBhcnNlTmFtZWQodG9rZW5pemVyLCB0b2tlbi52YWx1ZSB8fCAnJyk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSA2IC8qIExpc3QgKi86XHJcbiAgICAgICAgICAgICAgICBpZiAodG9rZW4udmFsdWUgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGVtaXRFcnJvcih0b2tlbml6ZXIsIDEzIC8qIFVORVhQRUNURURfTEVYSUNBTF9BTkFMWVNJUyAqLywgY29udGV4dC5sYXN0U3RhcnRMb2MsIDAsIGdldFRva2VuQ2FwdGlvbih0b2tlbikpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbGlua2VkTm9kZS5rZXkgPSBwYXJzZUxpc3QodG9rZW5pemVyLCB0b2tlbi52YWx1ZSB8fCAnJyk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSA3IC8qIExpdGVyYWwgKi86XHJcbiAgICAgICAgICAgICAgICBpZiAodG9rZW4udmFsdWUgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGVtaXRFcnJvcih0b2tlbml6ZXIsIDEzIC8qIFVORVhQRUNURURfTEVYSUNBTF9BTkFMWVNJUyAqLywgY29udGV4dC5sYXN0U3RhcnRMb2MsIDAsIGdldFRva2VuQ2FwdGlvbih0b2tlbikpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbGlua2VkTm9kZS5rZXkgPSBwYXJzZUxpdGVyYWwodG9rZW5pemVyLCB0b2tlbi52YWx1ZSB8fCAnJyk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIC8vIGVtcHR5IGtleVxyXG4gICAgICAgICAgICAgICAgZW1pdEVycm9yKHRva2VuaXplciwgMTIgLyogVU5FWFBFQ1RFRF9FTVBUWV9MSU5LRURfS0VZICovLCBjb250ZXh0Lmxhc3RTdGFydExvYywgMCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBuZXh0Q29udGV4dCA9IHRva2VuaXplci5jb250ZXh0KCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlbXB0eUxpbmtlZEtleU5vZGUgPSBzdGFydE5vZGUoNyAvKiBMaW5rZWRLZXkgKi8sIG5leHRDb250ZXh0Lm9mZnNldCwgbmV4dENvbnRleHQuc3RhcnRMb2MpO1xyXG4gICAgICAgICAgICAgICAgZW1wdHlMaW5rZWRLZXlOb2RlLnZhbHVlID0gJyc7XHJcbiAgICAgICAgICAgICAgICBlbmROb2RlKGVtcHR5TGlua2VkS2V5Tm9kZSwgbmV4dENvbnRleHQub2Zmc2V0LCBuZXh0Q29udGV4dC5zdGFydExvYyk7XHJcbiAgICAgICAgICAgICAgICBsaW5rZWROb2RlLmtleSA9IGVtcHR5TGlua2VkS2V5Tm9kZTtcclxuICAgICAgICAgICAgICAgIGVuZE5vZGUobGlua2VkTm9kZSwgbmV4dENvbnRleHQub2Zmc2V0LCBuZXh0Q29udGV4dC5zdGFydExvYyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIG5leHRDb25zdW1lVG9rZW46IHRva2VuLFxyXG4gICAgICAgICAgICAgICAgICAgIG5vZGU6IGxpbmtlZE5vZGVcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVuZE5vZGUobGlua2VkTm9kZSwgdG9rZW5pemVyLmN1cnJlbnRPZmZzZXQoKSwgdG9rZW5pemVyLmN1cnJlbnRQb3NpdGlvbigpKTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBub2RlOiBsaW5rZWROb2RlXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIHBhcnNlTWVzc2FnZSh0b2tlbml6ZXIpIHtcclxuICAgICAgICBjb25zdCBjb250ZXh0ID0gdG9rZW5pemVyLmNvbnRleHQoKTtcclxuICAgICAgICBjb25zdCBzdGFydE9mZnNldCA9IGNvbnRleHQuY3VycmVudFR5cGUgPT09IDEgLyogUGlwZSAqL1xyXG4gICAgICAgICAgICA/IHRva2VuaXplci5jdXJyZW50T2Zmc2V0KClcclxuICAgICAgICAgICAgOiBjb250ZXh0Lm9mZnNldDtcclxuICAgICAgICBjb25zdCBzdGFydExvYyA9IGNvbnRleHQuY3VycmVudFR5cGUgPT09IDEgLyogUGlwZSAqL1xyXG4gICAgICAgICAgICA/IGNvbnRleHQuZW5kTG9jXHJcbiAgICAgICAgICAgIDogY29udGV4dC5zdGFydExvYztcclxuICAgICAgICBjb25zdCBub2RlID0gc3RhcnROb2RlKDIgLyogTWVzc2FnZSAqLywgc3RhcnRPZmZzZXQsIHN0YXJ0TG9jKTtcclxuICAgICAgICBub2RlLml0ZW1zID0gW107XHJcbiAgICAgICAgbGV0IG5leHRUb2tlbiA9IG51bGw7XHJcbiAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICBjb25zdCB0b2tlbiA9IG5leHRUb2tlbiB8fCB0b2tlbml6ZXIubmV4dFRva2VuKCk7XHJcbiAgICAgICAgICAgIG5leHRUb2tlbiA9IG51bGw7XHJcbiAgICAgICAgICAgIHN3aXRjaCAodG9rZW4udHlwZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAwIC8qIFRleHQgKi86XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRva2VuLnZhbHVlID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW1pdEVycm9yKHRva2VuaXplciwgMTMgLyogVU5FWFBFQ1RFRF9MRVhJQ0FMX0FOQUxZU0lTICovLCBjb250ZXh0Lmxhc3RTdGFydExvYywgMCwgZ2V0VG9rZW5DYXB0aW9uKHRva2VuKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIG5vZGUuaXRlbXMucHVzaChwYXJzZVRleHQodG9rZW5pemVyLCB0b2tlbi52YWx1ZSB8fCAnJykpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA2IC8qIExpc3QgKi86XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRva2VuLnZhbHVlID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW1pdEVycm9yKHRva2VuaXplciwgMTMgLyogVU5FWFBFQ1RFRF9MRVhJQ0FMX0FOQUxZU0lTICovLCBjb250ZXh0Lmxhc3RTdGFydExvYywgMCwgZ2V0VG9rZW5DYXB0aW9uKHRva2VuKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIG5vZGUuaXRlbXMucHVzaChwYXJzZUxpc3QodG9rZW5pemVyLCB0b2tlbi52YWx1ZSB8fCAnJykpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA1IC8qIE5hbWVkICovOlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0b2tlbi52YWx1ZSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVtaXRFcnJvcih0b2tlbml6ZXIsIDEzIC8qIFVORVhQRUNURURfTEVYSUNBTF9BTkFMWVNJUyAqLywgY29udGV4dC5sYXN0U3RhcnRMb2MsIDAsIGdldFRva2VuQ2FwdGlvbih0b2tlbikpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBub2RlLml0ZW1zLnB1c2gocGFyc2VOYW1lZCh0b2tlbml6ZXIsIHRva2VuLnZhbHVlIHx8ICcnKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDcgLyogTGl0ZXJhbCAqLzpcclxuICAgICAgICAgICAgICAgICAgICBpZiAodG9rZW4udmFsdWUgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbWl0RXJyb3IodG9rZW5pemVyLCAxMyAvKiBVTkVYUEVDVEVEX0xFWElDQUxfQU5BTFlTSVMgKi8sIGNvbnRleHQubGFzdFN0YXJ0TG9jLCAwLCBnZXRUb2tlbkNhcHRpb24odG9rZW4pKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5pdGVtcy5wdXNoKHBhcnNlTGl0ZXJhbCh0b2tlbml6ZXIsIHRva2VuLnZhbHVlIHx8ICcnKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDggLyogTGlua2VkQWxpYXMgKi86XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFyc2VkID0gcGFyc2VMaW5rZWQodG9rZW5pemVyKTtcclxuICAgICAgICAgICAgICAgICAgICBub2RlLml0ZW1zLnB1c2gocGFyc2VkLm5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIG5leHRUb2tlbiA9IHBhcnNlZC5uZXh0Q29uc3VtZVRva2VuIHx8IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IHdoaWxlIChjb250ZXh0LmN1cnJlbnRUeXBlICE9PSAxNCAvKiBFT0YgKi8gJiZcclxuICAgICAgICAgICAgY29udGV4dC5jdXJyZW50VHlwZSAhPT0gMSAvKiBQaXBlICovKTtcclxuICAgICAgICAvLyBhZGp1c3QgbWVzc2FnZSBub2RlIGxvY1xyXG4gICAgICAgIGNvbnN0IGVuZE9mZnNldCA9IGNvbnRleHQuY3VycmVudFR5cGUgPT09IDEgLyogUGlwZSAqL1xyXG4gICAgICAgICAgICA/IGNvbnRleHQubGFzdE9mZnNldFxyXG4gICAgICAgICAgICA6IHRva2VuaXplci5jdXJyZW50T2Zmc2V0KCk7XHJcbiAgICAgICAgY29uc3QgZW5kTG9jID0gY29udGV4dC5jdXJyZW50VHlwZSA9PT0gMSAvKiBQaXBlICovXHJcbiAgICAgICAgICAgID8gY29udGV4dC5sYXN0RW5kTG9jXHJcbiAgICAgICAgICAgIDogdG9rZW5pemVyLmN1cnJlbnRQb3NpdGlvbigpO1xyXG4gICAgICAgIGVuZE5vZGUobm9kZSwgZW5kT2Zmc2V0LCBlbmRMb2MpO1xyXG4gICAgICAgIHJldHVybiBub2RlO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gcGFyc2VQbHVyYWwodG9rZW5pemVyLCBvZmZzZXQsIGxvYywgbXNnTm9kZSkge1xyXG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSB0b2tlbml6ZXIuY29udGV4dCgpO1xyXG4gICAgICAgIGxldCBoYXNFbXB0eU1lc3NhZ2UgPSBtc2dOb2RlLml0ZW1zLmxlbmd0aCA9PT0gMDtcclxuICAgICAgICBjb25zdCBub2RlID0gc3RhcnROb2RlKDEgLyogUGx1cmFsICovLCBvZmZzZXQsIGxvYyk7XHJcbiAgICAgICAgbm9kZS5jYXNlcyA9IFtdO1xyXG4gICAgICAgIG5vZGUuY2FzZXMucHVzaChtc2dOb2RlKTtcclxuICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgIGNvbnN0IG1zZyA9IHBhcnNlTWVzc2FnZSh0b2tlbml6ZXIpO1xyXG4gICAgICAgICAgICBpZiAoIWhhc0VtcHR5TWVzc2FnZSkge1xyXG4gICAgICAgICAgICAgICAgaGFzRW1wdHlNZXNzYWdlID0gbXNnLml0ZW1zLmxlbmd0aCA9PT0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBub2RlLmNhc2VzLnB1c2gobXNnKTtcclxuICAgICAgICB9IHdoaWxlIChjb250ZXh0LmN1cnJlbnRUeXBlICE9PSAxNCAvKiBFT0YgKi8pO1xyXG4gICAgICAgIGlmIChoYXNFbXB0eU1lc3NhZ2UpIHtcclxuICAgICAgICAgICAgZW1pdEVycm9yKHRva2VuaXplciwgMTAgLyogTVVTVF9IQVZFX01FU1NBR0VTX0lOX1BMVVJBTCAqLywgbG9jLCAwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZW5kTm9kZShub2RlLCB0b2tlbml6ZXIuY3VycmVudE9mZnNldCgpLCB0b2tlbml6ZXIuY3VycmVudFBvc2l0aW9uKCkpO1xyXG4gICAgICAgIHJldHVybiBub2RlO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gcGFyc2VSZXNvdXJjZSh0b2tlbml6ZXIpIHtcclxuICAgICAgICBjb25zdCBjb250ZXh0ID0gdG9rZW5pemVyLmNvbnRleHQoKTtcclxuICAgICAgICBjb25zdCB7IG9mZnNldCwgc3RhcnRMb2MgfSA9IGNvbnRleHQ7XHJcbiAgICAgICAgY29uc3QgbXNnTm9kZSA9IHBhcnNlTWVzc2FnZSh0b2tlbml6ZXIpO1xyXG4gICAgICAgIGlmIChjb250ZXh0LmN1cnJlbnRUeXBlID09PSAxNCAvKiBFT0YgKi8pIHtcclxuICAgICAgICAgICAgcmV0dXJuIG1zZ05vZGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gcGFyc2VQbHVyYWwodG9rZW5pemVyLCBvZmZzZXQsIHN0YXJ0TG9jLCBtc2dOb2RlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBwYXJzZShzb3VyY2UpIHtcclxuICAgICAgICBjb25zdCB0b2tlbml6ZXIgPSBjcmVhdGVUb2tlbml6ZXIoc291cmNlLCBhc3NpZ24oe30sIG9wdGlvbnMpKTtcclxuICAgICAgICBjb25zdCBjb250ZXh0ID0gdG9rZW5pemVyLmNvbnRleHQoKTtcclxuICAgICAgICBjb25zdCBub2RlID0gc3RhcnROb2RlKDAgLyogUmVzb3VyY2UgKi8sIGNvbnRleHQub2Zmc2V0LCBjb250ZXh0LnN0YXJ0TG9jKTtcclxuICAgICAgICBpZiAobG9jYXRpb24gJiYgbm9kZS5sb2MpIHtcclxuICAgICAgICAgICAgbm9kZS5sb2Muc291cmNlID0gc291cmNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBub2RlLmJvZHkgPSBwYXJzZVJlc291cmNlKHRva2VuaXplcik7XHJcbiAgICAgICAgLy8gYXNzZXJ0IHdoZXRoZXIgYWNoaWV2ZWQgdG8gRU9GXHJcbiAgICAgICAgaWYgKGNvbnRleHQuY3VycmVudFR5cGUgIT09IDE0IC8qIEVPRiAqLykge1xyXG4gICAgICAgICAgICBlbWl0RXJyb3IodG9rZW5pemVyLCAxMyAvKiBVTkVYUEVDVEVEX0xFWElDQUxfQU5BTFlTSVMgKi8sIGNvbnRleHQubGFzdFN0YXJ0TG9jLCAwLCBzb3VyY2VbY29udGV4dC5vZmZzZXRdIHx8ICcnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZW5kTm9kZShub2RlLCB0b2tlbml6ZXIuY3VycmVudE9mZnNldCgpLCB0b2tlbml6ZXIuY3VycmVudFBvc2l0aW9uKCkpO1xyXG4gICAgICAgIHJldHVybiBub2RlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHsgcGFyc2UgfTtcclxufVxyXG5mdW5jdGlvbiBnZXRUb2tlbkNhcHRpb24odG9rZW4pIHtcclxuICAgIGlmICh0b2tlbi50eXBlID09PSAxNCAvKiBFT0YgKi8pIHtcclxuICAgICAgICByZXR1cm4gJ0VPRic7XHJcbiAgICB9XHJcbiAgICBjb25zdCBuYW1lID0gKHRva2VuLnZhbHVlIHx8ICcnKS5yZXBsYWNlKC9cXHI/XFxuL2d1LCAnXFxcXG4nKTtcclxuICAgIHJldHVybiBuYW1lLmxlbmd0aCA+IDEwID8gbmFtZS5zbGljZSgwLCA5KSArICfigKYnIDogbmFtZTtcclxufVxuXG5mdW5jdGlvbiBjcmVhdGVUcmFuc2Zvcm1lcihhc3QsIG9wdGlvbnMgPSB7fSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXHJcbikge1xyXG4gICAgY29uc3QgX2NvbnRleHQgPSB7XHJcbiAgICAgICAgYXN0LFxyXG4gICAgICAgIGhlbHBlcnM6IG5ldyBTZXQoKVxyXG4gICAgfTtcclxuICAgIGNvbnN0IGNvbnRleHQgPSAoKSA9PiBfY29udGV4dDtcclxuICAgIGNvbnN0IGhlbHBlciA9IChuYW1lKSA9PiB7XHJcbiAgICAgICAgX2NvbnRleHQuaGVscGVycy5hZGQobmFtZSk7XHJcbiAgICAgICAgcmV0dXJuIG5hbWU7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIHsgY29udGV4dCwgaGVscGVyIH07XHJcbn1cclxuZnVuY3Rpb24gdHJhdmVyc2VOb2Rlcyhub2RlcywgdHJhbnNmb3JtZXIpIHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB0cmF2ZXJzZU5vZGUobm9kZXNbaV0sIHRyYW5zZm9ybWVyKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiB0cmF2ZXJzZU5vZGUobm9kZSwgdHJhbnNmb3JtZXIpIHtcclxuICAgIC8vIFRPRE86IGlmIHdlIG5lZWQgcHJlLWhvb2sgb2YgdHJhbnNmb3JtLCBzaG91bGQgYmUgaW1wbGVtZW50ZWQgdG8gaGVyZVxyXG4gICAgc3dpdGNoIChub2RlLnR5cGUpIHtcclxuICAgICAgICBjYXNlIDEgLyogUGx1cmFsICovOlxyXG4gICAgICAgICAgICB0cmF2ZXJzZU5vZGVzKG5vZGUuY2FzZXMsIHRyYW5zZm9ybWVyKTtcclxuICAgICAgICAgICAgdHJhbnNmb3JtZXIuaGVscGVyKFwicGx1cmFsXCIgLyogUExVUkFMICovKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAyIC8qIE1lc3NhZ2UgKi86XHJcbiAgICAgICAgICAgIHRyYXZlcnNlTm9kZXMobm9kZS5pdGVtcywgdHJhbnNmb3JtZXIpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDYgLyogTGlua2VkICovOlxyXG4gICAgICAgICAgICBjb25zdCBsaW5rZWQgPSBub2RlO1xyXG4gICAgICAgICAgICB0cmF2ZXJzZU5vZGUobGlua2VkLmtleSwgdHJhbnNmb3JtZXIpO1xyXG4gICAgICAgICAgICB0cmFuc2Zvcm1lci5oZWxwZXIoXCJsaW5rZWRcIiAvKiBMSU5LRUQgKi8pO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDUgLyogTGlzdCAqLzpcclxuICAgICAgICAgICAgdHJhbnNmb3JtZXIuaGVscGVyKFwiaW50ZXJwb2xhdGVcIiAvKiBJTlRFUlBPTEFURSAqLyk7XHJcbiAgICAgICAgICAgIHRyYW5zZm9ybWVyLmhlbHBlcihcImxpc3RcIiAvKiBMSVNUICovKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSA0IC8qIE5hbWVkICovOlxyXG4gICAgICAgICAgICB0cmFuc2Zvcm1lci5oZWxwZXIoXCJpbnRlcnBvbGF0ZVwiIC8qIElOVEVSUE9MQVRFICovKTtcclxuICAgICAgICAgICAgdHJhbnNmb3JtZXIuaGVscGVyKFwibmFtZWRcIiAvKiBOQU1FRCAqLyk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gICAgLy8gVE9ETzogaWYgd2UgbmVlZCBwb3N0LWhvb2sgb2YgdHJhbnNmb3JtLCBzaG91bGQgYmUgaW1wbGVtZW50ZWQgdG8gaGVyZVxyXG59XHJcbi8vIHRyYW5zZm9ybSBBU1RcclxuZnVuY3Rpb24gdHJhbnNmb3JtKGFzdCwgb3B0aW9ucyA9IHt9IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuKSB7XHJcbiAgICBjb25zdCB0cmFuc2Zvcm1lciA9IGNyZWF0ZVRyYW5zZm9ybWVyKGFzdCk7XHJcbiAgICB0cmFuc2Zvcm1lci5oZWxwZXIoXCJub3JtYWxpemVcIiAvKiBOT1JNQUxJWkUgKi8pO1xyXG4gICAgLy8gdHJhdmVyc2VcclxuICAgIGFzdC5ib2R5ICYmIHRyYXZlcnNlTm9kZShhc3QuYm9keSwgdHJhbnNmb3JtZXIpO1xyXG4gICAgLy8gc2V0IG1ldGEgaW5mb3JtYXRpb25cclxuICAgIGNvbnN0IGNvbnRleHQgPSB0cmFuc2Zvcm1lci5jb250ZXh0KCk7XHJcbiAgICBhc3QuaGVscGVycyA9IEFycmF5LmZyb20oY29udGV4dC5oZWxwZXJzKTtcclxufVxuXG5mdW5jdGlvbiBjcmVhdGVDb2RlR2VuZXJhdG9yKGFzdCwgb3B0aW9ucykge1xyXG4gICAgY29uc3QgeyBzb3VyY2VNYXAsIGZpbGVuYW1lLCBicmVha0xpbmVDb2RlLCBuZWVkSW5kZW50OiBfbmVlZEluZGVudCB9ID0gb3B0aW9ucztcclxuICAgIGNvbnN0IF9jb250ZXh0ID0ge1xyXG4gICAgICAgIHNvdXJjZTogYXN0LmxvYy5zb3VyY2UsXHJcbiAgICAgICAgZmlsZW5hbWUsXHJcbiAgICAgICAgY29kZTogJycsXHJcbiAgICAgICAgY29sdW1uOiAxLFxyXG4gICAgICAgIGxpbmU6IDEsXHJcbiAgICAgICAgb2Zmc2V0OiAwLFxyXG4gICAgICAgIG1hcDogdW5kZWZpbmVkLFxyXG4gICAgICAgIGJyZWFrTGluZUNvZGUsXHJcbiAgICAgICAgbmVlZEluZGVudDogX25lZWRJbmRlbnQsXHJcbiAgICAgICAgaW5kZW50TGV2ZWw6IDBcclxuICAgIH07XHJcbiAgICBjb25zdCBjb250ZXh0ID0gKCkgPT4gX2NvbnRleHQ7XHJcbiAgICBmdW5jdGlvbiBwdXNoKGNvZGUsIG5vZGUpIHtcclxuICAgICAgICBfY29udGV4dC5jb2RlICs9IGNvZGU7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBfbmV3bGluZShuLCB3aXRoQnJlYWtMaW5lID0gdHJ1ZSkge1xyXG4gICAgICAgIGNvbnN0IF9icmVha0xpbmVDb2RlID0gd2l0aEJyZWFrTGluZSA/IGJyZWFrTGluZUNvZGUgOiAnJztcclxuICAgICAgICBwdXNoKF9uZWVkSW5kZW50ID8gX2JyZWFrTGluZUNvZGUgKyBgICBgLnJlcGVhdChuKSA6IF9icmVha0xpbmVDb2RlKTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGluZGVudCh3aXRoTmV3TGluZSA9IHRydWUpIHtcclxuICAgICAgICBjb25zdCBsZXZlbCA9ICsrX2NvbnRleHQuaW5kZW50TGV2ZWw7XHJcbiAgICAgICAgd2l0aE5ld0xpbmUgJiYgX25ld2xpbmUobGV2ZWwpO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gZGVpbmRlbnQod2l0aE5ld0xpbmUgPSB0cnVlKSB7XHJcbiAgICAgICAgY29uc3QgbGV2ZWwgPSAtLV9jb250ZXh0LmluZGVudExldmVsO1xyXG4gICAgICAgIHdpdGhOZXdMaW5lICYmIF9uZXdsaW5lKGxldmVsKTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIG5ld2xpbmUoKSB7XHJcbiAgICAgICAgX25ld2xpbmUoX2NvbnRleHQuaW5kZW50TGV2ZWwpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgaGVscGVyID0gKGtleSkgPT4gYF8ke2tleX1gO1xyXG4gICAgY29uc3QgbmVlZEluZGVudCA9ICgpID0+IF9jb250ZXh0Lm5lZWRJbmRlbnQ7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGNvbnRleHQsXHJcbiAgICAgICAgcHVzaCxcclxuICAgICAgICBpbmRlbnQsXHJcbiAgICAgICAgZGVpbmRlbnQsXHJcbiAgICAgICAgbmV3bGluZSxcclxuICAgICAgICBoZWxwZXIsXHJcbiAgICAgICAgbmVlZEluZGVudFxyXG4gICAgfTtcclxufVxyXG5mdW5jdGlvbiBnZW5lcmF0ZUxpbmtlZE5vZGUoZ2VuZXJhdG9yLCBub2RlKSB7XHJcbiAgICBjb25zdCB7IGhlbHBlciB9ID0gZ2VuZXJhdG9yO1xyXG4gICAgZ2VuZXJhdG9yLnB1c2goYCR7aGVscGVyKFwibGlua2VkXCIgLyogTElOS0VEICovKX0oYCk7XHJcbiAgICBnZW5lcmF0ZU5vZGUoZ2VuZXJhdG9yLCBub2RlLmtleSk7XHJcbiAgICBpZiAobm9kZS5tb2RpZmllcikge1xyXG4gICAgICAgIGdlbmVyYXRvci5wdXNoKGAsIGApO1xyXG4gICAgICAgIGdlbmVyYXRlTm9kZShnZW5lcmF0b3IsIG5vZGUubW9kaWZpZXIpO1xyXG4gICAgfVxyXG4gICAgZ2VuZXJhdG9yLnB1c2goYClgKTtcclxufVxyXG5mdW5jdGlvbiBnZW5lcmF0ZU1lc3NhZ2VOb2RlKGdlbmVyYXRvciwgbm9kZSkge1xyXG4gICAgY29uc3QgeyBoZWxwZXIsIG5lZWRJbmRlbnQgfSA9IGdlbmVyYXRvcjtcclxuICAgIGdlbmVyYXRvci5wdXNoKGAke2hlbHBlcihcIm5vcm1hbGl6ZVwiIC8qIE5PUk1BTElaRSAqLyl9KFtgKTtcclxuICAgIGdlbmVyYXRvci5pbmRlbnQobmVlZEluZGVudCgpKTtcclxuICAgIGNvbnN0IGxlbmd0aCA9IG5vZGUuaXRlbXMubGVuZ3RoO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGdlbmVyYXRlTm9kZShnZW5lcmF0b3IsIG5vZGUuaXRlbXNbaV0pO1xyXG4gICAgICAgIGlmIChpID09PSBsZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnZW5lcmF0b3IucHVzaCgnLCAnKTtcclxuICAgIH1cclxuICAgIGdlbmVyYXRvci5kZWluZGVudChuZWVkSW5kZW50KCkpO1xyXG4gICAgZ2VuZXJhdG9yLnB1c2goJ10pJyk7XHJcbn1cclxuZnVuY3Rpb24gZ2VuZXJhdGVQbHVyYWxOb2RlKGdlbmVyYXRvciwgbm9kZSkge1xyXG4gICAgY29uc3QgeyBoZWxwZXIsIG5lZWRJbmRlbnQgfSA9IGdlbmVyYXRvcjtcclxuICAgIGlmIChub2RlLmNhc2VzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICBnZW5lcmF0b3IucHVzaChgJHtoZWxwZXIoXCJwbHVyYWxcIiAvKiBQTFVSQUwgKi8pfShbYCk7XHJcbiAgICAgICAgZ2VuZXJhdG9yLmluZGVudChuZWVkSW5kZW50KCkpO1xyXG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IG5vZGUuY2FzZXMubGVuZ3RoO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgZ2VuZXJhdGVOb2RlKGdlbmVyYXRvciwgbm9kZS5jYXNlc1tpXSk7XHJcbiAgICAgICAgICAgIGlmIChpID09PSBsZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBnZW5lcmF0b3IucHVzaCgnLCAnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2VuZXJhdG9yLmRlaW5kZW50KG5lZWRJbmRlbnQoKSk7XHJcbiAgICAgICAgZ2VuZXJhdG9yLnB1c2goYF0pYCk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gZ2VuZXJhdGVSZXNvdXJjZShnZW5lcmF0b3IsIG5vZGUpIHtcclxuICAgIGlmIChub2RlLmJvZHkpIHtcclxuICAgICAgICBnZW5lcmF0ZU5vZGUoZ2VuZXJhdG9yLCBub2RlLmJvZHkpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgZ2VuZXJhdG9yLnB1c2goJ251bGwnKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBnZW5lcmF0ZU5vZGUoZ2VuZXJhdG9yLCBub2RlKSB7XHJcbiAgICBjb25zdCB7IGhlbHBlciB9ID0gZ2VuZXJhdG9yO1xyXG4gICAgc3dpdGNoIChub2RlLnR5cGUpIHtcclxuICAgICAgICBjYXNlIDAgLyogUmVzb3VyY2UgKi86XHJcbiAgICAgICAgICAgIGdlbmVyYXRlUmVzb3VyY2UoZ2VuZXJhdG9yLCBub2RlKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAxIC8qIFBsdXJhbCAqLzpcclxuICAgICAgICAgICAgZ2VuZXJhdGVQbHVyYWxOb2RlKGdlbmVyYXRvciwgbm9kZSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgMiAvKiBNZXNzYWdlICovOlxyXG4gICAgICAgICAgICBnZW5lcmF0ZU1lc3NhZ2VOb2RlKGdlbmVyYXRvciwgbm9kZSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgNiAvKiBMaW5rZWQgKi86XHJcbiAgICAgICAgICAgIGdlbmVyYXRlTGlua2VkTm9kZShnZW5lcmF0b3IsIG5vZGUpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDggLyogTGlua2VkTW9kaWZpZXIgKi86XHJcbiAgICAgICAgICAgIGdlbmVyYXRvci5wdXNoKEpTT04uc3RyaW5naWZ5KG5vZGUudmFsdWUpLCBub2RlKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSA3IC8qIExpbmtlZEtleSAqLzpcclxuICAgICAgICAgICAgZ2VuZXJhdG9yLnB1c2goSlNPTi5zdHJpbmdpZnkobm9kZS52YWx1ZSksIG5vZGUpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDUgLyogTGlzdCAqLzpcclxuICAgICAgICAgICAgZ2VuZXJhdG9yLnB1c2goYCR7aGVscGVyKFwiaW50ZXJwb2xhdGVcIiAvKiBJTlRFUlBPTEFURSAqLyl9KCR7aGVscGVyKFwibGlzdFwiIC8qIExJU1QgKi8pfSgke25vZGUuaW5kZXh9KSlgLCBub2RlKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSA0IC8qIE5hbWVkICovOlxyXG4gICAgICAgICAgICBnZW5lcmF0b3IucHVzaChgJHtoZWxwZXIoXCJpbnRlcnBvbGF0ZVwiIC8qIElOVEVSUE9MQVRFICovKX0oJHtoZWxwZXIoXCJuYW1lZFwiIC8qIE5BTUVEICovKX0oJHtKU09OLnN0cmluZ2lmeShub2RlLmtleSl9KSlgLCBub2RlKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSA5IC8qIExpdGVyYWwgKi86XHJcbiAgICAgICAgICAgIGdlbmVyYXRvci5wdXNoKEpTT04uc3RyaW5naWZ5KG5vZGUudmFsdWUpLCBub2RlKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAzIC8qIFRleHQgKi86XHJcbiAgICAgICAgICAgIGdlbmVyYXRvci5wdXNoKEpTT04uc3RyaW5naWZ5KG5vZGUudmFsdWUpLCBub2RlKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGB1bmhhbmRsZWQgY29kZWdlbiBub2RlIHR5cGU6ICR7bm9kZS50eXBlfWApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuLy8gZ2VuZXJhdGUgY29kZSBmcm9tIEFTVFxyXG5jb25zdCBnZW5lcmF0ZSA9IChhc3QsIG9wdGlvbnMgPSB7fSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXHJcbikgPT4ge1xyXG4gICAgY29uc3QgbW9kZSA9IGlzU3RyaW5nKG9wdGlvbnMubW9kZSkgPyBvcHRpb25zLm1vZGUgOiAnbm9ybWFsJztcclxuICAgIGNvbnN0IGZpbGVuYW1lID0gaXNTdHJpbmcob3B0aW9ucy5maWxlbmFtZSlcclxuICAgICAgICA/IG9wdGlvbnMuZmlsZW5hbWVcclxuICAgICAgICA6ICdtZXNzYWdlLmludGwnO1xyXG4gICAgY29uc3Qgc291cmNlTWFwID0gISFvcHRpb25zLnNvdXJjZU1hcDtcclxuICAgIC8vIHByZXR0aWVyLWlnbm9yZVxyXG4gICAgY29uc3QgYnJlYWtMaW5lQ29kZSA9IG9wdGlvbnMuYnJlYWtMaW5lQ29kZSAhPSBudWxsXHJcbiAgICAgICAgPyBvcHRpb25zLmJyZWFrTGluZUNvZGVcclxuICAgICAgICA6IG1vZGUgPT09ICdhcnJvdydcclxuICAgICAgICAgICAgPyAnOydcclxuICAgICAgICAgICAgOiAnXFxuJztcclxuICAgIGNvbnN0IG5lZWRJbmRlbnQgPSBvcHRpb25zLm5lZWRJbmRlbnQgPyBvcHRpb25zLm5lZWRJbmRlbnQgOiBtb2RlICE9PSAnYXJyb3cnO1xyXG4gICAgY29uc3QgaGVscGVycyA9IGFzdC5oZWxwZXJzIHx8IFtdO1xyXG4gICAgY29uc3QgZ2VuZXJhdG9yID0gY3JlYXRlQ29kZUdlbmVyYXRvcihhc3QsIHtcclxuICAgICAgICBtb2RlLFxyXG4gICAgICAgIGZpbGVuYW1lLFxyXG4gICAgICAgIHNvdXJjZU1hcCxcclxuICAgICAgICBicmVha0xpbmVDb2RlLFxyXG4gICAgICAgIG5lZWRJbmRlbnRcclxuICAgIH0pO1xyXG4gICAgZ2VuZXJhdG9yLnB1c2gobW9kZSA9PT0gJ25vcm1hbCcgPyBgZnVuY3Rpb24gX19tc2dfXyAoY3R4KSB7YCA6IGAoY3R4KSA9PiB7YCk7XHJcbiAgICBnZW5lcmF0b3IuaW5kZW50KG5lZWRJbmRlbnQpO1xyXG4gICAgaWYgKGhlbHBlcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGdlbmVyYXRvci5wdXNoKGBjb25zdCB7ICR7aGVscGVycy5tYXAocyA9PiBgJHtzfTogXyR7c31gKS5qb2luKCcsICcpfSB9ID0gY3R4YCk7XHJcbiAgICAgICAgZ2VuZXJhdG9yLm5ld2xpbmUoKTtcclxuICAgIH1cclxuICAgIGdlbmVyYXRvci5wdXNoKGByZXR1cm4gYCk7XHJcbiAgICBnZW5lcmF0ZU5vZGUoZ2VuZXJhdG9yLCBhc3QpO1xyXG4gICAgZ2VuZXJhdG9yLmRlaW5kZW50KG5lZWRJbmRlbnQpO1xyXG4gICAgZ2VuZXJhdG9yLnB1c2goYH1gKTtcclxuICAgIGNvbnN0IHsgY29kZSwgbWFwIH0gPSBnZW5lcmF0b3IuY29udGV4dCgpO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBhc3QsXHJcbiAgICAgICAgY29kZSxcclxuICAgICAgICBtYXA6IG1hcCA/IG1hcC50b0pTT04oKSA6IHVuZGVmaW5lZCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcclxuICAgIH07XHJcbn07XG5cbmZ1bmN0aW9uIGJhc2VDb21waWxlKHNvdXJjZSwgb3B0aW9ucyA9IHt9KSB7XHJcbiAgICBjb25zdCBhc3NpZ25lZE9wdGlvbnMgPSBhc3NpZ24oe30sIG9wdGlvbnMpO1xyXG4gICAgLy8gcGFyc2Ugc291cmNlIGNvZGVzXHJcbiAgICBjb25zdCBwYXJzZXIgPSBjcmVhdGVQYXJzZXIoYXNzaWduZWRPcHRpb25zKTtcclxuICAgIGNvbnN0IGFzdCA9IHBhcnNlci5wYXJzZShzb3VyY2UpO1xyXG4gICAgLy8gdHJhbnNmb3JtIEFTVHNcclxuICAgIHRyYW5zZm9ybShhc3QsIGFzc2lnbmVkT3B0aW9ucyk7XHJcbiAgICAvLyBnZW5lcmF0ZSBqYXZhc2NyaXB0IGNvZGVzXHJcbiAgICByZXR1cm4gZ2VuZXJhdGUoYXN0LCBhc3NpZ25lZE9wdGlvbnMpO1xyXG59XG5cbmV4cG9ydCB7IEVSUk9SX0RPTUFJTiwgTG9jYXRpb25TdHViLCBiYXNlQ29tcGlsZSwgY3JlYXRlQ29tcGlsZUVycm9yLCBjcmVhdGVMb2NhdGlvbiwgY3JlYXRlUGFyc2VyLCBjcmVhdGVQb3NpdGlvbiwgZGVmYXVsdE9uRXJyb3IsIGVycm9yTWVzc2FnZXMgfTtcbiIsIi8qIVxuICAqIEBpbnRsaWZ5L2RldnRvb2xzLWlmIHY5LjEuMTBcbiAgKiAoYykgMjAyMiBrYXp1eWEga2F3YWd1Y2hpXG4gICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICAqL1xuY29uc3QgSW50bGlmeURldlRvb2xzSG9va3MgPSB7XHJcbiAgICBJMThuSW5pdDogJ2kxOG46aW5pdCcsXHJcbiAgICBGdW5jdGlvblRyYW5zbGF0ZTogJ2Z1bmN0aW9uOnRyYW5zbGF0ZSdcclxufTtcblxuZXhwb3J0IHsgSW50bGlmeURldlRvb2xzSG9va3MgfTtcbiIsIi8qIVxuICAqIEBpbnRsaWZ5L2NvcmUtYmFzZSB2OS4xLjEwXG4gICogKGMpIDIwMjIga2F6dXlhIGthd2FndWNoaVxuICAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAgKi9cbmltcG9ydCB7IGZvcm1hdCwgaXNTdHJpbmcsIGlzQXJyYXksIGlzUGxhaW5PYmplY3QsIGFzc2lnbiwgaXNGdW5jdGlvbiwgaXNCb29sZWFuLCBpc1JlZ0V4cCwgd2FybiwgaXNPYmplY3QsIGVzY2FwZUh0bWwsIGluQnJvd3NlciwgbWFyaywgbWVhc3VyZSwgZ2VuZXJhdGVDb2RlRnJhbWUsIGdlbmVyYXRlRm9ybWF0Q2FjaGVLZXksIGlzTnVtYmVyLCBpc0VtcHR5T2JqZWN0LCBpc0RhdGUsIGdldEdsb2JhbFRoaXMgfSBmcm9tICdAaW50bGlmeS9zaGFyZWQnO1xuaW1wb3J0IHsgcmVzb2x2ZVZhbHVlIH0gZnJvbSAnQGludGxpZnkvbWVzc2FnZS1yZXNvbHZlcic7XG5leHBvcnQgKiBmcm9tICdAaW50bGlmeS9tZXNzYWdlLXJlc29sdmVyJztcbmltcG9ydCB7IGNyZWF0ZU1lc3NhZ2VDb250ZXh0IH0gZnJvbSAnQGludGxpZnkvcnVudGltZSc7XG5leHBvcnQgKiBmcm9tICdAaW50bGlmeS9ydW50aW1lJztcbmltcG9ydCB7IGRlZmF1bHRPbkVycm9yLCBiYXNlQ29tcGlsZSwgY3JlYXRlQ29tcGlsZUVycm9yIH0gZnJvbSAnQGludGxpZnkvbWVzc2FnZS1jb21waWxlcic7XG5leHBvcnQgeyBjcmVhdGVDb21waWxlRXJyb3IgfSBmcm9tICdAaW50bGlmeS9tZXNzYWdlLWNvbXBpbGVyJztcbmltcG9ydCB7IEludGxpZnlEZXZUb29sc0hvb2tzIH0gZnJvbSAnQGludGxpZnkvZGV2dG9vbHMtaWYnO1xuXG5sZXQgZGV2dG9vbHMgPSBudWxsO1xyXG5mdW5jdGlvbiBzZXREZXZUb29sc0hvb2soaG9vaykge1xyXG4gICAgZGV2dG9vbHMgPSBob29rO1xyXG59XHJcbmZ1bmN0aW9uIGdldERldlRvb2xzSG9vaygpIHtcclxuICAgIHJldHVybiBkZXZ0b29scztcclxufVxyXG5mdW5jdGlvbiBpbml0STE4bkRldlRvb2xzKGkxOG4sIHZlcnNpb24sIG1ldGEpIHtcclxuICAgIC8vIFRPRE86IHF1ZXVlIGlmIGRldnRvb2xzIGlzIHVuZGVmaW5lZFxyXG4gICAgZGV2dG9vbHMgJiZcclxuICAgICAgICBkZXZ0b29scy5lbWl0KEludGxpZnlEZXZUb29sc0hvb2tzLkkxOG5Jbml0LCB7XHJcbiAgICAgICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKSxcclxuICAgICAgICAgICAgaTE4bixcclxuICAgICAgICAgICAgdmVyc2lvbixcclxuICAgICAgICAgICAgbWV0YVxyXG4gICAgICAgIH0pO1xyXG59XHJcbmNvbnN0IHRyYW5zbGF0ZURldlRvb2xzID0gLyogI19fUFVSRV9fKi8gY3JlYXRlRGV2VG9vbHNIb29rKEludGxpZnlEZXZUb29sc0hvb2tzLkZ1bmN0aW9uVHJhbnNsYXRlKTtcclxuZnVuY3Rpb24gY3JlYXRlRGV2VG9vbHNIb29rKGhvb2spIHtcclxuICAgIHJldHVybiAocGF5bG9hZHMpID0+IGRldnRvb2xzICYmIGRldnRvb2xzLmVtaXQoaG9vaywgcGF5bG9hZHMpO1xyXG59XG5cbi8qKiBAaW50ZXJuYWwgKi9cclxuY29uc3Qgd2Fybk1lc3NhZ2VzID0ge1xyXG4gICAgWzAgLyogTk9UX0ZPVU5EX0tFWSAqL106IGBOb3QgZm91bmQgJ3trZXl9JyBrZXkgaW4gJ3tsb2NhbGV9JyBsb2NhbGUgbWVzc2FnZXMuYCxcclxuICAgIFsxIC8qIEZBTExCQUNLX1RPX1RSQU5TTEFURSAqL106IGBGYWxsIGJhY2sgdG8gdHJhbnNsYXRlICd7a2V5fScga2V5IHdpdGggJ3t0YXJnZXR9JyBsb2NhbGUuYCxcclxuICAgIFsyIC8qIENBTk5PVF9GT1JNQVRfTlVNQkVSICovXTogYENhbm5vdCBmb3JtYXQgYSBudW1iZXIgdmFsdWUgZHVlIHRvIG5vdCBzdXBwb3J0ZWQgSW50bC5OdW1iZXJGb3JtYXQuYCxcclxuICAgIFszIC8qIEZBTExCQUNLX1RPX05VTUJFUl9GT1JNQVQgKi9dOiBgRmFsbCBiYWNrIHRvIG51bWJlciBmb3JtYXQgJ3trZXl9JyBrZXkgd2l0aCAne3RhcmdldH0nIGxvY2FsZS5gLFxyXG4gICAgWzQgLyogQ0FOTk9UX0ZPUk1BVF9EQVRFICovXTogYENhbm5vdCBmb3JtYXQgYSBkYXRlIHZhbHVlIGR1ZSB0byBub3Qgc3VwcG9ydGVkIEludGwuRGF0ZVRpbWVGb3JtYXQuYCxcclxuICAgIFs1IC8qIEZBTExCQUNLX1RPX0RBVEVfRk9STUFUICovXTogYEZhbGwgYmFjayB0byBkYXRldGltZSBmb3JtYXQgJ3trZXl9JyBrZXkgd2l0aCAne3RhcmdldH0nIGxvY2FsZS5gXHJcbn07XHJcbmZ1bmN0aW9uIGdldFdhcm5NZXNzYWdlKGNvZGUsIC4uLmFyZ3MpIHtcclxuICAgIHJldHVybiBmb3JtYXQod2Fybk1lc3NhZ2VzW2NvZGVdLCAuLi5hcmdzKTtcclxufVxuXG4vKipcclxuICogSW50bGlmeSBjb3JlLWJhc2UgdmVyc2lvblxyXG4gKiBAaW50ZXJuYWxcclxuICovXHJcbmNvbnN0IFZFUlNJT04gPSAnOS4xLjEwJztcclxuY29uc3QgTk9UX1JFT1NMVkVEID0gLTE7XHJcbmNvbnN0IE1JU1NJTkdfUkVTT0xWRV9WQUxVRSA9ICcnO1xyXG5mdW5jdGlvbiBnZXREZWZhdWx0TGlua2VkTW9kaWZpZXJzKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB1cHBlcjogKHZhbCkgPT4gKGlzU3RyaW5nKHZhbCkgPyB2YWwudG9VcHBlckNhc2UoKSA6IHZhbCksXHJcbiAgICAgICAgbG93ZXI6ICh2YWwpID0+IChpc1N0cmluZyh2YWwpID8gdmFsLnRvTG93ZXJDYXNlKCkgOiB2YWwpLFxyXG4gICAgICAgIC8vIHByZXR0aWVyLWlnbm9yZVxyXG4gICAgICAgIGNhcGl0YWxpemU6ICh2YWwpID0+IChpc1N0cmluZyh2YWwpXHJcbiAgICAgICAgICAgID8gYCR7dmFsLmNoYXJBdCgwKS50b0xvY2FsZVVwcGVyQ2FzZSgpfSR7dmFsLnN1YnN0cigxKX1gXHJcbiAgICAgICAgICAgIDogdmFsKVxyXG4gICAgfTtcclxufVxyXG5sZXQgX2NvbXBpbGVyO1xyXG5mdW5jdGlvbiByZWdpc3Rlck1lc3NhZ2VDb21waWxlcihjb21waWxlcikge1xyXG4gICAgX2NvbXBpbGVyID0gY29tcGlsZXI7XHJcbn1cclxuLy8gQWRkaXRpb25hbCBNZXRhIGZvciBJbnRsaWZ5IERldlRvb2xzXHJcbmxldCBfYWRkaXRpb25hbE1ldGEgPSBudWxsO1xyXG5jb25zdCBzZXRBZGRpdGlvbmFsTWV0YSA9IC8qICNfX1BVUkVfXyovIChtZXRhKSA9PiB7XHJcbiAgICBfYWRkaXRpb25hbE1ldGEgPSBtZXRhO1xyXG59O1xyXG5jb25zdCBnZXRBZGRpdGlvbmFsTWV0YSA9IC8qICNfX1BVUkVfXyovICgpID0+IF9hZGRpdGlvbmFsTWV0YTtcclxuLy8gSUQgZm9yIENvcmVDb250ZXh0XHJcbmxldCBfY2lkID0gMDtcclxuZnVuY3Rpb24gY3JlYXRlQ29yZUNvbnRleHQob3B0aW9ucyA9IHt9KSB7XHJcbiAgICAvLyBzZXR1cCBvcHRpb25zXHJcbiAgICBjb25zdCB2ZXJzaW9uID0gaXNTdHJpbmcob3B0aW9ucy52ZXJzaW9uKSA/IG9wdGlvbnMudmVyc2lvbiA6IFZFUlNJT047XHJcbiAgICBjb25zdCBsb2NhbGUgPSBpc1N0cmluZyhvcHRpb25zLmxvY2FsZSkgPyBvcHRpb25zLmxvY2FsZSA6ICdlbi1VUyc7XHJcbiAgICBjb25zdCBmYWxsYmFja0xvY2FsZSA9IGlzQXJyYXkob3B0aW9ucy5mYWxsYmFja0xvY2FsZSkgfHxcclxuICAgICAgICBpc1BsYWluT2JqZWN0KG9wdGlvbnMuZmFsbGJhY2tMb2NhbGUpIHx8XHJcbiAgICAgICAgaXNTdHJpbmcob3B0aW9ucy5mYWxsYmFja0xvY2FsZSkgfHxcclxuICAgICAgICBvcHRpb25zLmZhbGxiYWNrTG9jYWxlID09PSBmYWxzZVxyXG4gICAgICAgID8gb3B0aW9ucy5mYWxsYmFja0xvY2FsZVxyXG4gICAgICAgIDogbG9jYWxlO1xyXG4gICAgY29uc3QgbWVzc2FnZXMgPSBpc1BsYWluT2JqZWN0KG9wdGlvbnMubWVzc2FnZXMpXHJcbiAgICAgICAgPyBvcHRpb25zLm1lc3NhZ2VzXHJcbiAgICAgICAgOiB7IFtsb2NhbGVdOiB7fSB9O1xyXG4gICAgY29uc3QgZGF0ZXRpbWVGb3JtYXRzID0gaXNQbGFpbk9iamVjdChvcHRpb25zLmRhdGV0aW1lRm9ybWF0cylcclxuICAgICAgICA/IG9wdGlvbnMuZGF0ZXRpbWVGb3JtYXRzXHJcbiAgICAgICAgOiB7IFtsb2NhbGVdOiB7fSB9O1xyXG4gICAgY29uc3QgbnVtYmVyRm9ybWF0cyA9IGlzUGxhaW5PYmplY3Qob3B0aW9ucy5udW1iZXJGb3JtYXRzKVxyXG4gICAgICAgID8gb3B0aW9ucy5udW1iZXJGb3JtYXRzXHJcbiAgICAgICAgOiB7IFtsb2NhbGVdOiB7fSB9O1xyXG4gICAgY29uc3QgbW9kaWZpZXJzID0gYXNzaWduKHt9LCBvcHRpb25zLm1vZGlmaWVycyB8fCB7fSwgZ2V0RGVmYXVsdExpbmtlZE1vZGlmaWVycygpKTtcclxuICAgIGNvbnN0IHBsdXJhbFJ1bGVzID0gb3B0aW9ucy5wbHVyYWxSdWxlcyB8fCB7fTtcclxuICAgIGNvbnN0IG1pc3NpbmcgPSBpc0Z1bmN0aW9uKG9wdGlvbnMubWlzc2luZykgPyBvcHRpb25zLm1pc3NpbmcgOiBudWxsO1xyXG4gICAgY29uc3QgbWlzc2luZ1dhcm4gPSBpc0Jvb2xlYW4ob3B0aW9ucy5taXNzaW5nV2FybikgfHwgaXNSZWdFeHAob3B0aW9ucy5taXNzaW5nV2FybilcclxuICAgICAgICA/IG9wdGlvbnMubWlzc2luZ1dhcm5cclxuICAgICAgICA6IHRydWU7XHJcbiAgICBjb25zdCBmYWxsYmFja1dhcm4gPSBpc0Jvb2xlYW4ob3B0aW9ucy5mYWxsYmFja1dhcm4pIHx8IGlzUmVnRXhwKG9wdGlvbnMuZmFsbGJhY2tXYXJuKVxyXG4gICAgICAgID8gb3B0aW9ucy5mYWxsYmFja1dhcm5cclxuICAgICAgICA6IHRydWU7XHJcbiAgICBjb25zdCBmYWxsYmFja0Zvcm1hdCA9ICEhb3B0aW9ucy5mYWxsYmFja0Zvcm1hdDtcclxuICAgIGNvbnN0IHVucmVzb2x2aW5nID0gISFvcHRpb25zLnVucmVzb2x2aW5nO1xyXG4gICAgY29uc3QgcG9zdFRyYW5zbGF0aW9uID0gaXNGdW5jdGlvbihvcHRpb25zLnBvc3RUcmFuc2xhdGlvbilcclxuICAgICAgICA/IG9wdGlvbnMucG9zdFRyYW5zbGF0aW9uXHJcbiAgICAgICAgOiBudWxsO1xyXG4gICAgY29uc3QgcHJvY2Vzc29yID0gaXNQbGFpbk9iamVjdChvcHRpb25zLnByb2Nlc3NvcikgPyBvcHRpb25zLnByb2Nlc3NvciA6IG51bGw7XHJcbiAgICBjb25zdCB3YXJuSHRtbE1lc3NhZ2UgPSBpc0Jvb2xlYW4ob3B0aW9ucy53YXJuSHRtbE1lc3NhZ2UpXHJcbiAgICAgICAgPyBvcHRpb25zLndhcm5IdG1sTWVzc2FnZVxyXG4gICAgICAgIDogdHJ1ZTtcclxuICAgIGNvbnN0IGVzY2FwZVBhcmFtZXRlciA9ICEhb3B0aW9ucy5lc2NhcGVQYXJhbWV0ZXI7XHJcbiAgICBjb25zdCBtZXNzYWdlQ29tcGlsZXIgPSBpc0Z1bmN0aW9uKG9wdGlvbnMubWVzc2FnZUNvbXBpbGVyKVxyXG4gICAgICAgID8gb3B0aW9ucy5tZXNzYWdlQ29tcGlsZXJcclxuICAgICAgICA6IF9jb21waWxlcjtcclxuICAgIGNvbnN0IG9uV2FybiA9IGlzRnVuY3Rpb24ob3B0aW9ucy5vbldhcm4pID8gb3B0aW9ucy5vbldhcm4gOiB3YXJuO1xyXG4gICAgLy8gc2V0dXAgaW50ZXJuYWwgb3B0aW9uc1xyXG4gICAgY29uc3QgaW50ZXJuYWxPcHRpb25zID0gb3B0aW9ucztcclxuICAgIGNvbnN0IF9fZGF0ZXRpbWVGb3JtYXR0ZXJzID0gaXNPYmplY3QoaW50ZXJuYWxPcHRpb25zLl9fZGF0ZXRpbWVGb3JtYXR0ZXJzKVxyXG4gICAgICAgID8gaW50ZXJuYWxPcHRpb25zLl9fZGF0ZXRpbWVGb3JtYXR0ZXJzXHJcbiAgICAgICAgOiBuZXcgTWFwKCk7XHJcbiAgICBjb25zdCBfX251bWJlckZvcm1hdHRlcnMgPSBpc09iamVjdChpbnRlcm5hbE9wdGlvbnMuX19udW1iZXJGb3JtYXR0ZXJzKVxyXG4gICAgICAgID8gaW50ZXJuYWxPcHRpb25zLl9fbnVtYmVyRm9ybWF0dGVyc1xyXG4gICAgICAgIDogbmV3IE1hcCgpO1xyXG4gICAgY29uc3QgX19tZXRhID0gaXNPYmplY3QoaW50ZXJuYWxPcHRpb25zLl9fbWV0YSkgPyBpbnRlcm5hbE9wdGlvbnMuX19tZXRhIDoge307XHJcbiAgICBfY2lkKys7XHJcbiAgICBjb25zdCBjb250ZXh0ID0ge1xyXG4gICAgICAgIHZlcnNpb24sXHJcbiAgICAgICAgY2lkOiBfY2lkLFxyXG4gICAgICAgIGxvY2FsZSxcclxuICAgICAgICBmYWxsYmFja0xvY2FsZSxcclxuICAgICAgICBtZXNzYWdlcyxcclxuICAgICAgICBkYXRldGltZUZvcm1hdHMsXHJcbiAgICAgICAgbnVtYmVyRm9ybWF0cyxcclxuICAgICAgICBtb2RpZmllcnMsXHJcbiAgICAgICAgcGx1cmFsUnVsZXMsXHJcbiAgICAgICAgbWlzc2luZyxcclxuICAgICAgICBtaXNzaW5nV2FybixcclxuICAgICAgICBmYWxsYmFja1dhcm4sXHJcbiAgICAgICAgZmFsbGJhY2tGb3JtYXQsXHJcbiAgICAgICAgdW5yZXNvbHZpbmcsXHJcbiAgICAgICAgcG9zdFRyYW5zbGF0aW9uLFxyXG4gICAgICAgIHByb2Nlc3NvcixcclxuICAgICAgICB3YXJuSHRtbE1lc3NhZ2UsXHJcbiAgICAgICAgZXNjYXBlUGFyYW1ldGVyLFxyXG4gICAgICAgIG1lc3NhZ2VDb21waWxlcixcclxuICAgICAgICBvbldhcm4sXHJcbiAgICAgICAgX19kYXRldGltZUZvcm1hdHRlcnMsXHJcbiAgICAgICAgX19udW1iZXJGb3JtYXR0ZXJzLFxyXG4gICAgICAgIF9fbWV0YVxyXG4gICAgfTtcclxuICAgIC8vIGZvciB2dWUtZGV2dG9vbHMgdGltZWxpbmUgZXZlbnRcclxuICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykpIHtcclxuICAgICAgICBjb250ZXh0Ll9fdl9lbWl0dGVyID1cclxuICAgICAgICAgICAgaW50ZXJuYWxPcHRpb25zLl9fdl9lbWl0dGVyICE9IG51bGxcclxuICAgICAgICAgICAgICAgID8gaW50ZXJuYWxPcHRpb25zLl9fdl9lbWl0dGVyXHJcbiAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZDtcclxuICAgIH1cclxuICAgIC8vIE5PVEU6IGV4cGVyaW1lbnRhbCAhIVxyXG4gICAgaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB8fCBfX0lOVExJRllfUFJPRF9ERVZUT09MU19fKSB7XHJcbiAgICAgICAgaW5pdEkxOG5EZXZUb29scyhjb250ZXh0LCB2ZXJzaW9uLCBfX21ldGEpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNvbnRleHQ7XHJcbn1cclxuLyoqIEBpbnRlcm5hbCAqL1xyXG5mdW5jdGlvbiBpc1RyYW5zbGF0ZUZhbGxiYWNrV2FybihmYWxsYmFjaywga2V5KSB7XHJcbiAgICByZXR1cm4gZmFsbGJhY2sgaW5zdGFuY2VvZiBSZWdFeHAgPyBmYWxsYmFjay50ZXN0KGtleSkgOiBmYWxsYmFjaztcclxufVxyXG4vKiogQGludGVybmFsICovXHJcbmZ1bmN0aW9uIGlzVHJhbnNsYXRlTWlzc2luZ1dhcm4obWlzc2luZywga2V5KSB7XHJcbiAgICByZXR1cm4gbWlzc2luZyBpbnN0YW5jZW9mIFJlZ0V4cCA/IG1pc3NpbmcudGVzdChrZXkpIDogbWlzc2luZztcclxufVxyXG4vKiogQGludGVybmFsICovXHJcbmZ1bmN0aW9uIGhhbmRsZU1pc3NpbmcoY29udGV4dCwga2V5LCBsb2NhbGUsIG1pc3NpbmdXYXJuLCB0eXBlKSB7XHJcbiAgICBjb25zdCB7IG1pc3NpbmcsIG9uV2FybiB9ID0gY29udGV4dDtcclxuICAgIC8vIGZvciB2dWUtZGV2dG9vbHMgdGltZWxpbmUgZXZlbnRcclxuICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykpIHtcclxuICAgICAgICBjb25zdCBlbWl0dGVyID0gY29udGV4dC5fX3ZfZW1pdHRlcjtcclxuICAgICAgICBpZiAoZW1pdHRlcikge1xyXG4gICAgICAgICAgICBlbWl0dGVyLmVtaXQoXCJtaXNzaW5nXCIgLyogTUlTU0lORyAqLywge1xyXG4gICAgICAgICAgICAgICAgbG9jYWxlLFxyXG4gICAgICAgICAgICAgICAga2V5LFxyXG4gICAgICAgICAgICAgICAgdHlwZSxcclxuICAgICAgICAgICAgICAgIGdyb3VwSWQ6IGAke3R5cGV9OiR7a2V5fWBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKG1pc3NpbmcgIT09IG51bGwpIHtcclxuICAgICAgICBjb25zdCByZXQgPSBtaXNzaW5nKGNvbnRleHQsIGxvY2FsZSwga2V5LCB0eXBlKTtcclxuICAgICAgICByZXR1cm4gaXNTdHJpbmcocmV0KSA/IHJldCA6IGtleTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgJiYgaXNUcmFuc2xhdGVNaXNzaW5nV2FybihtaXNzaW5nV2Fybiwga2V5KSkge1xyXG4gICAgICAgICAgICBvbldhcm4oZ2V0V2Fybk1lc3NhZ2UoMCAvKiBOT1RfRk9VTkRfS0VZICovLCB7IGtleSwgbG9jYWxlIH0pKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGtleTtcclxuICAgIH1cclxufVxyXG4vKiogQGludGVybmFsICovXHJcbmZ1bmN0aW9uIGdldExvY2FsZUNoYWluKGN0eCwgZmFsbGJhY2ssIHN0YXJ0KSB7XHJcbiAgICBjb25zdCBjb250ZXh0ID0gY3R4O1xyXG4gICAgaWYgKCFjb250ZXh0Ll9fbG9jYWxlQ2hhaW5DYWNoZSkge1xyXG4gICAgICAgIGNvbnRleHQuX19sb2NhbGVDaGFpbkNhY2hlID0gbmV3IE1hcCgpO1xyXG4gICAgfVxyXG4gICAgbGV0IGNoYWluID0gY29udGV4dC5fX2xvY2FsZUNoYWluQ2FjaGUuZ2V0KHN0YXJ0KTtcclxuICAgIGlmICghY2hhaW4pIHtcclxuICAgICAgICBjaGFpbiA9IFtdO1xyXG4gICAgICAgIC8vIGZpcnN0IGJsb2NrIGRlZmluZWQgYnkgc3RhcnRcclxuICAgICAgICBsZXQgYmxvY2sgPSBbc3RhcnRdO1xyXG4gICAgICAgIC8vIHdoaWxlIGFueSBpbnRlcnZlbmluZyBibG9jayBmb3VuZFxyXG4gICAgICAgIHdoaWxlIChpc0FycmF5KGJsb2NrKSkge1xyXG4gICAgICAgICAgICBibG9jayA9IGFwcGVuZEJsb2NrVG9DaGFpbihjaGFpbiwgYmxvY2ssIGZhbGxiYWNrKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gcHJldHRpZXItaWdub3JlXHJcbiAgICAgICAgLy8gbGFzdCBibG9jayBkZWZpbmVkIGJ5IGRlZmF1bHRcclxuICAgICAgICBjb25zdCBkZWZhdWx0cyA9IGlzQXJyYXkoZmFsbGJhY2spXHJcbiAgICAgICAgICAgID8gZmFsbGJhY2tcclxuICAgICAgICAgICAgOiBpc1BsYWluT2JqZWN0KGZhbGxiYWNrKVxyXG4gICAgICAgICAgICAgICAgPyBmYWxsYmFja1snZGVmYXVsdCddXHJcbiAgICAgICAgICAgICAgICAgICAgPyBmYWxsYmFja1snZGVmYXVsdCddXHJcbiAgICAgICAgICAgICAgICAgICAgOiBudWxsXHJcbiAgICAgICAgICAgICAgICA6IGZhbGxiYWNrO1xyXG4gICAgICAgIC8vIGNvbnZlcnQgZGVmYXVsdHMgdG8gYXJyYXlcclxuICAgICAgICBibG9jayA9IGlzU3RyaW5nKGRlZmF1bHRzKSA/IFtkZWZhdWx0c10gOiBkZWZhdWx0cztcclxuICAgICAgICBpZiAoaXNBcnJheShibG9jaykpIHtcclxuICAgICAgICAgICAgYXBwZW5kQmxvY2tUb0NoYWluKGNoYWluLCBibG9jaywgZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb250ZXh0Ll9fbG9jYWxlQ2hhaW5DYWNoZS5zZXQoc3RhcnQsIGNoYWluKTtcclxuICAgIH1cclxuICAgIHJldHVybiBjaGFpbjtcclxufVxyXG5mdW5jdGlvbiBhcHBlbmRCbG9ja1RvQ2hhaW4oY2hhaW4sIGJsb2NrLCBibG9ja3MpIHtcclxuICAgIGxldCBmb2xsb3cgPSB0cnVlO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBibG9jay5sZW5ndGggJiYgaXNCb29sZWFuKGZvbGxvdyk7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IGxvY2FsZSA9IGJsb2NrW2ldO1xyXG4gICAgICAgIGlmIChpc1N0cmluZyhsb2NhbGUpKSB7XHJcbiAgICAgICAgICAgIGZvbGxvdyA9IGFwcGVuZExvY2FsZVRvQ2hhaW4oY2hhaW4sIGJsb2NrW2ldLCBibG9ja3MpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBmb2xsb3c7XHJcbn1cclxuZnVuY3Rpb24gYXBwZW5kTG9jYWxlVG9DaGFpbihjaGFpbiwgbG9jYWxlLCBibG9ja3MpIHtcclxuICAgIGxldCBmb2xsb3c7XHJcbiAgICBjb25zdCB0b2tlbnMgPSBsb2NhbGUuc3BsaXQoJy0nKTtcclxuICAgIGRvIHtcclxuICAgICAgICBjb25zdCB0YXJnZXQgPSB0b2tlbnMuam9pbignLScpO1xyXG4gICAgICAgIGZvbGxvdyA9IGFwcGVuZEl0ZW1Ub0NoYWluKGNoYWluLCB0YXJnZXQsIGJsb2Nrcyk7XHJcbiAgICAgICAgdG9rZW5zLnNwbGljZSgtMSwgMSk7XHJcbiAgICB9IHdoaWxlICh0b2tlbnMubGVuZ3RoICYmIGZvbGxvdyA9PT0gdHJ1ZSk7XHJcbiAgICByZXR1cm4gZm9sbG93O1xyXG59XHJcbmZ1bmN0aW9uIGFwcGVuZEl0ZW1Ub0NoYWluKGNoYWluLCB0YXJnZXQsIGJsb2Nrcykge1xyXG4gICAgbGV0IGZvbGxvdyA9IGZhbHNlO1xyXG4gICAgaWYgKCFjaGFpbi5pbmNsdWRlcyh0YXJnZXQpKSB7XHJcbiAgICAgICAgZm9sbG93ID0gdHJ1ZTtcclxuICAgICAgICBpZiAodGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIGZvbGxvdyA9IHRhcmdldFt0YXJnZXQubGVuZ3RoIC0gMV0gIT09ICchJztcclxuICAgICAgICAgICAgY29uc3QgbG9jYWxlID0gdGFyZ2V0LnJlcGxhY2UoLyEvZywgJycpO1xyXG4gICAgICAgICAgICBjaGFpbi5wdXNoKGxvY2FsZSk7XHJcbiAgICAgICAgICAgIGlmICgoaXNBcnJheShibG9ja3MpIHx8IGlzUGxhaW5PYmplY3QoYmxvY2tzKSkgJiZcclxuICAgICAgICAgICAgICAgIGJsb2Nrc1tsb2NhbGVdIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XHJcbiAgICAgICAgICAgICAgICBmb2xsb3cgPSBibG9ja3NbbG9jYWxlXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBmb2xsb3c7XHJcbn1cclxuLyoqIEBpbnRlcm5hbCAqL1xyXG5mdW5jdGlvbiB1cGRhdGVGYWxsYmFja0xvY2FsZShjdHgsIGxvY2FsZSwgZmFsbGJhY2spIHtcclxuICAgIGNvbnN0IGNvbnRleHQgPSBjdHg7XHJcbiAgICBjb250ZXh0Ll9fbG9jYWxlQ2hhaW5DYWNoZSA9IG5ldyBNYXAoKTtcclxuICAgIGdldExvY2FsZUNoYWluKGN0eCwgZmFsbGJhY2ssIGxvY2FsZSk7XHJcbn1cblxuY29uc3QgUkVfSFRNTF9UQUcgPSAvPFxcLz9bXFx3XFxzPVwiLy4nOjsjLVxcL10rPi87XHJcbmNvbnN0IFdBUk5fTUVTU0FHRSA9IGBEZXRlY3RlZCBIVE1MIGluICd7c291cmNlfScgbWVzc2FnZS4gUmVjb21tZW5kIG5vdCB1c2luZyBIVE1MIG1lc3NhZ2VzIHRvIGF2b2lkIFhTUy5gO1xyXG5mdW5jdGlvbiBjaGVja0h0bWxNZXNzYWdlKHNvdXJjZSwgb3B0aW9ucykge1xyXG4gICAgY29uc3Qgd2Fybkh0bWxNZXNzYWdlID0gaXNCb29sZWFuKG9wdGlvbnMud2Fybkh0bWxNZXNzYWdlKVxyXG4gICAgICAgID8gb3B0aW9ucy53YXJuSHRtbE1lc3NhZ2VcclxuICAgICAgICA6IHRydWU7XHJcbiAgICBpZiAod2Fybkh0bWxNZXNzYWdlICYmIFJFX0hUTUxfVEFHLnRlc3Qoc291cmNlKSkge1xyXG4gICAgICAgIHdhcm4oZm9ybWF0KFdBUk5fTUVTU0FHRSwgeyBzb3VyY2UgfSkpO1xyXG4gICAgfVxyXG59XHJcbmNvbnN0IGRlZmF1bHRPbkNhY2hlS2V5ID0gKHNvdXJjZSkgPT4gc291cmNlO1xyXG5sZXQgY29tcGlsZUNhY2hlID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcclxuZnVuY3Rpb24gY2xlYXJDb21waWxlQ2FjaGUoKSB7XHJcbiAgICBjb21waWxlQ2FjaGUgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xyXG59XHJcbmZ1bmN0aW9uIGNvbXBpbGVUb0Z1bmN0aW9uKHNvdXJjZSwgb3B0aW9ucyA9IHt9KSB7XHJcbiAgICB7XHJcbiAgICAgICAgLy8gY2hlY2sgSFRNTCBtZXNzYWdlXHJcbiAgICAgICAgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpICYmIGNoZWNrSHRtbE1lc3NhZ2Uoc291cmNlLCBvcHRpb25zKTtcclxuICAgICAgICAvLyBjaGVjayBjYWNoZXNcclxuICAgICAgICBjb25zdCBvbkNhY2hlS2V5ID0gb3B0aW9ucy5vbkNhY2hlS2V5IHx8IGRlZmF1bHRPbkNhY2hlS2V5O1xyXG4gICAgICAgIGNvbnN0IGtleSA9IG9uQ2FjaGVLZXkoc291cmNlKTtcclxuICAgICAgICBjb25zdCBjYWNoZWQgPSBjb21waWxlQ2FjaGVba2V5XTtcclxuICAgICAgICBpZiAoY2FjaGVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNvbXBpbGUgZXJyb3IgZGV0ZWN0aW5nXHJcbiAgICAgICAgbGV0IG9jY3VycmVkID0gZmFsc2U7XHJcbiAgICAgICAgY29uc3Qgb25FcnJvciA9IG9wdGlvbnMub25FcnJvciB8fCBkZWZhdWx0T25FcnJvcjtcclxuICAgICAgICBvcHRpb25zLm9uRXJyb3IgPSAoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgIG9jY3VycmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgb25FcnJvcihlcnIpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgLy8gY29tcGlsZVxyXG4gICAgICAgIGNvbnN0IHsgY29kZSB9ID0gYmFzZUNvbXBpbGUoc291cmNlLCBvcHRpb25zKTtcclxuICAgICAgICAvLyBldmFsdWF0ZSBmdW5jdGlvblxyXG4gICAgICAgIGNvbnN0IG1zZyA9IG5ldyBGdW5jdGlvbihgcmV0dXJuICR7Y29kZX1gKSgpO1xyXG4gICAgICAgIC8vIGlmIG9jY3VycmVkIGNvbXBpbGUgZXJyb3IsIGRvbid0IGNhY2hlXHJcbiAgICAgICAgcmV0dXJuICFvY2N1cnJlZCA/IChjb21waWxlQ2FjaGVba2V5XSA9IG1zZykgOiBtc2c7XHJcbiAgICB9XHJcbn1cblxuZnVuY3Rpb24gY3JlYXRlQ29yZUVycm9yKGNvZGUpIHtcclxuICAgIHJldHVybiBjcmVhdGVDb21waWxlRXJyb3IoY29kZSwgbnVsbCwgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpID8geyBtZXNzYWdlczogZXJyb3JNZXNzYWdlcyB9IDogdW5kZWZpbmVkKTtcclxufVxyXG4vKiogQGludGVybmFsICovXHJcbmNvbnN0IGVycm9yTWVzc2FnZXMgPSB7XHJcbiAgICBbMTQgLyogSU5WQUxJRF9BUkdVTUVOVCAqL106ICdJbnZhbGlkIGFyZ3VtZW50cycsXHJcbiAgICBbMTUgLyogSU5WQUxJRF9EQVRFX0FSR1VNRU5UICovXTogJ1RoZSBkYXRlIHByb3ZpZGVkIGlzIGFuIGludmFsaWQgRGF0ZSBvYmplY3QuJyArXHJcbiAgICAgICAgJ01ha2Ugc3VyZSB5b3VyIERhdGUgcmVwcmVzZW50cyBhIHZhbGlkIGRhdGUuJyxcclxuICAgIFsxNiAvKiBJTlZBTElEX0lTT19EQVRFX0FSR1VNRU5UICovXTogJ1RoZSBhcmd1bWVudCBwcm92aWRlZCBpcyBub3QgYSB2YWxpZCBJU08gZGF0ZSBzdHJpbmcnXHJcbn07XG5cbmNvbnN0IE5PT1BfTUVTU0FHRV9GVU5DVElPTiA9ICgpID0+ICcnO1xyXG5jb25zdCBpc01lc3NhZ2VGdW5jdGlvbiA9ICh2YWwpID0+IGlzRnVuY3Rpb24odmFsKTtcclxuLy8gaW1wbGVtZW50YXRpb24gb2YgYHRyYW5zbGF0ZWAgZnVuY3Rpb25cclxuZnVuY3Rpb24gdHJhbnNsYXRlKGNvbnRleHQsIC4uLmFyZ3MpIHtcclxuICAgIGNvbnN0IHsgZmFsbGJhY2tGb3JtYXQsIHBvc3RUcmFuc2xhdGlvbiwgdW5yZXNvbHZpbmcsIGZhbGxiYWNrTG9jYWxlLCBtZXNzYWdlcyB9ID0gY29udGV4dDtcclxuICAgIGNvbnN0IFtrZXksIG9wdGlvbnNdID0gcGFyc2VUcmFuc2xhdGVBcmdzKC4uLmFyZ3MpO1xyXG4gICAgY29uc3QgbWlzc2luZ1dhcm4gPSBpc0Jvb2xlYW4ob3B0aW9ucy5taXNzaW5nV2FybilcclxuICAgICAgICA/IG9wdGlvbnMubWlzc2luZ1dhcm5cclxuICAgICAgICA6IGNvbnRleHQubWlzc2luZ1dhcm47XHJcbiAgICBjb25zdCBmYWxsYmFja1dhcm4gPSBpc0Jvb2xlYW4ob3B0aW9ucy5mYWxsYmFja1dhcm4pXHJcbiAgICAgICAgPyBvcHRpb25zLmZhbGxiYWNrV2FyblxyXG4gICAgICAgIDogY29udGV4dC5mYWxsYmFja1dhcm47XHJcbiAgICBjb25zdCBlc2NhcGVQYXJhbWV0ZXIgPSBpc0Jvb2xlYW4ob3B0aW9ucy5lc2NhcGVQYXJhbWV0ZXIpXHJcbiAgICAgICAgPyBvcHRpb25zLmVzY2FwZVBhcmFtZXRlclxyXG4gICAgICAgIDogY29udGV4dC5lc2NhcGVQYXJhbWV0ZXI7XHJcbiAgICBjb25zdCByZXNvbHZlZE1lc3NhZ2UgPSAhIW9wdGlvbnMucmVzb2x2ZWRNZXNzYWdlO1xyXG4gICAgLy8gcHJldHRpZXItaWdub3JlXHJcbiAgICBjb25zdCBkZWZhdWx0TXNnT3JLZXkgPSBpc1N0cmluZyhvcHRpb25zLmRlZmF1bHQpIHx8IGlzQm9vbGVhbihvcHRpb25zLmRlZmF1bHQpIC8vIGRlZmF1bHQgYnkgZnVuY3Rpb24gb3B0aW9uXHJcbiAgICAgICAgPyAhaXNCb29sZWFuKG9wdGlvbnMuZGVmYXVsdClcclxuICAgICAgICAgICAgPyBvcHRpb25zLmRlZmF1bHRcclxuICAgICAgICAgICAgOiBrZXlcclxuICAgICAgICA6IGZhbGxiYWNrRm9ybWF0IC8vIGRlZmF1bHQgYnkgYGZhbGxiYWNrRm9ybWF0YCBvcHRpb25cclxuICAgICAgICAgICAgPyBrZXlcclxuICAgICAgICAgICAgOiAnJztcclxuICAgIGNvbnN0IGVuYWJsZURlZmF1bHRNc2cgPSBmYWxsYmFja0Zvcm1hdCB8fCBkZWZhdWx0TXNnT3JLZXkgIT09ICcnO1xyXG4gICAgY29uc3QgbG9jYWxlID0gaXNTdHJpbmcob3B0aW9ucy5sb2NhbGUpID8gb3B0aW9ucy5sb2NhbGUgOiBjb250ZXh0LmxvY2FsZTtcclxuICAgIC8vIGVzY2FwZSBwYXJhbXNcclxuICAgIGVzY2FwZVBhcmFtZXRlciAmJiBlc2NhcGVQYXJhbXMob3B0aW9ucyk7XHJcbiAgICAvLyByZXNvbHZlIG1lc3NhZ2UgZm9ybWF0XHJcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcHJlZmVyLWNvbnN0XHJcbiAgICBsZXQgW2Zvcm1hdCwgdGFyZ2V0TG9jYWxlLCBtZXNzYWdlXSA9ICFyZXNvbHZlZE1lc3NhZ2VcclxuICAgICAgICA/IHJlc29sdmVNZXNzYWdlRm9ybWF0KGNvbnRleHQsIGtleSwgbG9jYWxlLCBmYWxsYmFja0xvY2FsZSwgZmFsbGJhY2tXYXJuLCBtaXNzaW5nV2FybilcclxuICAgICAgICA6IFtcclxuICAgICAgICAgICAga2V5LFxyXG4gICAgICAgICAgICBsb2NhbGUsXHJcbiAgICAgICAgICAgIG1lc3NhZ2VzW2xvY2FsZV0gfHwge31cclxuICAgICAgICBdO1xyXG4gICAgLy8gaWYgeW91IHVzZSBkZWZhdWx0IG1lc3NhZ2UsIHNldCBpdCBhcyBtZXNzYWdlIGZvcm1hdCFcclxuICAgIGxldCBjYWNoZUJhc2VLZXkgPSBrZXk7XHJcbiAgICBpZiAoIXJlc29sdmVkTWVzc2FnZSAmJlxyXG4gICAgICAgICEoaXNTdHJpbmcoZm9ybWF0KSB8fCBpc01lc3NhZ2VGdW5jdGlvbihmb3JtYXQpKSkge1xyXG4gICAgICAgIGlmIChlbmFibGVEZWZhdWx0TXNnKSB7XHJcbiAgICAgICAgICAgIGZvcm1hdCA9IGRlZmF1bHRNc2dPcktleTtcclxuICAgICAgICAgICAgY2FjaGVCYXNlS2V5ID0gZm9ybWF0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIGNoZWNraW5nIG1lc3NhZ2UgZm9ybWF0IGFuZCB0YXJnZXQgbG9jYWxlXHJcbiAgICBpZiAoIXJlc29sdmVkTWVzc2FnZSAmJlxyXG4gICAgICAgICghKGlzU3RyaW5nKGZvcm1hdCkgfHwgaXNNZXNzYWdlRnVuY3Rpb24oZm9ybWF0KSkgfHxcclxuICAgICAgICAgICAgIWlzU3RyaW5nKHRhcmdldExvY2FsZSkpKSB7XHJcbiAgICAgICAgcmV0dXJuIHVucmVzb2x2aW5nID8gTk9UX1JFT1NMVkVEIDoga2V5O1xyXG4gICAgfVxyXG4gICAgaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSAmJiBpc1N0cmluZyhmb3JtYXQpICYmIGNvbnRleHQubWVzc2FnZUNvbXBpbGVyID09IG51bGwpIHtcclxuICAgICAgICB3YXJuKGBUaGUgbWVzc2FnZSBmb3JtYXQgY29tcGlsYXRpb24gaXMgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJ1aWxkLiBgICtcclxuICAgICAgICAgICAgYEJlY2F1c2UgbWVzc2FnZSBjb21waWxlciBpc24ndCBpbmNsdWRlZC4gYCArXHJcbiAgICAgICAgICAgIGBZb3UgbmVlZCB0byBwcmUtY29tcGlsYXRpb24gYWxsIG1lc3NhZ2UgZm9ybWF0LiBgICtcclxuICAgICAgICAgICAgYFNvIHRyYW5zbGF0ZSBmdW5jdGlvbiByZXR1cm4gJyR7a2V5fScuYCk7XHJcbiAgICAgICAgcmV0dXJuIGtleTtcclxuICAgIH1cclxuICAgIC8vIHNldHVwIGNvbXBpbGUgZXJyb3IgZGV0ZWN0aW5nXHJcbiAgICBsZXQgb2NjdXJyZWQgPSBmYWxzZTtcclxuICAgIGNvbnN0IGVycm9yRGV0ZWN0b3IgPSAoKSA9PiB7XHJcbiAgICAgICAgb2NjdXJyZWQgPSB0cnVlO1xyXG4gICAgfTtcclxuICAgIC8vIGNvbXBpbGUgbWVzc2FnZSBmb3JtYXRcclxuICAgIGNvbnN0IG1zZyA9ICFpc01lc3NhZ2VGdW5jdGlvbihmb3JtYXQpXHJcbiAgICAgICAgPyBjb21waWxlTWVzc2FnZUZvcm1hdChjb250ZXh0LCBrZXksIHRhcmdldExvY2FsZSwgZm9ybWF0LCBjYWNoZUJhc2VLZXksIGVycm9yRGV0ZWN0b3IpXHJcbiAgICAgICAgOiBmb3JtYXQ7XHJcbiAgICAvLyBpZiBvY2N1cnJlZCBjb21waWxlIGVycm9yLCByZXR1cm4gdGhlIG1lc3NhZ2UgZm9ybWF0XHJcbiAgICBpZiAob2NjdXJyZWQpIHtcclxuICAgICAgICByZXR1cm4gZm9ybWF0O1xyXG4gICAgfVxyXG4gICAgLy8gZXZhbHVhdGUgbWVzc2FnZSB3aXRoIGNvbnRleHRcclxuICAgIGNvbnN0IGN0eE9wdGlvbnMgPSBnZXRNZXNzYWdlQ29udGV4dE9wdGlvbnMoY29udGV4dCwgdGFyZ2V0TG9jYWxlLCBtZXNzYWdlLCBvcHRpb25zKTtcclxuICAgIGNvbnN0IG1zZ0NvbnRleHQgPSBjcmVhdGVNZXNzYWdlQ29udGV4dChjdHhPcHRpb25zKTtcclxuICAgIGNvbnN0IG1lc3NhZ2VkID0gZXZhbHVhdGVNZXNzYWdlKGNvbnRleHQsIG1zZywgbXNnQ29udGV4dCk7XHJcbiAgICAvLyBpZiB1c2UgcG9zdCB0cmFuc2xhdGlvbiBvcHRpb24sIHByb2NlZWQgaXQgd2l0aCBoYW5kbGVyXHJcbiAgICBjb25zdCByZXQgPSBwb3N0VHJhbnNsYXRpb24gPyBwb3N0VHJhbnNsYXRpb24obWVzc2FnZWQpIDogbWVzc2FnZWQ7XHJcbiAgICAvLyBOT1RFOiBleHBlcmltZW50YWwgISFcclxuICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgfHwgX19JTlRMSUZZX1BST0RfREVWVE9PTFNfXykge1xyXG4gICAgICAgIC8vIHByZXR0aWVyLWlnbm9yZVxyXG4gICAgICAgIGNvbnN0IHBheWxvYWRzID0ge1xyXG4gICAgICAgICAgICB0aW1lc3RhbXA6IERhdGUubm93KCksXHJcbiAgICAgICAgICAgIGtleTogaXNTdHJpbmcoa2V5KVxyXG4gICAgICAgICAgICAgICAgPyBrZXlcclxuICAgICAgICAgICAgICAgIDogaXNNZXNzYWdlRnVuY3Rpb24oZm9ybWF0KVxyXG4gICAgICAgICAgICAgICAgICAgID8gZm9ybWF0LmtleVxyXG4gICAgICAgICAgICAgICAgICAgIDogJycsXHJcbiAgICAgICAgICAgIGxvY2FsZTogdGFyZ2V0TG9jYWxlIHx8IChpc01lc3NhZ2VGdW5jdGlvbihmb3JtYXQpXHJcbiAgICAgICAgICAgICAgICA/IGZvcm1hdC5sb2NhbGVcclxuICAgICAgICAgICAgICAgIDogJycpLFxyXG4gICAgICAgICAgICBmb3JtYXQ6IGlzU3RyaW5nKGZvcm1hdClcclxuICAgICAgICAgICAgICAgID8gZm9ybWF0XHJcbiAgICAgICAgICAgICAgICA6IGlzTWVzc2FnZUZ1bmN0aW9uKGZvcm1hdClcclxuICAgICAgICAgICAgICAgICAgICA/IGZvcm1hdC5zb3VyY2VcclxuICAgICAgICAgICAgICAgICAgICA6ICcnLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiByZXRcclxuICAgICAgICB9O1xyXG4gICAgICAgIHBheWxvYWRzLm1ldGEgPSBhc3NpZ24oe30sIGNvbnRleHQuX19tZXRhLCBnZXRBZGRpdGlvbmFsTWV0YSgpIHx8IHt9KTtcclxuICAgICAgICB0cmFuc2xhdGVEZXZUb29scyhwYXlsb2Fkcyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmV0O1xyXG59XHJcbmZ1bmN0aW9uIGVzY2FwZVBhcmFtcyhvcHRpb25zKSB7XHJcbiAgICBpZiAoaXNBcnJheShvcHRpb25zLmxpc3QpKSB7XHJcbiAgICAgICAgb3B0aW9ucy5saXN0ID0gb3B0aW9ucy5saXN0Lm1hcChpdGVtID0+IGlzU3RyaW5nKGl0ZW0pID8gZXNjYXBlSHRtbChpdGVtKSA6IGl0ZW0pO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoaXNPYmplY3Qob3B0aW9ucy5uYW1lZCkpIHtcclxuICAgICAgICBPYmplY3Qua2V5cyhvcHRpb25zLm5hbWVkKS5mb3JFYWNoKGtleSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpc1N0cmluZyhvcHRpb25zLm5hbWVkW2tleV0pKSB7XHJcbiAgICAgICAgICAgICAgICBvcHRpb25zLm5hbWVkW2tleV0gPSBlc2NhcGVIdG1sKG9wdGlvbnMubmFtZWRba2V5XSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiByZXNvbHZlTWVzc2FnZUZvcm1hdChjb250ZXh0LCBrZXksIGxvY2FsZSwgZmFsbGJhY2tMb2NhbGUsIGZhbGxiYWNrV2FybiwgbWlzc2luZ1dhcm4pIHtcclxuICAgIGNvbnN0IHsgbWVzc2FnZXMsIG9uV2FybiB9ID0gY29udGV4dDtcclxuICAgIGNvbnN0IGxvY2FsZXMgPSBnZXRMb2NhbGVDaGFpbihjb250ZXh0LCBmYWxsYmFja0xvY2FsZSwgbG9jYWxlKTtcclxuICAgIGxldCBtZXNzYWdlID0ge307XHJcbiAgICBsZXQgdGFyZ2V0TG9jYWxlO1xyXG4gICAgbGV0IGZvcm1hdCA9IG51bGw7XHJcbiAgICBsZXQgZnJvbSA9IGxvY2FsZTtcclxuICAgIGxldCB0byA9IG51bGw7XHJcbiAgICBjb25zdCB0eXBlID0gJ3RyYW5zbGF0ZSc7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxvY2FsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB0YXJnZXRMb2NhbGUgPSB0byA9IGxvY2FsZXNbaV07XHJcbiAgICAgICAgaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSAmJlxyXG4gICAgICAgICAgICBsb2NhbGUgIT09IHRhcmdldExvY2FsZSAmJlxyXG4gICAgICAgICAgICBpc1RyYW5zbGF0ZUZhbGxiYWNrV2FybihmYWxsYmFja1dhcm4sIGtleSkpIHtcclxuICAgICAgICAgICAgb25XYXJuKGdldFdhcm5NZXNzYWdlKDEgLyogRkFMTEJBQ0tfVE9fVFJBTlNMQVRFICovLCB7XHJcbiAgICAgICAgICAgICAgICBrZXksXHJcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IHRhcmdldExvY2FsZVxyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGZvciB2dWUtZGV2dG9vbHMgdGltZWxpbmUgZXZlbnRcclxuICAgICAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpICYmIGxvY2FsZSAhPT0gdGFyZ2V0TG9jYWxlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGVtaXR0ZXIgPSBjb250ZXh0Ll9fdl9lbWl0dGVyO1xyXG4gICAgICAgICAgICBpZiAoZW1pdHRlcikge1xyXG4gICAgICAgICAgICAgICAgZW1pdHRlci5lbWl0KFwiZmFsbGJhY2tcIiAvKiBGQUxCQUNLICovLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZSxcclxuICAgICAgICAgICAgICAgICAgICBrZXksXHJcbiAgICAgICAgICAgICAgICAgICAgZnJvbSxcclxuICAgICAgICAgICAgICAgICAgICB0byxcclxuICAgICAgICAgICAgICAgICAgICBncm91cElkOiBgJHt0eXBlfToke2tleX1gXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBtZXNzYWdlID1cclxuICAgICAgICAgICAgbWVzc2FnZXNbdGFyZ2V0TG9jYWxlXSB8fCB7fTtcclxuICAgICAgICAvLyBmb3IgdnVlLWRldnRvb2xzIHRpbWVsaW5lIGV2ZW50XHJcbiAgICAgICAgbGV0IHN0YXJ0ID0gbnVsbDtcclxuICAgICAgICBsZXQgc3RhcnRUYWc7XHJcbiAgICAgICAgbGV0IGVuZFRhZztcclxuICAgICAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpICYmIGluQnJvd3Nlcikge1xyXG4gICAgICAgICAgICBzdGFydCA9IHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKTtcclxuICAgICAgICAgICAgc3RhcnRUYWcgPSAnaW50bGlmeS1tZXNzYWdlLXJlc29sdmUtc3RhcnQnO1xyXG4gICAgICAgICAgICBlbmRUYWcgPSAnaW50bGlmeS1tZXNzYWdlLXJlc29sdmUtZW5kJztcclxuICAgICAgICAgICAgbWFyayAmJiBtYXJrKHN0YXJ0VGFnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKChmb3JtYXQgPSByZXNvbHZlVmFsdWUobWVzc2FnZSwga2V5KSkgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgLy8gaWYgbnVsbCwgcmVzb2x2ZSB3aXRoIG9iamVjdCBrZXkgcGF0aFxyXG4gICAgICAgICAgICBmb3JtYXQgPSBtZXNzYWdlW2tleV07IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBmb3IgdnVlLWRldnRvb2xzIHRpbWVsaW5lIGV2ZW50XHJcbiAgICAgICAgaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSAmJiBpbkJyb3dzZXIpIHtcclxuICAgICAgICAgICAgY29uc3QgZW5kID0gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgICAgICAgICBjb25zdCBlbWl0dGVyID0gY29udGV4dC5fX3ZfZW1pdHRlcjtcclxuICAgICAgICAgICAgaWYgKGVtaXR0ZXIgJiYgc3RhcnQgJiYgZm9ybWF0KSB7XHJcbiAgICAgICAgICAgICAgICBlbWl0dGVyLmVtaXQoXCJtZXNzYWdlLXJlc29sdmVcIiAvKiBNRVNTQUdFX1JFU09MVkUgKi8sIHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIm1lc3NhZ2UtcmVzb2x2ZVwiIC8qIE1FU1NBR0VfUkVTT0xWRSAqLyxcclxuICAgICAgICAgICAgICAgICAgICBrZXksXHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogZm9ybWF0LFxyXG4gICAgICAgICAgICAgICAgICAgIHRpbWU6IGVuZCAtIHN0YXJ0LFxyXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwSWQ6IGAke3R5cGV9OiR7a2V5fWBcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzdGFydFRhZyAmJiBlbmRUYWcgJiYgbWFyayAmJiBtZWFzdXJlKSB7XHJcbiAgICAgICAgICAgICAgICBtYXJrKGVuZFRhZyk7XHJcbiAgICAgICAgICAgICAgICBtZWFzdXJlKCdpbnRsaWZ5IG1lc3NhZ2UgcmVzb2x2ZScsIHN0YXJ0VGFnLCBlbmRUYWcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpc1N0cmluZyhmb3JtYXQpIHx8IGlzRnVuY3Rpb24oZm9ybWF0KSlcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY29uc3QgbWlzc2luZ1JldCA9IGhhbmRsZU1pc3NpbmcoY29udGV4dCwga2V5LCB0YXJnZXRMb2NhbGUsIG1pc3NpbmdXYXJuLCB0eXBlKTtcclxuICAgICAgICBpZiAobWlzc2luZ1JldCAhPT0ga2V5KSB7XHJcbiAgICAgICAgICAgIGZvcm1hdCA9IG1pc3NpbmdSZXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZyb20gPSB0bztcclxuICAgIH1cclxuICAgIHJldHVybiBbZm9ybWF0LCB0YXJnZXRMb2NhbGUsIG1lc3NhZ2VdO1xyXG59XHJcbmZ1bmN0aW9uIGNvbXBpbGVNZXNzYWdlRm9ybWF0KGNvbnRleHQsIGtleSwgdGFyZ2V0TG9jYWxlLCBmb3JtYXQsIGNhY2hlQmFzZUtleSwgZXJyb3JEZXRlY3Rvcikge1xyXG4gICAgY29uc3QgeyBtZXNzYWdlQ29tcGlsZXIsIHdhcm5IdG1sTWVzc2FnZSB9ID0gY29udGV4dDtcclxuICAgIGlmIChpc01lc3NhZ2VGdW5jdGlvbihmb3JtYXQpKSB7XHJcbiAgICAgICAgY29uc3QgbXNnID0gZm9ybWF0O1xyXG4gICAgICAgIG1zZy5sb2NhbGUgPSBtc2cubG9jYWxlIHx8IHRhcmdldExvY2FsZTtcclxuICAgICAgICBtc2cua2V5ID0gbXNnLmtleSB8fCBrZXk7XHJcbiAgICAgICAgcmV0dXJuIG1zZztcclxuICAgIH1cclxuICAgIC8vIGZvciB2dWUtZGV2dG9vbHMgdGltZWxpbmUgZXZlbnRcclxuICAgIGxldCBzdGFydCA9IG51bGw7XHJcbiAgICBsZXQgc3RhcnRUYWc7XHJcbiAgICBsZXQgZW5kVGFnO1xyXG4gICAgaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSAmJiBpbkJyb3dzZXIpIHtcclxuICAgICAgICBzdGFydCA9IHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKTtcclxuICAgICAgICBzdGFydFRhZyA9ICdpbnRsaWZ5LW1lc3NhZ2UtY29tcGlsYXRpb24tc3RhcnQnO1xyXG4gICAgICAgIGVuZFRhZyA9ICdpbnRsaWZ5LW1lc3NhZ2UtY29tcGlsYXRpb24tZW5kJztcclxuICAgICAgICBtYXJrICYmIG1hcmsoc3RhcnRUYWcpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgbXNnID0gbWVzc2FnZUNvbXBpbGVyKGZvcm1hdCwgZ2V0Q29tcGlsZU9wdGlvbnMoY29udGV4dCwgdGFyZ2V0TG9jYWxlLCBjYWNoZUJhc2VLZXksIGZvcm1hdCwgd2Fybkh0bWxNZXNzYWdlLCBlcnJvckRldGVjdG9yKSk7XHJcbiAgICAvLyBmb3IgdnVlLWRldnRvb2xzIHRpbWVsaW5lIGV2ZW50XHJcbiAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpICYmIGluQnJvd3Nlcikge1xyXG4gICAgICAgIGNvbnN0IGVuZCA9IHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKTtcclxuICAgICAgICBjb25zdCBlbWl0dGVyID0gY29udGV4dC5fX3ZfZW1pdHRlcjtcclxuICAgICAgICBpZiAoZW1pdHRlciAmJiBzdGFydCkge1xyXG4gICAgICAgICAgICBlbWl0dGVyLmVtaXQoXCJtZXNzYWdlLWNvbXBpbGF0aW9uXCIgLyogTUVTU0FHRV9DT01QSUxBVElPTiAqLywge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJtZXNzYWdlLWNvbXBpbGF0aW9uXCIgLyogTUVTU0FHRV9DT01QSUxBVElPTiAqLyxcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGZvcm1hdCxcclxuICAgICAgICAgICAgICAgIHRpbWU6IGVuZCAtIHN0YXJ0LFxyXG4gICAgICAgICAgICAgICAgZ3JvdXBJZDogYCR7J3RyYW5zbGF0ZSd9OiR7a2V5fWBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChzdGFydFRhZyAmJiBlbmRUYWcgJiYgbWFyayAmJiBtZWFzdXJlKSB7XHJcbiAgICAgICAgICAgIG1hcmsoZW5kVGFnKTtcclxuICAgICAgICAgICAgbWVhc3VyZSgnaW50bGlmeSBtZXNzYWdlIGNvbXBpbGF0aW9uJywgc3RhcnRUYWcsIGVuZFRhZyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgbXNnLmxvY2FsZSA9IHRhcmdldExvY2FsZTtcclxuICAgIG1zZy5rZXkgPSBrZXk7XHJcbiAgICBtc2cuc291cmNlID0gZm9ybWF0O1xyXG4gICAgcmV0dXJuIG1zZztcclxufVxyXG5mdW5jdGlvbiBldmFsdWF0ZU1lc3NhZ2UoY29udGV4dCwgbXNnLCBtc2dDdHgpIHtcclxuICAgIC8vIGZvciB2dWUtZGV2dG9vbHMgdGltZWxpbmUgZXZlbnRcclxuICAgIGxldCBzdGFydCA9IG51bGw7XHJcbiAgICBsZXQgc3RhcnRUYWc7XHJcbiAgICBsZXQgZW5kVGFnO1xyXG4gICAgaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSAmJiBpbkJyb3dzZXIpIHtcclxuICAgICAgICBzdGFydCA9IHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKTtcclxuICAgICAgICBzdGFydFRhZyA9ICdpbnRsaWZ5LW1lc3NhZ2UtZXZhbHVhdGlvbi1zdGFydCc7XHJcbiAgICAgICAgZW5kVGFnID0gJ2ludGxpZnktbWVzc2FnZS1ldmFsdWF0aW9uLWVuZCc7XHJcbiAgICAgICAgbWFyayAmJiBtYXJrKHN0YXJ0VGFnKTtcclxuICAgIH1cclxuICAgIGNvbnN0IG1lc3NhZ2VkID0gbXNnKG1zZ0N0eCk7XHJcbiAgICAvLyBmb3IgdnVlLWRldnRvb2xzIHRpbWVsaW5lIGV2ZW50XHJcbiAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpICYmIGluQnJvd3Nlcikge1xyXG4gICAgICAgIGNvbnN0IGVuZCA9IHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKTtcclxuICAgICAgICBjb25zdCBlbWl0dGVyID0gY29udGV4dC5fX3ZfZW1pdHRlcjtcclxuICAgICAgICBpZiAoZW1pdHRlciAmJiBzdGFydCkge1xyXG4gICAgICAgICAgICBlbWl0dGVyLmVtaXQoXCJtZXNzYWdlLWV2YWx1YXRpb25cIiAvKiBNRVNTQUdFX0VWQUxVQVRJT04gKi8sIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6IFwibWVzc2FnZS1ldmFsdWF0aW9uXCIgLyogTUVTU0FHRV9FVkFMVUFUSU9OICovLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IG1lc3NhZ2VkLFxyXG4gICAgICAgICAgICAgICAgdGltZTogZW5kIC0gc3RhcnQsXHJcbiAgICAgICAgICAgICAgICBncm91cElkOiBgJHsndHJhbnNsYXRlJ306JHttc2cua2V5fWBcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChzdGFydFRhZyAmJiBlbmRUYWcgJiYgbWFyayAmJiBtZWFzdXJlKSB7XHJcbiAgICAgICAgICAgIG1hcmsoZW5kVGFnKTtcclxuICAgICAgICAgICAgbWVhc3VyZSgnaW50bGlmeSBtZXNzYWdlIGV2YWx1YXRpb24nLCBzdGFydFRhZywgZW5kVGFnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbWVzc2FnZWQ7XHJcbn1cclxuLyoqIEBpbnRlcm5hbCAqL1xyXG5mdW5jdGlvbiBwYXJzZVRyYW5zbGF0ZUFyZ3MoLi4uYXJncykge1xyXG4gICAgY29uc3QgW2FyZzEsIGFyZzIsIGFyZzNdID0gYXJncztcclxuICAgIGNvbnN0IG9wdGlvbnMgPSB7fTtcclxuICAgIGlmICghaXNTdHJpbmcoYXJnMSkgJiYgIWlzTnVtYmVyKGFyZzEpICYmICFpc01lc3NhZ2VGdW5jdGlvbihhcmcxKSkge1xyXG4gICAgICAgIHRocm93IGNyZWF0ZUNvcmVFcnJvcigxNCAvKiBJTlZBTElEX0FSR1VNRU5UICovKTtcclxuICAgIH1cclxuICAgIC8vIHByZXR0aWVyLWlnbm9yZVxyXG4gICAgY29uc3Qga2V5ID0gaXNOdW1iZXIoYXJnMSlcclxuICAgICAgICA/IFN0cmluZyhhcmcxKVxyXG4gICAgICAgIDogaXNNZXNzYWdlRnVuY3Rpb24oYXJnMSlcclxuICAgICAgICAgICAgPyBhcmcxXHJcbiAgICAgICAgICAgIDogYXJnMTtcclxuICAgIGlmIChpc051bWJlcihhcmcyKSkge1xyXG4gICAgICAgIG9wdGlvbnMucGx1cmFsID0gYXJnMjtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGlzU3RyaW5nKGFyZzIpKSB7XHJcbiAgICAgICAgb3B0aW9ucy5kZWZhdWx0ID0gYXJnMjtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGlzUGxhaW5PYmplY3QoYXJnMikgJiYgIWlzRW1wdHlPYmplY3QoYXJnMikpIHtcclxuICAgICAgICBvcHRpb25zLm5hbWVkID0gYXJnMjtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGlzQXJyYXkoYXJnMikpIHtcclxuICAgICAgICBvcHRpb25zLmxpc3QgPSBhcmcyO1xyXG4gICAgfVxyXG4gICAgaWYgKGlzTnVtYmVyKGFyZzMpKSB7XHJcbiAgICAgICAgb3B0aW9ucy5wbHVyYWwgPSBhcmczO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoaXNTdHJpbmcoYXJnMykpIHtcclxuICAgICAgICBvcHRpb25zLmRlZmF1bHQgPSBhcmczO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoaXNQbGFpbk9iamVjdChhcmczKSkge1xyXG4gICAgICAgIGFzc2lnbihvcHRpb25zLCBhcmczKTtcclxuICAgIH1cclxuICAgIHJldHVybiBba2V5LCBvcHRpb25zXTtcclxufVxyXG5mdW5jdGlvbiBnZXRDb21waWxlT3B0aW9ucyhjb250ZXh0LCBsb2NhbGUsIGtleSwgc291cmNlLCB3YXJuSHRtbE1lc3NhZ2UsIGVycm9yRGV0ZWN0b3IpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgd2Fybkh0bWxNZXNzYWdlLFxyXG4gICAgICAgIG9uRXJyb3I6IChlcnIpID0+IHtcclxuICAgICAgICAgICAgZXJyb3JEZXRlY3RvciAmJiBlcnJvckRldGVjdG9yKGVycik7XHJcbiAgICAgICAgICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBgTWVzc2FnZSBjb21waWxhdGlvbiBlcnJvcjogJHtlcnIubWVzc2FnZX1gO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY29kZUZyYW1lID0gZXJyLmxvY2F0aW9uICYmXHJcbiAgICAgICAgICAgICAgICAgICAgZ2VuZXJhdGVDb2RlRnJhbWUoc291cmNlLCBlcnIubG9jYXRpb24uc3RhcnQub2Zmc2V0LCBlcnIubG9jYXRpb24uZW5kLm9mZnNldCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlbWl0dGVyID0gY29udGV4dFxyXG4gICAgICAgICAgICAgICAgICAgIC5fX3ZfZW1pdHRlcjtcclxuICAgICAgICAgICAgICAgIGlmIChlbWl0dGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZW1pdHRlci5lbWl0KFwiY29tcGlsZS1lcnJvclwiIC8qIENPTVBJTEVfRVJST1IgKi8sIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogc291cmNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogZXJyLm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0OiBlcnIubG9jYXRpb24gJiYgZXJyLmxvY2F0aW9uLnN0YXJ0Lm9mZnNldCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kOiBlcnIubG9jYXRpb24gJiYgZXJyLmxvY2F0aW9uLmVuZC5vZmZzZXQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwSWQ6IGAkeyd0cmFuc2xhdGUnfToke2tleX1gXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGNvZGVGcmFtZSA/IGAke21lc3NhZ2V9XFxuJHtjb2RlRnJhbWV9YCA6IG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBvbkNhY2hlS2V5OiAoc291cmNlKSA9PiBnZW5lcmF0ZUZvcm1hdENhY2hlS2V5KGxvY2FsZSwga2V5LCBzb3VyY2UpXHJcbiAgICB9O1xyXG59XHJcbmZ1bmN0aW9uIGdldE1lc3NhZ2VDb250ZXh0T3B0aW9ucyhjb250ZXh0LCBsb2NhbGUsIG1lc3NhZ2UsIG9wdGlvbnMpIHtcclxuICAgIGNvbnN0IHsgbW9kaWZpZXJzLCBwbHVyYWxSdWxlcyB9ID0gY29udGV4dDtcclxuICAgIGNvbnN0IHJlc29sdmVNZXNzYWdlID0gKGtleSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHZhbCA9IHJlc29sdmVWYWx1ZShtZXNzYWdlLCBrZXkpO1xyXG4gICAgICAgIGlmIChpc1N0cmluZyh2YWwpKSB7XHJcbiAgICAgICAgICAgIGxldCBvY2N1cnJlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBjb25zdCBlcnJvckRldGVjdG9yID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgb2NjdXJyZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBjb25zdCBtc2cgPSBjb21waWxlTWVzc2FnZUZvcm1hdChjb250ZXh0LCBrZXksIGxvY2FsZSwgdmFsLCBrZXksIGVycm9yRGV0ZWN0b3IpO1xyXG4gICAgICAgICAgICByZXR1cm4gIW9jY3VycmVkXHJcbiAgICAgICAgICAgICAgICA/IG1zZ1xyXG4gICAgICAgICAgICAgICAgOiBOT09QX01FU1NBR0VfRlVOQ1RJT047XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGlzTWVzc2FnZUZ1bmN0aW9uKHZhbCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHZhbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIFRPRE86IHNob3VsZCBiZSBpbXBsZW1lbnRlZCB3YXJuaW5nIG1lc3NhZ2VcclxuICAgICAgICAgICAgcmV0dXJuIE5PT1BfTUVTU0FHRV9GVU5DVElPTjtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgY29uc3QgY3R4T3B0aW9ucyA9IHtcclxuICAgICAgICBsb2NhbGUsXHJcbiAgICAgICAgbW9kaWZpZXJzLFxyXG4gICAgICAgIHBsdXJhbFJ1bGVzLFxyXG4gICAgICAgIG1lc3NhZ2VzOiByZXNvbHZlTWVzc2FnZVxyXG4gICAgfTtcclxuICAgIGlmIChjb250ZXh0LnByb2Nlc3Nvcikge1xyXG4gICAgICAgIGN0eE9wdGlvbnMucHJvY2Vzc29yID0gY29udGV4dC5wcm9jZXNzb3I7XHJcbiAgICB9XHJcbiAgICBpZiAob3B0aW9ucy5saXN0KSB7XHJcbiAgICAgICAgY3R4T3B0aW9ucy5saXN0ID0gb3B0aW9ucy5saXN0O1xyXG4gICAgfVxyXG4gICAgaWYgKG9wdGlvbnMubmFtZWQpIHtcclxuICAgICAgICBjdHhPcHRpb25zLm5hbWVkID0gb3B0aW9ucy5uYW1lZDtcclxuICAgIH1cclxuICAgIGlmIChpc051bWJlcihvcHRpb25zLnBsdXJhbCkpIHtcclxuICAgICAgICBjdHhPcHRpb25zLnBsdXJhbEluZGV4ID0gb3B0aW9ucy5wbHVyYWw7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY3R4T3B0aW9ucztcclxufVxuXG5jb25zdCBpbnRsRGVmaW5lZCA9IHR5cGVvZiBJbnRsICE9PSAndW5kZWZpbmVkJztcclxuY29uc3QgQXZhaWxhYmlsaXRpZXMgPSB7XHJcbiAgICBkYXRlVGltZUZvcm1hdDogaW50bERlZmluZWQgJiYgdHlwZW9mIEludGwuRGF0ZVRpbWVGb3JtYXQgIT09ICd1bmRlZmluZWQnLFxyXG4gICAgbnVtYmVyRm9ybWF0OiBpbnRsRGVmaW5lZCAmJiB0eXBlb2YgSW50bC5OdW1iZXJGb3JtYXQgIT09ICd1bmRlZmluZWQnXHJcbn07XG5cbi8vIGltcGxlbWVudGF0aW9uIG9mIGBkYXRldGltZWAgZnVuY3Rpb25cclxuZnVuY3Rpb24gZGF0ZXRpbWUoY29udGV4dCwgLi4uYXJncykge1xyXG4gICAgY29uc3QgeyBkYXRldGltZUZvcm1hdHMsIHVucmVzb2x2aW5nLCBmYWxsYmFja0xvY2FsZSwgb25XYXJuIH0gPSBjb250ZXh0O1xyXG4gICAgY29uc3QgeyBfX2RhdGV0aW1lRm9ybWF0dGVycyB9ID0gY29udGV4dDtcclxuICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgJiYgIUF2YWlsYWJpbGl0aWVzLmRhdGVUaW1lRm9ybWF0KSB7XHJcbiAgICAgICAgb25XYXJuKGdldFdhcm5NZXNzYWdlKDQgLyogQ0FOTk9UX0ZPUk1BVF9EQVRFICovKSk7XHJcbiAgICAgICAgcmV0dXJuIE1JU1NJTkdfUkVTT0xWRV9WQUxVRTtcclxuICAgIH1cclxuICAgIGNvbnN0IFtrZXksIHZhbHVlLCBvcHRpb25zLCBvdmVycmlkZXNdID0gcGFyc2VEYXRlVGltZUFyZ3MoLi4uYXJncyk7XHJcbiAgICBjb25zdCBtaXNzaW5nV2FybiA9IGlzQm9vbGVhbihvcHRpb25zLm1pc3NpbmdXYXJuKVxyXG4gICAgICAgID8gb3B0aW9ucy5taXNzaW5nV2FyblxyXG4gICAgICAgIDogY29udGV4dC5taXNzaW5nV2FybjtcclxuICAgIGNvbnN0IGZhbGxiYWNrV2FybiA9IGlzQm9vbGVhbihvcHRpb25zLmZhbGxiYWNrV2FybilcclxuICAgICAgICA/IG9wdGlvbnMuZmFsbGJhY2tXYXJuXHJcbiAgICAgICAgOiBjb250ZXh0LmZhbGxiYWNrV2FybjtcclxuICAgIGNvbnN0IHBhcnQgPSAhIW9wdGlvbnMucGFydDtcclxuICAgIGNvbnN0IGxvY2FsZSA9IGlzU3RyaW5nKG9wdGlvbnMubG9jYWxlKSA/IG9wdGlvbnMubG9jYWxlIDogY29udGV4dC5sb2NhbGU7XHJcbiAgICBjb25zdCBsb2NhbGVzID0gZ2V0TG9jYWxlQ2hhaW4oY29udGV4dCwgZmFsbGJhY2tMb2NhbGUsIGxvY2FsZSk7XHJcbiAgICBpZiAoIWlzU3RyaW5nKGtleSkgfHwga2V5ID09PSAnJykge1xyXG4gICAgICAgIHJldHVybiBuZXcgSW50bC5EYXRlVGltZUZvcm1hdChsb2NhbGUpLmZvcm1hdCh2YWx1ZSk7XHJcbiAgICB9XHJcbiAgICAvLyByZXNvbHZlIGZvcm1hdFxyXG4gICAgbGV0IGRhdGV0aW1lRm9ybWF0ID0ge307XHJcbiAgICBsZXQgdGFyZ2V0TG9jYWxlO1xyXG4gICAgbGV0IGZvcm1hdCA9IG51bGw7XHJcbiAgICBsZXQgZnJvbSA9IGxvY2FsZTtcclxuICAgIGxldCB0byA9IG51bGw7XHJcbiAgICBjb25zdCB0eXBlID0gJ2RhdGV0aW1lIGZvcm1hdCc7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxvY2FsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB0YXJnZXRMb2NhbGUgPSB0byA9IGxvY2FsZXNbaV07XHJcbiAgICAgICAgaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSAmJlxyXG4gICAgICAgICAgICBsb2NhbGUgIT09IHRhcmdldExvY2FsZSAmJlxyXG4gICAgICAgICAgICBpc1RyYW5zbGF0ZUZhbGxiYWNrV2FybihmYWxsYmFja1dhcm4sIGtleSkpIHtcclxuICAgICAgICAgICAgb25XYXJuKGdldFdhcm5NZXNzYWdlKDUgLyogRkFMTEJBQ0tfVE9fREFURV9GT1JNQVQgKi8sIHtcclxuICAgICAgICAgICAgICAgIGtleSxcclxuICAgICAgICAgICAgICAgIHRhcmdldDogdGFyZ2V0TG9jYWxlXHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gZm9yIHZ1ZS1kZXZ0b29scyB0aW1lbGluZSBldmVudFxyXG4gICAgICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgJiYgbG9jYWxlICE9PSB0YXJnZXRMb2NhbGUpIHtcclxuICAgICAgICAgICAgY29uc3QgZW1pdHRlciA9IGNvbnRleHQuX192X2VtaXR0ZXI7XHJcbiAgICAgICAgICAgIGlmIChlbWl0dGVyKSB7XHJcbiAgICAgICAgICAgICAgICBlbWl0dGVyLmVtaXQoXCJmYWxsYmFja1wiIC8qIEZBTEJBQ0sgKi8sIHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlLFxyXG4gICAgICAgICAgICAgICAgICAgIGtleSxcclxuICAgICAgICAgICAgICAgICAgICBmcm9tLFxyXG4gICAgICAgICAgICAgICAgICAgIHRvLFxyXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwSWQ6IGAke3R5cGV9OiR7a2V5fWBcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRhdGV0aW1lRm9ybWF0ID1cclxuICAgICAgICAgICAgZGF0ZXRpbWVGb3JtYXRzW3RhcmdldExvY2FsZV0gfHwge307XHJcbiAgICAgICAgZm9ybWF0ID0gZGF0ZXRpbWVGb3JtYXRba2V5XTtcclxuICAgICAgICBpZiAoaXNQbGFpbk9iamVjdChmb3JtYXQpKVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBoYW5kbGVNaXNzaW5nKGNvbnRleHQsIGtleSwgdGFyZ2V0TG9jYWxlLCBtaXNzaW5nV2FybiwgdHlwZSk7XHJcbiAgICAgICAgZnJvbSA9IHRvO1xyXG4gICAgfVxyXG4gICAgLy8gY2hlY2tpbmcgZm9ybWF0IGFuZCB0YXJnZXQgbG9jYWxlXHJcbiAgICBpZiAoIWlzUGxhaW5PYmplY3QoZm9ybWF0KSB8fCAhaXNTdHJpbmcodGFyZ2V0TG9jYWxlKSkge1xyXG4gICAgICAgIHJldHVybiB1bnJlc29sdmluZyA/IE5PVF9SRU9TTFZFRCA6IGtleTtcclxuICAgIH1cclxuICAgIGxldCBpZCA9IGAke3RhcmdldExvY2FsZX1fXyR7a2V5fWA7XHJcbiAgICBpZiAoIWlzRW1wdHlPYmplY3Qob3ZlcnJpZGVzKSkge1xyXG4gICAgICAgIGlkID0gYCR7aWR9X18ke0pTT04uc3RyaW5naWZ5KG92ZXJyaWRlcyl9YDtcclxuICAgIH1cclxuICAgIGxldCBmb3JtYXR0ZXIgPSBfX2RhdGV0aW1lRm9ybWF0dGVycy5nZXQoaWQpO1xyXG4gICAgaWYgKCFmb3JtYXR0ZXIpIHtcclxuICAgICAgICBmb3JtYXR0ZXIgPSBuZXcgSW50bC5EYXRlVGltZUZvcm1hdCh0YXJnZXRMb2NhbGUsIGFzc2lnbih7fSwgZm9ybWF0LCBvdmVycmlkZXMpKTtcclxuICAgICAgICBfX2RhdGV0aW1lRm9ybWF0dGVycy5zZXQoaWQsIGZvcm1hdHRlcik7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gIXBhcnQgPyBmb3JtYXR0ZXIuZm9ybWF0KHZhbHVlKSA6IGZvcm1hdHRlci5mb3JtYXRUb1BhcnRzKHZhbHVlKTtcclxufVxyXG4vKiogQGludGVybmFsICovXHJcbmZ1bmN0aW9uIHBhcnNlRGF0ZVRpbWVBcmdzKC4uLmFyZ3MpIHtcclxuICAgIGNvbnN0IFthcmcxLCBhcmcyLCBhcmczLCBhcmc0XSA9IGFyZ3M7XHJcbiAgICBsZXQgb3B0aW9ucyA9IHt9O1xyXG4gICAgbGV0IG92ZXJyaWRlcyA9IHt9O1xyXG4gICAgbGV0IHZhbHVlO1xyXG4gICAgaWYgKGlzU3RyaW5nKGFyZzEpKSB7XHJcbiAgICAgICAgLy8gT25seSBhbGxvdyBJU08gc3RyaW5ncyAtIG90aGVyIGRhdGUgZm9ybWF0cyBhcmUgb2Z0ZW4gc3VwcG9ydGVkLFxyXG4gICAgICAgIC8vIGJ1dCBtYXkgY2F1c2UgZGlmZmVyZW50IHJlc3VsdHMgaW4gZGlmZmVyZW50IGJyb3dzZXJzLlxyXG4gICAgICAgIGlmICghL1xcZHs0fS1cXGR7Mn0tXFxkezJ9KFQuKik/Ly50ZXN0KGFyZzEpKSB7XHJcbiAgICAgICAgICAgIHRocm93IGNyZWF0ZUNvcmVFcnJvcigxNiAvKiBJTlZBTElEX0lTT19EQVRFX0FSR1VNRU5UICovKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFsdWUgPSBuZXcgRGF0ZShhcmcxKTtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAvLyBUaGlzIHdpbGwgZmFpbCBpZiB0aGUgZGF0ZSBpcyBub3QgdmFsaWRcclxuICAgICAgICAgICAgdmFsdWUudG9JU09TdHJpbmcoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgdGhyb3cgY3JlYXRlQ29yZUVycm9yKDE2IC8qIElOVkFMSURfSVNPX0RBVEVfQVJHVU1FTlQgKi8pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGlzRGF0ZShhcmcxKSkge1xyXG4gICAgICAgIGlmIChpc05hTihhcmcxLmdldFRpbWUoKSkpIHtcclxuICAgICAgICAgICAgdGhyb3cgY3JlYXRlQ29yZUVycm9yKDE1IC8qIElOVkFMSURfREFURV9BUkdVTUVOVCAqLyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhbHVlID0gYXJnMTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGlzTnVtYmVyKGFyZzEpKSB7XHJcbiAgICAgICAgdmFsdWUgPSBhcmcxO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgY3JlYXRlQ29yZUVycm9yKDE0IC8qIElOVkFMSURfQVJHVU1FTlQgKi8pO1xyXG4gICAgfVxyXG4gICAgaWYgKGlzU3RyaW5nKGFyZzIpKSB7XHJcbiAgICAgICAgb3B0aW9ucy5rZXkgPSBhcmcyO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoaXNQbGFpbk9iamVjdChhcmcyKSkge1xyXG4gICAgICAgIG9wdGlvbnMgPSBhcmcyO1xyXG4gICAgfVxyXG4gICAgaWYgKGlzU3RyaW5nKGFyZzMpKSB7XHJcbiAgICAgICAgb3B0aW9ucy5sb2NhbGUgPSBhcmczO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoaXNQbGFpbk9iamVjdChhcmczKSkge1xyXG4gICAgICAgIG92ZXJyaWRlcyA9IGFyZzM7XHJcbiAgICB9XHJcbiAgICBpZiAoaXNQbGFpbk9iamVjdChhcmc0KSkge1xyXG4gICAgICAgIG92ZXJyaWRlcyA9IGFyZzQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gW29wdGlvbnMua2V5IHx8ICcnLCB2YWx1ZSwgb3B0aW9ucywgb3ZlcnJpZGVzXTtcclxufVxyXG4vKiogQGludGVybmFsICovXHJcbmZ1bmN0aW9uIGNsZWFyRGF0ZVRpbWVGb3JtYXQoY3R4LCBsb2NhbGUsIGZvcm1hdCkge1xyXG4gICAgY29uc3QgY29udGV4dCA9IGN0eDtcclxuICAgIGZvciAoY29uc3Qga2V5IGluIGZvcm1hdCkge1xyXG4gICAgICAgIGNvbnN0IGlkID0gYCR7bG9jYWxlfV9fJHtrZXl9YDtcclxuICAgICAgICBpZiAoIWNvbnRleHQuX19kYXRldGltZUZvcm1hdHRlcnMuaGFzKGlkKSkge1xyXG4gICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29udGV4dC5fX2RhdGV0aW1lRm9ybWF0dGVycy5kZWxldGUoaWQpO1xyXG4gICAgfVxyXG59XG5cbi8vIGltcGxlbWVudGF0aW9uIG9mIGBudW1iZXJgIGZ1bmN0aW9uXHJcbmZ1bmN0aW9uIG51bWJlcihjb250ZXh0LCAuLi5hcmdzKSB7XHJcbiAgICBjb25zdCB7IG51bWJlckZvcm1hdHMsIHVucmVzb2x2aW5nLCBmYWxsYmFja0xvY2FsZSwgb25XYXJuIH0gPSBjb250ZXh0O1xyXG4gICAgY29uc3QgeyBfX251bWJlckZvcm1hdHRlcnMgfSA9IGNvbnRleHQ7XHJcbiAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpICYmICFBdmFpbGFiaWxpdGllcy5udW1iZXJGb3JtYXQpIHtcclxuICAgICAgICBvbldhcm4oZ2V0V2Fybk1lc3NhZ2UoMiAvKiBDQU5OT1RfRk9STUFUX05VTUJFUiAqLykpO1xyXG4gICAgICAgIHJldHVybiBNSVNTSU5HX1JFU09MVkVfVkFMVUU7XHJcbiAgICB9XHJcbiAgICBjb25zdCBba2V5LCB2YWx1ZSwgb3B0aW9ucywgb3ZlcnJpZGVzXSA9IHBhcnNlTnVtYmVyQXJncyguLi5hcmdzKTtcclxuICAgIGNvbnN0IG1pc3NpbmdXYXJuID0gaXNCb29sZWFuKG9wdGlvbnMubWlzc2luZ1dhcm4pXHJcbiAgICAgICAgPyBvcHRpb25zLm1pc3NpbmdXYXJuXHJcbiAgICAgICAgOiBjb250ZXh0Lm1pc3NpbmdXYXJuO1xyXG4gICAgY29uc3QgZmFsbGJhY2tXYXJuID0gaXNCb29sZWFuKG9wdGlvbnMuZmFsbGJhY2tXYXJuKVxyXG4gICAgICAgID8gb3B0aW9ucy5mYWxsYmFja1dhcm5cclxuICAgICAgICA6IGNvbnRleHQuZmFsbGJhY2tXYXJuO1xyXG4gICAgY29uc3QgcGFydCA9ICEhb3B0aW9ucy5wYXJ0O1xyXG4gICAgY29uc3QgbG9jYWxlID0gaXNTdHJpbmcob3B0aW9ucy5sb2NhbGUpID8gb3B0aW9ucy5sb2NhbGUgOiBjb250ZXh0LmxvY2FsZTtcclxuICAgIGNvbnN0IGxvY2FsZXMgPSBnZXRMb2NhbGVDaGFpbihjb250ZXh0LCBmYWxsYmFja0xvY2FsZSwgbG9jYWxlKTtcclxuICAgIGlmICghaXNTdHJpbmcoa2V5KSB8fCBrZXkgPT09ICcnKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBJbnRsLk51bWJlckZvcm1hdChsb2NhbGUpLmZvcm1hdCh2YWx1ZSk7XHJcbiAgICB9XHJcbiAgICAvLyByZXNvbHZlIGZvcm1hdFxyXG4gICAgbGV0IG51bWJlckZvcm1hdCA9IHt9O1xyXG4gICAgbGV0IHRhcmdldExvY2FsZTtcclxuICAgIGxldCBmb3JtYXQgPSBudWxsO1xyXG4gICAgbGV0IGZyb20gPSBsb2NhbGU7XHJcbiAgICBsZXQgdG8gPSBudWxsO1xyXG4gICAgY29uc3QgdHlwZSA9ICdudW1iZXIgZm9ybWF0JztcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbG9jYWxlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHRhcmdldExvY2FsZSA9IHRvID0gbG9jYWxlc1tpXTtcclxuICAgICAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpICYmXHJcbiAgICAgICAgICAgIGxvY2FsZSAhPT0gdGFyZ2V0TG9jYWxlICYmXHJcbiAgICAgICAgICAgIGlzVHJhbnNsYXRlRmFsbGJhY2tXYXJuKGZhbGxiYWNrV2Fybiwga2V5KSkge1xyXG4gICAgICAgICAgICBvbldhcm4oZ2V0V2Fybk1lc3NhZ2UoMyAvKiBGQUxMQkFDS19UT19OVU1CRVJfRk9STUFUICovLCB7XHJcbiAgICAgICAgICAgICAgICBrZXksXHJcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IHRhcmdldExvY2FsZVxyXG4gICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGZvciB2dWUtZGV2dG9vbHMgdGltZWxpbmUgZXZlbnRcclxuICAgICAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpICYmIGxvY2FsZSAhPT0gdGFyZ2V0TG9jYWxlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGVtaXR0ZXIgPSBjb250ZXh0Ll9fdl9lbWl0dGVyO1xyXG4gICAgICAgICAgICBpZiAoZW1pdHRlcikge1xyXG4gICAgICAgICAgICAgICAgZW1pdHRlci5lbWl0KFwiZmFsbGJhY2tcIiAvKiBGQUxCQUNLICovLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZSxcclxuICAgICAgICAgICAgICAgICAgICBrZXksXHJcbiAgICAgICAgICAgICAgICAgICAgZnJvbSxcclxuICAgICAgICAgICAgICAgICAgICB0byxcclxuICAgICAgICAgICAgICAgICAgICBncm91cElkOiBgJHt0eXBlfToke2tleX1gXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBudW1iZXJGb3JtYXQgPVxyXG4gICAgICAgICAgICBudW1iZXJGb3JtYXRzW3RhcmdldExvY2FsZV0gfHwge307XHJcbiAgICAgICAgZm9ybWF0ID0gbnVtYmVyRm9ybWF0W2tleV07XHJcbiAgICAgICAgaWYgKGlzUGxhaW5PYmplY3QoZm9ybWF0KSlcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgaGFuZGxlTWlzc2luZyhjb250ZXh0LCBrZXksIHRhcmdldExvY2FsZSwgbWlzc2luZ1dhcm4sIHR5cGUpO1xyXG4gICAgICAgIGZyb20gPSB0bztcclxuICAgIH1cclxuICAgIC8vIGNoZWNraW5nIGZvcm1hdCBhbmQgdGFyZ2V0IGxvY2FsZVxyXG4gICAgaWYgKCFpc1BsYWluT2JqZWN0KGZvcm1hdCkgfHwgIWlzU3RyaW5nKHRhcmdldExvY2FsZSkpIHtcclxuICAgICAgICByZXR1cm4gdW5yZXNvbHZpbmcgPyBOT1RfUkVPU0xWRUQgOiBrZXk7XHJcbiAgICB9XHJcbiAgICBsZXQgaWQgPSBgJHt0YXJnZXRMb2NhbGV9X18ke2tleX1gO1xyXG4gICAgaWYgKCFpc0VtcHR5T2JqZWN0KG92ZXJyaWRlcykpIHtcclxuICAgICAgICBpZCA9IGAke2lkfV9fJHtKU09OLnN0cmluZ2lmeShvdmVycmlkZXMpfWA7XHJcbiAgICB9XHJcbiAgICBsZXQgZm9ybWF0dGVyID0gX19udW1iZXJGb3JtYXR0ZXJzLmdldChpZCk7XHJcbiAgICBpZiAoIWZvcm1hdHRlcikge1xyXG4gICAgICAgIGZvcm1hdHRlciA9IG5ldyBJbnRsLk51bWJlckZvcm1hdCh0YXJnZXRMb2NhbGUsIGFzc2lnbih7fSwgZm9ybWF0LCBvdmVycmlkZXMpKTtcclxuICAgICAgICBfX251bWJlckZvcm1hdHRlcnMuc2V0KGlkLCBmb3JtYXR0ZXIpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuICFwYXJ0ID8gZm9ybWF0dGVyLmZvcm1hdCh2YWx1ZSkgOiBmb3JtYXR0ZXIuZm9ybWF0VG9QYXJ0cyh2YWx1ZSk7XHJcbn1cclxuLyoqIEBpbnRlcm5hbCAqL1xyXG5mdW5jdGlvbiBwYXJzZU51bWJlckFyZ3MoLi4uYXJncykge1xyXG4gICAgY29uc3QgW2FyZzEsIGFyZzIsIGFyZzMsIGFyZzRdID0gYXJncztcclxuICAgIGxldCBvcHRpb25zID0ge307XHJcbiAgICBsZXQgb3ZlcnJpZGVzID0ge307XHJcbiAgICBpZiAoIWlzTnVtYmVyKGFyZzEpKSB7XHJcbiAgICAgICAgdGhyb3cgY3JlYXRlQ29yZUVycm9yKDE0IC8qIElOVkFMSURfQVJHVU1FTlQgKi8pO1xyXG4gICAgfVxyXG4gICAgY29uc3QgdmFsdWUgPSBhcmcxO1xyXG4gICAgaWYgKGlzU3RyaW5nKGFyZzIpKSB7XHJcbiAgICAgICAgb3B0aW9ucy5rZXkgPSBhcmcyO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoaXNQbGFpbk9iamVjdChhcmcyKSkge1xyXG4gICAgICAgIG9wdGlvbnMgPSBhcmcyO1xyXG4gICAgfVxyXG4gICAgaWYgKGlzU3RyaW5nKGFyZzMpKSB7XHJcbiAgICAgICAgb3B0aW9ucy5sb2NhbGUgPSBhcmczO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoaXNQbGFpbk9iamVjdChhcmczKSkge1xyXG4gICAgICAgIG92ZXJyaWRlcyA9IGFyZzM7XHJcbiAgICB9XHJcbiAgICBpZiAoaXNQbGFpbk9iamVjdChhcmc0KSkge1xyXG4gICAgICAgIG92ZXJyaWRlcyA9IGFyZzQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gW29wdGlvbnMua2V5IHx8ICcnLCB2YWx1ZSwgb3B0aW9ucywgb3ZlcnJpZGVzXTtcclxufVxyXG4vKiogQGludGVybmFsICovXHJcbmZ1bmN0aW9uIGNsZWFyTnVtYmVyRm9ybWF0KGN0eCwgbG9jYWxlLCBmb3JtYXQpIHtcclxuICAgIGNvbnN0IGNvbnRleHQgPSBjdHg7XHJcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBmb3JtYXQpIHtcclxuICAgICAgICBjb25zdCBpZCA9IGAke2xvY2FsZX1fXyR7a2V5fWA7XHJcbiAgICAgICAgaWYgKCFjb250ZXh0Ll9fbnVtYmVyRm9ybWF0dGVycy5oYXMoaWQpKSB7XHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb250ZXh0Ll9fbnVtYmVyRm9ybWF0dGVycy5kZWxldGUoaWQpO1xyXG4gICAgfVxyXG59XG5cbntcclxuICAgIGlmICh0eXBlb2YgX19JTlRMSUZZX1BST0RfREVWVE9PTFNfXyAhPT0gJ2Jvb2xlYW4nKSB7XHJcbiAgICAgICAgZ2V0R2xvYmFsVGhpcygpLl9fSU5UTElGWV9QUk9EX0RFVlRPT0xTX18gPSBmYWxzZTtcclxuICAgIH1cclxufVxuXG5leHBvcnQgeyBNSVNTSU5HX1JFU09MVkVfVkFMVUUsIE5PVF9SRU9TTFZFRCwgVkVSU0lPTiwgY2xlYXJDb21waWxlQ2FjaGUsIGNsZWFyRGF0ZVRpbWVGb3JtYXQsIGNsZWFyTnVtYmVyRm9ybWF0LCBjb21waWxlVG9GdW5jdGlvbiwgY3JlYXRlQ29yZUNvbnRleHQsIGNyZWF0ZUNvcmVFcnJvciwgZGF0ZXRpbWUsIGdldEFkZGl0aW9uYWxNZXRhLCBnZXREZXZUb29sc0hvb2ssIGdldExvY2FsZUNoYWluLCBnZXRXYXJuTWVzc2FnZSwgaGFuZGxlTWlzc2luZywgaW5pdEkxOG5EZXZUb29scywgaXNNZXNzYWdlRnVuY3Rpb24sIGlzVHJhbnNsYXRlRmFsbGJhY2tXYXJuLCBpc1RyYW5zbGF0ZU1pc3NpbmdXYXJuLCBudW1iZXIsIHBhcnNlRGF0ZVRpbWVBcmdzLCBwYXJzZU51bWJlckFyZ3MsIHBhcnNlVHJhbnNsYXRlQXJncywgcmVnaXN0ZXJNZXNzYWdlQ29tcGlsZXIsIHNldEFkZGl0aW9uYWxNZXRhLCBzZXREZXZUb29sc0hvb2ssIHRyYW5zbGF0ZSwgdHJhbnNsYXRlRGV2VG9vbHMsIHVwZGF0ZUZhbGxiYWNrTG9jYWxlIH07XG4iLCIvKiFcbiAgKiBAaW50bGlmeS92dWUtZGV2dG9vbHMgdjkuMS4xMFxuICAqIChjKSAyMDIyIGthenV5YSBrYXdhZ3VjaGlcbiAgKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gICovXG5jb25zdCBWdWVEZXZUb29sc0xhYmVscyA9IHtcclxuICAgIFtcInZ1ZS1kZXZ0b29scy1wbHVnaW4tdnVlLWkxOG5cIiAvKiBQTFVHSU4gKi9dOiAnVnVlIEkxOG4gZGV2dG9vbHMnLFxyXG4gICAgW1widnVlLWkxOG4tcmVzb3VyY2UtaW5zcGVjdG9yXCIgLyogQ1VTVE9NX0lOU1BFQ1RPUiAqL106ICdJMThuIFJlc291cmNlcycsXHJcbiAgICBbXCJ2dWUtaTE4bi10aW1lbGluZVwiIC8qIFRJTUVMSU5FICovXTogJ1Z1ZSBJMThuJ1xyXG59O1xyXG5jb25zdCBWdWVEZXZUb29sc1BsYWNlaG9sZGVycyA9IHtcclxuICAgIFtcInZ1ZS1pMThuLXJlc291cmNlLWluc3BlY3RvclwiIC8qIENVU1RPTV9JTlNQRUNUT1IgKi9dOiAnU2VhcmNoIGZvciBzY29wZXMgLi4uJ1xyXG59O1xyXG5jb25zdCBWdWVEZXZUb29sc1RpbWVsaW5lQ29sb3JzID0ge1xyXG4gICAgW1widnVlLWkxOG4tdGltZWxpbmVcIiAvKiBUSU1FTElORSAqL106IDB4ZmZjZDE5XHJcbn07XG5cbmV4cG9ydCB7IFZ1ZURldlRvb2xzTGFiZWxzLCBWdWVEZXZUb29sc1BsYWNlaG9sZGVycywgVnVlRGV2VG9vbHNUaW1lbGluZUNvbG9ycyB9O1xuIiwiLyohXG4gICogdnVlLWkxOG4gdjkuMS4xMFxuICAqIChjKSAyMDIyIGthenV5YSBrYXdhZ3VjaGlcbiAgKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gICovXG5pbXBvcnQgeyBnZXRHbG9iYWxUaGlzLCBmb3JtYXQsIG1ha2VTeW1ib2wsIGlzUGxhaW5PYmplY3QsIGlzQXJyYXksIGhhc093biwgaXNPYmplY3QsIGlzQm9vbGVhbiwgaXNTdHJpbmcsIGlzUmVnRXhwLCBpc0Z1bmN0aW9uLCBhc3NpZ24sIGlzTnVtYmVyLCB3YXJuLCBjcmVhdGVFbWl0dGVyLCBpc0VtcHR5T2JqZWN0IH0gZnJvbSAnQGludGxpZnkvc2hhcmVkJztcbmltcG9ydCB7IGNyZWF0ZUNvbXBpbGVFcnJvciwgaGFuZGxlRmxhdEpzb24sIGNyZWF0ZUNvcmVDb250ZXh0LCB1cGRhdGVGYWxsYmFja0xvY2FsZSwgcmVzb2x2ZVZhbHVlLCBjbGVhckRhdGVUaW1lRm9ybWF0LCBjbGVhck51bWJlckZvcm1hdCwgc2V0QWRkaXRpb25hbE1ldGEsIE5PVF9SRU9TTFZFRCwgaXNUcmFuc2xhdGVGYWxsYmFja1dhcm4sIGlzVHJhbnNsYXRlTWlzc2luZ1dhcm4sIHBhcnNlVHJhbnNsYXRlQXJncywgdHJhbnNsYXRlLCBNSVNTSU5HX1JFU09MVkVfVkFMVUUsIHBhcnNlRGF0ZVRpbWVBcmdzLCBkYXRldGltZSwgcGFyc2VOdW1iZXJBcmdzLCBudW1iZXIsIGdldExvY2FsZUNoYWluLCByZWdpc3Rlck1lc3NhZ2VDb21waWxlciwgY29tcGlsZVRvRnVuY3Rpb24sIHNldERldlRvb2xzSG9vayB9IGZyb20gJ0BpbnRsaWZ5L2NvcmUtYmFzZSc7XG5pbXBvcnQgeyByZWYsIGdldEN1cnJlbnRJbnN0YW5jZSwgY29tcHV0ZWQsIHdhdGNoLCBjcmVhdGVWTm9kZSwgVGV4dCwgaCwgRnJhZ21lbnQsIGluamVjdCwgb25Nb3VudGVkLCBvblVubW91bnRlZCwgaXNSZWYgfSBmcm9tICd2dWUnO1xuaW1wb3J0IHsgc2V0dXBEZXZ0b29sc1BsdWdpbiB9IGZyb20gJ0B2dWUvZGV2dG9vbHMtYXBpJztcbmltcG9ydCB7IFZ1ZURldlRvb2xzTGFiZWxzLCBWdWVEZXZUb29sc1BsYWNlaG9sZGVycywgVnVlRGV2VG9vbHNUaW1lbGluZUNvbG9ycyB9IGZyb20gJ0BpbnRsaWZ5L3Z1ZS1kZXZ0b29scyc7XG5cbi8qKlxyXG4gKiBWdWUgSTE4biBWZXJzaW9uXHJcbiAqXHJcbiAqIEByZW1hcmtzXHJcbiAqIFNlbXZlciBmb3JtYXQuIFNhbWUgZm9ybWF0IGFzIHRoZSBwYWNrYWdlLmpzb24gYHZlcnNpb25gIGZpZWxkLlxyXG4gKlxyXG4gKiBAVnVlSTE4bkdlbmVyYWxcclxuICovXHJcbmNvbnN0IFZFUlNJT04gPSAnOS4xLjEwJztcclxuLyoqXHJcbiAqIFRoaXMgaXMgb25seSBjYWxsZWQgaW4gZXNtLWJ1bmRsZXIgYnVpbGRzLlxyXG4gKiBpc3RhbmJ1bC1pZ25vcmUtbmV4dFxyXG4gKi9cclxuZnVuY3Rpb24gaW5pdEZlYXR1cmVGbGFncygpIHtcclxuICAgIGxldCBuZWVkV2FybiA9IGZhbHNlO1xyXG4gICAgaWYgKHR5cGVvZiBfX1ZVRV9JMThOX0ZVTExfSU5TVEFMTF9fICE9PSAnYm9vbGVhbicpIHtcclxuICAgICAgICBuZWVkV2FybiA9IHRydWU7XHJcbiAgICAgICAgZ2V0R2xvYmFsVGhpcygpLl9fVlVFX0kxOE5fRlVMTF9JTlNUQUxMX18gPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiBfX1ZVRV9JMThOX0xFR0FDWV9BUElfXyAhPT0gJ2Jvb2xlYW4nKSB7XHJcbiAgICAgICAgbmVlZFdhcm4gPSB0cnVlO1xyXG4gICAgICAgIGdldEdsb2JhbFRoaXMoKS5fX1ZVRV9JMThOX0xFR0FDWV9BUElfXyA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIF9fSU5UTElGWV9QUk9EX0RFVlRPT0xTX18gIT09ICdib29sZWFuJykge1xyXG4gICAgICAgIGdldEdsb2JhbFRoaXMoKS5fX0lOVExJRllfUFJPRF9ERVZUT09MU19fID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpICYmIG5lZWRXYXJuKSB7XHJcbiAgICAgICAgY29uc29sZS53YXJuKGBZb3UgYXJlIHJ1bm5pbmcgdGhlIGVzbS1idW5kbGVyIGJ1aWxkIG9mIHZ1ZS1pMThuLiBJdCBpcyByZWNvbW1lbmRlZCB0byBgICtcclxuICAgICAgICAgICAgYGNvbmZpZ3VyZSB5b3VyIGJ1bmRsZXIgdG8gZXhwbGljaXRseSByZXBsYWNlIGZlYXR1cmUgZmxhZyBnbG9iYWxzIGAgK1xyXG4gICAgICAgICAgICBgd2l0aCBib29sZWFuIGxpdGVyYWxzIHRvIGdldCBwcm9wZXIgdHJlZS1zaGFraW5nIGluIHRoZSBmaW5hbCBidW5kbGUuYCk7XHJcbiAgICB9XHJcbn1cblxuY29uc3Qgd2Fybk1lc3NhZ2VzID0ge1xyXG4gICAgWzYgLyogRkFMTEJBQ0tfVE9fUk9PVCAqL106IGBGYWxsIGJhY2sgdG8ge3R5cGV9ICd7a2V5fScgd2l0aCByb290IGxvY2FsZS5gLFxyXG4gICAgWzcgLyogTk9UX1NVUFBPUlRFRF9QUkVTRVJWRSAqL106IGBOb3Qgc3VwcG9ydGVkICdwcmVzZXJ2ZScuYCxcclxuICAgIFs4IC8qIE5PVF9TVVBQT1JURURfRk9STUFUVEVSICovXTogYE5vdCBzdXBwb3J0ZWQgJ2Zvcm1hdHRlcicuYCxcclxuICAgIFs5IC8qIE5PVF9TVVBQT1JURURfUFJFU0VSVkVfRElSRUNUSVZFICovXTogYE5vdCBzdXBwb3J0ZWQgJ3ByZXNlcnZlRGlyZWN0aXZlQ29udGVudCcuYCxcclxuICAgIFsxMCAvKiBOT1RfU1VQUE9SVEVEX0dFVF9DSE9JQ0VfSU5ERVggKi9dOiBgTm90IHN1cHBvcnRlZCAnZ2V0Q2hvaWNlSW5kZXgnLmAsXHJcbiAgICBbMTEgLyogQ09NUE9ORU5UX05BTUVfTEVHQUNZX0NPTVBBVElCTEUgKi9dOiBgQ29tcG9uZW50IG5hbWUgbGVnYWN5IGNvbXBhdGlibGU6ICd7bmFtZX0nIC0+ICdpMThuJ2AsXHJcbiAgICBbMTIgLyogTk9UX0ZPVU5EX1BBUkVOVF9TQ09QRSAqL106IGBOb3QgZm91bmQgcGFyZW50IHNjb3BlLiB1c2UgdGhlIGdsb2JhbCBzY29wZS5gXHJcbn07XHJcbmZ1bmN0aW9uIGdldFdhcm5NZXNzYWdlKGNvZGUsIC4uLmFyZ3MpIHtcclxuICAgIHJldHVybiBmb3JtYXQod2Fybk1lc3NhZ2VzW2NvZGVdLCAuLi5hcmdzKTtcclxufVxuXG5mdW5jdGlvbiBjcmVhdGVJMThuRXJyb3IoY29kZSwgLi4uYXJncykge1xyXG4gICAgcmV0dXJuIGNyZWF0ZUNvbXBpbGVFcnJvcihjb2RlLCBudWxsLCAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgPyB7IG1lc3NhZ2VzOiBlcnJvck1lc3NhZ2VzLCBhcmdzIH0gOiB1bmRlZmluZWQpO1xyXG59XHJcbmNvbnN0IGVycm9yTWVzc2FnZXMgPSB7XHJcbiAgICBbMTQgLyogVU5FWFBFQ1RFRF9SRVRVUk5fVFlQRSAqL106ICdVbmV4cGVjdGVkIHJldHVybiB0eXBlIGluIGNvbXBvc2VyJyxcclxuICAgIFsxNSAvKiBJTlZBTElEX0FSR1VNRU5UICovXTogJ0ludmFsaWQgYXJndW1lbnQnLFxyXG4gICAgWzE2IC8qIE1VU1RfQkVfQ0FMTF9TRVRVUF9UT1AgKi9dOiAnTXVzdCBiZSBjYWxsZWQgYXQgdGhlIHRvcCBvZiBhIGBzZXR1cGAgZnVuY3Rpb24nLFxyXG4gICAgWzE3IC8qIE5PVF9JTlNMQUxMRUQgKi9dOiAnTmVlZCB0byBpbnN0YWxsIHdpdGggYGFwcC51c2VgIGZ1bmN0aW9uJyxcclxuICAgIFsyMiAvKiBVTkVYUEVDVEVEX0VSUk9SICovXTogJ1VuZXhwZWN0ZWQgZXJyb3InLFxyXG4gICAgWzE4IC8qIE5PVF9BVkFJTEFCTEVfSU5fTEVHQUNZX01PREUgKi9dOiAnTm90IGF2YWlsYWJsZSBpbiBsZWdhY3kgbW9kZScsXHJcbiAgICBbMTkgLyogUkVRVUlSRURfVkFMVUUgKi9dOiBgUmVxdWlyZWQgaW4gdmFsdWU6IHswfWAsXHJcbiAgICBbMjAgLyogSU5WQUxJRF9WQUxVRSAqL106IGBJbnZhbGlkIHZhbHVlYCxcclxuICAgIFsyMSAvKiBDQU5OT1RfU0VUVVBfVlVFX0RFVlRPT0xTX1BMVUdJTiAqL106IGBDYW5ub3Qgc2V0dXAgdnVlLWRldnRvb2xzIHBsdWdpbmBcclxufTtcblxuY29uc3QgREVWVE9PTFNfTUVUQSA9ICdfX0lOVExJRllfTUVUQV9fJztcclxuY29uc3QgVHJhbnNyYXRlVk5vZGVTeW1ib2wgPSBtYWtlU3ltYm9sKCdfX3RyYW5zcmF0ZVZOb2RlJyk7XHJcbmNvbnN0IERhdGV0aW1lUGFydHNTeW1ib2wgPSBtYWtlU3ltYm9sKCdfX2RhdGV0aW1lUGFydHMnKTtcclxuY29uc3QgTnVtYmVyUGFydHNTeW1ib2wgPSBtYWtlU3ltYm9sKCdfX251bWJlclBhcnRzJyk7XHJcbmNvbnN0IEVuYWJsZUVtaXR0ZXIgPSBtYWtlU3ltYm9sKCdfX2VuYWJsZUVtaXR0ZXInKTtcclxuY29uc3QgRGlzYWJsZUVtaXR0ZXIgPSBtYWtlU3ltYm9sKCdfX2Rpc2FibGVFbWl0dGVyJyk7XHJcbmNvbnN0IFNldFBsdXJhbFJ1bGVzU3ltYm9sID0gbWFrZVN5bWJvbCgnX19zZXRQbHVyYWxSdWxlcycpO1xyXG5tYWtlU3ltYm9sKCdfX2ludGxpZnlNZXRhJyk7XHJcbmNvbnN0IEluZWpjdFdpdGhPcHRpb24gPSBtYWtlU3ltYm9sKCdfX2luamVjdFdpdGhPcHRpb24nKTtcclxubGV0IGNvbXBvc2VySUQgPSAwO1xyXG5mdW5jdGlvbiBkZWZpbmVDb3JlTWlzc2luZ0hhbmRsZXIobWlzc2luZykge1xyXG4gICAgcmV0dXJuICgoY3R4LCBsb2NhbGUsIGtleSwgdHlwZSkgPT4ge1xyXG4gICAgICAgIHJldHVybiBtaXNzaW5nKGxvY2FsZSwga2V5LCBnZXRDdXJyZW50SW5zdGFuY2UoKSB8fCB1bmRlZmluZWQsIHR5cGUpO1xyXG4gICAgfSk7XHJcbn1cclxuZnVuY3Rpb24gZ2V0TG9jYWxlTWVzc2FnZXMobG9jYWxlLCBvcHRpb25zKSB7XHJcbiAgICBjb25zdCB7IG1lc3NhZ2VzLCBfX2kxOG4gfSA9IG9wdGlvbnM7XHJcbiAgICAvLyBwcmV0dGllci1pZ25vcmVcclxuICAgIGNvbnN0IHJldCA9IGlzUGxhaW5PYmplY3QobWVzc2FnZXMpXHJcbiAgICAgICAgPyBtZXNzYWdlc1xyXG4gICAgICAgIDogaXNBcnJheShfX2kxOG4pXHJcbiAgICAgICAgICAgID8ge31cclxuICAgICAgICAgICAgOiB7IFtsb2NhbGVdOiB7fSB9O1xyXG4gICAgLy8gbWVyZ2UgbG9jYWxlIG1lc3NhZ2VzIG9mIGkxOG4gY3VzdG9tIGJsb2NrXHJcbiAgICBpZiAoaXNBcnJheShfX2kxOG4pKSB7XHJcbiAgICAgICAgX19pMThuLmZvckVhY2goKHsgbG9jYWxlLCByZXNvdXJjZSB9KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChsb2NhbGUpIHtcclxuICAgICAgICAgICAgICAgIHJldFtsb2NhbGVdID0gcmV0W2xvY2FsZV0gfHwge307XHJcbiAgICAgICAgICAgICAgICBkZWVwQ29weShyZXNvdXJjZSwgcmV0W2xvY2FsZV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZGVlcENvcHkocmVzb3VyY2UsIHJldCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIC8vIGhhbmRsZSBtZXNzYWdlcyBmb3IgZmxhdCBqc29uXHJcbiAgICBpZiAob3B0aW9ucy5mbGF0SnNvbikge1xyXG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIHJldCkge1xyXG4gICAgICAgICAgICBpZiAoaGFzT3duKHJldCwga2V5KSkge1xyXG4gICAgICAgICAgICAgICAgaGFuZGxlRmxhdEpzb24ocmV0W2tleV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJldDtcclxufVxyXG5jb25zdCBpc05vdE9iamVjdE9ySXNBcnJheSA9ICh2YWwpID0+ICFpc09iamVjdCh2YWwpIHx8IGlzQXJyYXkodmFsKTtcclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcclxuZnVuY3Rpb24gZGVlcENvcHkoc3JjLCBkZXMpIHtcclxuICAgIC8vIHNyYyBhbmQgZGVzIHNob3VsZCBib3RoIGJlIG9iamVjdHMsIGFuZCBub24gb2YgdGhlbiBjYW4gYmUgYSBhcnJheVxyXG4gICAgaWYgKGlzTm90T2JqZWN0T3JJc0FycmF5KHNyYykgfHwgaXNOb3RPYmplY3RPcklzQXJyYXkoZGVzKSkge1xyXG4gICAgICAgIHRocm93IGNyZWF0ZUkxOG5FcnJvcigyMCAvKiBJTlZBTElEX1ZBTFVFICovKTtcclxuICAgIH1cclxuICAgIGZvciAoY29uc3Qga2V5IGluIHNyYykge1xyXG4gICAgICAgIGlmIChoYXNPd24oc3JjLCBrZXkpKSB7XHJcbiAgICAgICAgICAgIGlmIChpc05vdE9iamVjdE9ySXNBcnJheShzcmNba2V5XSkgfHwgaXNOb3RPYmplY3RPcklzQXJyYXkoZGVzW2tleV0pKSB7XHJcbiAgICAgICAgICAgICAgICAvLyByZXBsYWNlIHdpdGggc3JjW2tleV0gd2hlbjpcclxuICAgICAgICAgICAgICAgIC8vIHNyY1trZXldIG9yIGRlc1trZXldIGlzIG5vdCBhIG9iamVjdCwgb3JcclxuICAgICAgICAgICAgICAgIC8vIHNyY1trZXldIG9yIGRlc1trZXldIGlzIGEgYXJyYXlcclxuICAgICAgICAgICAgICAgIGRlc1trZXldID0gc3JjW2tleV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBzcmNba2V5XSBhbmQgZGVzW2tleV0gYXJlIGJvdGggb2JqZWN0LCBtZXJnZSB0aGVtXHJcbiAgICAgICAgICAgICAgICBkZWVwQ29weShzcmNba2V5XSwgZGVzW2tleV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbi8vIGZvciBJbnRsaWZ5IERldlRvb2xzXHJcbmNvbnN0IGdldE1ldGFJbmZvID0gLyogI19fUFVSRV9fKi8gKCkgPT4ge1xyXG4gICAgY29uc3QgaW5zdGFuY2UgPSBnZXRDdXJyZW50SW5zdGFuY2UoKTtcclxuICAgIHJldHVybiBpbnN0YW5jZSAmJiBpbnN0YW5jZS50eXBlW0RFVlRPT0xTX01FVEFdIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxyXG4gICAgICAgID8geyBbREVWVE9PTFNfTUVUQV06IGluc3RhbmNlLnR5cGVbREVWVE9PTFNfTUVUQV0gfSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcclxuICAgICAgICA6IG51bGw7XHJcbn07XHJcbi8qKlxyXG4gKiBDcmVhdGUgY29tcG9zZXIgaW50ZXJmYWNlIGZhY3RvcnlcclxuICpcclxuICogQGludGVybmFsXHJcbiAqL1xyXG5mdW5jdGlvbiBjcmVhdGVDb21wb3NlcihvcHRpb25zID0ge30pIHtcclxuICAgIGNvbnN0IHsgX19yb290IH0gPSBvcHRpb25zO1xyXG4gICAgY29uc3QgX2lzR2xvYmFsID0gX19yb290ID09PSB1bmRlZmluZWQ7XHJcbiAgICBsZXQgX2luaGVyaXRMb2NhbGUgPSBpc0Jvb2xlYW4ob3B0aW9ucy5pbmhlcml0TG9jYWxlKVxyXG4gICAgICAgID8gb3B0aW9ucy5pbmhlcml0TG9jYWxlXHJcbiAgICAgICAgOiB0cnVlO1xyXG4gICAgY29uc3QgX2xvY2FsZSA9IHJlZihcclxuICAgIC8vIHByZXR0aWVyLWlnbm9yZVxyXG4gICAgX19yb290ICYmIF9pbmhlcml0TG9jYWxlXHJcbiAgICAgICAgPyBfX3Jvb3QubG9jYWxlLnZhbHVlXHJcbiAgICAgICAgOiBpc1N0cmluZyhvcHRpb25zLmxvY2FsZSlcclxuICAgICAgICAgICAgPyBvcHRpb25zLmxvY2FsZVxyXG4gICAgICAgICAgICA6ICdlbi1VUycpO1xyXG4gICAgY29uc3QgX2ZhbGxiYWNrTG9jYWxlID0gcmVmKFxyXG4gICAgLy8gcHJldHRpZXItaWdub3JlXHJcbiAgICBfX3Jvb3QgJiYgX2luaGVyaXRMb2NhbGVcclxuICAgICAgICA/IF9fcm9vdC5mYWxsYmFja0xvY2FsZS52YWx1ZVxyXG4gICAgICAgIDogaXNTdHJpbmcob3B0aW9ucy5mYWxsYmFja0xvY2FsZSkgfHxcclxuICAgICAgICAgICAgaXNBcnJheShvcHRpb25zLmZhbGxiYWNrTG9jYWxlKSB8fFxyXG4gICAgICAgICAgICBpc1BsYWluT2JqZWN0KG9wdGlvbnMuZmFsbGJhY2tMb2NhbGUpIHx8XHJcbiAgICAgICAgICAgIG9wdGlvbnMuZmFsbGJhY2tMb2NhbGUgPT09IGZhbHNlXHJcbiAgICAgICAgICAgID8gb3B0aW9ucy5mYWxsYmFja0xvY2FsZVxyXG4gICAgICAgICAgICA6IF9sb2NhbGUudmFsdWUpO1xyXG4gICAgY29uc3QgX21lc3NhZ2VzID0gcmVmKGdldExvY2FsZU1lc3NhZ2VzKF9sb2NhbGUudmFsdWUsIG9wdGlvbnMpKTtcclxuICAgIGNvbnN0IF9kYXRldGltZUZvcm1hdHMgPSByZWYoaXNQbGFpbk9iamVjdChvcHRpb25zLmRhdGV0aW1lRm9ybWF0cylcclxuICAgICAgICA/IG9wdGlvbnMuZGF0ZXRpbWVGb3JtYXRzXHJcbiAgICAgICAgOiB7IFtfbG9jYWxlLnZhbHVlXToge30gfSk7XHJcbiAgICBjb25zdCBfbnVtYmVyRm9ybWF0cyA9IHJlZihpc1BsYWluT2JqZWN0KG9wdGlvbnMubnVtYmVyRm9ybWF0cylcclxuICAgICAgICA/IG9wdGlvbnMubnVtYmVyRm9ybWF0c1xyXG4gICAgICAgIDogeyBbX2xvY2FsZS52YWx1ZV06IHt9IH0pO1xyXG4gICAgLy8gd2FybmluZyBzdXBwcmVzcyBvcHRpb25zXHJcbiAgICAvLyBwcmV0dGllci1pZ25vcmVcclxuICAgIGxldCBfbWlzc2luZ1dhcm4gPSBfX3Jvb3RcclxuICAgICAgICA/IF9fcm9vdC5taXNzaW5nV2FyblxyXG4gICAgICAgIDogaXNCb29sZWFuKG9wdGlvbnMubWlzc2luZ1dhcm4pIHx8IGlzUmVnRXhwKG9wdGlvbnMubWlzc2luZ1dhcm4pXHJcbiAgICAgICAgICAgID8gb3B0aW9ucy5taXNzaW5nV2FyblxyXG4gICAgICAgICAgICA6IHRydWU7XHJcbiAgICAvLyBwcmV0dGllci1pZ25vcmVcclxuICAgIGxldCBfZmFsbGJhY2tXYXJuID0gX19yb290XHJcbiAgICAgICAgPyBfX3Jvb3QuZmFsbGJhY2tXYXJuXHJcbiAgICAgICAgOiBpc0Jvb2xlYW4ob3B0aW9ucy5mYWxsYmFja1dhcm4pIHx8IGlzUmVnRXhwKG9wdGlvbnMuZmFsbGJhY2tXYXJuKVxyXG4gICAgICAgICAgICA/IG9wdGlvbnMuZmFsbGJhY2tXYXJuXHJcbiAgICAgICAgICAgIDogdHJ1ZTtcclxuICAgIC8vIHByZXR0aWVyLWlnbm9yZVxyXG4gICAgbGV0IF9mYWxsYmFja1Jvb3QgPSBfX3Jvb3RcclxuICAgICAgICA/IF9fcm9vdC5mYWxsYmFja1Jvb3RcclxuICAgICAgICA6IGlzQm9vbGVhbihvcHRpb25zLmZhbGxiYWNrUm9vdClcclxuICAgICAgICAgICAgPyBvcHRpb25zLmZhbGxiYWNrUm9vdFxyXG4gICAgICAgICAgICA6IHRydWU7XHJcbiAgICAvLyBjb25maWd1cmUgZmFsbCBiYWNrIHRvIHJvb3RcclxuICAgIGxldCBfZmFsbGJhY2tGb3JtYXQgPSAhIW9wdGlvbnMuZmFsbGJhY2tGb3JtYXQ7XHJcbiAgICAvLyBydW50aW1lIG1pc3NpbmdcclxuICAgIGxldCBfbWlzc2luZyA9IGlzRnVuY3Rpb24ob3B0aW9ucy5taXNzaW5nKSA/IG9wdGlvbnMubWlzc2luZyA6IG51bGw7XHJcbiAgICBsZXQgX3J1bnRpbWVNaXNzaW5nID0gaXNGdW5jdGlvbihvcHRpb25zLm1pc3NpbmcpXHJcbiAgICAgICAgPyBkZWZpbmVDb3JlTWlzc2luZ0hhbmRsZXIob3B0aW9ucy5taXNzaW5nKVxyXG4gICAgICAgIDogbnVsbDtcclxuICAgIC8vIHBvc3RUcmFuc2xhdGlvbiBoYW5kbGVyXHJcbiAgICBsZXQgX3Bvc3RUcmFuc2xhdGlvbiA9IGlzRnVuY3Rpb24ob3B0aW9ucy5wb3N0VHJhbnNsYXRpb24pXHJcbiAgICAgICAgPyBvcHRpb25zLnBvc3RUcmFuc2xhdGlvblxyXG4gICAgICAgIDogbnVsbDtcclxuICAgIGxldCBfd2Fybkh0bWxNZXNzYWdlID0gaXNCb29sZWFuKG9wdGlvbnMud2Fybkh0bWxNZXNzYWdlKVxyXG4gICAgICAgID8gb3B0aW9ucy53YXJuSHRtbE1lc3NhZ2VcclxuICAgICAgICA6IHRydWU7XHJcbiAgICBsZXQgX2VzY2FwZVBhcmFtZXRlciA9ICEhb3B0aW9ucy5lc2NhcGVQYXJhbWV0ZXI7XHJcbiAgICAvLyBjdXN0b20gbGlua2VkIG1vZGlmaWVyc1xyXG4gICAgLy8gcHJldHRpZXItaWdub3JlXHJcbiAgICBjb25zdCBfbW9kaWZpZXJzID0gX19yb290XHJcbiAgICAgICAgPyBfX3Jvb3QubW9kaWZpZXJzXHJcbiAgICAgICAgOiBpc1BsYWluT2JqZWN0KG9wdGlvbnMubW9kaWZpZXJzKVxyXG4gICAgICAgICAgICA/IG9wdGlvbnMubW9kaWZpZXJzXHJcbiAgICAgICAgICAgIDoge307XHJcbiAgICAvLyBwbHVyYWxSdWxlc1xyXG4gICAgbGV0IF9wbHVyYWxSdWxlcyA9IG9wdGlvbnMucGx1cmFsUnVsZXMgfHwgKF9fcm9vdCAmJiBfX3Jvb3QucGx1cmFsUnVsZXMpO1xyXG4gICAgLy8gcnVudGltZSBjb250ZXh0XHJcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcHJlZmVyLWNvbnN0XHJcbiAgICBsZXQgX2NvbnRleHQ7XHJcbiAgICBmdW5jdGlvbiBnZXRDb3JlQ29udGV4dCgpIHtcclxuICAgICAgICByZXR1cm4gY3JlYXRlQ29yZUNvbnRleHQoe1xyXG4gICAgICAgICAgICB2ZXJzaW9uOiBWRVJTSU9OLFxyXG4gICAgICAgICAgICBsb2NhbGU6IF9sb2NhbGUudmFsdWUsXHJcbiAgICAgICAgICAgIGZhbGxiYWNrTG9jYWxlOiBfZmFsbGJhY2tMb2NhbGUudmFsdWUsXHJcbiAgICAgICAgICAgIG1lc3NhZ2VzOiBfbWVzc2FnZXMudmFsdWUsXHJcbiAgICAgICAgICAgIGRhdGV0aW1lRm9ybWF0czogX2RhdGV0aW1lRm9ybWF0cy52YWx1ZSxcclxuICAgICAgICAgICAgbnVtYmVyRm9ybWF0czogX251bWJlckZvcm1hdHMudmFsdWUsXHJcbiAgICAgICAgICAgIG1vZGlmaWVyczogX21vZGlmaWVycyxcclxuICAgICAgICAgICAgcGx1cmFsUnVsZXM6IF9wbHVyYWxSdWxlcyxcclxuICAgICAgICAgICAgbWlzc2luZzogX3J1bnRpbWVNaXNzaW5nID09PSBudWxsID8gdW5kZWZpbmVkIDogX3J1bnRpbWVNaXNzaW5nLFxyXG4gICAgICAgICAgICBtaXNzaW5nV2FybjogX21pc3NpbmdXYXJuLFxyXG4gICAgICAgICAgICBmYWxsYmFja1dhcm46IF9mYWxsYmFja1dhcm4sXHJcbiAgICAgICAgICAgIGZhbGxiYWNrRm9ybWF0OiBfZmFsbGJhY2tGb3JtYXQsXHJcbiAgICAgICAgICAgIHVucmVzb2x2aW5nOiB0cnVlLFxyXG4gICAgICAgICAgICBwb3N0VHJhbnNsYXRpb246IF9wb3N0VHJhbnNsYXRpb24gPT09IG51bGwgPyB1bmRlZmluZWQgOiBfcG9zdFRyYW5zbGF0aW9uLFxyXG4gICAgICAgICAgICB3YXJuSHRtbE1lc3NhZ2U6IF93YXJuSHRtbE1lc3NhZ2UsXHJcbiAgICAgICAgICAgIGVzY2FwZVBhcmFtZXRlcjogX2VzY2FwZVBhcmFtZXRlcixcclxuICAgICAgICAgICAgX19kYXRldGltZUZvcm1hdHRlcnM6IGlzUGxhaW5PYmplY3QoX2NvbnRleHQpXHJcbiAgICAgICAgICAgICAgICA/IF9jb250ZXh0Ll9fZGF0ZXRpbWVGb3JtYXR0ZXJzXHJcbiAgICAgICAgICAgICAgICA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgX19udW1iZXJGb3JtYXR0ZXJzOiBpc1BsYWluT2JqZWN0KF9jb250ZXh0KVxyXG4gICAgICAgICAgICAgICAgPyBfY29udGV4dC5fX251bWJlckZvcm1hdHRlcnNcclxuICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBfX3ZfZW1pdHRlcjogaXNQbGFpbk9iamVjdChfY29udGV4dClcclxuICAgICAgICAgICAgICAgID8gX2NvbnRleHQuX192X2VtaXR0ZXJcclxuICAgICAgICAgICAgICAgIDogdW5kZWZpbmVkLFxyXG4gICAgICAgICAgICBfX21ldGE6IHsgZnJhbWV3b3JrOiAndnVlJyB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBfY29udGV4dCA9IGdldENvcmVDb250ZXh0KCk7XHJcbiAgICB1cGRhdGVGYWxsYmFja0xvY2FsZShfY29udGV4dCwgX2xvY2FsZS52YWx1ZSwgX2ZhbGxiYWNrTG9jYWxlLnZhbHVlKTtcclxuICAgIC8vIHRyYWNrIHJlYWN0aXZpdHlcclxuICAgIGZ1bmN0aW9uIHRyYWNrUmVhY3Rpdml0eVZhbHVlcygpIHtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBfbG9jYWxlLnZhbHVlLFxyXG4gICAgICAgICAgICBfZmFsbGJhY2tMb2NhbGUudmFsdWUsXHJcbiAgICAgICAgICAgIF9tZXNzYWdlcy52YWx1ZSxcclxuICAgICAgICAgICAgX2RhdGV0aW1lRm9ybWF0cy52YWx1ZSxcclxuICAgICAgICAgICAgX251bWJlckZvcm1hdHMudmFsdWVcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG4gICAgLy8gbG9jYWxlXHJcbiAgICBjb25zdCBsb2NhbGUgPSBjb21wdXRlZCh7XHJcbiAgICAgICAgZ2V0OiAoKSA9PiBfbG9jYWxlLnZhbHVlLFxyXG4gICAgICAgIHNldDogdmFsID0+IHtcclxuICAgICAgICAgICAgX2xvY2FsZS52YWx1ZSA9IHZhbDtcclxuICAgICAgICAgICAgX2NvbnRleHQubG9jYWxlID0gX2xvY2FsZS52YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIC8vIGZhbGxiYWNrTG9jYWxlXHJcbiAgICBjb25zdCBmYWxsYmFja0xvY2FsZSA9IGNvbXB1dGVkKHtcclxuICAgICAgICBnZXQ6ICgpID0+IF9mYWxsYmFja0xvY2FsZS52YWx1ZSxcclxuICAgICAgICBzZXQ6IHZhbCA9PiB7XHJcbiAgICAgICAgICAgIF9mYWxsYmFja0xvY2FsZS52YWx1ZSA9IHZhbDtcclxuICAgICAgICAgICAgX2NvbnRleHQuZmFsbGJhY2tMb2NhbGUgPSBfZmFsbGJhY2tMb2NhbGUudmFsdWU7XHJcbiAgICAgICAgICAgIHVwZGF0ZUZhbGxiYWNrTG9jYWxlKF9jb250ZXh0LCBfbG9jYWxlLnZhbHVlLCB2YWwpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgLy8gbWVzc2FnZXNcclxuICAgIGNvbnN0IG1lc3NhZ2VzID0gY29tcHV0ZWQoKCkgPT4gX21lc3NhZ2VzLnZhbHVlKTtcclxuICAgIC8vIGRhdGV0aW1lRm9ybWF0c1xyXG4gICAgY29uc3QgZGF0ZXRpbWVGb3JtYXRzID0gY29tcHV0ZWQoKCkgPT4gX2RhdGV0aW1lRm9ybWF0cy52YWx1ZSk7XHJcbiAgICAvLyBudW1iZXJGb3JtYXRzXHJcbiAgICBjb25zdCBudW1iZXJGb3JtYXRzID0gY29tcHV0ZWQoKCkgPT4gX251bWJlckZvcm1hdHMudmFsdWUpO1xyXG4gICAgLy8gZ2V0UG9zdFRyYW5zbGF0aW9uSGFuZGxlclxyXG4gICAgZnVuY3Rpb24gZ2V0UG9zdFRyYW5zbGF0aW9uSGFuZGxlcigpIHtcclxuICAgICAgICByZXR1cm4gaXNGdW5jdGlvbihfcG9zdFRyYW5zbGF0aW9uKSA/IF9wb3N0VHJhbnNsYXRpb24gOiBudWxsO1xyXG4gICAgfVxyXG4gICAgLy8gc2V0UG9zdFRyYW5zbGF0aW9uSGFuZGxlclxyXG4gICAgZnVuY3Rpb24gc2V0UG9zdFRyYW5zbGF0aW9uSGFuZGxlcihoYW5kbGVyKSB7XHJcbiAgICAgICAgX3Bvc3RUcmFuc2xhdGlvbiA9IGhhbmRsZXI7XHJcbiAgICAgICAgX2NvbnRleHQucG9zdFRyYW5zbGF0aW9uID0gaGFuZGxlcjtcclxuICAgIH1cclxuICAgIC8vIGdldE1pc3NpbmdIYW5kbGVyXHJcbiAgICBmdW5jdGlvbiBnZXRNaXNzaW5nSGFuZGxlcigpIHtcclxuICAgICAgICByZXR1cm4gX21pc3Npbmc7XHJcbiAgICB9XHJcbiAgICAvLyBzZXRNaXNzaW5nSGFuZGxlclxyXG4gICAgZnVuY3Rpb24gc2V0TWlzc2luZ0hhbmRsZXIoaGFuZGxlcikge1xyXG4gICAgICAgIGlmIChoYW5kbGVyICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIF9ydW50aW1lTWlzc2luZyA9IGRlZmluZUNvcmVNaXNzaW5nSGFuZGxlcihoYW5kbGVyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgX21pc3NpbmcgPSBoYW5kbGVyO1xyXG4gICAgICAgIF9jb250ZXh0Lm1pc3NpbmcgPSBfcnVudGltZU1pc3Npbmc7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBpc1Jlc29sdmVkVHJhbnNsYXRlTWVzc2FnZSh0eXBlLCBhcmcgLy8gZXNsaW50LWRpc2FibGUtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XHJcbiAgICApIHtcclxuICAgICAgICByZXR1cm4gdHlwZSAhPT0gJ3RyYW5zbGF0ZScgfHwgISFhcmcucmVzb2x2ZWRNZXNzYWdlID09PSBmYWxzZTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIHdyYXBXaXRoRGVwcyhmbiwgYXJndW1lbnRQYXJzZXIsIHdhcm5UeXBlLCBmYWxsYmFja1N1Y2Nlc3MsIGZhbGxiYWNrRmFpbCwgc3VjY2Vzc0NvbmRpdGlvbikge1xyXG4gICAgICAgIHRyYWNrUmVhY3Rpdml0eVZhbHVlcygpOyAvLyB0cmFjayByZWFjdGl2ZSBkZXBlbmRlbmN5XHJcbiAgICAgICAgLy8gTk9URTogZXhwZXJpbWVudGFsICEhXHJcbiAgICAgICAgbGV0IHJldDtcclxuICAgICAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHx8IF9fSU5UTElGWV9QUk9EX0RFVlRPT0xTX18pIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHNldEFkZGl0aW9uYWxNZXRhKGdldE1ldGFJbmZvKCkpO1xyXG4gICAgICAgICAgICAgICAgcmV0ID0gZm4oX2NvbnRleHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZpbmFsbHkge1xyXG4gICAgICAgICAgICAgICAgc2V0QWRkaXRpb25hbE1ldGEobnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldCA9IGZuKF9jb250ZXh0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGlzTnVtYmVyKHJldCkgJiYgcmV0ID09PSBOT1RfUkVPU0xWRUQpIHtcclxuICAgICAgICAgICAgY29uc3QgW2tleSwgYXJnMl0gPSBhcmd1bWVudFBhcnNlcigpO1xyXG4gICAgICAgICAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpICYmXHJcbiAgICAgICAgICAgICAgICBfX3Jvb3QgJiZcclxuICAgICAgICAgICAgICAgIGlzU3RyaW5nKGtleSkgJiZcclxuICAgICAgICAgICAgICAgIGlzUmVzb2x2ZWRUcmFuc2xhdGVNZXNzYWdlKHdhcm5UeXBlLCBhcmcyKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKF9mYWxsYmFja1Jvb3QgJiZcclxuICAgICAgICAgICAgICAgICAgICAoaXNUcmFuc2xhdGVGYWxsYmFja1dhcm4oX2ZhbGxiYWNrV2Fybiwga2V5KSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc1RyYW5zbGF0ZU1pc3NpbmdXYXJuKF9taXNzaW5nV2Fybiwga2V5KSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB3YXJuKGdldFdhcm5NZXNzYWdlKDYgLyogRkFMTEJBQ0tfVE9fUk9PVCAqLywge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IHdhcm5UeXBlXHJcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gZm9yIHZ1ZS1kZXZ0b29scyB0aW1lbGluZSBldmVudFxyXG4gICAgICAgICAgICAgICAgaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgX192X2VtaXR0ZXI6IGVtaXR0ZXIgfSA9IF9jb250ZXh0O1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlbWl0dGVyICYmIF9mYWxsYmFja1Jvb3QpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW1pdHRlci5lbWl0KFwiZmFsbGJhY2tcIiAvKiBGQUxCQUNLICovLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiB3YXJuVHlwZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGtleSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvOiAnZ2xvYmFsJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwSWQ6IGAke3dhcm5UeXBlfToke2tleX1gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gX19yb290ICYmIF9mYWxsYmFja1Jvb3RcclxuICAgICAgICAgICAgICAgID8gZmFsbGJhY2tTdWNjZXNzKF9fcm9vdClcclxuICAgICAgICAgICAgICAgIDogZmFsbGJhY2tGYWlsKGtleSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHN1Y2Nlc3NDb25kaXRpb24ocmV0KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cclxuICAgICAgICAgICAgdGhyb3cgY3JlYXRlSTE4bkVycm9yKDE0IC8qIFVORVhQRUNURURfUkVUVVJOX1RZUEUgKi8pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIHRcclxuICAgIGZ1bmN0aW9uIHQoLi4uYXJncykge1xyXG4gICAgICAgIHJldHVybiB3cmFwV2l0aERlcHMoY29udGV4dCA9PiB0cmFuc2xhdGUoY29udGV4dCwgLi4uYXJncyksICgpID0+IHBhcnNlVHJhbnNsYXRlQXJncyguLi5hcmdzKSwgJ3RyYW5zbGF0ZScsIHJvb3QgPT4gcm9vdC50KC4uLmFyZ3MpLCBrZXkgPT4ga2V5LCB2YWwgPT4gaXNTdHJpbmcodmFsKSk7XHJcbiAgICB9XHJcbiAgICAvLyBydFxyXG4gICAgZnVuY3Rpb24gcnQoLi4uYXJncykge1xyXG4gICAgICAgIGNvbnN0IFthcmcxLCBhcmcyLCBhcmczXSA9IGFyZ3M7XHJcbiAgICAgICAgaWYgKGFyZzMgJiYgIWlzT2JqZWN0KGFyZzMpKSB7XHJcbiAgICAgICAgICAgIHRocm93IGNyZWF0ZUkxOG5FcnJvcigxNSAvKiBJTlZBTElEX0FSR1VNRU5UICovKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQoLi4uW2FyZzEsIGFyZzIsIGFzc2lnbih7IHJlc29sdmVkTWVzc2FnZTogdHJ1ZSB9LCBhcmczIHx8IHt9KV0pO1xyXG4gICAgfVxyXG4gICAgLy8gZFxyXG4gICAgZnVuY3Rpb24gZCguLi5hcmdzKSB7XHJcbiAgICAgICAgcmV0dXJuIHdyYXBXaXRoRGVwcyhjb250ZXh0ID0+IGRhdGV0aW1lKGNvbnRleHQsIC4uLmFyZ3MpLCAoKSA9PiBwYXJzZURhdGVUaW1lQXJncyguLi5hcmdzKSwgJ2RhdGV0aW1lIGZvcm1hdCcsIHJvb3QgPT4gcm9vdC5kKC4uLmFyZ3MpLCAoKSA9PiBNSVNTSU5HX1JFU09MVkVfVkFMVUUsIHZhbCA9PiBpc1N0cmluZyh2YWwpKTtcclxuICAgIH1cclxuICAgIC8vIG5cclxuICAgIGZ1bmN0aW9uIG4oLi4uYXJncykge1xyXG4gICAgICAgIHJldHVybiB3cmFwV2l0aERlcHMoY29udGV4dCA9PiBudW1iZXIoY29udGV4dCwgLi4uYXJncyksICgpID0+IHBhcnNlTnVtYmVyQXJncyguLi5hcmdzKSwgJ251bWJlciBmb3JtYXQnLCByb290ID0+IHJvb3QubiguLi5hcmdzKSwgKCkgPT4gTUlTU0lOR19SRVNPTFZFX1ZBTFVFLCB2YWwgPT4gaXNTdHJpbmcodmFsKSk7XHJcbiAgICB9XHJcbiAgICAvLyBmb3IgY3VzdG9tIHByb2Nlc3NvclxyXG4gICAgZnVuY3Rpb24gbm9ybWFsaXplKHZhbHVlcykge1xyXG4gICAgICAgIHJldHVybiB2YWx1ZXMubWFwKHZhbCA9PiBpc1N0cmluZyh2YWwpID8gY3JlYXRlVk5vZGUoVGV4dCwgbnVsbCwgdmFsLCAwKSA6IHZhbCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBpbnRlcnBvbGF0ZSA9ICh2YWwpID0+IHZhbDtcclxuICAgIGNvbnN0IHByb2Nlc3NvciA9IHtcclxuICAgICAgICBub3JtYWxpemUsXHJcbiAgICAgICAgaW50ZXJwb2xhdGUsXHJcbiAgICAgICAgdHlwZTogJ3Zub2RlJ1xyXG4gICAgfTtcclxuICAgIC8vIHRyYW5zcmF0ZVZOb2RlLCB1c2luZyBmb3IgYGkxOG4tdGAgY29tcG9uZW50XHJcbiAgICBmdW5jdGlvbiB0cmFuc3JhdGVWTm9kZSguLi5hcmdzKSB7XHJcbiAgICAgICAgcmV0dXJuIHdyYXBXaXRoRGVwcyhjb250ZXh0ID0+IHtcclxuICAgICAgICAgICAgbGV0IHJldDtcclxuICAgICAgICAgICAgY29uc3QgX2NvbnRleHQgPSBjb250ZXh0O1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgX2NvbnRleHQucHJvY2Vzc29yID0gcHJvY2Vzc29yO1xyXG4gICAgICAgICAgICAgICAgcmV0ID0gdHJhbnNsYXRlKF9jb250ZXh0LCAuLi5hcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmaW5hbGx5IHtcclxuICAgICAgICAgICAgICAgIF9jb250ZXh0LnByb2Nlc3NvciA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICB9LCAoKSA9PiBwYXJzZVRyYW5zbGF0ZUFyZ3MoLi4uYXJncyksICd0cmFuc2xhdGUnLCBcclxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxyXG4gICAgICAgIHJvb3QgPT4gcm9vdFtUcmFuc3JhdGVWTm9kZVN5bWJvbF0oLi4uYXJncyksIGtleSA9PiBbY3JlYXRlVk5vZGUoVGV4dCwgbnVsbCwga2V5LCAwKV0sIHZhbCA9PiBpc0FycmF5KHZhbCkpO1xyXG4gICAgfVxyXG4gICAgLy8gbnVtYmVyUGFydHMsIHVzaW5nIGZvciBgaTE4bi1uYCBjb21wb25lbnRcclxuICAgIGZ1bmN0aW9uIG51bWJlclBhcnRzKC4uLmFyZ3MpIHtcclxuICAgICAgICByZXR1cm4gd3JhcFdpdGhEZXBzKGNvbnRleHQgPT4gbnVtYmVyKGNvbnRleHQsIC4uLmFyZ3MpLCAoKSA9PiBwYXJzZU51bWJlckFyZ3MoLi4uYXJncyksICdudW1iZXIgZm9ybWF0JywgXHJcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcclxuICAgICAgICByb290ID0+IHJvb3RbTnVtYmVyUGFydHNTeW1ib2xdKC4uLmFyZ3MpLCAoKSA9PiBbXSwgdmFsID0+IGlzU3RyaW5nKHZhbCkgfHwgaXNBcnJheSh2YWwpKTtcclxuICAgIH1cclxuICAgIC8vIGRhdGV0aW1lUGFydHMsIHVzaW5nIGZvciBgaTE4bi1kYCBjb21wb25lbnRcclxuICAgIGZ1bmN0aW9uIGRhdGV0aW1lUGFydHMoLi4uYXJncykge1xyXG4gICAgICAgIHJldHVybiB3cmFwV2l0aERlcHMoY29udGV4dCA9PiBkYXRldGltZShjb250ZXh0LCAuLi5hcmdzKSwgKCkgPT4gcGFyc2VEYXRlVGltZUFyZ3MoLi4uYXJncyksICdkYXRldGltZSBmb3JtYXQnLCBcclxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxyXG4gICAgICAgIHJvb3QgPT4gcm9vdFtEYXRldGltZVBhcnRzU3ltYm9sXSguLi5hcmdzKSwgKCkgPT4gW10sIHZhbCA9PiBpc1N0cmluZyh2YWwpIHx8IGlzQXJyYXkodmFsKSk7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBzZXRQbHVyYWxSdWxlcyhydWxlcykge1xyXG4gICAgICAgIF9wbHVyYWxSdWxlcyA9IHJ1bGVzO1xyXG4gICAgICAgIF9jb250ZXh0LnBsdXJhbFJ1bGVzID0gX3BsdXJhbFJ1bGVzO1xyXG4gICAgfVxyXG4gICAgLy8gdGVcclxuICAgIGZ1bmN0aW9uIHRlKGtleSwgbG9jYWxlKSB7XHJcbiAgICAgICAgY29uc3QgdGFyZ2V0TG9jYWxlID0gaXNTdHJpbmcobG9jYWxlKSA/IGxvY2FsZSA6IF9sb2NhbGUudmFsdWU7XHJcbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IGdldExvY2FsZU1lc3NhZ2UodGFyZ2V0TG9jYWxlKTtcclxuICAgICAgICByZXR1cm4gcmVzb2x2ZVZhbHVlKG1lc3NhZ2UsIGtleSkgIT09IG51bGw7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiByZXNvbHZlTWVzc2FnZXMoa2V5KSB7XHJcbiAgICAgICAgbGV0IG1lc3NhZ2VzID0gbnVsbDtcclxuICAgICAgICBjb25zdCBsb2NhbGVzID0gZ2V0TG9jYWxlQ2hhaW4oX2NvbnRleHQsIF9mYWxsYmFja0xvY2FsZS52YWx1ZSwgX2xvY2FsZS52YWx1ZSk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsb2NhbGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldExvY2FsZU1lc3NhZ2VzID0gX21lc3NhZ2VzLnZhbHVlW2xvY2FsZXNbaV1dIHx8IHt9O1xyXG4gICAgICAgICAgICBjb25zdCBtZXNzYWdlVmFsdWUgPSByZXNvbHZlVmFsdWUodGFyZ2V0TG9jYWxlTWVzc2FnZXMsIGtleSk7XHJcbiAgICAgICAgICAgIGlmIChtZXNzYWdlVmFsdWUgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZXMgPSBtZXNzYWdlVmFsdWU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbWVzc2FnZXM7XHJcbiAgICB9XHJcbiAgICAvLyB0bVxyXG4gICAgZnVuY3Rpb24gdG0oa2V5KSB7XHJcbiAgICAgICAgY29uc3QgbWVzc2FnZXMgPSByZXNvbHZlTWVzc2FnZXMoa2V5KTtcclxuICAgICAgICAvLyBwcmV0dGllci1pZ25vcmVcclxuICAgICAgICByZXR1cm4gbWVzc2FnZXMgIT0gbnVsbFxyXG4gICAgICAgICAgICA/IG1lc3NhZ2VzXHJcbiAgICAgICAgICAgIDogX19yb290XHJcbiAgICAgICAgICAgICAgICA/IF9fcm9vdC50bShrZXkpIHx8IHt9XHJcbiAgICAgICAgICAgICAgICA6IHt9O1xyXG4gICAgfVxyXG4gICAgLy8gZ2V0TG9jYWxlTWVzc2FnZVxyXG4gICAgZnVuY3Rpb24gZ2V0TG9jYWxlTWVzc2FnZShsb2NhbGUpIHtcclxuICAgICAgICByZXR1cm4gKF9tZXNzYWdlcy52YWx1ZVtsb2NhbGVdIHx8IHt9KTtcclxuICAgIH1cclxuICAgIC8vIHNldExvY2FsZU1lc3NhZ2VcclxuICAgIGZ1bmN0aW9uIHNldExvY2FsZU1lc3NhZ2UobG9jYWxlLCBtZXNzYWdlKSB7XHJcbiAgICAgICAgX21lc3NhZ2VzLnZhbHVlW2xvY2FsZV0gPSBtZXNzYWdlO1xyXG4gICAgICAgIF9jb250ZXh0Lm1lc3NhZ2VzID0gX21lc3NhZ2VzLnZhbHVlO1xyXG4gICAgfVxyXG4gICAgLy8gbWVyZ2VMb2NhbGVNZXNzYWdlXHJcbiAgICBmdW5jdGlvbiBtZXJnZUxvY2FsZU1lc3NhZ2UobG9jYWxlLCBtZXNzYWdlKSB7XHJcbiAgICAgICAgX21lc3NhZ2VzLnZhbHVlW2xvY2FsZV0gPSBfbWVzc2FnZXMudmFsdWVbbG9jYWxlXSB8fCB7fTtcclxuICAgICAgICBkZWVwQ29weShtZXNzYWdlLCBfbWVzc2FnZXMudmFsdWVbbG9jYWxlXSk7XHJcbiAgICAgICAgX2NvbnRleHQubWVzc2FnZXMgPSBfbWVzc2FnZXMudmFsdWU7XHJcbiAgICB9XHJcbiAgICAvLyBnZXREYXRlVGltZUZvcm1hdFxyXG4gICAgZnVuY3Rpb24gZ2V0RGF0ZVRpbWVGb3JtYXQobG9jYWxlKSB7XHJcbiAgICAgICAgcmV0dXJuIF9kYXRldGltZUZvcm1hdHMudmFsdWVbbG9jYWxlXSB8fCB7fTtcclxuICAgIH1cclxuICAgIC8vIHNldERhdGVUaW1lRm9ybWF0XHJcbiAgICBmdW5jdGlvbiBzZXREYXRlVGltZUZvcm1hdChsb2NhbGUsIGZvcm1hdCkge1xyXG4gICAgICAgIF9kYXRldGltZUZvcm1hdHMudmFsdWVbbG9jYWxlXSA9IGZvcm1hdDtcclxuICAgICAgICBfY29udGV4dC5kYXRldGltZUZvcm1hdHMgPSBfZGF0ZXRpbWVGb3JtYXRzLnZhbHVlO1xyXG4gICAgICAgIGNsZWFyRGF0ZVRpbWVGb3JtYXQoX2NvbnRleHQsIGxvY2FsZSwgZm9ybWF0KTtcclxuICAgIH1cclxuICAgIC8vIG1lcmdlRGF0ZVRpbWVGb3JtYXRcclxuICAgIGZ1bmN0aW9uIG1lcmdlRGF0ZVRpbWVGb3JtYXQobG9jYWxlLCBmb3JtYXQpIHtcclxuICAgICAgICBfZGF0ZXRpbWVGb3JtYXRzLnZhbHVlW2xvY2FsZV0gPSBhc3NpZ24oX2RhdGV0aW1lRm9ybWF0cy52YWx1ZVtsb2NhbGVdIHx8IHt9LCBmb3JtYXQpO1xyXG4gICAgICAgIF9jb250ZXh0LmRhdGV0aW1lRm9ybWF0cyA9IF9kYXRldGltZUZvcm1hdHMudmFsdWU7XHJcbiAgICAgICAgY2xlYXJEYXRlVGltZUZvcm1hdChfY29udGV4dCwgbG9jYWxlLCBmb3JtYXQpO1xyXG4gICAgfVxyXG4gICAgLy8gZ2V0TnVtYmVyRm9ybWF0XHJcbiAgICBmdW5jdGlvbiBnZXROdW1iZXJGb3JtYXQobG9jYWxlKSB7XHJcbiAgICAgICAgcmV0dXJuIF9udW1iZXJGb3JtYXRzLnZhbHVlW2xvY2FsZV0gfHwge307XHJcbiAgICB9XHJcbiAgICAvLyBzZXROdW1iZXJGb3JtYXRcclxuICAgIGZ1bmN0aW9uIHNldE51bWJlckZvcm1hdChsb2NhbGUsIGZvcm1hdCkge1xyXG4gICAgICAgIF9udW1iZXJGb3JtYXRzLnZhbHVlW2xvY2FsZV0gPSBmb3JtYXQ7XHJcbiAgICAgICAgX2NvbnRleHQubnVtYmVyRm9ybWF0cyA9IF9udW1iZXJGb3JtYXRzLnZhbHVlO1xyXG4gICAgICAgIGNsZWFyTnVtYmVyRm9ybWF0KF9jb250ZXh0LCBsb2NhbGUsIGZvcm1hdCk7XHJcbiAgICB9XHJcbiAgICAvLyBtZXJnZU51bWJlckZvcm1hdFxyXG4gICAgZnVuY3Rpb24gbWVyZ2VOdW1iZXJGb3JtYXQobG9jYWxlLCBmb3JtYXQpIHtcclxuICAgICAgICBfbnVtYmVyRm9ybWF0cy52YWx1ZVtsb2NhbGVdID0gYXNzaWduKF9udW1iZXJGb3JtYXRzLnZhbHVlW2xvY2FsZV0gfHwge30sIGZvcm1hdCk7XHJcbiAgICAgICAgX2NvbnRleHQubnVtYmVyRm9ybWF0cyA9IF9udW1iZXJGb3JtYXRzLnZhbHVlO1xyXG4gICAgICAgIGNsZWFyTnVtYmVyRm9ybWF0KF9jb250ZXh0LCBsb2NhbGUsIGZvcm1hdCk7XHJcbiAgICB9XHJcbiAgICAvLyBmb3IgZGVidWdcclxuICAgIGNvbXBvc2VySUQrKztcclxuICAgIC8vIHdhdGNoIHJvb3QgbG9jYWxlICYgZmFsbGJhY2tMb2NhbGVcclxuICAgIGlmIChfX3Jvb3QpIHtcclxuICAgICAgICB3YXRjaChfX3Jvb3QubG9jYWxlLCAodmFsKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChfaW5oZXJpdExvY2FsZSkge1xyXG4gICAgICAgICAgICAgICAgX2xvY2FsZS52YWx1ZSA9IHZhbDtcclxuICAgICAgICAgICAgICAgIF9jb250ZXh0LmxvY2FsZSA9IHZhbDtcclxuICAgICAgICAgICAgICAgIHVwZGF0ZUZhbGxiYWNrTG9jYWxlKF9jb250ZXh0LCBfbG9jYWxlLnZhbHVlLCBfZmFsbGJhY2tMb2NhbGUudmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgd2F0Y2goX19yb290LmZhbGxiYWNrTG9jYWxlLCAodmFsKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChfaW5oZXJpdExvY2FsZSkge1xyXG4gICAgICAgICAgICAgICAgX2ZhbGxiYWNrTG9jYWxlLnZhbHVlID0gdmFsO1xyXG4gICAgICAgICAgICAgICAgX2NvbnRleHQuZmFsbGJhY2tMb2NhbGUgPSB2YWw7XHJcbiAgICAgICAgICAgICAgICB1cGRhdGVGYWxsYmFja0xvY2FsZShfY29udGV4dCwgX2xvY2FsZS52YWx1ZSwgX2ZhbGxiYWNrTG9jYWxlLnZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLy8gZGVmaW5lIGNvbXBvc2l0aW9uIEFQSSFcclxuICAgIGNvbnN0IGNvbXBvc2VyID0ge1xyXG4gICAgICAgIGlkOiBjb21wb3NlcklELFxyXG4gICAgICAgIGxvY2FsZSxcclxuICAgICAgICBmYWxsYmFja0xvY2FsZSxcclxuICAgICAgICBnZXQgaW5oZXJpdExvY2FsZSgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF9pbmhlcml0TG9jYWxlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0IGluaGVyaXRMb2NhbGUodmFsKSB7XHJcbiAgICAgICAgICAgIF9pbmhlcml0TG9jYWxlID0gdmFsO1xyXG4gICAgICAgICAgICBpZiAodmFsICYmIF9fcm9vdCkge1xyXG4gICAgICAgICAgICAgICAgX2xvY2FsZS52YWx1ZSA9IF9fcm9vdC5sb2NhbGUudmFsdWU7XHJcbiAgICAgICAgICAgICAgICBfZmFsbGJhY2tMb2NhbGUudmFsdWUgPSBfX3Jvb3QuZmFsbGJhY2tMb2NhbGUudmFsdWU7XHJcbiAgICAgICAgICAgICAgICB1cGRhdGVGYWxsYmFja0xvY2FsZShfY29udGV4dCwgX2xvY2FsZS52YWx1ZSwgX2ZhbGxiYWNrTG9jYWxlLnZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0IGF2YWlsYWJsZUxvY2FsZXMoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhfbWVzc2FnZXMudmFsdWUpLnNvcnQoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIG1lc3NhZ2VzLFxyXG4gICAgICAgIGRhdGV0aW1lRm9ybWF0cyxcclxuICAgICAgICBudW1iZXJGb3JtYXRzLFxyXG4gICAgICAgIGdldCBtb2RpZmllcnMoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBfbW9kaWZpZXJzO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0IHBsdXJhbFJ1bGVzKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gX3BsdXJhbFJ1bGVzIHx8IHt9O1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0IGlzR2xvYmFsKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gX2lzR2xvYmFsO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0IG1pc3NpbmdXYXJuKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gX21pc3NpbmdXYXJuO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0IG1pc3NpbmdXYXJuKHZhbCkge1xyXG4gICAgICAgICAgICBfbWlzc2luZ1dhcm4gPSB2YWw7XHJcbiAgICAgICAgICAgIF9jb250ZXh0Lm1pc3NpbmdXYXJuID0gX21pc3NpbmdXYXJuO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0IGZhbGxiYWNrV2FybigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF9mYWxsYmFja1dhcm47XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQgZmFsbGJhY2tXYXJuKHZhbCkge1xyXG4gICAgICAgICAgICBfZmFsbGJhY2tXYXJuID0gdmFsO1xyXG4gICAgICAgICAgICBfY29udGV4dC5mYWxsYmFja1dhcm4gPSBfZmFsbGJhY2tXYXJuO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0IGZhbGxiYWNrUm9vdCgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF9mYWxsYmFja1Jvb3Q7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQgZmFsbGJhY2tSb290KHZhbCkge1xyXG4gICAgICAgICAgICBfZmFsbGJhY2tSb290ID0gdmFsO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0IGZhbGxiYWNrRm9ybWF0KCkge1xyXG4gICAgICAgICAgICByZXR1cm4gX2ZhbGxiYWNrRm9ybWF0O1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0IGZhbGxiYWNrRm9ybWF0KHZhbCkge1xyXG4gICAgICAgICAgICBfZmFsbGJhY2tGb3JtYXQgPSB2YWw7XHJcbiAgICAgICAgICAgIF9jb250ZXh0LmZhbGxiYWNrRm9ybWF0ID0gX2ZhbGxiYWNrRm9ybWF0O1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZ2V0IHdhcm5IdG1sTWVzc2FnZSgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF93YXJuSHRtbE1lc3NhZ2U7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQgd2Fybkh0bWxNZXNzYWdlKHZhbCkge1xyXG4gICAgICAgICAgICBfd2Fybkh0bWxNZXNzYWdlID0gdmFsO1xyXG4gICAgICAgICAgICBfY29udGV4dC53YXJuSHRtbE1lc3NhZ2UgPSB2YWw7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBnZXQgZXNjYXBlUGFyYW1ldGVyKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gX2VzY2FwZVBhcmFtZXRlcjtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldCBlc2NhcGVQYXJhbWV0ZXIodmFsKSB7XHJcbiAgICAgICAgICAgIF9lc2NhcGVQYXJhbWV0ZXIgPSB2YWw7XHJcbiAgICAgICAgICAgIF9jb250ZXh0LmVzY2FwZVBhcmFtZXRlciA9IHZhbDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHQsXHJcbiAgICAgICAgcnQsXHJcbiAgICAgICAgZCxcclxuICAgICAgICBuLFxyXG4gICAgICAgIHRlLFxyXG4gICAgICAgIHRtLFxyXG4gICAgICAgIGdldExvY2FsZU1lc3NhZ2UsXHJcbiAgICAgICAgc2V0TG9jYWxlTWVzc2FnZSxcclxuICAgICAgICBtZXJnZUxvY2FsZU1lc3NhZ2UsXHJcbiAgICAgICAgZ2V0RGF0ZVRpbWVGb3JtYXQsXHJcbiAgICAgICAgc2V0RGF0ZVRpbWVGb3JtYXQsXHJcbiAgICAgICAgbWVyZ2VEYXRlVGltZUZvcm1hdCxcclxuICAgICAgICBnZXROdW1iZXJGb3JtYXQsXHJcbiAgICAgICAgc2V0TnVtYmVyRm9ybWF0LFxyXG4gICAgICAgIG1lcmdlTnVtYmVyRm9ybWF0LFxyXG4gICAgICAgIGdldFBvc3RUcmFuc2xhdGlvbkhhbmRsZXIsXHJcbiAgICAgICAgc2V0UG9zdFRyYW5zbGF0aW9uSGFuZGxlcixcclxuICAgICAgICBnZXRNaXNzaW5nSGFuZGxlcixcclxuICAgICAgICBzZXRNaXNzaW5nSGFuZGxlcixcclxuICAgICAgICBbVHJhbnNyYXRlVk5vZGVTeW1ib2xdOiB0cmFuc3JhdGVWTm9kZSxcclxuICAgICAgICBbTnVtYmVyUGFydHNTeW1ib2xdOiBudW1iZXJQYXJ0cyxcclxuICAgICAgICBbRGF0ZXRpbWVQYXJ0c1N5bWJvbF06IGRhdGV0aW1lUGFydHMsXHJcbiAgICAgICAgW1NldFBsdXJhbFJ1bGVzU3ltYm9sXTogc2V0UGx1cmFsUnVsZXMsXHJcbiAgICAgICAgW0luZWpjdFdpdGhPcHRpb25dOiBvcHRpb25zLl9faW5qZWN0V2l0aE9wdGlvbiAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcclxuICAgIH07XHJcbiAgICAvLyBmb3IgdnVlLWRldnRvb2xzIHRpbWVsaW5lIGV2ZW50XHJcbiAgICBpZiAoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpKSB7XHJcbiAgICAgICAgY29tcG9zZXJbRW5hYmxlRW1pdHRlcl0gPSAoZW1pdHRlcikgPT4ge1xyXG4gICAgICAgICAgICBfY29udGV4dC5fX3ZfZW1pdHRlciA9IGVtaXR0ZXI7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb21wb3NlcltEaXNhYmxlRW1pdHRlcl0gPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIF9jb250ZXh0Ll9fdl9lbWl0dGVyID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY29tcG9zZXI7XHJcbn1cblxuLyoqXHJcbiAqIENvbnZlcnQgdG8gSTE4biBDb21wb3NlciBPcHRpb25zIGZyb20gVnVlSTE4biBPcHRpb25zXHJcbiAqXHJcbiAqIEBpbnRlcm5hbFxyXG4gKi9cclxuZnVuY3Rpb24gY29udmVydENvbXBvc2VyT3B0aW9ucyhvcHRpb25zKSB7XHJcbiAgICBjb25zdCBsb2NhbGUgPSBpc1N0cmluZyhvcHRpb25zLmxvY2FsZSkgPyBvcHRpb25zLmxvY2FsZSA6ICdlbi1VUyc7XHJcbiAgICBjb25zdCBmYWxsYmFja0xvY2FsZSA9IGlzU3RyaW5nKG9wdGlvbnMuZmFsbGJhY2tMb2NhbGUpIHx8XHJcbiAgICAgICAgaXNBcnJheShvcHRpb25zLmZhbGxiYWNrTG9jYWxlKSB8fFxyXG4gICAgICAgIGlzUGxhaW5PYmplY3Qob3B0aW9ucy5mYWxsYmFja0xvY2FsZSkgfHxcclxuICAgICAgICBvcHRpb25zLmZhbGxiYWNrTG9jYWxlID09PSBmYWxzZVxyXG4gICAgICAgID8gb3B0aW9ucy5mYWxsYmFja0xvY2FsZVxyXG4gICAgICAgIDogbG9jYWxlO1xyXG4gICAgY29uc3QgbWlzc2luZyA9IGlzRnVuY3Rpb24ob3B0aW9ucy5taXNzaW5nKSA/IG9wdGlvbnMubWlzc2luZyA6IHVuZGVmaW5lZDtcclxuICAgIGNvbnN0IG1pc3NpbmdXYXJuID0gaXNCb29sZWFuKG9wdGlvbnMuc2lsZW50VHJhbnNsYXRpb25XYXJuKSB8fFxyXG4gICAgICAgIGlzUmVnRXhwKG9wdGlvbnMuc2lsZW50VHJhbnNsYXRpb25XYXJuKVxyXG4gICAgICAgID8gIW9wdGlvbnMuc2lsZW50VHJhbnNsYXRpb25XYXJuXHJcbiAgICAgICAgOiB0cnVlO1xyXG4gICAgY29uc3QgZmFsbGJhY2tXYXJuID0gaXNCb29sZWFuKG9wdGlvbnMuc2lsZW50RmFsbGJhY2tXYXJuKSB8fFxyXG4gICAgICAgIGlzUmVnRXhwKG9wdGlvbnMuc2lsZW50RmFsbGJhY2tXYXJuKVxyXG4gICAgICAgID8gIW9wdGlvbnMuc2lsZW50RmFsbGJhY2tXYXJuXHJcbiAgICAgICAgOiB0cnVlO1xyXG4gICAgY29uc3QgZmFsbGJhY2tSb290ID0gaXNCb29sZWFuKG9wdGlvbnMuZmFsbGJhY2tSb290KVxyXG4gICAgICAgID8gb3B0aW9ucy5mYWxsYmFja1Jvb3RcclxuICAgICAgICA6IHRydWU7XHJcbiAgICBjb25zdCBmYWxsYmFja0Zvcm1hdCA9ICEhb3B0aW9ucy5mb3JtYXRGYWxsYmFja01lc3NhZ2VzO1xyXG4gICAgY29uc3QgbW9kaWZpZXJzID0gaXNQbGFpbk9iamVjdChvcHRpb25zLm1vZGlmaWVycykgPyBvcHRpb25zLm1vZGlmaWVycyA6IHt9O1xyXG4gICAgY29uc3QgcGx1cmFsaXphdGlvblJ1bGVzID0gb3B0aW9ucy5wbHVyYWxpemF0aW9uUnVsZXM7XHJcbiAgICBjb25zdCBwb3N0VHJhbnNsYXRpb24gPSBpc0Z1bmN0aW9uKG9wdGlvbnMucG9zdFRyYW5zbGF0aW9uKVxyXG4gICAgICAgID8gb3B0aW9ucy5wb3N0VHJhbnNsYXRpb25cclxuICAgICAgICA6IHVuZGVmaW5lZDtcclxuICAgIGNvbnN0IHdhcm5IdG1sTWVzc2FnZSA9IGlzU3RyaW5nKG9wdGlvbnMud2Fybkh0bWxJbk1lc3NhZ2UpXHJcbiAgICAgICAgPyBvcHRpb25zLndhcm5IdG1sSW5NZXNzYWdlICE9PSAnb2ZmJ1xyXG4gICAgICAgIDogdHJ1ZTtcclxuICAgIGNvbnN0IGVzY2FwZVBhcmFtZXRlciA9ICEhb3B0aW9ucy5lc2NhcGVQYXJhbWV0ZXJIdG1sO1xyXG4gICAgY29uc3QgaW5oZXJpdExvY2FsZSA9IGlzQm9vbGVhbihvcHRpb25zLnN5bmMpID8gb3B0aW9ucy5zeW5jIDogdHJ1ZTtcclxuICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgJiYgb3B0aW9ucy5mb3JtYXR0ZXIpIHtcclxuICAgICAgICB3YXJuKGdldFdhcm5NZXNzYWdlKDggLyogTk9UX1NVUFBPUlRFRF9GT1JNQVRURVIgKi8pKTtcclxuICAgIH1cclxuICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgJiYgb3B0aW9ucy5wcmVzZXJ2ZURpcmVjdGl2ZUNvbnRlbnQpIHtcclxuICAgICAgICB3YXJuKGdldFdhcm5NZXNzYWdlKDkgLyogTk9UX1NVUFBPUlRFRF9QUkVTRVJWRV9ESVJFQ1RJVkUgKi8pKTtcclxuICAgIH1cclxuICAgIGxldCBtZXNzYWdlcyA9IG9wdGlvbnMubWVzc2FnZXM7XHJcbiAgICBpZiAoaXNQbGFpbk9iamVjdChvcHRpb25zLnNoYXJlZE1lc3NhZ2VzKSkge1xyXG4gICAgICAgIGNvbnN0IHNoYXJlZE1lc3NhZ2VzID0gb3B0aW9ucy5zaGFyZWRNZXNzYWdlcztcclxuICAgICAgICBjb25zdCBsb2NhbGVzID0gT2JqZWN0LmtleXMoc2hhcmVkTWVzc2FnZXMpO1xyXG4gICAgICAgIG1lc3NhZ2VzID0gbG9jYWxlcy5yZWR1Y2UoKG1lc3NhZ2VzLCBsb2NhbGUpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IG1lc3NhZ2VzW2xvY2FsZV0gfHwgKG1lc3NhZ2VzW2xvY2FsZV0gPSB7fSk7XHJcbiAgICAgICAgICAgIGFzc2lnbihtZXNzYWdlLCBzaGFyZWRNZXNzYWdlc1tsb2NhbGVdKTtcclxuICAgICAgICAgICAgcmV0dXJuIG1lc3NhZ2VzO1xyXG4gICAgICAgIH0sIChtZXNzYWdlcyB8fCB7fSkpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgeyBfX2kxOG4sIF9fcm9vdCwgX19pbmplY3RXaXRoT3B0aW9uIH0gPSBvcHRpb25zO1xyXG4gICAgY29uc3QgZGF0ZXRpbWVGb3JtYXRzID0gb3B0aW9ucy5kYXRldGltZUZvcm1hdHM7XHJcbiAgICBjb25zdCBudW1iZXJGb3JtYXRzID0gb3B0aW9ucy5udW1iZXJGb3JtYXRzO1xyXG4gICAgY29uc3QgZmxhdEpzb24gPSBvcHRpb25zLmZsYXRKc29uO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBsb2NhbGUsXHJcbiAgICAgICAgZmFsbGJhY2tMb2NhbGUsXHJcbiAgICAgICAgbWVzc2FnZXMsXHJcbiAgICAgICAgZmxhdEpzb24sXHJcbiAgICAgICAgZGF0ZXRpbWVGb3JtYXRzLFxyXG4gICAgICAgIG51bWJlckZvcm1hdHMsXHJcbiAgICAgICAgbWlzc2luZyxcclxuICAgICAgICBtaXNzaW5nV2FybixcclxuICAgICAgICBmYWxsYmFja1dhcm4sXHJcbiAgICAgICAgZmFsbGJhY2tSb290LFxyXG4gICAgICAgIGZhbGxiYWNrRm9ybWF0LFxyXG4gICAgICAgIG1vZGlmaWVycyxcclxuICAgICAgICBwbHVyYWxSdWxlczogcGx1cmFsaXphdGlvblJ1bGVzLFxyXG4gICAgICAgIHBvc3RUcmFuc2xhdGlvbixcclxuICAgICAgICB3YXJuSHRtbE1lc3NhZ2UsXHJcbiAgICAgICAgZXNjYXBlUGFyYW1ldGVyLFxyXG4gICAgICAgIGluaGVyaXRMb2NhbGUsXHJcbiAgICAgICAgX19pMThuLFxyXG4gICAgICAgIF9fcm9vdCxcclxuICAgICAgICBfX2luamVjdFdpdGhPcHRpb25cclxuICAgIH07XHJcbn1cclxuLyoqXHJcbiAqIGNyZWF0ZSBWdWVJMThuIGludGVyZmFjZSBmYWN0b3J5XHJcbiAqXHJcbiAqIEBpbnRlcm5hbFxyXG4gKi9cclxuZnVuY3Rpb24gY3JlYXRlVnVlSTE4bihvcHRpb25zID0ge30pIHtcclxuICAgIGNvbnN0IGNvbXBvc2VyID0gY3JlYXRlQ29tcG9zZXIoY29udmVydENvbXBvc2VyT3B0aW9ucyhvcHRpb25zKSk7XHJcbiAgICAvLyBkZWZpbmVzIFZ1ZUkxOG5cclxuICAgIGNvbnN0IHZ1ZUkxOG4gPSB7XHJcbiAgICAgICAgLy8gaWRcclxuICAgICAgICBpZDogY29tcG9zZXIuaWQsXHJcbiAgICAgICAgLy8gbG9jYWxlXHJcbiAgICAgICAgZ2V0IGxvY2FsZSgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbXBvc2VyLmxvY2FsZS52YWx1ZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldCBsb2NhbGUodmFsKSB7XHJcbiAgICAgICAgICAgIGNvbXBvc2VyLmxvY2FsZS52YWx1ZSA9IHZhbDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIGZhbGxiYWNrTG9jYWxlXHJcbiAgICAgICAgZ2V0IGZhbGxiYWNrTG9jYWxlKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gY29tcG9zZXIuZmFsbGJhY2tMb2NhbGUudmFsdWU7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQgZmFsbGJhY2tMb2NhbGUodmFsKSB7XHJcbiAgICAgICAgICAgIGNvbXBvc2VyLmZhbGxiYWNrTG9jYWxlLnZhbHVlID0gdmFsO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8gbWVzc2FnZXNcclxuICAgICAgICBnZXQgbWVzc2FnZXMoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjb21wb3Nlci5tZXNzYWdlcy52YWx1ZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIGRhdGV0aW1lRm9ybWF0c1xyXG4gICAgICAgIGdldCBkYXRldGltZUZvcm1hdHMoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjb21wb3Nlci5kYXRldGltZUZvcm1hdHMudmFsdWU7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyBudW1iZXJGb3JtYXRzXHJcbiAgICAgICAgZ2V0IG51bWJlckZvcm1hdHMoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjb21wb3Nlci5udW1iZXJGb3JtYXRzLnZhbHVlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8gYXZhaWxhYmxlTG9jYWxlc1xyXG4gICAgICAgIGdldCBhdmFpbGFibGVMb2NhbGVzKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gY29tcG9zZXIuYXZhaWxhYmxlTG9jYWxlcztcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIGZvcm1hdHRlclxyXG4gICAgICAgIGdldCBmb3JtYXR0ZXIoKSB7XHJcbiAgICAgICAgICAgIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSAmJiB3YXJuKGdldFdhcm5NZXNzYWdlKDggLyogTk9UX1NVUFBPUlRFRF9GT1JNQVRURVIgKi8pKTtcclxuICAgICAgICAgICAgLy8gZHVtbXlcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGludGVycG9sYXRlKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNldCBmb3JtYXR0ZXIodmFsKSB7XHJcbiAgICAgICAgICAgIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSAmJiB3YXJuKGdldFdhcm5NZXNzYWdlKDggLyogTk9UX1NVUFBPUlRFRF9GT1JNQVRURVIgKi8pKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIG1pc3NpbmdcclxuICAgICAgICBnZXQgbWlzc2luZygpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbXBvc2VyLmdldE1pc3NpbmdIYW5kbGVyKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQgbWlzc2luZyhoYW5kbGVyKSB7XHJcbiAgICAgICAgICAgIGNvbXBvc2VyLnNldE1pc3NpbmdIYW5kbGVyKGhhbmRsZXIpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8gc2lsZW50VHJhbnNsYXRpb25XYXJuXHJcbiAgICAgICAgZ2V0IHNpbGVudFRyYW5zbGF0aW9uV2FybigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGlzQm9vbGVhbihjb21wb3Nlci5taXNzaW5nV2FybilcclxuICAgICAgICAgICAgICAgID8gIWNvbXBvc2VyLm1pc3NpbmdXYXJuXHJcbiAgICAgICAgICAgICAgICA6IGNvbXBvc2VyLm1pc3NpbmdXYXJuO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0IHNpbGVudFRyYW5zbGF0aW9uV2Fybih2YWwpIHtcclxuICAgICAgICAgICAgY29tcG9zZXIubWlzc2luZ1dhcm4gPSBpc0Jvb2xlYW4odmFsKSA/ICF2YWwgOiB2YWw7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyBzaWxlbnRGYWxsYmFja1dhcm5cclxuICAgICAgICBnZXQgc2lsZW50RmFsbGJhY2tXYXJuKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gaXNCb29sZWFuKGNvbXBvc2VyLmZhbGxiYWNrV2FybilcclxuICAgICAgICAgICAgICAgID8gIWNvbXBvc2VyLmZhbGxiYWNrV2FyblxyXG4gICAgICAgICAgICAgICAgOiBjb21wb3Nlci5mYWxsYmFja1dhcm47XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQgc2lsZW50RmFsbGJhY2tXYXJuKHZhbCkge1xyXG4gICAgICAgICAgICBjb21wb3Nlci5mYWxsYmFja1dhcm4gPSBpc0Jvb2xlYW4odmFsKSA/ICF2YWwgOiB2YWw7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyBtb2RpZmllcnNcclxuICAgICAgICBnZXQgbW9kaWZpZXJzKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gY29tcG9zZXIubW9kaWZpZXJzO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8gZm9ybWF0RmFsbGJhY2tNZXNzYWdlc1xyXG4gICAgICAgIGdldCBmb3JtYXRGYWxsYmFja01lc3NhZ2VzKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gY29tcG9zZXIuZmFsbGJhY2tGb3JtYXQ7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZXQgZm9ybWF0RmFsbGJhY2tNZXNzYWdlcyh2YWwpIHtcclxuICAgICAgICAgICAgY29tcG9zZXIuZmFsbGJhY2tGb3JtYXQgPSB2YWw7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyBwb3N0VHJhbnNsYXRpb25cclxuICAgICAgICBnZXQgcG9zdFRyYW5zbGF0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gY29tcG9zZXIuZ2V0UG9zdFRyYW5zbGF0aW9uSGFuZGxlcigpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0IHBvc3RUcmFuc2xhdGlvbihoYW5kbGVyKSB7XHJcbiAgICAgICAgICAgIGNvbXBvc2VyLnNldFBvc3RUcmFuc2xhdGlvbkhhbmRsZXIoaGFuZGxlcik7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyBzeW5jXHJcbiAgICAgICAgZ2V0IHN5bmMoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjb21wb3Nlci5pbmhlcml0TG9jYWxlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0IHN5bmModmFsKSB7XHJcbiAgICAgICAgICAgIGNvbXBvc2VyLmluaGVyaXRMb2NhbGUgPSB2YWw7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyB3YXJuSW5IdG1sTWVzc2FnZVxyXG4gICAgICAgIGdldCB3YXJuSHRtbEluTWVzc2FnZSgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbXBvc2VyLndhcm5IdG1sTWVzc2FnZSA/ICd3YXJuJyA6ICdvZmYnO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0IHdhcm5IdG1sSW5NZXNzYWdlKHZhbCkge1xyXG4gICAgICAgICAgICBjb21wb3Nlci53YXJuSHRtbE1lc3NhZ2UgPSB2YWwgIT09ICdvZmYnO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8gZXNjYXBlUGFyYW1ldGVySHRtbFxyXG4gICAgICAgIGdldCBlc2NhcGVQYXJhbWV0ZXJIdG1sKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gY29tcG9zZXIuZXNjYXBlUGFyYW1ldGVyO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0IGVzY2FwZVBhcmFtZXRlckh0bWwodmFsKSB7XHJcbiAgICAgICAgICAgIGNvbXBvc2VyLmVzY2FwZVBhcmFtZXRlciA9IHZhbDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIHByZXNlcnZlRGlyZWN0aXZlQ29udGVudFxyXG4gICAgICAgIGdldCBwcmVzZXJ2ZURpcmVjdGl2ZUNvbnRlbnQoKSB7XHJcbiAgICAgICAgICAgIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSAmJlxyXG4gICAgICAgICAgICAgICAgd2FybihnZXRXYXJuTWVzc2FnZSg5IC8qIE5PVF9TVVBQT1JURURfUFJFU0VSVkVfRElSRUNUSVZFICovKSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2V0IHByZXNlcnZlRGlyZWN0aXZlQ29udGVudCh2YWwpIHtcclxuICAgICAgICAgICAgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpICYmXHJcbiAgICAgICAgICAgICAgICB3YXJuKGdldFdhcm5NZXNzYWdlKDkgLyogTk9UX1NVUFBPUlRFRF9QUkVTRVJWRV9ESVJFQ1RJVkUgKi8pKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIHBsdXJhbGl6YXRpb25SdWxlc1xyXG4gICAgICAgIGdldCBwbHVyYWxpemF0aW9uUnVsZXMoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjb21wb3Nlci5wbHVyYWxSdWxlcyB8fCB7fTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIGZvciBpbnRlcm5hbFxyXG4gICAgICAgIF9fY29tcG9zZXI6IGNvbXBvc2VyLFxyXG4gICAgICAgIC8vIHRcclxuICAgICAgICB0KC4uLmFyZ3MpIHtcclxuICAgICAgICAgICAgY29uc3QgW2FyZzEsIGFyZzIsIGFyZzNdID0gYXJncztcclxuICAgICAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHt9O1xyXG4gICAgICAgICAgICBsZXQgbGlzdCA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCBuYW1lZCA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmICghaXNTdHJpbmcoYXJnMSkpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IGNyZWF0ZUkxOG5FcnJvcigxNSAvKiBJTlZBTElEX0FSR1VNRU5UICovKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBrZXkgPSBhcmcxO1xyXG4gICAgICAgICAgICBpZiAoaXNTdHJpbmcoYXJnMikpIHtcclxuICAgICAgICAgICAgICAgIG9wdGlvbnMubG9jYWxlID0gYXJnMjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChpc0FycmF5KGFyZzIpKSB7XHJcbiAgICAgICAgICAgICAgICBsaXN0ID0gYXJnMjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChpc1BsYWluT2JqZWN0KGFyZzIpKSB7XHJcbiAgICAgICAgICAgICAgICBuYW1lZCA9IGFyZzI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGlzQXJyYXkoYXJnMykpIHtcclxuICAgICAgICAgICAgICAgIGxpc3QgPSBhcmczO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGlzUGxhaW5PYmplY3QoYXJnMykpIHtcclxuICAgICAgICAgICAgICAgIG5hbWVkID0gYXJnMztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gY29tcG9zZXIudChrZXksIGxpc3QgfHwgbmFtZWQgfHwge30sIG9wdGlvbnMpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcnQoLi4uYXJncykge1xyXG4gICAgICAgICAgICByZXR1cm4gY29tcG9zZXIucnQoLi4uYXJncyk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyB0Y1xyXG4gICAgICAgIHRjKC4uLmFyZ3MpIHtcclxuICAgICAgICAgICAgY29uc3QgW2FyZzEsIGFyZzIsIGFyZzNdID0gYXJncztcclxuICAgICAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHsgcGx1cmFsOiAxIH07XHJcbiAgICAgICAgICAgIGxldCBsaXN0ID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IG5hbWVkID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKCFpc1N0cmluZyhhcmcxKSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgY3JlYXRlSTE4bkVycm9yKDE1IC8qIElOVkFMSURfQVJHVU1FTlQgKi8pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGtleSA9IGFyZzE7XHJcbiAgICAgICAgICAgIGlmIChpc1N0cmluZyhhcmcyKSkge1xyXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5sb2NhbGUgPSBhcmcyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGlzTnVtYmVyKGFyZzIpKSB7XHJcbiAgICAgICAgICAgICAgICBvcHRpb25zLnBsdXJhbCA9IGFyZzI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoaXNBcnJheShhcmcyKSkge1xyXG4gICAgICAgICAgICAgICAgbGlzdCA9IGFyZzI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoaXNQbGFpbk9iamVjdChhcmcyKSkge1xyXG4gICAgICAgICAgICAgICAgbmFtZWQgPSBhcmcyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChpc1N0cmluZyhhcmczKSkge1xyXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5sb2NhbGUgPSBhcmczO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGlzQXJyYXkoYXJnMykpIHtcclxuICAgICAgICAgICAgICAgIGxpc3QgPSBhcmczO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGlzUGxhaW5PYmplY3QoYXJnMykpIHtcclxuICAgICAgICAgICAgICAgIG5hbWVkID0gYXJnMztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gY29tcG9zZXIudChrZXksIGxpc3QgfHwgbmFtZWQgfHwge30sIG9wdGlvbnMpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8gdGVcclxuICAgICAgICB0ZShrZXksIGxvY2FsZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gY29tcG9zZXIudGUoa2V5LCBsb2NhbGUpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8gdG1cclxuICAgICAgICB0bShrZXkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbXBvc2VyLnRtKGtleSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyBnZXRMb2NhbGVNZXNzYWdlXHJcbiAgICAgICAgZ2V0TG9jYWxlTWVzc2FnZShsb2NhbGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbXBvc2VyLmdldExvY2FsZU1lc3NhZ2UobG9jYWxlKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIHNldExvY2FsZU1lc3NhZ2VcclxuICAgICAgICBzZXRMb2NhbGVNZXNzYWdlKGxvY2FsZSwgbWVzc2FnZSkge1xyXG4gICAgICAgICAgICBjb21wb3Nlci5zZXRMb2NhbGVNZXNzYWdlKGxvY2FsZSwgbWVzc2FnZSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyBtZXJnZUxvY2FsZU1lc3NhZ2VcclxuICAgICAgICBtZXJnZUxvY2FsZU1lc3NhZ2UobG9jYWxlLCBtZXNzYWdlKSB7XHJcbiAgICAgICAgICAgIGNvbXBvc2VyLm1lcmdlTG9jYWxlTWVzc2FnZShsb2NhbGUsIG1lc3NhZ2UpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8gZFxyXG4gICAgICAgIGQoLi4uYXJncykge1xyXG4gICAgICAgICAgICByZXR1cm4gY29tcG9zZXIuZCguLi5hcmdzKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIGdldERhdGVUaW1lRm9ybWF0XHJcbiAgICAgICAgZ2V0RGF0ZVRpbWVGb3JtYXQobG9jYWxlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjb21wb3Nlci5nZXREYXRlVGltZUZvcm1hdChsb2NhbGUpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8gc2V0RGF0ZVRpbWVGb3JtYXRcclxuICAgICAgICBzZXREYXRlVGltZUZvcm1hdChsb2NhbGUsIGZvcm1hdCkge1xyXG4gICAgICAgICAgICBjb21wb3Nlci5zZXREYXRlVGltZUZvcm1hdChsb2NhbGUsIGZvcm1hdCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyBtZXJnZURhdGVUaW1lRm9ybWF0XHJcbiAgICAgICAgbWVyZ2VEYXRlVGltZUZvcm1hdChsb2NhbGUsIGZvcm1hdCkge1xyXG4gICAgICAgICAgICBjb21wb3Nlci5tZXJnZURhdGVUaW1lRm9ybWF0KGxvY2FsZSwgZm9ybWF0KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIG5cclxuICAgICAgICBuKC4uLmFyZ3MpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbXBvc2VyLm4oLi4uYXJncyk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyBnZXROdW1iZXJGb3JtYXRcclxuICAgICAgICBnZXROdW1iZXJGb3JtYXQobG9jYWxlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjb21wb3Nlci5nZXROdW1iZXJGb3JtYXQobG9jYWxlKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIHNldE51bWJlckZvcm1hdFxyXG4gICAgICAgIHNldE51bWJlckZvcm1hdChsb2NhbGUsIGZvcm1hdCkge1xyXG4gICAgICAgICAgICBjb21wb3Nlci5zZXROdW1iZXJGb3JtYXQobG9jYWxlLCBmb3JtYXQpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8gbWVyZ2VOdW1iZXJGb3JtYXRcclxuICAgICAgICBtZXJnZU51bWJlckZvcm1hdChsb2NhbGUsIGZvcm1hdCkge1xyXG4gICAgICAgICAgICBjb21wb3Nlci5tZXJnZU51bWJlckZvcm1hdChsb2NhbGUsIGZvcm1hdCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyBnZXRDaG9pY2VJbmRleFxyXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW51c2VkLXZhcnNcclxuICAgICAgICBnZXRDaG9pY2VJbmRleChjaG9pY2UsIGNob2ljZXNMZW5ndGgpIHtcclxuICAgICAgICAgICAgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpICYmXHJcbiAgICAgICAgICAgICAgICB3YXJuKGdldFdhcm5NZXNzYWdlKDEwIC8qIE5PVF9TVVBQT1JURURfR0VUX0NIT0lDRV9JTkRFWCAqLykpO1xyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyBmb3IgaW50ZXJuYWxcclxuICAgICAgICBfX29uQ29tcG9uZW50SW5zdGFuY2VDcmVhdGVkKHRhcmdldCkge1xyXG4gICAgICAgICAgICBjb25zdCB7IGNvbXBvbmVudEluc3RhbmNlQ3JlYXRlZExpc3RlbmVyIH0gPSBvcHRpb25zO1xyXG4gICAgICAgICAgICBpZiAoY29tcG9uZW50SW5zdGFuY2VDcmVhdGVkTGlzdGVuZXIpIHtcclxuICAgICAgICAgICAgICAgIGNvbXBvbmVudEluc3RhbmNlQ3JlYXRlZExpc3RlbmVyKHRhcmdldCwgdnVlSTE4bik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgLy8gZm9yIHZ1ZS1kZXZ0b29scyB0aW1lbGluZSBldmVudFxyXG4gICAgaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSkge1xyXG4gICAgICAgIHZ1ZUkxOG4uX19lbmFibGVFbWl0dGVyID0gKGVtaXR0ZXIpID0+IHtcclxuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcclxuICAgICAgICAgICAgY29uc3QgX19jb21wb3NlciA9IGNvbXBvc2VyO1xyXG4gICAgICAgICAgICBfX2NvbXBvc2VyW0VuYWJsZUVtaXR0ZXJdICYmIF9fY29tcG9zZXJbRW5hYmxlRW1pdHRlcl0oZW1pdHRlcik7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB2dWVJMThuLl9fZGlzYWJsZUVtaXR0ZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XHJcbiAgICAgICAgICAgIGNvbnN0IF9fY29tcG9zZXIgPSBjb21wb3NlcjtcclxuICAgICAgICAgICAgX19jb21wb3NlcltEaXNhYmxlRW1pdHRlcl0gJiYgX19jb21wb3NlcltEaXNhYmxlRW1pdHRlcl0oKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHZ1ZUkxOG47XHJcbn1cblxuY29uc3QgYmFzZUZvcm1hdFByb3BzID0ge1xyXG4gICAgdGFnOiB7XHJcbiAgICAgICAgdHlwZTogW1N0cmluZywgT2JqZWN0XVxyXG4gICAgfSxcclxuICAgIGxvY2FsZToge1xyXG4gICAgICAgIHR5cGU6IFN0cmluZ1xyXG4gICAgfSxcclxuICAgIHNjb3BlOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICAgIHZhbGlkYXRvcjogKHZhbCkgPT4gdmFsID09PSAncGFyZW50JyB8fCB2YWwgPT09ICdnbG9iYWwnLFxyXG4gICAgICAgIGRlZmF1bHQ6ICdwYXJlbnQnXHJcbiAgICB9LFxyXG4gICAgaTE4bjoge1xyXG4gICAgICAgIHR5cGU6IE9iamVjdFxyXG4gICAgfVxyXG59O1xuXG4vKipcclxuICogVHJhbnNsYXRpb24gQ29tcG9uZW50XHJcbiAqXHJcbiAqIEByZW1hcmtzXHJcbiAqIFNlZSB0aGUgZm9sbG93aW5nIGl0ZW1zIGZvciBwcm9wZXJ0eSBhYm91dCBkZXRhaWxzXHJcbiAqXHJcbiAqIEBWdWVJMThuU2VlIFtUcmFuc2xhdGlvblByb3BzXShjb21wb25lbnQjdHJhbnNsYXRpb25wcm9wcylcclxuICogQFZ1ZUkxOG5TZWUgW0Jhc2VGb3JtYXRQcm9wc10oY29tcG9uZW50I2Jhc2Vmb3JtYXRwcm9wcylcclxuICogQFZ1ZUkxOG5TZWUgW0NvbXBvbmVudCBJbnRlcnBvbGF0aW9uXSguLi9ndWlkZS9hZHZhbmNlZC9jb21wb25lbnQpXHJcbiAqXHJcbiAqIEBleGFtcGxlXHJcbiAqIGBgYGh0bWxcclxuICogPGRpdiBpZD1cImFwcFwiPlxyXG4gKiAgIDwhLS0gLi4uIC0tPlxyXG4gKiAgIDxpMThuIHBhdGg9XCJ0ZXJtXCIgdGFnPVwibGFiZWxcIiBmb3I9XCJ0b3NcIj5cclxuICogICAgIDxhIDpocmVmPVwidXJsXCIgdGFyZ2V0PVwiX2JsYW5rXCI+e3sgJHQoJ3RvcycpIH19PC9hPlxyXG4gKiAgIDwvaTE4bj5cclxuICogICA8IS0tIC4uLiAtLT5cclxuICogPC9kaXY+XHJcbiAqIGBgYFxyXG4gKiBgYGBqc1xyXG4gKiBpbXBvcnQgeyBjcmVhdGVBcHAgfSBmcm9tICd2dWUnXHJcbiAqIGltcG9ydCB7IGNyZWF0ZUkxOG4gfSBmcm9tICd2dWUtaTE4bidcclxuICpcclxuICogY29uc3QgbWVzc2FnZXMgPSB7XHJcbiAqICAgZW46IHtcclxuICogICAgIHRvczogJ1Rlcm0gb2YgU2VydmljZScsXHJcbiAqICAgICB0ZXJtOiAnSSBhY2NlcHQgeHh4IHswfS4nXHJcbiAqICAgfSxcclxuICogICBqYToge1xyXG4gKiAgICAgdG9zOiAn5Yip55So6KaP57SEJyxcclxuICogICAgIHRlcm06ICfnp4Hjga8geHh4IOOBrnswfeOBq+WQjOaEj+OBl+OBvuOBmeOAgidcclxuICogICB9XHJcbiAqIH1cclxuICpcclxuICogY29uc3QgaTE4biA9IGNyZWF0ZUkxOG4oe1xyXG4gKiAgIGxvY2FsZTogJ2VuJyxcclxuICogICBtZXNzYWdlc1xyXG4gKiB9KVxyXG4gKlxyXG4gKiBjb25zdCBhcHAgPSBjcmVhdGVBcHAoe1xyXG4gKiAgIGRhdGE6IHtcclxuICogICAgIHVybDogJy90ZXJtJ1xyXG4gKiAgIH1cclxuICogfSkudXNlKGkxOG4pLm1vdW50KCcjYXBwJylcclxuICogYGBgXHJcbiAqXHJcbiAqIEBWdWVJMThuQ29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBUcmFuc2xhdGlvbiA9IHtcclxuICAgIC8qIGVzbGludC1kaXNhYmxlICovXHJcbiAgICBuYW1lOiAnaTE4bi10JyxcclxuICAgIHByb3BzOiBhc3NpZ24oe1xyXG4gICAgICAgIGtleXBhdGg6IHtcclxuICAgICAgICAgICAgdHlwZTogU3RyaW5nLFxyXG4gICAgICAgICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgcGx1cmFsOiB7XHJcbiAgICAgICAgICAgIHR5cGU6IFtOdW1iZXIsIFN0cmluZ10sXHJcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XHJcbiAgICAgICAgICAgIHZhbGlkYXRvcjogKHZhbCkgPT4gaXNOdW1iZXIodmFsKSB8fCAhaXNOYU4odmFsKVxyXG4gICAgICAgIH1cclxuICAgIH0sIGJhc2VGb3JtYXRQcm9wcyksXHJcbiAgICAvKiBlc2xpbnQtZW5hYmxlICovXHJcbiAgICBzZXR1cChwcm9wcywgY29udGV4dCkge1xyXG4gICAgICAgIGNvbnN0IHsgc2xvdHMsIGF0dHJzIH0gPSBjb250ZXh0O1xyXG4gICAgICAgIGNvbnN0IGkxOG4gPSBwcm9wcy5pMThuIHx8XHJcbiAgICAgICAgICAgIHVzZUkxOG4oe1xyXG4gICAgICAgICAgICAgICAgdXNlU2NvcGU6IHByb3BzLnNjb3BlLFxyXG4gICAgICAgICAgICAgICAgX191c2VDb21wb25lbnQ6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHNsb3RzKS5maWx0ZXIoa2V5ID0+IGtleSAhPT0gJ18nKTtcclxuICAgICAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBvcHRpb25zID0ge307XHJcbiAgICAgICAgICAgIGlmIChwcm9wcy5sb2NhbGUpIHtcclxuICAgICAgICAgICAgICAgIG9wdGlvbnMubG9jYWxlID0gcHJvcHMubG9jYWxlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwcm9wcy5wbHVyYWwgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5wbHVyYWwgPSBpc1N0cmluZyhwcm9wcy5wbHVyYWwpID8gK3Byb3BzLnBsdXJhbCA6IHByb3BzLnBsdXJhbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBhcmcgPSBnZXRJbnRlcnBvbGF0ZUFyZyhjb250ZXh0LCBrZXlzKTtcclxuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcclxuICAgICAgICAgICAgY29uc3QgY2hpbGRyZW4gPSBpMThuW1RyYW5zcmF0ZVZOb2RlU3ltYm9sXShwcm9wcy5rZXlwYXRoLCBhcmcsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICBjb25zdCBhc3NpZ25lZEF0dHJzID0gYXNzaWduKHt9LCBhdHRycyk7XHJcbiAgICAgICAgICAgIC8vIHByZXR0aWVyLWlnbm9yZVxyXG4gICAgICAgICAgICByZXR1cm4gaXNTdHJpbmcocHJvcHMudGFnKVxyXG4gICAgICAgICAgICAgICAgPyBoKHByb3BzLnRhZywgYXNzaWduZWRBdHRycywgY2hpbGRyZW4pXHJcbiAgICAgICAgICAgICAgICA6IGlzT2JqZWN0KHByb3BzLnRhZylcclxuICAgICAgICAgICAgICAgICAgICA/IGgocHJvcHMudGFnLCBhc3NpZ25lZEF0dHJzLCBjaGlsZHJlbilcclxuICAgICAgICAgICAgICAgICAgICA6IGgoRnJhZ21lbnQsIGFzc2lnbmVkQXR0cnMsIGNoaWxkcmVuKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59O1xyXG5mdW5jdGlvbiBnZXRJbnRlcnBvbGF0ZUFyZyh7IHNsb3RzIH0sIGtleXMpIHtcclxuICAgIGlmIChrZXlzLmxlbmd0aCA9PT0gMSAmJiBrZXlzWzBdID09PSAnZGVmYXVsdCcpIHtcclxuICAgICAgICAvLyBkZWZhdWx0IHNsb3Qgb25seVxyXG4gICAgICAgIHJldHVybiBzbG90cy5kZWZhdWx0ID8gc2xvdHMuZGVmYXVsdCgpIDogW107XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICAvLyBuYW1lZCBzbG90c1xyXG4gICAgICAgIHJldHVybiBrZXlzLnJlZHVjZSgoYXJnLCBrZXkpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgc2xvdCA9IHNsb3RzW2tleV07XHJcbiAgICAgICAgICAgIGlmIChzbG90KSB7XHJcbiAgICAgICAgICAgICAgICBhcmdba2V5XSA9IHNsb3QoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYXJnO1xyXG4gICAgICAgIH0sIHt9KTtcclxuICAgIH1cclxufVxuXG5mdW5jdGlvbiByZW5kZXJGb3JtYXR0ZXIocHJvcHMsIGNvbnRleHQsIHNsb3RLZXlzLCBwYXJ0Rm9ybWF0dGVyKSB7XHJcbiAgICBjb25zdCB7IHNsb3RzLCBhdHRycyB9ID0gY29udGV4dDtcclxuICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHsgcGFydDogdHJ1ZSB9O1xyXG4gICAgICAgIGxldCBvdmVycmlkZXMgPSB7fTtcclxuICAgICAgICBpZiAocHJvcHMubG9jYWxlKSB7XHJcbiAgICAgICAgICAgIG9wdGlvbnMubG9jYWxlID0gcHJvcHMubG9jYWxlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaXNTdHJpbmcocHJvcHMuZm9ybWF0KSkge1xyXG4gICAgICAgICAgICBvcHRpb25zLmtleSA9IHByb3BzLmZvcm1hdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoaXNPYmplY3QocHJvcHMuZm9ybWF0KSkge1xyXG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxyXG4gICAgICAgICAgICBpZiAoaXNTdHJpbmcocHJvcHMuZm9ybWF0LmtleSkpIHtcclxuICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XHJcbiAgICAgICAgICAgICAgICBvcHRpb25zLmtleSA9IHByb3BzLmZvcm1hdC5rZXk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gRmlsdGVyIG91dCBudW1iZXIgZm9ybWF0IG9wdGlvbnMgb25seVxyXG4gICAgICAgICAgICBvdmVycmlkZXMgPSBPYmplY3Qua2V5cyhwcm9wcy5mb3JtYXQpLnJlZHVjZSgob3B0aW9ucywgcHJvcCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNsb3RLZXlzLmluY2x1ZGVzKHByb3ApXHJcbiAgICAgICAgICAgICAgICAgICAgPyBhc3NpZ24oe30sIG9wdGlvbnMsIHsgW3Byb3BdOiBwcm9wcy5mb3JtYXRbcHJvcF0gfSkgLy8gZXNsaW50LWRpc2FibGUtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XHJcbiAgICAgICAgICAgICAgICAgICAgOiBvcHRpb25zO1xyXG4gICAgICAgICAgICB9LCB7fSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHBhcnRzID0gcGFydEZvcm1hdHRlciguLi5bcHJvcHMudmFsdWUsIG9wdGlvbnMsIG92ZXJyaWRlc10pO1xyXG4gICAgICAgIGxldCBjaGlsZHJlbiA9IFtvcHRpb25zLmtleV07XHJcbiAgICAgICAgaWYgKGlzQXJyYXkocGFydHMpKSB7XHJcbiAgICAgICAgICAgIGNoaWxkcmVuID0gcGFydHMubWFwKChwYXJ0LCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2xvdCA9IHNsb3RzW3BhcnQudHlwZV07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc2xvdFxyXG4gICAgICAgICAgICAgICAgICAgID8gc2xvdCh7IFtwYXJ0LnR5cGVdOiBwYXJ0LnZhbHVlLCBpbmRleCwgcGFydHMgfSlcclxuICAgICAgICAgICAgICAgICAgICA6IFtwYXJ0LnZhbHVlXTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGlzU3RyaW5nKHBhcnRzKSkge1xyXG4gICAgICAgICAgICBjaGlsZHJlbiA9IFtwYXJ0c107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGFzc2lnbmVkQXR0cnMgPSBhc3NpZ24oe30sIGF0dHJzKTtcclxuICAgICAgICAvLyBwcmV0dGllci1pZ25vcmVcclxuICAgICAgICByZXR1cm4gaXNTdHJpbmcocHJvcHMudGFnKVxyXG4gICAgICAgICAgICA/IGgocHJvcHMudGFnLCBhc3NpZ25lZEF0dHJzLCBjaGlsZHJlbilcclxuICAgICAgICAgICAgOiBpc09iamVjdChwcm9wcy50YWcpXHJcbiAgICAgICAgICAgICAgICA/IGgocHJvcHMudGFnLCBhc3NpZ25lZEF0dHJzLCBjaGlsZHJlbilcclxuICAgICAgICAgICAgICAgIDogaChGcmFnbWVudCwgYXNzaWduZWRBdHRycywgY2hpbGRyZW4pO1xyXG4gICAgfTtcclxufVxuXG5jb25zdCBOVU1CRVJfRk9STUFUX0tFWVMgPSBbXHJcbiAgICAnbG9jYWxlTWF0Y2hlcicsXHJcbiAgICAnc3R5bGUnLFxyXG4gICAgJ3VuaXQnLFxyXG4gICAgJ3VuaXREaXNwbGF5JyxcclxuICAgICdjdXJyZW5jeScsXHJcbiAgICAnY3VycmVuY3lEaXNwbGF5JyxcclxuICAgICd1c2VHcm91cGluZycsXHJcbiAgICAnbnVtYmVyaW5nU3lzdGVtJyxcclxuICAgICdtaW5pbXVtSW50ZWdlckRpZ2l0cycsXHJcbiAgICAnbWluaW11bUZyYWN0aW9uRGlnaXRzJyxcclxuICAgICdtYXhpbXVtRnJhY3Rpb25EaWdpdHMnLFxyXG4gICAgJ21pbmltdW1TaWduaWZpY2FudERpZ2l0cycsXHJcbiAgICAnbWF4aW11bVNpZ25pZmljYW50RGlnaXRzJyxcclxuICAgICdub3RhdGlvbicsXHJcbiAgICAnZm9ybWF0TWF0Y2hlcidcclxuXTtcclxuLyoqXHJcbiAqIE51bWJlciBGb3JtYXQgQ29tcG9uZW50XHJcbiAqXHJcbiAqIEByZW1hcmtzXHJcbiAqIFNlZSB0aGUgZm9sbG93aW5nIGl0ZW1zIGZvciBwcm9wZXJ0eSBhYm91dCBkZXRhaWxzXHJcbiAqXHJcbiAqIEBWdWVJMThuU2VlIFtGb3JtYXR0YWJsZVByb3BzXShjb21wb25lbnQjZm9ybWF0dGFibGVwcm9wcylcclxuICogQFZ1ZUkxOG5TZWUgW0Jhc2VGb3JtYXRQcm9wc10oY29tcG9uZW50I2Jhc2Vmb3JtYXRwcm9wcylcclxuICogQFZ1ZUkxOG5TZWUgW0N1c3RvbSBGb3JtYXR0aW5nXSguLi9ndWlkZS9lc3NlbnRpYWxzL251bWJlciNjdXN0b20tZm9ybWF0dGluZylcclxuICpcclxuICogQFZ1ZUkxOG5EYW5nZXJcclxuICogTm90IHN1cHBvcnRlZCBJRSwgZHVlIHRvIG5vIHN1cHBvcnQgYEludGwuTnVtYmVyRm9ybWF0I2Zvcm1hdFRvUGFydHNgIGluIFtJRV0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvSW50bC9OdW1iZXJGb3JtYXQvZm9ybWF0VG9QYXJ0cylcclxuICpcclxuICogSWYgeW91IHdhbnQgdG8gdXNlIGl0LCB5b3UgbmVlZCB0byB1c2UgW3BvbHlmaWxsXShodHRwczovL2dpdGh1Yi5jb20vZm9ybWF0anMvZm9ybWF0anMvdHJlZS9tYWluL3BhY2thZ2VzL2ludGwtbnVtYmVyZm9ybWF0KVxyXG4gKlxyXG4gKiBAVnVlSTE4bkNvbXBvbmVudFxyXG4gKi9cclxuY29uc3QgTnVtYmVyRm9ybWF0ID0ge1xyXG4gICAgLyogZXNsaW50LWRpc2FibGUgKi9cclxuICAgIG5hbWU6ICdpMThuLW4nLFxyXG4gICAgcHJvcHM6IGFzc2lnbih7XHJcbiAgICAgICAgdmFsdWU6IHtcclxuICAgICAgICAgICAgdHlwZTogTnVtYmVyLFxyXG4gICAgICAgICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZm9ybWF0OiB7XHJcbiAgICAgICAgICAgIHR5cGU6IFtTdHJpbmcsIE9iamVjdF1cclxuICAgICAgICB9XHJcbiAgICB9LCBiYXNlRm9ybWF0UHJvcHMpLFxyXG4gICAgLyogZXNsaW50LWVuYWJsZSAqL1xyXG4gICAgc2V0dXAocHJvcHMsIGNvbnRleHQpIHtcclxuICAgICAgICBjb25zdCBpMThuID0gcHJvcHMuaTE4biB8fFxyXG4gICAgICAgICAgICB1c2VJMThuKHsgdXNlU2NvcGU6ICdwYXJlbnQnLCBfX3VzZUNvbXBvbmVudDogdHJ1ZSB9KTtcclxuICAgICAgICByZXR1cm4gcmVuZGVyRm9ybWF0dGVyKHByb3BzLCBjb250ZXh0LCBOVU1CRVJfRk9STUFUX0tFWVMsICguLi5hcmdzKSA9PiBcclxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxyXG4gICAgICAgIGkxOG5bTnVtYmVyUGFydHNTeW1ib2xdKC4uLmFyZ3MpKTtcclxuICAgIH1cclxufTtcblxuY29uc3QgREFURVRJTUVfRk9STUFUX0tFWVMgPSBbXHJcbiAgICAnZGF0ZVN0eWxlJyxcclxuICAgICd0aW1lU3R5bGUnLFxyXG4gICAgJ2ZyYWN0aW9uYWxTZWNvbmREaWdpdHMnLFxyXG4gICAgJ2NhbGVuZGFyJyxcclxuICAgICdkYXlQZXJpb2QnLFxyXG4gICAgJ251bWJlcmluZ1N5c3RlbScsXHJcbiAgICAnbG9jYWxlTWF0Y2hlcicsXHJcbiAgICAndGltZVpvbmUnLFxyXG4gICAgJ2hvdXIxMicsXHJcbiAgICAnaG91ckN5Y2xlJyxcclxuICAgICdmb3JtYXRNYXRjaGVyJyxcclxuICAgICd3ZWVrZGF5JyxcclxuICAgICdlcmEnLFxyXG4gICAgJ3llYXInLFxyXG4gICAgJ21vbnRoJyxcclxuICAgICdkYXknLFxyXG4gICAgJ2hvdXInLFxyXG4gICAgJ21pbnV0ZScsXHJcbiAgICAnc2Vjb25kJyxcclxuICAgICd0aW1lWm9uZU5hbWUnXHJcbl07XHJcbi8qKlxyXG4gKiBEYXRldGltZSBGb3JtYXQgQ29tcG9uZW50XHJcbiAqXHJcbiAqIEByZW1hcmtzXHJcbiAqIFNlZSB0aGUgZm9sbG93aW5nIGl0ZW1zIGZvciBwcm9wZXJ0eSBhYm91dCBkZXRhaWxzXHJcbiAqXHJcbiAqIEBWdWVJMThuU2VlIFtGb3JtYXR0YWJsZVByb3BzXShjb21wb25lbnQjZm9ybWF0dGFibGVwcm9wcylcclxuICogQFZ1ZUkxOG5TZWUgW0Jhc2VGb3JtYXRQcm9wc10oY29tcG9uZW50I2Jhc2Vmb3JtYXRwcm9wcylcclxuICogQFZ1ZUkxOG5TZWUgW0N1c3RvbSBGb3JtYXR0aW5nXSguLi9ndWlkZS9lc3NlbnRpYWxzL2RhdGV0aW1lI2N1c3RvbS1mb3JtYXR0aW5nKVxyXG4gKlxyXG4gKiBAVnVlSTE4bkRhbmdlclxyXG4gKiBOb3Qgc3VwcG9ydGVkIElFLCBkdWUgdG8gbm8gc3VwcG9ydCBgSW50bC5EYXRlVGltZUZvcm1hdCNmb3JtYXRUb1BhcnRzYCBpbiBbSUVdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0ludGwvRGF0ZVRpbWVGb3JtYXQvZm9ybWF0VG9QYXJ0cylcclxuICpcclxuICogSWYgeW91IHdhbnQgdG8gdXNlIGl0LCB5b3UgbmVlZCB0byB1c2UgW3BvbHlmaWxsXShodHRwczovL2dpdGh1Yi5jb20vZm9ybWF0anMvZm9ybWF0anMvdHJlZS9tYWluL3BhY2thZ2VzL2ludGwtZGF0ZXRpbWVmb3JtYXQpXHJcbiAqXHJcbiAqIEBWdWVJMThuQ29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBEYXRldGltZUZvcm1hdCA9IHtcclxuICAgIC8qIGVzbGludC1kaXNhYmxlICovXHJcbiAgICBuYW1lOiAnaTE4bi1kJyxcclxuICAgIHByb3BzOiBhc3NpZ24oe1xyXG4gICAgICAgIHZhbHVlOiB7XHJcbiAgICAgICAgICAgIHR5cGU6IFtOdW1iZXIsIERhdGVdLFxyXG4gICAgICAgICAgICByZXF1aXJlZDogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZm9ybWF0OiB7XHJcbiAgICAgICAgICAgIHR5cGU6IFtTdHJpbmcsIE9iamVjdF1cclxuICAgICAgICB9XHJcbiAgICB9LCBiYXNlRm9ybWF0UHJvcHMpLFxyXG4gICAgLyogZXNsaW50LWVuYWJsZSAqL1xyXG4gICAgc2V0dXAocHJvcHMsIGNvbnRleHQpIHtcclxuICAgICAgICBjb25zdCBpMThuID0gcHJvcHMuaTE4biB8fFxyXG4gICAgICAgICAgICB1c2VJMThuKHsgdXNlU2NvcGU6ICdwYXJlbnQnLCBfX3VzZUNvbXBvbmVudDogdHJ1ZSB9KTtcclxuICAgICAgICByZXR1cm4gcmVuZGVyRm9ybWF0dGVyKHByb3BzLCBjb250ZXh0LCBEQVRFVElNRV9GT1JNQVRfS0VZUywgKC4uLmFyZ3MpID0+IFxyXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XHJcbiAgICAgICAgaTE4bltEYXRldGltZVBhcnRzU3ltYm9sXSguLi5hcmdzKSk7XHJcbiAgICB9XHJcbn07XG5cbmZ1bmN0aW9uIGdldENvbXBvc2VyJDIoaTE4biwgaW5zdGFuY2UpIHtcclxuICAgIGNvbnN0IGkxOG5JbnRlcm5hbCA9IGkxOG47XHJcbiAgICBpZiAoaTE4bi5tb2RlID09PSAnY29tcG9zaXRpb24nKSB7XHJcbiAgICAgICAgcmV0dXJuIChpMThuSW50ZXJuYWwuX19nZXRJbnN0YW5jZShpbnN0YW5jZSkgfHwgaTE4bi5nbG9iYWwpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgY29uc3QgdnVlSTE4biA9IGkxOG5JbnRlcm5hbC5fX2dldEluc3RhbmNlKGluc3RhbmNlKTtcclxuICAgICAgICByZXR1cm4gdnVlSTE4biAhPSBudWxsXHJcbiAgICAgICAgICAgID8gdnVlSTE4bi5fX2NvbXBvc2VyXHJcbiAgICAgICAgICAgIDogaTE4bi5nbG9iYWwuX19jb21wb3NlcjtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiB2VERpcmVjdGl2ZShpMThuKSB7XHJcbiAgICBjb25zdCBiaW5kID0gKGVsLCB7IGluc3RhbmNlLCB2YWx1ZSwgbW9kaWZpZXJzIH0pID0+IHtcclxuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cclxuICAgICAgICBpZiAoIWluc3RhbmNlIHx8ICFpbnN0YW5jZS4kKSB7XHJcbiAgICAgICAgICAgIHRocm93IGNyZWF0ZUkxOG5FcnJvcigyMiAvKiBVTkVYUEVDVEVEX0VSUk9SICovKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgY29tcG9zZXIgPSBnZXRDb21wb3NlciQyKGkxOG4sIGluc3RhbmNlLiQpO1xyXG4gICAgICAgIGlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgJiYgbW9kaWZpZXJzLnByZXNlcnZlKSB7XHJcbiAgICAgICAgICAgIHdhcm4oZ2V0V2Fybk1lc3NhZ2UoNyAvKiBOT1RfU1VQUE9SVEVEX1BSRVNFUlZFICovKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHBhcnNlZFZhbHVlID0gcGFyc2VWYWx1ZSh2YWx1ZSk7XHJcbiAgICAgICAgZWwudGV4dENvbnRlbnQgPSBjb21wb3Nlci50KC4uLm1ha2VQYXJhbXMocGFyc2VkVmFsdWUpKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGJlZm9yZU1vdW50OiBiaW5kLFxyXG4gICAgICAgIGJlZm9yZVVwZGF0ZTogYmluZFxyXG4gICAgfTtcclxufVxyXG5mdW5jdGlvbiBwYXJzZVZhbHVlKHZhbHVlKSB7XHJcbiAgICBpZiAoaXNTdHJpbmcodmFsdWUpKSB7XHJcbiAgICAgICAgcmV0dXJuIHsgcGF0aDogdmFsdWUgfTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGlzUGxhaW5PYmplY3QodmFsdWUpKSB7XHJcbiAgICAgICAgaWYgKCEoJ3BhdGgnIGluIHZhbHVlKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBjcmVhdGVJMThuRXJyb3IoMTkgLyogUkVRVUlSRURfVkFMVUUgKi8sICdwYXRoJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHRocm93IGNyZWF0ZUkxOG5FcnJvcigyMCAvKiBJTlZBTElEX1ZBTFVFICovKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBtYWtlUGFyYW1zKHZhbHVlKSB7XHJcbiAgICBjb25zdCB7IHBhdGgsIGxvY2FsZSwgYXJncywgY2hvaWNlLCBwbHVyYWwgfSA9IHZhbHVlO1xyXG4gICAgY29uc3Qgb3B0aW9ucyA9IHt9O1xyXG4gICAgY29uc3QgbmFtZWQgPSBhcmdzIHx8IHt9O1xyXG4gICAgaWYgKGlzU3RyaW5nKGxvY2FsZSkpIHtcclxuICAgICAgICBvcHRpb25zLmxvY2FsZSA9IGxvY2FsZTtcclxuICAgIH1cclxuICAgIGlmIChpc051bWJlcihjaG9pY2UpKSB7XHJcbiAgICAgICAgb3B0aW9ucy5wbHVyYWwgPSBjaG9pY2U7XHJcbiAgICB9XHJcbiAgICBpZiAoaXNOdW1iZXIocGx1cmFsKSkge1xyXG4gICAgICAgIG9wdGlvbnMucGx1cmFsID0gcGx1cmFsO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIFtwYXRoLCBuYW1lZCwgb3B0aW9uc107XHJcbn1cblxuZnVuY3Rpb24gYXBwbHkoYXBwLCBpMThuLCAuLi5vcHRpb25zKSB7XHJcbiAgICBjb25zdCBwbHVnaW5PcHRpb25zID0gaXNQbGFpbk9iamVjdChvcHRpb25zWzBdKVxyXG4gICAgICAgID8gb3B0aW9uc1swXVxyXG4gICAgICAgIDoge307XHJcbiAgICBjb25zdCB1c2VJMThuQ29tcG9uZW50TmFtZSA9ICEhcGx1Z2luT3B0aW9ucy51c2VJMThuQ29tcG9uZW50TmFtZTtcclxuICAgIGNvbnN0IGdsb2JhbEluc3RhbGwgPSBpc0Jvb2xlYW4ocGx1Z2luT3B0aW9ucy5nbG9iYWxJbnN0YWxsKVxyXG4gICAgICAgID8gcGx1Z2luT3B0aW9ucy5nbG9iYWxJbnN0YWxsXHJcbiAgICAgICAgOiB0cnVlO1xyXG4gICAgaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSAmJiBnbG9iYWxJbnN0YWxsICYmIHVzZUkxOG5Db21wb25lbnROYW1lKSB7XHJcbiAgICAgICAgd2FybihnZXRXYXJuTWVzc2FnZSgxMSAvKiBDT01QT05FTlRfTkFNRV9MRUdBQ1lfQ09NUEFUSUJMRSAqLywge1xyXG4gICAgICAgICAgICBuYW1lOiBUcmFuc2xhdGlvbi5uYW1lXHJcbiAgICAgICAgfSkpO1xyXG4gICAgfVxyXG4gICAgaWYgKGdsb2JhbEluc3RhbGwpIHtcclxuICAgICAgICAvLyBpbnN0YWxsIGNvbXBvbmVudHNcclxuICAgICAgICBhcHAuY29tcG9uZW50KCF1c2VJMThuQ29tcG9uZW50TmFtZSA/IFRyYW5zbGF0aW9uLm5hbWUgOiAnaTE4bicsIFRyYW5zbGF0aW9uKTtcclxuICAgICAgICBhcHAuY29tcG9uZW50KE51bWJlckZvcm1hdC5uYW1lLCBOdW1iZXJGb3JtYXQpO1xyXG4gICAgICAgIGFwcC5jb21wb25lbnQoRGF0ZXRpbWVGb3JtYXQubmFtZSwgRGF0ZXRpbWVGb3JtYXQpO1xyXG4gICAgfVxyXG4gICAgLy8gaW5zdGFsbCBkaXJlY3RpdmVcclxuICAgIGFwcC5kaXJlY3RpdmUoJ3QnLCB2VERpcmVjdGl2ZShpMThuKSk7XHJcbn1cblxuY29uc3QgVlVFX0kxOE5fQ09NUE9ORU5UX1RZUEVTID0gJ3Z1ZS1pMThuOiBjb21wb3NlciBwcm9wZXJ0aWVzJztcclxubGV0IGRldnRvb2xzQXBpO1xyXG5hc3luYyBmdW5jdGlvbiBlbmFibGVEZXZUb29scyhhcHAsIGkxOG4pIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgc2V0dXBEZXZ0b29sc1BsdWdpbih7XHJcbiAgICAgICAgICAgICAgICBpZDogXCJ2dWUtZGV2dG9vbHMtcGx1Z2luLXZ1ZS1pMThuXCIgLyogUExVR0lOICovLFxyXG4gICAgICAgICAgICAgICAgbGFiZWw6IFZ1ZURldlRvb2xzTGFiZWxzW1widnVlLWRldnRvb2xzLXBsdWdpbi12dWUtaTE4blwiIC8qIFBMVUdJTiAqL10sXHJcbiAgICAgICAgICAgICAgICBwYWNrYWdlTmFtZTogJ3Z1ZS1pMThuJyxcclxuICAgICAgICAgICAgICAgIGhvbWVwYWdlOiAnaHR0cHM6Ly92dWUtaTE4bi5pbnRsaWZ5LmRldicsXHJcbiAgICAgICAgICAgICAgICBsb2dvOiAnaHR0cHM6Ly92dWUtaTE4bi5pbnRsaWZ5LmRldi92dWUtaTE4bi1kZXZ0b29scy1sb2dvLnBuZycsXHJcbiAgICAgICAgICAgICAgICBjb21wb25lbnRTdGF0ZVR5cGVzOiBbVlVFX0kxOE5fQ09NUE9ORU5UX1RZUEVTXSxcclxuICAgICAgICAgICAgICAgIGFwcFxyXG4gICAgICAgICAgICB9LCBhcGkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZGV2dG9vbHNBcGkgPSBhcGk7XHJcbiAgICAgICAgICAgICAgICBhcGkub24udmlzaXRDb21wb25lbnRUcmVlKCh7IGNvbXBvbmVudEluc3RhbmNlLCB0cmVlTm9kZSB9KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlQ29tcG9uZW50VHJlZVRhZ3MoY29tcG9uZW50SW5zdGFuY2UsIHRyZWVOb2RlLCBpMThuKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgYXBpLm9uLmluc3BlY3RDb21wb25lbnQoKHsgY29tcG9uZW50SW5zdGFuY2UsIGluc3RhbmNlRGF0YSB9KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvbXBvbmVudEluc3RhbmNlLnZub2RlLmVsLl9fVlVFX0kxOE5fXyAmJiBpbnN0YW5jZURhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkxOG4ubW9kZSA9PT0gJ2xlZ2FjeScpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlnbm9yZSBnbG9iYWwgc2NvcGUgb24gbGVnYWN5IG1vZGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnRJbnN0YW5jZS52bm9kZS5lbC5fX1ZVRV9JMThOX18gIT09XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaTE4bi5nbG9iYWwuX19jb21wb3Nlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluc3BlY3RDb21wb3NlcihpbnN0YW5jZURhdGEsIGNvbXBvbmVudEluc3RhbmNlLnZub2RlLmVsLl9fVlVFX0kxOE5fXyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnNwZWN0Q29tcG9zZXIoaW5zdGFuY2VEYXRhLCBjb21wb25lbnRJbnN0YW5jZS52bm9kZS5lbC5fX1ZVRV9JMThOX18pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBhcGkuYWRkSW5zcGVjdG9yKHtcclxuICAgICAgICAgICAgICAgICAgICBpZDogXCJ2dWUtaTE4bi1yZXNvdXJjZS1pbnNwZWN0b3JcIiAvKiBDVVNUT01fSU5TUEVDVE9SICovLFxyXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBWdWVEZXZUb29sc0xhYmVsc1tcInZ1ZS1pMThuLXJlc291cmNlLWluc3BlY3RvclwiIC8qIENVU1RPTV9JTlNQRUNUT1IgKi9dLFxyXG4gICAgICAgICAgICAgICAgICAgIGljb246ICdsYW5ndWFnZScsXHJcbiAgICAgICAgICAgICAgICAgICAgdHJlZUZpbHRlclBsYWNlaG9sZGVyOiBWdWVEZXZUb29sc1BsYWNlaG9sZGVyc1tcInZ1ZS1pMThuLXJlc291cmNlLWluc3BlY3RvclwiIC8qIENVU1RPTV9JTlNQRUNUT1IgKi9dXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGFwaS5vbi5nZXRJbnNwZWN0b3JUcmVlKHBheWxvYWQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXlsb2FkLmFwcCA9PT0gYXBwICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBheWxvYWQuaW5zcGVjdG9ySWQgPT09IFwidnVlLWkxOG4tcmVzb3VyY2UtaW5zcGVjdG9yXCIgLyogQ1VTVE9NX0lOU1BFQ1RPUiAqLykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWdpc3RlclNjb3BlKHBheWxvYWQsIGkxOG4pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgYXBpLm9uLmdldEluc3BlY3RvclN0YXRlKHBheWxvYWQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXlsb2FkLmFwcCA9PT0gYXBwICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBheWxvYWQuaW5zcGVjdG9ySWQgPT09IFwidnVlLWkxOG4tcmVzb3VyY2UtaW5zcGVjdG9yXCIgLyogQ1VTVE9NX0lOU1BFQ1RPUiAqLykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnNwZWN0U2NvcGUocGF5bG9hZCwgaTE4bik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBhcGkub24uZWRpdEluc3BlY3RvclN0YXRlKHBheWxvYWQgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXlsb2FkLmFwcCA9PT0gYXBwICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBheWxvYWQuaW5zcGVjdG9ySWQgPT09IFwidnVlLWkxOG4tcmVzb3VyY2UtaW5zcGVjdG9yXCIgLyogQ1VTVE9NX0lOU1BFQ1RPUiAqLykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlZGl0U2NvcGUocGF5bG9hZCwgaTE4bik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBhcGkuYWRkVGltZWxpbmVMYXllcih7XHJcbiAgICAgICAgICAgICAgICAgICAgaWQ6IFwidnVlLWkxOG4tdGltZWxpbmVcIiAvKiBUSU1FTElORSAqLyxcclxuICAgICAgICAgICAgICAgICAgICBsYWJlbDogVnVlRGV2VG9vbHNMYWJlbHNbXCJ2dWUtaTE4bi10aW1lbGluZVwiIC8qIFRJTUVMSU5FICovXSxcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogVnVlRGV2VG9vbHNUaW1lbGluZUNvbG9yc1tcInZ1ZS1pMThuLXRpbWVsaW5lXCIgLyogVElNRUxJTkUgKi9dXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xyXG4gICAgICAgICAgICByZWplY3QoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcbmZ1bmN0aW9uIHVwZGF0ZUNvbXBvbmVudFRyZWVUYWdzKGluc3RhbmNlLCAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcclxudHJlZU5vZGUsIGkxOG4pIHtcclxuICAgIC8vIHByZXR0aWVyLWlnbm9yZVxyXG4gICAgY29uc3QgZ2xvYmFsID0gaTE4bi5tb2RlID09PSAnY29tcG9zaXRpb24nXHJcbiAgICAgICAgPyBpMThuLmdsb2JhbFxyXG4gICAgICAgIDogaTE4bi5nbG9iYWwuX19jb21wb3NlcjtcclxuICAgIGlmIChpbnN0YW5jZSAmJiBpbnN0YW5jZS52bm9kZS5lbC5fX1ZVRV9JMThOX18pIHtcclxuICAgICAgICAvLyBhZGQgY3VzdG9tIHRhZ3MgbG9jYWwgc2NvcGUgb25seVxyXG4gICAgICAgIGlmIChpbnN0YW5jZS52bm9kZS5lbC5fX1ZVRV9JMThOX18gIT09IGdsb2JhbCkge1xyXG4gICAgICAgICAgICBjb25zdCBsYWJlbCA9IGluc3RhbmNlLnR5cGUubmFtZSB8fCBpbnN0YW5jZS50eXBlLmRpc3BsYXlOYW1lIHx8IGluc3RhbmNlLnR5cGUuX19maWxlO1xyXG4gICAgICAgICAgICBjb25zdCB0YWcgPSB7XHJcbiAgICAgICAgICAgICAgICBsYWJlbDogYGkxOG4gKCR7bGFiZWx9IFNjb3BlKWAsXHJcbiAgICAgICAgICAgICAgICB0ZXh0Q29sb3I6IDB4MDAwMDAwLFxyXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAweGZmY2QxOVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0cmVlTm9kZS50YWdzLnB1c2godGFnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gaW5zcGVjdENvbXBvc2VyKGluc3RhbmNlRGF0YSwgY29tcG9zZXIpIHtcclxuICAgIGNvbnN0IHR5cGUgPSBWVUVfSTE4Tl9DT01QT05FTlRfVFlQRVM7XHJcbiAgICBpbnN0YW5jZURhdGEuc3RhdGUucHVzaCh7XHJcbiAgICAgICAgdHlwZSxcclxuICAgICAgICBrZXk6ICdsb2NhbGUnLFxyXG4gICAgICAgIGVkaXRhYmxlOiB0cnVlLFxyXG4gICAgICAgIHZhbHVlOiBjb21wb3Nlci5sb2NhbGUudmFsdWVcclxuICAgIH0pO1xyXG4gICAgaW5zdGFuY2VEYXRhLnN0YXRlLnB1c2goe1xyXG4gICAgICAgIHR5cGUsXHJcbiAgICAgICAga2V5OiAnYXZhaWxhYmxlTG9jYWxlcycsXHJcbiAgICAgICAgZWRpdGFibGU6IGZhbHNlLFxyXG4gICAgICAgIHZhbHVlOiBjb21wb3Nlci5hdmFpbGFibGVMb2NhbGVzXHJcbiAgICB9KTtcclxuICAgIGluc3RhbmNlRGF0YS5zdGF0ZS5wdXNoKHtcclxuICAgICAgICB0eXBlLFxyXG4gICAgICAgIGtleTogJ2ZhbGxiYWNrTG9jYWxlJyxcclxuICAgICAgICBlZGl0YWJsZTogdHJ1ZSxcclxuICAgICAgICB2YWx1ZTogY29tcG9zZXIuZmFsbGJhY2tMb2NhbGUudmFsdWVcclxuICAgIH0pO1xyXG4gICAgaW5zdGFuY2VEYXRhLnN0YXRlLnB1c2goe1xyXG4gICAgICAgIHR5cGUsXHJcbiAgICAgICAga2V5OiAnaW5oZXJpdExvY2FsZScsXHJcbiAgICAgICAgZWRpdGFibGU6IHRydWUsXHJcbiAgICAgICAgdmFsdWU6IGNvbXBvc2VyLmluaGVyaXRMb2NhbGVcclxuICAgIH0pO1xyXG4gICAgaW5zdGFuY2VEYXRhLnN0YXRlLnB1c2goe1xyXG4gICAgICAgIHR5cGUsXHJcbiAgICAgICAga2V5OiAnbWVzc2FnZXMnLFxyXG4gICAgICAgIGVkaXRhYmxlOiBmYWxzZSxcclxuICAgICAgICB2YWx1ZTogZ2V0TG9jYWxlTWVzc2FnZVZhbHVlKGNvbXBvc2VyLm1lc3NhZ2VzLnZhbHVlKVxyXG4gICAgfSk7XHJcbiAgICBpbnN0YW5jZURhdGEuc3RhdGUucHVzaCh7XHJcbiAgICAgICAgdHlwZSxcclxuICAgICAgICBrZXk6ICdkYXRldGltZUZvcm1hdHMnLFxyXG4gICAgICAgIGVkaXRhYmxlOiBmYWxzZSxcclxuICAgICAgICB2YWx1ZTogY29tcG9zZXIuZGF0ZXRpbWVGb3JtYXRzLnZhbHVlXHJcbiAgICB9KTtcclxuICAgIGluc3RhbmNlRGF0YS5zdGF0ZS5wdXNoKHtcclxuICAgICAgICB0eXBlLFxyXG4gICAgICAgIGtleTogJ251bWJlckZvcm1hdHMnLFxyXG4gICAgICAgIGVkaXRhYmxlOiBmYWxzZSxcclxuICAgICAgICB2YWx1ZTogY29tcG9zZXIubnVtYmVyRm9ybWF0cy52YWx1ZVxyXG4gICAgfSk7XHJcbn1cclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcclxuZnVuY3Rpb24gZ2V0TG9jYWxlTWVzc2FnZVZhbHVlKG1lc3NhZ2VzKSB7XHJcbiAgICBjb25zdCB2YWx1ZSA9IHt9O1xyXG4gICAgT2JqZWN0LmtleXMobWVzc2FnZXMpLmZvckVhY2goKGtleSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHYgPSBtZXNzYWdlc1trZXldO1xyXG4gICAgICAgIGlmIChpc0Z1bmN0aW9uKHYpICYmICdzb3VyY2UnIGluIHYpIHtcclxuICAgICAgICAgICAgdmFsdWVba2V5XSA9IGdldE1lc3NhZ2VGdW5jdGlvbkRldGFpbHModik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGlzT2JqZWN0KHYpKSB7XHJcbiAgICAgICAgICAgIHZhbHVlW2tleV0gPSBnZXRMb2NhbGVNZXNzYWdlVmFsdWUodik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB2YWx1ZVtrZXldID0gdjtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiB2YWx1ZTtcclxufVxyXG5jb25zdCBFU0MgPSB7XHJcbiAgICAnPCc6ICcmbHQ7JyxcclxuICAgICc+JzogJyZndDsnLFxyXG4gICAgJ1wiJzogJyZxdW90OycsXHJcbiAgICAnJic6ICcmYW1wOydcclxufTtcclxuZnVuY3Rpb24gZXNjYXBlKHMpIHtcclxuICAgIHJldHVybiBzLnJlcGxhY2UoL1s8PlwiJl0vZywgZXNjYXBlQ2hhcik7XHJcbn1cclxuZnVuY3Rpb24gZXNjYXBlQ2hhcihhKSB7XHJcbiAgICByZXR1cm4gRVNDW2FdIHx8IGE7XHJcbn1cclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcclxuZnVuY3Rpb24gZ2V0TWVzc2FnZUZ1bmN0aW9uRGV0YWlscyhmdW5jKSB7XHJcbiAgICBjb25zdCBhcmdTdHJpbmcgPSBmdW5jLnNvdXJjZSA/IGAoXCIke2VzY2FwZShmdW5jLnNvdXJjZSl9XCIpYCA6IGAoPylgO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBfY3VzdG9tOiB7XHJcbiAgICAgICAgICAgIHR5cGU6ICdmdW5jdGlvbicsXHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGA8c3Bhbj7Gkjwvc3Bhbj4gJHthcmdTdHJpbmd9YFxyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuZnVuY3Rpb24gcmVnaXN0ZXJTY29wZShwYXlsb2FkLCBpMThuKSB7XHJcbiAgICBwYXlsb2FkLnJvb3ROb2Rlcy5wdXNoKHtcclxuICAgICAgICBpZDogJ2dsb2JhbCcsXHJcbiAgICAgICAgbGFiZWw6ICdHbG9iYWwgU2NvcGUnXHJcbiAgICB9KTtcclxuICAgIC8vIHByZXR0aWVyLWlnbm9yZVxyXG4gICAgY29uc3QgZ2xvYmFsID0gaTE4bi5tb2RlID09PSAnY29tcG9zaXRpb24nXHJcbiAgICAgICAgPyBpMThuLmdsb2JhbFxyXG4gICAgICAgIDogaTE4bi5nbG9iYWwuX19jb21wb3NlcjtcclxuICAgIGZvciAoY29uc3QgW2tleUluc3RhbmNlLCBpbnN0YW5jZV0gb2YgaTE4bi5fX2luc3RhbmNlcykge1xyXG4gICAgICAgIC8vIHByZXR0aWVyLWlnbm9yZVxyXG4gICAgICAgIGNvbnN0IGNvbXBvc2VyID0gaTE4bi5tb2RlID09PSAnY29tcG9zaXRpb24nXHJcbiAgICAgICAgICAgID8gaW5zdGFuY2VcclxuICAgICAgICAgICAgOiBpbnN0YW5jZS5fX2NvbXBvc2VyO1xyXG4gICAgICAgIGlmIChnbG9iYWwgPT09IGNvbXBvc2VyKSB7XHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBsYWJlbCA9IGtleUluc3RhbmNlLnR5cGUubmFtZSB8fFxyXG4gICAgICAgICAgICBrZXlJbnN0YW5jZS50eXBlLmRpc3BsYXlOYW1lIHx8XHJcbiAgICAgICAgICAgIGtleUluc3RhbmNlLnR5cGUuX19maWxlO1xyXG4gICAgICAgIHBheWxvYWQucm9vdE5vZGVzLnB1c2goe1xyXG4gICAgICAgICAgICBpZDogY29tcG9zZXIuaWQudG9TdHJpbmcoKSxcclxuICAgICAgICAgICAgbGFiZWw6IGAke2xhYmVsfSBTY29wZWBcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBnZXRDb21wb3NlciQxKG5vZGVJZCwgaTE4bikge1xyXG4gICAgaWYgKG5vZGVJZCA9PT0gJ2dsb2JhbCcpIHtcclxuICAgICAgICByZXR1cm4gaTE4bi5tb2RlID09PSAnY29tcG9zaXRpb24nXHJcbiAgICAgICAgICAgID8gaTE4bi5nbG9iYWxcclxuICAgICAgICAgICAgOiBpMThuLmdsb2JhbC5fX2NvbXBvc2VyO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBBcnJheS5mcm9tKGkxOG4uX19pbnN0YW5jZXMudmFsdWVzKCkpLmZpbmQoaXRlbSA9PiBpdGVtLmlkLnRvU3RyaW5nKCkgPT09IG5vZGVJZCk7XHJcbiAgICAgICAgaWYgKGluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpMThuLm1vZGUgPT09ICdjb21wb3NpdGlvbidcclxuICAgICAgICAgICAgICAgID8gaW5zdGFuY2VcclxuICAgICAgICAgICAgICAgIDogaW5zdGFuY2UuX19jb21wb3NlcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBpbnNwZWN0U2NvcGUocGF5bG9hZCwgaTE4bikge1xyXG4gICAgY29uc3QgY29tcG9zZXIgPSBnZXRDb21wb3NlciQxKHBheWxvYWQubm9kZUlkLCBpMThuKTtcclxuICAgIGlmIChjb21wb3Nlcikge1xyXG4gICAgICAgIHBheWxvYWQuc3RhdGUgPSBtYWtlU2NvcGVJbnNwZWN0U3RhdGUoY29tcG9zZXIpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIG1ha2VTY29wZUluc3BlY3RTdGF0ZShjb21wb3Nlcikge1xyXG4gICAgY29uc3Qgc3RhdGUgPSB7fTtcclxuICAgIGNvbnN0IGxvY2FsZVR5cGUgPSAnTG9jYWxlIHJlbGF0ZWQgaW5mbyc7XHJcbiAgICBjb25zdCBsb2NhbGVTdGF0ZXMgPSBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0eXBlOiBsb2NhbGVUeXBlLFxyXG4gICAgICAgICAgICBrZXk6ICdsb2NhbGUnLFxyXG4gICAgICAgICAgICBlZGl0YWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgdmFsdWU6IGNvbXBvc2VyLmxvY2FsZS52YWx1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB0eXBlOiBsb2NhbGVUeXBlLFxyXG4gICAgICAgICAgICBrZXk6ICdmYWxsYmFja0xvY2FsZScsXHJcbiAgICAgICAgICAgIGVkaXRhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICB2YWx1ZTogY29tcG9zZXIuZmFsbGJhY2tMb2NhbGUudmFsdWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdHlwZTogbG9jYWxlVHlwZSxcclxuICAgICAgICAgICAga2V5OiAnYXZhaWxhYmxlTG9jYWxlcycsXHJcbiAgICAgICAgICAgIGVkaXRhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgdmFsdWU6IGNvbXBvc2VyLmF2YWlsYWJsZUxvY2FsZXNcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdHlwZTogbG9jYWxlVHlwZSxcclxuICAgICAgICAgICAga2V5OiAnaW5oZXJpdExvY2FsZScsXHJcbiAgICAgICAgICAgIGVkaXRhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICB2YWx1ZTogY29tcG9zZXIuaW5oZXJpdExvY2FsZVxyXG4gICAgICAgIH1cclxuICAgIF07XHJcbiAgICBzdGF0ZVtsb2NhbGVUeXBlXSA9IGxvY2FsZVN0YXRlcztcclxuICAgIGNvbnN0IGxvY2FsZU1lc3NhZ2VzVHlwZSA9ICdMb2NhbGUgbWVzc2FnZXMgaW5mbyc7XHJcbiAgICBjb25zdCBsb2NhbGVNZXNzYWdlc1N0YXRlcyA9IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHR5cGU6IGxvY2FsZU1lc3NhZ2VzVHlwZSxcclxuICAgICAgICAgICAga2V5OiAnbWVzc2FnZXMnLFxyXG4gICAgICAgICAgICBlZGl0YWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgIHZhbHVlOiBnZXRMb2NhbGVNZXNzYWdlVmFsdWUoY29tcG9zZXIubWVzc2FnZXMudmFsdWUpXHJcbiAgICAgICAgfVxyXG4gICAgXTtcclxuICAgIHN0YXRlW2xvY2FsZU1lc3NhZ2VzVHlwZV0gPSBsb2NhbGVNZXNzYWdlc1N0YXRlcztcclxuICAgIGNvbnN0IGRhdGV0aW1lRm9ybWF0c1R5cGUgPSAnRGF0ZXRpbWUgZm9ybWF0cyBpbmZvJztcclxuICAgIGNvbnN0IGRhdGV0aW1lRm9ybWF0c1N0YXRlcyA9IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHR5cGU6IGRhdGV0aW1lRm9ybWF0c1R5cGUsXHJcbiAgICAgICAgICAgIGtleTogJ2RhdGV0aW1lRm9ybWF0cycsXHJcbiAgICAgICAgICAgIGVkaXRhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgdmFsdWU6IGNvbXBvc2VyLmRhdGV0aW1lRm9ybWF0cy52YWx1ZVxyXG4gICAgICAgIH1cclxuICAgIF07XHJcbiAgICBzdGF0ZVtkYXRldGltZUZvcm1hdHNUeXBlXSA9IGRhdGV0aW1lRm9ybWF0c1N0YXRlcztcclxuICAgIGNvbnN0IG51bWJlckZvcm1hdHNUeXBlID0gJ0RhdGV0aW1lIGZvcm1hdHMgaW5mbyc7XHJcbiAgICBjb25zdCBudW1iZXJGb3JtYXRzU3RhdGVzID0gW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdHlwZTogbnVtYmVyRm9ybWF0c1R5cGUsXHJcbiAgICAgICAgICAgIGtleTogJ251bWJlckZvcm1hdHMnLFxyXG4gICAgICAgICAgICBlZGl0YWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgIHZhbHVlOiBjb21wb3Nlci5udW1iZXJGb3JtYXRzLnZhbHVlXHJcbiAgICAgICAgfVxyXG4gICAgXTtcclxuICAgIHN0YXRlW251bWJlckZvcm1hdHNUeXBlXSA9IG51bWJlckZvcm1hdHNTdGF0ZXM7XHJcbiAgICByZXR1cm4gc3RhdGU7XHJcbn1cclxuZnVuY3Rpb24gYWRkVGltZWxpbmVFdmVudChldmVudCwgcGF5bG9hZCkge1xyXG4gICAgaWYgKGRldnRvb2xzQXBpKSB7XHJcbiAgICAgICAgbGV0IGdyb3VwSWQ7XHJcbiAgICAgICAgaWYgKHBheWxvYWQgJiYgJ2dyb3VwSWQnIGluIHBheWxvYWQpIHtcclxuICAgICAgICAgICAgZ3JvdXBJZCA9IHBheWxvYWQuZ3JvdXBJZDtcclxuICAgICAgICAgICAgZGVsZXRlIHBheWxvYWQuZ3JvdXBJZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZGV2dG9vbHNBcGkuYWRkVGltZWxpbmVFdmVudCh7XHJcbiAgICAgICAgICAgIGxheWVySWQ6IFwidnVlLWkxOG4tdGltZWxpbmVcIiAvKiBUSU1FTElORSAqLyxcclxuICAgICAgICAgICAgZXZlbnQ6IHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiBldmVudCxcclxuICAgICAgICAgICAgICAgIGdyb3VwSWQsXHJcbiAgICAgICAgICAgICAgICB0aW1lOiBEYXRlLm5vdygpLFxyXG4gICAgICAgICAgICAgICAgbWV0YToge30sXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBwYXlsb2FkIHx8IHt9LFxyXG4gICAgICAgICAgICAgICAgbG9nVHlwZTogZXZlbnQgPT09IFwiY29tcGlsZS1lcnJvclwiIC8qIENPTVBJTEVfRVJST1IgKi9cclxuICAgICAgICAgICAgICAgICAgICA/ICdlcnJvcidcclxuICAgICAgICAgICAgICAgICAgICA6IGV2ZW50ID09PSBcImZhbGxiYWNrXCIgLyogRkFMQkFDSyAqLyB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudCA9PT0gXCJtaXNzaW5nXCIgLyogTUlTU0lORyAqL1xyXG4gICAgICAgICAgICAgICAgICAgICAgICA/ICd3YXJuaW5nJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICA6ICdkZWZhdWx0J1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gZWRpdFNjb3BlKHBheWxvYWQsIGkxOG4pIHtcclxuICAgIGNvbnN0IGNvbXBvc2VyID0gZ2V0Q29tcG9zZXIkMShwYXlsb2FkLm5vZGVJZCwgaTE4bik7XHJcbiAgICBpZiAoY29tcG9zZXIpIHtcclxuICAgICAgICBjb25zdCBbZmllbGRdID0gcGF5bG9hZC5wYXRoO1xyXG4gICAgICAgIGlmIChmaWVsZCA9PT0gJ2xvY2FsZScgJiYgaXNTdHJpbmcocGF5bG9hZC5zdGF0ZS52YWx1ZSkpIHtcclxuICAgICAgICAgICAgY29tcG9zZXIubG9jYWxlLnZhbHVlID0gcGF5bG9hZC5zdGF0ZS52YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoZmllbGQgPT09ICdmYWxsYmFja0xvY2FsZScgJiZcclxuICAgICAgICAgICAgKGlzU3RyaW5nKHBheWxvYWQuc3RhdGUudmFsdWUpIHx8XHJcbiAgICAgICAgICAgICAgICBpc0FycmF5KHBheWxvYWQuc3RhdGUudmFsdWUpIHx8XHJcbiAgICAgICAgICAgICAgICBpc09iamVjdChwYXlsb2FkLnN0YXRlLnZhbHVlKSkpIHtcclxuICAgICAgICAgICAgY29tcG9zZXIuZmFsbGJhY2tMb2NhbGUudmFsdWUgPSBwYXlsb2FkLnN0YXRlLnZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChmaWVsZCA9PT0gJ2luaGVyaXRMb2NhbGUnICYmIGlzQm9vbGVhbihwYXlsb2FkLnN0YXRlLnZhbHVlKSkge1xyXG4gICAgICAgICAgICBjb21wb3Nlci5pbmhlcml0TG9jYWxlID0gcGF5bG9hZC5zdGF0ZS52YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cblxuLy8gc3VwcG9ydHMgY29tcGF0aWJpbGl0eSBmb3IgbGVnYWN5IHZ1ZS1pMThuIEFQSXNcclxuZnVuY3Rpb24gZGVmaW5lTWl4aW4odnVlaTE4biwgY29tcG9zZXIsIGkxOG4pIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgYmVmb3JlQ3JlYXRlKCkge1xyXG4gICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IGdldEN1cnJlbnRJbnN0YW5jZSgpO1xyXG4gICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cclxuICAgICAgICAgICAgaWYgKCFpbnN0YW5jZSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgY3JlYXRlSTE4bkVycm9yKDIyIC8qIFVORVhQRUNURURfRVJST1IgKi8pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLiRvcHRpb25zO1xyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy5pMThuKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBvcHRpb25zSTE4biA9IG9wdGlvbnMuaTE4bjtcclxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zLl9faTE4bikge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnNJMThuLl9faTE4biA9IG9wdGlvbnMuX19pMThuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgb3B0aW9uc0kxOG4uX19yb290ID0gY29tcG9zZXI7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcyA9PT0gdGhpcy4kcm9vdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJGkxOG4gPSBtZXJnZVRvUm9vdCh2dWVpMThuLCBvcHRpb25zSTE4bik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zSTE4bi5fX2luamVjdFdpdGhPcHRpb24gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJGkxOG4gPSBjcmVhdGVWdWVJMThuKG9wdGlvbnNJMThuKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChvcHRpb25zLl9faTE4bikge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMgPT09IHRoaXMuJHJvb3QpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLiRpMThuID0gbWVyZ2VUb1Jvb3QodnVlaTE4biwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLiRpMThuID0gY3JlYXRlVnVlSTE4bih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9faTE4bjogb3B0aW9ucy5fX2kxOG4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9faW5qZWN0V2l0aE9wdGlvbjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgX19yb290OiBjb21wb3NlclxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gc2V0IGdsb2JhbFxyXG4gICAgICAgICAgICAgICAgdGhpcy4kaTE4biA9IHZ1ZWkxOG47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdnVlaTE4bi5fX29uQ29tcG9uZW50SW5zdGFuY2VDcmVhdGVkKHRoaXMuJGkxOG4pO1xyXG4gICAgICAgICAgICBpMThuLl9fc2V0SW5zdGFuY2UoaW5zdGFuY2UsIHRoaXMuJGkxOG4pO1xyXG4gICAgICAgICAgICAvLyBkZWZpbmVzIHZ1ZS1pMThuIGxlZ2FjeSBBUElzXHJcbiAgICAgICAgICAgIHRoaXMuJHQgPSAoLi4uYXJncykgPT4gdGhpcy4kaTE4bi50KC4uLmFyZ3MpO1xyXG4gICAgICAgICAgICB0aGlzLiRydCA9ICguLi5hcmdzKSA9PiB0aGlzLiRpMThuLnJ0KC4uLmFyZ3MpO1xyXG4gICAgICAgICAgICB0aGlzLiR0YyA9ICguLi5hcmdzKSA9PiB0aGlzLiRpMThuLnRjKC4uLmFyZ3MpO1xyXG4gICAgICAgICAgICB0aGlzLiR0ZSA9IChrZXksIGxvY2FsZSkgPT4gdGhpcy4kaTE4bi50ZShrZXksIGxvY2FsZSk7XHJcbiAgICAgICAgICAgIHRoaXMuJGQgPSAoLi4uYXJncykgPT4gdGhpcy4kaTE4bi5kKC4uLmFyZ3MpO1xyXG4gICAgICAgICAgICB0aGlzLiRuID0gKC4uLmFyZ3MpID0+IHRoaXMuJGkxOG4ubiguLi5hcmdzKTtcclxuICAgICAgICAgICAgdGhpcy4kdG0gPSAoa2V5KSA9PiB0aGlzLiRpMThuLnRtKGtleSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBtb3VudGVkKCkge1xyXG4gICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cclxuICAgICAgICAgICAgaWYgKCgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgfHwgX19WVUVfUFJPRF9ERVZUT09MU19fKSAmJiAhZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuJGVsLl9fVlVFX0kxOE5fXyA9IHRoaXMuJGkxOG4uX19jb21wb3NlcjtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVtaXR0ZXIgPSAodGhpcy5fX3ZfZW1pdHRlciA9IGNyZWF0ZUVtaXR0ZXIoKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBfdnVlSTE4biA9IHRoaXMuJGkxOG47XHJcbiAgICAgICAgICAgICAgICBfdnVlSTE4bi5fX2VuYWJsZUVtaXR0ZXIgJiYgX3Z1ZUkxOG4uX19lbmFibGVFbWl0dGVyKGVtaXR0ZXIpO1xyXG4gICAgICAgICAgICAgICAgZW1pdHRlci5vbignKicsIGFkZFRpbWVsaW5lRXZlbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBiZWZvcmVVbm1vdW50KCkge1xyXG4gICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IGdldEN1cnJlbnRJbnN0YW5jZSgpO1xyXG4gICAgICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cclxuICAgICAgICAgICAgaWYgKCFpbnN0YW5jZSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgY3JlYXRlSTE4bkVycm9yKDIyIC8qIFVORVhQRUNURURfRVJST1IgKi8pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xyXG4gICAgICAgICAgICBpZiAoKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB8fCBfX1ZVRV9QUk9EX0RFVlRPT0xTX18pICYmICFmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX192X2VtaXR0ZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9fdl9lbWl0dGVyLm9mZignKicsIGFkZFRpbWVsaW5lRXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9fdl9lbWl0dGVyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc3QgX3Z1ZUkxOG4gPSB0aGlzLiRpMThuO1xyXG4gICAgICAgICAgICAgICAgX3Z1ZUkxOG4uX19kaXNhYmxlRW1pdHRlciAmJiBfdnVlSTE4bi5fX2Rpc2FibGVFbWl0dGVyKCk7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy4kZWwuX19WVUVfSTE4Tl9fO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLiR0O1xyXG4gICAgICAgICAgICBkZWxldGUgdGhpcy4kcnQ7XHJcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLiR0YztcclxuICAgICAgICAgICAgZGVsZXRlIHRoaXMuJHRlO1xyXG4gICAgICAgICAgICBkZWxldGUgdGhpcy4kZDtcclxuICAgICAgICAgICAgZGVsZXRlIHRoaXMuJG47XHJcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLiR0bTtcclxuICAgICAgICAgICAgaTE4bi5fX2RlbGV0ZUluc3RhbmNlKGluc3RhbmNlKTtcclxuICAgICAgICAgICAgZGVsZXRlIHRoaXMuJGkxOG47XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufVxyXG5mdW5jdGlvbiBtZXJnZVRvUm9vdChyb290LCBvcHRpb25zKSB7XHJcbiAgICByb290LmxvY2FsZSA9IG9wdGlvbnMubG9jYWxlIHx8IHJvb3QubG9jYWxlO1xyXG4gICAgcm9vdC5mYWxsYmFja0xvY2FsZSA9IG9wdGlvbnMuZmFsbGJhY2tMb2NhbGUgfHwgcm9vdC5mYWxsYmFja0xvY2FsZTtcclxuICAgIHJvb3QubWlzc2luZyA9IG9wdGlvbnMubWlzc2luZyB8fCByb290Lm1pc3Npbmc7XHJcbiAgICByb290LnNpbGVudFRyYW5zbGF0aW9uV2FybiA9XHJcbiAgICAgICAgb3B0aW9ucy5zaWxlbnRUcmFuc2xhdGlvbldhcm4gfHwgcm9vdC5zaWxlbnRGYWxsYmFja1dhcm47XHJcbiAgICByb290LnNpbGVudEZhbGxiYWNrV2FybiA9XHJcbiAgICAgICAgb3B0aW9ucy5zaWxlbnRGYWxsYmFja1dhcm4gfHwgcm9vdC5zaWxlbnRGYWxsYmFja1dhcm47XHJcbiAgICByb290LmZvcm1hdEZhbGxiYWNrTWVzc2FnZXMgPVxyXG4gICAgICAgIG9wdGlvbnMuZm9ybWF0RmFsbGJhY2tNZXNzYWdlcyB8fCByb290LmZvcm1hdEZhbGxiYWNrTWVzc2FnZXM7XHJcbiAgICByb290LnBvc3RUcmFuc2xhdGlvbiA9IG9wdGlvbnMucG9zdFRyYW5zbGF0aW9uIHx8IHJvb3QucG9zdFRyYW5zbGF0aW9uO1xyXG4gICAgcm9vdC53YXJuSHRtbEluTWVzc2FnZSA9IG9wdGlvbnMud2Fybkh0bWxJbk1lc3NhZ2UgfHwgcm9vdC53YXJuSHRtbEluTWVzc2FnZTtcclxuICAgIHJvb3QuZXNjYXBlUGFyYW1ldGVySHRtbCA9XHJcbiAgICAgICAgb3B0aW9ucy5lc2NhcGVQYXJhbWV0ZXJIdG1sIHx8IHJvb3QuZXNjYXBlUGFyYW1ldGVySHRtbDtcclxuICAgIHJvb3Quc3luYyA9IG9wdGlvbnMuc3luYyB8fCByb290LnN5bmM7XHJcbiAgICByb290Ll9fY29tcG9zZXJbU2V0UGx1cmFsUnVsZXNTeW1ib2xdKG9wdGlvbnMucGx1cmFsaXphdGlvblJ1bGVzIHx8IHJvb3QucGx1cmFsaXphdGlvblJ1bGVzKTtcclxuICAgIGNvbnN0IG1lc3NhZ2VzID0gZ2V0TG9jYWxlTWVzc2FnZXMocm9vdC5sb2NhbGUsIHtcclxuICAgICAgICBtZXNzYWdlczogb3B0aW9ucy5tZXNzYWdlcyxcclxuICAgICAgICBfX2kxOG46IG9wdGlvbnMuX19pMThuXHJcbiAgICB9KTtcclxuICAgIE9iamVjdC5rZXlzKG1lc3NhZ2VzKS5mb3JFYWNoKGxvY2FsZSA9PiByb290Lm1lcmdlTG9jYWxlTWVzc2FnZShsb2NhbGUsIG1lc3NhZ2VzW2xvY2FsZV0pKTtcclxuICAgIGlmIChvcHRpb25zLmRhdGV0aW1lRm9ybWF0cykge1xyXG4gICAgICAgIE9iamVjdC5rZXlzKG9wdGlvbnMuZGF0ZXRpbWVGb3JtYXRzKS5mb3JFYWNoKGxvY2FsZSA9PiByb290Lm1lcmdlRGF0ZVRpbWVGb3JtYXQobG9jYWxlLCBvcHRpb25zLmRhdGV0aW1lRm9ybWF0c1tsb2NhbGVdKSk7XHJcbiAgICB9XHJcbiAgICBpZiAob3B0aW9ucy5udW1iZXJGb3JtYXRzKSB7XHJcbiAgICAgICAgT2JqZWN0LmtleXMob3B0aW9ucy5udW1iZXJGb3JtYXRzKS5mb3JFYWNoKGxvY2FsZSA9PiByb290Lm1lcmdlTnVtYmVyRm9ybWF0KGxvY2FsZSwgb3B0aW9ucy5udW1iZXJGb3JtYXRzW2xvY2FsZV0pKTtcclxuICAgIH1cclxuICAgIHJldHVybiByb290O1xyXG59XG5cbi8qKlxyXG4gKiBWdWUgSTE4biBmYWN0b3J5XHJcbiAqXHJcbiAqIEBwYXJhbSBvcHRpb25zIC0gQW4gb3B0aW9ucywgc2VlIHRoZSB7QGxpbmsgSTE4bk9wdGlvbnN9XHJcbiAqXHJcbiAqIEByZXR1cm5zIHtAbGluayBJMThufSBpbnN0YW5jZVxyXG4gKlxyXG4gKiBAcmVtYXJrc1xyXG4gKiBJZiB5b3UgdXNlIExlZ2FjeSBBUEkgbW9kZSwgeW91IG5lZWQgdG90byBzcGVjaWZ5IHtAbGluayBWdWVJMThuT3B0aW9uc30gYW5kIGBsZWdhY3k6IHRydWVgIG9wdGlvbi5cclxuICpcclxuICogSWYgeW91IHVzZSBjb21wb3NpdGlvbiBBUEkgbW9kZSwgeW91IG5lZWQgdG8gc3BlY2lmeSB7QGxpbmsgQ29tcG9zZXJPcHRpb25zfS5cclxuICpcclxuICogQFZ1ZUkxOG5TZWUgW0dldHRpbmcgU3RhcnRlZF0oLi4vZ3VpZGUvKVxyXG4gKiBAVnVlSTE4blNlZSBbQ29tcG9zaXRpb24gQVBJXSguLi9ndWlkZS9hZHZhbmNlZC9jb21wb3NpdGlvbilcclxuICpcclxuICogQGV4YW1wbGVcclxuICogY2FzZTogZm9yIExlZ2FjeSBBUElcclxuICogYGBganNcclxuICogaW1wb3J0IHsgY3JlYXRlQXBwIH0gZnJvbSAndnVlJ1xyXG4gKiBpbXBvcnQgeyBjcmVhdGVJMThuIH0gZnJvbSAndnVlLWkxOG4nXHJcbiAqXHJcbiAqIC8vIGNhbGwgd2l0aCBJMThuIG9wdGlvblxyXG4gKiBjb25zdCBpMThuID0gY3JlYXRlSTE4bih7XHJcbiAqICAgbG9jYWxlOiAnamEnLFxyXG4gKiAgIG1lc3NhZ2VzOiB7XHJcbiAqICAgICBlbjogeyAuLi4gfSxcclxuICogICAgIGphOiB7IC4uLiB9XHJcbiAqICAgfVxyXG4gKiB9KVxyXG4gKlxyXG4gKiBjb25zdCBBcHAgPSB7XHJcbiAqICAgLy8gLi4uXHJcbiAqIH1cclxuICpcclxuICogY29uc3QgYXBwID0gY3JlYXRlQXBwKEFwcClcclxuICpcclxuICogLy8gaW5zdGFsbCFcclxuICogYXBwLnVzZShpMThuKVxyXG4gKiBhcHAubW91bnQoJyNhcHAnKVxyXG4gKiBgYGBcclxuICpcclxuICogQGV4YW1wbGVcclxuICogY2FzZTogZm9yIGNvbXBvc2l0aW9uIEFQSVxyXG4gKiBgYGBqc1xyXG4gKiBpbXBvcnQgeyBjcmVhdGVBcHAgfSBmcm9tICd2dWUnXHJcbiAqIGltcG9ydCB7IGNyZWF0ZUkxOG4sIHVzZUkxOG4gfSBmcm9tICd2dWUtaTE4bidcclxuICpcclxuICogLy8gY2FsbCB3aXRoIEkxOG4gb3B0aW9uXHJcbiAqIGNvbnN0IGkxOG4gPSBjcmVhdGVJMThuKHtcclxuICogICBsZWdhY3k6IGZhbHNlLCAvLyB5b3UgbXVzdCBzcGVjaWZ5ICdsZWdhY3k6IGZhbHNlJyBvcHRpb25cclxuICogICBsb2NhbGU6ICdqYScsXHJcbiAqICAgbWVzc2FnZXM6IHtcclxuICogICAgIGVuOiB7IC4uLiB9LFxyXG4gKiAgICAgamE6IHsgLi4uIH1cclxuICogICB9XHJcbiAqIH0pXHJcbiAqXHJcbiAqIGNvbnN0IEFwcCA9IHtcclxuICogICBzZXR1cCgpIHtcclxuICogICAgIC8vIC4uLlxyXG4gKiAgICAgY29uc3QgeyB0IH0gPSB1c2VJMThuKHsgLi4uIH0pXHJcbiAqICAgICByZXR1cm4geyAuLi4gLCB0IH1cclxuICogICB9XHJcbiAqIH1cclxuICpcclxuICogY29uc3QgYXBwID0gY3JlYXRlQXBwKEFwcClcclxuICpcclxuICogLy8gaW5zdGFsbCFcclxuICogYXBwLnVzZShpMThuKVxyXG4gKiBhcHAubW91bnQoJyNhcHAnKVxyXG4gKiBgYGBcclxuICpcclxuICogQFZ1ZUkxOG5HZW5lcmFsXHJcbiAqL1xyXG5mdW5jdGlvbiBjcmVhdGVJMThuKG9wdGlvbnMgPSB7fSkge1xyXG4gICAgLy8gcHJldHRpZXItaWdub3JlXHJcbiAgICBjb25zdCBfX2xlZ2FjeU1vZGUgPSBfX1ZVRV9JMThOX0xFR0FDWV9BUElfXyAmJiBpc0Jvb2xlYW4ob3B0aW9ucy5sZWdhY3kpXHJcbiAgICAgICAgPyBvcHRpb25zLmxlZ2FjeVxyXG4gICAgICAgIDogX19WVUVfSTE4Tl9MRUdBQ1lfQVBJX187XHJcbiAgICBjb25zdCBfX2dsb2JhbEluamVjdGlvbiA9ICEhb3B0aW9ucy5nbG9iYWxJbmplY3Rpb247XHJcbiAgICBjb25zdCBfX2luc3RhbmNlcyA9IG5ldyBNYXAoKTtcclxuICAgIC8vIHByZXR0aWVyLWlnbm9yZVxyXG4gICAgY29uc3QgX19nbG9iYWwgPSBfX1ZVRV9JMThOX0xFR0FDWV9BUElfXyAmJiBfX2xlZ2FjeU1vZGVcclxuICAgICAgICA/IGNyZWF0ZVZ1ZUkxOG4ob3B0aW9ucylcclxuICAgICAgICA6IGNyZWF0ZUNvbXBvc2VyKG9wdGlvbnMpO1xyXG4gICAgY29uc3Qgc3ltYm9sID0gbWFrZVN5bWJvbCgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgPyAndnVlLWkxOG4nIDogJycpO1xyXG4gICAgY29uc3QgaTE4biA9IHtcclxuICAgICAgICAvLyBtb2RlXHJcbiAgICAgICAgZ2V0IG1vZGUoKSB7XHJcbiAgICAgICAgICAgIC8vIHByZXR0aWVyLWlnbm9yZVxyXG4gICAgICAgICAgICByZXR1cm4gX19WVUVfSTE4Tl9MRUdBQ1lfQVBJX19cclxuICAgICAgICAgICAgICAgID8gX19sZWdhY3lNb2RlXHJcbiAgICAgICAgICAgICAgICAgICAgPyAnbGVnYWN5J1xyXG4gICAgICAgICAgICAgICAgICAgIDogJ2NvbXBvc2l0aW9uJ1xyXG4gICAgICAgICAgICAgICAgOiAnY29tcG9zaXRpb24nO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8gaW5zdGFsbCBwbHVnaW5cclxuICAgICAgICBhc3luYyBpbnN0YWxsKGFwcCwgLi4ub3B0aW9ucykge1xyXG4gICAgICAgICAgICBpZiAoKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB8fCBfX1ZVRV9QUk9EX0RFVlRPT0xTX18pICYmICFmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgYXBwLl9fVlVFX0kxOE5fXyA9IGkxOG47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gc2V0dXAgZ2xvYmFsIHByb3ZpZGVyXHJcbiAgICAgICAgICAgIGFwcC5fX1ZVRV9JMThOX1NZTUJPTF9fID0gc3ltYm9sO1xyXG4gICAgICAgICAgICBhcHAucHJvdmlkZShhcHAuX19WVUVfSTE4Tl9TWU1CT0xfXywgaTE4bik7XHJcbiAgICAgICAgICAgIC8vIGdsb2JhbCBtZXRob2QgYW5kIHByb3BlcnRpZXMgaW5qZWN0aW9uIGZvciBDb21wb3NpdGlvbiBBUElcclxuICAgICAgICAgICAgaWYgKCFfX2xlZ2FjeU1vZGUgJiYgX19nbG9iYWxJbmplY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgIGluamVjdEdsb2JhbEZpZWxkcyhhcHAsIGkxOG4uZ2xvYmFsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBpbnN0YWxsIGJ1aWx0LWluIGNvbXBvbmVudHMgYW5kIGRpcmVjdGl2ZVxyXG4gICAgICAgICAgICBpZiAoX19WVUVfSTE4Tl9GVUxMX0lOU1RBTExfXykge1xyXG4gICAgICAgICAgICAgICAgYXBwbHkoYXBwLCBpMThuLCAuLi5vcHRpb25zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBzZXR1cCBtaXhpbiBmb3IgTGVnYWN5IEFQSVxyXG4gICAgICAgICAgICBpZiAoX19WVUVfSTE4Tl9MRUdBQ1lfQVBJX18gJiYgX19sZWdhY3lNb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBhcHAubWl4aW4oZGVmaW5lTWl4aW4oX19nbG9iYWwsIF9fZ2xvYmFsLl9fY29tcG9zZXIsIGkxOG4pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBzZXR1cCB2dWUtZGV2dG9vbHMgcGx1Z2luXHJcbiAgICAgICAgICAgIGlmICgoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHx8IF9fVlVFX1BST0RfREVWVE9PTFNfXykgJiYgIWZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXQgPSBhd2FpdCBlbmFibGVEZXZUb29scyhhcHAsIGkxOG4pO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFyZXQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBjcmVhdGVJMThuRXJyb3IoMjEgLyogQ0FOTk9UX1NFVFVQX1ZVRV9ERVZUT09MU19QTFVHSU4gKi8pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc3QgZW1pdHRlciA9IGNyZWF0ZUVtaXR0ZXIoKTtcclxuICAgICAgICAgICAgICAgIGlmIChfX2xlZ2FjeU1vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBfdnVlSTE4biA9IF9fZ2xvYmFsO1xyXG4gICAgICAgICAgICAgICAgICAgIF92dWVJMThuLl9fZW5hYmxlRW1pdHRlciAmJiBfdnVlSTE4bi5fX2VuYWJsZUVtaXR0ZXIoZW1pdHRlcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IF9jb21wb3NlciA9IF9fZ2xvYmFsO1xyXG4gICAgICAgICAgICAgICAgICAgIF9jb21wb3NlcltFbmFibGVFbWl0dGVyXSAmJiBfY29tcG9zZXJbRW5hYmxlRW1pdHRlcl0oZW1pdHRlcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbWl0dGVyLm9uKCcqJywgYWRkVGltZWxpbmVFdmVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIGdsb2JhbCBhY2Nlc3NvclxyXG4gICAgICAgIGdldCBnbG9iYWwoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBfX2dsb2JhbDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIEBpbnRlcm5hbFxyXG4gICAgICAgIF9faW5zdGFuY2VzLFxyXG4gICAgICAgIC8vIEBpbnRlcm5hbFxyXG4gICAgICAgIF9fZ2V0SW5zdGFuY2UoY29tcG9uZW50KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBfX2luc3RhbmNlcy5nZXQoY29tcG9uZW50KSB8fCBudWxsO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8gQGludGVybmFsXHJcbiAgICAgICAgX19zZXRJbnN0YW5jZShjb21wb25lbnQsIGluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgIF9faW5zdGFuY2VzLnNldChjb21wb25lbnQsIGluc3RhbmNlKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIEBpbnRlcm5hbFxyXG4gICAgICAgIF9fZGVsZXRlSW5zdGFuY2UoY29tcG9uZW50KSB7XHJcbiAgICAgICAgICAgIF9faW5zdGFuY2VzLmRlbGV0ZShjb21wb25lbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICByZXR1cm4gaTE4bjtcclxufVxyXG4vKipcclxuICogVXNlIENvbXBvc2l0aW9uIEFQSSBmb3IgVnVlIEkxOG5cclxuICpcclxuICogQHBhcmFtIG9wdGlvbnMgLSBBbiBvcHRpb25zLCBzZWUge0BsaW5rIFVzZUkxOG5PcHRpb25zfVxyXG4gKlxyXG4gKiBAcmV0dXJucyB7QGxpbmsgQ29tcG9zZXJ9IGluc3RhbmNlXHJcbiAqXHJcbiAqIEByZW1hcmtzXHJcbiAqIFRoaXMgZnVuY3Rpb24gaXMgbWFpbmx5IHVzZWQgYnkgYHNldHVwYC5cclxuICpcclxuICogSWYgb3B0aW9ucyBhcmUgc3BlY2lmaWVkLCBDb21wb3NlciBpbnN0YW5jZSBpcyBjcmVhdGVkIGZvciBlYWNoIGNvbXBvbmVudCBhbmQgeW91IGNhbiBiZSBsb2NhbGl6ZWQgb24gdGhlIGNvbXBvbmVudC5cclxuICpcclxuICogSWYgb3B0aW9ucyBhcmUgbm90IHNwZWNpZmllZCwgeW91IGNhbiBiZSBsb2NhbGl6ZWQgdXNpbmcgdGhlIGdsb2JhbCBDb21wb3Nlci5cclxuICpcclxuICogQGV4YW1wbGVcclxuICogY2FzZTogQ29tcG9uZW50IHJlc291cmNlIGJhc2UgbG9jYWxpemF0aW9uXHJcbiAqIGBgYGh0bWxcclxuICogPHRlbXBsYXRlPlxyXG4gKiAgIDxmb3JtPlxyXG4gKiAgICAgPGxhYmVsPnt7IHQoJ2xhbmd1YWdlJykgfX08L2xhYmVsPlxyXG4gKiAgICAgPHNlbGVjdCB2LW1vZGVsPVwibG9jYWxlXCI+XHJcbiAqICAgICAgIDxvcHRpb24gdmFsdWU9XCJlblwiPmVuPC9vcHRpb24+XHJcbiAqICAgICAgIDxvcHRpb24gdmFsdWU9XCJqYVwiPmphPC9vcHRpb24+XHJcbiAqICAgICA8L3NlbGVjdD5cclxuICogICA8L2Zvcm0+XHJcbiAqICAgPHA+bWVzc2FnZToge3sgdCgnaGVsbG8nKSB9fTwvcD5cclxuICogPC90ZW1wbGF0ZT5cclxuICpcclxuICogPHNjcmlwdD5cclxuICogaW1wb3J0IHsgdXNlSTE4biB9IGZyb20gJ3Z1ZS1pMThuJ1xyXG4gKlxyXG4gKiBleHBvcnQgZGVmYXVsdCB7XHJcbiAqICBzZXR1cCgpIHtcclxuICogICAgY29uc3QgeyB0LCBsb2NhbGUgfSA9IHVzZUkxOG4oe1xyXG4gKiAgICAgIGxvY2FsZTogJ2phJyxcclxuICogICAgICBtZXNzYWdlczoge1xyXG4gKiAgICAgICAgZW46IHsgLi4uIH0sXHJcbiAqICAgICAgICBqYTogeyAuLi4gfVxyXG4gKiAgICAgIH1cclxuICogICAgfSlcclxuICogICAgLy8gU29tZXRoaW5nIHRvIGRvIC4uLlxyXG4gKlxyXG4gKiAgICByZXR1cm4geyAuLi4sIHQsIGxvY2FsZSB9XHJcbiAqICB9XHJcbiAqIH1cclxuICogPC9zY3JpcHQ+XHJcbiAqIGBgYFxyXG4gKlxyXG4gKiBAVnVlSTE4bkNvbXBvc2l0aW9uXHJcbiAqL1xyXG5mdW5jdGlvbiB1c2VJMThuKG9wdGlvbnMgPSB7fSkge1xyXG4gICAgY29uc3QgaW5zdGFuY2UgPSBnZXRDdXJyZW50SW5zdGFuY2UoKTtcclxuICAgIGlmIChpbnN0YW5jZSA9PSBudWxsKSB7XHJcbiAgICAgICAgdGhyb3cgY3JlYXRlSTE4bkVycm9yKDE2IC8qIE1VU1RfQkVfQ0FMTF9TRVRVUF9UT1AgKi8pO1xyXG4gICAgfVxyXG4gICAgaWYgKCFpbnN0YW5jZS5hcHBDb250ZXh0LmFwcC5fX1ZVRV9JMThOX1NZTUJPTF9fKSB7XHJcbiAgICAgICAgdGhyb3cgY3JlYXRlSTE4bkVycm9yKDE3IC8qIE5PVF9JTlNMQUxMRUQgKi8pO1xyXG4gICAgfVxyXG4gICAgY29uc3QgaTE4biA9IGluamVjdChpbnN0YW5jZS5hcHBDb250ZXh0LmFwcC5fX1ZVRV9JMThOX1NZTUJPTF9fKTtcclxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xyXG4gICAgaWYgKCFpMThuKSB7XHJcbiAgICAgICAgdGhyb3cgY3JlYXRlSTE4bkVycm9yKDIyIC8qIFVORVhQRUNURURfRVJST1IgKi8pO1xyXG4gICAgfVxyXG4gICAgLy8gcHJldHRpZXItaWdub3JlXHJcbiAgICBjb25zdCBnbG9iYWwgPSBpMThuLm1vZGUgPT09ICdjb21wb3NpdGlvbidcclxuICAgICAgICA/IGkxOG4uZ2xvYmFsXHJcbiAgICAgICAgOiBpMThuLmdsb2JhbC5fX2NvbXBvc2VyO1xyXG4gICAgLy8gcHJldHRpZXItaWdub3JlXHJcbiAgICBjb25zdCBzY29wZSA9IGlzRW1wdHlPYmplY3Qob3B0aW9ucylcclxuICAgICAgICA/ICgnX19pMThuJyBpbiBpbnN0YW5jZS50eXBlKVxyXG4gICAgICAgICAgICA/ICdsb2NhbCdcclxuICAgICAgICAgICAgOiAnZ2xvYmFsJ1xyXG4gICAgICAgIDogIW9wdGlvbnMudXNlU2NvcGVcclxuICAgICAgICAgICAgPyAnbG9jYWwnXHJcbiAgICAgICAgICAgIDogb3B0aW9ucy51c2VTY29wZTtcclxuICAgIGlmIChzY29wZSA9PT0gJ2dsb2JhbCcpIHtcclxuICAgICAgICBsZXQgbWVzc2FnZXMgPSBpc09iamVjdChvcHRpb25zLm1lc3NhZ2VzKSA/IG9wdGlvbnMubWVzc2FnZXMgOiB7fTtcclxuICAgICAgICBpZiAoJ19faTE4bkdsb2JhbCcgaW4gaW5zdGFuY2UudHlwZSkge1xyXG4gICAgICAgICAgICBtZXNzYWdlcyA9IGdldExvY2FsZU1lc3NhZ2VzKGdsb2JhbC5sb2NhbGUudmFsdWUsIHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2VzLFxyXG4gICAgICAgICAgICAgICAgX19pMThuOiBpbnN0YW5jZS50eXBlLl9faTE4bkdsb2JhbFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gbWVyZ2UgbG9jYWxlIG1lc3NhZ2VzXHJcbiAgICAgICAgY29uc3QgbG9jYWxlcyA9IE9iamVjdC5rZXlzKG1lc3NhZ2VzKTtcclxuICAgICAgICBpZiAobG9jYWxlcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgbG9jYWxlcy5mb3JFYWNoKGxvY2FsZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBnbG9iYWwubWVyZ2VMb2NhbGVNZXNzYWdlKGxvY2FsZSwgbWVzc2FnZXNbbG9jYWxlXSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBtZXJnZSBkYXRldGltZSBmb3JtYXRzXHJcbiAgICAgICAgaWYgKGlzT2JqZWN0KG9wdGlvbnMuZGF0ZXRpbWVGb3JtYXRzKSkge1xyXG4gICAgICAgICAgICBjb25zdCBsb2NhbGVzID0gT2JqZWN0LmtleXMob3B0aW9ucy5kYXRldGltZUZvcm1hdHMpO1xyXG4gICAgICAgICAgICBpZiAobG9jYWxlcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGxvY2FsZXMuZm9yRWFjaChsb2NhbGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGdsb2JhbC5tZXJnZURhdGVUaW1lRm9ybWF0KGxvY2FsZSwgb3B0aW9ucy5kYXRldGltZUZvcm1hdHNbbG9jYWxlXSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBtZXJnZSBudW1iZXIgZm9ybWF0c1xyXG4gICAgICAgIGlmIChpc09iamVjdChvcHRpb25zLm51bWJlckZvcm1hdHMpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxvY2FsZXMgPSBPYmplY3Qua2V5cyhvcHRpb25zLm51bWJlckZvcm1hdHMpO1xyXG4gICAgICAgICAgICBpZiAobG9jYWxlcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGxvY2FsZXMuZm9yRWFjaChsb2NhbGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGdsb2JhbC5tZXJnZU51bWJlckZvcm1hdChsb2NhbGUsIG9wdGlvbnMubnVtYmVyRm9ybWF0c1tsb2NhbGVdKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBnbG9iYWw7XHJcbiAgICB9XHJcbiAgICBpZiAoc2NvcGUgPT09ICdwYXJlbnQnKSB7XHJcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcclxuICAgICAgICBsZXQgY29tcG9zZXIgPSBnZXRDb21wb3NlcihpMThuLCBpbnN0YW5jZSwgb3B0aW9ucy5fX3VzZUNvbXBvbmVudCk7XHJcbiAgICAgICAgaWYgKGNvbXBvc2VyID09IG51bGwpIHtcclxuICAgICAgICAgICAgaWYgKChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSkge1xyXG4gICAgICAgICAgICAgICAgd2FybihnZXRXYXJuTWVzc2FnZSgxMiAvKiBOT1RfRk9VTkRfUEFSRU5UX1NDT1BFICovKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29tcG9zZXIgPSBnbG9iYWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjb21wb3NlcjtcclxuICAgIH1cclxuICAgIC8vIHNjb3BlICdsb2NhbCcgY2FzZVxyXG4gICAgaWYgKGkxOG4ubW9kZSA9PT0gJ2xlZ2FjeScpIHtcclxuICAgICAgICB0aHJvdyBjcmVhdGVJMThuRXJyb3IoMTggLyogTk9UX0FWQUlMQUJMRV9JTl9MRUdBQ1lfTU9ERSAqLyk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBpMThuSW50ZXJuYWwgPSBpMThuO1xyXG4gICAgbGV0IGNvbXBvc2VyID0gaTE4bkludGVybmFsLl9fZ2V0SW5zdGFuY2UoaW5zdGFuY2UpO1xyXG4gICAgaWYgKGNvbXBvc2VyID09IG51bGwpIHtcclxuICAgICAgICBjb25zdCB0eXBlID0gaW5zdGFuY2UudHlwZTtcclxuICAgICAgICBjb25zdCBjb21wb3Nlck9wdGlvbnMgPSBhc3NpZ24oe30sIG9wdGlvbnMpO1xyXG4gICAgICAgIGlmICh0eXBlLl9faTE4bikge1xyXG4gICAgICAgICAgICBjb21wb3Nlck9wdGlvbnMuX19pMThuID0gdHlwZS5fX2kxOG47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChnbG9iYWwpIHtcclxuICAgICAgICAgICAgY29tcG9zZXJPcHRpb25zLl9fcm9vdCA9IGdsb2JhbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29tcG9zZXIgPSBjcmVhdGVDb21wb3Nlcihjb21wb3Nlck9wdGlvbnMpO1xyXG4gICAgICAgIHNldHVwTGlmZUN5Y2xlKGkxOG5JbnRlcm5hbCwgaW5zdGFuY2UsIGNvbXBvc2VyKTtcclxuICAgICAgICBpMThuSW50ZXJuYWwuX19zZXRJbnN0YW5jZShpbnN0YW5jZSwgY29tcG9zZXIpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNvbXBvc2VyO1xyXG59XHJcbmZ1bmN0aW9uIGdldENvbXBvc2VyKGkxOG4sIHRhcmdldCwgdXNlQ29tcG9uZW50ID0gZmFsc2UpIHtcclxuICAgIGxldCBjb21wb3NlciA9IG51bGw7XHJcbiAgICBjb25zdCByb290ID0gdGFyZ2V0LnJvb3Q7XHJcbiAgICBsZXQgY3VycmVudCA9IHRhcmdldC5wYXJlbnQ7XHJcbiAgICB3aGlsZSAoY3VycmVudCAhPSBudWxsKSB7XHJcbiAgICAgICAgY29uc3QgaTE4bkludGVybmFsID0gaTE4bjtcclxuICAgICAgICBpZiAoaTE4bi5tb2RlID09PSAnY29tcG9zaXRpb24nKSB7XHJcbiAgICAgICAgICAgIGNvbXBvc2VyID0gaTE4bkludGVybmFsLl9fZ2V0SW5zdGFuY2UoY3VycmVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCB2dWVJMThuID0gaTE4bkludGVybmFsLl9fZ2V0SW5zdGFuY2UoY3VycmVudCk7XHJcbiAgICAgICAgICAgIGlmICh2dWVJMThuICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGNvbXBvc2VyID0gdnVlSTE4blxyXG4gICAgICAgICAgICAgICAgICAgIC5fX2NvbXBvc2VyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XHJcbiAgICAgICAgICAgIGlmICh1c2VDb21wb25lbnQgJiYgY29tcG9zZXIgJiYgIWNvbXBvc2VyW0luZWpjdFdpdGhPcHRpb25dKSB7XHJcbiAgICAgICAgICAgICAgICBjb21wb3NlciA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNvbXBvc2VyICE9IG51bGwpIHtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyb290ID09PSBjdXJyZW50KSB7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjdXJyZW50ID0gY3VycmVudC5wYXJlbnQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY29tcG9zZXI7XHJcbn1cclxuZnVuY3Rpb24gc2V0dXBMaWZlQ3ljbGUoaTE4biwgdGFyZ2V0LCBjb21wb3Nlcikge1xyXG4gICAgbGV0IGVtaXR0ZXIgPSBudWxsO1xyXG4gICAgb25Nb3VudGVkKCgpID0+IHtcclxuICAgICAgICAvLyBpbmplY3QgY29tcG9zZXIgaW5zdGFuY2UgdG8gRE9NIGZvciBpbnRsaWZ5LWRldnRvb2xzXHJcbiAgICAgICAgaWYgKCgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgfHwgX19WVUVfUFJPRF9ERVZUT09MU19fKSAmJlxyXG4gICAgICAgICAgICAhZmFsc2UgJiZcclxuICAgICAgICAgICAgdGFyZ2V0LnZub2RlLmVsKSB7XHJcbiAgICAgICAgICAgIHRhcmdldC52bm9kZS5lbC5fX1ZVRV9JMThOX18gPSBjb21wb3NlcjtcclxuICAgICAgICAgICAgZW1pdHRlciA9IGNyZWF0ZUVtaXR0ZXIoKTtcclxuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcclxuICAgICAgICAgICAgY29uc3QgX2NvbXBvc2VyID0gY29tcG9zZXI7XHJcbiAgICAgICAgICAgIF9jb21wb3NlcltFbmFibGVFbWl0dGVyXSAmJiBfY29tcG9zZXJbRW5hYmxlRW1pdHRlcl0oZW1pdHRlcik7XHJcbiAgICAgICAgICAgIGVtaXR0ZXIub24oJyonLCBhZGRUaW1lbGluZUV2ZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9LCB0YXJnZXQpO1xyXG4gICAgb25Vbm1vdW50ZWQoKCkgPT4ge1xyXG4gICAgICAgIC8vIHJlbW92ZSBjb21wb3NlciBpbnN0YW5jZSBmcm9tIERPTSBmb3IgaW50bGlmeS1kZXZ0b29sc1xyXG4gICAgICAgIGlmICgoKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHx8IF9fVlVFX1BST0RfREVWVE9PTFNfXykgJiZcclxuICAgICAgICAgICAgIWZhbHNlICYmXHJcbiAgICAgICAgICAgIHRhcmdldC52bm9kZS5lbCAmJlxyXG4gICAgICAgICAgICB0YXJnZXQudm5vZGUuZWwuX19WVUVfSTE4Tl9fKSB7XHJcbiAgICAgICAgICAgIGVtaXR0ZXIgJiYgZW1pdHRlci5vZmYoJyonLCBhZGRUaW1lbGluZUV2ZW50KTtcclxuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcclxuICAgICAgICAgICAgY29uc3QgX2NvbXBvc2VyID0gY29tcG9zZXI7XHJcbiAgICAgICAgICAgIF9jb21wb3NlcltEaXNhYmxlRW1pdHRlcl0gJiYgX2NvbXBvc2VyW0Rpc2FibGVFbWl0dGVyXSgpO1xyXG4gICAgICAgICAgICBkZWxldGUgdGFyZ2V0LnZub2RlLmVsLl9fVlVFX0kxOE5fXztcclxuICAgICAgICB9XHJcbiAgICAgICAgaTE4bi5fX2RlbGV0ZUluc3RhbmNlKHRhcmdldCk7XHJcbiAgICB9LCB0YXJnZXQpO1xyXG59XHJcbmNvbnN0IGdsb2JhbEV4cG9ydFByb3BzID0gW1xyXG4gICAgJ2xvY2FsZScsXHJcbiAgICAnZmFsbGJhY2tMb2NhbGUnLFxyXG4gICAgJ2F2YWlsYWJsZUxvY2FsZXMnXHJcbl07XHJcbmNvbnN0IGdsb2JhbEV4cG9ydE1ldGhvZHMgPSBbJ3QnLCAncnQnLCAnZCcsICduJywgJ3RtJ107XHJcbmZ1bmN0aW9uIGluamVjdEdsb2JhbEZpZWxkcyhhcHAsIGNvbXBvc2VyKSB7XHJcbiAgICBjb25zdCBpMThuID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcclxuICAgIGdsb2JhbEV4cG9ydFByb3BzLmZvckVhY2gocHJvcCA9PiB7XHJcbiAgICAgICAgY29uc3QgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoY29tcG9zZXIsIHByb3ApO1xyXG4gICAgICAgIGlmICghZGVzYykge1xyXG4gICAgICAgICAgICB0aHJvdyBjcmVhdGVJMThuRXJyb3IoMjIgLyogVU5FWFBFQ1RFRF9FUlJPUiAqLyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHdyYXAgPSBpc1JlZihkZXNjLnZhbHVlKSAvLyBjaGVjayBjb21wdXRlZCBwcm9wc1xyXG4gICAgICAgICAgICA/IHtcclxuICAgICAgICAgICAgICAgIGdldCgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGVzYy52YWx1ZS52YWx1ZTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxyXG4gICAgICAgICAgICAgICAgc2V0KHZhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlc2MudmFsdWUudmFsdWUgPSB2YWw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgOiB7XHJcbiAgICAgICAgICAgICAgICBnZXQoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlc2MuZ2V0ICYmIGRlc2MuZ2V0KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGkxOG4sIHByb3AsIHdyYXApO1xyXG4gICAgfSk7XHJcbiAgICBhcHAuY29uZmlnLmdsb2JhbFByb3BlcnRpZXMuJGkxOG4gPSBpMThuO1xyXG4gICAgZ2xvYmFsRXhwb3J0TWV0aG9kcy5mb3JFYWNoKG1ldGhvZCA9PiB7XHJcbiAgICAgICAgY29uc3QgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoY29tcG9zZXIsIG1ldGhvZCk7XHJcbiAgICAgICAgaWYgKCFkZXNjIHx8ICFkZXNjLnZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRocm93IGNyZWF0ZUkxOG5FcnJvcigyMiAvKiBVTkVYUEVDVEVEX0VSUk9SICovKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGFwcC5jb25maWcuZ2xvYmFsUHJvcGVydGllcywgYCQke21ldGhvZH1gLCBkZXNjKTtcclxuICAgIH0pO1xyXG59XG5cbi8vIHJlZ2lzdGVyIG1lc3NhZ2UgY29tcGlsZXIgYXQgdnVlLWkxOG5cclxucmVnaXN0ZXJNZXNzYWdlQ29tcGlsZXIoY29tcGlsZVRvRnVuY3Rpb24pO1xyXG57XHJcbiAgICBpbml0RmVhdHVyZUZsYWdzKCk7XHJcbn1cclxuLy8gTk9URTogZXhwZXJpbWVudGFsICEhXHJcbmlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykgfHwgX19JTlRMSUZZX1BST0RfREVWVE9PTFNfXykge1xyXG4gICAgY29uc3QgdGFyZ2V0ID0gZ2V0R2xvYmFsVGhpcygpO1xyXG4gICAgdGFyZ2V0Ll9fSU5UTElGWV9fID0gdHJ1ZTtcclxuICAgIHNldERldlRvb2xzSG9vayh0YXJnZXQuX19JTlRMSUZZX0RFVlRPT0xTX0dMT0JBTF9IT09LX18pO1xyXG59XHJcbmlmICgocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykpIDtcblxuZXhwb3J0IHsgRGF0ZXRpbWVGb3JtYXQsIE51bWJlckZvcm1hdCwgVHJhbnNsYXRpb24sIFZFUlNJT04sIGNyZWF0ZUkxOG4sIHVzZUkxOG4sIHZURGlyZWN0aXZlIH07XG4iLCIvLyBUaGlzIGlzIGp1c3QgYW4gZXhhbXBsZSxcbi8vIHNvIHlvdSBjYW4gc2FmZWx5IGRlbGV0ZSBhbGwgZGVmYXVsdCBwcm9wcyBiZWxvd1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGZhaWxlZDogJ0FjdGlvbiBmYWlsZWQnLFxuICBzdWNjZXNzOiAnQWN0aW9uIHdhcyBzdWNjZXNzZnVsJ1xufTtcbiIsImltcG9ydCBlblVTIGZyb20gJy4vZW4tVVMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICdlbi1VUyc6IGVuVVNcbn07XG4iLCJpbXBvcnQgeyBib290IH0gZnJvbSAncXVhc2FyL3dyYXBwZXJzJztcbmltcG9ydCB7IGNyZWF0ZUkxOG4gfSBmcm9tICd2dWUtaTE4bic7XG5cbmltcG9ydCBtZXNzYWdlcyBmcm9tICdzcmMvaTE4bic7XG5cbmV4cG9ydCBkZWZhdWx0IGJvb3QoKHsgYXBwIH0pID0+IHtcbiAgY29uc3QgaTE4biA9IGNyZWF0ZUkxOG4oe1xuICAgIGxvY2FsZTogJ2VuLVVTJyxcbiAgICBtZXNzYWdlcyxcbiAgfSk7XG5cbiAgLy8gU2V0IGkxOG4gaW5zdGFuY2Ugb24gYXBwXG4gIGFwcC51c2UoaTE4bik7XG59KTtcbiJdLCJuYW1lcyI6WyJoYXNPd25Qcm9wZXJ0eSIsImlzT2JqZWN0IiwiVkVSU0lPTiIsImhhc093biJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUF3Q0EsTUFBTSxZQUFZLE9BQU8sV0FBVyxjQUFjLE9BQU8sT0FBTyxnQkFBZ0I7QUFDaEYsTUFBTSxhQUFhLENBQUMsU0FBUyxZQUFZLE9BQU8sSUFBSSxJQUFJO0FBQ3hELE1BQU0seUJBQXlCLENBQUMsUUFBUSxLQUFLLFdBQVcsc0JBQXNCLEVBQUUsR0FBRyxRQUFRLEdBQUcsS0FBSyxHQUFHLE9BQVEsQ0FBQTtBQUM5RyxNQUFNLHdCQUF3QixDQUFDLFNBQVMsS0FBSyxVQUFVLElBQUksRUFDdEQsUUFBUSxXQUFXLFNBQVMsRUFDNUIsUUFBUSxXQUFXLFNBQVMsRUFDNUIsUUFBUSxXQUFXLFNBQVM7QUFDakMsTUFBTSxXQUFXLENBQUMsUUFBUSxPQUFPLFFBQVEsWUFBWSxTQUFTLEdBQUc7QUFDakUsTUFBTSxTQUFTLENBQUMsUUFBUSxhQUFhLEdBQUcsTUFBTTtBQUM5QyxNQUFNLFdBQVcsQ0FBQyxRQUFRLGFBQWEsR0FBRyxNQUFNO0FBQ2hELE1BQU0sZ0JBQWdCLENBQUMsUUFBUSxjQUFjLEdBQUcsS0FBSyxPQUFPLEtBQUssR0FBRyxFQUFFLFdBQVc7QUFDakYsY0FBYyxLQUFLLEtBQUs7QUFDcEIsTUFBSSxPQUFPLFlBQVksYUFBYTtBQUNoQyxZQUFRLEtBQUssZUFBZSxHQUFHO0FBRS9CLFFBQUksS0FBSztBQUNMLGNBQVEsS0FBSyxJ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
