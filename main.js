const electron = require('electron')
const url = require('url')
const path = require('path')

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;

app.on('ready', () => {
    //will run when the app is ready
    mainWindow = new BrowserWindow({webPreferences: {
        nodeIntegration: true
    }})

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }))

    //Quit app when close
    mainWindow.on('closed', ()=> {
        app.quit()
    })

    //Build menu
    const mainMenu  = Menu.buildFromTemplate(mainMenuTemplate)
    Menu.setApplicationMenu(mainMenu)
})


//-----------------------------
//          Menu
//-----------------------------

const mainMenuTemplate = [
    {
    label: 'File',
    submenu: [
        {
            label: 'Quit',
            accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',//hotkey
            click(){
                app.quit()
            }
        },
    ]
}]

//if mac add empty object
if(process.platform == 'darwin'){
    mainMenuTemplate.unshift({})
}

//add developer item
if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Developer tools',
        submenu: [{
            label: 'Toggle Dev tools',
            accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',//hotkey
            click(item, focusedWindow){
                focusedWindow.toggleDevTools()
            }
        }]
    })
}