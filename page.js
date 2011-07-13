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
	var dataset = [data, data2,
	{
		"id": "tos",
		"type": "checkbox",
		"value": true,
		"label": "I agree to the terms of service"
	},
	{
		"id": "type",
		"type": "radio",
		"options": {
			"light": "Light - free",
			"premium": "Premium - $40 / year"
		},
		"label": "Choose your account type"
	}];

	var c = new composer( $("#myform") );

	var defaultWidget = {
		"initialize": function() {
			var html = '';
			if( this.get("label") ) {
				html += "<label for='" + this.get("id") + "'>" + this.get("label") + "</label>";
			}
			html += "<input type='text' id='" + this.get("id") + "' value='" + this.get("value") + "'>";
			html += "<span class='error'></span>";
			$(this.get("el")).html(html);
			this.value( this.value() );
		},
		"set_value": function() {
			$(this.get("el")).find("input").val( this.get("value") );
		},
		"get_value": function() {
			return $(this.get("el")).find("input").val();
		},
		"set_validation_message": function(msg) {
			$(this.get("el")).find(".error").html(msg);
		}
	}

	c.addWidget("text", defaultWidget);
	c.addWidget("password", $.extend({}, defaultWidget, {
		"initialize": function() {
			var html = '';
			if( this.get("label") ) {
				html += "<label for='" + this.get("id") + "'>" + this.get("label") + "</label>";
			}
			html += "<input type='password' id='" + this.get("id") + "' value='" + this.get("value") + "'>";
			html += "<span class='error'></span>";
			$(this.get("el")).html(html);
			this.value( this.value() );
		}
	}));
	//checkbox, radio, textarea, select, number, picker
	c.addWidget("checkbox", $.extend({}, defaultWidget, {
		"initialize": function() {
			var html = '';
			if( this.get("label") ) {
				html += "<label for='" + this.get("id") + "'>" + this.get("label") + "</label>";
			}
			html += "<input type='checkbox' id='" + this.get("id") + "' value='" + this.get("value") + "'>";
			html += "<span class='error'></span>";
			$(this.get("el")).html(html);
			this.value( this.value() );
		},
		"set_value": function() {
			$(this.get("el")).find("input").attr("checked", this.get("value") ? true : false);
		}
	}));
	c.addWidget("radio", $.extend({}, defaultWidget, {
		"initialize": function() {
			var html = '';

			var options = this.get("options");
			var counter = 0;
			for( var value in options ) {
				var id = this.get("id") + "_" + counter; counter++;
				html += "<input type='radio' name='" + this.get("id") + "' id='" + id + "' value='" + value + "'>";
				html += "<label for='" + id + "'>" + options[value] + "</label>";
			}
			
			html += "<span class='error'></span>";
			$(this.get("el")).html(html);
			this.value( this.value() );
		},
		"set_value": function() {
			$(this.get("el")).find("input").filter(function() { return $(this).attr("value") == this.get("value") ? true : false; }).attr("selected", true);
		},
		"get_value": function() {
			return $(this.get("el")).find("input[selected]").attr("value");
		}
	}));

	c.add( dataset );
})

