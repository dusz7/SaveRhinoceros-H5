class Rhinoceros extends egret.DisplayObjectContainer{
    
    private bmp:egret.Bitmap;
    
    public blood:number = 3;

    public constructor(){
        super();
        this.bmp = GameUtil.createBitmapByName("rhinoceros_png");
        this.bmp.pixelHitTest = true;
        this.addChild(this.bmp);
    }

}