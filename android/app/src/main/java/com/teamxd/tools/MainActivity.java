package com.teamxd.tools;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.res.AssetManager;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.PorterDuff;
import android.graphics.Typeface;
import android.net.Uri;
import android.os.Bundle;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.TextView;

import java.io.IOException;
import java.io.InputStream;

public class MainActivity extends Activity {

    private static final String APP_URL = "https://appassets.androidplatform.net/index.html";
    private static final int NAVY = Color.rgb(2, 9, 7);
    private static final int SLATE = Color.rgb(7, 20, 14);
    private static final int CYAN = Color.rgb(74, 222, 128);
    private static final int MUTED = Color.rgb(148, 163, 184);

    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setStatusBarColor(NAVY);
        getWindow().setNavigationBarColor(NAVY);

        webView = createWebView();

        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setBackgroundColor(NAVY);
        root.addView(createToolbar(), new LinearLayout.LayoutParams(-1, dp(72)));
        root.addView(webView, new LinearLayout.LayoutParams(-1, 0, 1));
        root.addView(createBottomNavigation(), new LinearLayout.LayoutParams(-1, dp(62)));
        setContentView(root);

        webView.loadUrl(APP_URL);
    }

    private WebView createWebView() {
        WebView view = new WebView(this);
        view.setBackgroundColor(NAVY);

        WebSettings settings = view.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        settings.setSupportZoom(true);
        settings.setBuiltInZoomControls(true);
        settings.setDisplayZoomControls(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setUserAgentString(settings.getUserAgentString() + " TeamXDAndroid/2.0");

        view.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView webView, WebResourceRequest request) {
                return loadBundledAsset(request.getUrl());
            }

            @Override
            public WebResourceResponse shouldInterceptRequest(WebView webView, String url) {
                return loadBundledAsset(Uri.parse(url));
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView webView, WebResourceRequest request) {
                return openExternalLink(request.getUrl());
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView webView, String url) {
                return openExternalLink(Uri.parse(url));
            }
        });

        return view;
    }

    private LinearLayout createToolbar() {
        LinearLayout toolbar = new LinearLayout(this);
        toolbar.setGravity(Gravity.CENTER_VERTICAL);
        toolbar.setPadding(dp(18), dp(8), dp(10), dp(8));
        toolbar.setBackgroundColor(SLATE);

        TextView badge = new TextView(this);
        badge.setGravity(Gravity.CENTER);
        badge.setText("TX");
        badge.setTextColor(Color.WHITE);
        badge.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
        badge.setTypeface(Typeface.DEFAULT, Typeface.BOLD);
        badge.setBackgroundColor(Color.rgb(22, 163, 74));
        toolbar.addView(badge, new LinearLayout.LayoutParams(dp(42), dp(42)));

        LinearLayout titles = new LinearLayout(this);
        titles.setOrientation(LinearLayout.VERTICAL);
        titles.setPadding(dp(12), 0, 0, 0);

        TextView title = new TextView(this);
        title.setText("TeamXD Tools");
        title.setTextColor(Color.WHITE);
        title.setTextSize(TypedValue.COMPLEX_UNIT_SP, 17);
        title.setTypeface(Typeface.DEFAULT, Typeface.BOLD);
        titles.addView(title);

        TextView subtitle = new TextView(this);
        subtitle.setText("Offline-ready toolkit");
        subtitle.setTextColor(CYAN);
        subtitle.setTextSize(TypedValue.COMPLEX_UNIT_SP, 11);
        titles.addView(subtitle);

        toolbar.addView(titles, new LinearLayout.LayoutParams(0, -2, 1));
        toolbar.addView(createIconButton(android.R.drawable.ic_popup_sync, "Refresh tools", new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                webView.reload();
            }
        }));
        toolbar.addView(createIconButton(android.R.drawable.ic_menu_share, "Share TeamXD Tools", new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                shareApp();
            }
        }));

        return toolbar;
    }

    private LinearLayout createBottomNavigation() {
        LinearLayout navigation = new LinearLayout(this);
        navigation.setGravity(Gravity.CENTER);
        navigation.setPadding(dp(8), dp(4), dp(8), dp(6));
        navigation.setBackgroundColor(SLATE);

        navigation.addView(createNavigationButton("Home", new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                openRoute("/");
            }
        }), new LinearLayout.LayoutParams(0, -1, 1));
        navigation.addView(createNavigationButton("Explore", new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                openRoute("/category/dev");
            }
        }), new LinearLayout.LayoutParams(0, -1, 1));
        navigation.addView(createNavigationButton("Share", new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                shareApp();
            }
        }), new LinearLayout.LayoutParams(0, -1, 1));

        return navigation;
    }

    private ImageButton createIconButton(int icon, String description, View.OnClickListener listener) {
        ImageButton button = new ImageButton(this);
        button.setImageResource(icon);
        button.setColorFilter(Color.WHITE, PorterDuff.Mode.SRC_IN);
        button.setBackgroundColor(Color.TRANSPARENT);
        button.setContentDescription(description);
        button.setPadding(dp(12), dp(12), dp(12), dp(12));
        button.setOnClickListener(listener);
        return button;
    }

    private Button createNavigationButton(String label, View.OnClickListener listener) {
        Button button = new Button(this);
        button.setText(label);
        button.setTextColor(MUTED);
        button.setTextSize(TypedValue.COMPLEX_UNIT_SP, 12);
        button.setAllCaps(false);
        button.setGravity(Gravity.CENTER);
        button.setBackgroundColor(Color.TRANSPARENT);
        button.setPadding(0, 0, 0, 0);
        button.setOnClickListener(listener);
        return button;
    }

    private void openRoute(String route) {
        webView.loadUrl(APP_URL + "#" + route);
    }

    private void shareApp() {
        Intent shareIntent = new Intent(Intent.ACTION_SEND);
        shareIntent.setType("text/plain");
        shareIntent.putExtra(Intent.EXTRA_SUBJECT, "TeamXD Tools");
        shareIntent.putExtra(Intent.EXTRA_TEXT, "TeamXD Tools — a free offline-ready toolkit for developers, writers, security researchers, and everyday tasks.");
        startActivity(Intent.createChooser(shareIntent, "Share TeamXD Tools"));
    }

    private WebResourceResponse loadBundledAsset(Uri uri) {
        if (!"appassets.androidplatform.net".equals(uri.getHost())) {
            return null;
        }

        String path = uri.getPath();
        String assetPath = path == null || "/".equals(path) ? "index.html" : path.substring(1);
        try {
            AssetManager assets = getAssets();
            InputStream stream = assets.open(assetPath);
            String mimeType = mimeTypeFor(assetPath);
            String encoding = mimeType.startsWith("text/") || "application/javascript".equals(mimeType) ? "UTF-8" : null;
            return new WebResourceResponse(mimeType, encoding, stream);
        } catch (IOException exception) {
            return null;
        }
    }

    private String mimeTypeFor(String path) {
        if (path.endsWith(".html")) return "text/html";
        if (path.endsWith(".css")) return "text/css";
        if (path.endsWith(".js")) return "application/javascript";
        if (path.endsWith(".json")) return "application/json";
        if (path.endsWith(".svg")) return "image/svg+xml";
        if (path.endsWith(".png")) return "image/png";
        if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
        if (path.endsWith(".webp")) return "image/webp";
        if (path.endsWith(".ico")) return "image/x-icon";
        return "application/octet-stream";
    }

    private boolean openExternalLink(Uri uri) {
        String host = uri.getHost();
        if ("appassets.androidplatform.net".equals(host)) {
            return false;
        }

        String scheme = uri.getScheme();
        if (!"http".equalsIgnoreCase(scheme) && !"https".equalsIgnoreCase(scheme)) {
            return false;
        }

        try {
            startActivity(new Intent(Intent.ACTION_VIEW, uri));
            return true;
        } catch (ActivityNotFoundException exception) {
            return false;
        }
    }

    private int dp(int value) {
        return (int) (value * getResources().getDisplayMetrics().density + 0.5f);
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }
}
