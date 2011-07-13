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

	c.addWidget("text", {
		"initialize": function() {
			var html = '';
			if( this.get("label") ) {
				html += "<label for='" + this.get("id") + "'>" + this.get("label") + "</label>";
			}
			html += "<input type='text' id='" + this.get("id") + "'>";
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
	});
	c.addWidget("password", {
		"initialize": function() {
			var html = '';
			if( this.get("label") ) {
				html += "<label for='" + this.get("id") + "'>" + this.get("label") + "</label>";
			}
			html += "<input type='password' id='" + this.get("id") + "'>";
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
	});


	c.add( dataset );
})

