const pageState = new Map();
const pendingCookies = new Map();

function headersToObject(headers=[]) { const out={}; for (const h of headers) { if(!h||!h.name) continue; const k=h.name.toLowerCase(),v=h.value??""; out[k]=out[k]===undefined?v:out[k]+", "+v; } return out; }
function parseCacheControl(value="") { const out={}; for(const raw of value.split(",")){ const part=raw.trim(); if(!part) continue; const eq=part.indexOf("="); if(eq===-1) out[part.toLowerCase()]=true; else { const k=part.slice(0,eq).trim().toLowerCase(); let v=part.slice(eq+1).trim().replace(/^"|"$/g,""); out[k]=v; }} return out; }
function intOrNull(v){ if(v===undefined||v===null||v==="") return null; const n=parseInt(v,10); return Number.isFinite(n)?n:null; }
function cookieNames(header=""){ return header.split(";").map(p=>p.trim().split("=")[0]).filter(Boolean); }
function classifyWpCookies(names){
 const lower=names.map(n=>n.toLowerCase());
 const hasLoggedIn=lower.some(n=>n==="wordpress_logged_in"||n.startsWith("wordpress_logged_in_"));
 const hasTest=lower.includes("wordpress_test_cookie");
 const wordpressRelated=names.filter(n=>/^wordpress([_-]|$)/i.test(n)||/^wp-settings/i.test(n)||n.toLowerCase()==="wp_lang");
 return {hasLoggedIn,hasTest,wordpressRelated,all:names};
}
function explainPassWhy(xPassWhy, cookies){
 const why=(xPassWhy||"").toLowerCase();
 if(why!=="logged-in") return xPassWhy||"";
 if(cookies.hasLoggedIn) return "WP Engine: logged-in. wordpress_logged_in_* is on this request.";
 if(cookies.hasTest) return "WP Engine: logged-in. No wordpress_logged_in_* cookie. wordpress_test_cookie is present (login capability check, not authentication).";
 if(cookies.wordpressRelated.length) return `WP Engine: logged-in, but no wordpress_logged_in_* cookie. WordPress-related cookies seen: ${cookies.wordpressRelated.join(", ")}. User may not actually be authenticated.`;
 return "WP Engine: logged-in, but no wordpress_logged_in_* cookie was on this request. User may not actually be authenticated.";
}
function derive(headers,statusCode,url,fromCache,cookieHeader=""){
 const ccRaw=headers['cache-control']||'', cc=parseCacheControl(ccRaw), age=intOrNull(headers.age);
 let ttl=intOrNull(cc['s-maxage']); if(ttl===null) ttl=intOrNull(cc['max-age']);
 const remaining=(ttl!==null&&age!==null)?Math.max(0,ttl-age):null;
 const xCache=headers['x-cache']||'', xCacheStatus=headers['x-cache-status']||'', cfCache=headers['cf-cache-status']||'', xPassWhy=headers['x-pass-why']||'', server=headers.server||'';
 const cookies=classifyWpCookies(cookieNames(cookieHeader));
 let status='UNKNOWN', layer='HTTP cache', reason=''; const joined=`${xCache} ${xCacheStatus}`.toUpperCase();
 if(/\bHIT\b/.test(joined)){status='HIT';layer='WP Engine / reverse proxy';}
 else if(/\bMISS\b/.test(joined)){status='MISS';layer='WP Engine / reverse proxy';}
 else if(/\bBYPASS\b|\bPASS\b/.test(joined)){status='BYPASS';layer='WP Engine / reverse proxy';}
 else if(cfCache){ const cf=cfCache.toUpperCase(); if(['HIT','MISS','BYPASS','DYNAMIC','EXPIRED','REVALIDATED','STALE','UPDATING'].includes(cf)){status=cf;layer='Cloudflare edge';}}
 else if(fromCache){status='BROWSER';layer='Browser cache';}
 else if(age!==null&&age>0){status='HIT';}
 if(xPassWhy) reason=explainPassWhy(xPassWhy,cookies); else if(cc.private) reason='Cache-Control: private'; else if(cc['no-store']) reason='Cache-Control: no-store'; else if(cc['no-cache']) reason='Cache-Control: no-cache';
 const isWpEngine=!!xPassWhy||/\bWPEngine\b/i.test(server)||/\bWP\s*Engine\b/i.test(server)||!!xCache||Object.keys(headers).some(k=>k.startsWith('x-wpe'));
 return {url,statusCode,capturedAt:Date.now(),status,layer,isWpEngine,age,ttl,remaining,reason,fromCache:!!fromCache,cacheControl:ccRaw,cookies:{hasLoggedIn:cookies.hasLoggedIn,hasTestCookie:cookies.hasTest,wordpressRelated:cookies.wordpressRelated},headers:{'x-cache':xCache,'x-cache-status':xCacheStatus,'x-pass-why':xPassWhy,'age':headers.age||'','cache-control':ccRaw,'cf-cache-status':cfCache,'server':server,'via':headers.via||'','vary':headers.vary||'','etag':headers.etag||'','last-modified':headers['last-modified']||'','expires':headers.expires||'','x-wpe-request-id':headers['x-wpe-request-id']||''}};
}
function badgeFor(status){ return ({HIT:'HIT',MISS:'MISS',BYPASS:'BYP',BROWSER:'LOCAL',DYNAMIC:'DYN',STALE:'STL',EXPIRED:'EXP',REVALIDATED:'REVAL',UPDATING:'UPD'})[status]||'?'; }

chrome.webRequest.onBeforeSendHeaders.addListener((details)=>{
 if(details.type!=='main_frame'||details.tabId<0)return;
 const headers=headersToObject(details.requestHeaders);
 pendingCookies.set(details.requestId,headers.cookie||'');
},{urls:['<all_urls>'],types:['main_frame']},['requestHeaders','extraHeaders']);

chrome.webRequest.onHeadersReceived.addListener((details)=>{
 if(details.type!=='main_frame'||details.tabId<0)return;
 const cookieHeader=pendingCookies.get(details.requestId)||'';
 pendingCookies.delete(details.requestId);
 const data=derive(headersToObject(details.responseHeaders),details.statusCode,details.url,details.fromCache,cookieHeader);
 pageState.set(details.tabId,data);
 chrome.storage.session.set({[`tab_${details.tabId}`]:data}).catch(()=>{});
 chrome.action.setBadgeText({tabId:details.tabId,text:badgeFor(data.status)});
 chrome.action.setTitle({tabId:details.tabId,title:`WP Engine Cache Inspector: ${data.status}${data.remaining!==null?` • ${data.remaining}s remaining`:''}`});
},{urls:['<all_urls>'],types:['main_frame']},['responseHeaders','extraHeaders']);

chrome.webRequest.onErrorOccurred.addListener((details)=>{ pendingCookies.delete(details.requestId); },{urls:['<all_urls>'],types:['main_frame']});
chrome.tabs.onRemoved.addListener((tabId)=>{pageState.delete(tabId);chrome.storage.session.remove(`tab_${tabId}`).catch(()=>{});});
chrome.tabs.onUpdated.addListener((tabId,changeInfo)=>{if(changeInfo.status==='loading')chrome.action.setBadgeText({tabId,text:'…'});});
