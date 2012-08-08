<div id="contentcontainer" class="container">
	<div class="row">
		<div class="twocol noxbox first">
			</div>
 			<% if(issue.state == texts.status4) { %>
				<div class="sevencol alertbox last">
				<% if(issue.castvote) { %>
				<h2><%= texts.youalreadyvoted %></h2>
					<p><a class="button" href=""><%= texts.revokevote %></a></p>
				<% } else { %>
				<h2><%= texts.issuevotingopen %></h2>
					<p><a class="button" href=""><%= texts.votenow %></a></p>
				<% } %>
				</div>
			<% } %>
	</div>
	<div class="row">

		<div class="twocol nobox first">
			<h2>Mitgliedschaft</h2>
			<div class="interestbox"><p><%= texts.youareinterestedvotelater %></p></div>

			<h2>Optionen</h2>
			<ul id="personal-menu">
				<li id="personal-menu-interest"><a href="#">Interesse anmelden</a></li>
				<li id="personal-menu-later"><a href="#">Später abstimmen</a></li>
				<li id="personal-menu-nointerest"><a href="#">Interesse abmelden</p></a></li>
				<li id="personal-menu-nolater"><a href="#">Später abstimmen zurückziehen</p></a></li>
				<li><a href="#"><span>+</span>Thema delegieren</a></li>
				<li><a href="#"><span>+</span>Delegation ändern</a></li>
				<li  id="personal-menu-delegate"><a href="#"><img src="content_img/profile_delegate_1.png" alt="Profilbild" /><p>Christoph Fritzsche Delegation im Themenbereich entziehen</p></a></li>
				<li><a href="#"><span>+</span>Diskussion zum Thema</a></li>

			</ul>
		</div>
		<div class="tencol last doublebox">
			<div class="box">
				<h2>Themenbereich „Innen, Recht, Demokratie, Sicherheit“ Baden-Württemberg</h2>

						<div class="filtertable">
							<label class="table-label" for="select_fiter3">sortiert nach:</label>
							<select id="select-filter2" name="filter">
								<option value="1">Potentielle Unterstützung</option>
								<option value="2">Unterstützung</option>
								<option value="3">Neueste</option>
								<option value="4">Älteste</option>
							</select>
						</div>
						<table class="table-area">
							<tr>
								<th>Thema</th>
								<th>Zustand</th>
								<th>Initiativen</th>
								<th>Status</th>
							</tr>
							<tr class="odd">
								<td><a href="">Thema #1951</a></td>
								<td>2.Diskussion</td>
								<td><h3><a href="#">Recht auf Nacktheit im Öffentlichen Raum</a></h3></td>
								<td>
									<ul class="bargraph" title="365 Unterstützer / 15 potentielle Unterstützer / 631 nicht interessiert">
										<li class="bargraph-quorum" style="left:10%;"></li>
										<li class="bargraph-support" style="width:25%"></li>
										<li class="bargraph-potential" style="width:40%"></li>
										<li class="bargraph-uninvolved" style="width:30%"></li>
									</ul>
								</td>
							</tr>
							<tr class="table-alternateinitiative odd">
								<td></td>
								<td></td>
								<td><h3><a href="#">Recht auf relative Nacktheit im Raumzeitkontinuum</a></h3></td>
								<td>
									<ul class="bargraph" title="365 Unterstützer / 15 potentielle Unterstützer / 631 nicht interessiert">
										<li class="bargraph-quorum" style="left:30%;"></li>
										<li class="bargraph-support" style="width:5%"></li>
										<li class="bargraph-potential" style="width:10%"></li>
										<li class="bargraph-uninvolved" style="width:60%"></li>
									</ul>
								</td>
							</tr>
							<tr class="table-alternateinitiative odd">
								<td></td>
								<td></td>
								<td><h3><a href="#">Recht auf relative Nacktheit einfach überall</a></h3></td>
								<td>
									<ul class="bargraph" title="365 Unterstützer / 15 potentielle Unterstützer / 631 nicht interessiert">
										<li class="bargraph-quorum" style="left:30%;"></li>
										<li class="bargraph-support" style="width:5%"></li>
										<li class="bargraph-potential" style="width:10%"></li>
										<li class="bargraph-uninvolved" style="width:60%"></li>
									</ul>
								</td>
							</tr>
							<tr class="table-alternateinitiative odd">
								<td></td>
								<td></td>
								<td><h3><a href="#">Recht auf absolute Nacktheit im hier und jetzt</a></h3></td>
								<td>
									<ul class="bargraph" title="365 Unterstützer / 15 potentielle Unterstützer / 631 nicht interessiert">
										<li class="bargraph-quorum" style="left:30%;"></li>
										<li class="bargraph-support" style="width:5%"></li>
										<li class="bargraph-potential" style="width:10%"></li>
										<li class="bargraph-uninvolved" style="width:60%"></li>
									</ul>
								</td>
							</tr>
							<tr class="table-alternateinitiative odd">
								<td></td>
								<td></td>
								<td><h3><a href="#">Recht auf absolute Nacktheit im hier und jetzt</a></h3></td>
								<td>
									<ul class="bargraph" title="365 Unterstützer / 15 potentielle Unterstützer / 631 nicht interessiert">
										<li class="bargraph-quorum" style="left:30%;"></li>
										<li class="bargraph-support" style="width:5%"></li>
										<li class="bargraph-potential" style="width:10%"></li>
										<li class="bargraph-uninvolved" style="width:60%"></li>
									</ul>
								</td>
							</tr>
							<tr class="table-alternateinitiative odd">
								<td></td>
								<td></td>
								<td><h3><a href="#">Recht auf absolute Nacktheit im hier und jetzt</a></h3></td>
								<td>
									<ul class="bargraph" title="365 Unterstützer / 15 potentielle Unterstützer / 631 nicht interessiert">
										<li class="bargraph-quorum" style="left:30%;"></li>
										<li class="bargraph-support" style="width:5%"></li>
										<li class="bargraph-potential" style="width:10%"></li>
										<li class="bargraph-uninvolved" style="width:60%"></li>
									</ul>
								</td>
							</tr>
							<tr class="table-alternateinitiative odd">
								<td></td>
								<td></td>
								<td><h3><a href="#">Recht auf absolute Nacktheit im hier und jetzt</a></h3></td>
								<td>
									<ul class="bargraph" title="365 Unterstützer / 15 potentielle Unterstützer / 631 nicht interessiert">
										<li class="bargraph-quorum" style="left:30%;"></li>
										<li class="bargraph-support" style="width:5%"></li>
										<li class="bargraph-potential" style="width:10%"></li>
										<li class="bargraph-uninvolved" style="width:60%"></li>
									</ul>
								</td>
							</tr>
						</table>



				 	<div id="initiative-detail" class="box-editorial">
					 		<h3>Details</h3>
							<br />
						<dl>
							<dt>Grundgesamtheit</dt><dd>1578</dd>
							<dt>Zustand</dt><dd>eingefroren</dd>
							<br />
							<dt>Erzeugt am/um</dt><dd>3. September 2012 18:33:41</dd>
							<dt>Angenommen am/um</dt><dd>8. September 2012 18:33:41</dd>
							<dt>Halb eingefroren am/um</dt><dd>14. September 2012 18:33:41</dd>
							<dt>Ganz eingefroren am/um</dt><dd>18. September 2012 18:33:41</dd>
							<br />
							<dt>Zeit für die Zulassung</dt><dd>15 Tage</dd>
							<dt>Zeit für die Diskussion</dt><dd>30 Tage</dd>
							<dt>Zeit für die Überprüfung</dt><dd>15 Tage</dd>
							<dt>Zeit für die Abstimmung</dt><dd>15 Tage</dd>
							<br />
							<dt>Quorum für das Thema</dt><dd>10%</dd>
							<dt>Quorum für Initiativen im Thema</dt><dd>10%</dd>
							<dt>Zur Zeit benötigt für das Thema</dt><dd>156</dd>
							<dt>Zur Zeit benötigt für die Initative</dt><dd>156</dd>
							<br />
							<dt>Jetzt abstimmen</dt><dd>0</dd>
							<dt>Später abstimmen</dt><dd>12</dd>
							<dt>Geschlossen</dt><dd>Nein</dd>
						</dl>
					 	</div>

				<div class="box-footer">
					<a class="button" href="#">Alternative Initiative hinzufügen</a><a id="detailslide" class="button" href="#">Details</a>
			</div>

		</div>

		<div id="secondbox" class="box">
				<h2>Mitglieder, die später abstimmen möchten (6) (1%)</h2>
				 		<label class="table-label" for="select_fiter_later">sortiert nach:</label>
						<select id="select-filter_later" name="filter">
							<option value="1">A-Z</option>
							<option value="2">Z-A</option>
							<option value="3">Neueste</option>
							<option value="3">Älteste</option>
						</select>

				 		<div class="box-delegate-info box-supporters">
							<a href="#"><img src="content_img/profile_small.png" alt="Profilbild"/></a>
							<h3><a href="#">Johannes Knopp</a></h3>
						</div>
				 		<div class="box-delegate-info box-supporters">
							<a href="#"><img src="content_img/profile_small.png" alt="Profilbild"/></a>
							<h3><a href="#">Johannes Knopp</a></h3>
						</div>
						<div class="box-delegate-info box-supporters">
							<a href="#"><img src="content_img/profile_small.png" alt="Profilbild"/></a>
							<h3><a href="#">Johannes Knopp</a></h3>
						</div>
						 <div class="box-delegate-info box-supporters">
							<a href="#"><img src="content_img/profile_small.png" alt="Profilbild"/></a>
							<h3><a href="#">Johannes Knopp</a></h3>
						</div>
						 <div class="box-delegate-info box-supporters">
							<a href="#"><img src="content_img/profile_small.png" alt="Profilbild"/></a>
							<h3><a href="#">Johannes Knopp</a></h3>
						</div>
						 <div class="box-delegate-info box-supporters">
							<a href="#"><img src="content_img/profile_small.png" alt="Profilbild"/></a>
							<h3><a href="#">Johannes Knopp</a></h3>
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

	</div>
	<div class="row">
		<div class="twocol nobox">
		</div>
		<div class="sevencol box">
			<h2>Delegationen (200)</h2>
				<div class="box-delegate-info box-delegation">
					<a href="#"><img src="content_img/profile_delegate_1.png" alt="Profilbild"/>Christoph Fritzsche</a>
					<img class="delegate-arrow" src="img/arrow.png" alt="delegiert zu"/>
					<a href="#"><img src="content_img/profile_delegate_7.png" alt="Profilbild"/>Marina Weisband</a>
					<img class="delegate-arrow" src="img/arrow.png" alt="delegiert zu"/>
					<a href="#"><img src="content_img/profile_delegate_3.png" alt="Profilbild"/>Johannes Knopp</a>
				</div>
				<div class="box-delegate-info box-delegation">
					<a href="#"><img src="content_img/profile_delegate_2.png" alt="Profilbild"/>Christophe Chan Hin</a>
					<img class="delegate-arrow" src="img/arrow.png" alt="delegiert zu"/>
					<a href="#"><img src="content_img/profile_delegate_6.png" alt="Profilbild"/>Marcel-André Casasola Merkle</a>
				</div>
				<div class="box-delegate-info box-delegation">
					<a href="#"><img src="content_img/profile_delegate_5.png" alt="Profilbild"/>Christopher Lauer</a>
					<img class="delegate-arrow" src="img/arrow.png" alt="delegiert zu"/>
					<a href="#"><img src="content_img/profile_delegate_4.png" alt="Profilbild"/>Matthias Bach</a>
				</div>
				<div class="box-delegate-info box-delegation">
					<a href="#"><img src="content_img/profile_delegate_3.png" alt="Profilbild"/>Johannes Knopp</a>
					<img class="delegate-arrow" src="img/arrow.png" alt="delegiert zu"/>
					<a href="#"><img src="content_img/profile_delegate_2.png" alt="Profilbild"/>Christophe Chan Hin</a>
					<img class="delegate-arrow" src="img/arrow.png" alt="delegiert zu"/>
					<a href="#"><img src="content_img/profile_delegate_1.png" alt="Profilbild"/>Christoph Fritzsche</a>
				</div>
				<div class="box-delegate-info box-delegation">
					<a href="#"><img src="content_img/profile_delegate_3.png" alt="Profilbild"/>Johannes Knopp</a>
					<img class="delegate-arrow" src="img/arrow.png" alt="delegiert zu"/>
					<a href="#"><img src="content_img/profile_delegate_2.png" alt="Profilbild"/>Christophe Chan Hin</a>
					<img class="delegate-arrow" src="img/arrow.png" alt="delegiert zu"/>
					<a href="#"><img src="content_img/profile_delegate_4.png" alt="Profilbild"/>Matthias Bach</a>
				</div>																															<div class="box-delegate-info box-delegation">
					<a href="#"><img src="content_img/profile_delegate_1.png" alt="Profilbild"/>Christoph Fritzsche</a>
					<img class="delegate-arrow" src="img/arrow.png" alt="delegiert zu"/>
					<a href="#"><img src="content_img/profile_delegate_7.png" alt="Profilbild"/>Marina Weisband</a>
					<img class="delegate-arrow" src="img/arrow.png" alt="delegiert zu"/>
					<a href="#"><img src="content_img/profile_delegate_3.png" alt="Profilbild"/>Johannes Knopp</a>
				</div>
				<div class="box-delegate-info box-delegation">
					<a href="#"><img src="content_img/profile_delegate_2.png" alt="Profilbild"/>Christophe Chan Hin</a>
					<img class="delegate-arrow" src="img/arrow.png" alt="delegiert zu"/>
					<a href="#"><img src="content_img/profile_delegate_6.png" alt="Profilbild"/>Marcel-André Casasola Merkle</a>
				</div>
				<div class="box-delegate-info box-delegation">
					<a href="#"><img src="content_img/profile_delegate_5.png" alt="Profilbild"/>Christopher Lauer</a>
					<img class="delegate-arrow" src="img/arrow.png" alt="delegiert zu"/>
					<a href="#"><img src="content_img/profile_delegate_4.png" alt="Profilbild"/>Matthias Bach</a>
				</div>
				<div class="box-delegate-info box-delegation">
					<a href="#"><img src="content_img/profile_delegate_3.png" alt="Profilbild"/>Johannes Knopp</a>
					<img class="delegate-arrow" src="img/arrow.png" alt="delegiert zu"/>
					<a href="#"><img src="content_img/profile_delegate_2.png" alt="Profilbild"/>Christophe Chan Hin</a>
				</div>
				<div class="box-delegate-info box-delegation">
					<a href="#"><img src="content_img/profile_delegate_3.png" alt="Profilbild"/>Johannes Knopp</a>
					<img class="delegate-arrow" src="img/arrow.png" alt="delegiert zu"/>
					<a href="#"><img src="content_img/profile_delegate_4.png" alt="Profilbild"/>Matthias Bach</a>
				</div>
				<div class="box-delegate-info box-delegation">
					<a href="#"><img src="content_img/profile_delegate_5.png" alt="Profilbild"/>Christopher Lauer</a>
					<img class="delegate-arrow" src="img/arrow.png" alt="delegiert zu"/>
					<a href="#"><img src="content_img/profile_delegate_4.png" alt="Profilbild"/>Matthias Bach</a>
				</div>
				<div class="box-delegate-info box-delegation">
					<a href="#"><img src="content_img/profile_delegate_3.png" alt="Profilbild"/>Johannes Knopp</a>
					<img class="delegate-arrow" src="img/arrow.png" alt="delegiert zu"/>
					<a href="#"><img src="content_img/profile_delegate_2.png" alt="Profilbild"/>Christophe Chan Hin</a>
				</div>
				<div class="box-delegate-info box-delegation">
					<a href="#"><img src="content_img/profile_delegate_3.png" alt="Profilbild"/>Johannes Knopp</a>
					<img class="delegate-arrow" src="img/arrow.png" alt="delegiert zu"/>
					<a href="#"><img src="content_img/profile_delegate_4.png" alt="Profilbild"/>Matthias Bach</a>
				</div>																											<div class="box-delegate-info box-delegation">
					<a href="#"><img src="content_img/profile_delegate_3.png" alt="Profilbild"/>Johannes Knopp</a>
					<img class="delegate-arrow" src="img/arrow.png" alt="delegiert zu"/>
					<a href="#"><img src="content_img/profile_delegate_2.png" alt="Profilbild"/>Christophe Chan Hin</a>
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

		<div class="threecol box last">
			<h2>Interessierte Mitglieder (1200)</h2>
			<div class="box-description">
				<p>Potentielle Unterstützung ist an Bedingungen in Änderungsanträgen geknüpft. Ausgegraute Profile stimmen über Delegation zu.</p>

				<label class="table-label" for="select_fiter">sortiert nach:</label>
				<select id="select-filter" name="filter">
					<option value="1">A-Z</option>
					<option value="2">Z-A</option>
					<option value="3">Neueste</option>
					<option value="3">Älteste</option>
				</select>

			</div>

				<div class="box-delegate-info box-supporters">
					<a href="#"><img src="content_img/profile_small.png" alt="Profilbild"/></a>
					<h3><a href="#">Johannes Knopp</a></h3>
				</div>
				<div class="box-delegate-info box-supporters box-supporter-delegate">
					<a href="#"><img src="content_img/profile_small.png" alt="Profilbild" /></a>
					<h3><a href="#">Johannes Knopp Doppelgänger</a></h3>
				</div>
				<div class="box-delegate-info box-supporters box-supporter-delegate">
					<a href="#"><img src="content_img/profile_small.png" alt="Profilbild" /></a>
					<h3><a href="#">Hans Dampf</a></h3>
				</div>
				<div class="box-delegate-info box-supporters">
					<a href="#"><img src="content_img/profile_small.png" alt="Profilbild" /></a>
					<h3><a href="#">Doktor Knopp</a></h3>
				</div>
				<div class="box-delegate-info box-supporters box-supporter-delegate">
					<a href="#"><img src="content_img/profile_small.png" alt="Profilbild" /></a>
					<h3><a href="#">Jo Knopp</a></h3>
				</div>
				<div class="box-delegate-info box-supporters box-supporter-delegate">
					<a href="#"><img src="content_img/profile_small.png" alt="Profilbild" /></a>
					<h3><a href="#">Johannes Knopp KI</a></h3>
				</div>
				<div class="box-delegate-info box-supporters box-supporter-delegate">
					<a href="#"><img src="content_img/profile_small.png" alt="Profilbild" /></a>
					<h3><a href="#">Johannes Knopp</a></h3>
				</div>
				<div class="box-delegate-info box-supporters">
					<a href="#"><img src="content_img/profile_small.png" alt="Profilbild" /></a>
					<h3><a href="#">Johannes Knopp Doppelgänger</a></h3>
				</div>
				<div class="box-delegate-info box-supporters">
					<a href="#"><img src="content_img/profile_small.png" alt="Profilbild" /></a>
					<h3><a href="#">Johannes Knopp</a></h3>
				</div>
				<div class="box-delegate-info box-supporters box-supporter-delegate">
					<a href="#"><img src="content_img/profile_small.png" alt="Profilbild" /></a>
					<h3><a href="#">Johannes Knopp Doppelgänger</a></h3>
				</div>
				<div class="box-delegate-info box-supporters box-supporter-delegate">
					<a href="#"><img src="content_img/profile_small.png" alt="Profilbild" /></a>
					<h3><a href="#">Johannes Knopp</a></h3>
				</div>
				<div class="box-delegate-info box-supporters box-supporter-delegate">
					<a href="#"><img src="content_img/profile_small.png" alt="Profilbild" /></a>
					<h3><a href="#">Johannes Knopp 2</a></h3>
				</div>
				<div class="box-delegate-info box-supporters">
					<a href="#"><img src="content_img/profile_small.png" alt="Profilbild" /></a>
					<h3><a href="#">Hans Dampf</a></h3>
				</div>
				<div class="box-delegate-info box-supporters">
					<a href="#"><img src="content_img/profile_small.png" alt="Profilbild" /></a>
					<h3><a href="#">Doktor Knopp</a></h3>
				</div>
				<div class="box-delegate-info box-supporters">
					<a href="#"><img src="content_img/profile_small.png" alt="Profilbild" /></a>
					<h3><a href="#">Jo Knopp</a></h3>
				</div>
				<div class="box-delegate-info box-supporters box-supporter-delegate">
					<a href="#"><img src="content_img/profile_small.png" alt="Profilbild" /></a>
					<h3><a href="#">Johannes Knopp KI</a></h3>
				</div>
				<div class="box-delegate-info box-supporters">
					<a href="#"><img src="content_img/profile_small.png" alt="Profilbild" /></a>
					<h3><a href="#">Johannes Knopp</a></h3>
				</div>
				<div class="box-delegate-info box-supporters">
					<a href="#"><img src="content_img/profile_small.png" alt="Profilbild" /></a>
					<h3><a href="#">Johannes Knopp Doppelgänger</a></h3>
				</div>
				<div class="box-delegate-info box-supporters box-supporter-delegate">
					<a href="#"><img src="content_img/profile_small.png" alt="Profilbild" /></a>
					<h3><a href="#">Johannes Knopp</a></h3>
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
					<h3><a href="#">Johannes Knopp 2</a></h3>
				</div>
				<div class="box-delegate-info box-supporters">
					<a href="#"><img src="content_img/profile_small.png" alt="Profilbild" /></a>
					<h3><a href="#">Hans Dampf</a></h3>
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
