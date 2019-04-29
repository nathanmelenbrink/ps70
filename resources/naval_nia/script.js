/*

  ARTG2260
  Nia Naval
  niamnaval@gmail.com
  Final Project: Open Spaces Boston

  References: 
  - Google Maps JavaScript API: https://developers.google.com/maps/documentation/javascript/tutorial
  - w3 Schools
  - Stack Overflow Questions

  Hosted on https://nianaval.github.io/openspaces/

*/

var marker;

function initMap() {

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    styles: [
      {
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#f5f5f5"
          }
        ]
      },
      {
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#616161"
          }
        ]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#f5f5f5"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#bdbdbd"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#eeeeee"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#e5e5e5"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9e9e9e"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#ffffff"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#dadada"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#616161"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9e9e9e"
          }
        ]
      },
      {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#e5e5e5"
          }
        ]
      },
      {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#eeeeee"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#c9c9c9"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9e9e9e"
          }
        ]
      }
    ],
    center: {lat: 42.338305, lng: -71.076783}
  });
  map.data.loadGeoJson('data/openspaces.geojson');
  map.data.setStyle({
    fillColor: 'darkturquoise',
    strokeWeight: 0
  });

  map.data.addListener('click', function(event) {
    document.getElementById('info-box').textContent =
        event.feature.getProperty('SITE_NAME');
  });

  map.data.addListener('click', function(event) {
    document.getElementById('info-box2').textContent =
        event.feature.getProperty('ALT_NAME');
  });

  map.data.addListener('click', function(event) {
    document.getElementById('info-box3').textContent =
        event.feature.getProperty('ADDRESS');
  });

  map.data.addListener('click', function(event) {
    document.getElementById('info-box4').textContent =
        event.feature.getProperty('DISTRICT');
  });  

  map.data.addListener('click', function(event) {
    document.getElementById('info-box5').textContent =
        event.feature.getProperty('TypeLong');
  });  

  map.data.addListener('click', function(event) {
    document.getElementById('info-box6').textContent =
        event.feature.getProperty('ZonAgg');
  });  

  map.data.addListener('click', function(event) {
    document.getElementById('info-box7').textContent =
        event.feature.getProperty('OWNERSHIP');
  });  

  map.data.addListener('click', function(event) {
    document.getElementById('info-box8').textContent =
        event.feature.getProperty('ACRES');
  });  

  function addMarker(location, map) {
if ( marker ) {
    marker.setPosition(location);
  } else {
    marker = new google.maps.Marker({
      position: location,
      map: map
    });
  }
}

  map.data.addListener('click', function(event) {
    addMarker(event.latLng, map);
  });



  // function toggleCheckbox(element) {
  //  element.checked = !element.checked;
  // }

  function allston(feature) {
  map.data.forEach(function (feature) {

     // if (feature.getProperty('DISTRICT') != 'Allston-Brighton') {     
     //      map.data.overrideStyle(event.feature, {
     //        fillOpacity: 0,
     //        strokeWeight: 0
     //      });
     //  }
     //  // else if (document.getElementById('allston') == false) {
     //  //   map.data.setStyle({
     //  //       fillColor: 'darkturquoise',
     //  //       strokeWeight: 0
     //  //     });
     //  // }
    
      if (feature.getProperty('DISTRICT') != 'Dorchester') {     
          map.data.overrideStyle(feature, {
                fillOpacity: 0,
                strokeWeight: 0
              });
          }
         
    });
  };

  function dorchester(feature) {
  map.data.forEach(function (feature) { 
    
      if (feature.getProperty('DISTRICT') != 'Dorchester') {     
          map.data.overrideStyle(feature, {
                fillOpacity: 0,
                strokeWeight: 0
              });
          }
         
    });
  };
  function backbay(feature) {
  map.data.forEach(function (feature) { 
    
      if (feature.getProperty('DISTRICT') != 'Back Bay/Beacon Hill') {     
          map.data.overrideStyle(feature, {
                fillOpacity: 0,
                strokeWeight: 0
              });
          }
         
    });
  };
  function centralboston(feature) {
  map.data.forEach(function (feature) { 
      if (feature.getProperty('DISTRICT') != 'Central Boston') {     
              map.data.overrideStyle(feature, {
                fillOpacity: 0,
                strokeWeight: 0
              });
          }
         
    });
  };

  function charlestown(feature) {
  map.data.forEach(function (feature) { 
    
      if (feature.getProperty('DISTRICT') != 'Charlestown') {     
          map.data.overrideStyle(feature, {
                fillOpacity: 0,
                strokeWeight: 0
              });
          }
         
    });
  };
  function eastboston(feature) {
  map.data.forEach(function (feature) { 
    
      if (feature.getProperty('DISTRICT') != 'East Boston') {     
          map.data.overrideStyle(feature, {
                fillOpacity: 0,
                strokeWeight: 0
              });
          }
         
    });
  };
  function fenway(feature) {
  map.data.forEach(function (feature) { 
    
      if (feature.getProperty('DISTRICT') != 'Fenway/Kenmore') {     
          map.data.overrideStyle(feature, {
                fillOpacity: 0,
                strokeWeight: 0
              });
          }
         
    });
  };
  function harborislands(feature) {
  map.data.forEach(function (feature) { 
    
      if (feature.getProperty('DISTRICT') != 'Harbor Islands') {     
          map.data.overrideStyle(feature, {
                fillOpacity: 0,
                strokeWeight: 0
              });
          }
         
    });
  };
  function hydepark(feature) {
  map.data.forEach(function (feature) { 
    
      if (feature.getProperty('DISTRICT') != 'Hyde Park') {     
          map.data.overrideStyle(feature, {
                fillOpacity: 0,
                strokeWeight: 0
              });
          }
         
    });
  };
  function jamaicaplain(feature) {
  map.data.forEach(function (feature) { 
    
      if (feature.getProperty('DISTRICT') != 'Jamaica Plain') {     
          map.data.overrideStyle(feature, {
                fillOpacity: 0,
                strokeWeight: 0
              });
          }
         
    });
  };
  function mattapan(feature) {
  map.data.forEach(function (feature) { 
    
      if (feature.getProperty('DISTRICT') != 'Mattapan') {     
          map.data.overrideStyle(feature, {
                fillOpacity: 0,
                strokeWeight: 0
              });
          }
         
    });
  };
  function roslindale(feature) {
  map.data.forEach(function (feature) { 
    
      if (feature.getProperty('DISTRICT') != 'Roslindale') {     
          map.data.overrideStyle(feature, {
                fillOpacity: 0,
                strokeWeight: 0
              });
          }
         
    });
  };
  function roxbury(feature) {
  map.data.forEach(function (feature) { 
    
      if (feature.getProperty('DISTRICT') != 'Roxbury') {     
          map.data.overrideStyle(feature, {
                fillOpacity: 0,
                strokeWeight: 0
              });
          }
         
    });
  };
  function southboston(feature) {
  map.data.forEach(function (feature) { 
    
      if (feature.getProperty('DISTRICT') != 'South Boston') {     
          map.data.overrideStyle(feature, {
                fillOpacity: 0,
                strokeWeight: 0
              });
          }
         
    });
  };
  function southend(feature) {
  map.data.forEach(function (feature) { 
    
      if (feature.getProperty('DISTRICT') != 'South End') {     
          map.data.overrideStyle(feature, {
                fillOpacity: 0,
                strokeWeight: 0
              });
          }
         
    });
  };
  function westroxbury(feature) {
  map.data.forEach(function (feature) { 
    
      if (feature.getProperty('DISTRICT') != 'West Roxbury') {     
          map.data.overrideStyle(feature, {
                fillOpacity: 0,
                strokeWeight: 0
              });
          }
         
    });
  };

 function parks(feature) {
  map.data.forEach(function (feature) { 
    
      if (feature.getProperty('TypeLong') != 'Parks, Playgrounds & Athletic Fields') {     
          map.data.overrideStyle(feature, {
                fillOpacity: 0,
                strokeWeight: 0
              });
          }
         
    });
  };

 function urban(feature) {
  map.data.forEach(function (feature) { 
    
      if (feature.getProperty('TypeLong') != 'Urban Wilds & Natural Areas') {     
          map.data.overrideStyle(feature, {
                fillOpacity: 0,
                strokeWeight: 0
              });
          }
         
    });
  };

 function parkways(feature) {
  map.data.forEach(function (feature) { 
    
      if (feature.getProperty('TypeLong') != 'Parkways, Reservations & Beaches') {     
          map.data.overrideStyle(feature, {
                fillOpacity: 0,
                strokeWeight: 0
              });
          }
         
    });
  };

 function community(feature) {
  map.data.forEach(function (feature) { 
    
      if (feature.getProperty('TypeLong') != 'Community Gardens') {     
          map.data.overrideStyle(feature, {
                fillOpacity: 0,
                strokeWeight: 0
              });
          }
         
    });
  };

 function malls(feature) {
  map.data.forEach(function (feature) { 
    
      if (feature.getProperty('TypeLong') != 'Malls, Squares & Plazas') {     
          map.data.overrideStyle(feature, {
                fillOpacity: 0,
                strokeWeight: 0
              });
          }
         
    });
  };

 function cemeteries(feature) {
  map.data.forEach(function (feature) { 
    
      if (feature.getProperty('TypeLong') != 'Cemeteries & Burying Grounds') {     
          map.data.overrideStyle(feature, {
                fillOpacity: 0,
                strokeWeight: 0
              });
          }  
    });
  };

