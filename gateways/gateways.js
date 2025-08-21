// #region draw/step event
function main() //runs every frame
{
    
    switch(gameState)
    {
        
        case "menu":
            if(keyMap[" "])
            {
                gameState="transition";
            }
            break;
        case "game":        
            playerScript();
            for(var i=0;i<objs.length;i++)
            {
                objs[i].move(); 
            }
            updateCamera();
            if(Player.p.y>tw*(tmap.length-2))
            {
                gameState="question";
            }
            if(playerHealth<=0)
            {
                gameState="transition";
            }
            if(progress==11 && Player.p.y<10*tw && Player.p.x<5*tw)
            {
                progress++;
                gameState="end";
            }
            
            break;
        case "transition":
            transition();
            break;
        case "question":
            if(keyMap.q)
            {
                if(progress<10){breads[progress]=false;}
                gameState="transition";
            }
            else if(keyMap.e)
            {
                progress++;
                gameState="transition";
            }
            break;
        case "end":
            if(keyMap[" "])
            {
                window.location.href="game.html";
            }
        break;
    }
    //game

    //rendering
    clear();
    draw();
    //keeping track of time
    t++;

    
}

function clear() //reset canvas
{
    m.width=w; 
    mctx.fillStyle="red";
    mctx.strokeStyle="empty";
}

function draw() //render layer by layer, and portal
{
    //bg layer
    if(gameState=="menu"){mctx.drawImage(document.getElementById("menuscreen"),0,0);}else
    {
    //object layer
    for(var i=0;i<objs.length;i++)
    {   
        switch(objs[i].constructor)
        {
            case Barrier:
                var color;    
                if(objs[i].active){color="red"}
                else{color="pink";}
                mctx.beginPath();
                mctx.moveTo(objs[i].coord-camX,0);
                mctx.lineTo(objs[i].coord-camX,h);
                mctx.strokeStyle=color;
                mctx.stroke();
                mctx.closePath();
            break;
            case Plate:
                mctx.drawImage(document.getElementById("plate-"+String(objs[i].active)),
                objs[i].tile.x*tw-camX,
                objs[i].tile.y*tw-camY
                )
            break;
            case Ascender:
                for(var j=0; j<objs[i].tiles.length;j++)
                {
                    mctx.drawImage(document.getElementById("ascenderTile"),
                    objs[i].tiles[j].x*tw-camX,
                    objs[i].tiles[j].y*tw-camY
                    )
                }
            break;
            case Slime:
                for(var j=0; j<objs[i].tiles.length;j++)
                {
                    mctx.drawImage(document.getElementById("slimeTile-"+objs[i].ori),
                    objs[i].tiles[j].x*tw-camX,
                    objs[i].tiles[j].y*tw-camY
                    )
                }
            break;
            case Neru:
                objs[i].sprite.rPos.x=objs[i].p.x-camX;
                objs[i].sprite.rPos.y=objs[i].p.y-camY;
                drawSprite(objs[i].sprite);
                
                mctx.drawImage(document.getElementById("anvil"),7.5*tw-camX,objs[i].anvil.y-camY)
                if(objs[i].anvil.state=="being" || objs[i].anvil.state=="lowered")
                {
                    mctx.beginPath();
                    mctx.strokeStyle="dark_gray";
                    mctx.moveTo(tw*8,0)
                    mctx.lineTo(tw*8,objs[i].anvil.y-camY);
                    mctx.stroke();
                    mctx.closePath();
                }
                if(objs[i].anvil.state=="exploding")
                {
                    mctx.drawImage(document.getElementById("exp"+String(Math.floor(objs[i].anvil.frame/1))),8*tw-192/2-camX,objs[i].anvil.y-tw-camY)
                }

            break;
            case Textbox:
                //
            break;
            case BreadDoor:
            break;
            default:
                objs[i].sprite.rPos.x=objs[i].p.x-camX;
                objs[i].sprite.rPos.y=objs[i].p.y-camY;
                drawSprite(objs[i].sprite);
            break;
        }
        
           
        
    }
    for(var i=0;i<homages.length;i++)
    {
        drawSprite(homages[i])
    }
    homages=[];
    //portals
        var colors=["blue","orange"]
        //tmap layer
        for(var y=0;y<tmap.length;y++)
        {
        for(var x=0;x<tmap[0].length;x++)
        {
            if(tmap[y][x]=="a"){continue;} //air tile, nothing should be drawn
            mctx.drawImage(document.getElementById("tile-"+tmap[y][x]),x*tw-camX,y*tw-camY); //draw correct tile sprite
        }
        }
        for(var i=0;i<2;i++)
        {
            pColor=colors[i]
            if(P[pColor].placed)
            {
                for(var j=0;j<P[pColor].tiles.length;j++) // portal tiles
                {
                    var tile=P[pColor].tiles[j];
                    
                    var imgString=pColor+"("+String(P[pColor].out.x)+";"+String(P[pColor].out.y)+")";
                    mctx.drawImage(document.getElementById("tile-p"), tile.x*tw-camX,tile.y*tw-camY);
                    mctx.drawImage(document.getElementById(imgString), tile.x*tw-camX,tile.y*tw-camY);
                    if(P[pColor].active)
                        {
                            imgString=pColor+"("+String(-P[pColor].out.x)+";"+String(-P[pColor].out.y)+")";
                            //mctx.drawImage(document.getElementById(imgString), (tile.x+P[pColor].out.x)*tw-camX,(tile.y+P[pColor].out.y)*tw-camY);
                        }
                    
                }
                var topX=((P[pColor].tiles[0].x*tw+tw/2)+(P[pColor].tiles[1].x*tw+tw/2))/2-tw/2+P[pColor].up.x*(tw/2);
                var topY=((P[pColor].tiles[0].y*tw+tw/2)+(P[pColor].tiles[1].y*tw+tw/2))/2-tw/2+P[pColor].up.y*(tw/2);
                var imgString=pColor+"("+String(P[pColor].up.x)+";"+String(P[pColor].up.y)+")";
                console.log()
                mctx.drawImage(document.getElementById(imgString),topX-camX,topY-camY);
                /*
                mctx.beginPath();
                mctx.moveTo(P[pColor].p.x-camX-P[pColor].out.x*tw/2,P[pColor].p.y-camY-P[pColor].out.y*tw/2);
                mctx.lineTo(P[pColor].p.x-camX-P[pColor].out.x*tw/2+P[pColor].up.x*tw/2,P[pColor].p.y-camY-P[pColor].out.y*tw/2+P[pColor].up.y*tw/2);
                mctx.fillStyle=pColor
                mctx.strokeStyle="purple";
                mctx.stroke();
                mctx.closePath();
                */
            }
        }
        
        if(canPlace || cubeTargeted!="none") //aim laser
        {
            mctx.beginPath();
            mctx.moveTo(Player.sprite.rPos.x+Player.sprite.anchor.x+Player.sprite.width/2,Player.sprite.rPos.y+Player.sprite.anchor.y+Player.sprite.height/2)
            mctx.lineTo(endPoint.x-camX,endPoint.y-camY);
            mctx.strokeStyle="purple";
            mctx.stroke();
            mctx.closePath();
        }
    //over tmap layer
    for(var i=0;i<objs.length;i++)
    {
        if(objs[i].constructor==Neru)
        {
            mctx.drawImage(document.getElementById("laser"),
                objs[i].atk.x,0
                );
        }
        if(objs[i].constructor==Textbox)
        {
            mctx.drawImage(objs[i].img,objs[i].p.x-camX,objs[i].p.y-camY);
        }
        if(objs[i].constructor==BreadDoor)
        {
            mctx.drawImage(objs[i].img,objs[i].p.x*tw-camX,objs[i].p.y*tw-camY);
        }

    }
    }

    //gui layer
    if(progress==10)
    {
        for(var i=0;i<playerHealth;i++)    
        {
            mctx.drawImage(document.getElementById("heart"),i*tw,0)
        }
    }
    if(gameState=="question")
    {
        mctx.drawImage(document.getElementById("question"),0,0);
    }

    if(gameState=="end")
    {
        mctx.drawImage(document.getElementById("endscreen"),0,0)
    }

    //transition
    mctx.beginPath();
    var rectPhase=tFrames*(h/30)-h;
    mctx.rect(0,rectPhase,w,h);
    mctx.fillStyle="black";
    mctx.fill();
    mctx.closePath();
    }

