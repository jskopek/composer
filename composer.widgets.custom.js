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
		html += "<a href='#' class='cButton'>Add</a>";

		html += "</div>";
		$(this.get("el")).html(html);

		//bind for value change
		var item = this;
		$(this.get("el")).find("a").bind("click", function(e) {
			e.preventDefault();
			var val = $.extend([],item.value());
			val.push("");
			item.value( val );
		});

		//placeholder handler
		$.fn.composerWidgets["text"].set_placeholder.apply(this);
		$.fn.composerWidgets["text"].set_tooltip.apply(this);

	},
	"set_value": function(value) {
		var val = this.value();
		var html = "";
		for( var index in val ) {
			var structure = this.get("structure");
			structure = structure.replace(/\{\{\s*value\s*}}/, val[index]);
			structure = structure.replace(/\{\{\s*id\s*}}/, this.get("id"));
			structure = structure.replace(/\{\{\s*index\s*}}/, index);

			html += "<li>" + structure + "</li>";
		}			
		this.get("el").find("ul").html(html);
	}
});

$.fn.composerWidgets["set"] = custom_generic_widget;
