class Gun extends egret.DisplayObjectContainer{
    
    private bmp:egret.Bitmap;
    private fireDelay:number;

    //private fireTimer:egret.Timer;

    public constructor(x:number,y:number,width:number,height:number){
        super();
        this.bmp = GameUtil.createBitmapByName("gun");
        this.bmp.width = width;
        this.bmp.height = height;
        this.bmp.x = x;
        this.bmp.y = y;

        this.addChild(this.bmp);
    }

    public fire():void{
        this.dispatchEventWith("createBullet");
    }
}