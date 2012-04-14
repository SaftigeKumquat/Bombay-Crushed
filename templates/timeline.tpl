<div id="contentcontainer" class="container">
	<div class="row">
		<div class="twelvecol box last ">
			<h2>Filter einstellen</h2>
			<form method="get" action="/search" id="timeline-filter">
				<div class="timeline-filter-timerange">
				    <input type="radio" name="timerange" id="radio-1"/>
				    	<label for="radio-1">Letzte 24 Stunden</label>
				    <input type="radio" name="timerange" id="radio-2"/>
				    	<label for="radio-2"><input name="age" type="text" size="14" placeholder="age: 40 days" /></label>
			    </div>	
			   	<table class="filtertable">
					<tr>
						<th>Themen-Ereignisse</th>
						<th>Zeige nur Ereignisse welche folgendes erfüllen... (oder-verknüpft)</th>
					</tr>
					<tr class="odd">
						<td>
							<span class="searchfilter-theme-occurence">	
								<input type="checkbox" id="searchfilter-theme-occurence1">
								<label for="searchfilter-theme-occurence1">Neues Thema</label>
							</span>
						</td>
						<td>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-theme-occurence1-member">
								<label for="searchfilter-theme-occurence1-member">Mitglied des Themenbereichs</label>
							</span>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-theme-occurence1-interested">
								<label for="searchfilter-theme-occurence1-interested">Interessiert</label>
							</span>							
						</td>
					</tr>
					<tr>
						<td>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-theme-occurence2">
								<label for="searchfilter-theme-occurence2">Thema abgebrochen</label>
							</span>
						</td>
						<td>
						<span class="searchfilter-theme-occurence">
							<input type="checkbox" id="searchfilter-theme-occurence2-member">
							<label for="searchfilter-theme-occurence2-member">Mitglied des Themenbereichs</label>
						</span>
						<span class="searchfilter-theme-occurence">
							<input type="checkbox" id="searchfilter-theme-occurence2-interested">
							<label for="searchfilter-theme-occurence2-interested">Interessiert</label>
						</span>							
						</td>
					</tr>					
					<tr class="odd">
						<td>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-theme-occurence3">
								<label for="searchfilter-theme-occurence3">Thema akzeptiert</label>
							</span>
						</td>
						<td>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-theme-occurence3-member">
								<label for="searchfilter-theme-occurence3-member">Mitglied des Themenbereichs</label>
							</span>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-theme-occurence3-interested">
								<label for="searchfilter-theme-occurence3-interested">Interessiert</label>
							<span>							
						</td>
					</tr>
					<tr>
						<td>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-theme-occurence4">
								<label for="searchfilter-theme-occurence4">Thema eingefroren</label>
							</span>
						</td>
						<td>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-theme-occurence4-member">
								<label for="searchfilter-theme-occurence4-member">Mitglied des Themenbereichs</label>
							</span>
							<span class="searchfilter-theme-occurence">	
								<input type="checkbox" id="searchfilter-theme-occurence4-interested">
								<label for="searchfilter-theme-occurence4-interested">Interessiert</label>
							</span>							
						</td>
					</tr>
					<tr class="odd">
						<td>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-theme-occurence5">
								<label for="searchfilter-theme-occurence5">Thema ohne Abstimmung abgeschlossen</label>
							</span>
						</td>
						<td>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-theme-occurence5-member">
								<label for="searchfilter-theme-occurence5-member">Mitglied des Themenbereichs</label>
							</span>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-theme-occurence5-interested">
								<label for="searchfilter-theme-occurence5-interested">Interessiert</label>
							</span>							
						</td>
					</tr>
					<tr>
						<td>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-theme-occurence6">
								<label for="searchfilter-theme-occurence6">Abstimmung begonnen</label>
							</span>
						</td>
						<td>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-theme-occurence6-member">
								<label for="searchfilter-theme-occurence6-member">Mitglied des Themenbereichs</label>
							</span>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-theme-occurence6-interested">
								<label for="searchfilter-theme-occurence6-interested">Interessiert</label>
							</span>							
						</td>
					</tr>		
					<tr class="odd">
						<td>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-theme-occurence7">
								<label for="searchfilter-theme-occurence7">Thema abgeschlossen</label>
							</span>
						</td>
						<td>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-theme-occurence7-member">
								<label for="searchfilter-theme-occurence7-member">Mitglied des Themenbereichs</label>
							</span>
							<span class="searchfilter-theme-occurence">
								<input type="checkbox" id="searchfilter-theme-occurence7-interested">
								<label for="searchfilter-theme-occurence7-interested">Interessiert</label>
							</span>							
						</td>
					</tr>								
				</table>	 				    	
			</form>
		</div>
	</div>
	<div class="row">
		<div class="twelvecol box last">
			<h2>Initiativen</h2>
				<label class="table-label" for="select_fiter">Filter:</label>	
				<select id="select-filter" name="filter">							
					<option value="1">Neue oder kürzlich geänderte Inititativen</option>
					<option value="2">Nur neue Initiativen</option>
					<option value="3">Nur Abstimmungen</option>
					<option value="4">Feedback zu eigenen Initiativen</option>		
				</select>
				<table>
					<tr>
						<th>Inititative</th>
						<th>Unit</th>
						<th>Unterstützung</th>
						<th>Status</th>
					</tr>
					<tr class="odd">
						<td><h3><a href="#">Für liberalisierte Ladenöffnungszeiten</a></h3><a href='#'>Wirtschaft, Soziales</a></td>
						<td>Bund</td>
						<td>
							<ul class="bargraph" title="365 Unterstützer / 15 potentielle Unterstützer / 631 nicht interessiert">
								<li class="bargraph-quorum" style="left:5%;"></li>
								<li class="bargraph-support" style="width:30%"></li>
								<li class="bargraph-potential" style="width:10%"></li>
								<li class="bargraph-uninvolved" style="width:60%"></li>	
							</ul>
						</td>
						<td>1.Neu</td>
					</tr>
					<tr>
						<td><h3><a href='#'>Karenzzeiten für Politiker und Beamte</a></h3><a href='#'>Inneres, Demokratie, Recht, Sicherheit</a></td>
						<td>Baden-Württemberg</td>
						<td>
							<ul class="bargraph" title="365 Unterstützer / 15 potentielle Unterstützer / 631 nicht interessiert">
								<li class="bargraph-quorum" style="left:5%;"></li>
								<li class="bargraph-support" style="width:40%"></li>
								<li class="bargraph-potential" style="width:10%"></li>
								<li class="bargraph-uninvolved" style="width:50%"></li>	
							</ul>
						</td>
						<td>1.Neu<p class="table-delegate"><a href="#"><img title="Ende der Delegationskette: Johannes Knopp" src="content_img/profile_small.png"/></a></p></td>
					</tr>
					<tr class="odd">
						<td><h3><a href='#'>Freier Zugang zu öffentlichen Inhalten</a></h3><a href='#'>Digitales, Urheber-/ Patentrecht, Datenschutz</a></td>
						<td>Bund</td>
						<td>
							<ul class="bargraph" title="365 Unterstützer / 15 potentielle Unterstützer / 631 nicht interessiert">
								<li class="bargraph-quorum" style="left:5%;"></li>
								<li class="bargraph-support" style="width:30%"></li>
								<li class="bargraph-potential" style="width:10%"></li>
								<li class="bargraph-uninvolved" style="width:60%"></li>	
							</ul>
						</td>
						<td><span class="table-vote">4.Abstimmung</span></td>
					</tr>	
					<tr>
						<td><h3><a href='#'>Abschaffung der Zeitumstellung</a></h3></td>
						<td>Bund</td>
						<td>
							<ul class="bargraph" title="365 Unterstützer / 15 potentielle Unterstützer / 631 nicht interessiert">
								<li class="bargraph-quorum" style="left:5%;"></li>
								<li class="bargraph-support" style="width:30%"></li>
								<li class="bargraph-potential" style="width:10%"></li>
								<li class="bargraph-uninvolved" style="width:60%"></li>	
							</ul>

						</td>
						<td>2.Diskussion</td>
					</tr>
					<tr class="table-alternateinitiative">
						<td><h3><a href='#'>Abschaffung der Zeitumstellung, Beibehaltung Sommerzeit</a></h3><a href='#'>Wirtschaft, Soziales</a></td>
						<td>Bund</td>
						<td>
							<ul class="bargraph" title="365 Unterstützer / 15 potentielle Unterstützer / 631 nicht interessiert">
								<li class="bargraph-quorum" style="left:3%;"></li>
								<li class="bargraph-support" style="width:10%"></li>
								<li class="bargraph-potential" style="width:30%"></li>
								<li class="bargraph-uninvolved" style="width:60%"></li>	
							</ul>

						</td>
						<td>2.Diskussion</td>
					</tr>
					<tr class="odd">
						<td><h3><a href='#'>Freier Zugang zu öffentlichen Inhalten</a></h3><a href='#'>Digitales, Urheber-/ Patentrecht, Datenschutz</a></td>
						<td>Bund</td>
						<td>
							<ul class="bargraph" title="365 Unterstützer / 15 potentielle Unterstützer / 631 nicht interessiert">
								<li class="bargraph-quorum" style="left:5%;"></li>
								<li class="bargraph-support" style="width:30%"></li>
								<li class="bargraph-potential" style="width:10%"></li>
								<li class="bargraph-uninvolved" style="width:60%"></li>	
							</ul>
						</td>
						<td><span class="table-vote">4.Abstimmung</span></td>
					</tr>														
				</table>
			<div class="box-footer">			
				<ul class="pagination">
					<li class="button button-backward-off">zurück</li>
					<li class="active">1</li>
					<li><a href="?page=2">2</a></li>
					<li><a href="?page=3">3</a></li>
					<li><a href="?page=4">4</a></li>
					<li><a href="?page=5">5</a></li>
					<li><a href="?page=6">6</a></li>
					<li><a href="?page=7">7</a></li>
					<li><a class="button button-forward" href="#">weiter</a></li>
				</ul>				 
			</div>
		</div>
	</div>
	
	<div id="push"></div>
</div>
