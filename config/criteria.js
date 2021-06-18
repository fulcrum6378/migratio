// Countries


// FIRST
const OVERFLOW_HEIGHT = "222px";
var cookies = document.cookie.split("; ");
var censorOff = false;
for (c = 0; c < cookies.length; c++) {
    var pair = cookies[c].split("=");
    if (pair[0] == cookCensor(null) && pair[1] == "1") 
        censorOff = true;
}
function criName(cri) {
    return JSON.parse(cri.name)[l];
}


// Criterion Class
class Criterion {
    constructor(id, name, type, good, med, ref, cen) {
        this._id = id;
		this._name = name;
		this._type = type;
		this._good = good;
		this._med = med;
		this._ref = ref;
		this._cen = cen;
    }
    get id() { return this._id; }
	get name() { return this._name; }
	get type() { return this._type; }
	get good() { return this._good; }
	get med() { return this._med; }
	get ref() { return this._ref; }
	get cen() { return this._cen; }
	
    set id(x) { this._id = x; }
	set name(x) { this._name = x; }
	set type(x) { this._type = x; }
	set good(x) { this._good = x; }
	set med(x) { this._med = x; }
	set ref(x) { this._ref = x; }
	set cen(x) { this._cen = x; }
}


// Parse XML (DO NOT PUSH ARRAYS IN HERE)
var tags = new Array(), 
	divIds = new Array(), 
	overflowIds = new Array(), 
	cris = new Array();
