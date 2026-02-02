/** MEMORIAL DATA SEED (Multi-Language) */

DELETE FROM clans WHERE surname = 'Genda';


INSERT INTO clans (
    surname, 
    prevalence_hr, world_distribution_hr, description_hr,
    prevalence_en, world_distribution_en, description_en,
    prevalence_de, world_distribution_de, description_de
)
VALUES (
    'Bašić',
    'U Hrvatskoj danas živi oko 5800 Bašića u 2400 domaćinstava. Sredinom prošlog stoljeća bilo ih je približno 3700, pa se njihov broj povećao za 60 posto.Prisutni su u svim hrvatskim županijama, u 105 gradova i 415 manjih naselja, najviše u Zagrebu (950), Splitu (785), Zadru (270), Rijeci (195), te u Slavonskom Brodu (165).', 'Najmanje 109 obitelji s ovima prezimenom iselilo je iz Hrvatske u: Njemačku (40), Ameriku (18), Australiju (17), Argentinu (7), Austriju (5), Švicarsku (5), Švedsku (4), Veliku Britaniju (3), Norvešku (3), Francusku (2), Kanadu (2), Belgiju (1), Čile (1), te u Nizozemsku (1).Prezime Bašić (uključujući: Basic, Basich, Bashich, Bassick, Bassich, Bashic, Basick, Bashnick, Bassic i Basics) prisutno je u 71 državi širom svijeta. Prezime "Basic" nosi oko 9000 osoba u Bangladešu, približno 5000 u Njemačkoj, te oko 3000 osoba u Americi. "Basich" nosi oko 900 osoba u Americi, približno 300 u Meksiku, te oko 300 osoba u Ukrajini. "Bashic" nosi nekoliko osoba u Americi.', '[IZVOR: POREKLO.RS - BALJCI]
BAŠIĆ (vjerovatno ogranak Beševića)- Nikoljdan
- oko 1720. rođen Andrija Bašić; 1948. godine popisana su 73 Bašića u Baljcima.
DžALETA (vjerovatno ogranak Beševića ili Bibića) – Nikoljdan
- 1757.  Simo Džaleta dobio kćer, a oko 1740. rođen Petar Džaleta; 1948. godine popisan je 21 Džaleta u Baljcima.

[OPĆENITO]
Bašići u Hrvatskoj najčešće su Hrvati, većim dijelom iz okolice Nina, a vrlo su rijetko Bošnjaci (iz Cazinske krajine, BiH) te Srbi. U prošlom stoljeću relativno najviše hrvatskih stanovnika s ovim prezimenom rođeno je u gradovima Splitu i Zagrebu. U Broćancu u Hercegovini svaki četvrti stanovnik prezivao se Bašić.',
    'About 5800 people with faimily name Bašić live in Croatia today, in 2400 households. There were 3700 of them in the middle of the past century, and their number increased by 60 percent.They are located in all Croatian counties, in 105 cities and 415 other places, mostly in Zagreb (950), Split (785), Zadar (270), Rijeka (195), and in Slavonski Brod (165).', 'At least 109 families with this surname emigrated from Croatia to: Germany (40), the United States (18), Australia (17), Argentina (7), Austria (5), Switzerland (5), Sweden (4), the United Kingdom (3), Norway (3), France (2), Canada (2), Belgium (1), Chile (1), and to the Netherlands (1).Family name Bašić (including: Basic , Basich , Bashich , Bassick , Bassich , Bashic , Basick , Bashnick , Bassic and Basics ) is present in 71 countries worldwide. The family name "Basic " is used by some 9000 people in Bangladesh , about 5000 in Germany , and some 3000 people in the United States. "Basich " is used by some 900 people in the United States , about 300 in Mexico , and some 300 people in Ukraine. "Bashic " is used by few people in the United States.', 'Bašić families are usually Croats and they are mostly from Nin area , barely Bosniaks (from Cazinska Krajina Region, Bosnia) and Serbs. In the past century, relatively most of Croatian residents bearing this family name were born in Split and Zagreb. In Broćanac in Herzegovina every fourth inhabitant had the family name Bašić.

(Detailed local history available in Croatian section).',
    'Keine Daten.', 'Keine Daten.', 'Daten werden gesammelt.'
)
ON CONFLICT (surname) DO UPDATE SET
    prevalence_hr = EXCLUDED.prevalence_hr, world_distribution_hr = EXCLUDED.world_distribution_hr, description_hr = EXCLUDED.description_hr,
    prevalence_en = EXCLUDED.prevalence_en, world_distribution_en = EXCLUDED.world_distribution_en, description_en = EXCLUDED.description_en,
    prevalence_de = EXCLUDED.prevalence_de, world_distribution_de = EXCLUDED.world_distribution_de, description_de = EXCLUDED.description_de;

INSERT INTO clans (
    surname, 
    prevalence_hr, world_distribution_hr, description_hr,
    prevalence_en, world_distribution_en, description_en,
    prevalence_de, world_distribution_de, description_de
)
VALUES (
    'Bešević',
    'U Hrvatskoj danas živi oko 30 Beševića u 14 domaćinstava. Sredinom prošlog stoljeća bilo ih je približno 100, pa se njihov broj višestruko smanjio.Prisutni su u šest hrvatskih županija, u šest gradova i tri manja naselja, najviše u Vinkovcima (Splitu (Šibeniku (Velikoj Gorici (Zagrebu (', 'Prezime Bešević (uključujući: Besevic, Beshkevich, Besevich i Beshevich) prisutno je u pet država na dva kontinenta. Prezime "Besevic" nosi manji broj osoba u Americi. "Besevich" nosi nekoliko osoba u Americi.', '[IZVOR: POREKLO.RS - BALJCI]
BEŠEVIĆ – Nikoljdan
- 1711. harambaša Jovan Bešević, Jovan Bešević pok. Miloša, Jovan Bešević pok. Obrada, Novak Bešević, Boroje Bešević; 1709. u Žitniću su imali posjede kapetan/harambaša Jovan Baljak iz Baljaka i Novak Baljak iz Baljaka, a to su jedino mogli biti Beševići (krsna slava prezimena Baljak iz Žitnića je isto Nikoljdan); Beševići su generacijama bili glavari sela Baljci; 1948. godine popisana su 92 Beševića u Baljcima.

[OPĆENITO]
Beševići u Hrvatskoj velikom su većinom Srbi, a bitno manje i Hrvati (iz Grada Vinkovaca). U prošlom stoljeću relativno najviše hrvatskih stanovnika s ovim prezimenom rođeno je u okolici Drniša i u Gradu Vinkovacima. U Baljcima u okolici Drniša svaki šesti stanovnik prezivao se Bešević.',
    'About 30 people with faimily name Bešević live in Croatia today, in 14 households. There were 100 of them in the middle of the past century, and their number decreased significantly.They are located in 6 Croatian counties, in 6 cities and threee other places, mostly in Vinkovci (Split (Sibenik (Velika Gorica (Zagreb (', 'Family name Bešević (including: Besevic , Beshkevich , Besevich and Beshevich ) is present in five countries on two continents. The family name "Besevic " is used by small number of people in the United States. "Besevich " is used by few people in the United States.', 'In Croatia, Bešević families are predominantly Serbs, rarely Croats (from Vinkovci ). In the past century, relatively most of Croatian residents bearing this family name were born in Drnis area and in Vinkovci. In Baljci in Drnis area every sixth inhabitant had the family name Bešević.

(Detailed local history available in Croatian section).',
    'Keine Daten.', 'Keine Daten.', 'Daten werden gesammelt.'
)
ON CONFLICT (surname) DO UPDATE SET
    prevalence_hr = EXCLUDED.prevalence_hr, world_distribution_hr = EXCLUDED.world_distribution_hr, description_hr = EXCLUDED.description_hr,
    prevalence_en = EXCLUDED.prevalence_en, world_distribution_en = EXCLUDED.world_distribution_en, description_en = EXCLUDED.description_en,
    prevalence_de = EXCLUDED.prevalence_de, world_distribution_de = EXCLUDED.world_distribution_de, description_de = EXCLUDED.description_de;

