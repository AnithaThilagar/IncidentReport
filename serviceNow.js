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
                return reject(error);
            });
        });
    },
    //To get the incident details using the incident Id
    getIncidentDetails: function (res, incidentId) {
        try {
            console.log("Inside get incident " + incidentId);
            new Promise((resolve, reject) => {
                request({
                    url: config.getIncidentUrl + incidentId,
                    headers: { 'Authorization': 'Basic MzMyMzg6YWJjMTIz' },
                    method: 'GET'
                }).then((response) => {
                    return resolve(response);
                }).catch((error) => {
                    return reject(error);
                });
            });
        } catch (e) {
            console.log("Exception in getIncidentDetails " + e);
        }
    }
};

module.exports = serviceNow;