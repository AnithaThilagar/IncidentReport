'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const apiai = require('apiai');
const GlideRecord = require('servicenow-rest').gliderecord;
var record = new GlideRecord('dev18442', 'incident', '33238', 'abc123', 'v1');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(process.env.PORT || 5000, () => {
    console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

const apiaiApp = apiai("1c5c2bd1f8b548b18f3782ca17420f2c");

let userData = {};

var testOptions = {
    method: 'POST',
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
});

//To handle the response to bot
app.post('/ai', (req, res) => {
    if (req.body.result.action === 'input.welcome') {
        userData = {};
        return res.json(welcomeIntent());
    } else if (req.body.result.action === 'reportIncident') {
        return res.json(incidentCategory());
    } else if (req.body.result.action === 'incident-category') {
        userData = {};
        userData.category = req.body.result.parameters["incidentCategory"];
        return res.json(incidentSubCategory(userData.category.toLowerCase()));
    } else if (req.body.result.action === 'incident-subcategory') {
        userData.description = req.body.result.parameters["description"];
        userData.subCategory = req.body.result.parameters["subcategory"];
        if (typeof userData.category == "undefined") {
            userData.category = userData.subCategory == "New Device" || userData.subCategory == "Damaged Device" || userData.subCategory == "Replace Device" ? "Hardware" : "Software";
        }
        return res.json(incidentUrgencyType());
    } else if (req.body.result.action === 'IncidentSubcategory.IncidentSubcategory-modeOfContact') {
        userData.urgencyType = req.body.result.parameters["urgencyType"].toLowerCase() == 'high' ? 1 : req.body.result.parameters["urgencyType"].toLowerCase() == 'medium'
            ? 2 : 3; //Set the urgency type based on the selected value
        return res.json(incidentModeOfContact());
    } else if (typeof userData.category != "undefined" && (req.body.result.action === 'getPhoneNumber' || req.body.result.action === 'getMailId')) {    
        userData.modeOfContact = req.body.result.parameters["modeOfContact"];
        console.log("Mode of Contact " + userData.modeOfContact);
        userData.contactDetails = req.body.result.action === 'getPhoneNumber' ? req.body.result.parameters["phone-number"] : req.body.result.parameters["email"];
        if (req.body.result.action === 'getPhoneNumber') {
            console.log(req.body.result.parameters["phone-number"]);
            if (req.body.result.parameters["phone-number"] != ""){
                if (req.body.result.parameters["phone-number"].match(/^(\+\d{1,3}[- ]?)?\d{10}$/) && !(req.body.result.parameters["phone-number"].match(/0{5,}/))) {
                    console.log("Phone Num " + req.body.result.parameters["phone-number"]);
                    saveIncident(res);
                } else {
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
            if (re.test(req.body.result.parameters["email"])){
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
            let regNumber = /^[a-zA-Z]+$/;
            if (regNumber.test(req.body.result.parameters["incidentId"])) {
                getIncidentDetails(res, req.body.result.parameters["incidentId"]);
            } else {
                getIncidentDetails(res, "INC"+req.body.result.parameters["incidentId"]);
            }
            
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

//To send the welcome message for the bot as the button
function welcomeIntent() {    
    /*return {
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
    };*/
    return {
        speech: '',
        displayText: '',
        messages: [
            {
                "type": 0,
                "platform": "facebook",
                "speech": "Hi, I am Report It Bot. <br> I can help you with the following.\n 1) To report an incident in your organization \n 2) To view the status of the incidents \n 3) Add comments to the incidents \n Please select any one of the following to continue"
            },
            {
                "type": 1,
                "platform": "facebook",
                "title": "Report It",
                "subtitle": "Report It - To sort it",
                "imageUrl": "https://mgtvwlns.files.wordpress.com/2015/05/reportit-logo5b35d.jpg",
                "buttons": [
                    {
                        "text": "Report Incident",
                        "postback": "Report Incident"
                    },
                    {
                        "text": "My Incident",
                        "postback": "My Incident"
                    }
                ]
            }
        ]
    };
}

//To send the incident category as quick replies
function incidentCategory() {
    return {
        speech: '',
        displayText: "Hi, welcome to incident Report Bot",
        data: {
            "facebook": {
                "text": "Please select any one category",
                "quick_replies": [
                    {
                        "content_type": "text",
                        "title": "Hardware",
                        "payload": "hardware"
                    },
                    {
                        "content_type": "text",
                        "title": "Software",
                        "payload": "software"
                    }
                ]
            }
        },
        source: 'reportIncidentBot'
    };
}

//To send the sub category for the value for the incident category selected as list
function incidentSubCategory(category) {
    if (category == 'hardware') {
        return {
            speech: '',
            displayText: "Hi, welcome to incident Report Bot",
            data: {
                "facebook": {
                    "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type": "list",
                            "top_element_style": "large",
                            "elements": [
                                {
                                    "title": "Device Request",
                                    "image_url": "https://cdn3.iconfinder.com/data/icons/phones-set-2/512/27-512.png",
                                    "subtitle": "For requesting new device",
                                    "buttons": [
                                        {
                                            "type": "postback",
                                            "title": "New Device",
                                            "payload": "new_device"
                                        }
                                    ]
                                },
                                {
                                    "title": "Damaged Device",
                                    "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxod-I0fuatggTIxbnHFELF6y62zwXkrzthtoVAWOmOwNQuPJusw",
                                    "subtitle": "To report if the device is damaged",
                                    "buttons": [
                                        {
                                            "type": "postback",
                                            "title": "Damaged Device",
                                            "payload": "damaged_device"
                                        }
                                    ]
                                },
                                {
                                    "title": "Replace Device",
                                    "image_url": "https://cdn3.iconfinder.com/data/icons/finance-and-money-1/512/arrows_currency_exchange_direction_flat_icon-512.png",
                                    "subtitle": "To replace the existing device",
                                    "buttons": [
                                        {
                                            "type": "postback",
                                            "title": "Replace Device",
                                            "payload": "replace_device"
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                }
            }
        };
    } else if (category == 'software') {
        return {
           speech: '',
           displayText: "Hi, welcome to incident Report Bot",
           data: {
                "facebook": {
                    "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type": "list",
                            "top_element_style": "large",
                            "elements": [
                                {
                                    "title": "Software Installation",
                                    "image_url": "http://cmpg.unibe.ch/software/BayeScan/images/Download-icon.png",
                                    "subtitle": "For installing new software",
                                    "buttons": [
                                        {
                                            "type": "postback",
                                            "title": "Software Installation",
                                            "payload": "software_installation"
                                        }
                                    ]
                                },
                                {
                                    "title": "Problem with installed software",
                                    "image_url": "https://cdn0.iconfinder.com/data/icons/connection/512/icon-14.png",
                                    "subtitle": "To report if any problem in the software",
                                    "buttons": [
                                        {
                                            "type": "postback",
                                            "title": "Software Problem",
                                            "payload": "software_problem"
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                }
           }
        };
    } else {
        let msg = "Others";
        return res.json({
            speech: msg,
            displayText: msg,
            source: 'reportIncidentBot'
        });
    }
    
}

//To send the urgency type for the incidents as quick replies
function incidentUrgencyType() {
    return {
        speech: '',
        displayText: "Hi, welcome to incident Report Bot",
        data: {
            "facebook": {
                "text": "Please select any one urgency or type skip to proceed",
                "quick_replies": [
                    {
                        "content_type": "text",
                        "title": "High",
                        "payload": "High"
                    },
                    {
                        "content_type": "text",
                        "title": "Medium",
                        "payload": "Medium"
                    },
                    {
                        "content_type": "text",
                        "title": "Low",
                        "payload": "Low"
                    }
                ]
            }
        },
        source: 'reportIncidentBot'
    };
}

//To send the mode of contact as quick replies
function incidentModeOfContact() {
    return {
        speech: '',
        displayText: "Hi, welcome to incident Report Bot",
        data: {
            "facebook": {
                "text": "Please select any one mode of contact",
                "quick_replies": [
                    {
                        "content_type": "text",
                        "title": "Phone",
                        "payload": "Phone"
                    },
                    {
                        "content_type": "text",
                        "title": "Email",
                        "payload": "Email"
                    }
                ]
            }
        },
        source: 'reportIncidentBot'
    };
}

//To send the contact details as text
function incidentContactDetails(contactType) {
    let msg = '';
    if (contactType == 'phone') {
        msg = 'Please enter the Phone number';
    } else {
        msg = 'Please enter the mail Id';
    }
    return {
        speech: msg,
        displayText: msg,
        source: 'reportIncidentBot'
    };
}

//To save the incident using the servicenow API
function saveIncident(res) {
    var obj = {
        category: userData.category,
        subcategory: userData.subCategory,
        urgency: userData.urgencyType,
        contact_type: userData.contactDetails,
        short_description: userData.description
    };
    //To insert the incident details
    record.insert(obj).then(function (response) {
        console.log("Incident Id is " + response.number);
        let message = ' Your incident is noted. We will let you know after completing. Please note this Id - ' + response.number + ' for further reference ';
        return res.json({
            speech: message,
            displayText: message,
            source: 'reportIncidentBot'
        });
    }).catch(function (error) {
        console.log("Error in result "+error);
        return res.json({
            speech: error,
            displayText: error,
            source: 'reportIncidentBot'
        });
    });
}

//To get the incident details using the incident Id
function getIncidentDetails(res, incidentId) {
	try{
		console.log("Inside get incident");
		request({
			url: 'https://dev18442.service-now.com/api/now/v1/table/incident?number=' + incidentId,
			headers: { 'Authorization' : 'Basic MzMyMzg6YWJjMTIz' },
			method: 'GET'
		}, (error, response) => {
			let incidentDetails = '';
			if (!error && response.statusCode == 200) {
                let incidentJson = JSON.parse(response.body);

                let incidentStatus = incidentJson.result[0].incident_state == '1' ? 'New' : incidentJson.result[0].incident_state == '2' ? 'In Progress' :
                    incidentJson.result[0].incident_state == '3' ? 'On Hold' : incidentJson.result[0].incident_state == '4' ? 'Resolved' :
                        incidentJson.result[0].incident_state == '5' ? 'Closed' : 'Cancelled';

                let reasonForHold = incidentJson.result[0].incident_state == '3' ? incidentJson.result[0].hold_reason == '1' ? 'Awaiting Caller' :
                    incidentJson.result[0].hold_reason == '2' ? 'Awaiting Evidence' : incidentJson.result[0].hold_reason == '3' ? 'Awaiting Problem Resolution' : 'Awaiting Vendor' : ''; 

                incidentDetails = "Please find the incident details below \n 1) Incident Id - " + incidentJson.result[0].number +
                    "\n 2) Category - " + incidentJson.result[0].category + " \n 3) Description - " + incidentJson.result[0].short_description +
                    "\n 4) Urgency - " + (incidentJson.result[0].urgency == '1' ? 'High' : incidentJson.result[0].urgency == '2' ? 'Medium' : 'Low') +
                    "\n 5) Status - " + incidentStatus + (reasonForHold != '' ? "\n 6) Reason For Hold - " + reasonForHold : ''); 

                return res.json({
                    speech: incidentDetails,
                    displayText: incidentDetails,
                    source: 'reportIncidentBot'
                });
            } else if (response.statusCode == 404){
                incidentDetails = 'There is no incident with the given id';
                return res.json({
                    speech: incidentDetails,
                    displayText: incidentDetails,
                    source: 'reportIncidentBot'
                });
            } else {
				console.log(error);
                incidentDetails = 'Try again later';
                return res.json({
                    speech: incidentDetails,
                    displayText: incidentDetails,
                    source: 'reportIncidentBot'
                });
			}
		});
	} catch(e){
		console.log("Exception in getIncidentDetails "+e);
	}
}

