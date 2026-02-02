/** MEMORIAL DATA SEED (Augmented) */


INSERT INTO clans (surname, description, prevalence, world_distribution)
VALUES (
    'Bašić',
    '[OPĆENITO O PREZIMENU]
Bašić families are usually Croats and they are mostly from Nin area , barely Bosniaks (from Cazinska Krajina Region, Bosnia) and Serbs. In the past century, relatively most of Croatian residents bearing this family name were born in Split and Zagreb. In Broćanac in Herzegovina every fourth inhabitant had the family name Bašić.',
    'About 5800 people with faimily name Bašić live in Croatia today, in 2400 households. There were 3700 of them in the middle of the past century, and their number increased by 60 percent.They are located in all Croatian counties, in 105 cities and 415 other places, mostly in Zagreb (950), Split (785), Zadar (270), Rijeka (195), and in Slavonski Brod (165).',
    'At least 109 families with this surname emigrated from Croatia to: Germany (40), the United States (18), Australia (17), Argentina (7), Austria (5), Switzerland (5), Sweden (4), the United Kingdom (3), Norway (3), France (2), Canada (2), Belgium (1), Chile (1), and to the Netherlands (1).Family name Bašić (including: Basic , Basich , Bashich , Bassick , Bassich , Bashic , Basick , Bashnick , Bassic and Basics ) is present in 71 countries worldwide. The family name "Basic " is used by some 9000 people in Bangladesh , about 5000 in Germany , and some 3000 people in the United States. "Basich " is used by some 900 people in the United States , about 300 in Mexico , and some 300 people in Ukraine. "Bashic " is used by few people in the United States.'
)
ON CONFLICT (surname) DO UPDATE SET
    description = EXCLUDED.description,
    prevalence = EXCLUDED.prevalence,
    world_distribution = EXCLUDED.world_distribution;

INSERT INTO clans (surname, description, prevalence, world_distribution)
VALUES (
    'Bešević',
    '[IZVOR: POREKLO.RS - BALJCI]
БЕШЕВИЋ – Никољдан
- 1711. харамбаша Јован Бешевић, Јован Бешевић пок. Милоша, Јован Бешевић пок. Обрада, Новак Бешевић, Бороје Бешевић; 1709. у Житнићу су имали посједе капетан/харамбаша Јован Баљак из Баљака и Новак Баљак из Баљака, а то су једино могли бити Бешевићи (крсна слава презимена Баљак из Житнића је исто Никољдан); Бешевићи су генерацијама били главари села Баљци; 1948. године пописана су 92 Бешевића у Баљцима.

[OPĆENITO O PREZIMENU]
In Croatia, Bešević families are predominantly Serbs, rarely Croats (from Vinkovci ). In the past century, relatively most of Croatian residents bearing this family name were born in Drnis area and in Vinkovci. In Baljci in Drnis area every sixth inhabitant had the family name Bešević.',
    'About 30 people with faimily name Bešević live in Croatia today, in 14 households. There were 100 of them in the middle of the past century, and their number decreased significantly.They are located in 6 Croatian counties, in 6 cities and threee other places, mostly in Vinkovci (Split (Sibenik (Velika Gorica (Zagreb (',
    'Family name Bešević (including: Besevic , Beshkevich , Besevich and Beshevich ) is present in five countries on two continents. The family name "Besevic " is used by small number of people in the United States. "Besevich " is used by few people in the United States.'
)
ON CONFLICT (surname) DO UPDATE SET
    description = EXCLUDED.description,
    prevalence = EXCLUDED.prevalence,
    world_distribution = EXCLUDED.world_distribution;

INSERT INTO clans (surname, description, prevalence, world_distribution)
VALUES (
    'Bibić',
    '[IZVOR: POREKLO.RS - BALJCI]
БИБИЋ (у 19. вијеку надимци Лошета, Дрљан и Амиџа) – Никољдан
- 1628. Радивој Бибић из Баљака; 1711. Сава, Никола, Јован и Стеван Бибић; 1756. Лазо, Филип, Тома, Петар, Петар звани Лошета, Илија и Боже Бибић; 1948. године пописана су 54 Бибића у Баљцима.

[OPĆENITO O PREZIMENU]
Bibić families are mainly Croats and they are mostly from the Island of Hvar. According to some sources they are from Zagorje or Drnis area, whereas often Serbs. In the past century, relatively most of Croatian residents bearing this family name were born in Drnis and on the Island of Hvar. In Vagani in Bosnian Krajina every third inhabitant had the family name Bibić.',
    'About 380 people with faimily name Bibić live in Croatia today, in 180 households. There were 470 of them in the middle of the past century, and their number decreased by 20 percent.They are located in the most of Croatian counties, in 28 cities and 29 other places, mostly in Zagreb (50), Hvar on the Island of Hvar (50), Split (45), Zadar (25), and in Oraovac in Obrovac area (20).',
    'Family name Bibić (including: Bibich , Bibiche , Bibic , Bibicha , Bibick , Bybych and Bibych ) is present in 41 countries worldwide. The family name "Bibic " is used by some 70 people in the United States , small number in Germany , and small number of people in Canada.'
)
ON CONFLICT (surname) DO UPDATE SET
    description = EXCLUDED.description,
    prevalence = EXCLUDED.prevalence,
    world_distribution = EXCLUDED.world_distribution;

