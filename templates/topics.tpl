<div id="contentcontainer" class="container">

	<div class="row">
		<div class="twelvecol last">
			<a name="top"></a>

			<% for(var i = 0; i < units.length; i++) { %><a class="button" href="#<%= units[i].id %>"><%= units[i].description %></a><% } %>
		</div>
	</div>

	<% for(var i = 0; i < units.length; i++) { %><div class="row">
		<div class="twelvecol box last">
			<a name="<%= units[i].id %>"></a>
			<h2><%= units[i].description %></h2>
			<label class="table-label" for="select_fiter"><%= texts.sortedby %>:</label>
			<select id="select-filter" name="filter" onchange="update_areas_table(<%= units[i].id %>, this.value)">
				<option value="1"><%= texts.nummembers %></option>
				<option value="2"><%= texts.alphabetical %></option>
			</select>
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
				for(var j = 0; j < units[i].areas.length; j++) { %><tr<%
					if(odd == true) { odd = false; %> class="odd"<% }
					else { odd = true; } %>>
					<td><h3><a href="<%= meta.baseurl %>/area?area_id=<%= units[i].areas[j].id %>"><%= units[i].areas[j].name %></a></td>
					<td><a href="#"><%= units[i].areas[j].topics.status1 %></a></td>
					<td><a href="#"><%= units[i].areas[j].topics.status2 %></a></td>
					<td><a href="#"><%= units[i].areas[j].topics.status3 %></a></td>
					<td><a href="#"><%= units[i].areas[j].topics.status4 %></a></td>
					<td><a href="#"><%= units[i].areas[j].topics.status5 %></a></td>
					<td><a href="#"><%= units[i].areas[j].topics.status6 %></a></td>
				</tr><% } %>
			</table>
			<div class="box-footer"><a class="button" href="#top"><%= texts.totop %></a></div>
		</div>
	</div><% } %>

	<div id="push"></div>
</div>
