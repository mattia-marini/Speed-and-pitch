import { onError, message, register, blacklist_manager } from "../utils/utils_BG.js";

const defaultHosts = "<all_urls>";
var blacklistHost = localStorage.getItem('Xytspch_blacklist');
var cad_isen = localStorage.getItem('Xytspch_isen');
var cad_sett = localStorage.getItem('Xytspch_sett');
var cad_upd = localStorage.getItem('Xytspch_upd');
let local_module_version = localStorage.getItem('Xytspch_version');
var executing = browser.tabs.executeScript({ code: "document.location.reload();" });
var UPD = false;
var plat = navigator.userAgent.toLowerCase();

//get the version of the addon on manifest.json
const manifestData = browser.runtime.getManifest();
const version = manifestData.version;

//console.log("BG Load")
var default_sett = [106, 107, 109, 110, !1, 1, 1, 1.1, 1.1];

if (cad_sett == null) {
  cad_sett = default_sett;
  localStorage.setItem('Xytspch_sett', cad_sett);
  UPD = true;
}

if (local_module_version == null) {
  localStorage.setItem('Xytspch_version', version);
} else if (local_module_version < version) {
  //...
  localStorage.setItem('Xytspch_version', version);
  //UPD = true;
}

if (cad_upd == null) {
  cad_upd = ["nan", 0]; // "xxx" : last version checked, x : 0 = notif not sent, 1 = notif sent 
  localStorage.setItem('Xytspch_upd', cad_upd);
  UPD = true;
}

if (blacklistHost == null) {
  blacklistHost = ["*://developer.mozilla.org/*"];// default domain in the blacklist (MDN), we can't act on this domain anyway
  localStorage.setItem('Xytspch_blacklist', blacklistHost);
  UPD = true;

}

if (cad_isen == null) {
  cad_isen = "no";
  localStorage.setItem('Xytspch_isen', cad_isen);
  UPD = true;
}

if (UPD) {
  browser.runtime.reload();
}

cad_upd = cad_upd.split(",");

//check for update on mozilla addons
//get the version of the addon on the server
let xhr = new XMLHttpRequest();
xhr.open("GET", "https://addons.mozilla.org/api/v3/addons/addon/speed-pitch-changer/", true);
xhr.onreadystatechange = function () {
  //console.log("xhr.readyState: " + xhr.readyState);
  if (xhr.readyState == 4) {
    //console.log("xhr.responseText: " + xhr.responseText);
    let response = JSON.parse(xhr.responseText);
    let serverVersion = response.current_version.version;
    if (version < serverVersion && cad_upd[1] == 0) {
      cad_upd[0] = serverVersion;
      cad_upd[1] = 1;
      localStorage.setItem('Xytspch_upd', cad_upd);
      //console.log("New version available");
      //mettre un badge sur l'icone
      if (!plat.includes("android")) {
        /*pas de badge sur android*/
        try {
          browser.browserAction.setBadgeText({ text: "up" });
          browser.browserAction.setBadgeTextColor({ color: "#fbf0f3" });
          browser.browserAction.setBadgeBackgroundColor({ color: "#5a5f55" });
        } catch (e) {
          console.log(e);
        }
      }

    }
    else if (cad_upd[1] == 1) {
      //if the server version is the same or lower than the local version, reset the update notification
      if (version >= serverVersion) {
        cad_upd[0] = "nan";
        cad_upd[1] = 0;
        localStorage.setItem('Xytspch_upd', cad_upd);
      }
      //do nothing

    }

    else {
      //console.log("No update available");
      cad_upd[0] = "nan";
      cad_upd[1] = 0;
      localStorage.setItem('Xytspch_upd', cad_upd);
    }
  }
}
xhr.send();



var setg = cad_sett.split(',');
var blacklistHost = blacklistHost.split(',');

if (setg.length < 9) {
  //Update settings
  let tmp_rkc = [];
  default_sett.forEach(function (value, index) {
    if (typeof setg[index] == 'undefined') {
      tmp_rkc.push(default_sett[index]);
    }
    else {
      tmp_rkc.push(setg[index]);
    }
    //console.log(tmp_rkc);
  });
  localStorage.setItem('Xytspch_sett', tmp_rkc);
  cad_sett = tmp_rkc;
  console.log("updated !")
  browser.runtime.reload()
}

