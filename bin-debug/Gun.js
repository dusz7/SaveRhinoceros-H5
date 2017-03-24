var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Gun = (function (_super) {
    __extends(Gun, _super);
    //private fireTimer:egret.Timer;
    function Gun(x, y, angle) {
        var _this = _super.call(this) || this;
        _this.x = x;
        _this.y = y;
        _this.fireAngle = angle;
        return _this;
    }
    Gun.prototype.fire = function () {
        this.dispatchEventWith("createBullet", false, this.fireAngle);
    };
    return Gun;
}(egret.DisplayObjectContainer));
__reflect(Gun.prototype, "Gun");
//# sourceMappingURL=Gun.js.map