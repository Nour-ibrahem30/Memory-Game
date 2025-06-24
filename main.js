// === Game Setup ===
const duration = 1500;
const blocksContainer = document.querySelector(".memory-game-blocks");
const blocks = Array.from(blocksContainer.children);
const orderRange = Array.from(Array(blocks.length).keys());
const triesElement = document.querySelector(".tries span");
const controlButton = document.querySelector(".control-buttons span");
const successSound = document.getElementById("success");
const failSound = document.getElementById("fail");

// === Start Game ===
controlButton.onclick = () => {
  const playerName = prompt("What's your name?");
  document.querySelector(".name span").textContent =
    playerName?.trim() || "Unknown";
  document.querySelector(".control-buttons").remove();
  shuffle(orderRange);
  applyOrder();
};

// === Shuffle Cards (Fisher-Yates) ===
function shuffle(array) {
  let current = array.length,
    temp,
    random;
  while (current > 0) {
    random = Math.floor(Math.random() * current--);
    [array[current], array[random]] = [array[random], array[current]];
  }
}

// === Apply Random Order to Blocks ===
function applyOrder() {
  blocks.forEach((block, index) => {
    block.style.order = orderRange[index];
  });
}

// === Handle Block Click ===
blocks.forEach((block) => {
  block.addEventListener("click", () => {
    if (
      block.classList.contains("is-flipped") ||
      block.classList.contains("has-match")
    )
      return;

    block.classList.add("is-flipped");

    const flipped = blocks.filter((b) => b.classList.contains("is-flipped"));

    if (flipped.length === 2) {
      disableClicking();
      checkMatched(flipped[0], flipped[1]);
    }
  });
});

// === Disable Clicking Temporarily ===
function disableClicking() {
  blocksContainer.classList.add("no-clicking");
  setTimeout(() => blocksContainer.classList.remove("no-clicking"), duration);
}

// === Check for Match ===
function checkMatched(first, second) {
  const isMatch = first.dataset.technology === second.dataset.technology;

  if (isMatch) {
    first.classList.remove("is-flipped");
    second.classList.remove("is-flipped");
    first.classList.add("has-match");
    second.classList.add("has-match");
    successSound.play();
  } else {
    setTimeout(() => {
      first.classList.remove("is-flipped");
      second.classList.remove("is-flipped");
    }, duration);
    failSound.play();
    triesElement.textContent = +triesElement.textContent + 1;
  }

  setTimeout(checkIfFinished, 100);
}

// === Check if Game is Finished ===
function checkIfFinished() {
  const allMatched = blocks.every((block) =>
    block.classList.contains("has-match")
  );
  if (!allMatched) return;

  let winMsg = document.querySelector(".finish-game");

  if (!winMsg) {
    winMsg = document.createElement("div");
    winMsg.className = "finish-game";
    winMsg.textContent = `🎉 Generation, You Win! 🎉`;
    document.body.appendChild(winMsg);
  }

  winMsg.style.display = "block";
}
