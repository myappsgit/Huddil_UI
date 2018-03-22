"use strict";
//exports.__esModule = true;

var nearMap;
var infowindowNearBy;
var serviceNearBy;
var initMapJS = function() {
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDrlBEqYx1JbWnuIkxG0xMbzr5dqkj6ngI&libraries=places';
        var ss = document.getElementsByTagName('script')[0];
        ss.parentNode.insertBefore(s, ss);

    }
    // var loadMap = function() {

//     var newLat, newLong;
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(function(p) {
//             newLat = p.coords.latitude,
//                 newLong = p.coords.longitude;
//             generateMap(newLat, newLong);

//         }, function(er) {


//             newLat = 12.9538477;
//             newLong = 77.3507442;
//             generateMap(newLat, newLong);
//         });
//     } else {
//         alert('Geo Location feature is not supported in this browser.');
//     }
// }
var gps_search = function() {

    //set current gps

    var newLat, newLong;
    jQuery.post("https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyDrlBEqYx1JbWnuIkxG0xMbzr5dqkj6ngI", function(success) {
        newLat = success.location.lat,
            newLong = success.location.lng;
    }).done(function() {
        var map = new google.maps.Map(document.getElementById('dvMap'), {
            center: { lat: newLat, lng: newLong },
            zoom: 13,
            fullscreenControl: false
        });
        var card = document.getElementById('pac-card');
        var input = document.getElementById('pac-input');


        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

        var autocomplete = new google.maps.places.Autocomplete(input);

        // Bind the map's bounds (viewport) property to the autocomplete object,
        // so that the autocomplete requests use the current map bounds for the
        // bounds option in the request.
        autocomplete.bindTo('bounds', map);

        var infowindow = new google.maps.InfoWindow();
        var geocoder = geocoder = new google.maps.Geocoder();
        var infowindowContent = document.getElementById('infowindow-content');
        infowindow.setContent(infowindowContent);
        var marker = new google.maps.Marker({
            map: map,
            anchorPoint: new google.maps.Point(0, -29),
            draggable: true
        });


        autocomplete.addListener('place_changed', function() {
            infowindow.close();
            marker.setVisible(false);
            var place = autocomplete.getPlace();

            if (!place.geometry) {
                // User entered the name of a Place that was not suggested and
                // pressed the Enter key, or the Place Details request failed.
                window.alert("No details available for input: '" + place.name + "'");
                return;
            }

            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
            } else {
                map.setCenter(place.geometry.location);
                map.setZoom(17); // Why 17? Because it looks good.
            }
            marker.setPosition(place.geometry.location);
            marker.setVisible(true);

            geocoder.geocode({ 'latLng': marker.getPosition() }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    document.getElementById('input_gps').value = marker.getPosition().lat() + ',' + marker.getPosition().lng();

                }
            });
        });
        google.maps.event.addListener(marker, "dragend", function(e) {

            var lat, lng, address;
            geocoder.geocode({ 'latLng': marker.getPosition() }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {

                    lat = marker.getPosition().lat();
                    lng = marker.getPosition().lng();
                    address = results[0].formatted_address;
                    document.getElementById('input_gps').value = lat + ',' + lng;
                    //alert("Latitude: " + lat + "\nLongitude: " + lng + '--address-' + address);
                }
            });
        });
        // Sets a listener on a radio button to change the filter type on Places
        // Autocomplete.
        // function setupClickListener(id, types) {
        //     var radioButton = document.getElementById(id);
        //     radioButton.addEventListener('click', function() {
        //         autocomplete.setTypes(types);
        //     });
        // }

        // setupClickListener('changetype-all', []);
        // setupClickListener('changetype-address', ['address']);
        // setupClickListener('changetype-establishment', ['establishment']);
        // setupClickListener('changetype-geocode', ['geocode']);

        // document.getElementById('use-strict-bounds')
        //     .addEventListener('click', function() {
        //         console.log('Checkbox clicked! New state=' + this.checked);
        //         autocomplete.setOptions({ strictBounds: this.checked });
        //     });
    }).fail(function(err) {
        newLat = 12.9538477;
        newLong = 77.3507442;

    });



}
var loadMap = function() {
    var newLat, newLong;
    jQuery.post("https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyDrlBEqYx1JbWnuIkxG0xMbzr5dqkj6ngI", function(success) {
        newLat = success.location.lat, newLong = success.location.lng;
        generateMap(newLat, newLong);
    }).fail(function(err) {
        newLat = 12.9538477;
        newLong = 77.3507442;
        generateMap(newLat, newLong);
    });
}
var generateMap = function(latitude, longitude) {

    var markers = [{
        "title": 'banglore',
        "lat": latitude,
        "lng": longitude,
        "description": 'Banglore'
    }];
    var LatLng = new google.maps.LatLng(latitude, longitude);
    var mapOptions = {
        center: LatLng,
        maxZoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var infoWindow = new google.maps.InfoWindow();
    var latlngbounds = new google.maps.LatLngBounds();
    var geocoder = geocoder = new google.maps.Geocoder();
    var map = new google.maps.Map(document.getElementById("dvMap"), mapOptions);
    for (var i = 0; i < markers.length; i++) {
        var data = markers[i]
        var myLatlng = new google.maps.LatLng(data.lat, data.lng);
        var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            title: data.title,
            draggable: true,
            animation: google.maps.Animation.DROP
        });
        (function(marker, data) {
            google.maps.event.addListener(marker, "click", function(e) {
                infoWindow.setContent(data.description);
                infoWindow.open(map, marker);
            });
            google.maps.event.addListener(marker, "dragend", function(e) {
                var lat, lng, address;
                geocoder.geocode({ 'latLng': marker.getPosition() }, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        lat = marker.getPosition().lat();
                        lng = marker.getPosition().lng();
                        address = results[0].formatted_address;
                        document.getElementById('input_gps').value = lat + ',' + lng;
                        //alert("Latitude: " + lat + "\nLongitude: " + lng + '--address-' + address);
                    }
                });
            });
        })(marker, data);
        latlngbounds.extend(marker.position);
    }

    var bounds = new google.maps.LatLngBounds();
    map.setCenter(latlngbounds.getCenter());
    map.fitBounds(latlngbounds);
}
var createConsumerMap = function(latitude, longitude, title, address) {

    var markers = [{
        "title": title,
        "lat": latitude,
        "lng": longitude,
        "description": address
    }];
    var LatLng = new google.maps.LatLng(latitude, longitude);
    var mapOptions = {
        center: LatLng,
        maxZoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var infoWindow = new google.maps.InfoWindow();
    var latlngbounds = new google.maps.LatLngBounds();
    var geocoder = geocoder = new google.maps.Geocoder();

    var map = new google.maps.Map(document.getElementById("consumerMap"), mapOptions);

    for (var i = 0; i < markers.length; i++) {
        var data = markers[i]
        var myLatlng = new google.maps.LatLng(data.lat, data.lng);
        var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            title: data.title,
            draggable: false,
            animation: google.maps.Animation.DROP
        });
        (function(marker, data) {
            google.maps.event.addListener(marker, "click", function(e) {
                infoWindow.setContent(data.title + "," + data.description);
                infoWindow.open(map, marker);
            });

        })(marker, data);
        latlngbounds.extend(marker.position);
    }

    var bounds = new google.maps.LatLngBounds();
    map.setCenter(latlngbounds.getCenter());
    map.fitBounds(latlngbounds);
}
var getNearBy = function(latitude, longitude, type, title, address) {

    var pyrmont = { lat: latitude, lng: longitude };

    nearMap = new google.maps.Map(document.getElementById('consumerMap'), {
        center: pyrmont,
        zoom: 15
    });

    //default marker

    var myLatlng1 = new google.maps.LatLng(latitude, longitude);
    var pinImage1 = new google.maps.MarkerImage("http://www.googlemapsmarkers.com/v1/009900/");
    var marker1 = new google.maps.Marker({
        map: nearMap,
        position: myLatlng1,
        title: title,
        draggable: false,
        icon: pinImage1,
        animation: google.maps.Animation.DROP
    });

    google.maps.event.addListener(marker1, 'click', function() {
        infowindowNearBy.setContent(address);
        infowindowNearBy.open(nearMap, this);
    });

    infowindowNearBy = new google.maps.InfoWindow();
    serviceNearBy = new google.maps.places.PlacesService(nearMap);
    if (type != "none") {
        serviceNearBy.nearbySearch({
            location: pyrmont,
            radius: 1000,
            type: [type]
        }, callback);
    }

}
var callback = function(results, status) {

    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    }

}
var createMarker = function(place) {

    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: nearMap,
        position: place.geometry.location
    });

    google.maps.event.addListener(marker, 'click', function() {
        infowindowNearBy.setContent(place.name);
        infowindowNearBy.open(nearMap, this);
    });
}

exports.initMapJS = initMapJS;
exports.gps_search = gps_search;
exports.loadMap = loadMap;
exports.createConsumerMap = createConsumerMap;
exports.getNearBy = getNearBy;