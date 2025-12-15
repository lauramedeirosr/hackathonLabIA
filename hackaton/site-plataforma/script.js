/* =========================================================
   ESTADO GLOBAL + STORAGE
========================================================= */
let xp = Number(localStorage.getItem("xp")) || 0;
let history = JSON.parse(localStorage.getItem("history")) || [];
let badges = JSON.parse(localStorage.getItem("badges")) || [];

let detectedArea = "Geral";
let interviewType = "";
let questionStep = 0;
let answers = [];

/* =========================================================
   NÍVEIS / SENIORIDADE
========================================================= */
const levels = [
    { name: "Júnior", minXP: 0 },
    { name: "Pleno", minXP: 400 },
    { name: "Sênior", minXP: 800 }
];

let chatStep = "ASK_AREA"; 
// ASK_AREA → ASK_LEVEL → ASK_TYPE → READY
let detectedLevel = "";


/* =========================================================
   PERGUNTAS POR CARREIRA, NÍVEL E DIFICULDADE
========================================================= */
const interviewQuestions = {

    Frontend: {
        Júnior: {
            technical: [
                "O que é HTML semântico?",
                "Diferença entre class e id?",
                "O que é o DOM?",
                "O que é responsividade?",
                "Para que serve o JavaScript no frontend?"
            ],
            behavioral: [
                "Como você aprende algo novo?",
                "Como reage a erros?",
                "Prefere trabalhar em equipe ou sozinho?",
                "Como lida com feedback?",
                "Como organiza seus estudos?"
            ]
        },
        Pleno: {
            technical: [
                "Como funciona o Virtual DOM?",
                "Como melhorar performance frontend?",
                "O que é acessibilidade?",
                "Como organizar componentes?",
                "Quando usar estado global?"
            ],
            behavioral: [
                "Conte um conflito técnico.",
                "Como prioriza tarefas?",
                "Já refatorou código legado?",
                "Como ajuda colegas?",
                "Como lida com prazos?"
            ]
        },
        Sênior: {
            technical: [
                "Como definir arquitetura frontend?",
                "O que é design system?",
                "Trade-offs técnicos?",
                "Como escalar aplicações?",
                "Como garantir qualidade em times?"
            ],
            behavioral: [
                "Como lidera decisões?",
                "Como mentoraria um júnior?",
                "Como lida com pressão?",
                "Como resolve conflitos?",
                "Como equilibra negócio e técnica?"
            ]
        }
    },

    Backend: {
        Júnior: {
            technical: [
                "O que é API REST?",
                "O que é CRUD?",
                "Diferença entre GET e POST?",
                "O que é autenticação?",
                "O que é banco relacional?"
            ],
            behavioral: [
                "Como aprende novas tecnologias?",
                "Como lida com bugs?",
                "Como organiza código?",
                "Como recebe feedback?",
                "Como trabalha sob supervisão?"
            ]
        },
        Pleno: {
            technical: [
                "JWT e autenticação",
                "Diferença SQL vs NoSQL",
                "O que é escalabilidade?",
                "Versionamento de APIs",
                "Uso de filas"
            ],
            behavioral: [
                "Como resolve incidentes?",
                "Como comunica problemas?",
                "Como prioriza demandas?",
                "Como lida com pressão?",
                "Decisões técnicas difíceis?"
            ]
        },
        Sênior: {
            technical: [
                "Arquitetura distribuída",
                "Observabilidade",
                "Segurança de APIs",
                "Escalabilidade avançada",
                "Padrões arquiteturais"
            ],
            behavioral: [
                "Como lidera arquiteturas?",
                "Como gerencia conflitos?",
                "Como forma times?",
                "Como influencia decisões?",
                "Como equilibra negócio?"
            ]
        }
    },

    FullStack: {
        Júnior: {
            technical: [
                "Diferença frontend vs backend?",
                "O que é uma API?",
                "Como funciona HTTP?",
                "Noções de banco de dados?",
                "O que é Git?"
            ],
            behavioral: [
                "Como organiza estudos?",
                "Como lida com dificuldade?",
                "Trabalhar em várias frentes?",
                "Como recebe feedback?",
                "Como aprende rápido?"
            ]
        },
        Pleno: {
            technical: [
                "Integração frontend/backend",
                "Gerenciamento de estado",
                "Autenticação",
                "Performance full stack",
                "Deploy básico"
            ],
            behavioral: [
                "Como prioriza tarefas?",
                "Como resolve bugs complexos?",
                "Como trabalha com produto?",
                "Como colabora com time?",
                "Como lida com pressão?"
            ]
        },
        Sênior: {
            technical: [
                "Arquitetura full stack",
                "Escalabilidade",
                "Segurança",
                "Pipelines CI/CD",
                "Escolhas tecnológicas"
            ],
            behavioral: [
                "Como lidera decisões?",
                "Como orienta júniores?",
                "Como lida com riscos?",
                "Como equilibra técnica e negócio?",
                "Como toma decisões estratégicas?"
            ]
        }
    },

    DataAnalyst: {
        Júnior: {
            technical: [
                "O que é análise de dados?",
                "Ferramentas de BI?",
                "SQL básico",
                "Tipos de gráficos",
                "Limpeza de dados"
            ],
            behavioral: [
                "Como explica dados?",
                "Como aprende ferramentas?",
                "Como recebe feedback?",
                "Trabalha com prazos?",
                "Organização?"
            ]
        },
        Pleno: {
            technical: [
                "Dashboards avançados",
                "SQL intermediário",
                "KPIs",
                "Storytelling com dados",
                "Modelagem de dados"
            ],
            behavioral: [
                "Como traduz dados em insights?",
                "Como prioriza análises?",
                "Como lida com demandas?",
                "Comunicação com negócio?",
                "Tomada de decisão?"
            ]
        },
        Sênior: {
            technical: [
                "Estratégia de dados",
                "Arquitetura analítica",
                "Definição de métricas",
                "Data governance",
                "Automação de análises"
            ],
            behavioral: [
                "Como influencia decisões?",
                "Como lidera análises?",
                "Como orienta times?",
                "Como lida com pressão?",
                "Visão estratégica?"
            ]
        }
    },

    DevOps: {
        Júnior: {
            technical: [
                "O que é DevOps?",
                "CI/CD básico",
                "Containers",
                "Cloud básica",
                "Versionamento"
            ],
            behavioral: [
                "Trabalha sob pressão?",
                "Como aprende rápido?",
                "Colaboração?",
                "Organização?",
                "Comunicação?"
            ]
        },
        Pleno: {
            technical: [
                "Pipelines CI/CD",
                "Infra como código",
                "Monitoramento",
                "Automação",
                "Cloud intermediário"
            ],
            behavioral: [
                "Como resolve incidentes?",
                "Comunicação em crise?",
                "Priorização?",
                "Colaboração?",
                "Responsabilidade?"
            ]
        },
        Sênior: {
            technical: [
                "Arquitetura cloud",
                "Alta disponibilidade",
                "Segurança",
                "Escalabilidade",
                "Observabilidade"
            ],
            behavioral: [
                "Como lidera incidentes?",
                "Como define padrões?",
                "Como orienta times?",
                "Gestão de risco?",
                "Visão estratégica?"
            ]
        }
    }
};



