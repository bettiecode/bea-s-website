let c=document.getElementById("eimiko");
let line=""
let set=false
c.onclick=function()
{
    if(!set)
    {
        set=true;
        line='yae6badbitches.mp4 - ';
        line+='<a href=https://twitter.com/TimelyEimiko/status/1939295168793858342?t=JqVdBxIPYVRRVPDNN24-gQ&s=19>from</a>';
        line+='<br>';
        line+='<video autoplay><source src="home/yae6badbitces.mp4"></video>';
    }
    c.innerHTML=line;
}

