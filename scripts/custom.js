function supportsLocalStorage() {
    return typeof(Storage) !== 'undefined';
}
function loadLocalStorage() {
    if (supportsLocalStorage()) {
        var code = localStorage.getItem('code');
        var codeLang = localStorage.getItem('Lang');
        var fileName = localStorage.getItem('fileName');
        var ifUpload_Local = localStorage.getItem('ifUpload');
        var cacheTheme = localStorage.getItem('Theme');
        var cacheFont = localStorage.getItem('Font');
        var cacheSize = localStorage.getItem('Size');
        var inputs = localStorage.getItem('Input');
        var autoSaveToggle = localStorage.getItem('autoSave');
        if (codeLang != undefined){
            lang = codeLang;
            editor.getSession().setMode(lang_mode[codeLang]);
          }
        if (code != undefined) {
            ace.edit("editor").setValue(code + '');
        }
        if (fileName != undefined)
            document.getElementById('fileName').value = fileName;
        if (inputs != undefined)
            document.getElementById('test-input').value = inputs;
        if (ifUpload_Local != undefined)
            ifUpload = ifUpload_Local;
        if (cacheTheme != undefined) {
            editor.setTheme("ace/theme/" + cacheTheme);
            editorTheme = cacheTheme;
        }
        if (cacheFont != undefined)
            setFont(cacheFont);
        if (cacheSize != undefined)
            setFontSize(cacheSize);
        if (autoSaveToggle != undefined)
            setAutoSave(autoSaveToggle);
        console.log("Local Storage Loaded!");
    }
}
function saveCode() {
    if (supportsLocalStorage()) {
        var textToSave = ace.edit("editor").getValue();
        var fileName = document.getElementById('fileName').value;
        var inputs = document.getElementById('test-input').value;
        localStorage.setItem('code', textToSave);
        localStorage.setItem('Lang', lang);
        localStorage.setItem('fileName', fileName);
        localStorage.setItem('Input', inputs);
        localStorage.setItem('ifUpload', ifUpload);
        localStorage.setItem('Theme', editorTheme);
        localStorage.setItem('Font', editorFontFamily);
        localStorage.setItem('Size', editorFontSize);
        localStorage.setItem('autoSave', autoSave);
        console.log("Saved!");
        changes = 0;
    }
}


var saveID = setInterval(function () {
    if (changes === 1 && autoSave === 1) {
        saveCode();
        $('.autoSaveText').fadeIn('slow').delay(2000).fadeOut('slow');
    }
}, 30 * 1000);

function saveCodeAsFile() {
    var textToWrite = ace.edit("editor").getValue();
    var textFileAsBlob = new Blob([textToWrite], {type: 'text/plain'});
    var fileNameToSaveAs = document.getElementById("fileName").value;
    if (fileNameToSaveAs == undefined || fileNameToSaveAs == null || fileNameToSaveAs == "") {
        fileNameToSaveAs = "main";
        if (lang === 'js')
            fileNameToSaveAs += ".js";
        else if (lang === 'c')
            fileNameToSaveAs += ".c";
        else if (lang === 'cpp')
            fileNameToSaveAs += ".cpp";
        else if (lang === 'java')
            fileNameToSaveAs += ".java";
        else if (lang === 'py2')
            fileNameToSaveAs += ".py";
        else
            fileNameToSaveAs += ".txt";
    }
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null) {
        // Chrome allows the link to be clicked without actually adding it to the DOM.
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    } else {
        // Firefox requires the link to be added to the DOM before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }

    downloadLink.click();
}

function destroyClickedElement(event) {
    // remove the link from the DOM
    document.body.removeChild(event.target);
}

function toggleSetting() {
    $("#settingModal").modal("toggle");
}

function setFont(Family) {
    editorFontFamily = Family;
    editor.setOptions({
        fontFamily: Family
    });
    changes = 1;
}

function setFontSize(Size) {
    editorFontSize = Size;
    editor.setOptions({
        fontSize: Size + 'px'
    });
    changes = 1;
}

function setAutoSave(val) {
    autoSave = val;
    changes = 1;
}

function resetSettings() {
    editor.setTheme("ace/theme/dawn");
    editor.setOptions({
        fontFamily: "Ubuntu Mono",
        fontSize: "16px"
    });
    editorFontFamily="Ubuntu Mono";
    editorFontSize = "16";
    editorTheme = "dawn";
    changes = 1;
}