function getCurrentLevel() {
    return levels.slice().reverse().find(l => xp >= l.minXP);
}


/* =========================================================
   PERGUNTAS POR CARREIRA E NÍVEL (DINÂMICO)
========================================================= */
function getInterviewQuestions() {
    const level = getCurrentLevel().name;
    const careerQuestions = interviewQuestions[detectedArea] || interviewQuestions["Frontend"];

    const questions = {
        technical: careerQuestions[level]?.technical || [],
        behavioral: careerQuestions[level]?.behavioral || []
    };

    return questions;
}


/* =========================================================
   CHATBOT — RECRUTADORA TECH (CONVERSA REAL)
========================================================= */
function sendChatMessage() {
    const input = document.getElementById("chatInput");
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    const lower = text.toLowerCase();

    setTimeout(() => {

        /* ===============================
           ETAPA 1 — ESCOLHER ÁREA
        =============================== */
        if (chatStep === "ASK_AREA") {
            detectedArea = normalizeArea(text);

            if (detectedArea === "Geral") {
                addMessage(
                    `Certo 🙂  
Para eu te ajudar melhor, me diga qual área você quer treinar.

Exemplos:
• Frontend  
• Backend  
• Dados  
• QA  
• DevOps`,
                    "agent"
                );
                return;
            }

            chatStep = "ASK_LEVEL";
            addMessage(
                `Perfeito 👍  
Então você quer seguir carreira em ${detectedArea}.

Agora me diga:
👉 você está buscando uma vaga Júnior, Pleno ou Sênior?`,
                "agent"
            );
            return;
        }

        /* ===============================
           ETAPA 2 — ESCOLHER NÍVEL
        =============================== */
        if (chatStep === "ASK_LEVEL") {
            if (lower.includes("junior")) detectedLevel = "Júnior";
            else if (lower.includes("pleno")) detectedLevel = "Pleno";
            else if (lower.includes("senior") || lower.includes("sênior")) detectedLevel = "Sênior";
            else {
                addMessage(
                    `Não consegui identificar o nível 🤔  
Responda apenas com Júnior, Pleno ou Sênior.`,
                    "agent"
                );
                return;
            }

            chatStep = "ASK_TYPE";
            addMessage(
                `Ótimo. Vou considerar seu nível como ${detectedLevel}.

Agora me diga:
1️⃣ Entrevista comportamental 
2️⃣ Entrevista técnica

Responda com 1 ou 2.`,
                "agent"
            );
            return;
        }

        /* ===============================
           ETAPA 3 — ESCOLHER TIPO
        =============================== */
        if (chatStep === "ASK_TYPE") {
            if (text === "1") {
                chatStep = "READY";
                addMessage(
                    `Perfeito 😊  
Vamos começar pela entrevista **comportamental**.

Responda com calma e sinceridade.
A primeira pergunta já vai aparecer.`,
                    "agent"
                );
                startInterview("behavioral");
                return;
            }

            if (text === "2") {
                chatStep = "READY";
                addMessage(
                    `Ótimo 😊  
Vamos começar pela entrevista técnica.

Vou avaliar seu raciocínio e clareza.
A primeira pergunta já vai aparecer.`,
                    "agent"
                );
                startInterview("technical");
                return;
            }

            addMessage(
                `Responda apenas com 1 (comportamental) ou 2 (técnica).`,
                "agent"
            );
            return;
        }

        /* ===============================
           APÓS INÍCIO DA ENTREVISTA
        =============================== */
        addMessage(
            `Agora estamos na entrevista 😊  
Responda às perguntas que aparecem na tela.`,
            "agent"
        );

    }, 400);
}



