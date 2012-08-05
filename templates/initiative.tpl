<div id="contentcontainer" class="container">
	<div class="row">
		<div class="twelvecol nobox first">
			
		</div>
	</div>

	<% if(initiative.draftupdated) { %>
	<div class="row">
		<div class="twocol noxbox first">
			</div>
			<div class="sevencol alertbox last">
			<h2><%= texts.draftupdatedinfo %></h2>
				<p><a class="button" href=""><%= texts.showchanges %></a> <a class="button"  href=""><%= texts.updatesupport %></a></p>
			</div>
	</div>
	<% } %>

	<div class="row">

		<div class="twocol nobox first">
			<% if(initiative.isupport) { %>
			<h2><%= texts.support %></h2>
			<div class="supportbox"><p><%= texts.isupportinfo %></p></div>
			<% } %>
			<h2><%= texts.options %></h2>
			<ul id="personal-menu">
				<% if(initiative.isupport) { %>
				<li id="personal-menu-support"><a href="#"><%= texts.removesupport %></p></a></li>
				<% } else { %>
				<li id="personal-menu-green"><a href="#"><%- texts.supportini %></a></li>
				<% } %>
				<% if(initiative.delegate) { %>
				<li  id="personal-menu-delegate"><a href="#"><img src="<%= initiative.delegate.picsmall %>" alt="<%= texts.profilepic %>" /><p><%= initiative.delegate.name %> <%= texts.removedelegation %></p></a></li>
				<% } else { %>
				<li><a href="#"><span>+</span><%= texts.delegatearea %></a></li>
				<% } %>
				<% if(initiative.state == texts.status4) { %>
				<li><a href="#"><span>+</span><%= texts.changevote %></a></li>
				<% } %>
				<li><a href="#"><span>+</span><%= texts.discusstopic %></a></li>
			</ul>

			<h2><%= texts.suggestionsandalternatives %></h2>
			<ul>
				<li><a href="#Anregungen"><%= texts.suggestions %> (5)</a></li>
				<li><a href="#Alternativen"><%= texts.alternativeinitiatives %> (2)</a></li>
			</ul>

		<h2><%= texts.authors %></h2>
		<% for(var i = 0; i < initiative.authors.length; i++) { %>
		<div class="profile-init">
			<p>
				<a href="#"><img src="<%= initiative.authors[i].picmini %>" alt="<%= texts.profilepic %>" /></a>
			</p>
			 <h3><a href="#"><%= initiative.authors[i].name %></a></h3>
			 <% if(initiative.authors[i].lastauthor) { %>
			 <p>(<%= texts.lastauthor %>)</p>
			 <% } %>
		</div>
		<% } %>
				
		</div>
		<div class="sevencol box">

				
			<h2><%= initiative.name %></h2>
			<p class="box-label"><a href="#"><%= initiative.area.name %></a> · <a href="#"><%= texts.issue %> #<%= initiative.issue.id %></a> · <%= initiative.state %></p>
			<div class="box-footer box-editorial">
	
				<%- initiative.text %>

				<p><a href="#"><%= texts.discusswithauthors %></a></p>
				<div id="initiative-history">
			 		<h3><%= texts.drafthistory %></h3>
					<table class="historytable">
						<tr>
							<th><%= texts.createdat %></th>
							<th><%= texts.author %></th>
							<th><%= texts.show %></th>
							<th><%= texts.compare %></th>
						</tr>
						<% for(var i = 0; i < initiative.drafts.length; i++) { %>
						<tr class="odd">
							<td><%= initiative.drafts[i].createdat %></td>
							<td><a href="#"><%= initiative.drafts[i].author.name %> (<%= initiative.drafts[i].author.nick %>)</a></td>
							<td><a href="#"><%= texts.showversion %></a></td>
							<td>

					    			<input type="radio" name="version1" id="radio-1"/>
					    			<label for="radio-1"></label>
					    			<input type="radio" name="version2" id="radio-2"/>
					    			<label for="radio-2"></label>
							</td>						
						</tr>
						<% } %>
					</table>

				<a class="button" href="#"><%= texts.compareversions %></a>

			 	</div>
			 	<div id="initiative-detail">
			 		<h3><%= texts.details %></h3>
			 	
				<dl>
					<dt><%= texts.policyfortopic %></dt><dd><%= initiative.policy %></dd>
					<dt><%= texts.createdat %></dt><dd><%= initiative.createdat %></dd>
					<dt><%= texts.requiredquorum %></dt><dd><%= initiative.requiredquorum %></dd>
					<dt><%= texts.requiredrightnow %></dt><dd><%= initiative.requiredrightnow %></dd>
					<dt><%= texts.admitted %></dt><dd><%= initiative.admitted %></dd>
				</dl>	
			 	</div>
			</div>
			<div class="box-footer">		
			 <a id="historyslide" class="button" href="#"><%= texts.drafthistory %></a><a id="detailslide" class="button" href="#"><%= texts.details %></a>

			</div>		
		</div>

		<div class="threecol box last">
			<h2><%= texts.support %></h2>
			<div class="box-description">
				<p><%= texts.supportinfo %></p>

				<div class="timeline-filter-timerange">
				    <input type="radio" name="timerange" id="radio-1" checked/>
				    	<label for="radio-1"><%= texts.support %> (<%= initiative.supporter %>)</label><br />
				    <input type="radio" name="timerange" id="radio-2"/>
				    	<label for="radio-2"><%= texts.potsupport %> (<%= initiative.potsupporter %>)</label>
			    </div>

				<label class="table-label" for="select_fiter"><%= texts.sortedby %>:</label>	
				<select id="select-filter" name="filter">							
					<option value="1"><%= texts.atoz %></option>
					<option value="2"><%= texts.ztoa %></option>
					<option value="3"><%= texts.delegationpower %></option>
					<option value="3"><%= texts.new %></option>
				</select>

			</div>	
			
				<% for(var i = 0; i < initiative.supporters.length; i++) { %>
				<div class="box-delegate-info box-supporters<% if(initiative.supporters[i].isdelegated) { %> box-supporter-delegate<% } %>">
					<a href="#"><img src="<%= initiative.supporters[i].picmini %>" alt="<%= texts.profilepic %>"/></a>
					<h3><a href="#"><%= initiative.supporters[i].name %></a> <% if(initiative.supporters[i].power) { %><a href="" class="for">+<%= initiative.supporters[i].power %></a><% } %></h3>
				</div>
				<% } %>
					
			<div class="box-footer">			
				<ul class="pagination">
					<% if(initiative.supporterspage == 1) { %><li class="button button-backward-off"><%= texts.backshort %></li><% } else { %><li><a class="button button-backward" href="#"><%= texts.backshort %></a></li><% }
					for(var a = 1; a <= initiative.supporterspages; a++) {
						if(a == initiative.supporterspage) { %>
							<li class="active"><%= a %></li>
						<% }
						else { %>
							<li><a href="#"><%= a %></a></li>	
						<% } 
					} 
					var nextpage = ( initiative.supporterspage - 1 ) + 2;
					if(initiative.supporterspage != initiative.supporterspages) { %><li><a class="button button-forward" href="#"><%= texts.forward %></a></li><% } else { %><li class="button button-forward-off"><%= texts.forward %></li><% } %>
				</ul>				 
			</div>
							
		</div>

	</div>
	<div class="row">
			<div class="twocol nobox"></div>

		<div class="sevencol box last">
			<h2 id="Anregungen"><a href=""><%= texts.suggestionsforthisini %> (6)</a></h2>
			<div class="box-description">
				<p><%= texts.suggestioninfo %></p>
			</div>	
			<table class="table-anregungen">
					<tr>
						<th><%= texts.suggestion %></th>
						<th><%= texts.generalopinion %></th>
						<th><%= texts.myopinion %></th>
						<th><%= texts.suggestionnotimplemented %></th>
						<th><%= texts.suggestionimplemented %></th>
						<th><%= texts.isay %></th>
						<th><%= texts.iam %></th>
					</tr>

					<% var odd = true;
					for(var i = 0; i < initiative.suggestions.length; i++) { %>
					<tr class="<% if(odd) { %>odd<% } else { %>even<% } %>">
						<td><h3><a href="#"><%= initiative.suggestions[i].name %></a></h3></td>
						<td>
							<ul class="bargraph" title="<%= initiative.suggestions[i].mustsupporter %> <%= texts.mustsupporterinfo %> / <%= initiative.suggestions[i].shouldsupporter %> <%= texts.shouldsupporterinfo %> / <%= initiative.suggestions[i].neutralsupporter %> <%= texts.neutralsupporterinfo %> / <%= initiative.suggestions[i].shouldnotsupporter %> <%= texts.shouldnotsupporterinfo %> / <%= initiative.suggestions[i].mustnotsupporter %> <%= texts.mustnotsupporterinfo %>">
								
								<li class="bargraph-support" style="width:<%= initiative.suggestions[i].mustsupportwidth %>"></li>
								<li class="bargraph-pro" style="width:<%= initiative.suggestions[i].shouldsupportwidth %>"></li>
								<li class="bargraph-uninvolved" style="width:<%= initiative.suggestions[i].neutralsupportwidth %>"></li>
								<li class="bargraph-against" style="width:<%= initiative.suggestions[i].mustnotsupportwidth %>"></li><!--Vorsicht: diese und die nächste Zeile müssen wegen float in umgekehrter Reihenfolge hier stehen. Eigentlich ist bargraph-against die absolute Ablehnung und bargraph-contra die moderate -->
								<li class="bargraph-contra" style="width:<%= initiative.suggestions[i].shouldnotsupportwidth %>"></li>
		
							</ul>
						</td>
						<td>
							<ul>
								<li><a href="#"><%= texts.must %></a></li>
								<li><a href="#"><%= texts.should %></a></li>
								<li><a href="#"><%= texts.neutral %></a></li>
								<li><a href="#"><%= texts.shouldnot %></a></li>
								<li><a href="#"><%= texts.mustnot %></a></li>								
							</ul>
						</td>
						<td>
							<ul class="bargraph" title="<%= initiative.suggestions[i].notimplementedmustsupporter %> <%= texts.notimplementedsupporterinfo %> <%= texts.andmustsupporterinfo %> / <%= initiative.suggestions[i].notimplementedshouldsupporter %> <%= texts.notimplementedsupporterinfo %> <%= texts.andshouldsupporterinfo %> / <%= initiative.suggestions[i].notimplementedneutralsupporter %> <%= texts.neutralsupporterinfo %> / <%= initiative.suggestions[i].notimplementedshoudnotsupporter %> <%= texts.notimplementedsupporterinfo %> <%= texts.andshouldnotsupporterinfo %> / <%= initiative.suggestions[i].notimplementedmustnotsupporter %> <%= texts.notimplementedsupporterinfo %> <%= texts.andmustnotsupporterinfo %>">
								
								<li class="bargraph-support" style="width:<%= initiative.suggestions[i].notimplementedmustsupporterwidth %>"></li>
								<li class="bargraph-pro" style="width:<%= initiative.suggestions[i].notimplementedshouldsupporterwidth %>"></li>
								<li class="bargraph-uninvolved" style="width:<%= initiative.suggestions[i].notimplementedneutralsupporterwidth %>"></li>
								<li class="bargraph-against" style="width:<%= initiative.suggestions[i].notimplementedmustnotsupportwidth %>"></li><!--Vorsicht: diese und die nächste Zeile müssen wegen float in umgekehrter Reihenfolge hier stehen. Eigentlich ist bargraph-against die absolute Ablehnung und bargraph-contra die moderate -->
								<li class="bargraph-contra" style="width:<%= initiative.suggestions[i].notimplementedshouldnotsupportwidth %>"></li>
		
							</ul>
						</td>						
						<td>
							<ul class="bargraph" title="<%= initiative.suggestions[i].implementedmustsupporter %> <%= texts.implementedsupporterinfo %> <%= texts.andmustsupporterinfo %> / <%= initiative.suggestions[i].implementedshouldsupporter %> <%= texts.implementedsupporterinfo %> <%= texts.andshouldsupporterinfo %> / <%= initiative.suggestions[i].implementedneutralsupporter %> <%= texts.neutralsupporterinfo %> / <%= initiative.suggestions[i].implementedshouldnotsupporter %> <%= texts.implementedsupporterinfo %> <%= texts.andshouldnotsupporterinfo %> / <%= initiative.suggestions[i].implementedmustnotsupporter %> <%= texts.implementedsupporterinfo %> <%= texts.andmustnotsupporterinfo %>">
								
								<li class="bargraph-support" style="width:<%= initiative.suggestions[i].implementedmustsupporterwidth %>"></li>
								<li class="bargraph-pro" style="width:<%= initiative.suggestions[i].implementedshouldsupporterwidth %>"></li>
								<li class="bargraph-uninvolved" style="width:<%= initiative.suggestions[i].implementedneutralsupporterwidth %>"></li>
								<li class="bargraph-against" style="width:<%= initiative.suggestions[i].implementedmustnotsupportwidth %>"></li><!--Vorsicht: diese und die nächste Zeile müssen wegen float in umgekehrter Reihenfolge hier stehen. Eigentlich ist bargraph-against die absolute Ablehnung und bargraph-contra die moderate -->
								<li class="bargraph-contra" style="width:<%= initiative.suggestions[i].implementedshouldnotsupportwidth %>"></li>
		
							</ul>
						</td>	
						
						<td>
							<ul>
								<li><a class="marked" href="#"><%= texts.implemented %></a></li>
								<li><a href="#"><%= texts.notimplemented %></a></li>
							</ul>
						</td>	
						<td>
						<div class="smiley smiley-<%= initiative.suggestions[i].smiley %>"></div>
						</td>				
					</tr>
					<% if(odd) { odd = false; } else { odd = true; }
					} %>										
				</table>

			<div class="box-footer">			
				<ul class="pagination">
					<% if(initiative.suggestionspage == 1) { %><li class="button button-backward-off"><%= texts.backshort %></li><% } else { %><li><a class="button button-backward" href="#"><%= texts.backshort %></a></li><% }
					for(var a = 1; a <= initiative.suggestionspages; a++) {
						if(a == initiative.suggestionspage) { %>
							<li class="active"><%= a %></li>
						<% }
						else { %>
							<li><a href="#"><%= a %></a></li>	
						<% } 
					} 
					var nextpage = ( initiative.suggestionspage - 1 ) + 2;
					if(initiative.suggestionspage != initiative.suggestionspages) { %><li><a class="button button-forward" href="#"><%= texts.forward %></a></li><% } else { %><li class="button button-forward-off"><%= texts.forward %></li><% } %>
				</ul>	
				<a class="button button-nextpagination" href="#"><%= texts.createsuggestion %></a>			 
			</div>

		</div>

	</div>	

	<div class="row">
			<div class="twocol nobox"></div>

		<div class="sevencol box last">
					<h2 id="Alternativen"><a href=""><%= texts.alternativeinitiatives %> (<%= initiative.alternativeinisnumber %>)</a></h2>
			<div class="box-description">
				<p><%= texts.alternativeiniinfo %></p>
			</div>	
			<table class="table-initiatives">
					<tr>
						<th><%= texts.suggestion %></th>
						<th><%= texts.support %></th>
						<th></th>
					</tr>

					<% var odd = true;
					for(var i = 0; i < initiative.alternativeinis.length; i++) { %>
					<tr <% if(odd) { %>class="odd"<% } %>>
						<td><h3><a href="#"><%= initiative.alternativeinis[i].name %></a></h3></td>
						<td>
							<ul class="bargraph" title="<%= initiative.alternativeinis[i].supporter %> <%= texts.supporter %> / <%= initiative.alternativeinis[i].potsupporter %> <%= texts.potsupporter %> / <%= initiative.alternativeinis[i].uninterested %> <%= texts.uninterested %>">
								<li class="bargraph-quorum" style="left:<%= initiative.alternativeinis[i].quorumwidth %>;"></li>
								<li class="bargraph-support" style="width:<%= initiative.alternativeinis[i].supporterwidth %>"></li>
								<li class="bargraph-potential" style="width:<%= initiative.alternativeinis[i].potsupporterwidth %>"></li>
								<li class="bargraph-uninvolved" style="width:<%= initiative.alternativeinis[i].uninterestedwidth %>"></li>	
							</ul>
						</td>
						<td><% if(initiative.alternativeinis[i].isupport) { %><img title="<%= texts.isupportini %>" src="img/thumb-up.png"/><% } %></td>
					</tr>
					<% if(odd) { odd = false; } else { odd = true; }
					} %>
			</table>
			<div class="box-footer">		
				<% if(initiative.alternativeinispages > 1) { %>			
				<ul class="pagination">
					<% if(initiative.alternativeinispage == 1) { %><li class="button button-backward-off"><%= texts.backshort %></li><% } else { %><li><a class="button button-backward" href="#"><%= texts.backshort %></a></li><% }
					for(var a = 1; a <= initiative.alternativeinispages; a++) {
						if(a == initiative.alternativeinispage) { %>
							<li class="active"><%= a %></li>
						<% }
						else { %>
							<li><a href="#"><%= a %></a></li>	
						<% } 
					} 
					var nextpage = ( initiative.alternativeinispage - 1 ) + 2;
					if(initiative.alternativeinispage != initiative.alternativeinispages) { %><li><a class="button button-forward" href="#"><%= texts.forward %></a></li><% } else { %><li class="button button-forward-off"><%= texts.forward %></li><% } %>
				</ul>
				<% } %>	 
				<a class="button" href="#"><%= texts.createalternativeini %></a>
				</div>
			</div>
	</div>	
					
	<div id="push"></div>
</div>
