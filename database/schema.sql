-- Tables for the flower shop. Run against the chosen database, e.g.:
--   mariadb -u kauppias -p kukkakauppa < database/schema.sql

drop table if exists tilauksen_kukat;
drop table if exists tilaus;
drop table if exists asiakas;
drop table if exists puutarhan_kukat;
drop table if exists puutarha;
drop table if exists kukka;
drop table if exists kasvupaikka;

create table kasvupaikka(
    paikkaId integer not null primary key,
    paikanTyyppi varchar(30) not null,
    paikanKuvaus varchar(100)
);

create table kukka(
    kukkaId integer not null primary key,
    kukanNimi varchar(30) not null,
    paikkaId integer not null,
    foreign key (paikkaId) references kasvupaikka(paikkaId)
);

create table puutarha(
    puutarhaId integer not null primary key,
    puutarhanNimi varchar(50) not null,
    puutarhanSijainti varchar(40) not null
);

create table puutarhan_kukat(
    puutarhaId integer not null,
    kukkaId integer not null,
    yksikkohinta integer not null,
    varasto integer not null,
    primary key(puutarhaId, kukkaId),
    foreign key (puutarhaId) references puutarha(puutarhaId),
    foreign key (kukkaId) references kukka(kukkaId)
);

create table asiakas(
    asiakasId integer not null primary key,
    etunimi varchar(30) not null,
    sukunimi varchar(40) not null,
    osoite varchar(100) not null
);

create table tilaus(
    tilausId integer not null primary key,
    asiakasId integer not null,
    tilauspvm date not null,
    foreign key (asiakasId) references asiakas(asiakasId)
);

create table tilauksen_kukat(
    tilausId integer not null,
    kukkaId integer not null,
    puutarhaId integer not null,
    lkm integer not null,
    hinta integer not null,
    primary key(tilausId, kukkaId, puutarhaId),
    foreign key (tilausId) references tilaus(tilausId),
    foreign key (kukkaId) references kukka(kukkaId),
    foreign key (puutarhaId) references puutarha(puutarhaId)
);