// #endregion

// #region vectors
function Vector(x,y) //2d vector
{
    this.x=x;
    this.y=y;
}

function pointDirecton(v,w) //returns direction from first vector to the other in radians
{
    return (Math.atan2(w.y-v.y, w.x-v.x));
}

function rot(v,theta)
{
    //| cos(theta) sin(theta)||x|   | x*cos(theta)+y*sin(theta)|
    //|-sin(theta) cos(theta)||y| = |-x*sin(theta)+y*cos(theta)|
    return new Vector(
                         v.x*Math.cos(theta)+v.y*Math.sin(theta),
                        -v.x*Math.sin(theta)+v.y*Math.cos(theta)
                    )
}

// #endregion

// #region sprites
function Sprite(imgArr,width,height,anchor,rotates)
{
    this.imgs=imgArr;
    this.imgIdx=0;
    this.width=width;
    this.height=height;
    this.anchor=anchor;
    this.Mirror=false;
    this.rotates=rotates;
    this.rPos=new Vector(0,0)
}
function drawSprite(spr)
{
    mctx.drawImage(
        spr.imgs[spr.imgIdx],
        
        spr.rPos.x,
        spr.rPos.y
    );
}
// #endregion

// #region objs
function tileCollison(x,y,dataObj=Player) //tile collison 
{
    //get 4 corner points
    var startX=dataObj.sprite.anchor.x;
    var startY=dataObj.sprite.anchor.y;
    var sprWidth=dataObj.sprite.width;
    var sprHeight=dataObj.sprite.height;

    var lx=Math.floor((x+startX)/tw);
    var rx=Math.floor((x+startX+sprWidth)/tw);
    var ty=Math.floor((y+startY)/tw);
    var by=Math.floor((y+startY+sprHeight)/tw);
    //check each point, if inside non-air tile
    
    if(tmap[ty][lx]!="a"){return(true);}
    if(tmap[ty][rx]!="a"){return(true);}
    if(tmap[by][rx]!="a"){return(true);}
    if(tmap[by][lx]!="a"){return(true);}
    return(false);
}

function PhyObj(pos=new Vector(0,0),sprite=cubeSprite()) //physics object
{
    this.sprite=sprite; //sprite
    this.spawn=new Vector(pos.x,pos.y);
    this.p=pos; //position
    this.v=new Vector(0,0); //velocity
    this.a=new Vector(0,0); //acceleration
    this.bounce=false; //bounce
    this.move=function() //move the object 
    {
        //x
        this.v.x+=this.a.x;
        var step=0.2*Math.sign(this.v.x);
        if(tileCollison(this.p.x+this.v.x,this.p.y,this))
        {
            while(!tileCollison(this.p.x+step,this.p.y,this))
            {
                this.p.x+=step;
            }
            if(portalCollison(this.x,this.y,this)=="none"){this.v.x=0};
        }
        this.p.x+=this.v.x;
        //y
        this.v.y+=this.a.y;
        step=0.2*Math.sign(this.v.y);
        if(tileCollison(this.p.x,this.p.y+this.v.y,this))
        {
            while(!tileCollison(this.p.x,this.p.y+step,this))
            {
                this.p.y+=step;
            }
            if(portalCollison(this.x,this.y,this)=="none"){this.v.y=0};
        }
        this.p.y+=this.v.y;
        /*
        if(this.p.y>tmap.length*tw-2*tw){this.v.y*=-1.1;}
        if(this.p.y<tw+2)               {this.v.y*=-1.1;}
        */
        //grav
        if(tileCollison(this.p.x,this.p.y+1,this)){this.a.y=0;}else{this.a.y=g}
        //friction
        if(tileCollison(this.p.x,this.p.y+1,this))  //friction, if on ground
        {
            this.a.x=-Math.sign(this.v.x)*1;
        }
        if(Math.abs(this.v.x)<1){this.v.x=0;}
        
        //portals
        var colors=["blue","orange"]
        
        var coll=portalCollison(this.p.x,this.p.y,this);
        if(coll!="none")
        {
            var other="blue";
            if(coll=="blue"){other="orange";}
            
            var diff=new Vector(this.p.x+this.sprite.anchor.x+this.sprite.width/2-P[coll].p.x,this.p.y+this.sprite.anchor.y+this.sprite.height/2-P[coll].p.y)

            var outDiff=-(diff.x*P[coll].out.x+diff.y*P[coll].out.y);
            var upDiff=diff.x*P[coll].up.x+diff.y*P[coll].up.y;

            var homage=new Sprite(this.sprite.imgs,this.sprite.width,this.sprite.height);
            homage.rPos.x=P[other].p.x+(P[other].out.x*outDiff+P[other].up.x*upDiff)-this.sprite.width/2-this.sprite.anchor.x-camX;
            homage.rPos.y=P[other].p.y+(P[other].out.y*outDiff+P[other].up.y*upDiff)-this.sprite.height/2-this.sprite.anchor.y-camY;

            //prevent getting stuck due to width height difference
            if(homage.rPos.y+this.sprite.anchor.y+homage.height+camY>P[other].p.y+tw)
            {
                homage.rPos.y=P[other].p.y+-this.sprite.anchor.y-tw-homage.height-0.5-camY;
            }
            if(homage.rPos.y+this.sprite.anchor.y+camY<P[other].p.y-tw)
            {
                homage.rPos.y=P[other].p.y+this.sprite.anchor.y-tw+0.5-camY;
            }

            //mirror
            homage.imgIdx=this.sprite.imgIdx;
            var thisX=P[coll].out.x+P[coll].up.x;
            var otherX=P[other].out.x+P[other].up.x;
            if((thisX!=otherX) && this.sprite.rotates)
            {
                homage.imgIdx=(homage.imgIdx+4) % 8;
            }
            homages.push(homage);
            //tp if in too deep
            if(outDiff>1)
            {
                this.p.x=homage.rPos.x+camX;
                this.p.y=homage.rPos.y+camY;

                var outVel=-(P[coll].out.x*this.v.x+P[coll].out.y*this.v.y);
                var upVel=P[coll].up.x*this.v.x+P[coll].up.y*this.v.y;
                upVel=0;
                this.v.x=P[other].out.x*outVel+P[other].up.x*upVel;
                this.v.y=P[other].out.y*outVel+P[other].up.y*upVel;
                
                cubeTargeted=="none";
            }

        }
    

        //update render position of sprite
        this.sprite.rPos.x=this.p.x-camX;
        this.sprite.rPos.y=this.p.y-camY;

        
        //console.log(this);
    }

}

