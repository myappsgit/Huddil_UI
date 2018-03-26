var loadJivoChat = function() {
    var widget_id = 'GHvdlXh2fX';
    var d = document;
    var w = window;

    function l() {
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = '//code.jivosite.com/script/widget/' + widget_id;
        var ss = document.getElementsByTagName('script')[0];
        ss.parentNode.insertBefore(s, ss);


    }




    if (d.readyState == 'complete') { l(); } else { if (w.attachEvent) { w.attachEvent('onload', l); } else { w.addEventListener('load', l, false); } }
}
var createCallback = function createCallback(name, email, mobile) {

    var scripts = 'function jivo_onLoadCallback() {jivo_api.setContactInfo({"name": "' + name + '","email": "' + email + '","phone": "' + mobile + '"});}';
    var s1 = document.createElement('script');
    s1.type = 'text/javascript';
    s1.innerText = scripts;
    var ss1 = document.getElementsByTagName('script')[0];
    ss1.parentNode.insertBefore(s1, ss1);
}

var closeJivoChatWindow = function closeJivoChatWindow() {
    jivo_api.close();
}


exports.loadJivoChat = loadJivoChat;
exports.createCallback = createCallback;
exports.closeJivoChatWindow = closeJivoChatWindow;