INSERT INTO clans (surname, description, prevalence, world_distribution)
VALUES (
    'Džepina',
    '[OPĆENITO O PREZIMENU]
Džepina families are predominantly Croats and they are mostly from Knin area , less frequently Serbs. In the past century, relatively most of Croatian residents bearing this family name were born in Middle Bosnia (Travnik area) and in Knin. In Ričice in Middle Bosnia every ninth inhabitant had the family name Džepina.',
    'About 320 people with faimily name Džepina live in Croatia today, in 150 households. There were 220 of them in the middle of the past century, and their number increased by 50 percent.They are located in the most of Croatian counties, in 24 cities and 30 other places, mostly in Zagreb (90), Golubic (55), Zadar (25), Sibenik (20), and in Oklaj in Knin area (20).',
    'Family name Džepina (including: Dzepina , Depina and Depinna ) is present in 23 countries worldwide. "Depina " is used by some 2000 people in the United States , about 400 in Guinea-Bissau , and some 200 people in Cape Verde. "Depinna " is used by small number of people in the United States.'
)
ON CONFLICT (surname) DO UPDATE SET
    description = EXCLUDED.description,
    prevalence = EXCLUDED.prevalence,
    world_distribution = EXCLUDED.world_distribution;

INSERT INTO clans (surname, description, prevalence, world_distribution)
VALUES (
    'Genda',
    '[OPĆENITO O PREZIMENU]
Genda families are Croats and they are mostly from Benkovac. In the past century, relatively most of Croatian residents bearing this family name were born in Benkovac and Zadar.',
    'About 160 people with faimily name Genda live in Croatia today, in 60 households. There were 90 of them in the middle of the past century, and their number increased by 70 percent.They are located in 9 Croatian counties, in 14 cities and 11 other places, mostly in Zadar (55), Medvidja (20), Korlat (10), Rijeka (Moslavina Podravska in Donji Miholjac area (',
    'At least one family with this surname emigrated from Croatia to the United States.Family name Genda (including: Gendha , Ghenda ) is present in 38 countries worldwide.'
)
ON CONFLICT (surname) DO UPDATE SET
    description = EXCLUDED.description,
    prevalence = EXCLUDED.prevalence,
    world_distribution = EXCLUDED.world_distribution;

INSERT INTO clans (surname, description, prevalence, world_distribution)
VALUES (
    'Gegić',
    '[IZVOR: POREKLO.RS - BALJCI]
ГЕГИЋ – Лазаревдан
- око 1730. рођен Јован Гегић; 1948. године пописана су 32 Гегића у Баљцима.

[OPĆENITO O PREZIMENU]
In Croatia, Gegić families are generally Croats (from Kosovo ), very rarely Serbs, and barely Albanians (from Zagreb ). In the past century, relatively most of Croatian residents bearing this family name were born in Kosovo and in Janjevo, Kosovo.',
    'About 450 people with faimily name Gegić live in Croatia today, in 120 households. There were 70 of them in the middle of the past century, and their number multiplied.They are located in the most of Croatian counties, in 18 cities and 38 other places, mostly in Zagreb (80), Veliki Bastaji in Daruvar area (55), Vocin in Slatina area (50), Prgomelje (40), and in Botinac in Bjelovar area (35).',
    'Family name Gegić (including: Gegic , Gegich and Gegick ) is present in 19 countries on four continents. The family name "Gegic " is used by some 300 people in Turkey , about 50 in the United States , and small number of people in Germany. "Gegich " is used by small number of people in the United States. "Gegick " is used by some 70 people in the United States.'
)
ON CONFLICT (surname) DO UPDATE SET
    description = EXCLUDED.description,
    prevalence = EXCLUDED.prevalence,
    world_distribution = EXCLUDED.world_distribution;