function playerScript()
{
//movement
    var a=1; //movement acceleration
    var hk=Number(keyMap.d)-Number(keyMap.a); if(hk!=0){lastHk=hk;} //horizontal input
    if(Math.abs(Player.v.x+hk*a)<maxVx)
    {
        Player.a.x=hk*a; 
    }
    else
    {
        Player.a.x=0;
    } 
    
    if(hk==0 && tileCollison(Player.p.x,Player.p.y+1,Player))  //friction, if on ground
    {
        Player.a.x=-Math.sign(Player.v.x)*1
    }

    //wall slide
    /*
    if(tileCollison(Player.p.x+hk,Player.p.y) && Player.v.y>0.5)
    {
        Player.a.y=0;
        Player.v.y=0.5;
    }else
    {
        Player.a.y=g;
    }
    */

    //jumping
    var vJump=-Math.sqrt(2*g*1.75*tw);//v=sqrt(2gh) h=tiles to jump * tile size

    if(tileCollison(Player.p.x,Player.p.y+1) && keyMap.w){Player.v.y=vJump;} //jump, if on ground
    
    //animation
    var animSpeed=50/4;
    var frame=1;
    if(tileCollison(Player.p.x,Player.p.y+1) && Player.v.x!=0)
    {
        frame=Math.floor(t/animSpeed) % 4
        //if(t % 25){document.getElementById("snd-step").currentTime=0; }
        //document.getElementById("snd-step").play(); 
    }else{
        //document.getElementById("snd-step").currentTime=0;
        //document.getElementById("snd-step").pause(); 
    }
    if(!tileCollison(Player.p.x,Player.p.y+1)){frame=2}
    
    var right=Number(Player.sprite.rPos.x<Mouse.x)
    Player.sprite.imgIdx=right*4+frame;

    //audio
    

//gun

    //endPoint=raycast();
    endPoint=raycast();
    
   // if(portalCollison(Player.p.x,Player.p.y)!="none"){canPlace=false} 
    
    if(canPlace)
    {
        if(keyMap.q && portalCollison(Player.p.x,Player.p.y)!="blue"){shootPortal("blue")}
        else 
        if(keyMap.e && portalCollison(Player.p.x,Player.p.y)!="orange"){shootPortal("orange")}
    }
}

function updateCamera()
{
    if(tileCollison(Player.p.x,Player.p.y+1)) //cap velocity
    {
        if(Player.v.x> maxVx){Player.v.x= maxVx;}
        if(Player.v.x<-maxVx){Player.v.x=-maxVx;}
        if(Player.v.y> maxVy){Player.v.y= maxVy;}
        if(Player.v.y<-maxVy){Player.v.y=-maxVy;}
    }
    //document.getElementById("snd-air").volume=Player.v.y/64;

    //cam update
    camX=Player.p.x-w/2;
    camY=Player.p.y-h/2;
    camX=Math.max(0,camX);
    camX=Math.min(tmap[0].length*tw-w,camX)
    camY=Math.max(0,camY);
    camY=Math.min(tmap.length*tw-h,camY)

    
}
// #endregion

// #region portals
function Portal(color)
{
    this.color=color;
    this.up=new Vector(0,0);
    this.out=new Vector(0,0);
    this.p=new Vector(0,0);
    
    this.active=true;
    this.placed=false;

    this.tiles=[];

}

function isPortalTile(x,y)
{
    if(true)
    {
        for(var i=0;i<P["blue"].tiles.length;i++)
        {
            if(
                x==P["blue"].tiles[i].x &&
                y==P["blue"].tiles[i].y
            ){return "blue"}
        }
    }
    if(true)
    {
        for(var i=0;i<P["orange"].tiles.length;i++)
        {
            if(
                x==P["orange"].tiles[i].x &&
                y==P["orange"].tiles[i].y
            ){return "orange"}
        }
    }
    return "none";
}
function portalCollison(x,y,dataObj=Player) //tile collison 
{
    var startX=dataObj.sprite.anchor.x;
    var startY=dataObj.sprite.anchor.y;
    var sprWidth=dataObj.sprite.width;
    var sprHeight=dataObj.sprite.height;

    var lx=Math.floor((x+startX)/tw);
    var rx=Math.floor((x+startX+sprWidth)/tw);
    var ty=Math.floor((y+startY)/tw);
    var by=Math.floor((y+startY+sprHeight)/tw);
    //check each point, if inside non-air tile
    if(isPortalTile(lx,ty)!="none"){return(isPortalTile(lx,ty));}
    if(isPortalTile(rx,ty)!="none"){return(isPortalTile(rx,ty));}
    if(isPortalTile(rx,by)!="none"){return(isPortalTile(rx,by));}
    if(isPortalTile(lx,by)!="none"){return(isPortalTile(lx,by));}
    return("none");
}


function raycast()
{
    var x=Player.p.x+Player.sprite.width/2+Player.sprite.anchor.x;
    var y=Player.p.y+Player.sprite.height/2+Player.sprite.anchor.y;
    var tx, ty;
    var dir=Math.atan2(Mouse.y-(Player.sprite.rPos.y+tw/2),Mouse.x-(Player.sprite.rPos.x+tw/2))
    var step=0.5;
    var tileVal;
    canPlace=true;
    do
    {   
        x+=Math.cos(dir)*step;
        y+=Math.sin(dir)*step;
        if(y<0 || y>tmap.length*tw){canPlace=false; return new Vector(x,y-Math.sin(dir)*step);}
        tx=Math.floor(x/tw);
        ty=Math.floor(y/tw)
        tileVal=tmap[ty][Math.floor(tx)];
        if(tileVal=="b"){canPlace=false;}
        if(isPortalTile(tx,ty)!="none"){canPlace=false;}

        
    }while(tileVal=="a");
    return new Vector(x,y);
}

