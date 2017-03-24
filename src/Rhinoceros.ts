class Rhinoceros extends egret.DisplayObjectContainer{
    
    private bmp:egret.Bitmap;
    private textureName:string;
    private hitBlood:egret.Bitmap;

    public blood:number = 3;

    public constructor(textureName:string){
        super();
        this.textureName = textureName;
        this.bmp = GameUtil.createBitmapByName(textureName);
        this.bmp.pixelHitTest = true;
        this.addChild(this.bmp);
        this.hitBlood = GameUtil.createBitmapByName("hit_png");
        this.hitBlood.anchorOffsetX = this.hitBlood.width/2;
        this.hitBlood.anchorOffsetY = this.hitBlood.height/2;
        this.hitBlood.x = this.width/2.5;
        this.hitBlood.y = this.height/1.7;
    }
    public reduceBlood(){
        this.blood -= 1;
        if(this.blood == 2){
            this.removeChild(this.bmp);
            this.bmp = GameUtil.createBitmapByName("stepl2_png");
            this.bmp.pixelHitTest = true;
            this.addChild(this.bmp);
            this.addChild(this.hitBlood);
            egret.setTimeout(function(){
                this.removeChild(this.hitBlood);
            },this,300,);
            
        }else if(this.blood == 1){
            this.bmp = GameUtil.createBitmapByName("stepl3_png");
        }else if(this.blood == 0){
            this.bmp = GameUtil.createBitmapByName("stepl4_png");
        }
    }
}