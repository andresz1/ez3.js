!function(a,b){if("object"==typeof exports&&"object"==typeof module)module.exports=b();else if("function"==typeof define&&define.amd)define(b);else{var c=b();for(var d in c)("object"==typeof exports?exports:a)[d]=c[d]}}(this,function(){return function(a){function b(d){if(c[d])return c[d].exports;var e=c[d]={exports:{},id:d,loaded:!1};return a[d].call(e.exports,e,e.exports,b),e.loaded=!0,e.exports}var c={};return b.m=a,b.c=c,b.p="",b(0)}([function(a,b,c){b.glMatrix=c(1),b.mat2=c(2),b.mat2d=c(3),b.mat3=c(4),b.mat4=c(5),b.quat=c(6),b.vec2=c(9),b.vec3=c(7),b.vec4=c(8)},function(a,b){var c={};c.EPSILON=1e-6,c.ARRAY_TYPE="undefined"!=typeof Float32Array?Float32Array:Array,c.RANDOM=Math.random,c.setMatrixArrayType=function(a){GLMAT_ARRAY_TYPE=a};var d=Math.PI/180;c.toRadian=function(a){return a*d},a.exports=c},function(a,b,c){var d=c(1),e={};e.create=function(){var a=new d.ARRAY_TYPE(4);return a[0]=1,a[1]=0,a[2]=0,a[3]=1,a},e.clone=function(a){var b=new d.ARRAY_TYPE(4);return b[0]=a[0],b[1]=a[1],b[2]=a[2],b[3]=a[3],b},e.copy=function(a,b){return a[0]=b[0],a[1]=b[1],a[2]=b[2],a[3]=b[3],a},e.identity=function(a){return a[0]=1,a[1]=0,a[2]=0,a[3]=1,a},e.transpose=function(a,b){if(a===b){var c=b[1];a[1]=b[2],a[2]=c}else a[0]=b[0],a[1]=b[2],a[2]=b[1],a[3]=b[3];return a},e.invert=function(a,b){var c=b[0],d=b[1],e=b[2],f=b[3],g=c*f-e*d;return g?(g=1/g,a[0]=f*g,a[1]=-d*g,a[2]=-e*g,a[3]=c*g,a):null},e.adjoint=function(a,b){var c=b[0];return a[0]=b[3],a[1]=-b[1],a[2]=-b[2],a[3]=c,a},e.determinant=function(a){return a[0]*a[3]-a[2]*a[1]},e.multiply=function(a,b,c){var d=b[0],e=b[1],f=b[2],g=b[3],h=c[0],i=c[1],j=c[2],k=c[3];return a[0]=d*h+f*i,a[1]=e*h+g*i,a[2]=d*j+f*k,a[3]=e*j+g*k,a},e.mul=e.multiply,e.rotate=function(a,b,c){var d=b[0],e=b[1],f=b[2],g=b[3],h=Math.sin(c),i=Math.cos(c);return a[0]=d*i+f*h,a[1]=e*i+g*h,a[2]=d*-h+f*i,a[3]=e*-h+g*i,a},e.scale=function(a,b,c){var d=b[0],e=b[1],f=b[2],g=b[3],h=c[0],i=c[1];return a[0]=d*h,a[1]=e*h,a[2]=f*i,a[3]=g*i,a},e.fromRotation=function(a,b){var c=Math.sin(b),d=Math.cos(b);return a[0]=d,a[1]=c,a[2]=-c,a[3]=d,a},e.fromScaling=function(a,b){return a[0]=b[0],a[1]=0,a[2]=0,a[3]=b[1],a},e.str=function(a){return"mat2("+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+")"},e.frob=function(a){return Math.sqrt(Math.pow(a[0],2)+Math.pow(a[1],2)+Math.pow(a[2],2)+Math.pow(a[3],2))},e.LDU=function(a,b,c,d){return a[2]=d[2]/d[0],c[0]=d[0],c[1]=d[1],c[3]=d[3]-a[2]*c[1],[a,b,c]},a.exports=e},function(a,b,c){var d=c(1),e={};e.create=function(){var a=new d.ARRAY_TYPE(6);return a[0]=1,a[1]=0,a[2]=0,a[3]=1,a[4]=0,a[5]=0,a},e.clone=function(a){var b=new d.ARRAY_TYPE(6);return b[0]=a[0],b[1]=a[1],b[2]=a[2],b[3]=a[3],b[4]=a[4],b[5]=a[5],b},e.copy=function(a,b){return a[0]=b[0],a[1]=b[1],a[2]=b[2],a[3]=b[3],a[4]=b[4],a[5]=b[5],a},e.identity=function(a){return a[0]=1,a[1]=0,a[2]=0,a[3]=1,a[4]=0,a[5]=0,a},e.invert=function(a,b){var c=b[0],d=b[1],e=b[2],f=b[3],g=b[4],h=b[5],i=c*f-d*e;return i?(i=1/i,a[0]=f*i,a[1]=-d*i,a[2]=-e*i,a[3]=c*i,a[4]=(e*h-f*g)*i,a[5]=(d*g-c*h)*i,a):null},e.determinant=function(a){return a[0]*a[3]-a[1]*a[2]},e.multiply=function(a,b,c){var d=b[0],e=b[1],f=b[2],g=b[3],h=b[4],i=b[5],j=c[0],k=c[1],l=c[2],m=c[3],n=c[4],o=c[5];return a[0]=d*j+f*k,a[1]=e*j+g*k,a[2]=d*l+f*m,a[3]=e*l+g*m,a[4]=d*n+f*o+h,a[5]=e*n+g*o+i,a},e.mul=e.multiply,e.rotate=function(a,b,c){var d=b[0],e=b[1],f=b[2],g=b[3],h=b[4],i=b[5],j=Math.sin(c),k=Math.cos(c);return a[0]=d*k+f*j,a[1]=e*k+g*j,a[2]=d*-j+f*k,a[3]=e*-j+g*k,a[4]=h,a[5]=i,a},e.scale=function(a,b,c){var d=b[0],e=b[1],f=b[2],g=b[3],h=b[4],i=b[5],j=c[0],k=c[1];return a[0]=d*j,a[1]=e*j,a[2]=f*k,a[3]=g*k,a[4]=h,a[5]=i,a},e.translate=function(a,b,c){var d=b[0],e=b[1],f=b[2],g=b[3],h=b[4],i=b[5],j=c[0],k=c[1];return a[0]=d,a[1]=e,a[2]=f,a[3]=g,a[4]=d*j+f*k+h,a[5]=e*j+g*k+i,a},e.fromRotation=function(a,b){var c=Math.sin(b),d=Math.cos(b);return a[0]=d,a[1]=c,a[2]=-c,a[3]=d,a[4]=0,a[5]=0,a},e.fromScaling=function(a,b){return a[0]=b[0],a[1]=0,a[2]=0,a[3]=b[1],a[4]=0,a[5]=0,a},e.fromTranslation=function(a,b){return a[0]=1,a[1]=0,a[2]=0,a[3]=1,a[4]=b[0],a[5]=b[1],a},e.str=function(a){return"mat2d("+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+", "+a[4]+", "+a[5]+")"},e.frob=function(a){return Math.sqrt(Math.pow(a[0],2)+Math.pow(a[1],2)+Math.pow(a[2],2)+Math.pow(a[3],2)+Math.pow(a[4],2)+Math.pow(a[5],2)+1)},a.exports=e},function(a,b,c){var d=c(1),e={};e.create=function(){var a=new d.ARRAY_TYPE(9);return a[0]=1,a[1]=0,a[2]=0,a[3]=0,a[4]=1,a[5]=0,a[6]=0,a[7]=0,a[8]=1,a},e.fromMat4=function(a,b){return a[0]=b[0],a[1]=b[1],a[2]=b[2],a[3]=b[4],a[4]=b[5],a[5]=b[6],a[6]=b[8],a[7]=b[9],a[8]=b[10],a},e.clone=function(a){var b=new d.ARRAY_TYPE(9);return b[0]=a[0],b[1]=a[1],b[2]=a[2],b[3]=a[3],b[4]=a[4],b[5]=a[5],b[6]=a[6],b[7]=a[7],b[8]=a[8],b},e.copy=function(a,b){return a[0]=b[0],a[1]=b[1],a[2]=b[2],a[3]=b[3],a[4]=b[4],a[5]=b[5],a[6]=b[6],a[7]=b[7],a[8]=b[8],a},e.identity=function(a){return a[0]=1,a[1]=0,a[2]=0,a[3]=0,a[4]=1,a[5]=0,a[6]=0,a[7]=0,a[8]=1,a},e.transpose=function(a,b){if(a===b){var c=b[1],d=b[2],e=b[5];a[1]=b[3],a[2]=b[6],a[3]=c,a[5]=b[7],a[6]=d,a[7]=e}else a[0]=b[0],a[1]=b[3],a[2]=b[6],a[3]=b[1],a[4]=b[4],a[5]=b[7],a[6]=b[2],a[7]=b[5],a[8]=b[8];return a},e.invert=function(a,b){var c=b[0],d=b[1],e=b[2],f=b[3],g=b[4],h=b[5],i=b[6],j=b[7],k=b[8],l=k*g-h*j,m=-k*f+h*i,n=j*f-g*i,o=c*l+d*m+e*n;return o?(o=1/o,a[0]=l*o,a[1]=(-k*d+e*j)*o,a[2]=(h*d-e*g)*o,a[3]=m*o,a[4]=(k*c-e*i)*o,a[5]=(-h*c+e*f)*o,a[6]=n*o,a[7]=(-j*c+d*i)*o,a[8]=(g*c-d*f)*o,a):null},e.adjoint=function(a,b){var c=b[0],d=b[1],e=b[2],f=b[3],g=b[4],h=b[5],i=b[6],j=b[7],k=b[8];return a[0]=g*k-h*j,a[1]=e*j-d*k,a[2]=d*h-e*g,a[3]=h*i-f*k,a[4]=c*k-e*i,a[5]=e*f-c*h,a[6]=f*j-g*i,a[7]=d*i-c*j,a[8]=c*g-d*f,a},e.determinant=function(a){var b=a[0],c=a[1],d=a[2],e=a[3],f=a[4],g=a[5],h=a[6],i=a[7],j=a[8];return b*(j*f-g*i)+c*(-j*e+g*h)+d*(i*e-f*h)},e.multiply=function(a,b,c){var d=b[0],e=b[1],f=b[2],g=b[3],h=b[4],i=b[5],j=b[6],k=b[7],l=b[8],m=c[0],n=c[1],o=c[2],p=c[3],q=c[4],r=c[5],s=c[6],t=c[7],u=c[8];return a[0]=m*d+n*g+o*j,a[1]=m*e+n*h+o*k,a[2]=m*f+n*i+o*l,a[3]=p*d+q*g+r*j,a[4]=p*e+q*h+r*k,a[5]=p*f+q*i+r*l,a[6]=s*d+t*g+u*j,a[7]=s*e+t*h+u*k,a[8]=s*f+t*i+u*l,a},e.mul=e.multiply,e.translate=function(a,b,c){var d=b[0],e=b[1],f=b[2],g=b[3],h=b[4],i=b[5],j=b[6],k=b[7],l=b[8],m=c[0],n=c[1];return a[0]=d,a[1]=e,a[2]=f,a[3]=g,a[4]=h,a[5]=i,a[6]=m*d+n*g+j,a[7]=m*e+n*h+k,a[8]=m*f+n*i+l,a},e.rotate=function(a,b,c){var d=b[0],e=b[1],f=b[2],g=b[3],h=b[4],i=b[5],j=b[6],k=b[7],l=b[8],m=Math.sin(c),n=Math.cos(c);return a[0]=n*d+m*g,a[1]=n*e+m*h,a[2]=n*f+m*i,a[3]=n*g-m*d,a[4]=n*h-m*e,a[5]=n*i-m*f,a[6]=j,a[7]=k,a[8]=l,a},e.scale=function(a,b,c){var d=c[0],e=c[1];return a[0]=d*b[0],a[1]=d*b[1],a[2]=d*b[2],a[3]=e*b[3],a[4]=e*b[4],a[5]=e*b[5],a[6]=b[6],a[7]=b[7],a[8]=b[8],a},e.fromTranslation=function(a,b){return a[0]=1,a[1]=0,a[2]=0,a[3]=0,a[4]=1,a[5]=0,a[6]=b[0],a[7]=b[1],a[8]=1,a},e.fromRotation=function(a,b){var c=Math.sin(b),d=Math.cos(b);return a[0]=d,a[1]=c,a[2]=0,a[3]=-c,a[4]=d,a[5]=0,a[6]=0,a[7]=0,a[8]=1,a},e.fromScaling=function(a,b){return a[0]=b[0],a[1]=0,a[2]=0,a[3]=0,a[4]=b[1],a[5]=0,a[6]=0,a[7]=0,a[8]=1,a},e.fromMat2d=function(a,b){return a[0]=b[0],a[1]=b[1],a[2]=0,a[3]=b[2],a[4]=b[3],a[5]=0,a[6]=b[4],a[7]=b[5],a[8]=1,a},e.fromQuat=function(a,b){var c=b[0],d=b[1],e=b[2],f=b[3],g=c+c,h=d+d,i=e+e,j=c*g,k=d*g,l=d*h,m=e*g,n=e*h,o=e*i,p=f*g,q=f*h,r=f*i;return a[0]=1-l-o,a[3]=k-r,a[6]=m+q,a[1]=k+r,a[4]=1-j-o,a[7]=n-p,a[2]=m-q,a[5]=n+p,a[8]=1-j-l,a},e.normalFromMat4=function(a,b){var c=b[0],d=b[1],e=b[2],f=b[3],g=b[4],h=b[5],i=b[6],j=b[7],k=b[8],l=b[9],m=b[10],n=b[11],o=b[12],p=b[13],q=b[14],r=b[15],s=c*h-d*g,t=c*i-e*g,u=c*j-f*g,v=d*i-e*h,w=d*j-f*h,x=e*j-f*i,y=k*p-l*o,z=k*q-m*o,A=k*r-n*o,B=l*q-m*p,C=l*r-n*p,D=m*r-n*q,E=s*D-t*C+u*B+v*A-w*z+x*y;return E?(E=1/E,a[0]=(h*D-i*C+j*B)*E,a[1]=(i*A-g*D-j*z)*E,a[2]=(g*C-h*A+j*y)*E,a[3]=(e*C-d*D-f*B)*E,a[4]=(c*D-e*A+f*z)*E,a[5]=(d*A-c*C-f*y)*E,a[6]=(p*x-q*w+r*v)*E,a[7]=(q*u-o*x-r*t)*E,a[8]=(o*w-p*u+r*s)*E,a):null},e.str=function(a){return"mat3("+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+", "+a[4]+", "+a[5]+", "+a[6]+", "+a[7]+", "+a[8]+")"},e.frob=function(a){return Math.sqrt(Math.pow(a[0],2)+Math.pow(a[1],2)+Math.pow(a[2],2)+Math.pow(a[3],2)+Math.pow(a[4],2)+Math.pow(a[5],2)+Math.pow(a[6],2)+Math.pow(a[7],2)+Math.pow(a[8],2))},a.exports=e},function(a,b,c){var d=c(1),e={};e.create=function(){var a=new d.ARRAY_TYPE(16);return a[0]=1,a[1]=0,a[2]=0,a[3]=0,a[4]=0,a[5]=1,a[6]=0,a[7]=0,a[8]=0,a[9]=0,a[10]=1,a[11]=0,a[12]=0,a[13]=0,a[14]=0,a[15]=1,a},e.clone=function(a){var b=new d.ARRAY_TYPE(16);return b[0]=a[0],b[1]=a[1],b[2]=a[2],b[3]=a[3],b[4]=a[4],b[5]=a[5],b[6]=a[6],b[7]=a[7],b[8]=a[8],b[9]=a[9],b[10]=a[10],b[11]=a[11],b[12]=a[12],b[13]=a[13],b[14]=a[14],b[15]=a[15],b},e.copy=function(a,b){return a[0]=b[0],a[1]=b[1],a[2]=b[2],a[3]=b[3],a[4]=b[4],a[5]=b[5],a[6]=b[6],a[7]=b[7],a[8]=b[8],a[9]=b[9],a[10]=b[10],a[11]=b[11],a[12]=b[12],a[13]=b[13],a[14]=b[14],a[15]=b[15],a},e.identity=function(a){return a[0]=1,a[1]=0,a[2]=0,a[3]=0,a[4]=0,a[5]=1,a[6]=0,a[7]=0,a[8]=0,a[9]=0,a[10]=1,a[11]=0,a[12]=0,a[13]=0,a[14]=0,a[15]=1,a},e.transpose=function(a,b){if(a===b){var c=b[1],d=b[2],e=b[3],f=b[6],g=b[7],h=b[11];a[1]=b[4],a[2]=b[8],a[3]=b[12],a[4]=c,a[6]=b[9],a[7]=b[13],a[8]=d,a[9]=f,a[11]=b[14],a[12]=e,a[13]=g,a[14]=h}else a[0]=b[0],a[1]=b[4],a[2]=b[8],a[3]=b[12],a[4]=b[1],a[5]=b[5],a[6]=b[9],a[7]=b[13],a[8]=b[2],a[9]=b[6],a[10]=b[10],a[11]=b[14],a[12]=b[3],a[13]=b[7],a[14]=b[11],a[15]=b[15];return a},e.invert=function(a,b){var c=b[0],d=b[1],e=b[2],f=b[3],g=b[4],h=b[5],i=b[6],j=b[7],k=b[8],l=b[9],m=b[10],n=b[11],o=b[12],p=b[13],q=b[14],r=b[15],s=c*h-d*g,t=c*i-e*g,u=c*j-f*g,v=d*i-e*h,w=d*j-f*h,x=e*j-f*i,y=k*p-l*o,z=k*q-m*o,A=k*r-n*o,B=l*q-m*p,C=l*r-n*p,D=m*r-n*q,E=s*D-t*C+u*B+v*A-w*z+x*y;return E?(E=1/E,a[0]=(h*D-i*C+j*B)*E,a[1]=(e*C-d*D-f*B)*E,a[2]=(p*x-q*w+r*v)*E,a[3]=(m*w-l*x-n*v)*E,a[4]=(i*A-g*D-j*z)*E,a[5]=(c*D-e*A+f*z)*E,a[6]=(q*u-o*x-r*t)*E,a[7]=(k*x-m*u+n*t)*E,a[8]=(g*C-h*A+j*y)*E,a[9]=(d*A-c*C-f*y)*E,a[10]=(o*w-p*u+r*s)*E,a[11]=(l*u-k*w-n*s)*E,a[12]=(h*z-g*B-i*y)*E,a[13]=(c*B-d*z+e*y)*E,a[14]=(p*t-o*v-q*s)*E,a[15]=(k*v-l*t+m*s)*E,a):null},e.adjoint=function(a,b){var c=b[0],d=b[1],e=b[2],f=b[3],g=b[4],h=b[5],i=b[6],j=b[7],k=b[8],l=b[9],m=b[10],n=b[11],o=b[12],p=b[13],q=b[14],r=b[15];return a[0]=h*(m*r-n*q)-l*(i*r-j*q)+p*(i*n-j*m),a[1]=-(d*(m*r-n*q)-l*(e*r-f*q)+p*(e*n-f*m)),a[2]=d*(i*r-j*q)-h*(e*r-f*q)+p*(e*j-f*i),a[3]=-(d*(i*n-j*m)-h*(e*n-f*m)+l*(e*j-f*i)),a[4]=-(g*(m*r-n*q)-k*(i*r-j*q)+o*(i*n-j*m)),a[5]=c*(m*r-n*q)-k*(e*r-f*q)+o*(e*n-f*m),a[6]=-(c*(i*r-j*q)-g*(e*r-f*q)+o*(e*j-f*i)),a[7]=c*(i*n-j*m)-g*(e*n-f*m)+k*(e*j-f*i),a[8]=g*(l*r-n*p)-k*(h*r-j*p)+o*(h*n-j*l),a[9]=-(c*(l*r-n*p)-k*(d*r-f*p)+o*(d*n-f*l)),a[10]=c*(h*r-j*p)-g*(d*r-f*p)+o*(d*j-f*h),a[11]=-(c*(h*n-j*l)-g*(d*n-f*l)+k*(d*j-f*h)),a[12]=-(g*(l*q-m*p)-k*(h*q-i*p)+o*(h*m-i*l)),a[13]=c*(l*q-m*p)-k*(d*q-e*p)+o*(d*m-e*l),a[14]=-(c*(h*q-i*p)-g*(d*q-e*p)+o*(d*i-e*h)),a[15]=c*(h*m-i*l)-g*(d*m-e*l)+k*(d*i-e*h),a},e.determinant=function(a){var b=a[0],c=a[1],d=a[2],e=a[3],f=a[4],g=a[5],h=a[6],i=a[7],j=a[8],k=a[9],l=a[10],m=a[11],n=a[12],o=a[13],p=a[14],q=a[15],r=b*g-c*f,s=b*h-d*f,t=b*i-e*f,u=c*h-d*g,v=c*i-e*g,w=d*i-e*h,x=j*o-k*n,y=j*p-l*n,z=j*q-m*n,A=k*p-l*o,B=k*q-m*o,C=l*q-m*p;return r*C-s*B+t*A+u*z-v*y+w*x},e.multiply=function(a,b,c){var d=b[0],e=b[1],f=b[2],g=b[3],h=b[4],i=b[5],j=b[6],k=b[7],l=b[8],m=b[9],n=b[10],o=b[11],p=b[12],q=b[13],r=b[14],s=b[15],t=c[0],u=c[1],v=c[2],w=c[3];return a[0]=t*d+u*h+v*l+w*p,a[1]=t*e+u*i+v*m+w*q,a[2]=t*f+u*j+v*n+w*r,a[3]=t*g+u*k+v*o+w*s,t=c[4],u=c[5],v=c[6],w=c[7],a[4]=t*d+u*h+v*l+w*p,a[5]=t*e+u*i+v*m+w*q,a[6]=t*f+u*j+v*n+w*r,a[7]=t*g+u*k+v*o+w*s,t=c[8],u=c[9],v=c[10],w=c[11],a[8]=t*d+u*h+v*l+w*p,a[9]=t*e+u*i+v*m+w*q,a[10]=t*f+u*j+v*n+w*r,a[11]=t*g+u*k+v*o+w*s,t=c[12],u=c[13],v=c[14],w=c[15],a[12]=t*d+u*h+v*l+w*p,a[13]=t*e+u*i+v*m+w*q,a[14]=t*f+u*j+v*n+w*r,a[15]=t*g+u*k+v*o+w*s,a},e.mul=e.multiply,e.translate=function(a,b,c){var d,e,f,g,h,i,j,k,l,m,n,o,p=c[0],q=c[1],r=c[2];return b===a?(a[12]=b[0]*p+b[4]*q+b[8]*r+b[12],a[13]=b[1]*p+b[5]*q+b[9]*r+b[13],a[14]=b[2]*p+b[6]*q+b[10]*r+b[14],a[15]=b[3]*p+b[7]*q+b[11]*r+b[15]):(d=b[0],e=b[1],f=b[2],g=b[3],h=b[4],i=b[5],j=b[6],k=b[7],l=b[8],m=b[9],n=b[10],o=b[11],a[0]=d,a[1]=e,a[2]=f,a[3]=g,a[4]=h,a[5]=i,a[6]=j,a[7]=k,a[8]=l,a[9]=m,a[10]=n,a[11]=o,a[12]=d*p+h*q+l*r+b[12],a[13]=e*p+i*q+m*r+b[13],a[14]=f*p+j*q+n*r+b[14],a[15]=g*p+k*q+o*r+b[15]),a},e.scale=function(a,b,c){var d=c[0],e=c[1],f=c[2];return a[0]=b[0]*d,a[1]=b[1]*d,a[2]=b[2]*d,a[3]=b[3]*d,a[4]=b[4]*e,a[5]=b[5]*e,a[6]=b[6]*e,a[7]=b[7]*e,a[8]=b[8]*f,a[9]=b[9]*f,a[10]=b[10]*f,a[11]=b[11]*f,a[12]=b[12],a[13]=b[13],a[14]=b[14],a[15]=b[15],a},e.rotate=function(a,b,c,e){var f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D=e[0],E=e[1],F=e[2],G=Math.sqrt(D*D+E*E+F*F);return Math.abs(G)<d.EPSILON?null:(G=1/G,D*=G,E*=G,F*=G,f=Math.sin(c),g=Math.cos(c),h=1-g,i=b[0],j=b[1],k=b[2],l=b[3],m=b[4],n=b[5],o=b[6],p=b[7],q=b[8],r=b[9],s=b[10],t=b[11],u=D*D*h+g,v=E*D*h+F*f,w=F*D*h-E*f,x=D*E*h-F*f,y=E*E*h+g,z=F*E*h+D*f,A=D*F*h+E*f,B=E*F*h-D*f,C=F*F*h+g,a[0]=i*u+m*v+q*w,a[1]=j*u+n*v+r*w,a[2]=k*u+o*v+s*w,a[3]=l*u+p*v+t*w,a[4]=i*x+m*y+q*z,a[5]=j*x+n*y+r*z,a[6]=k*x+o*y+s*z,a[7]=l*x+p*y+t*z,a[8]=i*A+m*B+q*C,a[9]=j*A+n*B+r*C,a[10]=k*A+o*B+s*C,a[11]=l*A+p*B+t*C,b!==a&&(a[12]=b[12],a[13]=b[13],a[14]=b[14],a[15]=b[15]),a)},e.rotateX=function(a,b,c){var d=Math.sin(c),e=Math.cos(c),f=b[4],g=b[5],h=b[6],i=b[7],j=b[8],k=b[9],l=b[10],m=b[11];return b!==a&&(a[0]=b[0],a[1]=b[1],a[2]=b[2],a[3]=b[3],a[12]=b[12],a[13]=b[13],a[14]=b[14],a[15]=b[15]),a[4]=f*e+j*d,a[5]=g*e+k*d,a[6]=h*e+l*d,a[7]=i*e+m*d,a[8]=j*e-f*d,a[9]=k*e-g*d,a[10]=l*e-h*d,a[11]=m*e-i*d,a},e.rotateY=function(a,b,c){var d=Math.sin(c),e=Math.cos(c),f=b[0],g=b[1],h=b[2],i=b[3],j=b[8],k=b[9],l=b[10],m=b[11];return b!==a&&(a[4]=b[4],a[5]=b[5],a[6]=b[6],a[7]=b[7],a[12]=b[12],a[13]=b[13],a[14]=b[14],a[15]=b[15]),a[0]=f*e-j*d,a[1]=g*e-k*d,a[2]=h*e-l*d,a[3]=i*e-m*d,a[8]=f*d+j*e,a[9]=g*d+k*e,a[10]=h*d+l*e,a[11]=i*d+m*e,a},e.rotateZ=function(a,b,c){var d=Math.sin(c),e=Math.cos(c),f=b[0],g=b[1],h=b[2],i=b[3],j=b[4],k=b[5],l=b[6],m=b[7];return b!==a&&(a[8]=b[8],a[9]=b[9],a[10]=b[10],a[11]=b[11],a[12]=b[12],a[13]=b[13],a[14]=b[14],a[15]=b[15]),a[0]=f*e+j*d,a[1]=g*e+k*d,a[2]=h*e+l*d,a[3]=i*e+m*d,a[4]=j*e-f*d,a[5]=k*e-g*d,a[6]=l*e-h*d,a[7]=m*e-i*d,a},e.fromTranslation=function(a,b){return a[0]=1,a[1]=0,a[2]=0,a[3]=0,a[4]=0,a[5]=1,a[6]=0,a[7]=0,a[8]=0,a[9]=0,a[10]=1,a[11]=0,a[12]=b[0],a[13]=b[1],a[14]=b[2],a[15]=1,a},e.fromScaling=function(a,b){return a[0]=b[0],a[1]=0,a[2]=0,a[3]=0,a[4]=0,a[5]=b[1],a[6]=0,a[7]=0,a[8]=0,a[9]=0,a[10]=b[2],a[11]=0,a[12]=0,a[13]=0,a[14]=0,a[15]=1,a},e.fromRotation=function(a,b,c){var e,f,g,h=c[0],i=c[1],j=c[2],k=Math.sqrt(h*h+i*i+j*j);return Math.abs(k)<d.EPSILON?null:(k=1/k,h*=k,i*=k,j*=k,e=Math.sin(b),f=Math.cos(b),g=1-f,a[0]=h*h*g+f,a[1]=i*h*g+j*e,a[2]=j*h*g-i*e,a[3]=0,a[4]=h*i*g-j*e,a[5]=i*i*g+f,a[6]=j*i*g+h*e,a[7]=0,a[8]=h*j*g+i*e,a[9]=i*j*g-h*e,a[10]=j*j*g+f,a[11]=0,a[12]=0,a[13]=0,a[14]=0,a[15]=1,a)},e.fromXRotation=function(a,b){var c=Math.sin(b),d=Math.cos(b);return a[0]=1,a[1]=0,a[2]=0,a[3]=0,a[4]=0,a[5]=d,a[6]=c,a[7]=0,a[8]=0,a[9]=-c,a[10]=d,a[11]=0,a[12]=0,a[13]=0,a[14]=0,a[15]=1,a},e.fromYRotation=function(a,b){var c=Math.sin(b),d=Math.cos(b);return a[0]=d,a[1]=0,a[2]=-c,a[3]=0,a[4]=0,a[5]=1,a[6]=0,a[7]=0,a[8]=c,a[9]=0,a[10]=d,a[11]=0,a[12]=0,a[13]=0,a[14]=0,a[15]=1,a},e.fromZRotation=function(a,b){var c=Math.sin(b),d=Math.cos(b);return a[0]=d,a[1]=c,a[2]=0,a[3]=0,a[4]=-c,a[5]=d,a[6]=0,a[7]=0,a[8]=0,a[9]=0,a[10]=1,a[11]=0,a[12]=0,a[13]=0,a[14]=0,a[15]=1,a},e.fromRotationTranslation=function(a,b,c){var d=b[0],e=b[1],f=b[2],g=b[3],h=d+d,i=e+e,j=f+f,k=d*h,l=d*i,m=d*j,n=e*i,o=e*j,p=f*j,q=g*h,r=g*i,s=g*j;return a[0]=1-(n+p),a[1]=l+s,a[2]=m-r,a[3]=0,a[4]=l-s,a[5]=1-(k+p),a[6]=o+q,a[7]=0,a[8]=m+r,a[9]=o-q,a[10]=1-(k+n),a[11]=0,a[12]=c[0],a[13]=c[1],a[14]=c[2],a[15]=1,a},e.fromRotationTranslationScale=function(a,b,c,d){var e=b[0],f=b[1],g=b[2],h=b[3],i=e+e,j=f+f,k=g+g,l=e*i,m=e*j,n=e*k,o=f*j,p=f*k,q=g*k,r=h*i,s=h*j,t=h*k,u=d[0],v=d[1],w=d[2];return a[0]=(1-(o+q))*u,a[1]=(m+t)*u,a[2]=(n-s)*u,a[3]=0,a[4]=(m-t)*v,a[5]=(1-(l+q))*v,a[6]=(p+r)*v,a[7]=0,a[8]=(n+s)*w,a[9]=(p-r)*w,a[10]=(1-(l+o))*w,a[11]=0,a[12]=c[0],a[13]=c[1],a[14]=c[2],a[15]=1,a},e.fromRotationTranslationScaleOrigin=function(a,b,c,d,e){var f=b[0],g=b[1],h=b[2],i=b[3],j=f+f,k=g+g,l=h+h,m=f*j,n=f*k,o=f*l,p=g*k,q=g*l,r=h*l,s=i*j,t=i*k,u=i*l,v=d[0],w=d[1],x=d[2],y=e[0],z=e[1],A=e[2];return a[0]=(1-(p+r))*v,a[1]=(n+u)*v,a[2]=(o-t)*v,a[3]=0,a[4]=(n-u)*w,a[5]=(1-(m+r))*w,a[6]=(q+s)*w,a[7]=0,a[8]=(o+t)*x,a[9]=(q-s)*x,a[10]=(1-(m+p))*x,a[11]=0,a[12]=c[0]+y-(a[0]*y+a[4]*z+a[8]*A),a[13]=c[1]+z-(a[1]*y+a[5]*z+a[9]*A),a[14]=c[2]+A-(a[2]*y+a[6]*z+a[10]*A),a[15]=1,a},e.fromQuat=function(a,b){var c=b[0],d=b[1],e=b[2],f=b[3],g=c+c,h=d+d,i=e+e,j=c*g,k=d*g,l=d*h,m=e*g,n=e*h,o=e*i,p=f*g,q=f*h,r=f*i;return a[0]=1-l-o,a[1]=k+r,a[2]=m-q,a[3]=0,a[4]=k-r,a[5]=1-j-o,a[6]=n+p,a[7]=0,a[8]=m+q,a[9]=n-p,a[10]=1-j-l,a[11]=0,a[12]=0,a[13]=0,a[14]=0,a[15]=1,a},e.frustum=function(a,b,c,d,e,f,g){var h=1/(c-b),i=1/(e-d),j=1/(f-g);return a[0]=2*f*h,a[1]=0,a[2]=0,a[3]=0,a[4]=0,a[5]=2*f*i,a[6]=0,a[7]=0,a[8]=(c+b)*h,a[9]=(e+d)*i,a[10]=(g+f)*j,a[11]=-1,a[12]=0,a[13]=0,a[14]=g*f*2*j,a[15]=0,a},e.perspective=function(a,b,c,d,e){var f=1/Math.tan(b/2),g=1/(d-e);return a[0]=f/c,a[1]=0,a[2]=0,a[3]=0,a[4]=0,a[5]=f,a[6]=0,a[7]=0,a[8]=0,a[9]=0,a[10]=(e+d)*g,a[11]=-1,a[12]=0,a[13]=0,a[14]=2*e*d*g,a[15]=0,a},e.perspectiveFromFieldOfView=function(a,b,c,d){var e=Math.tan(b.upDegrees*Math.PI/180),f=Math.tan(b.downDegrees*Math.PI/180),g=Math.tan(b.leftDegrees*Math.PI/180),h=Math.tan(b.rightDegrees*Math.PI/180),i=2/(g+h),j=2/(e+f);return a[0]=i,a[1]=0,a[2]=0,a[3]=0,a[4]=0,a[5]=j,a[6]=0,a[7]=0,a[8]=-((g-h)*i*.5),a[9]=(e-f)*j*.5,a[10]=d/(c-d),a[11]=-1,a[12]=0,a[13]=0,a[14]=d*c/(c-d),a[15]=0,a},e.ortho=function(a,b,c,d,e,f,g){var h=1/(b-c),i=1/(d-e),j=1/(f-g);return a[0]=-2*h,a[1]=0,a[2]=0,a[3]=0,a[4]=0,a[5]=-2*i,a[6]=0,a[7]=0,a[8]=0,a[9]=0,a[10]=2*j,a[11]=0,a[12]=(b+c)*h,a[13]=(e+d)*i,a[14]=(g+f)*j,a[15]=1,a},e.lookAt=function(a,b,c,f){var g,h,i,j,k,l,m,n,o,p,q=b[0],r=b[1],s=b[2],t=f[0],u=f[1],v=f[2],w=c[0],x=c[1],y=c[2];return Math.abs(q-w)<d.EPSILON&&Math.abs(r-x)<d.EPSILON&&Math.abs(s-y)<d.EPSILON?e.identity(a):(m=q-w,n=r-x,o=s-y,p=1/Math.sqrt(m*m+n*n+o*o),m*=p,n*=p,o*=p,g=u*o-v*n,h=v*m-t*o,i=t*n-u*m,p=Math.sqrt(g*g+h*h+i*i),p?(p=1/p,g*=p,h*=p,i*=p):(g=0,h=0,i=0),j=n*i-o*h,k=o*g-m*i,l=m*h-n*g,p=Math.sqrt(j*j+k*k+l*l),p?(p=1/p,j*=p,k*=p,l*=p):(j=0,k=0,l=0),a[0]=g,a[1]=j,a[2]=m,a[3]=0,a[4]=h,a[5]=k,a[6]=n,a[7]=0,a[8]=i,a[9]=l,a[10]=o,a[11]=0,a[12]=-(g*q+h*r+i*s),a[13]=-(j*q+k*r+l*s),a[14]=-(m*q+n*r+o*s),a[15]=1,a)},e.str=function(a){return"mat4("+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+", "+a[4]+", "+a[5]+", "+a[6]+", "+a[7]+", "+a[8]+", "+a[9]+", "+a[10]+", "+a[11]+", "+a[12]+", "+a[13]+", "+a[14]+", "+a[15]+")"},e.frob=function(a){return Math.sqrt(Math.pow(a[0],2)+Math.pow(a[1],2)+Math.pow(a[2],2)+Math.pow(a[3],2)+Math.pow(a[4],2)+Math.pow(a[5],2)+Math.pow(a[6],2)+Math.pow(a[7],2)+Math.pow(a[8],2)+Math.pow(a[9],2)+Math.pow(a[10],2)+Math.pow(a[11],2)+Math.pow(a[12],2)+Math.pow(a[13],2)+Math.pow(a[14],2)+Math.pow(a[15],2))},a.exports=e},function(a,b,c){var d=c(1),e=c(4),f=c(7),g=c(8),h={};h.create=function(){var a=new d.ARRAY_TYPE(4);return a[0]=0,a[1]=0,a[2]=0,a[3]=1,a},h.rotationTo=function(){var a=f.create(),b=f.fromValues(1,0,0),c=f.fromValues(0,1,0);return function(d,e,g){var i=f.dot(e,g);return-.999999>i?(f.cross(a,b,e),f.length(a)<1e-6&&f.cross(a,c,e),f.normalize(a,a),h.setAxisAngle(d,a,Math.PI),d):i>.999999?(d[0]=0,d[1]=0,d[2]=0,d[3]=1,d):(f.cross(a,e,g),d[0]=a[0],d[1]=a[1],d[2]=a[2],d[3]=1+i,h.normalize(d,d))}}(),h.setAxes=function(){var a=e.create();return function(b,c,d,e){return a[0]=d[0],a[3]=d[1],a[6]=d[2],a[1]=e[0],a[4]=e[1],a[7]=e[2],a[2]=-c[0],a[5]=-c[1],a[8]=-c[2],h.normalize(b,h.fromMat3(b,a))}}(),h.clone=g.clone,h.fromValues=g.fromValues,h.copy=g.copy,h.set=g.set,h.identity=function(a){return a[0]=0,a[1]=0,a[2]=0,a[3]=1,a},h.setAxisAngle=function(a,b,c){c=.5*c;var d=Math.sin(c);return a[0]=d*b[0],a[1]=d*b[1],a[2]=d*b[2],a[3]=Math.cos(c),a},h.add=g.add,h.multiply=function(a,b,c){var d=b[0],e=b[1],f=b[2],g=b[3],h=c[0],i=c[1],j=c[2],k=c[3];return a[0]=d*k+g*h+e*j-f*i,a[1]=e*k+g*i+f*h-d*j,a[2]=f*k+g*j+d*i-e*h,a[3]=g*k-d*h-e*i-f*j,a},h.mul=h.multiply,h.scale=g.scale,h.rotateX=function(a,b,c){c*=.5;var d=b[0],e=b[1],f=b[2],g=b[3],h=Math.sin(c),i=Math.cos(c);return a[0]=d*i+g*h,a[1]=e*i+f*h,a[2]=f*i-e*h,a[3]=g*i-d*h,a},h.rotateY=function(a,b,c){c*=.5;var d=b[0],e=b[1],f=b[2],g=b[3],h=Math.sin(c),i=Math.cos(c);return a[0]=d*i-f*h,a[1]=e*i+g*h,a[2]=f*i+d*h,a[3]=g*i-e*h,a},h.rotateZ=function(a,b,c){c*=.5;var d=b[0],e=b[1],f=b[2],g=b[3],h=Math.sin(c),i=Math.cos(c);return a[0]=d*i+e*h,a[1]=e*i-d*h,a[2]=f*i+g*h,a[3]=g*i-f*h,a},h.calculateW=function(a,b){var c=b[0],d=b[1],e=b[2];return a[0]=c,a[1]=d,a[2]=e,a[3]=Math.sqrt(Math.abs(1-c*c-d*d-e*e)),a},h.dot=g.dot,h.lerp=g.lerp,h.slerp=function(a,b,c,d){var e,f,g,h,i,j=b[0],k=b[1],l=b[2],m=b[3],n=c[0],o=c[1],p=c[2],q=c[3];return f=j*n+k*o+l*p+m*q,0>f&&(f=-f,n=-n,o=-o,p=-p,q=-q),1-f>1e-6?(e=Math.acos(f),g=Math.sin(e),h=Math.sin((1-d)*e)/g,i=Math.sin(d*e)/g):(h=1-d,i=d),a[0]=h*j+i*n,a[1]=h*k+i*o,a[2]=h*l+i*p,a[3]=h*m+i*q,a},h.sqlerp=function(){var a=h.create(),b=h.create();return function(c,d,e,f,g,i){return h.slerp(a,d,g,i),h.slerp(b,e,f,i),h.slerp(c,a,b,2*i*(1-i)),c}}(),h.invert=function(a,b){var c=b[0],d=b[1],e=b[2],f=b[3],g=c*c+d*d+e*e+f*f,h=g?1/g:0;return a[0]=-c*h,a[1]=-d*h,a[2]=-e*h,a[3]=f*h,a},h.conjugate=function(a,b){return a[0]=-b[0],a[1]=-b[1],a[2]=-b[2],a[3]=b[3],a},h.length=g.length,h.len=h.length,h.squaredLength=g.squaredLength,h.sqrLen=h.squaredLength,h.normalize=g.normalize,h.fromMat3=function(a,b){var c,d=b[0]+b[4]+b[8];if(d>0)c=Math.sqrt(d+1),a[3]=.5*c,c=.5/c,a[0]=(b[5]-b[7])*c,a[1]=(b[6]-b[2])*c,a[2]=(b[1]-b[3])*c;else{var e=0;b[4]>b[0]&&(e=1),b[8]>b[3*e+e]&&(e=2);var f=(e+1)%3,g=(e+2)%3;c=Math.sqrt(b[3*e+e]-b[3*f+f]-b[3*g+g]+1),a[e]=.5*c,c=.5/c,a[3]=(b[3*f+g]-b[3*g+f])*c,a[f]=(b[3*f+e]+b[3*e+f])*c,a[g]=(b[3*g+e]+b[3*e+g])*c}return a},h.str=function(a){return"quat("+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+")"},a.exports=h},function(a,b,c){var d=c(1),e={};e.create=function(){var a=new d.ARRAY_TYPE(3);return a[0]=0,a[1]=0,a[2]=0,a},e.clone=function(a){var b=new d.ARRAY_TYPE(3);return b[0]=a[0],b[1]=a[1],b[2]=a[2],b},e.fromValues=function(a,b,c){var e=new d.ARRAY_TYPE(3);return e[0]=a,e[1]=b,e[2]=c,e},e.copy=function(a,b){return a[0]=b[0],a[1]=b[1],a[2]=b[2],a},e.set=function(a,b,c,d){return a[0]=b,a[1]=c,a[2]=d,a},e.add=function(a,b,c){return a[0]=b[0]+c[0],a[1]=b[1]+c[1],a[2]=b[2]+c[2],a},e.subtract=function(a,b,c){return a[0]=b[0]-c[0],a[1]=b[1]-c[1],a[2]=b[2]-c[2],a},e.sub=e.subtract,e.multiply=function(a,b,c){return a[0]=b[0]*c[0],a[1]=b[1]*c[1],a[2]=b[2]*c[2],a},e.mul=e.multiply,e.divide=function(a,b,c){return a[0]=b[0]/c[0],a[1]=b[1]/c[1],a[2]=b[2]/c[2],a},e.div=e.divide,e.min=function(a,b,c){return a[0]=Math.min(b[0],c[0]),a[1]=Math.min(b[1],c[1]),a[2]=Math.min(b[2],c[2]),a},e.max=function(a,b,c){return a[0]=Math.max(b[0],c[0]),a[1]=Math.max(b[1],c[1]),a[2]=Math.max(b[2],c[2]),a},e.scale=function(a,b,c){return a[0]=b[0]*c,a[1]=b[1]*c,a[2]=b[2]*c,a},e.scaleAndAdd=function(a,b,c,d){return a[0]=b[0]+c[0]*d,a[1]=b[1]+c[1]*d,a[2]=b[2]+c[2]*d,a},e.distance=function(a,b){var c=b[0]-a[0],d=b[1]-a[1],e=b[2]-a[2];return Math.sqrt(c*c+d*d+e*e)},e.dist=e.distance,e.squaredDistance=function(a,b){var c=b[0]-a[0],d=b[1]-a[1],e=b[2]-a[2];return c*c+d*d+e*e},e.sqrDist=e.squaredDistance,e.length=function(a){var b=a[0],c=a[1],d=a[2];return Math.sqrt(b*b+c*c+d*d)},e.len=e.length,e.squaredLength=function(a){var b=a[0],c=a[1],d=a[2];return b*b+c*c+d*d},e.sqrLen=e.squaredLength,e.negate=function(a,b){return a[0]=-b[0],a[1]=-b[1],a[2]=-b[2],a},e.inverse=function(a,b){return a[0]=1/b[0],a[1]=1/b[1],a[2]=1/b[2],a},e.normalize=function(a,b){var c=b[0],d=b[1],e=b[2],f=c*c+d*d+e*e;return f>0&&(f=1/Math.sqrt(f),a[0]=b[0]*f,a[1]=b[1]*f,a[2]=b[2]*f),a},e.dot=function(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]},e.cross=function(a,b,c){var d=b[0],e=b[1],f=b[2],g=c[0],h=c[1],i=c[2];return a[0]=e*i-f*h,a[1]=f*g-d*i,a[2]=d*h-e*g,a},e.lerp=function(a,b,c,d){var e=b[0],f=b[1],g=b[2];return a[0]=e+d*(c[0]-e),a[1]=f+d*(c[1]-f),a[2]=g+d*(c[2]-g),a},e.hermite=function(a,b,c,d,e,f){var g=f*f,h=g*(2*f-3)+1,i=g*(f-2)+f,j=g*(f-1),k=g*(3-2*f);return a[0]=b[0]*h+c[0]*i+d[0]*j+e[0]*k,a[1]=b[1]*h+c[1]*i+d[1]*j+e[1]*k,a[2]=b[2]*h+c[2]*i+d[2]*j+e[2]*k,a},e.bezier=function(a,b,c,d,e,f){var g=1-f,h=g*g,i=f*f,j=h*g,k=3*f*h,l=3*i*g,m=i*f;return a[0]=b[0]*j+c[0]*k+d[0]*l+e[0]*m,a[1]=b[1]*j+c[1]*k+d[1]*l+e[1]*m,a[2]=b[2]*j+c[2]*k+d[2]*l+e[2]*m,a},e.random=function(a,b){b=b||1;var c=2*d.RANDOM()*Math.PI,e=2*d.RANDOM()-1,f=Math.sqrt(1-e*e)*b;return a[0]=Math.cos(c)*f,a[1]=Math.sin(c)*f,a[2]=e*b,a},e.transformMat4=function(a,b,c){var d=b[0],e=b[1],f=b[2],g=c[3]*d+c[7]*e+c[11]*f+c[15];return g=g||1,a[0]=(c[0]*d+c[4]*e+c[8]*f+c[12])/g,a[1]=(c[1]*d+c[5]*e+c[9]*f+c[13])/g,a[2]=(c[2]*d+c[6]*e+c[10]*f+c[14])/g,a},e.transformMat3=function(a,b,c){var d=b[0],e=b[1],f=b[2];return a[0]=d*c[0]+e*c[3]+f*c[6],a[1]=d*c[1]+e*c[4]+f*c[7],a[2]=d*c[2]+e*c[5]+f*c[8],a},e.transformQuat=function(a,b,c){var d=b[0],e=b[1],f=b[2],g=c[0],h=c[1],i=c[2],j=c[3],k=j*d+h*f-i*e,l=j*e+i*d-g*f,m=j*f+g*e-h*d,n=-g*d-h*e-i*f;return a[0]=k*j+n*-g+l*-i-m*-h,a[1]=l*j+n*-h+m*-g-k*-i,a[2]=m*j+n*-i+k*-h-l*-g,a},e.rotateX=function(a,b,c,d){var e=[],f=[];return e[0]=b[0]-c[0],e[1]=b[1]-c[1],e[2]=b[2]-c[2],f[0]=e[0],f[1]=e[1]*Math.cos(d)-e[2]*Math.sin(d),f[2]=e[1]*Math.sin(d)+e[2]*Math.cos(d),a[0]=f[0]+c[0],a[1]=f[1]+c[1],a[2]=f[2]+c[2],a},e.rotateY=function(a,b,c,d){var e=[],f=[];return e[0]=b[0]-c[0],e[1]=b[1]-c[1],e[2]=b[2]-c[2],f[0]=e[2]*Math.sin(d)+e[0]*Math.cos(d),f[1]=e[1],f[2]=e[2]*Math.cos(d)-e[0]*Math.sin(d),a[0]=f[0]+c[0],a[1]=f[1]+c[1],a[2]=f[2]+c[2],a},e.rotateZ=function(a,b,c,d){var e=[],f=[];return e[0]=b[0]-c[0],e[1]=b[1]-c[1],e[2]=b[2]-c[2],f[0]=e[0]*Math.cos(d)-e[1]*Math.sin(d),f[1]=e[0]*Math.sin(d)+e[1]*Math.cos(d),f[2]=e[2],a[0]=f[0]+c[0],a[1]=f[1]+c[1],a[2]=f[2]+c[2],a},e.forEach=function(){var a=e.create();return function(b,c,d,e,f,g){var h,i;for(c||(c=3),d||(d=0),i=e?Math.min(e*c+d,b.length):b.length,h=d;i>h;h+=c)a[0]=b[h],a[1]=b[h+1],a[2]=b[h+2],f(a,a,g),b[h]=a[0],b[h+1]=a[1],b[h+2]=a[2];return b}}(),e.angle=function(a,b){var c=e.fromValues(a[0],a[1],a[2]),d=e.fromValues(b[0],b[1],b[2]);e.normalize(c,c),e.normalize(d,d);var f=e.dot(c,d);return f>1?0:Math.acos(f)},e.str=function(a){return"vec3("+a[0]+", "+a[1]+", "+a[2]+")"},a.exports=e},function(a,b,c){var d=c(1),e={};e.create=function(){var a=new d.ARRAY_TYPE(4);return a[0]=0,a[1]=0,a[2]=0,a[3]=0,a},e.clone=function(a){var b=new d.ARRAY_TYPE(4);return b[0]=a[0],b[1]=a[1],b[2]=a[2],b[3]=a[3],b},e.fromValues=function(a,b,c,e){var f=new d.ARRAY_TYPE(4);return f[0]=a,f[1]=b,f[2]=c,f[3]=e,f},e.copy=function(a,b){return a[0]=b[0],a[1]=b[1],a[2]=b[2],a[3]=b[3],a},e.set=function(a,b,c,d,e){return a[0]=b,a[1]=c,a[2]=d,a[3]=e,a},e.add=function(a,b,c){return a[0]=b[0]+c[0],a[1]=b[1]+c[1],a[2]=b[2]+c[2],a[3]=b[3]+c[3],a},e.subtract=function(a,b,c){return a[0]=b[0]-c[0],a[1]=b[1]-c[1],a[2]=b[2]-c[2],a[3]=b[3]-c[3],a},e.sub=e.subtract,e.multiply=function(a,b,c){return a[0]=b[0]*c[0],a[1]=b[1]*c[1],a[2]=b[2]*c[2],a[3]=b[3]*c[3],a},e.mul=e.multiply,e.divide=function(a,b,c){return a[0]=b[0]/c[0],a[1]=b[1]/c[1],a[2]=b[2]/c[2],a[3]=b[3]/c[3],a},e.div=e.divide,e.min=function(a,b,c){return a[0]=Math.min(b[0],c[0]),a[1]=Math.min(b[1],c[1]),a[2]=Math.min(b[2],c[2]),a[3]=Math.min(b[3],c[3]),a},e.max=function(a,b,c){return a[0]=Math.max(b[0],c[0]),a[1]=Math.max(b[1],c[1]),a[2]=Math.max(b[2],c[2]),a[3]=Math.max(b[3],c[3]),a},e.scale=function(a,b,c){return a[0]=b[0]*c,a[1]=b[1]*c,a[2]=b[2]*c,a[3]=b[3]*c,a},e.scaleAndAdd=function(a,b,c,d){return a[0]=b[0]+c[0]*d,a[1]=b[1]+c[1]*d,a[2]=b[2]+c[2]*d,a[3]=b[3]+c[3]*d,a},e.distance=function(a,b){var c=b[0]-a[0],d=b[1]-a[1],e=b[2]-a[2],f=b[3]-a[3];return Math.sqrt(c*c+d*d+e*e+f*f)},e.dist=e.distance,e.squaredDistance=function(a,b){var c=b[0]-a[0],d=b[1]-a[1],e=b[2]-a[2],f=b[3]-a[3];return c*c+d*d+e*e+f*f},e.sqrDist=e.squaredDistance,e.length=function(a){var b=a[0],c=a[1],d=a[2],e=a[3];return Math.sqrt(b*b+c*c+d*d+e*e)},e.len=e.length,e.squaredLength=function(a){var b=a[0],c=a[1],d=a[2],e=a[3];return b*b+c*c+d*d+e*e},e.sqrLen=e.squaredLength,e.negate=function(a,b){return a[0]=-b[0],a[1]=-b[1],a[2]=-b[2],a[3]=-b[3],a},e.inverse=function(a,b){return a[0]=1/b[0],a[1]=1/b[1],a[2]=1/b[2],a[3]=1/b[3],a},e.normalize=function(a,b){var c=b[0],d=b[1],e=b[2],f=b[3],g=c*c+d*d+e*e+f*f;return g>0&&(g=1/Math.sqrt(g),a[0]=c*g,a[1]=d*g,a[2]=e*g,a[3]=f*g),a},e.dot=function(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]+a[3]*b[3]},e.lerp=function(a,b,c,d){var e=b[0],f=b[1],g=b[2],h=b[3];return a[0]=e+d*(c[0]-e),a[1]=f+d*(c[1]-f),a[2]=g+d*(c[2]-g),a[3]=h+d*(c[3]-h),a},e.random=function(a,b){return b=b||1,a[0]=d.RANDOM(),a[1]=d.RANDOM(),a[2]=d.RANDOM(),a[3]=d.RANDOM(),e.normalize(a,a),e.scale(a,a,b),a},e.transformMat4=function(a,b,c){var d=b[0],e=b[1],f=b[2],g=b[3];return a[0]=c[0]*d+c[4]*e+c[8]*f+c[12]*g,a[1]=c[1]*d+c[5]*e+c[9]*f+c[13]*g,a[2]=c[2]*d+c[6]*e+c[10]*f+c[14]*g,a[3]=c[3]*d+c[7]*e+c[11]*f+c[15]*g,a},e.transformQuat=function(a,b,c){var d=b[0],e=b[1],f=b[2],g=c[0],h=c[1],i=c[2],j=c[3],k=j*d+h*f-i*e,l=j*e+i*d-g*f,m=j*f+g*e-h*d,n=-g*d-h*e-i*f;return a[0]=k*j+n*-g+l*-i-m*-h,a[1]=l*j+n*-h+m*-g-k*-i,a[2]=m*j+n*-i+k*-h-l*-g,a[3]=b[3],a},e.forEach=function(){var a=e.create();return function(b,c,d,e,f,g){var h,i;for(c||(c=4),d||(d=0),i=e?Math.min(e*c+d,b.length):b.length,h=d;i>h;h+=c)a[0]=b[h],a[1]=b[h+1],a[2]=b[h+2],a[3]=b[h+3],f(a,a,g),b[h]=a[0],b[h+1]=a[1],b[h+2]=a[2],b[h+3]=a[3];return b}}(),e.str=function(a){return"vec4("+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+")"},a.exports=e},function(a,b,c){var d=c(1),e={};e.create=function(){var a=new d.ARRAY_TYPE(2);return a[0]=0,a[1]=0,a},e.clone=function(a){var b=new d.ARRAY_TYPE(2);return b[0]=a[0],b[1]=a[1],b},e.fromValues=function(a,b){var c=new d.ARRAY_TYPE(2);return c[0]=a,c[1]=b,c},e.copy=function(a,b){return a[0]=b[0],a[1]=b[1],a},e.set=function(a,b,c){return a[0]=b,a[1]=c,a},e.add=function(a,b,c){return a[0]=b[0]+c[0],a[1]=b[1]+c[1],a},e.subtract=function(a,b,c){return a[0]=b[0]-c[0],a[1]=b[1]-c[1],a},e.sub=e.subtract,e.multiply=function(a,b,c){return a[0]=b[0]*c[0],a[1]=b[1]*c[1],a},e.mul=e.multiply,e.divide=function(a,b,c){return a[0]=b[0]/c[0],a[1]=b[1]/c[1],a},e.div=e.divide,e.min=function(a,b,c){return a[0]=Math.min(b[0],c[0]),a[1]=Math.min(b[1],c[1]),a},e.max=function(a,b,c){return a[0]=Math.max(b[0],c[0]),a[1]=Math.max(b[1],c[1]),a},e.scale=function(a,b,c){return a[0]=b[0]*c,a[1]=b[1]*c,a},e.scaleAndAdd=function(a,b,c,d){return a[0]=b[0]+c[0]*d,a[1]=b[1]+c[1]*d,a},e.distance=function(a,b){var c=b[0]-a[0],d=b[1]-a[1];return Math.sqrt(c*c+d*d)},e.dist=e.distance,e.squaredDistance=function(a,b){var c=b[0]-a[0],d=b[1]-a[1];return c*c+d*d},e.sqrDist=e.squaredDistance,e.length=function(a){var b=a[0],c=a[1];return Math.sqrt(b*b+c*c)},e.len=e.length,e.squaredLength=function(a){var b=a[0],c=a[1];return b*b+c*c},e.sqrLen=e.squaredLength,e.negate=function(a,b){return a[0]=-b[0],a[1]=-b[1],a},e.inverse=function(a,b){return a[0]=1/b[0],a[1]=1/b[1],a},e.normalize=function(a,b){var c=b[0],d=b[1],e=c*c+d*d;return e>0&&(e=1/Math.sqrt(e),a[0]=b[0]*e,a[1]=b[1]*e),a},e.dot=function(a,b){return a[0]*b[0]+a[1]*b[1]},e.cross=function(a,b,c){var d=b[0]*c[1]-b[1]*c[0];return a[0]=a[1]=0,a[2]=d,a},e.lerp=function(a,b,c,d){var e=b[0],f=b[1];return a[0]=e+d*(c[0]-e),a[1]=f+d*(c[1]-f),a},e.random=function(a,b){b=b||1;var c=2*d.RANDOM()*Math.PI;return a[0]=Math.cos(c)*b,a[1]=Math.sin(c)*b,a},e.transformMat2=function(a,b,c){var d=b[0],e=b[1];return a[0]=c[0]*d+c[2]*e,a[1]=c[1]*d+c[3]*e,a},e.transformMat2d=function(a,b,c){var d=b[0],e=b[1];return a[0]=c[0]*d+c[2]*e+c[4],a[1]=c[1]*d+c[3]*e+c[5],a},e.transformMat3=function(a,b,c){
var d=b[0],e=b[1];return a[0]=c[0]*d+c[3]*e+c[6],a[1]=c[1]*d+c[4]*e+c[7],a},e.transformMat4=function(a,b,c){var d=b[0],e=b[1];return a[0]=c[0]*d+c[4]*e+c[12],a[1]=c[1]*d+c[5]*e+c[13],a},e.forEach=function(){var a=e.create();return function(b,c,d,e,f,g){var h,i;for(c||(c=2),d||(d=0),i=e?Math.min(e*c+d,b.length):b.length,h=d;i>h;h+=c)a[0]=b[h],a[1]=b[h+1],f(a,a,g),b[h]=a[0],b[h+1]=a[1];return b}}(),e.str=function(a){return"vec2("+a[0]+", "+a[1]+")"},a.exports=e}])}),function(a){function b(a,b,c,d,e){this._listener=b,this._isOnce=c,this.context=d,this._signal=a,this._priority=e||0}function c(a,b){if("function"!=typeof a)throw Error("listener is a required param of {fn}() and should be a Function.".replace("{fn}",b))}function d(){this._bindings=[],this._prevParams=null;var a=this;this.dispatch=function(){d.prototype.dispatch.apply(a,arguments)}}b.prototype={active:!0,params:null,execute:function(a){var b;return this.active&&this._listener&&(a=this.params?this.params.concat(a):a,b=this._listener.apply(this.context,a),this._isOnce&&this.detach()),b},detach:function(){return this.isBound()?this._signal.remove(this._listener,this.context):null},isBound:function(){return!!this._signal&&!!this._listener},isOnce:function(){return this._isOnce},getListener:function(){return this._listener},getSignal:function(){return this._signal},_destroy:function(){delete this._signal,delete this._listener,delete this.context},toString:function(){return"[SignalBinding isOnce:"+this._isOnce+", isBound:"+this.isBound()+", active:"+this.active+"]"}},d.prototype={VERSION:"1.0.0",memorize:!1,_shouldPropagate:!0,active:!0,_registerListener:function(a,c,d,e){var f=this._indexOfListener(a,d);if(-1!==f){if(a=this._bindings[f],a.isOnce()!==c)throw Error("You cannot add"+(c?"":"Once")+"() then add"+(c?"Once":"")+"() the same listener without removing the relationship first.")}else a=new b(this,a,c,d,e),this._addBinding(a);return this.memorize&&this._prevParams&&a.execute(this._prevParams),a},_addBinding:function(a){var b=this._bindings.length;do--b;while(this._bindings[b]&&a._priority<=this._bindings[b]._priority);this._bindings.splice(b+1,0,a)},_indexOfListener:function(a,b){for(var c,d=this._bindings.length;d--;)if(c=this._bindings[d],c._listener===a&&c.context===b)return d;return-1},has:function(a,b){return-1!==this._indexOfListener(a,b)},add:function(a,b,d){return c(a,"add"),this._registerListener(a,!1,b,d)},addOnce:function(a,b,d){return c(a,"addOnce"),this._registerListener(a,!0,b,d)},remove:function(a,b){c(a,"remove");var d=this._indexOfListener(a,b);return-1!==d&&(this._bindings[d]._destroy(),this._bindings.splice(d,1)),a},removeAll:function(){for(var a=this._bindings.length;a--;)this._bindings[a]._destroy();this._bindings.length=0},getNumListeners:function(){return this._bindings.length},halt:function(){this._shouldPropagate=!1},dispatch:function(a){if(this.active){var b,c=Array.prototype.slice.call(arguments),d=this._bindings.length;if(this.memorize&&(this._prevParams=c),d){b=this._bindings.slice(),this._shouldPropagate=!0;do d--;while(b[d]&&this._shouldPropagate&&b[d].execute(c)!==!1)}}},forget:function(){this._prevParams=null},dispose:function(){this.removeAll(),delete this._bindings,delete this._prevParams},toString:function(){return"[Signal active:"+this.active+" numListeners:"+this.getNumListeners()+"]"}};var e=d;e.Signal=d,"function"==typeof define&&define.amd?define(function(){return e}):"undefined"!=typeof module&&module.exports?module.exports=e:a.signals=e}(this),!function(a){var b=function(a,b){for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c])};"function"==typeof define&&define.amd?define(function(){return b}):"undefined"!=typeof module&&module.exports?module.exports=b:a.mixin=b}(this);
var EZ3 = {
  VERSION: '1.0.0',
  Vec2: vec2,
  Vec3: vec3,
  Vec4: vec4,
  Mat2: mat2,
  Mat3: mat3,
  Mat4: mat4,
  Signal: signals.Signal
};

