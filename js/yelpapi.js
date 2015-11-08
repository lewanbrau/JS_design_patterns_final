var auth = {
    //
    // Update with your auth tokens.
    //
    consumerKey : "SGfcOhGccD0dYX1IIvknyA",
    consumerSecret : "pFvLiQUmU9-3V2sOPbuWzS9lX4g",
    accessToken : "3h0b_5vmfa7K5r2VjCffk5R_MCoPg0OQ",
    // This example is a proof of concept, for how to use the Yelp v2 API with javascript.
    // You wouldn't actually want to expose your access token secret like this in a real application.
    accessTokenSecret : "XvkVwixCR77llVJBtQvc5IteCwY",
    serviceProvider : {
        signatureMethod : "HMAC-SHA1"
    }
};


var accessor = {
    consumerSecret : auth.consumerSecret,
    tokenSecret : auth.accessTokenSecret
};


var getID = function(name, loc){
    parameters = [];
    parameters.push(['term', name]);
    parameters.push(['location', 'San+Francisco']);
    parameters.push(['callback', 'cb']);
    parameters.push(['oauth_consumer_key', auth.consumerKey]);
    parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
    parameters.push(['oauth_token', auth.accessToken]);
    parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

    var message = {
    'action' : 'http://api.yelp.com/v2/search',
    'method' : 'GET',
    'parameters' : parameters
    };

    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);

    var parameterMap = OAuth.getParameterMap(message.parameters);

    $.ajax({
      'url' : message.action,
      'data' : parameterMap,
      'dataType' : 'jsonp',
      // 'jsonpCallback' : 'cb',
      'success' : function(data, textStats, XMLHttpRequest) {
          // console.log(data.businesses[0].id);
          locationsModel[loc].yelpID = data.businesses[0].id;
          getReview(data.businesses[0].id, loc);
          //$("body").append(output);
      },
      'error': function () {
        alert('API data pull error. Try again.')
      }
  });

};

var getReview = function(id, loc){
    parameters = [];
    parameters.push(['callback', 'cb']);
    parameters.push(['oauth_consumer_key', auth.consumerKey]);
    parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
    parameters.push(['oauth_token', auth.accessToken]);
    parameters.push(['oauth_signature_method', 'HMAC-SHA1']);


    var message = {
    'action' : 'http://api.yelp.com/v2/business/' + id,
    'method' : 'GET',
    'parameters' : parameters
    };

    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);

    var parameterMap = OAuth.getParameterMap(message.parameters);

    $.ajax({
      'url' : message.action,
      'data' : parameterMap,
      'dataType' : 'jsonp',
      // 'jsonpCallback' : 'cb',
      'success' : function(data, textStats, XMLHttpRequest) {
          

        locationsModel[loc].ratingPic = data.rating_img_url;
        locationsModel[loc].reviews = data.review_count + " reviews";
        locationsModel[loc].review = data.snippet_text;
        locationsModel[loc].yelpURL = data.url;

          // viewModel.ratingPic(data.rating_img_url);
          // viewModel.reviews(data.review_count + " reviews");
          // viewModel.review(data.snippet_text);
          // viewModel.yelpURL(data.url);
          // return data;
          //$("body").append(output);
      },
      'error': function () {
        alert('API data pull error. Try again.')
      }
  });

};

