let moneySum = 0;

const upgradePrices = [
    500, 750, 1500, 2500, 5500, 7500, 15000, 18000, 20000, 25000
];

const upgradeChances = {
    uncommon: [85, 65, 55, 45, 40, 40, 35, 30, 20, 10],
    rare: [85, 60, 50, 35, 35, 30, 30, 25, 15, 6],
    veryrare: [85, 55, 45, 30, 30, 30, 25, 20, 12, 3],
    legendary: [85, 45, 40, 25, 20, 20, 20, 15, 10, 2]
};

function getRandom1to100() {
    return Math.floor(Math.random() * 100) + 1;
}

function getRandom1to20() {
    return Math.floor(Math.random() * 20) + 1;
}

function getChance(stage, rarity) {
    if (!rarity || !upgradeChances[rarity]) return 0;
    return upgradeChances[rarity][stage] || 0;
}

function getSpeaker(msg) {
    let speaker = msg.who;
    const character = getObj('character', msg.playerid);
    if (character) {
        speaker = character.get('name');
    }
    return speaker;
}

function autoUpgradeSafeRoll(msg, price, buff, upgradeStage, weaponRarity) {
    const roll = getRandom1to20();
    const stage = Number(upgradeStage);
    const speaker = getSpeaker(msg);
    
    let output = `<div style="background-color: #2c3e50; color: white; text-align:center; border-radius: 8px; padding: 0; margin: 0;">`;
    output += `<h3 style="padding-top:16px; margin: 0;">Safe Roll (1d20)</h3>`;
    output += `<div style="font-size:48px; font-weight:bold; padding:16px; padding-bottom:16px;">${roll}</div>`;
    
    if (roll === 20) {
        output += `<div style="background-color: #27ae60; padding: 12px; margin: 8px; border-radius: 4px;">`;
        output += `<strong>SUCCESS!</strong><br>Stays at +${stage}`;
        output += `</div>`;
        output += `<div style="padding: 12px;">`;
        output += `[CONTINUE](!autoupgrade ${price} ${buff} ${stage} ${weaponRarity} continue) [STOP](!&#13;UPGRADE +${stage}. TOTAL ${moneySum} GP)`;
        output += `</div>`;
    } else if (roll >= 2 && roll <= 19) {
        const newStage = stage == 0 ? 0 : stage - 1;
        output += `<div style="background-color: #e67e22; padding: 12px; margin: 8px; border-radius: 4px;">`;
        output += `Downgrade from +${stage} to +${newStage}`;
        output += `</div>`;
        output += `<div style="padding: 12px;">`;
        output += `[CONTINUE](!autoupgrade ${price} ${buff} ${newStage} ${weaponRarity} continue) [STOP](!&#13;UPGRADE +${newStage}. TOTAL ${moneySum} GP)`;
        output += `</div>`;
    } else if (roll === 1) {
        let newStage = stage - 2;
        if (stage == 0) newStage = 0;
        else if (stage == 1) newStage = 0;
        output += `<div style="background-color: #c0392b; padding: 12px; margin: 8px; border-radius: 4px;">`;
        output += `<strong>CRITICAL FAIL!</strong><br>Downgrade from +${stage} to +${newStage}`;
        output += `</div>`;
        output += `<div style="padding: 12px;">`;
        output += `[CONTINUE](!autoupgrade ${price} ${buff} ${newStage} ${weaponRarity} continue) [STOP](!&#13;UPGRADE +${newStage}. TOTAL ${moneySum} GP)`;
        output += `</div>`;
    }
    output += `</div></div>`;
    
    sendChat(speaker, output);
}