function addMessage(text, sender) {
    const chatBox = document.getElementById("chatBox");
    const div = document.createElement("div");
    div.className = `message ${sender}`;
    div.innerText = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function normalizeArea(text) {
    text = text.toLowerCase();
    if (text.includes("front")) return "Frontend";
    if (text.includes("back")) return "Backend";
    if (text.includes("full")) return "Full Stack";
    if (text.includes("dados")) return "Analista de Dados";
    if (text.includes("cient")) return "Cientista de Dados";
    if (text.includes("qa")) return "QA";
    if (text.includes("devops")) return "DevOps";
    if (text.includes("ux")) return "UX Designer";
    if (text.includes("ui")) return "UI Designer";
    if (text.includes("produto") || text.includes("pm")) return "Product Manager";
    return "Geral";
}

/* =========================================================
   ENTREVISTA — TÉCNICA x COMPORTAMENTAL (RECRUTADORA)
========================================================= */
function startInterview(type) {
    interviewType = type;
    questionStep = 0;
    answers = [];

    showSection("practice");

    addMessage(
        type === "technical"
            ? "Vamos iniciar a entrevista técnica. Foque em decisões, ferramentas e boas práticas."
            : "Vamos iniciar a entrevista comportamental. Use a metodologia STAR.",
        "agent"
    );

    nextQuestion();
}

/* =========================
   PERGUNTAS COMPORTAMENTAIS (STAR)
========================= */
const behavioralQuestions = [
    {
        question: "Situação: descreva um desafio profissional relevante que você enfrentou.",
        recruiterTip: "Quero entender o contexto. Seja claro e objetivo."
    },
    {
        question: "Tarefa: qual era exatamente a sua responsabilidade nesse cenário?",
        recruiterTip: "Aqui avaliamos clareza de papel e responsabilidade."
    },
    {
        question: "Ação: quais ações você tomou para resolver o problema?",
        recruiterTip: "Explique suas decisões e por quê."
    },
    {
        question: "Resultado: qual foi o impacto final da sua ação?",
        recruiterTip: "Resultados mensuráveis fazem muita diferença."
    },
    {
        question: "Aprendizado: o que você faria diferente hoje?",
        recruiterTip: "Autocrítica é muito valorizada."
    }
];

/* =========================
   PERGUNTAS TÉCNICAS
========================= */
const technicalQuestions = [
    {
        question: "Explique um conceito técnico essencial da sua área.",
        recruiterTip: "Explique como se eu fosse técnica, mas não da sua stack."
    },
    {
        question: "Descreva um problema técnico complexo que você já resolveu.",
        recruiterTip: "Quero entender sua lógica e abordagem."
    },
    {
        question: "Quais ferramentas ou tecnologias você utilizou e por quê?",
        recruiterTip: "Justifique escolhas técnicas."
    },
    {
        question: "Como você garante qualidade e manutenibilidade do código?",
        recruiterTip: "Aqui avaliamos boas práticas."
    },
    {
        question: "Como você lida com bugs em produção?",
        recruiterTip: "Mostre maturidade técnica e responsabilidade."
    }
];

/* =========================
   EXIBIR PRÓXIMA PERGUNTA
========================= */
let timer;

function nextQuestion() {
    const level = getCurrentLevel().name;

    const careerData =
        interviewQuestions[detectedArea] ||
        interviewQuestions["Frontend"];

    const questions =
        interviewType === "behavioral"
            ? careerData[level].behavioral
            : careerData[level].technical;

    if (questionStep >= questions.length) {
        finishInterview();
        return;
    }

    document.getElementById("questionText").innerText =
        questions[questionStep];

    startTimer();

    addMessage(
        interviewType === "technical"
            ? "💬 Recrutadora: explique seu raciocínio técnico com clareza."
            : "💬 Recrutadora: use a metodologia STAR (Situação, Tarefa, Ação, Resultado).",
        "agent"
    );
}


function startTimer() {
    let timeLeft = 60; // 60 segundos por pergunta
    const timerDisplay = document.getElementById("timer");

    if (!timerDisplay) return;

    clearInterval(timer);

    timerDisplay.innerText = `⏱ Tempo restante: ${timeLeft}s`;

    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = `⏱ Tempo restante: ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            submitAnswer();
        }
    }, 1000);
}

/* =========================
   ENVIAR RESPOSTA
========================= */
function submitAnswer() {
    const input = document.getElementById("answerInput");
    const text = input.value.trim();
    if (!text) return;

    answers.push(text);
    input.value = "";
    questionStep++;
    xp += 40;

    addMessage("Resposta registrada. Vamos para a próxima.", "agent");

    nextQuestion();
}

/* =========================================================
   ANÁLISE DAS RESPOSTAS
========================================================= */
function analyzeAnswers() {
    let soft = 0;
    let hard = 0;

    answers.forEach(a => {
        if (a.length > 80) soft += 2;
        if (a.match(/\d|%|impacto|resultado/i)) soft += 1;
        if (a.match(/api|sql|react|node|docker|cloud|teste|deploy|kpi/i))
            hard += 2;
    });

    const finalScore = Math.min(10, Math.round((soft + hard) / 2));
    return { soft, hard, finalScore };
}

/* =========================================================
   FINALIZAR ENTREVISTA
========================================================= */
function finishInterview() {
    const analysis = analyzeAnswers();
    const level = getCurrentLevel().name;

    history.push({
        date: new Date().toLocaleString(),
        area: detectedArea,
        type: interviewType,
        score: analysis.finalScore,
        level
    });

    localStorage.setItem("history", JSON.stringify(history));
    localStorage.setItem("xp", xp);

    generateFeedbackUI(analysis, level);
    generateStudyPlanByCareer(level);
    generateJobRecommendations(level);
    generateRanking();
    generateHistory();
    updateProgressBar();
    unlockBadges(analysis.finalScore);
    generatePDFReport(analysis, level);

    showSection("feedback");
}


/* =========================================================
   FEEDBACK
========================================================= */
function generateFeedbackUI(analysis, level) {
    const positive = document.getElementById("feedbackPositive");
    const improve = document.getElementById("feedbackImprove");

    positive.innerHTML = "";
    improve.innerHTML = "";

    positive.innerHTML += `<li>Comunicação adequada para ${level}</li>`;
    positive.innerHTML += `<li>Boa organização das respostas</li>`;

    if (analysis.hard < 4)
        improve.innerHTML += `<li>Adicionar exemplos técnicos</li>`;
    if (analysis.soft < 4)
        improve.innerHTML += `<li>Detalhar impacto</li>`;
}

function generateStudyPlanByCareer(level) {
    const plans = {
        Frontend: {
            Júnior: ["HTML/CSS", "JavaScript", "React"],
            Pleno: ["Performance", "Acessibilidade"],
            Sênior: ["Arquitetura", "Design System"]
        },
        Backend: {
            Júnior: ["APIs", "Banco de dados"],
            Pleno: ["Escalabilidade"],
            Sênior: ["Cloud", "Arquitetura"]
        },
        Geral: {
            Júnior: ["Fundamentos"],
            Pleno: ["Boas práticas"],
            Sênior: ["Arquitetura"]
        }
    };

    const list = document.getElementById("studyPlan");
    if (!list) return;

    list.innerHTML = "";
    (plans[detectedArea]?.[level] || plans.Geral[level]).forEach(p => {
        list.innerHTML += `<li>${p}</li>`;
    });
}

function generateJobRecommendations(level) {
    const jobs = {
        Júnior: ["Dev Júnior", "Estágio"],
        Pleno: ["Dev Pleno", "Analista"],
        Sênior: ["Tech Lead", "Arquiteto"]
    };

    const list = document.getElementById("jobList");
    if (!list) return;

    list.innerHTML = "";
    jobs[level].forEach(j => {
        list.innerHTML += `<li>${j}</li>`;
    });
}

/* =========================================================
   GAMIFICAÇÃO
========================================================= */
function unlockBadges(score) {
    if (score >= 9) addBadge("🥇", "Alta Performance");
    else if (score >= 7) addBadge("🥈", "Boa Performance");
    else addBadge("🥉", "Participação");
}

function addBadge(icon, title) {
    if (!badges.find(b => b.title === title)) {
        badges.push({ icon, title });
        localStorage.setItem("badges", JSON.stringify(badges));
        renderBadges();
    }
}

function renderBadges() {
    const container = document.getElementById("badgesList");
    if (!container) return;

    container.innerHTML = "";
    badges.forEach(b => {
        container.innerHTML += `<div class="badge" title="${b.title}">${b.icon}</div>`;
    });
}

/* =========================================================
   RANKING
========================================================= */
function generateRanking() {
    const ranking = [
        { name: "Você", score: xp },
        { name: "Ana", score: 820 },
        { name: "Carlos", score: 650 },
        { name: "Marina", score: 580 }
    ].sort((a, b) => b.score - a.score);

    const list = document.getElementById("rankingList");
    if (!list) return;

    list.innerHTML = "";
    ranking.forEach((r, i) => {
        list.innerHTML += `<li>#${i + 1} ${r.name} — ${r.score} XP</li>`;
    });
}

