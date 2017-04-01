
class TeachingController extends egret.DisplayObjectContainer
{
    private nowStepNo:number;

    private teachingStep:egret.DisplayObjectContainer;
    private background:egret.Bitmap;
    private plant:egret.Bitmap;

    private topColumn:TopColumn;
    private hand_left:egret.Bitmap;
    private hand_right:egret.Bitmap;
    private rhino:Rhinoceros;
    private rhino_right:egret.Bitmap;
    private pointList:egret.Bitmap;
    private pointNow:egret.Bitmap;
    private bullet_normal:egret.Bitmap;
    private bullet_super:egret.Bitmap;
    private bullet_anesthetic:egret.Bitmap;
    private bloodProps:egret.Bitmap;

    private _touchDownX:number;
    private _touchUpX:number;


    public constructor()
    {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
        this.teachingStep = new egret.DisplayObjectContainer();
        this.nowStepNo = 1;
    }

    private onAddToStage()
    {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
        this.startTeaching();
    }

    private startTeaching()
    {
        this.teachingStep.touchEnabled = true;
        this.teachingStep.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.mouseDown, this);
        this.teachingStep.addEventListener(egret.TouchEvent.TOUCH_END, this.mouseUp, this);
        this.addChild(this.teachingStep);

        this.background = GameUtil.createBitmapByName("background_png");
        this.teachingStep.addChild(this.background);
        this.plant = GameUtil.createBitmapByName("plant_png");
        this.teachingStep.addChild(this.plant);

        this.topColumn = new TopColumn();
        this.topColumn.isTeaching = true;
        this.teachingStep.addChild(this.topColumn);

        this.rhino = new Rhinoceros("rhino_l_png");
        this.rhino.isTeaching = true;
        this.rhino_right = GameUtil.createBitmapByName("rhino_r_png");
        
        this.hand_left = GameUtil.createBitmapByName("hand_left_png");
        this.hand_right = GameUtil.createBitmapByName("hand_right_png");

        this.bullet_normal = GameUtil.createBitmapByName("bullet_normal_png");
        this.bullet_super = GameUtil.createBitmapByName("bullet_super_png");
        this.bullet_anesthetic = GameUtil.createBitmapByName("bullet_anesthetic_png");

        this.pointList = GameUtil.createBitmapByName("point_list_png");
        this.pointList.x = 736;
        this.pointList.y = 1028;
        this.teachingStep.addChild(this.pointList);
        this.pointNow = GameUtil.createBitmapByName("point_now_png");
        this.teachingStep.addChild(this.pointNow);

        this.bloodProps = GameUtil.createBitmapByName("blood_props_png");
        this.bloodProps.x = 300; this.bloodProps.y = 300;

