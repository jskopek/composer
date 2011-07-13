var composerItem = Backbone.Model.extend({
	initialize: function() {
		if( !this.get("id") && !this.get("type") ) {
			alert("Missing `id` or `type` properties!");
		}

		var el = $("<div></div>");
		$(this.collection.el).append(el);
		this.set({"el": el});

		var widget = this.get_widget();
		widget.initialize.apply(this);
		//this.collection.el.append(el);
	},
	get_widget: function() {
		var widget = this.collection.widgets[this.get("type")];
		if( !widget ) {
			alert("We don't know how to handle elements of type `" + this.get("type") + "`");
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
	//initialize: function(a,b) {
	//},
	//add: function(a,b,c) {
		 //}
});
var composer = function(el, data) {
	this.collection = new composerCollection();

	this.collection.el = el;
	if( data ) {
		this.collection.add(data);
	}

	//interfaces for collection tasks
	this.add = function(data) {
		this.collection.add(data);
	}

	//interfaces for adding widgets and validation
	this.addWidget = function(type, fn) {
		this.collection.widgets[type] = fn;
	}
	this.addValidation = function(type, fn) {
		this.collection.validation[type] = fn;
	}
}

