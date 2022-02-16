## oculus-thumbstick-controls

Saw multiple questions about moving with thumbsticks in VR 
(like [this](https://stackoverflow.com/questions/71131300/cant-move-camera-in-a-frame-with-oculus-quest-2), 
or [this](https://stackoverflow.com/questions/70970650/how-can-i-control-a-frame-movement-with-oculus-quests-trackpad)) so I thought this is a good opportunity to re-use 99% 
of the [wasd-controls](https://aframe.io/docs/1.3.0/components/wasd-controls.html) and use the input from the thumbsticks

### example

Check it out [here](https://gftruj.github.io/webzamples/aframe/controls/oculus-thumbstick-controls.html)([source](https://github.com/gftruj/webzamples/blob/master/aframe/controls/oculus-thumbstick-controls.html)):
- https://gftruj.github.io/webzamples/aframe/controls/oculus-thumbstick-controls.html

### Usage:

It needs a RIG wrapper around the camera and hands.

    <script src="https://aframe.io/releases/1.3.0/aframe.min.js"></script>
    <script src="https://gftruj.github.io/webzamples/aframe/controls/oculus-thumbstick-controls.js"></script>
    <a-scene>
        <!-- Camera + controllers rig -->
        <a-entity id="rig">
            <a-camera position="0 1.6 0"></a-camera>
            <a-entity oculus-touch-controls="hand: left" ></a-entity>
            <a-entity oculus-touch-controls="hand: right" oculus-thumbstick-controls></a-entity>
        </a-entity>
    </a-scene>

### Properties:

Exactly the same as the [wasd-controls](https://aframe.io/docs/1.3.0/components/wasd-controls.html) + the rig selector:

| Property     | Description                                                              | Default Value |
|--------------|--------------------------------------------------------------------------|---------------|
| rigSelector  | The camera and controllers rig wrapper element       .                   | "#rig"        |
| acceleration | How fast the entity accelerates when holding the keys.                   | 45            |
| adAxis       | Axis that the horizontal values act upon                                 | x             |
| adInverted   | Whether the axis that the horizontal axis should be inverted.            | false         |
| enabled      | Whether the WASD controls are enabled.                                   | true          |
| fly          | Whether or not movement is restricted to the entity's initial plane.     | false         |
| wsAxis       | Axis that the vertical values act upon.                                  | z             |
| wsInverted   | Whether the axis that the vertical axis should be inverted.              | false         |

### See You around

If you like it feel free to use it. If you think it COULD be useful - feel free to file an issue with an idea.
