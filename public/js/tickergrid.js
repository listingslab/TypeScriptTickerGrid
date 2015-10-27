///<reference path='ICompany.ts'/>
var Tickergrid;
(function (Tickergrid) {
    var Model = (function () {
        function Model(main) {
            this._main = main;
            this._companies = [];
            this._deltas = [];
            this._headers = {};
            this._currentDelta = 0;
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
            this._headers = lines[0].split(',');
            for (var i = 1; i < lines.length; i++) {
                var line = lines[i].split(',');
                if (line[0] != '' && line[1] != '') {
                    var company = {
                        name: line[0],
                        companyName: line[1],
                        price: line[2],
                        change: line[3],
                        changePerc: line[4],
                        mktCap: line[5],
                        tick: ''
                    };
                    this._companies.push(company);
                }
            }
            this._main._view.renderGrid();
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
            this._deltas = res.split("\n");
            var self = this;
            setTimeout(function () {
                self.deltaEngine();
            }, 2000);
        };
        Model.prototype.deltaEngine = function () {
            for (var i = 0; i < this._companies.length; i++) {
                var change = false;
                var deltaData = this._deltas[this._currentDelta].split(",");
                var oldPrice = this._companies[i].price;
                var newPrice = deltaData[2];
                if (newPrice != '') {
                    if (newPrice > oldPrice) {
                        change = 'up';
                    }
                    else {
                        change = 'down';
                    }
                }
                if (change) {
                    this._companies[i].price = deltaData[2];
                    this._companies[i].change = deltaData[3];
                    this._companies[i].changePerc = deltaData[4];
                    this._companies[i].tick = change;
                    this._main._view.updateCompany(this._companies[i]);
                }
                this._currentDelta++;
            }
            var wait = this._deltas[this._currentDelta];
            if (this._deltas[this._currentDelta + 1] == '') {
                this._currentDelta = 0;
            }
            else {
                this._currentDelta++;
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
    var View = (function () {
        function View(main) {
            this._main = main;
        }
        View.prototype.renderGrid = function () {
            var headers = this._main._model._headers;
            var companies = this._main._model._companies;
            var html = '';
            html += '<table class="table table-condensed table-hover">';
            html += '<tr>';
            for (var i = 0; i < headers.length; i++) {
                html += '<th>';
                html += headers[i];
                html += '</th>';
            }
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
            var tickergrid = document.getElementById("tickergrid");
            tickergrid.innerHTML = html;
        };
        View.prototype.updateCompany = function (company) {
            // Takes a company object and creates a new HTML row element
            // and replaces the old one, adding the animation class
            var oldRow = document.getElementById(company.name);
            var newRow = document.createElement('tr');
            newRow.setAttribute('id', company.name);
            newRow.setAttribute('class', company.tick);
            var td = document.createElement('td');
            td.setAttribute('width', '10%');
            newRow.appendChild(td);
            var txt = document.createTextNode(company.name);
            td.appendChild(txt);
            td = document.createElement('td');
            td.setAttribute('width', '30%');
            newRow.appendChild(td);
            txt = document.createTextNode(company.companyName);
            td.appendChild(txt);
            td = document.createElement('td');
            td.setAttribute('width', '15%');
            newRow.appendChild(td);
            txt = document.createTextNode(company.price.toString());
            td.appendChild(txt);
            td = document.createElement('td');
            td.setAttribute('width', '15%');
            newRow.appendChild(td);
            txt = document.createTextNode(company.change.toString());
            td.appendChild(txt);
            td = document.createElement('td');
            td.setAttribute('width', '15%');
            newRow.appendChild(td);
            txt = document.createTextNode(company.changePerc.toString());
            td.appendChild(txt);
            td = document.createElement('td');
            td.setAttribute('width', '15%');
            newRow.appendChild(td);
            txt = document.createTextNode(company.mktCap);
            td.appendChild(txt);
            var replacedNode = oldRow.parentNode.replaceChild(newRow, oldRow);
        };
        return View;
    })();
    Tickergrid.View = View;
})(Tickergrid || (Tickergrid = {}));
///<reference path='Tickergrid/Model.ts'/>
///<reference path='Tickergrid/View.ts'/>
var Tickergrid;
(function (Tickergrid) {
    var Model = Tickergrid.Model;
    var View = Tickergrid.View;
    var Main = (function () {
        function Main() {
            this._view = new View(this);
            this._model = new Model(this);
        }
        return Main;
    })();
    Tickergrid.Main = Main;
})(Tickergrid || (Tickergrid = {}));
