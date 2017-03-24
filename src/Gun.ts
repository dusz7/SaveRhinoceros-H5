class Gun extends egret.DisplayObjectContainer{
    
    private bmp:egret.Bitmap;
    private fireDelay:number;
    private fireAngle:number;
    //private fireTimer:egret.Timer;

    public constructor(x:number,y:number,angle:number){
        super();
        this.x = x;
        this.y = y;
        this.fireAngle = angle;
    }

    public fire():void{
        this.dispatchEventWith("createBullet",false,this.fireAngle);
    }
}