///<reference path='ICompany.ts'/>

module Tickergrid
{
	import ICompany = Tickergrid.ICompany;

    export class Chart
    {
    	
    	private main: any;
    	public currentChart:string;

        constructor(main)
        {
			this.main = main;
			this.currentChart = '';
			
        }

        switchChart (newCompany:string){

            // Switch the chart to show what was clicked
            var switchChart = true;
            if (newCompany === ''){
                switchChart = false;
            }else if (newCompany === 'tickergrid__grid'){
                switchChart = false;
            }else if (newCompany === 'tickergrid'){
                switchChart = false;
            }else if (newCompany === this.currentChart){
                switchChart = false;
            }
            if (switchChart){
                console.log ('Switch Chart to ' + newCompany);
                this.currentChart = newCompany;
            }

	    }

    }
}
