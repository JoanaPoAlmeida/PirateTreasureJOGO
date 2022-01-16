//colocar todos os coments em ingles
//é necessário dividir isto por varios ficheiros
//é necessário colocar nuvens em cima das ilhas e inimigos
//é necessário fazer uma pagina inicial com um botao start, pagina home.js
//organização mapa da jogo (em papel)
//é necessário fazer o nível extra

//const { text } = require("body-parser");

//const { text } = require("body-parser");


let pontuacao = 0;

//screen siize
const screenx = 600;
const screeny = 600;

//array da board
let arrTiles=[];

//intial postion boat
let px = 0;
let py = 0;

//tiles size
var w=screenx/8;
var h=screeny/8;

//images
let island;
let enemy;

let enemyReceived=[];
let ilhasReceived=[];
let enemyExist = false;
let ilhasExist = false;

let arrEnemies = [];
let arrIsland = [];
let images = [];

let song = [];

function preload(){

  //fazer load das imagens
  images[0]=loadImage('https://i.ibb.co/Ydh3Crs/island.png'); //ilhas
  images[1]=loadImage('https://i.ibb.co/FmX47db/enemy.png'); //enemy
  images[2]=loadImage('https://i.ibb.co/K9r38JD/background.png'); //background
  images[3]=loadImage('https://i.ibb.co/vkLDdmN/boat.png'); //boat
  images[4]=loadImage('https://i.ibb.co/K5bYFsL/nuvens-1.png') //nuvens
  images[5]=loadImage('http://localhost:3001/public/img/boatred.jpg')

  //load da musica
  song[0]= loadSound('http://localhost:3001/public/sound/ptsong.mp3');
  song[1]= loadSound('http://localhost:3001/public/sound/fail.mp3');
  song[2]= loadSound('http://localhost:3001/public/sound/win.wav');
  

  //adicionar inimigos
  for(let enmy=0;enmy<6;enmy++){
      
        let rx = int(random(0, 7));
        let ry = int(random(0, 7));
        let enemy={
          "posX":rx,
          "posY":ry,
        }

        if(enemy.posX == 0 && enemy.posY == 0 || enemy.posX == 1 && enemy.posY == 0 || enemy.posX == 0 && enemy.posY == 1){
            enmy--;
            print("proibido",enemy);
          }else{
            if (arrEnemies.length > 0) {
          
          if (compareEnemy(enemy)) {
            

            arrEnemies.push(enemy);
          } else {
            enmy--;
            print("igual")
          }
        } else {
          arrEnemies.push(enemy);
        }
          }
        
        print("adicionado:",enemy)


        httpPost('/insertEnemy','json',enemy,(resposta)=>{

        });

        
      
    
  }
  

  loadJSON('/getEnemy',(dataDoServidor)=>{

    if(dataDoServidor.length>0){
     
      enemyReceived=dataDoServidor;
      console.log("enemies after get:   ", enemyReceived)
      enemyExist = true;
      
    }else{
      console.log("no enemies");
    }
  
  })

  //adicionar ilhas

  for(let ilh=0;ilh<=5;ilh++){

        let rx = int(random(0, 7));
        let ry = int(random(0, 7));
        let island={
          "posX":rx,
          "posY":ry,
        }
        if (arrIsland.length > 0) {
          if((island.posX === 0 && island.posY === 0)||(island.posX === 1 && island.posY === 0)||(island.posX === 0 && island.posY === 1)){
            ilh--;
            print("proibido ilha",island);
          }else if (compareIsland(island)) {
            arrIsland.push(island);
          } else {
            ilh--;
            print("igual")
          }
        } else {
          arrIsland.push(island);
        }
        print(island)

      
        httpPost('/insertIsland','json',island,(resposta)=>{

        });
  }
  



loadJSON('/getIsland',(dataDoServidor)=>{

  if(dataDoServidor.length>0){
   
    ilhasReceived=dataDoServidor;
    console.log("ilhas:   ", ilhasReceived)
    ilhasExist = true;
    
  }else{
    console.log("no islands");
  }

})
}

