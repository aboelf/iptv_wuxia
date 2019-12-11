import {
    ANITIME
} from '../Config/Config';
cc.Class({
    extends: cc.Component,

    properties: {
        type: {
            get() {
                return this.node.name;
            }
        },
        x: {
            get() {
                return this.node.x;
            }
        },
        y: {
            get() {
                return this.node.y;
            }
        },
        row: {
            get() {
                return this.node.row;
            },
            set(num) {
                this.node.row = num;
            }
        },
        column: {
            get() {
                return this.node.column;
            },
            set(num) {
                this.node.column = num;
            }
        },
    },
    filterBalls(balls, type) { //筛选球
        let returnBalls = [];
        for (let i = 0; i < balls.length; i++) {
            let fiballs = balls.filter(function (v) {
                return v.name == type
            });
            fiballs.forEach(element => {
                returnBalls.push(element);
            });
        }
        return returnBalls;
    },
    roundBalls(ball) { //返回周围球(ball传入最后入队列的球)
        if (Math.abs(ball.row - this.row) < 2 && Math.abs(ball.column - this.column) < 2) {
            return true;
        } else {
            return false;
        }
    },
    alreadyConnected(ball) { //验证球是否已经在队列里
        if (this.lineController.connectedBalls.includes(ball)) {
            if(this.lineController.connectedBalls.indexOf(ball)==this.lineController.connectedBalls.length-2)
                return true;
            else{
                return 'nothing';
            }
        } else {
            return false;
        }
    },
    // LIFE-CYCLE CALLBACKS:
    touchRelease(eventTouch) {
        this.plateController.effectArea.active = false;
        this.node.zIndex = 0;
        this.canConnectballs.forEach(function (v) {
            v.zIndex = 0;
        })
        //检测是否可消除
        if(this.lineController.connectedBalls.length>=3){
            this.emptyPositionX = [];
            this.emptyPositionY = [];
            this.lineController.connectedBalls.forEach(v=>{
                this.plateController.emptyPostions.push(v);
                v.removeFromParent(false);
            })
            this.plateController.generateNewBalls();
            this.plateController.generateFallingBall();
            this.plateController.updateBall();
            this.lineController.clearLines();
        }else{
            this.lineController.clearLines();
        }
        this.dot.parent = null;
        this.lineController.connectedBalls = [];
    },
    
    setListener() {
        this.node.on(cc.Node.EventType.TOUCH_START, function (eventTouch) {
            this.plateController.effectArea.active = true; //激活遮罩
            this.node.zIndex = 1; //设置选中珠子盖在遮罩上
            this.canConnectballs = this.filterBalls(this.plateController.ballArea.children, this.node.name);
            this.canConnectballs.forEach(v => {
                v.zIndex = 1;
            }) //设置所有同颜色珠子盖在遮罩上
            if(!this.dot)
                this.dot = cc.instantiate(this.plateController.dotPrefab); //创建触摸点
            this.dot.parent = this.lineController.node; //触摸点添加到LineArea
            this.dot.setPosition(this.node.getPosition()); //设置触摸点位置为圆心
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (eventTouch) {
            this.dot.setPosition(this.node.parent.convertToNodeSpaceAR(eventTouch.touch._point));
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_END, this.touchRelease, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchRelease, this);
    },
    onCollisionEnter: function (other, self) {
        if (this.lineController.connectedBalls.length == 0) {
            this.lineController.connectedBalls.push(self.node);
            // cc.log(this.lineController.connectedBalls)
        } else {
            if (self.node.zIndex == 1) { //判断高亮
                if (this.roundBalls(this.lineController.connectedBalls[this.lineController.connectedBalls.length - 1])) { //判断附近球
                    switch(this.alreadyConnected(self.node)){
                        case false://添加到队列里
                            this.lineController.connectedBalls.push(self.node);
                            this.lineController.drawLine();
                            break;
                        case true://从队列里删除
                            this.lineController.connectedBalls.pop(self.node);
                            this.lineController.clearLastLine();
                            break;
                        case 'nothing'://什么都不做
                            break;
                    }
                }
                // cc.log(this.lineController.connectedBalls)
            }
        }
    },
    fallDown(_distance){
        let fallAction = null;
        fallAction = cc.moveBy(ANITIME.DOWN*_distance,0,-188*_distance);
        this.node.runAction(fallAction);
        this.node.row=this.node.row-_distance;
    },
    onLoad() {
        this.setListener();
        this.plateController = this.node.parent.parent.getComponent("PlateController");
        this.lineController = this.node.parent.parent.children[1].getComponent("LineController");
        
    },

    start() {

    },

    // update (dt) {},
});