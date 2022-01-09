//colocar todos os coments em ingles
//é necessário dividir isto por varios ficheiros
//é necessário colocar nuvens em cima das ilhas e inimigos
//é necessário fazer uma pagina inicial com um botao start, pagina home.js
//organização mapa da jogo (em papel)
//é necessário fazer o nível extra




const pontuacao = 0;

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
let boat;
let island;
let enemy;

let enemyReceived=[];
let ilhasReceived=[];
let enemyExist = false;
let ilhasExist = false;

var lr=0;
var stap = 20;
var stop = 600;

function preload(){

  //adicionar inimigos
  for(let enmy=0;enmy<6;enmy++){
      for(let x=0;x<8;x++){
      for(let y=0;y<8;y++){
        rx=random(1,8);
        ry=random(1,8);
        let enemy={
          "posX":rx,
          "posY":ry,
        }
        httpPost('/insertEnemy','json',enemy,(resposta)=>{

        });
      }
    }
  }
  

  loadJSON('/getEnemy',(dataDoServidor)=>{

    if(dataDoServidor.length>0){
     
      enemyReceived=dataDoServidor;
      console.log("enemies:   ", enemyReceived)
      enemyExist = true;
      
    }else{
      console.log("no enemies");
    }
  
  })

  //adicionar ilhas

  for(let ilh=0;ilh<5;ilh++){
    for(let x=0;x<8;x++){
      for(let y=0;y<8;y++){
        ix=random(1,8);
        iy=random(1,8);
        let island={
          "posX":ix,
          "posY":iy,
        }
        httpPost('/insertIsland','json',island,(resposta)=>{

        });
      }
  }
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
function setup() {
  createCanvas(screenx, screeny);

  //load images
  boat = loadImage('https://i.ibb.co/vkLDdmN/boat.png');
  island = loadImage('https://i.ibb.co/Ydh3Crs/island.png');
  enemy = loadImage('https://i.ibb.co/FmX47db/enemy.png');
  back = loadImage('https://i.ibb.co/K9r38JD/background.png');

  constructBoard();
  print(arrTiles);

  if(enemyExist){
    console.log("enemy", enemyExist)
    for(let x=0;x<enemyReceived.length;x++){

      //arrTiles[enemyReceived[x].posX][enemyReceived[x].posY].clr=0;
      arrTiles[enemyReceived[x].posX][enemyReceived[x].posY].img=loadImage('https://i.ibb.co/FmX47db/enemy.png');

      //console.log("this is arrTiles:",arrTiles[enemyReceived[x].posX][enemyReceived[x].posY].img);
    }
  }
  if(ilhasExist){
    console.log("island", ilhasExist)
    for(let x=0;x<ilhasReceived.length;x++){

      arrTiles[ilhasReceived[x].posX][ilhasReceived[x].posY].img=loadImage('https://i.ibb.co/Ydh3Crs/island.png');
      
      //console.log("this is arrTiles:",arrTiles[ilhasReceived[x].posX][ilhasReceived[x].posY].img);
    }
  }

}

function draw() {
  //background color
  background(0);
  background(212, 241, 249);

  //Displays 5 island randomly not in the 1st, 2nd sqaures, in future change to FOR
  //image(island, rx1, ry1, 75, 75);
  //image(island, rx11, ry11, 75, 75);
  //image(island, rx2, ry2, 75, 75);
  //image(island, rx3, ry3, 75, 75);
  //image(island, rx4, ry4, 75, 75);

  //grid 8X8
  drawBoard();

  //nearEnemy();

  //Displays 6 island randomly not in the 1st, 2nd sqaures, in future change to FOR
  //image(enemy, ex1, ey1, 75, 75);
  //image(enemy, ex2, ey2, 75, 75);
  //image(enemy, ex3, ey3, 75, 75);
  //image(enemy, ex4, ey4, 75, 75);
  //image(enemy, ex5, ey5, 75, 75);
  //image(enemy, ex6, ey6, 75, 75);

  //Displays the image boat
  image(boat, px, py, w, h);

  //text Goal ou colocar a imagem de uma meta
  //stroke(0);
  //fill(150 + sin(frameCount * 0.1) * 100);
  //stroke(0);
  //textSize(31);
  //text("Goal", 527, 595);
}



function constructBoard(){
  
  for(let x=0;x<8;x++){
    arrTiles[x]=[];
    for(let y=0;y<8;y++){
      arrTiles[x][y]= new Tile(x+(x*w),y+(y*h),x,y,w);
    }
  }
  
}

function drawBoard(){
  for(let x=0;x<8;x++){
    for(let y=0;y<8;y++){
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
    this.img=loadImage('https://i.ibb.co/K9r38JD/background.png');
  }
 
  draw_Tile(){
    image(this.img,this.x,this.y,this.s,this.s);
    fill(this.clr);
    square(this.x,this.y,this.s);
  }
}

function keyPressed() {
  //console.log(px + 25);
  //console.log(py + 25);
  /* if (px < 475) {
    if (keyCode === RIGHT_ARROW) {
      px = px + w;
    }
  } */
  if (px > 25) {
    if (keyCode === LEFT_ARROW) {
      px = px - w;
    }
  }
  if (py > 25) {
    if (keyCode === UP_ARROW) {
      py = py - height/8;
    }
  }
  if (py < 475) {
    if (keyCode === DOWN_ARROW) {
      py = py + height/8;
    }
  }
  console.log("x: "+px+"y: "+py);
}

function hitEnemy(){
  if (px < w-75) {
    if (keyCode === RIGHT_ARROW) {
      for(let x=0;x<enemyReceived.length;x++){
        console.log("this is posX",arrTiles[enemyReceived[x].posX])
        if(arrTiles[enemyReceived[x].posX]==px+w && arrTiles[enemyReceived[y].posY]==py-w){

        }else{
          px = px + w;
        }
      }
    }
  }
  if (px > 25) {
    if (keyCode === LEFT_ARROW) {
      px = px - w;
    }
  }
  if (py > 25) {
    if (keyCode === UP_ARROW) {
      py = py - height/8;
    }
  }
  if (py < w-75) {
    if (keyCode === DOWN_ARROW) {
      py = py + height/8;
    }
  }
}

function nearEnemy(){

  for(let x=0;x<8;x++){
    for(let y=0;y<8;y++){
      arrTiles[x][y].clr=191 + sin(frameCount * 0.1) * 50;
    }
  }
  
}
function hitIsland(){
  //aparece a uma tela com start nível bónus 
  //depois aparece a ilha para coletar as moedas 
  //cada moeda vai valer 10 pontos
  //depois volta ao jogo
}

function pontuation(){
  //Calcular a pontuação
  //a funçao hitIsland vai devolver um 1
  //if(hit == 1)
  //pontuacao = pontuacao + 100;
  //Quando chega a uma ilha aumenta a pontuação
  
  //a funçao hitEnemy devolve '0'
  //if(hit == 0)
  //Quando bate no inimigo perde pontos
}

