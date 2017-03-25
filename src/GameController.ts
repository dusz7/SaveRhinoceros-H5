
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

    private startBtn:egret.Bitmap;
    private background:egret.Bitmap;
    private plant:egret.Bitmap;

    private rhinoceros:Rhinoceros;
    private _touchStatus:boolean = false;              //当前触摸状态，按下时，值为true
    private _distance:egret.Point = new egret.Point(); //鼠标点击时，鼠标全局坐标与_bird的位置差

    private theBullets:Bullet[] = [];

    private stageW;
    private stageH;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
        this.stageW = this.stage.stageWidth;
        this.stageH = this.stage.stageHeight;

        this.background = GameUtil.createBitmapByName("background1_png");
        this.addChild(this.background);
        this.startBtn = GameUtil.createBitmapByName("startbutton_png");//开始按钮
        this.startBtn.x = (this.stageW-this.startBtn.width)/2;//居中定位
        this.startBtn.y = (this.stageH-this.startBtn.height)/2;//居中定位
        this.startBtn.touchEnabled = true;//开启触碰
        this.startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.gameStart,this);//点击按钮开始游戏
        this.addChild(this.startBtn);
        this.plant = GameUtil.createBitmapByName("plant1_png");
        this.addChildAt(this.plant,-1);
        
    }

    /**
     * 开始游戏
     */
    public gameStart():void
    {
        this.removeChild(this.startBtn);

        this.rhinoceros = new Rhinoceros("stepl1_png");
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

        var gun1:Gun = new Gun(0,250,50);
        var gun2:Gun = new Gun(110,170,80);
        var gun3:Gun = new Gun(275,30,80);
        gun1.addEventListener("createBullet",this.createBulletHandler,this);
        gun2.addEventListener("createBullet",this.createBulletHandler,this);
        gun3.addEventListener("createBullet",this.createBulletHandler,this);
        gun1.fire();
        gun2.fire();
        gun3.fire();
    }

    /**
     * 游戏结束
     */
    public gameStop():void{
        //console.log("the game is end!");
        this.removeEventListener(egret.Event.ENTER_FRAME,this.gameViewUpdate,this);
        //枪停止射击
        //移除制造子弹的监听事件
        //移除犀牛的监听事件
        //清理子弹等
        this.background.texture = RES.getRes("background5_png");
        this.plant.texture = RES.getRes("plant5_png");
        this.removeChild(this.rhinoceros);
        let blood:egret.Bitmap = GameUtil.createBitmapByName("blood_png");
        this.addChild(blood);
        

    }

    /**游戏画面更新*/
    private gameViewUpdate(evt:egret.Event):void{
        
        //回收子弹
        //var fireSpeed:number = 1;
        /*
        var i:number = 0;
        var bullet:Bullet;
        var myBulletsCount:number = this.theBullets.length;
        var delArr:any[] = [];
        for(;i<myBulletsCount;i++) {
            bullet = this.theBullets[i];
            //bullet.x += fireSpeed*(Math.cos(bullet.fireAngle/180*Math.PI));
            //bullet.y += fireSpeed*(Math.sin(bullet.fireAngle/180*Math.PI));
            if(bullet.y > this.stageH || bullet.y < 0 || bullet.x < 0 || bullet.x > this.stageW)
                delArr.push(bullet);
        }
        for(i=0;i<delArr.length;i++) {//回收不显示的子弹
            bullet = delArr[i];
            this.removeChild(bullet);
            Bullet.reclaim(bullet);
            this.theBullets.splice(this.theBullets.indexOf(bullet),1);
        }
        */
        //this.gameHitTest();
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
        var bullet:Bullet;
        var theBulletsCount:number = this.theBullets.length;
        
        var delBullets:Bullet[] = [];//记录需要消失的子弹
        
        //被子弹打中以后，受到伤害
        for(i=0;i<theBulletsCount;i++) {
            bullet = this.theBullets[i];
            if(this.rhinoceros.hitTestPoint(bullet.x,bullet.y,true)) {
                this.rhinoceros.hurt();
                if(delBullets.indexOf(bullet)==-1)
                    delBullets.push(bullet);
            }
        }
        //打中的子弹需要消失
        while(delBullets.length>0) {
            bullet = delBullets.pop();
            this.removeChild(bullet);
            this.theBullets.splice(this.theBullets.indexOf(bullet),1);
            Bullet.reclaim(bullet);
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
        newBullet = Bullet.produce("bullet_png",evt.data);
        newBullet.x = theGun.x;
        newBullet.y = theGun.y;
        this.addChildAt(newBullet,this.numChildren-1);

        //设置子弹运动动画
        let fireSpeedTime:number = 10000;
        let fireDistance:number = 1.4*this.stageW;
        this.theBullets.push(newBullet);
        egret.Tween.get(newBullet)
        .to({x:newBullet.x+fireDistance*(Math.cos(newBullet.fireAngle/180*Math.PI)),y:newBullet.y+fireDistance*(Math.sin(newBullet.fireAngle/180*Math.PI))},fireSpeedTime)
        .call(this.onBulletMoveCompleted,this,[newBullet]);
        
    }

    /**
     * 子弹移动结束后
     */
    public onBulletMoveCompleted(theBullet:Bullet)
    {
        this.removeChild(theBullet);
        Bullet.reclaim(theBullet);
        this.theBullets.splice(this.theBullets.indexOf(theBullet),1);
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
        for(i=0;i<this.theBullets.length;i++){
            egret.Tween.pauseTweens(this.theBullets[i]);
        }

        theRhi.addChild(theRhi.hitPerformance);

        if(evt.data <= 3){
            let rhiTexture:string = "step";
            let bgTexture:string = "background";
            let plTexture:string = "plant";

            if(theRhi.isLeft == true)
                rhiTexture += "l";
            else
                rhiTexture += "l";

            var numS = (evt.data+1).toString();
            rhiTexture += (numS + "_png");
            bgTexture +=  (numS + "_png");
            plTexture +=  (numS + "_png");
            //console.log(rhiTexture);

            this.background.texture = RES.getRes(bgTexture);
            this.plant.texture = RES.getRes(plTexture);
            theRhi.bmp.texture = RES.getRes(rhiTexture);
        }
        egret.setTimeout(function(){
            theRhi.removeChild(theRhi.hitPerformance);
            for(i=0;i<this.theBullets.length;i++){
                egret.Tween.resumeTweens(this.theBullets[i]);
            }
            this.rhinoceros.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.mouseDown, this);
            this.rhinoceros.addEventListener(egret.TouchEvent.TOUCH_END, this.mouseUp, this);
        },this,400);
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