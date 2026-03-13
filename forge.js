let moneySumForge = 0;
let materialSumForge = 0;

    const upgradePricesForge = [
        500, 1500, 2500, 4500, 6700
    ];

    const upgradeChancesForge = [10,13,15,16,18];

    // function getRandom1to20() {
    //     return Math.floor(Math.random() * 20) + 1;
    // }

    function getChanceForge(stage) {
        if (!upgradeChancesForge[stage]) return 0;
        return upgradeChancesForge[stage] || 0;
    }

    // function getSpeaker(msg) {
    //     let speaker = msg.who;
    //     const character = getObj('character', msg.playerid);
    //     if (character) {
    //         speaker = character.get('name');
    //     }
    //     return speaker;
    // }

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

        let output = `<div style="background-color: #34495e; color: white; text-align:center; border-radius: 8px; padding: 0; margin: 0;">`;
        output += `<h3 style="font-size:24px; padding-top:16px; margin: 0; border-bottom: 2px solid #2c3e50; padding-bottom: 8px;">Forge +${stage} → +${stage + 1} </h3>`;
        output += `<div style="padding: 12px; background-color: #2c3e50; margin: 8px; border-radius: 4px;">`;
        output += `<div style="font-size: 14px; color: #ecf0f1;">Cost: ${userPrice + fixPrice} GP</div>`;
        output += `<div style="font-size: 14px; color: #ecf0f1;">Total Spent: ${moneySumForge} GP</div>`;
        output += `<div style="font-size: 14px; color: #ecf0f1;">Material: ${(stage+1) *10} GP</div>`;
        output += `<div style="font-size: 14px; color: #ecf0f1;">Total Material Spent: ${materialSumForge} GP</div>`;
        output += `</div>`;
        
        output += `<div style="font-size:36px;padding:16px; padding-bottom:16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 8px; border-radius: 4px;"><strong>${roll}</strong> + ${buff} = <strong>${adjustedRoll}</strong><br></div>`;
        
        output += `<div style="padding: 8px; font-size: 14px;">`;
        output += `Success Chance: <strong>${chance}</strong>`;
        output += `</div>`;

        if (adjustedRoll >= chance) {
            output += `<div style="background-color: #27ae60; padding: 12px; margin: 8px; border-radius: 4px;">`;
            output += `<strong>✓ SUCCESS! ${adjustedRoll} >= ${chance}</strong><br>Forged to +${stage + 1}`;
            output += `</div>`;
            output += `<div style="padding: 12px;">`;
            output += `[CONTINUE](!forge ${price} ${buff} ${stage + 1} continue) [STOP](!&#13;FORGE +${stage + 1}. TOTAL ${moneySumForge} GP. MATERIAL ${materialSumForge})`;
            output += `</div>`;
        } else {
            const newStage = stage == 0 ? 0 : stage;
            output += `<div style="background-color: #c0392b; padding: 12px; margin: 8px; border-radius: 4px;">`;
            output += `<strong>✗ FAILED! ${adjustedRoll} < ${chance}</strong><br>Downgraded to +${newStage}`;
            output += `</div>`;
            output += `<div style="padding: 12px;">`;
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
                    const speaker = getSpeaker(msg);
                    sendChat(speaker, `<div style="text-align:center; font-size:20px; font-weight:bold; padding:16px; background-color:#3498db; color:white; border-radius:8px;"> ${speaker}'s Upgrade Session </div>`);
                }
                if (!price || !buff || !upgradeStage) {
                    sendChat(getSpeaker(msg), "Error: Missing parameters. Usage: !upgrade [basePrice] [buff] [startStage]");
                    return;
                }
                forge(msg, price, buff, upgradeStage);

            } 
        });
    });