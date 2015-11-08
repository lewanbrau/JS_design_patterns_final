// Model

var neighborhood = {
    name: "Mission Bay",
    loc: {lat: 37.776889, lng: -122.390667},
    locations: 0
};

var locationsModel = [
  {
    loc: {lat: 37.778595, lng: -122.38927},
    name: 'AT&T Park',
    url: 'http://sanfrancisco.giants.mlb.com/sf/ballpark/',
    display: 'True',
    yelpID: '',
    ratingPic: '',
    reviews: '',
    review: '',
    yelpURL: ''
  },
  {
    loc: {lat: 37.775481, lng: -122.393403},
    name: "Philz Coffee",
    url: 'philzcoffee.com',
    display: 'True',
    yelpID: '',
    ratingPic: '',
    reviews: '',
    review: '',
    yelpURL: ''
  },
  {
    loc: {lat: 37.776244, lng: -122.389648},
    name: 'The Yard at Mission Rock',
    url: 'theyardsf.com',
    display: 'True',
    yelpID: '',
    ratingPic: '',
    reviews: '',
    review: '',
    yelpURL: ''
  },
  {
    loc: {lat: 37.778348, lng: -122.392610},
    name: 'Lucky Strike San Francisco',
    url: 'bowlluckystrike.com',
    display: 'True',
    yelpID: '',
    ratingPic: '',
    reviews: '',
    review: '',
    yelpURL: ''
  },
  {
    loc: {lat: 37.777019, lng: -122.392583},
    name: 'Nama Sushi SF',
    url: 'namasushisf.com',
    display: 'True',
    yelpID: '',
    ratingPic: '',
    reviews: '',
    review: '',
    yelpURL: ''
  },
];

//View Model
var viewModel = {
  locations: ko.observableArray([]),
  query: ko.observable(''),
  neighborhood: ko.observable(neighborhood.name),
  locationCount: ko.observable('Test'),
  ratingPic: ko.observable(''),
  reviews: ko.observable(''),
  review: ko.observable(''),
  yelpURL: ko.observable(''),
  currentSelection: ko.observableArray([]),

  // set the current location to what has been selected
  // take in a locations data array
  setLoc: function(data){
    viewModel.setCurrent(data);
    bounceSelected(data);
  },

  setCurrent: function(data){
    this.currentSelection(data);
  },

  initialValues: function() {
    // set the ko.observableArray to the values in the model
    for (var loc in locationsModel) {
      this.locations.push(locationsModel[loc]);
    };
    this.locCount();
    // pull down yelp data in the async
    this.getIDs();
  },

  generateMarkers: function(){
    deleteMarkers();
    for(var loc in this.locations()){
      addMarker(this.locations()[loc]);
    }
    bounceSingle();
  },

  locCount: function(){
    var n = viewModel.locations().length;
    // if there is just a single location we use setLoc() to select a marker
    if(n === 1) {
      this.locationCount(n.toString() + ' location');
      this.setLoc(viewModel.locations()[0]);
    } else {
      this.locationCount(n.toString() + ' locations');
    }
  },

  // tosses all the location names to yelp and populates the locationModel
  getIDs: function(){
    for(var loc in locationsModel){
      getID(locationsModel[loc].name, loc);
    }
  },


  search: function(value) {
    // remove all of the list
    viewModel.locations.removeAll();
    // remove the map markers
    clearMarkers();
    //iterate through the locations in the locationsModel and check for match from query
    for(var x in locationsModel) {
      if(locationsModel[x].name.toLowerCase().indexOf(value.toLowerCase()) >= 0){
        viewModel.locations.push(locationsModel[x]);  
      }
    }
    viewModel.generateMarkers();
    viewModel.locCount();
  }
};



  

// apply the view bindings from the view model
ko.applyBindings(viewModel);

//force the search function to be bound by the query parameters
viewModel.query.subscribe(viewModel.search);

//kicking off the script to load up the DOM and maps with values
viewModel.initialValues();

//
