
/**
 * 子弹，利用对象池
 */
class Bullet extends egret.Bitmap
{
    private textureName:string;//可视为子弹类型名
    public fireAngle:number;
    public damageNum:number;

    private static cacheDict:Object = {};

    public constructor(texture:egret.Texture,damage:number,angle:number) {
        super(texture);
        
        this.damageNum = damage;
        this.fireAngle = angle;

        this.anchorOffsetX = this.width/2;
        this.anchorOffsetY = this.height/2;
        this.rotation = angle;
        this.anchorOffsetX = this.width/4*3;
	}

    /**
     * 生产
     */
    public static produce(textureName:string,damage:number,angle:number):Bullet
    {
        if(Bullet.cacheDict[textureName]==null)
            Bullet.cacheDict[textureName] = [];
        var dict:Bullet[] = Bullet.cacheDict[textureName];
        var bullet:Bullet;
        if(dict.length>0) {
            bullet = dict.pop();
        } else {
            bullet = new Bullet(RES.getRes(textureName),damage,angle);
            bullet.pixelHitTest = true;
        }
        bullet.texture = RES.getRes(textureName);
        bullet.rotation = angle;
        bullet.fireAngle = angle;
        bullet.damageNum = damage;
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