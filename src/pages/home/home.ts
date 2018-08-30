import { MapPage } from './../map/map';
import { ListPage } from './../list/list';
import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public menu: MenuController) {

  }

  toMap(){
    this.navCtrl.setRoot(MapPage);
  }

}