INSERT INTO clans (surname, description, prevalence, world_distribution)
VALUES (
    'Grcić',
    '[OPĆENITO O PREZIMENU]
Grcić families are Croats and they are mostly from Drnis. In the past century, relatively most of Croatian residents bearing this family name were born in Drnis and in Middle Bosnia (Sarajevo area).',
    'About 170 people with faimily name Grcić live in Croatia today, in 60 households. There were 80 of them in the middle of the past century, and their number doubled.They are located in 9 Croatian counties, in 14 cities and 9 other places, mostly in Badanj (85), Zagreb (20), Split (10), Knin (10), and in Drnis (10).',
    'At least one family with this surname emigrated from Croatia to the United States.Family name Grcić (including: Grcic , Grzic , Grcich , Grzych , Gerchick , Gercich , Gercic , Gercas and Gerzic ) is present in 23 countries worldwide. The family name "Grcic " is used by some 200 people in the United States , small number in Germany , and small number of people in Australia. "Grcich " is used by some 100 people in Afghanistan and small number in the United States. "Grzic " is used by some 60 people in Australia and small number in the United States.'
)
ON CONFLICT (surname) DO UPDATE SET
    description = EXCLUDED.description,
    prevalence = EXCLUDED.prevalence,
    world_distribution = EXCLUDED.world_distribution;

INSERT INTO clans (surname, description, prevalence, world_distribution)
VALUES (
    'Ivić',
    '[OPĆENITO O PREZIMENU]
Ivić families are Croats and they are mostly from Drnis. In the past century, relatively most of Croatian residents bearing this family name were born in Drnis and Zagreb. In Drinovci in Drnis every fourth inhabitant had the family name Ivić.',
    'About 2700 people with faimily name Ivić live in Croatia today, in 1100 households. There were 1600 of them in the middle of the past century, and their number increased by 70 percent.They are located in all Croatian counties, in 80 cities and 235 other places, mostly in Zagreb (440), Split (145), Osijek (95), Sibenik (90), and in Solin (75).',
    'At least 33 families with this surname emigrated from Croatia to: Germany (14), Austria (5), Australia (5), Switzerland (2), Canada (2), France (2), the United States (1), Argentina (1), and to the United Kingdom (1).Family name Ivić (including: Ivic , Ivich , Ivichev , Ivichuk , Hivick , Ievich , Ivicz , Iwick and Iwic ) is present in 45 countries worldwide. "Ivich " is used by some 400 people in Mexico , small number in the United States , and small number of people in Russian Federation. "Iwic " is used by few people in the United States. "Iwick " is used by few people in the United States.'
)
ON CONFLICT (surname) DO UPDATE SET
    description = EXCLUDED.description,
    prevalence = EXCLUDED.prevalence,
    world_distribution = EXCLUDED.world_distribution;

INSERT INTO clans (surname, description, prevalence, world_distribution)
VALUES (
    'Janković',
    '[OPĆENITO O PREZIMENU]
Janković families are mainly Croats and they are mostly from Slavonski Brod area. According to some sources they are from Bisko near Trilj or from Bosnia, rarely Serbs, and Roms (Bjelovar). In the past century, relatively most of Croatian residents bearing this family name were born in Zagreb and Slavonski Brod. In places Oriovčić and Jakačina Mala in Slavonski Brod area every third inhabitant had the family name Janković.',
    'About 4100 people with faimily name Janković live in Croatia today, in 1900 households. There were 4000 of them in the middle of the past century, and their number remains constant.They are located in all Croatian counties, in 94 cities and 415 other places, mostly in Zagreb (640), Rijeka (175), Osijek (155), Slavonski Brod (135), and in Split (125).',
    'At least 85 families with this surname emigrated from Croatia to: Germany (30), the United States (15), Austria (9), Australia (9), Canada (5), France (5), Switzerland (3), the United Kingdom (3), Spain (2), South Africa (1), Chile (1), New Zealand (1), and to Sweden (1).Family name Janković (including: Jankovic , Yankovich , Jankovich , Jankowicz , Yankovic , Jankowitsch , Yankowich , Jankoviech , Iankovich and Iankovic ) is present in 77 countries worldwide. The family name "Jankovic " is used by some 1000 people in the United States , about 900 in Germany , and some 800 people in Slovakia. "Jankovich " is used by some 600 people in the United States , about 200 in Hungary , and some 200 people in South Africa. "Yankovich " is used by some 1000 people in Belarus , about 900 in Russian Federation , and some 800 people in the United States.'
)
ON CONFLICT (surname) DO UPDATE SET
    description = EXCLUDED.description,
    prevalence = EXCLUDED.prevalence,
    world_distribution = EXCLUDED.world_distribution;

