### This component was developed in partnership with [Planet Voodoo® (Voodoo LLC)](https://planetvoodoo.org/) as part of their 'WebXR Wizardry' initiative.
<a href="https://planetvoodoo.org/"> <img src="../media/planet-voodoo.png" height="200" /></a>
<hr>

### scroll-path component
![scroll-path](media/scroll-path.gif "scroll-path")

Based on the <a href="https://github.com/protyze/aframe-alongpath-component">`along-path` component</a> by Jan Azzati.

The component should behave in a similar manner, but is controlled with the mouse wheel, or swiping on a mobile device.
Minor *aframe-curve* changes include working with a line with more than 2 points.
Minor *along-path* changes include smooth rotation changes, trigger debugging, ofc working with a mousewheel, or touch events.

### Example

Check it out [here](https://gftruj.github.io/webzamples/PlanetVoodoo/scroll-path).

### Usage

    <script src="https://rawgit.com/aframevr/aframe/master/dist/aframe-master.min.js"></script>
    <!-- the curve component is necessary - my version has some minor changes -->
    <script src="https://gftruj.github.io/webzamples/PlanetVoodoo/scroll-path/aframe-curve-component.js"></script>
    <script src="https://gftruj.github.io/webzamples/PlanetVoodoo/scroll-path/scroll-path.js"></script>

    <a-scene>
      <!-- define a curve -->
      <a-curve id="track1">
        <a-curve-point position="-2 2 -3"></a-curve-point>
        <a-curve-point position="0 1 -3"></a-curve-point>
        <a-curve-point position="2 2 -3"></a-curve-point>
      </a-curve>
      
      <!-- attach the component -->
      <a-box scroll-path="curve: #track1"></a-box>
    </a-scene>
  

### Properties

Most of the properties are "inherited" from the original

| Property | Description                                                                          | Default Value |
| -------- | -----------                                                                          | ------------- |
| curve    | Selector to reference to the corresponding [curve](https://github.com/protyze/aframe-curve-component) | ''            |
| triggers   | Selector to identify the Trigger-Points that should fire the alongpath-trigger-activated-Event when the entity moves close to it.                               | 'a-curve-point'         |
| triggerRadius   | Defines how close the entity should be to the Trigger-Point to activate it. If 0 - trigger proximity logic is cut off.   | 0.01         |
| debugTriggers  | create / remove spheres corresponding to the trigger size / position           | false         |
| dur      | Duration in milliseconds for the object to follow the entire path                    | 1000          |
| loop     | Whether or not the animation should loop                                             | false         |
| rotate   | Whether or not the Entity should adjust it's rotation while moving along the path    | false         |
| smoothRotation   | Whether we want to slerp the rotation, or snap it.                           | false         |
| resetonplay   | Whether or not the Movement on the path should be reset on the play event       | true          |
| speed    | The speed applied on each "mousewheel" impulse                                       | 10            |
| damping  | "Stopping" force factor                                                              | 0.9           |

### Events

| Event    | Description                                                 |
| -------- | -----------                                                 |
| alongpath-trigger-activated   | The Entity has activated a Trigger-Point (Fired on the corresponding 'curve-point') |
| alongpath-trigger-deactivated   | The Entity has deactivated a Trigger-Point (Fired on the corresponding 'curve-point')          |

### Events different than the mousewheel?

You can manually call `updateCurve(dir)` - the value does not matter, just positive or negative values. 

