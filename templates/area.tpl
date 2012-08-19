<div id="contentcontainer" class="container">
	<div class="row">
		<div class="twelvecol nobox first">
			
		</div>
	</div>
	<div class="row">

		<div class="twocol nobox first">
			<% if(area.member) { %>
			<h2><%= texts.membership %></h2>
			<div class="memberbox"><p><%= texts.iammember %></p></div>
			<% } %>

			<h2><%= texts.options %></h2>
			<ul id="personal-menu">
				<% if(area.member) { %>
				<li id="personal-menu-nomember"><a href="#"><%= texts.endmembership %></p></a></li>
				<% } else { %>
				<li id="personal-menu-member"><a href="#"><%= texts.becomemember %></a></li>
				<% } %>
				
				<% if(area.delegate) { %>
				<li><a href="#"><span>+</span><%= texts.changedelegation %></a></li>
				<li id="personal-menu-delegate"><a href="#"><img src="<%= meta.baseurl %>/<%= area.delegate.picsmall %>" alt="<%= texts.profilepic %>" /><p><%= area.delegate.name %> <%= texts.removedelegationarea %></p></a></li>
				<% } else { %>
				<li><a href="#"><span>+</span><%= texts.delegatearea %></a></li>
				<% } %>
			</ul>
		</div>
		<div class="tencol box last">
			<h2><%= texts.area %> „<%= area.name %>“ <%= area.unit %></h2>
				<div class="multiple-filter">
					<label class="table-label" for="select_fiter"><%= texts.state %>:</label>	
					<select id="select-filter" name="filter">							
						<option value="1"><%= texts.open %></option>
						<option value="2"><%= texts.status1 %></option>
						<option value="3"><%= texts.status2 %></option>
						<option value="4"><%= texts.status3 %></option>		
						<option value="5"><%= texts.status4 %></option>		
						<option value="6"><%= texts.status5 %></option>		
						<option value="7"><%= texts.status6 %></option>		
						<option value="8"><%= texts.all %></option>		
					</select>
				</div>
				<div class="multiple-filter">
					<label class="table-label" for="select_fiter2"><%= texts.mystatus %>:</label>	
					<select id="select-filter2" name="filter">							
						<option value="1"><%= texts.all %></option>
						<option value="2"><%= texts.interested %></option>
						<option value="3"><%= texts.supported %></option>
						<option value="4"><%= texts.potsupported %></option>		
						<option value="5"><%= texts.initiated %></option>		
					</select>
				</div>	
				<div class="multiple-filter">			
					<label class="table-label" for="select_fiter3"><%= texts.sortedby %>:</label>	
					<select id="select-filter2" name="filter">							
						<option value="1"><%= texts.maxpotsupporter %></option>
						<option value="2"><%= texts.maxsupporter %></option>
						<option value="3"><%= texts.population %></option>
						<option value="4"><%= texts.newest %></option>		
						<option value="5"><%= texts.oldest %></option>		
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
	</div>
	<div class="row">
		<div class="twocol nobox">
		</div>
		<div class="sevencol box">
			<h2><%= texts.delegations %> (<%= area.delegationnumber %>)</h2>
				<% for(var i = 0; i < area.delegations.length; i++) { %>
				<div class="box-delegate-info box-delegation">
					<a href="#"><img src="<%= meta.baseurl %>/<%= area.delegations[i].delegationstart.picsmall %>" alt="<%= texts.profilepic %>"/><%= area.delegations[i].delegationstart.name %></a>
					<% for(var a = 0; a < area.delegations[i].delegations.length; a++) { %>
					<img class="delegate-arrow" src="<%= meta.baseurl %>/img/arrow.png" alt="<%= texts.delegatesto %>"/>
					<a href="#"><img src="<%= meta.baseurl %>/<%= area.delegations[i].delegations[a].picsmall %>" alt="<%= texts.profilepic %>"/><%= area.delegations[i].delegations[a].name %></a>
					<% } %>
				</div>
				<% } %>

			<div class="box-footer">
				<ul class="pagination">
					<% if(area.delegationpage == 1) { %><li class="button button-backward-off"><%= texts.backshort %></li><% } else { %><li><a class="button button-backward" href="#"><%= texts.backshort %></a></li><% }
					for(var a = 1; a <= area.delegationpages; a++) {
						if(a == area.delegationpage) { %>
							<li class="active"><%= a %></li>
						<% }
						else { %>
							<li><a href="#"><%= a %></a></li>
						<% }
					}
					var nextpage = ( area.delegationpage - 1 ) + 2;
					if(area.delegationpage < area.delegationpages) { %><li><a class="button button-forward" href="#"><%= texts.forward %></a></li><% } else { %><li class="button button-forward-off"><%= texts.forward %></li><% } %>
				</ul>
			</div>			
		</div>
		
		<div class="threecol box last">
			<h2><%= texts.members %> (<%= area.membernumber %>)</h2>
			<div class="box-description">
				<p><%= texts.areamembersinfo %></p>

				<label class="table-label" for="select_fiter"><%= texts.sortedby %>:</label>	
				<select id="select-filter" name="filter">							
					<option value="1"><%= texts.atoz %></option>
					<option value="2"><%= texts.ztoa %></option>
					<option value="3"><%= texts.newest %></option>
					<option value="3"><%= texts.oldest %></option>
				</select>

			</div>	
			
				<% for(var i = 0; i < area.members.length; i++) { %>
				<div class="box-delegate-info box-supporters<% if(area.members[i].isdelegated) { %> box-supporter-delegate<% } %>">
					<!-- img size should probably not be forced to 24px like this -->
					<a href="<%= meta.baseurl %>/profile?user_id=<%= area.members[i].id %>"><img width="24" src="<%= meta.baseurl %>/<%= area.members[i].picmini %>" alt="<%= texts.profilepic %>"/></a>
					<h3><a href="<%= meta.baseurl %>/profile?user_id=<%= area.members[i].id %>"><%= area.members[i].name %></a></h3>
				</div>
				<% } %>
				
			<div class="box-footer">
				<ul class="pagination">
					<% if(area.memberspage == 1) { %><li class="button button-backward-off"><%= texts.backshort %></li><% } else { %><li><a class="button button-backward" href="<%= meta.baseurl %>/area?area_id=<%= area.id %>&page=<%= area.issuespage %>&memberpage=<%= area.memberspage - 1 %>"><%= texts.backshort %></a></li><% }
					if(area.memberspages > 1) {
						for(var a = 1; a <= area.memberspages; a++) {
							if(a == area.memberspage) { %>
								<li class="active"><%= a %></li>
							<% }
							else { %>
								<li><a href="<%= meta.baseurl %>/area?area_id=<%= area.id %>&page=<%= area.issuespage %>&memberpage=<%= a %>"><%= a %></a></li>
							<% }
						}
					}
					var nextpage = ( area.memberspage - 1 ) + 2;
					if(area.memberspage < area.memberspages) { %><li><a class="button button-forward" href="<%= meta.baseurl %>/area?area_id=<%= area.id %>&page=<%= area.issuespage %>&memberpage=<%= nextpage %>"><%= texts.forward %></a></li><% } else { %><li class="button button-forward-off"><%= texts.forward %></li><% } %>
				</ul>
			</div>	
		</div>

	</div>

					
	<div id="push"></div>
</div>
