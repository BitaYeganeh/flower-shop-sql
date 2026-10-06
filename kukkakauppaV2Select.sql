use kukkakauppa;

select puutarhanNimi, varasto, yksikkohinta from puutarha
natural join puutarhan_kukat
natural join kukka
where kukanNimi='Ruusu';

select puutarhanNimi, varasto, 
        yksikkohinta, varasto*yksikkohinta as hinta from puutarha
natural join puutarhan_kukat
natural join kukka
where kukanNimi='Ruusu';

select kukanNimi, puutarhanNimi, varasto, 
        yksikkohinta, varasto*yksikkohinta as hinta from puutarha
natural join puutarhan_kukat
natural join kukka
order by kukanNimi asc, puutarhanNimi asc;

select kukanNimi, puutarhanNimi, varasto, yksikkohinta, 
        varasto*yksikkohinta as hinta, 0.9*(varasto*yksikkohinta) as etuhinta
from puutarha
natural join puutarhan_kukat
natural join kukka
order by kukanNimi asc, puutarhanNimi asc;

select * from asiakas;
select * from tilaus;
select * from tilauksen_kukat;

select current_date;
select day(current_date);
select month(current_date);
select year(current_date);

select tilausId, tilauspvm from tilaus
where month(tilauspvm)=9;

select tilausId, tilauspvm from tilaus where tilauspvm='2025-09-26';

select current_time;
select current_timestamp;

select tilausId, etunimi,sukunimi,osoite from tilaus
natural join asiakas;

select tilausId, tilauspvm, etunimi,sukunimi,osoite from tilaus
natural join asiakas;

select tilausId, tilauspvm, etunimi,sukunimi,osoite from tilaus
natural join asiakas order by tilauspvm asc;

select tilausId, tilauspvm, etunimi,sukunimi,osoite from tilaus
natural join asiakas order by tilauspvm desc;

select tilausId, tilauspvm, etunimi, sukunimi osoite from tilaus
natural join asiakas
where year(tilauspvm)=2025 and month(tilauspvm)=9;

select tilausId, year(tilauspvm) as vuosi from tilaus
natural join asiakas
where etunimi='Veera' and sukunimi='Virta';

select tilausId, tilauspvm from tilaus natural join asiakas 
where etunimi='Veera' and sukunimi='Virta';

select tilausId, tilauspvm from tilaus natural join asiakas 
where etunimi='Veera' and sukunimi='Virta' and year(tilauspvm)=2025;

select tilausId, kukanNimi, puutarhanNimi, lkm, hinta from tilauksen_kukat
natural join kukka
natural join puutarha
order by tilausId asc;

select tilausId, kukanNimi, puutarhanNimi, lkm, hinta, lkm*hinta as summa
from tilauksen_kukat
natural join kukka
natural join puutarha
where tilausId=1
order by tilausId asc;

select sum(lkm*hinta) as yht from tilauksen_kukat where tilausId=1;

select tilausId, kukanNimi, puutarhanNimi, lkm, hinta, lkm*hinta as summa 
from tilauksen_kukat
natural join kukka
natural join puutarha
order by tilausId asc;

select sum(lkm*hinta) as yht from tilauksen_kukat
