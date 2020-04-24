$(document).ready(function() {
    $("#decrease").click(function() {
        var textStr = $("body").css("font-size");
        textStr = textStr.substring(0, textStr.length - 2); //remove px from the end of the string
        
        var textSize = Number(textStr);
        if(textSize >= 10) {
            textSize = textSize - 5;
            textStr = textSize.toString() + "px";
            $("body").css("font-size", textStr);
        }
    });

    $("#increase").click(function() {
        var textStr = $("body").css("font-size");
        textStr = textStr.substring(0, textStr.length - 2); //remove px from the end of the string
        
        var textSize = Number(textStr);
        if(textSize <= 30) {
            textSize = textSize + 5;
            textStr = textSize.toString() + "px";
            $("body").css("font-size", textStr);
        }
    });
});