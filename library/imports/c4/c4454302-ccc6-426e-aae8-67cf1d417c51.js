"use strict";
cc._RF.push(module, 'c4454MCzMZCbqroZ88dQXxR', 'PlateController');
// Script/Controller/PlateController.js

'use strict';

var _Config = require('../Config/Config');

window.Global = {
    plateController: null,
    lineController: null,
    map: null
};
cc.Class({
    extends: cc.Component,

    properties: {
        blockPrefab: cc.Prefab,
        dotPrefab: cc.Prefab,
        debug: true,
        ballPrefabs: {
            default: [],
            type: [cc.Prefab]
        },
        ballArea: cc.Node,
        lineArea: cc.Node,
        effectArea: cc.Node,
        emptyPostions: [],
        balls: [],
        map: []
    },

    // LIFE-CYCLE CALLBACKS:
    randomRange: function randomRange(min, max) {
        return Math.random() * (max - min) + min;
    },
    randomRangeInt: function randomRangeInt(min, max) {
        if (arguments.length == 2) {
            return Math.floor(this.randomRange(min, max));
        } else if (arguments.length == 1) {
            return arguments[0][Math.floor(this.randomRange(0, arguments[0].length))];
        }
    },

    //根据this.map绘制珠盘
    drawBalls: function drawBalls() {
        // this.blockSize = (this.node.width-this.gap*(GRID_WIDTH+1))/GRID_WIDTH;
        this.blockSize = 94;
        var x_0 = 2 * this.blockSize / Math.sqrt(3);
        var y_0 = this.blockSize;
        for (var i = 0; i < 6; i++) {
            var row = [];
            for (var j = 0; j < 7; j++) {
                if (i == 5 && j % 2 != 0) {
                    //删除顶端3个珠子
                } else {
                    var block = cc.instantiate(this.ballPrefabs[this.randomRangeInt(0, 5)]);
                    if (this.debug) {
                        block.children[0].color = new cc.Color(0, 0, 0);
                        block.children[0].getComponent(cc.Label).string = i + ' ' + j;
                    } else {
                        block.children[0].active = false;
                    }
                    block.width = 150;
                    block.height = 150;
                    block.row = i;
                    block.column = j;
                    this.ballArea.addChild(block);
                    this.balls.push(block);
                    if (j % 2 == 0) {
                        block.setPosition(cc.v2(j * Math.sqrt(3) * this.blockSize + x_0, this.blockSize + 2 * this.blockSize * i));
                    } else {
                        block.setPosition(cc.v2(j * Math.sqrt(3) * this.blockSize + x_0, 2 * this.blockSize + 2 * this.blockSize * i));
                    }
                    row.push(block.getPosition());
                }
            }
            this.map.push(row);
        }
    },
    generateFallingBall: function generateFallingBall() {
        this.fallingBall = [];
        for (var i = 0; i < this.balls.length; i++) {
            var oriBall = this.balls[i];
            if (oriBall.parent != null) {
                var mark = false;
                for (var j = 0; j < this.emptyPostions.length; j++) {
                    var ball = this.emptyPostions[j];
                    if (oriBall.column == ball.column) {
                        if (oriBall.row > ball.row) {
                            this.fallingBall.push(oriBall);
                            mark = true;
                            break;
                        }
                    }
                }
                if (mark) {
                    continue;
                }
            }
        }
    },
    computeFallingDistance: function computeFallingDistance() {
        this.fallingDistance = { '0': 0, '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0 };
        for (var i = 0; i < this.emptyPostions.length; i++) {
            this.fallingDistance[this.emptyPostions[i].column] += 1;
        }
    },
    updateBall: function updateBall() {
        var that = this;
        this.fallingBall.forEach(function (ball, i) {
            ball.getComponent("Ball").fallDown(that.fallingDistance[ball.getComponent("Ball").column]);
        });
        this.fallingBall = []; //完成下坠队列
        this.emptyPostions.forEach(function (v, i) {
            v.destroy();
        });
        this.emptyPostions = []; //回收删除的珠子
    },
    onLoad: function onLoad() {
        // this.drawBgBlocks();
        // this.generateMap();
        this.drawBalls();
        this.effectArea.zIndex = 1;
        cc.log(this.effectArea);
        this.isInPlayAni = false;
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        Global.plateController = this;
        Global.lineController = this.lineArea.getComponent('LineController');
        Global.map = this.map;
    },
    start: function start() {}
}

// update (dt) {},
);

cc._RF.pop();