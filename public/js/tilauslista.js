import { muodostaLista } from '/js/apufunktiot.js'

document.addEventListener('DOMContentLoaded',aloita);

let puutarhalista;
let kukkalista;
let valittuPuutarha;
let pid;
let kid;
const tilausrivit=[];

async function aloita(){
    puutarhalista =document.getElementById('puutarhalista');
    kukkalista = document.getElementById('kukkalista');
    pid = document.getElementById('pid');
    kid = document.getElementById('kid');

    const data=await fetch('/puutarhalista');
    const puutarhat=await data.json();

    muodostaLista(puutarhalista, puutarhat, 'puutarhaId','puutarhanNimi');
    puutarhalista.addEventListener('change',muodostaKukkalista);
    puutarhalista.value='';
}

async function muodostaKukkalista(){
    valittuPuutarha=puutarhalista.value;
    if(valittuPuutarha>0){
        try{
            const data=await fetch(`/kukkalista/${valittuPuutarha}`);
            const tulos=await data.json();
            kukkalista.replaceChildren();
            muodostaLista(kukkalista,tulos,'kukkaId','kukanNimi');
            kukkalista.addEventListener('change', haeKukantiedot);
            kukkalista.value = '';

        }
        catch(virhe){
            console.log(virhe);
        }
    }

}

async function haeKukantiedot(e){
    const id=e.target.value;
    console.log('id',id);
    pid.value=valittuPuutarha;
    kid.value=id;

}
