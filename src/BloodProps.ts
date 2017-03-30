

class BloodProps extends egret.Bitmap
{
    private textureName:string;

    public constructor(texture:egret.Texture) {
        super(texture);
        
        this.anchorOffsetX = this.width/2;
        this.anchorOffsetY = this.height/2;

	}

}