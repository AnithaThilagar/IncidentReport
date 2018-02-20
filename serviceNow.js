const request = require('request'),
    config = require('./config'),
    GlideRecord = require('servicenow-rest').gliderecord,
    record = new GlideRecord(config.serviceNowInstance, config.serviceNowTableName, config.serviceNowUserName, config.serviceNowPassword, config.serviceNowVersion);

//To handle the service now request
var serviceNow = {
    //To save the incident using the servicenow API
    saveIncident: function (res, userData) {
        var obj = {
            category: userData.category,
            subcategory: userData.subCategory,
            urgency: userData.urgencyType,
            contact_type: userData.contactDetails,
            short_description: userData.description
        };
        //To insert the incident details
        return new Promise((resolve, reject) => {
            record.insert(obj).then(function (response) {
                console.log("Incident Id is " + response.number);
                return resolve(response);
            }).catch(function (error) {
                return reject('Incident is not created. Try again later');
            });
        });
    },
    //To get the incident details using the incident Id
    getIncidentDetails: function (res, incidentId) {
        try {
            console.log("Inside get incident " + incidentId);
            let options = {
                url: config.getIncidentUrl + incidentId,
                headers: { 'Authorization': 'Basic MzMyMzg6YWJjMTIz' },
                method: 'GET'
            };
            return new Promise((resolve, reject) => {
                request(options, (error, response) => {
                    let incidentDetails = '';
                    if (!error && response.statusCode == 200) {
                        console.log('Inside success');
                        return resolve(response);
                    } else if (response.statusCode == 404) {
                        console.log('Inside No incident');
                        return resolve('');
                    } else {
                        console.log(error);
                        return reject(error);
                    }
                });
            });
        } catch (e) {
            console.log("Exception in getIncidentDetails " + e);
        }
    }
};

module.exports = serviceNow;