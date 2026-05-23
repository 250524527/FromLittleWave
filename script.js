document.addEventListener('DOMContentLoaded', () => {
    
    // ---------------------------------------------------------
    // 1. 공통 기능: 도움말 모달
    // ---------------------------------------------------------
    // --- [범용 모달 시스템] ---
    // 1. 모든 모달 열기 버튼을 찾아서 기능을 심어줌
    const modalTriggers = document.querySelectorAll('.modal-trigger');
    
    modalTriggers.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target'); // 열고 싶은 ID 추출
            const modal = document.getElementById(targetId);
            if (modal) modal.style.display = 'flex';
        });
    });

    // 2. 모든 닫기 버튼(&times;)에 기능을 심어줌
    const closeButtons = document.querySelectorAll('.close-btn');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal-overlay'); // 가장 가까운 부모 모달 찾기
            if (modal) modal.style.display = 'none';
        });
    });

    // 3. 모달 바깥쪽(배경) 클릭 시 닫기
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            e.target.style.display = 'none';
        }
    });

    // ---------------------------------------------------------
    // 2. 멀티 퀴즈 관리 시스템 (정답 확인용)
    // ---------------------------------------------------------
    const submitBtn = document.getElementById('submitBtn');
    const quizInput = document.getElementById('quizInput');
    const pageInfo = document.getElementById('quiz-page-identifier');

    const quizData = {
        'notice': {
            correctAnswer: '240323',
            unlockKey: 'unlocked_notice', // 키 이름 통일
            successMsg: "🔓 자료실 액세스 권한을 획득했습니다.",
            nextUrl: "main.html" 
        },
        'code1': {
            correctAnswer: '수국',
            unlockKey: 'unlocked_code1',
            successMsg: "🚀 첫 번째 궤도 진입에 성공했습니다!",
            nextUrl: "archive.html"
        },
        'code2': {
            correctAnswer: '25411',
            unlockKey: 'unlocked_code2',
            successMsg: "🚀 두 번째 궤도 진입에 성공했습니다!",
            nextUrl: "archive.html"
        },
        'code3': {
            correctAnswer: '나비처럼',
            unlockKey: 'unlocked_code3',
            successMsg: "🚀 세 번째 궤도 진입에 성공했습니다!",
            nextUrl: "archive.html"
        },
        'code4': {
            correctAnswer: '233321',
            unlockKey: 'unlocked_code4',
            successMsg: "🔓 나비의 방 클리어에 성공했습니다!",
            nextUrl: "archive.html"
        },
        'code5': {
            correctAnswer: '0001101110',
            unlockKey: 'unlocked_code5',
            successMsg: "🔓 선택의 방 클리어에 성공했습니다!",
            nextUrl: "archive.html"
        },
        'code6': {
            correctAnswer: 'HWYD',
            unlockKey: 'unlocked_code6',
            successMsg: "🔓 기억의 방 클리어에 성공했습니다!",
            nextUrl: "music.html"
        }
    };

    if (submitBtn && quizInput && pageInfo) {
        const currentId = pageInfo.dataset.quizId;
        const currentQuiz = quizData[currentId];

        submitBtn.addEventListener('click', () => {
            const userInput = quizInput.value.trim();
            if (currentQuiz && userInput === currentQuiz.correctAnswer) {
                localStorage.setItem(currentQuiz.unlockKey, 'true');
                alert(currentQuiz.successMsg);
                window.location.href = currentQuiz.nextUrl;
            } else {
                alert("데이터가 일치하지 않습니다. 다시 시도하십시오! 👽");
                quizInput.value = "";
                quizInput.focus();
            }
        });

        quizInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') submitBtn.click();
        });
    }

    // ---------------------------------------------------------
    // 3. 메인 화면 전용: 진행도 표시 및 자료실 접근 제어
    // ---------------------------------------------------------
    // ALL_QUIZZES의 ID들은 quizData의 키값과 정확히 일치해야 함!
    const ALL_QUIZZES = ['notice', 'code1', 'code2', 'code3', 'code4', 'code5'];
    const archiveStatus = document.getElementById('archiveStatus');
    const archiveMenuItem = document.querySelector('[data-link="archive"]');

    if (archiveStatus) {
        // 실제 저장된 키값을 필터링 (unlocked_notice 등)
        const clearedCount = ALL_QUIZZES.filter(id => localStorage.getItem(`unlocked_${id}`) === 'true').length;
        const totalCount = ALL_QUIZZES.length;

        if (clearedCount > 0) {
            archiveStatus.classList.add('open');
            archiveStatus.innerText = clearedCount === totalCount ? "[ALL CLEAR!]" : `[${clearedCount}/${totalCount} CLEAR]`;
            if (archiveMenuItem) archiveMenuItem.classList.add('unlocked-item');
        }
    }

    if (archiveMenuItem) {
        archiveMenuItem.addEventListener('click', (e) => {
            // 공지사항(notice)을 풀었을 때만 입장 가능
            const noticeCleared = localStorage.getItem('unlocked_notice');
            if (noticeCleared === 'true') {
                window.location.href = "archive.html"; 
            } else {
                e.preventDefault();
                alert("🔒 자료실은 잠겨있습니다. 공지사항의 암호를 먼저 해독하십시오! 👽");
            }
        });
    }

    // --- [기밀 해제 연출 함수] ---
    // 이 함수는 updateCodeList 바깥에 따로 정의해두는 게 깔끔하네!
    const startDeclassify = (url) => {
        const overlay = document.getElementById('declassifyOverlay');
        const bar = document.getElementById('progressBar');
        if (!overlay || !bar) {
            window.location.href = url; // 오버레이 요소가 없으면 그냥 이동하게나
            return;
        }

        overlay.style.display = 'flex'; // 검은색 로딩 화면 표시

        let width = 0;
        const interval = setInterval(() => {
            if (width >= 100) {
                clearInterval(interval);
                setTimeout(() => { window.location.href = url; }, 200); // 100% 찍고 살짝 뒤 이동
            } else {
                // 40년 차의 노하우: 숫자가 랜덤하게 올라가야 더 '해킹' 같네!
                width += Math.floor(Math.random() * 20) + 5; 
                if (width > 100) width = 100;
                bar.style.width = width + '%';
            }
        }, 200); // 게이지 차오르는 속도 조절
    };

    // --- [자료실 단계별 해제 로직] ---
    const updateCodeList = () => {
        for (let i = 2; i <= 10; i++) {
            const prevId = `code${i-1}`;
            const currentId = `code${i}`;
            const isPrevCleared = localStorage.getItem(`unlocked_${prevId}`) === 'true';
            const currentItem = document.getElementById(`mission-item-${currentId}`);

            if (currentItem && isPrevCleared) {
                currentItem.classList.remove('locked');
                currentItem.classList.add('unlocked');
                
                const statusIcon = currentItem.querySelector('.m-status');
                if (statusIcon) statusIcon.innerText = "🔓";

                const titleText = currentItem.querySelector('.m-title');
                // [★ 수정 포인트] : 직접 이동 대신 연출 함수를 호출하도록 변경!
                currentItem.onclick = () => { 
                    startDeclassify(`${currentId}.html`); 
                };
            }
        }
        
        // 1번(code1)은 항상 열려있으니 1번에도 연출을 걸어주는 게 공평하겠지?
        const firstItem = document.querySelector('.mission-item.unlocked');
        if (firstItem && !firstItem.id.includes('code2')) { // 이미 루프에서 처리된 건 제외
            firstItem.onclick = () => { startDeclassify('code1.html'); };
        }
    };

    updateCodeList();


    function playTrack(index, title) {
        // 1. 모든 목록에서 active 클래스 제거
        document.querySelectorAll('.playlist-item').forEach(item => {
            item.classList.remove('active');
        });

        // 2. 선택한 목록에 active 클래스 추가
        const selectedItem = document.querySelectorAll('.playlist-item')[index];
        selectedItem.classList.add('active');

        // 3. 상단 정보 업데이트
        document.getElementById('currentTitle').innerText = title;
        
    }

    const finalExitBtn = document.getElementById('finalExitBtn');

    if (finalExitBtn) {
        finalExitBtn.addEventListener('click', () => {
            if (confirm("모든 데이터를 파기하고 종료하시겠습니까?")) {
                localStorage.clear();
                sessionStorage.clear();
                // 홈으로 즉시 이동
                window.location.href = "index.html";
            }
        });
    }


    // 페이지 로드 시 콘솔에 몰래 출력
    console.log(
        "%c [SYSTEM] AUTHORIZED ACCESS DETECTED ", 
        "background: #111; color: #4ed9d9; font-size: 15px; font-weight: bold; border: 1px solid #4ed9d9;"
    );
    console.log("제작자: 갱이");
    console.log("빌드 버전: v1.0.260913");
    console.log("비고: 이 메시지를 찾았다면 당신도 훌륭한 탐사 대원입니다. 👽");

    

    
});
