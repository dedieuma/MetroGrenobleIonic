import { MapProvider } from './../../providers/map/map';
import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Line } from '../../Interfaces/Line';

/**
 * Generated class for the TilesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-tiles',
  templateUrl: 'tiles.html'
})
export class TilesPage {

  transportationType:string;
  lines: Line[];
  constructor(public navCtrl: NavController, public navParams: NavParams, private mapProvider: MapProvider) {
     this.transportationType = navParams.get("transportationType");
  }

  ionViewDidLoad() {
    this.loadTiles();
    
  }

  async loadTiles(){
    this.lines = await this.mapProvider.getLines(this.transportationType);
    
  }

}
