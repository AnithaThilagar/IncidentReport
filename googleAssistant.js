//To send the response to the google assistant
var googleAssistant = {
	//To send the text and basic card as the welcome message
	welcomeIntent: function(app){		
        app.ask(app.buildRichResponse()
            .addSimpleResponse({
                speech: 'Hi welcome to Report It Bot!',
                displayText: 'Hi welcome to Report It Bot!'
            })
            .addBasicCard(app.buildBasicCard("This is a basic card.  Text in a basic card can include \"quotes\" and most other unicode characters including emoji 📱.  Basic cards also support some markdown formatting like *emphasis* or _italics_, **strong** or __bold__, and ***bold itallic*** or ___strong emphasis___ as well as other things like line  \nbreaks",)
                .setTitle('Report It - To solve it')
                .setImage('https://mgtvwlns.files.wordpress.com/2015/05/reportit-logo5b35d.jpg', 'Image alternate text')
                .setImageDisplay('CROPPED')
            )
            .addSuggestions(['Report Incident', 'My Incidents']));
	}
};

module.exports = googleAssistant;