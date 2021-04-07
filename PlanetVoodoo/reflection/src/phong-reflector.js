import { PhongReflector } from "./three_reflector_phong"

export const component = AFRAME.registerComponent("phong-reflector", {
    schema: {
        color: { default: "#FFFFFF" },
        src: { default: "" },
        repeat: { default: "1 1" },
        normalMap: { default: "" },
        normalScale: { default: "1 1" },
        ambientOcclusionMap: { default: "" },
        ambientOcclusionIntensity: { default: 1 },
        displacementMap: { default: "" },
        displacementBias: { default: 0 },
        displacementScale: { default: 1 },
        fog: { default: true },
        clipBias: { default: 0 },
        reflectionTextureDimensions: { default: "512 512" },
        blendingIntensity: { default: 1 },
        useWindowDimensions: { default: true }
    },
    init: function () {
        this.loader = new THREE.TextureLoader();
        this.createReflector = this.createReflector.bind(this);
        if (!this.el.hasLoaded) {
            this.el.addEventListener("loaded", this.createReflector);
        }
    },
    update: function (oldData) {
        // create the reflector if the entity was already loaded
        if (!this.reflector && this.el.hasLoaded) {
            this.el.removeEventListener("loaded", this.createReflector);
            this.createReflector();
            return;
        }
        this.changes = AFRAME.utils.diff(oldData, this.data);
        if (!changes) return;
        /* material changes */
        const material = this.reflector.material;
        if (changes.src) {
            const oldsrc = material.map;
            material.map = this.loader.load(changes.src);
            if (oldsrc) oldsrc.dispose();
        }

        // normal changes
        this.el.handleNormalChanges(material, changes);

        // AO changes
        this.el.handleAOChanges(material, changes);

        // displacement updates
        this.el.handleDisplacementChanges(material, changes);

        if (changes.repeat) {
            this.repeatSetup(AFRAME.utils.coordinates.parse(changes.repeat))
            material.needsUpdate = true;
        }
    },
    handleNormalChanges: function (material, changes) {
        if (changes.normalMap) {
            const oldmap = material.normal;
            material.displacementMap = this.loader.load(this.data)
            if (oldMap) oldMap.dispose();
            material.needsUpdate = true;
        }

        if (changes.normalScale) {
            material.normalScale.copy(AFRAME.utils.coordinates.parse(this.data.normalScale))
            const normalScaleParams = AFRAME.utils.coordinates.parse(data.normalScale)
            setup.normalScale.x = normalScaleParams.x ? normalScaleParams.x : 1;
            setup.normalScale.y = normalScaleParams.y ? normalScaleParams.y : 1;        
        }
    },
    handleAOChanges: function (material, changes) {
        if (changes.ambientOcclusionMap) {
            const oldmap = material.ambientOcclusionMap;
            material.ambientOcclusionMap = this.loader.load(this.data.ambientOcclusionMap)
            if (oldMap) oldMap.dispose();
            material.needsUpdate = true;
        }

        if (changes.ambientOcclusionIntensity) {
            material.ambientOcclusionIntensity = this.data.ambientOcclusionIntensity
            material.needsUpdate = true;
        }
    },
    handleDisplacementChanges: function (material, changes) {
        // map updates
        if (changes.displacementMap) {
            // if there was a displacementmap
            const oldMap = material.displacementMap;
            material.displacementMap = this.loader.load(this.data.displacementMap)
            if (oldMap) oldMap.dispose();
            material.needsUpdate = true;
        }

        // scale
        if (changes.displacementScale) {
            material.displacementScale = this.data.displacementScale;
            material.needsUpdate = true;
        }

        // bias
        if (changes.displacementScale) {
            material.displacementBias = this.data.displacementBias;
            material.needsUpdate = true;
        }
    },
    createReflector: function () {
        const mesh = this.el.getObject3D("mesh")
        if (!mesh) {
            console.warn("No mesh found. This shouldn't happen")
            return;
        }
        mesh.visible = false;

        var phongOptions = this.phongSetup()

        var data = this.data;
        var textureDimensions = data.useWindowDimensions ? { x: window.innerWidth, y: window.innerHeight } : AFRAME.utils.coordinates.parse(data.reflectionTextureDimensions)

        var reflectorOptions = {
            clipBias: data.clipBias,
            textureWidth: textureDimensions.x,
            textureHeight: textureDimensions.y,
            blendingIntensity: data.blendingIntensity
        }

        this.reflector = new PhongReflector(mesh.geometry, phongOptions, reflectorOptions);
        this.el.object3D.add(this.reflector);
    },

    play: function () {
        this.paused = false;
    },
    pause: function () {
        this.paused = true;
    },
    phongSetup: function () {
        var setup = {};
        const loader = new THREE.TextureLoader();
        const data = this.data;
        setup.color = new THREE.Color(this.data.color);
        setup.fog = data.fog;

        if (data.src.length) {
            setup.map = this.loader.load(data.src);
        }

        if (data.normalMap.length) {
            setup.normalMap = this.loader.load(data.normalMap);
            const normalScaleParams = AFRAME.utils.coordinates.parse(data.normalScale)
            setup.normalScale = new THREE.Vector2();
            setup.normalScale.x = normalScaleParams.x ? normalScaleParams.x : 1;
            setup.normalScale.y = normalScaleParams.y ? normalScaleParams.y : 1;
        }

        if (data.ambientOcclusionMap.length) {
            setup.aoMap = this.loader.load(data.ambientOcclusionMap);
            setup.aoMapIntensity = data.ambientOcclusionIntensity;
        }

        if (data.displacementMap.length) {
            setup.displacementMap = this.loader.load(data.displacementMap);
            setup.displacementBias = data.displacementBias;
            setup.displacementScale = data.displacementScale;
        }
        this.repeatSetup(AFRAME.utils.coordinates.parse(data.repeat), setup);
        return setup;
    },
    repeatSetup: function (_repeat, _material) {
        var material = _material || this.reflector.material;

        function setRepeat(texture, repeatObj) {
            texture.repeat.set(repeatObj.x, repeatObj.y);
            if (repeatObj.x === 1 && repeatObj.y === 1) {
                texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
            } else {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            }
        }
        if (material.map) setRepeat(material.map, _repeat)
        if (material.normalMap) setRepeat(material.normalMap, _repeat)
        if (material.ambientOcclusionMap) setRepeat(material.ambientOcclusionMap, _repeat)
        if (material.displacementMap) setRepeat(material.displacementMap, _repeat)
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