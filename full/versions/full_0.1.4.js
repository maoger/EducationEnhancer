var location_href = window.location.href;

if (location_href.indexOf('/c/cpa') >= 0){
    var show_more_button = document.querySelector('button.zk-btn');
    if(show_more_button != null) {
        setTimeout(function(){
            document.querySelector('button.zk-btn').click();
        },1000)
    }
}

if (location_href.indexOf('/showflashvideo') >= 0 ){
    setInterval(replay(), 50000);
    showDonloadButton();
}

if (window.location.href.indexOf('/showflashvideo') >= 0 ){
    setInterval(replay(), 50000);
    showDonloadButton();
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
    var download_url = document.querySelector('#coursedocswindow > table > tbody > tr:nth-child(2) > td:nth-child(4) > a').href;
    var file_split = download_url.split(".");
    var download_file_extension = file_split[file_split.length - 1];

    var download_name = document.querySelector('body > div.panel.layout-panel.layout-panel-north > div > table:nth-child(2) > tbody > tr > td:nth-child(1) > span').innerHTML;
    var download_file_fullname = download_name + '.' + download_file_extension;

    download(download_url, download_file_fullname)

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