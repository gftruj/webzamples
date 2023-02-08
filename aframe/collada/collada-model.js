import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';

export const Component = AFRAME.registerComponent('collada-model', {
  schema: {
    src: { type: 'asset' },
    colorCorrection: { default: false },
  },

  init: function () {
    this.model = null;
    this.loader = new ColladaLoader();
  },

  update: function () {
    const self = this;
    const el = this.el;
    const src = this.data.src;
    const colorCorrection = this.data.colorCorrection;

    if (!src) { return; }

    this.remove();

    this.loader.load(src, function (colladaModel) {
      
      self.model = colladaModel.scene;
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
      el.setObject3D('mesh', self.model);
      el.emit('model-loaded', { format: 'collada', model: self.model });
    });
  },

  remove: function () {
    if (!this.model) { return; }
    this.el.removeObject3D('mesh');
  }
});