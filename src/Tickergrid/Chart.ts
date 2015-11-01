///<reference path='ICompany.ts'/>

module Tickergrid
{
	import ICompany = Tickergrid.ICompany;

    export class Chart
    {
    	
    	private main: any;
    	public currentChart:string;
        public chart: any;

        constructor(main)
        {
			this.main = main;
			this.currentChart = '';

            // Set a reference to the canvas
            var canvas = <HTMLCanvasElement> document.getElementById('tickergrid__chart');
            this.chart = canvas.getContext('2d');

        }


        renderChart (){

            //console.log ('rendering');

            // Clear the canvas
            var canvas = <HTMLCanvasElement> document.getElementById('tickergrid__chart');
            this.chart.clearRect(0, 0, canvas.width, canvas.height);
            
            // Get Company object for currentChart
            var data = this.main.model.getCompanyObject(this.currentChart);

            // Write title to the chart
            this.chart.font = "12px Arial";
            this.chart.fillStyle ='white';
            this.chart.fillText(data.companyName + ' (' + data.name + ')',20,30);

            // Draw with the x & y axis
            this.chart.beginPath();
            this.chart.setLineDash([1, 0]);
            this.chart.strokeStyle = "#ffffff";
            this.chart.moveTo(40, 190);
            this.chart.lineTo(540, 190);
            this.chart.lineTo(540, 40);
            this.chart.stroke();

            // Draw the dashed mid line
            this.chart.beginPath();
            this.chart.setLineDash([5, 5]);
            this.chart.lineWidth = 1;
            this.chart.moveTo(40, 115);
            this.chart.lineTo(540, 115);
            this.chart.strokeStyle = "#afafaf";
            this.chart.stroke();

            // Chart the Company Object's history array
            
            for (var i = 0; i < data.history.length; i++) {
                //console.log (data.history[i]);
            }
            //console.log ('______________');

        }        



        renderChart_old (){
            

            var chartTitle = {name:'GOOG', companyName:'Google Inc'};
            var chartData =[
                {price:658.89, time:1446335973},
                {price:659.24, time:1446336000},
            ];

            // Render the chart to the canvas
            // Start with the title

            // find lowest and highest value of the price in the array

            var params = this.getHistoryParams (chartData);
            //console.log ('highestPrice: ' + params.highestPrice);
            //console.log ('lowestPrice: ' + params.lowestPrice);

            var percentage = 0.25;

            // add 2% to the highest price value. This is the top of the chart
            var topPrice = Math.floor (params.highestPrice + (percentage/100) * params.highestPrice);
            this.chart.font = "11px Arial";
            this.chart.fillStyle ='white';
            this.chart.fillText(topPrice,550,45);

            var bottomPrice = Math.floor (params.lowestPrice - (percentage/100) * params.lowestPrice);
            this.chart.font = "11px Arial";
            this.chart.fillStyle ='white';
            this.chart.fillText(bottomPrice,550,195);

            var midPrice = bottomPrice + ((topPrice - bottomPrice)/2);
            this.chart.font = "11px Arial";
            this.chart.fillStyle ='white';
            this.chart.fillText(midPrice,550,120);



            // Draw the actual line
            this.chart.beginPath();
            this.chart.setLineDash([1, 0]);
            this.chart.lineWidth = 3;
            this.chart.strokeStyle = "#fddb3b";

            
            // place latest point on y axis
            chartData.reverse();
            
            // top 40, bottom 190, diff 150, middle 115
            var x = 540;
            var y = 40 + 150*(topPrice - chartData[0].price)/(topPrice - bottomPrice); 

            this.chart.moveTo(x, y);
            for (var i = 0; i < chartData.length; i++) {
                var x = x-20;
                var y = 40 + 150*(topPrice - chartData[i].price)/(topPrice - bottomPrice); 
                this.chart.lineTo (x, y);
            }

            //this.chart.lineTo (0, 0);
            this.chart.stroke();
        }

        getHistoryParams (history) {

            var params:any = {};
            params.lowestPrice = 2000000000;
            params.highestPrice = 0;
            params.lowestTime = 2000000000;
            params.highestTime = 0;

            for (var i = 0; i < history.length; i++) {
                if (history[i].price < params.lowestPrice){
                   params.lowestPrice = history[i].price;
                }
                if (history[i].price > params.highestPrice){
                   params.highestPrice = history[i].price;
                }
                if (history[i].time < params.lowestTime){
                   params.lowestTime = history[i].time;
                }
                if (history[i].time > params.highestTime){
                   params.highestTime = history[i].time;
                }

            }
            return params;
        }

        switchChart (newCompany:string){

            // Switch the chart to show what the clicked company
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
                //console.log ('Switch Chart to ' + newCompany);
                this.currentChart = newCompany;
            }

            // Make the chart
            this.renderChart ();

	    }

    }
}
