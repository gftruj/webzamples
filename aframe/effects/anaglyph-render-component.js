/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/AnaglyphEffect.js":
/*!*******************************!*\
  !*** ./src/AnaglyphEffect.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"AnaglyphEffect\": () => (/* binding */ AnaglyphEffect)\n/* harmony export */ });\n/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ \"three\");\n/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(three__WEBPACK_IMPORTED_MODULE_0__);\n\r\n\r\nclass AnaglyphEffect {\r\n\r\n\tconstructor( renderer, width = 512, height = 512 ) {\r\n\r\n\t\t// Dubois matrices from https://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.7.6968&rep=rep1&type=pdf#page=4\r\n\r\n\t\tthis.colorMatrixLeft = new three__WEBPACK_IMPORTED_MODULE_0__.Matrix3().fromArray( [\r\n\t\t\t0.456100, - 0.0400822, - 0.0152161,\r\n\t\t\t0.500484, - 0.0378246, - 0.0205971,\r\n\t\t\t0.176381, - 0.0157589, - 0.00546856\r\n\t\t] );\r\n\r\n\t\tthis.colorMatrixRight = new three__WEBPACK_IMPORTED_MODULE_0__.Matrix3().fromArray( [\r\n\t\t\t- 0.0434706, 0.378476, - 0.0721527,\r\n\t\t\t- 0.0879388, 0.73364, - 0.112961,\r\n\t\t\t- 0.00155529, - 0.0184503, 1.2264\r\n\t\t] );\r\n\r\n\t\tconst _camera = new three__WEBPACK_IMPORTED_MODULE_0__.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );\r\n\r\n\t\tconst _scene = new three__WEBPACK_IMPORTED_MODULE_0__.Scene();\r\n\r\n\t\tconst _stereo = new three__WEBPACK_IMPORTED_MODULE_0__.StereoCamera();\r\n\r\n\t\tconst _params = { minFilter: three__WEBPACK_IMPORTED_MODULE_0__.LinearFilter, magFilter: three__WEBPACK_IMPORTED_MODULE_0__.NearestFilter, format: three__WEBPACK_IMPORTED_MODULE_0__.RGBAFormat };\r\n\r\n\t\tconst _renderTargetL = new three__WEBPACK_IMPORTED_MODULE_0__.WebGLRenderTarget( width, height, _params );\r\n\t\tconst _renderTargetR = new three__WEBPACK_IMPORTED_MODULE_0__.WebGLRenderTarget( width, height, _params );\r\n\r\n\t\tconst _material = new three__WEBPACK_IMPORTED_MODULE_0__.ShaderMaterial( {\r\n\r\n\t\t\tuniforms: {\r\n\r\n\t\t\t\t'mapLeft': { value: _renderTargetL.texture },\r\n\t\t\t\t'mapRight': { value: _renderTargetR.texture },\r\n\r\n\t\t\t\t'colorMatrixLeft': { value: this.colorMatrixLeft },\r\n\t\t\t\t'colorMatrixRight': { value: this.colorMatrixRight }\r\n\r\n\t\t\t},\r\n\r\n\t\t\tvertexShader: [\r\n\r\n\t\t\t\t'varying vec2 vUv;',\r\n\r\n\t\t\t\t'void main() {',\r\n\r\n\t\t\t\t'\tvUv = vec2( uv.x, uv.y );',\r\n\t\t\t\t'\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',\r\n\r\n\t\t\t\t'}'\r\n\r\n\t\t\t].join( '\\n' ),\r\n\r\n\t\t\tfragmentShader: [\r\n\r\n\t\t\t\t'uniform sampler2D mapLeft;',\r\n\t\t\t\t'uniform sampler2D mapRight;',\r\n\t\t\t\t'varying vec2 vUv;',\r\n\r\n\t\t\t\t'uniform mat3 colorMatrixLeft;',\r\n\t\t\t\t'uniform mat3 colorMatrixRight;',\r\n\r\n\t\t\t\t// These functions implement sRGB linearization and gamma correction\r\n\r\n\t\t\t\t'float lin( float c ) {',\r\n\t\t\t\t'\treturn c <= 0.04045 ? c * 0.0773993808 :',\r\n\t\t\t\t'\t\t\tpow( c * 0.9478672986 + 0.0521327014, 2.4 );',\r\n\t\t\t\t'}',\r\n\r\n\t\t\t\t'vec4 lin( vec4 c ) {',\r\n\t\t\t\t'\treturn vec4( lin( c.r ), lin( c.g ), lin( c.b ), c.a );',\r\n\t\t\t\t'}',\r\n\r\n\t\t\t\t'float dev( float c ) {',\r\n\t\t\t\t'\treturn c <= 0.0031308 ? c * 12.92',\r\n\t\t\t\t'\t\t\t: pow( c, 0.41666 ) * 1.055 - 0.055;',\r\n\t\t\t\t'}',\r\n\r\n\r\n\t\t\t\t'void main() {',\r\n\r\n\t\t\t\t'\tvec2 uv = vUv;',\r\n\r\n\t\t\t\t'\tvec4 colorL = lin( texture2D( mapLeft, uv ) );',\r\n\t\t\t\t'\tvec4 colorR = lin( texture2D( mapRight, uv ) );',\r\n\r\n\t\t\t\t'\tvec3 color = clamp(',\r\n\t\t\t\t'\t\t\tcolorMatrixLeft * colorL.rgb +',\r\n\t\t\t\t'\t\t\tcolorMatrixRight * colorR.rgb, 0., 1. );',\r\n\r\n\t\t\t\t'\tgl_FragColor = vec4(',\r\n\t\t\t\t'\t\t\tdev( color.r ), dev( color.g ), dev( color.b ),',\r\n\t\t\t\t'\t\t\tmax( colorL.a, colorR.a ) );',\r\n\r\n\t\t\t\t'}'\r\n\r\n\t\t\t].join( '\\n' )\r\n\r\n\t\t} );\r\n\r\n\t\tconst _mesh = new three__WEBPACK_IMPORTED_MODULE_0__.Mesh( new three__WEBPACK_IMPORTED_MODULE_0__.PlaneGeometry( 2, 2 ), _material );\r\n\t\t_scene.add( _mesh );\r\n\r\n\t\tthis.setSize = function ( width, height ) {\r\n\r\n\t\t\trenderer.setSize( width, height );\r\n\r\n\t\t\tconst pixelRatio = renderer.getPixelRatio();\r\n\r\n\t\t\t_renderTargetL.setSize( width * pixelRatio, height * pixelRatio );\r\n\t\t\t_renderTargetR.setSize( width * pixelRatio, height * pixelRatio );\r\n\r\n\t\t};\r\n\r\n\t\tthis.render = function ( scene, camera ) {\r\n\r\n\t\t\tconst currentRenderTarget = renderer.getRenderTarget();\r\n\r\n\t\t\tif ( scene.matrixWorldAutoUpdate === true ) scene.updateMatrixWorld();\r\n\r\n\t\t\tif ( camera.parent === null && camera.matrixWorldAutoUpdate === true ) camera.updateMatrixWorld();\r\n\r\n\t\t\t_stereo.update( camera );\r\n\r\n\t\t\trenderer.setRenderTarget( _renderTargetL );\r\n\t\t\trenderer.clear();\r\n\t\t\trenderer.render( scene, _stereo.cameraL );\r\n\r\n\t\t\trenderer.setRenderTarget( _renderTargetR );\r\n\t\t\trenderer.clear();\r\n\t\t\trenderer.render( scene, _stereo.cameraR );\r\n\r\n\t\t\trenderer.setRenderTarget( null );\r\n\t\t\trenderer.render( _scene, _camera );\r\n\r\n\t\t\trenderer.setRenderTarget( currentRenderTarget );\r\n\r\n\t\t};\r\n\r\n\t\tthis.dispose = function () {\r\n\r\n\t\t\t_renderTargetL.dispose();\r\n\t\t\t_renderTargetR.dispose();\r\n\t\t\t_mesh.geometry.dispose();\r\n\t\t\t_mesh.material.dispose();\r\n\r\n\t\t};\r\n\r\n\t}\r\n\r\n}\r\n\r\n\n\n//# sourceURL=webpack://effects/./src/AnaglyphEffect.js?");

