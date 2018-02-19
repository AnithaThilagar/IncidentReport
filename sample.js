//To handle the responses for slack
var slack = {
    //To send the welcome message for the bot with text, message buttons and image
    welcomeIntent: function () {
        return {
            speech: '',
            displayText: '',
            "data": {
                "slack": {
                    "text": "Hi, I am Report It Bot. \n I can help you with the following.\n 1) To report an incident in your organization \n 2) To view the status of the incidents \n 3) Add comments to the incidents",
                    "attachments": [
                        {
                            "title": "Report It - To Solve It",
                            "image_url": "https://mgtvwlns.files.wordpress.com/2015/05/reportit-logo5b35d.jpg"
                        },
                        {
                            "fallback": "Please select any one",
                            "title": "Please select any one",
                            "callback_id": "main_menu",
                            "attachment_type": "default",
                            "actions": [
                                {
                                    "name": "Report Incident",
                                    "text": "Report Incident",
                                    "type": "button",
                                    "value": "report incident"
                                },
                                {
                                    "name": "My Incidents",
                                    "text": "My Incidents",
                                    "type": "button",
                                    "value": "my incidents"
                                }
                            ]
                        }
                    ]
                }
            }
        }
    },
    //To send the incident category as message buttons
    incidentCategory: function () {
        return {
            speech: '',
            displayText: "Hi, welcome to incident Report Bot",
            data: {
                "slack": {
                    "attachments": [
                        {
                            "text": "Please select any one category",
                            "fallback": "You are unable to choose a category",
                            "callback_id": "category_menu",
                            "attachment_type": "default",
                            "actions": [
                                {
                                    "name": "catgeory",
                                    "text": "Hardware",
                                    "type": "button",
                                    "value": "hardware"
                                },
                                {
                                    "name": "catgeory",
                                    "text": "Software",
                                    "type": "button",
                                    "value": "software"
                                }
                            ]
                        }
                    ]
                }
            }
        }
    },
    //To send the sub category for the value for the incident category selected as menus and message buttons
    incidentSubCategory: function (category) {
        if (category == 'hardware') {
            return {
                speech: '',
                displayText: "Hi, welcome to incident Report Bot",
                data: {
                    "slack": {
                        "response_type": "in_channel",
                        "attachments": [
                            {
                                "text": "Please select the sub category",
                                "fallback": "Other than the given option",
                                "attachment_type": "default",
                                "callback_id": "subcategory",
                                "actions": [
                                    {
                                        "name": "subcategory",
                                        "text": "Select any one...",
                                        "type": "select",
                                        "options": [
                                            {
                                                "text": "New Device",
                                                "value": "New Device"
                                            },
                                            {
                                                "text": "Damaged Device",
                                                "value": "Damaged Device"
                                            },
                                            {
                                                "text": "Replace Device",
                                                "value": "Replace Device"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                }
            };
        } else {
            return {
                speech: '',
                displayText: "Hi, welcome to incident Report Bot",
                data: {
                    "slack": {
                        "attachments": [
                            {
                                "text": "Please select any one category",
                                "fallback": "You are unable to choose a category",
                                "callback_id": "subcategory",
                                "attachment_type": "default",
                                "actions": [
                                    {
                                        "name": "subcatgeory",
                                        "text": "Software Installation",
                                        "type": "button",
                                        "value": "Software Installation"
                                    },
                                    {
                                        "name": "subcatgeory",
                                        "text": "Software Problem",
                                        "type": "button",
                                        "value": "Software Problem"
                                    }
                                ]
                            }
                        ]
                    }
                }
            }
        }
    },
    //To send the urgency type for the incidents as quick replies
    incidentUrgencyType: function () {
        return {
            speech: '',
            displayText: "Hi, welcome to incident Report Bot",
            data: {
                "slack": {
                    "attachments": [
                        {
                            "text": "Please select any one urgency or type skip to proceed",
                            "fallback": "You are unable to choose a urgency type",
                            "callback_id": "subcategory",
                            "attachment_type": "default",
                            "actions": [
                                {
                                    "name": "urgencyType",
                                    "text": "High",
                                    "type": "button",
                                    "value": "High"
                                },
                                {
                                    "name": "urgencyType",
                                    "text": "Medium",
                                    "type": "button",
                                    "value": "Medium"
                                },
                                {
                                    "name": "urgencyType",
                                    "text": "Low",
                                    "type": "button",
                                    "value": "Low"
                                }
                            ]
                        }
                    ]
                }
            }
        }
    },
    //To send the mode of contact as quick replies
    incidentModeOfContact: function () {
        return {
            speech: '',
            displayText: "Hi, welcome to incident Report Bot",
            data: {
                "slack": {
                    "attachments": [
                        {
                            "text": "Please select any one mode of contact",
                            "fallback": "You are unable to choose a mode of contact",
                            "callback_id": "subcategory",
                            "attachment_type": "default",
                            "actions": [
                                {
                                    "name": "modeOfContact",
                                    "text": "Phone",
                                    "type": "button",
                                    "value": "Phone"
                                },
                                {
                                    "name": "modeOfContact",
                                    "text": "Email",
                                    "type": "button",
                                    "value": "Email"
                                }
                            ]
                        }
                    ]
                }
            }
        }
    },
    //To send the contact details as text
    incidentContactDetails: function (contactType) {
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
};

module.exports = slack;
/*"data": {
                "slack": {
                    "text": "Hi, I am Report It Bot. \n I can help you with the following.\n 1) To report an incident in your organization \n 2) To view the status of the incidents \n 3) Add comments to the incidents",
                    "attachments": [
                        {
                            "image_url": "https://mgtvwlns.files.wordpress.com/2015/05/reportit-logo5b35d.jpg",
                            "thumb_url": "https://mgtvwlns.files.wordpress.com/2015/05/reportit-logo5b35d.jpg",
                            "title": "Report It - To Solve It",
                            "text": "Please select any one",
                            "callback_id": "main_menu",
                            "actions": [
                                {
                                    "name": "mainMenu",
                                    "text": "Report Incident",
                                    "type": "button",
                                    "value": "Report Incident"
                                },
                                {
                                    "name": "mainMenu",
                                    "text": "My Incidents",
                                    "type": "button",
                                    "value": "My Incidents"
                                }
                            ]
                        }
                    ]
                }
            }*/