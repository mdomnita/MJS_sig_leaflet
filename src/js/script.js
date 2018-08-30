var states = {
  "Khemisset" :{'population':281000,'etablissement':18 },
  "Ait Mimoune" :{'population':8254,'etablissement':2 },
  "Ait Yadine"  :{'population':20500,'etablissement':2 },
  "Tiflet"  :{'population':86000,'etablissement':6 },
  "Khemis Sidi Yahya" :{'population':6700,'etablissement':1 },
  "M'Qam Tolba" :{'population':13500,'etablissement':2 },
  "Sidi Allal El Bahraoui"  :{'population':281000,'etablissement':18 },
  "Oulmes"  :{'population':18700,'etablissement':7 },
  "Rommani" :{'population':12300,'etablissement':5 },
  "Ain Essbite" :{'population':11000,'etablissement':1 },
  "Brachoua"  :{'population':12000,'etablissement':2 },
  "El Ganzra" :{'population':13200,'etablissement':2 },
  "Maaziz"  :{'population':11500,'etablissement':1 },
  "Tiddas"  :{'population':10000,'etablissement':1 },
  "Ait Ichou" :{'population':10000,'etablissement':1 },
  "Sidi Allal Lamsadder"  :{'population':7400,'etablissement':2 },
  "Houdderane"  :{'population':6400,'etablissement':1 },
  "Marchouch":{'population':10000,'etablissement':2 },
}

var min = 10000 ;
//czoom is user to check previous zoom when zooming on nap. 
var cZoom = 0;
// nozoom is a flag to not trigger zoomend on fitbounds (hides coommunes otherwise with no reason.)
// var noZoom = false;


//markersis a list of all markers from all categories, even hidden
var markers = [];
//vars for layers will be shown on layer control
var regions = L.layerGroup();
var provinces = L.layerGroup();
var communes = L.layerGroup();
//clusters hold the categories shown on the map
var clusters = L.markerClusterGroup();

var map = L.map('map', {
  center: [33.80, -6.21],                  //[29.38217507514529, -8.7451171875],
  zoom: 9,
  layers: [regions]
});

var basemap1 = L.tileLayer('https://api.mapbox.com/styles/v1/sidgis/cjld7y4h972ve2rs0mh9v5iv8/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2lkZ2lzIiwiYSI6ImNqa3phcGZ0djBwcXEzcG53eGVzNXRpdmQifQ.JO3UVPg-WqaXki7mKcQhAw', {
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
   ``;
};
info.addTo(map);

// vars which will carry data of GeoJson files
var geojsonfile1 = null;
var geojsonfile2 = null;
var geojsonfile3 = null;
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

checkZoomEnd();

function checkZoomEnd() {
  //if user zooms out hide lower level layers
  map.on('zoomend', function(z) {
    // if (noZoom) return;
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
    // noZoom = false;
  });
}

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
      fillColor: '#ffffff',
      weight: 3,
      opacity: 1,
      color: 'black',
      //dashArray: '3',
      fillOpacity: 0
  };
}

