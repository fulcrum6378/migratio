// Settings


// HTML
var main = document.getElementById("settings");
var rtl = "";
if (isRtl()) rtl = " rtl";
main.className = rtl;


// Languages
document.getElementsByClassName("cSetParam")[0].innerText = resLanguage+":";
var selLang = document.getElementById("cLang");
for (lan = 0; lan < langs.length; lan++) {
    var option = document.createElement("OPTION");
    option.value = langs[lan];
    option.innerHTML = langNames[lan];
    option.selected = langs[lan] == thisLang();
    selLang.appendChild(option);
}
selLang.onchange = function() {
    document.cookie = cookLang(this.value);
    location.reload();
}


// Void Links
var san = document.getElementById("selectAllCons");
var dan = document.getElementById("deselectAllCons");
var sar = document.getElementById("selectAllCris");
var dar = document.getElementById("deselectAllCris");
var rar = document.getElementById("resetAllCris");
var ral = document.getElementById("resetAll");
san.innerHTML = resSelectAllCons;
dan.innerHTML = resDeselectAllCons;
sar.innerHTML = resSelectAllCris;
dar.innerHTML = resDeselectAllCris;
rar.innerHTML = resResetAllCris;
ral.innerHTML = resResetAll;
san.onclick = function () {
	if (!confirm(resSure)) return false;
    for (var c = 0; c < countriesTAGS.length; c++)
        localStorage.setItem("cn_" + countriesTAGS[c], "1");
};
dan.onclick = function () {
	if (!confirm(resSure)) return false;
    for (var c = 0; c < countriesTAGS.length; c++)
        localStorage.removeItem("cn_" + countriesTAGS[c]);
};
sar.onclick = function () {
	if (!confirm(resSure)) return false;
    for (var c = 0; c < criteriaTAGS.length; c++)
		localStorage.setItem("cr_" + criteriaTAGS[c], "1");
};
dar.onclick = function () {
	if (!confirm(resSure)) return false;
    for (var c = 0; c < criteriaTAGS.length; c++)
		localStorage.removeItem("cr_" + criteriaTAGS[c]);
};
rar.onclick = function () {
	if (!confirm(resSure)) return false;
    for (var c = 0; c < criteriaTAGS.length; c++) {
        localStorage.removeItem("cr_" + criteriaTAGS[c]);
		localStorage.removeItem("crgd_" + criteriaTAGS[c]);
		localStorage.removeItem("crim_" + criteriaTAGS[c]);
    }
};
ral.onclick = function () {
	if (!confirm(resSure)) return false;
    for (var c = 0; c < countriesTAGS.length; c++)
        localStorage.removeItem("cn_" + countriesTAGS[c]);
    for (var c = 0; c < criteriaTAGS.length; c++) {
        localStorage.removeItem("cr_" + criteriaTAGS[c]);
		localStorage.removeItem("crgd_" + criteriaTAGS[c]);
		localStorage.removeItem("crim_" + criteriaTAGS[c]);
    }
};


// Break Censor
var cookies = document.cookie.split("; ");
var censorOff = false;
for (c = 0; c < cookies.length; c++) {
    var pair = cookies[c].split("=");
    if (pair[0] == cookCensor(null) && pair[1] == "1") 
        censorOff = true;
}
var censorBreak = 0;
window.onload = function() {
	document.getElementsByClassName("footer-copyright")[0].onclick = function() {
        censorBreak += 1;
        if (censorBreak >= 10) {
            censorBreak = 0;
            censorOff = !censorOff;
            document.cookie = cookCensor(censorOff);
        }
        setTimeout(function() { censorBreak = 0; }, 5000);
    }
}