
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