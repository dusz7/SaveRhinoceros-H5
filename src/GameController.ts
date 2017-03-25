
class GameController extends egret.DisplayObjectContainer
{
    public constructor(){
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
    }

    private onAddToStage(event:egret.Event){
        this.removeEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
        this.createGameScene();
    }

    private stageW;
    private stageH;

    private startBtn:egret.Bitmap;
    private background:egret.Bitmap;
    private plant:egret.Bitmap;
    private resultShow:egret.Bitmap;
    private resultText:egret.TextField;

    private rhinoceros:Rhinoceros;
    private _touchStatus:boolean = false;              //当前触摸状态，按下时，值为true
    private _distance:egret.Point = new egret.Point(); //鼠标点击时，鼠标全局坐标与_bird的位置差

    private pauseTimeOut:number = 400;

    private passNum:number = 0;

    private theGunsList:Gun[] = [];

    private theBulletsList:Bullet[] = [];

    private myFireController:FireController;

    private initFireDelay:number = 2000;
    //在此规定该移动时间为移动场景高度的时间
    private initBulletSpeedTime:number = 4000;

    private isGaming:boolean = false;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
        this.isGaming = true;
        this.passNum = 0;
        this.theGunsList = [];
        this.theBulletsList = [];

        this.stageW = this.stage.stageWidth;
        this.stageH = this.stage.stageHeight;

