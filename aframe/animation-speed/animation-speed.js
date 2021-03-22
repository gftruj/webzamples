AFRAME.registerComponent("animation-speed", {
    multiple: true,
    schema: {
        multiplier: { default: 1 }
    },
    init: function () {
        this.loaded = this.loaded.bind(this);
        if (this.el.hasLoaded)
            this.loaded();
        else
            this.el.addEventListener("loaded", this.loaded)
    },
    loaded: function () {
        this.isLoaded = true;
        let animation_component_name = "animation"
        animation_component_name += this.id ? "__" + this.id : "";
        this.animationComponent = this.el.components[animation_component_name];

        if (!this.animationComponent) {
            console.warn("Couldn't find", animation_component_name);
            return;
        }
        // restore the tick, when this is removed
        this.original_tick = this.animationComponent.tick;
        // bonus property for the animation component - for free!
        this.animationComponent.speedMultiplier = this.data.multiplier;
        // use our tick, as the animations tick
        this.animationComponent.tick = this.modified_tick.bind(this.animationComponent)
    },
    modified_tick: function (t, dt) {
        if (!this.animationIsPlaying) { return; }
        this.time += dt * this.speedMultiplier;
        this.animation.tick(this.time);
    },
    update: function (oldData) {
        // retry grabbing the animation component if something went wrong
        if (!this.animationComponent && this.isLoaded) this.loaded();
        // update the speed multiplier
        if (this.animationComponent)
            this.animationComponent.speedMultiplier = this.data.multiplier;
    },
    remove: function () {
        if (this.animationComponent) {
            this.animationComponent.tick = this.original_tick.bind(this.animationComponent);
        }
    }
})