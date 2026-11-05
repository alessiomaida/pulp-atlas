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
      autoungrabify:true,
      style:[
        {selector:"node",style:{
          "shape":"ellipse","width":68,"height":68,"border-width":2.5,
          "border-color":"data(color)","background-color":"#2a3036",
          "background-image":"data(icon)","background-fit":"contain",
          "background-image-opacity":.95,
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

  function positionsFor(nodes) {
    const p={};
    if(mode==="explore") {
      p[focus]={x:0,y:0};
      const others=nodes.filter(n=>n.id!==focus).sort((a,b)=>
        typeOrder[a.type]-typeOrder[b.type] || a.title.localeCompare(b.title));
      others.forEach((n,i)=>{
        const total=others.length;
        const angle=-Math.PI/2 + i*Math.PI*2/Math.max(total,1);
        const ring=total>10 && i%2===0 ? 270 : 225;
        p[n.id]={x:Math.cos(angle)*ring,y:Math.sin(angle)*ring};
      });
    } else {
      p[focus]={x:0,y:0};
      const groups = Object.groupBy ? Object.groupBy(nodes.filter(n=>n.id!==focus),n=>n.type) : types.reduce((o,t)=>(o[t]=nodes.filter(n=>n.type===t&&n.id!==focus),o),{});
      types.forEach((t,i)=>{
        const group=groups[t]||[];
        if(!group.length)return;
        const a=-Math.PI/2+i*Math.PI*2/types.length,base={x:Math.cos(a)*510,y:Math.sin(a)*510};
        group.forEach((n,j)=>{
          const r=group.length===1?0:80+(j%2)*36,angle=2*Math.PI*j/group.length;
          p[n.id]={x:base.x+r*Math.cos(angle),y:base.y+r*Math.sin(angle)};
        });
      });
    }
    return p;
  }

  function renderGraph() {
    if(!cy)return;
    const {nodes,edges}=currentElements();
    const positions=positionsFor(nodes);
    cy.elements().remove();
    cy.add(nodes.map(n=>({group:"nodes",data:{id:n.id,label:n.title,color:getColor(n.type),icon:icons[n.type]},position:positions[n.id],classes:n.id===focus?"focus":""})));
    cy.add(edges.map(e=>({group:"edges",data:{id:e.id,source:e.source,target:e.target,color:atlas.relations[e.kind].color},classes:e.kind})));
    cy.layout({name:"preset",fit:true,padding:mode==="overview"?80:105,animate:false}).run();
    cy.fit(cy.elements(),mode==="overview"?70:95);
    if(window.innerWidth>900 && !$("detailPanel").classList.contains("closed")) cy.panBy({x:-95,y:0});
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

  async function loadImage(node,box) {
    if(!node.wiki || !box) return;
    if(imageCache.has(node.wiki)){if(imageCache.get(node.wiki))insertImage(box,imageCache.get(node.wiki));return;}
    try{
      const url="https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages&piprop=thumbnail&pithumbsize=720&titles="+encodeURIComponent(decodeURIComponent(node.wiki));
      const response=await fetch(url,{mode:"cors"});
      if(!response.ok)throw Error("Image lookup failed");
      const json=await response.json(),page=Object.values(json.query?.pages||{})[0];
      const src=page?.thumbnail?.source || null;
      imageCache.set(node.wiki,src);
      if(src && box.isConnected && currentSelection?.id===node.id) insertImage(box,src);
    }catch(e){imageCache.set(node.wiki,null);}
  }
  function insertImage(box,src){
    box.innerHTML='<img src="'+escapeHtml(src)+'" alt="Immagine illustrativa" loading="lazy" referrerpolicy="no-referrer"><span class="media-credit">Wikipedia</span>';
    const img=box.querySelector("img");
    img.onerror=()=>{box.innerHTML='<span class="art-fallback">◈</span>';};
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
})();