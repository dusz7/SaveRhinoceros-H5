

    /**
     * 子弹，利用对象池
     */
    class Bullet extends egret.Bitmap
    {
        private static cacheDict:Object = {};
        /**生产*/
        public static produce(textureName:string):Bullet
        {
            if(Bullet.cacheDict[textureName]==null)
                Bullet.cacheDict[textureName] = [];
            var dict:Bullet[] = Bullet.cacheDict[textureName];
            var bullet:Bullet;
            if(dict.length>0) {
                bullet = dict.pop();
            } else {
                bullet = new Bullet(RES.getRes(textureName));
                bullet.pixelHitTest = true;
            }
            bullet.textureName = textureName;
            return bullet;
        }
        /**回收*/
        public static reclaim(bullet:Bullet):void
        {
            var textureName: string = bullet.textureName;
            if(Bullet.cacheDict[textureName]==null)
                Bullet.cacheDict[textureName] = [];
            var dict:Bullet[] = Bullet.cacheDict[textureName];
            if(dict.indexOf(bullet)==-1)
                dict.push(bullet);
        }

        private textureName:string;//可视为子弹类型名

        public constructor(texture:egret.Texture) {
            super(texture);
            //this.textureName = textureName;
		}
    }