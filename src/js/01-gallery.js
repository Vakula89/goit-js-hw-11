// Add imports above this line
// Описаний в документації
import SimpleLightbox from "simplelightbox";
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";
import { galleryItems } from './gallery-items';
// Change code below this line

console.log(galleryItems);

class Gallery {
    #imgs;
    #lightbox; 

    constructor(galleryItems) {
        const galleryElem = document.querySelector(".gallery");
        this.imgs = [];
        this.instance = null;
        this.keyListener = (ev) => {
            ev.preventDefault();
            if(ev.code === "Escape" && this.instance){
                this.instance.close();
            }
        };

        galleryItems.forEach((el) => {
            const img = document.createElement("IMG");
            const linkElem = document.createElement("A");
            
            linkElem.classList.add('gallery__item');
            linkElem.setAttribute("href", el.original)
        
            img.classList.add("gallery__image");
            img.setAttribute('src', el.preview);
            img.setAttribute('alt', el.description);
            
            linkElem.append(img);
            this.imgs.push(linkElem);
        });
        
        galleryElem.append(...this.imgs);

        this.lightbox = new SimpleLightbox('.gallery__item', { 
            captions: true,
            captionSelector: 'img',
            captionType: 'attr',
            captionsData: 'alt',
            captionPosition: 'bottom',
            captionDelay: 250
         });
        
    }
};

new Gallery(galleryItems);
