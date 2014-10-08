//===================
//== Core code
//===================
var db = require('./data.js');
var auth = require('./auth.js');
var uuid = require('uuid');

module.exports.auctionSignup = function(newUser,req,res){
    auth.login(newUser,req,res,function(err,done){
        if(err){
            // HERE
            console.log("ERROR!!",err);
            res.render('login',{message:err});
            return;
        }else{
            db.read('bike',function(err,cb){
                res.redirect('/api/auction/load')
            })
        }
    });
}

module.exports.auctionLoad=function(req,res){
    db.read('bike',function(err,cb){
        res.render('auction',{user:req.cookies.user,amount:cb.value.bid,high:cb.value.high});
        return;
    });
}

module.exports.auctionBid = function(amount,req,res){
    db.read('bike',function(err,current){
        if(parseInt(current.value.bid)<parseInt(amount)&&((parseInt(amount)-current.value.bid)<501)){
            db.upsert('bike',{bid:Math.round(amount),open:current.value.open,high:req.cookies.user},function(err,update){
                if(update){
                    module.exports.bidAdd(Math.round(amount),req,res);
                    db.read('bike',function(err,done){
                        if(done){
                            res.render('auction',{user:req.cookies.user,amount:done.value.bid,high:done.value.high});
                            return;
                        }
                    });
                }
            });
        }else{
            db.read('bike',function(err,done){
                if(done){
                    res.render('auction',{user:req.cookies.user,amount:done.value.bid,high:done.value.high,err:"err"});
                    return;
                }
            });
        }
    });
}

module.exports.bidAdd=function(amount,req,res){
    db.upsert(uuid.v1(),{'amount':amount,'item':'bike','user':req.cookies.user,'date':new Date},function(err,done){
        // Async bid history method -- do nothing if success/fail
    })
}

module.exports.viewAdd = function(req,res){
    db.buildView(function(done){
        if(done){
            res.send({"view":"built"});
        }
    });
}

module.exports.viewHistory = function(req,res){
    db.readView(function(err,done){
        if(done){
            res.render('history',
                {title:"2014 Maserati",
                 count:done.length,
                 keyList:done});
        }
    });
}

module.exports.auctionGet = function(req,res){
    db.read('bike',function(err,done){
        res.status(201);
        res.send(done.value);
    });
}

module.exports.auctionOpen = function (req, res) {
    db.reset(function(flushed){
        if(flushed){
            db.upsert('bike', {"bid": "100", "open": "100", "high": "Frank"}, function (err, done) {
                if (done) {
                    db.upsert('state', {"active": true, "countdown":"none"}, function (err, complete) {
                        if(complete) {
                            res.send({"auction": "reset"});
                        }
                    });
                }
            });
        }
    });
}

module.exports.auctionClose = function (req, res) {
    db.read('state', function (err, done) {
        if (done) {
            db.upsert('state', {'active': false, "countdown": done.value.countdown}, function (err, complete) {
                if (complete) {
                    res.send({"auction": "closed"});
                }
            });
        }
    });
}


module.exports.countdownGet = function(req,res) {
    db.read('state', function (err, done) {
        if (done) {
            var t1 = new Date(done.value.countdown);
            var t2 = new Date();
            var dif = t1.getTime() - t2.getTime();

            var Seconds_from_T1_to_T2 = parseInt(dif) / 1000;
            var Seconds_Between_Dates = Math.abs(Seconds_from_T1_to_T2);
            res.send({info: Seconds_Between_Dates});
        }
    });
}

module.exports.countdownSet = function(req,res,yyyy,mm,dd,hh) {
    var cd=new Date(parseInt(yyyy), parseInt(mm)-1, parseInt(dd), parseInt(hh), 0, 0, 0);
    console.log("DEBUG DATE:", cd);
    db.read('state', function (err, done) {
        if (done) {
            db.upsert('state', {'active': false, "countdown": cd}, function (err, complete) {
                if (complete) {
                    res.send({"countdown": "set"});
                }
            });
        }
    });
}

module.exports.countdownDel = function(req,res){
    db.read('state', function (err, done) {
        if (done) {
            db.upsert('state', {'active': true, "countdown":"none"}, function (err, complete) {
                if (complete) {
                    res.send({"countdown":"deleted"});
                }
            });
        }
    });
}

module.exports.isActive = function(req,res,next) {
    db.read('state',function(err,done){
        if(done.value.active) {
            return next();
        }else{
            if(done.value.countdown != "none")
            {
                res.render('countdown.jade');
            }else {
                db.read('bike', function (err, cb) {
                    res.render('winner', {user: req.cookies.user, amount: cb.value.bid, high: cb.value.high});
                    return;
                });
            }
        }
    });
}

