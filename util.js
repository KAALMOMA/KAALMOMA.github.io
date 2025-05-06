let cnvs = document.getElementById('cnvs');
let ctx = cnvs.getContext('2d', { willReadFrequently: true });

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








function gaussian1D(sigma, kernelSize) {
   const kernel = [];
   const center = Math.floor(kernelSize / 2);
   let sum = 0;
 
   for (let i = 0; i < kernelSize; i++) {
     const x = i - center;
     const value = Math.exp(-(x * x) / (2 * sigma * sigma));
     kernel[i] = value;
     sum += value;
   }
 
   // Normalize kernel
   return kernel.map(v => v / sum);
 }
 
 function blur1D(data, width, height, kernel, horizontal = true) {
   const output = new Uint8ClampedArray(data.length);
   const half = Math.floor(kernel.length / 2);
 
   for (let y = 0; y < height; y++) {
     for (let x = 0; x < width; x++) {
       let r = 0, g = 0, b = 0, a = 0;
       for (let k = -half; k <= half; k++) {
         const offsetX = horizontal ? x + k : x;
         const offsetY = horizontal ? y : y + k;
         const clampedX = Math.max(0, Math.min(width - 1, offsetX));
         const clampedY = Math.max(0, Math.min(height - 1, offsetY));
         const offset = (clampedY * width + clampedX) * 4;
         const weight = kernel[k + half];
         r += data[offset] * weight;
         g += data[offset + 1] * weight;
         b += data[offset + 2] * weight;
         a += data[offset + 3] * weight;
       }
       const i = (y * width + x) * 4;
       output[i] = r;
       output[i + 1] = g;
       output[i + 2] = b;
       output[i + 3] = a;
     }
   }
 
   return output;
 }
 
 function applySeparableGaussianBlur(imageData, width, height, sigma = 2.0) {
   const kernelSize = Math.ceil(sigma * 6) | 1; // make odd
   const kernel = gaussian1D(sigma, kernelSize);
   const pixels = imageData.data;
   const horizBlurred = blur1D(pixels, width, height, kernel, true);
   const vertBlurred = blur1D(horizBlurred, width, height, kernel, false);
 
   // Copy result back
   for (let i = 0; i < pixels.length; i++) {
     pixels[i] = vertBlurred[i];
   }
 
   return imageData;
 }
 













function fillBackground(c1,c2,isEnabled = false) {
   const gradient = ctx.createLinearGradient(0, 0, 0, 512);
   if(isEnabled) {
      gradient.addColorStop(0, "rgb("+c1[0]+","+c1[1]+","+c1[2]+")");
      gradient.addColorStop(1, "rgb("+c2[0]+","+c2[1]+","+c2[2]+")");
      ctx.fillStyle = gradient;
   } else {
      ctx.fillStyle = "rgb("+c1[0]+","+c1[1]+","+c1[2]+")";
   }
   ctx.fillRect(0, 0, 512, 512);
}

