/**
 * 获得模板变量参数
 * @param pile
 * @returns {{name: *, chargingProgress: string, currentPrice: string}|*}
 */
function getTemplateVars(pile) {
    vars = {
        id:pile.pileId,
        name:pile.pileName,
        chargingProgress:pile.chargingProgress+"%",
        currentPrice:"￥"+pile.currentPrice.toFixed(2)+"/kWh"
    };

    switch (pile.runStatus){
        case 1:
            vars['runStatus']   = "空闲";
            vars['statusClass'] = "label-success";
            break;
        case 2:
            vars['runStatus']  = "准备充电";
            vars['statusClass'] = "label-danger";
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
            vars['runStatus']   = "充满";
            vars['statusClass'] = "label-warning";
            break;
        default:
            vars['runStatus']   = "不可用["+pile.runStatus+"]";
            vars['statusClass'] = "label-default";
    }

    return vars;
}

/**
 * 生成线性图表
 * @param vars.id
 */
function makeChart(pileId) {
    var line =  JSON.parse(localStorage.line);
    if(line[pileId]){
        $('#'+pileId).show();
        var x         = _.pluck(line[pileId], 'x');
        var y         = _.pluck(line[pileId], 'y');
        var label     = ['坏','闲', '占', '充'];
        var lineChart = echarts.init($('#'+pileId)[0]);
        lineChart.setOption({
            grid: {
                top: '12%',
                left: '0%',
                right: '2%',
                bottom: '0%',
                containLabel: true
            },

            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: x
            },
            yAxis: {
                type: 'category',
                boundaryGap: false,
                data: label
            },
            series: [{
                type: 'line',
                stack: '使用率',
                data: y,
                lineStyle:{
                    normal:{
                        color:"#0C9816"
                    }
                },
                itemStyle:{
                    normal:{
                        color:"#0C9816"
                    }
                }
            }],
            tooltip:{
                trigger:'axis',
                formatter:function(params){
                    return params[0].marker + params[0].name + ":" + label[params[0].value];
                }
            }
        });
    }else{
        $('#'+pileId).hide();
    }
}


document.addEventListener('DOMContentLoaded', function () {
    $('#stage').html('');
    var allPile =  JSON.parse(localStorage.allPile);
    for(var key in allPile){

        //渲染模板
        var vars = getTemplateVars(allPile[key]);
        var pile_info_html = _.template($('#pile_info').html())(vars);
        $('#stage').append(pile_info_html);
        //生成图表
        makeChart(vars.id);
    }
});