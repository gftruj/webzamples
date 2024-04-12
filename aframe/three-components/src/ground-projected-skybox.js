import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { GroundProjectedSkybox } from 'three/addons/objects/GroundProjectedSkybox.js';

export const Component = AFRAME.registerComponent("ground-projected-skybox", {
    schema: {
        envMapUrl: {default: ""},
        envMap: {default: ""},
        scale: {default: 100},
    },
    update: async function(oldData) {
        const diff = AFRAME.utils.diff(oldData, this.data);
        if (diff.envMapUrl) {
            console.log("new envMap:", diff.envMapUrl)
            this.cleanup();
            this.skybox = await this.createSkybox(this.data.envMapUrl);  

            const scene = this.el.sceneEl.object3D;
            scene.add( this.skybox );
            scene.environment = this.envMap;
            this.skybox.scale.setScalar( this.data.scale );
        }

        if (diff.scale) {
            this.skybox.scale.setScalar( this.data.scale );
        }
    },
    getLoader(url) {
        if (url.match((/\.(hdr)$/i)))
            return new RGBELoader();
        return new THREE.TextureLoader();
    },
    createSkybox: async function(url) {
        const loader = this.getLoader(url);

        this.envMap = await loader.loadAsync(url);
        this.envMap.mapping = THREE.EquirectangularReflectionMapping;
        return new GroundProjectedSkybox( this.envMap );
    },
    cleanup() {
        const scene = this.el.sceneEl.object3D;
        if (this.skybox) {
            scene.remove(this.skybox);
        }
        if (this.envMap) {
            scene.environment = null;
            this.envMap.dispose();
        }
    },
    remove: function() {
        this.cleanup();
    }
})