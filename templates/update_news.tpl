<div id="newschart" class="box-news-piechart">
	<h3><a href="#"><%= news.chart.title %></a></h3>
	<canvas id="piechart" width="110px" height="110px">Piechart</canvas>
	<table id="piechart-table"><tbody>
	    <tr><td class="piechart-number"><%= news.chart.for %></td><td class="for"><%= texts.chartfor %></td></tr>
	    <tr><td class="piechart-number"><%= news.chart.fordelegated %></td><td class="for-delegated"><%= texts.chartdelegatedfor %></td></tr>
	    <tr><td class="piechart-number"><%= news.chart.against %></td><td class="against"><%= texts.chartagainst %></td></tr>
	    <tr><td class="piechart-number"><%= news.chart.againstdelegated %></td><td class="against-delegated"><%= texts.chartdelegatedagainst %></td></tr>
	</tbody></table>
</div>
<div id="newsgraph" class="box-news-bargraph">
	<h3><a href="#"><%= news.graph.title %></a></h3>
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
</div>
<div id="newspages" class="box-footer">
	<% if(news.activepage < news.pages) { var nextpage = ( news.activepage - 1 ) + 2; %><a href="#newscontent" class="button button-forward" onClick="update_news(<%= nextpage %>)"><%= texts.next %></a><% } else { %><a href="#" class="button button-forward"><%= texts.next %></a><% } %>
	<% if(news.activepage > 1) { %><a href="#newscontent" class="button button-backward" onClick="update_news(<%= (news.activepage - 1) %>)"><%= texts.previous %></a></li><% } else { %><a href="#" class="button button-backward"><%= texts.previous %></a><% } %>
</div>
