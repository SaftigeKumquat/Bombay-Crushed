<div id="contentcontainer" class="container">
	<div class="row">

		<div class="twelvecol box last">
			<h2><%= texts.delegateview %></h2>
				<label class="table-label" for="select_fiter"><%= texts.level %>:</label>
				<select id="select-filter" name="filter">
					<option value="1"><%= texts.globallevel %></option>
					<option value="2"><%= texts.unitlevel %></option>
					<option value="3"><%= texts.arealevel %></option>
					<option value="4"><%= texts.issuelevel %></option>
				</select>
				
			<div class="box-footer">
			 
			</div>
		</div>
	</div>
	<div class="row">

		<div class="twelvecol box last">
			<h2><%= texts.yourdelegates %></h2>
			<div class="box-description">
				<p><%= texts.lastactions %>:</p>
			</div>

			<% for(var i = 0; i < delegations.length; i++) { %><div class="box-delegate-info">
				<img src="<%= delegations[i].user.picsmall %>" alt="<%= texts.profilepic %>" />
				<h3><a href="#"><%= delegations[i].user.name %></a><br /><span class="<%= delegations[i].action %>"><%
		if(delegations[i].action == 'for') {
		%><%= texts.for %><% }
		if(delegations[i].action == 'against') {
		%><%= texts.against %><% }
		if(delegations[i].action == 'support') {
		%><%= texts.supports %><% }
		%></span></h3>
				<p><a class="hiddenlink" href="#"><%= delegations[i].title %></a> <a href="#"><%= texts.votingcomment %></a></p>
			</div><% } %>

			<div class="box-footer">
				<a href="#" class="button button-forward"><%= texts.more %></a>
			</div>

		</div>

	</div>
	<div id="push"></div>
