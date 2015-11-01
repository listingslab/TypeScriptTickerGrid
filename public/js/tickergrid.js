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
            this.history = data.history;
            var tickHistory = { price: this.price, time: this.lastTick };
            this.history.push(tickHistory);
        }
        Company.prototype.updateHistory = function (tickHistory) {
            var maxHistory = 10;
            this.history.push(tickHistory);
            if (this.history.length > maxHistory) {
                this.history.shift();
            }
        };
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
                        history: [{ price: line[2], time: time }]
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
            }, 1000);
        };
        Model.prototype.deltaEngine = function () {
            for (var i = 0; i < this.companies.length; i++) {
                var change = false;
                var lastTick;
                var lastTickTime = Math.round(+new Date());
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
                    this.companies[i].lastTickTime = lastTickTime;
                    this.main.grid.tickCompanyRow(this.companies[i]);
                }
                var tickHistory = { price: this.companies[i].price, time: lastTickTime };
                this.companies[i].updateHistory(tickHistory);
                this.currentDelta++;
            }
            this.main.chart.renderChart();
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
        Model.prototype.getCompanyObject = function (name) {
            for (var i = 0; i < this.companies.length; i++) {
                if (this.companies[i].name == name) {
                    return this.companies[i];
                    break;
                }
            }
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
        Grid.prototype.tickCompanyRow = function (company) {
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
            var canvas = document.getElementById('tickergrid__chart');
            this.chart = canvas.getContext('2d');
        }
        Chart.prototype.renderChart = function () {
            var canvas = document.getElementById('tickergrid__chart');
            this.chart.clearRect(0, 0, canvas.width, canvas.height);
            var data = this.main.model.getCompanyObject(this.currentChart);
            this.chart.font = "12px Arial";
            this.chart.fillStyle = 'white';
            this.chart.fillText(data.companyName + ' (' + data.name + ')', 20, 30);
            this.chart.beginPath();
            this.chart.setLineDash([1, 0]);
            this.chart.lineWidth = 1;
            this.chart.strokeStyle = "#afafaf";
            this.chart.moveTo(20, 190);
            this.chart.lineTo(540, 190);
            this.chart.lineTo(540, 40);
            this.chart.lineWidth = 1;
            this.chart.stroke();
            this.chart.beginPath();
            this.chart.setLineDash([5, 5]);
            this.chart.lineWidth = 1;
            this.chart.moveTo(20, 115);
            this.chart.lineTo(540, 115);
            this.chart.strokeStyle = "#afafaf";
            this.chart.stroke();
            var params = this.getHistoryParams(data.history);
            var percentage = 0.0005;
            var topPrice = Math.ceil(params.highestPrice + params.highestPrice * percentage);
            var botPrice = Math.floor(params.lowestPrice - params.lowestPrice * percentage);
            var midPrice = botPrice + (topPrice - botPrice) / 2;
            this.chart.font = "11px Arial";
            this.chart.fillStyle = "#afafaf";
            this.chart.fillText(topPrice, 550, 45);
            this.chart.fillText(botPrice, 550, 193);
            this.chart.fillText(midPrice, 550, 120);
            this.chart.fillText('0s', 533, 210);
            this.chart.fillText('10s', 270, 210);
            this.chart.fillText('20s', 15, 210);
            var x;
            var y;
            var points = data.history;
            var firstPoint = points[0];
            this.chart.beginPath();
            this.chart.strokeStyle = "#afafaf";
            this.chart.lineWidth = 2;
            for (var i = 0; i < points.length; i++) {
                var point = points[i];
                x = 540 - (params.highestTime - point.time) / 20000 * 540;
                if (x < 20) {
                    x = 20;
                }
                ;
                y = 190 * (topPrice - point.price) / (topPrice - botPrice);
                this.chart.lineTo(x, y);
                this.drawPoint(x, y);
            }
            this.chart.stroke();
        };
        Chart.prototype.drawPoint = function (x, y) {
            this.chart.setLineDash([1, 0]);
            this.chart.fillStyle = "#fff";
            this.chart.fillRect(x - 2, y - 2, 4, 4);
            this.chart.strokeStyle = "#fff";
            this.chart.strokeRect(x - 2, y - 2, 4, 4);
        };
        Chart.prototype.getHistoryParams = function (history) {
            var params = {};
            params.lowestPrice = 100000;
            params.highestPrice = 0;
            params.lowestTime = 2000000000000;
            params.highestTime = 0;
            for (var i = 0; i < history.length; i++) {
                if (parseFloat(history[i].price) < params.lowestPrice) {
                    params.lowestPrice = parseFloat(history[i].price);
                }
                if (parseFloat(history[i].price) > params.highestPrice) {
                    params.highestPrice = parseFloat(history[i].price);
                }
                if (parseFloat(history[i].time) < params.lowestTime) {
                    params.lowestTime = parseFloat(history[i].time);
                }
                if (parseFloat(history[i].time) > params.highestTime) {
                    params.highestTime = parseFloat(history[i].time);
                }
            }
            return params;
        };
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
                this.currentChart = newCompany;
            }
            this.renderChart();
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
