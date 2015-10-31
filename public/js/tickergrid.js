///<reference path='ICompany.ts'/>
var Tickergrid;
(function (Tickergrid) {
    var Company = (function () {
        function Company(data) {
            this.name = data.name;
            this.companyName = data.companyName;
            this.price = data.price;
            this.change = data.change;
            this.changePerc = data.changePerc;
            this.mktCap = data.mktCap;
            this.lastTick = data.lastTick;
            this.lastTick = data.lastTickTime;
        }
        return Company;
    })();
    Tickergrid.Company = Company;
})(Tickergrid || (Tickergrid = {}));
///<reference path='ICompany.ts'/>
///<reference path='Company.ts'/>
var Tickergrid;
(function (Tickergrid) {
    var Model = (function () {
        function Model(main) {
            this.main = main;
            this.companies = [];
            this.deltas = [];
            this.gridHeaders = [];
            this.currentDelta = 0;
            this.loadSnapshot();
        }
        Model.prototype.loadSnapshot = function () {
            var _this = this;
            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'csv/snapshot.csv');
            xhr.onload = function () { _this.parseSnapshot(xhr.responseText); };
            xhr.send();
        };
        Model.prototype.parseSnapshot = function (res) {
            var lines = res.split("\n");
            this.gridHeaders = lines[0].split(',');
            for (var i = 1; i < lines.length; i++) {
                var line = lines[i].split(',');
                if (line[0] != '' && line[1] != '') {
                    var data = {
                        name: line[0],
                        companyName: line[1],
                        price: line[2],
                        change: line[3],
                        changePerc: line[4],
                        mktCap: line[5],
                        lastTick: '',
                        lastTickTime: Math.round(+new Date() / 1000)
                    };
                    var company = new Tickergrid.Company(data);
                    this.companies.push(company);
                }
            }
            this.main.grid.renderGrid();
            this.loadDeltas();
        };
        Model.prototype.loadDeltas = function () {
            var _this = this;
            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'csv/deltas.csv');
            xhr.onload = function () { _this.parseDeltas(xhr.responseText); };
            xhr.send();
        };
        Model.prototype.parseDeltas = function (res) {
            this.deltas = res.split("\n");
            var self = this;
            setTimeout(function () {
                self.deltaEngine();
            }, 2000);
        };
        Model.prototype.deltaEngine = function () {
            for (var i = 0; i < this.companies.length; i++) {
                var change = false;
                var lastTick;
                var deltaData = this.deltas[this.currentDelta].split(",");
                var oldPrice = this.companies[i].price;
                var newPrice = deltaData[2];
                if (newPrice != '') {
                    if (newPrice > oldPrice) {
                        change = true;
                        lastTick = 'tickergrid-tickUp';
                    }
                    else {
                        change = true;
                        lastTick = 'tickergrid-tickDown';
                    }
                }
                if (change) {
                    this.companies[i].price = deltaData[2];
                    this.companies[i].change = deltaData[3];
                    this.companies[i].changePerc = deltaData[4];
                    this.companies[i].lastTick = lastTick;
                    this.main.grid.updateCompany(this.companies[i]);
                }
                this.currentDelta++;
            }
            var wait = this.deltas[this.currentDelta];
            if (this.deltas[this.currentDelta + 1] == '') {
                this.currentDelta = 0;
            }
            else {
                this.currentDelta++;
            }
            var self = this;
            setTimeout(function () {
                self.deltaEngine();
            }, wait);
        };
        return Model;
    })();
    Tickergrid.Model = Model;
})(Tickergrid || (Tickergrid = {}));
///<reference path='ICompany.ts'/>
var Tickergrid;
(function (Tickergrid) {
    var Grid = (function () {
        function Grid(main) {
            this.main = main;
        }
        Grid.prototype.renderGrid = function () {
            var _this = this;
            var gridHeaders = this.main.model.gridHeaders;
            var companies = this.main.model.companies;
            var html = '';
            html += '<table class="table table-condensed table-hover" width="590" cellpadding="4">';
            html += '<tr class="tickergrid__grid-header">';
            html += '<th width="10%" align="left">' + gridHeaders[0] + '</th>';
            html += '<th width="30%" align="left">' + gridHeaders[1] + '</th>';
            html += '<th width="15%" align="left">' + gridHeaders[2] + '</th>';
            html += '<th width="15%" align="left">' + gridHeaders[3] + '</th>';
            html += '<th width="15%" align="left">' + gridHeaders[4] + '</th>';
            html += '<th width="15%" align="left">' + gridHeaders[5] + '</th>';
            html += '</tr>';
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
            var tickergrid = document.getElementById("tickergrid__grid");
            tickergrid.innerHTML = html;
            tickergrid.addEventListener("click", function () { return _this.main.chart.switchChart(event['path'][1]['id']); });
            this.main.chart.switchChart(companies[0].name);
        };
        Grid.prototype.createCell = function (width, content) {
            var cell = document.createElement('td');
            cell.setAttribute('width', '10%');
            var cellText = document.createTextNode(content);
            cell.appendChild(cellText);
            return cell;
        };
        Grid.prototype.updateCompany = function (company) {
            var oldRow = document.getElementById(company.name);
            var newRow = document.createElement('tr');
            newRow.setAttribute('id', company.name);
            newRow.setAttribute('class', company.lastTick);
            newRow.appendChild(this.createCell('10%', company.name));
            newRow.appendChild(this.createCell('30%', company.companyName));
            newRow.appendChild(this.createCell('15%', company.price.toString()));
            newRow.appendChild(this.createCell('15%', company.change.toString()));
            newRow.appendChild(this.createCell('15%', company.changePerc.toString()));
            newRow.appendChild(this.createCell('15%', company.mktCap));
            oldRow.parentNode.replaceChild(newRow, oldRow);
        };
        return Grid;
    })();
    Tickergrid.Grid = Grid;
})(Tickergrid || (Tickergrid = {}));
///<reference path='ICompany.ts'/>
var Tickergrid;
(function (Tickergrid) {
    var Chart = (function () {
        function Chart(main) {
            this.main = main;
            this.currentChart = '';
        }
        Chart.prototype.switchChart = function (newCompany) {
            var switchChart = true;
            if (newCompany === '') {
                switchChart = false;
            }
            else if (newCompany === 'tickergrid__grid') {
                switchChart = false;
            }
            else if (newCompany === 'tickergrid') {
                switchChart = false;
            }
            else if (newCompany === this.currentChart) {
                switchChart = false;
            }
            if (switchChart) {
                console.log('Switch Chart to ' + newCompany);
                this.currentChart = newCompany;
            }
        };
        return Chart;
    })();
    Tickergrid.Chart = Chart;
})(Tickergrid || (Tickergrid = {}));
///<reference path='Tickergrid/Model.ts'/>
///<reference path='Tickergrid/Grid.ts'/>
///<reference path='Tickergrid/Chart.ts'/>
var Tickergrid;
(function (Tickergrid) {
    var Model = Tickergrid.Model;
    var Grid = Tickergrid.Grid;
    var Chart = Tickergrid.Chart;
    var Main = (function () {
        function Main() {
            this.model = new Model(this);
            this.grid = new Grid(this);
            this.chart = new Chart(this);
        }
        return Main;
    })();
    Tickergrid.Main = Main;
})(Tickergrid || (Tickergrid = {}));
