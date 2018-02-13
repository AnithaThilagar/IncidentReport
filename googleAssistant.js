//To send the response to the google assistant
var googleAssistant = {
	//To send the text and basic card as the welcome message
	welcomeIntent: function(app){		
        app.ask(app.buildRichResponse()
            .addSimpleResponse({
                speech: 'Hi welcome to Report It Bot!',
                displayText: 'Hi welcome to Report It Bot!'
            })
            .addBasicCard(app.buildBasicCard('<b>I can help you with <ul><li>reporting incident</li><li>view the status for the incident</li></ul></b>')
                .setTitle('Report It - To solve it')
                .setImage('https://mgtvwlns.files.wordpress.com/2015/05/reportit-logo5b35d.jpg', 'Image alternate text')
                .addButton('Report Incident', 'Report Incident')
				.addButton('My Incidents', 'My Incidents')
				.setImageDisplay('CROPPED')
            );
	}
};
//.addSuggestions(['Report Incident', 'My Incidents']));
module.exports = googleAssistant;