// MODIFIED FILES FROM https://github.com/aalavandhaann/three_reflector
Ashok = {};

Ashok.GroundSceneReflector = function(meshobject, renderer, scene, data)
{
    var three_scene = scene;
    var mirrorObj = meshobject;

    if(!mirrorObj)
    {
    	return;
    }

    this.renderer = renderer;
    this.data = (data) ? data : {};
    // this.renderer.alpha = true;

    this.data.textureWidth = (this.data.textureWidth)? this.data.textureWidth : 256;
    this.data.textureHeight = (this.data.textureHeight)? this.data.textureHeight : 256;
    this.data.intensity = (this.data.intensity)? this.data.intensity : 0.5;
    this.data.invertedUV = (this.data.invertedUV)? this.data.invertedUV : false;
    this.data.wrapOne = (this.data.wrapOne)? this.data.wrapOne : {x:1, y: 1};
    this.data.wrapTwo = (this.data.wrapTwo)? this.data.wrapTwo : {x:1, y: 1};
    this.data.color = (this.data.color)? this.data.color : '#848485';


    console.log('MY TEXTURE SIZE ', this.data.textureWidth, this.data.textureHeight);
    console.log('THE MIRROR MESH ::: ', mirrorObj);
    console.log('MATERIAL OF THE MIRROR MESH :::', mirrorObj.material);
    console.log('VECTOR PROPERTIES ::: ', this.data.wrapOne, this.data.wrapTwo);
    console.log('BOOL PROPERTIES ::: ', this.data.invertedUV);
    console.log('TEXTURES ::: ', this.data.textureOne, this.data.textureTwo);

    var reflectorPlane = new THREE.Plane();
	var normal = new THREE.Vector3();
	var reflectorWorldPosition = new THREE.Vector3();
	var cameraWorldPosition = new THREE.Vector3();
	var rotationMatrix = new THREE.Matrix4();
	var lookAtPosition = new THREE.Vector3( 0, 0, - 1 );
	var clipPlane = new THREE.Vector4();
	var viewport = new THREE.Vector4();

	var view = new THREE.Vector3();
	var target = new THREE.Vector3();
	var q = new THREE.Vector4();

	var textureMatrix = new THREE.Matrix4();
	var virtualCamera = new THREE.PerspectiveCamera();
    var renderTarget = new THREE.WebGLRenderTarget(this.data.textureWidth, this.data.textureHeight, {minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat, } );


    if ( ! THREE.Math.isPowerOfTwo( this.data.textureWidth ) || ! THREE.Math.isPowerOfTwo( this.data.textureHeight ) ) 
    {
		renderTarget.texture.generateMipmaps = false;
	}

	var scope = mirrorObj;
	var color = this.data.color;
	var textureWidth = this.data.textureWidth;
	var textureHeight = this.data.textureHeight;
	var clipBias = 0;
	var shader = Ashok.GroundSceneReflector.ReflectorShader;
	var recursion = 0;

	var material = undefined;
	mirrorObj.material = undefined;
	if(!mirrorObj.material)
	{
		material = new THREE.ShaderMaterial( {
		uniforms: THREE.UniformsUtils.clone( shader.uniforms ),
		fragmentShader: shader.fragmentShader,
		vertexShader: shader.vertexShader,
		side: THREE.DoubleSide,
		transparent: true,
		lights: true,
		});
		console.log('hello')
		material.onBeforeCompile(x => {
			console.log("BEFORE COMPILE")
			console.log(x, y)
		})
		material.uniforms.intensity.value = this.data.intensity;
		material.uniforms.blendIntensity.value = this.data.blendIntensity;
		material.uniforms.tDiffuse.value  = renderTarget.texture;
		material.uniforms.color.value = new THREE.Color(this.data.color);
		material.uniforms.invertedUV.value = this.data.invertedUV;
		material.uniforms.textureMatrix.value = textureMatrix;

		if(this.data.textureOne)
		{
			console.log('LOAD TEXTURE ONE ');
			var texture = new THREE.TextureLoader().load(this.data.textureOne);
			texture.wrapS = THREE.RepeatWrapping;
        	texture.wrapT = THREE.RepeatWrapping;
	        texture.repeat.set( this.data.wrapOne.x, this.data.wrapOne.y );
	        material.uniforms.tOneFlag.value = true;
	        material.uniforms.tOne.value = texture;
	        material.uniforms.tOneWrapX.value = texture.repeat.x;
	        material.uniforms.tOneWrapY.value = texture.repeat.y;
		}

		if(this.data.textureTwo)
		{
			console.log('LOAD TEXTURE TWO ');
			var texture = new THREE.TextureLoader().load(this.data.textureTwo);
			texture.wrapS = THREE.RepeatWrapping;
        	texture.wrapT = THREE.RepeatWrapping;
	        texture.repeat.set( this.data.wrapTwo.x, this.data.wrapTwo.y );
	        material.uniforms.tTwoFlag.value = true;
	        material.uniforms.tSec.value = texture;
	        material.uniforms.tTwoWrapX.value = texture.repeat.x;
	        material.uniforms.tTwoWrapY.value = texture.repeat.y;
		}

		console.log('SHADER UNIFORMS ::: ', material.uniforms);
		mirrorObj.material = material;
		this.material = material;
	}


    mirrorObj.onBeforeRender = function(renderer, scene, camera)
    {
    	if ( 'recursion' in camera.userData ) 
    	{
			if ( camera.userData.recursion === recursion ) return;
			camera.userData.recursion ++;
		}

		reflectorWorldPosition.setFromMatrixPosition( scope.matrixWorld );
		cameraWorldPosition.setFromMatrixPosition( camera.matrixWorld );
		rotationMatrix.extractRotation( scope.matrixWorld );
		normal.set( 0, 0, 1 );
		normal.applyMatrix4( rotationMatrix );
		view.subVectors( reflectorWorldPosition, cameraWorldPosition );
		// Avoid rendering when reflector is facing away

		// if ( view.dot( normal ) > 0 ) return;
		view.reflect( normal ).negate();
		view.add( reflectorWorldPosition );
		rotationMatrix.extractRotation( camera.matrixWorld );
		lookAtPosition.set( 0, 0, - 1 );
		lookAtPosition.applyMatrix4( rotationMatrix );
		lookAtPosition.add( cameraWorldPosition );
		target.subVectors( reflectorWorldPosition, lookAtPosition );
		target.reflect( normal ).negate();
		target.add( reflectorWorldPosition );
		virtualCamera.position.copy( view );
		virtualCamera.up.set( 0, 1, 0 );
		virtualCamera.up.applyMatrix4( rotationMatrix );
		virtualCamera.up.reflect( normal );
		virtualCamera.lookAt( target );
		virtualCamera.near = camera.near;
		virtualCamera.far = camera.far; // Used in WebGLBackground
		virtualCamera.fov = camera.fov;
		virtualCamera.updateMatrixWorld();
		virtualCamera.projectionMatrix.copy( camera.projectionMatrix );
		virtualCamera.userData.recursion = 0;
		// Update the texture matrix
		textureMatrix.set(
			0.5, 0.0, 0.0, 0.5,
			0.0, 0.5, 0.0, 0.5,
			0.0, 0.0, 0.5, 0.5,
			0.0, 0.0, 0.0, 1.0
		);

		textureMatrix.multiply( virtualCamera.projectionMatrix );
		textureMatrix.multiply( virtualCamera.matrixWorldInverse );
		textureMatrix.multiply( scope.matrixWorld );



		// Now update projection matrix with new clip plane, implementing code from: http://www.terathon.com/code/oblique.html
		// Paper explaining this technique: http://www.terathon.com/lengyel/Lengyel-Oblique.pdf
		reflectorPlane.setFromNormalAndCoplanarPoint( normal, reflectorWorldPosition );
		reflectorPlane.applyMatrix4( virtualCamera.matrixWorldInverse );

		clipPlane.set( reflectorPlane.normal.x, reflectorPlane.normal.y, reflectorPlane.normal.z, reflectorPlane.constant );

		var projectionMatrix = virtualCamera.projectionMatrix;
		q.x = ( Math.sign( clipPlane.x ) + projectionMatrix.elements[ 8 ] ) / projectionMatrix.elements[ 0 ];
		q.y = ( Math.sign( clipPlane.y ) + projectionMatrix.elements[ 9 ] ) / projectionMatrix.elements[ 5 ];
		q.z = - 1.0;
		q.w = ( 1.0 + projectionMatrix.elements[ 10 ] ) / projectionMatrix.elements[ 14 ];

		// Calculate the scaled plane vector
		clipPlane.multiplyScalar( 2.0 / clipPlane.dot( q ) );
		// Replacing the third row of the projection matrix
		projectionMatrix.elements[ 2 ] = clipPlane.x;
		projectionMatrix.elements[ 6 ] = clipPlane.y;
		projectionMatrix.elements[ 10 ] = clipPlane.z + 1.0 - clipBias;
		projectionMatrix.elements[ 14 ] = clipPlane.w;

		// Render

		scope.visible = false;

		var currentRenderTarget = renderer.getRenderTarget();

		var currentVrEnabled = renderer.xr.enabled;
		var currentShadowAutoUpdate = renderer.shadowMap.autoUpdate;

		renderer.xr.enabled = false; // Avoid camera modification and recursion
		renderer.shadowMap.autoUpdate = false; // Avoid re-computing shadows

        renderer.setRenderTarget( renderTarget );
		renderer.state.buffers.depth.setMask( true ); // make sure the depth buffer is writable so it can be properly cleared, see #18897

		if ( renderer.autoClear === false ) renderer.clear();
		renderer.render( scene, virtualCamera );

		renderer.xr.enabled = currentVrEnabled;
		renderer.shadowMap.autoUpdate = currentShadowAutoUpdate;

		renderer.setRenderTarget( currentRenderTarget );

		// Restore viewport

		var bounds = camera.bounds;

		if ( bounds !== undefined ) {

			var size = renderer.getSize();
			var pixelRatio = renderer.getPixelRatio();

			viewport.x = bounds.x * size.width * pixelRatio;
			viewport.y = bounds.y * size.height * pixelRatio;
			viewport.z = bounds.z * size.width * pixelRatio;
			viewport.w = bounds.w * size.height * pixelRatio;

			renderer.state.viewport( viewport );

		}

		scope.visible = true;
    }	
}


