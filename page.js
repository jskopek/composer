$(document).ready(function() {
	var data = {
		"id": "username",
		"type": "text",
		"value": "jms",
		"label": "Username",
		"validation": ["not_empty", "longer_than"],
		"longer_than": 4
	};
	var data2 = {
		"id": "password",
		"type": "password",
		"value": "abcd",
		"label": "Password"
	};

	var dataset	= [data, data2];
	
	dataset.push({
		"id": "tos",
		"type": "checkbox",
		"value": true,
		"label": "I agree to the terms of service"
	});
	dataset.push({
		"id": "type",
		"type": "radio",
		"options": {
			"light": "Light - free",
			"premium": "Premium - $40 / year"
		},
		"label": "Choose your account type"
	});

	var c = $("#myform").composer();
	c.add( dataset );
	c.get("username").set({"value": "blablabla"});

	var c2 = $("#myotherform").composer();
	c2.add( data2 );
});
