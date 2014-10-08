var core = require('../engine/core.js');
var auth = require('../engine/auth.js');
var bodyParser = require('body-parser');
var controlPassword = "un5ecure_pa55word"

// create application/json parser
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = function (app) {

    app.get('/', core.isActive,function (req, res) {
        // res.render('countdown.jade');
        res.render('login.jade');
    });
    app.post('/api/auction/login',urlencodedParser,function(req,res){
        core.auctionSignup(req.body.user,req,res);
    });
    app.get('/api/auction/login',function(req,res){
        res.render('login.jade');
    });
    app.get('/api/auction/load',auth.isLoggedIn,core.isActive,core.auctionLoad);
    app.post('/api/auction/bid',auth.isLoggedIn,core.isActive,urlencodedParser, function(req,res){
        core.auctionBid(req.body.bid,req,res);
    app.get('/api/auction/bid',auth.isLoggedIn,core.isActive,core.auctionLoad);
    });
    app.get('/api/auction/get',core.auctionGet);
    app.post('/api/auction/open/:password',urlencodedParser,function(req,res){
        if(req.params.password==controlPassword){
            core.auctionOpen(req,res);
        }
    });
    app.post('/api/auction/close/:password',urlencodedParser,function(req,res){
        if(req.params.password==controlPassword){
            core.auctionClose(req,res);
        }
    });
    app.post('/api/auction/view/build',core.viewAdd);
    app.get('/api/auction/view/get', core.viewHistory);
    app.get('/api/countdown/get', core.countdownGet);
    app.post('/api/countdown/set/:yyyy/:mm/:dd/:hh', urlencodedParser,function(req,res){
        core.countdownSet(req,res,req.params.yyyy,req.params.mm,req.params.dd,req.params.hh);
    });
    app.post('/api/countdown/del/:password', urlencodedParser, function (req, res) {
        if (req.params.password == controlPassword) {
            core.countdownDel(req,res)
        }
    });
}