function residential(feature) {
  map.data.forEach(function (feature) { 
    
      if (feature.getProperty('ZonAgg') != 'Residential District') {     
          map.data.overrideStyle(feature, {
                fillOpacity: 0,
                strokeWeight: 0
              });
          }  
    });
  };

function open(feature) {
  map.data.forEach(function (feature) { 
    
      if (feature.getProperty('ZonAgg') != 'Open Space District') {     
          map.data.overrideStyle(feature, {
                fillOpacity: 0,
                strokeWeight: 0
              });
          }  
    });
  };

function commercial(feature) {
  map.data.forEach(function (feature) { 
    
      if (feature.getProperty('ZonAgg') != 'Commercial/Office/Business District') {     
          map.data.overrideStyle(feature, {
                fillOpacity: 0,
                strokeWeight: 0
              });
          }  
    });
  };

function special(feature) {
  map.data.forEach(function (feature) { 
    
      if (feature.getProperty('ZonAgg') != 'Special District') {     
          map.data.overrideStyle(feature, {
                fillOpacity: 0,
                strokeWeight: 0
              });
          }  
    });
  };

function industrial(feature) {
  map.data.forEach(function (feature) { 
    
      if (feature.getProperty('ZonAgg') != 'Industrial District') {     
          map.data.overrideStyle(feature, {
                fillOpacity: 0,
                strokeWeight: 0
              });
          }  
    });
  };

