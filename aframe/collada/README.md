## collada-model component

Three.js loader wrapped into a component. To use it load the script, and use the `collada-model` component:

    <script src="https://aframe.io/releases/1.2.0/aframe.min.js"></script>
    <script src="https://gftruj.github.io/webzamples/aframe/collada/dist/collada-model.js"></script>
    <a-scene>
      <a-assets>
        <a-asset-item id="model" src="collada_model_path"></a-asset-item> 
      </a-assets>
      <a-entity collada-model="src: #model"></a-entity
    </a-scene>
    
Works with the aframe-extras animation component. There is an example [here](https://gftruj.github.io/webzamples/aframe/collada/)
