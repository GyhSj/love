var canvas = document.querySelector('canvas');
var button = document.getElementById('button');
var draw = canvas.getContext('2d')?(button.style.display='block',draw=canvas.getContext('2d')):'';
var div = document.getElementById('div');
for (var i = 0; i < button.children.length - 1; i++) {
    button.children[i].disabled = true;
}
var arr = [];
var arr1 = [];
var num = 4;
var music = new Audio('./music/c2.mp3');
var color = {
    0: '#5cb85c',
    2: '#FFCCCC',
    4: '#99CFFF',
    8: '#0099CC',
    16: '#0066CC',
    32: '#FFCC99',
    64: '#FF9999',
    128: '#CCFF66',
    256: '#FFFF00',
    512: '#CCFF99',
    1024: '#CCFF66',
    2048: '#FFCC33'
};
style();
map(num, true);
view(true);

function style() {
    var w = window.innerWidth - 4;
    var w1 = w;
    var h = window.innerHeight;
    if (w > 600) {
        w = 600;
        if (w + 30 >= h) {
            w -= 30
        }
    }
    if (w < 220) {
        w = 220
    }
    div.style.cssText = 'width:' + w + 'px;' + ' height:' + w + 'px;' + ' top:' + ((h - (w + 30)) / 2 + (30 / 2)) + 'px;' + ' left:' + ((w1 / 2) - (w / 2)) + 'px;';
    button.style.cssText = 'width:' + w + 'px;' + ' height:' + 30 + 'px;' + ' top:' + ((h - (w + 30)) / 2 - (30 / 2)) + 'px;' + ' left:' + ((w1 / 2) - (w / 2)) + 'px;';
    canvas.width = w;
    canvas.height = w;
    draw.font = (w / 10) + 'px Arial';
    draw.textAlign = 'center';
    draw.textBaseline = 'middle';
    draw.fillStyle = 'black';
    draw.save();
}

window.onresize = function (ev) {
    style();
    map(num, false);
    view(true);
    view(false, 0, false)
};

function map(num, on) {
    var w = canvas.width / num;
    if (on) {
        for (var i = 0; i < num; i++) {
            arr[i] = [];
            for (var z = 0; z < num; z++) {
                arr[i].push({value: 0, x: z * w, y: i * w, max: 0, min: 0, add: true})
            }
        }
    } else {
        for (i = 0; i < arr.length; i++) {
            for (z = 0; z < arr.length; z++) {
                arr[i][z].x = z * w;
                arr[i][z].y = i * w
            }
        }
    }
}

function back() {
    arr1 = JSON.parse(JSON.stringify(arr))
}

function view(load, h, on) {
    draw.clearRect(0, 0, canvas.width, canvas.height);
    var w = canvas.width / arr.length;
    if (load) {
        for (var i = 0; i < arr.length; i++) {
            for (var z = 0; z < arr.length; z++) {
                draw.fillStyle = '#5cb85c';
                draw.fillRect(arr[i][z].x, arr[i][z].y, w - 4, w - 4)
            }
        }
        var url = canvas.toDataURL();
        var img = document.querySelector('#img');
        img.src = url;
        draw.clearRect(0, 0, canvas.width - 4, canvas.height - 4);
        draw.fillRect(0, 0, canvas.width - 4, canvas.height - 4);
        draw.fillStyle = 'black';
        draw.font = (canvas.width / 25) + 'px Arial';
        draw.fillText('游戏内拖动鼠标进行操作', canvas.width / 2, canvas.height /3);
        draw.font = (canvas.width / 15) + 'px Arial';
        draw.fillText('点击按钮开始游戏', canvas.width / 2, canvas.height / 2);
        draw.restore()
    } else {
        for (i = 0; i < arr.length; i++) {
            for (z = 0; z < arr.length; z++) {
                if (arr[i][z].value > 0) {
                    if (on) {
                        draw.fillStyle = color[arr[i][z].value];
                        draw.fillRect(arr[i][z].x + (h * arr[i][z].min), arr[i][z].y + (h * arr[i][z].max), w - 4, w - 4);
                        draw.fillStyle = 'black';
                        draw.fillText(arr[i][z].value, arr[i][z].x + w / 2 + (h * arr[i][z].min), arr[i][z].y + w / 2 + (h * arr[i][z].max));
                    } else {
                        arr[i][z].add = true;
                        draw.fillStyle = color[arr[i][z].value];
                        draw.fillRect(arr[i][z].x, arr[i][z].y, w - 4, w - 4);
                        draw.fillStyle = 'black';
                        draw.fillText(arr[i][z].value, arr[i][z].x + w / 2, arr[i][z].y + w / 2);
                    }

                }
            }
        }
    }
}

