AFRAME.registerComponent("touch-controls", {
    init: function() {
        const self = this;
        const bind = AFRAME.utils.bind;
        this.el.addEventListener("loaded", function onLoaded(evt) {
            self.el.removeEventListener("loaded", onLoaded);
            const controlsElement= document.querySelector("[wasd-controls]");
            self.controls = controlsElement.components["wasd-controls"];
        })
        this.onTouchStart = bind(this.onTouchStart, this);
        this.onTouchEnd = bind(this.onTouchEnd, this);
        document.body.addEventListener("touchstart", this.onTouchStart);
        document.body.addEventListener("touchend", this.onTouchEnd);
    },
    tick: function() {
        if (!this.controls) return;
        this.controls.keys["KeyW"] = !!this.touched;                
    },
    onTouchStart: function() {
        this.touched = true;
    },
    onTouchEnd: function() {
        this.touched = false;  
    },
    remove: function() {
        this.el.removeEventListener("touchstart", this.onTouchStart);
        this.el.removeEventListener("touchend", this.onTouchEnd);
        this.controls.keys["KeyW"] = false;  
    }        
})