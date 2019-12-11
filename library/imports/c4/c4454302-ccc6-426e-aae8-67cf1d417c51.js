"use strict";
cc._RF.push(module, 'c4454MCzMZCbqroZ88dQXxR', 'PlateController');
// Script/Controller/PlateController.js

'use strict';

window.Global = {
    plateController: null,
    lineController: null
    // map:null
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
        emptyPostions: []
        // map:[],       
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
        this.blockSize = 94;
        var x_0 = 2 * this.blockSize / Math.sqrt(3);
        for (var i = 0; i < 6; i++) {
            // let row = [];
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
                    if (j % 2 == 0) {
                        block.setPosition(cc.v2(j * Math.sqrt(3) * this.blockSize + x_0, this.blockSize + 2 * this.blockSize * i));
                    } else {
                        block.setPosition(cc.v2(j * Math.sqrt(3) * this.blockSize + x_0, 2 * this.blockSize + 2 * this.blockSize * i));
                    }
                }
            }
        }
    },
    generateFallingBall: function generateFallingBall() {
        this.fallingBall = new Set();
        for (var i = 0; i < this.ballArea.children.length; i++) {
            if (this.ballArea.children[i].name != "effectArea") {
                var oriBall = this.ballArea.children[i];
                if (oriBall.parent != null) {
                    var distance = 0;
                    for (var j = 0; j < this.emptyPostions.length; j++) {
                        var ball = this.emptyPostions[j];
                        if (oriBall.column == ball.column) {
                            if (oriBall.row > ball.row) {
                                distance += 1;
                                continue;
                            }
                        }
                    }
                    if (distance > 0) {
                        oriBall.distance = distance;
                        this.fallingBall.add(oriBall);
                    }
                }
            }
        }
    },
    generateNewBalls: function generateNewBalls() {
        var balls = {
            '0': 0,
            '1': 0,
            '2': 0,
            '3': 0,
            '4': 0,
            '5': 0,
            '6': 0
        };
        for (var i = 0; i < this.emptyPostions.length; i++) {
            var ball = this.emptyPostions[i];
            balls[ball.column] += 1;
        }
        for (var key in balls) {
            if (balls.hasOwnProperty(key)) {
                var count = balls[key];
                if (count > 0) {
                    for (var _i = 0; _i < count; _i++) {
                        var _ball = cc.instantiate(this.ballPrefabs[this.randomRangeInt(0, 5)]);
                        _ball.children[0].active = false;
                        _ball.width = 150;
                        _ball.height = 150;
                        _ball.column = Number(key);
                        if (_ball.column % 2 != 0) {
                            _ball.row = 5 + _i;
                        } else {
                            _ball.row = 6 + _i;
                        }
                        this.ballArea.addChild(_ball);
                        if (_ball.column % 2 == 0) {
                            _ball.setPosition(cc.v2(_ball.column * Math.sqrt(3) * this.blockSize + 2 * this.blockSize / Math.sqrt(3), this.blockSize + 2 * this.blockSize * _ball.row));
                        } else {
                            _ball.setPosition(cc.v2(_ball.column * Math.sqrt(3) * this.blockSize + 2 * this.blockSize / Math.sqrt(3), 2 * this.blockSize + 2 * this.blockSize * _ball.row));
                        }
                    }
                }
            }
        }
    },
    updateBall: function updateBall() {
        var that = this;
        this.fallingBall.forEach(function (ball, i) {
            ball.getComponent("Ball").fallDown(ball.distance);
            ball.distance = 0;
        });
        this.fallingBall = []; //完成下坠队列
        this.emptyPostions.forEach(function (v, i) {
            v.destroy();
        });
        this.emptyPostions = []; //回收删除的珠子
    },
    onLoad: function onLoad() {
        this.drawBalls();
        this.effectArea.zIndex = 1;
        cc.log(this.effectArea);
        this.isInPlayAni = false;
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        Global.plateController = this;
        Global.lineController = this.lineArea.getComponent('LineController');
        // Global.map = this.map;
    },
    start: function start() {}
}

// update (dt) {},
);

cc._RF.pop();