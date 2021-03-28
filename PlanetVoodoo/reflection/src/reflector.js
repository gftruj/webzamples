import { Reflector } from "./three_reflector"
import { ReflectorRTT } from "./three_reflector_rtt"

export const component = AFRAME.registerComponent("reflector", {
    schema: {
        rtt: { default: false },
        clipBias: { default: 0.03 },
        textureWidth: { default: 512 },
        textureHeight: { default: 512 },
        useWindowDimensions: { default: false },
        color: { default: "#7F7F7F" }
    },
    init: function () {
        this.createReflector = this.createReflector.bind(this);
        if (this.el.hasLoaded) {
            this.createReflector();
        } else {
            this.el.addEventListener("loaded", this.createReflector);
        }
    },
    createReflector: function () {
        const mesh = this.el.getObject3D("mesh")
        if (!mesh) {
            console.warn("No mesh found. This shouldn't happen")
            return;
        }
        mesh.visible = false;

        var textureWidth = this.data.useWindowDimensions ? window.innerWidth * window.devicePixelRatio : this.data.textureWidth;
        var textureHeight = this.data.useWindowDimensions ? window.innerHeight * window.devicePixelRatio : this.data.textureHeight;


        var options = {
            clipBias: this.data.clipBias,
            textureWidth: textureWidth,
            textureHeight: textureHeight,
            color: this.data.color
        }
        if (this.data.rtt) {
            this.reflector = new ReflectorRTT(mesh.geometry, options);
            console.log(this.reflector)
        } else {
            this.reflector = new Reflector(mesh.geometry, options);
        }
        this.el.object3D.add(this.reflector);
    },
    update: function (oldData) {
        this.changes = AFRAME.utils.diff(oldData, this.data);
    },
    play: function () {
        this.paused = false;
    },
    pause: function () {
        this.paused = true;
    },
    tick: function () {
        if (!this.reflector || this.paused) return;
        const renderer = this.el.sceneEl.renderer;
        const camera = this.el.sceneEl.camera;
        const scene = this.el.sceneEl.object3D;

        this.reflector.onBeforeRender(renderer, scene, camera);
    },
    remove: function () {
        this.el.removeEventListener("loaded", this.createReflector);
        this.el.object3D.remove(this.reflector);

        const mesh = this.el.getObject3D("mesh")
        if (mesh) mesh.visible = true;
    }
})