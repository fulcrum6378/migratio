// Functions


// AJAX
function ajaxXML(address, type) {
	var req;
	if (window.XMLHttpRequest) req = new XMLHttpRequest();
	else req = new ActiveXObject("Microsoft.XMLHTTP");
	req.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) 
	        parseXML(this.responseXML, type);
	}
	req.open("GET", address, true);
	req.send();
}


// Cookies
function cookEnd(exdays = 360) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var exp = d.toUTCString();
    if (exdays < 0) exp = "Thu, 01 Jan 1970 00:00:00 UTC";
    return "; expires="+ exp +"; path=/";
}
function cookCensor(b, exp = undefined) {
	var bb = "=0";
	if (b) bb = "=1";
	bb += cookEnd(exp);
	if (b === null) bb = "";
	return "censor" + bb;
}
function cookLang(tag) {
	var bb = "="+tag;
	bb += cookEnd();
	if (tag === null) bb = "";
	return "set_lang" + bb;
}


// Languages
const langs = ["en", "fa"];
const langNames = ["English", "فارسی"];


// Other
function exists(thing) {
    return thing != undefined && thing != null;
}


// TAGS
const countriesTAGS = [
  "afghan", "alba", "alger", "andor", "angol", "antigbar", "argen", "armen", "austra",
  "austri", "azer", "baham", "bahr", "bangla", "barba", "belar", "belg", "beliz",
  "benin", "bhut", "boliv", "bosni", "botsw", "braz", "brun", "bulgar", "burkfa",
  "burund", "ivorcoast", "cabover", "cambod", "camer", "can", "car", "chad", "chil",
  "china", "colom", "comor", "congo", "costar", "croat", "cuba", "cypr", "czech", "drc",
  "denm", "djib", "dominic", "dominicrep", "ecuad", "egypt", "elsalv", "eqguin", "erit",
  "est", "eswat", "ethiop", "fiji", "fin", "franc", "gabon", "gamb", "georg", "german",
  "ghana", "greec", "grenad", "guatem", "guinea", "guineabiss", "guyana", "haiti",
  "holsee", "hondur", "hungar", "ice", "ind", "indones", "iran", "iraq", "ire", "heb",
  "ital", "jamaic", "jpn", "jord", "kazakh", "kenya", "kiribas", "kos", "kuwait",
  "kyrgyz", "lao", "latvia", "leban", "lesoth", "liber", "liby", "liechtens", "lithua",
  "luxem", "madagas", "malaw", "malay", "maldav", "mali", "malt", "marshal", "mauritan",
  "mauritius", "mexic", "micrones", "moldov", "monaco", "mongol", "montenegr", "moroc",
  "mozam", "myanm", "namibia", "nauru", "nepal", "nether", "newz", "nicarag", "niger",
  "nigeria", "nkorea", "nmacedon", "norw", "oman", "pak", "palau", "palestin", "panam",
  "papuang", "paragu", "peru", "philip", "pol", "port", "qtr", "roman", "rus", "rwand",
  "sankitts", "sanluc", "sanvinc", "samoa", "sanmar", "saotome", "arabia", "senegal",
  "serb", "seychel", "sierra", "singap", "slovak", "sloven", "solomon", "somali",
  "southafr", "skorea", "ssudan", "spain", "srilanka", "sudan", "surinam", "swed",
  "swiss", "syria", "tai", "tajik", "tanzan", "thai", "timorlest", "togo", "tong",
  "trinidatob", "tunis", "turk", "turkmen", "tuval", "ugand", "ukrain", "uae", "uk",
  "usa", "urug", "uzbek", "vanua", "venez", "viet", "ymn", "zamb", "zimbab"
];
const criteriaTAGS = [
  "airpol", "humdev", "gayhap", "lngepi", "langen", "avgwth", "sumwin", 
  "crimer", "worisk", "gpeace", "dnganm", "suicid", "sunshn", "frerel",
  "frebio", "fredrg", "fresex", "fretht", "democr", "traffc", "migacc", 
  "racism", "bdhair", "blonde", "intusr", "ginnov", "gtacoi", "inflat", 
  "unempl", "conscr", "mwcosr", "costpr"
];



