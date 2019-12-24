cc.Class({
    extends: cc.Component,

    properties: {
        bloodbar:{
            default:null,
            type:cc.ProgressBar
        },
        totalBlood:{
            get(){
                return this._totalblood;
            },
            set(value){
                this._totalblood = value;
            }
        },
        currentBlood:{
            get(){
                return this._currentblood;
            },
            set(value){
                this._currentblood = value;
            }
        },
    },

    // LIFE-CYCLE CALLBACKS:
    timeCallBack(){
        this.bloodAnim.pause(this.bloodAnim.defaultClip.name);
        this.bloodAnim.setCurrentTime(this.currentTime,this.bloodAnim.defaultClip.name);
    },
    onLoad () {
        this.bloodAnim = this.getComponent(cc.Animation);
        this.totalTime = this.bloodAnim.defaultClip.duration;
        this.currentBlood = this.totalBlood;
        this.node.on('damage',function(_damage){
            // cc.log(_damage);
            this.playTime = _damage/this.totalBlood*this.totalTime;
            if(this.currentBlood==this.totalBlood){
                this.playState = this.bloodAnim.play(this.bloodAnim.defaultClip.name);
            }else{
                this.playState = this.bloodAnim.resume(this.bloodAnim.defaultClip.name);
            }
            this.scheduleOnce(this.timeCallBack, this.playTime);
            this.currentBlood=this.currentBlood-_damage;
            this.currentTime = this.totalTime-this.currentBlood/this.totalBlood*this.totalTime;
            
        },this)
    },

    start () {

    },

    update (dt) {
        // if(this.playState){
        //     if(this.playState.time>=this.playTime){
        //         this.bloodAnim.pause(this.bloodAnim.defaultClip.name);
        //         // this.bloodAnim.setCurrentTime(this.currentTime,this.bloodAnim.defaultClip.name);
        //     }
        // }
    },
});