function generateHistory() {
    const list = document.getElementById("historyList");
    if (!list) return;

    list.innerHTML = "";
    history.forEach((h, i) => {
        list.innerHTML += `
        <li>
            ${i + 1}. ${h.date} | ${h.area} | ${h.score}/10 | ${h.level}
        </li>`;
    });
}

/* =========================================================
   PROGRESSO
========================================================= */
function updateProgressBar() {
    const level = getCurrentLevel();
    const next = levels.find(l => l.minXP > level.minXP);

    document.getElementById("levelLabel").innerText = `Nível: ${level.name}`;

    if (next) {
        const percent = ((xp - level.minXP) / (next.minXP - level.minXP)) * 100;
        document.getElementById("xpBar").style.width = `${percent}%`;
        document.getElementById("xpLabel").innerText = `${xp}/${next.minXP} XP`;
    } else {
        document.getElementById("xpBar").style.width = "100%";
        document.getElementById("xpLabel").innerText = `${xp} XP`;
    }
}

/* =========================================================
   PDF
========================================================= */
function generatePDFReport(analysis, level) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("InterviewBot IA — Relatório", 20, 20);
    doc.setFontSize(12);
    doc.text(`Área: ${detectedArea}`, 20, 40);
    doc.text(`Nível: ${level}`, 20, 50);
    doc.text(`Nota: ${analysis.finalScore}/10`, 20, 60);

    doc.save("relatorio-entrevista.pdf");
}