// Languages
function thisLang() {
    var cookies = document.cookie.split("; ");
    var thisLang = langs[0];
    for (c = 0; c < cookies.length; c++) {
        var pair = cookies[c].split("=");
    	if (pair[0] == cookLang(null)) thisLang = pair[1];
    }
    return thisLang;
}
function isRtl() {
    var l = thisLang();
    return l == langs[1];
}



// On Load
window.onload = function() {
    if (thisLang() == langs[1]) {
        var siteTitle = document.getElementsByClassName("site-title")[0];
        siteTitle.childNodes[0].innerText = resMigratio;
        siteTitle.style.fontFamily = "Sari, W_sari, Sans-serif";
        siteTitle.style.fontSize = "3.5rem";
        
        var footerCopy = document.getElementsByClassName("footer-copyright")[0];
        footerCopy.children[0].innerText = resMigratio;
        footerCopy.style.fontFamily = "Aban, W_aban, sans-serif";
        footerCopy.style.fontSize = "2.2rem";
        footerCopy.style.fontWeight = "500";
        
        var toTheTop = document.getElementsByClassName("to-the-top")[0], 
            tttLong = toTheTop.children[0],
            tttShort = toTheTop.children[1];
        tttLong.innerText = tttLong.innerText
            .replace("To the top", "برو به بالا");
        tttShort.innerText = tttShort.innerText.replace("Up", "بالا");
        toTheTop.style.fontFamily = "Aban, W_aban, sans-serif";
        toTheTop.style.fontSize = "2rem";
        toTheTop.style.fontWeight = "200";
        
        var menus = [
            "پنل", 
            "کشورها", 
            "معیارها", 
            "تنظیمات"
        ];
        var pMenu = document.getElementsByClassName("primary-menu-wrapper")[0]
            .children[0];
        for (p = 0; p < pMenu.children.length; p++) {
            var pLink = pMenu.children[p].children[0];
            if (p < menus.length) pLink.innerText = menus[p];
            pLink.style.fontFamily = "Aban, W_aban, sans-serif";
            pLink.style.fontSize = "2.5rem";
            pLink.style.fontWeight = "500";
        }
        var eMenu = document.getElementsByClassName("expanded-menu")[0]
            .children[0];
        for (e = 0; e < eMenu.children.length; e++) {
            var eLink = eMenu.children[e].children[0].children[0];
            if (e < menus.length) eLink.innerText = menus[e];
            eLink.style.fontFamily = "Aban, W_aban, sans-serif";
            eLink.style.fontSize = "2.5rem";
            eLink.style.fontWeight = "500";
            eLink.style.textAlign = "right";
        }
        var mMenu = document.getElementsByClassName("mobile-menu")[0]
            .children[0];
        for (m = 0; m < mMenu.children.length; m++) {
            var mLink = mMenu.children[m].children[0].children[0];
            if (m < menus.length) mLink.innerText = menus[m];
            mLink.style.fontFamily = "Aban, W_aban, sans-serif";
            mLink.style.fontSize = "2.5rem";
            mLink.style.fontWeight = "500";
            mLink.style.textAlign = "right";
        }
        mMenu.style.left = "0";
        mMenu.style.right = "calc(50% - 50vw)";
        
        var toggleTexts = document.getElementsByClassName("toggle-text");
        for (t = 0; t < toggleTexts.length; t++) {
            if (toggleTexts[t].innerText == "Menu") {
                toggleTexts[t].innerText = "منو";
                toggleTexts[t].style.fontFamily = "Aban, W_aban, sans-serif";
                toggleTexts[t].style.fontSize = "1.3rem";
                toggleTexts[t].style.fontWeight = "100";
            }
            if (toggleTexts[t].innerText == "Close Menu") {
                toggleTexts[t].innerText = "بستن منو";
                toggleTexts[t].style.fontFamily = "Aban, W_aban, sans-serif";
                toggleTexts[t].style.fontSize = "1.9rem";
                toggleTexts[t].style.fontWeight = "400";
            }
        }
    }
}