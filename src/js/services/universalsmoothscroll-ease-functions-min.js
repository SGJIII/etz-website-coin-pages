const CUSTOM_CUBIC_HERMITE_SPLINE = function (a, b, c, e, h, l) {
    c = void 0 === c ? 0 : c;
    e = void 0 === e ? 500 : e;
    l = void 0 === l ? "CUSTOM_CUBIC_HERMITE_SPLINE" : l;
    if (Array.isArray(a))
      if (Array.isArray(b))
        if (a.length !== b.length)
          DEFAULT_ERROR_LOGGER(
            l,
            "xs and ys to have the same length",
            "xs.length = " + a.length + " and ys.length = " + b.length
          );
        else if (!Number.isFinite(e) || 0 >= e)
          DEFAULT_ERROR_LOGGER(l, "the duration to be a positive number", e);
        else {
          for (var k = !1, r = !1, t = null, q = a.length, d = 0; d < q; d++) {
            if (!Number.isFinite(a[d]) || 0 > a[d] || 1 < a[d]) {
              DEFAULT_ERROR_LOGGER(
                l,
                "xs[" + d + "] to be a number between 0 and 1 (inclusive)",
                a[d]
              );
              return;
            }
            if (!Number.isFinite(b[d]) || 0 > b[d] || 1 < b[d]) {
              DEFAULT_ERROR_LOGGER(
                l,
                "ys[" + d + "] to be a number between 0 and 1 (inclusive)",
                b[d]
              );
              return;
            }
            if (!t || t < a[d]) t = a[d];
            else {
              DEFAULT_ERROR_LOGGER(
                l,
                "the xs array to be sorted",
                a[d].toFixed(2) +
                  " (xs[" +
                  d +
                  "]) after " +
                  a[d - 1].toFixed(2) +
                  " (xs[" +
                  (d - 1) +
                  "])"
              );
              return;
            }
            k || (k = 0 === a[d]);
            r || (r = 1 === a[d]);
          }
          k || (a.unshift(0), b.unshift(0));
          r || (a.push(1), b.push(1));
          var u = "function" === typeof h ? h : function () {},
            m = 1 - c,
            w = a.length - 1,
            v = Math.round(w / 2);
          return function (f, g, p, x, z, y, A) {
            u(f, g, p, x, z, y, A);
            p = (p - g) / e;
            if (0 >= p) var n = 0;
            else if (1 <= p) n = x;
            else {
              z = 0;
              y = w;
              g = v;
              do {
                if (p >= a[g] && p <= a[g + 1]) {
                  n = (p - a[g]) / (a[g + 1] - a[g]);
                  break;
                }
                a[g] > p
                  ? ((y = g), (g = Math.floor((z + g) / 2)))
                  : ((z = g), (g = Math.floor((y + g) / 2)));
              } while (z !== y);
              p = b[g];
              z = b[g + 1];
              y = a[g];
              A = a[g + 1];
              n =
                ((2 * n * n * n - 3 * n * n + 1) * p +
                  ((m * (z - (b[g - 1] || b[0]))) / (A - (a[g - 1] || a[0]))) *
                    (A - y) *
                    (n * n * n - 2 * n * n + n) +
                  (-2 * n * n * n + 3 * n * n) * z +
                  ((m * ((b[g + 2] || b[w]) - p)) / ((a[g + 2] || a[w]) - y)) *
                    (A - y) *
                    (n * n * n - n * n)) *
                (x - 1);
            }
            return Math.ceil(f - x + n);
          };
        }
      else DEFAULT_ERROR_LOGGER(l, "ys to be an array", b);
    else DEFAULT_ERROR_LOGGER(l, "xs to be an array", a);
  },
  CUSTOM_BEZIER_CURVE = function (a, b, c, e, h) {
    function l(v) {
      for (var f = 1, g = 1; g <= v; g++) f *= g;
      return f;
    }
    function k(v, f) {
      for (var g = 0, p = 0; p <= m; p++)
        g +=
          (w / (l(p) * l(m - p))) *
          v[p] *
          Math.pow(1 - f, m - p) *
          Math.pow(f, p);
      return g;
    }
    c = void 0 === c ? 500 : c;
    h = void 0 === h ? "CUSTOM_BEZIER_CURVE" : h;
    if (Array.isArray(a))
      if (Array.isArray(b))
        if (a.length !== b.length)
          DEFAULT_ERROR_LOGGER(
            h,
            "xs and ys to have the same length",
            "xs.length = " + a.length + " and ys.length = " + b.length
          );
        else if (!Number.isFinite(c) || 0 >= c)
          DEFAULT_ERROR_LOGGER(h, "the duration to be a positive number", c);
        else {
          for (var r = !1, t = !1, q = a.length, d = 0; d < q; d++) {
            if (!Number.isFinite(a[d]) || 0 > a[d] || 1 < a[d]) {
              DEFAULT_ERROR_LOGGER(
                h,
                "xs[" + d + "] to be a number between 0 and 1 (inclusive)",
                a[d]
              );
              return;
            }
            if (!Number.isFinite(b[d]) || 0 > b[d] || 1 < b[d]) {
              DEFAULT_ERROR_LOGGER(
                h,
                "ys[" + d + "] to be a number between 0 and 1 (inclusive)",
                b[d]
              );
              return;
            }
            r || (r = 0 === a[d]);
            t || (t = 1 === a[d]);
          }
          r || (a.unshift(0), b.unshift(0));
          t || (a.push(1), b.push(1));
          var u = "function" === typeof e ? e : function () {},
            m = a.length - 1,
            w = l(m);
          return function (v, f, g, p, x, z, y) {
            u(v, f, g, p, x, z, y);
            f = (g - f) / c;
            if (0 >= f) f = 0;
            else if (1 <= f) f = p;
            else {
              y = f;
              do {
                x = g = y;
                z = k(a, y) - f;
                for (var A = 0, n = 0; n <= m; n++)
                  A +=
                    (w / (l(n) * l(m - n))) *
                    a[n] *
                    Math.pow(1 - y, m - n - 1) *
                    Math.pow(y, n - 1) *
                    (n - m * y);
                y = x - z / A;
              } while (0.001 < Math.abs(y - g));
              f = k(b, y) * (p - 1);
            }
            return Math.ceil(v - p + f);
          };
        }
      else DEFAULT_ERROR_LOGGER(h, "ys to be an array", b);
    else DEFAULT_ERROR_LOGGER(h, "xs to be an array", a);
  },
  CUSTOM_CUBIC_BEZIER = function (a, b, c, e, h, l, k) {
    a = void 0 === a ? 0 : a;
    b = void 0 === b ? 0 : b;
    c = void 0 === c ? 1 : c;
    e = void 0 === e ? 1 : e;
    h = void 0 === h ? 500 : h;
    k = void 0 === k ? "CUSTOM_CUBIC_BEZIER" : k;
    if (!Number.isFinite(h) || 0 >= h)
      DEFAULT_ERROR_LOGGER(k, "the duration to be a positive number", h);
    else if (!Number.isFinite(a) || 0 > a || 1 < a)
      DEFAULT_ERROR_LOGGER(
        k,
        "x1 to be a number between 0 and 1 (inclusive)",
        a
      );
    else if (!Number.isFinite(b) || 0 > b || 1 < b)
      DEFAULT_ERROR_LOGGER(
        k,
        "y1 to be a number between 0 and 1 (inclusive)",
        b
      );
    else if (!Number.isFinite(c) || 0 > c || 1 < c)
      DEFAULT_ERROR_LOGGER(
        k,
        "x2 to be a number between 0 and 1 (inclusive)",
        c
      );
    else if (!Number.isFinite(e) || 0 > e || 1 < e)
      DEFAULT_ERROR_LOGGER(
        k,
        "y2 to be a number between 0 and 1 (inclusive)",
        e
      );
    else {
      var r = "function" === typeof l ? l : function () {},
        t = 1 + 3 * (a - c),
        q = 1 + 3 * (b - e),
        d = 3 * (c - 2 * a),
        u = 3 * (e - 2 * b),
        m = 3 * a,
        w = 3 * b;
      return function (v, f, g, p, x, z, y) {
        r(v, f, g, p, x, z, y);
        f = (g - f) / h;
        if (0 >= f) f = 0;
        else if (1 <= f) f = p;
        else {
          x = f;
          do
            (g = x),
              (x -=
                (x * (m + x * (d + x * t)) - f) /
                (m + x * (2 * d + 3 * t * x)));
          while (0.001 < Math.abs(x - g));
          f = x * (w + x * (u + x * q)) * (p - 1);
        }
        return Math.ceil(v - p + f);
      };
    }
  },
  EASE_LINEAR = function (a, b) {
    return CUSTOM_CUBIC_BEZIER(0, 0, 1, 1, a, b, "EASE_LINEAR");
  },
  EASE_IN_SINE = function (a, b) {
    return CUSTOM_CUBIC_BEZIER(0.12, 0, 0.39, 0, a, b, "EASE_IN_SINE");
  },
  EASE_IN_QUAD = function (a, b) {
    return CUSTOM_CUBIC_BEZIER(0.11, 0, 0.5, 0, a, b, "EASE_IN_QUAD");
  },
  EASE_IN_CUBIC = function (a, b) {
    return CUSTOM_CUBIC_BEZIER(0.32, 0, 0.67, 0, a, b, "EASE_IN_CUBIC");
  },
  EASE_IN_QUART = function (a, b) {
    return CUSTOM_CUBIC_BEZIER(0.5, 0, 0.75, 0, a, b, "EASE_IN_QUART");
  },
  EASE_IN_QUINT = function (a, b) {
    return CUSTOM_CUBIC_BEZIER(0.64, 0, 0.78, 0, a, b, "EASE_IN_QUINT");
  },
  EASE_IN_EXPO = function (a, b) {
    return CUSTOM_CUBIC_BEZIER(0.7, 0, 0.84, 0, a, b, "EASE_IN_EXPO");
  },
  EASE_IN_CIRC = function (a, b) {
    return CUSTOM_CUBIC_BEZIER(0.55, 0, 1, 0.45, a, b, "EASE_IN_CIRC");
  },
  EASE_OUT_SINE = function (a, b) {
    return CUSTOM_CUBIC_BEZIER(0.61, 1, 0.88, 1, a, b, "EASE_OUT_SINE");
  },
  EASE_OUT_QUAD = function (a, b) {
    return CUSTOM_CUBIC_BEZIER(0.5, 1, 0.89, 1, a, b, "EASE_OUT_QUAD");
  },
  EASE_OUT_CUBIC = function (a, b) {
    return CUSTOM_CUBIC_BEZIER(0.33, 1, 0.68, 1, a, b, "EASE_OUT_CUBIC");
  },
  EASE_OUT_QUART = function (a, b) {
    return CUSTOM_CUBIC_BEZIER(0.25, 1, 0.5, 1, a, b, "EASE_OUT_QUART");
  },
  EASE_OUT_QUINT = function (a, b) {
    return CUSTOM_CUBIC_BEZIER(0.22, 1, 0.36, 1, a, b, "EASE_OUT_QUINT");
  },
  EASE_OUT_EXPO = function (a, b) {
    return CUSTOM_CUBIC_BEZIER(0.16, 1, 0.3, 1, a, b, "EASE_OUT_EXPO");
  },
  EASE_OUT_CIRC = function (a, b) {
    return CUSTOM_CUBIC_BEZIER(0, 0.55, 0.45, 1, a, b, "EASE_OUT_CIRC");
  },
  EASE_IN_OUT_SINE = function (a, b) {
    return CUSTOM_CUBIC_BEZIER(0.37, 0, 0.63, 1, a, b, "EASE_IN_OUT_SINE");
  },
  EASE_IN_OUT_QUAD = function (a, b) {
    return CUSTOM_CUBIC_BEZIER(0.45, 0, 0.55, 1, a, b, "EASE_IN_OUT_QUAD");
  },
  EASE_IN_OUT_CUBIC = function (a, b) {
    return CUSTOM_CUBIC_BEZIER(0.65, 0, 0.35, 1, a, b, "EASE_IN_OUT_CUBIC");
  },
  EASE_IN_OUT_QUART = function (a, b) {
    return CUSTOM_CUBIC_BEZIER(0.76, 0, 0.24, 1, a, b, "EASE_IN_OUT_QUART");
  },
  EASE_IN_OUT_QUINT = function (a, b) {
    return CUSTOM_CUBIC_BEZIER(0.83, 0, 0.17, 1, a, b, "EASE_IN_OUT_QUINT");
  },
  EASE_IN_OUT_EXPO = function (a, b) {
    return CUSTOM_CUBIC_BEZIER(0.87, 0, 0.13, 1, a, b, "EASE_IN_OUT_EXPO");
  },
  EASE_IN_OUT_CIRC = function (a, b) {
    return CUSTOM_CUBIC_BEZIER(0.85, 0, 0.15, 1, a, b, "EASE_IN_OUT_CIRC");
  },
  _CUSTOM_BOUNCE = function (a, b, c, e, h) {
    var l = 1 / h,
      k = 0.5 * l,
      r = 0.001 * k,
      t = function (p) {
        return 1 - Math.pow(1 - p, 1.6);
      },
      q = 5 * (h - 1) + 11,
      d = 0,
      u;
    if (1 !== e) d = 10 + 5 * (e - 1);
    else {
      var m = (l - r) / 10,
        w = l - 2 * r;
      for (u = 0; u < w; u += m)
        c(a, t(u), d, q), c(b, Math.pow(u * h, 2), d, q), d++;
    }
    for (u = e; u < h; u++) {
      e = l * u;
      m = t(e);
      w = 0.005 * m + 0.995;
      var v = t(e + k),
        f = 0.6 < v ? 0.35 * v + 0.64 : 1 - (1 - v) * (1 - v),
        g = 0.65 * f + 0.35 * w;
      c(a, m, d, q);
      c(a, t(e + r), d + 1, q);
      c(a, t(e + 0.35 * k), d + 2, q);
      c(a, v, d + 3, q);
      c(a, t(e + 1.65 * k), d + 4, q);
      c(b, w, d, q);
      c(b, w, d + 1, q);
      c(b, g, d + 2, q);
      c(b, f, d + 3, q);
      c(b, g, d + 4, q);
      d += 5;
    }
    c(a, 1, d, q);
    c(b, 1, d, q);
  },
  EASE_IN_BOUNCE = function (a, b, c) {
    a = void 0 === a ? 900 : a;
    c = void 0 === c ? 3 : c;
    if (!Number.isFinite(c) || 0 >= c)
      DEFAULT_ERROR_LOGGER(
        "EASE_IN_BOUNCE",
        "bouncesNumber to be a positive number",
        c
      );
    else {
      var e = [],
        h = [];
      _CUSTOM_BOUNCE(
        e,
        h,
        function (l, k, r, t) {
          return (l[t - r - 1] = 1 - k);
        },
        1,
        c + 1
      );
      return CUSTOM_CUBIC_HERMITE_SPLINE(e, h, 0, a, b, "EASE_IN_BOUNCE");
    }
  },
  EASE_OUT_BOUNCE = function (a, b, c) {
    a = void 0 === a ? 900 : a;
    c = void 0 === c ? 3 : c;
    if (!Number.isFinite(c) || 0 >= c)
      DEFAULT_ERROR_LOGGER(
        "EASE_OUT_BOUNCE",
        "bouncesNumber to be a positive number",
        c
      );
    else {
      var e = [],
        h = [];
      _CUSTOM_BOUNCE(
        e,
        h,
        function (l, k, r) {
          return (l[r] = k);
        },
        1,
        c + 1
      );
      return CUSTOM_CUBIC_HERMITE_SPLINE(e, h, 0, a, b, "EASE_OUT_BOUNCE");
    }
  },
  EASE_IN_OUT_BOUNCE = function (a, b, c) {
    a = void 0 === a ? 1200 : a;
    c = void 0 === c ? 6 : c;
    if (!Number.isFinite(c) || 1 >= c)
      DEFAULT_ERROR_LOGGER(
        "EASE_IN_OUT_BOUNCE",
        "bouncesNumber to be a number >= 2",
        c
      );
    else {
      if (2 === c)
        return CUSTOM_CUBIC_HERMITE_SPLINE(
          [
            0, 0.04, 0.14, 0.24, 0.3, 0.3001, 0.4, 0.6, 0.7, 0.7001, 0.76, 0.86,
            0.96, 1,
          ],
          [
            0, 0.07, 0.13, 0.07, 1e-4, 1e-4, 0.46, 0.64, 0.9999, 0.9999, 0.93,
            0.87, 0.93, 1,
          ],
          0,
          a,
          b,
          "EASE_IN_OUT_BOUNCE"
        );
      var e = [],
        h = [],
        l = Math.max(Math.floor(0.5 * c), 2);
      _CUSTOM_BOUNCE(
        e,
        h,
        function (k, r, t, q) {
          return (k[q - t - 1] = 1 - r);
        },
        Math.max(Math.floor(0.5 * (c - 1)), 1),
        c
      );
      _CUSTOM_BOUNCE(
        e,
        h,
        function (k, r, t) {
          return (k[t - 2] = r);
        },
        l,
        c
      );
      c = 10 + 5 * (l - 1) - 3;
      e[c - 1] = 0.75 * e[c] + 0.25 * e[c + 1];
      e[c] = 0.25 * e[c] + 0.75 * e[c + 1];
      h[c - 1] = 0.47;
      h[c] = 0.63;
      e.pop();
      e.pop();
      h.pop();
      h.pop();
      return CUSTOM_CUBIC_HERMITE_SPLINE(e, h, 0, a, b, "EASE_IN_OUT_BOUNCE");
    }
  },
  EASE_ELASTIC_X = function (a, b, c, e) {
    function h(q, d, u, m) {
      r = a;
      "number" === typeof m[0] &&
        (clearTimeout(t),
        (k = "function" === typeof m[10] ? m[10] : function () {}),
        (l = function () {
          t = setTimeout(function () {
            var w = uss.getScrollXCalculator(u)(),
              v = m[4],
              f = c(q, d, w, v, u);
            Number.isFinite(f)
              ? 0 === f
                ? k()
                : (0 < f && (r = b), uss.scrollXTo(w - f * v, u, k))
              : (DEFAULT_WARNING_LOGGER(f, "is not a valid elastic amount"),
                k());
          }, e);
        }),
        (m[10] = l));
    }
    c =
      void 0 === c
        ? function () {
            return 50;
          }
        : c;
    e = void 0 === e ? 0 : e;
    if ("function" !== typeof a)
      DEFAULT_ERROR_LOGGER(
        "EASE_ELASTIC_X",
        "the forwardEasing to be a function",
        a
      );
    else if ("function" !== typeof b)
      DEFAULT_ERROR_LOGGER(
        "EASE_ELASTIC_X",
        "the backwardEasing to be a function",
        b
      );
    else if ("function" !== typeof c)
      DEFAULT_ERROR_LOGGER(
        "EASE_ELASTIC_X",
        "the elasticPointCalculator to be a function",
        c
      );
    else {
      if (Number.isFinite(e)) {
        var l = null,
          k = null,
          r,
          t;
        return function (q, d, u, m, w, v, f) {
          var g = uss._containersData.get(f) || [];
          g[10] !== k && g[10] !== l && h(d, u, f, g);
          return r(q, d, u, m, w, v, f);
        };
      }
      DEFAULT_ERROR_LOGGER(
        "EASE_ELASTIC_X",
        "the debounceTime to be a number",
        e
      );
    }
  },
  EASE_ELASTIC_Y = function (a, b, c, e) {
    function h(q, d, u, m) {
      r = a;
      "number" === typeof m[1] &&
        (clearTimeout(t),
        (k = "function" === typeof m[11] ? m[11] : function () {}),
        (l = function () {
          t = setTimeout(function () {
            var w = uss.getScrollYCalculator(u)(),
              v = m[5],
              f = c(q, d, w, v, u);
            Number.isFinite(f)
              ? 0 === f
                ? k()
                : (0 < f && (r = b), uss.scrollYTo(w - f * v, u, k))
              : (DEFAULT_WARNING_LOGGER(f, "is not a valid elastic amount"),
                k());
          }, e);
        }),
        (m[11] = l));
    }
    c =
      void 0 === c
        ? function () {
            return 50;
          }
        : c;
    e = void 0 === e ? 0 : e;
    if ("function" !== typeof a)
      DEFAULT_ERROR_LOGGER(
        "EASE_ELASTIC_Y",
        "the forwardEasing to be a function",
        a
      );
    else if ("function" !== typeof b)
      DEFAULT_ERROR_LOGGER(
        "EASE_ELASTIC_Y",
        "the backwardEasing to be a function",
        b
      );
    else if ("function" !== typeof c)
      DEFAULT_ERROR_LOGGER(
        "EASE_ELASTIC_Y",
        "the elasticPointCalculator to be a function",
        c
      );
    else {
      if (Number.isFinite(e)) {
        var l = null,
          k = null,
          r,
          t;
        return function (q, d, u, m, w, v, f) {
          var g = uss._containersData.get(f) || [];
          g[11] !== k && g[11] !== l && h(d, u, f, g);
          return r(q, d, u, m, w, v, f);
        };
      }
      DEFAULT_ERROR_LOGGER(
        "EASE_ELASTIC_Y",
        "the debounceTime to be a number",
        e
      );
    }
  };
