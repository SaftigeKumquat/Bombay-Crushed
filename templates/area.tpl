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
				<li class="unavailable" id="personal-menu-nomember"><a href="#"><%= texts.endmembership %></p></a></li>
				<% } else { %>
				<li class="unavailable" id="personal-menu-member"><a href="#"><%= texts.becomemember %></a></li>
				<% } %>
				
				<% if(area.delegate) { %>
				<li class="unavailable"><a href="#"><span>+</span><%= texts.changedelegation %></a></li>
				<li class="unavailable" id="personal-menu-delegate"><a href="#"><img src="<%= meta.baseurl %>/<%= area.delegate.picsmall %>" alt="<%= texts.profilepic %>" /><p><%= area.delegate.name %> <%= texts.removedelegationarea %></p></a></li>
				<% } else { %>
				<li class="unavailable"><a href="#"><span>+</span><%= texts.delegatearea %></a></li>
				<% } %>
			</ul>
		</div>
		<% include area_issues_table.tpl %>
	</div>
	<div class="row">
		<div class="twocol nobox">
		</div>
		<div class="sevencol box unavailable">
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

				<label class="table-label unavailable" for="select_fiter"><%= texts.sortedby %>:</label>	
				<select class="unavailable" id="select-filter" name="filter">							
					<option value="1"><%= texts.atoz %></option>
					<option value="2"><%= texts.ztoa %></option>
					<option value="3"><%= texts.newest %></option>
					<option value="3"><%= texts.oldest %></option>
				</select>

			</div>	
			
				<% for(var i = 0; i < area.members.length; i++) { %>
				<div class="box-delegate-info box-supporters<% if(area.members[i].isdelegated) { %> box-supporter-delegate<% } %>">
					<a href="<%= meta.baseurl %>/profile?user_id=<%= area.members[i].id %>"><img src="<%= meta.baseurl %>/<%= area.members[i].picmini %>" alt="<%= texts.profilepic %>"/></a>
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
