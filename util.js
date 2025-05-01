let cnvs = document.getElementById('cnvs');
let ctx = cnvs.getContext('2d');

function perlinNoise(scale = 5) {
   const GRID_SIZE = 6;
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

 function drawPixel(x, y, color) {
   ctx.fillStyle = color;
   ctx.fillRect(x, y, 1, 1);
 }

 function stars(scale = 0.025) {
   for (let y = 0; y < cnvs.height; y += 1){
      for (let x = 0; x < cnvs.width; x += 1){
         let rand = Math.random();
         let br = Math.floor(Math.random()*255);
         if(rand < scale/100) {
            drawPixel(x,y,'rgb('+br+','+br+','+br+')');
         }
      }
   }
 }


perlinNoise();
stars();
//drawNoise(1); // Adjust density (0.0 - 1.0)