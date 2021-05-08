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
        resetonplay: { default: true },
        speed: { default: 10 },
        damping: {default: 0.9}
    },

    init: function () {

        // We have to fetch curve and triggers manually because of an A-FRAME ISSUE
        // with Property-Type "Selector" / "SelectorAll": https://github.com/aframevr/aframe/issues/2517
        this.impulse = 0;
        this.updateCurve = this.updateCurve.bind(this);
        window.addEventListener("wheel", this.updateCurve)

    },

    update: function (oldData) {

        this.curve = document.querySelector(this.data.curve);
        this.triggers = this.curve.querySelectorAll(this.data.triggers);

        if (!this.curve) {
            console.warn("Curve not found. Can't follow anything...");
        } else {
            this.initialPosition = this.el.object3D.position;
        }

        this.reset();
    },
    reset: function () {
        // Reset to initial state
        this.interval = 0;
    },
    updateCurve(evt) {
        this.impulse = this.data.speed * (evt.deltaY > 0 ? 1 : -1);
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
            this.el.setAttribute('position', p);

            // Update Rotation of Entity
            if (this.data.rotate === true) {
                var nextInterval = this.checkBounds(this.interval + timeDelta, this.data.dur)
                var nextposition = nextInterval / this.data.dur
                this.el.object3D.lookAt(curve.getPoint(nextposition))
            }
        }

        // Check for Active-Triggers
        if (this.triggers && (this.triggers.length > 0)) {
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