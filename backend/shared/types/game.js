"use strict";
// Shared types for game logic
Object.defineProperty(exports, "__esModule", { value: true });
exports.WIN_LINES = void 0;
// Win detection
exports.WIN_LINES = [
    [0, 1, 2], // Row 1
    [3, 4, 5], // Row 2
    [6, 7, 8], // Row 3
    [0, 3, 6], // Col 1
    [1, 4, 7], // Col 2
    [2, 5, 8], // Col 3
    [0, 4, 8], // Diagonal 1
    [2, 4, 6], // Diagonal 2
];
//# sourceMappingURL=game.js.map