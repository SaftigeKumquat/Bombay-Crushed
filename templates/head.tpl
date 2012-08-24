<!doctype html>
<html lang="de">


<head>
	<meta charset="utf-8" />
	<title><%= texts.title %></title>
	<% if(meta.do_refresh) { %>
		<meta http-equiv="refresh" content="2; URL=<%= meta.refresh_url %>" />
	<% } %>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<link rel="stylesheet" href="<%= meta.baseurl %>/css/reset.css" type="text/css" media="screen" />

	<!-- 1140px Grid styles for IE -->
	<!--[if lte IE 9]><link rel="stylesheet" href="css/ie.css" type="text/css" media="screen" /><![endif]-->
	<!-- The 1140px Grid - http://cssgrid.net/, modified by Christophe Chan Hin -->
	<link rel="stylesheet" href="<%= meta.baseurl %>/css/1140.css" type="text/css" media="screen" />
	<!-- Your styles -->
	<link rel="stylesheet" href="<%= meta.baseurl %>/css/styles.css" type="text/css" media="screen" />
	<!--css3-mediaqueries-js - http://code.google.com/p/css3-mediaqueries-js/ - Enables media queries in some unsupported browsers-->
	<script type="text/javascript" src="<%= meta.baseurl %>/js/css3-mediaqueries.js"></script>
	<script type="text/javascript" src="<%= meta.baseurl %>/js/jquery-1.7.2.min.js"></script>
	<script type="text/javascript" src="<%= meta.baseurl %>/js/user_actions.js"></script>
</head>

<body>

<div id="header" class="container">
	<div class="row">
		<div class="twelvecol last">
			<a href="<%= meta.baseurl %>" title="<%= texts.back %>" id="logo">
 				 <img src="<%= meta.baseurl %>/img/logo.png" alt="LQFB logo" />
			</a>
			<ul id="metamenu">
				<% if(loggedin) { %>
				<li><a id="metamenu-logout" href="<%= meta.baseurl %>/logout"><%= texts.logout %></a></li>
				<% } else { %>
				<li><a id="metamenu-login" href="<%= meta.baseurl %>/login">einloggen</a></li>
				<% } %>
				<li><a href="#"><%= texts.terms %></a></li>
				<li><a href="#"><%= texts.privacy %></a></li>
				<li><a href="#"><%= texts.imprint %></a></li>
				<li><a href="#"><%= texts.contact %></a></li>
			</ul>
		</div>
	</div>
	<div class="row">
		<div class="twelvecol last">
			<ul id="mainmenu">
				<li><a <% if(meta.currentpage == "overview") { %>class="active" <% } %>href="<%= meta.baseurl %>/overview"><%= texts.overview %></a></li>
				<li><a <% if(meta.currentpage == "topics") { %>class="active" <% } %>href="<%= meta.baseurl %>/topics"><%= texts.topics %></a></li>
				<!-- Removed empty delegates page for milestone 1
				<li><a <% if(meta.currentpage == "contacts") { %>class="active" <% } %>href="<%= meta.baseurl %>/contacts"><%= texts.contacts %></a></li> -->
				<li><a <% if(meta.currentpage == "profile") { %>class="active" <% } %>href="<%= meta.baseurl %>/profile"><%= texts.profile %></a></li>
				<li><a <% if(meta.currentpage == "timeline") { %>class="active" <% } %>href="<%= meta.baseurl %>/timeline"><%= texts.timeline %></a></li>
			</ul>
			<!-- <form method="get" action="search" id="search">
 				 <input name="q" type="text" size="40" placeholder="<%= texts.search %>" />
			</form> -->
		</div>
	</div>
</div>
