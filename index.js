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
        let msg = 'Hi welcome';
        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: { access_token: 'EAAFwXfBX3n4BAHemcRPAiC2LJHYzRoT2XiZBFtkJMFUOLyWHvuTHukYa9zGBAZAZBCqcrh1W0h5ub1fPIMXLdC55cYfdvlTeykIrGTvZBH5AfAAqgkn4WR4CgVZBZAJ90Le17ZClNu5kp5mARxo026gC2FoEWYGHa4t9pumRoWMxQZDZD' },
            method: 'POST',
            json: {
                recipient: { id: sender },
                message: { text: aiText }
            }
        }, (error, response) => {
            if (error) {
                console.log('Error sending message: ', error);
            } else if (response.body.error) {
                console.log('Error: ', response.body.error);
            }
        });
    }
}

/* GET query from API.ai */

/*function sendMessage(event) {
    let sender = event.sender.id;
    let text = event.message.text;

    let apiai = apiaiApp.textRequest(text, {
        sessionId: 'incidentBot'
    });

    apiai.on('response', (response) => {
        console.log(response)
        let aiText = response.result.fulfillment.speech;

        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: { access_token: 'EAAFwXfBX3n4BAHemcRPAiC2LJHYzRoT2XiZBFtkJMFUOLyWHvuTHukYa9zGBAZAZBCqcrh1W0h5ub1fPIMXLdC55cYfdvlTeykIrGTvZBH5AfAAqgkn4WR4CgVZBZAJ90Le17ZClNu5kp5mARxo026gC2FoEWYGHa4t9pumRoWMxQZDZD' },
            method: 'POST',
            json: {
                recipient: { id: sender },
                message: { text: aiText }
            }
        }, (error, response) => {
            if (error) {
                console.log('Error sending message: ', error);
            } else if (response.body.error) {
                console.log('Error: ', response.body.error);
            }
        });
    });

    apiai.on('error', (error) => {
        console.log(error);
    });

    apiai.end();
}*/

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