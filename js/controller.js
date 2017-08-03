/**
 * 获得模板变量参数
 * @param pile
 * @returns {{name: *, chargingProgress: string, currentPrice: string}|*}
 */
function getTemplateVars(pile) {
    vars = {
        name:pile.pileName,
        chargingProgress:pile.chargingProgress+"%",
        currentPrice:"￥"+pile.currentPrice.toFixed(2)+"/kWh"
    };

    switch (pile.runStatus){
        case 1:
            vars['runStatus']   = "空闲";
            vars['statusClass'] = "label-success";
            break;
        case 3:
            vars['runStatus']  = "充电中";
            vars['statusClass'] = "label-danger";
            break;
        case 4:
            vars['runStatus']   = "离线";
            vars['statusClass'] = "label-default";
            break;
        case 8:
            vars['runStatus']   = "占用";
            vars['statusClass'] = "label-warning";
            break;
        default:
            vars['runStatus']   = "不可用["+pile.runStatus+"]";
            vars['statusClass'] = "label-default";
    }

    return vars;
}

document.addEventListener('DOMContentLoaded', function () {
    $('#stage').html('');
    var allPile =  JSON.parse(localStorage.allPile);
    for(var key in allPile){
        var vars = getTemplateVars(allPile[key]);
        var pile_info_html = _.template($('#pile_info').html())(vars);
        $('#stage').append(pile_info_html);
    }
});