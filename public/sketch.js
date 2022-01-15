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
let island;
let enemy;

let enemyReceived=[];
let ilhasReceived=[];
let enemyExist = false;
let ilhasExist = false;

let arrEnemies = [];
let arrIsland = [];
let images = [];

function preload(){

  //delete everything in database in table positions
  
  /* httpDo('/deletePositions', 'DELETE', function(response){
    print("response",response);
  }); 
 */

  //fazer load das imagens
  images[0]=loadImage('https://i.ibb.co/Ydh3Crs/island.png'); //ilhas
  images[1]=loadImage('https://i.ibb.co/FmX47db/enemy.png'); //enemy
  images[2]=loadImage('https://i.ibb.co/K9r38JD/background.png'); //background
  images[3]=loadImage('https://i.ibb.co/vkLDdmN/boat.png'); //boat

  //adicionar inimigos
  for(let enmy=0;enmy<6;enmy++){
      
        let rx = int(random(0, 8));
        let ry = int(random(0, 8));
        let enemy={
          "posX":rx,
          "posY":ry,
        }
        if (arrEnemies.length > 0) {
          if (compareEnemy(enemy)) {
            arrEnemies.push(enemy);
          } else if(enemy.posX == 0 && enemy.posY==0) {
            enmy--;
            print("0,0", enemy.posX, enemy.posY);
          } else {
            enmy--;
            print("igual")
          }
        } else {
          arrEnemies.push(enemy);
        }
        print(enemy)

        httpPost('/insertEnemy','json',enemy,(resposta)=>{

        });
      
    
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

  for(let ilh=0;ilh<=5;ilh++){

        let rx = int(random(1, 9));
        let ry = int(random(1, 9));
        let island={
          "posX":rx,
          "posY":ry,
        }
        if (arrIsland.length > 0) {
          if (compareIsland(island)) {
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
    if (arrEnemies[i].posX == enemy.posX && arrEnemies[i].posY == enemy.posY) {
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

  if (flag == 0) {
    return true;
  } else {
    return false;
  }
}

function setup() {
  createCanvas(screenx, screeny);


  constructBoard();

  print(arrTiles);

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
  

  
  //nearEnemy();

  //text Goal ou colocar a imagem de uma meta
  //stroke(0);
  //fill(150 + sin(frameCount * 0.1) * 100);
  //stroke(0);
  //textSize(31);
  //text("Goal", 527, 595);
}

function keyPressed() {

  if (keyCode === RIGHT_ARROW){
    loadJSON('/getBoat',(dataDoServidor)=>{

      let boat=dataDoServidor;

      let bx=boat[0].posX;
      let by=boat[0].posY;

      if(bx>=0 || bx<9 ){
        arrTiles[bx][by].img=images[2]; //posiçao anterior para mar
        bx++;

        let boatpos = {
          posX:bx,
          posY:by
        }

        arrTiles[bx][by].img=images[3]; //adicionar imagem a posiçao a seguir

        httpDo('/updateBoat','PUT', 'json', boatpos, (res)=>{
         
        });

           
        //compareBoatEnemy
        //compareBoatIlha

      }else{
        bx--;
        arrTiles[bx][by].img=images[3]
      }
    })
  }

   if (keyCode === LEFT_ARROW){
    loadJSON('/getBoat',(dataDoServidor)=>{
      let boat=dataDoServidor;

      let bx=boat[0].posX;
      let by=boat[0].posY;

      if(bx>0 || bx<9){
        arrTiles[bx][by].img=images[2]; //posiçao anterior para mar

      bx--;
      arrTiles[bx][by].img=images[3];

      boatpos = {
        posX:bx,
        posY:by
      }

      print(boatpos);

      httpDo('/updateBoat','PUT', 'json', boatpos, (res)=>{

      });
      }else{

      }

      
    })
  }

  if (keyCode === DOWN_ARROW){
    loadJSON('/getBoat',(dataDoServidor)=>{
      let boat=dataDoServidor;

      let bx=boat[0].posX;
      let by=boat[0].posY;

      arrTiles[bx][by].img=images[2]; //posiçao anterior para mar

      by++;
      arrTiles[bx][by].img=images[3];

      boatpos = {
        posX:bx,
        posY:by
      }

      print(boatpos);

      httpDo('/updateBoat','PUT', 'json', boatpos, (res)=>{

      });
    })
  }

  if (keyCode === UP_ARROW){
    loadJSON('/getBoat',(dataDoServidor)=>{
      let boat=dataDoServidor;

      let bx=boat[0].posX;
      let by=boat[0].posY;

      arrTiles[bx][by].img=images[2]; //posiçao anterior para mar

      by--;
      arrTiles[bx][by].img=images[3];

      boatpos = {
        posX:bx,
        posY:by
      }

      print(boatpos);

      httpDo('/updateBoat','PUT', 'json', boatpos, (res)=>{

      });
    })
  }
  
}

function compareBoatEnemy(boatpos){
  let flag = 0;
  print(arrEnemies);
  for(let i=0; i<arrEnemies.length; i++){
    if (arrEnemies[i].posX == boatpos.posX && arrEnemies[i].posY == boatpos.posY) {
      flag = 1;
    }
  }
  if (flag == 0) {
    return true;
  } else {
    return false;
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
  }
 
  draw_Tile(){
    image(this.img,this.x,this.y,this.s,this.s);
    fill(this.clr);
    square(this.x,this.y,this.s);
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