function institutional(feature) {
  map.data.forEach(function (feature) { 
    
      if (feature.getProperty('ZonAgg') != 'Institutional District') {     
          map.data.overrideStyle(feature, {
                fillOpacity: 0,
                strokeWeight: 0
              });
          }  
    });
  };

function conservation(feature) {
  map.data.forEach(function (feature) { 
    
      if (feature.getProperty('ZonAgg') != 'Conservation Protection Subdistrict') {     
          map.data.overrideStyle(feature, {
                fillOpacity: 0,
                strokeWeight: 0
              });
          }  
    });
  };


  function reset(feature) {
    map.data.forEach(function (feature) { 
      map.data.revertStyle();
    });
  }


  initMap.allston = allston;
  initMap.dorchester = dorchester;
  initMap.backbay = backbay;
  initMap.centralboston = centralboston;
  initMap.charlestown = charlestown;
  initMap.eastboston = eastboston;
  initMap.fenway = fenway;
  initMap.harborislands = harborislands;
  initMap.hydepark = hydepark;
  initMap.jamaicaplain = jamaicaplain;
  initMap.mattapan = mattapan;
  initMap.roslindale = roslindale;
  initMap.roxbury = roxbury;
  initMap.southboston = southboston;
  initMap.southend = southend;
  initMap.westroxbury = westroxbury;
  initMap.parks = parks;
  initMap.urban = urban;
  initMap.parkways = parkways;
  initMap.community = community;
  initMap.malls = malls;
  initMap.residential = residential;
  initMap.open = open;
  initMap.commercial = commercial;
  initMap.special = special;
  initMap.industrial = industrial;
  initMap.institutional = institutional;
  initMap.conservation = conservation;

  initMap.reset = reset;

}

  // var script = document.createElement('script');
  // script.src = 'data/openspaces.geojson';
  // document.getElementsByTagName('head')[0].appendChild(script);
