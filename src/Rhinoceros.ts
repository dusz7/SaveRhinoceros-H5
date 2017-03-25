class Rhinoceros extends egret.DisplayObjectContainer{
    
    private textureName:string;
    public hitPerformance:egret.Bitmap;
    public bmp:egret.Bitmap;
    public isLeft:boolean;
    public hitNum = 0;

    public constructor(textureName:string){
        super();
        this.textureName = textureName;
        this.bmp = GameUtil.createBitmapByName(textureName);
        this.bmp.pixelHitTest = true;
        this.addChild(this.bmp);
        this.hitPerformance = GameUtil.createBitmapByName("hit_png");
        this.hitPerformance.anchorOffsetX = this.hitPerformance.width/2;
        this.hitPerformance.anchorOffsetY = this.hitPerformance.height/2;

        this.hitPerformance.x = this.width/2.5;
        this.hitPerformance.y = this.height/1.7;

        this.anchorOffsetX = this.width/2;
        this.anchorOffsetY = this.height/2;

        this.isLeft = true;
    }
    public hurt(){
        this.hitNum += 1;
        
        if(this.hitNum <= 3){
            
            this.dispatchEventWith("changeStep",false,this.hitNum);
        }
    }
    public turn(){
        this.isLeft = !this.isLeft;
        this.dispatchEventWith("turnTo");
    }
}