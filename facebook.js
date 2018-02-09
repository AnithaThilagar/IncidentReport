//To handle the responses for facebook
var facebook = {
    welcomeIntent: function () {
        return {
            speech: '',
            displayText: '',
            messages: [
                {
                    "type": 0,
                    "platform": "facebook",
                    "speech": "<b> Hi, I am Report It Bot.</b> <br/> I can help you with the following.\n 1) To report an incident in your organization \n 2) To view the status of the incidents \n 3) Add comments to the incidents \n Please select any one of the following to continue"
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
};

module.exports = facebook;