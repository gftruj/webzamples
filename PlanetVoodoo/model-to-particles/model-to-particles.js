AFRAME.registerComponent("model-to-particles", {
    schema: {
        showModel: { default: false },
        color: { default: 0xff0000 },
        particleSize: { default: 0.01 }
    },
    init: function () {
        this.modelLoaded = this.modelLoaded.bind(this)
        this.el.addEventListener("model-loaded", this.modelLoaded);
    },
    update: function (oldData) {
        const changes = AFRAME.utils.diff(oldData, this.data);
        // handle color changes
        // handle particle size changes
        if (this.particles) {
            if (changes.color)
                this.particles.material.color.setHex(this.data.color)
            if (changes.particleSize)
                this.particles.material.color.setHex(this.data.color)
            this.particles.material.needsUpdate = true;
        }
        // handle model visibility changes
        if (changes.showModel && this.mesh)
            this.mesh.visible = showModel;

    },
    tick: function () {
        if (this.paused) return
        if (!(this.skinnedMesh && this.particles)) return;

        // recalculate the points
        const position = this.particles.geometry.attributes.position;
        this.calculatePoints(position.array);
        position.needsUpdate = true;
    },
    pause: function () {
        this.paused = true;
    },
    play: function () {
        this.paused = false;
    },
    modelLoaded: function () {
        const mesh = this.el.getObject3D("mesh")
        mesh.traverse(node => {
            if (node.isSkinnedMesh) {
                this.skinnedMesh = node;
            }
        })
        if (!this.skinnedMesh) {
            console.warn("Model has no skinned mesh!")
            return;
        }
        const vertices = this.calculatePoints();
        const pointsGeometry = new THREE.BufferGeometry();
        pointsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        const material = new THREE.PointsMaterial({ color: this.data.color, size: this.data.particleSize });

        this.particles = new THREE.Points(pointsGeometry, material);
        this.particles.frustumCulled = false;

        // partices wrapper for matrix adjustments (prob better to do this on the geometry but w/e)
        this.particleSystem = new THREE.Object3D();
        this.el.sceneEl.object3D.add(this.particleSystem)
        this.particleSystem.add(this.particles);
        mesh.visible = this.data.showModel;
        this.mesh = mesh;
    },
    calculatePoints: (function () {
        // recycling
        var skinnedVertex = new THREE.Vector3();

        return function (array) {
            const vertices = [];
            var offset = 0;
            const geometry = this.skinnedMesh.geometry;
            const geometryIndex = geometry.index;
            const position = geometry.attributes.position;

            // Distinguish indexed and non-indexed geometry
            const idx_max = geometryIndex ? geometryIndex.count : position.count;
            for (let idx = 0; idx < idx_max; idx++) {
                var index = geometryIndex ? geometryIndex.array[idx] : idx;
                this.skinnedMesh.boneTransform(index, skinnedVertex);

                // if an array was provided - fil it with the data
                if (array)
                    skinnedVertex.toArray(array, 3 * (offset++));
                else
                    vertices.push(skinnedVertex.x, skinnedVertex.y, skinnedVertex.z);
            }
            // adjust matrices with the skinned mesh
            if (this.particleSystem) {
                const parent = this.particleSystem.parent;
                const mtx = this.particleSystem.matrix;
                // applyMatrix4 SHOULD be working but isn't
                this.particleSystem.updateMatrix();
                mtx.copy(parent.matrix).premultiply(this.skinnedMesh.matrixWorld);
                mtx.decompose(this.particleSystem.position, this.particleSystem.quaternion, this.particleSystem.scale)
            }
            return vertices;
        }
    })(),
    remove: function () {
        // cleanup the partices and show the model
        this.particleSystem.remove(this.partices);
        this.el.sceneEl.remove(this.particleSystem);
        this.particles.geometry.dispose();
        this.particles.material.dispose();

        if (this.mesh) this.mesh.visible = true;
    }
})