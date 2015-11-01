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

            canvas.addEventListener ("click", () => this.dumpData());

        }

        dumpData (){
            var data = this.main.model.getCompanyObject(this.currentChart);
            console.log (data.name);
            for (var i = 0; i < data.history.length; i++) {
                console.log (data.history[i].time + ' '+ data.history[i].price);
                //console.log (data.time + ' ' + data.price);
            }
        }


        renderChart (){

            // Clear the canvas
            var canvas = <HTMLCanvasElement> document.getElementById('tickergrid__chart');
            this.chart.clearRect(0, 0, canvas.width, canvas.height);
            
            // Get Company object for currentChart from model
            var data = this.main.model.getCompanyObject(this.currentChart);

            // Write title to the chart
            this.chart.font = "12px Arial";
            this.chart.fillStyle ='white';
            this.chart.fillText(data.companyName + ' (' + data.name + ')',20,30);

            // Draw with the x & y axis
            this.chart.beginPath();
            this.chart.setLineDash([1, 0]);
            this.chart.strokeStyle = "#ffffff";
            this.chart.moveTo(20, 190);
            this.chart.lineTo(540, 190);
            this.chart.lineTo(540, 40);
            this.chart.lineWidth = 1;
            this.chart.stroke();

            // Draw the dashed mid lines
            this.chart.beginPath();
            this.chart.setLineDash([5, 5]);
            this.chart.lineWidth = 1;
            this.chart.moveTo(20, 115);
            this.chart.lineTo(540, 115);
            this.chart.strokeStyle = "#afafaf";
            this.chart.stroke();
            
            // Find the highest & lowest price and time
            var params = this.getHistoryParams (data.history);

            // The percentge we'll go above and below the max and min prices 
            var percentage = 0.025;

            // Write the price axis numbers
            var topPrice:number = Math.ceil (params.highestPrice + params.highestPrice * percentage); 
            var botPrice:number = Math.floor (params.lowestPrice - params.lowestPrice * percentage);
            var midPrice:number = botPrice + (topPrice - botPrice)/2;

            this.chart.font = "11px Arial";
            this.chart.fillStyle ='white';
            this.chart.fillText(topPrice,550,45);
            this.chart.fillText(botPrice,550,195);
            this.chart.fillText(midPrice,550,120);

            //this.chart.fillText('now',520,210);
            //this.chart.fillText('5secs',40,210);

            // Place points lon the chart
            //data.history.reverse();
            var x:number;
            var y:number;

            var points = data.history;
            //console.log ('Oldest point');
            var point = points[0];
            
            var timeSpan = params.highestTime - params.lowestTime;
            var timeSinceStart = point.time - params.highestTime;
            //console.log ('timeSpan> '+ timeSpan + ' timeSinceStart> '+timeSinceStart);

            if (timeSinceStart == 0){
                x = 540;
            }else{
                
                //x = 520 * timeSinceStart/timeSpan;
            }

            y = 190*(topPrice - point.price)/(topPrice - botPrice);

            this.drawPoint (x,y);
            

            /*
            
            // top 40, bottom 190, diff 150, middle 115
            var x = 540;
            var y = 40 + 150*(topPrice - h[0].price)/(topPrice - botPrice); 
            this.chart.beginPath();
            this.chart.strokeStyle = "#fddb3b";
            this.chart.setLineDash([1, 0]);
            this.chart.lineWidth = 2;
            this.chart.moveTo(x, y);
            for (var i = 0; i < h.length; i++) {
                var x = x-25;

                var y = 190*(topPrice - h[i].price)/(topPrice - botPrice); 
                this.chart.lineTo (x, y);
            }
            
            this.chart.stroke();
            */
        }

        drawPoint (x:number, y:number) {

            // Draws a point at the specified x & y coords
            this.chart.setLineDash([1, 0]);
            this.chart.fillStyle="#397a5d";
            this.chart.fillRect(x-3,y-3,6,6);
            this.chart.strokeStyle = "#fddb3b";
            this.chart.strokeRect(x-3,y-3,6,6);

        }

        getHistoryParams (history) {

            // returns an object containing the highest and lowest values
            // in the array to calibrate the chart
            var params:any = {};
            params.lowestPrice = <number> 100000;
            params.highestPrice = <number> 0;
            params.lowestTime = <number> 2000000000000;
            params.highestTime = <number> 0;
            for (var i = 0; i < history.length; i++) {
                if (parseFloat(history[i].price) < params.lowestPrice){
                   params.lowestPrice = parseFloat(history[i].price);
                }
                if (parseFloat(history[i].price) > params.highestPrice){
                   params.highestPrice = parseFloat(history[i].price);
                }
                if (parseFloat(history[i].time) < params.lowestTime){
                   params.lowestTime = parseFloat(history[i].time);
                }
                if (parseFloat(history[i].time) > params.highestTime){
                   params.highestTime = parseFloat(history[i].time);
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
