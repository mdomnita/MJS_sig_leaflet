//czoom is user to check previous zoom when zooming on nap. 
var cZoom = 0;

//markersis a list of all markers from all categories, even hidden
var markers = [];
//vars for layers will be shown on layer control
var regions = L.layerGroup();
var provinces = L.layerGroup();
var communes = L.layerGroup();
var invMarkers = L.layerGroup();
//clusters hold the categories shown on the map
var clusters = L.markerClusterGroup({showCoverageOnHover:false});
var regClusters = {};
var comClusters =  {};
var provClusters = {};
var reqHold = false;
var timer;
var searchControl;

var map = L.map('map', {
  center: [33.80, -6.21],                  //[29.38217507514529, -8.7451171875],
  zoom: 9,
  layers: []
});

// vars which will carry data of GeoJson files
var geojsonfile1 = null;
var geojsonfile2 = null;
var geojsonfile3 = null;
var geojsonmrk = null;
var info = L.control();
// Get GeoJSON and put on it on the map when it loads
var markericon = L.icon({
  iconUrl: 'icons/Map-marker-02.png',
  iconSize: [36,36],
  iconAnchor: [18,18]
});

$.getJSON("data/proc/morocco.geojson",function(data1){
  var geom = data1.features[0].geometry;
  var basemap1 = L.TileLayer.boundaryCanvas('https://api.mapbox.com/styles/v1/sidgis/cjld7y4h972ve2rs0mh9v5iv8/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2lkZ2lzIiwiYSI6ImNqa3phcGZ0djBwcXEzcG53eGVzNXRpdmQifQ.JO3UVPg-WqaXki7mKcQhAw', {
      boundary: geom, 
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.control.browserPrint({
  closePopupsOnPrint: false,
  printModes: [
    // L.control.browserPrint.mode.landscape("A3 Landscape", "A3"),
    // L.control.browserPrint.mode.portrait("A3", "A3"),
    L.control.browserPrint.mode.landscape("A0 Landscape", "A0"),
    L.control.browserPrint.mode.portrait("A0", "A0")
  ]
}).addTo(map);

info.onAdd = function (map) {
  this._div = L.DomUtil.create('div');
  this.update();
  return this._div;
};

info.update = function (props) {
  document.getElementById('provInfo').innerHTML = '';
  if (!props) {
    $('.categories-scroll').html('');
    return;
  }
  var frag = document.createDocumentFragment();
  //add all info for a province. Other attributes can be added here.
  var attrib = ['commune','province','region','Name'];
  for (att in attrib)
  {
    if (props[attrib[att]]) {
      var p = document.createElement('p');
      var span = document.createElement('span');
      span.className = 'titl';
      span.appendChild(document.createTextNode(attrib[att].charAt(0).toUpperCase() + attrib[att].slice(1)+': '));
      p.appendChild(span);
      p.appendChild(document.createTextNode(props[attrib[att]] ? props[attrib[att]] : 'N/A'));
      frag.appendChild(p);
    }
  }
  document.getElementById('provInfo').appendChild(frag);
};
info.addTo(map);
// make categories scroll effective and set height size:
var height = $(document).height() - 500;
document.getElementById('categories').style.cssText = 'max-height:'+height+'px;overflow-y:scroll;';
$('#categories').off('mouseover').on('mouseover',function(){
  clearTimeout(timer);
  reqHold = false;
});

checkZoomEnd(); 

//remember previous zoom to check if user zoomed in or out
map.on('zoomstart', function(z) {
  cZoom = map.getZoom();
});

$.getJSON("data/proc/region.geojson",function(data1){
    geojsonfile1 = L.geoJson(data1,{
      style: styleregions,  
      onEachFeature: function (feature, layer) {
        layer.on({
          mouseover: highlightRegion,
          mouseout: resetHighlight,
          click: toggleProvinces
        });
        regions.addLayer(layer);
      }
  });
    map.addLayer(regions);
    regions.eachLayer(function (layer) {
        // console.log(layer);
    });
    $('.loader').hide();
});

$.getJSON("data/proc/provinceReg.geojson",function(data2){
    geojsonfile2 = L.geoJson(data2,{
     style: styleprovinces,
        onEachFeature: function (feature, layer2) {
        layer2.on({
          mouseover: highlightProvince,
          mouseout: resetHighlightProv,
          click: toggleCommunes
        });
        provinces.addLayer(layer2);
       }
  });
});

$.getJSON("data/proc/communesReg.geojson",function(data3){
  geojsonfile3 = L.geoJson(data3,{
   style: style,
      onEachFeature: function (feature, layer3) {
       layer3.on({
          mouseover: highlightCommune,
          mouseout: resetHighlightComm,
          click: toggleMarkers
        });
      //properties to search by
      feature.properties.searchT = feature.properties.commune;
       communes.addLayer(layer3);
       invMarkers.addLayer(layer3);
     }
  });
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
      if (!layer) return;
      // var fNomf = (typeof feature.properties.NOMFIRST === "string")? feature.properties.NOMFIRST : "" ;
      var fNom =  (typeof feature.properties.NOM === "string")? feature.properties.NOM : ""
      var fAddr =  (typeof feature.properties.ADRESSE === "string")? " "+feature.properties.ADRESSE : " "
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
          '<h3>'+ fNom +'</h3>'+
          '<div class="location"><i class="fa fa-map-marker-alt"></i>'+ fAddr
         +'</div>'+
        '</div>'+
        '<div id="tab-2" class="tab-content">'+
        '</div>'+
      '</div>');
    }, 
    pointToLayer: function (feature, latlng) {
      if (!feature) return;
      var mType = feature.properties.CATEGORIE.trim();
      if (mType === "CA"){
        feature.properties.icon = ca;
        var marker = L.marker(latlng,feature.properties);
      } else if (mType === "CE"){
        feature.properties.icon = ce;
        var marker = L.marker(latlng,feature.properties);
      } else if (mType === "CFP"){
        feature.properties.icon = cfp;
        var marker = L.marker(latlng,feature.properties);
      } else if (mType === "CSJ"){
        feature.properties.icon = csj;
        var marker = L.marker(latlng,feature.properties);
      } else if (mType === "CSPI"){
        feature.properties.icon = cspi;
        var marker = L.marker(latlng,feature.properties);
      } else if (mType === "CT"){
        feature.properties.icon = ct;
        var marker = L.marker(latlng,feature.properties);
      } else if (mType === "FF"){
        feature.properties.icon = ff;
        var marker = L.marker(latlng,feature.properties);
      } else if (mType === "GE"){
        feature.properties.icon = ge;
        var marker = L.marker(latlng,feature.properties);
      } else if (mType === "MJ"){
        feature.properties.icon = mj;
        var marker = L.marker(latlng,feature.properties);
      } else if (mType === "PA"){
        feature.properties.icon = pa;
        var marker = L.marker(latlng,feature.properties);
      } else if (mType === "PO"){
        feature.properties.icon = poo;
        var marker = L.marker(latlng,feature.properties);
      } else if (mType === "POO"){
        feature.properties.icon = poo;
        var marker = L.marker(latlng,feature.properties);
      } else if (mType === "SC"){
        feature.properties.icon = sc;
        var marker = L.marker(latlng,feature.properties);
      } else if (mType === "TGJG"){
        feature.properties.icon = tgjg;
        var marker = L.marker(latlng,feature.properties);
      } else if (mType === "TGJNG"){
        feature.properties.icon = tgjng;
        var marker = L.marker(latlng,feature.properties);
      } else if (mType === "TO"){
        feature.properties.icon = to;
        var marker = L.marker(latlng,feature.properties);
      } else if (mType === "TPJG"){
        feature.properties.icon = tpjg;
        var marker = L.marker(latlng,feature.properties);
      } else if (mType === "TPJNG"){
        feature.properties.icon = tpjng;
        var marker = L.marker(latlng,feature.properties);
      }
      //fallback option for wrong/incorrect data
      else {
        feature.properties.icon = tpjng;
        var marker = L.marker(latlng,feature.properties);
      }
      //properties to search by
      feature.properties.searchT = feature.properties.NOM + ' | ' + feature.properties.ADRESSE+ ' | ' + feature.properties.COMMUNE;
      //markers will always have all markers from map. clusters only have the ones shown after filtering
      if (marker) {
        markers.push(marker);
      }
      //ainvisible marker for search?
      return marker;
    }
  });
  //add to markers only, add to cluster only on commune click (request)
  clusters.addLayer(geojsonmrk);
  invMarkers.addLayer(geojsonmrk);

  var markerz = geojsonmrk.getLayers();
  for (mrk in markers) {
    var mrkpropz = markers[mrk].feature.properties;
    //clusters for provinces
    if (!provClusters.hasOwnProperty(mrkpropz.code_provi)) {
      provClusters[mrkpropz.code_provi] = L.markerClusterGroup({showCoverageOnHover:false});
    }
    provClusters[mrkpropz.code_provi].addLayer(markers[mrk]);
  }
  for (let key in provClusters) {
    //don't add markers to map by default, add them only when markers layer is clicked
    // map.addLayer(provClusters[key]);
  }
  if (!searchControl) { 
    searchControl = new L.Control.Search({
      layer: invMarkers,
      propertyName: 'searchT',
      initial:false,
      autoCollapse:true,
      // marker: {
      //   circle:{radius:50}
      // },
      moveToLocation: function(latlng, title, map) {
        map.panTo(latlng); // access the zoom
      }
    });

    searchControl.on('search:locationfound', function(e) {
      if (e.layer instanceof L.Polygon) {
        map.addLayer(e.layer);
        map.fitBounds(e.layer.getBounds());
      }
      setTimeout("searchControl._markerSearch.removeFrom(map)",3000);
      //   e.layer.openPopup();
      // if (!map.hasLayer(e.layer)) map.addLayer(e.layer);
      map.removeLayer(invMarkers);
    });
  }

  map.addControl( searchControl );  //inizialize search control
  map.removeLayer(invMarkers);
  map.removeLayer(geojsonmrk);
});
map.addLayer(clusters);

