# Hero implant render

The implant on the home page is a 3D model built in code (three.js): a threaded tapered implant, a gold abutment and a lower-molar crown. Each part is rendered as its own transparent layer from the same camera, so the page can animate them settling into place.

To re-render, serve this folder with any local web server and open `index.html` with the settings used for the site:

```
?w=1000&h=2200&mode=export&elev=26&crownTilt=16&crownYaw=-20&fill=0.3&cc=0.35&aoGroove=1.4&crownScale=0.93&crColor=%23efe8da&cerv=0.55&cervPow=0.8&crEnv=0.35&key=3.4&kx=-10&kyy=8&kz=5
```

With `mode=export`, `window.__layers` holds a PNG data URL for `crown`, `abutment`, `fixture` and `all`. The site files in `site-root/img/` are those layers cropped to the box `left 195, top 189, width 628, height 1740` and resized to 520 px wide WebP. `abut=ti` swaps the gold abutment for plain titanium.
