wangda_chinamobile_com();
function wangda_chinamobile_com(){
    var IntervalUnit = 5000;
    var totalIntervalMs = 0;
    var btn = null;
    var checkInterval = setInterval(function(){
        try {
            btn = document.getElementsByClassName("vjs-play-control vjs-control vjs-button vjs-paused")[0];
        }catch (error) {
            btn = null;
        };

        if (btn != null || btn != undefined){
            btn.click();
        };

        totalIntervalMs += IntervalUnit;

        if(totalIntervalMs >= 84600000){ // 超过1天，清理24 × 3600 = 86400秒
            clearInterval(checkInterval);
        }

    }, IntervalUnit);
};
