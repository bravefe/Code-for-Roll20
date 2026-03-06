on('chat:message', function(msg) {

    if(msg.type === "api" && !msg.rolltemplate) {
        var params = msg.content.substring(1).split(" ");
        var command = params[0].toLowerCase();
        var option = params[1] ? params[1].toLowerCase() : false;
        
        if(command === "burnoutdice") {
            handleapicommand(msg, command, option);
        }
    }
    else if(msg.playerid.toLowerCase() != "api" && msg.rolltemplate) {
        var cnamebase = msg.content.split("charname=")[1];
        var cname = cnamebase ? cnamebase.replace('}}','').trim() : (msg.content.split("{{name=")[1]||'').split("}}")[0].trim();
        var player = getObj("player", msg.playerid);
        var character = undefined;
        
        if (cname) {        
            var list = findObjs({name: cname, type: 'character'},{caseInsensitive: true});
            if (list != undefined){
                if (list.length > 1){
                    log('Duplicate character names, process cancelled');
                    return;
                }
            }
            character = list[0];
        }
        
        if(["dmg","atkdmg"].indexOf(msg.rolltemplate) > -1) {
            if(_.has(msg,'inlinerolls') && msg.content.indexOf("{{spelllevel=") > -1 && msg.content.indexOf("{{spelllevel=}}") === -1 && character && state.BurnoutDiceSystem && state.BurnoutDiceSystem.enabled != "off") {
                handleSpellFromAttack(msg, character, player);
            }
        }
        
        if(["spell"].indexOf(msg.rolltemplate) > -1) {
            if(msg.content.indexOf("{{level=") > -1 && character && state.BurnoutDiceSystem && state.BurnoutDiceSystem.enabled != "off") {
                handleSpellFromSpell(msg, character, player);
            }
        }
    }
});


var handleapicommand = function(msg, command, option) {
    if(!state.BurnoutDiceSystem) {
        state.BurnoutDiceSystem = {};
    }

    if(option && (option === "on" || option === "off")) {
        state.BurnoutDiceSystem.enabled = option;
    }

    else {
        state.BurnoutDiceSystem.enabled = !state.BurnoutDiceSystem.enabled || state.BurnoutDiceSystem.enabled != "on" ? "on" : "off";
    }
    
    sendChat(msg.who, "<div class='sheet-rolltemplate-desc'><div class='sheet-desc'><div class='sheet-label' style='margin-top:5px;'><span style='display:block;'>Burnout Dice System: " + state.BurnoutDiceSystem.enabled + "</span></div></div></div>");
};


var handleSpellFromAttack = function(msg, character, player) {
    var spelllevel = (msg.content.split("{{spelllevel=")[1]||'').split("}}")[0];
    var innate = msg.content.indexOf("{{innate=}}") > -1 ? false : true;
    
    if(spelllevel === "cantrip" || spelllevel === "npc" || innate) {
        return;
    }
    handleBurnoutDice(msg, character, player, spellslot, spellname);

    var hlinline = (msg.content.split("{{hldmg=$[[")[1]||"").split("]]")[0];
    var higherlevel = 0;
    if(hlinline != "") {
        higherlevel = (msg.inlinerolls[hlinline].expression.split("*")[1]||'').split(")")[0];
    }
    
    var spellslot = parseInt(spelllevel, 10) + parseInt(higherlevel, 10);
    

    var spellname = (msg.content.split("{{rname=")[1]||'').split("}}")[0] || "Spell";
    
    handleBurnoutDice(msg, character, player, spellslot, spellname);
};


var handleSpellFromSpell = function(msg, character, player) {
    var spellslot = ((msg.content.split("{{level=")[1]||'').split("}}")[0]||'').split(" ")[1];
    var ritual = msg.content.indexOf("{{ritual=1}}") > -1 ? true : false;
    var innate = msg.content.indexOf("{{innate=}}") > -1 ? false : true;
    
    if(spellslot === "0" || spellslot === "cantrip" || spellslot === "npc" || ritual || innate) {
        return;
    }

    var spellname = (msg.content.split("{{name=")[1]||'').split("}}")[0] || "Spell";
    
    handleBurnoutDice(msg, character, player, spellslot, spellname);
};



