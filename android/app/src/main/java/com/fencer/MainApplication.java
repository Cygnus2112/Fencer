package com.fencer;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.oblador.vectoricons.VectorIconsPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.imagepicker.ImagePickerPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import com.airbnb.android.react.maps.MapsPackage;
import fr.greweb.reactnativeviewshot.RNViewShotPackage;
import cl.json.RNSharePackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
//import com.wix.RNCameraKit.RNCameraKitPackage;
import com.github.alinz.reactnativewebviewbridge.WebViewBridgePackage;
import com.surialabs.rn.geofencing.GeoFencingPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new VectorIconsPackage(),
            new RNFetchBlobPackage(),
            new ImageResizerPackage(),
          new ImagePickerPackage(),
          new MapsPackage(),
          new ReactNativeContacts(),
          new RNSharePackage(),
          new RNViewShotPackage(),
          new RCTCameraPackage(),
        //  new RNCameraKitPackage(), 
          new WebViewBridgePackage(),
          new GeoFencingPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }
}
