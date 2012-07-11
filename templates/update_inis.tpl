<table id="initable">
	<tr>
		<th><%= texts.ini %></th>
		<th><%= texts.unit %></th>
		<th><%= texts.support %></th>
		<th><%= texts.status %></th>
	</tr>
	<% var odd = true;
	for(var i = 0; i < inis.length; i++) { %>
		<tr<% 
		if(inis[i].alternativeid > 0) {
			%> class="table-alternativeinitiative"<% }
		else {
			if(odd == true) { 
				odd = false; 
				%> class="odd"<% } 
			else { 
				odd = true; }
		}					
		%>>
			<td><h3><a href="#"><%= inis[i].title %></a></h3><% 
			if(!inis[i].hasalternatives) {
				%><a href='#'><%= inis[i].area %></a><% } %></td>
			<td><%= inis[i].unit %></td>
			<td>
				<ul class="bargraph" title="<%= inis[i].supporter %> <%= texts.supporter %> / <%= inis[i].potsupporter %> <%= texts.potsupporter %> / <%= inis[i].uninterested %> <%= texts.uninterested %>">
					<li class="bargraph-quorum" style="left:<%= inis[i].quorum %>%;"></li>
					<li class="bargraph-support" style="width:<%= inis[i].support %>%"></li>
					<li class="bargraph-potential" style="width:<%= inis[i].potential %>%"></li>
					<li class="bargraph-uninvolved" style="width:<%= inis[i].uninvolved %>%"></li>
				</ul>
			</td>
			<td><% if(inis[i].status == texts.tablevote) { %><span class="table-vote"><% } %><%= inis[i].status %><% 
				if(inis[i].status == texts.tablevote) { %></span><% }						
				if(inis[i].delegate) { 
					%><p class="table-delegate"><a href="#"><img title="<%= texts.delegationend %>" src="<%= inis[i].delegate.picsmall %>"/></a></p><%
				} %></td>
		</tr><%
	} %>
</table>
<div id="inipages" class="box-footer">			
	<ul class="pagination">
		<% if(initable.activepage == 1) { %><li class="button button-backward-off"><%= texts.backshort %></li><% } else { %><li><a class="button button-backward" href="#"  onClick="update_inis(<%= ( initable.activepage - 1 ) %>)"><%= texts.backshort %></a></li><% }
		for(var i = 1; i <= initable.pages; i++) {
			if(i == initable.activepage) { %>
				<li class="active"><%= i %></li>
			<% }
			else { %>
				<li><a href="#" onClick="update_inis(<%= i %>)"><%= i %></a></li>	
			<% } 
		} 
		var nextpage = ( initable.activepage - 1 ) + 2;
		if(initable.activepage != initable.pages) { %><li><a class="button button-forward" href="#" onClick="update_inis(<%= nextpage %>)"><%= texts.forward %></a></li><% } else { %><li class="button button-forward-off"><%= texts.forward %></li><% } %>
	</ul>				 
</div>
