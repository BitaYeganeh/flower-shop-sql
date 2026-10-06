use kukkakauppa;

select kukkaId, kukanNimi, paikanTyyppi, paikanKuvaus from kasvupaikka
natural join kukka
order by kukkaId asc;

select puutarhaId, puutarhanNimi, puutarhanSijainti from puutarha
order by puutarhaId;

-- alasvetolistaa varten
select puutarhaId, puutarhanNimi from puutarha;

select puutarhanNimi,kukanNimi, varasto, 
yksikkohinta from puutarha
natural join puutarhan_kukat
natural join kukka
where puutarhaId=1
order by kukanNimi asc;

select kukkaId,kukanNimi from kukka
natural join puutarhan_kukat
where puutarhaId=1
order by kukanNimi asc;