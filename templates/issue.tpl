<div id="contentcontainer" class="container">
	<div class="row">
		<div class="twocol noxbox first">
			</div>
 			<% if(issue.status == texts.status4) { %>
				<div class="sevencol alertbox last">
				<% if(issue.castvote) { %>
				<h2><%= texts.youalreadyvoted %></h2>
					<p><a class="button unavailable" href=""><%= texts.revokevote %></a></p>
				<% } else { %>
				<h2><%= texts.issuevotingopen %></h2>
					<p><a class="button unavailable" href=""><%= texts.votenow %></a></p>
				<% } %>
				</div>
			<% } %>
	</div>
	<div class="row">

		<div class="twocol nobox first">
			<% if(issue.iwatchissue) { %>
				<h2><%= texts.membership %></h2>
				<div class="interestbox"><p>
					<% if(issue.iwanttopostponeissue) { %><%= texts.youareinterestedvotelater %>
					<% } else { %><%= texts.youareinterested %> <% } %>
				</p></div>
			<% } %>

			<h2><%= texts.options %></h2>
			<ul id="personal-menu">
				<% if(!issue.iwatchissue) { %>
				<li class="unavailable" id="personal-menu-interest"><a href="#"><%= texts.declareinterest %></a></li>
				<% } else { %>
				<li class="unavailable" id="personal-menu-nointerest"><a href="#"><%= texts.revokeinterest %></p></a></li>
				<% } %>
				<% if(!issue.delegate) { %>
				<li class="unavailable"><a href="#"><span>+</span><%= texts.delegateissue %></a></li>
				<% } else { %>
				<li class="unavailable" id="personal-menu-delegate"><a href="#"><img
                src="<%= meta.baseurl %>/<%= issue.delegate.picsmall %>" alt="<%=
                texts.profilepic %>" /><p><%= issue.delegate.name %> <%= texts.removedelegation %></p></a></li>
				<li class="unavailable"><a href="#"><span>+</span><%= texts.changedelegation %></a></li>
				<% } %>
				<!--
				<li><a href="#"><span>+</span> <%= texts.discusstopic %></a></li>
				-->
			</ul>
		</div>
		<div class="tencol last doublebox">
			<div class="box">
				<h2><%= texts.issue %> #<%= issue.id %> <%= texts.in %> „<%= issue.area%>“ / <%= issue.unit %> / <% switch(issue.status) {
						   case texts.status1: %> <%= texts.statusstep1 %> <% break; %>
						<% case texts.status2: %> <%= texts.statusstep2 %> <% break; %>
						<% case texts.status3: %> <%= texts.statusstep3 %> <% break; %>
						<% case texts.status4: %> <a href="#"><%= texts.statusstep4 %></a> <% break; %>
						<% case texts.status5: %> <%= texts.statusstep5 %> <% break; %>
						<% case texts.status6: %> <%= texts.statusstep6 %> <% break; %>
						<% } %></h2>

						<div class="filtertable unavailable">
							<label class="table-label unavailable" for="select_fiter3"><%= texts.sortedby %>:</label>
							<select class="unavailable" id="select-filter2" name="filter">
								<option value="1"><%= texts.potsupport %></option>
								<option value="2"><%= texts.support %></option>
								<option value="3"><%= texts.newest %></option>
								<option value="4"><%= texts.oldest %></option>
							</select>
						</div>
						<table class="table-area">
							<tr>
								<th><%= texts.inis %></th>
								<th><%= texts.status %></th>
							</tr>

							<% for(var i = 0; i < issue.initiatives.length; i++) { %>
							<tr class="table-alternateinitiative odd">
								<td><h3><a href="<%= meta.baseurl %>/initiative?initiative_id=<%= issue.initiatives[i].id %>"><%= issue.initiatives[i].name %></a><% if(issue.initiatives[i].isupportini) { %><img title="<%= texts.isupportini %>" src="<%= meta.baseurl %>/img/thumb-up.png"/><% } %></h3></td>
								<td>
									<ul class="bargraph" title="<%= issue.initiatives[i].supporter %> <%= texts.supporter %> / <%= issue.initiatives[i].potsupporter %> <%= texts.potsupporter %> / <%= issue.initiatives[i].uninterested %> <%= texts.uninterested %>">
										<li class="bargraph-quorum" style="left:<%= issue.quorum %>%;"></li>
										<li class="bargraph-support" style="width:<%= issue.initiatives[i].support %>%"></li>
										<li class="bargraph-potential" style="width:<%= issue.initiatives[i].potential %>%"></li>
										<li class="bargraph-uninvolved" style="width:<%= issue.initiatives[i].uninvolved %>%"></li>
									</ul>
								</td>
							</tr>
							<% } %>
						</table>



				 	<div id="initiative-detail" class="box-editorial">
							<h3><%= texts.details %></h3>
							<br />
						<dl>
							<dt><%= texts.population %></dt><dd><%= issue.population.toString() %></dd>
							<dt><%= texts.state %></dt><dd><%= issue.status %></dd>
							<br />
							<dt><%= texts.createdat %></dt><dd><%= issue.createdat %></dd>
							<dt><%= texts.acceptedat %></dt><dd><%= issue.acceptedat %></dd>
							<dt><%= texts.halffrozenat %></dt><dd><%= issue.halffrozenat %></dd>
							<dt><%= texts.frozenat %></dt><dd><%= issue.frozenat %></dd>
							<br />
							<dt><%= texts.timeforadmission %></dt><dd><%= issue.timeforadmission %> <% if(issue.timeforadmission=="1") { %><%= texts.day %><% } else { %><%= texts.days %><% } %></dd>
							<dt><%= texts.timefordiscussion %></dt><dd><%= issue.timefordiscussion %> <% if(issue.timefordiscussion=="1") { %><%= texts.day %><% } else { %><%= texts.days %><% } %></dd>
							<dt><%= texts.timeforrevision %></dt><dd><%= issue.timeforrevision %> <% if(issue.timeforrevision=="1") { %><%= texts.day %><% } else { %><%= texts.days %><% } %></dd>
							<dt><%= texts.timeforvote %></dt><dd><%= issue.timeforvote %> <% if(issue.timeforvote=="1") { %><%= texts.day %><% } else { %><%= texts.days %><% } %></dd>
							<br />
							<dt><%= texts.issuequorum %></dt><dd><%= issue.quorum.toString() %>%</dd>
							<dt><%= texts.currentlyneedeforissue %></dt><dd><%= Math.round(issue.population * (issue.quorum / 100.0)).toString() %></dd>
							<br />
							<dt><%= texts.closed %></dt><dd><% if(issue.open) { %> <%= texts.no %> <% } else { %><%= texts.yes %><% } %></dd>
						</dl>
					 </div>

				<div class="box-footer">
					<a class="button unavailable" href="#"><%= texts.addalternativeinitiative %></a><a id="detailslide" class="button" href="#"><%= texts.details %></a>
			</div>
			</div>
		</div>

	</div>
	<div class="row">
		<div class="twocol nobox">
		</div>
		<div class="sevencol box unavailable">
			<h2><%= texts.delegations %> (<%= issue.delegationnumber %>)</h2>
				<% for(var i = 0; i < issue.delegations.length; i++) { %>
				<div class="box-delegate-info box-delegation">
					<a href="#"><img src="<%= meta.baseurl %>/<%= issue.delegations[i].delegationstart.picsmall %>" alt="<%= texts.profilepic %>"/><%= issue.delegations[i].delegationstart.name %></a>
					<% for(var a = 0; a < issue.delegations[i].delegations.length; a++) { %>
					<img class="delegate-arrow" src="<%= meta.baseurl %>/img/arrow.png" alt="<%= texts.delegatesto %>"/>
					<a href="#"><img src="<%= meta.baseurl %>/<%= issue.delegations[i].delegations[a].picsmall %>" alt="<%= texts.profilepic %>"/><%= issue.delegations[i].delegations[a].name %></a>
					<% } %>
				</div>
				<% } %>

			<div class="box-footer">
				<ul class="pagination">
						<% if(issue.pagination.currentdelegations == 1) { %><li class="button button-backward-off"><%= texts.backshort %></li><% } else { %><li><a class="button button-backward" href="#"><%= texts.backshort %></a></li><% }
						for(var a = 1; a <= issue.pagination.totaldelegations; a++) {
							if(a == issue.pagination.currentdelegations) { %>
								<li class="active"><%= a %></li>
							<% } else { %>
								<li><a href="#"><%= a %></a></li>
							<% }
					}
					var nextpage = issue.pagination.currentdelegations + 1;
					if(issue.pagination.currentdelegations != issue.pagination.totaldelegations) { %><li><a class="button button-forward" href="#"><%= texts.forward %></a></li><% } else { %><li class="button button-forward-off"><%= texts.forward %></li><% } %>
				</ul>
			</div>
		</div>

		<div class="threecol box last">
			<h2><%= texts.interestedmembers %> (1200)</h2>
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

				<% for(var i = 0; i < issue.members.length; i++) { %>
				<div class="box-delegate-info box-supporters<% if(issue.members[i].isdelegated) { %> box-supporter-delegate<% } %>">
					<a href="#"><img src="<%= meta.baseurl %>/<%= issue.members[i].picmini %>" alt="<%= texts.profilepic %>"/></a>
					<h3><a href="#"><%= issue.members[i].name %></a></h3>
				</div>
				<% } %>

			<div class="box-footer">
				<ul class="pagination">
						<% if(issue.pagination.currentinterested == 1) { %><li class="button button-backward-off"><%= texts.backshort %></li><% } else { %><li><a class="button button-backward" href="#"><%= texts.backshort %></a></li><% }
						for(var a = 1; a <= issue.pagination.totalinterested; a++) {
							if(a == issue.pagination.currentinterested) { %>
								<li class="active"><%= a %></li>
							<% } else { %>
								<li><a href="#"><%= a %></a></li>
							<% }
					}
					var nextpage = issue.pagination.currentinterested + 1;
					if(issue.pagination.currentinterested != issue.pagination.totalinterested) { %><li><a class="button button-forward" href="#"><%= texts.forward %></a></li><% } else { %><li class="button button-forward-off"><%= texts.forward %></li><% } %>
				</ul>
			</div>
		</div>

	</div>


	<div id="push"></div>
</div>
