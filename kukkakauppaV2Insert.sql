use kukkakauppa;

delete from puutarhan_kukat;
delete from kukka;
delete from puutarha;
delete from kasvupaikka;
delete from tilauksen_kukat;
delete from tilaus;
delete from asiakas;

insert into kasvupaikka (paikkaId, paikanTyyppi, paikanKuvaus)
values (1, 'aurinkoinen', 'vaatii suoraa auringon paistetta');

insert into kasvupaikka(paikkaId,paikanTyyppi) values(2,'puolivarjo');
insert into kasvupaikka(paikkaId,paikanTyyppi) values(3,'varjoinen');
insert into kasvupaikka(paikkaId,paikanTyyppi) values(4,'kuiva');
insert into kasvupaikka(paikkaId,paikanTyyppi) values(5,'kostea');

insert into kukka(kukkaId,kukanNimi,paikkaId) value(1,'Ruusu',1);
insert into kukka(kukkaId,kukanNimi,paikkaId) value(2,'Tulppaani',1);
insert into kukka(kukkaId,kukanNimi,paikkaId) value(3,'Kaktus',4);
insert into kukka(kukkaId,kukanNimi,paikkaId) value(4, 'Auringon kukka',1);
insert into kukka(kukkaId,kukanNimi,paikkaId) value(5, 'Lumme',5);
insert into kukka(kukkaId,kukanNimi,paikkaId) value(6, 'Orvokki',2);

insert into puutarha (puutarhaId,puutarhanNimi,puutarhanSijainti)
values (1,'Orvokin tulppaanit oy','Vantaa');

insert into puutarha (puutarhaId,puutarhanNimi,puutarhanSijainti)
values (2, 'Rovaniemen ruusutarha','Rovaniemi');

insert into puutarha (puutarhaId,puutarhanNimi,puutarhanSijainti)
values (3, 'Kalevin kaktus ja tulppaani', 'Helsinki');

insert into puutarha (puutarhaId,puutarhanNimi,puutarhanSijainti)
values(4, 'Ruusutarha', 'Tampere');

insert into puutarhan_kukat(puutarhaId, kukkaId,yksikkohinta,varasto) 
values(1, 2, 2, 3);
insert into puutarhan_kukat(puutarhaId, kukkaId,yksikkohinta,varasto) 
values(1, 1, 5, 10);
insert into puutarhan_kukat(puutarhaId, kukkaId,yksikkohinta,varasto) 
values(2, 1, 10, 100);
insert into puutarhan_kukat(puutarhaId, kukkaId,yksikkohinta,varasto) 
values(2, 6, 1, 5);
insert into puutarhan_kukat(puutarhaId, kukkaId,yksikkohinta,varasto) 
values(3, 3, 25, 25);
insert into puutarhan_kukat(puutarhaId, kukkaId,yksikkohinta,varasto) 
values(2, 2, 2, 30);
insert into puutarhan_kukat(puutarhaId, kukkaId,yksikkohinta,varasto) 
values(4, 1, 7, 0);
insert into puutarhan_kukat(puutarhaId, kukkaId,yksikkohinta,varasto) 
values(4, 4, 9, 56);
insert into puutarhan_kukat(puutarhaId, kukkaId,yksikkohinta,varasto) 
values(4, 5, 30, 42);

insert into asiakas (asiakasId, etunimi, sukunimi, osoite)
values (1, 'Veera', 'Virta', 'Jokikatu 3');

insert into asiakas (asiakasId, etunimi, sukunimi, osoite)
values (2, 'Matti', 'Puro', 'Rantatie 40');

insert into asiakas (asiakasId, etunimi, sukunimi, osoite)
values (3, 'Amanda', 'Oksanen', 'Koivukuja 2');

insert into tilaus (tilausId, asiakasId, tilauspvm)
values (1, 1, '2025-09-26');

insert into tilaus (tilausId, asiakasId, tilauspvm)
values (2, 3, '2025-08-30');

insert into tilaus (tilausId, asiakasId, tilauspvm)
values (3, 1, '2025-09-20');

insert into tilaus (tilausId, asiakasId, tilauspvm)
values (4, 2, '2025-05-02');

insert into tilaus (tilausId, asiakasId, tilauspvm)
values (5, 1, '2024-09-26');

insert into tilauksen_kukat (tilausId, kukkaId, puutarhaId, lkm, hinta)
values(1,1,1,10,10);

insert into tilauksen_kukat (tilausId, kukkaId, puutarhaId, lkm, hinta)
values(5,1,4,5,7);

insert into tilauksen_kukat (tilausId, kukkaId, puutarhaId, lkm, hinta)
values(1,1,4,10,7);

insert into tilauksen_kukat (tilausId, kukkaId, puutarhaId, lkm, hinta)
values(1,6,2,4,1);

insert into tilauksen_kukat (tilausId, kukkaId, puutarhaId, lkm, hinta)
values(4,3,3,1,25);

insert into tilauksen_kukat (tilausId, kukkaId, puutarhaId, lkm, hinta)
values(3,2,2,10,2);
