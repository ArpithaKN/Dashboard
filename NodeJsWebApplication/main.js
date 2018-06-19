var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/autocardgenrate";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var records = [];
  var online = [];
  for(var i=1;i<=1000;i++){
      var data ={
          cardUid:'',
          cardRFID:'MT_'+500000+i+'_'+00001,
          createdBy:"objectId("+"590eb959dc72fa7bae7cd03b"+')',
          cardNumber:500000+i,
          currentLocation:"objectId("+"58ff4fc3c2434972b6271ce6"+')',
          cardType:"2",
          status:1,
          balance:0
      };
      online.push(data);
  }
  records = online;
  var week = [];
  for(var i=1;i<=1000;i++){
      var data ={
          cardUid:'',
          cardRFID:'WK_'+600000+i+'_'+00001,
          createdBy:"objectId("+"590eb959dc72fa7bae7cd03b"+')',
          cardNumber:600000+i,
          currentLocation:"objectId("+"58ff4fc3c2434972b6271ce6"+')',
          cardType:"2",
          status:1,
          balance:0
      };
      week.push(data);
  }
  for(var i=0;i<week.length;i++)
  {
      records.push(week[i]);
  }
  var threedays = [];
  for(var i=1;i<=1000;i++){
      var data ={
          cardUid:'',
          cardRFID:'TD_'+700000+i+'_'+00001,
          createdBy:"objectId("+"590eb959dc72fa7bae7cd03b"+')',
          cardNumber:700000+i,
          currentLocation:"objectId("+"58ff4fc3c2434972b6271ce6"+')',
          cardType:"2",
          status:1,
          balance:0
      };
      threedays.push(data);
  }
  for(var i=0;i<threedays.length;i++)
  {
      records.push(threedays[i]);
  }
  var oneday = [];
  for(var i=1;i<=1000;i++){
      var data ={
          cardUid:'',
          cardRFID:'OD_'+800000+i+'_'+00001,
          createdBy:"objectId("+"590eb959dc72fa7bae7cd03b"+')',
          cardNumber:800000+i,
          currentLocation:"objectId("+"58ff4fc3c2434972b6271ce6"+')',
          cardType:"2",
          status:1,
          balance:0
      };
      oneday.push(data);
  }
   for(var i=0;i<oneday.length;i++)
  {
      records.push(oneday[i]);
  }
  db.collection("autocard").insertMany(records, function(err, res) {
    if (err) throw err;
    console.log("Number of documents inserted: " + res.insertedCount);
    db.close();
  });
});