EZ3.PI = Math.PI;
EZ3.HALF_PI = 0.5 * EZ3.PI;
EZ3.DOUBLE_PI = 2.0 * EZ3.PI;

EZ3.ELEMENTS_DRAW = 0;
EZ3.ARRAYS_DRAW = 1;

/**
 * @class Cache
 */

EZ3.Cache = function() {
  this._content = [];
  this._content[EZ3.Cache.IMAGE] = {};
  this._content[EZ3.Cache.DATA] = {};
};

EZ3.Cache.prototype.get = function(type, id) {
  if (!this._content[type])
    return undefined;
  return this._content[type][id];
};

EZ3.Cache.prototype.set = function(id, content) {
  if (content instanceof Image)
    this._content[EZ3.Cache.IMAGE][id] = content;
  else if (content instanceof XMLHttpRequest)
    this._content[EZ3.Cache.DATA][id] = content;
};

EZ3.Cache.IMAGE = 0;
EZ3.Cache.DATA = 1;

/**
 * @class Engine
 */

EZ3.Engine = function(canvas, options) {
  this.device = EZ3.Device;
  this.input = null;
  this.screens = null;

  this._animationFrame = null;
  this._time = null;
  this._renderer = null;
  this._cache = null;

  this.device.onReady(this._init, this, [canvas, options]);
};

