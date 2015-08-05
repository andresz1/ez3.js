/**
 * @fileoverview gl-matrix - High performance matrix and vector operations
 * @author Brandon Jones
 * @author Colin MacKenzie IV
 * @version 2.3.0
 */

/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

!function(t,n){if("object"==typeof exports&&"object"==typeof module)module.exports=n();else if("function"==typeof define&&define.amd)define(n);else{var r=n();for(var a in r)("object"==typeof exports?exports:t)[a]=r[a]}}(this,function(){return function(t){function n(a){if(r[a])return r[a].exports;var e=r[a]={exports:{},id:a,loaded:!1};return t[a].call(e.exports,e,e.exports,n),e.loaded=!0,e.exports}var r={};return n.m=t,n.c=r,n.p="",n(0)}([function(t,n,r){n.glMatrix=r(1),n.mat2=r(2),n.mat2d=r(3),n.mat3=r(4),n.mat4=r(5),n.quat=r(6),n.vec2=r(9),n.vec3=r(7),n.vec4=r(8)},function(t,n){var r={};r.EPSILON=1e-6,r.ARRAY_TYPE="undefined"!=typeof Float32Array?Float32Array:Array,r.RANDOM=Math.random,r.setMatrixArrayType=function(t){GLMAT_ARRAY_TYPE=t};var a=Math.PI/180;r.toRadian=function(t){return t*a},t.exports=r},function(t,n,r){var a=r(1),e={};e.create=function(){var t=new a.ARRAY_TYPE(4);return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t},e.clone=function(t){var n=new a.ARRAY_TYPE(4);return n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=t[3],n},e.copy=function(t,n){return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t},e.identity=function(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t},e.transpose=function(t,n){if(t===n){var r=n[1];t[1]=n[2],t[2]=r}else t[0]=n[0],t[1]=n[2],t[2]=n[1],t[3]=n[3];return t},e.invert=function(t,n){var r=n[0],a=n[1],e=n[2],u=n[3],o=r*u-e*a;return o?(o=1/o,t[0]=u*o,t[1]=-a*o,t[2]=-e*o,t[3]=r*o,t):null},e.adjoint=function(t,n){var r=n[0];return t[0]=n[3],t[1]=-n[1],t[2]=-n[2],t[3]=r,t},e.determinant=function(t){return t[0]*t[3]-t[2]*t[1]},e.multiply=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=r[0],c=r[1],f=r[2],s=r[3];return t[0]=a*i+u*c,t[1]=e*i+o*c,t[2]=a*f+u*s,t[3]=e*f+o*s,t},e.mul=e.multiply,e.rotate=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=Math.sin(r),c=Math.cos(r);return t[0]=a*c+u*i,t[1]=e*c+o*i,t[2]=a*-i+u*c,t[3]=e*-i+o*c,t},e.scale=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=r[0],c=r[1];return t[0]=a*i,t[1]=e*i,t[2]=u*c,t[3]=o*c,t},e.fromRotation=function(t,n){var r=Math.sin(n),a=Math.cos(n);return t[0]=a,t[1]=r,t[2]=-r,t[3]=a,t},e.fromScaling=function(t,n){return t[0]=n[0],t[1]=0,t[2]=0,t[3]=n[1],t},e.str=function(t){return"mat2("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+")"},e.frob=function(t){return Math.sqrt(Math.pow(t[0],2)+Math.pow(t[1],2)+Math.pow(t[2],2)+Math.pow(t[3],2))},e.LDU=function(t,n,r,a){return t[2]=a[2]/a[0],r[0]=a[0],r[1]=a[1],r[3]=a[3]-t[2]*r[1],[t,n,r]},t.exports=e},function(t,n,r){var a=r(1),e={};e.create=function(){var t=new a.ARRAY_TYPE(6);return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t[4]=0,t[5]=0,t},e.clone=function(t){var n=new a.ARRAY_TYPE(6);return n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=t[3],n[4]=t[4],n[5]=t[5],n},e.copy=function(t,n){return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t},e.identity=function(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t[4]=0,t[5]=0,t},e.invert=function(t,n){var r=n[0],a=n[1],e=n[2],u=n[3],o=n[4],i=n[5],c=r*u-a*e;return c?(c=1/c,t[0]=u*c,t[1]=-a*c,t[2]=-e*c,t[3]=r*c,t[4]=(e*i-u*o)*c,t[5]=(a*o-r*i)*c,t):null},e.determinant=function(t){return t[0]*t[3]-t[1]*t[2]},e.multiply=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=n[4],c=n[5],f=r[0],s=r[1],h=r[2],M=r[3],l=r[4],v=r[5];return t[0]=a*f+u*s,t[1]=e*f+o*s,t[2]=a*h+u*M,t[3]=e*h+o*M,t[4]=a*l+u*v+i,t[5]=e*l+o*v+c,t},e.mul=e.multiply,e.rotate=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=n[4],c=n[5],f=Math.sin(r),s=Math.cos(r);return t[0]=a*s+u*f,t[1]=e*s+o*f,t[2]=a*-f+u*s,t[3]=e*-f+o*s,t[4]=i,t[5]=c,t},e.scale=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=n[4],c=n[5],f=r[0],s=r[1];return t[0]=a*f,t[1]=e*f,t[2]=u*s,t[3]=o*s,t[4]=i,t[5]=c,t},e.translate=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=n[4],c=n[5],f=r[0],s=r[1];return t[0]=a,t[1]=e,t[2]=u,t[3]=o,t[4]=a*f+u*s+i,t[5]=e*f+o*s+c,t},e.fromRotation=function(t,n){var r=Math.sin(n),a=Math.cos(n);return t[0]=a,t[1]=r,t[2]=-r,t[3]=a,t[4]=0,t[5]=0,t},e.fromScaling=function(t,n){return t[0]=n[0],t[1]=0,t[2]=0,t[3]=n[1],t[4]=0,t[5]=0,t},e.fromTranslation=function(t,n){return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t[4]=n[0],t[5]=n[1],t},e.str=function(t){return"mat2d("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+", "+t[4]+", "+t[5]+")"},e.frob=function(t){return Math.sqrt(Math.pow(t[0],2)+Math.pow(t[1],2)+Math.pow(t[2],2)+Math.pow(t[3],2)+Math.pow(t[4],2)+Math.pow(t[5],2)+1)},t.exports=e},function(t,n,r){var a=r(1),e={};e.create=function(){var t=new a.ARRAY_TYPE(9);return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=1,t[5]=0,t[6]=0,t[7]=0,t[8]=1,t},e.fromMat4=function(t,n){return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[4],t[4]=n[5],t[5]=n[6],t[6]=n[8],t[7]=n[9],t[8]=n[10],t},e.clone=function(t){var n=new a.ARRAY_TYPE(9);return n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=t[3],n[4]=t[4],n[5]=t[5],n[6]=t[6],n[7]=t[7],n[8]=t[8],n},e.copy=function(t,n){return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t},e.identity=function(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=1,t[5]=0,t[6]=0,t[7]=0,t[8]=1,t},e.transpose=function(t,n){if(t===n){var r=n[1],a=n[2],e=n[5];t[1]=n[3],t[2]=n[6],t[3]=r,t[5]=n[7],t[6]=a,t[7]=e}else t[0]=n[0],t[1]=n[3],t[2]=n[6],t[3]=n[1],t[4]=n[4],t[5]=n[7],t[6]=n[2],t[7]=n[5],t[8]=n[8];return t},e.invert=function(t,n){var r=n[0],a=n[1],e=n[2],u=n[3],o=n[4],i=n[5],c=n[6],f=n[7],s=n[8],h=s*o-i*f,M=-s*u+i*c,l=f*u-o*c,v=r*h+a*M+e*l;return v?(v=1/v,t[0]=h*v,t[1]=(-s*a+e*f)*v,t[2]=(i*a-e*o)*v,t[3]=M*v,t[4]=(s*r-e*c)*v,t[5]=(-i*r+e*u)*v,t[6]=l*v,t[7]=(-f*r+a*c)*v,t[8]=(o*r-a*u)*v,t):null},e.adjoint=function(t,n){var r=n[0],a=n[1],e=n[2],u=n[3],o=n[4],i=n[5],c=n[6],f=n[7],s=n[8];return t[0]=o*s-i*f,t[1]=e*f-a*s,t[2]=a*i-e*o,t[3]=i*c-u*s,t[4]=r*s-e*c,t[5]=e*u-r*i,t[6]=u*f-o*c,t[7]=a*c-r*f,t[8]=r*o-a*u,t},e.determinant=function(t){var n=t[0],r=t[1],a=t[2],e=t[3],u=t[4],o=t[5],i=t[6],c=t[7],f=t[8];return n*(f*u-o*c)+r*(-f*e+o*i)+a*(c*e-u*i)},e.multiply=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=n[4],c=n[5],f=n[6],s=n[7],h=n[8],M=r[0],l=r[1],v=r[2],m=r[3],p=r[4],d=r[5],A=r[6],R=r[7],w=r[8];return t[0]=M*a+l*o+v*f,t[1]=M*e+l*i+v*s,t[2]=M*u+l*c+v*h,t[3]=m*a+p*o+d*f,t[4]=m*e+p*i+d*s,t[5]=m*u+p*c+d*h,t[6]=A*a+R*o+w*f,t[7]=A*e+R*i+w*s,t[8]=A*u+R*c+w*h,t},e.mul=e.multiply,e.translate=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=n[4],c=n[5],f=n[6],s=n[7],h=n[8],M=r[0],l=r[1];return t[0]=a,t[1]=e,t[2]=u,t[3]=o,t[4]=i,t[5]=c,t[6]=M*a+l*o+f,t[7]=M*e+l*i+s,t[8]=M*u+l*c+h,t},e.rotate=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=n[4],c=n[5],f=n[6],s=n[7],h=n[8],M=Math.sin(r),l=Math.cos(r);return t[0]=l*a+M*o,t[1]=l*e+M*i,t[2]=l*u+M*c,t[3]=l*o-M*a,t[4]=l*i-M*e,t[5]=l*c-M*u,t[6]=f,t[7]=s,t[8]=h,t},e.scale=function(t,n,r){var a=r[0],e=r[1];return t[0]=a*n[0],t[1]=a*n[1],t[2]=a*n[2],t[3]=e*n[3],t[4]=e*n[4],t[5]=e*n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t},e.fromTranslation=function(t,n){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=1,t[5]=0,t[6]=n[0],t[7]=n[1],t[8]=1,t},e.fromRotation=function(t,n){var r=Math.sin(n),a=Math.cos(n);return t[0]=a,t[1]=r,t[2]=0,t[3]=-r,t[4]=a,t[5]=0,t[6]=0,t[7]=0,t[8]=1,t},e.fromScaling=function(t,n){return t[0]=n[0],t[1]=0,t[2]=0,t[3]=0,t[4]=n[1],t[5]=0,t[6]=0,t[7]=0,t[8]=1,t},e.fromMat2d=function(t,n){return t[0]=n[0],t[1]=n[1],t[2]=0,t[3]=n[2],t[4]=n[3],t[5]=0,t[6]=n[4],t[7]=n[5],t[8]=1,t},e.fromQuat=function(t,n){var r=n[0],a=n[1],e=n[2],u=n[3],o=r+r,i=a+a,c=e+e,f=r*o,s=a*o,h=a*i,M=e*o,l=e*i,v=e*c,m=u*o,p=u*i,d=u*c;return t[0]=1-h-v,t[3]=s-d,t[6]=M+p,t[1]=s+d,t[4]=1-f-v,t[7]=l-m,t[2]=M-p,t[5]=l+m,t[8]=1-f-h,t},e.normalFromMat4=function(t,n){var r=n[0],a=n[1],e=n[2],u=n[3],o=n[4],i=n[5],c=n[6],f=n[7],s=n[8],h=n[9],M=n[10],l=n[11],v=n[12],m=n[13],p=n[14],d=n[15],A=r*i-a*o,R=r*c-e*o,w=r*f-u*o,q=a*c-e*i,Y=a*f-u*i,g=e*f-u*c,y=s*m-h*v,x=s*p-M*v,P=s*d-l*v,E=h*p-M*m,T=h*d-l*m,b=M*d-l*p,D=A*b-R*T+w*E+q*P-Y*x+g*y;return D?(D=1/D,t[0]=(i*b-c*T+f*E)*D,t[1]=(c*P-o*b-f*x)*D,t[2]=(o*T-i*P+f*y)*D,t[3]=(e*T-a*b-u*E)*D,t[4]=(r*b-e*P+u*x)*D,t[5]=(a*P-r*T-u*y)*D,t[6]=(m*g-p*Y+d*q)*D,t[7]=(p*w-v*g-d*R)*D,t[8]=(v*Y-m*w+d*A)*D,t):null},e.str=function(t){return"mat3("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+", "+t[4]+", "+t[5]+", "+t[6]+", "+t[7]+", "+t[8]+")"},e.frob=function(t){return Math.sqrt(Math.pow(t[0],2)+Math.pow(t[1],2)+Math.pow(t[2],2)+Math.pow(t[3],2)+Math.pow(t[4],2)+Math.pow(t[5],2)+Math.pow(t[6],2)+Math.pow(t[7],2)+Math.pow(t[8],2))},t.exports=e},function(t,n,r){var a=r(1),e={};e.create=function(){var t=new a.ARRAY_TYPE(16);return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},e.clone=function(t){var n=new a.ARRAY_TYPE(16);return n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=t[3],n[4]=t[4],n[5]=t[5],n[6]=t[6],n[7]=t[7],n[8]=t[8],n[9]=t[9],n[10]=t[10],n[11]=t[11],n[12]=t[12],n[13]=t[13],n[14]=t[14],n[15]=t[15],n},e.copy=function(t,n){return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],t},e.identity=function(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},e.transpose=function(t,n){if(t===n){var r=n[1],a=n[2],e=n[3],u=n[6],o=n[7],i=n[11];t[1]=n[4],t[2]=n[8],t[3]=n[12],t[4]=r,t[6]=n[9],t[7]=n[13],t[8]=a,t[9]=u,t[11]=n[14],t[12]=e,t[13]=o,t[14]=i}else t[0]=n[0],t[1]=n[4],t[2]=n[8],t[3]=n[12],t[4]=n[1],t[5]=n[5],t[6]=n[9],t[7]=n[13],t[8]=n[2],t[9]=n[6],t[10]=n[10],t[11]=n[14],t[12]=n[3],t[13]=n[7],t[14]=n[11],t[15]=n[15];return t},e.invert=function(t,n){var r=n[0],a=n[1],e=n[2],u=n[3],o=n[4],i=n[5],c=n[6],f=n[7],s=n[8],h=n[9],M=n[10],l=n[11],v=n[12],m=n[13],p=n[14],d=n[15],A=r*i-a*o,R=r*c-e*o,w=r*f-u*o,q=a*c-e*i,Y=a*f-u*i,g=e*f-u*c,y=s*m-h*v,x=s*p-M*v,P=s*d-l*v,E=h*p-M*m,T=h*d-l*m,b=M*d-l*p,D=A*b-R*T+w*E+q*P-Y*x+g*y;return D?(D=1/D,t[0]=(i*b-c*T+f*E)*D,t[1]=(e*T-a*b-u*E)*D,t[2]=(m*g-p*Y+d*q)*D,t[3]=(M*Y-h*g-l*q)*D,t[4]=(c*P-o*b-f*x)*D,t[5]=(r*b-e*P+u*x)*D,t[6]=(p*w-v*g-d*R)*D,t[7]=(s*g-M*w+l*R)*D,t[8]=(o*T-i*P+f*y)*D,t[9]=(a*P-r*T-u*y)*D,t[10]=(v*Y-m*w+d*A)*D,t[11]=(h*w-s*Y-l*A)*D,t[12]=(i*x-o*E-c*y)*D,t[13]=(r*E-a*x+e*y)*D,t[14]=(m*R-v*q-p*A)*D,t[15]=(s*q-h*R+M*A)*D,t):null},e.adjoint=function(t,n){var r=n[0],a=n[1],e=n[2],u=n[3],o=n[4],i=n[5],c=n[6],f=n[7],s=n[8],h=n[9],M=n[10],l=n[11],v=n[12],m=n[13],p=n[14],d=n[15];return t[0]=i*(M*d-l*p)-h*(c*d-f*p)+m*(c*l-f*M),t[1]=-(a*(M*d-l*p)-h*(e*d-u*p)+m*(e*l-u*M)),t[2]=a*(c*d-f*p)-i*(e*d-u*p)+m*(e*f-u*c),t[3]=-(a*(c*l-f*M)-i*(e*l-u*M)+h*(e*f-u*c)),t[4]=-(o*(M*d-l*p)-s*(c*d-f*p)+v*(c*l-f*M)),t[5]=r*(M*d-l*p)-s*(e*d-u*p)+v*(e*l-u*M),t[6]=-(r*(c*d-f*p)-o*(e*d-u*p)+v*(e*f-u*c)),t[7]=r*(c*l-f*M)-o*(e*l-u*M)+s*(e*f-u*c),t[8]=o*(h*d-l*m)-s*(i*d-f*m)+v*(i*l-f*h),t[9]=-(r*(h*d-l*m)-s*(a*d-u*m)+v*(a*l-u*h)),t[10]=r*(i*d-f*m)-o*(a*d-u*m)+v*(a*f-u*i),t[11]=-(r*(i*l-f*h)-o*(a*l-u*h)+s*(a*f-u*i)),t[12]=-(o*(h*p-M*m)-s*(i*p-c*m)+v*(i*M-c*h)),t[13]=r*(h*p-M*m)-s*(a*p-e*m)+v*(a*M-e*h),t[14]=-(r*(i*p-c*m)-o*(a*p-e*m)+v*(a*c-e*i)),t[15]=r*(i*M-c*h)-o*(a*M-e*h)+s*(a*c-e*i),t},e.determinant=function(t){var n=t[0],r=t[1],a=t[2],e=t[3],u=t[4],o=t[5],i=t[6],c=t[7],f=t[8],s=t[9],h=t[10],M=t[11],l=t[12],v=t[13],m=t[14],p=t[15],d=n*o-r*u,A=n*i-a*u,R=n*c-e*u,w=r*i-a*o,q=r*c-e*o,Y=a*c-e*i,g=f*v-s*l,y=f*m-h*l,x=f*p-M*l,P=s*m-h*v,E=s*p-M*v,T=h*p-M*m;return d*T-A*E+R*P+w*x-q*y+Y*g},e.multiply=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=n[4],c=n[5],f=n[6],s=n[7],h=n[8],M=n[9],l=n[10],v=n[11],m=n[12],p=n[13],d=n[14],A=n[15],R=r[0],w=r[1],q=r[2],Y=r[3];return t[0]=R*a+w*i+q*h+Y*m,t[1]=R*e+w*c+q*M+Y*p,t[2]=R*u+w*f+q*l+Y*d,t[3]=R*o+w*s+q*v+Y*A,R=r[4],w=r[5],q=r[6],Y=r[7],t[4]=R*a+w*i+q*h+Y*m,t[5]=R*e+w*c+q*M+Y*p,t[6]=R*u+w*f+q*l+Y*d,t[7]=R*o+w*s+q*v+Y*A,R=r[8],w=r[9],q=r[10],Y=r[11],t[8]=R*a+w*i+q*h+Y*m,t[9]=R*e+w*c+q*M+Y*p,t[10]=R*u+w*f+q*l+Y*d,t[11]=R*o+w*s+q*v+Y*A,R=r[12],w=r[13],q=r[14],Y=r[15],t[12]=R*a+w*i+q*h+Y*m,t[13]=R*e+w*c+q*M+Y*p,t[14]=R*u+w*f+q*l+Y*d,t[15]=R*o+w*s+q*v+Y*A,t},e.mul=e.multiply,e.translate=function(t,n,r){var a,e,u,o,i,c,f,s,h,M,l,v,m=r[0],p=r[1],d=r[2];return n===t?(t[12]=n[0]*m+n[4]*p+n[8]*d+n[12],t[13]=n[1]*m+n[5]*p+n[9]*d+n[13],t[14]=n[2]*m+n[6]*p+n[10]*d+n[14],t[15]=n[3]*m+n[7]*p+n[11]*d+n[15]):(a=n[0],e=n[1],u=n[2],o=n[3],i=n[4],c=n[5],f=n[6],s=n[7],h=n[8],M=n[9],l=n[10],v=n[11],t[0]=a,t[1]=e,t[2]=u,t[3]=o,t[4]=i,t[5]=c,t[6]=f,t[7]=s,t[8]=h,t[9]=M,t[10]=l,t[11]=v,t[12]=a*m+i*p+h*d+n[12],t[13]=e*m+c*p+M*d+n[13],t[14]=u*m+f*p+l*d+n[14],t[15]=o*m+s*p+v*d+n[15]),t},e.scale=function(t,n,r){var a=r[0],e=r[1],u=r[2];return t[0]=n[0]*a,t[1]=n[1]*a,t[2]=n[2]*a,t[3]=n[3]*a,t[4]=n[4]*e,t[5]=n[5]*e,t[6]=n[6]*e,t[7]=n[7]*e,t[8]=n[8]*u,t[9]=n[9]*u,t[10]=n[10]*u,t[11]=n[11]*u,t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],t},e.rotate=function(t,n,r,e){var u,o,i,c,f,s,h,M,l,v,m,p,d,A,R,w,q,Y,g,y,x,P,E,T,b=e[0],D=e[1],L=e[2],_=Math.sqrt(b*b+D*D+L*L);return Math.abs(_)<a.EPSILON?null:(_=1/_,b*=_,D*=_,L*=_,u=Math.sin(r),o=Math.cos(r),i=1-o,c=n[0],f=n[1],s=n[2],h=n[3],M=n[4],l=n[5],v=n[6],m=n[7],p=n[8],d=n[9],A=n[10],R=n[11],w=b*b*i+o,q=D*b*i+L*u,Y=L*b*i-D*u,g=b*D*i-L*u,y=D*D*i+o,x=L*D*i+b*u,P=b*L*i+D*u,E=D*L*i-b*u,T=L*L*i+o,t[0]=c*w+M*q+p*Y,t[1]=f*w+l*q+d*Y,t[2]=s*w+v*q+A*Y,t[3]=h*w+m*q+R*Y,t[4]=c*g+M*y+p*x,t[5]=f*g+l*y+d*x,t[6]=s*g+v*y+A*x,t[7]=h*g+m*y+R*x,t[8]=c*P+M*E+p*T,t[9]=f*P+l*E+d*T,t[10]=s*P+v*E+A*T,t[11]=h*P+m*E+R*T,n!==t&&(t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15]),t)},e.rotateX=function(t,n,r){var a=Math.sin(r),e=Math.cos(r),u=n[4],o=n[5],i=n[6],c=n[7],f=n[8],s=n[9],h=n[10],M=n[11];return n!==t&&(t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15]),t[4]=u*e+f*a,t[5]=o*e+s*a,t[6]=i*e+h*a,t[7]=c*e+M*a,t[8]=f*e-u*a,t[9]=s*e-o*a,t[10]=h*e-i*a,t[11]=M*e-c*a,t},e.rotateY=function(t,n,r){var a=Math.sin(r),e=Math.cos(r),u=n[0],o=n[1],i=n[2],c=n[3],f=n[8],s=n[9],h=n[10],M=n[11];return n!==t&&(t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15]),t[0]=u*e-f*a,t[1]=o*e-s*a,t[2]=i*e-h*a,t[3]=c*e-M*a,t[8]=u*a+f*e,t[9]=o*a+s*e,t[10]=i*a+h*e,t[11]=c*a+M*e,t},e.rotateZ=function(t,n,r){var a=Math.sin(r),e=Math.cos(r),u=n[0],o=n[1],i=n[2],c=n[3],f=n[4],s=n[5],h=n[6],M=n[7];return n!==t&&(t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15]),t[0]=u*e+f*a,t[1]=o*e+s*a,t[2]=i*e+h*a,t[3]=c*e+M*a,t[4]=f*e-u*a,t[5]=s*e-o*a,t[6]=h*e-i*a,t[7]=M*e-c*a,t},e.fromTranslation=function(t,n){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=n[0],t[13]=n[1],t[14]=n[2],t[15]=1,t},e.fromScaling=function(t,n){return t[0]=n[0],t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=n[1],t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=n[2],t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},e.fromRotation=function(t,n,r){var e,u,o,i=r[0],c=r[1],f=r[2],s=Math.sqrt(i*i+c*c+f*f);return Math.abs(s)<a.EPSILON?null:(s=1/s,i*=s,c*=s,f*=s,e=Math.sin(n),u=Math.cos(n),o=1-u,t[0]=i*i*o+u,t[1]=c*i*o+f*e,t[2]=f*i*o-c*e,t[3]=0,t[4]=i*c*o-f*e,t[5]=c*c*o+u,t[6]=f*c*o+i*e,t[7]=0,t[8]=i*f*o+c*e,t[9]=c*f*o-i*e,t[10]=f*f*o+u,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t)},e.fromXRotation=function(t,n){var r=Math.sin(n),a=Math.cos(n);return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=a,t[6]=r,t[7]=0,t[8]=0,t[9]=-r,t[10]=a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},e.fromYRotation=function(t,n){var r=Math.sin(n),a=Math.cos(n);return t[0]=a,t[1]=0,t[2]=-r,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=r,t[9]=0,t[10]=a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},e.fromZRotation=function(t,n){var r=Math.sin(n),a=Math.cos(n);return t[0]=a,t[1]=r,t[2]=0,t[3]=0,t[4]=-r,t[5]=a,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},e.fromRotationTranslation=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=a+a,c=e+e,f=u+u,s=a*i,h=a*c,M=a*f,l=e*c,v=e*f,m=u*f,p=o*i,d=o*c,A=o*f;return t[0]=1-(l+m),t[1]=h+A,t[2]=M-d,t[3]=0,t[4]=h-A,t[5]=1-(s+m),t[6]=v+p,t[7]=0,t[8]=M+d,t[9]=v-p,t[10]=1-(s+l),t[11]=0,t[12]=r[0],t[13]=r[1],t[14]=r[2],t[15]=1,t},e.fromRotationTranslationScale=function(t,n,r,a){var e=n[0],u=n[1],o=n[2],i=n[3],c=e+e,f=u+u,s=o+o,h=e*c,M=e*f,l=e*s,v=u*f,m=u*s,p=o*s,d=i*c,A=i*f,R=i*s,w=a[0],q=a[1],Y=a[2];return t[0]=(1-(v+p))*w,t[1]=(M+R)*w,t[2]=(l-A)*w,t[3]=0,t[4]=(M-R)*q,t[5]=(1-(h+p))*q,t[6]=(m+d)*q,t[7]=0,t[8]=(l+A)*Y,t[9]=(m-d)*Y,t[10]=(1-(h+v))*Y,t[11]=0,t[12]=r[0],t[13]=r[1],t[14]=r[2],t[15]=1,t},e.fromRotationTranslationScaleOrigin=function(t,n,r,a,e){var u=n[0],o=n[1],i=n[2],c=n[3],f=u+u,s=o+o,h=i+i,M=u*f,l=u*s,v=u*h,m=o*s,p=o*h,d=i*h,A=c*f,R=c*s,w=c*h,q=a[0],Y=a[1],g=a[2],y=e[0],x=e[1],P=e[2];return t[0]=(1-(m+d))*q,t[1]=(l+w)*q,t[2]=(v-R)*q,t[3]=0,t[4]=(l-w)*Y,t[5]=(1-(M+d))*Y,t[6]=(p+A)*Y,t[7]=0,t[8]=(v+R)*g,t[9]=(p-A)*g,t[10]=(1-(M+m))*g,t[11]=0,t[12]=r[0]+y-(t[0]*y+t[4]*x+t[8]*P),t[13]=r[1]+x-(t[1]*y+t[5]*x+t[9]*P),t[14]=r[2]+P-(t[2]*y+t[6]*x+t[10]*P),t[15]=1,t},e.fromQuat=function(t,n){var r=n[0],a=n[1],e=n[2],u=n[3],o=r+r,i=a+a,c=e+e,f=r*o,s=a*o,h=a*i,M=e*o,l=e*i,v=e*c,m=u*o,p=u*i,d=u*c;return t[0]=1-h-v,t[1]=s+d,t[2]=M-p,t[3]=0,t[4]=s-d,t[5]=1-f-v,t[6]=l+m,t[7]=0,t[8]=M+p,t[9]=l-m,t[10]=1-f-h,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},e.frustum=function(t,n,r,a,e,u,o){var i=1/(r-n),c=1/(e-a),f=1/(u-o);return t[0]=2*u*i,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=2*u*c,t[6]=0,t[7]=0,t[8]=(r+n)*i,t[9]=(e+a)*c,t[10]=(o+u)*f,t[11]=-1,t[12]=0,t[13]=0,t[14]=o*u*2*f,t[15]=0,t},e.perspective=function(t,n,r,a,e){var u=1/Math.tan(n/2),o=1/(a-e);return t[0]=u/r,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=u,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=(e+a)*o,t[11]=-1,t[12]=0,t[13]=0,t[14]=2*e*a*o,t[15]=0,t},e.perspectiveFromFieldOfView=function(t,n,r,a){var e=Math.tan(n.upDegrees*Math.PI/180),u=Math.tan(n.downDegrees*Math.PI/180),o=Math.tan(n.leftDegrees*Math.PI/180),i=Math.tan(n.rightDegrees*Math.PI/180),c=2/(o+i),f=2/(e+u);return t[0]=c,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=f,t[6]=0,t[7]=0,t[8]=-((o-i)*c*.5),t[9]=(e-u)*f*.5,t[10]=a/(r-a),t[11]=-1,t[12]=0,t[13]=0,t[14]=a*r/(r-a),t[15]=0,t},e.ortho=function(t,n,r,a,e,u,o){var i=1/(n-r),c=1/(a-e),f=1/(u-o);return t[0]=-2*i,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=-2*c,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=2*f,t[11]=0,t[12]=(n+r)*i,t[13]=(e+a)*c,t[14]=(o+u)*f,t[15]=1,t},e.lookAt=function(t,n,r,u){var o,i,c,f,s,h,M,l,v,m,p=n[0],d=n[1],A=n[2],R=u[0],w=u[1],q=u[2],Y=r[0],g=r[1],y=r[2];return Math.abs(p-Y)<a.EPSILON&&Math.abs(d-g)<a.EPSILON&&Math.abs(A-y)<a.EPSILON?e.identity(t):(M=p-Y,l=d-g,v=A-y,m=1/Math.sqrt(M*M+l*l+v*v),M*=m,l*=m,v*=m,o=w*v-q*l,i=q*M-R*v,c=R*l-w*M,m=Math.sqrt(o*o+i*i+c*c),m?(m=1/m,o*=m,i*=m,c*=m):(o=0,i=0,c=0),f=l*c-v*i,s=v*o-M*c,h=M*i-l*o,m=Math.sqrt(f*f+s*s+h*h),m?(m=1/m,f*=m,s*=m,h*=m):(f=0,s=0,h=0),t[0]=o,t[1]=f,t[2]=M,t[3]=0,t[4]=i,t[5]=s,t[6]=l,t[7]=0,t[8]=c,t[9]=h,t[10]=v,t[11]=0,t[12]=-(o*p+i*d+c*A),t[13]=-(f*p+s*d+h*A),t[14]=-(M*p+l*d+v*A),t[15]=1,t)},e.str=function(t){return"mat4("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+", "+t[4]+", "+t[5]+", "+t[6]+", "+t[7]+", "+t[8]+", "+t[9]+", "+t[10]+", "+t[11]+", "+t[12]+", "+t[13]+", "+t[14]+", "+t[15]+")"},e.frob=function(t){return Math.sqrt(Math.pow(t[0],2)+Math.pow(t[1],2)+Math.pow(t[2],2)+Math.pow(t[3],2)+Math.pow(t[4],2)+Math.pow(t[5],2)+Math.pow(t[6],2)+Math.pow(t[7],2)+Math.pow(t[8],2)+Math.pow(t[9],2)+Math.pow(t[10],2)+Math.pow(t[11],2)+Math.pow(t[12],2)+Math.pow(t[13],2)+Math.pow(t[14],2)+Math.pow(t[15],2))},t.exports=e},function(t,n,r){var a=r(1),e=r(4),u=r(7),o=r(8),i={};i.create=function(){var t=new a.ARRAY_TYPE(4);return t[0]=0,t[1]=0,t[2]=0,t[3]=1,t},i.rotationTo=function(){var t=u.create(),n=u.fromValues(1,0,0),r=u.fromValues(0,1,0);return function(a,e,o){var c=u.dot(e,o);return-.999999>c?(u.cross(t,n,e),u.length(t)<1e-6&&u.cross(t,r,e),u.normalize(t,t),i.setAxisAngle(a,t,Math.PI),a):c>.999999?(a[0]=0,a[1]=0,a[2]=0,a[3]=1,a):(u.cross(t,e,o),a[0]=t[0],a[1]=t[1],a[2]=t[2],a[3]=1+c,i.normalize(a,a))}}(),i.setAxes=function(){var t=e.create();return function(n,r,a,e){return t[0]=a[0],t[3]=a[1],t[6]=a[2],t[1]=e[0],t[4]=e[1],t[7]=e[2],t[2]=-r[0],t[5]=-r[1],t[8]=-r[2],i.normalize(n,i.fromMat3(n,t))}}(),i.clone=o.clone,i.fromValues=o.fromValues,i.copy=o.copy,i.set=o.set,i.identity=function(t){return t[0]=0,t[1]=0,t[2]=0,t[3]=1,t},i.setAxisAngle=function(t,n,r){r=.5*r;var a=Math.sin(r);return t[0]=a*n[0],t[1]=a*n[1],t[2]=a*n[2],t[3]=Math.cos(r),t},i.add=o.add,i.multiply=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=r[0],c=r[1],f=r[2],s=r[3];return t[0]=a*s+o*i+e*f-u*c,t[1]=e*s+o*c+u*i-a*f,t[2]=u*s+o*f+a*c-e*i,t[3]=o*s-a*i-e*c-u*f,t},i.mul=i.multiply,i.scale=o.scale,i.rotateX=function(t,n,r){r*=.5;var a=n[0],e=n[1],u=n[2],o=n[3],i=Math.sin(r),c=Math.cos(r);return t[0]=a*c+o*i,t[1]=e*c+u*i,t[2]=u*c-e*i,t[3]=o*c-a*i,t},i.rotateY=function(t,n,r){r*=.5;var a=n[0],e=n[1],u=n[2],o=n[3],i=Math.sin(r),c=Math.cos(r);return t[0]=a*c-u*i,t[1]=e*c+o*i,t[2]=u*c+a*i,t[3]=o*c-e*i,t},i.rotateZ=function(t,n,r){r*=.5;var a=n[0],e=n[1],u=n[2],o=n[3],i=Math.sin(r),c=Math.cos(r);return t[0]=a*c+e*i,t[1]=e*c-a*i,t[2]=u*c+o*i,t[3]=o*c-u*i,t},i.calculateW=function(t,n){var r=n[0],a=n[1],e=n[2];return t[0]=r,t[1]=a,t[2]=e,t[3]=Math.sqrt(Math.abs(1-r*r-a*a-e*e)),t},i.dot=o.dot,i.lerp=o.lerp,i.slerp=function(t,n,r,a){var e,u,o,i,c,f=n[0],s=n[1],h=n[2],M=n[3],l=r[0],v=r[1],m=r[2],p=r[3];return u=f*l+s*v+h*m+M*p,0>u&&(u=-u,l=-l,v=-v,m=-m,p=-p),1-u>1e-6?(e=Math.acos(u),o=Math.sin(e),i=Math.sin((1-a)*e)/o,c=Math.sin(a*e)/o):(i=1-a,c=a),t[0]=i*f+c*l,t[1]=i*s+c*v,t[2]=i*h+c*m,t[3]=i*M+c*p,t},i.sqlerp=function(){var t=i.create(),n=i.create();return function(r,a,e,u,o,c){return i.slerp(t,a,o,c),i.slerp(n,e,u,c),i.slerp(r,t,n,2*c*(1-c)),r}}(),i.invert=function(t,n){var r=n[0],a=n[1],e=n[2],u=n[3],o=r*r+a*a+e*e+u*u,i=o?1/o:0;return t[0]=-r*i,t[1]=-a*i,t[2]=-e*i,t[3]=u*i,t},i.conjugate=function(t,n){return t[0]=-n[0],t[1]=-n[1],t[2]=-n[2],t[3]=n[3],t},i.length=o.length,i.len=i.length,i.squaredLength=o.squaredLength,i.sqrLen=i.squaredLength,i.normalize=o.normalize,i.fromMat3=function(t,n){var r,a=n[0]+n[4]+n[8];if(a>0)r=Math.sqrt(a+1),t[3]=.5*r,r=.5/r,t[0]=(n[5]-n[7])*r,t[1]=(n[6]-n[2])*r,t[2]=(n[1]-n[3])*r;else{var e=0;n[4]>n[0]&&(e=1),n[8]>n[3*e+e]&&(e=2);var u=(e+1)%3,o=(e+2)%3;r=Math.sqrt(n[3*e+e]-n[3*u+u]-n[3*o+o]+1),t[e]=.5*r,r=.5/r,t[3]=(n[3*u+o]-n[3*o+u])*r,t[u]=(n[3*u+e]+n[3*e+u])*r,t[o]=(n[3*o+e]+n[3*e+o])*r}return t},i.str=function(t){return"quat("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+")"},t.exports=i},function(t,n,r){var a=r(1),e={};e.create=function(){var t=new a.ARRAY_TYPE(3);return t[0]=0,t[1]=0,t[2]=0,t},e.clone=function(t){var n=new a.ARRAY_TYPE(3);return n[0]=t[0],n[1]=t[1],n[2]=t[2],n},e.fromValues=function(t,n,r){var e=new a.ARRAY_TYPE(3);return e[0]=t,e[1]=n,e[2]=r,e},e.copy=function(t,n){return t[0]=n[0],t[1]=n[1],t[2]=n[2],t},e.set=function(t,n,r,a){return t[0]=n,t[1]=r,t[2]=a,t},e.add=function(t,n,r){return t[0]=n[0]+r[0],t[1]=n[1]+r[1],t[2]=n[2]+r[2],t},e.subtract=function(t,n,r){return t[0]=n[0]-r[0],t[1]=n[1]-r[1],t[2]=n[2]-r[2],t},e.sub=e.subtract,e.multiply=function(t,n,r){return t[0]=n[0]*r[0],t[1]=n[1]*r[1],t[2]=n[2]*r[2],t},e.mul=e.multiply,e.divide=function(t,n,r){return t[0]=n[0]/r[0],t[1]=n[1]/r[1],t[2]=n[2]/r[2],t},e.div=e.divide,e.min=function(t,n,r){return t[0]=Math.min(n[0],r[0]),t[1]=Math.min(n[1],r[1]),t[2]=Math.min(n[2],r[2]),t},e.max=function(t,n,r){return t[0]=Math.max(n[0],r[0]),t[1]=Math.max(n[1],r[1]),t[2]=Math.max(n[2],r[2]),t},e.scale=function(t,n,r){return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t},e.scaleAndAdd=function(t,n,r,a){return t[0]=n[0]+r[0]*a,t[1]=n[1]+r[1]*a,t[2]=n[2]+r[2]*a,t},e.distance=function(t,n){var r=n[0]-t[0],a=n[1]-t[1],e=n[2]-t[2];return Math.sqrt(r*r+a*a+e*e)},e.dist=e.distance,e.squaredDistance=function(t,n){var r=n[0]-t[0],a=n[1]-t[1],e=n[2]-t[2];return r*r+a*a+e*e},e.sqrDist=e.squaredDistance,e.length=function(t){var n=t[0],r=t[1],a=t[2];return Math.sqrt(n*n+r*r+a*a)},e.len=e.length,e.squaredLength=function(t){var n=t[0],r=t[1],a=t[2];return n*n+r*r+a*a},e.sqrLen=e.squaredLength,e.negate=function(t,n){return t[0]=-n[0],t[1]=-n[1],t[2]=-n[2],t},e.inverse=function(t,n){return t[0]=1/n[0],t[1]=1/n[1],t[2]=1/n[2],t},e.normalize=function(t,n){var r=n[0],a=n[1],e=n[2],u=r*r+a*a+e*e;return u>0&&(u=1/Math.sqrt(u),t[0]=n[0]*u,t[1]=n[1]*u,t[2]=n[2]*u),t},e.dot=function(t,n){return t[0]*n[0]+t[1]*n[1]+t[2]*n[2]},e.cross=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=r[0],i=r[1],c=r[2];return t[0]=e*c-u*i,t[1]=u*o-a*c,t[2]=a*i-e*o,t},e.lerp=function(t,n,r,a){var e=n[0],u=n[1],o=n[2];return t[0]=e+a*(r[0]-e),t[1]=u+a*(r[1]-u),t[2]=o+a*(r[2]-o),t},e.hermite=function(t,n,r,a,e,u){var o=u*u,i=o*(2*u-3)+1,c=o*(u-2)+u,f=o*(u-1),s=o*(3-2*u);return t[0]=n[0]*i+r[0]*c+a[0]*f+e[0]*s,t[1]=n[1]*i+r[1]*c+a[1]*f+e[1]*s,t[2]=n[2]*i+r[2]*c+a[2]*f+e[2]*s,t},e.bezier=function(t,n,r,a,e,u){var o=1-u,i=o*o,c=u*u,f=i*o,s=3*u*i,h=3*c*o,M=c*u;return t[0]=n[0]*f+r[0]*s+a[0]*h+e[0]*M,t[1]=n[1]*f+r[1]*s+a[1]*h+e[1]*M,t[2]=n[2]*f+r[2]*s+a[2]*h+e[2]*M,t},e.random=function(t,n){n=n||1;var r=2*a.RANDOM()*Math.PI,e=2*a.RANDOM()-1,u=Math.sqrt(1-e*e)*n;return t[0]=Math.cos(r)*u,t[1]=Math.sin(r)*u,t[2]=e*n,t},e.transformMat4=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=r[3]*a+r[7]*e+r[11]*u+r[15];return o=o||1,t[0]=(r[0]*a+r[4]*e+r[8]*u+r[12])/o,t[1]=(r[1]*a+r[5]*e+r[9]*u+r[13])/o,t[2]=(r[2]*a+r[6]*e+r[10]*u+r[14])/o,t},e.transformMat3=function(t,n,r){var a=n[0],e=n[1],u=n[2];return t[0]=a*r[0]+e*r[3]+u*r[6],t[1]=a*r[1]+e*r[4]+u*r[7],t[2]=a*r[2]+e*r[5]+u*r[8],t},e.transformQuat=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=r[0],i=r[1],c=r[2],f=r[3],s=f*a+i*u-c*e,h=f*e+c*a-o*u,M=f*u+o*e-i*a,l=-o*a-i*e-c*u;return t[0]=s*f+l*-o+h*-c-M*-i,t[1]=h*f+l*-i+M*-o-s*-c,t[2]=M*f+l*-c+s*-i-h*-o,t},e.rotateX=function(t,n,r,a){var e=[],u=[];return e[0]=n[0]-r[0],e[1]=n[1]-r[1],e[2]=n[2]-r[2],u[0]=e[0],u[1]=e[1]*Math.cos(a)-e[2]*Math.sin(a),u[2]=e[1]*Math.sin(a)+e[2]*Math.cos(a),t[0]=u[0]+r[0],t[1]=u[1]+r[1],t[2]=u[2]+r[2],t},e.rotateY=function(t,n,r,a){var e=[],u=[];return e[0]=n[0]-r[0],e[1]=n[1]-r[1],e[2]=n[2]-r[2],u[0]=e[2]*Math.sin(a)+e[0]*Math.cos(a),u[1]=e[1],u[2]=e[2]*Math.cos(a)-e[0]*Math.sin(a),t[0]=u[0]+r[0],t[1]=u[1]+r[1],t[2]=u[2]+r[2],t},e.rotateZ=function(t,n,r,a){var e=[],u=[];return e[0]=n[0]-r[0],e[1]=n[1]-r[1],e[2]=n[2]-r[2],u[0]=e[0]*Math.cos(a)-e[1]*Math.sin(a),u[1]=e[0]*Math.sin(a)+e[1]*Math.cos(a),u[2]=e[2],t[0]=u[0]+r[0],t[1]=u[1]+r[1],t[2]=u[2]+r[2],t},e.forEach=function(){var t=e.create();return function(n,r,a,e,u,o){var i,c;for(r||(r=3),a||(a=0),c=e?Math.min(e*r+a,n.length):n.length,i=a;c>i;i+=r)t[0]=n[i],t[1]=n[i+1],t[2]=n[i+2],u(t,t,o),n[i]=t[0],n[i+1]=t[1],n[i+2]=t[2];return n}}(),e.angle=function(t,n){var r=e.fromValues(t[0],t[1],t[2]),a=e.fromValues(n[0],n[1],n[2]);e.normalize(r,r),e.normalize(a,a);var u=e.dot(r,a);return u>1?0:Math.acos(u)},e.str=function(t){return"vec3("+t[0]+", "+t[1]+", "+t[2]+")"},t.exports=e},function(t,n,r){var a=r(1),e={};e.create=function(){var t=new a.ARRAY_TYPE(4);return t[0]=0,t[1]=0,t[2]=0,t[3]=0,t},e.clone=function(t){var n=new a.ARRAY_TYPE(4);return n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=t[3],n},e.fromValues=function(t,n,r,e){var u=new a.ARRAY_TYPE(4);return u[0]=t,u[1]=n,u[2]=r,u[3]=e,u},e.copy=function(t,n){return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t},e.set=function(t,n,r,a,e){return t[0]=n,t[1]=r,t[2]=a,t[3]=e,t},e.add=function(t,n,r){return t[0]=n[0]+r[0],t[1]=n[1]+r[1],t[2]=n[2]+r[2],t[3]=n[3]+r[3],t},e.subtract=function(t,n,r){return t[0]=n[0]-r[0],t[1]=n[1]-r[1],t[2]=n[2]-r[2],t[3]=n[3]-r[3],t},e.sub=e.subtract,e.multiply=function(t,n,r){return t[0]=n[0]*r[0],t[1]=n[1]*r[1],t[2]=n[2]*r[2],t[3]=n[3]*r[3],t},e.mul=e.multiply,e.divide=function(t,n,r){return t[0]=n[0]/r[0],t[1]=n[1]/r[1],t[2]=n[2]/r[2],t[3]=n[3]/r[3],t},e.div=e.divide,e.min=function(t,n,r){return t[0]=Math.min(n[0],r[0]),t[1]=Math.min(n[1],r[1]),t[2]=Math.min(n[2],r[2]),t[3]=Math.min(n[3],r[3]),t},e.max=function(t,n,r){return t[0]=Math.max(n[0],r[0]),t[1]=Math.max(n[1],r[1]),t[2]=Math.max(n[2],r[2]),t[3]=Math.max(n[3],r[3]),t},e.scale=function(t,n,r){return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=n[3]*r,t},e.scaleAndAdd=function(t,n,r,a){return t[0]=n[0]+r[0]*a,t[1]=n[1]+r[1]*a,t[2]=n[2]+r[2]*a,t[3]=n[3]+r[3]*a,t},e.distance=function(t,n){var r=n[0]-t[0],a=n[1]-t[1],e=n[2]-t[2],u=n[3]-t[3];return Math.sqrt(r*r+a*a+e*e+u*u)},e.dist=e.distance,e.squaredDistance=function(t,n){var r=n[0]-t[0],a=n[1]-t[1],e=n[2]-t[2],u=n[3]-t[3];return r*r+a*a+e*e+u*u},e.sqrDist=e.squaredDistance,e.length=function(t){var n=t[0],r=t[1],a=t[2],e=t[3];return Math.sqrt(n*n+r*r+a*a+e*e)},e.len=e.length,e.squaredLength=function(t){var n=t[0],r=t[1],a=t[2],e=t[3];return n*n+r*r+a*a+e*e},e.sqrLen=e.squaredLength,e.negate=function(t,n){return t[0]=-n[0],t[1]=-n[1],t[2]=-n[2],t[3]=-n[3],t},e.inverse=function(t,n){return t[0]=1/n[0],t[1]=1/n[1],t[2]=1/n[2],t[3]=1/n[3],t},e.normalize=function(t,n){var r=n[0],a=n[1],e=n[2],u=n[3],o=r*r+a*a+e*e+u*u;return o>0&&(o=1/Math.sqrt(o),t[0]=r*o,t[1]=a*o,t[2]=e*o,t[3]=u*o),t},e.dot=function(t,n){return t[0]*n[0]+t[1]*n[1]+t[2]*n[2]+t[3]*n[3]},e.lerp=function(t,n,r,a){var e=n[0],u=n[1],o=n[2],i=n[3];return t[0]=e+a*(r[0]-e),t[1]=u+a*(r[1]-u),t[2]=o+a*(r[2]-o),t[3]=i+a*(r[3]-i),t},e.random=function(t,n){return n=n||1,t[0]=a.RANDOM(),t[1]=a.RANDOM(),t[2]=a.RANDOM(),t[3]=a.RANDOM(),e.normalize(t,t),e.scale(t,t,n),t},e.transformMat4=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3];return t[0]=r[0]*a+r[4]*e+r[8]*u+r[12]*o,t[1]=r[1]*a+r[5]*e+r[9]*u+r[13]*o,t[2]=r[2]*a+r[6]*e+r[10]*u+r[14]*o,t[3]=r[3]*a+r[7]*e+r[11]*u+r[15]*o,t},e.transformQuat=function(t,n,r){var a=n[0],e=n[1],u=n[2],o=r[0],i=r[1],c=r[2],f=r[3],s=f*a+i*u-c*e,h=f*e+c*a-o*u,M=f*u+o*e-i*a,l=-o*a-i*e-c*u;return t[0]=s*f+l*-o+h*-c-M*-i,t[1]=h*f+l*-i+M*-o-s*-c,t[2]=M*f+l*-c+s*-i-h*-o,t[3]=n[3],t},e.forEach=function(){var t=e.create();return function(n,r,a,e,u,o){var i,c;for(r||(r=4),a||(a=0),c=e?Math.min(e*r+a,n.length):n.length,i=a;c>i;i+=r)t[0]=n[i],t[1]=n[i+1],t[2]=n[i+2],t[3]=n[i+3],u(t,t,o),n[i]=t[0],n[i+1]=t[1],n[i+2]=t[2],n[i+3]=t[3];return n}}(),e.str=function(t){return"vec4("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+")"},t.exports=e},function(t,n,r){var a=r(1),e={};e.create=function(){var t=new a.ARRAY_TYPE(2);return t[0]=0,t[1]=0,t},e.clone=function(t){var n=new a.ARRAY_TYPE(2);return n[0]=t[0],n[1]=t[1],n},e.fromValues=function(t,n){var r=new a.ARRAY_TYPE(2);return r[0]=t,r[1]=n,r},e.copy=function(t,n){return t[0]=n[0],t[1]=n[1],t},e.set=function(t,n,r){return t[0]=n,t[1]=r,t},e.add=function(t,n,r){return t[0]=n[0]+r[0],t[1]=n[1]+r[1],t},e.subtract=function(t,n,r){return t[0]=n[0]-r[0],t[1]=n[1]-r[1],t},e.sub=e.subtract,e.multiply=function(t,n,r){return t[0]=n[0]*r[0],t[1]=n[1]*r[1],t},e.mul=e.multiply,e.divide=function(t,n,r){return t[0]=n[0]/r[0],t[1]=n[1]/r[1],t},e.div=e.divide,e.min=function(t,n,r){return t[0]=Math.min(n[0],r[0]),t[1]=Math.min(n[1],r[1]),t},e.max=function(t,n,r){return t[0]=Math.max(n[0],r[0]),t[1]=Math.max(n[1],r[1]),t},e.scale=function(t,n,r){return t[0]=n[0]*r,t[1]=n[1]*r,t},e.scaleAndAdd=function(t,n,r,a){return t[0]=n[0]+r[0]*a,t[1]=n[1]+r[1]*a,t},e.distance=function(t,n){var r=n[0]-t[0],a=n[1]-t[1];return Math.sqrt(r*r+a*a)},e.dist=e.distance,e.squaredDistance=function(t,n){var r=n[0]-t[0],a=n[1]-t[1];return r*r+a*a},e.sqrDist=e.squaredDistance,e.length=function(t){var n=t[0],r=t[1];return Math.sqrt(n*n+r*r)},e.len=e.length,e.squaredLength=function(t){var n=t[0],r=t[1];return n*n+r*r},e.sqrLen=e.squaredLength,e.negate=function(t,n){return t[0]=-n[0],t[1]=-n[1],t},e.inverse=function(t,n){return t[0]=1/n[0],t[1]=1/n[1],t},e.normalize=function(t,n){var r=n[0],a=n[1],e=r*r+a*a;return e>0&&(e=1/Math.sqrt(e),t[0]=n[0]*e,t[1]=n[1]*e),t},e.dot=function(t,n){return t[0]*n[0]+t[1]*n[1]},e.cross=function(t,n,r){var a=n[0]*r[1]-n[1]*r[0];return t[0]=t[1]=0,t[2]=a,t},e.lerp=function(t,n,r,a){var e=n[0],u=n[1];return t[0]=e+a*(r[0]-e),t[1]=u+a*(r[1]-u),t},e.random=function(t,n){n=n||1;var r=2*a.RANDOM()*Math.PI;return t[0]=Math.cos(r)*n,t[1]=Math.sin(r)*n,t},e.transformMat2=function(t,n,r){var a=n[0],e=n[1];return t[0]=r[0]*a+r[2]*e,t[1]=r[1]*a+r[3]*e,t},e.transformMat2d=function(t,n,r){var a=n[0],e=n[1];return t[0]=r[0]*a+r[2]*e+r[4],t[1]=r[1]*a+r[3]*e+r[5],t},e.transformMat3=function(t,n,r){
var a=n[0],e=n[1];return t[0]=r[0]*a+r[3]*e+r[6],t[1]=r[1]*a+r[4]*e+r[7],t},e.transformMat4=function(t,n,r){var a=n[0],e=n[1];return t[0]=r[0]*a+r[4]*e+r[12],t[1]=r[1]*a+r[5]*e+r[13],t},e.forEach=function(){var t=e.create();return function(n,r,a,e,u,o){var i,c;for(r||(r=2),a||(a=0),c=e?Math.min(e*r+a,n.length):n.length,i=a;c>i;i+=r)t[0]=n[i],t[1]=n[i+1],u(t,t,o),n[i]=t[0],n[i+1]=t[1];return n}}(),e.str=function(t){return"vec2("+t[0]+", "+t[1]+")"},t.exports=e}])});
/*

 JS Signals <http://millermedeiros.github.com/js-signals/>
 Released under the MIT license
 Author: Miller Medeiros
 Version: 1.0.0 - Build: 268 (2012/11/29 05:48 PM)
*/
(function(i){function h(a,b,c,d,e){this._listener=b;this._isOnce=c;this.context=d;this._signal=a;this._priority=e||0}function g(a,b){if(typeof a!=="function")throw Error("listener is a required param of {fn}() and should be a Function.".replace("{fn}",b));}function e(){this._bindings=[];this._prevParams=null;var a=this;this.dispatch=function(){e.prototype.dispatch.apply(a,arguments)}}h.prototype={active:!0,params:null,execute:function(a){var b;this.active&&this._listener&&(a=this.params?this.params.concat(a):
a,b=this._listener.apply(this.context,a),this._isOnce&&this.detach());return b},detach:function(){return this.isBound()?this._signal.remove(this._listener,this.context):null},isBound:function(){return!!this._signal&&!!this._listener},isOnce:function(){return this._isOnce},getListener:function(){return this._listener},getSignal:function(){return this._signal},_destroy:function(){delete this._signal;delete this._listener;delete this.context},toString:function(){return"[SignalBinding isOnce:"+this._isOnce+
", isBound:"+this.isBound()+", active:"+this.active+"]"}};e.prototype={VERSION:"1.0.0",memorize:!1,_shouldPropagate:!0,active:!0,_registerListener:function(a,b,c,d){var e=this._indexOfListener(a,c);if(e!==-1){if(a=this._bindings[e],a.isOnce()!==b)throw Error("You cannot add"+(b?"":"Once")+"() then add"+(!b?"":"Once")+"() the same listener without removing the relationship first.");}else a=new h(this,a,b,c,d),this._addBinding(a);this.memorize&&this._prevParams&&a.execute(this._prevParams);return a},
_addBinding:function(a){var b=this._bindings.length;do--b;while(this._bindings[b]&&a._priority<=this._bindings[b]._priority);this._bindings.splice(b+1,0,a)},_indexOfListener:function(a,b){for(var c=this._bindings.length,d;c--;)if(d=this._bindings[c],d._listener===a&&d.context===b)return c;return-1},has:function(a,b){return this._indexOfListener(a,b)!==-1},add:function(a,b,c){g(a,"add");return this._registerListener(a,!1,b,c)},addOnce:function(a,b,c){g(a,"addOnce");return this._registerListener(a,
!0,b,c)},remove:function(a,b){g(a,"remove");var c=this._indexOfListener(a,b);c!==-1&&(this._bindings[c]._destroy(),this._bindings.splice(c,1));return a},removeAll:function(){for(var a=this._bindings.length;a--;)this._bindings[a]._destroy();this._bindings.length=0},getNumListeners:function(){return this._bindings.length},halt:function(){this._shouldPropagate=!1},dispatch:function(a){if(this.active){var b=Array.prototype.slice.call(arguments),c=this._bindings.length,d;if(this.memorize)this._prevParams=
b;if(c){d=this._bindings.slice();this._shouldPropagate=!0;do c--;while(d[c]&&this._shouldPropagate&&d[c].execute(b)!==!1)}}},forget:function(){this._prevParams=null},dispose:function(){this.removeAll();delete this._bindings;delete this._prevParams},toString:function(){return"[Signal active:"+this.active+" numListeners:"+this.getNumListeners()+"]"}};var f=e;f.Signal=e;typeof define==="function"&&define.amd?define(function(){return f}):typeof module!=="undefined"&&module.exports?module.exports=f:i.signals=
f})(this);
/*! eztends 03-08-2015 */
!function(a){var b=function(a,b){function c(){this.constructor=a}for(var d in b)b.hasOwnProperty(d)&&(a[d]=b[d]);c.prototype=b.prototype,a.prototype=new c};"function"==typeof define&&define.amd?define(function(){return b}):"undefined"!=typeof module&&module.exports?module.exports=b:a.eztends=b}(this);
var EZ3 = {
  VERSION: '1.0.0',

  extends: eztends,

  Vec2: vec2,
  Vec3: vec3,
  Vec4: vec4,
  Mat2: mat2,
  Mat3: mat3,
  Mat4: mat4,
  Signal: signals.Signal,
};