function random() {
    var array = [];
    for (var i = 0; i < arr.length; i++) {
        for (var z = 0; z < arr.length; z++) {
            if (arr[i][z].value === 0) {
                array.push([i, z])
            }
        }
    }
    var x = parseInt(Math.random() * array.length);
    if (Math.random() > 0.49) {
        arr[array[x][0]][array[x][1]].value = 2
    } else {
        arr[array[x][0]][array[x][1]].value = 4
    }
}

function index(off) {
    var n, m;
    switch (off) {
        case 'down':
            for (var i = arr.length - 1; i >= 0; i--) {
                for (var z = arr.length - 1; z >= 0; z--) {
                    if (arr[z][i].value === 0) {
                        n = z;
                        for (var k = z - 1; k >= 0; k--) {
                            if (arr[k][i].value > 0) {
                                m = n;
                                arr[k][i].max = n - k;
                                n--;
                            }
                        }
                        break
                    }
                }
            }
            break;
        case 'right':
            for (i = 0; i < arr.length; i++) {
                for (z = arr.length - 1; z >= 0; z--) {
                    if (arr[i][z].value === 0) {
                        n = z;
                        for (k = z - 1; k >= 0; k--) {
                            if (arr[i][k].value > 0) {
                                m = n;
                                arr[i][k].min = n - k;
                                n--
                            }
                        }
                        break
                    }
                }
            }
            break;
        case 'left':
            for (i = 0; i < arr.length; i++) {
                for (z = 0; z < arr.length; z++) {
                    if (arr[i][z].value === 0) {
                        n = z;
                        for (k = z + 1; k < arr.length; k++) {
                            if (arr[i][k].value > 0) {
                                m = n;
                                arr[i][k].min = n - k;
                                n++
                            }
                        }
                        break
                    }
                }
            }
            break;
        case 'up':
            for (i = 0; i < arr.length; i++) {
                for (z = 0; z < arr.length; z++) {
                    if (arr[z][i].value === 0) {
                        n = z;
                        for (k = z + 1; k < arr.length; k++) {
                            if (arr[k][i].value > 0) {
                                m = n;
                                arr[k][i].max = n - k;
                                n++;
                            }
                        }
                        break
                    }
                }
            }
            break
    }
   return !!m
}

function over() {
    var o = true;
    for (var i = 0; i < arr.length; i++) {
        for (var z = 0; z < arr.length; z++) {
            if (z + 1 < arr.length && arr[i][z].value === arr[i][z + 1].value) {
                o = false;
            }
            if (i + 1 < arr.length && arr[i][z].value === arr[i + 1][z].value) {
                o = false;
            }
            if (arr[i][z].value === 0) {
                o = false
            }
        }
    }
    if (o) {
        alert('游戏结束')
    }
}