var handleBurnoutDice = function(msg, character, player, spellslot, spellname) {
    var characterName = character.get("name");
    

    var burnoutResources = filterObjs(function(obj) {
        if(obj.get("type") === "attribute" && 
           obj.get("characterid") === character.id && 
           (obj.get("current") + "").toLowerCase() === "burnout dice" && 
           obj.get("name").indexOf("resource") > -1 && 
           obj.get("name").indexOf("_name") > -1) {
            return true;
        }
        else return false;
    });
    

    if(!burnoutResources[0]) {
        return;
    }
    
    var resname = burnoutResources[0].get("name").replace("_name","");
    var burnoutDice = findObjs({type: 'attribute', characterid: character.id, name: resname}, {caseInsensitive: true})[0];
    
    if(!burnoutDice) {
        return;
    }
    
    var burnoutValue = parseInt(burnoutDice.get("current"), 10);
    
    if(burnoutValue <= 0) {
        sendChat(msg.who, "<div class='sheet-rolltemplate-simple'><div class='sheet-container'><div class='sheet-label' style='margin-top:5px;'>" +
            "<span style='display:block;'><strong>" + characterName + "</strong></span>" +
            "<span style='display:block; color:#E74C3C;'>0</span>" +
            "</div></div></div>");
        return;
    }
    
    // Roll 1d(burnout value)
    var rollResult = randomInteger(burnoutValue);
    
    var outputMessage = "<div class='sheet-rolltemplate-simple'><div class='sheet-container'><div class='sheet-label' style='margin-top:5px;'>" 
                        // +  "<span style='display:block;'><strong>" + characterName + "</strong> cast <strong>" + spellname + "</strong></span>"
                        ;
    

    if(rollResult === 1 || rollResult === 2) {
        var newBurnoutValue = Math.max(burnoutValue - 2, 4);
        burnoutDice.set({current: newBurnoutValue});
        
        var consequenceRoll = randomInteger(100);
        // var consequenceRoll = 98;
        var consequenceResult = getConsequence(consequenceRoll, spellslot, character);
        
        outputMessage += "<span style='display:block; font-weight:bold; margin-top:5px;'>1d" + burnoutValue + " = " + rollResult + "</span>" +
            "<span style='display:block; color:#E74C3C;'>Burnout Dice: " + burnoutValue + " → " + newBurnoutValue + "</span>" +
            "<hr style='margin: 5px 0; border-color:#E74C3C;'>" +
            "<span style='display:block; font-weight:bold;'>1d100 = " + consequenceRoll + "</span>" +
            "<span style='display:block; " + (consequenceResult.color ? "color:" + consequenceResult.color + ";" : "") + "'>" + consequenceResult.message + "</span>";
    } else {
        outputMessage += "<span style='display:block; color:#2ECC71; margin-top:5px;'>1d" + burnoutValue + " = " + rollResult + "</span>" +
            "<span style='display:block;'>Burnout Dice: " + burnoutValue + "</span>";
    }
    
    outputMessage += "</div></div></div>";
    
    sendChat(msg.who, outputMessage);
};