        this.background = GameUtil.createBitmapByName("background_start_png");
        this.addChild(this.background);
        this.startBtn = GameUtil.createBitmapByName("startbutton_png");//开始按钮
        this.startBtn.anchorOffsetX = this.startBtn.width/2;
        this.startBtn.anchorOffsetY = this.startBtn.height/2;
        this.startBtn.x = this.stageW/2;//居中定位
        this.startBtn.y = this.stageH/2;//居中定位
        this.startBtn.touchEnabled = true;//开启触碰
        this.startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.buttonClick,this);//点击按钮开始游戏
        this.addChild(this.startBtn);

        this.plant = GameUtil.createBitmapByName("plant0_png");
        this.addChildAt(this.plant,-1);
        
    }

    /**
     * 按钮点击效果
     */
    public buttonClick()
    {
        if(!this.isGaming)
        {
            this.removeChild(this.resultShow);
            this.removeChild(this.resultText);
        }
        
        this.startBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.buttonClick,this);
        this.startBtn.texture = RES.getRes("startbuttond_png");
        egret.setTimeout(function(){
            this.removeChild(this.startBtn);
            this.gameStart();
    },this,0.5*this.pauseTimeOut);
    }

    /**
     * 开始游戏
     */
    public gameStart():void
    {
        this.isGaming = true;
        this.rhinoceros = new Rhinoceros("step0_png");
        this.rhinoceros.x = this.stageW/2;
        this.rhinoceros.y = this.stageH/2;
        this.rhinoceros.addEventListener("changeStep",this.changeStepHandler,this);
        this.rhinoceros.addEventListener("turnTo",this.turnToHandler,this);
        //目标移动
        this.rhinoceros.touchEnabled = true;
        this.rhinoceros.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.mouseDown, this);
        this.rhinoceros.addEventListener(egret.TouchEvent.TOUCH_END, this.mouseUp, this);
        this.addChildAt(this.rhinoceros,this.numChildren-1);

        //检测子弹是否击中
        this.addEventListener(egret.Event.ENTER_FRAME,this.gameHitTest,this);

        var i:number;
        var newGun:Gun;
        var gunsjsons = [
            {"x":0,"y":250,"fireAngle":50},
            {"x":110,"y":170,"fireAngle":80},
            {"x":275,"y":30,"fireAngle":80},
            {"x":510,"y":90,"fireAngle":60},
            {"x":710,"y":115,"fireAngle":120},
            {"x":930,"y":85,"fireAngle":100},
            {"x":1215,"y":120,"fireAngle":95},
            {"x":1370,"y":85,"fireAngle":70},
            {"x":1565,"y":70,"fireAngle":120},
            {"x":1700,"y":90,"fireAngle":100},
            {"x":1920,"y":135,"fireAngle":145},
            {"x":0,"y":900,"fireAngle":-50},
            {"x":210,"y":1020,"fireAngle":-80},
            {"x":405,"y":1040,"fireAngle":-90},
            {"x":665,"y":1000,"fireAngle":-100},
            {"x":870,"y":990,"fireAngle":-110},
            {"x":1080,"y":990,"fireAngle":-100},
            {"x":1280,"y":985,"fireAngle":-95},
            {"x":1480,"y":975,"fireAngle":-95},
            {"x":1630,"y":1005,"fireAngle":-95},
            {"x":1770,"y":960,"fireAngle":-125},
            {"x":1920,"y":855,"fireAngle":-160}
        ];
        for(i=0; i<gunsjsons.length; i++){
            newGun = new Gun(gunsjsons[i].x,gunsjsons[i].y,gunsjsons[i].fireAngle);
            newGun.addEventListener("createBullet",this.createBulletHandler,this);
            this.theGunsList.push(newGun);
            //newGun.fire();
        }

        //子弹发射控制逻辑
        this.myFireController = new FireController(this.theGunsList);
        this.myFireController.startFire(this.initFireDelay,this.initBulletSpeedTime);
    }

    /**
     * 游戏结束
     */
    public gameStop():void{
        /**
         * 移除各项监听事件，删除所有对象
         */
        this.removeEventListener(egret.Event.ENTER_FRAME,this.gameHitTest,this);
        //移除犀牛的监听事件
        this.rhinoceros.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.mouseDown, this);
        this.rhinoceros.removeEventListener(egret.TouchEvent.TOUCH_END, this.mouseUp, this);
        this.rhinoceros.removeEventListener("changeStep",this.changeStepHandler,this);
        this.rhinoceros.removeEventListener("turnTo",this.turnToHandler,this);

        //需要停止射击吗？
        this.myFireController.stopFire();
        //移除枪支射击的制造子弹的监听事件
        var i:number;
        for(i=0; i<this.theGunsList.length; i++){
            var theGun:Gun = this.theGunsList[i];
            theGun.removeEventListener("createBullet",this.createBulletHandler,this);
        }
        this.theGunsList = [];
        //清除子弹
        //清除所有动画效果
        egret.Tween.removeAllTweens();

        egret.setTimeout(function(){
            var i:number;
            for(i=0;i<this.theBulletsList.length;i++){
                let theBullet:Bullet = this.theBulletsList[i];
                this.removeChild(theBullet);
                //this.theBulletsList.splice(this.theBulletsList.indexOf(theBullet),1);
                Bullet.reclaim(theBullet);
            }
            this.theBulletsList = [];
            this.removeChild(this.rhinoceros);
            this.gameEndUILoad();
        },this,this.pauseTimeOut);
        
    }

    /**
     * 游戏结束的结果UI绘制
     */
    private gameEndUILoad()
    {
        this.background.texture = RES.getRes("background_end_png");
        this.plant.texture = RES.getRes("plant4_png");
        let blood:egret.Bitmap = GameUtil.createBitmapByName("blood_png");
        this.addChild(blood);

        egret.setTimeout(function(){
            this.removeChild(blood);
            this.resultShow = GameUtil.createBitmapByName("endtitle_png");
            this.resultShow.anchorOffsetX = this.resultShow.width/2;
            this.resultShow.anchorOffsetY = this.resultShow.height/2;
            this.resultShow.x = this.stageW/2;
            this.resultShow.y = this.stageH/2;
            this.background.texture = RES.getRes("background_start_png");
            this.plant.texture = RES.getRes("plant0_png");
            this.addChild(this.resultShow);
            //显示分数
            this.resultText = new egret.TextField();
            this.resultText.text = this.passNum.toString();
            this.resultText.bold = true;
            this.resultText.size = 150;
            this.resultText.textColor = 0xc73320;
            this.resultText.anchorOffsetX = this.resultText.width/2;
            this.resultText.anchorOffsetX = this.resultText.height/2;
            //放置分数
            this.resultText.x = 1255;
            this.resultText.y = 600;
            this.addChild(this.resultText);

            this.isGaming = false;
            this.startBtn.texture = RES.getRes("startbutton_png");//开始按钮
            this.startBtn.x = this.stageW/2;//居中定位
            this.startBtn.y = this.stageH/4*3;//居中定位
            this.startBtn.touchEnabled = true;//开启触碰
            this.startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.buttonClick,this);//点击按钮开始游戏
            this.addChild(this.startBtn);

        },this,3*this.pauseTimeOut);
    }

    /**
     * 以下为各种自定义事件监听
     */

    /**
     * 游戏碰撞检测以及子弹击中的结果
     */
    private gameHitTest(evt:egret.Event):void 
    {
        var i:number;
        var theBullet:Bullet;
        var theBulletsCount:number = this.theBulletsList.length;
        
        var delBullets:Bullet[] = [];//记录需要消失的子弹
        
        //被子弹打中以后，受到伤害
        for(i=0;i<theBulletsCount;i++) {
            theBullet = this.theBulletsList[i];
            if(this.rhinoceros.hitTestPoint(theBullet.x,theBullet.y,true)) {
                this.rhinoceros.hurt();
                if(delBullets.indexOf(theBullet)==-1)
                    delBullets.push(theBullet);
            }
        }
        //打中的子弹需要消失
        while(delBullets.length>0) {
            theBullet = delBullets.pop();
            egret.Tween.removeTweens(theBullet);
            this.removeChild(theBullet);
            this.theBulletsList.splice(this.theBulletsList.indexOf(theBullet),1);
            Bullet.reclaim(theBullet);
        }

        //达到伤害上限值，游戏结束
        if(this.rhinoceros.hitNum >= 3) {
            this.gameStop();
        } 
    }
    
    /**
     * 创建子弹
     */
    private createBulletHandler(evt:egret.Event):void
    {
        var theGun:Gun = evt.target;
        var newBullet:Bullet;
        newBullet = Bullet.produce("bullet_png",evt.data.angle);
        newBullet.x = theGun.x;
        newBullet.y = theGun.y;
        this.addChildAt(newBullet,this.numChildren-1);
        this.theBulletsList.push(newBullet);

        //设置子弹运动动画
        //var newX:number = newBullet.x+(this.stageH/(Math.tan(Math.abs(newBullet.fireAngle))));
        let fireDistance:number = this.stageH/(Math.sin(Math.abs(newBullet.fireAngle)/180*Math.PI));
        let fireSpeedTime:number = evt.data.speedTime/(Math.sin(Math.abs(newBullet.fireAngle)/180*Math.PI));
        /*
        if(newX < 0)
        {
            let rate:number = newBullet.x*Math.tan(Math.PI-(Math.abs(newBullet.fireAngle)/180*Math.PI))/this.stageH;
            fireDistance *= rate;
            fireSpeedTime *= rate;
        }else if(newX > this.stageW)
        {
            let rate:number = newBullet.x*Math.tan(Math.abs(newBullet.fireAngle)/180*Math.PI)/this.stageH;
            fireDistance *= rate;
            fireSpeedTime *= rate;
        }
        */
        
        egret.Tween.get(newBullet)
        .to({x:newBullet.x+fireDistance*(Math.cos(newBullet.fireAngle/180*Math.PI)),y:newBullet.y+fireDistance*(Math.sin(newBullet.fireAngle/180*Math.PI))},fireSpeedTime)
        .call(this.onBulletMoveCompleted,this,[newBullet]);
        
    }

    /**
     * 子弹移动结束后
     */
    public onBulletMoveCompleted(theBullet:Bullet)
    {
        egret.Tween.removeTweens(theBullet);
        this.removeChild(theBullet);
        this.theBulletsList.splice(this.theBulletsList.indexOf(theBullet),1);
        Bullet.reclaim(theBullet);
        this.passNum ++;
        //console.log("the bullet is at: "+theBullet.x+","+theBullet.y);
    }

    /**
     * 掉血时的场景变化
     */
    public changeStepHandler(evt:egret.Event)
    {   
        var theRhi:Rhinoceros = evt.target;
        this.rhinoceros.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.mouseDown, this);
        this.rhinoceros.removeEventListener(egret.TouchEvent.TOUCH_END, this.mouseUp, this);
        var i:number;
        for(i=0;i<this.theBulletsList.length;i++){
            egret.Tween.pauseTweens(this.theBulletsList[i]);
        }

        if(evt.data <= 3){
            theRhi.addChild(theRhi.hitPerformance);
            let rhiTexture:string = "step";
            //let bgTexture:string = "background";
            let plTexture:string = "plant";

            var numS = (evt.data).toString();
            rhiTexture += (numS + "_png");
            //bgTexture +=  (numS + "_png");
            plTexture +=  (numS + "_png");
            //console.log(rhiTexture);

            //this.background.texture = RES.getRes(bgTexture);
            this.plant.texture = RES.getRes(plTexture);
            theRhi.bmp.texture = RES.getRes(rhiTexture);

            egret.setTimeout(function(){
                theRhi.removeChild(theRhi.hitPerformance);
                for(i=0;i<this.theBulletsList.length;i++){
                    egret.Tween.resumeTweens(this.theBulletsList[i]);
                }
                this.rhinoceros.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.mouseDown, this);
                this.rhinoceros.addEventListener(egret.TouchEvent.TOUCH_END, this.mouseUp, this);
            },this,this.pauseTimeOut);
        }
    }

    /**
     * 转向时的变化
     */
    public turnToHandler()
    {

    }

    /**
     * 物体拖动相关
     */
    private objectMove(evt:egret.TouchEvent)
    {
        if( this._touchStatus )
        {
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
            this.rhinoceros.x = evt.stageX - this._distance.x;
            this.rhinoceros.y = evt.stageY - this._distance.y;
        }
    }

    private mouseDown(evt:egret.TouchEvent)
    {
        //console.log("Mouse Down.");
        this._touchStatus = true;
        this._distance.x = evt.stageX - this.rhinoceros.x;
        this._distance.y = evt.stageY - this.rhinoceros.y;
        this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.objectMove, this);
    }

    private mouseUp(evt:egret.TouchEvent)
    {
        //console.log("Mouse Up.");
        this._touchStatus = false;
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.objectMove, this);
    }
}