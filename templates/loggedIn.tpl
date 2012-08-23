<div id="contentcontainer" class="container">
	<div class="row">

		<div class="twelvecol box">
			<h2>Bombay Crushed Authentication</h2>

			<div class="box-footer box-editorial">
				<h3><% if(login.success) { %><%= texts.loginsuccessfull %><% } else { %><%= texts.loginfailed %><% } %></h3>
				<% if(login.message) { %><p><%= login.message %></p><% } %>
				<p><a href="<%= meta.refresh_url %>"><%= texts.clickhere %></a> <%= texts.ifnotredirected %></a></p>
			</div>

		</div>

	</div>
	<div id="push"></div>
</div>

