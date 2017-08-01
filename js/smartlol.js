// smartlol.js
//-----------------------HOME FUNCTIONS----------------------------
function changeTabs(tab){
	if (tab != "forum") {
		document.getElementById("cube"+(document.getElementsByClassName("active")[0].id)).style.display="none"; //quita
		document.getElementsByClassName("active")[0].classList.remove("active");
		document.getElementById(tab).classList.add("active");
		document.getElementById("cube"+tab).style.display="block";
	} else { alert("The forum is not finished yet!!! We'll let you know when it's done! =)");
	}
}

//Here I define the click functions of all the tabs
document.getElementById("home").addEventListener("click", function(){changeTabs("home")});
document.getElementById("onLive").addEventListener("click", function(){changeTabs("onLive")});
document.getElementById("offline").addEventListener("click", function(){changeTabs("offline")});
document.getElementById("championSelect").addEventListener("click", function(){changeTabs("championSelect")});
document.getElementById("statistics").addEventListener("click", function(){changeTabs("statistics")});
document.getElementById("forum").addEventListener("click", function(){changeTabs("forum")});
btnGetStarted.addEventListener("click", function(){changeTabs("onLive")});

//-----------------------/HOME FUNCTIONS----------------------------
//-----------------------ON LIVE FUNCTIONS----------------------------


// This is the functionality of the button that searches the data on live clicking the button
document.getElementById("searchSummonerLiveGame").addEventListener("click", function(){
	if(document.getElementById("txtSearchBar").value != ""){
		searchLiveData();
	} else {
		alert("You must fill the Summoner Name text field");
	}
})

// This is the functionality of the button that searches the data on live pressing enter
document.getElementById("txtSearchBar").addEventListener("keypress", function (e) {
	var key = e.which || e.keyCode;
	if (key === 13 && document.getElementById("txtSearchBar").value != ""){
		document.getElementById("txtSearchBar").blur();
		searchLiveData();
	}
})

function searchLiveData(){
	cubeonLive.style.filter = "blur(10px) opacity(0.9)";
	modal.classList.add("modal");
	loader.classList.add("loader");
	getTheJson("php/getSummonerByName.php?name=" + txtSearchBar.value, getSummonerByName, "Ese Summoner Name no existe!", null, null, null); //Start loading all the data
	getTheJson("php/getCurrentVersion.php", getCurrentVersion, "Falló al buscar la version actual del servidor", null, null, null); //paso el id del mapa a la tabla que busca los tipos de games
	setTimeout ('loadLiveData()', 1000); //calls the loadLiveData after waiting a hardcoded amount of seconds
}

//This is the function that is called after 5 seconds of delay on loading. It simulates that the data loading has been finished
function loadLiveData(){
	document.getElementById("cubeonLive").style.display="none";
	document.getElementById("cubeLiveData").classList.add("cubeOnLive");
	document.getElementById("cubeLiveData").classList.add("cubeActivate");
	setTimeout ('document.getElementById("modal").classList.remove("modal")', 1000);
	setTimeout ('document.getElementById("loader").classList.remove("loader")', 1000);

}
//-----------------------/ON LIVE FUNCTIONS----------------------------
//-----------------------Riot Api Requests---------------------------------



function getSummonerByName(){
	if (summonerName.innerHTML == "") {
		summonerName.innerHTML = data.name;
		searchedSummonerId.innerHTML = data.id;
		searchedAccountId.innerHTML = data.accountId;
		getTheJson("php/getCurrentGameInfoBySummoner.php?summonerId=" + data.id, getCurrentGameInfoBySummoner, summonerName.innerHTML + " no esta en una partida en este momento!", null, null, null); //busco los datos del summoner
	} else {
	 	getTheJson("php/getGamesPlayedByChampion.php?championId=" + getSummonerByName.arguments[2] + "&accountId=" + data.accountId , getGamesPlayedByChampion, "noRankedGamesPlayedWithCurrentChampion", getSummonerByName.arguments[1],  data.accountId, null); //paso el accountId del campeon para conseguir los juegos jugados con ese campeón
	 	getTheJson("php/getGamesPlayedByAccount.php?accountId=" + data.accountId , getGamesPlayedByAccount, "noGamesPlayed", getSummonerByName.arguments[1],  data.accountId, null); //paso el accountId del campeon para conseguir los juegos jugados con ese campeón
	}
}

