on('chat:message', function(msg) {
    if (msg.type === 'api' && msg.content === '!draw') {

        let roll = randomInteger(16);

        if (roll === 1) {
            sendChat("Deck", `<img src="https://cdn.dribbble.com/userupload/18524820/file/original-a3a7dd07d2480b290441a33937a886d0.gif">`);
        }

        if (roll === 2) {
            sendChat("Deck", `<img src="https://cdn.dribbble.com/userupload/18524820/file/original-a3a7dd07d2480b290441a33937a886d0.gif">`);
        }
        if (roll === 3) {
            sendChat("Deck", `<img src="https://cdn.dribbble.com/userupload/18524820/file/original-a3a7dd07d2480b290441a33937a886d0.gif">`);
        }

        if (roll === 4) {
            sendChat("Deck", `<img src="https://cdn.dribbble.com/userupload/18524820/file/original-a3a7dd07d2480b290441a33937a886d0.gif">`);
        }

        if (roll === 5) {
            sendChat("Deck", `<img src="https://cdn.dribbble.com/userupload/18524820/file/original-a3a7dd07d2480b290441a33937a886d0.gif">`);
        }

        if (roll === 6) {
            sendChat("Deck", `<img src="https://cdn.dribbble.com/userupload/18524820/file/original-a3a7dd07d2480b290441a33937a886d0.gif">`);
        }

        if (roll === 7) {
            sendChat("Deck", `<img src="https://cdn.dribbble.com/userupload/18524820/file/original-a3a7dd07d2480b290441a33937a886d0.gif">`);
        }

        if (roll === 8) {
            sendChat("Deck", `<img src="https://cdn.dribbble.com/userupload/18524820/file/original-a3a7dd07d2480b290441a33937a886d0.gif">`);
        }
        
        if (roll === 9) {
            sendChat("Deck", `<img src="https://cdn.dribbble.com/userupload/18524820/file/original-a3a7dd07d2480b290441a33937a886d0.gif">`);
        }

        if (roll === 10) {
            sendChat("Deck", `<img src="https://cdn.dribbble.com/userupload/18524820/file/original-a3a7dd07d2480b290441a33937a886d0.gif">`);
        }

        if (roll === 11) {
            sendChat("Deck", `<img src="https://cdn.dribbble.com/userupload/18524820/file/original-a3a7dd07d2480b290441a33937a886d0.gif">`);
        }

        if (roll === 12) {
            sendChat("Deck", `<img src="https://cdn.dribbble.com/userupload/18524820/file/original-a3a7dd07d2480b290441a33937a886d0.gif">`);
        }

        if (roll === 13) {
            sendChat("Deck", `<img src="https://cdn.dribbble.com/userupload/18524820/file/original-a3a7dd07d2480b290441a33937a886d0.gif">`);
        }

        if (roll === 14) {
            sendChat("Deck", `<img src="https://cdn.dribbble.com/userupload/18524820/file/original-a3a7dd07d2480b290441a33937a886d0.gif">`);
        }

        if (roll === 15) {
            sendChat("Deck", `<img src="https://cdn.dribbble.com/userupload/18524820/file/original-a3a7dd07d2480b290441a33937a886d0.gif">`);
        }

        else if (roll === 16) {

            let chance = randomInteger(100);

            if (chance <= 60) {
                sendChat("Deck", `<img src="https://cdn.dribbble.com/userupload/18524820/file/original-a3a7dd07d2480b290441a33937a886d0.gif">`);
            } else {
                sendChat("Deck", `<img src="https://cdn.dribbble.com/userupload/18524820/file/original-a3a7dd07d2480b290441a33937a886d0.gif">`);
            }
        }
    }
});