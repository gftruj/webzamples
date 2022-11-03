import { AnaglyphEffect } from "./AnaglyphEffect";

AFRAME.registerComponent("anaglyph-render", {
    schema: {
        width: {default: 512},
        height: {default: 512}
    },
    init: function() {
        if (!this.el.sceneEl.hasLoaded) {
            this.createEffect = this.createEffect.bind(this);
            this.el.sceneEl.addEventListener("renderstart", this.createEffect);    
            return;
        }
        this.createEffect();
    },
    createEffect() {
        const renderer = this.el.sceneEl.renderer;
        this.effect = new AnaglyphEffect(renderer);
        this.effect.setSize(this.data.width, this.data.height);
        this.renderOverride();
    },
    update: function(old_data) {
        const changes = AFRAME.utils.diff (old_data, this.data)
        if (changes.width || changes.height) {
            const {width = 512, height = 512} = this.data;
            this.effect && this.effect.setSize(width, height);
        }
    },
    renderOverride: function() {
        const { renderer, camera } = this.el.sceneEl;
        const scene = this.el.object3D;
        const render = this.render = renderer.render;
        const effect = this.effect;

        let renderStack = false;
        renderer.render = function () {
            if (renderStack) {
                render.apply(this, arguments);
            } else {
                renderStack = true;
                effect.render(scene, camera);
                renderStack = false;
            }
        }
    },
    remove: function() {
        const renderer = this.el.sceneEl.renderer;
        renderer.render = this.render;
        this.effects.dispose();
    }
})
