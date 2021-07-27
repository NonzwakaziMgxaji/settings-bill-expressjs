//import Express.js
const express  = require('express');

//import the express-handlebars
const exphbs  = require('express-handlebars');

//import the body-parser
const bodyParser = require('body-parser');

const  SettingsBill = require('./settings-bill');

//create instance of Express app
const app = express();

//instantiated factory function
const settingsBill = SettingsBill();

const handlebarSetup = exphbs({
    partialsDir: "./views/partials",
    viewPath:  './views',
    layoutsDir : './views/layouts'
});

app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');

//Configure the express-handlebars module as middleware
// app.engine('handlebars', exphbs({defaultLayout: 'main'}));
// app.set('view engine', 'handlebars');

app.use(express.static('public'));

//set up bodyParser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

var moment = require('moment'); // require
moment().format(); 

//Create a route
app.get('/', function(req, res){
   
    res.render('index', {
        settings: settingsBill.getSettings(),
        totals: settingsBill.totals()
    });    
});

app.post('/settings', function(req, res){
    // console.log(req.body);

    settingsBill.setSettings({
        callCost: req.body.callCost,
        smsCost: req.body.smsCost,
        warningLevel: req.body.warningLevel,
        criticalLevel: req.body.criticalLevel
    })
    
    console.log(settingsBill.getSettings());
    res.redirect('/');
});

app.post('/action', function(req, res){
    // console.log(req.body.actionType);

//capture the call type to add
    settingsBill.recordAction(req.body.actionType)

    res.redirect('/');
});

app.get('/actions', function(req, res){
    res.render('actions', {actions: settingsBill.actions()});

    const actions = settingsBill.actions()

    actions.forEach(elem => {
    elem.timestamps = moment(elem.timestamp).fromNow()})
});

app.get('/actions/:actionType', function(req, res){
    const actionType = req.params.actionType;
    res.render('actions', {actions: settingsBill.actionsFor(actionType)});
    
});


//make port number configurable
const PORT = process.env.PORT || 3011;

//starts server to listen on port 3011 for connections
app.listen(PORT, function(){
    console.log('App started at port:', PORT);
});