function teeSolu(teksti) {
    const td = document.createElement('td');
    td.textContent = teksti;
    return td;
}

function muodostaRivi(data,avaimet){
    const tr = document.createElement('tr');
    for(const avain of avaimet){
        tr.appendChild(teeSolu(data[avain]));
    }
    return tr;
}

function muodostaOtsikkorivi(otsikot){
    const tr = document.createElement('tr');
    for(const otsikko of otsikot){
        const th=document.createElement('th');
        th.textContent=otsikko;
        tr.appendChild(th);
    }
    return tr;
}

function muodostaLista(listaelementti, data, perusavain, teksti){
    for (const alkio of data) {
        const option = document.createElement('option');
        option.value = alkio[perusavain];
        option.textContent = alkio[teksti];
        listaelementti.appendChild(option);
    }
}

export { muodostaRivi, muodostaOtsikkorivi, muodostaLista }