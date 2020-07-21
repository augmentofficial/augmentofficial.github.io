var express = require('express');
var https = require('https');
var Mailchimp = require('mailchimp-api-v3');

const bodyParser = require('body-parser');
const request = require('request');
const fetch = require('node-fetch');

require('dotenv').config();

var app = express();

const myKey = process.env.MAILCHIMP_API_KEY;
const myList = process.env.MAILCHIMP_AUDIENCE_ID;

var mailchimp = new Mailchimp(myKey);

app.set('port', (process.env.PORT || 8000));

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.sendFile(__dirname + './index.html');
});

app.post('/submit-form', (req, res) => {
	var email = req.body.email
	var add_new_member = {
		method: 'POST',
		path: '/lists/' + myList + '/members',
		body: {
			email_address: email,
			status: 'subscribed'
		}
	}
	mailchimp.post(add_new_member)
	.then(() => {
		console.log(email + ' added to contact list');
		res.redirect('/');
	})
	.catch((error) => {
		console.log('Error: ', error.title);
		console.log('Details: ', error.detail);
		console.log('Status: ', error.status);
		if (error.title === "Member Exists") {
			// TODO: Implement page popup
			res.redirect('/');
		} else {
			// TODO: Implement page popup
			res.redirect('/');
		}
	})
});

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
