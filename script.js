// Interactive research story. Edit text and references here.

const app = document.querySelector('#app');
const chapter = document.querySelector('#chapter');
const fill = document.querySelector('#progressFill');
const soundButton = document.querySelector('#soundToggle');

let screen = 0;
let attempts = [];
let choice = '';
let selectedFile = 0;
let finalAnswer = 'both';

const chapters = [
    'PROLOGUE',
    'ACT 1 / ISLANDERS',
    'ACT 1 / YOUR PLAN',
    'ACT 1 / SURPRISE',
    'ACT 1 / YOUR CHOICE',
    'ACT 2 / REAL STORY',
    'ACT 3 / CASE FILES',
    'EPILOGUE'
];

// Small functions for creating HTML

function face(kind) {
    let imageName = '';

    if (kind === 'you') {
        imageName = 'me.png.png';
    } else if (kind === 'crush') {
        imageName = 'Sh.png.png';
    } else if (kind === 'jake') {
        imageName = 'jake.png.png';
    }

    return `
        <div class="avatar">
            <img src="images/${imageName}" alt="${kind} Mii">
        </div>
    `;
}

function btn(label, action, style = '') {
    return `<button class="btn ${style}" data-action="${action}">${label}</button>`;
}

function frame(body) {
    return `<section class="panel fade">${body}</section>`;
}

