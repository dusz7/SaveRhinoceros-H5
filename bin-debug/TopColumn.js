var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TopColumn = (function (_super) {
    __extends(TopColumn, _super);
    function TopColumn() {
        var _this = _super.call(this) || this;
        _this.topColumn = GameUtil.createBitmapByName("top_column_png");
        _this.addChild(_this.topColumn);
        _this.topColumnRound = GameUtil.createBitmapByName("top_column_round1_png");
        _this.topColumnRound.x = 90;
        _this.topColumnRound.y = 30;
        _this.addChild(_this.topColumnRound);
        _this.topColumnBlood1 = GameUtil.createBitmapByName("top_column_blood_png");
        _this.topColumnBlood1.x = 770;
        _this.topColumnBlood1.y = 6;
        _this.topColumnBlood2 = GameUtil.createBitmapByName("top_column_blood_png");
        _this.topColumnBlood2.x = 910;
        _this.topColumnBlood2.y = 6;
        _this.topColumnBlood3 = GameUtil.createBitmapByName("top_column_blood_png");
        _this.topColumnBlood3.x = 1050;
        _this.topColumnBlood3.y = 6;
        _this.addChild(_this.topColumnBlood1);
        _this.addChild(_this.topColumnBlood2);
        _this.addChild(_this.topColumnBlood3);
        _this.topColumnBullet = GameUtil.createBitmapByName("top_column_bullet_png");
        _this.topColumnBullet.x = 1485;
        _this.topColumnBullet.y = 21;
        _this.topColumnBulletNum = new egret.TextField();
        _this.topColumnBulletNum.x = 1620;
        _this.topColumnBulletNum.y = 35;
        _this.topColumnBulletNum.size = 100;
        _this.topColumnBulletNum.textColor = 0xd5221e;
        _this.topColumnBulletNum.text = "0";
        _this.addChild(_this.topColumnBullet);
        _this.addChild(_this.topColumnBulletNum);
        _this.topColumnBloodNote = GameUtil.createBitmapByName("blood_re1_png");
        _this.topColumnBloodNote.x = 1163;
        _this.topColumnBloodNote.y = 44;
        return _this;
    }
    TopColumn.prototype.addBloodNote = function (action) {
        var texture = "blood_";
        texture += action;
        texture += "_png";
        this.topColumnBloodNote.texture = RES.getRes(texture);
        this.addChild(this.topColumnBloodNote);
        egret.setTimeout(function () {
            this.removeChild(this.topColumnBloodNote);
        }, this, 400);
    };
    TopColumn.prototype.removeBloodNote = function () {
        this.removeChild(this.topColumnBloodNote);
    };
    TopColumn.prototype.updateBlood = function (bloodNow) {
        this.addChild(this.topColumnBlood1);
        this.addChild(this.topColumnBlood2);
        this.addChild(this.topColumnBlood3);
        if (bloodNow == 2) {
            this.removeChild(this.topColumnBlood3);
        }
        else if (bloodNow == 1) {
            this.removeChild(this.topColumnBlood3);
            this.removeChild(this.topColumnBlood2);
        }
        else if (bloodNow < 1) {
            this.removeChild(this.topColumnBlood3);
            this.removeChild(this.topColumnBlood2);
            this.removeChild(this.topColumnBlood1);
        }
    };
    TopColumn.prototype.updateBullet = function (bulletNow) {
        this.topColumnBulletNum.text = bulletNow.toString();
    };
    TopColumn.prototype.updateRoundNum = function (roundNow) {
        var textureName = "top_column_round";
        textureName += roundNow;
        textureName += "_png";
        this.topColumnRound.texture = RES.getRes(textureName);
    };
    return TopColumn;
}(egret.DisplayObjectContainer));
__reflect(TopColumn.prototype, "TopColumn");
//# sourceMappingURL=TopColumn.js.map