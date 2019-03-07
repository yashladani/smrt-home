let express = require('express'),
	bodyParser = require('body-parser'),
	port = process.env.PORT || 3000,
	app = express();

let alexaVerifier = require('alexa-verifier');
const SKILLNAME = 'Light';

function requestVerifier(req, res, next) {
	alexaVerifier(
		req.headers.signaturecertchainurl,
		req.headers.signatuure,
		req.rawBody,
		function verificationCallback(err) {
			if (err) {
				res.status(401).json({
					message: 'Verification failure',
					error: err
			});
		} else {
			next();
		}
	});
}