function shootPortal(pColor)
{
    var other="blue";
    if(pColor=="blue"){other="orange"}
    //reset tiles
    for(var i=0;i<P[pColor].tiles.length;i++)
    {
        var tile=P[pColor].tiles[i];
        tmap[tile.y][tile.x]="p";

    }
    P[pColor].tiles=[]
    P[pColor].placed=false;
    //set tiles
    P[pColor].tiles.push(new Vector(Math.floor(endPoint.x/tw),Math.floor(endPoint.y/tw)));
    var pDiff=new Vector(Player.p.x-endPoint.x,Player.p.y-endPoint.y); //player difference
    var tDiff=new Vector(Math.abs(-(endPoint.x % 64)+32),Math.abs(-(endPoint.y % 64)+32)) //abs tile center difference
    var ori;
    var face;
    if(tDiff.x>tDiff.y)
    {
        ori="x";
        face=Math.sign(pDiff.x)
        var tile=P[pColor].tiles[0];
        //-y
        if(
            tmap[tile.y-1][tile.x]=="p" &&
            tmap[tile.y-1][tile.x+face]=="a" &&
            isPortalTile(tile.x,tile.y-1)!=other &&
            isPortalTile(tile.x,tile.y-2)!=other &&
            isPortalTile(tile.x,tile.y+1)!=other

        )
        {
            P[pColor].tiles.push(new Vector(tile.x,tile.y-1));
            P[pColor].up=new Vector(0,-1);
        }
        else
        //+y
        if(
            tmap[tile.y+1][tile.x]=="p" &&
            tmap[tile.y+1][tile.x+face]=="a" &&
            isPortalTile(tile.x,tile.y+1)!=other &&
            isPortalTile(tile.x,tile.y+2)!=other &&
            isPortalTile(tile.x,tile.y-1)!=other

        )
        {
            P[pColor].tiles.push(new Vector(tile.x,tile.y+1))
            P[pColor].up=new Vector(0,1);
        }
        else{P[pColor].tiles=[]}//dont place
        //console.log("x");
    }
    else
    {
        ori="y";
        face=Math.sign(pDiff.y)
        var tile=P[pColor].tiles[0];
        //+hk
        if(
            tmap[tile.y][tile.x+lastHk]=="p" &&
            tmap[tile.y+face][tile.x+lastHk]=="a" &&
            isPortalTile(tile.x+lastHk,tile.y)!=other &&
            isPortalTile(tile.x+2*lastHk,tile.y)!=other  &&
            isPortalTile(tile.x-lastHk,tile.y)!=other
  
        )
        {
            P[pColor].tiles.push(new Vector(tile.x+lastHk,tile.y));
            P[pColor].up=new Vector(lastHk,0);
        }
        else
        //-hk
        if(
            tmap[tile.y][tile.x-lastHk]=="p" &&
            tmap[tile.y+face][tile.x-lastHk]=="a" &&
            isPortalTile(tile.x-lastHk,tile.y)!=other &&
            isPortalTile(tile.x-2*lastHk,tile.y)!=other &&
            isPortalTile(tile.x+lastHk,tile.y)!=other

        )
        {
            P[pColor].tiles.push(new Vector(tile.x-lastHk,tile.y));
            P[pColor].up=new Vector(-lastHk,0);
        }
        else{P[pColor].tiles=[]}//dont place
        //console.log("y");
    }
    if(P[pColor].tiles.length!=0)
    {
        P[pColor].placed=true;
        document.getElementById("snd-portal").currentTime=0;
        document.getElementById("snd-portal").play();
    }
    

    //set pos and facing
    if(P[pColor].placed)
    {
        P[pColor].out.x=face*Number(ori=="x");
        P[pColor].out.y=face*Number(ori=="y");
        P[pColor].p.x=tw*P[pColor].tiles[0].x+tw/2+(tw/2)*P[pColor].up.x+(tw/2)*P[pColor].out.x;
        P[pColor].p.y=tw*P[pColor].tiles[0].y+tw/2+(tw/2)*P[pColor].up.y+(tw/2)*P[pColor].out.y;
    }
    //P[pColor].out=rot(P[pColor].up,(90*(Math.PI/180)))
    //console.log(P.blue);
    //console.log(P.orange);
    
    deactivatePortals();
    if(P[other].placed && P[pColor].placed){
        activatePortals()
    }else{
        deactivatePortals();
    }


}

function activatePortals()
{
    var colors=["blue","orange"]
    for(var i=0;i<2;i++)
    {
        var pColor=colors[i]
        P[pColor].active=true;
        for(var j=0;j<P[pColor].tiles.length;j++)
        {
            var tile=P[pColor].tiles[j];
            tmap[tile.y][tile.x]="a";
        }
    }    
}
function deactivatePortals()
{
    var colors=["blue","orange"]
    for(var i=0;i<2;i++)
    {
        var pColor=colors[i]
        P[pColor].active=false;
        for(var j=0;j<P[pColor].tiles.length;j++)
        {
            var tile=P[pColor].tiles[j];
            tmap[tile.y][tile.x]="p";
        }
    }    
}

// #endregion

// #region bread
function Bread(x,y)
{
    this.sprite=new Sprite(
    [document.getElementById("breadSprite")],
    40,
    40,
    new Vector(12,12),
    false
    )
    this.p=new Vector(x,y);
    this.move=function()
    {
        if(
            (
                (Player.p.x+Player.sprite.anchor.x+Player.sprite.width/2-
                    (this.p.x+this.sprite.anchor.x+this.sprite.width/2))**2
                +
                (Player.p.y+Player.sprite.anchor.y+Player.sprite.height/2-
                    (this.p.y+this.sprite.anchor.y+this.sprite.height/2))**2
            )<(tw/2)**2
        )
        {
            breads[progress]=true;
            document.getElementById("snd-pickup").play();
            objs.splice(objs.indexOf(this),1);
        }
    }
}
// #endregion

// #region barrier
function Barrier(coord,bounce)
{
    this.coord=coord
    this.bounce=bounce;
    this.active=true;
    var range=64;
    this.move=function()
    {
        if(!this.active){return;}
        if(Math.abs(Player.p.x+Player.sprite.anchor.x+Player.sprite.width/2-this.coord)<=range)
        {
            Player.v.x=bounce*5*-Math.sign(Player.v.x);
            document.getElementById("snd-spark").play();
        }
        
    }
}
// #endregion

// #region plate
function Plate(x,y)
{    
    this.tile=new Vector(x,y);
    this.active=true;

    this.move=function()
    {
        if(!this.active){return;}
        
        var x=Player.sprite.anchor.x+Player.p.x;
        var y=Player.sprite.anchor.y+Player.p.y;
        var sprWidth=Player.sprite.width;
        var sprHeight=Player.sprite.height;

        var lx=Math.floor((x)/tw);
        var rx=Math.floor((x+sprWidth)/tw);
        var ty=Math.floor((y)/tw);
        var by=Math.floor((y+sprHeight)/tw);


        //check each point
        
        var iX=this.tile.x;
        var iY=this.tile.y;
        if(
            (ty==iY && lx==iX)||
            (ty==iY && rx==iX)||
            (by==iY && rx==iX)||
            (by==iY && lx==iX)
        )
        {
            for(var i=0;i<objs.length;i++)
            {
                if(objs[i].constructor==Barrier){objs[i].active=false}
                document.getElementById("snd-switch").play();
            }
            this.active=false;
        }
        
    };
}
// #endregion