function compareEnemy(enemy) {
  let flag = 0;

  for (let i = 0; i < arrEnemies.length; i++) {
    if (arrEnemies[i].posX == enemy.posX && arrEnemies[i].posY == enemy.posY ) {
      flag = 1;
    } 
  }
  for (let i = 0; i < ilhasReceived.length; i++) {
    if (ilhasReceived[i].posX == enemy.posX && ilhasReceived[i].posY == enemy.posY) {

      flag = 1;
    }
  }

  if (flag == 0) {
    return true;
  } else {
    return false;
  }
}

function compareIsland(island) {
  let flag = 0;

  for (let i = 0; i < arrIsland.length; i++) {
    if (arrIsland[i].posX == island.posX && arrIsland[i].posY == island.posY) {
      flag = 1;
    }
  }
  //print("from compareisland",arrEnemies)
  for (let i = 0; i < enemyReceived.length; i++) {
    if (enemyReceived[i].posX == island.posX && enemyReceived[i].posY == island.posY ) {
      flag = 1;
    } 
  }

  if (flag == 0) {
    return true;
  } else {
    return false;
  }
}

function setup() {
  createCanvas(screenx, screeny);

  song[0].play();
  song[0].setVolume(0.3);
  
  
  

  constructBoard();

  print(arrTiles);

  for(let x=0;x<=7;x++){
    for(let y=0;y<=7;y++){
      arrTiles[x][y].img=images[4];
    }
  }

   

  arrTiles[0][0].img=images[3];
  let boatpos = {
    posX: 0,
    posY: 0
  }
  httpDo('/updateBoat','PUT', 'json', boatpos, (response)=>{

  });

  keyPressed();
}





function draw() {
  //background color
  background(0);
  background(145, 187, 199);


  //grid 8X8
  drawBoard();

  
}


