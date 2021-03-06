/*
 Highcharts JS v5.0.14 (2017-07-28)
 Boost module

 (c) 2010-2017 Highsoft AS
 Author: Torstein Honsi

 License: www.highcharts.com/license
*/
(function(r) {
    "object" === typeof module && module.exports ? module.exports = r : r(Highcharts)
})(function(r) {
    (function(h) {
        function r() {
            var a = Array.prototype.slice.call(arguments),
                c = -Number.MAX_VALUE;
            B(a, function(a) {
                if ("undefined" !== typeof a && "undefined" !== typeof a.length && 0 < a.length) return c = a.length, !0
            });
            return c
        }

        function z(a) {
            var c = 0,
                d;
            if (1 < a.series.length)
                for (var f = 0; f < a.series.length; f++) d = a.series[f], r(d.processedXData, d.options.data, d.points) >= (d.options.boostThreshold || Number.MAX_VALUE) && c++;
            return 5 <
                c || a.series.length >= E(a.options.boost && a.options.boost.seriesThreshold, 50)
        }

        function A(a) {
            return z(a.chart) || r(a.processedXData, a.options.data, a.points) >= (a.options.boostThreshold || Number.MAX_VALUE)
        }

        function da(a) {
            function c(b, c) {
                c = a.createShader("vertex" === c ? a.VERTEX_SHADER : a.FRAGMENT_SHADER);
                a.shaderSource(c, b);
                a.compileShader(c);
                return a.getShaderParameter(c, a.COMPILE_STATUS) ? c : !1
            }

            function d() {
                function d(b) {
                    return a.getUniformLocation(l, b)
                }
                var e = c("#version 100\nprecision highp float;\nattribute vec4 aVertexPosition;\nattribute vec4 aColor;\nvarying highp vec2 position;\nvarying highp vec4 vColor;\nuniform mat4 uPMatrix;\nuniform float pSize;\nuniform float translatedThreshold;\nuniform bool hasThreshold;\nuniform bool skipTranslation;\nuniform float xAxisTrans;\nuniform float xAxisMin;\nuniform float xAxisMinPad;\nuniform float xAxisPointRange;\nuniform float xAxisLen;\nuniform bool  xAxisPostTranslate;\nuniform float xAxisOrdinalSlope;\nuniform float xAxisOrdinalOffset;\nuniform float xAxisPos;\nuniform bool  xAxisCVSCoord;\nuniform float yAxisTrans;\nuniform float yAxisMin;\nuniform float yAxisMinPad;\nuniform float yAxisPointRange;\nuniform float yAxisLen;\nuniform bool  yAxisPostTranslate;\nuniform float yAxisOrdinalSlope;\nuniform float yAxisOrdinalOffset;\nuniform float yAxisPos;\nuniform bool  yAxisCVSCoord;\nuniform bool  isBubble;\nuniform bool  bubbleSizeByArea;\nuniform float bubbleZMin;\nuniform float bubbleZMax;\nuniform float bubbleZThreshold;\nuniform float bubbleMinSize;\nuniform float bubbleMaxSize;\nuniform bool  bubbleSizeAbs;\nuniform bool  isInverted;\nfloat bubbleRadius(){\nfloat value \x3d aVertexPosition.w;\nfloat zMax \x3d bubbleZMax;\nfloat zMin \x3d bubbleZMin;\nfloat radius \x3d 0.0;\nfloat pos \x3d 0.0;\nfloat zRange \x3d zMax - zMin;\nif (bubbleSizeAbs){\nvalue \x3d value - bubbleZThreshold;\nzMax \x3d max(zMax - bubbleZThreshold, zMin - bubbleZThreshold);\nzMin \x3d 0.0;\n}\nif (value \x3c zMin){\nradius \x3d bubbleZMin / 2.0 - 1.0;\n} else {\npos \x3d zRange \x3e 0.0 ? (value - zMin) / zRange : 0.5;\nif (bubbleSizeByArea \x26\x26 pos \x3e 0.0){\npos \x3d sqrt(pos);\n}\nradius \x3d ceil(bubbleMinSize + pos * (bubbleMaxSize - bubbleMinSize)) / 2.0;\n}\nreturn radius * 2.0;\n}\nfloat translate(float val,\nfloat pointPlacement,\nfloat localA,\nfloat localMin,\nfloat minPixelPadding,\nfloat pointRange,\nfloat len,\nbool  cvsCoord\n){\nfloat sign \x3d 1.0;\nfloat cvsOffset \x3d 0.0;\nif (cvsCoord) {\nsign *\x3d -1.0;\ncvsOffset \x3d len;\n}\nreturn sign * (val - localMin) * localA + cvsOffset + \n(sign * minPixelPadding);\n}\nfloat xToPixels(float value){\nif (skipTranslation){\nreturn value;// + xAxisPos;\n}\nreturn translate(value, 0.0, xAxisTrans, xAxisMin, xAxisMinPad, xAxisPointRange, xAxisLen, xAxisCVSCoord);// + xAxisPos;\n}\nfloat yToPixels(float value, float checkTreshold){\nfloat v;\nif (skipTranslation){\nv \x3d value;// + yAxisPos;\n} else {\nv \x3d translate(value, 0.0, yAxisTrans, yAxisMin, yAxisMinPad, yAxisPointRange, yAxisLen, yAxisCVSCoord);// + yAxisPos;\n}\nif (checkTreshold \x3e 0.0 \x26\x26 hasThreshold) {\nv \x3d min(v, translatedThreshold);\n}\nreturn v;\n}\nvoid main(void) {\nif (isBubble){\ngl_PointSize \x3d bubbleRadius();\n} else {\ngl_PointSize \x3d pSize;\n}\nvColor \x3d aColor;\nif (isInverted) {\ngl_Position \x3d uPMatrix * vec4(xToPixels(aVertexPosition.y) + yAxisPos, yToPixels(aVertexPosition.x, aVertexPosition.z) + xAxisPos, 0.0, 1.0);\n} else {\ngl_Position \x3d uPMatrix * vec4(xToPixels(aVertexPosition.x) + xAxisPos, yToPixels(aVertexPosition.y, aVertexPosition.z) + yAxisPos, 0.0, 1.0);\n}\n}",
                    "vertex"),
                    f = c("precision highp float;\nuniform vec4 fillColor;\nvarying highp vec2 position;\nvarying highp vec4 vColor;\nuniform sampler2D uSampler;\nuniform bool isCircle;\nuniform bool hasColor;\nvoid main(void) {\nvec4 col \x3d fillColor;\nif (hasColor) {\ncol \x3d vColor;\n}\nif (isCircle) {\ngl_FragColor \x3d col * texture2D(uSampler, gl_PointCoord.st);\n} else {\ngl_FragColor \x3d col;\n}\n}", "fragment");
                if (!e || !f) return l = !1;
                l = a.createProgram();
                a.attachShader(l, e);
                a.attachShader(l, f);
                a.linkProgram(l);
                a.useProgram(l);
                a.bindAttribLocation(l, 0, "aVertexPosition");
                h = d("uPMatrix");
                g = d("pSize");
                n = d("fillColor");
                Q = d("isBubble");
                k = d("bubbleSizeAbs");
                v = d("bubbleSizeByArea");
                C = d("uSampler");
                b = d("skipTranslation");
                p = d("isCircle");
                H = d("isInverted");
                return !0
            }

            function f(b, c) {
                b = e[b] = e[b] || a.getUniformLocation(l, b);
                a.uniform1f(b, c)
            }
            var e = {}, l, h, g, n, Q, k, v, b, p, H, C;
            a && d();
            return {
                psUniform: function() {
                    return g
                },
                pUniform: function() {
                    return h
                },
                fillColorUniform: function() {
                    return n
                },
                setBubbleUniforms: function(b, c, d) {
                    var e =
                        b.options,
                        l = Number.MAX_VALUE,
                        h = -Number.MAX_VALUE;
                    "bubble" === b.type && (l = E(e.zMin, Math.min(l, Math.max(c, !1 === e.displayNegative ? e.zThreshold : -Number.MAX_VALUE))), h = E(e.zMax, Math.max(h, d)), a.uniform1i(Q, 1), a.uniform1i(p, 1), a.uniform1i(v, "width" !== b.options.sizeBy), a.uniform1i(k, b.options.sizeByAbsoluteValue), f("bubbleZMin", l), f("bubbleZMax", h), f("bubbleZThreshold", b.options.zThreshold), f("bubbleMinSize", b.minPxSize), f("bubbleMaxSize", b.maxPxSize))
                },
                bind: function() {
                    a.useProgram(l)
                },
                program: function() {
                    return l
                },
                create: d,
                setUniform: f,
                setPMatrix: function(b) {
                    a.uniformMatrix4fv(h, !1, b)
                },
                setColor: function(b) {
                    a.uniform4f(n, b[0] / 255, b[1] / 255, b[2] / 255, b[3])
                },
                setPointSize: function(b) {
                    a.uniform1f(g, b)
                },
                setSkipTranslation: function(c) {
                    a.uniform1i(b, !0 === c ? 1 : 0)
                },
                setTexture: function() {
                    a.uniform1i(C, 0)
                },
                setDrawAsCircle: function(b) {
                    a.uniform1i(p, b ? 1 : 0)
                },
                reset: function() {
                    a.uniform1i(Q, 0);
                    a.uniform1i(p, 0)
                },
                setInverted: function(b) {
                    a.uniform1i(H, b)
                },
                destroy: function() {
                    a && l && a.deleteProgram(l)
                }
            }
        }

        function U(a, c, d) {
            var f = !1,
                e = !1,
                l = d || 2,
                h = !1,
                g = 0,
                n;
            return {
                destroy: function() {
                    f && a.deleteBuffer(f)
                },
                bind: function() {
                    if (!f) return !1;
                    a.vertexAttribPointer(e, l, a.FLOAT, !1, 0, 0)
                },
                data: n,
                build: function(d, k, g) {
                    n = d || [];
                    if (!(n && 0 !== n.length || h)) return f = !1;
                    l = g || l;
                    f && a.deleteBuffer(f);
                    f = a.createBuffer();
                    a.bindBuffer(a.ARRAY_BUFFER, f);
                    a.bufferData(a.ARRAY_BUFFER, h || new Float32Array(n), a.STATIC_DRAW);
                    e = a.getAttribLocation(c.program(), k);
                    a.enableVertexAttribArray(e);
                    return !0
                },
                render: function(c, d, e) {
                    var b = h ? h.length : n.length;
                    if (!f || !b) return !1;
                    if (!c || c > b || 0 > c) c = 0;
                    if (!d || d > b) d = b;
                    a.drawArrays(a[(e || "points").toUpperCase()], c / l, (d - c) / l);
                    return !0
                },
                allocate: function(a) {
                    g = -1;
                    h = new Float32Array(4 * a)
                },
                push: function(a, c, d, b) {
                    h && (h[++g] = a, h[++g] = c, h[++g] = d, h[++g] = b)
                }
            }
        }

        function ea(a) {
            function c(a) {
                var b, c;
                return A(a) ? (b = !! a.options.stacking, c = a.xData || a.options.xData || a.processedXData, b = (b ? a.data : c || a.options.data).length, "treemap" === a.type ? b *= 12 : "heatmap" === a.type ? b *= 6 : V[a.type] && (b *= 2), b) : 0
            }

            function d() {
                b.clear(b.COLOR_BUFFER_BIT | b.DEPTH_BUFFER_BIT)
            }

            function f(a, b) {
                function c(a) {
                    a && (b.colorData.push(a[0]), b.colorData.push(a[1]), b.colorData.push(a[2]), b.colorData.push(a[3]))
                }

                function d(a, b, d, e, f) {
                    c(f);
                    q.usePreallocated ? v.push(a, b, d ? 1 : 0, e || 1) : (C.push(a), C.push(b), C.push(d ? 1 : 0), C.push(e || 1))
                }

                function e(a, b, e, f, w) {
                    c(w);
                    d(a + e, b);
                    c(w);
                    d(a, b);
                    c(w);
                    d(a, b + f);
                    c(w);
                    d(a, b + f);
                    c(w);
                    d(a + e, b + f);
                    c(w);
                    d(a + e, b)
                }

                function f(a) {
                    q.useGPUTranslations || (b.skipTranslation = !0, a.x = D.toPixels(a.x, !0), a.y = x.toPixels(a.y, !0));
                    d(a.x, a.y, 0, 2)
                }
                var w = a.pointArrayMap && "low,high" ===
                    a.pointArrayMap.join(","),
                    k = a.chart,
                    m = a.options,
                    l = !! m.stacking,
                    g = m.data,
                    n = a.xAxis.getExtremes(),
                    p = n.min,
                    t = n.max,
                    n = a.yAxis.getExtremes(),
                    u = n.min,
                    z = n.max,
                    n = a.xData || m.xData || a.processedXData,
                    H = a.yData || m.yData || a.processedYData,
                    r = a.zData || m.zData || a.processedZData,
                    x = a.yAxis,
                    D = a.xAxis,
                    A = !n || 0 === n.length,
                    y = a.points || !1,
                    F = !1,
                    G, L, M, J = l ? a.data : n || g,
                    I = {
                        x: Number.MIN_VALUE,
                        y: 0
                    }, E = {
                        x: Number.MIN_VALUE,
                        y: 0
                    };
                m.boostData && 0 < m.boostData.length || (a.closestPointRangePx = Number.MAX_VALUE, y && 0 < y.length ? (b.skipTranslation = !0, b.drawMode = "triangles", y[0].node && y[0].node.levelDynamic && y.sort(function(a, b) {
                    if (a.node) {
                        if (a.node.levelDynamic > b.node.levelDynamic) return 1;
                        if (a.node.levelDynamic < b.node.levelDynamic) return -1
                    }
                    return 0
                }), B(y, function(b) {
                    var c = b.plotY,
                        d;
                    "undefined" === typeof c || isNaN(c) || null === b.y || (c = b.shapeArgs, d = b.series.pointAttribs(b), b = d["stroke-width"] || 0, L = h.color(d.fill).rgba, L[0] /= 255, L[1] /= 255, L[2] /= 255, "treemap" === a.type && (b = b || 1, M = h.color(d.stroke).rgba, M[0] /= 255, M[1] /= 255, M[2] /= 255, e(c.x, c.y, c.width,
                        c.height, M), b /= 2), "heatmap" === a.type && k.inverted && (c.x = D.len - c.x, c.y = x.len - c.y, c.width = -c.width, c.height = -c.height), e(c.x + b, c.y + b, c.width - 2 * b, c.height - 2 * b, L))
                })) : (B(J, function(c, e) {
                    var f, m, h, g = !1,
                        N = !1,
                        W = !1,
                        n = !1,
                        fa = V[a.type],
                        v = !1,
                        y = !0;
                    if ("undefined" === typeof k.index) return !1;
                    A ? (f = c[0], m = c[1], J[e + 1] && (N = J[e + 1][0]), J[e - 1] && (g = J[e - 1][0]), 3 <= c.length && (h = c[2], c[2] > b.zMax && (b.zMax = c[2]), c[2] < b.zMin && (b.zMin = c[2]))) : (f = c, m = H[e], J[e + 1] && (N = J[e + 1]), J[e - 1] && (g = J[e - 1]), r && r.length && (h = r[e], r[e] > b.zMax && (b.zMax =
                        r[e]), r[e] < b.zMin && (b.zMin = r[e])));
                    N && N >= p && N <= t && (W = !0);
                    g && g >= p && g <= t && (n = !0);
                    w ? (A && (m = c.slice(1, 3)), m = m[1]) : l && (f = c.x, m = c.stackY);
                    a.requireSorting || (y = m >= u && m <= z);
                    f > t && E.x < t && (E.x = f, E.y = m);
                    f < p && I.x < p && (I.x = f, I.y = m);
                    if (0 === m || m && y)
                        if (f >= p && f <= t && (v = !0), v || W || n) q.useGPUTranslations || (b.skipTranslation = !0, f = D.toPixels(f, !0), m = x.toPixels(m, !0)), fa && (G = 0, 0 > m && (G = m, m = 0), q.useGPUTranslations || (G = x.toPixels(G, !0)), d(f, G, 0, 0, !1)), b.hasMarkers && !1 !== F && (a.closestPointRangePx = Math.min(a.closestPointRangePx,
                            Math.abs(f - F))), d(f, m, 0, "bubble" === a.type ? h || 1 : 2, !1), F = f
                }), F || (f(I), f(E))))
            }

            function e() {
                t = [];
                F.data = C = [];
                x = []
            }

            function l(a) {
                k && (k.setUniform("xAxisTrans", a.transA), k.setUniform("xAxisMin", a.min), k.setUniform("xAxisMinPad", a.minPixelPadding), k.setUniform("xAxisPointRange", a.pointRange), k.setUniform("xAxisLen", a.len), k.setUniform("xAxisPos", a.pos), k.setUniform("xAxisCVSCoord", !a.horiz))
            }

            function g(a) {
                k && (k.setUniform("yAxisTrans", a.transA), k.setUniform("yAxisMin", a.min), k.setUniform("yAxisMinPad",
                    a.minPixelPadding), k.setUniform("yAxisPointRange", a.pointRange), k.setUniform("yAxisLen", a.len), k.setUniform("yAxisPos", a.pos), k.setUniform("yAxisCVSCoord", !a.horiz))
            }

            function u(a, b) {
                k.setUniform("hasThreshold", a);
                k.setUniform("translatedThreshold", b)
            }

            function n(c) {
                if (c) p = c.chartWidth || 800, H = c.chartHeight || 400;
                else return !1; if (!b || !p || !H) return !1;
                q.timeRendering && console.time("gl rendering");
                k.bind();
                b.viewport(0, 0, p, H);
                k.setPMatrix([2 / p, 0, 0, 0, 0, -(2 / H), 0, 0, 0, 0, -2, 0, -1, 1, -1, 1]);
                1 < q.lineWidth && !h.isMS &&
                    b.lineWidth(q.lineWidth);
                v.build(F.data, "aVertexPosition", 4);
                v.bind();
                r && (b.bindTexture(b.TEXTURE_2D, D), k.setTexture(D));
                k.setInverted(c.options.chart ? c.options.chart.inverted : !1);
                B(t, function(a, c) {
                    var d = a.series.options,
                        e = d.threshold,
                        f = K(e),
                        e = a.series.yAxis.getThreshold(e),
                        m = E(d.marker ? d.marker.enabled : null, a.series.xAxis.isRadial ? !0 : null, a.series.closestPointRangePx > 2 * ((d.marker ? d.marker.radius : 10) || 10)),
                        w = a.series.fillOpacity ? (new X(a.series.color)).setOpacity(E(d.fillOpacity, .85)).get() : a.series.color;
                    v.bind();
                    d.colorByPoint && (w = a.series.chart.options.colors[c]);
                    w = h.color(w).rgba;
                    q.useAlpha || (w[3] = 1);
                    "add" === d.boostBlending ? (b.blendFunc(b.SRC_ALPHA, b.ONE), b.blendEquation(b.FUNC_ADD)) : "mult" === d.boostBlending ? b.blendFunc(b.DST_COLOR, b.ZERO) : "darken" === d.boostBlending ? (b.blendFunc(b.ONE, b.ONE), b.blendEquation(b.FUNC_MIN)) : b.blendFuncSeparate(b.SRC_ALPHA, b.ONE_MINUS_SRC_ALPHA, b.ONE, b.ONE_MINUS_SRC_ALPHA);
                    k.reset();
                    0 < a.colorData.length && (k.setUniform("hasColor", 1), c = U(b, k), c.build(a.colorData, "aColor",
                        4), c.bind());
                    k.setColor(w);
                    l(a.series.xAxis);
                    g(a.series.yAxis);
                    u(f, e);
                    "points" === a.drawMode && (d.marker && d.marker.radius ? k.setPointSize(2 * d.marker.radius) : k.setPointSize(1));
                    k.setSkipTranslation(a.skipTranslation);
                    "bubble" === a.series.type && k.setBubbleUniforms(a.series, a.zMin, a.zMax);
                    k.setDrawAsCircle(ga[a.series.type] && r || !1);
                    v.render(a.from, a.to, a.drawMode);
                    a.hasMarkers && m && (d.marker && d.marker.radius ? k.setPointSize(2 * d.marker.radius) : k.setPointSize(10), k.setDrawAsCircle(!0), v.render(a.from, a.to, "POINTS"))
                });
                v.destroy();
                q.timeRendering && console.timeEnd("gl rendering");
                e();
                a && a()
            }

            function z(a) {
                d();
                if (a.renderer.forExport) return n(a);
                y ? n(a) : setTimeout(function() {
                    z(a)
                }, 1)
            }
            var k = !1,
                v = !1,
                b = !1,
                p = 0,
                H = 0,
                C = !1,
                x = !1,
                r = !1,
                F = {}, y = !1,
                t = [],
                G = R.createElement("canvas"),
                I = G.getContext("2d"),
                D, V = {
                    column: !0,
                    area: !0
                }, ga = {
                    scatter: !0,
                    bubble: !0
                }, q = {
                    pointSize: 1,
                    lineWidth: 3,
                    fillColor: "#AA00AA",
                    useAlpha: !0,
                    usePreallocated: !1,
                    useGPUTranslations: !1,
                    timeRendering: !1,
                    timeSeriesProcessing: !1,
                    timeSetup: !1
                };
            return F = {
                allocateBufferForSingleSeries: function(a) {
                    var b =
                        0;
                    q.usePreallocated && (A(a) && (b = c(a)), v.allocate(b))
                },
                pushSeries: function(a) {
                    0 < t.length && (t[t.length - 1].to = C.length, t[t.length - 1].hasMarkers && (t[t.length - 1].markerTo = x.length));
                    q.timeSeriesProcessing && console.time("building " + a.type + " series");
                    t.push({
                        from: C.length,
                        markerFrom: x.length,
                        colorData: [],
                        series: a,
                        zMin: Number.MAX_VALUE,
                        zMax: -Number.MAX_VALUE,
                        hasMarkers: a.options.marker ? !1 !== a.options.marker.enabled : !1,
                        showMarksers: !0,
                        drawMode: {
                            area: "lines",
                            arearange: "lines",
                            areaspline: "line_strip",
                            column: "lines",
                            line: "line_strip",
                            scatter: "points",
                            heatmap: "triangles",
                            treemap: "triangles",
                            bubble: "points"
                        }[a.type] || "line_strip"
                    });
                    f(a, t[t.length - 1]);
                    q.timeSeriesProcessing && console.timeEnd("building " + a.type + " series")
                },
                setSize: function(a, b) {
                    if (p !== a || b !== b) p = a, H = b, k.bind(), k.setPMatrix([2 / p, 0, 0, 0, 0, -(2 / H), 0, 0, 0, 0, -2, 0, -1, 1, -1, 1])
                },
                inited: function() {
                    return y
                },
                setThreshold: u,
                init: function(a, c) {
                    var d = 0,
                        f = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"];
                    y = !1;
                    if (!a) return !1;
                    for (q.timeSetup && console.time("gl setup"); d <
                        f.length && !(b = a.getContext(f[d])); d++);
                    if (b) c || e();
                    else return !1;
                    b.enable(b.BLEND);
                    b.blendFunc(b.SRC_ALPHA, b.ONE_MINUS_SRC_ALPHA);
                    b.disable(b.DEPTH_TEST);
                    b.depthMask(b.FALSE);
                    k = da(b);
                    v = U(b, k);
                    r = !1;
                    D = b.createTexture();
                    G.width = 512;
                    G.height = 512;
                    I.fillStyle = "#FFF";
                    I.beginPath();
                    I.arc(256, 256, 256, 0, 2 * Math.PI);
                    I.fill();
                    try {
                        b.bindTexture(b.TEXTURE_2D, D), b.texImage2D(b.TEXTURE_2D, 0, b.RGBA, b.RGBA, b.UNSIGNED_BYTE, G), b.texParameteri(b.TEXTURE_2D, b.TEXTURE_WRAP_S, b.CLAMP_TO_EDGE), b.texParameteri(b.TEXTURE_2D,
                            b.TEXTURE_WRAP_T, b.CLAMP_TO_EDGE), b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MAG_FILTER, b.LINEAR), b.texParameteri(b.TEXTURE_2D, b.TEXTURE_MIN_FILTER, b.LINEAR_MIPMAP_LINEAR), b.generateMipmap(b.TEXTURE_2D), b.bindTexture(b.TEXTURE_2D, null), r = !0
                    } catch (ma) {}
                    y = !0;
                    q.timeSetup && console.timeEnd("gl setup");
                    return !0
                },
                render: z,
                settings: q,
                valid: function() {
                    return !1 !== b
                },
                clear: d,
                flush: e,
                setXAxis: l,
                setYAxis: g,
                data: C,
                gl: function() {
                    return b
                },
                allocateBuffer: function(a) {
                    var b = 0;
                    q.usePreallocated && (B(a.series, function(a) {
                        A(a) &&
                            (b += c(a))
                    }), v.allocate(b))
                },
                destroy: function() {
                    v.destroy();
                    k.destroy();
                    b && (D && b.deleteTexture(D), b.canvas.width = 1, b.canvas.height = 1)
                },
                setOptions: function(a) {
                    ha(!0, q, a)
                }
            }
        }

        function Y(a, c) {
            var d = a.chartWidth,
                f = a.chartHeight,
                e = a,
                l = a.seriesGroup || c.group,
                e = z(a) ? a : c;
            e.image || (e.canvas = R.createElement("canvas"), e.image = a.renderer.image("", 0, 0, d, f).add(l), e.boostClipRect = a.renderer.clipRect(a.plotLeft, a.plotTop, a.plotWidth, a.chartHeight), e.image.clip(e.boostClipRect), e instanceof h.Chart && (e.markerGroup =
                e.renderer.g().add(l), e.markerGroup.translate(c.xAxis.pos, c.yAxis.pos)));
            e.canvas.width = d;
            e.canvas.height = f;
            e.image.attr({
                x: 0,
                y: 0,
                width: d,
                height: f,
                style: "pointer-events: none"
            });
            e.boostClipRect.attr({
                x: a.plotLeft,
                y: a.plotTop,
                width: a.plotWidth,
                height: a.chartHeight
            });
            e.ogl || (e.ogl = ea(function() {
                e.image.attr({
                    href: e.canvas.toDataURL("image/png")
                });
                e.ogl.destroy();
                e.ogl = !1
            }), e.ogl.init(e.canvas), e.ogl.setOptions(a.options.boost || {}), e instanceof h.Chart && e.ogl.allocateBuffer(a));
            e.ogl.setSize(d, f);
            return e.ogl
        }

        function Z(a, c, d) {
            a && c.image && c.canvas && !z(d || c.chart) && a.render(d || c.chart)
        }

        function aa(a, c) {
            a && c.image && c.canvas && !z(c.chart) && a.allocateBufferForSingleSeries(c)
        }

        function O(a, c, d, f, e, h) {
            e = e || 0;
            f = f || 5E4;
            for (var g = e + f, l = !0; l && e < g && e < a.length;) l = c(a[e], e), ++e;
            l && (e < a.length ? h ? O(a, c, d, f, e, h) : P.requestAnimationFrame ? P.requestAnimationFrame(function() {
                O(a, c, d, f, e)
            }) : setTimeout(function() {
                O(a, c, d, f, e)
            }) : d && d())
        }

        function ia(a) {
            if (!A(this)) return a.call(this);
            if (a = Y(this.chart, this)) aa(a, this), a.pushSeries(this);
            Z(a, this)
        }
        var P = h.win,
            R = P.document,
            ja = function() {}, X = h.Color,
            x = h.Series,
            g = h.seriesTypes,
            B = h.each,
            ba = h.extend,
            ca = h.addEvent,
            ka = h.fireEvent,
            la = h.grep,
            K = h.isNumber,
            ha = h.merge,
            E = h.pick,
            u = h.wrap,
            S = h.getOptions().plotOptions,
            T;
        X.prototype.names = {
            aliceblue: "#f0f8ff",
            antiquewhite: "#faebd7",
            aqua: "#00ffff",
            aquamarine: "#7fffd4",
            azure: "#f0ffff",
            beige: "#f5f5dc",
            bisque: "#ffe4c4",
            black: "#000000",
            blanchedalmond: "#ffebcd",
            blue: "#0000ff",
            blueviolet: "#8a2be2",
            brown: "#a52a2a",
            burlywood: "#deb887",
            cadetblue: "#5f9ea0",
            chartreuse: "#7fff00",
            chocolate: "#d2691e",
            coral: "#ff7f50",
            cornflowerblue: "#6495ed",
            cornsilk: "#fff8dc",
            crimson: "#dc143c",
            cyan: "#00ffff",
            darkblue: "#00008b",
            darkcyan: "#008b8b",
            darkgoldenrod: "#b8860b",
            darkgray: "#a9a9a9",
            darkgreen: "#006400",
            darkkhaki: "#bdb76b",
            darkmagenta: "#8b008b",
            darkolivegreen: "#556b2f",
            darkorange: "#ff8c00",
            darkorchid: "#9932cc",
            darkred: "#8b0000",
            darksalmon: "#e9967a",
            darkseagreen: "#8fbc8f",
            darkslateblue: "#483d8b",
            darkslategray: "#2f4f4f",
            darkturquoise: "#00ced1",
            darkviolet: "#9400d3",
            deeppink: "#ff1493",
            deepskyblue: "#00bfff",
            dimgray: "#696969",
            dodgerblue: "#1e90ff",
            feldspar: "#d19275",
            firebrick: "#b22222",
            floralwhite: "#fffaf0",
            forestgreen: "#228b22",
            fuchsia: "#ff00ff",
            gainsboro: "#dcdcdc",
            ghostwhite: "#f8f8ff",
            gold: "#ffd700",
            goldenrod: "#daa520",
            gray: "#808080",
            green: "#008000",
            greenyellow: "#adff2f",
            honeydew: "#f0fff0",
            hotpink: "#ff69b4",
            indianred: "#cd5c5c",
            indigo: "#4b0082",
            ivory: "#fffff0",
            khaki: "#f0e68c",
            lavender: "#e6e6fa",
            lavenderblush: "#fff0f5",
            lawngreen: "#7cfc00",
            lemonchiffon: "#fffacd",
            lightblue: "#add8e6",
            lightcoral: "#f08080",
            lightcyan: "#e0ffff",
            lightgoldenrodyellow: "#fafad2",
            lightgrey: "#d3d3d3",
            lightgreen: "#90ee90",
            lightpink: "#ffb6c1",
            lightsalmon: "#ffa07a",
            lightseagreen: "#20b2aa",
            lightskyblue: "#87cefa",
            lightslateblue: "#8470ff",
            lightslategray: "#778899",
            lightsteelblue: "#b0c4de",
            lightyellow: "#ffffe0",
            lime: "#00ff00",
            limegreen: "#32cd32",
            linen: "#faf0e6",
            magenta: "#ff00ff",
            maroon: "#800000",
            mediumaquamarine: "#66cdaa",
            mediumblue: "#0000cd",
            mediumorchid: "#ba55d3",
            mediumpurple: "#9370d8",
            mediumseagreen: "#3cb371",
            mediumslateblue: "#7b68ee",
            mediumspringgreen: "#00fa9a",
            mediumturquoise: "#48d1cc",
            mediumvioletred: "#c71585",
            midnightblue: "#191970",
            mintcream: "#f5fffa",
            mistyrose: "#ffe4e1",
            moccasin: "#ffe4b5",
            navajowhite: "#ffdead",
            navy: "#000080",
            oldlace: "#fdf5e6",
            olive: "#808000",
            olivedrab: "#6b8e23",
            orange: "#ffa500",
            orangered: "#ff4500",
            orchid: "#da70d6",
            palegoldenrod: "#eee8aa",
            palegreen: "#98fb98",
            paleturquoise: "#afeeee",
            palevioletred: "#d87093",
            papayawhip: "#ffefd5",
            peachpuff: "#ffdab9",
            peru: "#cd853f",
            pink: "#ffc0cb",
            plum: "#dda0dd",
            powderblue: "#b0e0e6",
            purple: "#800080",
            red: "#ff0000",
            rosybrown: "#bc8f8f",
            royalblue: "#4169e1",
            saddlebrown: "#8b4513",
            salmon: "#fa8072",
            sandybrown: "#f4a460",
            seagreen: "#2e8b57",
            seashell: "#fff5ee",
            sienna: "#a0522d",
            silver: "#c0c0c0",
            skyblue: "#87ceeb",
            slateblue: "#6a5acd",
            slategray: "#708090",
            snow: "#fffafa",
            springgreen: "#00ff7f",
            steelblue: "#4682b4",
            tan: "#d2b48c",
            teal: "#008080",
            thistle: "#d8bfd8",
            tomato: "#ff6347",
            turquoise: "#40e0d0",
            violet: "#ee82ee",
            violetred: "#d02090",
            wheat: "#f5deb3",
            white: "#ffffff",
            whitesmoke: "#f5f5f5",
            yellow: "#ffff00",
            yellowgreen: "#9acd32"
        };
        x.prototype.getPoint = function(a) {
            var c = a,
                d = this.xData || this.options.xData || this.processedXData || !1;
            !a || a instanceof this.pointClass || (c = (new this.pointClass).init(this, this.options.data[a.i], d ? d[a.i] : void 0), c.category = c.x, c.dist = a.dist, c.distX = a.distX, c.plotX = a.plotX, c.plotY = a.plotY, c.index = a.i);
            return c
        };
        u(x.prototype, "searchPoint", function(a) {
            return this.getPoint(a.apply(this, [].slice.call(arguments, 1)))
        });
        u(x.prototype, "destroy", function(a) {
            var c = this,
                d =
                    c.chart;
            d.markerGroup === c.markerGroup && (c.markerGroup = null);
            d.hoverPoints && (d.hoverPoints = la(d.hoverPoints, function(a) {
                return a.series === c
            }));
            d.hoverPoint && d.hoverPoint.series === c && (d.hoverPoint = null);
            a.call(this)
        });
        u(x.prototype, "getExtremes", function(a) {
            if (!A(this) || !this.hasExtremes || !this.hasExtremes()) return a.apply(this, Array.prototype.slice.call(arguments, 1))
        });
        B("area arearange column line scatter heatmap bubble treemap heatmap".split(" "), function(a) {
            S[a] && (S[a].boostThreshold = 5E3, S[a].boostData = [])
        });
        B(["translate", "generatePoints", "drawTracker", "drawPoints", "render"], function(a) {
            function c(c) {
                var d = this.options.stacking && ("translate" === a || "generatePoints" === a);
                if (!A(this) || d || "heatmap" === this.type || "treemap" === this.type) "render" === a && this.image && !z(this.chart) && (this.image.attr({
                    href: ""
                }), this.animate = null), c.call(this);
                else if (this[a + "Canvas"]) this[a + "Canvas"]()
            }
            u(x.prototype, a, c);
            "translate" === a && (g.column && u(g.column.prototype, a, c), g.arearange && u(g.arearange.prototype, a, c), g.treemap &&
                u(g.treemap.prototype, a, c), g.heatmap && u(g.heatmap.prototype, a, c))
        });
        (function() {
            var a = 0,
                c, d = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"],
                f = !1;
            if ("undefined" !== typeof P.WebGLRenderingContext)
                for (c = R.createElement("canvas"); a < d.length; a++) try {
                    if (f = c.getContext(d[a]), "undefined" !== typeof f && null !== f) return !0
                } catch (e) {}
            return !1
        })() ? (u(x.prototype, "processData", function(a) {
                A(this) && "heatmap" !== this.type && "treemap" !== this.type || a.apply(this, Array.prototype.slice.call(arguments, 1));
                this.hasExtremes &&
                    this.hasExtremes(!0) || a.apply(this, Array.prototype.slice.call(arguments, 1))
            }), h.extend(x.prototype, {
                pointRange: 0,
                directTouch: !1,
                allowDG: !1,
                hasExtremes: function(a) {
                    var c = this.options,
                        d = this.xAxis && this.xAxis.options,
                        f = this.yAxis && this.yAxis.options;
                    return c.data.length > (c.boostThreshold || Number.MAX_VALUE) && K(f.min) && K(f.max) && (!a || K(d.min) && K(d.max))
                },
                destroyGraphics: function() {
                    var a = this,
                        c = this.points,
                        d, f;
                    if (c)
                        for (f = 0; f < c.length; f += 1)(d = c[f]) && d.graphic && (d.graphic = d.graphic.destroy());
                    B(["graph",
                        "area", "tracker"
                    ], function(c) {
                        a[c] && (a[c] = a[c].destroy())
                    })
                },
                renderCanvas: function() {
                    var a = this,
                        c = a.options || {}, d = !1,
                        f = a.chart,
                        e = this.xAxis,
                        h = this.yAxis,
                        g = c.xData || a.processedXData,
                        r = c.yData || a.processedYData,
                        n = c.data,
                        d = e.getExtremes(),
                        x = d.min,
                        k = d.max,
                        d = h.getExtremes(),
                        v = d.min,
                        b = d.max,
                        p = {}, u, C = !! a.sampling,
                        A, E = !1 !== c.enableMouseTracking,
                        F = h.getThreshold(c.threshold),
                        y = a.pointArrayMap && "low,high" === a.pointArrayMap.join(","),
                        t = !! c.stacking,
                        G = a.cropStart || 0,
                        I = a.requireSorting,
                        D = !g,
                        B, K, q, w, m = function(a,
                            b, c) {
                            T = a + "," + b;
                            E && !p[T] && (p[T] = !0, f.inverted && (a = e.len - a, b = h.len - b), A.push({
                                clientX: a,
                                plotX: a,
                                plotY: b,
                                i: G + c
                            }))
                        }, d = Y(f, a);
                    this.visible ? ((this.points || this.graph) && this.destroyGraphics(), z(f) ? this.markerGroup = f.markerGroup : this.markerGroup = a.plotGroup("markerGroup", "markers", !0, 1, f.seriesGroup), A = this.points = [], a.buildKDTree = ja, d && (aa(d, this), d.pushSeries(a), Z(d, this, f)), O(t ? a.data : g || n, function(a, c) {
                            var d, g, l, n = "undefined" === typeof f.index,
                                p = !0;
                            if (!n && (D ? (d = a[0], g = a[1]) : (d = a, g = r[c]), y ? (D && (g = a.slice(1,
                                3)), l = g[0], g = g[1]) : t && (d = a.x, g = a.stackY, l = g - a.y), I || (p = g >= v && g <= b), null !== g && d >= x && d <= k && p))
                                if (a = Math.ceil(e.toPixels(d, !0)), C) {
                                    if (void 0 === q || a === u) {
                                        y || (l = g);
                                        if (void 0 === w || g > K) K = g, w = c;
                                        if (void 0 === q || l < B) B = l, q = c
                                    }
                                    a !== u && (void 0 !== q && (g = h.toPixels(K, !0), F = h.toPixels(B, !0), m(a, g, w), F !== g && m(a, F, q)), q = w = void 0, u = a)
                                } else g = Math.ceil(h.toPixels(g, !0)), m(a, g, c);
                            return !n
                        }, function() {
                            ka(a, "renderedCanvas");
                            a.directTouch = !1;
                            a.options.stickyTracking = !0;
                            delete a.buildKDTree;
                            a.buildKDTree()
                        }, f.renderer.forExport ?
                        Number.MAX_VALUE : void 0)) : !z(f) && d && (d.clear(), this.image.attr({
                        href: ""
                    }))
                }
            }), B(["heatmap", "treemap"], function(a) {
                g[a] && (u(g[a].prototype, "drawPoints", ia), g[a].prototype.directTouch = !1)
            }), g.bubble && (delete g.bubble.prototype.buildKDTree, g.bubble.prototype.directTouch = !1, u(g.bubble.prototype, "markerAttribs", function(a) {
                return A(this) ? !1 : a.apply(this, [].slice.call(arguments, 1))
            })), g.scatter.prototype.fill = !0, ba(g.area.prototype, {
                fill: !0,
                fillOpacity: !0,
                sampling: !0
            }), ba(g.column.prototype, {
                fill: !0,
                sampling: !0
            }),
            u(x.prototype, "setVisible", function(a, c) {
                a.call(this, c, !1);
                !1 === this.visible && this.ogl && this.canvas && this.image ? (this.ogl.clear(), this.image.attr({
                    href: ""
                })) : this.chart.redraw()
            }), h.Chart.prototype.callbacks.push(function(a) {
                ca(a, "predraw", function() {
                    !z(a) && a.didBoost && (a.didBoost = !1, a.image && a.image.attr({
                        href: ""
                    }));
                    a.canvas && a.ogl && z(a) && (a.didBoost = !0, a.ogl.allocateBuffer(a));
                    a.markerGroup && a.xAxis && 0 < a.xAxis.length && a.yAxis && 0 < a.yAxis.length && a.markerGroup.translate(a.xAxis[0].pos, a.yAxis[0].pos)
                });
                ca(a, "render", function() {
                    a.ogl && z(a) && a.ogl.render(a)
                })
            })) : "undefined" !== typeof h.initCanvasBoost ? h.initCanvasBoost() : h.error(26)
    })(r)
});