(function() {
    var winWidth = window.innerWidth,
        winHeight = window.innerHeight;
    var arrs = [];
    var redoArr = [];
    var currObj = {};
    var base64;
    var start = false;
    var colorControl;
    var controlDiv = $('#control'),
        scSelect = $('#strokeColor'),
        fcSelect = $('#fillColor'),
        widthSelect = $('#linewidth'),
        rotateSelect = $('#rotatedeg'),
        scSelectSpan = $('#strokeColor span')[0],
        fcSelectSpan = $('#fillColor span')[0],
        widthSelectSpan = $('#linewidth span')[0],
        rotateSelectSpan = $('#rotatedeg span')[0],
        //颜色
        redRange = $('#red'),
        greenRange = $('#green'),
        blueRange = $('#blue'),
        opacityRange = $('#opacity'),
        //线宽
        widthRange = $('#width'),
        //角度
        rotateRange = $('#rotate'),
        resetRotate = $('#resetRotate'),
        //操作栏按钮
        rgbaRangeCon = $('.rgbalabel'),
        widthRangeCon = $('.widthlabel'),
        rotateRangeCon = $('.rotatelabel')
    styleSelecter = $('#styleSelecter'),
        clear = $('#clear'),
        undo = $('#undo'),
        redo = $('#redo'),
        insertImg = $('#insertImg');
    var canvas = $('#canvas'),
        canvasmask = $("#canvasmask"),
        fileimg = $('#fileimg'),
        img = $('#img');
    var style = "line",
        rotateDeg = 0,
        lineWidth = 1,
        strokeColor = "rgba(0,0,0,1)",
        strokeColorArr = [0, 0, 0, 1],
        fillColor = "rgba(0,0,0,1)",
        fillColorArr = [0, 0, 0, 1];
    var ctx = canvasinit(canvas, true),
        maskctx = canvasinit(canvasmask, true);
    ctx.fillStyle = 'rgba(255,255,255,1)';
    ctx.fillRect(0, 0, winWidth, winHeight);

    window.onresize = function() {
        winWidth = window.innerWidth;
        winHeight = window.innerHeight;
        canvasinit(canvas);
        canvasinit(canvasmask);
    }

    function $(str) {
        var arr = str.split(/\s+/);
        if (arr[arr.length - 1][0] === "#") {
            return document.querySelector(str);
        } else {
            return document.querySelectorAll(str);
        }
    }

    function on(arr, methods, callback) {
        for (var i = 0; i < arr.length; i++) {
            var method = methods.split(/\s+/);
            for (var j = 0; j < method.length; j++) {
                if (!!navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
                    if (method[j].indexOf('mouse') === -1) {
                        arr[i].addEventListener(method[j], function(event) {
                            event.preventDefault();
                            callback(event);
                        }, false)
                    }
                } else {
                    arr[i].addEventListener(method[j], function(event) {
                        event.preventDefault();
                        callback(event);
                    }, false)
                }
            }
        }
    }

    function show(arr) {
        for (var i = 0; i < arr.length; i++) {
            arr[i].style.display = "initial";
        }
    }

    function hide(arr) {
        for (var i = 0; i < arr.length; i++) {
            arr[i].style.display = "none";
        }
    }

    function canvasinit(cvs, c) {
        cvs.style.width = winWidth + "px";
        cvs.width = winWidth;
        cvs.style.height = winHeight + "px";
        cvs.height = winHeight;
        if (c) {
            var context = cvs.getContext('2d');
            context.strokeStyle = strokeColor;
            context.fillColor = fillColor;
            context.lineWidth = lineWidth;
            context.lineCap = "round";
            return context
        }
    }

    function initColor(colorArr) {
        redRange.value = colorArr[0];
        redRange.previousElementSibling.innerText = colorArr[0];
        greenRange.value = colorArr[1];
        greenRange.previousElementSibling.innerText = colorArr[1];
        blueRange.value = colorArr[2];
        blueRange.previousElementSibling.innerText = colorArr[2];
        opacityRange.value = colorArr[3];
        opacityRange.previousElementSibling.innerText = colorArr[3];
    }

    function setColor(colorArr) {
        if (colorControl === 1) {
            strokeColor = "rgba(" + colorArr[0] + "," + colorArr[1] + "," + colorArr[2] + "," + colorArr[3] + ")";
            strokeColorArr = colorArr;
            scSelectSpan.style.borderColor = strokeColor;
            widthSelectSpan.style.background = strokeColor;
        } else {
            fillColor = "rgba(" + colorArr[0] + "," + colorArr[1] + "," + colorArr[2] + "," + colorArr[3] + ")";
            fillColorArr = colorArr;
            fcSelectSpan.style.background = fillColor;
        }
    }

    function setWidth(width) {
        lineWidth = width;
        widthSelectSpan.style.height = (lineWidth > 12 ? 12 : lineWidth) + "px";
        widthSelectSpan.style.background = strokeColor;
    }

    function setRotate(deg) {
        rotateDeg = deg;
        rotateSelectSpan.innerText = deg;
    }

    function drawLine(curr, context) {
        var arr = curr.trace;
        if (arr.length > 3) {
            context.beginPath();
            context.lineWidth = curr.lineWidth;
            context.strokeStyle = curr.fillColor;
            context.moveTo(arr[0].x, arr[0].y);
            for (var i = 1; i < arr.length - 2; i += 3) {
                //context.quadraticCurveTo(arr[i].x, arr[i].y, arr[i + 1].x, arr[i + 1].y);
                context.bezierCurveTo(arr[i].x, arr[i].y, arr[i + 1].x, arr[i + 1].y, arr[i + 2].x, arr[i + 2].y)
            }
            context.lineTo(arr[arr.length - 1].x, arr[arr.length - 1].y);
        }
        context.stroke();
    }

    function drawRect(curr, status, context) {
        var arr = curr.trace;
        if (arr.length > 1) {
            context.beginPath();
            context.lineWidth = curr.lineWidth;
            context.strokeStyle = curr.strokeColor;
            context.fillStyle = curr.fillColor;
            var x = (arr[1].x + arr[0].x) / 2;
            var y = (arr[1].x + arr[0].x) / 2;
            rotate(context, x, y, curr.rotateDeg, function() {
                context.rect(arr[0].x, arr[0].y, arr[1].x - arr[0].x, arr[1].y - arr[0].y);
            })
            if (status === 0) {
                context.stroke();
            } else if (status === 1) {
                context.fill();
            } else if (status == 2) {
                context.stroke();
                context.fill();
            }
        }
    }

    function drawCircle(curr, status, context) {
        var arr = curr.trace;
        if (arr.length > 1) {
            context.beginPath();
            context.lineWidth = curr.lineWidth;
            context.strokeStyle = curr.strokeColor;
            context.fillStyle = curr.fillColor;
            var x = (arr[1].x + arr[0].x) / 2;
            var y = (arr[1].y + arr[0].y) / 2;
            var r = Math.sqrt(Math.pow(arr[0].x - x, 2) + Math.pow(arr[0].y - y, 2));
            context.arc(x, y, r, 0, 2 * Math.PI);
            if (status === 0) {
                context.stroke();
            } else if (status === 1) {
                context.fill();
            } else if (status == 2) {
                context.stroke();
                context.fill();
            }
        }
    }

    function drawImage(curr, context) {
        var arr = curr.trace;
        if (arr.length > 1) {
            context.beginPath();
            context.lineWidth = curr.lineWidth;
            context.strokeStyle = curr.strokeColor;
            var dW = arr[1].x - arr[0].x;
            var dH = arr[1].y - arr[0].y;
            var image = curr.imageSource;
            var x = (arr[1].x + arr[0].x) / 2;
            var y = (arr[1].x + arr[0].x) / 2;
            rotate(context, x, y, curr.rotateDeg, function() {
                context.drawImage(image, 0, 0, curr.imgWidth, curr.imgHeight, arr[0].x, arr[0].y, dW, dH);
            })
        }
    }

    function rotate(context, x, y, deg, callback) {
        context.translate(x, y); //将绘图原点移到画布中点
        context.rotate((Math.PI / 180) * deg); //旋转角度
        context.translate(-x, -y); //将画布原点移动
        callback();
        //类似过程返回正常角度
        context.translate(x, y);
        context.rotate((Math.PI / 180) * -deg);
        context.translate(-x, -x);
    }

    function selectStyle(curr, context) {
        switch (curr.style) {
            case "line":
                drawLine(curr, context);
                break;
            case "rect":
                drawRect(curr, 2, context);
                break;
            case "circle":
                drawCircle(curr, 2, context);
                break;
            case "strokerect":
                drawRect(curr, 0, context);
                break;
            case "strokecircle":
                drawCircle(curr, 0, context);
                break;
            case "fillrect":
                drawRect(curr, 1, context);
                break;
            case "fillcircle":
                drawCircle(curr, 1, context);
                break;
            case "fillrectimg":
                drawImage(curr, context);
                break;
        }
    }

    function reDrawAll() {
        ctx.clearRect(0, 0, winWidth, winHeight);
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255,255,255,1)';
        ctx.fillRect(0, 0, winWidth, winHeight);
        if (arrs.length > 0) {
            for (var i = 0; i < arrs.length; i++) {
                selectStyle(arrs[i], ctx);
            }
        }
    }

    function reDrawCurr(context, curr) {
        if (curr.trace && curr.trace.length > 1) {
            selectStyle(curr, context);
        }
    }

    var render = new FileReader();
    fileimg.onchange = function() {
        var file = this;
        file = this.files[0];
        if (file.size < 1024 * 1024 * 2) {
            render.readAsDataURL(file);
            render.onload = function() {
                base64 = this.result;
                img.src = base64;
            }
        } else {
            alert("图片不能大于2MB");
        }
    }

    on([canvasmask], 'touchstart mousedown', function(e) {
        hide([controlDiv]);
        var curr = e.changedTouches ? e.changedTouches[0] : e;
        var obj = {
            x: curr.pageX,
            y: curr.pageY
        }
        currObj = {
            style: style,
            lineWidth: lineWidth,
            strokeColor: strokeColor,
            fillColor: fillColor,
            rotateDeg: rotateDeg,
            trace: []
        }
        if (style === "fillrectimg") {
            if (base64) {
                var image = new Image();
                image.src = base64;
                currObj.imgWidth = 0;
                currObj.imgHeight = 0;
                image.onload = function() {
                    currObj.imgWidth = image.naturalWidth;
                    currObj.imgHeight = image.naturalHeight;
                    currObj.imageSource = image;
                    currObj.trace[0] = obj;
                    start = true;
                }
            }
        } else {
            currObj.trace.push(obj);
            start = true;
        }
    });
    on([canvasmask], 'touchmove mousemove', function(e) {
        if (start) {
            var curr = e.changedTouches ? e.changedTouches[0] : e;
            var obj = {
                x: curr.pageX,
                y: curr.pageY
            }
            if (currObj.style == "line") {
                var prevobj = currObj.trace[currObj.trace.length - 1];
                if (Math.abs(obj.x - prevobj.x) + Math.abs(obj.y - prevobj.y) > 0.3 * lineWidth) {
                    currObj.trace.push(obj);
                }
            } else {
                currObj.trace[1] = obj;
            }
            maskctx.clearRect(0, 0, winWidth, winHeight);
            reDrawCurr(maskctx, currObj);
        }
    });
    on([canvasmask], 'touchend touchcancel mouseup mouseleave', function(e) {
        if (start) {
            arrs.push(currObj);
            reDrawCurr(ctx, currObj);
            currObj = {};
            maskctx.beginPath();
            maskctx.clearRect(0, 0, winWidth, winHeight);
            start = false;
        }
    });

    on([clear], "touchstart mousedown", function() {
        currObj = {};
        arrs = [];
        redoArr = [];
        ctx.clearRect(0, 0, winWidth, winHeight);
        ctx.beginPath();
    });
    on([undo], "touchstart mousedown", function() {
        if (arrs.length > 0) {
            var obj = arrs.pop();
            obj.pos = arrs.length;
            redoArr.push(obj);
            ctx.clearRect(0, 0, winWidth, winHeight);
            reDrawAll();
        }
    });
    on([redo], "touchstart mousedown", function() {
        if (redoArr.length > 0) {
            var obj;
            for (var i = redoArr.length - 1; i > -1; i--) {
                if (redoArr[i].pos == arrs.length) {
                    obj = redoArr.pop();
                    break;
                } else {
                    redoArr.pop();
                }
            }
            if (obj) {
                arrs.push(obj);
                reDrawCurr(ctx, arrs[arrs.length - 1]);
            }
        }
    })

    on([scSelect], 'touchstart mousedown', function(e) {
        show([controlDiv]);
        show(rgbaRangeCon);
        hide(widthRangeCon);
        hide(rotateRangeCon);
        initColor(strokeColorArr);
        colorControl = 1;
    });
    on([fcSelect], 'touchstart mousedown', function(e) {
        show([controlDiv]);
        show(rgbaRangeCon);
        hide(widthRangeCon);
        hide(rotateRangeCon);
        initColor(fillColorArr);
        colorControl = 2;
    });
    on([widthSelect], 'touchstart mousedown', function() {
        hide(rgbaRangeCon);
        hide(rotateRangeCon);
        show([controlDiv]);
        show(widthRangeCon);
    });
    on([rotateSelect], 'touchstart mousedown', function() {
        hide(rgbaRangeCon);
        hide(widthRangeCon);
        show([controlDiv]);
        show(rotateRangeCon)
    });
    on([redRange, greenRange, blueRange, opacityRange], 'change', function(e) {
        var _this = e.target;
        setColor([redRange.value, greenRange.value, blueRange.value, opacityRange.value]);
        _this.previousElementSibling.innerText = _this.value;
    });
    on([widthRange], 'change', function(e) {
        var _this = e.target;
        setWidth(_this.value);
        _this.previousElementSibling.innerText = _this.value;
    });
    on([rotateRange], 'change', function(e) {
        var _this = e.target;
        setRotate(_this.value);
        _this.previousElementSibling.innerText = _this.value;
    });
    on([resetRotate], 'touchstart mousedown', function(e) {
        setRotate(0);
        rotateRange.value = 0;
        $(".rotatelabel span")[0].innerText = 0;
    });
    on([styleSelecter], 'change', function(e) {
        var _this = e.target;
        style = _this.value;
    });
})()