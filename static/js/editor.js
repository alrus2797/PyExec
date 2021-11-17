// Retrieve Elements
const consoleLogList = document.querySelector('.editor__console-logs');
const executeCodeBtn = document.querySelector('.editor__run');
const resetCodeBtn = document.querySelector('.editor__reset');

// Setup Ace
let codeEditor = ace.edit("editorCode");
let defaultCode = 'Escribe tu codigo aqui';
let consoleMessages = [];

let editorLib = {
    clearConsoleScreen() {
        consoleMessages.length = 0;

        // Remove all elements in the log list
        while (consoleLogList.firstChild) {
            consoleLogList.removeChild(consoleLogList.firstChild);
        }
    },
    printToConsole() {
        consoleMessages.forEach(log => {
            const newLogItem = document.createElement('li');
            const newLogText = document.createElement('pre');

            newLogText.className = log.class;
            newLogText.textContent = `> ${log.message}`;

            newLogItem.appendChild(newLogText);

            consoleLogList.appendChild(newLogItem);
        })
    },
    init() {
        // Configurar Ace

        // Theme
        codeEditor.setTheme("ace/theme/github");

        // Set language
        codeEditor.session.setMode("ace/mode/python");

        // Set Options
        codeEditor.setOptions({
            fontFamily: 'Inconsolata',
            fontSize: '12pt',
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
        });

        // Set Default Code
        codeEditor.setValue(defaultCode);
    }
}

// Events
executeCodeBtn.addEventListener('click', () => {
    editorLib.clearConsoleScreen();

    // Obtener el código que digitó el usuario
    const userCode = codeEditor.getValue();
    $('.loader').show('easeOutBack');
    $.ajax({ 
        crossDomain: true,
        type:"POST", 
        url:"http://34.134.205.13:8080/exec", 
        data:JSON.stringify({code:userCode}),
        success:function(datos){
            // console.log(datos,consoleMessages)
            $('.loader').hide('easeOutBounce');

            let splitted = datos.result.split('\n').slice(0,-1)
            splitted.forEach(line => {
                consoleMessages.push({message:line,class:"error"})
            })
            editorLib.printToConsole()  
        },
        contentType:"application/json",
        dataType: "json"

    })
    editorLib.printToConsole();
});

resetCodeBtn.addEventListener('click', () => {
    // Clear ace editor
    codeEditor.setValue(defaultCode);

    // Clear console messages
    editorLib.clearConsoleScreen();
})

editorLib.init();