EZ3.Buffer = function() {

  this._buffer = [];
  this._bufferSize = {};
  this._bufferData = {};

  this._buffer[EZ3.Buffer.UV] = -1;
  this._buffer[EZ3.Buffer.INDEX] = -1;
  this._buffer[EZ3.Buffer.VERTEX] = -1;
  this._buffer[EZ3.Buffer.NORMAL] = -1;
  this._buffer[EZ3.Buffer.TANGENT] = -1;
  this._buffer[EZ3.Buffer.BITANGENT] = -1;

};

EZ3.Buffer.VERTEX = 0;
EZ3.Buffer.NORMAL = 1;
EZ3.Buffer.INDEX = 2;
EZ3.Buffer.UV = 3;
EZ3.Buffer.TANGENT = 4;
EZ3.Buffer.BITANGENT = 5;

EZ3.Buffer.VERTEX_LAYOUT = 0;
EZ3.Buffer.NORMAL_LAYOUT = 1;
EZ3.Buffer.UV_LAYOUT = 2;
EZ3.Buffer.TANGENT_LAYOUT = 3;
EZ3.Buffer.BITANGENT_LAYOUT = 4;

EZ3.Buffer.VERTEX_SIZE = 3;
EZ3.Buffer.NORMAL_SIZE = 3;
EZ3.Buffer.UV_SIZE = 2;
EZ3.Buffer.TANGENT_SIZE = 4;
EZ3.Buffer.BITANGENT_SIZE = 3;

