'use strict';

const express = require('express'),
    bodyParser = require('body-parser'),
    apiai = require('apiai'),
    config = require('./config'),
    facebook = require('./facebook'),
    serviceNow = require('./serviceNow'),
    DialogflowApp = require('actions-on-google').DialogflowApp,
    googleAssistant = require('./google'),
    slack = require('./slack');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(process.env.PORT || 5000, () => {
    console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

let userData = {};

//To handle the response to bot
app.post('/ai', (req, res) => {
    console.log("Inside the API handle ");
    console.log(req);
    let source = '';
    if (typeof req.body.originalRequest != "undefined") {
        console.log(req.body.originalRequest.source);
        source = req.body.originalRequest.source;
    } else {
        console.log('Req from other sources');
    }
    handleRequest(req, res, source);
});

//To handle the request from the Dialogflow
function handleRequest(req, res, platform) {
    console.log("Inside the handleFacebook");
    let source = require('./' + platform);
    const assistant = new DialogflowApp({ request: req, response: res });
    if (req.body.result.action === 'input.welcome') {
        console.log('Inside welcome intent');
        userData = {};
        if (platform == 'google') {
            googleAssistant.welcomeIntent(assistant);
        } else {
            return res.json(source.welcomeIntent());
        }
    } else if (req.body.result.action === 'reportIncident') {
        if (platform == 'google') {
            googleAssistant.incidentCategory(assistant);
        } else {
            return res.json(source.incidentCategory());
        }
    } else if (req.body.result.action === 'incident-category') {
        userData = {};
        userData.category = req.body.result.parameters["incidentCategory"];
        if (platform == 'google') {
            googleAssistant.incidentSubCategory(assistant, userData.category.toLowerCase());
        } else {
            return res.json(source.incidentSubCategory(userData.category.toLowerCase()));
        }
    } else if (req.body.result.action === 'IncidentCategory.IncidentCategory-custom') {
        console.log('--Incident options trigger-- ');
        userData.subCategory = assistant.getSelectedOption();
        let options = {
            "name": "subcategory",
            "data": {}
        };
        return res.json(source.triggerEvent(assistant, '', options));
    } else if (req.body.result.action === 'IncidentCategory.IncidentCategory-fallback') {
        console.log('Other than the given option is selected ');
    } else if (req.body.result.action === 'incident-subcategory') {
        userData.description = req.body.result.parameters["description"];
        userData.subCategory = req.body.result.parameters["subcategory"];
        if (typeof userData.category == "undefined") {
            userData.category = userData.subCategory == "New Device" || userData.subCategory == "Damaged Device" || userData.subCategory == "Replace Device" ? "Hardware" : "Software";
        }
        if (platform == 'google') {
            googleAssistant.incidentUrgencyType(assistant);
        } else {
            return res.json(source.incidentUrgencyType());
        }
    } else if (req.body.result.action === 'IncidentSubcategory.IncidentSubcategory-modeOfContact') {
        userData.urgencyType = req.body.result.parameters["urgencyType"].toLowerCase() == 'high' ? 1 : req.body.result.parameters["urgencyType"].toLowerCase() == 'medium'
            ? 2 : 3; //Set the urgency type based on the selected value
        if (platform == 'google') {
            googleAssistant.incidentModeOfContact(assistant);
        } else {
            return res.json(source.incidentModeOfContact());
        }
    } else if (typeof userData.category != "undefined" && (req.body.result.action === 'getPhoneNumber' || req.body.result.action === 'getMailId')) {
        userData.modeOfContact = req.body.result.parameters["modeOfContact"];
        console.log("Mode of Contact " + userData.modeOfContact);
        userData.contactDetails = req.body.result.action === 'getPhoneNumber' ? req.body.result.parameters["phone-number"] : req.body.result.parameters["email"];
        if (req.body.result.action === 'getPhoneNumber') {
            console.log(req.body.result.parameters["phone-number"]);
            if (req.body.result.parameters["phone-number"] != "") {
                if (req.body.result.parameters["phone-number"].match(/^(\+\d{1,3}[- ]?)?\d{10}$/) && !(req.body.result.parameters["phone-number"].match(/0{5,}/))) {
                    console.log("Phone Num " + req.body.result.parameters["phone-number"]);
                    serviceNow.saveIncident(res, userData).then((response) => {
                        let message = ' Your incident is noted. We will let you know after completing. Please note this Id - ' + response.number + ' for further reference ';
                        if (platform == 'google') {
                            googleAssistant.incidentDetails(assistant, response.number);
                        } else {
                            return res.json(source.getTextResponse(message));
                        }
                    }).catch((error) => {
                        let message = 'Unable to save the incident. Try again later';
                        if (platform == 'google') {
                            googleAssistant.getTextResponse(assistant, message);
                        } else {
                            return res.json(source.getTextResponse(message));
                        }
                    });
                } else {
                    console.log("Inside else");
                    let message = 'Please enter the valid phone number';
                    let options = {
                        "name": "getMobile",
                        "data": { "modeOfContact": userData.modeOfContact }
                    };
                    return res.json(source.triggerEvent(message, options));
                }
            }
        } else {
            let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (re.test(req.body.result.parameters["email"])) {
                console.log(req.body.result.parameters["email"]);
                serviceNow.saveIncident(res, userData).then((response) => {
                    let message = ' Your incident is noted. We will let you know after completing. Please note this Id - ' + response.number + ' for further reference ';
                    if (platform == 'google') {
                        googleAssistant.getTextResponse(assistant, message);
                    } else {
                        return res.json(source.getTextResponse(message));
                    }
                }).catch((error) => {
                    let message = 'Unable to save the incident. Try again later';
                    if (platform == 'google') {
                        googleAssistant.getTextResponse(assistant, message);
                    } else {
                        return res.json(source.getTextResponse(message));
                    }
                });
            } else {
                let message = 'Please enter the valid mail Id';
                let options = {
                    "name": "getMail",
                    "data": { "modeOfContact": userData.modeOfContact }
                };
                return res.json(source.triggerEvent(message, options));
            }
        }
    } else if (req.body.result.action === 'getIncident') {
        let reg = /[A-Z]{3}\d{7}/i;
        if (reg.test(req.body.result.parameters["incidentId"]) && req.body.result.parameters["incidentId"].trim().length == 10) {
            console.log("Incident Id " + req.body.result.parameters["incidentId"].trim());
            serviceNow.getIncidentDetails(res, req.body.result.parameters["incidentId"].trim()).then((response) => {
                let message = '';
                if (response == '') {
                    message = 'There is no incident found with the given incident Id';
                    if (platform == 'google') {
                        googleAssistant.getTextResponse(assistant, message);
                    } else {
                        return res.json(source.getTextResponse(message));
                    }
                } else {
                    message = ' Your incident is noted. We will let you know after completing. Please note this Id - ' + response.number + ' for further reference ';
                    if (platform == 'google') {
                        googleAssistant.sendIncidentDetails(assistant, response);
                    } else {
                        return res.json(source.sendIncidentDetails(response));
                    }
                }
            }).catch((error) => {
                console.log(error);
                let message = "Cannot get the incident details. Try again later";
                if (platform == 'google') {
                    googleAssistant.getTextResponse(assistant, message);
                } else {
                    return res.json(source.getTextResponse(message));
                }
            });
        } else {
            let message = 'Please enter the valid Incident Id';
            let options = {
                "name": "getIncident",
                "data": {}
            };
            return res.json(source.triggerEvent(message, options));
        }
    } else {
        let msg = "Can't understand. Please type 'report' to report an incident or 'view' to view the incident";
        if (platform == 'google') {
            googleAssistant.getTextResponse(assistant, msg);
        } else {
            return res.json(source.getTextResponse(msg));
        }
    }
}

/*function handleFacebook(req, res) {
    console.log("Inside the handleFacebook");
    if (req.body.result.action === 'input.welcome') {
        console.log('Inside welcome intent');
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
                    serviceNow.saveIncident(res, userData).then((response) => {
                        let message = ' Your incident is noted. We will let you know after completing. Please note this Id - ' + response.number + ' for further reference ';
                        return res.json({
                            speech: message,
                            displayText: message,
                            source: 'reportIncidentBot'
                        });
                    }).catch((error) => {
                        return res.json({
                            speech: 'Try again later',
                            displayText: 'Try again later',
                            source: 'reportIncidentBot'
                        });
                    });
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
                serviceNow.saveIncident(res, userData).then((response) => {
                    let message = ' Your incident is noted. We will let you know after completing. Please note this Id - ' + response.number + ' for further reference ';
                    return res.json({
                        speech: message,
                        displayText: message,
                        source: 'reportIncidentBot'
                    });
                }).catch((error) => {
                    return res.json({
                        speech: 'Try again later',
                        displayText: 'Try again later',
                        source: 'reportIncidentBot'
                    });
                });
            } else {
                let message = 'Please enter the valid mail Id';
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
            serviceNow.getIncidentDetails(res, req.body.result.parameters["incidentId"]).then((response) => {
                facebook.sendIncidentDetails(response);
            }).catch((error) => {
                console.log(error);
                let text = "Cannot get the incident details. Try again later";
                facebook.getTextResponse(text);
            });
        } else {
            let message = 'Please enter the valid Incident Id';
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
        facebook.getTextResponse(msg);
    }
}*/

//To handle the google response
function handleGoogleResponse(req, res) {
    console.log("Inside the handleGoogleResponse");
    const assistant = new DialogflowApp({ request: req, response: res });
    console.log("Before GA---");
    if (req.body.result.action === 'input.welcome') {
        userData = {};
        googleAssistant.welcomeIntent(assistant);
    } else if (req.body.result.action === 'reportIncident') {
        googleAssistant.incidentCategory(assistant);
    } else if (req.body.result.action === 'incident-category') {
        userData = {};
        userData.category = req.body.result.parameters["incidentCategory"];
        console.log("Cat-- " + req.body.result.parameters["incidentCategory"]);
        googleAssistant.incidentSubCategory(assistant, userData.category.toLowerCase());
    } else if (req.body.result.action === 'IncidentCategory.IncidentCategory-custom') {
        console.log('--Incident options trigger-- ');
        userData.subCategory = assistant.getSelectedOption();
        return res.json({
            speech: '',
            displayText: '',
            followupEvent: {
                "name": "subcategory",
                "data": {}
            }
        });
    } else if (req.body.result.action === 'IncidentCategory.IncidentCategory-fallback') {
        console.log('Other than the given option is selected ');
    } else if (req.body.result.action === 'incident-subcategory') {
        console.log('Incident options trigger ');
        console.log(assistant.getSelectedOption());
        console.log('Sub cat ' + req.body.result.parameters["subcategory"]);
        userData.description = req.body.result.parameters["description"];
        if (req.body.result.parameters["subcategory"] != '' && typeof req.body.result.parameters["subcategory"] != "undefined") {
            userData.subCategory = req.body.result.parameters["subcategory"];
        }
        if (typeof userData.category == "undefined") {
            userData.category = userData.subCategory == "New Device" || userData.subCategory == "Damaged Device" || userData.subCategory == "Replace Device" ? "Hardware" : "Software";
        }
        googleAssistant.incidentUrgencyType(assistant);
    } else if (req.body.result.action === 'IncidentSubcategory.IncidentSubcategory-modeOfContact') {
        userData.urgencyType = req.body.result.parameters["urgencyType"].toLowerCase() == 'high' ? 1 : req.body.result.parameters["urgencyType"].toLowerCase() == 'medium'
            ? 2 : 3; //Set the urgency type based on the selected value
        googleAssistant.incidentModeOfContact(assistant);
    } else if (typeof userData.category != "undefined" && (req.body.result.action === 'getPhoneNumber' || req.body.result.action === 'getMailId')) {
        userData.modeOfContact = req.body.result.parameters["modeOfContact"];
        console.log("Mode of Contact " + userData.modeOfContact);
        userData.contactDetails = req.body.result.action === 'getPhoneNumber' ? req.body.result.parameters["phone-number"] : req.body.result.parameters["email"];
        if (req.body.result.action === 'getPhoneNumber') {
            console.log(req.body.result.parameters["phone-number"]);
            if (req.body.result.parameters["phone-number"] != "") {
                if (req.body.result.parameters["phone-number"].match(/^(\+\d{1,3}[- ]?)?\d{10}$/) && !(req.body.result.parameters["phone-number"].match(/0{5,}/))) {
                    console.log("Phone Num " + req.body.result.parameters["phone-number"]);
                    serviceNow.saveIncident(res, userData).then((response) => {
                        googleAssistant.incidentDetails(assistant, response.number);
                    }).catch((err) => {
                        googleAssistant.defaultResponse(assistant);
                    });
                } else {
                    console.log("Inside else");
                    let message = 'Please enter the valid phone number';
                    googleAssistant.helpResponse(assistant);
                }
            }
        } else {
            let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (re.test(req.body.result.parameters["email"])) {
                console.log(req.body.result.parameters["email"]);
                serviceNow.saveIncident(res, userData).then((response) => {
                    googleAssistant.incidentDetails(assistant, response.number);
                }).catch((err) => {
                    googleAssistant.defaultResponse(assistant);
                });
            } else {
                let message = 'Please enter the valid mail Id';
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
            let message = 'Please enter the valid Incident Id';
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
}

/*let actionMap = new Map();
    actionMap.set('input.welcome', googleAssistant.welcomeIntent);
    actionMap.set('reportIncident', googleAssistant.incidentCategory);
    actionMap.set('incident-category', googleAssistant.incidentSubCategory);
    assistant.handleRequest(actionMap);*/