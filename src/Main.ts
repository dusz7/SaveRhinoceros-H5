//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends egret.DisplayObjectContainer {

    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView: LoadingUI;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    }

    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event: RES.ResourceEvent) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event: RES.ResourceEvent) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError(event: RES.ResourceEvent) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress(event: RES.ResourceEvent) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

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
        let background = GameUtil.createBitmapByName("background1_png");
        this.addChild(background);
        
        this.stageW = this.stage.stageWidth;
        this.stageH = this.stage.stageHeight;
        //background.width = stageW;
        //background.height = stageH;

        this.rhinoceros = new Rhinoceros("stepl1_png");
        this.rhinoceros.x = this.stageW/2;
        this.rhinoceros.y = this.stageH/2;
        //目标移动
        this.rhinoceros.touchEnabled = true;
        this.rhinoceros.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.mouseDown, this);
        this.rhinoceros.addEventListener(egret.TouchEvent.TOUCH_END, this.mouseUp, this);
        this.addChild(this.rhinoceros);

        var gun:Gun = new Gun(130,140,100,100);
        gun.addEventListener("createBullet",this.createBulletHandler,this);
        gun.fire();

        this.addEventListener(egret.Event.ENTER_FRAME,this.gameViewUpdate,this);
    }

    /**
     * 创建子弹
     */
    private createBulletHandler(evt:egret.Event):void{
        var bullet:Bullet;
        var theGun:Gun = evt.target;
        bullet = Bullet.produce("bullet_png");
        bullet.x = theGun.x+128;
        bullet.y = theGun.y+110;
        this.addChild(bullet);
        //this.addChildAt(bullet,this.numChildren-1-this.enemyFighters.length);
        this.theBullets.push(bullet);

    }

    /**游戏画面更新*/
    private gameViewUpdate(evt:egret.Event):void{
        //为了防止FPS下降造成回收慢，生成快，进而导致DRAW数量失控，需要计算一个系数，当FPS下降的时候，让运动速度加快
        var nowTime:number = egret.getTimer();
        var fps:number = 1000/(nowTime-this._lastTime);
        this._lastTime = nowTime;
        var speedOffset:number = 60/fps;
        //我的子弹运动
        var i:number = 0;
        var bullet:Bullet;
        var myBulletsCount:number = this.theBullets.length;
        var delArr:any[] = [];
        for(;i<myBulletsCount;i++) {
            bullet = this.theBullets[i];
            bullet.y += 4*speedOffset;
            if(bullet.y>this.stageH)
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

                this.rhinoceros.reduceBlood();
                console.log(this.rhinoceros.blood);

                if(delBullets.indexOf(bullet)==-1)
                    delBullets.push(bullet);
            }
        }
        
        if(this.rhinoceros.blood<=0) {
            this.gameStop();
        } else {
            while(delBullets.length>0) {
                bullet = delBullets.pop();
                this.removeChild(bullet);
                this.theBullets.splice(this.theBullets.indexOf(bullet),1);
                Bullet.reclaim(bullet);
            }
            
        }
    }

    /**
     * 游戏结束
     */
    public gameStop():void{

    }

    /**
     * 物体拖动相关
     */
    private objectMove(evt:egret.TouchEvent)
    {
        if( this._touchStatus )
        {
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


