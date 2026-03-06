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

    function upgradeSafeRoll(msg, price, buff, upgradeStage, weaponRarity) {
        const stage = Number(upgradeStage);
        const speaker = getSpeaker(msg);
        
        let output = `<div class="sheet-rolltemplate-traits">`;
        output += `<div class="sheet-container" style="background-color: #2c3e50; color: white; text-align:center; border-radius: 8px; padding: 16px;">`;
        output += `<h3 style="margin: 0 0 16px 0;">Safe Roll Required</h3>`;
        output += `<div style="margin-bottom: 12px;">Roll 1d20 manually, then select:</div>`;
        output += `<div style="background-color: #34495e; padding: 12px; border-radius: 4px;">`;
        output += `[20 - Stay](!upgrade ${price} ${buff} ${stage} ${weaponRarity} continue)<br>`;
        output += `[2-19 - Down 1](!upgrade ${price} ${buff} ${stage - 1} ${weaponRarity} continue)<br>`;
        output += `[1 - Down 2](!upgrade ${price} ${buff} ${stage - 2} ${weaponRarity} continue)`;
        output += `</div></div>`;
        
        sendChat(speaker, output);
        sendChat(speaker, `/roll 1d20`);
    }

    function upgrade(msg, price, buff, upgradeStage, weaponRarity) {
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

        let output = `<div style="background-color: #34495e; color: white; text-align:center; border-radius: 8px; padding: 0; margin: 0;">`;
        output += `<h3 style="padding-top:16px; margin: 0; border-bottom: 2px solid #2c3e50; padding-bottom: 8px;">Manual Upgrade</h3>`;
        output += `<div style="padding: 12px; background-color: #2c3e50; margin: 8px; border-radius: 4px;">`;
        output += `<div style="font-size: 18px; margin-bottom: 8px;">+${stage} → +${stage + 1}</div>`;
        output += `<div style="font-size: 14px; color: #ecf0f1;">Cost: ${userPrice + fixPrice} GP</div>`;
        output += `<div style="font-size: 14px; color: #ecf0f1;">Total Spent: ${moneySum} GP</div>`;
        output += `<div style="font-size: 14px; color: #ecf0f1; margin-top: 8px;">Success Chance: <strong>${chance}%</strong></div>`;
        output += `</div>`;
        
        output += `<div style="padding: 12px; background-color: #2c3e50; margin: 8px; border-radius: 4px;">`;
        output += `Roll 1d100 - ${buff}, then select:`;
        output += `</div>`;
        
        output += `<div style="padding: 12px;">`;
        output += `[Success](!upgrade ${price} ${buff} ${stage + 1} ${weaponRarity} continue)<br>`;
        output += `[Fail](!upgrade ${price} ${buff} ${stage - 1} ${weaponRarity} continue)<br>`;
        output += `[Fail - Safe Roll](!upgradesafe ${price} ${buff} ${stage} ${weaponRarity} continue)`;
        output += `</div>`;
        output += `</div></div>`;
        
        sendChat(speaker, output);
        sendChat(speaker, `/roll 1d100 - ${buff}`);
    }

    on('ready', function() {
        on("chat:message", msg => {
            if (msg.type !== 'api' || !msg.content.startsWith('!')) return;

            let [command, price, buff, upgradeStage, weaponRarity, continueUpgrade] = msg.content.split(" ");

            if (command === '!upgrade') {
                if (!continueUpgrade) {
                    moneySum = 0;
                    const speaker = getSpeaker(msg);
                    sendChat(speaker, `<div style="text-align:center; font-size:20px; font-weight:bold; padding:16px; background-color:#3498db; color:white; border-radius:8px;"> ${speaker}'s Upgrade Session </div>`);
                }
                if (!price || !buff || !upgradeStage) {
                    sendChat(getSpeaker(msg), "Error: Missing parameters. Usage: !upgrade [basePrice] [buff] [startStage] [weaponRarity]");
                    return;
                }
                upgrade(msg, price, buff, upgradeStage, weaponRarity);
            } else if (command === '!upgradesafe') {
                if (!price || !buff || !upgradeStage) {
                    sendChat(getSpeaker(msg), "Error: Missing parameters. Usage: !upgradesafe [basePrice] [buff] [currentStage] [weaponRarity]");
                    return;
                }
                upgradeSafeRoll(msg, price, buff, upgradeStage, weaponRarity);
            } else if (command === '!autoupgrade') {
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
            } else if (command === '!autoupgradesaferoll') { 
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