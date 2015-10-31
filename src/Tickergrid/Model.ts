///<reference path='ICompany.ts'/>

module Tickergrid
{
	import ICompany = Tickergrid.ICompany;

    export class Model
    {
    	
    	private _main: any;
        public _companies: any;
        public _deltas: any;
        public _headers: any;
        private _currentDelta: number;

        constructor(main)
        {
			this._main = main;
        	this._companies = [];
        	this._deltas = [];
			this._headers = {};
			this._currentDelta = 0;

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

			// Get our table headers
			this._headers = lines[0].split(',');
			
			// Loop through the rest of the lines and create a company Object for each
			for (var i = 1; i < lines.length; i++) {
				var line = lines[i].split(',');
				if (line[0] != '' && line[1] != '') {
					var company: ICompany = {
						name: line[0],
						companyName: line[1],
						price: line[2],
						change: line[3],
						changePerc: line[4],
						mktCap: line[5],
						tick: ''
					}

					// Add the ICompany interfaced object to _companies array 
					this._companies.push(company);
				}
			}

			// Call the View to render the grid
			this._main._view.renderGrid();

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
			this._deltas = res.split("\n");

			// Wait for 2 seconds before kicking off the the delta engine
			var self = this;
			setTimeout(function() {
				self.deltaEngine();
			}, 2000);
	    }


	    deltaEngine (){

			// Loop through the next chunk of delta lines 
			for (var i = 0; i < this._companies.length; i++) {

				// Make sure we haven't run out of deltas
				var change:any = false;
				var deltaData = this._deltas[this._currentDelta].split(",");
				var oldPrice = this._companies[i].price;
				var newPrice = deltaData[2];
				if (newPrice != '') {
					if (newPrice > oldPrice) {
						change = 'tickUp';
					}else{
						change = 'tickDown';
					}
				}

				// Does the delta should update the company object?
				if (change){

					// Update the object in the model
					this._companies[i].price = deltaData[2];
					this._companies[i].change = deltaData[3];
					this._companies[i].changePerc = deltaData[4];
					this._companies[i].tick = change;

					// Propagate the change to the view
					this._main._view.updateCompany(this._companies[i]);
				}

				// Keep track of where we are in the delta list
				this._currentDelta++;
			
			}
				
			// Get the time to wait before next update
			var wait: number = this._deltas[this._currentDelta];

			// Check if we're at the end of file
			if (this._deltas[this._currentDelta+1] == ''){
				// Yep, there's nothing after this
				this._currentDelta = 0;
			}else{
				// Carry on, James
				this._currentDelta++;
			}
			
			// Set the timer to recall the engine
			var self = this;
			setTimeout(function() {
				self.deltaEngine();
			}, wait);

	    }

    }
}
