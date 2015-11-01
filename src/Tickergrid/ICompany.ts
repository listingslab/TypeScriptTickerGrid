module Tickergrid
{
	// Company Interface
    export interface ICompany
    {
        name: string;
        companyName: string;
        price: number;
        change: number;
		changePerc: number;
		mktCap: string;
        lastTick: string;
        lastTickTime: number;
        history: any;
    }
}