var method = {
    on: false,
    data: false,
    'down': function () {
        method.on = false;
        for (var i = arr.length - 1; i >= 0; i--) {
            for (var z = arr.length - 1; z >= 0; z--) {
                if (arr[z][i].max > 0) {
                    arr[z + arr[z][i].max][i].value = arr[z][i].value;
                    arr[z][i].value = 0;
                    arr[z][i].max = 0
                }
            }
        }
        for (i = 0; i < arr.length; i++) {
            for (z = arr.length - 1; z >= 0; z--) {
                if (arr[z][i].value > 0 && arr[z][i].add) {
                    for (var k = z - 1; k >= 0; k--) {
                        if (arr[z][i].value === arr[k][i].value && z - k === 1 && arr[k][i].add) {
                            arr[z][i].value += arr[z][i].value;
                            arr[z][i].add = false;
                            method.on = true;
                            method.data = true;
                            arr[k][i].value = 0;
                            for (var j = k - 1; j >= 0; j--) {
                                if (arr[j][i].value > 0) {
                                    arr[j][i].max = 1
                                }
                            }
                            z = -1;
                            break
                        }
                    }
                }
            }
        }
       return method.on
    },
    'up': function () {
        method.on = false;
        for (var i = 0; i < arr.length; i++) {
            for (var z = 0; z < arr.length; z++) {
                if (arr[z][i].max < 0) {
                    arr[z + arr[z][i].max][i].value = arr[z][i].value;
                    arr[z][i].value = 0;
                    arr[z][i].max = 0
                }
            }
        }
        for (i = arr.length - 1; i >= 0; i--) {
            for (z = 0; z < arr.length; z++) {
                if (arr[z][i].value > 0 && arr[z][i].add) {
                    for (var k = z + 1; k < arr.length; k++) {
                        if (arr[z][i].value === arr[k][i].value && k - z === 1 && arr[k][i].add) {
                            arr[z][i].value += arr[z][i].value;
                            arr[z][i].add = false;
                            method.on = true;
                            method.data = true;
                            arr[k][i].value = 0;
                            for (var j = k + 1; j < arr.length; j++) {
                                if (arr[j][i].value > 0) {
                                    arr[j][i].max = -1
                                }
                            }
                            z = arr.length;
                            break
                        }
                    }
                }
            }
        }
       return method.on
    },
    'left': function () {
        method.on = false;
        for (var i = 0; i < arr.length; i++) {
            for (var z = 0; z < arr.length; z++) {
                if (arr[i][z].min < 0) {
                    arr[i][z + arr[i][z].min].value = arr[i][z].value;
                    arr[i][z].value = 0;
                    arr[i][z].min = 0

                }
            }
        }
        for (i = 0; i < arr.length; i++) {
            for (z = 0; z < arr.length; z++) {
                if (arr[i][z].value > 0 && arr[i][z].add) {
                    for (var k = z + 1; k < arr.length; k++) {
                        if (arr[i][z].value === arr[i][k].value && k - z === 1 && arr[i][k].add) {
                            arr[i][z].value += arr[i][z].value;
                            arr[i][z].add = false;
                            method.on = true;
                            method.data = true;
                            arr[i][k].value = 0;
                            for (var j = k + 1; j < arr.length; j++) {
                                if (arr[i][j].value > 0) {
                                    arr[i][j].min = -1
                                }
                            }
                            z = arr.length;
                            break
                        }
                    }
                }
            }
        }
      return method.on
    },
    'right': function (off) {
        method.on = false;
        for (var i = 0; i < arr.length; i++) {
            for (var z = arr.length - 1; z >= 0; z--) {
                if (arr[i][z].min > 0) {
                    arr[i][z + arr[i][z].min].value = arr[i][z].value;
                    arr[i][z].value = 0;
                    arr[i][z].min = 0

                }
            }
        }
        for (i = 0; i < arr.length; i++) {
            for (z = arr.length - 1; z >= 0; z--) {
                if (arr[i][z].value > 0 && arr[i][z].add) {
                    for (var k = z - 1; k >= 0; k--) {
                        if (arr[i][z].value === arr[i][k].value && z - k === 1 && arr[i][k].add) {
                            arr[i][z].value += arr[i][z].value;
                            arr[i][z].add = false;
                            method.on = true;
                            method.data = true;
                            arr[i][k].value = 0;
                            for (var j = k - 1; j >= 0; j--) {
                                if (arr[i][j].value > 0) {
                                    arr[i][j].min = 1
                                }
                            }
                            z = -1;
                            break
                        }
                    }

                }
            }
        }
       return method.on
    }
};

function move(off, data) {
    var n = 0;
    (function () {
        var time = window.requestAnimationFrame(arguments.callee);
        n += 20;
        view(false, (n / 100) * (canvas.width / num), true);
        if (n === 100) {
            window.cancelAnimationFrame(time);
            if (method[off]()) {
                move(off, data)
            } else {
                view(false, 0, false);
                if (data || method.data) {
                    music.load();
                    music.play();
                    setTimeout(function () {
                        random();
                        view(false, 0, 0, false);
                        over();
                        method.data = false
                    }, 150)
                }
            }
        }
    })()
}

