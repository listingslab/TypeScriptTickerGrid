///<reference path='ICompany.ts'/>

module Tickergrid
{
	import ICompany = Tickergrid.ICompany;

    export class Company
    {
    	public name:string
    	public companyName:string
    	public price: number;
        public change: number;
		public changePerc: number;
		public mktCap: string;
        public lastTick: string;
        public lastTickTime: number;

    	constructor(data)
        {
            this.name = data.name;
	    	this.companyName = data.companyName;
	    	this.price = data.price ;
	        this.change = data.change;
			this.changePerc = data.changePerc;
			this.mktCap = data.mktCap;
	        this.lastTick = data.lastTick;
            this.lastTick = data.lastTickTime;
        }

        

    }

}
