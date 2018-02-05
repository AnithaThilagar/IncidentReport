'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const apiai = require('apiai');
const GlideRecord = require('servicenow-rest').gliderecord;
var record = new GlideRecord('dev18442', 'incident', '33238', 'abc123', 'v1');
console.log('Record ' + JSON.stringify(record));

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
    console.log('*** Inside service now request ***');
    console.log(req.body.result);
    if (req.body.result.action === 'input.welcome') {
        console.log('Inside Welcome');       
        return res.json(welcomeIntent());
    } else if (req.body.result.action === 'reportIncident') {
        console.log('Inside report incident');
        return res.json(incidentCategory());
    } else if (req.body.result.action === 'incident-category') {
        userData.category = req.body.result.resolvedQuery;
        console.log('Inside incident sub category');
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
    } else if (req.body.result.action === 'incidentCreation') {
        userData.contactDetails = req.body.result.resolvedQuery;
        return res.json(saveIncident());
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
                    },
                    {
                        "content_type": "text",
                        "title": "Others",
                        "payload": "others"
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
                    "text": "Please select any one sub-category",
                    "quick_replies": [
                        {
                            "content_type": "text",
                            "title": "New Device",
                            "payload": "New Device"
                        },
                        {
                            "content_type": "text",
                            "title": "Damaged Device",
                            "payload": "Damaged Device"
                        },
                        {
                            "content_type": "text",
                            "title": "Replace Device",
                            "payload": "Replace Device"
                        }
                    ]
                }
            },
            source: 'reportIncidentBot'
        }; 
    } else if (category == 'software') {
        return {
           speech: '',
           displayText: "Hi, welcome to incident Report Bot",
           data: {
                "facebook": {
                    "text": "Please select any one sub-category",
                    "quick_replies": [
                        {
                            "content_type": "text",
                            "title": "Software Installation",
                            "payload": "Software Installation"
                        },
                        {
                            "content_type": "text",
                            "title": "Problem with Installed Software",
                            "payload": "Problem with Installed Software"
                        }
                    ]
                }
           },
           source: 'reportIncidentBot'
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

//To handle the urgency type for the incidents
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

//To handle the mode of contact
function incidentModeOfContact() {
    return {
        speech: '',
        displayText: "Hi, welcome to incident Report Bot",
        data: {
            "facebook": {
                "text": "Please select any one urgency or type skip to proceed",
                "quick_replies": [
                    {
                        "content_type": "text",
                        "title": "Mobile Number",
                        "payload": "High"
                    },
                    {
                        "content_type": "text",
                        "title": "Mail",
                        "payload": "Medium"
                    }
                ]
            }
        },
        source: 'reportIncidentBot'
    };
}

//To handle the contact details
function incidentContactDetails(contactType) {
    if (contactType == 'mobile number') {
        let msg = 'Please enter the mobile number';
    } else {
        let msg = 'Please enter the mail Id';
    }
    return res.json({
        speech: msg,
        displayText: msg,
        source: 'reportIncidentBot'
    });
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
        return res.json({
            speech: response,
            displayText: response,
            source: 'reportIncidentBot'
        });
    }).catch(function (error) {
        console.log(error);
        return res.json({
            speech: error,
            displayText: error,
            source: 'reportIncidentBot'
        });
    });
}

/*return {
        "facebook": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [
                        {
                            "title": "New Device",
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
                            "subtitle": "To report the device is damaged",
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
                            "subtitle": "For replacing the device",
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
    };*/