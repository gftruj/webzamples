### This component was developed in partnership with [Planet Voodoo® (Voodoo LLC)](https://planetvoodoo.org/) as part of their 'WebXR Wizardry' initiative.
<a href="https://planetvoodoo.org/"> <img src="../media/planet-voodoo.png" height="200" /></a>
<hr>

### model-to-particles

The component creates a particle for each vertice in a skinned mesh. 

#### usage

    <script src="https://gftruj.github.io/webzamples/PlanetVoodoo/model-to-particles/model-to-particles.js"></script>
    <a-scene>
      <a-entity gltf-model="./model.gltf" model-to-particles></a-entity>
    </a-scene>
  
#### properties

| Property      | default       |
| ------------- |:-------------:| 
| color         | 0xff0000      | 
| particleSize  | 0.01          | 
| showModel     | false         | 


#### Example

The component is used with models with both indexed and non-indexed geometries in [this example](https://gftruj.github.io/webzamples/PlanetVoodoo/model-to-particles):
<hr>

![stormtroopers](./../media/stormtroopers.gif "stormtroopers")

### particle-model

Loads the model, creates its own skinned mesh, and uses it instead.

#### Usage

1. Import the script, 
2. add the component,
3. point to the model asset

    <script src="https://aframe.io/releases/1.2.0/aframe.min.js"></script>
    <script src="https://gftruj.github.io/webzamples/PlanetVoodoo/model-to-particles/lib/animationmixer.js"></script>
    <script src="particle-model-full.js"></script>
    <a-scene>
        <a-assets>
          <a-asset-item id="stormtrooper-model" src="https://gftruj.github.io/webzamples/PlanetVoodoo/model-to-particles/assets/stormtrooper/stormtrooper.dae"></a-asset-item>
        </a-assets>
       <a-entity position="-2 0 -8" particle-model="src: #stormtrooper-model; scatter: true" scale="0.8 0.8 0.8" animation-mixer></a-entity>
    </a-scene>

**Properties**

| name          | description    | default  |
| ------------- |:-------------: | -----:|
| src           | asset selector |  "" |
| scatter       | whether the points should be scattered       |  false |
| scatterCount  | particle count                               |  5000 |
| color         | particle color |  0xff0000 |

Emits the `model-loaded` like other loaders - which can be used by other components, like the `animation-mixer`.
        
#### Example

[gltf models](https://gftruj.github.io/webzamples/PlanetVoodoo/model-to-particles/gltf.html), and [collada models](https://gftruj.github.io/webzamples/PlanetVoodoo/model-to-particles/collada.html):

![stormtroopers](https://imgur.com/a/VJQMUM0 "stormtroopers")
Left to right - scattered points, points at vertices positions, original model.
