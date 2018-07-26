var states = {
	"Khemisset"	:{'population':281000,'etablissement':18 },
	"Ait Mimoune"	:{'population':8254,'etablissement':2 },
	"Ait Yadine"	:{'population':20500,'etablissement':2 },
	"Tiflet"	:{'population':86000,'etablissement':6 },
	"Khemis Sidi Yahya"	:{'population':6700,'etablissement':1 },
	"M'Qam Tolba"	:{'population':13500,'etablissement':2 },
	"Sidi Allal El Bahraoui"	:{'population':281000,'etablissement':18 },
	"Oulmes"	:{'population':18700,'etablissement':7 },
	"Rommani"	:{'population':12300,'etablissement':5 },
	"Ain Essbite"	:{'population':11000,'etablissement':1 },
	"Brachoua"	:{'population':12000,'etablissement':2 },
	"El Ganzra"	:{'population':13200,'etablissement':2 },
	"Maaziz"	:{'population':11500,'etablissement':1 },
	"Tiddas"	:{'population':10000,'etablissement':1 },
	"Ait Ichou"	:{'population':10000,'etablissement':1 },
	"Sidi Allal Lamsadder"	:{'population':7400,'etablissement':2 },
	"Houdderane"	:{'population':6400,'etablissement':1 },
	"Marchouch":{'population':10000,'etablissement':2 },
}

var min = 10000 ;
var cZoom = 0;


//vars for layers will be shown on layer control
var markers = L.layerGroup();
var Khemissetmrk = L.layerGroup();
var regions = L.layerGroup();
var provinces = L.layerGroup();
var communes = L.layerGroup();

var map = L.map('map', {
	center: [33.80, -6.21],                  //[29.38217507514529, -8.7451171875],
	zoom: 9,
  layers: [regions]
});

	var basemap1 = L.tileLayer('https://api.mapbox.com/styles/v1/sidgis/cjj8lafxc3f032snzbhbhxe7y/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2lkZ2lzIiwiYSI6ImM3RE1lZE0ifQ.LuNNRrO9LcVKs2dN_HvVBg', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

	
	var info = L.control();

info.onAdd = function (map) {
	this._div = L.DomUtil.create('div');
	this.update();
	return this._div;
};

info.update = function (props) {
	this._div.innerHTML =
	 `<div class="informationBox">
		 <h3>Informations</h3>
		 <p>Khiemiset</p>
		 <div class="populationBox">
			 <h3>Population<h3>
			 <div class="Population-taginfo">
				 <span><i class="fa fa-users"></i><p>4.000.000</p></span>
				 <span><i class="fa fa-users"></i><p>4.000.000</p></span>
				 <span><i class="fa fa-users"></i><p>4.000.000</p></span>
				 <span><i class="fa fa-users"></i><p>4.000.000</p></span>
			 </div>
			 <div class="cateories-box">
				 <h3>Categories</h3>
				 <div class="categories-scroll">
					<div class="cat-row">
						<p>Parent test <b>(5)</b></p>
						<li>Child test</li>
						<li>Child test</li>
						<li>Child test</li>
					</div>
					<div class="cat-row">
						<p>Parent test <b>(5)</b></p>
						<li>Child test</li>
						<li>Child test</li>
						<li>Child test</li>
					</div>
					<div class="cat-row">
						<p>Parent test <b>(5)</b></p>
						<li>Child test</li>
						<li>Child test</li>
						<li>Child test</li>
					</div>
					<div class="cat-row">
						<p>Parent test <b>(5)</b></p>
						<li>Child test</li>
						<li>Child test</li>
						<li>Child test</li>
					</div>
				 </div>
			 </div>
		 </div>
	 </div>`;
	 //-- Hey metai .. you can use ${variable name} in this html.

	// this._div.innerHTML = '<h4>Morocco</h4>' +
	//   (props ?'<b>' + props.name + '</b>' + '<h5>' + 'Population: ' + ((props.Population)? props.Population : 'N/A')  + '</h5>' 
	// 	: 'Hover over a commune');
};
info.addTo(map);

// vars which will carry data of GeoJson files
var geojsonfile1 = null;
var geojsonfile2 = null;
var geojsonfile3 = null;
var geojsonmarkers = null;
var geojsonmrk = null;
	
// Get GeoJSON and put on it on the map when it loads

var markericon = L.icon({
	iconUrl: 'icons/Map-marker-02.png',
	iconSize: [36,36],
	iconAnchor: [18,18]
});
//functions for hover and onClick on layers
        var geohover;

function resetHighlight(r) {
	geojsonfile1.resetStyle(r.target);
    info.update();
}

//remember previous zoom to check if user zoomed in or out
map.on('zoomstart', function(z) {
  cZoom = z.target.getZoom();
});
//if user zooms out hide lower level layers
map.on('zoomend', function(z) {
  var aZoom = z.target.getZoom();
  //hide communes on zoom 13
  if (aZoom < cZoom && z.target.getZoom() < 11) {
    map.removeLayer(communes);
    map.addLayer(provinces);
  }
  //hide provinces on zoom 11
  if (aZoom < cZoom && z.target.getZoom() < 8) {
    map.removeLayer(provinces);
    map.addLayer(regions);
  }
});

	function highlightFeature(r) {
	var layer1 = r.target;

	layer1.setStyle({
		weight: 2,
		stroke: true,
		color: 'black',
		fill: true,
		fillColor: 'black',
		dashArray: '',
		fillOpacity: 0.2
	});
      info.update(layer1.feature.properties);
}

function onEachFeature(feature, layer1) {
	layer1.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight
		//layer.bindTooltip(feature.properties.name_1)
		//click: zoomToFeature
	});
}

  function styleregions(feature) {
  return {
      //fillColor: getColor(feature.properties.osm_id),
      fillColor: '#ffffff',
      weight: 3,
      opacity: 1,
      color: 'black',
      //dashArray: '3',
      fillOpacity: 0
  };
}

