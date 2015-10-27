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
            html += '<table class="table table-condensed table-hover">';            
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
                html += '<tr id="' + companies[i].name + '">';
                html += '<td width="10%">' + companies[i].name + '</td>';
                html += '<td width="30%">' + companies[i].companyName + '</td>';
                html += '<td width="15%">' + companies[i].price + '</td>';
                html += '<td width="15%">' + companies[i].change + '</td>';
                html += '<td width="15%">' + companies[i].changePerc + '</td>';
                html += '<td width="15%">' + companies[i].mktCap + '</td>';
                html += '</tr>';
            }
            html += '</table>';

            // Render the HTML to the tickergrid div in the DOM
            var tickergrid = document.getElementById("tickergrid");
            tickergrid.innerHTML = html;
            
        }

        updateCompany (company:ICompany){
            
            // Takes a company object and creates a new HTML row element
            // and replaces the old one, adding the animation class

            var oldRow = document.getElementById(company.name);

            var newRow = document.createElement('tr');
            newRow.setAttribute ('id', company.name);
            newRow.setAttribute('class', company.tick);

            var td = document.createElement('td');
            td.setAttribute('width', '10%');
            newRow.appendChild (td);
            var txt = document.createTextNode(company.name);
            td.appendChild (txt);

            td = document.createElement('td');
            td.setAttribute('width', '30%');
            newRow.appendChild (td);
            txt = document.createTextNode(company.companyName);
            td.appendChild (txt);

            td = document.createElement('td');
            td.setAttribute('width', '15%');
            newRow.appendChild (td);
            txt = document.createTextNode(company.price.toString());
            td.appendChild (txt);

            td = document.createElement('td');
            td.setAttribute('width', '15%');
            newRow.appendChild (td);
            txt = document.createTextNode(company.change.toString());
            td.appendChild (txt);

            td = document.createElement('td');
            td.setAttribute('width', '15%');
            newRow.appendChild (td);
            txt = document.createTextNode(company.changePerc.toString());
            td.appendChild (txt);

            td = document.createElement('td');
            td.setAttribute('width', '15%');
            newRow.appendChild (td);
            txt = document.createTextNode(company.mktCap);
            td.appendChild (txt);
            
            var replacedNode = oldRow.parentNode.replaceChild(newRow, oldRow);
                
        }
    }
}