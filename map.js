
import { template } from 'meteor/templating';
import { Markers } from '../api/markers.js';
import { FlowRouter } from 'meteor/kadira:flow-router';

import './map.html';

if (Meteor.isClient) {
	Meteor.startup(function() {
		GoogleMaps.load();
	});


	Template.map.onRendered(function() {
		//This is called when window is resized.
		$(window).resize(function(event) {
			//var center=GoogleMaps.maps.map.instance.getCenter();
			var center=GoogleMaps.maps.exampleMap.instance.getCenter();

			var window_height=$(window).height();
			var navbar_up_height=$('.navbar-header').height();
			var navbar_bottom_height=$('footer .container-fluid').height();
			var height=window_height-navbar_up_height-navbar_bottom_height;
			$('.map-container').height(height);
			google.maps.event.trigger(GoogleMaps.maps.exampleMap.instance,'resize');
			GoogleMaps.maps.exampleMap.instance.setCenter(center);
		});

		//These are executed when page is displayed.
		var window_height=$(window).height();
		var navbar_up_height=$('.navbar-header').height();
		var navbar_bottom_height=$('footer .container-fluid').height();
		var height=window_height-navbar_up_height-navbar_bottom_height;
		$('.map-container').height(height);
		google.maps.event.trigger(GoogleMaps.maps.exampleMap.instance,'resize');
	});


	Template.map.helpers({
    geolocationError: function() {
      var error = Geolocation.error();
      return error && error.message;
    },
	  exampleMapOptions: function() {
      // Get current position form the browser
      var latLng = Geolocation.latLng();
	    // Make sure the maps API has loaded
	    if (GoogleMaps.loaded()) {
      	// Map initialization options
      	return {
        	center: new google.maps.LatLng(latLng.lat, latLng.lng),
        	zoom: 8
      	};
	    }
		}
	});


	//Add listeners after map is created and ready.
  Template.map.onCreated(function() {
    GoogleMaps.ready('exampleMap',function(map) {
      /*
      Event listener for clicking the map.
      A new marker is added to MongoDB collection and UI if user clicks the map.
      */
      google.maps.event.addListener(map.instance,'click',function(event){
        Markers.insert({ lat: event.latLng.lat(),lng: event.latLng.lng() });
      });

      /*
      Markers are also store into array to get a reference, if marker is
      for example moved
      */
      var markers = {};
      /*
      Observer for MonboDB collection, which automatically reacts (updates map)
      when collection is updated.
      */
      Markers.find().observe({
        //If new marker is added to collection a marker is displayed onto map.
        added: function(document) {
          //Create a new marker and add it to the map.
          var marker=new google.maps.Marker({
            draggable: true,
            animation: google.maps.Animation.DROP,
            position: new google.maps.LatLng(document.lat,document.lng),
            map: map.instance,
            id: document._id,
            //url: 'http://wwww.oamk.fi'
          });

          //Event listener for dragging markers.
          google.maps.event.addListener(marker,'dragend',function(event) {
            Markers.update(marker.id, {$set: {lat: event.latLng.lat(),lng: event.latLng.lng()}});
          });

          google.maps.event.addListener(marker,'click',function(event) {
          	//console.log(this.id);
          	FlowRouter.go('/about/' + this.id);
          });

          markers[document._id]=marker;
        },
      });
    });
  });
}
