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
        //public blood:number = 3;
        _this.hitNum = 0;
        _this.textureName = textureName;
        _this.bmp = GameUtil.createBitmapByName(textureName);
        _this.bmp.pixelHitTest = true;
        _this.addChild(_this.bmp);
        _this.hitPerformance = GameUtil.createBitmapByName("hit_png");
        _this.hitPerformance.anchorOffsetX = _this.hitPerformance.width / 2;
        _this.hitPerformance.anchorOffsetY = _this.hitPerformance.height / 2;
        _this.hitPerformance.x = _this.width / 2.5;
        _this.hitPerformance.y = _this.height / 1.7;
        _this.anchorOffsetX = _this.width / 2;
        _this.anchorOffsetY = _this.height / 2;
        _this.isLeft = true;
        return _this;
    }
    Rhinoceros.prototype.hurt = function () {
        this.hitNum += 1;
        if (this.hitNum <= 3) {
            this.addChild(this.hitPerformance);
            egret.setTimeout(function () {
                this.removeChild(this.hitPerformance);
            }, this, 300);
            this.dispatchEventWith("changeStep", false, this.hitNum);
        }
    };
    Rhinoceros.prototype.turn = function () {
        this.isLeft = !this.isLeft;
        this.dispatchEventWith("turnTo");
    };
    return Rhinoceros;
}(egret.DisplayObjectContainer));
__reflect(Rhinoceros.prototype, "Rhinoceros");
//# sourceMappingURL=Rhinoceros.js.map