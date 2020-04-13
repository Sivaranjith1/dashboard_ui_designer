function decryptCode(code){
    let output = []
    /* 
        {
            type: rectangle,
            x: int,
            y: int,
            length: int,
            ...
        }
    */
    

    //draw_line
    text = findRegex(code, 'draw_text')
    console.log(text,'\n')
    
    return 'sa' + code
}

function findRegex(code, regex){
    const regex_line = new RegExp(`${regex}([^)]+)`, 'g');
    //regex + /\(([^)]+)\)/g
    console.log(regex_line)
    let lines = [...code.matchAll(regex_line)] 

    return lines.map(elem => 
        elem[1]
        .substring(1)
        .split(',')
        .map(sub =>
            sub
            .replace(/ /g, "")
            .replace(/\"/g, '')
            )
        )
}

exports.decryptCode = decryptCode