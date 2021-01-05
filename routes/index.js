const express = require('express');
const webpush=require('web-push');
const Datastore = require('nedb');
const db = new Datastore();
const router = express.Router();

let vapidKeys=
{
"publicKey":`BEIWN2i8Nmy5TtmwvHR17T6DkeZseog-djS92NYRkEcaYFUDSytJAwudB6S9DBGQH4nZVbLJpEWIz_zvBLDmnN8`,
"privateKey":`YyaThdyNKpWQpk0d8mnhOdlur2sTyQiCFkLlmkVFUQ4`
}

 function triggerNotification(subscription,data)
 {
  return webpush.sendNotification(subscription, JSON.stringify(data))
  .catch(err => {
    console.error("Error sending notification, reason: ", err);
    res.status(500).send({message:'Error sending notification'});
    
  });
 }

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/app/test',function(req,res){
  res.send({msg:"Test message sending"});
})

router.post('/app/message',function(req,res){
  webpush.setVapidDetails(
    'mailto:example@yourdomain.org',
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );

  db.find({}, function (err, subscriptions) {
    if(err){
      console.error("Error sending notification, reason: ", err);
      res.status(500).send({message:'Error sending notification'});
    }
else{
  let promiseChain = Promise.resolve();
  let iterable=[];
  for(let i=0; i< subscriptions.length;i++){
    const subscription = subscriptions[i];
    promiseChain=promiseChain.then(() => {
      return triggerNotification(subscription, req.body)
    })
    iterable.push(promiseChain);
  }
  Promise.all(iterable).then(() => res.send({message: 'Notification sent successfully to all subscribers.'}))  
    .catch(function(err) {
      res.status(500).send({message:'We were unable to send messages to all subscriptions'})
    });   
}
  })

})
  

router.post('/app/subscribe',function(req,res){
if(req.body.endpoint){
  db.insert(req.body, function (err, newDoc) {
    if(err){
      console.log(err);
      res.status(500).send({message:err});
    } 
    else{
      res.status(200).send({message:"Subscribed successfully"})
    } 
  });
}
else{
  res.status(500).send({message:"The subscription must contain an endpoint"});
}

})

module.exports = router;