function getCurrentGameInfoBySummoner(){
	 getTheJson("json/matchMakingQueues.json", getQueueName, "Falló al buscar la queue", data.gameQueueConfigId, null, null); //paso el id del game a la tabla que busca los tipos de games
	 getTheJson("json/maps.json", getMapName, "Falló al buscar el mapa", data.mapId, null); //paso el id del mapa a la tabla que busca los tipos de games
	 getTheJson("php/getCurrentServerStatus.php?regionTag=" + data.platformId, getServerName, "Falló al buscar el status del servidor", null, null, null); //paso el id del mapa a la tabla que busca los tipos de games
	 for(var i = 0; i < data.participants.length; i++){
	 	document.getElementById("playerName"+i).innerHTML = data.participants[i].summonerName;
	 	getTheJson("php/getChampionInfo.php?championId=" + data.participants[i].championId, getChampionsImgsUrl, "Falló al buscar la imagen del Champion", i, null, null); //paso el id del campeon para conseguir la url de las imagenes
	 	getTheJson("php/getSpellsInfo.php?spellId=" + data.participants[i].spell1Id, getSpellsImgsUrl, "Falló al buscar el Spell 0", i, 0, null); //paso el id del spell 1 para conseguir la url de la imagen
	 	getTheJson("php/getSpellsInfo.php?spellId=" + data.participants[i].spell2Id, getSpellsImgsUrl, "Fallo al buscar el Spell 1", i, 1, null); //paso el id del spell 2 para conseguir la url de la imagen
	 	getTheJson("php/getRankingLeagueInfo.php?summonerId=" + data.participants[i].summonerId, getRankedInfo, "Fallo al buscar la info de ranked", i, data.participants[i].summonerId, null); //paso el id del summoner para que busque la info de ranked
		getTheJson("php/getSummonerByName.php?name=" + data.participants[i].summonerName, getSummonerByName, "Falló al buscar la información del Summoner By Name", i, data.participants[i].championId, null); //Busco la info del summoner by Name
	 	for(var n = 0; n < data.participants[i].masteries.length; n++){
	 		if (data.participants[i].masteries[n].masteryId == 6161 || data.participants[i].masteries[n].masteryId == 6162 || data.participants[i].masteries[n].masteryId == 6164 || data.participants[i].masteries[n].masteryId == 6361 || data.participants[i].masteries[n].masteryId == 6362 || data.participants[i].masteries[n].masteryId == 6363 || data.participants[i].masteries[n].masteryId == 6261 || data.participants[i].masteries[n].masteryId == 6262 || data.participants[i].masteries[n].masteryId == 6263 ) {
	 			document.getElementById("mastery"+i).src = "http://ddragon.leagueoflegends.com/cdn/"+serverActualVersion.innerHTML+"/img/mastery/"+data.participants[i].masteries[n].masteryId+".png";
	 			getTheJson("php/getMasteryInfobyId.php?id=" + data.participants[i].masteries[n].masteryId, getMasteryInfobyId, "Fallo al buscar la info de la maestria por id", i, null, null); //paso el id de la maestria para sacar la info de ella
	 		}
	 	}

	 }
}

function getCurrentVersion(){
	serverActualVersion.innerHTML = data[0];
}

function summonerLoaded(){
	summonersLoaded.innerHTML = parseInt(summonersLoaded.innerHTML) + 1;
	if (parseInt(summonersLoaded.innerHTML) == 10) { //Cuando ese contador llega a 10, ya tengo todos mis get the jsons hechos. Y formateo los datos internos.
		formatMatchData();
	}
}

