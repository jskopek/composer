$.fn.composerWidgets["set"] = $.extend(
    {},
    $.fn.composerWidgets["generic_widget_generator"](function() {
        var html = "";
        html += this.get("structure");
        
        // TODO: add "Add" button
        html += "<input type='submit'>Add</input>";

        html += "<span class='error'></span>";
        return html;
    }),
    {
        "set_value": function(value) {
            this.get("set_value")(this.get("el"), value);
        }
    }
);
