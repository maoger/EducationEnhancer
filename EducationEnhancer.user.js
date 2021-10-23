// ==UserScript==
// @name         EducationEnhancer
// @icon         http://ce.esnai.net/favicon.ico
// @homepage     https://github.com/maoger/EducationEnhancer
// @version      0.2.0
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
            esnai_AutoPlay();
            esnai_DownloadButton();
        }, 1000)
    }
}
if (location_href.indexOf('wangda.chinamobile.com') >= 0){
    if (location_href.indexOf('/study/') >= 0){
        setTimeout(function(){
            wangda_Learn();
        }, 1000)
    }
    if (location_href.indexOf('/exam/') >= 0){
        setTimeout(function(){
            wangda_DonloadButton();
        }, 1000)
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
function convertDataToCsv(data,filename){
    data = "\ufeff" + data;
    let blob = new Blob([data], { type: 'text/csv,charset=UTF-8'});
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.download = filename + ".csv";
    a.href = url;
    a.click();
}
function replaceAllNonStandardCharacters(data){
    data = data.split(",").join("，");
    data = data.split("\r\n").join("");
    data = data.split("\r").join("");
    data = data.split("\n").join("");
    data = data.replace(/&nbsp;/g,' ');
    data = data.replace(/&middot;/g,'·');
    return data;
}
function esnai_HomepageShowDetail(){
    var show_more_button = document.querySelector('button.zk-w_button');
    if(show_more_button != null && show_more_button.innerText == '展开更多') {
        show_more_button.click();
    }
}
function esnai_AutoPlay(){
    setInterval(
        esnai_ReplayOnce()
    , 50000);
}
function esnai_ReplayOnce(){
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
        var e_download_element = document.querySelector('#coursedocswindow > table > tbody > tr:nth-child(2) > td:nth-child(4) > a');
        if (e_download_element != null || o_judge != undefined || o_single != undefined) {
            var tag_body = document.querySelector("body");
            var btn_download = document.createElement("div");
            tag_body.appendChild(btn_download);
            btn_download.innerText = "下载";
            btn_download.style = "position:fixed;bottom:40%;left:15px;width:60px;height:60px;background:black;opacity:0.75;color:white;text-align:center;line-height:60px;cursor:pointer;";
            btn_download.onclick = function(){
                this.style.display = "none";
                esnai_DownloadPPT();
                esnai_DownloadQuestionBank();
            }
        }
    },100)
}
function esnai_DownloadPPT(){
    var e_download_elements = document.querySelectorAll('#coursedocswindow > table > tbody > tr');
    var e_download_element = null;
    var e_download_url_element = null;
    var e_download_url = '';
    var e_file_split_to_list = [];
    var e_download_file_extension = '';
    var e_filename_sub = '';
    var e_filename_pre = document.querySelector('body > div.panel.layout-panel.layout-panel-north > div > table:nth-child(2) > tbody > tr > td:nth-child(1) > span').innerText;
    var e_filename_final = '';
    for (var i=1; i<e_download_elements.length; i++) {
        e_download_element = e_download_elements[i];
        e_download_url_element = e_download_element.querySelector('td:nth-child(4) > a');
        if (e_download_url_element != null) {
            e_download_url = e_download_url_element.href;
            e_file_split_to_list = e_download_url.split(".");
            e_download_file_extension = e_file_split_to_list[e_file_split_to_list.length - 1];
            e_filename_sub = e_download_element.querySelector('td:nth-child(1)').innerText;
            if (e_filename_sub == e_filename_pre){
                e_filename_final = e_filename_pre + '.' + e_download_file_extension;
            }
            else {
                e_filename_final = e_filename_pre + '_' + e_filename_sub + '.' + e_download_file_extension;
            }
            download(e_download_url, e_filename_final)
        }
    }
}
function esnai_DownloadQuestionBank(){
    var e_question_bank_string = '类型,题目,答案';
    var e_question_dict = {};
    var e_question_info = '';
    var e_answer_info = '';
    var i=0;
    var e_judge_mapping_table = {"A":"对","B":"错"};
    if (o_judge != null){
        for (i=0; i<o_judge.length; i++) {
            e_question_dict = o_judge[i];
            e_question_info = e_question_dict["t"];
            e_answer_info = e_judge_mapping_table[e_question_dict["a"]];
            e_question_info = replaceAllNonStandardCharacters(e_question_info)
            e_answer_info = replaceAllNonStandardCharacters(e_answer_info)
            e_question_bank_string = e_question_bank_string + '\r\n判断题,' + e_question_info + ',' + e_answer_info;
        }
    }
    var e_single_mapping_table = {"A":0,"B":1,"C":2,"D":3,"E":4,"F":5};
    if (o_single != null){
        for (i=0; i<o_single.length; i++) {
            e_question_dict = o_single[i];
            e_question_info = e_question_dict["t"];
            e_answer_info = e_question_dict["o"][e_single_mapping_table[e_question_dict["a"]]];
            e_question_info = replaceAllNonStandardCharacters(e_question_info)
            e_answer_info = replaceAllNonStandardCharacters(e_answer_info)
            e_question_bank_string = e_question_bank_string + '\r\n单选题,' + e_question_info + ',' + e_answer_info;
        }
    }
    if (e_question_bank_string.length >= 10 ){
        var e_download_filename = document.querySelector('body > div.panel.layout-panel.layout-panel-north > div > table:nth-child(2) > tbody > tr > td:nth-child(1) > span').innerText;
        e_download_filename = e_download_filename + '_题库';
        convertDataToCsv(e_question_bank_string, e_download_filename);
    }
}
function wangda_Learn(){
    var w_IntervalUnit = 5000;
    var w_totalIntervalMs = 0;
    var w_button = null;
    var checkInterval = setInterval(function(){
        try {
            w_button = document.getElementsByClassName("vjs-play-control vjs-control vjs-button vjs-paused")[0];
        }catch (error) {
            w_button = null;
        }
        if (w_button != null || w_button != undefined){
            w_button.click();
        }
        w_totalIntervalMs += w_IntervalUnit;
        if(w_totalIntervalMs >= 84600000){
            clearInterval(checkInterval);
        }
    }, w_IntervalUnit);
}
function wangda_Exam(){
    var examId = window.location.href.split('/').pop();
    var w_question_bank_string = '题目,答案';
    try {
        $.get('https://wangda.chinamobile.com/api/v1/exam/exam/front/exam-paper?examId=' + examId, JSON.parse(localStorage.token), function (result) {
            var w_filename = result.name + '_题库';
            w_filename = w_filename.split('"').join("");
            w_filename = w_filename.split("'").join("");
            w_filename = replaceAllNonStandardCharacters(w_filename);
            $.get('https://wangda.chinamobile.com/api/v1/exam/exam/front/score-detail?examRecordId=' + result.examRecord.id + '&examId=' + examId + '&_=' + Date.parse(new Date()), JSON.parse(localStorage.token), function (obj) {
                var questions = obj.paper.questions;
                var w_question_bank_list = [];
                for (var i = 0; i < questions.length; i++) {
                    var _obj = {};
                    _obj.content = questions[i].content;
                    _obj.questionAttrCopys = [];
                    for (var j = 0; j < questions[i].questionAttrCopys.length; j++) {
                        if (questions[i].questionAttrCopys[j].type == "0") {
                            if (questions[i].questionAttrCopys[j].name == "3") { _obj.questionAttrCopys.push("A:" + questions[i].questionAttrCopys[j].value); }
                            if (questions[i].questionAttrCopys[j].name == "2") { _obj.questionAttrCopys.push("B:" + questions[i].questionAttrCopys[j].value); }
                            if (questions[i].questionAttrCopys[j].name == "1") { _obj.questionAttrCopys.push("C:" + questions[i].questionAttrCopys[j].value); }
                            if (questions[i].questionAttrCopys[j].name == "0") { _obj.questionAttrCopys.push("D:" + questions[i].questionAttrCopys[j].value); }
                        }
                        if (_obj.questionAttrCopys.length == 0 && questions[i].questionAttrCopys[j].value == "0") { _obj.questionAttrCopys.push("错误"); }
                        if (_obj.questionAttrCopys.length == 0 && questions[i].questionAttrCopys[j].value == "1") { _obj.questionAttrCopys.push("正确"); }
                    }
                    w_question_bank_list.push(_obj);
                }
                var w_per_question_bank_dict;
                var w_per_question_info = '';
                var w_per_answer_info = '';
                for (var k = 0; k < w_question_bank_list.length; k++) {
                    w_per_question_bank_dict = w_question_bank_list[k];
                    w_per_question_info = w_per_question_bank_dict.content;
                    w_per_question_info = replaceAllNonStandardCharacters(w_per_question_info);
                    w_per_answer_info = w_per_question_bank_dict.questionAttrCopys.join('; ');
                    w_per_answer_info = replaceAllNonStandardCharacters(w_per_answer_info);
                    w_question_bank_string = w_question_bank_string + '\r\n' + w_per_question_info + ',' + w_per_answer_info;
                }
                convertDataToCsv(w_question_bank_string, w_filename);
            })
        })
    }catch (error) {
        w_question_bank_string = '';
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
            wangda_Exam();
        }
    },100)
}
