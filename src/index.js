window.addEventListener('DOMContentLoaded', (event) => {
    op.renderHeader();
});

function DataTable() {
    this.countries = [];
    this.filterdData = [];
    this.searchText = '';
    this.isHd = '';
    this.isOneway = '';
    this.cols = [{
        'label': 'name',
        'sortable': true,
        'sortOrder': 'desc'
    },
    {
        'label': 'capital',
        'sortable': true,
        'sortOrder': 'desc'
    },
    {
        'label': 'flag',
        'sortable': false,
        'sortOrder': 'desc'
    },
    {
        'label': 'region',
        'sortable': true,
        'sortOrder': 'desc'
    },
    {
        'label': 'population',
        'sortable': true,
        'sortOrder': 'desc'
    }]
    
    this.sortCols = (ev) => {
        console.log('inside sort',ev.target.textContent);
        const colName = ev.target.textContent;
        const col = this.cols.filter((d) => d.label == colName)[0];
        const type = this.filterdData[0][col.label];
        if(col.sortable) {
            switch(typeof(type)) {
                case 'string':
                    this.filterdData = this.filterdData.sort((a,b) => {
                        return col.sortOrder == 'desc' ? a[colName].toLowerCase().localeCompare(b[colName].toLowerCase()) :
                        b[colName].toLowerCase().localeCompare(a[colName].toLowerCase()) 
                });
               
                break;
                case 'number':
                    this.filterdData = this.filterdData.sort((a,b) => {
                        return col.sortOrder == 'desc' ? a[colName] - b[colName] : b[colName] - a [colName]
                });
                break;
              }
                if(col.sortOrder == 'desc') {
                    col.sortOrder = 'asc';
                    ev.target.classList.add('arrow-down');
                    ev.target.classList.remove('arrow-up');
                }
                else {
                    col.sortOrder = 'desc';
                    ev.target.classList.add('arrow-up');
                    ev.target.classList.remove('arrow-down');
                }
                this.renderRow(this.filterdData);
        }
        else {
            return;
        }
    }
    this.renderHeader = () => {
        let header = document.getElementsByClassName('Rtable-row--head')[0];
        for(let d of this.cols) {
            let col =  document.createElement('div');
            col.setAttribute('class','Rtable-cell column-heading');
            let spn = document.createElement('span');
            //spn.classList.add('arrow-up');
            spn.textContent = d.label;
            spn.addEventListener('click',this.sortCols.bind(d))
            let inpt = document.createElement('input');
            inpt.addEventListener('keyup',debounce(this.filterCountries.bind(this), 300));
            inpt.setAttribute('type','text');
            col.appendChild(spn);
            col.appendChild(inpt);
            header.appendChild(col);
        }
    }
  
    this.renderRow = (data) => {
        debugger;
        let table = document.getElementById('tbody');
        table.textContent = '';
        for (let i = 0; i < data.length; i++) {
        let row = document.createElement('div');
        row.setAttribute('class', 'Rtable-row full-width');

        for(let d of this.cols) {
            let col;
            col = document.createElement('div');
            col.setAttribute('class', 'Rtable-cell');
            if(d.label == 'flag') {
                let img = document.createElement('img');
                img.setAttribute('src', data[i].flag);
                img.setAttribute('alt', 'No Image found');
                col.appendChild(img);
            }
            else {
                col.textContent = data[i][d.label];
            }
            row.appendChild(col);
        }
        table.appendChild(row);
    }
    }

    this.fetchData = async function(url) {
        try {
          const response = await fetch(url);
          await setTimeout(()=>this.hideLoader(),1000);
          let data = await response.json();
         
          if(data) {
            this.countries = data;
            this.filterdData = [...data];
            this.renderRow(this.countries);
            this.hideLoader();
          }
          else {
              console.warn('No data found',err);
          }
         
        }
        catch (err) {
          console.log('fetch failed', err);
        }
      }

}
DataTable.prototype.filterCountries = function (event) {
    let val = event.target.value;
    let colName;
    colName= event.target.previousSibling.textContent;
    colName = colName.trim() ? colName : this.cols[0].label;
    this.filterdData = this.filterdData.filter((obj) => obj[colName].toLowerCase().includes(val.toLowerCase()));
    this.renderRow(this.filterdData);
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
var func = debounce(op.filterCountries.bind(op), 200);
op.fetchData('https://restcountries.eu/rest/v2/all');