function keyPressed() {

  getAudioContext().resume();

  if (keyCode === RIGHT_ARROW){
    
    loadJSON('/getBoat',(dataDoServidor)=>{

      let boat=dataDoServidor;
      let bx=boat[0].posX;
      let by=boat[0].posY;

      bx++;

      if(bx<=7){ 
        let boatpos = {
          posX:bx,
          posY:by
        }
        if(compareBoatEnemy(boatpos)){
          
        }else if(compareBoatIlha(boatpos)){
          
        }
        else{
          if(nearEnemy(boatpos)){   
            print(nearEnemy(boatpos));  
            arrTiles[bx][by].img=images[3].filter();
          }else{
            arrTiles[bx][by].img=images[3].filter();
          }
          arrTiles[bx][by].img=images[3]; //adicionar imagem a posiçao a seguir

          httpDo('/updateBoat','PUT', 'json', boatpos, (res)=>{

          });

          bx--;
          arrTiles[bx][by].img=images[4]; //posiçao anterior para mar
        }
        //compareBoatIlha

      }else{
        print("out of sketch");
      }
    })
  }

   if (keyCode === LEFT_ARROW){
     
    loadJSON('/getBoat',(dataDoServidor)=>{

      let boat=dataDoServidor;

      let bx=boat[0].posX;
      let by=boat[0].posY;

      bx--;

      if(bx>=0){
        
        let boatpos = {
          posX:bx,
          posY:by
        }
        if(compareBoatEnemy(boatpos)){
        }else if(compareBoatIlha(boatpos)){
        }
        else{

          if(nearEnemy(boatpos)){   
            print(nearEnemy(boatpos));  
            arrTiles[bx][by].img=images[3].filter();
          }else{
            arrTiles[bx][by].img=images[3].filter();
          }
          arrTiles[bx][by].img=images[3]; //adicionar imagem a posiçao a seguir


          httpDo('/updateBoat','PUT', 'json', boatpos, (res)=>{

          });

          bx++;
          arrTiles[bx][by].img=images[4]; //posiçao anterior para mar
        }
        //compareBoatIlha

      }else{
        print("out of sketch");
      }
    })
  }

  if (keyCode === DOWN_ARROW){
    loadJSON('/getBoat',(dataDoServidor)=>{

      let boat=dataDoServidor;

      let bx=boat[0].posX;
      let by=boat[0].posY;

      by++;

      if(by<=7){
        
        let boatpos = {
          posX:bx,
          posY:by
        }
        if(compareBoatEnemy(boatpos)){
          //print("true: collision with an enemy");
        }else if(compareBoatIlha(boatpos)){
          //print("true: collision with na island");
        }else if(nearEnemy(boatpos)){
          print(nearEnemy(boatpos));

          
          
          arrTiles[bx][by].img=images[5];

          httpDo('/updateBoat','PUT', 'json', boatpos, (res)=>{

          });

          by--;
          arrTiles[bx][by].img=images[4]; //posiçao anterior para mar
        }
        else{

          bx++

          arrTiles[bx][by].img=images[3]; //adicionar imagem a posiçao a seguir


          httpDo('/updateBoat','PUT', 'json', boatpos, (res)=>{

          });

          by--;
          arrTiles[bx][by].img=images[4]; //posiçao anterior para mar
        }
        

      }else{
        print("out of sketch");
      }
    })
  }

  if (keyCode === UP_ARROW){
    loadJSON('/getBoat',(dataDoServidor)=>{

      let boat=dataDoServidor;

      let bx=boat[0].posX;
      let by=boat[0].posY;

      by--;

      if(by>=0){
        
        let boatpos = {
          posX:bx,
          posY:by
        }
        if(compareBoatEnemy(boatpos)){
          //print("true: collision with an enemy");
        }else if(compareBoatIlha(boatpos)){
          //print("true: collision with na island");
        }
        else{

          if(nearEnemy(boatpos)){   
            print(nearEnemy(boatpos));  
            arrTiles[bx][by].img=images[3].filter();
          }else{
            arrTiles[bx][by].img=images[3].filter();
          }

          //print("false: there was no collision");
          //print(boatpos)
          arrTiles[bx][by].img=images[3]; //adicionar imagem a posiçao a seguir


          httpDo('/updateBoat','PUT', 'json', boatpos, (res)=>{

          });

          by++;
          arrTiles[bx][by].img=images[4]; //posiçao anterior para mar
        }
        

      }else{
        print("out of sketch");
      }
    })
  }
}

function dontmove(){
  if(keyCode=== RIGHT_ARROW){

  }
  if(keyCode === LEFT_ARROW){

  }
  if(keyCode === UP_ARROW){

  }
  if(keyCode === DOWN_ARROW){

  }
}

function compareBoatEnemy(boatpos){
  let flag = 0;
  for(let i=0; i<enemyReceived.length; i++){
    if (enemyReceived[i].posX === boatpos.posX && enemyReceived[i].posY === boatpos.posY) {
      arrTiles[enemyReceived[i].posX][enemyReceived[i].posY].img=images[1];
      flag = 1;
      
      pontuacao=pontuacao-50;
      pontuation(pontuacao);

    }
  }
  if (flag == 0) {
    return false; //nao ha enemy naquela posiçao
  } else {
    return true; //há enemy naquela posiçao
  }
}

function compareBoatIlha(boatpos){
  let flag = 0;

  
  for(let i=0; i<ilhasReceived.length; i++){
    if (ilhasReceived[i].posX === boatpos.posX && ilhasReceived[i].posY === boatpos.posY) {
      arrTiles[ilhasReceived[i].posX][ilhasReceived[i].posY].img=images[0];
      flag = 1;
      
      pontuacao=pontuacao+100;
      pontuation(pontuacao);

    }
  }

  if (flag == 0) {
    return false; //nao ha enemy naquela posiçao
  } else {
    return true; //há enemy naquela posiçao
  }
}