$.getJSON("data/proc/region.geojson",function(data1){
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
//  map.fitBounds(e.target.getBounds());
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
  var myBounds = prov.getBounds().pad(0.02);
  setTimeout(function() { map.fitBounds(myBounds) }, 0);
  var provCode = prov.feature.properties.NAME;
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
  var myBounds = prov.getBounds().pad(0.02);
  setTimeout(function() { map.fitBounds(myBounds) }, 0);
  var provCode = prov.feature.properties.code_provi;
  var commLayers = communes.getLayers()[0].getLayers();
  //go through all communes, hide all from other provinces
  map.addLayer(communes);
  for (var cm in commLayers) {
    if (commLayers[cm].feature.properties.code_provi !== provCode) {
      map.removeLayer(commLayers[cm]);
    }
    else {
      map.addLayer(commLayers[cm]);
    }
  }
  //if user zooms out hide lower level layers
  map.on('zoomend', function(z) {
    var aZoom = z.target.getZoom();
    //add tooltips to communes on zoom 13
    if (z.target.getZoom() > 11 && map.hasLayer(communes)) {
      for (var cm in commLayers) {
        commLayers[cm].unbindTooltip();
        if (map.hasLayer(commLayers[cm])) {
          commLayers[cm].bindTooltip(commLayers[cm].feature.properties.commune,{permanent:true}).openTooltip();
        }
        else {
        }
      }
    }
  });
}

//click on commune zooms to it
function toggleMarkers(p) {
  p.originalEvent.stopPropagation();
  var prov = p.target;
  map.removeLayer(provinces);

  var myBounds = prov.getBounds().pad(0.02);
  setTimeout(function() { map.fitBounds(myBounds) }, 0);
  var frag = fillComInfo(prov);
  document.getElementById('provInfo').innerHTML = '';
  document.getElementById('provInfo').appendChild(frag);
  $('.population-taginfo span p').html(prov.feature.properties['Population'] ? prov.feature.properties['Population'] : 'N/A');
  fillCommMarkTyp(prov);
}

function  fillComInfo(prov) {
  console.log(prov);
  var frag = document.createDocumentFragment();
  //add all info for a province. Other attributes can be added here.
  var attrib = ['name'];
  for (att in attrib)
  {
    var p = document.createElement('p');
    var span = document.createElement('span');
    span.className = 'titl';
    span.appendChild(document.createTextNode(attrib[att].charAt(0).toUpperCase() + attrib[att].slice(1)+': '));
    p.appendChild(span);
    p.appendChild(document.createTextNode(prov.feature.properties[attrib[att]] ? prov.feature.properties[attrib[att]] : 'N/A'));
    frag.appendChild(p);
  }
  return frag;
}

function fillCommMarkTyp(comm) {
  //create object with number of each feature in comune
  var cInfo = {};
  // var checkboxes = document.getElementsByClassName('markerCat');
  for (var aC in markers) {
    if (comm.feature.properties.id === markers[aC].feature.properties.commune_id) {
      //found a marker in commune, create key in object for it or add to count
      var dType = markers[aC].feature.properties.TYPE.trim();
      //also store secteur, makes it much easier when creating html. can sdo same for first level
      if (!cInfo.hasOwnProperty(apartenence[dType].SECTEUR)) cInfo[apartenence[dType].SECTEUR] = {};
      if (cInfo[apartenence[dType].SECTEUR].hasOwnProperty(dType)) {
        cInfo[apartenence[dType].SECTEUR][dType]++;
      }
      else {
        cInfo[apartenence[dType].SECTEUR][dType] = 1;
      }
    }
  }
  //now Cinfo contains all marjers of each type, fill info box.
  //cinfo has number of markers now, create structure in right panel
  var frag = document.createDocumentFragment();
  if (typeof cInfo === 'object') {
    //second velvel are type-check-sec
    var lv1 = cInfo;
    //second are types
    //Sport, Enfance,...
    for (var l1 in lv1) {
      var lv2 = lv1[l1];
      var div2 = document.createElement('div');
      div2.className = "cat-row";
      //create first level
      var p = document.createElement('p');
      p.appendChild(document.createTextNode(l1));
      div2.appendChild(p);
      if (typeof lv2 === 'object') {
        //third level are simple label checkboxes
        for (var l2 in lv2) {
          var lv3 = lv2[l2];
          //reuse p, no problem.
          var p = document.createElement('li');
          p.appendChild(document.createTextNode(apartenence[l2].TYPE+': '+lv3));
          div2.appendChild(p);
        }
      }
      frag.appendChild(div2);
    }
    $('.categories-scroll').html(frag);
    console.log(cInfo);
  }
}

//hover province colors
function styleprovinces(feature) {
  return {
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
//  map.fitBounds(e.target.getBounds());
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
      fillColor: '#ffffff',
      weight: 1,
      opacity: 1,
      color: '#3388ff', 
      //dashArray: '3',
      fillOpacity: 0
  };
}

//hide or show a marker according to parameter
function toggleMarker(marker,hide) {
  //by default show the marker
  if (typeof hide === 'undefined') hide = false;
  if (clusters.hasLayer(marker) && hide) {
    clusters.removeLayer(marker);
  }
  else if (map.hasLayer(marker) && hide) {
    map.removeLayer(marker);
  }
  else if (!clusters.hasLayer(marker) && !hide) {
    clusters.addLayer(marker);
  }
}

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
var tpjg = new Icon({iconUrl: 'MJS_icones/Sport/PNG_1X/TPJG1.png'});
var tpjng = new Icon({iconUrl: 'MJS_icones/Sport/PNG_1X/TPJNG1.png'});

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
            '<div class="location"><i class="fas fa-map-marker-alt"></i>'+feature.properties.ADRESSE_FULL+'</div>'+
            '<a href="#" class="btn btn-danger">'+feature.properties.TYPE_FULL+'</a>'+
          '</div>'+
        '<div id="tab-2" class="tab-content">'+
          '<li>'+'Test List'+'</li>'+
          '<li>'+'Test List'+'</li>'+
          '<li>'+'Test List'+'</li>'+
        '</div>'+


        '</div>');
          }, pointToLayer: function (feature, latlng) {
            var mType = feature.properties.TYPE.trim();
            if (mType === "CA"){
              var marker = L.marker(latlng,{icon: ca});
            } else if (mType === "CE"){
              var marker = L.marker(latlng,{icon: ce});
            } else if (mType === "CFP"){
              var marker = L.marker(latlng, {icon: cfp});
            } else if (mType === "CSJ"){
              var marker = L.marker(latlng,{icon: csj});
            } else if (mType === "CSPI"){
              var marker = L.marker(latlng, {icon: cspi});
            } else if (mType === "CT"){
              var marker = L.marker(latlng,{icon: ct});
            } else if (mType === "FF"){
              var marker = L.marker(latlng,{icon: ff});
            } else if (mType === "GE"){
              var marker = L.marker(latlng,{icon: ge});
            } else if (mType === "MJ"){
              var marker = L.marker(latlng,{icon: mj});
            } else if (mType === "PA"){
              var marker = L.marker(latlng,{icon: pa});
            } else if (mType === "PO"){
              var marker = L.marker(latlng,{icon: poo});
            } else if (mType === "POO"){
              var marker = L.marker(latlng,{icon: poo});
            } else if (mType === "SC"){
              var marker = L.marker(latlng,{icon: sc});
            } else if (mType === "TGJG"){
              var marker = L.marker(latlng,{icon: tgjg});
            } else if (mType === "TGJNG"){
              var marker = L.marker(latlng,{icon: tgjng});
            } else if (mType === "TO"){
              var marker = L.marker(latlng,{icon: to});
            } else if (mType === "TPJG"){
              var marker = L.marker(latlng,{icon: tpjg});
            } else if (mType === "TPJNG"){
              var marker = L.marker(latlng,{icon: tpjng});
            }
          //markers will always have all markers from map. clusters only have the ones shown after filtering
          if (marker) {
            markers.push(marker);
          }
          return marker;
          }
    });
      //add to markers only, add to cluster only on commune click (request)
      clusters.addLayer(geojsonmrk);
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
    "Communes": communes,
    "Provinces": provinces,
    "Regions": regions
  };

  L.control.layers(baseLayers, overlays, {
    hideSingleBase: false,
    collapsed: false
  }).addTo(map);

