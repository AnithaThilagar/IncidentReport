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

/* For Facebook Validation */
app.get('/incident', (req, res) => {
    if (req.query['hub.mode'] && req.query['hub.verify_token'] === 'incidentBot') {
        res.status(200).send(req.query['hub.challenge']);
    } else {
        res.status(403).end();
    }
});

/* Handling all messenges */
app.post('/incident', (req, res) => {
    console.log(req.body);
    if (req.body.object === 'page') {
        req.body.entry.forEach((entry) => {
            entry.messaging.forEach((event) => {
                if (event.message && event.message.text) {
                    //sendMessage(event);
                    sendMessage(event, req, res);
                }
            });
        });
        res.status(200).end();
    }
});

function sendMessage(event, req, res) {
    let sender = event.sender.id;
    let text = event.message.text;
    console.log('*** Inside sendMessage ***');
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
    }
}

/* Webhook for API.ai to get response from the 3rd party API */
app.post('/ai', (req, res) => {
    console.log('*** Inside service now request ***');
    console.log(req.body.result);

    if (req.body.result.action === 'input.welcome') {
        console.log('Inside Welcome intent');
        let msg = 'Hi welcome';
        return res.json({
            speech: msg,
            displayText: msg,
            source: 'reportIncidentBot'
        });
    }
});