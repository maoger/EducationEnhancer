// ==UserScript==
// @name         EducationEnhancer
// @icon         http://ce.esnai.net/favicon.ico
// @homepage     https://github.com/maoger/EducationEnhancer
// @version      0.1.17
// @description  网课学习助手
// @author       Maoger
// @match        http*://*.esnai.net/*
// @match        http*://wangda.chinamobile.com/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        none
// @run-at       document-idle
// @updateURL    https://openuserjs.org/meta/maoger/EducationEnhancer.meta.js
// @copyright    2021-2021, maoger (https://openuserjs.org/users/maoger)
// @license      MIT
// ==/UserScript==

var location_href = window.location.href;
if (location_href.indexOf('esnai.net') >= 0){
    if (location_href.indexOf('/c/cpa') >= 0){
        setTimeout(function(){
            esnai_HomepageShowDetail();
        }, 1000)
    }
    if (location_href.indexOf('/showflashvideo') >= 0 ){
        setTimeout(function(){
            esnai_auto_replay();
            esnai_DownloadButton();
        }, 1000)
    }
}
if (location_href.indexOf('wangda.chinamobile.com') >= 0){
    if (location_href.indexOf('/study/') >= 0){
        setTimeout(function(){
            wangda_learn();
        }, 1000)
    }
    if (location_href.indexOf('/exam/') >= 0){
        setTimeout(function(){
            wangda_DonloadButton();
        }, 1000)
    }
}
function esnai_HomepageShowDetail(){
    var show_more_button = document.querySelector('button.zk-btn');
    if(show_more_button != null && show_more_button.innerText == '展开更多') {
        show_more_button.click();
    }
}
function esnai_auto_replay(){
    setInterval(
        esnai_replay_once()
    , 50000);
}
function esnai_replay_once(){
    clearInterval(tc);
    player.HTML5.play();
    s2j_onVideoPlay();
}
function esnai_DownloadButton(){
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
            }
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
    var filename_sub = '';
    var filename_pre = document.querySelector('body > div.panel.layout-panel.layout-panel-north > div > table:nth-child(2) > tbody > tr > td:nth-child(1) > span').innerText;
    var filename_final = '';
    for (var i=1; i<download_elements.length; i++) {
        download_element = download_elements[i];
        download_url_element = download_element.querySelector('td:nth-child(4) > a');
        if (download_url_element != null) {
            download_url = download_url_element.href;
            file_split = download_url.split(".");
            download_file_extension = file_split[file_split.length - 1];
            filename_sub = download_element.querySelector('td:nth-child(1)').innerText;
            if (filename_sub == filename_pre){
                filename_final = filename_pre + '.' + download_file_extension;
            }
            else {
                filename_final = filename_pre + '_' + filename_sub + '.' + download_file_extension;
            }
            download(download_url, filename_final)
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
            }
        }
        xhr.send();
    });
}
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
}
function download(url, filename) {
    getBlob(url).then(blob => {
        saveAs(blob, filename);
    })
}
function DownloadQuestionBank(){
    var question_bank = '类型,题目,答案';
    var question_dict = {};
    var question_info = '';
    var answer = '';
    var i=0;
    var judge_mapping_table = {"A":"对","B":"错"};
    if (o_judge != null){
        for (i=0; i<o_judge.length; i++) {
            question_dict = o_judge[i];
            question_info = question_dict["t"];
            answer = judge_mapping_table[question_dict["a"]];
            question_info = question_info.split(",").join("，");
            question_info = question_info.split("\r\n").join("");
            question_info = question_info.split("\r").join("");
            question_info = question_info.split("\n").join("");
            answer = answer.split(",").join("，");
            answer = answer.split("\r\n").join("");
            answer = answer.split("\r").join("");
            answer = answer.split("\n").join("");
            question_bank = question_bank + '\r\n判断题,' + question_info + ',' + answer;
        }
    }
    var single_mapping_table = {"A":0,"B":1,"C":2,"D":3,"E":4,"F":5};
    if (o_single != null){
        for (i=0; i<o_single.length; i++) {
            question_dict = o_single[i];
            question_info = question_dict["t"];
            answer = question_dict["o"][single_mapping_table[question_dict["a"]]];
            question_info = question_info.split(",").join("，");
            question_info = question_info.split("\r\n").join("");
            question_info = question_info.split("\r").join("");
            question_info = question_info.split("\n").join("");
            answer = answer.split(",").join("，");
            answer = answer.split("\r\n").join("");
            answer = answer.split("\r").join("");
            answer = answer.split("\n").join("");
            question_bank = question_bank + '\r\n单选题,' + question_info + ',' + answer;
        }
    }
    question_bank = question_bank.replace(/&nbsp;/g,'');
    question_bank = question_bank.replace(/&middot;/g,'·');
    if (question_bank.length >= 10 ){
        var download_name_pre = document.querySelector('body > div.panel.layout-panel.layout-panel-north > div > table:nth-child(2) > tbody > tr > td:nth-child(1) > span').innerText;
        var filename = download_name_pre + '_题库';
        convertDataToCsv(question_bank, filename);
    }
}
function convertDataToCsv(data,filename){
    data = "\ufeff" + data;
    let blob = new Blob([data], { type: 'text/csv,charset=UTF-8'});
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.download = filename + ".csv";
    a.href = url;
    a.click();
}
function wangda_learn(){
    var IntervalUnit = 5000;
    var totalIntervalMs = 0;
    var btn = null;
    var checkInterval = setInterval(function(){
        try {
            btn = document.getElementsByClassName("vjs-play-control vjs-control vjs-button vjs-paused")[0];
        }catch (error) {
            btn = null;
        }
        if (btn != null || btn != undefined){
            btn.click();
        }
        totalIntervalMs += IntervalUnit;
        if(totalIntervalMs >= 84600000){
            clearInterval(checkInterval);
        }
    }, IntervalUnit);
}
function wangda_exam(){
    var examId = window.location.href.split('/').pop();
    var myAnswerString = '题目,答案';
    try {
        $.get('https://wangda.chinamobile.com/api/v1/exam/exam/front/exam-paper?examId=' + examId, JSON.parse(localStorage.token), function (result) {
            var myFilename = result.name + '_题库';
            myFilename = myFilename.split('"').join("");
            myFilename = myFilename.split("'").join("");
            myFilename = myFilename.split(",").join("，");
            myFilename = myFilename.split("\r\n").join("");
            myFilename = myFilename.split("\r").join("");
            myFilename = myFilename.split("\n").join("");
            $.get('https://wangda.chinamobile.com/api/v1/exam/exam/front/score-detail?examRecordId=' + result.examRecord.id + '&examId=' + examId + '&_=' + Date.parse(new Date()), JSON.parse(localStorage.token), function (obj) {
                var questions = obj.paper.questions;
                var myAnswerResult = [];
                for (var i = 0; i < questions.length; i++) {
                    var _obj = {};
                    _obj.content = questions[i].content;
                    _obj.questionAttrCopys = [];
                    for (var j = 0; j < questions[i].questionAttrCopys.length; j++) {
                        if (questions[i].questionAttrCopys[j].type == "0") {
                            if (questions[i].questionAttrCopys[j].name == "0") { _obj.questionAttrCopys.push("A:" + questions[i].questionAttrCopys[j].value); }
                            if (questions[i].questionAttrCopys[j].name == "1") { _obj.questionAttrCopys.push("B:" + questions[i].questionAttrCopys[j].value); }
                            if (questions[i].questionAttrCopys[j].name == "2") { _obj.questionAttrCopys.push("C:" + questions[i].questionAttrCopys[j].value); }
                            if (questions[i].questionAttrCopys[j].name == "3") { _obj.questionAttrCopys.push("D:" + questions[i].questionAttrCopys[j].value); }
                        }
                        if (_obj.questionAttrCopys.length == 0 && questions[i].questionAttrCopys[j].value == "0") { _obj.questionAttrCopys.push("错误"); }
                        if (_obj.questionAttrCopys.length == 0 && questions[i].questionAttrCopys[j].value == "1") { _obj.questionAttrCopys.push("正确"); }
                    }
                    myAnswerResult.push(_obj);
                }
                var perAnswerDict;
                var perQuestionInfo = '';
                var perAnswerInfo = '';
                for (var k = 0; k < myAnswerResult.length; k++) {
                    perAnswerDict = myAnswerResult[k];
                    perQuestionInfo = perAnswerDict.content;
                    perQuestionInfo = perQuestionInfo.split(",").join("，");
                    perQuestionInfo = perQuestionInfo.split("\r\n").join("");
                    perQuestionInfo = perQuestionInfo.split("\r").join("");
                    perQuestionInfo = perQuestionInfo.split("\n").join("");
                    perAnswerInfo = perAnswerDict.questionAttrCopys.join('; ');
                    perAnswerInfo = perAnswerInfo.split(",").join("，");
                    perAnswerInfo = perAnswerInfo.split("\r\n").join("");
                    perAnswerInfo = perAnswerInfo.split("\r").join("");
                    perAnswerInfo = perAnswerInfo.split("\n").join("");
                    myAnswerString = myAnswerString + '\r\n' + perQuestionInfo + ',' + perAnswerInfo;
                }
                convertDataToCsv(myAnswerString, myFilename);
            })
        })
    }catch (error) {
        myAnswerString = '';
    }
}
function wangda_DonloadButton(){
    setTimeout(function(){
        var tag_body = document.querySelector("body");
        var btn_download = document.createElement("div");
        tag_body.appendChild(btn_download);
        btn_download.innerText = "下载";
        btn_download.style = "position:fixed;bottom:40%;left:15px;width:60px;height:60px;background:black;opacity:0.75;color:white;text-align:center;line-height:60px;cursor:pointer;";
        btn_download.onclick = function(){
            this.style.display = "none";
            wangda_exam();
        }
    },100)
}
