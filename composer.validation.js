/*
	COMPOSER VALIDATION:

	This page covers how to add validation functions to Composer, as well as
	initializing the built-in validation functions

	Creating a new validation function:

	Validation functions take one variable, which provides the value of the form item. The validation form
	then determines if the value is valid, and returns a true boolean value if true, or a false or string value if the value is invalid.
	If a false boolean is returned, the item will be simply marked as invalid. If a string is returned, the item will be marked as invalid,
	and the string of text will be shown to inform the user why their input was invalid. 
	
	Validation functions are called by composerItem instances, and calling the `this` variable inside of a function will return the
	`composerItem` instance that is being validated.

	Validation functions are stored in the $.fn.composerValidation dictionary. To add a new function, simply add another value
	to the dictionary. The key will be used to identify the validation type.

	Example:
		
		$.fn.composerValidation["test_validation"] = function(item_val) {
			return "This will always fail";
		}

		$("#form").composer({
			"id": "test_item",
			"type": "checkbox",
			"label": "This is a test checkbox",
			"validation": ["test_validation"]
		});

	When a form is created, the $.fn.composerValidation dictionary is cloned. Extending the composerValidation dictionary after a
	form is initalized will not propagate the new validation function to exiting forms. Forms can be provided with validation functions
	on-the-fly through the .addValidation method

	Example:

		var form = $("#form").composer();

		form.addValidation("test_validation", function(item_val) {
			return "This will always fail";
		});
		
		form.add({
			"id": "test_item",
			"type": "checkbox",
			"label": "This is a test checkbox",
			"validation": ["test_validation"]
		});
*/

$.fn.composerValidation["num_greater_than"] = function(item_val) {
	var c = parseInt( this.get("num_greater_than") , 10);
	if( isNaN(parseFloat(item_val)) || (parseFloat(item_val) <= c) ) {
		return 'Value must be greater than ' + c;
	} else {
		return true;
	}
};
$.fn.composerValidation["num_greater_than_equal"] = function(item_val) {
	var c = parseInt( this.get("num_greater_than_equal") , 10);
	if( isNaN(parseFloat(item_val)) || (parseFloat(item_val) < c) ) {
		return 'Value must be greater than or equal to ' + c;
	} else {
		return true;
	}
};
$.fn.composerValidation["num_less_than"] = function(item_val) {
	var c = parseInt( this.get("num_less_than") , 10);
	if( isNaN(parseFloat(item_val)) || (parseFloat(item_val) >= c) ) {
		return 'Value must be less than ' + c;
	} else {
		return true;
	}
};
$.fn.composerValidation["num_less_than_equal"] = function(item_val) {
	var c = parseInt( this.get("num_less_than_equal") , 10);
	if( isNaN(parseFloat(item_val)) || (parseFloat(item_val) > c) ) {
		return 'Value must be less than or equal to ' + c;
	} else {
		return true;
	}
};
$.fn.composerValidation["not_empty"] = function(item_val) {
	var valid = false;
	if( typeof(item_val) == "string" ) {
		//"value" == :), "    " == :(, "" == :(
		if( item_val.trim() !== "" ) {
			valid = true;
		}
	} else if( typeof(item_val) == "object" ) {
		//{0: "value 1", 1: "value 2"} == :), {0: "value 1"} == :), {0: "   "} == :(, {} == :(

		//loop through items and return list with true/false based on if they have empty values
		var results = _.map(item_val, function(item) { return item.trim() === ""; });
		if( results.length > 0 && !_.include(results, true) ) {
			valid = true;
		}
	}
	
	if( !valid ) {
		return 'Value must not be empty';
	} else {
		return true;
	}
};
$.fn.composerValidation["integer"] = function(item_val) {
	if( parseInt(item_val, 10) != (item_val-0) ) {
		return 'Value must be an integer';
	} else {
		return true;
	}
};
$.fn.composerValidation["number"] = function(item_val) {
	if( parseFloat(item_val) != (item_val-0) ) {
		return 'Value must be a number';
	} else {
		return true;
	}
};
$.fn.composerValidation["longer_than"] = function(item_val) {
	var c = parseInt( this.get("longer_than") , 10);
	if( item_val.length <= c ) {
		return 'Value must be more than ' + c + ' characters long';
	} else {
		return true;
	}
};
$.fn.composerValidation["shorter_than"] = function(item_val) {
	var c = parseInt( this.get("shorter_than") , 10);
	if( item_val.length >= c ) {
		return 'Value must be less than ' + c + ' characters long';
	} else {
		return true;
	}
};
$.fn.composerValidation["email"] = function(item_val) {
	var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
	if( !reg.test(item_val) ) {
		return 'Value must be a valid email address';
	} else {
		return true;
	}
};