EZ3.Engine.prototype._init = function(canvas, options) {
  this._animationFrame = new EZ3.AnimationFrame(this.device, false);
  this._time = new EZ3.Time();
  this._renderer = new EZ3.Renderer(canvas, options);
  this._cache = new EZ3.Cache();
  this.input = new EZ3.InputManager(this.device, canvas);
  this.screens = new EZ3.ScreenManager(this._device, this._time, this._renderer, this.input, this._cache);


  this._renderer.initContext();
  this._time.start();
  this._update();
};

EZ3.Engine.prototype._update = function() {
  this.screens.update();
  this._time.update();
  this._animationFrame.request(this._update.bind(this));
};

EZ3.Entity = function() {
  this.parent = null;
  this.children = [];
  this.scale = vec3.create();
  this.position = vec3.create();
  this.rotation = quat.create();
  this.modelMatrix = mat4.create();
  this.worldMatrix = mat4.create();
  this.normalMatrix = mat3.create();

  vec3.set(this.scale, 1, 1 ,1);
  vec3.set(this.position, 0, 0 ,0);
  quat.set(this.rotation, 0, 0, 0, 0);

  mat4.identity(this.modelMatrix);
  mat4.identity(this.worldMatrix);
  mat3.identity(this.normalMatrix);

  this.dirty = true;
  this.scale.dirty = false;
  this.position.dirty = false;
  this.rotation.dirty = false;
};

