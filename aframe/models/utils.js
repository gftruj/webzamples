
var SkinnedMeshBBox = (function() {
    /*
     * POLYFILL
     */
    var boneTransformPolyfill = null;
    if (typeof THREE.SkinnedMesh.prototype.boneTransform !== "function") {
      console.log("using boneTransformPolyfill");
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
    }
    /*
     * POLYFILL END
     */
    function updateAABB(skinnedMesh, aabb, expand) {
      var geometry = skinnedMesh.geometry;
  
      var geometryIndex = geometry.index;
      var position = geometry.attributes.position;
      var skinnedVertex = new THREE.Vector3();
      var idx = 0;
      var index = 0;
  
      if (!expand) aabb.makeEmpty();
  
      // Distinguish indexed and non-indexed geometry
      var idx_max = geometryIndex ? geometryIndex.count : position.count;
  
      for (idx = 0; idx < idx_max; idx++) {
        index = geometryIndex ? geometryIndex.array[idx] : idx;
        if (boneTransformPolyfill)
          boneTransformPolyfill(skinnedMesh, index, skinnedVertex);
        else 
          skinnedMesh.boneTransform(index, skinnedVertex);
  
        // expand aabb
        aabb.expandByPoint(skinnedVertex);
      }
  
      aabb.applyMatrix4(skinnedMesh.matrixWorld);
    }
    return {
      expandAABB: function(skinnedMesh, aabb) {
        updateAABB(skinnedMesh, aabb, true);
      },
      getAABB: function(skinnedMesh, aabb) {
        updateAABB(skinnedMesh, aabb, false);
      }
    };
  })();
  