$(document).ready(function() {
	var data = {
		"id": "username",
		"type": "text",
		"value": "jms",
		"label": "Username"
	};
	var data2 = {
		"id": "password",
		"type": "password",
		"value": "abcd",
		"label": "Password"
	}
	var dataset = [data, data2];

	var c = new composer( $("#myform") );
	c.addWidget("text", function() {
		$(this.el).html("Heya dude!");
	});
	c.addWidget("password", function() {
		$(this.el).html("I'm a password!");
	});

	c.add( dataset );
})