function perlinNoise(scale = 5, contrast = 80, color = 'hsla(240,50%,50%,1)') {
   fillBackground("rgb(0,0,0)");
   if(false) {
   const GRID_SIZE = scale;
   const RESOLUTION = 80;
   const COLOR_SCALE = contrast;

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
 }

 function nebulas(c1 = [255,0,0], c2 = [0,0,255], max = 30, blur = 30, density = 4, isEnabled = false) {
   density = density/10000;
   rgbArr = randomColorBetween(c1[0],c1[1],c1[2],c2[0],c2[1],c2[2],isEnabled);
   let color = "rgb("+rgbArr[0]+","+rgbArr[1]+","+rgbArr[2]+")";
   ctx.fillStyle = color;
      for(let x = 0; x < cnvs.width; ++x) {
         for(let y = 0; y < cnvs.height; ++y) {
            rgbArr = randomColorBetween(c1[0],c1[1],c1[2],c2[0],c2[1],c2[2],isEnabled);
            color = "rgb("+rgbArr[0]+","+rgbArr[1]+","+rgbArr[2]+")";
            ctx.fillStyle = color;
            let randomNum = Math.random();
            if(randomNum < density) {
               let rand = randomInRange(0,max);
               ctx.beginPath();
               ctx.arc(x, y, rand, 0, 2 * Math.PI);
               ctx.fill();
               //console.log("TEST >> "+alph);
            }
         }
      }
      if (Math.floor(max) == 0 || density == 0) {
         return;   
      } else {
         let imageData = ctx.getImageData(0, 0, cnvs.width, cnvs.height);
         let blurred = applySeparableGaussianBlur(imageData, cnvs.width, cnvs.height, blur);
         ctx.putImageData(blurred, 0, 0);
      }
 }

 function drawPixel(x, y, c1, c2, a, shape, scale, variability, isEnabled, stars_tail_val, whiteCenter) {
   let rgbArr = randomColorBetween(c1[0],c1[1],c1[2],c2[0],c2[1],c2[2],isEnabled);
   let color = 'rgba('+rgbArr[0]+','+rgbArr[1]+','+rgbArr[2]+','+a+')';
   ctx.fillStyle = color;
   //let rand = randomInRange(scale-variability,scale+variability);
   let factor = 5;
   let rand = randomInRange(Math.max((parseFloat(scale)-(parseFloat(variability)*factor)),1),(parseFloat(scale)+(parseFloat(variability)*factor)));
   //console.log("\nS+V >> ",scale+variability);
   //console.log("RAND >> ",rand);
   let glow = true;
   if(glow == true) {
      let alph = 0;
      let radCircle = rand*(scale/8);
      for(let i = 0; i <= 10; ++i) {
         alph = Math.pow((i/10),Math.E)/8;
         color = 'rgba('+rgbArr[0]+','+rgbArr[1]+','+rgbArr[2]+','+alph+')';
         ctx.fillStyle = color;
         let rad = radCircle + rand*((10-i)/5);
         if(shape != "circle") {
            let innerSquareSize = rand*(scale/4);
            let centerOffset = innerSquareSize/2;
            ctx.beginPath();
            ctx.arc(x+centerOffset, y+centerOffset, rad, 0, 2 * Math.PI);
            ctx.fill();
         } else {
            ctx.beginPath();
            ctx.arc(x, y, rad, 0, 2 * Math.PI);
            ctx.fill();
         }
         //console.log("TEST >> "+alph);
      }
   }
   color = 'rgba('+rgbArr[0]+','+rgbArr[1]+','+rgbArr[2]+','+a+')';
   ctx.fillStyle = color;
   if(shape == "square") {
      rand = rand*(scale/4);
      ctx.fillRect(x, y, rand, rand);
      if(whiteCenter) {
         let br = Math.max(a*2,255);
         let white = 'rgba('+255+','+255+','+255+','+br+')';
         ctx.fillStyle = white;
         ctx.fillRect(x+0.75, y+0.75, rand-1.5, rand-1.5);
      }
   }
   else if(shape == "circle") {
      rand = rand*(scale/8);
      ctx.beginPath();
      ctx.arc(x, y, rand, 0, 2 * Math.PI);
      ctx.fill();
      if(whiteCenter) {
         let br = Math.max(a*4,255);
         let white = 'rgba('+255+','+255+','+255+','+br+')';
         ctx.fillStyle = white;
         ctx.beginPath();
         ctx.arc(x, y, Math.max(rand-1,0.25), 0, 2 * Math.PI);
         ctx.fill();
      }
   }
   else if(shape == "4-prong") {
      let alpha = 0;
      rand = rand*(scale/4);
      for(let i = x-parseInt(stars_tail_val); i < x+parseInt(stars_tail_val); ++i) {
         ctx.fillStyle = 'rgba('+rgbArr[0]+','+rgbArr[1]+','+rgbArr[2]+','+alpha+')';
         let rad = x+parseInt(stars_tail_val)-(x-parseInt(stars_tail_val));
         if(i < x) {
            alpha = (((-1) * Math.sqrt((0.5*rad)**2 - (i-(x-1-0.5*rad))**2)) / (0.5*rad))+1;
         } else {
            alpha = (((-1) * Math.sqrt((0.5*rad)**2 - (i-(x-1-0.5*rad)-rad)**2)) / (0.5*rad))+1;
         }
         ctx.fillRect(i, y, rand, rand);
      }
      alpha = 0;
      for(let j = y-parseInt(stars_tail_val); j < y+parseInt(stars_tail_val); ++j) {
         ctx.fillStyle = 'rgba('+rgbArr[0]+','+rgbArr[1]+','+rgbArr[2]+','+alpha+')';
         let rad = y+parseInt(stars_tail_val)-(y-parseInt(stars_tail_val));
         if(j < y) {
            alpha = (((-1) * Math.sqrt((0.5*rad)**2 - (j-(y-1-0.5*rad))**2)) / (0.5*rad))+1;
         } else {
            alpha = (((-1) * Math.sqrt((0.5*rad)**2 - (j-(y-1-0.5*rad)-rad)**2)) / (0.5*rad))+1;
         }
         ctx.fillRect(x, j, rand, rand);
      }
      if(whiteCenter) {
         let white = 'rgba('+255+','+255+','+255+','+a+')';
         ctx.fillStyle = white;
      }
      ctx.fillRect(x, y, rand, rand);
   }
 }

 function stars(density = 0.025, shape = "circle", scale = 3, variability = 1, color1 = [255,255,255], color2 = [0,0,0], isEnabled = false, stars_tail_val = 10, whiteCenter = false) {
   if(true) {
   for (let y = 0; y < cnvs.height; y += 1){
      for (let x = 0; x < cnvs.width; x += 1){
         let rand = Math.random();
         let br = Math.floor(Math.random()*255);
         if(rand < density/100) {
            drawPixel(x,y,color1,color2,br,shape,scale,variability,isEnabled,stars_tail_val,whiteCenter);
         }
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

 function generateGalaxy() {
   fillBackground(bg_color1_val,bg_color2_val,bg_useColor2_val);
   nebulas(neb_color1_val,neb_color2_val,neb_size_val,neb_blur_val,neb_density_val,neb_useColor2_val);
   stars(stars_density_val,stars_shape_val, stars_size_val,stars_variability_val,stars_color1_val,stars_color2_val,stars_useColor2_val,stars_tail_val,stars_white_val);
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
stars_white = null;
stars_white_val = null;
neb_size = null;
neb_size_val = null;
neb_blur = null;
neb_blur_val = null;
neb_density = null;
neb_density_val = null;
neb_color1 = document.getElementById("neb_color1");
neb_color1_val = hexToRgb(neb_color1.value);
neb_color2 = document.getElementById("neb_color2");
neb_color2_val = hexToRgb(neb_color2.value);
neb_useColor2 = null;
neb_useColor2_val = null;
bg_color1 = document.getElementById("bg_color1");
bg_color1_val = hexToRgb(bg_color1.value);
bg_color2 = document.getElementById("bg_color2");
bg_color2_val = hexToRgb(bg_color2.value);
bg_useColor2 = null;
bg_useColor2_val = null;

stars_density = document.getElementById("stars_density");
stars_density_val = stars_density.value;
$('#stars_density_val').val(stars_density_val);
stars_density.addEventListener("change", function(event) {
   stars_density_val = event.target.value;
   generateGalaxy();
   $('#stars_density_val').val(stars_density_val);
 });


stars_shape = document.getElementById("stars_shape");
stars_shape_val = stars_shape.value;
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
   generateGalaxy()
 });


stars_size = document.getElementById("stars_size");
stars_size_val = stars_size.value;
$('#stars_size_val').val(stars_size_val);
stars_size.addEventListener("change", function(event) {
   stars_size_val = event.target.value;
   generateGalaxy()
   $('#stars_size_val').val(stars_size_val);
 });


stars_variability = document.getElementById("stars_variability");
stars_variability_val = stars_variability.value;
$('#stars_variability_val').val(stars_variability_val);
stars_variability.addEventListener("change", function(event) {
   stars_variability_val = event.target.value;
   generateGalaxy()
   $('#stars_variability_val').val(stars_variability_val);
 });


stars_color1.addEventListener("change", function(event) {
   stars_color1_val = hexToRgb(event.target.value);
   generateGalaxy()
});


stars_color2.addEventListener("change", function(event) {
   stars_color2_val = hexToRgb(event.target.value);
   generateGalaxy()
});


stars_useColor2 = document.getElementById("stars_useColor2");
stars_useColor2_val = stars_useColor2.checked;
stars_useColor2.addEventListener("change", function(event) {
   stars_useColor2_val = event.target.checked;
   if(stars_useColor2_val == true) {
      $('#stars_color2').removeAttr('disabled');
   }
   else {
      $('#stars_color2').attr('disabled',true);
   }
   generateGalaxy()
});


stars_tail = document.getElementById("stars_tail");
stars_tail_val = stars_tail.value;
$('#stars_tail_val').val(stars_tail_val);
stars_tail.addEventListener("change", function(event) {
   stars_tail_val = event.target.value;
   generateGalaxy()
   $('#stars_tail_val').val(stars_tail_val);
 });


stars_white = document.getElementById("stars_white");
stars_white_val = stars_white.checked;
stars_white.addEventListener("change", function(event) {
   stars_white_val = event.target.checked;
   generateGalaxy()
});


neb_color1.addEventListener("change", function(event) {
   neb_color1_val = hexToRgb(event.target.value);
   generateGalaxy()
});


neb_color2.addEventListener("change", function(event) {
   neb_color2_val = hexToRgb(event.target.value);
   generateGalaxy()
});


neb_useColor2 = document.getElementById("neb_useColor2");
neb_useColor2_val = neb_useColor2.checked;
neb_useColor2.addEventListener("change", function(event) {
   neb_useColor2_val = event.target.checked;
   if(neb_useColor2_val == true) {
      $('#neb_color2').removeAttr('disabled');
   }
   else {
      $('#neb_color2').attr('disabled',true);
   }
   generateGalaxy()
});


neb_size = document.getElementById("neb_size");
neb_size_val = neb_size.value;
$('#neb_size_val').val(neb_size_val);
neb_size.addEventListener("change", function(event) {
   neb_size_val = event.target.value;
   generateGalaxy()
   $('#neb_size_val').val(neb_size_val);
 });


neb_blur = document.getElementById("neb_blur");
neb_blur_val = neb_blur.value;
$('#neb_blur_val').val(neb_blur_val);
neb_blur.addEventListener("change", function(event) {
   neb_blur_val = event.target.value;
   generateGalaxy()
   $('#neb_blur_val').val(neb_blur_val);
 });

neb_density = document.getElementById("neb_density");
neb_density_val = neb_density.value;
$('#neb_density_val').val(neb_density_val);
neb_density.addEventListener("change", function(event) {
   neb_density_val = event.target.value;
   generateGalaxy()
   $('#neb_density_val').val(neb_density_val);
 });


 bg_color1.addEventListener("change", function(event) {
   bg_color1_val = hexToRgb(event.target.value);
   generateGalaxy()
});


bg_color2.addEventListener("change", function(event) {
   bg_color2_val = hexToRgb(event.target.value);
   generateGalaxy()
});


bg_useColor2 = document.getElementById("bg_useColor2");
bg_useColor2_val = bg_useColor2.checked;
bg_useColor2.addEventListener("change", function(event) {
   bg_useColor2_val = event.target.checked;
   if(bg_useColor2_val == true) {
      $('#bg_color2').removeAttr('disabled');
   }
   else {
      $('#bg_color2').attr('disabled',true);
   }
   generateGalaxy()
});


generateGalaxy()