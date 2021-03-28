AFRAME.registerComponent("apply-envmap", {
    init: function () {
        const textureLoader = new THREE.TextureLoader();
        textureEquirec = textureLoader.load('assets/reflected_image/stpeters_probe.jpg');
        textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
        textureEquirec.encoding = THREE.sRGBEncoding;

        // Textures
        this.el.addEventListener("model-loaded", e => {
            const mesh = this.el.getObject3D("mesh");

            mesh.traverse(node => {
                if (node.material) {
                    node.material.envMap = textureEquirec
                    node.material.needsUpdate = true
                }
            });
        })
    }
})