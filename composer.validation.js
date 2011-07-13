//----- validation ------
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