EZ3.Entity.prototype.add = function(child) {
  if(child instanceof EZ3.Mesh){

    if(child.parent)
      child.parent.remove(child);

    this.dirty = true;
    child.parent = this;
    this.children.push(child);

  }else{
    throw('Child object must have a prototype of Entity');
  }
};

EZ3.Entity.prototype.remove = function(child) {
  var position = this.children.indexOf(child);

  if(~position){
    this.children.splice(position,1);
    this.dirty = true;
  }
};

EZ3.Entity.prototype.update = function(parentIsDirty, parentWorldMatrix) {
  this.dirty = this.dirty || parentIsDirty || this.scale.dirty || this.position.dirty || this.rotation.dirty;

  if(this.dirty){

    mat4.fromRotationTranslation(this.modelMatrix, this.rotation, this.position);
    mat4.scale(this.modelMatrix, this.modelMatrix, this.scale);

    if(!parentWorldMatrix)
        mat4.copy(this.worldMatrix, this.modelMatrix);
    else
        mat4.multiply(this.worldMatrix, parentWorldMatrix, this.modelMatrix);

    mat3.normalFromMat4(this.normalMatrix, this.worldMatrix);

    for(var k = this.children.length - 1; k >= 0; --k)
      this.children[k].update(this.worldMatrix, this.dirty);

    this.dirty = false;
    this.scale.dirty = false;
    this.position.dirty = false;
    this.rotation.dirty = false;
  }
};

