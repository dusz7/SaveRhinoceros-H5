var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GameController = (function (_super) {
    __extends(GameController, _super);
    function GameController() {
        var _this = _super.call(this) || this;
        _this._touchStatus = false; //当前触摸状态，按下时，值为true
        _this._distance = new egret.Point(); //鼠标点击时，鼠标全局坐标与_bird的位置差
        _this.pauseTimeOut = 400;
        _this.passNum = 0;
        _this.theGunsList = [];
        _this.theBulletsList = [];
        _this.initFireDelay = 2000;
        //在此规定该移动时间为移动场景高度的时间
        _this.initBulletSpeedTime = 4000;
        _this.isGaming = false;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    GameController.prototype.onAddToStage = function (event) {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
        this.createGameScene();
    };
    /**
     * 创建游戏场景
     * Create a game scene
     */
    GameController.prototype.createGameScene = function () {
        this.isGaming = true;
        this.passNum = 0;
        this.theGunsList = [];
        this.theBulletsList = [];
        this.stageW = this.stage.stageWidth;
        this.stageH = this.stage.stageHeight;
        this.background = GameUtil.createBitmapByName("background_start_png");
        this.addChild(this.background);
        this.startBtn = GameUtil.createBitmapByName("startbutton_png"); //开始按钮
        this.startBtn.anchorOffsetX = this.startBtn.width / 2;
        this.startBtn.anchorOffsetY = this.startBtn.height / 2;
        this.startBtn.x = this.stageW / 2; //居中定位
        this.startBtn.y = this.stageH / 2; //居中定位
        this.startBtn.touchEnabled = true; //开启触碰
        this.startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.buttonClick, this); //点击按钮开始游戏
        this.addChild(this.startBtn);
        this.plant = GameUtil.createBitmapByName("plant0_png");
        this.addChildAt(this.plant, -1);
    };
    /**
     * 按钮点击效果
     */
    GameController.prototype.buttonClick = function () {
        if (!this.isGaming) {
            this.removeChild(this.resultShow);
            this.removeChild(this.resultText);
        }
        this.startBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.buttonClick, this);
        this.startBtn.texture = RES.getRes("startbuttond_png");
        egret.setTimeout(function () {
            this.removeChild(this.startBtn);
            this.gameStart();
        }, this, 0.5 * this.pauseTimeOut);
    };
    /**
     * 开始游戏
     */
    GameController.prototype.gameStart = function () {
        this.isGaming = true;
        this.passNum = 0;
        this.theGunsList = [];
        this.theBulletsList = [];
        this.rhinoceros = new Rhinoceros("step0_png");
        this.rhinoceros.x = this.stageW / 2;
        this.rhinoceros.y = this.stageH / 2;
        this.rhinoceros.addEventListener("changeStep", this.changeStepHandler, this);
        this.rhinoceros.addEventListener("turnTo", this.turnToHandler, this);
        //目标移动
        this.rhinoceros.touchEnabled = true;
        this.rhinoceros.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.mouseDown, this);
        this.rhinoceros.addEventListener(egret.TouchEvent.TOUCH_END, this.mouseUp, this);
        this.addChildAt(this.rhinoceros, this.numChildren - 1);
        //检测子弹是否击中
        this.addEventListener(egret.Event.ENTER_FRAME, this.gameHitTestAndBulletTest, this);
        var i;
        var newGun;
        var gunsjsons = [
            { "x": 0, "y": 250, "fireAngle": 50 },
            { "x": 110, "y": 170, "fireAngle": 80 },
            { "x": 275, "y": 30, "fireAngle": 80 },
            { "x": 510, "y": 90, "fireAngle": 60 },
            { "x": 710, "y": 115, "fireAngle": 120 },
            { "x": 710, "y": 115, "fireAngle": 145 },
            { "x": 930, "y": 85, "fireAngle": 100 },
            { "x": 1215, "y": 120, "fireAngle": 95 },
            { "x": 1370, "y": 85, "fireAngle": 70 },
            { "x": 1565, "y": 70, "fireAngle": 125 },
            { "x": 1700, "y": 90, "fireAngle": 100 },
            { "x": 1920, "y": 135, "fireAngle": 145 },
            { "x": 0, "y": 900, "fireAngle": -50 },
            { "x": 210, "y": 1020, "fireAngle": -80 },
            { "x": 405, "y": 1040, "fireAngle": -90 },
            { "x": 665, "y": 1000, "fireAngle": -100 },
            { "x": 870, "y": 990, "fireAngle": -110 },
            { "x": 1080, "y": 990, "fireAngle": -100 },
            { "x": 1280, "y": 985, "fireAngle": -42 },
            { "x": 1480, "y": 975, "fireAngle": -95 },
            { "x": 1630, "y": 1005, "fireAngle": -95 },
            { "x": 1770, "y": 960, "fireAngle": -125 },
            { "x": 1770, "y": 960, "fireAngle": -130 },
            { "x": 1920, "y": 855, "fireAngle": -160 }
        ];
        for (i = 0; i < gunsjsons.length; i++) {
            newGun = new Gun(gunsjsons[i].x, gunsjsons[i].y, gunsjsons[i].fireAngle);
            newGun.addEventListener("createBullet", this.createBulletHandler, this);
            this.theGunsList.push(newGun);
        }
        //子弹发射控制逻辑
        this.myFireController = new FireController(this.theGunsList);
        this.myFireController.startFire(this.initFireDelay, this.initBulletSpeedTime);
    };
    /**
     * 游戏结束
     */
    GameController.prototype.gameStop = function () {
        /**
         * 移除各项监听事件，删除所有对象
         */
        this.removeEventListener(egret.Event.ENTER_FRAME, this.gameHitTestAndBulletTest, this);
        //移除犀牛的监听事件
        this.rhinoceros.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.mouseDown, this);
        this.rhinoceros.removeEventListener(egret.TouchEvent.TOUCH_END, this.mouseUp, this);
        this.rhinoceros.removeEventListener("changeStep", this.changeStepHandler, this);
        this.rhinoceros.removeEventListener("turnTo", this.turnToHandler, this);
        //需要停止射击吗？
        this.myFireController.stopFire();
        //移除枪支射击的制造子弹的监听事件
        var i;
        for (i = 0; i < this.theGunsList.length; i++) {
            var theGun = this.theGunsList[i];
            theGun.removeEventListener("createBullet", this.createBulletHandler, this);
        }
        this.theGunsList = [];
        //清除子弹
        //清除所有动画效果
        egret.Tween.removeAllTweens();
        egret.setTimeout(function () {
            var i;
            for (i = 0; i < this.theBulletsList.length; i++) {
                var theBullet = this.theBulletsList[i];
                this.removeChild(theBullet);
                //this.theBulletsList.splice(this.theBulletsList.indexOf(theBullet),1);
                Bullet.reclaim(theBullet);
            }
            this.theBulletsList = [];
            this.removeChild(this.rhinoceros);
            this.gameEndUILoad();
        }, this, this.pauseTimeOut);
    };
    /**
     * 游戏结束的结果UI绘制
     */
    GameController.prototype.gameEndUILoad = function () {
        this.background.texture = RES.getRes("background_end_png");
        this.plant.texture = RES.getRes("plant4_png");
        var blood = GameUtil.createBitmapByName("blood_png");
        this.addChild(blood);
        egret.setTimeout(function () {
            this.removeChild(blood);
            this.resultShow = GameUtil.createBitmapByName("endtitle_png");
            this.resultShow.anchorOffsetX = this.resultShow.width / 2;
            this.resultShow.anchorOffsetY = this.resultShow.height / 2;
            this.resultShow.x = this.stageW / 2;
            this.resultShow.y = this.stageH / 2;
            this.background.texture = RES.getRes("background_start_png");
            this.plant.texture = RES.getRes("plant0_png");
            this.addChild(this.resultShow);
            //显示分数
            this.resultText = new egret.TextField();
            this.resultText.text = this.passNum.toString();
            this.resultText.bold = true;
            this.resultText.size = 150;
            this.resultText.textColor = 0xc73320;
            this.resultText.anchorOffsetX = this.resultText.width / 2;
            this.resultText.anchorOffsetX = this.resultText.height / 2;
            //放置分数
            this.resultText.x = 1245;
            this.resultText.y = 600;
            this.addChild(this.resultText);
            this.isGaming = false;
            this.startBtn.texture = RES.getRes("startbutton_png"); //开始按钮
            this.startBtn.x = this.stageW / 2; //居中定位
            this.startBtn.y = this.stageH / 4 * 3; //居中定位
            this.startBtn.touchEnabled = true; //开启触碰
            this.startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.buttonClick, this); //点击按钮开始游戏
            this.addChild(this.startBtn);
        }, this, 3 * this.pauseTimeOut);
    };
    /**
     * 以下为各种自定义事件监听
     */
    /**
     * 游戏碰撞检测、子弹出界检测以及子弹击中的结果
     */
    GameController.prototype.gameHitTestAndBulletTest = function (evt) {
        var i = 0;
        var theBullet;
        var theBulletsCount = this.theBulletsList.length;
        var outDelBullets = []; //记录出界需要删除的子弹
        var hitDelBullets = []; //记录碰撞后需要消失的子弹
        //被子弹打中以后，受到伤害
        for (i = 0; i < theBulletsCount; i++) {
            theBullet = this.theBulletsList[i];
            egret.Tween.pauseTweens(theBullet);
            if (theBullet.y < 0 || theBullet.y > this.stageH || theBullet.x < 0 || theBullet.x > this.stageW) {
                if (outDelBullets.indexOf(theBullet) == -1)
                    outDelBullets.push(theBullet);
            }
            else if (this.rhinoceros.hitTestPoint(theBullet.x, theBullet.y, true)) {
                this.rhinoceros.hurt();
                if (hitDelBullets.indexOf(theBullet) == -1)
                    hitDelBullets.push(theBullet);
            }
            egret.Tween.resumeTweens(theBullet);
        }
        //回收出界的子弹
        for (i = 0; i < outDelBullets.length; i++) {
            this.passNum++;
            console.log("now pass :" + this.passNum);
            theBullet = outDelBullets[i];
            egret.Tween.removeTweens(theBullet);
            this.removeChild(theBullet);
            this.theBulletsList.splice(this.theBulletsList.indexOf(theBullet), 1);
            Bullet.reclaim(theBullet);
        }
        //达到伤害上限值，游戏结束
        if (this.rhinoceros.hitNum >= 3) {
            this.gameStop();
        }
        else {
            //打中的子弹需要消失
            for (i = 0; i < hitDelBullets.length; i++) {
                theBullet = hitDelBullets[i];
                egret.Tween.removeTweens(theBullet);
                this.removeChild(theBullet);
                this.theBulletsList.splice(this.theBulletsList.indexOf(theBullet), 1);
                Bullet.reclaim(theBullet);
            }
        }
    };
    /**
     * 创建子弹
     */
    GameController.prototype.createBulletHandler = function (evt) {
        var theGun = evt.target;
        var newBullet;
        newBullet = Bullet.produce("bullet_png", evt.data.angle);
        newBullet.x = theGun.x;
        newBullet.y = theGun.y;
        this.addChildAt(newBullet, this.numChildren - 1);
        this.theBulletsList.push(newBullet);
        //设置子弹运动动画
        //var newX:number = newBullet.x+(this.stageH/(Math.tan(Math.abs(newBullet.fireAngle))));
        var fireDistance = this.stageH / (Math.sin(Math.abs(newBullet.fireAngle) / 180 * Math.PI));
        var fireSpeedTime = evt.data.speedTime / (Math.sin(Math.abs(newBullet.fireAngle) / 180 * Math.PI));
        egret.Tween.get(newBullet)
            .to({ x: newBullet.x + fireDistance * (Math.cos(newBullet.fireAngle / 180 * Math.PI)), y: newBullet.y + fireDistance * (Math.sin(newBullet.fireAngle / 180 * Math.PI)) }, fireSpeedTime);
        //.call(this.onBulletMoveCompleted,this,[newBullet]);
    };
    /**
     * 子弹移动结束后
     */
    /*
    public onBulletMoveCompleted(theBullet:Bullet)
    {
        egret.Tween.removeTweens(theBullet);
        this.removeChild(theBullet);
        this.theBulletsList.splice(this.theBulletsList.indexOf(theBullet),1);
        Bullet.reclaim(theBullet);
        this.passNum ++;
        //console.log("the bullet is at: "+theBullet.x+","+theBullet.y);
    }
    */
    /**
     * 掉血时的场景变化
     */
    GameController.prototype.changeStepHandler = function (evt) {
        var theRhi = evt.target;
        this.rhinoceros.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.mouseDown, this);
        this.rhinoceros.removeEventListener(egret.TouchEvent.TOUCH_END, this.mouseUp, this);
        var i;
        for (i = 0; i < this.theBulletsList.length; i++) {
            egret.Tween.pauseTweens(this.theBulletsList[i]);
        }
        if (evt.data <= 3) {
            theRhi.addChild(theRhi.hitPerformance);
            var rhiTexture = "step";
            //let bgTexture:string = "background";
            var plTexture = "plant";
            var numS = (evt.data).toString();
            rhiTexture += (numS + "_png");
            //bgTexture +=  (numS + "_png");
            plTexture += (numS + "_png");
            //console.log(rhiTexture);
            //this.background.texture = RES.getRes(bgTexture);
            this.plant.texture = RES.getRes(plTexture);
            theRhi.bmp.texture = RES.getRes(rhiTexture);
            egret.setTimeout(function () {
                theRhi.removeChild(theRhi.hitPerformance);
                for (i = 0; i < this.theBulletsList.length; i++) {
                    egret.Tween.resumeTweens(this.theBulletsList[i]);
                }
                this.rhinoceros.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.mouseDown, this);
                this.rhinoceros.addEventListener(egret.TouchEvent.TOUCH_END, this.mouseUp, this);
            }, this, this.pauseTimeOut);
        }
    };
    /**
     * 转向时的变化
     */
    GameController.prototype.turnToHandler = function () {
    };
    /**
     * 物体拖动相关
     */
    GameController.prototype.objectMove = function (evt) {
        if (this._touchStatus) {
            /*
            if(this._distance.x < 0 && !(this.rhinoceros.isLeft)){
                //console.log("left");
                //this.rhinoceros.scaleX = -1;
                this.rhinoceros.isLeft = true;
                console.log(this.rhinoceros.isLeft);
            }else if(this._distance.x > 0 && this.rhinoceros.isLeft){
                //console.log("right");
                //this.rhinoceros.bmp.scaleX = -1;
                this.rhinoceros.isLeft = false;
                console.log(this.rhinoceros.isLeft);
            }
            */
            if (evt.stageX < this.stageW - 100 && evt.stageX > 100) {
                this.rhinoceros.x = evt.stageX - this._distance.x;
                this.rhinoceros.y = evt.stageY - this._distance.y;
            }
        }
    };
    GameController.prototype.mouseDown = function (evt) {
        //console.log("Mouse Down.");
        this._touchStatus = true;
        this._distance.x = evt.stageX - this.rhinoceros.x;
        this._distance.y = evt.stageY - this.rhinoceros.y;
        this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.objectMove, this);
    };
    GameController.prototype.mouseUp = function (evt) {
        //console.log("Mouse Up.");
        this._touchStatus = false;
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.objectMove, this);
    };
    return GameController;
}(egret.DisplayObjectContainer));
__reflect(GameController.prototype, "GameController");
//# sourceMappingURL=GameController.js.map