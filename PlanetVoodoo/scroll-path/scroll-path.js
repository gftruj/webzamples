// originally by Jan Azzati
// https://github.com/protyze/aframe-curve-component

if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Alongpath component for A-Frame.
 * Move Entities along a predefined Curve
 */
AFRAME.registerComponent('scroll-path', {

    //dependencies: ['curve'],

    schema: {
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

        this.impulse = 0;

        this.rotationDummy = new THREE.Object3D();
        this.updateCurve = this.updateCurve.bind(this);
        this.debugMeshData = {
            geometry: new THREE.SphereGeometry(0.1),
            material: new THREE.MeshNormalMaterial({transparent: true, opacity: 0.5})
        }

        this.wheelEvent = this.wheelEvent.bind(this);
        window.addEventListener("wheel", this.wheelEvent)
        if(AFRAME.utils.device.isMobile ()){
            this.touchEvent = this.touchEvent.bind(this)
            window.addEventListener('touchstart', this.touchEvent);
            window.addEventListener('touchmove', this.touchEvent);
            window.addEventListener('touchend', this.touchEvent);
         }    
    },
    update: function (oldData) {
        var diff = AFRAME.utils.diff (oldData, this.data)
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
        diff.debugTriggers ? this.createDebugTriggers() : this.removeDebugTriggers()
        if (diff.triggerRadius)
            this.debugMeshData.geometry.radius = diff.triggerRadius;
    },

    reset: function () {
        // Reset to initial state
        this.interval = 0;
    },

    touchEvent: function(evt) {
        var deltaY;
        if (evt.type === "touchstart") {
            this.clientY = evt.touches[0].clientY;
        } else {
            // touchmove, as well as touchend
            deltaY = evt.changedTouches[0].clientY - this.clientY;
            this.updateCurve(deltaY)
        }
    },
    wheelEvent: function(evt) {
        this.updateCurve(evt.deltaY)
    },
    updateCurve: function(dy) {
        this.impulse = this.data.speed * (dy > 0 ? 1 : -1);
    },
    nextImpulse: function (impulse) {
        if (Math.abs(impulse) > 1) {
            return impulse *= this.data.damping;
        } else {
            return impulse = 0;
        }
    },
    checkBounds: function (current, max) {
        if (current < 0)
            return 0
        else if (current > max)
            return max
        return current;
    },
    tick: function (time, timeDelta) {
        var curve = this.curve.components['curve'] ? this.curve.components['curve'].curve : null;
        if (!curve) {
            console.error("The entity associated with the curve property has no curve component.");
        }

        this.interval += this.impulse;
        this.impulse = this.nextImpulse(this.impulse)
        this.interval = this.checkBounds(this.interval, this.data.dur)

        var position = this.interval / this.data.dur

        if ((this.data.loop === false) && position >= 1) {
            // Set the end-position
            this.el.setAttribute('position', curve.points[curve.points.length - 1]);
        } else {
            // …updating position
            var p = curve.getPoint(position);
            this.el.object3D.position.copy(p)

            // Update Rotation of Entity
            if (this.data.rotate === true) {
                var nextInterval = this.checkBounds(this.interval + timeDelta, this.data.dur)
                var nextposition = nextInterval / this.data.dur
                if (this.data.smoothRotation) {
                    this.rotationDummy.position.copy(this.el.object3D.position)
                    this.rotationDummy.lookAt(curve.getPoint(nextposition))
                    this.el.object3D.quaternion.slerp(this.rotationDummy.quaternion, 0.1)
                } else {
                   this.el.object3D.lookAt(curve.getPoint(nextposition))
                }
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

        window.removeEventListener("wheel", this.wheelEvent)
        if(AFRAME.utils.device.isMobile ()){
            this.touchEvent = this.touchEvent.bind(this)
            window.removeEventListener('touchstart', this.touchEvent);
            window.removeEventListener('touchmove', this.touchEvent);
            window.removeEventListener('touchend', this.touchEvent);
         }
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