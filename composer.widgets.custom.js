var custom_generic_widget = $.extend({}, $.fn.composerWidgets["text"], {
	"initialize": function() {

		//initialize value, if it is not passed in
		if( !this.value() ) { this.value([""]); }

		$(this.get("el")).addClass("cTextInput");

		var html = '';
		if( this.get("label") ) {
			html += "<div class='cLabel'><label for='" + this.get("id") + "'>" + this.get("label") + "</label></div>";
		}
		html += "<div class='cInput'>";

		html += "<ul>";
		html += "</ul>";
		html += "<a href='#' class='cButton add'>Add</a>";

		html += "</div>";
		$(this.get("el")).html(html);

		//bind for value change
		var item = this;
		$(this.get("el")).find("a.add").bind("click", function(e) {
			e.preventDefault();
			var val = $.extend([],item.value());
			val.push("");
			item.value( val );

			if( item.get("add") ) {
				item.get("add").apply(this, [item.get("el").find("li:last")]);
			}

		});

		$("a.delete").live("click", function(e) {
			e.preventDefault();

			var index = $(this).attr("value");

			var index_el = item.get("el").find("li:eq(" + index + ")");
			if( item.get("delete") ) {
				item.get("delete").apply(this, [index_el]);
			}

			var val = $.extend([],item.value());
			val.splice(index, 1);
			item.value( val );
		});


		//placeholder handler
		$.fn.composerWidgets["text"].set_placeholder.apply(this);
		$.fn.composerWidgets["text"].set_tooltip.apply(this);

	},
	"set_value": function(value) {
		var val = this.value();
		var ul = this.get("el").find("ul").html("");

		for( var index in val ) {
			var el = $("<li></li>");
			ul.append(el);
			
			var method = {
				"id": this.get("id"),
				"value": val[index],
				"el": el,
				"setValue": function(item) {
					var el = this;
					return function(val) {
						item.value()[ el.index() ] = val;
					};
				}.apply(el, [this]),
				"generateDeleteButton": function() {
					return "<a href='#' class='cButton delete' value=" + index + ">Delete</a>";
				}
			};
			this.get("structure").apply(this, [method]);
		}			
	}
});

$.fn.composerWidgets["set"] = custom_generic_widget;
