/* Pulp Atlas · Interactive graph UI. No backend, credentials or external data storage. */
(() => {
  "use strict";
  const atlas = window.ATLAS;
  const $ = id => document.getElementById(id);
  const byId = new Map(atlas.nodes.map(n => [n.id,n]));
  const types = Object.keys(atlas.categories);
  const typeOrder = Object.fromEntries(types.map((t,i) => [t,i]));
  const allConnections = atlas.links;
  const imageCache = new Map();
  let cy, mode = "explore", relation = "all", focus = "pulp", history = ["pulp"];
  let shownLimit = 12, enabledTypes = new Set(types), currentSelection = {type:"node",id:"pulp"};
  let searchMatches = [], lastTap = {id:"",at:0};
  let simulation = null, physicsNodes = new Map(), syncingPhysics = false;
  let imageLoadPromise = null;
  const imageOrigins = new Map();

  const escapeHtml = s => String(s ?? "").replace(/[&<>"']/g,c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const getColor = type => atlas.categories[type]?.color || "#99a2ac";
  const getRelated = id => allConnections.filter(e => e.source === id || e.target === id);
  const otherEnd = (edge,id) => edge.source === id ? edge.target : edge.source;
  const wikipediaUrl = node => node.wiki ? "https://en.wikipedia.org/wiki/" + node.wiki : null;
  const sourceLink = (url,label) => url ? '<a class="source-link" href="'+escapeHtml(url)+'" target="_blank" rel="noopener noreferrer">↗ '+escapeHtml(label || "Apri fonte")+'</a>' : "";
  const categoryLabel = node => atlas.categories[node.type]?.name || node.type;
  const initials = text => text.split(/\s+/).slice(0,2).map(w=>w[0]).join("").toUpperCase();
  const iconData = type => {
    const c = atlas.categories[type];
    const glyph = c.mark;
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><circle cx="60" cy="60" r="55" fill="'+c.color+'" fill-opacity=".13"/><circle cx="60" cy="60" r="42" fill="'+c.color+'" fill-opacity=".18"/><text x="60" y="75" fill="'+c.color+'" font-family="Arial,sans-serif" font-size="'+(glyph.length>1?35:51)+'" font-weight="700" text-anchor="middle">'+glyph+'</text></svg>';
    return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
  };
  const icons = Object.fromEntries(types.map(t=>[t,iconData(t)]));

  function initGraph() {
    if (!window.cytoscape) {
      $("graph").innerHTML = '<div style="padding:90px 20px;text-align:center;color:#d9dde0">Impossibile caricare il motore grafico. Controlla la connessione e ricarica la pagina.</div>';
      return;
    }
    cy = cytoscape({
      container: $("graph"), elements:[],
      wheelSensitivity:.20, minZoom:.17, maxZoom:2.2,
      boxSelectionEnabled:false,
      autoungrabify:false,
      autounselectify:true,
      style:[
        {selector:"node",style:{
          "shape":"ellipse","width":68,"height":68,"border-width":2.5,
          "border-color":"data(color)","background-color":"#2a3036",
          "background-image":"data(image)","background-fit":"cover",
          "background-image-opacity":1,"background-image-crossorigin":"anonymous",
          "label":"data(label)","font-family":"DM Sans, Arial, sans-serif",
          "font-size":12.5,"font-weight":600,"color":"#e9e9e6",
          "text-valign":"bottom","text-halign":"center","text-margin-y":12,
          "text-wrap":"wrap","text-max-width":"105px","text-outline-color":"#171b1f",
          "text-outline-width":2.5,"text-outline-opacity":.95,
          "overlay-padding":10,"overlay-opacity":0
        }},
        {selector:"node.focus",style:{"width":90,"height":90,"border-width":4,"border-color":"#e4b36c",
          "background-color":"#533d31","font-size":16,"font-weight":700,"text-margin-y":15,
          "shadow-blur":22,"shadow-color":"#e4b36c","shadow-opacity":.18,"shadow-offset-x":0,"shadow-offset-y":0}},
        {selector:"node.photo",style:{"background-color":"#292b2c","border-width":3.5}},
        {selector:"node.active",style:{"border-width":5,"border-color":"#f0d1a0"}},
        {selector:"edge",style:{
          "width":2,"line-color":"data(color)","opacity":.58,"curve-style":"bezier",
          "target-arrow-shape":"none","line-cap":"round","overlay-padding":10,"overlay-opacity":0
        }},
        {selector:"edge.reference",style:{"width":2.8,"opacity":.68}},
        {selector:"edge.credit",style:{"line-style":"solid","opacity":.42}},
        {selector:"edge.influence",style:{"line-style":"dashed","opacity":.78}},
        {selector:"edge.active",style:{"width":5,"opacity":1,"line-color":"#f2cd91"}},
        {selector:"edge.dimmed",style:{"opacity":.16}},
        {selector:"node.dimmed",style:{"opacity":.4}}
      ]
    });
    // Cytoscape handles pointer position; D3 handles the elastic response.
    cy.on("grab","node", ev => {
      const point=physicsNodes.get(ev.target.id());
      if(!point || !simulation)return;
      point.fx=point.x;point.fy=point.y;
      simulation.alphaTarget(.24).restart();
    });
    cy.on("drag","node", ev => {
      const point=physicsNodes.get(ev.target.id());
      if(!point || !simulation)return;
      const pos=ev.target.position();
      point.fx=pos.x;point.fy=pos.y;
      point.x=pos.x;point.y=pos.y;
      simulation.alpha(Math.max(simulation.alpha(),.22)).restart();
    });
    cy.on("free","node", ev => {
      const point=physicsNodes.get(ev.target.id());
      if(!point || !simulation)return;
      point.fx=null;point.fy=null;
      simulation.alphaTarget(0).alpha(.19).restart();
    });
    cy.on("tap","node", ev => {
      const id = ev.target.id(), now = Date.now();
      if (lastTap.id===id && now-lastTap.at<380) navigateTo(id);
      else showNode(id);
      lastTap = {id,at:now};
    });
    cy.on("tap","edge", ev => showEdge(ev.target.id()));
    cy.on("mouseover","node, edge",()=>{$("graph").style.cursor="pointer"});
    cy.on("mouseout","node, edge",()=>{$("graph").style.cursor="grab"});
    cy.on("tap",ev=>{ if(ev.target===cy) highlightSelection(null) });
  }

  function currentElements() {
    let edges = allConnections.filter(e => relation==="all" || e.kind===relation);
    let nodeIds;
    if (mode==="explore") {
      const primary = edges.filter(e => e.source===focus || e.target===focus)
        .filter(e => enabledTypes.has(byId.get(otherEnd(e,focus)).type))
        .sort((a,b) => b.priority-a.priority || a.id.localeCompare(b.id));
      const uniq=[], found=new Set();
      for(const e of primary) {
        const id=otherEnd(e,focus);
        if(!found.has(id)) { found.add(id); uniq.push(id); }
      }
      nodeIds=new Set([focus,...uniq.slice(0,shownLimit)]);
      edges=edges.filter(e=>nodeIds.has(e.source)&&nodeIds.has(e.target));
    } else {
      nodeIds=new Set(atlas.nodes.filter(n=>enabledTypes.has(n.type)||n.id===focus).map(n=>n.id));
      edges=edges.filter(e=>nodeIds.has(e.source)&&nodeIds.has(e.target));
    }
    const nodes=atlas.nodes.filter(n=>nodeIds.has(n.id));
    return {nodes,edges};
  }

  function semanticGroup(node) {
    if(node.id==="pulp")return "center";
    if(node.type==="music")return "music";
    if(node.type==="book"||node.type==="comic")return "literature";
    if(node.type==="tv")return "television";
    if(node.type==="scene"||node.type==="film")return "cinema";
    if(node.id==="madonna")return "music";
    if(node.type==="person"){
      const peers=getRelated(node.id).map(e=>byId.get(otherEnd(e,node.id)))
        .filter(n=>n && n.id!=="pulp");
      if(peers.some(n=>n.type==="music"))return "music";
      if(peers.some(n=>n.type==="book"||n.type==="comic"))return "literature";
      if(peers.some(n=>n.type==="tv"))return "television";
    }
    return "cinema";
  }

  const groupCenters={
    center:{x:0,y:0},
    cinema:{x:-390,y:-240},
    music:{x:460,y:-150},
    literature:{x:-440,y:400},
    television:{x:320,y:450}
  };

  function seedPositions(nodes) {
    const p={},groupCounts={};
    if(mode==="explore"){
      p[focus]={x:0,y:0};
      const others=nodes.filter(n=>n.id!==focus).sort((a,b)=>
        typeOrder[a.type]-typeOrder[b.type]||a.title.localeCompare(b.title));
      others.forEach((n,i)=>{
        const theta=-Math.PI/2+i*2*Math.PI/Math.max(1,others.length);
        const radius=330+(i%3)*48;
        p[n.id]={x:Math.cos(theta)*radius,y:Math.sin(theta)*radius};
      });
    } else {
      nodes.forEach(n=>{
        if(n.id===focus){p[n.id]={x:0,y:0};return;}
        const group=semanticGroup(n),index=groupCounts[group]||0;
        groupCounts[group]=index+1;
        const anchor=groupCenters[group],angle=index*2.3999632297;
        const radius=155*Math.sqrt(index+1);
        p[n.id]={x:anchor.x+Math.cos(angle)*radius,
                 y:anchor.y+Math.sin(angle)*radius};
      });
    }
    return p;
  }

  function syncGraphFromPhysics() {
    if(!cy||!physicsNodes.size)return;
    syncingPhysics=true;
    cy.batch(()=>{
      for(const point of physicsNodes.values()){
        const element=cy.$id(point.id);
        if(element.length && Number.isFinite(point.x) && Number.isFinite(point.y))
          element.position({x:point.x,y:point.y});
      }
    });
    syncingPhysics=false;
  }

  function startPhysics(nodes,edges,initialPositions){
    if(simulation){simulation.stop();simulation=null;}
    physicsNodes.clear();
    if(!window.d3) {
      // Keeps the atlas usable if the physics CDN is temporarily unavailable.
      cy.layout({name:"cose",animate:false,fit:true,padding:80,
        nodeRepulsion:()=>190000,idealEdgeLength:()=>220,nodeOverlap:70}).run();
      return;
    }
    const isOverview=mode==="overview";
    const points=nodes.map(n=>{
      const pos=initialPositions[n.id]||{x:0,y:0};
      const point={id:n.id,x:pos.x,y:pos.y};
      physicsNodes.set(n.id,point);
      return point;
    });
    // Copy links: d3.forceLink mutates their source/target fields to objects.
    const links=edges.map(e=>({source:e.source,target:e.target,kind:e.kind}));
    simulation=d3.forceSimulation(points)
      .force("links",d3.forceLink(links).id(d=>d.id)
        .distance(e=>isOverview?(e.source.id==="pulp"||e.target.id==="pulp"?370:260):340)
        .strength(e=>isOverview?((e.source.id==="pulp"||e.target.id==="pulp")?.095:.23):.22))
      .force("repulsion",d3.forceManyBody()
        .strength(isOverview?-1080:-790).distanceMax(1300))
      .force("spacing",d3.forceCollide()
        .radius(n=>n.id===focus?128:(isOverview?105:98)).strength(1).iterations(4))
      .force("x",d3.forceX(n=>{
        if(!isOverview)return 0;
        return groupCenters[semanticGroup(byId.get(n.id))].x;
      }).strength(n=>n.id===focus ? .11 : (isOverview ? .055 : .025)))
      .force("y",d3.forceY(n=>{
        if(!isOverview)return 0;
        return groupCenters[semanticGroup(byId.get(n.id))].y;
      }).strength(n=>n.id===focus ? .11 : (isOverview ? .055 : .025)))
      .velocityDecay(.48)
      .alphaDecay(.025)
      .on("tick",syncGraphFromPhysics);
    // Settle an initial non-overlapping layout before framing the map.
    simulation.stop();
    for(let i=0;i<(isOverview?240:170);i++)simulation.tick();
    syncGraphFromPhysics();
    // Resume with a low alpha for the gentle "breathing" effect.
    simulation.alpha(.055).restart();
  }

  function frameGraph(){
    if(!cy || !cy.nodes().length)return;
    cy.resize();
    cy.fit(cy.nodes(),mode==="overview"?75:98);
  }

  function renderGraph() {
    if(!cy)return;
    const {nodes,edges}=currentElements();
    const positions=seedPositions(nodes);
    if(simulation){simulation.stop();simulation=null;}
    physicsNodes.clear();
    cy.elements().remove();
    cy.add(nodes.map(n=>({
      group:"nodes",
      data:{id:n.id,label:n.title,color:getColor(n.type),
        image:imageCache.get(n.id)||icons[n.type]},
      position:positions[n.id],
      classes:(n.id===focus?"focus ":"")+(imageCache.get(n.id)?"photo":"")
    })));
    cy.add(edges.map(e=>({
      group:"edges",
      data:{id:e.id,source:e.source,target:e.target,color:atlas.relations[e.kind].color},
      classes:e.kind
    })));
    startPhysics(nodes,edges,positions);
    frameGraph();
    $("nodeStat").textContent=nodes.length+" nodi";
    $("edgeStat").textContent=edges.length+" collegamenti";
    updateBreadcrumbs();
    highlightSelection(currentSelection);
  }

  function updateBreadcrumbs() {
    $("pathList").innerHTML=history.map((id,i)=>'<button class="crumb '+(i===history.length-1?"current":"")+'" data-path="'+i+'">'+escapeHtml(byId.get(id)?.title||id)+'</button>'+(i<history.length-1?'<span class="crumb-sep">›</span>':"")).join("");
  }

  function setPanelOpen(open) {
    $("detailPanel").classList.toggle("closed",!open);
    document.documentElement.classList.toggle("panel-open",open);
    if(cy) { setTimeout(()=>{cy.resize();cy.fit(cy.elements(),mode==="overview"?70:95);if(open&&window.innerWidth>900)cy.panBy({x:-95,y:0});},40); }
  }

  function highlightSelection(sel) {
    if(!cy)return;
    cy.elements().removeClass("active dimmed");
    if(!sel)return;
    let element=cy.$id(sel.id);
    if(!element || !element.length)return;
    element.addClass("active");
    if(sel.type==="edge") {
      const ends=element.connectedNodes();
      ends.addClass("active");
    }
  }

  function showNode(id) {
    const node=byId.get(id);if(!node)return;
    currentSelection={type:"node",id};
    const neighbors=getRelated(id).sort((a,b)=>b.priority-a.priority).slice(0,12);
    const related=neighbors.map(e=>{
      const target=byId.get(otherEnd(e,id));if(!target)return "";
      return '<button class="related-item" data-node="'+target.id+'"><span class="related-dot" style="background:'+getColor(target.type)+'"></span><span><strong>'+escapeHtml(target.title)+'</strong><small>'+escapeHtml(e.label)+'</small></span><span style="margin-left:auto;color:#9eaab2">↗</span></button>';
    }).join("");
    const panel=$("detailContent");
    panel.innerHTML='<div class="panel-top"><span class="panel-overline"><i class="panel-category-dot" style="background:'+getColor(node.type)+'"></i>'+escapeHtml(categoryLabel(node))+'</span><button class="close-panel" data-action="close" aria-label="Chiudi pannello">×</button></div>'+
      '<div class="panel-body">'+
      '<div class="media-hero" id="heroMedia"><span class="art-fallback">'+escapeHtml(initials(node.title))+'</span></div>'+
      '<h2 class="panel-title">'+escapeHtml(node.title)+'</h2><p class="panel-subtitle">'+escapeHtml(node.subtitle || node.year || "")+'</p>'+
      '<p class="panel-summary">'+escapeHtml(node.description)+'</p>'+
      '<button class="primary-btn" data-focus="'+node.id+'">Esplora le connessioni <span>↗</span></button>'+
      (node.videoId?'<span class="section-label">GUARDA</span><div id="mediaSlot"><button class="video-thumb" data-video="'+escapeHtml(node.videoId)+'"><span class="video-play">▶</span><span><strong>'+escapeHtml(node.videoLabel||"Riproduci video")+'</strong><br>Player YouTube integrato · clicca per caricare</span></button></div>':'')+
      (related?'<span class="section-label">CONNESSIONI · '+neighbors.length+'</span><div class="related-list">'+related+'</div>':'')+
      (id===focus && mode==="explore" ? moreConnectionsMarkup() : "")+
      '<div class="panel-divider"></div><span class="section-label">APPROFONDISCI</span>'+
      sourceLink(wikipediaUrl(node),"Wikipedia · Scheda enciclopedica")+
      sourceLink(node.sourceUrl,"Fonte primaria / scheda film")+
      '<small style="display:block;color:#73818a;line-height:1.5;margin-top:12px">Le immagini provengono, quando disponibili, dalle anteprime di Wikipedia. Fonti e relazioni possono essere aggiornate.</small>'+
      '</div>';
    loadImage(node,panel.querySelector("#heroMedia"));
    setPanelOpen(true);highlightSelection(currentSelection);
  }

  function moreConnectionsMarkup(){
    const all=getRelated(focus).filter(e=>(relation==="all"||e.kind===relation) && enabledTypes.has(byId.get(otherEnd(e,focus)).type));
    const total=new Set(all.map(e=>otherEnd(e,focus))).size,hidden=Math.max(0,total-shownLimit);
    return hidden ? '<button class="secondary-btn" data-action="more">Mostra altre '+Math.min(8,hidden)+' connessioni nella mappa →</button>' : "";
  }

  function updateVisualImage(node,src,origin) {
    if(!src || !/^https:\/\//.test(src))return;
    imageCache.set(node.id,src);
    imageOrigins.set(node.id,origin);
    const element=cy?.$id(node.id);
    if(element?.length){element.data("image",src);element.addClass("photo");}
    if(currentSelection?.type==="node" && currentSelection.id===node.id){
      const hero=$("heroMedia");
      if(hero)insertImage(hero,src,node,origin);
    }
  }

  async function fetchWikipediaImages() {
    const wikiNodes=atlas.nodes.filter(n=>n.wiki);
    const titleOf=n=>decodeURIComponent(n.wiki).replace(/_/g," ");
    const key=s=>String(s).replace(/_/g," ").trim().toLocaleLowerCase();
    const params=new URLSearchParams({
      action:"query",format:"json",formatversion:"2",origin:"*",
      redirects:"1",prop:"pageimages",piprop:"thumbnail",
      pithumbsize:"360",pilicense:"any",
      titles:[...new Set(wikiNodes.map(titleOf))].join("|")
    });
    const response=await fetch("https://en.wikipedia.org/w/api.php?"+params,{mode:"cors"});
    if(!response.ok)throw new Error("Wikipedia image API unavailable");
    const json=await response.json();
    const aliases=new Map();
    for(const pair of [...(json.query?.normalized||[]),...(json.query?.redirects||[])])
      aliases.set(key(pair.from),key(pair.to));
    const pageByTitle=new Map((json.query?.pages||[]).map(page=>[key(page.title),page]));
    for(const node of wikiNodes){
      let title=key(titleOf(node));
      for(let i=0;i<4&&aliases.has(title);i++)title=aliases.get(title);
      const page=pageByTitle.get(title);
      const src=page?.thumbnail?.source;
      if(src)updateVisualImage(node,src,"Wikipedia");
    }
  }

  async function fetchCommonsFallback(node) {
    // A second source when the Wikipedia article has no lead thumbnail.
    // Avoid unrelated matches: only use Commons file titles matching key terms.
    const terms=node.title.replace(/·.+$/,"").replace(/[^\p{L}\p{N} ]/gu," ").trim();
    if(terms.length<4)return;
    const params=new URLSearchParams({
      action:"query",format:"json",formatversion:"2",origin:"*",
      generator:"search",gsrsearch:'"'+terms+'"',
      gsrnamespace:"6",gsrlimit:"8",
      prop:"imageinfo",iiprop:"url|mime",iiurlwidth:"360"
    });
    try{
      const response=await fetch("https://commons.wikimedia.org/w/api.php?"+params,{mode:"cors"});
      if(!response.ok)return;
      const json=await response.json();
      const words=terms.toLocaleLowerCase().split(/\s+/).filter(w=>w.length>2);
      const candidates=(json.query?.pages||[]).filter(page=>{
        const title=page.title.toLocaleLowerCase();
        const hits=words.filter(w=>title.includes(w)).length;
        return hits>=Math.min(2,words.length);
      });
      const best=candidates.find(p=>{
        const mime=p.imageinfo?.[0]?.mime||"";
        return ["image/jpeg","image/png","image/webp"].includes(mime) &&
               (p.imageinfo?.[0]?.thumburl||p.imageinfo?.[0]?.url);
      });
      const src=best?.imageinfo?.[0]?.thumburl||best?.imageinfo?.[0]?.url;
      if(src)updateVisualImage(node,src,"Wikimedia Commons");
    }catch(e){/* Keep the accessible editorial icon as fallback. */}
  }

  async function preloadNodeImages() {
    try {await fetchWikipediaImages();}
    catch(e){console.warn("Immagini Wikipedia non disponibili",e);}
    // Commons requests are rate-limited by concurrency; thumbnails are not stored here.
    const remaining=atlas.nodes.filter(n=>n.wiki && !imageCache.has(n.id));
    let next=0;
    const count=Math.min(3,remaining.length);
    await Promise.all(Array.from({length:count},async()=>{
      while(next<remaining.length){
        const node=remaining[next++];
        await fetchCommonsFallback(node);
      }
    }));
  }

  async function loadImage(node,box) {
    if(!node.wiki||!box)return;
    if(!imageCache.has(node.id) && imageLoadPromise)await imageLoadPromise;
    const src=imageCache.get(node.id);
    if(src && box.isConnected && currentSelection?.id===node.id)
      insertImage(box,src,node,imageOrigins.get(node.id)||"Wikipedia");
  }

  function insertImage(box,src,node,origin) {
    box.innerHTML='<img src="'+escapeHtml(src)+'" alt="Immagine di '+escapeHtml(node.title)+'" loading="lazy"><span class="media-credit">'+escapeHtml(origin)+'</span>';
    const img=box.querySelector("img");
    img.onerror=()=>{box.innerHTML='<span class="art-fallback">'+escapeHtml(initials(node.title))+'</span>';};
  }

  function showEdge(id) {
    const e=allConnections.find(x=>x.id===id);if(!e)return;
    const from=byId.get(e.source),to=byId.get(e.target),r=atlas.relations[e.kind];
    currentSelection={type:"edge",id};
    $("detailContent").innerHTML='<div class="panel-top"><span class="panel-overline"><i class="panel-category-dot" style="background:'+r.color+'"></i>'+escapeHtml(r.name)+'</span><button class="close-panel" data-action="close" aria-label="Chiudi pannello">×</button></div>'+
      '<div class="panel-body"><span class="section-label">QUESTO COLLEGAMENTO</span>'+
      '<h2 class="panel-title">'+escapeHtml(e.label)+'</h2>'+
      '<div class="pair"><span>'+escapeHtml(from.title)+'</span><em>↔</em><span>'+escapeHtml(to.title)+'</span></div>'+
      '<div class="edge-explainer" style="border-left-color:'+r.color+'">'+escapeHtml(e.detail)+'</div>'+
      '<span class="section-label">VERIFICA IL RIFERIMENTO</span>'+
      sourceLink(e.sourceUrl,e.sourceLabel || "Fonte esterna")+
      '<span class="section-label">CONTINUA</span>'+
      '<button class="primary-btn" data-focus="'+to.id+'">Esplora '+escapeHtml(to.title)+' ↗</button>'+
      '<button class="secondary-btn" data-node="'+from.id+'">Apri '+escapeHtml(from.title)+'</button>'+
      '</div>';
    setPanelOpen(true);highlightSelection(currentSelection);
  }

  function navigateTo(id,fromHistory=false) {
    if(!byId.has(id))return;
    focus=id;
    if(!fromHistory){
      const existing=history.indexOf(id);
      history=existing>=0 ? history.slice(0,existing+1) : [...history,id].slice(-7);
    }
    mode="explore";shownLimit=12;
    updateViewButtons();
    renderGraph();showNode(id);
  }

  function updateViewButtons() {
    $("exploreMode").classList.toggle("active",mode==="explore");
    $("overviewMode").classList.toggle("active",mode==="overview");
    $("exploreMode").setAttribute("aria-pressed",mode==="explore");
    $("overviewMode").setAttribute("aria-pressed",mode==="overview");
  }
  function changeMode(next) {
    mode=next;updateViewButtons();renderGraph();
  }
  function changeRelation(next) {
    relation=next;shownLimit=12;
    document.querySelectorAll(".filter-chip").forEach(b=>{
      const active=b.dataset.rel===next;
      b.classList.toggle("selected",active);
      b.setAttribute("aria-pressed",String(active));
    });
    renderGraph();
    if(currentSelection?.type==="node")showNode(currentSelection.id);
  }

  function renderDomains() {
    const counts=Object.fromEntries(types.map(t=>[t,atlas.nodes.filter(n=>n.type===t).length]));
    $("domainMenu").innerHTML='<div class="domain-heading">MOSTRA GLI AMBITI</div>'+
      types.map(t=>'<label class="domain-check"><input type="checkbox" data-domain="'+t+'" '+(enabledTypes.has(t)?"checked":"")+'><span class="result-dot" style="background:'+getColor(t)+'"></span>'+atlas.categories[t].name+'<small>'+counts[t]+'</small></label>').join("")+
      '<div class="domain-actions"><button data-domains="all">Seleziona tutti</button><button data-domains="none">Deseleziona</button></div>';
    $("domainCount").textContent=enabledTypes.size===types.length?"Tutti":enabledTypes.size+"/"+types.length;
  }

  function renderSearch() {
    const q=$("search").value.trim().toLocaleLowerCase();
    if(!q){$("searchResults").hidden=true;searchMatches=[];return;}
    searchMatches=atlas.nodes.filter(n=>(n.title+" "+n.subtitle+" "+categoryLabel(n)).toLocaleLowerCase().includes(q)).slice(0,9);
    $("searchResults").innerHTML=searchMatches.length?searchMatches.map(n=>
      '<button class="result" role="option" data-search-id="'+n.id+'"><span class="result-dot" style="background:'+getColor(n.type)+'"></span><span class="result-copy"><strong>'+escapeHtml(n.title)+'</strong><small>'+escapeHtml(categoryLabel(n))+' · '+escapeHtml(n.year||"")+'</small></span></button>').join(""):'<div class="search-empty">Nessun risultato nel dataset di prova.</div>';
    $("searchResults").hidden=false;
  }

  function bindUi() {
    $("brandHome").addEventListener("click",e=>{e.preventDefault();focus="pulp";history=["pulp"];mode="explore";relation="all";enabledTypes=new Set(types);shownLimit=12;renderDomains();updateViewButtons();changeRelation("all");showNode("pulp")});
    $("exploreMode").addEventListener("click",()=>changeMode("explore"));
    $("overviewMode").addEventListener("click",()=>changeMode("overview"));
    document.querySelectorAll(".filter-chip").forEach(b=>b.addEventListener("click",()=>changeRelation(b.dataset.rel)));
    $("domainToggle").addEventListener("click",()=>{const m=$("domainMenu");m.hidden=!m.hidden;$("domainToggle").setAttribute("aria-expanded",String(!m.hidden));});
    $("domainMenu").addEventListener("change",e=>{
      if(!e.target.matches("[data-domain]"))return;
      const t=e.target.dataset.domain;
      if(e.target.checked)enabledTypes.add(t);else enabledTypes.delete(t);
      renderDomains();renderGraph();
    });
    $("domainMenu").addEventListener("click",e=>{
      const btn=e.target.closest("[data-domains]");if(!btn)return;
      enabledTypes=new Set(btn.dataset.domains==="all"?types:[]);
      renderDomains();renderGraph();
    });
    $("search").addEventListener("input",renderSearch);
    $("search").addEventListener("keydown",e=>{
      if(e.key==="Enter"&&searchMatches.length){navigateTo(searchMatches[0].id);$("search").value="";renderSearch();$("search").blur();}
      if(e.key==="Escape"){$("search").value="";renderSearch();$("search").blur();}
    });
    $("searchResults").addEventListener("click",e=>{
      const b=e.target.closest("[data-search-id]");if(!b)return;
      navigateTo(b.dataset.searchId);$("search").value="";renderSearch();$("search").blur();
    });
    $("pathList").addEventListener("click",e=>{
      const b=e.target.closest("[data-path]");if(!b)return;
      const idx=Number(b.dataset.path), id=history[idx];
      history=history.slice(0,idx+1);navigateTo(id,true);
    });
    $("detailContent").addEventListener("click",e=>{
      const b=e.target.closest("[data-action],[data-focus],[data-node],[data-video]");if(!b)return;
      if(b.dataset.focus)navigateTo(b.dataset.focus);
      else if(b.dataset.node)showNode(b.dataset.node);
      else if(b.dataset.action==="close")setPanelOpen(false);
      else if(b.dataset.action==="more"){shownLimit+=8;renderGraph();showNode(focus);}
      else if(b.dataset.video){
        const id=b.dataset.video;
        if(!/^[A-Za-z0-9_-]{11}$/.test(id))return;
        const slot=$("mediaSlot");
        slot.innerHTML='<div class="video-frame"><iframe src="https://www.youtube-nocookie.com/embed/'+id+'?rel=0" title="Video YouTube incorporato" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>'+sourceLink("https://www.youtube.com/watch?v="+id,"Apri il video su YouTube se l'embed non è disponibile");
      }
    });
    $("zoomIn").addEventListener("click",()=>cy?.zoom({level:Math.min(cy.zoom()*1.25,2.2),renderedPosition:{x:cy.width()/2,y:cy.height()/2}}));
    $("zoomOut").addEventListener("click",()=>cy?.zoom({level:Math.max(cy.zoom()/1.25,.17),renderedPosition:{x:cy.width()/2,y:cy.height()/2}}));
    $("fitGraph").addEventListener("click",()=>cy?.fit(cy.elements(),90));
    $("dismissHint").addEventListener("click",()=>$("mapHint").hidden=true);
    $("helpBtn").addEventListener("click",()=>$("helpDialog").showModal());
    $("closeHelp").addEventListener("click",()=>$("helpDialog").close());
    $("startExploring").addEventListener("click",()=>$("helpDialog").close());
    document.addEventListener("click",e=>{
      if(!e.target.closest(".filter-more-wrap")){$("domainMenu").hidden=true;$("domainToggle").setAttribute("aria-expanded","false");}
      if(!e.target.closest(".search-wrap"))$("searchResults").hidden=true;
    });
    document.addEventListener("keydown",e=>{
      if(e.key==="/" && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)){e.preventDefault();$("search").focus();}
      if(e.key==="Escape"&&document.activeElement!==$("search")&&!$("helpDialog").open)setPanelOpen(false);
    });
    window.addEventListener("resize",()=>{if(cy)cy.resize()});
  }
  initGraph();
  bindUi();
  renderDomains();
  renderGraph();
  showNode("pulp");
  imageLoadPromise=preloadNodeImages();
})();