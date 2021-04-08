import {} from "../lib/BufferGeometryUtils.js"
// based on Lee Stemkoskis work
// https://github.com/stemkoski/stemkoski.github.com/blob/master/Three.js/Shader-Glow.html
export const component = AFRAME.registerComponent("glow", {
    schema: {
        intensityPower: { default: 2.4 },
        intensityBase: { default: 1.0 },
        glowColor: { type: "color", default: "#ff0" }
    },
    init: function () {
        const vshader = `
            uniform vec3 viewVector;
            uniform float intensityBase;
            uniform float intensityPower;
            varying float intensity;
            void main() {
                vec3 vNormal = normalize( normalMatrix * normal );
	            vec3 vNormel = normalize( normalMatrix * viewVector );
	            intensity = pow( intensityBase - dot(vNormal, vNormel), intensityPower );
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }
        `

        const fshader = `
        uniform vec3 glowColor;
        varying float intensity;
        void main() {
	        vec3 glow = glowColor * intensity;
            gl_FragColor = vec4( glow, 1.0 );
        }
        `

        this.viewVector = new THREE.Vector3();
        this.worldpos = new THREE.Vector3();
        var glowColor = new THREE.Color(0x0000ff);

        this.glowMaterial = new THREE.ShaderMaterial(
            {
                uniforms:
                {
                    intensityBase: { type: "f", value: this.data.intensityBase },
                    intensityPower: { type: "f", value: this.data.intensityPower },
                    glowColor: { type: "c", value: glowColor },
                    viewVector: { type: "v3", value: this.viewVector }
                },
                vertexShader: vshader,
                fragmentShader: fshader,
                side: THREE.FrontSide,
                blending: THREE.AdditiveBlending,
                transparent: true
            });

        const modelComponent = this.el.components['gltf-model'];
        if (modelComponent) {
            // handle gltf model
            this.handleModel = this.handleModel.bind(this)
            this.el.addEventListener("model-loaded", this.handleModel)
        } else {
            // handle primitive
            const oldMaterial = this.el.getObject3D("mesh").material
            this.el.getObject3D("mesh").material = this.glowMaterial
            oldMaterial.dispose();
        }
    },
    handleModel: function(evt) {
        // ignore child bubbles
        if (evt.target !== this.el) return;
        const mesh = this.el.getObject3D("mesh");
        mesh.parent.remove(mesh)
        var geometry = null;
        mesh.traverse(node => {
            if (!node.geometry) return;
            if (!geometry) {
                geometry = node.geometry;   
            } else {
                geometry = THREE.BufferGeometryUtils.mergeBufferGeometries([geometry, node.geometry]);
                geometry = THREE.BufferGeometryUtils.mergeVertices(geometry);
            }
            node.geometry.dispose();
            node.material.dispose();
        })
        const newModel = new THREE.Mesh(geometry, this.glowMaterial)
        this.el.object3D.add(newModel);
    },
    tick: function (t, dt) {
        // update the view vector if the camera is up
        if (this.el.sceneEl.camera) {
            const cameraRig = this.el.sceneEl.camera.el.object3D;

            // (TODO) update only if there are position changes
            this.el.object3D.getWorldPosition(this.worldpos)
            this.viewVector.subVectors(cameraRig.position, this.worldpos)
            this.glowMaterial.uniforms.viewVector.value = this.viewVector;
            this.glowMaterial.needsUpdate = true;
        }
    },
    update: function (oldData) {
        const changes = AFRAME.utils.diff(oldData, this.data);
        if (!changes) return;

        if (changes.glowColor) {
            this.glowMaterial.uniforms.glowColor.value.setStyle(changes.glowColor);
            this.glowMaterial.needsUpdate = true;
            delete changes.glowColor;
        }

        for (let prop in changes) {
            this.glowMaterial.uniforms[prop].value = changes[prop];
            this.glowMaterial.needsUpdate = true;
        }
    },
    remove: function () {
        this.el.object3D.remove(this.sprite);
        this.sprite.material.dispose();
    }
})