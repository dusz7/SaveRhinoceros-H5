var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PropsPoint = (function (_super) {
    __extends(PropsPoint, _super);
    //private propsTexture:string;
    function PropsPoint(x, y) {
        var _this = _super.call(this) || this;
        _this.x = x;
        _this.y = y;
        return _this;
    }
    PropsPoint.prototype.createProps = function (propsTexture) {
        //this.propsTexture = propsTexture;
        this.dispatchEventWith("createProps", false, propsTexture);
    };
    return PropsPoint;
}(egret.DisplayObjectContainer));
__reflect(PropsPoint.prototype, "PropsPoint");
//# sourceMappingURL=PropsPoint.js.map