INSERT INTO clans (surname, description, prevalence, world_distribution)
VALUES (
    'Jošić',
    '[OPĆENITO O PREZIMENU]
Jošić families can be both Serbs and Croats (from Slavonski Brod ). In the past century, relatively most of Croatian residents bearing this family name were born in Slavonski Brod and Vukovar.',
    'About 100 people with faimily name Jošić live in Croatia today, in 50 households. There were 80 of them in the middle of the past century, and their number increased by 30 percent.They are located in the most of Croatian counties, in 17 cities and 8 other places, mostly in Zagreb (20), Zadar (15), Vukovar (10), Rijeka (10), and in Osijek (',
    'Family name Jošić (including: Josic , Jossic , Josich , Jossick , Yosich , Joshick , Iosic , Joshic , Josick and Jositsch ) is present in 28 countries worldwide. The family name "Josic " is used by some 200 people in Germany , about 60 in Austria , and some 60 people in the United States. "Josich " is used by small number of people in the United States. "Yosich " is used by small number of people in the United States.'
)
ON CONFLICT (surname) DO UPDATE SET
    description = EXCLUDED.description,
    prevalence = EXCLUDED.prevalence,
    world_distribution = EXCLUDED.world_distribution;

INSERT INTO clans (surname, description, prevalence, world_distribution)
VALUES (
    'Klisurić',
    '[IZVOR: POREKLO.RS - BALJCI]
КЛИСУРИЋ – Лазаревдан
- 1711. Тодор Клисурић; 1756. Божо и Миајло Кисурић; 1948. године пописано је 56 Клисурића у Баљцима.

[OPĆENITO O PREZIMENU]
Klisurić families are mainly Croats and they are mostly from Pleternica area , often Serbs. In the past century, relatively most of Croatian residents bearing this family name were born in Samobor and Vinkovci. In Kravljak in Samobor every second inhabitant had the family name Klisurić.',
    'About 130 people with faimily name Klisurić live in Croatia today, in 60 households. There were 210 of them in the middle of the past century, and their number decreased by 40 percent.They are located in the most of Croatian counties, in 16 cities and 21 other places, mostly in Zagreb (15), Jarmina in Vinkovci area (15), Vinkovci (10), Ilok (10), and in Brodski Stupnik in Pleternica area (',
    'Family name Klisurić (including: Klisuric , Klisurich ) is present in 8 countries on three continents. The family name "Klisuric " is used by some 60 people in the United States and small number in Canada. "Klisurich " is used by small number of people in the United States.'
)
ON CONFLICT (surname) DO UPDATE SET
    description = EXCLUDED.description,
    prevalence = EXCLUDED.prevalence,
    world_distribution = EXCLUDED.world_distribution;

INSERT INTO clans (surname, description, prevalence, world_distribution)
VALUES (
    'Milanković',
    '[IZVOR: POREKLO.RS - BALJCI]
МИЛАНКОВИЋ – Лазаревдан
- 1684. Лазо Миланковић међу православцима са турске територије (дрнишког подручја) склоњеним у Шибеник; 1711. Јован Миланковић. пок. Новака у Баљцима; 1756. Лазо Миланковић; 1948. године пописан је 131 Миланковић у Баљцима.
ЈАНКОВИЋ – Лазаревдан
- 1711. Јанко Кнежевић (вјероватно предак); око 1750. рођен Ристе, а око 1760. Тома Јанковић; 1948. године пописано је 55 Јанковића у Баљцима.
ЈОШИЋ – Лазаревдан
- 1711. Јован Јошић; 1756. Лука и Никола Јошић; 1948. године пописано је 28 Јошића у Баљцима.

[OPĆENITO O PREZIMENU]
Milanković families are mainly Serbs and they are mostly from Drnis area , whereas often Croats (from Novigrad a). In the past century, relatively most of Croatian residents bearing this family name were born in Zagreb and in Drnis area. In Baljci in Drnis area every fifth inhabitant had the family name Milanković.',
    'About 330 people with faimily name Milanković live in Croatia today, in 170 households. There were 560 of them in the middle of the past century, and their number decreased by 40 percent.They are located in almost all Croatian counties, in 34 cities and 40 other places, mostly in Zagreb (70), Vukovar (20), Osijek (15), Slavonski Brod (15), and in Bobota in Vukovar area (10).',
    'At least ten families with this surname emigrated from Croatia to: the United States (4), Australia (3), and to Germany (3).Family name Milanković (including: Milankovic , Milankovich and Milancovici ) is present in 21 countries worldwide. The family name "Milankovic " is used by some 90 people in Germany , small number in Egypt , and small number of people in the United States.'
)
ON CONFLICT (surname) DO UPDATE SET
    description = EXCLUDED.description,
    prevalence = EXCLUDED.prevalence,
    world_distribution = EXCLUDED.world_distribution;

