var composerItem = Backbone.Model.extend({
	initialize: function() {
		if( !this.get("id") && !this.get("type") ) {
			throw("Missing `id` or `type` properties!");
		}

		var el = $("<div></div>").addClass("cRow").addClass("cType_" + this.get("type")).attr("id", "cId_" + this.get("id"));

		var container_el = this.get("container_el") ? this.get("container_el") : this.collection.el;
		$(container_el).append(el);

		this.set({"el": el});

		var that = this;
		$(el).bind("click", function() {
			that.trigger("click");
		});

		var widget = this.get_widget();
		widget.initialize.apply(this);

		if( this.get("value") ) {
			this.value( this.get("value") );
		}

		//trigger validation on item value change
		this.bind("change:value", function() {
			var widget = this.get_widget();
			widget.set_value.apply(this, [ this.get("value") ]);

			var is_valid = this.is_valid();
			this.trigger( is_valid ? "valid" : "invalid" );
		});

		this.bind("remove", function() {
			this.get("el").remove();
		});

		//inform the collection of certain event changes
		this.bind("change:value", function() {
			this.collection.trigger("change", this);
		});
		this.bind("change:valid", function() {
			this.collection.trigger("valid", this);
		});
		this.bind("change:invalid", function() {
			this.collection.trigger("invalid", this);
		});

		if( this.get("value") ) { this.trigger("change:value"); }
	},
	get_widget: function() {
		var widget = this.collection.widgets[this.get("type")];
		if( !widget ) {
			throw("We don't know how to handle elements of type `" + this.get("type") + "`");
		}
		return widget;
	},
	is_valid: function() {
		//set up a list of validation types
		var validation_types = [];
		if( typeof this.get("validation") === "string" ) {
			validation_types = [ this.get("validation") ];
		} else if( typeof this.get("validation") === "object" ) {
			validation_types = this.get("validation");
		} else {
			return true;
		}

		for( var index in validation_types ) {
			var validation = this.collection.validation[ validation_types[index] ];
			if( !validation ) {
				throw("Validation function `" + validation_types[index] + "` not defined!");
			}

			var result = validation.apply(this, [this.value()]);
			if( result !== true ) {
				if( typeof result === "string" ) {
					this.get_widget().set_validation_message.apply(this, [result]);
				}
				return false;
			} else {
				this.get_widget().set_validation_message.apply(this, [false]);
			}
		}

		return true;
	},
	value: function(val) {
		if( val != undefined ) {
			this.set({"value": val});
		}

		return this.get("value");
	}

});

var composerCollection = Backbone.Collection.extend({
	model: composerItem,
	widgets: {},
	validation: {}
});

(function($) {
	$.fn.extend({
		"composerWidgets": {},
		"composerValidation": {},
		"composer": function(data) {
			var collection = new composerCollection();
			collection.widgets = $.extend({}, $.fn.composerWidgets);
			collection.validation = $.extend({}, $.fn.composerValidation);

			collection.el = this;
			if( data ) {
				collection.add(data);
			}

			var methods = {
				"get": function(id) {
					return collection.get(id);
				},
				"add": function(data) {
					collection.add(data);
				},
				"remove": function(id) {
					collection.remove(id);
				},

				"addWidget": function(type, fn) {
					collection.widgets[type] = fn;
				},
				"addValidation": function(type, fn) {
					collection.validation[type] = fn;
				},
				"is_valid": function() {
					var is_valid = true;
					collection.each(function(item) { 
					   if( !item.is_valid() ) {
						   is_valid = false;
					   }
					});
					return is_valid;
				},
				"values": function() {
					var values = {};
					collection.each(function(item) {
						values[ item.get("id") ] = item.value();
					});
					return values;
				},
				"items": function() {
					return collection.models;
				},
				"bind": function( evt, fn ) {
					collection.bind( evt, fn );
				}
			};
			return methods;
		}
	});	
})(jQuery);


