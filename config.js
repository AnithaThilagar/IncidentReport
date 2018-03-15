var config = {
    "serviceNowVersion": "v1",
    "serviceNowTableName": "incident",
    "getIncidentUrl": "https://dev18442.service-now.com/api/now/v1/table/incident?number=",
    "authOCallbackUrl": "https://report-incident-bot.herokuapp.com/callback",
    "facebookMessageUri": "https://graph.facebook.com/v2.6/me/messages",
    "apiaiVerificationToken": "incidentBot"
};

module.exports = config;