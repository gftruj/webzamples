
AFRAME.registerComponent("material-modifier", {
    multiple: true,
    schema: {
        // material name
        name: { type: 'string' },
        // hex emissive color - either #RRGGBB or 0xRRGGBB
        emissive: { type: 'string' },
        // intensity
        emissiveIntensity: { type: 'string' },
        // hex color - either #RRGGBB or 0xRRGGBB
        color: { type: 'string' },
        // opacity value
        opacity: { type: 'string' },
        // roughness value
        roughness: { type: 'string' },
        // metalness value
        metalness: { type: 'string' }
    },
    init: function () {
        // material name
        if (!this.id) this.id = this.data.name;

        // binds
        this.onModelLoaded = this.onModelLoaded.bind(this);

        // maybe the model is already loaded
        var gltfcomponent = this.el.components["gltf-model"];
        this.model = gltfcomponent.model;
        if (this.model) {
            this.applyModifiers();
        } else {
            this.el.addEventListener("model-loaded", this.onModelLoaded);
        }
    },
    update: function (oldData) {
        this.changes = AFRAME.utils.diff(oldData, this.data);
        // apply changes if there are any
        if (this.changes && this.model)
            this.applyModifiers();
    },
    onModelLoaded: function () {
        this.applyModifiers();
    },
    // assume the model is loaded
    grabMaterial: function () {
        const mesh = this.el.getObject3D("mesh");
        if (!mesh) {
            console.warn("No mesh found.")
            return
        }
        this.model = mesh;
        mesh.traverse(node => {
            if (!node.material || this.material) return;
            if (this.id) {
                if (this.id.toLowerCase() === node.material.name.toLowerCase()) {
                    this.material = node.material
                }
                return;
            }
            this.material = node.material;
        });
    },
    applyModifiers: function () {
        if (!this.changes) return;
        if (!this.material) this.grabMaterial();
        // any change that isn't empty is appliable
        for (let attribute in this.changes) {
            var value = this.changes[attribute].toString();
            if (value === "")
                continue;

            // quick hack for "color" attributes
            if (value.includes("#"))
                value = value.replace("#", "0x");
            if (value.includes("0x")) {
                this.material[attribute].setHex(value)
                continue;
            }

            // opacity goes in pair with transparency
            if (attribute === "opacity") {
                this.material.transparent = true;
            }

            // quick hack for numeric attributes
            if (!isNaN(value)) {
                var num = parseFloat(value)
                this.material[attribute] = num;
                continue;
            }
        }
        this.material.needsUpdate = true;
    },
    remove: function () {
        this.el.removeEventListener("model-loaded", this.onModelLoaded);
    }
})