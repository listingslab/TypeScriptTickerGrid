///<reference path='Tickergrid/Model.ts'/>
///<reference path='Tickergrid/View.ts'/>

module Tickergrid
{
    import Model = Tickergrid.Model;
    import View = Tickergrid.View;

    export class Main
    {

        public _model: Model;
        public _view: View;

        constructor()
        {
            // Init the app by creating our View and Model
            this._view = new View(this);
            this._model = new Model(this);
            
        }

    }
}