$.getJSON("data/region_Maroc_bis.geojson",function(data1){
    geojsonfile1 = L.geoJson(data1,{
              style: styleregions, 	
              onEachFeature: function (feature, layer) {
                layer.on({
                  click: toggleProvinces
                });
              }
	}).addTo(regions);
});

    function resetHighlight1(p) {
	geojsonfile2.resetStyle(p.target);
    info.update();
}

// function zoomToFeature(e) {
// 	map.fitBounds(e.target.getBounds());
// }

	function highlightFeature1(p) {
	var layer2 = p.target;

	layer2.setStyle({
		weight: 2,
		stroke: true,
		color: 'red',
		fill: true,
		fillColor: 'red',
		dashArray: '',
		fillOpacity: 0.2
	});
      info.update(layer2.feature.properties);
}

//todo: click on region shows province within
function toggleProvinces(p) {
  p.originalEvent.stopPropagation();
  var prov = p.target;
  var provCode = prov.feature.properties.NAME;
  console.log(provCode);
  var commLayers = provinces.getLayers()[0].getLayers();
  //go through all provinces, hide all from other provinces
  map.addLayer(provinces);
  for (var cm in commLayers) {
    if (commLayers[cm].feature.properties.NAME !== provCode) {
      map.removeLayer(commLayers[cm]);
    }
    else {
      map.addLayer(commLayers[cm]);
      //add province name to province
      commLayers[cm].bindTooltip(commLayers[cm].feature.properties.PROVINCE,{direction:'center',permanent:true}).openTooltip();
    }
  }
  map.removeLayer(regions);
}

