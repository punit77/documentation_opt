async function loadYAML(path) {
    const res = await fetch(path);
    const txt = await res.text();
    return jsyaml.load(txt);
}

/* ============================
   INDEX PAGE
============================= */
async function loadSections() {
    const data = await loadYAML("content/sections.yml");
    const container = document.getElementById("sectionList");

    data.sections.forEach(sec => {
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `<h3>${sec.title}</h3>`;
        div.onclick = () => window.location = `section.html?id=${sec.id}`;
        container.appendChild(div);
    });
}

/* ============================
   SECTION PAGE
============================= */
async function loadQueries() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const secData = await loadYAML("content/sections.yml");
    const secInfo = secData.sections.find(s => s.id === id);
    document.getElementById("sectionTitle").innerText = secInfo.title;

    const qData = await loadYAML(`content/queries/${id}.yml`);
    const container = document.getElementById("queryList");

    qData.queries.forEach(q => {
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `
            <h3>${q.title}</h3>
            <div class="separator"></div>
        `;
        div.onclick = () => window.location = `query.html?sid=${id}&qid=${q.id}`;
        container.appendChild(div);
    });
}

/* ============================
   QUERY PAGE
============================= */
async function loadQueryView() {
    const params = new URLSearchParams(window.location.search);
    const sid = params.get("sid");
    const qid = params.get("qid");

    document.getElementById("backBtn").href = `section.html?id=${sid}`;

    const qData = await loadYAML(`content/queries/${sid}.yml`);
    const query = qData.queries.find(q => q.id === qid);
    document.getElementById("queryTitle").innerText = query.title;

    let sql = query.sql;

    sql = sql.replace(/\[([A-Za-z0-9_]+)\]/g,
        `<a href="definition.html?name=$1">[$1]</a>`
    );

    document.getElementById("sqlBox").innerHTML = sql;
}

/* ============================
   DEFINITION PAGE
============================= */
async function loadDefinition() {
    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");

    const def = await loadYAML(`content/definitions/${name.toLowerCase()}.yml`);


    document.getElementById("defTitle").innerText = name;
    document.getElementById("definitionBox").innerText = def.definition;
}
