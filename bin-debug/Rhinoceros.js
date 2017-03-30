var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Rhinoceros = (function (_super) {
    __extends(Rhinoceros, _super);
    //public isLeft:boolean;
    function Rhinoceros(textureName) {
        var _this = _super.call(this) || this;
        //初始化犀牛形象
        _this.bmp = GameUtil.createBitmapByName(textureName);
        //this.bmp.pixelHitTest = true;
        _this.addChild(_this.bmp);
        //初始化被子弹击中的场景
        _this.hitBulletPerformance = GameUtil.createBitmapByName("hit_bullet_png");
        _this.hitBulletPerformance.anchorOffsetX = _this.hitBulletPerformance.width / 2;
        _this.hitBulletPerformance.anchorOffsetY = _this.hitBulletPerformance.height / 2;
        _this.hitBulletPerformance.x = _this.width / 2;
        _this.hitBulletPerformance.y = _this.height / 1.7;
        //初始化被麻醉针击中的场景
        _this.hitAnestheticPerformance = GameUtil.createBitmapByName("hit_anesthetic_png");
        _this.hitAnestheticPerformance.anchorOffsetX = _this.hitAnestheticPerformance.width / 2;
        _this.hitAnestheticPerformance.anchorOffsetY = _this.hitAnestheticPerformance.width / 2;
        _this.hitAnestheticPerformance.x = _this.width / 4;
        _this.hitAnestheticPerformance.y = 0;
        //设置锚点为中心位置
        //this.anchorOffsetX = this.width/2;
        //this.anchorOffsetY = this.height/2;
        //初始化犀牛的属性
        //this.isLeft = true;
        _this.bloodNum = 3;
        return _this;
    }
    /**
     * 犀牛被击中
     */
    Rhinoceros.prototype.getHurt = function (bulletDamageNum, hitX, hitY) {
        this.bloodNum -= bulletDamageNum;
        this.hitBulletPerformance.x = hitX;
        this.hitBulletPerformance.y = hitY;
        if (this.bloodNum >= -1) {
            this.addChild(this.hitBulletPerformance);
            if (bulletDamageNum == 0) {
                this.addChild(this.hitAnestheticPerformance);
            }
            egret.setTimeout(function () {
                this.removeChild(this.hitBulletPerformance);
                if (bulletDamageNum == 0) {
                    this.removeChild(this.hitAnestheticPerformance);
                }
            }, this, 400);
            this.dispatchEventWith("getHurt", false, { bloodNum: this.bloodNum, bulletDamage: bulletDamageNum });
        }
    };
    /**
     * 犀牛得到回血道具
     */
    Rhinoceros.prototype.getTreat = function () {
        if (this.bloodNum < 3) {
            this.bloodNum++;
            this.dispatchEventWith("getTreat", false, this.bloodNum);
        }
    };
    Rhinoceros.prototype.turn = function () {
        //this.isLeft = !this.isLeft;
        this.dispatchEventWith("turnTo");
    };
    return Rhinoceros;
}(egret.DisplayObjectContainer));
__reflect(Rhinoceros.prototype, "Rhinoceros");
//# sourceMappingURL=Rhinoceros.js.map