function getMatchDataByMatchIdAccountId(){
	for (var n = 0; n < data.participantIdentities.length; n++){
		if (data.participantIdentities[n].player.currentAccountId == getMatchDataByMatchIdAccountId.arguments[2]){
		//Pregunto si es el jugador que estoy buscando
			if (document.getElementById("winLoss"+getMatchDataByMatchIdAccountId.arguments[1]).innerHTML == ""){ //Si estan vacias, inicializa la cuenta.
				document.getElementById("winLoss"+getMatchDataByMatchIdAccountId.arguments[1]).innerHTML = 0;
				document.getElementById("kills"+getMatchDataByMatchIdAccountId.arguments[1]).innerHTML = 0;
				document.getElementById("deaths"+getMatchDataByMatchIdAccountId.arguments[1]).innerHTML = 0;
				document.getElementById("assists"+getMatchDataByMatchIdAccountId.arguments[1]).innerHTML = 0;
				document.getElementById("cs"+getMatchDataByMatchIdAccountId.arguments[1]).innerHTML = 0;
			}

			if (data.participants[n].stats.win){
				document.getElementById("winLoss"+getMatchDataByMatchIdAccountId.arguments[1]).innerHTML = parseInt(document.getElementById("winLoss"+getMatchDataByMatchIdAccountId.arguments[1]).innerHTML) + 1;
			}else{
				document.getElementById("winLoss"+getMatchDataByMatchIdAccountId.arguments[1]).innerHTML = parseInt(document.getElementById("winLoss"+getMatchDataByMatchIdAccountId.arguments[1]).innerHTML) - 1;
			}
			document.getElementById("kills"+getMatchDataByMatchIdAccountId.arguments[1]).innerHTML = parseInt(document.getElementById("kills"+getMatchDataByMatchIdAccountId.arguments[1]).innerHTML) + parseInt(data.participants[n].stats.kills);
			document.getElementById("deaths"+getMatchDataByMatchIdAccountId.arguments[1]).innerHTML = parseInt(document.getElementById("deaths"+getMatchDataByMatchIdAccountId.arguments[1]).innerHTML) + parseInt(data.participants[n].stats.deaths);
			document.getElementById("assists"+getMatchDataByMatchIdAccountId.arguments[1]).innerHTML = parseInt(document.getElementById("assists"+getMatchDataByMatchIdAccountId.arguments[1]).innerHTML) + parseInt(data.participants[n].stats.assists);
			document.getElementById("cs"+getMatchDataByMatchIdAccountId.arguments[1]).innerHTML = parseInt(document.getElementById("cs"+getMatchDataByMatchIdAccountId.arguments[1]).innerHTML) + parseInt(data.participants[n].stats.totalMinionsKilled) + parseInt(data.participants[n].stats.neutralMinionsKilled);
		}
	}
	if (getMatchDataByMatchIdAccountId.arguments[3]) {  // Tengo un flag de true cuando es el ultimo request del summoner. Cuando es verdadero suma uno en un contador general.
		summonerLoaded();
	}
}


function formatMatchData(){
	for (var i = 0; i <= 9; i++){
		if (document.getElementById("championTotalGames"+i).innerHTML != 0){
			totalGames = parseInt(document.getElementById("championTotalGames"+i).innerHTML);
			losses = (totalGames + parseInt(document.getElementById("winLoss"+i).innerHTML))/2;
			wins = totalGames - losses;
			winLossPercent = parseInt(wins*100/totalGames);
			document.getElementById("winLoss"+i).innerHTML = wins + " / " + losses + " (" + winLossPercent + "%)";
			document.getElementById("kills"+i).innerHTML = parseInt(parseInt(document.getElementById("kills"+i).innerHTML)/totalGames);
			document.getElementById("deaths"+i).innerHTML = parseInt(parseInt(document.getElementById("deaths"+i).innerHTML)/totalGames);
			document.getElementById("assists"+i).innerHTML = parseInt(parseInt(document.getElementById("assists"+i).innerHTML)/totalGames);
			document.getElementById("cs"+i).innerHTML = parseInt(parseInt(document.getElementById("cs"+i).innerHTML)/totalGames);
		}
	}

}
function getGamesPlayedByAccount(){
	var positionTop = 0;
	var jg = 0;
	var mid = 0;
	var adc = 0;
	var supp = 0;
	for (var n = 0; n < data.matches.length; n++){
		switch(data.matches[n].lane) {
    		case "TOP":
    			positionTop = positionTop+1;
        	break;
    		case "JUNGLE":
        		jg = jg+1;
        	break;
        	case "MID":
        		mid = mid+1;
        	break;
    		case "BOTTOM":
    			if (data.matches[n].role == "DUO_CARRY") {
    				adc = adc+1;
    			} else{
    				supp = supp+1;
    			}
    		break;
    	}
    }

    //Empiezo a buscar cual es el primer Main
    var positions = [["TOP", positionTop, parseInt(positionTop * 100 / parseInt(data.matches.length))],["JUNGLE", jg, parseInt(jg * 100 / parseInt(data.matches.length))],["MID", mid, parseInt(mid * 100 / parseInt(data.matches.length))],["ADC", adc, parseInt(adc * 100 / parseInt(data.matches.length))],["SUPP", supp, parseInt(supp * 100 / parseInt(data.matches.length))]];
    firstMain = positions[0];
    firstMainId = 0;
    for(var n = 1; n <= 4; n++){
    	if ( firstMain[1] < positions[n][1] ) {
    		firstMain = positions[n];
    		firstMainId = n;
    	}
    }
    document.getElementById("mains"+getGamesPlayedByAccount.arguments[1]).innerHTML = firstMain[0]+" ("+firstMain[2]+"%)";
}