INSERT INTO clans (surname, description, prevalence, world_distribution)
VALUES (
    'Milorad',
    '[OPĆENITO O PREZIMENU]
In Croatia, Milorad families are mainly Croats (from Vukovar ), less frequently Serbs. In the past century, relatively most of Croatian residents bearing this family name were born in Vukovar and in Western Bosnia (Livno area).',
    'About 10 people with faimily name Milorad live in Croatia today, in three households only. There were 30 of them in the middle of the past century, and their number decreased significantly.They are located in only five naselja i to in Vukovar (Beli Manastir (Podaca in Ploce area (Zapresic (Nasice (',
    'Family name Milorad is present in 10 countries on four continents. The family name "Milorad " is used by some 60 people in Russian Federation , small number in Romania , and small number of people in the United States.'
)
ON CONFLICT (surname) DO UPDATE SET
    description = EXCLUDED.description,
    prevalence = EXCLUDED.prevalence,
    world_distribution = EXCLUDED.world_distribution;

INSERT INTO clans (surname, description, prevalence, world_distribution)
VALUES (
    'Obradović',
    '[IZVOR: POREKLO.RS - BALJCI]
ОБРАДОВИЋ (огранак Бешевића) – Никољдан
- 1711. Јован Бешевић пок. Обрада; 1756. Иван/Јован Бешевић-Обрадовић; 1948. године пописано је 16 Обрадовића у Баљцима.

[OPĆENITO O PREZIMENU]
Obradović families are mainly Croats and they are mostly from Neum (Herzegovina), often Serbs, very rarely Montenegrins (from Serbia ). In the past century, relatively most of Croatian residents bearing this family name were born in Zagreb and Dubrovnik. In Crnoglav in Neum (Herzegovina) nearly every inhabitant had the family name Obradović.',
    'About 1700 people with faimily name Obradović live in Croatia today, in 810 households. There were 1900 of them in the middle of the past century, and their number decreased by 10 percent.They are located in all Croatian counties, in 77 cities and 154 other places, mostly in Zagreb (320), Metkovic (155), Dubrovnik (115), Vukovar (55), and in Pozega (45).',
    'At least 39 families with this surname emigrated from Croatia to: Germany (11), Switzerland (6), the United States (5), the United Kingdom (5), Australia (4), Austria (3), the Netherlands (2), Canada (2), and to Sweden (1).Family name Obradović (including: Obradovich , Obradovic ) is present in 51 countries worldwide. The family name "Obradovic " is used by some 500 people in Germany , about 400 in the United States , and some 100 people in Great Britain. "Obradovich " is used by some 600 people in the United States , about 200 in Peru , and some 100 people in Russian Federation.'
)
ON CONFLICT (surname) DO UPDATE SET
    description = EXCLUDED.description,
    prevalence = EXCLUDED.prevalence,
    world_distribution = EXCLUDED.world_distribution;

INSERT INTO clans (surname, description, prevalence, world_distribution)
VALUES (
    'Radomilović',
    '[OPĆENITO O PREZIMENU]
In Croatia, Radomilović families are mainly Croats (from Novi Vinodolski ), less frequently Serbs. In the past century, relatively most of Croatian residents bearing this family name were born in Slunj area and in Drnis area. In Bogovolja in Slunj area every twentieth inhabitant had the family name Radomilović.',
    'About 30 people with faimily name Radomilović live in Croatia today, in 12 households. There were 30 of them in the middle of the past century, and their number remains constant.They are located in 6 Croatian counties, in 6 cities and two other places, mostly in Kastel Gomilica (Novi Vinodolski (Zagreb (Andrilovec (Solin (',
    'Family name Radomilović (including: Radomilovic , Radomilovich ) is present in five countries on two continents. "Radomilovich " is used by few people in the United States.'
)
ON CONFLICT (surname) DO UPDATE SET
    description = EXCLUDED.description,
    prevalence = EXCLUDED.prevalence,
    world_distribution = EXCLUDED.world_distribution;

