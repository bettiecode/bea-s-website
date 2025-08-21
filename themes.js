

function Theme(id,width,color,bg)
{
    this.id=id;
    this.width=width;
    this.color=color;
    this.bg=bg;
}

function toggleTheme()
{
    if(t.id=="miku")
    {
        setTheme("teto")
    }else
    {
        setTheme("miku")
    }

}

function setTheme(a)
{
    for(var i=0;i<themes.length;i++)
    {
        if(themes[i].id==a){t=themes[i];}
    }
    d.getElementById("mascot").src="images/"+t.id+".png";
    d.getElementById("mascot").style.width=t.width;
}

themes=
[
    new Theme(
        "miku","256px","aqua",
        "linear-gradient(180deg,rgba(0,139,139,0.3) 0%,rgba(0, 0, 90, 0.5) 100%)"
        ),
    new Theme(
        "teto","200px","tomato",
        "linear-gradient(180deg,rgba(256, 0, 0, 0.3) 0%,rgba(0, 0, 0, 0.5) 100%)"
        ),
    new Theme("neru","256px","yellow")
]

let t=themes[0];

