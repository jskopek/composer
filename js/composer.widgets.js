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

//GENERATOR FUNCTION - MAKES IT EASY TO BULID SIMPLE FORM ELEMENTS
$.fn.composerWidgetsGenerator = function(input_html_generator_fn, extend_fn_dict) {
	var widget = {
		"initialize": function() {
			$(this.get("el")).addClass("cTextInput");

			var html = '';
			if( this.get("label") ) {
				html += "<div class='cLabel'><label for='" + this.get("id") + "'>" + this.get("label") + "</label></div>";
			}
			html += "<div class='cInput'></div>";
			$(this.get("el")).html(html);

			input_html_generator_fn.apply(this, [$(this.get("el")).find(".cInput")]);

			//bind for value change
			var item = this;
			$(this.get("el")).find("input").bind("change", function() {
				item.value( $(this).val() );
			});

			//placeholder handler
			this.get_widget().set_placeholder.apply(this);
			this.get_widget().set_tooltip.apply(this);
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

			//re-run the set_placholder command on value change (e.g. a form element's value changed programmatically)
			var item = this;
			this.bind("change:value", function() {
				item.get_widget().set_placeholder.apply(this);
			});

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

    if( extend_fn_dict ) {
        $.extend(widget, extend_fn_dict);
    }
    return widget;
};


//GENERIC WIDGETS
$.fn.composerWidgets["text"] = $.fn.composerWidgetsGenerator(function(el) { 
	$(el).html("<input type='text' id='" + this.get("id") + "'>");

	if( this.get("number") && $.fn.numeric ) {
		$(el).find("input").numeric({ allow: "-." });
	}
});

$.fn.composerWidgets["password"] = $.fn.composerWidgetsGenerator(function(el) { 
	$(el).html("<input type='password' id='" + this.get("id") + "'>");
});

$.fn.composerWidgets["textarea"] = $.fn.composerWidgetsGenerator(
    function(el) {
        $(el).html("<textarea id='" + this.get("id") + "'></textarea>");

        var item = this;
        $(this.get("el")).find("textarea").bind("change", function() {
            item.value( $(this).val() );
        });
    },
    {
        "set_value": function( val ) {
            $(this.get("el")).find("textarea").val( val );
        }
    }
);

$.fn.composerWidgets["select"] = $.extend(
	{}, 
	$.fn.composerWidgetsGenerator(function() {
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

$.fn.composerWidgets["picker"] = $.extend({}, 
	$.fn.composerWidgetsGenerator(function(el) {
		var html = "";
		html += "<div class='cInput'>";
        html += "<a href='#' class='cButton cPickerBack'>&#9664</a>";
        html += "<span class='cButton cPicker'></span>";
        html += "<a href='#' class='cButton cPickerNext'>&#9658</a>";
        html += "</div>";
		$(el).html(html);

        // Bind for value change
        var item = this;
        $(this.get("el")).find("a.cPickerBack").bind("click", function(e) {
            e.preventDefault();

            var new_index = Number(item.get("index")) - 1;
            if (new_index < 0) { return; }

            item.set({"index": new_index});
        });
        $(this.get("el")).find("a.cPickerNext").bind("click", function(e) {
            e.preventDefault();

            var new_index = Number(item.get("index")) + 1;
            if (new_index >= item.get("options").length) { return; }

            item.set({"index": new_index});
        });

		this.bind("change:options", function() {
			this.trigger("change:index");
		});

		this.bind("change:index", function() {
			var value = item.get("options")[ item.get("index") ];
			item.get("el").find(".cPicker").html( value );
		});
		if( !this.get("index") ) {
			this.set({"index": 0});
		}
		this.trigger("change:index");
	}),
	{
		"set_value": function(value) {
			var index = false;
			for (var index_check in this.get("options")) {
				if (value == this.get("options")[index_check]) {
					index = index_check;
					break;
				}
			}

			if( index ) {
				this.set({"index": index});
			}
		}	
	}
);

$.fn.composerWidgets["old_picker"] = $.extend({}, $.fn.composerWidgets["text"], {
	"get_index": function(value) {
		for (var index in this.get("options")) {
            if (value == this.get("options")[index]) {
                return index;
            }
        }
		return false;
	},
    "initialize": function() {
		if( !this.get("options") ) {
			this.set({"options": []});
		}

        var html = "";
        if (this.get("label")) {
            html += "<div class='cLabel'><label for='" + this.get("id") + "'>" + this.get("label") + "</label></div>";
        }

        html += "<div class='cInput'>";
        html += "<a href='#' class='cButton back'>Prev</a>";
        html += "<span class='cPicker'>" + this.get("options")[this.get("index")] + "</span>";
        html += "<a href='#' class='cButton next'>Next</a>";
        html += "</div>";

        $(this.get("el")).html(html);

        // Bind for value change
        var that = this;
        $(this.get("el")).find("a.back").bind("click", function(e) {
            e.preventDefault();
            var new_index = Number(that.get("index")) - 1;
            if (new_index < 0) { return; }
            that.set({"index": new_index});
            that.value(that.get("options")[that.get("index")]);
        });
        $(this.get("el")).find("a.next").bind("click", function(e) {
            e.preventDefault();
            var new_index = Number(that.get("index")) + 1;
            if (new_index >= that.get("options").length) { return; }
            that.set({"index": new_index});
            that.value(that.get("options")[that.get("index")]);
        });
    },
    "set_value": function(value) {
        $(this.get("el")).find("span").text(value);
    }
});

$.fn.composerWidgets["uploadify"] = $.extend({}, 
    $.fn.composerWidgetsGenerator(function(el) {
		//options
		var file_types = this.get("file_types") ? this.get("file_types") : "*";

        var html = "";
        if (this.get("label")) {
            // Show label if it's been specified
            html += "<div class='cLabel'><label for='" + this.get("id") + "'>" + this.get("label") + "</label></div>";
        }

        html += "<div class='cInput'>";
        html += "<input id='" + this.get("id") + "' type='file_upload' />";
        html += "</div>";

        $(this.get("el")).html(html);

        var uploadify_item = this;
        publisher.send({
            "module": "publisher", 
            "command": "get_uploadify_properties", 
            "args": {}, 
            "success": function(data, args) {
                args["scriptData"]["policy"] = encodeURIComponent(encodeURIComponent(args["scriptData"]["policy"]));
                args["scriptData"]["signature"] = encodeURIComponent(encodeURIComponent(args["scriptData"]["signature"]));

				var file_uploaded_fn = function(e, queueID, fileObj) {
					// Construct absolute URL of the image
					var loc = args["script"] + "/" + args["key"];
					// Replace the ${filename} placeholder with the real filename
					loc = loc.replace("${filename}", fileObj.name);

					//modify the progress bar to show that we are waiting for the FileObj to be created
					uploadify_item.get("el").find("#image_key" + queueID).find("span.percentage").html(" - attaching");
					
					// Create FileObj on server
					publisher.send({
						"module": "publisher",
						"command": "add_uploaded_file",
						"args": {
							"location": loc,
							"file_name": fileObj.name,
							"size": fileObj.size
						},
						"success": function(data, args) {
							uploadify_item.value([fileObj.name, args.key]);
							uploadify_item.get("el").find(".cInput").append("<p>" + fileObj.name + "</p>");

							//remove the progress bar
							uploadify_item.get("el").find("#image_key" + queueID).addClass("uploadifyUploaded");
						}
					});
				};

                var uploadify_args = $.extend(args, {
                    // Uploadify properties
                    "uploader": site_data.settings.MEDIA_URL + "uploadify.swf",
                    "buttonImg": site_data.settings.MEDIA_URL + "images/edumacation/buttons/button_upload.png",
                    "cancelImg": site_data.settings.MEDIA_URL + "images/edumacation/buttons/button_cancel.png",
                    "auto": true,
                    "fileExt": file_types,
                    "fileDesc": file_types,
                    "buttonText": "Upload",
                    "multi": false,
                    "width": 71,
                    "height": 20,
                    "onSelectOnce": function(e, d) {
                        // TODO
                    },
                    "onError": function(e, queueID, fileObj, errorObj) {
                        if (errorObj.type === "File Size") {
							var remaining_mb = Math.round(errorObj.info / 10485.76) / 100;
							uploadify_item.get("el").find("#image_key" + queueID).find("span.percentage").after(" (" + remaining_mb + "MB remaining in course)");
                        } else if (errorObj.info === 201) {
                            // Flash for OS X treats 201 success messages as errors.
                            file_uploaded_fn(e, queueID, fileObj);
                        }
                    },
                    "onComplete": file_uploaded_fn
				});

                $(uploadify_item.get("el")).find("input#" + uploadify_item.get("id")).uploadify(uploadify_args);
            }
        });
    }),
    {
        "set_value": function(value) {} //uploadify cannot be set to existing value
    }
);


$.fn.composerWidgets["number"] = {};
$.fn.composerWidgets["button"] = {};

//FANCY WIDGETS
$.fn.composerWidgets["fieldset"] = {
	"initialize": function() {
		this.get("el").html("<fieldset id='cId_" + this.get("id") + "'><legend>" + this.get("label") + "</legend><div class='cFieldsetData'></div></fieldset>");

		if( this.get("collapsible") ) {
			this.get("el").addClass("cCollapsible");

			//initialize collapsed property, if it has not been set
			if( this.get("collapsed") == undefined ) {
			   this.set({"collapsed": false });
			}

			//bind function that hides or shows fieldset on collapsed property change
			this.bind("change:collapsed", function() {
				if( this.get("collapsed") === true ) {
					this.get("el").addClass("cCollapsed");
				} else {
					this.get("el").removeClass("cCollapsed");
				}
			});

			//trigger collapse handler in order to initialize with proper collapsed view
			this.trigger("change:collapsed");

			//update collapsed status, and re
			var item = this;
			this.get("el").find("legend").click(function(e){
				e.preventDefault();
				item.set({ "collapsed": !item.get("collapsed") });
			});
		}
	},
    "set_value": function(value) {
		var val = $.extend([], value);
		for( var index in val ) {
			val[index]["container_el"] = this.get("el").find(".cFieldsetData");
		}
		this.collection.add( value );
    }
};

$.fn.composerWidgets["hidden"] = {
	"initialize": function() {
		this.get("el").html("<input type='hidden' id='" + this.get("id") + "' value='" + this.value() + "'/>");
	}
};

$.fn.composerWidgets["html"] = 	{
	"initialize": function() {
		this.get("el").html( this.value() );
	}
};

$.fn.composerWidgets["checkbox"] = $.extend({}, $.fn.composerWidgets["text"], {
	"initialize": function() {
		$(this.get("el")).addClass("cClickInput");

		var html = '';
		html += "<div class='cInput'><input type='checkbox' id='" + this.get("id") + "'></div>";
		if( this.get("label") ) {
			html += "<div class='cLabel'><label for='" + this.get("id") + "'>" + this.get("label") + "</label></div>";
		}
		$(this.get("el")).html(html);

		//bind for value change
		var that = this;
		$(this.get("el")).find("input").bind("click", function() {
			that.value( $(this).is(":checked") );
		});

		//explicitely set value to false if undefined
		if( this.value() == undefined ) {
			this.value(false);
		}

		//placeholder handler
		$.fn.composerWidgets["text"].set_placeholder.apply(this);
		$.fn.composerWidgets["text"].set_tooltip.apply(this);

	},
	"set_value": function( val ) {
		$(this.get("el")).find("input").attr("checked", val ? true : false);
	}
});

$.fn.composerWidgets["radio"] = $.fn.composerWidgetsGenerator(function(el) {

		var html = '';

		html += '<ul>';

		var options = this.get("options");
		var counter = 0;
		for( var value in options ) {
			var id = this.get("id") + "_" + counter; counter++;
			html += "<li>";
			html += "<div class='cRadioInput'><input type='radio' name='" + this.get("id") + "' id='" + id + "' value='" + value + "'></div>";
			html += "<div class='cRadioLabel'><label for='" + id + "'>" + options[value] + "</label></div>";
			html += "</li>";
		}
		html += "</ul>";
		
		$(el).html(html);
	
		//bind for value change
		var that = this;
		$(el).find("input").bind("click", function() {
			that.value( $(this).attr("value") );
		});

		//add inline class, if inline property specified
		if( this.get("inline") ) {
			$(el).addClass("cRadioInline");
		}
	},
	{
		"set_value": function( val ) {
			var matched_radio = $(this.get("el")).find("input").filter(function() { return $(this).attr("value") == val ? true : false; });
            matched_radio.attr("checked", true);

            //mark as selected
            matched_radio.parents("li").siblings().removeClass("cRadioSelected");
            matched_radio.parents("li").addClass("cRadioSelected");
		}
	}
);

