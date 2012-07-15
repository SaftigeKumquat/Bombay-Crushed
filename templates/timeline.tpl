<div id="contentcontainer" class="container">

	<div class="row">
		<div class="twelvecol last">
				<label class="table-label" for="select_fiter"><%= texts.filter %>:</label>	
				<select id="select-filter-big" name="filter">
				<% for(var i = 0; i < filter.length; i++) { %>
					<option value="<%= filter[i].id %>"><%= filter[i].text %></option>
				<% } %> 
				</select>
				<a class="button buttonrow" href="#"><%= texts.managefilter %></a>
				<a id="filterslide" class="button buttonrow" href="#"><%= texts.editfilter %></a>
		</div>
		
	</div>

	<div class="row">
		<div id="filter" class="twelvecol box last">
			<h2><%= texts.editfilter %></h2>
			<form method="get" action="/search" id="timeline-filter">
				<div class="timeline-filter-timerange">
				    <input type="radio" name="timerange" id="radio-1"/>
				    	<label for="radio-1"><%= texts.last24hours %></label>
				    <input type="radio" name="timerange" id="radio-2"/>
				    	<label for="radio-2"><input name="age" type="text" size="14" placeholder="age: 40 days" /></label>
			    </div>	
			   	<table class="filtertable">
					<tr>
						<th><%= texts.issueevents %></th>
						<th><%= texts.issueeventsdesc %></th>
					</tr>
					<tr class="odd">
						<td>
							<span class="searchfilter-theme-occurence">	
								<input type="checkbox" id="searchfilter-theme-occurence1">
								<label for="searchfilter-theme-occurence1"><%= texts.newissue %></label>
							</span>
						</td>
						<td>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-theme-occurence1-member">
								<label for="searchfilter-theme-occurence1-member"><%= texts.memberofarea %></label>
							</span>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-theme-occurence1-interested">
								<label for="searchfilter-theme-occurence1-interested"><%= texts.interested %></label>
							</span>							
						</td>
					</tr>
					<tr>
						<td>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-theme-occurence2">
								<label for="searchfilter-theme-occurence2"><%= texts.issueaborted %></label>
							</span>
						</td>
						<td>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-theme-occurence2-member">
								<label for="searchfilter-theme-occurence2-member"><%= texts.memberofarea %></label>
							</span>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-theme-occurence2-interested">
								<label for="searchfilter-theme-occurence2-interested"><%= texts.interested %></label>
							</span>							
						</td>
					</tr>					
					<tr class="odd">
						<td>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-theme-occurence3">
								<label for="searchfilter-theme-occurence3"><%= texts.issueaccepted %></label>
							</span>
						</td>
						<td>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-theme-occurence3-member">
								<label for="searchfilter-theme-occurence3-member"><%= texts.memberofarea %></label>
							</span>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-theme-occurence3-interested">
								<label for="searchfilter-theme-occurence3-interested"><%= texts.interested %></label>
							</span>							
						</td>
					</tr>
					<tr>
						<td>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-theme-occurence4">
								<label for="searchfilter-theme-occurence4"><%= texts.issuefrozen %></label>
							</span>
						</td>
						<td>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-theme-occurence4-member">
								<label for="searchfilter-theme-occurence4-member"><%= texts.memberofarea %></label>
							</span>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-theme-occurence4-interested">
								<label for="searchfilter-theme-occurence4-interested"><%= texts.interested %></label>
							</span>							
						</td>
					</tr>
					<tr class="odd">
						<td>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-theme-occurence5">
								<label for="searchfilter-theme-occurence5"><%= texts.issueclosedwovote %></label>
							</span>
						</td>
						<td>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-theme-occurence5-member">
								<label for="searchfilter-theme-occurence5-member"><%= texts.memberofarea %></label>
							</span>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-theme-occurence5-interested">
								<label for="searchfilter-theme-occurence5-interested"><%= texts.interested %></label>
							</span>							
						</td>
					</tr>
					<tr>
						<td>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-theme-occurence6">
								<label for="searchfilter-theme-occurence6"><%= texts.votingstarted %></label>
							</span>
						</td>
						<td>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-theme-occurence6-member">
								<label for="searchfilter-theme-occurence6-member"><%= texts.memberofarea %></label>
							</span>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-theme-occurence6-interested">
								<label for="searchfilter-theme-occurence6-interested"><%= texts.interested %></label>
							</span>							
						</td>
					</tr>		
					<tr class="odd">
						<td>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-theme-occurence7">
								<label for="searchfilter-theme-occurence7"><%= texts.issueclosed %></label>
							</span>
						</td>
						<td>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-theme-occurence7-member">
								<label for="searchfilter-theme-occurence7-member"><%= texts.memberofarea %></label>
							</span>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-theme-occurence7-interested">
								<label for="searchfilter-theme-occurence7-interested"><%= texts.interested %></label>
							</span>							
						</td>
					</tr>

					<tr>
						<th><%= texts.issueevents %></th>
						<th><%= texts.issueeventsdesc %></th>
					</tr>
					<tr class="odd">
						<td>
							<span class="searchfilter-theme-occurence">	
								<input type="checkbox" id="searchfilter-init-occurence1">
								<label for="searchfilter-init-occurence1"><%= texts.newini %></label>
							</span>
						</td>
						<td>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-init-occurence1-member">
								<label for="searchfilter-init-occurence1-member"><%= texts.memberofarea %></label>
							</span>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-init-occurence1-interested">
								<label for="searchfilter-init-occurence1-interested"><%= texts.interested %></label>
							</span>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-init-occurence1-support">
								<label for="searchfilter-init-occurence1-support"><%= texts.supported %></label>
							</span>		
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-init-occurence1-possiblesupport">
								<label for="searchfilter-init-occurence1-possiblesupport"><%= texts.potsupported %></label>
							</span>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-init-occurence1-init">
								<label for="searchfilter-init-occurence1-init"><%= texts.initiated %></label>
							</span>											
						</td>
					</tr>
					<tr>
						<td>
							<span class="searchfilter-theme-occurence">	
								<input type="checkbox" id="searchfilter-init-occurence2">
								<label for="searchfilter-init-occurence2"><%= texts.iniwithdrawn %></label>
							</span>
						</td>
						<td>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-init-occurence2-member">
								<label for="searchfilter-init-occurence2-member"><%= texts.memberofarea %></label>
							</span>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-init-occurence2-interested">
								<label for="searchfilter-init-occurence2-interested"><%= texts.interested %></label>
							</span>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-init-occurence2-support">
								<label for="searchfilter-init-occurence2-support"><%= texts.supported %></label>
							</span>		
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-init-occurence2-possiblesupport">
								<label for="searchfilter-init-occurence2-possiblesupport"><%= texts.potsupported %></label>
							</span>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-init-occurence2-init">
								<label for="searchfilter-init-occurence2-init"><%= texts.initiated %></label>
							</span>											
						</td>
					</tr>
					<tr class="odd">
						<td>
							<span class="searchfilter-theme-occurence">	
								<input type="checkbox" id="searchfilter-init-occurence3">
								<label for="searchfilter-init-occurence3"><%= texts.newdraft %></label>
							</span>
						</td>
						<td>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-init-occurence3-member">
								<label for="searchfilter-init-occurence3-member"><%= texts.memberofarea %></label>
							</span>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-init-occurence3-interested">
								<label for="searchfilter-init-occurence3-interested"><%= texts.interested %></label>
							</span>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-init-occurence3-support">
								<label for="searchfilter-init-occurence3-support"><%= texts.supported %></label>
							</span>		
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-init-occurence3-possiblesupport">
								<label for="searchfilter-init-occurence3-possiblesupport"><%= texts.potsupported %></label>
							</span>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-init-occurence3-init">
								<label for="searchfilter-init-occurence3-init"><%= texts.initiated %></label>
							</span>											
						</td>
					</tr>
					<tr>
						<td>
							<span class="searchfilter-theme-occurence">	
								<input type="checkbox" id="searchfilter-init-occurence4">
								<label for="searchfilter-init-occurence4"><%= texts.newsuggestion %></label>
							</span>
						</td>
						<td>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-init-occurence4-member">
								<label for="searchfilter-init-occurence4-member"><%= texts.memberofarea %></label>
							</span>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-init-occurence4-interested">
								<label for="searchfilter-init-occurence4-interested"><%= texts.interested %></label>
							</span>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-init-occurence4-support">
								<label for="searchfilter-init-occurence4-support"><%= texts.supported %></label>
							</span>		
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-init-occurence4-possiblesupport">
								<label for="searchfilter-init-occurence4-possiblesupport"><%= texts.potsupported %></label>
							</span>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-init-occurence4-init">
								<label for="searchfilter-init-occurence4-init"><%= texts.initiated %></label>
							</span>											
						</td>
					</tr>

					<% var l = Math.ceil(units.length/2);
					var a = 0;
					var occurence = 1;
					for(var i = 0; i < l; i++) { %><tr>
						<th><%= texts.ignoreareaperunit %> <%= units[a].name %></th>
						<th><% if(units[a+1]) { %><%= texts.ignoreareaperunit %> <%= units[a+1].name %><% } %></th>
					</tr>
					<tr class="odd">
						<td>
							<% for(var j = 0; j < units[a].areas.length; j++) { %><span class="searchfilter-theme-occurence">	
								<input type="checkbox" id="searchfilter-ignore-occurence<%= occurence %>">
								<label for="searchfilter-ignore-occurence<%= occurence %>"><%= units[a].areas[j].name %></label>
							</span><% occurence++; } %>
						</td>
						<td><% if(units[a+1]) { %>
							<% for(var j = 0; j < units[a+1].areas.length; j++) { %><span class="searchfilter-theme-occurence">	
								<input type="checkbox" id="searchfilter-ignore-occurence<%= occurence %>">
								<label for="searchfilter-ignore-occurence<%= occurence %>"><%= units[a+1].areas[j].name %></label>
							</span><% occurence++; } %>
						<% } %></td>
					</tr>
					<% var a = a + 2;
					} %>										
				</table>	 				    	
			
			<div class="box-footer"><a class="button" href="#top"><%= texts.searchaction %></a><a class="button button-grey" href="#top"><%= texts.savefilter %></a></div>
			</form>												
		</div>

	</div>
		
	<div class="row">
		<div id="inicontent" class="twelvecol box last">
			<h2><%= texts.inis %></h2>

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
						%><br /><%= inis[i].lastaction.date %> <%= inis[i].lastaction.time %> <%= inis[i].lastaction.action %><%
						if(inis[i].delegate) { 
						%><p class="table-delegate"><a href="#"><img title="<%= texts.delegationend %>" src="<%= inis[i].delegate.picsmall %>"/></a></p><%
						} %></td>
					</tr><%
					} %>														
				</table>
			<div id="inipages" class="box-footer">			
				<ul class="pagination">
					<% if(initable.activepage == 1) { %><li class="button button-backward-off"><%= texts.backshort %></li><% } else { %><li><a class="button button-backward" href="timeline?page=<%= ( initable.activepage - 1 ) %>" onClick="update_inis(<%= ( initable.activepage - 1 ) %>)"><%= texts.backshort %></a></li><% }
					for(var i = 1; i <= initable.pages; i++) {
						if(i == initable.activepage) { %>
							<li class="active"><%= i %></li>
						<% }
						else { %>
							<li><a href="timeline?page=<%= i %>" onClick="update_inis(<%= i %>)"><%= i %></a></li>	
						<% } 
					} 
					var nextpage = ( initable.activepage - 1 ) + 2;
					if(initable.activepage != initable.pages) { %><li><a class="button button-forward" href="timeline?page=<%= nextpage %>" onClick="update_inis(<%= nextpage %>)"><%= texts.forward %></a></li><% } else { %><li class="button button-forward-off"><%= texts.forward %></li><% } %>
				</ul>				 
			</div>
		</div>
	</div>
	
	<div id="push"></div>
</div>
