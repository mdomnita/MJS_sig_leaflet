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
			PO: "Piscine Olympique",
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

// <div class="checkerArea">
var divPart = document.getElementById('checkerArea');
divPart.innerHTML = '';
for (el in categories) {
	//<h3>Infrastucture Jeunesse</h3>
	//create categories html. First level are headers
	var div1 = document.createElement('div');
	div1.className = "scroll-check";
	var h3 = document.createElement('h3');
	h3.innerHTML = el;
	divPart.appendChild(h3)
	// divPart.appendChild(div1);

	if (typeof categories[el] === 'object') {
		//second velvel are type-check-sec
		var lv1 = categories[el];
		//second are types
		//Sport, Enfance,...
		for (var l1 in lv1) {
			var lv2 = lv1[l1];
			var div2 = document.createElement('div');
			div2.className = "type-check-sec";

			//create first level checkbox
			var label = document.createElement('label');
			label.className='main';
			var input = document.createElement('input');
			input.id = l1;
			$(input).on('click',function(){checkChildren(this)});
			input.setAttribute("type", "checkbox");
			input.setAttribute("checked", true);
			var p = document.createElement('p');
			p.appendChild(document.createTextNode(l1));
			label.appendChild(input);
			label.appendChild(p);
			div2.appendChild(label);

			if (typeof lv2 === 'object') {
				//third level are simple label checkboxes
				for (var l2 in lv2) {
					var lv3 = lv2[l2];
					var label = document.createElement('label');
					// label.className='main';
					var input = document.createElement('input');
					input.setAttribute("type", "checkbox");
					input.setAttribute("checked", true);
					$(input).on('click',function(){checkParent(this)});
					input.setAttribute("data-parent", l1);
					input.setAttribute("data-TYPE", l2);
					input.className ="markerCat";
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

function checkChildren(input) {
	var checked = input.checked;
	var cat = input.id;
	$('[data-parent="'+cat+'"]').prop('checked', checked); 
	//show/hide layers according to checkboxes
	checkClusterLayers();
}

function checkParent(input) {
	var id = input.dataset.parent;
	$('#'+id).prop('checked',false);
	//show/hide layers according to checkboxes
	checkClusterLayers();
}