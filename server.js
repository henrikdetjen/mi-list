var express = require('express'),
 fs = require('fs'),
 bodyParser = require('body-parser'),
 app = express();
 
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile('index.html');
});
 
app.get('/list', function (req, res) {
	fs.readFile('./public/mi-list.json', "utf8", function(err, data){
		if(err) {
			res.sendStatus(500);
		}
		else {
			res.send(data);
		}
	});
});

app.post('/list', function (req, res) {
	if (req.body) {
		fs.writeFile('./public/mi-list.json', JSON.stringify(req.body), 'utf8'); 
		res.sendStatus(200);
	}
	else {
		res.sendStatus(400);
	}
})
 
app.listen(3000);