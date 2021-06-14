// Save the original opacity values, and multiply them by a modifier
AFRAME.registerComponent('model-relative-opacity', {
    schema: { opacityFactor: { default: 0.5 } },
    init: function () {
        this.nodeMap = {}
        this.prepareMap.bind(this)
        this.traverseMesh.bind(this)

        this.el.addEventListener('model-loaded', e => {
            this.prepareMap()
            this.update()
        });
    },
    prepareMap: function () {
        this.traverseMesh(node => {
            this.nodeMap[node.uuid] = node.material.opacity
        })
    },
    update: function () {
        this.traverseMesh(node => {
            node.material.opacity = this.nodeMap[node.uuid] * this.data.opacityFactor
            node.material.transparent = node.material.opacity < 1.0;
            node.material.needsUpdate = true;
        })
    },
    remove: function () {
        this.traverseMesh(node => {
            node.material.opacity = this.nodeMap[node.uuid]
            node.material.transparent = node.material.opacity < 1.0;
            node.material.needsUpdate = true;
        })
    },
    traverseMesh: function (func) {
        var mesh = this.el.getObject3D('mesh');
        if (!mesh) { return; }
        mesh.traverse(node => {
            if (node.isMesh) {
                func(node)
            }
        });
    }
});