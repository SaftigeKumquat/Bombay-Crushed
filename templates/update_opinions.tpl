<h2><%= texts.opinions %></h2>
<div class="box-description">
	<p><%= texts.opinioninfo %></p>
</div>

<table class="table-meinungen opiniontable">
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
	<ul class="pagination opinionpages">
		<% if(suggestion.opinionpage == 1) { %><li class="button button-backward-off"><%= texts.backshort %></li><% } else { 
			var prevpage = suggestion.opinionpage - 1;
		%><li><a class="button button-backward" href="#" onclick="update_opinions(<%= prevpage %>, <%= suggestion.id %>)"><%= texts.backshort %></a></li><% }
		for(var a = 1; a <= suggestion.opinionpages; a++) {
			if(a == suggestion.opinionpage) { %>
				<li class="active"><%= a %></li>
			<% }
			else { %>
				<li><a href="#" onclick="update_opinions(<%= a %>, <%= suggestion.id %>)"><%= a %></a></li>
			<% }
		}
		var nextpage = suggestion.opinionpage + 1;
		if(suggestion.opinionpage != suggestion.opinionpages) { %><li><a class="button button-forward" href="#" onclick="update_opinions(<%= nextpage %>, <%= suggestion.id %>)"><%= texts.forward %></a></li><% } else { %><li class="button button-forward-off"><%= texts.forward %></li><% } %>
	</ul>
</div>

