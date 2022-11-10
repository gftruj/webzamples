AFRAME.registerComponent("relative-shadow", {
  schema: {
    target: {
      type: "selector"
    }
  },
  init: function() {
    const mesh = this.el.getObject3D("mesh");
    this.oldMaterial = mesh.material;
    mesh.material = this.material = new THREE.ShadowMaterial();
  },
  update: function() {
    const target = this.data.target;
    this.opacityComponent = null;
    if (target.components["model-opacity"]) {
      this.opacitySource = target.components["model-opacity"];
    } else if (target.components["model-relative-opacity"]) {
      this.opacitySource = target.components["model-relative-opacity"];
    } else {
        this.opacitySource = target.components["material"];
    }
  },
  tick: function() {
    if (this.opacitySource) {
      this.material.opacity = this.opacitySource.data.opacity;
    }
  },
  remove: function() {
    const mesh = this.el.getObject3D("mesh");
    mesh.material = this.oldMaterial;
    this.material.dispose();
  }
})