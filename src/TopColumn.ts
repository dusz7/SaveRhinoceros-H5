class TopColumn extends egret.DisplayObjectContainer
{
    private topColumn:egret.Bitmap;
    private topColumnRound:egret.Bitmap;
    private topColumnBlood1:egret.Bitmap;
    private topColumnBlood2:egret.Bitmap;
    private topColumnBlood3:egret.Bitmap;
    //private topColumnBlood4:egret.Bitmap;
    private topColumnBullet:egret.Bitmap;
    private topColumnBulletNum:egret.TextField;

    public topColumnBloodNote:egret.Bitmap;

    public constructor()
    {
        super();
        this.topColumn = GameUtil.createBitmapByName("top_column_png");
        this.addChild(this.topColumn);

        this.topColumnRound = GameUtil.createBitmapByName("top_column_round1_png");
        this.topColumnRound.x = 90; this.topColumnRound.y = 30;
        this.addChild(this.topColumnRound);

        this.topColumnBlood1 = GameUtil.createBitmapByName("top_column_blood_png");
        this.topColumnBlood1.x = 770; this.topColumnBlood1.y = 6;
        this.topColumnBlood2 = GameUtil.createBitmapByName("top_column_blood_png");
        this.topColumnBlood2.x = 910; this.topColumnBlood2.y = 6;
        this.topColumnBlood3 = GameUtil.createBitmapByName("top_column_blood_png");
        this.topColumnBlood3.x = 1050; this.topColumnBlood3.y = 6;
        this.addChild(this.topColumnBlood1);
        this.addChild(this.topColumnBlood2);
        this.addChild(this.topColumnBlood3);

        this.topColumnBullet = GameUtil.createBitmapByName("top_column_bullet_png");
        this.topColumnBullet.x = 1485; this.topColumnBullet.y = 21;
        this.topColumnBulletNum = new egret.TextField();
        this.topColumnBulletNum.x = 1620; this.topColumnBulletNum.y = 35;
        this.topColumnBulletNum.size = 100;
        this.topColumnBulletNum.textColor = 0xd5221e;
        this.topColumnBulletNum.text = "0";
        this.addChild(this.topColumnBullet);
        this.addChild(this.topColumnBulletNum);

        this.topColumnBloodNote = GameUtil.createBitmapByName("blood_re1_png");
        this.topColumnBloodNote.x = 1163; this.topColumnBloodNote.y = 44;
    }

    public addBloodNote(action:string)
    {
        var texture:string = "blood_";
        texture += action;
        texture +="_png";

        this.topColumnBloodNote.texture = RES.getRes(texture);
        this.addChild(this.topColumnBloodNote);

        egret.setTimeout(function()
        {
            this.removeChild(this.topColumnBloodNote);
        },this,400);
        
    }
    public removeBloodNote()
    {
        this.removeChild(this.topColumnBloodNote);
    }
    public updateBlood(bloodNow:number)
    {
        this.addChild(this.topColumnBlood1);
        this.addChild(this.topColumnBlood2);
        this.addChild(this.topColumnBlood3);
        if(bloodNow == 2)
        {
            this.removeChild(this.topColumnBlood3);
        }else if(bloodNow == 1)
        {
            this.removeChild(this.topColumnBlood3);
            this.removeChild(this.topColumnBlood2);
        }else if(bloodNow < 1)
        {
            this.removeChild(this.topColumnBlood3);
            this.removeChild(this.topColumnBlood2);
            this.removeChild(this.topColumnBlood1);
        }
    }
    
    public updateBullet(bulletNow:number)
    {
        this.topColumnBulletNum.text = bulletNow.toString();
    }

    public updateRoundNum(roundNow:number)
    {
        var textureName:string = "top_column_round";
        textureName += roundNow;
        textureName += "_png";
        this.topColumnRound.texture = RES.getRes(textureName);
    }
}