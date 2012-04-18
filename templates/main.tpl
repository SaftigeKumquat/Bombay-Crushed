<div id="contentcontainer" class="container">
	<div class="row">
		<div class="twocol nobox">
			<h2><%= user.nick %></h2>
			<a href="profile" title="<%= texts.editprofile %>" id="profile-image">
 				<img src="<%= user.picbig %>" alt="<%= texts.profilepic %>" />
			</a>
			<ul id="personal-menu">
				<li id="personal-menu-new"><a href="#"><span>+</span><%= texts.createtopic %></a></li>
				<li><a href="#"><span>+</span><%= texts.myinis %></a></li>
				<li><a href="#"><span>+</span><%= texts.supportedinis %></a></li>

			</ul>
		</div>
		<div class="tencol box last">
			<h2><%= texts.currentinis %></h2>
				<label class="table-label" for="select_fiter"><%= texts.filter %>:</label>	
				<select id="select-filter" name="filter">
				<% for(var i = 0; i < filter.length; i++) { %>
					<option value="<%= filter[i].id %>"><%= filter[i].text %></option>
				<% } %> 					
				</select>
				<table>
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
						if(inis[i].delegate) { 
						%><p class="table-delegate"><a href="#"><img title="<%= texts.delegationend %>" src="<%= inis[i].delegate.picsmall %>"/></a></p><%
						} %></td>
					</tr><%
					} %>
				</table>
			<div class="box-footer">			
				<ul class="pagination">
					<li class="button button-backward-off"><%= texts.backshort %></li>
					<% for(var i = 1; i <= initable.pages; i++) {
						if(i === initable.activepage) { %>
							<li class="active"><%= i %></li>
						<% }
						else { %>
							<li><a href="?page=<%= i %>"><%= i %></a></li>	
						<% } 
					} %>
					<li><a class="button button-forward" href="#"><%= texts.forward %></a></li>
				</ul>				 
			</div>
		</div>
	</div>
	<div class="row">
		<div class="twocol">
		</div>
		<div class="threecol box">
			<h2><%= texts.yourdelegates %></h2>
			<div class="box-description">
				<p><%= texts.lastactionyourvote %>:</p>
			</div>	
			<% for(var i = 0; i < delegations.length; i++) { %>
			<div class="box-delegate-info">
				<img src="<%= delegations[i].user.picsmall %>" alt="<%= texts.profilepic %>" />
				<h3><a href="#"><%= delegations[i].user.name %></a><br /><span class="<%= delegations[i].action %>"><%
		if(delegations[i].action == 'for') {
		%><%= texts.for %><% }
		if(delegations[i].action == 'against') {
		%><%= texts.against %><% }
		if(delegations[i].action == 'support') {
		%><%= texts.supports %><% }
		%></span></h3>
				<p><a class="hiddenlink" href="#"><%= delegations[i].title || '' %></a> <a href="#">Begründung</a></p>
			</div>
			<% } %>
			<div class="box-footer">
				<a href="#" class="button button-forward"><%= texts.more %></a>
			</div>

		</div>
		<div class="fourcol box">
			<h2><%= texts.news %></h2>
			<div class="box-description">
				<p><%= texts.newstext %></p>
			</div>	
			<div class="box-news-piechart">
				<h3><a href="#"><%= news.chart.title %></a></h3>
				<canvas id="piechart" width="110px" height="110px">Piechart</canvas>
				<table id="piechart-table">
				    <tr><td class="piechart-number"><%= news.chart.for %></td><td class="for"><%= texts.chartfor %></td></tr>
				    <tr><td class="piechart-number"><%= news.chart.fordelegated %></td><td class="for-delegated"><%= texts.chartdelegatedfor %></td></tr>
				    <tr><td class="piechart-number"><%= news.chart.against %></td><td class="against"><%= texts.chartagainst %></td></tr>
				    <tr><td class="piechart-number"><%= news.chart.againstdelegated %></td><td class="against-delegated"> <%= texts.chartdelegatedagainst %></td></tr>
				</table>

			</div>
			<div class="box-news-bargraph">
				<h3><a href="#"><%= news.graph.title %></a></h3>
				<ul class="bargraph bargraph-big" title="<%= news.graph.supporter %> <%= texts.supporter %> / <%= news.graph.potsupporter %> <%= texts.potsupporter %> / <%= news.graph.uninterested %> <%= texts.uninterested %>">
					<li class="bargraph-quorum" style="left:<%= news.graph.quorum %>%;"></li>
					<li class="bargraph-support" style="width:<%= news.graph.support %>%"></li>
					<li class="bargraph-potential" style="width:<%= news.graph.potential %>%"></li>
					<li class="bargraph-uninvolved" style="width:<%= news.graph.uninvolved %>%"></li>	
				</ul>
				<ul>
					<li><a href="#" class="for"><%= news.graph.supporter %> <%= texts.supporter %></a></li>
					<li><a href="#"><%= news.graph.potsupporter %> <%= texts.potsupporter %></a></li>
					<li><%= news.graph.uninterested %> <%= texts.uninvolved %></li>
				</ul>
			</div>
			<div class="box-footer">
				<a href="#" class="button button-forward"><%= texts.next %></a>
				<a href="#" class="button button-backward"><%= texts.previous %></a>
			</div>
		</div>
		<div class="threecol box last">
			<h2><%= texts.yourtopics %></h2>
			<div class="box-description">
				<p><%= texts.yourtopicstext %></p>
			</div>
			<div class="box-themes">
				<% for(var i = 0; i < units.length; i++) { %>
				<h3><%= units[i].name %></h3>
				<ul>
					<form>
					<% for(var k = 0; k < units[i].areas.length; k++) { %>
					<li>
						<input type="checkbox" id="unit<%= i+1 %>-option<%= k+1 %>"<% if(units[i].areas[k].checked) { %> checked<% } %>>
						<label for="unit<%= i+1 %>-option<%= k+1 %>"><%= units[i].areas[k].name %></label>
					</li>
					<% } %>
					</form>
				</ul>
				<% } %>
			</div>
		</div>
	</div>
	<div id="push"></div>
</div>
