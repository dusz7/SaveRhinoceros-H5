var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PropsController = (function (_super) {
    __extends(PropsController, _super);
    function PropsController(points) {
        var _this = _super.call(this) || this;
        _this.myPropsPointsList = [];
        _this.createDelay = 10000;
        _this.textureName = "blood_props_png";
        _this.myPropsPointsList = points;
        _this.createTimer = new egret.Timer(_this.createDelay);
        _this.createTimer.addEventListener(egret.TimerEvent.TIMER, _this.chooseAPointAndCreate, _this);
        return _this;
    }
    PropsController.prototype.startCreate = function () {
        this.createTimer.start();
    };
    PropsController.prototype.stopCreate = function () {
        this.createTimer.reset();
    };
    PropsController.prototype.pauseCreate = function () {
        this.createTimer.stop();
    };
    PropsController.prototype.resumeCreate = function () {
        this.createTimer.start();
    };
    PropsController.prototype.chooseAPointAndCreate = function () {
        var pointNo = Math.floor(Math.random() * this.myPropsPointsList.length);
        var thePoint = this.myPropsPointsList[pointNo];
        thePoint.createProps(this.textureName);
    };
    return PropsController;
}(egret.DisplayObject));
__reflect(PropsController.prototype, "PropsController");
//# sourceMappingURL=PropsController.js.map