/* =========================================================
   UI
========================================================= */
function showSection(id) {
    document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");

    // ATIVA MENU
    updateActiveSidebar(id);

    // 🔥 SE FOR CURSOS & VAGAS, RENDERIZA
    if (id === "cursosVagas") {
        filtrarConteudos();
    }
}



/* =========================================================
   SCORE DE EMPREGABILIDADE
========================================================= */
function calculateEmployabilityScore(score, level) {
    let employability = score * 10;

    if (level === "Pleno") employability += 10;
    if (level === "Sênior") employability += 20;

    if (employability > 100) employability = 100;
    return employability;
}

/* =========================================================
   EXIBIR SCORE DE EMPREGABILIDADE
========================================================= */
function showEmployabilityScore(score, level) {
    const value = calculateEmployabilityScore(score, level);
    const container = document.getElementById("employabilityScore");
    if (!container) return;

    container.innerHTML = `
        <strong>Score de Empregabilidade:</strong> ${value} / 100
    `;
}

/* =========================================================
   RELATÓRIO COMPARATIVO VISUAL
========================================================= */
function generateComparativeReportVisual() {
    if (history.length < 2) return;

    const last = history[history.length - 1];
    const prev = history[history.length - 2];

    const diff = last.score - prev.score;
    const container = document.getElementById("comparativeReport");

    if (!container) return;

    let message = "";
    if (diff > 0) {
        message = `📈 Evolução de +${diff} pontos desde a última entrevista`;
    } else if (diff < 0) {
        message = `📉 Queda de ${Math.abs(diff)} pontos. Revise fundamentos`;
    } else {
        message = "➡️ Desempenho estável. Busque aprofundar exemplos";
    }

    container.innerText = message;
}

