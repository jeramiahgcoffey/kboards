import{_ as P,i as y,c as R,Q as c,j as q}from"./logo2.f9310ab8.js";import{co as x,an as Q,r as i,s as V,t as I,x as o,cp as k,cn as S,B as s,D as j,E as r,Q as m,z as p,ak as w,N as _,bF as B,bE as z}from"./index.1f856c98.js";import{g as C,Q as N}from"./QPage.498eabf8.js";const U=l=>(B("data-v-3f5cae40"),l=l(),z(),l),A=U(()=>r("div",{class:"row items-center justify-center"},[r("h5",{class:"q-mb-sm"},"Reset Password")],-1)),E={class:"row reverse justify-between"},F={class:"row reverse justify-start"},T={class:"row justify-center items-center q-mr-md"},$={__name:"PasswordResetPage",setup(l){const n=Q(),f=k(),h=S(),d=i(""),u=i(""),g=[e=>e!==null&&e!==""||"Password is required",e=>e.length>=8||"Password must be at least 8 characters"],v=[e=>e!==null&&e!==""||"Please confirm password",e=>e===d.value||"Confirmation must match password"],b=async()=>{const{userId:e,token:a}=f.params;try{await n.resetPassword({userId:e,token:a,password:d.value}),h.push({path:"/login"})}catch(t){console.error(t)}};return(e,a)=>(V(),I(C,{class:"column items-center auth-page",padding:""},{default:o(()=>[s(y,{src:P,height:"100px",width:"350px",class:"q-my-xl q-mr-md"}),s(N,{bordered:"",class:"form-card"},{default:o(()=>[A,s(R,{class:"q-pa-md",onSubmit:j(b,["prevent","stop"])},{default:o(()=>[s(c,{square:"",modelValue:d.value,"onUpdate:modelValue":a[0]||(a[0]=t=>d.value=t),type:"password",label:"Password",rules:g,class:"q-mb-sm"},null,8,["modelValue"]),s(c,{square:"",modelValue:u.value,"onUpdate:modelValue":a[1]||(a[1]=t=>u.value=t),type:"password",label:"Confirm Password",rules:v,class:"q-mb-lg"},null,8,["modelValue"]),r("div",E,[r("div",F,[s(m,{disable:p(n).awaitingResponse,type:"submit",flat:"","text-color":"primary"},{default:o(()=>[w("Reset Password")]),_:1},8,["disable"]),s(m,{disable:p(n).awaitingResponse,"no-caps":"",flat:"",to:"/login"},{default:o(()=>[w("Remember it?")]),_:1},8,["disable"])]),r("div",T,[s(_,{color:"yellow",size:"20px",name:"mdi-weather-sunny"}),s(q,{size:"35px","model-value":e.$q.dark.isActive,"onUpdate:modelValue":e.$q.dark.toggle},null,8,["model-value","onUpdate:modelValue"]),s(_,{color:"purple",size:"18px",name:"mdi-weather-night"})])])]),_:1},8,["onSubmit"])]),_:1})]),_:1}))}};var H=x($,[["__scopeId","data-v-3f5cae40"]]);export{H as default};