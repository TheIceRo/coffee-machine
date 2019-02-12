const remote = require('electron').remote;
const {BrowserWindow} = require("electron").remote;
const path = require("path");
var os = require("os");
var url = require("url");
var osutil = require("os-utils");
var toggle = false;
var debug = false;
var maximized = false;
var ls = window.localStorage;
var fs = require("fs");

// Debug stuff
window.setInterval(function(){
    osutil.cpuUsage(function(v){
        document.getElementById("cpu-percentage").innerHTML = "app uses: "+Math.floor(v*10)+"%";
    });
},500)
//Loads event listeners
function loadListeners(){
    var window = remote.getCurrentWindow();
    document.getElementById("close").addEventListener("click",function(){
        window.close()
    });
    document.getElementById("minimize").addEventListener("click",function(){
        window.minimize();
    });
    document.getElementById("maximize").addEventListener("click",function(){
        if(maximized){
            window.restore();
            maximized = false;
        }
        else{
            maximized = true;
            window.maximize();
        }
    });
    document.getElementById("refresh").addEventListener("click",function(){
        window.reload();
    });
    document.getElementById("titlebar-title").addEventListener("click",function(){
        const modalPath = path.join("file://",__dirname,"/tips-editor.html");
        let win = new BrowserWindow({width:500,height:560,frame:false,resizable:false,backgroundColor:"#383c4a"});
        win.on('close', ()=>{win=null});
        win.loadURL(modalPath);
        win.show();
    });
    document.getElementById("cappuccino-toggle").addEventListener("click",function(){
        toggle=!toggle;
        toggleCaffeine(toggle);
    });
}
// Toggles Cappuccino mode
function toggleCaffeine(tog){
    toggle = tog;
    if(tog==true){
        document.getElementById("cappuccino-toggle").classList.add("toggle-on");
        document.getElementsByTagName("body")[0].classList.add("cappuccino");
    }
    if(tog==false){
        document.getElementById("cappuccino-toggle").classList.remove("toggle-on");
        document.getElementsByTagName("body")[0].classList.remove("cappuccino");
    }
    ls.setItem("cappuccino",toggle);
}
// Executes only when the app starts
function start(){
    document.getElementById("cpu-data").innerHTML = os.cpus()[0].model;
    toggle = JSON.parse(ls.getItem("cappuccino"));

    var loaded = fs.readFileSync("tips.json");
    var beans = JSON.parse(loaded);

    console.log(beans);

    loadListeners();
    toggleCaffeine(toggle);
    loadModules();
}
function loadTips(number){
    var loaded = fs.readFileSync("tips.json");
    var beans = JSON.parse(loaded);
    document.getElementById("topic-title").innerHTML = beans[number].name;
    var tip = document.getElementsByClassName("tip");
    while (document.getElementById("tip-list").firstChild) {
        document.getElementById("tip-list").removeChild(document.getElementById("tip-list").firstChild);
    }
    for(var i=0;i<beans[number].tips.length;i++){
        var tip_clone = tip[0].cloneNode(true);
        tip_clone.classList.remove("hidden");
        tip_clone.getElementsByClassName("tip-title")[0].innerHTML = beans[number].tips[i].title;
        tip_clone.getElementsByClassName("tip-text")[0].innerHTML = beans[number].tips[i].text;
        document.getElementById("tip-list").appendChild(tip_clone);
    }
}
function loadModules(){
    var loaded = fs.readFileSync("tips.json");
    var beans = JSON.parse(loaded);
    var b = document.getElementsByClassName("button")[0];
    for(let i=0;i<beans.length;i++){
        var b_clone = b.cloneNode(true);
        b_clone.innerHTML = beans[i].name;
        b_clone.addEventListener("click",function(){ loadTips(i); });
        b_clone.classList.remove("hidden");
        document.getElementsByClassName("topic-list")[0].appendChild(b_clone);
    }
}
document.addEventListener("DOMContentLoaded",function(){
    start();
})