EZ3.Buffer.prototype.fill = function(buffer, size, data) {
  this._bufferData[buffer] = data;
  this._bufferSize[buffer] = size;
};

EZ3.Buffer.prototype.draw = function(gl) {

  gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer[EZ3.Buffer.VERTEX]);
  gl.enableVertexAttribArray(EZ3.Buffer.VERTEX_LAYOUT);
  gl.vertexAttribPointer(EZ3.Buffer.VERTEX_LAYOUT, EZ3.Buffer.VERTEX_SIZE, gl.FLOAT, false, 0, 0);

  if(this._bufferSize[EZ3.Buffer.NORMAL]) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer[EZ3.Buffer.NORMAL]);
    gl.enableVertexAttribArray(EZ3.Buffer.NORMAL_LAYOUT);
    gl.vertexAttribPointer(EZ3.Buffer.NORMAL_LAYOUT, EZ3.Buffer.NORMAL_SIZE, gl.FLOAT, false, 0, 0);
  }

  if(this._bufferSize[EZ3.Buffer.UV]) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer[EZ3.Buffer.UV]);
    gl.enableVertexAttribArray(EZ3.Buffer.UV_LAYOUT);
    gl.vertexAttribPointer(EZ3.Buffer.UV_LAYOUT, EZ3.Buffer.UV_SIZE, gl.FLOAT, false, 0, 0);
  }

  if(this._bufferSize[EZ3.Buffer.TANGENT]) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer[EZ3.Buffer.TANGENT]);
    gl.enableVertexAttribArray(EZ3.Buffer.TANGENT_LAYOUT);
    gl.vertexAttribPointer(EZ3.Buffer.TANGENT_LAYOUT, EZ3.Buffer.TANGENT_SIZE, gl.FLOAT, false, 0, 0);
  }

  if(this._bufferSize[EZ3.Buffer.BITANGENT]) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer[EZ3.Buffer.BITANGENT]);
    gl.enableVertexAttribArray(EZ3.Buffer.BITANGENT_LAYOUT);
    gl.vertexAttribPointer(EZ3.Buffer.BITANGENT_LAYOUT, EZ3.Buffer.BITANGENT_SIZE, gl.FLOAT, false, 0, 0);
  }

  if(this._bufferSize[EZ3.Buffer.INDEX]){
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._buffer[EZ3.Buffer.INDEX]);
    gl.drawElements(gl.TRIANGLES, this._bufferSize[EZ3.Buffer.INDEX], gl.UNSIGNED_SHORT, 0);
  }else{
    gl.drawArrays(gl.TRIANGLES, 0, this._bufferSize[EZ3.Buffer.VERTEX] / 3);
  }

};

