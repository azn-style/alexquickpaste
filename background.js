chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "reponses-rapides-parent",
    title: "AlexQuickPaste",
    contexts: ["editable"]
  });

  const reponsesInitiales = [
    "Bonjour,\n\nJe vous confirme la création du compte :\n\nEmail : \nPassword : \n\nBien cordialement,",
    "Bonjour,\n\nLe problème est maintenant résolu\n\nBien cordialement,",
    "Bonjour,\n\nNous vous répondrons dans les plus brefs délais.\n\nMerci de votre patience,\n\nBien cordialement,",
    "Bonjour,\n\nPeux tu me donner les droits sur O365.\n\nMerci d'avance,\n\nBien cordialement,",
    "Bonjour,\n\nJe transfere à l'équipe logiciel.\n\nBien cordialement,"
  ];

  chrome.storage.local.set({ reponses: reponsesInitiales }, () => {
    reponsesInitiales.forEach(reponse => {
      chrome.contextMenus.create({
        id: `reponse-${reponse}`,
        title: reponse,
        parentId: "reponses-rapides-parent",
        contexts: ["editable"]
      });
    });
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.parentMenuItemId === "reponses-rapides-parent") {
    const reponse = info.menuItemId.substring(8);
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: (reponse) => {
        insererTexte(reponse, true);
      },
      args: [reponse]
    });
  }
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes.reponses) {
    chrome.contextMenus.remove("reponses-rapides-parent", () => {
      chrome.contextMenus.create({
        id: "reponses-rapides-parent",
        title: "Réponses Rapides",
        contexts: ["editable"]
      });
      changes.reponses.newValue.forEach(reponse => {
        chrome.contextMenus.create({
          id: `reponse-${reponse}`,
          title: reponse,
          parentId: "reponses-rapides-parent",
          contexts: ["editable"]
        });
      });
    });
  }
});
