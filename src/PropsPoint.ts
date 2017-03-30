class PropsPoint extends egret.DisplayObjectContainer{
    
    //private propsTexture:string;

    public constructor(x:number,y:number){
        super();
        this.x = x;
        this.y = y;
    }

    public createProps(propsTexture:string):void{
        //this.propsTexture = propsTexture;
        
        this.dispatchEventWith("createProps",false,propsTexture);
    }
}