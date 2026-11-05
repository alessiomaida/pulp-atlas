/* Pulp Atlas — editorial expansion.
   The base dataset remains in data.js. Sources are attached to EACH edge.
   Credits/soundtrack use release credits; influences require named evidence.
   Entities whose historical identity is uncertain are not silently conflated. */
(() => {
  const A=window.ATLAS;
  const S={
    cast:"https://bfidatadigipres.github.io/re-releases/2024/08/23/pulp-fiction/",
    credits:"https://www.rottentomatoes.com/m/pulp_fiction/cast-and-crew",
    soundtrack:"https://www.imdb.com/title/tt0110912/soundtrack/",
    album:"https://en.wikipedia.org/wiki/Pulp_Fiction_(soundtrack)",
    filmreferences:"https://wiki.tarantino.info/index.php/Pulp_Fiction_Movie_References_Guide",
    movie:"https://en.wikipedia.org/wiki/Pulp_Fiction",
    slate:"https://www.slate.com/blogs/browbeat/2015/09/01/quentin_tarantino_influences_and_references_every_inspiration_for_pulp_fiction.html",
    bodyguard:"https://en.wikipedia.org/wiki/Pulp_Fiction#Homage_as_essence"
  };
  const items=[
    // Actors, supporting players and creators
    ["timroth","Tim Roth","person","1961","Attore · Pumpkin","Interpreta Pumpkin, il rapinatore che apre e chiude la cornice del film.","Tim_Roth"],
    ["amanda","Amanda Plummer","person","1957","Attrice · Honey Bunny","Interpreta Honey Bunny nella scena della rapina al diner.","Amanda_Plummer"],
    ["ving","Ving Rhames","person","1959","Attore · Marsellus Wallace","Interpreta il boss Marsellus Wallace.","Ving_Rhames"],
    ["harvey","Harvey Keitel","person","1939","Attore · Winston Wolf","Interpreta il risolutore di problemi Winston Wolf.","Harvey_Keitel"],
    ["walken","Christopher Walken","person","1943","Attore · Captain Koons","Compare nel racconto dell'orologio d'oro.","Christopher_Walken"],
    ["stoltz","Eric Stoltz","person","1961","Attore · Lance","Interpreta lo spacciatore Lance.","Eric_Stoltz"],
    ["rosanna","Rosanna Arquette","person","1959","Attrice · Jody","Interpreta Jody, moglie di Lance.","Rosanna_Arquette"],
    ["buscemi","Steve Buscemi","person","1957","Attore · cameo","Interpreta il cameriere ispirato a Buddy Holly al Jack Rabbit Slim's.","Steve_Buscemi"],
    ["maria","Maria de Medeiros","person","1965","Attrice · Fabienne","Interpreta Fabienne, compagna di Butch.","Maria_de_Medeiros"],
    ["angela","Angela Jones","person","1968","Attrice · Esmarelda","Interpreta la tassista Esmarelda Villalobos.","Angela_Jones_(actress)"],
    ["frank","Frank Whaley","person","1963","Attore · Brett","Interpreta Brett nella scena dell'appartamento.","Frank_Whaley"],
    ["phil","Phil LaMarr","person","1967","Attore · Marvin","Interpreta Marvin, coinvolto nell'incidente automobilistico.","Phil_LaMarr"],
    ["peter","Peter Greene","person","1965","Attore · Zed","Interpreta Zed.","Peter_Greene"],
    ["duane","Duane Whitaker","person","1959","Attore · Maynard","Interpreta Maynard.","Duane_Whitaker"],
    ["lender","Lawrence Bender","person","1957","Produttore","Produttore del film.","Lawrence_Bender"],
    ["menke","Sally Menke","person","1953–2010","Montatrice","La montatrice che collaborò a lungo con Tarantino.","Sally_Menke"],
    ["sekula","Andrzej Sekuła","person","1954","Direttore della fotografia","Firma la fotografia di Pulp Fiction.","Andrzej_Sekuła"],
    ["wasco","David Wasco","person","","Production designer","Responsabile della scenografia del film.","David_Wasco"],
    ["heimann","Betsy Heimann","person","","Costume designer","Firma il costume design del film.","Betsy_Heimann"],
    ["devito","Danny DeVito","person","1944","Produttore esecutivo","Accreditato come executive producer.","Danny_DeVito"],
    // Film music and artists documented in the soundtrack / screen credits
    ["algreen","Al Green","person","1946","Cantante soul","Interprete di Let's Stay Together.","Al_Green"],
    ["letsstay","Let's Stay Together","music","1971","Al Green · soul","Il brano soul utilizzato nella colonna sonora.","Let's_Stay_Together_(song)"],
    ["tornadoes","The Tornadoes","person","1960s","Gruppo · surf rock","Gruppo che incide Bustin' Surfboards.","The_Tornadoes_(American_band)"],
    ["bustin","Bustin' Surfboards","music","1962","The Tornadoes · surf","Brano strumentale surf utilizzato nel film.","Bustin%27_Surfboards"],
    ["ricky","Ricky Nelson","person","1940–1985","Cantante e attore","Interprete di Lonesome Town.","Ricky_Nelson"],
    ["lonesome","Lonesome Town","music","1958","Ricky Nelson · pop","Brano di Ricky Nelson presente nel film.","Lonesome_Town"],
    ["centurians","The Centurions","person","1960s","Gruppo · surf rock","Band surf che esegue Bullwinkle Part II.","The_Centurions"],
    ["bullwinkle","Bullwinkle Part II","music","1963","The Centurions · surf","Brano dei Centurions accostato al dialogo Zed's Dead nell'album.","Pulp_Fiction_(soundtrack)"],
    ["mckee","Maria McKee","person","1964","Cantautrice","Interprete e autrice del brano If Love Is a Red Dress.","Maria_McKee"],
    ["reddress","If Love Is a Red Dress","music","1994","Maria McKee","Il brano incluso nel disco della colonna sonora.","Pulp_Fiction_(soundtrack)"],
    ["revels","The Revels","person","1960s","Gruppo · surf rock","Band che esegue Comanche.","The_Revels"],
    ["comanche","Comanche","music","1961","The Revels · rock strumentale","Brano usato nella sequenza con il negozio di Maynard.","Pulp_Fiction_(soundtrack)"],
    ["statlers","The Statler Brothers","person","1955","Gruppo country","Interpreti di Flowers on the Wall.","The_Statler_Brothers"],
    ["flowers","Flowers on the Wall","music","1965","The Statler Brothers","Brano country usato nella sequenza di Butch.","Flowers_on_the_Wall"],
    ["linkwray","Link Wray","person","1929–2005","Chitarrista · rock strumentale","Artista fondamentale per la chitarra rock; due brani figurano nel film.","Link_Wray"],
    ["rumble","Rumble","music","1958","Link Wray · rock strumentale","Brano chitarristico presente nel film.","Rumble_(instrumental)"],
    ["ace","Ace of Spades","music","1965","Link Wray · rock strumentale","Brano di Link Wray presente nel film.","Ace_of_Spades_(Link_Wray_song)"],
    ["marketts","The Marketts","person","1960s","Gruppo · surf rock","Gruppo che esegue Out of Limits.","The_Marketts"],
    ["outlimits","Out of Limits","music","1963","The Marketts · surf","Brano strumentale presente nei credits musicali.","Out_of_Limits_(The_Marketts_song)"],
    ["brothers","The Brothers Johnson","person","1975","Duo · funk/soul","Il duo che interpreta Strawberry Letter 23.","The_Brothers_Johnson"],
    ["strawberry","Strawberry Letter 23","music","1977","The Brothers Johnson · funk","Brano presente nel film ma non nell'edizione base dell'album del 1994.","Strawberry_Letter_23"],
    ["robins","The Robins","person","1945","Gruppo vocale · R&B","Gruppo di rhythm & blues presente nel repertorio musicale del film.","The_Robins"],
    ["since","Since I First Met You","music","1957","The Robins · R&B","Brano usato nel film, attestato dai credits della colonna sonora.","Pulp_Fiction_(soundtrack)"],
    // Verifiable pop references and connected works
    ["ezekiel","Ezechiele 25:17","idea","","Citazione biblica rielaborata","Il celebre discorso di Jules non coincide con il testo del versetto biblico: integra una citazione cinematografica.","Ezekiel_25"],
    ["bodyguard","Karate Kiba / The Bodyguard","film","1973","Film · Sonny Chiba","Film giapponese il cui testo d'apertura fu ripreso e rielaborato per il discorso di Jules; negli USA ebbe diffusione successiva.","Bodyguard_Kiba"],
    ["sonnychiba","Sonny Chiba","person","1939–2021","Attore · cinema d'azione","Star del cinema giapponese e riferimento per il discorso di Jules.","Sonny_Chiba"],
    ["kissmedeadly","Kiss Me Deadly","film","1955","Robert Aldrich · noir","Film noir con una scatola misteriosa e luminosa, spesso accostata alla valigetta di Pulp Fiction: influenza non definitivamente stabilita.","Kiss_Me_Deadly"],
    ["psycho","Psycho","film","1960","Alfred Hitchcock · thriller","La scena in automobile con Butch e Marsellus viene spesso letta in relazione a un'inquadratura di Psycho.","Psycho_(1960_film)"],
    ["hitchcock","Alfred Hitchcock","person","1899–1980","Regista","Regista di Psycho e riferimento fondamentale del thriller classico.","Alfred_Hitchcock"],
    ["warriors","The Warriors","film","1979","Walter Hill · action","Un possibile parallelismo visivo riguarda i primi piani di bocche e microfoni.","The_Warriors_(film)"],
    ["godardvivre","Vivre sa vie","film","1962","Jean-Luc Godard","Film citato dagli studi sull'influenza di Godard sulla scrittura dei dialoghi di Mia.","Vivre_sa_vie"],
    ["eight","8½","film","1963","Federico Fellini","Il movimento di ballo è indicato in alcuni repertori come analogia alla danza di Vincent e Mia.","8½"],
    ["fellini","Federico Fellini","person","1920–1993","Regista","Regista di 8½, caposaldo del cinema italiano.","Federico_Fellini"],
    ["blacksabbath","Black Sabbath / I tre volti della paura","film","1963","Mario Bava · horror antologico","Film a episodi spesso menzionato tra le matrici della costruzione narrativa di Tarantino.","Black_Sabbath_(film)"],
    ["bava","Mario Bava","person","1914–1980","Regista","Regista italiano e autore di Black Sabbath.","Mario_Bava"],
    ["thekillers","The Killers","film","1946","Robert Siodmak · noir","Il noir citato nella critica tra i confronti possibili per la sequenza con Brett.","The_Killers_(1946_film)"],
    ["greenacres","Green Acres","tv","1965","Serie televisiva · sitcom","Jules cita Arnold, il maiale della sitcom, durante il dialogo sul consumo della carne.","Green_Acres"],
    ["arnold","Arnold Ziffel","idea","1965","Personaggio televisivo","Il maiale domestico della famiglia Ziffel in Green Acres.","Arnold_Ziffel"],
    ["foxfive","Fox Force Five","idea","1994","Pilot fittizio citato nel film","La serie pilota raccontata da Mia nel dialogo con Vincent; è una finzione interna a Pulp Fiction.","Pulp_Fiction"],
    ["buddyholly","Buddy Holly","person","1936–1959","Musicista · rock & roll","Icona rock interpretata da un cameriere in costume al Jack Rabbit Slim's.","Buddy_Holly"],
    ["marilyn","Marilyn Monroe","person","1926–1962","Attrice · icona pop","Tra le celebrità riprodotte dai camerieri del Jack Rabbit Slim's.","Marilyn_Monroe"],
    ["jamesdean","James Dean","person","1931–1955","Attore · icona pop","Tra le icone anni Cinquanta rappresentate al Jack Rabbit Slim's.","James_Dean"],
    ["deanmartin","Dean Martin","person","1917–1995","Attore e cantante","Una delle icone pop che compaiono come imitazione nel ristorante.","Dean_Martin"],
    ["jerrylewis","Jerry Lewis","person","1926–2017","Comico e regista","Figura del duo Martin & Lewis richiamata nel diner.","Jerry_Lewis"],
    ["lucky","Lucky Star","music","1983","Madonna · pop","La canzone citata da Fabienne in un dialogo con Butch.","Lucky_Star_(Madonna_song)"],
    ["diehard","Die Hard","film","1988","Film · Bruce Willis","Film d'azione tra i ruoli precedenti più noti di Bruce Willis.","Die_Hard"],
    ["deerhunter","The Deer Hunter","film","1978","Michael Cimino · dramma","Film premiato con Christopher Walken.","The_Deer_Hunter"],
    ["urban","Urban Cowboy","film","1980","Film · John Travolta","Un precedente di Travolta che torna pertinente per l'immaginario cowboy evocato da Mia.","Urban_Cowboy"],
    ["deadzone","The Dead Zone","film","1983","David Cronenberg · thriller","Il riferimento viene associato alla battuta del Wolf sulla previsione del futuro.","The_Dead_Zone_(film)"],
    ["scorsese","Martin Scorsese","person","1942","Regista","Un ulteriore ponte verso il cinema americano, tramite Raging Bull.","Martin_Scorsese"],
    ["raging","Raging Bull","film","1980","Martin Scorsese · dramma","Film citato dai repertori per un parallelismo di dialogo con Fabienne.","Raging_Bull"],
    ["apocalypse","Apocalypse Now","film","1979","Francis Ford Coppola · guerra","Tra i film citati nei repertori dei riferimenti della sequenza dell'orologio.","Apocalypse_Now"],
    ["steveco","The Ed Sullivan Show","tv","1948","Varietà televisivo","Il locale inserisce un presentatore ispirato a Ed Sullivan tra le proprie icone.","The_Ed_Sullivan_Show"]
  ];
  for(const [id,title,type,year,subtitle,description,wiki] of items){
    if(A.nodes.some(n=>n.id===id))throw Error("Duplicated node: "+id);
    A.nodes.push({id,title,type,year,subtitle,description,wiki});
  }
  let n=0;
  const connect=(source,target,kind,label,detail,url,sourceLabel,priority=5)=>{
    const known=new Set(A.nodes.map(n=>n.id));
    if(!known.has(source)||!known.has(target))throw Error("Broken edge "+source+" - "+target);
    A.links.push({id:"expand-"+(++n),source,target,kind,label,detail,sourceUrl:url,
      sourceLabel,priority});
  };
  const cast=(id,role,priority=5)=>connect("pulp",id,"credit",role,role+" · Accreditato nel cast di Pulp Fiction.",S.cast,"BFI · Scheda e credits del film",priority);
  [
    ["timroth","Pumpkin",8],["amanda","Honey Bunny",8],["ving","Marsellus Wallace",9],
    ["harvey","Winston Wolf",9],["walken","Captain Koons",7],
    ["stoltz","Lance",6],["rosanna","Jody",6],["buscemi","Buddy Holly (cameriere)",7],
    ["maria","Fabienne",6],["angela","Esmarelda Villalobos",5],["frank","Brett",5],
    ["phil","Marvin",6],["peter","Zed",5],["duane","Maynard",5]
  ].forEach(([id,role,priority])=>cast(id,role,priority));
  const crew=(id,label)=>connect("pulp",id,"credit",label,label+" per il film Pulp Fiction.",S.credits,"Rotten Tomatoes · Crew",5);
  [
    ["lender","Produzione"],["menke","Montaggio"],["sekula","Fotografia"],
    ["wasco","Scenografia"],["heimann","Costumi"],["devito","Produzione esecutiva"]
  ].forEach(([id,label])=>crew(id,label));
  // Soundtrack credits: record songs as works and link performers separately.
  const song=(id,artistId,label)=> {
    connect("pulp",id,"reference","Musica utilizzata",label+" figura tra i brani utilizzati nel film.",S.soundtrack,"IMDb · Soundtrack",7);
    connect(id,artistId,"credit","Interprete","L'esecuzione del brano è attribuita a "+A.nodes.find(n=>n.id===artistId).title+".",S.soundtrack,"IMDb · Soundtrack",7);
  };
  [
    ["letsstay","algreen","Let's Stay Together"],
    ["bustin","tornadoes","Bustin' Surfboards"],
    ["lonesome","ricky","Lonesome Town"],
    ["bullwinkle","centurians","Bullwinkle Part II"],
    ["reddress","mckee","If Love Is a Red Dress"],
    ["comanche","revels","Comanche"],
    ["flowers","statlers","Flowers on the Wall"],
    ["rumble","linkwray","Rumble"],
    ["ace","linkwray","Ace of Spades"],
    ["outlimits","marketts","Out of Limits"],
    ["strawberry","brothers","Strawberry Letter 23"],
    ["since","robins","Since I First Met You"]
  ].forEach(([a,b,label])=>song(a,b,label));
  // Meaningful routes out of the Pulp Fiction orbit.
  const credit=(a,b,label,url=S.cast)=>connect(a,b,"credit",label,
    A.nodes.find(n=>n.id===b).title+" è collegato all'opera "+A.nodes.find(n=>n.id===a).title+" attraverso "+label.toLowerCase()+".",
    url,"Scheda dell'opera e credits",6);
  credit("reservoir","timroth","Interprete","https://www.imdb.com/title/tt0105236/fullcredits/");
  credit("reservoir","harvey","Interprete","https://www.imdb.com/title/tt0105236/fullcredits/");
  credit("reservoir","buscemi","Interprete","https://www.imdb.com/title/tt0105236/fullcredits/");
  credit("pulp","buscemi","Cameo · Buddy Holly");
  credit("diehard","willis","Protagonista","https://www.imdb.com/title/tt0095016/fullcredits/");
  credit("deerhunter","walken","Interprete","https://www.imdb.com/title/tt0077416/fullcredits/");
  credit("urban","travolta","Protagonista","https://www.imdb.com/title/tt0081696/fullcredits/");
  credit("raging","scorsese","Regia","https://www.imdb.com/title/tt0081398/fullcredits/");
  credit("psycho","hitchcock","Regia","https://www.imdb.com/title/tt0054215/fullcredits/");
  credit("eight","fellini","Regia","https://www.imdb.com/title/tt0056801/fullcredits/");
  credit("blacksabbath","bava","Regia","https://www.imdb.com/title/tt0057603/fullcredits/");
  credit("godardvivre","godard","Regia","https://www.imdb.com/title/tt0056663/fullcredits/");
  credit("bodyguard","sonnychiba","Interprete",S.bodyguard);
  credit("killbill","sonnychiba","Hattori Hanzo","https://www.imdb.com/title/tt0266697/fullcredits/");
  credit("jackrabbit","buscemi","Cameriere · Buddy Holly",S.cast);
  // Primary, explicit references.
  const ref=(a,b,label,detail,url=S.filmreferences)=>connect(a,b,"reference",label,detail,url,
    url===S.filmreferences?"Tarantino Archives · Repertorio dei riferimenti":"Fonte documentale",8);
  ref("pulp","ezekiel","Monologo di Jules","Jules introduce un discorso attribuito al profeta Ezechiele; gran parte della formulazione è una rielaborazione cinematografica.",S.movie);
  ref("ezekiel","bodyguard","Origine cinematografica","La formula usata da Jules deriva da Karate Kiba / The Bodyguard di Sonny Chiba, non dalla trascrizione letterale del versetto.",S.bodyguard);
  ref("ezekiel","jackson","Interpretazione di Jules","Samuel L. Jackson recita il discorso nelle scene di Jules.",S.movie);
  ref("pulp","foxfive","Pilot fittizio menzionato","Mia Wallace descrive a Vincent il pilot televisivo immaginario Fox Force Five.",S.filmreferences);
  ref("pulp","greenacres","Citazione di sitcom","Jules richiama il maiale Arnold della serie Green Acres durante una conversazione sul cibo.",S.slate);
  ref("greenacres","arnold","Personaggio","Arnold Ziffel è il maiale ricorrente nella sitcom Green Acres.",S.filmreferences);
  ref("pulp","lucky","Dialogo di Fabienne","Fabienne richiama l'aspetto di Madonna nel periodo di Lucky Star.",S.slate);
  ref("lucky","madonna","Artista","Lucky Star è un singolo di Madonna.",S.slate);
  ref("jackrabbit","buddyholly","Imitazione al diner","Nel ristorante un cameriere interpreta l'immagine pubblica di Buddy Holly.",S.cast);
  ref("jackrabbit","marilyn","Icona anni Cinquanta","Tra le figure impersonate dal personale compare Marilyn Monroe.",S.cast);
  ref("jackrabbit","jamesdean","Icona anni Cinquanta","Tra le figure impersonate dal personale compare James Dean.",S.cast);
  ref("jackrabbit","deanmartin","Icona del varietà","La coppia Dean Martin e Jerry Lewis fa parte dell'immaginario rievocato nel diner.",S.filmreferences);
  ref("jackrabbit","jerrylewis","Icona del varietà","La coppia Dean Martin e Jerry Lewis fa parte dell'immaginario rievocato nel diner.",S.filmreferences);
  ref("jackrabbit","steveco","Imitazione del presentatore","L'intrattenimento del diner evoca Ed Sullivan e la televisione americana del dopoguerra.",S.cast);
  ref("buscemi","buddyholly","Cameo","Steve Buscemi interpreta il cameriere vestito come Buddy Holly.",S.cast);
  ref("pulp","kissmedeadly","Parallelo critico · valigetta","Le misteriose valigette di Pulp Fiction e Kiss Me Deadly vengono spesso confrontate. Non è una prova di ispirazione diretta.",S.movie);
  ref("pulp","psycho","Parallelo visivo","La scena in cui Butch scorge Marsellus attraversare la strada viene accostata da alcuni commentatori a un'inquadratura di Psycho.",S.filmreferences);
  ref("pulp","warriors","Parallelo visivo","Un primo piano su labbra e microfono è elencato fra i parallelismi visivi con The Warriors.",S.filmreferences);
  ref("pulp","godardvivre","Rimando critico ai dialoghi","I silenzi discussi da Mia e Vincent vengono accostati al cinema di Godard in repertori delle citazioni.",S.filmreferences);
  ref("pulp","eight","Analogia della danza","Il ballo viene accostato anche a un movimento di danza di 8½: interpretazione critica, non influenza dimostrata.",S.filmreferences);
  ref("pulp","blacksabbath","Struttura a episodi","La struttura ad episodi viene confrontata con l'horror antologico Black Sabbath in repertori dedicati.",S.filmreferences);
  ref("pulp","thekillers","Analogia noir","La scena con Brett è confrontata con il noir The Killers in alcune analisi critiche.",S.filmreferences);
  ref("pulp","urban","Risonanza nel cast","La figura del cowboy evocata da Mia richiama anche il passato cinematografico di Travolta in Urban Cowboy.",S.filmreferences);
  ref("pulp","deadzone","Citazione interpretativa","Un dialogo del Wolf viene letto come allusione ai poteri del protagonista di The Dead Zone.",S.filmreferences);
  ref("pulp","raging","Rimando di dialogo","Una battuta di Fabienne viene messa in relazione con Raging Bull nel repertorio dei riferimenti.",S.filmreferences);
  ref("pulp","apocalypse","Rimando al film di guerra","La storia narrata da Captain Koons viene accostata a dialoghi di Apocalypse Now.",S.filmreferences);
  // Neighbouring paths, not speculative direct influences.
  ref("pulp","bande","Sequenza di danza","Il film di Godard è citato come riferimento per la preparazione della danza tra Mia e Vincent.",S.movie);
  connect("pulp","bodyguard","influence","Testo cinematografico riutilizzato",
    "Il discorso di Jules deriva dal testo che compare nella versione di The Bodyguard con Sonny Chiba.",S.bodyguard,
    "Wikipedia · Origine del monologo",10);
  connect("pulp","godard","influence","Influenza del cinema di Godard",
    "Tarantino ha più volte riconosciuto il ruolo del cinema di Godard e della Nouvelle Vague nella sua formazione.",S.movie,
    "Wikipedia · Omaggi e influenze",8);
  // Link historical figures to two-hop works for meaningful discovery.
  credit("deadzone","walken","Protagonista","https://www.imdb.com/title/tt0085407/fullcredits/");
  credit("grease","travolta","Interprete","https://www.imdb.com/title/tt0077631/fullcredits/");
  credit("saturday","travolta","Interprete","https://www.imdb.com/title/tt0076666/fullcredits/");
  credit("jackrabbit","thurman","Mia Wallace",S.cast);
  credit("jackrabbit","travolta","Vincent Vega",S.cast);
  // A relationship can have an interpretation without falsely being marked influence.
  // Do not attach every credit to Tarantino by default.
  console.info("Pulp Atlas editorial expansion:",items.length,"new nodes;",n,"new links");
})();