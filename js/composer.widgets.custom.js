var custom_generic_widget = $.extend({}, $.fn.composerWidgets["text"], {
	"initialize": function() {

		//initialize value, if it is not passed in
		if( !this.value() ) { this.value([""]); }
		if( !this.get("set_wrapper") ) { this.set({"set_wrapper": "<ul class='cSetWrapper'></ul>"}); }
		if( !this.get("structure_wrapper") ) { this.set({"structure_wrapper": "<li></li>"}); }

		$(this.get("el")).addClass("cTextInput");

		var html = '';
		if( this.get("label") ) {
			html += "<div class='cLabel'><label for='" + this.get("id") + "'>" + this.get("label") + "</label></div>";
		}
		html += "<div class='cInput'>";
			html += this.get("set_wrapper");
			html += "<a href='#' class='cButton add'>Add</a>";
		html += "</div>";
		$(this.get("el")).html(html);

		var that = this;
		if( this.get("sortable") && $.fn.sortable ) {
			$(this.get("el")).find(".cSetWrapper").sortable({
				"axis": "y",
				"handle": ".cSortHandle",
				"containment": "parent",
				"start": function(evt, ui) {
					//http://css.dzone.com/articles/keeping-track-indexes-while
					ui.item.data("originIndex", ui.item.index());
				},
				"stop": function(evt, ui) {
					var value = $.extend([], that.value());
					var originIndex = ui.item.data("originIndex");
					var currentIndex = ui.item.index();

					//remove the value from the origin index
					var originValue = value.splice(originIndex, 1);

					//insert the value at the new index
					value.splice(currentIndex, 0, originValue[0]);
	
					that.value( value );
				}
			});
		}

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

		//placeholder handler
		$.fn.composerWidgets["text"].set_placeholder.apply(this);
		$.fn.composerWidgets["text"].set_tooltip.apply(this);

	},
	"set_value": function(value) {
		var val = this.value();
		var set_el = this.get("el").find(".cSetWrapper").html("");

		//we initize the elements first
		for( var index in val ) {
			var el = $( this.get("structure_wrapper") ).addClass("cSetItem");
			set_el.append(el);
		}

		//we call the 'structure' method for each initalized el
		//we do this seperately because the structure functions may modify the value,
		//which causes a recursive loop
		for( index in val ) {
			el = this.get("el").find(".cSetWrapper .cSetItem:eq(" + index + ")");
			

			var item = this;
			var method = {
				"id": this.get("id"),
				"index": index,
				"el": el,
				"value": function(item) {
					var el = this;
					return function(val) {
						var value = $.extend([], item.value());

						if( val ) {
							//var value = item.value();
							value[ el.index() ] = val;
							item.value( value );
							//item.value()[ el.index() ] = val;
						}

						return value[ el.index() ];
					};
				}.apply(el, [this]),
				"generateSortButton": function() {
					if( item.get("sortable") && $.fn.sortable ) {
						return "<span class='cSortHandle'>|||</span>";
					} else {
						return "";
					}
				},
				"generateDeleteButton": function() {
					return "<a href='#' class='cButton delete'>Delete</a>";
				},
                "generateUploadButton": function() {
                    return "<a href='#' class='cButton upload'>Upload</a>";
                }
			};
			this.get("structure").apply(this, [method]);
		}			


        // Bind delete button on newly created set item
        this.get("el").find("a.delete").unbind("click").click(function(e) {
			e.preventDefault();

			var index = $(this).parents(".cSetItem").index();

			var index_el = item.get("el").find(".cSetItem:eq(" + index + ")");
			if( item.get("delete") ) {
				item.get("delete").apply(this, [index_el]);
			}

			var val = $.extend([],item.value());
			val.splice(index, 1);
			item.value( val );
		});
	}
});

$.fn.composerWidgets["set"] = custom_generic_widget;
