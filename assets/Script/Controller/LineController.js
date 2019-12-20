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
        connectedBalls: [],
        
    },
    drawLines() {
        if (this.connectedBalls.length > 1) {
            for (let i = 0, j = 1; i < this.connectedBalls.length - 1; i++, j++) {
                let beginBall = this.connectedBalls[i];
                let endBall = this.connectedBalls[j];
                let line = cc.instantiate(this.line);
                line.parent = this.node;
                this.lines.push(line)
                cc.log(this.lines)
                line.setPosition(endBall.getPosition().add(beginBall.getPosition()).div(2))
                endBall=endBall;
                beginBall=beginBall;
                let t = new cc.Vec2(100,0);
                let angleBE=beginBall.getPosition().sub(endBall.getPosition());
                if((angleBE.x<0 && angleBE.y<0) || (angleBE.x>0 && angleBE.y<0)){
                    line.angle=-(180+t.angle(beginBall.getPosition().sub(endBall.getPosition()))*180/Math.PI);
                }else if(angleBE.x==0 && angleBE.y<0){
                    line.angle=t.angle(beginBall.getPosition().sub(endBall.getPosition()))*180/Math.PI
                }else{
                    line.angle=-(180-t.angle(beginBall.getPosition().sub(endBall.getPosition()))*180/Math.PI);
                }
            }
        }
    },
    drawLine(){
        if (this.connectedBalls.length > 1){
            let beginBall = this.connectedBalls[this.connectedBalls.length-2];
            let endBall = this.connectedBalls[this.connectedBalls.length-1];
            let line = cc.instantiate(this.line);
            line.parent = this.node;
            this.lines.push(line)
            line.setPosition(endBall.getPosition().add(beginBall.getPosition()).div(2));
            let t = new cc.Vec2(100,0);
            let angleBE=beginBall.getPosition().sub(endBall.getPosition());
            if((angleBE.x<0 && angleBE.y<0) || (angleBE.x>0 && angleBE.y<0)){
                line.angle=-(180+t.angle(beginBall.getPosition().sub(endBall.getPosition()))*180/Math.PI);
            }else if(angleBE.x==0 && angleBE.y<0){
                line.angle=t.angle(beginBall.getPosition().sub(endBall.getPosition()))*180/Math.PI
            }else{
                line.angle=-(180-t.angle(beginBall.getPosition().sub(endBall.getPosition()))*180/Math.PI);
            }
        }
    },
    clearLines(){
        this.lines.forEach(function(v){
            v.destroy();
        })
        this.lines = [];
    },
    clearLastLine(){
        this.lines[this.lines.length-1].destroy();
        this.lines[this.lines.length-1].removeFromParent(false);
        this.lines.pop();
        cc.log(this.lines);
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        // this.node.children[0].on(cc.Node.EventType.TOUCH_MOVE,function(e){
        //     this.setPosition(this.parent.convertToNodeSpaceAR(e.touch._point));
        // },this.node.children[0])
    },

    start() {

    },

    // update (dt) {},
});