Things I want to parametrize:

* Star size
   - min scale
   - max scale
   - Variability (0=all stars uniform scale, 1=uniform distribution of random size between max and min scale)
* Star color
   - Rainbow, or...
   - Single color
   - 2 colors (w/ random interpolation between the two colors)
* Star glow
* Star shape
   - square
   - circle
   - 4-pronged
      - tail length

* nebula size (perlin scale)
* nebula color

To interpolate between two values by a specified amount...

Find the difference between the two values, get a random int between
0 and 1, multiply by the difference, and add to lower value.

const grad=ctx.createLinearGradient(0,0, 280,0);
grad.addColorStop(0, "lightblue");
grad.addColorStop(1, "darkblue");

