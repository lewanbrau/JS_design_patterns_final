var map;
var markers = [];
var infoWindow;
var infoContent = "<div id='inside'><h2 data-bind='text: currentSelection'>test</h2><img src='' data-bind='attr: {src: ratingPic}'><h4 data-bind='text: reviews'>Reviews:</h4><p data-bind='text: review'></p></div>";
function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: neighborhood.loc,
    scrollwheel: false,
  });
  viewModel.generateMarkers();

  if (!infoWindow) {
    infoWindow = new google.maps.InfoWindow({
      content: infoContent
    });

    google.maps.event.addListener(infoWindow, 'domready', function() {
      ko.applyBindings(viewModel, document.getElementById("inside"));
    });
  } 
}

// Adds a marker to the map and push to the array.
function addMarker(location) {

  var infoWindowIsBound = false;
  var marker = new google.maps.Marker({
    position: location.loc,
    title: location.name,
    map: map,
  })

  marker.addListener('click', function(){
    viewModel.setCurrent(marker.title);
    toggleBounce(marker);
    infoWindow.open(map, marker);
  });
  // marker.addListener('click', toggleBounce);
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

function bounceSingle(){
  turnOffBounce();
  if (markers.length === 1){
    markers[0].setAnimation(google.maps.Animation.BOUNCE);
    infoWindow.open(map, markers[0]);
  }
}

function bounceSelected(name){
  for (var i = 0; i < markers.length; i++){
    if (markers[i].title === name) {
      toggleBounce(markers[i]);
      infoWindow.open(map, markers[i]);
    }
  }
}

var contentString = '<div id="content">'+
    '<div id="siteNotice">'+
    '<p data-bind="text: review"></p>'
    '</div>';


