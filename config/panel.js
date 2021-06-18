// Panel


// Before
var cBefore = document.getElementById("cBefore");
if (isRtl()) cBefore.className = "rtl";
var cLogoText = document.getElementById("cLogoText");
cLogoText.innerText = resAboutMigratio;
var cButCon = document.getElementById("cButCon");
cButCon.innerText = resCountries;
cButCon.onclick = function() {
    location.href = "http://migratio.mahdiparastesh.ir/?page_id=2";
};
var cButCri = document.getElementById("cButCri");
cButCri.innerText = resCriteria;
cButCri.onclick = function() {
    location.href = "http://migratio.mahdiparastesh.ir/?page_id=71";
};
var cDesc = document.getElementById("cDesc");
cDesc.innerText = resPanelDesc;



// Get XMLs
var gotCountries = null;
var gotCriteria = null;
function parseXML(result, type) {
    if (type == 0) gotCountries = result.getElementsByTagName("cn");
    else if (type == 1) gotCriteria = result.getElementsByTagName("cr");
    var list = compute();
    if (exists(list)) if (list.length > 0) {
        cBefore.remove();
        show(list);
    }
}
ajaxXML("./xml/countries.xml", 0);//window.location.protocol
ajaxXML("./xml/criteria.xml", 1);



// Subsidiary Functions
function findConByTag(tag, list) {
    var con = null;
    for (i = 0; i < list.length; i++)
        if (list[i].getAttribute("nm") == tag) con = list[i];
    return con;
}
function findCriByTag(tag, list) {
    var cri = null;
    for (i = 0; i < list.length; i++)
        if (list[i].getAttribute("id") == tag) cri = list[i];
    return cri;
}
function findItemByCriTag(con, criTag) {
    var item = null;
    for (gotItem of con.children)
        if (gotItem.getAttribute("nm") == criTag) item = gotItem;
    return item;
}
function compileValue(myCon, myCri, cons) {
    var value = findItemByCriTag(myCon, myCri.getAttribute("id"))
        .getAttribute("vl");
    if (value == "-") {
        var split = findItemByCriTag(myCon, myCri.getAttribute("id"))
            .getAttribute("ex").split("+");
        var estimation = [];
        for (ss of split) 
            estimation.push(compileValue(findConByTag(ss, cons), myCri, cons));
        var estimate = estimation[0];
        if (estimation.length > 1) {
            for (es of estimation) estimate += es;
            var division = estimate / estimation.length;
            if (division != Infinity) estimate = division;
        }
        return estimate;
    } else if (value.substring(0, 1) == "~") 
        return parseFloat(value.substring(1));
    else return parseFloat(value);
}
function safeGood(crit, myGood) {
    if (exists(myGood)) return myGood;
    else return crit.getAttribute("md");
}
function safeImp(imp) {
    if (exists(imp)) return imp;
    else return "100";
}
function relativeScore(min, max, value) {
    if (min != max) {
        var cA = Math.abs(max - min);
        var cB = Math.abs(value - min);
        var cC = 100.0 / cA;
        var cD = cC * cB;
        return cD;
    } else return 100.0;
}



// Computation Class
class Computation {
    constructor(tag, score) {
        this._tag = tag;
        this._score = score;
    }
    get tag() {
        return this._tag;
    }
    get score() {
        return this._score;
    }
    set tag(x) {
        this._tag = x;
    }
    set score(x) {
        this._score = x;
    }
}



