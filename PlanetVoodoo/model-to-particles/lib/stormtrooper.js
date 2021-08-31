AFRAME.registerComponent("collada-storm-trooper", {
    init: function () {
        const el = this.el;
        const loader = new THREE.ColladaLoader();
        this.mixer = null;

        loader.load(
            "https://gftruj.github.io/webzamples/PlanetVoodoo/model-to-particles/assets/stormtrooper/stormtrooper.dae",
            collada => {
                var animations = collada.animations;
                var root = collada.scene;
                var clip = animations[0];
                el.setObject3D('mesh', root);
                this.skinnedMesh = root.getObjectByName("Stormtrooper");
                root.traverse(function (node) {
                    if (node.isSkinnedMesh) {
                        node.frustumCulled = false;
                    }
                });
                this.mixer = new THREE.AnimationMixer(root);
                var action = this.mixer.clipAction(clip).play();
                this.el.object3D.add(root);
                this.el.emit("model-loaded")
            }
        );
    },
    tick: function (t, dt) {
        if (!this.mixer) return;
        this.mixer.update(dt / 1000);
    }
});
