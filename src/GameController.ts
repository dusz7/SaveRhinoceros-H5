
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
    private _lastTime:number;

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

        var gun1:Gun = new Gun(0,250,50);
        var gun2:Gun = new Gun(110,170,80);
        var gun3:Gun = new Gun(275,30,80);
        gun1.addEventListener("createBullet",this.createBulletHandler,this);
        gun2.addEventListener("createBullet",this.createBulletHandler,this);
        gun3.addEventListener("createBullet",this.createBulletHandler,this);
        gun1.fire();
        gun2.fire();
        gun3.fire();
        
        //console.log("background:"+this.getChildIndex(this.background)+",rhinoceros:"+this.getChildIndex(this.rhinoceros)+
        //",gun:"+this.getChildIndex(gun1)+",plant:"+this.getChildIndex(this.plant));

        this.addEventListener(egret.Event.ENTER_FRAME,this.gameViewUpdate,this);
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
        //为了防止FPS下降造成回收慢，生成快，进而导致DRAW数量失控，需要计算一个系数，当FPS下降的时候，让运动速度加快
        /*
        var nowTime:number = egret.getTimer();
        var fps:number = 1000/(nowTime-this._lastTime);
        this._lastTime = nowTime;
        var speedOffset:number = 60/fps;
        */
        //我的子弹运动
        var fireSpeed:number = 1;
        var i:number = 0;
        var bullet:Bullet;
        var myBulletsCount:number = this.theBullets.length;
        var delArr:any[] = [];
        for(;i<myBulletsCount;i++) {
            bullet = this.theBullets[i];
            bullet.x += fireSpeed*(Math.cos(bullet.fireAngle/180*Math.PI));
            bullet.y += fireSpeed*(Math.sin(bullet.fireAngle/180*Math.PI));
            if(bullet.y > this.stageH || bullet.y < 0 || bullet.x < 0 || bullet.x > this.stageW)
                delArr.push(bullet);
        }
        for(i=0;i<delArr.length;i++) {//回收不显示的子弹
            bullet = delArr[i];
            this.removeChild(bullet);
            Bullet.reclaim(bullet);
            this.theBullets.splice(this.theBullets.indexOf(bullet),1);
        }
        this.gameHitTest();
    }

    /**游戏碰撞检测*/
    private gameHitTest():void {
        var i:number,j:number;
        var bullet:Bullet;
        var theGun:Gun;
        var theBulletsCount:number = this.theBullets.length;
        
        //将需消失的子弹记录
        var delBullets:Bullet[] = [];
        
        //敌人的子弹可以减我血
        for(i=0;i<theBulletsCount;i++) {
            bullet = this.theBullets[i];
            if(GameUtil.hitTest(this.rhinoceros,bullet)) {
                this.rhinoceros.hurt();
                if(delBullets.indexOf(bullet)==-1)
                    delBullets.push(bullet);
            }
        }
        while(delBullets.length>0) {
            bullet = delBullets.pop();
            this.removeChild(bullet);
            this.theBullets.splice(this.theBullets.indexOf(bullet),1);
            Bullet.reclaim(bullet);
        }
        if(this.rhinoceros.hitNum >= 3) {
            //console.log("getHurtNum: "+this.rhinoceros.hitNum);
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
        //console.log(this.getChildIndex(bullet));
        //this.addChildAt(bullet,this.numChildren-1-this.enemyFighters.length);
        this.theBullets.push(newBullet);

    }

    /**
     * 掉血时的变化
     */
    public changeStepHandler(evt:egret.Event)
    {   
        if(evt.data <= 3){
            let rhiTexture:string = "step";
            let bgTexture:string = "background";
            let plTexture:string = "plant";
            var theRhi:Rhinoceros = evt.target;

            if(theRhi.isLeft == true)
                rhiTexture += "l";
            else
                rhiTexture += "r";

            var numS = (evt.data+1).toString();
            rhiTexture += (numS + "_png");
            bgTexture +=  (numS + "_png");
            plTexture +=  (numS + "_png");
            console.log(rhiTexture);

            this.background.texture = RES.getRes(bgTexture);
            this.plant.texture = RES.getRes(plTexture);
            theRhi.bmp.texture = RES.getRes(rhiTexture);
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
            if(this._distance.x < 0){
                //console.log("left");
            }else if(this._distance.x > 0){
                //console.log("right");
            }
            //console.log("moving now ! Mouse: [X:"+evt.stageX+",Y:"+evt.stageY+"]");
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