// originally by Jan Azzati
// https://github.com/protyze/aframe-curve-component

if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Alongpath component for A-Frame.
 * Move Entities along a predefined Curve
 */
AFRAME.registerComponent('smooth-scroll-path', {

    //dependencies: ['curve'],

    schema: {
        scrollableElement: {},
        curve: { default: '' },
        triggers: { default: 'a-curve-point' },
        triggerRadius: { type: 'number', default: 0.01 },
        dur: { default: 1000 },
        loop: { default: false },
        rotate: { default: false },
        smoothRotation: {default: false},
        resetonplay: { default: true },
        speed: { default: 10 },
        damping: {default: 0.9},
        debugTriggers: {default: false}
    },

    init: function () {
        this.rotationDummy = new THREE.Object3D();
        this.debugMeshData = {
            geometry: new THREE.SphereGeometry(0.1),
            material: new THREE.MeshNormalMaterial({transparent: true, opacity: 0.5})
        }
         Scrollbar = window.Scrollbar;
    },
    update: function (oldData) {
        var diff = AFRAME.utils.diff (oldData, this.data)
        if (diff.scrollableElement) {
            const element = document.querySelector(diff.scrollableElement)
            if (!element) {
                console.warn(diff.scrollableElement - "doesn't exist")
                return;
            }

            this.scrollbar = Scrollbar.init(element);
            this.offset = this.scrollbar.offset.y;
            this.limit = this.scrollbar.limit.y
        }
        if (diff.curve || diff.triggers) {
            this.curve = document.querySelector(this.data.curve);
            this.triggers = this.curve.querySelectorAll(this.data.triggers);
            if (!this.curve) {
                console.warn("Curve not found. Can't follow anything...");
            } else {
                this.initialPosition = this.el.object3D.position;
            }            
            this.reset();
        }

        // debug triggers
        if (diff.debugTriggers) {
            diff.debugTriggers ? this.createDebugTriggers() : this.removeDebugTriggers()
        }
        if (diff.triggerRadius)
            this.debugMeshData.geometry.radius = diff.triggerRadius;
    },

    reset: function () {
        // Reset to initial state
        this.interval = 0;
    },

    checkBounds: function (current, max) {
        if (current < 0)
            return 0
        else if (current> max)
            return max
        return current;
    },

    tick: function (time, timeDelta) {
        const scrollbar = this.scrollbar;
        const limit = scrollbar.limit.y;
        var offset = scrollbar.offset.y;

        if (isNaN(limit) || isNaN(offset)) return;

        var curve = this.curve.components['curve'] ? this.curve.components['curve'].curve : null;
        if (!curve) {
            console.error("The entity associated with the curve property has no curve component.");
        }

        // keep the offset within a margin
        if (offset === 0) offset = 1;
        if (offset === limit) offset = limit - 1;
        var position = offset / limit

        // …updating position
        var p = curve.getPoint(position);
        this.el.object3D.position.copy(p)
        
            // Update Rotation of Entity
        if (this.data.rotate === true) {
            var nextInterval = this.checkBounds((offset + timeDelta*2), limit)
            var nextposition = nextInterval / limit
            
            if (this.data.smoothRotation) {
                this.rotationDummy.position.copy(this.el.object3D.position)
                this.rotationDummy.lookAt(curve.getPoint(nextposition))
                this.el.object3D.quaternion.slerp(this.rotationDummy.quaternion, 0.1)
            } else {
                this.el.object3D.lookAt(curve.getPoint(nextposition))
            }
         }
        

        // Check for Active-Triggers
        if (this.data.triggerRadius > 0 && this.triggers && (this.triggers.length > 0)) {
            this.updateActiveTrigger();
        }
    },

    play: function () {
        if (this.data.resetonplay) {
            this.reset();
        }
    },

    remove: function () {
        this.el.object3D.position.copy(this.initialPosition);
        this.removeDebugTriggers();
        this.debugMeshData.geometry.dispose();
        this.debugMeshData.material.dispose();
    },

    createDebugTriggers() {
        this.debugTriggers = new THREE.Object3D();
        this.el.sceneEl.object3D.add(this.debugTriggers);
        for (var i = 0; i < this.triggers.length; i++) {
            if (this.triggers[i].object3D) {
                const root = this.triggers[i].object3D
                const mesh = new THREE.Mesh(this.debugMeshData.geometry, this.debugMeshData.material);
                if (!root.userdata) root.userdata = {}
                root.userdata.mesh = mesh;
                root.add(mesh);
            }
        }
    },

    removeDebugTriggers() {
        for (var i = 0; i < this.triggers.length; i++) {
            if (this.triggers[i].object3D && this.triggers[i].object3D.userdata) {
                const mesh = this.triggers[i].object3D.userdata.mesh;
                if (mesh) mesh.parent.remove(mesh);
            }
        }
    },

    updateActiveTrigger: function () {
        for (var i = 0; i < this.triggers.length; i++) {
            if (this.triggers[i].object3D) {
                if (this.triggers[i].object3D.position.distanceTo(this.el.object3D.position) <= this.data.triggerRadius) {
                    // If this element is not the active trigger, activate it - and if necessary deactivate other triggers.
                    if (this.activeTrigger && (this.activeTrigger != this.triggers[i])) {
                        this.activeTrigger.emit("alongpath-trigger-deactivated");
                        this.activeTrigger = this.triggers[i];
                        this.activeTrigger.emit("alongpath-trigger-activated");
                    } else if (!this.activeTrigger) {
                        this.activeTrigger = this.triggers[i];
                        this.activeTrigger.emit("alongpath-trigger-activated");
                    }
                    break;
                } else {
                    // If this Element was the active trigger, deactivate it
                    if (this.activeTrigger && (this.activeTrigger == this.triggers[i])) {
                        this.activeTrigger.emit("alongpath-trigger-deactivated");
                        this.activeTrigger = null;
                    }
                }
            }
        }
    }

});