import { muodostaRivi, muodostaOtsikkorivi } from '/js/apufunktiot.js'

document.addEventListener('DOMContentLoaded', aloita);


async function aloita(){
    try{
        const tulostaulukko = document.getElementById('tulostaulukko');
        const otsikkorivi = document.querySelector('thead');
        const otsikko = muodostaOtsikkorivi(['Id', 'Nimi', 'Sijainti']);
        otsikkorivi.appendChild(otsikko);

        const data = await fetch('/puutarhat');
        const puutarhat=await data.json();

        for(const puutarha of puutarhat){
            const rivi=muodostaRivi(puutarha,
                ['puutarhaId','puutarhanNimi','puutarhanSijainti']);

            tulostaulukko.appendChild(rivi);
        }
    }
    catch(virhe){
        console.log(virhe); //vain debug
    }
} //aloita loppu

