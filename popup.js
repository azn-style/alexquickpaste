document.addEventListener('DOMContentLoaded', () => {
  const nouvelleReponse = document.getElementById('nouvelleReponse');
  const ajouter = document.getElementById('ajouter');
  const listeReponses = document.getElementById('listeReponses');

  chrome.storage.local.get('reponses', (data) => {
    const reponses = data.reponses || [];
    afficherReponses(reponses);
  });

  ajouter.addEventListener('click', () => {
    const reponse = nouvelleReponse.value.trim();
    if (reponse !== '') {
      chrome.storage.local.get('reponses', (data) => {
        const reponses = data.reponses || [];
        reponses.push(reponse);
        chrome.storage.local.set({ reponses: reponses }, () => {
          nouvelleReponse.value = '';
          afficherReponses(reponses);
        });
      });
    }
  });

  function afficherReponses(reponses) {
    listeReponses.innerHTML = '';

    reponses.forEach((reponse, index) => {
      const li = document.createElement('li');

      // Conteneur pour les icônes
      const iconContainer = document.createElement('div');
      iconContainer.style.display = 'flex';

      // Conteneur pour le texte
      const textContainer = document.createElement('div');
      const p = document.createElement('p');
      p.style.whiteSpace = 'pre-wrap';
      p.textContent = reponse;
      textContainer.appendChild(p);

      // Ordre des boutons (Copier à droite)
      const editButton = document.createElement('button');
      editButton.textContent = '✏️';
      editButton.title = 'Modifier';
      editButton.addEventListener('click', () => {
        nouvelleReponse.value = reponse;
        ajouter.textContent = 'Modifier';
        ajouter.onclick = () => {
          reponses[index] = nouvelleReponse.value.trim();
          chrome.storage.local.set({ reponses: reponses }, () => {
            nouvelleReponse.value = '';
            ajouter.textContent = 'Ajouter';
            afficherReponses(reponses);
          });
        };
      });

      const deleteButton = document.createElement('button');
      deleteButton.textContent = '❌';
      deleteButton.title = 'Supprimer';
      deleteButton.addEventListener('click', () => {
        reponses.splice(index, 1);
        chrome.storage.local.set({ reponses: reponses }, () => {
          afficherReponses(reponses);
        });
      });

      const monterButton = document.createElement('button');
      monterButton.textContent = '▲';
      monterButton.title = 'Monter';
      monterButton.addEventListener('click', () => {
        if (index > 0) {
          const temp = reponses[index];
          reponses[index] = reponses[index - 1];
          reponses[index - 1] = temp;
          chrome.storage.local.set({ reponses: reponses }, () => {
            afficherReponses(reponses);
          });
        }
      });

      const descendreButton = document.createElement('button');
      descendreButton.textContent = '▼';
      descendreButton.title = 'Descendre';
      descendreButton.addEventListener('click', () => {
        if (index < reponses.length - 1) {
          const temp = reponses[index];
          reponses[index] = reponses[index + 1];
          reponses[index + 1] = temp;
          chrome.storage.local.set({ reponses: reponses }, () => {
            afficherReponses(reponses);
          });
        }
      });

      const copierButton = document.createElement('button');
      copierButton.textContent = '⧉';
      copierButton.title = 'Copier';
      copierButton.addEventListener('click', () => {
        navigator.clipboard.writeText(reponse)
          .then(() => {
            console.log('Texte copié dans le presse-papiers : ', reponse);
          })
          .catch(err => {
            console.error('Erreur lors de la copie dans le presse-papiers : ', err);
          });
      });

      // Ajout des boutons dans l'ordre souhaité
      iconContainer.appendChild(editButton);
      iconContainer.appendChild(deleteButton);
      iconContainer.appendChild(monterButton);
      iconContainer.appendChild(descendreButton);
      iconContainer.appendChild(copierButton); // Copier à droite


      li.appendChild(iconContainer);
      li.appendChild(textContainer);
      listeReponses.appendChild(li);
    });
  }
});