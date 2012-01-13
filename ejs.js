#!/usr/bin/node

var context = {
	texts:{
		title:'Bombay Crushed &middot; Redesign der LQFB Instanz der Piratenpartei Deutschland', 
		back:'Zurück zur Startseite',
		logout:'ausloggen',		
		terms:'AGBs',
		privacy:'Datenschutz',
		imprint:'Impressum',
		contact:'Kontakt',
		overview:'Übersicht',
		topics:'Themen',
		contacts:'Kontakte&amp;Delegationen',
		profile:'Profil',
		timeline:'Zeitleiste',
		search:'Suche',
		meta:'Meta',
		conditions:'Nutzungsbedingungen',
		privacypol:'Datenschutzerklärung',
		pseudonyminfo:'Hinweise zum Umgang mit Pseudonymen',
		party:'Piratenpartei',
		partypage:'Internetauftritt der Piratenpartei',
		wiki:'Piratenwiki',
		pad:'Piratenpad',
		lists:'Mailinglisten',
		board:'Vorstände',
		copyright:'Urheberrechte',
		copyrighttextbeforeterms:'Die Texte von Initiativen und Anregungen stehen unter einer Creative Commons BY-SA Lizenz und dürfen unter',
		copyrighttextterms:'bestimmten Bedingungen',
		copyrighttextafterterms:'geteilt und verändert werden.',
		editprofile:'Profil bearbeiten',
		profilepic:'Profilbild',
		createtopic:'Neues Thema anlegen',
		myinis:'Meine Initiativen',
		supportedinis:'Unterstützte Initiativen',
		currentinis:'Aktuelle Initiativen',
		filter:'Filter',
		ini:'Inititative',
		unit:'Unit',
		support:'Unterstützung',
		status:'Status',
		delegationend:'Ende der Delegationskette',
		forward:'weiter',
		backshort:'zurück',
		supporter:'Unterstützer',
		potsupporter:'potentielle Unterstützer',
		uninvolved:'bisher unbeteiligt',
		uninterested:'nicht interessiert',
		yourdelegates:'Deine Delegierten',
		lastactionyourvote:'Zuletzt ist mit deiner Stimme passiert',
		for:'für',
		against:'gegen',
		supports:'unterstützt',	
		more:'weitere',
		news:'Neuigkeiten',
		newstext:'Hier siehst du oben die zuletzt gelaufene Abstimmung und unten das zeitkritischste fast erreichte Quorum.',
		chartfor:'direkt dafür',
		chartdelegatedfor:'delegiert dafür',
		chartagainst:'direkt dagegen',
		chartdelegatedagainst:'delegiert dagegen',
		next:'nächste',
		previous:'vorherige',
		yourtopics:'Deine Themen',
		yourtopicstext:'Du bist Mitglied in folgenden Themenbereichen. Deine Auswahl wirkt sich direkt auf die Ansicht „Aktuelle Initiativen“ aus.',
		tablevote:'4.Abstimmung',
	},
	user:{
		nick:'Fußfall', name:'Stefan Täge',
		picbig:'content_img/profile_image.png', 
	},
	filter:[
		{id: 1, text: 'Neue oder kürzlich geänderte Inititativen'},
		{id: 2, text: 'Nur neue Initiativen'},
		{id: 3, text: 'Nur Abstimmungen'},
		{id: 4, text: 'Feedback zu eigenen Initiativen'},
	],
	inis:[
		{id: 1, title: 'Für liberalisierte Ladenöffnungszeiten',
		area: 'Wirtschaft, Soziales', unit: 'Bund',
		supporter: 365, potsupporter: 15,
		uninterested: 631, status: '1.Neu',
		quorum: 5, support: 30,
		potential: 10, uninvolved: 60},
		{id: 2, title: 'Karenzzeiten für Politiker und Beamte',
		area: 'Inneres, Demokratie, Recht, Sicherheit', unit: 'Baden-Württemberg',
		supporter: 365, potsupporter: 15,
		uninterested: 631, status: '1.Neu',
		quorum: 5, support: 40,
		potential: 10, uninvolved: 50,
		delegate: {nick: 'joknopp', name: 'Johannes Knopp',
				picsmall:'content_img/profile_small.png'} },
		{id: 3, title: 'Freier Zugang zu öffentlichen Inhalten',
		area:'Digitales, Urheber-/ Patentrecht, Datenschutz', unit:'Bund',
		supporter: 365, potsupporter: 15,
		uninterested: 631, status: '4.Abstimmung',
		quorum: 5, support: 30,
		potential: 10, uninvolved: 60},
		{id: 4, title: 'Abschaffung der Zeitumstellung',
		area:'Wirtschaft, Soziales', unit: 'Bund',
		supporter: 365, potsupporter: 15,
		uninterested: 631, status: '2.Diskussion',
		quorum: 5, support: 30,
		potential: 10, uninvolved: 60,
		hasalternatives: true},
		{id: 5, title: 'Abschaffung der Zeitumstellung, Beibehaltung Sommerzeit',
		area: 'Wirtschaft, Soziales', unit: 'Bund',
		supporter: 365, potsupporter: 15,
		uninterested: 631, status: '2.Diskussion',
		quorum: 3, support: 10,
		potential: 30, uninvolved: 60,
		alternativeid: 4},
		{id: 6, title: 'Freier Zugang zu öffentlichen Inhalten',
		area: 'Digitales, Urheber-/ Patentrecht, Datenschutz', unit:'Bund',
		supporter: 365, potsupporter: 15,
		uninterested: 631, status: '4.Abstimmung',
		quorum: 5, support: 30,
		potential: 10, uninvolved: 60},
	],
	initable:{
		pages: 7, activepage: 1,
	},
	delegations:[
		{ action: 'for', title:'Erneuerbare Energien-Gesetz II - Initiative des Bundes zur Förderung der reg. Energien',
		user:{	nick: 'joknopp', name: 'Johannes Knopp',
			picsmall:'content_img/profile_delegate_3.png'},},
		{ action: 'against', title:'Gegen Quoten und positive Maßnahmen',
		user:{	nick: 'incredibul', name: 'Christophe Chan Hin',
			picsmall:'content_img/profile_delegate_2.png'},},
		{ action: 'for', title:'Öffentliche Angabe der Penislänge in sozialen Netzwerken',
		user:{	nick: 'cfritzsche', name: 'Christoph Fritzsche',
			picsmall:'content_img/profile_delegate_1.png'},},
		{ action: 'support', title:'Abschaffung der Zeitumstellung',
		user:{	nick: 'marix', name: 'Matthias Bach',
			picsmall:'content_img/profile_delegate_4.png'},},
	],
	news:{
		chart:{ title: 'Karenzzeiten für Politiker und Beamte', for: 430,
			fordelegated: 230, against: 200, againstdelegated: 100 },
		graph:{ title: 'Erneuerbare Energien-Gesetz II - Initiative des Bundes zur Förderung der regenerativen Energien',
			supporter: 232, potsupporter: 180,
			uninterested: 400, quorum: 5, support: 40,
			potential: 10, uninvolved: 50, },
	},
	units:[
		{ name:'Bund', areas:[ 
			{ name: 'Innen, Recht, Demokratie, Sicherheit' }, { name: 'Digitales, Urheber-/Patentrecht, Datenschutz', checked: true }, 
			{ name: 'Wirtschaft, Soziales' }, { name: 'Umwelt, Verkehr, Energie' }, 
			{ name: 'Kinder, Jugend, Familie und Bildung', checked: true }, { name: 'Außen, Internationales, Frieden' }, 
			{ name: 'Gesundheit und Drogen/Suchtpolitik', checked: true }, { name: 'Satzung und Parteistruktur', checked: true }
		]},
		{ name:'Baden-Württemberg', areas:[ 
			{ name: 'Innen, Recht, Demokratie, Sicherheit' }, { name: 'Digitales, Urheber-/Patentrecht, Datenschutz', checked: true }, 
			{ name: 'Wirtschaft, Soziales' }, { name: 'Umwelt, Verkehr, Energie' }, 
			{ name: 'Kinder, Jugend, Familie und Bildung', checked: true }, { name: 'Gesundheit und Drogen/Suchtpolitik', checked: true }, 
			{ name: 'Satzung und Parteistruktur', checked: true }
		]},
		{ name:'Mannheim', areas:[ 
			{ name: 'Verkehr und Stadtentwicklung' }, { name: 'Kultur und Bildung', checked: true }, 
			{ name: 'Demokratie' }, { name: 'Sicherheit' }, 
			{ name: 'Energie und Umwelt', checked: true }, { name: 'Ernährung' }, 
			{ name: 'Finanzen und Steuern', checked: true }, { name: 'Arbeit und Soziales', checked: true }
		]},
		{ name:'Meta', areas:[ 
			{ name: 'LiquidFeedback Systembetrieb' }, { name: 'Sonstige innerparteiliche Angelegenheiten' }, 
			{ name: 'Streitfragen zu Abstimmungen' }, { name: 'Sandkasten/Spielwiese' }, 
			{ name: 'Liquid Feedback Weiterentwicklung', checked: true }, { name: 'Veröffentlichungen' }
		]},
	],
};

var ejs = require('ejs')
  , fs = require('fs')
  , headtpl
  , maintpl
  , footertpl;

var render = function() {
	if(headtpl && maintpl && footertpl) {
		var head = ejs.render(headtpl, context);
		var main = ejs.render(maintpl, context);
		var footer = ejs.render(footertpl, context);

		console.log(head);
		console.log(main);
		console.log(footer);
	}
}

fs.readFile(__dirname + '/head.tpl', 'utf8', function(err, data) {
	if(err) {
		throw err;
	}

	headtpl = data;

	render();
} );
fs.readFile(__dirname + '/main.tpl', 'utf8', function(err, data) {
	if(err) {
		throw err;
	}

	maintpl = data;

	render();
} );
fs.readFile(__dirname + '/footer.tpl', 'utf8', function(err, data) {
	if(err) {
		throw err;
	}

	footertpl = data;

	render();
} );