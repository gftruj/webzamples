AFRAME.registerComponent("ar-ui", {
    init: function () {
        const sceneEl = this.el.sceneEl
        const message = document.getElementById('dom-overlay-message');
        const anchorbtn = document.querySelector("button");
        this.flightmode = false;


        // If the user taps on any buttons or interactive elements we may add then prevent
        // Any WebXR select events from firing
        message.addEventListener('beforexrselect', e => {
            e.preventDefault();
        });

        anchorbtn.addEventListener("click", evt => {
            this.flightmode = !this.flightmode
            this.flightmode ? anchorbtn.classList.remove("disabled") : anchorbtn.classList.add("disabled")
            this.el.sceneEl.setAttribute("ar-hit-test", "target", this.flightmode ? "#point" : "#my-objects");
        })

        sceneEl.addEventListener('enter-vr', function () {
            var firstTime = false;
            if (this.is('ar-mode')) {
                // Entered AR
                message.textContent = '';

                // Hit testing is available
                this.addEventListener('ar-hit-test-start', function () {
                    message.innerHTML = `Scanning environment, finding surface.`;
                }, { once: true });

                // Has managed to start doing hit testing
                this.addEventListener('ar-hit-test-achieved', function () {
                    message.innerHTML = `Select the location to place<br />By tapping on the screen or selecting with your controller.`;
                }, { once: true });

                // User has placed an object
                this.addEventListener('ar-hit-test-select', function () {
                    if (!this.arToggle) {
                        anchorbtn.classList.remove("hidden")
                        anchorbtn.classList.add("visible")
                        this.arToggle = true
                    }
                    
                    // Object placed for the first time
                    message.textContent = 'Object Placed!';
                }, { once: true });
            }
        });

        sceneEl.addEventListener('exit-vr', function () {
            message.textContent = 'Exited Immersive Mode';
            anchorbtn.classList.add("hidden")
            anchorbtn.classList.remove("visible")
        });
    }
})