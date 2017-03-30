class Rhinoceros extends egret.DisplayObjectContainer
{
    //需要在UI绘制里更改的，需要设置成public
    private hitBulletPerformance:egret.Bitmap;
    private hitAnestheticPerformance:egret.Bitmap;

    private bmp:egret.Bitmap;
    public bloodNum;
    //public isLeft:boolean;

    public constructor(textureName:string){
        super();

        //初始化犀牛形象
        this.bmp = GameUtil.createBitmapByName(textureName);
        //this.bmp.pixelHitTest = true;
        this.addChild(this.bmp);
        
        //初始化被子弹击中的场景
        this.hitBulletPerformance = GameUtil.createBitmapByName("hit_bullet_png");
        this.hitBulletPerformance.anchorOffsetX = this.hitBulletPerformance.width/2;
        this.hitBulletPerformance.anchorOffsetY = this.hitBulletPerformance.height/2;
        this.hitBulletPerformance.x = this.width/2;
        this.hitBulletPerformance.y = this.height/1.7;

        //初始化被麻醉针击中的场景
        this.hitAnestheticPerformance = GameUtil.createBitmapByName("hit_anesthetic_png");
        this.hitAnestheticPerformance.anchorOffsetX = this.hitAnestheticPerformance.width/2;
        this.hitAnestheticPerformance.anchorOffsetY = this.hitAnestheticPerformance.width/2;
        this.hitAnestheticPerformance.x = this.width/4;
        this.hitAnestheticPerformance.y = 0;

        //设置锚点为中心位置
        //this.anchorOffsetX = this.width/2;
        //this.anchorOffsetY = this.height/2;

        //初始化犀牛的属性
        //this.isLeft = true;
        this.bloodNum = 3;
    }

    /**
     * 犀牛被击中
     */
    public getHurt(bulletDamageNum:number,hitX:number,hitY:number)
    {
        this.bloodNum -= bulletDamageNum;
        this.hitBulletPerformance.x = hitX;
        this.hitBulletPerformance.y = hitY;
        
        if(this.bloodNum >= -1)
        {
            this.addChild(this.hitBulletPerformance);
            if(bulletDamageNum == 0)
            {
                this.addChild(this.hitAnestheticPerformance);
            }
            egret.setTimeout(function() {
                this.removeChild(this.hitBulletPerformance);
                if(bulletDamageNum == 0)
                {
                    this.removeChild(this.hitAnestheticPerformance);
                }
            }, this, 400);
            this.dispatchEventWith("getHurt",false,{bloodNum:this.bloodNum,bulletDamage:bulletDamageNum});
        }
    }

    /**
     * 犀牛得到回血道具
     */
    public getTreat()
    {
        if(this.bloodNum < 3)
        {
            this.bloodNum ++;
            this.dispatchEventWith("getTreat",false,this.bloodNum);
        }
    }


    public turn()
    {
        //this.isLeft = !this.isLeft;
        this.dispatchEventWith("turnTo");
    }
}