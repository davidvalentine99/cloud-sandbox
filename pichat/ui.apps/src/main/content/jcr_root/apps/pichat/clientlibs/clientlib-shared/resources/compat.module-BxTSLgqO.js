var j, s, Qe, U, Re, Ye, Ze, Je, se, ue, le, Xe, V = {}, et = [], Ot = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i, z = Array.isArray;
function E(e, t) {
  for (var _ in t) e[_] = t[_];
  return e;
}
function pe(e) {
  e && e.parentNode && e.parentNode.removeChild(e);
}
function S(e, t, _) {
  var n, r, o, u = {};
  for (o in t) o == "key" ? n = t[o] : o == "ref" ? r = t[o] : u[o] = t[o];
  if (arguments.length > 2 && (u.children = arguments.length > 3 ? j.call(arguments, 2) : _), typeof e == "function" && e.defaultProps != null) for (o in e.defaultProps) u[o] === void 0 && (u[o] = e.defaultProps[o]);
  return I(e, u, n, r, null);
}
function I(e, t, _, n, r) {
  var o = { type: e, props: t, key: _, ref: n, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: r ?? ++Qe, __i: -1, __u: 0 };
  return r == null && s.vnode != null && s.vnode(o), o;
}
function tt() {
  return { current: null };
}
function x(e) {
  return e.children;
}
function $(e, t) {
  this.props = e, this.context = t;
}
function O(e, t) {
  if (t == null) return e.__ ? O(e.__, e.__i + 1) : null;
  for (var _; t < e.__k.length; t++) if ((_ = e.__k[t]) != null && _.__e != null) return _.__e;
  return typeof e.type == "function" ? O(e) : null;
}
function _t(e) {
  var t, _;
  if ((e = e.__) != null && e.__c != null) {
    for (e.__e = e.__c.base = null, t = 0; t < e.__k.length; t++) if ((_ = e.__k[t]) != null && _.__e != null) {
      e.__e = e.__c.base = _.__e;
      break;
    }
    return _t(e);
  }
}
function ie(e) {
  (!e.__d && (e.__d = !0) && U.push(e) && !X.__r++ || Re != s.debounceRendering) && ((Re = s.debounceRendering) || Ye)(X);
}
function X() {
  for (var e, t, _, n, r, o, u, c = 1; U.length; ) U.length > c && U.sort(Ze), e = U.shift(), c = U.length, e.__d && (_ = void 0, n = void 0, r = (n = (t = e).__v).__e, o = [], u = [], t.__P && ((_ = E({}, n)).__v = n.__v + 1, s.vnode && s.vnode(_), he(t.__P, _, n, t.__n, t.__P.namespaceURI, 32 & n.__u ? [r] : null, o, r ?? O(n), !!(32 & n.__u), u), _.__v = n.__v, _.__.__k[_.__i] = _, ot(o, _, u), n.__e = n.__ = null, _.__e != r && _t(_)));
  X.__r = 0;
}
function nt(e, t, _, n, r, o, u, c, a, i, p) {
  var l, h, f, g, k, b, v, m = n && n.__k || et, P = t.length;
  for (a = Mt(_, t, m, a, P), l = 0; l < P; l++) (f = _.__k[l]) != null && (h = f.__i == -1 ? V : m[f.__i] || V, f.__i = l, b = he(e, f, h, r, o, u, c, a, i, p), g = f.__e, f.ref && h.ref != f.ref && (h.ref && de(h.ref, null, f), p.push(f.ref, f.__c || g, f)), k == null && g != null && (k = g), (v = !!(4 & f.__u)) || h.__k === f.__k ? a = rt(f, a, e, v) : typeof f.type == "function" && b !== void 0 ? a = b : g && (a = g.nextSibling), f.__u &= -7);
  return _.__e = k, a;
}
function Mt(e, t, _, n, r) {
  var o, u, c, a, i, p = _.length, l = p, h = 0;
  for (e.__k = new Array(r), o = 0; o < r; o++) (u = t[o]) != null && typeof u != "boolean" && typeof u != "function" ? (a = o + h, (u = e.__k[o] = typeof u == "string" || typeof u == "number" || typeof u == "bigint" || u.constructor == String ? I(null, u, null, null, null) : z(u) ? I(x, { children: u }, null, null, null) : u.constructor == null && u.__b > 0 ? I(u.type, u.props, u.key, u.ref ? u.ref : null, u.__v) : u).__ = e, u.__b = e.__b + 1, c = null, (i = u.__i = At(u, _, a, l)) != -1 && (l--, (c = _[i]) && (c.__u |= 2)), c == null || c.__v == null ? (i == -1 && (r > p ? h-- : r < p && h++), typeof u.type != "function" && (u.__u |= 4)) : i != a && (i == a - 1 ? h-- : i == a + 1 ? h++ : (i > a ? h-- : h++, u.__u |= 4))) : e.__k[o] = null;
  if (l) for (o = 0; o < p; o++) (c = _[o]) != null && (2 & c.__u) == 0 && (c.__e == n && (n = O(c)), lt(c, c));
  return n;
}
function rt(e, t, _, n) {
  var r, o;
  if (typeof e.type == "function") {
    for (r = e.__k, o = 0; r && o < r.length; o++) r[o] && (r[o].__ = e, t = rt(r[o], t, _, n));
    return t;
  }
  e.__e != t && (n && (t && e.type && !t.parentNode && (t = O(e)), _.insertBefore(e.__e, t || null)), t = e.__e);
  do
    t = t && t.nextSibling;
  while (t != null && t.nodeType == 8);
  return t;
}
function w(e, t) {
  return t = t || [], e == null || typeof e == "boolean" || (z(e) ? e.some(function(_) {
    w(_, t);
  }) : t.push(e)), t;
}
function At(e, t, _, n) {
  var r, o, u, c = e.key, a = e.type, i = t[_], p = i != null && (2 & i.__u) == 0;
  if (i === null && e.key == null || p && c == i.key && a == i.type) return _;
  if (n > (p ? 1 : 0)) {
    for (r = _ - 1, o = _ + 1; r >= 0 || o < t.length; ) if ((i = t[u = r >= 0 ? r-- : o++]) != null && (2 & i.__u) == 0 && c == i.key && a == i.type) return u;
  }
  return -1;
}
function Ue(e, t, _) {
  t[0] == "-" ? e.setProperty(t, _ ?? "") : e[t] = _ == null ? "" : typeof _ != "number" || Ot.test(t) ? _ : _ + "px";
}
function Z(e, t, _, n, r) {
  var o, u;
  e: if (t == "style") if (typeof _ == "string") e.style.cssText = _;
  else {
    if (typeof n == "string" && (e.style.cssText = n = ""), n) for (t in n) _ && t in _ || Ue(e.style, t, "");
    if (_) for (t in _) n && _[t] == n[t] || Ue(e.style, t, _[t]);
  }
  else if (t[0] == "o" && t[1] == "n") o = t != (t = t.replace(Je, "$1")), u = t.toLowerCase(), t = u in e || t == "onFocusOut" || t == "onFocusIn" ? u.slice(2) : t.slice(2), e.l || (e.l = {}), e.l[t + o] = _, _ ? n ? _.u = n.u : (_.u = se, e.addEventListener(t, o ? le : ue, o)) : e.removeEventListener(t, o ? le : ue, o);
  else {
    if (r == "http://www.w3.org/2000/svg") t = t.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
    else if (t != "width" && t != "height" && t != "href" && t != "list" && t != "form" && t != "tabIndex" && t != "download" && t != "rowSpan" && t != "colSpan" && t != "role" && t != "popover" && t in e) try {
      e[t] = _ ?? "";
      break e;
    } catch {
    }
    typeof _ == "function" || (_ == null || _ === !1 && t[4] != "-" ? e.removeAttribute(t) : e.setAttribute(t, t == "popover" && _ == 1 ? "" : _));
  }
}
function He(e) {
  return function(t) {
    if (this.l) {
      var _ = this.l[t.type + e];
      if (t.t == null) t.t = se++;
      else if (t.t < _.u) return;
      return _(s.event ? s.event(t) : t);
    }
  };
}
function he(e, t, _, n, r, o, u, c, a, i) {
  var p, l, h, f, g, k, b, v, m, P, R, Q, F, Pe, Y, L, ne, C = t.type;
  if (t.constructor != null) return null;
  128 & _.__u && (a = !!(32 & _.__u), o = [c = t.__e = _.__e]), (p = s.__b) && p(t);
  e: if (typeof C == "function") try {
    if (v = t.props, m = "prototype" in C && C.prototype.render, P = (p = C.contextType) && n[p.__c], R = p ? P ? P.props.value : p.__ : n, _.__c ? b = (l = t.__c = _.__c).__ = l.__E : (m ? t.__c = l = new C(v, R) : (t.__c = l = new $(v, R), l.constructor = C, l.render = Lt), P && P.sub(l), l.props = v, l.state || (l.state = {}), l.context = R, l.__n = n, h = l.__d = !0, l.__h = [], l._sb = []), m && l.__s == null && (l.__s = l.state), m && C.getDerivedStateFromProps != null && (l.__s == l.state && (l.__s = E({}, l.__s)), E(l.__s, C.getDerivedStateFromProps(v, l.__s))), f = l.props, g = l.state, l.__v = t, h) m && C.getDerivedStateFromProps == null && l.componentWillMount != null && l.componentWillMount(), m && l.componentDidMount != null && l.__h.push(l.componentDidMount);
    else {
      if (m && C.getDerivedStateFromProps == null && v !== f && l.componentWillReceiveProps != null && l.componentWillReceiveProps(v, R), !l.__e && l.shouldComponentUpdate != null && l.shouldComponentUpdate(v, l.__s, R) === !1 || t.__v == _.__v) {
        for (t.__v != _.__v && (l.props = v, l.state = l.__s, l.__d = !1), t.__e = _.__e, t.__k = _.__k, t.__k.some(function(T) {
          T && (T.__ = t);
        }), Q = 0; Q < l._sb.length; Q++) l.__h.push(l._sb[Q]);
        l._sb = [], l.__h.length && u.push(l);
        break e;
      }
      l.componentWillUpdate != null && l.componentWillUpdate(v, l.__s, R), m && l.componentDidUpdate != null && l.__h.push(function() {
        l.componentDidUpdate(f, g, k);
      });
    }
    if (l.context = R, l.props = v, l.__P = e, l.__e = !1, F = s.__r, Pe = 0, m) {
      for (l.state = l.__s, l.__d = !1, F && F(t), p = l.render(l.props, l.state, l.context), Y = 0; Y < l._sb.length; Y++) l.__h.push(l._sb[Y]);
      l._sb = [];
    } else do
      l.__d = !1, F && F(t), p = l.render(l.props, l.state, l.context), l.state = l.__s;
    while (l.__d && ++Pe < 25);
    l.state = l.__s, l.getChildContext != null && (n = E(E({}, n), l.getChildContext())), m && !h && l.getSnapshotBeforeUpdate != null && (k = l.getSnapshotBeforeUpdate(f, g)), L = p, p != null && p.type === x && p.key == null && (L = ut(p.props.children)), c = nt(e, z(L) ? L : [L], t, _, n, r, o, u, c, a, i), l.base = t.__e, t.__u &= -161, l.__h.length && u.push(l), b && (l.__E = l.__ = null);
  } catch (T) {
    if (t.__v = null, a || o != null) if (T.then) {
      for (t.__u |= a ? 160 : 128; c && c.nodeType == 8 && c.nextSibling; ) c = c.nextSibling;
      o[o.indexOf(c)] = null, t.__e = c;
    } else {
      for (ne = o.length; ne--; ) pe(o[ne]);
      ce(t);
    }
    else t.__e = _.__e, t.__k = _.__k, T.then || ce(t);
    s.__e(T, t, _);
  }
  else o == null && t.__v == _.__v ? (t.__k = _.__k, t.__e = _.__e) : c = t.__e = Ft(_.__e, t, _, n, r, o, u, a, i);
  return (p = s.diffed) && p(t), 128 & t.__u ? void 0 : c;
}
function ce(e) {
  e && e.__c && (e.__c.__e = !0), e && e.__k && e.__k.forEach(ce);
}
function ot(e, t, _) {
  for (var n = 0; n < _.length; n++) de(_[n], _[++n], _[++n]);
  s.__c && s.__c(t, e), e.some(function(r) {
    try {
      e = r.__h, r.__h = [], e.some(function(o) {
        o.call(r);
      });
    } catch (o) {
      s.__e(o, r.__v);
    }
  });
}
function ut(e) {
  return typeof e != "object" || e == null || e.__b && e.__b > 0 ? e : z(e) ? e.map(ut) : E({}, e);
}
function Ft(e, t, _, n, r, o, u, c, a) {
  var i, p, l, h, f, g, k, b = _.props, v = t.props, m = t.type;
  if (m == "svg" ? r = "http://www.w3.org/2000/svg" : m == "math" ? r = "http://www.w3.org/1998/Math/MathML" : r || (r = "http://www.w3.org/1999/xhtml"), o != null) {
    for (i = 0; i < o.length; i++) if ((f = o[i]) && "setAttribute" in f == !!m && (m ? f.localName == m : f.nodeType == 3)) {
      e = f, o[i] = null;
      break;
    }
  }
  if (e == null) {
    if (m == null) return document.createTextNode(v);
    e = document.createElementNS(r, m, v.is && v), c && (s.__m && s.__m(t, o), c = !1), o = null;
  }
  if (m == null) b === v || c && e.data == v || (e.data = v);
  else {
    if (o = o && j.call(e.childNodes), b = _.props || V, !c && o != null) for (b = {}, i = 0; i < e.attributes.length; i++) b[(f = e.attributes[i]).name] = f.value;
    for (i in b) if (f = b[i], i != "children") {
      if (i == "dangerouslySetInnerHTML") l = f;
      else if (!(i in v)) {
        if (i == "value" && "defaultValue" in v || i == "checked" && "defaultChecked" in v) continue;
        Z(e, i, null, f, r);
      }
    }
    for (i in v) f = v[i], i == "children" ? h = f : i == "dangerouslySetInnerHTML" ? p = f : i == "value" ? g = f : i == "checked" ? k = f : c && typeof f != "function" || b[i] === f || Z(e, i, f, b[i], r);
    if (p) c || l && (p.__html == l.__html || p.__html == e.innerHTML) || (e.innerHTML = p.__html), t.__k = [];
    else if (l && (e.innerHTML = ""), nt(t.type == "template" ? e.content : e, z(h) ? h : [h], t, _, n, m == "foreignObject" ? "http://www.w3.org/1999/xhtml" : r, o, u, o ? o[0] : _.__k && O(_, 0), c, a), o != null) for (i = o.length; i--; ) pe(o[i]);
    c || (i = "value", m == "progress" && g == null ? e.removeAttribute("value") : g != null && (g !== e[i] || m == "progress" && !g || m == "option" && g != b[i]) && Z(e, i, g, b[i], r), i = "checked", k != null && k != e[i] && Z(e, i, k, b[i], r));
  }
  return e;
}
function de(e, t, _) {
  try {
    if (typeof e == "function") {
      var n = typeof e.__u == "function";
      n && e.__u(), n && t == null || (e.__u = e(t));
    } else e.current = t;
  } catch (r) {
    s.__e(r, _);
  }
}
function lt(e, t, _) {
  var n, r;
  if (s.unmount && s.unmount(e), (n = e.ref) && (n.current && n.current != e.__e || de(n, null, t)), (n = e.__c) != null) {
    if (n.componentWillUnmount) try {
      n.componentWillUnmount();
    } catch (o) {
      s.__e(o, t);
    }
    n.base = n.__P = null;
  }
  if (n = e.__k) for (r = 0; r < n.length; r++) n[r] && lt(n[r], t, _ || typeof e.type != "function");
  _ || pe(e.__e), e.__c = e.__ = e.__e = void 0;
}
function Lt(e, t, _) {
  return this.constructor(e, _);
}
function B(e, t, _) {
  var n, r, o, u;
  t == document && (t = document.documentElement), s.__ && s.__(e, t), r = (n = typeof _ == "function") ? null : _ && _.__k || t.__k, o = [], u = [], he(t, e = (!n && _ || t).__k = S(x, null, [e]), r || V, V, t.namespaceURI, !n && _ ? [_] : r ? null : t.firstChild ? j.call(t.childNodes) : null, o, !n && _ ? _ : r ? r.__e : t.firstChild, n, u), ot(o, e, u);
}
function it(e, t) {
  B(e, t, it);
}
function It(e, t, _) {
  var n, r, o, u, c = E({}, e.props);
  for (o in e.type && e.type.defaultProps && (u = e.type.defaultProps), t) o == "key" ? n = t[o] : o == "ref" ? r = t[o] : c[o] = t[o] === void 0 && u != null ? u[o] : t[o];
  return arguments.length > 2 && (c.children = arguments.length > 3 ? j.call(arguments, 2) : _), I(e.type, c, n || e.key, r || e.ref, null);
}
function ct(e) {
  function t(_) {
    var n, r;
    return this.getChildContext || (n = /* @__PURE__ */ new Set(), (r = {})[t.__c] = this, this.getChildContext = function() {
      return r;
    }, this.componentWillUnmount = function() {
      n = null;
    }, this.shouldComponentUpdate = function(o) {
      this.props.value != o.value && n.forEach(function(u) {
        u.__e = !0, ie(u);
      });
    }, this.sub = function(o) {
      n.add(o);
      var u = o.componentWillUnmount;
      o.componentWillUnmount = function() {
        n && n.delete(o), u && u.call(o);
      };
    }), _.children;
  }
  return t.__c = "__cC" + Xe++, t.__ = e, t.Provider = t.__l = (t.Consumer = function(_, n) {
    return _.children(n);
  }).contextType = t, t;
}
j = et.slice, s = { __e: function(e, t, _, n) {
  for (var r, o, u; t = t.__; ) if ((r = t.__c) && !r.__) try {
    if ((o = r.constructor) && o.getDerivedStateFromError != null && (r.setState(o.getDerivedStateFromError(e)), u = r.__d), r.componentDidCatch != null && (r.componentDidCatch(e, n || {}), u = r.__d), u) return r.__E = r;
  } catch (c) {
    e = c;
  }
  throw e;
} }, Qe = 0, $.prototype.setState = function(e, t) {
  var _;
  _ = this.__s != null && this.__s != this.state ? this.__s : this.__s = E({}, this.state), typeof e == "function" && (e = e(E({}, _), this.props)), e && E(_, e), e != null && this.__v && (t && this._sb.push(t), ie(this));
}, $.prototype.forceUpdate = function(e) {
  this.__v && (this.__e = !0, e && this.__h.push(e), ie(this));
}, $.prototype.render = x, U = [], Ye = typeof Promise == "function" ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, Ze = function(e, t) {
  return e.__v.__b - t.__v.__b;
}, X.__r = 0, Je = /(PointerCapture)$|Capture$/i, se = 0, ue = He(!1), le = He(!0), Xe = 0;
var Wt = 0;
function u_(e, t, _, n, r, o) {
  t || (t = {});
  var u, c, a = t;
  if ("ref" in a) for (c in a = {}, t) c == "ref" ? u = t[c] : a[c] = t[c];
  var i = { type: e, props: a, key: _, ref: u, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --Wt, __i: -1, __u: 0, __source: r, __self: o };
  if (typeof e == "function" && (u = e.defaultProps)) for (c in u) a[c] === void 0 && (a[c] = u[c]);
  return s.vnode && s.vnode(i), i;
}
var N, d, re, Te, M = 0, at = [], y = s, De = y.__b, Oe = y.__r, Me = y.diffed, Ae = y.__c, Fe = y.unmount, Le = y.__;
function H(e, t) {
  y.__h && y.__h(d, e, M || t), M = 0;
  var _ = d.__H || (d.__H = { __: [], __h: [] });
  return e >= _.__.length && _.__.push({}), _.__[e];
}
function q(e) {
  return M = 1, te(ft, e);
}
function te(e, t, _) {
  var n = H(N++, 2);
  if (n.t = e, !n.__c && (n.__ = [_ ? _(t) : ft(void 0, t), function(c) {
    var a = n.__N ? n.__N[0] : n.__[0], i = n.t(a, c);
    a !== i && (n.__N = [i, n.__[1]], n.__c.setState({}));
  }], n.__c = d, !d.__f)) {
    var r = function(c, a, i) {
      if (!n.__c.__H) return !0;
      var p = n.__c.__H.__.filter(function(h) {
        return !!h.__c;
      });
      if (p.every(function(h) {
        return !h.__N;
      })) return !o || o.call(this, c, a, i);
      var l = n.__c.props !== c;
      return p.forEach(function(h) {
        if (h.__N) {
          var f = h.__[0];
          h.__ = h.__N, h.__N = void 0, f !== h.__[0] && (l = !0);
        }
      }), o && o.call(this, c, a, i) || l;
    };
    d.__f = !0;
    var o = d.shouldComponentUpdate, u = d.componentWillUpdate;
    d.componentWillUpdate = function(c, a, i) {
      if (this.__e) {
        var p = o;
        o = void 0, r(c, a, i), o = p;
      }
      u && u.call(this, c, a, i);
    }, d.shouldComponentUpdate = r;
  }
  return n.__N || n.__;
}
function _e(e, t) {
  var _ = H(N++, 3);
  !y.__s && $e(_.__H, t) && (_.__ = e, _.u = t, d.__H.__h.push(_));
}
function A(e, t) {
  var _ = H(N++, 4);
  !y.__s && $e(_.__H, t) && (_.__ = e, _.u = t, d.__h.push(_));
}
function ve(e) {
  return M = 5, G(function() {
    return { current: e };
  }, []);
}
function me(e, t, _) {
  M = 6, A(function() {
    if (typeof e == "function") {
      var n = e(t());
      return function() {
        e(null), n && typeof n == "function" && n();
      };
    }
    if (e) return e.current = t(), function() {
      return e.current = null;
    };
  }, _ == null ? _ : _.concat(e));
}
function G(e, t) {
  var _ = H(N++, 7);
  return $e(_.__H, t) && (_.__ = e(), _.__H = t, _.__h = e), _.__;
}
function ye(e, t) {
  return M = 8, G(function() {
    return e;
  }, t);
}
function ge(e) {
  var t = d.context[e.__c], _ = H(N++, 9);
  return _.c = e, t ? (_.__ == null && (_.__ = !0, t.sub(d)), t.props.value) : e.__;
}
function be(e, t) {
  y.useDebugValue && y.useDebugValue(t ? t(e) : e);
}
function Vt(e) {
  var t = H(N++, 10), _ = q();
  return t.__ = e, d.componentDidCatch || (d.componentDidCatch = function(n, r) {
    t.__ && t.__(n, r), _[1](n);
  }), [_[0], function() {
    _[1](void 0);
  }];
}
function ke() {
  var e = H(N++, 11);
  if (!e.__) {
    for (var t = d.__v; t !== null && !t.__m && t.__ !== null; ) t = t.__;
    var _ = t.__m || (t.__m = [0, 0]);
    e.__ = "P" + _[0] + "-" + _[1]++;
  }
  return e.__;
}
function Bt() {
  for (var e; e = at.shift(); ) if (e.__P && e.__H) try {
    e.__H.__h.forEach(J), e.__H.__h.forEach(ae), e.__H.__h = [];
  } catch (t) {
    e.__H.__h = [], y.__e(t, e.__v);
  }
}
y.__b = function(e) {
  d = null, De && De(e);
}, y.__ = function(e, t) {
  e && t.__k && t.__k.__m && (e.__m = t.__k.__m), Le && Le(e, t);
}, y.__r = function(e) {
  Oe && Oe(e), N = 0;
  var t = (d = e.__c).__H;
  t && (re === d ? (t.__h = [], d.__h = [], t.__.forEach(function(_) {
    _.__N && (_.__ = _.__N), _.u = _.__N = void 0;
  })) : (t.__h.forEach(J), t.__h.forEach(ae), t.__h = [], N = 0)), re = d;
}, y.diffed = function(e) {
  Me && Me(e);
  var t = e.__c;
  t && t.__H && (t.__H.__h.length && (at.push(t) !== 1 && Te === y.requestAnimationFrame || ((Te = y.requestAnimationFrame) || jt)(Bt)), t.__H.__.forEach(function(_) {
    _.u && (_.__H = _.u), _.u = void 0;
  })), re = d = null;
}, y.__c = function(e, t) {
  t.some(function(_) {
    try {
      _.__h.forEach(J), _.__h = _.__h.filter(function(n) {
        return !n.__ || ae(n);
      });
    } catch (n) {
      t.some(function(r) {
        r.__h && (r.__h = []);
      }), t = [], y.__e(n, _.__v);
    }
  }), Ae && Ae(e, t);
}, y.unmount = function(e) {
  Fe && Fe(e);
  var t, _ = e.__c;
  _ && _.__H && (_.__H.__.forEach(function(n) {
    try {
      J(n);
    } catch (r) {
      t = r;
    }
  }), _.__H = void 0, t && y.__e(t, _.__v));
};
var Ie = typeof requestAnimationFrame == "function";
function jt(e) {
  var t, _ = function() {
    clearTimeout(n), Ie && cancelAnimationFrame(t), setTimeout(e);
  }, n = setTimeout(_, 35);
  Ie && (t = requestAnimationFrame(_));
}
function J(e) {
  var t = d, _ = e.__c;
  typeof _ == "function" && (e.__c = void 0, _()), d = t;
}
function ae(e) {
  var t = d;
  e.__c = e.__(), d = t;
}
function $e(e, t) {
  return !e || e.length !== t.length || t.some(function(_, n) {
    return _ !== e[n];
  });
}
function ft(e, t) {
  return typeof t == "function" ? t(e) : t;
}
function st(e, t) {
  for (var _ in t) e[_] = t[_];
  return e;
}
function fe(e, t) {
  for (var _ in e) if (_ !== "__source" && !(_ in t)) return !0;
  for (var n in t) if (n !== "__source" && e[n] !== t[n]) return !0;
  return !1;
}
function Ce(e, t) {
  var _ = t(), n = q({ t: { __: _, u: t } }), r = n[0].t, o = n[1];
  return A(function() {
    r.__ = _, r.u = t, oe(r) && o({ t: r });
  }, [e, _, t]), _e(function() {
    return oe(r) && o({ t: r }), e(function() {
      oe(r) && o({ t: r });
    });
  }, [e]), _;
}
function oe(e) {
  var t, _, n = e.u, r = e.__;
  try {
    var o = n();
    return !((t = r) === (_ = o) && (t !== 0 || 1 / t == 1 / _) || t != t && _ != _);
  } catch {
    return !0;
  }
}
function Ee(e) {
  e();
}
function Se(e) {
  return e;
}
function xe() {
  return [!1, Ee];
}
var we = A;
function ee(e, t) {
  this.props = e, this.context = t;
}
function pt(e, t) {
  function _(r) {
    var o = this.props.ref, u = o == r.ref;
    return !u && o && (o.call ? o(null) : o.current = null), t ? !t(this.props, r) || !u : fe(this.props, r);
  }
  function n(r) {
    return this.shouldComponentUpdate = _, S(e, r);
  }
  return n.displayName = "Memo(" + (e.displayName || e.name) + ")", n.prototype.isReactComponent = !0, n.__f = !0, n.type = e, n;
}
(ee.prototype = new $()).isPureReactComponent = !0, ee.prototype.shouldComponentUpdate = function(e, t) {
  return fe(this.props, e) || fe(this.state, t);
};
var We = s.__b;
s.__b = function(e) {
  e.type && e.type.__f && e.ref && (e.props.ref = e.ref, e.ref = null), We && We(e);
};
var zt = typeof Symbol < "u" && Symbol.for && Symbol.for("react.forward_ref") || 3911;
function ht(e) {
  function t(_) {
    var n = st({}, _);
    return delete n.ref, e(n, _.ref || null);
  }
  return t.$$typeof = zt, t.render = e, t.prototype.isReactComponent = t.__f = !0, t.displayName = "ForwardRef(" + (e.displayName || e.name) + ")", t;
}
var Ve = function(e, t) {
  return e == null ? null : w(w(e).map(t));
}, dt = { map: Ve, forEach: Ve, count: function(e) {
  return e ? w(e).length : 0;
}, only: function(e) {
  var t = w(e);
  if (t.length !== 1) throw "Children.only";
  return t[0];
}, toArray: w }, qt = s.__e;
s.__e = function(e, t, _, n) {
  if (e.then) {
    for (var r, o = t; o = o.__; ) if ((r = o.__c) && r.__c) return t.__e == null && (t.__e = _.__e, t.__k = _.__k), r.__c(e, t);
  }
  qt(e, t, _, n);
};
var Be = s.unmount;
function vt(e, t, _) {
  return e && (e.__c && e.__c.__H && (e.__c.__H.__.forEach(function(n) {
    typeof n.__c == "function" && n.__c();
  }), e.__c.__H = null), (e = st({}, e)).__c != null && (e.__c.__P === _ && (e.__c.__P = t), e.__c.__e = !0, e.__c = null), e.__k = e.__k && e.__k.map(function(n) {
    return vt(n, t, _);
  })), e;
}
function mt(e, t, _) {
  return e && _ && (e.__v = null, e.__k = e.__k && e.__k.map(function(n) {
    return mt(n, t, _);
  }), e.__c && e.__c.__P === t && (e.__e && _.appendChild(e.__e), e.__c.__e = !0, e.__c.__P = _)), e;
}
function W() {
  this.__u = 0, this.o = null, this.__b = null;
}
function yt(e) {
  var t = e.__.__c;
  return t && t.__a && t.__a(e);
}
function gt(e) {
  var t, _, n;
  function r(o) {
    if (t || (t = e()).then(function(u) {
      _ = u.default || u;
    }, function(u) {
      n = u;
    }), n) throw n;
    if (!_) throw t;
    return S(_, o);
  }
  return r.displayName = "Lazy", r.__f = !0, r;
}
function D() {
  this.i = null, this.l = null;
}
s.unmount = function(e) {
  var t = e.__c;
  t && t.__R && t.__R(), t && 32 & e.__u && (e.type = null), Be && Be(e);
}, (W.prototype = new $()).__c = function(e, t) {
  var _ = t.__c, n = this;
  n.o == null && (n.o = []), n.o.push(_);
  var r = yt(n.__v), o = !1, u = function() {
    o || (o = !0, _.__R = null, r ? r(c) : c());
  };
  _.__R = u;
  var c = function() {
    if (!--n.__u) {
      if (n.state.__a) {
        var a = n.state.__a;
        n.__v.__k[0] = mt(a, a.__c.__P, a.__c.__O);
      }
      var i;
      for (n.setState({ __a: n.__b = null }); i = n.o.pop(); ) i.forceUpdate();
    }
  };
  n.__u++ || 32 & t.__u || n.setState({ __a: n.__b = n.__v.__k[0] }), e.then(u, u);
}, W.prototype.componentWillUnmount = function() {
  this.o = [];
}, W.prototype.render = function(e, t) {
  if (this.__b) {
    if (this.__v.__k) {
      var _ = document.createElement("div"), n = this.__v.__k[0].__c;
      this.__v.__k[0] = vt(this.__b, _, n.__O = n.__P);
    }
    this.__b = null;
  }
  var r = t.__a && S(x, null, e.fallback);
  return r && (r.__u &= -33), [S(x, null, t.__a ? null : e.children), r];
};
var je = function(e, t, _) {
  if (++_[1] === _[0] && e.l.delete(t), e.props.revealOrder && (e.props.revealOrder[0] !== "t" || !e.l.size)) for (_ = e.i; _; ) {
    for (; _.length > 3; ) _.pop()();
    if (_[1] < _[0]) break;
    e.i = _ = _[2];
  }
};
function Gt(e) {
  return this.getChildContext = function() {
    return e.context;
  }, e.children;
}
function Kt(e) {
  var t = this, _ = e.h;
  if (t.componentWillUnmount = function() {
    B(null, t.v), t.v = null, t.h = null;
  }, t.h && t.h !== _ && t.componentWillUnmount(), !t.v) {
    for (var n = t.__v; n !== null && !n.__m && n.__ !== null; ) n = n.__;
    t.h = _, t.v = { nodeType: 1, parentNode: _, childNodes: [], __k: { __m: n.__m }, contains: function() {
      return !0;
    }, insertBefore: function(r, o) {
      this.childNodes.push(r), t.h.insertBefore(r, o);
    }, removeChild: function(r) {
      this.childNodes.splice(this.childNodes.indexOf(r) >>> 1, 1), t.h.removeChild(r);
    } };
  }
  B(S(Gt, { context: t.context }, e.__v), t.v);
}
function bt(e, t) {
  var _ = S(Kt, { __v: e, h: t });
  return _.containerInfo = t, _;
}
(D.prototype = new $()).__a = function(e) {
  var t = this, _ = yt(t.__v), n = t.l.get(e);
  return n[0]++, function(r) {
    var o = function() {
      t.props.revealOrder ? (n.push(r), je(t, e, n)) : r();
    };
    _ ? _(o) : o();
  };
}, D.prototype.render = function(e) {
  this.i = null, this.l = /* @__PURE__ */ new Map();
  var t = w(e.children);
  e.revealOrder && e.revealOrder[0] === "b" && t.reverse();
  for (var _ = t.length; _--; ) this.l.set(t[_], this.i = [1, 0, this.i]);
  return e.children;
}, D.prototype.componentDidUpdate = D.prototype.componentDidMount = function() {
  var e = this;
  this.l.forEach(function(t, _) {
    je(e, _, t);
  });
};
var kt = typeof Symbol < "u" && Symbol.for && Symbol.for("react.element") || 60103, Qt = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/, Yt = /^on(Ani|Tra|Tou|BeforeInp|Compo)/, Zt = /[A-Z0-9]/g, Jt = typeof document < "u", Xt = function(e) {
  return (typeof Symbol < "u" && typeof Symbol() == "symbol" ? /fil|che|rad/ : /fil|che|ra/).test(e);
};
function $t(e, t, _) {
  return t.__k == null && (t.textContent = ""), B(e, t), typeof _ == "function" && _(), e ? e.__c : null;
}
function Ct(e, t, _) {
  return it(e, t), typeof _ == "function" && _(), e ? e.__c : null;
}
$.prototype.isReactComponent = {}, ["componentWillMount", "componentWillReceiveProps", "componentWillUpdate"].forEach(function(e) {
  Object.defineProperty($.prototype, e, { configurable: !0, get: function() {
    return this["UNSAFE_" + e];
  }, set: function(t) {
    Object.defineProperty(this, e, { configurable: !0, writable: !0, value: t });
  } });
});
var ze = s.event;
function e_() {
}
function t_() {
  return this.cancelBubble;
}
function __() {
  return this.defaultPrevented;
}
s.event = function(e) {
  return ze && (e = ze(e)), e.persist = e_, e.isPropagationStopped = t_, e.isDefaultPrevented = __, e.nativeEvent = e;
};
var Ne, n_ = { enumerable: !1, configurable: !0, get: function() {
  return this.class;
} }, qe = s.vnode;
s.vnode = function(e) {
  typeof e.type == "string" && (function(t) {
    var _ = t.props, n = t.type, r = {}, o = n.indexOf("-") === -1;
    for (var u in _) {
      var c = _[u];
      if (!(u === "value" && "defaultValue" in _ && c == null || Jt && u === "children" && n === "noscript" || u === "class" || u === "className")) {
        var a = u.toLowerCase();
        u === "defaultValue" && "value" in _ && _.value == null ? u = "value" : u === "download" && c === !0 ? c = "" : a === "translate" && c === "no" ? c = !1 : a[0] === "o" && a[1] === "n" ? a === "ondoubleclick" ? u = "ondblclick" : a !== "onchange" || n !== "input" && n !== "textarea" || Xt(_.type) ? a === "onfocus" ? u = "onfocusin" : a === "onblur" ? u = "onfocusout" : Yt.test(u) && (u = a) : a = u = "oninput" : o && Qt.test(u) ? u = u.replace(Zt, "-$&").toLowerCase() : c === null && (c = void 0), a === "oninput" && r[u = a] && (u = "oninputCapture"), r[u] = c;
      }
    }
    n == "select" && r.multiple && Array.isArray(r.value) && (r.value = w(_.children).forEach(function(i) {
      i.props.selected = r.value.indexOf(i.props.value) != -1;
    })), n == "select" && r.defaultValue != null && (r.value = w(_.children).forEach(function(i) {
      i.props.selected = r.multiple ? r.defaultValue.indexOf(i.props.value) != -1 : r.defaultValue == i.props.value;
    })), _.class && !_.className ? (r.class = _.class, Object.defineProperty(r, "className", n_)) : (_.className && !_.class || _.class && _.className) && (r.class = r.className = _.className), t.props = r;
  })(e), e.$$typeof = kt, qe && qe(e);
};
var Ge = s.__r;
s.__r = function(e) {
  Ge && Ge(e), Ne = e.__c;
};
var Ke = s.diffed;
s.diffed = function(e) {
  Ke && Ke(e);
  var t = e.props, _ = e.__e;
  _ != null && e.type === "textarea" && "value" in t && t.value !== _.value && (_.value = t.value == null ? "" : t.value), Ne = null;
};
var Et = { ReactCurrentDispatcher: { current: { readContext: function(e) {
  return Ne.__n[e.__c].props.value;
}, useCallback: ye, useContext: ge, useDebugValue: be, useDeferredValue: Se, useEffect: _e, useId: ke, useImperativeHandle: me, useInsertionEffect: we, useLayoutEffect: A, useMemo: G, useReducer: te, useRef: ve, useState: q, useSyncExternalStore: Ce, useTransition: xe } } }, r_ = "18.3.1";
function St(e) {
  return S.bind(null, e);
}
function K(e) {
  return !!e && e.$$typeof === kt;
}
function xt(e) {
  return K(e) && e.type === x;
}
function wt(e) {
  return !!e && !!e.displayName && (typeof e.displayName == "string" || e.displayName instanceof String) && e.displayName.startsWith("Memo(");
}
function Nt(e) {
  return K(e) ? It.apply(null, arguments) : e;
}
function Pt(e) {
  return !!e.__k && (B(null, e), !0);
}
function Rt(e) {
  return e && (e.base || e.nodeType === 1 && e) || null;
}
var Ut = function(e, t) {
  return e(t);
}, Ht = function(e, t) {
  return e(t);
}, Tt = x, Dt = K, o_ = { useState: q, useId: ke, useReducer: te, useEffect: _e, useLayoutEffect: A, useInsertionEffect: we, useTransition: xe, useDeferredValue: Se, useSyncExternalStore: Ce, startTransition: Ee, useRef: ve, useImperativeHandle: me, useMemo: G, useCallback: ye, useContext: ge, useDebugValue: be, version: "18.3.1", Children: dt, render: $t, hydrate: Ct, unmountComponentAtNode: Pt, createPortal: bt, createElement: S, createContext: ct, createFactory: St, cloneElement: Nt, createRef: tt, Fragment: x, isValidElement: K, isElement: Dt, isFragment: xt, isMemo: wt, findDOMNode: Rt, Component: $, PureComponent: ee, memo: pt, forwardRef: ht, flushSync: Ht, unstable_batchedUpdates: Ut, StrictMode: Tt, Suspense: W, SuspenseList: D, lazy: gt, __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: Et };
const l_ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Children: dt,
  Component: $,
  Fragment: x,
  PureComponent: ee,
  StrictMode: Tt,
  Suspense: W,
  SuspenseList: D,
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: Et,
  cloneElement: Nt,
  createContext: ct,
  createElement: S,
  createFactory: St,
  createPortal: bt,
  createRef: tt,
  default: o_,
  findDOMNode: Rt,
  flushSync: Ht,
  forwardRef: ht,
  hydrate: Ct,
  isElement: Dt,
  isFragment: xt,
  isMemo: wt,
  isValidElement: K,
  lazy: gt,
  memo: pt,
  render: $t,
  startTransition: Ee,
  unmountComponentAtNode: Pt,
  unstable_batchedUpdates: Ut,
  useCallback: ye,
  useContext: ge,
  useDebugValue: be,
  useDeferredValue: Se,
  useEffect: _e,
  useErrorBoundary: Vt,
  useId: ke,
  useImperativeHandle: me,
  useInsertionEffect: we,
  useLayoutEffect: A,
  useMemo: G,
  useReducer: te,
  useRef: ve,
  useState: q,
  useSyncExternalStore: Ce,
  useTransition: xe,
  version: r_
}, Symbol.toStringTag, { value: "Module" }));
export {
  ve as A,
  ht as D,
  Ht as E,
  me as F,
  B as G,
  It as K,
  W as P,
  ct as Q,
  o_ as R,
  G as T,
  A as _,
  Nt as a,
  l_ as c,
  q as d,
  x as k,
  ye as q,
  u_ as u,
  ge as x,
  _e as y
};
