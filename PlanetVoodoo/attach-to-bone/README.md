### This component was developed in partnership with [Planet Voodoo® (Voodoo LLC)](https://planetvoodoo.org/) as part of their 'WebXR Wizardry' initiative.
<a href="https://planetvoodoo.org/"> <img src="../media/planet-voodoo.png" height="200" /></a>
<hr>

## attach-to-bone

Attach any a-frame element to a model's bone.

### Usage

Attach the component to any primitive, or gltf model:

    <script src="https://aframe.io/releases/1.2.0/aframe.min.js"></script>
    <script src="https://gftruj.github.io/webzamples/PlanetVoodoo/attach-to-bone/attach-to-bone.js"></script>
    <a-scene>
        <!-- DOG MODEL -->
        <a-entity id="doggo" position="-1 0 -3" scale="0.01 0.01 0.01" gltf-model="#doggo-model" animation-mixer="clip: *shake*" >
        </a-entity>
        <!-- Hat model attached to the 'head' bone -->
        <a-entity scale="0.075 0.075 0.075" gltf-model="#hat-model"
            attach-to-bone="target: #doggo; boneName: head; debug: true; offset: 0 0.12 0">
        </a-entity>
    </a-scene>

<a href="https://gftruj.github.io/webzamples/PlanetVoodoo/attach-to-bone/index.html">Example here</a>

### Properties

| Property        | Default       |  Notes        |
| -------------   |:-------------:|:-------------:|
| target          | ""            | target entity CSS selector      |
| boneName        | ""            | bone name (or part of the name) |
| offset          | "0 0 0"       | Position offset                 |
| rotation        | 0.5           | Rotation bias                   |
| debug           | false         | debug axis helpers              |

