var xlsx = require('node-xlsx');
var _ = require('underscore');
var fs = require('fs');
var no_of_words = 333;
var no_of_options = 6;
var input_file = '/input.xlsx';
var output_file = '/output.json';

var obj = xlsx.parse(__dirname + input_file); // parses a file
var obj = xlsx.parse(fs.readFileSync(__dirname + input_file)); // parses a buffer

//extract object from output of excel to json
var newObj = obj[0].data.map(function(item){
    return{
        id : item[0],
        word: item[1],
        meaning: item[2],
        options: []
    };
});

//assign id for 1st object as 0
newObj[0].id = 0;

//create random options for every object from objects list
var newObj2 = newObj.map(function(item){
    var tmp_arr = _.times(no_of_options, _.random.bind(_, 0, no_of_words));
    var options_list = [];
    if(tmp_arr.indexOf(item.id)<0)
        tmp_arr[no_of_options-1] = item.id;
    // item.options = tmp_arr;
    for (var i = 0; i < tmp_arr.length; i++) {
        options_list[i] = newObj[tmp_arr[i]].meaning;
    }
    return{
        id : item.id,
        word: item.word,
        meaning: item.meaning,
        options: options_list
    };
});

//write the complete question objects list into the test.json file
fs.writeFile(__dirname + output_file, JSON.stringify(newObj2), function(err) {
    if(err) {
        return console.log(err);
    }
});