INSERT INTO clans (
    surname, 
    prevalence_hr, world_distribution_hr, description_hr,
    prevalence_en, world_distribution_en, description_en,
    prevalence_de, world_distribution_de, description_de
)
VALUES (
    'Bibić',
    'U Hrvatskoj danas živi oko 380 Bibića u 180 domaćinstava. Sredinom prošlog stoljeća bilo ih je približno 470, pa se njihov broj smanjio za 20 posto.Prisutni su u većini hrvatskih županija, u 28 gradova i 29 manjih naselja, najviše u Zagrebu (50), Hvaru na otoku Hvaru (50), Splitu (45), Zadru (25), te u Oraovcu u okolici Obrovca (20).', 'Prezime Bibić (uključujući: Bibich, Bibiche, Bibic, Bibicha, Bibick, Bybych i Bibych) prisutno je u 41 državi širom svijeta. Prezime "Bibic" nosi oko 70 osoba u Americi, manji broj u Njemačkoj, te manji broj osoba u Kanadi.', '[IZVOR: POREKLO.RS - BALJCI]
BIBIĆ (u 19. vijeku nadimci Lošeta, Drljan i Amidža) – Nikoljdan
- 1628. Radivoj Bibić iz Baljaka; 1711. Sava, Nikola, Jovan i Stevan Bibić; 1756. Lazo, Filip, Toma, Petar, Petar zvani Lošeta, Ilija i Bože Bibić; 1948. godine popisana su 54 Bibića u Baljcima.

[OPĆENITO]
Bibići u Hrvatskoj većinom su Hrvati, dobrim dijelom iz Hvara na otoku Hvaru, a prema nekim izvorima iz Midenega Barda u Zagorju ili okolice Drniša, ali su često i Srbi. U prošlom stoljeću relativno najviše hrvatskih stanovnika s ovim prezimenom rođeno je u Gradu Drnišu i na otoku Hvaru. U Vaganima u Bosanskoj Krajini svaki treći stanovnik prezivao se Bibić.',
    'About 380 people with faimily name Bibić live in Croatia today, in 180 households. There were 470 of them in the middle of the past century, and their number decreased by 20 percent.They are located in the most of Croatian counties, in 28 cities and 29 other places, mostly in Zagreb (50), Hvar on the Island of Hvar (50), Split (45), Zadar (25), and in Oraovac in Obrovac area (20).', 'Family name Bibić (including: Bibich , Bibiche , Bibic , Bibicha , Bibick , Bybych and Bibych ) is present in 41 countries worldwide. The family name "Bibic " is used by some 70 people in the United States , small number in Germany , and small number of people in Canada.', 'Bibić families are mainly Croats and they are mostly from the Island of Hvar. According to some sources they are from Zagorje or Drnis area, whereas often Serbs. In the past century, relatively most of Croatian residents bearing this family name were born in Drnis and on the Island of Hvar. In Vagani in Bosnian Krajina every third inhabitant had the family name Bibić.

(Detailed local history available in Croatian section).',
    'Keine Daten.', 'Keine Daten.', 'Daten werden gesammelt.'
)
ON CONFLICT (surname) DO UPDATE SET
    prevalence_hr = EXCLUDED.prevalence_hr, world_distribution_hr = EXCLUDED.world_distribution_hr, description_hr = EXCLUDED.description_hr,
    prevalence_en = EXCLUDED.prevalence_en, world_distribution_en = EXCLUDED.world_distribution_en, description_en = EXCLUDED.description_en,
    prevalence_de = EXCLUDED.prevalence_de, world_distribution_de = EXCLUDED.world_distribution_de, description_de = EXCLUDED.description_de;

INSERT INTO clans (
    surname, 
    prevalence_hr, world_distribution_hr, description_hr,
    prevalence_en, world_distribution_en, description_en,
    prevalence_de, world_distribution_de, description_de
)
VALUES (
    'Džepina',
    'U Hrvatskoj danas živi oko 320 Džepina u 150 domaćinstava. Sredinom prošlog stoljeća bilo ih je približno 220, pa se njihov broj povećao za 50 posto.Prisutni su u većini hrvatskih županija, u 24 grada i 30 manjih naselja, najviše u Zagrebu (90), Golubiću (55), Zadru (25), Šibeniku (20), te u Oklaju u okolici Knina (20).', 'Prezime Džepina (uključujući: Dzepina, Depina i Depinna) prisutno je u 23 države širom svijeta. "Depina" nosi oko 2000 osoba u Americi, približno 400 u Gvineji Bisau, te oko 200 osoba u Zelenortskoj Republci. "Depinna" nosi manji broj osoba u Americi.', '[IZVOR: POREKLO.RS - BALJCI]
DŽEPINA – Đurđevdan
- Porijeklom iz Drobnjaka (Tepci), takođe prisutni u Bosanskom Grahovu. U 15. vijeku se pominju u Skopskoj Crnoj Gori.
GRCIĆ
- Prezime izvedeno od etnonima "Grk". Prisutni u Dalmaciji (Drniš) i Dubrovačkom primorju od 17. vijeka.

[OPĆENITO]
Džepine u Hrvatskoj velikom su većinom Hrvati, dobrim dijelom iz okolice Knina, a u manjem broju su i Srbi. U prošlom stoljeću relativno najviše hrvatskih stanovnika s ovim prezimenom rođeno je u Srednjoj Bosni (područje Travnika) i u Gradu Kninu. U Ričicama u Srednjoj Bosni svaki deveti stanovnik prezivao se Džepina.',
    'About 320 people with faimily name Džepina live in Croatia today, in 150 households. There were 220 of them in the middle of the past century, and their number increased by 50 percent.They are located in the most of Croatian counties, in 24 cities and 30 other places, mostly in Zagreb (90), Golubic (55), Zadar (25), Sibenik (20), and in Oklaj in Knin area (20).', 'Family name Džepina (including: Dzepina , Depina and Depinna ) is present in 23 countries worldwide. "Depina " is used by some 2000 people in the United States , about 400 in Guinea-Bissau , and some 200 people in Cape Verde. "Depinna " is used by small number of people in the United States.', 'Džepina families are predominantly Croats and they are mostly from Knin area , less frequently Serbs. In the past century, relatively most of Croatian residents bearing this family name were born in Middle Bosnia (Travnik area) and in Knin. In Ričice in Middle Bosnia every ninth inhabitant had the family name Džepina.

(Detailed local history available in Croatian section).',
    'Keine Daten.', 'Keine Daten.', 'Daten werden gesammelt.'
)
ON CONFLICT (surname) DO UPDATE SET
    prevalence_hr = EXCLUDED.prevalence_hr, world_distribution_hr = EXCLUDED.world_distribution_hr, description_hr = EXCLUDED.description_hr,
    prevalence_en = EXCLUDED.prevalence_en, world_distribution_en = EXCLUDED.world_distribution_en, description_en = EXCLUDED.description_en,
    prevalence_de = EXCLUDED.prevalence_de, world_distribution_de = EXCLUDED.world_distribution_de, description_de = EXCLUDED.description_de;

INSERT INTO clans (
    surname, 
    prevalence_hr, world_distribution_hr, description_hr,
    prevalence_en, world_distribution_en, description_en,
    prevalence_de, world_distribution_de, description_de
)
VALUES (
    'Gegić',
    'U Hrvatskoj danas živi oko 450 Gegića u 120 domaćinstava. Sredinom prošlog stoljeća bilo ih je približno 70, pa se njihov broj višestruko povećao.Prisutni su u većini hrvatskih županija, u 18 gradova i 38 manjih naselja, najviše u Zagrebu (80), Velikim Bastajima u okolici Daruvara (55), Voćinu u okolici Slatine (50), Prgomelju (40), te u Botincu u okolici Bjelovara (35).', 'Prezime Gegić (uključujući: Gegic, Gegich i Gegick) prisutno je u 19 država na četiri kontinenta. Prezime "Gegic" nosi oko 300 osoba u Turskoj, približno 50 u Americi, te manji broj osoba u Njemačkoj. "Gegich" nosi manji broj osoba u Americi. "Gegick" nosi oko 70 osoba u Americi.', '[IZVOR: POREKLO.RS - BALJCI]
GEGIĆ – Lazarevdan
- oko 1730. rođen Jovan Gegić; 1948. godine popisana su 32 Gegića u Baljcima.

[OPĆENITO]
Gegići u Hrvatskoj uglavnom su Hrvati (iz Kosova), rijetko Srbi, te vrlo rijetko i Albanci (iz Grada Zagreba). U prošlom stoljeću relativno najviše hrvatskih stanovnika s ovim prezimenom rođeno je u Kosovu i u Janjevu, Kosovo.',
    'About 450 people with faimily name Gegić live in Croatia today, in 120 households. There were 70 of them in the middle of the past century, and their number multiplied.They are located in the most of Croatian counties, in 18 cities and 38 other places, mostly in Zagreb (80), Veliki Bastaji in Daruvar area (55), Vocin in Slatina area (50), Prgomelje (40), and in Botinac in Bjelovar area (35).', 'Family name Gegić (including: Gegic , Gegich and Gegick ) is present in 19 countries on four continents. The family name "Gegic " is used by some 300 people in Turkey , about 50 in the United States , and small number of people in Germany. "Gegich " is used by small number of people in the United States. "Gegick " is used by some 70 people in the United States.', 'In Croatia, Gegić families are generally Croats (from Kosovo ), very rarely Serbs, and barely Albanians (from Zagreb ). In the past century, relatively most of Croatian residents bearing this family name were born in Kosovo and in Janjevo, Kosovo.

(Detailed local history available in Croatian section).',
    'Keine Daten.', 'Keine Daten.', 'Daten werden gesammelt.'
)
ON CONFLICT (surname) DO UPDATE SET
    prevalence_hr = EXCLUDED.prevalence_hr, world_distribution_hr = EXCLUDED.world_distribution_hr, description_hr = EXCLUDED.description_hr,
    prevalence_en = EXCLUDED.prevalence_en, world_distribution_en = EXCLUDED.world_distribution_en, description_en = EXCLUDED.description_en,
    prevalence_de = EXCLUDED.prevalence_de, world_distribution_de = EXCLUDED.world_distribution_de, description_de = EXCLUDED.description_de;

