import assert from "node:assert/strict";
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const browser=await chromium.launch({headless:true});
const failures=[];
await mkdir("test-results",{recursive:true});
const page=await browser.newPage({viewport:{width:1440,height:940},deviceScaleFactor:1});
page.on("pageerror",e=>failures.push(e.message));
const movement=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);

try {
  await page.goto("http://127.0.0.1:8765/?debug=1",{waitUntil:"domcontentloaded",timeout:45000});
  await page.waitForFunction(()=>window.__pulpAtlasDebug?.state().nodes>0,null,{timeout:45000});
  await page.waitForTimeout(1200);
  const first=await page.evaluate(()=>({
    state:window.__pulpAtlasDebug.state(),
    count:window.ATLAS.nodes.length,
    links:window.ATLAS.links.length,
    pulp:window.__pulpAtlasDebug.screenPosition("pulp"),
    rect:(()=>{const r=document.querySelector("#graph").getBoundingClientRect();return{x:r.left,y:r.top,w:r.width,h:r.height};})()
  }));
  assert(first.state.simulation,"Physics engine not initialized");
  assert.equal(first.state.nodes,first.count,"One complete map must show the full dataset");
  assert.equal(first.state.edges,first.links,"All sourced connections must render");
  assert(first.count>75 && first.links>100,"Expanded dataset missing");
  assert(Math.abs(first.pulp.x-first.rect.w/2)<35,"Initial Pulp Fiction not centered horizontally");
  assert(Math.abs(first.pulp.y-first.rect.h/2)<35,"Initial Pulp Fiction not centered vertically");
  assert.equal(await page.locator("#exploreMode,#overviewMode").count(),0,"Legacy mode toggle still present");
  await page.screenshot({path:"test-results/full-map.png"});

  // Search uses the same navigation method as clicking a node.
  await page.fill("#search","Misirlou");
  await page.locator('[data-search-id="misirlou"]').click();
  await page.waitForTimeout(1050);
  const centered=await page.evaluate(()=>({
    state:window.__pulpAtlasDebug.state(),
    pos:window.__pulpAtlasDebug.screenPosition("misirlou"),
    rect:(()=>{const r=document.querySelector("#graph").getBoundingClientRect();return{x:r.left,y:r.top,w:r.width,h:r.height};})()
  }));
  assert.equal(centered.state.focus,"misirlou","Selected node must become the new focus");
  assert.equal(centered.state.nodes,first.count,"Focusing must not hide unrelated nodes");
  assert(Math.abs(centered.pos.x-centered.rect.w/2)<40,"Selected node not at canvas horizontal center");
  assert(Math.abs(centered.pos.y-centered.rect.h/2)<40,"Selected node not at canvas vertical center");
  await page.screenshot({path:"test-results/centered-node.png"});

  const before=await page.evaluate(()=>({
    node:window.__pulpAtlasDebug.position("misirlou"),
    neighbor:window.__pulpAtlasDebug.position("dickdale"),
    position:(()=>{const pos=window.__pulpAtlasDebug.screenPosition("misirlou"),
      r=document.querySelector("#graph").getBoundingClientRect();
      return {x:r.left+pos.x,y:r.top+pos.y};})()
  }));
  await page.mouse.move(before.position.x,before.position.y);
  await page.mouse.down();
  await page.mouse.move(before.position.x+110,before.position.y+80,{steps:17});
  await page.waitForTimeout(320);
  const held=await page.evaluate(()=>({
    node:window.__pulpAtlasDebug.position("misirlou"),
    neighbor:window.__pulpAtlasDebug.position("dickdale")
  }));
  await page.mouse.up();
  const dragDistance=movement(before.node,held.node);
  const neighborDistance=movement(before.neighbor,held.neighbor);
  assert(dragDistance>20,"Dragged node did not move");
  assert(neighborDistance>1,"Adjacent node did not react to elastic drag");
  await page.screenshot({path:"test-results/elastic-drag.png"});

  await page.setViewportSize({width:390,height:844});
  await page.waitForTimeout(300);
  await page.screenshot({path:"test-results/mobile-map.png"});
  const loadedImages=await page.evaluate(()=>window.__pulpAtlasDebug.state().loadedImages);
  const missingImages=await page.evaluate(()=>window.__pulpAtlasDebug.missingImages());
  console.log(JSON.stringify({nodes:first.count,links:first.links,
    initialCentered:true,focusCentered:true,dragDistance,neighborDistance,
    loadedImages,missingImages:missingImages.length}));
  assert.deepEqual(failures,[],"Browser errors: "+failures.join("; "));
} finally {
  await browser.close();
}
