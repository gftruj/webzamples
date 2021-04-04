import { PhongReflector } from "./three_reflector_phong"

export const component = AFRAME.registerComponent("phong-reflector", {
    schema: {
        color: {default: "#FFFFFF"},
        src: {default: ""},
        normalMap: {default: ""},
        ambientOcclusionMap: {default: "" },
        ambientOcclusionIntensity: {default: 1},
        displacementMap: {default: ""},
        displacementIntensity: {default: 1},
        clipBias: { default: 0},
        reflectionTextureWidth: { default: 512 },
        reflectionTextureHeight: { default: 512 },
        blendingIntensity: {default: 1},
        useWindowDimensions: { default: true }
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

        var textureWidth = this.data.useWindowDimensions ? window.innerWidth * window.devicePixelRatio : this.data.reflectionTextureWidth;
        var textureHeight = this.data.useWindowDimensions ? window.innerHeight * window.devicePixelRatio : this.data.reflectionTextureHeight;
        
        var phongOptions = this.phongSetup()

        var reflectorOptions = {
            clipBias: this.data.clipBias,
            textureWidth: textureWidth,
            textureHeight: textureHeight,
            blendingIntensity: this.data.blendingIntensity
        }
        this.reflector = new PhongReflector(mesh.geometry, phongOptions, reflectorOptions);
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
    phongSetup: function() {
        var setup = {};
        const loader = new THREE.TextureLoader();
        const data = this.data;

        if (data.src.length) {
            setup.map = loader.load(data.src);
        }

        if (data.normalMap.length) {
            setup.normalMap = loader.load(data.normalMap);
        }

        if (data.ambientOcclusionMap.length) {
            setup.ambientOcclusionMap = loader.load(data.ambientOcclusionMap);
            setup.ambientOcclusionIntensity = data.ambientOcclusionIntensity;
        }

        if (data.displacementMap.length) {
            setup.displacementMap = loader.load(data.displacementMap);
            setup.displacementIntensity = data.displacementIntensity;
        }
        return setup;
    },
    tick: function () {
        if (!this.reflector || this.paused) return;
        const renderer = this.el.sceneEl.renderer;
        const camera = this.el.sceneEl.camera;
        const scene = this.el.sceneEl.object3D;

        this.reflector.update(renderer, scene, camera);
    },
    remove: function () {
        this.el.removeEventListener("loaded", this.createReflector);
        this.el.object3D.remove(this.reflector);

        const mesh = this.el.getObject3D("mesh")
        if (mesh) mesh.visible = true;
    }
})