function getGamesPlayedByChampion(){
	document.getElementById("championTotalGames"+getGamesPlayedByChampion.arguments[1]).innerHTML = 0;
	if (data.matches.length==0) {
		zeroGamesPlayed(getGamesPlayedByChampion.arguments[1]);
	} else{
		for (var n = 0; n < data.matches.length; n++){ //recorre el json con los matches por si encuentra alguno de otro servidor
			if(data.matches[n].platformId!="LA2"){
				data.matches.splice(n,1);
			}
		}
		if (data.matches.length > 50){ //solo deja la informacion de las ultimas 50 partidas
			data.matches.splice(50,(data.matches.length-50));
		}
		lastMatch = false;
		for (var n = 0; n < data.matches.length; n++){
			if (document.getElementById("championTotalGames"+getGamesPlayedByChampion.arguments[1]).innerHTML<=49) {
				if (n == (data.matches.length-1)) {lastMatch = true;}// si es la ultima partida, le avisa por el flag lastMatch que es la ultima partida.
				document.getElementById("championTotalGames"+getGamesPlayedByChampion.arguments[1]).innerHTML = parseInt(document.getElementById("championTotalGames"+getGamesPlayedByChampion.arguments[1]).innerHTML)+1;
				getTheJson("php/getMatchDataByMatchIdAccountId.php?matchId=" + data.matches[n].gameId + "&accountId=" + getGamesPlayedByChampion.arguments[2]+ "&playerNumber=" + getGamesPlayedByChampion.arguments[1], getMatchDataByMatchIdAccountId, "Falló al buscar la información del Match by Id de match", getGamesPlayedByChampion.arguments[1], getGamesPlayedByChampion.arguments[2], lastMatch); //Busco la info del match by match id y account id y si es la ultima partida, le paso un flag (boolean) en true.
			}
		}
	}
}

function getMasteryInfobyId(){
	document.getElementById("mastery"+getMasteryInfobyId.arguments[1]).alt = data.name + " mastery";
}

function getRankedInfo(){
	if (data != ""){
		if(data[0].playerOrTeamId == getRankedInfo.arguments[2]){
			document.getElementById("gamesPlayed"+getRankedInfo.arguments[1]).innerHTML = "W: " + data[0].wins + "   L: " + data[0].losses;
			document.getElementById("tier"+getRankedInfo.arguments[1]).innerHTML = data[0].rank;
			document.getElementById("rankedLeague"+getRankedInfo.arguments[1]).src = "images/rankedIcons/" + data[0].tier + "_" + data[0].rank + ".png";
			document.getElementById("rankedLeague"+getRankedInfo.arguments[1]).alt = data[0].tier+" Icon";
		}
	} else{
		document.getElementById("gamesPlayed"+getRankedInfo.arguments[1]).innerHTML = "W: 0   L: 0";
		document.getElementById("tier"+getRankedInfo.arguments[1]).innerHTML = "";
		document.getElementById("rankedLeague"+getRankedInfo.arguments[1]).src = "images/rankedIcons/provisional.png";
		document.getElementById("rankedLeague"+getRankedInfo.arguments[1]).alt = "Unranked Icon";
	}
}

