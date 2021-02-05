'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var styled = require('styled-components');
var ramda = require('ramda');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var styled__default = /*#__PURE__*/_interopDefaultLegacy(styled);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
}

var Vector2 = /** @class */ (function () {
    function Vector2(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    Vector2.prototype.add = function (v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    };
    Vector2.prototype.addVectors = function (a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        return this;
    };
    Vector2.prototype.multiplyScalar = function (scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    };
    return Vector2;
}());

var lerp = function (v0, v1, t) { return v0 * (1 - t) + v1 * t; };
var uid = (function () {
    var count = 0;
    return function () { return count++; };
})();
var createNewParticle = function (launchPoint, palette) {
    var id = uid();
    var _a = launchPoint(), x = _a.x, y = _a.y, angleProp = _a.angle, spreadAngleProp = _a.spreadAngle, foreground = _a.foreground;
    var p = 1; //window.innerWidth / 800;
    var initialVelocity = lerp(20, 40, Math.random() * p);
    var spreadAngle = ramda.isNil(spreadAngleProp) ? Math.PI / 15 : spreadAngleProp;
    var angleCorrection = angleProp + Math.PI;
    var angle = angleCorrection + lerp(-spreadAngle / 2, spreadAngle / 2, Math.random());
    return {
        id: id,
        width: lerp(4, 40, Math.random()),
        height: lerp(4, 20, Math.random()),
        rotation: Math.random() * Math.PI,
        rotationVelocity: lerp(-1, 1, Math.random()),
        position: new Vector2(x, y),
        velocity: new Vector2(Math.sin(angle) * initialVelocity, Math.cos(angle) * initialVelocity),
        friction: foreground
            ? lerp(0.98, 0.99, Math.random())
            : lerp(0.96, 0.97, Math.random()),
        color: palette[Math.floor(Math.random() * palette.length)],
    };
};
var drawParticle = function (ctx, particle) {
    // first save the untranslated/unrotated context
    if (!ctx) {
        return;
    }
    var position = particle.position, width = particle.width, height = particle.height, rotation = particle.rotation, color = particle.color;
    var x = position.x, y = position.y;
    ctx.save();
    ctx.beginPath();
    // move the rotation point to the center of the rect
    ctx.translate(x + width / 2, y + height / 2);
    // rotate the rect
    ctx.rotate(rotation);
    // draw the rect on the transformed context
    // Note: after transforming [0,0] is visually [x,y]
    //       so the rect needs to be offset accordingly when drawn
    ctx.rect(-width / 2, -height / 2, width, height);
    ctx.fillStyle = color;
    ctx.fill();
    // restore the context to its untranslated/not-rotated state
    ctx.restore();
};

var Wrapper = styled__default['default'].div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  pointer-events: none;\n"], ["\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  pointer-events: none;\n"])));
var Confetti = function (_a) {
    var launchPointsProp = _a.launchPoints, _b = _a.burstAmount, burstAmount = _b === void 0 ? 150 : _b, _c = _a.afterBurstAmount, afterBurstAmount = _c === void 0 ? 50 : _c, _d = _a.gravity, gravityProp = _d === void 0 ? new Vector2(0, 0.1) : _d, onEnd = _a.onEnd, _e = _a.delay, delay = _e === void 0 ? 0 : _e, _f = _a.palette, palette = _f === void 0 ? ['#25DEB3', '#00A8FF', '#EE295C', '#FFF027', '#66BEEC'] : _f, restProps = __rest(_a, ["launchPoints", "burstAmount", "afterBurstAmount", "gravity", "onEnd", "delay", "palette"]);
    var canvasRef = React.useRef(null);
    var active = React.useRef(false);
    var particles = React.useRef([]);
    var maxParticles = burstAmount + afterBurstAmount;
    var particlesSpawnCount = React.useRef(0);
    var launchPointsFallback = React.useMemo(function () { return [
        function () { return ({
            x: window.innerWidth / 2,
            y: window.innerHeight,
            angle: 0,
            spreadAngle: Math.PI,
        }); },
    ]; }, []);
    // Handle delay
    var _g = React.useState(false), delayDone = _g[0], setDelayDone = _g[1];
    React.useEffect(function () {
        if (!delay) {
            setDelayDone(true);
        }
        var t = setTimeout(function () { return setDelayDone(true); }, delay);
        return function () { return clearTimeout(t); };
    }, [delay]);
    var lastGravity = React.useRef(new Vector2(0, 0.1));
    var gravity = React.useMemo(function () {
        if (gravityProp.x !== lastGravity.current.x ||
            gravityProp.y !== lastGravity.current.y) {
            return gravityProp;
        }
        return lastGravity.current;
    }, [gravityProp]);
    var launchPoints = launchPointsProp || launchPointsFallback;
    var handleEnd = React.useCallback(function () {
        if (onEnd) {
            onEnd();
        }
        // TODO: setEnded state and render null
        active.current = false;
    }, [onEnd]);
    React.useEffect(function () {
        if (!delayDone) {
            return;
        }
        launchPoints.forEach(function (launchPoint) {
            for (var i = 0, n = burstAmount; i < n; i++) {
                particles.current.push(createNewParticle(launchPoint, palette));
            }
        });
    }, [delayDone, particles, launchPoints, burstAmount, palette]);
    React.useLayoutEffect(function () {
        if (!delayDone) {
            return;
        }
        var canvas = canvasRef && canvasRef.current;
        var ctx = canvas && canvas.getContext && canvas.getContext('2d');
        if (!ctx) {
            return;
        }
        active.current = true;
        var spawner = setInterval(function () {
            launchPoints.forEach(function (launchPoint) {
                particles.current.push(createNewParticle(launchPoint, palette));
                particlesSpawnCount.current++;
            });
            if (particlesSpawnCount.current > maxParticles) {
                clearInterval(spawner);
            }
        }, 1000 / 30);
        var cleaner = setInterval(function () {
            particles.current = particles.current.filter(function (particle) { return particle.position.y < window.innerHeight + 200; });
            if (particlesSpawnCount.current > 0 && particles.current.length <= 0) {
                clearInterval(cleaner);
                handleEnd();
            }
        }, 1000);
        var render = function () {
            if (!active.current) {
                return;
            }
            if (canvas) {
                // Empty and resize the canvas
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
            for (var i = 0, n = particles.current.length; i < n; i++) {
                var particle = particles.current[i];
                if (particle.position.y > window.innerHeight + 200) {
                    continue;
                }
                particle.velocity.multiplyScalar(particle.friction);
                particle.rotationVelocity *= particle.friction;
                particle.velocity.add(gravity);
                particle.position.add(particle.velocity);
                particle.rotation += particle.rotationVelocity;
                drawParticle(ctx, particle);
            }
        };
        var rafRender = function () { return requestAnimationFrame(render); };
        var renderer = setInterval(rafRender, 1000 / 60);
        return function () {
            active.current = false;
            clearInterval(spawner);
            clearInterval(cleaner);
            clearInterval(renderer);
            particles.current = [];
        };
    }, [
        delayDone,
        canvasRef,
        particles,
        particlesSpawnCount,
        maxParticles,
        launchPoints,
        handleEnd,
        palette,
        gravity,
    ]);
    return (React__default['default'].createElement(Wrapper, __assign({}, restProps),
        React__default['default'].createElement("canvas", { ref: canvasRef, width: window.innerWidth, height: window.innerHeight })));
};
var templateObject_1;

exports.Confetti = Confetti;