INSERT INTO clans (surname, description, prevalence, world_distribution)
VALUES (
    'Romac',
    '[IZVOR: POREKLO.RS - BALJCI]
РОМАЦ (раније Богдановић) – Ђурђевдан
- 1711. Јован, Лука и Илија Богдановић; 1756. Јован Богдановић-Ромац; 1948. године пописана су 4 Ромца у Баљцима.
МАКСИЋ
- 1730-их рођен Марко Максић; ишчезли из села у 20. вијеку.
БАИЋ
- 1740-их Јован Баић; ишчезли из села у 20. вијеку.
БОРОЈЕВИЋ (огранак Бешевића из 18. и 19. вијека) – Никољдан
- 1711. Бороје Бешевић; 1756. Петар Бешевић-Боројевић.
ПУЂАШ (у 18. и 19. вијеку)
- 1756. Марко Пуђаш; иселили у Мирковце код Винковаца.
СИНЧЕВИЋ (постојали у 18. и 19. вијеку)
- око 1750. рођен Сава Синчевић.
КНЕЗ (постојали у 18. и 19. вијеку)
- око 1740. рођен Јаков Кнез; иселили у Славонију/Срем средином 19. вијека.
ГУГИЋ
- 1756. Иван Гугић (вјероватно доселили као ковачи/Цингано, пошто то пише за Гугића који је био у Шибенику/Варошу); 1948. године пописано је 14 Гугића у Баљцима.
ВИДОВИЋ
- дошли из сусједног села Градац крајем 19.  вијека; 1948. године пописано је 14 Видовића у Баљцима.
ЈАЈЧАНИН (у 18. и 19. вијеку)
- 1756. Мартин и Петар Јајчанин; 1835. Лука Јајчанин (у матичним књигама записивани као ковачи/Цингано).

[OPĆENITO O PREZIMENU]
Romac families are Croats and they are mostly from Sinj. In the past century, relatively most of Croatian residents bearing this family name were born in Sinj and Zagreb.',
    'About 450 people with faimily name Romac live in Croatia today, in 160 households. There were 290 of them in the middle of the past century, and their number increased by 50 percent.They are located in the most of Croatian counties, in 15 cities and 14 other places, mostly in Glavice (210), Sinj (115), Zagreb (70), Split (40), and in Semeljci in Djakovo area (10).',
    'At least two families with this surname emigrated from Croatia to the United States.Family name Romac (including: Romach , Romatz , Romaz and Romacz ) is present in 27 countries worldwide. The family name "Romac " is used by some 200 people in France , about 100 in the United States , and small number of people in Brazil. "Romatz " is used by some 100 people in the United States , small number in Thailand , and small number of people in Ecuador. "Romach " is used by some 200 people in Morocco , about 100 in Israel , and some 50 people in the United States.'
)
ON CONFLICT (surname) DO UPDATE SET
    description = EXCLUDED.description,
    prevalence = EXCLUDED.prevalence,
    world_distribution = EXCLUDED.world_distribution;

INSERT INTO clans (surname, description, prevalence, world_distribution)
VALUES (
    'Tarle',
    '[OPĆENITO O PREZIMENU]
Tarle families are Croats and they are mostly from Drnis. In the past century, relatively most of Croatian residents bearing this family name were born in Drnis and Zagreb. In Velušić in Drnis every fourth inhabitant had the family name Tarle.',
    'About 240 people with faimily name Tarle live in Croatia today, in 100 households. There were 80 of them in the middle of the past century, and their number tripled.They are located in 9 Croatian counties, in 19 cities and 9 other places, mostly in Zagreb (60), Jezevic (20), Velusic (15), Vodice (15), and in Drnis (15).',
    'Family name Tarle (including: Thearle , Tharle , Tarlé and Tarleh ) is present in 29 countries worldwide. "Tharle " is used by some 50 people in Australia , small number in the United States , and small number of people in Canada. "Thearle " is used by some 100 people in the United States , about 100 in Australia , and some 60 people in Great Britain.'
)
ON CONFLICT (surname) DO UPDATE SET
    description = EXCLUDED.description,
    prevalence = EXCLUDED.prevalence,
    world_distribution = EXCLUDED.world_distribution;

