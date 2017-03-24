
/**
 * 子弹，利用对象池
 */
class Bullet extends egret.Bitmap
{
    private textureName:string;//可视为子弹类型名
    public fireAngle:number;

    private static cacheDict:Object = {};

    public constructor(texture:egret.Texture,angle:number) {
        super(texture);
        //this.textureName = textureName;
        this.fireAngle = angle;
        
        this.anchorOffsetX = this.width/2;
        this.anchorOffsetY = this.height/2;
        this.rotation = angle;
        this.anchorOffsetX = this.width;
	}

    /**
     * 生产
     */
    public static produce(textureName:string,angle:number):Bullet
    {
        if(Bullet.cacheDict[textureName]==null)
            Bullet.cacheDict[textureName] = [];
        var dict:Bullet[] = Bullet.cacheDict[textureName];
        var bullet:Bullet;
        if(dict.length>0) {
            bullet = dict.pop();
        } else {
            bullet = new Bullet(RES.getRes(textureName),angle);
            bullet.pixelHitTest = true;
        }
        bullet.textureName = textureName;
        bullet.fireAngle = angle;
        bullet.rotation = angle;
        return bullet;
    }

    /**
     * 回收
     */
    public static reclaim(bullet:Bullet):void
    {
        var textureName: string = bullet.textureName;
        if(Bullet.cacheDict[textureName]==null)
            Bullet.cacheDict[textureName] = [];
        var dict:Bullet[] = Bullet.cacheDict[textureName];
        if(dict.indexOf(bullet)==-1)
            dict.push(bullet);
    }

    
}