Ashok.GroundSceneReflector.prototype = Object.create( Object.prototype );
Ashok.GroundSceneReflector.prototype.constructor = Ashok.GroundSceneReflector;

// 'vUv2 = textureMatrix * vec4( position, 1.0 );',
// 'vec4 reflection = texture2DProj( tDiffuse, vUv2 );',
Ashok.GroundSceneReflector.ReflectorShader = 
{

	uniforms: THREE.UniformsUtils.merge( [
	THREE.UniformsLib[ "normalmap" ],
	THREE.UniformsLib[ "ambient" ],
	THREE.UniformsLib['lights'],
    THREE.UniformsLib[ "fog" ],{
		'color': 
		{
			type: 'c',
			value: null
		},
		'tDiffuse': 
		{
			type: 't',
			value: null
		},
		'textureMatrix': 
		{
			type: 'm4',
			value: null
		},
		'intensity': 
		{
			type: 'f',
			value: 0.5
		},
		'blendIntensity': 
		{
			type: 'f',
			value: 0.5
		},
		'tOneWrapX': 
		{
			type: 'f',
			value: 1.0
		},
		'tOneWrapY': 
		{
			type: 'f',
			value: 1.0
		},
		'tTwoWrapX': 
		{
			type: 'f',
			value: 1.0
		},
		'tTwoWrapY': 
		{
			type: 'f',
			value: 1.0
		},
		'tOne': 
		{
			type: 't',
			value: null
		},
		'tSec':
		{
			type: 't',
			value: null
		},
		'tOneFlag':
		{
			type: 'b',
			value: false
		},
		'tTwoFlag':
		{
			type: 'b',
			value: false
		},
		'invertedUV':
		{
			type: 'b',
			value: false
		}
	}]),

	vertexShader: [
	'#ifdef GL_ES',
        'precision highp float;',
      '#endif',
	  "#ifndef FLAT_SHADED",
	  	"varying vec3 vNormal;",
  	  "#endif",
      'uniform bool invertedUV;',

	  // NORMAL
      'uniform mat4 textureMatrix;',
      'varying vec2 vUv;',
      'varying vec4 vUv2;',

      'void main()', 
      '{',
        'vUv = uv;',
        'vUv2 = textureMatrix * vec4( position, 1.0 );',
        'if(invertedUV)',
        '{',
          'vUv[0] = uv[0];',
          'vUv[1] = 1.0 - uv[1];',
        '}',  
		
		// NORMAL
		"#include <beginnormal_vertex>",
		"#include <morphnormal_vertex>",
		"#include <skinbase_vertex>",
		"#include <skinnormal_vertex>",
		"#include <defaultnormal_vertex>",
		"#ifndef FLAT_SHADED // Normal computed with derivatives when FLAT_SHADED",
			"vNormal = normalize( transformedNormal );",
		"#endif",

        'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
      '}',
	].join( '\n' ),

	fragmentShader: /* glsl */`
	#define ASHOK_PHONG
	uniform vec3 diffuse;
	uniform vec3 emissive;
	uniform vec3 specular;
	uniform float shininess;
	uniform float opacity;
	#include <common>
	#include <packing>
	#include <dithering_pars_fragment>
	#include <color_pars_fragment>
	#include <uv_pars_fragment>
	#include <uv2_pars_fragment>
	#include <map_pars_fragment>
	#include <alphamap_pars_fragment>
	#include <aomap_pars_fragment>
	#include <lightmap_pars_fragment>
	#include <emissivemap_pars_fragment>
	#include <envmap_common_pars_fragment>
	#include <envmap_pars_fragment>
	#include <cube_uv_reflection_fragment>
	#include <fog_pars_fragment>
	#include <bsdfs>
	#include <lights_pars_begin>
	#include <lights_phong_pars_fragment>
	#include <shadowmap_pars_fragment>
	#include <bumpmap_pars_fragment>
	#include <normalmap_pars_fragment>
	#include <specularmap_pars_fragment>
	#include <logdepthbuf_pars_fragment>
	#include <clipping_planes_pars_fragment>
	void main() {
		#include <clipping_planes_fragment>
		vec4 diffuseColor = vec4( diffuse, opacity );
		ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
		vec3 totalEmissiveRadiance = emissive;
		#include <logdepthbuf_fragment>
		#include <map_fragment>
		#include <color_fragment>
		#include <alphamap_fragment>
		#include <alphatest_fragment>
		#include <specularmap_fragment>
		#include <normal_fragment_begin>
		#include <normal_fragment_maps>
		#include <emissivemap_fragment>
		// accumulation
		#include <lights_phong_fragment>
		#include <lights_fragment_begin>
		#include <lights_fragment_maps>
		#include <lights_fragment_end>
		// modulation
		#include <aomap_fragment>
		vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
		#include <envmap_fragment>
		gl_FragColor = vec4( outgoingLight, diffuseColor.a );
		#include <tonemapping_fragment>
		#include <encodings_fragment>
		#include <fog_fragment>
		#include <premultiplied_alpha_fragment>
		#include <dithering_fragment>
	}
	`
};

