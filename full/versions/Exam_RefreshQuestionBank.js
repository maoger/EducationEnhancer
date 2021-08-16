// Exam_RefreshQuestionBank();

function Exam_RefreshQuestionBank(){

    var local_answers_str = localStorage.QuestionBank;
    var local_answers_json = {};
    var local_answers_json_judge = {};
    var local_answers_json_single = {};

    if(local_answers_str != undefined){
        local_answers_json = JSON.parse(local_answers_str);
    }
    else {
        local_answers_json["判断题"] = {};
        local_answers_json["单选题"] = {};
    }

    local_answers_json_judge = local_answers_json["判断题"];
    local_answers_json_single = local_answers_json["单选题"];

    var current_judge_dict = {};
    var current_judge_question = '';
    var current_judge_answer = '';
    var judge_mapping_table = {"A":"对","B":"错"};

    var i=0;

    if (o_judge != null){
        for (i=1; i<o_judge.length; i++) {
            current_judge_dict = o_judge[i];
            current_judge_question = current_judge_dict["t"];
            current_judge_answer = judge_mapping_table[current_judge_dict["a"]];

            if(!(current_judge_question in local_answers_json_judge)){
                local_answers_json_judge[current_judge_question] = current_judge_answer;
            }

        }
    }
    // local_answers_json;

    var single_mapping_table = {"A":0,"B":1,"C":2,"D":3,"E":4,"F":5};

    if (o_single != null){
        for (i=1; i<o_single.length; i++) {
            current_judge_dict = o_single[i];
            current_judge_question = current_judge_dict["t"];
            current_judge_answer = current_judge_dict["o"][single_mapping_table[current_judge_dict["a"]]];

            if(!(current_judge_question in local_answers_json_single)){
                local_answers_json_single[current_judge_question] = current_judge_answer;
            }

        }
    }
    // local_answers_json;

    // local_answers_str = JSON.stringify(local_answers_json);
    // localStorage.QuestionBank = local_answers_str;
};