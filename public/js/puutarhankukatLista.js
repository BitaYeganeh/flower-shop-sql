import { muodostaRivi, muodostaOtsikkorivi } from '/js/apufunktiot.js'

document.addEventListener('DOMContentLoaded',aloita);

let puutarhalista;
let tulos;

async function aloita(){
    puutarhalista =document.getElementById('puutarhalista');
    tulos=document.querySelector('tbody');

    const data=await fetch('/puutarhalista');
    const puutarhat=await data.json();

    for(const puutarha of puutarhat){
        const option = document.createElement('option');
        option.value=puutarha.puutarhaId;
        option.textContent=puutarha.puutarhanNimi;
        puutarhalista.appendChild(option);
    }
    puutarhalista.addEventListener('change',laheta);
    puutarhalista.value='';

    const otsikkorivi = document.querySelector('thead');
    const otsikko = muodostaOtsikkorivi(['Puutarha', 'Kukka', 'Määrä','Hinta']);
    otsikkorivi.appendChild(otsikko);

}

async function laheta(){
    const id = puutarhalista.value;

    const data = await fetch(`/puutarhankukat/${id}`);
    const datajson= await data.json();

    tulos.replaceChildren(); //tyhjentää taulukon tbody:n

    for (const alkio of datajson) {
        const rivi = muodostaRivi(alkio,
            ['puutarhanNimi', 'kukanNimi', 'varasto', 'yksikkohinta']);

        tulos.appendChild(rivi);
    }
}