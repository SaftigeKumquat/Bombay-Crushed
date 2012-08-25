<div id="contentcontainer" class="container">
	
	<% if(alert.show) { %>
	<div class="row">
			<div class="sevencol alertbox first last">
			<h2><%= texts.yoursearchfor %> „<% if(alert.filter == 'initiated') { %><%= texts.initiatedinis %><% } else if(alert.filter == 'supported') { %><%= texts.supportedinis %><% } %>“ <%= texts.yieldednoresult %></h2>
				<p><%= texts.noresultinfo %></p>
			</div>			
	</div>
	<% } %>

	<div class="row unavailable">
		<div class="twelvecol last">
			<h1>Suche</h1>
				<p id="search-sub">
					<label class="table-label" for="q2">Suche:</label> <input id="search-field-big" name="q2" type="text" size="40" placeholder="Suchbegriff" />
				</p>
				<p>
					<label class="table-label" for="select_fiter">mit Einschränkung:</label>	
					<select id="select-filter-big" name="filter">
						<option value="1">keine Einschränkung</option>
						<option value="2">Nur nach Mitgliedern suchen</option>
						<option value="3">Nur nach Themen suchen</option>

					</select>
					<a class="button buttonrow" href="#">Suche starten</a>
				</p>
		</div>
		
	</div>
		
	<div class="row">
		<div class="ninecol box first">
			<h2><% if(initable.filter == 'initiated') { %><%= texts.myinis %><% } else if(initable.filter == 'supported') { %><%= texts.supportedinis %><% } %></h2>

				<table>
				<label class="table-label unavailable" for="select_fiter"><%= texts.sortedby %></label>	
				<select class="unavailable" id="select-filter" name="filter">							
					<option value="1"><%= texts.newest %></option>
					<option value="2"><%= texts.oldest %></option>
					<option value="3"><%= texts.atoz %></option>
					<option value="3"><%= texts.ztoa %></option>
				</select>
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
						<td><h3><a href="<%= meta.baseurl %>/initiative?initiative_id=<%= inis[i].id %>"><%= inis[i].title %></a></h3><% 
						if(!inis[i].hasalternatives) {
						%><a href='<%= meta.baseurl %>/area?area_id=<%= inis[i].area_id %>'><%= inis[i].area %></a><% } %></td>
						<td><%= inis[i].unit %></td>
						<td>
							<ul class="bargraph" title="<%= inis[i].supporter %> <%= texts.supporter %> / <%= inis[i].potsupporter %> <%= texts.potsupporter %> / <%= inis[i].uninterested %> <%= texts.uninterested %>">
								<li class="bargraph-quorum" style="left:<%= inis[i].quorum %>%;"></li>
								<li class="bargraph-support" style="width:<%= inis[i].support %>%"></li>
								<li class="bargraph-potential" style="width:<%= inis[i].potential %>%"></li>
								<li class="bargraph-uninvolved" style="width:<%= inis[i].uninvolved %>%"></li>
							</ul>
						</td>
						<td><% if(inis[i].status == texts.statusstep4) { %><span class="table-vote"><% } %><%= inis[i].status %><% 
						if(inis[i].status == texts.statusstep4) { %></span><% }
						%><br /><%= inis[i].lastaction.date %> <%= inis[i].lastaction.time %> <%= inis[i].lastaction.action %><%
						if(inis[i].delegate) { 
						%><p class="table-delegate"><a href="#"><img title="<%= texts.delegationend %>" src="<%= meta.baseurl %>/<%= inis[i].delegate.picsmall %>"/></a></p><%
						} %></td>
					</tr><%
					} %>													
				</table>
			<div class="box-footer">
				<ul class="pagination">
					<% if(initable.activepage == 1) { %><li class="button button-backward-off"><%= texts.backshort %></li><% } else { %><li><a class="button button-backward" href="<%= meta.baseurl %>/search?filter=<%= initable.filter %>&page=<%= ( initable.activepage - 1 ) %>"><%= texts.backshort %></a></li><% }
					if(initable.pages > 1) {					
						for(var i = 1; i <= initable.pages; i++) {
							if(i == initable.activepage) { %>
								<li class="active"><%= i %></li>
							<% }
							else { %>
								<li><a href="<%= meta.baseurl %>/search?filter=<%= initable.filter %>&page=<%= i %>"><%= i %></a></li>
							<% }
						}
					}
					var nextpage = ( initable.activepage - 1 ) + 2;
					if(initable.activepage < initable.pages) { %><li><a class="button button-forward" href="<%= meta.baseurl %>/search?filter=<%= initable.filter %>&page=<%= nextpage %>"><%= texts.forward %></a></li><% } else { %><li class="button button-forward-off"><%= texts.forward %></li><% } %>
				</ul>
			</div>
		</div>
		<div class="threecol box last unavailable">
			<h2>Suchergebnis: Personen</h2>
			<div class="box-description">

				<label class="table-label" for="select_fiter2">sortiert nach:</label>	
				<select id="select-filter2" name="filter">							
					<option value="1">A-Z</option>
					<option value="2">Z-A</option>
					<option value="3">Delegationsmacht</option>
					<option value="3">Neu</option>
				</select>

			</div>	
			
				<div class="box-delegate-info box-supporters">
					<a href="#"><img src="content_img/profile_small.png" alt="Profilbild"/></a>
					<h3><a href="#">Johannes Knopp</a> <a href="" class="for">+23</a></h3>
				</div>

				<div class="box-delegate-info box-supporters">
					<a href="#"><img src="content_img/profile_small.png" alt="Profilbild" /></a>
					<h3><a href="#">Doktor Knopp</a></h3>
				</div>



				<div class="box-delegate-info box-supporters">
					<a href="#"><img src="content_img/profile_small.png" alt="Profilbild" /></a>
					<h3><a href="#">Johannes Knopp Doppelgänger</a></h3>
				</div>
				<div class="box-delegate-info box-supporters">
					<a href="#"><img src="content_img/profile_small.png" alt="Profilbild" /></a>
					<h3><a href="#">Johannes Knopp</a></h3>
				</div>
										
				<div class="box-delegate-info box-supporters">
					<a href="#"><img src="content_img/profile_small.png" alt="Profilbild" /></a>
					<h3><a href="#">Hans Dampf</a> <a href="" class="for">+1</a></h3>
				</div>
				<div class="box-delegate-info box-supporters">
					<a href="#"><img src="content_img/profile_small.png" alt="Profilbild" /></a>
					<h3><a href="#">Doktor Knopp</a></h3>
				</div>
				<div class="box-delegate-info box-supporters">
					<a href="#"><img src="content_img/profile_small.png" alt="Profilbild" /></a>
					<h3><a href="#">Jo Knopp</a> <a href="" class="for">+1</a></h3>
				</div>
				<div class="box-delegate-info box-supporters">
					<a href="#"><img src="content_img/profile_small.png" alt="Profilbild" /></a>
					<h3><a href="#">Johannes Knopp</a> <a href="" class="for">+23</a></h3>
				</div>
				<div class="box-delegate-info box-supporters">
					<a href="#"><img src="content_img/profile_small.png" alt="Profilbild" /></a>
					<h3><a href="#">Johannes Knopp Doppelgänger</a></h3>
				</div>
				<div class="box-delegate-info box-supporters">
					<a href="#"><img src="content_img/profile_small.png" alt="Profilbild" /></a>
					<h3><a href="#">Johannes Knopp Doppelgänger</a></h3>
				</div>
				<div class="box-delegate-info box-supporters">
					<a href="#"><img src="content_img/profile_small.png" alt="Profilbild" /></a>
					<h3><a href="#">Johannes Knopp</a> <a href="" class="for">+23</a></h3>
				</div>
				<div class="box-delegate-info box-supporters">
					<a href="#"><img src="content_img/profile_small.png" alt="Profilbild" /></a>
					<h3><a href="#">Johannes Knopp 2</a></h3>
				</div>	
				<div class="box-delegate-info box-supporters">
					<a href="#"><img src="content_img/profile_small.png" alt="Profilbild" /></a>
					<h3><a href="#">Hans Dampf</a> <a href="" class="for">+1</a></h3>
				</div>
				<div class="box-delegate-info box-supporters">
					<a href="#"><img src="content_img/profile_small.png" alt="Profilbild" /></a>
					<h3><a href="#">Doktor Knopp</a></h3>
				</div>
												
			<div class="box-footer">		
				<ul class="pagination">
					<li class="button button-backward-off">zurück</li>
					<li class="active">1</li>
					<li><a href="?page=2">2</a></li>
					<li><a class="button button-forward" href="#">weiter</a></li>
				</ul>			 
			</div>
		</div>		
	</div>
	
	<div id="push"></div>
</div>
