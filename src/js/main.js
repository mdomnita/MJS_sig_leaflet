function showDiv(elem){
   if(elem.value == 'map'){
      	document.getElementById('map').style.display = "block";
  		document.getElementById('map1').style.display = "none";
   } else if(elem.value == 'map1'){
   		document.getElementById('map').style.display = "none";
  		document.getElementById('map1').style.display = "block";
   }
}