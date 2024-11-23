import{r as a,c as g,R as v}from"./react.js";import{C as T,a as U,i as k,b as $,c as L,f as N}from"./fullcalendar.js";import{S as W,B as m,D as V,R as F,a as q,b as G,U as H,c as B,s as E}from"./antd.js";(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const c of i.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&r(c)}).observe(document,{childList:!0,subtree:!0});function o(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(n){if(n.ep)return;n.ep=!0;const i=o(n);fetch(n.href,i)}})();var D={exports:{}},y={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var J=a,K=Symbol.for("react.element"),Y=Symbol.for("react.fragment"),Q=Object.prototype.hasOwnProperty,X=J.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,Z={key:!0,ref:!0,__self:!0,__source:!0};function z(e,s,o){var r,n={},i=null,c=null;o!==void 0&&(i=""+o),s.key!==void 0&&(i=""+s.key),s.ref!==void 0&&(c=s.ref);for(r in s)Q.call(s,r)&&!Z.hasOwnProperty(r)&&(n[r]=s[r]);if(e&&e.defaultProps)for(r in s=e.defaultProps,s)n[r]===void 0&&(n[r]=s[r]);return{$$typeof:K,type:e,key:i,ref:c,props:n,_owner:X.current}}y.Fragment=Y;y.jsx=z;y.jsxs=z;D.exports=y;var t=D.exports,_,O=g;_=O.createRoot,O.hydrateRoot;const A=parseInt(String(v.version).split(".")[0]),ee=A<18;class I extends a.Component{constructor(){super(...arguments),this.elRef=a.createRef(),this.isUpdating=!1,this.isUnmounting=!1,this.state={customRenderingMap:new Map},this.requestResize=()=>{this.isUnmounting||(this.cancelResize(),this.resizeId=requestAnimationFrame(()=>{this.doResize()}))}}render(){const s=[];for(const o of this.state.customRenderingMap.values())s.push(v.createElement(te,{key:o.id,customRendering:o}));return v.createElement("div",{ref:this.elRef},s)}componentDidMount(){this.isUnmounting=!1;const s=new T;this.handleCustomRendering=s.handle.bind(s),this.calendar=new U(this.elRef.current,Object.assign(Object.assign({},this.props),{handleCustomRendering:this.handleCustomRendering})),this.calendar.render(),this.calendar.on("_beforeprint",()=>{g.flushSync(()=>{})});let o;s.subscribe(r=>{const n=Date.now(),i=!o;(ee||i||this.isUpdating||this.isUnmounting||n-o<100?M:g.flushSync)(()=>{this.setState({customRenderingMap:r},()=>{o=n,i?this.doResize():this.requestResize()})})})}componentDidUpdate(){this.isUpdating=!0,this.calendar.resetOptions(Object.assign(Object.assign({},this.props),{handleCustomRendering:this.handleCustomRendering})),this.isUpdating=!1}componentWillUnmount(){this.isUnmounting=!0,this.cancelResize(),this.calendar.destroy()}doResize(){this.calendar.updateSize()}cancelResize(){this.resizeId!==void 0&&(cancelAnimationFrame(this.resizeId),this.resizeId=void 0)}getApi(){return this.calendar}}I.act=M;class te extends a.PureComponent{render(){const{customRendering:s}=this.props,{generatorMeta:o}=s,r=typeof o=="function"?o(s.renderProps):o;return g.createPortal(r,s.containerEl)}}function M(e){e()}const S="http://43.134.23.181:9000";async function se(e,s){const{startStr:o,endStr:r}=e,n=new URLSearchParams({startStr:o,endStr:r,teachers:s.join(",")}).toString();return await fetch(`${S}/data?${n}`).then(i=>i.json()).then(i=>{let c=i.data;return c.forEach(d=>{d.title=d.courseName;let u=new Date(Number(d.courseDate));d.start=u.toISOString(),d.end=u.toISOString(),d.allDay=!0}),c}).catch(i=>(console.error("Error:",i),[]))}async function ne(){return await fetch(`${S}/teacher`).then(e=>e.json()).then(e=>e.data).catch(e=>console.error("Error:",e))}const P=a.createContext(void 0),re=({children:e})=>{const[s,o]=a.useState(window.innerWidth),[r,n]=a.useState(window.innerHeight),i=()=>{o(window.innerWidth),n(window.innerHeight)};return a.useLayoutEffect(()=>(window.addEventListener("resize",i),()=>window.removeEventListener("resize",i)),[]),t.jsx(P.Provider,{value:{width:s,height:r},children:e})},b=()=>a.useContext(P),ie=[{label:"month",value:"dayGridMonth"},{label:"week",value:"timeGridWeek"},{label:"day",value:"timeGridDay"}],oe=({calendarApi:e,setTeachers:s})=>{const[o,r]=a.useState("dayGridMonth"),[n,i]=a.useState(!0),[c,d]=a.useState([]),u=b();if(!u)return null;const{width:j}=u;a.useEffect(()=>{(async()=>{const R=(await ne()).map(C=>({label:C,value:C}));d(R)})()},[]);const w=l=>{let x=l.toDate();e.gotoDate(x)},h=({target:{value:l}})=>{e.changeView(l),r(l)},p=()=>{i(!n),e.setOption("weekends",!n)},f=l=>{s(l)};return a.useEffect(()=>{e&&e.gotoDate(new Date(2023,2,1))},[e]),t.jsxs(t.Fragment,{children:[t.jsxs("div",{style:{display:"flex",alignItems:"center",padding:"10px 0px"},children:[t.jsx("span",{style:{marginRight:"10px",minWidth:"120px"},children:"Select lecturers:"}),t.jsx(W,{mode:"multiple",allowClear:!0,style:{width:"100%"},placeholder:"Please select lecturers",onChange:f,options:c})]}),t.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",flexDirection:j>1200?"row":"column"},children:[t.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px"},children:[t.jsx(m,{type:"primary",onClick:()=>e==null?void 0:e.today(),children:"Today"}),t.jsx(V,{onChange:w})]}),t.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px"},children:[t.jsx(m,{type:"primary",shape:"circle",icon:t.jsx(F,{}),onClick:()=>e==null?void 0:e.prev()}),t.jsx("h1",{style:{minWidth:"300px",textAlign:"center"},children:e==null?void 0:e.view.title}),t.jsx(m,{type:"primary",shape:"circle",icon:t.jsx(q,{}),onClick:()=>e==null?void 0:e.next()})]}),t.jsxs("div",{style:{display:"flex",gap:"10px",margin:"12px 0px"},children:[t.jsx(m,{type:n?"primary":"default",onClick:p,children:"weekends"}),t.jsx(G.Group,{options:ie,optionType:"button",buttonStyle:"solid",onChange:h,value:o})]})]})]})},ae=()=>{const e=a.useRef(null),[s,o]=a.useState(null),[r,n]=a.useState([]),[i,c]=a.useState([]);a.useEffect(()=>{var p;let h=(p=e.current)==null?void 0:p.getApi();h&&(o(h),n(h.getEvents()))},[]);const d=b();if(!d)return null;const{width:u}=d,j=h=>{const p=h.event.title,f=h.event.extendedProps,l=ce(p),x=u>1320?"18px":u>660?"14px":"10px",R=u>1320?"14px":u>660?"10px":"8px";return t.jsxs("div",{style:{padding:"4px 8px",backgroundColor:l},children:[t.jsx("i",{style:{fontSize:x,color:"#111",fontWeight:"bold"},children:p}),t.jsxs("div",{style:{fontSize:R,color:"#333",display:"flex",justifyContent:"space-between"},children:[t.jsx("i",{children:f.classroom}),t.jsx("br",{}),t.jsx("i",{children:f.teacher1})]})]})},w=a.useCallback(async(h,p,f)=>{try{let l=await se(h,i);n(l),p(l)}catch(l){f(l)}},[i]);return t.jsxs("div",{className:"demo-app",children:[t.jsx(oe,{calendarApi:s,setTeachers:c}),t.jsx("div",{className:"demo-app-main",children:t.jsx(I,{ref:e,plugins:[k,$,L],headerToolbar:!1,initialView:"dayGridMonth",editable:!0,selectable:!0,selectMirror:!0,dayMaxEvents:!0,events:w,eventContent:j,slotMinTime:"08:00:00",slotMaxTime:"20:00:00",slotDuration:"01:00:00",contentHeight:1500})}),t.jsx(le,{events:r})]})};function ce(e){let s=0;for(let r=0;r<e.length;r++)s=e.charCodeAt(r)+((s<<5)-s);let o="#";for(let r=0;r<3;r++){const n=s>>r*8&255;o+=("00"+n.toString(16)).substr(-2)}return o}const le=({events:e})=>{function s(o){return t.jsxs("li",{children:[t.jsx("b",{children:N(o.start,{year:"numeric",month:"short",day:"numeric"})}),t.jsx("i",{children:o.title})]},o.id)}return t.jsxs("div",{children:[t.jsxs("h2",{children:["All Events (",e.length,")"]}),t.jsx("ul",{children:e.map(s)})]})},de=()=>{const e={accept:".xlsx",action:`${S}/upload`,name:"file",async onChange(s){s.file.status==="done"?E.success(`${s.file.name} file uploaded successfully`):s.file.status==="error"&&E.error(`${s.file.name} file upload failed.`)}};return t.jsx(H,{...e,children:t.jsx(m,{icon:t.jsx(B,{}),children:"Click to Upload"})})},ue=()=>{const e=b();return e?t.jsxs("div",{style:{padding:e.width>660?"0px 24px":"0"},children:[t.jsx("h1",{children:"AI-based Scheduling System"}),t.jsx(de,{}),t.jsx(ae,{})]}):null};_(document.getElementById("root")).render(t.jsx(a.StrictMode,{children:t.jsx(re,{children:t.jsx(ue,{})})}));
