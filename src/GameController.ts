
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

    private roundShowCen:egret.Bitmap;
    private topColumn:TopColumn;

    private resultScoreShow:egret.Bitmap;
    private resultScoreText:egret.TextField;

    private endContinueBtn:egret.Bitmap;
    private endHelpBtn:egret.Bitmap;
    private endAgainBtn:egret.Bitmap;
    private endNoteRShow:egret.Bitmap;
    private endNoteGShow:egret.Bitmap;

    private rhinoceros:Rhinoceros;
    private _touchStatus:boolean = false;              //当前触摸状态，按下时，值为true
    private _distance:egret.Point = new egret.Point(); //鼠标点击时，鼠标全局坐标与_bird的位置差

    private pauseTimeOut:number = 400;

    private passNum:number = 0;

    private theGunsList:Gun[] = [];
    private thePointsList:PropsPoint[] =[];

    private theBulletsList:Bullet[] = [];
    private theBloodProps:BloodProps;

    private myFireController:FireController;
    private myPropsController:PropsController;

    private initFireDelay:number = 2000;
    
    private initBulletSpeedTime:number = 3700;//在此规定该移动时间为移动场景高度的时间

    private endAgainGaming:boolean;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {

        //初始化一些东西（游戏进行标识、分数、枪支和子弹列表等）
        this.endAgainGaming = false;
        this.passNum = 0;
        this.theGunsList = [];
        this.theBulletsList = [];

        //获取主场景的宽和高
        this.stageW = this.stage.stageWidth;
        this.stageH = this.stage.stageHeight;

        //绘制第一个场景
        this.background = GameUtil.createBitmapByName("background_png");    //背景
        this.addChild(this.background);
        this.startBtn = GameUtil.createBitmapByName("start_button_png");    //开始按钮
        this.startBtn.anchorOffsetX = this.startBtn.width/2;    //设置按钮的锚点
        this.startBtn.anchorOffsetY = this.startBtn.height/2;
        this.startBtn.x = this.stageW/2;    //居中定位
        this.startBtn.y = this.stageH/2;
        this.startBtn.touchEnabled = true;  //可以点按
        this.startBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.startButtonClick,this);  //点击按钮开始游戏Round1
        this.addChild(this.startBtn);
        this.plant = GameUtil.createBitmapByName("plant_png");  //植物丛
        this.addChildAt(this.plant,-1); //要保证植物丛的图层较高
        
    }

    /**
     * 开始按钮点击后
     */
    public startButtonClick()
    {
        //判断是否是首次游戏，进行不同的逻辑
        if(this.endAgainGaming) {   //当不是首次游戏时，移除结束介绍场景内容，重新绘制场景
            document.title = "保卫犀牛大作战 RhinoDefense";

            this.removeChild(this.endNoteGShow);
            this.removeChild(this.endNoteRShow);
            this.removeChild(this.endHelpBtn);
            this.endAgainBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.startButtonClick,this);
            this.removeChild(this.endAgainBtn);

            this.background.texture = RES.getRes("background_png");
            this.addChildAt(this.plant,-1);
        } else {    //是首次游戏，则直接移除“开始”按钮
            this.startBtn.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.startButtonClick,this);
            this.removeChild(this.startBtn);
        }

        //场景绘制完毕后跳转到Round提示场景，进行Round1
        this.roundStartShow(1);
    }

    /**
     * Round开始提示
     */
    private roundStartShow(roundNum:number)
    {
        //根据关数得到指定Round指示图
        var texture:string = "round";
        texture += roundNum.toString();
        texture += "_png";
        this.roundShowCen = GameUtil.createBitmapByName(texture);
        this.roundShowCen.x = 670;
        this.roundShowCen.y = 396;
        this.addChild(this.roundShowCen);

        //不同关数，触发的改变应该是不同的
        if(roundNum == 1){  //当为Round1时，开始首次游戏场景
            egret.setTimeout(function(){
                this.removeChild(this.roundShowCen);
                //this.topColumn.updateRoundNum(1);
                this.gameStart();
            },this,3*this.pauseTimeOut);
        }
        if(roundNum >= 2){
            egret.setTimeout(function(){
                this.removeChild(this.roundShowCen);
                this.topColumn.updateRoundNum(roundNum);
                this.roundStart(roundNum);
            },this,3*this.pauseTimeOut);
        }
        
    }

    /**
     * 固定子弹数后，Round更换的监听器
     */
    private roundStartShowHandler(evt:egret.Event)
    {
        this.myPropsController.pauseCreate();
        this.roundStartShow(evt.data);
    }

    /**
     * Round开始
     */
    public roundStart(roundNum:number)
    {
        if(roundNum == 1){
            this.myFireController = new FireController(this.theGunsList);   //创建、初始化子弹发射控制逻辑
            this.myFireController.addEventListener("updateRound",this.roundStartShowHandler,this);
            this.myFireController.startFire(this.initFireDelay,this.initBulletSpeedTime);

            this.myPropsController = new PropsController(this.thePointsList);
            this.myPropsController.startCreate();
        }else if(roundNum >= 2){
            egret.setTimeout(function(){
                this.myFireController.resumeFire();
                this.myPropsController.resumeCreate();
            },this,this.pauseTimeOut);
        }
    }

    /**
     * 游戏开始（首次）
     */
    public gameStart():void
    {
        //初始化一些重要的属性
        this.endAgainGaming = false;
        this.passNum = 0;
        this.theGunsList = [];
        this.theBulletsList = [];
        
        //添加上方状态栏
        this.topColumn = new TopColumn();
        this.addChild(this.topColumn);

        //添加犀牛，绑定击中受伤、捡道具回血、转向、拖拽移动的监听事件
        this.rhinoceros = new Rhinoceros("rhino_l_png");
        this.rhinoceros.x = (this.stageW-this.rhinoceros.width)/2;
        this.rhinoceros.y = (this.stageH-this.rhinoceros.height)/2;
        this.rhinoceros.addEventListener("getHurt",this.getHurtHandler,this);
        this.rhinoceros.addEventListener("getTreat",this.getTreatHandler,this);
        this.rhinoceros.addEventListener("turnTo",this.turnToHandler,this);
        this.rhinoceros.touchEnabled = true;    //使目标可以随着拖拽移动
        this.rhinoceros.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.mouseDown, this);
        this.rhinoceros.addEventListener(egret.TouchEvent.TOUCH_END, this.mouseUp, this);
        this.addChildAt(this.rhinoceros,this.numChildren-2);

        //建立枪支列表，添加每个枪口的位置和发射角度等信息
        var gunsjsons = [
            {"x":0,"y":250,"fireAngle":50},
            {"x":110,"y":170,"fireAngle":80},
            {"x":275,"y":30,"fireAngle":80},
            {"x":510,"y":90,"fireAngle":60},
            {"x":710,"y":115,"fireAngle":120},
            {"x":710,"y":115,"fireAngle":145},
            {"x":930,"y":85,"fireAngle":100},
            {"x":1215,"y":120,"fireAngle":95},
            {"x":1370,"y":85,"fireAngle":70},
            {"x":1565,"y":70,"fireAngle":125},
            {"x":1700,"y":90,"fireAngle":100},
            {"x":1920,"y":135,"fireAngle":145},
            {"x":0,"y":900,"fireAngle":-50},
            {"x":210,"y":1020,"fireAngle":-80},
            {"x":405,"y":1040,"fireAngle":-90},
            {"x":665,"y":1000,"fireAngle":-100},
            {"x":870,"y":990,"fireAngle":-110},
            {"x":1080,"y":990,"fireAngle":-100},
            {"x":1280,"y":985,"fireAngle":-42},
            {"x":1480,"y":975,"fireAngle":-95},
            {"x":1630,"y":1005,"fireAngle":-95},
            {"x":1770,"y":960,"fireAngle":-125},
            {"x":1770,"y":960,"fireAngle":-130},
            {"x":1920,"y":855,"fireAngle":-160}
        ];
        var i:number;
        var newGun:Gun;
        for(i=0; i<gunsjsons.length; i++){
            newGun = new Gun(gunsjsons[i].x,gunsjsons[i].y,gunsjsons[i].fireAngle);
            newGun.addEventListener("createBullet",this.createBulletHandler,this);  //为枪支添加创建子弹的监听事件，从其fire方法分发出来
            this.theGunsList.push(newGun);  //将新建枪支添加到列表中
        }

        //添加道具生成点列表
        var pointsjsons = [
            {"x":300,"y":380},
            {"x":1600,"y":430},
            {"x":900,"y":900}
        ];
        var newPoint:PropsPoint;
        for(i=0; i<pointsjsons.length; i++){
            newPoint = new PropsPoint(pointsjsons[i].x,pointsjsons[i].y);
            newPoint.addEventListener("createProps",this.createPropsHandler,this);  //为生成点添加创建道具的监听事件，从其createProps方法分发出来
            this.thePointsList.push(newPoint);  //将新建枪支添加到列表中
        }

        //添加游戏帧检测监听器
        this.addEventListener(egret.Event.ENTER_FRAME,this.gameAllTest,this);

        //开始Round1
        this.roundStart(1);
    }


    /**
     * 游戏结束
     */
    public gameStop():void{
        
        //移除各项监听事件，删除所有对象
        if(this.getChildIndex(this.theBloodProps) != -1)
        {
            this.removeChild(this.theBloodProps);
        }

        this.rhinoceros.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.mouseDown, this);    //移除犀牛的监听事件
        this.rhinoceros.removeEventListener(egret.TouchEvent.TOUCH_END, this.mouseUp, this);
        this.rhinoceros.removeEventListener("getHurt",this.getHurtHandler,this);
        this.rhinoceros.removeEventListener("getTreat",this.getTreatHandler,this);
        this.rhinoceros.removeEventListener("turnTo",this.turnToHandler,this);

        this.myFireController.stopFire();   //需要停止射击吗？
        this.myPropsController.stopCreate();
        
        var i:number;   //移除枪支射击的制造子弹的监听事件
        for(i=0; i<this.theGunsList.length; i++){
            var theGun:Gun = this.theGunsList[i];
            theGun.removeEventListener("createBullet",this.createBulletHandler,this);
        }
        this.theGunsList = [];

        egret.Tween.removeAllTweens();  //清除所有动画效果

        //设置延迟
        egret.setTimeout(function(){
            var i:number;
            for(i=0;i<this.theBulletsList.length;i++){  //清除子弹
                let theBullet:Bullet = this.theBulletsList[i];
                this.removeChild(theBullet);
                //this.theBulletsList.splice(this.theBulletsList.indexOf(theBullet),1);
                Bullet.reclaim(theBullet);
            }

            this.theBulletsList = [];   //清除其余资源
            this.removeChild(this.rhinoceros);
            this.removeChild(this.topColumn);

            if(this.getChildIndex(this.theBloodProps) != -1)
            {
                this.removeChild(this.theBloodProps);
            }

            //跳转到结果显示UI
            this.gameEndScoreUILoad();
        },this,2.5*this.pauseTimeOut);
        
    }

    /**
     * 游戏结束的结果UI绘制
     */
    private gameEndScoreUILoad()
    {
        //更改Title
        document.title = "我成功帮助犀牛躲过了 "+this.passNum+" 次攻击！ 加入我们，一起来帮助犀牛吧！";

        //增加Congratulations显示文字
        this.resultScoreShow = GameUtil.createBitmapByName("end_score_png");
        this.resultScoreShow.x = (this.stageW-this.resultScoreShow.width)/2;
        this.resultScoreShow.y = 380;
        this.addChild(this.resultScoreShow);

        //设置分数显示文字
        this.resultScoreText = new egret.TextField();
        this.resultScoreText.width = 230;
        this.resultScoreText.height = 130;
        this.resultScoreText.text = this.passNum.toString();
        this.resultScoreText.textAlign = "center"; 
        this.resultScoreText.bold = true;
        this.resultScoreText.size = 110;
        this.resultScoreText.textColor = 0xd5221e;
        this.resultScoreText.x = 1140;
        this.resultScoreText.y = 610;
        this.addChild(this.resultScoreText);

        //添加“下一页”按钮
        this.endAgainGaming = true;
        this.endContinueBtn = GameUtil.createBitmapByName("end_button_continue_png");//开始按钮
        this.endContinueBtn.x = (this.stageW-this.endContinueBtn.width)/2;//居中定位
        this.endContinueBtn.y = 733;//居中定位
        this.endContinueBtn.touchEnabled = true;//开启触碰
        this.endContinueBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.gameEndNoteUILoad,this);//点击按钮开始游戏
        this.addChild(this.endContinueBtn);

    }
    /**
     * 有些结束后的信息提醒界面
     */
    private gameEndNoteUILoad()
    {
        this.removeChild(this.endContinueBtn);
        this.removeChild(this.plant);
        this.removeChild(this.resultScoreShow);
        this.removeChild(this.resultScoreText);
        this.background.texture = RES.getRes("background_end_png");
        this.endNoteRShow = GameUtil.createBitmapByName("end_note_red_png");
        this.endNoteRShow.x = 630; this.endNoteRShow.y = 187;
        this.endNoteGShow = GameUtil.createBitmapByName("end_note_green_png");
        this.endNoteGShow.x = 204; this.endNoteGShow.y = 459;
        this.addChild(this.endNoteGShow);
        this.addChild(this.endNoteRShow);
        this.endHelpBtn = GameUtil.createBitmapByName("end_botton_help_png");
        this.endHelpBtn.x = 1261; this.endHelpBtn.y = 792;
        this.endHelpBtn.touchEnabled = true;
        this.endHelpBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.jumpToInctroduction,this);
        this.endAgainBtn = GameUtil.createBitmapByName("end_button_again_png");
        this.endAgainBtn.x = 328; this.endAgainBtn.y = 788;
        this.endAgainBtn.touchEnabled = true;
        this.endAgainBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.startButtonClick,this);
        this.addChild(this.endHelpBtn);
        this.addChild(this.endAgainBtn);
    }

    /**
     * 跳转到“介绍文”界面
     */
    private jumpToInctroduction()
    {
        window.open("https://mp.weixin.qq.com/s/Qnk0GObwzurtnxKAaqRw2A");
    }

    /**
     * 游戏碰撞检测、子弹出界检测以及子弹击中的结果
     */
    private gameAllTest(evt:egret.Event):void 
    {
        var i:number = 0;
        var theBullet:Bullet;
        var theBulletsCount:number = this.theBulletsList.length;
        
        for(i=0;i<this.theBulletsList.length;i++){
            egret.Tween.pauseTweens(this.theBulletsList[i]);    //暂停子弹动画，进行统计
        }

        if(this.getChildIndex(this.theBloodProps) != -1)
        {
            if(GameUtil.hitTest(this.rhinoceros,this.theBloodProps))
            {
                this.removeChild(this.theBloodProps);
                this.rhinoceros.getTreat();
            }
        }

        var outDelBullets:Bullet[] = [];   //记录出界需要删除的子弹
        var hitDelBullets:Bullet[] = [];    //记录碰撞后需要消失的子弹
        
        //统计子弹是否击中、是否出界
        for(i=0;i<theBulletsCount;i++) {
            theBullet = this.theBulletsList[i];
            //egret.Tween.pauseTweens(theBullet); 
            if(this.getChildIndex(theBullet) != -1)
            {
                var BX = theBullet.x;
                var BY = theBullet.y;
                if(BY < 0 || BY > this.stageH || BX < 0 || BX > this.stageW){   //子弹是否出界
                    if(outDelBullets.indexOf(theBullet)==-1)
                        outDelBullets.push(theBullet);    
                }else if(this.rhinoceros.hitTestPoint(theBullet.x,theBullet.y,true)) {  //子弹是否击中

                    let hitX:number = theBullet.x-this.rhinoceros.x;    //获得击中点在犀牛上的相对坐标
                    let hitY:number = theBullet.y-this.rhinoceros.y;

                    this.rhinoceros.getHurt(theBullet.damageNum,hitX,hitY); //犀牛受伤结算

                    egret.Tween.removeTweens(theBullet);
                    this.removeChild(theBullet);
                    this.theBulletsList.splice(this.theBulletsList.indexOf(theBullet),1);
                    Bullet.reclaim(theBullet);
                }
            }
            
        }

        //出界的子弹需要消失、回收，更新分数
        for(i=0; i<outDelBullets.length; i++) 
        {
            this.passNum ++;
            this.topColumn.updateBullet(this.passNum);  //更新分数显示
            //console.log("now pass :"+this.passNum);
            theBullet = outDelBullets[i];   //回收相关子弹对象
            egret.Tween.removeTweens(theBullet);
            this.removeChild(theBullet);
            this.theBulletsList.splice(this.theBulletsList.indexOf(theBullet),1);
            Bullet.reclaim(theBullet);
        }

        for(i=0;i<this.theBulletsList.length;i++){
            egret.Tween.resumeTweens(this.theBulletsList[i]);    //恢复子弹动画
        }

        //血量降为0，游戏结束
        if(this.rhinoceros.bloodNum <= 0) {
            //移除帧检测监听器
            this.removeEventListener(egret.Event.ENTER_FRAME,this.gameAllTest,this);
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
        newBullet = Bullet.produce(evt.data.bulletTexture,evt.data.bulletDamage,evt.data.angle);
        newBullet.x = theGun.x;
        newBullet.y = theGun.y;
        this.addChildAt(newBullet,this.numChildren-2);
        this.theBulletsList.push(newBullet);

        //设置子弹运动动画
        let fireDistance:number = this.stageH/(Math.sin(Math.abs(newBullet.fireAngle)/180*Math.PI));
        let fireSpeedTime:number = evt.data.speedTime/(Math.sin(Math.abs(newBullet.fireAngle)/180*Math.PI));
        egret.Tween.get(newBullet)
        .to({x:newBullet.x+fireDistance*(Math.cos(newBullet.fireAngle/180*Math.PI)),y:newBullet.y+fireDistance*(Math.sin(newBullet.fireAngle/180*Math.PI))},fireSpeedTime)
        ;
        
    }

    /**
     * 创建道具
     */
    private createPropsHandler(evt:egret.Event):void
    {
        var thePoint = evt.target;
        this.theBloodProps = new BloodProps(RES.getRes(evt.data));
        this.theBloodProps.x = thePoint.x;
        this.theBloodProps.y = thePoint.y;

        console.log("now create a props");
        this.addChildAt(this.theBloodProps,this.numChildren-2);

        egret.setTimeout(function(){
            if(this.getChildIndex(this.theBloodProps) != -1)
            {
                this.removeChild(this.theBloodProps);
            }
        },this,2000);
    }

    /**
     * 掉血时的场景变化
     */
    public getHurtHandler(evt:egret.Event)
    {   
        var bloodNum:number = evt.data.bloodNum;
        var bulletDamage:number = evt.data.bulletDamage;

        //暂停场景
        //this.rhinoceros.touchEnabled = false;
        //console.log("rhiTouch: "+this.rhinoceros.touchEnabled);
        var i:number;
        for(i=0;i<this.theBulletsList.length;i++){
            egret.Tween.pauseTweens(this.theBulletsList[i]);
        }

        //添加击中场景和血量指示变化
        if(bloodNum >= -1){
            if(bulletDamage == 1)
            {
                this.topColumn.addBloodNote("re1");
            }else if(bulletDamage == 2)
            {
                this.topColumn.addBloodNote("re2");
            }

            this.topColumn.updateBlood(bloodNum);

            //设置延时，时间到后恢复场景
            egret.setTimeout(function()
            {
                
                for(i=0;i<this.theBulletsList.length;i++)
                {
                    egret.Tween.resumeTweens(this.theBulletsList[i]);
                }

                //被麻醉针打中以后，应该麻痹1秒钟
                if(bulletDamage == 0)
                {
                    //使得犀牛不能动   
                    this.rhinoceros.touchEnabled = false;

                    egret.setTimeout(function(){
                        this.rhinoceros.touchEnabled = true;
                    },this,1000);
                }
            },this,this.pauseTimeOut);
        }
    }
    
    /**
     * 捡血以后
     */
    private getTreatHandler(evt:egret.Event)
    {
        this.topColumn.addBloodNote("de1");
        this.topColumn.updateBlood(evt.data);
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
        if( this._touchStatus && this.rhinoceros.touchEnabled)
        {
            if(evt.stageX<this.stageW-150 && evt.stageX >100 && evt.stageY > 150 && evt.stageY < this.stageH-150)
            {
                this.rhinoceros.x = evt.stageX - this._distance.x;
                this.rhinoceros.y = evt.stageY - this._distance.y;
            }
        }
    }

    private mouseDown(evt:egret.TouchEvent)
    {
        this._touchStatus = true;
        this._distance.x = evt.stageX - this.rhinoceros.x;
        this._distance.y = evt.stageY - this.rhinoceros.y;
        this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.objectMove, this);
    }

    private mouseUp(evt:egret.TouchEvent)
    {
        this._touchStatus = false;
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.objectMove, this);
    }
}