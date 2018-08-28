import { TransportLine } from './../../Interfaces/TransportLine';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the MapProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MapProvider {

  constructor(public http: HttpClient) {
    
  }

  async getMapTest() : Promise<TransportLine>{
    const response = await this.http.get<TransportLine>("https://data.metromobilite.fr/api/lines/poly?types=ligne&codes=SEM_C1");
    return response.toPromise();
  }

}