button.onclick = function (ev) {
    if (event.srcElement.value === '回退' && arr1.length > 0) {
        var number = Number(event.srcElement.getAttribute('data-num'));
        if (number > 0) {
            number--;
            arr = arr1;
            view(false, 0, false);
            event.srcElement.setAttribute('data-num', number);
            event.srcElement.innerText = '回退:' + number + '次';
            arr1 = [];
            if (number === 0) {
                event.srcElement.className = 'off';
                event.srcElement.disabled = true
            }
        }
    }
    if (event.srcElement.value === '重新开始') {
        arr = [];
        arr1 = [];
        map(num, true);
        view(true);
        random();
        view(false, 0, false);
        event.srcElement.previousElementSibling.innerText = '回退: 3次';
        event.srcElement.previousElementSibling.setAttribute('data-num', '3');
        event.srcElement.previousElementSibling.setAttribute('class', '');
        event.srcElement.previousElementSibling.disabled = false
    }
    if (event.srcElement.value === '开始游戏') {
        random();
        view(false, 0, false);
        for (i = 0; i < button.children.length; i++) {
            button.children[i].disabled = false;
        }
        event.srcElement.disabled = true;
        if (window.navigator.userAgent.indexOf('Windows') !== -1) {
            div.onmousedown = function (ev) {
                event.preventDefault();
                var x = event.offsetX;
                var y = event.offsetY;
                var on = false;
                var data;
                method.off = true;
                this.onmousemove = function () {
                    event.preventDefault();
                    if (method.off) {
                        var x1 = event.offsetX;
                        var y1 = event.offsetY;
                        if (y - y1 > 20) {
                            if (Math.abs(x - x1) < 15 && !on) {
                                back();
                                data = index('up');
                                move('up', data);
                                on = true
                            }
                        }
                        if (y1 - y > 20) {
                            if (Math.abs(x - x1) < 15 && !on) {
                                back();
                                data = index('down');
                                move('down', data);
                                on = true
                            }
                        }
                        if (x - x1 > 20) {
                            if (Math.abs(y - y1) < 15 && !on) {
                                back();
                                data = index('left');
                                move('left', data);
                                on = true
                            }
                        }
                        if (x1 - x > 20) {
                            if (Math.abs(y - y1) < 15 && !on) {
                                back();
                                data = index('right');
                                move('right', data);
                                on = true
                            }
                        }
                    }
                }
            };
            div.onmouseup = function (ev) {
                event.preventDefault();
                method.off = false;
            }
        } else {
            div.ontouchstart = function (ev) {
                event.preventDefault();
                var x = event.changedTouches[0].clientX - this.offsetLeft;
                var y = event.changedTouches[0].clientY - this.offsetTop;
                var on = false;
                var data;
                method.off = true;
                this.ontouchmove = function () {
                    event.preventDefault();
                    if (method.off) {
                        var x1 = event.changedTouches[0].clientX - this.offsetLeft;
                        var y1 = event.changedTouches[0].clientY - this.offsetTop;
                        if (y - y1 > 20) {
                            if (Math.abs(x - x1) < 15 && !on) {
                                back();
                                data = index('up');
                                move('up', data);
                                on = true
                            }
                        }
                        if (y1 - y > 20) {
                            if (Math.abs(x - x1) < 15 && !on) {
                                back();
                                data = index('down');
                                move('down', data);
                                on = true
                            }
                        }
                        if (x - x1 > 20) {
                            if (Math.abs(y - y1) < 15 && !on) {
                                back();
                                data = index('left');
                                move('left', data);
                                on = true
                            }
                        }
                        if (x1 - x > 20) {
                            if (Math.abs(y - y1) < 15 && !on) {
                                back();
                                data = index('right');
                                move('right', data);
                                on = true
                            }
                        }
                    }
                }
            };
            div.ontouchend = function (ev) {
                event.preventDefault();
                method.off = false;
            }
        }
    }
};
