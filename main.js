const electron = require('electron')
const url = require('url')
const path = require('path')
const {decryptCode} = require('./backend/code_import')

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let codeWindow;

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
//     Code import window
//-----------------------------
function createCodeWindow(){
    codeWindow = new BrowserWindow({
        width: 750,
        height: 600,
        title: 'Import from code',
        webPreferences: {
            nodeIntegration: true
        }
    })

    codeWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'codeImport.html'),
        protocol: 'file:',
        slashes: true
    }))

    //garbage collection
    codeWindow.on('close', () => {
        codeWindow = null
    })
}

//Catch code:import
ipcMain.on('code:import', (e, item) => {
    decrypted = decryptCode(item)
    
    codeWindow.close()
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
    },
    {
        label: 'Code',
        submenu: [
            {
                label: 'Import from Code',
                click(){
                    createCodeWindow()
                }
            }
        ]
    }
]

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