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
        _this.theBullets = [];
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
        this.stageW = this.stage.stageWidth;
        this.stageH = this.stage.stageHeight;
        this.background = GameUtil.createBitmapByName("background1_png");
        this.addChild(this.background);
        this.startBtn = GameUtil.createBitmapByName("startbutton_png"); //开始按钮
        this.startBtn.x = (this.stageW - this.startBtn.width) / 2; //居中定位
        this.startBtn.y = (this.stageH - this.startBtn.height) / 2; //居中定位
        this.startBtn.touchEnabled = true; //开启触碰
        this.startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gameStart, this); //点击按钮开始游戏
        this.addChild(this.startBtn);
        this.plant = GameUtil.createBitmapByName("plant1_png");
        this.addChildAt(this.plant, -1);
        /*
        var shp:egret.Shape = new egret.Shape();
        shp.graphics.beginFill( 0x0000ff );
        shp.graphics.drawRect( 0, 0, 10, 10 );
        shp.graphics.endFill();
        shp.x = 300;
        shp.y = 600;
        //console.log(this.stageW+","+this.stageH);
        this.addChild( shp );
        */
    };
    /**
     * 开始游戏
     */
    GameController.prototype.gameStart = function () {
        this.removeChild(this.startBtn);
        this.rhinoceros = new Rhinoceros("stepl1_png");
        this.rhinoceros.x = this.stageW / 2;
        this.rhinoceros.y = this.stageH / 2;
        this.rhinoceros.addEventListener("changeStep", this.changeStepHandler, this);
        this.rhinoceros.addEventListener("turnTo", this.turnToHandler, this);
        //目标移动
        this.rhinoceros.touchEnabled = true;
        this.rhinoceros.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.mouseDown, this);
        this.rhinoceros.addEventListener(egret.TouchEvent.TOUCH_END, this.mouseUp, this);
        this.addChildAt(this.rhinoceros, this.numChildren - 1);
        var gun1 = new Gun(0, 250, 50);
        var gun2 = new Gun(110, 170, 80);
        var gun3 = new Gun(275, 30, 80);
        gun1.addEventListener("createBullet", this.createBulletHandler, this);
        gun2.addEventListener("createBullet", this.createBulletHandler, this);
        gun3.addEventListener("createBullet", this.createBulletHandler, this);
        gun1.fire();
        gun2.fire();
        gun3.fire();
        //console.log("background:"+this.getChildIndex(this.background)+",rhinoceros:"+this.getChildIndex(this.rhinoceros)+
        //",gun:"+this.getChildIndex(gun1)+",plant:"+this.getChildIndex(this.plant));
        this.addEventListener(egret.Event.ENTER_FRAME, this.gameViewUpdate, this);
    };
    /**
     * 游戏结束
     */
    GameController.prototype.gameStop = function () {
        //console.log("the game is end!");
        this.removeEventListener(egret.Event.ENTER_FRAME, this.gameViewUpdate, this);
        //枪停止射击
        //移除制造子弹的监听事件
        //移除犀牛的监听事件
        //清理子弹等
        this.background.texture = RES.getRes("background5_png");
        this.plant.texture = RES.getRes("plant5_png");
        this.removeChild(this.rhinoceros);
        var blood = GameUtil.createBitmapByName("blood_png");
        this.addChild(blood);
    };
    /**游戏画面更新*/
    GameController.prototype.gameViewUpdate = function (evt) {
        //为了防止FPS下降造成回收慢，生成快，进而导致DRAW数量失控，需要计算一个系数，当FPS下降的时候，让运动速度加快
        /*
        var nowTime:number = egret.getTimer();
        var fps:number = 1000/(nowTime-this._lastTime);
        this._lastTime = nowTime;
        var speedOffset:number = 60/fps;
        */
        //我的子弹运动
        var fireSpeed = 1;
        var i = 0;
        var bullet;
        var myBulletsCount = this.theBullets.length;
        var delArr = [];
        for (; i < myBulletsCount; i++) {
            bullet = this.theBullets[i];
            bullet.x += fireSpeed * (Math.cos(bullet.fireAngle / 180 * Math.PI));
            bullet.y += fireSpeed * (Math.sin(bullet.fireAngle / 180 * Math.PI));
            if (bullet.y > this.stageH || bullet.y < 0 || bullet.x < 0 || bullet.x > this.stageW)
                delArr.push(bullet);
        }
        for (i = 0; i < delArr.length; i++) {
            bullet = delArr[i];
            this.removeChild(bullet);
            Bullet.reclaim(bullet);
            this.theBullets.splice(this.theBullets.indexOf(bullet), 1);
        }
        this.gameHitTest();
    };
    /**游戏碰撞检测*/
    GameController.prototype.gameHitTest = function () {
        var i, j;
        var bullet;
        var theGun;
        var theBulletsCount = this.theBullets.length;
        //将需消失的子弹记录
        var delBullets = [];
        //敌人的子弹可以减我血
        for (i = 0; i < theBulletsCount; i++) {
            bullet = this.theBullets[i];
            if (GameUtil.hitTest(this.rhinoceros, bullet)) {
                this.rhinoceros.hurt();
                if (delBullets.indexOf(bullet) == -1)
                    delBullets.push(bullet);
            }
        }
        while (delBullets.length > 0) {
            bullet = delBullets.pop();
            this.removeChild(bullet);
            this.theBullets.splice(this.theBullets.indexOf(bullet), 1);
            Bullet.reclaim(bullet);
        }
        if (this.rhinoceros.hitNum >= 3) {
            //console.log("getHurtNum: "+this.rhinoceros.hitNum);
            this.gameStop();
        }
    };
    /**
     * 创建子弹
     */
    GameController.prototype.createBulletHandler = function (evt) {
        var theGun = evt.target;
        var newBullet;
        newBullet = Bullet.produce("bullet_png", evt.data);
        newBullet.x = theGun.x;
        newBullet.y = theGun.y;
        this.addChildAt(newBullet, this.numChildren - 1);
        //console.log(this.getChildIndex(bullet));
        //this.addChildAt(bullet,this.numChildren-1-this.enemyFighters.length);
        this.theBullets.push(newBullet);
    };
    /**
     * 掉血时的变化
     */
    GameController.prototype.changeStepHandler = function (evt) {
        if (evt.data <= 3) {
            var rhiTexture = "step";
            var bgTexture = "background";
            var plTexture = "plant";
            var theRhi = evt.target;
            if (theRhi.isLeft == true)
                rhiTexture += "l";
            else
                rhiTexture += "r";
            var numS = (evt.data + 1).toString();
            rhiTexture += (numS + "_png");
            bgTexture += (numS + "_png");
            plTexture += (numS + "_png");
            console.log(rhiTexture);
            this.background.texture = RES.getRes(bgTexture);
            this.plant.texture = RES.getRes(plTexture);
            theRhi.bmp.texture = RES.getRes(rhiTexture);
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
            if (this._distance.x < 0) {
            }
            else if (this._distance.x > 0) {
            }
            //console.log("moving now ! Mouse: [X:"+evt.stageX+",Y:"+evt.stageY+"]");
            this.rhinoceros.x = evt.stageX - this._distance.x;
            this.rhinoceros.y = evt.stageY - this._distance.y;
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