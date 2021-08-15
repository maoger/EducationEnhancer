// ==UserScript==
// @name         EducationEnhancer
// @icon         http://ce.esnai.net/favicon.ico
// @homepage     https://github.com/maoger/EducationEnhancer
// @version      0.1.6
// @description  继续教育助手
// @author       Maoger
// @match        http*://*.esnai.net/*
// @grant        none
// @run-at       document-idle
// @updateURL    https://openuserjs.org/meta/maoger/EducationEnhancer.meta.js
// @copyright    2021-2021, maoger (https://openuserjs.org/users/maoger)
// @license      MIT
// ==/UserScript==

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
        if (download_element != null) {
            var tag_body = document.querySelector("body");
            var btn_download = document.createElement("div");
            tag_body.appendChild(btn_download);
            btn_download.innerHTML = "下载";
            btn_download.style = "position:fixed;bottom:40%;left:15px;width:60px;height:60px;background:black;opacity:0.75;color:white;text-align:center;line-height:60px;cursor:pointer;";
            btn_download.onclick = function(){
                this.style.display = "none";
                download_ppt();
            };
        }
    },100)
}
function download_ppt(){
    var download_elements = document.querySelectorAll('#coursedocswindow > table > tbody > tr');
    var download_element = null;
    var download_url = '';
    var file_split = [];
    var download_file_extension = '';
    var download_name_sub = '';
    var download_name_pre = document.querySelector('body > div.panel.layout-panel.layout-panel-north > div > table:nth-child(2) > tbody > tr > td:nth-child(1) > span').innerHTML;
    var download_file_fullname = '';
    for (var i=1; i<download_elements.length; i++) {
        download_element = download_elements[i];
        download_url = download_element.querySelector('td:nth-child(4) > a').href;
        file_split = download_url.split(".");
        download_file_extension = file_split[file_split.length - 1];
        download_name_sub = download_element.querySelector('td:nth-child(1)').innerText;
        if (download_name_sub == '课程讲义'){
            download_file_fullname = download_name_pre + '.' + download_file_extension;
        }
        else {
            download_file_fullname = download_name_pre + '_' + download_name_sub + '.' + download_file_extension;
        }
        download(download_url, download_file_fullname)
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