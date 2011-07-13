var composerItem = Backbone.Model.extend({
	initialize: function() {
		if( !this.get("id") && !this.get("type") ) {
			throw("Missing `id` or `type` properties!");
		}

		var el = $("<div></div>");
		$(this.collection.el).append(el);
		this.set({"el": el});

		var widget = this.get_widget();
		widget.initialize.apply(this);
	},
	get_widget: function() {
		var widget = this.collection.widgets[this.get("type")];
		if( !widget ) {
			throw("We don't know how to handle elements of type `" + this.get("type") + "`");
		}
		return widget;
	},
	validate: function() {
	},
	value: function(val) {
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
				"add": function(data) {
					collection.add(data);
				},
				"addWidget": function(type, fn) {
					collection.widgets[type] = fn;
				},
				"addValidation": function(type, fn) {
					collection.validation[type] = fn;
				}
			};
			return methods;
		}
	});	
})(jQuery);


