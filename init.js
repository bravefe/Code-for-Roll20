on('chat:message', function(msg) {
  if (msg.type === 'api' && msg.content === '!group-init' && msg.selected) {
    let turnorder = Campaign().get('turnorder');
    turnorder = turnorder && turnorder.length ? JSON.parse(turnorder) : [];
    let idsInOrder = turnorder.map(e => e.id);

    msg.selected.forEach(sel => {
      let token = getObj('graphic', sel._id);
      if (!token) return;
      let charId = token.get('represents');
      let bonus = 0;
      let charName = token.get('name');
      if (charId) {
        let attr = findObjs({
          type: 'attribute',
          characterid: charId,
          name: 'initiative_bonus'
        })[0];
        if (attr) {
          bonus = parseFloat(attr.get('current')) || 0;
        }
        let character = getObj('character', charId);
        if (character) {
          charName = character.get('name');
        }
      }
      let roll = Math.floor(Math.random() * 20) + 1;
      let initiative = roll + bonus;

      sendChat('Init', `${charName} (${roll}) + (${bonus}) = (${initiative})`);

      if (!idsInOrder.includes(sel._id)) {
        turnorder.push({
          id: sel._id,
          pr: initiative,
          custom: '',
          _pageid: token.get('pageid')
        });
      }
    });

    Campaign().set('turnorder', JSON.stringify(turnorder));
  }
});