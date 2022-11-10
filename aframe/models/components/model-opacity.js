AFRAME.registerComponent('model-opacity', {
    schema: { opacityFactor: { default: 1.0 } },
    update: function () {
        var mesh = this.el.getObject3D('mesh');
        var data = this.data;
        if (!mesh) { return; }
        mesh.traverse(function (node) {
            if (node.isMesh) {
                node.material.opacity = data.opacity;
                node.material.transparent = data.opacity < 1.0;
                node.material.needsUpdate = true;
            }
        });
    },
    remove: function () {
        const mesh = this.el.getObject3D('mesh');
        if (!mesh) return;
        mesh.traverse(node => {
            node.material.opacity = 1.0
            node.material.transparent = false;
            node.material.needsUpdate = true;
        })
    }
});