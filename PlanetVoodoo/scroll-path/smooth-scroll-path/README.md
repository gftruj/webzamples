### This component was developed in partnership with [Planet Voodoo® (Voodoo LLC)](https://planetvoodoo.org/) as part of their 'WebXR Wizardry' initiative.
<a href="https://planetvoodoo.org/"> <img src="../../media/planet-voodoo.png" height="200" /></a>
<hr>

### smooth-scroll-path component
![scroll-path](https://user-images.githubusercontent.com/17348360/236679581-9a3c398f-436b-41be-9913-a5d820348a75.gif)

Based on the <a href="https://github.com/protyze/aframe-alongpath-component">`along-path` component</a> by Jan Azzati.

Major changes include customizing the curve type between points, and using the <a href="https://idiotwu.github.io/smooth-scrollbar/">smooth-scrollbar</a>.
![scroll-path](assets/showoff.png "scroll-path")

### Differences 

#### a-curve

`a-curve` can now have a `custom` type, so that the points determine the curve type.
`a-curve-point` now have a `type` property which can be set to Spline, CatmullRom, CubicBezier, QuadraticBezier, or Line.
The type needs to be on the first point of the curve, and affects at least:

| Type          | number of points|
| ------------- |:-------------:| 
| Line                | 2    | 
| QuadraticBezier     | 3    |
| CubicBezier         | 4    | 
| CatmullRom, Spline  | at least two. Will use all consecutive points until one has another type specified  | 

Example

      <a-curve type="Custom">
        <!-- There will be a line consisting of this, and the next point -->
        <a-curve-point position="0 1 13" type="Line"></a-curve-point>
        <!-- There will be a line consisting of this, and the next point -->
        <a-curve-point position="0 1 10" type="Line"></a-curve-point>
        <!-- There will be a CatmullRom curve consisting of this, and the rest of the points -->
        <a-curve-point position="0 1 8" type="CatmullRom" toggle-look-at></a-curve-point>
        <a-curve-point position="-2 1 6" ></a-curve-point>
        <a-curve-point position="-5 1 2"></a-curve-point>
      </a-curve>

#### smooth-scroll-path

New property - `scrollableElement` where you have to provide a selector with a scrollable HTML element


### Example

Check it out [here](https://gftruj.github.io/webzamples/PlanetVoodoo/scroll-path/smooth-scroll-path). 

### Credits
Awesome models by <a href="https://sketchfab.com/olmopotums">olmopotums</a><a href="http://creativecommons.org/licenses/by/4.0/">(CC-BY-4.0)</a><br>

