"use strict";
cc._RF.push(module, '5d6b9qS3VpKFLWdOpKyR1Ho', 'Config');
// Script/Config/Config.js

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var CELL_TYPE = exports.CELL_TYPE = {
    EMPTY: 0,
    A: 1,
    B: 2,
    C: 3,
    D: 4,
    E: 5,
    F: 6,
    BIRD: 7
};

var CELL_BASENUM = exports.CELL_BASENUM = 6;
var CELL_STATUS = exports.CELL_STATUS = {
    COMMON: 0,
    CLICK: "click",
    LINE: "line",
    COLUMN: "column",
    WRAP: "wrap",
    BIRD: "bird"
};

var GRID_WIDTH = exports.GRID_WIDTH = 6;
var GRID_HEIGHT = exports.GRID_HEIGHT = 6;

var CELL_WIDTH = exports.CELL_WIDTH = 70;
var CELL_HEIGHT = exports.CELL_HEIGHT = 70;

var GRID_PIXEL_WIDTH = exports.GRID_PIXEL_WIDTH = GRID_WIDTH * CELL_WIDTH;
var GRID_PIXEL_HEIGHT = exports.GRID_PIXEL_HEIGHT = GRID_HEIGHT * CELL_HEIGHT;

// ********************   时间表  animation time **************************
var ANITIME = exports.ANITIME = {
    DOWN: 0.1,
    BOMB_DELAY: 0.3,
    BOMB_BIRD_DELAY: 0.7,
    DIE_SHAKE: 0.4 // 死前抖动
};

cc._RF.pop();