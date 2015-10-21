# File sharing
[JXcore cordova](https://github.com/jxcore/jxcore-cordova) application that shares files between itself and browsers. You just have to navigate to provided url for using it in browser.

![Android](https://raw.githubusercontent.com/karaxuna/file-sharing/master/screens/app.png "Android")
![Browser](https://raw.githubusercontent.com/karaxuna/file-sharing/master/screens/browser.png "Browser")

## Install from [Google Play](https://play.google.com/store/apps/details?id=com.nubisa.file_sharing) or build yourself:

Clone repository:

```bash
git clone https://github.com/karaxuna/file-sharing.git
```

[Download and install JXcore](http://jxcore.com/downloads/). Then install necessary global node modules:

```bash
jx install cordova -g
jx install bower -g
jx install gulp -g
jx install ngpack -g
```

**Fix `ngpack` bug if you are *nix user:**

```bash
sudo apt-get install dos2unix
cd /usr/local/lib/node_modules/ngpack && sudo dos2unix ./**/*
```

Navigate to project root and install local dependencies:

```bash
cd file-sharing
jx install
```

Add cordova platforms:

```bash
cordova platforms add android
cordova platforms add ios
```

[Download](https://github.com/jxcore/jxcore-cordova-release/raw/master/0.0.4/io.jxcore.node.jx) `io.jxcore.node` cordova plugin in the root of project, extract it with jxcore and then add it:

```bash
jx io.jxcore.node.jx
cordova plugins add io.jxcore.node
```

Add other necessary plugins:

```bash
cordova plugins add cordova-plugin-device
cordova plugins add org.apache.cordova.file-transfer
```

Run application:

```bash
gulp android
```
  
This command automatically installs bower packages and node packages for jxcore, builds ngpack and runs cordova on android platform. That's it! You can also run development server (`localhost:8001`) on computer and it will work just like application:

```bash
gulp start
```

It watches for changes in files and performs all necessary steps to rebuild project.
