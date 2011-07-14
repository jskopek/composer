/*
	COMPOSER WIDGETS

	Widgets are dictionary objects that contain all the logic for creating, populating, and serializing form types.

	This page covers how to add widgets to Composer, as well as
	initializing the built-in widgets.

	Creating a new widget object.

	Widget objects must have the following structure:

	{
		//renders the form element in the dom and binds any necessary events
		//do not set the value of the element here - it will be done automatically (by calling 'set_value' after initialization)

		//the intialize command should update the composerItem's value when the form element is changed (see example)
		"initialize": function() {},

		//updates the form element with the item's value (accessible via this.get("value"))
		"set_value": function( val ) {},

		//takes a validation message and renders it on the screen; may take a string value or a false boolean, which should
		//cause the validation message to be hidden
		"set_validation_message": function(msg) {}
	}

	Widget objects are called by composerItem instances, and calling the `this` variable inside of a function will return the
	`composerItem` instance that is being validated. The item's value, DOM element, data, and more should be accessed by calling
	this.get(...). These are common properies that will be accessed by most widget objects:
	
		- this.get("id");
		- this.get("el"); //the DOM element assigned to the widget
		- this.get("label");
		- this.value(); //get the value set in the composerItem instance
		- this.value( val ); //set the composerItem instance's value (will call widget's 'set_value' function)

	Validation functions are stored in the $.fn.composerWidgets dictionary. To add a new function, simply add another value
	to the dictionary. The key will be used to identify the validation type.

	Example:

		$.fn.composerWidgets["test_type"] = {
			"initialize": function() {
				var html = '<input type='text' id='" + this.get('id') + "'>';
				$(this.get("el")).html(html);
				this.value( this.value() );

				//bind for value change
				var item = this;
				$(this.get("el")).find("input").bind("change", function(tst) {
					item.value( $(this).val() );
				});
			},
			"set_value": function( val ) {
				$(this.get("el")).find("input").val( val );
			},
			"set_validation_message": function(msg) {
				$(this.get("el")).find(".error").html(msg);
			}
		};

		
		$("#form").composer({
			"id": "test_item",
			"type": "test_type",
			"label": "This is a test item",
		});

	When a form is created, the $.fn.composerWidgets dictionary is cloned. Extending the composerWidgets dictionary after a
	form is initalized will not propagate the new widget object to exiting forms. Forms can be provided with widgets
	on-the-fly through the .addWidget method

	Example:

		var form = $("#form").composer();

		form.addWidget("test_type", { ... });

		form.add({
			"id": "test_item",
			"type": "test_type",
			"label": "This is a test item",
		});

	If a widget needs additional data (such as a list of options for a set of radio buttons), the values should be specified as part
	of the form item's data dictionary:

	Example:

		var form = $("#form").composer();

		form.addWidget("type_with_additional_data", {
			"initialize": function() {
				var additional_data = this.get("additional_data_for_widget");
			}
		});

		form.add({
			"id": "test_item",
			"type": "type_with_additional_data",
			"additional_data_for_widget": "This is the additional data value"
		});
*/

//------ widgets -----
$.fn.composerWidgets["generic_widget_generator"] = function(input_html_generator_fn) {
	return {
		"initialize": function() {
			$(this.get("el")).addClass("cTextInput");

			var html = '';
			if( this.get("label") ) {
				html += "<div class='cLabel'><label for='" + this.get("id") + "'>" + this.get("label") + "</label></div>";
			}
			html += "<div class='cInput'>";
			html += input_html_generator_fn.apply(this);
			html += "</div>";
			$(this.get("el")).html(html);

			//bind for value change
			var item = this;
			$(this.get("el")).find("input").bind("change", function() {
				item.value( $(this).val() );
			});

			//placeholder handler
			$.fn.composerWidgets["text"].set_placeholder.apply(this);
			$.fn.composerWidgets["text"].set_tooltip.apply(this);
		},
		"set_value": function( val ) {
			$(this.get("el")).find("input").val( val );
		},
		"set_tooltip": function() {
			if( this.get("tooltip") ) {
				this.get("el").find(".cLabel:first").append("<div class='cTooltip'><span>" + this.get("tooltip") + "</span></div>");
			}
		},
		"set_placeholder": function() {
			if( !this.get("placeholder") ) { 
				return false; 
			}
			this.get("el").find(".cInput").append("<span class='cPlaceholder'>" + this.get("placeholder") + "</span>");
			$(this.get("el")).find(".cPlaceholder").click(function() {
				$(this).siblings("input").add( $(this).siblings("textarea") ).focus();
			});
			if( this.value() ) {
				$(this.get("el")).find(".cPlaceholder").hide();
			}
			$(this.get("el")).find("input").add( $(this.get("el")).find("textarea") ).bind("keyup", function() {
				$(this).siblings(".cPlaceholder").css("display", ( !$(this).val() ) ? "block" : "none");
			});
			return true;
		},
		"set_validation_message": function(msg) {
			this.get("el").find(".cValidation").remove();
			if( msg ) {
				this.get("el").append("<div class='cValidation invalid'><span>" + msg + "</span></div>");
			}
		}
	};
};


