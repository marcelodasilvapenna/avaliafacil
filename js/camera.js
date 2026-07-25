
async function abrirCamera(){
 const v=document.getElementById('video');
 try{
  const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}});
  v.srcObject=s;
 }catch(e){alert('Não foi possível acessar a câmera: '+e);}
}
