/**
 * Created by umair on 26/12/16.

 */

var lang;
var lang_sample;
var ifLocalStorage = 0;
var ifUpload = 0;
var editorTheme = "dawn";
var editorFontFamily = "Ubuntu Mono";
var editorFontSize = "16";
var editorHasChanged = false;
var autoSave = 1;
var changes = 0;
function init() {
    if (lang == undefined || lang == 'c') {
        lang = 'c';
    }

    if (!ifLocalStorage) {
        loadLocalStorage();
        ifLocalStorage = 1;
        changes = 0;
    }
    if (!ifUpload) {
        lang_sample = lang_samples[lang];
        ace.edit("editor").setValue(lang_sample);
        editor.setOptions({
            fontSize: '16px',
            fontFamily: "Ubuntu Mono"
        });
        editorHasChanged = false;
    }
    console.log("Language = " + lang);

    $("#panelLang").html(langName[lang] + " <span class='caret'></span>");
}


editor.getSession().on('change', function () {
    editorHasChanged = true;
});

$('.changetheme').click(function (event) {
    event.preventDefault();
    var newtheme = $(this).attr('id');
    editorTheme = newtheme;
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/" + newtheme);
    changes = 1;
});

$(document).ready(function () {
    var URL = "https://judge.cb.lk/api/";

    init();

    var runButton = $('#submit');
    runButton.click(function () {
        runButton.button('loading');

        var source = ace.edit("editor").getValue();
        var testcases = $("#test-input").val(); // cusotm inputs

        if (lang === 'js') {
            var jsWorker = new Worker('scripts/javascriptWebWorker.js');
            var input = JSON.stringify(testcases);
            console.log(input);
            jsWorker.postMessage({source, input});

            jsWorker.onmessage = function (e) {
                console.log(e.data);
                runButton.button('reset');
                $('#output').text(e.data.output.join('\n'));
            };

            return;
        }

        source = window.btoa(source);
        testcases = window.btoa(testcases);
        var expected = '';

        var config = {
            headers: {'Access-Token': '79f3c2f8301fc60565de003f4ac76a1d4e5242cb0836995ec2bd28fd083ce86f'}
        };
        axios.post(URL + 'submission', {
            lang: lang,
            source: source,
            test_count: 1, //Always 1 for the IDE
            input: [testcases], //only one testcase required in IDE
            expected_output: [expected], //only one expected output required in IDE
            get_output: true, //Always true for the IDE
            wait: true //Always true for the one hosted at GitHub Pages
        }, config).then(function (response) {
            runButton.button('reset');
            var data = response.data;
            if (data.result == "compile_error") {
                var output = data.error;
                output = window.atob(output);
                $('#output').text(output);
            } else {
                var output = data.data.testcases[0].output;
                output = window.atob(output);
                $('#output').text(output);
            }
        }).catch(function (error) {
            console.log(error);
        });
    });

    $('#reset').click(function () {
        resetSettings();
        document.getElementById('test-input').value = "";
        document.getElementById('fileName').value = "";
        lang_sample = lang_samples[lang];
        ace.edit("editor").setValue(lang_sample);
        ifUpload = 0;
        localStorage.clear();
    });

    $('#clear').click(function () {
        lang_sample = lang_samples[lang];
        ace.edit("editor").setValue(lang_sample);
        document.getElementById('test-input').value = "";
        document.getElementById('fileName').value = "";
        document.getElementById('output').value = "";
    });

    var select;
    $('.lang').click(function (event) {
        event.preventDefault();
        if (editorHasChanged) {
            $("#confirmModal").modal("toggle");
            select = this;
        } else {
            lang = $(this).attr('id');
            $('ul li.active').removeClass('active');
            $(this).closest('li').addClass('active');
            init();
        }
        editor.getSession().setMode(lang_mode[$(this).attr('id')]);
    });
    $('#keepChanges').click(function () {
        lang = $(select).attr('id');
        $('ul li.active').removeClass('active');
        $(this).closest('li').addClass('active');
        ifUpload = 1;
        init();
        $("#confirmModal").modal("hide");
    });

    $('#discardChanges').click(function () {
        lang = $(select).attr('id');
        $('ul li.active').removeClass('active');
        $(this).closest('li').addClass('active');
        ifUpload = 0;
        init();
        $("#confirmModal").modal("hide");
    });

    $('#uploadFile').click(function (e) {
        e.preventDefault();
        $('#upload').click();
    });

    var fileInput = document.getElementById('upload');
    fileInput.addEventListener('change', function (e) {
        var file = fileInput.files[0];
        document.getElementById("fileName").value = file.name;
        var ext = file.name.split('.').pop();
        if (ext === 'js')
            lang = 'js';
        else if (ext === 'c')
            lang = 'c';
        else if (ext === 'cpp')
            lang = 'cpp';
        else if (ext === 'java')
            lang = 'java';
        else if (ext === 'py')
            lang = 'py2';
        else {
            lang = 'c';
        }
        $("#panelLang").html(langName[lang] + '<span class="caret" style="margin-left: 5px"></span>');
        var reader = new FileReader();
        reader.onload = function (e) { // closure to set read data to editor
            ace.edit("editor").setValue(reader.result);
        }
        reader.readAsText(file);
        console.log("File Upload Success!");
        console.log("Language =" + lang);
        ifUpload = 1;
    });

});

