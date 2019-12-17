window.Global = {
    plateController: null,
    lineController: null,
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
        emptyPostions: [],
        // map:[],       
    },

    // LIFE-CYCLE CALLBACKS:
    randomRange(min, max) {
        return Math.random() * (max - min) + min;
    },
    randomRangeInt(min, max) {
        if (arguments.length == 2) {
            return Math.floor(this.randomRange(min, max));
        } else if (arguments.length == 1) {
            return arguments[0][Math.floor(this.randomRange(0, arguments[0].length))];
        }
    },
    //根据this.map绘制珠盘
    drawBalls() {
        this.blockSize = 94;
        let x_0 = 2 * this.blockSize / Math.sqrt(3);
        for (let i = 0; i < 6; i++) {
            // let row = [];
            for (let j = 0; j < 7; j++) {
                if (i == 5 && j % 2 != 0) {
                    //删除顶端3个珠子
                } else {
                    let block = cc.instantiate(this.ballPrefabs[this.randomRangeInt(0, 5)]);
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
    getRoundBalls(ball){
        let balls = [];
        for (let i = 0; i < this.ballArea.children.length; i++) {
            const element = this.ballArea.children[i];
            if(element.name!='effectArea'){
                if(element.column==ball.column){
                    if(Math.abs(ball.row-element.row)==1){
                        balls.push(element);
                        continue;
                    }
                }else{
                    if(ball.column%2!=0){
                        if(Math.abs(ball.column-element.column)==1){    
                            if(ball.row==element.row || ball.row==element.row-1){
                                balls.push(element);
                                continue;    
                            }
                        }
                    }else{
                        if(Math.abs(ball.column-element.column)==1){
                            if(ball.row==element.row || ball.row==element.row+1){
                                balls.push(element);
                                continue;
                            }
                        }
                    }
                }
            }
        }
        return balls;
    },
    deleteBalls(_balls){//随机消除
        this.emptyPostions=_balls;
        this.emptyPostions.forEach(function(v){
            v.removeFromParent(false);
        })
    },
    countBallsFallingDistance() {//计算所有珠子下降距离
        this.fallingBall = new Set();
        for (let i = 0; i < this.ballArea.children.length; i++) {
            if (this.ballArea.children[i].name != "effectArea") {
                let oriBall = this.ballArea.children[i];
                if (oriBall.parent != null) {
                    let distance = 0;
                    for (let j = 0; j < this.emptyPostions.length; j++) {
                        let ball = this.emptyPostions[j];
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
    generateNewBalls() {
        let balls = {
            '0': 0,
            '1': 0,
            '2': 0,
            '3': 0,
            '4': 0,
            '5': 0,
            '6': 0
        };
        for (let i = 0; i < this.emptyPostions.length; i++) {
            let ball = this.emptyPostions[i];
            balls[ball.column] += 1;
        }
        for (const key in balls) {
            if (balls.hasOwnProperty(key)) {
                const count = balls[key];
                if (count > 0) {
                    for (let i = 0; i < count; i++) {
                        let ball = cc.instantiate(this.ballPrefabs[this.randomRangeInt(0, 5)]);
                        ball.children[0].active = false;
                        ball.width = 150;
                        ball.height = 150;
                        ball.column = Number(key);
                        if(ball.column%2!=0){
                            ball.row = 5 + i
                        }else{
                            ball.row = 6 + i
                        }
                        this.ballArea.addChild(ball);
                        if (ball.column % 2 == 0) {
                            ball.setPosition(cc.v2(ball.column * Math.sqrt(3) * this.blockSize + 2 * this.blockSize / Math.sqrt(3), this.blockSize + 2 * this.blockSize * ball.row));
                        } else {
                            ball.setPosition(cc.v2(ball.column * Math.sqrt(3) * this.blockSize + 2 * this.blockSize / Math.sqrt(3), 2 * this.blockSize + 2 * this.blockSize * ball.row));
                        }
                    }
                }
            }
        }
    },
    updateBall() {
        let that = this;
        this.fallingBall.forEach(function (ball, i) {
            ball.getComponent("Ball").fallDown(ball.distance);
            ball.distance = 0;
        })
        this.fallingBall = []; //完成下坠队列
        this.emptyPostions.forEach(function (v, i) {
            v.destroy();
        })
        this.emptyPostions = []; //回收删除的珠子
    },
    onLoad() {
        this.drawBalls();
        this.effectArea.zIndex = 1;
        cc.log(this.effectArea)
        this.isInPlayAni = false;
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        Global.plateController = this;
        Global.lineController = this.lineArea.getComponent('LineController');
        // Global.map = this.map;
    },

    start() {

    },

    // update (dt) {},
});