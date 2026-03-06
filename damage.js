on('chat:message', function(msg) {
    if (msg.type !== 'api') return;
    let args = msg.content.split(' ');
    if ((args[0] === '!damage' || args[0] === '!heal') && args.length === 2) {
        if (!msg.selected || msg.selected.length === 0) {
            return sendChat('API', `Please select one or more tokens.`);
        }
        let amount = parseInt(args[1], 10);
        msg.selected.forEach(sel => {
            let token = getObj('graphic', sel._id);
            if (!token) {
                sendChat('API', `Token not found for ID ${sel._id}.`);
                return;
            }
            let current = parseInt(token.get('bar1_value'), 10) || 0;
            if (args[0] === '!damage') {
                let newHP = Math.max(0, current - amount);
                token.set('bar1_value', newHP);
                sendChat('API', `${token.get('name') || 'Token'} took ${amount}.`);
            } else if (args[0] === '!heal') {
                let maxHP = parseInt(token.get('bar1_max'), 10) || 0;
                let newHP = maxHP > 0 ? Math.min(maxHP, current + amount) : current + amount;
                token.set('bar1_value', newHP);
                sendChat('API', `${token.get('name') || 'Token'} healed ${amount}.`);
            }
        });
    }
});