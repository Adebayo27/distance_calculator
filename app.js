const imageInput = document.getElementById("image-input");
const image = document.getElementById("image");
const imageContainer = document.getElementById("image-container");
const container = document.getElementById("container");
const point1 = document.getElementById("point1");
const point2 = document.getElementById("point2");
const pixelCord = document.getElementById("pixel-coord");
let points = [];
var layer = new Konva.Layer();

//handle image upload
imageInput.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      image.src = e.target.result;
    //   var imageObj = new Image();
      var yoda = new Konva.Image({
        x: 0,
        y: 0,
        image: image,
        width: 700,
        height: 500,
      });

      // add the shape to the layer
      layer.add(yoda);
    };

    reader.readAsDataURL(file);
  }
});

//image click
container.addEventListener("click", function (event) {
  //check if image is present
  if (!image.src) return;

  const rect = image.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  //position the point on the image
  if (points.length < 2) {
    points.push({ x, y });
    if (points.length === 1) {
      positionPoints(point1, x, y);
    } else {
      positionPoints(point2, x, y);
      calculateDistance();
    }
  } else {
    resetPoints();
    points.push({ x, y });
    positionPoints(point1, x, y);
  }
});

function positionPoints(point, x, y) {
  point.style.left = `${x -5}px`;
  point.style.top = `${y - 5}px`;
  point.style.display = `block`;
}

function calculateDistance() {
  const dx = points[1].x - points[0].x;
  const dy = points[1].y - points[0].y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  pixelCord.textContent = `Distance between Point 1 (${points[0].x.toFixed(
    2
  )}, ${points[0].y.toFixed(2)}) and Point 2 (${points[1].x.toFixed(
    2
  )}, ${points[1].y.toFixed(2)}) is ${distance.toFixed(2)}`;
}

function resetPoints() {
  points = [];
  point1.style.display = "none";
  point2.style.display = "none";
  pixelCord.textContent = ""
}

//default from Konvajs documentation
var width = 700;
var height = 500;

var stage = new Konva.Stage({
  container: "container",
  width: width,
  height: height,
});

stage.add(layer);

var scaleBy = 1.01;
stage.on("wheel", (e) => {
  // stop default scrolling
  e.evt.preventDefault();

  var oldScale = stage.scaleX();
  var pointer = stage.getPointerPosition();

  var mousePointTo = {
    x: (pointer.x - stage.x()) / oldScale,
    y: (pointer.y - stage.y()) / oldScale,
  };

  // how to scale? Zoom in? Or zoom out?
  let direction = e.evt.deltaY > 0 ? 1 : -1;

  // when we zoom on trackpad, e.evt.ctrlKey is true
  // in that case lets revert direction
  if (e.evt.ctrlKey) {
    direction = -direction;
  }

  var newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

  stage.scale({ x: newScale, y: newScale });

  var newPos = {
    x: pointer.x - mousePointTo.x * newScale,
    y: pointer.y - mousePointTo.y * newScale,
  };
  stage.position(newPos);
});
