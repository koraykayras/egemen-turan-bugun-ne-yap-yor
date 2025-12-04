fetch("/get-archive")
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById("archive-list");

    if (data.length === 0) {
      list.innerHTML = "<p>Henüz geçmiş kayıt yok.</p>";
      return;
    }

    data.forEach(item => {
      const div = document.createElement("div");
      div.className = "archive-item";

      div.innerHTML = `
        <h3>${item.date}</h3>
        <p>${item.content}</p>
      `;

      list.appendChild(div);
    });
  });
