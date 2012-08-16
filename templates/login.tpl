<div id="contentcontainer" class="container">
	<div class="row">

		<div class="eightcol box">
			<h2>Bombay Crushed Demo</h2>


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
				<h3>Willkommen bei unserer Demo von Bombay Crushed. </h3>
				<p>Damit Ihr mal was zu sehen bekommt, haben wir die Startseite an das  <a href="http://dev.liquidfeedback.org/lf2/index/register.html">LF 2.0 Testinterface</a> angebunden. Hier könnt ihr einen Eindruck bekommen, was euch erwartet. Natürlich wartet noch eine ganze Menge Arbeit auf uns, und es wird noch etwas dauern, bis wir Einsatzfähig sind. Die gute Nachricht: das ganze liegt auf <a href="https://github.com/SaftigeKumquat/Bombay-Crushed">github</a> und wir freuen uns über jeden, der mit uns am Quellcode arbeitet.</p>
				<p>Habt Verständnis dafür, dass wir einige Veränderungswünsche auf das nächste Release verschieben werden. Es gilt für uns zwar die Maxime „It's done when it's done“, aber in alle Ewigkeit wollen wir das Release auch nicht herauszögern, und solange es LQFB gibt wird es wohl auch neue Ideen geben. </p>
				<p>Alles Liebe, <br />Eure&nbsp;Saftige Kumquat</p><br />

			</div>
		</div>

		<div class="threecol box last">
			<h2>Das Team</h2>
			<div class="box-description">
				<p>Die Saftige Kumquat sind:</p>
			</div>


			<div class="box-delegate-info profile-delegate">
					<img src="<%= meta.baseurl %>/content_img/profile_delegate_2.png" alt="Profilbild" />
					<div>
						<h3><a href="#">Christophe Chan&nbsp;Hin</a></h3>
						<div class="profile-delegate-theme"><a class="hiddenlink" href="https://twitter.com/#!/incredibul"><span class="unit">@incredibul</span></a></div>
					</div>
			</div>
			<div class="box-delegate-info profile-delegate">
					<img src="<%= meta.baseurl %>/content_img/profile_delegate_1.png" alt="Profilbild" />
					<div>
						<h3><a href="#">Christoph Fritzsche</a></h3>
						<div class="profile-delegate-theme"><a class="hiddenlink" href="https://twitter.com/#!/cfritzsche"><span class="unit">@cfritzsche</span></a></div>
					</div>
			</div>
			<div class="box-delegate-info profile-delegate">
					<img src="<%= meta.baseurl %>/content_img/profile_delegate_3.png" alt="Profilbild" />
					<div>
						<h3><a href="#">Johannes Knopp</a></h3>
						<div class="profile-delegate-theme"><a class="hiddenlink" href="https://twitter.com/#!/joknopp"><span class="unit">@joknopp</span></a></div>
					</div>
			</div>
			<div class="box-delegate-info profile-delegate">
					<img src="<%= meta.baseurl %>/content_img/profile_delegate_4.png" alt="Profilbild" />
					<div>
						<h3><a href="#">Matthias Bach</a></h3>
						<div class="profile-delegate-theme"><a class="hiddenlink" href="https://twitter.com/#!/theMarix"><span class="unit">@themarix</span></a></div>
					</div>
			</div>
			<div class="box-footer">
				<p>Wir freuen uns über jeden, der jetzt in der Umsetzungsphase dazustößt :)</p>
			</div>

		</div>

	</div>
	<div id="push"></div>
</div>
