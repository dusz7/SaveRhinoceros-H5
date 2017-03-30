var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var FireController = (function (_super) {
    __extends(FireController, _super);
    function FireController(guns) {
        var _this = _super.call(this) || this;
        _this.myGunsList = [];
        _this.nowBulletRepeatNum = 5;
        _this.nowStepRepeatNum = 0;
        _this.round2StepNum = 4;
        _this.round3StepNum = 16;
        _this.myGunsList = guns;
        _this.fireTimer = new egret.Timer(_this.nowFireDelay);
        _this.fireTimer.repeatCount = _this.nowBulletRepeatNum;
        _this.fireTimer.addEventListener(egret.TimerEvent.TIMER, _this.chooseAGunAndFire, _this);
        _this.fireTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, _this.updateSpeedAndDelay, _this);
        _this.nowStepRepeatNum = 0;
        _this.lastRadom = guns.length;
        return _this;
    }
    FireController.prototype.startFire = function (delay, speed) {
        this.nowFireDelay = delay;
        this.nowBulletSpeedTime = speed;
        this.fireTimer.delay = this.nowFireDelay;
        this.fireTimer.start();
    };
    FireController.prototype.stopFire = function () {
        this.fireTimer.reset();
        this.nowStepRepeatNum = 0;
    };
    FireController.prototype.pauseFire = function () {
        this.fireTimer.stop();
    };
    FireController.prototype.resumeFire = function () {
        this.fireTimer.start();
    };
    FireController.prototype.chooseAGunAndFire = function () {
        //什么时候都会开一枪
        this.randomGun("normal");
        if (this.nowStepRepeatNum >= this.round2StepNum && this.fireTimer.currentCount % 2 == 0) {
            this.randomGun("super");
        }
        if (this.nowStepRepeatNum >= this.round3StepNum && this.fireTimer.currentCount % 3 == 0) {
            this.randomGun("anesthetic");
        }
        if (this.nowStepRepeatNum >= this.round3StepNum + 5 && this.fireTimer.currentCount % 3 == 0) {
            this.randomGun("normal");
        }
    };
    FireController.prototype.updateSpeedAndDelay = function () {
        this.nowStepRepeatNum++;
        if (this.nowFireDelay > 1000) {
            this.nowFireDelay -= 205;
            this.fireTimer.delay = this.nowFireDelay;
            this.nowBulletSpeedTime -= 160;
        }
        //console.log(this.fireTimer.delay+",,,"+this.nowBulletSpeedTime);
        this.fireTimer.reset();
        if (this.nowStepRepeatNum == this.round2StepNum) {
            egret.setTimeout(function () {
                this.dispatchEventWith("updateRound", false, 2);
            }, this, this.nowBulletSpeedTime);
        }
        else if (this.nowStepRepeatNum == this.round3StepNum) {
            egret.setTimeout(function () {
                this.dispatchEventWith("updateRound", false, 3);
            }, this, this.nowBulletSpeedTime);
        }
        else {
            this.fireTimer.start();
        }
    };
    /**
     * 随机选数，开枪
     */
    FireController.prototype.randomGun = function (type) {
        var textureName;
        var damageNum;
        if (type == "normal") {
            textureName = "bullet_normal_png";
            damageNum = 1;
        }
        else if (type == "super") {
            textureName = "bullet_super_png";
            damageNum = 2;
        }
        else if (type == "anesthetic") {
            textureName = "bullet_anesthetic_png";
            damageNum = 0;
        }
        var gunNo = Math.floor(Math.random() * this.myGunsList.length);
        while (gunNo == this.lastRadom) {
            gunNo = Math.floor(Math.random() * this.myGunsList.length);
        }
        this.lastRadom = gunNo;
        var theGun = this.myGunsList[gunNo];
        theGun.fire(textureName, damageNum, this.nowBulletSpeedTime);
    };
    return FireController;
}(egret.DisplayObject));
__reflect(FireController.prototype, "FireController");
//# sourceMappingURL=FireController.js.map