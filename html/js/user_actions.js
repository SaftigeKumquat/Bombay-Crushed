// This file contains all custom client side scripts

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
});

/**
 * If an initable pagination link is clicked,
 * get the update content from the server,
 * remove the old content and insert the new.
 */
function update_inis(page) {
	var url = "update_inis?page=" + page;
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
        	}
    	});	
	return false;
}