INSERT INTO clans (
    surname, 
    prevalence_hr, world_distribution_hr, description_hr,
    prevalence_en, world_distribution_en, description_en,
    prevalence_de, world_distribution_de, description_de
)
VALUES (
    'Grcić',
    'U Hrvatskoj danas živi oko 170 Grcića u 60 domaćinstava. Sredinom prošlog stoljeća bilo ih je približno 80, pa se njihov broj udvostručio.Prisutni su u devet hrvatskih županija, u 14 grada i devet manjih naselja, najviše u Badnju (85), Zagrebu (20), Splitu (10), Kninu (10), te u Drnišu (10).', 'Najmanje jedna obitelj s ovima prezimenom iselila je iz Hrvatske u Ameriku.Prezime Grcić (uključujući: Grcic, Grzic, Grcich, Grzych, Gerchick, Gercich, Gercic, Gercas i Gerzic) prisutno je u 23 države širom svijeta. Prezime "Grcic" nosi oko 200 osoba u Americi, manji broj u Njemačkoj, te manji broj osoba u Australiji. "Grcich" nosi oko 100 osoba u Afganistanu i manji broj u Americi. "Grzic" nosi oko 60 osoba u Australiji i manji broj u Americi.', '[OPĆENITO]
Prezime Grcić u Hrvatskoj nose Hrvati, najvećim dijelom iz Drniša. U prošlom stoljeću relativno najviše hrvatskih stanovnika s ovim prezimenom rođeno je u Gradu Drnišu i u Srednjoj Bosni (područje Sarajeva).',
    'About 170 people with faimily name Grcić live in Croatia today, in 60 households. There were 80 of them in the middle of the past century, and their number doubled.They are located in 9 Croatian counties, in 14 cities and 9 other places, mostly in Badanj (85), Zagreb (20), Split (10), Knin (10), and in Drnis (10).', 'At least one family with this surname emigrated from Croatia to the United States.Family name Grcić (including: Grcic , Grzic , Grcich , Grzych , Gerchick , Gercich , Gercic , Gercas and Gerzic ) is present in 23 countries worldwide. The family name "Grcic " is used by some 200 people in the United States , small number in Germany , and small number of people in Australia. "Grcich " is used by some 100 people in Afghanistan and small number in the United States. "Grzic " is used by some 60 people in Australia and small number in the United States.', 'Grcić families are Croats and they are mostly from Drnis. In the past century, relatively most of Croatian residents bearing this family name were born in Drnis and in Middle Bosnia (Sarajevo area).',
    'Keine Daten.', 'Keine Daten.', 'Daten werden gesammelt.'
)
ON CONFLICT (surname) DO UPDATE SET
    prevalence_hr = EXCLUDED.prevalence_hr, world_distribution_hr = EXCLUDED.world_distribution_hr, description_hr = EXCLUDED.description_hr,
    prevalence_en = EXCLUDED.prevalence_en, world_distribution_en = EXCLUDED.world_distribution_en, description_en = EXCLUDED.description_en,
    prevalence_de = EXCLUDED.prevalence_de, world_distribution_de = EXCLUDED.world_distribution_de, description_de = EXCLUDED.description_de;

INSERT INTO clans (
    surname, 
    prevalence_hr, world_distribution_hr, description_hr,
    prevalence_en, world_distribution_en, description_en,
    prevalence_de, world_distribution_de, description_de
)
VALUES (
    'Ivić',
    'U Hrvatskoj danas živi oko 2700 Ivića u 1100 domaćinstava. Sredinom prošlog stoljeća bilo ih je približno 1600, pa se njihov broj povećao za 70 posto.Prisutni su u svim hrvatskim županijama, u 80 gradova i 235 manjih naselja, najviše u Zagrebu (440), Splitu (145), Osijeku (95), Šibeniku (90), te u Solinu (75).', 'Najmanje 33 obitelji s ovima prezimenom iselile su iz Hrvatske u: Njemačku (14), Austriju (5), Australiju (5), Švicarsku (2), Kanadu (2), Francusku (2), Ameriku (1), Argentinu (1), te u Veliku Britaniju (1).Prezime Ivić (uključujući: Ivic, Ivich, Ivichev, Ivichuk, Hivick, Ievich, Ivicz, Iwick i Iwic) prisutno je u 45 država širom svijeta. "Ivich" nosi oko 400 osoba u Meksiku, manji broj u Americi, te manji broj osoba u Rusiji. "Iwic" nosi nekoliko osoba u Americi. "Iwick" nosi nekoliko osoba u Americi.', '[IZVOR: POREKLO.RS - BALJCI]
IVIĆ – Sveti Jovan/Đurđevdan
- Prisutni u Glamoču (doselili iz Benkovca), te u Drnišu i Miljevcima.
MILORAD
- Prezime patronimskog porijekla od ličnog imena Milorad.

[OPĆENITO]
Ivići u Hrvatskoj su Hrvati, većim dijelom iz Drniša. U prošlom stoljeću relativno najviše hrvatskih stanovnika s ovim prezimenom rođeno je u gradovima Drnišu i Zagrebu. U Drinovcima u Gradu Drnišu svaki četvrti stanovnik prezivao se Ivić.',
    'About 2700 people with faimily name Ivić live in Croatia today, in 1100 households. There were 1600 of them in the middle of the past century, and their number increased by 70 percent.They are located in all Croatian counties, in 80 cities and 235 other places, mostly in Zagreb (440), Split (145), Osijek (95), Sibenik (90), and in Solin (75).', 'At least 33 families with this surname emigrated from Croatia to: Germany (14), Austria (5), Australia (5), Switzerland (2), Canada (2), France (2), the United States (1), Argentina (1), and to the United Kingdom (1).Family name Ivić (including: Ivic , Ivich , Ivichev , Ivichuk , Hivick , Ievich , Ivicz , Iwick and Iwic ) is present in 45 countries worldwide. "Ivich " is used by some 400 people in Mexico , small number in the United States , and small number of people in Russian Federation. "Iwic " is used by few people in the United States. "Iwick " is used by few people in the United States.', 'Ivić families are Croats and they are mostly from Drnis. In the past century, relatively most of Croatian residents bearing this family name were born in Drnis and Zagreb. In Drinovci in Drnis every fourth inhabitant had the family name Ivić.

(Detailed local history available in Croatian section).',
    'Keine Daten.', 'Keine Daten.', 'Daten werden gesammelt.'
)
ON CONFLICT (surname) DO UPDATE SET
    prevalence_hr = EXCLUDED.prevalence_hr, world_distribution_hr = EXCLUDED.world_distribution_hr, description_hr = EXCLUDED.description_hr,
    prevalence_en = EXCLUDED.prevalence_en, world_distribution_en = EXCLUDED.world_distribution_en, description_en = EXCLUDED.description_en,
    prevalence_de = EXCLUDED.prevalence_de, world_distribution_de = EXCLUDED.world_distribution_de, description_de = EXCLUDED.description_de;

INSERT INTO clans (
    surname, 
    prevalence_hr, world_distribution_hr, description_hr,
    prevalence_en, world_distribution_en, description_en,
    prevalence_de, world_distribution_de, description_de
)
VALUES (
    'Janković',
    'U Hrvatskoj danas živi oko 4100 Jankovića u 1900 domaćinstava. Sredinom prošlog stoljeća bilo ih je približno 4000, pa je njihov broj ostao podjednak.Prisutni su u svim hrvatskim županijama, u 94 grada i 415 manjih naselja, najviše u Zagrebu (640), Rijeci (175), Osijeku (155), Slavonskom Brodu (135), te u Splitu (125).', 'Najmanje 85 obitelji s ovima prezimenom iselilo je iz Hrvatske u: Njemačku (30), Ameriku (15), Austriju (9), Australiju (9), Kanadu (5), Francusku (5), Švicarsku (3), Veliku Britaniju (3), Španjolsku (2), Južnoafričku Republiku (1), Čile (1), Novi Zeland (1), te u Švedsku (1).Prezime Janković (uključujući: Jankovic, Yankovich, Jankovich, Jankowicz, Yankovic, Jankowitsch, Yankowich, Jankoviech, Iankovich i Iankovic) prisutno je u 77 država širom svijeta. Prezime "Jankovic" nosi oko 1000 osoba u Americi, približno 900 u Njemačkoj, te oko 800 osoba u Slovačkoj. "Jankovich" nosi oko 600 osoba u Americi, približno 200 u Mađarskoj, te oko 200 osoba u Južnoafričkoj Republikoj. "Yankovich" nosi oko 1000 osoba u Bjelorusiji, približno 900 u Rusiji, te oko 800 osoba u Americi.', '[IZVOR: POREKLO.RS - BALJCI]
JANKOVIĆ – Lazarevdan
- 1711. Janko Knežević (vjerovatno predak); oko 1750. rođen Riste, a oko 1760. Toma Janković; 1948. godine popisano je 55 Jankovića u Baljcima.

[OPĆENITO]
Jankovići u Hrvatskoj pretežito su Hrvati, većim dijelom iz okolice Slavonskog Broda, a prema nekim izvorima iz Biskog pokraj Trilja ili iz BiH. Ovo prezime rijetko nose i Srbi, te Romi (Bjelovar). U prošlom stoljeću relativno najviše hrvatskih stanovnika s ovim prezimenom rođeno je u gradovima Zagrebu i Slavonskom Brodu. U naseljima Oriovčić i Jakačina Mala u okolici Slavonskog Broda svaki treći stanovnik prezivao se Janković.',
    'About 4100 people with faimily name Janković live in Croatia today, in 1900 households. There were 4000 of them in the middle of the past century, and their number remains constant.They are located in all Croatian counties, in 94 cities and 415 other places, mostly in Zagreb (640), Rijeka (175), Osijek (155), Slavonski Brod (135), and in Split (125).', 'At least 85 families with this surname emigrated from Croatia to: Germany (30), the United States (15), Austria (9), Australia (9), Canada (5), France (5), Switzerland (3), the United Kingdom (3), Spain (2), South Africa (1), Chile (1), New Zealand (1), and to Sweden (1).Family name Janković (including: Jankovic , Yankovich , Jankovich , Jankowicz , Yankovic , Jankowitsch , Yankowich , Jankoviech , Iankovich and Iankovic ) is present in 77 countries worldwide. The family name "Jankovic " is used by some 1000 people in the United States , about 900 in Germany , and some 800 people in Slovakia. "Jankovich " is used by some 600 people in the United States , about 200 in Hungary , and some 200 people in South Africa. "Yankovich " is used by some 1000 people in Belarus , about 900 in Russian Federation , and some 800 people in the United States.', 'Janković families are mainly Croats and they are mostly from Slavonski Brod area. According to some sources they are from Bisko near Trilj or from Bosnia, rarely Serbs, and Roms (Bjelovar). In the past century, relatively most of Croatian residents bearing this family name were born in Zagreb and Slavonski Brod. In places Oriovčić and Jakačina Mala in Slavonski Brod area every third inhabitant had the family name Janković.

(Detailed local history available in Croatian section).',
    'Keine Daten.', 'Keine Daten.', 'Daten werden gesammelt.'
)
ON CONFLICT (surname) DO UPDATE SET
    prevalence_hr = EXCLUDED.prevalence_hr, world_distribution_hr = EXCLUDED.world_distribution_hr, description_hr = EXCLUDED.description_hr,
    prevalence_en = EXCLUDED.prevalence_en, world_distribution_en = EXCLUDED.world_distribution_en, description_en = EXCLUDED.description_en,
    prevalence_de = EXCLUDED.prevalence_de, world_distribution_de = EXCLUDED.world_distribution_de, description_de = EXCLUDED.description_de;

