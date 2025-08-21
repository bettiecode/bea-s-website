function setMedia(a)
{
    var obj;
    for(var i=0;i<mData.length;i++)
        {
            if(mData[i].id==a){obj=mData[i];}
        }
    for(var i=0;i<gData.length;i++)
        {
            if(gData[i].id==a){obj=gData[i];}
        }
    for(var i=0;i<aData.length;i++)
        {
            if(aData[i].id==a){obj=aData[i];}
        }
    //if(obj==null){return(1);}
    var line="" ;
    line+="<a href=";
    line+="'"+obj.mediaLink+"'";
    line+=">";
    line+="<b>"+obj.title+"</b>";
    line+=" by "+"<i>"+obj.creator+"</i>";
    line+=" ("+obj.release+")";
    line+="</a>"
    if(obj.type=="music")
    {
        line+="<img style=' border: solid 1px; width: 256px; float: right; margin: 16px;' src=";
        line+="'"+obj.imgLink+"'>";
    }
    line+='<br><br>'
    line+=document.getElementById(a).innerHTML;

    document.getElementById("selectedMedia").innerHTML=line;
}

function make()
{
    var line;
    var d;
    //music
    d=document.getElementById("media-music");
    line="";
    for(var i=0;i<mData.length;i++)
    {
        line+="<img ";
        line+="onclick="+'"setMedia('+"'"+mData[i].id+"'"+')" ';
        line+="src="+"'"+mData[i].imgLink+"' >";
    }
    d.innerHTML+=line;
    //games
    d=document.getElementById("media-games");
    line="";
    for(var i=0;i<gData.length;i++)
    {
        line+="<img ";
        line+="onclick="+'"setMedia('+"'"+gData[i].id+"'"+')" ';
        line+="src="+"'"+gData[i].imgLink+"' >";
    }
    d.innerHTML+=line;
    //animanga
    d=document.getElementById("media-animanga");
    line="";
    for(var i=0;i<aData.length;i++)
    {
        line+="<img ";
        line+="onclick="+'"setMedia('+"'"+aData[i].id+"'"+')" ';
        line+="src="+"'"+aData[i].imgLink+"' >";
    }
    d.innerHTML+=line;
}

function Element(id,type,title, creator, release, mediaLink, imgLink)
{
    this.id=id;
    this.type=type;
    this.title=title;
    this.creator=creator;
    this.release=release;
    this.mediaLink=mediaLink;
    this.imgLink=imgLink;
}
//music
let mData=[
    new Element(
        "afut",
        "music",
        "Ants From Up There",
        "Black Country, New Road",
        "2022",
        "https://www.youtube.com/playlist?list=OLAK5uy_lA-gMxOBo_UElG08bIl5oXE8Pcvu8k5sI",
        "https://upload.wikimedia.org/wikipedia/en/thumb/d/d7/Ants_from_Up_There_-_Black_Country%2C_New_Road.jpg/250px-Ants_from_Up_There_-_Black_Country%2C_New_Road.jpg"
    ),
    new Element(
     "the_scholars",
     "music",
     "The Scholars",
     "Carseat Headrest",
     "2025",
     "https://www.youtube.com/playlist?list=OLAK5uy_lKUmUTeEZiK696GmZnYTH51w2z4ny0ZLg",
     "https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Car_Seat_Headrest_-_The_Scholars_album_artwork.png/250px-Car_Seat_Headrest_-_The_Scholars_album_artwork.png"
    )



]
//games
let gData=[
    /*
    new Element(
        "ena_dream_bbq",
        "game",
        "ENA: Dream BBQ",
        "ENA Team",
        "2025",
        "https://store.steampowered.com/app/2134320/ENA_Dream_BBQ/",
        "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2134320/header.jpg?t=1755357900"
    ),
    */
    new Element(
     "minecraft",
     "game",
     "Minecraft",
     "Mojang",
     "2009",
     "https://www.minecraft.net/en-us",
     "https://www.nintendo.com/eu/media/images/10_share_images/games_15/nintendo_switch_4/2x1_NSwitch_Minecraft_image1600w.jpg"
    ),

    new Element(
     "portal2",
     "game",
     "Portal 2",
     "Valve",
     "2011",
     "https://store.steampowered.com/app/620/Portal_2/",
     "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/620/header.jpg?t=1745363004"
    ),

    new Element(
     "ultrakill",
     "game",
     "ULTRAKILL",
     "Hakita, New Blood Interactive",
     "2020",
     "https://store.steampowered.com/app/1229490/ULTRAKILL/",
     "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1229490/header.jpg?t=1740623813"   
    ),

    new Element(
        "yumenikki",
        "game",
        "Yume Nikki",
        "Kikiyama",
        "2004",
        "https://ynoproject.net/yume",
        "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/650700/header.jpg?t=1735124248"
    )

];
//animanga
let aData=
[
    new Element(
        "goodbye_eri",
        "manga",
        "Goodbye Eri",
        "Tatsuki Fujimoto",
        "2022",
        "https://goodbye-eri.com",
        "https://upload.wikimedia.org/wikipedia/en/d/da/Goodbye%2C_Eri_volume_cover.jpg"
    ) 
]