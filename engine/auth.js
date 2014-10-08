//===================
//== Small middleware class for setting username in the system.
//===================
var couchbase = require('couchbase');
var db = require('./data.js');


module.exports.login = function (newUser,req,res,done) {
    filterScan(newUser, function (filtcb) {
        if (filtcb) {
            db.read(newUser, function (err, user) {
                if (err && err.code === couchbase.errors.keyNotFound) {
                        res.cookie('user', newUser);
                    db.upsert(newUser, 0, function (err, res) {
                        if (err) {
                            console.log("LOGIN:ERROR CREATING:" + err);
                            done("LOGIN:ERROR CREATING:" + err, null);
                            return;
                        }
                        console.log("LOGIN:" + newUser + ":SUCCESS");
                        done(null, "LOGIN:" + newUser + ":SUCCESS");
                        return;
                    });
                } else {
                    if (user) {
                        console.log("LOGIN:ERROR:" + newUser + " EXISTS");
                        done("LOGIN:ERROR:" + newUser + " exists -- please choose a different username", null);
                        return;
                    }
                    console.log("LOGIN:ERROR:END:" + err);
                    done("LOGIN:ERROR" + err, null);
                    return;
                }
            });
        } else {
            console.log("LOGIN:ERROR:WORD VIOLATION");
            done("LOGIN:ERROR, PROHIBITED TERM IN USERNAME", null);
            return;
        }
    });
}

var filter = ["put","banned","words","in","here"];

function filterScan(term,done){
    for(var i=0; i<filter.length;i++){
        if(term.toLowerCase().indexOf(filter[i])!=-1){
            done(false);
            return
        }
    }
    done(true);
    return;
}

module.exports.isLoggedIn = function(req, res, next) {
    if (req.cookies.user) {
        return next();
    }
    res.redirect('/');
}

