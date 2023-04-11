AFRAME.registerComponent("prevent-culling", {
    init: function () {
      this.cache = {};
      this.el.addEventListener("model-loaded", e => {
        let mesh = this.el.getObject3D("mesh");
        mesh.traverse(node => {
          if (node.isSkinnedMesh) {
            this.cache[node.uuid] = node.frustumCulled;
            node.frustumCulled = false;
          }
        });
      });
    },
    update: function () {},
    play: function () {},
    pause: function () {},
    remove: function () {
      // restore the original values
      let mesh = this.el.getObject3D("mesh");
      mesh.traverse(node => {
        if (node.isSkinnedMesh && this.cache[node.uuid] !== undefined) {
          node.frustumCulled = this.cache[node.uuid];
        }
      });
    }
  });