"use strict";
cc._RF.push(module, 'c5a82JVH1JONZcN6e7He/Bf', 'LineController');
// Script/Model/LineController.js

"use strict";

// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        line: cc.Prefab,
        lines: [],
        connectedBalls: []

    },
    drawLines: function drawLines() {
        if (this.connectedBalls.length > 1) {
            for (var i = 0, j = 1; i < this.connectedBalls.length - 1; i++, j++) {
                var beginBall = this.connectedBalls[i];
                var endBall = this.connectedBalls[j];
                var line = cc.instantiate(this.line);
                line.parent = this.node;
                this.lines.push(line);
                cc.log(this.lines);
                line.setPosition(endBall.getPosition().add(beginBall.getPosition()).div(2));
                endBall = endBall;
                beginBall = beginBall;
                var t = new cc.Vec2(100, 0);
                var angleBE = beginBall.getPosition().sub(endBall.getPosition());
                if (angleBE.x < 0 && angleBE.y < 0 || angleBE.x > 0 && angleBE.y < 0) {
                    line.rotation = 180 + t.angle(beginBall.getPosition().sub(endBall.getPosition())) * 180 / Math.PI;
                } else if (angleBE.x == 0 && angleBE.y < 0) {
                    line.rotation = -t.angle(beginBall.getPosition().sub(endBall.getPosition())) * 180 / Math.PI;
                } else {
                    line.rotation = 180 - t.angle(beginBall.getPosition().sub(endBall.getPosition())) * 180 / Math.PI;
                }
            }
        }
    },
    drawLine: function drawLine() {
        if (this.connectedBalls.length > 1) {
            var beginBall = this.connectedBalls[this.connectedBalls.length - 2];
            var endBall = this.connectedBalls[this.connectedBalls.length - 1];
            var line = cc.instantiate(this.line);
            line.parent = this.node;
            this.lines.push(line);
            line.setPosition(endBall.getPosition().add(beginBall.getPosition()).div(2));
            var t = new cc.Vec2(100, 0);
            var angleBE = beginBall.getPosition().sub(endBall.getPosition());
            if (angleBE.x < 0 && angleBE.y < 0 || angleBE.x > 0 && angleBE.y < 0) {
                line.rotation = 180 + t.angle(beginBall.getPosition().sub(endBall.getPosition())) * 180 / Math.PI;
            } else if (angleBE.x == 0 && angleBE.y < 0) {
                line.rotation = -t.angle(beginBall.getPosition().sub(endBall.getPosition())) * 180 / Math.PI;
            } else {
                line.rotation = 180 - t.angle(beginBall.getPosition().sub(endBall.getPosition())) * 180 / Math.PI;
            }
        }
    },
    clearLines: function clearLines() {
        this.lines.forEach(function (v) {
            v.destroy();
        });
        this.lines = [];
    },
    clearLastLine: function clearLastLine() {
        this.lines[this.lines.length - 1].destroy();
        this.lines[this.lines.length - 1].removeFromParent(false);
        this.lines.pop();
        cc.log(this.lines);
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {

        // this.node.children[0].on(cc.Node.EventType.TOUCH_MOVE,function(e){
        //     this.setPosition(this.parent.convertToNodeSpaceAR(e.touch._point));
        // },this.node.children[0])
    },
    start: function start() {}
}

// update (dt) {},
);

cc._RF.pop();