function getSpellsImgsUrl(){
	document.getElementById("summoner"+getSpellsImgsUrl.arguments[1]+"Spell"+getSpellsImgsUrl.arguments[2]).src = "http://ddragon.leagueoflegends.com/cdn/"+ serverActualVersion.innerHTML + "/img/" + data.image.group + "/" + data.image.full;
	document.getElementById("summoner"+getSpellsImgsUrl.arguments[1]+"Spell"+getSpellsImgsUrl.arguments[2]).alt= data.name + " image";
}

function getChampionsImgsUrl(){
	document.getElementById("championImgSmall"+getChampionsImgsUrl.arguments[1]).src = "http://ddragon.leagueoflegends.com/cdn/"+ serverActualVersion.innerHTML + "/img/" + data.image.group + "/" + data.image.full;
	document.getElementById("championImgSmall"+getChampionsImgsUrl.arguments[1]).alt= data.name + " small image";
	document.getElementById("championImg"+getChampionsImgsUrl.arguments[1]).src = "http://ddragon.leagueoflegends.com/cdn/img/" + data.image.group + "/loading/" + data.key + "_0.jpg";
	document.getElementById("championImg"+getChampionsImgsUrl.arguments[1]).alt= data.name + " image";
}

function getQueueName(){
	for(var i = 0; i < data.queues.length; i++){
		if (data.queues[i].gameQueueConfigId == getQueueName.arguments[1]) {
			queueMapServer.innerHTML = data.queues[i].name;
		}
	}
}

function getMapName(){
	for(var i = 0; i < data.maps.length; i++){
		if (data.maps[i].mapId == getMapName.arguments[1]) {
			queueMapServer.innerHTML += " · " + data.maps[i].name;
		}
	}
}

function getServerName(){
	queueMapServer.innerHTML += " · " + data.name;
}

function getTheJson(url, callback, errorMessage, parameter1, parameter2, parameter3){ 
	/*the parameters of this function are
	url: the url of the json
	callback: the next function to call with the json as response, if callback is null the json will be returned to the function who has called this function.
	errorMessage: the Message in case of error
	parameters: optional parameters in case the callback function needs them*/
	var request = new XMLHttpRequest();
	request.onreadystatechange = function (){
		if(request.readyState == 4 && request.status == 200){
			if(isJson(request.responseText)){
				data = JSON.parse(request.responseText);
				callback(data, parameter1, parameter2, parameter3);
			} else{
				if(errorMessage=="noRankedGamesPlayedWithCurrentChampion"){
					zeroGamesPlayed(parameter1);
				} else{
					if (errorMessage=="noGamesPlayed") {
						document.getElementById("mains"+parameter1).innerHTML = "-";
					} else {
						alert(errorMessage);
					}
				}
			}
		}
	}
	request.open("GET", url, true);
	request.send();
}

function zeroGamesPlayed(i){
	document.getElementById("winLoss"+i).innerHTML = "0 / 0 (0.0%)";
	document.getElementById("winLoss"+i).classList.add("statisticYellow");
	document.getElementById("kills"+i).innerHTML = "0.0 (+0.0)";
	document.getElementById("kills"+i).classList.add("statisticYellow");
	document.getElementById("deaths"+i).innerHTML = "0.0 (+0.0)";
	document.getElementById("deaths"+i).classList.add("statisticYellow");
	document.getElementById("assists"+i).innerHTML = "0.0 (+0.0)";
	document.getElementById("assists"+i).classList.add("statisticYellow");
	document.getElementById("cs"+i).innerHTML = "0 (+0)";
	document.getElementById("cs"+i).classList.add("statisticYellow");
	summonerLoaded();
}

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

//-----------------------/Riot Api Requests---------------------------------