let asiakastiedot;
let viestialue;

document.addEventListener('DOMContentLoaded', alusta);

function alusta(){
    asiakastiedot = document.getElementById('asiakastiedot');
    viestialue = document.getElementById('viestialue');

    document.getElementById('laheta').addEventListener('click', laheta);
}

async function laheta(){
    const asiakasdata=new FormData(asiakastiedot);
    const asiakasJson = Object.fromEntries(asiakasdata.entries());

    const optiot={
        method:'post',
        body:JSON.stringify(asiakasJson),
        headers:{'Content-Type':'application/json'}
    };

    const tulos = await fetch('/uusiasiakas',optiot);
    const tila=await tulos.json();

    viestialue.textContent=tila.viesti;
}