function autoUpgrade(msg, price, buff, upgradeStage, weaponRarity) {
    const userPrice = Number(price);
    const stage = Number(upgradeStage);
    const speaker = getSpeaker(msg);
    
    if (stage < 0 || stage >= upgradePrices.length) {
        sendChat(speaker, `Upgrade stopped: invalid stage (${stage}).`);
        return;
    }
    const fixPrice = upgradePrices[stage] || 0;
    moneySum += userPrice + fixPrice;
    const chance = getChance(stage, weaponRarity);
    const roll = getRandom1to100();
    const adjustedRoll = roll - buff;

    let output = `<div style="background-color: #34495e; color: white; text-align:center; border-radius: 8px; padding: 0; margin: 0;">`;
    output += `<h3 style="font-size:24px; padding-top:16px; margin: 0; border-bottom: 2px solid #2c3e50; padding-bottom: 8px;">Upgrade +${stage} → +${stage + 1} </h3>`;
    output += `<div style="padding: 12px; background-color: #2c3e50; margin: 8px; border-radius: 4px;">`;
    // output += `<div style="font-size: 18px; margin-bottom: 8px;">+${stage} → +${stage + 1}</div>`;
    output += `<div style="font-size: 14px; color: #ecf0f1;">Cost: ${userPrice + fixPrice} GP</div>`;
    output += `<div style="font-size: 14px; color: #ecf0f1;">Total Spent: ${moneySum} GP</div>`;
    output += `</div>`;
    
    output += `<div style="font-size:36px;padding:16px; padding-bottom:16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 8px; border-radius: 4px;"><strong>${roll}</strong> - ${buff} = <strong>${adjustedRoll}</strong><br></div>`;
    
    output += `<div style="padding: 8px; font-size: 14px;">`;
    // output += `Roll: <strong>${roll}</strong> - ${buff} = <strong>${adjustedRoll}</strong><br>`;
    output += `Success Chance: <strong>${chance}%</strong>`;
    output += `</div>`;

    if (adjustedRoll <= chance) {
        output += `<div style="background-color: #27ae60; padding: 12px; margin: 8px; border-radius: 4px;">`;
        output += `<strong>✓ SUCCESS! ${adjustedRoll} < ${chance}</strong><br>Upgraded to +${stage + 1}`;
        output += `</div>`;
        output += `<div style="padding: 12px;">`;
        output += `[CONTINUE](!autoupgrade ${price} ${buff} ${stage + 1} ${weaponRarity} continue) [STOP](!&#13;UPGRADE +${stage + 1}. TOTAL ${moneySum} GP)`;
        output += `</div>`;
    } else {
        const newStage = stage == 0 ? 0 : stage - 1;
        output += `<div style="background-color: #c0392b; padding: 12px; margin: 8px; border-radius: 4px;">`;
        output += `<strong>✗ FAILED! ${adjustedRoll} > ${chance}</strong><br>Downgraded to +${newStage}`;
        output += `</div>`;
        output += `<div style="padding: 12px;">`;
        output += `[CONTINUE](!autoupgrade ${price} ${buff} ${newStage} ${weaponRarity} continue) [ROLL 1d20](!autoupgradesaferoll ${price} ${buff} ${stage} ${weaponRarity} continue) [STOP](!&#13;UPGRADE +${newStage}. TOTAL ${moneySum} GP)`;
        output += `</div>`;
    }
    output += `</div></div>`;
    
    sendChat(speaker, output);
}

on('ready', function() {
    on("chat:message", msg => {
        if (msg.type !== 'api' || !msg.content.startsWith('!')) return;

        let [command, price, buff, upgradeStage, weaponRarity, continueUpgrade] = msg.content.split(" ");

        if (command === '!autoupgrade' || command === '!upgrade') {
            if (!continueUpgrade) {
                moneySum = 0;
                const speaker = getSpeaker(msg);
                sendChat(speaker, `<div style="text-align:center; font-size:20px; font-weight:bold; padding:16px; background-color:#3498db; color:white; border-radius:8px;"> ${speaker}'s Upgrade Session </div>`);
            }
            if (!price || !buff || !upgradeStage) {
                sendChat(getSpeaker(msg), "Error: Missing parameters. Usage: !autoupgrade [basePrice] [buff] [currentStage] [weaponRarity]");
                return;
            }
            autoUpgrade(msg, price, buff, upgradeStage, weaponRarity);
        } else if (command === '!autoupgradesaferoll' || command === '!upgradesaferoll') { 
            if (!price || !buff || !upgradeStage) {
                sendChat(getSpeaker(msg), "Error: Missing parameters. Usage: !autoupgradesaferoll [basePrice] [buff] [currentStage] [weaponRarity]");
                return;
            }
            autoUpgradeSafeRoll(msg, price, buff, upgradeStage, weaponRarity);
        } else if (command === '!testing') {
            const int = getRandom1to100();
            const speaker = getSpeaker(msg);
            sendChat(speaker, `Random number: ${int}`);
            sendChat(speaker, "Testing command received");
        }
    });
});


let moneySumForge = 0;
let materialSumForge = 0;

const upgradePricesForge = [
    500, 1500, 2500, 4500, 6700
];

const upgradeChancesForge = [10,13,15,16,18];

function getChanceForge(stage) {
    if (!upgradeChancesForge[stage]) return 0;
    return upgradeChancesForge[stage] || 0;
}

