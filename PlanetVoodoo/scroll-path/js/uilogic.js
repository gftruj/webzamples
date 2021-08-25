AFRAME.registerComponent("ui-logic", {
    init: function() {
        // references
        const debugbtn = document.getElementById("debug");
        const axebtn = document.getElementById("axe");
        const axetrigger = document.getElementById("axe-trigger");

        const shipbtn = document.getElementById("ship");
        const shiptrigger = document.getElementById("ship-trigger");

        const drawcurve = document.querySelector("a-draw-curve");
        const scrollpath_el = document.querySelector("[scroll-path]")
        this.scrollpath_component = scrollpath_el.components["scroll-path"]
        
        // debug
        var debug = false;
        debugbtn.addEventListener("click", e => {
            debug = !debug;
            debug ? this.el.sceneEl.setAttribute("stats", "") :
                this.el.sceneEl.removeAttribute("stats")
            drawcurve.setAttribute("visible", debug)
            scrollpath_el.setAttribute("scroll-path", "debugTriggers", debug)
        })

        // 
        axebtn.addEventListener("click", e => {
            if (!this.axisArea) {
                this.goToAxe = true;
                this.goToShip = false;
            }
        })
        axetrigger.addEventListener("alongpath-trigger-activated", e => {
            this.axisArea = true;
            this.goToShip = this.goToAxe = false;
        })
        axetrigger.addEventListener("alongpath-trigger-deactivated", e => {
            this.axisArea = false;
        })

        shipbtn.addEventListener("click", e => {
            if (!this.shipArea) {
                this.goToShip = true;
                this.axisArea = false
            }
        })
        shiptrigger.addEventListener("alongpath-trigger-activated", e => {
            this.shipArea = true
            this.goToShip = this.goToAxe = false;
        })
        shiptrigger.addEventListener("alongpath-trigger-deactivated", e => {
            this.shipArea = false
        })
    },
    tick: function() {
        if (this.goToAxe) {
            this.scrollpath_component.updateCurve(-1)
        } else if (this.goToShip) {
            this.scrollpath_component.updateCurve(1)
        }
    }
})