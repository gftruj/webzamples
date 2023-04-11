AFRAME.registerComponent("redbox-from-object3d", {
    init: function () {
      this.box = new THREE.Box3();
      this.helper = new THREE.Box3Helper(
        this.box,
        0xff0000
      );
      this.el.sceneEl.object3D.add(this.helper)
      this.el.addEventListener("model-loaded", e => {
        this.mesh = this.el.getObject3D("mesh");
      })
    },
    update: function() {},
    play: function(){},
    pause: function() {},
    tick: function () {
      this.box.setFromObject(this.el.object3D)
    },
    remove: function () {
      this.el.sceneEl.object3D.remove(this.helper)
      this.helper.geometry.dispose()
      this.helper.material.dispose()
      this.helper = null
    }
  })