function pontuation(pont){

  pontos = {
    "pont": pont
  }
  print(pontos)
  httpDo('/addPontuacao','PUT', 'json', pontos, (res)=>{
    print(res);
  })

  if(pont<=0){

    song[0].stop();
    song[1].play();
    dontmove();
    for(let x=0;x<=7;x++){
      for(let y=0;y<=7;y++){
        arrTiles[x][y].img=images[2];
        arrTiles[x][y].txt="you lost";

        stroke(0);
        fill(150 + sin(frameCount * 0.2) * 100);
        stroke(0);
        textSize(20);
        text("YOU LOST", x, y);
      }
    }

    if(enemyExist){
      console.log("enemy", enemyReceived)
      for(let x=0;x<enemyReceived.length;x++){
  
        arrTiles[enemyReceived[x].posX][enemyReceived[x].posY].img=images[1];
  
      }
    }
    if(ilhasExist){
      console.log("island", ilhasReceived)
      for(let x=0;x<ilhasReceived.length;x++){
  
        arrTiles[ilhasReceived[x].posX][ilhasReceived[x].posY].img=images[0];
        
      }
    }

    loadJSON('/getBoat',(dataDoServidor)=>{

      let boat=dataDoServidor;

      let bx=boat[0].posX;
      let by=boat[0].posY;

      arrTiles[bx][by].img=images[3]

    });
    

    text('YOU LOST', screenx/2, screeny/2);

    httpPost('/lostButton', 'json', pontos, (res)=>{
      
    })
    print("you lost")//show button to restart the game
  }

  if(pont>=500){
    song[0].stop();
    song[2].play();
    for(let x=0;x<=7;x++){
      for(let y=0;y<=7;y++){
        arrTiles[x][y].img=images[2];
        arrTiles[x][y].txt="you won";

        stroke(0);
        fill(150 + sin(frameCount * 0.2) * 100);
        stroke(5);
        textSize(20);
        text("YOU WON", x, y);
      }
    }

    if(enemyExist){
      console.log("enemy", enemyReceived)
      for(let x=0;x<enemyReceived.length;x++){
  
        arrTiles[enemyReceived[x].posX][enemyReceived[x].posY].img=images[1];
  
      }
    }
    if(ilhasExist){
      console.log("island", ilhasReceived)
      for(let x=0;x<ilhasReceived.length;x++){
  
        arrTiles[ilhasReceived[x].posX][ilhasReceived[x].posY].img=images[0];
        
      }
    }
  }
}



function constructBoard(){
  
  for(let x=0;x<=9;x++){
    arrTiles[x]=[];
    for(let y=0;y<=9;y++){
      arrTiles[x][y]= new Tile(x+(x*w),y+(y*h),x,y,w);
    }
  }
  
}

function drawBoard(){
  for(let x=0;x<=9;x++){
    for(let y=0;y<=9;y++){
      arrTiles[x][y].draw_Tile();
    }
  }
  
}

class Tile{  
  constructor(x,y,i,j,s){
    
    this.x=x;
    this.y=y;
    this.i=i;
    this.j=j;
    this.s=s;
    this.clr="#e0d57b00";
    this.img=images[2];
    this.txt="";
  }
 
  draw_Tile(){
    text(this.txt,this.x, this.y);
    image(this.img,this.x,this.y,this.s,this.s);
    fill(this.clr);
    square(this.x,this.y,this.s);
  }

}


function nearEnemy(boatpos){

  let flag = 0;
  for(let i=0; i<enemyReceived.length; i++){

    bx = boatpos.posX;
    by = boatpos.posY;

    if( bx == enemyReceived[i].posX+1 || bx== enemyReceived[i].posX-1 || by== enemyReceived[i].posY+1 || by== enemyReceived[i].posY-1){
      flag = 1;
    }
  }
  if (flag == 0) {
    return false; //nao ha enemy naquela posiçao
  } else {
    return true; //há enemy naquela posiçao
  }

  
  
}