EZ3.Scene = function() {
  EZ3.Entity.call(this);
};

EZ3.Scene.prototype = Object.create(EZ3.Entity.prototype);
EZ3.Scene.prototype.constructor = EZ3.Scene;

/**
 * @class Screen
 */

EZ3.Screen = function(id, position, size) {
  this.id = id;
  this.position = position;
  this.size = size;
  this.scene = new EZ3.Scene();
};

EZ3.Screen.prototype.onKeyPress = function() {
};

EZ3.Screen.prototype.onKeyDown = function() {
};

EZ3.Screen.prototype.onKeyUp = function() {
};

EZ3.Screen.prototype.onMousePress = function() {
};

EZ3.Screen.prototype.onMouseMove = function() {
};

EZ3.Screen.prototype.onMouseUp = function() {
};

EZ3.Screen.prototype.onTouchPress = function() {
};

EZ3.Screen.prototype.onTouchMove = function() {
};

EZ3.Screen.prototype.onTouchUp = function() {
};

EZ3.Screen.prototype.create = function() {
};

EZ3.Screen.prototype.update = function() {
};

/**
 * @class ScreenManager
 */

EZ3.ScreenManager = function(device, time, renderer, input, cache) {
  this._device = device;
  this._time = time;
  this._renderer = renderer;
  this._input = input;
  this._cache = cache;
  this._screens = [];
};

EZ3.ScreenManager.prototype.add = function(screen) {
  var inputs, events;
  var i, j;

  if (screen instanceof EZ3.Screen) {
    screen.manager = this;
    screen.device = this._device;
    screen.time = this._time;
    screen.renderer = this._renderer;
    screen.input = this._input;
    screen.cache = this._cache;
    screen.loader = new EZ3.Loader(this._cache);

    inputs = {
      keyboard: [
        'onKeyPress',
        'onKeyDown',
        'onKeyUp'
      ],
      mouse: [
        'onMousePress',
        'onMouseMove',
        'onMouseUp'
      ],
      touch: [
        'onTouchPress',
        'onTouchMove',
        'onTouchUp'
      ]
    };

    for (i in inputs) {
      events = inputs[i];

      for (j = 0; j < events.length; j++) {
        if (screen.input[i][events[j]] !== EZ3.Screen.prototype[i])
          screen.input[i][events[j]].add(screen[events[j]], screen);
      }
    }

    if (screen.load) {
      screen.load();
      screen.loader.onComplete.add(screen.create, screen);
      screen.loader.start();
    } else
      screen.create();

    this._screens.unshift(screen);

    return screen;
  }
};

EZ3.ScreenManager.prototype.get = function(id) {
  var i;

  for (i = 0; i < this._screens.length; i++)
    if (this._screens[i].id === id)
      return this._screens[i];
};

EZ3.ScreenManager.prototype.remove = function(id) {
  var i;

  for (i = 0; i < this._screens.length; i++)
    if (this._screens[i].id === id)
      return this._screens.splice(i, 1);
};

EZ3.ScreenManager.prototype.update = function() {
  var i;

  for (i = 0; i < this._screens.length; i++) {
    this._renderer.render(this._screens[i]);
    this._screens[i].update();
  }
};

/**
 * @class InputManager
 */

EZ3.InputManager = function(device, canvas) {
  this.keyboard = new EZ3.Keyboard();
  this.mouse = new EZ3.Mouse(canvas);
  this.touch = new EZ3.Touch(device, canvas);
};

/**
 * @class Keboard
 */

EZ3.Keyboard = function() {
  this._keys = [];

  this.enabled = false;
  this.onKeyPress = new EZ3.Signal();
  this.onKeyDown = new EZ3.Signal();
  this.onKeyUp = new EZ3.Signal();
};

EZ3.Keyboard.prototype.constructor = EZ3.Keyboard;

EZ3.Keyboard.prototype._processKeyDown = function(event) {
  if(!this._keys[event.keyCode])
    this._keys[event.keyCode] = new EZ3.Switch(event.keyCode);

  if(this._keys[event.keyCode].processDown())
    this.onKeyPress.dispatch(this._keys[event.keyCode]);

  this.onKeyDown.dispatch(this._keys[event.keyCode]);
};

EZ3.Keyboard.prototype._processKeyUp = function(event) {
  if(!this._keys[event.keyCode])
    this._keys[event.keyCode] = new EZ3.Switch(event.keyCode);

  this._keys[event.keyCode].processUp();
  this.onKeyUp.dispatch(this._keys[event.keyCode]);
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

  window.addEventListener('keydown', this._onKeyDown, false);
	window.addEventListener('keyup', this._onKeyUp, false);
};

EZ3.Keyboard.prototype.disable = function() {
  this.enabled = false;

  window.removeEventListener('keydown', this._onKeyDown);
	window.removeEventListener('keyup', this._onKeyUp);

  delete this._onKeyDown;
  delete this._onKeyUp;
};