// window.eqfeed_callback = function(results) {
//        for (var i = 0; i < results.features.length; i++) {
//          var coords = results.features[i].geometry.coordinates[0];
//          console.log(coords[length]);
//          //lat: coords.length[1], lng: coords.length[0]
//          var latLng = new google.maps.LatLng(coords[1],coords[0]);
//          var marker = new google.maps.Marker({
//            position: latLng,
//            map: map
//          });
//        }
//      }

 // window.eqfeed_callback = function(results) {
 //  for (var i = 0; i < results.features.length; i++) {
 //    var coords = results.features[i].geometry.coordinates[0];
 //    var multicoords = results.features[i].geometry.coordinates[0][0];
 //    // var mocoords = coords[length];
 //    // var latcoords = mocoords[1];
 //    // var loncoords = mocoords[0];
 //    // var polcoords = {lat: latcoords, lng: loncoords};
 //    if(results.features[i].geometry.type == "Polygon"){
 //      //var mocoords = coords.length;
 //      var polcoords = [];
      
 //      for (var j = 0; j < coords.length; j++){
 //        var latcoords = coords[j][1];
 //        var loncoords = coords[j][0];
 //        polcoords.push({lat: latcoords, lng: loncoords});
 //      }
    
 //      /*var coords = [
 //      {lat: 42.35018024017816, lng: -71.14740801292824},
 //      {lat: 42.34994329626823, lng: -71.14801432478872},
 //      {lat: 42.35028089080705, lng: -71.1478211477363},
 //      {lat: 42.35018024017816, lng: -71.14740801292824}
 //      ]*/
 //      var latLng = new google.maps.LatLng(coords[1],coords[0]);
 //      var polygon = new google.maps.Polygon({
 //        paths: [polcoords],
 //        strokeColor: '#FF0000',
 //        strokeOpacity: 0.8,
 //        strokeWeight: 1,
 //        fillColor: '#FF0000',
 //        fillOpacity: 0.35
 //        //position: latLng,
 //        //map: map
 //      });
 //      polygon.setMap(map);
 //    }

 //    console.log(park);

 //    if(results.features[i].geometry.type == "MultiPolygon"){
 //          var multipolcoords = [];
 //          for (var j = 0; j < multicoords.length; j++){
 //            var multilatcoords = multicoords[j][1];
 //            var multiloncoords = multicoords[j][0];
 //            multipolcoords.push({lat: multilatcoords, lng: multiloncoords});
 //          }
 //      var multilatLng = new google.maps.LatLng(multicoords[1],multicoords[0]);
 //      var multipolygon = new google.maps.Polygon({
 //        paths: [multipolcoords],
 //        strokeColor: '#FF0000',
 //        strokeOpacity: 0.8,
 //        strokeWeight: 1,
 //        fillColor: '#FF0000',
 //        fillOpacity: 0.35
 //        //position: latLng,
 //        //map: map
 //      });
 //      multipolygon.setMap(map);
 //    }

 //    // document.getElementById('submit').addEventListener('click', function() {
 //    //   geocodeAddress(geocoder, map, infowindow);
 //    // });
 //  }
  // google.maps.event.addListener(polygon, 'remove_at', function() {
  //   console.log('Remove polygon.');
  // });

  // google.maps.event.addDomListener(outer, 'click', function() {
  //   map.setCenter(chicago)
  // });