/***/ }),

/***/ "./src/anaglyph-render-component.js":
/*!******************************************!*\
  !*** ./src/anaglyph-render-component.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _AnaglyphEffect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AnaglyphEffect */ \"./src/AnaglyphEffect.js\");\n\r\n\r\nAFRAME.registerComponent(\"anaglyph-render\", {\r\n    schema: {\r\n        width: {default: 512},\r\n        height: {default: 512}\r\n    },\r\n    init: function() {\r\n        if (!this.el.sceneEl.hasLoaded) {\r\n            this.createEffect = this.createEffect.bind(this);\r\n            this.el.sceneEl.addEventListener(\"renderstart\", this.createEffect);    \r\n            return;\r\n        }\r\n        this.createEffect();\r\n    },\r\n    createEffect() {\r\n        const renderer = this.el.sceneEl.renderer;\r\n        this.effect = new _AnaglyphEffect__WEBPACK_IMPORTED_MODULE_0__.AnaglyphEffect(renderer);\r\n        this.effect.setSize(this.data.width, this.data.height);\r\n        this.renderOverride();\r\n    },\r\n    update: function(old_data) {\r\n        const changes = AFRAME.utils.diff (old_data, this.data)\r\n        if (changes.width || changes.height) {\r\n            const {width = 512, height = 512} = this.data;\r\n            this.effect && this.effect.setSize(width, height);\r\n        }\r\n    },\r\n    renderOverride: function() {\r\n        const { renderer, camera } = this.el.sceneEl;\r\n        const scene = this.el.object3D;\r\n        const render = this.render = renderer.render;\r\n        const effect = this.effect;\r\n\r\n        let renderStack = false;\r\n        renderer.render = function () {\r\n            if (renderStack) {\r\n                render.apply(this, arguments);\r\n            } else {\r\n                renderStack = true;\r\n                effect.render(scene, camera);\r\n                renderStack = false;\r\n            }\r\n        }\r\n    },\r\n    remove: function() {\r\n        const renderer = this.el.sceneEl.renderer;\r\n        renderer.render = this.render;\r\n        this.effects.dispose();\r\n    }\r\n})\r\n\n\n//# sourceURL=webpack://effects/./src/anaglyph-render-component.js?");

/***/ }),

/***/ "three":
/*!************************!*\
  !*** external "THREE" ***!
  \************************/
/***/ ((module) => {

module.exports = THREE;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/anaglyph-render-component.js");
/******/ 	
/******/ })()
;