var location_href = window.location.href;

if (location_href.indexOf('/c/cpa') >= 0){
    setTimeout(function(){
        var show_more_button = document.querySelector('button.zk-btn');
        if(show_more_button != null && show_more_button.innerText == '展开更多') {
            show_more_button.click();
        }
    }, 1000)
}

if (location_href.indexOf('/showflashvideo') >= 0 ){
    setTimeout(function(){
        setInterval(replay(), 50000);
        showDonloadButton();
    }, 1000)
}

function replay(){
    clearInterval(tc);
    player.HTML5.play();
    s2j_onVideoPlay();
};

function showDonloadButton(){
    document.querySelector('#rightfunctions > table:nth-child(4) > tbody > tr:nth-child(2) > td:nth-child(1) > a').click();

    setTimeout(function(){
        document.querySelector('body > div:nth-child(14) > div.panel-header.panel-header-noborder.window-header > div.panel-tool > a').click();
    },100)

    setTimeout(function(){
        var download_element = document.querySelector('#coursedocswindow > table > tbody > tr:nth-child(2) > td:nth-child(4) > a');
        if (download_element != null || o_judge != undefined || o_single != undefined) {
            var tag_body = document.querySelector("body");
            var btn_download = document.createElement("div");
            tag_body.appendChild(btn_download);
            btn_download.innerText = "下载";
            btn_download.style = "position:fixed;bottom:40%;left:15px;width:60px;height:60px;background:black;opacity:0.75;color:white;text-align:center;line-height:60px;cursor:pointer;";

            btn_download.onclick = function(){
                this.style.display = "none";
                download_ppt();
                DownloadQuestionBank();
            };
        }
    },100)
}

function download_ppt(){
    var download_elements = document.querySelectorAll('#coursedocswindow > table > tbody > tr');
    var download_element = null;
    var download_url_element = null;
    var download_url = '';
    var file_split = [];
    var download_file_extension = '';
    // var download_name = '';
    var download_name_sub = '';
    var download_name_pre = document.querySelector('body > div.panel.layout-panel.layout-panel-north > div > table:nth-child(2) > tbody > tr > td:nth-child(1) > span').innerText;
    var download_file_fullname = '';
    for (var i=1; i<download_elements.length; i++) {
        download_element = download_elements[i];
        download_url_element = download_element.querySelector('td:nth-child(4) > a');

        if (download_url_element != null) {
            download_url = download_url_element.href;
            file_split = download_url.split(".");
            download_file_extension = file_split[file_split.length - 1];

            download_name_sub = download_element.querySelector('td:nth-child(1)').innerText;

            if (download_name_sub == '课程讲义' || download_name_sub == download_name_pre){
                download_file_fullname = download_name_pre + '.' + download_file_extension;
            }
            else {
                download_file_fullname = download_name_pre + '_' + download_name_sub + '.' + download_file_extension;
            }

            download(download_url, download_file_fullname)
        }
        
    }

}

function getBlob(url) {
    return new Promise(resolve => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(xhr.response);
            };
        };
        xhr.send();
    });
};

function saveAs(blob, filename) {
    if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename);
    }
    else {
        const link = document.createElement('a');
        const body = document.querySelector('body');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        link.style.display = 'none';
        body.appendChild(link);
        link.click();
        body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
    }
};

function download(url, filename) {
    getBlob(url).then(blob => {
        saveAs(blob, filename);
    })
};



function DownloadQuestionBank(){

    var question_bank = '类型,题目,答案';

    var question_dict = {};
    var question_info = '';
    var answer = '';

    var i=0;

    // 判断题
    var judge_mapping_table = {"A":"对","B":"错"};
    if (o_judge != null){
        for (i=0; i<o_judge.length; i++) {
            question_dict = o_judge[i];
            question_info = question_dict["t"];
            answer = judge_mapping_table[question_dict["a"]];
            question_bank = question_bank + '\r\n判断题,' + question_info + ',' + answer;
        }
    }

    // 单选题
    var single_mapping_table = {"A":0,"B":1,"C":2,"D":3,"E":4,"F":5};
    if (o_single != null){
        for (i=0; i<o_single.length; i++) {
            question_dict = o_single[i];
            question_info = question_dict["t"];
            answer = question_dict["o"][single_mapping_table[question_dict["a"]]];
            question_bank = question_bank + '\r\n单选题,' + question_info + ',' + answer;

        }
    }
    
    // 导出csv
    if (question_bank.length >= 10 ){
        var download_name_pre = document.querySelector('body > div.panel.layout-panel.layout-panel-north > div > table:nth-child(2) > tbody > tr > td:nth-child(1) > span').innerText;
        var filename = download_name_pre + '_部分题库';
        convertDataToCsv(question_bank, filename);

    }
    
};

// 下载
function convertDataToCsv(data,filename){
    data = "\ufeff" + data;
    let blob = new Blob([data], { type: 'text/csv,charset=UTF-8'});
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.download = filename + ".csv";
    a.href = url;
    a.click();

};