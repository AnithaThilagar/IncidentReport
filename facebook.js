//To handle the responses for facebook
var facebook = {
    //To send the welcome message for the bot as the card
    //"url": "https://report-it.auth0.com/login?client=4hm1dkhFoPFwBkCHYdvHqD2uAMtWdsKK"
    //"url": "https://report-incident-bot.herokuapp.com/login"
    welcomeIntent: function () {
		return {
            speech: '',
            displayText: '',
            messages: [
                {
                    "type": 0,
                    "platform": "facebook",
                    "speech": "Hi, I am Report It Bot. \n I can help you with the following.\n 1) To report an incident in your organization \n 2) To view the status of the incidents \n 3) Add comments to the incidents \n Please login to your google account"
                },
                {
                    "type": 4,
                    "platform": "facebook",
                    "payload": {
                        "facebook": {
                            "attachment": {
                                "type": "template",
                                "payload": {
                                    "template_type": "generic",
                                    "elements": [
                                        {
                                            "title": "Google",
                                            "image_url": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Google-plus-circle-icon-png.png",
                                            "buttons": [
                                                {
                                                    "type": "account_link",
                                                    "url": "https://report-it.auth0.com/login?client=4hm1dkhFoPFwBkCHYdvHqD2uAMtWdsKK"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    }
                }
            ]
        };
        /*return {
            speech: '',
            displayText: '',
            messages: [
                {
                    "type": 4,
                    "platform": "facebook",
                    "payload": {
                        "facebook": {
                            "attachment": {
                                "type": "template",
                                "payload": {
                                    "template_type": "generic",
                                    "elements": [
                                        {
                                            "title": "Google",
                                            "image_url": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Google-plus-circle-icon-png.png",
                                            "buttons": [
                                                {
                                                    "type": "account_link",
                                                    "url": "https://report-incident-bot.herokuapp.com/login"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    }
                }
            ]
        };*/
        /*return {
            speech: '',
            displayText: '',
            messages: [
                {
                    "type": 0,
                    "platform": "facebook",
                    "speech": "Hi, I am Report It Bot. \n I can help you with the following.\n 1) To report an incident in your organization \n 2) To view the status of the incidents \n 3) Add comments to the incidents \n Please select any one of the following to continue"
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
        };*/
    },
	//To send the options after login
	sendOptions: function(userName){
		return {
            speech: '',
            displayText: '',
            messages: [
                {
                    "type": 0,
                    "platform": "facebook",
                    "speech": "Hi "+userName+", Please select any one of the following to continue"
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
	},
    //To send the incident category as quick replies
    incidentCategory: function () {
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
    },
    //To send the sub category for the value for the incident category selected as list
    incidentSubCategory: function (category) {
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

    },
    //To send the urgency type for the incidents as quick replies
    incidentUrgencyType: function () {
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
    },
    //To send the mode of contact as quick replies
    incidentModeOfContact: function () {
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
    },
    //To send the incident details as text
    sendIncidentDetails: function (response) {
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

        return {
            speech: 'Please find the incident details',
            displayText: incidentDetails,
            source: 'reportIncidentBot'
        };
    },
    //To send the text response with the given text
    getTextResponse: function (text) {
        return {
            speech: text,
            displayText: text,
            source: 'reportIncidentBot'
        };
    },
    //To trigger the events with the given text and event parameters
    triggerEvent: function (text, eventObject) {
        return {
            speech: text,
            displayText: text,
            followupEvent: eventObject
        };
    }
};

//For buttons
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

//For generic templates
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

module.exports = facebook;