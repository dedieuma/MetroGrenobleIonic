# MetroGrenobleIonic

install node & npm : 
https://nodejs.org/en/

install ionic :
```npm install -g ionic```

install cordova :
```npm install -g cordova```

install cordova platforms :
```ionic cordova platform add ios android browser```

follow the installation of the ionic google maps :
https://github.com/ionic-team/ionic-native-google-maps/blob/master/documents/README.md
Don't forget to add a folder "consts" inside the resources folder, and add a "apiconsts.ts" with 2 consts exports :
```export const API_KEY_FOR_BROWSER_DEBUG = <your_api_key>```
```export const API_KEY_FOR_BROWSER_RELEASE = = <your_api_key>```