/* =========================================================
   EXPORTAR HISTÓRICO COMPLETO EM PDF
========================================================= */
function exportHistoryPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Histórico de Entrevistas - InterviewBot IA", 20, 20);

    doc.setFontSize(11);
    history.forEach((h, i) => {
        doc.text(
            `${i + 1}. ${h.date} | ${h.area} | ${h.score}/10 | ${h.level}`,
            20,
            35 + i * 8
        );
    });

    doc.save("historico-entrevistas.pdf");
}

/* =========================================================
   RESET TOTAL DE PROGRESSO
========================================================= */
function resetProgress() {
    if (!confirm("Deseja apagar todo o progresso?")) return;

    xp = 0;
    history = [];
    badges = [];

    localStorage.removeItem("xp");
    localStorage.removeItem("history");
    localStorage.removeItem("badges");

    updateProgressBar();
    generateRanking();
    generateHistory();
    renderBadges();

    alert("Progresso apagado com sucesso.");
}


/* =========================================================
   AUTO-SALVAMENTO
========================================================= */
window.addEventListener("beforeunload", () => {
    localStorage.setItem("xp", xp);
    localStorage.setItem("history", JSON.stringify(history));
    localStorage.setItem("badges", JSON.stringify(badges));
});



/* =========================================================
   SIDEBAR ATIVA AUTOMATICAMENTE
========================================================= */
function updateActiveSidebar(sectionId) {
    const links = document.querySelectorAll(".sidebar ul li a");

    links.forEach(link => {
        link.classList.remove("active");

        const onclick = link.getAttribute("onclick");
        if (onclick && onclick.includes(sectionId)) {
            link.classList.add("active");
        }
    });
}




/* =========================================================
   TRILHAS DE APRENDIZADO — CURSOS UDEMY (REAIS)
========================================================= */
let conteudos = [
    // ================= FRONTEND =================
    {
        id: 1,
        tipo: "curso",
        trilha: "Frontend",
        titulo: "HTML5 e CSS3 Completo",
        descricao: "Curso completo para iniciantes em Frontend.",
        nivel: "Júnior",
        area: "Frontend",
        plataforma: "Udemy",
        link: "https://www.udemy.com/course//",
        fav: false,
        done: false
    },
    {
        id: 2,
        tipo: "curso",
        trilha: "Frontend",
        titulo: "JavaScript Completo 2024",
        descricao: "JavaScript do zero ao avançado.",
        nivel: "Pleno",
        area: "Frontend",
        plataforma: "Udemy",
        link: "https://www.udemy.com/course//",
        fav: false,
        done: false
    },
    {
        id: 3,
        tipo: "curso",
        trilha: "Frontend",
        titulo: "React + Redux",
        descricao: "React moderno com hooks e Redux.",
        nivel: "Pleno",
        area: "Frontend",
        plataforma: "Udemy",
        link: "https://www.udemy.com/course//",
        fav: false,
        done: false
    },

    // ================= BACKEND =================
    {
        id: 4,
        tipo: "curso",
        trilha: "Backend",
        titulo: "Node.js",
        descricao: "APIs REST modernas com Node.js.",
        nivel: "Pleno",
        area: "Backend",
        plataforma: "Udemy",
        link: "https://www.udemy.com/course//",
        fav: false,
        done: false
    },
    {
        id: 5,
        tipo: "curso",
        trilha: "Backend",
        titulo: "Java Completo",
        descricao: "Java do básico ao avançado.",
        nivel: "Pleno",
        area: "Backend",
        plataforma: "Udemy",
        link: "https://www.udemy.com/course//",
        fav: false,
        done: false
    },

    // ================= DADOS =================
    {
        id: 6,
        tipo: "curso",
        trilha: "Dados",
        titulo: "SQL para Análise de Dados",
        descricao: "Consultas SQL focadas em dados.",
        nivel: "Júnior",
        area: "Dados",
        plataforma: "Udemy",
        link: "https://www.udemy.com/course//",
        fav: false,
        done: false
    },
    {
        id: 7,
        tipo: "curso",
        trilha: "Dados",
        titulo: "Python para Data Science",
        descricao: "Python aplicado à ciência de dados.",
        nivel: "Pleno",
        area: "Dados",
        plataforma: "Udemy",
        link: "https://www.udemy.com/course//",
        fav: false,
        done: false
    },

    // ================= DEVOPS =================
    {
        id: 8,
        tipo: "curso",
        trilha: "DevOps",
        titulo: "Docker e Kubernetes",
        descricao: "Containers e orquestração.",
        nivel: "Pleno",
        area: "DevOps",
        plataforma: "Udemy",
        link: "https://www.udemy.com/course//",
        fav: false,
        done: false
    },

    // ================= UX/UI =================
    {
        id: 9,
        tipo: "curso",
        trilha: "UX/UI",
        titulo: "UX Design do Zero",
        descricao: "Fundamentos de UX e usabilidade.",
        nivel: "Júnior",
        area: "UX/UI",
        plataforma: "Udemy",
        link: "https://www.udemy.com/course//",
        fav: false,
        done: false
    }
];

