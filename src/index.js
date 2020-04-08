window.addEventListener('DOMContentLoaded', (event) => {
    op.renderHeader();
});

function DataTable() {
    this.countries = [];
    this.filterdData = [];
    this.searchText = '';
    this.isHd = '';
    this.isOneway = '';
    this.cols = ['name', 'capital', 'region', 'population', 'flag'];
    this.sortCols = (d) => {
        console.log('inside sort',d.target.textContent);
    }
    this.renderHeader = () => {
        let header = document.getElementsByClassName('Rtable-row--head')[0];
        for(let d of this.cols) {
            let col =  document.createElement('div');
            col.setAttribute('class','Rtable-cell column-heading');
            let spn = document.createElement('span');
            spn.classList.add('arrow-up');
            spn.textContent = d;
            spn.addEventListener('click',this.sortCols.bind(d))
            let inpt = document.createElement('input');
            inpt.setAttribute('type','text');
            col.appendChild(spn);
            col.appendChild(inpt);
            header.appendChild(col);
        }
    }
  
    this.renderRow = (data) => {
        debugger;
        let table = document.getElementById('tbody');
        let row = document.createElement('div');
        row.setAttribute('class', 'Rtable-row full-width');

        for(let d of this.cols) {
            let col;
            col = document.createElement('div');
            col.setAttribute('class', 'Rtable-cell');
            if(d == 'flag') {
                let img = document.createElement('img');
                img.setAttribute('src', data.flag);
                img.setAttribute('alt', 'No Image found');
                col.appendChild(img);
            }
            else {
                col.textContent = data[d];
            }
            row.appendChild(col);
        }
        table.appendChild(row);
    }

    this.fetchData = () => {
        //this.showLoader();   
        fetch('https://restcountries.eu/rest/v2/all').then(function (response) {
            // The API call was successful!
            return response.json();
        }).then((data) => {
            setTimeout(() => {
                this.hideLoader();
                if (data) {
                    this.countries = data
                    for (let i = 0; i < this.countries.length; i++) {
                        this.renderRow(this.countries[i])
                    }
                }
                else {
                    console.warn('No Data Found', err);
                }
            }, 1000)
        }).catch(function (err) {
            // There was an error
            console.warn('Something went wrong.', err);
        });
    }
}
DataTable.prototype.filterCountries = function (event) {
    console.log(this);
    if (event.type == 'checkbox') {
        if (event.checked) {
            this.isHd = event.id == 'hd' ? true : this.isHd;
            this.isOneway = event.id == 'oneWay' ? true : this.isOneway;
        }
        else {
            // handling unselect part here
            this.isHd = event.id == 'hd' ? '' : this.isHd;
            this.isOneway = event.id == 'oneWay' ? '' : this.isOneway;
        }
    }
    else {
        this.searchText = event;
    }
    this.filterdData = this.cities.filter((d) =>
        d.name.toLowerCase().includes(this.searchText) &&
        (this.isHd ? d.hd_enabled == this.isHd : [true, false].includes(d.hd_enabled)) &&
        (this.isOneway ? d.one_way_enabled == this.isOneway : [true, false].includes(d.one_way_enabled))
    );
    document.getElementById('popular').textContent = '';
    document.getElementById('others').textContent = '';
    for (let i = 0; i < this.filterdData.length; i++) {
        this.renderCard(this.filterdData[i]);
    }
    console.log(this.filterdData);
}
DataTable.prototype.showLoader = function () {
    let loader = document.getElementsByClassName('loader')[0];
    loader.classList.remove('hide');
    document.getElementsByClassName('data-table')[0].classList.add('hide');
}
DataTable.prototype.hideLoader = function () {
    document.getElementsByClassName('loader')[0].classList.add('hide');
}
var op = new DataTable();
function debounce(fn, duration) {
    let timer;
    return function (args) {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn(args);
        }, duration)
    }
}
const fn = debounce(op.filterCountries.bind(op), 200);
op.fetchData();