map.removeLayer(communes);

  //layers 
  var baseLayers = {
    "Basemap":basemap1
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
   
  //-- popup tabs
  $(document).on("click",".singleTab",function(){
    var tab_id = $(this).attr('data-tab');

    $('.singleTab').removeClass('active');
    $('.tab-content').removeClass('active');

    $(this).addClass('active');
    $("#"+tab_id).addClass('active');
  });
});

function clearCateg() {
    info.update();
    reqHold = false;
}

function resetHighlight(r) {
  //do nothing if something else is in progress
  geojsonfile1.resetStyle(r.target);
  if (reqHold) return;
  // reqHold = true;
  timer = setTimeout(clearCateg,3000);
}

function checkZoomEnd() {
  //if user zooms out hide lower level layers
  //this breaks a lot of stuff!!! layers added and hidden on zoomend 
  //conflict with layers hidden and shown on click on region/province.
  map.on('zoomend', function(z) {
    var aZoom = map.getZoom();
    //hide communes on zoom 13
    if (cZoom && aZoom < cZoom && map.getZoom() < 11 && map.hasLayer(communes)) {
      map.removeLayer(communes);
      map.addLayer(provinces);
    }
    //hide provinces on zoom 11
    if (cZoom && aZoom < cZoom && map.getZoom() < 8 && map.hasLayer(provinces)) {
     map.removeLayer(provinces);
      map.addLayer(regions);
    }
  });
}

