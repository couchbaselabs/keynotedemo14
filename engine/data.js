//===================
//== Data API
//===================
var couchbase = require('couchbase');
var myCluster = new couchbase.Cluster('192.168.56.101:8091');
var myBucket = myCluster.openBucket('default');
var db=myBucket;


module.exports.upsert=function(key,val,done){
    db.upsert(key,val,function(err,res){
            if(err){
                console.log("DB.UPSERT:",err);
                done(err,null);
                return;
            }else{
                done(null,res);
                return;
            }
        }
    );
}

module.exports.read=function(key,done){
    db.get(key,function(err,result){
        if(err){
            console.log("DB.READ:",err);
            done(err,null);
            return;
        }else{
                done(null,result);
                return;
        }
    })
}

module.exports.reset=function(done){
    var mgr=myBucket.manager('Administrator','password');
    mgr.flush(function(err,complete){
       if(complete){
           done("complete");
       }
    });
}

module.exports.readView = function (done){
    var viewQuery = couchbase.ViewQuery;
    var query = viewQuery.from('bid-ddoc', 'bid-history').order(2).stale(1);
    db.query(query,function(err,results){
        if(err){
            done(err,null);
        }
        if(results){
            done(null,results);
        }
    })
}

module.exports.buildView = function(done){
    var mgr=myBucket.manager('Administrator','password');
        mgr.insertDesignDocument('bid-ddoc', {
            views: {
                'bid-history': {
                    map: function (doc, meta) {
                        if(doc.amount){
                            emit(parseInt(doc.amount), [doc.user, doc.date]);
                        }
                    }
                }
            }
        }, function(err) {
                done("complete");
        });
}
