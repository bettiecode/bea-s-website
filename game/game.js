let d,c,w,h,ctx,t,fps,py,v,g,centerX,centerY,pillars,pillarWidth,scr,aud;

window.onload=function() {
    setGame();
}
function clear()
{
    c.width=w;
    ctx.strokeStyle="hotpink"
    ctx.fillStyle="hotpink"
    
}

function draw()
{

    ctx.drawImage(document.getElementById("tetohorse"),0,h/2-py,128,128)
    for(var i=0;i<pillars.length;i++)
        {
            ctx.rect(pillars[i][0],0,pillarWidth,pillars[i][1]);
            ctx.rect(pillars[i][0],pillars[i][1]+pillarHeigth,pillarWidth,h-pillars[i][1]-pillarHeigth);
            ctx.fill();
        }
    
}

function main()
{
    document.getElementById("score").innerHTML=scr
    if(started){v-=g;}else{py=0;}
    py+=v;
    if((h/2-py)>(h-128)){started=false; scr=0; aud.pause();}
    if((h/2-py)<(0)){py=h/2}
    if(started)
    {
        if(t%360==0)
            {
            pillars.push([w,Math.floor(Math.random()*(h-pillarHeigth))])
            }
        for(var i=0;i<pillars.length;i++)
            {
                pillars[i][0]-=1;
                if(pillars[i][0]<-pillarWidth){pillars.shift(); scr++;}
                if((pillars[i][0]<128))
                    {
                        if(((h/2-py)<pillars[0][1])||((h/2-py)>(pillars[0][1]+pillarHeigth-128))){started=false; scr=0; aud.pause();}
                    }

            }
        
    }
    else
    {
        pillars=[]
    }
    clear();
    draw();
    t++;


}

function reset()
{
    if(started==false)
        {
            started=true;
            aud.play();
            
        }
    

}

function setGame()
{
    d=document.getElementById("gameWindow");
    
    c=document.getElementById("gameCanvas");
    w=c.width
    h=c.height
    ctx=c.getContext("2d");


    t=0;
    
    py=0;
    v=0;
    g=0.01;
    
    space=4

    centerX=w/2;
    centerY=h/2;

    pillars=[];
    pillarWidth=64;
    pillarHeigth=384;

    started=false;

    scr=0;

    aud=document.getElementById("fukkireta")

    //v=sqrt(2s)
    document.addEventListener("keydown",function(){v=Math.sqrt(2*64*g); reset()})
    document.addEventListener("click",function(){v=Math.sqrt(2*64*g); reset()})

    aud.volume=0.1;

}

setInterval(main,fps/1000);

