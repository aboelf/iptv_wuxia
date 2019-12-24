import {
    ANITIME,randomRange,randomRangeInt
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
        // let returnBalls = [];
        // for (let i = 0; i < balls.length; i++) {
        //     let fiballs = balls.filter(function (v) {
        //         return v.name == type
        //     });
        //     fiballs.forEach(element => {
        //         returnBalls.push(element);
        //     });
        // }
        // return returnBalls;
        let fiballs = balls.filter(function (v) {
            return v.name == type
        });
        return fiballs;
    },
    roundBalls(ball) { //返回周围球(ball传入最后入队列的球)
        if(ball.column==this.column){
            if(Math.abs(ball.row-this.row)==1){
                return true;
            }else{
                return false
            }
        }else{
            if(ball.column%2==0){
                if(Math.abs(this.column-ball.column)==1){
                    if(this.row==ball.row || this.row==ball.row-1){
                        return true;
                    }else{
                        return false;
                    }
                }else{
                    return false;
                }
            }else{
                if(Math.abs(this.column-ball.column)==1){
                    if(this.row==ball.row || this.row==ball.row+1){
                        return true;
                    }else{
                        return false;
                    }
                }else{
                    return false;
                }
            }
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
        //无论是否消除先将zIndex为2的珠子改为0
        this.node.zIndex=0;
        this.canConnectballs.forEach(function (v) {
            v.zIndex = 0;
        })
        //检测是否可消除
        if(this.lineController.connectedBalls.length>=3){
            this.plateController.deleteBalls(this.lineController.connectedBalls);
            this.plateController.generateNewBalls();
            this.plateController.countBallsFallingDistance();
            this.plateController.updateBall();
            this.lineController.clearLines();
            // if(this.lineController.connectedBalls.length>=5){
                //播放莲花动画，炸=>删除珠子=>生成新珠子=>计算掉落距离=>执行掉落
                // this.plateController.blockArea.active = false;
                // this.plateController.deleteBalls(this.plateController.getRoundBalls(this.plateController.ballArea.children[randomRangeInt(0,39)]))
                // this.plateController.generateNewBalls();
                // this.plateController.countBallsFallingDistance();
                // this.plateController.updateBall();
            // }
        }else{
            this.lineController.clearLines();
            this.plateController.blockArea.active=false;
        }
        this.dot.parent = null;
        this.lineController.connectedBalls = [];
    },
    
    setListener() {
        this.node.on(cc.Node.EventType.TOUCH_START, function (eventTouch) {
            this.plateController.blockArea.active = true; //激活遮罩
            this.node.zIndex = 2; //设置选中珠子盖在遮罩上
            this.canConnectballs = this.filterBalls(this.plateController.ballArea.children, this.node.name);
            this.canConnectballs.forEach(v => {
                v.zIndex = 2;
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
        } else {
            if (self.node.zIndex == 2) { //判断高亮
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
            }
        }
    },
    actionDone(){
        this.plateController.blockArea.active = false;
        this.plateController.blockArea.getComponent(cc.BlockInputEvents).enabled=false;
        console.log('actionDone')
    },
    actionBefore(){
        this.plateController.blockArea.getComponent(cc.BlockInputEvents).enabled=true;
    },
    fallDown(_distance){
        let fallAction = cc.moveBy(ANITIME.DOWN*_distance,0,-188*_distance);
        let Action = cc.sequence(cc.callFunc(this.actionBefore,this),fallAction,cc.callFunc(this.actionDone,this));
        this.node.runAction(Action);
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