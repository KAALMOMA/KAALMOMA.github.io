let cnvs = document.getElementById('cnvs');
let ctx = cnvs.getContext('2d');

function hexToRgb(hex) {
   // Remove the '#' if it exists
   hex = hex.replace("#", "");
 
   // Handle shorthand hex codes (e.g., #abc)
   if (hex.length === 3) {
     hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
   }
 
   // Parse the hex values for red, green, and blue
   const r = parseInt(hex.substring(0, 2), 16);
   const g = parseInt(hex.substring(2, 4), 16);
   const b = parseInt(hex.substring(4, 6), 16);
 
   return [r,g,b];
 }

function randomInRange(min = 0, max = 1) {
   if(max == min) {
      return min;
   }
   let rand = Math.random();
   rand = rand * (max - min) + min;
   return rand;
}

function randomColorBetween(c1r,c1g,c1b,c2r,c2g,c2b, isEnabled) {
   /*Find the difference between the two values, get a random int between
0 and 1, multiply by the difference, and add to lower value.
   */
// 0. Ensure all variables are integers
   if(isEnabled) {
      c1r = parseInt(c1r);
      c1g = parseInt(c1g);
      c1b = parseInt(c1b);
      c2r = parseInt(c2r);
      c2g = parseInt(c2g);
      c2b = parseInt(c2b);
   // 2. Generate a random number between 0 and 1
      let rand = Math.random();
   // 3. Multiply rand to each diff
      let r = c1r + rand*(c2r - c1r);
      let g = c1g + rand*(c2g - c1g);
      let b = c1b + rand*(c2b - c1b);
      return [r,g,b];
   }
   else {
      return [c1r,c1g,c1b];
   }
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
 }

 function drawPixel(x, y, c1, c2, a, shape, scale, variability, isEnabled,stars_tail_val) {
   let rgbArr = randomColorBetween(c1[0],c1[1],c1[2],c2[0],c2[1],c2[2],isEnabled);
   let color = 'rgba('+rgbArr[0]+','+rgbArr[1]+','+rgbArr[2]+','+a+')';
   ctx.fillStyle = color;
   //let rand = randomInRange(scale-variability,scale+variability);
   let factor = 5;
   let rand = randomInRange(Math.max((parseFloat(scale)-(parseFloat(variability)*factor)),1),(parseFloat(scale)+(parseFloat(variability)*factor)));
   //console.log("\nS+V >> ",scale+variability);
   //console.log("RAND >> ",rand);
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
      for(let i = x-parseInt(stars_tail_val); i < x+parseInt(stars_tail_val); ++i) {
         ctx.fillStyle = 'rgba('+rgbArr[0]+','+rgbArr[1]+','+rgbArr[2]+','+alpha+')';
         alpha = ( (-1) * Math.abs(i-x) + parseInt(stars_tail_val)) / parseInt(stars_tail_val);
         ctx.fillRect(i, y, rand, rand);
      }
      alpha = 0;
      for(let j = y-parseInt(stars_tail_val); j < y+parseInt(stars_tail_val); ++j) {
         ctx.fillStyle = 'rgba('+rgbArr[0]+','+rgbArr[1]+','+rgbArr[2]+','+alpha+')';
         alpha = ( (-1) * Math.abs(j-y) + parseInt(stars_tail_val)) / parseInt(stars_tail_val);
         ctx.fillRect(x, j, rand, rand);
      }
      ctx.fillStyle = 'white';
      ctx.fillRect(x, y, rand, rand);
   }
 }

 function stars(density = 0.025, shape = "circle", scale = 3, variability = 1, color1 = [255,255,255], color2 = [0,0,0], isEnabled = false, stars_tail_val = 10) {
   for (let y = 0; y < cnvs.height; y += 1){
      for (let x = 0; x < cnvs.width; x += 1){
         let rand = Math.random();
         let br = Math.floor(Math.random()*255);
         if(rand < density/100) {
            drawPixel(x,y,color1,color2,br,shape,scale,variability,isEnabled,stars_tail_val);
            
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
stars_color1 = null;
stars_color1_val = null;
stars_color2 = null;
stars_color2_val = null;
stars_color1 = document.getElementById("stars_color1");
stars_color1_val = hexToRgb(stars_color1.value);
stars_color2 = document.getElementById("stars_color2");
stars_color2_val = hexToRgb(stars_color2.value);
stars_useColor2 = null;
stars_useColor2_val = null;
stars_tail = null;
stars_tail_val = null;


stars_density = document.getElementById("stars_density");
stars_density_val = stars_density.value;
perlinNoise();
stars(stars_density_val,stars_shape_val, stars_size_val,stars_variability_val,stars_color1_val,stars_color2_val,stars_useColor2_val,stars_tail_val);
gradient();
$('#stars_density_val').val(stars_density_val);
stars_density.addEventListener("change", function(event) {
   stars_density_val = event.target.value;
   perlinNoise();
   stars(stars_density_val,stars_shape_val,stars_size_val,stars_variability_val,stars_color1_val,stars_color2_val,stars_useColor2_val,stars_tail_val);
   gradient();
   $('#stars_density_val').val(stars_density_val);
 });


stars_shape = document.getElementById("stars_shape");
stars_shape_val = stars_shape.value;
perlinNoise();
stars(stars_density_val,stars_shape_val,stars_size_val,stars_variability_val,stars_color1_val,stars_color2_val,stars_useColor2_val,stars_tail_val);
gradient();
stars_shape.addEventListener("change", function(event) {
   stars_shape_val = event.target.value;
   if(stars_shape_val == "4-prong") {
      $('#stars_tail').removeAttr('hidden');
      $('#stars_tail_label').removeAttr('hidden');
      $('#stars_tail_val').removeAttr('hidden'); 
   }
   else {
      $('#stars_tail').attr('hidden',true);
      $('#stars_tail_label').attr('hidden',true);
      $('#stars_tail_val').attr('hidden',true);
   }
   perlinNoise();
   stars(stars_density_val,stars_shape_val,stars_size_val,stars_variability_val,stars_color1_val,stars_color2_val,stars_useColor2_val,stars_tail_val);
   gradient();
 });


stars_size = document.getElementById("stars_size");
stars_size_val = stars_size.value;
perlinNoise();
stars(stars_density_val,stars_shape_val,stars_size_val,stars_variability_val,stars_color1_val,stars_color2_val,stars_useColor2_val,stars_tail_val);
gradient();
$('#stars_size_val').val(stars_size_val);
stars_size.addEventListener("change", function(event) {
   stars_size_val = event.target.value;
   perlinNoise();
   stars(stars_density_val,stars_shape_val,stars_size_val,stars_variability_val,stars_color1_val,stars_color2_val,stars_useColor2_val,stars_tail_val);
   gradient();
   $('#stars_size_val').val(stars_size_val);
 });


stars_variability = document.getElementById("stars_variability");
stars_variability_val = stars_variability.value;
perlinNoise();
stars(stars_density_val,stars_shape_val,stars_size_val,stars_variability_val,stars_color1_val,stars_color2_val,stars_useColor2_val,stars_tail_val);
gradient();
$('#stars_variability_val').val(stars_variability_val);
stars_variability.addEventListener("change", function(event) {
   stars_variability_val = event.target.value;
   perlinNoise();
   stars(stars_density_val,stars_shape_val,stars_size_val,stars_variability_val,stars_color1_val,stars_color2_val,stars_useColor2_val,stars_tail_val);
   gradient();
   $('#stars_variability_val').val(stars_variability_val);
 });



perlinNoise();
stars(stars_density_val,stars_shape_val,stars_size_val,stars_variability_val,stars_color1_val,stars_color2_val,stars_useColor2_val,stars_tail_val);
gradient();
stars_color1.addEventListener("change", function(event) {
   stars_color1_val = hexToRgb(event.target.value);
   perlinNoise();
   stars(stars_density_val,stars_shape_val,stars_size_val,stars_variability_val,stars_color1_val,stars_color2_val,stars_useColor2_val,stars_tail_val);
   gradient();
});


perlinNoise();
stars(stars_density_val,stars_shape_val,stars_size_val,stars_variability_val,stars_color1_val,stars_color2_val,stars_useColor2_val,stars_tail_val);
gradient();
stars_color2.addEventListener("change", function(event) {
   stars_color2_val = hexToRgb(event.target.value);
   perlinNoise();
   stars(stars_density_val,stars_shape_val,stars_size_val,stars_variability_val,stars_color1_val,stars_color2_val,stars_useColor2_val,stars_tail_val);
   gradient();
});


stars_useColor2 = document.getElementById("stars_useColor2");
stars_useColor2_val = stars_useColor2.checked;
perlinNoise();
stars(stars_density_val,stars_shape_val,stars_size_val,stars_variability_val,stars_color1_val,stars_color2_val,stars_useColor2_val,stars_tail_val);
gradient();
stars_useColor2.addEventListener("change", function(event) {
   stars_useColor2_val = event.target.checked;
   if(stars_useColor2_val == true) {
      $('#stars_color2').removeAttr('disabled');
   }
   else {
      $('#stars_color2').attr('disabled',true);
   }
   perlinNoise();
   stars(stars_density_val,stars_shape_val,stars_size_val,stars_variability_val,stars_color1_val,stars_color2_val,stars_useColor2_val,stars_tail_val);
   gradient();
});


stars_tail = document.getElementById("stars_tail");
stars_tail_val = stars_tail.value;
perlinNoise();
stars(stars_density_val,stars_shape_val,stars_size_val,stars_variability_val,stars_color1_val,stars_color2_val,stars_useColor2_val,stars_tail_val);
gradient();
$('#stars_tail_val').val(stars_tail_val);
stars_tail.addEventListener("change", function(event) {
   stars_tail_val = event.target.value;
   perlinNoise();
   stars(stars_density_val,stars_shape_val,stars_size_val,stars_variability_val,stars_color1_val,stars_color2_val,stars_useColor2_val,stars_tail_val);
   gradient();
   $('#stars_tail_val').val(stars_tail_val);
 });