var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var moment = require('moment');
var redis = require('redis');
var client = redis.createClient();

app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

client.on('connect', () => {
  console.log('connected');
})

var router = express.Router();

router.use((req,res,next) => {
  next();
  console.log('works');
})

router.get('/', (req, res) => {
  res.render('index', {
    pageTitle: 'Redis-testing'
  });

  res.json({ message: 'hoorray! '});
})

router.post('/posting', (req, res) => {
  var email = req.body.email;
  var message = req.body.message;
  var reason = req.body.reason;
  var timestamp = moment().format('h:mm:ss');

  client.hmset(timestamp, {
    'email': email,
    'reason': reason,
    'message': message
  })

  console.log('response recorded: ' + req.body.email);
  res.json({ message: 'Created!'});
})

router.get('/posting', (req,res) => {
    var result = [];
    client.keys('*', (err, keys) => {
      if (err) return console.log(err);

      for (var i=0; i<keys.length; i++) {
        result.push(keys[i]);
      }
    })
    res.render('results', {
      "result": result
    });
})

app.use(router);

var port = process.env.PORT || 8080;
console.log('listening on ' + port);
app.listen(port);