//click on province shows communes within
function toggleCommunes(p) {
  p.originalEvent.stopPropagation();
  var prov = p.target;
  var provCode = prov.feature.properties.CODEPROVIN;
  console.log(provCode);
  var commLayers = communes.getLayers()[0].getLayers();
  //go through all communes, hide all from other provinces
  map.addLayer(communes);
  for (var cm in commLayers) {
    if (commLayers[cm].feature.properties.CODEPROVIN !== provCode) {
      map.removeLayer(commLayers[cm]);
    }
    else {
      map.addLayer(commLayers[cm]);
    }
  }
}

//click on commune zooms to it
function toggleMarkers(p) {
  p.originalEvent.stopPropagation();
  var prov = p.target;
  map.removeLayer(provinces);

  var myBounds = prov.getBounds().pad(0.02);
  setTimeout(function() { map.fitBounds(myBounds) }, 0);
  // var provCode = prov.feature.properties.osm_id;
  // console.log(provCode);
  // var commLayers = allMarkers.getLayers();
  // //go through all communes, hide all from other provinces
  // clusters.clearLayers();
  // map.addLayer(clusters);
  // // var markerz = commLayers[0].getLayers();
  // for (var cm in commLayers) {
  //   if (commLayers[cm].feature.properties.osm_id !== provCode) {
  //     clusters.removeLayer(commLayers[cm]);
  //   }
  //   else {
  //     clusters.addLayer(commLayers[cm]);
  //   }
  // }
  // document.querySelectorAll('[type = "checkbox"]')[0].disabled = false;
}

//hover province colors
function styleprovinces(feature) {
  return {
      //fillColor: getColor(feature.properties.osm_id),
      fillColor: '#ffffff',
      weight: 2,
      opacity: 1,
      color: 'red',
      //dashArray: '3',
      fillOpacity: 0
  };
}

$.getJSON("data/proc/provinceReg.geojson",function(data2){
		geojsonfile2 = L.geoJson(data2,{
			       style: styleprovinces,
		            onEachFeature: function (feature, layer2) {
		            layer2.on({
  					      mouseover: highlightFeature1,
  					      mouseout: resetHighlight1,
                  click: toggleCommunes
	              });
		           }
	}).addTo(provinces);
});

function getColor(d) {
  return d > 1000 ? '#800026' :
         d > 500  ? '#BD0026' :
         d > 200  ? '#E31A1C' :
         d > 100  ? '#FC4E2A' :
         d > 50   ? '#FD8D3C' :
         d > 20   ? '#FEB24C' :
         d > 10   ? '#FED976' :
                    '#FFEDA0';
}

    function resetHighlight2(c) {
	geojsonfile3.resetStyle(c.target);
    info.update();
}

// function zoomToFeature(e) {
// 	map.fitBounds(e.target.getBounds());
// }

	function highlightFeature2(c) {
	var layer3 = c.target;

	layer3.setStyle({
		weight: 1,
		stroke: true,
		color: 'blue',
		fill: true,
		fillColor: 'blue',
		dashArray: '',
		fillOpacity: 0.2
	});
      info.update(layer3.feature.properties);
}

function styleprovinces(feature) {
  return {
      //fillColor: getColor(feature.properties.osm_id),
      fillColor: '#ffffff',
      weight: 2,
      opacity: 1,
      color: 'red',
      //dashArray: '3',
      fillOpacity: 0
  };
}

function style(feature) {
  return {
      //fillColor: getColor(feature.properties.osm_id),
      fillColor: '#ffffff',
      weight: 1,
      opacity: 1,
      color: '#3388ff',
      //dashArray: '3',
      fillOpacity: 0
  };
}

// L.geoJson(statesData, {style: style}).addTo(map)


$.getJSON("data/proc/communesReg.geojson",function(data3){
	geojsonfile3 = L.geoJson(data3,{
		       style: style,
	            onEachFeature: function (feature, layer3) {
	             layer3.on({
    				      mouseover: highlightFeature2,
    				      mouseout: resetHighlight2,
                  click: toggleMarkers
                });
	           }
}).addTo(communes);
});

