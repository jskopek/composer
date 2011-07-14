$(document).ready(function() {
	var data = {
		"id": "username",
		"type": "text",
		//"value": "jms",
		"label": "Username",
		"validation": ["not_empty"],
		"shorter_than": 4
	};
	var data2 = {
		"id": "password",
		"type": "password",
		"label": "Password",
		"validation": ["longer_than"],
		"longer_than": 4
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
    dataset.push({
        "id": "organization",
        "type": "select",
        "options": {
            "waterloo": "University of Waterloo",
            "uoit": "University of Ontario Institute of Technology",
            "laurier": "Wilfred Laurier University",
            "guelph": "University of Guelph"
        },
        "label": "Choose your university"
    });

	var c = $("#form1 .form_container").composer();
	c.add( dataset );
	c.bind("change", function() {
		$("#status span").html( c.is_valid() ? "VALID :)" : "INVALID :(" );
	});
	$("#form1 a").click(function(e) {
		e.preventDefault();
		$("#status span").html( c.is_valid() ? "VALID :)" : "INVALID :(" );

		console.log( c.values() );
	});
	//`c.get("username").set({"value": "blablabla"});

	var c2 = $("#form2 .form_container").composer();
	c2.add( data2 );
});
