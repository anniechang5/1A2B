document.addEventListener("DOMContentLoaded", () => {
    const listContainer = document.getElementById("rank-list");
  
    firebase.database().ref("leaderboard")
      .orderByChild("guessCount")
      .once("value", snapshot => {
        let rank = 1;
        snapshot.forEach(child => {
          const data = child.val();
          const row = document.createElement("div");
          row.className = "table-row";
          row.innerHTML = `
            <div>${rank}</div>
            <div>${data.username}</div>
            <div>${data.guessCount}</div>
          `;
          document.getElementById("rank-list").appendChild(row);
          rank++;
        });
      });
  });
  