///<reference path='Tickergrid/Model.ts'/>
///<reference path='Tickergrid/Grid.ts'/>
///<reference path='Tickergrid/Chart.ts'/>

module Tickergrid
{
    
    import Model = Tickergrid.Model;
    import Grid = Tickergrid.Grid;
    import Chart = Tickergrid.Chart;

    export class Main
    {

        public model: Model;
        public grid: Grid;
        public chart: Chart;
        public paused:boolean;

        constructor()
        {
            // Init the app by creating our Model, Grid and Chart
            this.model = new Model (this);
            this.grid = new Grid (this);
            this.chart = new Chart (this);
            this.paused = false;

            // add a listener to the pause button
            var btn__pause = document.getElementById("btn__pause");
            btn__pause.addEventListener ("click", () => this.togglePause());
        }

        togglePause (){
            if (!this.paused){
                this.paused = true;
            }else{
                this.paused = false;
                this.model.deltaEngine();
            }
        }

    }
}

