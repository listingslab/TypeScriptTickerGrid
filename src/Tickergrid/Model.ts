///<reference path='ICompany.ts'/>
///<reference path='Company.ts'/>

module Tickergrid
{
	import ICompany = Tickergrid.ICompany;

    export class Model
    {
    	
    	private main: any;
        public companies: any;
        public deltas: any;
        public gridHeaders: Array<number>;
        private currentDelta: number;

        constructor(main)
        {
			this.main = main;
        	this.companies = [];
        	this.deltas = [];
			this.gridHeaders = [];
			this.currentDelta = 0;

			// Initialise the model by loading the snapshot data
			this.loadSnapshot();
        }

        loadSnapshot() {

        	// Loads the snapshot data via XMLHttpRequest.
        	// Requires http protocol in Chrome and some other browsers
	        var xhr = new XMLHttpRequest();
	        xhr.open('GET', 'csv/snapshot.csv');
	        xhr.onload = () => { this.parseSnapshot(xhr.responseText) };
	        xhr.send(); 
	    }

		parseSnapshot(res) {

			// Split the loaded cvs into lines array on line breaks
			var lines = res.split("\n");

			// Get our table gridHeaders
			this.gridHeaders = lines[0].split(',');
			
			// Loop through the rest of the lines and create a company Object for each
			for (var i = 1; i < lines.length; i++) {
				var line = lines[i].split(',');
				var time = Math.round(+new Date());
				if (line[0] != '' && line[1] != '') {
					var data = {
						name: line[0],
						companyName: line[1],
						price: line[2],
						change: line[3],
						changePerc: line[4],
						mktCap: line[5],
						lastTick: '',
						lastTickTime: time,
						history: [{price:line[2], time:time}]
					}
					var company:ICompany = new Company (data);

					// Add the ICompany interfaced object to companies array 
					this.companies.push(company);
				}
			}

			// Call the View to render the grid
			this.main.grid.renderGrid();

			// Load Deltas csv
			this.loadDeltas();
		}

	    loadDeltas() {

	    	// Loads the deltas data via XMLHttpRequest.
        	// Requires http protocol in Chrome and some other browsers
	        var xhr = new XMLHttpRequest();
	        xhr.open('GET', 'csv/deltas.csv');
	        xhr.onload = () => { this.parseDeltas (xhr.responseText) };
	        xhr.send();
	    }

		parseDeltas(res) {

			// Add the deltas to our array 
			this.deltas = res.split("\n");

			// Wait for 1 seconds before kicking off the the delta engine
			var self = this;
			setTimeout(function() {
				self.deltaEngine();
			}, 1000);
	    }


	    deltaEngine (){
	    	
			// Loop through the next chunk of delta lines 
			for (var i = 0; i < this.companies.length; i++) {

				// Make sure we haven't run out of deltas
				var change:boolean = false;
				var lastTick:string;
				var lastTickTime:number = Math.round(+new Date());
				var deltaData = this.deltas[this.currentDelta].split(",");
				var oldPrice = this.companies[i].price;
				var newPrice = deltaData[2];
				if (newPrice != '') {
					if (newPrice > oldPrice) {
						change = true;
						lastTick = 'tickergrid-tickUp';
					}else{
						change = true;
						lastTick = 'tickergrid-tickDown';
					}
				}



				// Does the delta should update the company object?
				if (change){

					// Update the object in the model
					this.companies[i].price = deltaData[2];
					this.companies[i].change = deltaData[3];
					this.companies[i].changePerc = deltaData[4];
					this.companies[i].lastTick = lastTick;
					this.companies[i].lastTickTime = lastTickTime;

					// Propagate the change to the grid
					this.main.grid.tickCompanyRow(this.companies[i]);


				}

				// Update the company Object's history
				var tickHistory = {price:this.companies[i].price,time:lastTickTime};
				this.companies[i].updateHistory(tickHistory);

				// Keep track of where we are in the delta list
				this.currentDelta++;
			
			}

			// Update the company Object's history
			this.main.chart.renderChart();
				
			// Get the time to wait before next update
			var wait: number = this.deltas[this.currentDelta];

			// Check if we're at the end of file
			if (this.deltas[this.currentDelta+1] == ''){
				// Yep, there's nothing after this
				this.currentDelta = 0;
			}else{
				// Carry on, James
				this.currentDelta++;
			}
			
			// Set the timer to recall the engine if the app isn't paused
			var self = this;
			setTimeout(function() {
				self.deltaEngine();
			}, wait);

			
	    }


	    getCompanyObject(name:string) {

	    	// Loop through company objects and return the requested one
			for (var i = 0; i < this.companies.length; i++) {
				if (this.companies[i].name == name){
					return this.companies[i];
					break;
				}
			}
        	
	    }

    }
}