INSERT INTO clans (
    surname, 
    prevalence_hr, world_distribution_hr, description_hr,
    prevalence_en, world_distribution_en, description_en,
    prevalence_de, world_distribution_de, description_de
)
VALUES (
    'Jošić',
    'U Hrvatskoj danas živi oko 100 Jošića u 50 domaćinstava. Sredinom prošlog stoljeća bilo ih je približno 80, pa se njihov broj povećao za 30 posto.Prisutni su u većini hrvatskih županija, u 17 gradova i osam manjih naselja, najviše u Zagrebu (20), Zadru (15), Vukovaru (10), Rijeci (10), te u Osijeku (', 'Prezime Jošić (uključujući: Josic, Jossic, Josich, Jossick, Yosich, Joshick, Iosic, Joshic, Josick i Jositsch) prisutno je u 28 država širom svijeta. Prezime "Josic" nosi oko 200 osoba u Njemačkoj, približno 60 u Austriji, te oko 60 osoba u Americi. "Josich" nosi manji broj osoba u Americi. "Yosich" nosi manji broj osoba u Americi.', '[IZVOR: POREKLO.RS - BALJCI]
JOŠIĆ – Lazarevdan
- 1711. Jovan Jošić; 1756. Luka i Nikola Jošić; 1948. godine popisano je 28 Jošića u Baljcima.

[OPĆENITO]
Jošići u Hrvatskoj podjednako su Srbi i Hrvati (iz Slavonskog Broda). U prošlom stoljeću relativno najviše hrvatskih stanovnika s ovim prezimenom rođeno je u gradovima Slavonskom Brodu i Vukovaru.',
    'About 100 people with faimily name Jošić live in Croatia today, in 50 households. There were 80 of them in the middle of the past century, and their number increased by 30 percent.They are located in the most of Croatian counties, in 17 cities and 8 other places, mostly in Zagreb (20), Zadar (15), Vukovar (10), Rijeka (10), and in Osijek (', 'Family name Jošić (including: Josic , Jossic , Josich , Jossick , Yosich , Joshick , Iosic , Joshic , Josick and Jositsch ) is present in 28 countries worldwide. The family name "Josic " is used by some 200 people in Germany , about 60 in Austria , and some 60 people in the United States. "Josich " is used by small number of people in the United States. "Yosich " is used by small number of people in the United States.', 'Jošić families can be both Serbs and Croats (from Slavonski Brod ). In the past century, relatively most of Croatian residents bearing this family name were born in Slavonski Brod and Vukovar.

(Detailed local history available in Croatian section).',
    'Keine Daten.', 'Keine Daten.', 'Daten werden gesammelt.'
)
ON CONFLICT (surname) DO UPDATE SET
    prevalence_hr = EXCLUDED.prevalence_hr, world_distribution_hr = EXCLUDED.world_distribution_hr, description_hr = EXCLUDED.description_hr,
    prevalence_en = EXCLUDED.prevalence_en, world_distribution_en = EXCLUDED.world_distribution_en, description_en = EXCLUDED.description_en,
    prevalence_de = EXCLUDED.prevalence_de, world_distribution_de = EXCLUDED.world_distribution_de, description_de = EXCLUDED.description_de;

INSERT INTO clans (
    surname, 
    prevalence_hr, world_distribution_hr, description_hr,
    prevalence_en, world_distribution_en, description_en,
    prevalence_de, world_distribution_de, description_de
)
VALUES (
    'Klisurić',
    'U Hrvatskoj danas živi oko 130 Klisurića u 60 domaćinstava. Sredinom prošlog stoljeća bilo ih je približno 210, pa se njihov broj smanjio za 40 posto.Prisutni su u većini hrvatskih županija, u 16 gradova i 21 manjem naselju, najviše u Zagrebu (15), Jarmini u okolici Vinkovaca (15), Vinkovcima (10), Iloku (10), te u Brodskom Stupniku u okolici Pleternice (', 'Prezime Klisurić (uključujući: Klisuric, Klisurich) prisutno je u 8 država na tri kontinenta. Prezime "Klisuric" nosi oko 60 osoba u Americi i manji broj u Kanadi. "Klisurich" nosi manji broj osoba u Americi.', '[IZVOR: POREKLO.RS - BALJCI]
KLISURIĆ – Lazarevdan
- 1711. Todor Klisurić; 1756. Božo i Miajlo Kisurić; 1948. godine popisano je 56 Klisurića u Baljcima.

[OPĆENITO]
Klisurići u Hrvatskoj većinom su Hrvati, dobrim dijelom iz okolice Pleternice, a često su i Srbi. U prošlom stoljeću relativno najviše hrvatskih stanovnika s ovim prezimenom rođeno je u gradovima Samoboru i Vinkovacima. U Kravljaku u Gradu Samoboru svaki drugi stanovnik prezivao se Klisurić.',
    'About 130 people with faimily name Klisurić live in Croatia today, in 60 households. There were 210 of them in the middle of the past century, and their number decreased by 40 percent.They are located in the most of Croatian counties, in 16 cities and 21 other places, mostly in Zagreb (15), Jarmina in Vinkovci area (15), Vinkovci (10), Ilok (10), and in Brodski Stupnik in Pleternica area (', 'Family name Klisurić (including: Klisuric , Klisurich ) is present in 8 countries on three continents. The family name "Klisuric " is used by some 60 people in the United States and small number in Canada. "Klisurich " is used by small number of people in the United States.', 'Klisurić families are mainly Croats and they are mostly from Pleternica area , often Serbs. In the past century, relatively most of Croatian residents bearing this family name were born in Samobor and Vinkovci. In Kravljak in Samobor every second inhabitant had the family name Klisurić.

(Detailed local history available in Croatian section).',
    'Keine Daten.', 'Keine Daten.', 'Daten werden gesammelt.'
)
ON CONFLICT (surname) DO UPDATE SET
    prevalence_hr = EXCLUDED.prevalence_hr, world_distribution_hr = EXCLUDED.world_distribution_hr, description_hr = EXCLUDED.description_hr,
    prevalence_en = EXCLUDED.prevalence_en, world_distribution_en = EXCLUDED.world_distribution_en, description_en = EXCLUDED.description_en,
    prevalence_de = EXCLUDED.prevalence_de, world_distribution_de = EXCLUDED.world_distribution_de, description_de = EXCLUDED.description_de;

INSERT INTO clans (
    surname, 
    prevalence_hr, world_distribution_hr, description_hr,
    prevalence_en, world_distribution_en, description_en,
    prevalence_de, world_distribution_de, description_de
)
VALUES (
    'Milanković',
    'U Hrvatskoj danas živi oko 330 Milankovića u 170 domaćinstava. Sredinom prošlog stoljeća bilo ih je približno 560, pa se njihov broj smanjio za 40 posto.Prisutni su u gotovo svim hrvatskim županijama, u 34 grada i 40 manjih naselja, najviše u Zagrebu (70), Vukovaru (20), Osijeku (15), Slavonskom Brodu (15), te u Boboti u okolici Vukovara (10).', 'Najmanje deset obitelji s ovima prezimenom iselilo je iz Hrvatske u: Ameriku (4), Australiju (3), te u Njemačku (3).Prezime Milanković (uključujući: Milankovic, Milankovich i Milancovici) prisutno je u 21 državi širom svijeta. Prezime "Milankovic" nosi oko 90 osoba u Njemačkoj, manji broj u Egiptu, te manji broj osoba u Americi.', '[IZVOR: POREKLO.RS - BALJCI]
MILANKOVIĆ – Lazarevdan
- 1684. Lazo Milanković među pravoslavcima sa turske teritorije (drniškog područja) sklonjenim u Šibenik; 1711. Jovan Milanković. pok. Novaka u Baljcima; 1756. Lazo Milanković; 1948. godine popisan je 131 Milanković u Baljcima.

[OPĆENITO]
Milankovići u Hrvatskoj većinom su Srbi, dobrim dijelom iz okolice Drniša, ali su često i Hrvati (iz Novigrada). U prošlom stoljeću relativno najviše hrvatskih stanovnika s ovim prezimenom rođeno je u Gradu Zagrebu i u okolici Drniša. U Baljcima u okolici Drniša svaki peti stanovnik prezivao se Milanković.',
    'About 330 people with faimily name Milanković live in Croatia today, in 170 households. There were 560 of them in the middle of the past century, and their number decreased by 40 percent.They are located in almost all Croatian counties, in 34 cities and 40 other places, mostly in Zagreb (70), Vukovar (20), Osijek (15), Slavonski Brod (15), and in Bobota in Vukovar area (10).', 'At least ten families with this surname emigrated from Croatia to: the United States (4), Australia (3), and to Germany (3).Family name Milanković (including: Milankovic , Milankovich and Milancovici ) is present in 21 countries worldwide. The family name "Milankovic " is used by some 90 people in Germany , small number in Egypt , and small number of people in the United States.', 'Milanković families are mainly Serbs and they are mostly from Drnis area , whereas often Croats (from Novigrad a). In the past century, relatively most of Croatian residents bearing this family name were born in Zagreb and in Drnis area. In Baljci in Drnis area every fifth inhabitant had the family name Milanković.

(Detailed local history available in Croatian section).',
    'Keine Daten.', 'Keine Daten.', 'Daten werden gesammelt.'
)
ON CONFLICT (surname) DO UPDATE SET
    prevalence_hr = EXCLUDED.prevalence_hr, world_distribution_hr = EXCLUDED.world_distribution_hr, description_hr = EXCLUDED.description_hr,
    prevalence_en = EXCLUDED.prevalence_en, world_distribution_en = EXCLUDED.world_distribution_en, description_en = EXCLUDED.description_en,
    prevalence_de = EXCLUDED.prevalence_de, world_distribution_de = EXCLUDED.world_distribution_de, description_de = EXCLUDED.description_de;

