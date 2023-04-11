if (!THREE.Box3Utils) {
    THREE.Box3Utils = (function() {
        /*
         * POLYFILL
         */
        var boneTransformPolyfill = null;
          boneTransformPolyfill = (function(mesh, target, index) {
            var vertex = new THREE.Vector3();
            var temp = new THREE.Vector3();
            var skinned = new THREE.Vector3();
            var skinIndices = new THREE.Vector4();
            var skinWeights = new THREE.Vector4();
            var boneMatrix = new THREE.Matrix4();
            var skeleton,
              boneMatrices,
              geometry,
              position,
              skinIndex,
              skinWeight,
              bindMatrix,
              bindMatrixInverse,
              sw,
              si;
      
            return function(skinnedMesh, index, target) {
              skeleton = skinnedMesh.skeleton;
              boneMatrices = skeleton.boneMatrices;
              geometry = skinnedMesh.geometry;
      
              position = geometry.attributes.position;
              skinIndex = geometry.attributes.skinIndex;
              skinWeight = geometry.attributes.skinWeight;
      
              bindMatrix = skinnedMesh.bindMatrix;
              bindMatrixInverse = skinnedMesh.bindMatrixInverse;
      
              vertex.fromBufferAttribute(position, index);
              skinIndices.fromBufferAttribute(skinIndex, index);
              skinWeights.fromBufferAttribute(skinWeight, index);
      
              /*
               * Re-create the vertex shader job - just the vertices positions
               * see https://www.khronos.org/opengl/wiki/Skeletal_Animation
               * see Mugen87 answer https://discourse.threejs.org/t/object-bounds-not-updated-with-animation/3749/12
               */
      
              vertex.applyMatrix4(bindMatrix); // transform to bind space
              target.set(0, 0, 0);
              for (var j = 0; j < 4; j++) {
                sw = skinWeights.getComponent(j);
                if (sw === 0) continue;
      
                si = skinIndices.getComponent(j);
                sw = skinWeights.getComponent(j);
                boneMatrix.fromArray(boneMatrices, si * 16);
      
                // weighted vertex transformation
                temp
                  .copy(vertex)
                  .applyMatrix4(boneMatrix)
                  .multiplyScalar(sw);
                target.add(temp);
              }
      
              return target.applyMatrix4(bindMatrixInverse); // back to local space
            };
          })();
        /*
         * POLYFILL END
         */
    
        var skinnedVertex = new THREE.Vector3();
        var tmpBox = new THREE.Box3();
    
        function updateAABB(skinnedMesh, box, expand) {
          var geometry = skinnedMesh.geometry;
          var geometryIndex = geometry.index;
          var position = geometry.attributes.position;
          var idx = 0;
          var index = 0;
          
          var aabb = expand ? tmpBox : box;
          aabb.makeEmpty()
          // Distinguish indexed and non-indexed geometry
          var idx_max = geometryIndex ? geometryIndex.count : position.count;
      
          for (idx = 0; idx < idx_max; idx++) {
            index = geometryIndex ? geometryIndex.array[idx] : idx;
            if (boneTransformPolyfill)
              boneTransformPolyfill(skinnedMesh, index, skinnedVertex);
            else 
              skinnedMesh.boneTransform(index, skinnedVertex);
      
              //skinnedVertex.applyQuaternion(skinnedMesh.parent.parent.quaternion)
            // expand aabb
            aabb.expandByPoint(skinnedVertex);
          }
          aabb.applyMatrix4(skinnedMesh.matrixWorld);
    
          if (expand)
            box.union(aabb);
        }
        return {
          expandFromSkinnedMesh: function(skinnedMesh, aabb) {
            updateAABB(skinnedMesh, aabb, true);
          },
          fromSkinnedMesh: function(skinnedMesh, aabb) {
            updateAABB(skinnedMesh, aabb, false);
          }
        };
      })();    
}

AFRAME.registerComponent("bbox-helper", {
    schema: {
      combine: { default: false }
    },
    init: function () {
      this.paused = false
      this.createBoxes = this.createBoxes.bind(this)
      this.removeBoxes = this.removeBoxes.bind(this)
      this.nodeMap = {};

      this.el.addEventListener("model-loaded", e => {
        let mesh = this.el.getObject3D("mesh");
        if (!mesh) mesh = this.el.object3D;
        mesh.traverse(node => {
          if (node.isSkinnedMesh) {
            this.skinnedMesh = node;
            this.nodeMap[node.uuid] = {
              mesh: node,
              box: new THREE.Box3()
            }
          }
        });

        if (!Object.keys(this.nodeMap).length) {
          this.nodeMap[0] = {
            mesh: this.el.object3D,
            box: new THREE.Box3()
          };
        }

        this.createBoxes()
      });
    },
    update: function (olddata) {
      // no changes  
      if (olddata && olddata.combine === this.data.combine)
        return;
      this.removeBoxes();
      this.createBoxes();
    },
    createBoxes: function () {
      for (uuid in this.nodeMap) {
        this.nodeMap[uuid].helper = new THREE.Box3Helper(
          this.nodeMap[uuid].box,
          0x00ff00
        );
        this.el.sceneEl.object3D.add(this.nodeMap[uuid].helper);

        // in case we want combined boxes, only one should be created
        if (this.data.combine) break
      }
    },
    removeBoxes: function () {
      for (uuid in this.nodeMap) {
        if (!this.nodeMap[uuid].helper) continue;

        this.el.sceneEl.object3D.remove(this.nodeMap[uuid].helper);
        this.nodeMap[uuid].helper.geometry.dispose();
        this.nodeMap[uuid].helper.material.dispose();
        delete this.nodeMap[uuid].helper;
      }
    },
    play: function () {
      this.paused = false;
    },
    pause: function () {
      this.paused = true;
    },
    tick: function () {
      if (this.paused || !Object.keys(this.nodeMap).length) return;
      let combine = this.data.combine
      let common_box_uuid = null

      for (uuid in this.nodeMap) {
        // Non - skinned case
        if (!this.nodeMap[uuid].mesh.isSkinnedMesh) {
          this.nodeMap[uuid].box.setFromObject(this.el.object3D);
          return;
        }
        // skinned model. Either separate boxes, or combined
        if (common_box_uuid && combine) {
          THREE.Box3Utils.expandFromSkinnedMesh(this.nodeMap[uuid].mesh, this.nodeMap[common_box_uuid].box);
        } else {
          THREE.Box3Utils.fromSkinnedMesh(this.nodeMap[uuid].mesh, this.nodeMap[uuid].box);
          common_box_uuid = uuid
        }
      }
    },
    remove: function () {
      this.removeBoxes()
    }
  });