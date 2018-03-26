var gapi = window.gapi = window.gapi || {};
gapi._bs = (new Date).getTime(),
    function() {
        var m = this,
            aa = function(e, t, n) { return e.call.apply(e.bind, arguments) },
            ba = function(e, t, n) { if (!e) throw Error(); if (2 < arguments.length) { var r = Array.prototype.slice.call(arguments, 2); return function() { var n = Array.prototype.slice.call(arguments); return Array.prototype.unshift.apply(n, r), e.apply(t, n) } } return function() { return e.apply(t, arguments) } },
            ca = function(e, t, n) { return (ca = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? aa : ba).apply(null, arguments) },
            da = function(e, t) {
                function n() {}
                n.prototype = t.prototype, e.ea = t.prototype, e.prototype = new n, e.prototype.constructor = e, e.w = function(e, n, r) { for (var o = Array(arguments.length - 2), i = 2; i < arguments.length; i++) o[i - 2] = arguments[i]; return t.prototype[n].apply(e, o) }
            },
            p = window,
            t = document,
            ea = p.location,
            fa = function() {},
            ha = /\[native code\]/,
            v = function(e, t, n) { return e[t] = e[t] || n },
            ia = function(e) {
                for (var t = 0; t < this.length; t++)
                    if (this[t] === e) return t;
                return -1
            },
            ja = function(e) {
                e = e.sort();
                for (var t = [], n = void 0, r = 0; r < e.length; r++) {
                    var o = e[r];
                    o != n && t.push(o), n = o
                }
                return t
            },
            ka = /&/g,
            la = /</g,
            ma = />/g,
            na = /"/g,
            oa = /'/g,
            pa = function(e) { return String(e).replace(ka, "&amp;").replace(la, "&lt;").replace(ma, "&gt;").replace(na, "&quot;").replace(oa, "&#39;") },
            w = function() {
                var e;
                if ((e = Object.create) && ha.test(e)) e = e(null);
                else { e = {}; for (var t in e) e[t] = void 0 }
                return e
            },
            x = function(e, t) { return Object.prototype.hasOwnProperty.call(e, t) },
            qa = function(e) { if (ha.test(Object.keys)) return Object.keys(e); var t, n = []; for (t in e) x(e, t) && n.push(t); return n },
            z = function(e, t) { e = e || {}; for (var n in e) x(e, n) && (t[n] = e[n]) },
            ra = function(e) { return function() { p.setTimeout(e, 0) } },
            A = function(e, t) { if (!e) throw Error(t || "") },
            B = v(p, "gapi", {}),
            C = function(e, t, n) {
                var r = new RegExp("([#].*&|[#])" + t + "=([^&#]*)", "g");
                if (t = new RegExp("([?#].*&|[?#])" + t + "=([^&#]*)", "g"), e = e && (r.exec(e) || t.exec(e))) try { n = decodeURIComponent(e[2]) } catch (e) {}
                return n
            },
            sa = new RegExp(/^/.source + /([a-zA-Z][-+.a-zA-Z0-9]*:)?/.source + /(\/\/[^\/?#]*)?/.source + /([^?#]*)?/.source + /(\?([^#]*))?/.source + /(#((#|[^#])*))?/.source + /$/.source),
            ta = /[\ud800-\udbff][\udc00-\udfff]|[^!-~]/g,
            ua = new RegExp(/(%([^0-9a-fA-F%]|[0-9a-fA-F]([^0-9a-fA-F%])?)?)*/.source + /%($|[^0-9a-fA-F]|[0-9a-fA-F]($|[^0-9a-fA-F]))/.source, "g"),
            va = /%([a-f]|[0-9a-fA-F][a-f])/g,
            wa = /^(https?|ftp|file|chrome-extension):$/i,
            D = function(e) {
                e = (e = (e = String(e)).replace(ta, function(e) { try { return encodeURIComponent(e) } catch (t) { return encodeURIComponent(e.replace(/^[^%]+$/g, "�")) } }).replace(ua, function(e) { return e.replace(/%/g, "%25") }).replace(va, function(e) { return e.toUpperCase() })).match(sa) || [];
                var t = w(),
                    n = function(e) { return e.replace(/\\/g, "%5C").replace(/\^/g, "%5E").replace(/`/g, "%60").replace(/\{/g, "%7B").replace(/\|/g, "%7C").replace(/\}/g, "%7D") },
                    r = !!(e[1] || "").match(wa);
                return t.w = n((e[1] || "") + (e[2] || "") + (e[3] || (e[2] && r ? "/" : ""))), r = function(e) { return n(e.replace(/\?/g, "%3F").replace(/#/g, "%23")) }, t.query = e[5] ? [r(e[5])] : [], t.g = e[7] ? [r(e[7])] : [], t
            },
            xa = function(e) { return e.w + (0 < e.query.length ? "?" + e.query.join("&") : "") + (0 < e.g.length ? "#" + e.g.join("&") : "") },
            ya = function(e, t) {
                var n = [];
                if (e)
                    for (var r in e)
                        if (x(e, r) && null != e[r]) {
                            var o = t ? t(e[r]) : e[r];
                            n.push(encodeURIComponent(r) + "=" + encodeURIComponent(o))
                        }
                return n
            },
            za = function(e, t, n, r) { return (e = D(e)).query.push.apply(e.query, ya(t, r)), e.g.push.apply(e.g, ya(n, r)), xa(e) },
            Ba = new RegExp(/\/?\??#?/.source + "(" + /[\/?#]/i.source + "|" + /[\uD800-\uDBFF]/i.source + "|" + /%[c-f][0-9a-f](%[89ab][0-9a-f]){0,2}(%[89ab]?)?/i.source + "|" + /%[0-9a-f]?/i.source + ")$", "i"),
            Ca = function(e, t) {
                var n = D(t);
                t = n.w, n.query.length && (t += "?" + n.query.join("")), n.g.length && (t += "#" + n.g.join(""));
                var r = "";
                2e3 < t.length && (n = t, t = (t = t.substr(0, 2e3)).replace(Ba, ""), r = n.substr(t.length));
                var o = e.createElement("div");
                return e = e.createElement("a"), t = (n = D(t)).w, n.query.length && (t += "?" + n.query.join("")), n.g.length && (t += "#" + n.g.join("")), e.href = t, o.appendChild(e), o.innerHTML = o.innerHTML, t = String(o.firstChild.href), o.parentNode && o.parentNode.removeChild(o), t = (n = D(t + r)).w, n.query.length && (t += "?" + n.query.join("")), n.g.length && (t += "#" + n.g.join("")), t
            },
            Da = /^https?:\/\/[^\/%\\?#\s]+\/[^\s]*$/i,
            Ea = function(e, t, n, r) { p[n + "EventListener"] ? p[n + "EventListener"](e, t, !1) : p[r + "tachEvent"] && p[r + "tachEvent"]("on" + e, t) },
            Fa = function() { var e = t.readyState; return "complete" === e || "interactive" === e && -1 == navigator.userAgent.indexOf("MSIE") },
            Ia = function(e) {
                var t = Ga;
                if (!Fa()) try { t() } catch (e) {}
                Ha(e)
            },
            Ha = function(e) {
                if (Fa()) e();
                else {
                    var t = !1,
                        n = function() { if (!t) return t = !0, e.apply(this, arguments) };
                    p.addEventListener ? (p.addEventListener("load", n, !1), p.addEventListener("DOMContentLoaded", n, !1)) : p.attachEvent && (p.attachEvent("onreadystatechange", function() { Fa() && n.apply(this, arguments) }), p.attachEvent("onload", n))
                }
            },
            Ja = function(e) { for (; e.firstChild;) e.removeChild(e.firstChild) },
            Ka = { button: !0, div: !0, span: !0 },
            F;
        F = v(p, "___jsl", w()), v(F, "I", 0), v(F, "hel", 10);
        var La = function(e) { return F.dpo ? F.h : C(e, "jsh", F.h) },
            Ma = function(e) {
                var t = v(F, "sws", []);
                t.push.apply(t, e)
            },
            Na = function(e) { return v(F, "watt", w())[e] },
            Oa = function(e) {
                var t = v(F, "PQ", []);
                F.PQ = [];
                var n = t.length;
                if (0 === n) e();
                else
                    for (var r = 0, o = function() {++r === n && e() }, i = 0; i < n; i++) t[i](o)
            },
            Pa = function(e) { return v(v(F, "H", w()), e, w()) },
            Qa = v(F, "perf", w()),
            Ra = v(Qa, "g", w()),
            Sa = v(Qa, "i", w());
        v(Qa, "r", []), w(), w();
        var Ta = function(e, t, n) { var r = Qa.r; "function" == typeof r ? r(e, t, n) : r.push([e, t, n]) },
            G = function(e, t, n) { Ra[e] = !t && Ra[e] || n || (new Date).getTime(), Ta(e) },
            Va = function(e, t, n) { t && 0 < t.length && (t = Ua(t), n && 0 < n.length && (t += "___" + Ua(n)), 28 < t.length && (t = t.substr(0, 28) + (t.length - 28)), n = t, t = v(Sa, "_p", w()), v(t, n, w())[e] = (new Date).getTime(), Ta(e, "_p", n)) },
            Ua = function(e) { return e.join("__").replace(/\./g, "_").replace(/\-/g, "_").replace(/,/g, "_") },
            Wa = w(),
            H = [],
            J = function(e) { throw Error("Bad hint" + (e ? ": " + e : "")) };
        H.push(["jsl", function(e) {
            for (var t in e)
                if (x(e, t)) { var n = e[t]; "object" == typeof n ? F[t] = v(F, t, []).concat(n) : v(F, t, n) }(t = e.u) && ((e = v(F, "us", [])).push(t), (t = /^https:(.*)$/.exec(t)) && e.push("http:" + t[1]))
        }]);
        var Xa = /^(\/[a-zA-Z0-9_\-]+)+$/,
            Ya = [/\/amp\//, /\/amp$/, /^\/amp$/],
            Za = /^[a-zA-Z0-9\-_\.,!]+$/,
            $a = /^gapi\.loaded_[0-9]+$/,
            ab = /^[a-zA-Z0-9,._-]+$/,
            eb = function(e, t, n, r) {
                var o = e.split(";"),
                    i = o.shift(),
                    a = Wa[i],
                    s = null;
                return a ? s = a(o, t, n, r) : J("no hint processor for: " + i), s || J("failed to generate load url"), n = (t = s).match(bb), (r = t.match(cb)) && 1 === r.length && db.test(t) && n && 1 === n.length || J("failed sanity: " + e), s
            },
            hb = function(e, t, n, r) { e = fb(e), $a.test(n) || J("invalid_callback"), t = gb(t), r = r && r.length ? gb(r) : null; var o = function(e) { return encodeURIComponent(e).replace(/%2C/g, ",") }; return [encodeURIComponent(e.pathPrefix).replace(/%2C/g, ",").replace(/%2F/g, "/"), "/k=", o(e.version), "/m=", o(t), r ? "/exm=" + o(r) : "", "/rt=j/sv=1/d=1/ed=1", e.L ? "/am=" + o(e.L) : "", e.T ? "/rs=" + o(e.T) : "", e.V ? "/t=" + o(e.V) : "", "/cb=", o(n)].join("") },
            fb = function(e) {
                "/" !== e.charAt(0) && J("relative path");
                for (var t = e.substring(1).split("/"), n = []; t.length;) {
                    if ((e = t.shift()).length && 0 != e.indexOf(".")) { if (0 < e.indexOf("=")) { t.unshift(e); break } } else J("empty/relative directory");
                    n.push(e)
                }
                e = {};
                for (var r = 0, o = t.length; r < o; ++r) {
                    var i = t[r].split("="),
                        a = decodeURIComponent(i[0]),
                        s = decodeURIComponent(i[1]);
                    2 == i.length && a && s && (e[a] = e[a] || s)
                }
                for (t = "/" + n.join("/"), Xa.test(t) || J("invalid_prefix"), n = 0, r = Ya.length; n < r; ++n) Ya[n].test(t) && J("invalid_prefix");
                return { pathPrefix: t, version: n = ib(e, "k", !0), L: r = ib(e, "am"), T: o = ib(e, "rs"), V: e = ib(e, "t") }
            },
            gb = function(e) {
                for (var t = [], n = 0, r = e.length; n < r; ++n) {
                    var o = e[n].replace(/\./g, "_").replace(/-/g, "_");
                    ab.test(o) && t.push(o)
                }
                return t.join(",")
            },
            ib = function(e, t, n) {
                if (!(e = e[t]) && n && J("missing: " + t), e) {
                    if (Za.test(e)) return e;
                    J("invalid: " + t)
                }
                return null
            },
            db = /^https?:\/\/[a-z0-9_.-]+\.google(rs)?\.com(:\d+)?\/[a-zA-Z0-9_.,!=\-\/]+$/,
            cb = /\/cb=/g,
            bb = /\/\//g,
            jb = function() { var e = La(ea.href); if (!e) throw Error("Bad hint"); return e };
        Wa.m = function(e, t, n, r) { return (e = e[0]) || J("missing_hint"), "https://apis.google.com" + hb(e, t, n, r) };
        var K = decodeURI("%73cript"),
            kb = /^[-+_0-9\/A-Za-z]+={0,2}$/,
            lb = function(e, t) {
                for (var n = [], r = 0; r < e.length; ++r) {
                    var o = e[r];
                    o && 0 > ia.call(t, o) && n.push(o)
                }
                return n
            },
            mb = function() { var e = F.nonce; if (void 0 !== e) return e && e === String(e) && e.match(kb) ? e : F.nonce = null; var n = v(F, "us", []); if (!n || !n.length) return F.nonce = null; for (var r = t.getElementsByTagName(K), o = 0, i = r.length; o < i; ++o) { var a = r[o]; if (a.src && (e = String(a.nonce || a.getAttribute("nonce") || "") || null)) { for (var s = 0, c = n.length; s < c && n[s] !== a.src; ++s); if (s !== c && e && e === String(e) && e.match(kb)) return F.nonce = e } } return null },
            ob = function(e) {
                if ("loading" != t.readyState) nb(e);
                else {
                    var n = mb(),
                        r = "";
                    null !== n && (r = ' nonce="' + n + '"'), t.write("<" + K + ' src="' + encodeURI(e) + '"' + r + "></" + K + ">")
                }
            },
            nb = function(e) {
                var n = t.createElement(K);
                n.setAttribute("src", e), null !== (e = mb()) && n.setAttribute("nonce", e), n.async = "true", (e = t.getElementsByTagName(K)[0]) ? e.parentNode.insertBefore(n, e) : (t.head || t.body || t.documentElement).appendChild(n)
            },
            pb = function(e, t) {
                var n = t && t._c;
                if (n)
                    for (var r = 0; r < H.length; r++) {
                        var o = H[r][0],
                            i = H[r][1];
                        i && x(n, o) && i(n[o], e, t)
                    }
            },
            rb = function(e, t, n) {
                qb(function() {
                    var n = t === La(ea.href) ? v(B, "_", w()) : w();
                    n = v(Pa(t), "_", n), e(n)
                }, n)
            },
            L = function(e, t) {
                var n = t || {};
                "function" == typeof t && ((n = {}).callback = t), pb(e, n), t = e ? e.split(":") : [];
                var r = n.h || jb(),
                    o = v(F, "ah", w());
                if (o["::"] && t.length) {
                    e = [];
                    for (var i = null; i = t.shift();) {
                        var a = i.split(".");
                        a = o[i] || o[a[1] && "ns:" + a[0] || ""] || r;
                        var s = e.length && e[e.length - 1] || null,
                            c = s;
                        s && s.hint == a || (c = { hint: a, O: [] }, e.push(c)), c.O.push(i)
                    }
                    var l = e.length;
                    if (1 < l) {
                        var u = n.callback;
                        u && (n.callback = function() { 0 == --l && u() })
                    }
                    for (; t = e.shift();) sb(t.O, n, t.hint)
                } else sb(t || [], n, r)
            },
            sb = function(e, t, n) {
                e = ja(e) || [];
                var r = t.callback,
                    o = t.config,
                    i = t.timeout,
                    a = t.ontimeout,
                    s = t.onerror,
                    c = void 0;
                "function" == typeof s && (c = s);
                var l = null,
                    u = !1;
                if (i && !a || !i && a) throw "Timeout requires both the timeout parameter and ontimeout parameter to be set";
                s = v(Pa(n), "r", []).sort();
                var d = v(Pa(n), "L", []).sort(),
                    f = [].concat(s),
                    g = function(e, t) {
                        if (u) return 0;
                        p.clearTimeout(l), d.push.apply(d, h);
                        var r = ((B || {}).config || {}).update;
                        if (r ? r(o) : o && v(F, "cu", []).push(o), t) { Va("me0", e, f); try { rb(t, n, c) } finally { Va("me1", e, f) } }
                        return 1
                    };
                0 < i && (l = p.setTimeout(function() { u = !0, a() }, i));
                var h = lb(e, d);
                if (h.length) {
                    h = lb(e, s);
                    var b = v(F, "CP", []),
                        m = b.length;
                    if (b[m] = function(e) {
                            if (!e) return 0;
                            Va("ml1", h, f);
                            var t = function(t) { b[m] = null, g(h, e) && Oa(function() { r && r(), t() }) },
                                n = function() {
                                    var e = b[m + 1];
                                    e && e()
                                };
                            0 < m && b[m - 1] ? b[m] = function() { t(n) } : t(n)
                        }, h.length) {
                        var w = "loaded_" + F.I++;
                        B[w] = function(e) { b[m](e), B[w] = null }, e = eb(n, h, "gapi." + w, s), s.push.apply(s, h), Va("ml0", h, f), t.sync || p.___gapisync ? ob(e) : nb(e)
                    } else b[m](fa)
                } else g(h) && r && r()
            },
            qb = function(e, t) { if (F.hee && 0 < F.hel) try { return e() } catch (e) { t && t(e), F.hel--, L("debug_error", function() { try { window.___jsl.hefn(e) } catch (t) { throw e } }) } else try { return e() } catch (e) { throw t && t(e), e } };
        B.load = function(e, t) { return qb(function() { return L(e, t) }) };
        var M = function(e) { var t = window.___jsl = window.___jsl || {}; return t[e] = t[e] || [], t[e] },
            N = function(e) { var t = window.___jsl = window.___jsl || {}; return t.cfg = !e && t.cfg || {}, t.cfg },
            tb = function(e) { return "object" == typeof e && /\[native code\]/.test(e.push) },
            O = function(e, t, n) {
                if (t && "object" == typeof t)
                    for (var r in t) !Object.prototype.hasOwnProperty.call(t, r) || n && "___goc" === r && void 0 === t[r] || (e[r] && t[r] && "object" == typeof e[r] && "object" == typeof t[r] && !tb(e[r]) && !tb(t[r]) ? O(e[r], t[r]) : t[r] && "object" == typeof t[r] ? (e[r] = tb(t[r]) ? [] : {}, O(e[r], t[r])) : e[r] = t[r])
            },
            ub = function(e) { if (e && !/^\s+$/.test(e)) { for (; 0 == e.charCodeAt(e.length - 1);) e = e.substring(0, e.length - 1); try { var t = window.JSON.parse(e) } catch (e) {} if ("object" == typeof t) return t; try { t = new Function("return (" + e + "\n)")() } catch (e) {} if ("object" == typeof t) return t; try { t = new Function("return ({" + e + "\n})")() } catch (e) {} return "object" == typeof t ? t : {} } },
            vb = function(e, t) {
                var n = { ___goc: void 0 };
                e.length && e[e.length - 1] && Object.hasOwnProperty.call(e[e.length - 1], "___goc") && void 0 === e[e.length - 1].___goc && (n = e.pop()), O(n, t), e.push(n)
            },
            wb = function(e) {
                N(!0);
                var t = window.___gcfg,
                    n = M("cu"),
                    r = window.___gu;
                t && t !== r && (vb(n, t), window.___gu = t), t = M("cu");
                var o = document.scripts || document.getElementsByTagName("script") || [];
                r = [];
                var i = [];
                i.push.apply(i, M("us"));
                for (var a = 0; a < o.length; ++a)
                    for (var s = o[a], c = 0; c < i.length; ++c) s.src && 0 == s.src.indexOf(i[c]) && r.push(s);
                for (0 == r.length && 0 < o.length && o[o.length - 1].src && r.push(o[o.length - 1]), o = 0; o < r.length; ++o) r[o].getAttribute("gapi_processed") || (r[o].setAttribute("gapi_processed", !0), (i = r[o]) ? (a = i.nodeType, i = 3 == a || 4 == a ? i.nodeValue : i.textContent || i.innerText || i.innerHTML || "") : i = void 0, (i = ub(i)) && t.push(i));
                for (e && vb(n, e), e = 0, t = (r = M("cd")).length; e < t; ++e) O(N(), r[e], !0);
                for (e = 0, t = (r = M("ci")).length; e < t; ++e) O(N(), r[e], !0);
                for (e = 0, t = n.length; e < t; ++e) O(N(), n[e], !0)
            },
            P = function(e) { var t = N(); if (!e) return t; for (var n = 0, r = (e = e.split("/")).length; t && "object" == typeof t && n < r; ++n) t = t[e[n]]; return n === e.length && void 0 !== t ? t : void 0 },
            xb = function(e, t) {
                var n;
                if ("string" == typeof e) {
                    for (var r = n = {}, o = 0, i = (e = e.split("/")).length; o < i - 1; ++o) { r = r[e[o]] = {} }
                    r[e[o]] = t
                } else n = e;
                wb(n)
            },
            yb = function() {
                var e = window.__GOOGLEAPIS;
                e && (e.googleapis && !e["googleapis.config"] && (e["googleapis.config"] = e.googleapis), v(F, "ci", []).push(e), window.__GOOGLEAPIS = void 0)
            },
            zb = { apppackagename: 1, callback: 1, clientid: 1, cookiepolicy: 1, openidrealm: -1, includegrantedscopes: -1, requestvisibleactions: 1, scope: 1 },
            Ab = !1,
            Bb = w(),
            Cb = function() {
                if (!Ab) {
                    for (var e = document.getElementsByTagName("meta"), t = 0; t < e.length; ++t) {
                        var n = e[t].name.toLowerCase();
                        if (0 == n.lastIndexOf("google-signin-", 0)) {
                            n = n.substring(14);
                            var r = e[t].content;
                            zb[n] && r && (Bb[n] = r)
                        }
                    }
                    if (window.self !== window.top) { e = document.location.toString(); for (var o in zb) 0 < zb[o] && (t = C(e, o, "")) && (Bb[o] = t) }
                    Ab = !0
                }
                return o = w(), z(Bb, o), o
            },
            Db = function(e) { return !!(e.clientid && e.scope && e.callback) },
            Eb = window.console,
            Fb = function(e) { Eb && Eb.log && Eb.log(e) },
            Gb = function() { return !!F.oa },
            Hb = function() {},
            Q = v(F, "rw", w()),
            Ib = function(e) { for (var t in Q) e(Q[t]) },
            Jb = function(e, t) {
                (e = Q[e]) && e.state < t && (e.state = t)
            },
            Kb, Lb = /^https?:\/\/(?:\w|[\-\.])+\.google\.(?:\w|[\-:\.])+(?:\/[^\?#]*)?\/u\/(\d)\//,
            Mb = /^https?:\/\/(?:\w|[\-\.])+\.google\.(?:\w|[\-:\.])+(?:\/[^\?#]*)?\/b\/(\d{10,21})\//,
            Nb = function(e) {
                var t = P("googleapis.config/sessionIndex");
                if ("string" == typeof t && 254 < t.length && (t = null), null == t && (t = window.__X_GOOG_AUTHUSER), "string" == typeof t && 254 < t.length && (t = null), null == t) {
                    var n = window.google;
                    n && (t = n.authuser)
                }
                return "string" == typeof t && 254 < t.length && (t = null), null == t && (e = e || window.location.href, null == (t = C(e, "authuser") || null) && (t = (t = e.match(Lb)) ? t[1] : null)), null == t ? null : (254 < (t = String(t)).length && (t = null), t)
            },
            Ob = function(e) { var t = P("googleapis.config/sessionDelegate"); return "string" == typeof t && 21 < t.length && (t = null), null == t && (t = (e = (e || window.location.href).match(Mb)) ? e[1] : null), null == t ? null : (21 < (t = String(t)).length && (t = null), t) },
            Pb, R, S = void 0,
            T = function(e) { try { return m.JSON.parse.call(m.JSON, e) } catch (e) { return !1 } },
            U = function(e) { return Object.prototype.toString.call(e) },
            Qb = U(0),
            Rb = U(new Date(0)),
            Sb = U(!0),
            Tb = U(""),
            Ub = U({}),
            Vb = U([]),
            V = function(e, t) {
                if (t)
                    for (var n = 0, r = t.length; n < r; ++n)
                        if (e === t[n]) throw new TypeError("Converting circular structure to JSON");
                if ("undefined" !== (r = typeof e)) {
                    (n = Array.prototype.slice.call(t || [], 0))[n.length] = e, t = [];
                    var o = U(e);
                    if (null != e && "function" == typeof e.toJSON && (Object.prototype.hasOwnProperty.call(e, "toJSON") || (o !== Vb || e.constructor !== Array && e.constructor !== Object) && (o !== Ub || e.constructor !== Array && e.constructor !== Object) && o !== Tb && o !== Qb && o !== Sb && o !== Rb)) return V(e.toJSON.call(e), n);
                    if (null == e) t[t.length] = "null";
                    else if (o === Qb) e = Number(e), isNaN(e) || isNaN(e - e) ? e = "null" : -0 === e && 0 > 1 / e && (e = "-0"), t[t.length] = String(e);
                    else if (o === Sb) t[t.length] = String(!!Number(e));
                    else {
                        if (o === Rb) return V(e.toISOString.call(e), n);
                        if (o === Vb && U(e.length) === Qb) {
                            t[t.length] = "[";
                            var i = 0;
                            for (r = Number(e.length) >> 0; i < r; ++i) i && (t[t.length] = ","), t[t.length] = V(e[i], n) || "null";
                            t[t.length] = "]"
                        } else if (o == Tb && U(e.length) === Qb) {
                            for (t[t.length] = '"', i = 0, n = Number(e.length) >> 0; i < n; ++i) r = String.prototype.charAt.call(e, i), o = String.prototype.charCodeAt.call(e, i), t[t.length] = "\b" === r ? "\\b" : "\f" === r ? "\\f" : "\n" === r ? "\\n" : "\r" === r ? "\\r" : "\t" === r ? "\\t" : "\\" === r || '"' === r ? "\\" + r : 31 >= o ? "\\u" + (o + 65536).toString(16).substr(1) : 32 <= o && 65535 >= o ? r : "�";
                            t[t.length] = '"'
                        } else {
                            if ("object" !== r) return;
                            t[t.length] = "{", r = 0;
                            for (i in e) Object.prototype.hasOwnProperty.call(e, i) && (o = V(e[i], n), void 0 !== o && (r++ && (t[t.length] = ","), t[t.length] = V(i), t[t.length] = ":", t[t.length] = o));
                            t[t.length] = "}"
                        }
                    }
                    return t.join("")
                }
            },
            Wb = /[\0-\x07\x0b\x0e-\x1f]/,
            Xb = /^([^"]*"([^\\"]|\\.)*")*[^"]*"([^"\\]|\\.)*[\0-\x1f]/,
            Yb = /^([^"]*"([^\\"]|\\.)*")*[^"]*"([^"\\]|\\.)*\\[^\\\/"bfnrtu]/,
            Zb = /^([^"]*"([^\\"]|\\.)*")*[^"]*"([^"\\]|\\.)*\\u([0-9a-fA-F]{0,3}[^0-9a-fA-F])/,
            $b = /"([^\0-\x1f\\"]|\\[\\\/"bfnrt]|\\u[0-9a-fA-F]{4})*"/g,
            ac = /-?(0|[1-9][0-9]*)(\.[0-9]+)?([eE][-+]?[0-9]+)?/g,
            bc = /[ \t\n\r]+/g,
            cc = /[^"]:/,
            dc = /""/g,
            ec = /true|false|null/g,
            fc = /00/,
            gc = /[\{]([^0\}]|0[^:])/,
            hc = /(^|\[)[,:]|[,:](\]|\}|[,:]|$)/,
            ic = /[^\[,:][\[\{]/,
            jc = /^(\{|\}|\[|\]|,|:|0)+/,
            kc = /\u2028/g,
            lc = /\u2029/g,
            mc = function(a) {
                if (a = String(a), Wb.test(a) || Xb.test(a) || Yb.test(a) || Zb.test(a)) return !1;
                var b = a.replace($b, '""');
                if (b = b.replace(ac, "0"), b = b.replace(bc, ""), cc.test(b)) return !1;
                if (b = b.replace(dc, "0"), b = b.replace(ec, "0"), fc.test(b) || gc.test(b) || hc.test(b) || ic.test(b) || !b || (b = b.replace(jc, ""))) return !1;
                a = a.replace(kc, "\\u2028").replace(lc, "\\u2029"), b = void 0;
                try { b = S ? [T(a)] : eval("(function (var_args) {\n  return Array.prototype.slice.call(arguments, 0);\n})(\n" + a + "\n)") } catch (e) { return !1 }
                return !(!b || 1 !== b.length) && b[0]
            },
            nc = function() {
                var e = ((m.document || {}).scripts || []).length;
                if ((void 0 === Pb || void 0 === S || R !== e) && -1 !== R) {
                    Pb = S = !1, R = -1;
                    try {
                        try { S = !!m.JSON && '{"a":[3,true,"1970-01-01T00:00:00.000Z"]}' === m.JSON.stringify.call(m.JSON, { a: [3, !0, new Date(0)], c: function() {} }) && !0 === T("true") && 3 === T('[{"a":3}]')[0].a } catch (e) {}
                        Pb = S && !T("[00]") && !T('""') && !T('"\\0"') && !T('"\\v"')
                    } finally { R = e }
                }
            },
            oc = function(e) { return -1 !== R && (nc(), (Pb ? T : mc)(e)) },
            pc = function(e) { if (-1 !== R) return nc(), S ? m.JSON.stringify.call(m.JSON, e) : V(e) },
            qc = !Date.prototype.toISOString || "function" != typeof Date.prototype.toISOString || "1970-01-01T00:00:00.000Z" !== new Date(0).toISOString(),
            rc = function() { var e = Date.prototype.getUTCFullYear.call(this); return [0 > e ? "-" + String(1e6 - e).substr(1) : 9999 >= e ? String(1e4 + e).substr(1) : "+" + String(1e6 + e).substr(1), "-", String(101 + Date.prototype.getUTCMonth.call(this)).substr(1), "-", String(100 + Date.prototype.getUTCDate.call(this)).substr(1), "T", String(100 + Date.prototype.getUTCHours.call(this)).substr(1), ":", String(100 + Date.prototype.getUTCMinutes.call(this)).substr(1), ":", String(100 + Date.prototype.getUTCSeconds.call(this)).substr(1), ".", String(1e3 + Date.prototype.getUTCMilliseconds.call(this)).substr(1), "Z"].join("") };
        Date.prototype.toISOString = qc ? rc : Date.prototype.toISOString;
        var sc = function() { this.j = -1 },
            W = function() {
                this.j = 64, this.b = [], this.F = [], this.W = [], this.B = [], this.B[0] = 128;
                for (var e = 1; e < this.j; ++e) this.B[e] = 0;
                this.C = this.o = 0, this.reset()
            };
        da(W, sc), W.prototype.reset = function() { this.b[0] = 1732584193, this.b[1] = 4023233417, this.b[2] = 2562383102, this.b[3] = 271733878, this.b[4] = 3285377520, this.C = this.o = 0 };
        var tc = function(e, t, n) {
            n || (n = 0);
            var r = e.W;
            if ("string" == typeof t)
                for (var o = 0; 16 > o; o++) r[o] = t.charCodeAt(n) << 24 | t.charCodeAt(n + 1) << 16 | t.charCodeAt(n + 2) << 8 | t.charCodeAt(n + 3), n += 4;
            else
                for (o = 0; 16 > o; o++) r[o] = t[n] << 24 | t[n + 1] << 16 | t[n + 2] << 8 | t[n + 3], n += 4;
            for (o = 16; 80 > o; o++) {
                var i = r[o - 3] ^ r[o - 8] ^ r[o - 14] ^ r[o - 16];
                r[o] = 4294967295 & (i << 1 | i >>> 31)
            }
            t = e.b[0], n = e.b[1];
            var a = e.b[2],
                s = e.b[3],
                c = e.b[4];
            for (o = 0; 80 > o; o++) {
                if (40 > o)
                    if (20 > o) { i = s ^ n & (a ^ s); var l = 1518500249 } else i = n ^ a ^ s, l = 1859775393;
                else 60 > o ? (i = n & a | s & (n | a), l = 2400959708) : (i = n ^ a ^ s, l = 3395469782);
                i = (t << 5 | t >>> 27) + i + c + l + r[o] & 4294967295, c = s, s = a, a = 4294967295 & (n << 30 | n >>> 2), n = t, t = i
            }
            e.b[0] = e.b[0] + t & 4294967295, e.b[1] = e.b[1] + n & 4294967295, e.b[2] = e.b[2] + a & 4294967295, e.b[3] = e.b[3] + s & 4294967295, e.b[4] = e.b[4] + c & 4294967295
        };
        W.prototype.update = function(e, t) {
            if (null != e) {
                void 0 === t && (t = e.length);
                for (var n = t - this.j, r = 0, o = this.F, i = this.o; r < t;) {
                    if (0 == i)
                        for (; r <= n;) tc(this, e, r), r += this.j;
                    if ("string" == typeof e) {
                        for (; r < t;)
                            if (o[i] = e.charCodeAt(r), ++r, ++i == this.j) { tc(this, o), i = 0; break }
                    } else
                        for (; r < t;)
                            if (o[i] = e[r], ++i, ++r, i == this.j) { tc(this, o), i = 0; break }
                }
                this.o = i, this.C += t
            }
        }, W.prototype.digest = function() {
            var e = [],
                t = 8 * this.C;
            56 > this.o ? this.update(this.B, 56 - this.o) : this.update(this.B, this.j - (this.o - 56));
            for (var n = this.j - 1; 56 <= n; n--) this.F[n] = 255 & t, t /= 256;
            for (tc(this, this.F), n = t = 0; 5 > n; n++)
                for (var r = 24; 0 <= r; r -= 8) e[t] = this.b[n] >> r & 255, ++t;
            return e
        };
        var uc = function() { this.J = new W };
        uc.prototype.reset = function() { this.J.reset() };
        var vc = p.crypto,
            wc = !1,
            xc = 0,
            yc = 0,
            zc = 1,
            Ac = 0,
            Bc = "",
            Cc = function(e) {
                var t = (e = e || p.event).screenX + e.clientX << 16;
                t += e.screenY + e.clientY, t *= (new Date).getTime() % 1e6, zc = zc * t % Ac, 0 < xc && ++yc == xc && Ea("mousemove", Cc, "remove", "de")
            },
            Dc = function(e) { for (var t = new uc, n = [], r = 0, o = (e = unescape(encodeURIComponent(e))).length; r < o; ++r) n.push(e.charCodeAt(r)); for (t.J.update(n), t = t.J.digest(), e = "", n = 0; n < t.length; n++) e += "0123456789ABCDEF".charAt(Math.floor(t[n] / 16)) + "0123456789ABCDEF".charAt(t[n] % 16); return e };
        wc = !!vc && "function" == typeof vc.getRandomValues, wc || (Ac = 1e6 * (screen.width * screen.width + screen.height), Bc = Dc(t.cookie + "|" + t.location + "|" + (new Date).getTime() + "|" + Math.random()), xc = P("random/maxObserveMousemove") || 0, 0 != xc && Ea("mousemove", Cc, "add", "at"));
        var Ec = function() { var e = zc; return e += parseInt(Bc.substr(0, 20), 16), Bc = Dc(Bc), e / (Ac + Math.pow(16, 20)) },
            Fc = function() { var e = new p.Uint32Array(1); return vc.getRandomValues(e), Number("0." + e[0]) },
            Gc = function() {
                var e = F.onl;
                if (!e) {
                    e = w(), F.onl = e;
                    var t = w();
                    e.e = function(e) {
                        var n = t[e];
                        n && (delete t[e], n())
                    }, e.a = function(e, n) { t[e] = n }, e.r = function(e) { delete t[e] }
                }
                return e
            },
            Hc = function(e, t) { return "function" == typeof(t = t.onload) ? (Gc().a(e, t), t) : null },
            Ic = function(e) { return A(/^\w+$/.test(e), "Unsupported id - " + e), Gc(), 'onload="window.___jsl.onl.e(&#34;' + e + '&#34;)"' },
            Jc = function(e) { Gc().r(e) },
            Kc = { allowtransparency: "true", frameborder: "0", hspace: "0", marginheight: "0", marginwidth: "0", scrolling: "no", style: "", tabindex: "0", vspace: "0", width: "100%" },
            Lc = { allowtransparency: !0, onload: !0 },
            Mc = 0,
            Nc = function(e) { A(!e || Da.test(e), "Illegal url for new iframe - " + e) },
            Oc = function(e, t, n, r, o) {
                Nc(n.src);
                var i, a = Hc(r, n),
                    s = a ? Ic(r) : "";
                try { document.all && (i = e.createElement('<iframe frameborder="' + pa(String(n.frameborder)) + '" scrolling="' + pa(String(n.scrolling)) + '" ' + s + ' name="' + pa(String(n.name)) + '"/>')) } catch (e) {} finally { i || (i = e.createElement("iframe"), a && (i.onload = function() { i.onload = null, a.call(this) }, Jc(r))) }
                i.setAttribute("ng-non-bindable", "");
                for (var c in n) e = n[c], "style" === c && "object" == typeof e ? z(e, i.style) : Lc[c] || i.setAttribute(c, String(e));
                return (c = o && o.beforeNode || null) || o && o.dontclear || Ja(t), t.insertBefore(i, c), i = c ? c.previousSibling : t.lastChild, n.allowtransparency && (i.allowTransparency = !0), i
            },
            Pc = /^:[\w]+$/,
            Qc = /:([a-zA-Z_]+):/g,
            Rc = function() {
                var e = Nb() || "0",
                    t = Ob(),
                    n = Nb(void 0) || e,
                    r = Ob(void 0),
                    o = "";
                n && (o += "u/" + encodeURIComponent(String(n)) + "/"), r && (o += "b/" + encodeURIComponent(String(r)) + "/"), n = o || null, (o = (r = !1 === P("isLoggedIn")) ? "_/im/" : "") && (n = "");
                var i = P("iframes/:socialhost:"),
                    a = P("iframes/:im_socialhost:");
                return Kb = { socialhost: i, ctx_socialhost: r ? a : i, session_index: e, session_delegate: t, session_prefix: n, im_prefix: o }
            },
            Sc = function(e, t) { return Rc()[t] || "" },
            Tc = function(e) { return function(t, n) { return e ? Rc()[n] || e[n] || "" : Rc()[n] || "" } },
            Uc = function(e) { var t; return e.match(/^https?%3A/i) && (t = decodeURIComponent(e)), Ca(document, t || e) },
            Vc = function(e) {
                e = e || "canonical";
                for (var t = document.getElementsByTagName("link"), n = 0, r = t.length; n < r; n++) {
                    var o = t[n],
                        i = o.getAttribute("rel");
                    if (i && i.toLowerCase() == e && (o = o.getAttribute("href")) && (o = Uc(o)) && null != o.match(/^https?:\/\/[\w\-_\.]+/i)) return o
                }
                return window.location.href
            },
            Wc = { se: "0" },
            Xc = { post: !0 },
            Yc = { style: "position:absolute;top:-10000px;width:450px;margin:0px;border-style:none" },
            Zc = "onPlusOne _ready _close _open _resizeMe _renderstart oncircled drefresh erefresh".split(" "),
            $c = v(F, "WI", w()),
            ad = function(e, n, r) {
                var o, i = {},
                    a = o = e;
                "plus" == e && n.action && (o = e + "_" + n.action, a = e + "/" + n.action), (o = P("iframes/" + o + "/url")) || (o = ":im_socialhost:/:session_prefix::im_prefix:_/widget/render/" + a + "?usegapi=1");
                for (var s in Wc) i[s] = s + "/" + (n[s] || Wc[s]) + "/";
                if (i = Ca(t, o.replace(Qc, Tc(i))), s = "iframes/" + e + "/params/", z(n, a = {}), (o = P("lang") || P("gwidget/lang")) && (a.hl = o), Xc[e] || (a.origin = window.location.origin || window.location.protocol + "//" + window.location.host), a.exp = P(s + "exp"), s = P(s + "location"))
                    for (o = 0; o < s.length; o++) {
                        var c = s[o];
                        a[c] = p.location[c]
                    }
                switch (e) {
                    case "plus":
                    case "follow":
                        s = a.href, o = n.action ? void 0 : "publisher", s = (s = "string" == typeof s ? s : void 0) ? Uc(s) : Vc(o), a.url = s, delete a.href;
                        break;
                    case "plusone":
                        s = (s = n.href) ? Uc(s) : Vc(), a.url = s, s = n.db, o = P(), null == s && o && (null == (s = o.db) && (s = o.gwidget && o.gwidget.db)), a.db = s || void 0, s = n.ecp, o = P(), null == s && o && (null == (s = o.ecp) && (s = o.gwidget && o.gwidget.ecp)), a.ecp = s || void 0, delete a.href;
                        break;
                    case "signin":
                        a.url = Vc()
                }
                F.ILI && (a.iloader = "1"), delete a["data-onload"], delete a.rd;
                for (var l in Wc) a[l] && delete a[l];
                a.gsrc = P("iframes/:source:"), void 0 !== (l = P("inline/css")) && 0 < r && l >= r && (a.ic = "1"), l = /^#|^fr-/, r = {};
                for (var u in a) x(a, u) && l.test(u) && (r[u.replace(l, "")] = a[u], delete a[u]);
                u = "q" == P("iframes/" + e + "/params/si") ? a : r, l = Cb();
                for (var d in l) !x(l, d) || x(a, d) || x(r, d) || (u[d] = l[d]);
                d = [].concat(Zc), (u = P("iframes/" + e + "/methods")) && "object" == typeof u && ha.test(u.push) && (d = d.concat(u));
                for (var f in n) x(n, f) && /^on/.test(f) && ("plus" != e || "onconnect" != f) && (d.push(f), delete a[f]);
                return delete a.callback, r._methods = d.join(","), za(i, a, r)
            },
            bd = ["style", "data-gapiscan"],
            dd = function(e) {
                for (var t = w(), n = 0 != e.nodeName.toLowerCase().indexOf("g:"), r = 0, o = e.attributes.length; r < o; r++) {
                    var i = e.attributes[r],
                        a = i.name,
                        s = i.value;
                    0 <= ia.call(bd, a) || n && 0 != a.indexOf("data-") || "null" === s || "specified" in i && !i.specified || (n && (a = a.substr(5)), t[a.toLowerCase()] = s)
                }
                return e = e.style, (n = cd(e && e.height)) && (t.height = String(n)), (e = cd(e && e.width)) && (t.width = String(e)), t
            },
            cd = function(e) { var t = void 0; return "number" == typeof e ? t = e : "string" == typeof e && (t = parseInt(e, 10)), t },
            fd = function() {
                var e = F.drw;
                Ib(function(n) {
                    if (e !== n.id && 4 != n.state && "share" != n.type) {
                        var r = n.id,
                            o = n.type,
                            i = n.url;
                        n = n.userParams;
                        var a = t.getElementById(r);
                        if (a) {
                            var s = ad(o, n, 0);
                            s ? (a = a.parentNode, i.replace(/#.*/, "").replace(/(\?|&)ic=1/, "") !== s.replace(/#.*/, "").replace(/(\?|&)ic=1/, "") && (n.dontclear = !0, n.rd = !0, n.ri = !0, n.type = o, ed(a, n), (o = Q[a.lastChild.id]) && (o.oid = r), Jb(r, 4))) : delete Q[r]
                        } else delete Q[r]
                    }
                })
            },
            gd, hd, X, id, jd, kd = /(?:^|\s)g-((\S)*)(?:$|\s)/,
            ld = { plusone: !0, autocomplete: !0, profile: !0, signin: !0, signin2: !0 };
        gd = v(F, "SW", w()), hd = v(F, "SA", w()), X = v(F, "SM", w()), id = v(F, "FW", []), jd = null;
        var nd = function(e, t) { md(void 0, !1, e, t) },
            md = function(e, n, r, o) {
                G("ps0", !0), r = ("string" == typeof r ? document.getElementById(r) : r) || t;
                var i = t.documentMode;
                if (r.querySelectorAll && (!i || 8 < i)) {
                    i = o ? [o] : qa(gd).concat(qa(hd)).concat(qa(X));
                    for (var a = [], s = 0; s < i.length; s++) {
                        var c = i[s];
                        a.push(".g-" + c, "g\\:" + c)
                    }
                    i = r.querySelectorAll(a.join(","))
                } else i = r.getElementsByTagName("*");
                for (r = w(), a = 0; a < i.length; a++) {
                    var l = s = i[a];
                    c = o;
                    var u = l.nodeName.toLowerCase(),
                        p = void 0;
                    if (l.getAttribute("data-gapiscan")) c = null;
                    else {
                        var d = u.indexOf("g:");
                        0 == d ? p = u.substr(2) : (d = (d = String(l.className || l.getAttribute("class"))) && kd.exec(d)) && (p = d[1]), c = !p || !(gd[p] || hd[p] || X[p]) || c && p !== c ? null : p
                    }
                    c && (ld[c] || 0 == s.nodeName.toLowerCase().indexOf("g:") || 0 != qa(dd(s)).length) && (s.setAttribute("data-gapiscan", !0), v(r, c, []).push(s))
                }
                if (n)
                    for (var f in r)
                        for (n = r[f], o = 0; o < n.length; o++) n[o].setAttribute("data-onload", !0);
                for (var g in r) id.push(g);
                if (G("ps1", !0), (f = id.join(":")) || e) try { B.load(f, e) } catch (e) { return void Fb(e) }
                if (od(jd || {}))
                    for (var h in r) {
                        for (g = 0, n = (e = r[h]).length; g < n; g++) e[g].removeAttribute("data-gapiscan");
                        pd(h)
                    } else {
                        o = [];
                        for (h in r)
                            for (e = r[h], g = 0, n = e.length; g < n; g++) i = e[g], qd(h, i, dd(i), o, n);
                        rd(f, o)
                    }
            },
            sd = function(e) {
                var t = v(B, e, {});
                t.go || (t.go = function(t) { return nd(t, e) }, t.render = function(t, n) { return (n = n || {}).type = e, ed(t, n) })
            },
            td = function(e) { gd[e] = !0 },
            ud = function(e) { hd[e] = !0 },
            vd = function(e) { X[e] = !0 },
            pd = function(e, t) {
                var n = Na(e);
                t && n ? (n(t), (n = t.iframeNode) && n.setAttribute("data-gapiattached", !0)) : B.load(e, function() {
                    var n = Na(e),
                        r = t && t.iframeNode,
                        o = t && t.userParams;
                    r && n ? (n(t), r.setAttribute("data-gapiattached", !0)) : (n = B[e].go)("signin2" == e ? r : r && r.parentNode, o)
                })
            },
            od = function() { return !1 },
            rd = function() {},
            qd = function(e, n, r, o, i, a, s) {
                switch (wd(n, e, a)) {
                    case 0:
                        e = X[e] ? e + "_annotation" : e, (o = {}).iframeNode = n, o.userParams = r, pd(e, o);
                        break;
                    case 1:
                        if (n.parentNode) {
                            for (var c in r)
                                if ((a = x(r, c)) && (a = !(!(a = r[c]) || "object" != typeof a || a.toString && a.toString !== Object.prototype.toString && a.toString !== Array.prototype.toString)), a) try { r[c] = pc(r[c]) } catch (e) { delete r[c] }
                            if (a = !0, r.dontclear && (a = !1), delete r.dontclear, Hb(), c = ad(e, r, i), (i = s || {}).allowPost = 1, i.attributes = Yc, i.dontclear = !a, (s = {}).userParams = r, s.url = c, s.type = e, r.rd) var l = n;
                            else l = document.createElement("div"), n.setAttribute("data-gapistub", !0), l.style.cssText = "position:absolute;width:450px;left:-10000px;", n.parentNode.insertBefore(l, n);
                            s.siteElement = l, l.id || (n = l, v($c, e, 0), a = "___" + e + "_" + $c[e]++, n.id = a), (n = w())[">type"] = e, z(r, n), a = c, r = l, n = (c = i || {}).attributes || {}, A(!(c.allowPost || c.forcePost) || !n.onload, "onload is not supported by post iframe (allowPost or forcePost)"), i = n = a, Pc.test(n) && (i = P("iframes/" + i.substring(1) + "/url"), A(!!i, "Unknown iframe url config for - " + n)), a = Ca(t, i.replace(Qc, Sc)), n = r.ownerDocument || t, l = 0;
                            do { i = c.id || ["I", Mc++, "_", (new Date).getTime()].join("") } while (n.getElementById(i) && 5 > ++l);
                            A(5 > l, "Error creating iframe id"), l = {};
                            var u = {};
                            n.documentMode && 9 > n.documentMode && (l.hostiemode = n.documentMode), z(c.queryParams || {}, l), z(c.fragmentParams || {}, u);
                            var p = c.pfname,
                                d = w();
                            P("iframes/dropLegacyIdParam") || (d.id = i), d._gfid = i, d.parent = n.location.protocol + "//" + n.location.host;
                            var f = C(n.location.href, "parent");
                            if (!(p = p || "") && f && (f = C(n.location.href, "_gfid", "") || C(n.location.href, "id", ""), p = C(n.location.href, "pfname", ""), p = f ? p + "/" + f : ""), p || (f = oc(C(n.location.href, "jcp", ""))) && "object" == typeof f && (p = (p = f.id) ? f.pfname + "/" + p : ""), d.pfname = p, c.connectWithJsonParam && ((f = {}).jcp = pc(d), d = f), (f = C(a, "rpctoken") || l.rpctoken || u.rpctoken) || (f = c.rpctoken || String(Math.round(1e8 * (wc ? Fc() : Ec()))), d.rpctoken = f), c.rpctoken = f, z(d, c.connectWithQueryParams ? l : u), f = n.location.href, d = w(), (p = C(f, "_bsh", F.bsh)) && (d._bsh = p), (f = La(f)) && (d.jsh = f), c.hintInFragment ? z(d, u) : z(d, l), a = za(a, l, u, c.paramsSerializer), u = w(), z(Kc, u), z(c.attributes, u), u.name = u.id = i, u.src = a, c.eurl = a, d = !!(l = c || {}).allowPost, l.forcePost || d && 2e3 < a.length) {
                                if (l = D(a), u.src = "", u["data-postorigin"] = a, a = Oc(n, r, u, i), -1 != navigator.userAgent.indexOf("WebKit")) {
                                    var g = a.contentWindow.document;
                                    g.open(), u = g.createElement("div"), (d = {}).name = f = i + "_inner", d.src = "", d.style = "display:none", Oc(n, u, d, f, c)
                                }
                                for (u = (c = l.query[0]) ? c.split("&") : [], c = [], d = 0; d < u.length; d++) f = u[d].split("=", 2), c.push([decodeURIComponent(f[0]), decodeURIComponent(f[1])]);
                                for (l.query = [], u = xa(l), A(Da.test(u), "Invalid URL: " + u), (l = n.createElement("form")).action = u, l.method = "POST", l.target = i, l.style.display = "none", i = 0; i < c.length; i++) u = n.createElement("input"), u.type = "hidden", u.name = c[i][0], u.value = c[i][1], l.appendChild(u);
                                r.appendChild(l), l.submit(), l.parentNode.removeChild(l), g && g.close(), g = a
                            } else g = Oc(n, r, u, i, c);
                            s.iframeNode = g, s.id = g.getAttribute("id"), g = s.id, (r = w()).id = g, r.userParams = s.userParams, r.url = s.url, r.type = s.type, r.state = 1, Q[g] = r, g = s
                        } else g = null;
                        g && ((s = g.id) && o.push(s), pd(e, g))
                }
            },
            wd = function(e, t, n) { if (e && 1 === e.nodeType && t) { if (n) return 1; if (X[t]) { if (Ka[e.nodeName.toLowerCase()]) return (e = e.innerHTML) && e.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "") ? 0 : 1 } else { if (hd[t]) return 0; if (gd[t]) return 1 } } return null },
            ed = function(e, t) {
                var n = t.type;
                delete t.type;
                var r = ("string" == typeof e ? document.getElementById(e) : e) || void 0;
                if (r) {
                    e = {};
                    for (var o in t) x(t, o) && (e[o.toLowerCase()] = t[o]);
                    e.rd = 1, (t = !!e.ri) && delete e.ri, qd(n, r, e, o = [], 0, t, void 0), rd(n, o)
                } else Fb("string" == "gapi." + n + ".render: missing element " + typeof e ? e : "")
            };
        v(B, "platform", {}).go = nd, od = function(e) { for (var t = ["_c", "jsl", "h"], n = 0; n < t.length && e; n++) e = e[t[n]]; return t = La(ea.href), !e || 0 != e.indexOf("n;") && 0 != t.indexOf("n;") && e !== t }, rd = function(e, t) { xd(e, t) };
        var Ga = function(e) { md(e, !0) },
            yd = function(e, t) { t = t || []; for (var n = 0; n < t.length; ++n) e(t[n]); for (e = 0; e < t.length; e++) sd(t[e]) };
        H.push(["platform", function(e, t, n) {
            if (jd = n, t && id.push(t), yd(td, e), yd(ud, n._c.annotation), yd(vd, n._c.bimodal), yb(), wb(), "explicit" != P("parsetags")) {
                if (Ma(e), Db(Cb()) && !P("disableRealtimeCallback") && Hb(), n && (e = n.callback)) {
                    var r = ra(e);
                    delete n.callback
                }
                Ia(function() { Ga(r) })
            }
        }]), B._pl = !0;
        var zd = function(e) {
                if (e = (e = Q[e]) ? e.oid : void 0) {
                    var n = t.getElementById(e);
                    n && n.parentNode.removeChild(n), delete Q[e], zd(e)
                }
            },
            Ad = /^\{h:'/,
            Bd = /^!_/,
            Cd = "",
            xd = function(e, t) {
                function n() { Ea("message", r, "remove", "de") }

                function r(r) {
                    var i = r.data,
                        a = r.origin;
                    if (Dd(i, t)) {
                        var s = o;
                        o = !1, s && G("rqe"), Ed(e, function() { s && G("rqd"), n(); for (var e = v(F, "RPMQ", []), t = 0; t < e.length; t++) e[t]({ data: i, origin: a }) })
                    }
                }
                if (0 !== t.length) {
                    Cd = C(ea.href, "pfname", "");
                    var o = !0;
                    Ea("message", r, "add", "at"), L(e, n)
                }
            },
            Dd = function(e, n) {
                if (e = String(e), Ad.test(e)) return !0;
                var r = !1;
                if (Bd.test(e) && (r = !0, e = e.substr(2)), !/^\{/.test(e)) return !1;
                var o = oc(e);
                if (!o) return !1;
                if (e = o.f, o.s && e && -1 != ia.call(n, e)) {
                    if (("_renderstart" === o.s || o.s === Cd + "/" + e + "::_renderstart") && (o = o.a && o.a[r ? 0 : 1], n = t.getElementById(e), Jb(e, 2), o && n && o.width && o.height)) {
                        e: {
                            if (r = n.parentNode, e = o || {}, Gb()) {
                                var i = n.id;
                                if (i) {
                                    if (1 === (o = (o = Q[i]) ? o.state : void 0) || 4 === o) break e;
                                    zd(i)
                                }
                            }(o = r.nextSibling) && o.getAttribute && o.getAttribute("data-gapistub") && (r.parentNode.removeChild(o), r.style.cssText = ""),
                            o = e.width;
                            var a = e.height,
                                s = r.style;s.textIndent = "0",
                            s.margin = "0",
                            s.padding = "0",
                            s.background = "transparent",
                            s.borderStyle = "none",
                            s.cssFloat = "none",
                            s.styleFloat = "none",
                            s.lineHeight = "normal",
                            s.fontSize = "1px",
                            s.verticalAlign = "baseline",
                            (r = r.style).display = "inline-block",
                            (s = n.style).position = "static",
                            s.left = "0",
                            s.top = "0",
                            s.visibility = "visible",
                            o && (r.width = s.width = o + "px"),
                            a && (r.height = s.height = a + "px"),
                            e.verticalAlign && (r.verticalAlign = e.verticalAlign),
                            i && Jb(i, 3)
                        }
                        n["data-csi-wdt"] = (new Date).getTime()
                    }
                    return !0
                }
                return !1
            },
            Ed = function(e, t) { L(e, t) },
            Fd = function(e, t) { this.H = e, e = t || {}, this.Y = Number(e.maxAge) || 0, this.N = e.domain, this.R = e.path, this.Z = !!e.secure },
            Gd = /^[-+/_=.:|%&a-zA-Z0-9@]*$/,
            Hd = /^[A-Z_][A-Z0-9_]{0,63}$/;
        Fd.prototype.read = function() { for (var e = this.H + "=", t = document.cookie.split(/;\s*/), n = 0; n < t.length; ++n) { var r = t[n]; if (0 == r.indexOf(e)) return r.substr(e.length) } }, Fd.prototype.write = function(e, t) {
            if (!Hd.test(this.H)) throw "Invalid cookie name";
            if (!Gd.test(e)) throw "Invalid cookie value";
            if (e = this.H + "=" + e, this.N && (e += ";domain=" + this.N), this.R && (e += ";path=" + this.R), 0 <= (t = "number" == typeof t ? t : this.Y)) {
                var n = new Date;
                n.setSeconds(n.getSeconds() + t), e += ";expires=" + n.toUTCString()
            }
            return this.Z && (e += ";secure"), document.cookie = e, !0
        }, Fd.prototype.clear = function() { this.write("", 0) }, Fd.iterate = function(e) {
            for (var t = document.cookie.split(/;\s*/), n = 0; n < t.length; ++n) {
                var r = t[n].split("=");
                e(r.shift(), r.join("="))
            }
        };
        var Id = function(e) { this.A = e },
            Y = {};
        Id.prototype.read = function() { if (Y.hasOwnProperty(this.A)) return Y[this.A] }, Id.prototype.write = function(e) { return Y[this.A] = e, !0 }, Id.prototype.clear = function() { delete Y[this.A] }, Id.iterate = function(e) { for (var t in Y) Y.hasOwnProperty(t) && e(t, Y[t]) };
        var Jd = "https:" === window.location.protocol,
            Kd = Jd || "http:" === window.location.protocol ? Fd : Id,
            Ld = function(e) {
                var t = e.substr(1),
                    n = "",
                    r = window.location.hostname;
                if ("" !== t) {
                    if (n = parseInt(t, 10), isNaN(n)) return null;
                    if ((t = r.split(".")).length < n - 1) return null;
                    t.length == n - 1 && (r = "." + r)
                } else r = "";
                return { i: "S" == e.charAt(0), domain: r, l: n }
            },
            Md = function() { var e, t = null; return Kd.iterate(function(n, r) { 0 === n.indexOf("G_AUTHUSER_") && (n = Ld(n.substring(11)), !e || n.i && !e.i || n.i == e.i && n.l > e.l) && (e = n, t = r) }), { X: e, D: t } },
            Nd = function(e) {
                if (0 !== e.indexOf("GCSC")) return null;
                var t = { P: !1 };
                if (!(e = e.substr(4))) return t;
                var n = e.charAt(0),
                    r = (e = e.substr(1)).lastIndexOf("_");
                if (-1 == r) return t;
                var o = Ld(e.substr(r + 1));
                return null == o ? t : "_" !== (e = e.substring(0, r)).charAt(0) ? t : !(r = "E" === n && o.i) && ("U" !== n || o.i) || r && !Jd ? t : { P: !0, i: r, ba: e.substr(1), domain: o.domain, l: o.l }
            },
            Od = function(e) { return e && (e = e.split("="))[1] ? e[1].split("|") : [] },
            Pd = function(e) { return { clientId: (e = e.split(":"))[0].split("=")[1], aa: Od(e[1]), da: Od(e[2]), ca: Od(e[3]) } },
            Qd = function() {
                var e, t = Md(),
                    n = t.X;
                if (null !== (t = t.D) && (Kd.iterate(function(t, r) {
                        (t = Nd(t)) && t.P && t.i == n.i && t.l == n.l && (e = r)
                    }), e)) {
                    var r = Pd(e),
                        o = r && r.aa[Number(t)];
                    if (r = r && r.clientId, o) return { D: t, $: o, clientId: r }
                }
                return null
            },
            Z = function() { this.M = Rd };
        Z.prototype.v = 0, Z.prototype.K = 2, Z.prototype.M = null, Z.prototype.G = !1, Z.prototype.U = function() { this.G || (this.v = 0, this.G = !0, this.S()) }, Z.prototype.S = function() { this.G && (this.M() ? this.v = this.K : this.v = Math.min(2 * (this.v || this.K), 120), window.setTimeout(ca(this.S, this), 1e3 * this.v)) };
        for (var Sd = 0; 64 > Sd; ++Sd);
        var Td = null;
        Gb = function() { return F.oa = !0 }, Hb = function() {
            F.oa = !0;
            var e = Qd();
            (e = e && e.D) && xb("googleapis.config/sessionIndex", e), Td || (Td = v(F, "ss", new Z)), (e = Td).U && e.U()
        };
        var Rd = function() {
            var e = Qd(),
                t = e && e.$ || null,
                n = e && e.clientId;
            return L("auth", {
                callback: function() {
                    var e = p.gapi.auth,
                        r = { client_id: n, session_state: t };
                    e.checkSessionState(r, function(t) {
                        var n = r.session_state,
                            o = P("isLoggedIn");
                        (o = o != (t = !P("debug/forceIm") && (n && t || !n && !t))) && (xb("isLoggedIn", t), Hb(), fd(), t || ((t = e.signOut) ? t() : (t = e.setToken) && t(null))), t = Cb();
                        var i = P("savedUserState");
                        i = i != (n = e._guss(t.cookiepolicy)) && void 0 !== i, xb("savedUserState", n), (o || i) && Db(t) && !P("disableRealtimeCallback") && e._pimf(t, !0)
                    })
                }
            }), !0
        };
        G("bs0", !0, window.gapi._bs), G("bs1", !0), delete window.gapi._bs
    }.call(this), gapi.load("", { callback: window.gapi_onload, _c: { jsl: { ci: { deviceType: "desktop", "oauth-flow": { authUrl: "https://accounts.google.com/o/oauth2/auth", proxyUrl: "https://accounts.google.com/o/oauth2/postmessageRelay", disableOpt: !0, idpIframeUrl: "https://accounts.google.com/o/oauth2/iframe", usegapi: !1 }, debug: { reportExceptionRate: .05, forceIm: !1, rethrowException: !1, host: "https://apis.google.com" }, enableMultilogin: !0, "googleapis.config": { auth: { useFirstPartyAuthV2: !0 } }, isPlusUser: !0, inline: { css: 1 }, disableRealtimeCallback: !1, drive_share: { skipInitCommand: !0 }, csi: { rate: .01 }, client: { cors: !1 }, isLoggedIn: !0, signInDeprecation: { rate: 0 }, include_granted_scopes: !0, llang: "en", iframes: { ytsubscribe: { url: "https://www.youtube.com/subscribe_embed?usegapi=1" }, plus_share: { params: { url: "" }, url: ":socialhost:/:session_prefix::se:_/+1/sharebutton?plusShare=true&usegapi=1" }, ":source:": "3p", playemm: { url: "https://play.google.com/work/embedded/search?usegapi=1&usegapi=1" }, partnersbadge: { url: "https://www.gstatic.com/partners/badge/templates/badge.html?usegapi=1" }, dataconnector: { url: "https://dataconnector.corp.google.com/:session_prefix:ui/widgetview?usegapi=1" }, shortlists: { url: "" }, plus_followers: { params: { url: "" }, url: ":socialhost:/_/im/_/widget/render/plus/followers?usegapi=1" }, post: { params: { url: "" }, url: ":socialhost:/:session_prefix::im_prefix:_/widget/render/post?usegapi=1" }, signin: { params: { url: "" }, url: ":socialhost:/:session_prefix:_/widget/render/signin?usegapi=1", methods: ["onauth"] }, donation: { url: "https://onetoday.google.com/home/donationWidget?usegapi=1" }, plusone: { params: { count: "", size: "", url: "" }, url: ":socialhost:/:session_prefix::se:_/+1/fastbutton?usegapi=1" }, ":im_socialhost:": "https://plus.googleapis.com", backdrop: { url: "https://clients3.google.com/cast/chromecast/home/widget/backdrop?usegapi=1" }, visibility: { params: { url: "" }, url: ":socialhost:/:session_prefix:_/widget/render/visibility?usegapi=1" }, additnow: { url: "https://apis.google.com/additnow/additnow.html?usegapi=1", methods: ["launchurl"] }, ":signuphost:": "https://plus.google.com", community: { url: ":ctx_socialhost:/:session_prefix::im_prefix:_/widget/render/community?usegapi=1" }, plus: { url: ":socialhost:/:session_prefix:_/widget/render/badge?usegapi=1" }, commentcount: { url: ":socialhost:/:session_prefix:_/widget/render/commentcount?usegapi=1" }, zoomableimage: { url: "https://ssl.gstatic.com/microscope/embed/" }, appfinder: { url: "https://gsuite.google.com/:session_prefix:marketplace/appfinder?usegapi=1" }, person: { url: ":socialhost:/:session_prefix:_/widget/render/person?usegapi=1" }, savetodrive: { url: "https://drive.google.com/savetodrivebutton?usegapi=1", methods: ["save"] }, page: { url: ":socialhost:/:session_prefix:_/widget/render/page?usegapi=1" }, card: { url: ":socialhost:/:session_prefix:_/hovercard/card" }, youtube: { params: { location: ["search", "hash"] }, url: ":socialhost:/:session_prefix:_/widget/render/youtube?usegapi=1", methods: ["scroll", "openwindow"] }, plus_circle: { params: { url: "" }, url: ":socialhost:/:session_prefix::se:_/widget/plus/circle?usegapi=1" }, rbr_s: { params: { url: "" }, url: ":socialhost:/:session_prefix::se:_/widget/render/recobarsimplescroller" }, udc_webconsentflow: { params: { url: "" }, url: "https://myaccount.google.com/webconsent?usegapi=1" }, savetoandroidpay: { url: "https://androidpay.google.com/a/widget/save" }, blogger: { params: { location: ["search", "hash"] }, url: ":socialhost:/:session_prefix:_/widget/render/blogger?usegapi=1", methods: ["scroll", "openwindow"] }, evwidget: { params: { url: "" }, url: ":socialhost:/:session_prefix:_/events/widget?usegapi=1" }, surveyoptin: { url: "https://www.google.com/shopping/customerreviews/optin?usegapi=1" }, ":socialhost:": "https://apis.google.com", hangout: { url: "https://talkgadget.google.com/:session_prefix:talkgadget/_/widget" }, ":gplus_url:": "https://plus.google.com", rbr_i: { params: { url: "" }, url: ":socialhost:/:session_prefix::se:_/widget/render/recobarinvitation" }, share: { url: ":socialhost:/:session_prefix::im_prefix:_/widget/render/share?usegapi=1" }, comments: { params: { location: ["search", "hash"] }, url: ":socialhost:/:session_prefix:_/widget/render/comments?usegapi=1", methods: ["scroll", "openwindow"] }, autocomplete: { params: { url: "" }, url: ":socialhost:/:session_prefix:_/widget/render/autocomplete" }, ratingbadge: { url: "https://www.google.com/shopping/customerreviews/badge?usegapi=1" }, appcirclepicker: { url: ":socialhost:/:session_prefix:_/widget/render/appcirclepicker" }, follow: { url: ":socialhost:/:session_prefix:_/widget/render/follow?usegapi=1" }, sharetoclassroom: { url: "https://www.gstatic.com/classroom/sharewidget/widget_stable.html?usegapi=1" }, ytshare: { params: { url: "" }, url: ":socialhost:/:session_prefix:_/widget/render/ytshare?usegapi=1" }, family_creation: { params: { url: "" }, url: "https://families.google.com/webcreation?usegapi=1&usegapi=1" }, configurator: { url: ":socialhost:/:session_prefix:_/plusbuttonconfigurator?usegapi=1" }, savetowallet: { url: "https://androidpay.google.com/a/widget/save" } } }, h: "m;/_/scs/apps-static/_/js/k=oz.gapi.en_GB.wmmKD3kqAbs.O/m=__features__/am=AQE/rt=j/d=1/rs=AGLTcCOHxIMAn3d_F-655lXeEVi9zyQyVQ", u: "https://apis.google.com/js/platform.js", hee: !0, fp: "8293def0774ce8745a6547a3e9942bca532cc81d", dpo: !1 }, platform: ["additnow", "backdrop", "blogger", "comments", "commentcount", "community", "family_creation", "follow", "hangout", "page", "partnersbadge", "person", "playemm", "playreview", "plus", "plusone", "post", "savetoandroidpay", "savetodrive", "savetowallet", "shortlists", "signin2", "udc_webconsentflow", "visibility", "youtube", "ytsubscribe", "zoomableimage", "sharetoclassroom", "donation", "ratingbadge", "surveyoptin"], fp: "8293def0774ce8745a6547a3e9942bca532cc81d", annotation: ["interactivepost", "recobar", "signin2", "autocomplete", "profile"], bimodal: ["signin", "share"] } });