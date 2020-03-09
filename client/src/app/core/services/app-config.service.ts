import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { empty } from 'rxjs';

interface ConfigData {
  apiUrl: string;
}

// Avaliable anywhere, so you can easily get any property fild defined in ConfigData.
// Keep in mind, general services are loaded before this, so you should not do like:
// readonly someProp: string = AppConfigService.settings.propName;
@Injectable()
export class AppConfigService {

  static settings: ConfigData;

  readonly CONFIG_FILE_PATH: string = 'assets/config/app-config.json';

  constructor(private http: HttpClient ) {}

  public load(): Promise<any> {
    
    return new Promise((resolve, reject) => {
       this.http.get<ConfigData>(this.CONFIG_FILE_PATH)
       .toPromise()
         .then(d =>resolve(d))
         .catch(err => reject(err))
       })
       .then(
         (data: ConfigData) => {        
           AppConfigService.settings = data;
           // console.log(AppConfigService.settings);
         })
       .catch(err => {
         console.log(err);
       });
     
     
   }
}
