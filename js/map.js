var map;
var markers = [];
var infoWindow;

function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: neighborhood.loc,
    scrollwheel: false,
    mapTypeControl: false,
    zoomControl: true,
  });
  viewModel.generateMarkers();

  if (!infoWindow) {
    infoWindow = new google.maps.InfoWindow({
      content: $('#yelp').html()
    });

    // google.maps.event.addListener(infoWindow, 'domready', function() {
    //   ko.applyBindings(viewModel, document.getElementById("inside"));
    // });
  } 
}

// Adds a marker to the map and push to the array.
function addMarker(location) {
  var infoWindowIsBound = true;
  var marker = new google.maps.Marker({
    position: location.loc,
    title: location.name,
    map: map,
  });

  // creates markers and adds a listener to do actions
  marker.addListener('click', function(){
    viewModel.setCurrent(location);
    toggleBounce(marker);
    infoWindow.setContent($('#yelp').html());
    infoWindow.open(map, marker);
  });
  markers.push(marker);
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setAnimation(null);
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
  setMapOnAll(map);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearMarkers();
  markers = [];
}

function turnOffBounce() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setAnimation(null);
  }
}

function toggleBounce(marker) {
  turnOffBounce();
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}

// if there is just one location left in the observable locations array
// bounce that one and open the info window
function bounceSingle(){
  turnOffBounce();
  if (markers.length === 1){
    markers[0].setAnimation(google.maps.Animation.BOUNCE);
    infoWindow.open(map, markers[0]);
  }
}

// open the info window and bounce a clicked on marker
function bounceSelected(data){
  for (var i = 0; i < markers.length; i++){
    if (markers[i].title === data.name) {
      toggleBounce(markers[i]);
      infoWindow.setContent($('#yelp').html());
      infoWindow.open(map, markers[i]);
    }
  }
}


