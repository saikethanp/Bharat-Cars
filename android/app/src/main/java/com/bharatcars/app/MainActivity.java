package com.bharatcars.app;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onStart() {
        super.onStart();
        WebView webView = getBridge().getWebView();
        if (webView != null) {
            WebSettings settings = webView.getSettings();
            settings.setDomStorageEnabled(true);
            settings.setJavaScriptEnabled(true);
            settings.setDatabaseEnabled(true);
            
            // Hardware acceleration
            webView.setLayerType(android.view.View.LAYER_TYPE_HARDWARE, null);
            
            // Disable overscroll/pull to refresh effect
            webView.setOverScrollMode(android.view.View.OVER_SCROLL_NEVER);
        }
    }
}
