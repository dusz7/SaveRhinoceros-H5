class Gun extends egret.DisplayObjectContainer{
    
    private fireAngle:number;
    private speedTime:number = 10000;

    private bulletTexture:string;
    private bulletDamage:number;

    public constructor(x:number,y:number,angle:number){
        super();
        this.x = x;
        this.y = y;
        this.fireAngle = angle;
    }

    public fire(bulletTexture:string,bulletDamage:number,speedTime:number):void{
        this.bulletTexture = bulletTexture;
        this.bulletDamage = bulletDamage;
        this.speedTime = speedTime;
        this.dispatchEventWith("createBullet",false,{bulletTexture:this.bulletTexture,bulletDamage:this.bulletDamage,angle:this.fireAngle,speedTime:this.speedTime});
    }
}