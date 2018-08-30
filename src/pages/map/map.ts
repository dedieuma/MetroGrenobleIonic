import { Line } from './../../Interfaces/Line';
import { TransportLine } from './../../Interfaces/TransportLine';
import { MapProvider } from './../../providers/map/map';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Alert, LoadingController, Loading } from 'ionic-angular';
import { API_KEY_FOR_BROWSER_DEBUG, API_KEY_FOR_BROWSER_RELEASE } from "../../../resources/consts/apiConsts";

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

  currentTransportLines: TransportLine[];
  tramArray: string[];
  busArray: string[];
  lineChoice: string;
  alert: Alert;
  lines: Line[];
  loading: Loading;
  polyIdTlDictionnary: Map<string, Polyline>;


  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public mapProvider: MapProvider,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController) {

    this.currentTransportLines = [];
    this.polyIdTlDictionnary = new Map();
    this.tramArray = [];
    this.busArray = [];
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  /// Show A Loading on the screen
  showLoading() {

    this.loading = this.loadingCtrl.create({
      content: "Please wait..."
    });

    this.loading.present();

  }

  // Dismiss a loading
  dismissLoading() {
    if (this.loading) {
      this.loading.dismiss();
      this.loading = null;
    }
  }


  // Load the clicked transportation. It can be Tram or Bus. The API returns a huge data which contains both, 
  // we filter the json to get only the desired transportation mode
  async loadTransportation(type: string) {

    let transportationMode;
    let transportationTitle;
    switch (type.toLowerCase()) {
      case "tram":
        transportationMode = "TRAM";
        transportationTitle = 'Choisissez votre Tramway';
        break;
      case "bus":
        transportationMode = "CHRONO";
        transportationTitle = "Choisissez votre Bus";
        break;
    }

    // Calling API to get the lines
    this.showLoading()
    this.lines = await this.mapProvider.getLines();
    this.dismissLoading();

    // Filtering the lines to get only the good transportation mode
    this.lines = this.lines.filter((item) => {
      return item.type == transportationMode;
    }).sort((a, b) => {
      if (a.shortName < b.shortName) return -1;
      else return 1;
    })

    console.log(this.lines);

    // Setting up the alert panel
    this.alert = this.alertCtrl.create();
    this.configureAlert(transportationTitle, transportationMode);
    await this.alert.present();

  }

  /// configures the alert panel, which gives the choice of a line
  // TODO : upgrade this to only load the API line data once
  private configureAlert(transportationTitle: any, transportationMode: any) {
    
    // Title of the alert
    this.alert.setTitle(transportationTitle);

    // Adding all the Inputs. These are multiple inputs
    this.lines.forEach(element => {
      this.alert.addInput({
        type: 'checkbox',
        label: element.shortName,
        value: element.id,
        // if the user has already checked before
        checked: this.isRegisteredInCurrentTL(element)
      });
    });

    // Cancel button
    this.alert.addButton("Annuler");

    // Confirm button
    // At the confirmation, we draw polylines which in parameter the inputs clicked
    this.alert.addButton({
      text: 'Confirmer',
      handler: (data: string[]) => {
        //this.lineChoice = data;
        console.log(data);
        this.drawPolyline(this.setupIdData(data, transportationMode));
      }
    });
  }

  // check if the inputs has already been checked before
  isRegisteredInCurrentTL(line: Line): boolean {

    return this.currentTransportLines.find((tl) => {
      return tl.features[0].properties.id == this.replaceDDotToUnderscore(line.id);
    }) !== undefined
  }

  // This method is useful to save the inputs choice of the concurrent transportation.
  // Explaination : if the user choose a tram when he already chose a bus, we want to save the buses somewhere
  setupIdData(data: string[], transportationMode: string): string[] {
    switch (transportationMode) {
      case "TRAM":
        this.tramArray = [];
        this.tramArray = data;
        break;
      case "CHRONO":
        this.busArray = [];
        this.busArray = data;
        break;
    }
    // given for the drawPolyline parameter
    return this.tramArray.concat(this.busArray);
  }

  

  // drawPolylines of the given id Lines
  async drawPolyline(id: string[]) {

    // show a loading
    this.showLoading();

    // replace the Double dot ':' to an underscore '_'
    // Indeed, the API to get all the lines returns line ids with DDot, like 'SEM:A'
    // The API to get the shapes of one line requires the id with the following format : 'SEM_A'
    this.replaceDDotToUnderscoreArray(id);


    // Remove from the currentTL array all the unchecked inputs
    this.currentTransportLines = this.currentTransportLines.filter((tl) => {
      for (let item of id) {
        tl.features[0].properties.id == item;
      }
    })
    console.log("currentTL", this.currentTransportLines)


    for (let item of id) {

      // Ensure that our Transport lines are not empty
      if (this.currentTransportLines.length == 0) {
        console.log("current line empty");
        let getTl: TransportLine = await this.mapProvider.getTransportLine(item);
        this.currentTransportLines.push(getTl);
        continue;
      }



      // Adding the polyline only if the item is not present into the currentTransportLines
      for (let element of this.currentTransportLines) {
        if (!element.features.find((feature) => {
          console.log(feature.properties.id + " = " + item + " ? "); console.log(feature.properties.id == item);
          return feature.properties.id == item;
        })) {
          console.log("pushing " + item);
          let getTl: TransportLine = await this.mapProvider.getTransportLine(item);
          this.currentTransportLines.push(getTl);

        }
      }

    }


    

    this.map.clear();
    this.polyIdTlDictionnary.clear();

    // Adding all the polylines with options received from the API
    this.currentTransportLines.forEach(element => {

      // Line shape of the TransportLine
      let coordinates: ILatLng[] = Encoding.decodePath(element.features[0].properties.shape[0]);

      // RGB Number of the drawing line
      let lineColor: number[] = element.features[0].properties.COULEUR.split(',').map(Number);


      this.map.addPolyline({
        points: coordinates,
        // color:this.tl.features[0].properties.COULEUR,
        color: this.rgbToHex(lineColor[0], lineColor[1], lineColor[2]),
        width: 3,
        geodesic: true,
  
      }).then((polyline) => {
        this.polyIdTlDictionnary.set(element.features[0].properties.id, polyline);
      })
    });

    this.dismissLoading();

    console.log("currentTL", this.currentTransportLines);
    console.log("current dictionnary", this.polyIdTlDictionnary);
  }




  // Initialize the Google Map
  // The Google Map is linked to the html div #map_canvas
  loadMap() {
    Environment.setEnv({
      'API_KEY_FOR_BROWSER_DEBUG': API_KEY_FOR_BROWSER_DEBUG,
      'API_KEY_FOR_BROWSER_RELEASE': API_KEY_FOR_BROWSER_RELEASE
    })

    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: 45.187638, // Grenoble position
          lng: 5.722743
        },
        zoom: 14,
        tilt: 30
      }
    };


    this.map = GoogleMaps.create('map_canvas', mapOptions);



  }

  onMarker(marker: Marker) {
    marker.one(GoogleMapsEvent.MARKER_CLICK).then(() => {
      alert("click !");
    })
  }



  
  // Converts the 3 parameter number into an #RGB string
  rgbToHex(r, g, b) : string {
    function componentToHex(c) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    }
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

  replaceDDotToUnderscore(str: string) {
    return str.replace(":", "_");
  }

  private replaceDDotToUnderscoreArray(id: string[]) {
    for (let i = 0; i < id.length; i++) {
      id[i] = id[i].replace(/:/g, "_");
    }
  }


}

