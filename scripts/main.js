/**
 * Created by umair on 26/12/16.



 */

var lang;
var lang_sample;
var ifLocalStorage=0;
var ifUpload=0;
function init() {
    if (lang == undefined || lang == 'c') {
        lang = 'c';
    }
    if(!ifUpload) {
        lang_sample = lang_samples[lang];
        ace.edit("editor").setValue(lang_sample);
    }
    console.log("Language = " + lang);
    if(!ifLocalStorage) {
        loadLocalStorage();
        ifLocalStorage=1;
    }
    $("#panelLang").html(langName[lang]);
}

$('.changetheme').click(function (event) {
    event.preventDefault();
    var newtheme = $(this).attr('id');
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/" + newtheme);
});

$(document).ready(function () {
    var URL = "https://judge.cb.lk/api/";

    init();

    var runButton = $('#submit');
    runButton.click(function () {
        runButton.button('loading');
        var source = ace.edit("editor").getValue();
        if (lang === 'js') {
            var jsWorker = new Worker('scripts/javascriptWebWorker.js');
            var input = '';
            jsWorker.postMessage({source, input});

            jsWorker.onmessage = function (e) {
                console.log(e.data);
                runButton.button('reset');
                $('#output').text(e.data.output.join('\n'));
            };

            return;
        }

        source = window.btoa(source);
        var testcases = $("#test-input").val(); // cusotm inputs
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

    $('#clear').click(function () {
        ace.edit("editor").setValue('');
        document.getElementById('test-input').value = "";
        localStorage.clear();
        ifUpload=0;
    });

    $('.lang').click(function (event) {
        event.preventDefault();
        lang = $(this).attr('id');
        $('ul li.active').removeClass('active');
        $(this).closest('li').addClass('active');
        init();
    });

  $('#uploadFile').click(function(e){
    e.preventDefault();
    $('#upload').click();
  });

  var fileInput = document.getElementById('upload');
  fileInput.addEventListener('change', function(e) {
      var file = fileInput.files[0];
      var ext = file.name.split('.').pop();
      if(ext === 'js')
          lang='js';
      else if(ext === 'c')
          lang='c';
      else if(ext === 'cpp')
          lang='cpp';
      else if(ext === 'java')
          lang='java';
      else if(ext === 'py')
          lang='py2';
      else
          lang='c';
      $("#panelLang").html(langName[lang]);
      var reader = new FileReader();
      reader.onload = function(e) { // closure to set read data to editor
          ace.edit("editor").setValue(reader.result);
      }
      reader.readAsText(file);
      console.log("File Upload Success!");
      console.log("Language =" +lang);
      ifUpload=1;
  });

});

//toggle full-screen mode
$(document).ready(function () {
    //Toggle fullscreen
   var fs=false;
   $("#panel-fullscreen").click(function (e) {
     e.preventDefault();

     fs=!fs;
     var elem = document.body;
     if(fs)
        requestFullScreen(elem);
     else{
        exitFullScreen();
     }
     var $this = $(this);

     if ($this.children('i').hasClass('glyphicon-resize-full')){
			$this.attr('title','Exit Full Screen');
			$this.children('i').removeClass('glyphicon-resize-full');
            $this.children('i').addClass('glyphicon-resize-small');
      }
     else if($this.children('i').hasClass('glyphicon-resize-small')){
			$this.attr('title','Enter Full Screen Mode');
            $this.children('i').removeClass('glyphicon-resize-small');
            $this.children('i').addClass('glyphicon-resize-full');
      }
     $(this).closest('.hovercard').toggleClass('panel-fullscreen');
     $('.fsHide').toggleClass('fs')
	 $('#editor').toggleClass('change_height');
     editor.resize();
    });
});

var langName = {
    c: "C",
    cpp: "C++",
    java: "Java",
    py2: "Python",
    js : "JavaScript"
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
function exitFullScreen()
{
    if (document.exitFullscreen)
        document.exitFullscreen();
    else if (document.msExitFullscreen)
        document.msExitFullscreen();
    else if (document.mozCancelFullScreen)
        document.mozCancelFullScreen();
    else if (document.webkitExitFullscreen)
        document.webkitExitFullscreen();
}