EZ3.Keyboard.prototype.getKey = function(code) {
  if(!this._keys[code])
    this._keys[code] = new EZ3.Switch(code);

  return this._keys[code];
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

/**
 * @class Mouse
 */

EZ3.Mouse = function(domElement) {
  this._domElement = domElement;

  this.enabled = false;
  this.pointer = new EZ3.MousePointer();
  this.onPress = new EZ3.Signal();
  this.onMove = new EZ3.Signal();
  this.onUp = new EZ3.Signal();
  this.onWheel = new EZ3.Signal();
};

EZ3.Mouse.prototype.constructor = EZ3.Mouse;

EZ3.Mouse.prototype._processMousePress = function(event) {
  this.pointer.processPress(event, this.onPress, this.onMove);
};

EZ3.Mouse.prototype._processMouseMove = function(event) {
  this.pointer.processMove(event, this.onMove);
};

EZ3.Mouse.prototype._processMouseUp = function(event) {
  this.pointer.processUp(event, this.onUp);
};

EZ3.Mouse.prototype._processMouseWheel = function(event) {
  this.pointer.processWheel(event, this.onWheel);
};

EZ3.Mouse.prototype.enable = function() {
  var that = this;

  this.enabled = true;

  this._onMousePress = function (event) {
    that._processMousePress(event);
  };

  this._onMouseMove = function (event) {
    that._processMouseMove(event);
  };

  this._onMouseUp = function (event) {
    that._processMouseUp(event);
  };

  this._onMouseWheel = function(event) {
    that._processMouseWheel(event);
  };

  this._domElement.addEventListener('mousedown', this._onMousePress, true);
  this._domElement.addEventListener('mousemove', this._onMouseMove, true);
  this._domElement.addEventListener('mouseup', this._onMouseUp, true);
  this._domElement.addEventListener('mousewheel', this._onMouseWheel, true);
  this._domElement.addEventListener('DOMMouseScroll', this._onMouseWheel, true);
};

EZ3.Mouse.prototype.disable = function() {
  this.enabled = false;

  this._domElement.removeEventListener('mousedown', this._onMousePointerDown, true);
  this._domElement.removeEventListener('mousemove', this._onMousePointerMove, true);
  this._domElement.removeEventListener('mouseup', this._onMousePointerUp, true);
  this._domElement.removeEventListener('mousewheel', this._onMousePointerWheel, true);
  this._domElement.removeEventListener('DOMMouseScroll', this._onMousePointerWheel, true);

  delete this._onMousePress;
  delete this._onMouseMove;
  delete this._onMouseUp;
  delete this._onMouseWheel;
};

EZ3.Mouse.LEFT_BUTTON = 0;
EZ3.Mouse.RIGHT_BUTTON = 1;
EZ3.Mouse.MIDDLE_BUTTON = 2;
EZ3.Mouse.BACK_BUTTON = 3;
EZ3.Mouse.FORWARD_BUTTON = 4;

/**
 * @class Pointer
 */

EZ3.Pointer = function() {
  this.client = EZ3.Vec2.create();
  this.page = EZ3.Vec2.create();
  this.screen = EZ3.Vec2.create();

  EZ3.Vec2.set(this.client, 0, 0);
  EZ3.Vec2.set(this.page, 0, 0);
  EZ3.Vec2.set(this.screen, 0, 0);
};

EZ3.Pointer.prototype.constructor = EZ3.Pointer;

EZ3.Pointer.prototype.processPress = function(event) {
  EZ3.Pointer.prototype.processMove.call(this, event);
};

EZ3.Pointer.prototype.processMove = function(event) {
  EZ3.Vec2.set(this.client, event.clientX, event.clientY);
  EZ3.Vec2.set(this.page, event.pageX, event.pageY);
  EZ3.Vec2.set(this.screen, event.screenX, event.screenY);
};

/**
 * @class Switch
 */

EZ3.Switch = function(code) {
  this._state = false;

  this.code = code;
};

EZ3.Switch.prototype.constructor = EZ3.Switch;

EZ3.Switch.prototype.processPress = function() {
  this._state = true;
};

EZ3.Switch.prototype.processDown = function() {
  var isUp = this.isUp();

  this._state = true;

  return isUp;
};

EZ3.Switch.prototype.processUp = function() {
  this._state = false;
};

EZ3.Switch.prototype.isDown = function() {
  return this._state;
};

EZ3.Switch.prototype.isUp = function() {
  return !this._state;
};

/**
 * @class Touch
 */

EZ3.Touch = function(device, domElement) {
  this._domElement = domElement;
  this._device = device;
  this._pointers = [];

  this.enabled = false;
  this.onPress = new EZ3.Signal();
  this.onMove = new EZ3.Signal();
  this.onUp = new EZ3.Signal();
};

EZ3.Touch.prototype.constructor = EZ3.Touch;

EZ3.Touch.prototype._searchPointerIndex = function(id) {
  for (var i = 0; i < this._pointers.length; i++)
    if (id === this._pointers[i].id)
      return i;

  return -1;
};

EZ3.Touch.prototype._processTouchPress = function(event) {
  event.preventDefault();

  for (var i = 0; i < event.changedTouches.length; i++) {
    var found = false;

    for (var j = 0; j < EZ3.Touch.MAX_NUM_OF_POINTERS; j++) {
      if (!this._pointers[j]) {
        this._pointers[j] = new EZ3.TouchPointer(j, event.changedTouches[i].identifier);
        found = true;
        break;
      } else if (this._pointers[j].isUp()) {
        this._pointers[j].id = event.changedTouches[i].identifier;
        found = true;
        break;
      }
    }

    if (found)
      this._pointers[j].processPress(event.changedTouches[i], this.onPress, this.onMove);
  }
};

EZ3.Touch.prototype._processTouchMove = function(event) {
  event.preventDefault();

  for (var i = 0; i < event.changedTouches.length; i++) {
    var j = this._searchPointerIndex(event.changedTouches[i].identifier);
    if (j >= 0)
      this._pointers[j].processMove(event.changedTouches[i], this.onMove);
  }
};

EZ3.Touch.prototype._processTouchUp = function(event) {
  event.preventDefault();

  for (var i = 0; i < event.changedTouches.length; i++) {
    var j = this._searchPointerIndex(event.changedTouches[i].identifier);
    if (j >= 0)
      this._pointers[j].processUp(this.onUp);
  }
};

EZ3.Touch.prototype.enable = function() {
  if (this._device.touch) {
    var that = this;

    this.enabled = true;

    this._onTouchPress = function(event) {
      that._processTouchPress(event);
    };

    this._onTouchMove = function(event) {
      that._processTouchMove(event);
    };

    this._onTouchUp = function(event) {
      that._processTouchUp(event);
    };

    if (this._device.touch === EZ3.Device.TOUCH.STANDARD) {
      this._press = 'touchstart';
      this._move = 'touchmove';
      this._up = 'touchend';
    } else if (this._device.touch === EZ3.Device.TOUCH.POINTER) {
      this._press = 'pointerdown';
      this._move = 'pointermove';
      this._up = 'pointerup';
    } else {
      this._press = 'MSPointerDown';
      this._move = 'MSPointerMove';
      this._up = 'MSPointerUp';
    }

    this._domElement.addEventListener(this._press, this._onTouchPress, false);
    this._domElement.addEventListener(this._move, this._onTouchMove, false);
    this._domElement.addEventListener(this._up, this._onTouchUp, false);
  }
};

EZ3.Touch.prototype.disable = function() {
  if (this._device.touch) {
    this.enabled = false;

    this._domElement.removeEventListener(this._press, this._onTouchPress, false);
    this._domElement.removeEventListener(this._move, this._onTouchMove, false);
    this._domElement.removeEventListener(this._up, this._onTouchUp, false);

    delete this._onTouchPress;
    delete this._onTouchMove;
    delete this._onTouchUp;

    delete this._press;
    delete this._move;
    delete this._up;
  }
};

EZ3.Touch.prototype.getPointer = function(code) {
  if (!this._pointers[code])
    this._pointers[code] = new EZ3.TouchPointer(code);

  return this._pointers[code];
};

EZ3.Touch.POINTER_1 = 0;
EZ3.Touch.POINTER_2 = 1;
EZ3.Touch.POINTER_3 = 2;
EZ3.Touch.POINTER_4 = 3;
EZ3.Touch.POINTER_5 = 4;
EZ3.Touch.POINTER_6 = 5;
EZ3.Touch.POINTER_7 = 6;
EZ3.Touch.POINTER_8 = 7;
EZ3.Touch.POINTER_9 = 8;
EZ3.Touch.POINTER_10 = 9;
EZ3.Touch.MAX_NUM_OF_POINTERS = 10;

/**
 * @class Data
 */

EZ3.Data = function(url, crossOrigin) {
  this.content = new XMLHttpRequest();
  this.url = url;
  this.crossOrigin = crossOrigin;
};

EZ3.Data.prototype._processLoad = function(onLoad) {
  this._end();

  onLoad(this);
};

EZ3.Data.prototype._processError = function(onError) {
  this._end();

  onError(this);
};

EZ3.Data.prototype._end = function() {
  this.content.removeEventListener('load', this._onLoad);
  this.content.removeEventListener('error', this._onError);

  delete this._onLoad;
  delete this._onError;
};

EZ3.Data.prototype.load = function(onLoad, onError) {
  var that = this;

  this._onLoad = function() {
    that._processLoad(onLoad);
  };

  this._onError = function() {
    that._processError(onError);
  };

  this.content.addEventListener('load', this._onLoad);
  this.content.addEventListener('error', this._onError);

  this.content.open('GET', this.url, true);

  if(this.crossOrigin)
    this.content.crossOrigin = this.crossOrigin;

  this.content.send(null);
};

/**
 * @class Data
 */

EZ3.Image = function(url, crossOrigin) {
  this.content = new Image();
  this.url = url;
  this.crossOrigin = crossOrigin;
};

EZ3.Image.prototype._processLoad = function(onLoad) {
  this._end();

  onLoad(this);
};

EZ3.Image.prototype._processReadyStateChange = function(onLoad) {
  if (this.content.readyState === 'complete') {
    this._end();

    onLoad(this);
  }
};

EZ3.Image.prototype._processError = function(onError) {
  this._end();

  onError(this);
};

EZ3.Image.prototype._end = function() {
  this.content.removeEventListener('load', this._onLoad);
  this.content.removeEventListener('readystatechange', this._onReadyStateChange);
  this.content.removeEventListener('error', this._onError);

  delete this._onLoad;
  delete this._onReadyStateChange;
  delete this._onError;
};

EZ3.Image.prototype.load = function(onLoad, onError) {
  var that = this;

  this._onLoad = function() {
    that._processLoad(onLoad);
  };

  this._onReadyStateChange = function() {
    that._processReadyStateChange(onLoad);
  };

  this._onError = function() {
    that._processError(onError);
  };

  this.content.addEventListener('load', this._onLoad);
  this.content.addEventListener('readystatechange', this._onReadyStateChange);
  this.content.addEventListener('error', this._onError);

  if (this.crossOrigin)
    this.content.crossOrigin = this.crossOrigin;

  this.content.src = this.url;
};

/**
 * @class Loader
 */

EZ3.Loader = function(cache) {
  this._cache = cache;
  this._files = {};
  this._numOfFilesLoaded = 0;
  this._numOfFilesErrors = 0;

  this.started = false;
  this.onProgress = new EZ3.Signal();
  this.onComplete = new EZ3.Signal();
};

EZ3.Loader.prototype._processFileLoad = function(file) {
  this._numOfFilesLoaded++;
  this._cache.set(file.id, file.content);

  this._processProgress(file, EZ3.Loader.FILE.LOADED);
};

EZ3.Loader.prototype._processFileError = function(file) {
  this._numOfFilesErrors++;

  this._processProgress(file, EZ3.Loader.FILE.ERROR);
};

EZ3.Loader.prototype._processProgress = function(file, status) {
  var numOfFiles, numOfFilesLoaded, numOfFilesErrors;

  numOfFiles = Object.keys(this._files).length;

  this.onProgress.dispatch(file, status, this._numOfFilesLoaded, this._numOfFilesErrors, numOfFiles);

  if (numOfFiles === this._numOfFilesLoaded + this._numOfFilesErrors) {
    numOfFilesLoaded = this._numOfFilesLoaded;
    numOfFilesErrors = this._numOfFilesErrors;

    this.started = false;
    this._files = {};
    this._numOfFilesLoaded = 0;
    this._numOfFilesErrors = 0;

    this.onComplete.dispatch(numOfFilesLoaded, numOfFilesErrors);
  }
};

EZ3.Loader.prototype.start = function() {
  this.started = true;

  for (var url in this._files)
    this._files[url].load(this._processFileLoad.bind(this), this._processFileError.bind(this));
};

EZ3.Loader.prototype.add = function(id, file) {
  var type;

  if (file instanceof EZ3.Image)
    type = EZ3.Cache.IMAGE;
  else if (file instanceof EZ3.Data)
    type = EZ3.Cache.DATA;
  else
    return;

  if (!this.started && !this._cache.get(type, id) && !this._files[file.url]) {
    file.id = id;
    this._files[file.url] = file;
  }
};

EZ3.Loader.FILE = {};
EZ3.Loader.FILE.ERROR = 0;
EZ3.Loader.FILE.LOADED = 1;

EZ3.Material = function(){
  this.dirty = true;
  this.name = 'material';
  this.vertex = null;
  this.program = null;
  this.fragment = null;
};

EZ3.Material.prototype.constructor = EZ3.Material;

EZ3.Geometry = function() {
  this.uvs = [];
  this.indices = [];
  this.normals = [];
  this.vertices = [];
  this.tangents = [];
  this.bitangents = [];
  this.maxPoint = vec3.create();
  this.minPoint = vec3.create();
  this.midPoint = vec3.create();

  this.uvsNeedUpdate = true;
  this.normalsNeedUpdate = true;
  this.indicesNeedUpdate = true;
  this.verticesNeedUpdate = true;
  this.tangentsNeedUpdate = true;
  this.bitangentsNeedUpdate = true;
};

EZ3.Geometry.prototype.initArray = function(size, value) {
  return Array.apply(null, new Array(size)).map(function() {
    return value;
  });
};

EZ3.Geometry.prototype.calculateNormals = function() {
  var x, y, z, k;
  var normal, point0, point1, point2, vector0, vector1;

  normal = vec3.create();
  point0 = vec3.create();
  point1 = vec3.create();
  point2 = vec3.create();
  vector0 = vec3.create();
  vector1 = vec3.create();

  var tempNormals = this.initArray(this.vertices.length, 0);
  var tempAppearances = this.initArray(this.vertices.length / 3, 0);

  for (k = 0; k < this.indices.length; k += 3) {

    x = 3 * this.indices[k + 0];
    y = 3 * this.indices[k + 1];
    z = 3 * this.indices[k + 2];

    vec3.set(point0, this.vertices[x + 0], this.vertices[x + 1], this.vertices[x + 2]);
    vec3.set(point1, this.vertices[y + 0], this.vertices[y + 1], this.vertices[y + 2]);
    vec3.set(point2, this.vertices[z + 0], this.vertices[z + 1], this.vertices[z + 2]);

    vec3.sub(vector0, point1, point0);
    vec3.sub(vector1, point2, point0);

    vec3.cross(normal, vector0, vector1);

    if (normal.x !== 0 || normal.y !== 0 || normal.z !== 0) {
      vec3.normalize(normal, normal);
    }

    tempNormals[x + 0] += normal[0];
    tempNormals[x + 1] += normal[1];
    tempNormals[x + 2] += normal[2];

    tempNormals[y + 0] += normal[0];
    tempNormals[y + 1] += normal[1];
    tempNormals[y + 2] += normal[2];

    tempNormals[z + 0] += normal[0];
    tempNormals[z + 1] += normal[1];
    tempNormals[z + 2] += normal[2];

    ++tempAppearances[x / 3];
    ++tempAppearances[y / 3];
    ++tempAppearances[z / 3];
  }

  for (k = 0; k < this.vertices.length / 3; ++k) {
    x = 3 * k + 0;
    y = 3 * k + 1;
    z = 3 * k + 2;

    this.normals.push(tempNormals[x] / tempAppearances[k]);
    this.normals.push(tempNormals[y] / tempAppearances[k]);
    this.normals.push(tempNormals[z] / tempAppearances[k]);
  }

  tempNormals.splice(0, tempNormals.length);
  tempAppearances.splice(0, tempAppearances.length);
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

EZ3.Geometry.prototype.calculateMidPoint = function() {
  this._midPoint[0] = (this._maxPoint[0] + this._minPoint[0]) * 0.5;
  this._midPoint[0] = (this._maxPoint[1] + this._minPoint[1]) * 0.5;
  this._midPoint[0] = (this._maxPoint[2] + this._minPoint[2]) * 0.5;
};

EZ3.Geometry.prototype.calculateTangents = function() {
  var x, y, z, k, r;

  var point0 = vec3.create();
  var point1 = vec3.create();
  var point2 = vec3.create();

  var vector0 = vec3.create();
  var vector1 = vec3.create();

  var normal = vec3.create();
  var tangent = vec4.create();
  var bitangent = vec3.create();

  var textPoint0 = vec2.create();
  var textPoint1 = vec2.create();
  var textPoint2 = vec2.create();

  var textVector0 = vec2.create();
  var textVector1 = vec2.create();

  var tempT = this.initArray(this.vertices.length, 0);
  var tempB = this.initArray(this.vertices.length, 0);

  for(k = 0; k < this.indices.length; k += 3) {
    x = this.indices[k + 0];
    y = this.indices[k + 1];
    z = this.indices[k + 2];

    vec3.set(point0, this.vertices[3 * x + 0], this.vertices[3 * x + 1], this.vertices[3 * x + 2]);
    vec3.set(point1, this.vertices[3 * y + 0], this.vertices[3 * y + 1], this.vertices[3 * y + 2]);
    vec3.set(point2, this.vertices[3 * z + 0], this.vertices[3 * z + 1], this.vertices[3 * z + 2]);

    vec2.set(textPoint0, this.uv[2 * x + 0], this.uv[2 * x + 1]);
    vec2.set(textPoint1, this.uv[2 * y + 0], this.uv[2 * y + 1]);
    vec2.set(textPoint2, this.uv[2 * z + 0], this.uv[2 * z + 1]);

    vec3.sub(vector0, point1, point0);
    vec3.sub(vector1, point2, point0);

    vec2.sub(textVector0, textPoint1, textPoint0);
    vec2.sub(textVector1, textPoint2, textPoint0);

    r = 1.0 / (textVector0[0] * textVector1[1] - textVector1[0] * textVector0[1]);

    tangent[0] = (textVector1[1] * vector0[0] - textVector0[1] * vector1[0]) * r;
    tangent[1] = (textVector1[1] * vector0[1] - textVector0[1] * vector1[1]) * r;
    tangent[2] = (textVector1[1] * vector0[2] - textVector0[1] * vector1[2]) * r;

    bitangent[0] = (textVector0[0] * vector1[0] - textVector1[0] * vector0[0]) * r;
    bitangent[1] = (textVector0[0] * vector1[1] - textVector1[0] * vector0[1]) * r;
    bitangent[2] = (textVector0[0] * vector1[2] - textVector1[0] * vector0[2]) * r;

    tempT[3 * x + 0] += tangent[0];
    tempT[3 * y + 0] += tangent[1];
    tempT[3 * z + 0] += tangent[2];

    tempT[3 * x + 1] += tangent[0];
    tempT[3 * y + 1] += tangent[1];
    tempT[3 * z + 1] += tangent[2];

    tempT[3 * x + 2] += tangent[0];
    tempT[3 * y + 2] += tangent[1];
    tempT[3 * z + 2] += tangent[2];

    tempB[3 * x + 0] += bitangent[0];
    tempB[3 * y + 0] += bitangent[1];
    tempB[3 * z + 0] += bitangent[2];

    tempB[3 * x + 1] += bitangent[0];
    tempB[3 * y + 1] += bitangent[1];
    tempB[3 * z + 1] += bitangent[2];

    tempB[3 * x + 2] += bitangent[0];
    tempB[3 * y + 2] += bitangent[1];
    tempB[3 * z + 2] += bitangent[2];
  }

  for(k = 0; k < this._vertices.length / 3; ++k) {

    x = 3 * k + 0;
    y = 3 * k + 1;
    z = 3 * k + 2;

    vec3.set(tangent, tempT[x], tempT[y], tempT[z]);
    vec3.set(bitangent, tempB[x], tempB[y], tempB[z]);
    vec3.set(normal, this.normals[x], this.normals[y], this.normals[z]);
  }
};

EZ3.Geometry.prototype.calculateBoundingBox = function() {

};

EZ3.Mesh = function(geometry, material) {
  EZ3.Entity.call(this);

  this.dynamic = false;
  this._buffer = new EZ3.Buffer();
  this.material = (material instanceof EZ3.Material) ? material : null;
  this.geometry = (geometry instanceof EZ3.Geometry) ? geometry : null;
};

EZ3.Mesh.prototype = Object.create(EZ3.Entity.prototype);
EZ3.Mesh.prototype.constructor = EZ3.Mesh;

EZ3.Mesh.prototype.init = function(gl) {
  if(this.geometry){
    var hint = (this.dynamic) ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW;

    if (this.geometry.verticesNeedUpdate) {
      this._buffer.init(gl, EZ3.Buffer.VERTEX, this.geometry.vertices.length, this.geometry.vertices, hint);
      this.geometry.verticesNeedUpdate = false;
    }

    if (this.geometry.normalsNeedUpdate) {
      this._buffer.init(gl, EZ3.Buffer.NORMAL, this.geometry.normals.length, this.geometry.normals, hint);
      this.geometry.normalsNeedUpdate = false;
    }

    if (this.geometry.uvsNeedUpdate) {
      this._buffer.init(gl, EZ3.Buffer.UV, this.geometry.uvs.length, this.geometry.uvs, hint);
      this.geometry.uvNeedUpdate = false;
    }

    if (this.geometry.tangentsNeedUpdate) {
      this._buffer.init(gl, EZ3.Buffer.TANGENTS, this.geometry.tangents.length, this.geometry.tangents, hint);
      this.geometry.tangentNeedUpdate = false;
    }

    if (this.geometry.bitangentsNeedUpdate) {
      this._buffer.init(gl, EZ3.Buffer.BITANGENTS, this.geometry.bitangents.length, this.geometry.bitangents, hint);
      this.geometry.bitangentsNeedUpdate = false;
    }

    if (this.geometry.indicesNeedUpdate) {
      this._buffer.init(gl, EZ3.Buffer.INDEX, this.geometry.indices.length, this.geometry.indices, hint);
      this.geometry.indicesNeedUpdate = false;
    }
  }
};

EZ3.Mesh.prototype.render = function(gl) {
  if(this.geometry){
    if (this.geometry.indices.length)
      this._buffer.draw(gl, EZ3.ELEMENTS_DRAW, this.geometry.indices.length);
    else
      this._buffer.draw(gl, EZ3.ARRAYS_DRAW, this.geometry.vertices.length);
  }
};

EZ3.AstroidalEllipsoid = function(xRadius, yRadius, zRadius, stacks, slices) {
  EZ3.Geometry.call(this);

  this._slices = slices;
  this._stacks = stacks;
  this._xRadius = xRadius;
  this._yRadius = yRadius;
  this._zRadius = zRadius;

  var that = this;

  function _create() {
    var u, v;
    var phi, rho;
    var normal, vertex;
    var cosS, cosT, sinS, sinT;
    var totalSlices, totalStacks;
    var s, t;

    vertex = vec3.create();
    normal = vec3.create();

    totalSlices = 1.0 / (that._slices - 1);
    totalStacks = 1.0 / (that._stacks - 1);

    for(s = 0; s < that._slices; ++s) {
      for(t = 0; t < that._stacks; ++t) {
        u = s * totalSlices;
        v = t * totalStacks;

        phi = EZ3.DOUBLE_PI * u - EZ3.PI;
        rho = EZ3.PI * v - EZ3.HALF_PI;

        cosS = Math.pow(Math.cos(phi), 3.0);
        cosT = Math.pow(Math.cos(rho), 3.0);
        sinS = Math.pow(Math.sin(phi), 3.0);
        sinT = Math.pow(Math.sin(rho), 3.0);

        vertex[0] = (that._xRadius * cosT * cosS);
        vertex[1] = (that._yRadius * sinT);
        vertex[2] = (that._zRadius * cosT * sinS);

        normal[0] = vertex[0] / that._xRadius;
        normal[1] = vertex[1] / that._yRadius;
        normal[2] = vertex[2] / that._zRadius;

        vec3.normalize(normal, normal);

        that.uvs.push(u);
        that.uvs.push(v);

        that.normals.push(normal[0]);
        that.normals.push(normal[1]);
        that.normals.push(normal[2]);

        that.vertices.push(vertex[0]);
        that.vertices.push(vertex[1]);
        that.vertices.push(vertex[2]);
      }
    }

    for(s = 0; s < that._slices - 1; ++s) {
      for(t = 0; t < that._stacks - 1; ++t) {
        that.indices.push((s + 0) * that._stacks + (t + 0));
        that.indices.push((s + 0) * that._stacks + (t + 1));
        that.indices.push((s + 1) * that._stacks + (t + 1));

        that.indices.push((s + 0) * that._stacks + (t + 0));
        that.indices.push((s + 1) * that._stacks + (t + 1));
        that.indices.push((s + 1) * that._stacks + (t + 0));
      }
    }

  }

  _create();
};

EZ3.AstroidalEllipsoid.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.AstroidalEllipsoid.prototype.constructor = EZ3.AstroidalEllipsoid;

EZ3.Box = function(width, height, depth) {
  EZ3.Geometry.call(this);

  this._width = width;
  this._depth = depth;
  this._height = height;

  this._halfWidth  = this._width * 0.5;
  this._halfDepth  = this._depth * 0.5;
  this._halfHeight = this._height * 0.5;

  var that = this;

  function _create () {
    that.vertices = [
      +that._halfWidth, +that._halfHeight, +that._halfDepth,
      -that._halfWidth, +that._halfHeight, +that._halfDepth,
      -that._halfWidth, -that._halfHeight, +that._halfDepth,
      +that._halfWidth, -that._halfHeight, +that._halfDepth,
      +that._halfWidth, -that._halfHeight, -that._halfDepth,
      -that._halfWidth, -that._halfHeight, -that._halfDepth,
      -that._halfWidth, +that._halfHeight, -that._halfDepth,
      +that._halfWidth, +that._halfHeight, -that._halfDepth
    ];

    that.indices = [
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

    that.calculateNormals();
  }

  _create();
};

EZ3.Box.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Box.prototype.constructor = EZ3.Box;

EZ3.Cone = function(base, height, slices, stacks) {
  EZ3.Geometry.call(this);

  this._base = base;
  this._height = height;
  this._slices = slices;
  this._stacks = stacks;

  var that = this;

  function _create() {
    var u, v;
    var vertex, normal;
    var totalSlices, totalStacks;
    var radius, actualHeight, step;
    var s, t;

    totalSlices = 1.0 / (that._slices - 1);
    totalStacks = 1.0 / (that._stacks - 1);

    actualHeight = that._height;
    step = (that._height - that._base) / that._slices;

    vertex = vec3.create();
    normal = vec3.create();

    for(s = 0; s < that._slices; ++s) {
      for(t = 0; t < that._stacks; ++t) {

        u = s * totalSlices;
        v = t * totalStacks;

        radius = Math.abs(that._height - actualHeight) * 0.5;

        vertex[0] = radius * Math.cos(EZ3.DOUBLE_PI * v);
        vertex[1] = actualHeight;
        vertex[2] = radius * Math.sin(EZ3.DOUBLE_PI * v);

        normal[0] = vertex[0];
        normal[1] = vertex[1];
        normal[2] = vertex[2];

        vec3.normalize(normal, normal);

        that.vertices.push(vertex[0]);
        that.vertices.push(vertex[1]);
        that.vertices.push(vertex[2]);

        that.uvs.push(u);
        that.uvs.push(v);

      }

      actualHeight -= step;

      if(actualHeight < that._base)
        break;

    }

    for(s = 0; s < that._slices - 1; ++s) {
      for(t = 0; t < that._stacks - 1; ++t) {

        that.indices.push((s + 0) * that._stacks + (t + 0));
        that.indices.push((s + 0) * that._stacks + (t + 1));
        that.indices.push((s + 1) * that._stacks + (t + 1));

        that.indices.push((s + 0) * that._stacks + (t + 0));
        that.indices.push((s + 1) * that._stacks + (t + 1));
        that.indices.push((s + 1) * that._stacks + (t + 0));

      }
    }

    that.calculateNormals();

  }

  _create();
};

EZ3.Cone.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Cone.prototype.constructor = EZ3.Cone;

EZ3.Cylinder = function(radius, base, height, slices, stacks) {
  EZ3.Geometry.call(this);

  this._base = base;
  this._radius = radius;
  this._height = height;
  this._slices = slices;
  this._stacks = stacks;

  var that = this;

  function _create () {
    var u, v;
    var vertex, normal;
    var actualHeight, step;
    var totalSlices, totalStacks;
    var s, t;

    totalSlices = 1.0 / (that._slices - 1);
    totalStacks = 1.0 / (that._stacks - 1);

    actualHeight = that._height;
    step = (that._height - that._base) / that._slices;

    vertex = vec3.create();
    normal = vec3.create();

    for(s = 0; s < that._slices; ++s) {
      for(t = 0; t < that._stacks; ++t) {

        u = s * totalSlices;
        v = t * totalStacks;

        vertex[0] = that._radius * Math.cos(EZ3.DOUBLE_PI * v);
        vertex[1] = actualHeight;
        vertex[2] = that._radius * Math.sin(EZ3.DOUBLE_PI * v);

        vec3.set(normal, vertex[0], vertex[1], vertex[2]);
        vec3.normalize(normal, normal);

        that.vertices.push(vertex[0]);
        that.vertices.push(vertex[1]);
        that.vertices.push(vertex[2]);

        that.uvs.push(u);
        that.uvs.push(v);

      }

      actualHeight -= step;

      if(actualHeight < that._base)
        break;

    }

    for(s = 0; s < that._slices - 1; ++s) {
      for(t = 0; t < that._stacks - 1; ++t) {
        that.indices.push((s + 0) * that._stacks + (t + 0));
        that.indices.push((s + 0) * that._stacks + (t + 1));
        that.indices.push((s + 1) * that._stacks + (t + 1));

        that.indices.push((s + 0) * that._stacks + (t + 0));
        that.indices.push((s + 1) * that._stacks + (t + 1));
        that.indices.push((s + 1) * that._stacks + (t + 0));
      }
    }

    that.calculateNormals();

  }

  _create();
};

EZ3.Cylinder.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Cylinder.prototype.constructor = EZ3.Cylinder;

EZ3.Ellipsoid = function(xRadius, yRadius, zRadius, slices, stacks) {
  EZ3.Geometry.call(this);

  this._slices = slices;
  this._stacks = stacks;
  this._xRadius = xRadius;
  this._yRadius = yRadius;
  this._zRadius = zRadius;

  var that = this;

  function _create() {
    var u, v;
    var phi, rho;
    var normal, vertex;
    var totalSlices, totalStacks;
    var s, t;

    vertex = vec3.create();
    normal = vec3.create();

    totalSlices = 1.0 / (that._slices - 1);
    totalStacks = 1.0 / (that._stacks - 1);

    for(s = 0; s < that._slices; ++s) {
      for(t = 0; t < that._stacks; ++t) {
        u = s * totalSlices;
        v = t * totalStacks;

        phi = EZ3.DOUBLE_PI * u;
        rho = EZ3.PI * v;

        vertex[0] = (that._xRadius * Math.cos(phi) * Math.sin(rho));
        vertex[1] = (that._yRadius * Math.sin(rho - EZ3.HALF_PI));
        vertex[2] = (that._zRadius * Math.sin(phi) * Math.sin(rho));

        normal[0] = vertex[0] / that._xRadius;
        normal[1] = vertex[1] / that._yRadius;
        normal[2] = vertex[2] / that._zRadius;

        vec3.normalize(normal, normal);

        that.uvs.push(u);
        that.uvs.push(v);

        that.normals.push(normal[0]);
        that.normals.push(normal[1]);
        that.normals.push(normal[2]);

        that.vertices.push(vertex[0]);
        that.vertices.push(vertex[1]);
        that.vertices.push(vertex[2]);
      }
    }

    for(s = 0; s < that._slices - 1; ++s) {
      for(t = 0; t < that._stacks - 1; ++t) {
        that.indices.push((s + 0) * that._stacks + (t + 0));
        that.indices.push((s + 0) * that._stacks + (t + 1));
        that.indices.push((s + 1) * that._stacks + (t + 1));

        that.indices.push((s + 0) * that._stacks + (t + 0));
        that.indices.push((s + 1) * that._stacks + (t + 1));
        that.indices.push((s + 1) * that._stacks + (t + 0));
      }
    }

  }

  _create();
};

EZ3.Ellipsoid.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Ellipsoid.prototype.constructor = EZ3.Ellipsoid;

EZ3.Grid = function(width, height) {
  EZ3.Geometry.call(this);

  this._width = width;
  this._height = height;

  var that = this;

  function _create() {
    var index0, index1, index2, index3, z, x;

    for(z = 0; z < that._height + 1; ++z) {
      for(x = 0; x < that._width + 1; ++x) {
        that.vertices.push(x);
        that.vertices.push(0);
        that.vertices.push(z);

        that.uvs.push(x / that._width);
        that.uvs.push(z / that._height);
      }
    }

    for(z = 0; z < that._height; ++z) {
      for(x = 0; x < that._width; ++x) {
        index0 = z * (that._height + 1) + x;
        index1 = index0 + 1;
        index2 = index0 + (that._height + 1);
        index3 = index2 + 1;

        that.indices.push(index0);
        that.indices.push(index2);
        that.indices.push(index1);

        that.indices.push(index1);
        that.indices.push(index2);
        that.indices.push(index3);
      }
    }

    that.calculateNormals();

  }

  _create();
};

EZ3.Grid.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Grid.prototype.constructor = EZ3.Grid;

EZ3.Sphere = function(radius, slices, stacks) {
  EZ3.Geometry.call(this);

  this._radius = radius;
  this._slices = slices;
  this._stacks = stacks;

  var that = this;

  function _create() {
    var u, v;
    var phi, rho;
    var normal, vertex;
    var totalSlices, totalStacks;
    var s, t;

    vertex = vec3.create();
    normal = vec3.create();

    totalSlices = 1.0 / (that._slices - 1);
    totalStacks = 1.0 / (that._stacks - 1);

    for(s = 0; s < that._slices; ++s) {
      for(t = 0; t < that._stacks; ++t) {
        u = s * totalSlices;
        v = t * totalStacks;

        phi = EZ3.DOUBLE_PI * u;
        rho = EZ3.PI * v;

        vertex[0] = (that._radius * Math.cos(phi) * Math.sin(rho));
        vertex[1] = (that._radius * Math.sin(rho - EZ3.HALF_PI));
        vertex[2] = (that._radius * Math.sin(phi) * Math.sin(rho));

        normal[0] = vertex[0] / that._radius;
        normal[1] = vertex[1] / that._radius;
        normal[2] = vertex[2] / that._radius;

        vec3.normalize(normal, normal);

        that.uvs.push(u);
        that.uvs.push(v);

        that.normals.push(normal[0]);
        that.normals.push(normal[1]);
        that.normals.push(normal[2]);

        that.vertices.push(vertex[0]);
        that.vertices.push(vertex[1]);
        that.vertices.push(vertex[2]);
      }
    }

    for(s = 0; s < that._slices - 1; ++s) {
      for(t = 0; t < that._stacks - 1; ++t) {
        that.indices.push((s + 0) * that._stacks + (t + 0));
        that.indices.push((s + 0) * that._stacks + (t + 1));
        that.indices.push((s + 1) * that._stacks + (t + 1));

        that.indices.push((s + 0) * that._stacks + (t + 0));
        that.indices.push((s + 1) * that._stacks + (t + 1));
        that.indices.push((s + 1) * that._stacks + (t + 0));
      }
    }

  }

  _create();
};

EZ3.Sphere.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Sphere.prototype.constructor = EZ3.Sphere;

EZ3.Torus = function(innerRadius, outerRadius, sides, rings) {
  EZ3.Geometry.call(this);

  this._sides = sides;
  this._rings = rings;
  this._innerRadius = innerRadius;
  this._outerRadius = outerRadius;

  var that = this;

  function _create() {
    var u, v;
    var rho, phi;
    var vertex, normal;
    var cosS, cosR, sinS, sinR;
    var totalSides, totalRings;
    var s, r;

    totalSides = 1.0 / (that._sides - 1);
    totalRings = 1.0 / (that._rings - 1);

    vertex = vec3.create();
    normal = vec3.create();

    for(s = 0; s < that._sides; ++s){
      for(r = 0; r < that._rings; ++r){
        u = s * totalSides;
        v = r * totalRings;

        rho = EZ3.DOUBLE_PI * u;
        phi = EZ3.DOUBLE_PI * v;

        cosS = Math.cos(rho);
        cosR = Math.cos(phi);
        sinS = Math.sin(rho);
        sinR = Math.sin(phi);

        vertex[0] = (that._innerRadius + that._outerRadius * cosR) * cosS;
        vertex[1] = (that._outerRadius * sinR);
        vertex[2] = (that._innerRadius + that._outerRadius * cosR) * sinS;

        normal[0] = vertex[0] - that._innerRadius * cosS;
        normal[1] = vertex[1];
        normal[2] = vertex[2] - that._innerRadius * sinS;

        vec3.normalize(normal, normal);

        that.uvs.push(u);
        that.uvs.push(v);

        that.normals.push(normal[0]);
        that.normals.push(normal[1]);
        that.normals.push(normal[2]);

        that.vertices.push(vertex[0]);
        that.vertices.push(vertex[1]);
        that.vertices.push(vertex[2]);
      }
    }

    for(s = 0; s < that._sides - 1; ++s){
      for(r = 0; r < that._rings - 1; ++r){
        that.indices.push((s + 0) * that._rings + (r + 0));
        that.indices.push((s + 0) * that._rings + (r + 1));
        that.indices.push((s + 1) * that._rings + (r + 1));

        that.indices.push((s + 0) * that._rings + (r + 0));
        that.indices.push((s + 1) * that._rings + (r + 1));
        that.indices.push((s + 1) * that._rings + (r + 0));
      }
    }

  }

  _create();
};

EZ3.Torus.prototype = Object.create(EZ3.Geometry.prototype);
EZ3.Torus.prototype.constructor = EZ3.Torus;

EZ3.Buffer = function() {
  this._buffer = [];
  this._buffer[EZ3.Buffer.UV] = -1;
  this._buffer[EZ3.Buffer.INDEX] = -1;
  this._buffer[EZ3.Buffer.VERTEX] = -1;
  this._buffer[EZ3.Buffer.NORMAL] = -1;
  this._buffer[EZ3.Buffer.TANGENT] = -1;
  this._buffer[EZ3.Buffer.BITANGENT] = -1;
};

EZ3.Buffer.prototype.draw = function(gl, draw, size) {

  if(~this._buffer[EZ3.Buffer.BITANGENT]) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer[EZ3.Buffer.BITANGENT]);
    gl.enableVertexAttribArray(EZ3.Buffer.BITANGENT_LAYOUT);
    gl.vertexAttribPointer(EZ3.Buffer.BITANGENT_LAYOUT, EZ3.Buffer.BITANGENT_SIZE, gl.FLOAT, false, 0, 0);
  }

  if(~this._buffer[EZ3.Buffer.TANGENT]) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer[EZ3.Buffer.TANGENT]);
    gl.enableVertexAttribArray(EZ3.Buffer.TANGENT_LAYOUT);
    gl.vertexAttribPointer(EZ3.Buffer.TANGENT_LAYOUT, EZ3.Buffer.TANGENT_SIZE, gl.FLOAT, false, 0, 0);
  }

  if(~this._buffer[EZ3.Buffer.UV]) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer[EZ3.Buffer.UV]);
    gl.enableVertexAttribArray(EZ3.Buffer.UV_LAYOUT);
    gl.vertexAttribPointer(EZ3.Buffer.UV_LAYOUT, EZ3.Buffer.UV_SIZE, gl.FLOAT, false, 0, 0);
  }

  if(~this._buffer[EZ3.Buffer.NORMAL]) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer[EZ3.Buffer.NORMAL]);
    gl.enableVertexAttribArray(EZ3.Buffer.NORMAL_LAYOUT);
    gl.vertexAttribPointer(EZ3.Buffer.NORMAL_LAYOUT, EZ3.Buffer.NORMAL_SIZE, gl.FLOAT, false, 0, 0);
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer[EZ3.Buffer.VERTEX]);
  gl.enableVertexAttribArray(EZ3.Buffer.VERTEX_LAYOUT);
  gl.vertexAttribPointer(EZ3.Buffer.VERTEX_LAYOUT, EZ3.Buffer.VERTEX_SIZE, gl.FLOAT, false, 0, 0);

  if(draw === EZ3.ELEMENTS_DRAW) {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._buffer[EZ3.Buffer.INDEX]);
    gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, 0);
  }else{
    gl.drawArrays(gl.TRIANGLES, 0, size / 3);
  }

};

