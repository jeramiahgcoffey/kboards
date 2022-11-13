import{c as o,h as f,k as F,m as k,g as q,r as A,ab as L,W as U,aa as J,K as $,aJ as v,S as B,am as W,au as Z}from"./index.6a43cab7.js";const P={dark:{type:Boolean,default:null}};function _(e,l){return o(()=>e.dark===null?l.dark.isActive:e.dark)}let x,b=0;const r=new Array(256);for(let e=0;e<256;e++)r[e]=(e+256).toString(16).substring(1);const G=(()=>{const e=typeof crypto!="undefined"?crypto:typeof window!="undefined"?window.crypto||window.msCrypto:void 0;if(e!==void 0){if(e.randomBytes!==void 0)return e.randomBytes;if(e.getRandomValues!==void 0)return l=>{const t=new Uint8Array(l);return e.getRandomValues(t),t}}return l=>{const t=[];for(let n=l;n>0;n--)t.push(Math.floor(Math.random()*256));return t}})(),w=4096;function ne(){(x===void 0||b+16>w)&&(b=0,x=G(w));const e=Array.prototype.slice.call(x,b,b+=16);return e[6]=e[6]&15|64,e[8]=e[8]&63|128,r[e[0]]+r[e[1]]+r[e[2]]+r[e[3]]+"-"+r[e[4]]+r[e[5]]+"-"+r[e[6]]+r[e[7]]+"-"+r[e[8]]+r[e[9]]+"-"+r[e[10]]+r[e[11]]+r[e[12]]+r[e[13]]+r[e[14]]+r[e[15]]}const X={name:String};function re(e){return o(()=>({type:"hidden",name:e.name,value:e.modelValue}))}function Y(e={}){return(l,t,n)=>{l[t](f("input",{class:"hidden"+(n||""),...e.value}))}}function oe(e){return o(()=>e.name||e.for)}var le=F({name:"QCard",props:{...P,tag:{type:String,default:"div"},square:Boolean,flat:Boolean,bordered:Boolean},setup(e,{slots:l}){const{proxy:{$q:t}}=q(),n=_(e,t),c=o(()=>"q-card"+(n.value===!0?" q-card--dark q-dark":"")+(e.bordered===!0?" q-card--bordered":"")+(e.square===!0?" q-card--square no-border-radius":"")+(e.flat===!0?" q-card--flat no-shadow":""));return()=>f(e.tag,{class:c.value},k(l.default))}});function ee(e,l){const t=A(null),n=o(()=>e.disable===!0?null:f("span",{ref:t,class:"no-outline",tabindex:-1}));function c(s){const u=l.value;s!==void 0&&s.type.indexOf("key")===0?u!==null&&document.activeElement!==u&&u.contains(document.activeElement)===!0&&u.focus():t.value!==null&&(s===void 0||u!==null&&u.contains(s.target)===!0)&&t.value.focus()}return{refocusTargetEl:n,refocusTarget:c}}var te={xs:30,sm:35,md:40,lg:50,xl:60};const ue={...P,...J,...X,modelValue:{required:!0,default:null},val:{},trueValue:{default:!0},falseValue:{default:!1},indeterminateValue:{default:null},checkedIcon:String,uncheckedIcon:String,indeterminateIcon:String,toggleOrder:{type:String,validator:e=>e==="tf"||e==="ft"},toggleIndeterminate:Boolean,label:String,leftLabel:Boolean,color:String,keepColor:Boolean,dense:Boolean,disable:Boolean,tabindex:[String,Number]},se=["update:modelValue"];function ie(e,l){const{props:t,slots:n,emit:c,proxy:s}=q(),{$q:u}=s,h=_(t,u),V=A(null),{refocusTargetEl:C,refocusTarget:E}=ee(t,V),O=L(t,te),g=o(()=>t.val!==void 0&&Array.isArray(t.modelValue)),y=o(()=>{const a=v(t.val);return g.value===!0?t.modelValue.findIndex(d=>v(d)===a):-1}),i=o(()=>g.value===!0?y.value>-1:v(t.modelValue)===v(t.trueValue)),m=o(()=>g.value===!0?y.value===-1:v(t.modelValue)===v(t.falseValue)),S=o(()=>i.value===!1&&m.value===!1),Q=o(()=>t.disable===!0?-1:t.tabindex||0),R=o(()=>`q-${e} cursor-pointer no-outline row inline no-wrap items-center`+(t.disable===!0?" disabled":"")+(h.value===!0?` q-${e}--dark`:"")+(t.dense===!0?` q-${e}--dense`:"")+(t.leftLabel===!0?" reverse":"")),j=o(()=>{const a=i.value===!0?"truthy":m.value===!0?"falsy":"indet",d=t.color!==void 0&&(t.keepColor===!0||(e==="toggle"?i.value===!0:m.value!==!0))?` text-${t.color}`:"";return`q-${e}__inner relative-position non-selectable q-${e}__inner--${a}${d}`}),z=o(()=>{const a={type:"checkbox"};return t.name!==void 0&&Object.assign(a,{"^checked":i.value===!0?"checked":void 0,name:t.name,value:g.value===!0?t.val:t.trueValue}),a}),T=Y(z),K=o(()=>{const a={tabindex:Q.value,role:"checkbox","aria-label":t.label,"aria-checked":S.value===!0?"mixed":i.value===!0?"true":"false"};return t.disable===!0&&(a["aria-disabled"]="true"),a});function p(a){a!==void 0&&($(a),E(a)),t.disable!==!0&&c("update:modelValue",D(),a)}function D(){if(g.value===!0){if(i.value===!0){const a=t.modelValue.slice();return a.splice(y.value,1),a}return t.modelValue.concat([t.val])}if(i.value===!0){if(t.toggleOrder!=="ft"||t.toggleIndeterminate===!1)return t.falseValue}else if(m.value===!0){if(t.toggleOrder==="ft"||t.toggleIndeterminate===!1)return t.trueValue}else return t.toggleOrder!=="ft"?t.trueValue:t.falseValue;return t.indeterminateValue}function H(a){(a.keyCode===13||a.keyCode===32)&&$(a)}function M(a){(a.keyCode===13||a.keyCode===32)&&p(a)}const N=l(i,S);return Object.assign(s,{toggle:p}),()=>{const a=N();t.disable!==!0&&T(a,"unshift",` q-${e}__native absolute q-ma-none q-pa-none`);const d=[f("div",{class:j.value,style:O.value,"aria-hidden":"true"},a)];C.value!==null&&d.push(C.value);const I=t.label!==void 0?U(n.default,[t.label]):k(n.default);return I!==void 0&&d.push(f("div",{class:`q-${e}__label q-anchor--skip`},I)),f("div",{ref:V,class:R.value,...K.value,onClick:p,onKeydown:H,onKeyup:M},d)}}var ce=F({name:"QPage",props:{padding:Boolean,styleFn:Function},setup(e,{slots:l}){const{proxy:{$q:t}}=q(),n=B(W);B(Z,()=>{console.error("QPage needs to be child of QPageContainer")});const c=o(()=>{const u=(n.header.space===!0?n.header.size:0)+(n.footer.space===!0?n.footer.size:0);if(typeof e.styleFn=="function"){const h=n.isContainer.value===!0?n.containerHeight.value:t.screen.height;return e.styleFn(u,h)}return{minHeight:n.isContainer.value===!0?n.containerHeight.value-u+"px":t.screen.height===0?u!==0?`calc(100vh - ${u}px)`:"100vh":t.screen.height-u+"px"}}),s=o(()=>`q-page${e.padding===!0?" q-layout-padding":""}`);return()=>f("main",{class:s.value,style:c.value},k(l.default))}});export{le as Q,P as a,X as b,Y as c,re as d,ne as e,oe as f,ce as g,ue as h,se as i,ie as j,_ as u};
