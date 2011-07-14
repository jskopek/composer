$.fn.composerWidgets["set"] = {
    "initialize": function() {
        debugger;
        var html = "";
        var options = this.get("options");

        var counter = 0;
        for (var value in options) {
            var id = this.get("id") + "_" + counter; counter++;

        }

        html += "<span class='error'></span>";
        $(this.get("el")).html(html);
    },
    "set_value": function(value) {
        this.get("set_value")(this.get("el"), value);
    }
};
