import{w as N,ay as ye,R as ze,g as j,n as W,k,c as h,h as g,m as E,az as ge,aA as Se,aB as qe,A as _e,j as M,L as Ce,Y as we,Z as L,_ as D,a4 as Z,a2 as H,F,$,K as ue,aC as ke,aD as Be,r as q,i as Me,al as Ee,ad as Ae,a as Pe,M as Te,o as Oe,W as Le,C as G,aE as J,aF as ee}from"./index.5e1d1145.js";import{a as x,u as I}from"./QPage.6924035d.js";import{Q as te,a as Qe}from"./QResizeObserver.b28b9c55.js";const Fe={modelValue:{type:Boolean,default:null},"onUpdate:modelValue":[Function,Array]},xe=["before-show","show","before-hide","hide"];function Ie({showing:t,canShow:l,hideOnRouteChange:n,handleShow:c,handleHide:e,processOnMount:r}){const i=j(),{props:a,emit:v,proxy:s}=i;let b;function z(d){t.value===!0?S(d):y(d)}function y(d){if(a.disable===!0||d!==void 0&&d.qAnchorHandled===!0||l!==void 0&&l(d)!==!0)return;const f=a["onUpdate:modelValue"]!==void 0;f===!0&&(v("update:modelValue",!0),b=d,W(()=>{b===d&&(b=void 0)})),(a.modelValue===null||f===!1)&&p(d)}function p(d){t.value!==!0&&(t.value=!0,v("before-show",d),c!==void 0?c(d):v("show",d))}function S(d){if(a.disable===!0)return;const f=a["onUpdate:modelValue"]!==void 0;f===!0&&(v("update:modelValue",!1),b=d,W(()=>{b===d&&(b=void 0)})),(a.modelValue===null||f===!1)&&_(d)}function _(d){t.value!==!1&&(t.value=!1,v("before-hide",d),e!==void 0?e(d):v("hide",d))}function B(d){a.disable===!0&&d===!0?a["onUpdate:modelValue"]!==void 0&&v("update:modelValue",!1):d===!0!==t.value&&(d===!0?p:_)(b)}N(()=>a.modelValue,B),n!==void 0&&ye(i)===!0&&N(()=>s.$route.fullPath,()=>{n.value===!0&&t.value===!0&&S()}),r===!0&&ze(()=>{B(a.modelValue)});const C={show:y,hide:S,toggle:z};return Object.assign(s,C),C}var Ue=k({name:"QCardSection",props:{tag:{type:String,default:"div"},horizontal:Boolean},setup(t,{slots:l}){const n=h(()=>`q-card__section q-card__section--${t.horizontal===!0?"horiz row no-wrap":"vert"}`);return()=>g(t.tag,{class:n.value},E(l.default))}}),Ye=k({name:"QCardActions",props:{...ge,vertical:Boolean},setup(t,{slots:l}){const n=Se(t),c=h(()=>`q-card__actions ${n.value} q-card__actions--${t.vertical===!0?"vert column":"horiz row"}`);return()=>g("div",{class:c.value},E(l.default))}});const U={left:!0,right:!0,up:!0,down:!0,horizontal:!0,vertical:!0},je=Object.keys(U);U.all=!0;function ae(t){const l={};for(const n of je)t[n]===!0&&(l[n]=!0);return Object.keys(l).length===0?U:(l.horizontal===!0?l.left=l.right=!0:l.left===!0&&l.right===!0&&(l.horizontal=!0),l.vertical===!0?l.up=l.down=!0:l.up===!0&&l.down===!0&&(l.vertical=!0),l.horizontal===!0&&l.vertical===!0&&(l.all=!0),l)}function le(t,l){return l.event===void 0&&t.target!==void 0&&t.target.draggable!==!0&&typeof l.handler=="function"&&t.target.nodeName.toUpperCase()!=="INPUT"&&(t.qClonedBy===void 0||t.qClonedBy.indexOf(l.uid)===-1)}function De(){if(window.getSelection!==void 0){const t=window.getSelection();t.empty!==void 0?t.empty():t.removeAllRanges!==void 0&&(t.removeAllRanges(),qe.is.mobile!==!0&&t.addRange(document.createRange()))}else document.selection!==void 0&&document.selection.empty()}function V(t,l,n){const c=F(t);let e,r=c.left-l.event.x,i=c.top-l.event.y,a=Math.abs(r),v=Math.abs(i);const s=l.direction;s.horizontal===!0&&s.vertical!==!0?e=r<0?"left":"right":s.horizontal!==!0&&s.vertical===!0?e=i<0?"up":"down":s.up===!0&&i<0?(e="up",a>v&&(s.left===!0&&r<0?e="left":s.right===!0&&r>0&&(e="right"))):s.down===!0&&i>0?(e="down",a>v&&(s.left===!0&&r<0?e="left":s.right===!0&&r>0&&(e="right"))):s.left===!0&&r<0?(e="left",a<v&&(s.up===!0&&i<0?e="up":s.down===!0&&i>0&&(e="down"))):s.right===!0&&r>0&&(e="right",a<v&&(s.up===!0&&i<0?e="up":s.down===!0&&i>0&&(e="down")));let b=!1;if(e===void 0&&n===!1){if(l.event.isFirst===!0||l.event.lastDir===void 0)return{};e=l.event.lastDir,b=!0,e==="left"||e==="right"?(c.left-=r,a=0,r=0):(c.top-=i,v=0,i=0)}return{synthetic:b,payload:{evt:t,touch:l.event.mouse!==!0,mouse:l.event.mouse===!0,position:c,direction:e,isFirst:l.event.isFirst,isFinal:n===!0,duration:Date.now()-l.event.time,distance:{x:a,y:v},offset:{x:r,y:i},delta:{x:c.left-l.event.lastX,y:c.top-l.event.lastY}}}}let He=0;var re=_e({name:"touch-pan",beforeMount(t,{value:l,modifiers:n}){if(n.mouse!==!0&&M.has.touch!==!0)return;function c(r,i){n.mouse===!0&&i===!0?ue(r):(n.stop===!0&&H(r),n.prevent===!0&&Z(r))}const e={uid:"qvtp_"+He++,handler:l,modifiers:n,direction:ae(n),noop:Ce,mouseStart(r){le(r,e)&&we(r)&&(L(e,"temp",[[document,"mousemove","move","notPassiveCapture"],[document,"mouseup","end","passiveCapture"]]),e.start(r,!0))},touchStart(r){if(le(r,e)){const i=r.target;L(e,"temp",[[i,"touchmove","move","notPassiveCapture"],[i,"touchcancel","end","passiveCapture"],[i,"touchend","end","passiveCapture"]]),e.start(r)}},start(r,i){if(M.is.firefox===!0&&D(t,!0),e.lastEvt=r,i===!0||n.stop===!0){if(e.direction.all!==!0&&(i!==!0||e.modifiers.mouseAllDir!==!0&&e.modifiers.mousealldir!==!0)){const s=r.type.indexOf("mouse")>-1?new MouseEvent(r.type,r):new TouchEvent(r.type,r);r.defaultPrevented===!0&&Z(s),r.cancelBubble===!0&&H(s),Object.assign(s,{qKeyEvent:r.qKeyEvent,qClickOutside:r.qClickOutside,qAnchorHandled:r.qAnchorHandled,qClonedBy:r.qClonedBy===void 0?[e.uid]:r.qClonedBy.concat(e.uid)}),e.initialEvent={target:r.target,event:s}}H(r)}const{left:a,top:v}=F(r);e.event={x:a,y:v,time:Date.now(),mouse:i===!0,detected:!1,isFirst:!0,isFinal:!1,lastX:a,lastY:v}},move(r){if(e.event===void 0)return;const i=F(r),a=i.left-e.event.x,v=i.top-e.event.y;if(a===0&&v===0)return;e.lastEvt=r;const s=e.event.mouse===!0,b=()=>{c(r,s);let p;n.preserveCursor!==!0&&n.preservecursor!==!0&&(p=document.documentElement.style.cursor||"",document.documentElement.style.cursor="grabbing"),s===!0&&document.body.classList.add("no-pointer-events--children"),document.body.classList.add("non-selectable"),De(),e.styleCleanup=S=>{if(e.styleCleanup=void 0,p!==void 0&&(document.documentElement.style.cursor=p),document.body.classList.remove("non-selectable"),s===!0){const _=()=>{document.body.classList.remove("no-pointer-events--children")};S!==void 0?setTimeout(()=>{_(),S()},50):_()}else S!==void 0&&S()}};if(e.event.detected===!0){e.event.isFirst!==!0&&c(r,e.event.mouse);const{payload:p,synthetic:S}=V(r,e,!1);p!==void 0&&(e.handler(p)===!1?e.end(r):(e.styleCleanup===void 0&&e.event.isFirst===!0&&b(),e.event.lastX=p.position.left,e.event.lastY=p.position.top,e.event.lastDir=S===!0?void 0:p.direction,e.event.isFirst=!1));return}if(e.direction.all===!0||s===!0&&(e.modifiers.mouseAllDir===!0||e.modifiers.mousealldir===!0)){b(),e.event.detected=!0,e.move(r);return}const z=Math.abs(a),y=Math.abs(v);z!==y&&(e.direction.horizontal===!0&&z>y||e.direction.vertical===!0&&z<y||e.direction.up===!0&&z<y&&v<0||e.direction.down===!0&&z<y&&v>0||e.direction.left===!0&&z>y&&a<0||e.direction.right===!0&&z>y&&a>0?(e.event.detected=!0,e.move(r)):e.end(r,!0))},end(r,i){if(e.event!==void 0){if($(e,"temp"),M.is.firefox===!0&&D(t,!1),i===!0)e.styleCleanup!==void 0&&e.styleCleanup(),e.event.detected!==!0&&e.initialEvent!==void 0&&e.initialEvent.target.dispatchEvent(e.initialEvent.event);else if(e.event.detected===!0){e.event.isFirst===!0&&e.handler(V(r===void 0?e.lastEvt:r,e).payload);const{payload:a}=V(r===void 0?e.lastEvt:r,e,!0),v=()=>{e.handler(a)};e.styleCleanup!==void 0?e.styleCleanup(v):v()}e.event=void 0,e.initialEvent=void 0,e.lastEvt=void 0}}};if(t.__qtouchpan=e,n.mouse===!0){const r=n.mouseCapture===!0||n.mousecapture===!0?"Capture":"";L(e,"main",[[t,"mousedown","mouseStart",`passive${r}`]])}M.has.touch===!0&&L(e,"main",[[t,"touchstart","touchStart",`passive${n.capture===!0?"Capture":""}`],[t,"touchmove","noop","notPassiveCapture"]])},updated(t,l){const n=t.__qtouchpan;n!==void 0&&(l.oldValue!==l.value&&(typeof value!="function"&&n.end(),n.handler=l.value),n.direction=ae(l.modifiers))},beforeUnmount(t){const l=t.__qtouchpan;l!==void 0&&(l.event!==void 0&&l.end(),$(l,"main"),$(l,"temp"),M.is.firefox===!0&&D(t,!1),l.styleCleanup!==void 0&&l.styleCleanup(),delete t.__qtouchpan)}});function Q(t,l,n){return n<=l?l:Math.min(n,Math.max(l,t))}function Ke(t,l,n){if(n<=l)return l;const c=n-l+1;let e=l+(t-l)%c;return e<l&&(e=c+e),e===0?0:e}var Xe=k({name:"QItem",props:{...x,...ke,tag:{type:String,default:"div"},active:{type:Boolean,default:null},clickable:Boolean,dense:Boolean,insetLevel:Number,tabindex:[String,Number],focused:Boolean,manualFocus:Boolean},emits:["click","keyup"],setup(t,{slots:l,emit:n}){const{proxy:{$q:c}}=j(),e=I(t,c),{hasLink:r,linkAttrs:i,linkClass:a,linkTag:v,navigateOnClick:s}=Be(),b=q(null),z=q(null),y=h(()=>t.clickable===!0||r.value===!0||t.tag==="label"),p=h(()=>t.disable!==!0&&y.value===!0),S=h(()=>"q-item q-item-type row no-wrap"+(t.dense===!0?" q-item--dense":"")+(e.value===!0?" q-item--dark":"")+(r.value===!0&&t.active===null?a.value:t.active===!0?` q-item--active${t.activeClass!==void 0?` ${t.activeClass}`:""}`:"")+(t.disable===!0?" disabled":"")+(p.value===!0?" q-item--clickable q-link cursor-pointer "+(t.manualFocus===!0?"q-manual-focusable":"q-focusable q-hoverable")+(t.focused===!0?" q-manual-focusable--focused":""):"")),_=h(()=>{if(t.insetLevel===void 0)return null;const f=c.lang.rtl===!0?"Right":"Left";return{["padding"+f]:16+t.insetLevel*56+"px"}});function B(f){p.value===!0&&(z.value!==null&&(f.qKeyEvent!==!0&&document.activeElement===b.value?z.value.focus():document.activeElement===z.value&&b.value.focus()),s(f))}function C(f){if(p.value===!0&&Me(f,13)===!0){ue(f),f.qKeyEvent=!0;const A=new MouseEvent("click",f);A.qKeyEvent=!0,b.value.dispatchEvent(A)}n("keyup",f)}function d(){const f=Ee(l.default,[]);return p.value===!0&&f.unshift(g("div",{class:"q-focus-helper",tabindex:-1,ref:z})),f}return()=>{const f={ref:b,class:S.value,style:_.value,onClick:B,onKeyup:C};return p.value===!0?(f.tabindex=t.tabindex||"0",Object.assign(f,i.value)):y.value===!0&&(f["aria-disabled"]="true"),g(v.value,f,d())}}}),Ne=k({name:"QItemSection",props:{avatar:Boolean,thumbnail:Boolean,side:Boolean,top:Boolean,noWrap:Boolean},setup(t,{slots:l}){const n=h(()=>`q-item__section column q-item__section--${t.avatar===!0||t.side===!0||t.thumbnail===!0?"side":"main"}`+(t.top===!0?" q-item__section--top justify-start":" justify-center")+(t.avatar===!0?" q-item__section--avatar":"")+(t.thumbnail===!0?" q-item__section--thumbnail":"")+(t.noWrap===!0?" q-item__section--nowrap":""));return()=>g("div",{class:n.value},E(l.default))}}),We=k({name:"QItemLabel",props:{overline:Boolean,caption:Boolean,header:Boolean,lines:[Number,String]},setup(t,{slots:l}){const n=h(()=>parseInt(t.lines,10)),c=h(()=>"q-item__label"+(t.overline===!0?" q-item__label--overline text-overline":"")+(t.caption===!0?" q-item__label--caption text-caption":"")+(t.header===!0?" q-item__label--header":"")+(n.value===1?" ellipsis":"")),e=h(()=>t.lines!==void 0&&n.value>1?{overflow:"hidden",display:"-webkit-box","-webkit-box-orient":"vertical","-webkit-line-clamp":n.value}:null);return()=>g("div",{style:e.value,class:c.value},E(l.default))}}),Ze=k({name:"QList",props:{...x,bordered:Boolean,dense:Boolean,separator:Boolean,padding:Boolean},setup(t,{slots:l}){const n=j(),c=I(t,n.proxy.$q),e=h(()=>"q-list"+(t.bordered===!0?" q-list--bordered":"")+(t.dense===!0?" q-list--dense":"")+(t.separator===!0?" q-list--separator":"")+(c.value===!0?" q-list--dark":"")+(t.padding===!0?" q-list--padding":""));return()=>g("div",{class:e.value},E(l.default))}});const oe=["vertical","horizontal"],R={vertical:{offset:"offsetY",scroll:"scrollTop",dir:"down",dist:"y"},horizontal:{offset:"offsetX",scroll:"scrollLeft",dir:"right",dist:"x"}},ie={prevent:!0,mouse:!0,mouseAllDir:!0},ne=t=>t>=250?50:Math.ceil(t/5);var Ge=k({name:"QScrollArea",props:{...x,thumbStyle:Object,verticalThumbStyle:Object,horizontalThumbStyle:Object,barStyle:[Array,String,Object],verticalBarStyle:[Array,String,Object],horizontalBarStyle:[Array,String,Object],contentStyle:[Array,String,Object],contentActiveStyle:[Array,String,Object],delay:{type:[String,Number],default:1e3},visible:{type:Boolean,default:null},tabindex:[String,Number],onScroll:Function},setup(t,{slots:l,emit:n}){const c=q(!1),e=q(!1),r=q(!1),i={vertical:q(0),horizontal:q(0)},a={vertical:{ref:q(null),position:q(0),size:q(0)},horizontal:{ref:q(null),position:q(0),size:q(0)}},{proxy:v}=j(),s=I(t,v.$q);let b,z;const y=q(null),p=h(()=>"q-scrollarea"+(s.value===!0?" q-scrollarea--dark":""));a.vertical.percentage=h(()=>{const o=a.vertical.size.value-i.vertical.value;if(o<=0)return 0;const u=Q(a.vertical.position.value/o,0,1);return Math.round(u*1e4)/1e4}),a.vertical.thumbHidden=h(()=>(t.visible===null?r.value:t.visible)!==!0&&c.value===!1&&e.value===!1||a.vertical.size.value<=i.vertical.value+1),a.vertical.thumbStart=h(()=>a.vertical.percentage.value*(i.vertical.value-a.vertical.thumbSize.value)),a.vertical.thumbSize=h(()=>Math.round(Q(i.vertical.value*i.vertical.value/a.vertical.size.value,ne(i.vertical.value),i.vertical.value))),a.vertical.style=h(()=>({...t.thumbStyle,...t.verticalThumbStyle,top:`${a.vertical.thumbStart.value}px`,height:`${a.vertical.thumbSize.value}px`})),a.vertical.thumbClass=h(()=>"q-scrollarea__thumb q-scrollarea__thumb--v absolute-right"+(a.vertical.thumbHidden.value===!0?" q-scrollarea__thumb--invisible":"")),a.vertical.barClass=h(()=>"q-scrollarea__bar q-scrollarea__bar--v absolute-right"+(a.vertical.thumbHidden.value===!0?" q-scrollarea__bar--invisible":"")),a.horizontal.percentage=h(()=>{const o=a.horizontal.size.value-i.horizontal.value;if(o<=0)return 0;const u=Q(a.horizontal.position.value/o,0,1);return Math.round(u*1e4)/1e4}),a.horizontal.thumbHidden=h(()=>(t.visible===null?r.value:t.visible)!==!0&&c.value===!1&&e.value===!1||a.horizontal.size.value<=i.horizontal.value+1),a.horizontal.thumbStart=h(()=>a.horizontal.percentage.value*(i.horizontal.value-a.horizontal.thumbSize.value)),a.horizontal.thumbSize=h(()=>Math.round(Q(i.horizontal.value*i.horizontal.value/a.horizontal.size.value,ne(i.horizontal.value),i.horizontal.value))),a.horizontal.style=h(()=>({...t.thumbStyle,...t.horizontalThumbStyle,left:`${a.horizontal.thumbStart.value}px`,width:`${a.horizontal.thumbSize.value}px`})),a.horizontal.thumbClass=h(()=>"q-scrollarea__thumb q-scrollarea__thumb--h absolute-bottom"+(a.horizontal.thumbHidden.value===!0?" q-scrollarea__thumb--invisible":"")),a.horizontal.barClass=h(()=>"q-scrollarea__bar q-scrollarea__bar--h absolute-bottom"+(a.horizontal.thumbHidden.value===!0?" q-scrollarea__bar--invisible":""));const S=h(()=>a.vertical.thumbHidden.value===!0&&a.horizontal.thumbHidden.value===!0?t.contentStyle:t.contentActiveStyle),_=[[re,o=>{Y(o,"vertical")},void 0,{vertical:!0,...ie}]],B=[[re,o=>{Y(o,"horizontal")},void 0,{horizontal:!0,...ie}]];function C(){const o={};return oe.forEach(u=>{const m=a[u];o[u+"Position"]=m.position.value,o[u+"Percentage"]=m.percentage.value,o[u+"Size"]=m.size.value,o[u+"ContainerSize"]=i[u].value}),o}const d=Ae(()=>{const o=C();o.ref=v,n("scroll",o)},0);function f(o,u,m){if(oe.includes(o)===!1){console.error("[QScrollArea]: wrong first param of setScrollPosition (vertical/horizontal)");return}(o==="vertical"?J:ee)(y.value,u,m)}function A({height:o,width:u}){let m=!1;i.vertical.value!==o&&(i.vertical.value=o,m=!0),i.horizontal.value!==u&&(i.horizontal.value=u,m=!0),m===!0&&P()}function se({position:o}){let u=!1;a.vertical.position.value!==o.top&&(a.vertical.position.value=o.top,u=!0),a.horizontal.position.value!==o.left&&(a.horizontal.position.value=o.left,u=!0),u===!0&&P()}function ce({height:o,width:u}){a.horizontal.size.value!==u&&(a.horizontal.size.value=u,P()),a.vertical.size.value!==o&&(a.vertical.size.value=o,P())}function Y(o,u){const m=a[u];if(o.isFirst===!0){if(m.thumbHidden.value===!0)return;z=m.position.value,e.value=!0}else if(e.value!==!0)return;o.isFinal===!0&&(e.value=!1);const w=R[u],O=i[u].value,me=(m.size.value-O)/(O-m.thumbSize.value),be=o.distance[w.dist],pe=z+(o.direction===w.dir?1:-1)*be*me;X(pe,u)}function K(o,u){const m=a[u];if(m.thumbHidden.value!==!0){const w=o[R[u].offset];if(w<m.thumbStart.value||w>m.thumbStart.value+m.thumbSize.value){const O=w-m.thumbSize.value/2;X(O/i[u].value*m.size.value,u)}m.ref.value!==null&&m.ref.value.dispatchEvent(new MouseEvent(o.type,o))}}function ve(o){K(o,"vertical")}function de(o){K(o,"horizontal")}function P(){c.value===!0?clearTimeout(b):c.value=!0,b=setTimeout(()=>{c.value=!1},t.delay),t.onScroll!==void 0&&d()}function X(o,u){y.value[R[u].scroll]=o}function fe(){r.value=!0}function he(){r.value=!1}let T=null;return Pe(()=>{T={top:a.vertical.position.value,left:a.horizontal.position.value}}),Te(()=>{if(T===null)return;const o=y.value;o!==null&&(ee(o,T.left),J(o,T.top))}),Oe(d.cancel),Object.assign(v,{getScrollTarget:()=>y.value,getScroll:C,getScrollPosition:()=>({top:a.vertical.position.value,left:a.horizontal.position.value}),getScrollPercentage:()=>({top:a.vertical.percentage.value,left:a.horizontal.percentage.value}),setScrollPosition:f,setScrollPercentage(o,u,m){f(o,u*(a[o].size.value-i[o].value),m)}}),()=>g("div",{class:p.value,onMouseenter:fe,onMouseleave:he},[g("div",{ref:y,class:"q-scrollarea__container scroll relative-position fit hide-scrollbar",tabindex:t.tabindex!==void 0?t.tabindex:void 0},[g("div",{class:"q-scrollarea__content absolute",style:S.value},Le(l.default,[g(te,{debounce:0,onResize:ce})])),g(Qe,{axis:"both",onScroll:se})]),g(te,{debounce:0,onResize:A}),g("div",{class:a.vertical.barClass.value,style:[t.barStyle,t.verticalBarStyle],"aria-hidden":"true",onMousedown:ve}),g("div",{class:a.horizontal.barClass.value,style:[t.barStyle,t.horizontalBarStyle],"aria-hidden":"true",onMousedown:de}),G(g("div",{ref:a.vertical.ref,class:a.vertical.thumbClass.value,style:a.vertical.style.value,"aria-hidden":"true"}),_),G(g("div",{ref:a.horizontal.ref,class:a.horizontal.thumbClass.value,style:a.horizontal.style.value,"aria-hidden":"true"}),B)])}});export{Ue as Q,re as T,xe as a,Ie as b,Ye as c,Q as d,De as e,Ne as f,ae as g,We as h,Xe as i,Ge as j,Ze as k,Ke as n,le as s,Fe as u};