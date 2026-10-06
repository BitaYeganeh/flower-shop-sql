drop database if exists kukkakauppa;
create database kukkakauppa;

use kukkakauppa;

drop user if exists 'kauppias'@'localhost';
create user 'kauppias'@'localhost' identified by '1234';
grant all privileges on kukkakauppa.* to 'kauppias'@'localhost';

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