EZ3.Buffer.prototype.init = function(gl) {

  if(this._bufferSize[EZ3.Buffer.VERTEX]) {
    this._buffer[EZ3.Buffer.VERTEX] = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer[EZ3.Buffer.VERTEX]);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._bufferData[EZ3.Buffer.VERTEX]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  if(this._bufferSize[EZ3.Buffer.NORMAL]) {
    this._buffer[EZ3.Buffer.NORMAL] = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer[EZ3.Buffer.NORMAL]);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._bufferData[EZ3.Buffer.NORMAL]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  if(this._bufferSize[EZ3.Buffer.INDEX]) {
    this._buffer[EZ3.Buffer.INDEX] = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._buffer[EZ3.Buffer.INDEX]);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this._bufferData[EZ3.Buffer.INDEX]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }

  if(this._bufferSize[EZ3.Buffer.UV]) {
    this._buffer[EZ3.Buffer.UV] = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer[EZ3.Buffer.UV]);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._bufferData[EZ3.Buffer.UV]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  if(this._bufferSize[EZ3.Buffer.TANGENT]) {
    this._buffer[EZ3.Buffer.TANGENT] = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer[EZ3.Buffer.TANGENT]);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._bufferData[EZ3.Buffer.TANGENT]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  if(this._bufferSize[EZ3.Buffer.BITANGENT]) {
    this._buffer[EZ3.Buffer.BITANGENT] = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer[EZ3.Buffer.BITANGENT]);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._bufferData[EZ3.Buffer.BITANGENT]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

};