INSERT INTO clans (
    surname, 
    prevalence_hr, world_distribution_hr, description_hr,
    prevalence_en, world_distribution_en, description_en,
    prevalence_de, world_distribution_de, description_de
)
VALUES (
    'Milorad',
    'U Hrvatskoj danas živi oko 10 Milorada u samo tri domaćinstva. Sredinom prošlog stoljeća bilo ih je približno 30, pa se njihov broj višestruko smanjio.Prisutni su u samo pet hrvatskih naselja i to u Vukovaru (Belom Manastiru (Podaci u okolici Ploča (Zaprešiću (Našicama (', 'Prezime Milorad prisutno je u 10 država na četiri kontinenta. Prezime "Milorad" nosi oko 60 osoba u Rusiji, manji broj u Rumunjskoj, te manji broj osoba u Americi.', '[OPĆENITO]
Miloradi u Hrvatskoj većinom su Hrvati (iz Grada Vukovara), a nešto manje i Srbi. U prošlom stoljeću relativno najviše hrvatskih stanovnika s ovim prezimenom rođeno je u Gradu Vukovaru i u Zapadnoj Bosni (područje Livna).',
    'About 10 people with faimily name Milorad live in Croatia today, in three households only. There were 30 of them in the middle of the past century, and their number decreased significantly.They are located in only five naselja i to in Vukovar (Beli Manastir (Podaca in Ploce area (Zapresic (Nasice (', 'Family name Milorad is present in 10 countries on four continents. The family name "Milorad " is used by some 60 people in Russian Federation , small number in Romania , and small number of people in the United States.', 'In Croatia, Milorad families are mainly Croats (from Vukovar ), less frequently Serbs. In the past century, relatively most of Croatian residents bearing this family name were born in Vukovar and in Western Bosnia (Livno area).',
    'Keine Daten.', 'Keine Daten.', 'Daten werden gesammelt.'
)
ON CONFLICT (surname) DO UPDATE SET
    prevalence_hr = EXCLUDED.prevalence_hr, world_distribution_hr = EXCLUDED.world_distribution_hr, description_hr = EXCLUDED.description_hr,
    prevalence_en = EXCLUDED.prevalence_en, world_distribution_en = EXCLUDED.world_distribution_en, description_en = EXCLUDED.description_en,
    prevalence_de = EXCLUDED.prevalence_de, world_distribution_de = EXCLUDED.world_distribution_de, description_de = EXCLUDED.description_de;

INSERT INTO clans (
    surname, 
    prevalence_hr, world_distribution_hr, description_hr,
    prevalence_en, world_distribution_en, description_en,
    prevalence_de, world_distribution_de, description_de
)
VALUES (
    'Obradović',
    'U Hrvatskoj danas živi oko 1700 Obradovića u 810 domaćinstava. Sredinom prošlog stoljeća bilo ih je približno 1900, pa se njihov broj smanjio za 10 posto.Prisutni su u svim hrvatskim županijama, u 77 gradova i 154 manja naselja, najviše u Zagrebu (320), Metkoviću (155), Dubrovniku (115), Vukovaru (55), te u Požegi (45).', 'Najmanje 39 obitelji s ovima prezimenom iselilo je iz Hrvatske u: Njemačku (11), Švicarsku (6), Ameriku (5), Veliku Britaniju (5), Australiju (4), Austriju (3), Nizozemsku (2), Kanadu (2), te u Švedsku (1).Prezime Obradović (uključujući: Obradovich, Obradovic) prisutno je u 51 državi širom svijeta. Prezime "Obradovic" nosi oko 500 osoba u Njemačkoj, približno 400 u Americi, te oko 100 osoba u Velikoj Britaniji. "Obradovich" nosi oko 600 osoba u Americi, približno 200 u Peruu, te oko 100 osoba u Rusiji.', '[IZVOR: POREKLO.RS - BALJCI]
OBRADOVIĆ (ogranak Beševića) – Nikoljdan
- 1711. Jovan Bešević pok. Obrada; 1756. Ivan/Jovan Bešević-Obradović; 1948. godine popisano je 16 Obradovića u Baljcima.

[OPĆENITO]
Obradovići u Hrvatskoj pretežito su Hrvati, dobrim dijelom iz Neuma (BiH), a često su i Srbi te su vrlo rijetko i Crnogorci (iz Srbije). U prošlom stoljeću relativno najviše hrvatskih stanovnika s ovim prezimenom rođeno je u gradovima Zagrebu i Dubrovniku. U Crnoglavu u Neumu, BiH gotovo svaki stanovnik prezivao se Obradović.',
    'About 1700 people with faimily name Obradović live in Croatia today, in 810 households. There were 1900 of them in the middle of the past century, and their number decreased by 10 percent.They are located in all Croatian counties, in 77 cities and 154 other places, mostly in Zagreb (320), Metkovic (155), Dubrovnik (115), Vukovar (55), and in Pozega (45).', 'At least 39 families with this surname emigrated from Croatia to: Germany (11), Switzerland (6), the United States (5), the United Kingdom (5), Australia (4), Austria (3), the Netherlands (2), Canada (2), and to Sweden (1).Family name Obradović (including: Obradovich , Obradovic ) is present in 51 countries worldwide. The family name "Obradovic " is used by some 500 people in Germany , about 400 in the United States , and some 100 people in Great Britain. "Obradovich " is used by some 600 people in the United States , about 200 in Peru , and some 100 people in Russian Federation.', 'Obradović families are mainly Croats and they are mostly from Neum (Herzegovina), often Serbs, very rarely Montenegrins (from Serbia ). In the past century, relatively most of Croatian residents bearing this family name were born in Zagreb and Dubrovnik. In Crnoglav in Neum (Herzegovina) nearly every inhabitant had the family name Obradović.

(Detailed local history available in Croatian section).',
    'Keine Daten.', 'Keine Daten.', 'Daten werden gesammelt.'
)
ON CONFLICT (surname) DO UPDATE SET
    prevalence_hr = EXCLUDED.prevalence_hr, world_distribution_hr = EXCLUDED.world_distribution_hr, description_hr = EXCLUDED.description_hr,
    prevalence_en = EXCLUDED.prevalence_en, world_distribution_en = EXCLUDED.world_distribution_en, description_en = EXCLUDED.description_en,
    prevalence_de = EXCLUDED.prevalence_de, world_distribution_de = EXCLUDED.world_distribution_de, description_de = EXCLUDED.description_de;

INSERT INTO clans (
    surname, 
    prevalence_hr, world_distribution_hr, description_hr,
    prevalence_en, world_distribution_en, description_en,
    prevalence_de, world_distribution_de, description_de
)
VALUES (
    'Radomilović',
    'U Hrvatskoj danas živi oko 30 Radomilovića u 12 domaćinstava. Sredinom prošlog stoljeća bilo ih je približno 30, pa je njihov broj ostao podjednak.Prisutni su u šest hrvatskih županija, u šest gradova i dva manja naselja, najviše u Kaštel Gomilici (Novom Vinodolskom (Zagrebu (Andrilovcu (Solinu (', 'Prezime Radomilović (uključujući: Radomilovic, Radomilovich) prisutno je u pet država na dva kontinenta. "Radomilovich" nosi nekoliko osoba u Americi.', '[IZVOR: POREKLO.RS - BALJCI]
RADOMILOVIĆ – Nikoljdan
- Vjerovatno varijanta prezimena Radmilović. Povezuju se s Predojevićima iz Prijevora (Bileća). U Baljcima i Vrbici se pominju kao stočari.
TARLE
- Prezime starohrvatskog porijekla iz Dalmacije.

[OPĆENITO]
Radomilovići u Hrvatskoj većinom su Hrvati (iz Grada Novog Vinodolskog), a nešto manje i Srbi. U prošlom stoljeću relativno najviše hrvatskih stanovnika s ovim prezimenom rođeno je u okolici Slunja i u okolici Drniša. U Bogovolju u okolici Slunja svaki dvadeseti stanovnik prezivao se Radomilović.',
    'About 30 people with faimily name Radomilović live in Croatia today, in 12 households. There were 30 of them in the middle of the past century, and their number remains constant.They are located in 6 Croatian counties, in 6 cities and two other places, mostly in Kastel Gomilica (Novi Vinodolski (Zagreb (Andrilovec (Solin (', 'Family name Radomilović (including: Radomilovic , Radomilovich ) is present in five countries on two continents. "Radomilovich " is used by few people in the United States.', 'In Croatia, Radomilović families are mainly Croats (from Novi Vinodolski ), less frequently Serbs. In the past century, relatively most of Croatian residents bearing this family name were born in Slunj area and in Drnis area. In Bogovolja in Slunj area every twentieth inhabitant had the family name Radomilović.

(Detailed local history available in Croatian section).',
    'Keine Daten.', 'Keine Daten.', 'Daten werden gesammelt.'
)
ON CONFLICT (surname) DO UPDATE SET
    prevalence_hr = EXCLUDED.prevalence_hr, world_distribution_hr = EXCLUDED.world_distribution_hr, description_hr = EXCLUDED.description_hr,
    prevalence_en = EXCLUDED.prevalence_en, world_distribution_en = EXCLUDED.world_distribution_en, description_en = EXCLUDED.description_en,
    prevalence_de = EXCLUDED.prevalence_de, world_distribution_de = EXCLUDED.world_distribution_de, description_de = EXCLUDED.description_de;

