function template(data,t,e) {
    var tpl = document.getElementById(t),
        ele = document.getElementById(e);
    var arr=tpl.value.split(/<%|%>/);
    var str="var string='';";
    for(var i in arr){
        if(i%2==0){
            if(arr!="")
                str+="string+='"+arr[i].replace(/\s*/g, "")+"';";
        }else{
            if(arr[i].indexOf("=")==0){
                 str+="string+="+arr[i].substr(1)+";";
            }else{
                str+=arr[i];
            }
        }
    }
    eval(str);
    if(ele)
        ele.innerHTML = string;
    return string;
}
