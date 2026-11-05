/* Pulp Atlas · Editorial seed data (v0.1)
   Each edge is a claim, with its own relationship type, explanation and source.
   This is a curated sample, not a complete catalogue of all Pulp Fiction references. */
window.ATLAS = (() => {
  const S = {
    credits: "https://www.imdb.com/title/tt0110912/fullcredits/",
    soundtrack: "https://cinecensura.com/wp-content/uploads/1994/05/Pulp-Fiction-Dialoghi-Originali.pdf",
    archive: "https://wiki.tarantino.info/index.php/Pulp_Fiction_Movie_References_Guide",
    references: "https://slate.com/culture/2015/09/quentin-tarantino-influences-and-references-every-inspiration-for-pulp-fiction.html",
    modesty: "https://www.imdb.com/title/tt0110912/faq/",
    movieclips: "https://www.youtube.com/watch?v=s7EdQ4FqbhY"
  };
  const categories = {
    film: { name: "Cinema", color: "#d77d6e", mark: "F" },
    scene: { name: "Scena", color: "#e59b90", mark: "S" },
    music: { name: "Musica", color: "#e4b36c", mark: "♫" },
    person: { name: "Persona", color: "#7dbbc3", mark: "P" },
    book: { name: "Libro", color: "#a4bd91", mark: "B" },
    comic: { name: "Fumetto", color: "#ae9bdb", mark: "C" },
    tv: { name: "Televisione", color: "#a4a3ca", mark: "TV" },
    idea: { name: "Riferimento", color: "#c29c7c", mark: "R" }
  };
  const relations = {
    reference: { name: "Riferimento / utilizzo", color: "#e4b36c" },
    credit: { name: "Credit / collaborazione", color: "#7dbbc3" },
    influence: { name: "Influenza documentata", color: "#ae9bdb" }
  };
  const nodes = [
    {id:"pulp",title:"Pulp Fiction",type:"film",year:"1994",subtitle:"Quentin Tarantino · Film",description:"Tre storie intrecciate, una colonna sonora che attraversa decenni e una fitta rete di riferimenti culturali. Il punto d'ingresso del nostro atlante.",wiki:"Pulp_Fiction",videoId:"s7EdQ4FqbhY",videoLabel:"Trailer cinematografico · Movieclips",sourceUrl:S.credits},
    {id:"tarantino",title:"Quentin Tarantino",type:"person",year:"1963",subtitle:"Regista, sceneggiatore",description:"Un cinema costruito sul dialogo tra generi popolari, storia del cinema e cultura pop.",wiki:"Quentin_Tarantino"},
    {id:"avary",title:"Roger Avary",type:"person",year:"1965",subtitle:"Sceneggiatore",description:"Coautore della sceneggiatura di Pulp Fiction; figura importante nella genesi dei suoi racconti.",wiki:"Roger_Avary"},
    {id:"travolta",title:"John Travolta",type:"person",year:"1954",subtitle:"Attore · Vincent Vega",description:"Il ruolo di Vincent Vega rilancia la carriera di Travolta e riattiva anche il ricordo del suo passato di icona della danza cinematografica.",wiki:"John_Travolta"},
    {id:"jackson",title:"Samuel L. Jackson",type:"person",year:"1948",subtitle:"Attore · Jules Winnfield",description:"Interpreta Jules, protagonista dei dialoghi biblici e del desiderio di 'walk the earth'.",wiki:"Samuel_L._Jackson"},
    {id:"thurman",title:"Uma Thurman",type:"person",year:"1970",subtitle:"Attrice · Mia Wallace",description:"Mia Wallace è al centro della sequenza al Jack Rabbit Slim's, crocevia di cinema e musica.",wiki:"Uma_Thurman"},
    {id:"willis",title:"Bruce Willis",type:"person",year:"1955",subtitle:"Attore · Butch Coolidge",description:"Butch è il pugile del film; la sua storia incrocia il pulp americano e il cinema criminale.",wiki:"Bruce_Willis"},
    {id:"reservoir",title:"Reservoir Dogs",type:"film",year:"1992",subtitle:"Film · Quentin Tarantino",description:"L'esordio nel lungometraggio di Tarantino, già interessato a struttura narrativa, dialoghi e cultura pop.",wiki:"Reservoir_Dogs"},
    {id:"jackie",title:"Jackie Brown",type:"film",year:"1997",subtitle:"Film · Quentin Tarantino",description:"Un altro ponte tra il cinema di Tarantino e la letteratura popolare americana, da un romanzo di Elmore Leonard.",wiki:"Jackie_Brown"},
    {id:"killbill",title:"Kill Bill: Volume 1",type:"film",year:"2003",subtitle:"Film · Quentin Tarantino",description:"Un incontro tra arti marziali, cinema di genere asiatico e narrazione di vendetta.",wiki:"Kill_Bill:_Volume_1"},
    {id:"saturday",title:"Saturday Night Fever",type:"film",year:"1977",subtitle:"Film · John Travolta",description:"Il film che consacra Travolta come star, anche attraverso la sua presenza fisica e il ballo.",wiki:"Saturday_Night_Fever"},
    {id:"grease",title:"Grease",type:"film",year:"1978",subtitle:"Film musicale · John Travolta",description:"Un altro tassello dell'immaginario musicale associato a John Travolta.",wiki:"Grease_(film)"},
    {id:"bande",title:"Bande à part",type:"film",year:"1964",subtitle:"Film · Jean-Luc Godard",description:"Il celebre ballo a tre nel café è un importante riferimento visivo per la danza di Vincent e Mia.",wiki:"Bande_à_part_(film)"},
    {id:"godard",title:"Jean-Luc Godard",type:"person",year:"1930–2022",subtitle:"Regista · Nouvelle Vague",description:"Tra i protagonisti della Nouvelle Vague francese, ha ridefinito il rapporto tra cinema, citazione e cultura contemporanea.",wiki:"Jean-Luc_Godard"},
    {id:"jackrabbit",title:"Jack Rabbit Slim's",type:"scene",year:"1994",subtitle:"Scena · Vincent e Mia",description:"Il ristorante immaginario è un laboratorio di nostalgia pop, icone anni Cinquanta e performance musicali.",wiki:"Pulp_Fiction"},
    {id:"misirlou",title:"Misirlou",type:"music",year:"1962",subtitle:"Brano · Dick Dale & His Del-Tones",description:"La reinterpretazione surf rock di una melodia dalle radici mediterranee apre il film con una scarica di energia.",wiki:"Misirlou"},
    {id:"dickdale",title:"Dick Dale",type:"person",year:"1937–2019",subtitle:"Musicista · Surf rock",description:"Chitarrista noto per il suono ad alta energia del surf rock e per la sua interpretazione di Misirlou.",wiki:"Dick_Dale"},
    {id:"nevercan",title:"You Never Can Tell",type:"music",year:"1964",subtitle:"Brano · Chuck Berry",description:"La canzone accompagna il twist di Vincent e Mia al Jack Rabbit Slim's.",wiki:"You_Never_Can_Tell_(song)"},
    {id:"chuckberry",title:"Chuck Berry",type:"person",year:"1926–2017",subtitle:"Musicista · Rock & roll",description:"Uno dei protagonisti della nascita del rock & roll; la sua musica crea un ponte con l'America pop degli anni Sessanta.",wiki:"Chuck_Berry"},
    {id:"sonpreacher",title:"Son of a Preacher Man",type:"music",year:"1968",subtitle:"Brano · Dusty Springfield",description:"Nel film risuona durante la preparazione di Mia, prima dell'incontro con Vincent.",wiki:"Son_of_a_Preacher_Man"},
    {id:"dusty",title:"Dusty Springfield",type:"person",year:"1939–1999",subtitle:"Cantante · Soul / pop",description:"La sua voce collega il film al pop e al soul britannico degli anni Sessanta.",wiki:"Dusty_Springfield"},
    {id:"girlwoman",title:"Girl, You'll Be a Woman Soon",type:"music",year:"1992",subtitle:"Brano · Urge Overkill",description:"La reinterpretazione di un brano di Neil Diamond accompagna un momento cruciale nella casa di Mia.",wiki:"Girl,_You'll_Be_a_Woman_Soon"},
    {id:"urge",title:"Urge Overkill",type:"person",year:"1986",subtitle:"Band · Alternative rock",description:"Il gruppo statunitense la cui versione del brano appare nella colonna sonora.",wiki:"Urge_Overkill"},
    {id:"diamond",title:"Neil Diamond",type:"person",year:"1941",subtitle:"Cantautore",description:"Autore del brano originale Girl, You'll Be a Woman Soon (1967).",wiki:"Neil_Diamond"},
    {id:"jungle",title:"Jungle Boogie",type:"music",year:"1973",subtitle:"Brano · Kool & the Gang",description:"Funk energico che risuona nell'auto di Vincent e Jules.",wiki:"Jungle_Boogie"},
    {id:"kool",title:"Kool & the Gang",type:"person",year:"1964",subtitle:"Band · Funk",description:"La band americana che porta il funk nella colonna sonora di Pulp Fiction.",wiki:"Kool_%26_the_Gang"},
    {id:"surf",title:"Surf Rider",type:"music",year:"1963",subtitle:"Brano · The Lively Ones",description:"Il brano surf strumentale accompagna la chiusura del film.",wiki:"Surf_Rider"},
    {id:"lively",title:"The Lively Ones",type:"person",year:"1960s",subtitle:"Band · Surf rock",description:"Gruppo surf rock la cui registrazione di Surf Rider chiude il film.",wiki:"The_Lively_Ones"},
    {id:"modestynovel",title:"Modesty Blaise",type:"book",year:"1965",subtitle:"Romanzo · Peter O'Donnell",description:"Vincent è visto leggere un romanzo con protagonista la spia Modesty Blaise. L'opera nasce da un universo a fumetti.",wiki:"Modesty_Blaise"},
    {id:"modestycomic",title:"Modesty Blaise · comic strip",type:"comic",year:"1963",subtitle:"Striscia a fumetti",description:"La protagonista debutta come striscia a fumetti britannica, prima di proseguire nei romanzi e negli adattamenti.",wiki:"Modesty_Blaise"},
    {id:"odonnell",title:"Peter O'Donnell",type:"person",year:"1920–2010",subtitle:"Autore · Fumetti e romanzi",description:"Creatore di Modesty Blaise, con una carriera che connette romanzo d'avventura e fumetto seriale.",wiki:"Peter_O%27Donnell"},
    {id:"kungfu",title:"Kung Fu",type:"tv",year:"1972",subtitle:"Serie televisiva",description:"Jules cita l'idea di vagare per il mondo come Caine, protagonista della serie.",wiki:"Kung_Fu_(1972_TV_series)"},
    {id:"carradine",title:"David Carradine",type:"person",year:"1936–2009",subtitle:"Attore · Kwai Chang Caine",description:"Interpreta Caine nella serie Kung Fu e in seguito lavora con Tarantino in Kill Bill.",wiki:"David_Carradine"},
    {id:"guns",title:"The Guns of Navarone",type:"film",year:"1961",subtitle:"Film · J. Lee Thompson",description:"Film di guerra citato nel dialogo di Jules.",wiki:"The_Guns_of_Navarone_(film)"},
    {id:"madonna",title:"Madonna",type:"person",year:"1958",subtitle:"Artista · Pop",description:"Fabienne cita Madonna nella conversazione con Butch: un piccolo riferimento alla cultura pop degli anni Ottanta.",wiki:"Madonna"},
    {id:"rum",title:"Rum Punch",type:"book",year:"1992",subtitle:"Romanzo · Elmore Leonard",description:"Il romanzo da cui Tarantino ha tratto Jackie Brown, percorso di uscita dalla mappa iniziale.",wiki:"Rum_Punch"},
    {id:"leonard",title:"Elmore Leonard",type:"person",year:"1925–2013",subtitle:"Scrittore · Crime fiction",description:"Autore del romanzo Rum Punch, ponte fra narrativa hard-boiled e cinema contemporaneo.",wiki:"Elmore_Leonard"}
  ];

  let k = 0;
  const links = [];
  function e(source,target,kind,label,detail,sourceUrl,sourceLabel,priority=4){
    links.push({id:"r"+(++k),source,target,kind,label,detail,sourceUrl,sourceLabel,priority});
  }
  // Credits
  e("pulp","tarantino","credit","Regia e sceneggiatura","Quentin Tarantino dirige Pulp Fiction ed è accreditato per la sceneggiatura.",S.credits,"IMDb · Full cast & crew",9);
  e("pulp","avary","credit","Co-sceneggiatura","Roger Avary condivide il credito per la sceneggiatura di Pulp Fiction.",S.credits,"IMDb · Full cast & crew",6);
  e("pulp","travolta","credit","Vincent Vega","John Travolta interpreta Vincent Vega.",S.credits,"IMDb · Full cast & crew",8);
  e("pulp","jackson","credit","Jules Winnfield","Samuel L. Jackson interpreta Jules Winnfield.",S.credits,"IMDb · Full cast & crew",8);
  e("pulp","thurman","credit","Mia Wallace","Uma Thurman interpreta Mia Wallace.",S.credits,"IMDb · Full cast & crew",8);
  e("pulp","willis","credit","Butch Coolidge","Bruce Willis interpreta il pugile Butch Coolidge.",S.credits,"IMDb · Full cast & crew",6);
  e("tarantino","reservoir","credit","Regia","Tarantino dirige Reservoir Dogs, uscito prima di Pulp Fiction.", "https://www.imdb.com/title/tt0105236/","IMDb · Reservoir Dogs",7);
  e("tarantino","jackie","credit","Regia e sceneggiatura","Tarantino adatta il romanzo Rum Punch nel film Jackie Brown.", "https://www.imdb.com/title/tt0119396/","IMDb · Jackie Brown",8);
  e("tarantino","killbill","credit","Regia","Kill Bill: Volume 1 è un film scritto e diretto da Tarantino.", "https://www.imdb.com/title/tt0266697/","IMDb · Kill Bill",6);
  e("travolta","saturday","credit","Protagonista","John Travolta interpreta Tony Manero in Saturday Night Fever.", "https://www.imdb.com/title/tt0076666/","IMDb · Saturday Night Fever",7);
  e("travolta","grease","credit","Protagonista","John Travolta interpreta Danny Zuko nel musical Grease.", "https://www.imdb.com/title/tt0077631/","IMDb · Grease",6);
  e("bande","godard","credit","Regia","Jean-Luc Godard dirige Bande à part nel 1964.", "https://www.imdb.com/title/tt0057869/","IMDb · Bande à part",7);
  e("jackie","rum","reference","Adattamento","Jackie Brown è un adattamento del romanzo Rum Punch di Elmore Leonard.", "https://www.imdb.com/title/tt0119396/","IMDb · Jackie Brown",9);
  e("rum","leonard","credit","Autore","Elmore Leonard scrive Rum Punch.", "https://en.wikipedia.org/wiki/Rum_Punch","Wikipedia · Rum Punch",8);
  e("kungfu","carradine","credit","Interpreta Caine","David Carradine interpreta il monaco Kwai Chang Caine nella serie Kung Fu.", "https://en.wikipedia.org/wiki/Kung_Fu_(1972_TV_series)","Wikipedia · Kung Fu",8);
  e("killbill","carradine","credit","Bill","David Carradine interpreta Bill nel film di Tarantino.", "https://www.imdb.com/title/tt0266697/","IMDb · Kill Bill",7);
  // Songs / source track notes verified by end-title musical credits
  e("pulp","misirlou","reference","Titoli di testa · soundtrack","La registrazione di Dick Dale & His Del-Tones apre il film: un tema dal Mediterraneo orientale trasformato in surf rock.",S.soundtrack,"Pulp Fiction · titoli musicali",10);
  e("misirlou","dickdale","credit","Interprete","Dick Dale & His Del-Tones eseguono la versione utilizzata nel film.",S.soundtrack,"Pulp Fiction · titoli musicali",9);
  e("pulp","nevercan","reference","Musica del twist","You Never Can Tell accompagna il twist di Vincent e Mia al Jack Rabbit Slim's.",S.soundtrack,"Pulp Fiction · titoli musicali",10);
  e("nevercan","chuckberry","credit","Autore e interprete","Il brano è scritto e interpretato da Chuck Berry.",S.soundtrack,"Pulp Fiction · titoli musicali",9);
  e("pulp","sonpreacher","reference","Colonna sonora","La versione di Dusty Springfield compare nella colonna sonora.",S.soundtrack,"Pulp Fiction · titoli musicali",8);
  e("sonpreacher","dusty","credit","Interprete","La versione usata nel film è interpretata da Dusty Springfield.",S.soundtrack,"Pulp Fiction · titoli musicali",9);
  e("pulp","girlwoman","reference","Colonna sonora","La versione di Urge Overkill del brano di Neil Diamond accompagna una scena chiave con Mia.",S.soundtrack,"Pulp Fiction · titoli musicali",8);
  e("girlwoman","urge","credit","Interprete","Urge Overkill esegue la cover del brano usata nel film.",S.soundtrack,"Pulp Fiction · titoli musicali",8);
  e("girlwoman","diamond","credit","Autore originale","Neil Diamond scrive e registra il brano originale nel 1967.", "https://en.wikipedia.org/wiki/Girl,_You%27ll_Be_a_Woman_Soon","Wikipedia · Brano",8);
  e("pulp","jungle","reference","Colonna sonora","Jungle Boogie si sente durante la sequenza con Jules e Vincent in auto.",S.soundtrack,"Pulp Fiction · titoli musicali",7);
  e("jungle","kool","credit","Interpreti","Kool & the Gang registrano Jungle Boogie.",S.soundtrack,"Pulp Fiction · titoli musicali",8);
  e("pulp","surf","reference","Titoli di coda · soundtrack","Surf Rider dei Lively Ones accompagna la conclusione del film.",S.soundtrack,"Pulp Fiction · titoli musicali",7);
  e("surf","lively","credit","Interpreti","The Lively Ones eseguono la versione di Surf Rider scelta per il film.",S.soundtrack,"Pulp Fiction · titoli musicali",8);
  // Cultural references
  e("pulp","modestynovel","reference","Oggetto di scena · libro","Vincent Vega è visto leggere un romanzo di Modesty Blaise, personaggio nato come fumetto britannico.",S.modesty,"IMDb · Pulp Fiction FAQ",10);
  e("modestynovel","modestycomic","reference","Origine del personaggio","Modesty Blaise esordisce come comic strip nel 1963, prima dei romanzi.", "https://en.wikipedia.org/wiki/Modesty_Blaise","Wikipedia · Modesty Blaise",9);
  e("modestynovel","odonnell","credit","Autore","Il romanzo e il personaggio sono opera di Peter O'Donnell.", "https://en.wikipedia.org/wiki/Peter_O%27Donnell","Wikipedia · Peter O'Donnell",8);
  e("modestycomic","odonnell","credit","Creatore","Peter O'Donnell crea Modesty Blaise come striscia a fumetti.", "https://en.wikipedia.org/wiki/Modesty_Blaise","Wikipedia · Modesty Blaise",8);
  e("pulp","kungfu","reference","Citazione di dialogo","Jules allude al vagabondare del personaggio Caine della serie Kung Fu quando immagina di 'walk the earth'.",S.references,"Slate · Riferimenti culturali",8);
  e("pulp","guns","reference","Citazione di dialogo","Jules cita The Guns of Navarone nel film.",S.archive,"Tarantino Archives · References",5);
  e("pulp","madonna","reference","Citazione di dialogo","Fabienne fa riferimento a Madonna e al periodo di Lucky Star.",S.references,"Slate · Riferimenti culturali",6);
  e("pulp","jackrabbit","reference","Sequenza del film","Il ristorante immaginario raccoglie molti riferimenti al cinema e alla musica degli anni Cinquanta.",S.archive,"Tarantino Archives · References",8);
  e("jackrabbit","nevercan","reference","Twist contest","Vincent e Mia ballano sulle note di You Never Can Tell.",S.soundtrack,"Pulp Fiction · titoli musicali",10);
  e("jackrabbit","bande","influence","Riferimento alla danza","La scena di ballo di Bande à part fu un riferimento per la preparazione del twist di Vincent e Mia.",S.archive,"Tarantino Archives · References",8);
  e("pulp","bande","influence","Influenza cinematografica","Il film di Godard è collegato alla celebre sequenza di danza di Pulp Fiction; vedi la guida dei riferimenti per il contesto.",S.archive,"Tarantino Archives · References",7);

  return {categories,relations,nodes,links,sources:S};
})();
