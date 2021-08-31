// the CORE tracking component
AFRAME.registerComponent("tracked-ui", {
	schema: {
		element: {default: ""},
		autoShow: {default: true},
		offset: {type: 'vec2', default: {x: 0, y: 0}}
	},
    init: function() {
        // THREE.Vector3 helper. 
        this.vector = new THREE.Vector3();
    },
    update: function() {
        // references
        this.element = document.querySelector(this.data.element)
    },
    tick: function() {
        if (!this.element) return;

        // show the UI only if the marker is visible
        if (this.data.autoShow)
            this.element.style.display = this.el.object3D.visible ? "block" : "none"

        const cam = this.el.sceneEl.camera
        // project the current marker position
        this.vector.copy(this.el.object3D.position).project(cam);
        // the vector is now normalized, so we need to adjust it to the dimensions
        this.vector.x = ( this.vector.x + 1) * window.innerWidth / 2;
        this.vector.y = - ( this.vector.y - 1) * window.innerHeight / 2;
        // apply the vector to the style
        this.element.style.left = (this.vector.x + this.data.offset.x) + 'px';
        this.element.style.top = (this.vector.y + this.data.offset.y) + 'px';
	}
})