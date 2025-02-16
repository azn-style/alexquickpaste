function insererTexte(reponse, automatique = false) {
  const activeElement = document.activeElement;
  if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
    if (automatique) {
      activeElement.focus();
      document.execCommand('insertText', false, reponse);
      activeElement.dispatchEvent(new Event('input', { bubbles: true }));
      activeElement.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      navigator.clipboard.writeText(reponse).then(() => {
        console.log('Texte copié dans le presse-papiers : ', reponse);
      }).catch(err => {
        console.error('Erreur lors de la copie dans le presse-papiers : ', err);
      });
    }
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'collerReponse') {
    insererTexte(request.reponse, request.automatique);
  }
});