function templateOld(data, t, e) {
        var tpl = document.getElementById(t),ele = document.getElementById(e),outStr,
            a = tpl.value.split(/<%|%>/),s = "outStr='';",i = 0;
        while (i < a.length) {
            if (i % 2 === 0) {
                if(/\S/.test(a[i]))
                    s += ";outStr+='" + a[i].replace(/[\r\n]/g, "") + "';";
            } else {
                if (a[i].indexOf("=") == 0)
                    s += ";outStr+=" + a[i].substr(1) + ";";
                else
                    s += a[i];
            }
            i++;
        }
        try{
            eval(s);
        }catch(e){
            console.error(e);
            outStr="{template error}";
        }
        if (ele)
            ele.innerHTML = outStr;
        return outStr;
    }
function template(data, t, e) {
        var tpl = document.getElementById(t),
            ele = document.getElementById(e),
            outStr,
            s ="outStr='"+tpl.value.replace(/[\r\n]/g, "").replace(/<%=([^<%=]*)%>/g, "';outStr+=$1;outStr+='").replace(/<%([^<%]*)%>/g,"';$1;outStr+='")+"';";
        try{
            eval(s);
        }catch(e){
            console.error(e);
            outStr="{template error}";
        }
        if (ele)
            ele.innerHTML = outStr;
        return outStr;
    }
function template2(data, t, e) {
        var tpl = document.getElementById(t),
            ele = document.getElementById(e),
            outStr,t=tpl.value,
            s ="outStr='"+t.replace(/[\r\n]/g, "").replace(/<%([^<%]*)%>/g,function(m,p){
                if(p.indexOf("=")==0)
                    return "';outStr+="+p.slice(1)+";outStr+='";
                else
                    return "';"+p+";outStr+='";
            })+"'";
        try{
            eval(s)
        }catch(e){
            console.error(e);
            outStr="{template error}";
        }
        if (ele)
            ele.innerHTML = outStr;
        return outStr;
    }
