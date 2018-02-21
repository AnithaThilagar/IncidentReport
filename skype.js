//To handle the responses for skype
var skype = {
    //To send the welcome message for the bot as the card
    welcomeIntent: function () {
        return {
            speech: '',
            displayText: '',
            messages: [
                {
                    "type": 0,
                    "platform": "skype",
                    "speech": "Hi, I am Report It Bot. \n I can help you with the following.\n 1) To report an incident in your organization \n 2) To view the status of the incidents \n 3) Add comments to the incidents \n Please select any one of the following to continue"
                },
                {
                    "type": 1,
                    "platform": "skype",
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
    //To send the incident category as hero card
    incidentCategory: function () {
        return {
            speech: '',
            displayText: "Hi, welcome to incident Report Bot",
            data: {
			  "skype": {
				  "type": "message",
				  "attachmentLayout": "list",
				  "text": "",
				  "attachments": [
					{
					  "contentType": "application/vnd.microsoft.card.hero",
					  "content": {
						"text": "Please select any one category",
						"buttons": [
						  {
							"type": "imBack",
							"title": "Hardware",
							"value": "hardware"
						  },
						  {
							"type": "imBack",
							"title": "Software",
							"value": "software"
						  }
						]
					  }
					}
				  ]
				}
			}
        };
    },
    //To send the sub category for the value for the incident category selected as carousel
    incidentSubCategory: function (category) {
        //Hero card
        if (category == 'hardware') {
            return {
                speech: '',
                displayText: "Hi, welcome to incident Report Bot",
                data: {
                    "skype": {
                        "type": "message",
                        "attachmentLayout": "carousel",
                        "text": "Please select the sub category",
                        "attachments": [
                            {
                                "contentType": "application/vnd.microsoft.card.hero",
                                "content": {
                                    "title": "New Device",
                                    "subtitle": "For requesting new device",
                                    "images": [
                                        {
                                            "url": "https://cdn3.iconfinder.com/data/icons/phones-set-2/512/27-512.png"
                                        }
                                    ],
                                    "buttons": [
                                        {
                                            "type": "imBack",
                                            "title": "New Device",
                                            "value": "New Device"
                                        }
                                    ]
                                }
                            },
                            {
                                "contentType": "application/vnd.microsoft.card.hero",
                                "content": {
                                    "title": "Damaged Device",
                                    "subtitle": "To report if the device is damaged",
                                    "images": [
                                        {
                                            "url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxod-I0fuatggTIxbnHFELF6y62zwXkrzthtoVAWOmOwNQuPJusw"
                                        }
                                    ],
                                    "buttons": [
                                        {
                                            "type": "imBack",
                                            "title": "Damaged Device",
                                            "value": "Damaged Device"
                                        }
                                    ]
                                }
                            },
                            {
                                "contentType": "application/vnd.microsoft.card.hero",
                                "content": {
                                    "title": "Replace Device",
                                    "subtitle": "To replace the existing device",
                                    "images": [
                                        {
                                            "url": "https://cdn3.iconfinder.com/data/icons/finance-and-money-1/512/arrows_currency_exchange_direction_flat_icon-512.png"
                                        }
                                    ],
                                    "buttons": [
                                        {
                                            "type": "imBack",
                                            "title": "Replace Device",
                                            "value": "Replace Device"
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
            };
        } else if (category == 'software') {
            //Thumbnail card
            return {
                speech: '',
                displayText: "Hi, welcome to incident Report Bot",
                data: {
                    "skype": {
                        "type": "message",
                        "attachmentLayout": "carousel",
                        "text": "Please select the sub category",
                        "attachments": [
                            {
                                "contentType": "application/vnd.microsoft.card.thumbnail",
                                "content": {
                                    "title": "Software Installation",
                                    "subtitle": "For installing new software",
                                    "images": [
                                        {
                                            "url": "http://cmpg.unibe.ch/software/BayeScan/images/Download-icon.png"
                                        }
                                    ],
                                    "buttons": [
                                        {
                                            "type": "imBack",
                                            "title": "Software Installation",
                                            "value": "Software Installation"
                                        }
                                    ]
                                }
                            },
                            {
                                "contentType": "application/vnd.microsoft.card.thumbnail",
                                "content": {
                                    "title": "Problem with installed software",
                                    "subtitle": "To report if any problem in the software",
                                    "images": [
                                        {
                                            "url": "https://cdn0.iconfinder.com/data/icons/connection/512/icon-14.png"
                                        }
                                    ],
                                    "buttons": [
                                        {
                                            "type": "imBack",
                                            "title": "Software Problem",
                                            "value": "Software Problem"
                                        }
                                    ]
                                }
                            }
                        ]
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
    //To send the urgency type for the incidents as hero card
    incidentUrgencyType: function () {
        return {
            speech: '',
            displayText: "Hi, welcome to incident Report Bot",
            data: {
                "skype": {
                    "type": "message",
                    "attachmentLayout": "list",
                    "text": "",
                    "attachments": [
                        {
                            "contentType": "application/vnd.microsoft.card.hero",
                            "content": {
                                "text": "Please select any one urgency or type skip to proceed",
                                "buttons": [
                                    {
                                        "type": "imBack",
                                        "title": "High",
                                        "value": "High"
                                    },
                                    {
                                        "type": "imBack",
                                        "title": "Medium",
                                        "value": "Medium"
                                    },
                                    {
                                        "type": "imBack",
                                        "title": "Low",
                                        "value": "Low"
                                    }
                                ]
                            }
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
                "skype": {
                    "type": "message",
                    "attachmentLayout": "list",
                    "text": "",
                    "attachments": [
                        {
                            "contentType": "application/vnd.microsoft.card.hero",
                            "content": {
                                "text": "Please select any one mode of contact",
                                "buttons": [
                                    {
                                        "type": "imBack",
                                        "title": "Phone",
                                        "value": "Phone"
                                    },
                                    {
                                        "type": "imBack",
                                        "title": "Email",
                                        "value": "Email"
                                    }
                                ]
                            }
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

module.exports = skype;

//Animation cards
/*{
  "skype": {
    "type": "message",
    "attachmentLayout": "carousel",
    "text": "Please select the sub category",
    "attachments": [
      {
        "contentType": "application/vnd.microsoft.card.animation",
        "content": {
          "title": "Software Installation",
          "subtitle": "For installing new software",
          "media": [
            {
              "url": "https://m.popkey.co/dc9c52/brNN3.gif"
            }
          ]
        }
      }
    ]
  }
}*/