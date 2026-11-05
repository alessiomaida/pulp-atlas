import assert from "node:assert/strict";
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const browser=await chromium.launch({headless:true});
const failures=[];
await mkdir("test-results",{recursive:true});
const page=await browser.newPage({viewport:{width:1440,height:940},deviceScaleFactor:1});
page.on("pageerror",error=>failures.push(error.message));

try {
  await page.goto("http://127.0.0.1:8765/?debug=1",{waitUntil:"domcontentloaded",timeout:45000});
  await page.waitForFunction(()=>window.__pulpAtlasDebug?.state().nodes>0,null,{timeout:45000});
  await page.waitForTimeout(1300);
  const initial=await page.evaluate(()=>window.__pulpAtlasDebug.state());
  assert(initial.simulation,"Force simulation was not initialized");
  assert(initial.nodes>5,"No graph nodes rendered");

  // Overview must display the full dataset, not only one focal neighborhood.
  await page.click("#overviewMode");
  await page.waitForTimeout(1100);
  const overview=await page.evaluate(()=>window.__pulpAtlasDebug.state());
  const datasetCount=await page.evaluate(()=>window.ATLAS.nodes.length);
  assert.equal(overview.nodes,datasetCount,"Overview node count unexpected");
  await page.screenshot({path:"test-results/overview-desktop.png"});

  // Drag the focal node: neighbors must respond while the pointer is held.
  await page.click("#exploreMode");
  await page.waitForTimeout(1200);
  const before=await page.evaluate(()=>({
    pulp:window.__pulpAtlasDebug.position("pulp"),
    neighbor:window.__pulpAtlasDebug.position("misirlou"),
    rendered:(()=>{const pos=window.__pulpAtlasDebug.screenPosition("pulp"),rect=document.querySelector("#graph").getBoundingClientRect();return {x:rect.left+pos.x,y:rect.top+pos.y};})()
  }));
  await page.mouse.move(before.rendered.x,before.rendered.y);
  await page.mouse.down();
  await page.mouse.move(before.rendered.x+108,before.rendered.y+77,{steps:15});
  await page.waitForTimeout(350);
  const held=await page.evaluate(()=>({
    pulp:window.__pulpAtlasDebug.position("pulp"),
    neighbor:window.__pulpAtlasDebug.position("misirlou")
  }));
  await page.mouse.up();
  const movement=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
  assert(movement(before.pulp,held.pulp)>20,"Dragged focal node did not move");
  assert(movement(before.neighbor,held.neighbor)>1,"Neighbor failed to respond elastically");
  await page.screenshot({path:"test-results/drag-desktop.png"});

  // Verify mobile without depending on a second app implementation.
  await page.setViewportSize({width:390,height:844});
  await page.waitForTimeout(300);
  await page.screenshot({path:"test-results/explore-mobile.png"});

  // Remote Wikipedia/Commons may be unavailable; report coverage, don't fail the map.
  const coverage=await page.evaluate(()=>window.__pulpAtlasDebug.state().loadedImages);
  console.log(JSON.stringify({initial,overview,dragMoved:movement(before.pulp,held.pulp),neighborMoved:movement(before.neighbor,held.neighbor),loadedImages:coverage}));
  assert.deepEqual(failures,[],"Page script errors: "+failures.join("; "));
} finally {
  await browser.close();
}