var Icon = L.Icon.extend({
options:{
    iconSize: [18,18],
    iconAnchor: [5,5],
    popupAnchor: [0,-6]
}
});

// Create specific icons
var ca = new Icon({iconUrl: 'MJS_icones/Jeunesse/PNG_1X/CA1.png'});
var ce = new Icon({iconUrl: 'MJS_icones/Sport/PNG_1X/CE1.png'});
var cfp = new Icon({iconUrl: 'MJS_icones/Affaires_Feminines/PNG_1X/CFP1.png'});
var csj = new Icon({iconUrl: 'MJS_icones/Jeunesse/PNG_1X/CSJ1.png'});
var cspi = new Icon({iconUrl: 'MJS_icones/Sport/PNG_1X/CSPI1.png'});
var ct = new Icon({iconUrl: 'MJS_icones/Sport/PNG_1X/CT1.png'});
var ff = new Icon({iconUrl: 'MJS_icones/Affaires_Feminines/PNG_1X/FF1.png'});
var ge = new Icon({iconUrl: 'MJS_icones/Affaires_Feminines/PNG_1X/GE1.png'});
var mj = new Icon({iconUrl: 'MJS_icones/Jeunesse/PNG_1X/MJ1.png'});
var pa = new Icon({iconUrl: 'MJS_icones/Sport/PNG_1X/PA1.png'});
var po = new Icon({iconUrl: 'MJS_icones/Sport/PNG_1X/POO1.png'});
var poo = new Icon({iconUrl: 'MJS_icones/Sport/PNG_1X/POO1.png'});
var sc = new Icon({iconUrl: 'MJS_icones/Sport/PNG_1X/SC1.png'});
var tgjg = new Icon({iconUrl: 'MJS_icones/Sport/PNG_1X/TGJG1.png'});
var tgjng = new Icon({iconUrl: 'MJS_icones/Sport/PNG_1X/TGJNG1.png'});
var to = new Icon({iconUrl: 'MJS_icones/Sport/PNG_1X/TO1.png'});
var tpgj = new Icon({iconUrl: 'MJS_icones/Sport/PNG_1X/TPJG1.png'});
var tpjng = new Icon({iconUrl: 'MJS_icones/Sport/PNG_1X/TPJNG1.png'});

