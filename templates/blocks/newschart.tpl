<h3><a href="<% if(news.chart.id !== undefined) { %><%= meta.baseurl %>/initiative?initiative_id=<%= news.chart.id %><% } else { %>#<% } %>"><%= news.chart.title %></a></h3>
<canvas id="piechart" width="110px" height="110px">Piechart</canvas>
<table id="piechart-table"><tbody>
	<% if( news.chart.fordelegated !== undefined && news.chart.againstdelegated !== undefined ) { %>
		<tr><td class="piechart-number"><%= news.chart.for %></td><td class="for"><%= texts.chartfor %></td></tr>
		<tr><td class="piechart-number"><%= news.chart.fordelegated %></td><td class="for-delegated"><%= texts.chartdelegatedfor %></td></tr>
		<tr><td class="piechart-number"><%= news.chart.against %></td><td class="against"><%= texts.chartagainst %></td></tr>
		<tr><td class="piechart-number"><%= news.chart.againstdelegated %></td><td class="against-delegated"><%= texts.chartdelegatedagainst %></td></tr>
	<% } else { %>
		<tr><td class="piechart-number"><%= news.chart.for %></td><td class="for"><%= texts.chartoverallfor %></td></tr>
		<tr style="visibility:collapse"><td class="piechart-number">0</td><td class="for-delegated"><%= texts.chartdelegatedfor %></td></tr>
		<tr><td class="piechart-number"><%= news.chart.against %></td><td class="against"><%= texts.chartoverallagainst %></td></tr>
		<tr style="visibility:collapse"><td class="piechart-number">0</td><td class="against-delegated"><%= texts.chartdelegatedagainst %></td></tr>
	<% } %>
</tbody></table>
