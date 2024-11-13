var db = require('sqlite-sync');

function checkIfInDatabase(currentHash)
{
    db.connect('users.db');

    db.run("CREATE TABLE IF NOT EXISTS users(hash TEXT NOT NULL, firstTimestamp TEXT, latestTimestamp TEXT)", function(res) {
        if(res.error)
            throw res.error;
    });

    var result = db.run("SELECT hash FROM users WHERE hash = '" + currentHash + "'");

    if (result[0] === undefined) {

        //create new entry
        db.insert("users", {hash:currentHash, firstTimestamp: Date.now().toString(), latestTimestamp: Date.now().toString()}, function(res){
            if(res.error)
                throw res.error;
        });

        return false;

    } else {

        //update timestamp
        db.update("users", {latestTimestamp: Date.now().toString()}, {hash:currentHash}, function(res){
            if(res.error)
                throw res.error;
        });

        return true;
    }
}

const express = require('express');
const cors = require('cors')
const app = express();

app.use(cors())

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     next();
// });

app.get('/', (req, res) => {
    res.send(checkIfInDatabase(req.query.hash));
})

app.post('/csp-report', (req, res) => {
    console.log('CSP Violation!');
});

app.listen(3000);