const electron = require('electron');
const url = require('url');
const path = require('path');

const {app,BrowserWindow,Menu,IncomingMessage} = electron;

let window;

// Listen for app ready
app.on("ready",function(){

    window = new BrowserWindow({width:500,height:650,minHeight:650,minWidth:500,frame:false,title:"Loading...",resizable:true,backgroundColor:"#383c4a"})
    window.loadURL(url.format({
        pathname: path.join(__dirname,"index.html"),
        protocol: 'file',
        slashes:true
    }));
})