INSERT INTO clans (surname, description, prevalence, world_distribution)
VALUES (
    'Tetek',
    '[IZVOR: POREKLO.RS - BALJCI]
ТЕТЕК (вјероватно огранак Бибића) – Никољдан
- 1766. Лазо Тетек; 1948. године пописано је 5 Тетека у Баљцима.

[OPĆENITO O PREZIMENU]
In Croatia, Štakorec families are Croats (from Ozalj ). In the past century, relatively most of Croatian residents bearing this family name were born in Ozalj.',
    'Only a few people with faimily name Štakorec live in Croatia today, in one household only.They are located in only one small Croatian place, in Trg (',
    'Family name Štakorec is present in this form only in Croatia.'
)
ON CONFLICT (surname) DO UPDATE SET
    description = EXCLUDED.description,
    prevalence = EXCLUDED.prevalence,
    world_distribution = EXCLUDED.world_distribution;

INSERT INTO clans (surname, description, prevalence, world_distribution)
VALUES (
    'Tica',
    '[OPĆENITO O PREZIMENU]
Tica families are often Croats and they are mostly from Herzegovina , rarely Serbs. In the past century, relatively most of Croatian residents bearing this family name were born in Herzegovina (Grude area) and in Zagreb.',
    'About 180 people with faimily name Tica live in Croatia today, in 70 households. There were 70 of them in the middle of the past century, and their number more than doubled.They are located in the most of Croatian counties, in 16 cities and 20 other places, mostly in Zagreb (80), Vukovar (25), Rijeka (10), Osijek (10), and in Split (',
    'At least two families with this surname emigrated from Croatia to Germany (1) and the United States (1).Family name Tica (including: Tichá , Tiza , Ticca , Ttica , Tiezza , Ticha , Tizza , Titza and Tieza ) is present in 61 countries worldwide. "Titza " is used by few people in the United States. "Tieza " is used by few people in the United States. "Ticha " is used by some 600 people in Czech Republic , about 60 in Germany , and small number of people in the United States.'
)
ON CONFLICT (surname) DO UPDATE SET
    description = EXCLUDED.description,
    prevalence = EXCLUDED.prevalence,
    world_distribution = EXCLUDED.world_distribution;

INSERT INTO clans (surname, description, prevalence, world_distribution)
VALUES (
    'Vidović',
    '[OPĆENITO O PREZIMENU]
Vidović families are usually Croats and they are mostly from Trogir area. According to some sources they are from east Herzegovina (Popovo polje), very rarely Serbs. In the past century, relatively most of Croatian residents bearing this family name were born in Zagreb and in Western Bosnia (Livno area). In Sevid in Trogir area nearly every inhabitant had the family name Vidović.',
    'About 6600 people with faimily name Vidović live in Croatia today, in 2800 households. There were 4000 of them in the middle of the past century, and their number increased by 60 percent.They are located in all Croatian counties, in 110 cities and 605 other places, mostly in Zagreb (885), Split (555), Rijeka (205), Sesvete (150), and in Slavonski Brod (130).',
    'At least 127 families with this surname emigrated from Croatia to: Germany (52), Australia (22), the United States (15), Austria (12), Switzerland (8), Canada (6), Sweden (6), South Africa (2), Finland (1), the Netherlands (1), Japan (1), and to France (1).Family name Vidović (including: Vidovic , Vidovich , Vidovics and Widovic ) is present in 51 countries worldwide. The family name "Vidovic " is used by some 3000 people in Germany , about 900 in the United States , and some 700 people in Bolivia. "Vidovich " is used by some 500 people in the United States , about 100 in Australia , and small number of people in Uruguay. "Vidovics " is used by some 200 people in Hungary , small number in Italy , and small number of people in the United States.'
)
ON CONFLICT (surname) DO UPDATE SET
    description = EXCLUDED.description,
    prevalence = EXCLUDED.prevalence,
    world_distribution = EXCLUDED.world_distribution;

INSERT INTO clans (surname, description, prevalence, world_distribution)
VALUES (
    'Vranković',
    '[OPĆENITO O PREZIMENU]
Vranković families are frequently Croats and they are mostly from the Island of Hvar. According to some sources they are from Blato on Cetina River, rarely Serbs, and Slovaks (Iloka). In the past century, relatively most of Croatian residents bearing this family name were born in Split and Rijeka. In Svirče on the Island of Hvar every eighth inhabitant had the family name Vranković.',
    'About 410 people with faimily name Vranković live in Croatia today, in 200 households. There were 520 of them in the middle of the past century, and their number decreased by 20 percent.They are located in the most of Croatian counties, in 31 cities and 34 other places, mostly in Rijeka (60), Split (55), Zagreb (45), Svirce on the Island of Hvar (35), and in Rtina in Nin area (25).',
    'At least 17 families with this surname emigrated from Croatia to: Australia (6), the United States (5), Germany (2), Sweden (2), France (1), and to Austria (1).Family name Vranković (including: Vrankovic , Vrankovich and Vrancovich ) is present in 14 countries worldwide. The family name "Vrankovic " is used by some 200 people in the United States , about 100 in Australia , and small number of people in Canada. "Vrankovich " is used by some 70 people in the United States and small number in Australia.'
)
ON CONFLICT (surname) DO UPDATE SET
    description = EXCLUDED.description,
    prevalence = EXCLUDED.prevalence,
    world_distribution = EXCLUDED.world_distribution;

