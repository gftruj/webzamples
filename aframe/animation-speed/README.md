## animation-speed

Simple component to change the animation speed.

## Usage

    <!-- include the script -->
    <script src="https://gftruj.github.io/webzamples/aframe/animation-speed/animation-speed.js"></script>

    <!-- The animation will be 2x faster -->
    <a-box animation="" animation-speed="multiplier: 2"></a-box>
     
    <!-- works with multiple animations too -->
    <a-box 
        animation__position="" animation-speed__position="multiplier: 5"
        animation__rotation="" animation-speed__rotation="multiplier: 2"></a-box>
        

Example with an object with multiple animation components [here](https://gftruj.github.io/webzamples/aframe/animation-speed/multiple.html)

### Dynamic changing

You can change the speed at any time using `setAttribute("animation-speed", "multiplier", <value>);`

    el.setAttribute("animation-speed", "multiplier", 2);          // change the speed multiplier by 2
    el.setAttribute("animation-speed_position", "multiplier", 0.5); // change the speed multiplier by 0.5
