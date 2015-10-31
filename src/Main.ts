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

        constructor()
        {
            // Init the app by creating our Model, Grid and Chart
            this.model = new Model (this);
            this.grid = new Grid (this);
            this.chart = new Chart (this);

        }

    }
}

