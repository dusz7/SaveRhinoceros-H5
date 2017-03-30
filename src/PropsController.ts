
class PropsController extends egret.DisplayObject
{
    private myPropsPointsList:PropsPoint[] = [];
    private createTimer:egret.Timer;
    private createDelay:number;
    private textureName:string;

    public constructor(points:PropsPoint[])
    {
        super();
        this.createDelay = 10000;
        this.textureName = "blood_props_png";
        this.myPropsPointsList = points;
        this.createTimer = new egret.Timer(this.createDelay);
        this.createTimer.addEventListener(egret.TimerEvent.TIMER,this.chooseAPointAndCreate,this);

    }

    public startCreate()
    {
        this.createTimer.start();
    }

    public stopCreate()
    {
        this.createTimer.reset();
    }

    public pauseCreate()
    {
        this.createTimer.stop();
    }

    public resumeCreate()
    {
        this.createTimer.start();
    }

    public chooseAPointAndCreate()
    {
        var pointNo = Math.floor(Math.random()*this.myPropsPointsList.length);
        var thePoint = this.myPropsPointsList[pointNo];
        thePoint.createProps(this.textureName);
    }

  
}