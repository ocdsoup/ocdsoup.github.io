var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var center = canvas.width/2;

var rightPressed = false;
var leftPressed = false;

var mouseIsDown = false;

var bounce_c = 0.2;
var drag_c = .994;
var aggressiveness_c = 17;
var bowl_radius = center - 100;
var tile_width = 35;
var tile_bowl_radius = bowl_radius-tile_width;

var Letter = function (letter) {
    this.image = new Image();
    this.image.src = 'images/'+letter+'.png';
    this.width = tile_width;
    this.height = tile_width;
    
    t = 2*Math.PI*Math.random();
    u = Math.random()+Math.random();
    r = u>1?2-u:u;
    this.center_x = center+tile_bowl_radius*Math.sin(t);
    this.center_y = center+tile_bowl_radius*Math.cos(t);

    this.dx = 0;
    this.dy = 0;
};
Letter.prototype.getX = function() {
    return this.center_x-this.width/2;
}
Letter.prototype.getY = function() {
    return this.center_y-this.height/2;
}
Letter.prototype.testCollisions = function() {
    for (var i = 0; i < letters.length; i++){
        letter = letters[i];
        if (letter!=this && distance(letter, this) < tile_width){
            // var delta_x = letter.center_x - this.center_x;
            // var delta_y = letter.center_y - this.center_y;
            // var theta = angle(delta_x, delta_y);
            // var move_x = this.dy*Math.sin(theta)+this.dx*Math.cos(theta);
            // letter.dx+=move_x;
            // var move_y = this.dx*Math.sin(theta)+this.dy*Math.cos(theta);
            // letter.dy+=move_y;
        }
    }
}
Letter.prototype.draw = function() {
    if (!this.inBounds()){
        this.center_x-=this.dx*(1-bounce_c+0.0001);
        this.center_y-=this.dy*(1-bounce_c+0.0001);
        this.dx=-this.dx*bounce_c;
        this.dy=-this.dy*bounce_c;
    }
    this.center_x+=this.dx;
    this.center_y+=this.dy;
    this.dx *= drag_c;
    this.dy *= drag_c;
    this.testCollisions();
    ctx.drawImage(this.image, this.getX(), this.getY(), this.width, this.height);

};

//initialize all the letters
var alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N"]
var letters = []
for (var i = 0; i < alphabet.length; i++){
    var l = alphabet[i];
    letters.push(new Letter(l));
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

Letter.prototype.inBounds = function(){
    var fx = this.getX()-center;
    var fy = this.getY()-center;
    if (fx > 0) fx += this.width;
    if (fy > 0) fy += this.height;
    return magnitude(fx,fy) < center-1/3*center;
}
function inBounds(x, y){
    var fx = x-center;
    var fy = y-center;
    return magnitude(fx,fy) < center-1/3*center;
}


function getMousePosition(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

canvas.addEventListener("mouseup", function(evt) {
    mouseIsDown = false;
});

canvas.addEventListener("mousedown", function(evt) {
    mouseIsDown = true;
    makeRipple(getMousePosition(canvas, evt), 0.4);
});

canvas.addEventListener('mousemove', function(evt) {
    var mousePos = getMousePosition(canvas, evt);
    var message = 'Mouse position: ' + mousePos.x + ',   ' + mousePos.y;
}, false);

function magnitude(x,y){
    return Math.pow(x*x+y*y,0.5);
}
function distance(obj,obj2){
    var x = obj.center_x - obj2.center_x;
    var y = obj.center_y - obj2.center_y;
    return magnitude(x,y);
}
function angle(x,y){
    var theta = Math.atan(y/x);
    if (x<0 && y<0) theta += Math.PI;
    return theta;
}

function makeRipple(position, coefficient){
    for (var i = 0; i < letters.length; i++){
        var a = letters[i];
        var x_dist = a.center_x - position.x;
        var y_dist = a.center_y - position.y;

        var mag = magnitude(x_dist, y_dist);
        var force = 2/3*a.width/(2*Math.PI*mag);

        var x_mag = force*x_dist/mag*coefficient * aggressiveness_c;
        a.dx += x_mag;

        var y_mag = force*y_dist/mag*coefficient * aggressiveness_c;
        a.dy += y_mag;
    }
}

function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}
function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < letters.length; i++){
        var a = letters[i];
        a.draw();
    }
}

setInterval(draw, 10);