"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../models/User");
const getUserPokeball = async (_id) => {
    const user = await User_1.User.findOne({ _id }).exec();
    const refreshes = user.pokeball.refreshes.filter((refreshAt) => refreshAt > new Date().getTime());
    await User_1.User.findOne({ _id }).updateOne({
        pokeball: {
            max: user.pokeball.max,
            refreshes: refreshes,
        },
    });
    const current = user.pokeball.max - refreshes.length;
    const max = user.pokeball.max;
    return { current, max, refreshAfter: refreshes[0] ?? null };
};
exports.default = getUserPokeball;
//# sourceMappingURL=pokeball.js.map