INSERT INTO clans (
    surname, 
    prevalence_hr, world_distribution_hr, description_hr,
    prevalence_en, world_distribution_en, description_en,
    prevalence_de, world_distribution_de, description_de
)
VALUES (
    'Romac',
    'U Hrvatskoj danas živi oko 450 Romaca u 160 domaćinstava. Sredinom prošlog stoljeća bilo ih je približno 290, pa se njihov broj povećao za 50 posto.Prisutni su u većini hrvatskih županija, u 15 gradova i 14 manja naselja, najviše u Glavicama (210), Sinju (115), Zagrebu (70), Splitu (40), te u Semeljcima u okolici Đakova (10).', 'Najmanje dvije obitelji s ovima prezimenom iselile su iz Hrvatske u Ameriku.Prezime Romac (uključujući: Romach, Romatz, Romaz i Romacz) prisutno je u 27 država širom svijeta. Prezime "Romac" nosi oko 200 osoba u Francuskoj, približno 100 u Americi, te manji broj osoba u Brazilu. "Romatz" nosi oko 100 osoba u Americi, manji broj u Tajlandu, te manji broj osoba u Ekvadoru. "Romach" nosi oko 200 osoba u Maroku, približno 100 u Izraelu, te oko 50 osoba u Americi.', '[IZVOR: POREKLO.RS - BALJCI]
ROMAC (ranije Bogdanović) – Đurđevdan
- 1711. Jovan, Luka i Ilija Bogdanović; 1756. Jovan Bogdanović-Romac; 1948. godine popisana su 4 Romca u Baljcima.
MAKSIĆ
- 1730-ih rođen Marko Maksić; iščezli iz sela u 20. vijeku.
BAIĆ
- 1740-ih Jovan Baić; iščezli iz sela u 20. vijeku.

[OPĆENITO]
Romci u Hrvatskoj su Hrvati, najvećim dijelom iz Sinja. U prošlom stoljeću relativno najviše hrvatskih stanovnika s ovim prezimenom rođeno je u gradovima Sinju i Zagrebu.',
    'About 450 people with faimily name Romac live in Croatia today, in 160 households. There were 290 of them in the middle of the past century, and their number increased by 50 percent.They are located in the most of Croatian counties, in 15 cities and 14 other places, mostly in Glavice (210), Sinj (115), Zagreb (70), Split (40), and in Semeljci in Djakovo area (10).', 'At least two families with this surname emigrated from Croatia to the United States.Family name Romac (including: Romach , Romatz , Romaz and Romacz ) is present in 27 countries worldwide. The family name "Romac " is used by some 200 people in France , about 100 in the United States , and small number of people in Brazil. "Romatz " is used by some 100 people in the United States , small number in Thailand , and small number of people in Ecuador. "Romach " is used by some 200 people in Morocco , about 100 in Israel , and some 50 people in the United States.', 'Romac families are Croats and they are mostly from Sinj. In the past century, relatively most of Croatian residents bearing this family name were born in Sinj and Zagreb.

(Detailed local history available in Croatian section).',
    'Keine Daten.', 'Keine Daten.', 'Daten werden gesammelt.'
)
ON CONFLICT (surname) DO UPDATE SET
    prevalence_hr = EXCLUDED.prevalence_hr, world_distribution_hr = EXCLUDED.world_distribution_hr, description_hr = EXCLUDED.description_hr,
    prevalence_en = EXCLUDED.prevalence_en, world_distribution_en = EXCLUDED.world_distribution_en, description_en = EXCLUDED.description_en,
    prevalence_de = EXCLUDED.prevalence_de, world_distribution_de = EXCLUDED.world_distribution_de, description_de = EXCLUDED.description_de;

INSERT INTO clans (
    surname, 
    prevalence_hr, world_distribution_hr, description_hr,
    prevalence_en, world_distribution_en, description_en,
    prevalence_de, world_distribution_de, description_de
)
VALUES (
    'Tarle',
    'U Hrvatskoj danas živi oko 240 Tarlea u 100 domaćinstava. Sredinom prošlog stoljeća bilo ih je približno 80, pa se njihov broj utrostručio.Prisutni su u devet hrvatskih županija, u 19 gradova i devet manjih naselja, najviše u Zagrebu (60), Ježeviću (20), Velušiću (15), Vodicama (15), te u Drnišu (15).', 'Prezime Tarle (uključujući: Thearle, Tharle, Tarlé i Tarleh) prisutno je u 29 država širom svijeta. "Tharle" nosi oko 50 osoba u Australiji, manji broj u Americi, te manji broj osoba u Kanadi. "Thearle" nosi oko 100 osoba u Americi, približno 100 u Australiji, te oko 60 osoba u Velikoj Britaniji.', '[OPĆENITO]
Tarle u Hrvatskoj su Hrvati, najvećim dijelom iz Drniša. U prošlom stoljeću relativno najviše hrvatskih stanovnika s ovim prezimenom rođeno je u gradovima Drnišu i Zagrebu. U Velušiću u Gradu Drnišu svaki četvrti stanovnik prezivao se Tarle.',
    'About 240 people with faimily name Tarle live in Croatia today, in 100 households. There were 80 of them in the middle of the past century, and their number tripled.They are located in 9 Croatian counties, in 19 cities and 9 other places, mostly in Zagreb (60), Jezevic (20), Velusic (15), Vodice (15), and in Drnis (15).', 'Family name Tarle (including: Thearle , Tharle , Tarlé and Tarleh ) is present in 29 countries worldwide. "Tharle " is used by some 50 people in Australia , small number in the United States , and small number of people in Canada. "Thearle " is used by some 100 people in the United States , about 100 in Australia , and some 60 people in Great Britain.', 'Tarle families are Croats and they are mostly from Drnis. In the past century, relatively most of Croatian residents bearing this family name were born in Drnis and Zagreb. In Velušić in Drnis every fourth inhabitant had the family name Tarle.',
    'Keine Daten.', 'Keine Daten.', 'Daten werden gesammelt.'
)
ON CONFLICT (surname) DO UPDATE SET
    prevalence_hr = EXCLUDED.prevalence_hr, world_distribution_hr = EXCLUDED.world_distribution_hr, description_hr = EXCLUDED.description_hr,
    prevalence_en = EXCLUDED.prevalence_en, world_distribution_en = EXCLUDED.world_distribution_en, description_en = EXCLUDED.description_en,
    prevalence_de = EXCLUDED.prevalence_de, world_distribution_de = EXCLUDED.world_distribution_de, description_de = EXCLUDED.description_de;

INSERT INTO clans (
    surname, 
    prevalence_hr, world_distribution_hr, description_hr,
    prevalence_en, world_distribution_en, description_en,
    prevalence_de, world_distribution_de, description_de
)
VALUES (
    'Tetek',
    'U Hrvatskoj danas živi svega nekoliko osoba s prezimenom Tetek u samo jednom domaćinstvu.', 'Prezime Tetek prisutno je u 10 država na četiri kontinenta.', '[IZVOR: POREKLO.RS - BALJCI]
TETEK (vjerovatno ogranak Bibića) – Nikoljdan
- 1766. Lazo Tetek; 1948. godine popisano je 5 Teteka u Baljcima.

[OPĆENITO]
Prezime Tetek u Hrvatskoj nose Srbi.',
    'Only a few people with faimily name Štakorec live in Croatia today, in one household only.They are located in only one small Croatian place, in Trg (', 'Family name Štakorec is present in this form only in Croatia.', 'In Croatia, Štakorec families are Croats (from Ozalj ). In the past century, relatively most of Croatian residents bearing this family name were born in Ozalj.

(Detailed local history available in Croatian section).',
    'Keine Daten.', 'Keine Daten.', 'Daten werden gesammelt.'
)
ON CONFLICT (surname) DO UPDATE SET
    prevalence_hr = EXCLUDED.prevalence_hr, world_distribution_hr = EXCLUDED.world_distribution_hr, description_hr = EXCLUDED.description_hr,
    prevalence_en = EXCLUDED.prevalence_en, world_distribution_en = EXCLUDED.world_distribution_en, description_en = EXCLUDED.description_en,
    prevalence_de = EXCLUDED.prevalence_de, world_distribution_de = EXCLUDED.world_distribution_de, description_de = EXCLUDED.description_de;

