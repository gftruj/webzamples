import { FBXLoader } from "./fbx-loader";

export const Component = AFRAME.registerComponent('fbx-model-loader', {
  schema: {
    src: { type: 'asset' },
    colorCorrection: { default: false },
  },

  init: function () {
    this.model = {};
    this.loader = new FBXLoader();
  },

  update: function () {
    const self = this;
    const el = this.el;
    const src = this.data.src;
    const colorCorrection = this.data.colorCorrection;

    if (!src) { return; }

    this.remove();

    this.loader.load(src, function (fbxModel) {
      
      self.model = fbxModel;
      self.model.animatinos = self.model.animations;
      if (colorCorrection) {
        const rendererSystem = el.sceneEl.systems.renderer;

        self.model.traverse(function (object) {
          if (object.isMesh) {
            const material = object.material;
            if (material.color) rendererSystem.applyColorCorrection(material.color);
            if (material.map) rendererSystem.applyColorCorrection(material.map);
            if (material.emissive) rendererSystem.applyColorCorrection(material.emissive);
            if (material.emissiveMap) rendererSystem.applyColorCorrection(material.emissiveMap);
          }
        });
      }
      const wrapper = new THREE.Object3D();
      wrapper.add(self.model);
      el.setObject3D('mesh', wrapper);
      el.emit('model-loaded', { format: 'fbx', model: self.model });
    });
  },

  remove: function () {
    if (!this.model) { return; }
    this.el.removeObject3D('mesh');
  }
});