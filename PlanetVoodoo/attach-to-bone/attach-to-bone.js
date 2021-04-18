AFRAME.registerComponent("attach-to-bone", {
    multiple: true,
    schema: {
        target: {
            type: "string", default: ""
        },
        boneName: {
            type: "string", default: ""
        },
        offset: {
            default: "0 0 0"
        },
        rotation: {
            default: "0 0 0"
        },
        debug: {
            default: false
        }
    },
    init: function () {
        // binds
        this.targetLoaded = this.targetLoaded.bind(this);

        // setup orientation, and offset
        this.offset = new THREE.Vector3();
        this.orientation = new THREE.Quaternion();

        // setup axesHelper
        let axesContainer = new THREE.Object3D();
        axesContainer.add(new THREE.AxesHelper(1));
        this.el.sceneEl.object3D.add(axesContainer)
        this.axesContainer = axesContainer;

        this.targetMesh = null;
        this.bone = null;
    },
    boneChanged: function () {
        const target = document.querySelector(this.data.target);
        if (!target) {
            console.warn("Invalid selector:", this.data.target)
            return;
        }

        this.targetMesh = target.getObject3D("mesh")
        if (this.targetMesh) {
            // all is loaded
            this.targetLoaded();
        } else {
            // wait until the model is loaded
            target.addEventListener("model-loaded", this.targetLoaded);
        }
    },
    targetLoaded: function (evt) {
        const mesh = this.targetMesh || evt.detail.model
        this.targetMesh = evt.detail.model;
        this.bone = this.getBone(mesh, this.data.boneName)
        // remove the listener
        mesh.el.removeEventListener("model-loaded", this.targetLoaded)
    },
    update: function (olddata) {
        // check debug mode
        const changes = AFRAME.utils.diff(olddata, this.data)

        if (changes.offset || changes.orientation) {
            this.offset.copy(AFRAME.utils.coordinates.parse(this.data.offset));
            var rotation = AFRAME.utils.coordinates.parse(this.data.rotation);
            for (let angle in rotation) {
                rotation[angle] *= Math.PI / 180;
            }
            this.orientation.setFromEuler(new THREE.Euler(rotation.x, rotation.y, rotation.z))
        }

        if (changes.debug) {
            this.axesContainer.visible = this.data.debug;
        }

        if (changes.target || changes.bone) {
            this.boneChanged();
        }
    },
    getBone: function (root, boneName) {
        // get exact bone
        bone = root.getObjectByName(boneName);

        // or look for bones containing the name
        if (!bone) {
            root.traverse(node => {
                console.log(node.name)
                if (node.name.includes(boneName)) {
                    if (bone) {
                        console.log("Multiple bones contain", boneName, "in their name.")
                    }
                    bone = node
                }
            })
        }
        if (!bone) {
            console.log(boneName, "was not found in the model")
        }
        console.log(bone)
        return bone;
    },
    play: function () {
        this.paused = false;
    },
    pause: function () {
        this.paused = true;
    },
    remove: function () {
        this.bone = null;

        // restore position and rotation
        let pos = this.el.getAttribute("position");
        let rot = this.el.getAttribute("rotation");
        for (let angle in rot) {
            rot[angle] *= Math.PI / 180;
        }

        this.el.object3D.position.copy(pos);
        this.el.object3D.quaternion.setFromEuler(new THREE.Euler(rot.x, rot.y, rot.z))
    },
    tick: (function () {
        let inverseWorldMatrix = new THREE.Matrix4();
        let boneMatrix = new THREE.Matrix4();
        let position = new THREE.Vector3(0, 0, 0);
        let orientation = new THREE.Quaternion();

        return function () {
            if (!this.bone || !this.targetMesh) return;

            // get bone matrix
            inverseWorldMatrix.copy(this.targetMesh.matrix).invert();
            boneMatrix.multiplyMatrices(inverseWorldMatrix, this.bone.matrixWorld);
            position.setFromMatrixPosition(boneMatrix).add(this.offset);
            orientation.copy(this.bone.quaternion).multiply(this.orientation)

            this.el.object3D.quaternion.copy(orientation);
            this.el.object3D.position.copy(position);

            // apply debug axes
            if (this.data.debug) {
                this.axesContainer.position.copy(this.el.object3D.getWorldPosition(this.axesContainer.position))
                this.axesContainer.quaternion.copy(this.el.object3D.getWorldQuaternion(this.axesContainer.quaternion))
            }
        }
    })()
})