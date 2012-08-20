<div id="contentcontainer" class="container">
	<div class="row">

		<div class="eightcol box">
			<h2>Bombay Crushed Read-only beta</h2>


			<div class="box-footer box-editorial">
			    <h3>Log In</h3>
				<form method="post" action="<%= meta.baseurl %>/login" >
    				<fieldset id="input-sub">
						<% if(meta.refresh_url) { %>
							<input name="refresh-url" type="hidden" value="<%= meta.refresh_url %>" />
						<% } %>
 						<input id="api-key" name="key" type="text" size="25" placeholder="API-Key eingeben" autofocus required />
   					</fieldset>
  				  	<fieldset id="actions">
    			    			<input type="submit" id="submit" value="Enter">
   				 	</fieldset>
				</form>
				<br />
				<h3>Willkommen bei der read-only beta von Bombay Crushed.</h3>
				<p></p>
				<p>Schrittweise nähern wir uns dem Ziel. Die technischen und politischen Einschränkungen lassen leider keinen Schreibzugriff zu, wir wollen euch aber so früh wie möglich mit der neuen Oberfläche konfrontieren. Mit dieser read-only beta könnt ihr alles anschauen, leider aber selbst keine Aktionen machen. Bis dahin ist es noch viel Arbeit. Die gute Nachricht: das ganze liegt auf <a href="https://github.com/SaftigeKumquat/Bombay-Crushed/">github</a> und wir freuen uns über jeden, der mit uns am Quellcode arbeitet.</p>
				<p>Habt Verständnis dafür, dass wir einige Veränderungswünsche auf die nahe Zukunft verschieben werden. Es gilt für uns zwar die Maxime „It's done when it's done“, aber in alle Ewigkeit wollen wir das Release auch nicht herauszögern, und solange es LQFB gibt wird es wohl auch neue Ideen geben.</p>
				<p></p>
				<p>Einen API-Key bekommst du, in dem du dich in <a href="http://lqfb.piratenpartei.de">Liquid Feedback</a> einloggst und dann rechts oben auf deinen Namen › Einstellungen › Einstellungen für Entwickler klickst.</p>
				<p>Alles Liebe, <br />Eure&nbsp;Saftige Kumquat</p><br /> 

			</div>
		</div>

		<div id="loginnews" class="fourcol box">
			<h2><%= texts.news %></h2>
			<div class="box-description">
				<p><%= texts.newstext %></p>
			</div>
			<div id="newschart" class="box-news-piechart">
				<h3><a href="#"><%= news.chart.title %></a></h3>
				<canvas id="piechart" width="110px" height="110px">Piechart</canvas>
				<table id="piechart-table"><tbody>
				    <tr><td class="piechart-number"><%= news.chart.for %></td><td class="for"><%= texts.chartfor %></td></tr>
				    <tr><td class="piechart-number"><%= news.chart.fordelegated %></td><td class="for-delegated"><%= texts.chartdelegatedfor %></td></tr>
				    <tr><td class="piechart-number"><%= news.chart.against %></td><td class="against"><%= texts.chartagainst %></td></tr>
				    <tr><td class="piechart-number"><%= news.chart.againstdelegated %></td><td class="against-delegated"><%= texts.chartdelegatedagainst %></td></tr>
				</tbody></table>

			</div>
			<div id="logingraph" class="box-news-bargraph">
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
			<div id="loginpages" class="box-footer">
				<% if(news.activepage < news.pages) { var nextpage = ( news.activepage - 1 ) + 2; %><a href="<%= meta.baseurl %>/login?newspage=<%= nextpage %>" class="button button-forward"><%= texts.next %></a><% } else { %><a href="#" class="button button-forward"><%= texts.next %></a><% } %>
				<% if(news.activepage > 1) { %><a href="<%= meta.baseurl %>/login?newspage=<%= (news.activepage - 1) %>" class="button button-backward"><%= texts.previous %></a></li><% } else { %><a href="#" class="button button-backward"><%= texts.previous %></a><% } %>
			</div>
		</div>

	</div>
		<div class="row">

		<div class="eightcol box first">
			<h2>Die Designphilosophie</h2>
			<div class="box-footer box-editorial">
				<p></p>
				<p>Webseiten sind eher mit Produktdesign als mit Grafikdesign vergleichbar, auch wenn sie auf einer planen Oberfläche stattfinden. Dies gilt umso mehr, wenn es sich um eine Webanwendung handelt. Zusätzliche Funktionen sind unserer Meinung nach nicht das Ziel der LQFB Weiterentwicklung, sondern konstante Verbesserung der Benutzeroberfläche. Unserer Meinung nach ist z.B. das Problem einzelner Personen mit sehr vielen Delegationen kein Problem, dass neue Funktionen erfordert, mit denen man Delegationen beschränken oder feiner einstellen kann. Das wird letztlich Nutzende weiter verwirren, da zusätzliche Handlungsmöglichkeiten auch höhere Komplexität bedeuten.</p>
				<p>Stattdessen setzen wir auf Sichtbarkeit und Feedback: Nutzende werden vom System visuell informiert, dass sie ihre Stimme delegieren und was mit dieser passiert. Bei jeder neuen Funktion fragen wir also immer: Rechtfertigt der gewünschte Nutzen eine erhöhte Komplexität, im Zweifel schlechtere Bedienbarkeit? Wird ein System demokratischer, wenn es dem Nutzenden möglichst viele Einstellungsmöglichkeiten gibt, oder wenn es möglichst niedrige Hürden zur Beteiligung aufbaut und sich bei Informationen in der Bringschuld sieht? Hier wollen wir einen Denkprozess in Gang setzen. </p>
				<p></p>

				<p>Wir legen Wert darauf, dass unsere Oberfläche auf Smartphones und Tablets gut bedienbar ist (verändere die Größe des Browserfensters, um einen Eindruck zu bekommen). Buttons und Links sollten möglichst immer so groß sein, dass auch große Wurstfinger eine Chance haben, den richtigen Punkt zu erwischen.  Wir wollen darüberhinaus zusammenhängende Themen auf <a href="http://uxmovement.com/navigation/why-scrolling-is-the-new-click/">einer Seite präsentieren, statt sie auf viele Einzelseiten zu verteilen</a>, um Nutzenden die Zusammenhänge klar zu machen.</p>
				<p></p>
				<p>Weitere Informationen zur Gestaltung finden sich auf <a href="http://saftigekumquat.org/">saftigekumquat.org</a> (und darüber hinaus finden sich hier zu unserem Projekt <a href="http://www.artybollocks.com">noch weitere Statements</a>.)</p>
				<p></p>
				

			</div>
		</div>
		
	</div>


	<div id="push"></div>
</div>
