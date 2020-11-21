
const fs = require('fs');
const csv = require('csv-parser');

const { timeStamp } = require('console');
const dset = require('../dataset_constant');
const db = require('../sql_db');
require('dotenv').config({ path: process.env.pro ? '.env' : '.env.dev' });


const CSV_FILE = "./solar-dataset/tmy3.csv";

const MAX_ROW = 300000; // value should be > 2

class AverageBookeeper {
    constructor(init_vals = []) {
        this.sum = 0.0;
        this.count = 0;
        for (let val of init_vals) {
            this.sum += init_vals;
            this.count += 1;
        }
    }
    add(val) {
        this.sum += val;
        this.count += 1;
    }

    result() {
        if (this.count == 0) { return 0.; }
        return this.sum / this.count;
    }
}

class RowBookeeper {
    constructor(row) {
        this.row = row;
        this.count = 1;
        for (const numerical_field of dset.NUMERIC_COLUMNS) {
            this.row[numerical_field] = Number(row[numerical_field]);
        }
    }
    add(newRow) {
        for (const numerical_field of dset.NUMERIC_COLUMNS) {
            this.row[numerical_field] += Number(newRow[numerical_field]);
        }
        this.count += 1;
    }

    _toSQLDateFormat(date_str) {
        return new Date(date_str).toISOString().slice(0, 10);
    }
    result() {
        let resRow = JSON.parse(JSON.stringify(this.row)); // dirty deep clone
        for (const numerical_field of dset.NUMERIC_COLUMNS) {
            resRow[numerical_field] /= this.count;
        }
        resRow[dset.meta.DATE_KEY] = this._toSQLDateFormat(resRow[dset.meta.DATE_KEY])
        return resRow;
    }
}


let prev_row = null;
let current_row_keeper = null;
let processed_row_count = 0;
let csv_data = [];

function compare_row(prev_row, current_row) {
    return (prev_row[dset.meta.DATE_KEY] == current_row[dset.meta.DATE_KEY] &&
        prev_row['station_number'] == current_row['station_number']);
}


function list2SQLStr(list) {
    let modified_list = []
    for (let item of list) {
        modified_list.push("`" + item + "`")
    }
    return modified_list.join(",");
}

let fileStream = fs.createReadStream(CSV_FILE);
let csvStream = csv();

let onCsvData = (row) => {
    if (csv_data.length == MAX_ROW) {
        csvStream.emit('donereading'); //custom event for convenience
        csvStream.removeListener('data', onCsvData);
        fileStream.close();
    }
    csv_data.push(row);
}
fileStream
    .pipe(csvStream)
    .on('data', onCsvData)
    .on('donereading', async () => {
        console.log('csv_data', csv_data.length);
        while (csv_data.length > 0) {
            let row = csv_data.shift();
            if (prev_row == null) { // first row
                current_row_keeper = new RowBookeeper(row);
            } else {
                if (compare_row(prev_row, row)) { // same as previous row. same date
                    current_row_keeper.add(row);
                } else {
                    // save current row to database
                    const remaining_fields = Object.keys(dset.meta).filter(key => !dset.NUMERIC_COLUMNS.includes(key)).map(key => dset.meta[key]);
                    const numeric_fields = dset.NUMERIC_COLUMNS;
                    const to_persist_row = current_row_keeper.result();
                    const values = {};
                    [...remaining_fields, ...numeric_fields].map(key => values[key] = to_persist_row[key]);
                    values['date'] = values[dset.meta.DATE_KEY];
                    values['station_code'] = values[dset.meta.STATION_NUMBER_KEY];
                    delete values[dset.meta.DATE_KEY];
                    delete values[dset.meta.STATION_NUMBER_KEY];
                    let resQuery = await db.query("INSERT INTO station_recording SET ?", values);
                    processed_row_count++;
                    // refresh
                    current_row_keeper = new RowBookeeper(row);
                }
            }
            prev_row = row;
        }
        fileStream.close();
        csvStream.removeListener('data', onCsvData);
        console.log('done');
    });