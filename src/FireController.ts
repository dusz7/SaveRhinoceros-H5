
class FireController
{
    private myGunsList:Gun[] = [];
    private fireTimer:egret.Timer;
    private nowFireDelay:number;
    private nowBulletSpeedTime:number;
    private nowRepeatNum:number = 5;
    private endGame:number = 0;

    public constructor(guns:Gun[])
    {
        this.myGunsList = guns;
        this.fireTimer = new egret.Timer(this.nowFireDelay);
        this.fireTimer.repeatCount = this.nowRepeatNum;
        this.fireTimer.addEventListener(egret.TimerEvent.TIMER,this.chooseAGunAndFire,this)
        this.fireTimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE,this.updateSpeedAndDelay,this);
        this.endGame = 0;
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
    }

    public chooseAGunAndFire()
    {
        var gunNum = Math.floor(Math.random()*this.myGunsList.length);
        //console.log("now the fire gun is : "+gunNum);
        var theGun:Gun = this.myGunsList[gunNum];
        theGun.fire(this.nowBulletSpeedTime);
        if(this.endGame >= 4)
        {
            var gunNum2 = Math.floor(Math.random()*this.myGunsList.length);
            var theGun2:Gun = this.myGunsList[gunNum2];
            theGun2.fire(this.nowBulletSpeedTime);
        }
        if(this.endGame >= 8)
        {
            var gunNum3 = Math.floor(Math.random()*this.myGunsList.length);
            var theGun3:Gun = this.myGunsList[gunNum3];
            theGun3.fire(this.nowBulletSpeedTime);
        }
        if(this.endGame >= 12)
        {
            var gunNum4 = Math.floor(Math.random()*this.myGunsList.length);
            var theGun4:Gun = this.myGunsList[gunNum4];
            theGun4.fire(this.nowBulletSpeedTime);
        }
        if(this.endGame >= 17)
        {
            var gunNum5 = Math.floor(Math.random()*this.myGunsList.length);
            var theGun5:Gun = this.myGunsList[gunNum5];
            theGun5.fire(this.nowBulletSpeedTime);
        }
    }

    public updateSpeedAndDelay()
    {
        this.endGame ++;
        if(this.nowFireDelay > 800){
            this.nowFireDelay -= 250; 
            this.fireTimer.delay = this.nowFireDelay;
            this.nowBulletSpeedTime -= 180;
        }
        console.log(this.fireTimer.delay+",,,"+this.nowBulletSpeedTime);
        this.fireTimer.reset();
        this.fireTimer.start();
    }
}