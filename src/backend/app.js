var xlsx = require('node-xlsx');
var _ = require('underscore');
var fs = require('fs');
var input_file = '/input.xlsx';
var output_file = '/output.json';

var obj = xlsx.parse(__dirname + input_file); // parses a file
var obj = xlsx.parse(fs.readFileSync(__dirname + input_file)); // parses a buffer

//extract object from output of excel to json
var newObj = obj[0].data.map(function(item){
    return{
        field : item[0],
        judge: item[1]?item[1]:'',
        lawyer: [item[2],item[3]],
        date_of_filling: item[4],
		date_of_order: item[5],
		disposal_duration:item[6]
    };
});

//write the complete question objects list into the test.json file
fs.writeFile(__dirname + output_file, JSON.stringify(newObj), function(err) {
    if(err) {
        return console.log(err);
    }
});
