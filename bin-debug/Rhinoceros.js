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
    function Rhinoceros(textureName) {
        var _this = _super.call(this) || this;
        _this.blood = 3;
        _this.textureName = textureName;
        _this.bmp = GameUtil.createBitmapByName(textureName);
        _this.bmp.pixelHitTest = true;
        _this.addChild(_this.bmp);
        _this.hitBlood = GameUtil.createBitmapByName("hit_png");
        _this.hitBlood.anchorOffsetX = _this.hitBlood.width / 2;
        _this.hitBlood.anchorOffsetY = _this.hitBlood.height / 2;
        _this.hitBlood.x = _this.width / 2.5;
        _this.hitBlood.y = _this.height / 1.7;
        return _this;
    }
    Rhinoceros.prototype.reduceBlood = function () {
        this.blood -= 1;
        if (this.blood == 2) {
            this.removeChild(this.bmp);
            this.bmp = GameUtil.createBitmapByName("stepl2_png");
            this.bmp.pixelHitTest = true;
            this.addChild(this.bmp);
            this.addChild(this.hitBlood);
            egret.setTimeout(function () {
                this.removeChild(this.hitBlood);
            }, this, 400);
        }
        else if (this.blood == 1) {
            this.bmp = GameUtil.createBitmapByName("stepl3_png");
        }
        else if (this.blood == 0) {
            this.bmp = GameUtil.createBitmapByName("stepl4_png");
        }
    };
    return Rhinoceros;
}(egret.DisplayObjectContainer));
__reflect(Rhinoceros.prototype, "Rhinoceros");
//# sourceMappingURL=Rhinoceros.js.map