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

	//------ widgets -----
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
	//textarea, select, number, picker
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
	c.addWidget("textarea", {});
	c.addWidget("select", {});
	c.addWidget("picker", {});
	c.addWidget("number", {});
	c.addWidget("uploadify", {});

	//----- validation ------
	c.addValidation("num_greater_than", function(item_val) {
		var c = parseInt( this.get("num_greater_than") );
		if( isNaN(parseFloat(item_val)) || (parseFloat(item_val) <= c) ) {
			return 'Value must be greater than ' + c;
		} else {
			return true;
		}
	});
	c.addValidation("num_greater_than_equal", function(item_val) {
		var c = parseInt( this.get("num_greater_than_equal") );
		if( isNaN(parseFloat(item_val)) || (parseFloat(item_val) < c) ) {
			return 'Value must be greater than or equal to ' + c;
		} else {
			return true;
		}
	});
	c.addValidation("num_less_than", function(item_val) {
		var c = parseInt( this.get("num_less_than") );
		if( isNaN(parseFloat(item_val)) || (parseFloat(item_val) >= c) ) {
			return 'Value must be less than ' + c;
		} else {
			return true;
		}
	});
	c.addValidation("num_less_than_equal", function(item_val) {
		var c = parseInt( this.get("num_less_than_equal") );
		if( isNaN(parseFloat(item_val)) || (parseFloat(item_val) > c) ) {
			return 'Value must be less than or equal to ' + c;
		} else {
			return true;
		}
	});
	c.addValidation("not_empty", function(item_val) {
		var valid = false;
		if( typeof(item_val) == "string" ) {
			//"value" == :), "    " == :(, "" == :(
			if( item_val.trim() != "" ) {
				valid = true;
			}
		} else if( typeof(item_val) == "object" ) {
			//{0: "value 1", 1: "value 2"} == :), {0: "value 1"} == :), {0: "   "} == :(, {} == :(

			//loop through items and return list with true/false based on if they have empty values
			var results = _.map(item_val, function(item) { return item.trim() == ""; });
			if( results.length > 0 && !_.include(results, true) ) {
				valid = true;
			}
		}
		
		if( !valid ) {
			return 'Value must not be empty';
		} else {
			return true;
		}
	});
	c.addValidation("integer", function(item_val) {
		if( parseInt(item_val) != (item_val-0) ) {
			return 'Value must be an integer';
		} else {
			return true;
		}
	});
	c.addValidation("number", function(item_val) {
		if( parseFloat(item_val) != (item_val-0) ) {
			return 'Value must be a number';
		} else {
			return true;
		}
	});
	c.addValidation("longer_than", function(item_val) {
		var c = parseInt( this.get("longer_than") );
		if( item_val.length <= c ) {
			return 'Value must be more than ' + c + ' characters long';
		} else {
			return true;
		}
	});
	c.addValidation("shorter_than", function(item_val) {
		var c = parseInt( this.get("shorter_than") );
		if( item_val.length >= c ) {
			return 'Value must be less than ' + c + ' characters long';
		} else {
			return true;
		}
	});
	c.addValidation("email", function(item_val) {
		var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
		if( !reg.test(item_val) ) {
			return 'Value must be a valid email address';
		} else {
			return true;
		}
	});

	c.add( dataset );
})

