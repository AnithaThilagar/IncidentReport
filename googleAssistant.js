//To send the response to the google assistant
var googleAssistant = {
	//To send the text and basic card as the welcome message
	welcomeIntent: function(app){		
        app.ask(app.buildRichResponse()
            .addSimpleResponse({
                speech: 'Hi welcome to Report It Bot!',
                displayText: 'Hi welcome to Report It Bot!'
            })
            .addBasicCard(app.buildBasicCard("I can help you with \n__Report a new Incident__ \n__View Incident status__ \nPlease select any one \nType exit or goodbye whenever you want to end the conversation")
                .setTitle('Report It - To solve it')
                .setImage('https://mgtvwlns.files.wordpress.com/2015/05/reportit-logo5b35d.jpg', 'Image alternate text')
                .setImageDisplay('CROPPED')
            )
            .addSuggestions(['Report Incident', 'My Incidents']));
	},
	//To send the incident category as suggestion chips
    incidentCategory: function (app){
		app.ask(app.buildRichResponse()
			.addSimpleResponse({speech: 'Please select the category',
			  displayText: 'Please select any one category'})
			.addSuggestions(['Hardware', 'Software'])
		);
	},
	//To send the sub category for the value for the incident category selected as Carousel
    incidentSubCategory: function (app, category) {
        if (category == 'hardware') {
            app.askWithCarousel('Please select the sub category',
                // Build a carousel
                app.buildCarousel()
                    // Add the first item to the carousel
                    .addItems(app.buildOptionItem('NEW DEVICE',
                        ['new device', 'add device', 'setup device'])
                        .setTitle('New Device')
                        .setDescription('For requesting new device')
                        .setImage('https://cdn3.iconfinder.com/data/icons/phones-set-2/512/27-512.png', 'New Device'))
                    // Add the second item to the carousel
                    .addItems(app.buildOptionItem('Damaged Device',
                        ['damaged device', 'device damaged', 'issue with device'])
                        .setTitle('Damaged Device')
                        .setDescription('To report if the device is damaged')
                        .setImage('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxod-I0fuatggTIxbnHFELF6y62zwXkrzthtoVAWOmOwNQuPJusw', 'Damaged Device')
                    )
                    // Add third item to the carousel
                    .addItems(app.buildOptionItem('Replace Device',
                        ['replace device', 'change device', 'exchange device'])
                        .setTitle('Replace Device')
                        .setDescription('To replace the existing device')
                        .setImage('https://cdn3.iconfinder.com/data/icons/finance-and-money-1/512/arrows_currency_exchange_direction_flat_icon-512.png', 'Replace Device')
                    )
            );
        } else {
            app.askWithCarousel('Please select the sub category',
                // Build a carousel
                app.buildCarousel()
                    // Add the first item to the carousel
                    .addItems(app.buildOptionItem('Software Installation',
                        ['new software', 'add software', 'install software'])
                        .setTitle('Software Installation')
                        .setDescription('For installing new software')
                        .setImage('http://cmpg.unibe.ch/software/BayeScan/images/Download-icon.png', 'Software Installation'))
                    // Add the second item to the carousel
                    .addItems(app.buildOptionItem('Problem with installed software',
                        ['software problem', 'software issue', 'issue with software'])
                        .setTitle('Problem with installed software')
                        .setDescription('To report if any problem in the software')
                        .setImage('https://cdn0.iconfinder.com/data/icons/connection/512/icon-14.png', 'Problem with installed software')
                    )
            );
        }
	}
};

//"This is a basic card.  Text in a basic card can include \"quotes\" and most other unicode characters including emoji 📱.  
//Basic cards also support some markdown formatting like * emphasis * or _italics_, **strong ** or __bold__, and ***bold itallic*** 
//or ___strong emphasis___ as well as other things like line  \nbreaks",

module.exports = googleAssistant;