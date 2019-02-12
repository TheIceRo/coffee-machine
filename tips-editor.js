const remote = require('electron').remote;
const prompt = require('electron-prompt');
var ls = window.localStorage;
var fs = require("fs");
var loadedNumber = null;

var defaultTopic = 
{
    "name":"NewTopic",
    "tips":
    [
        {
            "title":"Title",
            "text":"Text"
        }
    ]
}
var defaultTip = {
    "title":"Title",
    "text":"text"
}
// Toggles Cappuccino mode
function toggleCaffeine(tog){
    toggle = tog;
    if(tog==true){
        document.getElementsByTagName("body")[0].classList.add("cappuccino");
    }
    if(tog==false){
        document.getElementsByTagName("body")[0].classList.remove("cappuccino");
    }
    ls.setItem("cappuccino",toggle);
}
function loadTips(number){
    loadedNumber = number;
    var loaded = fs.readFileSync("tips.json");
    var beans = JSON.parse(loaded);
    document.getElementById("topic-title").innerHTML = beans[number].name;
    var tip = document.getElementsByClassName("tip");
    while (document.getElementById("tip-list").firstChild) {
        document.getElementById("tip-list").removeChild(document.getElementById("tip-list").firstChild);
    }
    for(let i=0;i<beans[number].tips.length;i++){
        let tip_clone = tip[0].cloneNode(true);
        tip_clone.classList.remove("hidden");
        tip_clone.getElementsByClassName("tip-title")[0].innerHTML = beans[number].tips[i].title;
        tip_clone.getElementsByClassName("tip-title")[0].addEventListener("click",function(){
            prompt({
                height: 150,
                title: 'Rename Topic',
                label: 'New Topic name:',
                value: '',
                inputAttrs: {
                    type: 'text'
                }
            })
            .then((r) => {
                if(r === null) {
                    console.log('user cancelled');
                } else {
                    tip_clone.getElementsByClassName("tip-title")[0].innerHTML = r;
                    var tiploaded = fs.readFileSync("tips.json");
                    var tipbeans = JSON.parse(tiploaded);
                    tipbeans[loadedNumber].tips[i].title = r;   
                    fs.writeFile("tips.json", JSON.stringify(tipbeans,null,2), function (err) {
                        if (err) return console.log(err);
                        console.log(JSON.stringify(tipbeans));
                        console.log('writing to ' + "tips.json");
                    });
                    console.log('result', r);
                }
            })
            .catch(console.error);
        })
        tip_clone.getElementsByClassName("tip-text")[0].innerHTML = beans[number].tips[i].text;
        tip_clone.getElementsByClassName("tip-text")[0].addEventListener("click",function(){
            prompt({
                height: 150,
                title: 'Rename Topic',
                label: 'New Topic name:',
                value: '',
                inputAttrs: {
                    type: 'text'
                }
            })
            .then((r) => {
                if(r === null) {
                    console.log('user cancelled');
                } else {
                    tip_clone.getElementsByClassName("tip-text")[0].innerHTML = r;
                    var tiploaded = fs.readFileSync("tips.json");
                    var tipbeans = JSON.parse(tiploaded);
                    tipbeans[loadedNumber].tips[i].text = r;
                    fs.writeFile("tips.json", JSON.stringify(tipbeans,null,2), function (err) {
                        if (err) return console.log(err);
                        console.log(JSON.stringify(tipbeans));
                        console.log('writing to ' + "tips.json");
                    });
                    console.log('result', r);
                }
            })
            .catch(console.error);
        })

        document.getElementById("tip-list").appendChild(tip_clone);
    }
}
function loadModules(){
    var loaded = fs.readFileSync("tips.json");
    var beans = JSON.parse(loaded);
    var b = document.getElementsByClassName("button")[0];
    while (document.getElementsByClassName("topic-list")[0].firstChild) {
        document.getElementsByClassName("topic-list")[0].removeChild(document.getElementsByClassName("topic-list")[0].firstChild);
    }
    for(let i=0;i<beans.length;i++){
        var b_clone = b.cloneNode(true);
        b_clone.innerHTML = beans[i].name;
        b_clone.addEventListener("click",function(){ loadTips(i); });
        b_clone.classList.remove("hidden");
        document.getElementsByClassName("topic-list")[0].appendChild(b_clone);
    }
}
function loadListeners(){
    var window = remote.getCurrentWindow();
    document.getElementById("close").addEventListener("click",function(){
        window.close()
    });
    document.getElementById("refresh").addEventListener("click",function(){
        window.reload();
    });
    document.getElementById("topic-title").addEventListener("click",function(){
        promptName();
    });
    document.getElementById("add-topic").addEventListener("click",function(){
        promptTopic();
    });
    document.getElementById("add-tip").addEventListener("click",function(){
        addTip();
    });
}
function promptName(){
    prompt({
        height: 150,
        title: 'Rename Topic',
        label: 'New Topic name:',
        value: '',
        inputAttrs: {
            type: 'text'
        }
    })
    .then((r) => {
        if(r === null) {
            console.log('user cancelled');
        } else {
            renameTopic(r);
            console.log('result', r);
        }
    })
    .catch(console.error);
}
function promptTopic(){
    prompt({
        height: 150,
        title: 'Create Topic',
        label: 'Create a new Topic:',
        value: '',
        inputAttrs: {
            type: 'text'
        }
    })
    .then((r) => {
        if(r === null) {
            console.log('user cancelled');
        } else {
            addTopic(r);
            console.log('result', r);
        }
    })
    .catch(console.error);
}
function addTopic(name){
    var loaded = fs.readFileSync("tips.json");
    var beans = JSON.parse(loaded);
    var number = beans.length;
    beans[number] = defaultTopic;
    beans[number].name = name;
    var b = document.getElementsByClassName("button")[0];
    var b_clone = b.cloneNode(true);
    b_clone.addEventListener("click",function(){ loadTips(number);});
    b_clone.classList.remove("hidden");
    b_clone.innerHTML = name;
    document.getElementsByClassName("topic-list")[0].appendChild(b_clone);
    fs.writeFile("tips.json", JSON.stringify(beans,null,2), function (err) {
        if (err) return console.log(err);
        console.log(JSON.stringify(beans));
        console.log('writing to ' + "tips.json");
    });
}
function addTip(){
    var loaded = fs.readFileSync("tips.json");
    var beans = JSON.parse(loaded);
    currentTipLength = beans[loadedNumber].tips.length;
    beans[loadedNumber].tips.push(defaultTip);
    fs.writeFile("tips.json", JSON.stringify(beans,null,2), function (err) {
        if (err) return console.log(err);
        console.log(JSON.stringify(beans));
        console.log('writing to ' + "tips.json");
    });
    let tip_clone = document.getElementsByClassName("tip")[0].cloneNode(true);
    tip_clone.classList.remove("hidden");
    tip_clone.getElementsByClassName("tip-title")[0].innerHTML = beans[loadedNumber].tips[currentTipLength].title;
    tip_clone.getElementsByClassName("tip-title")[0].addEventListener("click",function(){
        prompt({
            height: 150,
            title: 'Rename Topic',
            label: 'New Topic name:',
            value: '',
            inputAttrs: {
                type: 'text'
            }
        })
        .then((r) => {
            if(r === null) {
                console.log('user cancelled');
            } else {
                tip_clone.getElementsByClassName("tip-title")[0].innerHTML = r;
                var tiploaded = fs.readFileSync("tips.json");
                var tipbeans = JSON.parse(tiploaded);
                console.log(JSON.stringify(tipbeans));
                tipbeans[loadedNumber].tips[currentTipLength].title = r;
                fs.writeFile("tips.json", JSON.stringify(tipbeans,null,2), function (err) {
                    if (err) return console.log(err);
                    console.log(JSON.stringify(tipbeans));
                    console.log('writing to ' + "tips.json");
                });
                console.log('result', r);
            }
        })  
        .catch(console.error);
    })
    tip_clone.getElementsByClassName("tip-text")[0].innerHTML = beans[loadedNumber].tips[currentTipLength].text;

    tip_clone.getElementsByClassName("tip-text")[0].addEventListener("click",function(){
        prompt({
            height: 150,
            title: 'Rename Text',
            label: 'Text:',
            value: '',
            inputAttrs: {
                type: 'text'
            }
        })
        .then((r) => {
            if(r === null) {
                console.log('user cancelled');
            } else {
                tip_clone.getElementsByClassName("tip-text")[0].innerHTML = r;
                var tiploaded = fs.readFileSync("tips.json");
                var tipbeans = JSON.parse(tiploaded);
                console.log(JSON.stringify(tipbeans));
                tipbeans[loadedNumber].tips[currentTipLength].text = r;
                fs.writeFile("tips.json", JSON.stringify(tipbeans,null,2), function (err) {
                    if (err) return console.log(err);
                    console.log(JSON.stringify(tipbeans));
                    console.log('writing to ' + "tips.json");
                });
                console.log('result', r);
            }
        })  
        .catch(console.error);
    })
    tip_clone.getElementsByClassName("tip-text")[0].innerHTML = beans[loadedNumber].tips[currentTipLength].text;

    document.getElementById("tip-list").appendChild(tip_clone);
}
function renameTopic(name){
    var loaded = fs.readFileSync("tips.json");
    var beans = JSON.parse(loaded);
    document.getElementById("topic-title").innerHTML = name;
    beans[loadedNumber].name = name;
    
    fs.writeFile("tips.json", JSON.stringify(beans,null,2), function (err) {
        if (err) return console.log(err);
        console.log(JSON.stringify(beans));
        console.log('writing to ' + "tips.json");
    });
    document.getElementsByClassName("topic-list")[0].children[loadedNumber].innerHTML = name;
}
function start(){
    loadListeners();
    toggle = JSON.parse(ls.getItem("cappuccino"));
    toggleCaffeine(toggle);
    loadModules();
    loadTips(0);
}
document.addEventListener("DOMContentLoaded",function(){
    start();
});