// #region ascender
function Ascender(x,y,tall,spd=20)
{
    this.tiles=[new Vector(x,y)];
    for(var i=1;i<tall;i++)
    {
        this.tiles.push(new Vector(x,y+i))
    }
    this.move=function()
    {
        var x=Player.sprite.anchor.x+Player.p.x;
        var y=Player.sprite.anchor.y+Player.p.y;
        var sprWidth=Player.sprite.width;
        var sprHeight=Player.sprite.height;

        var lx=Math.floor((x)/tw);
        var rx=Math.floor((x+sprWidth)/tw);
        var ty=Math.floor((y)/tw);
        var by=Math.floor((y+sprHeight)/tw);

        

        //check each point
        for(var i=0;i<this.tiles.length;i++)
        {
            var iX=this.tiles[i].x;
            var iY=this.tiles[i].y;
            if(
                (
                (ty==iY && lx==iX)||
                (ty==iY && rx==iX)||
                (by==iY && rx==iX)||
                (by==iY && lx==iX)
                )
            ){Player.v.y=-spd; break;}
        }
    };

}
// #endregion

// #region slime
function Slime(x,y,long,ori="up")
{
    this.ori=ori;
    this.tiles=[new Vector(x,y)];
    for(var i=1;i<long;i++)
    {
        this.tiles.push(new Vector(x+i,y));
    }
    this.move=function()
    {
        var x=Player.sprite.anchor.x+Player.p.x;
        var y=Player.sprite.anchor.y+Player.p.y;
        var sprWidth=Player.sprite.width;
        var sprHeight=Player.sprite.height;

        var lx=Math.floor((x)/tw);
        var rx=Math.floor((x+sprWidth)/tw);
        var ty=Math.floor((y)/tw);
        var by=Math.floor((y+sprHeight)/tw);

        var spd=3;

        //check each point
        for(var i=0;i<this.tiles.length;i++)
        {
            var iX=this.tiles[i].x;
            var iY=this.tiles[i].y;
            if(
                (ty==iY && lx==iX)||
                (ty==iY && rx==iX)||
                (by==iY && rx==iX)||
                (by==iY && lx==iX)
            )
            {
                var minV=1;
                if(Math.abs(Player.v.y)<minV)
                {
                    Player.v.y=Math.sign(Player.v.y)*(minV);
                }
                Player.v.y*=-1.0; 
                Player.v.y+=g*Math.sign(Player.v.y);
                document.getElementById("snd-slime").currentTime=0;
                document.getElementById("snd-slime").play();
                break;
            }
        }
    };
}
// #endregion

// #region neru
function Neru(x,y)
{
    this.sprite=new Sprite(
        [
            document.getElementById("neru-off"),
            document.getElementById("neru-0"),
            document.getElementById("neru-1"),
            document.getElementById("neru-2"),
            document.getElementById("neru-3"),
            document.getElementById("neru-4"),
            document.getElementById("neru-5")
            
        ],
        36*4,
        70*4,
        new Vector(6,0),
        true
    )
    
    this.p=new Vector(x,y);
    this.hp=5;
    this.alive=true;
    this.timer=300;

    var lBorder=this.p.x;
    var rBorder=this.p.x+192;
    var middle=(lBorder+rBorder)/2;
    var size=7*4;
    var spd=0.5;

    this.atk={
        x: -70,
        vx: 0,
        ax: spd,
        turns: 0,
        active: false
    }
    this.anvil=
    {
        state: "raised", //raised, being ,lowered, cut, exploded
        y: -64,
        vy: 0,
        ay: g,
        frame: 0
    }

    this.move=function()
    {   
        if(this.alive)
        {
            //atk
            if(!this.atk.active)
            {
                if(this.timer<=0)
                {
                    this.atk.active=true;
                    //document.getElementById("snd-neru").play();
                }
            }
            else
            {
                //if(this.timer==0 && this.atk.turns==0){document.getElementById("snd-neru").play();}
                if(this.timer<=0)
                {
                    this.atk.vx+=this.atk.ax;
                    this.atk.x+=this.atk.vx;
                    
                    var playerCenter=Player.p.x+Player.sprite.anchor.x+Player.sprite.width/2;
                    if(
                        this.atk.x<playerCenter && playerCenter<this.atk.x+64
                    )
                    {
                        this.atk.x+=Math.sign(this.atk.vx)*1.5*tw;
                        playerHealth--;
                    }
                }
                if(this.atk.x>1024-tw)
                {
                    this.atk.ax=-spd;
                    this.atk.vx=0;
                    this.atk.x=1024-tw  ;
                    this.timer=20;
                    this.atk.turns++;
                }
                if(this.atk.x<0)
                {
                    this.atk.ax=spd; 
                    this.atk.vx=0;this.atk.x=0;
                    this.timer=20; 
                    this.atk.turns++;
                }
                if(this.atk.turns==3)
                {
                    this.timer=300;
                    this.atk.turns=0;

                    this.anvil.state="being";
                    document.getElementById("snd-creak").play();
                }
            }
            //anvil
            switch(this.anvil.state)
            {
                case "raised":
                this.anvil.y=-64;
                this.anvil.vy=12;
                if(this.hp<=0)
                {
                    this.alive=false; 
                    this.timer=100;
                    this.atk.x=-64;
                    document.getElementById("snd-bosstheme").pause();
                }
                break;

                case "being":
                this.anvil.y+=this.anvil.vy;
                if(this.anvil.y>=this.p.y-1*tw)
                {
                    this.anvil.state="lowered";
                }
                if(this.anvil.y<-64)
                {
                    this.anvil.state="raised";
                }
                break;

                case "lowered":
                    var playerCenter=Player.p.x+Player.sprite.anchor.x+Player.sprite.width/2;
                    if(Player.p.y<this.anvil.y-64 && Math.abs(playerCenter-8*tw)<tw/2)
                    {
                        this.anvil.state="cut";
                        this.anvil.vy=0;
                        document.getElementById("snd-snap").play();
                    }
                    if(this.timer<=0)
                    {
                        this.anvil.vy=-12;
                        this.anvil.state="being";
                        document.getElementById("snd-creak").play();
                    }
                break;

                case "cut":
                this.anvil.vy+=this.anvil.ay;    
                this.anvil.y+=this.anvil.vy;
                if(this.anvil.y>tmap.length*tw-3*tw)
                {
                    this.anvil.frame=0;
                    document.getElementById("snd-exp").play();
                    this.anvil.state="exploding";
                }
                break;

                case "exploding":
                    this.anvil.frame++;
                    if(this.anvil.frame==5){this.anvil.state="raised"; this.hp--;}
                break;
            }
            
            console.log(this.anvil.state);
        }
        else
        {
            if(this.timer==0){this.hp--;document.getElementById("snd-nerudeath").play();}
            if(this.timer==-100)
            {
                gameState="question";
            }
        }
        this.sprite.imgIdx=this.hp+1;
        this.timer--;
    }
}
// #endregion 

