document.addEventListener('DOMContentLoaded', async () => {
    const runko = document.getElementById('tilaukset');
    const vastaus = await fetch('/tilaukset');
    const tilaukset = await vastaus.json();
    if (!vastaus.ok || tilaukset.length === 0) {
        runko.innerHTML = `<tr><td colspan="5" class="tyhja">${vastaus.ok ? 'Ei tilauksia.' : tilaukset.viesti}</td></tr>`;
        return;
    }
    for (const t of tilaukset) {
        const tr = document.createElement('tr');
        const solut = [
            [t.tilausId, 'num'],
            [new Date(t.tilauspvm).toLocaleDateString('fi-FI')],
            [`${t.etunimi} ${t.sukunimi}`],
            [Number(t.kpl), 'num'],
            [`${Number(t.summa)} €`, 'num'],
        ];
        for (const [arvo, luokka] of solut) {
            const td = document.createElement('td');
            td.textContent = arvo;
            if (luokka) td.className = luokka;
            tr.appendChild(td);
        }
        runko.appendChild(tr);
    }
});