$('#test-input').on('change', function () {
    changes = 1;
});
$('#fileName').on('change', function () {
    changes = 1;
});

//toggle full-screen mode
$(document).ready(function () {
    if ($(window).width() > 1024) {
        var cw = $('#editor').width();
        cw = 0.5625 * cw;
        $('#editor').css({'height': cw + 'px'});
    }
    //Toggle fullscreen

    var fs = false;
    window.isInpBoxHidden = false;
    $("#panel-fullscreen").click(function (e) {
        e.preventDefault();

        fs = !fs;
        var elem = document.body;
        $('.headPanel').toggleClass('fullscreen');
        if (fs) {
            $('#custInp').hide();
            requestFullScreen(elem);
        }
        else {
            $('#custInp').show();
            exitFullScreen();
        }
        var $this = $(this);

        if ($this.children('i').hasClass('glyphicon-resize-full')) {
            $this.attr('title','Exit Full Screen');
            $this.children('i').removeClass('glyphicon-resize-full');
            $this.children('i').addClass('glyphicon-resize-small');
        }
        else if ($this.children('i').hasClass('glyphicon-resize-small')) {
            $this.attr('title', 'Enter Full Screen Mode');
            $this.children('i').removeClass('glyphicon-resize-small');
            $this.children('i').addClass('glyphicon-resize-full');
        }
        $(this).closest('.hovercard').toggleClass('panel-fullscreen');
        $('.fsHide').toggleClass('fs')
        $('#editor').toggleClass('change_height');
        editor.resize();
    });

    $('#copyToClip').click(function () {
        copyEditorCode();
    });
});

var langName = {
    c: "C",
    cpp: "C++",
    java: "Java",
    py2: "Python",
    js: "JavaScript"
};

var lang_mode = {
  c: "ace/mode/c_cpp",
  cpp: "ace/mode/c_cpp",
  java: "ace/mode/java",
  py2: "ace/mode/python",
  js: "ace/mode/javascript"
};

function requestFullScreen(element) {
    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

    if (requestMethod) { // Native full screen.
        requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}
function exitFullScreen() {
    if (document.exitFullscreen)
        document.exitFullscreen();
    else if (document.msExitFullscreen)
        document.msExitFullscreen();
    else if (document.mozCancelFullScreen)
        document.mozCancelFullScreen();
    else if (document.webkitExitFullscreen)
        document.webkitExitFullscreen();
}

function toggleCustInp() {
    window.isInpBoxHidden = !window.isInpBoxHidden;
    var inp = $('#test-input');
    if (isInpBoxHidden) {
        localStorage.setItem('inputData',inp.html());
        inp.html(null);
    } else {
        inp.html(localStorage.getItem('inputData'));
    }
    $("#custInpBox").toggleClass('hide');
}

function copyEditorCode() {
    ace.edit("editor").selectAll();
    ace.edit("editor").focus();
    document.execCommand('copy');
}