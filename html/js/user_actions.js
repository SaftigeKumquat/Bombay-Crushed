// This file contains all custom client side scripts

/**
 * Delete the links from the ini table pagination,
 * so onClick on these will be triggered, if JS is active.
 */
$(document).ready(function() {
	$("#inipages").find("a").attr("href", "#");
});

/**
 * If an initable pagination link is clicked,
 * get the update content from the server,
 * remove the old content and insert the new.
 */
function update_inis(page) {
	var url = "update_inis?page=" + page;
	/*$.get('update_inis', {page: page}, "test", function(data) {
  		$("#initable").remove();
		$("#inipages").remove();
		alert(data);
		var frag = "Some stuff";
		$("#inicontent").append(frag);
		$(data).appendTo('#inicontent')
	});*/
	$.ajax({ 
        	url: url,
        	type: "POST",
        	dataType: "text",
        	success: function(data) {
  			$("#initable").remove();
			$("#inipages").remove();
            		$("#inicontent").append(data);
        	}
    	});	
	return false;
}
