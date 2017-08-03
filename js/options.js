/**
 * 切换标签可用性
 * @param isDeactivated
 */
function ghost(isDeactivated) {
  options.style.color = isDeactivated ? 'graytext' : 'black';
  options.frequency.disabled = isDeactivated;
  options.isPushPhone.disabled = isDeactivated;
}

window.addEventListener('load', function() {
  //初始化标签变量
  options.isActivated.checked = JSON.parse(localStorage.isActivated);
  options.isPushPhone.checked = JSON.parse(localStorage.isPushPhone);
  options.frequency.value = localStorage.frequency;

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
    };
});
