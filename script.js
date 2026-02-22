// Daten
let faecherVorgabe=["Mathematik","Deutsch","Englisch","Französisch","Latein","Spanisch","Biologie","Chemie","Physik","Geschichte","Geographie","Politik / Sozialkunde","Musik","Kunst","Sport","Informatik","Ethik","Philosophie","Religion","Psychologie"];
let faecherHinzu = JSON.parse(localStorage.getItem("faecherHinzu")) || [];
let noten = JSON.parse(localStorage.getItem("noten")) || {};
let aufgaben = JSON.parse(localStorage.getItem("aufgaben")) || [];
let klausuren = JSON.parse(localStorage.getItem("klausuren")) || {};

// Speichern
function speichern(){
    localStorage.setItem("aufgaben",JSON.stringify(aufgaben));
    localStorage.setItem("klausuren",JSON.stringify(klausuren));
    localStorage.setItem("faecherHinzu",JSON.stringify(faecherHinzu));
    localStorage.setItem("noten",JSON.stringify(noten));
}

// Sidebar & Tabs
function openTab(tab){
    document.querySelectorAll(".tabcontent").forEach(t=>t.style.display="none");
    document.getElementById(tab).style.display="block";
    if(tab=="hausaufgaben") fächerDropdownHA();
    if(tab=="klausuren") fächerDropdownKlausur();
    if(tab=="noten") anzeigenFaecher();
}

// Hausaufgaben
function fächerDropdownHA(){
    let sel=document.getElementById("fachHA");
    sel.innerHTML="";
    faecherVorgabe.forEach(f=>{
        let opt=document.createElement("option"); opt.value=f; opt.textContent=f; sel.appendChild(opt);
    });
}
function hinzufuegenHA(){
    let fach=document.getElementById("fachHA").value;
    let aufgabe=document.getElementById("aufgabe").value;
    let datum=document.getElementById("datum").value;
    if(!aufgabe||!datum){ alert("Bitte alles ausfüllen!"); return; }
    aufgaben.push({fach,aufgabe,datum,erledigt:false,foto:null});
    speichern(); anzeigenHA();
}
function anzeigenHA(){
    let liste=document.getElementById("listeHA"); liste.innerHTML="";
    aufgaben.forEach((a,i)=>{
        let li=document.createElement("li");
        li.innerHTML=`<strong>${a.fach}</strong> - ${a.aufgabe} (${a.datum}) <br>
        Foto: <input type="file" onchange="hochladenHA(event,${i})"><br>
        <button onclick="erledigtHA(${i})" ${!a.foto?"disabled":""}>Erledigt</button>
        <button onclick="loeschenHA(${i})">Löschen</button>
        ${a.erledigt?"✅ Erledigt":""} ${a.foto?"✔ Foto hochgeladen":"❌ Kein Foto"}`;
        liste.appendChild(li);
    });
}
function hochladenHA(e,i){ let file=e.target.files[0]; if(file){ let reader=new FileReader(); reader.onload=ev=>{ aufgaben[i].foto=ev.target.result; speichern(); anzeigenHA(); }; reader.readAsDataURL(file); } }
function erledigtHA(i){ if(!aufgaben[i].foto){ alert("Bitte Foto hochladen!"); return; } aufgaben[i].erledigt=true; speichern(); anzeigenHA(); }
function loeschenHA(i){ aufgaben.splice(i,1); speichern(); anzeigenHA(); }

// Dark Mode - mit localStorage
const darkModeToggle = document.getElementById("darkModeToggle");
if(localStorage.getItem("darkMode")==="true"){
    darkModeToggle.checked = true;
    document.body.classList.add("dark");
}
darkModeToggle.addEventListener("change",function(){ 
    document.body.classList.toggle("dark",this.checked); 
    localStorage.setItem("darkMode", this.checked);
});

