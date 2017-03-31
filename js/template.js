function template(data, t, e) {
    var tpl = document.getElementById(t),ele = document.getElementById(e),
        a = tpl.value.split(/<%|%>/),s = "var outStr='';",i = 0;
    while (i < a.length) {
        if (i % 2 == 0) {
            if (a != "")
                s += "outStr+='" + a[i].replace(/\s*/g, "") + "';";
        } else {
            if (a[i].indexOf("=") == 0)
                s += "outStr+=" + a[i].substr(1) + ";";
            else
                s += a[i];
        }
        i++;
    }
    eval(s);
    if (ele)
        ele.innerHTML = outStr;
    return outStr;
}