        this.showStep(1);

    }

    

    private showStep(stepNo:number)
    {
        this.clearTeachingStep();
        this.pointNow.y = 1033;
        if(stepNo == 1)
        {
            this.topColumn.updateRoundNum(1);
            this.topColumn.isTeaching = true;

            this.rhino.x = 576; this.rhino.y = 402;
            this.rhino_right.x = 1111; this.rhino_right.y = 402;
            this.teachingStep.addChild(this.rhino);
            this.teachingStep.addChild(this.rhino_right);

            this.hand_left.x = 737; this.hand_left.y = 568;
            this.hand_right.x = 1000; this.hand_right.y = 570;
            this.teachingStep.addChild(this.hand_left);
            this.teachingStep.addChild(this.hand_right);

            this.bullet_normal.rotation = -55;
            this.bullet_normal.x = 415; this.bullet_normal.y = 880;
            this.teachingStep.addChild(this.bullet_normal);

            this.pointNow.x = 740;
        }
        else if(stepNo == 2)
        {
            this.topColumn.updateRoundNum(1);
            this.topColumn.addBloodNote("re1");
            this.topColumn.updateBlood(2);

            this.rhino.x = 576; this.rhino.y = 402;
            this.teachingStep.addChild(this.rhino);
            this.rhino.getHurt(1,75,245);

            this.bullet_normal.rotation = -55;
            this.bullet_normal.x = 490; this.bullet_normal.y = 810;
            this.teachingStep.addChild(this.bullet_normal);

            this.pointNow.x = 854;
        }else if(stepNo == 3)
        {
            this.topColumn.updateRoundNum(2);
            this.topColumn.addBloodNote("re2");
            this.topColumn.updateBlood(1);
            this.topColumn.updateBullet(20);

            this.rhino.x = 605; this.rhino.y = 402;
            this.teachingStep.addChild(this.rhino);
            this.rhino.getHurt(2,300,255);

            this.bullet_super.rotation = -130;
            this.bullet_super.x = 1050; this.bullet_super.y = 860;
            this.teachingStep.addChild(this.bullet_super);

            this.pointNow.x = 968;
        }else if(stepNo == 4)
        {
            this.topColumn.updateRoundNum(3);
            this.topColumn.updateBullet(82);
            this.topColumn.updateBlood(2);

            this.rhino.x = 750; this.rhino.y = 402;
            this.teachingStep.addChild(this.rhino);
            this.rhino.getHurt(0,290,150);

            this.bullet_anesthetic.rotation = 135;
            this.bullet_anesthetic.x = 1270; this.bullet_anesthetic.y = 390;
            this.teachingStep.addChild(this.bullet_anesthetic);

            this.pointNow.x = 1082;
        }else if(stepNo == 5)
        {
            this.topColumn.updateRoundNum(3);
            this.topColumn.updateBullet(90);
            this.topColumn.addBloodNote("de1");
            this.topColumn.updateBlood(3);

            this.teachingStep.addChild(this.bloodProps);

            this.rhino.x = 400; this.rhino.y = 300;
            this.teachingStep.addChild(this.rhino);

            this.pointNow.x = 1196;
        }
    }


    private clearTeachingStep()
    {
        this.clearTeachingItem(this.rhino);
        this.clearTeachingItem(this.rhino_right);
        this.clearTeachingItem(this.hand_left);
        this.clearTeachingItem(this.hand_right);
        this.clearTeachingItem(this.bullet_normal);
        this.clearTeachingItem(this.bullet_super);
        this.clearTeachingItem(this.bullet_anesthetic);
        this.clearTeachingItem(this.bloodProps);
        this.rhino.removeHitPerformance();
        this.rhino.bloodNum = 3;
        this.topColumn.removeBloodNote();
        this.topColumn.updateBlood(3);
        this.topColumn.updateBullet(0);

    }

    private clearTeachingItem(item:egret.DisplayObject)
    {
        if(this.teachingStep.getChildIndex(item) != -1)
        {
            this.teachingStep.removeChild(item);
        }
    }

    private endTeaching()
    {
        this.removeChild(this.teachingStep);
        this.dispatchEventWith("endTeaching",false);
    }

    private mouseDown(evt:egret.TouchEvent)
    {
        this._touchDownX = evt.stageX;
        //this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.objectMove, this);
        
    }

    private mouseUp(evt:egret.TouchEvent)
    {
        this._touchUpX = evt.stageX;
        
        var moveDistance = this._touchUpX - this._touchDownX;
        this._touchDownX  = 0;
        this._touchUpX = this.stage.stageWidth;

        if(moveDistance < -(0.1*this.stage.$stageWidth)){
            if(this.nowStepNo < 5)
            {
                this.nowStepNo ++;
                this.showStep(this.nowStepNo);
            }else if(this.nowStepNo == 5){
                this.endTeaching();
            }   
        }
        
        else if(moveDistance > (0.1*this.stage.$stageWidth)){
            if(this.nowStepNo > 1)
            {
                this.nowStepNo --;
                this.showStep(this.nowStepNo);
            }
        }
    }
}