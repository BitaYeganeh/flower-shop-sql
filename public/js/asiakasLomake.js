document.addEventListener('DOMContentLoaded', () => {
    const lomake = document.getElementById('asiakastiedot');
    const viestialue = document.getElementById('viestialue');

    lomake.addEventListener('submit', async (e) => {
        e.preventDefault();
        const vastaus = await fetch('/uusiasiakas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(Object.fromEntries(new FormData(lomake))),
        });
        const tila = await vastaus.json();
        viestialue.textContent = vastaus.ok ? 'Asiakas tallennettu.' : tila.viesti;
        viestialue.className = `viesti viesti--${vastaus.ok ? 'info' : 'virhe'}`;
        if (vastaus.ok) lomake.reset();
    });
});