var getConsequence = function(roll, spellLevel, character) {
    var result = {message: "", color: "#E74C3C"};
    
    if(roll >= 1 && roll <= 5) {

        var hitDice = findObjs({type: 'attribute', characterid: character.id, name: "hit_dice"}, {caseInsensitive: true})[0];
        if(hitDice) {
            var current = parseInt(hitDice.get("current"), 10);
            hitDice.set({current: Math.max(current - spellLevel, 0)});
        }
        result.message = "DRAINED: Lost " + spellLevel + " hit dice. (spell level)";
    }
    else if(roll >= 6 && roll <= 15) {

        var loss = Math.floor(spellLevel / 2);
        var hitDice = findObjs({type: 'attribute', characterid: character.id, name: "hit_dice"}, {caseInsensitive: true})[0];
        if(hitDice) {
            var current = parseInt(hitDice.get("current"), 10);
            hitDice.set({current: Math.max(current - loss, 0)});
        }
        result.message = "REDUCED: Lost " + loss + " hit dice. (spellLevel / 2)";
    }
    else if(roll >= 16 && roll <= 40) {

        var loss = spellLevel * 4;
        var hp = findObjs({type: 'attribute', characterid: character.id, name: "hp"}, {caseInsensitive: true})[0];
        if(hp) {
            var current = parseInt(hp.get("current"), 10);
            hp.set({current: current - loss});
        }
        result.message = "SHOCKED: Lost " + loss + " hit points. (spell level × 4)";
    }
    else if(roll >= 41 && roll <= 88) {

        var loss = spellLevel * 2;
        var hp = findObjs({type: 'attribute', characterid: character.id, name: "hp"}, {caseInsensitive: true})[0];
        if(hp) {
            var current = parseInt(hp.get("current"), 10);
            hp.set({current: current - loss});
        }
        result.message = "HURT: Lost " + loss + " hit points. (spell level × 2)";
    }
    else if(roll >= 89 && roll <= 93) {
        // Blackout: You have disadvantage when casting spells for (spell level) rounds
        result.message = "BLACKOUT: Disadvantage on spell casting for " + spellLevel + " rounds.";
    }
    else if(roll === 94) {

        var burnoutResources = filterObjs(function(obj) {
            if(obj.get("type") === "attribute" && 
               obj.get("characterid") === character.id && 
               (obj.get("current") + "").toLowerCase() === "burnout dice" && 
               obj.get("name").indexOf("resource") > -1 && 
               obj.get("name").indexOf("_name") > -1) {
                return true;
            }
            else return false;
        });
        if(burnoutResources[0]) {
            var resname = burnoutResources[0].get("name").replace("_name","");
            var burnoutDice = findObjs({type: 'attribute', characterid: character.id, name: resname}, {caseInsensitive: true})[0];
            if(burnoutDice) {
                burnoutDice.set({current: 4});
            }
        }
        result.message = "IMMOLATED: Burnout die shrunk to d4!";
    }
    else if(roll === 95) {
        var charslot = findObjs({type: 'attribute', characterid: character.id, name: "lvl" + spellLevel + "_slots_expended"}, {caseInsensitive: true})[0];
        if(charslot) {
            var current = parseInt(charslot.get("current"), 10);
            charslot.set({current: current + 1});
        }
        result.message = "GIFTED: Regained spell slot level " + spellLevel + "!";
        result.color = "#2ECC71";
    }
    else if(roll === 96) {
        var hitDice = findObjs({type: 'attribute', characterid: character.id, name: "hit_dice"}, {caseInsensitive: true})[0];
        if(hitDice) {
            var current = parseInt(hitDice.get("current"), 10);
            var max = parseInt(hitDice.get("max"), 10);
            hitDice.set({current: Math.min(current + spellLevel, max)});
        }
        result.message = "RENEWED: Regained " + spellLevel + " hit dice! (spell level)";
        result.color = "#2ECC71";
    }
    else if(roll === 97) {
        var gain = spellLevel * 4;
        var hp = findObjs({type: 'attribute', characterid: character.id, name: "hp"}, {caseInsensitive: true})[0];
        var maxhp = getAttrByName(character.id, "hp", "max");
        if(hp && maxhp) {
            var current = parseInt(hp.get("current"), 10);
            hp.set({current: Math.max(current + gain, 0)});
        }
        result.message = "HEALED: Gained " + gain + " hit points! (spell level × 4)";
        result.color = "#2ECC71";
    }
    else if(roll === 98) {
        var gain = spellLevel * 4;
        var hp = findObjs({type: 'attribute', characterid: character.id, name: "hp"}, {caseInsensitive: true})[0];
        var maxhp = getAttrByName(character.id, "hp", "max");
        if(hp && maxhp) {
            // var max = parseInt(maxhp, 10);
            // hp.set({max: Math.max(max + gain, 0)});
            var current = parseInt(hp.get("current"), 10);
            hp.set({current: Math.max(current + gain, 0)});
        }
        result.message = "PROTECTED: Gained " + gain + " temporary hit points! (spell level × 4) ";
        result.color = "#2ECC71";
    }
    else if(roll === 99) {
        result.message = "ENERGIZED: Advantage on spell casting for " + spellLevel + " rounds!";
        result.color = "#2ECC71";
    }
    else if(roll === 100) {
        var burnoutResources = filterObjs(function(obj) {
            if(obj.get("type") === "attribute" && 
               obj.get("characterid") === character.id && 
               (obj.get("current") + "").toLowerCase() === "burnout dice" && 
               obj.get("name").indexOf("resource") > -1 && 
               obj.get("name").indexOf("_name") > -1) {
                return true;
            }
            else return false;
        });
        if(burnoutResources[0]) {
            var resname = burnoutResources[0].get("name").replace("_name","");
            var burnoutDice = findObjs({type: 'attribute', characterid: character.id, name: resname}, {caseInsensitive: true})[0];
            if(burnoutDice) {
                burnoutDice.set({current: 12});
            }
        }
        result.message = "RESTORED: Burnout die reset to d12!";
        result.color = "#FFD700";
    }
    
    return result;
};

on('ready', function() {
    if(!state.BurnoutDiceSystem) {
        state.BurnoutDiceSystem = {};
    }
    if(!state.BurnoutDiceSystem.enabled) {
        state.BurnoutDiceSystem.enabled = "on";
    }
    log("Burnout Dice System Loaded - Status: " + state.BurnoutDiceSystem.enabled);
});