EZ3.Engine = function(canvas, options) {
  this.canvas = canvas || document.createElement('canvas');
  this.canvas.width = canvas.width || 800;
  this.canvas.height = canvas.height || 600;
  try {
    this.gl = canvas.getContext('webgl', options) || canvas.getContext('experimental-webgl', options);
  } catch(e) {
    throw new Error('WebGl not supported');
  }
  this.setViewport(0, 0, this.canvas.width, this.canvas.height);
};

EZ3.Engine.prototype.setViewport = function(x, y, width, height) {
  this.gl.viewport(x, y, width, height);
};



EZ3.Keyboard = function(domElement) {
  this._domElement = domElement;
  this._keys = [];

  this.enabled = false;
  this.signals = {};
  this.signals.onKeyPress = new EZ3.Signal();
  this.signals.onKeyDown = new EZ3.Signal();
  this.signals.onKeyRelease = new EZ3.Signal();
};

EZ3.Keyboard.prototype._processKeyDown = function(event) {
  if(!this._keys[event.keyCode])
    this._keys[event.keyCode] = new EZ3.Switch(event.keyCode);

  this._keys[event.keyCode].processDown(this.signals.onKeyPress, this.signals.onKeyDown);
};

EZ3.Keyboard.prototype._processKeyUp = function(event) {
  this._keys[event.keyCode].processUp(this.signals.onKeyRelease);
};