function forge(msg, price, buff, upgradeStage) {
    const userPrice = Number(price);
    const stage = Number(upgradeStage);
    const buffNum = Number(buff);
    const speaker = getSpeaker(msg);
    
    if (stage < 0 || stage >= upgradePricesForge.length) {
        sendChat(speaker, `Upgrade stopped: invalid stage (${stage}).`);
        return;
    }
    const fixPrice = upgradePricesForge[stage] || 0;

    moneySumForge += userPrice + fixPrice;
    materialSumForge += (stage+1) *10;

    const chance = getChanceForge(stage);
    const roll = getRandom1to20();
    const adjustedRoll = roll + buffNum;

    let output = `<div style="background-color: #5e3434; color: white; text-align:center; border-radius: 8px; padding: 0; margin: 0; font-family: 'Times New Roman', Times, serif;">`;

    output += `<h3 style="font-size:24px; padding-top:16px; margin: 0; border-bottom: 2px solid #502c2c; padding-bottom: 8px; font-family: 'Times New Roman', Times, serif;">Forge +${stage} → +${stage + 1}</h3>`;

    output += `<div style="padding: 12px; background-color: #502c2c; margin: 8px; border-radius: 4px; font-family: 'Times New Roman', Times, serif;">`;
    output += `<div style="font-size: 14px; color: #ecf0f1;">Cost: ${userPrice + fixPrice} GP</div>`;
    output += `<div style="font-size: 14px; color: #ecf0f1;">Total Spent: ${moneySumForge} GP</div>`;
    output += `<div style="font-size: 14px; color: #ecf0f1;">Material: ${(stage+1) *10} GP</div>`;
    output += `<div style="font-size: 14px; color: #ecf0f1;">Total Material Spent: ${materialSumForge} GP</div>`;
    output += `</div>`;

    output += `<div style="font-size:36px; padding:16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 8px; border-radius: 4px; font-family: 'Times New Roman', Times, serif;"><strong>${roll}</strong> + ${buff} = <strong>${adjustedRoll}</strong><br></div>`;

    output += `<div style="padding: 8px; font-size: 14px; font-family: 'Times New Roman', Times, serif;">`;
    output += `Success Chance: <strong>${chance}</strong>`;
    output += `</div>`;

    if (adjustedRoll >= chance) {
        output += `<div style="background-color: #27ae60; padding: 12px; margin: 8px; border-radius: 4px; font-family: 'Times New Roman', Times, serif;">`;
        output += `<strong>✓ SUCCESS! ${adjustedRoll} >= ${chance}</strong><br>Forged to +${stage + 1}`;
        output += `</div>`;
        output += `<div style="padding: 12px; font-family: 'Times New Roman', Times, serif;">`;
        output += `[CONTINUE](!forge ${price} ${buff} ${stage + 1} continue) [STOP](!&#13;FORGE +${stage + 1}. TOTAL ${moneySumForge} GP. MATERIAL ${materialSumForge})`;
        output += `</div>`;
    } else {
        const newStage = stage == 0 ? 0 : stage;
        output += `<div style="background-color: #c0392b; padding: 12px; margin: 8px; border-radius: 4px; font-family: 'Times New Roman', Times, serif;">`;
        output += `<strong>✗ FAILED! ${adjustedRoll} < ${chance}</strong><br>Remained at +${newStage}`;
        output += `</div>`;
        output += `<div style="padding: 12px; font-family: 'Times New Roman', Times, serif;">`;
        output += `[CONTINUE](!forge ${price} ${buff} ${newStage} continue) [STOP](!&#13;FORGE +${newStage}. TOTAL ${moneySumForge} GP. MATERIAL ${materialSumForge})`;
        output += `</div>`;
    }

    output += `</div></div>`;

    sendChat(speaker, output);
}


on('ready', function() {
    on("chat:message", msg => {
        if (msg.type !== 'api' || !msg.content.startsWith('!')) return;

        let [command, price, buff, upgradeStage, continueUpgrade] = msg.content.split(" ");

        if (command === '!forge') {
            if (!continueUpgrade) {
                moneySumForge = 0;
                materialSumForge = 0;
                const speaker = getSpeaker(msg);
                sendChat(speaker, `<div style="text-align:center; font-size:20px; font-weight:bold; padding:16px; background-color:#3498db; color:white; border-radius:8px;"> ${speaker}'s Forge Session </div>`);
            }
            if (!price || !buff || !upgradeStage) {
                sendChat(getSpeaker(msg), "Error: Missing parameters. Usage: !forge [basePrice] [buff] [startStage]");
                return;
            }
            forge(msg, price, buff, upgradeStage);

        } 
    });
});