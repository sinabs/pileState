/**
 * 切换标签可用性
 * @param isDeactivated
 */
function ghost(isDeactivated) {
  options.style.color = isDeactivated ? 'graytext' : 'black';
  options.frequency.disabled = isDeactivated;
  options.isPushPhone.disabled = isDeactivated;
  ghost2(isDeactivated);
}

function ghost2(isDeactivated) {
    $('#pushPhone').css('color',isDeactivated ? 'graytext' : 'black');
    options.week.disabled = isDeactivated;
    options.startHour.disabled = isDeactivated;
    options.endHour.disabled = isDeactivated;
    options.in_name.disabled = isDeactivated;
    options.in_code.disabled = isDeactivated;
    options.in_test.disabled = isDeactivated;
}

function ghost3() {
    if(localStorage.in_name && localStorage.in_code){
        options.in_test.disabled = false;
    }else{
        options.in_test.disabled = true;
    }
}

$(function () {
    //初始化标签变量
    options.isActivated.checked = JSON.parse(localStorage.isActivated);
    options.isPushPhone.checked = JSON.parse(localStorage.isPushPhone);
    options.frequency.value = localStorage.frequency;
    options.startHour.value = localStorage.startHour;
    options.endHour.value   = localStorage.endHour;
    options.in_name.value   = localStorage.in_name;
    options.in_code.value   = localStorage.in_code;

    if(localStorage.week){
        var weekRange = localStorage.week.split(',')
        for(var i in weekRange){
            $('#week option[value='+weekRange[i]+']').prop('selected',true);
        }
    }

    if (!options.isActivated.checked) {
        ghost(true);
    }

    if (!options.isPushPhone.checked) {
        ghost2(true);
    }

    //设置标签事件
    options.isActivated.onchange = function() {
        localStorage.isActivated = options.isActivated.checked;
        ghost(!options.isActivated.checked);
    };

    options.frequency.onchange = function() {
        localStorage.frequency = options.frequency.value;
    };

    options.isPushPhone.onchange = function() {
        localStorage.isPushPhone = options.isPushPhone.checked;
        ghost2(!options.isPushPhone.checked);
    };

    $('#week').change(function () {
        localStorage.week = $(this).val().join(',');
    });

    options.startHour.onkeyup = function () {
        localStorage.startHour = options.startHour.value;
    };

    options.endHour.onkeyup = function () {
        localStorage.endHour = options.endHour.value;
    };

    options.in_name.onkeyup = function () {
        localStorage.in_name = options.in_name.value;
        ghost3();
    };

    options.in_code.onkeyup = function () {
        localStorage.in_code = options.in_code.value;
        ghost3();
    };

    options.in_test.onclick = function () {
        if(localStorage.in_name && localStorage.in_code){
            var time = (new Date()).toLocaleTimeString();
            var msg = time +"\n充电桩状态:[空闲]\n测试推送消息";
            var data = "name="+localStorage.in_name+"&code="+localStorage.in_code+"&msg[text]="+msg;
            options.in_test.disabled = true;
            $.post("https://qpush.me/pusher/push_site/",data,function () {
                options.in_test.disabled = false;
            });
        }
    };


    $('#week,#frequency').multiselect();
    ghost3();

});
