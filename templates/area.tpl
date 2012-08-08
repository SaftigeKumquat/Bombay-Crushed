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
				<li id="personal-menu-delegate"><a href="#"><img src="<%= area.delegate.picsmall %>" alt="<%= texts.profilepic %>" /><p><%= area.delegate.name %> <%= texts.removedelegationarea %></p></a></li>
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
					for(var i = 0; i < area.topics.length; i++) { %>
					<tr <% if(odd) { %>class="odd"<% } else { %>class="even"<% } %>>
						<td><a href=""><%= texts.issue %> #<%= area.topics[i].id %></a> <% if(area.topics[i].iwatchissue) { %><img title="<%= texts.iwatchissue %>" src="img/eye.png"/><% } %></td>
						<td><%= area.topics[i].status %></td>
						<td><h3><a href="#"><%= area.topics[i].title %></a><% if(area.topics[i].isupportini) { %><img title="<%= texts.isupportini %>" src="img/thumb-up.png"/><% } %></h3></td>
						<td>
							<ul class="bargraph" title="<%= area.topics[i].supporter %> <%= texts.supporter %> / <%= area.topics[i].potsupporter %> <%= texts.potsupporter %> / <%= area.topics[i].uninterested %> <%= texts.uninterested %>">
								<li class="bargraph-quorum" style="left:<%= area.topics[i].quorum %>%;"></li>
								<li class="bargraph-support" style="width:<%= area.topics[i].support %>%"></li>
								<li class="bargraph-potential" style="width:<%= area.topics[i].potential %>%"></li>
								<li class="bargraph-uninvolved" style="width:<%= area.topics[i].uninvolved %>%"></li>	
							</ul>
						</td>	
					</tr>
					<% if(area.topics[i].alternativeinis) {						
						for(var a = 0; a < area.topics[i].alternativeinis.length; a++) { %>
					<tr class="table-alternateinitiative<% if(odd) { %> odd<% } %>">
						<td></td>
						<td></td>
						<td><h3><a href="#"><%= area.topics[i].alternativeinis[a].title %></a><% if(area.topics[i].alternativeinis[a].isupportini) { %><img title="<%= texts.isupportini %>" src="img/thumb-up.png"/><% } %></h3></td>
						<td>
							<ul class="bargraph" title="<%= area.topics[i].alternativeinis[a].supporter %> <%= texts.supporter %> / <%= area.topics[i].alternativeinis[a].potsupporter %> <%= texts.potsupporter %> / <%= area.topics[i].alternativeinis[a].uninterested %> <%= texts.uninterested %>">
								<li class="bargraph-quorum" style="left:<%= area.topics[i].quorum %>%;"></li>
								<li class="bargraph-support" style="width:<%= area.topics[i].alternativeinis[a].support %>%"></li>
								<li class="bargraph-potential" style="width:<%= area.topics[i].alternativeinis[a].potential %>%"></li>
								<li class="bargraph-uninvolved" style="width:<%= area.topics[i].alternativeinis[a].uninvolved %>%"></li>	
							</ul>
						</td>	
					</tr>
					<% 	}
					} if(odd) { odd = false; } else { odd = true; }
					} %>
																				
				</table>

			<div class="box-footer">
				<ul class="pagination">
					<% if(area.topicspage == 1) { %><li class="button button-backward-off"><%= texts.backshort %></li><% } else { %><li><a class="button button-backward" href="#"><%= texts.backshort %></a></li><% }
					for(var a = 1; a <= area.topicspages; a++) {
						if(a == area.topicspage) { %>
							<li class="active"><%= a %></li>
						<% }
						else { %>
							<li><a href="#"><%= a %></a></li>
						<% }
					}
					var nextpage = ( area.topicspage - 1 ) + 2;
					if(area.topicspage != area.topicspages) { %><li><a class="button button-forward" href="#"><%= texts.forward %></a></li><% } else { %><li class="button button-forward-off"><%= texts.forward %></li><% } %>
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
					<a href="#"><img src="<%= area.delegations[i].delegationstart.picsmall %>" alt="<%= texts.profilepic %>"/><%= area.delegations[i].delegationstart.name %></a>
					<% for(var a = 0; a < area.delegations[i].delegations.length; a++) { %>
					<img class="delegate-arrow" src="img/arrow.png" alt="<%= texts.delegatesto %>"/>
					<a href="#"><img src="<%= area.delegations[i].delegations[a].picsmall %>" alt="<%= texts.profilepic %>"/><%= area.delegations[i].delegations[a].name %></a>
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
					if(area.delegationpage != area.delegationpages) { %><li><a class="button button-forward" href="#"><%= texts.forward %></a></li><% } else { %><li class="button button-forward-off"><%= texts.forward %></li><% } %>
				</ul>
			</div>			
		</div>
		
		<div class="threecol box last">
			<h2><%= texts.members %> (1200)</h2>
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
					<a href="#"><img src="<%= area.members[i].picmini %>" alt="<%= texts.profilepic %>"/></a>
					<h3><a href="#"><%= area.members[i].name %></a></h3>
				</div>
				<% } %>
				
			<div class="box-footer">
				<ul class="pagination">
					<% if(area.memberspage == 1) { %><li class="button button-backward-off"><%= texts.backshort %></li><% } else { %><li><a class="button button-backward" href="#"><%= texts.backshort %></a></li><% }
					for(var a = 1; a <= area.memberspages; a++) {
						if(a == area.memberspage) { %>
							<li class="active"><%= a %></li>
						<% }
						else { %>
							<li><a href="#"><%= a %></a></li>
						<% }
					}
					var nextpage = ( area.memberspage - 1 ) + 2;
					if(area.memberspage != area.memberspages) { %><li><a class="button button-forward" href="#"><%= texts.forward %></a></li><% } else { %><li class="button button-forward-off"><%= texts.forward %></li><% } %>
				</ul>
			</div>	
		</div>

	</div>

					
	<div id="push"></div>
</div>
