//creating global variables
var dog, happyDog;
var foodS, foodStock;
var database;
var lastFed;
var gameState = 0;
var dogSitting_img, dogHappy_img, sadDog_img, Bedroom_img, Garden_img, Restroom_img;

function preload()
{
  //loading the images
  dogSitting_img = loadImage("images/dogImg.png");
  dogHappy_img = loadImage("images/dogImg1.png");
  Bedroom_img = loadImage("images/Bed Room.png");
  Garden_img = loadImage("images/Garden.png");
  Restroom_img = loadImage("images/Wash Room.png");
  sadDog_img = loadImage("images/sad_dog_image.png");
}

function setup(){

  createCanvas(500, 500);

  //assigning firebase database to variable database
  database=firebase.database();

  //Getting foodStock from the database 
  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

  foodObj = new Food();
  //foodObj.addImage(milkBottles);

  //creating a dog sprite with a given image
  dog = createSprite(250,350,30,30);
  dog.addImage(dogSitting_img);
  dog.scale = 0.2;

  feed = createButton("Feed the dog");
  feed.position(670,95);
  feed.mousePressed(()=>{
    feedDog();
    foodObj.deductFood();
  })

  addFood = createButton("Add Food");
  addFood.position(770,95);
  addFood.mousePressed(()=>{
    addFoods();
  })

  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  })

  readState=database.ref('gameState');
  readState.on("value", function(data){
    gameState=data.val();
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}

function draw(){

  background(46,139,87);
  
  //changing the dog image when up arrow is pressed
  if(keyWentDown(UP_ARROW)){
    writeStock(foodS);
    dog.addImage(dogHappy_img);
  }

  currentTime=hour();
if(currentTime == (lastFed + 1)){
  update("Playing");
  foodObj.Garden_img();
}
else if(currentTime == (lastFed + 2)){
  update("Sleeping");
    foodObj.Bedroom_img();
}
else if(currentTime > (lastFed + 2) && currentTime<= (lastFed)){
  update("Bathing");
    foodObj.Restroom_img();
}
else{
  update("Hungry");
    foodObj.display();
}

if(gameState!="Hungry"){
  feed.hide();
  addFood.hide();
  dog.remove();
}
else{
  feed.show();
  addFood.show();
  dog.addImage(sadDog_img);
}
  
  drawSprites();
  //add styles here

  //text to instuct
  fill("White");
  text("Note: Press UP_ARROW Key to feed Scooby Milk!", 120, 30);

  //text to display remaining food
  fill("White");
  text("Food remaining: " + foodS, 200, 250);
}

//Function to read values from database
function readStock(data){
  foodS = data.val();
}

//Function to write values in database
function writeStock(x){

  if(x<=0){
    x = 0;
  }
  else{
    x--; 
  }

  database.ref('/').update({
    Food:x,
    FeedTime: hour()
  })
}