INSERT INTO clans (
    surname, 
    prevalence_hr, world_distribution_hr, description_hr,
    prevalence_en, world_distribution_en, description_en,
    prevalence_de, world_distribution_de, description_de
)
VALUES (
    'Tica',
    'U Hrvatskoj danas živi oko 180 Tica u 70 domaćinstava. Sredinom prošlog stoljeća bilo ih je približno 70, pa se njihov broj više nego udvostručio.Prisutni su u većini hrvatskih županija, u 16 gradova i 20 manjih naselja, najviše u Zagrebu (80), Vukovaru (25), Rijeci (10), Osijeku (10), te u Splitu (', 'Najmanje dvije obitelji s ovima prezimenom iselile su iz Hrvatske u Njemačku (1) i Ameriku (1).Prezime Tica (uključujući: Tichá, Tiza, Ticca, Ttica, Tiezza, Ticha, Tizza, Titza i Tieza) prisutno je u 61 državi širom svijeta. "Titza" nosi nekoliko osoba u Americi. "Tieza" nosi nekoliko osoba u Americi. "Ticha" nosi oko 600 osoba u Češkoj, približno 60 u Njemačkoj, te manji broj osoba u Americi.', '[IZVOR: POREKLO.RS - BALJCI]
TICA – Jovanjdan/Đurđevdan
- Porijeklom iz Hercegovine (Polimlje, Zubci). Osnovali Tičevo.

[OPĆENITO]
Tice u Hrvatskoj često su Hrvati, najvećim dijelom iz Hercegovine, a rjeđe i Srbi. U prošlom stoljeću relativno najviše hrvatskih stanovnika s ovim prezimenom rođeno je u Hercegovini (područje Gruda) i u Gradu Zagrebu.',
    'About 180 people with faimily name Tica live in Croatia today, in 70 households. There were 70 of them in the middle of the past century, and their number more than doubled.They are located in the most of Croatian counties, in 16 cities and 20 other places, mostly in Zagreb (80), Vukovar (25), Rijeka (10), Osijek (10), and in Split (', 'At least two families with this surname emigrated from Croatia to Germany (1) and the United States (1).Family name Tica (including: Tichá , Tiza , Ticca , Ttica , Tiezza , Ticha , Tizza , Titza and Tieza ) is present in 61 countries worldwide. "Titza " is used by few people in the United States. "Tieza " is used by few people in the United States. "Ticha " is used by some 600 people in Czech Republic , about 60 in Germany , and small number of people in the United States.', 'Tica families are often Croats and they are mostly from Herzegovina , rarely Serbs. In the past century, relatively most of Croatian residents bearing this family name were born in Herzegovina (Grude area) and in Zagreb.

(Detailed local history available in Croatian section).',
    'Keine Daten.', 'Keine Daten.', 'Daten werden gesammelt.'
)
ON CONFLICT (surname) DO UPDATE SET
    prevalence_hr = EXCLUDED.prevalence_hr, world_distribution_hr = EXCLUDED.world_distribution_hr, description_hr = EXCLUDED.description_hr,
    prevalence_en = EXCLUDED.prevalence_en, world_distribution_en = EXCLUDED.world_distribution_en, description_en = EXCLUDED.description_en,
    prevalence_de = EXCLUDED.prevalence_de, world_distribution_de = EXCLUDED.world_distribution_de, description_de = EXCLUDED.description_de;

INSERT INTO clans (
    surname, 
    prevalence_hr, world_distribution_hr, description_hr,
    prevalence_en, world_distribution_en, description_en,
    prevalence_de, world_distribution_de, description_de
)
VALUES (
    'Vidović',
    'U Hrvatskoj danas živi oko 6600 Vidovića u 2800 domaćinstava. Sredinom prošlog stoljeća bilo ih je približno 4000, pa se njihov broj povećao za 60 posto.Prisutni su u svim hrvatskim županijama, u 110 gradova i 605 manjih naselja, najviše u Zagrebu (885), Splitu (555), Rijeci (205), Sesvetama (150), te u Slavonskom Brodu (130).', 'Najmanje 127 obitelji s ovima prezimenom iselilo je iz Hrvatske u: Njemačku (52), Australiju (22), Ameriku (15), Austriju (12), Švicarsku (8), Kanadu (6), Švedsku (6), Južnoafričku Republiku (2), Finsku (1), Nizozemsku (1), Japan (1), te u Francusku (1).Prezime Vidović (uključujući: Vidovic, Vidovich, Vidovics i Widovic) prisutno je u 51 državi širom svijeta. Prezime "Vidovic" nosi oko 3000 osoba u Njemačkoj, približno 900 u Americi, te oko 700 osoba u Boliviji. "Vidovich" nosi oko 500 osoba u Americi, približno 100 u Australiji, te manji broj osoba u Urugvaju. "Vidovics" nosi oko 200 osoba u Mađarskoj, manji broj u Italiji, te manji broj osoba u Americi.', '[OPĆENITO]
Vidovići u Hrvatskoj najčešće su Hrvati, većim dijelom iz okolice Trogira, a prema nekim izvorima iz istočne Hercegovine (Popovo polje). Vrlo rijetko su i Srbi. U prošlom stoljeću relativno najviše hrvatskih stanovnika s ovim prezimenom rođeno je u Gradu Zagrebu i u Zapadnoj Bosni (područje Livna). U Sevidu u okolici Trogira gotovo svaki stanovnik prezivao se Vidović.',
    'About 6600 people with faimily name Vidović live in Croatia today, in 2800 households. There were 4000 of them in the middle of the past century, and their number increased by 60 percent.They are located in all Croatian counties, in 110 cities and 605 other places, mostly in Zagreb (885), Split (555), Rijeka (205), Sesvete (150), and in Slavonski Brod (130).', 'At least 127 families with this surname emigrated from Croatia to: Germany (52), Australia (22), the United States (15), Austria (12), Switzerland (8), Canada (6), Sweden (6), South Africa (2), Finland (1), the Netherlands (1), Japan (1), and to France (1).Family name Vidović (including: Vidovic , Vidovich , Vidovics and Widovic ) is present in 51 countries worldwide. The family name "Vidovic " is used by some 3000 people in Germany , about 900 in the United States , and some 700 people in Bolivia. "Vidovich " is used by some 500 people in the United States , about 100 in Australia , and small number of people in Uruguay. "Vidovics " is used by some 200 people in Hungary , small number in Italy , and small number of people in the United States.', 'Vidović families are usually Croats and they are mostly from Trogir area. According to some sources they are from east Herzegovina (Popovo polje), very rarely Serbs. In the past century, relatively most of Croatian residents bearing this family name were born in Zagreb and in Western Bosnia (Livno area). In Sevid in Trogir area nearly every inhabitant had the family name Vidović.',
    'Keine Daten.', 'Keine Daten.', 'Daten werden gesammelt.'
)
ON CONFLICT (surname) DO UPDATE SET
    prevalence_hr = EXCLUDED.prevalence_hr, world_distribution_hr = EXCLUDED.world_distribution_hr, description_hr = EXCLUDED.description_hr,
    prevalence_en = EXCLUDED.prevalence_en, world_distribution_en = EXCLUDED.world_distribution_en, description_en = EXCLUDED.description_en,
    prevalence_de = EXCLUDED.prevalence_de, world_distribution_de = EXCLUDED.world_distribution_de, description_de = EXCLUDED.description_de;

INSERT INTO clans (
    surname, 
    prevalence_hr, world_distribution_hr, description_hr,
    prevalence_en, world_distribution_en, description_en,
    prevalence_de, world_distribution_de, description_de
)
VALUES (
    'Vranković',
    'U Hrvatskoj danas živi oko 410 Vrankovića u 200 domaćinstava. Sredinom prošlog stoljeća bilo ih je približno 520, pa se njihov broj smanjio za 20 posto.Prisutni su u većini hrvatskih županija, u 31 gradu i 34 manja naselja, najviše u Rijeci (60), Splitu (55), Zagrebu (45), Svirču na otoku Hvaru (35), te u Rtini u okolici Nina (25).', 'Najmanje 17 obitelji s ovima prezimenom iselilo je iz Hrvatske u: Australiju (6), Ameriku (5), Njemačku (2), Švedsku (2), Francusku (1), te u Austriju (1).Prezime Vranković (uključujući: Vrankovic, Vrankovich i Vrancovich) prisutno je u 14 država širom svijeta. Prezime "Vrankovic" nosi oko 200 osoba u Americi, približno 100 u Australiji, te manji broj osoba u Kanadi. "Vrankovich" nosi oko 70 osoba u Americi i manji broj u Australiji.', '[IZVOR: POREKLO.RS - BALJCI]
VRANKOVIĆ – Đurđevdan
- Povezuju se s prezimenom Vranjković iz Knina. Prisutni u Banatu od 1920-ih.

[OPĆENITO]
Vrankovići u Hrvatskoj u su najvećem broju Hrvati, većim dijelom s otoka Hvara, a prema nekim izvorima iz Blata na Cetini. Rijetko su i Srbi, te Slovaci (Ilok). U prošlom stoljeću relativno najviše hrvatskih stanovnika s ovim prezimenom rođeno je u gradovima Splitu i Rijeci. U Svirču na otoku Hvaru svaki osmi stanovnik prezivao se Vranković.',
    'About 410 people with faimily name Vranković live in Croatia today, in 200 households. There were 520 of them in the middle of the past century, and their number decreased by 20 percent.They are located in the most of Croatian counties, in 31 cities and 34 other places, mostly in Rijeka (60), Split (55), Zagreb (45), Svirce on the Island of Hvar (35), and in Rtina in Nin area (25).', 'At least 17 families with this surname emigrated from Croatia to: Australia (6), the United States (5), Germany (2), Sweden (2), France (1), and to Austria (1).Family name Vranković (including: Vrankovic , Vrankovich and Vrancovich ) is present in 14 countries worldwide. The family name "Vrankovic " is used by some 200 people in the United States , about 100 in Australia , and small number of people in Canada. "Vrankovich " is used by some 70 people in the United States and small number in Australia.', 'Vranković families are frequently Croats and they are mostly from the Island of Hvar. According to some sources they are from Blato on Cetina River, rarely Serbs, and Slovaks (Iloka). In the past century, relatively most of Croatian residents bearing this family name were born in Split and Rijeka. In Svirče on the Island of Hvar every eighth inhabitant had the family name Vranković.

(Detailed local history available in Croatian section).',
    'Keine Daten.', 'Keine Daten.', 'Daten werden gesammelt.'
)
ON CONFLICT (surname) DO UPDATE SET
    prevalence_hr = EXCLUDED.prevalence_hr, world_distribution_hr = EXCLUDED.world_distribution_hr, description_hr = EXCLUDED.description_hr,
    prevalence_en = EXCLUDED.prevalence_en, world_distribution_en = EXCLUDED.world_distribution_en, description_en = EXCLUDED.description_en,
    prevalence_de = EXCLUDED.prevalence_de, world_distribution_de = EXCLUDED.world_distribution_de, description_de = EXCLUDED.description_de;