// The if condition that was there before calculating colors or textures 
// 'if(reflection.r == 1.0 && reflection.b == 1.0 && reflection.g == 1.0)',
//             '{',
//               'reflection.a = 0.0;',
//             '}',
// 'gl_FragColor = mix(gl_FragColor, vec4(c, 1.0), 1.0);',
// 'c = (reflection.rgb * (reflection.a * intensity)) + (tcolors.rgb * (1.0 - (reflection.a * intensity)));',


AFRAME.registerComponent('aframe-mirror', 
{
	schema:{
	    textureOne: {default: ""},
	    textureTwo: {default: ""},
		normal: {default: ""},
	    wrapOne: 
	    {
	    	type: 'vec2',
	    	default: {x: 1, y: 1}
	    },
	    wrapTwo: 
	    {
	    	type: 'vec2',
	    	default: {x: 1, y: 1}
	    },
	    invertedUV:
	    {
	    	type: 'bool',
	    	default: false
	    },
	    textureWidth: {default: 512},
	    textureHeight: {default: 512},
	    color: {type: "color", default: "#7F7F7F"},
	    intensity: {default: 1.0},
	    blendIntensity: {default: 0.5},
	},
	init: function () 
	{
	    var scene = this.el.sceneEl;
	    var three_scene = scene.object3D;
	    var mirrorObj = this.el.getObject3D('mesh');

	    if(!mirrorObj)
	    {
	    	return;
	    }

	    var gscenereflector = Ashok.GroundSceneReflector(mirrorObj, scene.renderer, three_scene, this.data);
	},
	tick: function () 
	{	    	

	}
});