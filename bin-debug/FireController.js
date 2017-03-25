var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var FireController = (function () {
    function FireController(guns) {
        this.myGunsList = [];
        this.nowRepeatNum = 5;
        this.endGame = 0;
        this.myGunsList = guns;
        this.fireTimer = new egret.Timer(this.nowFireDelay);
        this.fireTimer.repeatCount = this.nowRepeatNum;
        this.fireTimer.addEventListener(egret.TimerEvent.TIMER, this.chooseAGunAndFire, this);
        this.fireTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.updateSpeedAndDelay, this);
        this.endGame = 0;
    }
    FireController.prototype.startFire = function (delay, speed) {
        this.nowFireDelay = delay;
        this.nowBulletSpeedTime = speed;
        this.fireTimer.delay = this.nowFireDelay;
        this.fireTimer.start();
    };
    FireController.prototype.stopFire = function () {
        this.fireTimer.reset();
    };
    FireController.prototype.chooseAGunAndFire = function () {
        var gunNum = Math.floor(Math.random() * this.myGunsList.length);
        //console.log("now the fire gun is : "+gunNum);
        var theGun = this.myGunsList[gunNum];
        theGun.fire(this.nowBulletSpeedTime);
        if (this.endGame >= 4) {
            var gunNum2 = Math.floor(Math.random() * this.myGunsList.length);
            var theGun2 = this.myGunsList[gunNum2];
            theGun2.fire(this.nowBulletSpeedTime);
        }
        if (this.endGame >= 15) {
            var gunNum3 = Math.floor(Math.random() * this.myGunsList.length);
            var theGun3 = this.myGunsList[gunNum3];
            theGun3.fire(this.nowBulletSpeedTime);
        }
    };
    FireController.prototype.updateSpeedAndDelay = function () {
        this.endGame++;
        if (this.nowFireDelay > 800) {
            this.nowFireDelay -= 250;
            this.fireTimer.delay = this.nowFireDelay;
            this.nowBulletSpeedTime -= 150;
        }
        console.log(this.fireTimer.delay + ",,," + this.nowBulletSpeedTime);
        this.fireTimer.reset();
        this.fireTimer.start();
    };
    return FireController;
}());
__reflect(FireController.prototype, "FireController");
//# sourceMappingURL=FireController.js.map