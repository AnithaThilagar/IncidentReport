'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const apiai = require('apiai');

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
        console.log('Inside Welcome intent');
        /*let msg = 'Hi welcome';
        return res.json({
            speech: msg,
            displayText: msg,
            source: 'reportIncidentBot'
        });*/
        var facebookResponse = {
            "speech": "",
            "displayText": " Your Ticket has been booked",
            "data": {
                "facebook": {
                    "attachment": {
                        "type": "template",
                        "payload": {
                            "template_type": "generic",
                            "elements": [
                                {
                                    "title": "Booking Successful",
                                    "subtitle": "Your Ticket has been booked",
                                    "buttons": [
                                        {
                                            "type": "postback",
                                            "title": "Book Another Ticket",
                                            "payload": "book_ticket"
                                        },
                                        {
                                            "type": "postback",
                                            "title": "Contact Us",
                                            "payload": "contact_us"
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                }
            },
            "source": "DuckDuckGo"
        };
        return facebookResponse;
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