// Noten
function anzeigenAlleFaecher(){
    let liste=document.getElementById("alleFaecherListe");
    liste.innerHTML="";
    document.getElementById("closeFachListe").style.display="inline";
    faecherVorgabe.forEach(f=>{
        let li=document.createElement("li");
        li.textContent=f; li.onclick=()=>hinzufuegenFach(f);
        liste.appendChild(li);
    });
}
function closeFachListe(){
    document.getElementById("alleFaecherListe").innerHTML="";
    document.getElementById("closeFachListe").style.display="none";
}
function hinzufuegenFach(fach){
    if(!faecherHinzu.includes(fach)){
        faecherHinzu.push(fach); if(!noten[fach]) noten[fach]=[];
        speichern(); anzeigenFaecher();
    }
}
function anzeigenFaecher(){
    let ul=document.getElementById("hinzugefuegteFaecher"); ul.innerHTML="";
    faecherHinzu.forEach(f=>{
        let li=document.createElement("li");
        li.innerHTML=`<button onclick=\"notenFachDetail('${f}')\">${f} (${noten[f].length} Noten)</button>`;
        ul.appendChild(li);
    });
}
function notenFachDetail(fach){
    let html=`<h3>${fach}</h3>
    <select id=\"noteArt\"><option value=\"schriftlich\">Schriftlich</option><option value=\"mündlich\">Mündlich</option></select>
    <input type=\"number\" id=\"noteWert\" placeholder=\"Note\" step=0.1 min=1 max=6>
    <button onclick=\"addNote('${fach}')\">Hinzufügen</button>
    <ul id=\"notenListe\">`;
    noten[fach].forEach((n,i)=>{ html+=`<li>${n.art}: ${n.note} <button onclick=\"loeschenNote('${fach}',${i})\">X</button></li>`; });
    html+=`</ul>`; document.getElementById("notenDetails").innerHTML=html;
}
function addNote(fach){
    let n=parseFloat(document.getElementById("noteWert").value);
    let art=document.getElementById("noteArt").value;
    if(!n){ alert("Note eingeben!"); return; }
    noten[fach].push({art,note:n}); speichern(); anzeigenFaecher(); notenFachDetail(fach);
}
function loeschenNote(f,i){ noten[f].splice(i,1); speichern(); anzeigenFaecher(); notenFachDetail(f); }

// Klausuren
function fächerDropdownKlausur(){
    let sel=document.getElementById("fachKlausur"); sel.innerHTML="";
    faecherVorgabe.forEach(f=>{ let opt=document.createElement("option"); opt.value=f; opt.textContent=f; sel.appendChild(opt); });
}
function hinzufuegenKlausur(){
    let f=document.getElementById("fachKlausur").value;
    let n=document.getElementById("klausurName").value;
    let d=document.getElementById("klausurDatum").value;
    let note=parseFloat(document.getElementById("klausurNote").value);
    if(!n||!d){ alert("Bitte Name und Datum ausfüllen!"); return; }
    if(!klausuren[f]) klausuren[f]=[];
    klausuren[f].push({name:n,datum:d,note:note||null});
    speichern(); anzeigenKlausuren();
}
function anzeigenKlausuren(){
    let div=document.getElementById("listeKlausuren"); div.innerHTML="";
    Object.keys(klausuren).forEach(f=>{
        klausuren[f].forEach(k=>{
            let noteText=k.note?`: Note ${k.note}`:"";
            let li=document.createElement("li"); li.textContent=`${f} - ${k.name} (${k.datum})${noteText}`; div.appendChild(li);
        });
    });
}

// Datenverwaltung
function resetDaten(){
    if(confirm("Alle Daten wirklich löschen?")){ aufgaben=[]; klausuren={}; faecherHinzu=[]; noten={}; speichern(); anzeigenHA(); anzeigenKlausuren(); anzeigenFaecher(); }
}
function exportBackup(){
    const data=JSON.stringify({aufgaben, klausuren, faecherHinzu, noten});
    const blob=new Blob([data],{type:"application/json"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a"); a.href=url; a.download="backup.json"; a.click();
    URL.revokeObjectURL(url);
}
function importBackup(e){
    const file=e.target.files[0];
    const reader=new FileReader();
    reader.onload=ev=>{
        const data=JSON.parse(ev.target.result);
        aufgaben=data.aufgaben||[]; klausuren=data.klausuren||{}; faecherHinzu=data.faecherHinzu||[]; noten=data.noten||{};
        speichern(); anzeigenHA(); anzeigenKlausuren(); anzeigenFaecher();
    };
    reader.readAsText(file);
}

// Init
anzeigenHA(); anzeigenFaecher(); fächerDropdownHA(); fächerDropdownKlausur(); anzeigenKlausuren();