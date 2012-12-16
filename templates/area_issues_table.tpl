<div class="tencol box last" id="issues-table">
	<h2><%= texts.area %> „<%= area.name %>“ <%= area.unit %></h2>
		<div class="multiple-filter">
			<label class="table-label" for="select_fiter"><%= texts.state %>:</label>	
			<select id="select-filter" name="filter" onchange="update_issues_table(<%= area.id %>, this.value, 1, <%= area.memberspage %>, <%= selected_issue_sort_criteria %>);">
				<option <% if(selected_issue_state == '1') { %> selected="selected" <% } %> value="1"><%= texts.open %></option>
				<option <% if(selected_issue_state == '2') { %> selected="selected" <% } %> value="2"><%= texts.status1 %></option>
				<option <% if(selected_issue_state == '3') { %> selected="selected" <% } %> value="3"><%= texts.status2 %></option>
				<option <% if(selected_issue_state == '4') { %> selected="selected" <% } %> value="4"><%= texts.status3 %></option>		
				<option <% if(selected_issue_state == '5') { %> selected="selected" <% } %> value="5"><%= texts.status4 %></option>		
				<option <% if(selected_issue_state == '6') { %> selected="selected" <% } %> value="6"><%= texts.status5 %></option>		
				<option <% if(selected_issue_state == '7') { %> selected="selected" <% } %> value="7"><%= texts.status6 %></option>		
				<option <% if(selected_issue_state == '8') { %> selected="selected" <% } %> value="8"><%= texts.all %></option>		
			</select>
		</div>
		<div class="multiple-filter unavailable">
			<label class="table-label" for="select_fiter2"><%= texts.mystatus %>:</label>	
			<select id="select-filter2" name="filter">							
				<option value="1"><%= texts.all %></option>
				<option value="2"><%= texts.interested %></option>
				<option value="3"><%= texts.supported %></option>
				<option value="4"><%= texts.potsupported %></option>		
				<option value="5"><%= texts.initiated %></option>		
			</select>
		</div>	
		<div class="multiple-filter unavailable">			
			<label class="table-label" for="select_fiter3"><%= texts.sortedby %>:</label>	
			<select id="select-filter2" name="select_filter3" onchange="update_issues_table(<%= area.id %>, <%= selected_issue_state %>, 1, <%= area.memberspage %>, this.value);">
				<option <% if(selected_issue_sort_criteria == '1') { %> selected="selected" <% } %>value="1"><%= texts.maxpotsupporter %></option>
				<option <% if(selected_issue_sort_criteria == '2') { %> selected="selected" <% } %>value="2"><%= texts.maxsupporter %></option>
				<option <% if(selected_issue_sort_criteria == '3') { %> selected="selected" <% } %>value="3"><%= texts.population %></option>
				<option <% if(selected_issue_sort_criteria == '4') { %> selected="selected" <% } %>value="4"><%= texts.newest %></option>		
				<option <% if(selected_issue_sort_criteria == '5') { %> selected="selected" <% } %>value="5"><%= texts.oldest %></option>		
			</select>
		</div>				
		<table class="table-area">
			<tr>
				<th><%= texts.issue %></th>
				<th><%= texts.state %></th>
				<th><%= texts.inis %></th>
				<th><%= texts.status %></th>
			</tr>

			<% var odd = true;
			for(var i = 0; i < area.issues.length; i++) { %>
			<tr <% if(odd) { %>class="odd"<% } else { %>class="even"<% } %>>
				<td><a href="#"><%= texts.issue %> #<%= area.issues[i].id %></a> <% if(area.issues[i].iwatchissue) { %><img title="<%= texts.iwatchissue %>" src="<%= meta.baseurl %>/img/eye.png"/><% } %></td>
				<td><%= area.issues[i].status %></td>
				<td><h3><a href="<%= meta.baseurl %>/initiative?initiative_id=<%= area.issues[i].initiative_id %>"><%= area.issues[i].title %></a><% if(area.issues[i].isupportini) { %><img title="<%= texts.isupportini %>" src="<%= meta.baseurl %>/img/thumb-up.png"/><% } %></h3></td>
				<td>
					<ul class="bargraph" title="<%= area.issues[i].supporter %> <%= texts.supporter %> / <%= area.issues[i].potsupporter %> <%= texts.potsupporter %> / <%= area.issues[i].uninterested %> <%= texts.uninterested %>">
						<li class="bargraph-quorum" style="left:<%= area.issues[i].quorum %>%;"></li>
						<li class="bargraph-support" style="width:<%= area.issues[i].support %>%"></li>
						<li class="bargraph-potential" style="width:<%= area.issues[i].potential %>%"></li>
						<li class="bargraph-uninvolved" style="width:<%= area.issues[i].uninvolved %>%"></li>	
					</ul>
				</td>	
			</tr>
			<% if(area.issues[i].alternativeinis) {						
				for(var a = 0; a < area.issues[i].alternativeinis.length; a++) { %>
			<tr class="table-alternateinitiative<% if(odd) { %> odd<% } %>">
				<td></td>
				<td></td>
				<td><h3><a href="<%= meta.baseurl %>/initiative?initiative_id=<%= area.issues[i].alternativeinis[a].id %>"><%= area.issues[i].alternativeinis[a].title %></a><% if(area.issues[i].alternativeinis[a].isupportini) { %><img title="<%= texts.isupportini %>" src="<%= meta.baseurl %>/img/thumb-up.png"/><% } %></h3></td>
				<td>
					<ul class="bargraph" title="<%= area.issues[i].alternativeinis[a].supporter %> <%= texts.supporter %> / <%= area.issues[i].alternativeinis[a].potsupporter %> <%= texts.potsupporter %> / <%= area.issues[i].alternativeinis[a].uninterested %> <%= texts.uninterested %>">
						<li class="bargraph-quorum" style="left:<%= area.issues[i].quorum %>%;"></li>
						<li class="bargraph-support" style="width:<%= area.issues[i].alternativeinis[a].support %>%"></li>
						<li class="bargraph-potential" style="width:<%= area.issues[i].alternativeinis[a].potential %>%"></li>
						<li class="bargraph-uninvolved" style="width:<%= area.issues[i].alternativeinis[a].uninvolved %>%"></li>	
					</ul>
				</td>	
			</tr>
			<% 	}
			} if(odd) { odd = false; } else { odd = true; }
			} %>
																		
		</table>

	<div class="box-footer">
		<ul class="pagination">
			<% if(area.issuespage == 1) { %><li class="button button-backward-off"><%= texts.backshort %></li><% } else { %><li><a class="button button-backward" href="<%= meta.baseurl %>/area?area_id=<%= area.id %>&page=<%= area.issuespage - 1 %>&memberpage=<%= area.memberspage %>"><%= texts.backshort %></a></li><% }
			if(area.issuespages > 1) {				
				for(var a = 1; a <= area.issuespages; a++) {
					if(a == area.issuespage) { %>
						<li class="active"><%= a %></li>
					<% }
					else { %>
						<li><a href="<%= meta.baseurl %>/area?area_id=<%= area.id %>&page=<%= a %>&memberpage=<%= area.memberspage %>"><%= a %></a></li>
					<% }
				}
			}
			var nextpage = ( area.issuespage - 1 ) + 2;
			if(area.issuespage < area.issuespages) { %><li><a class="button button-forward" href="<%= meta.baseurl %>/area?area_id=<%= area.id %>&page=<%= nextpage %>&memberpage=<%= area.memberspage %>"><%= texts.forward %></a></li><% } else { %><li class="button button-forward-off"><%= texts.forward %></li><% } %>
		</ul>
	</div>
</div>