//generic widgets
$.fn.composerWidgets["text"] = $.fn.composerWidgets["generic_widget_generator"](function() { 
	return "<input type='text' id='" + this.get("id") + "'>"; 
});

$.fn.composerWidgets["password"] = $.fn.composerWidgets["generic_widget_generator"](function() { 
	return "<input type='password' id='" + this.get("id") + "'>"; 
});

$.fn.composerWidgets["textarea"] = $.fn.composerWidgets["generic_widget_generator"](function() { 
	return "<textarea id='" + this.get("id") + "'></textarea>"; 
});

$.fn.composerWidgets["select"] = $.extend(
	{}, 
	$.fn.composerWidgets["generic_widget_generator"](function() {
        var html = "<select id='" + this.get("id") + "'>";
        var options = this.get("options");
        
        var counter = 0;
        for (var value in options) {
            var id = this.get("id") + "_" + counter; counter++;
            html += "<option value='" + value + "'>" + options[value] + "</option>";
        }
		return html;
	}), 
	{
		"set_value": function(value) {
			$(this.get("el")).find("select").filter(function() {
				return $(this).val() == value ? true: false;
			});
		}
	}
);
$.fn.composerWidgets["picker"] = {};
$.fn.composerWidgets["number"] = {};
$.fn.composerWidgets["uploadify"] = {};
$.fn.composerWidgets["button"] = {};

//weirder wigdgets
$.fn.composerWidgets["checkbox"] = $.extend({}, $.fn.composerWidgets["text"], {
	"initialize": function() {
		$(this.get("el")).addClass("cClickInput");

		var html = '';
		html += "<div class='cInput'><input type='checkbox' id='" + this.get("id") + "' value='" + this.get("value") + "'></div>";
		if( this.get("label") ) {
			html += "<div class='cLabel'><label for='" + this.get("id") + "'>" + this.get("label") + "</label></div>";
		}
		$(this.get("el")).html(html);

		//bind for value change
		var that = this;
		$(this.get("el")).find("input").bind("click", function() {
			that.value( $(this).is(":checked") );
		});

		//placeholder handler
		$.fn.composerWidgets["text"].set_placeholder.apply(this);
		$.fn.composerWidgets["text"].set_tooltip.apply(this);

	},
	"set_value": function( val ) {
		$(this.get("el")).find("input").attr("checked", val ? true : false);
	}
});

$.fn.composerWidgets["radio"] = $.extend({}, $.fn.composerWidgets["text"], {
	"initialize": function() {
		$(this.get("el")).addClass("cClickInput");

		var html = '<ul>';

		var options = this.get("options");
		var counter = 0;
		for( var value in options ) {
			var id = this.get("id") + "_" + counter; counter++;
			html += "<li>";
			html += "<div class='cInput'><input type='radio' name='" + this.get("id") + "' id='" + id + "' value='" + value + "'></div>";
			html += "<div class='cLabel'><label for='" + id + "'>" + options[value] + "</label></div>";
			html += "</li>";
		}
		html += "</ul>";
		
		$(this.get("el")).html(html);
	
		//bind for value change
		var that = this;
		$(this.get("el")).find("input").bind("click", function() {
			that.value( $(this).attr("value") );
		});

		//placeholder handler
		$.fn.composerWidgets["text"].set_placeholder.apply(this);
		$.fn.composerWidgets["text"].set_tooltip.apply(this);

	},
	"set_value": function( val ) {
		$(this.get("el")).find("input").filter(function() { return $(this).attr("value") == val ? true : false; }).attr("selected", true);
	}
});