/* =========================================================
   STORAGE
========================================================= */
function salvarEstado() {
    localStorage.setItem("conteudos", JSON.stringify(conteudos));
}

function carregarEstado() {
    const salvo = localStorage.getItem("conteudos");
    if (salvo) conteudos = JSON.parse(salvo);
}

/* =========================================================
   RENDER
========================================================= */
function renderConteudos(lista) {
    const grid = document.getElementById("conteudosGrid");
    if (!grid) return;

    grid.innerHTML = lista.map(item => `
        <div class="conteudo-card ${item.done ? "done" : ""}">
            <span class="trilha-badge">${item.trilha}</span><br>
            <span class="udemy-badge">Udemy</span>

            <h3>${item.titulo}</h3>
            <div class="meta">${item.area} • ${item.nivel}</div>
            <p>${item.descricao}</p>

            <div class="course-actions">
                <button class="btn-fav ${item.fav ? "active" : ""}"
                    onclick="toggleFav(${item.id})">⭐ Favoritar</button>
                <button class="btn-done ${item.done ? "active" : ""}"
                    onclick="toggleDone(${item.id})">✅ Concluído</button>
            </div>

            <a href="${item.link}" target="_blank" class="btn-primary" style="margin-top:12px">
                Acessar curso
            </a>
        </div>
    `).join("");
}

/* =========================================================
   AÇÕES
========================================================= */
function toggleFav(id) {
    const item = conteudos.find(c => c.id === id);
    item.fav = !item.fav;
    salvarEstado();
    renderConteudos(conteudos);
}

function toggleDone(id) {
    const item = conteudos.find(c => c.id === id);
    item.done = !item.done;
    salvarEstado();
    renderConteudos(conteudos);
}


/* =========================================================
   PROGRESSO POR TRILHA
========================================================= */
function calcularProgressoTrilhas() {
    const trilhas = {};

    conteudos
        .filter(c => c.tipo === "curso")
        .forEach(curso => {
            if (!trilhas[curso.trilha]) {
                trilhas[curso.trilha] = { total: 0, done: 0 };
            }
            trilhas[curso.trilha].total++;
            if (curso.done) trilhas[curso.trilha].done++;
        });

    return trilhas;
}

/* =========================================================
   TRILHA RECOMENDADA
========================================================= */
function obterTrilhaRecomendada(trilhas) {
    let menorProgresso = 101;
    let recomendada = null;

    for (let t in trilhas) {
        const pct = (trilhas[t].done / trilhas[t].total) * 100;
        if (pct < menorProgresso) {
            menorProgresso = pct;
            recomendada = t;
        }
    }
    return recomendada;
}

/* =========================================================
   OVERRIDE RENDER PARA INCLUIR PROGRESSO
========================================================= */
const renderOriginal = renderConteudos;

renderConteudos = function(lista) {
    const trilhas = calcularProgressoTrilhas();
    const recomendada = obterTrilhaRecomendada(trilhas);

    const grid = document.getElementById("conteudosGrid");
    if (!grid) return;

    grid.innerHTML = lista.map(item => {
        if (item.tipo === "curso") {
            const progresso = trilhas[item.trilha];
            const pct = Math.round((progresso.done / progresso.total) * 100);

            return `
            <div class="conteudo-card ${item.done ? "done" : ""} ${item.trilha === recomendada ? "recommended-trilha" : ""}">
                <span class="trilha-badge">${item.trilha}</span>
                <span class="udemy-badge">Udemy</span>

                <div class="trilha-progress">
                    <span>Progresso da trilha: ${pct}%</span>
                    <div class="trilha-bar">
                        <div class="trilha-bar-fill" style="width:${pct}%"></div>
                    </div>
                </div>

                <h3>${item.titulo}</h3>
                <p>${item.descricao}</p>

                <div class="course-actions">
                    <button class="btn-fav ${item.fav ? "active" : ""}"
                        onclick="toggleFav(${item.id})">⭐ Favoritar</button>
                    <button class="btn-done ${item.done ? "active" : ""}"
                        onclick="toggleDone(${item.id})">✅ Concluído</button>
                </div>

                <a href="${item.link}" target="_blank" class="btn-primary" style="margin-top:12px">
                    Acessar curso
                </a>
            </div>`;
        }

        // ================= VAGAS =================
        return `
        <div class="vaga-card">
            <div class="vaga-badges">
                <span class="vaga-badge level">${item.nivel}</span>
                <span class="vaga-badge area">${item.area}</span>
            </div>

            <h3>${item.titulo}</h3>
            <p>${item.descricao}</p>

            <button class="btn-primary">Ver vaga</button>
            <button class="btn-save-vaga">⭐ Salvar vaga</button>
        </div>`;
    }).join("");
};

