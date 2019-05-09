import { Component, ViewChild, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('gmap') gmapElement: any;
  max = 20;
  min = 1;
  zoomValue = 15; 
  TILE_SIZE = 256;
  isDarkTheme;
  map: google.maps.Map;
  mapProp;
  title = 'google-map';

  ngOnInit(){
     this.mapProp = {
      center: new google.maps.LatLng(8.546814399999999, 76.8790981),
      zoom: this.zoomValue,
      styles: [],
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
        
    if(localStorage.getItem('themeType') == 'dark'){
      this.isDarkTheme = true;
      this.mapProp.styles = JSON.parse(localStorage.getItem('theme'));
    }
    
    this.map = new google.maps.Map(this.gmapElement.nativeElement, this.mapProp);
  }

  zoomLevel(zoomValue){
    this.map.setZoom(zoomValue);
  }

  enableDarkMode(){   
    if(localStorage.getItem('themeType') != null){
      localStorage.clear();
      this.isDarkTheme = false;
      location.reload();
    }else{
      let style = [
        {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
        {
          featureType: 'administrative.locality',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [{color: '#263c3f'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.fill',
          stylers: [{color: '#6b9a76'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{color: '#38414e'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry.stroke',
          stylers: [{color: '#212a37'}]
        },
        {
          featureType: 'road',
          elementType: 'labels.text.fill',
          stylers: [{color: '#9ca5b3'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{color: '#746855'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{color: '#1f2835'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'labels.text.fill',
          stylers: [{color: '#f3d19c'}]
        },
        {
          featureType: 'transit',
          elementType: 'geometry',
          stylers: [{color: '#2f3948'}]
        },
        {
          featureType: 'transit.station',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{color: '#17263c'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{color: '#515c6d'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.stroke',
          stylers: [{color: '#17263c'}]
        }
      ]
      this.isDarkTheme = true;
      localStorage.setItem('theme', JSON.stringify(style));
      localStorage.setItem('themeType', 'dark');
      window.location.reload();
    }
  }

  showPixelAndCoordinates(){
    let coordInfoWindow = new google.maps.InfoWindow();
    coordInfoWindow.setContent(this.createInfoWindowContent(this.mapProp.center, this.map.getZoom()));
    coordInfoWindow.setPosition(this.mapProp.center);
    coordInfoWindow.open(this.map);

    this.mapProp.addListener('zoom_changed', function() {
      coordInfoWindow.setContent(this.createInfoWindowContent(this.mapProp.center, this.map.getZoom()));
      coordInfoWindow.open(this.map);
    });
  }


  createInfoWindowContent(latLng, zoom) {

    var scale = 1 << zoom;

    var worldCoordinate = this.project(latLng);

    var pixelCoordinate = new google.maps.Point(
        Math.floor(worldCoordinate.x * scale),
        Math.floor(worldCoordinate.y * scale));

    var tileCoordinate = new google.maps.Point(
        Math.floor(worldCoordinate.x * scale / this.TILE_SIZE),
        Math.floor(worldCoordinate.y * scale / this.TILE_SIZE));

    return [
      'Accubits Technologies Inc',
      'LatLng: ' + latLng,
      'Zoom level: ' + zoom,
      'World Coordinate: ' + worldCoordinate,
      'Pixel Coordinate: ' + pixelCoordinate,
      'Tile Coordinate: ' + tileCoordinate
    ].join('<br>');
  }

  // The mapping between latitude, longitude and pixels is defined by the web
  // mercator projection.
   project(latLng) {
    var siny = Math.sin(latLng.lat() * Math.PI / 180);

    // Truncating to 0.9999 effectively limits latitude to 89.189. This is
    // about a third of a tile past the edge of the world tile.
    siny = Math.min(Math.max(siny, -0.9999), 0.9999);

    return new google.maps.Point(
        this.TILE_SIZE * (0.5 + latLng.lng() / 360),
        this.TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI)));
  }

  geolocation(){
      // Note: This example requires that you consent to location sharing when
      // prompted by your browser. If you see the error "The Geolocation service
      // failed.", it means you probably did not give permission for the browser to
      // locate you.
      let infoWindow = new google.maps.InfoWindow;
      let map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 8.546814399999999, lng: 76.8790981},
          zoom: 15
      });
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            map.setCenter(pos);
          }, function() {
            this.handleLocationError(true, map, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
           this.handleLocationError(false, map, infoWindow, map.getCenter());
        }
      }

      handleLocationError(browserHasGeolocation, map, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
    }
}