// #region miku
function Miku(x,y)
{
    this.p=new Vector(x,y);
    this.v=new Vector(0,0);
    this.a=new Vector(0,0);
    this.sprite=new Sprite(
        [
            document.getElementById("miku-left1"),
            document.getElementById("miku-right1"),
            document.getElementById("miku-right2")
        ],
        64,
        64,
        new Vector(0,0),
        false
    );
    this.state="idle"; //idle, jumping, ascending, end
    this.move=function()
    {
        switch(this.state)
        {
            case "idle":
                if(
                 Player.p.x>this.p.x-4*tw &&
                 Player.p.y>this.p.y-2*tw   
                )
                {
                    this.sprite.imgIdx=2;
                    this.v.x=15;
                    this.v.y=-Math.sqrt(2*g*1*tw);
                    this.a.y=g;
                    this.state="jumping";
                }
            break;
            case "jumping":
                this.v.y+=this.a.y;
                this.p.x+=this.v.x;
                this.p.y+=this.v.y;
                if(this.p.x>22.5*tw)
                {
                    this.a.y=0;
                    this.v.y=-20;
                    this.v.x=0;
                    this.state="ascending";
                }
            break;
            case "ascending":
                this.p.y+=this.v.y; 
                if(this.p.y<9*tw)
                {
                    this.v.y=0;
                    this.p.x=3*tw;
                    this.p.y=9*tw;
                    this.state="end";
                    this.sprite.imgIdx=1;
                }
            break;
            case "end":
            break;
        }
    }
}

// #endregion

// #region textbox
function Textbox(x,y,img)
{
    this.p=new Vector(x,y)
    this.img=img;
    this.move=function(){};
}
// #endregion

// #region breaddoor
function BreadDoor(x,y)
{
    this.p=new Vector(x,y);
    this.img=document.getElementById("breadDoorTransparent");
    console.log(breads)
    this.move=function()
    {
        if(breads.includes(false))
        {
            tmap[y][x]="b";
            tmap[y+1][x]="b";
            this.img=document.getElementById("breadDoor");
        }
    };
}
// #endregion

// #region load functions

function transition()
{
    if(tFrames==30)
    {
        loadLevel(progress);
    }
    if(tFrames==60)
    {
        
           gameState="game"; 
        
            
        if(progress==10){document.getElementById("snd-bosstheme").play()}
        
        tFrames=0;
        return;
    }
    tFrames++;
}

function loadLevel(n)
{

    

    //portal reset
    P["blue"].tiles=[];
    P["blue"].placed=false;
    P["blue"].active=false;
    P["orange"].tiles=[];
    P["orange"].placed=false;
    P["orange"].active=false;
    //map
    tmap=[];
    var nums=['0','1','2','3','4','5','6','7','8','9']
    var data=[];
    var arr=[];
    var numArr=[];
    var charArr=[];
    var mapString=levels[n].map;
    console.log(mapString);
    var word="";
    for(var i=0;i<mapString.length;i++)
    {
        ch=mapString[i];
        if(ch!='(' && ch!=')')
        {
            word+=ch;
            console.log(ch);
        }
        if(ch=='(')
            {
                arr.push(Number(word)); 
                console.log(word);
                word="";  
                continue;
            }
        if(ch==')')
            { 
                arr.push(word);
                console.log(word);
                data.push(arr);
                console.log(arr);
                word="";
                arr=[];  
                continue;
            }
        
    };
    console.log(data);
    for(var i=0;i<data.length;i++)
    {
        word="";
        ch="";
        arr=[];
        numArr=[];
        charArr=[];
        for(var j=0;j<data[i][1].length;j++)
        {
            ch=data[i][1][j];
            if(!nums.includes(ch))
            {
                numArr.push(Number(word));
                charArr.push(ch);
                word="";
            }else{
                word+=ch;
            }
        }
        console.log(numArr);
        console.log(charArr);
        arr=[]
        for(var j=0;j<numArr.length;j++)
        {
            for(var k=0;k<numArr[j];k++)
            {
                arr.push(charArr[j])
            }
        }
        for(var j=0;j<data[i][0];j++)
        {
            var arrCopy=arr.slice();
            tmap.push(arrCopy)
        }
    }
    console.log(tmap)
    objs=[]
    for(var i=0;i<levels[n].objArray.length;i++)
    {
        if(levels[n].objArray[i]=="neru")
        {objs.push(new Neru(8*tw-96,18*tw-280)); continue}
        objs.push(levels[n].objArray[i]);
        if(objs[i].constructor==Barrier || objs[i].constructor==Plate)
        {
            objs[i].active=true;
        }
    }
    objs.push(Player)

    //player positioning
    Player.p.x=levels[n].playerStart.x;
    Player.p.y=levels[n].playerStart.y;
    Player.v.x=0;
    Player.v.y=0;
    Player.a.x=0;
    Player.a.y=0;
    updateCamera();
    Player.sprite.rPos.x=Player.p.x-camX;
    Player.sprite.rPos.y=Player.p.y-camY;
    playerHealth=3;

    console.log(Player);

    console.log(breads);
}


// #endregion

// #region variables
const m=document.getElementById("gatewaysCanvas");
const w=m.width;
const h=m.height;
const mctx=m.getContext("2d");

let camX=0;
let camY=0;

const g=1;

let cubeSprite= function(){return new Sprite([document.getElementById("cube")],64,64,new Vector(0,0),false)};

const maxVx=10;
const maxVy=128;
let playerHealth=3;
Player = new PhyObj(new Vector(0,0),
new Sprite([
    document.getElementById("playerSprite(-1)(0)"),
    document.getElementById("playerSprite(-1)(1)"),
    document.getElementById("playerSprite(-1)(2)"),
    document.getElementById("playerSprite(-1)(3)"),
    document.getElementById("playerSprite(1)(0)"),
    document.getElementById("playerSprite(1)(1)"),
    document.getElementById("playerSprite(1)(2)"),
    document.getElementById("playerSprite(1)(3)") 
],
    24,64,new Vector(5*4,0),true)
)

let jumps=0;
let lastHk=1;
let movVx=0;
let endPoint;
let cubeTargeted="none";


let P=
{
    blue: new Portal("blue"),
    orange: new Portal("orange")
}
let canPlace=false;
let homages=[];

const fps=50;
let t=0;
let gameState="menu";
let tFrames=0;

let score=0;

let tmap=[];
const scale=4;
const tw=16*scale;    

let objs=[];

