import { TransportLine } from './../../Interfaces/TransportLine';
import { MapProvider } from './../../providers/map/map';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {API_KEY_FOR_BROWSER_DEBUG, API_KEY_FOR_BROWSER_RELEASE} from "../../../resources/consts/apiConsts";

import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  Environment,
  Encoding,
  ILatLng,
  Polyline
} from '@ionic-native/google-maps';

declare var google;
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {

  map: GoogleMap;
  
  tl: TransportLine;
  lineChoice: string;
  

  constructor(public navCtrl: NavController, public navParams: NavParams, public mapProvider: MapProvider, public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  selectTram(){
    let alert = this.alertCtrl.create();
    alert.setTitle('Choisissez votre Tramway'),

    alert.addInput({
      type: 'radio',
      label: 'A',
      value:'A'
    });

    alert.addInput({
      type: 'radio',
      label: 'B',
      value: 'B'
    });

    alert.addInput({
      type: 'radio',
      label: 'C',
      value: 'C'
    })

    alert.addInput({
      type: 'radio',
      label: 'D',
      value: 'D'
    })

    alert.addInput({
      type: 'radio',
      label: 'E',
      value: 'E'
    });

    alert.addButton("Annuler");
    alert.addButton({
      text: 'Confirmer',
      handler: (data:any) => {
        this.lineChoice = data;
        console.log(this.lineChoice);
      }
    });

    alert.present();
  }

  async loadMap() {
    Environment.setEnv({
      'API_KEY_FOR_BROWSER_DEBUG': API_KEY_FOR_BROWSER_DEBUG,
      'API_KEY_FOR_BROWSER_RELEASE': API_KEY_FOR_BROWSER_RELEASE
    })

    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: 45.187638,
          lng: 5.722743
        },
        zoom: 10,
        tilt: 30
      }
    };

    this.map = GoogleMaps.create('map_canvas', mapOptions);

    this.tl = await this.mapProvider.getMapTest();
    console.log(this.tl)
    
    let coordinates: ILatLng[] = Encoding.decodePath(this.tl.features[0].properties.shape[0]);
    console.log(coordinates);

    let polyline: Polyline = this.map.addPolylineSync({
      points: coordinates,
      color:this.tl.features[0].properties.COULEUR,
      width: 3,
      geodesic: true
    })

    



  }

  onMarker(marker: Marker) {
    marker.one(GoogleMapsEvent.MARKER_CLICK).then(() => {
      alert("click !");
    })
  }

}

