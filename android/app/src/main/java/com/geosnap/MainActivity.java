package com.geosnap;

import com.facebook.react.ReactActivity;
//import com.rt2zz.reactnativecontacts.ReactNativeContacts;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    // this may not be correct ...

    // @Override
    // protected List<ReactPackage> getPackages() {
    //   return Arrays.<ReactPackage>asList(
    //     new MainReactPackage(),
    //     new ReactNativeContacts()   // <--- and add package
    //   );
    // }

    // end possibly incorrect portion

    @Override
    protected String getMainComponentName() {
        return "GeoSnap";
    }
}