EZ3.Keyboard.prototype.enable = function() {
  var that = this;

  this.enabled = true;

  this._onKeyDown = function(event) {
    that._processKeyDown(event);
  };
  this._onKeyUp = function(event) {
    that._processKeyUp(event);
  };

  this._domElement.addEventListener('keydown', this._onKeyDown, false);
	this._domElement.addEventListener('keyup', this._onKeyUp, false);
};

EZ3.Keyboard.prototype.disable = function() {
  this.enabled = false;

  this._domElement.removeEventListener('keydown', this._onKeyDown);
	this._domElement.removeEventListener('keyup', this._onKeyUp);
};

EZ3.Keyboard.prototype.getKey = function(keyCode) {
  if(!this._keys[keyCode])
    this._keys[keyCode] = new EZ3.Switch(keyCode);

  return this._keys[keyCode];
};

EZ3.Keyboard.A = 'A'.charCodeAt(0);
EZ3.Keyboard.B = 'B'.charCodeAt(0);
EZ3.Keyboard.C = 'C'.charCodeAt(0);
EZ3.Keyboard.D = 'D'.charCodeAt(0);
EZ3.Keyboard.E = 'E'.charCodeAt(0);
EZ3.Keyboard.F = 'F'.charCodeAt(0);
EZ3.Keyboard.G = 'G'.charCodeAt(0);
EZ3.Keyboard.H = 'H'.charCodeAt(0);
EZ3.Keyboard.I = 'I'.charCodeAt(0);
EZ3.Keyboard.J = 'J'.charCodeAt(0);
EZ3.Keyboard.K = 'K'.charCodeAt(0);
EZ3.Keyboard.L = 'L'.charCodeAt(0);
EZ3.Keyboard.M = 'M'.charCodeAt(0);
EZ3.Keyboard.N = 'N'.charCodeAt(0);
EZ3.Keyboard.O = 'O'.charCodeAt(0);
EZ3.Keyboard.P = 'P'.charCodeAt(0);
EZ3.Keyboard.Q = 'Q'.charCodeAt(0);
EZ3.Keyboard.R = 'R'.charCodeAt(0);
EZ3.Keyboard.S = 'S'.charCodeAt(0);
EZ3.Keyboard.T = 'T'.charCodeAt(0);
EZ3.Keyboard.U = 'U'.charCodeAt(0);
EZ3.Keyboard.V = 'V'.charCodeAt(0);
EZ3.Keyboard.W = 'W'.charCodeAt(0);
EZ3.Keyboard.X = 'X'.charCodeAt(0);
EZ3.Keyboard.Y = 'Y'.charCodeAt(0);
EZ3.Keyboard.Z = 'Z'.charCodeAt(0);
EZ3.Keyboard.ZERO = '0'.charCodeAt(0);
EZ3.Keyboard.ONE = '1'.charCodeAt(0);
EZ3.Keyboard.TWO = '2'.charCodeAt(0);
EZ3.Keyboard.THREE = '3'.charCodeAt(0);
EZ3.Keyboard.FOUR = '4'.charCodeAt(0);
EZ3.Keyboard.FIVE = '5'.charCodeAt(0);
EZ3.Keyboard.SIX = '6'.charCodeAt(0);
EZ3.Keyboard.SEVEN = '7'.charCodeAt(0);
EZ3.Keyboard.EIGHT = '8'.charCodeAt(0);
EZ3.Keyboard.NINE = '9'.charCodeAt(0);
EZ3.Keyboard.NUMPAD_0 = 96;
EZ3.Keyboard.NUMPAD_1 = 97;
EZ3.Keyboard.NUMPAD_2 = 98;
EZ3.Keyboard.NUMPAD_3 = 99;
EZ3.Keyboard.NUMPAD_4 = 100;
EZ3.Keyboard.NUMPAD_5 = 101;
EZ3.Keyboard.NUMPAD_6 = 102;
EZ3.Keyboard.NUMPAD_7 = 103;
EZ3.Keyboard.NUMPAD_8 = 104;
EZ3.Keyboard.NUMPAD_9 = 105;
EZ3.Keyboard.NUMPAD_MULTIPLY = 106;
EZ3.Keyboard.NUMPAD_ADD = 107;
EZ3.Keyboard.NUMPAD_ENTER = 108;
EZ3.Keyboard.NUMPAD_SUBTRACT = 109;
EZ3.Keyboard.NUMPAD_DECIMAL = 110;
EZ3.Keyboard.NUMPAD_DIVIDE = 111;
EZ3.Keyboard.F1 = 112;
EZ3.Keyboard.F2 = 113;
EZ3.Keyboard.F3 = 114;
EZ3.Keyboard.F4 = 115;
EZ3.Keyboard.F5 = 116;
EZ3.Keyboard.F6 = 117;
EZ3.Keyboard.F7 = 118;
EZ3.Keyboard.F8 = 119;
EZ3.Keyboard.F9 = 120;
EZ3.Keyboard.F10 = 121;
EZ3.Keyboard.F11 = 122;
EZ3.Keyboard.F12 = 123;
EZ3.Keyboard.F13 = 124;
EZ3.Keyboard.F14 = 125;
EZ3.Keyboard.F15 = 126;
EZ3.Keyboard.COLON = 186;
EZ3.Keyboard.EQUALS = 187;
EZ3.Keyboard.COMMA = 188;
EZ3.Keyboard.UNDERSCORE = 189;
EZ3.Keyboard.PERIOD = 190;
EZ3.Keyboard.QUESTION_MARK = 191;
EZ3.Keyboard.TILDE = 192;
EZ3.Keyboard.OPEN_BRACKET = 219;
EZ3.Keyboard.BACKWARD_SLASH = 220;
EZ3.Keyboard.CLOSED_BRACKET = 221;
EZ3.Keyboard.QUOTES = 222;
EZ3.Keyboard.BACKSPACE = 8;
EZ3.Keyboard.TAB = 9;
EZ3.Keyboard.CLEAR = 12;
EZ3.Keyboard.ENTER = 13;
EZ3.Keyboard.SHIFT = 16;
EZ3.Keyboard.CONTROL = 17;
EZ3.Keyboard.ALT = 18;
EZ3.Keyboard.CAPS_LOCK = 20;
EZ3.Keyboard.ESC = 27;
EZ3.Keyboard.SPACEBAR = 32;
EZ3.Keyboard.PAGE_UP = 33;
EZ3.Keyboard.PAGE_DOWN = 34;
EZ3.Keyboard.END = 35;
EZ3.Keyboard.HOME = 36;
EZ3.Keyboard.LEFT = 37;
EZ3.Keyboard.UP = 38;
EZ3.Keyboard.RIGHT = 39;
EZ3.Keyboard.DOWN = 40;
EZ3.Keyboard.PLUS = 43;
EZ3.Keyboard.MINUS = 44;
EZ3.Keyboard.INSERT = 45;
EZ3.Keyboard.DELETE = 46;
EZ3.Keyboard.HELP = 47;
EZ3.Keyboard.NUM_LOCK = 144;

EZ3.Mouse = function(domElement) {
  this._domElement = domElement;

  this.pointer = new EZ3.MousePointer();
  this.enabled = false;
};

EZ3.Mouse.prototype._processMousePointerDown = function(event) {
  this.pointer.processButtonDown(event);
};

EZ3.Mouse.prototype._processMousePointerMove = function(event) {
  this.pointer.processButtonMove(event);
};

EZ3.Mouse.prototype._processMousePointerUp = function(event) {
  this.pointer.processButtonUp(event);
};

EZ3.Mouse.prototype._processMousePointerWheel = function(event) {
  this.pointer.processWheel(event);
};

EZ3.Mouse.prototype.enable = function() {
  var that = this;

  this.enabled = true;

  this._onMousePointerDown = function (event) {
    that._processDown(event);
  };

  this._onMousePointerMove = function (event) {
    that._processMove(event);
  };

  this._onMousePointerUp = function (event) {
    that._processUp(event);
  };

  this._onMousePointerWheel = function(event) {
    that._processWheel(event);
  };

  this._domElement.addEventListener('mousedown', this._onMousePointerDown, true);
  this._domElement.addEventListener('mousemove', this._onMousePointerMove, true);
  this._domElement.addEventListener('mouseup', this._onMousePointerUp, true);
  this._domElement.addEventListener('mousewheel', this._onMousePointerWheel, true);
  this._domElement.addEventListener('DOMMouseScroll', this._onMousePointerWheel, true);
};

EZ3.Mouse.prototype.disable = function() {
  this.enabled = false;

  this._domElement.removeEventListener('mousedown', this._onMousePointerDown, true);
  this._domElement.removeEventListener('mousemove', this._onMousePointerMove, true);
  this._domElement.removeEventListener('mouseup', this._onMousePointerUp, true);
  this._domElement.removeEventListener('mousewheel', this._onMousePointerWheel, true);
  this._domElement.removeEventListener('DOMMouseScroll', this._onMousePointerWheel, true);
};

EZ3.Mouse.prototype.constructor = EZ3.Mouse;

EZ3.Mouse.LEFT_BUTTON = 0;
EZ3.Mouse.RIGHT_BUTTON = 1;
EZ3.Mouse.MIDDLE_BUTTON = 2;
EZ3.Mouse.BACK_BUTTON = 3;
EZ3.Mouse.FORWARD_BUTTON = 4;

EZ3.MousePointer = function() {
  EZ3.Pointer.call(this, 1);
  EZ3.Extends(this, EZ3.Pointer);

  this._buttons = [];
  this.wheel = EZ3.Vec2.create();
};

EZ3.MousePointer.prototype.processButtonDown = function(event) {
  this._states[event.button] = true;
  EZ3.Pointer.prototype.processDown.call(this, event);
};

