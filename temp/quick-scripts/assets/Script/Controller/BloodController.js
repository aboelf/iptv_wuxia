(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Controller/BloodController.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '6ff6fLPt1xHFKKrON6Jp54q', 'BloodController', __filename);
// Script/Controller/BloodController.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        bloodbar: {
            default: null,
            type: cc.ProgressBar
        },
        totalBlood: {
            get: function get() {
                return this._totalblood;
            },
            set: function set(value) {
                this._totalblood = value;
            }
        },
        currentBlood: {
            get: function get() {
                return this._currentblood;
            },
            set: function set(value) {
                this._currentblood = value;
            }
        }
    },

    // LIFE-CYCLE CALLBACKS:
    timeCallBack: function timeCallBack() {
        this.bloodAnim.pause(this.bloodAnim.defaultClip.name);
        this.bloodAnim.setCurrentTime(this.currentTime, this.bloodAnim.defaultClip.name);
    },
    onLoad: function onLoad() {
        this.bloodAnim = this.getComponent(cc.Animation);
        this.totalTime = this.bloodAnim.defaultClip.duration;
        this.currentBlood = this.totalBlood;
        this.node.on('damage', function (_damage) {
            // cc.log(_damage);
            this.playTime = _damage / this.totalBlood * this.totalTime;
            if (this.currentBlood == this.totalBlood) {
                this.playState = this.bloodAnim.play(this.bloodAnim.defaultClip.name);
            } else {
                this.playState = this.bloodAnim.resume(this.bloodAnim.defaultClip.name);
            }
            this.scheduleOnce(this.timeCallBack, this.playTime);
            this.currentBlood = this.currentBlood - _damage;
            this.currentTime = this.totalTime - this.currentBlood / this.totalBlood * this.totalTime;
        }, this);
    },
    start: function start() {},
    update: function update(dt) {
        // if(this.playState){
        //     if(this.playState.time>=this.playTime){
        //         this.bloodAnim.pause(this.bloodAnim.defaultClip.name);
        //         // this.bloodAnim.setCurrentTime(this.currentTime,this.bloodAnim.defaultClip.name);
        //     }
        // }
    }
});

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
        //# sourceMappingURL=BloodController.js.map
        