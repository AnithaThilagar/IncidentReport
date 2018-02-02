'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const apiai = require('apiai');
//const serviceNow = require('servicenow');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(process.env.PORT || 5000, () => {
    console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

const apiaiApp = apiai("1c5c2bd1f8b548b18f3782ca17420f2c");
/*const serviceNowConfig = serviceNow({
    'host': 'https://dev18442.service-now.com',
    'user': '33238',
    'pass': 'abc123'
});

let client = new serviceNow.client(serviceNowConfig);
client.getRecords("incident", "Active=true", function (error, result) {
    if (error) {
        console.log('Error in get records ' + error);
    } else {
        console.log('Result from sn ' + result);
    }
});*/

console.log("---- " + serviceNowObject+" ------");

//To handle the response to bot
app.post('/ai', (req, res) => {
    console.log('*** Inside service now request ***');
    console.log(req.body.result);
    if (req.body.result.action === 'input.welcome') {
        console.log('Inside Welcome intent');       
        res.json(welcomeIntent());
    } else if (req.body.result.action === 'reportIncident') {

    } else {
        console.log('Other than welcome intent');
        let msg = "Can't understand";
        return res.json({
            speech: msg,
            displayText: msg,
            source: 'reportIncidentBot'
        });
    }
});

//To send the welcome message for the bot as the button
function welcomeIntent() {    
    return {
        speech: '',
        displayText: "Hi, welcome to incident Report Bot",
        data: {
            "facebook": {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text":"Hi, welcome to incident Report Bot. \n I can help you with the following.\n 1) To report an incident in your organization \n 2) To view the status of the incidents \n 3) Add comments to the incidents \n Please select any one of the following to continue",
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Report Incident",
                                "payload": "report_incident"
                            },
                            {
                                "type": "postback",
                                "title": "My Incidents",
                                "payload": "my_incidents"
                            }
                        ]
                    }
                }
            }
        },
        source: 'reportIncidentBot'
    };
}