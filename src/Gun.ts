class Gun extends egret.DisplayObjectContainer{
    
    private bmp:egret.Bitmap;
    private fireDelay:number;
    private fireAngle:number;
    private speedTime:number = 10000;

    public constructor(x:number,y:number,angle:number){
        super();
        this.x = x;
        this.y = y;
        this.fireAngle = angle;
    }

    public fire(speedTime:number):void{
        this.speedTime = speedTime;
        this.dispatchEventWith("createBullet",false,{angle:this.fireAngle,speedTime:this.speedTime});
    }
}