EZ3.Buffer.prototype.init = function(gl, id, size, data, hint) {

  if(id === EZ3.Buffer.VERTEX){

    this._buffer[EZ3.Buffer.VERTEX] = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer[EZ3.Buffer.VERTEX]);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), hint);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

  }else if(id === EZ3.Buffer.NORMAL){

    this._buffer[EZ3.Buffer.NORMAL] = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer[EZ3.Buffer.NORMAL]);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), hint);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

  }else if(id === EZ3.Buffer.UV){

    this._buffer[EZ3.Buffer.UV] = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer[EZ3.Buffer.UV]);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), hint);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

  }else if(id === EZ3.Buffer.TANGENT){

    this._buffer[EZ3.Buffer.TANGENT] = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer[EZ3.Buffer.TANGENT]);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), hint);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

  }else if(id === EZ3.Buffer.BITANGENT){

    this._buffer[EZ3.Buffer.BITANGENT] = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer[EZ3.Buffer.BITANGENT]);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), hint);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

  }else if(id == EZ3.Buffer.INDEX){

    this._buffer[EZ3.Buffer.INDEX] = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._buffer[EZ3.Buffer.INDEX]);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), hint);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

  }

};

EZ3.Buffer.prototype.constructor = EZ3.Buffer;

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

EZ3.GLSLProgram = function(gl, material, code) {
  this._code = code;
  this._shaders = [];
  this._usedTimes = 1;
  this._program = null;
  this._uniformList = {};
  this._attributeList = {};

  this._create(gl, material);
};

EZ3.GLSLProgram.prototype.enable = function(gl) {
  gl.useProgram(this._program);
};

EZ3.GLSLProgram.prototype.disable = function(gl) {
  gl.useProgram(null);
};

EZ3.GLSLProgram.prototype.loadUniformf = function(gl, name, size, data) {
  switch(size) {
    case EZ3.GLSLProgram.UNIFORM_SIZE_1D:
      gl.uniform1f(this._getUniform(name), data);
    break;
    case EZ3.GLSLProgram.UNIFORM_SIZE_2D:
      gl.uniform2f(this._getUniform(name), data[0], data[1]);
    break;
    case EZ3.GLSLProgram.UNIFORM_SIZE_3D:
      gl.uniform3f(this._getUniform(name), data[0], data[1], data[2]);
    break;
    case EZ3.GLSLProgram.UNIFORM_SIZE_4D:
      gl.uniform4f(this._getUniform(name), data[0], data[1], data[2], data[3]);
    break;
  }
};

EZ3.GLSLProgram.prototype.loadUniformi = function(gl, name, size, data) {
  switch(size) {
    case EZ3.GLSLProgram.UNIFORM_SIZE_1D:
      gl.uniform1i(this._getUniform(name), data);
    break;
    case EZ3.GLSLProgram.UNIFORM_SIZE_2D:
      gl.uniform2i(this._getUniform(name), data[0], data[1]);
    break;
    case EZ3.GLSLProgram.UNIFORM_SIZE_3D:
      gl.uniform3i(this._getUniform(name), data[0], data[1], data[2]);
    break;
    case EZ3.GLSLProgram.UNIFORM_SIZE_4D:
      gl.uniform4i(this._getUniform(name), data[0], data[1], data[2], data[3]);
    break;
  }
};

EZ3.GLSLProgram.prototype.loadUniformMatrix = function(gl, name, size, data) {
  switch(size) {
    case EZ3.GLSLProgram.UNIFORM_SIZE_2X2:
      gl.uniformMatrix2fv(this._getUniform(name), false, data);
    break;
    case EZ3.GLSLProgram.UNIFORM_SIZE_3X3:
      gl.uniformMatrix3fv(this._getUniform(name), false, data);
    break;
    case EZ3.GLSLProgram.UNIFORM_SIZE_4X4:
      gl.uniformMatrix4fv(this._getUniform(name), false, data);
    break;
  }
};

EZ3.GLSLProgram.prototype._initVertex = function(gl, vertexCode) {
  var prefixVertex = [
    'precision highp float;',
    'attribute vec3 vertex;',
    'uniform mat4 modelViewProjectionMatrix;',
  ].join('\n');

  this._compile(gl, gl.VERTEX_SHADER, prefixVertex + vertexCode);
};

EZ3.GLSLProgram.prototype._initFragment = function(gl, fragmentCode) {
  var prefixFragment = [
    'precision highp float;'
  ].join('\n');

  this._compile(gl, gl.FRAGMENT_SHADER, prefixFragment + fragmentCode);
};

