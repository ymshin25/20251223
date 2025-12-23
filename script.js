const events = {
    "all": [
        { name: "고구려 건국", year: -37 },
        { name: "신라 건국", year: -57 },
        { name: "백제 건국", year: -18 },
        { name: "고려 건국", year: 918 },
        { name: "조선 건국", year: 1392 },
        { name: "임진왜란", year: 1592 },
        { name: "제1차 아편전쟁", year: 1839 },
        { name: "메이지 유신", year: 1868 },
        { name: "러일전쟁", year: 1904 },
        { name: "제1차 세계대전", year: 1914 },
        { name: "3.1 운동", year: 1919 },
        { name: "제2차 세계대전", year: 1939 },
        { name: "한국전쟁", year: 1950 }
    ],
    "three-kingdoms": [
        { name: "고구려 건국", year: -37 },
        { name: "신라 건국", year: -57 },
        { name: "백제 건국", year: -18 },
        { name: "신라, 삼국 통일", year: 668 },
        { name: "살수대첩", year: 612},
        { name: "황산벌 전투", year: 660}
    ],
    "goryeo": [
        { name: "고려 건국", year: 918 },
        { name: "거란의 1차 침입", year: 993 },
        { name: "귀주대첩", year: 1019 },
        { name: "묘청의 난", year: 1135 },
        { name: "무신정변", year: 1170 },
        { name: "팔만대장경 완성", year: 1251 },
        { name: "몽골의 침입", year: 1231 }
    ]
};

const eventsContainer = document.getElementById("events-container");
const timelineContainer = document.getElementById("timeline-container");
const checkButton = document.getElementById("check-button");
const nextButton = document.getElementById("next-button");
const shareButton = document.getElementById("share-button");
const result = document.getElementById("result");
const eraSelector = document.getElementById("era");

let correctOrder = [];
let draggedElement = null;

eraSelector.addEventListener("change", setupQuiz);
nextButton.addEventListener("click", setupQuiz);
checkButton.addEventListener("click", checkAnswer);
shareButton.addEventListener("click", share);

function setupQuiz() {
    eventsContainer.innerHTML = "";
    timelineContainer.innerHTML = "";
    result.innerHTML = "";
    result.className = '';
    nextButton.style.display = "none";
    checkButton.style.display = "inline-block";
    enableDragAndDrop();

    const selectedEra = eraSelector.value;
    const eraEvents = events[selectedEra];
    const eventCount = Math.floor(Math.random() * 3) + 2; // 2 to 4 events

    const randomEvents = [...eraEvents].sort(() => 0.5 - Math.random()).slice(0, eventCount);
    correctOrder = [...randomEvents].sort((a, b) => a.year - b.year);

    randomEvents.forEach(event => {
        const card = createEventCard(event);
        eventsContainer.appendChild(card);
    });
}

function createEventCard(event) {
    const card = document.createElement("div");
    card.textContent = event.name;
    card.className = "event-card";
    card.draggable = true;
    card.dataset.year = event.year;
    card.addEventListener("dragstart", handleDragStart);
    card.addEventListener("dragend", handleDragEnd);
    return card;
}

function handleDragStart(e) {
    draggedElement = e.target;
    setTimeout(() => e.target.classList.add("dragging"), 0);
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
    e.target.classList.remove("dragging");
}

function enableDragAndDrop() {
    [eventsContainer, timelineContainer].forEach(container => {
        container.addEventListener("dragover", handleDragOver);
        container.addEventListener("drop", handleDrop);
    });
}

function disableDragAndDrop() {
     [eventsContainer, timelineContainer].forEach(container => {
        container.removeEventListener("dragover", handleDragOver);
        container.removeEventListener("drop", handleDrop);
    });
    document.querySelectorAll('.event-card').forEach(card => card.draggable = false);
}


function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.preventDefault();
    if (draggedElement && e.currentTarget.classList.contains('drop-zone')) {
        e.currentTarget.appendChild(draggedElement);
        draggedElement = null;
    }
}

function checkAnswer() {
    const timelineCards = timelineContainer.querySelectorAll(".event-card");
    if (eventsContainer.children.length > 0) {
        result.textContent = "모든 사건을 타임라인에 배치해주세요.";
        result.className = 'incorrect';
        return;
    }

    const userOrder = [...timelineCards].map(card => ({
        name: card.textContent.split(' (')[0],
        year: parseInt(card.dataset.year)
    }));

    const isCorrect = JSON.stringify(userOrder) === JSON.stringify(correctOrder);

    result.innerHTML = ""; 
    if (isCorrect) {
        result.textContent = "정답입니다!";
        result.className = 'correct';
    } else {
        result.textContent = "틀렸습니다. 정답은 다음과 같습니다:";
        result.className = 'incorrect';
        correctOrder.forEach(event => {
            const eventInfo = document.createElement("p");
            eventInfo.textContent = `${event.name} (${event.year}년)`;
            result.appendChild(eventInfo);
        });
    }

    timelineCards.forEach(card => {
        const year = card.dataset.year;
        card.textContent = `${card.textContent} (${year}년)`;
    });
    
    disableDragAndDrop();
    checkButton.style.display = "none";
    nextButton.style.display = "inline-block";
}

function share() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        alert("퀴즈 링크가 클립보드에 복사되었습니다!");
    }, () => {
        alert("링크 복사에 실패했습니다.");
    });
}

// Initial setup
setupQuiz();