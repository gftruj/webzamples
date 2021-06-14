AFRAME.registerComponent("depth-material", {
    init: function() {
        this.waitForTexture = this.waitForTexture.bind(this);
        // not everything emits "materialtextureloaded"
        if (this.el.getObject3D("mesh")) {
            this.waitForTexture();
        } else {
            this.el.addEventListener("loaded", this.waitForTexture);
        }
    },
    waitForTexture: function() {
        const idx = setInterval(e => {
            const mesh = this.el.getObject3D("mesh")
            if (!mesh || !mesh.material || !mesh.material.map) return;
            clearInterval(idx);
            this.applyDepthMaterial();
        }, 250)
    },
    applyDepthMaterial: function() {
        this.mesh = this.el.getObject3D("mesh")
        this.customDepthMaterial = new THREE.MeshDepthMaterial( {
            depthPacking: THREE.RGBADepthPacking,
            map: this.mesh.material.map, // or, alphaMap: myAlphaMap
            alphaTest: 0.5
        } );
        
        this.el.getObject3D("mesh").customDepthMaterial = this.customDepthMaterial;
    },
    remove: function() {
        this.el.removeEventListener("loaded", this.loaded);
        this.mesh.customDepthMaterial = null
        this.customDepthMaterial.dispose();
    }
})