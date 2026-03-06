let roulBet = [];
const redNumbers = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
const blackNumbers = [2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35];

let playerMoney = {}; // Track player balances

on('chat:message', function(msg) {
    if (msg.type !== 'api') return;
    let args = msg.content.split(' ');
    // let [command, betAmount, bet] = msg.content.split(" ");
    if ((args[0] === '!roulette') && args.length === 1) {
        // roulBet = []; 
        let output = '<div class="sheet-rolltemplate-traits" style="width:240px;">';
        
        output += '<div class="sheet-container" style="background-color: green; color: white;">';
        output += '<h3 style="text-align:center; padding-top:16px;">Roulette</h3>';

        output += '<div style="display:flex; justify-content:center; padding-top:8px; padding-bottom:16px;">';
        output += '<table style="margin:auto; border-collapse:collapse;">';

        output += '<tr><td colspan="1"></td><td colspan="3" style="text-align:center; background-color:green; color:white; border:1px solid #fff;">[&nbsp;&nbsp;&nbsp;0&nbsp;&nbsp;&nbsp;](!roulette 0)</td></tr>';

        for(let row=0; row<12; row++) {
            output += '<tr>';
            if (row === 0) {
                output += '<td rowspan="4" style="background-color:green; color:white; text-align:center; border:1px solid #fff;">[1<br>-<br>12](!roulette ?{Amount to bet} 1-12)</td>';
            } else if (row === 4) {
                output += '<td rowspan="4" style="background-color:green; color:white; text-align:center; border:1px solid #fff;">[13<br>-<br>24](!roulette ?{Amount to bet} 13-24)</td>';
            } else if (row === 8) {
                output += '<td rowspan="4" style="background-color:green; color:white; text-align:center; border:1px solid #fff;">[25<br>-<br>36](!roulette ?{Amount to bet} 25-36)</td>';
            }
            for(let col=0; col<3; col++) {
                let num = 3*(row) + (1+col);
                let bg = '';
                let color = 'white';
                if (redNumbers.includes(num)) bg = 'red';
                else if (blackNumbers.includes(num)) bg = 'black';
                output += `<td style="padding:4px; text-align:center; background-color:${bg}; color:${color}; border:1px solid #fff;">[${num}](!roulette ?{Amount to bet} ${num})</td>`;
            }

            output += `<td style="padding:4px; text-align:center; background-color:green; color:white; border:1px solid #fff;">[${3*row + 1}-${3*row + 3}](!roulette ?{Amount to bet} ${3*row + 1}-${3*row + 3})</td>`;
            
            output += '</tr>';
        }
        output += '</table>';
        output += '</div>';

        output += '<div style="display:flex; justify-content:center; padding-top:8px; padding-bottom:16px;">';
        output += '<table style="margin:auto; border-collapse:collapse;">';
        output += '<tr>';
        output += '<td colspan="5" style="width:200px; padding:4px; background-color:green; color:white; text-align:center;">[0+1+2](!roulette ?{Amount to bet} 0+1+2)&nbsp;&nbsp;&nbsp;&nbsp;[0+2+3](!roulette ?{Amount to bet} 0+2+3)</td>';
        output += '</tr>';
        output += '<tr><td colspan="1"></td><td colspan="3" style="text-align:center; background-color:green; color:white; border:1px solid #fff;">[&nbsp;&nbsp;&nbsp;0&nbsp;&nbsp;&nbsp;](!roulette 0)</td><td rowspan="2" style="background-color:green; color:white; text-align:center; border:1px solid #fff;">[0<br>-<br>3](!roulette ?{Amount to bet} 0-3)</td></tr>';
        
        for(let row=0; row<12; row++) {
            output += '<tr>';
            if (row === 0) {
                output += '<td rowspan="2" style="background-color:green; color:white; text-align:center; border:1px solid #fff;">[1<br>-<br>6](!roulette ?{Amount to bet} 1-6)</td>';
            } else if (row === 2) {
                output += '<td rowspan="2" style="background-color:green; color:white; text-align:center; border:1px solid #fff;">[7<br>-<br>12](!roulette ?{Amount to bet} 7-12)</td>';
            } else if (row === 4) {
                output += '<td rowspan="2" style="background-color:green; color:white; text-align:center; border:1px solid #fff;">[13<br>-<br>18](!roulette ?{Amount to bet} 13-18)</td>';
            } else if (row === 6) {
                output += '<td rowspan="2" style="background-color:green; color:white; text-align:center; border:1px solid #fff;">[19<br>-<br>24](!roulette ?{Amount to bet} 19-24)</td>';
            } else if (row === 8) {  
                output += '<td rowspan="2" style="background-color:green; color:white; text-align:center; border:1px solid #fff;">[25<br>-<br>30](!roulette ?{Amount to bet} 25-30)</td>';
            } else if (row === 10) {
                output += '<td rowspan="2" style="background-color:green; color:white; text-align:center; border:1px solid #fff;">[30<br>-<br>36](!roulette ?{Amount to bet} 30-36)</td>';
            }
            if (row % 2 === 0) {
                for(let col=0; col<3; col++) {
                    let num = 3*(row) + (1+col);
                    let bg = '';
                    let color = 'white';
                    if (redNumbers.includes(num)) bg = 'red';
                    else if (blackNumbers.includes(num)) bg = 'black';
                    output += `<td rowspan="2" style="padding:4px; text-align:center; background-color:${bg}; color:${color}; border:1px solid #fff;">[${num}<br>+<br>${num+3}](!roulette ?{Amount to bet} ${num})</td>`;
                }
            }
            if (row === 1) {
                output += '<td rowspan="2" style="padding:4px; background-color:green; color:white; text-align:center; border:1px solid #fff;">[4<br>-<br>9](!roulette ?{Amount to bet} 4-9)</td>';
            } else if (row === 3) {
                output += '<td rowspan="2" style="padding:4px; background-color:green; color:white; text-align:center; border:1px solid #fff;">[10<br>-<br>15](!roulette ?{Amount to bet} 10-15)</td>';
            } else if (row === 5) {
                output += '<td rowspan="2" style="padding:4px; background-color:green; color:white; text-align:center; border:1px solid #fff;">[16<br>-<br>21](!roulette ?{Amount to bet} 16-21)</td>';
            } else if (row === 7) {
                output += '<td rowspan="2" style="padding:4px; background-color:green; color:white; text-align:center; border:1px solid #fff;">[22<br>-<br>27](!roulette ?{Amount to bet} 22-27)</td>';
            } else if (row === 9) {  
                output += '<td rowspan="2" style="background-color:green; color:white; text-align:center; border:1px solid #fff;">[28<br>-<br>33](!roulette ?{Amount to bet} 28-33)</td>';
            } 
            // output += `<td style="padding:4px; text-align:center; background-color:green; color:white; border:1px solid #fff;">[${3*row + 1}-${3*row + 3}](!roulette ?{Amount to bet} ${3*row + 1}-${3*row + 3})</td>`;
            
            output += '</tr>';
        }
        output += '<tr>';
        output += '<td colspan="1"></td>';
        output += '<td colspan="1" style="padding:4px; background-color:green; color:white; text-align:center; border:1px solid #fff;">[R1](!roulette ?{Amount to bet} row1)</td>';
        output += '<td colspan="1" style="padding:4px; background-color:green; color:white; text-align:center; border:1px solid #fff;">[R2](!roulette ?{Amount to bet} row2)</td>';
        output += '<td colspan="1" style="padding:4px; background-color:green; color:white; text-align:center; border:1px solid #fff;">[R3](!roulette ?{Amount to bet} row3)</td>';
        output += '</tr>';
        
        output += '</table>';
        output += '</div>';

        output += '<div style="display:flex; justify-content:center; padding-top:8px; padding-bottom:16px;">';
        output += '<table style="margin:auto; border-collapse:collapse;">';
        
        output += '<tr>';
        output += `<td colspan="1" style="padding:4px; text-align:center; background-color:green;">[0+1](!roulette ?{Amount to bet} 0+1)</td>`;
        output += `<td colspan="1" style="padding:4px; text-align:center; background-color:green;">[0+3](!roulette ?{Amount to bet} 0+3)</td>`;
        output += `<td colspan="1" style="padding:4px; text-align:center; background-color:green;">[0+2](!roulette ?{Amount to bet} 0+2)</td>`;
        output += '</tr>';
        // output += '<tr>';
        // output += `<td colspan="2" style="padding:4px; text-align:center; background-color:green;">[$0+2](!roulette ?{Amount to bet} 0+2)</td>`;
        // output += '</tr>';
        // output += '<tr>';
        // output += `<td colspan="2" style="padding:4px; text-align:center; background-color:green;">[$0+3](!roulette ?{Amount to bet} 0+3)</td>`;
        // output += '</tr>';

        for(let row=0; row<12; row++) {
            output += '<tr>';
            for(let col=0; col<2; col++) {
                let num = 3*(row) + (1+col);
                let bg = 'green';
                let color = 'white';
                output += `<td style="padding:4px; text-align:center; background-color:${bg}; color:${color}; border:1px solid #fff;">[${num}<br>${num+1}](!roulette ?{Amount to bet} ${num}+${num+1})</td>`;
                if (row != 11)
                {output += `<td style="padding:4px; text-align:center; background-color:black; color:${color}; border:1px solid #fff;">[${num}+${num+1}<br>${num+3}+${num+4}](!roulette ?{Amount to bet} ${num}+${num+1}+${num+3}+${num+4})</td>`;}
                else
                {output += `<td style="padding:4px; text-align:center; background-color:black; color:${color}; border:1px solid #fff;"></td>`;}
            }
            output += '</tr>';
            // output += '<tr>';
            // for(let col=0; col<2; col++) {
            //     let num = 3*(row) + (1+col);
            //     let bg = 'green';
            //     let color = 'white';
            //     output += `<td style="padding:4px; text-align:center; background-color:${bg}; color:${color}; border:1px solid #fff;">[${num}+${num+1}<br>${num+3}+${num+4}](!roulette ?{Amount to bet} ${num}+${num+1}+${num+3}+${num+4})</td>`;
            // }
            // output += '</tr>';
        }
        
        output += '</table>';
        output += '</div>';

        output += '<div style="display:flex; justify-content:center; padding-top:8px; padding-bottom:16px;">';
        output += '<table style="margin:auto; border-collapse:collapse;">';

        output += '<tr>';
        output += '<td colspan="5" style="width:200px; padding:4px; background-color:red; color:white; text-align:center; border:1px solid #fff;">[RED](!roulette ?{Amount to bet} red)</td>';
        output += '</tr>';

        output += '<tr>';
        output += '<td colspan="5" style="width:200px; padding:4px; background-color:black; color:white; text-align:center; border:1px solid #fff;">[BLACK](!roulette ?{Amount to bet} black)</td>';
        output += '</tr>';

        output += '<tr>';
        output += '<td colspan="5" style="width:200px; text-align:center; padding:4px; background-color:green; color:white; border:1px solid #fff;">[EVEN](!roulette ?{Amount to bet} even)</td>';
        output += '</tr>';

        output += '<tr>';
        output += '<td colspan="5" style="width:200px; text-align:center; padding:4px; background-color:green; color:white; border:1px solid #fff;">[ODD](!roulette ?{Amount to bet} odd)</td>';
        output += '</tr>';

        output += '</table>';
        output += '</div>';
        
        output += '<div style="display:flex; justify-content:center; padding-top:8px; padding-bottom:16px;">';
        output += '<table style="margin:auto; border-collapse:collapse;">';

        output += '<tr>';
        output += '<td colspan="5" style="width:200px; padding:4px; background-color:#e6007a; color:white; text-align:center; border:1px solid #fff;">[BETS RECORD](!record)</td>';
        output += '</tr>';
        output += '<tr>';
        output += '<td colspan="5" style="width:200px; padding:4px; background-color:#e6007a; color:white; text-align:center; border:1px solid #fff;">[ROLL 1d37](!roll)</td>';
        output += '</tr>';   
        output += '<tr>';
        output += '<td colspan="5" style="width:200px; padding:4px; background-color:#e6007a; color:white; text-align:center; border:1px solid #fff;">[AUTO ROLL](!autoroll)</td>';
        output += '</tr>';   

        output += '</table>';
        output += '</div></div></div>';

        sendChat('', output);
    }
    else if ((args[0] === '!roulette')) {
        const betAmount = parseInt(args[1]);
        const betNum = args[2];
        // if (!playerMoney[msg.who]) playerMoney[msg.who] = 1000;
        // if (playerMoney[msg.who] < betAmount) {
        //     sendChat('', `${msg.who} does not have enough money!`);
        //     return;
        // }
        if (playerMoney[msg.who] === undefined) playerMoney[msg.who] = 0;
        playerMoney[msg.who] -= betAmount;

        roulBet.push({
            player: msg.who,
            amount: betAmount,
            bet: betNum,
        });
        sendChat('', ` ${msg.who} bet <b>${betAmount}</b> on <b>${betNum}</b>`);
        return;
    } 
    else if ((args[0] === '!record')) {
        if (roulBet.length === 0) {
            sendChat('', 'No bets.');
            return;
        }
        let output = '<div class="sheet-rolltemplate-traits" style="width:230px;">';
        output += '<div class="sheet-container" style="background-color: black; color: white;">';
        output += '<b>&nbsp;Roulette Bets:</b><br>';
        output += '<table style="width:100%; border-collapse:collapse;">';
        output += '<tr><th style="border:1px solid #fff; padding:2px;">Player</th><th style="border:1px solid #fff; padding:2px;">Amount</th><th style="border:1px solid #fff; padding:2px;">Bet</th></tr>';
        roulBet.forEach(bet => {
            output += `<tr><td style="border:1px solid #fff; padding:2px;">${bet.player}</td><td style="border:1px solid #fff; padding:2px; text-align:center;">${bet.amount}</td><td style="border:1px solid #fff; padding:2px; text-align:center;">${bet.bet}</td></tr>`;
        });
        output += '</table></div></div>';
        sendChat('', output);
        return;
    }
    else if ((args[0] === '!autoroll')) {
        if (roulBet.length === 0) {
            sendChat('', 'No bets.');
            return;
        }
        let roll = randomInteger(37) - 1;
        let color = '';
        if (roll === 0) color = 'green';
        else if (redNumbers.includes(roll)) color = 'red';
        else if (blackNumbers.includes(roll)) color = 'black';

        let output = `<div class="sheet-rolltemplate-traits" style="width:230px;">`;
        output += `<div class="sheet-container" style="background-color: ${color}; color: white; text-align:center;">`;
        output += `<h3 style="padding-top:16px;">Roulette Roll</h3>`;
        output += `<div style="font-size:48px; font-weight:bold; padding:16px; padding-bottom:32px;">${roll}</div>`;
        output += `</div></div>`;

        sendChat('', output);
        sendChat('', `!result ${roll}`);
        return;
    }
    else if ((args[0] === '!roll')) {
        sendChat('', `/roll 1d37`);
        sendChat('', '[ENTER THE ROLL RESULT](!result ?{Enter roll result})');
        return;
    }
    else if ((args[0] === '!result')) {
        const rollResult = parseInt(args[1], 10);
        sendChat('', 'Result: ' + rollResult);

        function isWinningBet(bet, result) {
            // sendChat('', `Checking if bet ${bet} wins against result ${result}`);
            if (!bet) return false;
            if (bet === "red") return redNumbers.includes(result);
            if (bet === "black") return blackNumbers.includes(result);
            if (bet === "even") return result !== 0 && result % 2 === 0;
            if (bet === "odd") return result % 2 === 1;
            if (bet === "low") return result >= 1 && result <= 18;
            if (bet === "high") return result >= 19 && result <= 36;
            if (bet === "row1") return [1,4,7,10,13,16,19,22,25,28,31,34].includes(result);
            if (bet === "row2") return [2,5,8,11,14,17,20,23,26,29,32,35].includes(result);
            if (bet === "row3") return [3,6,9,12,15,18,21,24,27,30,33,36].includes(result);
            if (bet.match(/^\d+$/)) return parseInt(bet,10) === result;
            if (bet.match(/^\d+\-\d+$/)) {
                let [start, end] = bet.split('-').map(Number);
                return result >= start && result <= end;
            }
            if (bet.match(/^\d+(\+\d+)+$/)) {
                let nums = bet.split('+').map(Number);
                return nums.includes(result);
            }
            return false;
        }

        function getPayout(bet) {
            // sendChat('', `Calculating payout for bet: ${bet}`);
            if (bet === "red" || bet === "black" || bet === "even" || bet === "odd" || bet === "low" || bet === "high") return 2;
            if (bet === "row1" || bet === "row2" || bet === "row3") return 3;
            if (bet.match(/^\d+$/)) return 36;
            if (bet.match(/^\d+\+\d+$/)) return 18;
            if (bet.match(/^\d+\+\d+\+\d+$/)) return 12;
            if (bet.match(/^\d+\+\d+\+\d+\+\d+$/)) return 9;
            if (bet.match(/^\d+\+\d+\+\d+\+\d+\+\d+$/)) return 7;
            if (bet.match(/^\d+\+\d+\+\d+\+\d+\+\d+\+\d+$/)) return 6;
            if (bet.match(/^\d+\-\d+$/)) {
                let [start, end] = bet.split('-').map(Number);
                let count = end - start + 1;
                if (count === 12) return 3;
                if (count === 6) return 6;
                if (count === 4) return 9;
                if (count === 3) return 12;
                if (count === 2) return 18;
            }
            return 0;
        }

        // let winners = [];
        roulBet.forEach(bet => {
            if (isWinningBet(bet.bet, rollResult)) {
                let payout = Math.floor(bet.amount * (getPayout(bet.bet) - 1));
                playerMoney[bet.player] += bet.amount + payout;
                sendChat('', `${bet.player} wins <b>${payout}</b> (bet ${bet.bet} for ${bet.amount})`);
                // winners.push(`${bet.player} wins ${bet.amount + payout} (bet ${bet.bet})`);
            }
        });

        let output = '<div class="sheet-rolltemplate-traits" style="width:230px;">';
        output += '<div class="sheet-container" style="background-color: #222; color: white;">';
        output += '<b style="font-size:22px;">&nbsp;Roulette Results:</b><br>';
        output += '<table style="width:100%; border-collapse:collapse; font-size:18px;">';
        output += '<tr><th style="border:1px solid #fff; padding:4px;">Player</th><th style="border:1px solid #fff; padding:4px;">Balance</th></tr>';
        Object.keys(playerMoney).forEach(player => {
            let bal = playerMoney[player];
            let color = bal >= 1 ? 'lime' : (bal < 0 ? 'red' : 'white');
            output += `<tr><td style="border:1px solid #fff; padding:4px;">${player}</td><td style="border:1px solid #fff; padding:4px; color:${color}; text-align:right;">${bal}</td></tr>`;
        });
        output += '</table></div></div>';
        sendChat('', output);

        roulBet = [];
        playerMoney = {};
        return;
    }
});