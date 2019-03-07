
module.exports =
{
	
	processIntent: function (intent, callback)
	{
		var intent_name = intent.name;
			
		var message = 
		{
			'command': "Waiting for command",
			'message' : "No message",
		};
		
		if (intent_name === 'TurnOn_One')
		{
			console.log ('Recd Turning On light-1');
			message = 
			{
				'command': 'TURN_ON_LIGHT-1',
				'message': 'Turning on the light-1',
			};
			this.sendPNCommand (message, callback);
		}
		else if (intent_name === 'TurnOff_One')
		{
			console.log ('Recd Turning Off LIGHT-1');
			message = 
			{
				'command': 'TURN_OFF_LIGHT-1',
				'message': 'Turning off the LIGHT-1',
			};
			this.sendPNCommand (message, callback);						
		}
		else if (intent_name === 'TurnOn_Two')
		{
			console.log ('Recd Turning On LIGHT-2');
			message = 
			{
				'command': 'TURN_ON_LIGHT-2',
				'message': 'Turning on the LIGHT-2',
			};
			this.sendPNCommand (message, callback);						
		}
		else if (intent_name === 'TurnOff_Two')
		{
			console.log ('Recd Turning Off LIGHT-2');
			message = 
			{
				'command': 'TURN_OFF_LIGHT-2',
				'message': 'Turning off the LIGHT-2',
			};
			this.sendPNCommand (message, callback);						
		}
		else if (intent_name === 'TurnOn')
		{
			console.log ('Recd Turning On lights');
			message = 
			{
				'command': 'TURN_ON_LIGHTS',
				'message': 'Turning on the LIGHTS',
			};
			this.sendPNCommand (message, callback);						
		}
		else if (intent_name === 'TurnOff')
		{
			console.log ('Recd Turning Off lights');
			message = 
			{
				'command': 'TURN_OFF_LIGHTS',
				'message': 'Turning off the LIGHTS',
			};
			this.sendPNCommand (message, callback);						
		}
		else if (intent_name === 'AMAZON.HelpIntent')
		{
			console.log ('User Asking for Help');
			var sessionAttributes ={};
			callback
			(
				sessionAttributes, 
				this.buildSpeechletResponse
				(
					"My Home Title",
					"Welcome to my home. You can ask me to turn on a gadget or turn off a gadget." ,
					"Do you want me to do something?", false)
			);
		}
		else if (intent_name === 'AMAZON.StopIntent' || intent_name === 'AMAZON.CancelIntent') 
		{
			console.log ('User asking to stop');
			var sessionAttributes ={};
			callback
			(
				sessionAttributes, 
				this.buildSpeechletResponse
				(
					"My Home Title",
					"Hello user, Thank you for using my home" ,
					"", true)
			);			
		}
		else
		{
			console.log ("Recd invalid intent");
		}
				
	},
	
	
	sendPNCommand: function  (message, callback)
	{
		var PN = require("pubnub");
		var pn = new PN
		({
			ssl           : true,  // <- enable TLS Tunneling over TCP
			publish_key   : process.env.PUB_NUB_PUBLISH_KEY,
			subscribe_key : process.env.PUB_NUB_SUBSCRIBE_KEY
		});
		
		var output = message['message'];
		console.log ("Trying to send message");
		console.log ("Channel is: ", process.env.PUB_NUB_CHANNEL_KEY);
		pn.publish(
			{
				channel   : process.env.PUB_NUB_CHANNEL_KEY,
				message   : message
			},
			
			function (status, response)
			{
				console.log ("Callback fired");
				if (status.error)
				{
					console.log("Failed publish", status, response);
				}
				else
				{
					console.log("Succeedded publish", status, response);
				}
			}
		);
		console.log ("Sent messge, exepcted callback");
		//var speechletResponse = this.buildSpeechletResponse("My Home Title", output, "What else you want to do?", false);
		var sessionAttributes = {};
		//var resp = this.buildResponse(sessionAttributes, speechletResponse);
		console.log ("Finally calling back");
		//callback(null, resp);
		callback
		(
			sessionAttributes,
			this.buildSpeechletResponse("My Home Title", output, "What else you want to do?", true)
		);
	},
	
	
	buildSpeechletResponse: function(title, output, repromptText, shouldEndSession)
	{
		console.log ("Building speechlet response");
		return(
		{
			'outputSpeech':
			{
				'type': 'PlainText',
				'text': output,
			},
			/*
			card:
			{
                'type': 'Simple',
                'title': title,
                content: output
            },
            */ 
			'reprompt':
			{
				'outputSpeech':
				{
					'type': 'PlainText',
					'text': repromptText
				}
			},
			'shouldEndSession': shouldEndSession
		});
	},

	buildResponse: function(sessionAttributes, speechletResponse)
	{
		console.log ("Building final response");
		console.log (speechletResponse);
		return {
			'version': '1.0',
			'sessionAttributes': sessionAttributes,
			'response': speechletResponse
		};
	},		

	
} // end main 
