// ==UserScript==
// @name         EducationEnhancer
// @icon         http://ce.esnai.net/favicon.ico
// @homepage     https://github.com/maoger/EducationEnhancer
// @version      0.2.6
// @description  网课学习助手
// @author       Maoger
// @match        http*://*.esnai.net/*
// @grant        none
// @run-at       document-idle
// @updateURL    https://openuserjs.org/meta/maoger/EducationEnhancer.meta.js
// @downloadURL  https://openuserjs.org/install/maoger/EducationEnhancer.user.js
// @copyright    2021-2022, maoger (https://openuserjs.org/users/maoger)
// @license      MIT
// ==/UserScript==

var location_href = window.location.href;
function get_blob(e) {
  return new Promise((n) => {
    const t = new XMLHttpRequest();
    t.open("GET", e, !0),
      (t.responseType = "blob"),
      (t.onload = () => {
        200 === t.status && n(t.response);
      }),
      t.send();
  });
}
function save_as(e, n) {
  if (window.navigator.msSaveOrOpenBlob) navigator.msSaveBlob(e, n);
  else {
    const t = document.createElement("a"),
      o = document.querySelector("body");
    (t.href = window.URL.createObjectURL(e)),
      (t.download = n),
      (t.style.display = "none"),
      o.appendChild(t),
      t.click(),
      o.removeChild(t),
      window.URL.revokeObjectURL(t.href);
  }
}
function download(e, n) {
  get_blob(e).then((e) => {
    save_as(e, n);
  });
}
function convert_data_to_csv(e, n) {
  e = "\ufeff" + e;
  let t = new Blob([e], { type: "text/csv,charset=UTF-8" }),
    o = URL.createObjectURL(t),
    a = document.createElement("a");
  (a.download = n + ".csv"), (a.href = o), a.click();
}
function replace_nonstandard_characters(e) {
  return (e = (e = (e = (e = (e = (e = e.split(",").join("，"))
    .split("\r\n")
    .join(""))
    .split("\r")
    .join(""))
    .split("\n")
    .join("")).replace(/&nbsp;/g, " ")).replace(/&middot;/g, "·"));
}
function esnai_homepage_show_detail() {
  var e = document.querySelector("button.zk-w");
  null != e && "展开更多" == e.innerText && e.click();
}
function esnai_auto_play() {
  setInterval(esnai__replay_once(), 5e4);
}
function esnai__replay_once() {
  clearInterval(tc), player.HTML5.play(), s2j_onVideoPlay();
}
function esnai_download_button() {
  document
    .querySelector(
      "#rightfunctions > table:nth-child(4) > tbody > tr:nth-child(2) > td:nth-child(1) > a"
    )
    .click(),
    setTimeout(function () {
      document
        .querySelector(
          "body > div:nth-child(14) > div.panel-header.panel-header-noborder.window-header > div.panel-tool > a"
        )
        .click();
    }, 100),
    setTimeout(function () {
      if (
        null !=
          document.querySelector(
            "#coursedocswindow > table > tbody > tr:nth-child(2) > td:nth-child(4) > a"
          ) ||
        null != o_judge ||
        null != o_single
      ) {
        var e = document.querySelector("body"),
          n = document.createElement("div");
        e.appendChild(n),
          (n.innerText = "下载"),
          (n.style =
            "position:fixed;bottom:40%;left:15px;width:60px;height:60px;background:black;opacity:0.75;color:white;text-align:center;line-height:60px;cursor:pointer;"),
          (n.onclick = function () {
            (this.style.display = "none"),
              esnai_download_handouts(),
              esnai_download_question_bank();
          });
      }
    }, 100);
}
function esnai_download_handouts() {
  for (
    var e = document.querySelectorAll("#coursedocswindow > table > tbody > tr"),
      n = null,
      t = null,
      o = "",
      a = [],
      l = "",
      i = "",
      d = document.querySelector(
        "body > div.panel.layout-panel.layout-panel-north > div > table:nth-child(2) > tbody > tr > td:nth-child(1) > span"
      ).innerText,
      c = 1;
    c < e.length;
    c++
  )
    null != (t = (n = e[c]).querySelector("td:nth-child(4) > a")) &&
      ((l = (a = (o = t.href).split("."))[a.length - 1]),
      download(
        o,
        (i = n.querySelector("td:nth-child(1)").innerText) == d
          ? d + "." + l
          : d + "_" + i + "." + l
      ));
}
function esnai_download_question_bank() {
  var e = "类型,题目,答案",
    n = {},
    t = "",
    o = "",
    a = 0,
    l = { A: "对", B: "错" };
  if (null != o_judge)
    for (a = 0; a < o_judge.length; a++)
      (t = (n = o_judge[a]).t),
        (o = l[n.a]),
        (e =
          e +
          "\r\n判断题," +
          (t = replace_nonstandard_characters(t)) +
          "," +
          (o = replace_nonstandard_characters(o)));
  var i = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5 };
  if (null != o_single)
    for (a = 0; a < o_single.length; a++)
      (t = (n = o_single[a]).t),
        (o = n.o[i[n.a]]),
        (e =
          e +
          "\r\n单选题," +
          (t = replace_nonstandard_characters(t)) +
          "," +
          (o = replace_nonstandard_characters(o)));
  if (e.length >= 10) {
    var d = document.querySelector(
      "body > div.panel.layout-panel.layout-panel-north > div > table:nth-child(2) > tbody > tr > td:nth-child(1) > span"
    ).innerText;
    convert_data_to_csv(e, (d += "_题库"));
  }
}
location_href.indexOf("esnai.net") >= 0 &&
  (location_href.indexOf("/c/cpa") >= 0 &&
    setTimeout(function () {
      esnai_homepage_show_detail();
    }, 1e3),
  location_href.indexOf("/showflashvideo") >= 0 &&
    setTimeout(function () {
      esnai_auto_play(), esnai_download_button();
    }, 1e3));