if (cad_isen == 'yes') {
  //var soundcloud = "*://soundcloud.com/*";
  //var spotify = "*://*.spotify.com/*";
  //console.log(blacklistHost);
  register([defaultHosts], "../utils/utils_CO.js", "document_start", blacklistHost);
  register([defaultHosts], "../utils/ace1.js", "document_start", blacklistHost);
  register([defaultHosts], "../utils/ace2.js", "document_start", blacklistHost);
  register([defaultHosts], "../utils/jungle-use.js", "document_start", blacklistHost);
  //register(["*://www.deezer.com/*"], "../utils/ace1.js", "document_idle", blacklistHost); //deezer
  register([defaultHosts], "../contentScript/main.js", "document_idle", blacklistHost);


}
else {
  if (!plat.includes("android")) {
    /*pas de changement d'icone sur android*/
    browser.browserAction.setIcon({ path: "../icons/border-16d.png" });
  }
}


function topop(value, key) {
  browser.runtime.sendMessage({
    msg: key,
    val: value
  });
}


"use strict";


function sendMessageToTabs(tabs, dom = false) {
  for (let tab of tabs) {
    //console.log("tab");
    if (!dom) {
      browser.tabs.sendMessage(
        tab.id,
        { greeting: "actual_speed" }
      ).then(response => {
        let klp = response.actual_speed;
        let klp2 = response.actual_pitch;
        topop(klp, "pup");
        topop(klp2, "pup2");
      }).catch(onError);
    } else {
      //console.log(tab.url);
      let domain = (tab.url).split("/")[2];
      if (domain && domain.includes(":")) {
        domain = domain.split(":")[0];
      }
      blacklist_manager(blacklistHost, "is_in", domain).then((result) => {
        topop([domain, result], "mDom");
      });
    }

  }
}

function ms(dom = false) {
  var btqz = browser.tabs.query({ currentWindow: true, active: true });
  //console.log(btqz);
  btqz.then((tabs) => {
    sendMessageToTabs(tabs, dom);
  }).catch(onError);

};



function handleMessage(request, sender, sendResponse) {
  //FOR MAIN
  if (request.title == "dm1") {
    sendResponse({ dm1: cad_sett });
  }
  if (request.title == "xpup") {
    let executing = browser.tabs.executeScript({ code: "xpup();", allFrames: true, matchAboutBlank: true });
  }
  if (request.title == "xpdw") {
    let executing = browser.tabs.executeScript({ code: "xpdw();", allFrames: true, matchAboutBlank: true });
  }
  if (request.title == "xpres") {
    let executing = browser.tabs.executeScript({ code: "xpres();", allFrames: true, matchAboutBlank: true });
  }
  if (request.title == "xpdef") {
    let fdef = "zpdef(" + request.data + ");";
    let executing = browser.tabs.executeScript({ code: fdef, allFrames: true, matchAboutBlank: true });
  }

  //FOR POP

  if (request.type == 'act_speed_val') {
    ms();
  }
  if (request.type == 'get_domain') {
    //console.log("get_domain ms");
    ms(true);
  }

  if (request.type == "get_cstt") {
    //renvoie cad_sett en réponse
    cad_sett = localStorage.getItem('Xytspch_sett');
    sendResponse({ cstt: cad_sett });
  }
  if (request.type == "get_isen") {
    //renvoie cad_isen en réponse
    cad_isen = localStorage.getItem('Xytspch_isen');
    sendResponse({ isen: cad_isen });
  }
  if (request.type == "get_upd") {
    //renvoie cad_upd en réponse
    cad_upd = localStorage.getItem('Xytspch_upd');
    sendResponse({ upd: cad_upd });
  }
  if (request.type == "set_cstt") {
    cad_sett = request.val;
    localStorage.setItem('Xytspch_sett', cad_sett);
  }
  if (request.type == "set_isen") {
    cad_isen = request.val;
    localStorage.setItem('Xytspch_isen', cad_isen);
  }
  if (request.type == "get_blacklist") {
    //renvoie blacklistHost en réponse
    sendResponse({ blacklist: blacklist_manager(blacklistHost, "get", null) });
  }
  if (request.type == "set_ban") {
    //ajoute un domaine à la blacklist
    blacklist_manager(blacklistHost, "add", request.val);
    browser.runtime.reload()
  }
  if (request.type == "set_unban") {
    //supprime un domaine de la blacklist
    blacklist_manager(blacklistHost, "del", request.val);
    browser.runtime.reload()
  }
}

browser.runtime.onMessage.addListener(handleMessage);
