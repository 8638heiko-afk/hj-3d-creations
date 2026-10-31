// HJ 3D Creations – producten en instellingen aanpassen in dit bestand.
const STORE_EMAIL = "8638heiko@googlemail.com";
const products = [
  {id:1,name:"Decoratief designobject",category:"Dekoration",price:14.90,description:"Ein moderner Blickfang für Regal, Schreibtisch oder Zuhause.",symbol:"✳"},
  {id:2,name:"Praktischer Organizer",category:"Alltag",price:9.90,description:"Ordnung für kleine Dinge – praktisch und individuell.",symbol:"▦"},
  {id:3,name:"Kleine Fantasiefigur",category:"Figuren",price:12.50,description:"Eine besondere Figur als Deko oder Geschenkidee.",symbol:"♢"},
  {id:4,name:"Individueller Schlüsselanhänger",category:"Sonstiges",price:4.90,description:"Klein, persönlich und in verschiedenen Farben möglich.",symbol:"⌘"},
  {id:5,name:"Pflanzgefäß modern",category:"Dekoration",price:16.90,description:"Ein dekoratives Zuhause für kleine Pflanzen.",symbol:"◒"},
  {id:6,name:"Kabelhalter-Set",category:"Alltag",price:6.90,description:"Hilft dabei, Kabel am Arbeitsplatz ordentlich zu halten.",symbol:"⌁"}
];
let cart = JSON.parse(localStorage.getItem("hj3d-cart") || "[]");
const euro = n => n.toLocaleString("de-DE",{style:"currency",currency:"EUR"});
const grid = document.getElementById("product-grid");
function renderProducts(category="Alle"){
  grid.innerHTML="";
  products.filter(p=>category==="Alle"||p.category===category).forEach(p=>{
    const card=document.createElement("article");card.className="product-card";
    card.innerHTML=`<div class="product-image"><span class="product-category">${p.category}</span><div class="product-placeholder">${p.symbol}</div></div><div class="product-info"><h3>${p.name}</h3><p>${p.description}</p><div class="product-bottom"><span class="product-price">${euro(p.price)}</span><button class="add-button" data-add="${p.id}">+ In den Warenkorb</button></div></div>`;
    grid.appendChild(card);
  });
}
function saveCart(){localStorage.setItem("hj3d-cart",JSON.stringify(cart));renderCart();}
function renderCart(){
  const count=cart.reduce((s,i)=>s+i.qty,0);document.getElementById("cart-count").textContent=count;
  const host=document.getElementById("cart-items");host.innerHTML="";
  if(!cart.length){host.innerHTML='<div class="empty-cart">Dein Warenkorb ist noch leer.<br>Entdecke deine Lieblingsmodelle.</div>';}
  cart.forEach(item=>{
    const p=products.find(x=>x.id===item.id);if(!p)return;
    const row=document.createElement("div");row.className="cart-row";
    row.innerHTML=`<div class="cart-thumb">${p.symbol}</div><div><h4>${p.name}</h4><small>${euro(p.price)} pro Stück</small><div class="quantity"><button data-dec="${p.id}" aria-label="Menge verringern">−</button><span>${item.qty}</span><button data-inc="${p.id}" aria-label="Menge erhöhen">+</button></div></div><span class="cart-row-price">${euro(p.price*item.qty)}</span>`;
    host.appendChild(row);
  });
  document.getElementById("cart-total").textContent=euro(cart.reduce((s,i)=>{const p=products.find(x=>x.id===i.id);return s+(p?p.price*i.qty:0)},0));
  document.getElementById("checkout-button").disabled=!cart.length;
}
function openCart(){document.getElementById("cart-drawer").classList.add("open");document.getElementById("drawer-backdrop").classList.add("open");document.getElementById("cart-drawer").setAttribute("aria-hidden","false");}
function closeCart(){document.getElementById("cart-drawer").classList.remove("open");document.getElementById("drawer-backdrop").classList.remove("open");document.getElementById("cart-drawer").setAttribute("aria-hidden","true");}
document.getElementById("filters").addEventListener("click",e=>{const b=e.target.closest("[data-filter]");if(!b)return;document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderProducts(b.dataset.filter);});
grid.addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(!b)return;const id=Number(b.dataset.add),found=cart.find(x=>x.id===id);if(found)found.qty++;else cart.push({id,qty:1});saveCart();b.textContent="Hinzugefügt ✓";setTimeout(()=>b.textContent="+ In den Warenkorb",1000);});
document.getElementById("cart-items").addEventListener("click",e=>{const inc=e.target.closest("[data-inc]"),dec=e.target.closest("[data-dec]");if(inc){const x=cart.find(i=>i.id===Number(inc.dataset.inc));x.qty++;}if(dec){const id=Number(dec.dataset.dec),x=cart.find(i=>i.id===id);x.qty--;if(x.qty<=0)cart=cart.filter(i=>i.id!==id);}saveCart();});
document.getElementById("open-cart").addEventListener("click",openCart);
document.getElementById("close-cart").addEventListener("click",closeCart);
document.getElementById("continue-shopping").addEventListener("click",closeCart);
document.getElementById("drawer-backdrop").addEventListener("click",closeCart);
const dialog=document.getElementById("checkout-dialog");
document.getElementById("checkout-button").addEventListener("click",()=>{closeCart();dialog.showModal();});
document.getElementById("close-checkout").addEventListener("click",()=>dialog.close());
document.getElementById("checkout-form").addEventListener("submit",e=>{
  e.preventDefault();const fd=new FormData(e.currentTarget);
  const lines=cart.map(i=>{const p=products.find(x=>x.id===i.id);return `${i.qty} x ${p.name} – ${euro(p.price*i.qty)}`;}).join("\n");
  const total=euro(cart.reduce((s,i)=>s+products.find(p=>p.id===i.id).price*i.qty,0));
  const body=`Hallo Heiko,\n\nich möchte folgende Produkte anfragen:\n${lines}\n\nUnverbindliche Zwischensumme: ${total}\n\nName: ${fd.get("name")}\nE-Mail: ${fd.get("email")}\nLieferort / Hinweise: ${fd.get("notes")||"-"}\n\nBitte bestätige Verfügbarkeit, Versandkosten und den endgültigen Preis.\n\nViele Grüße`;
  if(STORE_EMAIL==="VUL-HIER-JEIN-EMAILADRESSE-IN"){alert("Bitte trage zuerst deine E-Mail-Adresse in script.js bei STORE_EMAIL ein. Deine Bestellanfrage wurde noch nicht versendet.");return;}
  window.location.href=`mailto:${STORE_EMAIL}?subject=${encodeURIComponent("Bestellanfrage – HJ 3D Creations")}&body=${encodeURIComponent(body)}`;
});
document.getElementById("contact-form").addEventListener("submit",e=>{e.preventDefault();const fd=new FormData(e.currentTarget);if(STORE_EMAIL==="VUL-HIER-JEIN-EMAILADRESSE-IN"){alert("Bitte trage zuerst deine E-Mail-Adresse in script.js bei STORE_EMAIL ein.");return;}const body=`Name: ${fd.get("name")}\nE-Mail: ${fd.get("email")}\n\n${fd.get("message")}`;window.location.href=`mailto:${STORE_EMAIL}?subject=${encodeURIComponent("Kontakt – HJ 3D Creations")}&body=${encodeURIComponent(body)}`;});
document.getElementById("year").textContent=new Date().getFullYear();
renderProducts();renderCart();
