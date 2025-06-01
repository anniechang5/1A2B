window.addEventListener("DOMContentLoaded", () => {
  function generateAnswer() {
    const digits = [];
    while (digits.length < 4) {
      const r = Math.floor(Math.random() * 10);
      if (!digits.includes(r)) digits.push(r);
    }
    return digits.join('');
  }

  let answer = generateAnswer();
  console.log("🎯 謎底是：" + answer); // ✅ 會出現在 Console

  let currentIndex = 0;
  const inputs = document.querySelectorAll(".guess-box input");
  const usedButtons = [];
  let guessCount = 0;

  window.inputNumber = function(num, btn) {
    if (currentIndex < 4) {
      for (let i = 0; i < currentIndex; i++) {
        if (inputs[i].value == num) return;
      }
      inputs[currentIndex].value = num;
      currentIndex++;
      btn.classList.add("used");
      usedButtons.push(btn);
    }
  };

  window.deleteNumber = function() {
    if (currentIndex > 0) {
      currentIndex--;
      const deletedValue = inputs[currentIndex].value;
      inputs[currentIndex].value = "";
      const allBtns = document.querySelectorAll(".number-btn");
      allBtns.forEach(btn => {
        if (btn.textContent == deletedValue) {
          btn.classList.remove("used");
        }
      });
    }
  };

  window.checkGuess = function() {
    if (currentIndex < 4) return alert("請輸入四個不重複的數字");

    const guess = Array.from(inputs).map(input => input.value).join('');
    let A = 0, B = 0;

    for (let i = 0; i < 4; i++) {
      if (guess[i] === answer[i]) A++;
      else if (answer.includes(guess[i])) B++;
    }

    const historyDiv = document.getElementById("history");
    if (guessCount % 2 === 0) {
      const row = document.createElement("div");
      row.className = "history-row";
      historyDiv.appendChild(row);
    }

    const entry = document.createElement("div");
    entry.className = "history-entry";
    entry.textContent = `${guess}  ${A}A${B}B`;
    const rows = document.querySelectorAll(".history-row");
    rows[rows.length - 1].appendChild(entry);
    guessCount++;

    if (A === 4) {
      document.getElementById("result").textContent = "🎉 恭喜答對！";
    
      setTimeout(() => {
        document.getElementById("final-answer").textContent = `謎底：${answer}`;
        document.getElementById("final-count").textContent = `所用次數：${guessCount}`;
        document.getElementById("summaryModal").style.display = "flex";
    
        // 顯示輸入名稱欄位與送出按鈕
        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.placeholder = "請輸入你的名字";
        nameInput.style = "margin-top: 10px; padding: 6px; border-radius: 8px; border: none; font-size: 16px;";
        document.querySelector(".modal-content").appendChild(nameInput);
    
        const submitBtn = document.createElement("button");
        submitBtn.textContent = "送出成績";
        document.querySelector(".modal-content").appendChild(submitBtn);
    
        submitBtn.onclick = () => {
          const username = nameInput.value.trim();
          if (!username) return alert("請輸入你的名字");
    
          saveScore(username, guessCount).then(() => {
            window.location.href = "rank.html?user=" + encodeURIComponent(username);
          });
        };
      }, 800);
    }
    

    inputs.forEach(input => input.value = "");
    currentIndex = 0;
    usedButtons.forEach(btn => btn.classList.remove("used"));
    usedButtons.length = 0;
  };

  function saveScore(username, guessCount) {
    const newRef = firebase.database().ref("leaderboard").push();
    return newRef.set({
      username: username,
      guessCount: guessCount,
      timestamp: Date.now()
    }).then(() => {
      console.log("✅ 成績已寫入 Firebase");
    }).catch((error) => {
      console.error("❌ 寫入 Firebase 失敗：", error);
    });
  }
});