// Computation
var myCons = [], myCris = [], myCriGds = [], myCriIms = [];
function compute() {
    if (!exists(gotCountries) || !exists(gotCriteria)) return null;
    
    // My Selection
    myCons = []; myCris = [];
	for (n = 0; n < countriesTAGS.length; n++)
		if (localStorage.getItem("cn_" + countriesTAGS[n]) == "1" && 
		   findConByTag(countriesTAGS[n], gotCountries) != null)
            myCons.push(countriesTAGS[n]);
	for (r = 0; r < criteriaTAGS.length; r++)
		if (localStorage.getItem("cr_" + criteriaTAGS[r]) == "1")
			myCris.push(criteriaTAGS[r]);
	myCons.sort();
	if (myCons.length == 0 || myCris.length == 0) return null;
	
	
	
	// Good and Importance
	myCriGds = []; myCriIms = [];
	for (mycri = 0; mycri < myCris.length; mycri++) {
		if (localStorage.getItem("crgd_" + myCris[mycri]) != null)
			myCriGds[mycri] = localStorage.getItem("crgd_" + myCris[mycri]);
		if (localStorage.getItem("crim_" + myCris[mycri]) != null)
			myCriIms[mycri] = localStorage.getItem("crim_" + myCris[mycri]);
	}
    
    
    // Minima and Maxima
    const minAndMax = [];
    for (mycri = 0; mycri < myCris.length; mycri++) {
        var allVals = [];
        var crit = findCriByTag(myCris[mycri], gotCriteria);
        var crgd = safeGood(crit, myCriGds[mycri]);
		for (con of gotCountries) {
			var comVal = compileValue(con, crit, gotCountries);
			allVals.push((crgd == "+" || crgd == "-") ? comVal : Math.abs(comVal - parseFloat(crgd)));
		}// for (mycon of myCons) findConByTag(mycon, gotCountries)
        var pushable = [Math.min(...allVals), Math.max(...allVals)];
        if (crgd != "+") pushable.reverse();
        minAndMax.push(pushable);
    }
    
    
    // Get mean scores in my criteria for each country
    const meanScores = [];
    for (mycon of myCons) {
        var myCon = findConByTag(mycon, gotCountries);
        
        // Scores Without Importance Adjustment
        var scoresNoImport = [];
        for (mycri = 0; mycri < myCris.length; mycri++) {
            var crit = findCriByTag(myCris[mycri], gotCriteria);
            var crgd = safeGood(crit, myCriGds[mycri]);
            var notReadyVal = compileValue(myCon, crit, gotCountries);
            var readyVal = notReadyVal;
            if (crgd != "-" && crgd != "+")
                readyVal = Math.abs(notReadyVal - parseFloat(crgd));
            scoresNoImport.push(
                relativeScore(
                    minAndMax[mycri][0],
                    minAndMax[mycri][1],
                    readyVal
                )
            );
        }
        
        // Scores With Importance Adjustment
        var scores = [];
		var weightedMean = 0.0;
        for (sni = 0; sni < scoresNoImport.length; sni++) {
			var weight = parseFloat(safeImp(myCriIms[sni])) / 100.0;
			weightedMean += weight;
			scores.push(scoresNoImport[sni] * weight);
		}
        
        // Mean Score of All Criteria
        var mean = 0.0;
        for (s of scores) mean += s;
        mean /= weightedMean;

        meanScores.push(mean);
    }
    
    
    // Make relative scores out of mean scores
    const list = [];
    for (mycon = 0; mycon < myCons.length; mycon++)
        list.push(new Computation(
            myCons[mycon], relativeScore(
                Math.min(...meanScores),
                Math.max(...meanScores),
                meanScores[mycon]
            )
        ));
    list.sort(function(a, b) {
        return b.score - a.score;
    });
    return list;
}



// Show Results
function show(computs) {
    var main = document.getElementById("panel");
    var rtl = "";
	if (isRtl()) rtl = " rtl";
    for (let c of Object.keys(computs)) {
        var div = document.createElement("DIV");
		div.className = "cMyCon"+ rtl;
		main.appendChild(div);
		
		var p1 = document.createElement("P");
		p1.className = "cMyConName";
		p1.appendChild(document.createTextNode(
		    (parseInt(c) + 1) + ". " + 
		    countries[countriesTAGS.indexOf(computs[c].tag)]));
		div.appendChild(p1);
		
		var p2 = document.createElement("P");
		p2.className = "cMyConScore";
		p2.appendChild(document.createTextNode(
		    Math.round(computs[c].score) + "%"));
		div.appendChild(p2);
    }
}