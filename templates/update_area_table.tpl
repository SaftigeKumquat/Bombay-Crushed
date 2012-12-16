<table>
	<tr class="themetable-firstrow">
		<th class="themetable-status0"></th>
		<th class="themetable-status1"><%= texts.status1 %></th>
		<th class="themetable-status2"><%= texts.status2 %></th>
		<th class="themetable-status3"><%= texts.status3 %></th>
		<th class="themetable-status4"><%= texts.status4 %></th>
		<th class="themetable-status5"><%= texts.status5 %></th>
		<th class="themetable-status6"><%= texts.status6 %></th>
	</tr>
	<% var odd = true;
	for(var j = 0; j < areas.length; j++) { %><tr<%
		if(odd == true) { odd = false; %> class="odd"<% }
		else { odd = true; } %>>
		<td><h3><a href="<%= meta.baseurl %>/area?area_id=<%= areas[j].id %>"><%= areas[j].name %></a></td>
		<td><a href="<%= meta.baseurl %>/area?area_id=<%= areas[j].id %>&issue_state=2"><%= areas[j].topics.status1 %></a></td>
		<td><a href="<%= meta.baseurl %>/area?area_id=<%= areas[j].id %>&issue_state=3"><%= areas[j].topics.status2 %></a></td>
		<td><a href="<%= meta.baseurl %>/area?area_id=<%= areas[j].id %>&issue_state=4"><%= areas[j].topics.status3 %></a></td>
		<td><a href="<%= meta.baseurl %>/area?area_id=<%= areas[j].id %>&issue_state=5"><%= areas[j].topics.status4 %></a></td>
		<td><a href="<%= meta.baseurl %>/area?area_id=<%= areas[j].id %>&issue_state=6"><%= areas[j].topics.status5 %></a></td>
		<td><a href="<%= meta.baseurl %>/area?area_id=<%= areas[j].id %>&issue_state=7"><%= areas[j].topics.status6 %></a></td>
	</tr><% } %>
</table>
