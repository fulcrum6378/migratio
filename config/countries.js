// Countries


// Parse XML
var tags = Array(), divIds = new Array(), checkedIds = new Array();
function parseXML(result, type) {
    var x = result.getElementsByTagName("cn");
    var main = document.getElementById("countries");
	tags = []; divIds = []; checkedIds = [];
	var rtl = "";
	if (isRtl()) rtl = " rtl";
    var i;
    for (i = 0; i < x.length; i++) {
		tags.push(x[i].getAttribute("nm"));
		var isOn = localStorage.getItem("cn_" + tags[i]) == "1";
		
		divIds.push("div" + i);
		var div = document.createElement("DIV");
		div.className = "cCon";
		div.id = divIds[i];
		main.appendChild(div);
		
		var topShadow = document.createElement("DIV");
		topShadow.className = "cShadowTop";
		div.appendChild(topShadow);
		
		var mainDiv = document.createElement("DIV");
		mainDiv.className = "cConMain"
		div.appendChild(mainDiv);
		
		var textDiv = document.createElement("DIV");
		textDiv.className = "cConText"+ rtl;
		/*if (isRtl()) {
		    textDiv.style.paddingLeft = "0px";
		    textDiv.style.paddingRight = "20px";
		}*/
		mainDiv.appendChild(textDiv);
		
		var paragraph1 = document.createElement("P");
		if (isRtl()) paragraph1.className = rtl;
		var cName = countries[countriesTAGS.indexOf(x[i].getAttribute("nm"))];
		paragraph1.appendChild(document.createTextNode((i + 1) + ". " + cName));
		//if (isRtl()) fontAban(paragraph1);
		textDiv.appendChild(paragraph1);
		
		var paragraph2 = document.createElement("P");
		if (isRtl()) paragraph2.className = rtl;
		paragraph2.appendChild(document.createTextNode(continents[parseInt(x[i].getAttribute("ct"))]));
		//if (isRtl()) fontAban(paragraph2);
		textDiv.appendChild(paragraph2);
		
		var checkBox = document.createElement("DIV");
		checkBox.className = "cCheckBox"+ rtl;
		/*if (isRtl()) {
		    toggleFloat(checkBox);
	    	checkBox.style.left = "15px";
	    	checkBox.style.right = "auto";
		}*/
		mainDiv.appendChild(checkBox);
		
		checkedIds.push("checked" + i);
		var checked = document.createElement("DIV");
		checked.className = "cChecked";
		checked.id = checkedIds[i];
		checked.style.opacity = "0";
		if (isOn) checked.style.opacity = "1";
		checkBox.appendChild(checked);
		const I = i
		mainDiv.onclick = function() {
			var CHECKED = document.getElementById(checkedIds[I]);
			if (CHECKED.style.opacity == "1") CHECKED.style.opacity = "0";
			else CHECKED.style.opacity = "1";
			var bb = "0";
			if (CHECKED.style.opacity == "1") bb= "1";
			localStorage.setItem("cn_" + tags[I], bb);
		}
		
		var bottomShadow = document.createElement("DIV");
		bottomShadow.className = "cShadowBottom";
		div.appendChild(bottomShadow);
    }
}
ajaxXML("./xml/countries.xml", 0);