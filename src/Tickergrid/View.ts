///<reference path='ICompany.ts'/>

module Tickergrid
{
    import ICompany = Tickergrid.ICompany;

    export class View
    {
        private _main:any;

        constructor(main)
        {
            this._main = main;
        }

        renderGrid (){

            // Set up our data
            var headers = this._main._model._headers;
            var companies = this._main._model._companies;
            
            // Create an HTML string describing the table we're going to use as our grid
            var html = ''
            html += '<table class="table-bordered">';            
            html += '<tr>';

            // Create Table Heading
            for (var i = 0; i < headers.length; i++) {
                html += '<th>';
                html += headers[i];
                html += '</th>';
            }
            html += '</tr>';

            // Create rows for wach of our companies and reference them with thier 
            // names as IDs so we can update them later
            for (var i = 0; i < companies.length; i++) {
                html += '<tr id="'+companies[i].name+'">';
                html += '<td>' + companies[i].name + '</td>';
                html += '<td>' + companies[i].companyName + '</td>';
                html += '<td>' + companies[i].price + '</td>';
                html += '<td>' + companies[i].change + '</td>';
                html += '<td>' + companies[i].changePerc + '</td>';
                html += '<td>' + companies[i].mktCap + '</td>';
                html += '</tr>';
            }
            html += '</table>';

            // Render the HTML to the tickergrid div in the DOM
            var tickergrid = document.getElementById("tickergrid");
            tickergrid.innerHTML = html;
            
        }

        updateCompany (company:ICompany){
            
            // Takes a company object and creates a new HTML row string
            var row = '';
            row += '<tr id="' + company.name + '">';
            row += '<td>' + company.name + '</td>';
            row += '<td>' + company.companyName + '</td>';
            row += '<td>' + company.price + '</td>';
            row += '<td>' + company.change + '</td>';
            row += '<td>' + company.changePerc + '</td>';
            row += '<td>' + company.mktCap + '</td>';
            row += '</tr>';

            // Update the correct row with the new data
            var tablerow = document.getElementById(company.name);
            tablerow.innerHTML = row;

            // Create the flare by adding a class (see css/style.css)
            tablerow.setAttribute('class', company.tick);
        }
    }
}