(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Model/Ball.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'f4536Unbw9Lt7fN5sfDG8bC', 'Ball', __filename);
// Script/Model/Ball.js

'use strict';

var _Config = require('../Config/Config');

cc.Class({
    extends: cc.Component,

    properties: {
        type: {
            get: function get() {
                return this.node.name;
            }
        },
        x: {
            get: function get() {
                return this.node.x;
            }
        },
        y: {
            get: function get() {
                return this.node.y;
            }
        },
        row: {
            get: function get() {
                return this.node.row;
            },
            set: function set(num) {
                this.node.row = num;
            }
        },
        column: {
            get: function get() {
                return this.node.column;
            },
            set: function set(num) {
                this.node.column = num;
            }
        }
    },
    filterBalls: function filterBalls(balls, type) {
        //筛选球
        var returnBalls = [];
        for (var i = 0; i < balls.length; i++) {
            var fiballs = balls.filter(function (v) {
                return v.name == type;
            });
            fiballs.forEach(function (element) {
                returnBalls.push(element);
            });
        }
        return returnBalls;
    },
    roundBalls: function roundBalls(ball) {
        //返回周围球(ball传入最后入队列的球)
        if (Math.abs(ball.row - this.row) < 2 && Math.abs(ball.column - this.column) < 2) {
            return true;
        } else {
            return false;
        }
    },
    alreadyConnected: function alreadyConnected(ball) {
        //验证球是否已经在队列里
        if (this.lineController.connectedBalls.includes(ball)) {
            if (this.lineController.connectedBalls.indexOf(ball) == this.lineController.connectedBalls.length - 2) return true;else {
                return 'nothing';
            }
        } else {
            return false;
        }
    },

    // LIFE-CYCLE CALLBACKS:
    touchRelease: function touchRelease(eventTouch) {
        var _this = this;

        this.plateController.effectArea.active = false;
        this.node.zIndex = 0;
        this.canConnectballs.forEach(function (v) {
            v.zIndex = 0;
        });
        //检测是否可消除
        if (this.lineController.connectedBalls.length >= 3) {
            this.emptyPositionX = [];
            this.emptyPositionY = [];
            this.lineController.connectedBalls.forEach(function (v) {
                _this.plateController.emptyPostions.push(v);
                v.removeFromParent(false);
            });
            this.plateController.generateFallingBall();
            // this.plateController.computeFallingDistance();
            this.plateController.updateBall();
            this.lineController.clearLines();
        }
        this.dot.parent = null;
        this.lineController.connectedBalls = [];
    },
    setListener: function setListener() {
        this.node.on(cc.Node.EventType.TOUCH_START, function (eventTouch) {
            this.plateController.effectArea.active = true; //激活遮罩
            this.node.zIndex = 1; //设置选中珠子盖在遮罩上
            this.canConnectballs = this.filterBalls(this.plateController.balls, this.node.name);
            this.canConnectballs.forEach(function (v) {
                v.zIndex = 1;
            }); //设置所有同颜色珠子盖在遮罩上
            if (!this.dot) this.dot = cc.instantiate(this.plateController.dotPrefab); //创建触摸点
            this.dot.parent = this.lineController.node; //触摸点添加到LineArea
            this.dot.setPosition(this.node.getPosition()); //设置触摸点位置为圆心
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (eventTouch) {
            this.dot.setPosition(this.node.parent.convertToNodeSpaceAR(eventTouch.touch._point));
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_END, this.touchRelease, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchRelease, this);
    },

    onCollisionEnter: function onCollisionEnter(other, self) {
        if (this.lineController.connectedBalls.length == 0) {
            this.lineController.connectedBalls.push(self.node);
            // cc.log(this.lineController.connectedBalls)
        } else {
            if (self.node.zIndex == 1) {
                //判断高亮
                if (this.roundBalls(this.lineController.connectedBalls[this.lineController.connectedBalls.length - 1])) {
                    //判断附近球
                    switch (this.alreadyConnected(self.node)) {
                        case false:
                            //添加到队列里
                            this.lineController.connectedBalls.push(self.node);
                            this.lineController.drawLine();
                            break;
                        case true:
                            //从队列里删除
                            this.lineController.connectedBalls.pop(self.node);
                            this.lineController.clearLastLine();
                            break;
                        case 'nothing':
                            //什么都不做
                            break;
                    }
                }
                // cc.log(this.lineController.connectedBalls)
            }
        }
    },
    fallDown: function fallDown(_distance) {
        var fallAction = null;
        fallAction = cc.moveBy(0.5 * _distance, 0, -188 * _distance);
        this.node.runAction(fallAction);
        this.node.row = this.node.row - _distance;
    },
    onLoad: function onLoad() {
        this.setListener();
        this.plateController = this.node.parent.parent.getComponent("PlateController");
        this.lineController = this.node.parent.parent.children[1].getComponent("LineController");
    },
    start: function start() {}
}

// update (dt) {},
); // Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=Ball.js.map
        