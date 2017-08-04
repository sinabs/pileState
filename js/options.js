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
}

$(function () {
    //初始化标签变量
    options.isActivated.checked = JSON.parse(localStorage.isActivated);
    options.isPushPhone.checked = JSON.parse(localStorage.isPushPhone);
    options.frequency.value = localStorage.frequency;
    options.startHour.value = localStorage.startHour;
    options.endHour.value   = localStorage.endHour;

    if(localStorage.week){
        var weekRange = localStorage.week.split(',')
        for(var i in weekRange){
            $('#week option[value='+weekRange[i]+']').prop('selected',true);
        }
    }

    if (!options.isActivated.checked) {
        ghost(true);
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

    $('#week,#frequency').multiselect();


});
