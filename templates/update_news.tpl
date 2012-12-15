<div id="newschart" class="box-news-piechart">
	<% include blocks/newschart.tpl %>
</div>
<div id="newsgraph" class="box-news-bargraph">
	<% include blocks/newsgraph.tpl %>
</div>
<div id="newspages" class="box-footer">
	<% if(news.activepage < news.pages) { var nextpage = ( news.activepage - 1 ) + 2; %><a href="#newscontent" class="button button-forward" onClick="update_news(<%= nextpage %>)"><%= texts.next %></a><% } else { %><a href="#" class="button button-forward"><%= texts.next %></a><% } %>
	<% if(news.activepage > 1) { %><a href="#newscontent" class="button button-backward" onClick="update_news(<%= (news.activepage - 1) %>)"><%= texts.previous %></a></li><% } else { %><a href="#" class="button button-backward"><%= texts.previous %></a><% } %>
</div>
