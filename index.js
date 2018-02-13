'use strict';

const express = require('express'),
    bodyParser = require('body-parser'),
    //request = require('request'),
    apiai = require('apiai'),
    config = require('./config'),
    facebook = require('./facebook'),
    serviceNow = require('./serviceNow'),
    { DialogflowApp } = require('actions-on-google');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(process.env.PORT || 5000, () => {
    console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

const apiaiApp = apiai(config.clientAccessToken);

let userData = {};

/*var testOptions = {
    url: 'https://api.dialogflow.com/v1/entities',
    qs: { v: '20150910' },
    headers:
    {
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        authorization: '7566abebef174e1dbd6199205352aeab'
    }
}; 

request.get(testOptions, (err, response, body) => {
    if (err) {
        console.log("Err is " + JSON.stringify(err));
    }
    if (response) {
        console.log("Response is " + JSON.stringify(response));
    }
});*/

//To handle the response to bot
app.post('/ai', (req, res) => {
    console.log(req.body);
    const googleAssistant = new DialogflowApp({ request, response });
    console.log(googleAssistant);
    if (req.body.result.action === 'input.welcome') {
        userData = {};
        return res.json(facebook.welcomeIntent());
    } else if (req.body.result.action === 'reportIncident') {
        return res.json(facebook.incidentCategory());
    } else if (req.body.result.action === 'incident-category') {
        userData = {};
        userData.category = req.body.result.parameters["incidentCategory"];
        return res.json(facebook.incidentSubCategory(userData.category.toLowerCase()));
    } else if (req.body.result.action === 'incident-subcategory') {
        userData.description = req.body.result.parameters["description"];
        userData.subCategory = req.body.result.parameters["subcategory"];
        if (typeof userData.category == "undefined") {
            userData.category = userData.subCategory == "New Device" || userData.subCategory == "Damaged Device" || userData.subCategory == "Replace Device" ? "Hardware" : "Software";
        }
        return res.json(facebook.incidentUrgencyType());
    } else if (req.body.result.action === 'IncidentSubcategory.IncidentSubcategory-modeOfContact') {
        userData.urgencyType = req.body.result.parameters["urgencyType"].toLowerCase() == 'high' ? 1 : req.body.result.parameters["urgencyType"].toLowerCase() == 'medium'
            ? 2 : 3; //Set the urgency type based on the selected value
        return res.json(facebook.incidentModeOfContact());
    } else if (typeof userData.category != "undefined" && (req.body.result.action === 'getPhoneNumber' || req.body.result.action === 'getMailId')) {
        userData.modeOfContact = req.body.result.parameters["modeOfContact"];
        console.log("Mode of Contact " + userData.modeOfContact);
        userData.contactDetails = req.body.result.action === 'getPhoneNumber' ? req.body.result.parameters["phone-number"] : req.body.result.parameters["email"];
        if (req.body.result.action === 'getPhoneNumber') {
            console.log(req.body.result.parameters["phone-number"]);
            if (req.body.result.parameters["phone-number"] != "") {
                if (req.body.result.parameters["phone-number"].match(/^(\+\d{1,3}[- ]?)?\d{10}$/) && !(req.body.result.parameters["phone-number"].match(/0{5,}/))) {
                    console.log("Phone Num " + req.body.result.parameters["phone-number"]);
                    serviceNow.saveIncident(res, userData);
                } else {
                    console.log("Inside else");
                    let message = 'Please enter the valid phone number';
                    return res.json({
                        speech: message,
                        displayText: message,
                        followupEvent: {
                            "name": "getMobile",
                            "data": { "modeOfContact": userData.modeOfContact }
                        }
                    });
                }
            }
        } else {
            let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (re.test(req.body.result.parameters["email"])) {
                console.log(req.body.result.parameters["email"]);
                saveIncident(res);
            } else {
                let message = 'Please enter the valid mail id';
                return res.json({
                    speech: message,
                    displayText: message,
                    followupEvent: {
                        "name": "getMail",
                        "data": { "modeOfContact": userData.modeOfContact }
                    }
                });
            }
        }
    } else if (req.body.result.action === 'getIncident') {
        let reg = /^[a-zA-Z0-9]+$/;
        if (reg.test(req.body.result.parameters["incidentId"])) {
            serviceNow.getIncidentDetails(res, req.body.result.parameters["incidentId"]);
        } else {
            let message = 'Please enter the valid Incident id';
            return res.json({
                speech: message,
                displayText: message,
                followupEvent: {
                    "name": "getIncident",
                    "data": {}
                }
            });
        }
    } else {
        let msg = "Can't understand. Please type 'report' to report an incident or 'view' to view the incident";
        return res.json({
            speech: msg,
            displayText: msg,
            source: 'reportIncidentBot'
        });
    }
});
