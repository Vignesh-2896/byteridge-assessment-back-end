const express = require('express');
const router = express.Router();
const db = require('_helpers/db');
const Auditor = db.Auditor;
const User = db.User;

router.post("/logEntry/:entryType", logUserAction);
router.get("/audit/:userID", fetchLogData)
router.get("/audit/:userID/:pageNumber", fetchLogData)
router.get("/auditCount/:userID", fetchLogCount)

async function logUserAction(req, res, next){

    let auditLog = new Auditor({
        username : req.body.username,
        userAction : req.params.entryType,
        userIP : req.ip,
        logDate : req.body.logDate
    });

    await auditLog.save();

    res.json(`User ${req.params.entryType} - Logged.!`);

}

function fetchLogCount(req, res, next){     // Find the total number of documents present to facilitate proper pagination.
    let userID = req.params.userID;
    User.findOne({_id:userID},async(err, result) => {
        if(result.userAuditor == true){
            let response = await Auditor.countDocuments({});
            res.json(response)
        };
    });
}

function fetchLogData(req, res, next){ // Fetch entries from the Auditor collection with respect on the page number.

    let pageNumber = req.params.pageNumber;

    User.findOne({_id:req.params.userID},(err, result) => {
        if(result.userAuditor == true){     // Only User's with auditor function are allowed to use the /audit GET API.
            Auditor.find({},{_id:0, _v:0,}, (err, result) => {
                res.json(result);
            }).sort({logDate:1}).limit(10).skip( pageNumber > 1 ? ( ( pageNumber - 1 ) * 10 ) : 0 );
        } else {
            res.status(401).json({message:"Unauthorized Access of Audit API"});
        } 
    })
}

module.exports = router;