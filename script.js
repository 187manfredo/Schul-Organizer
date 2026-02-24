// =====================
// DATEN
// =====================

let faecherVorgabe = [
"Mathematik","Deutsch","Englisch","Französisch","Latein","Spanisch",
"Biologie","Chemie","Physik","Geschichte","Geographie",
"Politik / Sozialkunde","Musik","Kunst","Sport",
"Informatik / Computerwissenschaften",
"Philosophie / Ethik / Religion","Wirtschaft / Recht"
];

let faecherHinzu = JSON.parse(localStorage.getItem("faecherHinzu")) || [];
let noten = JSON.parse(localStorage.getItem("noten")) || {};
let aufgaben = JSON.parse(localStorage.getItem("aufgaben")) || [];
let klausuren = JSON.parse(localStorage.getItem("klausuren")) || {};


// =====================
// SPEICHERN
// =====================

function speichern(){
    localStorage.setItem("aufgaben", JSON.stringify(aufgaben));
    localStorage.setItem("klausuren", JSON.stringify(klausuren));
    localStorage.setItem("faecherHinzu", JSON.stringify(faecherHinzu));
    localStorage.setItem("noten", JSON.stringify(noten));
}


// =====================
// TABS
// =====================

window.openTab = function(tab){
    document.querySelectorAll(".tabcontent")
        .forEach(t => t.style.display="none");

    document.getElementById(tab).style.display="block";

    if(tab==="hausaufgaben") faecherDropdownHA();
    if(tab==="klausuren") faecherDropdownKlausur();
    if(tab==="noten") anzeigenFaecher();
};


// =====================
// HAUSAUFGABEN
// =====================

function faecherDropdownHA(){
    let sel = document.getElementById("fachHA");
    if(!sel) return;

    sel.innerHTML="";
    faecherVorgabe.forEach(f=>{
        let opt=document.createElement("option");
        opt.value=f;
        opt.textContent=f;
        sel.appendChild(opt);
    });
}

window.hinzufuegenHA = function(){
    let fach=document.getElementById("fachHA").value;
    let aufgabe=document.getElementById("aufgabe").value;
    let datum=document.getElementById("datum").value;

    if(!aufgabe || !datum){
        alert("Bitte alles ausfüllen!");
        return;
    }

    aufgaben.push({fach,aufgabe,datum,erledigt:false});
    speichern();
    anzeigenHA();
};

function anzeigenHA(){
    let liste=document.getElementById("listeHA");
    if(!liste) return;

    aufgaben.sort((a,b)=> new Date(a.datum) - new Date(b.datum));
    liste.innerHTML="";

    aufgaben.forEach((a,i)=>{
        let li=document.createElement("li");
        li.innerHTML=`
        <strong>${a.fach}</strong> - ${a.aufgabe} (${a.datum})
        <button onclick="loeschenHA(${i})">Löschen</button>
        `;
        liste.appendChild(li);
    });
}

window.loeschenHA = function(i){
    aufgaben.splice(i,1);
    speichern();
    anzeigenHA();
};


// =====================
// NOTEN
// =====================

window.anzeigenAlleFaecher = function(){
    let liste=document.getElementById("alleFaecherListe");
    if(!liste) return;

    liste.innerHTML="";

    faecherVorgabe.forEach(f=>{
        let li=document.createElement("li");
        li.textContent=f;
        li.onclick=()=>hinzufuegenFach(f);
        liste.appendChild(li);
    });
};

function hinzufuegenFach(fach){
    if(!faecherHinzu.includes(fach)){
        faecherHinzu.push(fach);
        if(!noten[fach]) noten[fach]=[];
        speichern();
        anzeigenFaecher();
    }
}

function anzeigenFaecher(){
    let ul=document.getElementById("hinzugefuegteFaecher");
    if(!ul) return;

    ul.innerHTML="";

    faecherHinzu.forEach(f=>{
        let li=document.createElement("li");
        li.innerHTML=`
        <button onclick="notenFachDetail('${f}')">
        ${f} (${noten[f].length} Noten)
        </button>`;
        ul.appendChild(li);
    });
}

window.notenFachDetail = function(fach){

    let html=`<h3>${fach}</h3>
    <select id="noteArt">
        <option value="schriftlich">Schriftlich</option>
        <option value="mündlich">Mündlich</option>
    </select>
    <input type="number" id="noteWert" 
           placeholder="Note" step="0.1" min="1" max="6">
    <button onclick="addNote('${fach}')">Hinzufügen</button>
    <ul>`;

    noten[fach].forEach((n,i)=>{
        html+=`
        <li>
        ${n.art}: ${n.note} 
        <button onclick="loeschenNote('${fach}',${i})">X</button>
        </li>`;
    });

    html+="</ul>";

    let durchschnitt="-";
    if(noten[fach].length>0){
        let sum = noten[fach].reduce((a,b)=>a+b.note,0);
        durchschnitt=(sum/noten[fach].length).toFixed(2);
    }

    html+=`<p><strong>Durchschnitt:</strong> ${durchschnitt}</p>`;

    document.getElementById("notenDetails").innerHTML=html;
};

window.addNote = function(fach){
    let n=parseFloat(document.getElementById("noteWert").value);
    let art=document.getElementById("noteArt").value;

    if(!n){
        alert("Note eingeben!");
        return;
    }

    noten[fach].push({art,note:n});
    speichern();
    anzeigenFaecher();
    notenFachDetail(fach);
};

window.loeschenNote = function(f,i){
    noten[f].splice(i,1);
    speichern();
    anzeigenFaecher();
    notenFachDetail(f);
};


// =====================
// KLAUSUREN
// =====================

function faecherDropdownKlausur(){
    let sel=document.getElementById("fachKlausur");
    if(!sel) return;

    sel.innerHTML="";
    faecherVorgabe.forEach(f=>{
        let opt=document.createElement("option");
        opt.value=f;
        opt.textContent=f;
        sel.appendChild(opt);
    });
}

window.hinzufuegenKlausur = function(){
    let f=document.getElementById("fachKlausur").value;
    let n=document.getElementById("klausurName").value;
    let d=document.getElementById("klausurDatum").value;

    if(!n || !d){
        alert("Bitte Name und Datum ausfüllen!");
        return;
    }

    if(!klausuren[f]) klausuren[f]=[];
    klausuren[f].push({name:n,datum:d});

    speichern();
    anzeigenKlausuren();
};

function anzeigenKlausuren(){
    let div=document.getElementById("listeKlausuren");
    if(!div) return;

    div.innerHTML="";

    Object.keys(klausuren).forEach(f=>{
        klausuren[f].forEach(k=>{
            let li=document.createElement("li");
            li.textContent=`${f} - ${k.name} (${k.datum})`;
            div.appendChild(li);
        });
    });
}


// =====================
// INIT (WICHTIG)
// =====================

document.addEventListener("DOMContentLoaded", function(){

    anzeigenHA();
    anzeigenFaecher();
    faecherDropdownHA();
    faecherDropdownKlausur();
    anzeigenKlausuren();

});
