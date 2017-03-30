var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BloodProps = (function (_super) {
    __extends(BloodProps, _super);
    function BloodProps(texture) {
        var _this = _super.call(this, texture) || this;
        _this.anchorOffsetX = _this.width / 2;
        _this.anchorOffsetY = _this.height / 2;
        return _this;
    }
    return BloodProps;
}(egret.Bitmap));
__reflect(BloodProps.prototype, "BloodProps");
//# sourceMappingURL=BloodProps.js.map