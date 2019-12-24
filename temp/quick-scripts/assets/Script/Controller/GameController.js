(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Controller/GameController.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'be401VOPcBIAJaX1+xesIj7', 'GameController', __filename);
// Script/Controller/GameController.js

"use strict";

var _Config = require("../Config/Config");

var CryptoJS = require("crypto-js"); // Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

var key = '3132333435363738393041424344454631323334353637383930414243444566';
console.log('密钥：', key);
key = CryptoJS.enc.Hex.parse(key);
var iv = CryptoJS.enc.Hex.parse("30313233343536373839414243444546");
var src = "werty7890";
console.log('原字符串：', src);
var enc = CryptoJS.AES.encrypt(src, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
});

//console.log('加密:',enc.toString());
var enced = enc.ciphertext.toString();
console.log("加密：", enced);

var dec = CryptoJS.AES.decrypt(CryptoJS.format.Hex.parse(enced), key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
});
console.log('解密:', CryptoJS.enc.Utf8.stringify(dec));

cc.Class({
    extends: cc.Component,

    properties: {
        worldSceneBGM: {
            type: cc.AudioClip,
            default: null
        },
        plateBg: cc.Node,
        blood: cc.Node
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        // this.gameSceneBGMAudioId = cc.audioEngine.play(this.worldSceneBGM, true, 1);
        // cc.log(this.blockPrefab.data.width,this.blockPrefab.data.height)
        this.bloodController = this.blood.getComponent("BloodController");
        this.plateController = this.plateBg.getComponent("PlateController");
        this.bloodController.totalBlood = 10000;
    },
    start: function start() {}
}

// update (dt) {},
);

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
        //# sourceMappingURL=GameController.js.map
        