INSERT INTO clans (surname, description, prevalence, world_distribution)
VALUES (
    'Tarlac',
    '[IZVOR: POREKLO.RS - BALJCI]
ТАРЛАЋ (огранак Бешевића) – Никољдан
- 1756. Иван/Јован Бешевић-Тарлаћ; 1948. године пописано је 13 Тарлаћа у Баљцима.

',
    'Traži se podatak...',
    'Traži se podatak...'
)
ON CONFLICT (surname) DO UPDATE SET
    description = EXCLUDED.description,
    prevalence = EXCLUDED.prevalence,
    world_distribution = EXCLUDED.world_distribution;

INSERT INTO clans (surname, description, prevalence, world_distribution)
VALUES (
    'Arambasic',
    '[IZVOR: POREKLO.RS - BALJCI]
АРАМБАШИЋ (огранак Бешевића) – Никољдан
- 1756. арамбаша Стојан Бешевић (вјероватно предак); у 19. вијеку Тодор Арамбашић; 1948. године пописано је 13 Арамбашића у Баљцима.
БАШИЋ (вјероватно огранак Бешевића)- Никољдан
- око 1720. рођен Андрија Башић; 1948. године пописана су 73 Башића у Баљцима.
ЏАЛЕТА (вјероватно огранак Бешевића или Бибића) – Никољдан
- 1757.  Симо Џалета добио кћер, а око 1740. рођен Петар Џалета; 1948. године пописан је 21 Џалета у Баљцима.

',
    'Traži se podatak...',
    'Traži se podatak...'
)
ON CONFLICT (surname) DO UPDATE SET
    description = EXCLUDED.description,
    prevalence = EXCLUDED.prevalence,
    world_distribution = EXCLUDED.world_distribution;

INSERT INTO clans (surname, description, prevalence, world_distribution)
VALUES (
    'Gligoric',
    '[IZVOR: POREKLO.RS - BALJCI]
ГЛИГОРИЋ – Ђурђевдан
- око 1750. Јован Глигорић, а рођени Алекса и Крстан Глигорић; 1948. године пописана су 3 Глигорића у Баљцима.

',
    'Traži se podatak...',
    'Traži se podatak...'
)
ON CONFLICT (surname) DO UPDATE SET
    description = EXCLUDED.description,
    prevalence = EXCLUDED.prevalence,
    world_distribution = EXCLUDED.world_distribution;

INSERT INTO clans (surname, description, prevalence, world_distribution)
VALUES (
    'Gutic',
    '[IZVOR: POREKLO.RS - BALJCI]
ГУТИЋ – Ђурђевдан
- око 1750. рођен Јован Гутић; 1948. године пописано је 7 Гутића у Баљцима.

',
    'Traži se podatak...',
    'Traži se podatak...'
)
ON CONFLICT (surname) DO UPDATE SET
    description = EXCLUDED.description,
    prevalence = EXCLUDED.prevalence,
    world_distribution = EXCLUDED.world_distribution;

INSERT INTO clans (surname, description, prevalence, world_distribution)
VALUES (
    'Tosic',
    '[IZVOR: POREKLO.RS - BALJCI]
ТОШИЋ – Ђурђевдан
- око 1760. рођен Стојан Тошић; 1948. године пописано је 8 Тошића у Баљцима.
БОГДАНОВИЋ (у 16. 17. и 18. вијеку)
- 1601. браћа Вушко и Радивој Богдановић; од Богдановића су настали Мудрићи, Ромци и вјероватно још нека презимена.
МУДРИЋ (раније Богдановић)
- 1709. Илија Богдановић из Баљака имао посјед у Житнићу, а презиме се наводи и као Богдановић-Мудре; крајем 18. вијека Марко Мудрић; 1948. године пописан је 1 Мудрић у Баљцима.

',
    'Traži se podatak...',
    'Traži se podatak...'
)
ON CONFLICT (surname) DO UPDATE SET
    description = EXCLUDED.description,
    prevalence = EXCLUDED.prevalence,
    world_distribution = EXCLUDED.world_distribution;
