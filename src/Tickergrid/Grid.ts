///<reference path='ICompany.ts'/>

module Tickergrid
{
    import ICompany = Tickergrid.ICompany;

    export class Grid
    {
        private main:any;

        constructor(main)
        {
            this.main = main;
        }

        renderGrid (){

            // Set up our data
            var gridHeaders = this.main.model.gridHeaders;
            var companies = this.main.model.companies;
            
            // Create an HTML string describing the table we're going to use as our grid
            var html = ''
            html += '<table class="table table-condensed table-hover" width="590" cellpadding="4">';

            // Create Table Heading         
            html += '<tr class="tickergrid__grid-header">';
            html += '<th width="10%" align="left">'+gridHeaders[0]+'</th>';
            html += '<th width="30%" align="left">'+gridHeaders[1]+'</th>';
            html += '<th width="15%" align="left">'+gridHeaders[2]+'</th>';
            html += '<th width="15%" align="left">'+gridHeaders[3]+'</th>';
            html += '<th width="15%" align="left">'+gridHeaders[4]+'</th>';
            html += '<th width="15%" align="left">'+gridHeaders[5]+'</th>';
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
            var tickergrid = document.getElementById("tickergrid__grid");
            tickergrid.innerHTML = html;

            // add listeners
            tickergrid.addEventListener ("click", () => this.main.chart.switchChart (event['path'][1]['id']));


            // Set the current chart to the first company on the list
            this.main.chart.switchChart (companies[0].name);

        }

        createCell (width:string, content:string){

            // Creates a table cell Element
            var cell = document.createElement('td');
            cell.setAttribute('width', '10%');
            var cellText = document.createTextNode(content);
            cell.appendChild (cellText);
            return cell;
        }

        updateCompany (company:ICompany){
            
            // Takes a company object and creates a new HTML row element
            // and replaces the old one, adding the animation class
            var oldRow = document.getElementById(company.name);
            var newRow = document.createElement('tr');
            newRow.setAttribute ('id', company.name);
            newRow.setAttribute('class', company.lastTick);
            newRow.appendChild (this.createCell ('10%', company.name));
            newRow.appendChild (this.createCell ('30%', company.companyName));
            newRow.appendChild (this.createCell ('15%', company.price.toString()));
            newRow.appendChild (this.createCell ('15%', company.change.toString()));
            newRow.appendChild (this.createCell ('15%', company.changePerc.toString()));
            newRow.appendChild (this.createCell ('15%', company.mktCap));

            // This is the only interaction with the DOM needed per update            
            oldRow.parentNode.replaceChild(newRow, oldRow);
        }
    }
}