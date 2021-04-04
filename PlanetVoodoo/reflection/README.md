### This component was developed in partnership with [Planet Voodoo® (Voodoo LLC)](https://planetvoodoo.org/) as part of their 'WebXR Wizardry' initiative.
<a href="https://planetvoodoo.org/"> <img src="../media/planet-voodoo.png" height="200" /></a>
<hr>



### phong-reflector component

Based on the `THREE.Reflector`, but using `MeshPhongMaterial`:



#### usage

    <!-- attach the scripts -->
    <script src="https://aframe.io/releases/1.2.0/aframe.min.js"></script>
    <script src="https://gftruj.github.io/webzamples/PlanetVoodoo/reflection/dist/phong-reflector-component.js"></script>
    <a-scene>
        <!-- Attach the component to an element -->
         <a-plane position="2 0 0" phong-reflector="src: assets/aframe/aframe_cut256.jpg;
            normalMap: assets/maps/NormalMap.png; ambient-occlusion-map: assets/maps/ao.png; blendingIntensity: 0.75;">
         </a-plane>
    </a-scene>


#### Example
Check it out working [here](https://gftruj.github.io/webzamples/PlanetVoodoo/reflection/phong_reflector.html) with applied texture, normal maps, ambient occlusion maps, and displacement maps (on the left):
<hr>

![phong-reflection](./../media/phong-reflection.gif "phong-reflection")

#### properties

| Property                  | Description               | Default |
| -------------             |:-------------:            | -----:  |
| color                     | material color            | #FFFFFF |
| src                       | texture(image)            |   ""    |
| normalMap                 | normal map path           |   ""    |
| ambientOcclusionMap       | ao map path               |   ""    |
| ambientOcclusionIntensity | ao intensity              |   1     |
| displacementMap           | displacement map path     |   ""    |
| displacementBias          | displacement map offset   |   0     |
| blendingIntensity         | ranging from 1 to 0: 1 displays a mix of color*texture and reflection, 0 - sole reflection                  |   1     |
| reflectionTextureWidth    | reflection texture witdth |   512   |
| reflectionTextureHeight   | reflection texture height |   512   |
| useWindowDimensions       | override texture dimensions with the window size                  |   true  |
| clipBias                  | projection clipping bias  |   0 |

### Other components
#### aframe-mirror
The `Ashok.GroundSceneReflector`, and `aframe-mirror` component which are created by [aalavandhaann](https://github.com/aalavandhaann/three_reflector).
The source files are modified (renderer warnings etc.), you can use them as intended:

    <script src="https://gftruj.github.io/webzamples/PlanetVoodoo/reflection/src/ashok_reflector.js">
    <a-scene>
      <a-plane aframe-mirror></a-plane>
    </a-scene>

#### Pure (ish) THREE.Reflector

a-frame wrapper around the `THREE.Reflector` object.
Usage:

    <script src="https://gftruj.github.io/webzamples/PlanetVoodoo/reflection/dist/reflector-component.js">
    <a-scene>
        <a-plane reflector="clipBias: 0; useWindowDimensions: true"></a-plane>
    </a-scene>
    
#### Example

Both components are used in [this example](https://gftruj.github.io/webzamples/PlanetVoodoo/reflection/reflector_and_ashok.html):
<hr>

![Reflections](./../media/mirrors.gif "mirrors")
