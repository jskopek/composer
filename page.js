var c;
$(document).ready(function() {
	var data = {
		"id": "username",
		"type": "text",
		//"value": "jms",
		"label": "Username",
		"validation": ["not_empty"],
		"shorter_than": 4,
		"placeholder": "jms",
		"tooltip": "This is a long tooltip that will help the user understand what the purpose of the username field is"
	};
	var data2 = {
		"id": "password",
		"type": "password",
		"label": "Password",
		"validation": ["longer_than"],
		"longer_than": 4
	};

	var dataset	= [data, data2];

	dataset.push({
		"id": "feedback",
		"type": "textarea",
		"tooltip": "Testing tooltip",
		"placeholder": "Testing placeholder",
		"label": "Feedback"
	});

	dataset.push({
		"id": "tos",
		"type": "checkbox",
		"value": true,
		"label": "I agree to the terms of service",
		"validation": ["not_empty", "longer_than"],
		"longer_than" : 4,
		"tooltip": "This is a test"
	});

	dataset.push({
		"id": "age",
		"type": "text",
		"number": true,
		//"value": "jms",
		"label": "Age",
		"validation": ["not_empty", "num_greater_than"],
		"num_greater_than": 0,
		"placeholder": "18",
		"tooltip": "This is a long tooltip that will help the user understand what the purpose of the username field is"
	});

	dataset.push({
		"id": "type",
		"type": "radio",
		"options": {
			"light": "Light - free",
			"premium": "Premium - $40 / year"
		},
		"label": "Choose your account type",
		"validation": ["not_empty", "longer_than"],
		"longer_than" : 400,
		"tooltip": "This is a test"
	});
    dataset.push({
        "id": "organization",
        "type": "select",
        "options": {
            "waterloo": "University of Waterloo",
            "uoit": "University of Ontario Institute of Technology",
            "laurier": "Wilfred Laurier University",
            "guelph": "University of Guelph"
        },
        "label": "Choose your university"
    });
	dataset.push({
		"id": "html_test",
		"type": "html",
		"value": "<h1>This is some custom html</h1>"
	});
    dataset.push({
        "id": "multiple_choice_good",
        "type": "set",
        "structure": function(row) {
			var html = "";
			html += row.generateSortButton();
			html += "<input type='text' value='" + row.value + "' style='width:80%'/>";
			html += row.generateDeleteButton();

			$(row.el).html(html);
			
			$(row.el).find("input").bind("change", function() {
				row.setValue( $(this).val() );
			});
		},
        "sortable": true,
        "validation": ["not_empty"],
        "label": "Multiple choices badass"
    });
    dataset.push({
        "id": "picker_numbers",
        "type": "picker",
        "options": ["1", "2", "3", "4"],
        "label": "Pick your number"
    });
    dataset.push({
        "id": "picker_strings",
        "type": "picker",
        "options": ["whales", "turtles", "lions", "people"],
        "value": "turtles",
        "label": "Pick your string"
    });
    dataset.push({
        "id": "sorting_test",
        "type": "set",
        "structure": function(row) {
            var html = "";
            html += row.generateSortButton();
            html += "<input type='text' value='" + row.value + "' style='width:75%' />";
            html += row.generateUploadButton();
            html += row.generateDeleteButton();

            $(row.el).html(html);

            $(row.el).find("input").bind("change", function() {
                row.setValue($(this).val());
            });
        },
        "sortable": true,
        "label": "Ordering question"
    });

	c = $("#form1 .form_container").composer();
	c.add( dataset );
	c.bind("change", function() {
		$("#status span").html( c.is_valid() ? "VALID :)" : "INVALID :(" );
	});
	$("#form1 a").click(function(e) {
		e.preventDefault();
		$("#status span").html( c.is_valid() ? "VALID :)" : "INVALID :(" );

		console.log( c.values() );
	});
	//`c.get("username").set({"value": "blablabla"});

	var c2 = $("#form2 .form_container").composer();
	c2.add( data2 );

	//events
	c.bind("change", function() { console.log("form.change"); });
	c.bind("add", function() { console.log("form.add"); });
	c.bind("remove", function() { console.log("form.remove"); });
	c.bind("valid", function() { console.log("form.valid"); });
	c.bind("invalid", function() { console.log("form.invalid"); });

	c.get("username").bind("change", function() { console.log("username.change"); });
	c.get("username").bind("click", function() { console.log("username.click"); });
	c.get("username").bind("valid", function() { console.log("username.valid"); });
	c.get("username").bind("invalid", function() { console.log("username.invalid"); });
});
