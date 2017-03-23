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
    function Rhinoceros() {
        var _this = _super.call(this) || this;
        _this.blood = 3;
        _this.bmp = GameUtil.createBitmapByName("rhinoceros_png");
        _this.bmp.pixelHitTest = true;
        _this.addChild(_this.bmp);
        return _this;
    }
    return Rhinoceros;
}(egret.DisplayObjectContainer));
__reflect(Rhinoceros.prototype, "Rhinoceros");
//# sourceMappingURL=Rhinoceros.js.map