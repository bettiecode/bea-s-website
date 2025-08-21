// #region draw event
function clear()
{
    c.width=w;
    ctx.strokeStyle="#008b8b";
    ctx.fillStyle="#000000";
    ctx.rect(0,0,w,h);
    ctx.fill(); 
    ctx.scale(1 ,1); 
    ctx.fillStyle="#008b8b";  
}

function draw()
{
    for(var i=0;i<polygons.length;i++)
    {
        ctx.beginPath();
        ctx.moveTo(centerX+polygons[i][0].x,centerY+polygons[i][0].y);
        for(var j=1;j<=4;j++)
        {
            ctx.lineTo(centerX+polygons[i][j % 4].x,centerY+polygons[i][j % 4].y);
        }
        ctx.closePath();
        ctx.fillStyle=polygons[i][4];
        ctx.fill();
    }
    //ctx.drawImage(document.getElementById("mikuImg"),t,t)
}
// #endregion

function main()
{
    clear();
    draw();
    t++;
}

// #region load functions
function loadLevel(n)
{
    tmap=[];
    objs=[];
    var data=document.getElementById("levelData-"+String(n)).innerHTML;
    var ch="";
    var word="";
    var arr=[];
    var i=1;
    do
    {
        ch=data[i];
        if(ch=="#")
        {
            tmap.push(arr);
            console.log(arr);
            arr=[];
            i+=2;
            continue;
        }
        if(ch==" ")
        {
            arr.push(word);
            console.log(word);
            //console.log(arr);
            word="";
            i++;
            continue;
        }
        if(ch!="*")
        {
            word+=ch;
            console.log(ch)
            i++;
            continue;
        }

    }while(ch!="*");
    console.log(data);
    console.log(level);
    console.log(tmap);
    //make polygons
    polygons=[];
    for(var y=0;y<gw;y++)
        {
            for(var x=0;x<gw;x++)
            {
                polygons.push(
                    [                         
                        tf(new Vector((x-(gw/2))*tw,(y-(gw/2))*tw)),
                        tf(new Vector((x-(gw/2))*tw,(y+1-(gw/2))*tw)),
                        tf(new Vector((x+1-(gw/2))*tw,(y+1-(gw/2))*tw)),
                        tf(new Vector((x+1-(gw/2))*tw,(y-(gw/2))*tw)),
                        colors[Number(tmap[y][x])]
                    ]
                );
            }
        }
}

// #region transformation
function Vector(x,y)
{
    this.x=x;
    this.y=y;
}

function tf(v)
{
    /*
    |1 0          ||cos(45deg)  sin(45deg)||x|   |(x-y)/sqrt(2)    |
    |0 cos(-60deg)||-sin(45deg) cos(45deg)||y| = |(x+y)/(2*sqrt(2))|
    */
    return(
        new Vector(
            (v.x+v.y)/1.41421356237,
            (-v.x+v.y)/2.82842712475
        )
    );
}
// #endregion
// #region player
let player=
{
    x:0,
    y:0,
    moving:false
};

// #endregion

// #region variables
const d=document.getElementById("mikuGame");
const c=document.getElementById("mikuCanvas");
const w=c.width;
const h=c.height;
const ctx=c.getContext("2d");
const centerX=w/2;
const centerY=h/2;

const fps=60;
let t=0;

let level=[];
let tmap=[];
const r=320
const gw=16;
const tw=2*r/gw;    
let polygons=[];

const colors=[
    "rgba(0,0,0,0)",
    "darkcyan",
    "aqua"
];
loadLevel(0);
//#endregion

setInterval(main,fps/1000);
//main()
