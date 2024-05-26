const ul = document.querySelector("ul");
const div = document.getElementById("perfil");
const textField = document.getElementById("textField");
const submitButton = document.getElementById("submitButton");

textField.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    submit();
  }
});

submitButton.addEventListener("click", function (event) {
  event.preventDefault();
  submit();
});

function getApiGitHub(name) {
  let followersLength = 0;

  fetch(`https://api.github.com/users/${name}/followers`)
    .then((resp) => resp.json())
    .then((data) => {
      followersLength = data.length;
    })
    .catch((err) => console.log(err));

  fetch(`https://api.github.com/users/${name}/repos`)
    .then(async (res) => {
      if (!res.ok) {
        throw new Error(res.status);
      }

      var data = await res.json();
      addPerfil(data[0].owner, followersLength, data.length);
      data.map((i) => {
        addRepositorys(i);
      });
    })
    .catch((err) => console.log(err));
}

function clearList() {
  ul.innerHTML = "";
  perfil.innerHTML = "";
}

function submit() {
  clearList();
  if (textField.value != null) {
    getApiGitHub(textField.value);
    console.log("Acessando repositório de", textField.value, "...");
  }
}

function addPerfil(item, followersLength, repositorysLength) {
  div.innerHTML = `<img src="${item.avatar_url}"/>`;
  div.innerHTML += `<span>Perfil de:</span>`;
  div.innerHTML += `<a href="${item.html_url}" target="_blank">${item.login}</a>`;
  div.innerHTML += `<p><ion-icon name="git-branch-outline"></ion-icon>${repositorysLength} repositórios.</p>`;
  div.innerHTML += `<p><ion-icon name="people-outline"></ion-icon>${followersLength} seguidores.</p>`;
}

function addRepositorys(item) {
  let li = document.createElement("li");

  li.innerHTML = `<img src="https://th.bing.com/th/id/R.ac71e5ad13f62496d789291f29dcffe2?rik=2s0y2WWgmFojXA&riu=http%3a%2f%2fwww.alex-arriaga.com%2fwp-content%2fuploads%2f2014%2f05%2fgit-icon.png&ehk=0NFGxdfzVCPtjv2qiU33i7wW9GTkvZI6yPKuJOl3vhc%3d&risl=&pid=ImgRaw&r=0" /> `;
  li.innerHTML += `<a href="${item.html_url}" target="_blank">${item.name}</a>`;

  if (item.description != null) {
    li.innerHTML += `<p>${item.description}</p>`;
  } else {
    li.innerHTML += "<p>Sem descrição de repositório.</p>";
  }

  if (item.language != null) {
    li.innerHTML += `<span><ion-icon name="terminal-outline"></ion-icon>${item.language}</span>`;
  }

  li.innerHTML += `
  <span><ion-icon name="calendar-outline"></ion-icon>Criado em: 
  ${Intl.DateTimeFormat("pt-BR").format(new Date(item.created_at))}
  </span>
  `;

  li.innerHTML += `
  <span><ion-icon name="today-outline"></ion-icon>Ultima modificação em: 
  ${Intl.DateTimeFormat("pt-BR").format(new Date(item.updated_at))}
  </span>
  <hr>
  `;

  ul.appendChild(li);
}
