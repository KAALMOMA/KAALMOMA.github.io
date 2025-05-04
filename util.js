let cnvs = document.getElementById('cnvs');
let ctx = cnvs.getContext('2d');

function randomInRange(min = 0, max = 1) {
   if(max == min) {
      return min;
   }
   let rand = Math.random();
   rand = rand * (max - min) + min;
   return rand;
}

function perlinNoise(scale = 5) {
   const GRID_SIZE = scale;
   const RESOLUTION = 80;
   const COLOR_SCALE = 60;

   let pixel_size = cnvs.width / RESOLUTION;
   let num_pixels = GRID_SIZE / RESOLUTION;

   for (let y = 0; y < GRID_SIZE; y += num_pixels / GRID_SIZE){
      for (let x = 0; x < GRID_SIZE; x += num_pixels / GRID_SIZE){
         let v = parseInt(perlin.get(x, y) * COLOR_SCALE);
         let b = ((v/8)+15);
         let s = b+15;
         ctx.fillStyle = 'hsl(240,'+s+'%,'+b+'%)';
         ctx.fillRect(
               x / GRID_SIZE * cnvs.width,
               y / GRID_SIZE * cnvs.width,
               pixel_size,
               pixel_size
         );
      }
   }
   console.log("Hello, world!"); // Prints "Hello, world!" to the console
 }

 function drawPixel(x, y, r, g, b, a, shape, scale, variability) {
   let color = 'rgba('+r+','+g+','+b+','+a+')';
   ctx.fillStyle = color;
   //let rand = randomInRange(scale-variability,scale+variability);
   let factor = 5;
   let rand = randomInRange(Math.max((parseFloat(scale)-(parseFloat(variability)*factor)),1),(parseFloat(scale)+(parseFloat(variability)*factor)));
   console.log("\nS+V >> ",scale+variability);
   console.log("RAND >> ",rand);
   if(shape == "square") {
      rand = rand*(scale/4);
      ctx.fillRect(x, y, rand, rand);
   }
   else if(shape == "circle") {
      rand = rand*(scale/8);
      ctx.beginPath();
      ctx.arc(x, y, rand, 0, 2 * Math.PI);
      ctx.fill();
   }
   else if(shape == "4-prong") {
      let alpha = 0;
      rand = rand*(scale/4);
      for(let i = x-10; i < x+10; ++i) {
         ctx.fillStyle = 'rgba('+r+','+g+','+b+','+alpha+')';
         if(i < x) {
            alpha = alpha + 0.1; 
          }
          else {
            alpha = alpha - 0.1;
          }
         ctx.fillRect(i, y, rand, rand);
      }
      alpha = 0;
      for(let j = y-10; j < y+10; ++j) {
         ctx.fillStyle = 'rgba('+r+','+g+','+b+','+alpha+')';
         if(j < y) {
            alpha = alpha + 0.1; 
          }
          else {
            alpha = alpha - 0.1;
          }
         ctx.fillRect(x, j, rand, rand);
      }
      ctx.fillStyle = 'white';
      ctx.fillRect(x, y, rand, rand);
   }
 }

 function stars(density = 0.025, shape = "circle", scale = 3, variability = 1) {
   for (let y = 0; y < cnvs.height; y += 1){
      for (let x = 0; x < cnvs.width; x += 1){
         let rand = Math.random();
         let br = Math.floor(Math.random()*255);
         if(rand < density/100) {
            drawPixel(x,y,br,128,255,br,shape,scale,variability);
            
         }
      }
   }
 }

 function gradient() {
   const grad=ctx.createLinearGradient(0,512,0,0);
   grad.addColorStop(0, "rgba(255,0,255,5%)");
   grad.addColorStop(1, "rgba(20,30,255,5%)");
   ctx.fillStyle = grad;
   ctx.fillRect(0,0,512,512);
 }

stars_density = null;
stars_density_val = null;
stars_shape = null;
stars_shape_val = null;
stars_size = null;
stars_size_val = null;
stars_variability = null;
stars_variability_val = null;

stars_density = document.getElementById("stars_density");
stars_density_val = stars_density.value;
perlinNoise();
stars(stars_density_val,stars_shape_val, stars_size_val,stars_variability_val);
gradient();
$('#stars_density_val').val(stars_density_val);
stars_density.addEventListener("change", function(event) {
   stars_density_val = event.target.value;
   perlinNoise();
   stars(stars_density_val,stars_shape_val,stars_size_val,stars_variability_val);
   gradient();
   $('#stars_density_val').val(stars_density_val);
 });


stars_shape = document.getElementById("stars_shape");
stars_shape_val = stars_shape.value;
perlinNoise();
stars(stars_density_val,stars_shape_val,stars_size_val,stars_variability_val);
gradient();
stars_shape.addEventListener("change", function(event) {
   stars_shape_val = event.target.value;
   perlinNoise();
   stars(stars_density_val,stars_shape_val,stars_size_val,stars_variability_val);
   gradient();
 });


stars_size = document.getElementById("stars_size");
stars_size_val = stars_size.value;
perlinNoise();
stars(stars_density_val,stars_shape_val,stars_size_val,stars_variability_val);
gradient();
$('#stars_size_val').val(stars_size_val);
stars_size.addEventListener("change", function(event) {
   stars_size_val = event.target.value;
   perlinNoise();
   stars(stars_density_val,stars_shape_val,stars_size_val,stars_variability_val);
   gradient();
   $('#stars_size_val').val(stars_size_val);
 });


stars_variability = document.getElementById("stars_variability");
stars_variability_val = stars_variability.value;
perlinNoise();
stars(stars_density_val,stars_shape_val,stars_size_val,stars_variability_val);
gradient();
$('#stars_variability_val').val(stars_variability_val);
stars_variability.addEventListener("change", function(event) {
   stars_variability_val = event.target.value;
   perlinNoise();
   stars(stars_density_val,stars_shape_val,stars_size_val,stars_variability_val);
   gradient();
   $('#stars_variability_val').val(stars_variability_val);
 });
//drawNoise(1); // Adjust density (0.0 - 1.0)