//  var types = [CA, CE, CFP, CSJ, CSPI, CT, FF, GE, MJ, PA, POO, POO, SC, TGJG, TGJNG, TO, TPGJ, TPJNG];

//     var layerControl = L.control.layers().addTo(map);

//     types.forEach(function(type) {
//     var mrklist = L.geoJson(geojsonmrk, {
//         filter: function(feature, layer) {
//             return feature.properties.TYPE == type;
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

//-- Information box expand/collapse
$(document).ready(function() {
	$('.information-collapse').on('click', function(e) {
		$('.information-collapse .bar').toggleClass('active');
	  $('.informationBox').toggleClass('active');
		  e.preventDefault();
    });
    // prevenr zoom in map on mousewheel IE9, Chrome, Safari, Opera
    $('.informationBox').on("mousewheel", function(e) { e.stopPropagation() });
    // Firefox
    $('.informationBox').on("DOMMouseScroll", function(e) { e.stopPropagation() });
  });

  //-- Filter box expand/collapse
$(document).ready(function() {
	$('.filter-collapse').on('click', function(e) {
		$('.filter-collapse').toggleClass('active');
	  $('.filterBox').toggleClass('active');
		  e.preventDefault();
	  });
    // prevenr zoom in map on mousewheel IE9, Chrome, Safari, Opera
    $('.filterBox').on("mousewheel", function(e) { e.stopPropagation() });
    // Firefox
    $('.filterBox').on("DOMMouseScroll", function(e) { e.stopPropagation() });
  });

 