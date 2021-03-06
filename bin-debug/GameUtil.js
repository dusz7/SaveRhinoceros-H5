var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GameUtil = (function () {
    function GameUtil() {
    }
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    GameUtil.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    /**基于矩形的碰撞检测*/
    GameUtil.hitTest = function (obj1, obj2) {
        var rect1 = obj1.getBounds();
        var rect2 = obj2.getBounds();
        rect1.x = obj1.x;
        rect1.y = obj1.y;
        rect2.x = obj2.x;
        rect2.y = obj2.y;
        return rect1.intersects(rect2);
        /*
        if(obj1.hitTestPoint((rect2.left+rect2.width/2),(rect2.height/2+rect2.top),true)){
            
            return true;
        }
        */
        /*
        if(obj1.hitTestPoint(rect2.bottomRight.x,rect2.bottomRight.y,true)){
            //console.log("bottomRight");
            //return true;
        }else if(obj1.hitTestPoint(rect2.right,rect2.y,true)){
            //console.log("upRight");
            //return true;
        }else if(obj1.hitTestPoint(rect2.x,rect2.bottom,true)){
            //console.log("bottomLeft");
            //return true;
        }else if(obj1.hitTestPoint(rect2.x,rect2.y,true)){
            //console.log("upLeft");
            //return true;
        }
        */
    };
    return GameUtil;
}());
__reflect(GameUtil.prototype, "GameUtil");
//# sourceMappingURL=GameUtil.js.map