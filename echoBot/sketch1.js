let input;
let send;
let sentText;
let userLines = [];
let sound;
let userTextArr = [];

let startFlag = false;


//firebase Stuff
let database, ref;
let disclaim = "this information is being saved on a public database";

let shareLines;

class UserText{
  constructor(text,x,y, frame_0){
    this.text = text;
    this.x = x;
    this.y = y;
    this.colorFade = 255;
    this.frame_0 = frame_0;
  }
  display(){
    fill(150,150,150,this.colorFade-(frameCount - this.frame_0));
    text(this.text, this.x,this.y);
  }
}


function preload(){
  sound = loadSound("caveSounds.mp3");

}

function setup() {


  createCanvas(windowWidth, windowHeight);
  input = createInput("hello..?");
  input.position(width/2 - input.width/2, height/2-input.height/2);
  input.style('background-color', color(50,50,50));
  input.style('color', color(200));
  send = createButton("send");
  send.position(width/2 - send.width/2, height/2 + 20);
  send.style('background-color', color(50,50,50));
  send.style('color', color(200));
  send.mousePressed(talk);

  shareLines = createButton("send to database");
  shareLines.position(width/2 - shareLines.width/2, height-100);
  shareLines.style('background-color', color(50,50,50));
  shareLines.mousePressed(sendData);

  //configure firebase
  fireConfig();
  database = firebase.database();
  ref = database.ref("userLine");
  ref.on("value", gotData);

}

function draw() {
  sound.play();
  sound.loop();
  //noLoop();

  //cave effect
  background(50);
  for (let i = 50; i>0; i--){
    noStroke();
    fill(i)
    //stroke(255);
    rectMode(CENTER);
    let rectHeight = height-10*(50-i)
    ellipse(width/2, height/2, width-10*(50-i), rectHeight);
    if (rectHeight < 10){
      break
    }
  }
  //hide for

  welcome();
  if (userTextArr.length>0){
    for (let i = 0; i<userTextArr.length; i++){
      userTextArr[i].display();
    }
  }
}


function welcome(){
  if (startFlag == false){
    input.hide();
    send.hide();
    shareLines.hide();

    //move back to draw


    fill(0);
    strokeWeight(1);
    stroke(50);
    let wind0w = rect(width/2, height/2, width/3, height/3, 20);
    noStroke();
    fill(150);
    textAlign(CENTER);
    let str = "you have woken up in a dark cave. you don't know how you got here. you cannot see a thing. are you alone in here? \n\n press anywhere to begin"
    text(str, width/2, height/2, width/3 - 50, height/3 - 100);
  }


}

function talk(){
  if (input.value()){
    userLines.push(input.value());
    //fill(200);
    userTextArr.push(new UserText(
      input.value(),
      random(width), random(height),
      frameCount));
    //userTextArr[userTextArr.length - 1].display();
  }
}

function keyTyped(){
  if (keyCode == ENTER){
    talk();
  }
}

function mousePressed(){
  if (startFlag == false){
    startFlag = true;
    input.show();
    send.show();
    shareLines.show();

    // background(50);
    // for (let i = 50; i>0; i--){
    //   noStroke();
    //   fill(i)
    //   //stroke(255);
    //   rectMode(CENTER);
    //   let rectHeight = height-10*(50-i)
    //   ellipse(width/2, height/2, width-10*(50-i), rectHeight);
    //   if (rectHeight < 10){
    //     break
    //   }
    //}
  }
}

function sendData(){
  ref.push(userLines);
  console.log(userLines);
}

function gotData(data){
  let incomingData = data.val();
  console.log(incomingData);
  let keys = Object.keys(incomingData);
  let lastKey = keys[keys.length - 1];
  userLines = incomingData[lastKey];
}

function fireConfig(){
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAysA-bLDaLRtlS9V7N0Hx-L_Xuw8juz28",
    authDomain: "echobase-d6bb5.firebaseapp.com",
    databaseURL: "https://echobase-d6bb5-default-rtdb.firebaseio.com",
    projectId: "echobase-d6bb5",
    storageBucket: "echobase-d6bb5.appspot.com",
    messagingSenderId: "687846702343",
    appId: "1:687846702343:web:11d803f77ebe9bb123d9a2"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
}
