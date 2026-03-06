on('chat:message', function(msg) {
    if (msg.type !== 'api' || !msg.content.startsWith('!fly')) return;
    if (!msg.selected || msg.selected.length === 0) {
        return sendChat('API', `/w gm Please select one or more tokens.`);
    }
    msg.selected.forEach(sel => {
        let token = getObj('graphic', sel._id);
        if (!token) {
            sendChat('API', `/w gm Token not found for ID ${sel._id}.`);
            return;
        }
        let status = token.get('statusmarkers') || '';
        let markers = status.split(',').filter(Boolean);
        let marker = 'fluffy-wing';
        if (markers.includes(marker)) {
            // Remove marker
            markers = markers.filter(m => m !== marker);
            token.set('statusmarkers', markers.join(','));
            sendChat('API', `${token.get('name') || 'Token'}: Fluffy Wing marker removed.`);
        } else {
            // Add marker
            markers.push(marker);
            token.set('statusmarkers', markers.join(','));
            sendChat('API', `${token.get('name') || 'Token'}: Fluffy Wing marker added.`);
        }
    });
});