function parseXML(result, type) {
	var x = result.getElementsByTagName("cr");
	cris = [];
	for (i = 0; i < x.length; i++) cris.push(new Criterion(
		x[i].getAttribute("id"),
		x[i].getAttribute("nm"),
		x[i].getAttribute("ty"),
		x[i].getAttribute("gd"),
		x[i].getAttribute("md"),
		x[i].getAttribute("rf"),
		x[i].getAttribute("ce")
	));
	cris.sort((a, b) => criName(a).localeCompare(criName(b)));
    var main = document.getElementById("criteria");
    var rtl = "";
	if (isRtl()) rtl = " rtl";
	tags = []; divIds = []; overflowIds = [];
    var i;
    for (i = 0; i < cris.length; i++) if (cris[i].cen != "1" || censorOff) {
		var cri = cris[i];
		tags[i] = cri.id;
		var isOn = localStorage.getItem("cr_" + tags[i]) == "1",
		    good = cri.good,
		    importance = "100";
		if (good == "") good = cri.med;
		if (localStorage.getItem("crgd_" + tags[i]) != null)
			good = localStorage.getItem("crgd_" + tags[i]);
		if (localStorage.getItem("crim_" + tags[i]) != null)
			importance = localStorage.getItem("crim_" + tags[i]);
		
		divIds[i] = "div" + i;
		var div = document.createElement("DIV");
		div.className = "cCri";
		div.id = divIds[i];
		main.appendChild(div);
		
		var topShadow = document.createElement("DIV");
		topShadow.className = "cShadowTop";
		div.appendChild(topShadow);
		
		var mainDiv = document.createElement("DIV");
		mainDiv.className = "cCriMain"
		div.appendChild(mainDiv);
		
		var textDiv = document.createElement("DIV");
		textDiv.className = "cCriText";
		mainDiv.appendChild(textDiv);
		
		var paragraph1 = document.createElement("P");
		if (isRtl()) paragraph1.className = rtl;
		var cName = criName(cri);
		paragraph1.appendChild(document.createTextNode(cName));
		textDiv.appendChild(paragraph1);
		
		var cSwitch = document.createElement("LABEL");
		cSwitch.className = "cSwitch"+ rtl;
		mainDiv.appendChild(cSwitch);
		
		var cCheckbox = document.createElement("INPUT");
		cCheckbox.setAttribute("type", "checkbox");
		cCheckbox.setAttribute("onchange", 
		    "saveIsOn(this.checked, '"+tags[i]+"');");
		cCheckbox.className = "cCheckbox";
		cCheckbox.checked = isOn;
		cSwitch.appendChild(cCheckbox);
		
		var cCheckSpan = document.createElement("SPAN");
		cCheckSpan.className = "cCheckSpan";
		cSwitch.appendChild(cCheckSpan);
		
		
		
		
		
		overflowIds[i] = "overflow" + i;
		var overflow = document.createElement("DIV");
		overflow.className = "cOverflow";
		overflow.id = overflowIds[i];
		overflow.style.transform = "scaleY(0)";
		overflow.style.height = "0px";
		overflow.style.display = "none";
		div.appendChild(overflow);
		const OVERFLOW = overflow;
		textDiv.onclick = function() {
		    if (OVERFLOW.style.transform == "scaleY(0)") {
		        OVERFLOW.style.transform = "scaleY(1)";
		        OVERFLOW.style.height = OVERFLOW_HEIGHT;
		        OVERFLOW.style.display = "block";
		    } else {
		        OVERFLOW.style.transform = "scaleY(0)";
		        OVERFLOW.style.height = "0px";
		        setTimeout(function() {
		            OVERFLOW.style.display = "none";
		        }, 148);
		    }
		}
		
		var goodValId = "goodVal" + i;
		var impPercId = "impPerc" + i;
		for (r = 0; r < 3; r++) {
		    var criOption = document.createElement("DIV");
		    criOption.className = "cCriOption"+rtl;
			overflow.appendChild(criOption);
			
			var radioCenter = document.createElement("CENTER");
			criOption.appendChild(radioCenter);
			var radioDiv = document.createElement("LABEL");
			radioDiv.setAttribute("align", "center");
			radioDiv.setAttribute("for", "radio" + i + ":" + r);
			radioCenter.appendChild(radioDiv);
			var radio = document.createElement("DIV");
			radio.className = "cRadioBox";
			radioDiv.appendChild(radio);
			var radioChecked = document.createElement("INPUT");
			radioChecked.setAttribute("type", "radio");
			radioChecked.setAttribute("name", "radio" + i);
			radioChecked.id = "radio" + i + ":" + r;
			radioChecked.className = "cRadioChecked";
			radioChecked.checked = (r === 0 && good == "+") || 
			        (r === 2 && good == "-") || 
			        (r === 1 && (good != "+" && good != "-"));
			var updateGood = "goodRadio('"+ radioChecked.name +"', '"+ tags[i] +"', '"+ goodValId +"');";
			radioChecked.setAttribute("onclick", updateGood);
			radio.appendChild(radioChecked);
			
			var radioSpan = document.createElement("SPAN");
			radioSpan.className = "cRadioSpan";
			radio.appendChild(radioSpan);
			
			if (r == 1) {
			    var closerTo = document.createElement("INPUT");
			    closerTo.setAttribute("type", "number");
			    closerTo.setAttribute("maxlength", "10");
			    closerTo.setAttribute("value", cri.med);
			    closerTo.setAttribute("onchange", updateGood);
			    closerTo.id = goodValId;
				criOption.appendChild(closerTo);
			}
			
			var pOption = document.createElement("LABEL");
			pOption.setAttribute("for", "radio" + i + ":" + r);
			pOption.innerHTML = resOptions[r];
			criOption.appendChild(pOption);
		}
		
		var criImp = document.createElement("CENTER");
		criImp.className = "cCriOption";
		overflow.appendChild(criImp);
		
		var criImpPercent = document.createElement("P");
		criImpPercent.className = "cImpPercent"+ rtl;
		criImpPercent.id = impPercId;
		criImp.appendChild(criImpPercent);
		setImpPercent(importance, impPercId);
		
		var criImpRange = document.createElement("INPUT");
		criImpRange.setAttribute("type", "range");
		criImpRange.setAttribute("oninput", 
		    "setImpPercent(this.value, '"+impPercId+"');");
		criImpRange.setAttribute("onchange", 
		    "saveImp(this, '"+tags[i]+"')");
		criImpRange.className = "cImportance";
		criImpRange.value = importance;
		criImp.appendChild(criImpRange);
		
		var bottomShadow = document.createElement("DIV");
		bottomShadow.className = "cShadowBottom";
		div.appendChild(bottomShadow);
    }
}
ajaxXML("./xml/criteria.xml", 1);


// Other Listeners
function saveIsOn(b, tag) {
	localStorage.setItem("cr_" + tag, b ? "1" : "0");
}
function goodRadio(rname, tag, goodValId) {
    var radios = document.getElementsByName(rname);
	var r = 0;
    for (ii = 0; ii < radios.length; ii++)
	if (radios[ii].checked) r = ii;
	
    var good = "";
    switch (r) {
        case 0:
            good = "+";
            break;
        case 2:
            good = "-";
            break;
        default:
            good = document.getElementById(goodValId).value;
    }
	localStorage.setItem("crgd_" + tag, good);
}
function saveImp(e, tag) {
	localStorage.setItem("crim_" + tag, e.value);
}
function setImpPercent(percent, imPerId) {
    document.getElementById(imPerId).innerHTML = resImportance+percent+"%";
}