EZ3.GLSLProgram.prototype._compile = function(gl, type, code) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, code);
  gl.compileShader(shader);

  if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    var infoLog = gl.getShaderInfoLog(shader);
    console.log('EZ3.GLSLProgram shader info log: ', infoLog, this._addLineNumbers(code) + '\n');
  } else {
    if(type === gl.VERTEX_SHADER)
      this._shaders[EZ3.GLSLProgram.VERTEX_POSITION] = shader;
    else if(type === gl.FRAGMENT_SHADER)
      this._shaders[EZ3.GLSLProgram.FRAGMENT_POSITION] = shader;
  }
};

EZ3.GLSLProgram.prototype._create = function(gl, material) {
  this._program = gl.createProgram();

  this._initVertex(gl, material.vertex);
  this._initFragment(gl, material.fragment);

  gl.attachShader(this._program, this._shaders[EZ3.GLSLProgram.VERTEX_POSITION]);
  gl.attachShader(this._program, this._shaders[EZ3.GLSLProgram.FRAGMENT_POSITION]);
  gl.linkProgram(this._program);

  if(!gl.getProgramParameter(this._program, gl.LINK_STATUS)) {
    var infolog = gl.getProgramInfoLog(this._program, gl.LINK_STATUS);
    console.log('EZ3.GLSLProgram linking program error info log: ' + infoLog + '\n');
  }else{
    this._loadUniforms(gl);
    this._loadAttributes(gl);
    gl.deleteShader(this._shaders[EZ3.GLSLProgram.VERTEX_POSITION]);
    gl.deleteShader(this._shaders[EZ3.GLSLProgram.FRAGMENT_POSITION]);
  }
};

EZ3.GLSLProgram.prototype._loadUniforms = function(gl) {
  var totalUniforms = gl.getProgramParameter(this._program, gl.ACTIVE_UNIFORMS);

  for(var k = 0; k < totalUniforms; ++k) {
    var uniformInfo = gl.getActiveUniform(this._program, k);
    this._addUniform(gl, uniformInfo.name);
  }
};

EZ3.GLSLProgram.prototype._loadAttributes = function(gl) {
  var totalAttributes = gl.getProgramParameter(this._program, gl.ACTIVE_ATTRIBUTES);

  for(var k = 0; k < totalAttributes; ++k){
    var attributeInfo = gl.getActiveAttrib(this._program, k);
    this._addAttribute(gl, attributeInfo.name);
  }
};

EZ3.GLSLProgram.prototype._addUniform = function(gl, name) {
  this._uniformList[name] = gl.getUniformLocation(this._program, name);
};

EZ3.GLSLProgram.prototype._getUniform = function(name) {
  return this._uniformList[name];
};

EZ3.GLSLProgram.prototype._addAttribute = function(gl, name) {
  this._attributeList[name] = gl.getAttribLocation(this._program, name);
};

EZ3.GLSLProgram.prototype._getAttribute = function(name) {
  return this._attributeList[name];
};

EZ3.GLSLProgram.prototype._addLineNumbers = function(code) {
  var codeLines = code.split('\n');

  for(var k = 0; k < codeLines.length; ++k)
    codeLines[k] = (k + 1) + ": " + codeLines[k];

  return codeLines;
};

EZ3.GLSLProgram.UNIFORM_SIZE_1D = 1;
EZ3.GLSLProgram.UNIFORM_SIZE_2D = 2;
EZ3.GLSLProgram.UNIFORM_SIZE_3D = 3;
EZ3.GLSLProgram.UNIFORM_SIZE_4D = 4;
EZ3.GLSLProgram.UNIFORM_SIZE_2X2 = 2;
EZ3.GLSLProgram.UNIFORM_SIZE_3X3 = 3;
EZ3.GLSLProgram.UNIFORM_SIZE_4X4 = 4;

EZ3.GLSLProgram.VERTEX_POSITION = 0;
EZ3.GLSLProgram.FRAGMENT_POSITION = 1;

/**
 * @class Renderer
 */

EZ3.Renderer = function(canvas, options) {
  this._lights = [];
  this._entities = [];
  this._programs = [];
  this.context = null;
  this.canvas = canvas;
  this.options = options;
};

EZ3.Renderer.prototype._processContextLost = function(event) {
  event.preventDefault();
};

EZ3.Renderer.prototype._processContextRecovered = function() {
  this.initContext();
};

EZ3.Renderer.prototype.initContext = function() {
  var names = [
    'webgl',
    'experimental-webgl',
    'webkit-3d',
    'moz-webgl'
  ];

  for (var i = 0; i < names.length; i++) {
    try {
      this.context = this.canvas.getContext(names[i], this.options);
    } catch (e) {}

    if (this.context)
      break;
  }

  if (!this.context)
    throw new Error('Unable to initialize WebGL with selected options. Your browser may not support it.');

  var that = this;

  this._onContextLost = function(event) {
    that._processContextLost(event);
  };

  this.canvas.addEventListener('webglcontextlost', this._onContextLost, false);

  if (this._onContextRestored) {
    this.canvas.removeEventListener('webglcontextrestored', this._onContextRestored, false);
    delete this._onContextRestored;
  }
};

EZ3.Renderer.prototype.updateMaterial = function(material) {
  if(material.dirty){

    var shaders = EZ3.ShaderLib[material.name];

    if(shaders) {
      material.vertex = shaders.vertex;
      material.fragment = shaders.fragment;

      var program = new EZ3.GLSLProgram(this.context, material, 1);
      material.program = program;
    }

    material.dirty = false;
  }
};

EZ3.Renderer.prototype.setupBasic = function(material) {
  var mvp = mat4.create();
  var view = mat4.create();
  var projection = mat4.create();

  var position = vec3.create();
  vec3.set(position, 50, 50, 50);

  var target = vec3.create();
  vec3.set(target, 0, 0, 0);

  var up = vec3.create();
  vec3.set(up, 0, 1, 0);

  mat4.lookAt(view, position, target, up);
  mat4.perspective(projection, 70, 800 / 600, 1, 1000);
  mat4.multiply(mvp, projection, view);

  material.program.loadUniformf(this.context, 'color', EZ3.GLSLProgram.UNIFORM_SIZE_3D, material.color);
  material.program.loadUniformMatrix(this.context, 'modelViewProjectionMatrix', EZ3.GLSLProgram.UNIFORM_SIZE_4X4, mvp);
};

EZ3.Renderer.prototype.render = function(screen) {
  this.context.clearColor(0.0,0.0,0.0,1.0);
  this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);

  screen.scene.update();
  this._entities.push(screen.scene);

  while(this._entities.length) {
    var entity = this._entities.pop();

    if(entity instanceof EZ3.Mesh) {
        entity.init(this.context);
        this.updateMaterial(entity.material);

        entity.material.program.enable(this.context);

          if(entity.material instanceof EZ3.BasicMaterial)
            this.setupBasic(entity.material);

          entity.render(this.context);

        entity.material.program.disable(this.context);
    }

    for(var k = entity.children.length - 1; k >= 0; --k)
      this._entities.push(entity.children[k]);
  }
};

EZ3.ShaderLib = {
  'basic' : {
      vertex: [
        'void main() {',
        ' gl_Position = modelViewProjectionMatrix * vec4(vertex, 1.0);',
        '}'
      ].join('\n'),
      fragment: [
        'uniform vec3 color;',
        'void main() {',
        ' gl_FragColor = vec4(color, 1.0);',
        '}'
      ].join('\n')
  }
};

/**
 * @class AnimationFrame
 */

EZ3.AnimationFrame = function(device, timeOut) {
  this._id = 0;

  if (device.animationFrame === device.ANIMATION_FRAME.TIME_OUT || timeOut) {
    this._onRequestAnimationFrame = function(callback) {
      return window.setTimeout(callback, 1000 / 60);
    };

    this._onCancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  } else {
    this._onRequestAnimationFrame = function(callback) {
      return window.requestAnimationFrame(callback);
    };

    this._onCancelAnimationFrame = function(id) {
      window.cancelAnimationFrame(id);
    };
  }
};

EZ3.AnimationFrame.prototype.request = function(callback) {
  this._id = this._onRequestAnimationFrame(callback);
};

EZ3.AnimationFrame.prototype.cancel = function() {
  this._onCancelAnimationFrame(this._id);
};

/**
 * @class Device
 */

EZ3.Device = function() {
  this.ready = false;
  this.operatingSystem = 0;
  this.touch = 0;
  this.animationFrame = 0;
};

EZ3.Device = new EZ3.Device();

EZ3.Device._check = function() {
  var that = this;

  function checkOperatingSystem() {
    if (/Playstation Vita/.test(navigator.userAgent))
      that.operatingSystem = EZ3.Device.OPERATING_SYSTEM.PSVITA;
    else if (/Kindle/.test(navigator.userAgent) || /\bKF[A-Z][A-Z]+/.test(navigator.userAgent) || /Silk.*Mobile Safari/.test(navigator.userAgent))
      that.operatingSystem = EZ3.Device.OPERATING_SYSTEM.KINDLE;
    else if (/Android/.test(navigator.userAgent))
      that.operatingSystem = EZ3.Device.OPERATING_SYSTEM.ANDROID;
    else if (/CrOS/.test(navigator.userAgent))
      that.operatingSystem = EZ3.Device.OPERATING_SYSTEM.CRHOMEOS;
    else if (/iP[ao]d|iPhone/i.test(navigator.userAgent))
      that.operatingSystem = EZ3.Device.OPERATING_SYSTEM.IOS;
    else if (/Linux/.test(navigator.userAgent))
      that.operatingSystem = EZ3.Device.OPERATING_SYSTEM.LINUX;
    else if (/Mac OS/.test(navigator.userAgent))
      that.operatingSystem = EZ3.Device.OPERATING_SYSTEM.MACOS;
    else if (/Windows/.test(navigator.userAgent))
      that.operatingSystem = EZ3.Device.OPERATING_SYSTEM.WINDOWS;

    if (/Windows Phone/i.test(navigator.userAgent) || /IEMobile/i.test(navigator.userAgent))
      that.operatingSystem = EZ3.Device.OPERATING_SYSTEM.WINDOWS_PHONE;
  }

  function checkAnimationFrame() {
    var vendors = [
      'ms',
      'moz',
      'webkit',
      'o'
    ];

    this.animationFrame = EZ3.Device.ANIMATION_FRAME.TIME_OUT;

    for (var i = 0; i < vendors.length; i++) {
      if (window.requestAnimationFrame) {
        this.animationFrame = EZ3.Device.ANIMATION_FRAME.STANDARD;
        return;
      }

      window.requestAnimationFrame = window[vendors[i] + 'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendors[i] + 'CancelAnimationFrame'];
    }
  }

  function checkInput() {
    if ('ontouchstart' in document.documentElement || (window.navigator.maxTouchPoints && window.navigator.maxTouchPoints >= 1))
      that.touch = EZ3.Device.TOUCH.STANDARD;
    else {
      if (window.navigator.pointerEnabled)
        that.touch = EZ3.Device.TOUCH.POINTER;

      if (window.navigator.msPointerEnabled)
        that.touch = EZ3.Device.TOUCH.MSPOINTER;
    }
  }

  checkOperatingSystem();
  checkAnimationFrame();
  checkInput();
};

EZ3.Device._isReady = function() {
  if (!document.body)
    window.setTimeout(this._isReady, 20);
  else if (!this.ready) {
    document.removeEventListener('deviceready', this._onReady);
    document.removeEventListener('DOMContentLoaded', this._onReady);
    window.removeEventListener('load', this._onReady);

    this._check();

    this.ready = true;

    var item;
    while ((item = this._isReady.queue.shift()))
      item.callback.apply(item.context, item.params);

    delete this._isReady;
    delete this._onReady;
    delete this._check;
  }
};

EZ3.Device.onReady = function(callback, context, params) {
  if (this.ready)
    callback.apply(context, params);
  else if (this._isReady.queue)
    this._isReady.queue.push({
      callback: callback,
      context: context,
      params: params
    });
  else {
    var that = this;

    this._isReady.queue = [];
    this._isReady.queue.push({
      callback: callback,
      context: context,
      params: params
    });

    this._onReady = function() {
      that._isReady();
    };

    if (document.readyState === 'complete' || document.readyState === 'interactive')
      this._isReady();
    else if (typeof window.cordova !== 'undefined' && !navigator['isCocoonJS'])
      document.addEventListener('deviceready', this._onReady, false);
    else {
      document.addEventListener('DOMContentLoaded', this._onReady, false);
      window.addEventListener('load', this._onReady, false);
    }
  }
};

EZ3.Device.OPERATING_SYSTEM = {};
EZ3.Device.OPERATING_SYSTEM.WINDOWS = 1;
EZ3.Device.OPERATING_SYSTEM.MACOS = 2;
EZ3.Device.OPERATING_SYSTEM.LINUX = 4;
EZ3.Device.OPERATING_SYSTEM.IOS = 8;
EZ3.Device.OPERATING_SYSTEM.ANDROID = 16;
EZ3.Device.OPERATING_SYSTEM.WINDOWS_PHONE = 32;
EZ3.Device.OPERATING_SYSTEM.CRHOMEOS = 64;
EZ3.Device.OPERATING_SYSTEM.KINDLE = 128;
EZ3.Device.OPERATING_SYSTEM.PSVITA = 256;

EZ3.Device.TOUCH = {};
EZ3.Device.TOUCH.STANDARD = 1;
EZ3.Device.TOUCH.POINTER = 2;
EZ3.Device.TOUCH.MSPOINTER = 4;

EZ3.Device.ANIMATION_FRAME = {};
EZ3.Device.ANIMATION_FRAME.STANDARD = 1;
EZ3.Device.ANIMATION_FRAME.TIME_OUT = 2;

/**
 * @class Time
 */

EZ3.Time = function() {
  this.now = 0;
  this.previous = 0;
  this.elapsed = 0;
  this.started = 0;
};

EZ3.Time.prototype.start = function() {
  this.started = this.now = Date.now();
};

EZ3.Time.prototype.update = function() {
  this.previous = this.now;
  this.now = Date.now();
  this.elapsed = (this.now - this.previous) * 0.001;
};

/**
 * @class MousePointer
 *  */

EZ3.MousePointer = function() {
  EZ3.Pointer.call(this);

  this._buttons = [];

  this.wheel = EZ3.Vec2.create();

  EZ3.Vec2.set(this.wheel, 0, 0);
};

EZ3.MousePointer.prototype = Object.create(EZ3.Pointer.prototype);
EZ3.MousePointer.prototype.constructor = EZ3.MousePointer;

EZ3.MousePointer.prototype.processPress = function(event, onPress, onMove) {
  if (!this._buttons[event.button])
    this._buttons[event.button] = new EZ3.Switch(event.button);

  this._buttons[event.button].processPress();
  EZ3.Pointer.prototype.processPress.call(this, event);

  onPress.dispatch(this._buttons[event.button]);
  onMove.dispatch(this);
};

EZ3.MousePointer.prototype.processMove = function(event, onMove) {
  EZ3.Pointer.prototype.processMove.call(this, event);
  onMove.dispatch(this);
};

EZ3.MousePointer.prototype.processUp = function(event, onUp) {
  if (!this._buttons[event.button])
    this._buttons[event.button] = new EZ3.Switch(event.button);

  this._buttons[event.button].processUp();

  onUp.dispatch(this._buttons[event.button]);
};

EZ3.MousePointer.prototype.processWheel = function(event, onWheel) {
  if (event.wheelDeltaX)
    this.wheel[0] = event.wheelDeltaX;
  else
    this.wheel[1] = event.deltaX;

  if (event.wheelDeltaY)
    this.wheel[0] = event.wheelDeltaY;
  else
    this.wheel[1] = event.deltaY;

  onWheel.dispatch(this);
};

EZ3.MousePointer.prototype.getButton = function(code) {
  if (!this._buttons[code])
    this._buttons[code] = new EZ3.Switch(code);

  return this._buttons[code];
};

/**
 * @class TouchPointer
 *  *  */

EZ3.TouchPointer = function(code, id) {
  EZ3.Pointer.call(this);
  EZ3.Switch.call(this, code);

  this.id = id || 0;
};

EZ3.TouchPointer.prototype = Object.create(EZ3.Pointer.prototype);
mixin(EZ3.TouchPointer.prototype, EZ3.Switch.prototype);
EZ3.TouchPointer.prototype.constructor = EZ3.TouchPointer;

EZ3.TouchPointer.prototype.processPress = function(event, onPress, onMove) {
  EZ3.Pointer.prototype.processPress.call(this, event);
  EZ3.Switch.prototype.processPress.call(this);

  onPress.dispatch(this);
  onMove.dispatch(this);
};

EZ3.TouchPointer.prototype.processMove = function(event, onMove) {
  EZ3.Pointer.prototype.processMove.call(this, event);
  onMove.dispatch(this);
};

/**
 * @class BasicMaterial
 *  */

EZ3.BasicMaterial = function(parameters){
  EZ3.Material.call(this);
  this.name = 'basic';
  this.color = vec3.create();
  this.color = vec3.set(this.color, parameters.color[0], parameters.color[1], parameters.color[2]);
};

EZ3.BasicMaterial.prototype = Object.create(EZ3.Material.prototype);
EZ3.BasicMaterial.prototype.constructor = EZ3.BasicMaterial;
