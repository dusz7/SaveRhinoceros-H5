
class FireController extends egret.DisplayObject
{
    private myGunsList:Gun[] = [];
    private fireTimer:egret.Timer;
    private nowFireDelay:number;
    private nowBulletSpeedTime:number;
    private nowBulletRepeatNum:number = 5;
    private nowStepRepeatNum:number = 0;

    private round2StepNum:number = 4;
    private round3StepNum:number = 16;

    private lastRadom:number;

    public constructor(guns:Gun[])
    {
        super();
        this.myGunsList = guns;
        this.fireTimer = new egret.Timer(this.nowFireDelay);
        this.fireTimer.repeatCount = this.nowBulletRepeatNum;
        this.fireTimer.addEventListener(egret.TimerEvent.TIMER,this.chooseAGunAndFire,this);
        this.fireTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE,this.updateSpeedAndDelay,this);
        this.nowStepRepeatNum = 0;

        this.lastRadom = guns.length;
    }

    public startFire(delay:number,speed:number)
    {
        this.nowFireDelay = delay;
        this.nowBulletSpeedTime = speed;
        this.fireTimer.delay = this.nowFireDelay;
        this.fireTimer.start();
    }

    public stopFire()
    {
        this.fireTimer.reset();
        this.nowStepRepeatNum = 0;
    }

    public pauseFire()
    {
        this.fireTimer.stop();
    }

    public resumeFire()
    {
        this.fireTimer.start();
    }

    public chooseAGunAndFire()
    {
        //什么时候都会开一枪
        this.randomGun("normal");

        if(this.nowStepRepeatNum >= this.round2StepNum && this.fireTimer.currentCount%2 == 0)
        {
            this.randomGun("super");
        }
        if(this.nowStepRepeatNum >= this.round3StepNum && this.fireTimer.currentCount%3 == 0)
        {
            this.randomGun("anesthetic");
        }
        if(this.nowStepRepeatNum >= this.round3StepNum+5 && this.fireTimer.currentCount%3 == 0)
        {
            this.randomGun("normal");
        }
    }


    public updateSpeedAndDelay()
    {
        this.nowStepRepeatNum ++;
        if(this.nowFireDelay > 1000){
            this.nowFireDelay -= 205; 
            this.fireTimer.delay = this.nowFireDelay;
            this.nowBulletSpeedTime -= 160;
        }
        //console.log(this.fireTimer.delay+",,,"+this.nowBulletSpeedTime);
        this.fireTimer.reset();
        if(this.nowStepRepeatNum == this.round2StepNum){
            egret.setTimeout(function(){
                this.dispatchEventWith("updateRound",false,2);
            },this,this.nowBulletSpeedTime);
        }else if(this.nowStepRepeatNum == this.round3StepNum){
            egret.setTimeout(function(){
                this.dispatchEventWith("updateRound",false,3);
            },this,this.nowBulletSpeedTime);
        }else {
            this.fireTimer.start();
        }
        
    }

    /**
     * 随机选数，开枪
     */
    public randomGun(type:string)
    {
        var textureName:string; var damageNum:number;
        if(type == "normal")
        {
            textureName = "bullet_normal_png";
            damageNum = 1;
        }else if(type == "super")
        {
            textureName = "bullet_super_png";
            damageNum = 2;
        }else if(type == "anesthetic")
        {
            textureName = "bullet_anesthetic_png";
            damageNum = 0;
        }

        var gunNo = Math.floor(Math.random()*this.myGunsList.length);
        while(gunNo == this.lastRadom)
        {
            gunNo = Math.floor(Math.random()*this.myGunsList.length);
        }
        this.lastRadom = gunNo;
        var theGun = this.myGunsList[gunNo];
        theGun.fire(textureName,damageNum,this.nowBulletSpeedTime);
    }
}