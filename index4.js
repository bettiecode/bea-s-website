var d=document;
function loadPage(a)
{
    //get page
    var p;
    for(var i=0; i<pages.length; i++)
    {
        for(var j=0; j<pages[i].length; j++)
        {
            if(pages[i][j].id==a)
            {
                p=pages[i][j]; break;
            } 
        }
   
    }
    d.title="bea's website - "+p.title;
    var line='';
    line+='<a href="portaloid.html"><img id="mascot" src="images/teto.png"></a>';
    line+='<div id="mainHeader" class="box"><div>';
    line+='<h4 id="titleElement">bea\'s website - '+p.title+'</h4>';
    line+='<span>> '+p.desc+'</span>';
    line+='</div></div>';
    d.getElementById("header").innerHTML=line;

    //build navbar
    var line="";
    for(var i=0;i<pages.length;i++)
    {
        line+="<div class='box'>";
        line+="<b>"+pageSections[i]+"</b>";
        line+="<ul>";
        for(var j=0; j<pages[i].length; j++)
        {
            line+="<li ";
            if(pages[i][j].id==a)
            {
                line+="style='font-weight: bold; color: blueviolet;'";
            }
            line+=">";
            line+="<a href='";
            line+=pages[i][j].id;
            line+=".html' "
            if(pages[i][j].id==a)
            {
                line+="style='font-weight: bold; color: blueviolet;'";
            }
            line+=">";
            line+=pages[i][j].title;
            line+="</a><br>";
            line+="</li>";
        }
        line+="</ul>";
        line+="</div>";
    }
    document.getElementById("navBar").innerHTML=line;
}

const pageSections=["main","my works","shrines","info"];

function Page(id,title,desc)
{
    this.id=id;
    this.title=title;
    this.desc=desc;
}

const pages=[
        [
        new Page("index","home","welcome to the homepage!!!"),
        new Page("about_me","about me","me!!!"),
        new Page("diary","diary","jots")
        ],
        [
        new Page("programming","programming","my main skill"),
        new Page("my_games","games","yes i can also do this"),
        new Page("writing","writing","passionate paragraphs"),
        //new Page("playlists","playlists","i love music"),
        new Page("minecraft","minecraft","my most useless talent")
        ],
        [
        new Page("shrines","shrines","things i'm passionate about"),
        ],
        [
        new Page("log","update log","updates"),
        new Page("credits","credits","where i took stuff from"),
        new Page("history","history","evolution of the website")
        ]
]