EZ3.MousePointer.prototype.processWheel = function(event) {
  if (event.wheelDeltaX)
    this.wheel[0] = event.wheelDeltaX;
  else
    this.wheel[1] = event.deltaX;

  if (event.wheelDeltaY)
    this.wheel[0] = event.wheelDeltaY;
  else
    this.wheel[1] = event.deltaY;
};

EZ3.MousePointer.prototype.getButton = function(buttonCode) {
  if(!this._buttons[buttonCode])
    this._buttons[buttonCode] = new EZ3.Button(buttonCode);
};

EZ3.MousePointer.prototype.constructor = EZ3.MousePointer;

EZ3.Pointer = function(id) {
  this.id = id;
  this.client = EZ3.Vec2.create();
  this.page = EZ3.Vec2.create();
  this.screen = EZ3.Vec2.create();
};

EZ3.Pointer.prototype.processDown = function(event) {
  this.processMove(event);
};

EZ3.Pointer.prototype.processMove = function(event) {
  this.client[0] = event.clientX;
  this.client[1] = event.clientY;

  this.page[0] = event.pageX;
  this.page[1] = event.pageY;

  this.screen[0] = event.screenX;
  this.screen[0] = event.screenY;
};

EZ3.Pointer.prototype.constructor = EZ3.Pointer;

EZ3.Switch = function(code) {
  this._state = false;

  this.code = code;
};

EZ3.Switch.prototype.processDown = function(onPress, onDown) {
  var isUp = this.isUp();

  this._state = true;

  if(isUp && onPress)
    onPress.dispatch(this);

  if(onDown)
    onDown.dispatch(this);
};

EZ3.Switch.prototype.processUp = function(onRelease) {
  this._state = false;

  if(onRelease)
    onRelease.dispatch(this);
};

EZ3.Switch.prototype.isDown = function() {
  return this._state;
};

EZ3.Switch.prototype.isUp = function() {
  return !this._state;
};

EZ3.Switch.prototype.constructor = EZ3.Switch;

EZ3.Geometry = function() {
  this._uv = [];
  this._indices = [];
  this._normals = [];
  this._vertices = [];
  this._tangents = [];
  this._bitangents = [];
  this._maxPoint = vec3.create();
  this._minPoint = vec3.create();
  this._midPoint = vec3.create();
  this._buffer = new EZ3.Buffer();
};

EZ3.Geometry.PI = Math.PI;
EZ3.Geometry.HALF_PI = 0.5 * Math.PI;
EZ3.Geometry.DOUBLE_PI = 2.0 * Math.PI;

EZ3.Geometry.prototype.draw = function(gl) {
  this._buffer.draw(gl);
};

EZ3.Geometry.prototype.init = function(gl) {
  this._buffer.init(gl);
};

EZ3.Geometry.prototype.fill = function(buffer, size, data) {
  this._buffer.fill(buffer, size, data);
};

EZ3.Geometry.prototype.initArray = function(size, value) {
  return Array.apply(null, new Array(size)).map(function() {
    return value;
  });
};

EZ3.Geometry.prototype.calculateNormals = function() {
  var x, y, z, k;
  var normal, point0, point1, point2, vector0, vector1;

  normal  = vec3.create();
  point0  = vec3.create();
  point1  = vec3.create();
  point2  = vec3.create();
  vector0 = vec3.create();
  vector1 = vec3.create();

  var temporalNormals = this.initArray(this._vertices.length, 0);
  var temporalAppearances = this.initArray(this._vertices.length / 3, 0);

  for(k = 0; k < this._indices.length; k += 3) {

    x = 3 * this._indices[k + 0];
    y = 3 * this._indices[k + 1];
    z = 3 * this._indices[k + 2];

    vec3.set(point0, this._vertices[x + 0], this._vertices[x + 1], this._vertices[x + 2]);
    vec3.set(point1, this._vertices[y + 0], this._vertices[y + 1], this._vertices[y + 2]);
    vec3.set(point2, this._vertices[z + 0], this._vertices[z + 1], this._vertices[z + 2]);

    vec3.sub(vector0, point1, point0);
    vec3.sub(vector1, point2, point0);

    vec3.cross(normal, vector0, vector1);

    if(normal.x !== 0 || normal.y !== 0 || normal.z !== 0) {
      vec3.normalize(normal, normal);
    }

    temporalNormals[x + 0] += normal[0];
    temporalNormals[x + 1] += normal[1];
    temporalNormals[x + 2] += normal[2];

    temporalNormals[y + 0] += normal[0];
    temporalNormals[y + 1] += normal[1];
    temporalNormals[y + 2] += normal[2];

    temporalNormals[z + 0] += normal[0];
    temporalNormals[z + 1] += normal[1];
    temporalNormals[z + 2] += normal[2];

    ++temporalAppearances[x / 3];
    ++temporalAppearances[y / 3];
    ++temporalAppearances[z / 3];
  }

  for(k = 0; k < this._vertices.length / 3; ++k){
    x = 3 * k + 0;
    y = 3 * k + 1;
    z = 3 * k + 2;

    this._normals.push(temporalNormals[x] / temporalAppearances[k]);
    this._normals.push(temporalNormals[y] / temporalAppearances[k]);
    this._normals.push(temporalNormals[z] / temporalAppearances[k]);
  }

  temporalNormals.splice(0, temporalNormals.length);
  temporalAppearances.splice(0, temporalAppearances.length);
};

EZ3.Geometry.prototype.updateMaxPoint = function(x, y, z) {
  this._maxPoint[0] = Math.max(this._maxPoint[0], x);
  this._maxPoint[1] = Math.max(this._maxPoint[1], y);
  this._maxPoint[2] = Math.max(this._maxPoint[2], z);
};

EZ3.Geometry.prototype.updateMinPoint = function(x, y, z) {
  this._minPoint[0] = Math.min(this._minPoint[0], x);
  this._minPoint[1] = Math.min(this._minPoint[1], y);
  this._minPoint[2] = Math.min(this._minPoint[2], z);
};

EZ3.Geometry.prototype.calculateMidPoint = function () {
  this._midPoint[0] = (this._maxPoint[0] + this._minPoint[0]) * 0.5;
  this._midPoint[0] = (this._maxPoint[1] + this._minPoint[1]) * 0.5;
  this._midPoint[0] = (this._maxPoint[2] + this._minPoint[2]) * 0.5;
};

EZ3.Geometry.prototype.calculateTangents = function() {

};

EZ3.Geometry.prototype.calculateBoundingBox = function() {

};


EZ3.AstroidalEllipsoid = function(radiusx, radiusy, radiusz, stacks, slices) {
  EZ3.Geometry.call(this);

  this._slices = slices;
  this._stacks = stacks;
  this._radiusx = radiusx;
  this._radiusy = radiusy;
  this._radiusz = radiusz;

  this._create();
};

EZ3.AstroidalEllipsoid.prototype = Object.create(EZ3.Geometry.prototype);

EZ3.AstroidalEllipsoid.prototype._create = function() {
  var s, t, cosS, cosT, sinS, sinT, phi, rho, u, v, normal, vertex, totalSlices, totalStacks;

  vertex = vec3.create();
  normal = vec3.create();

  totalSlices = 1.0 / (this._slices - 1);
  totalStacks = 1.0 / (this._stacks - 1);

  for(s = 0; s < this._slices; ++s) {
    for(t = 0; t < this._stacks; ++t) {
      u = s * totalSlices;
      v = t * totalStacks;

      phi = EZ3.Geometry.DOUBLE_PI * u - EZ3.Geometry.PI;
      rho = EZ3.Geometry.PI * v - EZ3.Geometry.HALF_PI;

      cosS = Math.pow(Math.cos(phi), 3.0);
      cosT = Math.pow(Math.cos(rho), 3.0);
      sinS = Math.pow(Math.sin(phi), 3.0);
      sinT = Math.pow(Math.sin(rho), 3.0);

      vertex[0] = (this._radiusx * cosT * cosS);
      vertex[1] = (this._radiusy * sinT);
      vertex[2] = (this._radiusz * cosT * sinS);

      normal[0] = vertex[0] / this._xradius;
      normal[1] = vertex[1] / this._yradius;
      normal[2] = vertex[2] / this._zradius;

      vec3.normalize(normal, normal);

      this._uv.push(u);
      this._uv.push(v);

      this._normals.push(normal[0]);
      this._normals.push(normal[1]);
      this._normals.push(normal[2]);

      this._vertices.push(vertex[0]);
      this._vertices.push(vertex[1]);
      this._vertices.push(vertex[2]);
    }
  }

  for(s = 0; s < this._slices - 1; ++s) {
    for(t = 0; t < this._stacks - 1; ++t) {
      this._indices.push((s + 0) * this._stacks + (t + 0));
      this._indices.push((s + 0) * this._stacks + (t + 1));
      this._indices.push((s + 1) * this._stacks + (t + 1));

      this._indices.push((s + 0) * this._stacks + (t + 0));
      this._indices.push((s + 1) * this._stacks + (t + 1));
      this._indices.push((s + 1) * this._stacks + (t + 0));
    }
  }

  this._buffer.fill(EZ3.Buffer.VERTEX, this._vertices.length, this._vertices);
  this._buffer.fill(EZ3.Buffer.NORMAL, this._normals.length, this._normals);
  this._buffer.fill(EZ3.Buffer.INDEX, this._indices.length, this._indices);
  this._buffer.fill(EZ3.Buffer.UV, this._uv.length, this._uv);
};

EZ3.Box = function(width, height, depth) {
  EZ3.Geometry.call(this);

  this._width = width;
  this._depth = depth;
  this._height = height;

  this._halfWidth  = this._width * 0.5;
  this._halfDepth  = this._depth * 0.5;
  this._halfHeight = this._height * 0.5;

  this._create();
};

EZ3.Box.prototype = Object.create(EZ3.Geometry.prototype);

EZ3.Box.prototype._create = function() {
  this._vertices = [
    +this._halfWidth, +this._halfHeight, +this._halfDepth,
    -this._halfWidth, +this._halfHeight, +this._halfDepth,
    -this._halfWidth, -this._halfHeight, +this._halfDepth,
    +this._halfWidth, -this._halfHeight, +this._halfDepth,
    +this._halfWidth, -this._halfHeight, -this._halfDepth,
    -this._halfWidth, -this._halfHeight, -this._halfDepth,
    -this._halfWidth, +this._halfHeight, -this._halfDepth,
    +this._halfWidth, +this._halfHeight, -this._halfDepth
  ];

  this._indices = [
    0, 1 ,2,
    0, 2, 3,
    7, 4, 5,
    7, 5, 6,
    6, 5, 2,
    6, 2, 1,
    7, 0, 3,
    7, 3, 4,
    7, 6, 1,
    7, 1, 0,
    3, 2, 5,
    3, 5, 4
  ];

  this._uv = [

  ];

  this.calculateNormals();

  this._buffer.fill(EZ3.Buffer.VERTEX, this._vertices.length, this._vertices);
  this._buffer.fill(EZ3.Buffer.NORMAL, this._normals.length, this._normals);
  this._buffer.fill(EZ3.Buffer.INDEX, this._indices.length, this._indices);
  //this._buffer.fill(EZ3.Buffer.UV, this._uv.length, this._uv);
};

EZ3.Cone = function(base, height, slices, stacks) {
  EZ3.Geometry.call(this);

  this._base = base;
  this._height = height;
  this._slices = slices;
  this._stacks = stacks;

  this._create();
};

EZ3.Cone.prototype = Object.create(EZ3.Geometry.prototype);

EZ3.Cone.prototype._create = function() {

  var s, t, u, v, radius, actualHeight, vertex, normal, step, totalSlices, totalStacks;

  totalSlices = 1.0 / (this._slices - 1);
  totalStacks = 1.0 / (this._stacks - 1);

  actualHeight = this._height;
  step = (this._height - this._base) / this._slices;

  vertex = vec3.create();
  normal = vec3.create();

  for(s = 0; s < this._slices; ++s) {
    for(t = 0; t < this._stacks; ++t) {

      u = s * totalSlices;
      v = t * totalStacks;

      radius = Math.abs(this._height - actualHeight) * 0.5;

      vertex[0] = radius * Math.cos(EZ3.Geometry.DOUBLE_PI * v);
      vertex[1] = actualHeight;
      vertex[2] = radius * Math.sin(EZ3.Geometry.DOUBLE_PI * v);

      normal[0] = vertex[0];
      normal[1] = vertex[1];
      normal[2] = vertex[2];

      vec3.normalize(normal, normal);

      this._vertices.push(vertex[0]);
      this._vertices.push(vertex[1]);
      this._vertices.push(vertex[2]);

      this._uv.push(u);
      this._uv.push(v);

    }

    actualHeight -= step;

    if(actualHeight < this._base)
      break;

  }

  for(s = 0; s < this._slices - 1; ++s) {
    for(t = 0; t < this._stacks - 1; ++t) {

      this._indices.push((s + 0) * this._stacks + (t + 0));
      this._indices.push((s + 0) * this._stacks + (t + 1));
      this._indices.push((s + 1) * this._stacks + (t + 1));

      this._indices.push((s + 0) * this._stacks + (t + 0));
      this._indices.push((s + 1) * this._stacks + (t + 1));
      this._indices.push((s + 1) * this._stacks + (t + 0));

    }
  }

  this.calculateNormals();

  this._buffer.fill(EZ3.Buffer.VERTEX, this._vertices.length, this._vertices);
  this._buffer.fill(EZ3.Buffer.NORMAL, this._normals.length, this._normals);
  this._buffer.fill(EZ3.Buffer.INDEX, this._indices.length, this._indices);
  this._buffer.fill(EZ3.Buffer.UV, this._uv.length, this._uv);

};

