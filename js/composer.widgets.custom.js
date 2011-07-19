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
					var value = that.value();
					var originIndex = ui.item.data("originIndex");
					var currentIndex = ui.item.index();
	
					var swapA = value[originIndex];
					var swapB = value[currentIndex];
	
					value[originIndex] = swapB;
					value[currentIndex] = swapA;
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

		var item = this;
		for( var index in val ) {
			var el = $( this.get("structure_wrapper") );
			el.addClass("cSetItem");
			set_el.append(el);
			
			var method = {
				"id": this.get("id"),
				"index": index,
				"value": val[index],
				"el": el,
				"setValue": function(item) {
					var el = this;
					return function(val) {
                        var value = $.extend([], item.value());
                        //var value = item.value();
                        value[ el.index() ] = val;
                        item.value( value );
						//item.value()[ el.index() ] = val;
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
		this.get("el").find("a.delete").click(function(e) {
			e.preventDefault();

            var index = $(this).parent().index();

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