//visible markers are for the clicked commune, all markers are all markers on map (if needed)
	var clusters = L.markerClusterGroup();

	$.getJSON("data/proc/markersReg.geojson",function(data5){
			geojsonmrk = L.geoJson(data5,{
				onEachFeature: function (feature, layer) {
					layer.bindPopup('<div class="custom-popup">'+

					'<div class="tabs">'+
						'<li class="active singleTab" data-tab="tab-1">'+'Information'+'</li>'+
						'<li data-tab="tab-2" class="singleTab">'+'Offer'+'</li>'+
					'</div>'+


					'<div id="tab-1" class="tab-content active">'+
						'<div class="img">'+
							'<img src="http://via.placeholder.com/275x155" alt="" />'+
							'<div class="tags">'+
								'<i class="fas fa-home"></i>'+
								'<i class="fas fa-key"></i>'+
							'</div>'+
						'</div>'+
						'<h3>'+feature.properties.NAME+'</h3>'+
						'<div class="location"><i class="fas fa-map-marker-alt"></i> Avenue Pastor, Rabat</div>'+
						'<a href="#" class="btn btn-danger">Infrastructure Jeunesse</a>'+
					'</div>'+
				'<div id="tab-2" class="tab-content">'+
					'<li>'+'Test List'+'</li>'+
					'<li>'+'Test List'+'</li>'+
					'<li>'+'Test List'+'</li>'+
				'</div>'+


				'</div>');
					}, pointToLayer: function (feature, latlng) {
						if (feature.properties.Abréviatio == "CA"){
							var marker = L.marker(latlng,{icon: ca});
						} else if (feature.properties.Abréviatio == "CE"){
							var marker = L.marker(latlng,{icon: ce});
						} else if (feature.properties.Abréviatio == "CFP"){
							var marker = L.marker(latlng, {icon: cfp});
						} else if (feature.properties.Abréviatio == "CSJ"){
							var marker = L.marker(latlng,{icon: csj});
						} else if (feature.properties.Abréviatio == "CSPI"){
							var marker = L.marker(latlng, {icon: cspi});
						} else if (feature.properties.Abréviatio == "CT"){
							var marker = L.marker(latlng,{icon: ct});
						} else if (feature.properties.Abréviatio == "FF"){
							var marker = L.marker(latlng,{icon: ff});
						} else if (feature.properties.Abréviatio == "GE"){
                            var marker = L.marker(latlng,{icon: ge});
						} else if (feature.properties.Abréviatio == "MJ"){
							var marker = L.marker(latlng,{icon: mj});
						} else if (feature.properties.Abréviatio == "PA"){
							var marker = L.marker(latlng,{icon: pa});
						} else if (feature.properties.Abréviatio == "PO"){
							var marker = L.marker(latlng,{icon: poo});
						} else if (feature.properties.Abréviatio == "POO"){
							var marker = L.marker(latlng,{icon: poo});
						} else if (feature.properties.Abréviatio == "SC"){
							var marker = L.marker(latlng,{icon: sc});
						} else if (feature.properties.Abréviatio == "TGJG"){
							var marker = L.marker(latlng,{icon: tgjg});
						} else if (feature.properties.Abréviatio == "TGJNG"){
							var marker = L.marker(latlng,{icon: tgjng});
						} else if (feature.properties.Abréviatio == "TO"){
							var marker = L.marker(latlng,{icon: to});
						} else if (feature.properties.Abréviatio == "TPGJ"){
							var marker = L.marker(latlng,{icon: tpgj});
						} else if (feature.properties.Abréviatio == "TPJNG"){
							var marker = L.marker(latlng,{icon: tpjng});
						}
					return marker;
          }
		});
      //add to markers only, add to cluster only on commune click (request)
			clusters.addLayer(geojsonmrk);
			// .addTo(Khemissetmrk);
	});
	//clusters.addLayer(geojsonmrk);
	map.addLayer(clusters);

  //layers 
  var baseLayers = {
     "Markers":basemap1
  };
// vars for IDs of layers control 
  var overlays = {
    "Markers": clusters,
    // "Markers of Khemisset": Khemissetmrk
    "Communes": communes,
    "Provinces": provinces,
    "Regions": regions
  };

	L.control.layers(baseLayers, overlays, {
		hideSingleBase: false,
		collapsed: false
	}).addTo(map);



// 	var types = [CA, CE, CFP, CSJ, CSPI, CT, FF, GE, MJ, PA, POO, POO, SC, TGJG, TGJNG, TO, TPGJ, TPJNG];

//     var layerControl = L.control.layers().addTo(map);

//     types.forEach(function(type) {
//     var mrklist = L.geoJson(geojsonmrk, {
//         filter: function(feature, layer) {
//             return feature.properties.Abréviatio == type;
//         }, 
//         onEachFeature: function(feature, layer) {
//             var link_url = "<a href='" + feature.properties.Link + "' target='_blank'>" + feature.properties.Name + "</a>"
//             layer.bindPopup(link_url);
//             // I don't see any L.icons in your example, but following what you have:
//             layer.setIcon(type);
//         }
//     }
//     // all done with the layer, add it to the control
//     layerControl.addOverlay(layer, type);

// });

//-- popup tabs


	$(document).on("click",".singleTab",function(){
		var tab_id = $(this).attr('data-tab');

		$('.singleTab').removeClass('active');
		$('.tab-content').removeClass('active');

		$(this).addClass('active');
		$("#"+tab_id).addClass('active');
	})