function go(nextScreen) {
    screen = nextScreen;
    render();

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Story screens

const screens = [

    // 0. Welcome
    function () {
        return frame(`
            <div class="stage">
                <div>
                    <p class="eyebrow">A story about love, chance & control</p>
                    <h1>I DIDN'T<br>CHOOSE <span class="pink">YOU.</span><br>THE GAME DID.</h1>
                    <p class="lead">You can create anyone you want. But can you decide who they love?</p>
                    
                    <div class="actions">${btn('ENTER THE ISLAND →', 'next')}</div>

                    <p class="note" style="margin-top: 12px;">
                        ♪ <strong>BEST EXPERIENCED WITH SOUND ON</strong><br>
                        Click SOUND OFF to enable background music.
                    </p>

                    <p class="note">An original interactive essay inspired by a real experience with Tomodachi Life.</p>

                </div>

               <div class="island" aria-hidden="true">
                    <img class="island-image" src="images/homepage.png.jpg" alt="">
                    <div class="heart-float">♥</div>
               </div>
            </div>
        `);
    },

    // 1. Meet the islanders
    function () {
        return frame(`
            <p class="eyebrow">01 / Meet the islanders</p>
            <h2>Three characters.<br>One very specific plan.</h2>
            <p>You made your own avatar, your favourite idol, and someone you added almost as an afterthought.</p>

            <div class="characters">
                <div class="character">
                    ${face('you')}
                    <div class="name">YOU</div>
                    <div class="role">THE PLAYER'S MII</div>
                </div>

                <div class="character focus">
                    ${face('crush')}
                    <div class="name">SUNGHOON</div>
                    <div class="role">YOUR CRUSH ♥</div>
                </div>

                <div class="character">
                    ${face('jake')}
                    <div class="name">JAKE</div>
                    <div class="role">JUST ANOTHER MII</div>
                </div>
            </div>

            <div class="dialogue">
                Your plan: <strong>Get your Mii and Sunghoon together.</strong> Easy, right?
            </div>

            <div class="actions">${btn("LET'S MAKE IT HAPPEN →", 'next')}</div>
        `);
    },

    // 2. Your plan
    function () {
        const actionNames = [
            'Spend time together',
            'Give a gift',
            'Wait for romance'
        ];

        let actionButtons = '';

        for (let i = 0; i < actionNames.length; i++) {
            const alreadyTried = attempts.includes(i);

            actionButtons += `
                <button
                    class="btn romance-choice ${alreadyTried ? 'secondary' : ''}"
                    data-action="attempt-${i}"
                    ${alreadyTried ? 'disabled' : ''}>
                    ${actionNames[i]}${alreadyTried ? ' ✓' : ''}
                </button>
            `;
        }

        let message = '';

        if (attempts.length === 0) {
            message = 'Choose an action to help the relationship grow.';
        } else if (attempts.length === 1) {
            message = 'A nice moment together. Still friends.';
        } else if (attempts.length === 2) {
            message = 'You tried again. Still friends.';
        } else {
            message = 'You kept trying. Still friends. You can influence the story, but you cannot force its outcome.';
        }

        let nextButton = '';

        if (attempts.length >= 2) {
            nextButton = `<div class="actions">${btn('KEEP PLAYING →', 'next')}</div>`;
        }

        return frame(`
            <p class="eyebrow">02 / Your plan</p>
            <h2>Make Sunghoon<br>fall for you.</h2>
            <p>You can encourage connections. But the islanders have their own relationship events.</p>

            <div class="row">
                <span class="status">YOU + SUNGHOON: FRIENDS</span>
                <span class="mini">ATTEMPTS: ${attempts.length} / 3</span>
            </div>

            <div class="attempts">${actionButtons}</div>
            <div class="dialogue">${message}</div>

            <p class="note">These actions are a simplified narrative illustration, not exact Tomodachi Life controls.</p>
            ${nextButton}
        `);
    },

    // 3. Unexpected event
    function () {
        return frame(`
            <p class="eyebrow">03 / An unexpected event</p>

            <div class="notification">
                <span class="heart">♥</span>
                <h2 class="love-title">
                    Someone has<br>
                    <span>fallen for you!</span>
                </h2>
                <p>After all that effort... could it finally be Sunghoon?</p>

                <div id="reveal">
                    ${btn('OPEN THE NOTIFICATION', 'reveal')}
                </div>
            </div>
        `);
    },

    // 4. Your choice
    function () {
        const options = [
            ['distance', 'Keep my distance from Jake'],
            ['stay', 'Stay close and see what happens'],
            ['unsure', "I don't know what to do"]
        ];

        let choiceButtons = '';

        for (const option of options) {
            const id = option[0];
            const label = option[1];
            const style = choice === id ? '' : 'secondary';

            choiceButtons += `
                <button class="btn ${style}" data-action="choose-${id}">
                    ${label}
                </button>
            `;
        }

        let response = '';

        if (choice === 'distance') {
            response = 'You can step away from Jake in the game. But can you simply stop caring about his feelings?';
        } else if (choice === 'stay') {
            response = 'You can stay close. But that was never the relationship you planned.';
        } else if (choice === 'unsure') {
            response = 'You hesitate. Why does this fictional decision feel so personal?';
        }

        let result = '';

        if (choice !== '') {
            result = `
                <div class="dialogue">${response}</div>
                <div class="quote">It's only a game.<br>So why do I care?</div>
                <div class="actions">${btn('OPEN THE REAL STORY →', 'next')}</div>
            `;
        }

        return frame(`
            <p class="eyebrow">04 / A choice you didn't expect</p>
            <h2>JAKE has feelings<br>for your Mii.</h2>
            <p>But you still want to be with Sunghoon. You can keep your distance from Jake. You can stay close. Or you can hesitate.</p>
            <p class="lead"><strong>What would you do?</strong></p>

            <div class="choices">${choiceButtons}</div>
            ${result}
        `);
    },

    // 5. The real story
    function () {
        return frame(`
            <p class="eyebrow">CASE FILE 001 / The real player</p>
            <h2>I knew it was<br>just a game.</h2>

            
            <div class="case">
                <p>I am a fan of the Korean idol group ENHYPEN, and my favorite member is Sunghoon.</p>

                <p>When I first came across <em>Tomodachi Life</em>, I liked the freedom to create characters. So, I created a Mii based on Sunghoon and another Mii that represents myself. My goal was very simple: I wanted these two characters to fall in love in the game.</p>

                <p>In order to achieve this goal, I tried various methods. I tried my best to let them spend time together, chat and exchange gifts, hoping that occasional interactions would help develop their relationship. I even searched the Internet for strategies to make two Miis fall in love, but I never succeeded.</p>
   
                <p>Later, I created a Mii based on Jake, another member of ENHYPEN.</p>

                <p>Unexpectedly, on Jake's second day on the island, something happened: Jake's Mii fell in love with the Mii that represented me at first sight.</p>

                <p>As a player, I always observed and managed the island from a godlike perspective. Although I created a Mii to represent myself, she was still a separate character in the game. I could manage different Miis and make choices for them during certain events, including how to respond to other characters' confessions.</p>

                <p>Because I had always hoped that my Mii would fall in love with Sunghoon's Mii, I chose to let her reject Jake.</p>

                <p>However, Jake's Mii did not stop showing affection after being rejected. Whenever he saw my Mii, he would blush, act shy and often want to confess again.</p>

                <p>These small interactions were unexpectedly cute. Gradually, I found that I was beginning to develop a more positive impression of Jake in real life.</p>

                <p>I knew very well that Jake in the game was just a virtual character I had created, but the emotions these interactions brought me were real.</p>
   
                <p>Later, after many attempts, Sunghoon's Mii finally fell in love with my Mii. I had achieved the goal I had wanted from the beginning.</p>

                <p>But to my surprise, while watching them fall in love in the game, I began to miss the moments when Jake used to blush, act shy and repeatedly express his affection. I even felt a little guilty for choosing to reject him in the beginning.</p>

                <p>I finally got the ending I wanted, but I found that my emotions had changed along the way.</p>

                <p><strong>“I was able to create characters and influence their choices, but I didn't expect that the behavior of these virtual characters would also affect me in reality.”</strong></p>
            </div>


            <div class="quote">
                The characters' feelings were fictional.<br>My reaction wasn't.
            </div>

            <p class="muted">This is one player's personal account, not evidence that every player experiences the same effect.</p>

            <div class="actions">
                ${btn('INVESTIGATE THE STORY →', 'next')}
            </div>
        `);
    },

    // 6. Investigation
    function () {
        const fileNames = [
            ['CONTROL', 'Who decides what happens?'],
            ['CHOICE', 'Why did I hesitate?'],
            ['FEELINGS', 'Why did I care?']
        ];

        let fileButtons = '';

        for (let i = 0; i < fileNames.length; i++) {
            const title = fileNames[i][0];
            const subtitle = fileNames[i][1];
            const active = selectedFile === i ? 'active' : '';

            fileButtons += `
                <button class="file ${active}" data-action="file-${i}">
                    <span class="num">FILE 0${i + 1}</span>
                    <strong>${title} ↗</strong>
                    <small>${subtitle}</small>
                </button>
            `;
        }

        return frame(`
            <p class="eyebrow">ACT 3 / The investigation</p>
            <h2>Why did this<br>matter to me?</h2>
            <p>Open the three case files. Each one examines a different part of the research.</p>

            <div class="files">${fileButtons}</div>
            <div class="research">${research[selectedFile]}</div>

            <div class="actions">
                ${btn('FINAL REFLECTION →', 'next')}
            </div>
        `);
    },

    // 7. Final reflection
    function () {
        const answers = [
            ['player', 'The player'],
            ['game', 'The game'],
            ['both', 'Both, together']
        ];

        let answerButtons = '';

        for (const answer of answers) {
            const id = answer[0];
            const label = answer[1];
            const style = finalAnswer === id ? 'yellow' : 'secondary';

            answerButtons += `
                <button class="btn ${style}" data-action="final-${id}">
                    ${label}
                </button>
            `;
        }

        let response = '';

        if (finalAnswer === 'player') {
            response = 'You brought your hopes and real-world preferences into the island.';
        } else if (finalAnswer === 'game') {
            response = 'The game generated an event you never planned.';
        } else {
            response = 'The story emerged from both: the game provided events, and you made them meaningful.';
        }

        return frame(`
            <div class="end">
                <p class="eyebrow">Epilogue / A question for you</p>
                <h2>Who wrote<br>the love story?</h2>
                <span class="bigheart">♡</span>

                <p>The player created the characters. The game created unexpected events. The player's own memories and emotions gave those events meaning.</p>

                <div class="choices" style="margin:25px auto;max-width:520px">
                    ${answerButtons}
                </div>

                <div class="dialogue" style="text-align:left">${response}</div>

                <div class="quote" style="text-align:left">
                    Maybe the love wasn't real.<br>But the feeling was.
                </div>

                <div class="actions" style="justify-content:center">
                    ${btn('PLAY AGAIN ↻', 'restart', 'secondary')}
                </div>
            </div>

            <details class="sources">
                <summary>Research notes & sources</summary>
                <p>This prototype includes conceptual analysis, not yet a completed scholarly literature review. Add verified academic sources and game references before submission. See the editable <code>research</code> content in <code>script.js</code>.</p>
                <p>Game referenced: Nintendo, <em>Tomodachi Life</em> (2013 Japan / 2014 international). This is an unofficial student project.</p>
            </details>
        `);
    }
];

// Research case files
// Add verified academic sources before submitting.



const research = [
  `<p class="eyebrow">FILE 01 / CONTROL</p>
  <h3>You made the Miis. Not their feelings.</h3>

  <p>Video games give players the ability to influence the virtual world, but this ability is always limited by the rules of the game. Player agency refers to the ability of players to influence the development of the game through their own actions. The action opportunities and restrictions provided by the game jointly determine how players can participate in the story.<sup>1</sup></p>

  <p><em>Tomodachi Life</em> embodies this limited control. Players can create Miis, design their appearance, personality and identity, and participate in the lives of the characters through daily interaction. However, romantic relationships are influenced by random events. Players can create two characters they want to see fall in love, but they can't directly make them fall in love.</p>

  <p>In my game, I kept trying to make Sunghoon's Mii fall in love with the Mii that represents me, but I never succeeded. On the contrary, Jake's Mii, who had just arrived on the island, unexpectedly fell in love with my Mii. The development of the game obviously deviated from my plan.</p>

  <p>This unpredictability shapes the relationship between players and characters. Players need to observe the characters' behavior and adjust their decisions according to emerging events. As a result, the characters show a certain degree of independence, which also makes players look forward to their subsequent actions.</p>

  <p>Random events also create more possibilities for the game. If all relationships could be directly decided by the player, the development of the story would be easier to predict. By limiting the player's control over the results, the game makes unexpected events an important part of the experience.</p>

  <p>Therefore, the story of <em>Tomodachi Life</em> is jointly shaped by players and the game system. Players have the power to create and manage characters, and the rules and random events in the game constantly change the direction set by the player.</p>

  <p class="citation"><sup>1</sup> Michael Mateas, “A Preliminary Poetics for Interactive Drama and Games,” <em>Digital Creativity</em> 12, no. 3 (2001): 140–52, https://doi.org/10.1076/digc.12.3.140.3224.</p>`,

  `<p class="eyebrow">FILE 02 / CHOICE</p>
  <h3>Having a choice doesn't make it easy.</h3>

  <p>In-game choices allow players to directly participate in the development of the story. When players can understand how their actions affect the results of the game, these actions are more meaningful.<sup>2</sup> The value of in-game choices is also related to how players understand and respond to the results.</p>

  <p>In <em>Tomodachi Life</em>, players can't decide when all events will happen, but they can intervene at some critical moments. For example, when a Mii wants to confess, the player can influence the progress of the confession and in some cases decide how to respond.</p>

  <p>This mechanism allows players to be both observers and participants in the story. The game system creates unexpected events, and players need to make judgments according to their own goals.</p>

  <p>When Jake's Mii unexpectedly fell in love with the Mii that represented me, I chose to let her reject Jake, because I hoped that she would eventually fall in love with Sunghoon's Mii. This decision reflects my agency as a player and my personal expectations for the relationship between the characters.</p>

  <p>Decisions in the game and their consequences can trigger players' emotional reactions.<sup>3</sup> When players personally participate in decisions, they may also have a sense of responsibility for the results.</p>

  <p>In my experience, rejecting Jake did not make the relationship meaningless. As the game continued to develop, I began to rethink the original decision and think about another possible outcome.</p>

  <p>This shows that the meaning of in-game choices can change with the player's experience. Players may have a clear goal when making a decision, but subsequent events can change their understanding of that decision.</p>

  <p>Therefore, meaningful choices involve not only what players can influence, but also how players face the consequences of choices and those possibilities that are not realized.</p>

  <p class="citation"><sup>2</sup> Katie Salen Tekinbas and Eric Zimmerman, <em>Rules of Play: Game Design Fundamentals</em> (Cambridge, MA: MIT Press, 2003), 33–37, ProQuest Ebook Central (accessed November 1, 2026).</p>

  <p class="citation"><sup>3</sup> Katherine Isbister, <em>How Games Move Us: Emotion by Design</em> (MIT Press, 2016), EBSCOhost.</p>`,

  `<p class="eyebrow">FILE 03 / FEELINGS</p>
  <h3>Knowing it's fiction doesn't erase emotion.</h3>

  <p>Different relationships can be established between players and virtual characters. Players may regard characters as tools, their own representatives, or individuals with independent identities.<sup>4</sup> These different ways of understanding will affect how players participate in the game and how they respond to the behavior of the characters.</p>

  <p>In <em>Tomodachi Life</em>, I created a Mii to represent myself, but I always managed the whole island from a godlike perspective. This Mii represents me, but she is still a separate character whose actions I can observe and sometimes influence.</p>

  <p>This relationship allows me not only to project my expectations onto the character, but also to understand her interactions with other characters from the perspective of a bystander.</p>

  <p>The game also allows Miis to show different emotions through expressions, actions and daily events. The appearance and identity of the characters provide the background for these behaviors, and players give them meaning according to their own experiences.</p>

  <p>For example, I created a Mii based on my real-life idol Jake. When he meets the Mii that represents me in the game, he often blushes, acts shy and tries to confess. These repeated behaviors gradually changed my impression of Jake in reality.</p>

  <p>Video games can trigger emotional reactions through character expressions and behaviour, interaction mechanisms and player choices.<sup>5</sup> Players' feelings about characters can also continue to develop through participation and interaction.</p>

  <p>When Sunghoon's Mii finally fell in love with the Mii that represented me, I began to miss the affection that Jake once showed, and even felt guilty for rejecting him. These feelings came from my memory of game events and my imagination of how another story might have developed.</p>

  <p>This experience also shows that the meaning of virtual characters can go beyond the settings originally given to them by players. I originally created characters according to my preference for idols, and the unexpected interactions in the game in turn affected my view of real people.</p>

  <p>Therefore, the emotional experience in the game comes from the interaction between character design, system behavior and the player's personal experience. Players can create characters and participate in their choices, and at the same time, they may experience unexpected genuine emotions in the process.</p>

  <p class="citation"><sup>4</sup> Jaime Banks, “Object, Me, Symbiote, Other: A Social Typology of Player-Avatar Relationships,” <em>First Monday</em> 20, no. 2 (2015), https://doi.org/10.5210/fm.v20i2.5433.</p>

  <p class="citation"><sup>5</sup> Isbister, <em>How Games Move Us</em>.</p>`
];



// Display the current screen

function render() {
    chapter.textContent = chapters[screen];
    fill.style.width = `${screen / (screens.length - 1) * 100}%`;
    app.innerHTML = screens[screen]();
}

// Story button events

app.addEventListener('click', function (event) {
    const element = event.target.closest('[data-action]');

    if (!element) {
        return;
    }

    const action = element.dataset.action;

    

    if (action === 'next') {
        go(Math.min(screen + 1, screens.length - 1));

  
        

    } else if (action === 'restart') {
        attempts = [];
        choice = '';
        selectedFile = 0;
        finalAnswer = 'both';
        go(0);

    } else if (action.startsWith('attempt-')) {
        const number = Number(action.split('-')[1]);

        if (!attempts.includes(number)) {
            attempts.push(number);
        }

        render();

    } else if (action === 'reveal') {
        document.querySelector('#reveal').innerHTML = `
            <div class="fade">
                <h2 class="pink">IT'S JAKE.</h2>
                <p>The islander you barely thought about.</p>
                ${btn('WHAT WOULD YOU DO? →', 'next')}
            </div>
        `;

    } else if (action.startsWith('choose-')) {
        choice = action.slice(7);
        render();

    } else if (action.startsWith('file-')) {
        selectedFile = Number(action.slice(5));
        render();

    } else if (action.startsWith('final-')) {
        finalAnswer = action.slice(6);
        render();
    }
});

// Sound settings

let audioCtx = null;
let soundOn = false;



const bgMusic = document.getElementById('bgMusic');

if (bgMusic && soundButton) {
    bgMusic.volume = 0.5;
    


    function updateSoundButton() {
        soundOn = !bgMusic.paused;
        soundButton.textContent = soundOn ? 'SOUND ON' : 'SOUND OFF';
        soundButton.setAttribute('aria-pressed', String(soundOn));
    }

    soundButton.addEventListener('click', async function () {
        if (bgMusic.paused) {
            try {
                await bgMusic.play();
            } catch (error) {
                console.error('Music playback failed:', error);
            }
        } else {
            bgMusic.pause();
        }

        updateSoundButton();
    });
}



// Button click sound

app.addEventListener('click', function (event) {
    if (!soundOn || !event.target.closest('button')) {
        return;
    }

    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }

        const oscillator = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.value = 620;

        gain.gain.setValueAtTime(0.035, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(
            0.001,
            audioCtx.currentTime + 0.11
        );

        oscillator.connect(gain);
        gain.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.11);

    } catch (error) {
        // The website still works if sound is unavailable.
    }
}, true);

// Start the website

render();
