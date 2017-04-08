//pc端判断浏览器大全
function browserType(){
    var userAgent=navigator.userAgent;
    if(userAgent.indexOf("Trident")>-1)
        var core="Trident";
    else
        var core="Webkit";

    if(userAgent.indexOf("2345Explorer")>-1){
        return "2345("+core+")";
    }
    if(userAgent.indexOf("QQBrowser")>-1){
        return "QQBrowser("+core+")";
    }
    if(userAgent.indexOf("MetaSr")>-1){
        return "搜狗("+core+")";
    }
    if(userAgent.indexOf("LBBROWSER")>-1){
        return "猎豹("+core+")";
    }
    if(userAgent.indexOf("UBrowser")>-1){
        return "UC("+core+")";
    }
    if(userAgent.indexOf("Maxthon")>-1){
        return "遨游("+core+")";
    }
    if(userAgent.indexOf("BIDUBrowser")>-1){
        return "BaiduBrowser("+core+")";
    }
    if(userAgent.indexOf("The World")>-1){
        return "世界之窗("+core+")";
    }
    if(userAgent.indexOf("Trident")>-1){//if(!!window.ActiveXObject || "ActiveXObject" in window){
        return "IE";
    }
    if(userAgent.indexOf("Edge")>-1){
        return "Edge";
    }
    if(userAgent.indexOf("Opera")>-1){
        if(userAgent.indexOf("Presto"))
            return "Opera(Presto)";
        else
            return "Opera(Webkit)";
    }
    if(userAgent.indexOf("Firefox")>-1){
        return "Firefox";
    }
    if(userAgent.indexOf("Chrome")>-1){
        return "Chrome";
    }
    if(userAgent.indexOf("Safari")>-1){
        return "Safari";
    }
    return "unknow";
}