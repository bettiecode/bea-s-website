function make()
{
    var line="";
    for(var i=1;i<=12;i++)
    {
        line+="<img src='lbh/lbh"+String(i)+".jpg'><br  >\n"
    }
    document.getElementById("lbhGallery").innerHTML=line;
}
make()