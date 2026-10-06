import { muodostaRivi, muodostaOtsikkorivi } from '/js/apufunktiot.js'

document.addEventListener('DOMContentLoaded', aloita);


async function aloita(){
    try{
        const tulostaulukko = document.getElementById('tulostaulukko');
        const otsikkorivi=document.querySelector('thead');
        const otsikko=muodostaOtsikkorivi(['Id','Nimi','kasvupaikka']);
        otsikkorivi.appendChild(otsikko);

        const data = await fetch('/kukat');
        const kukat=await data.json();

        for(const kukka of kukat){
            const rivi=muodostaRivi(kukka,['kukkaId','kukanNimi','paikanTyyppi'])
            tulostaulukko.appendChild(rivi);
        }
    }
    catch(virhe){
        console.log(virhe); //vain debug
    }
} //aloita loppu