/* =========================================================
   INICIALIZAÇÃO CORRETA DA SEÇÃO CURSOS & VAGAS
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    carregarEstado();

    // garante que os cursos apareçam ao entrar
    if (document.getElementById("conteudosGrid")) {
        renderConteudos(conteudos);
    }
});

function filtrarConteudos() {
    const tipo = document.getElementById("tipoSelect")?.value || "todos";
    const nivel = document.getElementById("nivelSelect")?.value || "todos";
    const area = document.getElementById("areaSelect")?.value || "todos";

    let filtrados = conteudos;

    if (tipo !== "todos") {
        filtrados = filtrados.filter(c => c.tipo === tipo);
    }

    if (nivel !== "todos") {
        filtrados = filtrados.filter(c => c.nivel === nivel);
    }

    if (area !== "todos") {
        filtrados = filtrados.filter(c => c.area === area);
    }

    renderConteudos(filtrados);
}


/* =========================================================
   TRILHAS COM ETAPAS (GAMIFICAÇÃO PROFISSIONAL)
========================================================= */
const trilhas = {
    Frontend: [
        { id: "fe1", nome: "Fundamentos (HTML & CSS)", concluido: false },
        { id: "fe2", nome: "JavaScript Básico", concluido: false },
        { id: "fe3", nome: "Framework (React)", concluido: false },
        { id: "fe4", nome: "Projeto Prático", concluido: false },
        { id: "fe5", nome: "Simulação de Entrevista", concluido: false }
    ],
    Backend: [
        { id: "be1", nome: "Lógica e APIs", concluido: false },
        { id: "be2", nome: "Banco de Dados", concluido: false },
        { id: "be3", nome: "Autenticação", concluido: false },
        { id: "be4", nome: "Projeto Backend", concluido: false },
        { id: "be5", nome: "Entrevista Técnica", concluido: false }
    ]
};

/* =========================================================
   PROGRESSO DAS TRILHAS
========================================================= */
function calcularProgressoTrilha(nomeTrilha) {
    const etapas = trilhas[nomeTrilha];
    const total = etapas.length;
    const concluidas = etapas.filter(e => e.concluido).length;
    return Math.round((concluidas / total) * 100);
}

/* =========================================================
   FEEDBACK HUMANO E MOTIVACIONAL
========================================================= */
function gerarFeedbackHumano(trilha) {
    const progresso = calcularProgressoTrilha(trilha);

    if (progresso === 0) {
        return `Estamos só começando 🚀  
Não se preocupe, todo mundo começa do zero.  
Vamos dar o primeiro passo juntos.`;
    }

    if (progresso < 40) {
        return `Você já saiu da inércia 👏  
Continue avançando, constância é mais importante que velocidade.`;
    }

    if (progresso < 70) {
        return `Você está no caminho certo 💪  
Esse é o ponto onde muita gente desiste — siga firme.`;
    }

    if (progresso < 100) {
        return `Falta pouco! 🔥  
Finalize essa trilha e você estará pronto(a) para entrevistas reais.`;
    }

    return `Parabéns 🎉  
Você concluiu a trilha ${trilha}.  
Isso é uma conquista real — você evoluiu de verdade.`;
}


/* =========================================================
   CONCLUIR ETAPA DA TRILHA
========================================================= */
function concluirEtapa(trilha, etapaId) {
    const etapa = trilhas[trilha].find(e => e.id === etapaId);
    if (!etapa || etapa.concluido) return;

    etapa.concluido = true;

    const progresso = calcularProgressoTrilha(trilha);
    const feedback = gerarFeedbackHumano(trilha);

    alert(`Progresso da trilha ${trilha}: ${progresso}%\n\n${feedback}`);
}

