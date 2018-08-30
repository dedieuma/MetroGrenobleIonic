import { Line } from './../../Interfaces/Line';
import { TransportLine } from './../../Interfaces/TransportLine';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

/*
  Generated class for the MapProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MapProvider {

  constructor(public http: HttpClient, public loadingCtrl: LoadingController) {

    
    
  }

  async getLines() : Promise<Line[]> {
    let url = "https://data.metromobilite.fr/api/routers/default/index/routes";
    console.log("Asking "+url+"...");
    const response = await this.http.get<Line[]>(url);
    return response.toPromise();
  }

  async getTransportLine(id: string) : Promise<TransportLine>{
    let url = "https://data.metromobilite.fr/api/lines/poly?types=ligne&codes="+id;
    console.log("Asking "+url+"...");
    const response = await this.http.get<TransportLine>(url);
    return response.toPromise();
  }



  

}
