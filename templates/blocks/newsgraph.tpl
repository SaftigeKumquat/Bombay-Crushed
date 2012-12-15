<h3><a href="<% if(news.graph.id !== undefined) { %><%= meta.baseurl %>/initiative?initiative_id=<%= news.graph.id %><% } else { %>#<% } %>"><%= news.graph.title %></a></h3>
<% if(news.graph.quorum) { %> 
<ul class="bargraph bargraph-big" title="<%= news.graph.supporter %> <%= texts.supporter %> / <%= news.graph.potsupporter %> <%= texts.potsupporter %> / <%= news.graph.uninterested %> <%= texts.uninterested %>">
	<li class="bargraph-quorum" style="left:<%= news.graph.quorum %>%;"></li>
	<li class="bargraph-support" style="width:<%= news.graph.support %>%"></li>
	<li class="bargraph-potential" style="width:<%= news.graph.potential %>%"></li>
	<li class="bargraph-uninvolved" style="width:<%= news.graph.uninvolved %>%"></li>
</ul>
<ul>
	<li><a href="#" class="for"><%= news.graph.supporter %> <%= texts.supporter %></a></li>
	<li><a href="#"><%= news.graph.potsupporter %> <%= texts.potsupporter %></a></li>
	<li><%= news.graph.uninterested %> <%= texts.uninvolved %></li>
</ul>
<% } %> 
