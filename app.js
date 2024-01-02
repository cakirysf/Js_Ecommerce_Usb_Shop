//TODO: ÜRÜN STYLE ÖZELLİKLERİ
//global boş bir dizi tanımlama
let usbList =[],
    basketList =[]


//! toggle menu
  //toggleModal isimli error function oluşturma / onclick ile bi-x classı için uygulama
  const toggleModal = () => {
    const basketModal = document.querySelector(".basket__modal")
    /* console.log(basketModal) */
    /* active classı verdik basker__modal a */
    /* class a birşey ekleme veya çıkarma için aşağıdaki kodlar kullanılır */
    /* kullanılan yöntem toggle yöntemi */
    basketModal.classList.toggle("active")
    
  } 

  //fonksiyon içinde fetch ile istek then ile yakalamak için json dosyasını
  //eğer hata verirse de catch ile hatayı versin
  const getUsbs = () => {
    fetch("./products.json")
      /*  .then(res=>console.log(res.json()))
      .catch((err) => console.log(err)) */
      .then((res) => res.json())
      /* .then((usbs) => console.log(usbs)) // json dan gelen diziyi   alma */
      //gelen veriyi globalda tanımlanan usbList dizisine aktarma
      .then((usbs) => (usbList = usbs))
      .catch((err) => console.log(err)); 
  }
  getUsbs()

  /* YILDIZLARIN GÖSTERMİ İÇİN FONKİSYON TANIMLAAM */
  const createUsbStars =(starRate) => {
    /* console.log(starRate) */
    let starRateHtml = "";

    for (let i = 1; i <= 5; i++)
      if (Math.round(starRate) >= i) {
        starRateHtml += `<i class="bi bi-star-fill active"></i>`
      } else {
        starRateHtml += `<i class="bi bi-star-fill"></i>`
      }
      return starRateHtml /* return ile starRateHtml i fonksiyonun dışına aktardık */
  }

 //html oluşturma ve içerisine usb verilerini gönderme
 const createUsbItemsHtml = () => {
   //HTML kodlarını oluşturma
   const usbListElement = document.querySelector(".categories__right")
   /* console.log(usbListElement) */
    let usbListeHtml = "" // html bu değişkene atanacak

   //html alanlarını alma
   usbList.forEach((usb)=> {
    /* += kullanma sebebi aşağıda birden fazla veri aktarılacağı için */
    usbListeHtml +=` 
    <div class="category">
                   <div class="row usb__card"><img src="${usb.imgSource}" alt="" class="img__usb" width="260px" height="280px" ></div> 
                   <div class="usb__details"> 
                   <span>${usb.name}</span> <br/>
                    <span>${usb.brand}</span> <br/>
                    <span class="usb__star-rate">
                        
                    ${createUsbStars(usb.starRate)}

                    <br/>
                        <span class="gray">${usb.reviewCount} gösterim</span> 
                    </span><br/>
                </div>
                    <p class="usb__description">
                    ${usb.description}
                    </p><br/>
                    <div>
                        <span class="price">${usb.price} TL</span>
                        
                        <span class="old__price">${usb.oldPrice 
                          ? `<span class="old__price">${usb.oldPrice} TL</span>`
                          : ""}</span>

                    </div>
                    <button class="btn__siparisVer" onClick="addUsbToBasket(${usb.id})">Sepete Ekle</button>
                </div>
    `
   })
   usbListElement.innerHTML = usbListeHtml
 }

 const USB_TYPES = {
  ALL: "Tümü",
  TB1: "1 TB",
  GB512: "512 GB",
  GB256: "256 GB",
  GB128: "128 GB",
  GB64: "64 GB",
  GB32: "32 GB",
};

