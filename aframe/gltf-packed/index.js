import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { KTX2Loader } from './node_modules/three/examples/jsm/loaders/KTX2Loader.js';
import { DRACOLoader } from './node_modules/three/examples/jsm/loaders/DRACOLoader.js';

module.exports.component = AFRAME.registerComponent("full-gltf-model", {
    schema: {type: 'model'},
    init: function () {
        const renderer = this.el.sceneEl.renderer
        // Instantiate a loader
        this.loader = new GLTFLoader()
            .setCrossOrigin('anonymous')
            .setDRACOLoader(new DRACOLoader().setDecoderPath('./wasm/'))
            .setKTX2Loader(new KTX2Loader().detectSupport(renderer));
        this.model = null;
    },
    update() {
        var self = this;
        var el = this.el;
        var src = this.data;

        if (!src) { return; }
        this.remove();
        // Load a glTF resource
        this.loader.load(
            // resource URL
            src,
            // called when the resource is loaded
            function gltfLoaded(gltfModel) {
                self.model = gltfModel.scene || gltfModel.scenes[0];
                self.model.animations = gltfModel.animations;
                el.setObject3D('mesh', self.model);
                el.emit('model-loaded', { format: 'gltf', model: self.model });
            }, undefined /* onProgress */,
            function gltfFailed(error) {
                var message = (error && error.message) ? error.message : 'Failed to load glTF model';
                console.warn(message);
                el.emit('model-error', { format: 'gltf', src: src });
            });
    },
    remove: function () {
        if (!this.model) { return; }
        this.el.removeObject3D('mesh');
    }
});