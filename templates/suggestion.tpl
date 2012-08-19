<div id="contentcontainer" class="container">
	<div class="row">
		<div class="twelvecol nobox first">
			
		</div>
	</div>
	<div class="row">


		<div class="eightcol box first">			
			<h2><%= suggestion.name %></h2>
			<p class="box-label"><%= texts.suggestionforinitiative %> <a href="#"><%= suggestion.initiative.name %></a></p>
			<div class="box-footer box-editorial">
	
				<h3><%= texts.changeproposal %></h3>			
				<%- suggestion.text %>
			</div> 
				<table class="table-anregungen">
					<tr>
						<th><%= texts.generalopinion %></th>
						<th><%= texts.myopinion %></th>
						<th><%= texts.suggestionnotimplemented %></th>
						<th><%= texts.suggestionimplemented %></th>
						<th><%= texts.isay %></th>
						<th><%= texts.iam %></th>
					</tr>
					<tr class="odd">
						<td>
							<ul class="bargraph" title="<%= suggestion.mustsupporter %> <%= texts.mustsupporterinfo %> / <%= suggestion.shouldsupporter %> <%= texts.shouldsupporterinfo %> / <%= suggestion.neutralsupporter %> <%= texts.neutralsupporterinfo %> / <%= suggestion.shouldnotsupporter %> <%= texts.shouldnotsupporterinfo %> / <%= suggestion.mustnotsupporter %> <%= texts.mustnotsupporterinfo %>">
								
								<li class="bargraph-support" style="width:<%= suggestion.mustsupportwidth %>"></li>
								<li class="bargraph-pro" style="width:<%= suggestion.shouldsupportwidth %>"></li>
								<li class="bargraph-uninvolved" style="width:<%= suggestion.neutralsupportwidth %>"></li>
								<li class="bargraph-against" style="width:<%= suggestion.mustnotsupportwidth %>"></li><!--Vorsicht: diese und die nächste Zeile müssen wegen float in umgekehrter Reihenfolge hier stehen. Eigentlich ist bargraph-against die absolute Ablehnung und bargraph-contra die moderate -->
								<li class="bargraph-contra" style="width:<%= suggestion.shouldnotsupportwidth %>"></li>
		
							</ul>
						</td>
						<td>
							<ul>
								<li><a <% if(suggestion.my_opinion === 2) { %>class="marked"<% } %> href="#"><%= texts.must %></a></li>
								<li><a <% if(suggestion.my_opinion === 1) { %>class="marked"<% } %> href="#"><%= texts.should %></a></li>
								<li><a <% if(suggestion.my_opinion === 0) { %>class="marked"<% } %> href="#"><%= texts.neutral %></a></li>
								<li><a <% if(suggestion.my_opinion === -1) { %>class="marked"<% } %> href="#"><%= texts.shouldnot %></a></li>
								<li><a <% if(suggestion.my_opinion === -2) { %>class="marked"<% } %> href="#"><%= texts.mustnot %></a></li>
							</ul>
						</td>
						<td>
							<ul class="bargraph" title="<%= suggestion.notimplementedmustsupporter %> <%= texts.notimplementedsupporterinfo %> <%= texts.andmustsupporterinfo %> / <%= suggestion.notimplementedshouldsupporter %> <%= texts.notimplementedsupporterinfo %> <%= texts.andshouldsupporterinfo %> / <%= suggestion.notimplementedneutralsupporter %> <%= texts.neutralsupporterinfo %> / <%= suggestion.notimplementedshouldnotsupporter %> <%= texts.notimplementedsupporterinfo %> <%= texts.andshouldnotsupporterinfo %> / <%= suggestion.notimplementedmustnotsupporter %> <%= texts.notimplementedsupporterinfo %> <%= texts.andmustnotsupporterinfo %>">

								<li class="bargraph-support" style="width:<%= suggestion.notimplementedmustsupporterwidth %>"></li>
								<li class="bargraph-pro" style="width:<%= suggestion.notimplementedshouldsupporterwidth %>"></li>
								<li class="bargraph-uninvolved" style="width:<%= suggestion.notimplementedneutralsupporterwidth %>"></li>
								<li class="bargraph-against" style="width:<%= suggestion.notimplementedmustnotsupporterwidth %>"></li><!--Vorsicht: diese und die nächste Zeile müssen wegen float in umgekehrter Reihenfolge hier stehen. Eigentlich ist bargraph-against die absolute Ablehnung und bargraph-contra die moderate -->
								<li class="bargraph-contra" style="width:<%= suggestion.notimplementedshouldnotsupporterwidth %>"></li>

							</ul>
						</td>
						<td>
							<ul class="bargraph" title="<%= suggestion.implementedmustsupporter %> <%= texts.implementedsupporterinfo %> <%= texts.andmustsupporterinfo %> / <%= suggestion.implementedshouldsupporter %> <%= texts.implementedsupporterinfo %> <%= texts.andshouldsupporterinfo %> / <%= suggestion.implementedneutralsupporter %> <%= texts.neutralsupporterinfo %> / <%= suggestion.implementedshouldnotsupporter %> <%= texts.implementedsupporterinfo %> <%= texts.andshouldnotsupporterinfo %> / <%= suggestion.implementedmustnotsupporter %> <%= texts.implementedsupporterinfo %> <%= texts.andmustnotsupporterinfo %>">

								<li class="bargraph-support" style="width:<%= suggestion.implementedmustsupporterwidth %>"></li>
								<li class="bargraph-pro" style="width:<%= suggestion.implementedshouldsupporterwidth %>"></li>
								<li class="bargraph-uninvolved" style="width:<%= suggestion.implementedneutralsupporterwidth %>"></li>
								<li class="bargraph-against" style="width:<%= suggestion.implementedmustnotsupporterwidth %>"></li><!--Vorsicht: diese und die nächste Zeile müssen wegen float in umgekehrter Reihenfolge hier stehen. Eigentlich ist bargraph-against die absolute Ablehnung und bargraph-contra die moderate -->
								<li class="bargraph-contra" style="width:<%= suggestion.implementedshouldnotsupporterwidth %>"></li>

							</ul>
						</td>	
						
						<td>
							<ul>
								<li><a <% if(suggestion.isayimplemented) { %>class="marked"<% } %> href="#"><%= texts.implemented %></a></li>
								<li><a <% if(!suggestion.isayimplemented) { %>class="marked"<% } %> href="#"><%= texts.notimplemented %></a></li>
							</ul>
						</td>	
						<td>
						<div class="smiley smiley-<%= suggestion.smiley %>"></div>
						</td>				
					</tr>
					</table>
			<div id="initiative-detail" class="box-editorial">
			 	<h3><a href=""><%= suggestion.initiative.name %></a></h3>
			 	
				<%- suggestion.initiative.text %>

			 </div>
			<div class="box-footer">
				<a id="detailslide" class="button" href="#"><%= texts.showtexttobechanged %></a>
			</div>
		</div>

		<div class="twocol nobox first">
			<h2><%= texts.author %></h2>
			<div class="profile-init">
				<p>
					<a href="#"><img src="<%= meta.baseurl %>/<%= suggestion.author.picmini %>" alt="<%= texts.profilepic %>" /></a>
				</p>
				 <h3><a href="#"><%= suggestion.author.name %></a></h3>
			</div>
		</div>
	</div>
	<div class="row">

		<div class="eightcol box first">
			<h2><%= texts.opinions %></h2>
			<div class="box-description">
				<p><%= texts.opinioninfo %></p>
			</div>	

				<table class="table-meinungen">
					<tr>
						<th></th>
						<th><%= texts.member %></th>
						<th><%= texts.suggestionimplemented %></th>
						<th><%= texts.opinion %></th>

					</tr>

					<% var odd = true;
					for(var i = 0; i < suggestion.opinions.length; i++) { %>
					<tr class="<% if(odd) { %>odd<% } else { %>even<% } %>">
						<td><img src="<%= meta.baseurl %>/<%= suggestion.opinions[i].user.picmini %>" alt="<%= texts.profilepic %>"/></a></td>
						<td><a href="#"><%= suggestion.opinions[i].user.name %></a></td>
						<td><span href="" class="<%= suggestion.opinions[i].action %>"><% if(suggestion.opinions[i].implemented) { %><%= texts.implemented %><% } else { %><%= texts.notimplemented %><% } %></span></td>
						<td> <p class="smiley smiley-<%= suggestion.opinions[i].smiley %>"></p></td>
					</tr>
					<% if(odd) { odd = false; } else { odd = true; }
					} %>						
				</table>	

												
			<div class="box-footer">
				<ul class="pagination">
					<% if(suggestion.opinionpage == 1) { %><li class="button button-backward-off"><%= texts.backshort %></li><% } else { %><li><a class="button button-backward" href="#"><%= texts.backshort %></a></li><% }
					for(var a = 1; a <= suggestion.opinionpages; a++) {
						if(a == suggestion.opinionpage) { %>
							<li class="active"><%= a %></li>
						<% }
						else { %>
							<li><a href="#"><%= a %></a></li>
						<% }
					}
					var nextpage = ( suggestion.opinionpage - 1 ) + 2;
					if(suggestion.opinionpage != suggestion.opinionpages) { %><li><a class="button button-forward" href="#"><%= texts.forward %></a></li><% } else { %><li class="button button-forward-off"><%= texts.forward %></li><% } %>
				</ul>
			</div>
		</div>

	</div>


	
	<div id="push"></div>
</div>