INSERT INTO clans (
    surname, 
    prevalence_hr, world_distribution_hr, description_hr,
    prevalence_en, world_distribution_en, description_en,
    prevalence_de, world_distribution_de, description_de
)
VALUES (
    'Tarlac',
    'Nema podataka.', 'Nema podataka.', '[IZVOR: POREKLO.RS - BALJCI]
TARLAĆ (ogranak Beševića) – Nikoljdan
- 1756. Ivan/Jovan Bešević-Tarlać; 1948. godine popisano je 13 Tarlaća u Baljcima.

[OPĆENITO]
Podaci se prikupljaju.',
    'Data missing.', 'Data missing.', 'Data collecting.

(Detailed local history available in Croatian section).',
    'Keine Daten.', 'Keine Daten.', 'Daten werden gesammelt.'
)
ON CONFLICT (surname) DO UPDATE SET
    prevalence_hr = EXCLUDED.prevalence_hr, world_distribution_hr = EXCLUDED.world_distribution_hr, description_hr = EXCLUDED.description_hr,
    prevalence_en = EXCLUDED.prevalence_en, world_distribution_en = EXCLUDED.world_distribution_en, description_en = EXCLUDED.description_en,
    prevalence_de = EXCLUDED.prevalence_de, world_distribution_de = EXCLUDED.world_distribution_de, description_de = EXCLUDED.description_de;

INSERT INTO clans (
    surname, 
    prevalence_hr, world_distribution_hr, description_hr,
    prevalence_en, world_distribution_en, description_en,
    prevalence_de, world_distribution_de, description_de
)
VALUES (
    'Arambasic',
    'Nema podataka.', 'Nema podataka.', '[IZVOR: POREKLO.RS - BALJCI]
ARAMBAŠIĆ (ogranak Beševića) – Nikoljdan
- 1756. arambaša Stojan Bešević (vjerovatno predak); u 19. vijeku Todor Arambašić; 1948. godine popisano je 13 Arambašića u Baljcima.

[OPĆENITO]
Podaci se prikupljaju.',
    'Data missing.', 'Data missing.', 'Data collecting.

(Detailed local history available in Croatian section).',
    'Keine Daten.', 'Keine Daten.', 'Daten werden gesammelt.'
)
ON CONFLICT (surname) DO UPDATE SET
    prevalence_hr = EXCLUDED.prevalence_hr, world_distribution_hr = EXCLUDED.world_distribution_hr, description_hr = EXCLUDED.description_hr,
    prevalence_en = EXCLUDED.prevalence_en, world_distribution_en = EXCLUDED.world_distribution_en, description_en = EXCLUDED.description_en,
    prevalence_de = EXCLUDED.prevalence_de, world_distribution_de = EXCLUDED.world_distribution_de, description_de = EXCLUDED.description_de;

INSERT INTO clans (
    surname, 
    prevalence_hr, world_distribution_hr, description_hr,
    prevalence_en, world_distribution_en, description_en,
    prevalence_de, world_distribution_de, description_de
)
VALUES (
    'Gligoric',
    'Nema podataka.', 'Nema podataka.', '[IZVOR: POREKLO.RS - BALJCI]
GLIGORIĆ – Đurđevdan
- oko 1750. Jovan Gligorić, a rođeni Aleksa i Krstan Gligorić; 1948. godine popisana su 3 Gligorića u Baljcima.

[OPĆENITO]
Podaci se prikupljaju.',
    'Data missing.', 'Data missing.', 'Data collecting.

(Detailed local history available in Croatian section).',
    'Keine Daten.', 'Keine Daten.', 'Daten werden gesammelt.'
)
ON CONFLICT (surname) DO UPDATE SET
    prevalence_hr = EXCLUDED.prevalence_hr, world_distribution_hr = EXCLUDED.world_distribution_hr, description_hr = EXCLUDED.description_hr,
    prevalence_en = EXCLUDED.prevalence_en, world_distribution_en = EXCLUDED.world_distribution_en, description_en = EXCLUDED.description_en,
    prevalence_de = EXCLUDED.prevalence_de, world_distribution_de = EXCLUDED.world_distribution_de, description_de = EXCLUDED.description_de;

INSERT INTO clans (
    surname, 
    prevalence_hr, world_distribution_hr, description_hr,
    prevalence_en, world_distribution_en, description_en,
    prevalence_de, world_distribution_de, description_de
)
VALUES (
    'Gutic',
    'Nema podataka.', 'Nema podataka.', '[IZVOR: POREKLO.RS - BALJCI]
GUTIĆ – Đurđevdan
- oko 1750. rođen Jovan Gutić; 1948. godine popisano je 7 Gutića u Baljcima.

[OPĆENITO]
Podaci se prikupljaju.',
    'Data missing.', 'Data missing.', 'Data collecting.

(Detailed local history available in Croatian section).',
    'Keine Daten.', 'Keine Daten.', 'Daten werden gesammelt.'
)
ON CONFLICT (surname) DO UPDATE SET
    prevalence_hr = EXCLUDED.prevalence_hr, world_distribution_hr = EXCLUDED.world_distribution_hr, description_hr = EXCLUDED.description_hr,
    prevalence_en = EXCLUDED.prevalence_en, world_distribution_en = EXCLUDED.world_distribution_en, description_en = EXCLUDED.description_en,
    prevalence_de = EXCLUDED.prevalence_de, world_distribution_de = EXCLUDED.world_distribution_de, description_de = EXCLUDED.description_de;

INSERT INTO clans (
    surname, 
    prevalence_hr, world_distribution_hr, description_hr,
    prevalence_en, world_distribution_en, description_en,
    prevalence_de, world_distribution_de, description_de
)
VALUES (
    'Tosic',
    'Nema podataka.', 'Nema podataka.', '[IZVOR: POREKLO.RS - BALJCI]
TOŠIĆ – Đurđevdan
- oko 1760. rođen Stojan Tošić; 1948. godine popisano je 8 Tošića u Baljcima.
BOGDANOVIĆ (u 16. 17. i 18. vijeku)
- 1601. braća Vuško i Radivoj Bogdanović; od Bogdanovića su nastali Mudrići, Romci i vjerovatno još neka prezimena.
MUDRIĆ (ranije Bogdanović)
- 1709. Ilija Bogdanović iz Baljaka imao posjed u Žitniću, a prezime se navodi i kao Bogdanović-Mudre; krajem 18. vijeka Marko Mudrić; 1948. godine popisan je 1 Mudrić u Baljcima.

[OPĆENITO]
Podaci se prikupljaju.',
    'Data missing.', 'Data missing.', 'Data collecting.

(Detailed local history available in Croatian section).',
    'Keine Daten.', 'Keine Daten.', 'Daten werden gesammelt.'
)
ON CONFLICT (surname) DO UPDATE SET
    prevalence_hr = EXCLUDED.prevalence_hr, world_distribution_hr = EXCLUDED.world_distribution_hr, description_hr = EXCLUDED.description_hr,
    prevalence_en = EXCLUDED.prevalence_en, world_distribution_en = EXCLUDED.world_distribution_en, description_en = EXCLUDED.description_en,
    prevalence_de = EXCLUDED.prevalence_de, world_distribution_de = EXCLUDED.world_distribution_de, description_de = EXCLUDED.description_de;

INSERT INTO clans (
    surname, 
    prevalence_hr, world_distribution_hr, description_hr,
    prevalence_en, world_distribution_en, description_en,
    prevalence_de, world_distribution_de, description_de
)
VALUES (
    'Borojevic',
    'Nema podataka.', 'Nema podataka.', '[IZVOR: POREKLO.RS - BALJCI]
BOROJEVIĆ (ogranak Beševića iz 18. i 19. vijeka) – Nikoljdan
- 1711. Boroje Bešević; 1756. Petar Bešević-Borojević.
PUĐAŠ (u 18. i 19. vijeku)
- 1756. Marko Puđaš; iselili u Mirkovce kod Vinkovaca.
SINČEVIĆ (postojali u 18. i 19. vijeku)
- oko 1750. rođen Sava Sinčević.
KNEZ (postojali u 18. i 19. vijeku)
- oko 1740. rođen Jakov Knez; iselili u Slavoniju/Srem sredinom 19. vijeka.
GUGIĆ
- 1756. Ivan Gugić (vjerovatno doselili kao kovači/Cingano, pošto to piše za Gugića koji je bio u Šibeniku/Varošu); 1948. godine popisano je 14 Gugića u Baljcima.
VIDOVIĆ
- došli iz susjednog sela Gradac krajem 19.  vijeka; 1948. godine popisano je 14 Vidovića u Baljcima.
JAJČANIN (u 18. i 19. vijeku)
- 1756. Martin i Petar Jajčanin; 1835. Luka Jajčanin (u matičnim knjigama zapisivani kao kovači/Cingano).

[OPĆENITO]
Podaci se prikupljaju.',
    'Data missing.', 'Data missing.', 'Data collecting.

(Detailed local history available in Croatian section).',
    'Keine Daten.', 'Keine Daten.', 'Daten werden gesammelt.'
)
ON CONFLICT (surname) DO UPDATE SET
    prevalence_hr = EXCLUDED.prevalence_hr, world_distribution_hr = EXCLUDED.world_distribution_hr, description_hr = EXCLUDED.description_hr,
    prevalence_en = EXCLUDED.prevalence_en, world_distribution_en = EXCLUDED.world_distribution_en, description_en = EXCLUDED.description_en,
    prevalence_de = EXCLUDED.prevalence_de, world_distribution_de = EXCLUDED.world_distribution_de, description_de = EXCLUDED.description_de;