//highlight region
function highlightRegion(r) {
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
  clearTimeout(timer);
  $('.categories-scroll').html("");
  fillCommMarkTyp(layer1,'reg');
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

//reset and highlight province
function resetHighlightProv(p) {
  geojsonfile2.resetStyle(p.target);
  if (reqHold) return;
  // reqHold = true;
  timer = setTimeout(clearCateg,3000);
}

//highlight province
function highlightProvince(p) {
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
  clearTimeout(timer);
  $('.categories-scroll').html("");
  $('.population-taginfo span p').html('N/A');
  var found = false;
  var commLayers = communes.getLayers();
  for (var cm in commLayers) {
    if (map.hasLayer(commLayers[cm])) found = true;
  }
  if (!found) fillCommMarkTyp(layer2,'prov');
}

//show provinces in region
function toggleProvinces(p) {
  p.originalEvent.stopPropagation();
  var region = p.target;
  var center = region.getCenter();
  setTimeout(function() { map.panTo(center) }, 0);
  var regId = region.feature.properties.region_id;
  var provLayers = provinces.getLayers();
  //go through all provinces, hide all from other region
  map.addLayer(provinces);
  toggleProvinceLabels(true);
  for (var cm in provLayers) {
    if (provLayers[cm].feature.properties.region_id !== regId) {
      map.removeLayer(provLayers[cm]);
      provLayers[cm].unbindTooltip();
    }
    else {
      map.addLayer(provLayers[cm]);
      //add province name to province
      provLayers[cm].bindTooltip(provLayers[cm].feature.properties.province,{direction:'center',permanent:true}).openTooltip();
    }
  }
  map.removeLayer(regions);
}

//add or remove labels for provinces
function toggleProvinceLabels(hide) {
  if (hide) {
    var provLayers = provinces.getLayers();
    //go through all provinces, hide all from other region
    for (var cm in provLayers) {
      if (map.hasLayer(provLayers[cm])) {
        provLayers[cm].unbindTooltip();
      }
    }
  }
}

//click on province shows communes within
function toggleCommunes(p) {
  p.originalEvent.stopPropagation();
  var prov = p.target;
  var myBounds = prov.getBounds().pad(0.02);
  setTimeout(function() { map.fitBounds(myBounds) }, 0);
  var provCode = prov.feature.properties.code_provi;
  var commLayers = communes.getLayers();
  //go through all communes, hide all from other provinces
  map.addLayer(communes);
  for (var cm in commLayers) {
    if (commLayers[cm].feature.properties.code_provi !== provCode) {
      map.removeLayer(commLayers[cm]);
      commLayers[cm].unbindTooltip();
    }
    else {
      map.addLayer(commLayers[cm]);
      commLayers[cm].bindTooltip(commLayers[cm].feature.properties.commune,{permanent:true}).openTooltip();
    }
  }
  //if user zooms out hide lower level layers
  map.on('zoomend', function(z) {
    var aZoom = map.getZoom();
    //add tooltips to communes on zoom 13
    if (map.getZoom() > 11 && map.hasLayer(communes)) {
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
  // $('.population-taginfo span p').html(prov.feature.properties['population'] ? prov.feature.properties['population'] : 'N/A');
  $('.population-taginfo span p').html('N/A');
  fillCommMarkTyp(prov,'comm');
}

function  fillComInfo(prov) {
  var frag = document.createDocumentFragment();
  //add all info for a province. Other attributes can be added here.
  var attrib = ['commune'];
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

//create object with number of each feature in comune or region/prov
function fillCommMarkTyp(comm,type) {
  var cInfo = {};
  // var checkboxes = document.getElementsByClassName('markerCat');
  for (var aC in markers) {
    if ((type==='comm' && comm.feature.properties.code == markers[aC].feature.properties.COMMUNEID)
    || (type==='prov' && comm.feature.properties.code_provi == markers[aC].feature.properties.code_provi)
    || (type==='reg' && comm.feature.properties.region_id == markers[aC].feature.properties.id_adm)) {
      //found a marker in commune, create key in object for it or add to count
      var dType = markers[aC].feature.properties.CATEGORIE.trim();
      //also store secteur, makes it much easier when creating html. can sdo same for first level
      if (apartenence[dType] && apartenence[dType].SECTEUR && !cInfo.hasOwnProperty(apartenence[dType].SECTEUR)) { cInfo[apartenence[dType].SECTEUR] = {} }
      //put something default for missing or incorrect data
      else if ((!apartenence[dType] || !apartenence[dType].SECTEUR) && !cInfo.hasOwnProperty("Sport")) cInfo["Sport"] = {};
      if (apartenence[dType] && apartenence[dType].SECTEUR && cInfo[apartenence[dType].SECTEUR] && cInfo[apartenence[dType].SECTEUR].hasOwnProperty(dType)) {
        cInfo[apartenence[dType].SECTEUR][dType]++;
      }
      else if (apartenence[dType] && apartenence[dType].SECTEUR) {
        cInfo[apartenence[dType].SECTEUR][dType] = 1;
      }
      //add data for incorrect values
      else cInfo["Sport"]["TGJG"] = (cInfo["Sport"].hasOwnProperty("TGJG")) ? cInfo["Sport"]["TGJG"] + 1 : 1;
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

function resetHighlightComm(c) {
  geojsonfile3.resetStyle(c.target);
  if (reqHold) return;
  // reqHold = true;
  timer = setTimeout(clearCateg,3000);
}

//highlight commune
function highlightCommune(c) {
  c.originalEvent.stopPropagation();
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
  clearTimeout(timer);
  // $('.population-taginfo span p').html(layer3.feature.properties['population'] ? layer3.feature.properties['population'] : 'N/A');
  $('.population-taginfo span p').html('N/A');
  fillCommMarkTyp(layer3,'comm');
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
//-- Information box expand/collapse
$(document).ready(function() {
  $('.information-collapse').on('click', function(e) {
    $('.information-collapse .bar').toggleClass('active');
    $('.informationBox').toggleClass('active');
      e.preventDefault();
    });
    // prevent zoom in map on mousewheel IE9, Chrome, Safari, Opera
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
    // prevent zoom in map on mousewheel IE9, Chrome, Safari, Opera
    $('.filterBox').on("mousewheel", function(e) { e.stopPropagation() });
    // Firefox
    $('.filterBox').on("DOMMouseScroll", function(e) { e.stopPropagation() });
  });

 