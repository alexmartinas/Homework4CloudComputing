var express = require('express');
var multer = require('multer');
var bodyParser = require('body-parser');
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var Connection = require('tedious').Connection;
var Promise = require('promise');


// CREATE TABLE Memories (title varchar(200), date varchar(10), memory varchar(max), userId varchar(30)); create db

var app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.set('view engine', 'jade');

app.use(express.static('public'));

app.set('view engine', 'jade');
app.enable('trust proxy');

app.get('/', function(req, res) {
    res.render('index', { });
});

app.get('/memories', function(req, res) {
    var memories = getMemories("alex.martinas95@gmail.com");
    memories.then(function (result) {
        console.log(result);
        res.render('memory', {memories: result });
    })
});

app.post('/', function(req, res) {
    saveMemory(req.body.title, req.body.date, req.body.memory, "alex.martinas95@gmail.com");
    res.redirect('/');
});

app.listen(8080);

var config = {
    userName: 'tema4cc',
    password: 'Pass1234',
    server: 'tema4cc.database.windows.net',
    // If you are on Azure SQL Database, you need these next options.
    options: {encrypt: true, database: 'tema4cloud'}
};
var connection = new Connection(config);
connection.on('connect', function(err) {
    console.log(err);
    console.log("Connected");
});

function getMemories(userId) {
    return new Promise(function (resolve, reject) {
        var rowsNr = 0;
        var count = 0;
        request = new Request("SELECT * from dbo.Memory where userId = @userId", function(err, rowCount, rows) {
            if (err) {
                console.log(err);
            }
            rowsNr = rowCount;
        });
        request.addParameter('userId', TYPES.VarChar, userId);
        var result = [];
        request.on('row', function(columns) {
            var row = {};
            row.title = columns[1].value;
            row.date = columns[2].value;
            row.memory = columns[3].value;
            result.push(row)
        });

        request.on('requestCompleted', function(rowCount, more) {
            resolve(result)
        });
        connection.execSql(request);
    });

}

function saveMemory(title, date, memory, userId ) {
    request = new Request("INSERT dbo.Memory (title, date, memory, userId) VALUES (@title, @date, @memory, @userId);", function(err) {
        if (err) {
            console.log(err);}
    });
    request.addParameter('title', TYPES.VarChar, title);
    request.addParameter('date', TYPES.VarChar , date);
    request.addParameter('memory', TYPES.VarChar, memory);
    request.addParameter('userId', TYPES.VarChar, userId);
    request.on('row', function(columns) {
        columns.forEach(function(column) {
            if (column.value === null) {
                console.log('NULL');
            } else {
                console.log("Product id of inserted item is " + column.value);
            }
        });
    });
    connection.execSql(request);
}