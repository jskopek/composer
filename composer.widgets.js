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
};

$.fn.composerWidgets["text"] = defaultWidget;

$.fn.composerWidgets["password"] = $.extend({}, defaultWidget, {
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
});

$.fn.composerWidgets["checkbox"] = $.extend({}, defaultWidget, {
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
});

$.fn.composerWidgets["radio"] = $.extend({}, defaultWidget, {
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
});

$.fn.composerWidgets["textarea"] = {};
$.fn.composerWidgets["select"] = {};
$.fn.composerWidgets["picker"] = {};
$.fn.composerWidgets["number"] = {};
$.fn.composerWidgets["uploadify"] = {};

