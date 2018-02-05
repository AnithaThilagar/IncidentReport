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
    } else if (req.body.result.action === 'ReportIncident.ReportIncident-category') {
        console.log('Inside incident sub category');
        return res.json(incidentSubCategory(req.body.result.resolvedQuery));
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
    return /*{
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
    };*/
    {
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
    };
}

//To send the sub category for the value for the incident category selected as list
function incidentSubCategory(category) {
    return {
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
    };
}