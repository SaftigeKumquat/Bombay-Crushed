<div id="contentcontainer" class="container">
	<div class="row">
		<div class="twocol nobox">
			<h2><%= user.nick %></h2>
			<p id="profile-image">
 				<img src="<%= meta.baseurl %>/<%= user.picbig %>" alt="<%= texts.profilepic %>" />
 				<a class="button" button-backward-off""><%= texts.changepic %></a>
			</p>
		</div>
		<div class="eightcol box">
			<h2><%= texts.yourdata %></h2>

			<div id="hcard-<%= user.divname %>" class="profile-data vcard">
				<dl>
					<% if(user.nick !== undefined) { %><dt><%= texts.pseudonym %></dt><dd><%= user.nick %></dd><% } %>
					<% if(user.name !== undefined) { %><dt><%= texts.realname %></dt><dd><%= user.name %></dd><% } %>
					<% if(user.website !== undefined) { %><dt><%= texts.website %></dt><dd><a href="http://<%= user.website %>"><%= user.website %></a></dd><% } %>
					<% if(user.profession !== undefined) { %><dt><%= texts.profession %></dt><dd><%= user.profession %></dd><% } %>
					<% if(user.birthdate !== undefined) { %><dt><%= texts.birthdate %></dt><dd><%= user.birthdate %></dd><% } %>
					<br />
					<% if(user.email !== undefined) { %><dt><%= texts.email %></dt><dd><a href="mailto:<%= user.email %>"><%= user.email %></a></dd><% } %>
					<% if(user.twitter !== undefined) { %><dt><%= texts.twitter %></dt><dd><a href="http://www.twitter.com/<%= user.twitter %>">@<%= user.twitter %></a></dd><% } %>
					<% if(user.facebook !== undefined) { %><dt><%= texts.facebook %></dt><dd><a href="http://www.facebook.com/<%= user.facebook %>">http://www.facebook.com/<%= user.facebook %></a></dd><% } %>
					<% if(user.googleplus !== undefined) { %><dt><%= texts.googleplus %></dt><dd><a href="http://plus.google.com/<%= user.googleplus %>">http://plus.google.com/<%= user.googleplus %></a></dd><% } %>
					<% if(user.jabber !== undefined) { %><dt><%= texts.jabber %></dt><dd><a href="#"><%= user.jabber %></a></dd><% } %>
					<% if(user.phone !== undefined) { %><dt><%= texts.phone %></dt><dd><%= user.phone %></dd><% } %>
					<% if(user.mobile !== undefined) { %><dt><%= texts.mobile %></dt><dd><%= user.mobile %></dd><% } %>
					<br />
					<% if(user.units.length != 0) { %><dt><%= texts.units %></dt><dd><% for(var i=0; i < user.units.length; i++) { %><% if(i > 0) { %>, <% } %><%= user.units[i].name %><% } %></dd><% } %>
					<% if(user.offices !== undefined) { %><dt><%= texts.offices %></dt><dd><%= user.offices %></dd><% } %>
					<% if(user.memberships !== undefined) { %><dt><%= texts.memberships %></dt><dd><%= user.memberships %></dd><% } %>		
					<% if(user.statement !== undefined) { %><dt><%= texts.statement %></dt><dd><%= user.statement %></dd><% } %>
				</dl>
			</div>
			<div class="box-footer"><a class="button" href="#"><%= texts.changedata %></a></div>
		</div>
		<div class="twocol last">
		</div>
	</div>
	<div class="row">
		<div class="twocol box">
			<h2><%= texts.delegations %></h2>
			<div class="box-description">
				<p><%= user.nick %> <%= texts.mostvotes %></p>
			</div>

			<% for(var i=0; i < delegateactions.length; i++ ) { %><div class="box-delegate-info profile-delegate">
					<img src="<%= meta.baseurl %>/<%= delegateactions[i].user.picsmall %>" alt="<%= texts.profilepic %>" />
					<div>
						<h3><a href="#"><%= delegateactions[i].user.name %></a></h3>
						<div class="profile-delegate-theme"><a class="hiddenlink" href="#"><span class="unit"><%= delegateactions[i].unit %></span> <%= delegateactions[i].area %></a> <span class="for">(+<%= delegateactions[i].count %>)</span></div>
					</div>
			</div> <% } %>

			<div class="box-footer">
				<p><%= texts.strongestdelegates %> <%= user.nick %></p>
			</div>

			<% for(var i=0; i < strongestdelegates.length; i++ ) { %><div class="box-delegate-info profile-delegate">
					<img src="<%= meta.baseurl %>/<%= strongestdelegates[i].user.picsmall %>" alt="<%= texts.profilepic %>" />
					<div>
						<h3><a href="#"><%= strongestdelegates[i].user.name %></a></h3>
						<div class="profile-delegate-theme"><a class="hiddenlink" href="#"><span class="unit"><%= strongestdelegates[i].unit %></span> <%= strongestdelegates[i].area %></a> <span class="for">(+<%= strongestdelegates[i].count %>)</span></div>
					</div>
			</div> <% } %>

			<div class="box-footer">
				<a href="#" class="button button-forward"><%= texts.more %></a>
			</div>

		</div>
		<div class="eightcol last box">
			<h2><%= texts.votingcomments %></h2>
			<div class="box-description">
				<form method="get" action="search" id="search-sub">
 					<input name="q" type="text" size="40" placeholder="<%= texts.entersearch %>" />
				</form>
			</div>

			<% for(var i=0; i < votingcomments.length; i++) { %><div class="box-statements-statement">
			<h3><a href="#"><%= votingcomments[i].user.nick %></a> <%= texts.at %> <%= votingcomments[i].date %> <span class="<%= votingcomments[i].action %>"><%
		if(votingcomments[i].action == 'for') {
		%><%= texts.for %><% }
		if(votingcomments[i].action == 'against') {
		%><%= texts.against %><% }
		if(votingcomments[i].action == 'support') {
		%><%= texts.supports %><% }
		%></span>
				<a href="#"><%= votingcomments[i].topic %></a>, <%= texts.because %></h3>
				<p><%- votingcomments[i].comment %></p>
			</div><% } %>

			<div class="box-footer">
				<a href="#" class="button button-forward"><%= texts.next %></a>
				<a href="#" class="button button-backward"><%= texts.previous %></a>
			</div>
		</div>

		</div>
	</div>
	<div id="push"></div>
</div>
