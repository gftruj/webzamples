AFRAME.registerComponent("simple-glow", {
    schema: {
        glowTexture: { default: "" },
        presetTexture: { default: "sphere", oneOf: ["", "sphere", "half-sphere", "star"] },
        color: { type: "color", default: "#f00" },
        intensity: { default: 1 }
    },
    init: function () {
        this.loader = new THREE.TextureLoader();
        var spriteMaterial = new THREE.SpriteMaterial(
            {
                color: 0x00ffff,
                blending: THREE.AdditiveBlending,
                map: this.loader.load("assets/glowmaps/testmap.jpg")
                //opacity: this.data.intensity,
                //transparent: true
            });
        this.spriteContainer = new THREE.Object3D();
        this.sprite = new THREE.Sprite(spriteMaterial);
        this.spriteContainer.scale.set(1.5, 1.5, 1.5)
        this.spriteContainer.add(this.sprite)
        this.el.object3D.add(this.spriteContainer);
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