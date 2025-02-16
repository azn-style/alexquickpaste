chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "reponses-rapides-parent",
    title: "AlexQuickPaste",
    contexts: ["editable"]
  });

  const reponsesInitiales = [
    "Bonjour, merci de nous contacter !\n\nCeci est un exemple de réponse\navec plusieurs lignes.",
    "Veuillez trouver ci-joint les informations demandées.\n\nCordialement,\nVotre équipe.",
    "Nous vous répondrons dans les plus brefs délais.\n\nMerci de votre patience.",
    "J'ai besoin d'aide pour résoudre un problème.\n\nPourriez-vous me contacter au plus vite ?",
    "Merci beaucoup pour votre assistance.\n\nJe reste à votre disposition pour toute question complémentaire."
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