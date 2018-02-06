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

//To handle the response to bot
app.post('/ai', (req, res) => {
    if (req.body.result.action === 'input.welcome') {
        userData = {};
        return res.json(welcomeIntent());
    } else if (req.body.result.action === 'reportIncident') {
        return res.json(incidentCategory());
    } else if (req.body.result.action === 'incident-category') {
        userData = {};
        userData.category = req.body.result.resolvedQuery;
        return res.json(incidentSubCategory(req.body.result.resolvedQuery.toLowerCase()));
    } else if (req.body.result.action === 'incident-subcategory') {
        userData.subCategory = req.body.result.resolvedQuery;
        return res.json(incidentUrgencyType());
    } else if (req.body.result.action === 'IncidentSubcategory.IncidentSubcategory-modeOfContact') {
        userData.urgencyType = req.body.result.resolvedQuery.toLowerCase() == 'high' ? 1 : req.body.result.resolvedQuery.toLowerCase() == 'medium' ? 2 : 3; //Set the urgency type based on the selected value
        return res.json(incidentModeOfContact());
    } else if (req.body.result.action === 'IncidentSubcategory.IncidentSubcategory-modeOfContact.IncidentSubcategory-modeOfContact-getModeOfContact') {
        userData.modeOfContact = req.body.result.resolvedQuery;
        return res.json(incidentContactDetails(req.body.result.resolvedQuery.toLowerCase()));
    } else if (typeof userData.category != "undefined" && (req.body.result.action === 'getPhoneNumber' || req.body.result.action === 'getMailId')) {
        userData.contactDetails = req.body.result.resolvedQuery;
        return res.json(saveIncident());
    } else if (req.body.result.action === 'getIncident') {
        return res.json(getIncidentDetails(req.body.result.parameters["incidentId"]));
    } else {
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
function saveIncident() {
    var obj = {
        category: userData.category,
        subcategory: userData.subCategory,
        urgency: userData.urgencyType,
        contact_type: userData.contactDetails
    };
    //To insert the incident details
    record.insert(obj).then(function (response) {
        console.log(response);
        console.log("Incident Id is "+response.number);
        return {
            speech: response,
            displayText: response,
            source: 'reportIncidentBot'
        }
    }).catch(function (error) {
        console.log("Error in result "+error);
        return {
            speech: error,
            displayText: error,
            source: 'reportIncidentBot'
        }
    });
}

//To get the incident details using the incident Id
function getIncidentDetails(incidentId) {
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
				//console.log(incidentJson.result[0].category);
				incidentDetails = "Incident Number ";// + incidentJson.result[0].number
			} else {
				console.log(error);
				incidentDetails = 'Try again later';
			}
			return {
				speech: incidentDetails,
				displayText: incidentDetails,
				source: 'reportIncidentBot'
			};
		});
	} catch(e){
		console.log("Exception in getIncidentDetails "+e);
	}
}
