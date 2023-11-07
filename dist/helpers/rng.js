"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rng = (min, max, decimal = 1) => {
    const str = (Math.random() * (max - min) + min).toFixed(decimal);
    return parseFloat(str);
};
exports.default = rng;
//# sourceMappingURL=rng.js.map