//loadLevel(0);
//
let keyMap = {w:0, a:0, s:0, d:0};
onkeydown = onkeyup = function(e){
    //e = e || event;
    keyMap[e.key] = e.type == 'keydown';
    //console.log(keyMap);
    
}
let Mouse = new Vector(0,0);
m.onmousemove=function(ev)
{
    Mouse.x=ev.offsetX;
    Mouse.y=ev.offsetY;
}
//#endregion

//#region levels
//let breadSprite=0;

let breads=[false,false,false,false,false,false,false,false,false,false];
//let breads=[true,true,true,true,true,true,true,true,true,true];
let progress=0;
function Level(map,playerStart,objArray)
{
    this.map=map;
    this.playerStart=playerStart;
    this.objArray=objArray;
}

let levels=
[
    new Level( //0
        "5(2b2a12b)"+
        "2(1b1p12a1p1b)"+
        "5(12b2a2b)",
        new Vector(160,76),
        [
            new Barrier(8*tw,2),new Bread(9.5*tw,5.5*tw),
            new Textbox(5*tw,tw,document.getElementById("tutorial"))
        ]
    ),
    new Level( //1
       "1(2b2a12b)"+
       "1(2b2a1b8p3b)"+
       "1(2b13a1b)"+
       "2(1b1p13a1b)"+ 
       "1(2b13a1b)"+
       "16(2b1a2b8a1b1a1b)"+
       "2(2b3a8a1b1a1b)"+
       "1(5b8p1b1a1b)"+
       "1(5b8a1b1a1b)"+
       "2(2b11a1b1a1b)"+
       "1(3b1a10b1a1b)",
       new Vector(160,76),
       [new Bread(8.5*tw,26*tw),
        new Ascender(2,6,18)
       ]
    ),
    new Level( //2
        "2(2b2a28b)"+
        "4(2b2a2b24a2b)"+
        "4(2b2a2b20a2b2a2b)"+
        "2(1b25a2b2a2b)"+
        "1(1b1a4b16a1b3p2b2a2b)"+
        "1(1b1a4b16a4b2b2a2b)"+
        "1(1b1a4b12a1b3p6b2a2b)"+
        "1(1b1a4b12a4b6b2a2b)"+
        "1(1b1a4b8a1b3p10b2a2b)"+
        "1(1b1a4b8a4b10b2a2b)"+
        "1(1b1a4a4a1b3p14b2a2b)"+
        "1(1b1a4a4a4b14b2a2b)"+
        "1(6b4p18b2a2b)"+
        "1(28b2a2b)",
        new Vector(160,76),
        [new Ascender(1,12,10),
         new Bread(7.5*tw,8*tw)
        
        ]
    ),
    new Level( //3
        "2(6b2a12b)"+
        "2(2b16a2b)"+
        "2(2b16a2b)"+
        "2(2b2a2b1a3b6a4b)"+
        "2(2b2a2b10a4b)"+
        "1(2b2a8b2a6b)"+
        "1(2b2a16b)",
        new Vector(416,76),
        [
         new Bread(16.5*tw,2*tw), 
         new Ascender(6,6,4),
         new Barrier(5*tw,2),
         new Slime(12,10,2,"up"),
         new Plate(17,5)
                    
        ]
    ),
    
    new Level( //4
        "1(2b2a28b)"+
        "2(2b2a1b1p24a2b)"+
        "1(2b2a2b24a2b)"+
        "2(2b28a2b)"+
        "2(2b24a2b2a2b)"+
        "1(2b11a1b4a1b7b2b2a2b)"+
        "1(2b11a6b7b2b2a2b)"+
        "1(6b7p6b7b2b2a2b)"+
        "1(28b2a2b)",
        new Vector(160,76),
        [
            new Slime(14,8,4),
            new Bread(15.5*tw,1.5*tw)
        ]
    ),
    new Level( //5
        "1(15b2a15b)"+
        "1(4b4p7b2a2b3a1b4a1b3a1b)"+
        "1(3b6a2b20a1b)"+
        "1(3b6a2b13a2b5a1b)"+
        "2(3b2a2b2a2b2a8b3a2b3a3b)"+
        "2(1b4a2b6a8b3a2b3a3b)"+
        "2(1b2a5b4p9b3a2b3a3b)"+ //10
        "1(1b4a2b6a8b3a2b3a3b)"+
        "1(1b4a2b6a8b3b2b3b3b)"+
        "2(3b2a2b2a2b2a8b3b2b3b3b)"+
        "2(3b6a2b12a9b)"+ //16
        "1(4b4p11b4a9b)"+
        "1(4b4b10b1p4a5b2a1p1b)"+
        "1(4b4b10b1p11a1p1b)"+
        "1(4b4b10b1b4a5b2a1p1b)"+
        "1(4b5p6b2b11b2a2b)"+
        "1(4b5a6b2b11b2a2b)"+ //22
        "1(4b5a6b2b2b4a5b2a1p1b)"+
        "1(4b1a3b1a6b2b1b1p11a1p1b)"+
        "1(4b1a3b1a6b2b1b1p4a5b2a1p1b)"+
        "1(4b1a3b1a6b2b2b4a9b)"+
        "2(1b1p21a1p8b)"+
        "1(4b5p4b6a13b)"+
        "1(4b5b4b6a13b)"+
        "2(15b2a15b)",
        new Vector(15.5*tw,76),
        [
            new Slime(21,10,8),
            new Barrier(14*tw,2),
            new Plate(30,3),
            new Bread(6*tw,22*tw)
        ]

    ),
    new Level( //6
        "2(2b2a20b)"+
        "2(2b2a2b16a2b)"+
        "4(2b2a2b12a2b2a2b)"+
        "2(2b16a2b2a2b)"+
        "2(20b2a2b)",
        new Vector(160,76),
        [
            new Ascender(5,8,1),
            new Ascender(6,5,1),
            new Ascender(9,5,1),
            new Ascender(12,5,1),
            new Ascender(15,5,1),

            new Bread(10.5*tw,5*tw)
        ]
    ),
    new Level( //7
        "1(20b2a2b)"+
        "1(10b4p2b2p2b2a2b)"+
        "1(2b6a1b6a1b2a2b2a2b)"+
        "1(2b16a2b2a2b)"+
        "1(2b2a2b4a1b2a1b4a2b2a2b)"+
        "1(2b2a2b4a1b2b1b4a2b2a2b)"+
        "2(2b2a2b12a2b2a2b)"+
        "2(2b2a2b16a2b)"+
        "1(2b2a2b2p16b)"+
        "1(2b2a20b)",
        new Vector(24*tw-160-tw,76),
        [
            new Slime(11,4,2),
            new Ascender(15,6,1),
            new Bread(16.5*tw,2*tw)
        ]
    ),
    new Level( //8
        "2(2b2a22b)"+
        "1(2b2a2b2a2b2a2b2a2b2a2b2a2b)"+
        "1(2b2a2b2a1p1b2a1p1b2a1p1b2a1p1b2a2b)"+
        "1(2b2a2b2a1p1b2a1p1b2a1p1b2a1p1b2a2b)"+
        "1(2b2a2b2a2b2a2b2a2b2a2b2a2b)"+
        "2(2b2a2b14a2a2a2b)"+
        "2(2b2a2b2a2b2a2b2a2b2a2b2a2b)"+
        "2(1b1p6a1b1p2a1b1p2a1b1p2a2b2a2b)"+
        "1(6b2a2b2a2b2a2b2a2b2a1p1b)"+
        "1(22b2a1p1b)"+   
        "2(2b22a1b1b)"+
        "2(22b2a2b)"+
        "1(2b2a2b2a2b2a2b2a2b2a2b2a2b)"+
        "1(2b2a1b1p2a1b1p2a1b1p2a1b1p2a2b2a2b)"+
        "1(2b2a1b1p2a1b1p2a1b1p2a1b1p2a2b2a2b)"+
        "1(2b2a2b2a2b2a2b2a2b2a2b2a2b)"+
        "2(2b2a2a14a2b2a2b)"+
        "2(2b2a2b2a2b2a2b2a2b2a2b2a2b)"+
        "2(2b2a2b2a1p1b2a1p1b2a1p1b6a1p1b)"+
        "1(2b2a2b2a2b2a2b2a2b2a2b2b2b)"+
        "1(2b2a22b)",
        new Vector(160,76),
        [
            new Slime(6,12,2),
            new Slime(10,12,2),
            new Slime(14,12,2),
            new Slime(18,12,2),
            new Slime(6,28,2),
            new Slime(10,28,2),
            new Slime(14,28,2),
            new Slime(18,28,2),

            new Barrier(9*tw,4),
            new Barrier(13*tw,4),
            new Barrier(17*tw,4),

            new Plate(4,23),

            new Bread(2.5*tw,14.5*tw)
        ]
    ),
    new Level( //9
       "6(20b2a6b)"+
       "2(2b6a4b10a6b)"+
       "2(2b2a2b2a4b2a2b2a6b2b2b)"+
       "2(2b2a2b2a4b2a2b2a2b6a2b)"+
       "4(2b2a2b2a4b2a2b2a2b2a2b2a2b)"+
       "2(2b2a2b12a2b2a2b2a2b)"+
       "1(2b2a2b2p4b2p6b2a2b2a2b)"+
       "1(2b2a2b2b4b2b6b2a2b2a2b)"+
       "2(2b20a2b2a2b)"+
       "1(24b2a2b)"+
       "1(2b2p20b2a2b)"+
       "1(2b24a2b)"+
       "1(2b2a1b22a1b)"+
       "6(2b2a6b1a1b2a1b1a12b)"+
       "2(2b2a6b6a12b)"+
       "1(2b2a8b2p14b)"+
       "1(2b2a24b)"+
       "1(2b2a2b20a2b)"+
       "3(1b1p24a2b)"+
       "1(1b1p8a6b10a2b)"+
       "1(2b2p2b4a6b4a2b4a2b)"+
       "8(22b4a2b)",
       new Vector(20.5*tw,tw),
       [
        new Ascender(16,8,10),
        new Ascender(17,8,10),
        new Ascender(20,12,10),
        new Ascender(21,12,10),

        new Ascender(10,26,8),  
        new Ascender(15,26,8),  

        new Slime(6,41,4),
        new Slime(16,41,4),

        new Bread(24*tw,37*tw)
       ]
    ),
    new Level( //10
        "9(7b2a7b)"+
        "1(2b4p1b2a1b4p2b)"+
        "8(1b1p12a1p1b)"+
        "1(2b12p2b)"+
        "1(16b)",
        new Vector(7.5*tw,76),
        [
            "neru"
        ]
    ),
    new Level( //11
        "9(2a22a2b)"+
        "1(4a1b19a2b)"+
        "36(22b2a2b)"+
        "4(12b4a6b2a2b)"+
        "1(2b2p9b2a7b2a2b)"+
        "2(2b22a2b)"+
        "1(2b2p18b2a2b)"+
        "1(2b2a4b2p1b2p2b2p5b2a2b)"+
        "1(2b2a4b9a5b2a2b)"+
        "1(2b2p4b5a2b2a5b2a2b)"+
        "1(2b2a4b5a2b2a5b2a2b)"+
        "1(2b2a4b2p2b1a2b2a5b2a2b)"+
        "1(2b2p1b2p1b3a1b1a2b2a5b2a2b)"+
        "1(2b2a1a8a2b9a2b)"+
        "1(2b2a1b8a2b9a2b)"+
        "1(5b3a1b2p15b)"+
        "1(26b)",
        new Vector(13.5*tw,47.5*tw),
        [
            new Slime(7,59,4,"down"),
            new Slime(5,62,4),
            
            new Ascender(22,10,52,4),
            new Ascender(23,10,52,4),
            
            new Miku(19*tw,61*tw),

            new Textbox(12*tw,30*tw,document.getElementById("endcred0")),
            new Textbox(12*tw,22*tw,document.getElementById("endcred1")),
            new Textbox(12*tw,14*tw,document.getElementById("endcred2")),

            new Textbox(4*tw,8*tw,document.getElementById("cake")),

            new BreadDoor(11,51)
        ]
    ),
    new Level( //test
        "1(32b)"+
        "1(2b28p2b)"+
        "20(1b1p28a1p1b)"+
        "2(3b2p1b24a1p1b)"+
        "3(1b1p28a1p1b)"+
        "1(1b1p4a2b4a1b2p1b14a1p1b)"+
        "2(1b1p4a2p4a4b14a1p1b)"+
        "1(2b4p2b4p4b14p2b)"+
        "1(32b)",
        new Vector(200,200),
        []
    )
]
//console.log(levels)
/*
0-tutorial, laser introduction DONE
1-tutorial, flingng introduction DONE
2-tutorial, momentum conservation DONE
3-tutorial, button and slime DONE
4-fling and slime combination DONE
5-longer recap of mechanics, shooting through cracks DONE
6-ascenders as platfrom elements DONE
7-slime to preserve momentum DONE
8-shooting through cracks DONE
9-crescendo, flinging
10-bossfight, neru
11-credits, ending room
12-secret level if all bread is collected
13-reward room, with miku

*/

//#endregion

document.getElementById("snd-alarm").volume=0.1;
document.getElementById("snd-neru").volume=0.2;
document.getElementById("snd-creak").volume=0.1;
document.getElementById("snd-nerudeath").volume=0.1;
document.getElementById("snd-snap").volume=0.1;
document.getElementById("snd-exp").volume=0.1;
document.getElementById("snd-fall").volume=0.1;

document.getElementById("snd-portal").volume=0.1;
document.getElementById("snd-spark").volume=0.1;
document.getElementById("snd-pickup").volume=0.5;

document.getElementById("snd-bosstheme").volume=0.25;

setInterval(main,1000/fps);
//main()