EZ3.Cylinder = function(radius, base, height, slices, stacks) {
  EZ3.Geometry.call(this);

  this._base = base;
  this._radius = radius;
  this._height = height;
  this._slices = slices;
  this._stacks = stacks;

  this._create();
};

EZ3.Cylinder.prototype = Object.create(EZ3.Geometry.prototype);

EZ3.Cylinder.prototype._create = function() {

  var s, t, u, v, actualHeight, vertex, normal, step, totalSlices, totalStacks;

  totalSlices = 1.0 / (this._slices - 1);
  totalStacks = 1.0 / (this._stacks - 1);

  actualHeight = this._height;
  step = (this._height - this._base) / this._slices;

  vertex = vec3.create();
  normal = vec3.create();

  for(s = 0; s < this._slices; ++s) {
    for(t = 0; t < this._stacks; ++t) {

      u = s * totalSlices;
      v = t * totalStacks;

      vertex[0] = this._radius * Math.cos(EZ3.Geometry.DOUBLE_PI * v);
      vertex[1] = actualHeight;
      vertex[2] = this._radius * Math.sin(EZ3.Geometry.DOUBLE_PI * v);

      vec3.set(normal, vertex[0], vertex[1], vertex[2]);
      vec3.normalize(normal, normal);

      this._vertices.push(vertex[0]);
      this._vertices.push(vertex[1]);
      this._vertices.push(vertex[2]);

      this._uv.push(u);
      this._uv.push(v);

    }

    actualHeight -= step;

    if(actualHeight < this._base)
      break;

  }

  for(s = 0; s < this._slices - 1; ++s) {
    for(t = 0; t < this._stacks - 1; ++t) {

      this._indices.push((s + 0) * this._stacks + (t + 0));
      this._indices.push((s + 0) * this._stacks + (t + 1));
      this._indices.push((s + 1) * this._stacks + (t + 1));

      this._indices.push((s + 0) * this._stacks + (t + 0));
      this._indices.push((s + 1) * this._stacks + (t + 1));
      this._indices.push((s + 1) * this._stacks + (t + 0));

    }
  }

  this.calculateNormals();

  this._buffer.fill(EZ3.Buffer.VERTEX, this._vertices.length, this._vertices);
  this._buffer.fill(EZ3.Buffer.NORMAL, this._normals.length, this._normals);
  this._buffer.fill(EZ3.Buffer.INDEX, this._indices.length, this._indices);
  this._buffer.fill(EZ3.Buffer.UV, this._uv.length, this._uv);

};

EZ3.Ellipsoid = function(xRadius, yRadius, zRadius, slices, stacks) {
  EZ3.Geometry.call(this);

  this._slices = slices;
  this._stacks = stacks;
  this._xRadius = xRadius;
  this._yRadius = yRadius;
  this._zRadius = zRadius;

  this._create();
};

EZ3.Ellipsoid.prototype = Object.create(EZ3.Geometry.prototype);

EZ3.Ellipsoid.prototype._create = function() {
  var s, t, phi, rho, u, v, normal, vertex, totalSlices, totalStacks;

  vertex = vec3.create();
  normal = vec3.create();

  totalSlices = 1.0 / (this._slices - 1);
  totalStacks = 1.0 / (this._stacks - 1);

  for(s = 0; s < this._slices; ++s) {
    for(t = 0; t < this._stacks; ++t) {
      u = s * totalSlices;
      v = t * totalStacks;

      phi = EZ3.Geometry.DOUBLE_PI * u;
      rho = EZ3.Geometry.PI * v;

      vertex[0] = (this._xRadius * Math.cos(phi) * Math.sin(rho));
      vertex[1] = (this._yRadius * Math.sin(rho - EZ3.Geometry.HALF_PI));
      vertex[2] = (this._zRadius * Math.sin(phi) * Math.sin(rho));

      normal[0] = vertex[0] / this._xRadius;
      normal[1] = vertex[1] / this._yRadius;
      normal[2] = vertex[2] / this._zRadius;

      vec3.normalize(normal, normal);

      this._uv.push(u);
      this._uv.push(v);

      this._normals.push(normal[0]);
      this._normals.push(normal[1]);
      this._normals.push(normal[2]);

      this._vertices.push(vertex[0]);
      this._vertices.push(vertex[1]);
      this._vertices.push(vertex[2]);
    }
  }

  for(s = 0; s < this._slices - 1; ++s) {
    for(t = 0; t < this._stacks - 1; ++t) {
      this._indices.push((s + 0) * this._stacks + (t + 0));
      this._indices.push((s + 0) * this._stacks + (t + 1));
      this._indices.push((s + 1) * this._stacks + (t + 1));

      this._indices.push((s + 0) * this._stacks + (t + 0));
      this._indices.push((s + 1) * this._stacks + (t + 1));
      this._indices.push((s + 1) * this._stacks + (t + 0));
    }
  }

  this._buffer.fill(EZ3.Buffer.VERTEX, this._vertices.length, this._vertices);
  this._buffer.fill(EZ3.Buffer.NORMAL, this._normals.length, this._normals);
  this._buffer.fill(EZ3.Buffer.INDEX, this._indices.length, this._indices);
  this._buffer.fill(EZ3.Buffer.UV, this._uv.length, this._uv);
};

EZ3.Grid = function(width, height) {
  EZ3.Geometry.call(this);

  this._width = width;
  this._height = height;

  this._create();
};

EZ3.Grid.prototype = Object.create(EZ3.Geometry.prototype);

EZ3.Grid.prototype._create = function() {
  var index0, index1, index2, index3, z, x;

  for(z = 0; z < this._height + 1; ++z) {
    for(x = 0; x < this._width + 1; ++x) {
      this._vertices.push(x);
      this._vertices.push(0);
      this._vertices.push(z);

      this._uv.push(x / this._width);
      this._uv.push(z / this._height);
    }
  }

  for(z = 0; z < this._height; ++z) {
    for(x = 0; x < this._width; ++x) {
      index0 = z * (this._height + 1) + x;
      index1 = index0 + 1;
      index2 = index0 + (this._height + 1);
      index3 = index2 + 1;

      this._indices.push(index0);
      this._indices.push(index2);
      this._indices.push(index1);

      this._indices.push(index1);
      this._indices.push(index2);
      this._indices.push(index3);
    }
  }

  this.calculateNormals();

  this._buffer.fill(EZ3.Buffer.VERTEX, this._vertices.length, this._vertices);
  this._buffer.fill(EZ3.Buffer.NORMAL, this._normals.length, this._normals);
  this._buffer.fill(EZ3.Buffer.INDEX, this._indices.length, this._indices);
  this._buffer.fill(EZ3.Buffer.UV, this._uv.length, this._uv);
};

EZ3.Sphere = function(radius, slices, stacks) {
  EZ3.Geometry.call(this);

  this._radius = radius;
  this._slices = slices;
  this._stacks = stacks;

  this._create();
};

EZ3.Sphere.prototype = Object.create(EZ3.Geometry.prototype);

EZ3.Sphere.prototype._create = function() {
  var s, t, phi, rho, u, v, normal, vertex, totalSlices, totalStacks;

  vertex = vec3.create();
  normal = vec3.create();

  totalSlices = 1.0 / (this._slices - 1);
  totalStacks = 1.0 / (this._stacks - 1);

  for(s = 0; s < this._slices; ++s) {
    for(t = 0; t < this._stacks; ++t) {
      u = s * totalSlices;
      v = t * totalStacks;

      phi = EZ3.Geometry.DOUBLE_PI * u;
      rho = EZ3.Geometry.PI * v;

      vertex[0] = (this._radius * Math.cos(phi) * Math.sin(rho));
      vertex[1] = (this._radius * Math.sin(rho - EZ3.Geometry.HALF_PI));
      vertex[2] = (this._radius * Math.sin(phi) * Math.sin(rho));

      normal[0] = vertex[0] / this._radius;
      normal[1] = vertex[1] / this._radius;
      normal[2] = vertex[2] / this._radius;

      vec3.normalize(normal, normal);

      this._uv.push(u);
      this._uv.push(v);

      this._normals.push(normal[0]);
      this._normals.push(normal[1]);
      this._normals.push(normal[2]);

      this._vertices.push(vertex[0]);
      this._vertices.push(vertex[1]);
      this._vertices.push(vertex[2]);
    }
  }

  for(s = 0; s < this._slices - 1; ++s) {
    for(t = 0; t < this._stacks - 1; ++t) {
      this._indices.push((s + 0) * this._stacks + (t + 0));
      this._indices.push((s + 0) * this._stacks + (t + 1));
      this._indices.push((s + 1) * this._stacks + (t + 1));

      this._indices.push((s + 0) * this._stacks + (t + 0));
      this._indices.push((s + 1) * this._stacks + (t + 1));
      this._indices.push((s + 1) * this._stacks + (t + 0));
    }
  }

  this._buffer.fill(EZ3.Buffer.VERTEX, this._vertices.length, this._vertices);
  this._buffer.fill(EZ3.Buffer.NORMAL, this._normals.length, this._normals);
  this._buffer.fill(EZ3.Buffer.INDEX, this._indices.length, this._indices);
  this._buffer.fill(EZ3.Buffer.UV, this._uv.length, this._uv);
};

EZ3.Torus = function(innerRadius, outerRadius, sides, rings) {
  EZ3.Geometry.call(this);

  this._sides = sides;
  this._rings = rings;
  this._innerRadius = innerRadius;
  this._outerRadius = outerRadius;

  this._create();
};

EZ3.Torus.prototype = Object.create(EZ3.Geometry.prototype);

EZ3.Torus.prototype._create = function() {
  var vertex, normal, u, v, cosS, cosR, sinS, sinR, rho, phi, s, r, totalSides, totalRings;

  totalSides = 1.0 / (this._sides - 1);
  totalRings = 1.0 / (this._rings - 1);

  vertex = vec3.create();
  normal = vec3.create();

  for(s = 0; s < this._sides; ++s){
    for(r = 0; r < this._rings; ++r){
      u = s * totalSides;
      v = r * totalRings;

      rho = EZ3.Geometry.DOUBLE_PI * u;
      phi = EZ3.Geometry.DOUBLE_PI * v;

      cosS = Math.cos(rho);
      cosR = Math.cos(phi);
      sinS = Math.sin(rho);
      sinR = Math.sin(phi);

      vertex[0] = (this._innerRadius + this._outerRadius * cosR) * cosS;
      vertex[1] = (this._outerRadius * sinR);
      vertex[2] = (this._innerRadius + this._outerRadius * cosR) * sinS;

      normal[0] = vertex[0] - this._innerRadius * cosS;
      normal[1] = vertex[1];
      normal[2] = vertex[2] - this._innerRadius * sinS;

      vec3.normalize(normal, normal);

      this._uv.push(u);
      this._uv.push(v);

      this._normals.push(normal[0]);
      this._normals.push(normal[1]);
      this._normals.push(normal[2]);

      this._vertices.push(vertex[0]);
      this._vertices.push(vertex[1]);
      this._vertices.push(vertex[2]);
    }
  }

  for(s = 0; s < this._sides - 1; ++s){
    for(r = 0; r < this._rings - 1; ++r){
      this._indices.push((s + 0) * this._rings + (r + 0));
      this._indices.push((s + 0) * this._rings + (r + 1));
      this._indices.push((s + 1) * this._rings + (r + 1));

      this._indices.push((s + 0) * this._rings + (r + 0));
      this._indices.push((s + 1) * this._rings + (r + 1));
      this._indices.push((s + 1) * this._rings + (r + 0));
    }
  }

  this._buffer.fill(EZ3.Buffer.VERTEX, this._vertices.length, this._vertices);
  this._buffer.fill(EZ3.Buffer.NORMAL, this._normals.length, this._normals);
  this._buffer.fill(EZ3.Buffer.INDEX, this._indices.length, this._indices);
  this._buffer.fill(EZ3.Buffer.UV, this._uv.length, this._uv);
};
