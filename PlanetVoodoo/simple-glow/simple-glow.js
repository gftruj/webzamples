AFRAME.registerComponent("simple-glow", {
    schema: {
        geometry: { default: "Box", oneOf: ["Box", "Plane"]},
        glowTexture: { default: "" },
        presetTexture: { default: "sphere", oneOf: ["", "sphere", "half-sphere", "star"] },
        color: { type: "color", default: "#0ff" },
        intensity: { default: 0.5 }
    },
    init: function () {
        this.loader = new THREE.TextureLoader();
        var material = new THREE.MeshBasicMaterial(
            {
                color: this.data.color,
                blending: THREE.AdditiveBlending,
                map: this.loader.load(this.data.glowTexture),
                opacity: this.data.intensity,
                transparent: true
            });
        var geometry;
        if (this.data.geometry === "Box"){
            geometry = new THREE.BoxGeometry(1, 1, 1);
        } else {
            geometry = new THREE.PlaneGeometry(1, 1);
        } 
        var mesh = new THREE.Mesh(geometry, material);
        this.el.object3D.add(mesh);
        this.mesh = mesh
    },
    tick: function () {
        const cam = this.el.sceneEl.camera;
        if (!this.mesh || !cam) return;

        this.mesh.lookAt(cam.el.object3D.position);

    },
    update: function (oldData) {
        return
        const changes = AFRAME.utils.diff(oldData, this.data);
        var material = this.sprite.material;
        var newTexture = null;

        // check for texture
        if (changes.presetTexture) {
            newTexture = "assets/glowmaps/" + changes.presetTexture + ".png";
        } else if (changes.glowTexture) {
            newTexture = changes.glowTexture;
        }
        if (newTexture) {
            this.sprite.material.map = this.loader.load(newTexture);

            this.sprite.material.alphaMap = this.loader.load(newTexture);
            this.sprite.material.needsUpdate = true;
        }

        // check for color
        if (changes.color) {
            //material.color.setHex(changes.color)
            this.sprite.material.needsUpdate = true;
        }
        console.log(material)

    },
    remove: function () {
        this.el.object3D.remove(this.sprite);
        this.sprite.material.dispose();
    }
})