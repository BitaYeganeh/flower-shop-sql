import { muodostaRivi, muodostaOtsikkorivi } from '/js/apufunktiot.js'

document.addEventListener('DOMContentLoaded',aloita);

let syote;
let tulos;

function aloita(){
    syote=document.getElementById('nro');
    tulos=document.querySelector('tbody');

    const otsikkorivi = document.querySelector('thead');
    const otsikko = muodostaOtsikkorivi(['Puutarha', 'Kukka', 'Määrä','Hinta']);
    otsikkorivi.appendChild(otsikko);

    document.getElementById('laheta').addEventListener('click', laheta);
}

async function laheta(){
    const id=syote.value;

    const data = await fetch(`/puutarhankukat/${id}`);
    const datajson= await data.json();

    tulos.replaceChildren(); //tyhjentää taulukon tbody:n

    for (const alkio of datajson) {
        const rivi = muodostaRivi(alkio,
            ['puutarhanNimi', 'kukanNimi', 'varasto', 'yksikkohinta']);

        tulos.appendChild(rivi);
    }
}