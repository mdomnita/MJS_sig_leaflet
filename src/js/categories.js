var categories = {
	"Infrastructure Sport" :{
		"Sport": {
			GS: "Grand Stade",
			CS: "Complexe Sportif",
			CiS: "Cité des Sports",
			VS: "Village Sportif",
			TGJG: "Terrain Grand Jeu - Gazonné",
			TGJNG: "Terrain Grand Jeu - Non Gazonné", 
			CSPI: "Centre Socio Sportif de Proximité Intégré",
			TO: "Terrain Omnisport",
			TPJG: "Terrain Petit Jeu - Gazonné",
			TPJNG: "Terrain Petit Jeu - Non Gazonné",
			TVB: "Terrain de Volley Ball",
			TBB: "Terrain de Basket Ball",
			THB: "Terrain de Hand Ball",
			TP: "Terrain de Proximité",
			BP: "Bassin de Plongeon",
			POO: "Piscine Ouverte Olympique",
			POSO: "Piscine Ouverte Semi Olympique",
			PCO: "Piscine Couverte Olympique",
			PCSO: "Piscine Couverte Semi Olympique",
			SC: "Salle Couverte",
			PA: "Piste d’Athlétisme",
			PBMX: "Piste BMX",
			SP: "Skates Park",
			CT: "Court de Tennis",
			Glf: "Golf",
			ChT: "Champs de Tir",
			CTA: "Centre de Tir à l'Arc",
			BN: "Base Nautique",
			CE: "Circuit d’Equitation",
			SSk: "Station de Ski",
			Vel: "Vélodrome",
			CR: "Centre de Refuge",
		}
	},
	"Infrastructure Jeunesse":{
		"Jeunesse": {
			MJ: 'Maison de Jeunes',
			CSJ: 'Centre au service de le Jeunesse',
			CSE: 'Centre Socio Educatif',
			CA: "Centre d'Accueil",
		},
		"Enfance": {
			CV: "Colonie de Vacances",
			FAS: "Foyer d'Action Sociale",
			CPE: "Centre de Protection de l'Enfance",
		},
		"Affaires Féminines": {
			FF: "Foyer Féminin",
			CFP: "Centre de Formation Proféssionelle",
			GE: "Garderie d'Enfants",
		},
	}
}


// 			<h3>Infrastucture Jeunesse</h3>
// 			<div class="scroll-check">
// 				<div class="type-check-sec">
// 					<label class="main"><input type="checkbox"/><p>Parent check</p></label>
// 					<label><input type="checkbox"/><p>Child check</p></label>
// 					<label><input type="checkbox"/><p>Child check</p></label>
// 					<label><input type="checkbox"/><p>Child check</p></label>
// 				</div>
// 			</div>

// <div class="checkerArea">
var divPart = document.getElementById('checkerArea');
divPart.innerHTML = '';
for (el in categories) {
	//create categories html. First level are headers
	console.log(el);
	var div1 = document.createElement('div');
	div1.className = "scroll-check";
	var h3 = document.createElement('h3');
	h3.innerHTML = el;
	divPart.appendChild(h3)
	// divPart.appendChild(div1);

	if (typeof categories[el] === 'object') {
		//second velvel are type-check-sec
		var lv1 = categories[el];
		console.log (Object.keys(lv1));
		//second are types
		for (var l1 in lv1) {
			var lv2 = lv1[l1];
			var div2 = document.createElement('div');
			div2.className = "type-check-sec";

			//create first level checkbox
			console.log(lv2);
			var label = document.createElement('label');
			label.className='main';
			var input = document.createElement('input');
			input.setAttribute("type", "checkbox");
			var p = document.createElement('p');
			p.appendChild(document.createTextNode(l1));
			label.appendChild(input);
			label.appendChild(p);
			div2.appendChild(label);

			if (typeof lv2 === 'object') {
				//third level are simple label checkboxes
				for (var l2 in lv2) {
					var lv3 = lv2[l2];
					console.log(lv3);
					var label = document.createElement('label');
					// label.className='main';
					var input = document.createElement('input');
					input.setAttribute("type", "checkbox");
					var p = document.createElement('p');
					p.appendChild(document.createTextNode(lv3));
					label.appendChild(input);
					label.appendChild(p);
					div2.appendChild(label);
				}
			}
			div1.appendChild(div2)
		}
		// div1.appendChild(h3)
		divPart.appendChild(div1);
	}
}