const createUsbTypesHtml = () => {
  const filterElement = document.querySelector(".filter")
  let filterHtml = ""
  // filter (Menü) türlerini tutacak dizi ALL türüyle başlatılmıştır
  let filterTypes = ["ALL"]

  usbList.forEach((usb) => {
    /* console.log(filterElement) */
    /* findindex metodunu bir dizi içinde belirli koşulu sağlayan bir veri var mı diye kullanırız. aşağıdaki -1 de all kısmı için kullanıldı*/
    if (filterTypes.findIndex((filter) => filter == usb.type) == -1){
      filterTypes.push(usb.type);
    }
  });
    filterTypes.forEach((type, index)=> {
      /* data-type kullanımı ve active classı tıklanana göre aktif etme*/
      filterHtml += ` <li onClick="filterUsbs(this)" data-types="${type}" class="${index == 0 ? "active" : null} 
      }">${USB_TYPES[type] || type}</li>`

    })
  
    filterElement.innerHTML = filterHtml
}; 
/* createUsbTypesHtml() */

  //MENÜYE TIKLANDIĞINDA TÜRÜNE GÖRE SIRALAMA 112. satıra verdik onclick olayını
  const filterUsbs = (filterElement) => {
    // console.log(filterElement);
    document.querySelector(".filter .active").classList.remove("active");
    filterElement.classList.add("active");
    let usbType = filterElement.dataset.types;
    console.log(usbType);
    getUsbs(); // yeniden istek atıyoruz listeler gelsin diye
    if (usbType != "ALL") {
      // console.log(usbType);
      usbList = usbList.filter((usb) => usb.type == usbType);
    }
    createUsbItemsHtml();
  };

  //sepete ürün ekleme fonksiyonu
  const listBasketItems = () => {
    const basketListElement = document.querySelector(".basket__list");
    /* console.log(basketListElement) */
    const basketCountElement = document.querySelector(".usb__count");
    /* console.log(basketCountElement) */
    /* basketCountElement.innerHTML = basketList.length > 0 ? basketList.length : null; */

    //sepet toplamını gösterme
    const totalQuantity = basketList.reduce(
      (total, item) => total + item.quantity, 
      0
      )
    basketCountElement.innerHTML = totalQuantity > 0 ? totalQuantity : null

    //toplam tutarı alma
    const totalPriceElement = document.querySelector(".total__price")  
    
    let basketListHtml = "";
    let totalPrice = 0;
    basketList.forEach((item) => {
      /* console.log(item) */
      totalPrice += item.product.price * item.quantity

      basketListHtml += `
                    <li class="basket__item">
                        <img src="${item.product.imgSource}" alt="" width="100" height="100" />
                        <div class="basket__item-info">
                            <h3 class="usb__name">${item.product.name}</h3>
                            <span class="usb__price">${item.product.price}</span> <br/>
                            <span class="usb__remove" onClick="removeItemBasket(${item.product.id})">Sepetten Kaldır</span>
                        </div>
                        <div class="usb__count">
                            <span class="decrease" onClick="decreaseItemToBasket(${item.product.id})">-</span>
                            <span class="mx_2">${item.quantity}</span>
                            <span class="increase"  onClick="increaseItemToBasket(${item.product.id})">+</span>
                        </div>
                    </li>            
      `;
    });
    basketListElement.innerHTML = basketListHtml ? basketListHtml : 
     `<li class="basket__item">Sepette herhangi bir ürün bulunmuyor. Sepete ürün ekleyiniz</li>`
    totalPriceElement.innerHTML = totalPrice > 0 ? "Total: " + totalPrice + "TL" : null
  };
//sepete ürün ekleme
const addUsbToBasket= (usbId) =>{
  /* console.log("id:", usbId) */
  let findedUsb = usbList.find((usb)=>usb.id == usbId)
  /* console.log(findedUsb) */
  /* diziye ekleme */
  if (findedUsb){
    //sepetteki ürünün zaten var olup olmadığını kontrol etme
    const basketAlreadyIndex =  basketList.findIndex(
      (basket) => basket.product.id == usbId )
      //eğer sepet boşsa veya eklenen kitap sepette yoksa
    if(basketAlreadyIndex == -1){
      let addItem = {quantity: 1, product : findedUsb}
      basketList.push(addItem)
     
    } else {
      //spette zaten var olan bir kitap ekleniyorsa, miktarını artır
     /*  basketList[basketAlreadyIndex].quantity */
      basketList[basketAlreadyIndex].quantity += 1
    }
  }
  //onayla butonunu başlangıçta kaldırdık şimdi ürün eklenince aktif edeceğiz
  const btnCheck = document.querySelector(".btnCheck")
  btnCheck.style.display = "block" 

  // sepet içeriğini güncelle ve görüntüle yenile
  listBasketItems()

}


//sepetten ürünü kaldırma 
const removeItemBasket = (usbId) => {
  /* console.log(usbId) */
  const findedIndex = basketList.findIndex((basket)=> basket.product.id == usbId)
//eğer ürün sepet içinde bulunuyorsa sepet listesinden ürünü çıkar
  if(findedIndex != -1) {
   //splice ı belirli sayıda eleman silmek için kullandık
    basketList.splice(findedIndex, 1)
} 
const btnCheck = document.querySelector(".btnCheck")
btnCheck.style.display = "none" 

  //sepet içeriğini günceller
listBasketItems()
}
 
// sepetteki ürünün miktarını azaltma
const decreaseItemToBasket = (usbId) =>{
  const findedIndex = basketList.findIndex(
    (basket) => basket.product.id == usbId)
  // eğer ürün sepet içinde bulunuyorsa  
  if (findedIndex != -1) {
    //eğer ürün miktari 1 den büyükse
    if(basketList[findedIndex].quantity != 1) {
      basketList[findedIndex].quantity -= 1
    } else {
      removeItemBasket(usbId)
    }
  }
  
  //sepet içeriğini güncelleme
  listBasketItems()
}

//sepetteki ürünün miktarını artırma
const increaseItemToBasket = (usbId) => {
  const findedIndex = basketList.findIndex(
    (basket) => basket.product.id == usbId)
    // eğer ürün sepet içinde bulunuyorsa
    if (findedIndex != -1) {
      // ürün miktarını artırma
       basketList[findedIndex].quantity += 1 
    }
    //sepet içeriğini güncelleme
    listBasketItems()
}

 /* direk cevap gelmediği için bekletme veriyoruz datanın gelmesi için 1 sn */
 setTimeout(()=>{
  createUsbItemsHtml()
  createUsbTypesHtml()
 },100)
 