// This file contains all custom client side scripts
var draw_pie = function() {
	///// STEP 0 - setup
	
	// source data table and canvas tag
	var data_table = document.getElementById('piechart-table');
	var canvas = document.getElementById('piechart');
	var td_index = 0; // which TD contains the data
	var colors = new Array();
	colors[0] = "rgb(75,175,50)";
	colors[1] = "rgb(65,148,23)";
	colors[2] = "rgb(226,23,27)";
	colors[3] = "rgb(178,27,24)"; 
	
	///// STEP 1 - Get the, get the, get the data!
	
	// get the data[] from the table
	var tds, data = [], value = 0, total = 0;
	var trs = data_table.getElementsByTagName('tr'); // all TRs
	
	for (var i = 0; i < trs.length; i++) {
	    tds = trs[i].getElementsByTagName('td'); // all TDs
	
	    if (tds.length === 0) continue; //  no TDs here, move on
	
	    // get the value, update total
	    value  = parseFloat(tds[td_index].innerHTML);
	    data[data.length] = value;
	    total += value;
	
	    //  color
	    trs[i].style.backgroundColor = colors[i]; // color this TR
	
	}
	
	
	///// STEP 2 - Draw pie on canvas
	
	
	// exit if canvas is not supported
	if (typeof canvas.getContext === 'undefined') {
	    return;
	}
	
	// get canvas context, determine radius and center
	var ctx = canvas.getContext('2d');
	var canvas_size = [canvas.width, canvas.height];
	var radius = Math.min(canvas_size[0], canvas_size[1]) / 2;
	var center = [canvas_size[0]/2, canvas_size[1]/2];
	
	var sofar = 0; // keep track of progress
	// loop the data[]
	for (var piece in data) {
	
	    var thisvalue = data[piece] / total;
	
	    ctx.beginPath();
	    ctx.moveTo(center[0], center[1]); // center of the pie
	    ctx.arc(  // draw next arc
	        center[0],
	        center[1],
	        radius,
	        Math.PI * (- 0.5 + 2 * sofar), // -0.5 sets set the start to be top
	        Math.PI * (- 0.5 + 2 * (sofar + thisvalue)),
	        false
	    );
	
	    ctx.lineTo(center[0], center[1]); // line back to the center
	    ctx.closePath();
	    ctx.fillStyle = colors[piece];    // color
	    ctx.fill();
	
	    sofar += thisvalue; // increment progress tracker
	}
	
	
	///// DONE!
	
	
	// utility - generates random color
	function getColor() {
	    var rgb = [];
	    for (var i = 0; i < 3; i++) {
	        rgb[i] = Math.round(100 * Math.random() + 155) ; // [155-255] = lighter colors
	    }
	    return 'rgb(' + rgb.join(',') + ')';
	}
} 

/**
 * If an initable pagination link is clicked,
 * get the update content from the server,
 * remove the old content and insert the new.
 */
function update_inis(page, timeline) {
	var url = "update_inis?page=" + page + "&timeline=" + timeline;
	$.ajax({ 
        	url: url,
        	type: "POST",
		data: { page: page },
        	dataType: "text",
        	success: function(data) {
  			$("#initable").remove();
			$("#inipages").remove();
            		$("#inicontent").append(data);
        	}
    	});	
	return false;
}

/**
 * If an news pagination link is clicked,
 * get the update content from the server,
 * remove the old content and insert the new.
 */
function update_news(page) {
	var url = "update_news?newspage=" + page;
	$.ajax({ 
        	url: url,
        	type: "POST",
		data: { page: page },
        	dataType: "text",
        	success: function(data) {
  			$("#newschart").remove();
  			$("#newsgraph").remove();
			$("#newspages").remove();
            $("#newscontent").append(data);
            draw_pie();
        	}
    	});	
	return false;
}

/**
 * If an opinion pagination link is clicked,
 * get the update content from the server,
 * remove the old content and insert the new.
 */
function update_opinions(page, suggestion_id) {
	var url = "update_opinions?opinionspage=" + page + '&suggestion_id=' + suggestion_id;
	$.ajax({
		url: url,
		type: "POST",
		data: { opinionspage: page },
		dataType: "text",
		success: function(data) {
			var $container = $('#opiniondiv');
			$container.empty();
			$container.append(data);
		}
	});
	return false;
}

/**
 * Delete the links from the ini and news table pagination,
 * so onClick on these will be triggered, if JS is active.
 * 
 * I know onClick is dirty, but have not found another way 
 * to pass the page parameter from the links.
 */
$(document).ready(function() {
	$("#inipages").find("a").attr("href", "#");
	$("#newspages").find("a").attr("href", "#newscontent");

	$("#filterslide").click(function(){
  	$("#filter").slideToggle("slow");
  	return false;

	});

	$("#detailslide").click(function(){
  	$("#initiative-detail").slideToggle("slow");
  	return false;

	});

	$("#historyslide").click(function(){
  	$("#initiative-history").slideToggle("slow");
  	return false;

	});
	
	draw_pie();
});
